export type StrategicSpec = {
  dims: string;
  wheelbase: string;
  energy: string;
  use: string;
  range: string;
  safety: string;
  rating: "yes" | "unknown";
};

export const regionCountries = [
  { name: "南美", code: "LATAM", countries: [["巴西","🇧🇷"],["阿根廷","🇦🇷"],["智利","🇨🇱"],["乌拉圭","🇺🇾"],["玻利维亚","🇧🇴"],["厄瓜多尔","🇪🇨"],["秘鲁","🇵🇪"]] },
  { name: "欧洲", code: "EUROPE", countries: [["意大利","🇮🇹"],["挪威","🇳🇴"],["荷兰","🇳🇱"],["西班牙","🇪🇸"],["法国","🇫🇷"],["以色列","🇮🇱"],["瑞典","🇸🇪"],["德国","🇩🇪"],["波兰","🇵🇱"],["比利时","🇧🇪"],["英国","🇬🇧"],["匈牙利","🇭🇺"]] },
  { name: "澳新", code: "ANZ", countries: [["澳大利亚","🇦🇺"],["新西兰","🇳🇿"]] },
  { name: "东南亚", code: "ASEAN", countries: [["泰国","🇹🇭"],["印度尼西亚","🇮🇩"],["马来西亚","🇲🇾"],["新加坡","🇸🇬"]] },
] as const;

export const strategicSpecs: Record<string, StrategicSpec> = {
  "Dolphin Surf": {dims:"3,990 × 1,720 × 1,590 mm",wheelbase:"2,500 mm",energy:"纯电 BEV",use:"约 15.5 kWh/100km*",range:"220–322 km WLTP*",safety:"未查到当地版本有效五星成绩",rating:"unknown"},
  "Atto 1": {dims:"3,780 × 1,715 × 1,580 mm",wheelbase:"2,500 mm",energy:"纯电 BEV",use:"约 12.1 kWh/100km",range:"300–380 km NEDC*",safety:"未查到当地版本有效五星成绩",rating:"unknown"},
  "Atto 2": {dims:"4,310 × 1,830 × 1,675 mm",wheelbase:"2,620 mm",energy:"纯电 BEV",use:"约 16.0 kWh/100km*",range:"312–430 km WLTP*",safety:"未查到当地版本有效五星成绩",rating:"unknown"},
  "Atto 3": {dims:"4,455 × 1,875 × 1,615 mm",wheelbase:"2,720 mm",energy:"纯电 BEV",use:"约 15.6 kWh/100km",range:"420 km WLTP",safety:"5★ Euro NCAP / ANCAP",rating:"yes"},
  "Seal U DM-i": {dims:"4,775 × 1,890 × 1,670 mm",wheelbase:"2,765 mm",energy:"插混 PHEV",use:"约 0.9–1.2 L/100km WLTP*",range:"70–125 km 纯电 / 超过 1,000 km 综合*",safety:"5★ Euro NCAP（适用版本）",rating:"yes"},
  "Seal 6 DM-i": {dims:"4,830 × 1,875 × 1,495 mm",wheelbase:"2,790 mm",energy:"插混 PHEV",use:"约 1.5 L/100km WLTP*",range:"最高约 105 km 纯电 / 1,500 km 综合*",safety:"未查到当地版本有效五星成绩",rating:"unknown"},
  "Seal 6 Touring": {dims:"4,840 × 1,875 × 1,505 mm",wheelbase:"2,790 mm",energy:"插混 PHEV",use:"约 1.7 L/100km WLTP*",range:"最高约 100 km 纯电 / 1,350 km 综合*",safety:"未查到当地版本有效五星成绩",rating:"unknown"},
  "Sealion 5 DM-i": {dims:"4,738 × 1,860 × 1,710 mm",wheelbase:"2,712 mm",energy:"插混 PHEV",use:"约 4.5 L/100km 馈电*",range:"约 71–110 km 纯电*",safety:"未查到当地版本有效五星成绩",rating:"unknown"},
  "Sealion 6 DM-i": {dims:"4,775 × 1,890 × 1,670 mm",wheelbase:"2,765 mm",energy:"插混 PHEV",use:"约 1.1 L/100km 等效*",range:"约 92 km 纯电 / 超过 1,000 km 综合*",safety:"5★ ANCAP（适用版本）",rating:"yes"},
  "Sealion 8 DM-i": {dims:"5,040 × 1,996 × 1,760 mm",wheelbase:"2,950 mm",energy:"插混 PHEV",use:"当地官网未公布",range:"约 1,000 km 综合*",safety:"未查到当地版本有效五星成绩",rating:"unknown"},
  "M6": {dims:"4,710 × 1,810 × 1,690 mm",wheelbase:"2,800 mm",energy:"纯电 BEV",use:"约 17.5 kWh/100km*",range:"420–530 km NEDC",safety:"未查到当地版本有效五星成绩",rating:"unknown"},
  "M6 DM-i": {dims:"4,710 × 1,810 × 1,690 mm",wheelbase:"2,800 mm",energy:"插混 PHEV",use:"当地官网未公布",range:"45 km 纯电 NEDC",safety:"未查到当地版本有效五星成绩",rating:"unknown"},
  "B05": {dims:"4,430 × 1,880 × 1,520 mm",wheelbase:"2,735 mm",energy:"纯电 BEV",use:"当地官网未公布",range:"最高约 460 km WLTP*",safety:"未查到当地版本有效五星成绩",rating:"unknown"},
  "Deepal S05": {dims:"4,620 × 1,900 × 1,600 mm",wheelbase:"2,880 mm",energy:"纯电 BEV / 增程 REEV",use:"依动力版本",range:"BEV 447–488 km WLTP / REEV 约 1,129 km 综合*",safety:"5★ Euro NCAP（BEV 欧洲版）",rating:"yes"},
  "Zeekr 7X": {dims:"4,825 × 1,930 × 1,656 mm",wheelbase:"2,925 mm",energy:"纯电 BEV",use:"约 16.4–18.7 kWh/100km*",range:"480–615 km WLTP",safety:"5★ Euro NCAP",rating:"yes"},
  "Zeekr 009": {dims:"5,209 × 2,024 × 1,848 mm",wheelbase:"3,205 mm",energy:"纯电 BEV",use:"约 23.3 kWh/100km*",range:"最高约 582 km WLTP*",safety:"5★ Euro NCAP（适用版本）",rating:"yes"},
  "Lynk & Co 02": {dims:"4,460 × 1,845 × 1,573 mm",wheelbase:"2,755 mm",energy:"纯电 BEV",use:"约 17.1 kWh/100km*",range:"最高 445 km WLTP",safety:"5★ Euro NCAP",rating:"yes"},
  "Lynk & Co 08": {dims:"4,820 × 1,915 × 1,685 mm",wheelbase:"2,848 mm",energy:"插混 PHEV",use:"约 0.9 L/100km WLTP*",range:"200 km 纯电 / 超过 1,000 km 综合 WLTP*",safety:"5★ Euro NCAP",rating:"yes"},
  "WEY 03": {dims:"4,668 × 1,890 × 1,730 mm",wheelbase:"2,745 mm",energy:"插混 PHEV",use:"约 0.5 L/100km WLTP*",range:"最高 139 km 纯电 WLTP*",safety:"5★ Euro NCAP（同代车型）",rating:"yes"},
  "WEY 05": {dims:"4,870 × 1,960 × 1,690 mm",wheelbase:"2,910 mm",energy:"插混 PHEV",use:"约 0.4 L/100km WLTP*",range:"最高 146 km 纯电 WLTP*",safety:"5★ Euro NCAP（同代车型）",rating:"yes"},
  "VOYAH Free": {dims:"4,905 × 1,950 × 1,645 mm",wheelbase:"2,960 mm",energy:"纯电 BEV",use:"约 20.2 kWh/100km WLTP*",range:"约 500 km WLTP",safety:"未查到有效 Euro NCAP 五星成绩",rating:"unknown"},
  "VOYAH Courage": {dims:"4,725 × 1,900 × 1,650 mm",wheelbase:"2,900 mm",energy:"纯电 BEV",use:"约 18.9 kWh/100km WLTP*",range:"最高约 476 km WLTP*",safety:"5★ Euro NCAP",rating:"yes"},
  "VOYAH Dream": {dims:"5,315 × 1,985 × 1,800 mm",wheelbase:"3,200 mm",energy:"纯电 BEV",use:"约 24.0 kWh/100km WLTP*",range:"约 480 km WLTP",safety:"未查到有效 Euro NCAP 五星成绩",rating:"unknown"},
  "XPENG G6": {dims:"4,758 × 1,920 × 1,650 mm",wheelbase:"2,890 mm",energy:"纯电 BEV",use:"约 16.9–18.4 kWh/100km",range:"470–525 km WLTP",safety:"5★ Euro NCAP / ANCAP",rating:"yes"},
  "XPENG G9": {dims:"4,891 × 1,937 × 1,680 mm",wheelbase:"2,998 mm",energy:"纯电 BEV",use:"约 19.4–21.3 kWh/100km*",range:"460–570 km WLTP",safety:"5★ Euro NCAP",rating:"yes"},
  "XPENG P7+": {dims:"5,056 × 1,937 × 1,512 mm",wheelbase:"3,000 mm",energy:"纯电 BEV",use:"约 15.2 kWh/100km*",range:"500–530 km WLTP",safety:"未查到可对应的 Euro NCAP 成绩",rating:"unknown"},
  "XPENG X9": {dims:"5,293 × 1,988 × 1,785 mm",wheelbase:"3,160 mm",energy:"纯电 BEV",use:"约 19.7–20.8 kWh/100km",range:"535–580 km WLTP",safety:"按 Euro NCAP 五星目标开发，尚无有效成绩",rating:"unknown"},
  "NIO ET5": {dims:"4,790 × 1,960 × 1,499 mm",wheelbase:"2,888 mm",energy:"纯电 BEV",use:"约 16.9–18.2 kWh/100km*",range:"456–590 km WLTP",safety:"5★ Euro NCAP",rating:"yes"},
  "NIO ET5 Touring": {dims:"4,790 × 1,960 × 1,499 mm",wheelbase:"2,888 mm",energy:"纯电 BEV",use:"约 17.3–19.3 kWh/100km*",range:"435–560 km WLTP",safety:"5★ Euro NCAP",rating:"yes"},
  "NIO EL6": {dims:"4,854 × 1,995 × 1,703 mm",wheelbase:"2,915 mm",energy:"纯电 BEV",use:"约 19.9–21.2 kWh/100km*",range:"406–529 km WLTP",safety:"5★ Euro NCAP",rating:"yes"},
  "NIO EL8": {dims:"5,099 × 1,989 × 1,750 mm",wheelbase:"3,070 mm",energy:"纯电 BEV",use:"约 21.2–23.1 kWh/100km",range:"390–510 km WLTP",safety:"未查到可对应的 Euro NCAP 成绩",rating:"unknown"},
  "firefly": {dims:"4,003 × 1,781 × 1,557 mm",wheelbase:"2,615 mm",energy:"纯电 BEV",use:"约 14.5 kWh/100km*",range:"330 km WLTP",safety:"5★ Euro NCAP",rating:"yes"},
};

