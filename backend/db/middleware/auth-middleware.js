const jwt=require("jsonwebtoken");

function verifyToken(req,res,next){
    if (req.method === "OPTIONS") {
    return next();
  }
    const token=req.header("Authorization");
    if(!token){
        return res.status(401).send({
            error:"access denied",
        });
    }
    try{
        const decode=jwt.verify(token, process.env.JWT_SECRET || "secret");
        console.log(decode);
        req.user=decode;
        next();
    }catch(err){
        return res.status(401).send({
            error:"invalid token"
        });

    }
}

function isAdmin(req,res,next){
    console.log('isAdmin middleware:', {
      user: req.user,
      isAdminType: typeof req.user?.isAdmin,
      isAdminValue: req.user?.isAdmin
    });
    if(req.user && req.user.isAdmin === true){
        next();
    }else{
        return res.status(403).send({
            error:"forbidden",
        });
    }
}

// Optional token verification - doesn't fail if no token provided
function verifyTokenOptional(req, res, next) {
    if (req.method === "OPTIONS") {
        return next();
    }
    
    const token = req.header("Authorization");
    if (!token) {
        // No token provided, continue without user authentication
        req.user = null;
        return next();
    }
    
    try {
        console.log('🔍 Debug token verification:', {
            tokenPresent: !!token,
            tokenLength: token ? token.length : 0,
            jwtSecret: process.env.JWT_SECRET ? 'Present' : 'Missing',
            tokenPrefix: token ? token.substring(0, 20) + '...' : 'None'
        });
        
        // Try with the current JWT secret first
        let decode;
        try {
            decode = jwt.verify(token, process.env.JWT_SECRET);
            console.log('✅ Token decoded with environment secret:', { userId: decode.id, email: decode.email });
        } catch (err) {
            // If that fails, try with the old hardcoded secret for backward compatibility
            console.log('🔄 Trying with fallback secret...');
            decode = jwt.verify(token, "secret");
            console.log('✅ Token decoded with fallback secret:', { userId: decode.id, email: decode.email });
        }
        
        req.user = decode;
        next();
    } catch (err) {
        console.log('❌ Token verification failed with both secrets:', err.message);
        // Invalid token, continue without user authentication
        req.user = null;
        next();
    }
}

module.exports={verifyToken,isAdmin,verifyTokenOptional};