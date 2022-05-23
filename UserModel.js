const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let userSchema = Schema({
    username:{
        type:String,
        required:true,
        unique: true,
        minlength: 1,
		maxlength: 30,
		match: /[A-Za-z]+/,
		trim: true
    },
    password:{
        type:String,
        required:true,
        minlength: 1,
		maxlength: 30
    },
    privacy:{
        type:Boolean
    }
});

module.exports = mongoose.model("User", userSchema);