import React from 'react';
import { Mic } from 'lucide-react';
import AttributeManagement from '../../admin/AttributeManagement';

const PodcastCategoriesManagement = () => {
    return (
        <AttributeManagement
            title="Podcast Categories"
            icon={Mic}
            apiEndpoint="/api/podcast-categories"
            attributeName="Category"
        />
    );
};

export default PodcastCategoriesManagement;
