"use client";

import { useMemo, useState } from "react";
import {
  regionCountries,
  strategicBatteryByModel,
  strategicDriveByModel,
  strategicImages,
  strategicRaw,
  strategicSources,
  strategicSpecs,
} from "./strategic-market-data";

type Trim = { name: string; price: string };
type Spec = { dims: string; wheelbase: string; energy: string; use: string; range: string; safety: string; rating: "yes"|"unknown" };
type PowerCar = Spec & { id:string; country:string; flag:string; group:string; brand:string; model:string; variant:string; image:string; price:string; trims:Trim[]; source:string; verified:string };
type Car = PowerCar & { drive:string };
type BrandModelOverview = { key:string; name:string; image:string; powers:{name:string;configs:string[];total:number}[]; regions:string[]; countries:{name:string;flag:string}[]; aliases:string[] };

const countries = regionCountries.flatMap(region => region.countries.map(([name,flag]) => [name,flag] as const));
const regionOfCountry = (country:string) => regionCountries.find(region=>region.countries.some(([name])=>name===country))?.name || "";

const brandsByGroup: Record<string,string[]> = {
  "BYD集团":["BYD","DENZA"],
  "Chery集团":["Chery","Omoda","Jaecoo","Exeed","Jetour"],
  "Geely集团":["Geely","Zeekr","Lynk&Co"],
  "GWM集团":["GWM"],
  "东风集团":["Dongfeng","VOYAH"],
  "Leapmotor集团":["Leapmotor"],
  "Changan集团":["Changan","Deepal","AVATR"],
  "XPENG集团":["XPENG"],
  "NIO集团":["NIO","firefly"],
};
const groups = Object.keys(brandsByGroup);
const groupLabels: Record<string,string> = {"BYD集团":"BYD","Chery集团":"CHERY","Geely集团":"GEELY","GWM集团":"GWM","东风集团":"DONGFENG","Leapmotor集团":"LEAPMOTOR","Changan集团":"CHANGAN","XPENG集团":"XPENG","NIO集团":"NIO"};

const baseSpecs: Record<string, Spec> = {
  "Dolphin Mini": {dims:"3,780 × 1,715 × 1,580 mm",wheelbase:"2,500 mm",energy:"纯电 BEV",use:"约 12.1 kWh/100km",range:"280–380 km*",safety:"未查到当地版本有效五星成绩",rating:"unknown"},
  "Dolphin": {dims:"4,290 × 1,770 × 1,570 mm",wheelbase:"2,705 mm",energy:"纯电 BEV",use:"约 12.0 kWh/100km",range:"291–427 km*",safety:"5★ ANCAP / Euro NCAP",rating:"yes"},
  "Yuan Pro": {dims:"4,310 × 1,830 × 1,675 mm",wheelbase:"2,620 mm",energy:"纯电 BEV",use:"约 12.0 kWh/100km",range:"250–380 km*",safety:"未查到当地版本有效五星成绩",rating:"unknown"},
  "Yuan Up": {dims:"4,310 × 1,830 × 1,675 mm",wheelbase:"2,620 mm",energy:"纯电 BEV",use:"约 12.0 kWh/100km",range:"最高 401 km NEDC*",safety:"未查到当地版本有效五星成绩",rating:"unknown"},
  "Yuan Up DM-i": {dims:"4,310 × 1,830 × 1,675 mm",wheelbase:"2,620 mm",energy:"插混 PHEV",use:"当地官网未公布",range:"当地官网未公布",safety:"未查到当地版本有效五星成绩",rating:"unknown"},
  "Yuan Plus": {dims:"4,455 × 1,875 × 1,615 mm",wheelbase:"2,720 mm",energy:"纯电 BEV",use:"约 15.6 kWh/100km",range:"420 km WLTP",safety:"5★ Euro NCAP / ANCAP",rating:"yes"},
  "Song Pro": {dims:"4,738 × 1,860 × 1,710 mm",wheelbase:"2,712 mm",energy:"插混 PHEV",use:"约 4.5 L/100km",range:"约 1,000 km 综合*",safety:"未查到当地版本有效五星成绩",rating:"unknown"},
  "Song Plus": {dims:"4,775 × 1,890 × 1,670 mm",wheelbase:"2,765 mm",energy:"插混 PHEV",use:"约 5.1 L/100km",range:"约 1,100 km 综合*",safety:"5★ Latin NCAP (2025)",rating:"yes"},
  "King": {dims:"4,780 × 1,837 × 1,495 mm",wheelbase:"2,718 mm",energy:"插混 PHEV",use:"约 3.8 L/100km",range:"约 1,200 km 综合*",safety:"未查到当地版本有效五星成绩",rating:"unknown"},
  "Seal": {dims:"4,800 × 1,875 × 1,460 mm",wheelbase:"2,920 mm",energy:"纯电 BEV",use:"约 14.8 kWh/100km",range:"520–570 km WLTP",safety:"5★ Euro NCAP / ANCAP",rating:"yes"},
  "Sealion 7": {dims:"4,830 × 1,925 × 1,620 mm",wheelbase:"2,930 mm",energy:"纯电 BEV",use:"约 19.9 kWh/100km",range:"456–502 km WLTP",safety:"5★ Euro NCAP / ANCAP",rating:"yes"},
  "Tang": {dims:"4,970 × 1,955 × 1,745 mm",wheelbase:"2,820 mm",energy:"纯电 BEV",use:"约 24.0 kWh/100km",range:"最高 530 km WLTP*",safety:"5★ Euro NCAP（适用版本）",rating:"yes"},
  "Atto 8": {dims:"5,040 × 1,996 × 1,760 mm",wheelbase:"2,950 mm",energy:"插混 PHEV",use:"当地官网未公布",range:"约 1,000 km 综合*",safety:"未查到当地版本有效五星成绩",rating:"unknown"},
  "Shark": {dims:"5,457 × 1,971 × 1,925 mm",wheelbase:"3,260 mm",energy:"插混 PHEV",use:"约 2.0 L/100km 等效*",range:"约 840 km 综合*",safety:"5★ ANCAP (2024)",rating:"yes"},
  "Denza B5": {dims:"4,890 × 1,970 × 1,920 mm",wheelbase:"2,800 mm",energy:"插混 PHEV",use:"约 7.8 L/100km 馈电*",range:"约 1,200 km 综合*",safety:"未查到当地版本有效五星成绩",rating:"unknown"},
  "Denza D9": {dims:"5,250 × 1,960 × 1,920 mm",wheelbase:"3,110 mm",energy:"插混 PHEV / 纯电",use:"依版本",range:"最高 600 km 纯电*",safety:"5★ Euro NCAP (2024)",rating:"yes"},
  "Tiggo 2 Pro": {dims:"4,200 × 1,760 × 1,570 mm",wheelbase:"2,555 mm",energy:"汽油 ICE",use:"约 7.4 L/100km",range:"—",safety:"未查到有效五星成绩",rating:"unknown"},
  "Tiggo 4": {dims:"4,320 × 1,831 × 1,652 mm",wheelbase:"2,610 mm",energy:"汽油 ICE",use:"约 7.2 L/100km*",range:"—",safety:"未查到有效五星成绩",rating:"unknown"},
  "Tiggo 4 CSH": {dims:"4,320 × 1,831 × 1,652 mm",wheelbase:"2,610 mm",energy:"油电混动 HEV",use:"约 5.4 L/100km",range:"—",safety:"5★ ANCAP (2025)",rating:"yes"},
  "Tiggo 5X": {dims:"4,358 × 1,830 × 1,670 mm",wheelbase:"2,630 mm",energy:"汽油 / 轻混",use:"约 6.8 L/100km",range:"—",safety:"未查到有效五星成绩",rating:"unknown"},
  "Tiggo 7": {dims:"4,553 × 1,862 × 1,696 mm",wheelbase:"2,670 mm",energy:"汽油 / HEV / PHEV",use:"依版本",range:"PHEV 约 1,200 km 综合*",safety:"5★ ANCAP（适用版本）",rating:"yes"},
  "Tiggo 8 Pro": {dims:"4,722 × 1,860 × 1,705 mm",wheelbase:"2,710 mm",energy:"汽油 / PHEV",use:"依版本",range:"PHEV 约 1,200 km 综合*",safety:"5★ ANCAP（适用版本）",rating:"yes"},
  "Arrizo 8 CSH": {dims:"4,757 × 1,832 × 1,487 mm",wheelbase:"2,770 mm",energy:"插混 PHEV",use:"约 4.2 L/100km 馈电*",range:"约 1,400 km 综合*",safety:"未查到有效五星成绩",rating:"unknown"},
  "Arrizo 5 Pro": {dims:"4,572 × 1,825 × 1,482 mm",wheelbase:"2,670 mm",energy:"汽油 ICE",use:"约 7.0 L/100km*",range:"—",safety:"未查到有效五星成绩",rating:"unknown"},
  "M7": {dims:"当地官网未公布",wheelbase:"当地官网未公布",energy:"汽油 ICE",use:"当地官网未公布",range:"—",safety:"未查到有效五星成绩",rating:"unknown"},
  "Tiggo 9": {dims:"4,810 × 1,925 × 1,741 mm",wheelbase:"2,800 mm",energy:"汽油 ICE",use:"约 8.3 L/100km*",range:"—",safety:"5★ ANCAP（适用版本）",rating:"yes"},
  "Himla": {dims:"5,335 × 1,920 × 1,890 mm",wheelbase:"3,230 mm",energy:"汽油 ICE",use:"当地官网未公布",range:"—",safety:"未查到有效五星成绩",rating:"unknown"},
  "Omoda 5": {dims:"4,373 × 1,824 × 1,588 mm",wheelbase:"2,610 mm",energy:"汽油 / HEV",use:"约 6.9 L/100km",range:"—",safety:"5★ Euro NCAP / ANCAP",rating:"yes"},
  "Omoda E5": {dims:"4,424 × 1,830 × 1,588 mm",wheelbase:"2,630 mm",energy:"纯电 BEV",use:"约 15.5 kWh/100km",range:"430 km WLTP",safety:"5★ Euro NCAP",rating:"yes"},
  "Jaecoo 5": {dims:"4,380 × 1,860 × 1,650 mm",wheelbase:"2,620 mm",energy:"汽油 / 纯电",use:"依版本",range:"EV 约 400 km*",safety:"未查到有效五星成绩",rating:"unknown"},
  "Jaecoo 6": {dims:"4,406 × 1,910 × 1,715 mm",wheelbase:"2,715 mm",energy:"纯电 BEV",use:"约 18 kWh/100km",range:"约 470 km CLTC*",safety:"未查到有效五星成绩",rating:"unknown"},
  "Jaecoo 7": {dims:"4,500 × 1,865 × 1,680 mm",wheelbase:"2,672 mm",energy:"汽油 / PHEV",use:"依版本",range:"PHEV 约 1,200 km 综合*",safety:"5★ Euro NCAP / ANCAP",rating:"yes"},
  "Jaecoo 8": {dims:"4,820 × 1,930 × 1,710 mm",wheelbase:"2,820 mm",energy:"汽油 / PHEV",use:"依版本",range:"PHEV 约 1,200 km 综合*",safety:"未查到有效五星成绩",rating:"unknown"},
  "Exeed LX": {dims:"4,533 × 1,848 × 1,699 mm",wheelbase:"2,650 mm",energy:"汽油 ICE",use:"约 7.8 L/100km",range:"—",safety:"未查到有效五星成绩",rating:"unknown"},
  "Exeed TXL": {dims:"4,780 × 1,885 × 1,730 mm",wheelbase:"2,800 mm",energy:"汽油 ICE",use:"约 8.3 L/100km",range:"—",safety:"未查到有效五星成绩",rating:"unknown"},
  "Jetour X50": {dims:"4,397 × 1,841 × 1,654 mm",wheelbase:"2,601 mm",energy:"汽油 ICE",use:"约 7.5 L/100km",range:"—",safety:"未查到有效五星成绩",rating:"unknown"},
  "Jetour Dashing": {dims:"4,590 × 1,900 × 1,685 mm",wheelbase:"2,720 mm",energy:"汽油 ICE",use:"约 7.8 L/100km",range:"—",safety:"未查到有效五星成绩",rating:"unknown"},
  "Jetour X70": {dims:"4,749 × 1,900 × 1,720 mm",wheelbase:"2,745 mm",energy:"汽油 ICE",use:"约 8.1 L/100km",range:"—",safety:"未查到有效五星成绩",rating:"unknown"},
  "Jetour T2": {dims:"4,785 × 2,006 × 1,880 mm",wheelbase:"2,800 mm",energy:"汽油 / PHEV",use:"依版本",range:"PHEV 约 1,100 km 综合*",safety:"未查到有效五星成绩",rating:"unknown"},
  "Jetour T1": {dims:"4,705 × 1,967 × 1,843 mm",wheelbase:"2,800 mm",energy:"汽油 / PHEV",use:"依版本",range:"PHEV 约 1,300 km 综合*",safety:"未查到当地版本有效五星成绩",rating:"unknown"},
  "GX3 Pro": {dims:"4,005 × 1,760 × 1,575 mm",wheelbase:"2,480 mm",energy:"汽油 ICE",use:"约 6.5 L/100km",range:"—",safety:"未查到有效五星成绩",rating:"unknown"},
  "Emgrand": {dims:"4,638 × 1,822 × 1,460 mm",wheelbase:"2,650 mm",energy:"汽油 ICE",use:"约 6.5 L/100km*",range:"—",safety:"未查到当地版本有效五星成绩",rating:"unknown"},
  "Coolray": {dims:"4,380 × 1,810 × 1,615 mm",wheelbase:"2,600 mm",energy:"汽油 ICE",use:"约 6.3 L/100km",range:"—",safety:"未查到当地版本有效五星成绩",rating:"unknown"},
  "Cityray": {dims:"4,510 × 1,865 × 1,650 mm",wheelbase:"2,701 mm",energy:"汽油 ICE",use:"约 6.5 L/100km",range:"—",safety:"未查到有效五星成绩",rating:"unknown"},
  "Starray": {dims:"4,670 × 1,900 × 1,705 mm",wheelbase:"2,777 mm",energy:"汽油 ICE",use:"约 7.0 L/100km",range:"—",safety:"未查到有效五星成绩",rating:"unknown"},
  "Okavango": {dims:"4,860 × 1,910 × 1,770 mm",wheelbase:"2,825 mm",energy:"汽油 / 轻混",use:"约 7.7 L/100km",range:"—",safety:"未查到有效五星成绩",rating:"unknown"},
  "EX2": {dims:"4,135 × 1,805 × 1,570 mm",wheelbase:"2,650 mm",energy:"纯电 BEV",use:"约 10.2 kWh/100km",range:"289–350 km*",safety:"未查到有效五星成绩",rating:"unknown"},
  "EX5": {dims:"4,615 × 1,901 × 1,670 mm",wheelbase:"2,750 mm",energy:"纯电 BEV",use:"约 15.9 kWh/100km",range:"413–430 km WLTP",safety:"5★ Euro NCAP / ANCAP",rating:"yes"},
  "EX5 EM-i": {dims:"4,740 × 1,905 × 1,685 mm",wheelbase:"2,755 mm",energy:"插混 PHEV",use:"约 2.4 L/100km 等效*",range:"约 1,400 km 综合*",safety:"未查到该动力版本有效五星",rating:"unknown"},
  "Zeekr X": {dims:"4,450 × 1,836 × 1,572 mm",wheelbase:"2,750 mm",energy:"纯电 BEV",use:"约 16.5 kWh/100km",range:"425–446 km WLTP",safety:"5★ Euro NCAP",rating:"yes"},
  "Zeekr 001": {dims:"4,977 × 1,999 × 1,545 mm",wheelbase:"3,005 mm",energy:"纯电 BEV",use:"约 18.2 kWh/100km",range:"最高 620 km WLTP",safety:"5★ Euro NCAP",rating:"yes"},
  "Lynk & Co 01": {dims:"4,549 × 1,860 × 1,689 mm",wheelbase:"2,734 mm",energy:"插混 PHEV",use:"约 1.0 L/100km 等效*",range:"约 75 km 纯电 WLTP",safety:"5★ Euro NCAP",rating:"yes"},
  "Lynk & Co 06": {dims:"4,340 × 1,820 × 1,625 mm",wheelbase:"2,640 mm",energy:"汽油 / PHEV",use:"依版本",range:"PHEV 约 100 km 纯电*",safety:"未查到有效五星成绩",rating:"unknown"},
  "Ora 03": {dims:"4,235 × 1,825 × 1,603 mm",wheelbase:"2,650 mm",energy:"纯电 BEV",use:"约 15.8 kWh/100km",range:"310–420 km WLTP",safety:"5★ Euro NCAP / ANCAP",rating:"yes"},
  "Haval Jolion": {dims:"4,472 × 1,841 × 1,619 mm",wheelbase:"2,700 mm",energy:"汽油 / HEV",use:"约 5.0 L/100km (HEV)",range:"—",safety:"5★ ANCAP",rating:"yes"},
  "Haval H6": {dims:"4,703 × 1,886 × 1,730 mm",wheelbase:"2,738 mm",energy:"汽油 / HEV / PHEV",use:"依版本",range:"PHEV 约 100 km 纯电*",safety:"5★ ANCAP",rating:"yes"},
  "Haval H7": {dims:"4,705 × 1,908 × 1,780 mm",wheelbase:"2,810 mm",energy:"油电混动 HEV",use:"当地官网未公布",range:"—",safety:"未查到当地版本有效五星成绩",rating:"unknown"},
  "Haval H9": {dims:"4,950 × 1,976 × 1,930 mm",wheelbase:"2,850 mm",energy:"柴油 ICE",use:"约 10.7 L/100km",range:"—",safety:"未查到有效五星成绩",rating:"unknown"},
  "Tank 300": {dims:"4,760 × 1,930 × 1,903 mm",wheelbase:"2,750 mm",energy:"汽油 / HEV / PHEV",use:"依版本",range:"PHEV 约 75 km 纯电*",safety:"5★ ANCAP",rating:"yes"},
  "Tank 500": {dims:"5,078 × 1,934 × 1,905 mm",wheelbase:"2,850 mm",energy:"油电混动 HEV",use:"约 8.5 L/100km",range:"—",safety:"5★ ANCAP",rating:"yes"},
  "Poer": {dims:"5,410 × 1,934 × 1,886 mm",wheelbase:"3,230 mm",energy:"柴油 ICE",use:"约 9.5 L/100km",range:"—",safety:"5★ ANCAP（适用版本）",rating:"yes"},
  "Wingle 5": {dims:"5,095 × 1,800 × 1,730 mm",wheelbase:"3,050 mm",energy:"汽油 / 柴油",use:"依版本",range:"—",safety:"未查到有效五星成绩",rating:"unknown"},
  "Wingle 7": {dims:"5,395 × 1,800 × 1,760 mm",wheelbase:"3,350 mm",energy:"柴油 ICE",use:"约 8.8 L/100km*",range:"—",safety:"未查到有效五星成绩",rating:"unknown"},
  "Poer P500": {dims:"5,445 × 1,991 × 1,924 mm",wheelbase:"3,350 mm",energy:"柴油 / HEV",use:"依版本",range:"—",safety:"5★ ANCAP",rating:"yes"},
  "WEY 07": {dims:"5,156 × 1,980 × 1,805 mm",wheelbase:"3,050 mm",energy:"插混 PHEV",use:"官方未披露",range:"纯电 185 km WLTP / 128 km INMETRO",safety:"未查到可对应的 Latin NCAP / Euro NCAP / ANCAP 五星成绩",rating:"unknown"},
  "BOX": {dims:"4,030 × 1,810 × 1,570 mm",wheelbase:"2,660 mm",energy:"纯电 BEV",use:"当地官网未公布",range:"310 km WLTC",safety:"未查到当地版本有效五星成绩",rating:"unknown"},
  "Nammi": {dims:"4,030 × 1,810 × 1,570 mm",wheelbase:"2,660 mm",energy:"纯电 BEV",use:"当地官网未公布",range:"330–430 km CLTC",safety:"未查到当地版本有效五星成绩",rating:"unknown"},
  "Vigo": {dims:"4,306 × 1,868 × 1,645 mm",wheelbase:"2,715 mm",energy:"纯电 BEV",use:"当地官网未公布",range:"最高约 471 km CLTC*",safety:"未查到当地版本有效五星成绩",rating:"unknown"},
  "E70": {dims:"4,680 × 1,720 × 1,530 mm",wheelbase:"2,700 mm",energy:"纯电 BEV",use:"当地官网未公布",range:"约 400 km NEDC*",safety:"未查到当地版本有效五星成绩",rating:"unknown"},
  "Mage": {dims:"4,650 × 1,905 × 1,630 mm",wheelbase:"2,775 mm",energy:"汽油 ICE",use:"当地官网未公布",range:"—",safety:"未查到当地版本有效五星成绩",rating:"unknown"},
  "Mage HEV": {dims:"4,650 × 1,905 × 1,630 mm",wheelbase:"2,775 mm",energy:"油电混动 HEV",use:"约 3.75 L/100km NEDC*",range:"约 1,000 km 综合*",safety:"未查到当地版本有效五星成绩",rating:"unknown"},
  "Mage EV": {dims:"4,670 × 1,900 × 1,613 mm",wheelbase:"2,775 mm",energy:"纯电 BEV",use:"当地官网未公布",range:"445 km CLTC",safety:"未查到当地版本有效五星成绩",rating:"unknown"},
  "Huge HEV": {dims:"4,720 × 1,910 × 1,702 mm",wheelbase:"2,825 mm",energy:"油电混动 HEV",use:"当地官网未公布",range:"当地官网未公布",safety:"未查到当地版本有效五星成绩",rating:"unknown"},
  "Paladin": {dims:"4,882 × 1,850 × 1,875 mm",wheelbase:"2,850 mm",energy:"汽油 ICE",use:"当地官网未公布",range:"—",safety:"未查到当地版本有效五星成绩",rating:"unknown"},
  "Rich 6": {dims:"5,290 × 1,850 × 1,810 mm",wheelbase:"3,150 mm",energy:"汽油 / 柴油",use:"依版本",range:"—",safety:"未查到当地版本有效五星成绩",rating:"unknown"},
  "Rich 7": {dims:"5,287 × 1,850 × 1,832 mm",wheelbase:"3,150 mm",energy:"柴油 ICE",use:"当地官网未公布",range:"—",safety:"未查到当地版本有效五星成绩",rating:"unknown"},
  "Z9": {dims:"5,520 × 1,960 × 1,950 mm",wheelbase:"3,300 mm",energy:"柴油 ICE",use:"当地官网未公布",range:"—",safety:"未查到当地版本有效五星成绩",rating:"unknown"},
  "T03": {dims:"3,620 × 1,652 × 1,605 mm",wheelbase:"2,400 mm",energy:"纯电 BEV",use:"约 13.8 kWh/100km*",range:"280 km WLTP / 418 km CLTC*",safety:"未查到当地版本有效五星成绩",rating:"unknown"},
  "B10": {dims:"4,515 × 1,885 × 1,655 mm",wheelbase:"2,735 mm",energy:"纯电 BEV / 增程 REEV",use:"依动力版本",range:"360–540 km 纯电 / 超过 900 km 综合*",safety:"5★ Euro NCAP（适用版本）",rating:"yes"},
  "C10": {dims:"4,739 × 1,900 × 1,680 mm",wheelbase:"2,825 mm",energy:"纯电 BEV / 增程 REEV",use:"依动力版本",range:"480–530 km 纯电 / 1,000–1,190 km 综合*",safety:"5★ Euro NCAP / ANCAP（适用版本）",rating:"yes"},
  "C11": {dims:"4,750 × 1,905 × 1,675 mm",wheelbase:"2,930 mm",energy:"纯电 BEV / 增程 REEV",use:"依动力版本",range:"500 km 纯电 / 1,210 km 综合*",safety:"未查到当地版本有效五星成绩",rating:"unknown"},
  "C16": {dims:"4,915 × 1,905 × 1,770 mm",wheelbase:"2,825 mm",energy:"纯电 BEV / 增程 REEV",use:"依动力版本",range:"502 km 纯电 / 1,095 km 综合*",safety:"未查到当地版本有效五星成绩",rating:"unknown"},
  "UNI-T": {dims:"4,515 × 1,870 × 1,565 mm",wheelbase:"2,710 mm",energy:"汽油 ICE",use:"约 7.0 L/100km*",range:"—",safety:"未查到当地版本有效五星成绩",rating:"unknown"},
  "CS55 Plus": {dims:"4,539 × 1,865 × 1,680 mm",wheelbase:"2,656 mm",energy:"汽油 ICE / 插混 PHEV",use:"依动力版本",range:"PHEV 约 1,040–1,215 km 综合*",safety:"未查到当地版本有效五星成绩",rating:"unknown"},
  "Eado Plus": {dims:"4,770 × 1,840 × 1,440 mm",wheelbase:"2,765 mm",energy:"插混 PHEV",use:"当地官网未公布",range:"995 km 综合 / 125 km 纯电 NEDC*",safety:"未查到当地版本有效五星成绩",rating:"unknown"},
  "Lumin": {dims:"3,270 × 1,700 × 1,545 mm",wheelbase:"1,980 mm",energy:"纯电 BEV",use:"10.4 kWh/100km NEDC",range:"205–301 km CLTC / NEDC*",safety:"未查到当地版本有效五星成绩",rating:"unknown"},
  "CS75 Plus": {dims:"4,710 × 1,865 × 1,710 mm",wheelbase:"2,710 mm",energy:"汽油 ICE",use:"约 7.5 L/100km*",range:"—",safety:"未查到当地版本有效五星成绩",rating:"unknown"},
  "Alsvin": {dims:"4,390 × 1,725 × 1,490 mm",wheelbase:"2,535 mm",energy:"汽油 ICE",use:"约 5.8 L/100km*",range:"—",safety:"未查到当地版本有效五星成绩",rating:"unknown"},
  "CS35 Max": {dims:"4,540 × 1,860 × 1,620 mm",wheelbase:"2,715 mm",energy:"汽油 ICE",use:"约 6.8 L/100km*",range:"—",safety:"未查到当地版本有效五星成绩",rating:"unknown"},
  "CS35 Plus": {dims:"4,330 × 1,825 × 1,660 mm",wheelbase:"2,600 mm",energy:"汽油 ICE",use:"约 6.6 L/100km*",range:"—",safety:"未查到当地版本有效五星成绩",rating:"unknown"},
  "CS15": {dims:"4,135 × 1,740 × 1,630 mm",wheelbase:"2,520 mm",energy:"汽油 ICE",use:"约 6.5 L/100km*",range:"—",safety:"未查到当地版本有效五星成绩",rating:"unknown"},
  "UNI-K": {dims:"4,865 × 1,948 × 1,695 mm",wheelbase:"2,890 mm",energy:"汽油 ICE",use:"约 8.4 L/100km*",range:"—",safety:"未查到当地版本有效五星成绩",rating:"unknown"},
  "X7 Plus": {dims:"4,730 × 1,870 × 1,720 mm",wheelbase:"2,786 mm",energy:"汽油 ICE",use:"约 7.4 L/100km*",range:"—",safety:"未查到当地版本有效五星成绩",rating:"unknown"},
  "Hunter": {dims:"5,380 × 1,930 × 1,885 mm",wheelbase:"3,180 mm",energy:"柴油 ICE / 增程 REEV",use:"依动力版本",range:"REEV 约 1,031 km 综合*",safety:"未查到当地版本有效五星成绩",rating:"unknown"},
  "F70": {dims:"5,330 × 1,930 × 1,835 mm",wheelbase:"3,180 mm",energy:"柴油 ICE",use:"约 8.8 L/100km*",range:"—",safety:"未查到当地版本有效五星成绩",rating:"unknown"},
  "Deepal S05": {dims:"4,620 × 1,900 × 1,600 mm",wheelbase:"2,880 mm",energy:"增程 REEV",use:"当地官网未公布",range:"1,129 km 综合 / 158–160 km 纯电 NEDC*",safety:"未查到当地版本有效五星成绩",rating:"unknown"},
  "Deepal S07": {dims:"4,750 × 1,930 × 1,625 mm",wheelbase:"2,900 mm",energy:"纯电 BEV / 增程 REEV",use:"依动力版本",range:"560 km 纯电 / 1,170 km 综合 NEDC*",safety:"5★ Euro NCAP（适用版本）",rating:"yes"},
  "Deepal G318": {dims:"5,010 × 1,985 × 1,895 mm",wheelbase:"2,880 mm",energy:"增程 REEV",use:"约 11.4 km/L 综合*",range:"938 km 综合 / 143 km 纯电*",safety:"未查到当地版本有效五星成绩",rating:"unknown"},
  "AVATR 11": {dims:"4,880 × 1,970 × 1,601 mm",wheelbase:"2,975 mm",energy:"纯电 BEV",use:"181 Wh/km",range:"575 km NEDC",safety:"未查到当地版本有效五星成绩",rating:"unknown"},
  "AVATR 07": {dims:"4,825 × 1,980 × 1,620 mm",wheelbase:"2,940 mm",energy:"增程 REEV",use:"依驱动版本",range:"932 km 后驱 / 900 km 四驱综合 WLTP*",safety:"未查到当地版本有效五星成绩",rating:"unknown"},
};
const S: Record<string, Spec> = {...baseSpecs,...strategicSpecs};

