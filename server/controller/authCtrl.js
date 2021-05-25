const bcrypt = require('bcryptjs');
var async = require('async');
const jwt = require('jsonwebtoken');
const User = require('../models/usersModel.js');
const config = require('../config');

// Check if E-mail is Valid or not
const validateEmail = (email) => {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

const checkUserUniqueness = async (field, value) => {
    return { error, isUnique } = await User.findOne({[field]: value}).exec()
        .then(user => {
            let res = {};
            if (Boolean(user)) {
                res = { error: "This " + field + " is not available", isUnique: false };
            } else {
                res = { error: "", isUnique: true };
            }
            return res;
        })
        .catch(err => console.log(err))
}

const validate = async (req, res) => {
    const { field, value } = req.body;
    const { error, isUnique } = await checkUserUniqueness(field, value);

    if (isUnique) {
        res.json({ success: 'success' });
    } else {
        res.json({ error });
    }
}

const signup = async (req, res) => {
    const name = req.body.values.name || '';
    const username = req.body.values.username || '';
    const email = req.body.values.email || '';
    const address = req.body.values.address || '';
    const phonenumber = req.body.values.phonenumber || '';
    const password = req.body.values.password || '';

    const uniquBody = { username, email, password};

    let errorMsg = "";
    await async.forEach(Object.keys(uniquBody), async field => {
        if (uniquBody[field] === '') {
            errorMsg = [field] + ': This field is required';
        }
        if (field === 'username' || field === 'email') {
            const value = uniquBody[field];
            const { error, isUnique } = await checkUserUniqueness(field, value);
            if (!isUnique) {
                errorMsg = error;
            }
        }
        if (field === 'email' && !validateEmail(uniquBody[field])) {
            errorMsg = [field] + ': Not a valid Email';
        }
        if (field === 'password' && password !== '' && password < 4) {
            errorMsg = [field] + 'Password too short';
        }
        return errorMsg;
    });
    if (errorMsg !== "") {
        res.json({ message : errorMsg, status: "error" });
    } else {
        const newUser = new User({
            profile: { name },
            username: username,
            email: email,
            address: address,
            phonenumber: phonenumber,
            password: password
        });
        // Generate the Salt
        bcrypt.genSalt(10, (err, salt) => {
            if(err) return err;
            // Create the hashed password
            bcrypt.hash(newUser.password, salt, (err, hash) => {
                if(err) return err;
                newUser.password = hash;
                // Save the User
                newUser.save(function(err){
                    if(err) return err
                    res.json({ status: 'success' });
                });
            });
        });
    }
}

const signin = (req, res) => {
    const username = req.body.values.username || '';
    const password = req.body.values.password || '';
    const errorMsg = '';

    if (username === '') {
        errorMsg = 'Username field is required';
    }
    if (password === '') {
        errorMsg = 'Password field is required';
    }

    if (errorMsg !== '') {
        res.json({ status: "fail", message: errorMsg });
    } else {
        User.findOne({username: username}, (err, user) => {
            if (err) throw err;
            if (Boolean(user)) {
                // Match Password
                bcrypt.compare(password, user.password, (err, isMatch) => {
                    if (err) return err;
                    if (isMatch) {
                        const token = jwt.sign({
                                id: user._id,
                                username: user.username
                            }, config.jwtSecret);
                        res.json({ token, status: 'success', user: user })
                    } else {
                       res.json({ message: 'Invalid Username or Password', status: "fail" });
                    }
                });
            } else {
                res.json({ message: 'Invalid Username or Password', status: "fail" });
            }
        });
    }
}

module.exports = {signup, signin, validate};