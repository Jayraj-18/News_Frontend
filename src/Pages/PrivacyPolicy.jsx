import React from 'react';
import { Lock, Cookie, ShieldAlert, Eye } from 'lucide-react';
import SEO from '../Components/common/SEO'; // Ensure the import path matches your project structure
export default function PrivacyPolicy() {
  const siteName = "पालघर दृष्टी";

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <SEO 
                 title="संपर्क साधा | पालघर दृष्टी"
                 description="पालघर दृष्टी बातमीपत्राच्या संपादकीय टीमशी संपर्क साधा. बातम्या पाठवण्यासाठी, जाहिरातींसाठी किंवा अभिप्रायासाठी संपर्क माहिती."
                 path="/contact"
                 focusKeyword="पालघर दृष्टी संपर्क"
               />
        {/* Header */}
        <div className="bg-slate-900 text-white p-8 sm:p-10">
          <div className="flex items-center gap-2 text-red-500 text-sm font-semibold uppercase tracking-wider mb-2">
            <Lock className="w-4 h-4" /> डेटा सुरक्षा
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold">गोपनीयता धोरण (Privacy Policy)</h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            अंतिम अपडेट: {new Date().toLocaleDateString('mr-IN', { month: 'long', year: 'numeric' })}
          </p>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-10 space-y-6 text-sm text-slate-700 leading-relaxed">
          
          <p className="bg-slate-50 p-4 rounded-lg border border-slate-200">
            <strong className="text-slate-900">{siteName}</strong> वर आमच्या वाचकांच्या गोपनीयतेचे (Privacy) रक्षण करणे ही आमची मुख्य प्राथमिकता आहे. हे गोपनीयता धोरण आम्ही गोळा करत असलेली माहिती आणि तिचा वापर कसा केला जातो हे स्पष्ट करते.
          </p>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 text-base">
              <Eye className="w-5 h-5 text-red-600" /> आम्ही कोणती माहिती गोळा करतो?
            </h2>
            <ul className="list-disc list-inside space-y-2 pl-2 text-slate-600">
              <li>
                <strong>लॉग फाइल्स (Log Files):</strong> सर्व मानक वेबसाइट्सप्रमाणे, आम्ही आयपी (IP) पत्ता, ब्राऊजरचा प्रकार, इंटरनेट सर्व्हिस प्रोव्हायडर (ISP), तारीख/वेळ आणि क्लिकची संख्या यासारखी तांत्रिक माहिती गोळा करतो. ही माहिती वैयक्तिक ओळख पटवण्यासाठी नसून वेबसाईटचे विश्लेषण करण्यासाठी वापरली जाते.
              </li>
              <li>
                <strong>कुकीज (Cookies):</strong> आमची वेबसाईट वाचकांच्या पसंतीनुसार उत्तम अनुभव देण्यासाठी कुकीजचा वापर करते.
              </li>
            </ul>
          </section>

          <section className="space-y-3 bg-red-50/60 p-5 rounded-xl border border-red-100">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Cookie className="w-5 h-5 text-red-600" /> गूगल ॲडसेंस आणि थर्ड-पार्टी कुकीज (Google AdSense & DoubleClick)
            </h2>
            <p className="text-slate-600">
              गूगल (Google) हा आमच्या वेबसाईटवरील मुख्य थर्ड-पार्टी जाहितदार आहे. गूगल आमच्या वेबसाईटवर जाहिराती दाखवण्यासाठी कुकीजचा वापर करतो.
            </p>
            <ul className="list-disc list-inside space-y-1.5 text-slate-600 pl-2">
              <li>वाचकांनी यापूर्वी भेट दिलेल्या इतर वेबसाइट्सच्या आधारे गूगल त्यांना योग्य जाहिराती दाखवतो.</li>
              <li>वाचकांना वाटल्यास ते गूगलच्या जाहिरात गोपनीयतेच्या (Google Ad Privacy Policy) पानाला भेट देऊन या कुकीज वापरणे बंद करू शकतात.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-red-600" /> माहितीचे रक्षण
            </h2>
            <p className="text-slate-600">
              आम्ही तुमच्या कोणत्याही वैयक्तिक माहितीची विक्री, व्यापार किंवा हस्तांतरण इतर कोणत्याही थर्ड-पार्टी कंपनीला करत नाही.
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}