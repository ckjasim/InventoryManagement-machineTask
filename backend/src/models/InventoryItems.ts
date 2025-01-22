import { Document, Model, model, Schema } from "mongoose";

interface ItemAttrs {
 
    name:string;
    description:string;
    stock:number;
    price:number;
    isBlock?:boolean;
}

interface ItemModel extends Model<ItemDoc>{
    build(attrs:ItemAttrs):ItemDoc;
}

interface ItemDoc extends Document{
    name:string;
    description:string;
    stock:number;
    price:number;
    isBlock?:boolean;
}

const ItemSchema = new Schema({
    name:{type:String,requred:true},
    description:{type:String,requred:true},
    stock:{type:Number,required:true},
    price:{type:Number,required:true},
    isBlock:{type:Boolean,required:true,default:false}
},{toJSON:{
    transform(doc,ret){
        ret.id=ret._id;
        delete ret._id;
        delete ret.__v;
    }
}})

ItemSchema.statics.build = (attrs:ItemAttrs)=>{
    return new Item(attrs)
}

const Item = model<ItemDoc,ItemModel>('InventoryItems',ItemSchema);
export {Item}