type R = [group:string, brand:string, model:string, source:string, price?:string, trims?:string];
const r = ([group,brand,model,source,price="询价",trims]:R) => `${group}|${brand}|${model}|${price}|${trims || `当地官网未逐版本公开:${price}`}|${source}`;
const rs = (rows:R[]) => rows.map(r);
const reprice = (row:R, price:string, trims:string):R => [row[0],row[1],row[2],row[3],price,trims];

const bydEu = (source="byd-eu"):R[] => [
  ["BYD集团","BYD","Dolphin Surf",source],
  ["BYD集团","BYD","Dolphin",source],
  ["BYD集团","BYD","Atto 2",source],
  ["BYD集团","BYD","Atto 3",source],
  ["BYD集团","BYD","Seal",source,"询价","Design RWD:询价,Excellence AWD:询价"],
  ["BYD集团","BYD","Seal U DM-i",source,"询价","Boost FWD:询价,Comfort FWD:询价,Design AWD:询价"],
  ["BYD集团","BYD","Sealion 7",source,"询价","Comfort RWD:询价,Design AWD:询价,Excellence AWD:询价"],
  ["BYD集团","BYD","Seal 6 DM-i",source],
];
const leapEu = (source="leap-eu"):R[] => [
  ["Leapmotor集团","Leapmotor","T03",source],
  ["Leapmotor集团","Leapmotor","B10",source,"询价","BEV Life:询价,BEV Design:询价,REEV Life:询价"],
  ["Leapmotor集团","Leapmotor","C10",source,"询价","BEV Style:询价,REEV Design:询价"],
  ["Leapmotor集团","Leapmotor","B05",source],
];
const lynkEu = (source="lynk-eu"):R[] => [
  ["Geely集团","Lynk&Co","Lynk & Co 01",source],
  ["Geely集团","Lynk&Co","Lynk & Co 02",source,"询价","Core RWD:询价,More RWD:询价"],
  ["Geely集团","Lynk&Co","Lynk & Co 08",source],
];
const xpengEu = (source="xpeng-eu"):R[] => [
  ["XPENG集团","XPENG","XPENG G6",source,"询价","RWD Standard Range:询价,RWD Long Range:询价,AWD Performance:询价"],
  ["XPENG集团","XPENG","XPENG G9",source,"询价","RWD Standard Range:询价,RWD Long Range:询价,AWD Performance:询价"],
  ["XPENG集团","XPENG","XPENG P7+",source,"询价","RWD Long Range:询价,AWD Performance:询价"],
];
const nioEu = (source="nio-eu"):R[] => [
  ["NIO集团","NIO","NIO ET5",source,"询价","75 kWh AWD:询价,100 kWh AWD:询价"],
  ["NIO集团","NIO","NIO ET5 Touring",source,"询价","75 kWh AWD:询价,100 kWh AWD:询价"],
  ["NIO集团","NIO","NIO EL6",source,"询价","75 kWh AWD:询价,100 kWh AWD:询价"],
  ["NIO集团","NIO","NIO EL8",source,"询价","75 kWh AWD:询价,100 kWh AWD:询价"],
];
const ojCore = (source="oj-eu"):R[] => [
  ["Chery集团","Omoda","Omoda 5",source,"询价","ICE Comfort:询价,HEV Premium:询价"],
  ["Chery集团","Omoda","Omoda E5",source],
  ["Chery集团","Jaecoo","Jaecoo 5",source,"询价","ICE:询价,EV:询价"],
  ["Chery集团","Jaecoo","Jaecoo 7",source,"询价","ICE FWD:询价,PHEV FWD:询价"],
];
const voyahEu = (source="voyah-eu"):R[] => [
  ["东风集团","VOYAH","VOYAH Free",source,"询价","AWD:询价"],
  ["东风集团","VOYAH","VOYAH Courage",source,"询价","RWD:询价,AWD:询价"],
  ["东风集团","VOYAH","VOYAH Dream",source,"询价","AWD:询价"],
];
const deepalEu = (source="changan-eu"):R[] => [
  ["Changan集团","Deepal","Deepal S05",source,"询价","BEV RWD:询价,BEV AWD:询价"],
  ["Changan集团","Deepal","Deepal S07",source,"询价","BEV RWD:询价"],
];

