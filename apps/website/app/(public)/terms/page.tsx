export const metadata = {
  title: "Terms and Conditions — Golden Age Learning",
};

export default function TermsPage() {
  return (
    <main className="w-full min-h-screen bg-[var(--color-dark-bg)]">
      <div className="max-w-3xl mx-auto px-[24px] pt-[120px] pb-[80px] md:pt-[140px]">

        {/* Page title */}
        <h1 className="font-sans text-[36px] md:text-[42px] font-bold text-[var(--color-cream)] leading-tight mb-[8px]">
          Terms and Conditions
        </h1>
        <p className="font-sans text-[15px] text-[rgba(245,237,214,0.45)] mb-[56px]">
          Effective Date: April 13, 2026
        </p>

        <div className="flex flex-col gap-[48px]">

          {/* 1. Acceptance of Terms */}
          <Section number="1" title="Acceptance of Terms">
            <p>
              By registering an account, making a booking, or attending any class or lecture through
              goldenagelearning.com, you agree to be bound by these Terms and Conditions. If you do
              not agree, please do not use our services.
            </p>
            <p>
              Golden Age Learning's services are intended for adults aged 55 and older. By using
              this site, you confirm that you meet this age requirement.
            </p>
          </Section>

          <Divider />

          {/* 2. Bookings and Registration */}
          <Section number="2" title="Bookings and Registration">
            <ul className="list-disc list-outside ml-[20px] flex flex-col gap-[6px]">
              <li>All class bookings must be made through goldenagelearning.com.</li>
              <li>
                You must create an account and provide accurate, up-to-date information to complete
                a booking.
              </li>
              <li>
                A booking is not confirmed until you receive a written confirmation via email or SMS.
              </li>
              <li>
                Golden Age Learning reserves the right to cancel or reschedule a class at any time.
                In the event a class is cancelled, you will be notified promptly and offered a
                credit or alternative booking.
              </li>
              <li>
                Class availability is not guaranteed and is offered on a first-come, first-served
                basis.
              </li>
            </ul>
          </Section>

          <Divider />

          {/* 3. Payments */}
          <Section number="3" title="Payments">
            <ul className="list-disc list-outside ml-[20px] flex flex-col gap-[6px]">
              <li>All class fees must be paid in full at the time of booking.</li>
              <li>
                Golden Age Learning accepts payment through the methods listed on our website at
                checkout.
              </li>
              <li>
                All prices are listed in U.S. dollars and are subject to change without notice.
                Price changes will not affect bookings that have already been confirmed.
              </li>
              <li>
                You are responsible for any applicable taxes or fees associated with your purchase.
              </li>
            </ul>
          </Section>

          <Divider />

          {/* 4. Cancellation and Refund Policy */}
          <Section number="4" title="Cancellation and Refund Policy">
            <div className="rounded-[10px] border border-[rgba(201,168,76,0.25)] bg-[rgba(201,168,76,0.07)] px-[20px] py-[16px]">
              <p className="font-semibold text-[var(--color-cream)] text-[16px]">
                All sales are final. Golden Age Learning does not offer refunds under any
                circumstances.
              </p>
            </div>
            <ul className="list-disc list-outside ml-[20px] flex flex-col gap-[6px]">
              <li>
                If you are unable to attend a class you have booked and paid for, you will forfeit
                the class fee.
              </li>
              <li>
                If you wish to transfer your booking to a different available class, please contact
                us as early as possible. Transfers are offered at Golden Age Learning's sole
                discretion and are not guaranteed.
              </li>
              <li>
                If Golden Age Learning cancels a class, you will receive a full credit toward a
                future booking.
              </li>
            </ul>
          </Section>

          <Divider />

          {/* 5. SMS Communications */}
          <Section number="5" title="SMS Communications">
            <p>
              By providing your mobile phone number during account registration or booking on
              goldenagelearning.com, you consent to receive SMS (text message) communications from
              Golden Age Learning, including:
            </p>
            <ul className="list-disc list-outside ml-[20px] flex flex-col gap-[6px]">
              <li>
                <strong className="text-[var(--color-cream)]">Booking confirmations</strong> – Sent
                immediately after a successful booking
              </li>
              <li>
                <strong className="text-[var(--color-cream)]">Class reminders</strong> – Sent in
                advance of your scheduled class
              </li>
              <li>
                <strong className="text-[var(--color-cream)]">Account notifications</strong> – Sent
                when your account is created or updated
              </li>
            </ul>

            <div className="flex flex-col gap-[16px] rounded-[10px] border border-[rgba(201,168,76,0.25)] bg-[rgba(201,168,76,0.07)] px-[20px] py-[20px]">
              <InfoRow label="Opt-Out">
                Reply <Keyword>STOP</Keyword> to any message at any time. You will receive one
                final confirmation and no further messages will be sent. To opt back in, reply{" "}
                <Keyword>START</Keyword>.
              </InfoRow>
              <InfoRow label="Message &amp; Data Rates">
                Standard message and data rates may apply depending on your mobile carrier and plan.
              </InfoRow>
              <InfoRow label="Your Phone Number">
                Your phone number will <strong className="text-[var(--color-cream)]">never</strong>{" "}
                be shared with or sold to any third party.
              </InfoRow>
            </div>
          </Section>

          <Divider />

          {/* 6. Attendance and Conduct */}
          <Section number="6" title="Attendance and Conduct">
            <ul className="list-disc list-outside ml-[20px] flex flex-col gap-[6px]">
              <li>
                Classes are held at our physical location. Address details will be included in your
                booking confirmation.
              </li>
              <li>
                Please arrive on time. Late arrivals may not be admitted at the instructor's
                discretion.
              </li>
              <li>
                Students are expected to conduct themselves respectfully toward instructors and
                fellow students.
              </li>
              <li>
                Golden Age Learning reserves the right to remove any student from a class or
                terminate their account for disruptive, disrespectful, or inappropriate behavior
                without a refund.
              </li>
            </ul>
          </Section>

          <Divider />

          {/* 7. Photo and Video Recording */}
          <Section number="7" title="Photo and Video Recording">
            <ul className="list-disc list-outside ml-[20px] flex flex-col gap-[6px]">
              <li>
                Classes may be photographed or recorded by Golden Age Learning staff for internal
                training, quality assurance, or promotional purposes.
              </li>
              <li>
                By attending a class, you consent to being photographed or recorded and to Golden
                Age Learning's use of such images or footage in promotional and marketing materials,
                including on goldenagelearning.com and social media channels.
              </li>
              <li>
                If you do not wish to be photographed or recorded, please notify us in writing
                before your class. We will make reasonable efforts to accommodate your request,
                though this cannot always be guaranteed in a group setting.
              </li>
              <li>
                Students may not photograph, audio-record, or video-record any class without prior
                written permission from Golden Age Learning.
              </li>
            </ul>
          </Section>

          <Divider />

          {/* 8. Limitation of Liability */}
          <Section number="8" title="Limitation of Liability">
            <ul className="list-disc list-outside ml-[20px] flex flex-col gap-[6px]">
              <li>
                Golden Age Learning is not responsible for any personal injury, loss, or damage to
                personal property that occurs at our facility, except where directly caused by our
                own proven negligence.
              </li>
              <li>
                Golden Age Learning is not liable for any indirect, incidental, or consequential
                damages arising from your use of our services or attendance at any class.
              </li>
              <li>
                Golden Age Learning's total liability to you for any claim arising out of or
                relating to these Terms shall not exceed the amount you paid for the specific class
                giving rise to the claim.
              </li>
            </ul>
          </Section>

          <Divider />

          {/* 9. Intellectual Property */}
          <Section number="9" title="Intellectual Property">
            <p>
              All course materials, presentations, handouts, and content provided during Golden Age
              Learning classes are the property of Golden Age Learning. You may not reproduce,
              distribute, or share any class materials without prior written consent from Golden Age
              Learning.
            </p>
          </Section>

          <Divider />

          {/* 10. Changes to These Terms */}
          <Section number="10" title="Changes to These Terms">
            <p>
              Golden Age Learning reserves the right to update these Terms and Conditions at any
              time. The updated version will be posted on goldenagelearning.com with a revised
              Effective Date. Continued use of our services after any changes constitutes your
              acceptance of the new terms.
            </p>
          </Section>

          <Divider />

          {/* 11. Contact Us */}
          <Section number="11" title="Contact Us">
            <p>
              If you have any questions about these Terms and Conditions, please contact Golden Age
              Learning at:
            </p>
            <div className="rounded-[10px] border border-[rgba(245,237,214,0.1)] bg-[var(--color-dark-surface)] px-[20px] py-[16px] flex flex-col gap-[10px]">
              <p>
                <span className="text-[rgba(245,237,214,0.5)] text-[14px] uppercase tracking-wider mr-[8px]">Email</span>
                <a
                  href="mailto:info@goldenagelearning.com"
                  className="text-[var(--color-gold)] hover:underline"
                >
                  info@goldenagelearning.com
                </a>
              </p>
              <p>
                <span className="text-[rgba(245,237,214,0.5)] text-[14px] uppercase tracking-wider mr-[8px]">Phone</span>
                <a
                  href="tel:+19418402375"
                  className="text-[var(--color-gold)] hover:underline"
                >
                  (941) 840-2375
                </a>
              </p>
            </div>
          </Section>

          <Divider />

          {/* 12. Governing Law */}
          <Section number="12" title="Governing Law">
            <p>
              These Terms and Conditions are governed by and construed in accordance with the laws
              of the State of Florida, United States, without regard to its conflict of law
              provisions.
            </p>
          </Section>

          {/* Footer note */}
          <p className="font-sans text-[13px] text-[rgba(245,237,214,0.35)] italic border-t border-[rgba(245,237,214,0.08)] pt-[32px]">
            This document is provided for general informational purposes. You should consult a
            legal professional to ensure these terms meet all applicable laws and regulations in
            your jurisdiction.
          </p>

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
