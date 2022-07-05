const { Router } = require('express');
const { check } = require('express-validator');
const { crearCategoria, obtenerCategorias, obtenerCategoria, actualizarCategoria, borrarCategoria } = require('../controllers/categorias');
const { existeCategoria } = require('../helpers/db-validators');

const { validarCampos, validarJWT, esAdminRole } = require('../middlewares');

const router = Router();

router.get('/', obtenerCategorias);

router.get('/:id', [
  check('id','El id no es un id mongo valido').isMongoId(),
  check('id').custom( existeCategoria ),
  validarCampos
], obtenerCategoria );

router.post('/', [ 
  validarJWT,
  check('nombre', 'El nombre es obligatorio').not().isEmpty(),
  validarCampos
], crearCategoria);

router.put('/:id',[
  check('id','El id no es un id mongo valido').isMongoId(),
  check('id').custom( existeCategoria ),
  check('nombre', 'El nombre es obligatorio').not().isEmpty(),
  validarJWT,
  validarCampos
], actualizarCategoria);

router.delete('/:id', [
  check('id','El id no es un id mongo valido').isMongoId(),
  check('id').custom( existeCategoria ),
  validarJWT,
  esAdminRole,
  validarCampos
], borrarCategoria);

module.exports = router;