

const errorHandler = (error , req ,res ,next)=>{
    
    const statuscode = error.statusCode || 500;
    const message = error.message || 'internal error'
    
    res.status(statuscode).json({
        code:0,
        msg:message,
        time:Date.now(),
        data:null,
        stack:error.stack
    })
}

export default errorHandler