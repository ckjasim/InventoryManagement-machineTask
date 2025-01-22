import {model,Model,Document,Schema} from 'mongoose';
import { Password } from '../service/password';


interface UserAttrs {
 
    email:string,
    password:string,
}

interface UserModel extends Model<UserDoc>{
    build(attrs:UserAttrs):UserDoc;
}

interface UserDoc extends Document{
    email:string,
    password:string,
}

const userScheema = new Schema({
  
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    }
},{toJSON:{
    transform(doc,ret){
        ret.id=ret._id;
        delete ret._id;
        delete ret.password;
        delete ret.__v
    }
}});

userScheema.pre('save',async function (done){
    if(this.isModified('password')){
        const hashed = await Password.toHash(this.get('password'));
        this.set('password',hashed);
    }
    done()
})

userScheema.statics.build = (attrs:UserAttrs)=>{
    return new User(attrs)
}

const User = model<UserDoc,UserModel>('User',userScheema)
export { User };