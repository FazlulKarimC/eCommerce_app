'use client';

import { useState } from 'react';
import { MapPin, Plus, Trash2, Edit, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Badge } from '@/components/ui';

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
                id: crypto.randomUUID(),
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
        <div>
            <Card shadow="md">
                <CardHeader className="flex flex-row items-center justify-between gap-4">
                    <div>
                        <CardTitle className="text-2xl">Saved Addresses</CardTitle>
                        <p className="text-gray-600 mt-1">
                            Manage your shipping and billing addresses
                        </p>
                    </div>
                    {!isAdding && (
                        <Button onClick={() => setIsAdding(true)}>
                            <Plus className="w-4 h-4" />
                            Add Address
                        </Button>
                    )}
                </CardHeader>

                {/* Add/Edit Form */}
                {isAdding && (
                    <CardContent className="border-t-4 border-black bg-gray-50">
                        <form onSubmit={handleSubmit}>
                            <h3 className="font-black mb-4">
                                {editingId ? 'Edit Address' : 'Add New Address'}
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="font-bold text-sm block mb-2">First Name</label>
                                    <Input
                                        type="text"
                                        value={formData.firstName}
                                        onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="font-bold text-sm block mb-2">Last Name</label>
                                    <Input
                                        type="text"
                                        value={formData.lastName}
                                        onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                                        required
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="font-bold text-sm block mb-2">Address Line 1</label>
                                    <Input
                                        type="text"
                                        value={formData.line1}
                                        onChange={(e) => setFormData(prev => ({ ...prev, line1: e.target.value }))}
                                        required
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="font-bold text-sm block mb-2">Address Line 2 (Optional)</label>
                                    <Input
                                        type="text"
                                        value={formData.line2}
                                        onChange={(e) => setFormData(prev => ({ ...prev, line2: e.target.value }))}
                                    />
                                </div>
                                <div>
                                    <label className="font-bold text-sm block mb-2">City</label>
                                    <Input
                                        type="text"
                                        value={formData.city}
                                        onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="font-bold text-sm block mb-2">State</label>
                                    <Input
                                        type="text"
                                        value={formData.state}
                                        onChange={(e) => setFormData(prev => ({ ...prev, state: e.target.value }))}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="font-bold text-sm block mb-2">Postal Code</label>
                                    <Input
                                        type="text"
                                        value={formData.postalCode}
                                        onChange={(e) => setFormData(prev => ({ ...prev, postalCode: e.target.value }))}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="font-bold text-sm block mb-2">Country</label>
                                    <Input
                                        type="text"
                                        value={formData.country}
                                        onChange={(e) => setFormData(prev => ({ ...prev, country: e.target.value }))}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="flex gap-4 mt-6">
                                <Button type="submit">
                                    {editingId ? 'Update Address' : 'Save Address'}
                                </Button>
                                <Button type="button" variant="outline" onClick={resetForm}>
                                    Cancel
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                )}

                {/* Address List */}
                {addresses.length === 0 && !isAdding ? (
                    <CardContent className="p-12 text-center">
                        <MapPin className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                        <h3 className="text-xl font-black">No Addresses Saved</h3>
                        <p className="text-gray-600 mt-2">
                            Add an address to speed up checkout
                        </p>
                    </CardContent>
                ) : (
                    <div className="divide-y-4 divide-black">
                        {addresses.map((address) => (
                            <div key={address.id} className="p-6 flex items-start justify-between gap-4">
                                <div className="flex items-start gap-4">
                                    <MapPin className="w-5 h-5 text-gray-500 mt-1 shrink-0" />
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <p className="font-bold">{address.firstName} {address.lastName}</p>
                                            {address.isDefault && (
                                                <Badge variant="success" size="sm">Default</Badge>
                                            )}
                                        </div>
                                        <p className="text-gray-600">{address.line1}</p>
                                        {address.line2 && <p className="text-gray-600">{address.line2}</p>}
                                        <p className="text-gray-600">
                                            {address.city}, {address.state} {address.postalCode}
                                        </p>
                                        <p className="text-gray-600">{address.country}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    {!address.isDefault && (
                                        <button
                                            onClick={() => setDefault(address.id)}
                                            className="p-2 hover:bg-yellow-400 transition-colors rounded-lg"
                                            title="Set as default"
                                        >
                                            <Check className="w-4 h-4" />
                                        </button>
                                    )}
                                    <button
                                        onClick={() => handleEdit(address)}
                                        className="p-2 hover:bg-gray-100 transition-colors rounded-lg"
                                        title="Edit"
                                    >
                                        <Edit className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(address.id)}
                                        className="p-2 hover:bg-red-50 text-red-500 transition-colors rounded-lg"
                                        title="Delete"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </Card>
        </div>
    );
}
