import React from 'react';
import { Brain } from 'lucide-react';
import AttributeManagement from '../../admin/AttributeManagement';

const MeditationCategoriesManagement = () => {
    return (
        <AttributeManagement
            title="Meditation Categories"
            icon={Brain}
            apiEndpoint="/api/meditation-categories"
            attributeName="Category"
        />
    );
};

export default MeditationCategoriesManagement;
