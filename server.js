const pug = require("pug");
const express = require('express');
const session = require('express-session');
//const mongo = require('mongodb');
const mongoose = require("mongoose");
//const MongoDBStore = require('connect-mongo');
const MongoDBStore = require('connect-mongodb-session')(session);
const ObjectId = require('mongoose').Types.ObjectId
const User = require("./UserModel");
const Item = require("./ItemModel");
const Warehouse = require("./WarehouseModel");

const app = express();
const PORT = process.env.PORT || 3000;
const path = require('path');

const store = new MongoDBStore({
    mongoUrl: 'mongodb://localhost:27017/eztrack',
    collection: 'sessions'
});
store.on('error', (error) => { console.log(error) });

app.set(path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
// Use the session middleware
app.use(session({ secret: 'some secret here', store: store }))

app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
    console.log(`${req.method}: ${req.url}`);
    if (Object.keys(req.body).length > 0) {
        console.log('Body:');
        console.log(req.body);
    }
    next();
})

app.use(exposeSession);
app.get("/", displayHomePage);
//app.get("/users", getUsers);
//app.get("/users/:uid", sendSingleUser);
//app.post("/profile/:uid", updateUserPrivacy);
app.post("/login", login);
app.get("/logout", logout);
app.get("/register", displayRegisterPage);
app.post("/register", register);
//app.get("/profile/:uid", auth, displayProfilePage);
//app.get("/orderForm/:uid", auth, displayOrderPage);
app.post("/addWarehouse/", addWarehouse);
app.get("/warehouses/", displayWhPage);
app.post("/createItem/", createItem);
app.get("/inventory/", displayInvPage);
app.get("/item/:uid", editItemPage);
app.post("/editItem/:uid", editItem);
app.post("/deleteItem/:uid", deleteItem);
app.get("/warehouse/:uid", editWhPage);
app.post("/editWarehouse/:uid", editWarehouse);
app.post("/deleteWarehouse/:uid", deleteWarehouse);

function deleteWarehouse(req, res, next) {
    const targetId = req.params.uid;

    Warehouse.findOne({_id: targetId}, async function (err, result){       

        if (!err) {
            try {
                await result.remove();

                mongoose.connection.db.collection("warehouses").find().toArray(function (err, result) {
                    if (err) {
                        res.status(500).send("Error reading database.");
                        return;
                    }
                    if (!result) {
                        res.status(404).send("Error");
                        return;
                    }

                    res.setHeader('Content-Type', 'text/html');
                    res.status(200).render("pages/warehouses.pug", { warehouses: result, session: req.session });
                });
                return true;
            }
            catch(exception) {
                return false;
            }
        }           
        else {
            res.status(500).send("Item cannot be deleted.");
            return;
        }
    });
}

function editWarehouse(req, res, next) {
    const targetId = req.params.uid;
    const { whsName, whsLocation, whsCode, whsCapacity} = req.body;

    let whUpdate = {};
    whUpdate["name"] = whsName;
    whUpdate["location"] = whsLocation;
    whUpdate["code"] = whsCode;
    whUpdate["capacity"] = whsCapacity;
    whUpdate["modifier"] = req.session.username;
    console.log("update warehouse: " + whUpdate);

    Warehouse.findByIdAndUpdate(targetId, whUpdate, function (err, result) {
        if (err) {
            res.status(500).send("Error updating warehouse.");
            return;
        }
        if (!result) {
            res.status(404).send("No warehouse exist with given ID.");
            return;
        }
        Warehouse.findById(targetId, function (err, result) {
            if (err) {
                response.status(404).send(`Warehouse with ID ${targetId} does not exist.`);
            }
            
            let wh = result;
            let parameters = {};
            parameters["warehouse"] = wh.name;

            mongoose.connection.db.collection("items").find(parameters).toArray(function (err, result) {
                if (err) {
                    res.status(500).send("Error reading database.");
                    return;
                }
                if (!result) {
                    res.status(404).send("Error");
                    return;
                }
    
                res.setHeader('Content-Type', 'text/html');
                res.status(200).render("pages/warehouse.pug", { warehouse: wh, items: result, session: req.session, message:"Warehouse has been updated!"  });
            });
        });
    })
}

