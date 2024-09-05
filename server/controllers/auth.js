const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { jwtSecret } = require('../config');

// User Registration
exports.register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if(username == "") return res.status(400).json({status: false, message: 'Username is required' });
        if(email == "") return res.status(400).json({status: false, message: 'Email is required' });
        if(password == "") return res.status(400).json({status: false, message: 'Password is required' });

        const user = await User.findOne({ email });
        if (user) return res.status(200).json({status: false, message: 'Email all ready registered with us' });

        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await User.insertMany({
            username,
            email,
            password: hashedPassword,
        });

        const token = jwt.sign({ userId: result[0]._id }, jwtSecret, { expiresIn: '24h' });
        res.status(200).json({status: true, message: 'Registered successfully', token: token });

    } catch (error) {
        console.log('Error on registration' , error)
        res.status(200).json({status: false, message: 'Error registering user'});
    }
}


// User Login
exports.login = async (req, res) => {

    try {

        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(200).json({status: false, message: 'User not found' });
    
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(200).json({status: false, message: 'Invalid credentials' });
    
        const token = jwt.sign({ userId: user._id }, jwtSecret, { expiresIn: '24h' });
        res.status(200).json({status: true, message: 'Login successfully', token: token });
        
    } catch (error) {
        console.log('Error on login' , error)
        res.status(200).json({status: false, message: 'Error login user'});
    }

}