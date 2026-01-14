import { useState } from "react";
import { FiPlus, FiMinus, FiSearch } from "react-icons/fi";

export default function Wallets() {
  const [search, setSearch] = useState("");

  const [users, setUsers] = useState([
    { id: 1, name: "Rahul Sharma", balance: 1200 },
    { id: 2, name: "Priya Verma", balance: 800 },
    { id: 3, name: "Amit Singh", balance: 450 },
    { id: 4, name: "Neha Kapoor", balance: 2000 },
  ]);

  // Update wallet modal
  const [modalOpen, setModalOpen] = useState(false);
  const [action, setAction] = useState(null); // "add" or "subtract"
  const [selectedUser, setSelectedUser] = useState(null);
  const [amount, setAmount] = useState("");

  const updateWallet = () => {
    if (!amount || isNaN(amount) || amount <= 0) return;

    setUsers(
      users.map((u) =>
        u.id === selectedUser.id
          ? {
              ...u,
              balance:
                action === "add"
                  ? u.balance + Number(amount)
                  : Math.max(0, u.balance - Number(amount)),
            }
          : u
      )
    );

    setModalOpen(false);
    setAmount("");
    setAction(null);
    setSelectedUser(null);
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow">
      <h2 className="text-xl font-semibold mb-4">All Users Wallet</h2>

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
            <th className="p-3">Wallet Balance</th>
            <th className="p-3">Action</th>
          </tr>
        </thead>

        <tbody>
          {users
            .filter((u) => u.name.toLowerCase().includes(search.toLowerCase()))
            .map((user, i) => (
              <tr key={user.id} className={i % 2 === 0 ? "bg-gray-50" : ""}>
                <td className="p-3">{i + 1}</td>
                <td className="p-3 font-medium">{user.name}</td>
                <td className="p-3 font-semibold">₹{user.balance}</td>

                <td className="p-3 flex gap-3">
                  {/* Add Money */}
                  <button
                    onClick={() => {
                      setSelectedUser(user);
                      setAction("add");
                      setModalOpen(true);
                    }}
                    className="text-green-600 flex items-center gap-1"
                  >
                    <FiPlus size={20} />
                  </button>

                  {/* Subtract Money */}
                  <button
                    onClick={() => {
                      setSelectedUser(user);
                      setAction("subtract");
                      setModalOpen(true);
                    }}
                    className="text-red-600 flex items-center gap-1"
                  >
                    <FiMinus size={20} />
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>

      {/* UPDATE WALLET MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl w-80">
            <h3 className="text-lg font-semibold mb-4">
              {action === "add"
                ? `Add Money to ${selectedUser.name}`
                : `Subtract Money from ${selectedUser.name}`}
            </h3>

            <input
              type="number"
              placeholder="Enter amount"
              className="border w-full mb-3 px-3 py-1 rounded"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setModalOpen(false);
                  setAmount("");
                  setAction(null);
                  setSelectedUser(null);
                }}
                className="px-4 py-1 border rounded"
              >
                Cancel
              </button>

              <button
                onClick={updateWallet}
                className={`px-4 py-1 text-white rounded 
                  ${action === "add" ? "bg-green-600" : "bg-red-600"}`}
              >
                {action === "add" ? "Add" : "Subtract"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
