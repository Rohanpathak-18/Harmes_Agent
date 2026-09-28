const express = require("express");

const {
    requireAuth,
} = require("../middleware/auth.middleware");

const {
    generate,
    get,
} = require("../controllers/learning.controller");

const router = express.Router();

router.use(requireAuth);

router.post(
    "/jobs/:id/generate",
    generate
);

router.get(
    "/jobs/:id",
    get
);

module.exports = router;