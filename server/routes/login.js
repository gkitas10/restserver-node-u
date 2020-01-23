const express = require('express');

const app = express();
const Usuario=require('../models/usuario');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);

app.post('/login',(req,res)=>{
    let body=req.body;

    Usuario.findOne({email:body.email},(err,usuarioDB)=>{
        
        if(err){return res.status(500).json({
            ok:false,
            err
        });
    }
    if(!usuarioDB){

        return res.status(400).json({
            ok:false,
            message:'(usuario) o contraseña incorrectos'
        });
    }
    if (!bcrypt.compareSync(body.password,usuarioDB.password)){
        return res.status(400).json({
            ok:false,
            message:'usuario o (contraseña) incorrectos'
        });

    }
    let token=jwt.sign({usuario:usuarioDB},process.env.SEED,{expiresIn:process.env.CADUCIDAD_TOKEN});

    res.json({
        ok:true,
        usuarioDB,
        token
    });

    });
    
});

//Configuraciones de google- pasamos el token como argumento para poder usarlo y cambiamos client_id

async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
   // const userid = payload['sub'];
    // If request specified a G Suite domain:
    //const domain = payload['hd'];

    
    //La funcion verify devuelve un objeto con las propiedades del payload
    
    return {
        nombre:payload.name,
        email:payload.email,
        img:payload.picture,
        google:true
    }
  }


app.post('/google',async(req,res)=>{

    let token=req.body.idtoken;

    let googleUser=await verify(token)
    //Si este catch no sucede quiere decir que la verificacion fue correcta
                        .catch(e=>{
                            res.status(403).json({
                                ok:false,
                                err:e
                            });
                        });
    Usuario.findOne({email:googleUser.email},(err,usuarioDB)=>{

        if(err){return res.status(500).json({
            ok:false,
            err
        });

     }   

     if(usuarioDB){
//si el usuario esta en la base y ya se autentico pero de forma normal entonces le decimos que tiene que
//Seguir autenticandose asi
        if(usuarioDB.google===false){

            return res.status(400).json({
            ok:false,
            err:{
                message:'Utiliza tu autenticacion normal'
            }
        });
    

        }else{
//Si el usuario esta en la base y ya se autentico previamente con google, renovamos su token
            let token=jwt.sign({usuario:usuarioDB},process.env.SEED,{expiresIn:process.env.CADUCIDAD_TOKEN});

            return res.json({
                ok:true,
                usuario:usuarioDB,
                token
            });
        }

     }
     else{
//Si el usuario no esta en la base, lo agregamos
        let usuario=new Usuario();

        usuario.nombre=googleUser.nombre;
        usuario.email=googleUser.email;
        usuario.img=googleUser.img;
        usuario.password=':)';
        usuario.google=true;
   
        usuario.save((err,usuarioDB)=>{
   
            if(err){return res.status(500).json({
                ok:false,
                err
            });
    
         } 
   
         let token=jwt.sign({usuario:usuarioDB},process.env.SEED,{expiresIn:process.env.CADUCIDAD_TOKEN});
   
            return res.json({
                ok:true,
                usuario:usuarioDB,
                token
            });
        
        });
   
     }
     
    });
         
});

module.exports = app;