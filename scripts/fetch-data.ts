// 安装依赖：pnpm add -D tsx @types/node

import fs from 'fs';
import path from 'path';

const API_URL = 'https://api.zeroeval.com/leaderboard/models/full';
const DATA_DIR = path.join(process.cwd(), 'src/data');
const FULL_JSON_PATH = path.join(DATA_DIR, 'full.json');
const DATA_TIMESTAMP_PATH = path.join(DATA_DIR, 'data-timestamp.json');

async function fetchData() {
  console.log('正在获取数据...');

  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error(`HTTP 错误! 状态: ${response.status}`);
    }

    const data = await response.json();

    // 确保 data 目录存在
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    // 保存 full.json
    fs.writeFileSync(FULL_JSON_PATH, JSON.stringify(data, null, 2), 'utf-8');
    console.log(`已保存数据到 ${FULL_JSON_PATH}`);

    // 生成数据时间文件
    const now = new Date();
    const timestampData = {
      timestamp: now.toISOString(),
      formatted: now.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      }),
    };

    fs.writeFileSync(
      DATA_TIMESTAMP_PATH,
      JSON.stringify(timestampData, null, 2),
      'utf-8',
    );
    console.log(`已保存数据时间到 ${DATA_TIMESTAMP_PATH}`);
    console.log(`数据时间: ${timestampData.formatted}`);

    console.log('数据获取完成!');
  } catch (error) {
    console.error('获取数据失败:', error);
    process.exit(1);
  }
}

void fetchData();
