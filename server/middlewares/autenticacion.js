const jwt=require('jsonwebtoken');

let verificaToken=(req,res,next)=>{

    let token=req.get('token');//Suele ser authorization

    jwt.verify(token,process.env.SEED,(err,decoded)=>{

        if(err){

            return res.status(401).json({
                ok:false,
                err
                
            });
    }
    req.usuario=decoded.usuario;
    next();
    });
};

let verificaAdmin_role=(req,res,next)=>{

    let usuario=req.usuario;
//El usuario que se recibe de la req por el headers 
    if(usuario.role==='ADMIN_ROLE'){
        next();
    }

    else{
        return res.json({
            ok:false,
            err:{
                message:'el usuario no es administrador'
            }
        });
    }



};


module.exports={verificaToken,verificaAdmin_role}