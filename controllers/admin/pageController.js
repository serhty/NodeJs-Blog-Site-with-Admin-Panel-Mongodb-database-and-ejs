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
        let result = await db.find("pages",query)
        response.render("admin/page/index",{layout:"../views/adminLayout.ejs", pages: result, operation: null})
    }else{
        response.render("admin/login/loginFailed",{layout:false, login:"Login Failed"})
    }
}

const edit = async (request,response) => {
    if(request.session.userId){
        let url = require('url');
        let url_parts = url.parse(request.url, true);
        let pageId = url_parts.query.page;
        const db = new Database()
        const query = { _id: ObjectId(pageId) }
        let result = await db.findOne("pages",query)
        if (result == null) {
            const db = new Database()
            const query = null;
            let result = await db.find("pages",query)
            response.render("admin/page/index",{layout:"../views/adminLayout.ejs", pages: result, operation: null})
        } else {
            response.render("admin/page/edit",{layout:"../views/adminLayout.ejs", page: result, operation: null})
        }
    }else{
        response.render("admin/login/loginFailed",{layout:false, login:"Login Failed"})
    }
}

const update = async (request,response) => {
    if(request.session.userId){
        let url = require('url');
        let url_parts = url.parse(request.url, true);
        let pageId = url_parts.query.page;
        const db = new Database()
        const query = { _id: ObjectId(pageId) }

        if(request.files){
            var postImage = request.files.image
            var postImageName = "/public/images/" + request.files.image.name
            postImage.mv(path.resolve(__dirname,"../../public/images", postImage.name))
        }else{
            let url = require('url');
            let url_parts = url.parse(request.url, true);
            let pageId = url_parts.query.page;
            const db = new Database()
            const query = { _id: ObjectId(pageId) }
            let pageInfo = await db.findOne("pages",query)
            if(pageInfo.image){
                var postImageName = pageInfo.image
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
        let result = await db.update("pages",query,newValues)
        if (result == null) {
            const db = new Database()
            const query = null;
            let result = await db.find("pages",query)
            response.render("admin/page/index",{layout:"../views/adminLayout.ejs", pages: result, operation: "fail"})
        } else {
            let url = require('url');
            let url_parts = url.parse(request.url, true);
            let pageId = url_parts.query.page;
            const db = new Database()
            const query = { _id: ObjectId(pageId) }
            let result = await db.findOne("pages",query)
            response.render("admin/page/edit",{layout:"../views/adminLayout.ejs", page: result, operation: "success"})
        }
    }else{
        response.render("admin/login/loginFailed",{layout:false, login:"Login Failed"})
    }
}

const add = async (request,response) => {
    if(request.session.userId){
        response.render("admin/page/add",{layout:"../views/adminLayout.ejs"})
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
        let result = await db.addData("pages",query)
        let pageId = ObjectId(result.insertedId);
        if (pageId == null) {
            const db = new Database()
            const query = null;
            let result = await db.find("pages",query)
            response.render("admin/page/index",{layout:"../views/adminLayout.ejs", pages: result, operation: "fail"})
        } else {
            const db = new Database()
            const query = { _id: pageId }
            let result = await db.findOne("pages",query)
            response.render("admin/page/edit",{layout:"../views/adminLayout.ejs", page: result, operation: "success"})
        }
    }else{
        response.render("admin/login/loginFailed",{layout:false, login:"Login Failed"})
    }
}

const deleteOne = async (request,response) => {
    if(request.session.userId){
        let url = require('url');
        let url_parts = url.parse(request.url, true);
        let pageId = url_parts.query.page;
        const db = new Database()
        const query = { _id: ObjectId(pageId) }
        let result = await db.deleteOne("pages",query)
        if (result == null) {
            response.render("admin/page/edit",{layout:"../views/adminLayout.ejs", page: result, operation: "fail"})
        } else {
            const db = new Database()
            const query = null;
            let result = await db.find("pages",query)
            response.render("admin/page/index",{layout:"../views/adminLayout.ejs", pages: result, operation: "success"})
        }
    }else{
        response.render("admin/login/loginFailed",{layout:false, login:"Login Failed"})
    }
}


module.exports = {index,edit,update,add,addData,deleteOne}