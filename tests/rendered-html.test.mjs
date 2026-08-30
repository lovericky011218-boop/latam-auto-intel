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
  assert.match(html, /车型动力记录数 · 点击柱条筛选/);
  assert.match(html, /按母集团筛选品牌/);
  assert.match(html, /全部母集团/);
  assert.match(html, /南美<!-- --> · 集团覆盖密度/);
  assert.match(html, /单一品牌车型投放规模/);
  assert.match(html, /全市场 · 单一品牌车型投放规模/);
  assert.match(html, /不随上方大区选择变化/);
  assert.match(html, /相同车型的多个动力形式只计 1 款/);
  assert.match(html, /车身形式构成/);
  assert.match(html, /车身形式与总车型数使用相同去重口径/);
  assert.match(html, /展开车身 \/ 尺寸 \/ 价格 \/ 动力 \/ 驱动 \/ 安全筛选/);
  assert.match(html, /价格：低 → 高/);
  assert.match(html, /销量：高 → 低/);
  assert.match(html, /销量：低 → 高/);
  assert.match(html, /续航：高 → 低/);
  assert.match(html, /MARKLINES 销量口径/);
  assert.match(html, /2024-01 至 2026-04/);
  assert.match(html, /上市时间（待补齐）/);
  assert.ok(html.indexOf('id="market-insights"') > html.indexOf('id="lineup"'));
  assert.ok(html.indexOf('id="market-insights"') > html.indexOf('class="salesMethodNote"'));
});

