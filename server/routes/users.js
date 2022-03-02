const express=require('express');
const router=express.Router();
const User=require('../models/User');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fetchuser=require('../middleware/fetchUser');
const JWT_SECRET="GreatPJishere$coding$";

/////// Route 1 : Create a User using POST : "/api/userauth/createUser" and no login required //////

  router.post('/createUser', [
      body('name','Enter Valid  Name').isLength({ min: 3 }),
      body('email','Enater valid email').isEmail(),
      body('password','Enter valid passowrd').isLength({ min: 5 }),
    ], async(req, res) => {
    
        //Check whether any error in the request body
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }

       //Check whether any user with this email exist in database 

       try{
        let user= await User.findOne({email:req.body.email}) // await is must
        if (user){
         return  res.status(400).json({"message":"Sorry a user with same email already exists"})
        }
        else{
         //Paswword hashing with bycryptjs  using salt 
         const salt = await bcrypt.genSaltSync(10);
         const secPassword= await bcrypt.hash (req.body.password,salt);
       user= await User.create({
            name: req.body.name,
            email: req.body.email,
            password: secPassword,
          });

         /* const data ={
            user :{
              id :user.id
            }
          }; */

          console.log(user);
          console.log('id is : '+user.id);
         const jwtAuthToken= jwt.sign({id:user.id}, JWT_SECRET);
         console.log("Token is : "+ jwtAuthToken);
         res.json({user,jwtAuthToken,})
          }
         
         
          /* 
          .then(user => res.json(user)).catch(err=>{console.log(err) ,res.json({error:"Please enter a valid input", message :err.message}) }) */
          }
           catch(err){ console.log('The error : '+err)
         res.status(500).send("Some Error Occured in Server")}     
      })


  //////// Route 2 : Authenticate a user using POST : "/api/userauth/login" and no login required ///////
 
  router.post('/login', [
    body('email','Enater valid email').isEmail(),
    body('password','Password cannot be blank').exists(),
  ], async(req, res) => {
  
      //Checks whether any error in the request body
      const errors = await validationResult(req);
      if (!errors.isEmpty()) {
          
        return res.status(400).json({ errors: errors.array() });
          
      }
       // Destructuring the request array and getting email and password from there
      const {email,password}=req.body;
try {
  

     //Mongo query to check the availibity of the user in db and get the details from db to compare with the user input
      let user = await User.findOne({email:req.body.email});
      
      //If there is no such user by that email 
      if (!user)
      { 
      return  res.status(400).json({"Message":"Please enter correct credentials"});
    }
    else {
      //Compare reqbody passowrd with db passwoerd
     const passwordCompared =await bcrypt.compare(password,user.password)

   //If password wrong or mismatch then false
   if (!passwordCompared)
   {

    return  res.status(400).json({"Message":"Please enter correct credentials"});
   } 
   //If password matches
   else {
    console.log('Password 1 , 2, 3  '+password+"////>><<<////"+user.password+"/////>>>>><<<<<////"+passwordCompared);
    const jwtToken= jwt.sign({id:user.id}, JWT_SECRET);
         console.log("Token is : "+ jwtToken);
         res.json({user,jwtToken,})
   }

    } 

  } catch (error) {
    res.status(500).json({error:"Internal Server Error "+error});
  
  }
    })
    
   ////// Route 3 : Get logged in user details : POST "/api/userauth/getuser"  Login Required   //////////

   router.post('/getuser', fetchuser, async(req, res) => {
  
      //Checks whether any error in the request body
      const errors = await validationResult(req);
      if (!errors.isEmpty()) {
          
        return res.status(400).json({ errors: errors.array() });
          
      }
   
   try {
    //Find user details from db by the user id 
    const userid=req.user.id;
    const user =await User.findById(userid).select("-password");
    res.send(user)
   } 
   
    catch (error) {
        res.status(500).json({error:"Internal Server Error  2  "+error});
      }})
  
  
      module.exports=router