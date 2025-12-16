// src/pages/admin/AddData.jsx
import React, { useState } from "react";
import api from "../../utils/axiosInstance";
import { useAuth } from "../../context/AuthContext";
import TextForm from "../../components/TextForm";
import EditionForm from "../../components/EditionForm";

function AddDataPage() {
  // Access authentication context for token and user role verification (though route is already protected)
  const { token, user } = useAuth();

  const [dataType, setDataType] = useState("text"); // 'text' or 'edition'
  const [statusMessage, setStatusMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Handles the form submission for both Text and Edition data.
   * @param {Object} data - The cleaned, structured data from the specific form.
   */
  const handleSubmit = async (data) => {
    setStatusMessage("");
    setIsLoading(true);

    const endpoint = dataType === "text" ? "/api/texts" : "/api/editions";

    // Log the data for debugging (optional)
    console.log(`Submitting data to ${endpoint}:`, data);

    try {
      const response = await api.post(endpoint, data, {
        headers: {
          // Send the JWT token in the Authorization header
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      // Success message
      const idKey = dataType === "text" ? "textId" : "editionId";
      setStatusMessage(
        `✅ Successfully added new ${dataType}: ID ${response.data[idKey]}`
      );

      // Note: In a real application, you might reset the form data here
      // by lifting the state up or using component keys.
    } catch (error) {
      console.error("Submission Error:", error.response || error);

      // Attempt to extract a meaningful error message from the response
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Failed to add data due to a server error.";

      setStatusMessage(`❌ Error: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8 font-sans">
      <h1 className="text-4xl font-serif font-bold text-gray-900 mb-2">
        🏛️ Add Classical Data
      </h1>
      <p className="text-gray-600 mb-6">Logged in as Admin: {user?.username}</p>

      {/* Selection Tabs */}
      <div className="mb-6 flex space-x-2 border-b border-gray-200">
        <button
          onClick={() => setDataType("text")}
          className={`px-4 py-2 text-lg transition duration-150 ${
            dataType === "text"
              ? "border-b-4 border-indigo-600 text-indigo-700 font-semibold"
              : "text-gray-600 hover:text-indigo-500"
          }`}
          disabled={isLoading}
        >
          Add New Text (Work)
        </button>
        <button
          onClick={() => setDataType("edition")}
          className={`px-4 py-2 text-lg transition duration-150 ${
            dataType === "edition"
              ? "border-b-4 border-indigo-600 text-indigo-700 font-semibold"
              : "text-gray-600 hover:text-indigo-500"
          }`}
          disabled={isLoading}
        >
          Add New Edition
        </button>
      </div>

      {/* Status Message Display */}
      {statusMessage && (
        <div
          className={`p-4 rounded-lg mb-6 ${
            statusMessage.startsWith("✅")
              ? "bg-green-100 text-green-800 border-l-4 border-green-500"
              : "bg-red-100 text-red-800 border-l-4 border-red-500"
          }`}
          role="alert"
        >
          {statusMessage}
        </div>
      )}

      {/* Loading Indicator */}
      {isLoading && (
        <div className="text-center py-4 text-indigo-600 font-medium">
          Submitting data... Please wait.
        </div>
      )}

      {/* Form Rendering */}
      <div className="border border-gray-200 p-6 rounded-xl shadow-md bg-white">
        {dataType === "text" ? (
          <TextForm onSubmit={handleSubmit} disabled={isLoading} />
        ) : (
          <EditionForm onSubmit={handleSubmit} disabled={isLoading} />
        )}
      </div>
    </div>
  );
}

export default AddDataPage;
