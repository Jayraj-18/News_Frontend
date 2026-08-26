import React from 'react';
import { AlertCircle, Copyright, ExternalLink, BookOpen } from 'lucide-react';
import SEO from '../Components/common/SEO'; // Ensure the import path matches your project structure
export default function Disclaimer() {
  const siteName = "पालघर दृष्टी";

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <SEO 
          title="नियम, अटी व डिस्क्लेमर | पालघर दृष्टी"
          description="पालघर दृष्टी वेबसाइटवरील नियम, अटी व डिस्क्लेमर. वेबसाइट वापरण्यापूर्वी कृपया हे माहिती काळजीपूर्वक वाचा."
          path="/disclaimer"
          focusKeyword="पालघर दृष्टी डिस्क्लेमर"
        />

        {/* Header */}
        <div className="bg-slate-900 text-white p-8 sm:p-10">
          <h1 className="text-2xl sm:text-3xl font-bold">नियम, अटी व डिस्क्लेमर (Terms & Disclaimer)</h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            कृपया वेबसाईट वापरण्यापूर्वी खालील अटी व शर्ती काळजीपूर्वक वाचा.
          </p>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-10 space-y-8 text-sm text-slate-700 leading-relaxed">
          
          {/* Section 1 */}
          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-600" /> १. बातमीची अचूकता (Accuracy of Information)
            </h2>
            <p className="text-slate-600 pl-7">
              <strong className="text-slate-800">{siteName}</strong> वर प्रकाशित केलेल्या बातम्या आणि माहिती ही अचूक आणि विश्वासार्ह स्त्रोतांवर आधारित असते. तरीही, सर्व माहिती केवळ सामान्य माहितीच्या उद्देशाने दिली जाते. कोणत्याही माहितीच्या आधारे घेतलेल्या निर्णयाची जबाबदारी वाचकाची स्वतःची असेल.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Copyright className="w-5 h-5 text-red-600" /> २. कॉपीराइट धोरण (Copyright Policy)
            </h2>
            <p className="text-slate-600 pl-7">
              या वेबसाइटवरील सर्व मजकूर, लोगो, आणि डिझाइन <strong>{siteName}</strong> च्या मालकीचे आहेत. आमच्या पूर्वपरवानगीशिवाय या वेबसाईटवरील मजकूर कॉपी करणे, पुनर्प्रकाशित करणे किंवा इतर ठिकाणी वापरणे कायदेशीररित्या प्रतिबंधित आहे.
            </p>
          </section>

          {/* Section 3 */}
          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <ExternalLink className="w-5 h-5 text-red-600" /> ३. बाह्य लिंक्स (External Links)
            </h2>
            <p className="text-slate-600 pl-7">
              आमच्या लेखांमध्ये इतर वेबसाइट्स किंवा YouTube व्हिडिओं च्या लिंक्स असू शकतात. त्या बाह्य वेबसाइट्सच्या मजकुरासाठी, जाहिरातींसाठी किंवा धोरणांसाठी आम्ही जबाबदार नाही.
            </p>
          </section>

          {/* Section 4 */}
          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-red-600" /> ४. संपादकीय नियम (Editorial Policy)
            </h2>
            <p className="text-slate-600 pl-7">
              आम्ही कोणत्याही राजकीय पक्ष किंवा संघटनेशी बांधील नाही. आमचा उद्देश केवळ वाचकांपर्यंत खरी, निष्पक्ष आणि वस्तुनिष्ठ माहिती पोहोचवणे हा आहे.
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}