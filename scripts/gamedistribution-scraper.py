#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
GameDistribution 游戏爬虫
此脚本从 GameDistribution API 获取游戏数据并保存为 JSON 和 CSV 格式

使用方法:
    python gamedistribution-scraper.py [页数]

参数:
    页数: 要爬取的页数 (默认: 3)

示例:
    python gamedistribution-scraper.py 5
"""

import requests
import pandas as pd
import json
import time
import os
import sys
from pathlib import Path
from tqdm import tqdm
import re

class GameDistributionCrawler:
    def __init__(self):
        """初始化爬虫"""
        # API 基础 URL
        self.base_url = "https://catalog.api.gamedistribution.com/api/v1.0/rss/All/?collection=All&categories=All&tags=All&subType=All&type=All&mobile=All&rewarded=all&amount=100&page={}"
        
        # 输出文件路径
        self.script_dir = Path(os.path.dirname(os.path.abspath(__file__)))
        self.data_dir = self.script_dir.parent / "src" / "data"
        self.output_csv = self.data_dir / "game_iframes.csv"
        self.output_json = self.data_dir / "gamedistribution_games.json"
        
        # 确保数据目录存在
        if not self.data_dir.exists():
            self.data_dir.mkdir(parents=True)
        
        print(f"输出目录: {self.data_dir}")

    def fetch_games(self, pages=3):
        """获取多页游戏数据
        
        Args:
            pages (int): 要爬取的页数
            
        Returns:
            list: 游戏数据列表
        """
        all_games = []
        
        for page in range(1, pages + 1):
            try:
                print(f"正在获取第 {page}/{pages} 页游戏列表...")
                response = requests.get(self.base_url.format(page), timeout=15)
                
                if response.status_code == 200:
                    games = response.json()
                    all_games.extend(games)
                    print(f"第 {page} 页获取到 {len(games)} 个游戏")
                    
                    # 避免请求过快
                    if page < pages:
                        time.sleep(1)
                else:
                    print(f"获取第 {page} 页失败: HTTP {response.status_code}")
                    break
                    
            except Exception as e:
                print(f"获取第 {page} 页时出错: {e}")
                continue
                
        return all_games

    def process_games(self, games):
        """处理游戏数据，提取需要的字段
        
        Args:
            games (list): 从 API 获取的游戏数据列表
            
        Returns:
            list: 处理后的游戏数据列表
        """
        processed_games = []
        
        print(f"处理 {len(games)} 个游戏数据...")
        
        # 首先打印第一个游戏的原始数据，了解结构
        if games and len(games) > 0:
            print("游戏数据样例结构:", json.dumps(games[0], indent=2))
        
        for game in tqdm(games):
            try:
                # API返回的键名是大写的
                title = game.get('Title')
                description = game.get('Description')
                instructions = game.get('Instructions', '')
                
                # 从Asset数组中获取缩略图URL
                thumbnail_url = None
                assets = game.get('Asset', [])
                if assets and isinstance(assets, list):
                    # 优先选择分辨率较低的缩略图
                    for asset in assets:
                        if '200x120' in asset:
                            thumbnail_url = asset
                            break
                    # 如果没有找到小缩略图，使用第一个
                    if not thumbnail_url and assets:
                        thumbnail_url = assets[0]
                
                # 获取游戏URL
                game_url = game.get('Url')
                
                # 获取Game ID
                game_id = None
                if game_url:
                    # 提取最后一个斜杠后面的ID
                    match = re.search(r'/([^/]+)/?$', game_url)
                    if match:
                        game_id = match.group(1)
                        # 移除查询字符串
                        if '?' in game_id:
                            game_id = game_id.split('?')[0]
                
                # 如果无法提取游戏ID，使用标题生成
                if not game_id and title:
                    game_id = title.lower().replace(' ', '-')
                    game_id = ''.join(c for c in game_id if c.isalnum() or c == '-')
                
                # 必须字段检查
                if not all([title, description, thumbnail_url, game_url, game_id]):
                    continue
                    
                # 处理描述 (截断过长描述)
                if description and len(description) > 500:
                    description = description[:497] + '...'
                
                # 确保iframe URL正确格式化
                iframe_url = game_url
                if not iframe_url.endswith('/'):
                    iframe_url = iframe_url + '/'
                
                # 获取分类
                categories = game.get('Category', ['Action'])
                category = categories[0] if categories else 'Action'
                
                # 获取标签
                tags = game.get('Tag', [])
                
                # 自动生成的游戏亮点
                highlights = [
                    f'Challenge yourself in this exciting {category} game',
                    'Simple and intuitive controls',
                    'Gradually increasing difficulty'
                ]
                
                # 组装游戏数据
                processed_game = {
                    'id': game_id,
                    'title': title,
                    'description': description,
                    'thumbnailUrl': thumbnail_url,
                    'iframeUrl': iframe_url,
                    'controls': instructions or '使用键盘和鼠标控制游戏',  # 使用API提供的控制说明
                    'highlights': highlights,
                    'originalUrl': game_url,
                    'category': category,
                    'tags': tags
                }
                
                processed_games.append(processed_game)
                
            except Exception as e:
                print(f"处理游戏时出错: {str(e)}")
                continue
                
        return processed_games

    def save_to_files(self, games):
        """将游戏数据保存到 CSV 和 JSON 文件
        
        Args:
            games (list): 处理后的游戏数据列表
        """
        # 保存为 JSON
        games_data = {'games': games}
        with open(self.output_json, 'w', encoding='utf-8') as f:
            json.dump(games_data, f, ensure_ascii=False, indent=2)
            
        print(f"JSON 文件已保存到 {self.output_json}")
        
        # 保存为 CSV (排除tags字段，因为它是列表类型)
        df_games = []
        for game in games:
            game_copy = game.copy()
            if 'tags' in game_copy:
                del game_copy['tags']
            df_games.append(game_copy)
            
        df = pd.DataFrame(df_games)
        df.to_csv(self.output_csv, index=False, encoding='utf-8')
        
        print(f"CSV 文件已保存到 {self.output_csv}")
        
        # 打印统计信息
        print(f"总共获取并处理了 {len(games)} 个游戏")

    def merge_with_existing_data(self, new_games):
        """将新获取的游戏与现有的游戏数据合并
        
        Args:
            new_games (list): 新获取的游戏数据列表
            
        Returns:
            list: 合并后的游戏数据列表
        """
        # 检查是否存在现有的游戏数据文件
        existing_games = []
        existing_games_file = self.data_dir / "games.json"
        
        if existing_games_file.exists():
            try:
                with open(existing_games_file, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                    if 'games' in data:
                        existing_games = data['games']
                        print(f"从 {existing_games_file} 读取了 {len(existing_games)} 个现有游戏")
            except Exception as e:
                print(f"读取现有游戏数据失败: {e}")
        
        # 合并游戏数据，避免重复
        existing_ids = {game['id'] for game in existing_games}
        merged_games = existing_games.copy()
        
        added_count = 0
        for game in new_games:
            if game['id'] not in existing_ids:
                merged_games.append(game)
                existing_ids.add(game['id'])
                added_count += 1
        
        print(f"新增了 {added_count} 个游戏，合并后共有 {len(merged_games)} 个游戏")
        
        return merged_games

    def run(self, pages=3):
        """运行爬虫
        
        Args:
            pages (int): 要爬取的页数
        """
        print(f"开始爬取 GameDistribution 游戏数据，页数: {pages}")
        
        # 获取游戏数据
        raw_games = self.fetch_games(pages)
        
        if not raw_games:
            print("未获取到游戏数据，退出")
            return
            
        # 处理游戏数据
        processed_games = self.process_games(raw_games)
        
        if not processed_games:
            print("处理后没有有效的游戏数据，退出")
            return
            
        print(f"成功处理 {len(processed_games)} 个游戏")
        
        # 合并已有数据
        merged_games = self.merge_with_existing_data(processed_games)
        
        # 保存合并后的数据
        games_data = {'games': merged_games}
        with open(self.data_dir / "games.json", 'w', encoding='utf-8') as f:
            json.dump(games_data, f, ensure_ascii=False, indent=2)
            
        # 保存原始数据
        self.save_to_files(processed_games)
        
        print("爬虫运行完成！")


if __name__ == "__main__":
    # 获取命令行参数
    pages = 3  # 默认爬取 3 页
    if len(sys.argv) > 1:
        try:
            pages = int(sys.argv[1])
        except ValueError:
            print(f"无效的页数参数: {sys.argv[1]}，使用默认值 3")
    
    # 运行爬虫
    crawler = GameDistributionCrawler()
    crawler.run(pages) 