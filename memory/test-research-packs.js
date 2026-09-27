const path = require("path");
const mongoose = require("../server/node_modules/mongoose");

require("dotenv").config({
    path: path.resolve(__dirname, "../server/.env"),
});

const ResearchPack = require("../server/src/models/ResearchPack");

const run = async () => {
    try {
        await mongoose.connect(
            process.env.MONGO_URI
        );

        console.log("MongoDB connected\n");

        const packs =
            await ResearchPack.find()
                .sort({ createdAt: -1 })
                .lean();

        console.log(
            "Research Packs found:",
            packs.length
        );

        packs.forEach((pack, index) => {
            console.log(
                `\n--- Research Pack ${index + 1} ---`
            );

            console.log(
                "ID:",
                pack._id.toString()
            );

            console.log(
                "Job:",
                pack.job
            );

            console.log(
                "Objective:",
                pack.objective
            );

            console.log(
                "Sources:",
                pack.sources?.length || 0
            );

            console.log(
                "Created:",
                pack.createdAt
            );
        });
    } catch (error) {
        console.error(
            "Failed:",
            error.message
        );
    } finally {
        await mongoose.disconnect();
    }
};

run();