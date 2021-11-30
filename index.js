const express = require('express');
const moongoose = require('mongoose');
const errorHandlerMiddleware = require('./middleware/errorHandlerMiddleware.js');
const cors = require('cors');
const app = express();

const dotenv = require('dotenv');
dotenv.config();
const bookRouter = require('./routes/BookRoutes.js');
const usersRouter = require('./routes/usersRouter.js');
app.use(express.json());

const PORT = process.env.PORT || 8000;
app.use(cors({ credentials: true, origin: 'http://localhost:3000' }))
//register user
app.use('/api/users', usersRouter);
//Book
app.use('/api/books', bookRouter);
//handling error
app.use(errorHandlerMiddleware);


//connecting to DB
const dbURL = process.env.MONGODB_URL
moongoose.connect(dbURL).then(() => {
    app.listen(PORT, () => {
        console.log(`server running at port ${PORT}`)
    })
}).catch((err) => {
    console.log(err);
})

//backend server running port


//unbeat
//Tm0WUYuU2XmDnp8x