const express = require('express');
const router = express.Router();
const {
    getLabs,
    createLab,
    updateLab,
    deleteLab,
    getUsers,
    createUser,
    updateUser,
    deleteUser
} = require('../controllers/superAdminController');
const {
    protect,
    checkRole
} = require('../middleware/authMiddleware');

// Protect all routes and require super_admin role
router.use(protect);
router.use(checkRole('super_admin'));

// Lab routes
router.route('/labs')
    .get(getLabs)
    .post(createLab);

router.route('/labs/:id')
    .put(updateLab)
    .delete(deleteLab);

// User routes
router.route('/users')
    .get(getUsers)
    .post(createUser);

router.route('/users/:id')
    .put(updateUser)
    .delete(deleteUser);

module.exports = router;
