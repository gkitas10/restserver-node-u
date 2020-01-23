// ============================
//  Puerto
// ============================
process.env.PORT = process.env.PORT || 3000;

//Entorno
process.env.NODE_ENV=process.env.NODE_ENV||'dev';

//Fecha de vencimiento de token
process.env.CADUCIDAD_TOKEN=60*60*24*30;

//SEED
process.env.SEED=process.env.SEED||'este-es-el-seed-desarrollo';

//DB
let urlDB;
if(process.env.NODE_ENV==='dev'){
    urlDB='mongodb://localhost:27017/cafe';
}else{
   urlDB=process.env.MONGO_URI;
}
process.env.URLDB=urlDB;

//Client id de google
process.env.CLIENT_ID=process.env.CLIENT_ID||'699889733762-agj03ud04gd16tt3up4pnj5jko6mbirv.apps.googleusercontent.com';


