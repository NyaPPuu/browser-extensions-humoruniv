import app, { safeNumber } from "../lib/common";
import initDrawing from "../lib/Drawing";



function getAllSiblings(elem: Element) {
	const result = [];
	let node: Element | null = elem.parentNode?.firstChild as Element;

	while (node) {
		if (node !== elem && node.nodeType === Node.ELEMENT_NODE)
			result.push(node);
		node = (node.nextElementSibling || node.nextSibling) as Element;
	}
	return result;
}

// @ts-nocheck
// eslint-disable-next-line @typescript-eslint/no-explicit-any
app.storage.sync.get(["write.picture.useOld", "write.picture.adjustx", "write.picture.adjusty", "write.picture.cursor", "write.picture.cursorDot", "write.picture.careful", "write.picture.colpickImmed"], function(options: { [key: string]: any }) {
	sauron(["form[name='new1']", "input[name=upload1]"], () => {
		if (options["write.picture.useOld"]) {
			const uploadInput = document.querySelector("input[name=upload1]");
			if (uploadInput) {
				getAllSiblings(uploadInput).map((element) => element.remove());
				const humanagerPicture = document.createElement("div");
				humanagerPicture.classList.add("humanagerPicture");
				uploadInput.parentElement?.append(humanagerPicture);

				// const head = document.getElementsByTagName("head")[0];
				// const link = document.createElement("link");
				// link.setAttribute("rel", "stylesheet");
				// link.setAttribute("type", "text/css");
				// link.setAttribute("href", app.runtime.getURL("dist/plugins/kdrawing.css"));
				// head.appendChild(link);

				options = {
					"write.picture": true,
					"write.picture.cursor": true,
					"write.picture.cursorDot": true,
					"write.picture.careful": false,
					"write.picture.colpickImmed": false,
					"write.picture.adjustx": 0,
					"write.picture.adjusty": 0,
					...options
				};

				jQuery(".humanagerPicture").kdrawing({
					adjust: {
						x: Number(options["write.picture.adjustx"]),
						y: Number(options["write.picture.adjusty"])
					},
					width: 413,
					height: 257,
					customCursor: options["write.picture.cursor"],
					customCursorDot: options["write.picture.cursorDot"],
					carefulAction: options["write.picture.careful"],
					colorpickerImmediately: options["write.picture.colpickImmed"],
					onChange: function(url, data) {
						$("[name='upload1']").val(url.split(",")[1]);
						options["write.picture.adjustx"] = data.adjust.x;
						options["write.picture.adjusty"] = data.adjust.y;
					},
					onSave: function(url, data) {
						this.kdrawingFadeAlert("저장 중...", false);
						$(window).on("beforeunload", function() {
							return "작업 내용이 저장 중입니다.\n그래도 페이지를 벗어나시겠습니까?";
						});
						const optionData = {
							color: data.color,
							colors: data.colors,
							width: data.width,
							height: data.height,
							history: data.history,
							tool: data.tool,
							tool_id: data.tool_id
						};
						app.storage.local.set({ "write.picture": { "url": url, "data": optionData } }, () => {
							this.kdrawingFadeAlert("저장 완료.");
							$(window).off("beforeunload");
						});
					},
					onLoad: function(callback) {
					/*
					humanager.get_local(["write.picture"], function() { callback(humanager.storage.local["write.picture"]); });
					*/
						app.storage.local.get(["write.picture"], (options: { [key: string]: any }) => {
							callback(options["write.picture"]);
						});
					}
				});
			}
		} else {
			const uploadInput = document.querySelector("input[name=upload1]") as HTMLInputElement;
			if (uploadInput) {
				getAllSiblings(uploadInput).map((element) => element.remove());

				uploadInput.parentElement?.append(initDrawing({
					options: {
						toolCursor: options["write.picture.cursor"],
						crossCursor: options["write.picture.cursorDot"],
						adjustX: safeNumber(options["write.picture.adjustx"], 0),
						adjustY: safeNumber(options["write.picture.adjusty"], 0),
					},
					onChange: (dataURL) => {
						uploadInput.value = dataURL;
					}
				}), uploadInput);

			}
		}
	});
});
