import React from 'react';
import { Mic } from 'lucide-react';
import AttributeManagement from '../../admin/AttributeManagement';

const PodcastSeriesManagement = () => {
    return (
        <AttributeManagement
            title="Podcast Series"
            icon={Mic}
            apiEndpoint="/api/podcast-series"
            attributeName="Series"
        />
    );
};

export default PodcastSeriesManagement;
