const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let itemSchema = Schema({
    name:{
        type:String,
        required:true,
        minlength: 1,
		maxlength: 30,
		match: /[A-Za-z]+/,
		trim: true
    },
    warehouse:{
        type:String,
        required:true,
        minlength: 1,
		maxlength: 30,
		match: /[A-Za-z]+/,
		trim: true
    },
    sku:{
        type:String,
        required:true,
        minlength: 1,
		maxlength: 12
    },
    quantity:{
        type:Number,
        required:true
    },
    category:{
        type:String,
        required:true,
        minlength: 1,
		maxlength: 15
    },
    modifier:{
        type:String,
        required:true,
        minlength: 1,
		maxlength: 30,
		match: /[A-Za-z]+/,
		trim: true
    }

});

itemSchema.index({'name': 1, 'warehouse': 1}, {unique: true});
//itemSchema.index({'name': 1, 'sku': 1}, {unique: true});

module.exports = mongoose.model("Item", itemSchema);