/**
 * 游戏数据接口定义
 * 用于定义网站中使用的游戏数据结构
 */

export interface Game {
  /**
   * 游戏唯一标识符
   */
  id: string;
  
  /**
   * 游戏标题
   */
  title: string;
  
  /**
   * 游戏描述文本
   */
  description: string;
  
  /**
   * 游戏操作说明
   */
  instructions: string;
  
  /**
   * 游戏缩略图URL
   */
  thumbnailUrl: string;
  
  /**
   * 游戏嵌入URL (iframe src)
   */
  embedUrl: string;
  
  /**
   * URL友好的游戏标识符
   */
  slug: string;
  
  /**
   * 游戏亮点列表
   */
  highlights: string[];
  
  /**
   * 游戏分类
   */
  category: string;
  
  /**
   * 游戏标签
   */
  tags: string[];
  
  /**
   * 游戏数据创建时间
   */
  createdAt: string;
  
  /**
   * 游戏数据更新时间
   */
  updatedAt: string;
  
  /**
   * 游戏详情页URL (可选)
   */
  gameUrl?: string;
} 