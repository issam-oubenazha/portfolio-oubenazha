
'use client';

import { useState, type FormEvent } from 'react';

export default function Contact() {
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<{
        type: 'success' | 'error';
        message: string;
    } | null>(null);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const form = event.currentTarget;
        const formData = new FormData(form);

        setLoading(true);
        setStatus(null);

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: formData.get('name'),
                    email: formData.get('email'),
                    message: formData.get('message'),
                    website: formData.get('website'),
                }),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Failed to send message.');
            }

            setStatus({
                type: 'success',
                message: 'Your message has been sent successfully! 🚀',
            });

            form.reset();

        } catch (error) {
            setStatus({
                type: 'error',
                message:
                    error instanceof Error
                        ? error.message
                        : 'Something went wrong. Please try again.',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="w-full text-center px-4 py-20 sm:px-6 lg:px-8 min-h-screen flex items-center relative overflow-hidden" id="contact">

            {/* Background decoration */}
            <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"></div>

            <div className="w-full relative z-10">

                <h3 className="text-lg font-bold text-cyan-400 animate-fadeInUp">
                    Get In Touch
                </h3>

                <h2 className="text-4xl md:text-5xl font-bold gradient-text animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
                    Contact Me
                </h2>

                <div className="grid max-w-6xl mx-auto md:grid-cols-2 gap-10 lg:gap-16 mt-12 lg:mt-16 text-left">

                    {/* Contact Information */}
                    <div className="w-full max-w-xl mx-auto animate-fadeInUp" style={{ animationDelay: '0.4s' }}>

                        <h3 className="font-bold text-xl mb-6 text-cyan-400 text-center">
                            Talk To Me
                        </h3>

                        <div className="flex items-center justify-center flex-col gap-3">

                            {/* Email Card */}
                            <div className="w-full glass-effect border-b-4 border-b-cyan-500 p-8 hover:bg-gray-700/50 transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/50 rounded-xl group cursor-pointer">

                                <i className="fas fa-envelope text-3xl text-cyan-400 mb-3 group-hover:animate-bounce"></i>

                                <h3 className="font-bold text-xl text-emerald-100">
                                    Email
                                </h3>

                                <span className="contact_card-data text-cyan-300 font-semibold break-all">
                                    issamoubenazha@gmail.com
                                </span>

                                <a href="mailto:issamoubenazha@gmail.com" className="flex items-center justify-center gap-3 text-cyan-400 mt-4 hover:text-emerald-300 transition-colors font-semibold">
                                    Write Me <i className="fas fa-arrow-alt-circle-right group-hover:translate-x-1 transition-transform"></i>
                                </a>
                            </div>

                            {/* WhatsApp Card */}
                            <div className="w-full glass-effect border-b-4 border-b-emerald-500 p-8 hover:bg-gray-700/50 transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-emerald-500/50 rounded-xl group cursor-pointer" style={{ animationDelay: '0.2s' }}>

                                <i className="fa-brands fa-whatsapp text-3xl text-emerald-400 mb-3 group-hover:animate-bounce"></i>

                                <h3 className="font-bold text-xl text-emerald-100">
                                    WhatsApp
                                </h3>

                                <span className="contact_card-data text-cyan-300 font-semibold">
                                    +212 656822152
                                </span>

                                <a href="https://wa.me/qr/I6Q5NTXFMJYRO1" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-3 text-emerald-400 mt-4 hover:text-cyan-300 transition-colors font-semibold">
                                    Write Me <i className="fas fa-arrow-alt-circle-right group-hover:translate-x-1 transition-transform"></i>
                                </a>
                            </div>

                            {/* LinkedIn Card */}
                            <div className="w-full glass-effect border-b-4 border-b-cyan-500 p-8 hover:bg-gray-700/50 transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/50 rounded-xl group cursor-pointer" style={{ animationDelay: '0.4s' }}>

                                <i className="fa-brands fa-linkedin text-3xl text-cyan-400 mb-3 group-hover:animate-bounce"></i>

                                <h3 className="font-bold text-xl text-emerald-100">
                                    Linkedin
                                </h3>

                                <span className="contact_card-data text-cyan-300 font-semibold">
                                    Issam Oubenazha
                                </span>

                                <a href="https://www.linkedin.com/in/issam-oubenazha" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-3 text-cyan-400 mt-4 hover:text-emerald-300 transition-colors font-semibold">
                                    Write Me <i className="fas fa-arrow-alt-circle-right group-hover:translate-x-1 transition-transform"></i>
                                </a>
                            </div>

                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="w-full max-w-xl mx-auto animate-fadeInUp" style={{ animationDelay: '0.6s' }}>

                        <h3 className="font-bold text-xl mb-6 text-emerald-400 text-center">
                            Write Me Your Project
                        </h3>

                        <form className="contact_form space-y-6" onSubmit={handleSubmit}>

                            {/* Name */}
                            <div className="contact_form-div group">

                                <label htmlFor="contact-name" className="contact_form-tag text-xl text-white bg-gradient-to-r from-cyan-600 to-emerald-600 rounded px-3 py-1 font-semibold">
                                    Name
                                </label>

                                <input
                                    id="contact-name"
                                    name="name"
                                    type="text"
                                    autoComplete="name"
                                    placeholder="Insert Your Name"
                                    maxLength={100}
                                    required
                                    className="contact_form-input border-2 border-cyan-600 text-emerald-100 bg-gray-900/60 focus:bg-gray-800/80 focus:border-emerald-400 focus:shadow-lg focus:shadow-cyan-500/30 transition-all rounded-lg"
                                />
                            </div>

                            {/* Email */}
                            <div className="contact_form-div group">

                                <label htmlFor="contact-email" className="contact_form-tag text-xl text-white bg-gradient-to-r from-emerald-600 to-cyan-600 rounded px-3 py-1 font-semibold">
                                    Email
                                </label>

                                <input
                                    id="contact-email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    placeholder="Insert Your Email"
                                    maxLength={254}
                                    required
                                    className="contact_form-input border-2 border-emerald-600 text-emerald-100 bg-gray-900/60 focus:bg-gray-800/80 focus:border-cyan-400 focus:shadow-lg focus:shadow-emerald-500/30 transition-all rounded-lg"
                                />
                            </div>

                            {/* Project */}
                            <div className="contact_form-div contact_form-area group">

                                <label htmlFor="contact-message" className="contact_form-tag text-xl text-white bg-gradient-to-r from-cyan-600 to-emerald-600 rounded px-3 py-1 font-semibold">
                                    Project
                                </label>

                                <textarea
                                    id="contact-message"
                                    name="message"
                                    className="contact_form-input border-2 border-cyan-600 text-emerald-100 bg-gray-900/60 focus:bg-gray-800/80 focus:border-emerald-400 focus:shadow-lg focus:shadow-cyan-500/30 transition-all rounded-lg"
                                    placeholder="Write Your Project"
                                    cols={30}
                                    rows={10}
                                    maxLength={2000}
                                    required
                                />
                            </div>

                            {/* Honeypot anti-spam field */}
                            <input
                                type="text"
                                name="website"
                                tabIndex={-1}
                                autoComplete="off"
                                aria-hidden="true"
                                className="hidden"
                            />

                            {/* Success / Error feedback */}
                            {status && (
                                <div
                                    role="status"
                                    aria-live="polite"
                                    className={`p-4 rounded-lg text-center font-semibold ${
                                        status.type === 'success'
                                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500'
                                            : 'bg-red-500/20 text-red-300 border border-red-500'
                                    }`}
                                >
                                    {status.message}
                                </div>
                            )}

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full rounded-lg bg-gradient-to-r from-cyan-600 to-emerald-600 font-bold px-5 py-3 hover:shadow-lg hover:shadow-cyan-500/50 text-emerald-100 transition-all duration-300 transform hover:scale-105 relative overflow-hidden group disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
                            >
                                <span className="relative z-10">
                                    {loading ? 'Sending...' : 'Send Message'}
                                </span>

                                <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-cyan-600 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
                            </button>

                        </form>
                    </div>

                </div>
            </div>
        </section>
    );
}
