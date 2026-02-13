import swagger from './src/swagger.js';

console.log('--- Swagger spec summary ---');
console.log('paths count:', Object.keys(swagger.paths || {}).length);
console.log('first paths:', Object.keys(swagger.paths || {}).slice(0,50));
console.log('schemas:', Object.keys((swagger.components && swagger.components.schemas) || {}).slice(0,50));
console.log('securitySchemes:', Object.keys((swagger.components && swagger.components.securitySchemes) || {}));
console.log('servers:', (swagger.servers || swagger.info || {}).url || JSON.stringify(swagger.servers || swagger.info));
console.log('--- end ---');
