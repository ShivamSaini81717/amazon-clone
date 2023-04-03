const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    id:{
        type:String,
    },
    shortTitle:{
        type:String,
        trim:true,
    },
    longTitle:{
        type:String,
        trim:true,
    },
    mrp:{
        type:Number,
    },
    cost:{
        type:Number,   
    },
    discount:{
        type:Number,
    },
    description:{
        type:String,
        trim:true,
    },
    ratings:{
        type: Number,
        default: 0,  
    },
    detaislUrl:{
 type:String,
    },
 url: {
            type: String,  
     },
      category: {
        type: String,
     
      },
      Stock: {
        type: Number,
        default: 1,
      },
      numOfReviews: {
        type: Number,
        default: 0,
      },
      reviews:[
        {
          user:{
            type:mongoose.Schema.ObjectId,
            ref:"User",
           
          },
        
          name:{
            type:String,
         
    
          },
          rating:{
            type:String,
        
          },
          comment:{
            type:String,
         
          },
    
        },
      ],
      createdAt: {
        type: Date,
        default: Date.now,
      },
      discountS:{
  type:String,

      },
      tagline:{
        type:String,
      },

    }
);

const Products = new mongoose.model("products",productSchema);

module.exports = Products;