const path = require("path");
const Sequelize = require("sequelize");
const mybatisMapper = require("mybatis-mapper");
const db = {};

const sequelize = new Sequelize(
    "postgres://postgres:password@localhost:5432/postgres",
    {
      dialect: "postgres",
      dialectOptions: {
        statement_timeout: 5000,
        idle_in_transaction_session_timeout: 5000
      },
      define: {},
      pool: {
        max: 60,
        min: 0,
        idle: 10000,
        acquire: 20000
      },
      logging: console.log,
  
    }
  );

  const sqlPath = path.join(__dirname, "..", ".", `/sql`);
  mybatisMapper.createMapper([`${sqlPath}/memo.xml`]);

    db.sequelize = sequelize;
    db.mybatisMapper = mybatisMapper;
  
  module.exports = db;
  