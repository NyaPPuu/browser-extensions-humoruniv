/* eslint-disable @typescript-eslint/no-unused-vars */

function sauron(selector: string | string[], callback: () => void) {
	let selector_list: string[] = [];

	if (typeof callback !== "function") callback = () => null;
	if (typeof selector === "string") selector_list = [selector];
	else if (Array.isArray(selector)) selector_list = selector;
	else return false;

	const list: { selector: string[]; callback: () => void }[] = [];
	list.push({
		selector: selector_list,
		callback: callback,
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
		subtree: true,
	});
}

function observe(
	node: Node | null,
	callback: () => void,
	options?: {
		childList: boolean;
		attributes: boolean;
		characterData: boolean;
		subtree: boolean;
	}
) {
	if (!node) return;
	const observer = new MutationObserver(() => {
		callback();
	});
	callback();
	if (typeof options === "undefined")
		options = {
			childList: true,
			attributes: false,
			characterData: false,
			subtree: true,
		};
	observer.observe(node, options);
}

function delegate(targetNode: Node | null, eventList: string, handler: (event: Event) => unknown, selector?: string): void {
	if (!targetNode) return;
	if (typeof selector === "undefined") {
		eventList.split(" ").forEach((eventName) => {
			targetNode.addEventListener(eventName, (event) => { handler.call(event.target, event); }, false);
		});
	} else {
		eventList.split(" ").forEach((event) => {
			targetNode.addEventListener(
				event,
				(event) => {
					let currentNode = event.target as HTMLElement;
					while (currentNode && currentNode !== targetNode) {
						if (currentNode.matches(selector)) {
							handler.call(currentNode, event);
						}
						if (currentNode.parentNode) currentNode = currentNode.parentNode as HTMLElement;
					}
				},
				false
			);
		});
	}
}

function docReady(callback: () => void) {

	function completed() {
		document.removeEventListener("DOMContentLoaded", completed, false);
		window.removeEventListener("load", completed, false);
		callback();
	}

	// Events.on(document, 'DOMContentLoaded', completed)

	if (document.readyState === "complete") {
		// Handle it asynchronously to allow scripts the opportunity to delay ready
		setTimeout(callback);

	} else {

		// Use the handy event callback
		document.addEventListener("DOMContentLoaded", completed, false);

		// A fallback to window.onload, that will always work
		window.addEventListener("load", completed, false);
	}
}

function injectScript(file: string, node: string) {
	const th = document.getElementsByTagName(node)[0];
	const s = document.createElement("script");
	s.setAttribute("type", "text/javascript");
	s.setAttribute("src", file);
	th.appendChild(s);
}

async function main(callback: () => void) {
	if (document.contentType.startsWith("text/") || document.contentType.startsWith("image/")) {
		callback();
	}
}



interface Page extends URL {
	hashParams?: URLSearchParams;
}
const page: Page = new URL(location.toString());
page.hashParams = new URLSearchParams(location.hash.substring(1));
