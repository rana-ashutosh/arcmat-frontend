'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { useAuth } from '@/hooks/useAuth';
import Container from '@/components/ui/Container';
import Button from '@/components/ui/Button';
import BackLink from '@/components/ui/BackLink';

export default function ContactUsPage() {
    const { user } = useAuth();
    const [selectedTopic, setSelectedTopic] = useState('');
    const [isFormVisible, setIsFormVisible] = useState(false);

    const { register, handleSubmit, formState: { errors } } = useForm();

    const topics = [
        " I'm a manufacturer interested in showcasing my product catalog on ArcMat",
        " I want to sell my products through ArcMat Shop—let's discuss partnership opportunities",
        " I need after-sales support for a product I purchased (order issues, returns, warranty)",
        " I'm experiencing technical issues with my ArcMat account (login, profile, settings)",
        " I have a general inquiry or feedback about the platform"
    ];

    const handleTopicChange = (e) => {
        const value = e.target.value;
        setSelectedTopic(value);
        if (value) {
            setIsFormVisible(true);
        } else {
            setIsFormVisible(false);
        }
    };

    const onSubmit = (data) => {
        alert('Message sent! (Simulation)');
    };

    return (
        <>
            <main className="py-8 bg-white">
                <Container>
                    <div >
                        <div className="mb-6">
                            <BackLink useRouterBack={true} />
                        </div>
                        <h1 className="text-3xl sm:text-4xl font-normal text-gray-900 mb-6">Contact us</h1>

                        <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-8">
                            We're here to help you succeed. Whether you're a manufacturer looking to showcase your products,
                            a designer seeking the perfect materials, or need support with your order—our dedicated team is
                            ready to assist you.
                            <br /><br />
                            <strong>Quick answers first:</strong> Check our <Link href="/not-found" className="underline text-gray-900 font-medium">FAQ section</Link> for
                            instant solutions to common questions about orders, shipments, registration, and platform features.
                            <br /><br />
                            Can't find what you need? Fill out the form below and we'll connect you with the right specialist.
                            We typically respond within 24 hours during business days.
                        </p>

                        <div className="grid sm:grid-cols-2 gap-6 mb-10">
                            <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
                                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-2">Email Us</h3>
                                <div className="flex flex-col gap-1">
                                    <a
                                        href="mailto:info@arcmat.in"
                                        className="text-base text-gray-700 hover:text-[#d9a88a] transition-colors"
                                    >
                                        info@arcmat.in
                                    </a>
                                    <a
                                        href="mailto:partnerships@arcmat.in"
                                        className="text-base text-gray-700 hover:text-[#d9a88a] transition-colors"
                                    >
                                        partnerships@arcmat.in
                                    </a>
                                </div>
                            </div>
                            <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
                                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-2">Call Us</h3>
                                <a href="tel:+917357614545" className="text-base text-gray-700 hover:text-[#d9a88a] transition-colors">
                                    + 91 73576-14545
                                </a>
                            </div>
                        </div>

                        <div className="border-t border-gray-100 pt-8">
                            <h2 className="text-lg font-medium text-gray-900 mb-6">Contact Form</h2>

                            <div className="space-y-6">
                                <div className="relative">
                                    <select
                                        className="w-full p-4 pr-10 bg-white border border-gray-200 text-gray-700 text-sm focus:outline-none focus:border-gray-400 appearance-none rounded-none cursor-pointer"
                                        value={selectedTopic}
                                        onChange={handleTopicChange}
                                    >
                                        <option value="" disabled>Select a topic</option>
                                        {topics.map((topic, index) => (
                                            <option key={index} value={topic}>{topic}</option>
                                        ))}
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                                        </svg>
                                    </div>
                                </div>

                                {isFormVisible && (
                                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-300">

                                        <div>
                                            <input
                                                type="text"
                                                placeholder="Name and Surname *"
                                                {...register('name', { required: true })}
                                                className="w-full p-4 border border-gray-200 text-gray-700 text-sm focus:outline-none focus:border-gray-400 placeholder-gray-400 rounded-none"
                                            />
                                            {errors.name && <span className="text-red-500 text-xs mt-1">This field is required</span>}
                                        </div>

                                        <div>
                                            <input
                                                type="email"
                                                placeholder="Email *"
                                                {...register('email', { required: true, pattern: /^\S+@\S+$/i })}
                                                className="w-full p-4 border border-gray-200 text-gray-700 text-sm focus:outline-none focus:border-gray-400 placeholder-gray-400 rounded-none"
                                            />
                                            {errors.email && <span className="text-red-500 text-xs mt-1">Please enter a valid email</span>}
                                        </div>

                                        <div>
                                            <textarea
                                                placeholder="Type in your request"
                                                rows={6}
                                                {...register('request')}
                                                className="w-full p-4 border border-gray-200 text-gray-700 text-sm focus:outline-none focus:border-gray-400 placeholder-gray-400 rounded-none resize-y"
                                            ></textarea>
                                        </div>

                                        <div className="relative">
                                            <select
                                                {...register('source')}
                                                className="w-full p-4 pr-10 bg-white border border-gray-200 text-gray-700 text-sm focus:outline-none focus:border-gray-400 appearance-none rounded-none cursor-pointer"
                                                defaultValue=""
                                            >
                                                <option value="" disabled>How did you hear about us?</option>
                                                <option value="social_media">Social Media</option>
                                                <option value="search_engine">Search Engine</option>
                                                <option value="friend">Friend/Colleague</option>
                                                <option value="other">Other</option>
                                            </select>
                                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                                                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                                                </svg>
                                            </div>
                                        </div>

                                        <div>
                                            <Button
                                                type="submit"
                                                className="bg-[#FF6B6B] hover:bg-[#ff5252] text-white px-8 py-3  text-sm font-bold uppercase tracking-wider"
                                            >
                                                Submit
                                            </Button>
                                        </div>

                                    </form>
                                )}
                                <div className="mt-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
                                    <h3 className="font-semibold text-gray-900 mb-3">What happens next?</h3>
                                    <ol className="space-y-2 text-sm text-gray-700">
                                        <li className="flex items-start gap-2">
                                            <span className="font-semibold text-blue-600">1.</span>
                                            <span>Your message is routed to the appropriate specialist based on your selected topic</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="font-semibold text-blue-600">2.</span>
                                            <span>You'll receive an email confirmation immediately</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="font-semibold text-blue-600">3.</span>
                                            <span>Our team will respond with a personalized solution within 24 hours</span>
                                        </li>
                                    </ol>
                                </div>
                            </div>
                        </div>
                    </div>
                </Container>
            </main>
        </>
    );
}
