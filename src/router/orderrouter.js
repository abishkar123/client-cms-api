import express from "express"
import { createNewOrder, readOrder } from "../model/order/orderModel.js";
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
        console.log(order)
            res.json({
                status: "success",
                message: "here is the list of order",
                order,
            })
           


    } catch (error) {
        next(error)

    }
})

router.post("/process-payment",async (req, res, next)=>{

    const { amount,currency} = req.body;
    console.log( process.env.STRIPE_SECRET_KEY)

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
    try {
        const paymentIntent = await  
        stripe.paymentIntents.create({
            amount, // amount in cents
            currency,
            payment_method_types: ['card'],
          })

        console.log(paymentIntent)
        res.json({clientSecret:paymentIntent.client_secret});
    } catch (error) {
        console.log(error);
        res.status(500).json({error:error.message})
    }

})

export default router;