test("keeps expanded group data, region filters, and official source links in source", async () => {
  const [page, css, layout, strategic, salesData] = await Promise.all([
    readFile(new URL("../app/dashboard.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/strategic-market-data.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/marklines-sales-data.ts", import.meta.url), "utf8"),
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
  assert.match(page, /"全部车身","轿车","SUV","MPV","皮卡"/);
  assert.match(page, /const bodyTypeOf/);
  assert.match(page, /const carPriceValue/);
  assert.match(page, /const carRangeValue/);
  assert.match(page, /sortBy==="priceAsc"/);
  assert.match(page, /sortBy==="rangeAsc"/);
  assert.match(page, /sortBy==="salesAsc"/);
  assert.match(page, /sortBy==="salesDesc"/);
  assert.match(page, /const salesForCar/);
  assert.match(page, /const salesForRecords/);
  assert.match(page, /同一车型动力的不同驱动与配置卡片共享销量/);
  assert.match(page, /资料更新时间：新 → 旧/);
  assert.match(page, /"全部区域",\.\.\.regionCountries\.map/);
  assert.match(page, /coverageRegion,setCoverageRegion\]=useState\("南美"\)/);
  assert.match(page, /coverageMarket,setCoverageMarket\]=useState\("巴西"\)/);
  assert.match(page, /footprintGroup,setFootprintGroup\]=useState\("全部集团"\)/);
  assert.match(page, /coverageCountries=countries\.filter/);
  assert.match(page, /className="coverageRegions"/);
  assert.match(page, /className="coverageMarketTabs"/);
  assert.match(page, /className="coverageBars"/);
  assert.match(page, /setCoverageMarket\(item\.countries\[0\]\[0\]\)/);
  assert.match(page, /aria-label="按母集团筛选品牌"/);
  assert.match(page, /visibleBrandFootprint\.map/);
  assert.doesNotMatch(page, /className="coverageTable"/);
  assert.match(page, /modelIdentityAliases/);
  assert.match(page, /Dolphin Mini":"BYD Seagull family/);
  assert.match(page, /Yuan Plus":"BYD Atto 3 \/ Yuan Plus/);
  assert.match(page, /Yuan Up DM-i":"BYD Atto 2 \/ Yuan Up/);
  assert.match(page, /Song Plus":"BYD Song Plus \/ Seal U \/ Sealion 6/);
  assert.match(page, /EX5 EM-i":"Geely EX5 family/);
  assert.match(page, /className="brandFootprint"/);
  assert.match(page, /"GAC集团":\["GAC","AION","HYPTEC"\]/);
  assert.match(page, /GAC集团\|AION\|AION UT/);
  assert.match(page, /GAC集团\|HYPTEC\|HYPTEC HT/);
  assert.match(page, /GAC集团\|GAC\|M8/);
  assert.match(page, /Jaecoo 8\|CLP 30\.990\.000/);
  assert.match(page, /ICE Andes 2\.0T FWD（融资）:CLP 29\.990\.000/);
  assert.match(page, /const lengthFloor = 4000/);
  assert.match(page, /const lengthStep = 100/);
  assert.match(page, /aria-label="最短车身长度"/);
  assert.match(page, /4\.3m以内/);
  assert.match(page, /4\.9m以上/);
  assert.match(page, /cars\.filter\(c=>c\.brand===item\.brand\)/);
  assert.match(page, /const modelFamilies=new Map<string,Car>/);
  assert.match(page, /const bodyCounts:Record<BodyType,number>/);
  assert.match(page, /coverageBars=.*sort\(\(a,b\)=>b\.count-a\.count/);
  assert.match(page, /setRegion\("全部区域"\);setCountry\("全部市场"\)/);
  assert.match(page, /setOverviewBrand\(item\.brand\)/);
  assert.match(page, /全市场 · \$\{overviewBrand\} 车型总览/);
  assert.match(page, /高级筛选已作用于该品牌底层版本与汇总结果/);
  assert.match(page, /filtered\.filter\(c=>c\.brand===overviewBrand\)/);
  assert.match(page, /overviewBrand,filtered,sortBy/);
  assert.match(page, /动力与主要配置/);
  assert.match(page, /投放大区/);
  assert.match(page, /投放国家/);
  assert.match(page, /当地销售名/);
  assert.match(page, /EBRO s700/);
  assert.match(page, /OMODA C7/);
  assert.match(page, /OMODA C9/);
  assert.doesNotMatch(page, /marketChanges/);
  assert.doesNotMatch(page, /本轮市场变化/);
  assert.match(page, /showAdvancedFilters/);
  assert.match(page, /查看各国版本与配置/);
  assert.match(page, /className="configChoice"/);
  assert.match(page, /setFamilyFocus/);
  assert.match(page, /当前查看/);
  assert.match(page, /familyMarkets/);
  assert.match(page, /className="familyDrawer"/);
  assert.match(page, /aria-modal="true"/);
  assert.match(page, /const allBasicFilters=region==="全部区域"&&country==="全部市场"&&group==="全部集团"&&brand==="全部品牌"/);
  assert.match(page, /const globalSummaryActive=allBasicFilters&&!showRawRecords/);
  assert.match(page, /filtered\.forEach\(car=>/);
  assert.match(page, /const summaries=\[\.\.\.map\.values\(\)\]\.map\(summarizeModelRecords\)/);
  assert.match(page, /const summaryActive=overviewActive\|\|globalSummaryActive/);
  assert.match(page, /高级筛选已作用于底层版本与汇总结果/);
  assert.match(page, /查看 \{filtered\.length\} 条版本记录/);
  assert.match(page, /返回车型家族汇总/);
  assert.match(page, /summaryModels\.map/);
  assert.match(page, /selectedFamily\.brand/);
  assert.doesNotMatch(page, /coverageCountryNames/);
  assert.doesNotMatch(page, /"--heat"/);
  assert.match(page, /DONGFENG/);
  assert.match(css, /\.coverageBars/);
  assert.match(css, /\.footprintGroupFilter/);
  assert.match(css, /--ink:#22272c/);
  assert.match(css, /--paper:#eeeeee/);
  assert.match(css, /--panel:#ffffff/);
  assert.match(css, /--primary:#009c9d/);
  assert.match(css, /--aqua:#4cc9c5/);
  assert.match(css, /--acid:#ffbb00/);
  assert.match(css, /--line:#dcdddd/);
  assert.match(css, /\.priceRangeRow/);
  assert.match(css, /\.dimensionRangeRow/);
  assert.match(css, /\.sortControl/);
  assert.match(css, /\.resultCount/);
  const searchPosition = page.indexOf('className="search"');
  const sectionHeadPosition = page.indexOf('className="sectionHead"', searchPosition);
  const sortPosition = page.indexOf('className="sortControl sectionSort"');
  assert.ok(searchPosition >= 0 && sectionHeadPosition > searchPosition && sortPosition > sectionHeadPosition, "排序控件应位于筛选区之后的结果标题区域");
  assert.match(css, /\.bodyMix/);
  assert.doesNotMatch(css, /--acid:#8b5e3c/);
  assert.match(css, /\.heroStrategy,\.coverage\{background:var\(--paper\)/);
  assert.match(layout, /南美、欧洲、澳新与东南亚 25 个重点国家/);
  assert.match(strategic, /\{ name: "欧洲"[^\n]+\["匈牙利","🇭🇺"\]/);
  assert.match(strategic, /\{ name: "澳新"[^\n]+\["澳大利亚","🇦🇺"\],\["新西兰","🇳🇿"\]/);
  assert.doesNotMatch(strategic, /\{ name: "澳新"[^\n]+匈牙利/);
  assert.match(strategic, /"XPENG集团"/);
  assert.match(strategic, /"NIO集团"/);
  assert.match(strategic, /Chery集团","Chery","Tiggo 7","ebro-es"/);
  assert.match(strategic, /Chery集团","Omoda","Omoda 7"/);
  assert.match(strategic, /Chery集团","Omoda","Omoda 9"/);
  assert.match(strategic, /GAC集团","AION","AION V"/);
  assert.match(strategic, /gacgroup\.com\/en-au/);
  assert.match(strategic, /gacnz\.co\.nz\/models/);
  assert.match(strategic, /leapmotor-b05-official\.jpeg/);
  assert.match(strategic, /VOYAH","VOYAH Passion","voyah-hu","HUF 28\.511\.500"/);
  assert.match(strategic, /VOYAH","VOYAH Passion L","voyah-it"/);
  assert.match(strategic, /voyah\.hu\/model\/voyah-passion/);
  assert.match(strategic, /voyah-italia\.it\/voyah-passion-l/);
  assert.match(strategic, /1-frameless-windows-l\.jpg\?extension=webp%2Cavif/);
  assert.doesNotMatch(strategic, /press\.lynkco\.com\/image\/low\/247253\/2933672/);
  assert.match(strategic, /ebroauto\.com\/modelos/);
  assert.match(salesData, /"country":"巴西","model":"BYD Seagull family","energy":"纯电"/);
  assert.match(salesData, /"country":"西班牙","model":"Tiggo 7"/);
  assert.match(salesData, /export const marklinesSalesPeriod = "2024-01 至 2026-04"/);
});
