"""Read the dashboard's official sources and retain an evidence snapshot.

This is a discovery check. A successful HTTP response never updates a vehicle's
verification date; additions and changed specifications need manual review.
"""
import concurrent.futures
import html
import json
import re
import sys
import time
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PATTERN = re.compile(r'"([^"\n]+)"\s*:\s*\{name\s*:\s*"([^"]+)",\s*url\s*:\s*"([^"]+)"\}')


def fetch(source):
    key, name, url = source
    result = {"id": key, "name": name, "url": url}
    started = time.monotonic()
    try:
        response = subprocess.run(["curl", "-L", "--max-time", "20", "-sS", "-A", "Mozilla/5.0", "-w", "\nAUDIT_META:%{http_code} %{url_effective}", url], capture_output=True, timeout=24)
        body, metadata = response.stdout.decode("utf-8", errors="replace").rsplit("\nAUDIT_META:", 1)
        status, final_url = metadata.split(" ", 1)
        result.update(status=int(status), finalUrl=final_url)
        if response.returncode or int(status) >= 400:
            raise RuntimeError(response.stderr.decode(errors="replace") or f"HTTP {status}")
        title = re.search(r"<title[^>]*>(.*?)</title>", body, re.I | re.S)
        result["title"] = html.unescape(title[1]).strip() if title else ""
        plain = re.sub(r"<(script|style)\b[^>]*>.*?</\1>", " ", body, flags=re.I | re.S)
        result["text"] = re.sub(r"\s+", " ", html.unescape(re.sub(r"<[^>]+>", " ", plain))).strip()[:100_000]
        result["links"] = list(dict.fromkeys(html.unescape(link) for link in re.findall(r'href=[\"\']([^\"\']+)', body)))[:400]
        result["readable"] = len(result["text"]) > 200 and not re.search(r"Just a moment|Access Denied|Request Rejected", result["title"], re.I)
    except Exception as error:
        result.update(status=result.get("status", getattr(error, "code", None)), error=str(error), readable=False)
    result["seconds"] = round(time.monotonic() - started, 1)
    return result


def main():
    sources = {}
    for path in [ROOT / "app/dashboard.tsx", ROOT / "app/strategic-market-data.ts", ROOT / "app/market-refresh-data.ts"]:
        if path.exists():
            for key, name, url in PATTERN.findall(path.read_text()):
                sources[key] = (key, name, url)
    requested = set(sys.argv[2:])
    selected = [source for source in sources.values() if not requested or source[0] in requested]
    results = []
    with concurrent.futures.ThreadPoolExecutor(max_workers=10) as pool:
        for result in pool.map(fetch, selected):
            results.append(result)
            print(f'{result["id"]}: {result.get("status")} readable={result["readable"]} {result.get("title", result.get("error", ""))[:80]}', flush=True)
    Path(sys.argv[1]).write_text(json.dumps({"checkedAt": "2026-10-01", "sources": results}, ensure_ascii=False, indent=2))
    print(f"Checked {len(results)} sources; readable {sum(row['readable'] for row in results)}.", flush=True)


if __name__ == "__main__":
    main()
