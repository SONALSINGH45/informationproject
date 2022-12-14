const jwt = require('jsonwebtoken');

module.exports = (req,res,next)=>{
    
    try{
        console.log(req.headers.authorization);

        const token = req.headers.authorization.split("Bearer ")[1];
        console.log(token);
        const verify = jwt.verify(token, 'this is dummy text',(err,obj)=>{
            if(err){
                console.log(err)
                res.sendStatus(403)
            }else{
                req.token=obj
                next()
            }
        })
        
        
    }
    catch(error)
    {
        console.log(error)
        return res.status(400).json({
            msg: 'invalid token'
        })
    }
}