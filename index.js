"use strict";

const express = require("express");
const fileUpload = require("express-fileupload");
const session = require("express-session");
const bodyParser = require("body-parser");
const schedule = require("node-schedule");

const adminRouter = require("./routes/admin");

const app = express();

const postDB = require("./src/adminDB");

const port = process.env.PORT || 3000;
let allPosts; 


// schedule each hour
schedule.scheduleJob("* * *", async () => {
    try {
        allPosts = await postDB.getPosts();
    } catch (err) {
        console.log(err);
    }
});

//public folder
app.use(express.static("./public"));

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(fileUpload());

app.use(session({
    secret: "ThisIsJustATought",
    name: "Thought shower",
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week
    }
}));
    
app.use("/admin", adminRouter);
app.set("view engine", "ejs");
app.use(express.static("public"));
app.get("/", async (req, res) => {
    let posts;
    try {
        posts = await postDB.getLastPosts();
    } catch (err) {
        console.log(err);
    }
    let data = {
        title: "Thought shower",
        posts: posts
    }
    res.render("blog/pages/index", data);
});

app.get("/post", async (req, res) => {
    let post;
    let id = req.query.id;
    try {
        post = await postDB.getPostById(id);
    } catch (err) {
        console.log(err);
    }
    let data = {
        title: "Thought shower",
        post: post[0]
    }
    res.render("blog/pages/post", data);
});

app.get("/all-posts", async (req, res) => {
    let page = req.query.page || 1;
    let perPage = 9;
    let posts = allPosts
    // TODO: Get all tags and display them on top of the page
    // Add search abilty
    
    let amount_pages = Math.ceil(posts.length / perPage);

    posts = posts.slice((page - 1) * perPage, page * perPage);
    let data = {
        title: "Thought shower",
        posts: posts,
        page: page,
        amount_pages
    }
    res.render("blog/pages/all-posts", data);
});



app.get("/search", async (req, res) => {
    let term = req.query.q;
    let posts = [];
    console.log(term);
    for (var post of allPosts) {
        if (post.title.toLowerCase().includes(term.toLowerCase())) {
            posts.push(post);
        } else if (post.tags.toLowerCase().includes(term.toLowerCase())) {
            posts.push(post);
        } else if (post.author.toLowerCase().includes(term.toLowerCase())) {
            posts.push(post);
        }
    }

    let page = req.query.page || 1;
    let perPage = 9;
    
    let amount_pages = Math.ceil(posts.length / perPage);

    let data = {
        title: "Thought shower",
        posts: posts,
        page: page,
        amount_pages,
        term

    }
    res.render("blog/pages/search", data);
});

app.use((req, res, next) => {
    console.log(`${req.method} request for '${req.url}' - ${JSON.stringify(req.body)}`);
    res.locals.session = req.session;
    
    next();
});


app.listen(port, async () => {
    try {
        allPosts = await postDB.getPosts();

    } catch (err) {
        console.log(err);
    }
    console.log(`Server started on port ${port}`);
});