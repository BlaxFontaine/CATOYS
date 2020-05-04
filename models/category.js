var mongoose = require('mongoose');

var CategorySchema = new mongoose.Schema({
  title: {
    type: String,
    unique: true,
    required: true,
    minlength: 5,
    maxlength: 20
  }
});


var Category = mongoose.model('Category', CategorySchema);
module.exports = Category;
