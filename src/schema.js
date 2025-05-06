const { gql } = require('apollo-server-express');

const typeDefs = gql`
  # Definición de tipo de datos para Tarea
  type Task {
    id: ID!
    title: String!
    completed: Boolean!
    createdAt: String
    updatedAt: String
  }
  
  # Consultas disponibles
  type Query {
    # Obtener todas las tareas
    tasks: [Task]
    
    # Obtener una tarea específica por ID
    task(id: ID!): Task
  }
  
  # Mutaciones disponibles
  type Mutation {
    # Crear una nueva tarea (solo requiere título)
    createTask(title: String!): Task
    
    # Actualizar una tarea existente (título y estado de completado son opcionales)
    updateTask(id: ID!, title: String, completed: Boolean): Task
    
    # Eliminar una tarea (devuelve true si se eliminó correctamente)
    deleteTask(id: ID!): Boolean
  }
`;

module.exports = { typeDefs };