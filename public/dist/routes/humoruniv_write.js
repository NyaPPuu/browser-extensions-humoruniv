"use strict";
(() => {
  var __defProp = Object.defineProperty;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __publicField = (obj, key, value) => {
    __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
    return value;
  };

  // src/lib/common.ts
  var app = chrome;
  var DevHelper = class {
    constructor({ name, enable = true, prefixStyle } = {}) {
      __publicField(this, "name", "");
      __publicField(this, "enable", true);
      __publicField(this, "prefixStyle", "");
      if (name)
        this.name = name;
      this.enable = enable;
      if (prefixStyle)
        this.prefixStyle = prefixStyle;
    }
    prefix() {
      const datetime = DateHelper.format(new Date(), "Y-m-d H:i:s.v");
      const prefix = [];
      if (this.name) {
        if (this.prefixStyle)
          prefix.push(`${datetime} %c${this.name}`, this.prefixStyle);
        else
          prefix.push(`${datetime} ${this.name}`);
      }
      return prefix;
    }
    log(...args) {
      if (!this.enable)
        return;
      console.log(...this.prefix(), ...args);
    }
    warn(...args) {
      if (!this.enable)
        return;
      console.warn(...this.prefix(), ...args);
    }
    error(...args) {
      if (!this.enable)
        return;
      console.error(...this.prefix(), ...args);
    }
    info(...args) {
      if (!this.enable)
        return;
      console.info(...this.prefix(), ...args);
    }
  };
  var DEV = new DevHelper({ name: `${app.runtime.getManifest().name}`, prefixStyle: "background: #F58E86; color: white; font-size: 11px; padding: 1px 10px;", enable: true });
  var DateHelper = {
    format: function(d, pattern) {
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
            if (i == len - 1)
              break;
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
      "Saturday"
    ],
    weekKr: ["\uC77C", "\uC6D4", "\uD654", "\uC218", "\uBAA9", "\uAE08", "\uD1A0"],
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
      "December"
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
      "st"
    ],
    from24to12: function(hours) {
      return hours > 12 ? hours - 12 : hours;
    },
    ampm: function(hours) {
      return hours < 12 ? "am" : "pm";
    },
    isoDay: function(day) {
      return day == 0 ? 7 : day;
    },
    lastDayOfMonth: function(dateObj) {
      const tmp = new Date(dateObj.getFullYear(), dateObj.getMonth() + 1, 1);
      tmp.setTime(tmp.getTime() - 1);
      return tmp.getDate();
    },
    isLeapYear: function(year) {
      const tmp = new Date(year, 0, 1);
      let sum = 0;
      for (let i = 0; i < 12; i++) {
        tmp.setMonth(i);
        sum += this.lastDayOfMonth(tmp);
      }
      return sum == 365 ? "0" : "1";
    },
    dateCount: function(year, month, date) {
      const tmp = new Date(year, 0, 1);
      let sum = -1;
      for (let i = 0; i < month; i++) {
        tmp.setMonth(i);
        sum += this.lastDayOfMonth(tmp);
      }
      return sum + date;
    },
    distance: function(targetDate, currentDate = new Date()) {
      const distance = targetDate.getTime() - currentDate.getTime();
      const isFuture = targetDate.getTime() >= currentDate.getTime();
      const day = Math.abs(Math.floor(distance / (1e3 * 60 * 60 * 24)));
      const hours = Math.abs(
        Math.floor(distance % (1e3 * 60 * 60 * 24) / (1e3 * 60 * 60))
      );
      const minutes = Math.abs(
        Math.floor(distance % (1e3 * 60 * 60) / (1e3 * 60))
      );
      const seconds = Math.abs(Math.floor(distance % (1e3 * 60) / 1e3));
      return { isFuture, day, hours, minutes, seconds };
    },
    dday: function(targetDate, currentDate = new Date()) {
      targetDate.setHours(0, 0, 0, 0);
      currentDate.setHours(0, 0, 0, 0);
      const d = this.distance(targetDate, currentDate);
      return `D${d.isFuture ? "-" : "+"}${d.day == 0 ? "DAY" : d.day}`;
    }
  };

  // src/routes/humoruniv_write.tsx
  DEV.log("page", page);
  if (page.searchParams.get("table") != "picture") {
    DEV.log("\uC77C\uBC18 \uAE00\uC4F0\uAE30 \uBAA8\uB4DC");
  }
})();
