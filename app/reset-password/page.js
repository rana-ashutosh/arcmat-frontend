'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from '@/components/ui/Toast';
import { useResetPasswordMutation } from '@/hooks/useAuth';
import BackLink from '@/components/ui/BackLink';
import { ClipLoader } from 'react-spinners';
import clsx from 'clsx';
import { Eye, EyeOff } from 'lucide-react';

const resetPasswordSchema = z.object({
    newPassword: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
});

export default function ResetPasswordPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
        resolver: zodResolver(resetPasswordSchema),
    });

    const resetPasswordMutation = useResetPasswordMutation();

    const onSubmit = (data) => {
        resetPasswordMutation.mutate({ newPassword: data.newPassword }, {
            onSuccess: () => {
                toast.success('Password reset successfully. Please login.', 'Success');
            },
            onError: (error) => {
                toast.error(error.response?.data?.message || 'Failed to reset password', 'Error');
            }
        });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#fcf8f6] px-4">
            <div className="w-full max-w-lg bg-white p-8 rounded-2xl shadow-sm border border-[#e2e8f0]">

                <h2 className="text-3xl font-semibold text-[#4a5568] mb-2">Reset Password</h2>
                <p className="text-[#718096] mb-8">
                    Enter your new password below.
                </p>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="space-y-4">
                        <div>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="New Password"
                                    {...register('newPassword')}
                                    className={clsx(
                                        'w-full px-4 py-3.5 pr-12 border rounded-lg text-base text-[#4a5568] placeholder:text-[#a0aec0] focus:outline-none focus:ring-2 focus:ring-[#d9a88a] focus:border-transparent transition-all',
                                        errors.newPassword ? 'border-red-500' : 'border-[#e2e8f0]'
                                    )}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#a0aec0] hover:text-[#718096] transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                            {errors.newPassword && <p className="mt-1.5 text-sm text-red-500">{errors.newPassword.message}</p>}
                        </div>

                        <div>
                            <div className="relative">
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    placeholder="Confirm New Password"
                                    {...register('confirmPassword')}
                                    className={clsx(
                                        'w-full px-4 py-3.5 pr-12 border rounded-lg text-base text-[#4a5568] placeholder:text-[#a0aec0] focus:outline-none focus:ring-2 focus:ring-[#d9a88a] focus:border-transparent transition-all',
                                        errors.confirmPassword ? 'border-red-500' : 'border-[#e2e8f0]'
                                    )}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#a0aec0] hover:text-[#718096] transition-colors"
                                >
                                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                            {errors.confirmPassword && <p className="mt-1.5 text-sm text-red-500">{errors.confirmPassword.message}</p>}
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting || resetPasswordMutation.isPending}
                        className={clsx(
                            'w-full py-3.5 rounded-lg text-base font-medium text-white hover:text-[#d9a88a] hover:bg-white border border-[#d9a88a] duration-300',
                            isSubmitting || resetPasswordMutation.isPending ? 'bg-[#d9a88a]/70 cursor-not-allowed' : 'bg-[#d9a88a]'
                        )}
                    >
                        {isSubmitting || resetPasswordMutation.isPending ? (
                            <span className="flex items-center justify-center gap-2">
                                <ClipLoader size={18} color="#ffffff" />
                                <span>Resetting...</span>
                            </span>
                        ) : (
                            'Reset Password'
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}
