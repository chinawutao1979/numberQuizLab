const express = require("express");
const cookieParser = require("cookie-parser");
const sessions = require("express-session");
const app = express();

// creating 1 hours from milliseconds
const oneDay = 1000 * 60 * 60;
//answers
const answers = [9, 8, 36, 13, 32];
//questions
const questions = [
  "3,1,4,1,5", // the digits of π
  "1,1,2,3,5", // fibonacci
  "1,4,9,16,25", // squares
  "2,3,5,7,11", // primes
  "1,2,4,8,16", // powers of 2
];
const uuid = require("uuid");
var uuidV4 = uuid.v4();
//session middleware
app.use(
  sessions({
    secret: "thisismysecrctekey",
    saveUninitialized: true,
    cookie: { maxAge: oneDay },
    resave: false,
  })
);
// parsing the incoming data
//app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//serving public file
app.use(express.static(__dirname));

// cookie parser middleware
app.use(cookieParser());

//set view engine
app.set("view engine", "pug");

// a variable to save a session
var session = new Array();
app.get("/", (req, res) => {
  uuidV4 = uuid.v4();
  session[uuidV4] = req.session;
  session[uuidV4].count = 1;
  session[uuidV4].myScore = 0;
  res.render("question", {
    myScore: session[uuidV4].myScore,
    myQuestion: questions[session[uuidV4].count - 1],
    mySessionId: uuidV4,
    count: session[uuidV4].count,
  });
});
app.get("/question", (req, res) => {});

app.post("/question", (req, res) => {
  uuidV4 = req.body.mySessionId;
  session[uuidV4].count++;
  var count = session[uuidV4].count;
  if (req.body.answer == answers[session[uuidV4].count - 2]) {
    session[uuidV4].myScore++;
  }
  var myScore = session[uuidV4].myScore;
  if (count <= 5) {   
    res.render("question", {
      myScore: myScore,
      myQuestion: questions[count - 1],
      mySessionId: uuidV4,
      count: count,
    });
  } else {    
    session[uuidV4].destroy();
    req.session.destroy();
    res.render("result", {
      myScore: myScore,      
    });
  }
});
app.listen(process.env.PORT || 4000)