export const strategicRaw: Record<string,string[]> = {
  "意大利": rs([
    ...bydEu(),...ojCore(),...lynkEu(),...voyahEu(),...deepalEu(),...xpengEu(),
    ...leapEu().map(x => x[2]==="T03"?reprice(x,"€ 18.900","BEV:€ 18.900"):x[2]==="B10"?reprice(x,"€ 29.900","BEV Life:询价,REEV Life:€ 29.900"):x[2]==="C10"?reprice(x,"€ 37.400","BEV Style:询价,REEV Life:€ 37.400"):x[2]==="B05"?reprice(x,"€ 26.900","BEV Life:€ 26.900"):x),
  ]),
  "挪威": rs([
    ...bydEu(),...ojCore(),...lynkEu(),...voyahEu(),...leapEu(),...deepalEu(),
    ...xpengEu("xpeng-no").map(x=>x[2]==="XPENG P7+"?reprice(x,"NOK 429.900","RWD Long Range:NOK 429.900,AWD Performance:NOK 489.900"):x),
    ...nioEu("nio-no").map(x=>x[2]==="NIO EL8"?reprice(x,"NOK 782.050","75 kWh AWD:NOK 782.050,100 kWh AWD:询价"):x),
  ]),
  "荷兰": rs([
    ...bydEu(),...ojCore(),...lynkEu(),...voyahEu(),...leapEu(),...deepalEu(),
    ...xpengEu("xpeng-nl").map(x=>x[2]==="XPENG G6"?reprice(x,"€ 43.990","RWD Standard Range:€ 43.990,RWD Long Range:€ 48.990,AWD Performance:€ 53.990"):x),
    ...nioEu("nio-nl"),
    ["Geely集团","Zeekr","Zeekr X","zeekr-eu"],["Geely集团","Zeekr","Zeekr 001","zeekr-eu"],["Geely集团","Zeekr","Zeekr 7X","zeekr-eu","询价","RWD Long Range:询价,AWD Performance:询价"],
  ]),
  "西班牙": rs([
    ...bydEu(),...lynkEu(),...leapEu(),...deepalEu(),...xpengEu(),...voyahEu(),
    ["Chery集团","Omoda","Omoda 5","oj-es","€ 22.890","ICE Comfort:€ 22.890,HEV Premium:询价"],
    ["Chery集团","Omoda","Omoda E5","oj-es"],
    ["Chery集团","Jaecoo","Jaecoo 5","oj-es"],
    ["Chery集团","Jaecoo","Jaecoo 7","oj-es","€ 27.990","ICE FWD:询价,PHEV FWD:€ 27.990"],
    ["Chery集团","Jaecoo","Jaecoo 8","oj-es","€ 44.190","PHEV AWD:€ 44.190"],
  ]),
  "法国": rs([
    ...bydEu(),...ojCore(),...lynkEu(),...leapEu(),...xpengEu(),
    ["Geely集团","Zeekr","Zeekr X","zeekr-eu"],["Geely集团","Zeekr","Zeekr 001","zeekr-eu"],["Geely集团","Zeekr","Zeekr 7X","zeekr-eu","询价","RWD Long Range:询价,AWD Performance:询价"],
  ]),
  "以色列": rs([
    ...bydEu(),...xpengEu(),
    ["Chery集团","Chery","Tiggo 7","chery-il","询价","ICE:询价,PHEV:询价"],
    ["Chery集团","Chery","Tiggo 8 Pro","chery-il","询价","ICE:询价,PHEV:询价"],
    ["Geely集团","Geely","EX5","geely-il"],
    ["GWM集团","GWM","Haval Jolion","gwm-il","询价","ICE:询价,HEV:询价"],
    ["GWM集团","GWM","Haval H6","gwm-il","询价","HEV:询价,PHEV AWD:询价"],
  ]),
  "瑞典": rs([
    ...bydEu(),...ojCore(),...lynkEu(),...voyahEu(),...leapEu(),...xpengEu(),...nioEu("nio-se"),
    ["Geely集团","Zeekr","Zeekr X","zeekr-eu"],["Geely集团","Zeekr","Zeekr 001","zeekr-eu"],["Geely集团","Zeekr","Zeekr 7X","zeekr-eu","询价","RWD Long Range:询价,AWD Performance:询价"],
    ["GWM集团","GWM","WEY 03","gwm-eu"],["GWM集团","GWM","WEY 05","gwm-eu"],["GWM集团","GWM","Ora 03","gwm-eu"],
  ]),
  "德国": rs([
    ...bydEu(),...ojCore(),...lynkEu(),...voyahEu(),...leapEu(),...deepalEu(),...xpengEu(),...nioEu("nio-de"),
    ["Geely集团","Zeekr","Zeekr X","zeekr-de","€ 37.990","RWD:€ 37.990,AWD Privilege:询价"],
    ["Geely集团","Zeekr","Zeekr 001","zeekr-de","€ 59.990","RWD Long Range:€ 59.990,AWD Performance:询价"],
    ["Geely集团","Zeekr","Zeekr 7X","zeekr-de","询价","RWD Long Range:询价,AWD Performance:询价"],
    ["GWM集团","GWM","WEY 03","gwm-eu"],["GWM集团","GWM","WEY 05","gwm-eu"],["GWM集团","GWM","Ora 03","gwm-eu"],
  ]),
  "波兰": rs([
    ...bydEu(),...ojCore(),...lynkEu(),...voyahEu(),...leapEu(),...xpengEu(),
  ]),
  "比利时": rs([
    ...bydEu(),...ojCore(),...lynkEu(),...leapEu(),...xpengEu(),
    ["NIO集团","firefly","firefly","firefly-eu"],
  ]),
  "英国": rs([
    ...bydEu(),...lynkEu(),...leapEu(),...deepalEu(),
    ["Chery集团","Omoda","Omoda 5","oj-uk","询价","ICE:询价,HEV:询价"],["Chery集团","Omoda","Omoda E5","oj-uk"],["Chery集团","Jaecoo","Jaecoo 5","oj-uk","询价","ICE:询价,EV:询价"],["Chery集团","Jaecoo","Jaecoo 7","oj-uk","询价","ICE:询价,HEV:询价,PHEV:询价"],["Chery集团","Jaecoo","Jaecoo 8","oj-uk","询价","PHEV AWD:询价"],
    ["GWM集团","GWM","Haval Jolion","gwm-uk","£ 27.995","ICE:询价,HEV:£ 27.995"],["GWM集团","GWM","Ora 03","gwm-uk"],["GWM集团","GWM","Poer","gwm-uk","£ 38.911","POER300 4WD:£ 38.911"],
    ...xpengEu("xpeng-uk").map(x=>x[2]==="XPENG G6"?reprice(x,"£ 39.990","RWD Standard Range:£ 39.990,RWD Long Range:询价,AWD Performance:询价"):x),
  ]),
  "匈牙利": rs([
    ...bydEu(),...ojCore(),...lynkEu(),...leapEu(),
    ["GWM集团","GWM","WEY 03","gwm-eu"],["GWM集团","GWM","WEY 05","gwm-eu"],["GWM集团","GWM","Ora 03","gwm-eu"],
  ]),
  "澳大利亚": rs([
    ["BYD集团","BYD","Atto 1","byd-au"],["BYD集团","BYD","Atto 2","byd-au"],["BYD集团","BYD","Atto 3","byd-au"],["BYD集团","BYD","Dolphin","byd-au"],["BYD集团","BYD","Seal","byd-au","询价","RWD Dynamic:询价,RWD Premium:询价,AWD Performance:询价"],["BYD集团","BYD","Seal 6 DM-i","byd-au"],["BYD集团","BYD","Seal 6 Touring","byd-au"],["BYD集团","BYD","Sealion 6 DM-i","byd-au"],["BYD集团","BYD","Sealion 7","byd-au","AUD 54.990","RWD Premium:AUD 54.990,AWD Performance:询价"],["BYD集团","BYD","Sealion 8 DM-i","byd-au","AUD 56.990","PHEV AWD:AUD 56.990"],["BYD集团","BYD","Shark","byd-au","AUD 57.900","PHEV AWD:AUD 57.900"],
    ["Chery集团","Chery","Omoda 5","chery-au","AUD 28.990","ICE Urban:AUD 28.990,HEV Ultimate:询价"],["Chery集团","Chery","Omoda E5","chery-au","AUD 37.990","BEV Urban:AUD 37.990"],["Chery集团","Chery","Tiggo 4","chery-au","AUD 23.990","ICE Urban:AUD 23.990,HEV Urban:AUD 29.990"],["Chery集团","Chery","Tiggo 7","chery-au","AUD 29.990","ICE Urban:AUD 29.990,PHEV Urban:AUD 34.990"],["Chery集团","Chery","Tiggo 8 Pro","chery-au","AUD 38.990","ICE Urban:AUD 38.990,PHEV Urban:AUD 45.990"],["Chery集团","Chery","Tiggo 9","chery-au","询价","PHEV AWD:询价"],
    ["Geely集团","Geely","EX5","geely-au"],["Geely集团","Geely","EX5 EM-i","geely-au"],["Geely集团","Zeekr","Zeekr X","zeekr-au"],["Geely集团","Zeekr","Zeekr 7X","zeekr-au","询价","RWD:询价,AWD:询价"],["Geely集团","Zeekr","Zeekr 009","zeekr-au"],
    ["GWM集团","GWM","Ora 03","gwm-au"],["GWM集团","GWM","Haval Jolion","gwm-au","询价","ICE:询价,HEV:询价"],["GWM集团","GWM","Haval H6","gwm-au","询价","ICE FWD:询价,HEV FWD:询价,PHEV AWD:询价"],["GWM集团","GWM","Tank 300","gwm-au","询价","HEV AWD:询价,PHEV AWD:询价"],["GWM集团","GWM","Tank 500","gwm-au"],["GWM集团","GWM","Poer","gwm-au"],
    ["Leapmotor集团","Leapmotor","B10","leap-au","询价","BEV:询价,REEV:询价"],["Leapmotor集团","Leapmotor","C10","leap-au","询价","BEV:询价,REEV:询价"],
    ["Changan集团","Deepal","Deepal S05","deepal-au","询价","BEV RWD:询价,BEV AWD:询价"],["Changan集团","Deepal","Deepal S07","deepal-au","询价","BEV RWD:询价"],
    ["XPENG集团","XPENG","XPENG G6","xpeng-au","询价","RWD Standard Range:询价,RWD Long Range:询价,AWD Performance:询价"],["XPENG集团","XPENG","XPENG X9","xpeng-au","AUD 89.900","FWD Standard Range:AUD 89.900,AWD Performance:AUD 109.900"],
  ]),
  "新西兰": rs([
    ["BYD集团","BYD","Atto 1","byd-nz"],["BYD集团","BYD","Atto 2","byd-nz"],["BYD集团","BYD","Atto 3","byd-nz"],["BYD集团","BYD","Dolphin","byd-nz"],["BYD集团","BYD","Seal","byd-nz","询价","RWD:询价,AWD:询价"],["BYD集团","BYD","Sealion 6 DM-i","byd-nz"],["BYD集团","BYD","Sealion 7","byd-nz","询价","RWD:询价,AWD:询价"],["BYD集团","BYD","Shark","byd-nz"],
    ["Chery集团","Chery","Omoda 5","chery-nz","询价","ICE:询价,HEV:询价"],["Chery集团","Chery","Omoda E5","chery-nz"],["Chery集团","Chery","Tiggo 7","chery-nz","询价","ICE:询价,PHEV:询价"],["Chery集团","Chery","Tiggo 8 Pro","chery-nz","询价","ICE:询价,PHEV:询价"],
    ["Geely集团","Geely","EX5","geely-nz"],["Geely集团","Geely","EX5 EM-i","geely-nz"],
    ["GWM集团","GWM","Ora 03","gwm-nz"],["GWM集团","GWM","Haval Jolion","gwm-nz","询价","ICE:询价,HEV:询价"],["GWM集团","GWM","Haval H6","gwm-nz","询价","ICE:询价,HEV:询价,PHEV AWD:询价"],["GWM集团","GWM","Tank 300","gwm-nz"],["GWM集团","GWM","Poer","gwm-nz"],
    ["Leapmotor集团","Leapmotor","C10","leap-nz","询价","BEV:询价,REEV:询价"],
    ["Changan集团","Deepal","Deepal S05","deepal-nz","询价","BEV RWD:询价,BEV AWD:询价"],["Changan集团","Deepal","Deepal S07","deepal-nz"],
    ["XPENG集团","XPENG","XPENG G6","xpeng-nz","NZ$ 59.990","RWD Standard Range:NZ$ 59.990,RWD Long Range:询价,AWD Performance:询价"],["XPENG集团","XPENG","XPENG X9","xpeng-nz","NZ$ 104.990","FWD:NZ$ 104.990,AWD:询价"],
  ]),
  "泰国": rs([
    ["BYD集团","BYD","Dolphin","byd-th"],["BYD集团","BYD","Atto 3","byd-th"],["BYD集团","BYD","Seal","byd-th","询价","RWD:询价,AWD:询价"],["BYD集团","BYD","Sealion 6 DM-i","byd-th"],["BYD集团","BYD","Sealion 7","byd-th","询价","RWD:询价,AWD:询价"],["BYD集团","BYD","M6","byd-th"],
    ["Chery集团","Omoda","Omoda 5","oj-th","询价","ICE:询价,HEV:询价"],["Chery集团","Omoda","Omoda E5","oj-th"],["Chery集团","Jaecoo","Jaecoo 5","oj-th","询价","ICE:询价,EV:询价"],["Chery集团","Jaecoo","Jaecoo 7","oj-th","询价","ICE:询价,PHEV:询价"],
    ["Geely集团","Geely","EX5","geely-th"],["Geely集团","Zeekr","Zeekr X","zeekr-th"],["Geely集团","Zeekr","Zeekr 7X","zeekr-th","询价","RWD:询价,AWD:询价"],
    ["GWM集团","GWM","Ora 03","gwm-th"],["GWM集团","GWM","Haval Jolion","gwm-th","询价","ICE:询价,HEV:询价"],["GWM集团","GWM","Haval H6","gwm-th","询价","HEV:询价,PHEV AWD:询价"],["GWM集团","GWM","Tank 300","gwm-th","询价","HEV AWD:询价,PHEV AWD:询价"],["GWM集团","GWM","Tank 500","gwm-th"],
    ["东风集团","Dongfeng","BOX","dongfeng-th"],["东风集团","VOYAH","VOYAH Courage","dongfeng-th","询价","RWD:询价,AWD:询价"],
    ["Leapmotor集团","Leapmotor","B10","leap-th","询价","BEV:询价,REEV:询价"],["Leapmotor集团","Leapmotor","C10","leap-th","询价","BEV:询价,REEV:询价"],
    ["Changan集团","Deepal","Deepal S05","deepal-th","询价","BEV RWD:询价,BEV AWD:询价"],["Changan集团","Deepal","Deepal S07","deepal-th","询价","BEV RWD:询价"],["Changan集团","AVATR","AVATR 07","deepal-th","询价","REEV RWD:询价,REEV AWD:询价"],
    ["XPENG集团","XPENG","XPENG G6","xpeng-th","询价","RWD Standard Range:询价,RWD Long Range:询价,AWD Performance:询价"],["XPENG集团","XPENG","XPENG X9","xpeng-th","询价","FWD:询价,AWD:询价"],
    ["NIO集团","firefly","firefly","firefly-th"],
  ]),
  "印度尼西亚": rs([
    ["BYD集团","BYD","Atto 1","byd-id","IDR 199.000.000","Standard 30.08 kWh:IDR 199.000.000,Dynamic 30.08 kWh:IDR 210.000.000,Premium 38.88 kWh:IDR 245.000.000"],["BYD集团","BYD","Atto 3","byd-id","IDR 415.000.000","Advanced Plus:IDR 415.000.000"],["BYD集团","BYD","Dolphin","byd-id","IDR 369.000.000","Dynamic 44.9 kWh:IDR 369.000.000,Premium 60.48 kWh:IDR 429.000.000"],["BYD集团","BYD","Seal","byd-id","IDR 639.000.000","Premium RWD:IDR 639.000.000,Performance AWD:IDR 750.000.000"],["BYD集团","BYD","M6","byd-id","IDR 395.000.000","Standard 55.4 kWh:IDR 395.000.000,Superior 71.8 kWh:IDR 423.000.000,Superior Captain 71.8 kWh:IDR 433.000.000"],["BYD集团","BYD","M6 DM-i","byd-id","IDR 298.000.000","Classic Standard 7.4 kWh:IDR 298.000.000,Classic Dynamic 7.4 kWh:IDR 318.000.000,Cross Advance 18.3 kWh:IDR 360.000.000,Cross Superior 18.3 kWh:IDR 380.000.000"],["BYD集团","BYD","Sealion 7","byd-id","IDR 629.000.000","Premium RWD:IDR 629.000.000,Performance AWD:IDR 719.000.000"],
    ["Chery集团","Chery","Tiggo 4","chery-id","询价","ICE:询价,HEV:询价"],["Chery集团","Chery","Tiggo 7","chery-id","询价","ICE:询价,PHEV:询价"],["Chery集团","Chery","Tiggo 8 Pro","chery-id","询价","ICE:询价,PHEV:询价"],["Chery集团","Omoda","Omoda 5","chery-id"],["Chery集团","Omoda","Omoda E5","chery-id"],["Chery集团","Jaecoo","Jaecoo 7","chery-id","询价","ICE:询价,PHEV:询价"],
    ["Geely集团","Zeekr","Zeekr X","zeekr-id"],["Geely集团","Zeekr","Zeekr 009","zeekr-id"],
    ["GWM集团","GWM","Ora 03","gwm-id"],["GWM集团","GWM","Haval Jolion","gwm-id","询价","ICE:询价,HEV:询价"],["GWM集团","GWM","Haval H6","gwm-id","询价","HEV:询价,PHEV AWD:询价"],["GWM集团","GWM","Tank 300","gwm-id"],["GWM集团","GWM","Tank 500","gwm-id"],
    ["Changan集团","Deepal","Deepal S05","deepal-id","询价","BEV RWD:询价,BEV AWD:询价"],["Changan集团","Deepal","Deepal S07","deepal-id"],["Changan集团","Changan","Lumin","deepal-id"],
    ["XPENG集团","XPENG","XPENG G6","xpeng-id","询价","RWD:询价,AWD:询价"],["XPENG集团","XPENG","XPENG X9","xpeng-id","询价","FWD:询价,AWD:询价"],
  ]),
  "马来西亚": rs([
    ["BYD集团","BYD","Dolphin","byd-my","MYR 100.000","Dynamic:MYR 100.000,Premium:询价"],["BYD集团","BYD","Atto 2","byd-my"],["BYD集团","BYD","Atto 3","byd-my"],["BYD集团","BYD","Seal","byd-my","询价","RWD:询价,AWD:询价"],["BYD集团","BYD","Seal 6 DM-i","byd-my"],["BYD集团","BYD","Sealion 7","byd-my","询价","RWD:询价,AWD:询价"],["BYD集团","BYD","M6","byd-my"],
    ["Chery集团","Chery","Tiggo 7","chery-my","询价","ICE:询价,PHEV:询价"],["Chery集团","Chery","Tiggo 8 Pro","chery-my","询价","ICE:询价,PHEV:询价"],["Chery集团","Omoda","Omoda 5","chery-my","询价","ICE:询价,HEV:询价"],["Chery集团","Omoda","Omoda E5","chery-my"],["Chery集团","Jaecoo","Jaecoo 7","chery-my","询价","ICE:询价,PHEV:询价"],
    ["Geely集团","Zeekr","Zeekr X","zeekr-my"],["Geely集团","Zeekr","Zeekr 7X","zeekr-my","询价","RWD:询价,AWD:询价"],["Geely集团","Zeekr","Zeekr 009","zeekr-my"],
    ["GWM集团","GWM","Ora 03","gwm-my"],["GWM集团","GWM","Haval Jolion","gwm-my","询价","ICE:询价,HEV:询价"],["GWM集团","GWM","Haval H6","gwm-my","询价","HEV:询价,PHEV AWD:询价"],["GWM集团","GWM","Tank 300","gwm-my"],["GWM集团","GWM","Tank 500","gwm-my"],
    ["东风集团","Dongfeng","BOX","dongfeng-my"],["东风集团","VOYAH","VOYAH Dream","dongfeng-my"],
    ["Leapmotor集团","Leapmotor","B10","leap-my","询价","BEV:询价,REEV:询价"],["Leapmotor集团","Leapmotor","C10","leap-my","询价","BEV:询价,REEV:询价"],
    ["Changan集团","Deepal","Deepal S05","deepal-my","询价","BEV RWD:询价,BEV AWD:询价"],["Changan集团","Deepal","Deepal S07","deepal-my"],
    ["XPENG集团","XPENG","XPENG G6","xpeng-my","询价","RWD:询价,AWD:询价"],["XPENG集团","XPENG","XPENG X9","xpeng-my","询价","FWD:询价,AWD:询价"],
  ]),
  "新加坡": rs([
    ["BYD集团","BYD","Atto 2","byd-sg"],["BYD集团","BYD","Atto 3","byd-sg"],["BYD集团","BYD","Dolphin","byd-sg"],["BYD集团","BYD","Seal","byd-sg","询价","RWD:询价,AWD:询价"],["BYD集团","BYD","Sealion 7","byd-sg","询价","RWD:询价,AWD:询价"],["BYD集团","DENZA","Denza D9","byd-sg","询价","BEV FWD:询价,BEV AWD:询价"],
    ["Chery集团","Omoda","Omoda 5","oj-sg","询价","ICE:询价,HEV:询价"],["Chery集团","Omoda","Omoda E5","oj-sg"],["Chery集团","Jaecoo","Jaecoo 7","oj-sg","询价","ICE:询价,PHEV:询价"],
    ["Geely集团","Zeekr","Zeekr X","zeekr-sg"],["Geely集团","Zeekr","Zeekr 009","zeekr-sg"],
    ["GWM集团","GWM","Ora 03","gwm-sg"],["GWM集团","GWM","Haval H6","gwm-sg","询价","HEV:询价,PHEV AWD:询价"],["GWM集团","GWM","Tank 300","gwm-sg"],
    ["东风集团","VOYAH","VOYAH Free","voyah-sg"],["东风集团","VOYAH","VOYAH Dream","voyah-sg"],
    ["Leapmotor集团","Leapmotor","C10","leap-sg","询价","BEV:询价,REEV:询价"],
    ["Changan集团","Deepal","Deepal S05","deepal-sg","询价","BEV RWD:询价,BEV AWD:询价"],["Changan集团","Deepal","Deepal S07","deepal-sg"],
    ["XPENG集团","XPENG","XPENG G6","xpeng-sg","询价","RWD:询价,AWD:询价"],["XPENG集团","XPENG","XPENG X9","xpeng-sg","询价","FWD:询价,AWD:询价"],
    ["NIO集团","firefly","firefly","firefly-sg"],
  ]),
};

