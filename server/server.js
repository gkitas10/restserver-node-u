require('./config/config');

const express = require('express');
const mongoose=require('mongoose');

const app = express();

const bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

//routes
app.use(require('./routes/usuario'));

//Database

mongoose.connect('mongodb+srv://gkitas10:kx40PfCGLb2vmDPg@cluster0-wrfnm.mongodb.net/test?retryWrites=true&w=majority',{useNewUrlParser:true,useUnifiedTopology: true,useCreateIndex:true},(err,res)=>{
    if(err) throw err;
    console.log('conexión exitosa con la DB');
});

//Servidor escuchando
app.listen(process.env.PORT, () => {
    console.log('Escuchando puerto: ', process.env.PORT);
});