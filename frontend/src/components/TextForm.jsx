// src/components/TextForm.jsx
import React, { useState } from "react";

const initialTextData = {
  textId: "",
  title: "",
  authors: "", // Comma-separated string for simplicity
  originalLanguage: "",
  date: "",
  genre: "",
};

function TextForm({ onSubmit }) {
  const [formData, setFormData] = useState(initialTextData);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Convert comma-separated string back to array before submission
    const dataToSend = {
      ...formData,
      authors: formData.authors
        .split(",")
        .map((a) => a.trim())
        .filter((a) => a),
    };
    onSubmit(dataToSend);
    setFormData(initialTextData); // Clear form on submit
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="text-xl font-semibold border-b pb-2 mb-4">
        Core Text (Work) Details
      </h3>

      <FormInput
        label="Text ID (Unique Identifier)"
        name="textId"
        value={formData.textId}
        onChange={handleChange}
        required={true}
      />
      <FormInput
        label="Title"
        name="title"
        value={formData.title}
        onChange={handleChange}
        required={true}
      />
      <FormInput
        label="Authors (Comma Separated)"
        name="authors"
        value={formData.authors}
        onChange={handleChange}
        required={true}
      />
      <FormInput
        label="Original Language"
        name="originalLanguage"
        value={formData.originalLanguage}
        onChange={handleChange}
        required={true}
      />
      <FormInput
        label="Approximate Date"
        name="date"
        value={formData.date}
        onChange={handleChange}
        required={true}
      />
      <FormInput
        label="Genre"
        name="genre"
        value={formData.genre}
        onChange={handleChange}
        required={true}
      />

      <button
        type="submit"
        className="w-full bg-indigo-600 text-white p-3 rounded-lg hover:bg-indigo-700 transition"
      >
        Add New Text
      </button>
    </form>
  );
}

// Simple reusable input component
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

export default TextForm;