const latamRaw: Record<string, string[]> = {
"巴西":[
"BYD集团|BYD|Dolphin Mini|R$ 109.990|GL:R$ 109.990,GS:R$ 119.990|byd-br","BYD集团|BYD|Dolphin|R$ 149.990|GS:R$ 149.990|byd-br","BYD集团|BYD|Yuan Pro|R$ 182.990|GS:R$ 182.990|byd-br","BYD集团|BYD|Yuan Plus|询价|当地官网未逐版本公开:询价|byd-br","BYD集团|BYD|Song Pro|R$ 161.490|GL:R$ 161.490,GS:R$ 199.990|byd-br","BYD集团|BYD|Song Plus|R$ 249.990|DM-i:R$ 249.990,Premium:询价|byd-br","BYD集团|BYD|King|R$ 175.990|GS:R$ 175.990|byd-br","BYD集团|BYD|Seal|R$ 299.990|AWD:R$ 299.990|byd-br","BYD集团|BYD|Sealion 7|R$ 339.990|AWD:R$ 339.990|byd-br","BYD集团|BYD|Shark|R$ 344.990|GS:R$ 344.990|byd-br","BYD集团|DENZA|Denza B5|R$ 405.000|B5 GL:R$ 405.000,B5 GS:R$ 449.000|denza-br","BYD集团|DENZA|Denza D9|询价|当地官网未公开:询价|denza-br",
"Chery集团|Chery|Tiggo 5X|R$ 119.990|Sport:R$ 119.990,Pro:询价|chery-br","Chery集团|Chery|Tiggo 7|R$ 147.990|Sport:R$ 147.990,Pro Max Drive:R$ 184.990,Pro Hybrid Max Drive:R$ 181.990,Pro PHEV:R$ 209.990|chery-br","Chery集团|Chery|Tiggo 8 Pro|R$ 199.990|Max Drive:R$ 199.990,Plug-in Hybrid:询价|chery-br","Chery集团|Omoda|Omoda 5|R$ 159.990|Luxury:R$ 159.990,Prestige:R$ 179.990|oj-br","Chery集团|Omoda|Omoda E5|R$ 209.990|BEV:R$ 209.990|oj-br","Chery集团|Omoda|Omoda 7|R$ 244.990|PHEV Luxury FWD:R$ 244.990,PHEV Prestige FWD:R$ 269.990|oj-br","Chery集团|Jaecoo|Jaecoo 7|R$ 229.990|Luxury:R$ 229.990,Prestige:R$ 249.990|oj-br",
"Geely集团|Geely|EX2|R$ 123.800|Pro:R$ 123.800,Max:R$ 136.800|geely-br","Geely集团|Geely|EX5|R$ 195.800|Pro:R$ 195.800,Max:R$ 225.800|geely-br","Geely集团|Geely|EX5 EM-i|R$ 189.990|Pro:R$ 189.990,Max:R$ 209.990,Ultra:R$ 234.990|geely-br",
"GWM集团|GWM|Ora 03|R$ 154.000|Skin:询价,GT:R$ 184.000|gwm-br","GWM集团|GWM|Haval H6|R$ 223.000|HEV:R$ 223.000,PHEV19:询价,PHEV35:询价,GT:询价|gwm-br","GWM集团|GWM|Haval H9|R$ 319.000|Exclusive:R$ 319.000|gwm-br","GWM集团|GWM|Tank 300|R$ 342.000|PHEV Flex:R$ 342.000|gwm-br","GWM集团|GWM|Poer|R$ 240.000|P30 Trail:询价,P30 Exclusive:询价|gwm-br","GWM集团|GWM|WEY 07|R$ 429.000|WEY 07:R$ 429.000,Dark Edition:R$ 432.000|wey-br",
"Leapmotor集团|Leapmotor|B10|R$ 182.990|BEV:R$ 182.990|leap-br","Leapmotor集团|Leapmotor|C10|R$ 189.990|BEV:R$ 189.990,REEV:R$ 199.990|leap-br",
"Changan集团|Changan|UNI-T|R$ 174.990|Infinity 1.5 TGDI Flex:R$ 174.990|changan-br"],
"阿根廷":[
"BYD集团|BYD|Dolphin Mini|US$ 22.990|GL:US$ 22.990,GS:US$ 23.990|byd-ar","BYD集团|BYD|Yuan Pro|US$ 29.990|GL:US$ 29.990,GS:US$ 30.990|byd-ar","BYD集团|BYD|Song Pro|US$ 34.990|GL:US$ 34.990,GS:US$ 36.990|byd-ar","BYD集团|BYD|Song Plus|询价|DM-i:询价|byd-ar","BYD集团|BYD|Shark|询价|DMO:询价|byd-ar","BYD集团|BYD|Seal|询价|Design:询价|byd-ar",
"Chery集团|Chery|Tiggo 2 Pro|US$ 23.000|MT Comfort:US$ 23.000,CVT Comfort:US$ 25.500|chery-ar","Chery集团|Chery|Tiggo 4 CSH|US$ 33.500|HEV Premium:US$ 33.500|chery-ar","Chery集团|Chery|Tiggo 7|US$ 32.900|Hybrid Premium:US$ 32.900|chery-ar","Chery集团|Chery|Tiggo 8 Pro|US$ 46.600|Luxury:US$ 46.600|chery-ar","Chery集团|Chery|Arrizo 8 CSH|询价|PHEV:询价|chery-ar","Chery集团|Omoda|Omoda 5|询价|当地官网未逐版本公开:询价|oj-ar","Chery集团|Jaecoo|Jaecoo 7|询价|当地官网未逐版本公开:询价|oj-ar",
"Geely集团|Geely|EX5|询价|当地官网未公开:询价|geely-ar",
"GWM集团|GWM|Haval H6|询价|HEV Pro:询价|gwm-ar","GWM集团|GWM|Tank 300|询价|Luxury:询价|gwm-ar","GWM集团|GWM|Poer|询价|Commercial:询价,Passenger:询价|gwm-ar",
"东风集团|Dongfeng|BOX|US$ 29.700|BOX 430:US$ 29.700|dongfeng-ar","东风集团|Dongfeng|Mage HEV|US$ 34.400|HEV:US$ 34.400|dongfeng-ar","东风集团|Dongfeng|Huge HEV|US$ 36.700|HEV:US$ 36.700|dongfeng-ar",
"Leapmotor集团|Leapmotor|B10|US$ 31.990|REEV:US$ 31.990|leap-ar","Leapmotor集团|Leapmotor|C10|询价|REEV:询价|leap-ar",
"Changan集团|Changan|CS55 Plus|US$ 31.990|PHEV:US$ 31.990|changan-ar","Changan集团|Changan|Eado Plus|US$ 29.990|PHEV:US$ 29.990|changan-ar"],
"智利":[
"BYD集团|BYD|Dolphin Mini|CLP 17.990.000|GS:CLP 17.990.000|byd-cl","BYD集团|BYD|Dolphin|CLP 25.990.000|GS:CLP 25.990.000|byd-cl","BYD集团|BYD|Yuan Plus|CLP 29.990.000|GS:CLP 29.990.000|byd-cl","BYD集团|BYD|Song Plus|CLP 32.990.000|DM-i:CLP 32.990.000|byd-cl","BYD集团|BYD|Seal|CLP 39.990.000|Design:CLP 39.990.000,Performance:询价|byd-cl","BYD集团|BYD|Shark|CLP 42.990.000|GS:CLP 42.990.000|byd-cl",
"Chery集团|Chery|Tiggo 2 Pro|CLP 10.990.000|GL MT:询价,GLS CVT:询价|chery-cl","Chery集团|Chery|Tiggo 4 CSH|CLP 15.990.000|Comfort:询价,Premium:询价|chery-cl","Chery集团|Chery|Tiggo 7|CLP 18.990.000|Pro Max:询价,CSH:询价|chery-cl","Chery集团|Chery|Tiggo 8 Pro|CLP 22.990.000|Max:询价,CSH:询价|chery-cl","Chery集团|Omoda|Omoda 5|CLP 14.990.000|Comfort:询价,Luxury:询价|oj-cl","Chery集团|Omoda|Omoda E5|CLP 24.990.000|EV:询价|oj-cl","Chery集团|Omoda|Omoda 7|CLP 17.740.000|ICE C7 Comfort FWD:CLP 17.740.000,ICE C7 Luxury FWD:CLP 18.990.000,ICE C7 Prestige AWD:CLP 21.490.000|oj-cl","Chery集团|Jaecoo|Jaecoo 5|CLP 15.990.000|Elemental:询价,Prime:询价,Summit:CLP 18.990.000|oj-cl","Chery集团|Jaecoo|Jaecoo 6|CLP 28.990.000|EV:CLP 28.990.000|oj-cl","Chery集团|Jaecoo|Jaecoo 7|CLP 20.490.000|Elemental:CLP 20.490.000,Prime:CLP 22.990.000,Summit AWD:CLP 25.690.000|oj-cl","Chery集团|Jaecoo|Jaecoo 8|询价|当地官网未逐版本公开:询价|oj-cl","Chery集团|Exeed|Exeed LX|询价|当地官网未逐版本公开:询价|exeed-cl","Chery集团|Exeed|Exeed TXL|询价|当地官网未逐版本公开:询价|exeed-cl","Chery集团|Jetour|Jetour X50|CLP 11.990.000|Comfort:询价,Luxury:询价|jetour-cl","Chery集团|Jetour|Jetour Dashing|CLP 15.990.000|Luxury:询价|jetour-cl","Chery集团|Jetour|Jetour X70|CLP 14.990.000|Plus:询价|jetour-cl","Chery集团|Jetour|Jetour T2|CLP 23.990.000|2.0T:询价|jetour-cl",
"Geely集团|Geely|Coolray|CLP 10.490.000|Lite:CLP 10.490.000,New:CLP 13.990.000|geely-cl","Geely集团|Geely|Cityray|CLP 15.890.000|Comfort:询价,GF:询价|geely-cl","Geely集团|Geely|Starray|CLP 19.990.000|GF:CLP 19.990.000|geely-cl","Geely集团|Geely|Okavango|CLP 20.690.000|Elite:询价|geely-cl","Geely集团|Geely|EX2|CLP 17.490.000|Pro:询价,Max:询价|geely-cl","Geely集团|Geely|EX5|CLP 26.990.000|Pro:询价,Max:询价|geely-cl","Geely集团|Geely|EX5 EM-i|CLP 22.490.000|Pro:询价,Max:询价|geely-cl","Geely集团|Zeekr|Zeekr X|询价|Premium:询价,Privilege AWD:询价|zeekr-cl","Geely集团|Zeekr|Zeekr 001|询价|Performance AWD:询价|zeekr-cl","Geely集团|Lynk&Co|Lynk & Co 01|询价|PHEV:询价|lynk-cl","Geely集团|Lynk&Co|Lynk & Co 06|询价|Pro:询价,Max:询价|lynk-cl",
"GWM集团|GWM|Ora 03|CLP 26.490.000|400 km EV:CLP 26.490.000|gwm-cl","GWM集团|GWM|Haval Jolion|CLP 13.490.000|Deluxe:询价,HEV:询价|gwm-cl","GWM集团|GWM|Haval H6|CLP 27.990.000|HEV Elite:CLP 27.990.000,GT:CLP 29.590.000|gwm-cl","GWM集团|GWM|Tank 300|CLP 29.990.000|Luxury:询价|gwm-cl","GWM集团|GWM|Tank 500|CLP 39.990.000|HEV:询价|gwm-cl","GWM集团|GWM|Poer|CLP 19.990.000|Elite:询价,Deluxe:询价|gwm-cl","GWM集团|GWM|Poer P500|CLP 32.990.000|Diesel:询价,HEV:询价|gwm-cl",
"东风集团|Dongfeng|Nammi|CLP 20.990.000|42.3 kWh LR:CLP 20.990.000|dongfeng-cl","东风集团|Dongfeng|Vigo|询价|EV:询价|dongfeng-cl","东风集团|Dongfeng|E70|询价|EV:询价|dongfeng-cl",
"Leapmotor集团|Leapmotor|B10|询价|BEV Life:询价|leap-cl","Leapmotor集团|Leapmotor|C10|询价|BEV:询价,REEV:询价|leap-cl",
"Changan集团|Changan|CS75 Plus|CLP 19.990.000|1.5T:CLP 19.990.000|changan-cl","Changan集团|Changan|Alsvin|CLP 8.990.000|MT:CLP 8.990.000|changan-cl","Changan集团|Changan|CS35 Max|CLP 12.190.000|Core:CLP 12.190.000|changan-cl","Changan集团|Changan|CS55 Plus|CLP 13.990.000|New ICE:CLP 13.990.000,PHEV iDD:CLP 19.490.000|changan-cl","Changan集团|Changan|Lumin|CLP 12.990.000|BEV:CLP 12.990.000|changan-cl","Changan集团|Changan|Eado Plus|CLP 18.990.000|PHEV iDD:CLP 18.990.000|changan-cl","Changan集团|Changan|UNI-K|CLP 22.990.000|2.0T:CLP 22.990.000|changan-cl","Changan集团|Changan|UNI-T|CLP 18.490.000|1.5T:CLP 18.490.000|changan-cl","Changan集团|Changan|X7 Plus|CLP 13.290.000|1.5T:CLP 13.290.000|changan-cl","Changan集团|Changan|Hunter|CLP 17.790.000|Diesel 4x2:CLP 17.790.000,REEV 4x2:CLP 24.990.000|changan-cl","Changan集团|Changan|CS35 Plus|CLP 12.990.000|1.4T:CLP 12.990.000|changan-cl","Changan集团|Changan|CS15|CLP 9.190.000|ICE:CLP 9.190.000|changan-cl",
"Changan集团|Deepal|Deepal S05|CLP 25.990.000|REEV:CLP 25.990.000|deepal-cl","Changan集团|Deepal|Deepal S07|CLP 29.990.000|REEV:CLP 29.990.000,BEV:CLP 35.990.000|deepal-cl","Changan集团|Deepal|Deepal G318|CLP 41.990.000|REEV 4WD:CLP 41.990.000|deepal-cl","Changan集团|AVATR|AVATR 11|询价|BEV RWD:询价|avatr-cl","Changan集团|AVATR|AVATR 07|CLP 49.990.000|REEV RWD:CLP 49.990.000,REEV AWD:CLP 53.990.000|avatr07-cl"],
"乌拉圭":[
"BYD集团|BYD|Dolphin Mini|US$ 19.990|GS:US$ 19.990|byd-uy","BYD集团|BYD|Dolphin|US$ 27.990|GS:US$ 27.990|byd-uy","BYD集团|BYD|Yuan Plus|US$ 39.990|GS:US$ 39.990|byd-uy","BYD集团|BYD|Song Plus|US$ 42.990|DM-i:US$ 42.990|byd-uy","BYD集团|BYD|Shark|US$ 54.990|GS:US$ 54.990|byd-uy",
"Chery集团|Chery|Tiggo 2 Pro|US$ 16.990|MT:询价,CVT:询价|chery-uy","Chery集团|Chery|Tiggo 4 CSH|US$ 27.990|Comfort:询价,Premium:询价|chery-uy","Chery集团|Chery|Tiggo 7|US$ 35.990|CSH:US$ 35.990|chery-uy","Chery集团|Omoda|Omoda 5|询价|2027:询价,SHS:询价|oj-uy","Chery集团|Jaecoo|Jaecoo 5|询价|EV:询价|oj-uy","Chery集团|Jaecoo|Jaecoo 6|询价|EV:询价|oj-uy","Chery集团|Jaecoo|Jaecoo 7|询价|SHS-P:询价|oj-uy","Chery集团|Jetour|Jetour X70|US$ 27.990|Plus:询价|jetour-uy","Chery集团|Jetour|Jetour T2|US$ 39.990|Luxury:询价|jetour-uy",
"Geely集团|Geely|GX3 Pro|US$ 16.990|MT:询价,AT:询价|geely-uy","Geely集团|Geely|Coolray|US$ 30.490|GF:US$ 30.490|geely-uy","Geely集团|Geely|Cityray|US$ 29.990|GF:US$ 29.990|geely-uy","Geely集团|Geely|EX2|US$ 20.790|Pro:US$ 20.790,Max:US$ 22.490|geely-uy","Geely集团|Geely|EX5|US$ 31.990|Pro:询价,Max:询价|geely-uy","Geely集团|Geely|EX5 EM-i|US$ 34.990|Pro:US$ 34.990|geely-uy",
"GWM集团|GWM|Haval Jolion|US$ 27.990|Deluxe:询价,HEV:询价|gwm-uy","GWM集团|GWM|Haval H6|US$ 35.990|HEV:询价,PHEV:US$ 38.990,GT PHEV:询价|gwm-uy","GWM集团|GWM|Ora 03|US$ 27.990|GT:询价|gwm-uy","GWM集团|GWM|Poer|US$ 24.990|4x2:询价,4x4:询价|gwm-uy",
"东风集团|Dongfeng|Nammi|询价|330:询价,430:询价|dongfeng-uy","东风集团|Dongfeng|Vigo|询价|EV:询价|dongfeng-uy","东风集团|Dongfeng|Huge HEV|询价|HEV:询价|dongfeng-uy",
"Leapmotor集团|Leapmotor|T03|US$ 19.990|BEV:US$ 19.990|leap-uy","Leapmotor集团|Leapmotor|B10|US$ 33.990|BEV:US$ 33.990|leap-uy","Leapmotor集团|Leapmotor|C10|US$ 36.990|BEV:US$ 38.990,REEV:US$ 36.990|leap-uy","Leapmotor集团|Leapmotor|C11|US$ 39.990|BEV:US$ 39.990|leap-uy","Leapmotor集团|Leapmotor|C16|US$ 43.990|BEV:US$ 43.990,REEV:US$ 43.990|leap-uy",
"Changan集团|Changan|CS55 Plus|US$ 29.990|PHEV Luxury:US$ 29.990,PHEV Elite:US$ 32.990|changan-uy","Changan集团|Changan|Lumin|询价|BEV:询价|changan-uy","Changan集团|Changan|Eado Plus|US$ 29.990|PHEV Luxury:US$ 29.990,PHEV Elite:US$ 32.990|changan-uy","Changan集团|Changan|Hunter|US$ 31.990|REEV 4x2:US$ 31.990,REEV 4x4:US$ 37.990|changan-uy"],
"玻利维亚":[
"BYD集团|BYD|Dolphin Mini|US$ 21.990|GS:询价|byd-bo","BYD集团|BYD|Dolphin|US$ 29.990|GS:询价|byd-bo","BYD集团|BYD|Yuan Pro|US$ 31.990|GS:询价|byd-bo","BYD集团|BYD|Song Plus|US$ 42.990|DM-i:询价|byd-bo","BYD集团|BYD|Shark|US$ 57.990|GS:询价|byd-bo",
"Chery集团|Chery|Tiggo 2 Pro|US$ 18.990|MT:询价,CVT:询价|chery-bo","Chery集团|Chery|Tiggo 4 CSH|US$ 29.990|Premium:询价|chery-bo","Chery集团|Chery|Tiggo 7|US$ 32.990|Pro:询价|chery-bo","Chery集团|Chery|Tiggo 8 Pro|US$ 42.990|Luxury:询价|chery-bo","Chery集团|Omoda|Omoda 5|US$ 26.990|Luxury:询价|oj-bo","Chery集团|Jaecoo|Jaecoo 7|US$ 34.990|Luxury:询价|oj-bo","Chery集团|Jetour|Jetour X50|US$ 20.990|Luxury:询价|jetour-bo","Chery集团|Jetour|Jetour Dashing|US$ 28.990|Luxury:询价|jetour-bo","Chery集团|Jetour|Jetour X70|US$ 27.990|Plus:询价|jetour-bo","Chery集团|Jetour|Jetour T2|US$ 43.990|Luxury:询价|jetour-bo",
"Geely集团|Geely|GX3 Pro|US$ 18.490|Comfort:询价|geely-bo","Geely集团|Geely|Coolray|US$ 25.990|GF:询价|geely-bo","Geely集团|Geely|Cityray|US$ 29.990|GF:询价|geely-bo","Geely集团|Geely|EX5|US$ 39.990|Max:询价|geely-bo",
"GWM集团|GWM|Haval Jolion|US$ 27.990|Deluxe:询价|gwm-bo","GWM集团|GWM|Haval H6|US$ 37.990|HEV:询价|gwm-bo","GWM集团|GWM|Tank 300|US$ 49.990|Luxury:询价|gwm-bo","GWM集团|GWM|Poer|US$ 29.990|4x4:询价|gwm-bo","GWM集团|GWM|Poer P500|US$ 49.990|Luxury:询价|gwm-bo",
"东风集团|Dongfeng|Mage|询价|1.5T:询价|dongfeng-bo","东风集团|Dongfeng|Mage EV|询价|LUX:询价|dongfeng-bo","东风集团|Dongfeng|Vigo|询价|EV:询价|dongfeng-bo",
"Changan集团|Changan|Alsvin|询价|ICE:询价|changan-bo","Changan集团|Changan|CS15|询价|New ICE:询价|changan-bo","Changan集团|Changan|CS55 Plus|询价|ICE:询价,PHEV iDD:询价|changan-bo","Changan集团|Changan|CS35 Plus|询价|Sport:询价|changan-bo","Changan集团|Changan|X7 Plus|询价|ICE:询价|changan-bo","Changan集团|Deepal|Deepal S05|US$ 47.000|REEV:US$ 47.000|changan-bo","Changan集团|Deepal|Deepal S07|询价|REEV:询价,BEV:询价|changan-bo","Changan集团|Deepal|Deepal G318|询价|REEV 4WD:询价|changan-bo"],
"厄瓜多尔":[
"BYD集团|BYD|Dolphin Mini|US$ 19.990|GS:询价|byd-ec","BYD集团|BYD|Dolphin|US$ 29.990|GS:询价|byd-ec","BYD集团|BYD|Yuan Plus|US$ 39.990|GS:询价|byd-ec","BYD集团|BYD|Song Plus|US$ 44.990|DM-i:询价|byd-ec","BYD集团|BYD|Shark|US$ 56.990|GS:询价|byd-ec","BYD集团|BYD|Seal|US$ 49.990|Design:询价|byd-ec",
"Chery集团|Chery|Tiggo 2 Pro|US$ 19.990|Comfort:询价|chery-ec","Chery集团|Chery|Tiggo 4 CSH|US$ 28.990|Premium:询价|chery-ec","Chery集团|Chery|Tiggo 7|US$ 32.990|Pro:US$ 32.990,PHEV CSH:询价|chery-ec","Chery集团|Chery|Tiggo 8 Pro|US$ 43.990|Luxury:询价|chery-ec","Chery集团|Omoda|Omoda 5|US$ 27.990|Luxury:询价|oj-ec","Chery集团|Omoda|Omoda E5|US$ 36.990|EV:询价|oj-ec","Chery集团|Jaecoo|Jaecoo 7|US$ 35.990|Luxury:询价|oj-ec","Chery集团|Exeed|Exeed LX|US$ 34.990|Luxury:询价|exeed-ec","Chery集团|Exeed|Exeed TXL|US$ 46.990|Luxury:询价|exeed-ec","Chery集团|Jetour|Jetour X50|US$ 21.990|Luxury:询价|jetour-ec","Chery集团|Jetour|Jetour Dashing|US$ 29.990|Luxury:询价|jetour-ec","Chery集团|Jetour|Jetour X70|US$ 28.990|Plus:询价|jetour-ec","Chery集团|Jetour|Jetour T2|US$ 44.990|Luxury:询价|jetour-ec",
"Geely集团|Geely|GX3 Pro|US$ 18.990|Comfort:询价|geely-ec","Geely集团|Geely|Coolray|US$ 25.990|GF:询价|geely-ec","Geely集团|Geely|Cityray|US$ 30.990|GF:询价|geely-ec","Geely集团|Geely|EX5|US$ 39.990|Max:询价|geely-ec","Geely集团|Lynk&Co|Lynk & Co 01|US$ 43.990|PHEV:询价|lynk-ec",
"GWM集团|GWM|Haval Jolion|US$ 27.990|Deluxe:询价,HEV:询价|gwm-ec","GWM集团|GWM|Haval H6|US$ 37.990|HEV:询价,GT:询价|gwm-ec","GWM集团|GWM|Tank 300|US$ 49.990|Luxury:询价|gwm-ec","GWM集团|GWM|Tank 500|US$ 69.990|HEV:询价|gwm-ec","GWM集团|GWM|Poer|US$ 29.990|4x2:询价,4x4:询价|gwm-ec","GWM集团|GWM|Poer P500|US$ 49.990|Luxury:询价|gwm-ec",
"东风集团|Dongfeng|Mage HEV|US$ 23.590|HEV:US$ 23.590|dongfeng-ec","东风集团|Dongfeng|Mage EV|US$ 23.990|EV:US$ 23.990|dongfeng-ec","东风集团|Dongfeng|Huge HEV|US$ 25.590|HEV:US$ 25.590|dongfeng-ec","东风集团|Dongfeng|Paladin|US$ 37.990|4x4:US$ 37.990|dongfeng-ec","东风集团|Dongfeng|Rich 6|US$ 22.990|Gasolina 4x2:US$ 22.990,Diésel 4x2:US$ 24.990,Diésel 4x4:US$ 29.990|dongfeng-ec","东风集团|Dongfeng|Rich 7|US$ 26.990|Diésel 4x2:US$ 26.990,Diésel 4x4:US$ 33.990|dongfeng-ec","东风集团|Dongfeng|Z9|US$ 39.990|MID 4x4:US$ 39.990|dongfeng-ec",
"Leapmotor集团|Leapmotor|T03|US$ 18.990|BEV:US$ 18.990|leap-ec","Leapmotor集团|Leapmotor|C10|US$ 36.990|BEV:US$ 36.990,REEV:US$ 39.990|leap-ec","Leapmotor集团|Leapmotor|C11|US$ 42.990|BEV:US$ 42.990,REEV:US$ 45.990|leap-ec","Leapmotor集团|Leapmotor|C16|US$ 53.990|REEV:US$ 53.990|leap-ec",
"Changan集团|Changan|CS15|US$ 17.990|ICE:US$ 17.990|changan-ec","Changan集团|Changan|Alsvin|US$ 16.990|Plus:US$ 16.990|changan-ec","Changan集团|Changan|CS75 Plus|US$ 24.990|ICE:US$ 24.990|changan-ec","Changan集团|Changan|Hunter|US$ 26.990|Diesel 4x2:US$ 26.990,Diesel 4x4:US$ 29.990,REEV 4x4:US$ 37.990|changan-ec","Changan集团|Deepal|Deepal S07|询价|REEV:询价,BEV:询价|deepal-ec"],
"秘鲁":[
"BYD集团|BYD|Shark|询价|DMO:询价|byd-pe","BYD集团|BYD|Yuan Up|询价|BEV:询价|byd-pe","BYD集团|BYD|Yuan Up DM-i|询价|DM-i:询价|byd-pe","BYD集团|BYD|Song Pro|询价|DM-i:询价|byd-pe","BYD集团|BYD|Song Plus|询价|DM-i:询价|byd-pe","BYD集团|BYD|Dolphin Mini|询价|SEAGULL:询价|byd-pe","BYD集团|BYD|Seal|询价|Design:询价|byd-pe","BYD集团|BYD|Tang|询价|EV:询价|byd-pe","BYD集团|BYD|Sealion 7|询价|EV:询价|byd-pe","BYD集团|BYD|Atto 8|询价|DM-i:询价|byd-pe",
"Chery集团|Chery|Arrizo 5 Pro|US$ 12.990|1.5 MT:US$ 12.990|chery-pe","Chery集团|Chery|M7|US$ 19.990|1.5T:US$ 19.990|chery-pe","Chery集团|Chery|Tiggo 2 Pro|US$ 13.490|Pro Max:US$ 13.490|chery-pe","Chery集团|Chery|Tiggo 4|US$ 16.490|New Tiggo 4:US$ 16.490|chery-pe","Chery集团|Chery|Tiggo 7|US$ 23.990|New Tiggo 7:US$ 23.990|chery-pe","Chery集团|Chery|Tiggo 8 Pro|US$ 34.990|New Tiggo 8:US$ 34.990,Tiggo 8 CSH:US$ 36.990|chery-pe","Chery集团|Chery|Tiggo 9|US$ 40.990|2.0T AWD:US$ 40.990|chery-pe","Chery集团|Chery|Himla|US$ 22.990|2.3T MT 4WD:US$ 22.990|chery-pe",
"Chery集团|Jetour|Jetour X50|US$ 13.990|MT:US$ 13.990|jetour-pe","Chery集团|Jetour|Jetour X70|US$ 15.490|X70FL:US$ 15.490|jetour-pe","Chery集团|Jetour|Jetour Dashing|US$ 18.490|1.5T:US$ 18.490|jetour-pe","Chery集团|Jetour|Jetour T1|US$ 27.490|2.0T:US$ 27.490,PHEV:US$ 33.990|jetour-pe","Chery集团|Jetour|Jetour T2|US$ 40.990|Traveller T2:US$ 40.990|jetour-pe",
"Geely集团|Geely|GX3 Pro|US$ 14.290|Exclusive:US$ 14.290|geely-pe","Geely集团|Geely|Emgrand|US$ 15.090|1.5 MT:US$ 15.090|geely-pe","Geely集团|Geely|Coolray|US$ 17.190|Lite:US$ 17.190,New:US$ 19.690|geely-pe","Geely集团|Geely|Cityray|US$ 21.690|GF:US$ 21.690|geely-pe","Geely集团|Geely|Starray|US$ 26.990|Exclusive:US$ 26.990|geely-pe","Geely集团|Geely|Okavango|US$ 25.790|Mild Hybrid:US$ 25.790,New:US$ 33.790|geely-pe","Geely集团|Geely|EX5|US$ 35.290|BEV:US$ 35.290|geely-pe","Geely集团|Geely|EX5 EM-i|US$ 31.790|PHEV:US$ 31.790|geely-pe",
"GWM集团|GWM|Wingle 5|US$ 15.190|Gasolina:US$ 15.190,Diesel:US$ 17.990|gwm-pe","GWM集团|GWM|Wingle 7|US$ 20.990|Diesel:US$ 20.990|gwm-pe","GWM集团|GWM|Poer|US$ 20.490|Mecánica:US$ 20.490,New 2.4 Mecánica:US$ 24.990,Automática:US$ 30.990,New 2.4 Automática:US$ 34.490|gwm-pe","GWM集团|GWM|Haval Jolion|US$ 16.490|New:US$ 16.490,Max:US$ 19.790,Pro:US$ 21.490|gwm-pe","GWM集团|GWM|Haval H6|US$ 26.490|New H6:US$ 26.490,H6 GT:US$ 29.490,H6 Híbrido:US$ 29.990,New H6 Híbrido:US$ 31.990|gwm-pe","GWM集团|GWM|Haval H7|US$ 28.490|HEV:US$ 28.490|gwm-pe","GWM集团|GWM|Haval H9|US$ 40.990|Diesel:US$ 40.990|gwm-pe","GWM集团|GWM|Tank 300|US$ 38.490|2.0T 4WD:US$ 38.490|gwm-pe","GWM集团|GWM|Tank 500|US$ 53.990|HEV:US$ 53.990|gwm-pe",
"东风集团|Dongfeng|BOX|询价|Nami BOX:询价|dongfeng-pe","东风集团|Dongfeng|Mage HEV|询价|T5 HEV:询价|dongfeng-pe","东风集团|Dongfeng|Mage EV|询价|EV:询价|dongfeng-pe","东风集团|Dongfeng|Huge HEV|询价|HEV:询价|dongfeng-pe","东风集团|Dongfeng|Paladin|询价|4x4:询价|dongfeng-pe","东风集团|Dongfeng|Rich 6|询价|Gasolina 4x2:询价,Diésel 4x4:询价|dongfeng-pe","东风集团|Dongfeng|Rich 7|询价|Diésel 4x4:询价|dongfeng-pe","东风集团|Dongfeng|Z9|询价|Diésel 4x4:询价|dongfeng-pe",
"Changan集团|Changan|CS15|US$ 12.140|Comfort MT 4x2:US$ 12.140,Elite MT 4x2:US$ 13.240,Elite DCT 4x2:US$ 13.340,Luxury DCT 4x2:US$ 14.140|changan-pe","Changan集团|Changan|CS35 Max|US$ 15.040|Core MT:US$ 15.040,Core AT:US$ 16.340,Flagship AT:US$ 17.240,Flagship AT SR:US$ 17.690|changan-pe","Changan集团|Changan|CS55 Plus|US$ 17.640|New ICE:US$ 17.640,PHEV iDD:US$ 23.490|changan-pe","Changan集团|Changan|CS75 Plus|US$ 20.990|Flagship:US$ 20.990,Signature:US$ 23.990|changan-pe","Changan集团|Changan|X7 Plus|US$ 15.690|ICE:US$ 15.690|changan-pe","Changan集团|Changan|UNI-T|US$ 23.640|ICE:US$ 23.640|changan-pe","Changan集团|Changan|UNI-K|US$ 31.790|ICE:US$ 31.790|changan-pe","Changan集团|Changan|Alsvin|询价|New Plus:询价|changan-pe","Changan集团|Changan|F70|询价|Diesel 4x4:询价|changan-pe"]
};
const raw: Record<string,string[]> = {...latamRaw,...strategicRaw};

