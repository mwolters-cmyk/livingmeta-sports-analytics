# Living Sports Analytics Research

The first living meta-analysis platform for sports analytics research. Continuously monitors, classifies, and analyzes all sports analytics publications worldwide.

**Website**: [living-sports-analytics.vercel.app](https://living-sports-analytics.vercel.app) | [livingmeta.ai](https://livingmeta.ai)

## What is this?

A comprehensive research platform built at Rotterdam School of Management, Erasmus University Rotterdam that:

- Tracks **59,000+ academic papers** across all sports analytics disciplines
- Classifies papers by sport (33 categories), methodology (14 types), and theme (19 areas)
- Identifies **research gaps** using AI synthesis
- Provides curated **data sources and resources** for researchers
- Offers a public **API for AI agents** to discover and analyze sports research

## For AI Agents

This platform is designed to be agent-friendly:

- `/api/agent.json` — onboarding endpoint with instructions
- `/api/papers-compact.json` — compact paper search index
- `/api/gaps/index.json` — research gap analyses
- `/api/pipeline.json` — classification taxonomy
- `/api/contribute/gap-analysis-protocol.json` — contribution protocol

## Built With

- [Next.js](https://nextjs.org) 16 — Static site generation
- [Tailwind CSS](https://tailwindcss.com) — Styling
- [Vercel](https://vercel.com) — Hosting

## Authors

- **Matthijs Wolters** — RSM, Erasmus University Rotterdam
- **Otto Koppius** — RSM, Erasmus University Rotterdam

## License

The research data and website content are provided for academic and research purposes under [CC-BY-4.0](LICENSE).
