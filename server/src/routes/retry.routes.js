const express = require("express");
const { requireAuth } = require("../middleware/auth.middleware");
const { requireOrganization } = require("../middleware/organization.middleware");
const { retry } = require("../controllers/retry.controller");

const router = express.Router();

router.use(requireAuth);
router.use(requireOrganization);

router.post("/jobs/:id/retry", retry);

module.exports = router;
