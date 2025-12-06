
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const { Sequelize } = require('sequelize');
require('dotenv').config();

const connectionString = `postgresql://${process.env.PGUSER}:${encodeURIComponent(
  process.env.PGPASSWORD
)}@${process.env.PGHOST}/${process.env.PGDATABASE}?sslmode=require&options=endpoint%3D${process.env.PGENDPOINTID}`;

console.log('Connecting with:');
console.log(
  connectionString.replace(process.env.PGPASSWORD, '********')
);

const sequelize = new Sequelize(connectionString, {
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
      
      checkServerIdentity: () => undefined
    }
  }
});

(async () => {
  try {
    await sequelize.authenticate();
    console.log('Connected OK!');
  } catch (err) {
    console.error('Failed:', err);
  } finally {
    await sequelize.close().catch(() => {});
    process.exit();
  }
})();
