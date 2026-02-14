"use client";

import Link from "next/link";
import { useState } from "react";

/* ─── Types ─── */
type Resource = {
  name: string;
  url: string;
  desc: string;
  onPlatform?: string; // if we already have this data
};

type Category = {
  id: string;
  title: string;
  desc: string;
  items: Resource[];
};

/* ─── Data ─── */

const datasets: Category = {
  id: "datasets",
  title: "Open Datasets",
  desc: "Publicly available sports data — event data, tracking data, and match results.",
  items: [
    {
      name: "StatsBomb Open Data",
      url: "https://github.com/statsbomb/open-data",
      desc: "Event data and 360 tracking data for domestic leagues and international tournaments. Includes men\u0027s and women\u0027s competitions.",
      onPlatform:
        "We have StatsBomb data for 624 women\u0027s matches in our database.",
    },
    {
      name: "Wyscout Match Event Dataset",
      url: "https://figshare.com/collections/Soccer_match_event_dataset/4415000",
      desc: "World Cup 2018, Euro 2016, and top-5 league match event data with accompanying research paper by Pappalardo et al.",
    },
    {
      name: "SkillCorner Open Data",
      url: "https://github.com/SkillCorner/opendata",
      desc: "Broadcast tracking data for the Australian A-League 2024/2025 season.",
    },
    {
      name: "Metrica Sports Sample Data",
      url: "https://github.com/metrica-sports/sample-data",
      desc: "Broadcast tracking and event data for anonymized sample matches. Useful for learning tracking data analysis.",
    },
  ],
};

const statsbombFree: Category = {
  id: "statsbomb-free",
  title: "StatsBomb Free Data Releases",
  desc: "Individual tournament and team datasets released by StatsBomb/Hudl. All accessible via the StatsBomb Open Data repository or statsbombpy.",
  items: [
    // International tournaments
    {
      name: "FIFA Men\u0027s World Cup 2022",
      url: "https://blogarchive.statsbomb.com/news/statsbomb-release-free-2022-world-cup-data/",
      desc: "64 matches with events and 360 data.",
    },
    {
      name: "FIFA Men\u0027s World Cup 2018",
      url: "https://blogarchive.statsbomb.com/news/statsbomb-release-free-fifa-world-cup-data/",
      desc: "64 matches with events.",
    },
    {
      name: "UEFA Men\u0027s EURO 2024",
      url: "https://blogarchive.statsbomb.com/news/statsbomb-release-free-euro-2024-data/",
      desc: "51 matches with events and 360 data.",
    },
    {
      name: "UEFA Men\u0027s EURO 2020",
      url: "https://blogarchive.statsbomb.com/news/statsbomb-announce-the-release-of-free-statsbomb-360-data-euro-2020-available-now/",
      desc: "51 matches with events and 360 data.",
    },
    {
      name: "CONMEBOL Copa Am\u00e9rica 2024",
      url: "https://blogarchive.statsbomb.com/news/statsbomb-release-free-copa-america-2024-data/",
      desc: "32 matches with events.",
    },
    {
      name: "CAF Africa Cup of Nations 2023",
      url: "https://blogarchive.statsbomb.com/news/statsbomb-release-free-2023-african-cup-of-nations-data/",
      desc: "52 matches with events.",
    },
    // Women's tournaments
    {
      name: "FIFA Women\u0027s World Cup 2023",
      url: "https://blogarchive.statsbomb.com/news/statsbomb-release-free-2023-womens-world-cup-data/",
      desc: "64 matches with events and 360 data.",
      onPlatform: "Included in our StatsBomb women\u0027s football dataset.",
    },
    {
      name: "UEFA Women\u0027s EURO 2025",
      url: "https://www.hudl.com/blog/hudl-statsbomb-free-euro-2025-data",
      desc: "31 matches with events and 360 data.",
    },
    {
      name: "UEFA Women\u0027s EURO 2022",
      url: "https://www.hudl.com/blog/statsbomb-release-free-360-data-womens-euro-2022-available-now",
      desc: "31 matches with events and 360 data.",
      onPlatform: "Included in our StatsBomb women\u0027s football dataset.",
    },
    // League data
    {
      name: "Big 5 Leagues 2015/2016",
      url: "https://blogarchive.statsbomb.com/news/the-2015-16-big-5-leagues-free-data-release-premier-league/",
      desc: "Full season event data for Premier League, LaLiga, Bundesliga, Serie A, and Ligue 1 (1,823 matches total).",
    },
    {
      name: "Indian Super League 2020/2021",
      url: "https://blogarchive.statsbomb.com/news/statsbomb-announce-the-release-of-free-indian-super-league-data/",
      desc: "115 matches with events.",
    },
    {
      name: "Women\u0027s Super League 2018\u20132021",
      url: "https://blogarchive.statsbomb.com/news/statsbomb-release-free-2020-21-fa-womens-super-league-data-updated-r-guide/",
      desc: "Three seasons (326 matches) of FA WSL event data.",
      onPlatform: "Included in our StatsBomb women\u0027s football dataset.",
    },
    // Team / player data
    {
      name: "Bayer Leverkusen 2023/2024",
      url: "https://www.hudl.com/blog/free-data-bayer-leverkusens-bundesliga",
      desc: "34 Bundesliga matches with events and 360 data from the unbeaten season.",
    },
    {
      name: "Arsenal 2003/2004 \u0022The Invincibles\u0022",
      url: "https://blogarchive.statsbomb.com/articles/soccer/the-invincibles-project-and-classics-data-pack-1/",
      desc: "38 Premier League matches with events, plus 15 Champions League finals.",
    },
    {
      name: "Lionel Messi Club Career",
      url: "https://blogarchive.statsbomb.com/articles/soccer/statsbomb-release-free-lionel-messi-data-psg-and-inter-miami/",
      desc: "Over 550 matches spanning Barcelona, PSG, and Inter Miami.",
    },
  ],
};

