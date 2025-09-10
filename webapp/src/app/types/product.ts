export interface Product{
    _id?:String;
    name:String,
    shotDescription:String,
    description:String,
    Price:Number,
    discount:Number,
    images:String[],
    categoryId:String,
    isFeatured:Boolean;
    isNew:Boolean;

}