import React from 'react';
import { useTranslation } from 'react-i18next';

const TermsPage: React.FC = () => {
  const { t } = useTranslation('terms');
  
  return (
    <div className="container mx-auto px-4 py-20 mt-16">
      <div className="max-w-4xl mx-auto bg-gray-900 rounded-xl p-8 shadow-lg border border-blue-500/20">
        <h1 className="text-3xl font-bold text-white mb-6">{t('title')}</h1>
        
        <div className="space-y-6 text-gray-300">
          <section>
            <h2 className="text-xl font-semibold text-blue-400 mb-3">{t('sections.acceptance.title')}</h2>
            <p>
              {t('sections.acceptance.content')}
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold text-blue-400 mb-3">{t('sections.license.title')}</h2>
            <p>
              {t('sections.license.content')}
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              {(t('sections.license.items', { returnObjects: true }) as string[]).map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold text-blue-400 mb-3">{t('sections.userContent.title')}</h2>
            <p>
              {t('sections.userContent.content')}
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              {(t('sections.userContent.items', { returnObjects: true }) as string[]).map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold text-blue-400 mb-3">{t('sections.disclaimer.title')}</h2>
            <p>
              {t('sections.disclaimer.content')}
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold text-blue-400 mb-3">{t('sections.limitations.title')}</h2>
            <p>
              {t('sections.limitations.content')}
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold text-blue-400 mb-3">{t('sections.links.title')}</h2>
            <p>
              {t('sections.links.content')}
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold text-blue-400 mb-3">{t('sections.modifications.title')}</h2>
            <p>
              {t('sections.modifications.content')}
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold text-blue-400 mb-3">{t('sections.governingLaw.title')}</h2>
            <p>
              {t('sections.governingLaw.content')}
            </p>
          </section>
          
          <section id="community" className="pt-6 mt-6 border-t border-gray-700">
            <h2 className="text-xl font-semibold text-blue-400 mb-3">{t('sections.community.title')}</h2>
            <p>
              {t('sections.community.content')}
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              {(t('sections.community.items', { returnObjects: true }) as string[]).map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </section>
        </div>
        
        <div className="mt-10 pt-6 border-t border-gray-700 text-center">
          <p className="text-gray-400">
            {t('lastUpdated')} {new Date().toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TermsPage; 