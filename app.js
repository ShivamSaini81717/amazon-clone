 require("dotenv").config();
const express =require("express");
const app =express();
const connectDatabase =require("./database/connection");
const PORT =6000;

const bodyParser = require('body-parser');
const api = express();
api.use(bodyParser.urlencoded({ extended: true }));
const cors =require("cors");
const cookieParser=require("cookie-parser");

const Products =require("./models/productsSchema");
// const DefaultData =require("./defaultdata");

const router =require("./routes/productrouter");
connectDatabase();
app.use(express.json());
app.use(cookieParser(""));
api.use(bodyParser.json());
app.use(cors());
app.use(router);

app.listen(PORT,()=>{
    console.log(`Server is running or port number: ${PORT}`);
});


// DefaultData();