const baseSources: Record<string,{name:string,url:string}> = {
"byd-br":{name:"BYD Brasil｜车型与促销条件",url:"https://www.byd.com/br/condicoes"},"denza-br":{name:"DENZA Brasil｜B5 官方配置与售价",url:"https://www.denza.com/br/save-configuration"},"byd-ar":{name:"BYD Argentina｜车型与官方售价",url:"https://www.byd.com/ar/news-list/byd-en-argentina"},"byd-cl":{name:"BYD Chile｜品牌官网",url:"https://www.byd.com/cl"},"byd-uy":{name:"BYD Uruguay｜品牌官网",url:"https://www.byd.com/uy"},"byd-bo":{name:"BYD Bolivia｜品牌官网",url:"https://bydauto.com.bo"},"byd-ec":{name:"BYD Ecuador｜品牌官网",url:"https://www.byd.com/ec"},"byd-pe":{name:"BYD Perú｜官方车型目录",url:"https://www.byd.com/pe/car"},
"chery-br":{name:"CAOA Chery Brasil｜车型官网",url:"https://caoachery.com.br"},"chery-ar":{name:"Chery Argentina｜车型与价格表",url:"https://chery.com.ar"},"chery-cl":{name:"Chery Chile｜车型官网",url:"https://www.chery.cl"},"chery-uy":{name:"Chery Uruguay｜车型与价格",url:"https://chery.com.uy"},"chery-bo":{name:"Chery Bolivia｜车型官网",url:"https://chery.com.bo"},"chery-ec":{name:"Chery Ecuador｜车型官网",url:"https://www.chery.com.ec"},"chery-pe":{name:"Chery Perú｜车型与官方起售价",url:"https://www.chery.com.pe/public/"},
"oj-br":{name:"OMODA | JAECOO Brasil｜官方优惠",url:"https://omodajaecoo.com.br/ofertas"},"oj-ar":{name:"OMODA | JAECOO Argentina｜品牌官网",url:"https://omodajaecoo.com.ar"},"oj-cl":{name:"OMODA | JAECOO Chile｜车型与价格",url:"https://www.omodajaecoo.cl"},"oj-uy":{name:"OMODA | JAECOO Uruguay｜车型官网",url:"https://omodajaecoo.com.uy"},"oj-bo":{name:"OMODA | JAECOO Bolivia｜品牌官网",url:"https://omodajaecoo.com.bo"},"oj-ec":{name:"OMODA | JAECOO Ecuador｜品牌官网",url:"https://omodajaecoo.com.ec"},"exeed-cl":{name:"EXEED Chile｜品牌官网",url:"https://www.exeed.cl"},"exeed-ec":{name:"EXEED Ecuador｜品牌官网",url:"https://www.exeed.ec"},"jetour-cl":{name:"JETOUR Chile｜车型官网",url:"https://jetourchile.cl"},"jetour-uy":{name:"JETOUR Uruguay｜车型官网",url:"https://jetour.com.uy"},"jetour-bo":{name:"JETOUR Bolivia｜车型官网",url:"https://jetour.com.bo"},"jetour-ec":{name:"JETOUR Ecuador｜车型官网",url:"https://jetour.com.ec"},"jetour-pe":{name:"JETOUR Perú｜车型与官方起售价",url:"https://www.jetour.com.pe/modelos"},
"geely-br":{name:"Geely Brasil｜车型与官方优惠",url:"https://www.geelybrasil.com.br"},"geely-ar":{name:"Geely Argentina｜车型官网",url:"https://geelyargentina.com.ar"},"geely-cl":{name:"Geely Chile｜车型与价格",url:"https://www.geely.cl/cotizar"},"geely-uy":{name:"Geely Uruguay｜车型与价格",url:"https://geely.com.uy"},"geely-bo":{name:"Geely Bolivia｜车型官网",url:"https://geely.com.bo"},"geely-ec":{name:"Geely Ecuador｜车型官网",url:"https://geely.com.ec"},"geely-pe":{name:"Geely Perú｜车型与官方起售价",url:"https://geely.pe/"},"zeekr-cl":{name:"ZEEKR Chile｜品牌官网",url:"https://www.zeekr.cl"},"lynk-cl":{name:"Lynk & Co Chile｜品牌官网",url:"https://www.lynkco.cl"},"lynk-ec":{name:"Lynk & Co Ecuador｜品牌官网",url:"https://www.lynkco.com"},
"gwm-br":{name:"GWM Brasil｜在售车型",url:"https://www.gwmmotors.com.br/pt/modelos"},"wey-br":{name:"GWM Brasil｜WEY 07 官方车型页",url:"https://www.gwmmotors.com.br/pt/modelos/wey-07"},"gwm-ar":{name:"GWM Argentina｜在售车型",url:"https://gwm.com.ar/modelos"},"gwm-cl":{name:"GWM Chile｜车型与价格",url:"https://www.gwm.cl"},"gwm-uy":{name:"GWM Uruguay｜车型与价格",url:"https://gwm.com.uy"},"gwm-bo":{name:"GWM Bolivia｜车型官网",url:"https://gwm.com.bo"},"gwm-ec":{name:"GWM Ecuador｜车型官网",url:"https://www.gwm.com.ec"},"gwm-pe":{name:"GWM Perú｜车型与官方起售价",url:"https://pdn.gwm.com.pe/"},
"dongfeng-ar":{name:"Dongfeng Argentina｜乘用车与官方售价",url:"https://www.dongfengmotors.com.ar/"},"dongfeng-cl":{name:"Dongfeng Chile｜电动车型官网",url:"https://dongfengindumotora.cl/"},"dongfeng-uy":{name:"Dongfeng Uruguay｜乘用车型官网",url:"https://dongfengmotors.com.uy/"},"dongfeng-bo":{name:"Dongfeng Bolivia｜Rodaria 官方车型",url:"https://automotriz.rodaria.com.bo/"},"dongfeng-ec":{name:"Dongfeng Ecuador｜Maresa 车型与售价",url:"https://dongfeng.ec/"},"dongfeng-pe":{name:"Dongfeng Perú｜乘用车型目录",url:"https://dongfengmotor.pe/dongfeng/"},"voyah-global":{name:"VOYAH Global｜全球车型目录（七市场暂无当地官网在售记录）",url:"https://www.voyah-global.com/"},
"leap-br":{name:"Leapmotor Brasil｜Stellantis 官方车型与售价",url:"https://www.media.stellantis.com/br-pt/leapmotor/"},"leap-ar":{name:"Leapmotor Argentina｜官方车型目录",url:"https://www.leapmotor.com.ar/"},"leap-cl":{name:"Leapmotor Chile｜官方车型目录",url:"https://www.leapmotorchile.cl/"},"leap-uy":{name:"Leapmotor Uruguay｜车型、参数与售价",url:"https://www.leapmotor.com.uy/"},"leap-ec":{name:"Leapmotor Ecuador｜车型、参数与售价",url:"https://www.leapmotor.ec/"},
"changan-br":{name:"Global Changan｜巴西本地生产与上市公告",url:"https://www.globalchangan.com/newsroom/changan-and-caoa-strengthen-long-term-commitment-to-brazil-with-new-5-billion-investment-cycle-and-breakthrough-flex-fuel-technology.html"},"changan-ar":{name:"Changan Argentina｜车型与官方售价",url:"https://changan.com.ar/"},"changan-cl":{name:"Changan Chile｜车型与官方售价",url:"https://www.changan.cl/"},"deepal-cl":{name:"Deepal Chile｜车型、动力与官方售价",url:"https://www.deepalautos.cl/"},"avatr-cl":{name:"Changan Chile｜AVATR 11 官方车型资料",url:"https://www.changan.cl/autos-hibridos-y-electricos/"},"avatr07-cl":{name:"Changan Chile｜AVATR 07 上市、配置与官方售价",url:"https://www.changan.cl/noticia/changan-impulsa-nueva-etapa-para-avatr-con-lanzamiento-avatr-07/"},"changan-uy":{name:"Changan Uruguay｜车型、配置与售价",url:"https://changan.uy/"},"changan-bo":{name:"Changan Bolivia｜Changan 与 Deepal 车型目录",url:"https://www.changan.com.bo/catalogo"},"changan-ec":{name:"Changan Ecuador｜车型与官方售价",url:"https://www.changanecuador.com/"},"deepal-ec":{name:"Changan Ecuador｜Deepal S07 官方车型页",url:"https://changanecuador.com/landing-changan-deepal-s07/"},"changan-pe":{name:"Changan Perú｜车型、配置与官方售价",url:"https://www.pdn.changan.com.pe/"}
};
const sources: Record<string,{name:string,url:string}> = {...baseSources,...strategicSources};

