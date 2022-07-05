const { response } = require("express");
const { Categoria } = require('../models');


const obtenerCategorias = async (req, res = response) => {

  try {
    const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true };
    
    const [ categorias, total ] = await Promise.all([ 
      Categoria.find(query)
             .populate('usuario', 'nombre')
             .skip(Number(desde))
             .limit(Number(limite))
      , 
      Categoria.countDocuments(query)
    ]);
  
    res.status(200).json({
      total,
      categorias
    });
    
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: `Contacte con el administrador`
    });
  }
  
  

}

const obtenerCategoria = async (req, res = response) => {

    try {
      const id = req.params.id;
   
      const categoria = await Categoria.findById( id ).populate('usuario', 'nombre');
   
      res.status(200).json(categoria);
      
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        msg: `Contacte con el administrador`
      });
    }
  
}

const crearCategoria = async (req, res = response) => {

    try {
        const nombre = req.body.nombre.toUpperCase();
    
        const categoriaDB = await Categoria.findOne({ nombre }) ;
    
        if ( categoriaDB ) {
          return res.status(400).json({
            msg: `La categoria ${categoriaDB.nombre}, ya existe`
          });
        }
    
        const data = {
          nombre,
          usuario: req.usuario._id
        }
    
        const categoria = new Categoria( data );
    
        await categoria.save();

        res.status(201).json(categoria);
      
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        msg: `Contacte con el administrador`
      });
    }

}

const actualizarCategoria = async(req, res = response) => {
  
    try {
      const { id } = req.params;
      const { estado, usuario, ...data } = req.body;
  
      data.nombre = data.nombre.toUpperCase();
      data.usuario = req.usuario._id;
  
      const categoria = await Categoria.findByIdAndUpdate(id, data, { new: true });
  
      res.status(200).json(categoria);      
      
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        msg: `Contacte con el administrador`
      });
    }


}

const borrarCategoria = async (req, res = response) => {
  
  try {
    const { id } = req.params;
   
    const categoria = await Categoria.findByIdAndUpdate(id, { estado: false }, { new: true });

    res.status(200).json(categoria);      
    
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: `Contacte con el administrador`
    });
  }

}

module.exports = {
  crearCategoria,
  obtenerCategorias,
  obtenerCategoria,
  actualizarCategoria,
  borrarCategoria
}