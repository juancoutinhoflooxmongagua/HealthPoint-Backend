const express = require('express');
const router = express.Router();
const jobController = require('../controllers/JobController');

router.post('/jobs', jobController.create);
router.get('/jobs', jobController.list);
router.delete('/jobs/:id', jobController.remove);
router.put('/jobs/:id', jobController.update);
router.put('/applications/:applicationId/finish', jobController.finishApplication);

module.exports = router;
