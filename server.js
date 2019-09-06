const express = require('express');

const server = express();

const projectRouter = require('./routes/projectRouter.js');
const actionRouter = require('./routes/actionRouter.js');

server.use(express.json());
server.use(logger);

server.use('/projects', projectRouter);
server.use('/actions', actionRouter);





//custom middleware

function logger(req, res, next) {
    console.log(
      `[${new Date().toISOString()}] ${req.method} to ${req.url}`
    );
  
    next();
  };


module.exports = server;