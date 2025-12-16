// src/components/EditionForm.jsx
import React, { useState } from "react";

const initialEditionData = {
  editionId: "",
  textId: "",
  editionTitle: "",
  publishedDate: "",
  publisher: "",
  hasTranslation: false, // Must be explicitly set
  translationLanguages: "", // Comma-separated
};

function EditionForm({ onSubmit }) {
  const [formData, setFormData] = useState(initialEditionData);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Convert comma-separated string back to array before submission
    const dataToSend = {
      ...formData,
      translationLanguages: formData.translationLanguages
        .split(",")
        .map((l) => l.trim())
        .filter((l) => l),
      // Ensure other fields like editors are handled similarly if needed
    };
    onSubmit(dataToSend);
    setFormData(initialEditionData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="text-xl font-semibold border-b pb-2 mb-4">
        Edition (Publication) Details
      </h3>

      <FormInput
        label="Edition ID (Unique Identifier)"
        name="editionId"
        value={formData.editionId}
        onChange={handleChange}
        required={true}
      />
      <FormInput
        label="Parent Text ID (e.g., homer-iliad)"
        name="textId"
        value={formData.textId}
        onChange={handleChange}
        required={true}
      />
      <FormInput
        label="Edition Title"
        name="editionTitle"
        value={formData.editionTitle}
        onChange={handleChange}
        required={true}
      />
      <FormInput
        label="Publisher"
        name="publisher"
        value={formData.publisher}
        onChange={handleChange}
        required={true}
      />
      <FormInput
        label="Publication Year"
        name="publishedDate"
        value={formData.publishedDate}
        onChange={handleChange}
        required={true}
      />

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          name="hasTranslation"
          checked={formData.hasTranslation}
          onChange={handleChange}
          className="w-4 h-4"
        />
        <label className="text-sm font-medium text-gray-700">
          Includes Translation
        </label>
      </div>

      {formData.hasTranslation && (
        <FormInput
          label="Translation Languages (Comma Separated)"
          name="translationLanguages"
          value={formData.translationLanguages}
          onChange={handleChange}
        />
      )}

      <button
        type="submit"
        className="w-full bg-indigo-600 text-white p-3 rounded-lg hover:bg-indigo-700 transition"
      >
        Add New Edition
      </button>
    </form>
  );
}

// Reusing FormInput from TextForm
const FormInput = ({ label, name, value, onChange, required = false }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700">
      {label}
      {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type="text"
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
    />
  </div>
);

export default EditionForm;
