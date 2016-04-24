var Thing = require('./models/thing');  // load the thing mongoose model - change as needed
var User = require('./models/user');  // load the User mongoose model for passport.js authentication
var twilio = require('twilio');
var Chat = require('./models/chat');

module.exports = function(app, passport) {
  // api ---------------------------------------------------------------------
  // create thing
  app.post('/api/things', function(req, res) {
          console.log('req body: ' + JSON.stringify(req.body));
    Thing.create({
                  title : req.body.title,
                  author : req.body.author,
                  body : req.body.body,
                  hidden : req.body.hidden,
                  user : req.body.user
    }, function(err, thing) {
      if (err) {
        res.send(err);
      }
      res.json(thing);
    });
  });

  // get all things
  app.get('/api/things', function(req, res) {
    // use mongoose to get all things from the db
    Thing.find(function(err, things) {
      // if err, send it
      if (err) {
        res.send(err);
      }
      res.json(things);
    });
  });

  // get thing by parameter
  app.get('/api/things/:parameter', function(req, res) {
    // use mongoose to get all the things using a paramater
    // TODO Populate the search obj with the needed parameter
    Thing.find({}, function(err, things) {
      // if err, send it
      if (err) {
        res.send(err);
      }
      res.json(things);
    });
  });

  // get thing by id
  app.get('/api/thing/:id', function(req, res) {
    // use mongoose to find the thing by id requested
    Thing.findById(req.params.id, function(err, thing) {
      if(err) {
        res.send(err);
      }
      res.json(thing);
                        console.log("Thing from routes: " + thing);
    });
  });

  // update a thing by id
  app.post('/api/thing/:id', function(req, res) {
    Thing.findById(req.params.id, function(err, thing) {
      if(err) {
        res.send(err);
      }
      // TODO make changes to thing
                        console.log("thing " + JSON.stringify(req.body));

                        if (thing) {
                          //update thing properties with request
                          thing.title = req.body.title;
                          thing.author = req.body.author;
                          thing.body = req.body.body;
                          thing.date = req.body.date;
                          thing.hidden = req.body.hidden;

                          thing.save(function (err) {
                                  if (err) {
                                          res.send(err);
                                  }
                                  res.json(thing);
                          });
                        } else {
                          console.log("no thing!");
                        };
    });
  });

  // delete a thing by id
  app.delete('/api/thing/:id', function(req, res) {
    Thing.remove({
      _id : req.params.id
    },
    function(err, thing) {
      if (err) {
        res.send(err);
      }
      res.send();
    });
  });

  // process the login form
  // Express Route with passport authentication and custom callback
  app.post('/api/login', function(req, res, next) {
    passport.authenticate('local-login', function(err, user, info) {
      if (err) {
        return next(err);
      }
      if (user === false) {
        res.status(401).send(req.flash('loginMessage'));
      } else {
        req.login(user, function(err) {
          if (err) {
            res.status(500).send("There has been an error");
          } else {
            res.status(200).send("success!");
          }
        });
      }
    })(req, res, next);
  });

  // get all Users
  app.get('/api/users', function(req, res) {
    // use mongoose to get all things from the db
    User.find(function(err, user) {
      // if err, send it
      if (err) {
        res.send(err);
      }
      res.json(user);
    });
  });

  // process the signup form
  // Express Route with passport authentication and custom callback
  app.post('/api/signup', function(req, res, next) {
    passport.authenticate('local-signup', function(err, user, info) {
      if (err) {
        return next(err);
      }
      if (user === false) {
        res.status(401).send(req.flash('signupMessage'));
      } else {
        res.status(200).send("success!");
      }
    })(req, res, next);
  });

  // check if the user is logged in an retrieve a different user obj based on the status
  app.get('/loggedin', function(req, res) {
    var user = {};
    if (req.isAuthenticated()) {
      user.isLoggedIn = true;
      user.email = req.user.local.email;
      user.admin = req.user.local.admin;
      user.notes = req.user.local.notes;
    } else {
      user.isLoggedIn = false;
      user.email = undefined;
    }
    res.json(user);
  });

  // log the user out and redirect to /
  app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
  });

  // Twilio routes
  app.post('/api/twilio', function(req, res, next) {
    // can pass a var in
    console.log('message: ' + req.body.message);
    number = req.body.number;
    client.sendMessage( 
      { to: '+1' + number, from:'+17746437097', body: req.body.message }, 
        function( err, data ) {
          console.log( data.body );
        }
    );
  });

  app.post('/message', function (req, res) {
    var resp = new twilio.TwimlResponse();
    resp.message('Thanks for subscribing');
    res.writeHead(200, {
      'Content-Type': 'text/xml'
    });
    res.end(resp.toString());
  });

  //Chat
  // create chat
  app.post('/api/chat', function(req, res) {
          console.log('req body: ' + JSON.stringify(req.body));
    Chat.create({
                  send : req.body.send,
                  message : req.body.message,
                  recieve : req.body.recieve,
    }, function(err, chat) {
      if (err) {
        res.send(err);
      }
      res.json(chat);
    });
  });

  // get all chats
  app.get('/api/chats', function(req, res) {
    // use mongoose to get all things from the db
    Chat.find(function(err, chats) {
      // if err, send it
      if (err) {
        res.send(err);
      }
      res.json(chats);
    });
  });
};
