const express=require('express');
const app=express();
const hbs=require('hbs');
const path=require('path');

// Express HBS engine

app.set('view engine', 'hbs');


app.get('/',(req,res)=>{

    res.render('home');
});

app.get('/usuarios',(req,res)=>{

    res.render('usuarios');
    
});

module.exports=app;