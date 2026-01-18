import {
  FiShoppingCart,
  FiCreditCard,
  FiBook,
  FiPercent,
  FiDollarSign,
  FiCheckCircle,
} from "react-icons/fi";

import { useCurrency } from '../../context/CurrencyContext';

export default function MarketingDashboard() {
  const { formatPrice } = useCurrency();
  const topStats = [
    {
      value: "50",
      label: "Users Purchase",
      icon: <FiShoppingCart />,
      bg: "bg-[#e6f4ef]",
    },
    {
      value: formatPrice(0),
      label: "Wallet Amount",
      icon: <FiCreditCard />,
      bg: "bg-[#f6f0e5]",
    },
    {
      value: "7",
      label: "Featured Courses",
      icon: <FiBook />,
      bg: "bg-[#e7f0fb]",
    },
    {
      value: "1",
      label: "Active Coupons",
      icon: <FiPercent />,
      bg: "bg-[#f8e7ea]",
    },
  ];

  const revenueStats = [
    {
      value: formatPrice(49998),
      label: "Total Revenue",
      icon: <FiCheckCircle />,
      bg: "bg-[#e6eaf0]",
    },
    {
      value: formatPrice(29997),
      label: "Admin Revenue",
      icon: <FiDollarSign />,
      bg: "bg-[#e2ecfa]",
    },
    {
      value: formatPrice(30007),
      label: "Instructors Revenue",
      icon: <FiDollarSign />,
      bg: "bg-[#e9e7f5]",
    },
  ];

  const purchasedCourses = [
    { user: "Rishaya", orders: 1, amount: formatPrice(0) },
    { user: "Ravi", orders: 1, amount: formatPrice(24999) },
    { user: "Priya", orders: 2, amount: formatPrice(18999) },
  ];

  return (
    <div className="p-6">
      {/* TOP STATS ROW */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
        {topStats.map((item, i) => (
          <div
            key={item.label}
            className={`${item.bg} p-5 rounded-xl border border-gray-200 shadow-sm flex justify-between items-center`}
          >
            <div>
              <p className="text-3xl font-bold">{item.value}</p>
              <p className="text-gray-600 mt-1">{item.label}</p>
            </div>
            <div className="text-4xl text-gray-700">{item.icon}</div>
          </div>
        ))}
      </div>

      {/* REVENUE STATS ROW */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
        {revenueStats.map((item, i) => (
          <div
            key={item.label}
            className={`${item.bg} p-5 rounded-xl border border-gray-200 shadow-sm flex justify-between items-center`}
          >
            <div>
              <p className="text-3xl font-bold">{item.value}</p>
              <p className="text-gray-600 mt-1">{item.label}</p>
            </div>
            <div className="text-4xl text-gray-700">{item.icon}</div>
          </div>
        ))}
      </div>

      {/* TOTAL REVENUE PANEL */}
      <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 mb-10">
        <h2 className="text-lg font-semibold mb-2">Total Revenue</h2>
        <div className="h-24 flex items-center justify-center text-gray-400">
          (Chart will come here)
        </div>
      </div>

      {/* CLASS TYPES + PURCHASED COURSES */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* CLASS TYPES */}
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 h-60">
          <h2 className="text-lg font-semibold">Class Types</h2>
          <div className="h-full flex items-center justify-center text-gray-400">
            (Chart Coming Soon)
          </div>
        </div>

        {/* MOST PURCHASED COURSES */}
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
          <div className="flex justify-between mb-3">
            <h2 className="text-lg font-semibold">Most Purchased Courses</h2>
            <button className="text-blue-600 text-sm hover:underline">
              View All ›
            </button>
          </div>

          <table className="w-full text-left">
            <thead>
              <tr className="text-gray-600 text-sm border-b">
                <th className="py-2">User Name</th>
                <th className="py-2">Order Count</th>
                <th className="py-2">Total Amount</th>
              </tr>
            </thead>
            <tbody>
              {purchasedCourses.map((row, i) => (
                <tr key={row.user} className="text-gray-700 border-b">
                  <td className="py-2">{row.user}</td>
                  <td className="py-2">{row.orders}</td>
                  <td className="py-2">{row.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
