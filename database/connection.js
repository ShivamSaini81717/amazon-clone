
const mongoose = require("mongoose");

mongoose.set('strictQuery', false);
// const DB =process.env.DATABASE;
const connectDatabase = () => {
  mongoose
    .connect("mongodb+srv://shivamsaini81717:saini81717@cluster0.mgacxti.mongodb.net/Amazon?retryWrites=true&w=majority",{
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then((data) => {
      console.log(`Mongodb connected with server: ${data.connection.host}`);
    }).catch((err)=>{
      console.log(err)
    })
};

module.exports = connectDatabase;
// mongodb://127.0.0.1:27017/
// "mongodb+srv://shivamsaini81717:saini81717@cluster0.mgacxti.mongodb.net/Amazon?retryWrites=true&w=majority"