type BaseCar = Omit<PowerCar,"variant">;

const officialAvifModels = new Set(["jetour-dashing", "jetour-t1", "jetour-t2"]);
const officialRemoteImages: Record<string,string> = {
  "BOX":"https://www.dongfengmotors.com.ar/wp-content/uploads/2026/03/Hero-desktop-BOX-1.jpg",
  "Nammi":"https://www.dongfengmotors.uy/uploads/nammi_model.webp",
  "Vigo":"https://dongfengindumotora.cl/content/dam/Dongfeng/modelos/vigo/miniaturas/Vigo-Miniaturas-480x252-marfil.png",
  "E70":"https://dongfengindumotora.cl/content/dam/nammi/e-70/e70-finales/DIMENSIONES.png",
  "Mage":"https://www.dongfengmotors.com.ar/wp-content/uploads/2026/03/Hero-Desktop-MAGE-1.jpg",
  "Mage HEV":"https://dongfeng.ec/wp-content/uploads/elementor/thumbs/MAGE-HEV_BLANCO_45-rnulaiw3yyvpcud28t3wn7ae94jiw82prrs5lbmpi8.webp",
  "Mage EV":"https://dongfeng.ec/wp-content/uploads/elementor/thumbs/MAGE-EV_BLANCO_45-rnulajty5swzogbp3bij7p1uuiew3x6g3wfn2llbc0.webp",
  "Huge HEV":"https://dongfeng.ec/wp-content/uploads/elementor/thumbs/HUGE_BLANCO_45-rnulajty5swzogbp3bij7p1uuiew3x6g3wfn2llbc0.webp",
  "Paladin":"https://dongfeng.ec/wp-content/uploads/elementor/thumbs/PALADIN_BLANCO_45-rnulah0flat4pmfsjsani7rh2cssgtv93ih6mrphuo.webp",
  "Rich 6":"https://dongfeng.ec/wp-content/uploads/elementor/thumbs/RICH6_BLANCO_45-rnulah0flat4pmfsjsani7rh2cssgtv93ih6mrphuo.webp",
  "Rich 7":"https://dongfeng.ec/wp-content/uploads/elementor/thumbs/RICH7_BLANCO_45-rnulae6x0sp9qsjw092rsqh3a76otqk234iq6xtodc.webp",
  "Z9":"https://dongfeng.ec/wp-content/uploads/elementor/thumbs/Z9_BLANCO_45-rnulaf4r7mqk2eiiurhed88jvl221fnsf967o7sa74.webp",
  "T03":"https://images.squarespace-cdn.com/content/v1/645c13008d176d768e18c7fa/43fce0f3-f725-48b9-b5c9-f01cc9131adf/leapmotor+t03+ciudad.jpg?format=1000w",
  "B10":"https://cdn.prod.website-files.com/65255f23e2c300bb2b06a70c/694acda84245c9ab7462bebc_1754993752293Photo2_desktop.jpg",
  "C10":"https://cdn.prod.website-files.com/651ee1555f1452816833639d/68dc20f79148c14468c6dd82_c10SIETE.avif",
  "C11":"https://cdn.prod.website-files.com/651ee1555f1452816833639d/652802069e75672b5153a4ee_6c11-1.jpg",
  "C16":"https://cdn.prod.website-files.com/651ee1555f1452816833639d/68dc266ae30e88ac2cad2546_c16SIETE.avif",
  "CS75 Plus":"https://www.changan.cl/media/dpuep4s1/1000x493-10.webp",
  "Alsvin":"https://www.changan.cl/media/q4vhhe20/0005-alsvin-plus-miniatura_220x110.webp",
  "CS35 Max":"https://www.changan.cl/media/dmlbpnqv/0006-miniatura-cs35-max-220-x-110-px-1.webp",
  "CS55 Plus":"https://www.changan.cl/media/poelxu5u/changan_cl_model_nav_cs55_plus_idd_blanco_.webp",
  "Lumin":"https://www.changan.cl/media/keihuuki/changan_cl_pdp_model_lumin.webp",
  "Eado Plus":"https://www.changan.cl/media/txsbrvbg/changan_cl_model_nav_eado_plus_idd_negro.webp",
  "UNI-K":"https://www.changan.cl/media/en5dzqkr/1000x493-gris-arena.webp",
  "UNI-T":"https://www.changan.cl/media/ryhdyyrc/blanco-elite-unit.webp",
  "X7 Plus":"https://www.changan.cl/media/jmyaoqcj/img_x7plus_220x110_azuloscuro.webp",
  "Hunter":"https://www.changan.cl/media/rp5fgkbt/changan_cl_pdp_model_hunter_reev.webp",
  "CS35 Plus":"https://www.changan.cl/media/pcjjt2qx/new-cs35-plus-1000x493-plata.webp",
  "CS15":"https://www.changan.cl/media/v1ibo2yq/newcs15-1000x493-rojo.webp",
  "F70":"https://www.changan.cl/media/lajffga0/hunter-gris.webp",
  "Deepal S05":"https://www.deepalautos.cl/deepal/site/artic/20251108/imag/foto_0000030020251108030735/DEEPAL_CL_HOME_MODELS_PORTADA_S05_DESKTOP.webp",
  "Deepal S07":"https://www.deepalautos.cl/deepal/site/artic/20250213/imag/foto_0000017320250213162359/deepal_s7_color_white290424071155-drive.png",
  "Deepal G318":"https://www.deepalautos.cl/deepal/site/artic/20260402/imag/foto_0000039520260402130725/DEEPAL_G318_480x194_8_1.webp",
  "AVATR 11":"https://www.changan.cl/media/fb2hwu03/avatr-11.webp",
  "AVATR 07":"https://www.changan.cl/media/2qlhqkhv/avatr-07-2.webp",
  ...strategicImages,
};
const publicBasePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
const withPublicBasePath = (value:string) => value.startsWith("/") ? `${publicBasePath}${value}` : value;
const modelImage = (model:string) => {
  if(officialRemoteImages[model]) return withPublicBasePath(officialRemoteImages[model]);
  const slug = model.toLowerCase().replace(/&/g,"and").replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");
  return withPublicBasePath(`/cars/${slug}.${officialAvifModels.has(slug) ? "avif" : "jpg"}`);
};

