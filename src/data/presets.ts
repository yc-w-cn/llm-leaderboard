import type { Model } from '@/types/model';

export interface ModelPreset {
  id: string;
  name: string;
  description: string;
  models: string[];
}

export const MODEL_PRESETS: ModelPreset[] = [
  {
    id: 'trae-cn',
    name: 'TRAE 中文模型组',
    description: '包含国内主流大语言模型',
    models: [
      'GLM-4.7',
      'GLM-4.6',
      'MiniMax M2.1', // 原名: MiniMax-M2.1
      'MiniMax M2', // 原名: MiniMax-M2
      'Kimi K2 0905', // 原名: Kimi-K2-0905
      'Qwen3-Coder 480B A35B Instruct', // 原名: Qwen-3-Coder
      // Doubao-Seed-1.8 - 数据源中不存在
      // Doubao-Seed-Code - 数据源中不存在
      // DeepSeek-V3.1-Terminus - 数据源中不存在
    ],
  },
  {
    id: 'trae',
    name: 'TRAE 模型组',
    description: '包含国际主流大语言模型',
    models: [
      'Gemini 3 Pro', // 原名: Gemini-3-Pro-Preview
      'Gemini 2.5 Pro', // 原名: Gemini-2.5-Pro
      'Kimi K2 0905', // 原名: Kimi-K2-0905
      'GPT-5.2', // 原名: GPT-5.2 Beta
      'GPT-5.1',
      'Grok-4', // 原名: DeepSeek-V3.1Grok-4 Beta
      'Gemini 3 Flash', // 原名: Gemini-3-Flash-Preview
      'Gemini 2.5 Flash', // 原名: Gemini-2.5-Flash
      // Gemini-3-Pro-Preview(200K) - 数据源中不存在
      'DeepSeek-V3.1', // DeepSeek-V3.1 - 数据源中不存在
      // GPT-5-medium - 数据源中不存在
      // GPT-5-high - 数据源中不存在
    ],
  },
  {
    id: 'alpha-xiv',
    name: 'ALPHA XIV 模型组',
    description: '包含 ALPHA XIV 选择的模型',
    models: [
      'Gemini 3 Flash',
      'Gemini 3 Pro',
      'Claude Sonnet 4.5',
      'GPT-5',
      'GPT OSS 120B', // GPT OSS
      'Llama 4 Maverick',
      'Qwen3 235B A22B', // Qwen 3
      'Qwen3-Next-80B-A3B-Base', // Qwen 3 Next
      'Kimi K2 Base', // Kimi K2
    ],
  },
];

export function applyPreset(allModels: Model[], presetId: string): Model[] {
  const preset = MODEL_PRESETS.find((p) => p.id === presetId);
  if (!preset) return [];

  const presetModels: Model[] = [];
  for (const modelName of preset.models) {
    const model = allModels.find((m) => m.name === modelName);
    if (model) {
      presetModels.push(model);
    }
  }
  return presetModels;
}
