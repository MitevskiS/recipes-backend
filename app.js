require("dotenv").config();
const express = require ('express');
const bodyParser = require ('body-parser');
const mongoose = require ('mongoose');
const cors = require ('cors');
const recipeRoutes = require ('./routes/routes.js');

const app = express();

app.use(bodyParser.json({ limit: "30mb", extendend: true}));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true}));
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

const whitelist = ["http://localhost:3000"]
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error("Not allowed by CORS"))
    }
  },
  credentials: true,
}
app.use(cors(corsOptions))
app.use(recipeRoutes);


const CONNECTION_URL = 'mongodb+srv://projectsemos:projectsemos123@cluster0.j6dlvwn.mongodb.net/?retryWrites=true&w=majority';
const PORT = process.env.PORT || 5000 ;


mongoose.connect(CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => app.listen(PORT, () => console.log(`Server running on port: ${PORT}`)))
    .catch((error) => console.log(error.message));