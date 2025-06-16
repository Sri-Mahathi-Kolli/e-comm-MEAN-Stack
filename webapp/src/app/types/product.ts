export interface Product {
    _id?: String;
    name:String;
    shortDescription:String;
    description:String;
    Price:Number;
    discount:Number;
    images:String[];
    categoryId: String;
    isFeatured:Boolean;
    isNew:Boolean;
}