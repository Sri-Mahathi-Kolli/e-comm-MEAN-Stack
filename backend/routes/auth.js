
const express=require("express");
const { registerUser, loginUser } = require("../handlers/auth-handler");
const { forgotPassword, resetPassword, getSecurityQuestions, verifySecurityAnswers, verifySecurityAnswer } = require("../handlers/forgot-handler");
const router=express.Router();

router.post("/verify-security-answer", verifySecurityAnswer);

// Security questions based password reset
router.post("/get-security-questions", getSecurityQuestions);
router.post("/verify-security-answers", verifySecurityAnswers);

router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

router.post("/register",async(req,res)=>{
    let model=req.body;
    if(model.firstName && model.lastName && model.email && model.password){
        await registerUser(model);
        res.send({
            message:"user registered",
        });
    }else{
        res.status(400).json({
            error:"please provide firstName, lastName, email and password",
        });
    }
});

router.post("/login",async(req,res)=>{
    let model=req.body;
    if(model.email && model.password){
        const result=await loginUser(model);
        if(result){
            res.send(result);
        }else{
            res.sendStatus(400).json({
                error:"email or password is incorect",
            });
        }

    }else{
        res.status(400).json({
            error:"please provide name, email and password",
        });
    }

});


module.exports=router;