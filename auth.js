'use strict';
const express = require('express');
const router = express.Router();
const md5 = require('md5');
const jwt = require('jsonwebtoken');

// **Import model di bagian atas file**
const { user } = require('../models'); // <-- ini penting, harus sesuai modelName 'user'

const JWT_SECRET = 'rahasia123';

// Route login POST
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    // validasi body
    if (!username || !password) {
        return res.status(400).json({
            status: 'error',
            message: 'Username dan password wajib diisi'
        });
    }

    try {
        // **Cari user di database**
        const foundUser = await user.findOne({ where: { username } }); // <-- pakai 'user', sesuai import

        if (!foundUser) {
            return res.status(401).json({
                status: 'error',
                message: 'Username tidak ditemukan'
            });
        }

        // Cek password
        if (foundUser.password !== md5(password)) {
            return res.status(401).json({
                status: 'error',
                message: 'Password salah'
            });
        }

        // Buat token JWT
        const token = jwt.sign(
            { userID: foundUser.userID, role: foundUser.role, username: foundUser.username },
            JWT_SECRET,
            { expiresIn: '8h' }
        );

        return res.json({
            status: 'success',
            message: 'Login berhasil',
            token
        });

    } catch (error) {
        console.error(error); // lihat detail error di console
        return res.status(500).json({
            status: 'error',
            message: 'Terjadi kesalahan server'
        });
    }
});

module.exports = router;
