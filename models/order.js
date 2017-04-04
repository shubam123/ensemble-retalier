var mongoose = require('mongoose');

var Order = mongoose.model('order', {

  customer:{
    name: {
      type: String,
      required: true
    },
    phone: {
      type: Number,
      required:true
    },
    email: {
      type: String
    },
    address: {
      type:String,
      required:true
    }
  },
  retailer_id: {
      type: String,
      required: true
  },
  placedAt: {
    type: String,
    default: null
  },
  status: {
    type: String,
    default: "placed"
  }
});

module.exports = {Order};
