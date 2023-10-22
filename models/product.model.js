const mongoose = require('mongoose');
const { Schema } = mongoose;

const product = new Schema({
  restaurant: {type: String, required: true},
  product: {type: String, required: true},
  description: {type: String, required: true},
  price: {type: Number, required: true},
  image: {type: String},
  rating: {type: Number}
});

module.exports = mongoose.model('Product', product);


