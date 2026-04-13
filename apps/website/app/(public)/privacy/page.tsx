export const metadata = {
  title: "Privacy Policy — Golden Age Learning",
};

export default function PrivacyPolicyPage() {
  return (
    <main className="w-full min-h-screen bg-[var(--color-dark-bg)]">
      <div className="max-w-3xl mx-auto px-[24px] pt-[120px] pb-[80px] md:pt-[140px]">

        {/* Page title */}
        <h1 className="font-sans text-[36px] md:text-[42px] font-bold text-[var(--color-cream)] leading-tight mb-[8px]">
          Privacy Policy
        </h1>
        <p className="font-sans text-[15px] text-[rgba(245,237,214,0.45)] mb-[56px]">
          Effective Date: April 13, 2026
        </p>

        <div className="flex flex-col gap-[48px]">

          {/* 1. Introduction */}
          <Section number="1" title="Introduction">
            <p>
              Welcome. This Privacy Policy explains how we collect, use, disclose, and safeguard
              your information when you visit our website and use our booking services. Please read
              this policy carefully. By using our site, you agree to the terms described below.
            </p>
          </Section>

          <Divider />

          {/* 2. Information We Collect */}
          <Section number="2" title="Information We Collect">
            <SubHeading>Information you provide directly:</SubHeading>
            <ul className="list-disc list-outside ml-[20px] flex flex-col gap-[6px]">
              <li>Full name</li>
              <li>Email address</li>
              <li>Phone number</li>
              <li>Billing and payment information</li>
              <li>Booking details and preferences</li>
            </ul>

            <SubHeading>Information collected automatically:</SubHeading>
            <ul className="list-disc list-outside ml-[20px] flex flex-col gap-[6px]">
              <li>IP address</li>
              <li>Browser type and version</li>
              <li>Device information</li>
              <li>Pages visited and time spent on site</li>
              <li>Referring URLs</li>
              <li>Cookies and similar tracking technologies</li>
            </ul>
          </Section>

          <Divider />

          {/* 3. How We Use Your Information */}
          <Section number="3" title="How We Use Your Information">
            <p>We use the information we collect to:</p>
            <ul className="list-disc list-outside ml-[20px] flex flex-col gap-[6px]">
              <li>Process and confirm bookings</li>
              <li>Send booking confirmations, reminders, and updates</li>
              <li>Respond to inquiries and provide customer support</li>
              <li>Process payments securely</li>
              <li>Improve the functionality and user experience of our website</li>
              <li>Comply with legal obligations</li>
              <li>Send occasional service-related communications</li>
            </ul>
            <p>
              We do <strong className="text-[var(--color-cream)]">not</strong> sell your personal
              information to third parties.
            </p>
          </Section>

          <Divider />

          {/* 4. Sharing Your Information */}
          <Section number="4" title="Sharing Your Information">
            <p>
              We may share your information with trusted third parties only as necessary to operate
              our services, including:
            </p>
            <ul className="list-disc list-outside ml-[20px] flex flex-col gap-[6px]">
              <li>
                <strong className="text-[var(--color-cream)]">Payment processors</strong> to handle
                transactions securely
              </li>
              <li>
                <strong className="text-[var(--color-cream)]">
                  Email and communication providers
                </strong>{" "}
                to send booking confirmations
              </li>
              <li>
                <strong className="text-[var(--color-cream)]">Analytics providers</strong> to
                understand how our site is used
              </li>
              <li>
                <strong className="text-[var(--color-cream)]">Legal authorities</strong> if required
                by law or to protect our legal rights
              </li>
            </ul>
            <p>
              All third-party service providers are required to handle your data in accordance with
              applicable privacy laws.
            </p>
          </Section>

          <Divider />

          {/* 5. SMS Communications */}
          <Section number="5" title="SMS Communications">
            <p>
              We may send SMS (text message) communications to the phone number you provide, for
              the following purposes:
            </p>
            <ul className="list-disc list-outside ml-[20px] flex flex-col gap-[6px]">
              <li>
                <strong className="text-[var(--color-cream)]">Booking confirmations</strong> – A
                text confirmation when a booking is successfully made
              </li>
              <li>
                <strong className="text-[var(--color-cream)]">Booking reminders</strong> – Reminder
                messages prior to your scheduled booking
              </li>
              <li>
                <strong className="text-[var(--color-cream)]">Account notifications</strong> –
                Messages related to account creation or important account activity
              </li>
            </ul>

            {/* Highlighted SMS info box */}
            <div className="flex flex-col gap-[16px] rounded-[10px] border border-[rgba(201,168,76,0.25)] bg-[rgba(201,168,76,0.07)] px-[20px] py-[20px] mt-[4px]">
              <InfoRow label="Opt-Out">
                Reply{" "}
                <Keyword>STOP</Keyword>{" "}
                to any message at any time. You will receive one final confirmation and no further
                messages will be sent. To re-enable SMS, reply{" "}
                <Keyword>START</Keyword>.
              </InfoRow>
              <InfoRow label="Message Frequency">
                Message frequency varies based on your booking activity.
              </InfoRow>
              <InfoRow label="Message &amp; Data Rates">
                Standard message and data rates may apply depending on your mobile carrier and plan.
              </InfoRow>
              <InfoRow label="Your Phone Number">
                We will{" "}
                <strong className="text-[var(--color-cream)]">never</strong> share, sell, or
                disclose your phone number to third parties for their own marketing purposes. Your
                phone number is used solely to deliver the SMS communications described above.
              </InfoRow>
              <InfoRow label="Need Help?">
                Reply{" "}
                <Keyword>HELP</Keyword>{" "}
                to any SMS message or contact us using the details in Section 12.
              </InfoRow>
            </div>
          </Section>

          <Divider />

          {/* 6. Cookies */}
          <Section number="6" title="Cookies">
            <p>
              We use cookies to enhance your browsing experience. Cookies are small data files
              stored on your device. You may disable cookies through your browser settings, though
              some features of the site may not function properly as a result.
            </p>
            <p>Types of cookies we use:</p>
            <ul className="list-disc list-outside ml-[20px] flex flex-col gap-[6px]">
              <li>
                <strong className="text-[var(--color-cream)]">Essential cookies</strong> – Required
                for the site and booking process to function
              </li>
              <li>
                <strong className="text-[var(--color-cream)]">Analytics cookies</strong> – Help us
                understand site usage and performance
              </li>
              <li>
                <strong className="text-[var(--color-cream)]">Preference cookies</strong> – Remember
                your settings and choices
              </li>
            </ul>
          </Section>

          <Divider />

          {/* 7. Data Retention */}
          <Section number="7" title="Data Retention">
            <p>
              We retain your personal information for as long as necessary to fulfill the purposes
              outlined in this policy, complete your bookings, and comply with our legal obligations.
              When your data is no longer needed, we securely delete or anonymize it.
            </p>
          </Section>

          <Divider />

          {/* 8. Data Security */}
          <Section number="8" title="Data Security">
            <p>
              We implement reasonable technical and organizational security measures to protect your
              personal information from unauthorized access, disclosure, alteration, or destruction.
              However, no method of transmission over the internet is 100% secure, and we cannot
              guarantee absolute security.
            </p>
          </Section>

          <Divider />

          {/* 9. Your Rights */}
          <Section number="9" title="Your Rights">
            <p>
              Depending on your location, you may have the following rights regarding your personal
              data:
            </p>
            <ul className="list-disc list-outside ml-[20px] flex flex-col gap-[6px]">
              <li>
                <strong className="text-[var(--color-cream)]">Access</strong> – Request a copy of
                the personal data we hold about you
              </li>
              <li>
                <strong className="text-[var(--color-cream)]">Correction</strong> – Request that we
                correct inaccurate or incomplete data
              </li>
              <li>
                <strong className="text-[var(--color-cream)]">Deletion</strong> – Request that we
                delete your personal data
              </li>
              <li>
                <strong className="text-[var(--color-cream)]">Opt-out</strong> – Unsubscribe from
                marketing communications at any time
              </li>
              <li>
                <strong className="text-[var(--color-cream)]">Portability</strong> – Request your
                data in a portable format
              </li>
            </ul>
            <p>
              To exercise any of these rights, please contact us using the details in Section 12.
            </p>
          </Section>

          <Divider />

          {/* 10. Children's Privacy */}
          <Section number="10" title="Children's Privacy">
            <p>
              Our website is not directed to children under the age of 13. We do not knowingly
              collect personal information from children. If you believe a child has provided us
              with their information, please contact us and we will promptly delete it.
            </p>
          </Section>

          <Divider />

          {/* 11. Third-Party Links */}
          <Section number="11" title="Third-Party Links">
            <p>
              Our website may contain links to third-party websites. We are not responsible for the
              privacy practices of those sites and encourage you to review their privacy policies
              independently.
            </p>
          </Section>

          <Divider />

          {/* 12. Contact Us */}
          <Section number="12" title="Contact Us">
            <p>
              If you have any questions or concerns about this Privacy Policy or how we handle your
              data, please contact us at:
            </p>
            <div className="rounded-[10px] border border-[rgba(245,237,214,0.1)] bg-[var(--color-dark-surface)] px-[20px] py-[16px] flex flex-col gap-[6px]">
              <p>
                <span className="text-[rgba(245,237,214,0.5)] text-[14px] uppercase tracking-wider mr-[8px]">Email</span>
                <a
                  href="mailto:info@goldenagelearning.com"
                  className="text-[var(--color-gold)] hover:underline"
                >
                  info@goldenagelearning.com
                </a>
              </p>
            </div>
          </Section>

          <Divider />

          {/* 13. Changes to This Policy */}
          <Section number="13" title="Changes to This Policy">
            <p>
              We may update this Privacy Policy from time to time. When we do, we will revise the
              Effective Date at the top of this page. We encourage you to review this policy
              periodically to stay informed about how we protect your information.
            </p>
          </Section>

        </div>
      </div>
    </main>
  );
}