const auditedSources = new Set([
  "byd-br","denza-br","byd-ar","byd-cl","byd-uy","byd-ec","byd-pe","chery-ar","chery-cl","chery-uy","chery-ec","chery-pe","oj-br","oj-cl","oj-uy","jetour-uy","jetour-pe","geely-br","geely-ar","geely-cl","geely-uy","geely-bo","geely-ec","geely-pe","lynk-cl","lynk-ec","gwm-br","wey-br","gwm-ar","gwm-cl","gwm-uy","gwm-pe","dongfeng-ar","dongfeng-cl","dongfeng-uy","dongfeng-bo","dongfeng-ec","dongfeng-pe","voyah-global","leap-br","leap-ar","leap-cl","leap-uy","leap-ec","changan-br","changan-ar","changan-cl","deepal-cl","avatr-cl","avatr07-cl","changan-uy","changan-bo","changan-ec","deepal-ec","changan-pe",...Object.keys(strategicSources),
]);
const freshSources = new Set(["oj-br","oj-cl","oj-it","oj-fr","oj-nl","oj-es","oj-de","oj-pl","oj-be","oj-se","oj-uk","oj-hu","oj-il","oj-au","oj-nz","oj-my","ebro-es"]);

const baseCars: BaseCar[] = Object.entries(raw).flatMap(([country, rows]) => rows.map((row, index) => {
  const [group,brand,model,price,trimStr,source] = row.split("|");
  const trims = trimStr.split(",").map(x=>{const i=x.lastIndexOf(":"); return {name:x.slice(0,i),price:x.slice(i+1)}});
  return {id:`${country}-${brand}-${model}-${index}`,country,flag:countries.find(x=>x[0]===country)?.[1]||"",group,brand,model,image:modelImage(model),price,trims,source,verified:freshSources.has(source)?"2026-08-26":auditedSources.has(source)?"2026-08-23":"2026-08-17",...(S[model]||{dims:"官网未披露",wheelbase:"官网未披露",energy:"待核验",use:"官网未披露",range:"官网未披露",safety:"未查到有效五星成绩",rating:"unknown"})};
}));

const splitPowertrains = (c: BaseCar): PowerCar[] => {
  const make = (variant:string, energy:string, use:string, range:string, match?:RegExp):PowerCar => {
    const matched = match ? c.trims.filter(t=>match.test(t.name)) : c.trims;
    const trims = matched.length ? matched : [{name:`${variant} 版本`,price:"询价"}];
    const listed = trims.find(t=>t.price!=="询价")?.price;
    return {...c,id:`${c.id}-${variant}`,variant,energy,use,range,trims,price:matched.length?(listed||"询价"):c.price};
  };
  const ice = (match?:RegExp)=>make("燃油","汽油 ICE",c.use.includes("依版本")?"约 7.5 L/100km*":c.use,"—",match);
  const hev = (match?:RegExp,label="HEV")=>make(label,label==="MHEV"?"轻混 MHEV":"油电混动 HEV",label==="MHEV"?"约 6.8 L/100km*":"约 5.2 L/100km*","—",match);
  const phev = (match?:RegExp)=>make("PHEV","插混 PHEV",c.model.includes("Haval")?"约 1.0 L/100km 等效*":c.use.includes("依版本")?"约 2.0 L/100km 等效*":c.use,c.range.includes("PHEV")?c.range.replace(/^PHEV /,""):c.range,match);
  const bev = (match?:RegExp)=>make("BEV","纯电 BEV",c.use.includes("依版本")?"约 17 kWh/100km*":c.use,c.range,match);
  const reev = (match?:RegExp)=>make("REEV","增程 REEV",c.use.includes("依版本")?"当地官网未公布":c.use,c.range,match);

  if(c.model==="Denza D9"){
    const hasPhev=c.trims.some(t=>/DM-i|PHEV/i.test(t.name)),hasBev=c.trims.some(t=>/EV|BEV/i.test(t.name));
    return hasPhev||hasBev?[...(hasPhev?[phev(/DM-i|PHEV/i)]:[]),...(hasBev?[bev(/EV|BEV/i)]:[])]:[phev(),bev()];
  }
  if(c.model==="Tiggo 4"&&c.trims.some(t=>/HEV|Hybrid/i.test(t.name))) return [ice(/ICE/i),hev(/HEV|Hybrid/i)];
  if(c.model==="Tiggo 5X") return c.trims.some(t=>/Hybrid/i.test(t.name))?[ice(/Sport|Pro(?! Hybrid)/i),hev(/Hybrid/i)]:[ice()];
  if(c.model==="Tiggo 7"){
    if(c.country==="阿根廷") return [hev(undefined,"MHEV")];
    if(c.country==="巴西") return [ice(/Sport|Pro Max Drive/i),hev(/Hybrid Max Drive/i,"MHEV"),phev(/PHEV|Plug-in/i)];
    if(c.country==="智利") return [ice(/Pro|Max/i),phev(/CSH/i)];
    if(c.country==="乌拉圭") return [phev()];
    if(c.country==="厄瓜多尔") return [ice(/^Pro$/i),phev(/PHEV|CSH/i)];
    const parts:PowerCar[]=[];
    if(c.trims.some(t=>/ICE/i.test(t.name))) parts.push(ice(/ICE/i));
    if(c.trims.some(t=>/(^|\b)(HEV|Hybrid)(\b|$)/i.test(t.name))) parts.push(hev(/(^|\b)(HEV|Hybrid)(\b|$)/i));
    if(c.trims.some(t=>/PHEV|Plug-in/i.test(t.name))) parts.push(phev(/PHEV|Plug-in/i));
    return parts.length?parts:[ice()];
  }
  if(c.model==="Tiggo 8 Pro"){
    if(c.country==="巴西") return [ice(/Max Drive/i),phev(/Plug-in/i)];
    if(c.country==="智利") return [ice(/Max/i),phev(/CSH/i)];
    if(c.country==="秘鲁") return [ice(/New Tiggo 8/i),phev(/CSH/i)];
    const parts:PowerCar[]=[];
    if(c.trims.some(t=>/ICE/i.test(t.name))) parts.push(ice(/ICE/i));
    if(c.trims.some(t=>/PHEV|Plug-in/i.test(t.name))) parts.push(phev(/PHEV|Plug-in/i));
    return parts.length?parts:[ice()];
  }
  if(c.model==="Tiggo 9"&&c.trims.some(t=>/PHEV/i.test(t.name))) return [phev(/PHEV/i)];
  if(c.model==="Omoda 5"){
    if(c.country==="巴西") return [ice(/Luxury|Prestige/i),hev(/HEV|Hybrid/i)];
    if(c.country==="乌拉圭") return [ice(/2027/i),phev(/SHS/i)];
    const parts:PowerCar[]=[];
    if(c.trims.some(t=>/ICE/i.test(t.name))) parts.push(ice(/ICE/i));
    if(c.trims.some(t=>/(^|\b)(HEV|Hybrid)(\b|$)/i.test(t.name))) parts.push(hev(/(^|\b)(HEV|Hybrid)(\b|$)/i));
    return parts.length?parts:[ice()];
  }
  if(c.model==="Omoda 7"){
    const parts:PowerCar[]=[];
    if(c.trims.some(t=>/^ICE|Petrol/i.test(t.name))) parts.push(ice(/^ICE|Petrol/i));
    if(c.trims.some(t=>/PHEV|SHS/i.test(t.name))) parts.push(phev(/PHEV|SHS/i));
    return parts.length?parts:[phev()];
  }
  if(c.model==="Omoda 9"){
    const parts:PowerCar[]=[];
    if(c.trims.some(t=>/^ICE|Petrol/i.test(t.name))) parts.push(ice(/^ICE|Petrol/i));
    if(c.trims.some(t=>/PHEV|SHS/i.test(t.name))) parts.push(phev(/PHEV|SHS/i));
    return parts.length?parts:[phev()];
  }
  if(c.model==="Jaecoo 5"){
    if(c.country==="乌拉圭") return [bev()];
    const hasEv=c.trims.some(t=>/EV|BEV/i.test(t.name)),hasIce=c.trims.some(t=>/ICE/i.test(t.name));
    return hasEv&&hasIce?[ice(/ICE/i),bev(/EV|BEV/i)]:hasEv?[bev()]:[ice()];
  }
  if(c.model==="Jaecoo 7"){
    if(["巴西","乌拉圭"].includes(c.country)) return [phev()];
    if(c.country==="智利") return [ice(/Elemental|Prime|Summit/i),phev(/SHS/i)];
    const hasPhev=c.trims.some(t=>/PHEV|SHS/i.test(t.name)),hasIce=c.trims.some(t=>/ICE/i.test(t.name));
    return hasPhev&&hasIce?[ice(/ICE/i),phev(/PHEV|SHS/i)]:hasPhev?[phev()]:[ice()];
  }
  if(c.model==="Jaecoo 8") return c.trims.some(t=>/PHEV/i.test(t.name))?[phev()]:[ice()];
  if(c.model==="Jetour T2"||c.model==="Lynk & Co 06") return [ice()];
  if(c.model==="Jetour T1") return [ice(/2.0T/i),phev(/PHEV/i)];
  if(c.model==="Okavango") return c.country==="秘鲁"?[hev(/Mild Hybrid/i,"MHEV"),ice(/^New$/i)]:[hev(undefined,"MHEV")];
  if(c.model==="Haval Jolion"){
    if(["智利","乌拉圭","厄瓜多尔"].includes(c.country)) return [ice(/Deluxe/i),hev(/HEV/i)];
    const hasHev=c.trims.some(t=>/(^|\b)HEV(\b|$)/i.test(t.name)),hasIce=c.trims.some(t=>/ICE/i.test(t.name));
    return hasHev&&hasIce?[ice(/ICE/i),hev(/(^|\b)HEV(\b|$)/i)]:hasHev?[hev()]:[ice()];
  }
  if(c.model==="Haval H6"){
    if(c.country==="巴西") return [hev(/HEV/i),phev(/PHEV|GT/i)];
    if(c.country==="智利"||c.country==="厄瓜多尔") return [hev(/HEV/i),ice(/GT/i)];
    if(c.country==="乌拉圭") return [hev(/HEV/i),phev(/PHEV|GT/i)];
    if(c.country==="秘鲁") return [ice(/New H6|H6 GT/i),hev(/Híbrido/i)];
    const parts:PowerCar[]=[];
    if(c.trims.some(t=>/ICE/i.test(t.name))) parts.push(ice(/ICE/i));
    if(c.trims.some(t=>/(^|\b)HEV(\b|$)/i.test(t.name))) parts.push(hev(/(^|\b)HEV(\b|$)/i));
    if(c.trims.some(t=>/PHEV/i.test(t.name))) parts.push(phev(/PHEV/i));
    return parts.length?parts:[hev()];
  }
  if(c.model==="Tank 300"){
    if(c.country==="巴西") return [phev()];
    if(c.country==="秘鲁") return [ice()];
    const hasPhev=c.trims.some(t=>/PHEV/i.test(t.name)),hasHev=c.trims.some(t=>/(^|\b)HEV(\b|$)/i.test(t.name));
    return hasPhev&&hasHev?[hev(/(^|\b)HEV(\b|$)/i),phev(/PHEV/i)]:hasPhev?[phev()]:[hev()];
  }
  if(c.model==="Tank 500") return [hev()];
  if(c.model==="Wingle 5") return [make("汽油","汽油 ICE","约 10.5 L/100km*","—",/Gasolina/i),make("柴油","柴油 ICE","约 8.8 L/100km*","—",/Diesel/i)];
  if(c.model==="Rich 6") return [make("汽油","汽油 ICE",c.use,"—",/Gasolina/i),make("柴油","柴油 ICE",c.use,"—",/Diésel|Diesel/i)];
  if(c.model==="Poer P500") return c.trims.some(t=>/HEV/i.test(t.name))?[make("柴油","柴油 ICE",c.use,"—",/Diesel/i),hev(/HEV/i)]:[make("柴油","柴油 ICE",c.use,"—")];
  if(["B10","C10","C11","C16"].includes(c.model)){
    const hasBev=c.trims.some(t=>/BEV|EV/i.test(t.name)),hasReev=c.trims.some(t=>/REEV|Ultra/i.test(t.name));
    const variants=[...(hasBev?[bev(/BEV|EV/i)]:[]),...(hasReev?[reev(/REEV|Ultra/i)]:[])];
    return variants.length?variants:[bev()];
  }
  if(c.model==="CS55 Plus"){
    const hasPhev=c.trims.some(t=>/PHEV|iDD/i.test(t.name)),hasIce=c.trims.some(t=>/ICE|New/i.test(t.name));
    if(hasPhev&&hasIce) return [ice(/ICE|New/i),phev(/PHEV|iDD/i)];
    return hasPhev?[phev()]:[ice()];
  }
  if(c.model==="Hunter"){
    const hasReev=c.trims.some(t=>/REEV/i.test(t.name)),hasDiesel=c.trims.some(t=>/Diesel/i.test(t.name));
    if(hasReev&&hasDiesel) return [make("柴油","柴油 ICE",c.use,"—",/Diesel/i),reev(/REEV/i)];
    return hasReev?[reev()]:[make("柴油","柴油 ICE",c.use,"—")];
  }
  if(c.model==="Deepal S07"){
    const hasBev=c.trims.some(t=>/BEV|EV/i.test(t.name)),hasReev=c.trims.some(t=>/REEV/i.test(t.name));
    return [...(hasBev?[bev(/BEV|EV/i)]:[]),...(hasReev?[reev(/REEV/i)]:[])];
  }
  if(c.model==="Deepal S05"){
    const hasBev=c.trims.some(t=>/BEV|EV/i.test(t.name)),hasReev=c.trims.some(t=>/REEV/i.test(t.name));
    return [...(hasBev?[bev(/BEV|EV/i)]:[]),...(hasReev?[reev(/REEV/i)]:[])];
  }
  if(c.energy.includes(" / ")) return [make(c.energy.split(" / ")[0],c.energy.split(" / ")[0],c.use,c.range)];
  return [make(c.energy.includes("纯电")?"BEV":c.energy.includes("插混")?"PHEV":c.energy.includes("增程")?"REEV":c.energy.includes("混动")?"HEV":"燃油",c.energy,c.use,c.range)];
};

