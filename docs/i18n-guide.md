# Mindseye 多语言系统使用指南

本文档提供了关于如何在 Mindseye 项目中使用和维护多语言系统的指南。

## 目录

1. [基本概念](#基本概念)
2. [目录结构](#目录结构)
3. [使用翻译](#使用翻译)
4. [添加新翻译](#添加新翻译)
5. [工具和脚本](#工具和脚本)
6. [最佳实践](#最佳实践)
7. [故障排除](#故障排除)

## 基本概念

Mindseye 使用 i18next 作为多语言框架，支持以下功能：

- 多语言切换
- 命名空间分离
- 插值变量
- 复数形式
- 嵌套结构
- 命名空间回退

## 目录结构

翻译文件位于 `public/locales` 目录下，按语言代码组织：

```
/public
  /locales
    /en          # 英语（基准语言）
      common.json
      faq.json
      games.json
      ...
    /zh-TW       # 繁体中文
      common.json
      faq.json
      games.json
      ...
    /ja          # 日语
      common.json
      faq.json
      games.json
      ...
```

## 使用翻译

### 在组件中使用翻译

我们提供了 `TranslatedText` 组件来简化翻译的使用：

```jsx
import TranslatedText from '@/components/common/TranslatedText';

function MyComponent() {
  return (
    <div>
      <h1>
        <TranslatedText i18nKey="myComponent.title" />
      </h1>
      <p>
        <TranslatedText 
          i18nKey="myComponent.description" 
          ns="features" 
          values={{ name: 'Mindseye' }} 
        />
      </p>
    </div>
  );
}
```

### 在属性中使用翻译

对于需要在属性中使用翻译的情况，可以使用 `useTranslatedText` 钩子：

```jsx
import { useTranslatedText } from '@/components/common/TranslatedText';

function MyComponent() {
  const placeholderText = useTranslatedText('myComponent.searchPlaceholder');
  
  return (
    <input 
      type="text" 
      placeholder={placeholderText} 
    />
  );
}
```

### 使用原生 i18next API

也可以直接使用 i18next 的 API：

```jsx
import { useTranslation } from 'react-i18next';

function MyComponent() {
  const { t } = useTranslation(['common', 'features']);
  
  return (
    <div>
      <h1>{t('myComponent.title')}</h1>
      <p>{t('features:myComponent.description', { name: 'Mindseye' })}</p>
    </div>
  );
}
```

## 添加新翻译

### 步骤 1：在基准语言中添加翻译键

首先在英语（基准语言）的相应命名空间文件中添加新的翻译键：

```json
{
  "myComponent": {
    "title": "Welcome to Mindseye",
    "description": "Experience the future of gaming with {{name}}"
  }
}
```

### 步骤 2：检查缺失的翻译

运行翻译检查脚本，识别缺失的翻译：

```bash
npm run check-translations
```

### 步骤 3：为其他语言添加翻译

根据检查结果，在其他语言的相应文件中添加翻译：

```json
{
  "myComponent": {
    "title": "欢迎来到 Mindseye",
    "description": "与 {{name}} 一起体验游戏的未来"
  }
}
```

## 工具和脚本

我们提供了几个实用工具来帮助管理翻译：

### 翻译检查

检查所有语言的翻译文件是否包含相同的键：

```bash
npm run check-translations
```

### 翻译模板生成

从基准语言生成翻译模板：

```bash
npm run create-translation-template
```

### 硬编码文本检查

检查组件中可能存在的硬编码文本：

```bash
npm run extract-hardcoded-text
```

### 全面检查

运行所有检查：

```bash
npm run i18n-check
```

## 最佳实践

1. **使用命名空间**：合理划分命名空间，避免单个文件过大
2. **保持一致性**：在所有语言文件中保持相同的键结构
3. **避免重复**：共享文本应放在 common 命名空间中
4. **定期检查**：使用检查脚本定期验证翻译完整性
5. **使用 TranslatedText**：优先使用封装好的组件，而不是直接使用 i18next API
6. **避免硬编码**：不在组件中硬编码文本，始终使用翻译键

## 故障排除

### 翻译未显示

1. 检查翻译键是否正确
2. 确认翻译文件中存在该键
3. 验证命名空间是否正确指定
4. 在开发环境中查看控制台警告

### 语言切换不生效

1. 确认语言代码是否正确
2. 检查语言检测配置
3. 清除浏览器本地存储

### 命名空间加载问题

1. 确保命名空间在 i18n 配置中注册
2. 检查文件名是否与命名空间匹配
3. 验证文件路径是否正确 