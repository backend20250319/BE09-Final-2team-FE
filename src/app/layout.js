import ClientLayout from "@/app/ClientLayout";
import './globals.css';

export const metadata = {
    title: 'Momnect',
    description: '중고 육아 물품 거래',
};

export default function RootLayout({ children }) {
    return (
        <html lang='ko'>
            <body>
                <ClientLayout>
                    {children}
                </ClientLayout>
            </body>
        </html>
    );
}
