'use client';

import { useMemo, useState } from 'react';

import { ChevronRight, Info, Plus, Search, X } from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import modelsData from '@/data/full.json';
import { applyPreset, MODEL_PRESETS } from '@/data/presets';
import type { Model } from '@/types/model';

export default function ModelCompare() {
  const [searchTerm, setSearchTerm] = useState('');
  const [compareList, setCompareList] = useState<Model[]>([]);
  const [infoDialog, setInfoDialog] = useState<{
    open: boolean;
    type: 'gpqa' | 'swe_bench' | 'mmmu' | null;
  }>({ open: false, type: null });

  const scoreDescriptions = {
    gpqa: {
      title: 'GPQA 分数',
      description:
        'GPQA (Graduate-Level Google-Proof Q&A) 是一个研究生级别的问答基准测试，涵盖物理、生物学和化学等领域。该测试旨在评估模型在处理复杂、专业领域问题时的推理能力。分数越高表示模型在专业领域的知识储备和推理能力越强。',
    },
    swe_bench: {
      title: 'SWE Bench 分数',
      description:
        'SWE Bench (Software Engineering Benchmark) 是一个软件工程基准测试，基于真实的 GitHub 问题。该测试评估模型在实际软件工程任务中的表现，包括代码理解、调试和修复能力。分数越高表示模型在软件工程任务中的实际应用能力越强。',
    },
    mmmu: {
      title: 'MMMU 分数',
      description:
        'MMMU (Massive Multi-discipline Multimodal Understanding) 是一个大规模多学科多模态理解基准测试，涵盖人文、社会科学、自然科学、工程和医学等学科。该测试评估模型在跨学科知识理解和多模态推理方面的综合能力。分数越高表示模型的知识广度和综合理解能力越强。',
    },
  };

  const models = useMemo(() => {
    const keywords = searchTerm.trim().split(/\s+/).filter(Boolean);
    if (keywords.length === 0) return modelsData;

    return modelsData.filter((model) => {
      const nameLower = model.name.toLowerCase();
      const orgLower = model.organization.toLowerCase();
      return keywords.every(
        (keyword) =>
          nameLower.includes(keyword.toLowerCase()) ||
          orgLower.includes(keyword.toLowerCase()),
      );
    });
  }, [searchTerm]);

  const addToCompare = (model: Model) => {
    if (compareList.find((m) => m.model_id === model.model_id)) return;
    if (compareList.length >= 5) return;
    setCompareList([...compareList, model]);
  };

  const removeFromCompare = (modelId: string) => {
    setCompareList(compareList.filter((m) => m.model_id !== modelId));
  };

  const clearCompareList = () => {
    setCompareList([]);
  };

  const filteredModels = models.filter(
    (m) => !compareList.find((c) => c.model_id === m.model_id),
  );

  return (
    <div className="min-h-screen bg-white text-black font-sans">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <header className="mb-16">
          <h1 className="text-5xl font-bold tracking-tight mb-4">
            LLM 模型对比
          </h1>
          <p className="text-xl text-zinc-600 max-w-2xl">
            选择并比较不同大语言模型的性能指标、价格和规格
          </p>
        </header>

        <div className="flex flex-col gap-12">
          <div className="border-t-2 border-black pt-6">
            <h2 className="text-2xl font-semibold mb-6">预设模型组</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {MODEL_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => {
                    const presetModels = applyPreset(modelsData, preset.id);
                    setCompareList(presetModels);
                  }}
                  className="p-6 border-2 border-zinc-300 hover:border-black hover:bg-zinc-50 transition-all text-left"
                >
                  <h3 className="font-semibold text-lg mb-2">{preset.name}</h3>
                  <p className="text-sm text-zinc-600 mb-3">
                    {preset.description}
                  </p>
                  <p className="text-xs text-zinc-500">
                    {preset.models.length} 个模型
                  </p>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="border-t-2 border-black pt-6 flex flex-col">
              <h2 className="text-2xl font-semibold mb-6">选择模型</h2>
              <div className="relative mb-6">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                <input
                  type="text"
                  placeholder="搜索模型名称或组织..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                  }}
                  className="w-full pl-12 pr-4 py-4 border-2 border-black bg-white text-black placeholder-zinc-400 focus:outline-none focus:ring-0"
                />
              </div>

              <div className="space-y-3 flex-1 overflow-y-auto max-h-[500px]">
                {filteredModels.slice(0, 20).map((model) => (
                  <div
                    key={model.model_id}
                    className="flex items-center justify-between p-4 border border-zinc-300 hover:border-black transition-colors"
                  >
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{model.name}</h3>
                      <p className="text-sm text-zinc-600">
                        {model.organization}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        addToCompare(model);
                      }}
                      disabled={compareList.length >= 5}
                      className="p-2 hover:bg-black hover:text-white transition-colors disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-black"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t-2 border-black pt-6 flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold">对比列表</h2>
                {compareList.length > 0 && (
                  <button
                    onClick={clearCompareList}
                    className="text-sm px-4 py-2 border border-zinc-300 hover:border-black hover:bg-zinc-50 transition-all"
                  >
                    清空
                  </button>
                )}
              </div>

              {compareList.length === 0 ? (
                <div className="p-12 border-2 border-dashed border-zinc-300 text-center flex-1 flex items-center justify-center">
                  <p className="text-zinc-500">从左侧选择模型添加到对比列表</p>
                </div>
              ) : (
                <div className="space-y-4 flex-1 overflow-y-auto max-h-[500px]">
                  {compareList.map((model) => (
                    <div
                      key={model.model_id}
                      className="flex items-center justify-between p-4 bg-zinc-100"
                    >
                      <div className="flex-1">
                        <h3 className="font-semibold">{model.name}</h3>
                        <p className="text-sm text-zinc-600">
                          {model.organization}
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          removeFromCompare(model.model_id);
                        }}
                        className="p-2 hover:bg-black hover:text-white transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {compareList.length > 0 && (
            <div className="border-t-2 border-black pt-6">
              <h2 className="text-2xl font-semibold mb-6">对比详情</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b-2 border-black">
                      <th className="text-left py-3 px-2 font-semibold">
                        模型
                      </th>
                      <th className="text-left py-3 px-2 font-semibold">
                        组织
                      </th>
                      <th className="text-left py-3 px-2 font-semibold">
                        上下文长度
                      </th>
                      <th className="text-left py-3 px-2 font-semibold">
                        多模态
                      </th>
                      <th className="text-left py-3 px-2 font-semibold">
                        输入价格
                      </th>
                      <th className="text-left py-3 px-2 font-semibold">
                        输出价格
                      </th>
                      <th className="text-left py-3 px-2 font-semibold">
                        <span className="inline-flex items-center">
                          GPQA 分数
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <button
                                  onClick={() => {
                                    setInfoDialog({ open: true, type: 'gpqa' });
                                  }}
                                  className="ml-1 inline-flex items-center hover:text-zinc-600"
                                >
                                  <Info className="w-4 h-4" />
                                </button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>点击查看详情</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </span>
                      </th>
                      <th className="text-left py-3 px-2 font-semibold">
                        <span className="inline-flex items-center">
                          SWE Bench 分数
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <button
                                  onClick={() => {
                                    setInfoDialog({
                                      open: true,
                                      type: 'swe_bench',
                                    });
                                  }}
                                  className="ml-1 inline-flex items-center hover:text-zinc-600"
                                >
                                  <Info className="w-4 h-4" />
                                </button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>点击查看详情</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </span>
                      </th>
                      <th className="text-left py-3 px-2 font-semibold">
                        <span className="inline-flex items-center">
                          MMMU 分数
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <button
                                  onClick={() => {
                                    setInfoDialog({ open: true, type: 'mmmu' });
                                  }}
                                  className="ml-1 inline-flex items-center hover:text-zinc-600"
                                >
                                  <Info className="w-4 h-4" />
                                </button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>点击查看详情</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </span>
                      </th>
                      <th className="text-left py-3 px-2 font-semibold">
                        发布日期
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {compareList.map((model, index) => (
                      <tr
                        key={model.model_id}
                        className={`border-b border-zinc-200 ${
                          index % 2 === 0 ? 'bg-zinc-50' : ''
                        }`}
                      >
                        <td className="py-3 px-2 font-semibold">
                          {model.name}
                        </td>
                        <td className="py-3 px-2">
                          {model.organization || '-'}
                        </td>
                        <td className="py-3 px-2">
                          {model.context ? model.context.toLocaleString() : '-'}
                        </td>
                        <td className="py-3 px-2">
                          {model.multimodal ? '是' : '否'}
                        </td>
                        <td className="py-3 px-2">
                          {model.input_price
                            ? `$${parseFloat(model.input_price).toFixed(2)}`
                            : '-'}
                        </td>
                        <td className="py-3 px-2">
                          {model.output_price
                            ? `$${parseFloat(model.output_price).toFixed(2)}`
                            : '-'}
                        </td>
                        <td className="py-3 px-2">
                          {model.gpqa_score
                            ? (model.gpqa_score * 100).toFixed(1) + '%'
                            : '-'}
                        </td>
                        <td className="py-3 px-2">
                          {model.swe_bench_verified_score
                            ? (model.swe_bench_verified_score * 100).toFixed(
                                1,
                              ) + '%'
                            : '-'}
                        </td>
                        <td className="py-3 px-2">
                          {model.mmmu_score
                            ? (model.mmmu_score * 100).toFixed(1) + '%'
                            : '-'}
                        </td>
                        <td className="py-3 px-2">
                          {model.release_date || '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        <Dialog
          open={infoDialog.open}
          onOpenChange={(open) => {
            setInfoDialog({ open, type: open ? infoDialog.type : null });
          }}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {infoDialog.type && scoreDescriptions[infoDialog.type].title}
              </DialogTitle>
              <DialogDescription>
                {infoDialog.type &&
                  scoreDescriptions[infoDialog.type].description}
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>

        <footer className="mt-16 pt-8 border-t border-zinc-200">
          <p className="text-sm text-zinc-500 text-center">
            数据来源：
            <a
              href="https://api.zeroeval.com/leaderboard/models/full"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-700 hover:text-black underline ml-1"
            >
              https://api.zeroeval.com/leaderboard/models/full
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
}
