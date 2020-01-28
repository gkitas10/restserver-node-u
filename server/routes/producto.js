const express=require('express');
const app=express();
const {verificaToken}=require('../middlewares/autenticacion');
let Producto=require('../models/producto');

app.get('/producto',verificaToken,(req,res)=>{

    let desde=req.query.desde||0;
    desde=Number(desde);

    Producto.find({disponible:true})
                    .skip(desde)
                    .limit(5)
                    .populate('usuario','nombre email')
                    .populate('categoria','descripcion')
                    .exec((err,productos)=>{

                        if(err)return res.status(500).json({ok:false,err});

                        res.json({ok:true,productos});
                    });

});

app.get('/producto/:id',(req,res)=>{
    let id=req.params.id;

    Producto.findById(id)
                        .populate('usuario','nombre email')
                        .populate('categoria','descripcion')
                        .exec((err,productoDB)=>{

                            if(err)return res.status(500).json({ok:false,err});

                            if(!productoDB) return res.status(400).json({ok:false,err:{message:'id invalido'}});

                            res.json({ok:true,productoDB});

                        });
});

//Busqueda de producto por termino regular
app.get('/productos/buscar/:termino',verificaToken,(req,res)=>{

    let termino=req.params.termino;
    let regex=new RegExp(termino,'i');

    Producto.find({nombre:regex})
                                .populate('categoria','descripcion')
                                .exec((err,productos)=>{

                                    if(err)return res.status(500).json({ok:false,err});



                                    res.json({ok:true,productos});
                                });


});

app.post('/producto',verificaToken,(req,res)=>{

    let body=req.body;

    let producto=new Producto({
        nombre: body.nombre,
        precioUni:body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria,
        usuario: req.usuario._id
    });

    producto.save((err,productoDB)=>{

        if(err)return res.status(500).json({ok:false,err});

        res.json({
            ok:true,
            productoDB
        });
    });
});

app.put('/producto/:id',(req,res)=>{

    let id=req.params.id;
    let body=req.body;

    Producto.findByIdAndUpdate(id,body,{new:true},(err,productoDB)=>{

        if(err)return res.status(500).json({ok:false,err});

        if(!productoDB) return res.status(400).json({ok:false,err:{message:'id no encontrado'}});

        res.json({ok:true,productoDB});

    });
});

app.delete('/producto/:id',(req,res)=>{

    let id=req.params.id;

    let cambiarDisponible={
        disponible:false
    };

    Producto.findByIdAndUpdate(id,cambiarDisponible,{new:true},(err,productoDB)=>{

        if(err)return res.status(500).json({ok:false,err});

        if(!productoDB) return res.status(400).json({ok:false,err:{message:'id no encontrado'}});

        res.json({ok:true,productoDB});

    });

});

module.exports=app;
