var express = require('express');
const {webhook} = require("./index");
var app = express();

// respond with "hello world" when a GET request is made to the homepage
app.get('/', webhook);

app.listen(3000)
