import React, { useState, useEffect } from "react";

const emptyState = {
    editionId: "",
    textId: "",
    editionTitle: "",
    editionSubtitle: "",
    seriesName: "",
    seriesNumber: "",
    volumeNumber: null,
    totalVolumes: null,
    publishedDate: "",
    newEditionsDate: [],
    pageCount: null,
    editors: [],
    translators: [],
    contributors: [],
    manuscripts: [],
    primaryManuscripts: [],
    hasOriginalText: false,
    hasTranslation: false,
    translationLanguages: [],
    translationType: null,
    hasFacingTranslation: false,
    hasCommentary: false,
    commentaryType: "",
    commentaryLanguage: "",
    commentaryLength: null,
    hasApparatus: false,
    apparatusType: "",
    apparatusLocation: "",
    hasNotes: false,
    notesType: "",
    hasGlossary: false,
    hasIntroduction: false,
    hasBibliography: false,
    completeEdition: true,
    partsIncluded: "",
    illustrations: false,
    maps: false,
    lineNumbering: false,
    lineNumberingInterval: null,
    paragraphNumbering: false,
    columnLayout: null,
    publisher: "",
    publisherLink: "",
    isbn: "",
    publicDomain: false,
    publicDomainResource: [],
    copyright: "",
    license: "",
    openAccess: false,
    inPrint: false,
    reviews: [],
    distinguishingFeatures: [],
    remarks: "",
    verifiedByAdmin: false,
    dataQuality: null,
};


