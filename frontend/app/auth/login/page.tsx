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
import { Button, Card, CardContent, Input } from '@/components/ui';

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
            setError(err.message || err.response?.data?.error || 'Invalid email or password');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center py-12 bg-[#FAFAFA]">
            <div className="container max-w-md px-4">
                <Card shadow="lg">
                    <CardContent className="p-8">
                        <h1 className="text-3xl font-black text-center mb-2">Welcome Back</h1>
                        <p className="text-center text-gray-600 mb-8">
                            Sign in to your account
                        </p>

                        {error && (
                            <div className="bg-red-500 text-white p-4 mb-6 border-4 border-black rounded-xl">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            <div>
                                <label className="font-bold uppercase tracking-wider text-sm block mb-2">
                                    Email
                                </label>
                                <Input
                                    type="email"
                                    {...register('email')}
                                    state={errors.email ? 'error' : 'default'}
                                    placeholder="you@example.com"
                                />
                                {errors.email && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.email.message}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="font-bold uppercase tracking-wider text-sm block mb-2">
                                    Password
                                </label>
                                <div className="relative">
                                    <Input
                                        type={showPassword ? 'text' : 'password'}
                                        {...register('password')}
                                        state={errors.password ? 'error' : 'default'}
                                        placeholder="••••••••"
                                        className="pr-12"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                                {errors.password && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.password.message}
                                    </p>
                                )}
                            </div>

                            <div className="flex items-center justify-end">
                                <Link
                                    href="/auth/forgot-password"
                                    className="text-sm text-red-500 hover:underline font-medium"
                                >
                                    Forgot password?
                                </Link>
                            </div>

                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full"
                                size="lg"
                            >
                                {isSubmitting ? 'Signing in...' : 'Sign In'}
                                <ArrowRight className="w-5 h-5" />
                            </Button>
                        </form>

                        <p className="text-center mt-6">
                            Don't have an account?{' '}
                            <Link
                                href="/auth/register"
                                className="font-bold text-red-500 hover:underline"
                            >
                                Create one
                            </Link>
                        </p>
                    </CardContent>
                </Card>

                {/* Test Account Info */}
                <Card shadow="sm" className="mt-6 bg-yellow-100">
                    <CardContent className="p-4">
                        <p className="text-sm font-bold mb-2">Test Account:</p>
                        <p className="text-sm text-gray-700">
                            Email: customer@example.com<br />
                            Password: Customer123!
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
