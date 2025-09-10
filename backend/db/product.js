const mongoose=require("mongoose");
const{Schema}=mongoose;
const productSchema=new mongoose.Schema({
    name:String,
    shotDescription:String,
    description:String,
    Price:Number,
    discount:Number,
    images:Array(String),
    categoryId:{ type: Schema.Types.ObjectId, ref: 'categories' },
    brandId:{ type: Schema.Types.ObjectId, ref: 'brands' },

    isFeatured:Boolean,
    isNewProduct:Boolean,
    
    // Review related fields
    averageRating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    totalReviews: {
        type: Number,
        default: 0
    }

});
const Product=mongoose.model("products",productSchema);
module.exports=Product;