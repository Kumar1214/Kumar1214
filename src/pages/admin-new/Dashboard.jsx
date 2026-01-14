
import { useData } from '../../context/useData';
import { Link } from 'react-router-dom';
import {
  FiUsers,
  FiBook,
  FiShoppingBag,
  FiDollarSign,
  FiTrendingUp,
  FiFileText,
  FiMusic,
  FiRadio,
  FiAward,
  FiPackage,
  FiHeart,
  FiBookOpen,
  FiClipboard,
  FiCalendar,
  FiMessageSquare
} from 'react-icons/fi';
import AnalyticsWidget from '../../components/admin-new/AnalyticsWidget';
import AIWelcomeWidget from '../../components/admin-new/AIWelcomeWidget';


// -- Sub-components defined outside to prevent re-creation on render --

const StatCard = ({ icon, label, value, bgColor = "bg-blue-50", iconColor = "text-blue-600", link }) => {
  const Icon = icon;

  const content = (
    <div className={`${bgColor} p-4 rounded-xl border border-gray-200 flex items-center justify-between hover:shadow-md transition-shadow cursor-pointer`}>
      <div>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <p className="text-sm text-gray-600 mt-1">{label}</p>
      </div>
      <div className={`${iconColor} text-3xl`}>
        <Icon />
      </div>
    </div>
  );

  return link ? <Link to={link} className="block">{content}</Link> : content;
};

const RecentSection = ({ title, items, emptyMessage }) => (
  <div className="bg-white rounded-xl border border-gray-200 p-6">
    <h3 className="text-lg font-bold text-gray-900 mb-4">{title}</h3>
    {items && items.length > 0 ? (
      <div className="space-y-3">
        {items.slice(0, 5).map((item, index) => (
          <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
            <div className="flex items-center gap-3">
              {(item.image || item.featuredImage || item.profilePicture) && (
                <img src={item.image || item.featuredImage || item.profilePicture} alt={item.title || item.name} className="w-10 h-10 rounded-lg object-cover" />
              )}
              <div>
                <p className="font-medium text-gray-900 text-sm">
                  {item.title || item.name || item.email || (item.user && (item.user.name || item.user.email)) || item.user || 'Unknown'}
                </p>
                <p className="text-xs text-gray-500">
                  {(item.instructor && (item.instructor.name || item.instructor.email)) || item.instructor || item.category || item.role || ''}
                </p>
              </div>
            </div>
            {item.price !== undefined && (
              <span className="text-sm font-semibold text-green-600">₹{item.price}</span>
            )}
          </div>
        ))}
      </div>
    ) : (
      <p className="text-gray-500 text-sm">{emptyMessage}</p>
    )}
  </div>
);

