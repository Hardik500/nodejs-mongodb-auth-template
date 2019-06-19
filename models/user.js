const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
      username:{
        type:String
      },
      password:{
        type:String
      },
      email:{
        type:String
      },
      name:{
        type:String
      }
})

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User",userSchema);
