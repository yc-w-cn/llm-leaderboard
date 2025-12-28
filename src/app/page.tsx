'use client';

import { useMemo, useState } from 'react';

import { ChevronRight, Plus, Search, X } from 'lucide-react';

import modelsData from '@/data/full.json';
import type { Model } from '@/types/model';

export default function ModelCompare() {
  const [searchTerm, setSearchTerm] = useState('');
  const [compareList, setCompareList] = useState<Model[]>([]);

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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-8">
            <div className="border-t-2 border-black pt-6">
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

              <div className="space-y-3 max-h-[500px] overflow-y-auto">
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
          </div>

          <div className="space-y-8">
            <div className="border-t-2 border-black pt-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold">对比列表</h2>
                <span className="text-sm text-zinc-600">
                  {compareList.length}/5
                </span>
              </div>

              {compareList.length === 0 ? (
                <div className="p-12 border-2 border-dashed border-zinc-300 text-center">
                  <p className="text-zinc-500">从左侧选择模型添加到对比列表</p>
                </div>
              ) : (
                <div className="space-y-4 mb-8">
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

            {compareList.length > 0 && (
              <div className="border-t-2 border-black pt-6">
                <h2 className="text-2xl font-semibold mb-6">对比详情</h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b-2 border-black">
                        <th className="text-left py-3 px-2 font-semibold">
                          指标
                        </th>
                        {compareList.map((model) => (
                          <th
                            key={model.model_id}
                            className="text-left py-3 px-2 font-semibold"
                          >
                            {model.name}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-zinc-200">
                        <td className="py-3 px-2 font-medium">组织</td>
                        {compareList.map((model) => (
                          <td key={model.model_id} className="py-3 px-2">
                            {model.organization || '-'}
                          </td>
                        ))}
                      </tr>
                      <tr className="border-b border-zinc-200 bg-zinc-50">
                        <td className="py-3 px-2 font-medium">上下文长度</td>
                        {compareList.map((model) => (
                          <td key={model.model_id} className="py-3 px-2">
                            {model.context
                              ? model.context.toLocaleString()
                              : '-'}
                          </td>
                        ))}
                      </tr>
                      <tr className="border-b border-zinc-200">
                        <td className="py-3 px-2 font-medium">多模态</td>
                        {compareList.map((model) => (
                          <td key={model.model_id} className="py-3 px-2">
                            {model.multimodal ? '是' : '否'}
                          </td>
                        ))}
                      </tr>
                      <tr className="border-b border-zinc-200 bg-zinc-50">
                        <td className="py-3 px-2 font-medium">输入价格</td>
                        {compareList.map((model) => (
                          <td key={model.model_id} className="py-3 px-2">
                            {model.input_price
                              ? `$${parseFloat(model.input_price).toFixed(2)}`
                              : '-'}
                          </td>
                        ))}
                      </tr>
                      <tr className="border-b border-zinc-200">
                        <td className="py-3 px-2 font-medium">输出价格</td>
                        {compareList.map((model) => (
                          <td key={model.model_id} className="py-3 px-2">
                            {model.output_price
                              ? `$${parseFloat(model.output_price).toFixed(2)}`
                              : '-'}
                          </td>
                        ))}
                      </tr>
                      <tr className="border-b border-zinc-200 bg-zinc-50">
                        <td className="py-3 px-2 font-medium">GPQA 分数</td>
                        {compareList.map((model) => (
                          <td key={model.model_id} className="py-3 px-2">
                            {model.gpqa_score
                              ? (model.gpqa_score * 100).toFixed(1) + '%'
                              : '-'}
                          </td>
                        ))}
                      </tr>
                      <tr className="border-b border-zinc-200">
                        <td className="py-3 px-2 font-medium">
                          SWE Bench 分数
                        </td>
                        {compareList.map((model) => (
                          <td key={model.model_id} className="py-3 px-2">
                            {model.swe_bench_verified_score
                              ? (model.swe_bench_verified_score * 100).toFixed(
                                  1,
                                ) + '%'
                              : '-'}
                          </td>
                        ))}
                      </tr>
                      <tr className="border-b border-zinc-200 bg-zinc-50">
                        <td className="py-3 px-2 font-medium">MMMU 分数</td>
                        {compareList.map((model) => (
                          <td key={model.model_id} className="py-3 px-2">
                            {model.mmmu_score
                              ? (model.mmmu_score * 100).toFixed(1) + '%'
                              : '-'}
                          </td>
                        ))}
                      </tr>
                      <tr className="border-b border-zinc-200">
                        <td className="py-3 px-2 font-medium">发布日期</td>
                        {compareList.map((model) => (
                          <td key={model.model_id} className="py-3 px-2">
                            {model.release_date || '-'}
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>

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
