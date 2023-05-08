import orderSlice from "./orderSlice.js";

export const createNewOrder = (obj) => {
    return orderSchema(obj).save();

}