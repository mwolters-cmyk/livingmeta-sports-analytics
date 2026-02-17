import Link from "next/link";

/* ─── Data ─── */

const learningResources = [
  {
    name: "Soccer Analytics Handbook",
    url: "https://github.com/devinpleuler/analytics-handbook",
    desc: "Comprehensive Jupyter notebook handbook by Devin Pleuler. Covers event data, expected goals, passing networks, and more.",
  },
  {
    name: "Edd Webster Football Analytics",
    url: "https://github.com/eddwebster/football_analytics",
    desc: "Extensive collection of football analytics resources, tutorials, and data sources by Edd Webster.",
  },
  {
    name: "Guide to Sports Analytics (Google Sheets)",
    url: "https://docs.google.com/spreadsheets/d/1LPe8xYduoep9qCrNzBGdJHaHZ8dnmdHNnu7UXZKzawU/edit?usp=sharing",
    desc: "Curated spreadsheet of sports analytics resources by Dominic Samangy. Updated regularly.",
  },
  {
    name: "Friends of Tracking (YouTube)",
    url: "https://www.youtube.com/@friendsoftracking755",
    desc: "YouTube channel with tutorials on tracking data analysis, pitch control, xG models, and more. By Laurie Shaw, David Sumpter, and others.",
  },
  {
    name: "McKay Johns (YouTube)",
    url: "https://www.youtube.com/@McKayJohns",
    desc: "Football data visualization tutorials using Python, mplsoccer, and StatsBomb data.",
  },
];

const annualReviews = [
  {
    name: "Soccer Analytics Review 2025",
    url: "https://www.janvanhaaren.be/posts/soccer-analytics-review-2025/index.html",
    year: 2025,
  },
  {
    name: "Soccer Analytics Review 2024",
    url: "https://www.janvanhaaren.be/posts/soccer-analytics-review-2024/index.html",
    year: 2024,
  },
  {
    name: "Soccer Analytics Review 2023",
    url: "https://www.janvanhaaren.be/posts/soccer-analytics-review-2023/index.html",
    year: 2023,
  },
  {
    name: "Soccer Analytics Review 2022",
    url: "https://www.janvanhaaren.be/posts/soccer-analytics-review-2022/index.html",
    year: 2022,
  },
  {
    name: "Soccer Analytics Review 2021",
    url: "https://www.janvanhaaren.be/posts/soccer-analytics-review-2021/index.html",
    year: 2021,
  },
  {
    name: "Soccer Analytics Review 2020",
    url: "https://www.janvanhaaren.be/posts/soccer-analytics-review-2020/index.html",
    year: 2020,
  },
];

const careerAdvice = [
  {
    name: "Friend of Tracking: Advice for Data Scientists",
    url: "https://www.youtube.com/watch?v=cnEDCqmqCzw",
    desc: "Video episode with perspectives from leading analytics professionals (March 2020).",
  },
  {
    name: "Getting Into Sports Analytics 2.0",
    url: "https://medium.com/@GregorydSam/getting-into-sports-analytics-2-0-129dfb87f5be",
    desc: "Updated entry pathway guide by Sam Gregory (January 2020).",
  },
  {
    name: "A Career in Football Analytics (3-part series)",
    url: "https://medium.pimpaudben.fr/part-1-a-career-in-football-analytics-the-what-91c888b3dcd2",
    desc: "Benoit Pimpaud on the what, the how, and the reality of working in football analytics (2022).",
  },
  {
    name: "How to Get Started in Data and the Football Industry",
    url: "https://henshawanalysis.medium.com/how-to-get-started-in-data-and-the-football-industry-50d974e84bef",
    desc: "Practical guide by Liam Henshaw (April 2022).",
  },
];

