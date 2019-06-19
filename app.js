const express       = require("express"),
      app           = express(),
      passport      = require("passport"),
      LocalStrategy = require("passport-local").Strategy,
      mongoose      = require("mongoose"),
      User          = require("./models/user");

//Passport

// Configure the local strategy for use by Passport.
//
// The local strategy require a `verify` function which receives the credentials
// (`username` and `password`) submitted by the user.  The function must verify
// that the password is correct and then invoke `done` with a user object, which
// will be set at `req.user` in route handlers after authentication.

passport.use(new LocalStrategy(User.authenticate()));

// Configure Passport authenticated session persistence.
//
// In order to restore authentication state across HTTP requests, Passport needs
// to serialize users into and deserialize users out of the session.  The
// typical implementation of this is as simple as supplying the user ID when
// serializing, and querying the user record by ID from the database when
// deserializing.

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//mongoDB connection string
const uri = "<MongoDB connection string>";

mongoose.connect(uri,{useNewUrlParser: true})
  .then(() => {
    app.listen(3000);
		// console.log(process.env);
    console.log('Database Connected!');
	})
  .catch(err => console.log(err));


//Rendering of ejs templates
app.set("views", __dirname + "/views");
app.set("view engine","ejs");

app.use(require('body-parser').urlencoded({ extended: false }));
//Passport config
app.use(require('express-session')({ secret: 'keyboard cat', resave: false, saveUninitialized: false }));

// Initialize Passport and restore authentication state, if any, from the
// session.
app.use(passport.initialize());
app.use(passport.session());

//Routes
app.get("/", (req,res,next) => {
  res.render("home", {user: req.user});
});

app.get("/login", (req,res,next) => {
  res.render("login");
});

app.post('/login', passport.authenticate('local', { failureRedirect: '/login' }), (req, res, next) => {
    res.redirect('/');
});

app.get('/logout', (req, res, next) => {
    req.logout();
    res.redirect('/');
});

app.get('/profile', require('connect-ensure-login').ensureLoggedIn(), (req, res, next) => {
    res.render('profile', { user: req.user });
});

//Register

app.get("/register", (req,res,next) => {
  res.render("register");
});

app.post("/register", (req,res) => {
  const newUser = new User({
        username: req.body.username,
        name: req.body.name,
        email: req.body.email
  });
  // console.log(req);
  //User.register default route of passport.js
  User.register(newUser, req.body.password, (err,user) => {
    if(err){
            return res.render("register");
    }
    // passport.authenticate is also a default route of passport.js
    passport.authenticate('local')(req, res, () => {
            req.logout();
            res.redirect('/');
    });
  });
});

