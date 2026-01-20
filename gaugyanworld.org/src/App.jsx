
import React, { useEffect, useState } from 'react';
import { Routes, Route, useNavigate, useLocation, Navigate, useParams } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { ThemeProvider } from './context/ThemeContext';
import { PluginProvider } from './context/PluginContext';
import MainLayout from './layout/MainLayout';
import Home from './pages/Home';

import ScrollToTop from './components/ScrollToTop';
import NotificationListener from './components/NotificationListener';
import GlobalErrorBoundary from './components/GlobalErrorBoundary';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Shop from './pages/Shop';
import Courses from './pages/Courses';
import CourseDetail from './pages/CourseDetail';
import CourseLearning from './pages/CourseLearning';
import CourseCheckout from './pages/CourseCheckout';
import CourseSearch from './pages/CourseSearch';
import Entertainment from './pages/Entertainment';
import PodcastDetail from './pages/PodcastDetail';
import PodcastListing from './pages/PodcastListing';
import PodcastSearch from './pages/PodcastSearch';
import PodcastReview from './pages/PodcastReview';
import MusicPlayer from './pages/MusicPlayer';
import MusicListing from './pages/MusicListing';
import MusicSearch from './pages/MusicSearch';
import MusicSingle from './pages/MusicSingle';
import MusicReview from './pages/MusicReview';
import MeditationListing from './pages/MeditationListing';
import MeditationSearch from './pages/MeditationSearch';
import MeditationSingle from './pages/MeditationSingle';

import ExamListing from './pages/ExamListing';
import ExamSearch from './pages/ExamSearch';
import ExamSingle from './pages/ExamSingle';
import ExamCheckout from './pages/ExamCheckout';
import QuizListing from './pages/QuizListing';
import QuizSearch from './pages/QuizSearch';
import QuizSingle from './pages/QuizSingle';
import KnowledgebaseListing from './pages/KnowledgebaseListing';
import KnowledgebaseSearch from './pages/KnowledgebaseSearch';
import KnowledgebaseSingle from './pages/KnowledgebaseSingle';
import GaushalaListing from './pages/GaushalaListing';
import GaushalaSingle from './pages/GaushalaSingle';
import Community from './pages/Community';
import Chat from './pages/Chat';
import ProductDetail from './pages/ProductDetail';
import Wishlist from './pages/Wishlist';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import ThankYou from './pages/ThankYou';
import AboutUs from './pages/AboutUs';
import FAQ from './pages/FAQ';
import ContactUs from './pages/ContactUs';
import NewsListing from './pages/NewsListing';
import NewsDetail from './pages/NewsDetail';
import Advertise from './pages/Advertise';
import MyOrders from './pages/MyOrders';
import MyCourses from './pages/MyCourses';
import MyResults from './pages/MyResults';
import Panchang from './pages/Panchang';
import Astrologers from './pages/Astrologers';

import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsConditions from './pages/TermsConditions';
import ShippingPolicy from './pages/ShippingPolicy';
import Feedback from './pages/Feedback';
import ExamRunner from './pages/ExamRunner';
import QuizRunner from './pages/QuizRunner';
import UserDashboard from './pages/UserDashboard';
import Wallet from './pages/Wallet';
import UserCertificates from './pages/UserCertificates';
import UserNotifications from './pages/UserNotifications';
import InstructorDashboard from './pages/InstructorDashboard';
import ArtistDashboard from './pages/ArtistDashboard';
import AuthorDashboard from './pages/AuthorDashboard';
import GaushalaOwnerDashboard from './pages/GaushalaOwnerDashboard';
import VendorDashboard from './pages/VendorDashboard';
import AdminDashboard from './pages/AdminDashboard';
import EditorDashboard from './pages/EditorDashboard';
import CertificateVerification from './pages/CertificateVerification';
import ShopPreview from './pages/ShopPreview';
import NotFound from './pages/NotFound';

