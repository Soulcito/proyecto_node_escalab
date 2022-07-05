
const { request, response } = require('express');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');
const SECRETORPRIVATEKEY = process.env.SECRETORPRIVATEKEY;

const validarJWT = async ( req = request, res = response, next ) => {
   const token = req.header('x-token');

   if( !token ) {
     return res.status(401).json({
       msg: 'No hay token en la petición'  
     })
   }

   try {          
     
     const { uid } = jwt.verify(token, SECRETORPRIVATEKEY);
     
     const usuario = await Usuario.findById( uid );

     if ( !usuario ) {
        return res.status(401).json({
          msg: 'Token no valido'
        });
     }

     if( !usuario.estado ) {
        return res.status(401).json({
          msg: 'Token no valido'
        });
     }

     req.usuario = usuario;

     next();

   } catch (error) {
     console.log(error);
     res.status(401).json({
       msg: 'Token no valido'
     });
   }
   
}


module.exports = {
  validarJWT
}