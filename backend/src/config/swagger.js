const swaggerUi = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");
const path = require("path");


const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Mini Blog API Documentation",
      version: "1.0.0",
      description: "API Documentation for Blog App"
    },
    servers: [
      { url: "https://mini-blog-api-m5ys.onrender.com/api" }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT"
        }
      }
    },
    security: [
      { bearerAuth: [] }
    ]
  },

  apis: [path.join(__dirname,"../docs/*.yaml")],

};

const swaggerSpec = swaggerJsDoc(options);

module.exports = { swaggerUi, swaggerSpec };
