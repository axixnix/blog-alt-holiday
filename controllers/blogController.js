const BlogModel = require('../models/blogModel');
const UserModel = require('../models/userModel');
const moment = require("moment");
//const { find } = require('../models/blogModel');


exports.createBlog = async (req,res)=>{
    const user = await UserModel.findOne({_id:req.user.user_id})
    const blog = await  BlogModel.create({
       creator_id:req.user.user_id,
        created_at:moment().toDate(),
        title:req.body.title,
        description:req.body.description,
        tags:req.body.tags,
        author:user.first_name+" "+user.last_name,
        state:"draft",
        read_count:0,
        reading_time:`this is a ${req.body.reading_time} minute read`,
        body:req.body.body
    }).then(blog=>{
        res.send({
            success:true,
            message:"blog created successfully",
            blog:blog
        })
    }).catch(err=>{
        res.send({
            success:false,
            message:"failed to create blog",
            error:err
        })

    })


}

exports.getPublishedBlogs = async (req,res)=>{
    async (req,res)=>{
        const published = await blogModel.find({state:"published"},{body:0})
        res.send({
            success:true,
            message:" published blogs retrieved successfully",
            blog:published
        })
    }
}

exports.getAllMyBlogs = async (req,res)=>{
    try{
        const state = req.params.id2
        const blog_id = String(req.params.id)
        const user_id = req.user.user_id
        const Limit = req.body.limit|| 20
        const skip = req.body.skip || 0
        const check = await BlogModel.find({_id:blog_id})
        console.log("this is a check  "+check)
        if(!check){return res.send({status:false,message:"blog not in record"})}
        if(state==1){
            const blogs= await BlogModel.find({creator_id:user_id,state:"published"})//.limit(Limit).skip(skip)
          console.log("exists?  "+blogs)
            if(!blogs){
            return res.send({status:false,message:"you have 0 published blogs"})
          }else{
            return res.send({status:true,
                message:"these are your published blogs",
                blogs:blogs})
          }
            
        }

        if(state==2){
            const blogs= await BlogModel.find({creator_id:user_id,state:"draft"}).limit(Limit).skip(skip)
            if(!blogs){
                return res.send({status:false,message:"you have 0  blogs in draft"})
              }
            return res.send({status:true,
            message:"these are your blog drafts",
            blogs:blogs})
        }

        if(state==0){
            const blogs= await BlogModel.find({creator_id:user_id}).limit(Limit).skip(skip)
        return res.send({status:true,
            message:"these are all your blogs",
            blogs})
        }

        if((state!=0)||(state!=1)||(state!=2)){
        
        return res.send({status:false,
            message:"undefined state requested, check state parameter"
            })
        }
        

    }
    catch(err){console.log(err)
       return res.send({status:false,
        message:"encountered error while attempting to retrieve your blogs",
        
    error:err})
    }
}

//exports.testRes = async (req,res)=>{
//console.log(res.locals.userId)
//}

exports.publishBlog = async (req,res)=>{
    try{
        const id=req.params.id
        const user_id = req.user.user_id
        const blog = await BlogModel.findOne({_id:id})
        if(!blog){
            return res.send({
                status:false,
                message:"id does not any blog in our records"
            })
        }
        const b_id =String(blog.creator_id)
        const u_id = String(user_id)
        if(!(u_id==b_id)){
            return res.send({status:false,
            message:"you are not authorized to perform this action"})
        }
        if(blog.state=="published"){
          return res.sen({status:false,message:"blog already published"})
        }

        blog.state ="published"
        await blog.save()
        return res.send({status:true,message:"blog publishing successful"})

    }catch(err){
      res.send({sucess:false,
    message:"unable to publish blog",
    error:err
    })

}}


exports.deleteBlog = async (req, res) => {
    const { id } = req.params;
    const user_id = req.user.user_id
    check = await BlogModel.findById({_id:id})
    if(!check){
        return res.send({
            success:false,
            message:`id:${blog_id} does not match any blog in our records`,
        
        })
    }
    
    const creator_id = check.creator_id
    console.log(creator_id==user_id)
    console.log("blog id from request  "+id)
    if(check && (creator_id==user_id)){
    const blog = await BlogModel.deleteOne({ _id: id})
    return res.json({ status: true, message:"blog has been deleted",blog:blog })
    }
    if(check &&  !((check.creator_id===user_id))){
        
        return res.json({ status: false, message:"unauthorized" })
        }
    
}


exports.editBlog = async (req, res) => {
    const { id } = req.params;
    const options ={body:"",title:"",description:"",tags:""}
    //const { state } = req.body;

    const blog = await BlogModel.findById(id)

    if (!blog) {
        return res.status(404).json({ status: false, message:"id does not match any blog in our  records" })
    }

    if (!(req.body.body=="")) {
        blog.body =req.body.body
        //await blog.save()
       // return res.send({status:true,message})
    }
    
    if(!(req.body.tags =="")){
        blog.tags = req.body.tags
    }

    if(!(req.body.title =="")){
        blog.title = req.body.title
    }

    if(!(req.body.description =="")){
        blog.description = req.body.description
    }
    

    

    await blog.save()

    return res.json({ status: true, message:"blog edited successfully" })
}