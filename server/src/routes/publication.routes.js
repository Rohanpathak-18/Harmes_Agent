const express = require("express");

const {
    requireAuth,
} = require("../middleware/auth.middleware");

const {
    queue,
    get,
} = require("../controllers/publication.controller");

const router = express.Router();

router.use(requireAuth);

router.post(
    "/jobs/:id/queue",
    queue
);

router.get(
    "/jobs/:id",
    get
);

module.exports = router;