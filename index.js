const express = require('express');
const app = express();
const db = require('./src/config/db');
const config = require("./src/config/config");
const customerRoutes = require('./src/routes/customerRoutes')
app.get("/", (req,res)=> {
    res.send("This is the trial project of foodDelivery!");
})
app.use(express.json());
app.use("/api",customerRoutes);


db.connect().then(()=>{
    app.listen(config.PORT, ()=>{
        console.log(`Server is running at port ${config.PORT}`)
    })
})