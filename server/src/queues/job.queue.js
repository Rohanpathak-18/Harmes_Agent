const { Queue } = require("bullmq");
const { getRedisConnection } = require("../config/redis");

const jobQueue = new Queue("hermes-jobs", {
    connection: getRedisConnection(),
});

module.exports = {
    jobQueue,
};
