"use client";

export default function Layout({ children }) {
  return (
    <>
      <style jsx global>{`
        header,
        footer {
          display: none !important;
        }
        main {
          padding-top: 0;
        }
      `}</style>
      <div className="h-fix flex min-h-screen w-full items-center justify-center bg-[#EFF2F7]">
        <div className="pt-0 h-fix flex w-full items-center justify-center">{children}</div>
      </div>
    </>
  );
}
