import express from 'express'
import {createServer} from "node:http"
import { Server } from 'socket.io'
import mongoose from 'mongoose'
import cors from "cors"
import { connectTOSocket } from './controllers/socketMAnager.js'
import userRoutes from "./routes/users.route.js"
import dotenv from "dotenv"
if (process.env.NODE_ENV !== "production") {
    dotenv.config();
}


const app = express()
const server=createServer(app)
const io=connectTOSocket(server)
const dburl=process.env.ATLASDB_URL;

app.set("port",(process.env.PORT || 8080))
app.use(cors())
app.use(express.json({limit:"40kb"}))
app.use(express.urlencoded({limit:"40kb",extended: true}))


app.use("/api/v1/users",userRoutes)

const start=async ()=>{
  app.set("mongo_user")
  const connectionDb= await mongoose.connect(dburl)
  server.listen(app.get("port"), () => {
  console.log('Server is running on http://localhost:8080')
})
}

start()
