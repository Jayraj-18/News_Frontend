import React from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare, Video } from 'lucide-react';

export default function ContactUs() {
  return (
    <div className="min-h-screen bg-slate-100 py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-md border border-slate-200 overflow-hidden">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-8 sm:p-12 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold mb-3 text-white">
            संपर्क साधा (Contact Us)
          </h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto">
            तुम्हाला काही प्रश्न, अभिप्राय किंवा बातम्यांची माहिती द्यायची असल्यास आमच्याशी संपर्क साधा.
          </p>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-10 grid md:grid-cols-2 gap-8 bg-white">
          
          {/* Contact Details Column */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-slate-900 border-b border-slate-200 pb-3">
              संपर्क माहिती
            </h2>
            
            <div className="space-y-5 text-sm">
              {/* Address */}
              <div className="flex items-start gap-4">
                <div className="p-3 bg-red-50 text-red-600 rounded-lg shrink-0 border border-red-100">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 text-base">कार्यालयीन पत्ता:</h3>
                  <p className="text-slate-600 mt-0.5">News Police Reporter Office, पालघर, महाराष्ट्र - ४०१४०४</p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-4">
                <div className="p-3 bg-red-50 text-red-600 rounded-lg shrink-0 border border-red-100">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 text-base">ईमेल (Email):</h3>
                  <p className="text-slate-600 mt-0.5">contact@newspolicereporter.com</p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-4">
                <div className="p-3 bg-red-50 text-red-600 rounded-lg shrink-0 border border-red-100">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 text-base">फोन / व्हॉट्सॲप:</h3>
                  <p className="text-slate-600 mt-0.5">+91 98XXX XXXXX</p>
                </div>
              </div>
            </div>

            {/* Social Connect Box */}
            <div className="p-5 bg-slate-50 rounded-xl border border-slate-200 mt-6">
              <h3 className="font-bold text-slate-900 mb-2 flex items-center gap-2 text-sm">
                <Video className="w-5 h-5 text-red-600" />
                यूट्यूब आणि सोशियल मीडिया
              </h3>
              <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                बातमीची कोणतीही टीप किंवा फोटो/व्हिडिओ पाठवण्यासाठी आमच्या व्हॉट्सॲप नंबरवर संपर्क करा.
              </p>
              <a 
                href="https://youtube.com/@newspolicereporter" 
                target="_blank" 
                rel="noreferrer" 
                className="inline-flex items-center justify-center gap-2 w-full py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg transition-colors shadow-sm"
              >
                <Video className="w-4 h-4" />
                यूट्यूब चॅनेलला भेट द्या
              </a>
            </div>
          </div>

        

        </div>
      </div>
    </div>
  );
}