var express = require("express");
var bodyParser = require("body-parser");
var app = express();

const { ApolloServer, gql } = require("apollo-server");
const db = require(`${__dirname}/lib/db`);
const typeDefs = gql`

type Tip {
  id : Int
  memo_id: Int
  tip: String
  }
  type Memo {
    id : Int
    title: String
    content: String
    status : String
    create_at : String
    tips : [Tip]
  }
 

  type Query {
    memos: [Memo]
    memo(id:Int) : Memo
  }
  
  type Mutation {
    createMemo(title: String!,author: String!): Boolean
    deleteBook(id: Int!): Boolean
  }

`;


let tips = [
  {
    id : 1,
    memo_id: 1,
    tip : "aaaaa"
  },
  {
    id : 2,
    memo_id: 1,
    tip : "bbbbb"
  },
  {
    id : 3,
    memo_id: 1,
    tip : "cccccc"
  },
  {
    id : 4,
    memo_id: 2,
    tip : "asdf"
  },
  {
    id : 5,
    memo_id: 2,
    tip : "qwer"
  },
  {
    id : 6,
    memo_id: 2,
    tip : "dfgh"
  }
]

const resolvers = {
    Query: {
      memos: async () =>{ 
        const memo_all = db.mybatisMapper.getStatement(
          "MEMO",
          "SELECT_MEMO_ALL.SELECT",
          {
          },
          { language: "sql", indent: "  " }
        )
        console.log(memo_all);
        var memos = await db.sequelize.query(memo_all, {
          type: db.sequelize.QueryTypes.SELECT,
        });
        console.log("12334",memos);
        const dap = memos.map((memo) =>{
        memo.tips = tips.filter((tip) =>{
          return memo.id == tip.memo_id
        })
        console.log("memo",memo);
        return memo 
      });  return dap },
      
      memo: async (_,args) => {
        console.log(args);
        const memo_one = db.mybatisMapper.getStatement(
          "MEMO",
          "SELECT_MEMO_ONE.SELECT",
          {
            id : args.id
          },
          { language: "sql", indent: "  " }
        )

        var memos = await db.sequelize.query(memo_one, {
          type: db.sequelize.QueryTypes.SELECT,
        });
        //const result = books.filter((book) => {book.id === args.id}); 
        const result = memos.filter((memo) =>{
          memo.tips = tips.filter((tip) =>{
            return memo.id == tip.memo_id
          }) 
          return memo.id === args.id});

        return result[0];
      }

    },
    /*
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
    */
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
  
