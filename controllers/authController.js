const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '1h',
    });
}  

exports.registerUser = async (req, res) => {
    const { fullName, email, password, profileImageURL } = req.body;
     if (!fullName || !email || !password) {
        return res.status(400).json({
            message: "Please provide all fields",
        });
    }

    try {
        const UserExists = await User.findOne({ email });
        if (UserExists) {
            return res.status(400).json({
                message: "User already exists",
            });
        }

        const user = await User.create({
            fullName,
            email,
            password,
            profileImageURL,
        });

        res.status(201).json({
            _id: user._id,
            user,
            token: generateToken(user._id),
        });

    } catch (err) {
        res.status(500).json({
            message: "Error registering user",
            error: err.message,
        });
    }
};

exports.loginUser = async (req, res) => {
     const { email, password } = req.body;
     if (!email || !password) {
        return res.status(400).json({
            message: "All fields are required",
        });
    };
        try{
            const user = await User.findOne({ email });
            if(!user || !(await user.matchPassword(password))){
                return res.status(401).json({
                    message: "Invalid credentials",
                });
            }
            res.status(200).json({
                _id: user._id,
                user,
                token: generateToken(user._id),
            });
        } catch(err){
            res.status(500).json({
                message: "Error logging in user",
                error: err.message,
            });
        }

}
exports.getUserInfo = async (req, res) => {
     try{
        const user = await User.findById(req.user._id).select("-password");
        if(!user){
            return res.status(404).json({
                message: "User not found",
            });
        }
        res.status(200).json({
            user,
        });
     } catch(err){
        res.status(500).json({
            message: "Error fetching user info",
            error: err.message,
        });
     }
};