const EditEditionForm = ({ onSubmit, isLoading, initialData, onCancel }) => {
  const [formData, setFormData] = useState(emptyState);

  useEffect(() => {
    if (initialData) {
        const mergedData = { ...emptyState, ...initialData };
        // Ensure array fields are not null/undefined to prevent map errors
        Object.keys(emptyState).forEach(key => {
            if (Array.isArray(emptyState[key]) && !mergedData[key]) {
                mergedData[key] = [];
            }
        });
        setFormData(mergedData);
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    let finalValue = type === "checkbox" ? checked : value;
    
    if ((type === 'number' || name === 'pageCount' || name === 'lineNumberingInterval' || name === 'volumeNumber' || name === 'totalVolumes') && value === '') {
        finalValue = null;
    } else if (type === 'number') {
        finalValue = Number(value);
    }

    if (type !== "checkbox" && value === "" && name.endsWith('Type') || name.endsWith('Length') || name.endsWith('Layout')) {
        finalValue = null;
    }

    setFormData((prev) => ({ ...prev, [name]: finalValue, }));
  };

  const handleArrayChange = (index, value, field) => {
    const newArr = [...(formData[field] || [])];
    newArr[index] = value;
    setFormData({ ...formData, [field]: newArr });
  };

  const addArrayField = (field) => setFormData({ ...formData, [field]: [...(formData[field] || []), ""] });

  const removeArrayField = (field, index) => setFormData({ ...formData, [field]: formData[field].filter((_, i) => i !== index), });

  const handleObjectArrayChange = (index, field, key, value) => {
    const newArr = [...(formData[field] || [])];
    newArr[index][key] = value;
    setFormData({ ...formData, [field]: newArr });
  };

  const addObjectArrayField = (field, template) => setFormData({ ...formData, [field]: [...(formData[field] || []), template] });

  return (
     <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
        <form
            onSubmit={(e) => {
                e.preventDefault();
                onSubmit(formData);
            }}
            className="max-w-6xl w-full mx-auto space-y-8 text-sm p-6 bg-white shadow-2xl rounded-lg overflow-y-auto max-h-[95vh]"
        >
            <div className="flex justify-between items-center border-b pb-3">
                <h2 className="text-2xl font-bold text-emerald-800">Edit Edition: <span className="font-mono">{formData.editionId}</span></h2>
                <button type="button" onClick={onCancel} className="text-3xl text-gray-500 hover:text-gray-800">&times;</button>
            </div>

            {/* Form content from EditionForm, adapted for editing */}
            {/* SECTION 1: IDENTIFICATION */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <section className="space-y-4">
                    <h3 className="font-bold text-emerald-700 uppercase">Identification</h3>
                    <label className="block"> Edition ID* <input name="editionId" required value={formData.editionId} readOnly className="w-full p-2 border rounded mt-1 bg-gray-100"/> </label>
                    <label className="block"> Text (Work) ID* <input name="textId" required value={formData.textId} readOnly className="w-full p-2 border rounded mt-1 bg-gray-100"/> </label>
                    <label className="block"> Edition Title* <input name="editionTitle" required value={formData.editionTitle} onChange={handleChange} className="w-full p-2 border rounded mt-1"/> </label>
                    <label className="block"> Subtitle <input name="editionSubtitle" value={formData.editionSubtitle || ''} onChange={handleChange} className="w-full p-2 border rounded mt-1"/> </label>
                </section>

                {/* SECTION 2: SERIES & PUBLICATION */}
                <section className="space-y-4">
                    <h3 className="font-bold text-emerald-700 uppercase">Series & Publication</h3>
                    <div className="grid grid-cols-2 gap-2">
                        <label> Series Name <input name="seriesName" value={formData.seriesName || ''} onChange={handleChange} className="w-full p-2 border rounded"/> </label>
                        <label> Series # <input name="seriesNumber" value={formData.seriesNumber || ''} onChange={handleChange} className="w-full p-2 border rounded"/> </label>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <label> Vol # <input type="number" name="volumeNumber" value={formData.volumeNumber || ''} onChange={handleChange} className="w-full p-2 border rounded"/> </label>
                        <label> Total Vols <input type="number" name="totalVolumes" value={formData.totalVolumes || ''} onChange={handleChange} className="w-full p-2 border rounded"/> </label>
                    </div>
                    <label className="block"> Publisher* <input name="publisher" required value={formData.publisher} onChange={handleChange} className="w-full p-2 border rounded mt-1"/> </label>
                    <label className="block"> Pub. Date* <input name="publishedDate" required value={formData.publishedDate} onChange={handleChange} className="w-full p-2 border rounded mt-1"/> </label>
                    <label className="block"> ISBN <input name="isbn" value={formData.isbn || ''} onChange={handleChange} className="w-full p-2 border rounded mt-1"/> </label>
                </section>
                
                {/* SECTION 3: MORE DETAILS */}
                 <section className="space-y-4">
                    <h3 className="font-bold text-emerald-700 uppercase">More Details</h3>
                    <label className="block"> Page Count <input type="number" name="pageCount" value={formData.pageCount || ''} onChange={handleChange} className="w-full p-2 border rounded mt-1"/> </label>
                    <label className="block"> Publisher Link <input name="publisherLink" value={formData.publisherLink || ''} onChange={handleChange} className="w-full p-2 border rounded mt-1" placeholder="https://publisher.com"/> </label>
                    <label className="block"> Copyright <input name="copyright" value={formData.copyright || ''} onChange={handleChange} className="w-full p-2 border rounded mt-1"/> </label>
                    <label className="block"> Parts Included <input name="partsIncluded" value={formData.partsIncluded || ''} onChange={handleChange} className="w-full p-2 border rounded mt-1"/> </label>
                </section>
            </div>
            
            <hr/>

            {/* SECTION 4: CONTRIBUTORS */}
            <section className="space-y-4">
                <h3 className="font-bold text-emerald-700 uppercase tracking-wider border-b pb-1">Contributors</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {["editors", "translators", "contributors"].map((field) => (
                    <div key={field} className="space-y-1">
                    <span className="font-medium capitalize">{field}</span>
                    {(formData[field] || []).map((val, i) => (
                        <div key={i} className="flex gap-1">
                        <input value={val} onChange={(e) => handleArrayChange(i, e.target.value, field)} className="flex-1 p-1 border rounded"/>
                        <button type="button" onClick={() => removeArrayField(field, i)} className="text-red-500 px-1">✕</button>
                        </div>
                    ))}
                    <button type="button" onClick={() => addArrayField(field)} className="text-xs text-blue-600 font-bold">+ Add {field}</button>
                    </div>
                ))}
                </div>
            </section>

            <hr/>

            {/* SECTION 5: FEATURES & CONTENT */}
            <section className="space-y-6">
                <h3 className="font-bold text-emerald-700 uppercase tracking-wider border-b pb-1">Textual Features & Content</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 bg-emerald-50 p-4 rounded-lg shadow-inner">
                    {Object.keys(emptyState).filter(k => typeof emptyState[k] === 'boolean').map((check) => (
                    <label key={check} className="flex items-center space-x-2">
                        <input type="checkbox" name={check} checked={formData[check]} onChange={handleChange} className="h-4 w-4"/>
                        <span className="capitalize">{check.replace("has", "").replace(/([A-Z])/g, " $1")}</span>
                    </label>
                    ))}
                </div>
                {/* ... other specific inputs for non-boolean features ... */}
            </section>
            
            {/* JSON PREVIEW & SUBMIT */}
            <section className="mt-8">
                <h3 className="font-bold text-gray-700 uppercase tracking-wider mb-2">Data Preview (JSON)</h3>
                <pre className="bg-gray-900 text-emerald-400 p-4 rounded-lg overflow-x-auto text-xs max-h-60">{JSON.stringify(formData, null, 2)}</pre>
            </section>

            <div className="flex gap-4 pt-4 border-t">
                <button type="button" onClick={onCancel} className="w-1/3 bg-gray-500 text-white py-3 rounded-xl font-bold text-lg hover:bg-gray-600">Cancel</button>
                <button type="submit" disabled={isLoading} className="w-2/3 bg-emerald-700 text-white py-3 rounded-xl font-bold text-lg hover:bg-emerald-800 shadow-lg">{isLoading ? "Updating..." : "Update Edition Entry"}</button>
            </div>
        </form>
    </div>
  );
};

export default EditEditionForm;