const books: {
  category: string;
  items: { name: string; author: string; url: string }[];
}[] = [
  {
    category: "Foundational",
    items: [
      {
        name: "Moneyball",
        author: "Michael Lewis",
        url: "https://wwnorton.com/books/Moneyball",
      },
      {
        name: "The Undoing Project",
        author: "Michael Lewis",
        url: "https://wwnorton.com/books/The-Undoing-Project/",
      },
      {
        name: "Thinking, Fast and Slow",
        author: "Daniel Kahneman",
        url: "https://us.macmillan.com/books/9780374533557/thinking-fast-and-slow",
      },
      {
        name: "Superforecasting",
        author: "Philip Tetlock & Dan Gardner",
        url: "https://www.penguinrandomhouse.com/books/227815/superforecasting-by-philip-e-tetlock-and-dan-gardner/",
      },
      {
        name: "The Signal and the Noise",
        author: "Nate Silver",
        url: "https://www.penguin.co.uk/books/195518/the-signal-and-the-noise-by-silver-nate/9780141975658",
      },
    ],
  },
  {
    category: "Soccer Analytics",
    items: [
      {
        name: "How to Win the Premier League",
        author: "Ian Graham",
        url: "https://www.penguin.co.uk/books/462193/how-to-win-the-premier-league-by-graham-ian/9781529934632",
      },
      {
        name: "Expected Goals",
        author: "Rory Smith",
        url: "https://harpercollins.co.uk/products/expected-goals-the-story-of-how-data-conquered-football-and-changed-the-game-forever-rory-smith",
      },
      {
        name: "Soccernomics",
        author: "Kuper & Szymanski",
        url: "https://www.hachettebookgroup.com/titles/simon-kuper/soccernomics-2022-world-cup-edition/9781645030171/",
      },
      {
        name: "Soccermatics",
        author: "David Sumpter",
        url: "https://www.bloomsbury.com/uk/soccermatics-9781472924148/",
      },
      {
        name: "Football Hackers",
        author: "Christoph Biermann",
        url: "https://www.ipgbook.com/football-hackers-products-9781788702058.php",
      },
      {
        name: "The Numbers Game",
        author: "Anderson & Sally",
        url: "https://www.penguin.co.uk/books/187604/the-numbers-game-by-sally-chris-anderson-and-david/9780241963623",
      },
      {
        name: "Net Gains",
        author: "Ryan O\u0027Hanlon",
        url: "https://www.abramsbooks.com/product/net-gains_9781419758911/",
      },
      {
        name: "Data Game",
        author: "Josh Williams",
        url: "https://www.pitchpublishing.co.uk/shop/data-game",
      },
    ],
  },
  {
    category: "Tactics",
    items: [
      {
        name: "Inverting The Pyramid",
        author: "Jonathan Wilson",
        url: "https://www.hachettebookgroup.com/titles/jonathan-wilson/inverting-the-pyramid/9781568589268/",
      },
      {
        name: "Zonal Marking",
        author: "Michael Cox",
        url: "https://www.hachettebookgroup.com/titles/michael-w-cox/zonal-marking/9781568589336/",
      },
      {
        name: "The Mixer",
        author: "Michael Cox",
        url: "https://harpercollins.co.uk/products/the-mixer-the-story-of-premier-league-tactics-from-route-one-to-false-nines-michael-cox",
      },
    ],
  },
  {
    category: "Other Sports & Data Visualization",
    items: [
      {
        name: "Sprawlball",
        author: "Kirk Goldsberry",
        url: "https://www.harpercollins.com/products/sprawlball-kirk-goldsberry",
      },
      {
        name: "Basketball on Paper",
        author: "Dean Oliver",
        url: "https://www.nebraskapress.unl.edu/potomac-books/9781574886887/",
      },
      {
        name: "Sports Analytics: A Guide for Decision Makers",
        author: "Alamar & Oliver",
        url: "https://cup.columbia.edu/book/sports-analytics/9780231205207",
      },
      {
        name: "Storytelling with Data",
        author: "Cole Nussbaumer Knaflic",
        url: "https://www.wiley.com/en-be/Storytelling+with+Data%3A+A+Data+Visualization+Guide+for+Business+Professionals-p-9781119002253",
      },
    ],
  },
];

const conferences = [
  {
    name: "MIT Sloan Sports Analytics Conference",
    url: "https://www.sloansportsconference.com",
    desc: "The premier sports analytics conference. Annual event at MIT with research presentations, panels, and networking.",
  },
  {
    name: "BARSA (Barca Sports Analytics Summit)",
    url: "https://bfrcs.com",
    desc: "Annual conference organized by FC Barcelona's analytics department. Focus on football analytics research.",
  },
  {
    name: "StatsBomb Conference",
    url: "https://statsbomb.com/events/",
    desc: "Annual football analytics conference by StatsBomb. Mix of industry and academic presentations.",
  },
  {
    name: "OptaPro Analytics Forum",
    url: "https://www.statsperform.com/opta-forum/",
    desc: "Annual analytics forum by Stats Perform (Opta). Focus on cutting-edge football analytics.",
  },
  {
    name: "CMSAC (Carnegie Mellon Sports Analytics Conference)",
    url: "https://www.stat.cmu.edu/cmsac/",
    desc: "Student-organized conference at Carnegie Mellon focused on reproducible sports analytics research.",
  },
];

