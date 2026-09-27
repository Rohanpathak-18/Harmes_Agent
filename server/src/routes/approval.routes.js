const express = require("express");

const {
    requireAuth,
} = require("../middleware/auth.middleware");

const {
    create,
    approve,
    reject,
    get,
} = require("../controllers/approval.controller");

const router = express.Router();

router.use(requireAuth);

router.post(
    "/jobs/:id",
    create
);

router.get(
    "/jobs/:id",
    get
);

router.post(
    "/jobs/:id/approve",
    approve
);

router.post(
    "/jobs/:id/reject",
    reject
);

module.exports = router;