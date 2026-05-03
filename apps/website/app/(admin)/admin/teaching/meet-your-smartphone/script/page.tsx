import { ScriptSlideTitle } from "../../../../../../components/teaching/ScriptSlideTitle";

const CLASS_SLUG = "meet-your-smartphone";

const bodyText = {
  fontSize: "17px",
  lineHeight: "1.7",
  color: "#000000",
  margin: "0 0 12px 0",
} as const;

const stageDir = {
  fontSize: "17px",
  lineHeight: "1.7",
  color: "#888888",
  fontStyle: "italic",
  margin: "0 0 12px 0",
} as const;

const lastBodyText = {
  ...bodyText,
  margin: "0",
} as const;

export default function MeetYourSmartphoneScript() {
  return (
    <div
      style={{
        backgroundColor: "#FFFFFF",
        minHeight: "100vh",
        padding: "20px",
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      <div style={{ maxWidth: "680px", margin: "0 auto" }}>

        {/* Page title */}
        <h1
          style={{
            fontSize: "24px",
            fontWeight: "bold",
            color: "#000000",
            margin: "0 0 4px 0",
          }}
        >
          Meet Your Smartphone/Tablet!
        </h1>
        <p
          style={{
            fontSize: "16px",
            fontWeight: "normal",
            color: "#666666",
            margin: "0 0 12px 0",
          }}
        >
          Teacher&rsquo;s Script
        </p>
        <hr style={{ border: "none", borderTop: "1px solid #DDDDDD", margin: "0 0 24px 0" }} />

        {/* Teacher's Note — pre-slide icebreaker */}
        <div
          style={{
            backgroundColor: "#F5F5F5",
            borderLeft: "3px solid #CCCCCC",
            padding: "12px",
            marginBottom: "32px",
            fontSize: "17px",
            lineHeight: "1.7",
            color: "#000000",
            fontStyle: "italic",
          }}
        >
          <strong style={{ fontStyle: "normal" }}>Teacher&rsquo;s Note (Pre-Slide Icebreaker):</strong> Begin
          the class before starting the slides. Your goal is to create a relaxed, welcoming
          atmosphere. Say: &ldquo;Hello everyone, and a very warm welcome! I am so glad you are here
          with us today at Golden Age Learning. Before we dive into our presentation, let&rsquo;s get
          to know each other just a little bit. Let&rsquo;s go around the room, and if you&rsquo;re
          comfortable, please share your name and one thing you hope to do with your new device. It
          can be anything at all&mdash;from video calling with grandkids to looking up a new recipe.
          There are absolutely no wrong answers!&rdquo; Give students time to share, and actively
          listen and validate their goals, e.g., &ldquo;That&rsquo;s a wonderful goal! We&rsquo;ll
          definitely be covering things that will help you do that.&rdquo;
        </div>

        {/* ── Slide 1 ── */}
        <div style={{ marginTop: "32px" }}>
          <p style={{ fontSize: "13px", color: "#888888", margin: "0 0 4px 0" }}>Approx. 2–3 minutes</p>
          <ScriptSlideTitle classSlug={CLASS_SLUG} slideNumber={1}>
            [SLIDE 1: TITLE SLIDE]
          </ScriptSlideTitle>
          <hr style={{ border: "none", borderTop: "1px solid #EEEEEE", margin: "0 0 14px 0" }} />
          <p style={lastBodyText}>
            &ldquo;Alright, thank you all for sharing! It&rsquo;s wonderful to hear all the exciting
            things you want to do. Let&rsquo;s begin. Today is all about that very first step:
            meeting your new device. It might look complicated, but I promise it&rsquo;s more
            friendly than it seems, and we&rsquo;re going to explore it together.&rdquo;
          </p>
        </div>

        {/* ── Slide 2 ── */}
        <div style={{ marginTop: "32px" }}>
          <p style={{ fontSize: "13px", color: "#888888", margin: "0 0 4px 0" }}>Approx. 3–5 minutes</p>
          <ScriptSlideTitle classSlug={CLASS_SLUG} slideNumber={2}>
            [SLIDE 2: TODAY&rsquo;S GOALS]
          </ScriptSlideTitle>
          <hr style={{ border: "none", borderTop: "1px solid #EEEEEE", margin: "0 0 14px 0" }} />
          <p style={bodyText}>
            &ldquo;So, what is our mission for today? We have three simple goals.
          </p>
          <p style={bodyText}>
            First, we&rsquo;re going to identify the key physical parts of your device&mdash;the
            main buttons and where to plug it in.
          </p>
          <p style={bodyText}>
            Second, we&rsquo;ll learn how to properly turn your device on and off, and just as
            importantly, how to wake it from sleep.
          </p>
          <p style={lastBodyText}>
            And third, we will learn the three magical moves that are the secret to everything on a
            touchscreen: the <strong>tap</strong>, the <strong>swipe</strong>, and the{" "}
            <strong>pinch-to-zoom</strong>. By the end of our class, you will have done all three!&rdquo;
          </p>
        </div>

        {/* ── Slide 3 ── */}
        <div style={{ marginTop: "32px" }}>
          <p style={{ fontSize: "13px", color: "#888888", margin: "0 0 4px 0" }}>Approx. 5–10 minutes</p>
          <ScriptSlideTitle classSlug={CLASS_SLUG} slideNumber={3}>
            [SLIDE 3: THE PHYSICAL DEVICE]
          </ScriptSlideTitle>
          <hr style={{ border: "none", borderTop: "1px solid #EEEEEE", margin: "0 0 14px 0" }} />
          <p style={bodyText}>
            &ldquo;Okay, let&rsquo;s get physical! Everyone, please pick up your device. Let&rsquo;s
            take a tour.
          </p>
          <p style={bodyText}>
            First, find the <strong>Power Button</strong>. It&rsquo;s the on/off and &lsquo;wake
            up&rsquo; switch. It&rsquo;s usually on the side.
          </p>
          <p style={stageDir}>(Pause and walk around to help students locate it.)</p>
          <p style={bodyText}>
            Next, find the <strong>Volume Buttons</strong>. These make sounds louder or quieter. You
            might have one long button that rocks up and down, or two separate ones.
          </p>
          <p style={lastBodyText}>
            Finally, at the bottom, you&rsquo;ll find the <strong>Charging Port</strong>. This is
            where you plug in the cable to give it power. Notice its shape&mdash;the cable can only
            go in one way, so you never have to force it. These are the three main physical parts
            we&rsquo;ll need to know.&rdquo;
          </p>
        </div>

        {/* ── Slide 4 ── */}
        <div style={{ marginTop: "32px" }}>
          <p style={{ fontSize: "13px", color: "#888888", margin: "0 0 4px 0" }}>Approx. 10–12 minutes</p>
          <ScriptSlideTitle classSlug={CLASS_SLUG} slideNumber={4}>
            [SLIDE 4: WAKING UP YOUR DEVICE]
          </ScriptSlideTitle>
          <hr style={{ border: "none", borderTop: "1px solid #EEEEEE", margin: "0 0 14px 0" }} />
          <p style={bodyText}>
            &ldquo;So, what does that Power Button do? If your device is completely off, you would
            press and hold this button for a few seconds to start it up.
          </p>
          <p style={bodyText}>
            But most of the time, your device will just be &lsquo;sleeping.&rsquo; To wake it up,
            you just give the power button one quick, firm press. Let&rsquo;s all try that now.
            Press the power button once. The screen lights up, right? Perfect! Now, press it once
            more. The screen goes dark. You&rsquo;ve just put it back to sleep. Simple as that!
            Wake it up one more time for our next step.&rdquo;
          </p>
        </div>

        {/* ── Slide 5 ── */}
        <div style={{ marginTop: "32px" }}>
          <p style={{ fontSize: "13px", color: "#888888", margin: "0 0 4px 0" }}>Approx. 12–17 minutes</p>
          <ScriptSlideTitle classSlug={CLASS_SLUG} slideNumber={5}>
            [SLIDE 5: THE FIRST &ldquo;MOVE&rdquo;: THE TAP]
          </ScriptSlideTitle>
          <hr style={{ border: "none", borderTop: "1px solid #EEEEEE", margin: "0 0 14px 0" }} />
          <p style={lastBodyText}>
            &ldquo;Now for the magic! The first and most common move is the <strong>Tap</strong>. A
            tap is a single, light touch with your fingertip. You don&rsquo;t need to press hard at
            all. Think of it as quickly poking the screen. This is how you open your apps or select
            an option. It&rsquo;s just like clicking a mouse, but your finger is the mouse!
            Let&rsquo;s all find one of those little pictures on our screen and give it a gentle
            tap.&rdquo;
          </p>
        </div>

        {/* ── Slide 6 ── */}
        <div style={{ marginTop: "32px" }}>
          <p style={{ fontSize: "13px", color: "#888888", margin: "0 0 4px 0" }}>Approx. 17–22 minutes</p>
          <ScriptSlideTitle classSlug={CLASS_SLUG} slideNumber={6}>
            [SLIDE 6: THE SECOND &ldquo;MOVE&rdquo;: THE SWIPE]
          </ScriptSlideTitle>
          <hr style={{ border: "none", borderTop: "1px solid #EEEEEE", margin: "0 0 14px 0" }} />
          <p style={lastBodyText}>
            &ldquo;Excellent! Our next move is the <strong>Swipe</strong>. Swiping is how you turn
            the page in the digital world. You simply place your finger on the screen and slide it
            across without lifting it. This is how you&rsquo;ll look through photos or move between
            your different pages of apps. Let&rsquo;s try it. Place your finger on the right edge of
            the screen and gently drag it to the left.&rdquo;
          </p>
        </div>

        {/* ── Slide 7 ── */}
        <div style={{ marginTop: "32px" }}>
          <p style={{ fontSize: "13px", color: "#888888", margin: "0 0 4px 0" }}>Approx. 22–27 minutes</p>
          <ScriptSlideTitle classSlug={CLASS_SLUG} slideNumber={7}>
            [SLIDE 7: THE THIRD &ldquo;MOVE&rdquo;: PINCH-TO-ZOOM]
          </ScriptSlideTitle>
          <hr style={{ border: "none", borderTop: "1px solid #EEEEEE", margin: "0 0 14px 0" }} />
          <p style={bodyText}>
            &ldquo;And for our final move, the <strong>Pinch-to-Zoom</strong>. This is perfect for
            getting a closer look. You&rsquo;ll use two fingers for this&mdash;usually your thumb
            and index finger.
          </p>
          <p style={lastBodyText}>
            Place them together on a photo or a map on your screen. Now, spread your fingers apart
            while keeping them on the screen. See how the image gets bigger? You&rsquo;re zooming
            in! To zoom back out, just do the opposite: start with your fingers apart on the image
            and &lsquo;pinch&rsquo; them together. It&rsquo;s incredibly useful for reading small
            text!&rdquo;
          </p>
        </div>

        {/* ── Slide 8 ── */}
        <div style={{ marginTop: "32px" }}>
          <p style={{ fontSize: "13px", color: "#888888", margin: "0 0 4px 0" }}>Approx. 27–35 minutes</p>
          <ScriptSlideTitle classSlug={CLASS_SLUG} slideNumber={8}>
            [SLIDE 8: LET&rsquo;S PRACTICE!]
          </ScriptSlideTitle>
          <hr style={{ border: "none", borderTop: "1px solid #EEEEEE", margin: "0 0 14px 0" }} />
          <p style={bodyText}>
            &ldquo;Okay, you&rsquo;ve heard the theory, now it&rsquo;s time to practice! I&rsquo;m
            going to walk around the room, and we are all going to try our three new moves together.
          </p>
          <p style={bodyText}>
            1.&nbsp; First, let&rsquo;s all <strong>tap</strong> to open an application. Any one will do!
          </p>
          <p style={bodyText}>
            2.&nbsp; Next, let&rsquo;s <strong>swipe</strong> to see if you have another page of apps.
          </p>
          <p style={bodyText}>
            3.&nbsp; Finally, let&rsquo;s find a photo and practice <strong>zooming</strong> in and out.
          </p>
          <p style={bodyText}>
            Don&rsquo;t worry if it feels clumsy at first. We&rsquo;ll go slow, and I&rsquo;m here
            to help everyone.&rdquo;
          </p>
          <p style={{ ...stageDir, margin: "0" }}>
            (Spend 5&ndash;8 minutes providing one-on-one guidance and encouragement.)
          </p>
        </div>

        {/* ── Slide 9 ── */}
        <div style={{ marginTop: "32px" }}>
          <p style={{ fontSize: "13px", color: "#888888", margin: "0 0 4px 0" }}>Approx. 35–40 minutes</p>
          <ScriptSlideTitle classSlug={CLASS_SLUG} slideNumber={9}>
            [SLIDE 9: YOU DID IT!]
          </ScriptSlideTitle>
          <hr style={{ border: "none", borderTop: "1px solid #EEEEEE", margin: "0 0 14px 0" }} />
          <p style={lastBodyText}>
            &ldquo;And just like that, you did it! You have officially mastered the absolute basics
            of your new device. You can identify its key parts, you can wake it up, and you know how
            to <strong>Tap, Swipe, and Zoom!</strong> With these skills, you can already start doing
            amazing things, like swiping through photos of your grandkids or zooming in on a map to
            find a new restaurant. You should all be very proud of yourselves. This is the
            foundation for everything that comes next!&rdquo;
          </p>
        </div>

        {/* ── Slide 10 ── */}
        <div style={{ marginTop: "32px" }}>
          <p style={{ fontSize: "13px", color: "#888888", margin: "0 0 4px 0" }}>Approx. 40–55 minutes</p>
          <ScriptSlideTitle classSlug={CLASS_SLUG} slideNumber={10}>
            [SLIDE 10: GAME TIME!]
          </ScriptSlideTitle>
          <hr style={{ border: "none", borderTop: "1px solid #EEEEEE", margin: "0 0 14px 0" }} />
          <p style={bodyText}>
            &ldquo;And now, to celebrate our new skills, it is time for a game! We&rsquo;ll have a
            little fun and review what we&rsquo;ve learned today. It&rsquo;s all for laughs, so
            let&rsquo;s get ready to play!&rdquo;
          </p>
          <p style={{ ...stageDir, margin: "0" }}>
            (Lead the students in the 15-minute review game.)
          </p>
        </div>

        {/* ── Slide 11 ── */}
        <div style={{ marginTop: "32px" }}>
          <p style={{ fontSize: "13px", color: "#888888", margin: "0 0 4px 0" }}>Approx. 55–60 minutes</p>
          <ScriptSlideTitle classSlug={CLASS_SLUG} slideNumber={11}>
            [SLIDE 11: THANK YOU &amp; NEXT CLASS]
          </ScriptSlideTitle>
          <hr style={{ border: "none", borderTop: "1px solid #EEEEEE", margin: "0 0 14px 0" }} />
          <p style={lastBodyText}>
            &ldquo;That brings us to the end of our class. Fantastic work, everyone! Your only
            &lsquo;homework&rsquo; is to play. Practice tapping and swiping a little bit each day.
            The more you do it, the more comfortable you will feel. Thank you so much for your
            wonderful energy today. Next time, we&rsquo;re going to tackle the digital keyboard. I
            look forward to seeing you all again then!&rdquo;
          </p>
        </div>

      </div>
    </div>
  );
}
