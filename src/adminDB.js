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
    return db.query(`SELECT * FROM posts WHERE status = 1`, {type: QueryTypes.SELECT});
}

function getAllPosts() {
    return db.query(`SELECT * FROM posts`, {type: QueryTypes.SELECT});
}

function createPost(title, image, content, tags, date, author, status) {
    return db.query(`INSERT INTO posts (title, image, content, tags, date, author, status) VALUES ('${title}', '${image}', '${content}', '${tags}', '${date}', '${author}', ${status})`);
}

function createPostWithoutImage(title, content, tags, date, author, status) {
    return db.query(`INSERT INTO posts (title, content, tags, date, author, status) VALUES ('${title}', '${content}', '${tags}', '${date}', '${author}', ${status})`);
}

function getPostById(id) {
    return db.query(`SELECT * FROM posts WHERE id = ${id} LIMIT 1`, {type: QueryTypes.SELECT});
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

function getTags() {
    return db.query(`SELECT * FROM tags`, {type: QueryTypes.SELECT});
}

async function addTags(tags) {
    prevTags = await getTags();
    
    if (prevTags.length > 0) {
        for (let i = 0; i < tags.length; i++) {
            let tag = tags[i];
            for (let x = 0; x < prevTags.length; x++) {
                if (prevTags[x].tag.toLowerCase == tag.toLowerCase) {
                    tags.splice(i, 1);
                }
            }
        }
    }

    if (tags.length > 0) {
        for (let i = 0; i < tags.length; i++) {
            db.query(`INSERT INTO tags (tag) VALUES ('${tags[i]}')`);
        }
    }
}

module.exports = {
    getUser,
    getPosts,
    getAllPosts,
    createPost,
    createPostWithoutImage,
    deletePost,
    getLastPosts,
    getPostById,
    updatePost,
    updatePostNoImage,
    addTags,
    getTags
}