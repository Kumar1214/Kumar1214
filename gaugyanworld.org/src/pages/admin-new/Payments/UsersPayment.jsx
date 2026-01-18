import { useState } from "react";
import { FiCheck, FiX, FiSearch } from "react-icons/fi";

export default function UsersPayment() {
  const [search, setSearch] = useState("");

  const [requests, setRequests] = useState([
    {
      id: 1,
      user: "Rahul Sharma",
      amount: 500,
      method: "UPI",
      status: "Pending",
    },
    {
      id: 2,
      user: "Priya Verma",
      amount: 1200,
      method: "Bank Transfer",
      status: "Pending",
    },
    {
      id: 3,
      user: "Amit Singh",
      amount: 900,
      method: "UPI",
      status: "Rejected",
    },
  ]);

  // Approve / Reject modal
  const [actionType, setActionType] = useState(null); // "approve" or "reject"
  const [selectedId, setSelectedId] = useState(null);

  const handleAction = () => {
    setRequests(
      requests.map((req) =>
        req.id === selectedId
          ? {
              ...req,
              status: actionType === "approve" ? "Approved" : "Rejected",
            }
          : req
      )
    );
    setActionType(null);
    setSelectedId(null);
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow">
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-semibold">Users Payment Requests</h2>
      </div>

      {/* Search */}
      <div className="flex justify-end mb-4">
        <div className="relative">
          <FiSearch className="absolute left-3 top-2 text-gray-500" />
          <input
            type="text"
            placeholder="Search user..."
            className="border pl-10 pr-3 py-1 rounded"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-3">#</th>
            <th className="p-3">User</th>
            <th className="p-3">Amount</th>
            <th className="p-3">Method</th>
            <th className="p-3">Status</th>
            <th className="p-3">Action</th>
          </tr>
        </thead>

        <tbody>
          {requests
            .filter((r) => r.user.toLowerCase().includes(search.toLowerCase()))
            .map((req, i) => (
              <tr key={req.id} className={i % 2 === 0 ? "bg-gray-50" : ""}>
                <td className="p-3">{i + 1}</td>
                <td className="p-3 font-medium">{req.user}</td>
                <td className="p-3 font-semibold">₹{req.amount}</td>
                <td className="p-3">{req.method}</td>

                <td className="p-3">
                  <span
                    className={`px-2 py-1 rounded text-sm 
                    ${
                      req.status === "Approved"
                        ? "bg-green-100 text-green-700"
                        : req.status === "Rejected"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {req.status}
                  </span>
                </td>

                <td className="p-3 flex gap-3">
                  {/* Approve button */}
                  {req.status === "Pending" && (
                    <button
                      onClick={() => {
                        setSelectedId(req.id);
                        setActionType("approve");
                      }}
                      className="text-green-600"
                    >
                      <FiCheck size={20} />
                    </button>
                  )}

                  {/* Reject button */}
                  {req.status === "Pending" && (
                    <button
                      onClick={() => {
                        setSelectedId(req.id);
                        setActionType("reject");
                      }}
                      className="text-red-600"
                    >
                      <FiX size={20} />
                    </button>
                  )}
                </td>
              </tr>
            ))}
        </tbody>
      </table>

      {/* APPROVE / REJECT MODAL */}
      {actionType && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl w-80">
            <h3 className="text-lg font-semibold mb-3">
              {actionType === "approve"
                ? "Approve Withdrawal?"
                : "Reject Withdrawal?"}
            </h3>

            <p className="text-gray-600 mb-4">
              Are you sure you want to{" "}
              <span className="font-bold">
                {actionType === "approve" ? "approve" : "reject"}
              </span>{" "}
              this request?
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setActionType(null);
                  setSelectedId(null);
                }}
                className="px-4 py-1 border rounded"
              >
                Cancel
              </button>

              <button
                onClick={handleAction}
                className={`px-4 py-1 text-white rounded 
                  ${actionType === "approve" ? "bg-green-600" : "bg-red-600"}
                `}
              >
                {actionType === "approve" ? "Approve" : "Reject"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
