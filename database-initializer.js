const mongoose = require("mongoose");
const User = require("./UserModel");

let userNames = ["admin"];
let users = [];

userNames.forEach(name =>{
	let u = new User();
	u.username = name;
	u.password = name;
	u.privacy = false;
	users.push(u);
});

mongoose.connect('mongodb://localhost:27017/eztrack', {useNewUrlParser: true});
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
	mongoose.connection.db.dropDatabase(function(err, result){
		if(err){
			console.log("Error dropping database:");
			console.log(err);
			return;
		}
		console.log("Dropped database. Starting re-creation.");

		let completedUsers = 0;
		users.forEach(user => {
			user.save(function (err, result) {
				if (err) throw err;
				completedUsers++;
				if (completedUsers >= users.length) {
					console.log("All users saved.");
					console.log("Finished.");
					process.exit();
				}
			})
		});
	});
});