const pythonLibraries: Category = {
  id: "python",
  title: "Python Libraries for Sports Analytics",
  desc: "Open-source tools for loading, processing, and visualizing sports data.",
  items: [
    {
      name: "kloppy",
      url: "https://kloppy.pysport.org",
      desc: "Load event and tracking data from multiple providers (StatsBomb, Opta, Metrica, SkillCorner, etc.) into a standardized format.",
    },
    {
      name: "databallpy",
      url: "https://databallpy.readthedocs.io/en/latest/",
      desc: "Load, synchronize and analyze event and tracking data. Supports multiple data providers.",
    },
    {
      name: "socceraction",
      url: "https://socceraction.readthedocs.io/en/latest/",
      desc: "Load data and compute SPADL/Atomic-SPADL representations and action valuations (VAEP, xT). Developed at KU Leuven.",
    },
    {
      name: "floodlight",
      url: "https://floodlight.readthedocs.io/en/latest/",
      desc: "Compute geometric and kinematic metrics and metabolic power estimates from tracking data.",
    },
    {
      name: "statsbombpy",
      url: "https://github.com/statsbomb/statsbombpy",
      desc: "Official StatsBomb Python library. Load free and licensed event data into pandas DataFrames.",
    },
    {
      name: "soccerdata",
      url: "https://soccerdata.readthedocs.io/en/latest/",
      desc: "Gather football data from Club Elo, FBref, SoFIFA, and WhoScored.",
    },
    {
      name: "scraperfc",
      url: "https://scraperfc.readthedocs.io/en/latest/",
      desc: "Gather football data from SofaScore, Transfermarkt, and Understat.",
    },
    {
      name: "soccer_xg",
      url: "https://github.com/ML-KULeuven/soccer_xg",
      desc: "Train and analyze expected goals (xG) models. By the Machine Learning group at KU Leuven.",
    },
    {
      name: "penaltyblog",
      url: "https://github.com/martineastwood/penaltyblog",
      desc: "Estimate team abilities and predict match outcomes using various statistical models.",
    },
    {
      name: "mplsoccer",
      url: "https://mplsoccer.readthedocs.io/en/latest/",
      desc: "Create pitch plots, heatmaps, pass maps, shot maps, and other football visualizations with matplotlib.",
    },
    {
      name: "great_tables",
      url: "https://posit-dev.github.io/great-tables/articles/intro.html",
      desc: "Create publication-quality data tables in Python. Not sport-specific, but widely used for analytics output.",
    },
    {
      name: "football-data-analytics",
      url: "https://github.com/jakeyk11/football-data-analytics",
      desc: "Ready-made scripts for player, team, and match analyses by Jake Kluger.",
    },
    {
      name: "PySport",
      url: "https://pysport.org",
      desc: "Directory of open-source Python projects for sports analytics. Curated overview of the ecosystem.",
    },
  ],
};

