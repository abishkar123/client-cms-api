import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    addressline: { type: String, required: true },
    fname: { type: String, required: true },
    lname: { type: String, required: true },
    email: { type: String, required: true },
    phonenumber: { type: Number },
    town: { type: String, required: true },
    state: { type: String, required: true },
    posscode: { type: String, required: true },
    userId:{ type: Object, required: true },
    paymentDetails:{
       
        paymentmethods: { type: String, required: true },
        totalAmount:{ type: String},

    },
    isPaid: {
        type: Boolean,
        default: false,
      },
      paidAt: {
        type: Date,
      },
   
    cart: [{
        name: { type: String, required: true },
        salesPrice: { type: Number, required: true },
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