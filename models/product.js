var mongoose = require('mongoose');

var ProductSchema = new mongoose.Schema({
  title: {
    type: String,
    unique: true,
    required: true,
    minlength: 5,
    maxlength: 20
  },
  price: {
    type: Number,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category"
  }
});


var Product = mongoose.model('Product', ProductSchema);
module.exports = Product;
