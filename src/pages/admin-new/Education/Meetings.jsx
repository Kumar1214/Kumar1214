import { useState, useEffect } from "react";
import { FiTrash2, FiVideo, FiEdit2, FiPlus } from "react-icons/fi";
import api, { contentService } from "../../../services/api";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

export default function Meetings() {
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingMeeting, setEditingMeeting] = useState(null);
  const [meetings, setMeetings] = useState([]);
  const [courses, setCourses] = useState([]);

  /* ------------------------ FETCH & API ------------------------- */
  const fetchData = async () => {
    try {
      const [meetingsRes, coursesRes] = await Promise.all([
        api.get('/education/meetings'),
        contentService.getCourses({ limit: 100 })
      ]);

      if (meetingsRes.data.success) {
        setMeetings(meetingsRes.data.data);
      }

      if (coursesRes.data.success) {
        setCourses(coursesRes.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch data", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    const data = {
      user: form.get("user"),
      meetingId: form.get("meetingId"),
      ownerId: form.get("ownerId"),
      topic: form.get("topic"),
      time: form.get("time"),
      course: form.get("course"),
    };

    const promise = editingMeeting
      ? api.put(`/education/meetings/${editingMeeting.id}`, data)
      : api.post('/education/meetings', data);

    toast.promise(promise, {
      loading: editingMeeting ? 'Updating meeting...' : 'Adding meeting...',
      success: () => {
        fetchData();
        setShowForm(false);
        setEditingMeeting(null);
        return editingMeeting ? "Meeting updated!" : "Meeting added!";
      },
      error: (err) => {
        console.error('Error saving meeting:', err);
        return "Failed to save meeting";
      }
    });
  };

  const deleteMeeting = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      const promise = api.delete(`/education/meetings/${id}`);
      toast.promise(promise, {
        loading: 'Deleting meeting...',
        success: () => {
          fetchData();
          return "Meeting deleted";
        },
        error: "Failed to delete meeting"
      });
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow">
      {/* ... (Header code unchanged) ... */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Manage Google Meetings</h2>
        <button
          onClick={() => {
            setEditingMeeting(null);
            setShowForm(true);
          }}
          className="px-4 py-2 bg-[#0c2d50] text-white rounded flex items-center gap-2"
        >
          <FiPlus /> Add Meeting
        </button>
      </div>

      {/* Top Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-2">
          <span>Show</span>
          <select className="border rounded px-2 py-1">
            <option>10</option>
            <option>25</option>
            <option>50</option>
          </select>
          <span>entries</span>
        </div>

        <input
          type="text"
          placeholder="Search..."
          className="border rounded px-3 py-1"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-3">#</th>
              <th className="p-3">User</th>
              <th className="p-3">Meeting</th>
              <th className="p-3">Join</th>
              <th className="p-3">Edit</th>
              <th className="p-3">Delete</th>
            </tr>
          </thead>

          <tbody>
            {meetings
              .filter((m) =>
                m.user.toLowerCase().includes(search.toLowerCase())
              )
              .map((m, index) => (
                <tr key={m.id} className={index % 2 === 0 ? "bg-gray-50" : ""}>
                  <td className="p-3">{index + 1}</td>
                  <td className="p-3 font-medium">{m.user}</td>

                  <td className="p-3 text-sm leading-6">
                    <p>
                      <strong>Meeting ID:</strong> {m.meetingId}
                    </p>
                    <p>
                      <strong>Owner ID:</strong> {m.ownerId || "—"}
                    </p>
                    <p>
                      <strong>Meeting Topic:</strong> {m.topic}
                    </p>
                    <p>
                      <strong>Time:</strong> {m.time}
                    </p>
                    <p>
                      <strong>Meeting on Course:</strong> {m.course}
                    </p>
                  </td>

                  <td className="p-3">
                    <a
                      href={`https://meet.google.com/${m.meetingId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1 bg-[#0c2d50] text-white rounded flex items-center gap-2 w-max"
                    >
                      <FiVideo /> Join
                    </a>
                  </td>

                  {/* EDIT */}
                  <td className="p-3">
                    <button
                      onClick={() => {
                        setEditingMeeting(m);
                        setShowForm(true);
                      }}
                      className="text-blue-600 hover:text-blue-800 text-xl"
                    >
                      <FiEdit2 />
                    </button>
                  </td>

                  {/* DELETE */}
                  <td className="p-3">
                    <button
                      onClick={() => deleteMeeting(m.id)}
                      className="text-red-600 hover:text-red-800 text-xl"
                    >
                      <FiTrash2 />
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between mt-4 text-sm text-gray-600">
        <p>
          Showing 1 to {meetings.length} of {meetings.length} entries
        </p>
        <div className="flex gap-2">
          <button className="px-3 py-1 border rounded">Previous</button>
          <button className="px-3 py-1 border rounded bg-[#0c2d50] text-white">
            1
          </button>
          <button className="px-3 py-1 border rounded">Next</button>
        </div>
      </div>

      {/* ------------------------ ADD/EDIT FORM MODAL ------------------------ */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <form
            onSubmit={handleSubmit}
            className="bg-white p-6 rounded-xl w-96 shadow space-y-4"
          >
            <h3 className="text-lg font-semibold">
              {editingMeeting ? "Edit Meeting" : "Add Meeting"}
            </h3>

            <input
              name="user"
              defaultValue={editingMeeting?.user}
              required
              placeholder="User"
              className="border px-3 py-2 w-full rounded"
            />

            <input
              name="meetingId"
              defaultValue={editingMeeting?.meetingId}
              required
              placeholder="Meeting ID"
              className="border px-3 py-2 w-full rounded"
            />

            <input
              name="ownerId"
              defaultValue={editingMeeting?.ownerId}
              placeholder="Owner ID"
              className="border px-3 py-2 w-full rounded"
            />

            <input
              name="topic"
              defaultValue={editingMeeting?.topic}
              required
              placeholder="Meeting Topic"
              className="border px-3 py-2 w-full rounded"
            />

            <input
              name="time"
              defaultValue={editingMeeting?.time}
              required
              placeholder="Time (DD-MM-YYYY | HH:MM:SS)"
              className="border px-3 py-2 w-full rounded"
            />

            <select
              name="course"
              defaultValue={editingMeeting?.course || ""}
              required
              className="border px-3 py-2 w-full rounded"
            >
              <option value="">Select Course</option>
              {courses.map(course => (
                <option key={course.id} value={course.title}>{course.title}</option>
              ))}
            </select>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setShowForm(false);
                  setEditingMeeting(null);
                }}
                type="button"
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="px-4 py-2 bg-[#0c2d50] text-white rounded"
              >
                {editingMeeting ? "Save Changes" : "Add Meeting"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
