require('./config/config');

const express = require('express');
const mongoose=require('mongoose');
const path=require('path');

const app = express();

const bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

//Hacer publico, public
app.use(express.static(path.resolve(__dirname,'../public')));

//routes
app.use(require('./routes/index'));


//Database

mongoose.connect(process.env.URLDB,{useNewUrlParser:true,useUnifiedTopology: true,useCreateIndex:true},(err,res)=>{
    if(err) throw err;
    console.log('conexión exitosa con la DB');
});

//Servidor escuchando
app.listen(process.env.PORT, () => {
    console.log('Escuchando puerto: ', process.env.PORT);
});