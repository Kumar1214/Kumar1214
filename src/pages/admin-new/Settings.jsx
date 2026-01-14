import React, { useState } from 'react';
import { Globe, Mail, CreditCard, Share2, Shield, Truck } from 'lucide-react';
import SettingsGeneral from './Settings/SettingsGeneral';
import SettingsEmail from './Settings/SettingsEmail';
import ShippingSettings from './Settings/ShippingSettings';
import SettingsPayment from './Settings/SettingsPayment';
import SettingsIntegrations from './Settings/SettingsIntegrations';
import SettingsSocial from './Settings/SettingsAds'; // Assuming Social/Ads mapped similar or check file content. Let's stick to confirmed mapping or simple placeholder for now if unsure.
// Actually, let's map what we know.

const Settings = () => {
  const [activeTab, setActiveTab] = useState('general');

  const tabs = [
    { id: 'general', label: 'General', icon: <Globe size={18} /> },
    { id: 'email', label: 'Email Configuration', icon: <Mail size={18} /> },
    { id: 'shipping', label: 'Shipping', icon: <Truck size={18} /> },
    { id: 'payment', label: 'Payment Gateways', icon: <CreditCard size={18} /> },
    { id: 'integrations', label: 'Integrations', icon: <Shield size={18} /> },
    // { id: 'social', label: 'Social Media', icon: <Share2 size={18} /> },
    // { id: 'api', label: 'API Keys', icon: <Shield size={18} /> }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'general':
        return <SettingsGeneral />;
      case 'email':
        return <SettingsEmail />;
      case 'shipping':
        return <ShippingSettings />;
      case 'payment':
        return <SettingsPayment />;
      case 'integrations':
        return <SettingsIntegrations />;
      default:
        return <div className="p-6">Select a tab</div>;
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-2">Manage your platform configuration and preferences</p>
      </header>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Navigation */}
        <div className="w-full lg:w-64 flex-shrink-0">
          <nav className="flex flex-col space-y-1">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${activeTab === tab.id
                  ? 'bg-orange-50 text-orange-600'
                  : 'text-gray-600 hover:bg-gray-50'
                  }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden min-h-[500px]">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default Settings;
