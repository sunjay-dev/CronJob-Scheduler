import { useEffect } from "react";
import { HomeFooter, HomeHeader } from "../components";
import { Helmet } from "react-helmet-async";

export default function Terms() {
  useEffect(() => {
      window.scrollTo(0, 0);
    }, []);

  return (
    <div className="bg-gray-50 min-h-screen font-[Inter]">
      <Helmet>
        <title>Terms of Service - CronJob Schedular</title>
        <meta
          name="description"
          content="Read the Terms of Service for CronJob Scheduler, including usage rules, account responsibilities, and governing law."
        />
        <link rel="canonical" href="https://www.cronjon.site/terms" />
      </Helmet>
      <HomeHeader home={false} />

      <main className="max-w-4xl mt-20 mb-10 mx-auto px-4 py-12 space-y-10">
        <section className="space-y-5">
          <h1 className="font-bold text-4xl">Terms</h1>
          <p><strong>Last updated:</strong> September 21, 2025</p>
          <p>
            Welcome to <strong>CronJob Scheduler</strong>! By accessing or using our service, you agree to be bound by these Terms of Service. If you do not agree, please do not use the Service.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-2">1. Use of Service</h2>
          <p>
            CronJob Scheduler is an open-source platform designed for scheduling, managing, and monitoring automated tasks. You may use it for lawful purposes only. You agree not to upload, share, or distribute content that is illegal, harmful, or infringes on the rights of others.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-2">2. Account Responsibilities</h2>
          <p>
            If you create an account, you are responsible for maintaining the confidentiality of your login credentials and for all activities that occur under your account. Notify us immediately of any unauthorized access or use.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-2">3. Intellectual Property</h2>
          <p>
            All content, features, and functionality of CronJob Scheduler, including code, design, and trademarks, are owned by us or our licensors. You may not copy, modify, distribute, or create derivative works without explicit permission, except as allowed by the open-source license.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-2">4. Third-Party Services</h2>
          <p>
            Our Service may integrate with third-party services such as email providers or cloud platforms. We are not responsible for the terms, privacy policies, or practices of these third parties.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-2">5. Limitation of Liability</h2>
          <p>
            The Service is provided "as is" without warranties of any kind. To the maximum extent permitted by law, we are not liable for any damages or losses resulting from your use or inability to use the Service.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-2">6. Changes to Terms</h2>
          <p>
            We may update these Terms periodically. Users will be notified via email or a notice on the website. Continued use of the Service after changes indicates acceptance of the updated terms.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-2">7. Governing Law & Jurisdiction</h2>
          <p>
            These Terms are governed by the laws of Pakistan. However, CronJob Scheduler is an open-source project available worldwide, and by using it, you agree to comply with local laws applicable in your country.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-2">8. Contact</h2>
          <p>
            For any questions about these Terms, contact us at{" "}
            <a href="mailto:help@cronjon.site" className="text-purple-600 underline">
              help@cronjon.site
            </a>.
          </p>
        </section>
      </main>

      <HomeFooter />
    </div>
  );
}
