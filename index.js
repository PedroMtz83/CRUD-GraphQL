const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const { typeDefs } = require('./src/schema');
const { resolvers } = require('./src/resolvers');
require('./src/config/firebase'); // Importamos la configuración de Firebase

async function startServer() {
  const app = express();
  
  // Creación del servidor Apollo
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    formatError: (err) => {
      // Registro de errores para debugging
      console.error('Error GraphQL:', err);
      return {
        message: err.message,
        path: err.path
      };
    },
    // Configuración del playground para facilitar pruebas
    playground: {
      settings: {
        'editor.theme': 'dark',
        'editor.fontSize': 15,
        'tracing.hideTracingResponse': false,
      }
    }
  });

  // Iniciar el servidor Apollo
  await server.start();
  
  // Aplicar middleware de Apollo a Express
  server.applyMiddleware({ app });
  
  // Puerto de la aplicación
  const PORT = process.env.PORT || 4000;
  
  // Iniciar el servidor
  app.listen(PORT, () => {
    console.log(`🚀 Servidor GraphQL ejecutándose en http://localhost:${PORT}${server.graphqlPath}`);
    console.log(`📊 Playground disponible en http://localhost:${PORT}${server.graphqlPath}`);
  });
}

// Iniciar el servidor y manejar errores
startServer().catch(error => {
  console.error('❌ Error al iniciar el servidor:', error);
  process.exit(1);
});