const driveByModel: Record<string,string> = {
  "Dolphin Mini":"前驱","Dolphin":"前驱","Yuan Pro":"前驱","Yuan Up":"前驱","Yuan Up DM-i":"前驱","Yuan Plus":"前驱","Song Pro":"前驱","Song Plus":"前驱","King":"前驱","Seal":"后驱","Sealion 7":"后驱","Tang":"四驱","Atto 8":"四驱","Shark":"四驱","Denza B5":"四驱","Denza D9":"前驱 / 四驱",
  "Tiggo 2 Pro":"前驱","Tiggo 4":"前驱","Tiggo 4 CSH":"前驱","Tiggo 5X":"前驱","Tiggo 7":"前驱","Tiggo 8 Pro":"前驱","Arrizo 8 CSH":"前驱","Arrizo 5 Pro":"前驱","M7":"前驱","Tiggo 9":"四驱","Himla":"四驱","Omoda 5":"前驱","Omoda E5":"前驱","Jaecoo 5":"前驱","Jaecoo 6":"四驱","Jaecoo 7":"前驱","Jaecoo 8":"四驱","Exeed LX":"前驱","Exeed TXL":"四驱","Jetour X50":"前驱","Jetour Dashing":"前驱","Jetour X70":"前驱","Jetour T1":"四驱","Jetour T2":"四驱",
  "GX3 Pro":"前驱","Emgrand":"前驱","Coolray":"前驱","Cityray":"前驱","Starray":"前驱","Okavango":"前驱","EX2":"后驱","EX5":"前驱","EX5 EM-i":"前驱","Zeekr X":"后驱","Zeekr 001":"四驱","Lynk & Co 01":"前驱","Lynk & Co 06":"前驱",
  "Ora 03":"前驱","Haval Jolion":"前驱","Haval H6":"前驱","Haval H7":"前驱","Haval H9":"四驱","Tank 300":"四驱","Tank 500":"四驱","Poer":"四驱","Wingle 5":"后驱 / 四驱","Wingle 7":"四驱","Poer P500":"四驱","WEY 07":"四驱",
  "BOX":"前驱","Nammi":"前驱","Vigo":"前驱","E70":"前驱","Mage":"前驱","Mage HEV":"前驱","Mage EV":"前驱","Huge HEV":"前驱","Paladin":"四驱","Rich 6":"后驱 / 四驱","Rich 7":"后驱 / 四驱","Z9":"四驱",
  "T03":"前驱","B10":"后驱","C10":"后驱","C11":"后驱","C16":"后驱","UNI-T":"前驱","CS55 Plus":"前驱","Eado Plus":"前驱","Lumin":"前驱","CS75 Plus":"前驱","Alsvin":"前驱","CS35 Max":"前驱","CS35 Plus":"前驱","CS15":"前驱","UNI-K":"前驱","X7 Plus":"前驱","Hunter":"后驱 / 四驱","F70":"四驱","Deepal S05":"后驱","Deepal S07":"后驱","Deepal G318":"四驱","AVATR 11":"后驱","AVATR 07":"后驱 / 四驱",
  ...strategicDriveByModel,
};

const splitDrivetrains = (c: PowerCar): Car[] => {
  const record = (drive:string, trims:Trim[]=c.trims, price?:string):Car => {
    const listedTrims = trims.length ? trims : [{name:`${c.variant} · ${drive} 版本`,price:"询价"}];
    return {...c,id:`${c.id}-${drive}`,drive,trims:listedTrims,price:price || listedTrims.find(t=>t.price!=="询价")?.price || "询价"};
  };
  const match = (re:RegExp) => c.trims.filter(t=>re.test(t.name));

  if(c.model==="Seal"){
    if(c.country==="巴西") return [record("四驱")];
    if(c.country==="智利") return [record("后驱",match(/Design/i)),record("四驱",match(/Performance/i))];
    if(c.trims.some(t=>/AWD/i.test(t.name))) return [record("后驱",match(/RWD|Design/i)),record("四驱",match(/AWD|Performance|Excellence/i))];
    return [record("后驱")];
  }
  if(c.model==="Sealion 7"){
    if(c.country==="巴西") return [record("四驱")];
    if(c.trims.some(t=>/AWD|Performance|Excellence/i.test(t.name))) return [record("后驱",match(/RWD|Comfort|Premium/i)),record("四驱",match(/AWD|Performance|Design|Excellence/i))];
    return [record("后驱")];
  }
  if(c.model==="Denza D9"){
    const fwd=match(/FWD|前驱/i),awd=match(/AWD|四驱/i);
    if(fwd.length||awd.length) return [...(fwd.length?[record("前驱",fwd)]:[]),...(awd.length?[record("四驱",awd)]:[])];
    return [record("前驱",[{name:`${c.variant} 前驱版本`,price:"询价"}]),record("四驱",[{name:`${c.variant} 四驱版本`,price:"询价"}])];
  }
  if(c.model==="Jaecoo 6"&&c.country==="智利") return [
    record("后驱",[{name:"ANDES RWD",price:"CLP 29.990.000"}],"CLP 29.990.000"),
    record("四驱",[{name:"PATAGONIA I-WD",price:"CLP 32.490.000"}],"CLP 32.490.000"),
  ];
  if(c.model==="Jaecoo 7"&&c.country==="智利"&&c.variant==="燃油") return [
    record("前驱",match(/Elemental|Prime/i)),
    record("四驱",match(/Summit AWD/i)),
  ];
  if(c.model==="Zeekr X"&&c.country==="智利") return [record("后驱",match(/Premium/i)),record("四驱",match(/Privilege AWD/i))];
  if(c.model==="Poer"){
    if(["乌拉圭","厄瓜多尔"].includes(c.country)) return [record("后驱",match(/4x2/i)),record("四驱",match(/4x4/i))];
    if(c.country==="智利") return [
      record("后驱",[{name:"Elite 4x2",price:c.price},{name:"Deluxe 4x2",price:"询价"}],c.price),
      record("四驱",[{name:"Elite 4x4",price:"询价"},{name:"Deluxe 4x4",price:"询价"}]),
    ];
    if(c.country==="秘鲁") return [
      record("后驱",match(/^Mecánica$/i)),
      record("四驱",match(/New 2\.4|Automática/i)),
    ];
  }
  if(c.model==="Wingle 5"&&c.country==="秘鲁"){
    if(c.variant==="汽油") return [record("后驱",c.trims.map(t=>({...t,name:`${t.name} 4x2`})) )];
    return [record("后驱",c.trims.map(t=>({...t,name:`${t.name} 4x2`}))),record("四驱",[{name:"Diesel 4x4",price:"询价"}])];
  }
  if(c.model==="Rich 6"){
    if(c.variant==="汽油") return [record("后驱")];
    const two=match(/4x2/i),four=match(/4x4/i);
    if(two.length&&four.length) return [record("后驱",two),record("四驱",four)];
    return [record(four.length?"四驱":"后驱")];
  }
  if(c.model==="Rich 7"){
    const two=match(/4x2/i),four=match(/4x4/i);
    if(two.length&&four.length) return [record("后驱",two),record("四驱",four)];
    return [record(four.length?"四驱":"后驱")];
  }
  if(c.model==="Haval H6"){
    if(c.variant==="HEV") return [record("前驱")];
    if(c.variant==="PHEV") return [record("四驱")];
    if(c.country==="秘鲁") return [record("前驱",match(/^New H6$/i)),record("四驱",match(/GT/i))];
    if(["智利","厄瓜多尔"].includes(c.country)&&c.trims.some(t=>/GT/i.test(t.name))) return [record("四驱")];
  }
  if(c.model==="Hunter"){
    const two=match(/4x2/i),four=match(/4x4/i);
    if(two.length&&four.length) return [record("后驱",two),record("四驱",four)];
    return [record(four.length?"四驱":"后驱")];
  }
  if(c.model==="AVATR 07") return [record("后驱",match(/RWD/i)),record("四驱",match(/AWD/i))];
  if(c.model==="Deepal S05"&&c.trims.some(t=>/AWD/i.test(t.name))) return [record("后驱",match(/RWD/i)),record("四驱",match(/AWD/i))];
  const configured=driveByModel[c.model]||"待核验";
  if(configured.includes(" / ")){
    const definitions=[
      {drive:"前驱",re:/FWD|前驱/i},
      {drive:"后驱",re:/RWD|后驱/i},
      {drive:"四驱",re:/AWD|4WD|四驱|Performance|Excellence|Privilege/i},
    ].filter(x=>configured.includes(x.drive));
    const tagged=definitions.map(x=>({...x,trims:match(x.re)}));
    if(tagged.some(x=>x.trims.length)) return tagged.filter(x=>x.trims.length).map(x=>record(x.drive,x.trims));
    return definitions.map(x=>record(x.drive,[{name:`${c.variant} · ${x.drive} 版本`,price:"询价"}]));
  }
  return [record(configured)];
};

const cars: Car[] = baseCars.flatMap(splitPowertrains).flatMap(splitDrivetrains);

const energyKey = (x:string) => x.includes("纯电")?"纯电":x.includes("插混")?"插混":x.includes("增程")?"增程":x.includes("混动")?"混动":"燃油";

const batteryByModel: Record<string,string> = {
  "Dolphin":"44.9 kWh","Yuan Plus":"60.48 kWh","Song Plus":"18.3 kWh","King":"18.3 kWh","Seal":"82.56 kWh","Sealion 7":"82.5 kWh","Tang":"108.8 kWh","Shark":"29.58 kWh","Denza B5":"31.8 kWh","Tiggo 7":"18.3 kWh","Tiggo 8 Pro":"18.3 kWh","Arrizo 8 CSH":"18.3 kWh","Omoda E5":"61.1 kWh","Jaecoo 7":"18.3 kWh","Jaecoo 8":"34.5 kWh","EX5":"60.2 kWh","EX5 EM-i":"18.4 kWh","Zeekr 001":"100 kWh","Lynk & Co 01":"17.6 kWh","Lynk & Co 06":"19.1 kWh","WEY 07":"42.5 kWh","BOX":"43.9 kWh","Mage EV":"50.82 kWh","E70":"当地官网未按配置公布","Vigo":"当地官网未按配置公布","T03":"41.3 kWh","B10":"56.2–67.1 kWh","C10":"69.9 kWh","C11":"69.2 kWh","C16":"67.7 kWh","Lumin":"17.65–28.08 kWh","Eado Plus":"当地官网未按配置公布","CS55 Plus":"当地官网未按配置公布","Deepal S05":"27.28 kWh","Deepal S07":"31.74–79.97 kWh","Deepal G318":"35.1 kWh","AVATR 11":"90 kWh","AVATR 07":"39.05 kWh",
  ...strategicBatteryByModel,
};

