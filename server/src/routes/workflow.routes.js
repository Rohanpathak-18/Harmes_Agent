const express = require("express");

const {
    requireAuth,
} = require("../middleware/auth.middleware");

const {
    requireOrganization,
} = require("../middleware/organization.middleware");

const {
    runWorkflow,
} = require("../controllers/workflow.controller");

const router = express.Router();

router.post(
    "/jobs/:id/run",
    requireAuth,
    requireOrganization,
    runWorkflow
);

module.exports = router;