
const jwt = require('jsonwebtoken');
const SECRETORPRIVATEKEY = process.env.SECRETORPRIVATEKEY;

const generarJWT = ( uid = '') => {
     
   return new Promise( (resolve, reject) => {
       
      const payload = { uid };

      jwt.sign( payload, SECRETORPRIVATEKEY, {
         expiresIn: '4h'
      }, ( err, token ) => {
        if(err){
           console.log(err);
           reject('No se pudo generar el JWT');
        } else {
          resolve( token );
        }
      })

   });
}


module.exports = {
  generarJWT
}