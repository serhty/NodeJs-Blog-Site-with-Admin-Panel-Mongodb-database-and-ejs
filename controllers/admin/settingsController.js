const path = require("path");
const Database = require("../../classes/db")
const ObjectId = require('mongodb').ObjectId;

const edit = async (request,response) => {
    if(request.session.userId){
        let settingsId = "63e93c0c982c9904fb5f22eb";
        const db = new Database()
        const query = { _id: ObjectId(settingsId) }
        let result = await db.findOne("settings",query)
        if (result == null) {
            response.render("admin/settings/edit",{layout:"../views/adminLayout.ejs", settings: result, operation: null})
        } else {
            response.render("admin/settings/edit",{layout:"../views/adminLayout.ejs", settings: result, operation: null})
        }
    }else{
        response.render("admin/login/loginFailed",{layout:false, login:"Login Failed"})
    }
}

const update = async (request,response) => {
    if(request.session.userId){
        let settingsId = "63e93c0c982c9904fb5f22eb";
        const db = new Database()
        const query = { _id: ObjectId(settingsId) }

        if(request.files){
            var postImage = request.files.image
            var postImageName = "/public/images/" + request.files.image.name
            postImage.mv(path.resolve(__dirname,"../../public/images", postImage.name))
        }else{
            let settingsId = "63e93c0c982c9904fb5f22eb";
            const db = new Database()
            const query = { _id: ObjectId(settingsId) }
            let settingsInfo = await db.findOne("settings",query)
            if(settingsInfo.image){
                var postImageName = settingsInfo.image
            }else{
                var postImageName = "/public/images/logo.png"
            }
        }

        const newValues = ({},{
            "$set": {
                "title": request.body.title,
                "link": request.body.link,
                "description": request.body.description,
                "keywords": request.body.keywords,
                "facebook": request.body.facebook,
                "instagram": request.body.instagram,
                "twitter": request.body.twitter,
                "logo": postImageName
            }
        })
        let result = await db.update("settings",query,newValues)
        if (result == null) {
            let settingsId = "63e93c0c982c9904fb5f22eb";
            const db = new Database()
            const query = { _id: ObjectId(settingsId) }
            let result = await db.findOne("settings",query)
            response.render("admin/settings/edit",{layout:"../views/adminLayout.ejs", settings: result, operation: "fail"})
        } else {
            let settingsId = "63e93c0c982c9904fb5f22eb";
            const db = new Database()
            const query = { _id: ObjectId(settingsId) }
            let result = await db.findOne("settings",query)
            response.render("admin/settings/edit",{layout:"../views/adminLayout.ejs", settings: result, operation: "success"})
        }
    }else{
        response.render("admin/login/loginFailed",{layout:false, login:"Login Failed"})
    }
}

module.exports = {edit,update}