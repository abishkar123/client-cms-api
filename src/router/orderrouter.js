import express from "express"
import { createNewOrder, readOrder } from "../model/order/orderModel.js";
import { neworderValidation } from "../middleware/joiMiddleware.js";


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

export default router;