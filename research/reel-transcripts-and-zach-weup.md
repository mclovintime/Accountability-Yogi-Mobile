# Getting transcripts of Instagram reels, and a first look at @zach_weup

**Date:** October 9, 2026
**Follows on from:** [gbp-subcontracting-home-services.md](gbp-subcontracting-home-services.md)

---

## Part 1: How to get transcripts of Instagram reels

**Short answer:** Instagram has no transcript export. The reliable route is to **download each reel's audio and run it through Whisper**, OpenAI's free, open-source speech-to-text model. The script in this repo does that for you: [`tools/ig_transcribe.py`](tools/ig_transcribe.py).

### Options, best first

| Option | Effort | Cost | Good for | Catch |
|---|---|---|---|---|
| **1. `tools/ig_transcribe.py`** (yt-dlp downloads, faster-whisper transcribes) | 10 minutes of setup | Free | Batches of reels; accurate English | Run it on your own computer. Instagram usually needs you logged in (it reads cookies from your browser). Feed it reel links, because yt-dlp's whole-profile download is currently marked **broken**. |
| **2. Apify "Instagram transcript" scrapers** ([one](https://apify.com/crawlerbros/instagram-transcript-scraper), [another](https://apify.com/firsthand/instagram-reel-transcripts)) | No code; paste a profile or reel URL | Pay per result (cents) | A whole profile in one go, exported as CSV or JSON | A third-party service; quality varies. They use Instagram's own captions where available and fall back to Whisper. |
| **3. Check YouTube and TikTok first** | 1 minute | Free | Creators who cross-post | YouTube shows a built-in **"Show transcript"** button under the description on most videos. If he posts there too, start there. |
| **4. Screen-record on your phone, then upload** to a transcription site (TurboScribe, Otter, Descript and similar) | Manual, about 1 minute a reel | Free tiers | A handful of reels | Doesn't scale. |
| **5. Instagram's own auto-captions** (Settings → Accessibility → Captions) | None | Free | Reading along while you watch | **Shown on screen only; there's no copy or export.** |
| [clipscribe](https://pypi.org/project/clipscribe/) (a ready-made Python tool) | pip install | Free | Same idea as option 1 | Defaults to the "tiny" Whisper model, which is less accurate. Raise it. |

### Running the script (on your Mac or PC)
```bash
python3 -m pip install -U yt-dlp faster-whisper     # also needs ffmpeg installed
# put reel links in urls.txt, one per line (in the app: reel → Share → Copy link)
python3 research/tools/ig_transcribe.py urls.txt --browser chrome
```
- **What you get:** `transcripts/ALL.md`, which holds each reel's date, views, caption and full transcript. Paste it here, or commit it to this repo, and I'll pull out the playbook.
- **Default model:** "small." Use `--model medium` for better accuracy if your computer can handle it. If the speaker might not be speaking English, use `--language auto`.
- **Testing so far:** I tested the script here with a sample video and a stand-in for the speech model. Downloading, converting audio, writing the Markdown and skipping finished reels all work. Instagram itself and the Whisper model downloads are blocked from this cloud sandbox, so **the first real run will be yours**.
- **If a download fails:** errors like "login required" or "rate-limit" usually mean you should add `--browser` or update yt-dlp.

### Rules of the road
- **Instagram's terms prohibit automated scraping**, so keep the volume personal: dozens of reels, not thousands.
- **His videos are his copyrighted content.** Transcribing them for your own notes is fine; don't republish them.
- **Don't put your Instagram login cookies into a cloud sandbox** (including this one). Run the script locally.

---

## Part 2: What @zach_weup actually appears to be doing

### What his profile says (from your screenshot)
- **Display name:** "Zach P – Local SEO & Google Business Expert." **Verified, 17.2K followers, 202 posts.**
- **Bio:**
  - "I rank Businesses, doing $250k+/yr, higher on Google"
  - "Generated $10M+ organically from Google"
  - "DM 'SEO' to work with me"
  - Link to **skool.com/gmb**, a Skool community, which is a membership-community platform often used to sell coaching.
- **Story highlights:**
  - **"Landscape…"**
  - **"Client Wins"**: a Spanish-language client message saying they now have two projects of about $20k and about $10k.
  - **"Testimonials."**
- **Profile photo:** on a Bobcat skid steer, which signals contractor and landscaping roots or affinity.
- **Reel hooks:**
  - "Make more money from Google SEO for free… add an additional $20k+ per month"
  - "Rank Higher on Google Fast for more free leads… Building local citations"
  - "Rank Higher on Google in 20 seconds"
- **Views:** about 2.6K–8.6K per reel.

### What that suggests
- **He sells SEO to contractors. He isn't brokering their jobs.** "I rank businesses doing $250k+/yr" plus "DM to work with me" is a **local-SEO agency and coaching** model, aimed at existing landscapers and contractors. The highlight shows one of *his clients* landing $20k and $10k jobs, which suggests he's ranking *their* real profiles.
  - That's **Option 3 ("a marketing agency for contractors") in the main report.** It's the cleanest way to cash in on the "most contractors are bad at Google" insight.
  - It is **not** the "several profiles plus subcontract everything" model, at least from what's visible.
  - The transcripts will settle it: does he ever say he runs his own leads or brands?
- **"Generated $10M+ organically from Google" is self-reported and ambiguous.** It almost certainly means revenue his *clients* attribute to his SEO, not his own income. It can't be verified, and nobody audits claims like this.
- **The DM-keyword plus Skool funnel** is the standard 2024–2026 creator-agency setup. The free reels are top-of-funnel marketing; the full method sits behind a sales call or a paid community. Expect the reels to give real but partial tactics.
- **The tactics on the covers are mainstream and legit.** Citations (consistent name, address and phone across directories), profile optimization and ranking-performance screenshots are standard local SEO and in line with Google's rules.

### What I couldn't verify
- **No independent footprint.** I found no press, no independent reviews, and no forum discussion of "zach_weup," "Zach P" or skool.com/gmb.
- **Blocked from here:** Instagram, Skool, TikTok and YouTube can't be reached from this sandbox, so I couldn't see his community's price, member count or his own content.
- **Possible business name, unconfirmed:** a LinkedIn listing for a "WEUP Marketing/Consulting" in Orem, Utah matches the handle. It **may be his agency, but I couldn't confirm it.**

### What to listen for in his reels
1. **Does he run his own home-service business or lead-gen brands, or only clients'?** If he mentions his own, look up its Google profile. Do the address and reviews look real?
2. **Red-flag tactics:**
   - keywords stuffed into business names that don't match the real brand;
   - virtual offices or extra addresses to "rank in more cities";
   - multiple profiles for one business;
   - review incentives, or asking only happy customers for reviews (review gating);
   - "rank in 20 seconds"-style hacks.

   Any of these is the risky material covered in §3–§5 of the main report.
3. **Green-flag tactics:**
   - primary category choice;
   - service and suburb pages on the website;
   - citations;
   - photo and post cadence;
   - systems for asking *every* customer for a review;
   - replying to reviews.
4. **If you're considering paying him:**
   - Ask for 2–3 client profiles you can look up yourself, and check their review counts and rankings.
   - Find out what's free and what's paid in the Skool community, and what the price is.
   - Discount the revenue claims.

### Next step
Get 20–40 of his reels through the script (the most-viewed ones first) and drop `ALL.md` into this repo or the chat. I'll:
- turn them into a step-by-step playbook;
- flag each tactic as **legit / gray / against Google's rules**, based on the main report;
- note where it fits a marketing-partner or agency path versus the general-contractor path.
