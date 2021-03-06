const mysqlConnection = require("../database");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.signin = async (req, res) => {
	try {
		const { email, password } = req.body;
		console.log(req.body);
		if (!email || !password) {
			return res
				.status(400)
				.send({ message: "Please Provide Email and Password" });
		}
		mysqlConnection.query(
			"SELECT * FROM user_info WHERE username = ?",
			[email],
			async (err, results) => {
				console.log(results);
				if (
					!results ||
					!(await bcrypt.compare(password, results[0].password))
				) {
					res.status(401).send({ message: "Email or Password is Incorrect" });
				} else {
					const id = results[0].id;
					const token = jwt.sign({ id: id }, process.env.JWT_SECRET, {
						expiresIn: process.env.JWT_EXPIRES_IN,
					});

					console.log("The Token is:" + token);

					const cookieOptions = {
						expires: new Date(
							Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
						),
						httpOnly: true, //To prevent from hacking
					};
					res.cookie("jwt", token, cookieOptions);
					res.status(200).send({ message: "Login Successfully" });
				}
			}
		);
	} catch (error) {
		console.log(error);
	}
};

exports.signup = (req, res) => {
	console.log(req.body);
	const { name, email, password, confirmPass } = req.body;

	mysqlConnection.query(
		"SELECT username FROM user_info WHERE username = ?",
		[email],
		async (err, results) => {
			if (err) {
				console.log(err);
			}

			if (results.length > 0) {
				return res.send({ message: "That email is already in use" });
			} else if (password !== confirmPass) {
				return res.send({ message: "Password do not match" });
			}
			let hashedPassword = await bcrypt.hash(password, 8);
			console.log(hashedPassword);

			mysqlConnection.query(
				"INSERT INTO user_info SET ?",
				{ name: name, username: email, password: hashedPassword },
				(err, results) => {
					if (err) {
						console.log(err);
					} else {
						console.log(results);
						return res.send({ message: "User Registered" });
					}
				}
			);
		}
	);
};

exports.signout = (req, res) => {
	res.clearCookie("token");
	res.json({
		message: "User Signout Successfully",
	});
};

exports.getAllBlogs = (req, res) => {
	mysqlConnection.query(
		"SELECT title,author from blog",
		async (err, result) => {
			if (err) {
				console.log(err);
			}
			if (result.length < 1) {
				return res.send({ message: "There is No Blogs" });
			} else {
				return res.send(result, { message: "All Blogs in DB" });
			}
		}
	);
};

exports.getBlogById = (req, res) => {
	const blogId = Number(req.param.id);
	mysqlConnection.query(
		"SELECT title,author,content FROM blog WHERE id = ?",
		[blogId],
		async (err, result) => {
			if (err) {
				console.log(err);
			}
			if (result.length < 1) {
				return res.send({ message: "There is No Blog with this ID" });
			} else {
				return res.send(result, { message: `Blog with ${blogId}` });
			}
		}
	);
};

exports.updateBlogById = (req, res) => {
	const blogId = Number(req.param.id);
	const { title, author, content } = req.body;
	mysqlConnection.query(
		"UPDATE blogs SET title = ?, author = ?, content=? WHERE id = ?",
		[title, author, content, blogId],
		async (err, result) => {
			if (err) {
				console.log("error:", err);
			}
		}
	);
};

exports.deleteBlogById = (req, res) => {
	const blogId = Number(req.param.id);
	if (!blogId) {
		return res.send({ meassage: "Please Enter Valid Id Format" });
	} else {
		mysqlConnection.query(
			"DELETE FROM users WHERE id = ?",
			[blogId],
			(err, result) => {
				if (err) {
					console.log("error:", err);
					return res.send({ message: "Unable to Delete the Blog" });
				} else {
				}
			}
		);
	}
};

// exports.isSignedIn = expressJwt({
// 	secret: process.env.JWT_SECRET,
// 	userProperty: "auth", //it sends the same id which user is signed in somewher you see req.auth which actual belongs from here
// });