export default function Dashboard() {
  const {
    courses,
    users,
    orders,
    products,
    exams,
    quizzes,
    music,
    podcasts,
    news,
    knowledgebase,
    gaushalas,
    questionBanks,
    // meditation, // Unused
    // results,    // Unused

  } = useData();

  //   useEffect(() => {
  //     refreshCourses();
  //     refreshUsers();
  //     refreshProducts();
  //     refreshExams();
  //     refreshQuizzes();
  //   }, [refreshCourses, refreshUsers, refreshProducts, refreshExams, refreshQuizzes]);

  // Calculate statistics
  const stats = {
    totalUsers: users?.length || 0,
    totalInstructors: users?.filter(u => u.role === 'instructor').length || 0,
    totalFollowers: users?.filter(u => u.role === 'user').length || 0,

    totalOrders: orders?.length || 0,
    pendingOrders: orders?.filter(o => o.status === 'pending').length || 0,

    totalProducts: products?.length || 0,
    totalCoupons: 1, // Static for now as no coupon data in context yet
    refundOrders: orders?.filter(o => o.status === 'refunded').length || 0,

    totalCourses: courses?.length || 0,
    approvedCourses: courses?.filter(c => c.status === 'approved').length || 0,
    courseCategories: 6, // Static

    googleMeetings: 0, // No data
    newsArticles: news?.length || 0,
    blogs: 0, // No data
    testimonials: 0, // No data

    totalSongs: music?.length || 0,
    totalArtists: 7, // Static
    totalPages: knowledgebase?.length || 0, // Mapping pages to knowledgebase count for now
    faqs: 0, // No data
    notifications: 0, // No data
    settings: 0, // No data
    marketingLeads: 0 // No data
  };

  // Calculate revenue (dummy for now)
  const totalRevenue = orders?.reduce((sum, order) => sum + (order.total || 0), 0) || 0;

  return (
    <div className="space-y-6">
      {/* AI Welcome Widget */}
      <AIWelcomeWidget />

      {/* Header */}
      <div className="hidden"> {/* Hidden because AI widget handles greeting */}
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-600 mt-1">Welcome to GauGyan Admin Panel</p>
      </div>

      {/* Analytics Widget */}
      <div id="analytics-section">
        <AnalyticsWidget />
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={FiUsers} label="Users" value={stats.totalUsers} bgColor="bg-blue-50" iconColor="text-blue-600" link="/admin/users/all-users" />
        <StatCard icon={FiUsers} label="Instructors" value={stats.totalInstructors} bgColor="bg-purple-50" iconColor="text-purple-600" link="/admin/instructors" />
        <StatCard icon={FiUsers} label="Followers" value={stats.totalFollowers} bgColor="bg-green-50" iconColor="text-green-600" link="/admin/users/all-users" />
        <StatCard icon={FiShoppingBag} label="Orders" value={stats.totalOrders} bgColor="bg-orange-50" iconColor="text-orange-600" link="/admin/ecommerce/orders" />
      </div>

      {/* E-Commerce Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={FiPackage} label="Products" value={stats.totalProducts} bgColor="bg-indigo-50" iconColor="text-indigo-600" link="/admin/ecommerce/products" />
        <StatCard icon={FiAward} label="Coupons" value={stats.totalCoupons} bgColor="bg-pink-50" iconColor="text-pink-600" link="/admin/management/coupons" />
        <StatCard icon={FiTrendingUp} label="Refund Orders" value={stats.refundOrders} bgColor="bg-red-50" iconColor="text-red-600" link="/admin/ecommerce/refunds" />
        <StatCard icon={FiDollarSign} label="Total Revenue" value={`₹${totalRevenue.toLocaleString()}`} bgColor="bg-emerald-50" iconColor="text-emerald-600" link="/admin/management/wallet" />
      </div>

      {/* Education Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={FiBook} label="Courses" value={stats.totalCourses} bgColor="bg-cyan-50" iconColor="text-cyan-600" link="/admin/courses/courses" />
        <StatCard icon={FiBookOpen} label="Categories" value={stats.courseCategories} bgColor="bg-teal-50" iconColor="text-teal-600" link="/admin/courses/categories" />
        <StatCard icon={FiCalendar} label="Google Meetings" value={stats.googleMeetings} bgColor="bg-amber-50" iconColor="text-amber-600" link="/admin/meetings" />
        <StatCard icon={FiClipboard} label="Exams" value={exams?.length || 0} bgColor="bg-lime-50" iconColor="text-lime-600" link="/admin/exams/all" />
        <StatCard icon={FiClipboard} label="Question Bank" value={questionBanks?.length || 0} bgColor="bg-amber-50" iconColor="text-amber-600" link="/admin/education/questions" />
      </div>

      {/* Content Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={FiFileText} label="News & Articles" value={stats.newsArticles} bgColor="bg-sky-50" iconColor="text-sky-600" link="/admin/news" />
        {/* Blog link if separate, or same as news */}
        <StatCard icon={FiMessageSquare} label="Blogs" value={stats.blogs} bgColor="bg-violet-50" iconColor="text-violet-600" link="/admin/news" />
        <StatCard icon={FiMusic} label="Music" value={stats.totalSongs} bgColor="bg-fuchsia-50" iconColor="text-fuchsia-600" link="/admin/music/all" />
        <StatCard icon={FiRadio} label="Podcasts" value={podcasts?.length || 0} bgColor="bg-rose-50" iconColor="text-rose-600" link="/admin/podcasts/all" />
      </div>

      {/* System Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={FiHeart} label="Gaushala" value={gaushalas?.length || 0} bgColor="bg-orange-50" iconColor="text-orange-600" link="/admin/gaushala/all" />
        <StatCard icon={FiBookOpen} label="Knowledgebase" value={knowledgebase?.length || 0} bgColor="bg-blue-50" iconColor="text-blue-600" link="/admin/knowledgebase/all" />
        <StatCard icon={FiAward} label="Quizzes" value={quizzes?.length || 0} bgColor="bg-green-50" iconColor="text-green-600" link="/admin/quizzes/all" />
        <StatCard icon={FiUsers} label="Artists" value={stats.totalArtists} bgColor="bg-purple-50" iconColor="text-purple-600" link="/admin/users/all-users" />
      </div>

      {/* Recent Activity Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <RecentSection
          title="Recent Users"
          items={users?.slice(-5).reverse()}
          emptyMessage="No recent users available"
        />
        <RecentSection
          title="Recent Courses"
          items={courses?.slice(-5).reverse()}
          emptyMessage="No recent courses available"
        />
        <RecentSection
          title="Recent Orders"
          items={orders?.slice(-5).reverse()}
          emptyMessage="No recent orders available"
        />
      </div>

      {/* Blog Posts Section */}
      <RecentSection
        title="Recent News & Blogs"
        items={news?.slice(-5).reverse()}
        emptyMessage="No recent posts available"
      />
    </div>
  );
}
