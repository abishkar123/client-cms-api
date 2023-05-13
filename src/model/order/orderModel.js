import orderSchema from "./orderSchema.js";

export const createNewOrder = (obj) => {
    return orderSchema(obj).save();

}

export const readOrder = () => {
    return orderSchema.find();

}

