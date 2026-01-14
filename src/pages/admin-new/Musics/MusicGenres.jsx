import React from 'react';
import { Music } from 'lucide-react';
import AttributeManagement from '../../admin/AttributeManagement';

const MusicGenres = () => {
    return (
        <AttributeManagement
            title="Music Genres"
            icon={Music}
            apiEndpoint="/api/music-genres"
            attributeName="Genre"
        />
    );
};

export default MusicGenres;
