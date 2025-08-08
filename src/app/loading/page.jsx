export const dynamic = "force-dynamic"; // 캐시 비활성화 (선택)

async function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export default async function LoadingTestPage() {
  await wait(300000); // 3초간 인위적 대기
  return (
    <div className="flex justify-center items-center h-screen">
      <h1 className="text-2xl font-bold">✅ 로딩 완료! 페이지가 정상 출력되었습니다.</h1>
    </div>
  );
}
