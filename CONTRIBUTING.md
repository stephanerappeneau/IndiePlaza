# Contributing

Thanks for your interest in contributing to the Indie Plaza Revenue Planner.

## Run locally

```bash
git clone https://github.com/ACCOUNT/REPO.git
cd REPO
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project structure

```
src/
  data/
    simulator_params.json   # all simulator presets and default values
  components/
    revenues-planner/       # all planner UI and chart components
  pages/
    index.tsx               # landing page + embedded planner
    tools/revenues-planner  # standalone planner page
    tools/publisher-quest   # publisher quest iframe
    about/                  # team page
```

## Update simulator parameters

All default values and presets live in `src/data/simulator_params.json`. You can edit:

- `buzzCurvePresets` — launch buzz decay curves
- `wishlistPresets` — wishlist growth scenarios
- `discountStrategyPresets` — discount timing and depth
- `playerReviews` — review score options
- `conversionRateTable` — wishlist to sales conversion rates

No backend needed, changes take effect immediately on next build.

## Submitting changes

1. Fork the repo
2. Create a branch: `git checkout -b my-change`
3. Make your changes
4. Open a pull request against `main`

Please keep PRs focused on a single change. For large features open an issue first to discuss.
