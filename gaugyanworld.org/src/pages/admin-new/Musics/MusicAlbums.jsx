import React from 'react';
import { Music } from 'lucide-react';
import AttributeManagement from '../../admin/AttributeManagement';

const MusicAlbums = () => {
    return (
        <AttributeManagement
            title="Music Albums"
            icon={Music}
            apiEndpoint="/api/music-albums"
            attributeName="Album"
        />
    );
};

export default MusicAlbums;
