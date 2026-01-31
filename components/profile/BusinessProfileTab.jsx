import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useGetVendor, useCreateVendor, useUpdateVendor } from '@/hooks/useVendor';
import ProfileDetails from '@/components/profile/ProfileDetails';
import ProfileForm from '@/components/profile/ProfileForm';
import { toast } from '@/components/ui/Toast';
import { useLoader } from '@/context/LoaderContext';
import { Loader2 } from 'lucide-react';

const BusinessProfileTab = () => {
    const { user } = useAuth();
    const { setLoading } = useLoader();
    const userId = user?._id || user?.id;

    // Hooks for vendor data
    const { data: vendorData, isLoading: isVendorLoading } = useGetVendor(userId);
    const { mutate: createVendor, isPending: isCreating } = useCreateVendor();
    const { mutate: updateVendor, isPending: isUpdating } = useUpdateVendor();

    const [isEditing, setIsEditing] = useState(false);
    const [currentVendor, setCurrentVendor] = useState(null);

    // Update loader state
    useEffect(() => {
        setLoading(isVendorLoading);
    }, [isVendorLoading, setLoading]);

    // Process vendor data
    useEffect(() => {
        if (vendorData) {
            const vendor = vendorData.data || vendorData.vendor || vendorData;
            if (vendor && typeof vendor === 'object' && !Array.isArray(vendor)) {
                setCurrentVendor(vendor);
            } else {
                setCurrentVendor(null);
            }
        } else {
            setCurrentVendor(null);
        }
    }, [vendorData]);

    const fileToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });
    };

    const handleCreateOrUpdate = async (data) => {
        try {
            const payload = {
                name: data.name,
                country: data.country,
                description: data.description,
                website: data.website,
                shippingAddress: data.shippingAddress,
                billingAddress: data.billingAddress,
                isActive: data.isActive
            };

            if (!currentVendor && user) {
                payload.userId = user._id || user.id;
            }

            if (data.logo && data.logo[0]) {
                const base64Logo = await fileToBase64(data.logo[0]);
                payload.logo = base64Logo;
            }

            if (currentVendor) {
                updateVendor({ id: currentVendor._id || currentVendor.id, data: payload }, {
                    onSuccess: () => {
                        toast.success('Profile updated successfully', 'Success');
                        setIsEditing(false);
                    },
                    onError: (error) => {
                        toast.error(error.message || 'Failed to update profile', 'Error');
                    }
                });
            } else {
                createVendor(payload, {
                    onSuccess: () => {
                        toast.success('Profile created successfully', 'Success');
                        setIsEditing(false);
                    },
                    onError: (error) => {
                        toast.error(error.message || 'Failed to create profile', 'Error');
                    }
                });
            }
        } catch (error) {
            toast.error("Failed to prepare profile data", "Error");
        }
    };

    if (isVendorLoading) {
        return (
            <div className="flex justify-center items-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-white">
                <h2 className="text-xl font-bold text-gray-800">
                    {currentVendor ? 'Business Profile' : 'Create Business Profile'}
                </h2>
            </div>

            <div className="p-8">
                {!currentVendor || isEditing ? (
                    <ProfileForm
                        vendor={currentVendor}
                        onSubmit={handleCreateOrUpdate}
                        onCancel={currentVendor ? () => setIsEditing(false) : null}
                        isSubmitting={isCreating || isUpdating}
                    />
                ) : (
                    <ProfileDetails
                        vendor={currentVendor}
                        onEdit={() => setIsEditing(true)}
                    />
                )}
            </div>
        </div>
    );
};

export default BusinessProfileTab;
