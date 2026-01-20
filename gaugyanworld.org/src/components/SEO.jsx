import React from 'react';

const SEO = ({ title, description, keywords, image, url, type = 'website' }) => {
    const siteTitle = 'Gaugyan - Ancient Wisdom for Modern Living';
    const finalTitle = title ? `${title} | ${siteTitle}` : siteTitle;
    const finalDesc = description || 'Discover ancient wisdom, courses, music, and authentic products at Gaugyan World.';
    const finalImage = image ? (image.startsWith('http') ? image : `https://gaugyanworld.org${image}`) : 'https://gaugyanworld.org/gaugyan-logo.png';
    const finalUrl = url ? (url.startsWith('http') ? url : `https://gaugyanworld.org${url}`) : 'https://gaugyanworld.org';

    return (
        <>
            {/* Standard metadata tags */}
            <title>{finalTitle}</title>
            <meta name='description' content={finalDesc} />
            {keywords && <meta name='keywords' content={keywords} />}

            {/* Facebook tags */}
            <meta property="og:type" content={type} />
            <meta property="og:title" content={finalTitle} />
            <meta property="og:description" content={finalDesc} />
            <meta property="og:image" content={finalImage} />
            <meta property="og:url" content={finalUrl} />

            {/* Twitter tags */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={finalTitle} />
            <meta name="twitter:description" content={finalDesc} />
            <meta name="twitter:image" content={finalImage} />
        </>
    );
};

export default SEO;
