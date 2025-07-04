import rateLimit from "express-rate-limit";


const  limiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 100,
    message: 'Too many requests from this IP, plaese try again after some times'
})

export default limiter;