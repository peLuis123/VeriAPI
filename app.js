const express = require("express");
require("dotenv").config();
const controllerRouter = require('./controllers/controllers.js');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const app = express();
app.use(express.json());


const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Verificación',
      version: '1.0.0',
      description: 'API para enviar y verificar códigos de verificación por SMS y correo electrónico',
    },
    servers: [
      {
        url: 'http://localhost:4000',
      },
    ],
  },
  apis: ['./controllers/controllers.js'], // Ruta correcta a tu archivo con comentarios de documentación
};

const specs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
app.use('/', controllerRouter);

app.listen(4000, () => {
  console.log("listening on 4000");
});
