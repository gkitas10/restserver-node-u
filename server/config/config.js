// ============================
//  Puerto
// ============================
process.env.PORT = process.env.PORT || 3000;

//Entorno
process.env.NODE_ENV=process.env.NODE_ENV||'dev';

//DB
let urlDB;
if(process.env.NODE_ENV==='dev'){
    urlDB='mongodb://localhost:27017/cafe';
}else{
   urlDB='mongodb+srv://gkitas10:kx40PfCGLb2vmDPg@cluster0-wrfnm.mongodb.net/test?retryWrites=true&w=majority/cafe';
}
process.env.URLDB=urlDB;


