const util = require("util");
const mysql = require("mysql");
const dotenv = require("dotenv");

dotenv.config({ path: "./.env" });

var mysqlConnection = mysql.createConnection({
	host: process.env.DATABASE_HOST,
	user: process.env.DATABASE_USER,
	password: process.env.DATABASE_PASS,
	database: process.env.DATABASE,
});

mysqlConnection.connect((err) => {
	if (!err) {
		console.log("DB Connection Succeded");
	} else {
		console.log(
			"DB Connection Failed \n Error:" + JSON.stringify(err, undefined, 2)
		);
	}
});

mysqlConnection.query = util.promisify(mysqlConnection.query);

module.exports = mysqlConnection;
