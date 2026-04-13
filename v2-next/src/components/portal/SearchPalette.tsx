"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Search, TrendingUp, Newspaper, X } from 'lucide-react';

interface Result {
    symbol: string;
    name: string;
    type: 'Stock' | 'Index' | 'News';
}

const MOCK_ASSETS: Result[] = [
    { symbol: 'KOSPI', name: '코스피', type: 'Index' },
    { symbol: 'KOSDAQ', name: '코스닥', type: 'Index' },
    { symbol: 'NASDAQ', name: '나스닥', type: 'Index' },
    { symbol: 'S&P500', name: 'S&P 500', type: 'Index' },
    { symbol: 'BTC', name: '비트코인', type: 'Stock' },
    { symbol: 'ETH', name: '이더리움', type: 'Stock' },
    { symbol: 'AAPL', name: 'Apple Inc.', type: 'Stock' },
    { symbol: 'TSLA', name: 'Tesla Inc.', type: 'Stock' },
];

export default function SearchPalette({ onClose }: { onClose: () => void }) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<Result[]>([]);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    useEffect(() => {
        if (query.length < 1) {
            setResults([]);
            return;
        }

        const filtered = MOCK_ASSETS.filter(item =>
            item.name.toLowerCase().includes(query.toLowerCase()) ||
            item.symbol.toLowerCase().includes(query.toLowerCase())
        );
        setResults(filtered);
    }, [query]);

    return (
        <div className="search-overlay" onClick={onClose}>
            <div className="search-modal" onClick={e => e.stopPropagation()}>
                <div className="search-input-wrapper">
                    <Search className="search-icon" size={20} />
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="종목, 지수, 뉴스 검색..."
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        onKeyDown={e => e.key === 'Escape' && onClose()}
                    />
                    <button onClick={onClose} className="close-btn">
                        <X size={20} />
                    </button>
                </div>

                <div className="search-results custom-scrollbar">
                    {query && results.length === 0 && (
                        <div className="no-results">검색 결과가 없습니다.</div>
                    )}

                    {!query && (
                        <div className="recent-searches">
                            <h4 className="section-title">추천 검색어</h4>
                            <div className="suggestion-tags">
                                {['삼성전자', '나스닥', '비트코인', '환율'].map(tag => (
                                    <span key={tag} onClick={() => setQuery(tag)} className="tag">{tag}</span>
                                ))}
                            </div>
                        </div>
                    )}

                    {results.length > 0 && (
                        <div className="results-list">
                            {results.map((res, i) => (
                                <Link
                                    key={i}
                                    href={`/market/${res.symbol}`}
                                    className="result-item"
                                    onClick={onClose}
                                >
                                    {res.type === 'Index' ? <TrendingUp size={16} /> : <Newspaper size={16} />}
                                    <div className="res-info">
                                        <span className="res-name">{res.name}</span>
                                        <span className="res-symbol">{res.symbol}</span>
                                    </div>
                                    <span className="res-type">{res.type}</span>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>

                <div className="search-footer">
                    <span><kbd>ESC</kbd> 닫기</span>
                    <span><kbd>↵</kbd> 선택</span>
                </div>
            </div>

            <style jsx>{`
                .search-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.4);
                    backdrop-filter: blur(4px);
                    z-index: 2000;
                    display: flex;
                    justify-content: center;
                    padding-top: 80px;
                }
                .search-modal {
                    background: white;
                    width: 600px;
                    max-height: 500px;
                    border-radius: 20px;
                    box-shadow: 0 20px 40px rgba(0,0,0,0.15);
                    display: flex;
                    flex-direction: column;
                    overflow: hidden;
                    animation: slideUp 0.2s ease-out;
                }
                @keyframes slideUp {
                    from { transform: translateY(20px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
                .search-input-wrapper {
                    display: flex;
                    align-items: center;
                    padding: 20px;
                    border-bottom: 1px solid #F2F4F7;
                    gap: 16px;
                }
                .search-icon { color: #8B95A1; }
                input {
                    flex: 1;
                    border: none;
                    font-size: 18px;
                    font-weight: 600;
                    color: #191F28;
                    outline: none;
                }
                input::placeholder { color: #B0B8C1; }
                .close-btn {
                    background: #F2F4F7;
                    border: none;
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #4E5968;
                }
                .search-results {
                    flex: 1;
                    overflow-y: auto;
                    padding: 12px;
                }
                .no-results {
                    padding: 40px;
                    text-align: center;
                    color: #8B95A1;
                    font-weight: 500;
                }
                .section-title {
                    font-size: 12px;
                    font-weight: 700;
                    color: #8B95A1;
                    margin: 8px 12px;
                    text-transform: uppercase;
                }
                .suggestion-tags {
                    display: flex;
                    gap: 8px;
                    padding: 8px 12px;
                }
                .tag {
                    background: #F2F4F7;
                    padding: 8px 16px;
                    border-radius: 12px;
                    font-size: 13px;
                    font-weight: 600;
                    color: #4E5968;
                    cursor: pointer;
                }
                .tag:hover { background: #E8F3FF; color: #0055FB; }
                .result-item {
                    display: flex;
                    align-items: center;
                    padding: 12px;
                    border-radius: 12px;
                    text-decoration: none;
                    gap: 14px;
                    color: #8B95A1;
                    transition: all 0.2s;
                }
                .result-item:hover { background: #F8FAFF; }
                .res-info { flex: 1; display: flex; flex-direction: column; }
                .res-name { color: #191F28; font-weight: 700; font-size: 15px; }
                .res-symbol { font-size: 12px; font-weight: 600; color: #8B95A1; }
                .res-type { font-size: 11px; font-weight: 800; background: #E8F3FF; color: #0055FB; padding: 4px 8px; border-radius: 6px; }
                .search-footer {
                    padding: 12px 20px;
                    background: #F9FAFB;
                    border-top: 1px solid #F2F4F7;
                    display: flex;
                    gap: 20px;
                    font-size: 11px;
                    font-weight: 600;
                    color: #8B95A1;
                }
                kbd {
                    background: white;
                    border: 1px solid #E5E8EB;
                    box-shadow: 0 1px 0 rgba(0,0,0,0.1);
                    border-radius: 4px;
                    padding: 2px 4px;
                    margin-right: 4px;
                }
            `}</style>
        </div>
    );
}