const learningResources: Category = {
  id: "learning",
  title: "Learning Resources",
  desc: "Guides, handbooks, and curated collections to get started with sports analytics.",
  items: [
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
  ],
};

const annualReviews: Category = {
  id: "reviews",
  title: "Jan Van Haaren\u0027s Annual Soccer Analytics Reviews",
  desc: "Comprehensive yearly surveys of all soccer analytics research. These reviews are a key validation dataset for our AI classifier.",
  items: [
    {
      name: "Soccer Analytics Review 2025",
      url: "https://www.janvanhaaren.be/posts/soccer-analytics-review-2025/index.html",
      desc: "The most recent edition, covering publications from 2025.",
    },
    {
      name: "Soccer Analytics Review 2024",
      url: "https://www.janvanhaaren.be/posts/soccer-analytics-review-2024/index.html",
      desc: "Review of soccer analytics research published in 2024.",
    },
    {
      name: "Soccer Analytics Review 2023",
      url: "https://www.janvanhaaren.be/posts/soccer-analytics-review-2023/index.html",
      desc: "Review of soccer analytics research published in 2023.",
    },
    {
      name: "Soccer Analytics Review 2022",
      url: "https://www.janvanhaaren.be/posts/soccer-analytics-review-2022/index.html",
      desc: "Review of soccer analytics research published in 2022.",
    },
    {
      name: "Soccer Analytics Review 2021",
      url: "https://www.janvanhaaren.be/posts/soccer-analytics-review-2021/index.html",
      desc: "Review of soccer analytics research published in 2021.",
    },
    {
      name: "Soccer Analytics Review 2020",
      url: "https://www.janvanhaaren.be/posts/soccer-analytics-review-2020/index.html",
      desc: "Review of soccer analytics research published in 2020.",
    },
  ],
};

const careerAdvice: Category = {
  id: "career",
  title: "Career Advice",
  desc: "Guides and perspectives on building a career in sports analytics.",
  items: [
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
  ],
};

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

const allCategories: Category[] = [
  datasets,
  statsbombFree,
  pythonLibraries,
  learningResources,
  annualReviews,
  careerAdvice,
];

/* ─── Section nav ─── */
const sections = [
  { id: "datasets", label: "Open Datasets" },
  { id: "statsbomb-free", label: "StatsBomb Free" },
  { id: "python", label: "Python Libraries" },
  { id: "learning", label: "Learning" },
  { id: "reviews", label: "Annual Reviews" },
  { id: "career", label: "Career" },
  { id: "books", label: "Books" },
];

/* ─── Resource card ─── */
function ResourceCard({ r }: { r: Resource }) {
  return (
    <a
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
      <p className="mb-2 text-sm text-gray-600">{r.desc}</p>
      {r.onPlatform && (
        <div className="rounded-md bg-green-50 border border-green-200 px-2.5 py-1.5 text-xs text-green-700">
          <span className="font-medium">On this platform:</span>{" "}
          {r.onPlatform}
        </div>
      )}
    </a>
  );
}

