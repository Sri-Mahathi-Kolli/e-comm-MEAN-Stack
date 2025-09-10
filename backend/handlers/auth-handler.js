const{model}=require("mongoose");
const User=require("./../db/user");
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');

async function registerUser(model){
        const hashPassword=await bcrypt.hash(model.password,10);
        // Debug: log incoming securityQuestions
        console.log('Received securityQuestions:', model.securityQuestions);
        // Validate security questions
        if (!Array.isArray(model.securityQuestions) || model.securityQuestions.length !== 3) {
            console.error('Invalid securityQuestions array:', model.securityQuestions);
            throw new Error('Exactly 3 security questions are required.');
        }
        // Hash security answers
        const securityQuestions = await Promise.all(model.securityQuestions.map(async (q, idx) => {
            if (!q.question || !q.answer) {
                console.error(`Missing question or answer at index ${idx}:`, q);
                throw new Error('All security questions and answers must be provided.');
            }
            // Normalize answer before hashing
            const normalizedAnswer = q.answer.trim().toLowerCase();
            return {
                question: q.question,
                answerHash: await bcrypt.hash(normalizedAnswer, 10)
            };
        }));
        // Debug: log processed securityQuestions
        console.log('Processed securityQuestions:', securityQuestions);
        let user = new User({
                firstName: model.firstName,
                lastName: model.lastName,
                email: model.email,
                password: hashPassword,
                isAdmin: false,
                securityQuestions
        });
    await user.save();
    // Fetch and log the user from MongoDB to confirm what is stored
    const savedUser = await User.findOne({ email: model.email });
    console.log('MongoDB user document:', savedUser);
}

async function loginUser(model){
    const user = await User.findOne({email:model.email});
    if(!user){
        return null;
    }
    const isMatched=await bcrypt.compare(model.password,user.password);
    if(isMatched){
        const token= jwt.sign({
            id:user._id,
            name:user.name,
            email:user.email,
            isAdmin:user.isAdmin

        },process.env.JWT_SECRET,{
            expiresIn:"1h"
        });
        return {token,user};

    }else{
        return null;
    }
}
module.exports={registerUser,loginUser}