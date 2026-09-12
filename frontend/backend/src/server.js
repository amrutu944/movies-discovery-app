const app = require('./app');
const { port } = require('./config/env');

require('./config/db'); // ensures the SQLite file + schema exist before we accept traffic

app.listen(port, '0.0.0.0', () => {
  console.log(`Movie discovery API listening on http://0.0.0.0:${port}`);
});
