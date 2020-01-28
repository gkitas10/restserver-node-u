const express=require('express');
const app=express();
const {verificaToken,verificaAdmin_role}=require('../middlewares/autenticacion');

let Categoria= require('../models/categoria');

app.get('/categoria',verificaToken,(req,res)=>{
    

    Categoria.find({})
    //populate permite obtener la informacion de objectsID encontrados dentro de la coleccion Categoria y
    //mostrar su informacion
                    .sort('descripcion')
                    .populate('usuario','nombre email')
                    .exec((err,categorias)=>{

        if(err){return res.status(500).json({

            ok:false,
            err
        });
    }
        res.json({
            ok:true,
            categorias
        });
    }); 

});



app.get('/categoria/:id',verificaToken,(req,res)=>{

    let id=req.params.id;

    Categoria.findById(id,(err,categoriaDB)=>{

        if(err){
            return res.status(400).json({
                ok:false,
                 err
                 
             });
         }

         if(!categoriaDB){

            return res.status(400).json({
                ok:false,
                 err:{
                     message:'Id no coincide'

                 }
                 
             });
         }

         res.json({
             ok:true,
             categoriaDB
         });

    });


});

app.post('/categoria',[verificaToken,verificaAdmin_role],(req,res)=>{

    

    let body=req.body;

    let categoria=new Categoria({
        descripcion:body.descripcion,
        usuario:req.usuario._id
    });

    categoria.save((err,categoriaDB)=>{

        if(err){
            return res.status(500).json({
                ok:false,
                err:err
            });
        }

        if(!categoriaDB){
            return res.status(400).json({
                ok:false,
                err
            });
        }

        res.json({
            ok:true,
            categoria:categoriaDB
        });
    });


});

app.put('/categoria/:id',[verificaToken,verificaAdmin_role],(req,res)=>{

    let id=req.params.id;
    let body=req.body;

    Categoria.findByIdAndUpdate(id,body,{new:true,runValidators:true},(err,categoriaDB)=>{

        if(err){
            return res.status(500).json({
                ok:false,
                err
            });
        }

        if(!categoriaDB){
            return res.status(400).json({
                ok:false,
                err
            });
        }

        res.json({

            ok:true,
            categoriaDB

        });
    });
});

app.delete('/categoria/:id',[verificaToken,verificaAdmin_role],(req,res)=>{

    let id=req.params.id;

    Categoria.findByIdAndRemove(id,(err,categoriaDB)=>{

        if(err){return res.status(500).json({
            ok:false,
            err

        });
    }

    if(!categoriaDB){return res.status(400).json({
        ok:false,
        err:{
            message:'El id no existe'
        }

    });
}

    res.json({
        ok:true,
        categoriaDB

    });

    });

});


module.exports=app;