const chunkText = (
    text,
    chunkSize = 1000,
    overlap = 200
) => {
    if (!text || !text.trim()) {
        return [];
    }

    const normalizedText = text
        .replace(/\s+/g, " ")
        .trim();

    const chunks = [];

    let start = 0;

    while (start < normalizedText.length) {
        const end = Math.min(
            start + chunkSize,
            normalizedText.length
        );

        const chunk = normalizedText
            .slice(start, end)
            .trim();

        if (chunk) {
            chunks.push(chunk);
        }

        if (end === normalizedText.length) {
            break;
        }

        start = end - overlap;
    }

    return chunks;
};

module.exports = {
    chunkText,
};