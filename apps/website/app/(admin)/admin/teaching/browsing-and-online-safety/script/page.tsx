export default function BrowsingScript() {
  return (
    <div style={{
      maxWidth: 680,
      margin: "0 auto",
      padding: 20,
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      fontSize: 17,
      lineHeight: 1.7,
      backgroundColor: "#fff",
      color: "#000",
    }}>
      <h1 style={{ fontSize: 24, fontWeight: "bold", margin: "0 0 4px 0" }}>
        Browsing &amp; Online Safety
      </h1>
      <p style={{ fontSize: 16, color: "#666", margin: "0 0 12px 0" }}>Teacher&rsquo;s Script</p>
      <hr style={{ border: "none", borderTop: "1px solid #ddd", margin: "0 0 20px 0" }} />

      {/* Class Goals */}
      <p style={{ fontWeight: "bold", margin: "0 0 6px 0" }}>Class Goals:</p>
      <ul style={{ margin: "0 0 12px 0", paddingLeft: 22 }}>
        <li>To introduce the concept of a web browser and basic navigation skills.</li>
        <li>To instill the most important, foundational rules for online safety.</li>
        <li>To empower students to explore the internet with awareness, not fear.</li>
      </ul>

      {/* Teacher's Note */}
      <div style={{
        backgroundColor: "#F5F5F5",
        borderLeft: "3px solid #CCC",
        padding: 12,
        marginBottom: 24,
        fontStyle: "italic",
      }}>
        <strong>Teacher&rsquo;s Note:</strong> This is arguably one of the most important classes in the entire curriculum. Your tone is critical. For the first half (browsing), be enthusiastic and encouraging. For the second half (safety), be calm, clear, and reassuring. The goal is to make students cautious and wise, not terrified of the internet. Be prepared to demonstrate visiting a safe website on your own device.
      </div>

      {/* ── Slide 1 ── */}
      <div style={{ marginTop: 32 }}>
        <p style={{ fontSize: 13, color: "#888", margin: "0 0 2px 0" }}>Approx. 0–3 minutes</p>
        <h2 style={{ fontSize: 19, fontWeight: "bold", color: "#000", margin: "0 0 4px 0" }}>[SLIDE 1: TITLE SLIDE]</h2>
        <hr style={{ border: "none", borderTop: "1px solid #eee", margin: "0 0 10px 0" }} />
        <p>"Hello, everyone, welcome! Today, we are going on a big journey. We&rsquo;re going to venture out onto the internet. We can think of the internet as a giant, amazing highway system that connects the whole world. And today, we&rsquo;re going to learn how to drive on it, and just as importantly, how to follow the rules of the road to stay safe."</p>
      </div>

      {/* ── Slide 2 ── */}
      <div style={{ marginTop: 32 }}>
        <p style={{ fontSize: 13, color: "#888", margin: "0 0 2px 0" }}>Approx. 3–5 minutes</p>
        <h2 style={{ fontSize: 19, fontWeight: "bold", color: "#000", margin: "0 0 4px 0" }}>[SLIDE 2: OUR JOURNEY TODAY]</h2>
        <hr style={{ border: "none", borderTop: "1px solid #eee", margin: "0 0 10px 0" }} />
        <p>"Here&rsquo;s the map for our journey. First, we&rsquo;ll talk about the special car we need to travel on the internet highway—that&rsquo;s our web browser. We&rsquo;ll learn how to drive to a specific place using a website address and how to follow the road signs, which are called &lsquo;links.&rsquo;</p>
        <p>Then, we&rsquo;ll get to the most important part of our lesson: the rules of the road. We&rsquo;ll learn the Golden Rule of Safety, how to tell if you&rsquo;re on a safe road by looking for a special lock, and how to spot and avoid the most common tricks and scams you might see along the way."</p>
      </div>

      {/* ── Slide 3 ── */}
      <div style={{ marginTop: 32 }}>
        <p style={{ fontSize: 13, color: "#888", margin: "0 0 2px 0" }}>Approx. 5–8 minutes</p>
        <h2 style={{ fontSize: 19, fontWeight: "bold", color: "#000", margin: "0 0 4px 0" }}>[SLIDE 3: YOUR CAR FOR THE INTERNET]</h2>
        <hr style={{ border: "none", borderTop: "1px solid #eee", margin: "0 0 10px 0" }} />
        <p>"Okay, so how do we get onto this internet highway? You need a special app called a <strong>web browser</strong>. This is your car. It&rsquo;s the tool that lets you travel from place to place online.</p>
        <p>There are a few different brands of cars, and you can see the most common ones on the slide. If you have an iPhone or iPad, your car is most likely <strong>Safari</strong>, which looks like a compass. For many other phones, your car might be <strong>Google Chrome</strong>, the colorful circle. It doesn&rsquo;t matter what kind of car you have—they all drive on the same roads and work in very similar ways."</p>
      </div>

      {/* ── Slide 4 ── */}
      <div style={{ marginTop: 32 }}>
        <p style={{ fontSize: 13, color: "#888", margin: "0 0 2px 0" }}>Approx. 8–12 minutes</p>
        <h2 style={{ fontSize: 19, fontWeight: "bold", color: "#000", margin: "0 0 4px 0" }}>[SLIDE 4: THE ADDRESS BAR]</h2>
        <hr style={{ border: "none", borderTop: "1px solid #eee", margin: "0 0 10px 0" }} />
        <p>"Every car has a steering wheel, and every browser has an <strong>address bar</strong>. It&rsquo;s that long bar at the very top of the screen. This is where you tell your car where you want to go.</p>
        <p>Every single place on the internet, from Google to the library to your favorite news site, has a unique address, just like your house. If you know the address, you can type it into this address bar, press the &lsquo;Go&rsquo; button, and your browser will take you right there. For example, you might type <strong>www.google.com</strong>."</p>
      </div>

      {/* ── Slide 5 ── */}
      <div style={{ marginTop: 32 }}>
        <p style={{ fontSize: 13, color: "#888", margin: "0 0 2px 0" }}>Approx. 12–15 minutes</p>
        <h2 style={{ fontSize: 19, fontWeight: "bold", color: "#000", margin: "0 0 4px 0" }}>[SLIDE 5: FOLLOWING THE SIGNS (LINKS)]</h2>
        <hr style={{ border: "none", borderTop: "1px solid #eee", margin: "0 0 10px 0" }} />
        <p>"Now, most of the time, we don&rsquo;t drive by typing in addresses. We follow road signs! On the internet, those road signs are called <strong>links</strong>. A link is simply a shortcut from the page you&rsquo;re on to another page.</p>
        <p>The most common way to spot a link is to look for text that&rsquo;s a different color—it&rsquo;s almost always <strong>blue and underlined</strong>. When you see text like that, it&rsquo;s an invitation to tap it to go somewhere new. Your phone is smart enough to know it&rsquo;s a special kind of text. Tapping a link is the main way we get around the internet."</p>
      </div>

      {/* ── Slide 6 ── */}
      <div style={{ marginTop: 32 }}>
        <p style={{ fontSize: 13, color: "#888", margin: "0 0 2px 0" }}>Approx. 15–20 minutes</p>
        <h2 style={{ fontSize: 19, fontWeight: "bold", color: "#000", margin: "0 0 4px 0" }}>[SLIDE 6: THE GOLDEN RULE OF SAFETY]</h2>
        <hr style={{ border: "none", borderTop: "1px solid #eee", margin: "0 0 10px 0" }} />
        <p>"Alright, we know how to drive. Now we need to learn how to drive <em>safely</em>. The internet is a wonderful place, but just like in the real world, there are tricksters out there. The single most important rule—the one I want you to remember above all others—is on this slide. <strong>If it seems too good to be true, it probably is.</strong></p>
        <p>If a website flashes a banner that says you&rsquo;ve won a free iPad, or a free cruise, or a million dollars... it is <em>always</em> a trick. Always. There is no such thing as a free iPad on the internet. This is the oldest trick in the book, designed to get you to click on something dangerous."</p>
      </div>

      {/* ── Slide 7 ── */}
      <div style={{ marginTop: 32 }}>
        <p style={{ fontSize: 13, color: "#888", margin: "0 0 2px 0" }}>Approx. 20–25 minutes</p>
        <h2 style={{ fontSize: 19, fontWeight: "bold", color: "#000", margin: "0 0 4px 0" }}>[SLIDE 7: LOOK FOR THE LOCK!]</h2>
        <hr style={{ border: "none", borderTop: "1px solid #eee", margin: "0 0 10px 0" }} />
        <p>"Now for a very practical safety tip. Sometimes, you&rsquo;ll be on a website where you might want to buy something, or sign up for something, and you&rsquo;ll need to type in your credit card or a password. How do you know it&rsquo;s safe to do that?</p>
        <p>You <strong>look for the lock.</strong> Before you <em>ever</em> type in private information, look up in the address bar at the top of your browser. If you see a little closed <strong>padlock icon</strong>, that is your sign that the connection is secure and private. It means the conversation between your phone and that website is scrambled, so no one can listen in. If you do NOT see that lock, you should never, ever type in a password or credit card number. It&rsquo;s that simple. Look for the lock."</p>
      </div>

      {/* ── Slide 8 ── */}
      <div style={{ marginTop: 32 }}>
        <p style={{ fontSize: 13, color: "#888", margin: "0 0 2px 0" }}>Approx. 25–28 minutes</p>
        <h2 style={{ fontSize: 19, fontWeight: "bold", color: "#000", margin: "0 0 4px 0" }}>[SLIDE 8: DANGER: POP-UP WINDOWS]</h2>
        <hr style={{ border: "none", borderTop: "1px solid #eee", margin: "0 0 10px 0" }} />
        <p>"Has anyone ever been driving and had someone run out and try to put a flyer on your windshield? It&rsquo;s annoying and distracting, right? That&rsquo;s what pop-ups are.</p>
        <p>You&rsquo;ll be on a webpage, and suddenly a new, small window will appear in front of it, often with a scary warning or an amazing prize. It&rsquo;s designed to startle you and make you react without thinking. Do not fall for it. The only thing you should ever do with a pop-up window is look for the little &lsquo;X&rsquo; in its corner to close it and make it go away. Never click the big, flashy buttons inside it."</p>
      </div>

      {/* ── Slide 9 ── */}
      <div style={{ marginTop: 32 }}>
        <p style={{ fontSize: 13, color: "#888", margin: "0 0 2px 0" }}>Approx. 28–32 minutes</p>
        <h2 style={{ fontSize: 19, fontWeight: "bold", color: "#000", margin: "0 0 4px 0" }}>[SLIDE 9: DON&rsquo;T TAKE THE BAIT!]</h2>
        <hr style={{ border: "none", borderTop: "1px solid #eee", margin: "0 0 10px 0" }} />
        <p>"This is the last and maybe the most important safety rule today. The tricksters have gotten very clever. They will send you an email or a text message that looks like it&rsquo;s from someone you trust, like your bank, Amazon, or even the government.</p>
        <p>The message will always try to make you feel <strong>scared or rushed</strong>. It will say &lsquo;Your account has been locked!&rsquo; or &lsquo;Suspicious activity detected! Click here IMMEDIATELY!&rsquo; They want you to panic and click their link without thinking. This is called &lsquo;phishing,&rsquo; like they are fishing for your information.</p>
        <p>Here is the rule: If you get a scary, urgent email, <strong>STOP</strong>. Do not click the link. Instead, close the email, and if you&rsquo;re truly worried, call your bank using the phone number on the back of your debit card. Never trust a link in a scary email."</p>
      </div>

      {/* ── Slide 10 ── */}
      <div style={{ marginTop: 32 }}>
        <p style={{ fontSize: 13, color: "#888", margin: "0 0 2px 0" }}>Approx. 32–35 minutes</p>
        <h2 style={{ fontSize: 19, fontWeight: "bold", color: "#000", margin: "0 0 4px 0" }}>[SLIDE 10: YOU DID IT!]</h2>
        <hr style={{ border: "none", borderTop: "1px solid #eee", margin: "0 0 10px 0" }} />
        <p>"And with that, you are ready. It sounds like a lot, but it boils down to a few simple things. You now know what a browser is and how to use it. And you know the simple rules to stay safe: be skeptical of things that are too good to be true, always look for the padlock before sharing private info, and never, ever click on a link in a scary, urgent email. You are now prepared to be a smart, safe internet traveler. Well done!"</p>
      </div>

      {/* ── Slide 11 ── */}
      <div style={{ marginTop: 32 }}>
        <p style={{ fontSize: 13, color: "#888", margin: "0 0 2px 0" }}>Approx. 35–60 minutes</p>
        <h2 style={{ fontSize: 19, fontWeight: "bold", color: "#000", margin: "0 0 4px 0" }}>[SLIDE 11: GAME TIME!]</h2>
        <hr style={{ border: "none", borderTop: "1px solid #eee", margin: "0 0 10px 0" }} />
        <p>"Okay, let&rsquo;s put our new safety knowledge to the test. It&rsquo;s time for our game! Let&rsquo;s see how well we can spot the tricks and remember the rules of the road."</p>
        <p style={{ color: "#888", fontStyle: "italic" }}>(Lead the students in the 25-minute review game.)</p>
      </div>
    </div>
  );
}
