const Database = require("../../classes/db")
const ObjectId = require('mongodb').ObjectId;

const index = (request,response) => {
    response.render("admin/login/index",{layout:false})
}

const loginCheck = async (request,response) => {
    const db = new Database()
    const query = { username: request.body.username , password: request.body.password};
    let result = await db.findOne("admins",query)
    if (result == null) {
        response.render("admin/login/loginFailed",{layout:false, login:"Login Failed"})
    } else {
        request.session.userId = ObjectId(result._id)
        const queryCategories = null;
        let resultCategories = await db.find("categories",queryCategories)
        const queryPosts = null;
        let resultPosts = await db.find("posts",queryPosts)
        const queryPages = null;
        let resultPages = await db.find("pages",queryPages)
        response.render("admin/home/index",{layout:"../views/adminLayout.ejs", login:"Login Successs", categories: resultCategories, posts: resultPosts, pages: resultPages})
    }
    
}

module.exports = {index,loginCheck}