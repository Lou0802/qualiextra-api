import swaggerJSDoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Qualiextra API',
      version: '1.0.0',
      description: 'Documentation API pour le projet Qualiextra'
    },
    servers: [
  {
    url: "https://qualiextra-api-fmfi.onrender.com"
  }
],
    components: {
      securitySchemes: {
        bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }
      },
      schemas: {
        LoginRequest: { type: 'object', properties: { email: { type: 'string' }, password: { type: 'string' } }, required: ['email','password'] },
        RegisterRequest: { type: 'object', properties: { firstname: { type: 'string' }, lastname: { type: 'string' }, email: { type: 'string' }, password: { type: 'string' } }, required: ['firstname','lastname','email','password'] },
        User: { type: 'object', properties: { id: { type: 'integer' }, firstname: { type: 'string' }, lastname: { type: 'string' }, email: { type: 'string' }, role: { $ref: '#/components/schemas/Roles' } } },
        Roles: { type: 'string', enum: ['user','admin'] }
      }
    }
  },
  apis: ['./src/routes/*.js', './src/controllers/*.js'] // lit uniquement les annotations
};

export default swaggerJSDoc(options);