export const strategicSources: Record<string,{name:string,url:string}> = {
  "byd-eu":{name:"BYD Europe｜欧洲官方车型目录",url:"https://www.byd.com/eu/car"},
  "byd-au":{name:"BYD Australia｜官方车型与价格",url:"https://bydautomotive.com.au/"},
  "byd-nz":{name:"BYD New Zealand｜官方车型目录",url:"https://www.bydauto.co.nz/"},
  "byd-th":{name:"BYD Thailand｜官方车型目录",url:"https://www.byd.com/en-th"},
  "byd-id":{name:"BYD Indonesia｜官方车型与价格表",url:"https://www.byd.com/id/pricelist"},
  "byd-my":{name:"BYD Malaysia｜官方车型目录",url:"https://www.byd.com/my"},
  "byd-sg":{name:"BYD Singapore｜官方车型目录",url:"https://www.byd.com/sg"},
  "oj-eu":{name:"OMODA & JAECOO Europe｜欧洲车型目录",url:"https://www.omodajaecoo.com/"},
  "oj-es":{name:"OMODA & JAECOO España｜官方车型与售价",url:"https://www.omodajaecoo.es/"},
  "oj-uk":{name:"OMODA & JAECOO UK｜官方车型目录",url:"https://omodaauto.co.uk/"},
  "chery-il":{name:"Chery Israel｜官方车型目录",url:"https://cheryisrael.co.il/"},
  "chery-au":{name:"Chery Australia｜官方车型与起售价",url:"https://cherymotor.com.au/"},
  "chery-nz":{name:"Chery New Zealand｜官方车型目录",url:"https://chery.co.nz/"},
  "oj-th":{name:"OMODA & JAECOO Thailand｜官方车型目录",url:"https://www.omodajaecoo.co.th/"},
  "chery-id":{name:"Chery Indonesia｜官方车型目录",url:"https://chery.co.id/"},
  "chery-my":{name:"Chery Malaysia｜官方车型目录",url:"https://www.chery.my/"},
  "oj-sg":{name:"OMODA & JAECOO Singapore｜官方车型目录",url:"https://omodajaecoo.com.sg/"},
  "lynk-eu":{name:"Lynk & Co Europe｜官方车型目录",url:"https://www.lynkco.com/en-WW"},
  "zeekr-eu":{name:"ZEEKR Europe｜官方车型目录",url:"https://www.zeekr.eu/"},
  "zeekr-de":{name:"ZEEKR Germany｜官方车型与售价",url:"https://www.zeekr.eu/de-de"},
  "geely-il":{name:"Geely Israel｜官方车型目录",url:"https://geely.co.il/"},
  "geely-au":{name:"Geely Australia｜官方车型目录",url:"https://www.geely.com/en-au"},
  "geely-nz":{name:"Geely New Zealand｜官方车型目录",url:"https://www.geelyauto.co.nz/"},
  "zeekr-au":{name:"ZEEKR Australia｜官方车型目录",url:"https://www.zeekr.com/en-au"},
  "geely-th":{name:"Geely Thailand｜官方车型目录",url:"https://www.geelythailand.com/"},
  "zeekr-th":{name:"ZEEKR Thailand｜官方车型目录",url:"https://www.zeekrlife.com/th-th"},
  "zeekr-id":{name:"ZEEKR Indonesia｜官方车型目录",url:"https://www.zeekrlife.com/id-id"},
  "zeekr-my":{name:"ZEEKR Malaysia｜官方车型目录",url:"https://www.zeekrlife.com/my-en"},
  "zeekr-sg":{name:"ZEEKR Singapore｜官方车型目录",url:"https://www.zeekr.com/en-sg"},
  "gwm-uk":{name:"GWM UK｜官方车型与起售价",url:"https://gwmcars.co.uk/"},
  "gwm-eu":{name:"GWM Europe｜欧洲官方车型目录",url:"https://www.gwm-eu.com/"},
  "gwm-il":{name:"GWM Israel｜官方车型目录",url:"https://www.gwm.co.il/"},
  "gwm-au":{name:"GWM Australia｜官方车型目录",url:"https://www.gwmanz.com/au/"},
  "gwm-nz":{name:"GWM New Zealand｜官方车型目录",url:"https://www.gwmanz.com/nz/"},
  "gwm-th":{name:"GWM Thailand｜官方车型目录",url:"https://www.gwm.co.th/"},
  "gwm-id":{name:"GWM Indonesia｜官方车型目录",url:"https://www.gwm-indonesia.com/"},
  "gwm-my":{name:"GWM Malaysia｜官方车型目录",url:"https://www.gwm.com.my/"},
  "gwm-sg":{name:"GWM Singapore｜官方车型目录",url:"https://www.gwm.com.sg/"},
  "voyah-eu":{name:"VOYAH Global｜欧洲销售车型目录",url:"https://www.voyah-global.com/"},
  "dongfeng-th":{name:"Dongfeng Thailand｜官方车型目录",url:"https://www.dongfeng.co.th/"},
  "dongfeng-my":{name:"Dongfeng Malaysia｜官方车型目录",url:"https://www.dongfeng.com.my/"},
  "voyah-sg":{name:"VOYAH Singapore｜官方车型目录",url:"https://www.voyah.sg/"},
  "leap-eu":{name:"Leapmotor Europe｜官方车型目录",url:"https://www.leapmotor.net/"},
  "leap-au":{name:"Leapmotor Australia｜官方车型目录",url:"https://www.leapmotor.net/au"},
  "leap-nz":{name:"Leapmotor New Zealand｜官方车型目录",url:"https://www.leapmotor.net/nz"},
  "leap-th":{name:"Leapmotor Thailand｜官方车型目录",url:"https://www.leapmotor.net/th"},
  "leap-my":{name:"Leapmotor Malaysia｜官方车型目录",url:"https://www.leapmotor.net/my"},
  "leap-sg":{name:"Leapmotor Singapore｜官方车型目录",url:"https://www.leapmotor.net/sg"},
  "changan-eu":{name:"CHANGAN｜欧洲 DEEPAL 官方发布",url:"https://www.globalchangan.com/newsroom/changan-automobile-launches-changan-deepal-and-avatr-in-europe-ushering-in-a-new-era-of-evs.html"},
  "deepal-au":{name:"DEEPAL Australia｜官方车型目录",url:"https://www.deepal.com.au/"},
  "deepal-nz":{name:"DEEPAL New Zealand｜官方车型目录",url:"https://www.deepal.co.nz/"},
  "deepal-th":{name:"DEEPAL Thailand｜官方车型目录",url:"https://www.deepal.co.th/"},
  "deepal-id":{name:"DEEPAL Indonesia｜官方车型目录",url:"https://www.deepal.id/"},
  "deepal-my":{name:"DEEPAL Malaysia｜官方车型目录",url:"https://www.deepal.com.my/"},
  "deepal-sg":{name:"CHANGAN｜DEEPAL Singapore 官方发布",url:"https://www.globalchangan.com/newsroom/deepal-s05-unveiled-at-the-singapore-motorshow-2026-aimed-at-the-coe-category-a-segment.html"},
  "xpeng-eu":{name:"XPENG Europe｜欧洲官方车型目录",url:"https://www.xpeng.com/eu"},
  "xpeng-no":{name:"XPENG Norway｜官方车型与配置",url:"https://www.xpeng.com/no"},
  "xpeng-nl":{name:"XPENG Netherlands｜官方车型与配置",url:"https://www.xpeng.com/nl/"},
  "xpeng-uk":{name:"XPENG UK｜G6 官方上市价格",url:"https://www.xpeng.com/news/0194f9d174999467d6e98a0282160052"},
  "xpeng-au":{name:"XPENG Australia｜官方车型与配置",url:"https://www.xpeng.com/au"},
  "xpeng-nz":{name:"XPENG New Zealand｜官方车型与起售价",url:"https://website-eu.x-peng.com/nz"},
  "xpeng-th":{name:"XPENG Thailand｜官方车型与配置",url:"https://store.xpeng.com/th/configurator/G6_R"},
  "xpeng-id":{name:"XPENG Indonesia｜官方车型目录",url:"https://www.xpeng.com/id"},
  "xpeng-my":{name:"XPENG Malaysia｜官方车型目录",url:"https://www.xpeng.com/my"},
  "xpeng-sg":{name:"XPENG Singapore｜官方车型目录",url:"https://www.xpeng.com/sg"},
  "nio-eu":{name:"NIO Europe｜官方车型目录",url:"https://www.nio.com/de_DE"},
  "nio-no":{name:"NIO Norway｜官方库存与车型",url:"https://www.nio.com/no_NO/inventory"},
  "nio-nl":{name:"NIO Netherlands｜官方车型与订阅",url:"https://www.nio.com/nl_NL/subscription/product"},
  "nio-se":{name:"NIO Sweden｜官方车型与订阅",url:"https://www.nio.com/sv_SE/subscription/product"},
  "nio-de":{name:"NIO Germany｜官方车型与订阅",url:"https://www.nio.com/de_DE/subscription/product"},
  "firefly-eu":{name:"firefly Europe｜官方车型页",url:"https://www.firefly.world/nl_NL/firefly"},
  "firefly-th":{name:"firefly｜泰国官方上市公告",url:"https://www.firefly.world/news/20260324001"},
  "firefly-sg":{name:"firefly｜新加坡官方上市公告",url:"https://www.firefly.world/news/20260108001"},
};

