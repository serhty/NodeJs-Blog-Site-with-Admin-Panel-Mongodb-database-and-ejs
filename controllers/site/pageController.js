const Database = require("../../classes/db")
const ObjectId = require('mongodb').ObjectId;

const index = async (request,response) => {
    const db = new Database()
    const queryCategories = null;
    let resultCategories = await db.find("categories",queryCategories)
    const queryPosts = null;
    let resultPosts = await db.find("posts",queryPosts)
    const queryPages = null;
    let resultPages = await db.find("pages",queryPages)
    let settingsId = "63e93c0c982c9904fb5f22eb";
    const querySettings = { _id: ObjectId(settingsId) }
    let resultSettings = await db.findOne("settings",querySettings)
    let url = require('url');
    let url_parts = url.parse(request.url, true);
    let pageUrl = url_parts.href
    const myArray = pageUrl.split("/");
    let pageLink = myArray[2];
    const queryPageFind = { link: pageLink }
    let resultPageFind = await db.findOne("pages",queryPageFind)
    response.render("site/page/index",{layout:"../views/layout.ejs", categories: resultCategories, posts: resultPosts, pages: resultPages, settings: resultSettings, page: resultPageFind})
}

module.exports = {index}