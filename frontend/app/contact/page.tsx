'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mail, Phone, MapPin, Send, Clock, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui';

export default function ContactPage() {
    const [formState, setFormState] = useState({
        name: '',
        email: '',
        subject: '',
        message: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate form submission
        await new Promise(resolve => setTimeout(resolve, 1000));

        // TODO: Implement actual form submission (e.g., API call, Formspree, etc.)
        console.log('Form submitted:', formState);

        setIsSubmitting(false);
        setIsSubmitted(true);
        setFormState({ name: '', email: '', subject: '', message: '' });
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormState(prev => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <section className="bg-yellow-400 border-b-4 border-black py-16">
                <div className="container mx-auto max-w-5xl px-4 text-center">
                    <div className="inline-block bg-black text-white px-4 py-2 rounded-lg border-4 border-black mb-6 rotate-2 shadow-[4px_4px_0px_#FACC15]">
                        <span className="font-mono text-sm font-bold uppercase tracking-wider flex items-center gap-2">
                            <MessageSquare className="w-4 h-4" />
                            Get in Touch
                        </span>
                    </div>

                    <h1 className="text-5xl md:text-6xl font-black tracking-tight mb-4">
                        LET'S TALK
                    </h1>

                    <p className="text-xl font-medium max-w-xl mx-auto">
                        Questions, feedback, or just want to say hi? We'd love to hear from you.
                    </p>
                </div>
            </section>

            {/* Main Content */}
            <section className="py-16">
                <div className="container mx-auto max-w-5xl px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                        {/* Contact Info Cards */}
                        <div className="lg:col-span-1 space-y-6">
                            {[
                                {
                                    icon: Mail,
                                    title: 'Email Us',
                                    content: 'hello@brutal.store',
                                    subtext: 'We reply within 24 hours',
                                    color: 'bg-red-500',
                                },
                                {
                                    icon: Phone,
                                    title: 'Call Us',
                                    content: '+1 (555) 123-4567',
                                    subtext: 'Mon-Fri, 9am-6pm EST',
                                    color: 'bg-yellow-400 text-black',
                                },
                                {
                                    icon: MapPin,
                                    title: 'Visit Us',
                                    content: '123 Bold Street',
                                    subtext: 'New York, NY 10001',
                                    color: 'bg-black',
                                },
                            ].map((item) => (
                                <div
                                    key={item.title}
                                    className="bg-white border-4 border-black rounded-xl p-6 shadow-[4px_4px_0px_#000] hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[8px_8px_0px_#000] transition-all duration-200"
                                >
                                    <div className={`w-12 h-12 ${item.color} border-4 border-black rounded-lg flex items-center justify-center mb-4 shadow-[2px_2px_0px_#000] ${item.color === 'bg-yellow-400 text-black' ? '' : 'text-white'}`}>
                                        <item.icon className="w-6 h-6" />
                                    </div>
                                    <h3 className="text-lg font-black uppercase tracking-tight mb-1">{item.title}</h3>
                                    <p className="font-bold text-black">{item.content}</p>
                                    <p className="text-gray-500 text-sm mt-1">{item.subtext}</p>
                                </div>
                            ))}

                            {/* Hours Card */}
                            <div className="bg-black text-white border-4 border-black rounded-xl p-6 shadow-[4px_4px_0px_#FACC15]">
                                <div className="flex items-center gap-3 mb-4">
                                    <Clock className="w-6 h-6 text-yellow-400" />
                                    <h3 className="text-lg font-black uppercase tracking-tight">Business Hours</h3>
                                </div>
                                <div className="space-y-2 font-medium">
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Mon - Fri</span>
                                        <span>9:00 AM - 6:00 PM</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Saturday</span>
                                        <span>10:00 AM - 4:00 PM</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Sunday</span>
                                        <span className="text-red-400">Closed</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div className="lg:col-span-2">
                            <div className="bg-white border-4 border-black rounded-xl p-8 shadow-[8px_8px_0px_#000]">
                                <h2 className="text-2xl font-black uppercase tracking-tight mb-6">Send Us a Message</h2>

                                {isSubmitted ? (
                                    <div className="text-center py-12">
                                        <div className="w-20 h-20 bg-yellow-400 border-4 border-black rounded-full flex items-center justify-center mx-auto mb-6 shadow-[4px_4px_0px_#000]">
                                            <Send className="w-10 h-10" />
                                        </div>
                                        <h3 className="text-2xl font-black uppercase mb-4">Message Sent!</h3>
                                        <p className="text-gray-600 mb-6">Thanks for reaching out. We'll get back to you soon.</p>
                                        <Button onClick={() => setIsSubmitted(false)}>
                                            Send Another Message
                                        </Button>
                                    </div>
                                ) : (
                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label htmlFor="name" className="block font-bold text-sm uppercase tracking-wider mb-2">
                                                    Your Name *
                                                </label>
                                                <input
                                                    type="text"
                                                    id="name"
                                                    name="name"
                                                    required
                                                    value={formState.name}
                                                    onChange={handleChange}
                                                    className="w-full h-12 px-4 bg-white border-4 border-black rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 transition-all"
                                                    placeholder="John Doe"
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="email" className="block font-bold text-sm uppercase tracking-wider mb-2">
                                                    Email Address *
                                                </label>
                                                <input
                                                    type="email"
                                                    id="email"
                                                    name="email"
                                                    required
                                                    value={formState.email}
                                                    onChange={handleChange}
                                                    className="w-full h-12 px-4 bg-white border-4 border-black rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 transition-all"
                                                    placeholder="john@example.com"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label htmlFor="subject" className="block font-bold text-sm uppercase tracking-wider mb-2">
                                                Subject *
                                            </label>
                                            <select
                                                id="subject"
                                                name="subject"
                                                required
                                                value={formState.subject}
                                                onChange={handleChange}
                                                className="w-full h-12 px-4 bg-white border-4 border-black rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 transition-all appearance-none cursor-pointer"
                                            >
                                                <option value="">Select a topic...</option>
                                                <option value="order">Order Inquiry</option>
                                                <option value="product">Product Question</option>
                                                <option value="shipping">Shipping & Delivery</option>
                                                <option value="returns">Returns & Exchanges</option>
                                                <option value="feedback">Feedback</option>
                                                <option value="other">Other</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label htmlFor="message" className="block font-bold text-sm uppercase tracking-wider mb-2">
                                                Your Message *
                                            </label>
                                            <textarea
                                                id="message"
                                                name="message"
                                                required
                                                rows={6}
                                                value={formState.message}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3 bg-white border-4 border-black rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 transition-all resize-none"
                                                placeholder="Tell us what's on your mind..."
                                            />
                                        </div>

                                        <Button
                                            type="submit"
                                            size="lg"
                                            disabled={isSubmitting}
                                            className="w-full md:w-auto"
                                        >
                                            {isSubmitting ? (
                                                <>Sending...</>
                                            ) : (
                                                <>
                                                    <Send className="w-5 h-5" />
                                                    Send Message
                                                </>
                                            )}
                                        </Button>
                                    </form>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ Teaser */}
            <section className="py-12 border-t-4 border-black">
                <div className="container mx-auto max-w-3xl px-4 text-center">
                    <div className="bg-yellow-400 border-4 border-black rounded-xl p-8 shadow-[8px_8px_0px_#000] -rotate-1">
                        <h2 className="text-2xl font-black uppercase tracking-tight mb-4">
                            Looking for Quick Answers?
                        </h2>
                        <p className="font-medium mb-6">
                            Check out our frequently asked questions for instant help.
                        </p>
                        <Button asChild variant="secondary">
                            <Link href="/coming-soon">
                                View FAQ
                            </Link>
                        </Button>
                    </div>
                </div>
            </section>
        </div>
    );
}
