const express = require('express');
const queryString = require('query-string');
const cookieParser = require('cookie-parser');

const app = express();

const USERS = [
  {id: 1,
   firstName: 'Joe',
   lastName: 'Schmoe',
   userName: 'joeschmoe@business.com',
   position: 'Sr. Engineer',
   isAdmin: true,
   // NEVER EVER EVER store passwords in plain text in real life. NEVER!!!!!!!!!!!
   password: 'password',
   token: null
  }, 
  {id: 2,
   firstName: 'Sally',
   lastName: 'Student',
   userName: 'sallystudent@business.com',
   position: 'Jr. Engineer',
   isAdmin: true,
   // NEVER EVER EVER store passwords in plain text in real life. NEVER!!!!!!!!!!!
   password: 'password',
   token: null
  },
  {id: 3,
   firstName: 'Lila',
   lastName: 'LeMonde',
   userName: 'lila@business.com',
   position: 'Growth Hacker',
   isAdmin: false,
   // NEVER EVER EVER store passwords in plain text in real life. NEVER!!!!!!!!!!!
   password: 'password',
   token: null
  },
  {id: 4,
   firstName: 'Freddy',
   lastName: 'Fun',
   userName: 'freddy@business.com',
   position: 'Community Manager',
   isAdmin: false,
   // NEVER EVER EVER store passwords in plain text in real life. NEVER!!!!!!!!!!!
   password: 'password',
   token: null
  }
];


function gateKeeper(req, res, next) {
  console.log('gateKeeper')
  // get the 'token' cookie and convert it from a string to a number
  const token = parseFloat(req.cookies.token);  
  
  // attempt to match the value of the token to the user.token
  // if a match is found, set the req.user value and call the next() middleware
  req.user = USERS.find((usr, index) => usr.token === token);
  
  console.log(`current user is: ${req.user && req.user.userName}`)
  // if the user exists, then reset the token cookie for an additional 5 minutes. If the user is idle
  // for more than 5 minutes, then should be redirected back to the login page.
  if (req.user) {
    res.cookie('token', req.user.token, { expires: new Date(Date.now() + 300000), httpOnly: true });
  }
  next();
}

app.use(cookieParser());
app.use(gateKeeper);

// "login" route
app.get("/login", (req, res) => {
  console.log('login')
  // extract the user and pass from the x-username-and-password header
  const {user, pass} = Object.assign({user: null, pass: null}, queryString.parse(req.get('x-username-and-password')));
  
  // attempt to find the user by matching the user/pass to the usr.userName and usr.password
  const currUser = USERS.find(
    (usr, index) => usr.userName === user && usr.password === pass);
  
  // if no match is found, currUser will be undefined, so send a 403 error
  if (!currUser) {
    console.log('send error message to supply valid user creds')
    return res.status(403).json({message: 'Must supply valid user credentials'});
  }
  
  // if a match is found then create a random number and save it to the current user object
  currUser.token = Math.random();
  
  // create a cookie named 'token' and set it to the random number, set a 5 minute expiration and set httpOnly
  // Note, the expiration will cause the cookie to expire in 5 minutes so the user need to login again
  // The `httpOnly` option is not technically used in the demo, just good to know about (look it up ;-)
  res.cookie('token', currUser.token, { expires: new Date(Date.now() + 300000), httpOnly: true });
  console.log('set cookie and redirect to / (home)')
  // redirect to the "homepage" 
  return res.redirect('/');
});

// "homepage" route
app.get("/", (req, res) => {
  console.log("/ (home)")
  // if req.user, which is set in the gateKeeper middleware, is falsey then redirect back to the login page
  if (!req.user) {
    console.log('no user, so redirect to /login')
    return res.redirect('/login');
  }
  // if the req.user does exist, then pluck the values from the req.user object
  console.log('user exists so get values and respond')
  const {firstName, lastName, id, userName, position} = req.user;
  // And return them to the client (EG postman)
  return res.json({firstName, lastName, id, userName, position});
});

app.listen(process.env.PORT, () => {
  console.log(`Your app is listening on port ${process.env.PORT}`);
});
