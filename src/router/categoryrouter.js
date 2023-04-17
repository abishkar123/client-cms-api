import express from 'express'
import clientPromise from '../config/dbConfig.js'

const router = express.Router()

let db
let client

let category

async function init(){
    if(db) return
    try {
        client = await clientPromise
        db = await client.db()
        category = await db.collection('catagorysessions')
        
        db && console.log('Mongo db connected!')
    } catch (error) {
        throw new Error('Failed to connect to db')
    }
}



router.get('/:slug?', async(req,res,next) => {
   await init()
   try {
    const {slug} = req.params
console.log(slug)
    const cats= slug ?  await category.find({slug}).toArray() :  await category.find({}).toArray()
  
    res.json({
        status: "success",
        message: "get all product list ",
        cats,
      });
    
   } catch (error) {
    next(error)
   }
})

export default router