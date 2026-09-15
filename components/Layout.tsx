import React from 'react';
import { Sparkles, ShieldCheck, MapPin, Printer } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  onPrint?: () => void;
  hasResult?: boolean;
}

export const Layout: React.FC<LayoutProps> = ({ children, onPrint, hasResult }) => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-800 antialiased selection:bg-blue-100 selection:text-blue-900">
      {/* Top Banner & Header */}
      <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-30 shadow-sm no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 text-white p-2 rounded-lg flex items-center justify-center shadow-inner">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold tracking-wider text-blue-400 uppercase">Hokkaido AI Subsidy Agent</span>
                  <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-medium bg-blue-950 text-blue-300 border border-blue-800 rounded">
                    北海道・主要3制度対応
                  </span>
                </div>
                <h1 className="text-base sm:text-lg font-bold text-white tracking-tight leading-tight">
                  北海道補助金AI診断
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <span className="hidden md:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                タイパ最重視・最短入力
              </span>

              {hasResult && onPrint && (
                <button
                  type="button"
                  onClick={onPrint}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition-colors shadow-sm"
                  title="A4印刷・PDF出力"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">印刷 / PDF保存</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main App Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-xs text-slate-500 no-print mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>
              本ツールは申請準備と事業計画書ドラフトの作成を支援します。採択・受給を保証するものではありません。
            </span>
          </div>
          <p className="text-slate-400">
            © 北海道中小企業AI推進支援パートナー
          </p>
        </div>
      </footer>
    </div>
  );
};
