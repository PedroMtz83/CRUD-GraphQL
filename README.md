# API GraphQL para Gestión de Tareas

Esta es una API GraphQL simple construida con Node.js, Express y Apollo Server para gestionar tareas.

## Instalación

```bash
npm install
```

## Ejecución del servidor

```bash
npm start
```

El servidor estará disponible en: `http://localhost:4000/graphql`

## Operaciones disponibles

### Consultas (Queries)

1. Obtener todas las tareas:
```graphql
query {
  tasks {
    id
    title
    completed
  }
}
```

2. Obtener una tarea específica por ID:
```graphql
query {
  task(id: "1") {
    id
    title
    completed
  }
}
```

### Mutaciones (Mutations)

1. Crear una nueva tarea:
```graphql
mutation {
  createTask(title: "Nueva tarea") {
    id
    title
    completed
  }
}
```

2. Actualizar una tarea existente:
```graphql
mutation {
  updateTask(id: "1", title: "Tarea actualizada", completed: true) {
    id
    title
    completed
  }
}
```

3. Eliminar una tarea:
```graphql
mutation {
  deleteTask(id: "1")
}
```