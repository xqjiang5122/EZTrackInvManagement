const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let warehouseSchema = Schema({
    name:{
        type:String,
        required:true,
        unique: true,
        minlength: 1,
		maxlength: 30,
		match: /[A-Za-z]+/,
		trim: true
    },
    location:{
        type:String,
        required:true,
        unique: true,
        minlength: 1,
		maxlength: 60,
		match: /[A-Za-z]+/,
		trim: true
    },
    code:{
        type:String,
        required:true,
        unique: true,
        minlength: 1,
		maxlength: 3
    },
    capacity:{
        type:Number,
        required:true
    },
    occupied:{
        type:Number,
        required:true
    }

});

module.exports = mongoose.model("Warehouse", warehouseSchema);