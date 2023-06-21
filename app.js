//------ Requiring the Modules ------//
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");

//------ Initializing Express App ------//
const app = express();

//-------- Connecting to MongoDB Server ---------//
mongoose.connect('mongodb+srv://admin-priyam:' + process.env.MONGODB_PASS + '@cluster0.4e7tz9k.mongodb.net/blogDB');

//--------- Defining new Schema ---------//
const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: "Title is required"
  },
  body: {
    type: String,
    required: "Title is required"
  },
});

//--------- Create Models ---------//
const Blog = mongoose.model("Blog", blogSchema);
const About = mongoose.model("About", blogSchema);
const Contact = mongoose.model("Contact", blogSchema);

//--------- Create Documents --------//
const about = new About({
  title: "About",
  body: "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui."
});


const contact = new Contact({
  title: "Contact",
  body: "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero."
});


const blogHome = new Blog({
  title: "Home",
  body: "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing."
});


//------ Use EJS ------//
app.set('view engine', 'ejs');

//------ Use Body Parser ------//
app.use(bodyParser.urlencoded({ extended: true }));

//------ Use Public Folder ------//
app.use(express.static("public"));

app.get("/", function (req, res) {
  Blog.find()
    .then(function (posts) {
      if (posts.length === 0) {
        blogHome.save();
        res.redirect("/");
      } else {
        res.render("home", { posts: posts });
      }
    })
    .catch();
})

app.get("/:pageTitle", function (req, res) {
  switch (req.params.pageTitle) {
    case "contact":
      Contact.find()
        .then(function (contacts) {
          if (contacts.length === 0) {
            contact.save();
            res.redirect("/contact");
          } else {
            res.render("contact", { contactContent: contacts });
          }
        })
        .catch(function (err) {
          console.log(err);
        });
      break;

    case "about":
      About.find()
        .then(function (abouts) {
          if (abouts.length === 0) {
            about.save();
            res.redirect("/about");
          } else {
            res.render("about", { aboutContent: abouts });
          }
        })
        .catch(function (err) {
          console.log(err);
        });
      break;

    case "compose":
      res.render("compose");
      break;

    default:
      res.write("<h1>Sorry! The page you are looking for does not exist!</h>");
      res.write("<br><br><a href = '/'>Home</a>");
      res.send();
      break;
  }
})

app.post("/compose", function (req, res) {
  const blogPost = new Blog({
    title: req.body.newTitle,
    body: req.body.newPost
  });
  blogPost.save();
  res.redirect("/");
})

app.get("/posts/:postId", function (req, res) {
  Blog.find()
    .then(posts => {
      posts.forEach(post => {
        if (_.lowerCase(req.params.postId) === _.lowerCase(post.title)) {
          res.render("post", { fullPost: post })
        }
      })
    })
    .catch(err => {
      console.log(err);
    });
})


app.listen(process.env.PORT || 3000, function () {
  console.log("Server started on port 3000");
});
