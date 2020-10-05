require("dotenv").config()

const express = require("express")
const passport = require("passport")
const util = require("util")
const session = require("express-session")
const bodyParser = require("body-parser")
const methodOverride = require("method-override")
const GitHubStrategy = require("passport-github2").Strategy
const partials = require("express-partials")
const axios = require("axios")
const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET
const GITHUB_CALLBACK_URL = `http://${process.env.OSM_IP}:${process.env.OSM_PORT}/auth/github/callback`
const PORT = process.env.OSM_PORT

passport.serializeUser(function (user, done) {
  done(null, user)
})

passport.deserializeUser(function (obj, done) {
  done(null, obj)
})
let user

passport.use(
  new GitHubStrategy(
    {
      clientID: GITHUB_CLIENT_ID,
      clientSecret: GITHUB_CLIENT_SECRET,
      callbackURL: GITHUB_CALLBACK_URL,
      scope: ['user:email', 'repo', 'profile'],
    },
    async function (accessToken, refreshToken, profile, done) {






      process.nextTick(function () {
        return done(null, profile)
      })
    }
  )
)

const app = express()

app.set("views", __dirname + "/views")
app.set("view engine", "ejs")
app.use(partials())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(methodOverride())
app.use(
  session({ secret: "keyboard cat", resave: false, saveUninitialized: false })
)
app.use(passport.initialize())
app.use(passport.session())
app.use(express.static(__dirname + "/public"))

app.get("/", function (req, res) {
  res.render("index", { user: req.user })
})

app.get("/account", ensureAuthenticated, function (req, res) {
  res.render("account", { user: req.user })
})

app.get("/login", function (req, res) {
  res.render("login", { user: req.user })
})


app.get(
  "/auth/github",
  passport.authenticate("github", { scope: ["user:email"] }),
  function (req, res) {
    res.render("index", { user: req.user })
  }
)

app.get(
  "/repo",
  passport.authenticate("github", { scope: ['user:email', 'repo', 'profile'] }),
  function (req, res) {
    console.log("USER REPO")
    // user.repo = res.data
    // console.log(user.repo)
    // res.render("repo", { user: req.user })
  }
)




app.get(
  "/auth/github/callback",
  passport.authenticate("github", { failureRedirect: "/login" }),
  function (req, res) {
    res.redirect("/")
  }
)

app.get("/logout", function (req, res) {
  req.logout()
  res.redirect("/")
})

app.listen(PORT, () => {
  console.log(`Server in ascolto su http://${process.env.OSM_IP}:${process.env.OSM_PORT}`)
  console.log(`Callback urls su ${GITHUB_CALLBACK_URL}`)
})

function ensureAuthenticated (req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }
  res.redirect("/login")
}
