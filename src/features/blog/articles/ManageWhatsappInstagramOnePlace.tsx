import { blogPostPath } from '@/features/blog/blog.posts'
import { BlogCallout, BlogH2, BlogH3, BlogLink, BlogList, BlogP, BlogStrong } from '@/features/blog/components/BlogProse'

export function Article() {
  return (
    <>
      <BlogP>
        If you run a business in India, your customers have already decided how they want to talk to you. Some
        message on WhatsApp because that's where they talk to everyone. Others find you on Instagram, see a reel or a
        product post, and send a DM right there. Very few of them will call, and almost nobody will email.
      </BlogP>
      <BlogP>
        So you end up with two inboxes. Sometimes three, if a few regular customers still message your personal
        number. On a busy day you're jumping between them every few minutes, trying to remember who asked what, and
        where.
      </BlogP>
      <BlogP>
        This post looks at what all that switching actually costs, why it gets harder as you grow, and how to manage
        WhatsApp and Instagram messages in one place without hiring someone just to watch your phone.
      </BlogP>

      <BlogH2>A normal morning of replying to customers</BlogH2>
      <BlogP>
        Think of someone like Meena, who runs a small saree and dress material shop in Jaipur and sells a good part of
        her stock online. Her morning goes something like this:
      </BlogP>
      <BlogList>
        <li>
          <BlogStrong>9:15.</BlogStrong> She opens WhatsApp. Eleven unread chats. Four are asking the price of a saree
          from last night's reel.
        </li>
        <li>
          <BlogStrong>9:40.</BlogStrong> She opens Instagram. Twenty-odd DMs, half of them in Requests because the
          senders don't follow her. Several ask the same price question.
        </li>
        <li>
          <BlogStrong>10:05.</BlogStrong> Back to WhatsApp to send payment details to yesterday's customer. Two new
          chats come in. She answers one and forgets the other.
        </li>
        <li>
          <BlogStrong>11:30.</BlogStrong> Someone on Instagram asks if the blue saree is still available. Meena checks
          with her supplier on WhatsApp, gets an answer, and then can't find the Instagram chat because newer messages
          have pushed it down.
        </li>
      </BlogList>
      <BlogP>
        Nothing here is unusual. This is what customer messaging looks like for a huge number of small businesses.
        Each step makes sense on its own. The trouble is the total.
      </BlogP>

      <BlogH2>What all the app switching really costs you</BlogH2>

      <BlogH3>Missed and late replies</BlogH3>
      <BlogP>
        When messages are split across two apps, something always slips. A chat gets opened, quietly marked as read,
        and then buried. On WhatsApp, a chat you've read looks exactly like one you've handled. On Instagram, a message
        from a new customer can sit in Requests for days because nobody remembered to check that tab.
      </BlogP>
      <BlogP>
        A customer who asked "price?" and heard nothing for six hours has usually moved on. In most categories, buyers
        message two or three sellers at the same time, and the first clear reply has a real advantage. We've written
        more about this in{' '}
        <BlogLink to={blogPostPath('how-fast-should-business-reply-whatsapp-instagram')}>
          how fast a business should reply on WhatsApp and Instagram
        </BlogLink>
        .
      </BlogP>

      <BlogH3>Lost context</BlogH3>
      <BlogP>
        Switching apps means switching memory. You're halfway through a WhatsApp chat about a bulk order, you jump to
        Instagram to answer three DMs, and when you come back you're scrolling up to find the quantity and the delivery
        city again. Do that forty or fifty times a day and it eats a surprising amount of time.
      </BlogP>

      <BlogH3>The same answer, typed again and again</BlogH3>
      <BlogP>
        Price, delivery charges, COD or prepaid, return policy, shop timings, location. Most businesses get the same
        ten questions every day, on both apps. Saved replies help, but you set them up separately in each app, and they
        don't know anything about the product the customer is asking about.
      </BlogP>

      <BlogH3>Your own time and attention</BlogH3>
      <BlogP>
        This is the cost most owners don't count. Every notification pulls you away from the work that actually grows
        the business: sourcing, packing, talking to suppliers, making content. If you answer messages in the gaps
        between everything else, you never really finish either.
      </BlogP>

      <BlogH2>Why it gets harder as you grow</BlogH2>
      <BlogP>
        With ten messages a day, two apps is fine. At fifty, it's stressful. At a hundred, things are going wrong and
        you may not even know which things. One reel that does well, or a festive sale, can push you from one level to
        the next overnight. Diwali week is a bad time to find out your system can't keep up.
      </BlogP>
      <BlogP>
        There's also the growing pile of history. A customer who bought from you in March messages again in October,
        on Instagram this time, and you have no easy way to see what they ordered or what you promised them.
      </BlogP>

      <BlogH2>How businesses usually try to cope</BlogH2>
      <BlogP>Before paying for any software, most owners try a few things. Each one works up to a point.</BlogP>

      <BlogH3>Checking messages at fixed times</BlogH3>
      <BlogP>
        Going through both inboxes every hour stops the constant interruptions. The catch is that your fastest reply
        is now up to an hour, which matters when the customer is comparing you with other sellers.
      </BlogP>

      <BlogH3>WhatsApp Web and Instagram on a laptop</BlogH3>
      <BlogP>
        Keeping both open in browser tabs beats juggling them on a phone. You get a proper keyboard and a bigger
        screen. You're still switching tabs, though, and each inbox still has its own unread count.
      </BlogP>

      <BlogH3>Quick replies and saved replies</BlogH3>
      <BlogP>
        Both apps let you save common answers. In the WhatsApp Business app you type a slash and pick a quick reply.
        Instagram has saved replies for professional accounts. If you haven't set these up, do it today. Just remember
        you're now maintaining two separate lists, and every price change means updating both.
      </BlogP>

      <BlogH3>Pushing everyone to one app</BlogH3>
      <BlogP>
        Some businesses write "DM us on WhatsApp" in every Instagram caption. It works for some customers and loses
        others. Plenty of people are happy to chat on Instagram and won't bother switching apps for a seller they found
        five minutes ago.
      </BlogP>

      <BlogH2>What "one place" should actually mean</BlogH2>
      <BlogP>
        If you do look for a tool to bring your messages together, here's a simple checklist. It applies to any
        product, not just ours.
      </BlogP>
      <BlogList>
        <li>
          <BlogStrong>Both channels in one workspace.</BlogStrong> You shouldn't have to open separate apps to see
          what's waiting.
        </li>
        <li>
          <BlogStrong>A clear view of who needs a reply.</BlogStrong> Unread counts aren't enough. You want to know
          which customers are actually waiting on you.
        </li>
        <li>
          <BlogStrong>Help with repeat questions.</BlogStrong> Ideally based on your real prices and policies, not
          generic templates.
        </li>
        <li>
          <BlogStrong>You stay in control.</BlogStrong> AI can save time, but a wrong price sent automatically costs
          more than it saves. Look for tools where you approve each reply.
        </li>
        <li>
          <BlogStrong>Your phone still works.</BlogStrong> If you reply from the app now and then, those messages
          should still show up in the tool's chat history.
        </li>
        <li>
          <BlogStrong>Pricing that suits a small business.</BlogStrong> If it costs more than a part-time helper,
          it isn't really solving the problem.
        </li>
      </BlogList>
      <BlogP>
        If you're still deciding whether you need a tool at all, our comparison of the{' '}
        <BlogLink to={blogPostPath('whatsapp-business-app-vs-dedicated-inbox')}>
          WhatsApp Business app and a dedicated inbox
        </BlogLink>{' '}
        lists the signs that you've outgrown the free app.
      </BlogP>

      <BlogH2>How Responza handles it</BlogH2>
      <BlogP>We built Responza for exactly this problem, so here's how it works in short.</BlogP>
      <BlogP>
        You connect your WhatsApp Business number and your Instagram professional account from the Integrations page.
        Most people are done in a couple of minutes. Each channel gets its own module inside one workspace, and a
        dashboard shows which conversations need attention across both.
      </BlogP>
      <BlogP>
        When a customer messages you, Responza drafts a reply in the composer using the business information you've
        added, like your price list, delivery terms and FAQs. You read it, change anything you want, and send it.
        Nothing goes out on its own.
      </BlogP>
      <BlogP>
        If a customer writes in a language you don't read comfortably, you can translate the message inside the chat.
        There's more on that in our guide to{' '}
        <BlogLink to={blogPostPath('reply-to-customers-in-indian-languages-whatsapp-instagram')}>
          handling customer messages in Hindi, Tamil, Telugu and other languages
        </BlogLink>
        . And when you reply from your phone, those messages sync back into Responza, so the history stays complete.
      </BlogP>
      <BlogCallout>
        Plans start at ₹499 a month with GST included, and every new account gets a 3-day free trial with no credit
        card. <BlogLink to="/#pricing">See pricing</BlogLink>.
      </BlogCallout>

      <BlogH2>A simple routine you can start this week</BlogH2>
      <BlogP>Whatever tools you use, these habits make a real difference:</BlogP>
      <BlogList ordered>
        <li>List the ten questions you get most often and write one clear answer for each.</li>
        <li>
          Save those answers as quick replies on WhatsApp and saved replies on Instagram, or add them as business
          knowledge in a tool that drafts replies from them.
        </li>
        <li>Check Instagram's Requests folder every day. That's where many new customers land.</li>
        <li>Pick fixed times to clear both inboxes completely, even if you also reply in between.</li>
        <li>
          For one week, count how many chats ended without a reply from you. That number tells you more about your
          setup than anything else.
        </li>
      </BlogList>
      <BlogP>
        Customers will keep using whichever app suits them. The goal isn't to change that. It's to make sure every one
        of them gets an answer, no matter where they wrote to you.
      </BlogP>
    </>
  )
}
