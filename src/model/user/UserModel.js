
import clientPromise from "../../config/dbConfig.js";
import UserSchema from "./UserSchema.js";

export const createNewUser = (obj) =>{
    return UserSchema(obj).save();
}

export const getAllUser = ()=>{
    return UserSchema.findOne();
    
}

export const findUser = (filter)=>{
    return UserSchema.findOne(filter);
}

export const getUser = async() =>{
   const db = await clientPromise.db("admin_users")

   return await db.find()
}