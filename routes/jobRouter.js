const express = require('express');
const { verifyToken } = require('../middlewares/auth');
const router = express.Router();
const JobController = require('../controller/JobController');

router.post('/create', verifyToken, JobController.create);
router.get('/', JobController.list);
router.get('/with-applications', verifyToken, JobController.listWithApplications);
router.delete('/:id', verifyToken, JobController.remove);
router.put('/:id', verifyToken, JobController.update);
router.put('/applications/:applicationId/finish', JobController.finishApplication);

module.exports = router;
