import express from 'express';
import morgan from 'morgan';
import mongoose from 'mongoose';
import cors from "cors";
import {router} from './routes/route.js';
import bodyParser from "body-parser";





const app = express()
const port = 3000

app.use(express.urlencoded({
    extended: true
}))

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(morgan('combined'))

app.use(express.json())

app.use(cors());

//---connect db---
mongoose.connect('mongodb://0.0.0.0:27017', { useNewUrlParser: true, useUnifiedTopology: true, dbName: 'req-quiz', })
.then(() => {
    console.log(`CONNECTED TO MONGO!`);
})
.catch((err) => {
    console.log(`MONGO CONNECTION ERROR!`);
    console.log(err);
})
//----------------

app.use('/attempts', router)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})