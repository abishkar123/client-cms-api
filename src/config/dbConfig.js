import mongoose from "mongoose";
import {MongoClient} from 'mongodb'


export const dbConnect = async () => {
  try {
    mongoose.set("strictQuery", true);

    const con = await mongoose.connect(process.env.MONGO_CLIENT);
    return con
  } catch (error) {
    console.log(error);
  }
};
// var MongoClient = require('mongodb').MongoClient;
// var url = "mongodb://localhost:27017/";

// MongoClient.connect(url, function(err, db) {
//   if (err) throw err;
//   var dbo = db.db("mydb");
//   dbo.collection("customers").findOne({}, function(err, result) {
//     if (err) throw err;
//     console.log(result.name);
//     db.close();
//   });
// });

let client
let clientPromise

const options = {}

const uri = 'mongodb+srv://abiskarrai:C6cUkXBXosg8Tcib@cluster0.jzd47pi.mongodb.net/SknersCrazy?retryWrites=true&w=majority'



if(!uri){
  throw new Error('Please add mongo uri to .env file.')
}

if(process.env.NODE_ENV === 'development'){
  if(!global._mongoClientPromise){
    client = new MongoClient(uri, options)
    global._mongoClientPromise = client.connect()
  }
  clientPromise = gloabal._mongoClientPromise
} else{
  client = new MongoClient(uri, options)
  clientPromise = client.connect()
}


    export default clientPromise



