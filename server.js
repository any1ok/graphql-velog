var express = require("express");
var bodyParser = require("body-parser");
var app = express();

const { ApolloServer, gql } = require("apollo-server");


const typeDefs = gql`
type Content{
  book_id: Int
  page :Int
  text: String
}
  type Book {
    id : Int
    title: String
    author: String
    contents : [Content]
  }
 

  type Query {
    books: [Book]
    book(id:Int) : Book
  }
  
  type Mutation {
    createBook(title: String!,author: String!): Boolean
    deleteBook(id: Int!): Boolean
  }

`;

let books = [
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

let contents = [
  {
    book_id: 1,
    page : 1,
    text : "aaaaa"
  },
  {
    book_id: 1,
    page : 2,
    text : "bbbbb"
  },
  {
    book_id: 1,
    page : 3,
    text : "cccccc"
  },
  {
    book_id: 1,
    page : 4,
    text : "ddddd"
  },
  {
    book_id: 1,
    page : 5,
    text : "eeeee"
  },
  {
    book_id: 2,
    page : 1,
    text : "asdf"
  },
  {
    book_id: 2,
    page : 2,
    text : "qwer"
  },
  {
    book_id: 2,
    page : 3,
    text : "dfgh"
  },
  {
    book_id: 2,
    page : 4,
    text : "dgh"
  }
]

const resolvers = {
    Query: {
      books: () => books.map((book) =>{
        book.contents = contents.filter((content) =>{
          return book.id == content.book_id
        })
        return book
      }),
      
      book: (_,args) => {

        //const result = books.filter((book) => {book.id === args.id}); 
        const result = books.filter((book) =>{
          book.contents = contents.filter((content) =>{
            return book.id == content.book_id
          }) 
          return book.id === args.id});

        return result[0];
      }

    },
    Mutation: {
  
      createBook: (_,args) => {
       
        console.log(args);
        let title = args.title;
        let author = args.author;
        let id = books.length+1;
        let book_temp = {id : id,title : title, author : author }
        books.push(book_temp);
        return true
      },
      deleteBook: (_,args) => {
        const findbook= books.find(function(book) {
          return book.id === 1
          });
          const idx = books.indexOf(findbook);
          books.splice(idx, 1);
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
  
