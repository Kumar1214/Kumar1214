import Sidebar from "./Sidebar";
import Header from "./Header";
import { Outlet, useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { FiMenu, FiX } from "react-icons/fi";

export default function DashboardLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const { pathname } = useLocation();
    const mainRef = useRef(null);

    useEffect(() => {
        const checkMobile = () => {
            const mobile = window.innerWidth < 1024;
            setIsMobile(mobile);
            if (!mobile) setSidebarOpen(false);
        };

        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    useEffect(() => {
        if (mainRef.current) {
            mainRef.current.scrollTo(0, 0);
        }
        // Auto-close sidebar on navigation for mobile
        if (isMobile && sidebarOpen) {
            const timer = setTimeout(() => setSidebarOpen(false), 0);
            return () => clearTimeout(timer);
        }
    }, [pathname, isMobile, sidebarOpen]);

    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

    return (
        <div className="flex bg-gray-50 h-screen overflow-hidden">
            {/* BACKDROP for mobile */}
            {sidebarOpen && isMobile && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={toggleSidebar}
                />
            )}

            {/* FIXED SIDEBAR (Does NOT Scroll) */}
            <div
                className={`
          fixed lg:static left-0 top-0 h-full z-50
          transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
                    }
        `}
            >
                <Sidebar closeSidebar={() => setSidebarOpen(false)} />
                {/* <div>Sidebar Placeholder</div> */}
            </div>

            {/* RIGHT SIDE MAIN AREA */}
            <div className="flex-1 flex flex-col h-full overflow-hidden">
                {/* Mobile Menu Button */}
                <div className="lg:hidden fixed top-4 left-4 z-50">
                    <button
                        onClick={toggleSidebar}
                        className="p-2.5 rounded-xl bg-white shadow-lg border"
                    >
                        {sidebarOpen ? <FiX size={20} /> : <FiMenu size={20} />}
                    </button>
                </div>

                {/* FIXED HEADER */}
                <div className="sticky top-0 z-30 bg-white shadow-sm border-b">
                    <Header />
                </div>

                {/* MAIN CONTENT (Only this scrolls) */}
                <main ref={mainRef} className="flex-1 overflow-y-auto">
                    <div className="max-w-7xl mx-auto p-6">
                        {/* White card wrapper */}
                        <div className="bg-white rounded-2xl shadow-sm border p-6 min-h-[calc(100vh-150px)]">
                            <Outlet key={pathname} />
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
