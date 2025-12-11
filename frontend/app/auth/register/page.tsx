'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, ArrowRight, Check } from 'lucide-react';
import { useAuthStore } from '@/lib/auth';
import { cn } from '@/lib/utils';

const registerSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Please enter a valid email'),
    password: z
        .string()
        .min(8, 'Password must be at least 8 characters')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number'),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
    const router = useRouter();
    const { register: registerUser } = useAuthStore();
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
    });

    const password = watch('password', '');

    const passwordChecks = [
        { label: 'At least 8 characters', valid: password.length >= 8 },
        { label: 'One uppercase letter', valid: /[A-Z]/.test(password) },
        { label: 'One lowercase letter', valid: /[a-z]/.test(password) },
        { label: 'One number', valid: /[0-9]/.test(password) },
    ];

    const onSubmit = async (data: RegisterFormData) => {
        setError(null);
        setIsSubmitting(true);

        try {
            await registerUser(data.name, data.email, data.password);
            router.push('/account');
        } catch (err: any) {
            setError(err.message || err.response?.data?.error || 'Registration failed. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center py-12">
            <div className="container max-w-md">
                <div className="brutal-card p-8">
                    <h1 className="text-3xl font-black text-center mb-2">Create Account</h1>
                    <p className="text-center text-[var(--brutal-gray-600)] mb-8">
                        Join the BRUTALIST movement
                    </p>

                    {error && (
                        <div className="bg-[var(--brutal-red)] text-white p-4 mb-6 border-2 border-[var(--brutal-black)]">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div>
                            <label className="font-bold uppercase tracking-wider text-sm block mb-2">
                                Name
                            </label>
                            <input
                                type="text"
                                {...register('name')}
                                className={cn(
                                    'brutal-input',
                                    errors.name && 'border-[var(--brutal-red)]'
                                )}
                                placeholder="Your name"
                            />
                            {errors.name && (
                                <p className="text-[var(--brutal-red)] text-sm mt-1">
                                    {errors.name.message}
                                </p>
                            )}
                        </div>

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
                            {/* Password Requirements */}
                            <div className="mt-2 space-y-1">
                                {passwordChecks.map((check, i) => (
                                    <div
                                        key={i}
                                        className={cn(
                                            'flex items-center gap-2 text-sm',
                                            check.valid ? 'text-[var(--brutal-green)]' : 'text-[var(--brutal-gray-500)]'
                                        )}
                                    >
                                        <Check className={cn('w-4 h-4', !check.valid && 'opacity-30')} />
                                        {check.label}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="font-bold uppercase tracking-wider text-sm block mb-2">
                                Confirm Password
                            </label>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                {...register('confirmPassword')}
                                className={cn(
                                    'brutal-input',
                                    errors.confirmPassword && 'border-[var(--brutal-red)]'
                                )}
                                placeholder="••••••••"
                            />
                            {errors.confirmPassword && (
                                <p className="text-[var(--brutal-red)] text-sm mt-1">
                                    {errors.confirmPassword.message}
                                </p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="brutal-btn brutal-btn-primary w-full"
                        >
                            {isSubmitting ? 'Creating account...' : 'Create Account'}
                            <ArrowRight className="w-5 h-5" />
                        </button>
                    </form>

                    <p className="text-center mt-6">
                        Already have an account?{' '}
                        <Link
                            href="/auth/login"
                            className="font-bold text-[var(--brutal-red)] hover:underline"
                        >
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
