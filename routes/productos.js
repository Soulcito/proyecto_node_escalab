const { Router } = require('express');
const { check } = require('express-validator');
const { obtenerProductos, obtenerProducto, crearProducto, actualizarProducto, borrarProducto } = require('../controllers/productos');
const { existeProducto, existeCategoria } = require('../helpers/db-validators');

const { validarCampos, validarJWT, esAdminRole } = require('../middlewares');

const router = Router();

router.get('/', obtenerProductos);

router.get('/:id', [
  check('id','El id no es un id mongo valido').isMongoId(),
  check('id').custom( existeProducto ),
  validarCampos
], obtenerProducto );

router.post('/', [ 
  validarJWT,
  check('nombre', 'El nombre es obligatorio').not().isEmpty(),
  check('categoria','El id no es un id mongo valido').isMongoId(),
  check('categoria').custom( existeCategoria ),
  validarCampos
], crearProducto);

router.put('/:id',[
  check('id','El id no es un id mongo valido').isMongoId(),
  check('id').custom( existeProducto ),
  validarJWT,
  validarCampos
], actualizarProducto);

router.delete('/:id', [
  check('id','El id no es un id mongo valido').isMongoId(),
  check('id').custom( existeProducto ),
  validarJWT,
  esAdminRole,
  validarCampos
], borrarProducto);

module.exports = router;