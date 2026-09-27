const express = require("express");

const {
    transition,
} = require("../controllers/workflow.controller");

const { requireAuth } = require("../middleware/auth.middleware");
const {
    requireOrganization,
} = require("../middleware/organization.middleware");

const router = express.Router();

router.use(requireAuth);
router.use(requireOrganization);

router.patch("/jobs/:id/state", transition);

module.exports = router;