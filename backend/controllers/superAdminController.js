const asyncHandler = require('express-async-handler');
const Lab = require('../models/labModel');
const User = require('../models/userModel');

// @desc    Get all labs
// @route   GET /api/labs
// @access  Private/Super Admin
const getLabs = asyncHandler(async (req, res) => {
    const labs = await Lab.find();
    res.json(labs);
});

// @desc    Create a new lab
// @route   POST /api/labs
// @access  Private/Super Admin
const createLab = asyncHandler(async (req, res) => {
    const { name, address, contact, email } = req.body;

    const lab = await Lab.create({
        name,
        address,
        contact,
        email,
        status: 'active',
        subscription: 'standard'
    });

    res.status(201).json(lab);
});

// @desc    Update a lab
// @route   PUT /api/labs/:id
// @access  Private/Super Admin
const updateLab = asyncHandler(async (req, res) => {
    const lab = await Lab.findById(req.params.id);

    if (!lab) {
        res.status(404);
        throw new Error('Lab not found');
    }

    const updatedLab = await Lab.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
    );

    res.json(updatedLab);
});

// @desc    Delete a lab
// @route   DELETE /api/labs/:id
// @access  Private/Super Admin
const deleteLab = asyncHandler(async (req, res) => {
    const lab = await Lab.findById(req.params.id);

    if (!lab) {
        res.status(404);
        throw new Error('Lab not found');
    }

    // Check if lab has any users
    const usersCount = await User.countDocuments({ lab: lab._id });
    if (usersCount > 0) {
        res.status(400);
        throw new Error('Cannot delete lab with active users');
    }

    await lab.remove();
    res.json({ message: 'Lab removed' });
});

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Super Admin
const getUsers = asyncHandler(async (req, res) => {
    const users = await User.find().populate('lab', 'name');
    res.json(users);
});

// @desc    Create a new user
// @route   POST /api/users
// @access  Private/Super Admin
const createUser = asyncHandler(async (req, res) => {
    const { name, email, password, role, lab } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
        res.status(400);
        throw new Error('User already exists');
    }

    // Check if lab exists
    if (role !== 'super_admin') {
        const labExists = await Lab.findById(lab);
        if (!labExists) {
            res.status(400);
            throw new Error('Lab not found');
        }
    }

    const user = await User.create({
        name,
        email,
        password,
        role,
        lab,
        status: 'active'
    });

    res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        lab: user.lab,
        status: user.status
    });
});

// @desc    Update a user
// @route   PUT /api/users/:id
// @access  Private/Super Admin
const updateUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    // Don't allow updating super admin role
    if (user.role === 'super_admin' && req.body.role && req.body.role !== 'super_admin') {
        res.status(400);
        throw new Error('Cannot change super admin role');
    }

    const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
    ).populate('lab', 'name');

    res.json(updatedUser);
});

// @desc    Delete a user
// @route   DELETE /api/users/:id
// @access  Private/Super Admin
const deleteUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    // Don't allow deleting super admin
    if (user.role === 'super_admin') {
        res.status(400);
        throw new Error('Cannot delete super admin user');
    }

    await user.remove();
    res.json({ message: 'User removed' });
});

module.exports = {
    getLabs,
    createLab,
    updateLab,
    deleteLab,
    getUsers,
    createUser,
    updateUser,
    deleteUser
};
