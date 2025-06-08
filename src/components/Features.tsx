import React from 'react';
import { Car, Crosshair, Skull, Medal } from 'lucide-react';

const Features = () => {
  const features = [
    {
      icon: <Car className="w-12 h-12" />,
      title: "Aventador Vice Crime City",
      description: "Experience thrilling city driving with realistic traffic, police chases, and customizable vehicles. Navigate busy streets, monitor your fuel, and enjoy stunning urban environments while evading law enforcement."
    },
    {
      icon: <Crosshair className="w-12 h-12" />,
      title: "Strykon FPS Action",
      description: "Jump into intense first-person shooter combat with multiple game modes including Deathmatch and Team Deathmatch. Choose from an arsenal of weapons and test your tactical skills in fast-paced battles."
    },
    {
      icon: <Skull className="w-12 h-12" />,
      title: "Feed me Monsters",
      description: "Face challenging enemies in this strategic idle battle game. Defeat bizarre creatures, earn rewards, unlock new abilities, and develop unique strategies to overcome increasingly difficult opponents."
    },
    {
      icon: <Medal className="w-12 h-12" />,
      title: "Compete for High Scores",
      description: "Challenge thousands of online players across all three games, climbing leaderboards and earning achievements while testing your reflexes, strategy, and perception skills in the Mindseye gaming universe."
    }
  ];

  return (
    <section className="py-20 bg-gray-900 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-transparent"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-white mb-6 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Game Features
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Explore three distinct gaming experiences that challenge different skills - from driving and shooting to strategic combat. Each game offers unique mechanics that test your perception and reflexes.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group bg-black/40 backdrop-blur-md rounded-2xl p-6 border border-blue-500/20 hover:border-blue-500/50 transition-all duration-300 hover:transform hover:scale-105"
            >
              <div className="text-blue-400 mb-4 group-hover:text-blue-300 transition-colors">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-300 transition-colors">
                {feature.title}
              </h3>
              <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors">
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