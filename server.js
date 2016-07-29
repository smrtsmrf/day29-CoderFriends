var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var session = require('express-session');
var config = require('./config.json');
var passport = require('passport');
var GitHubStrategy = require('passport-github').Strategy;
var GitHubApi = require('github');
var port = 3000;
var corsOptions = {
	origin : 'http://localhost:' + port
}

var requireAuth = function(req, res, next) {
  if (!req.isAuthenticated()) {
    return res.status(403).end();
  }
  return next();
}

var app = express();
app.use(session({secret: config.sessionSecret}));
app.use(passport.initialize());
app.use(passport.session());

app.use(bodyParser.json());
app.use(cors(corsOptions));
app.use(session({secret: config.sessionSecret}));
app.use(express.static(__dirname + '/public'));

passport.use(new GitHubStrategy({
	clientID: config.clientID,
	clientSecret: config.secret,
	callbackUrl: 'http://localhost:3000/auth/github/callback'}, function(token, refreshToken, profile, done) {
		return done(null, profile)
	}
))

var github = new GitHubApi({});

app.get('/auth/github', passport.authenticate('github'));
app.get('/auth/github/callback', passport.authenticate('github', {successRedirect: '/#/home', failureRedirect: '/auth/github'}))
app.get('/api/github/following', requireAuth, function(req, res) {
	github.users.getFollowingForUser({
		user: req.user.username
	}, function(err, result) {
		res.status(200).send(result)
	})
})
app.get('/api/github/:username/events', requireAuth, function(req, res) {
	github.activity.getEventsForUser({
		user: req.params.username
	}, function(err, result) {
		res.status(200).send(result)
	});

})


passport.serializeUser(function(user, done) {
	done(null, user)
})

passport.deserializeUser(function(obj, done) {
	done(null, obj)
})

app.listen(port, function() {
	console.log('listening on port', port);
})