/* ─── Page ─── */
export default function MiscellaneousPage() {
  return (
    <div>
      {/* Header */}
      <section className="bg-navy px-4 py-14 text-white">
        <div className="mx-auto max-w-5xl">
          <h1 className="mb-3 text-3xl font-bold">Miscellaneous</h1>
          <p className="max-w-2xl text-lg text-gray-300">
            Books, learning resources, career advice, annual reviews, and
            conferences. For datasets, scrapers, and libraries, see{" "}
            <Link
              href="/data"
              className="font-medium text-white hover:underline"
            >
              Resources
            </Link>
            .
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-4 py-10">
        {/* Books */}
        <section className="mb-14">
          <h2 className="mb-1 text-xl font-bold text-navy">
            Recommended Books
          </h2>
          <p className="mb-5 text-sm text-gray-500">
            Essential reading for sports analytics, tactics, decision-making, and
            data visualization.
          </p>
          <div className="space-y-8">
            {books.map((group) => (
              <div key={group.category}>
                <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-orange">
                  {group.category}
                </h3>
                <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                  {group.items.map((book) => (
                    <a
                      key={book.name}
                      href={book.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-start gap-3 rounded-lg border border-gray-200 bg-white p-4 transition-all hover:border-orange/40 hover:shadow-md"
                    >
                      <div className="mt-0.5 text-lg text-gray-300 group-hover:text-orange transition-colors">
                        {"\u{1F4D6}"}
                      </div>
                      <div>
                        <div className="font-medium text-navy group-hover:text-orange transition-colors">
                          {book.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          {book.author}
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Learning Resources */}
        <section className="mb-14">
          <h2 className="mb-1 text-xl font-bold text-navy">
            Learning Resources
          </h2>
          <p className="mb-5 text-sm text-gray-500">
            Guides, handbooks, tutorials, and curated collections to get started
            with sports analytics.
          </p>
          <div className="grid gap-4 md:grid-cols-2">
            {learningResources.map((r) => (
              <a
                key={r.name}
                href={r.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group block rounded-xl border border-gray-200 bg-white p-5 transition-all hover:border-orange/40 hover:shadow-md"
              >
                <div className="mb-1 flex items-start justify-between gap-2">
                  <h3 className="font-semibold text-navy group-hover:text-orange transition-colors">
                    {r.name}
                  </h3>
                  <span className="shrink-0 text-xs text-gray-400 group-hover:text-orange transition-colors">
                    &#8599;
                  </span>
                </div>
                <p className="text-sm text-gray-600">{r.desc}</p>
              </a>
            ))}
          </div>
        </section>

        {/* Annual Reviews */}
        <section className="mb-14">
          <h2 className="mb-1 text-xl font-bold text-navy">
            Jan Van Haaren&apos;s Annual Soccer Analytics Reviews
          </h2>
          <p className="mb-5 text-sm text-gray-500">
            Comprehensive yearly surveys of all soccer analytics research. These
            reviews serve as a key validation dataset for our AI paper
            classifier.
          </p>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {annualReviews.map((r) => (
              <a
                key={r.year}
                href={r.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-4 transition-all hover:border-orange/40 hover:shadow-md"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-navy text-sm font-bold text-white group-hover:bg-orange transition-colors">
                  {r.year}
                </div>
                <div>
                  <div className="font-medium text-navy group-hover:text-orange transition-colors">
                    {r.name}
                  </div>
                  <div className="text-xs text-gray-500">
                    Jan Van Haaren &middot; KU Leuven
                  </div>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* Career Advice */}
        <section className="mb-14">
          <h2 className="mb-1 text-xl font-bold text-navy">Career Advice</h2>
          <p className="mb-5 text-sm text-gray-500">
            Guides and perspectives on building a career in sports analytics.
          </p>
          <div className="grid gap-4 md:grid-cols-2">
            {careerAdvice.map((r) => (
              <a
                key={r.name}
                href={r.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group block rounded-xl border border-gray-200 bg-white p-5 transition-all hover:border-orange/40 hover:shadow-md"
              >
                <div className="mb-1 flex items-start justify-between gap-2">
                  <h3 className="font-semibold text-navy group-hover:text-orange transition-colors">
                    {r.name}
                  </h3>
                  <span className="shrink-0 text-xs text-gray-400 group-hover:text-orange transition-colors">
                    &#8599;
                  </span>
                </div>
                <p className="text-sm text-gray-600">{r.desc}</p>
              </a>
            ))}
          </div>
        </section>

        {/* Conferences */}
        <section className="mb-14">
          <h2 className="mb-1 text-xl font-bold text-navy">
            Conferences &amp; Events
          </h2>
          <p className="mb-5 text-sm text-gray-500">
            Key conferences and events in the sports analytics community.
          </p>
          <div className="grid gap-4 md:grid-cols-2">
            {conferences.map((r) => (
              <a
                key={r.name}
                href={r.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group block rounded-xl border border-gray-200 bg-white p-5 transition-all hover:border-orange/40 hover:shadow-md"
              >
                <div className="mb-1 flex items-start justify-between gap-2">
                  <h3 className="font-semibold text-navy group-hover:text-orange transition-colors">
                    {r.name}
                  </h3>
                  <span className="shrink-0 text-xs text-gray-400 group-hover:text-orange transition-colors">
                    &#8599;
                  </span>
                </div>
                <p className="text-sm text-gray-600">{r.desc}</p>
              </a>
            ))}
          </div>
        </section>

        {/* Back to Resources */}
        <div className="text-center">
          <Link
            href="/data"
            className="inline-block rounded-lg bg-navy px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-navy/90"
          >
            &larr; Back to Resources (Datasets, Scrapers, Libraries, APIs)
          </Link>
        </div>
      </div>
    </div>
  );
}
