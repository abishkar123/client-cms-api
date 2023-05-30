import orderSchema from "./orderSchema.js";

export const createNewOrder = (obj) => {
    return orderSchema(obj).save();

}

export const readOrder = () => {
    return orderSchema.find();

}

export const updateOrder = (id, update) => {
    console.log(id, update)
    return orderSchema.findByIdAndUpdate(id, update, { new: true })
  }