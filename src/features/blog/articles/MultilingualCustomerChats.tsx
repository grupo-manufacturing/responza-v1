import { blogPostPath } from '@/features/blog/blog.posts'
import { BlogCallout, BlogH2, BlogH3, BlogLink, BlogList, BlogP, BlogStrong } from '@/features/blog/components/BlogProse'

export function Article() {
  return (
    <>
      <BlogP>
        India doesn't run on one language, and neither do your customers. A shop in Bengaluru might get messages in
        Kannada, Tamil, Hindi and English on the same morning. A textile seller in Surat shipping across the country
        could see Gujarati, Marathi, Bengali and a lot of Hinglish before lunch.
      </BlogP>
      <BlogP>
        Mostly, this is a good problem to have. It means your products are reaching people far beyond your own city.
        But it also means some messages sit unanswered because you're not quite sure what they say.
      </BlogP>
      <BlogP>
        Here's how to handle WhatsApp and Instagram messages in different Indian languages without slowing everything
        else down.
      </BlogP>

      <BlogH2>Why customers write in their own language</BlogH2>
      <BlogP>
        Chat is personal. People type on WhatsApp the way they talk to family, and many are more comfortable writing in
        their own language, or in their language typed with English letters. Asking them to switch to English adds
        friction, and some just won't bother.
      </BlogP>
      <BlogP>
        It's also about getting the order right. A customer who can explain exactly what they need, in their own words,
        is more likely to get the right product and less likely to send it back.
      </BlogP>

      <BlogH2>Where things go wrong</BlogH2>

      <BlogH3>Messages left for later</BlogH3>
      <BlogP>
        When a message is hard to read, it's easy to skip it for now and clear the easy ones first. Later often turns
        into never. And these are frequently serious buyers who simply wrote the way they're comfortable.
      </BlogP>

      <BlogH3>Getting the order wrong</BlogH3>
      <BlogP>
        A wrong size, colour, quantity or address because of a misread message is expensive. Returns, reshipping and an
        unhappy customer cost far more than the extra minute it takes to understand the message properly.
      </BlogP>

      <BlogH3>Copying and pasting into translation apps</BlogH3>
      <BlogP>
        The usual workaround is to copy the message, open Google Translate, paste it, read the result, then go back to
        WhatsApp or Instagram to reply. It works, but it's slow, and doing it twenty times a day across two apps gets
        tiring fast. It's one more version of the{' '}
        <BlogLink to={blogPostPath('manage-whatsapp-instagram-messages-one-place')}>
          constant app switching
        </BlogLink>{' '}
        that eats into a business owner's day.
      </BlogP>

      <BlogH3>Mixed scripts and Hinglish</BlogH3>
      <BlogP>
        Many customers write Hindi, Tamil or Marathi in English letters, or mix two languages in one line, like "Bhaiya
        ye blue wala kurta XL mein milega kya?" Some translation tools handle this better than others, so always check
        that the result makes sense before you act on it.
      </BlogP>

      <BlogH2>Practical ways to handle multilingual customer chats</BlogH2>

      <BlogH3>Keep your replies simple</BlogH3>
      <BlogP>
        You don't have to reply in the customer's language to give good service. Short sentences, everyday words,
        prices and dates written as numbers, and no slang go a long way. Plenty of customers who write in their own
        language read simple English or Hindi without any trouble.
      </BlogP>

      <BlogH3>Have your key replies translated once</BlogH3>
      <BlogP>
        If a big share of your customers write in one or two languages, ask someone fluent to translate your five most
        important replies properly, then save them as quick replies. Prices, delivery times, payment details and your
        return policy matter most.
      </BlogP>

      <BlogH3>Use your phone keyboard</BlogH3>
      <BlogP>
        Keyboards like Gboard support voice typing and typing in many Indian languages, and can translate as you type.
        It's a handy way to write a reply in a language you speak but don't type quickly in.
      </BlogP>

      <BlogH3>Confirm the important details back</BlogH3>
      <BlogP>
        For orders, repeat the key details in your reply: product, size, colour, quantity, price and delivery address.
        If something was misunderstood, the customer will correct you before you ship rather than after.
      </BlogP>

      <BlogH3>Ask for a screenshot</BlogH3>
      <BlogP>
        When you're not sure which product someone means, ask them to send a screenshot of the post or catalog item. It
        works in every language.
      </BlogP>

      <BlogH3>Handle voice notes politely</BlogH3>
      <BlogP>
        Lots of customers prefer voice notes. If you can't follow one, it's perfectly fine to ask them to type the main
        details, or to offer a call back at a convenient time.
      </BlogP>

      <BlogH2>Translating messages inside your inbox</BlogH2>
      <BlogP>
        The real time saving comes from never leaving the chat. Some customer messaging tools can translate a message
        right where it appears, so you can read it and reply without copying anything anywhere.
      </BlogP>
      <BlogP>
        In Responza, you pick your preferred language in Settings. A translate button then appears on customer text
        messages in both your WhatsApp and Instagram conversations. Tap it and the message is shown in your language,
        and you can switch back to the original whenever you want.
      </BlogP>
      <BlogP>Responza currently translates messages into:</BlogP>
      <BlogList>
        <li>Hindi, Marathi, Gujarati and Punjabi</li>
        <li>Bengali and Odia</li>
        <li>Tamil, Telugu, Kannada and Malayalam</li>
        <li>Arabic and Spanish</li>
      </BlogList>
      <BlogP>
        So if you're a Hindi-speaking owner in Delhi and a customer writes in Tamil, you can read their message in Hindi
        without leaving the conversation. Names, prices, order IDs and phone numbers are kept as they are, so the
        details you need for the order don't get changed along the way.
      </BlogP>
      <BlogCallout>
        <BlogStrong>Good to know:</BlogStrong> translation works on text messages. Photos, voice notes and other media
        aren't translated.
      </BlogCallout>

      <BlogH2>A simple process for multilingual chats</BlogH2>
      <BlogList ordered>
        <li>Read the message in your language, using in-chat translation or a translator app.</li>
        <li>Pick out the facts that matter: product, size, quantity, place and date.</li>
        <li>Reply in simple English or Hindi, or in the customer's language if you have a saved reply ready.</li>
        <li>For orders, confirm the details back in a short summary.</li>
        <li>Save any new answer you had to write, so it's ready next time.</li>
      </BlogList>
      <BlogP>
        Speed still matters with these chats, maybe more than usual, because a customer writing in their own language
        is often checking whether you'll understand them at all. Our post on{' '}
        <BlogLink to={blogPostPath('how-fast-should-business-reply-whatsapp-instagram')}>
          how fast a business should reply on WhatsApp and Instagram
        </BlogLink>{' '}
        has a realistic target to aim for.
      </BlogP>

      <BlogH2>Language shouldn't cost you the sale</BlogH2>
      <BlogP>
        Customers who write in their own language are often your most genuine buyers. They found you, they're
        interested, and they're telling you what they want in the words that come naturally to them. With a few good
        saved replies, the habit of confirming details, and translation built into your inbox, you can serve them as
        well as anyone else.
      </BlogP>
      <BlogP>
        If you'd like to try in-chat translation together with AI draft replies for WhatsApp and Instagram, Responza
        has a 3-day free trial with no credit card required. <BlogLink to="/#pricing">See plans and pricing</BlogLink>.
      </BlogP>
    </>
  )
}
