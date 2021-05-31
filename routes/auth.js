var express = require("express");
var router = express.Router();
const { check } = require("express-validator");
const { signout, signup, signin} = require("../controllers/auth");

//Sign Up
router.post(
	"/signup",
	[
		check("name")
			.isLength({ min: 3 })
			.withMessage("Name must be at least 3 chars long"),
		check("email").isEmail().withMessage("Provide an Email"),
		check("password").isLength({ min: 3 }).withMessage("must contain a number"),
	],
	signup
);

//Login
router.post(
	"/signin",
	[
		check("email").isEmail().withMessage("Provide an Email"),
		check("password").isLength({ min: 3 }).withMessage("Password Is Required"),
	],
	signin
);

//Sign Out
router.get("/signout", signout);


router.get("/blogs", getAllBlogs);
router.get("/blog/:id",getBlogById);
router.put("/blog/:id",updateBlogById);
router.delete("/blog/:id", deleteBlogById);


module.exports = router;
