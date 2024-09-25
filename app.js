const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3230;
var User = require("./database").user;
app.use(bodyParser.json());
app.set("view engine", "ejs");
// Body parser middleware
app.use(bodyParser.urlencoded({ extended: true }));
const cookieParser = require("cookie-parser");

app.use(cookieParser());
// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB database');
});

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes



app.get('/', function (req, res) {
  res.render("index");
})

app.get('/index', function (req, res) {
  res.render("index");
})

app.get('/jee', function (req, res) {
  res.render("jee");
})

app.get('/gate', function (req, res) {
  res.render("gate");
})

app.get('/computer_courses', function (req, res) {
  res.render("computer_courses");
})

app.get('/quiz', function (req, res) {
  res.render("quiz");
})




// Other routes...

// Route to handle form submission
app.post("/msg_received", (req, res) => {
  var fname = req.body.fname;
  var lname = req.body.lname;
  var email = req.body.email;
  var message = req.body.message;
  var additional = req.body.additional;

  var data = {
      "fname": fname,
      "lname": lname,
      "email": email,
      "message": message,
      "additional": additional
  };

  // Insert data into MongoDB
  db.collection('contact-form').insertOne(data, (err, result) => {
      if (err) {
          console.error('Error inserting data:', err);
          return res.status(500).send('Error inserting data');
      }
      console.log("Record Inserted Successfully");
      
      // Sending a response back to the client
      res.send('Your message was sent successfully!');
  });
});




// app.get("/", (req, res) => {
//   if (req.cookies.email) {
//     User.findOne({ Email: req.cookies.email })
//       .then((user) => {
//         res.render("user", { data: user ? user.Name : "" });
//       })
//       .catch(() => {
//         res.redirect("/login");
//       });
//   } else {
//     res.redirect("/login");
//   }
// });





app.get("/login", (req, res) => {
  res.render('login', { data: '0' });
});



app.post("/login", (req, res) => {
  const { email, pwd } = req.body;

  if (!email || !pwd) {
      res.send({ error: "empty" });
      return;
  }

  User.findOne({ Email: email, Password: pwd })
      .then((loginUser) => {
          if (!loginUser) {
              res.send({ error: "wrong" });
          } else {
              res.cookie("email", email, { maxAge: 3600000, httpOnly: true });
              res.send({ success: "success" });
          }
      })
      .catch(() => {
          res.send({ error: "wrong" });
      });
});


app.get('/user', (req, res) => {
  res.redirect("/");
});




app.get("/register", (req, res) => {
  res.render("register");
});

app.post("/register", (req, res) => {
  const { name, email, pwd1, pwd2, phone } = req.body;

  if (!name || !email || !pwd1 || !pwd2 || !phone) {
    res.send({ error: "empty" });
    return;
  }

  if (pwd1 !== pwd2) {
    res.send({ error: "mismatch" });
    return;
  }

  User.findOne({ Email: email })
    .then((existingUser) => {
      if (existingUser) {
        res.send({ error: "already" });
      } else {
        const newUser = new User({ Name: name, Email: email, Password: pwd1, Phone: phone });
        newUser.save()
          .then(() => res.send({ success: "added" }))
          .catch(() => {
            res.send({ error: "failed" });
          });
      }
    })
    .catch(() => {
      res.send({ error: "failed" });
    });
});



// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
