require("dotenv").config()

const express = require("express")
const session = require("express-session")
const bodyParser = require("body-parser")
const methodOverride = require("method-override")
const partials = require("express-partials")

const GITHUB_CALLBACK_URL = `http://${process.env.OSM_IP}:${process.env.OSM_PORT}/auth/github/callback`
const PORT = process.env.OSM_PORT

const app = express()

// const { Octokit } = require("@octokit/rest")
// const { createAppAuth } = require("@octokit/auth-app")
// const appOctokit = new Octokit({
//   authStrategy: createAppAuth,
//   auth: {
//     id: process.env.GITHUB_CLIENT_ID,
//     privateKey: process.env.GITHUB_CLIENT_SECRET,
//   },
// })


const { Octokit } = require("@octokit/rest")

const octokit = new Octokit({
  auth: process.env.GITHUB_PERSONAL_ACCESS_TOKEN,
})

const { data } = await octokit.request("/user");


// configure Express
app.set("views", __dirname + "/views")
app.set("view engine", "ejs")
app.use(partials())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(methodOverride())
app.use(
  session({ secret: "keyboard cat", resave: false, saveUninitialized: false })
)
app.use(express.static(__dirname + "/public"))


app.get("/", function (req, res) {
  res.render("home1", { user: req.user })
})

app.listen(PORT, () => {
  console.log(`Server in ascolto su http://${process.env.OSM_IP}:${process.env.OSM_PORT}`)
  console.log(`Callback urls su ${GITHUB_CALLBACK_URL}`)
})