const express = require('express');
const { rejectUnauthenticated } = require('../modules/authentication-middleware');
const encryptLib = require('../modules/encryption');
const pool = require('../modules/pool');
const userStrategy = require('../strategies/user.strategy');

const router = express.Router();

// Handles Ajax request for user information if user is authenticated
router.get('/', rejectUnauthenticated, (req, res) => {
  res.send(req.user);
});

// GET current user's details
router.get('/details', (req, res) => {
  let id = [req.user.id];
  let SQLquery = `SELECT * FROM "user"
                  WHERE id = $1;`;
  pool.query(SQLquery, id)
  .then(response=>{
      res.send(response.rows[0]);
  })
  .catch(error=>{
    console.log('ERROR IN /details GET ---------------------------------------->', error);
    res.sendStatus(500);
  });
});

// GET user search results
router.get('/search/:id', (req, res) => {
  let id = ['%' + req.params.id + '%'];
  let SQLquery = `SELECT * FROM "user"
                  WHERE lower(username) SIMILAR TO $1;`;
  pool.query(SQLquery, id)
  .then(response=>{
      res.send(response.rows);
  })
  .catch(error=>{
    console.log('ERROR IN /search/:id GET ---------------------------------------->', error);
    res.sendStatus(500);
  });
});

// PUT (update) current user's bio
router.put('/details/bio', (req, res) => {
  let id = [req.body.data, req.user.id];
  let SQLquery = `UPDATE "user"
                  SET bio = $1
                  WHERE id = $2;`;
  pool.query(SQLquery, id)
  .then(response=>{
      res.send(response.rows);
  })
  .catch(error=>{
    console.log('ERROR IN /details/bio PUT ---------------------------------------->', error);
    res.sendStatus(500);
  });
});

// PUT (update) current user's username
router.put('/details/username', (req, res) => {
  let id = [req.body.data, req.user.id];
  let SQLquery = `UPDATE "user"
                  SET username = $1
                  WHERE id = $2;`;
  pool.query(SQLquery, id)
  .then(response=>{
      res.send(response.rows);
  })
  .catch(error=>{
    console.log('ERROR IN /details/username PUT ---------------------------------------->', error);
    res.sendStatus(500);
  });
});

// Handles POST request with new user data
router.post('/register', (req, res, next) => {  
  const username = req.body.username;
  const password = encryptLib.encryptPassword(req.body.password);

  const queryText = 'INSERT INTO "user" (username, password) VALUES ($1, $2) RETURNING id';
  pool.query(queryText, [username, password])
    .then(() => res.sendStatus(201))
    .catch(() => res.sendStatus(500));
});

// Handles login form authenticate/login POST
router.post('/login', userStrategy.authenticate('local'), (req, res) => {
  res.sendStatus(200);
});

// clear all server session information about this user
router.post('/logout', (req, res) => {
  req.logout();
  res.sendStatus(200);
});

module.exports = router;
