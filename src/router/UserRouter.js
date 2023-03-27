import express from 'express'
import { createNewUser, findUser } from '../model/user/UserModel.js';
import{comparePassword, hashPassword } from '../utils/bcrypt.js'

const router= express.Router();

//Register page

router.post("/register", async(req, res, next)=>{
    try {
req.body.password = hashPassword(req.body.password)
        
const result = await createNewUser(req.body)
if(result?._id){
    res.json({
        status:"success",
        message: "User information has been registered"
    })
    return
}
    res.json({
        status: "error",
        message:"Error, Unable to create a new user has been registered",
    })
    } catch (error) {
        if (error.message.includes("E11000 duplicate key error collection")){
            error.message =
        "There is already account exist associated with this email";
      error.errorCode = 200;
        }
        
        next(error)
    }
})

//Login page

router.post("/login",async (req, res, next)=>{
    try {
        const { email, password} = req.body;
    const user = await findUser({email})

    if(user?._id){
    const isPassMatch = comparePassword(password, user.password);
    if(isPassMatch){
        user.password = undefined;
        user.__v = undefined
                res.json({
                status:"success" ,
                message:"login sucessfully",
                user,
            });
            return
        }
    }
    res.json({
        status:"error",
        message:"Invalid login unsucessfully",
    })
        
    } catch (error) {
        next(error)
    }
})

export default router;