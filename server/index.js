import express from "express";
import { app, server } from "./socket/socket.js";
import cors from "cors"
import dotenv from "dotenv"
import path from "path"

dotenv.config();
const corsOption={
    origin:'https://codecollab-s62f.onrender.com',
    credentials:true
};
app.use(cors(corsOption))

app.use(express.json());
app.use(express.urlencoded({extended:true}))

// Deployment

if(process.env.NODE_ENV==='production'){
    const dirPath=path.resolve()   // get  current directory path
    app.use(express.static("./client/dist"));
    app.get("*",(req,res)=>{
        res.sendFile(path.resolve(dirPath,'./client/dist','index.html'))
    })
}


server.listen(3000,()=>{
    console.log("server connected");
    
})