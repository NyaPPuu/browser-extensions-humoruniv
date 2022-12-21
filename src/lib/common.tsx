
/*
크롬과 파이어폭스의 호환성을 위해 작업해둘 곳
const app: typeof chrome | typeof browser = (typeof browser == "undefined" && typeof chrome !== "undefined") ? chrome : browser;
*/

import { CacheProvider } from "@emotion/react";
import { CssBaseline, ThemeProvider } from "@mui/material";
import React from "react";
import ReactDOM from "react-dom/client";
import createCache from "@emotion/cache";
import { theme } from "./theme";

const app = chrome;
export default app;
// export default app;

// F58E86
class DevHelper {
	name = "";
	enable = true;
	prefixStyle = "";

	constructor({ name, enable = true, prefixStyle }: { name?: string, enable?: boolean, prefixStyle?: string } = {}) {
		if (name) this.name = name;
		this.enable = enable;
		if (prefixStyle) this.prefixStyle = prefixStyle;
	}

	prefix() {
		const datetime = DateHelper.format(new Date(), "Y-m-d H:i:s.v");
		const prefix: string[] = [];
		if (this.name) {
			if (this.prefixStyle) prefix.push(`${datetime} %c${this.name}`, this.prefixStyle);
			else prefix.push(`${datetime} ${this.name}`);
		}
		return prefix;
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	log(...args: any) {
		if (!this.enable) return;
		console.log(...this.prefix(), ...args);
	}
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	error(...args: any) {
		if (!this.enable) return;
		console.error(...this.prefix(), ...args);
	}
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	info(...args: any) {
		if (!this.enable) return;
		console.info(...this.prefix(), ...args);
	}
}
export const DEV = new DevHelper({ name: `${app.runtime.getManifest().name}`, prefixStyle: "background: #F58E86; color: white; font-size: 11px; padding: 1px 10px;", enable: process.env.NODE_ENV == "dev" });


export function isUrlAbsolute(url: string) {
	return url.indexOf("//") === 0 ? true : url.indexOf("://") === -1 ? false : url.indexOf(".") === -1 ? false : url.indexOf("/") === -1 ? false : url.indexOf(":") > url.indexOf("/") ? false : url.indexOf("://") < url.indexOf(".") ? true : false;
}

export const DateHelper = {
	/**
	 * format
	 * @param  {Date} target date object
	 *         {String} pattern
	 *  Y : A full numeric representation of a year, 4 digits
	 *  y : A two digit representation of a year
	 *  m : Numeric representation of a month, with leading zeros
	 *  n : Numeric representation of a month, without leading zeros
	 *  F : A full textual representation of a month, such as January or March
	 *  M : A short textual representation of a month, three letters
	 *  O : Japanese old month name
	 *  d : Day of the month, 2 digits with leading zeros
	 *  j : Day of the month without leading zeros
	 *  w : Numeric representation of the day of the week
	 *  l : A full textual representation of the day of the week
	 *  D : A textual representation of a day, three letters
	 *  N : ISO-8601 numeric representation of the day of the week
	 *  J : A Japanese textual representation of the day of the week
	 *  g : 12-hour format of an hour without leading zeros
	 *  G : 24-hour format of an hour without leading zeros
	 *  h : 12-hour format of an hour with leading zeros
	 *  H : 24-hour format of an hour with leading zeros
	 *  i : Minutes with leading zeros
	 *  s : Seconds, with leading zeros
	 *  a : Lowercase Ante meridiem and Post meridiem (am or pm)
	 *  A : Uppercase Ante meridiem and Post meridiem （AM or PM）
	 *  S : English ordinal suffix for the day of the month, 2 characters
	 *  z : The day of the year (starting from 0)
	 *  t : Number of days in the given month
	 *  L : Whether it's a leap year
	 *  v : Milliseconds
	 *  Escape character is #. Example: DateFormatter.format(new Date(), "#Y#m#d #i#s Ymd");
	 * @return {String} formatted date
	 */
	format: function(d: Date, pattern: string) {
		const dYear = d.getFullYear();
		const dMonth = d.getMonth();
		const dDate = d.getDate();
		const dDay = d.getDay();
		const dHours = d.getHours();
		const dMinutes = d.getMinutes();
		const dSeconds = d.getSeconds();
		const dMilliSeconds = d.getMilliseconds();
		let res = "";
		for (let i = 0, len = pattern.length; i < len; i++) {
			const c = pattern.charAt(i);
			switch (c) {
				case "#":
					if (i == len - 1) break;
					res += pattern.charAt(++i);
					break;
				case "Y":
					res += dYear;
					break;
				case "y":
					res += dYear.toString().substr(2, 2);
					break;
				case "m":
					res += (dMonth + 1).toString().padStart(2, "0");
					break;
				case "n":
					res += dMonth + 1;
					break;
				case "d":
					res += dDate.toString().padStart(2, "0");
					break;
				case "j":
					res += dDate;
					break;
				case "w":
					res += dDay;
					break;
				case "N":
					res += this.isoDay(dDay);
					break;
				case "l":
					res += this.weekFullEn[dDay];
					break;
				case "D":
					res += this.weekFullEn[dDay].substr(0, 3);
					break;
				case "J":
					res += this.weekKr[dDay];
					break;
				case "K":
					res += this.weekKr[dDay];
					break;
				case "F":
					res += this.monthFullEn[dMonth];
					break;
				case "M":
					res += this.monthFullEn[dMonth].substr(0, 3);
					break;
				case "a":
					res += this.ampm(dHours);
					break;
				case "A":
					res += this.ampm(dHours).toUpperCase();
					break;
				case "H":
					res += dHours.toString().padStart(2, "0");
					break;
				case "h":
					res += this.from24to12(dHours).toString().padStart(2, "0");
					break;
				case "g":
					res += this.from24to12(dHours);
					break;
				case "G":
					res += dHours;
					break;
				case "i":
					res += dMinutes.toString().padStart(2, "0");
					break;
				case "s":
					res += dSeconds.toString().padStart(2, "0");
					break;
				case "t":
					res += this.lastDayOfMonth(d);
					break;
				case "L":
					res += this.isLeapYear(dYear);
					break;
				case "z":
					res += this.dateCount(dYear, dMonth, dDate);
					break;
				case "S":
					res += this.dateSuffix[dDate - 1];
					break;
				case "v":
					res += dMilliSeconds;
					break;
				default:
					res += c;
					break;
			}
		}
		return res;
	},

	weekFullEn: [
		"Sunday",
		"Monday",
		"Tuesday",
		"Wednesday",
		"Thursday",
		"Friday",
		"Saturday",
	],

	weekKr: ["일", "월", "화", "수", "목", "금", "토"],

	monthFullEn: [
		"January",
		"February",
		"March",
		"April",
		"May",
		"June",
		"July",
		"August",
		"September",
		"October",
		"November",
		"December",
	],

	dateSuffix: [
		"st",
		"nd",
		"rd",
		"th",
		"th",
		"th",
		"th",
		"th",
		"th",
		"th",
		"th",
		"th",
		"th",
		"th",
		"th",
		"th",
		"th",
		"th",
		"th",
		"th",
		"st",
		"nd",
		"rd",
		"th",
		"th",
		"th",
		"th",
		"th",
		"th",
		"th",
		"st",
	],

	from24to12: function(hours: number) {
		return hours > 12 ? hours - 12 : hours;
	},

	ampm: function(hours: number) {
		return hours < 12 ? "am" : "pm";
	},

	isoDay: function(day: number) {
		return day == 0 ? 7 : day;
	},

	lastDayOfMonth: function(dateObj: Date) {
		const tmp = new Date(dateObj.getFullYear(), dateObj.getMonth() + 1, 1);
		tmp.setTime(tmp.getTime() - 1);
		return tmp.getDate();
	},

	isLeapYear: function(year: number) {
		const tmp = new Date(year, 0, 1);
		let sum = 0;
		for (let i = 0; i < 12; i++) {
			tmp.setMonth(i);
			sum += this.lastDayOfMonth(tmp);
		}
		return sum == 365 ? "0" : "1";
	},

	dateCount: function(year: number, month: number, date: number) {
		const tmp = new Date(year, 0, 1);
		let sum = -1;
		for (let i = 0; i < month; i++) {
			tmp.setMonth(i);
			sum += this.lastDayOfMonth(tmp);
		}
		return sum + date;
	},

	distance: function(targetDate: Date, currentDate = new Date()) {
		const distance = targetDate.getTime() - currentDate.getTime();

		// Math.floor 함수를 이용해서 근접한 정수값을 가져온다.
		// 밀리초 값이기 때문에 1000을 곱한다.
		// 1000*60 => 60초(1분)*60 => 60분(1시간)*24 = 24시간(하루)
		// 나머지 연산자(%)를 이용해서 시/분/초를 구한다.
		const isFuture = targetDate.getTime() >= currentDate.getTime();
		const day = Math.abs(Math.floor(distance / (1000 * 60 * 60 * 24)));
		const hours = Math.abs(
			Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
		);
		const minutes = Math.abs(
			Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
		);
		const seconds = Math.abs(Math.floor((distance % (1000 * 60)) / 1000));

		return { isFuture, day, hours, minutes, seconds };
	},
	dday: function(targetDate: Date, currentDate = new Date()) {
		targetDate.setHours(0, 0, 0, 0);
		currentDate.setHours(0, 0, 0, 0);
		const d = this.distance(targetDate, currentDate);
		return `D${d.isFuture ? "-" : "+"}${d.day == 0 ? "DAY" : d.day}`;
	}
};

export function URLBaseName(url: string): string {
	// return url.split(/[\\/]/).pop();
	url = url.substring(0, (url.indexOf("#") == -1) ? url.length : url.indexOf("#"));
	// this removes the query after the file name, if there is one
	url = url.substring(0, (url.indexOf("?") == -1) ? url.length : url.indexOf("?"));
	// this removes everything before the last slash in the url
	url = url.substring(url.lastIndexOf("/") + 1, url.length);
	return url;
}
// 파일명 + 확장자명으로 나눔
export function splitFilename(fileName: string): string[] {
	const p = fileName.match(/(.*?)(?:\.([^.]+))?$/);
	return [p?.[1] || "", p?.[2] || ""];
}
// 파일명에 사용하지 못하는 특수문자 제거
export function clearFilename(fileName: string): string {
	return fileName.replace(/[\\:*?"<>|~/]/g, "");
}
// 파일 경로에 사용하지 못하는 특수문자 제거
export function clearPath(path: string): string {
	return path.replace(/[:*?"<>|~]/g, "");
}
export function readFileAsync(file: Blob) {
	return new Promise<string>((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = () => {
			resolve(reader.result as string);
		};
		reader.onerror = reject;
		reader.readAsDataURL(file);
	});
}
export function getDomain(url: string): string {
	return new URL(url).hostname.split(".").slice(-2).join(".");
}
export function matchRule(str: string, rule: string): boolean {
	return new RegExp("^" + rule.split("*").join(".*") + "$").test(str);
}
export function pathBaseName(path: string): string {
	return path.split(/[\\/]/).pop() || path;
}


export function renderShadow(root: Element | DocumentFragment, children: React.ReactNode) {

	const cacheRoot = createCache({
		key: "css",
		prepend: true,
		container: root,
		// speedy: false,
	});

	const reactRoot = ReactDOM.createRoot(root);
	reactRoot.render(
		<React.StrictMode>
			<CacheProvider value={cacheRoot}>
				<CssBaseline />
				{ children }
			</CacheProvider>
		</React.StrictMode>
	);
}

// export function render(children: React.ReactNode, cache: EmotionCache) {
// 	const wrapper = document.createElement("span");
// 	const reactRoot = ReactDOM.createRoot(wrapper);

// 	reactRoot.render(
// 		<React.StrictMode>
// 			<CacheProvider value={cache}>
// 				<ThemeProvider theme={theme}>
// 					{ children }
// 				</ThemeProvider>
// 			</CacheProvider>
// 		</React.StrictMode>
// 	);
// 	return wrapper;
// }

export function render(children: React.ReactNode) {
	if (!window.styleCache) {
		window.styleCache = createCache({
			key: "css",
			prepend: true,
		});
	}
	const wrapper = document.createElement("span");
	const reactRoot = ReactDOM.createRoot(wrapper);

	reactRoot.render(
		<React.StrictMode>
			<CacheProvider value={window.styleCache}>
				<ThemeProvider theme={theme}>
					{ children }
				</ThemeProvider>
			</CacheProvider>
		</React.StrictMode>
	);
	return wrapper;
}
