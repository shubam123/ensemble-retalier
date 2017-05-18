var mongoose = require('mongoose');

var Order = mongoose.model('order', {

  customer:{
    name: {
      type: String,
      required: true
    },
    pno: {
      type: Number,
      required:true
    },
    pno_alt: {
      type: Number
    },
    email: {
      type: String
    },
    address: {
      type:String,
      required:true
    }
  },


  invoice:{
    tot_cost: {
      type: Number,
      required: true
    },
    prods: {
      type: Array,
      required: true
    }
  },

  retailer:{
      _id: {
        type: String
      },
      shop_reg_id:{
        type: String
      },
      shop_address:{
        type: String
      },
      sales_rep_id:{
        type:String
      },
      phone:{
        type:Number
      },
      home_address:{
        type:String
      },
      email:{
        type:String
      },
      adhaar_id:{
        type:String
      }
  },




  // customer:{
  //   type: Array,
  // },
  // retailer:{
  //   type: Array
  // },
  // invoice:{
  //   type: Array
  // },
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
