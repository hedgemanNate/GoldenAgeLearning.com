export default function NewsAndWeatherScript() {
  return (
    <div
      style={{
        backgroundColor: "#FFFFFF",
        minHeight: "100vh",
        padding: "20px",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        fontSize: 17,
        lineHeight: 1.7,
        color: "#000",
      }}
    >
      <div style={{ maxWidth: 680, margin: "0 auto" }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, margin: "0 0 4px 0" }}>
          News &amp; Weather: Staying Informed with Your Device
        </h1>
        <p style={{ fontSize: 16, color: "#666666", margin: "0 0 8px 0" }}>
          Teacher&apos;s Script
        </p>
        <hr style={{ border: "none", borderTop: "1px solid #DDDDDD", margin: "0 0 20px 0" }} />

        {/* Class Goals */}
        <p style={{ fontWeight: 700, margin: "0 0 6px 0" }}>Class Goals:</p>
        <ul style={{ margin: "0 0 12px 0", paddingLeft: 24 }}>
          <li>Teach students how to use their device to stay updated on current events and local weather.</li>
          <li>Build confidence in navigating news sources and managing notifications.</li>
          <li>Introduce the convenience of tracking weather in multiple locations.</li>
        </ul>

        <div
          style={{
            backgroundColor: "#F5F5F5",
            padding: 12,
            borderLeft: "3px solid #CCCCCC",
            marginBottom: 24,
            fontStyle: "italic",
            fontSize: 16,
          }}
        >
          <strong>Teacher&apos;s Note:</strong> This class is about empowerment and connection. Staying informed helps
          seniors feel engaged with the world. Encourage them to find the weather for where their children or
          grandchildren live during the session. It&apos;s a very practical way to feel closer to family!
        </div>

        {/* Slide 1 */}
        <div style={{ marginTop: 32 }}>
          <p style={{ fontSize: 13, color: "#888888", margin: "0 0 4px 0" }}>Approx. 0–3 minutes</p>
          <h2 style={{ fontSize: 19, fontWeight: 700, color: "#000", margin: "0 0 4px 0" }}>
            [SLIDE 1: TITLE SLIDE]
          </h2>
          <hr style={{ border: "none", borderTop: "1px solid #EEEEEE", margin: "0 0 12px 0" }} />
          <p style={{ margin: "0 0 12px 0" }}>
            &ldquo;Welcome back, everyone! Today, we are going to learn how to turn your phone into your very own
            personal morning paper and meteorologist.
          </p>
          <p style={{ margin: "0 0 12px 0" }}>
            We&apos;re going to explore how to stay informed about the world and, more importantly, how to know if
            you&apos;ll need an umbrella before you step out the door. Let&apos;s dive in!&rdquo;
          </p>
        </div>

        {/* Slide 2 */}
        <div style={{ marginTop: 32 }}>
          <p style={{ fontSize: 13, color: "#888888", margin: "0 0 4px 0" }}>Approx. 3–5 minutes</p>
          <h2 style={{ fontSize: 19, fontWeight: 700, color: "#000", margin: "0 0 4px 0" }}>
            [SLIDE 2: TODAY&apos;S GOALS]
          </h2>
          <hr style={{ border: "none", borderTop: "1px solid #EEEEEE", margin: "0 0 12px 0" }} />
          <p style={{ margin: "0 0 12px 0" }}>
            &ldquo;Here is our plan for today. We&apos;ll start with the weather—how to find your local forecast and how
            to check the weather for your loved ones far away.
          </p>
          <p style={{ margin: "0 0 12px 0" }}>
            Then, we&apos;ll talk about news. We&apos;ll learn where to find sources you can trust and how to search
            for topics that actually interest you. And finally, we&apos;ll talk about those little &apos;dings&apos; and
            banners your phone sends you—those are called &apos;Alerts&apos;—and I&apos;ll show you how to stay in
            control of them.&rdquo;
          </p>
        </div>

        {/* Slides 3 & 4 */}
        <div style={{ marginTop: 32 }}>
          <p style={{ fontSize: 13, color: "#888888", margin: "0 0 4px 0" }}>Approx. 5–10 minutes</p>
          <h2 style={{ fontSize: 19, fontWeight: 700, color: "#000", margin: "0 0 4px 0" }}>
            [SLIDES 3 &amp; 4: THE WEATHER APP &amp; UNDERSTANDING THE FORECAST]
          </h2>
          <hr style={{ border: "none", borderTop: "1px solid #EEEEEE", margin: "0 0 12px 0" }} />
          <p style={{ margin: "0 0 12px 0" }}>
            &ldquo;Let&apos;s start with the weather. Every phone has a built-in weather app. Look on your screen for an
            icon with a sun or a cloud. Go ahead and tap it to open it.
          </p>
          <p style={{ margin: "0 0 12px 0", color: "#888888", fontStyle: "italic" }}>
            (Wait for everyone to open their weather app.)
          </p>
          <p style={{ margin: "0 0 12px 0" }}>
            The first thing you&apos;ll see is a big number—that&apos;s the current temperature outside right now. But
            if you scroll down with your finger, you&apos;ll see much more.
          </p>
          <p style={{ margin: "0 0 12px 0" }}>
            You&apos;ll see an <strong>hourly forecast</strong>, which tells you if it&apos;s going to get hotter or
            cooler throughout the day. And if you scroll even further, you&apos;ll see a{" "}
            <strong>10-day forecast</strong>. This is perfect for planning your week—you can see if Saturday looks like a
            good day for a walk or a trip to the store.&rdquo;
          </p>
        </div>

        {/* Slide 5 */}
        <div style={{ marginTop: 32 }}>
          <p style={{ fontSize: 13, color: "#888888", margin: "0 0 4px 0" }}>Approx. 10–15 minutes</p>
          <h2 style={{ fontSize: 19, fontWeight: 700, color: "#000", margin: "0 0 4px 0" }}>
            [SLIDE 5: WEATHER FOR FAMILY FAR AWAY]
          </h2>
          <hr style={{ border: "none", borderTop: "1px solid #EEEEEE", margin: "0 0 12px 0" }} />
          <p style={{ margin: "0 0 12px 0" }}>
            &ldquo;Now, here is one of the best features. You can save other cities! Let&apos;s say your daughter lives
            in Chicago. You can add Chicago to your list, and with one tap, you&apos;ll know if she&apos;s dealing with
            snow while you&apos;re enjoying the Florida sunshine.
          </p>
          <p style={{ margin: "0 0 12px 0" }}>
            Look for a small icon that looks like a <strong>list</strong> (three horizontal lines) or a{" "}
            <strong>plus sign (+)</strong> in the corner of your app. Tap that, type in a city name, and add it.
            It&apos;s a wonderful way to feel connected to family.&rdquo;
          </p>
          <p style={{ margin: "0 0 12px 0", color: "#888888", fontStyle: "italic" }}>
            (Walk around and help students add a city for a family member.)
          </p>
        </div>

        {/* Slides 6, 7 & 8 */}
        <div style={{ marginTop: 32 }}>
          <p style={{ fontSize: 13, color: "#888888", margin: "0 0 4px 0" }}>Approx. 15–22 minutes</p>
          <h2 style={{ fontSize: 19, fontWeight: 700, color: "#000", margin: "0 0 4px 0" }}>
            [SLIDES 6, 7 &amp; 8: THE DIGITAL NEWSPAPER &amp; SEARCHING TOPICS]
          </h2>
          <hr style={{ border: "none", borderTop: "1px solid #EEEEEE", margin: "0 0 12px 0" }} />
          <p style={{ margin: "0 0 12px 0" }}>
            &ldquo;Now let&apos;s talk about the news. You don&apos;t have to wait for the paper to be delivered
            anymore! You can use your <strong>web browser</strong> (Safari or Chrome) to visit the websites of any news
            organization you trust, like the BBC or your local paper.
          </p>
          <p style={{ margin: "0 0 12px 0" }}>
            Your phone also has a built-in <strong>&apos;News&apos; app</strong> that is like a buffet—it collects
            stories from many different sources and shows them to you in one place.
          </p>
          <p style={{ margin: "0 0 12px 0" }}>
            And remember our search skills! If you love gardening, or you&apos;re following a specific world event,
            just use the <strong>Search Bar</strong> inside the news app. Type in &apos;gardening tips&apos; and
            you&apos;ll find a world of articles just for you. You are in control of what you read.&rdquo;
          </p>
        </div>

        {/* Slides 9 & 10 */}
        <div style={{ marginTop: 32 }}>
          <p style={{ fontSize: 13, color: "#888888", margin: "0 0 4px 0" }}>Approx. 22–30 minutes</p>
          <h2 style={{ fontSize: 19, fontWeight: 700, color: "#000", margin: "0 0 4px 0" }}>
            [SLIDES 9 &amp; 10: ALERTS &amp; TAMING THEM]
          </h2>
          <hr style={{ border: "none", borderTop: "1px solid #EEEEEE", margin: "0 0 12px 0" }} />
          <p style={{ margin: "0 0 12px 0" }}>
            &ldquo;Has your phone ever &apos;dinged&apos; and shown a message on the screen about a news story or a
            weather warning? Those are called <strong>Push Notifications</strong>, or just <strong>Alerts</strong>.
          </p>
          <p style={{ margin: "0 0 12px 0" }}>
            They are very useful for urgent things, like a tornado warning or a major news event. But sometimes, they
            can get a bit annoying if they happen too often.
          </p>
          <p style={{ margin: "0 0 12px 0" }}>
            The important thing to remember is: <strong>You are the boss of your phone.</strong> If a news app is
            dinging too much, you can go into your <strong>Settings</strong>, look for &apos;Notifications,&apos; and
            turn them off. Don&apos;t let the dings overwhelm you! Only keep the ones that are truly helpful to
            you.&rdquo;
          </p>
        </div>

        {/* Slide 11 */}
        <div style={{ marginTop: 32 }}>
          <p style={{ fontSize: 13, color: "#888888", margin: "0 0 4px 0" }}>Approx. 30–35 minutes</p>
          <h2 style={{ fontSize: 19, fontWeight: 700, color: "#000", margin: "0 0 4px 0" }}>
            [SLIDE 11: YOU&apos;RE WELL-INFORMED!]
          </h2>
          <hr style={{ border: "none", borderTop: "1px solid #EEEEEE", margin: "0 0 12px 0" }} />
          <p style={{ margin: "0 0 12px 0" }}>
            &ldquo;Look at what you can do now! You can check the weather here and anywhere else in the world. You know
            how to find news you can trust and how to search for your favorite topics. And you know how to manage those
            alerts. You are officially a well-informed digital citizen!
          </p>
          <p style={{ margin: "0 0 12px 0" }}>
            Your &apos;homework&apos; this week is to check the weather for one friend or family member who lives in a
            different city. Next time you talk to them, you can say, &apos;I see it&apos;s quite cold where you
            are!&apos; They&apos;ll be very impressed.&rdquo;
          </p>
        </div>

        {/* Slide 12 */}
        <div style={{ marginTop: 32 }}>
          <p style={{ fontSize: 13, color: "#888888", margin: "0 0 4px 0" }}>Approx. 35–60 minutes</p>
          <h2 style={{ fontSize: 19, fontWeight: 700, color: "#000", margin: "0 0 4px 0" }}>
            [SLIDE 12: GAME TIME!]
          </h2>
          <hr style={{ border: "none", borderTop: "1px solid #EEEEEE", margin: "0 0 12px 0" }} />
          <p style={{ margin: "0 0 12px 0" }}>
            &ldquo;Alright, everyone! It&apos;s time to have some fun and review what we&apos;ve learned about staying
            informed. Let&apos;s get ready for our game!&rdquo;
          </p>
          <p style={{ margin: "0 0 12px 0", color: "#888888", fontStyle: "italic" }}>
            (Lead the students in the 25-minute review game.)
          </p>
        </div>
      </div>
    </div>
  );
}