const trimEnergyDetail = (car:Car, trim:Trim) => {
  const n=trim.name;
  if(car.model==="Atto 1"){
    const long=/Premium|38\.88/i.test(n);
    return {battery:long?"38.88 kWh":"30.08 kWh",range:long?"380 km NEDC*":"300 km NEDC*"};
  }
  if(car.model==="Seal U DM-i"){
    if(/Comfort/i.test(n)) return {battery:"26.6 kWh",range:"125 km 纯电 WLTP*"};
    return {battery:"18.3 kWh",range:/Design|AWD/i.test(n)?"70 km 纯电 WLTP*":"80 km 纯电 WLTP*"};
  }
  if(car.model==="M6"){
    const long=/Superior|71\.8/i.test(n);
    return {battery:long?"71.8 kWh":"55.4 kWh",range:long?"530 km NEDC":"420 km NEDC"};
  }
  if(car.model==="M6 DM-i"){
    const long=/Cross|18\.3/i.test(n);
    return {battery:long?"18.3 kWh":"7.4 kWh",range:long?"当地官网未逐配置公布":"45 km 纯电 NEDC"};
  }
  if(car.model==="XPENG G6"){
    const standard=/Standard/i.test(n),awd=/AWD|Performance/i.test(n);
    return {battery:standard?"68.5 kWh":"80.8 kWh",range:standard?"470 km WLTP":awd?"510 km WLTP":"525 km WLTP"};
  }
  if(car.model==="XPENG G9"){
    const standard=/Standard/i.test(n),awd=/AWD|Performance/i.test(n);
    return {battery:standard?"79 kWh":"98 kWh",range:standard?"460 km WLTP":awd?"520 km WLTP":"570 km WLTP"};
  }
  if(car.model==="XPENG P7+") return {battery:"74.9 kWh",range:/AWD|Performance/i.test(n)?"500 km WLTP":"530 km WLTP"};
  if(car.model==="XPENG X9") return /AWD|Performance/i.test(n)?{battery:"110 kWh",range:"580 km WLTP"}:{battery:"94.8 kWh",range:"535 km WLTP"};
  if(["NIO ET5","NIO ET5 Touring","NIO EL6","NIO EL8"].includes(car.model)){
    const long=/100 kWh|Long/i.test(n),ranges:Record<string,[string,string]>={"NIO ET5":["456 km","590 km"],"NIO ET5 Touring":["435 km","560 km"],"NIO EL6":["406 km","529 km"],"NIO EL8":["390 km","510 km"]};
    const pair=ranges[car.model];
    return {battery:long?"100 kWh":"75 kWh",range:`${long?pair[1]:pair[0]} WLTP`};
  }
  if(car.model==="Zeekr 7X") return /Long|100|AWD|Performance/i.test(n)?{battery:"100 kWh",range:car.drive==="四驱"?"543 km WLTP*":"615 km WLTP"}:{battery:"75 kWh",range:"480 km WLTP*"};
  if(car.model==="Lynk & Co 02") return {battery:"66 kWh",range:"最高 445 km WLTP"};
  if(car.model==="Lynk & Co 08") return {battery:"39.6 kWh",range:"200 km 纯电 WLTP"};
  if(car.model==="Omoda 7"&&car.variant==="PHEV") return {battery:"18.4 kWh",range:car.country==="巴西"?"60 km 纯电 INMETRO*":"90–92 km 纯电 WLTP*"};
  if(car.model==="Omoda 9"&&car.variant==="PHEV") return {battery:"34.46 kWh",range:["澳大利亚","新西兰","马来西亚"].includes(car.country)?"最高 169 km 纯电 NEDC*":"145 km 纯电 WLTP*"};
  if(car.model==="firefly") return {battery:"42.1 kWh",range:"330 km WLTP"};
  if(car.model==="Deepal S05"&&car.variant==="BEV") return {battery:"68.8 kWh LFP",range:car.drive==="四驱"?"278 mi / 447 km WLTP":"303 mi / 488 km WLTP"};
  if(car.model==="Dolphin Mini"){
    const small=/\bGL\b/i.test(n);
    if(car.country==="巴西") return {battery:small?"30.08 kWh":"38 kWh",range:small?"250 km PBEV":"280 km PBEV"};
    return {battery:small?"30.1 kWh":"38.9 kWh",range:small?"300 km NEDC / 230 km WLTC":"380 km NEDC / 300 km WLTC"};
  }
  if(car.model==="Nammi"){
    const long=/430|42\.3/i.test(n);
    return {battery:long?"42.3 kWh":"31.4 kWh",range:long?"430 km CLTC":"330 km CLTC"};
  }
  if(car.model==="Mage HEV") return {battery:"1.9 kWh（350V）",range:"不适用（非插电）"};
  if(car.model==="Mage EV") return {battery:"50.82 kWh",range:"445 km CLTC"};
  if(car.model==="T03") return {battery:"41.3 kWh",range:car.country==="乌拉圭"?"280 km WLTP":"418 km CLTC / 300 km WLTP"};
  if(car.model==="AVATR 11") return {battery:"90 kWh",range:"575 km NEDC"};
  if(car.model==="AVATR 07") return {battery:"39.05 kWh",range:car.drive==="四驱"?"900 km 综合 WLTP":"932 km 综合 WLTP"};
  if(car.model==="B10") return car.variant==="REEV"?{battery:"当地官网未按配置公布",range:"超过 900 km 综合*"}:{battery:car.country==="智利"?"56.2 kWh":"67.1 kWh",range:car.country==="智利"?"360 km NEDC":"540 km NEDC"};
  if(car.model==="C10") return car.variant==="REEV"?{battery:"28.4 kWh",range:car.country==="乌拉圭"?"1,140 km 综合 / 170 km 纯电 NEDC":"1,000–1,190 km 综合*"}:{battery:"69.9 kWh",range:car.country==="智利"?"480 km NEDC":"530 km CLTC"};
  if(car.model==="C11") return car.variant==="REEV"?{battery:"当地官网未按配置公布",range:"1,210 km 综合 CLTC"}:{battery:"69.2 kWh",range:"500–502 km CLTC"};
  if(car.model==="C16") return car.variant==="REEV"?{battery:"28.4 kWh",range:"1,095 km 综合 / 200 km 纯电 CLTC"}:{battery:"67.7 kWh",range:"502 km CLTC"};
  if(car.model==="Lumin") return {battery:car.country==="乌拉圭"?"17.65 kWh":"28.08 kWh",range:car.country==="乌拉圭"?"205 km CLTC":"301 km NEDC"};
  if(car.model==="Deepal S05") return {battery:"27.28 kWh LFP",range:"1,129 km 综合 / 158–160 km 纯电 NEDC"};
  if(car.model==="Deepal S07") return car.variant==="REEV"?{battery:"31.74 kWh LFP",range:"1,170 km 综合 / 174–185 km 纯电 NEDC"}:{battery:"79.97 kWh",range:"560 km NEDC"};
  if(car.model==="Deepal G318") return {battery:"35.1 kWh LFP",range:"938 km 综合 / 143 km 纯电"};
  if(car.model==="Hunter"&&car.variant==="REEV") return {battery:"当地官网未按配置公布",range:"约 1,031 km 综合 / 131 km 纯电 NEDC"};
  if(car.model==="Eado Plus") return {battery:"当地官网未按配置公布",range:"995 km 综合 / 125 km 纯电 NEDC"};
  if(car.model==="CS55 Plus"&&car.variant==="PHEV") return {battery:"当地官网未按配置公布",range:"1,040–1,215 km 综合 / 107 km 纯电 NEDC*"};
  if(car.model==="Song Pro") return {battery:/\bGL\b/i.test(n)?"12.9 kWh":"18.3 kWh",range:/\bGL\b/i.test(n)?"约 71 km 纯电*":"约 110 km 纯电*"};
  if(car.model==="Seal") return {battery:"82.56 kWh",range:car.drive==="四驱"?"520 km WLTP":"570 km WLTP"};
  if(car.model==="Sealion 7") return /Excellence|91\.3/i.test(n)?{battery:"91.3 kWh",range:"502 km WLTP"}:{battery:"82.5 kWh",range:car.drive==="四驱"?"456 km WLTP":"482 km WLTP"};
  if(car.model==="Denza D9") return car.variant==="BEV"?{battery:"103 kWh",range:"最高约 600 km*"}:{battery:"40 kWh",range:"当地官网未按配置公布"};
  if(car.model==="Jaecoo 6") return car.drive==="后驱"?{battery:"65.69 kWh",range:"335 km WLTP"}:{battery:"69.77 kWh",range:"364 km WLTP"};
  if(car.model==="Zeekr X") return /Privilege|AWD/i.test(n)||car.drive==="四驱"?{battery:"69 kWh",range:"约 425 km WLTP*"}:{battery:"64 kWh",range:"约 446 km WLTP*"};
  if(car.model==="Ora 03") return {battery:"依配置：48 / 63.1 kWh",range:car.trims.length===1?car.range:"当地官网未按配置公布"};
  if(car.model==="Haval H6"&&car.variant==="PHEV"){
    if(/PHEV19/i.test(n)) return {battery:"19 kWh",range:"当地官网未按配置公布"};
    return {battery:"约 34 kWh*",range:"约 100 km 纯电*"};
  }
  if(car.model==="Tank 300") return car.variant==="PHEV"?{battery:"37.1 kWh",range:"约 75 km 纯电*"}:{battery:"约 1.7 kWh*",range:"不适用（非插电）"};
  if(["Tiggo 4 CSH","Omoda 5","Haval Jolion","Haval H6","Haval H7","Tank 500","Poer P500","Huge HEV"].includes(car.model)&&car.energy.includes("混动")) return {battery:"当地官网未按配置公布",range:"不适用（非插电）"};
  if(car.energy.includes("轻混")) return {battery:"48V 系统（容量未公布）",range:"不适用（非插电）"};
  if(energyKey(car.energy)==="燃油") return {battery:"不适用",range:"不适用"};
  const battery=batteryByModel[car.model]||"当地官网未按配置公布";
  const range=car.trims.length===1?car.range:"当地官网未按配置公布";
  return {battery,range};
};

const fxToCny:Record<string,number> = {"US$":6.7206,"R$":1.2992,"CLP":0.00726,"€":7.8624,"£":9.1772,"NOK":0.7235,"SEK":0.7107,"PLN":1.8251,"HUF":0.02167,"ILS":2.2517,"AUD":4.8174,"NZ$":4.0235,"THB":0.2057,"IDR":0.0003806,"MYR":1.6642,"SGD":5.2988};
const cnyPrice = (price:string) => {
  const currency = ["US$","R$","CLP","€","£","NOK","SEK","PLN","HUF","ILS","AUD","NZ$","THB","IDR","MYR","SGD"].find(code=>price.startsWith(code));
  if(!currency) return "";
  const amount = Number(price.replace(/\D/g,""));
  if(!amount) return "";
  const value = amount * fxToCny[currency];
  const rounded = value >= 100000 ? Math.round(value/1000)*1000 : Math.round(value/100)*100;
  return `约 ¥${rounded.toLocaleString("zh-CN")}`;
};

const modelIdentityAliases: Record<string,string> = {
  "BYD|Dolphin Mini":"BYD Seagull family",
  "BYD|Dolphin Surf":"BYD Seagull family",
  "BYD|Atto 1":"BYD Seagull family",
  "BYD|Yuan Plus":"BYD Atto 3 / Yuan Plus",
  "BYD|Atto 3":"BYD Atto 3 / Yuan Plus",
  "BYD|Yuan Up":"BYD Atto 2 / Yuan Up",
  "BYD|Atto 2":"BYD Atto 2 / Yuan Up",
  "BYD|Song Plus":"BYD Song Plus / Seal U / Sealion 6",
  "BYD|Seal U DM-i":"BYD Song Plus / Seal U / Sealion 6",
  "BYD|Sealion 6 DM-i":"BYD Song Plus / Seal U / Sealion 6",
  "BYD|Song Pro":"BYD Song Pro / Sealion 5",
  "BYD|Sealion 5 DM-i":"BYD Song Pro / Sealion 5",
  "BYD|Atto 8":"BYD Atto 8 / Sealion 8",
  "BYD|Sealion 8 DM-i":"BYD Atto 8 / Sealion 8",
  "Chery|Tiggo 5X":"Chery Tiggo 4 / Tiggo 5X",
  "Chery|Tiggo 4":"Chery Tiggo 4 / Tiggo 5X",
  "Chery|Tiggo 4 CSH":"Chery Tiggo 4 / Tiggo 5X",
  "Chery|Omoda 5":"Omoda 5 family",
  "Chery|Omoda E5":"Omoda 5 family",
  "Omoda|Omoda 5":"Omoda 5 family",
  "Omoda|Omoda E5":"Omoda 5 family",
  "Dongfeng|BOX":"Dongfeng BOX / Nammi",
  "Dongfeng|Nammi":"Dongfeng BOX / Nammi",
  "Dongfeng|Mage":"Dongfeng Mage family",
  "Dongfeng|Mage HEV":"Dongfeng Mage family",
  "Dongfeng|Mage EV":"Dongfeng Mage family",
};
const canonicalModel = (brand:string,model:string) => modelIdentityAliases[`${brand}|${model}`] || model.replace(/\s+(DM-i|CSH|HEV|EV)$/i,"").trim();
const localSalesAliases: Record<string,string[]> = {
  "Chery|Chery Tiggo 4 / Tiggo 5X|西班牙":["EBRO s400"],
  "Chery|Tiggo 7|西班牙":["EBRO s700"],
  "Chery|Tiggo 8 Pro|西班牙":["EBRO s800"],
  "Chery|Tiggo 9|西班牙":["EBRO s900"],
  "Omoda|Omoda 7|智利":["OMODA C7"],
  "Omoda|Omoda 7|马来西亚":["OMODA C7"],
  "Omoda|Omoda 9|马来西亚":["OMODA C9"],
};
const overviewModelName = (name:string) => name.replace(/^Chery\s+/i,"").replace(/\s+family$/i,"");
const brandCatalog = Object.entries(brandsByGroup).flatMap(([group,brands])=>brands.map(brand=>({group,brand})));

