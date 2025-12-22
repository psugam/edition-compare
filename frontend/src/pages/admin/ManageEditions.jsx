import React, { useState } from "react";
import api from "../../utils/axiosInstance";
import { useAuth } from "../../context/AuthContext";
import EditEditionForm from "../../components/EditEditionForm";

function ManageEditionsPage() {
  const { token } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [editions, setEditions] = useState([]);
  const [editingEdition, setEditingEdition] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  const fetchEditions = async () => {
    if (!searchTerm) {
        setEditions([]);
        setHasSearched(true);
        return;
    }
    setLoading(true);
    setHasSearched(true);
    setError(null);
    try {
      const response = await api.get(`/api/editions?q=${searchTerm}`);
      setEditions(response.data);
    } catch (err) {
      console.error("Failed to fetch editions:", err);
      setError("Failed to load editions. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    fetchEditions();
  };

  const handleDelete = async (editionId, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}" (ID: ${editionId})?`))
      return;

    try {
      await api.delete(`/api/editions/${editionId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchEditions(); // Refresh list with current search
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Server error";
      alert(`Deletion failed. Error: ${errorMessage}`);
      console.error("Deletion error:", err);
    }
  };

  const handleUpdate = async (formData) => {
    setLoading(true);
    try {
        await api.put(`/api/editions/${formData.editionId}`, formData, {
            headers: { Authorization: `Bearer ${token}` },
        });
        setEditingEdition(null); // Close modal
        fetchEditions(); // Refresh list
    } catch (err) {
        const errorMessage = err.response?.data?.message || "Server error";
        alert(`Update failed. Error: ${errorMessage}`);
        console.error("Update error:", err);
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-8">
      <h2 className="text-3xl font-bold mb-6">Manage Editions (Admin)</h2>
      <div className="mb-4 flex">
        <input
          type="text"
          placeholder="Search by Edition ID, Text ID, or Title..."
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
                <th className="p-3">Edition ID</th>
                <th className="p-3">Title</th>
                <th className="p-3">Text ID</th>
                <th className="p-3">Actions</th>
            </tr>
            </thead>
            <tbody>
            {loading && (
                <tr><td colSpan="4" className="text-center p-4">Loading...</td></tr>
            )}
            {!loading && hasSearched && editions.length === 0 && (
                <tr><td colSpan="4" className="text-center p-4 text-gray-500">No editions found.</td></tr>
            )}
            {!loading && !hasSearched && (
                <tr><td colSpan="4" className="text-center p-4 text-gray-500">Enter a search term to find editions.</td></tr>
            )}
            {!loading && editions.map((edition) => (
                <tr key={edition.editionId} className="border-t hover:bg-gray-50">
                <td className="p-3 font-mono text-sm">{edition.editionId}</td>
                <td className="p-3 font-semibold">{edition.editionTitle}</td>
                <td className="p-3 font-mono text-sm">{edition.textId}</td>
                <td className="p-3">
                    <button
                        onClick={() => setEditingEdition(edition)}
                        className="bg-blue-500 text-white px-3 py-1 rounded-md text-sm font-bold hover:bg-blue-600 mr-2"
                    >
                    Edit
                    </button>
                    <button
                        onClick={() => handleDelete(edition.editionId, edition.editionTitle)}
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

      {editingEdition && (
        <EditEditionForm 
            initialData={editingEdition}
            onSubmit={handleUpdate}
            onCancel={() => setEditingEdition(null)}
            isLoading={loading}
        />
      )}
    </div>
  );
}

export default ManageEditionsPage;
