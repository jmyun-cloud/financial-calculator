"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Search, TrendingUp, Newspaper, X } from 'lucide-react';

interface Result {
    symbol: string;
    name: string;
    type: 'Stock' | 'Index' | 'News';
}

export default function SearchPalette({ onClose }: { onClose: () => void }) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    useEffect(() => {
        const timer = setTimeout(async () => {
            if (query.trim().length < 1) {
                setResults([]);
                return;
            }

            setLoading(true);
            try {
                const res = await fetch(`/api/market-search?q=${encodeURIComponent(query)}`);
                const json = await res.json();
                if (json.data) {
                    setResults(json.data);
                }
            } catch (err) {
                console.error("Search failed", err);
            } finally {
                setLoading(false);
            }
        }, 300);

        return () => clearTimeout(timer);
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
                    {loading && (
                        <div className="loading-state">실시간 시장 데이터를 검색 중입니다...</div>
                    )}

                    {!loading && query && results.length === 0 && (
                        <div className="no-results">'{query}'에 대한 검색 결과가 없습니다.</div>
                    )}

                    {!query && (
                        <div className="recent-searches">
                            <h4 className="section-title">추천 검색어</h4>
                            <div className="suggestion-tags">
                                {['삼성전자', '현대차', '나스닥', '비트코인'].map(tag => (
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
                                    href={`/market/${encodeURIComponent(res.symbol)}`}
                                    className="result-item"
                                    onClick={onClose}
                                >
                                    <div className="res-icon">
                                        {res.region === 'KR' ? '🇰🇷' : '🇺🇸'}
                                    </div>
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
                    padding: 10px 16px;
                    border-radius: 12px;
                    text-decoration: none;
                    gap: 12px;
                    color: inherit;
                    transition: background 0.2s;
                    min-height: 56px;
                }
                .result-item:hover { background: #F2F4F7; }
                .res-icon { 
                    flex-shrink: 0;
                    width: 32px; 
                    height: 32px; 
                    background: #F2F4F7; 
                    border-radius: 50%; 
                    display: flex; 
                    align-items: center; 
                    justify-content: center; 
                    font-size: 16px;
                }
                .loading-state {
                    padding: 40px;
                    text-align: center;
                    color: #0055FB;
                    font-size: 14px;
                    font-weight: 600;
                    animation: pulse 1.5s infinite;
                }
                @keyframes pulse {
                    0% { opacity: 0.6; }
                    50% { opacity: 1; }
                    100% { opacity: 0.6; }
                }
                .res-info { 
                    flex: 1; 
                    display: flex; 
                    flex-direction: column; 
                    gap: 2px;
                    overflow: hidden;
                }
                .res-name { color: #191F28; font-weight: 700; font-size: 15px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
                .res-symbol { font-size: 12px; font-weight: 600; color: #8B95A1; }
                .res-type { 
                    flex-shrink: 0;
                    font-size: 11px; 
                    font-weight: 800; 
                    background: #E8F3FF; 
                    color: #0055FB; 
                    padding: 4px 8px; 
                    border-radius: 6px; 
                }
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
