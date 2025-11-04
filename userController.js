'use strict';
const { user } = require('../models');
const md5 = require('md5');

// GET all users
exports.getAll = async (req, res) => {
    try {
        const users = await user.findAll({
            attributes: ['userID', 'name', 'username', 'role', 'createdAt', 'updatedAt']
        });

        return res.json({
            status: 'success',
            data: users
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: 'error',
            message: 'Terjadi kesalahan server'
        });
    }
};

// GET user by ID
exports.get = async (req, res) => {
    const { id } = req.params;
    try {
        const foundUser = await user.findByPk(id, {
            attributes: ['userID', 'name', 'username', 'role', 'createdAt', 'updatedAt']
        });

        if (!foundUser) {
            return res.status(404).json({
                status: 'error',
                message: 'User tidak ditemukan'
            });
        }

        return res.json({
            status: 'success',
            data: foundUser
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: 'error',
            message: 'Terjadi kesalahan server'
        });
    }
};

// POST add new user
exports.post = async (req, res) => {
    const { name, username, password, role } = req.body;

    if (!name || !username || !password || !role) {
        return res.status(400).json({
            status: 'error',
            message: 'Semua field wajib diisi'
        });
    }

    try {
        const existingUser = await user.findOne({ where: { username } });
        if (existingUser) {
            return res.status(409).json({
                status: 'error',
                message: 'Username sudah digunakan'
            });
        }

        const newUser = await user.create({
            name,
            username,
            password: md5(password),
            role
        });

        return res.status(201).json({
            status: 'success',
            message: 'Pengguna berhasil ditambahkan',
            data: {
                id: newUser.userID,
                name: newUser.name,
                username: newUser.username,
                role: newUser.role
            }
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: 'error',
            message: 'Terjadi kesalahan server'
        });
    }
};

// PUT update user
exports.put = async (req, res) => {
    const { id } = req.params;
    const { name, username, password, role } = req.body;

    try {
        const foundUser = await user.findByPk(id);
        if (!foundUser) {
            return res.status(404).json({
                status: 'error',
                message: 'User tidak ditemukan'
            });
        }

        // update fields jika ada
        if (name) foundUser.name = name;
        if (username) foundUser.username = username;
        if (password) foundUser.password = md5(password);
        if (role) foundUser.role = role;

        await foundUser.save();

        return res.json({
            status: 'success',
            message: 'Pengguna berhasil diubah',
            data: {
                id: foundUser.userID,
                name: foundUser.name,
                username: foundUser.username,
                role: foundUser.role
            }
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: 'error',
            message: 'Terjadi kesalahan server'
        });
    }
};

// DELETE user
exports.delete = async (req, res) => {
    const { id } = req.params;

    try {
        const foundUser = await user.findByPk(id);
        if (!foundUser) {
            return res.status(404).json({
                status: 'error',
                message: 'User tidak ditemukan'
            });
        }

        await foundUser.destroy();

        return res.json({
            status: 'success',
            message: 'User berhasil dihapus'
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: 'error',
            message: 'Terjadi kesalahan server'
        });
    }
};
