import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API Documentation",
      version: "1.0.0",
      description: "A sample API documentation",
    },
    servers: [
      {
        url: "http://localhost:3001/api", // Base URL for API
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT", // Optional, useful to indicate the token format
        },
      },
    },
    security: [
      {
        bearerAuth: [], // Applies bearerAuth globally to all routes
      },
    ],
  },
  apis: ["./app.js", "./routes.js"], // Specify the paths to your API files
};

const specs = swaggerJsdoc(options);

export { specs, swaggerUi };
