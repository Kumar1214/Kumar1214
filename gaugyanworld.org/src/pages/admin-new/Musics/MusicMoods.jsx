import React from 'react';
import { Music } from 'lucide-react';
import AttributeManagement from '../../admin/AttributeManagement';

const MusicMoods = () => {
    return (
        <AttributeManagement
            title="Music Moods"
            icon={Music}
            apiEndpoint="/api/music-moods"
            attributeName="Mood"
        />
    );
};

export default MusicMoods;
