const express = require('express');
// to avoid cross-origin resource sharing issue when debugging on web
const cors = require('cors');
// Netflix dependencies
const Netflix = require('netflix2');
const netflix = new Netflix();
// JSON dependencies for login stuff
const bodyParser = require('body-parser');
const jsonfile = require('jsonfile');
// import bcrypt for hashing passwords
const bcrypt = require('bcrypt');

const app = express();

//enables web debug (hopefully)
app.use(cors());
const port = 3000;
const usersFile = '/home/halincandenza/personalProjects/realReactTestrun/users.json';

// Middleware for parsing JSON request bodies
app.use(bodyParser.json());

// Signup route
app.post('/signup', cors(), async (req, res) => {
    console.log(req, "this is req")
  const { email, password } = req.body;

  
  // bcrypt hashing
  const hashedPassword = await bcrypt.hash(password, 10);

  
  jsonfile.readFile(usersFile, (err, users) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    if (users.some((user) => user.email === email)) {
      res.status(400).json({ error: 'User with this email already exists' });
      return;
    }

    const newUser = { email, hashedPassword }; //storing hashed pw
    users.push(newUser);

    jsonfile.writeFile(usersFile, users, (writeErr) => {
      if (writeErr) {
        res.status(500).json({ error: writeErr.message });
      } else {
        res.status(201).json(newUser);
      }
    });
  });
});

// Login route
app.post('/login', (req, res) => {
    const { email, password } = req.body;
  
    jsonfile.readFile(usersFile, async (err, users) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
  
      const user = users.find((u) => u.email === email);
  
      if (user) {
        // comparing submitted password with the stored hashed password

        const passwordMatch = await bcrypt.compare(password, user.hashedPassword);
  
        if (passwordMatch) {
          res.status(200).json({ email: user.email });
          console.log("password match")
        } else {
          res.status(401).json({ error: 'Invalid email or password' });
        }
      } else {
        res.status(401).json({ error: 'Invalid email or password' });
      }
    });
  });

// Netflix viewing history route
app.get('/viewing-history', async (req, res) => {
  const credentials = {
    email: 'mclaugth01@esj.org',
    password: '#######',
  };

  try {
    await new Promise((resolve, reject) => {
      netflix.login(credentials, (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      });
    });

    netflix.getViewingHistory((error, history) => {
      if (error) {
        res.status(500).json({ error: error.message });
      } else {
        res.json(history);
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});