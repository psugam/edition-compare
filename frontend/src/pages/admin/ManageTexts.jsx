// src/pages/admin/ManageTexts.jsx
import React, { useState, useEffect } from "react";
import api from "../../utils/axiosInstance";
import { useAuth } from "../../context/AuthContext";
// ... other components (e.g., EditModal)

function ManageTextsPage() {
  const { token } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [texts, setTexts] = useState([]);
  const [isEditing, setIsEditing] = useState(null); // Text ID being edited

  // Fetches all texts (for search/display)
  const fetchTexts = async () => {
    // NOTE: For security, a real system should have a separate, protected search API
    // This currently uses the public GET /api/texts route
    try {
      const response = await api.get(`/api/texts?q=${searchTerm}`);
      setTexts(response.data);
    } catch (error) {
      console.error("Failed to fetch texts:", error);
    }
  };

  useEffect(() => {
    fetchTexts();
  }, []); // Initial load

  const handleDelete = async (textId) => {
    if (!window.confirm(`Are you sure you want to delete Text ID: ${textId}?`))
      return;

    try {
      await axios.delete(`/api/texts/${textId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchTexts(); // Refresh list
    } catch (error) {
      alert(
        `Deletion failed. Error: ${
          error.response?.data?.message || "Server error"
        }`
      );
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-8">
      <h2 className="text-3xl font-bold mb-6">Manage Texts (Admin)</h2>
      <div className="mb-4 flex">
        <input
          type="text"
          placeholder="Search by title or ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-grow p-2 border rounded-l"
        />
        <button
          onClick={fetchTexts}
          className="bg-indigo-600 text-white p-2 rounded-r hover:bg-indigo-700"
        >
          Search
        </button>
      </div>

      <table className="min-w-full bg-white border">
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Author</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {texts.map((text) => (
            <tr key={text.textId}>
              <td>{text.textId}</td>
              <td>{text.title}</td>
              <td>{text.authors.join(", ")}</td>
              <td>
                <button
                  onClick={() => setIsEditing(text.textId)}
                  className="text-blue-500 mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(text.textId)}
                  className="text-red-500"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Edit Modal Placeholder */}
      {isEditing && (
        <p className="mt-4 p-3 bg-yellow-100">
          Editing Text ID: {isEditing} (Modal component would go here)
        </p>
      )}
    </div>
  );
}

export default ManageTextsPage;
