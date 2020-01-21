const express = require('express');
const { rejectUnauthenticated } = require('../modules/authentication-middleware');
const encryptLib = require('../modules/encryption');
const pool = require('../modules/pool');
const userStrategy = require('../strategies/user.strategy');

const router = express.Router();

// Handles Ajax request for user information if user is authenticated
router.get('/', rejectUnauthenticated, (req, res) => {
  // Send back user object from the session (previously queried from the database)
  res.send(req.user);
});

// DELETE user follow
router.delete('/following/:id', (req, res) => {
  let id = [req.user.id, req.params.id];
  let SQLquery = `DELETE FROM following
                  WHERE user_id = $1 AND connection_id = $2;`;
  pool.query(SQLquery, id)
  .then(response=>{
      res.send(response.rows);
  })
  .catch(error=>{
    console.log('ERROR IN /following/:id DELETE ---------------------------------------->', error);
    res.sendStatus(500);
  });
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

// GET other user's details
router.get('/details/:id', (req, res) => {
  let id = [req.params.id];
  let SQLquery = `SELECT * FROM "user"
                  WHERE id = $1;`;
  pool.query(SQLquery, id)
  .then(response=>{
      res.send(response.rows[0]);
  })
  .catch(error=>{
    console.log('ERROR IN /details/:id GET ---------------------------------------->', error);
    res.sendStatus(500);
  });
});

// GET following table data
router.get('/following/details', (req, res) => {
  let id = [req.user.id];
  let SQLquery = `SELECT * FROM following
                  WHERE user_id = $1;`;
  pool.query(SQLquery, id)
  .then(response=>{
      res.send(response.rows);
  })
  .catch(error=>{
    console.log('ERROR IN /following/details GET ---------------------------------------->', error);
    res.sendStatus(500);
  });
});

// GET following table data
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

// POST user follow
router.post('/following', (req, res) => {
  let id = [req.user.id, req.body.data];
  let SQLquery = `INSERT INTO following (user_id, connection_id)
                  VALUES($1, $2);`;
  pool.query(SQLquery, id)
  .then(response=>{
      res.send(response.rows);
  })
  .catch(error=>{
    console.log('ERROR IN /following POST ---------------------------------------->', error);
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
// The only thing different from this and every other post we've seen
// is that the password gets encrypted before being inserted
router.post('/register', (req, res, next) => {  
  const username = req.body.username;
  const password = encryptLib.encryptPassword(req.body.password);

  const queryText = 'INSERT INTO "user" (username, password) VALUES ($1, $2) RETURNING id';
  pool.query(queryText, [username, password])
    .then(() => res.sendStatus(201))
    .catch(() => res.sendStatus(500));
});

// Handles login form authenticate/login POST
// userStrategy.authenticate('local') is middleware that we run on this route
// this middleware will run our POST if successful
// this middleware will send a 404 if not successful
router.post('/login', userStrategy.authenticate('local'), (req, res) => {
  res.sendStatus(200);
});

// clear all server session information about this user
router.post('/logout', (req, res) => {
  // Use passport's built-in method to log out the user
  req.logout();
  res.sendStatus(200);
});

module.exports = router;
