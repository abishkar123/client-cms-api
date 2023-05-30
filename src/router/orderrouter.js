import express from "express"
import { createNewOrder, readOrder, updateOrder } from "../model/order/orderModel.js";
import { neworderValidation } from "../middleware/joiMiddleware.js";
import Stripe from "stripe";

const stripe = Stripe(process.env.STRIPE_SECRET_KEY)
const router = express.Router()

router.post("/add", neworderValidation, async (req, res, next) => {
    try {
        const order = await createNewOrder (req.body)
      

        order._id ?
            res.json({
                status: "success",
                message: "all the order list",
                order
            })
            :
            res.json({
                status: "error",
                message: "you dont have order list"
            })
            ;



    } catch (error) {
        next(error)

    }
})


router.get("/",  async (req, res, next) => {
    try {
        const order = await readOrder()
      
            res.json({
                status: "success",
                message: "here is the list of order",
                order,
            })
           


    } catch (error) {
        next(error)

    }
})


router.post("/create", async (req, res) => {
    const secret = process.env.STRIPE_SECRET_KEY
    const stripe = Stripe(secret)
  
    try {
      const { amount } = req.body
      const paymentIntent = await stripe.paymentIntents.create({
        description: "SnkersCrazy",
        amount,
        currency: "aud",
      })
  
      res.status(200).send(paymentIntent.client_secret)
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: error.message,
      })
    }
  })


router.patch("/status", async (req, res, next) => {
    try {
      const { orderId, ...rest } = req.body
  
      const order = await updateOrder(orderId, rest)
      res.json({
        status: "success",
        message: "order status updated successfully",
        order,
      })
    } catch (error) {
      next(error)
    }
  })




export default router;