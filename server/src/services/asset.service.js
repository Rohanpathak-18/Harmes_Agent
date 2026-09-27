const Asset = require("../models/Asset");

const createAsset = async ({
    jobId,
    type,
    name,
    provider,
    metadata = {},
}) => {
    return await Asset.create({
        job: jobId,
        type,
        name,
        provider,
        metadata,
        status: "requested",
    });
};

const updateAsset = async (
    assetId,
    data
) => {
    return await Asset.findByIdAndUpdate(
        assetId,
        data,
        {
            returnDocument: "after",
        }
    );
};

const getJobAssets = async (jobId) => {
    return await Asset.find({
        job: jobId,
    }).sort({
        createdAt: 1,
    });
};

module.exports = {
    createAsset,
    updateAsset,
    getJobAssets,
};