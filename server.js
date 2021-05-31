const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const mysqlConnection = require("./database");

dotenv.config({ path: "./.env" });

//Port
const port = process.env.PORT;

//Routes
const authRoutes = require("./routes/auth");

//dbConnection

//middlewares
app.use(express.urlencoded({ extended: false })); //work as body-parser
app.use(express.json());
app.use(cookieParser());


//My Route
app.use("/api", authRoutes);

//																							Error Handling
//errors: page not found 404
app.use((req, res, next) => {
	var err = new Error("Page Not Found");
	err.status = 404;
	next(err);
});

//handling errors
app.use((err, req, res, next) => {
	res.status(err.status || 500);
	res.send(err.message);
});

//																						starting a server
app.listen(port, () => {
	console.log(`App is Running at the PORT ${port}`);
});
