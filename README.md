![Thought Shower](/public/blog/img/logo.png)
![version](https://img.shields.io/badge/Version-1.0.0-blue)

---

A blog built with Node.js, Mysql and 
Express.js.

---
I built this blog as a test for the cms I am developing and other then I am using it to share my thoughts with other people.

## How to use

Before starting all the dependencies have to be installed by running the `yarn` command.

after that you need to create a `.env` file in the root directory of the project with the database information.
The file structure is as follows:
```env
DB_HOST= <the adresses of the database>
DB_LOGIN= <the username of the admin>
DB_PASSWORD= <the users password>
DB_NAME= <database to use>
DB_CHAR= <character set>
DB_MULTI= <if you want to use multiple databases>
```

after that its just about running the server. and you can access the blog at `http://localhost:3000`

## To do
- [x] Add a login system
- [x] Add a WYSIWYG editor 
- [x] Add a admin system
- [ ] Add a comment system
- [ ] Add a search system
- [ ] Add a pagination system
- [ ] Add a RSS feed system
