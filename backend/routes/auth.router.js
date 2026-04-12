const Router = require("express");
const router = new Router();
const authMiddleware = require("../middlewares/authMiddleware.js");
const { controller } = require("../controllers/authController.js");

router.post("/signin", controller.signin);
router.post("/signup", controller.signup);

router.delete("/delete", authMiddleware, controller.deleteUser);

module.exports = router;
