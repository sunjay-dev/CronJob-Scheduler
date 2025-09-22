import { useEffect } from "react";
import { HomeFooter, HomeHeader } from "../components";
import { Helmet } from "react-helmet-async";

export default function PrivacyPolicy() {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="bg-gray-50 text-gray-900 font-[Inter]">
            <Helmet>
                <title>Privacy Policy - CronJob Scheduler</title>
                <meta
                    name="description"
                    content="Read the Privacy Policy for CronJob Scheduler, detailing how we collect, use, and protect your information."
                />
            </Helmet>
            <HomeHeader home={false} />
            <main className="max-w-4xl mx-auto mt-20 mb-10 px-4 py-12">
                <section className="space-y-5">
                    <h1 className="font-bold text-4xl">Privacy Policy</h1>
                    <p><strong>Last updated:</strong> September 21, 2025</p>

                    <p>CronJob Scheduler ("we", "our", "us") respects your privacy. This Privacy Policy explains how we collect, use, and protect your information when you use our service.</p>

                    <h2 className="text-2xl font-semibold">Information We Collect</h2>
                    <ul className="list-disc list-inside space-y-2">
                        <li>Email address (provided during signup)</li>
                        <li>Optional: Name</li>
                        <li>Basic usage data (IP address, browser info) for improving the service</li>
                    </ul>

                    <h2 className="text-2xl font-semibold">How We Use Your Data</h2>
                    <ul className="list-disc list-inside space-y-2">
                        <li>To provide and maintain CronJob Scheduler</li>
                        <li>To communicate important updates via email</li>
                        <li>To improve the Service and troubleshoot issues</li>
                    </ul>

                    <h2 className="text-2xl font-semibold">Cookies & Tracking</h2>
                    <p>We currently do not use any third-party analytics or advertising. Basic cookies may be used for session management.</p>

                    <h2 className="text-2xl font-semibold">Data Sharing</h2>
                    <p>We do not sell or rent your personal information. Data may be shared only with our service providers for operational purposes, or if required by law.</p>

                    <h2 className="text-2xl font-semibold">Your Rights</h2>
                    <p>You can request access, correction, or deletion of your personal data by emailing <a href="mailto:help@cronjon.site" className="text-purple-600 underline">help@cronjon.site</a>.</p>

                    <h2 className="text-2xl font-semibold">Children</h2>
                    <p>Our service is not intended for children under 13.</p>

                    <h2 className="text-2xl font-semibold">Changes</h2>
                    <p>We may update this Privacy Policy occasionally. We will notify users via email or on the website.</p>

                    <h2 className="text-2xl font-semibold">Contact</h2>
                    <p>Email: <a href="mailto:help@cronjon.site" className="text-purple-600 underline">help@cronjon.site</a></p>
                </section>
            </main>
            <HomeFooter />
        </div>
    )
}
