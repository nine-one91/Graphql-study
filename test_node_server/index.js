var todos = [
  {
    description: "desc 1",
    title: "Todo 1",
  },
  {
    description: "desc 2",
    title: "Todo 2",
  },
  {
    description: "desc 3",
    title: "Todo 3",
  },
  {
    description: "desc 4",
    title: "Todo 4",
  },
  {
    description: "desc 5",
    title: "Todo 5",
  },
];

const { ApolloServer, gql } = require("apollo-server");
// const typeDefs = require("./schema/schema");
// const resolvers = require("./resolver/resolver");

const typeDefs = gql`
  type Todo {
    title: String
    description: String
  }

  type Query {
    todos: [Todo]
    todo(title: String): Todo
  }

  type Mutation {
    deleteTodo(title: String): Todo
    insertTodo(title: String, description: String): Todo
    editTodo(title: String, description: String): Todo
  }
`;

const resolvers = {
  Query: {
    todos: () => todos,
    todo: (parent, args, context, info) =>
      todos.filter((todo) => {
        return todo.title === args.title;
      })[0],
  },
  Mutation: {
    deleteTodo: (parent, args, context, info) => {
      const deleted = todos.filter((todo) => {
        return todo.title === args.title;
      })[0];

      todos = todos.filter((todo) => {
        return todo.title !== args.title;
      });
      return deleted;
    },
    insertTodo: (parent, args, context, info) => {
      todos.push(args);
      return args;
    },
    editTodo: (parent, args, context, info) => {
      return todos
        .filter((todo) => {
          return todo.title === args.title;
        })
        .map((todo) => {
          Object.assign(todo, args);
          return todo;
        })[0];
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  csrfPrevention: true,
});

server.listen().then(({ url }) => {
  console.log(`Run Server at ${url}`);
});
