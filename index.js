const express = require('express');
const app = express();
const db = require('./src/config/db');
const config = require("./src/config/config");

app.use(express.json());

app.get("/", (req,res)=> {
    res.send("This is the trial project of foodDelivery!");
})

console.log("Config PORT:", config.PORT);

db.connect().then(()=>{
    app.listen(config.PORT, ()=>{
        console.log(`Server is running at port ${config.PORT}`)
    })
})