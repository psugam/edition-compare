import React, { useState, useEffect } from "react";
import api from "../../utils/axiosInstance";
import { useAuth } from "../../context/AuthContext";
import EditTextForm from "../../components/EditTextForm"; // Import the new form

function ManageTextsPage() {
  const { token } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [texts, setTexts] = useState([]);
  const [editingText, setEditingText] = useState(null); // Will hold the text object to edit
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  const fetchTexts = async () => {
    if (!searchTerm) {
        setTexts([]);
        setHasSearched(true);
        return;
    }
    setLoading(true);
    setHasSearched(true);
    try {
      // The backend now supports searching via a query parameter 'q'
      const response = await api.get(`/api/texts?q=${searchTerm}`);
      
      // The API returns an object with a 'texts' property
      setTexts(response.data.texts);
      setError(null);
    } catch (error) {
      console.error("Failed to fetch texts:", error);
      setError("Failed to load texts. Please try again.");
    } finally {
        setLoading(false);
    }
  };

  const handleSearch = () => {
      fetchTexts();
  }

  const handleDelete = async (textId, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}" (ID: ${textId})? This is irreversible.`))
      return;

    try {
      await api.delete(`/api/texts/${textId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Re-fetch the current search results after deletion
      fetchTexts(); 
    } catch (error) {
        const errorMessage = error.response?.data?.message || "Server error";
        alert(`Deletion failed. Error: ${errorMessage}`);
        console.error("Deletion error:", error);
    }
  };

  const handleUpdate = async (formData) => {
    setLoading(true);
    try {
        await api.put(`/api/texts/${formData.textId}`, formData, {
            headers: { Authorization: `Bearer ${token}` },
        });
        setEditingText(null); // Close modal
        fetchTexts(); // Refresh list with current search
    } catch (error) {
        const errorMessage = error.response?.data?.message || "Server error";
        alert(`Update failed. Error: ${errorMessage}`);
        console.error("Update error:", error);
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-8">
      <h2 className="text-3xl font-bold mb-6">Manage Texts (Admin)</h2>
      <div className="mb-4 flex">
        <input
          type="text"
          placeholder="Search by title, ID, or author..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') handleSearch(); }}
          className="flex-grow p-2 border rounded-l"
        />
        <button
          onClick={handleSearch}
          className="bg-indigo-600 text-white px-6 py-2 rounded-r hover:bg-indigo-700"
        >
          {loading ? 'Searching...' : 'Search'}
        </button>
      </div>

      {error && <p className="text-red-500 py-4">{error}</p>}
      
      <div className="overflow-x-auto shadow-lg rounded-lg">
        <table className="min-w-full bg-white border">
            <thead className="bg-gray-100">
            <tr className="text-left">
                <th className="p-3">ID</th>
                <th className="p-3">Title</th>
                <th className="p-3">Author(s)</th>
                <th className="p-3">Actions</th>
            </tr>
            </thead>
            <tbody>
            {loading && (
                <tr>
                    <td colSpan="4" className="text-center p-4">Loading...</td>
                </tr>
            )}
            {!loading && hasSearched && texts.length === 0 && (
                <tr>
                    <td colSpan="4" className="text-center p-4 text-gray-500">No texts found matching your search.</td>
                </tr>
            )}
            {!loading && !hasSearched && (
                <tr>
                    <td colSpan="4" className="text-center p-4 text-gray-500">Please enter a search term and click Search to begin.</td>
                </tr>
            )}
            {!loading && texts.map((text) => (
                <tr key={text.textId} className="border-t hover:bg-gray-50">
                <td className="p-3 font-mono text-sm">{text.textId}</td>
                <td className="p-3 font-semibold">{text.title}</td>
                <td className="p-3 italic text-gray-600">{text.authors ? text.authors.join(", ") : 'N/A'}</td>
                <td className="p-3">
                    <button
                        onClick={() => setEditingText(text)}
                        className="bg-blue-500 text-white px-3 py-1 rounded-md text-sm font-bold hover:bg-blue-600 mr-2"
                    >
                    Edit
                    </button>
                    <button
                        onClick={() => handleDelete(text.textId, text.title)}
                        className="bg-red-500 text-white px-3 py-1 rounded-md text-sm font-bold hover:bg-red-600"
                    >
                    Delete
                    </button>
                </td>
                </tr>
            ))}
            </tbody>
        </table>
      </div>

      {editingText && (
        <EditTextForm 
            initialData={editingText}
            onSubmit={handleUpdate}
            onCancel={() => setEditingText(null)}
            isLoading={loading}
        />
      )}
    </div>
  );
}

export default ManageTextsPage;
