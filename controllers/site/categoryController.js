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
    let categoryUrl = url_parts.href
    const myArray = categoryUrl.split("/");
    let categoryLink = myArray[1];
    const queryCategoryFind = { link: categoryLink }
    let resultCategoryFind = await db.findOne("categories",queryCategoryFind)
    let categoryId = resultCategoryFind._id
    var queryFindCategoryPosts = { category: categoryId.toString() };
    let resultFindCategoryPosts = await db.findQuery("posts",queryFindCategoryPosts)
    response.render("site/category/index",{layout:"../views/layout.ejs", categories: resultCategories, posts: resultPosts, pages: resultPages, settings: resultSettings, categoryPosts: resultFindCategoryPosts, category: resultCategoryFind})
}

module.exports = {index}