// ─── Local sub-components ─────────────────────────────────────────────────────

function Section({
  number,
  title,
  children,
}: {
  number: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-[16px]">
      <h2 className="font-sans text-[22px] font-semibold text-[var(--color-cream)]">
        <span className="text-[var(--color-gold)] mr-[8px]">{number}.</span>
        {title}
      </h2>
      <div className="flex flex-col gap-[12px] font-sans text-[16px] leading-[1.75] text-[rgba(245,237,214,0.7)]">
        {children}
      </div>
    </section>
  );
}

function SubHeading({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-semibold text-[var(--color-cream)] mt-[4px]">{children}</p>
  );
}

function Divider() {
  return <hr className="border-none border-t border-[rgba(245,237,214,0.08)] h-[1px] bg-[rgba(245,237,214,0.08)]" />;
}

function InfoRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-[2px]">
      <span className="font-semibold text-[14px] uppercase tracking-wider text-[var(--color-gold)]">
        {label}
      </span>
      <p className="font-sans text-[15px] leading-[1.65] text-[rgba(245,237,214,0.65)]">
        {children}
      </p>
    </div>
  );
}

function Keyword({ children }: { children: React.ReactNode }) {
  return (
    <strong className="font-semibold text-[var(--color-cream)] tracking-wide">{children}</strong>
  );
}