/* ─── Main ─── */
export default function ResourcesPage() {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  return (
    <div>
      {/* Header */}
      <section className="bg-navy px-4 py-14 text-white">
        <div className="mx-auto max-w-5xl">
          <h1 className="mb-3 text-3xl font-bold">Resources</h1>
          <p className="mb-4 max-w-2xl text-lg text-gray-300">
            A curated collection of open datasets, Python libraries, learning
            resources, and books for sports analytics research.
          </p>
          <div className="rounded-lg border border-white/20 bg-white/10 p-4">
            <p className="text-sm text-gray-300">
              This collection is based on the excellent{" "}
              <a
                href="https://www.janvanhaaren.be/resources.html"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-orange hover:underline"
              >
                resources page
              </a>{" "}
              curated by{" "}
              <a
                href="https://www.janvanhaaren.be"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-white hover:underline"
              >
                Jan Van Haaren
              </a>{" "}
              (KU Leuven), who also writes the definitive{" "}
              <a
                href="#reviews"
                className="font-medium text-white hover:underline"
              >
                annual soccer analytics reviews
              </a>
              . We have extended his collection with links to data available on
              our platform and resources relevant to the broader sports
              analytics community.
            </p>
          </div>
        </div>
      </section>

      {/* Quick nav */}
      <div className="sticky top-[57px] z-40 border-b border-gray-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-5xl gap-1 overflow-x-auto px-4 py-2">
          {sections.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              onClick={() => setActiveSection(s.id)}
              className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                activeSection === s.id
                  ? "bg-navy text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-navy/10 hover:text-navy"
              }`}
            >
              {s.label}
            </a>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-10">
        {/* Linkable categories */}
        {allCategories.map((cat) => (
          <section key={cat.id} id={cat.id} className="mb-14">
            <h2 className="mb-1 text-xl font-bold text-navy">{cat.title}</h2>
            <p className="mb-5 text-sm text-gray-500">{cat.desc}</p>
            <div className="grid gap-4 md:grid-cols-2">
              {cat.items.map((r) => (
                <ResourceCard key={r.name} r={r} />
              ))}
            </div>
          </section>
        ))}

        {/* Books — different layout */}
        <section id="books" className="mb-14">
          <h2 className="mb-1 text-xl font-bold text-navy">
            Recommended Books
          </h2>
          <p className="mb-5 text-sm text-gray-500">
            Essential reading for sports analytics, tactics, decision-making,
            and data visualization.
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

        {/* Attribution + CTA */}
        <section className="rounded-xl border border-navy/20 bg-navy/5 p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div>
              <h3 className="mb-2 text-lg font-semibold text-navy">
                Acknowledgment
              </h3>
              <p className="max-w-lg text-sm text-gray-600">
                This resource collection builds on the work of{" "}
                <a
                  href="https://www.janvanhaaren.be"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-navy underline hover:text-orange"
                >
                  Jan Van Haaren
                </a>{" "}
                at KU Leuven. His{" "}
                <a
                  href="https://www.janvanhaaren.be/resources.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-navy underline hover:text-orange"
                >
                  original resources page
                </a>{" "}
                is the most comprehensive overview of soccer analytics tools
                available. His annual soccer analytics reviews (~200
                papers/year) serve as a key validation dataset for our AI paper
                classifier.
              </p>
            </div>
            <div className="flex shrink-0 flex-col gap-2">
              <a
                href="https://www.janvanhaaren.be/resources.html"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block rounded-lg border border-navy/30 bg-white px-4 py-2 text-center text-sm font-medium text-navy transition-colors hover:bg-navy hover:text-white"
              >
                Van Haaren&apos;s Resources
              </a>
              <Link
                href="/contribute"
                className="inline-block rounded-lg bg-orange px-4 py-2 text-center text-sm font-medium text-white transition-colors hover:bg-orange-light"
              >
                Contribute to Platform
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
