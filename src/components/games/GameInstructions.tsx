import React from 'react';

/**
 * 游戏说明组件属性
 */
interface GameInstructionsProps {
  /**
   * 游戏操作说明文本
   */
  instructions: string;
}

/**
 * 游戏说明组件
 * 用于展示游戏的操作说明
 */
export default function GameInstructions({ instructions }: GameInstructionsProps) {
  // 处理指令格式化，支持换行符
  const formattedInstructions = instructions.split('\n').map((line, index) => (
    <p key={index} className="mb-1">
      {line}
    </p>
  ));

  return (
    <div className="bg-gray-800 rounded-xl p-4 mb-6 border border-blue-500/20">
      <h3 className="text-lg font-semibold text-blue-400 mb-2">游戏控制说明</h3>
      <div className="text-gray-300 whitespace-pre-line">
        {formattedInstructions}
      </div>
      <div className="mt-4 p-3 bg-gray-700 rounded-lg border-l-4 border-yellow-500">
        <p className="text-yellow-200 text-sm">
          提示：游戏加载后可能需要点击游戏区域以激活控制。部分游戏可能需要使用键盘、鼠标或触摸屏操作。
        </p>
      </div>
    </div>
  );
} 