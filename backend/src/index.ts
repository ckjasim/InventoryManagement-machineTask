
import mongoose from 'mongoose'
import 'dotenv/config'
import {app} from './app'
const port = 3000

const start = async()=>{
    if(!process.env.JWT_KEY){
        throw new Error('jwt key not found')
    }
    try {
        await mongoose.connect(process.env.MONGO_URI as string)
        console.log('conneted to mongodb')
    } catch (error) {
        console.error(error)
    }
    app.listen(port,()=>console.log('the server is running on 3000!!!'))
}
start()