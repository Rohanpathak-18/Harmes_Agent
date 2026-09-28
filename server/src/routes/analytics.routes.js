const express = require("express");

const { requireAuth } = require("../middleware/auth.middleware");

const { create, get } = require("../controllers/analytics.controller");

const router = express.Router();

router.use(requireAuth);

router.post("/jobs/:id", create);

router.get("/jobs/:id", get);

module.exports = router;
