import express from "express";

const app = express();

app.use(express.json());
app.use('/',(req,res)=>{
    res.send("hello to the dark side")
})
export default app;