const bcrypt = require('bcryptjs');
var async = require('async');
const jwt = require('jsonwebtoken');
const User = require('../models/usersModel.js');
const config = require('../config');
const { STATUS_ACTIVE, USER_ROLE } = require('../constants')
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
    let signData = {
        profile: {
            name: req.body.values.name || '',
        },
        username: req.body.values.username || '',
        email: req.body.values.email || '',
        address: req.body.values.address || '',
        phonenumber: req.body.values.phonenumber || '',
        password: req.body.values.password || '',
        role: req.body.values.role || '',
    };

    if (signData.role === USER_ROLE[0]) {
        siteID.role = req.body.values.siteID || '';
    }

    const newUser = new User({ ...signData});
    // Generate the Salt
    bcrypt.genSalt(10, (err, salt) => {
        if(err) return err;
        // Create the hashed password
        bcrypt.hash(newUser.password, salt, (err, hash) => {
            if(err) return err;
            newUser.password = hash;
            // Save the User
            newUser.save()
            .then( result => {
                console.log("success")
                res.json({ status: 'success' });
            })
            .catch( err => {
                console.log(err)
            });
        });
    });
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
                        // check active
                        if ( user.status !== STATUS_ACTIVE ) {
                            return res.json({ message: 'You are not allowed here, Please wait Admin allow you', status: "fail" });
                        }
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