export const strategicImages: Record<string,string> = {
  "Dolphin Surf":"/cars/dolphin-mini.jpg","Atto 1":"/cars/dolphin-mini.jpg","Atto 2":"/cars/yuan-up.jpg","Atto 3":"/cars/yuan-plus.jpg",
  "Seal U DM-i":"https://i0.wp.com/www.electrifiedmagazin.de/wp-content/uploads/2024/05/BYD_SEAL_U_DM-I__EXTERIOR_025.jpg?ssl=1",
  "Seal 6 DM-i":"/cars/king.jpg","Seal 6 Touring":"/cars/king.jpg","Sealion 5 DM-i":"/cars/song-pro.jpg","Sealion 6 DM-i":"/cars/song-plus.jpg","Sealion 8 DM-i":"/cars/atto-8.jpg",
  "M6":"https://motomobinews.id/wp-content/uploads/2024/08/BYD-M6_Review-BDG_1.jpg","M6 DM-i":"https://motomobinews.id/wp-content/uploads/2024/08/BYD-M6_Review-BDG_1.jpg",
  "B05":"https://www.leapmotor.net/content/dam/leapmotor/cross-regional/eu/b05/B05-homepage-desktop.jpg",
  "Zeekr 7X":"https://builder-io.imgix.net/assets/abf848f2753846b5ba2407de096a5a71/ec06d53112054cf788fe4343d6541376?auto=format&fit=crop&h=649&w=1440",
  "Zeekr 009":"https://www.datocms-assets.com/143770/1730254172-rectangle-46228942.jpg?auto=format",
  "Lynk & Co 02":"https://fde-web-prd-001-gdegamg8eeebbuf9.z01.azurefd.net/-/jssmedia/lynkco-global-portal/media-library-2025/02/02-gallery/hero-onyx-black/02-more-onyx-black-fromside-1-l.jpg?h=639&hash=BBFA4A086809AE2BFD95889752C1BDFC&iar=0&rev=-1&w=1136",
  "Lynk & Co 08":"https://press.lynkco.com/image/low/247253/2933672/high?v=2",
  "WEY 03":"/cars/wey-07.jpg","WEY 05":"/cars/wey-07.jpg",
  "VOYAH Free":"https://rgrcgstor01.blob.core.windows.net/voyahpt-682dd92db82f93402a08b68c-prod/free1920x10801.webp",
  "VOYAH Courage":"https://img.stcrm.it/images/41052742/3000x/voyah-courage-2024-1-risultato.jpeg",
  "VOYAH Dream":"https://voyah.dk/wp-content/uploads/2023/10/Dream_eksteriaer_1920x1200.jpg",
  "XPENG G6":"https://assets.seobotai.com/ev24.africa/683ba2c80194258b64ab4026/05107436b94c8b1a76ba39a4a6de3a13.jpg",
  "XPENG G9":"https://movilidadelectrica.com/wp-content/uploads/2024/04/speng-e1712647230670.jpg",
  "XPENG P7+":"https://i0.wp.com/electrek.co/wp-content/uploads/sites/3/2024/10/XPeng-P7-pricing-hero.jpg?quality=82&resize=1200%2C628&ssl=1&strip=all",
  "XPENG X9":"https://assets.autobuzz.my/wp-content/uploads/2024/03/15113536/2024-XPeng-X9-1.jpg",
  "NIO ET5":"https://static.eu.nio.com/fx-static/mp-testdrive-fe/clcuar002000007774m7vg3wo/ET5_NL.png",
  "NIO ET5 Touring":"https://editorial.pxcrush.net/carsales/general/editorial/nio-et5-wagon-01.jpg?height=682&width=1024",
  "NIO EL6":"https://carwow-es-wp-2.imgix.net/nio-modelos-europa-5.jpg?auto=format&cs=tinysrgb&fit=crop&q=60&w=1600",
  "NIO EL8":"https://www-cdn.eu.nio.com/officialsite/editor/upload/stg/d3b6e9ee-e6d2-4d71-b17f-ecdb78a7bedd/exterior-design-1-desktop.jpg",
  "firefly":"https://cdn-up-public.firefly.world/www-firefly/upload-local/2025-04-22/page_exteriorColors/item-02-desktop.jpg",
};

