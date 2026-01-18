import React, { useState } from 'react';
import { Eye, Share2, Bookmark, Heart } from 'lucide-react';

const EngagementBar = ({
    views = 0,
    shares = 0,
    bookmarks = 0,
    isBookmarked = false,
    onBookmark,
    onShare,
    showStats = true,
    className = ""
}) => {
    const [localBookmarked, setLocalBookmarked] = useState(isBookmarked);

    const handleBookmark = () => {
        setLocalBookmarked(!localBookmarked);
        if (onBookmark) onBookmark();
    };

    return (
        <div className={`flex items-center justify-between py-4 border-y border-gray-100 my-6 ${className}`}>
            {showStats && (
                <div className="flex items-center gap-6 text-gray-500">
                    <div className="flex items-center gap-2">
                        <Eye size={18} className="text-gray-400" />
                        <span className="text-sm font-medium">{views.toLocaleString()} <span className="hidden sm:inline">views</span></span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Share2 size={18} className="text-gray-400" />
                        <span className="text-sm font-medium">{shares.toLocaleString()} <span className="hidden sm:inline">shares</span></span>
                    </div>
                </div>
            )}

            <div className="flex items-center gap-3 ml-auto">
                <button
                    onClick={handleBookmark}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all border ${localBookmarked
                            ? 'bg-red-50 border-red-100 text-red-600'
                            : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50 shadow-sm'
                        }`}
                >
                    <Bookmark size={18} fill={localBookmarked ? "currentColor" : "none"} />
                    <span className="text-sm font-semibold">{localBookmarked ? 'Bookmarked' : 'Bookmark'}</span>
                </button>

                <button
                    onClick={onShare}
                    className="flex items-center gap-2 px-4 py-2 bg-[#0c2d50] text-white rounded-full hover:bg-[#0a2644] transition-all shadow-md shadow-blue-900/10"
                >
                    <Share2 size={18} />
                    <span className="text-sm font-semibold">Share</span>
                </button>
            </div>
        </div>
    );
};

export default EngagementBar;
