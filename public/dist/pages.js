"use strict";
function sauron(selector, callback) {
  let selector_list = [];
  if (typeof callback !== "function")
    callback = () => null;
  if (typeof selector === "string")
    selector_list = [selector];
  else if (Array.isArray(selector))
    selector_list = selector;
  else
    return false;
  const list = [];
  list.push({
    selector: selector_list,
    callback
  });
  const observer_function = () => {
    for (const o in list) {
      let cnt = 0;
      for (const s of list[o].selector) {
        if (document.querySelectorAll(s).length) {
          cnt++;
        }
      }
      if (cnt == list[o].selector.length) {
        list[o].callback();
        list.splice(Number(o), 1);
        break;
      }
    }
  };
  const observer = new MutationObserver(observer_function);
  observer_function();
  observer.observe(document, {
    childList: true,
    subtree: true
  });
}
function observe(node, callback, options) {
  if (!node)
    return;
  const observer = new MutationObserver(() => {
    callback();
  });
  callback();
  if (typeof options === "undefined")
    options = {
      childList: true,
      attributes: false,
      characterData: false,
      subtree: true
    };
  observer.observe(node, options);
}
function delegate(targetNode, eventList, handler, selector) {
  if (!targetNode)
    return;
  if (typeof selector === "undefined") {
    eventList.split(" ").forEach((eventName) => {
      targetNode.addEventListener(eventName, (event) => {
        handler.call(event.target, event);
      }, false);
    });
  } else {
    eventList.split(" ").forEach((event) => {
      targetNode.addEventListener(
        event,
        (event2) => {
          let currentNode = event2.target;
          while (currentNode && currentNode !== targetNode) {
            if (currentNode.matches(selector)) {
              handler.call(currentNode, event2);
            }
            if (currentNode.parentNode)
              currentNode = currentNode.parentNode;
          }
        },
        false
      );
    });
  }
}
function docReady(callback) {
  function completed() {
    document.removeEventListener("DOMContentLoaded", completed, false);
    window.removeEventListener("load", completed, false);
    callback();
  }
  if (document.readyState === "complete") {
    setTimeout(callback);
  } else {
    document.addEventListener("DOMContentLoaded", completed, false);
    window.addEventListener("load", completed, false);
  }
}
function injectScript(file, node) {
  const th = document.getElementsByTagName(node)[0];
  const s = document.createElement("script");
  s.setAttribute("type", "text/javascript");
  s.setAttribute("src", file);
  th.appendChild(s);
}
const page = new URL(location.toString());
page.hashParams = new URLSearchParams(location.hash.substring(1));
