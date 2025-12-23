'use client';

import { useState } from 'react';
import { MapPin, Plus, Trash2, Edit, Check, Loader2 } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { cn } from '@/lib/utils';
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Badge } from '@/components/ui';
import api from '@/lib/api';

// Country options for the dropdown
const COUNTRY_OPTIONS = [
    { code: 'US', name: 'United States' },
    { code: 'CA', name: 'Canada' },
    { code: 'GB', name: 'United Kingdom' },
    { code: 'AU', name: 'Australia' },
    { code: 'DE', name: 'Germany' },
    { code: 'FR', name: 'France' },
    { code: 'IN', name: 'India' },
    { code: 'BD', name: 'Bangladesh' },
];

interface Address {
    id: string;
    label?: string;
    firstName: string;
    lastName: string;
    company?: string;
    line1: string;
    line2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    phone?: string;
    isDefault?: boolean;
}

export default function AddressesPage() {
    const queryClient = useQueryClient();
    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        label: '',
        firstName: '',
        lastName: '',
        line1: '',
        line2: '',
        city: '',
        state: '',
        postalCode: '',
        country: 'US',
        phone: '',
    });

    const { data: addresses = [], isLoading } = useQuery({
        queryKey: ['addresses'],
        queryFn: async () => {
            const res = await api.get('/addresses');
            return res.data;
        },
    });

    // Helper to show API errors
    const handleApiError = (err: any, context: string) => {
        const message = err.response?.data?.error || err.message || `Failed to ${context}`;
        setErrorMessage(message);
        console.error(`[Address ${context}]:`, err);
        setTimeout(() => setErrorMessage(null), 5000);
    };

    const createAddress = useMutation({
        mutationFn: async (data: typeof formData) => {
            const res = await api.post('/addresses', data);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['addresses'] });
            resetForm();
            setErrorMessage(null);
        },
        onError: (err: any) => handleApiError(err, 'create address'),
    });

    const updateAddress = useMutation({
        mutationFn: async ({ id, data }: { id: string; data: typeof formData }) => {
            const res = await api.put(`/addresses/${id}`, data);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['addresses'] });
            resetForm();
            setErrorMessage(null);
        },
        onError: (err: any) => handleApiError(err, 'update address'),
    });

    const deleteAddress = useMutation({
        mutationFn: async (id: string) => {
            await api.delete(`/addresses/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['addresses'] });
            setErrorMessage(null);
        },
        onError: (err: any) => handleApiError(err, 'delete address'),
    });

    const setDefaultAddress = useMutation({
        mutationFn: async (id: string) => {
            const res = await api.post(`/addresses/${id}/default`);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['addresses'] });
            setErrorMessage(null);
        },
        onError: (err: any) => handleApiError(err, 'set default address'),
    });

    const resetForm = () => {
        setFormData({
            label: '',
            firstName: '',
            lastName: '',
            line1: '',
            line2: '',
            city: '',
            state: '',
            postalCode: '',
            country: 'US',
            phone: '',
        });
        setIsAdding(false);
        setEditingId(null);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingId) {
            updateAddress.mutate({ id: editingId, data: formData });
        } else {
            createAddress.mutate(formData);
        }
    };

    const handleEdit = (address: Address) => {
        setFormData({
            label: address.label || '',
            firstName: address.firstName,
            lastName: address.lastName,
            line1: address.line1,
            line2: address.line2 || '',
            city: address.city,
            state: address.state,
            postalCode: address.postalCode,
            country: address.country,
            phone: address.phone || '',
        });
        setEditingId(address.id);
        setIsAdding(true);
    };

    const handleDelete = (id: string) => {
        if (confirm('Delete this address?')) {
            deleteAddress.mutate(id);
        }
    };

    const setDefault = (id: string) => {
        setDefaultAddress.mutate(id);
    };

    const isPending = createAddress.isPending || updateAddress.isPending;

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[300px]">
                <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black">My Addresses</h1>
                    <p className="text-gray-600">Manage your shipping addresses</p>
                </div>
                {!isAdding && (
                    <Button onClick={() => setIsAdding(true)}>
                        <Plus className="w-4 h-4" />
                        Add Address
                    </Button>
                )}
            </div>

            {/* Error Message */}
            {errorMessage && (
                <div className="bg-red-500 text-white p-4 border-4 border-black rounded-xl">
                    {errorMessage}
                </div>
            )}

            {/* Add/Edit Form */}
            {isAdding && (
                <Card shadow="md">
                    <CardHeader>
                        <CardTitle>{editingId ? 'Edit Address' : 'New Address'}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block font-bold text-sm mb-2">Label (e.g. Home, Work)</label>
                                <Input
                                    value={formData.label}
                                    onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                                    placeholder="Home"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block font-bold text-sm mb-2">First Name *</label>
                                    <Input
                                        required
                                        value={formData.firstName}
                                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block font-bold text-sm mb-2">Last Name *</label>
                                    <Input
                                        required
                                        value={formData.lastName}
                                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block font-bold text-sm mb-2">Address Line 1 *</label>
                                <Input
                                    required
                                    value={formData.line1}
                                    onChange={(e) => setFormData({ ...formData, line1: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block font-bold text-sm mb-2">Address Line 2</label>
                                <Input
                                    value={formData.line2}
                                    onChange={(e) => setFormData({ ...formData, line2: e.target.value })}
                                    placeholder="Apartment, suite, etc."
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block font-bold text-sm mb-2">City *</label>
                                    <Input
                                        required
                                        value={formData.city}
                                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block font-bold text-sm mb-2">State *</label>
                                    <Input
                                        required
                                        value={formData.state}
                                        onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block font-bold text-sm mb-2">Postal Code *</label>
                                    <Input
                                        required
                                        value={formData.postalCode}
                                        onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block font-bold text-sm mb-2">Country *</label>
                                    <select
                                        value={formData.country}
                                        onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                                        className="w-full h-12 px-4 bg-white border-4 border-black rounded-xl font-medium focus:outline-none shadow-[4px_4px_0px_#000]"
                                    >
                                        {COUNTRY_OPTIONS.map((c) => (
                                            <option key={c.code} value={c.code}>
                                                {c.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block font-bold text-sm mb-2">Phone</label>
                                <Input
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                />
                            </div>

                            <div className="flex gap-4">
                                <Button type="submit" disabled={isPending} className="flex-1">
                                    {isPending ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            Saving...
                                        </>
                                    ) : (
                                        <>Save Address</>
                                    )}
                                </Button>
                                <Button type="button" variant="outline" onClick={resetForm}>
                                    Cancel
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            )}

            {/* Address List */}
            {addresses.length === 0 && !isAdding ? (
                <Card shadow="md">
                    <CardContent className="p-12 text-center">
                        <MapPin className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                        <h3 className="font-black">No addresses saved</h3>
                        <p className="text-gray-600 mt-1">Add an address to get started</p>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {addresses.map((address: Address) => (
                        <Card key={address.id} shadow="sm" hover="liftSm">
                            <CardContent className="p-4">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-start gap-3">
                                        <MapPin className="w-5 h-5 text-gray-400 mt-1" />
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <span className="font-bold">
                                                    {address.label || `${address.firstName} ${address.lastName}`}
                                                </span>
                                                {address.isDefault && (
                                                    <Badge variant="success" size="sm">Default</Badge>
                                                )}
                                            </div>
                                            <p className="text-sm text-gray-600 mt-1">
                                                {address.firstName} {address.lastName}<br />
                                                {address.line1}<br />
                                                {address.line2 && <>{address.line2}<br /></>}
                                                {address.city}, {address.state} {address.postalCode}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex gap-1">
                                        {!address.isDefault && (
                                            <button
                                                onClick={() => setDefault(address.id)}
                                                className="p-2 hover:bg-green-500 hover:text-white rounded-lg transition-colors"
                                                title="Set as default"
                                            >
                                                <Check className="w-4 h-4" />
                                            </button>
                                        )}
                                        <button
                                            onClick={() => handleEdit(address)}
                                            className="p-2 hover:bg-yellow-400 rounded-lg transition-colors"
                                            title="Edit"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(address.id)}
                                            className="p-2 hover:bg-red-500 hover:text-white rounded-lg transition-colors"
                                            title="Delete"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
