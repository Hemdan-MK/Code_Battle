import express from 'express';
const router = express.Router();


router.get('/test', (req,res)=> {
    res.json({
        success : true,
        message : "Server is running ...",
        timestamp : new Date().toISOString() 
    });
})

export default router