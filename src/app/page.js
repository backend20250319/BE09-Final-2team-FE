"use client";

import ConfirmModal, { MODAL_TYPES } from "@/components/common/ConfirmModal";
import Main from "./(main)/Main";
import { useState } from "react";

export default function Home() {
  return (
    <div className="flex justify-center items-center h-screen">
      <Main />
    </div>
  );
}
