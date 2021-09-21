var express = require("express");
var bodyParser = require("body-parser");
var app = express();

const { ApolloServer, gql } = require("apollo-server");
const db = require(`${__dirname}/lib/db`);
const typeDefs = gql`

  type Memo {
    id : Int
    title: String
    content: String
    status : String
    create_at : String
    use_yn : String
  }
 

  type Query {
    memos: [Memo]
    memo(id:Int) : Memo
  }
  
  type Mutation {
    createMemo(title: String!,content: String!,status: String!): Int
    updateMemo(id: Int, status:String): Boolean
    deleteMemo(id: Int): Boolean
  }

`;



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
        return memos
      },
      
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

        var memo = await db.sequelize.query(memo_one, {
          type: db.sequelize.QueryTypes.SELECT,
        });

        return memo[0];
      }

    },
    
    Mutation: {
  
      createMemo:async (_,args) => {
       
        console.log(args);
        let title = args.title;
        let content = args.content;
        let status = args.status;
        const create_memo = db.mybatisMapper.getStatement(
          "MEMO",
          "CREATE_MEMO.INSERT",
          {
            title,
            content,
            status
          },
          { language: "sql", indent: "  " }
        )

        const create_data = await db.sequelize.query(create_memo, {
          type: db.sequelize.QueryTypes.INSERT,
        });

        return create_data[0][0].id
      },
      updateMemo: async (_,args) => {
        let id = args.id;
        let status = args.status;
        const update_memo = db.mybatisMapper.getStatement(
          "MEMO",
          "UPDATE_MEMO.UPDATE",
          {
            id,
            status
          },
          { language: "sql", indent: "  " }
        )
        await db.sequelize.query(update_memo, {
          type: db.sequelize.QueryTypes.UPDATE,
        });
        return true
      },
      deleteMemo: async (_,args) => {
        let id = args.id;
        const delete_memo = db.mybatisMapper.getStatement(
          "MEMO",
          "DELETE_MEMO.UPDATE",
          {
            id,
          },
          { language: "sql", indent: "  " }
        )
        await db.sequelize.query(delete_memo, {
          type: db.sequelize.QueryTypes.UPDATE,
        });
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
  
