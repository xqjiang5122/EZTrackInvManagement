Created by: Xiangqiu Jiang

Requirements met:

Basic CRUD Functionality. The webpage allows user to:
  - Create inventory items
  - Edit Them
  - Delete Them
  - View a list of them

Feature implemented:
  - Ability to create warehouses/locations and assign inventory to specific locations


Instruction: - enter in the terminal: npm run db-init
             - enter in the terminal: npm run dev

Supported route:

app.use(exposeSession);
app.get("/", displayHomePage);
app.post("/login", login);
app.get("/logout", logout);
app.get("/register", displayRegisterPage);
app.post("/register", register);
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

Page details:

- Navigation header
    - To be included in all pages (pug)
    - Changes depending on current session state (login vs. logout)
        - Client is logged in?  -> Home / Inventory / Warehouse / Logout
        - Pre-registered admin account: 
          username: admin
          password: admin
        - Client is not logged? -> Home / Register
- User Registration
    - Provide a registration form, user should provide username and password to 
- Inventory summary page
    - Provides a form for user to create a new item
    - User need to create a warehouse first before assigning an item to that warehouse
    - Item name and SKU are unique combination
    - Item name and location are unique combination
    - Listed all items being created, each item is linked to it's detail page
- Inventory detail page
    - Allows the user to modify the information for the selected item
    - Listed all warehouses that stores the item
- Warehouse summary page
    - Provides a form for user to create a new warehouse
    - Warehouse name, location and code should be unique
    - Listed all warehouses being created, each warehouse is linked to it's detail page
- Warehouse detail page
    - Allows the user to modify the information for the selected warehouse
    - Listed all items stored in the selected warehouse

Requirements met:
Basic CRUD Functionality. The webpage allows user to:
  - Create inventory items
  - Edit Them
  - Delete Them
  - View a list of them

Feature implemented:
  - Ability to create warehouses/locations and assign inventory to specific locations
