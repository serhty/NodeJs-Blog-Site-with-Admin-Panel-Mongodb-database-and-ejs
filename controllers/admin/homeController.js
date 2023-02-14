const Database = require("../../classes/db")


const index = async (request,response) => {
    if(request.session.userId){
        const db = new Database()
        const queryCategories = null;
        let resultCategories = await db.find("categories",queryCategories)
        const queryPosts = null;
        let resultPosts = await db.find("posts",queryPosts)
        const queryPages = null;
        let resultPages = await db.find("pages",queryPages)
        response.render("admin/home/index",{layout:"../views/adminLayout.ejs", categories: resultCategories, posts: resultPosts, pages: resultPages})
    }else{
        response.render("admin/login/loginFailed",{layout:false, login:"Login Failed"})
    }
}

module.exports = {index}