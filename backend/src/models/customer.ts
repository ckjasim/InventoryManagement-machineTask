import {model,Model,Document,Schema, ObjectId} from 'mongoose';



interface CustomerAttrs {
 name:string;
 userId:string
 email:string;
}

interface CustomerModel extends Model<CustomerDoc>{
    build(attrs:CustomerAttrs):CustomerDoc;
}

interface CustomerDoc extends Document{
    name:string
    userId:string
    email:string
}

const customerScheema = new Schema({
   userId:{requred:true,type:Schema.ObjectId,ref:"User"},
   name:{type:String,required:true},
   email:{type:String,required:true}
},{toJSON:{
    transform(doc,ret){
        ret.id=ret._id;
        delete ret._id;
        delete ret.__v
    }
}});



customerScheema.statics.build = (attrs:CustomerAttrs)=>{
    return new Customer(attrs)
}

const Customer = model<CustomerDoc,CustomerModel>('Customer',customerScheema)
export { Customer };