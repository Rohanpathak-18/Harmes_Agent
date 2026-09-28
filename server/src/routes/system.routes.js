const express = require("express");
const { jobQueue } = require("../queues/job.queue");

const router = express.Router();

router.get("/queue", async (req, res, next) => {
    try {
        const counts = await jobQueue.getJobCounts(
            "waiting",
            "active",
            "completed",
            "failed",
            "delayed"
        );

        res.json({
            success: true,
            queue: "hermes-jobs",
            counts,
        });
    } catch (error) {
        next(error);
    }
});

module.exports = router;