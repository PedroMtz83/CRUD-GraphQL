const { db } = require('./config/firebase');

const resolvers = {
  Query: {
    // Resolver para obtener todas las tareas
    tasks: async () => {
      try {
        console.log('📋 Obteniendo todas las tareas...');
        const tasksSnapshot = await db.collection('tasks').get();
        
        // Convertir documentos de Firestore a formato de tarea
        const tasks = tasksSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        console.log(`✅ ${tasks.length} tareas recuperadas correctamente`);
        return tasks;
      } catch (error) {
        console.error("❌ Error al obtener tareas:", error);
        throw new Error("Error al recuperar las tareas de Firebase");
      }
    },
    
    // Resolver para obtener una tarea por ID
    task: async (_, { id }) => {
      try {
        console.log(`🔍 Buscando tarea con ID: ${id}`);
        const taskDoc = await db.collection('tasks').doc(id).get();
        
        // Verificar si la tarea existe
        if (!taskDoc.exists) {
          console.log(`❌ Tarea con ID ${id} no encontrada`);
          throw new Error(`Tarea con ID ${id} no encontrada`);
        }
        
        const task = {
          id: taskDoc.id,
          ...taskDoc.data()
        };
        
        console.log(`✅ Tarea encontrada: ${task.title}`);
        return task;
      } catch (error) {
        console.error(`❌ Error al obtener tarea con ID ${id}:`, error);
        throw new Error(`Error al recuperar la tarea: ${error.message}`);
      }
    }
  },
  
  Mutation: {
    // Resolver para crear una nueva tarea
    createTask: async (_, { title }) => {
      try {
        console.log(`➕ Creando nueva tarea: "${title}"`);
        
        // Validar que el título no esté vacío
        if (!title || title.trim() === '') {
          throw new Error('El título de la tarea no puede estar vacío');
        }
        
        // Crear objeto de tarea con timestamp
        const newTask = {
          title: title.trim(),
          completed: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        // Añadir a Firestore
        const docRef = await db.collection('tasks').add(newTask);
        
        const createdTask = {
          id: docRef.id,
          ...newTask
        };
        
        console.log(`✅ Tarea creada con ID: ${createdTask.id}`);
        return createdTask;
      } catch (error) {
        console.error("❌ Error al crear tarea:", error);
        throw new Error(`Error al crear la tarea: ${error.message}`);
      }
    },
    
    // Resolver para actualizar una tarea existente
    updateTask: async (_, { id, title, completed }) => {
      try {
        console.log(`🔄 Actualizando tarea con ID: ${id}`);
        
        const taskRef = db.collection('tasks').doc(id);
        const taskDoc = await taskRef.get();
        
        // Verificar si la tarea existe
        if (!taskDoc.exists) {
          console.log(`❌ Tarea con ID ${id} no encontrada para actualizar`);
          throw new Error(`Tarea con ID ${id} no encontrada`);
        }
        
        // Preparar datos para actualizar
        const updateData = {};
        
        if (title !== undefined) {
          // Validar que el título no esté vacío si se proporciona
          if (!title || title.trim() === '') {
            throw new Error('El título de la tarea no puede estar vacío');
          }
          updateData.title = title.trim();
        }
        
        if (completed !== undefined) {
          updateData.completed = completed;
        }
        
        // Si hay datos para actualizar, aplicar actualización
        if (Object.keys(updateData).length > 0) {
          updateData.updatedAt = new Date().toISOString();
          await taskRef.update(updateData);
          console.log(`✅ Campos actualizados: ${Object.keys(updateData).join(', ')}`);
        } else {
          console.log('ℹ️ No se proporcionaron campos para actualizar');
        }
        
        // Obtener el documento actualizado
        const updatedTaskDoc = await taskRef.get();
        
        return {
          id: updatedTaskDoc.id,
          ...updatedTaskDoc.data()
        };
      } catch (error) {
        console.error(`❌ Error al actualizar tarea con ID ${id}:`, error);
        throw new Error(`Error al actualizar la tarea: ${error.message}`);
      }
    },
    
    // Resolver para eliminar una tarea
    deleteTask: async (_, { id }) => {
      try {
        console.log(`🗑️ Eliminando tarea con ID: ${id}`);
        
        const taskRef = db.collection('tasks').doc(id);
        const taskDoc = await taskRef.get();
        
        // Verificar si la tarea existe
        if (!taskDoc.exists) {
          console.log(`❌ Tarea con ID ${id} no encontrada para eliminar`);
          throw new Error(`Tarea con ID ${id} no encontrada`);
        }
        
        // Eliminar la tarea
        await taskRef.delete();
        console.log(`✅ Tarea con ID ${id} eliminada correctamente`);
        
        return true;
      } catch (error) {
        console.error(`❌ Error al eliminar tarea con ID ${id}:`, error);
        throw new Error(`Error al eliminar la tarea: ${error.message}`);
      }
    }
  }
};

module.exports = { resolvers };