function editWhPage(req, res, next) {

    const targetId = req.params.uid;
    let oid;

    try {
        oid = new ObjectId(targetId);
    } catch {
        response.status(404).send("Unknown ID");
        return;
    }

    Warehouse.findById(targetId, function (err, result) {
        if (err) {
            response.status(404).send(`Item with ID ${targetId} does not exist.`);
        }
        let wh = result;
        let parameters = {};
        parameters["warehouse"] = wh.name;

        mongoose.connection.db.collection("items").find(parameters).toArray(function (err, result) {
            if (err) {
                res.status(500).send("Error reading database.");
                return;
            }
            if (!result) {
                res.status(404).send("Error");
                return;
            }

            res.setHeader('Content-Type', 'text/html');
            res.status(200).render("pages/warehouse.pug", { warehouse: wh, items: result, session: req.session });
        });
    });
}

function deleteItem(req, res, next) {
    const targetId = req.params.uid;

    Item.findOne({_id: targetId}, async function (err, result){       

        if (!err) {
            try {
                await result.remove();
                mongoose.connection.db.collection("items").find().toArray(function (err, result) {
                    if (err) {
                        res.status(500).send("Error reading database.");
                        return;
                    }
                    if (!result) {
                        res.status(404).send("Error");
                        return;
                    }
                    let items = result;
                    res.setHeader('Content-Type', 'text/html');
                    res.status(200).render("pages/inventory.pug", { items: items, session: req.session });
                });
                return true;
            }
            catch(exception) {
                return false;
            }
        }           
        else {
            res.status(500).send("Item cannot be deleted.");
            return;
        }
    });
}

function editItem(req, res, next) {
    const targetId = req.params.uid;
    const { itemName, itemLocation, itemSKU, itemQty, itemCategory } = req.body;
    console.log("request body: " + itemName + " " + itemLocation + " " + itemSKU);

    let itemUpdate = {};
    itemUpdate["name"] = itemName;
    itemUpdate["warehouse"] = itemLocation;
    itemUpdate["sku"] = itemSKU;
    itemUpdate["quantity"] = itemQty;
    itemUpdate["category"] = itemCategory;
    itemUpdate["modifier"] = req.session.username;
    console.log("update item: " + itemUpdate);


    Item.findByIdAndUpdate(targetId, itemUpdate, function (err, result) {
        if (err) {
            res.status(500).send("Item already exists in the given warehouse. Please go back.");
            return;
        }
        if (!result) {
            res.status(404).send("No item exist with given ID.");
            return;
        }

        Item.findById(targetId, function (err, result) {
            if (err) {
                response.status(404).send(`Item with ID ${targetId} does not exist.`);
            }
            let item = result;

            let parameters = {};
            parameters["name"] = result.name;

            mongoose.connection.db.collection("items").find(parameters).toArray(function (err, result) {
                if (err) {
                    res.status(500).send("Error reading database.");
                    return;
                }
                if (!result) {
                    res.status(404).send("Error");
                    return;
                }

                let warehouses = [];

                result.forEach(item => {
                    warehouses.push(item.warehouse);
                });

                mongoose.connection.db.collection("warehouses").find({ 'name': { $in: warehouses } }).toArray(function (err, result) {
                    if (err) {
                        res.status(500).send("Error reading database.");
                        return;
                    }
                    if (!result) {
                        res.status(404).send("Error");
                        return;
                    }
                    let whs = result;
                    
                    Warehouse.findOne({name: itemLocation}, function (err, result){ 
                        console.log("find the warehouse: " + result);
                        if (!result){
                            res.status(200).render("pages/item.pug", { item: item, warehouses: whs, session: req.session, errormessage: "Warehouse does not exist yet. Please create the warehouse first." });
                            return;
                        }
                    });                  

                    console.log("warehouses found: " + result);

                    res.setHeader('Content-Type', 'text/html');
                    res.status(200).render("pages/item.pug", { item: item, warehouses: whs, session: req.session, message:"Item has been updated!" });
                });
            });
        });
    })
}

