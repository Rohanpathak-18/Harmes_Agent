const axios = require("axios");

const search = async ({ query, maxResults = 5 }) => {
    const response = await axios.post(
        "https://api.tavily.com/search",
        {
            api_key: process.env.TAVILY_API_KEY,
            query,
            search_depth: "basic",
            max_results: maxResults,
            include_answer: false,
        }
    );

    return response.data;
};

module.exports = {
    search,
};