const homeController = require("./controllers/site/homeController")
const categoryController = require("./controllers/site/categoryController")
const postController = require("./controllers/site/postController")
const pageController = require("./controllers/site/pageController")
const loginController = require("./controllers/admin/loginController")
const adminHomeController = require("./controllers/admin/homeController")
const adminCategoryController = require("./controllers/admin/categoryController")
const adminPostController = require("./controllers/admin/postController")
const adminPageController = require("./controllers/admin/pageController")
const adminSettingsController = require("./controllers/admin/settingsController")

const router = (express) => {
    const r = express.Router()
    r.get("/", homeController.index)
    /* admin */
    r.get("/admin", loginController.index)
    r.post("/admin", loginController.loginCheck)
    r.get("/admin/home", adminHomeController.index)
    /* category */
    r.get("/admin/categories", adminCategoryController.index)
    r.get("/admin/category-edit/edit?:categorID", adminCategoryController.edit)
    r.post("/admin/category-edit/edit?:categorID", adminCategoryController.update)
    r.get("/admin/category-add", adminCategoryController.add)
    r.post("/admin/category-add", adminCategoryController.addData)
    r.get("/admin/category-delete/delete?:categorID", adminCategoryController.deleteOne)
    /* category */
    /* post */
    r.get("/admin/posts", adminPostController.index)
    r.get("/admin/post-edit/edit?:postID", adminPostController.edit)
    r.post("/admin/post-edit/edit?:postID", adminPostController.update)
    r.get("/admin/post-add", adminPostController.add)
    r.post("/admin/post-add", adminPostController.addData)
    r.get("/admin/post-delete/delete?:categorID", adminPostController.deleteOne)
    /* post */
    /* page */
    r.get("/admin/pages", adminPageController.index)
    r.get("/admin/page-edit/edit?:pageID", adminPageController.edit)
    r.post("/admin/page-edit/edit?:pageID", adminPageController.update)
    r.get("/admin/page-add", adminPageController.add)
    r.post("/admin/page-add", adminPageController.addData)
    r.get("/admin/page-delete/delete?:categorID", adminPageController.deleteOne)
    /* page */
    /* settings */
    r.get("/admin/settings/edit", adminSettingsController.edit)
    r.post("/admin/settings/edit", adminSettingsController.update)
    /* settings */
    /* admin */
    /* site */
    r.get("/page/:page", pageController.index)
    r.get("/:category", categoryController.index)
    r.get("/:category/:post", postController.index)
    return r;
}



module.exports = router