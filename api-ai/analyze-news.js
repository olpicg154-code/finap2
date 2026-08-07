name: FinAP News Auto Update

on:
  schedule:
    - cron: "0 */6 * * *"
  workflow_dispatch:

permissions:
  contents: write

jobs:
  update-news:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 24

      - name: Install dependencies
        run: npm install

      - name: Run FinAP Engine
        run: node js/news-engine.js

      - name: Add AI analysis
        run: node api-ai/analyze-news.js

      - name: Save updated news
        run: |
          git config --global user.name "FinAP Bot"
          git config --global user.email "bot@finap.com.ua"
          git add data/news.json
          git commit -m "auto update news" || exit 0
          git push