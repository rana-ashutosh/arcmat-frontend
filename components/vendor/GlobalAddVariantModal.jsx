'use client';

import { useUIStore } from '@/store/useUIStore';
import AddVariantModal from './AddVariantModal';

export default function GlobalAddVariantModal() {
    const {
        isAddVariantModalOpen,
        closeAddVariantModal,
        newProductIdForVariant,
        parentProductForVariant
    } = useUIStore();

    if (!isAddVariantModalOpen) return null;

    return (
        <AddVariantModal
            isOpen={isAddVariantModalOpen}
            onClose={closeAddVariantModal}
            productId={newProductIdForVariant}
            parentProduct={parentProductForVariant}
        />
    );
}
