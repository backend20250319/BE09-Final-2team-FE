// app/layout.jsx
import "./globals.css";
import ClientLayout from "./ClientLayout";

export const metadata = {
  title: "Momnect",
  description: "육아맘을 위한 중고거래와 공동구매 커뮤니티 플랫폼",
  keywords: ["육아", "중고거래", "공동구매", "Momnect"],
  authors: [{ name: "Momnect" }],
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
