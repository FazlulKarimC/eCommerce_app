'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useAuthStore } from '@/lib/auth';
import { cn } from '@/lib/utils';

const loginSchema = z.object({
    email: z.string().email('Please enter a valid email'),
    password: z.string().min(1, 'Password is required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
    const router = useRouter();
    const { login } = useAuthStore();
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginFormData) => {
        setError(null);
        setIsSubmitting(true);

        try {
            await login(data.email, data.password);
            router.push('/account');
        } catch (err: any) {
            setError(err.response?.data?.error || 'Invalid email or password');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center py-12">
            <div className="container max-w-md">
                <div className="brutal-card p-8">
                    <h1 className="text-3xl font-black text-center mb-2">Welcome Back</h1>
                    <p className="text-center text-[var(--brutal-gray-600)] mb-8">
                        Sign in to your account
                    </p>

                    {error && (
                        <div className="bg-[var(--brutal-red)] text-white p-4 mb-6 border-2 border-[var(--brutal-black)]">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div>
                            <label className="font-bold uppercase tracking-wider text-sm block mb-2">
                                Email
                            </label>
                            <input
                                type="email"
                                {...register('email')}
                                className={cn(
                                    'brutal-input',
                                    errors.email && 'border-[var(--brutal-red)]'
                                )}
                                placeholder="you@example.com"
                            />
                            {errors.email && (
                                <p className="text-[var(--brutal-red)] text-sm mt-1">
                                    {errors.email.message}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="font-bold uppercase tracking-wider text-sm block mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    {...register('password')}
                                    className={cn(
                                        'brutal-input pr-12',
                                        errors.password && 'border-[var(--brutal-red)]'
                                    )}
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--brutal-gray-500)]"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="text-[var(--brutal-red)] text-sm mt-1">
                                    {errors.password.message}
                                </p>
                            )}
                        </div>

                        <div className="flex items-center justify-between">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" className="w-4 h-4" />
                                <span className="text-sm">Remember me</span>
                            </label>
                            <Link
                                href="/auth/forgot-password"
                                className="text-sm text-[var(--brutal-red)] hover:underline"
                            >
                                Forgot password?
                            </Link>
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="brutal-btn brutal-btn-primary w-full"
                        >
                            {isSubmitting ? 'Signing in...' : 'Sign In'}
                            <ArrowRight className="w-5 h-5" />
                        </button>
                    </form>

                    <p className="text-center mt-6">
                        Don't have an account?{' '}
                        <Link
                            href="/auth/register"
                            className="font-bold text-[var(--brutal-red)] hover:underline"
                        >
                            Create one
                        </Link>
                    </p>
                </div>

                {/* Test Account Info */}
                <div className="mt-6 p-4 bg-[var(--brutal-gray-100)] border-2 border-dashed border-[var(--brutal-gray-400)]">
                    <p className="text-sm font-bold mb-2">Test Account:</p>
                    <p className="text-sm text-[var(--brutal-gray-700)]">
                        Email: customer@example.com<br />
                        Password: Customer123!
                    </p>
                </div>
            </div>
        </div>
    );
}