function editItemPage(req, res, next) {

    const targetId = req.params.uid;
    let oid;

    try {
        oid = new ObjectId(targetId);
    } catch {
        response.status(404).send("Unknown ID");
        return;
    }

    Item.findById(targetId, function (err, result) {
        if (err) {
            response.status(404).send(`Item with ID ${targetId} does not exist.`);
        }
        let item = result;
        let parameters = {};
        parameters["name"] = result.name;

        mongoose.connection.db.collection("items").find(parameters).toArray(function (err, result) {
            if (err) {
                res.status(500).send("Error reading database.");
                return;
            }
            if (!result) {
                res.status(404).send("Error");
                return;
            }

            let warehouses = [];

            result.forEach(item => {
                warehouses.push(item.warehouse);
            });

            mongoose.connection.db.collection("warehouses").find({ 'name': { $in: warehouses } }).toArray(function (err, result) {
                if (err) {
                    res.status(500).send("Error reading database.");
                    return;
                }
                if (!result) {
                    res.status(404).send("Error");
                    return;
                }

                console.log("warehouses found: " + result);

                res.setHeader('Content-Type', 'text/html');
                res.status(200).render("pages/item.pug", { item: item, warehouses: result, session: req.session });
            });

        });
    });
}

function displayInvPage(req, res, next) {

    mongoose.connection.db.collection("items").find().toArray(function (err, result) {
        if (err) {
            res.status(500).send("Error reading database.");
            return;
        }
        if (!result) {
            res.status(404).send("Error");
            return;
        }
        let items = result;
        //console.log(user);
        res.setHeader('Content-Type', 'text/html');
        res.status(200).render("pages/inventory.pug", { items: items, session: req.session });
    });

}

function createItem(req, res, next) {

    mongoose.connection.db.collection("items").find().toArray(async function (err, result) {
        if (err) {
            res.status(500).send("Error reading database.");
            return;
        }
        if (!result) {
            res.status(404).send("Error");
            return;
        }

        req.session.loggedin = true;
        let itemModifier = req.session.username;

        let items = result;

        const { itemName, itemLocation, itemSKU, itemQty, itemCategory } = req.body;
        let item = new Item();
        item.name = itemName;
        item.warehouse = itemLocation;
        item.sku = itemSKU;
        item.quantity = itemQty;
        item.category = itemCategory;
        item.modifier = itemModifier;
        
        Warehouse.findOne({name: itemLocation}, async function (err, result){ 
            console.log("find the warehouse: " +result);
            if (!result){
                res.status(200).render("pages/inventory.pug", { items: items, session: req.session, errormessage: "Warehouse does not exist yet. Please create the warehouse first." });
                return;
            }
            try {         

                console.log(item);
    
                console.log('before save');
                let saveItem = await item.save(); //when fail its goes to catch
                console.log(saveItem); //when success it print.
                console.log('after save');
                mongoose.connection.db.collection("items").find().toArray(function (err, result) {
                    console.log("gethere");
                    res.setHeader('Content-Type', 'text/html');
                    res.status(200).render("pages/inventory.pug", { items: result, session: req.session });
                });
            } catch (err) {
                console.log('err: ' + err);
                res.status(200).render("pages/inventory.pug", { items: items, session: req.session, errormessage: "Item with same info already exists." });
            }
        });        
    });
}

function displayWhPage(req, res, next) {

    mongoose.connection.db.collection("warehouses").find().toArray(function (err, result) {
        if (err) {
            res.status(500).send("Error reading database.");
            return;
        }
        if (!result) {
            res.status(404).send("Error");
            return;
        }
        let warehouses = result;
        //console.log(user);
        res.setHeader('Content-Type', 'text/html');
        res.status(200).render("pages/warehouses.pug", { warehouses: warehouses, session: req.session });
    });
}

