"use client";

import Image from "next/image";

export default function Loading() {
  return (
    <>
      <div className="flex flex-col items-center justify-center pt-[100px] min-h-screen">
        <div className="relative">
          <Image src="/images/common/loading.png" alt="Momnect 로딩 아이콘" width={200} height={200} priority />
          <div className="w-[200px] h-[200px] absolute top-0 left-0 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mb-4"></div>
        </div>
      </div>
    </>
  );
}
