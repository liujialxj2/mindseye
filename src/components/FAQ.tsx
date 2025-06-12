import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

// FAQ item interface
interface FAQItem {
  question: string;
  answer: string;
}

const FAQ = () => {
  // FAQ data
  const faqData: FAQItem[] = [
    {
      question: "What is Mindseye?",
      answer: "Mindseye is an innovative gaming platform that offers a collection of perception-challenging games. Our platform features a variety of mini-games designed to test your cognitive abilities while providing an entertaining experience."
    },
    {
      question: "How do I play games on this website?",
      answer: "Simply browse our game collection, click on any game that interests you, and press the 'Play Now' button. Our games are browser-based and don't require any downloads or installations. Just make sure you have a stable internet connection."
    },
    {
      question: "Are these games free to play?",
      answer: "Yes, all mini-games on our website are completely free to play. We believe in providing accessible entertainment for everyone while we develop our main Mindseye game."
    },
    {
      question: "When will the full Mindseye game be released?",
      answer: "The full Mindseye game is currently in development. While we don't have an exact release date yet, you can subscribe to our newsletter or follow us on social media for the latest updates and announcements."
    },
    {
      question: "Do I need to create an account to play?",
      answer: "No, you don't need to create an account to play our mini-games. However, creating an account in the future will allow you to save your progress, participate in leaderboards, and access exclusive content."
    },
    {
      question: "What devices are supported?",
      answer: "Our games are designed to work on most modern devices including desktops, laptops, tablets, and smartphones. We recommend using the latest version of Chrome, Firefox, Safari, or Edge for the best experience."
    }
  ];

  // State to track which FAQ item is open
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  // Toggle FAQ item
  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-20 bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Frequently Asked Questions</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Find answers to common questions about Mindseye games and our platform.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          {faqData.map((item, index) => (
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
          ))}
        </div>
        
        <div className="text-center mt-12">
          <p className="text-gray-400">
            Still have questions? <a href="/contact" className="text-blue-400 hover:underline">Contact our support team</a>
          </p>
        </div>
      </div>
    </section>
  );
};

export default FAQ;