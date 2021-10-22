const WorkerPool = require('./worker_pool.js')
const os = require('os')
require('dotenv').config()

const pool = new WorkerPool(os.cpus().length);

let finished = 0;
for (let i = 0; i < os.cpus().length; i++) {
  pool.runTask({ }, (err, result) => {
    if (++finished === os.cpus().length)
      pool.close();
  });
}