// New Admin Dashboard
import DashboardLayout from './components/admin-new/DashboardLayout';
import NewAdminDashboard from './pages/admin-new/Dashboard';
import AllProducts from './pages/admin-new/ECommerce/AllProducts';
import AllUsers from './pages/admin-new/AllUsers';
import AddUser from './pages/admin-new/AddUser';
import AllInstructors from './pages/admin-new/AllInstructors';
import AllCourses from './pages/admin-new/Education/AllCourses';
import CourseCategories from './pages/admin-new/Education/CourseCategories';
import Musics from './pages/admin-new/Musics/Musics';
import Podcasts from './pages/admin-new/Musics/Podcasts';
import Meditations from './pages/admin-new/Musics/Meditations';
import News from './pages/admin-new/Content/News';
import Knowledgebase from './pages/admin-new/Content/Knowledgebase';
import Gaushalas from './pages/admin-new/Gaushala/Gaushalas';
import VerifyUsers from './pages/admin-new/Education/VerifyUsers';
import RolesAndPermission from './pages/admin-new/Education/RolesAndPermission';
import Meetings from './pages/admin-new/Education/Meetings';
import ECommerceCategories from './pages/admin-new/ECommerce/Categories';
import ECommerceOrders from './pages/admin-new/ECommerce/Orders';
import Vendors from './pages/admin-new/ECommerce/Vendors';
import Payouts from './pages/admin-new/ECommerce/Payouts';
import Commissions from './pages/admin-new/ECommerce/Commissions';
import Refunds from './pages/admin-new/ECommerce/Refunds';
import MusicCategories from './pages/admin-new/Musics/MusicCategories';
import Exams from './pages/admin-new/Education/Exams';
import Quizzes from './pages/admin-new/Education/Quizzes';
import QuestionBank from './pages/admin-new/Education/QuestionBank';
import CommunityManager from './pages/admin-new/Community/CommunityManager';

import Banners from './pages/admin-new/Marketing/Banners';
import Approvals from './pages/admin-new/Moderation/Approvals';
import ReviewModeration from './pages/admin-new/Moderation/Reviews';
import AdManagement from './pages/admin-new/Moderation/Advertisements';
import WalletManagement from './pages/admin-new/Management/Wallet';
import CouponManagement from './pages/admin-new/Management/Coupons';
import SliderManagement from './pages/admin-new/Management/Sliders';

import SettingsGeneral from './pages/admin-new/Settings/SettingsGeneral';
import SettingsApp from './pages/admin-new/Settings/SettingsApp';
import SettingsNotifications from './pages/admin-new/Settings/SettingsNotifications';
import SettingsSecurity from './pages/admin-new/Settings/SettingsSecurity';
import SettingsProfile from './pages/admin-new/Settings/SettingsProfile';
import SettingsPayment from './pages/admin-new/Settings/SettingsPayment';
import SettingsHeaderFooter from './pages/admin-new/Settings/SettingsHeaderFooter';
import SettingsEmail from './pages/admin-new/Settings/SettingsEmail';
import EmailTemplates from './pages/admin-new/Settings/EmailTemplates';
import BulkEmail from './pages/admin-new/Communication/BulkEmail';
import ShippingSettings from './pages/admin-new/Settings/ShippingSettings';
import SettingsIntegrations from './pages/admin-new/Settings/SettingsIntegrations';
import FeedbackAdmin from './pages/admin-new/Communication/Feedback';
import NotificationsAdmin from './pages/admin-new/Communication/Notifications';
import PluginsSettings from './pages/admin-new/PluginsSettings';
import FileManager from './pages/admin-new/FileManager';
import GaugyanAIDashboard from './pages/admin-new/GaugyanAI/Dashboard';

// Legacy Admin Components (Preserved for functionality)
import AdminContactMessages from './pages/admin/AdminContactMessages';
import SettingsCertificates from './pages/admin-new/Settings/SettingsCertificates';
import AdminAdvertisement from './pages/admin/AdminAdvertisement';
import AdminMediaLibrary from './pages/admin/AdminMediaLibrary';

import ProtectedRoute from './components/ProtectedRoute';
import Onboarding from './pages/Onboarding';
import UserProfile from './pages/UserProfile';
import { Toaster } from 'react-hot-toast';

import PreScreen from './components/PreScreen';
import { settingsService } from './services/api';

const CategoryRedirect = () => {
  const { id } = useParams();
  return <Navigate to={`/shop?category=${id}`} replace />;
};

