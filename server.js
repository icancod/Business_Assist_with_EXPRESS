import express from 'express'
import cors from 'cors';
import { apiRouter } from './dashboard-routes.js'
const port = 8000
const app = express()
app.use(cors())

app.use('/EXPRESS/dashboard',apiRouter)
app.use((req,res)=>{
    res.status(404).json({message:"End point not found"})
})
app.listen(port,() =>{
    console.log(`server running on ${port}`);
})