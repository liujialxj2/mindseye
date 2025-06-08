import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "What is Mindseye and when will it be released?",
      answer: "Mindseye is an upcoming revolutionary adventure game that challenges your perception and cognitive abilities. The official release is planned for early 2024, with our countdown timer showing the exact time remaining."
    },
    {
      question: "How do these mini-games relate to the main Mindseye game?",
      answer: "Our mini-games are designed to introduce key gameplay mechanics and concepts from Mindseye. They serve as training grounds to develop the skills you'll need in the full game, including pattern recognition, memory challenges, and perception tests."
    },
    {
      question: "Are these games free to play?",
      answer: "Yes! All mini-games on our platform are completely free to play. We want everyone to experience the Mindseye universe and prepare for the main game launch."
    },
    {
      question: "Do I need to create an account to play?",
      answer: "While you can play our games without an account, creating one allows you to save your progress, compete on leaderboards, and receive exclusive updates about the Mindseye launch."
    },
    {
      question: "Will my progress carry over to the main Mindseye game?",
      answer: "Yes! Players who complete certain challenges and achieve high scores in our mini-games will receive exclusive bonuses and early access content in the main Mindseye game."
    },
    {
      question: "What platforms will Mindseye be available on?",
      answer: "Mindseye will be available on PC, PlayStation 5, Xbox Series X/S, and Nintendo Switch at launch, with mobile versions planned for later release."
    },
    {
      question: "How can I stay updated on Mindseye news?",
      answer: "Subscribe to our newsletter, follow our social media channels, and keep playing our mini-games for the latest updates, exclusive content, and early access opportunities."
    },
    {
      question: "Can I suggest features or report bugs?",
      answer: "Absolutely! We value community feedback. Use our contact form or community forums to share suggestions, report issues, or connect with other players."
    }
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-20 bg-gray-900 relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-white mb-6 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Get answers to common questions about Mindseye, our mini-games, and what to expect from the full gaming experience.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-black/40 backdrop-blur-md rounded-xl border border-blue-500/20 mb-4 overflow-hidden hover:border-blue-500/50 transition-colors duration-300"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-blue-500/10 transition-colors duration-300"
              >
                <h3 className="text-lg font-semibold text-white pr-4">
                  {faq.question}
                </h3>
                {openIndex === index ? (
                  <ChevronUp className="w-5 h-5 text-blue-400 flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-blue-400 flex-shrink-0" />
                )}
              </button>
              
              {openIndex === index && (
                <div className="px-6 pb-4 border-t border-blue-500/20">
                  <p className="text-gray-300 leading-relaxed pt-4">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;