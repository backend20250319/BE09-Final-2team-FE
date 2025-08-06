"use client";

import { usePathname } from "next/navigation";
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';

const excludedPaths = [
    '/user/login',
    // ... 나머지 경로들을 추가할 예정
];

export default function ClientLayout({ children }) {
    const pathname = usePathname();
    const hideHeaderAndFooter = excludedPaths.includes(pathname);

    return (
        <div className="app-content-wrapper">
            {!hideHeaderAndFooter && <Header />}
            <main className='h-screen'>{children}</main>
            {!hideHeaderAndFooter && <Footer />}
        </div>
    );
}