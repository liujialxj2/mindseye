import React from 'react';
import { Star, Quote } from 'lucide-react';

const Testimonials = () => {
  const testimonials = [
    {
      name: "Alex Chen",
      role: "Racing Game Enthusiast",
      rating: 5,
      comment: "Aventador Vice Crime City is the perfect blend of driving mechanics and open-world action. The police chases are intense and the city graphics are stunning. Best driving game I've played online!",
      avatar: "AC"
    },
    {
      name: "Sarah Rodriguez",
      role: "FPS Player",
      rating: 5,
      comment: "Strykon delivers incredible FPS action with responsive controls and exciting game modes. The weapon variety keeps gameplay fresh and the team deathmatch mode is especially addictive.",
      avatar: "SR"
    },
    {
      name: "Marcus Thompson",
      role: "Strategy Gamer",
      rating: 5,
      comment: "Feed me Monsters has the perfect balance of idle gameplay and strategic depth. I love unlocking new abilities and discovering effective tactics to defeat increasingly powerful enemies.",
      avatar: "MT"
    },
    {
      name: "Elena Kowalski",
      role: "Casual Gamer",
      rating: 5,
      comment: "All three Mindseye mini-games are incredibly polished and fun to play. They're perfect for quick gaming sessions but engaging enough to keep me coming back for hours.",
      avatar: "EK"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-gray-900 to-black relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/1169754/pexels-photo-1169754.jpeg')] bg-cover bg-center opacity-5"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-white mb-6 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            What Players Say
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Join thousands of players already enjoying our collection of mini-games, from heart-pounding racing action to tactical combat and strategic monster battles.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-black/60 backdrop-blur-md rounded-2xl p-6 border border-blue-500/20 hover:border-blue-500/50 transition-all duration-300"
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold mr-4">
                  {testimonial.avatar}
                </div>
                <div>
                  <h4 className="text-white font-semibold">{testimonial.name}</h4>
                  <p className="text-gray-400 text-sm">{testimonial.role}</p>
                </div>
              </div>

              <div className="flex mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-500 fill-current" />
                ))}
              </div>

              <div className="relative">
                <Quote className="w-6 h-6 text-blue-400 mb-2" />
                <p className="text-gray-300 italic leading-relaxed">
                  "{testimonial.comment}"
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;