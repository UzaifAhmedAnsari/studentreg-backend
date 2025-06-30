// hashPassword.js
const bcrypt = require('bcryptjs');

// Apni pasand ka Admin password yahan type karein
const adminPassword = 'Uz@if_6432'; // <-- Isko apne actual password se badlen

async function hashAndLogPassword(password) {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        console.log('--- HASHED PASSWORD ---');
        console.log(hashedPassword);
        console.log('--- Copy this hashed password ---');
    } catch (error) {
        console.error('Error hashing password:', error);
    }
}

hashAndLogPassword(adminPassword);