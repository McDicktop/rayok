const User = require("../models/user.js");

const {
    generateToken,
    hashPassword,
    comparePassword,
} = require("../utils/auth.js");

class authController {
    async signup(req, res) {

        try {
            const users = await User.find();
            if (users.length >= 2) {
                return res.status(409).json({
                    message: "User limit exceeded",
                    error: "USER_EXCESS",
                });
            }

            // ПРОВЕРКИ

            const { email, password } = req.body;

            const candidate = await User.findOne({ email });

            if (candidate) {
                return res.status(409).json({
                    message: "User already exist",
                    error: "USER_EXISTS",
                });
            }

            const hashedPassword = await hashPassword(password);
            const user = new User({ email, password: hashedPassword });
            await user.save();

            return res.status(201).json({ message: "User created" });
        } catch (e) {
            console.log(e);
            return res.status(500).json({
                message: "Internal server error",
                error: "SERVER_ERROR",
            });
        }
    }
    async signin(req, res) {
        try {

            const { email, password } = req.body;

            const user = await User.findOne({ email });

            if (!user) {
                return res.status(404).json({
                    message: `User ${email} couldnt be found`,
                    error: "USER_MISSING",
                });
            }

            const isValidPassword = await comparePassword(
                password,
                user.password,
            );

            if (!isValidPassword) {
                return res.status(400).json({
                    message: "Invalid password",
                    error: "INVALID_PASSWORD",
                });
            }

            const token = generateToken(user._id, user.email);
            return res
                .status(201)
                .json({ token, userId: user._id, email: user.email });
        } catch (e) {
            console.log(e);
            return res.status(500).json({
                message: "Internal server error",
                error: "SERVER_ERROR",
            });
        }
    }
    async deleteUser(req, res) {
        try {
            const { email, password } = req.body;

            const user = await User.findOne({ email });

            if (!user) {
                return res.status(404).json({
                    message: `User ${email} couldnt be found`,
                    error: "USER_MISSING",
                });
            }

            const isValidPassword = await comparePassword(
                password,
                user.password,
            );

            if (!isValidPassword) {
                return res.status(400).json({
                    message: "Invalid password",
                    error: "INVALID_PASSWORD",
                });
            }

            const deletedUser = await User.findByIdAndDelete(user._id);

            return res.status(200).send(deletedUser);
        } catch (e) {
            console.log(e);
            return res.status(500).json({
                message: "Internal server error",
                error: "SERVER_ERROR",
            });
        }
    }
}

module.exports = { controller: new authController() };
