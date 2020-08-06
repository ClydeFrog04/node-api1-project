const express = require("express");
const db = require("./database");

const server = express();

server.use(express.json());

server.get("/api/users", (req, res)=>{
    //the read me does not say to return anything to the user here. Just check if there is an error. Bad directions!
    try{
        const users = db.getUsers();
        res.status(200).json({users: users});
    }catch (e) {
        res.status(500).json({ errorMessage: "The users information could not be retrieved." });
    }
});

server.post("/api/users", (req, res)=>{
    if(req.body.name === undefined || req.body.bio === undefined){
        res.status(400).json({ errorMessage: "Please provide name and bio for the user." });
    } else{
        try {
            const newUser = db.createUser({
                name: req.body.name,
                bio: req.body.bio
            });
            res.status(201).json({data: newUser});
        }catch (err) {
            res.status(500).json({ errorMessage: "There was an error while saving the user to the database" });
        }
    }

});

server.get("/api/users/:id", (req, res)=>{
    //again the directions don't say to return anything positive, just errors
    try{
        const user = db.getUserById(req.params.id);
        if(user) res.status(200).json({data: user});
        else{
            res.status(404).json({ errorMessage: "The user information could not be retrieved." });
        }
    }catch(err){
        res.status(500).json({ errorMessage: "The user information could not be retrieved." });
    }
});

server.delete("/api/users/:id", (req, res) => {
    try{
        const id = req.params.id;
        const user = db.getUserById(id);
        if(user) {
            db.deleteUser(req.params.id);
            res.status(204).end();
        }
        else{
            res.status(404).json({ message: "The user with the specified ID does not exist." });
        }
    }catch (e) {
        res.status(500).json({ errorMessage: "The user could not be removed" });
    }
});

server.put("/api/users/:id", (req, res)=>{
    try{
        const id = req.params.id;
        const name = req.body.name;
        const bio = req.body.bio;
        const user = db.getUserById(id);
        if(user && name && bio){
            const updatedUser = db.updateUser(id, {name: req.body.name, bio: req.body.bio});
            res.status(200).json({data: updatedUser});
        }else if(!name || !bio){
            res.status(400).json({ errorMessage: "Please provide name and bio for the user." });
        }else{
            res.status(404).json({ message: "The user with the specified ID does not exist." });
        }
    }catch (e) {
        res.status(500).json({ errorMessage: "The user information could not be modified." });
    }
});

server.listen(3000, () =>{
    console.log("Server listening on port 3000");
})