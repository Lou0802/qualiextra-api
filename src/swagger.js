// Configuration et génération de la spécification OpenAPI (Swagger)
// Ce fichier utilise `swagger-jsdoc` pour charger les blocs JSDoc présents
// dans les fichiers `./src/routes/*.js` et `./src/controllers/*.js`.
//
// En complément, la fonction `autoPathsSync()` scanne les fichiers de
// `src/routes` pour détecter automatiquement les appels `router.get/post/...`
// et crée des entrées OpenAPI minimales (méthode + chemin + réponse 200),
// afin d'afficher toutes les routes même si aucun commentaire JSDoc
// n'a été fourni.
//
// Notes :
// - Les paramètres de chemin `:id` sont convertis en `{id}`.
// - Pour des descriptions complètes (schemas, requestBody détaillés, exemples),
//   ajoute des blocs JSDoc `@openapi` dans les routes ou controllers.
// - Un `bearerAuth` minimal est ajouté dans `components.securitySchemes`.

import swaggerJSDoc from 'swagger-jsdoc';
import fs from 'fs';
import path from 'path';

// Options passées à swagger-jsdoc. `apis` indique où chercher les blocs JSDoc.
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
        url: process.env.BASE_URL || 'http://localhost:3000',
      },
    ],
    // Composants globaux: security schemes et schemas réutilisables
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        LoginRequest: {
          type: 'object',
          properties: {
            email: { type: 'string' },
            password: { type: 'string' }
          },
          required: ['email', 'password']
        },
        RegisterRequest: {
          type: 'object',
          properties: {
            firstname: { type: 'string' },
            lastname: { type: 'string' },
            email: { type: 'string' },
            password: { type: 'string' }
          },
          required: ['firstname', 'lastname', 'email', 'password']
        },
        User: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            firstname: { type: 'string' },
            lastname: { type: 'string' },
            email: { type: 'string' },
            role: { $ref: '#/components/schemas/Roles' }
          }
        },
        Roles: {
          type: 'string',
          enum: ['user', 'admin']
        }
      }
    }
  },
  apis: ['./src/routes/*.js', './src/controllers/*.js'],
};

// Scanne `src/routes` pour générer des entrées OpenAPI minimales.
// Utile lorsque les fichiers de route ne contiennent pas de blocs JSDoc.
function autoPathsSync() {
  const routesDir = path.join(process.cwd(), 'src', 'routes');
  const paths = {};
  if (!fs.existsSync(routesDir)) return paths;

  // Récupère tous les fichiers .js du dossier routes
  const files = fs.readdirSync(routesDir).filter(f => f.endsWith('.js'));
  const routeFilePattern = /router\.(get|post|put|delete|patch)\s*\(\s*['"`]([^'"`]+)['"`]/g;

  for (const file of files) {
    const content = fs.readFileSync(path.join(routesDir, file), 'utf8');
    let match;
    while ((match = routeFilePattern.exec(content)) !== null) {
      const method = match[1].toLowerCase();
      let routePath = match[2];

      // Convertir les paramètres Express `:id` en format OpenAPI `{id}`
      routePath = routePath.replace(/:([a-zA-Z0-9_]+)/g, '{$1}');
      if (!routePath.startsWith('/')) routePath = '/' + routePath;
      const fullPath = (`/api${routePath}`).replace(/\/+/g, '/');

      // Crée une opération minimale si elle n'existe pas déjà
      if (!paths[fullPath]) paths[fullPath] = {};
      if (!paths[fullPath][method]) {
        paths[fullPath][method] = {
          tags: [path.basename(file, '.js')],
          summary: `Auto-generated: ${method.toUpperCase()} ${fullPath}`,
          responses: {
            '200': { description: 'Successful response' }
          }
        };
      }
    }
  }

  return paths;
}

// Génération du spec final: on fusionne les paths auto-générés
// avec ceux produits par swagger-jsdoc à partir des JSDoc.
const baseSpec = swaggerJSDoc(options);
const generated = autoPathsSync();

baseSpec.paths = Object.assign({}, generated, baseSpec.paths || {});

// S'assure que les components contiennent les securitySchemes et schemas définis
baseSpec.components = baseSpec.components || {};
baseSpec.components.securitySchemes = baseSpec.components.securitySchemes || options.definition.components.securitySchemes;
baseSpec.components.schemas = Object.assign({}, options.definition.components.schemas, baseSpec.components.schemas || {});

export default baseSpec;
