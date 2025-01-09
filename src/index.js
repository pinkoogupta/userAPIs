import express from 'express';
import dotenv from 'dotenv';
import sequelize from './db/db.js';
import cors from 'cors';
import cookiesParser from 'cookie-parser';

const app=express();

app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}))

app.use(express.json({limit:'16kb'}));
app.use(express.urlencoded({extended:true,limit:"16kb"}));
app.use(express.static("public"));
app.use(cookiesParser());
dotenv.config();

const PORT =process.env.PORT || 6000;

// middleware
app.use(express.json());


// connection with the db
(async () => {
    try {
        await sequelize.authenticate();
        console.log(`Connected to the MySQL database successfully`);
    } catch (error) {
        console.log(`Error starting the database connection:`, error);
    }
})();


// connection with server
(async () => {
    try {
        await sequelize.sync();  //sync with server to sql
        const PORT = 3000; 
        app.listen(PORT, () => {
            console.log(`Listening on port ${PORT}`);
        });
    } catch (error) {
        console.log(`Error with connection to the server:`, error);
    }
})();