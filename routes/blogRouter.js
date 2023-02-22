const express = require("express")
const blogRouter = express.Router()
const blogController =require("../controllers/blogController")
const BlogValidation = require("../validators/blog.validator")








blogRouter.post("/create",BlogValidation,blogController.createBlog)//works

blogRouter.delete("/delete/:id",blogController.deleteBlog)//works

blogRouter.get("/getmyblogs",blogController.getMyBlogs)//works

blogRouter.get("/getmyblog/:blog_id",blogController.userGetOne)

blogRouter.patch("/updatestate/:blog_id",blogController.updateState)//works

blogRouter.put("/edit/:blog_id",blogController.editBlog)

blogRouter.post("/published",blogController.getPublishedBlogs)//works but is index.js

blogRouter.get("/published/:id",blogController.getAPublishedBlog)//works but its in the index.js






module.exports =blogRouter
Footer