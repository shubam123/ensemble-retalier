var mongoose = require('mongoose');

var Order = mongoose.model('order', {

  // customer:{
  //   name: {
  //     type: String,
  //     required: true
  //   },
  //   phone: {
  //     type: Number,
  //     required:true
  //   },
  //   email: {
  //     type: String
  //   },
  //   address: {
  //     type:String,
  //     required:true
  //   }
  // },


  // invoice:{
  //   cost: {
  //     type: Number,
  //     required: true
  //   },
  //   products: {
  //     type: Array,
  //     required: true
  //   }
  // },

  customer:{
    type: Array,
  },
  retailer:{
    type: Array
  },
  invoice:{
    type: Array
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
