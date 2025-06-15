import React from 'react';
import { useTranslation } from 'react-i18next';

const PrivacyPage: React.FC = () => {
  const { t } = useTranslation('privacy');
  
  return (
    <div className="container mx-auto px-4 py-20 mt-16">
      <div className="max-w-4xl mx-auto bg-gray-900 rounded-xl p-8 shadow-lg border border-blue-500/20">
        <h1 className="text-3xl font-bold text-white mb-6">{t('title')}</h1>
        
        <div className="space-y-6 text-gray-300">
          <section>
            <h2 className="text-xl font-semibold text-blue-400 mb-3">{t('sections.collection.title')}</h2>
            <p>
              {t('sections.collection.content')}
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              {(t('sections.collection.items', { returnObjects: true }) as string[]).map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold text-blue-400 mb-3">{t('sections.usage.title')}</h2>
            <p>
              {t('sections.usage.content')}
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              {(t('sections.usage.items', { returnObjects: true }) as string[]).map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold text-blue-400 mb-3">{t('sections.cookies.title')}</h2>
            <p>
              {t('sections.cookies.content')}
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              {(t('sections.cookies.items', { returnObjects: true }) as string[]).map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
            <p className="mt-2">
              {t('sections.cookies.additional')}
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold text-blue-400 mb-3">{t('sections.thirdParty.title')}</h2>
            <p>
              {t('sections.thirdParty.content')}
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              {(t('sections.thirdParty.items', { returnObjects: true }) as string[]).map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
            <p className="mt-2">
              {t('sections.thirdParty.additional')}
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold text-blue-400 mb-3">{t('sections.security.title')}</h2>
            <p>
              {t('sections.security.content')}
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold text-blue-400 mb-3">{t('sections.children.title')}</h2>
            <p>
              {t('sections.children.content')}
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold text-blue-400 mb-3">{t('sections.rights.title')}</h2>
            <p>
              {t('sections.rights.content')}
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              {(t('sections.rights.items', { returnObjects: true }) as string[]).map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold text-blue-400 mb-3">{t('sections.changes.title')}</h2>
            <p>
              {t('sections.changes.content')}
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold text-blue-400 mb-3">{t('sections.contact.title')}</h2>
            <p>
              {t('sections.contact.content')}
            </p>
            <p className="mt-2">
              <a href={`mailto:${t('sections.contact.email')}`} className="text-blue-400 hover:underline">{t('sections.contact.email')}</a>
            </p>
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

export default PrivacyPage; 