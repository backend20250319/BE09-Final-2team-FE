import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

// app/not-found.jsx
export default function NotFound() {
  return (
    <div className="flex flex-col justify-center items-center h-full gap-2 pt-[50px]">
      <Image src={"/images/common/404-page.png"} width={350} height={350} alt="404-not-found" />
      <Button className="h-[50px]">
        <Link href="/">
          <span className="text-lg">Momnect 홈으로 돌아가기</span>
        </Link>
      </Button>
    </div>
  );
}
