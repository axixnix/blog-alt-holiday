const mongoose =require("mongoose")
const Schema = mongoose.Schema
const ObjectId = Schema.ObjectId;

const UserSchema = new Schema({
    id: ObjectId,
    created_at:Date,
    first_name:{type:String,required:true},
    last_name:{type:String,required:true},
    email:{type:String,required:true,unique:true},
    password:{type:String,required:true}
})

const User = mongoose.model("User",UserSchema)

module.exports = User