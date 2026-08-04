import React from 'react';
import { useLanguage } from '../../context/LanguageContext';

export const PhotoGallery = ({ photos }) => {
  const { lang, t } = useLanguage();

  const samplePhotos = photos || [
    {
      id: "p1",
      title: { mr: "पंढरपूर आषाढी वारी: भक्तीमय वातावरणात पालखीचे प्रस्थान", en: "Pandharpur Wari: Palkhi Departs in Devotional Atmosphere" },
      url: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=800&q=80",
      count: 12
    },
    {
      id: "p2",
      title: { mr: "सह्याद्रीच्या कुशीतील निसर्गरम्य धबधबे", en: "Scenic Waterfalls in the Sahyadri Ranges" },
      url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
      count: 8
    }
  ];

  return (
    <section className="bg-gray-900 text-white p-6 sm:p-8 rounded-lg mb-12">
      {/* HEADER */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold border-l-4 border-red-600 pl-3">
          📷 {t('photos')}
        </h2>
      </div>

      {/* GALLERY GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {samplePhotos.map((photo) => {
          const title = photo.title[lang] || photo.title.mr;
          return (
            <div key={photo.id} className="cursor-pointer group">
              {/* IMAGE CONTAINER */}
              <div className="relative aspect-[16/10] overflow-hidden rounded">
                <img 
                  src={photo.url} 
                  alt={title} 
                  loading="lazy" 
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <span className="absolute top-2 right-2 bg-black/75 text-white text-xs px-2 py-1 rounded-sm shadow-sm">
                  🖼️ {photo.count}
                </span>
              </div>
              
              {/* TITLE */}
              <h3 className="text-base text-gray-200 mt-3 leading-snug group-hover:text-white transition-colors">
                {title}
              </h3>
            </div>
          );
        })}
      </div>
    </section>
  );
};