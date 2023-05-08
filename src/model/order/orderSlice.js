import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    address: { type: String, required: true },
    fname: { type: String, required: true },
    lname: { type: String, required: true },
    email: { type: String, required: true },
    phonenumber: { type: String, required: true },
    town: { type: String, required: true },
    state: { type: String, required: true },
    posscode: { type: String, required: true },
    paymentmethod: { type: String, required: true },
    cart: [{
        name: { type: String, required: true },
        price: { type: Number, required: true },
        shopQty: { type: String, required: true },
        qty: { type: Number, required: true },
        // sum: { type: Number, required: true },
    }]
},

    {
        timestamps: true,
    }


);
export default mongoose.model("Order", orderSchema);