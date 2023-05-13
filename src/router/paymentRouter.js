import express from 'express'
import clientPromise from '../config/dbConfig.js'


const router = express.Router()

let db
let client
let payments


async function init(){
    if(db) return
    try {
        client = await clientPromise
        db = await client.db()
        payments= await db.collection('paymentmethods')
        
        db && console.log('Mongo db connected!')
    } catch (error) {
        throw new Error('Failed to connect to db')
    }
}



router.get('/', async(req,res,next) => {
   await init()
   try {
   
    const paym= await payments.find({}).toArray()
  
  console.log(paym)
    res.json({
        status: "success",
        message: "get all product list ",
        paym,
      });
   } catch (error) {
    next(error)
   }
})




export default router