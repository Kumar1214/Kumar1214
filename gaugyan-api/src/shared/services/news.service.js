const axios = require('axios');
const Settings = require('../../modules/core/Settings');

/**
 * Fetch external news from NewsAPI.
 * @param {Object} params - Query parameters (category, q, pageSize, etc.)
 */
const fetchExternalNews = async (params = {}) => {
    try {
        // 1. Get API Key (Prefer DB, fallback to provided key if missing or old)
        const integrationSettings = await Settings.findOne({ where: { category: 'integrations' } });
        let apiKey = 'aa44cbcc-deae-42af-8005-6ba1b0cbe558'; // New Default Key

        if (integrationSettings && integrationSettings.settings && integrationSettings.settings.newsApiKey) {
            // If the DB has the NEW key (or a different one set by user), use it.
            // If it has the OLD key or empty, we use the hardcoded new one.
            // For simplicity/robustness, if DB has a key and it looks valid, use it, 
            // but given the specific migration request, we'll force the new key if the DB has the old known one.
            const dbKey = integrationSettings.settings.newsApiKey;
            if (dbKey !== '3d7c01497a66459cafeecc11986c275c') {
                apiKey = dbKey;
            }
        }

        const baseUrl = 'http://eventregistry.org/api/v1/article/getArticles';

        // 2. Prepare Params for Event Registry
        // NewsAPI: category, q, pageSize, country
        // EventRegistry: keyword, categoryUri, articlesCount, locationUri

        const erParams = {
            apiKey: apiKey,
            resultType: 'articles',
            articlesSortBy: 'date',
            articlesCount: params.pageSize || 10,
            articlesPage: params.page || 1, // Add pagination support
            lang: 'eng',
            'locationUri': 'http://en.wikipedia.org/wiki/India', // Default context
        };

        if (params.q) {
            erParams.keyword = params.q;
        }

        // Note: Category mapping is complex due to ER using URIs. 
        // We will omit category for now unless strictly needed, or simplistic mapping.
        // For 'general', we just don't filter.

        // 3. Fetch News
        const response = await axios.get(baseUrl, { params: erParams });

        // 4. Map Response to NewsAPI Format
        // ER: { articles: { results: [...] } }
        // NewsAPI: { articles: [...] }
        const erArticles = response.data.articles?.results || [];
        const totalResults = response.data.articles?.totalResults || 0;

        const mappedArticles = erArticles.map(article => ({
            source: { name: article.source?.title || 'Unknown' },
            author: article.authors?.[0]?.name || article.source?.title,
            title: article.title,
            description: article.body ? (article.body.substring(0, 150) + '...') : '',
            url: article.url,
            urlToImage: article.image || null,
            publishedAt: article.dateTime || article.date,
            content: article.body
        }));

        return {
            status: 'ok',
            totalResults: totalResults,
            articles: mappedArticles
        };

    } catch (error) {
        console.error('Error fetching external news (Event Registry):', error.message);
        // Log response data if available for debugging
        if (error.response) console.error(error.response.data);
        // Return empty structure on error so frontend doesn't crash
        return { status: 'error', articles: [] };
    }
};

module.exports = {
    fetchExternalNews
};
