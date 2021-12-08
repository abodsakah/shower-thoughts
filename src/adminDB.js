const {Sequelize, QueryTypes} = require('sequelize');
const dotenv = require('dotenv').config({path: './.env'});

const db = new Sequelize(dotenv.parsed.DB_NAME, dotenv.parsed.DB_LOGIN, dotenv.parsed.DB_PASSWORD, {
    host: dotenv.parsed.DB_HOST,
    dialect: 'mysql'
});


/**
 * 
 * @param {*} username 
 * @returns Users information
 */
function getUser(username) {
    return db.query(`SELECT * FROM users WHERE username = '${username}'`, {type: QueryTypes.SELECT});
}

function getPosts() {
    return db.query(`SELECT * FROM posts`, {type: QueryTypes.SELECT});
}

function createPost(title, image, content, tags, date, author, status) {
    return db.query(`INSERT INTO posts (title, image, content, tags, date, author, status) VALUES ('${title}', '${image}', '${content}', '${tags}', '${date}', '${author}', ${status})`);
}

function getPostById(id) {
    return db.query(`SELECT * FROM posts WHERE id = ${id}`, {type: QueryTypes.SELECT});
}

function updatePost(id, title, image, content, tags, date, author, status) {
    return db.query(`UPDATE posts SET title = '${title}', image = '${image}', content = '${content}', tags = '${tags}', date = '${date}', author = '${author}', status = ${status} WHERE id = ${id}`);
}

function updatePostNoImage(id, title, content, tags, date, author, status){
    return db.query(`UPDATE posts SET title = '${title}', content = '${content}', tags = '${tags}', date = '${date}', author = '${author}', status = ${status} WHERE id = ${id}`);
}

function deletePost(id) {
    return db.query(`DELETE FROM posts WHERE id = ${id}`);
}

function getLastPosts() {
    return db.query(`SELECT * FROM posts ORDER BY id DESC LIMIT 6`, {type: QueryTypes.SELECT});
}

module.exports = {
    getUser,
    getPosts,
    createPost,
    deletePost,
    getLastPosts,
    getPostById,
    updatePost,
    updatePostNoImage
}