
const express = require("express");
const multer = require("multer");
const cloudinary = require('cloudinary').v2;
cloudinary.config({
    cloud_name: 'dm310pkki',
    api_key: '696431627784711',
    api_secret: 'QfQ25jKnXZJw2CaRsIpY6hNTzEw'
});
const User = require("../db/user");
const bcrypt = require('bcrypt');
const router = express.Router();

// Change password for logged-in user
router.put('/change-password', async (req, res) => {
    const userId = req.user.id;
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) {
        return res.status(400).send({ message: 'Old and new password required.' });
    }
    try {
        const user = await User.findById(userId);
        if (!user) return res.status(404).send({ message: 'User not found.' });
        const match = await bcrypt.compare(oldPassword, user.password);
        if (!match) return res.status(400).send({ message: 'Old password is incorrect.' });
        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();
        res.send({ message: 'Password changed successfully.' });
    } catch (err) {
        res.status(500).send({ message: 'Error changing password', error: err });
    }
});

// Set up multer for memory storage (for Cloudinary)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Update user profile (with image)
router.put('/', upload.single('profileImage'), async (req, res) => {
    const userId = req.user.id;
    const update = req.body;
    // Parse securityQuestions if sent as a string, array, or comma-separated string
    if (typeof update.securityQuestions === 'string') {
        try {
            // Try to parse as JSON first
            update.securityQuestions = JSON.parse(update.securityQuestions);
        } catch (e) {
            // If it looks like a comma-separated string, try to split and parse each item
            if (update.securityQuestions.includes(',')) {
                try {
                    update.securityQuestions = update.securityQuestions.split(',').map(q => {
                        // Try to parse each item as JSON, fallback to string
                        try {
                            return JSON.parse(q);
                        } catch {
                            return q;
                        }
                    });
                } catch (splitErr) {
                    console.error('Failed to process comma-separated securityQuestions:', splitErr, update.securityQuestions);
                    return res.status(400).send({ message: 'Invalid securityQuestions format', error: splitErr });
                }
            } else {
                console.error('Failed to parse securityQuestions:', e, update.securityQuestions);
                return res.status(400).send({ message: 'Invalid securityQuestions format', error: e });
            }
        }
    } else if (Array.isArray(update.securityQuestions)) {
        // If it's an array, ensure it's an array of objects
        try {
            update.securityQuestions = update.securityQuestions.map(q => {
                if (typeof q === 'string') {
                    try {
                        return JSON.parse(q);
                    } catch {
                        return q;
                    }
                }
                return q;
            });
        } catch (e) {
            console.error('Failed to process securityQuestions array:', e, update.securityQuestions);
            return res.status(400).send({ message: 'Invalid securityQuestions array format', error: e });
        }
    }
    try {
        if (req.file) {
            // Upload to Cloudinary
            cloudinary.uploader.upload_stream(
                { resource_type: 'image', folder: 'profile_images' },
                async (error, result) => {
                    if (error) {
                        console.error('Cloudinary upload error:', error);
                        return res.status(500).send({ message: 'Cloudinary error', error });
                    }
                    update.profileImage = result.secure_url;
                    try {
                        const user = await User.findByIdAndUpdate(userId, update, { new: true });
                        if (!user) return res.status(404).send({ message: 'User not found' });
                        res.send(user);
                    } catch (dbErr) {
                        console.error('DB error after Cloudinary upload:', dbErr);
                        res.status(500).send({ message: 'Error updating profile after image upload', error: dbErr });
                    }
                }
            ).end(req.file.buffer);
        } else {
            const user = await User.findByIdAndUpdate(userId, update, { new: true });
            if (!user) return res.status(404).send({ message: 'User not found' });
            res.send(user);
        }
    } catch (err) {
        console.error('Profile update error:', err);
        res.status(500).send({ message: 'Error updating profile', error: err });
    }
});

// Get logged-in user's profile
router.get('/', async (req, res) => {
    const userId = req.user.id;
    try {
        const user = await User.findById(userId).select('-password');
        if (!user) return res.status(404).send({ message: 'User not found.' });
        res.send(user);
    } catch (err) {
        res.status(500).send({ message: 'Error fetching profile', error: err });
    }
});
module.exports = router;
