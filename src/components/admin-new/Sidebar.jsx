import { useState } from "react";
// Removed unused imports
import { NavLink } from "react-router-dom";
import {
    FiHome,
    FiTrendingUp,
    FiChevronDown,
    FiUsers,
    FiBook,
    FiClipboard,
    FiShoppingBag,
    FiMusic,
    FiRadio,
    FiImage,
    FiFileText,
    FiHeart,
    FiBookOpen,
    FiMessageSquare,
    FiSettings,
    FiAward,
    FiCheckCircle
} from "react-icons/fi";

export default function Sidebar({ closeSidebar }) {
    const [openMenu, setOpenMenu] = useState(null);

    const toggleMenu = (menu) => {
        setOpenMenu(openMenu === menu ? null : menu);
    };

    // Simplified menuData with safe icons
    const menuData = [
        {
            section: "Main",
            items: [
                { title: "Dashboard", icon: <FiHome />, to: "/admin" },
                {
                    title: "Gaugyan AI",
                    icon: <FiCheckCircle />,
                    type: "dropdown",
                    menu: "gaugyan-ai",
                    children: [
                        { label: "AI Dashboard", to: "/admin/ai/dashboard" },
                        { label: "System Files", to: "/admin/system/files" }
                    ]
                }
            ]
        },
        {
            section: "User Management",
            items: [
                {
                    title: "Users",
                    icon: <FiUsers />,
                    type: "dropdown",
                    menu: "users",
                    children: [
                        { label: "All Users", to: "/admin/users/all-users" },
                        { label: "Instructors", to: "/admin/instructors" },
                        // { label: "Add User", to: "/admin/users/add-users" },
                        { label: "Verify Users", to: "/admin/users/verify-users" },
                        { label: "Roles & Permissions", to: "/admin/users/roles" },
                        { label: "Community", to: "/admin/community" }
                    ]
                }
            ]
        },
        {
            section: "Education",
            items: [
                {
                    title: "Courses",
                    icon: <FiBook />,
                    type: "dropdown",
                    menu: "courses",
                    children: [
                        { label: "All Courses", to: "/admin/courses/courses" },
                        { label: "Categories", to: "/admin/courses/categories" },
                        { label: "Meetings", to: "/admin/meetings" }
                    ]
                },
                {
                    title: "Examinations",
                    icon: <FiClipboard />,
                    type: "dropdown",
                    menu: "exams",
                    children: [
                        { label: "Exams", to: "/admin/exams/all" },
                        // { label: "Exam Categories", to: "/admin/exams/categories" },
                        { label: "Quizzes", to: "/admin/quizzes/all" },
                        // { label: "Quiz Categories", to: "/admin/quizzes/categories" }
                    ]
                },
                {
                    title: "Question Bank",
                    icon: <FiFileText />,
                    to: "/admin/education/questions"
                }
            ]
        },
        {
            section: "E-Commerce",
            items: [
                {
                    title: "Products",
                    icon: <FiShoppingBag />,
                    type: "dropdown",
                    menu: "products",
                    children: [
                        { label: "All Products", to: "/admin/ecommerce/products" },
                        { label: "Categories", to: "/admin/ecommerce/categories" },
                        { label: "Orders", to: "/admin/ecommerce/orders" },
                        { label: "Vendors", to: "/admin/ecommerce/vendors" },
                        { label: "Payouts", to: "/admin/ecommerce/payouts" },
                        { label: "Commissions", to: "/admin/ecommerce/commissions" },
                        { label: "Refunds", to: "/admin/ecommerce/refunds" }
                    ]
                }
            ]
        },
        {
            section: "Entertainment & Media",
            items: [
                {
                    title: "Music & Podcasts",
                    icon: <FiMusic />,
                    type: "dropdown",
                    menu: "music",
                    children: [
                        { label: "Music Library", to: "/admin/music/all" },
                        { label: "Music Categories", to: "/admin/music/categories" },
                        { label: "Podcasts", to: "/admin/podcasts/all" }
                    ]
                },
                {
                    title: "Meditation",
                    icon: <FiRadio />, // Using Radio as a proxy for Meditation/Yoga
                    to: "/admin/meditation/all"
                },
                {
                    title: "Media Library",
                    icon: <FiImage />,
                    to: "/admin/media"
                },
                {
                    title: "News & Blogs",
                    icon: <FiFileText />,
                    type: "dropdown",
                    menu: "news",
                    children: [
                        { label: "News Articles", to: "/admin/news" },
                        // { label: "News Categories", to: "/admin/news/categories" },
                        // { label: "Blogs", to: "/admin/blogs" }
                    ]
                }
            ]
        },
        {
            section: "Marketing",
            items: [
                {
                    title: "Banners & Ads",
                    icon: <FiImage />,
                    type: "dropdown",
                    menu: "marketing",
                    children: [
                        { label: "Banners", to: "/admin/marketing/banners" },
                        { label: "Sliders", to: "/admin/marketing/sliders" },
                        { label: "Advertisements", to: "/admin/marketing/advertisements" }
                    ]
                },
                {
                    title: "Coupons",
                    icon: <FiCheckCircle />, // Using check circle as placeholder
                    to: "/admin/management/coupons"
                }
            ]
        },
        {
            section: "Moderation",
            items: [
                {
                    title: "Approvals",
                    icon: <FiCheckCircle />,
                    to: "/admin/moderation/approvals"
                },
                {
                    title: "Reviews",
                    icon: <FiMessageSquare />,
                    to: "/admin/moderation/reviews"
                }
            ]
        },
        {
            section: "Finance",
            items: [
                {
                    title: "Wallet",
                    icon: <FiTrendingUp />,
                    to: "/admin/management/wallet"
                }
            ]
        },
        {
            section: "Gaushala",
            items: [
                {
                    title: "Gaushala",
                    icon: <FiHeart />,
                    type: "dropdown",
                    menu: "gaushala",
                    children: [
                        { label: "Cow Shelters", to: "/admin/gaushala/all" },
                        { label: "Donations", to: "/admin/gaushala/donations" }
                    ]
                }
            ]
        },
        {
            section: "Support & Settings",
            items: [
                {
                    title: "Knowledgebase",
                    icon: <FiBookOpen />,
                    to: "/admin/knowledgebase/all"
                },
                {
                    title: "Communication",
                    icon: <FiMessageSquare />,
                    type: "dropdown",
                    menu: "communication",
                    children: [
                        { label: "Contact Messages", to: "/admin/contact-messages" },
                        { label: "Feedback", to: "/admin/feedback" },
                        { label: "Notifications", to: "/admin/notifications" }
                    ]
                },
                {
                    title: "Settings",
                    icon: <FiSettings />,
                    type: "dropdown",
                    menu: "settings",
                    children: [
                        { label: "General", to: "/admin/settings/general" },
                        { label: "Layout & Design", to: "/admin/settings/layout" },
                        { label: "App Settings", to: "/admin/settings/app" },
                        { label: "Notifications", to: "/admin/settings/notifications" },
                        { label: "Security", to: "/admin/settings/security" },
                        { label: "Profile", to: "/admin/settings/profile" },
                        { label: "Payment", to: "/admin/settings/payment" },
                        { label: "Email Config", to: "/admin/settings/email" },
                        { label: "Email Templates", to: "/admin/settings/email-templates" },
                        { label: "Shipping", to: "/admin/settings/shipping" },
                        { label: "Integrations", to: "/admin/settings/integrations" },
                        { label: "Certificates", to: "/admin/settings/certificates" },
                        { label: "Plugins", to: "/admin/settings/plugins" },
                        { label: "System Files", to: "/admin/system/files" }
                    ]
                }
            ]
        }
    ];

    return (
        <div className="w-80 bg-white text-gray-800 h-screen flex flex-col shadow-lg border-r border-gray-200 transition-all duration-300">
            {/* Header */}
            <div className="p-6 border-b border-gray-100">
                <div className="flex items-center gap-3 mb-2">
                    <img src="/gaugyan-logo.png" alt="Gaugyan" className="h-12 w-12 object-contain" />
                    <div>
                        <h1 className="text-2xl font-bold text-[#1F5B6B]">
                            GauGyan Admin
                        </h1>
                        <p className="text-sm text-gray-500">Management Portal</p>
                    </div>
                </div>
            </div>

            {/* Navigation Placeholder */}
            <div className="flex-1 overflow-y-auto py-4 px-4 custom-scrollbar">
                {menuData.map((sec, sIndex) => (
                    <div key={sIndex} className="mb-6">
                        {sec.section && (
                            <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3 px-3">
                                {sec.section}
                            </h2>
                        )}

                        <div className="space-y-1">
                            {sec.items.map((item, index) =>
                                item.type === "dropdown" ? (
                                    <SidebarDropdown
                                        key={index}
                                        title={item.title}
                                        icon={item.icon}
                                        menu={item.menu}
                                        openMenu={openMenu}
                                        toggleMenu={toggleMenu}
                                        items={item.children || []}
                                        closeSidebar={closeSidebar}
                                    />
                                ) : (
                                    <SidebarItem
                                        key={index}
                                        title={item.title}
                                        icon={item.icon}
                                        to={item.to}
                                        subLabel={item.subLabel}
                                        closeSidebar={closeSidebar}
                                    />
                                )
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-100 bg-gray-50">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-white shadow-sm border border-gray-200">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#0c2d50] to-[#1e4d7b] flex items-center justify-center">
                        <span className="text-white text-sm font-bold">A</span>
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                            Admin User
                        </p>
                        <p className="text-xs text-gray-500 truncate">Administrator</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

function SidebarItem({ title, icon, to, subLabel, closeSidebar }) {
    return (
        <NavLink
            to={to}
            end
            onClick={closeSidebar}
            className={({ isActive }) =>
                `group flex items-center gap-3 p-3 rounded-xl transition-all duration-200 border border-transparent
        ${isActive
                    ? "bg-[#0c2d50] text-white shadow-md shadow-blue-100 border-[#0c2d50]"
                    : "hover:bg-gray-50 hover:border-gray-200 hover:shadow-sm text-gray-700"
                }`
            }
        >
            {({ isActive }) => (
                <>
                    <span
                        className={`text-lg transition-colors duration-200 group-hover:scale-110 ${isActive ? "text-white" : "text-[#0c2d50]"
                            }`}
                    >
                        {icon}
                    </span>

                    <div className="flex flex-col flex-1 min-w-0">
                        <span className="font-medium text-sm leading-tight">{title}</span>
                        {subLabel && (
                            <span className="text-xs opacity-75 mt-0.5 leading-tight">
                                {subLabel}
                            </span>
                        )}
                    </div>

                    {/* Active indicator */}
                    {isActive && (
                        <div className="w-1.5 h-1.5 rounded-full bg-white ml-auto"></div>
                    )}
                </>
            )}
        </NavLink>
    );
}

function SidebarDropdown({
    title,
    icon,
    menu,
    openMenu,
    toggleMenu,
    items,
    closeSidebar,
}) {
    const isOpen = openMenu === menu;

    return (
        <div className="group">
            <button
                onClick={() => toggleMenu(menu)}
                className={`flex justify-between items-center w-full p-3 rounded-xl transition-all duration-200 border
          ${isOpen
                        ? "bg-blue-50 border-blue-200 shadow-sm"
                        : "border-transparent hover:bg-gray-50 hover:border-gray-200"
                    }`}
            >
                <div className="flex items-center gap-3">
                    <span
                        className={`text-lg transition-colors duration-200 ${isOpen
                            ? "text-[#0c2d50]"
                            : "text-gray-600 group-hover:text-[#0c2d50]"
                            }`}
                    >
                        {icon}
                    </span>
                    <span
                        className={`font-medium text-sm ${isOpen ? "text-[#0c2d50]" : "text-gray-700"
                            }`}
                    >
                        {title}
                    </span>
                </div>

                <FiChevronDown
                    className={`transition-all duration-300 ${isOpen ? "rotate-180 text-[#0c2d50]" : "text-gray-400"
                        }`}
                />
            </button>

            <div
                className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
                    }`}
            >
                <div className="ml-9 pl-3 border-l-2 border-gray-200 mt-2 space-y-1">
                    {items.map((item, i) => (
                        <NavLink
                            key={i}
                            to={item.to}
                            end
                            onClick={closeSidebar}
                            className={({ isActive }) =>
                                `block py-2 px-3 rounded-lg text-sm transition-all duration-200 border border-transparent
                ${isActive
                                    ? "bg-[#0c2d50] text-white shadow-sm border-[#0c2d50] font-medium"
                                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 hover:border-gray-200"
                                }`
                            }
                        >
                            {item.label}
                        </NavLink>
                    ))}
                </div>
            </div>
        </div>
    );
}
