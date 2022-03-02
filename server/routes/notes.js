const express=require('express');
const router=express.Router();
const Note=require('../models/Notes')
const fetchuser=require('../middleware/fetchUser');
const { body, validationResult } = require('express-validator');


//Route 1: Add notes of a paticular user  POST:"/api/notes/createNotes" , Login required
router.post('/addNotes',fetchuser,[
    body('title','Enter Valid  Title').isLength({ min: 3 }),
    body('description','Enter valid description').isLength({ min: 5 }),
  //  body('tag',"Enter valid tag").isLength({min:3})
 ],async (req, res) => {
        try {
     // Getting the values entered by the User from request body
     const {title,description,tag}=req.body;  
    //Check whether any error in the request body
    const errors =  validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

     const notes= await new Note({title,description,tag,user:req.user.id})
     const savedNotes= await notes.save();
     res.json(savedNotes)
    } 
    catch (error) {
    res.status(401).send("Error in server");
    }
   })

//Route 2 : Fetch all notes of a paticular user  GET:"/api/notes/fetchallnotes" , Login required
  router.get('/fetchAllNotes',fetchuser,async (req, res) => {
   const notes= await Note.find({user:req.user.id})
    res.json(notes)
  })
  

  //Route 3 : Edit notes of a paticular user  GET:"/api/notes/editNotes/:id'" , Login required
  router.get('/editNotes/:id',fetchuser,async (req, res) => {
     // Getting the values entered by the User from request body
     const {title,description,tag}=req.body; 
     
     // Create  a newNote object
    const newNotes={};
    if(title){newNotes.title=title}
    if(description){newNotes.description=description}
    if(tag){newNotes.tag=tag}

    //Find the note to be updated and update the note
    const note=Note.findById(req.params.id)
    if(!note){return res.status(404).send("Not found")}
    if(note.user.toString()!==req.user.id){return res.status(401).send("Not allowed ")}

    note=await Note.findByIdAndUpdate(req.params.id,{$set:newNotes}),{new:true};
    res.send(note);
   })

  
  module.exports=router