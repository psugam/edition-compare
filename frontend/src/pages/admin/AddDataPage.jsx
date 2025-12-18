import React, { useState } from "react";
import api from "../../utils/axiosInstance";
import { useAuth } from "../../context/AuthContext";
import TextForm from "../../components/TextForm";
import EditionForm from "../../components/EditionForm";

function AddDataPage() {
  const { token, user } = useAuth();
  const [dataType, setDataType] = useState("text");
  const [statusMessage, setStatusMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [formKey, setFormKey] = useState(0); // Used to reset forms on success

  const handleSubmit = async (formData) => {
    setStatusMessage("");
    setIsLoading(true);

    // Note: If baseURL in axiosInstance doesn't have /api, keep it here.
    const endpoint = dataType === "text" ? "/api/texts" : "/api/editions";

    try {
      const response = await api.post(endpoint, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setStatusMessage(
        `✅ Successfully added ${dataType}: ${
          formData.title || formData.editionTitle
        }`
      );
      setFormKey((prev) => prev + 1); // Incrementing key resets the child form component state
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to add data.";
      setStatusMessage(`❌ Error: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-8">
      <header className="mb-8">
        <h1 className="text-4xl font-serif font-bold text-gray-900">
          🏛️ Admin Data Entry
        </h1>
        <p className="text-gray-600">
          Logged in as:{" "}
          <span className="font-semibold text-indigo-600">
            {user?.username}
          </span>
        </p>
      </header>

      <div className="flex space-x-4 mb-8 border-b">
        <button
          onClick={() => {
            setDataType("text");
            setStatusMessage("");
          }}
          className={`pb-2 px-4 transition ${
            dataType === "text"
              ? "border-b-4 border-indigo-600 font-bold text-indigo-600"
              : "text-gray-500"
          }`}
        >
          New Text (Work)
        </button>
        <button
          onClick={() => {
            setDataType("edition");
            setStatusMessage("");
          }}
          className={`pb-2 px-4 transition ${
            dataType === "edition"
              ? "border-b-4 border-indigo-600 font-bold text-indigo-600"
              : "text-gray-500"
          }`}
        >
          New Edition
        </button>
      </div>

      {statusMessage && (
        <div
          className={`p-4 rounded-md mb-6 ${
            statusMessage.includes("✅")
              ? "bg-green-50 text-green-700 border border-green-200"
              : "bg-red-50 text-red-700 border border-red-200"
          }`}
        >
          {statusMessage}
        </div>
      )}

      <div className="bg-white shadow-xl rounded-2xl p-8 border border-gray-100">
        {dataType === "text" ? (
          <TextForm
            key={`text-${formKey}`}
            onSubmit={handleSubmit}
            isLoading={isLoading}
          />
        ) : (
          <EditionForm
            key={`edition-${formKey}`}
            onSubmit={handleSubmit}
            isLoading={isLoading}
          />
        )}
      </div>
    </div>
  );
}

export default AddDataPage;
