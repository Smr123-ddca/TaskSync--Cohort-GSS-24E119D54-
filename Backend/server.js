require('dotenv').config();
const app = require('./app');
const { initDatabase } = require('./db/InitDb');

const PORT = process.env.PORT || 3000;


initDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`TaskSync API running on http://localhost:${PORT}`);
  });
});