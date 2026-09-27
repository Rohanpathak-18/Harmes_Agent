const lancedb = require("@lancedb/lancedb");

const DB_PATH = "./memory/vectorstore/data";

let database = null;

const getDatabase = async () => {
    if (!database) {
        database = await lancedb.connect(DB_PATH);
    }

    return database;
};

const getResearchTable = async () => {
    const db = await getDatabase();

    const tables = await db.tableNames();

    if (!tables.includes("research_memory")) {
        throw new Error(
            "Research memory table does not exist"
        );
    }

    return await db.openTable("research_memory");
};

const searchResearchVectors = async (
    vector,
    limit = 5
) => {
    const table = await getResearchTable();

    const results = await table
        .vectorSearch(vector)
        .limit(limit)
        .toArray();

    return results;
};

module.exports = {
    getDatabase,
    getResearchTable,
    searchResearchVectors,
};