const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { dbConnection } = require('../database/config');
const swaggerUI = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerConfig = require('./swagger.config.json');

class Server {
  constructor(){
    this.app = express();
    this.port = process.env.PORT;
    this.paths = {
      auth: '/api/auth',
      categorias: '/api/categorias',
      docs: '/api/docs',
      productos: '/api/productos',
      usuarios: '/api/usuarios',
    };
    this.swaggerDocs = swaggerJsdoc(swaggerConfig);

    // Conectar a base de datos
    this.conectarDB();

    // Middlewares
    this.middlewares();

    // Rutas de mi aplicacion
    this.routes();
  }

  async conectarDB(){
    await dbConnection();
  }

  middlewares(){
    
    // CORS
    this.app.use(cors());

    // morgan
    this.app.use(morgan('dev'));

    // Lectura y parseo del body
    this.app.use( express.json());

    // Swagger
    this.app.use(this.paths.docs, swaggerUI.serve, swaggerUI.setup(this.swaggerDocs, { explorer: true }));

    // Directorio publico
    this.app.use( express.static('public'));
  }

  routes(){
    this.app.use(this.paths.auth, require('../routes/auth'));
    this.app.use(this.paths.categorias, require('../routes/categorias'));
    this.app.use(this.paths.productos, require('../routes/productos'));
    this.app.use(this.paths.usuarios, require('../routes/usuarios'));
  }

  listen(){
    this.app.listen(this.port, () => {
      console.log('Servidor corriendo en puerto ', this.port);
    });
  }
}

module.exports = Server;