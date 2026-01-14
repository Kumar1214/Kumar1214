export default function SettingsSecurity() {
  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h1 className="text-2xl font-semibold mb-2">Security Settings</h1>
      <p className="text-gray-600 mb-6">
        Configure admin login, 2FA, password rules.
      </p>

      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <input type="checkbox" id="twoFactor" />
          <label htmlFor="twoFactor" className="text-sm">
            Enable Two-Factor Authentication
          </label>
        </div>

        <div>
          <label className="font-medium text-sm">Password Minimum Length</label>
          <input
            type="number"
            className="border w-full px-3 py-2 rounded mt-1"
            placeholder="8"
          />
        </div>

        <div className="flex items-center gap-3">
          <input type="checkbox" id="loginAlerts" />
          <label htmlFor="loginAlerts" className="text-sm">
            Send login alerts to admin email
          </label>
        </div>
      </div>

      <button className="mt-6 px-6 py-2 bg-[#0c2d50] text-white rounded">
        Save Security Settings
      </button>
    </div>
  );
}
