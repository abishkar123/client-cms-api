import express from 'express'
import clientPromise from '../config/dbConfig.js'

const router = express.Router()

let db
let client
let products

async function init(){
    if(db) return
    try {
        client = await clientPromise
        db = await client.db()
        products = await db.collection('proudcts')
        
        db && console.log('Mongo db connected!')
    } catch (error) {
        throw new Error('Failed to connect to db')
    }
}



router.get('/', async(req,res,next) => {
   await init()
   try {

    const prods = await products.find({}).toArray()
  
    res.json({
        status: "success",
        message: "get all product list ",
        prods,
      });
    
   } catch (error) {
    next(error)
   }
})

export default router