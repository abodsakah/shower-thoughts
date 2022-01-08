const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const fileupload = require('express-fileupload');
const adminDB = require('../src/adminDB');

router.get('/', (req, res) => {
    if (req.session.user) {
        let data = {
            title: 'Adminpanel | thought shower',
            user: req.session.user
        }
        res.render('admin/pages/index', data);
    } else {
        res.redirect('/admin/login');
    }
});

router.get('/login', (req, res) => {
    if (req.session.user) {
        res.redirect('/admin');
    } else {
        res.render('admin/pages/login', {
            title: 'Login | thought shower',
            errors: req.session.errors,
        });
    }
});

router.post('/login', async (req, res) => {
    if (req.session.user) {
        res.redirect('/admin');
    } else {
        let userInfo;
        let password = req.body.password;
        try {
            userInfo = await adminDB.getUser(req.body.username);
        } catch (err) {
            console.log(err);
        }
        if (userInfo.length > 0) {
            if (bcrypt.compareSync(password, userInfo[0].password)) {
                req.session.user = userInfo[0];
                res.redirect('/admin');
            } else {
                req.session.errors = [{
                    msg: 'Wrong username or/and password'
                }];
                res.redirect('/admin/login');
            }
        }
        else {
            req.session.errors = [{
                msg: 'Wrong username or/and password'
            }];
            res.redirect('/admin/login');
        }
    }
});

router.get("/logout", (req, res) => {
    req.session.destroy();
    res.redirect('/admin/login');
});

router.get("/posts", async (req, res) => {
    if (req.session.user) {
        let posts;
        try {
            posts = await adminDB.getAllPosts();
        } catch (err) {
            console.log(err);
        }
        let data = {
            title: 'Posts | thought shower',
            posts,
            user: req.session.user
        }
        res.render('admin/pages/posts', data);
    }else {
        res.redirect('/admin/login');
    }
});

router.get("/posts/add-new", async (req, res) => {
    if (req.session.user) {
        let data = {
            title: 'Add post | thought shower',
            user: req.session.user
        }
        res.render('admin/pages/add-post', data);
    } else {
        res.redirect('/admin/login');
    }
});

router.post("/posts/add-new", async (req, res) => {
    if (req.session.user) {
        let title = req.body.title;
        let content = req.body.bodyContent;
        let author = req.session.user.username;
        let tags = req.body.tags;
        let status = req.body.status;
        let date = new Date();
        tags = tags.split(',');
        
        let image
        if (req.files) {
            image = req.files.image;

            try {
                image.mv(`./public/uploads/${image.name}`, async (err) => {
                    if (err) {
                        console.log(err);
                        req.session.errors.append({
                            msg: `Something went wrong: ${err}`
                        });
                        res.redirect('/admin/posts');
                    } else {
                        try {
                            await adminDB.createPost(title, image.name, content, tags, date, author, status);
                            await adminDB.addTags(tags);
                        } catch (err) {
                            console.log(err);
                        }
                    }
                });
            } catch (err) {
                console.log(err);
            }
        } else {
            adminDB.createPostWithoutImage(title, content, tags, date, author, status);
        }

        res.redirect('/admin/posts');

    } else {
        res.redirect('/admin/login');
    }
});

router.get("/posts/edit", async (req, res) => {
    if (req.session.user) {
        let post;
        try {
            post = await adminDB.getPostById(req.query.id);
        } catch (err) {
            console.log(err);
        }
        let data = {
            title: 'Edit post | thought shower',
            post: post[0],
            user: req.session.user
        }
        res.render('admin/pages/edit-post', data);
    } else {
        res.redirect('/admin/login');
    }
});

router.post("/posts/edit", async (req, res) => {
    if (req.session.user) {
        let title = req.body.title;
        let content = req.body.bodyContent;
        let author = req.session.user.username;
        let tags = req.body.tags;
        let status = req.body.status;
        let date = new Date();
        if (req.files != null) {
            let image = req.files.image;
            try {
                image.mv(`./public/uploads/${image.name}`, async (err) => {
                    if (err) {
                        console.log(err);
                        req.session.errors.append({
                            msg: `Something went wrong: ${err}`
                        });
                        res.redirect('/admin/posts');
                    } else {
                        try {
                            await adminDB.updatePost(req.query.id, title, image.name, content, tags, date, author, status);
                        } catch (err) {
                            console.log(err);
                        }
                    }
                });
            } catch (err) {
                console.log(err);
            }
            
        } else {

            try {
                await adminDB.updatePostNoImage(req.query.id, title, content, tags, date, author, status);
            } catch (err) {
                console.log(err);
            }
        }
        res.redirect('/admin/posts');

    } else {
        res.redirect("admin/login")
    }
});

router.get("/posts/remove", async (req, res) => {
   if (req.session.user) {
       let postId = req.query.id;
       try {
           await adminDB.deletePost(postId);
       } catch (err) {
              console.log(err);
       }
       res.redirect('/admin/posts');
   } else {
         res.redirect('/admin/login');
   }
});

module.exports = router;