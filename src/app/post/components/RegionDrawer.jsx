"use client";

import { useEffect, useMemo, useState } from "react";

/** 단일 지역 선택 드로어 (최대 1개) — width로 시트 폭 조절 (기본 600px) */
export default function RegionDrawer({
  open,
  initial = "",   // 단일 문자열
  onClose,
  onSave,
  width = 600,     // Sidebar와 동일 감성: 600px 고정 + 반응형 최대폭
}) {
  // 필요시 외부 API 연동으로 교체 가능 (지금은 샘플)
  const DATA = useMemo(
    () => [
      "서초동","강남구","양재동","방배동","도곡동","삼성동","개포동","신사동","역삼동","논현동",
      "마포구","서교동","합정동","망원동","성수동","왕십리","여의도동","목동","송파구","잠실동",
    ],
    []
  );

  const [q, setQ] = useState("");
  const [picked, setPicked] = useState(initial); // string
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  useEffect(() => {
    if (open) setPicked(initial || "");
  }, [open, initial]);

  const results = useMemo(() => {
    const s = q.trim();
    if (!s) return [];
    return DATA.filter((name) => name.includes(s)).slice(0, 10);
  }, [q, DATA]);

  const choose = (name) => setPicked(name);
  const clearPicked = () => setPicked("");

  const handleSave = () => {
    if (!picked) return;
    onSave?.(picked);
    onClose?.();
  };

  if (!mounted) return null;

  return (
    <div className={`fixed inset-0 z-[1000] ${open ? "pointer-events-auto" : "pointer-events-none"}`}>
      {/* 배경 딤 */}
      <div
        className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0"}`}
        onClick={onClose}
      />

      {/* 오른쪽 드로어 — Sidebar와 통일: width=600px, maxWidth=90vw */}
      <aside
        className={`absolute right-0 top-0 h-full bg-white shadow-2xl
        transition-transform duration-300 ease-out ${open ? "translate-x-0" : "translate-x-full"} flex flex-col`}
        style={{ width, maxWidth: "90vw" }}
        role="dialog"
        aria-label="거래지역 관리"
      >
        {/* 헤더 */}
        <div className="px-5 pt-5 pb-3 border-b">
          <div className="flex items-center justify-between">
            <button
              onClick={onClose}
              className="text-2xl leading-none text-gray-500 hover:text-gray-700 cursor-pointer"
              aria-label="close"
            >
              ←
            </button>
            <h2 className="absolute left-1/2 -translate-x-1/2 text-[16px] font-semibold">
              거래지역 관리
            </h2>
            <div className="w-6" />
          </div>
          <p className="mt-3 text-[12px] text-gray-500">
            거래지역은 <span className="font-semibold">1개</span>만 선택 가능합니다.
          </p>
        </div>

        {/* 검색 */}
        <div className="p-5">
          <div className="flex items-center gap-2 rounded-2xl border px-3">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="주소를 검색하세요  (예: 서초동, 강남구)"
              className="h-11 w-full bg-transparent text-[14px] outline-none"
            />
            {q && (
              <button
                className="text-sm text-gray-400 hover:text-gray-600 cursor-pointer"
                onClick={() => setQ("")}
                type="button"
              >
                ×
              </button>
            )}
          </div>

          {!!q && (
            <ul className="mt-3 max-h-52 overflow-y-auto text-[14px]">
              {results.length ? (
                results.map((name) => (
                  <li
                    key={name}
                    className="flex items-center justify-between px-1 py-2 cursor-pointer hover:bg-gray-50"
                    onClick={() => choose(name)}
                  >
                    <div>
                      {name.split(q).map((chunk, i, arr) => (
                        <span key={i}>
                          {chunk}
                          {i < arr.length - 1 && <span className="text-blue-500 font-medium">{q}</span>}
                        </span>
                      ))}
                    </div>
                    <input readOnly type="radio" checked={picked === name} className="h-4 w-4" />
                  </li>
                ))
              ) : (
                <li className="px-1 py-6 text-center text-gray-400">검색 결과가 없어요</li>
              )}
            </ul>
          )}
        </div>

        {/* 선택 표시 박스 */}
        <div className="mx-5 rounded-2xl border px-4 py-3">
          <div className="mb-2 text-[12px] text-gray-500">
            선택된 거래지역
            <span className="ml-1 inline-flex items-center rounded-full bg-blue-100 px-2 py-0.5 text-[11px] text-blue-700">
              {picked ? "1/1" : "0/1"}
            </span>
          </div>

          {!picked ? (
            <div className="py-6 text-center text-[13px] text-gray-400">
              아직 선택된 거래지역이 없습니다
              <br />위에서 지역을 검색해보세요
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-1.5 text-[13px] text-blue-700">
                {picked}
                <button
                  className="text-blue-600/60 hover:text-blue-700 cursor-pointer"
                  onClick={clearPicked}
                  type="button"
                  aria-label="선택 해제"
                >
                  ×
                </button>
              </span>
            </div>
          )}
        </div>

        {/* 하단 저장 */}
        <div className="mt-auto p-5">
          <button
            disabled={!picked}
            onClick={handleSave}
            className={`h-12 w-full rounded-2xl text-white text-[15px] font-medium ${
              !picked
                ? "bg-gray-200 cursor-not-allowed"
                : "bg-blue-500 cursor-pointer hover:brightness-95"
            }`}
          >
            거래지역 저장
          </button>
        </div>
      </aside>
    </div>
  );
}
