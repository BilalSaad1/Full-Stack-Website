const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./User');
const crypto = require('crypto');
const router = express.Router();

router.post('/register', async (req, res) => {
    try {
        const { email, password, username } = req.body;
        let user = await User.findOne({ email });
    if (user) {
        return res.status(400).send('User already exists');
    }

const salt = await bcrypt.genSalt(10);
const hashedPassword = await bcrypt.hash(password, salt);

const verificationToken = crypto.randomBytes(20).toString('hex');

const verificationTokenExpires = Date.now() + 24*60*60*1000;
user = new User({
    username,
    email,
    password: hashedPassword,
    verificationToken,
    verificationTokenExpires
});
await user.save();
const verificationLink = `${verificationToken}`;

res.status(201).json({ message: 'User registered successfully.', verificationLink });
} catch (err) {
console.error(err.message);
res.status(500).send('Server error');
alert('error')
}
});

router.post('/login', async (req, res) => {
const { email, password } = req.body;

try {
let user = await User.findOne({ email });
if (!user) {
    return res.status(401).json({ msg: 'Invalid Credentials' });
}

const isMatch = await bcrypt.compare(password, user.password);
if (!isMatch) {
    return res.status(401).json({ msg: 'Invalid Credentials' });
}

if (user.isdeactivated) {
    return res.status(403).json({ msg: 'Account is deactivated. Please contact admin.' });
}

const payload = { user: { id: user.id } };
jwt.sign(
    payload,
    process.env.JWT_SECRET, 
    { expiresIn: '1h' },
    (err, token) => {
        if (err) throw err;
        res.json({ token, isEmailVerified: user.isEmailVerified, isAdmin: user.isAdmin });
    }
);
} catch (err) {
console.error(err.message);
res.status(500).send('Server error');
}
});
router.post('/change-password', async (req, res) => {
const { email, currentPassword, newPassword } = req.body;

try {
    let user = await User.findOne({ email });
    if (!user) {
        return res.status(404).json({ msg: 'User not found' });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
        return res.status(400).json({ msg: 'Incorrect current password' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedNewPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedNewPassword;
    await user.save();

    res.json({ msg: 'Password successfully changed' });
} catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
}
});

module.exports = router;