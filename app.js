const express = require("express")
const ejs = require("ejs")
const http = require("http")
const path = require("path")
const route = require("./route")
const expressLayout = require("express-ejs-layouts")
const fileUpload  = require('express-fileupload')
const expressSession  = require('express-session')


const app = express()

http.createServer(app).listen("8000", () => {
    console.log("Server started")
})

app.use(expressSession({
    secret: "demo secret",
    resave: false,
    saveUninitialized: true
}))
app.use(fileUpload())
app.use(express.json())
app.use(express.urlencoded())

app.use("/public", express.static(path.join(__dirname, "public")))
app.set("view engine","ejs")
app.use(expressLayout)

app.use("/",route(express))