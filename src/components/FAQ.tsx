import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import TranslatedText, { useTranslatedText } from './common/TranslatedText';

// FAQ item interface
interface FAQItem {
  question: string;
  answer: string;
}

const FAQ = () => {
  const { t, i18n } = useTranslation(['faq', 'common']);
  const { lang } = useParams<{ lang: string }>();
  const currentLang = lang || i18n.language;
  
  // 强制使用当前语言加载FAQ数据
  const faqItems = t('questions', { returnObjects: true, lng: currentLang }) as FAQItem[];
  
  // State to track which FAQ item is open
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  // Toggle FAQ item
  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  // 获取翻译文本
  const noQuestionsText = useTranslatedText('noQuestionsAvailable', 'faq', {}, '当前语言暂无常见问题。');
  const pageTitle = useTranslatedText('title', 'faq');
  const pageSubtitle = useTranslatedText('subtitle', 'faq');
  const moreQuestionsText = useTranslatedText('moreQuestions.text', 'faq');
  const contactLinkText = useTranslatedText('moreQuestions.contactLink', 'faq');

  // 调试信息
  console.log(`当前语言: ${currentLang}, FAQ项目数量: ${faqItems?.length || 0}`);
  
  return (
    <section id="faq" className="py-20 bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {pageTitle}
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            {pageSubtitle}
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          {Array.isArray(faqItems) && faqItems.length > 0 ? (
            faqItems.map((item, index) => (
              <div 
                key={index}
                className="mb-4 border border-gray-800 rounded-lg overflow-hidden bg-gray-800/50 backdrop-blur-sm"
              >
                <button
                  className="w-full px-6 py-4 text-left flex justify-between items-center focus:outline-none"
                  onClick={() => toggleItem(index)}
                >
                  <span className="text-lg font-medium text-white">{item.question}</span>
                  <ChevronDown 
                    className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${openIndex === index ? 'transform rotate-180' : ''}`} 
                  />
                </button>
                
                <div 
                  className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${
                    openIndex === index ? 'max-h-96 pb-6' : 'max-h-0'
                  }`}
                >
                  <p className="text-gray-300">{item.answer}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-400">
              {noQuestionsText}
            </div>
          )}
        </div>
        
        <div className="text-center mt-12">
          <p className="text-gray-400">
            {moreQuestionsText}{' '}
            <Link to={`/${currentLang}/contact`} className="text-blue-400 hover:underline">
              {contactLinkText}
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
};

export default FAQ;