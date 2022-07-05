const { response } = require("express");
const { Producto } = require('../models');


const obtenerProductos = async (req, res = response) => {

  try {
    const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true };
    
    const [ productos, total ] = await Promise.all([ 
      Producto.find(query)
             .populate('usuario', 'nombre')
             .populate('categoria', 'nombre')
             .skip(Number(desde))
             .limit(Number(limite))
      , 
      Producto.countDocuments(query)
    ]);
  
    res.status(200).json({
      total,
      productos
    });
    
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: `Contacte con el administrador`
    });
  }
  
  

}

const obtenerProducto = async (req, res = response) => {

    try {
      const id = req.params.id;
   
      const producto = await Producto.findById( id )
                                     .populate('usuario', 'nombre')
                                     .populate('categoria', 'nombre');
   
      res.status(200).json(producto);
      
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        msg: `Contacte con el administrador`
      });
    }
  
}

const crearProducto = async (req, res = response) => {

    try {
        const { estado, usuario, ...body } = req.body;
    
        const productoDB = await Producto.findOne({ nombre: body.nombre }) ;
    
        if ( productoDB ) {
          return res.status(400).json({
            msg: `El producto ${productoDB.nombre}, ya existe`
          });
        }
    
        const data = {
          nombre: body.nombre.toUpperCase(),
          usuario: req.usuario._id,
          ...body
        }
    
        const producto = new Producto( data );
    
        await producto.save();

        res.status(201).json(producto);
      
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        msg: `Contacte con el administrador`
      });
    }

}

const actualizarProducto = async(req, res = response) => {
  
    try {
      const { id } = req.params;
      const { estado, usuario, ...data } = req.body;
  
      if( data.nombre ) {
        data.nombre = data.nombre.toUpperCase();
      }
      data.usuario = req.usuario._id;
  
      const producto = await Producto.findByIdAndUpdate(id, data, { new: true });
  
      res.status(200).json(producto);      
      
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        msg: `Contacte con el administrador`
      });
    }

}

const borrarProducto = async (req, res = response) => {
  
  try {
    const { id } = req.params;
   
    const producto = await Producto.findByIdAndUpdate(id, { estado: false }, { new: true });

    res.status(200).json(producto);      
    
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: `Contacte con el administrador`
    });
  }

}

module.exports = {
  crearProducto,
  obtenerProductos,
  obtenerProducto,
  actualizarProducto,
  borrarProducto
}