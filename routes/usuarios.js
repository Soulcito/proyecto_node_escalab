const { Router } = require('express');
const { check } = require('express-validator');

const { usuariosGet, usuariosPost, usuariosPut, usuariosPatch, usuariosDelete } = require('../controllers/usuarios');

const { validarCampos, validarJWT, esAdminRole, tieneRole } = require('../middlewares');

const { esRolValido, emailExiste, existeUsuarioPorId } = require('../helpers/db-validators');

const router = Router();

router.get('/', usuariosGet);

/**
 * @swagger
 * /category:
 *    post:
 *      summary: Creacion Usuario
 *      tags: [Usuario]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/Usuario"
 *      responses:
 *        200:
 *          description: ok
 *          content:
 *            application/json:
 *              schema:
 *                $ref: "#/components/schemas/Usuario"
 *        400:
 *          description: bad request 
 */

router.post('/', [
   check('nombre', 'El nombre es obligatorio').not().isEmpty(),
   check('password', 'El password debe de ser mas de 6 letras').isLength({ min: 6 }),
   check('correo', 'El correo no es valido').isEmail(),
   check('correo').custom( emailExiste ),
   check('rol') .custom( esRolValido ),
   check('rol').custom( esAdminRole ),
   validarCampos
] , usuariosPost);

router.put('/:id', [
   check('id', 'No es un ID valido').isMongoId(),
   check('id').custom( existeUsuarioPorId ),
   check('rol') .custom( esRolValido ),
   check('rol').custom( esAdminRole ),
   validarCampos
], usuariosPut);

router.patch('/', usuariosPatch);

router.delete('/:id', [
   validarJWT,
   tieneRole('ADMIN_ROLE', 'VENTAS_ROLE'),
   check('id', 'No es un ID valido').isMongoId(),
   check('id').custom( existeUsuarioPorId ),
   validarCampos
],usuariosDelete);




module.exports = router;


// SCHEMAS - SWAGGER

/**
 * @swagger
 * components:
 *    schemas:
 *      Usuario:
 *        type: object
 *        required:
 *          - nombre
 *          - correo
 *          - password 
 *          - rol
 *        properties:
 *          nombre:
 *            type: string
 *          correo:
 *            type: string
 *            unique: true
 *          password:
 *            type: string
 *          img:
 *            type: string
 *          rol:  
 *            type: string   
 *          estado:
 *            type: boolean
 *            default: true
 *          google:
 *            type: boolean
 *            default: true  
 *        example:
 *          nombre: addmin
 *          correo: admin@escalab.com
 *          password: 123456
 *          rol: ADMIN_ROLE
 */