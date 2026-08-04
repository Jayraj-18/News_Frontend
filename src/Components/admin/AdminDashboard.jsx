import React, { useState, useRef } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useNews } from '../../context/NewsContext';

export const AdminDashboard = ({ onLogout }) => {
  const { t } = useLanguage();
  const { articles, addArticle, updateArticle, deleteArticle } = useNews();

  const fileInputRef = useRef(null);
  const multiFileInputRef = useRef(null);

  // --- Initial Blank Form State ---
  const initialFormState = {
    titleMr: '',
    titleEn: '',
    summaryMr: '',
    category: 'politics',
    isBreaking: false,
    isHero: false,
    contentMr: '',
    tags: '',
    publishDate: '',
    scheduledTime: '',
    status: 'draft'
  };

  // --- Form State ---
  const [formData, setFormData] = useState(initialFormState);

  // --- Image Management State ---
  const [featuredImage, setFeaturedImage] = useState(null); // Primary Lead Image
  const [galleryImages, setGalleryImages] = useState([]);  // Multiple Story Images
  const [activeCropImage, setActiveCropImage] = useState(null); // Image currently being cropped
  const [cropAspectRatio, setCropAspectRatio] = useState('16:9'); // Aspect ratio choice
  const [isDragOver, setIsDragOver] = useState(false);

  // --- Generic Form Field Handler ---
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // --- Single Primary Image Processing ---
  const processFeaturedFile = (file) => {
    if (!file || !file.type.startsWith('image/')) {
      alert('कृपया वैध प्रतिमा फाईल निवडा (Please select a valid image file)');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setFeaturedImage({
        id: Date.now(),
        url: reader.result,
        name: file.name,
        size: (file.size / 1024).toFixed(1) + ' KB',
        alt: '',
        caption: '',
        credit: ''
      });
    };
    reader.readAsDataURL(file);
  };

  const handleFeaturedFileSelect = (e) => {
    const file = e.target.files[0];
    processFeaturedFile(file);
  };

  // --- Drag & Drop Handlers ---
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    processFeaturedFile(file);
  };

  // --- Multiple Gallery Images Processing ---
  const handleMultiImageUpload = (e) => {
    const files = Array.from(e.target.files);

    files.forEach((file) => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = () => {
          setGalleryImages((prev) => [
            ...prev,
            {
              id: Date.now() + Math.random(),
              url: reader.result,
              name: file.name,
              caption: '',
              credit: ''
            }
          ]);
        };
        reader.readAsDataURL(file);
      }
    });
  };

  // --- Image Metadata Handlers ---
  const updateFeaturedMeta = (field, value) => {
    setFeaturedImage((prev) => ({ ...prev, [field]: value }));
  };

  const updateGalleryMeta = (id, field, value) => {
    setGalleryImages((prev) =>
      prev.map((img) => (img.id === id ? { ...img, [field]: value } : img))
    );
  };

  const removeGalleryImage = (id) => {
    setGalleryImages((prev) => prev.filter((img) => img.id !== id));
  };

  // --- Reset Form Helper ---
  const resetForm = () => {
    setFormData(initialFormState);
    setFeaturedImage(null);
    setGalleryImages([]);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (multiFileInputRef.current) multiFileInputRef.current.value = '';
  };

  // --- Submit Handler ---
  const handleSubmit = (statusType) => {
    if (!formData.titleMr) {
      alert('कृपया बातमीचे शीर्षक प्रविष्ट करा (Please enter article title)');
      return;
    }

    const id = Date.now();
    const slug = formData.titleEn
      ? formData.titleEn.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
      : `article-${id}`;

    const defaultImage = {
      url: "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=800&q=80",
      alt: formData.titleMr,
      caption: "",
      credit: ""
    };

    const imgObj = featuredImage || defaultImage;

    const payload = {
      id: id,
      slug: slug,
      title: {
        mr: formData.titleMr,
        en: formData.titleEn || formData.titleMr
      },
      titleMr: formData.titleMr,
      titleEn: formData.titleEn,
      summary: {
        mr: formData.summaryMr || formData.titleMr,
        en: formData.summaryMr || formData.titleMr
      },
      summaryMr: formData.summaryMr,
      content: {
        mr: formData.contentMr,
        en: formData.contentMr
      },
      contentMr: formData.contentMr,
      category: formData.category || 'politics',
      isBreaking: Boolean(formData.isBreaking),
      isHero: Boolean(formData.isHero),
      featuredImage: imgObj,
      image: imgObj,
      galleryImages: galleryImages || [],
      tags: formData.tags ? formData.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
      author: {
        name: "महाराष्ट्र न्यूज 24",
        role: "संपादक टीम",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
      },
      publishedAt: formData.scheduledTime ? new Date(formData.scheduledTime).toISOString() : new Date().toISOString(),
      createdAt: new Date().toISOString(),
      status: statusType,
      readingTime: Math.max(1, Math.ceil((formData.contentMr || '').length / 500))
    };

    // Dispatch directly to Global News Context
    addArticle(payload);

    alert(`बातमी ${statusType === 'published' ? 'प्रकाशित' : 'ड्राफ्ट मध्ये जतन'} झाली!`);

    // Reset fields for the next submission
    resetForm();
  };

  // Dynamic aspect ratio class mapping for modal preview
  const getAspectRatioClass = (ratio) => {
    switch (ratio) {
      case '4:3':
        return 'aspect-[4/3]';
      case '1:1':
        return 'aspect-square';
      case '16:9':
      default:
        return 'aspect-video';
    }
  };

  return (
    <div className="container mx-auto mt-6 mb-16 px-4">
      {/* HEADER */}
      <header className="border-b-2 border-red-600 pb-4 mb-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              पत्रकार सीएमएस पॅनेल (Journalist Publishing CMS)
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              नवीन बातमी तयार करा, फोटो अपलोड करा आणि प्रकाशित करा.
            </p>
          </div>
          {onLogout && (
            <button
              type="button"
              className="px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 font-semibold rounded-md transition-colors"
              onClick={() => {
                if (window.confirm('लॉगआउट करायचे आहे का? (Confirm logout?)')) {
                  onLogout();
                }
              }}
            >
              🚪 लॉगआउट (Logout)
            </button>
          )}
        </div>
      </header>

      {/* MAIN FORM GRID */}
      <form className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6" onSubmit={(e) => e.preventDefault()}>
        {/* LEFT COLUMN: Article Content */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-5 rounded-lg shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2 mb-4">
              १. बातमीची माहिती (Article Info)
            </h2>

            <div className="flex flex-col mb-4">
              <label htmlFor="titleMr" className="font-semibold text-sm mb-1 text-gray-800 dark:text-gray-200">
                बातमीचे शीर्षक (मराठी) *
              </label>
              <input
                type="text"
                id="titleMr"
                name="titleMr"
                placeholder="उदा. मुंबई-पुणे एक्सप्रेसवेवर नवीन लेन खुली"
                value={formData.titleMr}
                onChange={handleInputChange}
                required
                className="p-2.5 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex flex-col mb-4">
              <label htmlFor="titleEn" className="font-semibold text-sm mb-1 text-gray-800 dark:text-gray-200">
                English Headline (Secondary)
              </label>
              <input
                type="text"
                id="titleEn"
                name="titleEn"
                placeholder="e.g. New Lane Opened on Mumbai-Pune Expressway"
                value={formData.titleEn}
                onChange={handleInputChange}
                className="p-2.5 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex flex-col mb-4">
              <label htmlFor="summaryMr" className="font-semibold text-sm mb-1 text-gray-800 dark:text-gray-200">
                थोडक्यात माहिती (Summary / Lead Paragraph)
              </label>
              <textarea
                id="summaryMr"
                name="summaryMr"
                rows="3"
                placeholder="बातमीचा मुख्य गोषवारा येथे लिहा..."
                value={formData.summaryMr}
                onChange={handleInputChange}
                className="p-2.5 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex flex-col mb-4">
              <label htmlFor="contentMr" className="font-semibold text-sm mb-1 text-gray-800 dark:text-gray-200">
                सविस्तर बातमी (Full Content - HTML Supported) *
              </label>
              <textarea
                id="contentMr"
                name="contentMr"
                rows="12"
                placeholder="बातमीचा संपूर्ण मजकूर लिहा..."
                value={formData.contentMr}
                onChange={handleInputChange}
                required
                className="p-2.5 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* GALLERY IMAGE UPLOADER */}
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-5 rounded-lg shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2 mb-2">
              २. फोटो गॅलरी (Multiple Images Upload)
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
              या बातमीशी संबंधित अधिक फोटो किंवा गॅलरी अपलोड करा.
            </p>

            <input
              type="file"
              ref={multiFileInputRef}
              multiple
              accept="image/*"
              onChange={handleMultiImageUpload}
              className="hidden"
            />

            <button
              type="button"
              className="w-full py-2.5 border border-dashed border-blue-600 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-gray-700 rounded-md font-semibold transition-colors"
              onClick={() => multiFileInputRef.current.click()}
            >
              📁 अधिक फोटो निवडा (Upload Gallery Images)
            </button>

            {galleryImages.length > 0 && (
              <div className="grid grid-cols-[repeat(auto-fill,minmax(120px,1fr))] gap-3 mt-4">
                {galleryImages.map((img) => (
                  <div key={img.id} className="relative border border-gray-300 dark:border-gray-600 rounded-md p-1.5 bg-white dark:bg-gray-900">
                    <img src={img.url} alt={img.name} className="w-full h-20 object-cover rounded" />
                    <button
                      type="button"
                      className="absolute top-1 right-1 bg-red-600 text-white w-5 h-5 rounded-full text-xs flex items-center justify-center hover:bg-red-700"
                      onClick={() => removeGalleryImage(img.id)}
                      title="Remove image"
                    >
                      ✕
                    </button>
                    <input
                      type="text"
                      placeholder="शीर्षक / कॅप्शन"
                      value={img.caption}
                      onChange={(e) => updateGalleryMeta(img.id, 'caption', e.target.value)}
                      className="w-full text-xs mt-1.5 p-1 border border-gray-300 dark:border-gray-700 rounded bg-transparent text-gray-900 dark:text-white"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Featured Image, Category & Publishing Options */}
        <aside className="space-y-6">
          {/* FEATURED IMAGE UPLOADER */}
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-5 rounded-lg shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2 mb-4">
              मुख्य फोटो (Featured Image)
            </h2>

            {!featuredImage ? (
              <div
                className={`border-2 border-dashed border-blue-600 rounded-lg p-6 text-center cursor-pointer transition-colors ${
                  isDragOver ? 'bg-sky-100 border-sky-600' : 'bg-gray-50 dark:bg-gray-900 hover:bg-gray-100'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current.click()}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleFeaturedFileSelect}
                  className="hidden"
                />
                <span className="text-4xl block mb-2">📷</span>
                <p className="text-sm text-gray-800 dark:text-gray-200 mb-1">
                  <strong>फोटो येथे ड्रॅग करा</strong> किंवा फाईल निवडण्यासाठी क्लिक करा
                </p>
                <small className="text-xs text-gray-400">PNG, JPG, WebP (Max 5MB)</small>
              </div>
            ) : (
              <div>
                <div className="relative">
                  <img src={featuredImage.url} alt="Featured Preview" className="w-full rounded-md object-cover" />
                  <button
                    type="button"
                    className="w-full py-1.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-xs font-semibold rounded mt-2 mb-4 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200"
                    onClick={() => setActiveCropImage(featuredImage)}
                  >
                    ✂️ क्रॉप / अॅस्पेक्ट गुणोत्तर (Crop & Ratio)
                  </button>
                </div>

                <div className="space-y-3">
                  <div className="flex flex-col">
                    <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Alt Text (SEO साठी):</label>
                    <input
                      type="text"
                      placeholder="प्रतिमेचे वर्णन"
                      value={featuredImage.alt}
                      onChange={(e) => updateFeaturedMeta('alt', e.target.value)}
                      className="p-2 border border-gray-300 dark:border-gray-700 rounded text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                    />
                  </div>

                  <div className="flex flex-col">
                    <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">कॅप्शन (Caption):</label>
                    <input
                      type="text"
                      placeholder="फोटोखाली दाखवण्यासाठी मजकूर"
                      value={featuredImage.caption}
                      onChange={(e) => updateFeaturedMeta('caption', e.target.value)}
                      className="p-2 border border-gray-300 dark:border-gray-700 rounded text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                    />
                  </div>

                  <div className="flex flex-col">
                    <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">छायाचित्रकार श्रेय (Credit):</label>
                    <input
                      type="text"
                      placeholder="उदा. फोटो: विशेष प्रतिनिधी / PTI"
                      value={featuredImage.credit}
                      onChange={(e) => updateFeaturedMeta('credit', e.target.value)}
                      className="p-2 border border-gray-300 dark:border-gray-700 rounded text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                    />
                  </div>

                  <button
                    type="button"
                    className="text-red-600 hover:text-red-700 text-xs font-semibold mt-2 block bg-transparent border-none p-0 cursor-pointer"
                    onClick={() => setFeaturedImage(null)}
                  >
                    🗑️ फोटो बदला / हटवा (Remove Image)
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* CATEGORY & METADATA */}
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-5 rounded-lg shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2 mb-4">
              वर्ग आणि प्रकार (Category & Settings)
            </h2>

            <div className="flex flex-col mb-4">
              <label htmlFor="category" className="font-semibold text-sm mb-1 text-gray-800 dark:text-gray-200">
                वर्ग (Category)
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="p-2.5 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="politics">राजकारण (Politics)</option>
                <option value="agri">शेती (Agriculture)</option>
                <option value="crime">गुन्हेगारी (Crime)</option>
                <option value="education">शिक्षण (Education)</option>
                <option value="sports">क्रीडा (Sports)</option>
                <option value="business">व्यवसाय (Business)</option>
                <option value="tech">तंत्रज्ञान (Technology)</option>
                <option value="health">आरोग्य (Health)</option>
                <option value="entertainment">मनोरंजन (Entertainment)</option>
                <option value="local">स्थानिक (Local)</option>
                <option value="world">जागतिक (World)</option>
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="flex items-center gap-2 text-sm text-gray-800 dark:text-gray-200 cursor-pointer">
                <input
                  type="checkbox"
                  name="isBreaking"
                  checked={formData.isBreaking}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-red-600 rounded border-gray-300 focus:ring-red-500"
                />
                🔴 ब्रेकिंग न्यूज (Mark as Breaking)
              </label>

              <label className="flex items-center gap-2 text-sm text-gray-800 dark:text-gray-200 cursor-pointer">
                <input
                  type="checkbox"
                  name="isHero"
                  checked={formData.isHero}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-red-600 rounded border-gray-300 focus:ring-red-500"
                />
                ⭐ मुख्य बातमी (Set as Hero Story)
              </label>
            </div>

            <div className="flex flex-col mt-4">
              <label htmlFor="tags" className="font-semibold text-sm mb-1 text-gray-800 dark:text-gray-200">
                टॅग्स (Tags - अल्पविरामाने वेगळे करा):
              </label>
              <input
                type="text"
                id="tags"
                name="tags"
                placeholder="पुणे, महामार्ग, अपघात"
                value={formData.tags}
                onChange={handleInputChange}
                className="p-2.5 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* PUBLISHING CONTROLS */}
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-5 rounded-lg shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2 mb-4">
              प्रकाशन नियंत्रण (Publishing Controls)
            </h2>

            <div className="flex flex-col mb-4">
              <label htmlFor="scheduledTime" className="font-semibold text-sm mb-1 text-gray-800 dark:text-gray-200">
                वेळ निश्चित करा (Schedule Publish):
              </label>
              <input
                type="datetime-local"
                id="scheduledTime"
                name="scheduledTime"
                value={formData.scheduledTime}
                onChange={handleInputChange}
                className="p-2.5 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex flex-col gap-3">
              <button
                type="button"
                className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-md transition-colors"
                onClick={() => handleSubmit('published')}
              >
                🚀 आताच प्रकाशित करा (Publish Now)
              </button>

              <button
                type="button"
                className="w-full py-2.5 bg-gray-500 hover:bg-gray-600 text-white rounded-md transition-colors"
                onClick={() => handleSubmit('draft')}
              >
                💾 ड्राफ्ट जतन करा (Save Draft)
              </button>
            </div>
          </div>
        </aside>
      </form>

      {/* PUBLISHED & DRAFT ARTICLES MANAGEMENT */}
      <section className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-5 rounded-lg shadow-sm mt-8">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
          📋 बातमी व्यवस्थापन (All Articles List)
        </h2>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 mb-4">
          येथे तुमच्या सर्व प्रकाशित आणि ड्राफ्ट बातम्यांची सूची आहे.
        </p>

        {articles && articles.length > 0 ? (
          <div className="overflow-x-auto mt-4">
            <table className="w-full border-collapse text-left text-sm">
              <thead>
                <tr className="bg-gray-100 dark:bg-gray-900 border-b-2 border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200">
                  <th className="p-3">शीर्षक (Title)</th>
                  <th className="p-3">वर्ग (Category)</th>
                  <th className="p-3">स्थिती (Status)</th>
                  <th className="p-3">तारीख (Date)</th>
                  <th className="p-3">कृती (Actions)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {articles.map((art) => (
                  <tr key={art.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="p-3 font-semibold text-gray-900 dark:text-white">
                      {art.titleMr || (art.title && art.title.mr) || 'शीर्षक नाही'}
                      {art.isHero && (
                        <span className="ml-2 bg-amber-500 text-white px-1.5 py-0.5 rounded text-[10px]">
                          मुख्य
                        </span>
                      )}
                      {art.isBreaking && (
                        <span className="ml-2 bg-red-500 text-white px-1.5 py-0.5 rounded text-[10px]">
                          ब्रेकिंग
                        </span>
                      )}
                    </td>
                    <td className="p-3">
                      <select
                        value={art.category || 'politics'}
                        onChange={(e) => updateArticle(art.id, { category: e.target.value })}
                        className="px-2 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 text-xs"
                      >
                        <option value="politics">राजकारण (Politics)</option>
                        <option value="agri">शेती (Agriculture)</option>
                        <option value="crime">गुन्हेगारी (Crime)</option>
                        <option value="education">शिक्षण (Education)</option>
                        <option value="sports">क्रीडा (Sports)</option>
                        <option value="business">व्यवसाय (Business)</option>
                        <option value="tech">तंत्रज्ञान (Technology)</option>
                        <option value="health">आरोग्य (Health)</option>
                        <option value="entertainment">मनोरंजन (Entertainment)</option>
                        <option value="local">स्थानिक (Local)</option>
                        <option value="world">जागतिक (World)</option>
                      </select>
                    </td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-1 rounded text-xs font-bold text-white ${
                          art.status === 'published' ? 'bg-emerald-500' : 'bg-gray-500'
                        }`}
                      >
                        {art.status === 'published' ? 'प्रकाशित' : 'ड्राफ्ट'}
                      </span>
                    </td>
                    <td className="p-3 text-xs text-gray-600 dark:text-gray-400">
                      {new Date(art.publishedAt || art.createdAt || Date.now()).toLocaleDateString('mr-IN')}
                    </td>
                    <td className="p-3 flex items-center gap-2">
                      {art.status === 'draft' ? (
                        <button
                          type="button"
                          className="px-2.5 py-1 bg-emerald-500 hover:bg-emerald-600 text-white rounded text-xs transition-colors"
                          onClick={() => updateArticle(art.id, { status: 'published' })}
                        >
                          🚀 प्रकाशित करा
                        </button>
                      ) : (
                        <button
                          type="button"
                          className="px-2.5 py-1 bg-gray-500 hover:bg-gray-600 text-white rounded text-xs transition-colors"
                          onClick={() => updateArticle(art.id, { status: 'draft' })}
                        >
                          💾 ड्राफ्ट करा
                        </button>
                      )}
                      <a
                        href={`/article/${art.id}`}
                        target="_blank"
                        rel="noreferrer"
                        className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs inline-block text-decoration-none transition-colors"
                      >
                        👁️ पहा
                      </a>
                      <button
                        type="button"
                        className="px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-xs transition-colors"
                        onClick={() => {
                          if (window.confirm('तुम्हाला ही बातमी हटवायची आहे का?')) {
                            deleteArticle(art.id);
                          }
                        }}
                      >
                        🗑️ हटवा
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            सध्या एकही बातमी जतन केलेली नाही. (No articles stored yet)
          </p>
        )}
      </section>

      {/* CROPPER / ASPECT RATIO MODAL */}
      {activeCropImage && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg max-w-lg w-full shadow-xl">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              ✂️ फोटो आकार आणि क्रॉप (Aspect Ratio Selector)
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
              बातमीच्या मांडणीनुसार फोटोचा आकार निवडा:
            </p>

            <div className="flex gap-2 my-4">
              {['16:9', '4:3', '1:1'].map((ratio) => (
                <button
                  key={ratio}
                  type="button"
                  className={`px-3 py-1.5 border rounded text-sm transition-colors ${
                    cropAspectRatio === ratio
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-700 hover:bg-gray-100'
                  }`}
                  onClick={() => setCropAspectRatio(ratio)}
                >
                  {ratio}
                </button>
              ))}
            </div>

            <div className={`overflow-hidden bg-black mb-4 w-full ${getAspectRatioClass(cropAspectRatio)}`}>
              <img src={activeCropImage.url} alt="Crop preview" className="w-full h-full object-cover" />
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                className="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded transition-colors"
                onClick={() => setActiveCropImage(null)}
              >
                लागू करा (Apply Crop)
              </button>
              <button
                type="button"
                className="flex-1 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded transition-colors"
                onClick={() => setActiveCropImage(null)}
              >
                रद्द करा (Cancel)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};