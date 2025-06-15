import React from 'react';
import { Gamepad2, Zap, Users, Globe, Sparkles, Shield } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Features = () => {
  const { t } = useTranslation('features');
  
  // Feature icons
  const featureIcons = [
    <Gamepad2 className="w-7 h-7 text-blue-400" />,
    <Zap className="w-7 h-7 text-blue-400" />,
    <Users className="w-7 h-7 text-blue-400" />,
    <Globe className="w-7 h-7 text-blue-400" />,
    <Sparkles className="w-7 h-7 text-blue-400" />,
    <Shield className="w-7 h-7 text-blue-400" />
  ];
  
  // Get features from translation file
  const features = t('features', { returnObjects: true }) || [];

  return (
    <section className="py-20 bg-gradient-to-b from-black to-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{t('title')}</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.isArray(features) && features.map((feature, index) => (
            <div 
              key={index} 
              id={index === 2 ? 'community' : undefined}
              className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-blue-500/20 hover:border-blue-500/40 transition-colors"
            >
              <div className="bg-blue-600/20 w-14 h-14 rounded-lg flex items-center justify-center mb-6">
                {featureIcons[index % featureIcons.length]}
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-400">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;