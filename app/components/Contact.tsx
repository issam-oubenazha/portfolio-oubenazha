'use client';

import { useRef, useState, type FormEvent } from 'react';
import {
    FaArrowRight,
    FaEnvelope,
    FaGithub,
    FaLinkedin,
    FaPhone,
    FaSpinner,
} from 'react-icons/fa';
import './Contact.css';

type SubmissionStatus = {
    type: 'success' | 'error';
    message: string;
};

const contactDetails = [
    {
        icon: FaEnvelope,
        label: 'Email',
        value: 'issamoubenazha@gmail.com',
        href: 'mailto:issamoubenazha@gmail.com',
    },
    {
        icon: FaPhone,
        label: 'WhatsApp',
        value: '+212 656822152',
        href: 'https://wa.me/qr/I6Q5NTXFMJYRO1',
    },
    {
        icon: FaLinkedin,
        label: 'LinkedIn',
        value: 'Issam Oubenazha',
        href: 'https://www.linkedin.com/in/issam-oubenazha',
    },
];

export default function Contact() {
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<SubmissionStatus | null>(null);
    const submissionInProgress = useRef(false);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (submissionInProgress.current) {
            return;
        }

        submissionInProgress.current = true;
        setLoading(true);
        setStatus(null);

        const form = event.currentTarget;
        const formData = new FormData(form);

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: formData.get('name'),
                    email: formData.get('email'),
                    subject: formData.get('subject'),
                    service: formData.get('service'),
                    message: formData.get('message'),
                    website: formData.get('website'),
                }),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Failed to send your message. Please try again.');
            }

            setStatus({
                type: 'success',
                message: 'Your message has been sent successfully!',
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
            submissionInProgress.current = false;
            setLoading(false);
        }
    };

    return (
        <section className="contact-page" id="contact" aria-labelledby="contact-title">
            <div className="contact-page__glow contact-page__glow--top" aria-hidden="true" />
            <div className="contact-page__glow contact-page__glow--bottom" aria-hidden="true" />

            <div className="contact-page__container">
                <header className="contact-page__hero">
                    <p className="contact-page__eyebrow">
                        <span className="contact-page__eyebrow-line" aria-hidden="true" />
                    </p>
                    <h2 className="contact-page__title" id="contact-title">
                        <span>Contact Me</span>
                    </h2>
                    <p className="contact-page__intro">
                        Get in touch for questions, collaborations, or business inquiries.
                        Tell me about your project and let&apos;s create something great.
                    </p>
                </header>

                <div className="contact-page__grid">
                    <aside className="contact-page__sidebar" aria-labelledby="contact-details-title">
                        <div className="contact-page__sidebar-heading">
                            <span className="contact-page__overline">Get in touch</span>
                            <h3 id="contact-details-title">Talk To Me</h3>
                            <p>
                                Reach out by email, WhatsApp, or connect with me on LinkedIn.
                            </p>
                        </div>

                        <div className="contact-page__details">
                            {contactDetails.map(({ icon: Icon, label, value, href }) => {
                                const content = (
                                    <>
                                        <span className="contact-page__detail-icon" aria-hidden="true">
                                            <Icon />
                                        </span>
                                        <span className="contact-page__detail-copy">
                                            <span className="contact-page__detail-label">{label}</span>
                                            <span className="contact-page__detail-value">{value}</span>
                                        </span>
                                        {href && (
                                            <FaArrowRight
                                                className="contact-page__detail-arrow"
                                                aria-hidden="true"
                                            />
                                        )}
                                    </>
                                );

                                return href ? (
                                    <a
                                        className="contact-page__detail"
                                        href={href}
                                        key={label}
                                        target={href.startsWith('https://') ? '_blank' : undefined}
                                        rel={href.startsWith('https://') ? 'noopener noreferrer' : undefined}
                                    >
                                        {content}
                                    </a>
                                ) : (
                                    <div className="contact-page__detail" key={label}>
                                        {content}
                                    </div>
                                );
                            })}
                        </div>

                        <div className="contact-page__social">
                            <span className="contact-page__overline">Find me online</span>
                            <div className="contact-page__social-links">
                                <a
                                    href="https://github.com/issam-oubenazha"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="Visit Issam's GitHub profile"
                                >
                                    <FaGithub aria-hidden="true" />
                                    <span>GitHub</span>
                                </a>
                                <a
                                    href="https://www.linkedin.com/in/issam-oubenazha-651b12352/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="Visit Issam's LinkedIn profile"
                                >
                                    <FaLinkedin aria-hidden="true" />
                                    <span>LinkedIn</span>
                                </a>
                            </div>
                        </div>
                    </aside>

                    <div className="contact-page__form-card">
                        <div className="contact-page__form-heading">
                            <span className="contact-page__overline">Tell me about it</span>
                            <h3>Write Me Your Project</h3>
                            <p>Fields marked with <span aria-hidden="true">*</span> are required.</p>
                        </div>

                        <form className="contact-page__form" onSubmit={handleSubmit}>
                            <div className="contact-page__field-row">
                                <div className="contact-page__field">
                                    <label htmlFor="contact-name">Name <span aria-hidden="true">*</span></label>
                                    <input
                                        id="contact-name"
                                        name="name"
                                        type="text"
                                        autoComplete="name"
                                        placeholder="Insert Your Name"
                                        maxLength={100}
                                        required
                                        disabled={loading}
                                    />
                                </div>
                                <div className="contact-page__field">
                                    <label htmlFor="contact-email">Email address <span aria-hidden="true">*</span></label>
                                    <input
                                        id="contact-email"
                                        name="email"
                                        type="email"
                                        autoComplete="email"
                                        placeholder="Insert Your Email"
                                        maxLength={254}
                                        required
                                        disabled={loading}
                                    />
                                </div>
                            </div>

                            <div className="contact-page__field-row">
                                <div className="contact-page__field">
                                    <label htmlFor="contact-subject">Subject <span aria-hidden="true">*</span></label>
                                    <input
                                        id="contact-subject"
                                        name="subject"
                                        type="text"
                                        placeholder="What would you like to discuss?"
                                        maxLength={150}
                                        required
                                        disabled={loading}
                                    />
                                </div>
                                <div className="contact-page__field">
                                    <label htmlFor="contact-service">
                                        Service interested in <span aria-hidden="true">*</span>
                                    </label>
                                    <select
                                        id="contact-service"
                                        name="service"
                                        defaultValue=""
                                        required
                                        disabled={loading}
                                    >
                                        <option value="" disabled>Select a service</option>
                                        <option value="Web development">Web development</option>
                                        <option value="AI & data science">AI &amp; data science</option>
                                        <option value="Full-stack application">Full-stack application</option>
                                        <option value="Something else">Something else</option>
                                    </select>
                                </div>
                            </div>

                            <div className="contact-page__field">
                                <label htmlFor="contact-message">Project <span aria-hidden="true">*</span></label>
                                <textarea
                                    id="contact-message"
                                    name="message"
                                    placeholder="Write Your Project"
                                    rows={5}
                                    maxLength={2000}
                                    required
                                    disabled={loading}
                                />
                            </div>

                            <input
                                type="text"
                                name="website"
                                tabIndex={-1}
                                autoComplete="off"
                                aria-hidden="true"
                                className="contact-page__honeypot"
                            />

                            {status && (
                                <p
                                    className={`contact-page__status contact-page__status--${status.type}`}
                                    role={status.type === 'error' ? 'alert' : 'status'}
                                    aria-live={status.type === 'error' ? 'assertive' : 'polite'}
                                >
                                    {status.message}
                                </p>
                            )}

                            <button
                                className="contact-page__submit"
                                type="submit"
                                disabled={loading}
                            >
                                <span>{loading ? 'Sending...' : 'Send Message'}</span>
                                {loading ? (
                                    <FaSpinner aria-hidden="true" />
                                ) : (
                                    <FaArrowRight aria-hidden="true" />
                                )}
                            </button>
                        </form>
                    </div>
                </div>

            </div>
        </section>
    );
}
