import React from 'react';
import { Star } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface Testimonial {
  name: string;
  role: string;
  content: string;
  rating: number;
}

const Testimonials = () => {
  const { i18n } = useTranslation();
  const isEnglish = i18n.language.startsWith('en');
  
  // 硬编码的评价数据 - 英文版本
  const testimonialsEN: Testimonial[] = [
    {
      name: "Alex Chen",
      role: "Casual Gamer",
      content: "Mindseye has become my go-to site during breaks. The variety of games is impressive, and I love that I can play instantly without installing anything. The puzzle games are particularly addictive!",
      rating: 5
    },
    {
      name: "Sarah Johnson",
      role: "Mobile Gaming Enthusiast",
      content: "I'm amazed at how well the games perform on my phone. No lag, easy controls, and the site remembers my progress. The categorization makes it easy to find exactly what I'm in the mood for.",
      rating: 5
    },
    {
      name: "Michael Rodriguez",
      role: "Strategy Game Fan",
      content: "As someone who loves strategy games, I appreciate the quality of games in that category. The leaderboards add a competitive element that keeps me coming back to improve my scores.",
      rating: 4
    },
    {
      name: "Emma Wilson",
      role: "Parent",
      content: "I'm a parent who's always looking for safe, educational games for my kids. Mindseye has a great selection of age-appropriate content that my children enjoy. The absence of inappropriate ads is a huge plus.",
      rating: 5
    },
    {
      name: "David Park",
      role: "Student",
      content: "This site has been a lifesaver during study breaks. The games load quickly even on my old laptop, and there's always something new to try. The puzzle section has actually helped improve my problem-solving skills!",
      rating: 4
    },
    {
      name: "Olivia Martinez",
      role: "Retro Gaming Enthusiast",
      content: "I love the collection of retro-style games that remind me of classics from my childhood, but with modern twists. The site runs smoothly and the game controls are intuitive across different devices.",
      rating: 5
    }
  ];
  
  // 硬编码的评价数据 - 中文版本
  const testimonialsCN: Testimonial[] = [
    {
      name: "Alex Chen",
      role: "休闲游戏玩家",
      content: "Mindseye已经成为我休息时间的首选网站。游戏种类令人印象深刻，我喜欢不需要安装就能立即玩的便利性。尤其是那些益智游戏，真的很容易上瘾！",
      rating: 5
    },
    {
      name: "Sarah Johnson",
      role: "移动游戏爱好者",
      content: "我惊讶于游戏在我手机上的表现有多流畅。没有延迟，控制简单，而且网站会记住我的进度。游戏分类让我很容易找到我想玩的类型。",
      rating: 5
    },
    {
      name: "Michael Rodriguez",
      role: "策略游戏粉丝",
      content: "作为一个热爱策略游戏的人，我很欣赏这个类别中游戏的质量。排行榜增加了竞争元素，让我不断回来提高自己的分数。",
      rating: 4
    },
    {
      name: "Emma Wilson",
      role: "家长",
      content: "作为家长，我一直在寻找安全、有教育意义的游戏给孩子们玩。Mindseye有很多适合不同年龄段的内容，我的孩子们都很喜欢。没有不适当的广告是一个巨大的优势。",
      rating: 5
    },
    {
      name: "David Park",
      role: "学生",
      content: "这个网站在学习休息时间简直是救星。即使在我的旧笔记本上，游戏也能快速加载，而且总有新东西可以尝试。益智游戏区实际上帮助提高了我的解决问题能力！",
      rating: 4
    },
    {
      name: "Olivia Martinez",
      role: "复古游戏爱好者",
      content: "我喜欢这里收藏的复古风格游戏，它们让我想起童年时的经典游戏，但又有现代的创新。网站运行流畅，在不同设备上的游戏控制都很直观。",
      rating: 5
    }
  ];

  // 根据当前语言选择评价数据
  const testimonials = isEnglish ? testimonialsEN : testimonialsCN;

  // 渲染星级评分
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${index < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-400'}`}
      />
    ));
  };

  // 标题和副标题
  const title = isEnglish ? "What Our Players Say" : "玩家评价";
  const subtitle = isEnglish 
    ? "Hear from the Mindseye gaming community" 
    : "来自Mindseye游戏社区的真实评价";

  return (
    <section className="py-20 bg-black">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{title}</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">{subtitle}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              className="bg-gray-900/50 backdrop-blur-sm p-6 rounded-xl border border-blue-500/20 hover:border-blue-500/40 transition-colors"
            >
              <div className="flex items-center mb-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                    {testimonial.name.charAt(0)}
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-white font-semibold">{testimonial.name}</h3>
                  <p className="text-gray-400 text-sm">[{testimonial.role}]</p>
                </div>
              </div>
              
              <div className="flex mb-3">
                {renderStars(testimonial.rating)}
              </div>
              
              <p className="text-gray-300 italic">"{testimonial.content}"</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;