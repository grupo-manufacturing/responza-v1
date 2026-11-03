import { blogPostPath } from '@/features/blog/blog.posts'
import { BlogCallout, BlogH2, BlogH3, BlogLink, BlogList, BlogP, BlogStrong } from '@/features/blog/components/BlogProse'

export function Article() {
  return (
    <>
      <BlogP>
        The WhatsApp Business app is one of the best free tools a small business in India can have. Shops, clinics,
        tutors, home bakers and wholesalers across the country run their customer conversations on it, and for a long
        time it's all they need.
      </BlogP>
      <BlogP>
        But there's a point where it starts to struggle. It's rarely one big failure. It's a slow build-up of small
        things: an order missed here, a question answered for the hundredth time there, and a constant feeling that
        you're behind on messages.
      </BlogP>
      <BlogP>
        This guide covers what the free app does well, where it runs out, and the signs that it's time to move to a
        dedicated inbox.
      </BlogP>

      <BlogH2>What the WhatsApp Business app does well</BlogH2>
      <BlogP>Credit where it's due. For a free app, you get a lot:</BlogP>
      <BlogList>
        <li>A business profile with your address, hours, website and a short description.</li>
        <li>A catalog, so customers can browse products without leaving the chat.</li>
        <li>Labels to tag chats, such as "New order", "Paid" or "Pending delivery".</li>
        <li>Quick replies that you can insert by typing a slash.</li>
        <li>Greeting and away messages that go out automatically.</li>
        <li>WhatsApp Web and the desktop app, so you can type replies on a computer.</li>
      </BlogList>
      <BlogP>
        If your daily message count is manageable and you're mostly selling through WhatsApp, this setup is genuinely
        fine. Don't let anyone convince you that you need software before you do.
      </BlogP>

      <BlogH2>Where the free app starts to struggle</BlogH2>

      <BlogH3>It only covers WhatsApp</BlogH3>
      <BlogP>
        Your customers aren't only on WhatsApp. If you post on Instagram, you have a second inbox with its own unread
        messages, its own saved replies and its own Requests folder. The WhatsApp Business app can't help with any of
        that, so you end up{' '}
        <BlogLink to={blogPostPath('manage-whatsapp-instagram-messages-one-place')}>
          switching between WhatsApp and Instagram all day
        </BlogLink>
        .
      </BlogP>

      <BlogH3>Unread is not the same as unanswered</BlogH3>
      <BlogP>
        WhatsApp shows which chats you haven't opened. It doesn't show which customers are still waiting for an
        answer. Open a chat on your phone while you're serving someone at the counter, and it stops looking urgent,
        even though you never replied. Labels can fill the gap, but only if you remember to apply them every single
        time.
      </BlogP>

      <BlogH3>Quick replies are fixed text</BlogH3>
      <BlogP>
        A quick reply is a saved block of text. It's perfect for bank details or shop timings. It's much less useful
        for a question like "Is the 2 kg chocolate truffle cake available for Sunday delivery to Baner?", where the
        answer depends on the product, the date and the area. Those answers still get typed by hand, over and over.
      </BlogP>

      <BlogH3>Old conversations are hard to use</BlogH3>
      <BlogP>
        Finding what a regular customer ordered last month means scrolling, or searching chat text and hoping you used
        the same words back then. There's no summary of a long conversation and no easy way to see what customers ask
        about most.
      </BlogP>

      <BlogH3>Everything runs through one phone</BlogH3>
      <BlogP>
        WhatsApp Web helps, but the account still lives on a phone, and for a lot of owners that phone is also their
        personal one. It buzzes at dinner, on Sundays and during family functions, and it's hard to switch off.
      </BlogP>

      <BlogH2>Signs you've outgrown the free app</BlogH2>
      <BlogP>Go through this list honestly. If three or more sound familiar, it's worth looking at something more.</BlogP>
      <BlogList>
        <li>You regularly find chats from yesterday that never got a reply.</li>
        <li>You answer the same five questions dozens of times a day.</li>
        <li>Instagram DMs pile up because WhatsApp takes all your attention, or the other way round.</li>
        <li>You've lost an order because you couldn't find an old conversation.</li>
        <li>Customers message in languages you don't fully understand.</li>
        <li>You can't put your phone down for an hour without worrying about what you're missing.</li>
        <li>You only have a gut feeling about what customers ask about most.</li>
      </BlogList>

      <BlogH2>What a dedicated inbox adds</BlogH2>
      <BlogP>
        A dedicated inbox connects to WhatsApp through Meta's official WhatsApp Business Platform instead of running
        inside the phone app. Most also connect to Instagram. That opens up things the app can't do. Every product is
        different, but these are the features worth looking for.
      </BlogP>

      <BlogH3>Both channels in one workspace</BlogH3>
      <BlogP>
        WhatsApp and Instagram conversations live in the same place, so you're not opening two apps to find out
        what's waiting.
      </BlogP>

      <BlogH3>A view of what needs attention</BlogH3>
      <BlogP>
        Instead of relying on unread dots, a good inbox highlights the conversations where a customer is waiting on
        you.
      </BlogP>

      <BlogH3>Reply suggestions based on your business</BlogH3>
      <BlogP>
        This is where AI genuinely helps. When a customer asks about price, stock or delivery, the tool drafts an answer
        using your own price list and policies. You check it and send it. For most common questions, that turns a
        two-minute reply into a ten-second one.
      </BlogP>

      <BlogH3>Translation inside the chat</BlogH3>
      <BlogP>
        If customers write in Tamil, Bengali or Marathi and you don't, translation built into the conversation saves
        you from copying messages into another app.
      </BlogP>

      <BlogH3>Summaries and topics</BlogH3>
      <BlogP>
        Short summaries of long chats, and labels that show what people are asking about, help you pick up a
        conversation quickly and notice patterns, like a question about one product that keeps coming up.
      </BlogP>

      <BlogH2>Questions to ask before you switch</BlogH2>
      <BlogP>Moving to an inbox built on the WhatsApp Business Platform is a bigger step than installing an app. Ask:</BlogP>
      <BlogList>
        <li>
          <BlogStrong>How does pricing work?</BlogStrong> Flat monthly fee, per message, or per user? Will it still make
          sense if your volume doubles during the festive season?
        </li>
        <li>
          <BlogStrong>How are Meta's charges handled?</BlogStrong> On the WhatsApp Business Platform, Meta can charge
          for some message types, especially template messages that the business sends first. Ask how this works with
          the provider you're considering.
        </li>
        <li>
          <BlogStrong>Can you still reply from your phone?</BlogStrong> Some setups stop you using the WhatsApp
          Business app on that number. Others keep the two in sync. Make sure you know which one you're getting.
        </li>
        <li>
          <BlogStrong>Does the AI send replies on its own?</BlogStrong> Automatic replies to real questions are risky.
          Check whether you approve each message.
        </li>
        <li>
          <BlogStrong>Is there a free trial?</BlogStrong> You should be able to try it on real customer chats before
          you pay.
        </li>
      </BlogList>

      <BlogH2>Where Responza fits</BlogH2>
      <BlogP>Responza is a dedicated inbox for Indian businesses that sell and support customers on WhatsApp and Instagram.</BlogP>
      <BlogList>
        <li>
          WhatsApp and Instagram each get their own module inside one workspace, with a dashboard that shows what needs
          attention.
        </li>
        <li>
          AI drafts replies in the composer from the business knowledge you add. You review and send every message
          yourself.
        </li>
        <li>
          You can translate customer messages into your preferred language, including Hindi, Tamil, Telugu, Bengali,
          Marathi, Gujarati and several other Indian languages.
        </li>
        <li>Conversation summaries and topic labels show you what customers keep asking about.</li>
        <li>Messages you send directly from WhatsApp or Instagram still sync into Responza.</li>
        <li>
          Basic is ₹499 a month for 1,000 conversations. The annual plan is ₹4,999 a year for 30,000 conversations.
          GST is included in both.
        </li>
      </BlogList>
      <BlogCallout>
        Every account starts with a 3-day free trial and no credit card, so you can test it with your actual customers.{' '}
        <BlogLink to="/#pricing">Compare plans</BlogLink>.
      </BlogCallout>

      <BlogH2>The short answer</BlogH2>
      <BlogP>
        Stay on the free app if your message volume is comfortable and almost all of it comes through WhatsApp. Move to
        a dedicated inbox when replies start slipping, when you're typing the same answers all day, or when Instagram
        and WhatsApp are both pulling at your attention.
      </BlogP>
      <BlogP>
        You don't need to wait until things are completely out of hand. The best time to switch is usually just before
        your busy season, not in the middle of it.
      </BlogP>
    </>
  )
}
