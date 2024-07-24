import express from 'express';






const app = express();



//in build middleWare are
app.use(express.json());



// import routes
import auth from './routes/auth.route.js';


app.use('/api/v1/auth', auth);

export{app}


