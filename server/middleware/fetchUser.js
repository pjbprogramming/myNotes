const jwt = require('jsonwebtoken');
const JWT_SECRET="GreatPJishere$coding$";

const fetchuser= (req,res,next)=>
        {
         const token =req.header('auth-token');
       if (!token)
        {
            res.status(401).send({error: "Please authenticate using valid token"});
         }
    try
    {
    
        const data=jwt.verify(token,JWT_SECRET); // console.log(data.valueOf()); 
        req.user= data;
        next();
     
        } 
    catch (error) {
            res.status(400).send({error: "Please authenticate using valid token"});
         }
}
module.exports=fetchuser