export const strategicDriveByModel: Record<string,string> = {
  "Atto 1":"前驱","Atto 2":"前驱","Atto 3":"前驱","Seal U DM-i":"前驱 / 四驱","Seal 6 DM-i":"前驱","Seal 6 Touring":"前驱","Sealion 5 DM-i":"前驱","Sealion 6 DM-i":"前驱 / 四驱","Sealion 8 DM-i":"四驱","M6":"前驱","M6 DM-i":"前驱","B05":"前驱",
  "Zeekr 7X":"后驱 / 四驱","Zeekr 009":"四驱","Lynk & Co 02":"后驱","Lynk & Co 08":"四驱","WEY 03":"四驱","WEY 05":"四驱","VOYAH Free":"四驱","VOYAH Courage":"后驱 / 四驱","VOYAH Dream":"四驱",
  "XPENG G6":"后驱 / 四驱","XPENG G9":"后驱 / 四驱","XPENG P7+":"后驱 / 四驱","XPENG X9":"前驱 / 四驱","NIO ET5":"四驱","NIO ET5 Touring":"四驱","NIO EL6":"四驱","NIO EL8":"四驱","firefly":"后驱",
};

export const strategicBatteryByModel: Record<string,string> = {
  "Dolphin Surf":"30–43.2 kWh*","Atto 1":"30.08–38.88 kWh","Atto 2":"45.1–64.8 kWh*","Atto 3":"60.48 kWh","Seal U DM-i":"18.3–26.6 kWh","Seal 6 DM-i":"10.1–19 kWh*","Seal 6 Touring":"10.1–19 kWh*","Sealion 5 DM-i":"12.9–18.3 kWh","Sealion 6 DM-i":"18.3–26.6 kWh","Sealion 8 DM-i":"约 35.6 kWh*","M6":"55.4–71.8 kWh","M6 DM-i":"7.4–18.3 kWh","B05":"56.2–67.1 kWh*","Zeekr 7X":"75–100 kWh","Zeekr 009":"116 kWh","Lynk & Co 02":"66 kWh","Lynk & Co 08":"39.6 kWh","WEY 03":"34 kWh*","WEY 05":"39.7 kWh*","VOYAH Free":"106.7 kWh","VOYAH Courage":"80 kWh*","VOYAH Dream":"108.7 kWh","XPENG G6":"68.5–80.8 kWh","XPENG G9":"79–98 kWh","XPENG P7+":"74.9 kWh","XPENG X9":"94.8–110 kWh","NIO ET5":"75 / 100 kWh","NIO ET5 Touring":"75 / 100 kWh","NIO EL6":"75 / 100 kWh","NIO EL8":"75 / 100 kWh","firefly":"42.1 kWh",
};
