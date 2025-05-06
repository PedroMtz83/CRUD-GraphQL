const admin = require('firebase-admin');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

// Cargar variables de entorno
dotenv.config();

// Ruta al archivo de credenciales de Firebase
const serviceAccountPath = path.join(process.cwd(), 'serviceAccountKey.json');

// Verificar que el archivo de credenciales existe
if (!fs.existsSync(serviceAccountPath)) {
  console.error(' Error: No se encontró el archivo serviceAccountKey.json');
  console.error('Por favor, asegúrate de crear este archivo en la raíz del proyecto');
  process.exit(1);
}

// Cargar las credenciales
let serviceAccount;
try {
  serviceAccount = require(serviceAccountPath);
  console.log('Credenciales de Firebase cargadas correctamente');
} catch (error) {
  console.error('❌ Error al cargar el archivo de credenciales de Firebase:', error.message);
  process.exit(1);
}

// Inicializar Firebase Admin
try {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.FIREBASE_DATABASE_URL || 'https://crud-graphql.firebaseio.com'
  });
  console.log(' Conexión con Firebase establecida correctamente');
} catch (error) {
  console.error('❌ Error al inicializar Firebase:', error.message);
  process.exit(1);
}

// Exportar instancia de Firestore
const db = admin.firestore();

module.exports = { admin, db };