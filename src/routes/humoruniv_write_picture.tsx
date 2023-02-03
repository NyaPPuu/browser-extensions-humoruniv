import app, { safeNumber } from "../lib/common";
import initDrawing from "../lib/Drawing";
import { defaultOptions } from "../options";

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

main(() => {
	app.storage.sync.get(["write.picture.adjustx", "write.picture.adjusty", "write.picture.cursor", "write.picture.cursorDot", "write.picture.careful", "write.picture.colpickImmed"], function(options: { [key: string]: any }) {
		sauron(["form[name='new1']", "input[name=upload1]"], () => {
			const uploadInput = document.querySelector("input[name=upload1]") as HTMLInputElement;
			options = { ...defaultOptions, ...options };
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
						uploadInput.value = dataURL.split(",")[1];
					}
				}), uploadInput);
			}
		});
	});
});

