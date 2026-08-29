import React from 'react';
import { Lock, Cookie, ShieldAlert, Eye, Mail, Link as LinkIcon } from 'lucide-react';
import SEO from '../Components/common/SEO';

export default function PrivacyPolicy() {
  const siteName = "पालघर दृष्टी";

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">

        {/* SEO */}
        <SEO
          title="गोपनीयता धोरण | पालघर दृष्टी"
          description="पालघर दृष्टीच्या गोपनीयता धोरणाबद्दल माहिती. आम्ही वाचकांची माहिती, कुकीज, Google AdSense, जाहिराती आणि तृतीय-पक्ष सेवांचा वापर कसा करतो याबद्दल माहिती."
          path="/privacy"
          focusKeyword="पालघर दृष्टी गोपनीयता धोरण"
        />

        {/* Header */}
        <div className="bg-slate-900 text-white p-8 sm:p-10">
          <div className="flex items-center gap-2 text-red-500 text-sm font-semibold uppercase tracking-wider mb-2">
            <Lock className="w-4 h-4" />
            डेटा सुरक्षा
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold">
            गोपनीयता धोरण (Privacy Policy)
          </h1>

          <p className="text-slate-400 text-xs sm:text-sm mt-2">
            अंतिम अपडेट: {new Date().toLocaleDateString('mr-IN', {
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            })}
          </p>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-10 space-y-8 text-sm text-slate-700 leading-relaxed">

          {/* Introduction */}
          <p className="bg-slate-50 p-4 rounded-lg border border-slate-200">
            <strong className="text-slate-900">{siteName}</strong> वर
            आमच्या वाचकांच्या गोपनीयतेचे रक्षण करणे ही आमची महत्त्वाची
            प्राथमिकता आहे. हे गोपनीयता धोरण आमच्या वेबसाइटला भेट देताना
            कोणती माहिती गोळा केली जाऊ शकते, तिचा वापर कसा केला जातो आणि
            तिचे संरक्षण कसे केले जाते याबद्दल माहिती देते.
          </p>

          {/* Information Collection */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Eye className="w-5 h-5 text-red-600" />
              आम्ही कोणती माहिती गोळा करतो?
            </h2>

            <p>
              वेबसाइट वापरताना काही तांत्रिक माहिती आपोआप गोळा केली जाऊ शकते.
              यामध्ये खालील माहितीचा समावेश असू शकतो:
            </p>

            <ul className="list-disc list-inside space-y-2 pl-2 text-slate-600">
              <li>IP पत्ता</li>
              <li>ब्राउझरचा प्रकार आणि आवृत्ती</li>
              <li>डिव्हाइसचा प्रकार</li>
              <li>ऑपरेटिंग सिस्टम</li>
              <li>वेबसाइटला भेट दिल्याची तारीख आणि वेळ</li>
              <li>आपण भेट दिलेली पृष्ठे</li>
              <li>रेफरल URL किंवा वेबसाइट</li>
              <li>वेबसाइटवरील तांत्रिक वापराशी संबंधित माहिती</li>
            </ul>

            <p className="text-slate-600">
              या माहितीचा वापर वेबसाइटचे कार्य, सुरक्षा, कार्यक्षमता आणि
              वापरकर्त्यांचा अनुभव सुधारण्यासाठी केला जाऊ शकतो.
            </p>
          </section>

          {/* Cookies */}
          <section className="space-y-3 bg-slate-50 p-5 rounded-xl border border-slate-200">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Cookie className="w-5 h-5 text-red-600" />
              कुकीज (Cookies)
            </h2>

            <p className="text-slate-600">
              {siteName} वेबसाइटचा वापर सुधारण्यासाठी आणि काही सुविधा
              योग्यरित्या कार्य करण्यासाठी कुकीज किंवा तत्सम तंत्रज्ञानाचा
              वापर करू शकते.
            </p>

            <p className="text-slate-600">
              कुकीज म्हणजे वेबसाइटने वापरकर्त्याच्या ब्राउझरमध्ये साठवलेली
              लहान माहिती असते. वापरकर्ते त्यांच्या ब्राउझरच्या सेटिंग्जमधून
              कुकीज नियंत्रित किंवा हटवू शकतात.
            </p>
          </section>

          {/* Google AdSense */}
          <section className="space-y-4 bg-red-50/60 p-5 rounded-xl border border-red-100">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Cookie className="w-5 h-5 text-red-600" />
              Google AdSense आणि तृतीय-पक्ष जाहिराती
            </h2>

            <p className="text-slate-600">
              {siteName} भविष्यात Google AdSense किंवा इतर जाहिरात सेवांचा
              वापर करू शकते. अशा सेवांद्वारे वेबसाइटवर जाहिराती प्रदर्शित
              केल्या जाऊ शकतात.
            </p>

            <p className="text-slate-600">
              Google आणि त्याचे जाहिरात भागीदार जाहिराती प्रदर्शित करण्यासाठी
              कुकीज, वेब बीकन्स किंवा तत्सम तंत्रज्ञानाचा वापर करू शकतात.
              यामुळे वापरकर्त्याच्या मागील वेबसाइट भेटींवर किंवा इतर
              संबंधित माहितीवर आधारित जाहिराती प्रदर्शित होऊ शकतात.
            </p>

            <p className="text-slate-600">
              वापरकर्ते Google च्या जाहिरात सेटिंग्जद्वारे त्यांच्या
              जाहिरात पसंती व्यवस्थापित करू शकतात.
            </p>

            <p className="text-slate-600">
              Google च्या जाहिराती आणि गोपनीयता पद्धतींबद्दल अधिक माहितीसाठी
              वापरकर्त्यांनी Google च्या अधिकृत गोपनीयता आणि जाहिरात
              धोरणांचा संदर्भ घ्यावा.
            </p>
          </section>

          {/* Analytics */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900">
              वेबसाइट विश्लेषण (Analytics)
            </h2>

            <p className="text-slate-600">
              वेबसाइटचा वापर कसा केला जातो हे समजून घेण्यासाठी आम्ही
              भविष्यात Google Analytics किंवा तत्सम विश्लेषण सेवा वापरू
              शकतो. अशा सेवांमधून वेबसाइटचा वापर, ट्रॅफिक आणि कार्यक्षमता
              समजून घेण्यासाठी तांत्रिक माहिती गोळा केली जाऊ शकते.
            </p>
          </section>

          {/* Contact Information */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Mail className="w-5 h-5 text-red-600" />
              संपर्क साधताना दिलेली माहिती
            </h2>

            <p className="text-slate-600">
              आपण आमच्याशी ई-मेल, संपर्क फॉर्म किंवा इतर माध्यमातून संपर्क
              साधल्यास आपण स्वेच्छेने दिलेली माहिती, जसे की नाव, ई-मेल
              पत्ता आणि संदेशातील माहिती, आमच्याकडून प्राप्त होऊ शकते.
            </p>

            <p className="text-slate-600">
              या माहितीचा वापर आपल्या चौकशीला उत्तर देण्यासाठी,
              अभिप्राय समजून घेण्यासाठी किंवा आवश्यक ती कार्यवाही
              करण्यासाठी केला जाऊ शकतो.
            </p>
          </section>

          {/* External Links */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <LinkIcon className="w-5 h-5 text-red-600" />
              तृतीय-पक्ष वेबसाइट्सच्या लिंक्स
            </h2>

            <p className="text-slate-600">
              आमच्या वेबसाइटवरील काही लेखांमध्ये किंवा पृष्ठांमध्ये
              तृतीय-पक्ष वेबसाइट्स, सोशल मीडिया प्लॅटफॉर्म किंवा इतर
              बाह्य सेवांच्या लिंक्स असू शकतात.
            </p>

            <p className="text-slate-600">
              या वेबसाइट्सच्या गोपनीयता धोरणांवर किंवा त्यांच्या
              सामग्रीवर {siteName} चे नियंत्रण नसते. त्यामुळे बाह्य
              वेबसाइट वापरण्यापूर्वी त्यांच्या गोपनीयता धोरणांचा
              आढावा घेण्याची आम्ही शिफारस करतो.
            </p>
          </section>

          {/* Data Protection */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-red-600" />
              माहितीचे संरक्षण
            </h2>

            <p className="text-slate-600">
              आम्ही प्राप्त झालेल्या वैयक्तिक माहितीचे अनधिकृत प्रवेश,
              गैरवापर, बदल किंवा प्रकटीकरण यापासून संरक्षण करण्यासाठी
              वाजवी सुरक्षा उपाय वापरण्याचा प्रयत्न करतो.
            </p>

            <p className="text-slate-600">
              तथापि, इंटरनेटवरून माहिती पाठवण्याची किंवा साठवण्याची
              कोणतीही पद्धत पूर्णपणे सुरक्षित असल्याची हमी देता येत नाही.
            </p>
          </section>

          {/* Information Sharing */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900">
              माहितीची विक्री किंवा देवाणघेवाण
            </h2>

            <p className="text-slate-600">
              आम्ही वापरकर्त्यांची वैयक्तिक माहिती विक्रीसाठी देत नाही.
              कायदेशीर आवश्यकता, वेबसाइटची सुरक्षा किंवा आवश्यक
              तृतीय-पक्ष सेवा पुरवण्यासाठी माहिती शेअर करणे आवश्यक
              असल्यास लागू कायद्यांनुसार तसे केले जाऊ शकते.
            </p>
          </section>

          {/* Children's Privacy */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900">
              मुलांची गोपनीयता
            </h2>

            <p className="text-slate-600">
              आमची वेबसाइट जाणूनबुजून लहान मुलांकडून वैयक्तिक माहिती
              गोळा करण्याच्या उद्देशाने तयार केलेली नाही. पालक किंवा
              पालकत्वाची जबाबदारी असलेल्या व्यक्तींनी मुलांच्या
              इंटरनेट वापरावर लक्ष ठेवावे.
            </p>
          </section>

          {/* Policy Changes */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900">
              गोपनीयता धोरणातील बदल
            </h2>

            <p className="text-slate-600">
              वेबसाइटच्या कार्यपद्धतीमध्ये, सेवांमध्ये किंवा लागू
              कायद्यांमध्ये बदल झाल्यास हे गोपनीयता धोरण वेळोवेळी
              अपडेट केले जाऊ शकते. बदल झाल्यानंतर या पृष्ठावर
              सुधारित "अंतिम अपडेट" तारीख दर्शवली जाईल.
            </p>
          </section>

          {/* Contact */}
          <section className="space-y-3 bg-slate-50 p-5 rounded-xl border border-slate-200">
            <h2 className="text-lg font-bold text-slate-900">
              आमच्याशी संपर्क साधा
            </h2>

            <p className="text-slate-600">
              या गोपनीयता धोरणाबद्दल काही प्रश्न असल्यास किंवा आपल्या
              माहितीशी संबंधित चौकशी असल्यास कृपया आमच्या
              <strong> संपर्क पृष्ठाद्वारे </strong>
              आमच्याशी संपर्क साधा.
            </p>
          </section>

          {/* Last Note */}
          <div className="pt-4 border-t border-slate-200 text-xs text-slate-500">
            <p>
              ही माहिती वापरकर्त्यांना {siteName} च्या गोपनीयता पद्धती
              समजून घेण्यास मदत करण्यासाठी दिली आहे.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}