function addWarehouse(req, res, next) {

    mongoose.connection.db.collection("warehouses").find().toArray(async function (err, result) {
        if (err) {
            res.status(500).send("Error reading database.");
            return;
        }
        if (!result) {
            res.status(404).send("Error");
            return;
        }

        req.session.loggedin = true;
        let whsCreator = req.session.username;

        let warehouses = result;

        try {
            const { whsName, whsLocation, whsCode, whsCapacity } = req.body;
            let wh = new Warehouse();
            wh.name = whsName;
            wh.location = whsLocation;
            wh.code = whsCode;
            wh.capacity = whsCapacity;
            wh.occupied = 0;
            wh.modifier = whsCreator;

            console.log(wh);

            console.log('before save');
            let saveWarehouse = await wh.save(); //when fail its goes to catch
            console.log(saveWarehouse); //when success it print.
            console.log('after save');
            mongoose.connection.db.collection("warehouses").find().toArray(function (err, result) {
                console.log("gethere");
                res.setHeader('Content-Type', 'text/html');
                res.status(200).render("pages/warehouses.pug", { warehouses: result, session: req.session });
            });
        } catch (err) {
            console.log('err: ' + err);
            res.status(200).render("pages/warehouses.pug", { warehouses: warehouses, session: req.session, errormessage: "Warehouse with same info already exists." });;
        }
    });
}


function exposeSession(req, res, next) {
    if (req.session) res.locals.session = req.session;
    next();
}

//authentication regarding user...
function auth(req, res, next) {
    if (!req.session.loggedin) {
        res.status(401).send("Unauthorized");
        return;
    }
    next();
};

//Start adding route handlers here
function displayHomePage(req, res, next) {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/html");
    res.send(pug.renderFile("./views/pages/home.pug"));
}


//If the username and password match somebody in our database,
// then create a new session ID and save it in the database.
//That session ID will be associated with the requesting user
function login(req, res, next) {
    // if (req.session.loggedin) {
    //     res.status(200).send(pug.renderFile("./views/pages/loginStatus.pug",  {message:"Already logged in!"}));
    //     return;
    // }

    const { username, password } = req.body;

    console.log("Logging in with credentials:");
    console.log("Username: " + username);
    console.log("Password: " + password);

    User.findOne({ username: username }, function (err, result) {
        console.log("Find people named " + username);
        console.log(result);
        if (!result) {
            res.status(401).send(pug.renderFile("./views/pages/loginStatus.pug", { message: "User does not exist!" }));
            return;
        }

        if (result.password === password) {
            console.log("right password");
            req.session.loggedin = true;

            //We set the username associated with this session
            //On future requests, we KNOW who the user is
            //We can look up their information specifically
            //We can authorize based on who they are
            req.session.username = username;
            req.session.userID = result._id;
            req.session.privacy = result.privacy;

            res.status(200).send(pug.renderFile("./views/pages/loggedIn.pug", { user: result, session: req.session }));
            return;
        } else {
            res.status(401).send(pug.renderFile("./views/pages/loginStatus.pug", { message: "Password is incorrect!" }));
            return;
        }
    });

}

function logout(req, res, next) {
    if (req.session.loggedin) {
        req.session.destroy();
        res.status(200).send(pug.renderFile("./views/pages/loginStatus.pug", { message: "You have now logged out!" }));
        return;
    } else {
        res.status(200).send(pug.renderFile("./views/pages/loginStatus.pug", { message: "You aren't logged in!" }));
    }
}

function displayRegisterPage(req, res, next) {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/html");
    res.send(pug.renderFile("./views/pages/register.pug", { errormessage: false }));
}

function register(req, res, next) {
    //req.user.submissions.push(req._id);
    const { username, password } = req.body;
    //console.log(req.body);
    let u = new User();
    u.username = username;
    u.password = password;
    u.privacy = false;

    u.save(function (err, result) {
        if (err) return res.render('pages/register.pug', { errormessage: 'User name is taken. Please use another user name.' });
        //check if user already exist using user name
        //if (username exist) res.status(500).send('User name is taken. Please use another user name');

        req.session.loggedin = true;
        req.session.username = username;

        res.status(200).send(pug.renderFile("./views/pages/loggedIn.pug", { user: u, session: req.session }));
    });
}

mongoose.connect('mongodb://localhost:27017/eztrack', { useNewUrlParser: true, useUnifiedTopology: true });

let db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    app.listen(PORT);
    console.log("Server listening on port 3000");
    //app.listen(PORT, ()=> console.log(`Server listening on port ${PORT}`));
});
