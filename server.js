const express = require('express');
require('dotenv').config({path:'./config/.env'})
const app = express();


app.listen(5000, ()=>{
    console.log(`listening on port ${process.env.PORT}`);
})