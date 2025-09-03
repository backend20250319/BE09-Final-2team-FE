"use client";

import Sidebar from "@/components/common/Sidebar";
import TradingAreaContent from "./components/TradingAreaContent";

const TradingAreaManagement = () => {
    return (
        <Sidebar
            sidebarKey="location-management"
            title="거래지역 관리"
            trigger={<span style={{display: 'none'}}>숨김</span>}
            onBack={true}
        >
            <TradingAreaContent />
        </Sidebar>
    );
};

export default TradingAreaManagement;