export default function Home(){
  const [coverageRegion,setCoverageRegion]=useState("南美"),[region,setRegion]=useState("全部区域"),[country,setCountry]=useState("全部市场"),[group,setGroup]=useState("全部集团"),[brand,setBrand]=useState("全部品牌"),[energy,setEnergy]=useState("全部能源"),[drive,setDrive]=useState("全部驱动"),[safe,setSafe]=useState(false),[query,setQuery]=useState(""),[selected,setSelected]=useState<Car|null>(null),[compare,setCompare]=useState<string[]>([]),[showCompare,setShowCompare]=useState(false),[showSources,setShowSources]=useState(false),[visible,setVisible]=useState(24),[overviewBrand,setOverviewBrand]=useState<string|null>(null);
  const brandOptions=group==="全部集团"?Object.values(brandsByGroup).flat():brandsByGroup[group]||[];
  const countryOptions=region==="全部区域"?countries:countries.filter(([name])=>regionOfCountry(name)===region);
  const filtered=useMemo(()=>cars.filter(c=>(region==="全部区域"||regionOfCountry(c.country)===region)&&(country==="全部市场"||c.country===country)&&(group==="全部集团"||c.group===group)&&(brand==="全部品牌"||c.brand===brand)&&(energy==="全部能源"||energyKey(c.energy)===energy)&&(drive==="全部驱动"||c.drive.includes(drive))&&(!safe||c.rating==="yes")&&(`${c.brand} ${c.model}`.toLowerCase().includes(query.toLowerCase()))),[region,country,group,brand,energy,drive,safe,query]);
  const uniqueBrands=new Set(cars.map(c=>c.brand)).size, priced=cars.filter(c=>c.price!=="询价").length, five=cars.filter(c=>c.rating==="yes").length;
  const compared=compare.map(id=>cars.find(c=>c.id===id)).filter(Boolean) as Car[];
  const reset=()=>{setRegion("全部区域");setCountry("全部市场");setGroup("全部集团");setBrand("全部品牌");setEnergy("全部能源");setDrive("全部驱动");setSafe(false);setQuery("");setVisible(24);setOverviewBrand(null)};
  const toggleCompare=(id:string)=>setCompare(v=>v.includes(id)?v.filter(x=>x!==id):v.length<3?[...v,id]:v);
  const coverageCountries=countries.filter(([name])=>regionOfCountry(name)===coverageRegion);
  const coverage=coverageCountries.map(([name,flag])=>({name,flag,...Object.fromEntries(groups.map(g=>[g,cars.filter(c=>c.country===name&&c.group===g).length]))}));
  const brandFootprint=brandCatalog.map(item=>{
    const models=[...new Set(cars.filter(c=>c.brand===item.brand).map(c=>canonicalModel(c.brand,c.model)))];
    return {...item,models,count:models.length};
  }).filter(item=>item.count>0).sort((a,b)=>b.count-a.count||a.brand.localeCompare(b.brand));
  const overviewActive=Boolean(overviewBrand&&brand===overviewBrand&&region==="全部区域"&&country==="全部市场"&&energy==="全部能源"&&drive==="全部驱动"&&!safe&&!query);
  const brandModelOverview=useMemo<BrandModelOverview[]>(()=>{
    if(!overviewBrand) return [];
    const map=new Map<string,Car[]>();
    cars.filter(c=>c.brand===overviewBrand).forEach(c=>{const key=canonicalModel(c.brand,c.model);map.set(key,[...(map.get(key)||[]),c])});
    return [...map.entries()].map(([key,records])=>{
      const powerNames=[...new Set(records.map(c=>energyKey(c.energy)))];
      const powers=powerNames.map(name=>{
        const configs=[...new Set(records.filter(c=>energyKey(c.energy)===name).flatMap(c=>c.trims.map(t=>t.name)))];
        return {name,configs:configs.slice(0,8),total:configs.length};
      });
      const regionNames=regionCountries.map(x=>x.name).filter(name=>records.some(c=>regionOfCountry(c.country)===name));
      const countryNames=countries.filter(([name])=>records.some(c=>c.country===name)).map(([name,flag])=>({name,flag}));
      const aliases=[...new Set(records.flatMap(c=>(localSalesAliases[`${c.brand}|${key}|${c.country}`]||[]).map(alias=>`${c.country}：${alias}`)))];
      return {key,name:overviewModelName(key),image:records[0].image,powers,regions:regionNames,countries:countryNames,aliases};
    }).sort((a,b)=>a.name.localeCompare(b.name,undefined,{numeric:true}));
  },[overviewBrand]);
  return <main className="shell">
    <header className="topbar"><button className="wordmark" onClick={reset}><span>DONGFENG</span> MARKET INTEL</button><nav><button onClick={()=>document.getElementById("lineup")?.scrollIntoView({behavior:"smooth"})}>车型库</button><button onClick={()=>document.getElementById("coverage")?.scrollIntoView({behavior:"smooth"})}>市场覆盖</button><button onClick={()=>setShowSources(true)}>数据来源</button></nav><div className="fresh"><i/>核验至 2026.08.26</div></header>
    <section className="heroStrategy" aria-label="东风集团主要战略市场竞品车型看板"><div><p>GLOBAL COMPETITOR VEHICLE INTELLIGENCE</p><h1>主要战略市场<br/><em>竞品车型看板</em></h1><span>覆盖南美、欧洲、澳新与东南亚，按市场、集团、子品牌、动力和驱动形式拆分官方在售车型。</span></div><aside>{regionCountries.map(item=><div key={item.name}><small>{item.code}</small><b>{String(item.countries.length).padStart(2,"0")}</b><span>{item.name}市场</span></div>)}</aside></section>
    <section className="pulse"><div><small>官方价格可见</small><b>{priced}</b><span>/ {cars.length} 条</span></div><div><small>已确认五星</small><b>{five}</b><span>条动力记录</span></div><div><small>本地在售品牌</small><b>{uniqueBrands}</b><span>个品牌</span></div><button onClick={()=>setShowSources(true)}>查看方法与来源 <span>↗</span></button></section>
    <section className="coverage coverageTop" id="coverage"><div className="coverageTitle"><p>MARKET COVERAGE</p><h2>{coverageRegion} · 集团覆盖密度</h2><span>按大区切换市场；数字表示该集团在当地官方目录可识别的车型动力记录数。点击单元格可直接筛选。</span><div className="coverageRegions" aria-label="覆盖密度大区选择">{regionCountries.map(item=><button className={coverageRegion===item.name?"active":""} onClick={()=>setCoverageRegion(item.name)} key={item.name}><small>{item.code}</small>{item.name}<b>{item.countries.length}</b></button>)}</div></div><div className="coverageTable"><div className="covRow head"><span>市场</span>{groups.map(x=><span key={x}>{groupLabels[x]}</span>)}</div>{coverage.map(r=><div className="covRow" key={r.name}><strong>{r.flag} {r.name}</strong>{groups.map(g=><button onClick={()=>{setRegion(regionOfCountry(r.name));setCountry(r.name);setGroup(g);setBrand("全部品牌");document.getElementById("lineup")?.scrollIntoView({behavior:"smooth"})}} key={g}><b>{String((r as Record<string,unknown>)[g])}</b></button>)}</div>)}</div></section>
    <section className="brandFootprint" aria-label="全市场单一品牌车型投放规模"><div className="brandFootprintHead"><p>BRAND MODEL FOOTPRINT</p><h2>全市场 · 单一品牌车型投放规模</h2><span>统计全部战略市场内各品牌投放的独立车型数，不随上方大区选择变化。相同车型的多个动力形式只计 1 款；不同市场名称指向同一实际车型时合并计数。</span></div><div className="brandFootprintGrid">{brandFootprint.map(item=><button key={`${item.group}-${item.brand}`} title={item.models.join(" · ")} onClick={()=>{setRegion("全部区域");setCountry("全部市场");setGroup(item.group);setBrand(item.brand);setEnergy("全部能源");setDrive("全部驱动");setSafe(false);setQuery("");setOverviewBrand(item.brand);setVisible(24);document.getElementById("lineup")?.scrollIntoView({behavior:"smooth"})}}><small>{groupLabels[item.group]} GROUP</small><b>{item.brand}</b><strong>{item.count}<em>款</em></strong><span>查看该品牌车型 →</span></button>)}</div><p className="brandFootprintNote">归一示例：Dolphin Mini / Dolphin Surf / Atto 1、Yuan Plus / Atto 3、Song Plus / Seal U / Sealion 6、Omoda 5 / E5、Dongfeng BOX / Nammi；西班牙 EBRO s400 / s700 / s800 / s900 分别计入 Chery 对应车型族。</p></section>
    <section className="filterPanel" id="lineup">
      <div className="search"><span>⌕</span><input value={query} onChange={e=>{setQuery(e.target.value);setVisible(24)}} placeholder="搜索品牌或车型…"/><kbd>{overviewActive?`${brandModelOverview.length} 款车型`:`${filtered.length} 条结果`}</kbd></div>
      <div className="filterRow regionRow"><span className="filterLabel">区域</span><div className="pills">{["全部区域",...regionCountries.map(x=>x.name)].map(x=><button className={region===x?"active":""} onClick={()=>{setRegion(x);setCountry("全部市场");setVisible(24)}} key={x}>{x.replace("全部区域","全部")}</button>)}</div></div>
      <div className="filterRow"><span className="filterLabel">市场</span><div className="pills"><button className={country==="全部市场"?"active":""} onClick={()=>setCountry("全部市场")}>全部</button>{countryOptions.map(([n,f])=><button className={country===n?"active":""} onClick={()=>{setCountry(n);setVisible(24)}} key={n}>{f} {n}</button>)}</div></div>
      <div className="filterRow"><span className="filterLabel">集团</span><div className="pills">{["全部集团",...groups].map(x=><button className={group===x?"active":""} onClick={()=>{setGroup(x);setBrand("全部品牌");setVisible(24)}} key={x}>{x.replace("全部集团","全部")}</button>)}</div></div>
      <div className="filterRow brandRow"><span className="filterLabel">子品牌</span><div className="pills"><button className={brand==="全部品牌"?"active":""} onClick={()=>{setBrand("全部品牌");setVisible(24)}}>全部</button>{brandOptions.map(x=><button className={brand===x?"active":""} onClick={()=>{setBrand(x);setVisible(24)}} key={x}>{x}</button>)}</div></div>
      <div className="filterRow"><span className="filterLabel">动力</span><div className="pills">{["全部能源","纯电","插混","增程","混动","燃油"].map(x=><button className={energy===x?"active":""} onClick={()=>{setEnergy(x);setVisible(24)}} key={x}>{x.replace("全部能源","全部")}</button>)}</div></div>
      <div className="filterRow compact"><span className="filterLabel">驱动</span><div className="pills">{["全部驱动","前驱","后驱","四驱"].map(x=><button className={drive===x?"active":""} onClick={()=>{setDrive(x);setVisible(24)}} key={x}>{x.replace("全部驱动","全部")}</button>)}</div><button className={`safetyOnly ${safe?"on":""}`} onClick={()=>setSafe(!safe)}><i/> 只看五星安全</button><button className="reset" onClick={reset}>重置筛选</button></div>
    </section>
    <section className="sectionHead"><div><p>{overviewActive?"GLOBAL BRAND LINE-UP":"MARKET LINE-UP"}</p><h2>{overviewActive?`全市场 · ${overviewBrand} 车型总览`:`${region==="全部区域"?"全部战略市场":region}${country!=="全部市场"?` · ${country}`:""}${group!=="全部集团"?` · ${group}`:""}${brand!=="全部品牌"?` · ${brand}`:""}`}</h2><span>{overviewActive?`${brandModelOverview.length} 款归一化车型 · 每款车型仅显示一次，并汇总动力、配置与投放市场`:`${filtered.length} 条车型动力 / 驱动记录 · 不同动力、驱动或配置组合独立呈现`}</span></div>{!overviewActive&&compare.length>0&&<button className="compareTop" onClick={()=>setShowCompare(true)}>对比清单 <b>{compare.length}</b> →</button>}</section>
    {overviewActive?<section className="brandOverviewGrid">{brandModelOverview.map(model=><article className="brandOverviewCard" key={model.key}><div className="brandOverviewHero"><img src={model.image} alt={`${overviewBrand} ${model.name} 官网车型图`} loading="lazy"/><div><small>{overviewBrand} · 全球车型族</small><h3>{model.name}</h3><p>{model.powers.length} 种动力 · {model.countries.length} 个国家</p></div></div><div className="brandOverviewBlock"><small>动力与主要配置</small>{model.powers.map(power=><div className="powerSummary" key={power.name}><b>{power.name}</b><div>{power.configs.map(config=><span key={config}>{config}</span>)}{power.total>power.configs.length&&<em>+{power.total-power.configs.length} 项</em>}</div></div>)}</div><div className="brandOverviewBlock marketSummary"><small>投放大区</small><div>{model.regions.map(name=><b key={name}>{name}</b>)}</div><small>投放国家</small><div>{model.countries.map(item=><span key={item.name}>{item.flag} {item.name}</span>)}</div></div>{model.aliases.length>0&&<div className="localAlias"><small>当地销售名</small>{model.aliases.map(alias=><b key={alias}>{alias}</b>)}</div>}</article>)}</section>:filtered.length?<section className="grid">{filtered.slice(0,visible).map(car=><article className="card" key={car.id} onClick={()=>setSelected(car)} tabIndex={0} onKeyDown={e=>e.key==="Enter"&&setSelected(car)}><div className="cardTop"><span>{car.flag} {car.country} · {car.brand}</span>{car.rating==="yes"?<b className="five">5★</b>:<b className="pending">待核</b>}</div><div className="carShape"><img src={car.image} alt={`${car.brand} ${car.model} 车型实拍或官方素材`} loading="lazy"/></div><p className="type">{car.group.toUpperCase()} · {energyKey(car.energy)} · {car.drive}</p><h3>{car.model} <mark>{car.variant}</mark></h3><div className="metrics"><span><small>能源形式</small>{car.energy}</span><span><small>驱动形式</small>{car.drive}</span><span><small>官方起售价</small>{car.price}<em>{cnyPrice(car.price)}</em></span></div><div className="cardActions"><button onClick={e=>{e.stopPropagation();setSelected(car)}}>参数与 {car.trims.length} 个配置 <span>→</span></button><button aria-label="加入对比" className={compare.includes(car.id)?"added":""} onClick={e=>{e.stopPropagation();toggleCompare(car.id)}}>{compare.includes(car.id)?"✓":"＋"}</button></div></article>)}</section>:<div className="empty"><b>该筛选组合暂无可核验记录</b><p>可减少筛选条件；官网未公开配置、价格或当地在售目录时，看板会保留空缺，不补写推测数据。</p><button onClick={reset}>清除全部筛选</button></div>}
    {!overviewActive&&visible<filtered.length&&<button className="loadMore" onClick={()=>setVisible(v=>v+24)}>继续加载 <b>{filtered.length-visible}</b> 条记录 ↓</button>}
    <footer><div className="wordmark"><span>DONGFENG</span> MARKET INTEL</div><p>东风集团主要战略市场竞品研究工具 · 价格不含上牌、保险及金融成本</p><button onClick={()=>setShowSources(true)}>数据口径与免责声明</button></footer>
    {selected&&<div className="overlay" onMouseDown={e=>e.target===e.currentTarget&&setSelected(null)}><section className="drawer"><button className="close" onClick={()=>setSelected(null)}>×</button><div className="detailHead"><p>{selected.flag} {selected.country} · {selected.group}</p><h2>{selected.brand} <em>{selected.model}</em> <mark>{selected.variant}</mark></h2><div><span className={selected.rating==="yes"?"safeYes":"safeUnknown"}>{selected.rating==="yes"?"★ 五星安全已确认":"○ 暂无有效五星记录"}</span><small>核验 {selected.verified}</small></div></div><div className="detailHero"><div className="detailShape"><img src={selected.image} alt={`${selected.brand} ${selected.model} 官网车型图`}/></div><div><small>{selected.variant} · {selected.drive} 官方起售价</small><strong>{selected.price}</strong>{cnyPrice(selected.price)&&<em className="cnyDetail">{cnyPrice(selected.price)}</em>}<a href={sources[selected.source]?.url} target="_blank" rel="noreferrer">查看官方来源 ↗</a></div></div><div className="specGrid"><div><small>长 × 宽 × 高</small><b>{selected.dims}</b></div><div><small>轴距</small><b>{selected.wheelbase}</b></div><div><small>能源形式</small><b>{selected.energy}</b></div><div><small>驱动形式</small><b>{selected.drive}</b></div><div><small>能耗</small><b>{selected.use}</b></div><div><small>续航</small><b>{selected.range}</b></div><div><small>碰撞安全</small><b>{selected.safety}</b></div></div><div className="trimBox"><div className="trimHead"><h3>{selected.variant} · {selected.drive} 配置明细</h3><span>{selected.trims.length} 个配置记录</span></div><div className="trim trimColumns"><span>配置</span><b>官方售价</b><span>电池容量</span><span>对应续航</span></div>{selected.trims.map((t,i)=>{const detail=trimEnergyDetail(selected,t);return <div className="trim" key={i}><span><i>{String(i+1).padStart(2,"0")}</i>{t.name}</span><b>{t.price}{cnyPrice(t.price)&&<em>{cnyPrice(t.price)}</em>}</b><span>{detail.battery}</span><span>{detail.range}</span></div>})}</div><button className={`drawerCompare ${compare.includes(selected.id)?"added":""}`} onClick={()=>toggleCompare(selected.id)}>{compare.includes(selected.id)?"已加入对比 ✓":"加入车型对比 ＋"}</button><p className="footnote">* 人民币价格按 2026-08-23 汇率快照估算；不同市场测试循环与配置可能不同，续航/能耗以当地官方最终销售资料为准。</p></section></div>}
    {showCompare&&<div className="overlay compareOverlay"><section className="compareSheet"><button className="close" onClick={()=>setShowCompare(false)}>×</button><p className="eyebrow">SIDE-BY-SIDE</p><h2>车型横向对比</h2>{compared.length?<div className="compareGrid"><div className="compareLabels"><b>车型 / 动力</b><span>市场</span><span>官方起售价</span><span>能源</span><span>驱动</span><span>尺寸</span><span>轴距</span><span>能耗</span><span>续航</span><span>安全</span></div>{compared.map(c=><div className="compareCol" key={c.id}><b>{c.brand}<br/><em>{c.model} · {c.variant}</em></b><span>{c.flag} {c.country}</span><span className="comparePrice">{c.price}<em>{cnyPrice(c.price)}</em></span><span>{c.energy}</span><span>{c.drive}</span><span>{c.dims}</span><span>{c.wheelbase}</span><span>{c.use}</span><span>{c.range}</span><span className={c.rating==="yes"?"green":""}>{c.safety}</span><button onClick={()=>toggleCompare(c.id)}>移出对比</button></div>)}</div>:<div className="empty">尚未选择车型</div>}</section></div>}
  {showSources&&<div className="overlay" onMouseDown={e=>e.target===e.currentTarget&&setShowSources(false)}><section className="sourceDrawer"><button className="close" onClick={()=>setShowSources(false)}>×</button><p className="eyebrow">DATA NOTES</p><h2>数据口径与来源</h2><div className="note"><b>本轮升级</b><p>研究范围扩展为 4 个区域、25 个国家和 9 个汽车集团；欧洲包含匈牙利，澳新仅含澳大利亚与新西兰。补充 Omoda 7、Omoda 9，并增加西班牙 EBRO 等当地销售名称与原车型家族的对应关系。</p></div><div className="note"><b>市场口径</b><p>优先采用当地品牌官网目录；当地站点不可读取时，使用品牌欧洲或区域官网确认车型范围，并将未见本地公开售价的配置标为“询价”。区域目录可证明官方产品范围，不代表每家门店均有现车。</p></div><div className="note"><b>价格口径</b><p>优先采用当地品牌官网公开售价或当月价格表；仅有起售价时保留“从”价；没有公开版本价时标为“询价”。促销、金融奖金和税费可能改变终端成交价。</p></div><div className="note"><b>汇率口径</b><p>人民币估算采用 2026-08-21 欧洲央行最新工作日参考汇率交叉换算，CLP 沿用 2026-08-23 快照，并按金额量级取整。页面仍显示原币价格，人民币仅用于横向比较。</p></div><div className="note"><b>安全口径</b><p>“五星”仅在 Euro NCAP、Latin NCAP 或 ANCAP 可对应到该车型/代际时确认。未找到有效结果会标为“待核”，不代表安全表现较差。</p></div><div className="note"><b>参数口径</b><p>尺寸按全球或当地销售版本整理。动力与驱动按当地公开配置拆分；同一车型存在不同能源、驱动或配置组合时会建立独立记录。配置表中的电池容量与续航按同一版本对应；官网未逐版本披露时明确标为“未公布”。续航与能耗保留测试循环差异，带 * 项目需结合当地配置表复核。</p></div><div className="note"><b>图片口径</b><p>车型图片优先采用品牌官网车型页、官网车型导航及官方媒体素材；官网未提供可用素材时使用开放媒体图库。同一车型的不同动力版本共享对应外观图，仅用于车型识别。</p></div><h3>主要公开来源</h3><div className="sourceList">{Object.entries(sources).map(([id,s])=><a href={s.url} target="_blank" rel="noreferrer" key={id}><span>{s.name}</span><b>↗</b></a>)}</div><div className="safetySources"><a href="https://www.latinncap.com" target="_blank" rel="noreferrer">Latin NCAP ↗</a><a href="https://www.euroncap.com" target="_blank" rel="noreferrer">Euro NCAP ↗</a><a href="https://www.ancap.com.au" target="_blank" rel="noreferrer">ANCAP ↗</a><a href="https://www.ecb.europa.eu/stats/policy_and_exchange_rates/euro_reference_exchange_rates/html/index.en.html" target="_blank" rel="noreferrer">ECB 汇率 ↗</a></div><p className="footnote">研究快照：2026-08-26。车型在售状态与价格变化频繁，采购决策前请再次向当地品牌方或经销商核验。</p></section></div>}
    {compare.length>0&&!showCompare&&<button className="floatingCompare" onClick={()=>setShowCompare(true)}>对比 {compare.length}/3 <span>↑</span></button>}
  </main>
}
