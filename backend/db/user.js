const mongoose=require("mongoose");
const userSchema=new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: String,
    password: String,
    isAdmin: Boolean,
    profileImage: String,
    company: String,
    street: String,
    zip: String,
    state: String,
    country: String,
    telephone: String,
    securityQuestions: [
        {
            question: { type: String, required: true },
            answerHash: { type: String, required: true }
        }
    ]
});
const User=mongoose.model("users",userSchema);
module.exports=User;