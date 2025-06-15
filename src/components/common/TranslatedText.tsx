import React from 'react';
import { useTranslation, Trans } from 'react-i18next';

interface TranslatedTextProps {
  i18nKey: string;
  ns?: string | string[];
  values?: Record<string, any>;
  components?: Record<string, React.ReactNode>;
  defaultValue?: string;
}

/**
 * 通用翻译文本组件
 * 
 * 这个组件封装了react-i18next的翻译功能，提供一致的翻译体验
 * 
 * @param {string} i18nKey - 翻译键
 * @param {string|string[]} [ns] - 命名空间，默认使用common
 * @param {Object} [values] - 插值变量
 * @param {Object} [components] - Trans组件使用的组件映射
 * @param {string} [defaultValue] - 翻译缺失时的默认值
 */
export const TranslatedText: React.FC<TranslatedTextProps> = ({
  i18nKey,
  ns = 'common',
  values,
  components,
  defaultValue,
}) => {
  const { t } = useTranslation(ns);

  // 检查键是否包含HTML标签
  const hasHtml = defaultValue ? /<[a-z][\s\S]*>/i.test(defaultValue) : false;
  
  // 如果包含HTML或提供了components，使用Trans组件
  if (hasHtml || components) {
    return (
      <Trans
        i18nKey={i18nKey}
        ns={ns}
        values={values}
        defaults={defaultValue}
      >
        {defaultValue || i18nKey}
      </Trans>
    );
  }
  
  // 否则使用t函数
  if (defaultValue) {
    return <>{t(i18nKey, { ...values, defaultValue })}</>;
  }
  
  return <>{t(i18nKey, values)}</>;
};

/**
 * 仅翻译文本（不渲染React组件）
 * 
 * 用于获取纯文本翻译，适用于属性、标题等
 * 
 * @param {string} i18nKey - 翻译键
 * @param {string|string[]} [ns] - 命名空间，默认使用common
 * @param {Object} [values] - 插值变量
 * @param {string} [defaultValue] - 翻译缺失时的默认值
 */
export const useTranslatedText = (
  i18nKey: string,
  ns: string | string[] = 'common',
  values?: Record<string, any>,
  defaultValue?: string
): string => {
  const { t } = useTranslation(ns);
  
  if (defaultValue) {
    return t(i18nKey, { ...values, defaultValue });
  }
  
  return t(i18nKey, values);
};

export default TranslatedText; 