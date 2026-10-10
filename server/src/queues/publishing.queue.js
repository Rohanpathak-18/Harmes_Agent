const { Queue } = require("bullmq");
const { getRedisConnection } = require("../config/redis");

const publishingQueue = new Queue(
    "hermes-publishing",
    {
        connection: getRedisConnection(),
    }
);

module.exports = {
    publishingQueue,
};
