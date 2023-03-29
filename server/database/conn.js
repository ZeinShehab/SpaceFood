import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

async function connect(){

    const mongod = await MongoMemoryServer.create();

    mongoose.set('strictQuery', true)
    // const db = await mongoose.connect(getUri);
    const db = await mongoose.connect('mongodb+srv://Raed_Fidawi:SpaceFood271Project@cluster0.zhyvafk.mongodb.net/?retryWrites=true&w=majority');
    console.log("Database Connected")
    return db;
}

export default connect;