import dataTimestamp from '@/data/data-timestamp.json';

export function Footer() {
  return (
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
      <p className="text-xs text-zinc-400 text-center mt-2">
        版本 {process.env.NEXT_PUBLIC_APP_VERSION} · 编译于{' '}
        {process.env.NEXT_PUBLIC_BUILD_DATE
          ? new Date(process.env.NEXT_PUBLIC_BUILD_DATE).toLocaleString('zh-CN')
          : ''}
        {' · 数据更新于 '}
        {dataTimestamp?.formatted || '未知'}
      </p>
    </footer>
  );
}
