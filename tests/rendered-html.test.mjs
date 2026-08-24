import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders the four-region strategic-market dashboard", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>东风集团主要战略市场竞品车型看板/);
  assert.match(html, /<h1>主要战略市场/);
  assert.match(html, /集团覆盖密度/);
  assert.match(html, /DONGFENG/);
  assert.match(html, /LEAPMOTOR/);
  assert.match(html, /CHANGAN/);
  assert.match(html, /东风集团/);
  assert.match(html, /秘鲁/);
  assert.match(html, /欧洲/);
  assert.match(html, /匈牙利/);
  assert.match(html, /澳大利亚/);
  assert.match(html, /泰国/);
  assert.match(html, /XPENG/);
  assert.match(html, /NIO/);
  assert.match(html, /驱动/);
  assert.match(html, /覆盖密度大区选择/);
  assert.match(html, /南美<!-- --> · 集团覆盖密度/);
  assert.match(html, /单一品牌车型投放规模/);
  assert.match(html, /全市场 · 单一品牌车型投放规模/);
  assert.match(html, /不随上方大区选择变化/);
  assert.match(html, /相同车型的多个动力形式只计 1 款/);
});

test("keeps expanded group data, region filters, and official source links in source", async () => {
  const [page, css, layout, strategic] = await Promise.all([
    readFile(new URL("../app/dashboard.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/strategic-market-data.ts", import.meta.url), "utf8"),
  ]);

  assert.match(page, /"东风集团":\["Dongfeng","VOYAH"\]/);
  assert.match(page, /"Leapmotor集团":\["Leapmotor"\]/);
  assert.match(page, /"Changan集团":\["Changan","Deepal","AVATR"\]/);
  assert.match(page, /"XPENG集团":\["XPENG"\]/);
  assert.match(page, /"NIO集团":\["NIO","firefly"\]/);
  assert.match(page, /"GWM集团":\["GWM"\]/);
  assert.doesNotMatch(page, /"GWM集团":\["GWM","WEY"\]/);
  assert.match(page, /GWM集团\|GWM\|WEY 07/);
  assert.match(page, /东风集团\|Dongfeng\|BOX/);
  assert.match(page, /东风集团\|Dongfeng\|Mage EV/);
  assert.match(page, /dongfeng\.ec/);
  assert.match(page, /Leapmotor集团\|Leapmotor\|C10/);
  assert.match(page, /Changan集团\|Deepal\|Deepal S07/);
  assert.match(page, /"全部驱动","前驱","后驱","四驱"/);
  assert.match(page, /"全部能源","纯电","插混","增程","混动","燃油"/);
  assert.match(page, /"全部区域",\.\.\.regionCountries\.map/);
  assert.match(page, /coverageRegion,setCoverageRegion\]=useState\("南美"\)/);
  assert.match(page, /coverageCountries=countries\.filter/);
  assert.match(page, /className="coverageRegions"/);
  assert.match(page, /modelIdentityAliases/);
  assert.match(page, /Dolphin Mini":"BYD Seagull family/);
  assert.match(page, /Yuan Plus":"BYD Atto 3 \/ Yuan Plus/);
  assert.match(page, /Song Plus":"BYD Song Plus \/ Seal U \/ Sealion 6/);
  assert.match(page, /new Set\(cars\.filter/);
  assert.match(page, /className="brandFootprint"/);
  assert.match(page, /cars\.filter\(c=>c\.brand===item\.brand\)/);
  assert.match(page, /setRegion\("全部区域"\);setCountry\("全部市场"\)/);
  assert.doesNotMatch(page, /coverageCountryNames/);
  assert.doesNotMatch(page, /"--heat"/);
  assert.match(page, /DONGFENG/);
  assert.match(css, /repeat\(9,1fr\)/);
  assert.match(css, /--ink:#22272c/);
  assert.match(css, /--paper:#eeeeee/);
  assert.match(css, /--panel:#ffffff/);
  assert.match(css, /--primary:#009c9d/);
  assert.match(css, /--aqua:#4cc9c5/);
  assert.match(css, /--acid:#ffbb00/);
  assert.match(css, /--line:#dcdddd/);
  assert.doesNotMatch(css, /--acid:#8b5e3c/);
  assert.match(css, /\.heroStrategy,\.coverage\{background:var\(--paper\)/);
  assert.match(layout, /南美、欧洲、澳新与东南亚 25 个重点国家/);
  assert.match(strategic, /\{ name: "欧洲"[^\n]+\["匈牙利","🇭🇺"\]/);
  assert.match(strategic, /\{ name: "澳新"[^\n]+\["澳大利亚","🇦🇺"\],\["新西兰","🇳🇿"\]/);
  assert.doesNotMatch(strategic, /\{ name: "澳新"[^\n]+匈牙利/);
  assert.match(strategic, /"XPENG集团"/);
  assert.match(strategic, /"NIO集团"/);
});
