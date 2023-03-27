
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