#!/usr/bin/env python3
"""Transcribe Instagram reels (or any yt-dlp-supported video URL) to Markdown.

Run this on your own computer, not in the cloud sandbox (Instagram is blocked there).

Setup (once):
    python3 -m pip install -U yt-dlp faster-whisper
    # ffmpeg must be on PATH: `brew install ffmpeg` (Mac) / `winget install ffmpeg` (Windows)

Usage:
    # 1. Put one reel URL per line in urls.txt (on the phone: reel -> Share -> Copy link)
    # 2. Run, reading Instagram cookies from a browser you're logged into:
    python3 ig_transcribe.py urls.txt --browser chrome
    # or pass URLs directly:
    python3 ig_transcribe.py https://www.instagram.com/reel/XXXX/ --browser firefox

Output goes to ./transcripts/: one <id>.md per reel plus ALL.md with everything combined,
ready to paste into Claude. Reels already transcribed are skipped on re-runs.

Notes:
    - yt-dlp's Instagram *profile* extractor is currently broken, so feed it individual
      reel URLs. To collect a whole profile's links, `gallery-dl` can list them, or copy
      them by hand.
    - Instagram rate-limits automated downloads and its terms prohibit scraping. Keep it
      to personal research volumes (dozens, not thousands) and don't republish transcripts.
"""

import argparse
import sys
from pathlib import Path

import yt_dlp
from faster_whisper import WhisperModel


def read_urls(inputs):
    urls = []
    for item in inputs:
        path = Path(item)
        if path.is_file():
            urls += [line.strip() for line in path.read_text().splitlines()
                     if line.strip() and not line.startswith("#")]
        else:
            urls.append(item)
    return urls


def download_audio(url, workdir, browser, cookies_file, already_done):
    opts = {
        "format": "bestaudio/best",
        "outtmpl": str(workdir / "%(id)s.%(ext)s"),
        "postprocessors": [{"key": "FFmpegExtractAudio", "preferredcodec": "mp3"}],
        "quiet": True,
        "noprogress": True,
        "no_warnings": True,
    }
    if browser:
        opts["cookiesfrombrowser"] = (browser,)
    if cookies_file:
        opts["cookiefile"] = cookies_file
    with yt_dlp.YoutubeDL(opts) as ydl:
        info = ydl.extract_info(url, download=False)
        if already_done(info["id"]):
            return info, None
        info = ydl.process_ie_result(info, download=True)
    return info, workdir / f"{info['id']}.mp3"


def format_date(yyyymmdd):
    if not yyyymmdd or len(yyyymmdd) != 8:
        return "unknown"
    return f"{yyyymmdd[:4]}-{yyyymmdd[4:6]}-{yyyymmdd[6:]}"


def to_markdown(url, info, transcript):
    caption = (info.get("description") or "").strip() or "(no caption)"
    return "\n".join([
        f"## {info.get('uploader') or info.get('channel') or 'unknown'} — {format_date(info.get('upload_date'))}",
        "",
        f"- URL: {url}",
        f"- Views: {info.get('view_count', 'n/a')} · Likes: {info.get('like_count', 'n/a')} · "
        f"Length: {round(info.get('duration') or 0)}s",
        "",
        "**Caption:**",
        "",
        caption,
        "",
        "**Transcript:**",
        "",
        transcript or "(no speech detected)",
        "",
    ])


def main():
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("inputs", nargs="+", help="Reel URLs and/or text files with one URL per line")
    parser.add_argument("--browser", help="Read login cookies from this browser (chrome, firefox, safari, edge, brave)")
    parser.add_argument("--cookies", help="Path to a Netscape-format cookies.txt instead of --browser")
    parser.add_argument("--model", default="small",
                        help="Whisper model: tiny, base, small (default), medium, large-v3. Bigger = slower, more accurate")
    parser.add_argument("--language", default="en", help="Spoken language code, or 'auto' to detect (default: en)")
    parser.add_argument("--out", default="transcripts", help="Output folder (default: ./transcripts)")
    args = parser.parse_args()

    out = Path(args.out)
    audio_dir = out / "audio"
    audio_dir.mkdir(parents=True, exist_ok=True)

    urls = read_urls(args.inputs)
    if not urls:
        sys.exit("No URLs given.")

    print(f"Loading Whisper model '{args.model}' (first run downloads it)...")
    model = WhisperModel(args.model, device="auto", compute_type="default")
    language = None if args.language == "auto" else args.language

    done = failed = 0
    for i, url in enumerate(urls, 1):
        print(f"[{i}/{len(urls)}] {url}")
        try:
            info, audio_path = download_audio(url, audio_dir, args.browser, args.cookies,
                                              lambda reel_id: (out / f"{reel_id}.md").exists())
            md_path = out / f"{info['id']}.md"
            if audio_path is None:
                print("  already transcribed, skipping")
                continue
            segments, _ = model.transcribe(str(audio_path), language=language, vad_filter=True)
            transcript = " ".join(segment.text.strip() for segment in segments)
            md_path.write_text(to_markdown(url, info, transcript))
            done += 1
            print(f"  -> {md_path}")
        except Exception as error:  # keep going; one bad reel shouldn't stop the batch
            failed += 1
            print(f"  FAILED: {error}")

    parts = sorted(p for p in out.glob("*.md") if p.name != "ALL.md")
    (out / "ALL.md").write_text("\n---\n\n".join(p.read_text() for p in parts))
    print(f"\nDone: {done} new, {failed} failed. Combined file: {out / 'ALL.md'}")
    if failed:
        print("If downloads fail with 'login required' or 'rate-limit', pass --browser with a browser "
              "you're logged into Instagram on, update yt-dlp (pip install -U yt-dlp), or slow down.")


if __name__ == "__main__":
    main()
