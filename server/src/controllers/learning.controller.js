const Job = require("../models/Job");

const {
  generateLearning,
  getJobLearning,
} = require("../services/Learning.service");

const generate = async (req, res, next) => {
  try {
    const job = await Job.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    const learning = await generateLearning(job._id);

    res.status(201).json({
      success: true,
      learning,
    });
  } catch (error) {
    next(error);
  }
};

const get = async (req, res, next) => {
  try {
    const job = await Job.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    const learning = await getJobLearning(job._id);

    res.json({
      success: true,
      learning,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  generate,
  get,
};
