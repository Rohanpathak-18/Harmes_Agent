const getRedisConnection = () => {
    const configuredHost = (process.env.REDIS_HOST || "127.0.0.1").trim();
    const configuredUrl = (process.env.REDIS_URL ||
        (/^rediss?:\/\//i.test(configuredHost) ? configuredHost : "")).trim();

    if (!configuredUrl) {
        const port = Number(process.env.REDIS_PORT || 6379);
        if (!Number.isInteger(port) || port < 1 || port > 65535) {
            throw new Error("REDIS_PORT must be a valid port number");
        }
        return {
            host: configuredHost,
            port,
            maxRetriesPerRequest: null,
        };
    }

    let url;
    try {
        url = new URL(configuredUrl);
    } catch {
        throw new Error("REDIS_URL must be a valid redis:// or rediss:// URL");
    }

    if (!["redis:", "rediss:"].includes(url.protocol) || !url.hostname) {
        throw new Error("REDIS_URL must use redis:// or rediss:// and include a hostname");
    }
    if (!process.env.RENDER_SERVICE_ID && /^red-[a-z0-9]+$/i.test(url.hostname)) {
        console.warn("REDIS_URL uses a Render internal hostname, which is only reachable from Render. Use the external Redis URL for local development.");
    }

    const connection = {
        host: url.hostname,
        port: Number(url.port || 6379),
        maxRetriesPerRequest: null,
    };
    if (!Number.isInteger(connection.port) || connection.port < 1 || connection.port > 65535) {
        throw new Error("REDIS_URL contains an invalid port");
    }

    if (url.username) connection.username = decodeURIComponent(url.username);
    if (url.password) connection.password = decodeURIComponent(url.password);
    if (url.pathname.length > 1) {
        const database = Number(url.pathname.slice(1));
        if (!Number.isInteger(database) || database < 0) {
            throw new Error("REDIS_URL contains an invalid database number");
        }
        connection.db = database;
    }
    if (url.protocol === "rediss:") connection.tls = {};

    return connection;
};

module.exports = { getRedisConnection };
