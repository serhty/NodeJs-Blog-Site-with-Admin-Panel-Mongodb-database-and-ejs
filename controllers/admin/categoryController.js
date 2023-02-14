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
        let result = await db.find("categories",query)
        response.render("admin/category/index",{layout:"../views/adminLayout.ejs", categories: result, operation: null})
    }else{
        response.render("admin/login/loginFailed",{layout:false, login:"Login Failed"})
    }
}

const edit = async (request,response) => {
    if(request.session.userId){
        let url = require('url');
        let url_parts = url.parse(request.url, true);
        let categoryId = url_parts.query.category;
        const db = new Database()
        const query = { _id: ObjectId(categoryId) }
        let result = await db.findOne("categories",query)
        if (result == null) {
            const db = new Database()
            const query = null;
            let result = await db.find("categories",query)
            response.render("admin/category/index",{layout:"../views/adminLayout.ejs", categories: result, operation: null})
        } else {
            response.render("admin/category/edit",{layout:"../views/adminLayout.ejs", category: result, operation: null})
        }
    }else{
        response.render("admin/login/loginFailed",{layout:false, login:"Login Failed"})
    }
}

const update = async (request,response) => {
    if(request.session.userId){
        let url = require('url');
        let url_parts = url.parse(request.url, true);
        let categoryId = url_parts.query.category;
        const db = new Database()
        const query = { _id: ObjectId(categoryId) }

        if(request.files){
            var postImage = request.files.image
            var postImageName = "/public/images/" + request.files.image.name
            postImage.mv(path.resolve(__dirname,"../../public/images", postImage.name))
        }else{
            let url = require('url');
            let url_parts = url.parse(request.url, true);
            let categoryId = url_parts.query.category;
            const db = new Database()
            const query = { _id: ObjectId(categoryId) }
            let categoryInfo = await db.findOne("categories",query)
            if(categoryInfo.image){
                var postImageName = categoryInfo.image
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
                "image": postImageName
            }
        })
        let result = await db.update("categories",query,newValues)
        if (result == null) {
            const db = new Database()
            const query = null;
            let result = await db.find("categories",query)
            response.render("admin/category/index",{layout:"../views/adminLayout.ejs", categories: result, operation: "fail"})
        } else {
            let url = require('url');
            let url_parts = url.parse(request.url, true);
            let categoryId = url_parts.query.category;
            const db = new Database()
            const query = { _id: ObjectId(categoryId) }
            let result = await db.findOne("categories",query)
            response.render("admin/category/edit",{layout:"../views/adminLayout.ejs", category: result, operation: "success"})
        }
    }else{
        response.render("admin/login/loginFailed",{layout:false, login:"Login Failed"})
    }
}

const add = async (request,response) => {
    if(request.session.userId){
        response.render("admin/category/add",{layout:"../views/adminLayout.ejs"})
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
            image: "/public/images/" + postImageName
        };
        let result = await db.addData("categories",query)
        let categoryId = ObjectId(result.insertedId);
        if (categoryId == null) {
            const db = new Database()
            const query = null;
            let result = await db.find("categories",query)
            response.render("admin/category/index",{layout:"../views/adminLayout.ejs", categories: result, operation: "fail"})
        } else {
            const db = new Database()
            const query = { _id: categoryId }
            let result = await db.findOne("categories",query)
            response.render("admin/category/edit",{layout:"../views/adminLayout.ejs", category: result, operation: "success"})
        }
    }else{
        response.render("admin/login/loginFailed",{layout:false, login:"Login Failed"})
    }
}

const deleteOne = async (request,response) => {
    if(request.session.userId){
        let url = require('url');
        let url_parts = url.parse(request.url, true);
        let categoryId = url_parts.query.category;
        const db = new Database()
        const query = { _id: ObjectId(categoryId) }
        let result = await db.deleteOne("categories",query)
        if (result == null) {
            response.render("admin/category/edit",{layout:"../views/adminLayout.ejs", category: result, operation: "fail"})
        } else {
            const db = new Database()
            const query = null;
            let result = await db.find("categories",query)
            response.render("admin/category/index",{layout:"../views/adminLayout.ejs", categories: result, operation: "success"})
        }
    }else{
        response.render("admin/login/loginFailed",{layout:false, login:"Login Failed"})
    }
}


module.exports = {index,edit,update,add,addData,deleteOne}