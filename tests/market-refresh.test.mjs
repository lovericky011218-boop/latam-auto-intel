import assert from "node:assert/strict";
import { readFile, access } from "node:fs/promises";
import vm from "node:vm";
import test from "node:test";
import ts from "typescript";

// Execute the real catalogue/filter helpers, without mounting React or keeping
// a second implementation of the dashboard's country/power/drive rules.
const root = new URL("../", import.meta.url);
const compile = source => ts.transpileModule(source, {compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ESNext,jsx:ts.JsxEmit.ReactJSX}}).outputText;
const modules = await Promise.all(["strategic-market-data", "market-refresh-data", "marklines-sales-data"].map(async name => {
  const code = compile(await readFile(new URL(`app/${name}.ts`, root), "utf8"));
  return import(`data:text/javascript;base64,${Buffer.from(code).toString("base64")}`);
}));
const [strategic, refresh] = modules;
const page = await readFile(new URL("app/dashboard.tsx", root), "utf8");
const prefix = compile(page.slice(0, page.indexOf("export default function Home()"))).replace(/^import[\s\S]*?;\n/gm, "");
const context = vm.createContext({...Object.assign({}, ...modules), process:{env:{}}, console});
vm.runInContext(prefix + "\nglobalThis.audit={cars,baseCars,latamRaw,strategicRaw,marketRefreshRaw,sources,cnyValue,lengthValue,trimEnergyDetail,canonicalModel,bodyTypeOf,salesForRecords};", context);
export const audit = context.audit;

test("Colombia is the 26th market, and refreshed catalogue rows have valid sources", () => {
  assert.equal(strategic.regionCountries.flatMap(r=>r.countries).length, 26);
  assert.equal(refresh.marketRefreshRaw["哥伦比亚"].length, 53);
  for(const rows of Object.values(refresh.marketRefreshRaw)) for(const row of rows){
    const fields=row.split("|");
    assert.equal(fields.length,6,row);
    assert.ok(audit.sources[fields[5]],fields[5]);
    assert.ok(fields[4].split(",").every(trim=>trim.includes(":")),row);
  }
});

test("every refreshed trim is shown exactly once without invented local variants", () => {
  assert.equal(new Set(audit.cars.map(car=>car.id)).size,audit.cars.length);
  for(const base of audit.baseCars.filter(car=>refresh.refreshedRecordKeys.has(`${car.country}|${car.group}|${car.brand}|${car.model}`))){
    const actual=audit.cars.filter(car=>car.id.startsWith(base.id+"-"));
    assert.deepEqual(actual.flatMap(car=>car.trims.map(t=>t.name)).sort(),base.trims.map(t=>t.name).sort(),`${base.country}|${base.model}`);
    assert.ok(actual.every(car=>car.verified===refresh.marketRefreshDate));
  }
  const co=audit.cars.filter(car=>car.country==="哥伦比亚");
  assert.ok(co.length>53);
  assert.ok(co.filter(car=>/Jetour T[12]/.test(car.model)).every(car=>car.energy==="插混 PHEV"));
  assert.ok(co.filter(car=>car.model==="VOYAH Free").every(car=>car.energy==="增程 REEV"));
  assert.equal(audit.cars.find(car=>car.country==="巴西"&&car.model==="AVATR 11").verified,"2026-09-10");
});

test("local batteries, dimensions, COP pricing and missing sales are usable", () => {
  const nevo=audit.cars.find(car=>car.country==="哥伦比亚"&&car.model==="NEVO Q05");
  assert.equal(audit.lengthValue(nevo),4435);
  assert.equal(audit.trimEnergyDetail(nevo,nevo.trims[0]).battery,"51.9 kWh");
  assert.equal(audit.trimEnergyDetail(nevo,nevo.trims[0]).range,"455 km NEDC");
  assert.match(nevo.trims[0].name,/预售/);
  assert.ok(audit.cnyValue("COP 79.990.000")>150000);
  assert.equal(audit.cnyValue("询价"),null);
  const ut=audit.cars.find(car=>car.country==="哥伦比亚"&&car.model==="AION UT");
  assert.deepEqual(Array.from(ut.trims,t=>audit.trimEnergyDetail(ut,t).battery),["32.24 kWh","44.12 kWh","60 kWh"]);
  assert.equal(audit.salesForRecords([nevo]).matched,false);
  assert.equal(audit.bodyTypeOf("WEY G9"),"MPV");
  assert.equal(audit.bodyTypeOf("NIO ET7"),"轿车");
});

test("refresh merge is nonmutating/idempotent and new images are stored locally", async () => {
  const base={...audit.latamRaw,...strategic.strategicRaw};
  const before=JSON.stringify(base);
  const once=refresh.applyMarketRefresh(base);
  assert.equal(JSON.stringify(base),before);
  assert.deepEqual(refresh.applyMarketRefresh(once),once);
  for(const image of Object.values(refresh.refreshImages)){
    assert.match(image,/^\/cars\//);
    await access(new URL(`public${image}`,root));
  }
});
