import { CartItem } from "./cartitems";

export interface Order {
    _id?:String;
    items: CartItem[],
    paymentType: String,
    address: any,
    date: Date,
   
    status?:String,
    cancellationReason?: string,
}