import React, { useState } from 'react';
import { ChevronDown, HelpCircle, Package, RefreshCcw, CreditCard, Search } from 'lucide-react';

const faqData= [
  { id: 1, category: 'Orders', question: "How can I track my order?", answer: "Once your order is shipped, you will receive an email with a tracking number and a link to the courier's website." },
  { id: 2, category: 'Shipping', question: "What are the shipping charges?", answer: "We offer free shipping on all orders above ₹999. For orders below that, a flat fee of ₹50 is charged." },
  { id: 3, category: 'Returns', question: "What is your return policy?", answer: "You can return any unworn shoes within 30 days of delivery. Make sure to keep the original packaging and tags intact." },
  { id: 4, category: 'Payments', question: "Which payment methods do you accept?", answer: "We accept all major credit/debit cards, UPI (Google Pay, PhonePe), and Net Banking." },
];

const FAQPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('Orders');
  const [openId, setOpenId] = useState<number | null>(1);
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { name: 'Orders', icon: <Package size={18} /> },
    { name: 'Shipping', icon: <HelpCircle size={18} /> },
    { name: 'Returns', icon: <RefreshCcw size={18} /> },
    { name: 'Payments', icon: <CreditCard size={18} /> },
  ];

  const filteredFaqs = faqData.filter(faq => 
    faq.category === activeCategory && 
    faq.question.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 md:py-20 font-sans">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-4 uppercase tracking-tight">
          How can we help you?
        </h1>
        <div className="relative max-w-xl mx-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text"
            placeholder="Search for questions..."
            className="w-full pl-12 pr-4 py-4 bg-slate-100 border-none rounded-2xl focus:ring-2 focus:ring-blue-600 transition-all outline-none"
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-12">
        {/* --- CATEGORY SIDEBAR --- */}
        <aside className="md:w-1/4 flex md:flex-col gap-2 overflow-x-auto pb-4 md:pb-0 scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat.name}
              onClick={() => setActiveCategory(cat.name)}
              className={`flex items-center gap-3 px-6 py-4 rounded-xl font-bold text-sm whitespace-nowrap transition-all
                ${activeCategory === cat.name 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' 
                  : 'bg-white text-slate-500 hover:bg-slate-50'}`}
            >
              {cat.icon}
              {cat.name}
            </button>
          ))}
        </aside>

        {/* --- ACCORDION LIST --- */}
        <main className="flex-1 space-y-4">
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq) => (
              <div 
                key={faq.id} 
                className="bg-white border border-slate-100 rounded-2xl overflow-hidden transition-all hover:border-slate-200"
              >
                <button
                  onClick={() => setOpenId(openId === faq.id ? null : faq.id)}
                  className="w-full flex items-center justify-between p-6 text-left"
                >
                  <span className="font-bold text-slate-800 md:text-lg">{faq.question}</span>
                  <ChevronDown 
                    className={`text-slate-400 transition-transform duration-300 ${openId === faq.id ? 'rotate-180' : ''}`} 
                    size={20} 
                  />
                </button>
                
                <div 
                  className={`px-6 overflow-hidden transition-all duration-300 ease-in-out
                    ${openId === faq.id ? 'max-h-40 pb-6 opacity-100' : 'max-h-0 opacity-0'}`}
                >
                  <p className="text-slate-600 leading-relaxed border-t border-slate-50 pt-4">
                    {faq.answer}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-10 text-slate-400 italic">
              No matching questions found for "{searchQuery}"
            </div>
          )}
        </main>
      </div>

      {/* --- CTA SECTION --- */}
      <div className="mt-20 p-8 md:p-12 bg-slate-900 rounded-3xl text-center text-white">
        <h3 className="text-2xl font-bold mb-2">Still have questions?</h3>
        <p className="text-slate-400 mb-8">Can't find the answer you're looking for? Please chat to our friendly team.</p>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold transition-all">
          Get in Touch
        </button>
      </div>
    </div>
  );
};

export default FAQPage;