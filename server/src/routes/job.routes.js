const express = require("express");

const {
    create,
    getOne,
    getAll,
} = require("../controllers/job.controller");

const { requireAuth } = require("../middleware/auth.middleware");
const {
    requireOrganization,
} = require("../middleware/organization.middleware");

const router = express.Router();

router.use(requireAuth);
router.use(requireOrganization);

router.post("/", create);
router.get("/", getAll);
router.get("/:id", getOne);

module.exports = router;