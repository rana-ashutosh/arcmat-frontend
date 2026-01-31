import React, { useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { X } from 'lucide-react';
import Button from '@/components/ui/Button';
import { useCreateAttribute } from '@/hooks/useAttribute';
import { toast } from '@/components/ui/Toast';

const AddAttributeModal = ({ isOpen, onClose, onSuccess }) => {
    const [name, setName] = useState('');
    const [values, setValues] = useState('');
    const createAttributeMutation = useCreateAttribute();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name.trim()) {
            toast.error("Attribute name is required");
            return;
        }

        // Backend expects 'attributeValues' as a comma-separated string
        // e.g., "Red, Blue, Green"
        try {
            const payload = {
                attributeName: name,
                attributeValues: values // Send as string directly, backend splits it
            };

            await createAttributeMutation.mutateAsync(payload);
            toast.success(`Attribute "${name}" created successfully`);

            // Reset and close
            setName('');
            setValues('');
            if (onSuccess) onSuccess();
            onClose();
        } catch (error) {
            const msg = error?.response?.data?.error?.attributeName?.message || "Failed to create attribute";
            toast.error(msg);
        }
    };

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/25 backdrop-blur-sm" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                <div className="flex justify-between items-center mb-6">
                                    <Dialog.Title as="h3" className="text-lg font-bold leading-6 text-gray-900">
                                        Create New Attribute
                                    </Dialog.Title>
                                    <button onClick={onClose} className="text-gray-400 hover:text-gray-500 outline-none">
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Attribute Name *</label>
                                        <input
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-[#d9a88a]"
                                            placeholder="e.g. Material, Fabric"
                                            autoFocus
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Values (Comma Separated)
                                            <span className="block text-xs font-normal text-gray-500 mt-1">First value will be used as example/default</span>
                                        </label>
                                        <textarea
                                            value={values}
                                            onChange={(e) => setValues(e.target.value)}
                                            rows={3}
                                            className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-[#d9a88a]"
                                            placeholder="e.g. Cotton, Wool, Silk"
                                        />
                                    </div>

                                    <div className="mt-6 flex justify-end gap-3">
                                        <Button variant="outline" type="button" onClick={onClose}>Cancel</Button>
                                        <Button type="submit" disabled={createAttributeMutation.isPending} className="bg-black text-white hover:bg-gray-800">
                                            {createAttributeMutation.isPending ? 'Creating...' : 'Create Attribute'}
                                        </Button>
                                    </div>
                                </form>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
};

export default AddAttributeModal;
