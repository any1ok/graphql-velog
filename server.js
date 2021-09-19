var express = require("express");
var bodyParser = require("body-parser");
var app = express();

const { ApolloServer, gql } = require("apollo-server");


const typeDefs = gql`

  type Book {
    id : Int
    title: String
    author: String
  }
  
  type Query {
    books: [Book]
    book(id:Int) : Book
  }
  
  type Mutation {
    createBook(title: String!): Boolean
    deleteBook(title: String!): Boolean
  }

`;

const books = [
    {
      id: 1,
      title: 'The Awakening',
      author: 'Kate Chopin',
    },
    {
      id: 2,
      title: 'City of Glass',
      author: 'Paul Auster',
    },
  ];

const resolvers = {
    Query: {
      books: () => books,
      
      book: (_,args) => {
        console.log('args', args);
        console.log(books);
        const result = books.filter(book => book.id === args.id); 
        console.log('result',result);
        return result[0];
      }

    },
    Mutation: {
  
      // Mutation은 기본적으로 두번째 인자에 정보들(args)을 받아온다. (중요!)
      createBook: (_,args) => {
        // 받아온정보들 출력하기 ( 나중에 데이터를 추가할 기능이 들어갈 부분 )
        console.log(args);
        
        return true
      },
      deleteBook: (_,args) => {
        console.log(args);
        return true
      }
    }
  };

const server = new ApolloServer({ typeDefs, resolvers });


// server를 감시하고 있다가, 실행되면 콘솔창에 알림메시지를 보내줌

server.listen().then(({ url }) => {
console.log(`🚀  Server ready at ${url}`);
});

  
app.get("/", function (req, res) {
    res.send("Hello graphql----");
  });

app.listen(3000, function () {
    console.log("App started");
});
  
