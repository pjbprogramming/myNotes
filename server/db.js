const mongoose= require('mongoose');
const  mongooseURI="mongodb://localhost:27017/myNotes?readPreference=primary&appname=MongoDB%20Compass&ssl=false"
const connectToMongodb=()=>{ mongoose.connect(mongooseURI,()=>{

    console.log('Connected to Mongo Successfully');
})}

module.exports=connectToMongodb;