const path = require("path");
const Database = require("../../classes/db")
const ObjectId = require('mongodb').ObjectId;

var slug = function(str) {
    str = str.replace(/^\s+|\s+$/g, ''); // trim
    str = str.toLowerCase();
    // remove accents, swap ñ for n, etc
    var from = "ãàáäâẽèéëêìíïîõòóöôùúüûñç·/_,:;şıöüğ";
    var to   = "aaaaaeeeeeiiiiooooouuuunc------sioug";
    for (var i = 0, l = from.length; i < l; i++) {
      str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
    }
    str = str.replace(/[^a-z0-9 -]/g, '') // remove invalid chars
    .replace(/\s+/g, '-') // collapse whitespace and replace by -
    .replace(/-+/g, '-'); // collapse dashes
    return str;
  };

const index = async (request,response) => {
    if(request.session.userId){
        const db = new Database()
        const query = null;
        let result = await db.find("posts",query)
        response.render("admin/post/index",{layout:"../views/adminLayout.ejs", posts: result, operation: null})
    }else{
        response.render("admin/login/loginFailed",{layout:false, login:"Login Failed"})
    }
}

const edit = async (request,response) => {
    if(request.session.userId){
        let url = require('url');
        let url_parts = url.parse(request.url, true);
        let postId = url_parts.query.post;
        const db = new Database()
        const query = { _id: ObjectId(postId) }
        let result = await db.findOne("posts",query)
        if (result == null) {
            const db = new Database()
            const query = null;
            let result = await db.find("posts",query)
            response.render("admin/post/index",{layout:"../views/adminLayout.ejs", posts: result, operation: null})
        } else {
            let categoryId = result.category;
            const queryCategory = { _id: ObjectId(categoryId) }
            let resultCategory = await db.findOne("categories",queryCategory)
            const queryCategories = null;
            let resultCategories = await db.find("categories",queryCategories)
            response.render("admin/post/edit",{layout:"../views/adminLayout.ejs", post: result, category: resultCategory, categories: resultCategories, operation: null})
        }
    }else{
        response.render("admin/login/loginFailed",{layout:false, login:"Login Failed"})
    }
}

const update = async (request,response) => {
    if(request.session.userId){
        console.log(request)
        let url = require('url');
        let url_parts = url.parse(request.url, true);
        let postId = url_parts.query.post;
        const db = new Database()
        const query = { _id: ObjectId(postId) }

        if(request.files){
            var postImage = request.files.image
            var postImageName = "/public/images/" + request.files.image.name
            postImage.mv(path.resolve(__dirname,"../../public/images", postImage.name))
        }else{
            let url = require('url');
            let url_parts = url.parse(request.url, true);
            let postId = url_parts.query.post;
            const db = new Database()
            const query = { _id: ObjectId(postId) }
            let postInfo = await db.findOne("posts",query)
            if(postInfo.image){
                var postImageName = postInfo.image
            }else{
                var postImageName = "/public/images/logo.png"
            }
        }

        const newValues = ({},{
            "$set": {
                "title": request.body.title,
                "link": slug(request.body.title),
                "description": request.body.description,
                "keywords": request.body.keywords,
                "content": request.body.content,
                "image": postImageName,
                "category": request.body.category
            }
        })
        let result = await db.update("posts",query,newValues)
        if (result == null) {
            const db = new Database()
            const query = null;
            let result = await db.find("posts",query)
            response.render("admin/post/index",{layout:"../views/adminLayout.ejs", posts: result, operation: "fail"})
        } else {
            let url = require('url');
            let url_parts = url.parse(request.url, true);
            let postId = url_parts.query.post;
            const db = new Database()
            const query = { _id: ObjectId(postId) }
            let result = await db.findOne("posts",query)
            const queryCategories = null;
            let resultCategories = await db.find("categories",queryCategories)
            let categoryId = result.category;
            const queryCategory = { _id: ObjectId(categoryId) }
            let resultCategory = await db.findOne("categories",queryCategory)
            response.render("admin/post/edit",{layout:"../views/adminLayout.ejs", post: result, category: resultCategory, categories: resultCategories, operation: "success"})
        }
    }else{
        response.render("admin/login/loginFailed",{layout:false, login:"Login Failed"})
    }
}

const add = async (request,response) => {
    if(request.session.userId){
        const db = new Database()
        const queryCategories = null;
        let resultCategories = await db.find("categories",queryCategories)
        response.render("admin/post/add",{layout:"../views/adminLayout.ejs", categories: resultCategories})
    }else{
        response.render("admin/login/loginFailed",{layout:false, login:"Login Failed"})
    }
}

const addData = async (request,response) => {
    if(request.session.userId){
        const db = new Database()
        if(request.files){
            var postImage = request.files.image
            var postImageName = request.files.image.name
            postImage.mv(path.resolve(__dirname,"../../public/images", postImage.name))
        }else{
            var postImageName = "logo.png"
        }
        const query = {
            title: request.body.title,
            link: slug(request.body.title),
            description: request.body.description,
            keywords: request.body.keywords,
            content: request.body.content,
            image: "/public/images/" + postImageName,
            category: request.body.category
        };
        let result = await db.addData("posts",query)
        let postId = ObjectId(result.insertedId);
        if (postId == null) {
            const db = new Database()
            const query = null;
            let result = await db.find("posts",query)
            response.render("admin/post/index",{layout:"../views/adminLayout.ejs", posts: result, operation: "fail"})
        } else {
            const db = new Database()
            const query = { _id: postId }
            let result = await db.findOne("posts",query)
            let categoryId = result.category;
            const queryCategory = { _id: ObjectId(categoryId) }
            let resultCategory = await db.findOne("categories",queryCategory)
            const queryCategories = null;
            let resultCategories = await db.find("categories",queryCategories)
            response.render("admin/post/edit",{layout:"../views/adminLayout.ejs", post: result, category: resultCategory, categories: resultCategories, operation: "success"})
        }
    }else{
        response.render("admin/login/loginFailed",{layout:false, login:"Login Failed"})
    }
}

const deleteOne = async (request,response) => {
    if(request.session.userId){
        let url = require('url');
        let url_parts = url.parse(request.url, true);
        let postId = url_parts.query.post;
        const db = new Database()
        const query = { _id: ObjectId(postId) }
        let result = await db.deleteOne("posts",query)
        if (result == null) {
            response.render("admin/post/edit",{layout:"../views/adminLayout.ejs", post: result, operation: "fail"})
        } else {
            const db = new Database()
            const query = null;
            let result = await db.find("posts",query)
            response.render("admin/post/index",{layout:"../views/adminLayout.ejs", posts: result, operation: "success"})
        }
    }else{
        response.render("admin/login/loginFailed",{layout:false, login:"Login Failed"})
    }
}


module.exports = {index,edit,update,add,addData,deleteOne}