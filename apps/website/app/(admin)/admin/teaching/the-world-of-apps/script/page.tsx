import { ScriptSlideTitle } from "../../../../../../components/teaching/ScriptSlideTitle";

const CLASS_SLUG = "the-world-of-apps";

export default function TheWorldOfAppsScript() {
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
          The World of Apps
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

        {/* Class Goals */}
        <p style={{ fontSize: "17px", fontWeight: "bold", color: "#000000", margin: "0 0 8px 0" }}>
          Class Goals:
        </p>
        <ul
          style={{
            fontSize: "17px",
            lineHeight: "1.7",
            color: "#000000",
            margin: "0 0 16px 0",
            paddingLeft: "24px",
          }}
        >
          <li>To demystify the concept of &ldquo;apps.&rdquo;</li>
          <li>To empower students to find, install, and manage the apps they need.</li>
          <li>To build confidence in navigating the App Store and their device&rsquo;s home screen.</li>
        </ul>

        {/* Teacher's Note */}
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
          The App Store can be an overwhelming place. The goal today is not to have students install a dozen apps. The goal is to give them the <em>skill</em> and <em>confidence</em> to do it on their own later. Your role is to be their calm, confident guide. Be prepared to explain the difference between the Apple App Store and Google Play Store if it comes up.
        </div>

        {/* ── Slide 1 ── */}
        <div style={{ marginTop: "32px" }}>
          <p style={{ fontSize: "13px", color: "#888888", margin: "0 0 4px 0" }}>Approx. 0–3 minutes</p>
          <ScriptSlideTitle classSlug={CLASS_SLUG} slideNumber={1}>
            [SLIDE 1: TITLE SLIDE]
          </ScriptSlideTitle>
          <hr style={{ border: "none", borderTop: "1px solid #EEEEEE", margin: "0 0 14px 0" }} />
          <p style={{ fontSize: "17px", lineHeight: "1.7", color: "#000000", margin: "0 0 12px 0" }}>
            &ldquo;Welcome back, everyone! Today, we&rsquo;re diving into one of the most exciting topics: the World of Apps. You&rsquo;ve probably heard that word, &lsquo;app,&rsquo; a million times. It might sound technical, but I promise you, it&rsquo;s a very simple idea. Today, we&rsquo;re going to turn your phone from just a device that makes calls into a powerful toolkit that is customized just for you.&rdquo;
          </p>
        </div>

        {/* ── Slide 2 ── */}
        <div style={{ marginTop: "32px" }}>
          <p style={{ fontSize: "13px", color: "#888888", margin: "0 0 4px 0" }}>Approx. 3–5 minutes</p>
          <ScriptSlideTitle classSlug={CLASS_SLUG} slideNumber={2}>
            [SLIDE 2: TODAY&rsquo;S GOALS]
          </ScriptSlideTitle>
          <hr style={{ border: "none", borderTop: "1px solid #EEEEEE", margin: "0 0 14px 0" }} />
          <p style={{ fontSize: "17px", lineHeight: "1.7", color: "#000000", margin: "0 0 12px 0" }}>
            &ldquo;Here&rsquo;s our roadmap for today&rsquo;s adventure. First, we&rsquo;re going to answer the big question: What exactly <em>is</em> an app? Then, we&rsquo;ll learn where these apps live and how to get them&mdash;it&rsquo;s a place called the App Store.
          </p>
          <p style={{ fontSize: "17px", lineHeight: "1.7", color: "#000000", margin: "0" }}>
            We&rsquo;ll walk through the steps of &lsquo;installing&rsquo; a new app, which is just a fancy word for adding a new tool to your phone. And once we have our apps, we need to know how to open them, how to arrange them just the way we like, and finally, how to tidy up and delete the ones we don&rsquo;t need anymore. It&rsquo;s going to be a fun and very productive day!&rdquo;
          </p>
        </div>

        {/* ── Slide 3 ── */}
        <div style={{ marginTop: "32px" }}>
          <p style={{ fontSize: "13px", color: "#888888", margin: "0 0 4px 0" }}>Approx. 5–8 minutes</p>
          <ScriptSlideTitle classSlug={CLASS_SLUG} slideNumber={3}>
            [SLIDE 3: WHAT IS AN APP?]
          </ScriptSlideTitle>
          <hr style={{ border: "none", borderTop: "1px solid #EEEEEE", margin: "0 0 14px 0" }} />
          <p style={{ fontSize: "17px", lineHeight: "1.7", color: "#000000", margin: "0 0 12px 0" }}>
            &ldquo;Let&rsquo;s start with the most important question. The word &lsquo;app&rsquo; is just short for &lsquo;application,&rsquo; but that doesn&rsquo;t really help, does it?
          </p>
          <p style={{ fontSize: "17px", lineHeight: "1.7", color: "#000000", margin: "0 0 12px 0" }}>
            So let&rsquo;s think of it this way: <strong>an app is a tool.</strong> That&rsquo;s it. A simple tool that does one specific job. For example, you have a &lsquo;Camera&rsquo; app, and its only job is to take pictures. You have a &lsquo;Weather&rsquo; app, and its only job is to tell you the forecast.
          </p>
          <p style={{ fontSize: "17px", lineHeight: "1.7", color: "#000000", margin: "0" }}>
            As you see on the slide, your phone is the toolbox. And inside that toolbox, you have all your digital tools: a hammer, a screwdriver, a flashlight... each one is an app. The more useful tools, or apps, you collect, the more powerful your phone becomes for you!&rdquo;
          </p>
        </div>

        {/* ── Slide 4 ── */}
        <div style={{ marginTop: "32px" }}>
          <p style={{ fontSize: "13px", color: "#888888", margin: "0 0 4px 0" }}>Approx. 8–12 minutes</p>
          <ScriptSlideTitle classSlug={CLASS_SLUG} slideNumber={4}>
            [SLIDE 4: THE DIGITAL APP STORE]
          </ScriptSlideTitle>
          <hr style={{ border: "none", borderTop: "1px solid #EEEEEE", margin: "0 0 14px 0" }} />
          <p style={{ fontSize: "17px", lineHeight: "1.7", color: "#000000", margin: "0 0 12px 0" }}>
            &ldquo;So, if our phone is the toolbox, where do we get new tools? We get them from a very special place that&rsquo;s already built into your phone. We call it the <strong>App Store</strong>.
          </p>
          <p style={{ fontSize: "17px", lineHeight: "1.7", color: "#000000", margin: "0 0 12px 0" }}>
            Now, depending on your device, it will look a little different. If you have an iPhone or an iPad, you have the <strong>App Store</strong>, which has that blue icon with the &lsquo;A&rsquo;. If you have an Android phone, like a Samsung, you have the <strong>Google Play Store</strong>, with that colorful triangle icon.
          </p>
          <p style={{ fontSize: "17px", lineHeight: "1.7", color: "#000000", margin: "0" }}>
            They look different, but they do the exact same job: they are like a giant, digital shopping center, but for apps. And the best part? The vast majority of the most useful apps are completely free!&rdquo;
          </p>
        </div>

        {/* ── Slides 5 & 6 ── */}
        <div style={{ marginTop: "32px" }}>
          <p style={{ fontSize: "13px", color: "#888888", margin: "0 0 4px 0" }}>Approx. 12–17 minutes</p>
          <ScriptSlideTitle classSlug={CLASS_SLUG} slideNumber={5}>
            [SLIDES 5 &amp; 6: FINDING AND SEARCHING]
          </ScriptSlideTitle>
          <hr style={{ border: "none", borderTop: "1px solid #EEEEEE", margin: "0 0 14px 0" }} />
          <p style={{ fontSize: "17px", lineHeight: "1.7", color: "#000000", margin: "0 0 12px 0" }}>
            &ldquo;Okay, let&rsquo;s all go to the store together. Everyone please look at your phone&rsquo;s home screen and try to find the icon for your App Store. It will be one of the two you see on the slide.
          </p>
          <p style={{ fontSize: "17px", lineHeight: "1.7", color: "#888888", fontStyle: "italic", margin: "0 0 12px 0" }}>
            (Pause and walk around, helping every single student find and open their app store. This is a critical step.)
          </p>
          <p style={{ fontSize: "17px", lineHeight: "1.7", color: "#000000", margin: "0 0 12px 0" }}>
            Great! Now that we&rsquo;re inside, it can look a little busy, can&rsquo;t it? Don&rsquo;t worry. We&rsquo;re going to ignore all the advertisements and pictures and go straight to what we want. Every app store has a <strong>Search</strong> button. Look at the very bottom of your screen. You should see a little icon of a magnifying glass. Please tap on &lsquo;Search.&rsquo;
          </p>
          <p style={{ fontSize: "17px", lineHeight: "1.7", color: "#888888", fontStyle: "italic", margin: "0 0 12px 0" }}>
            (Wait for everyone to tap Search.)
          </p>
          <p style={{ fontSize: "17px", lineHeight: "1.7", color: "#000000", margin: "0" }}>
            Perfect. You should now see a typing bar appear. This is where you can tell the store what you&rsquo;re looking for.&rdquo;
          </p>
        </div>

        {/* ── Slides 7 & 8 ── */}
        <div style={{ marginTop: "32px" }}>
          <p style={{ fontSize: "13px", color: "#888888", margin: "0 0 4px 0" }}>Approx. 17–25 minutes</p>
          <ScriptSlideTitle classSlug={CLASS_SLUG} slideNumber={7}>
            [SLIDES 7 &amp; 8: GETTING AND FINDING AN APP]
          </ScriptSlideTitle>
          <hr style={{ border: "none", borderTop: "1px solid #EEEEEE", margin: "0 0 14px 0" }} />
          <p style={{ fontSize: "17px", lineHeight: "1.7", color: "#000000", margin: "0 0 12px 0" }}>
            &ldquo;For practice today, we&rsquo;re all going to install the same app. It&rsquo;s a very useful one called &lsquo;The Weather Channel.&rsquo; Please type &lsquo;weather&rsquo; into the search bar.
          </p>
          <p style={{ fontSize: "17px", lineHeight: "1.7", color: "#000000", margin: "0 0 12px 0" }}>
            You will see a list of results. Look for the one called &lsquo;The Weather Channel.&rsquo; Once you find it, you should see a button next to it that says <strong>&lsquo;GET&rsquo;</strong> or <strong>&lsquo;Install&rsquo;</strong>. Some of you might see a little cloud icon with an arrow, which just means you&rsquo;ve had this app before. Go ahead and tap that button.
          </p>
          <p style={{ fontSize: "17px", lineHeight: "1.7", color: "#000000", margin: "0 0 12px 0" }}>
            Now, this is an important moment. Your phone might ask you for your password, or to use your fingerprint. This is a security feature to make sure it&rsquo;s really you. It&rsquo;s like having a PIN at the bank. Go ahead and approve the installation.
          </p>
          <p style={{ fontSize: "17px", lineHeight: "1.7", color: "#000000", margin: "0" }}>
            You&rsquo;ll see a little circle spinning. That means it&rsquo;s downloading. It might take a minute. Once it&rsquo;s done, I want you to go back to your home screen. And somewhere on your screen, you should see the brand new icon for The Weather Channel! It has found its home in your toolbox.
          </p>
          <p style={{ fontSize: "17px", lineHeight: "1.7", color: "#888888", fontStyle: "italic", margin: "12px 0 0 0" }}>
            (Spend time walking around and helping everyone through this process.)
          </p>
        </div>

        {/* ── Slides 9 & 10 ── */}
        <div style={{ marginTop: "32px" }}>
          <p style={{ fontSize: "13px", color: "#888888", margin: "0 0 4px 0" }}>Approx. 25–30 minutes</p>
          <ScriptSlideTitle classSlug={CLASS_SLUG} slideNumber={9}>
            [SLIDES 9 &amp; 10: ORGANIZING AND DELETING]
          </ScriptSlideTitle>
          <hr style={{ border: "none", borderTop: "1px solid #EEEEEE", margin: "0 0 14px 0" }} />
          <p style={{ fontSize: "17px", lineHeight: "1.7", color: "#000000", margin: "0 0 12px 0" }}>
            &ldquo;Fantastic! You&rsquo;ve installed a new app! Opening it is easy&mdash;you just tap the icon. But what if you want to move it? Maybe you want all your favorite apps on the first page.
          </p>
          <p style={{ fontSize: "17px", lineHeight: "1.7", color: "#000000", margin: "0 0 12px 0" }}>
            Let&rsquo;s learn how to organize our screen. I want everyone to find an app&mdash;any app&mdash;and gently <strong>press and hold your finger down on it.</strong> Don&rsquo;t just tap it, leave your finger on it for a couple of seconds.
          </p>
          <p style={{ fontSize: "17px", lineHeight: "1.7", color: "#888888", fontStyle: "italic", margin: "0 0 12px 0" }}>
            (Pause)
          </p>
          <p style={{ fontSize: "17px", lineHeight: "1.7", color: "#000000", margin: "0 0 12px 0" }}>
            What happens? They all start to jiggle or wiggle, right? And you might see little &lsquo;X&rsquo; or minus signs appear. This &lsquo;wiggle mode&rsquo; is &lsquo;organize mode.&rsquo; While the apps are wiggling, you can drag them to a new spot on your screen, or even drag them to the edge of the screen to move them to a different page.
          </p>
          <p style={{ fontSize: "17px", lineHeight: "1.7", color: "#000000", margin: "0" }}>
            Now, what if you want to tidy up? While they are wiggling, if you tap that little &lsquo;X&rsquo; or minus sign, your phone will ask if you want to delete the app. If you say yes, the tool is removed from your toolbox. It&rsquo;s that simple! Don&rsquo;t worry, we won&rsquo;t delete anything right now. When you&rsquo;re done organizing, just tap on a blank part of the screen to make them stop wiggling.&rdquo;
          </p>
        </div>

        {/* ── Slide 11 ── */}
        <div style={{ marginTop: "32px" }}>
          <p style={{ fontSize: "13px", color: "#888888", margin: "0 0 4px 0" }}>Approx. 30–35 minutes</p>
          <ScriptSlideTitle classSlug={CLASS_SLUG} slideNumber={11}>
            [SLIDE 11: YOU DID IT!]
          </ScriptSlideTitle>
          <hr style={{ border: "none", borderTop: "1px solid #EEEEEE", margin: "0 0 14px 0" }} />
          <p style={{ fontSize: "17px", lineHeight: "1.7", color: "#000000", margin: "0" }}>
            &ldquo;And that is it! Let&rsquo;s review what we&rsquo;ve accomplished. You now know what an app is&mdash;it&rsquo;s a tool! You know how to go to the App Store, search for a tool you need, and install it on your phone. You also know how to arrange your tools just the way you like and how to remove them if you don&rsquo;t need them anymore. You are officially an App Manager! This is a huge step, and you all did wonderfully.&rdquo;
          </p>
        </div>

        {/* ── Slide 12 ── */}
        <div style={{ marginTop: "32px" }}>
          <p style={{ fontSize: "13px", color: "#888888", margin: "0 0 4px 0" }}>Approx. 35–60 minutes</p>
          <ScriptSlideTitle classSlug={CLASS_SLUG} slideNumber={12}>
            [SLIDE 12: GAME TIME!]
          </ScriptSlideTitle>
          <hr style={{ border: "none", borderTop: "1px solid #EEEEEE", margin: "0 0 14px 0" }} />
          <p style={{ fontSize: "17px", lineHeight: "1.7", color: "#000000", margin: "0 0 12px 0" }}>
            &ldquo;Alright, you&rsquo;ve done the hard work, now it&rsquo;s time to have some fun and review what we&rsquo;ve learned. It&rsquo;s time for our game! Let&rsquo;s get ready to play.&rdquo;
          </p>
          <p style={{ fontSize: "17px", lineHeight: "1.7", color: "#888888", fontStyle: "italic", margin: "0" }}>
            (Lead the students in the 25-minute review game.)
          </p>
        </div>

      </div>
    </div>
  );
}
