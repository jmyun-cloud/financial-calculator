"use client";

import React, { useState } from 'react';
import { Search } from 'lucide-react';
import SearchPalette from './SearchPalette';

export default function HeaderSearch() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <div className="search-trigger" onClick={() => setIsOpen(true)}>
                <Search size={18} className="search-icon" />
                <span className="search-placeholder">검색...</span>
                <span className="search-shortcut">⌘K</span>
            </div>

            {isOpen && <SearchPalette onClose={() => setIsOpen(false)} />}

            <style jsx>{`
                .search-trigger {
                    display: flex;
                    align-items: center;
                    background: #F2F4F7;
                    padding: 8px 12px;
                    border-radius: 10px;
                    gap: 10px;
                    cursor: pointer;
                    transition: all 0.2s;
                    min-width: 160px;
                }
                .search-trigger:hover {
                    background: #E8EBF0;
                    box-shadow: 0 0 0 1px #E5E8EB;
                }
                .search-icon { color: #8B95A1; }
                .search-placeholder {
                    font-size: 13px;
                    font-weight: 600;
                    color: #8B95A1;
                    flex: 1;
                }
                .search-shortcut {
                    font-size: 10px;
                    font-weight: 700;
                    color: #B0B8C1;
                    background: white;
                    padding: 2px 4px;
                    border-radius: 4px;
                    border: 1px solid #E5E8EB;
                }
            `}</style>
        </>
    );
}
