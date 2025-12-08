'use client';

import { useState } from 'react';
import { MapPin, Plus, Trash2, Edit, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

// Note: This uses local state since the current API doesn't have address endpoints
// In a real app, this would use React Query hooks for address CRUD

interface Address {
    id: string;
    firstName: string;
    lastName: string;
    line1: string;
    line2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    isDefault?: boolean;
}

export default function AddressesPage() {
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        line1: '',
        line2: '',
        city: '',
        state: '',
        postalCode: '',
        country: 'US',
    });

    const resetForm = () => {
        setFormData({
            firstName: '',
            lastName: '',
            line1: '',
            line2: '',
            city: '',
            state: '',
            postalCode: '',
            country: 'US',
        });
        setIsAdding(false);
        setEditingId(null);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (editingId) {
            setAddresses(prev => prev.map(addr =>
                addr.id === editingId ? { ...formData, id: editingId, isDefault: addr.isDefault } : addr
            ));
        } else {
            const newAddress: Address = {
                ...formData,
                id: Date.now().toString(),
                isDefault: addresses.length === 0,
            };
            setAddresses(prev => [...prev, newAddress]);
        }

        resetForm();
    };

    const handleEdit = (address: Address) => {
        setFormData({
            firstName: address.firstName,
            lastName: address.lastName,
            line1: address.line1,
            line2: address.line2 || '',
            city: address.city,
            state: address.state,
            postalCode: address.postalCode,
            country: address.country,
        });
        setEditingId(address.id);
        setIsAdding(true);
    };

    const handleDelete = (id: string) => {
        setAddresses(prev => prev.filter(addr => addr.id !== id));
    };

    const setDefault = (id: string) => {
        setAddresses(prev => prev.map(addr => ({
            ...addr,
            isDefault: addr.id === id,
        })));
    };

    return (
        <div className="space-y-6">
            <div className="brutal-card">
                <div className="p-6 border-b-2 border-[var(--brutal-gray-200)] flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-black">Saved Addresses</h2>
                        <p className="text-[var(--brutal-gray-600)] mt-1">
                            Manage your shipping and billing addresses
                        </p>
                    </div>
                    {!isAdding && (
                        <button
                            onClick={() => setIsAdding(true)}
                            className="brutal-btn brutal-btn-primary"
                        >
                            <Plus className="w-4 h-4" />
                            Add Address
                        </button>
                    )}
                </div>

                {/* Add/Edit Form */}
                {isAdding && (
                    <form onSubmit={handleSubmit} className="p-6 border-b-2 border-[var(--brutal-gray-200)] bg-[var(--brutal-gray-50)]">
                        <h3 className="font-black mb-4">
                            {editingId ? 'Edit Address' : 'Add New Address'}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="font-bold text-sm block mb-2">First Name</label>
                                <input
                                    type="text"
                                    value={formData.firstName}
                                    onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                                    className="brutal-input"
                                    required
                                />
                            </div>
                            <div>
                                <label className="font-bold text-sm block mb-2">Last Name</label>
                                <input
                                    type="text"
                                    value={formData.lastName}
                                    onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                                    className="brutal-input"
                                    required
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="font-bold text-sm block mb-2">Address Line 1</label>
                                <input
                                    type="text"
                                    value={formData.line1}
                                    onChange={(e) => setFormData(prev => ({ ...prev, line1: e.target.value }))}
                                    className="brutal-input"
                                    required
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="font-bold text-sm block mb-2">Address Line 2 (Optional)</label>
                                <input
                                    type="text"
                                    value={formData.line2}
                                    onChange={(e) => setFormData(prev => ({ ...prev, line2: e.target.value }))}
                                    className="brutal-input"
                                />
                            </div>
                            <div>
                                <label className="font-bold text-sm block mb-2">City</label>
                                <input
                                    type="text"
                                    value={formData.city}
                                    onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                                    className="brutal-input"
                                    required
                                />
                            </div>
                            <div>
                                <label className="font-bold text-sm block mb-2">State</label>
                                <input
                                    type="text"
                                    value={formData.state}
                                    onChange={(e) => setFormData(prev => ({ ...prev, state: e.target.value }))}
                                    className="brutal-input"
                                    required
                                />
                            </div>
                            <div>
                                <label className="font-bold text-sm block mb-2">Postal Code</label>
                                <input
                                    type="text"
                                    value={formData.postalCode}
                                    onChange={(e) => setFormData(prev => ({ ...prev, postalCode: e.target.value }))}
                                    className="brutal-input"
                                    required
                                />
                            </div>
                            <div>
                                <label className="font-bold text-sm block mb-2">Country</label>
                                <input
                                    type="text"
                                    value={formData.country}
                                    onChange={(e) => setFormData(prev => ({ ...prev, country: e.target.value }))}
                                    className="brutal-input"
                                    required
                                />
                            </div>
                        </div>
                        <div className="flex gap-4 mt-6">
                            <button type="submit" className="brutal-btn brutal-btn-primary">
                                {editingId ? 'Update Address' : 'Save Address'}
                            </button>
                            <button type="button" onClick={resetForm} className="brutal-btn">
                                Cancel
                            </button>
                        </div>
                    </form>
                )}

                {/* Address List */}
                {addresses.length === 0 && !isAdding ? (
                    <div className="p-12 text-center">
                        <MapPin className="w-16 h-16 mx-auto text-[var(--brutal-gray-300)] mb-4" />
                        <h3 className="text-xl font-black">No Addresses Saved</h3>
                        <p className="text-[var(--brutal-gray-600)] mt-2">
                            Add an address to speed up checkout
                        </p>
                    </div>
                ) : (
                    <div className="divide-y-2 divide-[var(--brutal-gray-200)]">
                        {addresses.map((address) => (
                            <div key={address.id} className="p-6 flex items-start justify-between gap-4">
                                <div className="flex items-start gap-4">
                                    <MapPin className="w-5 h-5 text-[var(--brutal-gray-500)] mt-1 flex-shrink-0" />
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <p className="font-bold">{address.firstName} {address.lastName}</p>
                                            {address.isDefault && (
                                                <span className="brutal-badge brutal-badge-green text-xs">Default</span>
                                            )}
                                        </div>
                                        <p className="text-[var(--brutal-gray-600)]">{address.line1}</p>
                                        {address.line2 && <p className="text-[var(--brutal-gray-600)]">{address.line2}</p>}
                                        <p className="text-[var(--brutal-gray-600)]">
                                            {address.city}, {address.state} {address.postalCode}
                                        </p>
                                        <p className="text-[var(--brutal-gray-600)]">{address.country}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    {!address.isDefault && (
                                        <button
                                            onClick={() => setDefault(address.id)}
                                            className="p-2 hover:bg-[var(--brutal-gray-100)] transition-colors"
                                            title="Set as default"
                                        >
                                            <Check className="w-4 h-4" />
                                        </button>
                                    )}
                                    <button
                                        onClick={() => handleEdit(address)}
                                        className="p-2 hover:bg-[var(--brutal-gray-100)] transition-colors"
                                        title="Edit"
                                    >
                                        <Edit className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(address.id)}
                                        className="p-2 hover:bg-[var(--brutal-gray-100)] text-[var(--brutal-red)] transition-colors"
                                        title="Delete"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
