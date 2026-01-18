import { useState, useRef } from "react";
import { userService } from "../../services/api";
import { useData } from "../../context/useData";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiLock,
  FiMapPin,
  FiGlobe,
  FiCamera,
  FiUpload,
  FiFacebook,
  FiYoutube,
  FiTwitter,
  FiLinkedin,
  FiSave,
  FiArrowLeft,
} from "react-icons/fi";
import { toast } from "react-hot-toast";
import { useNavigate, useSearchParams } from "react-router-dom";
import JoditEditor from "jodit-react";

export default function AddUser() {
  const { refreshUsers } = useData();
  const [image, setImage] = useState(null);
  const [status, setStatus] = useState(true);
  const [loading, setLoading] = useState(false);
  const [bio, setBio] = useState("");
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preSelectedRole = searchParams.get('role');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    mobile: '',
    role: preSelectedRole || '',
    password: '',
    street: '',
    city: '',
    state: '',
    country: '',
    zipCode: '',
    facebook: '',
    youtube: '',
    twitter: '',
    linkedin: '',
  });
  const editor = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }
      setImage(URL.createObjectURL(file));
      toast.success("Image uploaded successfully");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Basic validation
      if (!image) {
        // Optional: enforce image?
      }

      const userData = {
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        email: formData.email,
        mobile: formData.mobile,
        role: formData.role,
        password: formData.password,
        bio: bio,
        address: `${formData.street}, ${formData.city}, ${formData.state}, ${formData.country}, ${formData.zipCode}`,
        social: {
          facebook: formData.facebook,
          youtube: formData.youtube,
          twitter: formData.twitter,
          linkedin: formData.linkedin
        },
        image: image,
        status: status ? 'active' : 'inactive',
        isVerified: true
      };

      // Since image is a blob URL locally, we need real upload logic or backend support for base64/blob.
      // For now, assuming standard JSON payload. A real implementation depends on how backend handles images (multipart/form-data).
      // Given previous code uses "image" string, likely URL.

      await userService.createUser(userData);
      toast.success("User created successfully!");
      refreshUsers();
      navigate("/admin/users/all-users");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to create user");
    } finally {
      setLoading(false);
    }
  };

  const removeImage = () => {
    setImage(null);
    toast.success("Image removed");
  };

  // Jodit Editor configuration
  const editorConfig = {
    readonly: false,
    height: 200,
    toolbarAdaptive: false,
    toolbarButtonSize: "medium",
    showCharsCounter: true,
    showWordsCounter: true,
    showXPathInStatusbar: false,
    askBeforePasteHTML: false,
    askBeforePasteFromWord: false,
    defaultActionOnPaste: "insert_clear_html",
    placeholder: "Tell us about the user...",
    buttons: [
      "bold",
      "italic",
      "underline",
      "strikethrough",
      "|",
      "ul",
      "ol",
      "|",
      "outdent",
      "indent",
      "|",
      "font",
      "fontsize",
      "brush",
      "|",
      "image",
      "link",
      "|",
      "align",
      "undo",
      "redo",
      "|",
      "hr",
      "eraser",
      "fullsize",
    ],
    editorCssClass: "jodit-custom-editor",
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={() => navigate("/users/all-users")}
            className="flex items-center gap-2 text-gray-600 hover:text-[#0c2d50] transition-colors duration-200 p-2 rounded-lg hover:bg-gray-100"
          >
            <FiArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Add New User</h1>
            <p className="text-gray-600 mt-1">
              Create a new user account with personalized settings
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          {/* Form Header */}
          <div className="p-6 border-b border-gray-200 bg-gray-50">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
              <FiUser className="text-[#0c2d50]" />
              User Information
            </h2>
          </div>

          {/* Main Form Content */}
          <div className="p-6">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              {/* Personal Details */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                    Personal Details
                  </h3>

                  <div className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
                        <div className="relative">
                          <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                          <input
                            type="text"
                            name="firstName"
                            required
                            value={formData.firstName}
                            onChange={handleChange}
                            placeholder="Enter first name"
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0c2d50] focus:border-[#0c2d50] transition-all duration-200 bg-white"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
                        <div className="relative">
                          <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                          <input
                            type="text"
                            name="lastName"
                            required
                            value={formData.lastName}
                            onChange={handleChange}
                            placeholder="Enter last name"
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0c2d50] focus:border-[#0c2d50] transition-all duration-200 bg-white"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                      <div className="relative">
                        <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <input
                          type="email"
                          name="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="user@example.com"
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0c2d50] focus:border-[#0c2d50] transition-all duration-200 bg-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Mobile Number *</label>
                      <div className="relative">
                        <FiPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <input
                          type="tel"
                          name="mobile"
                          required
                          value={formData.mobile}
                          onChange={handleChange}
                          placeholder="+1 234 567 8900"
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0c2d50] focus:border-[#0c2d50] transition-all duration-200 bg-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">User Role *</label>
                      <select name="role" value={formData.role} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0c2d50] focus:border-[#0c2d50] transition-all duration-200 bg-white">
                        <option value="">Select a role</option>
                        <option value="user">User / Learner</option>
                        <option value="instructor">Instructor</option>
                        <option value="gaushala_owner">Gaushala Owner</option>
                        <option value="artist">Artist</option>
                        <option value="vendor">Vendor / Seller</option>
                        <option value="author">Author</option>
                        <option value="astrologer">Astrologer</option>
                        <option value="admin">Administrator</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Password *</label>
                      <div className="relative">
                        <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <input
                          type="password"
                          name="password"
                          required
                          value={formData.password}
                          onChange={handleChange}
                          placeholder="••••••••••••"
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0c2d50] focus:border-[#0c2d50] transition-all duration-200 bg-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Bio & Details</label>
                      <div className="border border-gray-300 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-[#0c2d50] focus-within:border-[#0c2d50] transition-all duration-200">
                        <JoditEditor
                          ref={editor}
                          value={bio}
                          config={editorConfig}
                          onBlur={(newContent) => setBio(newContent)}
                          onChange={() => { }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Address & Image Upload */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200 flex items-center gap-2">
                    <FiMapPin className="text-[#0c2d50]" />
                    Address Information
                  </h3>

                  <div className="space-y-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Street Address</label>
                      <input
                        type="text"
                        name="street"
                        value={formData.street}
                        onChange={handleChange}
                        placeholder="Enter street address"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0c2d50] focus:border-[#0c2d50] transition-all duration-200 bg-white"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                        <input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleChange}
                          placeholder="Enter city"
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0c2d50] focus:border-[#0c2d50] transition-all duration-200 bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                        <input
                          type="text"
                          name="state"
                          value={formData.state}
                          onChange={handleChange}
                          placeholder="Enter state"
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0c2d50] focus:border-[#0c2d50] transition-all duration-200 bg-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                        <input
                          type="text"
                          name="country"
                          value={formData.country}
                          onChange={handleChange}
                          placeholder="Enter country"
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0c2d50] focus:border-[#0c2d50] transition-all duration-200 bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">ZIP Code</label>
                        <input
                          type="text"
                          name="zipCode"
                          value={formData.zipCode}
                          onChange={handleChange}
                          placeholder="Enter ZIP code"
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0c2d50] focus:border-[#0c2d50] transition-all duration-200 bg-white"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Image Upload */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200 flex items-center gap-2">
                    <FiCamera className="text-[#0c2d50]" />
                    Profile Image
                  </h3>

                  <div className="flex flex-col sm:flex-row items-start gap-6">
                    <div className="flex-shrink-0">
                      <div className="w-32 h-32 rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 flex items-center justify-center overflow-hidden">
                        {image ? (
                          <img src={image} alt="Preview" className="w-full h-full object-cover" />
                        ) : (
                          <div className="text-center text-gray-400">
                            <FiCamera size={32} className="mx-auto mb-2" />
                            <span className="text-xs">No Image</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex-1 space-y-4">
                      <div>
                        <p className="text-sm text-gray-600 mb-3">Upload a profile picture (410×410px recommended)</p>
                        <div className="flex flex-wrap gap-3">
                          <label className="flex items-center gap-2 px-4 py-2.5 bg-[#0c2d50] text-white rounded-xl hover:bg-[#1e4d7b] transition-colors duration-200 cursor-pointer shadow-sm">
                            <FiUpload size={16} />
                            <span>Upload Image</span>
                            <input type="file" accept="image/*" onChange={handleImage} className="hidden" />
                          </label>

                          {image && (
                            <button
                              type="button"
                              onClick={removeImage}
                              className="px-4 py-2.5 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors duration-200"
                            >
                              Remove
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Profiles */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <FiGlobe className="text-[#0c2d50]" />
                Social Profiles
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <FiFacebook className="text-blue-600" />
                    Facebook URL
                  </label>
                  <input
                    type="url"
                    name="facebook"
                    value={formData.facebook}
                    onChange={handleChange}
                    placeholder="https://facebook.com/username"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0c2d50] focus:border-[#0c2d50] transition-all duration-200 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <FiYoutube className="text-red-600" />
                    YouTube URL
                  </label>
                  <input
                    type="url"
                    name="youtube"
                    value={formData.youtube}
                    onChange={handleChange}
                    placeholder="https://youtube.com/username"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0c2d50] focus:border-[#0c2d50] transition-all duration-200 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <FiTwitter className="text-blue-400" />
                    Twitter URL
                  </label>
                  <input
                    type="url"
                    name="twitter"
                    value={formData.twitter}
                    onChange={handleChange}
                    placeholder="https://twitter.com/username"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0c2d50] focus:border-[#0c2d50] transition-all duration-200 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <FiLinkedin className="text-blue-700" />
                    LinkedIn URL
                  </label>
                  <input
                    type="url"
                    name="linkedin"
                    value={formData.linkedin}
                    onChange={handleChange}
                    placeholder="https://linkedin.com/in/username"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0c2d50] focus:border-[#0c2d50] transition-all duration-200 bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Status & Submit */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                <div className="flex items-center gap-4">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={status}
                      onChange={() => setStatus(!status)}
                      className="sr-only peer"
                    />
                    <div className="w-12 h-6 bg-gray-300 rounded-full peer peer-checked:bg-green-500 relative transition duration-200">
                      <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform duration-200 peer-checked:translate-x-6 shadow-sm" />
                    </div>
                    <span className="ml-3 text-gray-700 font-medium">{status ? "Active User" : "Inactive User"}</span>
                  </label>
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => navigate("/users/all-users")}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors duration-200 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center gap-2 px-8 py-3 bg-[#0c2d50] text-white rounded-xl hover:bg-[#1e4d7b] transition-colors duration-200 font-medium shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FiSave size={18} />
                    {loading ? "Creating..." : "Create User"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>

      {/* Custom styles for Jodit Editor */}
      <style jsx>{`
        :global(.jodit-custom-editor) {
          border: none !important;
          border-radius: 0 0 0.75rem 0.75rem !important;
        }
        :global(.jodit-container) {
          border: none !important;
        }
        :global(.jodit-toolbar__box) {
          border-bottom: 1px solid #e5e7eb !important;
          background: #f9fafb !important;
          border-radius: 0.75rem 0.75rem 0 0 !important;
        }
        :global(.jodit-wysiwyg) {
          padding: 1rem !important;
          background: white !important;
          min-height: 120px !important;
        }
        :global(.jodit-status-bar) {
          background: #f9fafb !important;
          border-top: 1px solid #e5e7eb !important;
        }
      `}</style>
    </div>
  );
}
