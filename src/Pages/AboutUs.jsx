import React from 'react';
import { ShieldCheck, Target, Users, MapPin, Mail, } from 'lucide-react';
import SEO from '../Components/common/SEO'; // Ensure the import path matches your project structure
export default function AboutUs() {
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
        {/* Header Banner */}
        <div className="bg-red-600 text-white p-8 sm:p-12 text-center">
          <span className="inline-block px-3 py-1 bg-red-700 rounded-full text-xs font-semibold tracking-wide uppercase mb-3">
            अधिकृत माहिती
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2">
            आमच्याबद्दल (About Us)
          </h1>
          <p className="text-red-100 text-base sm:text-lg max-w-2xl mx-auto">
            {siteName} – पालघर, ठाणे आणि महाराष्ट्रातील ताज्या व अचूक बातम्यांचे डिजिटल व्यासपीठ.
          </p>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-10 space-y-8 text-slate-700 leading-relaxed">
          
          {/* Welcome Intro */}
          <section className="border-b border-slate-100 pb-6">
            <h2 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
              <ShieldCheck className="text-red-600 w-6 h-6" />
              जीवलग वाचकांनो, आपले स्वागत आहे!
            </h2>
            <p>
              <strong className="text-slate-900">{siteName}</strong> मध्ये आपले सहर्ष स्वागत आहे. आम्ही तुम्हाला पालघर, ठाणे, मनोर आणि महाराष्ट्रातील इतर भागांतील ताज्या, वस्तुनिष्ठ आणि अचूक बातम्या पुरवण्यासाठी कटिबद्ध आहोत.
            </p>
          </section>

          {/* Mission Grid */}
          <section className="grid sm:grid-cols-2 gap-6">
            <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
              <div className="p-3 bg-red-100 text-red-600 rounded-lg w-fit mb-4">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">आमचे ध्येय (Our Mission)</h3>
              <p className="text-sm text-slate-600">
                आमचा मुख्य उद्देश नागरिकांना त्यांच्या परिसरातील घडामोडी, गुन्हेगारी, वाहतूक, हवामान, राजकीय घडामोडी आणि सामाजिक प्रश्नांशी अपडेट ठेवणे हा आहे. आम्ही कोणत्याही पूर्वग्रहाशिवाय निष्पक्ष आणि सत्य बातमीदारीवर विश्वास ठेवतो.
              </p>
            </div>

            <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
              <div className="p-3 bg-red-100 text-red-600 rounded-lg w-fit mb-4">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">आम्ही काय कव्हर करतो?</h3>
              <ul className="text-sm text-slate-600 space-y-1.5 list-disc list-inside">
                <li><strong>स्थानिक बातम्या:</strong> पालघर आणि आसपासच्या परिसरातील मुख्य घडामोडी.</li>
                <li><strong>गुन्हेगारी व कारवाई:</strong> पोलीस प्रशासन आणि कायदा-सुव्यवस्थेच्या बातम्या.</li>
                <li><strong>नागरी समस्या:</strong> रस्ते, वाहतूक, हवामान आणि प्रशासकीय निर्णय.</li>
              </ul>
            </div>
          </section>

          {/* Team & Background */}
          <section className="bg-red-50/50 p-6 rounded-xl border border-red-100 space-y-3">
            <h3 className="text-lg font-bold text-slate-900">आमचा प्रवास आणि टीम</h3>
            <p className="text-sm text-slate-600">
              आमची टीम स्थानिक वृत्त संकलन आणि डिजिटल बातमीदारीमध्ये अनुभवी आहे. YouTube वरील अभूतपूर्व यशानंतर, वाचकांना सविस्तर आणि लिखित स्वरूपात डिजिटल बातम्या वाचता याव्यात म्हणून आम्ही हे वेब पोर्टल सुरू केले आहे.
            </p>
            <div className="pt-2 flex flex-wrap gap-4 text-xs font-medium text-slate-700">
              <span className="flex items-center gap-1"><MapPin className="w-4 h-4 text-red-600" /> पालघर, महाराष्ट्र</span>
              <span className="flex items-center gap-1"><Mail className="w-4 h-4 text-red-600" /> newspolicereporter@gmail.com</span>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}