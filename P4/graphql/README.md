# Manual de Uso de GraphQL

## Introducción a GraphQL

GraphQL es un lenguaje de consulta para APIs y un tiempo de ejecución para ejecutar esas consultas con tus datos existentes. GraphQL te permite solicitar exactamente los datos que necesitas y nada más.

## Instalación

Para instalar GraphQL en un proyecto Node.js, puedes usar npm o yarn:

```bash
npm install graphql
# o
yarn add graphql
```

## Ejemplo Básico

A continuación se muestra un ejemplo básico de cómo configurar un servidor GraphQL usando `apollo-server`.

### Instalación de Dependencias

```bash
npm install apollo-server graphql
```

### Configuración del Servidor

```javascript
// filepath: /home/stevengez/Documents/Github/Practicas-SA-A-201602938/P4/graphql/server.js
const { ApolloServer, gql } = require('apollo-server');

// Esquema GraphQL
const typeDefs = gql`
  type Query {
    hello: String
  }
`;

// Resolvers
const resolvers = {
  Query: {
    hello: () => 'Hello world!',
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`Servidor GraphQL ejecutándose en ${url}`);
});
```

## Consultas Básicas

Una consulta básica en GraphQL se ve así:

```graphql
{
  hello
}
```

La respuesta será:

```json
{
  "data": {
    "hello": "Hello world!"
  }
}
```

## Definición de Esquemas

En GraphQL, defines el esquema de tu API utilizando el lenguaje de esquema de GraphQL (GraphQL Schema Language). Aquí hay un ejemplo de un esquema más complejo:

```graphql
type Query {
  user(id: ID!): User
}

type User {
  id: ID
  name: String
  age: Int
}
```

## Mutaciones

Las mutaciones en GraphQL se utilizan para modificar datos en el servidor. Aquí hay un ejemplo de una mutación para agregar un nuevo usuario:

```graphql
type Mutation {
  addUser(name: String!, age: Int!): User
}
```

Y el resolver correspondiente:

```javascript
// filepath: /home/stevengez/Documents/Github/Practicas-SA-A-201602938/P4/graphql/resolvers.js
const resolvers = {
  Query: {
    user: (parent, args, context, info) => {
      // lógica para obtener un usuario por ID
    },
  },
  Mutation: {
    addUser: (parent, args, context, info) => {
      // lógica para agregar un nuevo usuario
    },
  },
};
```

## Consultas desde Postman

Para hacer una consulta GraphQL desde Postman, sigue estos pasos:

1. Abre Postman y crea una nueva solicitud.
2. Selecciona el método `POST`.
3. En la URL, ingresa `http://localhost:4000/graphql`.
4. Ve a la pestaña `Body` y selecciona `raw`.
5. En el menú desplegable a la derecha, selecciona `GRAPHQL`.
6. Ingresa la consulta GraphQL en el cuerpo de la solicitud. Por ejemplo:

```graphql
{
  query: { hello }
}
```

7. Haz clic en `Send` para enviar la solicitud.

La respuesta será similar a:

```json
{
  "data": {
    "hello": "Hello world!"
  }
}
```

## Conclusión

GraphQL es una poderosa alternativa a REST para construir APIs. Permite a los clientes solicitar exactamente los datos que necesitan y facilita la evolución de las APIs a lo largo del tiempo. Este manual cubre los conceptos básicos, pero hay mucho más por aprender y explorar en el mundo de GraphQL.