// Separate Content Component to use Context
const AppContent = () => {
  const [showPreScreen, setShowPreScreen] = useState(true);
  const [appSettings, setAppSettings] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAdmin } = useAuth();

  useEffect(() => {
    const fetchAppSettings = async () => {
      try {
        const response = await settingsService.getSettings('app');
        if (response.data && response.data.settings) {
          setAppSettings(response.data.settings);
        }
      } catch (error) {
        console.error("Failed to load app settings", error);
      }
    };
    fetchAppSettings();
  }, []);

  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem('onboarding_seen');
    if (!hasSeenOnboarding && location.pathname !== '/onboarding') {
      navigate('/onboarding');
    }
  }, [navigate, location.pathname]);

  // Logic: Calculate visibility based on settings
  const shouldSkipPreScreen = (() => {
    // 1. Session Reload Check (Immediate skip)
    if (sessionStorage.getItem('session_active')) return true;

    // 2. Returning User Check (Skip if 2nd timer)
    if (localStorage.getItem('has_visited_before')) return true;

    if (!appSettings) return false;
    if (appSettings.preloaderEnabled === false) return true;
    if (appSettings.preloaderOnce && sessionStorage.getItem('preloader_seen')) return true;
    if (appSettings.preloaderHideLoggedIn && user) return true;
    if (appSettings.preloaderHideAdmin && isAdmin && isAdmin()) return true;
    return false;
  })();

  const handlePreScreenComplete = () => {
    setShowPreScreen(false);

    // Mark session as active (for reloads)
    sessionStorage.setItem('session_active', 'true');

    // Mark user as visited (for returning users)
    localStorage.setItem('has_visited_before', 'true');

    if (appSettings?.preloaderOnce) {
      sessionStorage.setItem('preloader_seen', 'true');
    }
  };

  // While settings are loading, show nothing or minimal loader
  if (!appSettings) {
    // Optional: loading state or just proceed with defaults
    // Proceeding to rendering with default showPreScreen=true state
  }

  return (
    <>
      {showPreScreen && !shouldSkipPreScreen && (
        <PreScreen onComplete={handlePreScreenComplete} configs={appSettings} />
      )}

      <NotificationListener />
      <Toaster position="top-right" reverseOrder={false} />
      <ScrollToTop />
      <Routes>
        {/* New Admin Dashboard */}
        <Route path="/admin" element={<DashboardLayout />}>
          <Route index element={<NewAdminDashboard />} />

          <Route path="users/all-users" element={<AllUsers />} />
          <Route path="users/add" element={<AddUser />} />
          <Route path="users/roles" element={<RolesAndPermission />} />
          <Route path="users/verify-users" element={<VerifyUsers />} />
          <Route path="community" element={<CommunityManager />} />
          <Route path="instructors" element={<AllInstructors />} />

          <Route path="courses/courses" element={<AllCourses />} />
          <Route path="courses/categories" element={<CourseCategories />} />
          <Route path="meetings" element={<Meetings />} />

          <Route path="ecommerce/products" element={<AllProducts />} />
          <Route path="ecommerce/categories" element={<ECommerceCategories />} />
          <Route path="ecommerce/orders" element={<ECommerceOrders />} />
          <Route path="ecommerce/vendors" element={<Vendors />} />
          <Route path="ecommerce/payouts" element={<Payouts />} />
          <Route path="ecommerce/commissions" element={<Commissions />} />
          <Route path="ecommerce/refunds" element={<Refunds />} />

          <Route path="exams/all" element={<Exams />} />
          <Route path="quizzes/all" element={<Quizzes />} />

          <Route path="music/all" element={<Musics />} />
          <Route path="music/categories" element={<MusicCategories />} />
          <Route path="podcasts/all" element={<Podcasts />} />
          <Route path="meditation/all" element={<Meditations />} />
          <Route path="media" element={<AdminMediaLibrary />} />

          <Route path="news" element={<News />} />
          <Route path="gaushala/all" element={<Gaushalas />} />
          <Route path="gaushala/donations" element={<div className="p-6"><h2>Donations (Check Gaushala Management)</h2></div>} />

          <Route path="knowledgebase/all" element={<Knowledgebase />} />

          <Route path="contact-messages" element={<AdminContactMessages />} />
          <Route path="feedback" element={<FeedbackAdmin />} />
          <Route path="notifications" element={<NotificationsAdmin />} />
          <Route path="advertisements" element={<AdminAdvertisement />} />

          <Route path="settings/certificates" element={<SettingsCertificates />} />
          <Route path="settings/general" element={<SettingsGeneral />} />
          <Route path="settings/layout" element={<SettingsHeaderFooter />} />
          <Route path="settings/app" element={<SettingsApp />} />
          <Route path="settings/notifications" element={<SettingsNotifications />} />
          <Route path="settings/security" element={<SettingsSecurity />} />
          <Route path="settings/payment" element={<SettingsPayment />} />
          <Route path="settings/profile" element={<SettingsProfile />} />
          <Route path="settings/profile" element={<SettingsProfile />} />
          <Route path="settings/email" element={<SettingsEmail />} />
          <Route path="settings/email-templates" element={<EmailTemplates />} />
          <Route path="communication/bulk-email" element={<BulkEmail />} />
          <Route path="settings/shipping" element={<ShippingSettings />} />
          <Route path="settings/integrations" element={<SettingsIntegrations />} />
          <Route path="settings/plugins" element={<PluginsSettings />} />
          <Route path="system/files" element={<FileManager />} />
          <Route path="ai/dashboard" element={<GaugyanAIDashboard />} />

          <Route path="education/questions" element={<QuestionBank />} />
          <Route path="marketing/banners" element={<Banners />} />
          <Route path="marketing/sliders" element={<SliderManagement />} />
          <Route path="marketing/advertisements" element={<AdManagement />} />

          <Route path="moderation/approvals" element={<Approvals />} />
          <Route path="moderation/reviews" element={<ReviewModeration />} />

          <Route path="management/wallet" element={<WalletManagement />} />
          <Route path="management/coupons" element={<CouponManagement />} />
        </Route>

        <Route path="/instructor/dashboard" element={<ProtectedRoute><InstructorDashboard /></ProtectedRoute>} />
        <Route path="/artist/dashboard" element={<ProtectedRoute><ArtistDashboard /></ProtectedRoute>} />
        <Route path="/author/dashboard" element={<ProtectedRoute><AuthorDashboard /></ProtectedRoute>} />
        <Route path="/editor/dashboard" element={<ProtectedRoute><EditorDashboard /></ProtectedRoute>} />
        <Route path="/gaushala/dashboard" element={<ProtectedRoute><GaushalaOwnerDashboard /></ProtectedRoute>} />
        <Route path="/vendor/dashboard" element={<VendorDashboard />} />
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="onboarding" element={<Onboarding />} />
          <Route path="login" element={<Login />} />
          <Route path="admin/login" element={<Login />} />
          <Route path="signup" element={<Signup />} />

          {/* Ecommerce Routes */}
          <Route path="shop" element={<Shop />} />
          <Route path="product/:id" element={<ProductDetail />} />
          <Route path="category/:id" element={<CategoryRedirect />} />

          {/* Course Routes */}
          <Route path="courses" element={<Courses />} />
          <Route path="courses/search" element={<CourseSearch />} />
          <Route path="courses/:id" element={<CourseDetail />} />
          <Route path="courses/:id/learn" element={<ProtectedRoute><CourseLearning /></ProtectedRoute>} />
          <Route path="course-checkout/:courseId" element={<ProtectedRoute><CourseCheckout /></ProtectedRoute>} />

          {/* Entertainment Routes */}
          <Route path="entertainment" element={<Entertainment />} />
          <Route path="podcast" element={<PodcastListing />} />
          <Route path="podcast/search" element={<PodcastSearch />} />
          <Route path="podcast/:id" element={<PodcastDetail />} />
          <Route path="podcast/:id/review" element={<PodcastReview />} />
          <Route path="music" element={<MusicListing />} />
          <Route path="music/search" element={<MusicSearch />} />
          <Route path="music/:id" element={<MusicSingle />} />
          <Route path="music/:id/player" element={<MusicPlayer />} />
          <Route path="music/:id/review" element={<MusicReview />} />
          <Route path="meditation" element={<MeditationListing />} />
          <Route path="meditation/search" element={<MeditationSearch />} />
          <Route path="meditation/:id" element={<MeditationSingle />} />

          {/* Astrology Routes */}
          <Route path="panchang" element={<Panchang />} />
          <Route path="astrology" element={<Astrologers />} />

          {/* Community Routes */}
          <Route path="community" element={<ProtectedRoute><Community /></ProtectedRoute>} />
          <Route path="chat" element={<ProtectedRoute><Chat /></ProtectedRoute>} />

          {/* User Dashboard */}
          <Route path="/dashboard" element={<ProtectedRoute><UserDashboard /></ProtectedRoute>} />
          <Route path="/my-courses" element={<ProtectedRoute><MyCourses /></ProtectedRoute>} />
          <Route path="/my-orders" element={<ProtectedRoute><MyOrders /></ProtectedRoute>} />
          <Route path="/my-results" element={<ProtectedRoute><MyResults /></ProtectedRoute>} />
          <Route path="/wallet" element={<ProtectedRoute><Wallet /></ProtectedRoute>} />
          <Route path="/certificates" element={<ProtectedRoute><UserCertificates /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
          {/* Additional Routes */}
          <Route path="exams" element={<ExamListing />} />
          <Route path="exams/search" element={<ExamSearch />} />
          <Route path="exams/:id" element={<ExamSingle />} />
          <Route path="checkout/exam/:id" element={<ProtectedRoute><ExamCheckout /></ProtectedRoute>} />
          <Route path="exam/:id/start" element={<ExamRunner />} />
          <Route path="quizzes" element={<QuizListing />} />
          <Route path="quizzes/search" element={<QuizSearch />} />
          <Route path="quizzes/:id" element={<QuizSingle />} />
          <Route path="quiz/:id/start" element={<QuizRunner />} />
          <Route path="knowledgebase" element={<KnowledgebaseListing />} />
          <Route path="knowledgebase/search" element={<KnowledgebaseSearch />} />
          <Route path="knowledgebase/:id" element={<KnowledgebaseSingle />} />
          <Route path="gaushala" element={<GaushalaListing />} />
          <Route path="gaushala/:id" element={<GaushalaSingle />} />

          {/* Vendor Routes */}
          <Route path="shop/preview" element={<ProtectedRoute><ShopPreview /></ProtectedRoute>} />
          <Route
            path="/vendor/*"
            element={
              <ProtectedRoute>
                <VendorDashboard />
              </ProtectedRoute>
            }
          />

          {/* Legal Pages */}
          <Route path="privacy" element={<PrivacyPolicy />} />
          <Route path="terms" element={<TermsConditions />} />
          <Route path="shipping" element={<ShippingPolicy />} />
          <Route path="feedback" element={<Feedback />} />
          <Route path="about" element={<AboutUs />} />
          <Route path="faq" element={<FAQ />} />
          <Route path="advertise" element={<Advertise />} />
          <Route path="contact" element={<ContactUs />} />
          <Route path="news" element={<NewsListing />} />
          <Route path="news/:id" element={<NewsDetail />} />

          <Route path="wishlist" element={<Wishlist />} />
          <Route path="cart" element={<Cart />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="thank-you" element={<ThankYou />} />
          <Route path="profile" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />

          <Route path="*" element={<NotFound />} />
        </Route>

        {/* Public Verification Route */}
        <Route path="/verify-certificate/:serialNumber" element={<CertificateVerification />} />
      </Routes>
    </>
  );
};

function App() {
  console.log("DEBUG: App.jsx - Rendering App Component");
  return (
    <GlobalErrorBoundary showDetails={true}>
      <AuthProvider>
        <ThemeProvider>
          <PluginProvider>
            <DataProvider>
              <CartProvider>
                <WishlistProvider>
                  <AppContent />
                </WishlistProvider>
              </CartProvider>
            </DataProvider>
          </PluginProvider>
        </ThemeProvider>
      </AuthProvider>
    </GlobalErrorBoundary>
  );
}

export default App;
