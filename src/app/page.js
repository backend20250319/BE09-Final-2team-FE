'use client';

import ConfirmModal, { MODAL_TYPES } from '@/components/common/ConfirmModal';
import Main from './(main)/Main';
import { useState } from 'react';

export default function Home() {
    const [modalOpen, setModalOpen] = useState(false);
    const [modalConfig, setModalConfig] = useState({
        title: '',
        message: '',
        type: MODAL_TYPES.CONFIRM_CANCEL,
        onConfirm: () => {},
    });

    return (
        <div>
            <Main />
            <ConfirmModal
                open={modalOpen}
                title={modalConfig.title}
                message={modalConfig.message}
                type={modalConfig.type}
                confirmText={modalConfig.confirmText}
                cancelText={modalConfig.cancelText}
                onConfirm={modalConfig.onConfirm}
                onCancel={() => setModalOpen(false)}
            />
        </div>
    );
}
