import React from 'react';
import {
    Facebook,
    Twitter,
    MessageCircle,
    Linkedin,
    Link as LinkIcon,
    Copy,
    Check
} from 'lucide-react';

const SocialShareButtons = ({ url, title, onShare }) => {
    const [copied, setCopied] = React.useState(false);

    const shareLinks = {
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
        twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
        whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(title + ' ' + url)}`,
        linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
    };

    const handleShare = (platform) => {
        window.open(shareLinks[platform], '_blank', 'width=600,height=400');
        if (onShare) onShare(platform);
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        if (onShare) onShare('copy_link');
    };

    return (
        <div className="flex flex-wrap gap-2 mt-4">
            <button
                onClick={() => handleShare('facebook')}
                className="p-2.5 bg-[#1877F2] text-white rounded-full hover:opacity-90 transition-opacity"
                title="Share on Facebook"
            >
                <Facebook size={18} fill="currentColor" />
            </button>

            <button
                onClick={() => handleShare('twitter')}
                className="p-2.5 bg-[#1DA1F2] text-white rounded-full hover:opacity-90 transition-opacity"
                title="Share on Twitter"
            >
                <Twitter size={18} fill="currentColor" />
            </button>

            <button
                onClick={() => handleShare('whatsapp')}
                className="p-2.5 bg-[#25D366] text-white rounded-full hover:opacity-90 transition-opacity"
                title="Share on WhatsApp"
            >
                <MessageCircle size={18} fill="currentColor" />
            </button>

            <button
                onClick={() => handleShare('linkedin')}
                className="p-2.5 bg-[#0A66C2] text-white rounded-full hover:opacity-90 transition-opacity"
                title="Share on LinkedIn"
            >
                <Linkedin size={18} fill="currentColor" />
            </button>

            <button
                onClick={copyToClipboard}
                className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all ${copied ? 'bg-green-50 border-green-200 text-green-600' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
            >
                {copied ? <Check size={16} /> : <LinkIcon size={16} />}
                <span className="text-sm font-semibold">{copied ? 'Copied!' : 'Copy Link'}</span>
            </button>
        </div>
    );
};

export default SocialShareButtons;
