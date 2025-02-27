const asyncHandler = require('express-async-handler');
const Lab = require('../models/labModel');
const User = require('../models/userModel');

// @desc    Create a new lab
// @route   POST /api/super-admin/labs
// @access  Private/SuperAdmin
const createLab = asyncHandler(async (req, res) => {
    const { name, address, contact, email, subscription } = req.body;

    // Check if lab with email already exists
    const labExists = await Lab.findOne({ email });
    if (labExists) {
        res.status(400);
        throw new Error('Lab with this email already exists');
    }

    // Create lab
    const lab = await Lab.create({
        name,
        address,
        contact,
        email,
        subscription: subscription || 'basic'
    });

    if (lab) {
        res.status(201).json({
            _id: lab._id,
            name: lab.name,
            email: lab.email,
            status: lab.status,
            subscription: lab.subscription
        });
    } else {
        res.status(400);
        throw new Error('Invalid lab data');
    }
});

// @desc    Get all labs
// @route   GET /api/super-admin/labs
// @access  Private/SuperAdmin
const getAllLabs = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skipIndex = (page - 1) * limit;

    const query = {};
    
    // Filter by status if provided
    if (req.query.status) {
        query.status = req.query.status;
    }

    // Filter by subscription if provided
    if (req.query.subscription) {
        query.subscription = req.query.subscription;
    }

    const total = await Lab.countDocuments(query);
    
    const labs = await Lab.find(query)
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip(skipIndex)
        .select('-__v');

    // Get stats for each lab
    const labsWithStats = await Promise.all(labs.map(async (lab) => {
        const usersCount = await User.countDocuments({ lab: lab._id });
        const adminsCount = await User.countDocuments({ 
            lab: lab._id,
            role: 'admin'
        });
        const techniciansCount = await User.countDocuments({ 
            lab: lab._id,
            role: 'technician'
        });

        return {
            ...lab.toObject(),
            stats: {
                totalUsers: usersCount,
                admins: adminsCount,
                technicians: techniciansCount
            }
        };
    }));

    res.json({
        labs: labsWithStats,
        page,
        totalPages: Math.ceil(total / limit),
        total
    });
});

// @desc    Get single lab
// @route   GET /api/super-admin/labs/:id
// @access  Private/SuperAdmin
const getLab = asyncHandler(async (req, res) => {
    const lab = await Lab.findById(req.params.id).select('-__v');

    if (!lab) {
        res.status(404);
        throw new Error('Lab not found');
    }

    // Get lab statistics
    const stats = {
        users: await User.countDocuments({ lab: lab._id }),
        admins: await User.countDocuments({ lab: lab._id, role: 'admin' }),
        technicians: await User.countDocuments({ lab: lab._id, role: 'technician' })
    };

    res.json({
        ...lab.toObject(),
        stats
    });
});

// @desc    Update lab
// @route   PUT /api/super-admin/labs/:id
// @access  Private/SuperAdmin
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
    ).select('-__v');

    res.json(updatedLab);
});

// @desc    Delete lab
// @route   DELETE /api/super-admin/labs/:id
// @access  Private/SuperAdmin
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
        throw new Error('Cannot delete lab with existing users');
    }

    await lab.remove();

    res.json({ message: 'Lab removed' });
});

// @desc    Update lab status
// @route   PATCH /api/super-admin/labs/:id/status
// @access  Private/SuperAdmin
const updateLabStatus = asyncHandler(async (req, res) => {
    const { status } = req.body;

    const lab = await Lab.findById(req.params.id);

    if (!lab) {
        res.status(404);
        throw new Error('Lab not found');
    }

    lab.status = status;
    await lab.save();

    res.json({
        _id: lab._id,
        name: lab.name,
        status: lab.status
    });
});

module.exports = {
    createLab,
    getAllLabs,
    getLab,
    updateLab,
    deleteLab,
    updateLabStatus
};
