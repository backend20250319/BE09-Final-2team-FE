"use client";

import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#f7f9fa]">
      <div className="text-xs leading-[14.32px] text-gray-600 px-5  mx-auto pt-10 max-w-[1024px] min-[1600px]:max-w-[1280px]">
        <section className="flex flex-col justify-between md:flex-row">
          <div className="mb-6 md:mb-0 flex flex-col gap-[10px]">
            <h2 className="mb-3 font-bold text-[20px] text-black">Momnect</h2>
            <ul className="[&>li]:mb-2 text-xs">
              <li>회사명: Momnect</li>
              <li>대표이사: 이주희</li>
              <li>사업자등록번호: 108-81-99034</li>
              <li>통신판매업신고번호: 2020-서울강남-0000호</li>
              <li>주소: (06651) 서울특별시 서초구 서초중앙로 335, PlayData</li>
              <li>영문주소: PlayData, 335 Seochojungang-ro, Seocho-gu, Seoul, 06651, Republic of Korea</li>
              <li>이메일: kiik52@naver.com</li>
            </ul>
            <p className="text-sm">© 2024 Momnect. All rights reserved.</p>
          </div>
          <ul className="flex">
            <li className="w-5 h-5 mr-5 last:mr-0 text-[#787e89]">
              <Link href="#">
                <Image src={"/images/common/naver.png"} width={20} height={20} alt="naver.png" />
              </Link>
            </li>
            <li className="w-5 h-5 mr-5 last:mr-0 text-[#787e89]">
              <Link href="#">
                <Image src={"/images/common/naver-cafe.png"} width={20} height={20} alt="naver-cafe.png" />
              </Link>
            </li>
            <li className="w-5 h-5 mr-5 last:mr-0 text-[#787e89]">
              <Link href="#">
                <Image src={"/images/common/youtube.png"} width={20} height={20} alt="youtube.png" />
              </Link>
            </li>
            <li className="w-5 h-5 mr-5 last:mr-0 text-[#787e89]">
              <Link href="#">
                <Image src={"/images/common/facebook.png"} width={20} height={20} alt="facebook.png" />
              </Link>
            </li>
            <li className="w-5 h-5 mr-5 last:mr-0 text-[#787e89]">
              <Link href="#">
                <Image src={"/images/common/instar.png"} width={20} height={20} alt="instar.png" />
              </Link>
            </li>
          </ul>
        </section>
        <hr className="w-full h-[1px] border-white mt-8 mb-4 xl:my-5" />
        <section className="flex justify-between">
          <div className="lg:w-[48%]">
            <ul className="flex flex-wrap items-center mb-5 leading-loose xl:mb-3 text-jnGray-900">
              <Link className="" href="#">
                이용약관
              </Link>
              <div className="w-[1px] h-2 bg-[#E0E0E0] mx-2"></div>
              <Link className="font-bold" href="#">
                개인정보처리방침
              </Link>
              <div className="w-[1px] h-2 bg-[#E0E0E0] mx-2"></div>
              <Link className="" href="#">
                분쟁처리절차
              </Link>
              <div className="w-[1px] h-2 bg-[#E0E0E0] mx-2"></div>
              <Link className="" href="#">
                청소년보호정책
              </Link>
              <div className="w-[1px] h-2 bg-[#E0E0E0] mx-2"></div>
              <Link className="" href="#">
                사업자정보확인
              </Link>
              <div className="w-[1px] h-2 bg-[#E0E0E0] mx-2"></div>
              <Link className="" href="#">
                게시글 수집 및 이용 안내
              </Link>
              <div className="w-[1px] h-2 bg-[#E0E0E0] mx-2"></div>
              <Link className="" href="#">
                Momnect 고객센터
              </Link>
            </ul>
            <p className="leading-[22px]">
              “Momnect” 상점의 판매상품을 제외한 모든 상품들에 대하여, Momnect는 통신판매중개자로서 거래 당사자가 아니며
              판매 회원과 구매 회원 간의 상품거래 정보 및 거래에 관여하지 않고, 어더한 의무와 책임도 부담하지 않습니다.
            </p>
          </div>
          <div className="mt-5 lg:mt-0 flex justify-end">
            <div className="text-xs w-full [&amp;&gt;button]:lg:ml-auto">
              <Link href="/">
                <Image src={"/images/common/main-logo.png"} alt="footer-logo.png" width={184} height={184} />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </footer>
  );
}
