import express from 'express';
import dotenv from 'dotenv'

dotenv.config();
const app = express();



//in build middleWare are
app.use(express.json());


export{app}