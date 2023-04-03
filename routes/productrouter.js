const express =require("express");
const router =new express.Router();
const Products =require("../models/productsSchema");
const USER =require("../models/userSchema");
const bcrypt = require("bcryptjs");
const authenicate =require("../middleware/authenticate")

// ------------------createProduct------------------------
router.post("/productCreate",authenicate,async(req, res, next) => {
    // let images = [];
  
    // if (typeof req.body.images === "string") {
    //   images.push(req.body.images);
    // } else {
    //   images = req.body.images;
    // }
  
    // const imagesLinks = [];
  
    // for (let i = 0; i < images.length; i++) {
    //   const result = await cloudinary.v2.uploader.upload(images[i], {
    //     folder: "products",
    //   });
  
    //   imagesLinks.push({
    //     public_id: result.public_id,
    //     url: result.secure_url,
    //   });
    // }
  
    // req.body.images = imagesLinks;
    // req.body.user = req.user.id;
    const {id ,url,detaislUrl ,Stock,shortTitle,longTitle,mrp,cost,discountS,category,description, discount,tagline } = req.body;
      const product = await Products.create(req.body);
      res.status(201).json(
        product,
      );
    });
// =================get Product=============================
 router.get("/getproducts",async(req,res)=>{
 try{
const productdata=await Products.find();
        // console.log(productdata);

res.status(200).json(
          
            productdata,
   );
}catch(error){
    console.log("error" +error.message);
}
});

//===================== getindividual--------------------
router.get("/getproductsone/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const individual = await Products.findOne({ id: id });
        res.status(201).json(
            individual
        );
    } catch (error) {
        res.status(400).json(error);
    }
});
//---------------------- register the data-------------------------------------------
router.post("/register", async (req, res) => {
    // console.log(req.body);
    const { fname, email, mobile, password, cpassword } = req.body;

    if (!fname || !email || !mobile || !password || !cpassword) {
        res.status(422).json({ error: "filll the all details" });
      
    };

    try {
        const preuser = await USER.findOne({ email: email });
        if (preuser) {
            res.status(422).json({ error: "This email is already exist" });
        } else if (password !== cpassword) {
            res.status(422).json({ error: "password are not matching" });;
        } else {

            const finaluser = new USER({
                fname, email, mobile, password, cpassword
            });

            // yaha pe hasing krenge

            const storedata = await finaluser.save();
         
            res.status(201).json(storedata);
        }

    } catch (error) {
        console.log("error the bhai catch ma for registratoin time" + error.message);
        res.status(422).send(error);
    }

});

// --------------------------------------login data------------------------------------------------
router.post("/login", async (req, res) => {
   
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400).json({ error: "fill the details" });
    }
    try {
        const userlogin = await USER.findOne({ email: email });
       
        if (userlogin) {
            const isMatch = await bcrypt.compare(password, userlogin.password);
          
            if (!isMatch) {
                res.status(400).json({ error: "invalid crediential pass" });
            } else { 
                const token = await userlogin.generatAuthtoken();
                // console.log(token);
                res.cookie("Amazon", token, {
                    expires: new Date(Date.now() + 2589000),
                    httpOnly: true
                });
                res.status(201).json(userlogin);
            }

        } else {
            res.status(400).json({ error: "user not exist" });
        }

    } catch (error) {
        res.status(400).json({ error: "invalid crediential pass" });
        console.log("error the bhai catch ma for login time" + error.message);
    }
});

//---------------- for USER -----------------  LogOut------------------------------------------

router.get("/logout", authenicate, async (req, res) => {
    try {
        req.rootUser.tokens = req.rootUser.tokens.filter((curelem) => {
            return curelem.token !== req.token
        });
        res.clearCookie("Amazon", { path: "/" });

        req.rootUser.save();
        res.status(201).json(req.rootUser.tokens);
        console.log("user logout");
    } catch (error) {
        console.log(error + "jwt provide then logout");
    }
});

//---------------------------- adding the data into cart-------------------------------
router.post("/addcart/:id", authenicate ,async (req, res) => {
    try {
        const { id } = req.params;
        const cart = await Products.findOne({ id: id });
        const Usercontact = await USER.findOne({ _id: req.userID });
        if (Usercontact) {
            const cartData = await Usercontact.addcartdata(cart);
            await Usercontact.save();
          
            res.status(201).json(Usercontact);
        }
    } catch (error) {
        console.log(error);
    }
});


// get data into the cart
router.get("/cartdetails", authenicate, async (req, res) => {
    try {
        const buyuser = await USER.findOne({ _id:req.userID });
        res.status(201).json(
            buyuser
            );
    } catch (error) {
        console.log(error + "error for buy now");
    }
});


// get user is login or not
router.get("/validuser", authenicate, async (req, res) => {
    try {
        const validuserone = await USER.findOne({ _id: req.userID });
      
        res.status(201).json(validuserone);
    } catch (error) {
        console.log(error + "error for valid user");
    }
});

// remove iteam from the cart

router.delete("/remove/:id", authenicate, async (req, res) => {
    try
    {
        const { id } = req.params;
        req.rootUser.carts = req.rootUser.carts.filter((curel) => {
            return curel.id != id
        });
        req.rootUser.save();
        res.status(201).json(req.rootUser);
     
    } 
    catch (error) 
    {
        console.log(error + "jwt provide then remove");
        res.status(400).json(error);
     } });

module.exports =router;