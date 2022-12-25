import { Box, Button, ButtonGroup, Checkbox, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, IconButton, Input, InputProps, Paper, Slider, Stack, styled, TextField, ToggleButton, ToggleButtonGroup, ToggleButtonProps, Tooltip, TooltipProps, Typography } from "@mui/material";
import React, { useContext, VFC } from "react";
import { DEV, matchRule, render } from "../lib/common";
import Color from "color";
import { DndContext, DragEndEvent, useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import DragHandleIcon from "@mui/icons-material/DragHandle";
import AddIcon from "@mui/icons-material/Add";

/* 함수 */
function distanceBetween(x1: number, y1: number, x2: number, y2: number) {
	return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}
function angleBetween(x1: number, y1: number, x2: number, y2: number) {
	return Math.atan2(x2 - x1, y2 - y1);
}
function drawLine(x1: number, y1: number, x2: number, y2: number, drawFunction: (x: number, y: number) => void) {
	let tmp;
	const steep = Math.abs(y2-y1) > Math.abs(x2-x1);
	if (steep) {
		// swap x1,y1
		tmp=x1; x1=y1; y1=tmp;

		// swap x2,y2
		tmp=x2; x2=y2; y2=tmp;
	}

	let sign = 1;
	if (x1>x2) {
		sign = -1;
		x1 *= -1;
		x2 *= -1;
	}
	const dx = x2-x1;
	const dy = Math.abs(y2-y1);
	let err = ((dx/2));
	const yStep = y1 < y2 ? 1:-1;
	let y = y1;

	for (let x=x1;x<=x2;x++) {
		if (steep) drawFunction(y, sign * x);
		else drawFunction(sign * x, y);

		err = (err - dy);
		if (err < 0) {
			y+=yStep;
			err+=dx;
		}
	}
}
function plotCircle(xm: number, ym: number, r: number, imageData: ImageData, size: number, color: { [key: string]: number; }) {
	let x = -r;
	let y = 0;
	let err = 2 - 2 * r; /* bottom left to top right */

	do {
		/*   I. Quadrant +x +y */
		const i = xm - ((x + 1) * 4) + (ym + ((y - 1) * (size * 4)));
		imageData.data[i + 0] = color.r;
		imageData.data[i + 1] = color.g;
		imageData.data[i + 2] = color.b;
		imageData.data[i + 3] = 255;
		/*  II. Quadrant -x +y */
		const ii = xm - (y * (size * 4)) + (ym - ((x + 1) * 4));
		imageData.data[ii + 0] = color.r;
		imageData.data[ii + 1] = color.g;
		imageData.data[ii + 2] = color.b;
		imageData.data[ii + 3] = 255;
		/* III. Quadrant -x -y */
		const iii = (xm + (x * 4)) + (ym - (y * (size * 4)));
		imageData.data[iii + 0] = color.r;
		imageData.data[iii + 1] = color.g;
		imageData.data[iii + 2] = color.b;
		imageData.data[iii + 3] = 255;
		/*  IV. Quadrant +x -y */
		const iv = (xm + ((y - 1) * (size * 4))) + (ym + (x * 4));
		imageData.data[iv + 0] = color.r;
		imageData.data[iv + 1] = color.g;
		imageData.data[iv + 2] = color.b;
		imageData.data[iv + 3] = 255;
		r = err;
		if (r <= y) {
			err += ++y * 2 + 1; /* y step */
		}
		if (r > x || err > y) {
			err += ++x * 2 + 1; /* x step */
		}
	} while (x < 0);
}
function fillCircle(imageData: ImageData, color: { [key: string]: number; }) {
	const cols = imageData.width * 4;
	for (let row = 1; row < imageData.height - 1; row += 1) {
		let isHitColor = false;
		let isHitClear = false;
		let isEnded = false;
		for (let col = 0; col < cols; col += 4) {
			const index = cols * row + col;
			const alpha = imageData.data[index + 3];
			const isColor = alpha === 255;
			const isClear = alpha === 0;
			if (isColor && !isHitColor) {
				isHitColor = true;
			} else if (isClear && isHitColor) {
				isHitClear = true;
			} else if (isColor && isHitColor && isHitClear) {
				isEnded = true;
			}
			if (isHitColor && isHitClear && !isEnded) {
				imageData.data[index] = color.r;
				imageData.data[index + 1] = color.g;
				imageData.data[index + 2] = color.b;
				imageData.data[index + 3] = 255;
			}
		}
	}
}
const getPixelColorFromImageData = (imageData: ImageData, xPosition: number, yPosition: number, width: number): number[] => {
	const position = (xPosition + yPosition * width) * 4;
	return [imageData.data[position + 0], imageData.data[position + 1], imageData.data[position + 2]];
};
const setPixelColorToImageData = (imageData: ImageData, xPosition: number, yPosition: number, rgb: number[], width: number) => {
	const position = (xPosition + yPosition * width) * 4;
	imageData.data[position + 0] = rgb[0];
	imageData.data[position + 1] = rgb[1];
	imageData.data[position + 2] = rgb[2];
	imageData.data[position + 3] = rgb[3] || 255;
	return true;
};
const isSameColor = (firstColor?: number[], secondColor?: number[]) => {
	if (!firstColor || !secondColor) return false;
	if (firstColor[0] == secondColor[0] && firstColor[1] == secondColor[1] && firstColor[2] == secondColor[2]) return true;
	return false;
};

const makeStamp = (toolSize: number, colorString: string) => {
	const canvas = document.createElement("canvas");
	const size = toolSize + (toolSize % 2);
	canvas.width = size;
	canvas.height = size;
	const context = canvas.getContext("2d");
	const color = Color(colorString).object();

	if (context === null) {
		console.error("스탬프 생성 중 오류가 발생했습니다.");
		throw new Error("스탬프 생성 중 오류가 발생했습니다.");
	}

	const imageData = context.createImageData(size, size);
	for (let i = 0; i < imageData.data.length; i += 4) {
		imageData.data[i] = 255;
		imageData.data[i + 1] = 255;
		imageData.data[i + 2] = 255;
		imageData.data[i + 3] = 0;
	}
	plotCircle(size * 2, (size * 4) * (size / 2), size / 2, imageData, size, color);
	fillCircle(imageData, color);
	context.putImageData(imageData, 0, 0);
	return canvas;
};

/* 컴포넌트 */
type TooltipToggleButtonProps = ToggleButtonProps & {
	TooltipProps: Omit<TooltipProps, "children">;
};
const TooltipToggleButton: VFC<TooltipToggleButtonProps> = React.forwardRef(
	({ TooltipProps, ...props }, ref) => {
		return (
			<Tooltip {...TooltipProps}>
				<ToggleButton ref={ref} {...props} />
			</Tooltip>
		);
	}
);
const ColorPicker = React.memo(function ColorPicker({ value, ...props }: InputProps & { value?: string; }) {
	const [color, setColor] = React.useState<string>("#000000");

	const handleChangeColor = (event: React.ChangeEvent<HTMLInputElement>) => {
		setColor(event.target.value);
	};

	React.useEffect(() => {
		if (value) setColor(value);
	}, [value]);

	return (
		<Input disableUnderline {...props} type="color" value={color} onChange={handleChangeColor} />
	);
});

type ToolSize = { [key: string]: number; }
type Tool = { id: string; color: string; size: ToolSize; }
type PreviousTool = { id: string | null; position?: Position; imageData?: ImageData
; }
type History = { undo: string[]; redo: string[]; };
type Position = { x: number; y: number; }

export default function Drawing() {

	const stamp = React.useRef<{ [key: string]: HTMLCanvasElement; }>({});
	const previousTool = React.useRef<PreviousTool>({
		id: null
	});
	const pointer = React.useRef<{
		lastX: null | number;
		lastY: null | number;
		isDown: boolean;
		isEnter: boolean;
		pageX: null | number;
		pageY: null | number;
	}>({
		lastX: null,
		lastY: null,
		isDown: false,
		isEnter: false,
		pageX: null,
		pageY: null,
	});
	const [tool, setTool] = React.useState<Tool>({
		id: "pencil",
		color: "#000000",
		size: {
			"pencil": 2,
			"eraser": 5,
			"line": 1,
		}
	});
	const [history, setHistory] = React.useState<History>({
		undo: [],
		redo: [],
	});
	const [palette, setPalette] = React.useState<string[]>([
		"#000",
		"#FFF",
		"#F00",
		"#0F0",
		"#00F",
		"#FF0",
		"#0FF",
		"#F0F",
	]);
	const [position, setPosition] = React.useState<{ [id: string]: Position; }>({});
	const canvasRef = React.useRef<HTMLCanvasElement>(null);
	const canvasContextRef = React.useRef<CanvasRenderingContext2D | null>(null);
	const toolBoxRef = React.useRef<HTMLDivElement>(null);

	const handleDragEnd = (event: DragEndEvent) => {
		// DEV.log("handleDragEnd", event);
		setPosition((data) => {
			return {
				...position,
				[event.active.id]: {
					x: (data[event.active.id]?.x || 0) + event.delta.x,
					y: (data[event.active.id]?.y || 0) + event.delta.y,
				}
			};
		});
	};

	const getEventPosition = (event: MouseEvent | TouchEvent) => {
		if (event.target === canvasRef.current && "offsetX" in event && "offsetY" in event) {
			return { x: event.offsetX, y: event.offsetY };
		}
		if ("pageX" in event && "pageY" in event && canvasRef.current) {
			const targetBoundingClientRect = (canvasRef.current as HTMLElement).getBoundingClientRect();
			return { x: event.pageX - targetBoundingClientRect.x - window.scrollX, y: event.pageY - targetBoundingClientRect.y - window.scrollY };
		}
		if ("targetTouches" in event && "target" in event && event.target) {
			const targetBoundingClientRect = (event.target as HTMLElement).getBoundingClientRect();
			const x = event.targetTouches[0].clientX - targetBoundingClientRect.x;
			const y = event.targetTouches[0].clientY - targetBoundingClientRect.y;
			return { x, y };
		}
		return { x: 0, y: 0 };
	};

	const handlePointerDown = (ReactEvent: React.MouseEvent | React.TouchEvent) => {
		const event = ReactEvent.nativeEvent;
		pointer.current.isDown = true;
		const eventPosition = ("targetTouches" in event ? event.targetTouches[0] : event);
		pointer.current.pageX = eventPosition.pageX;
		pointer.current.pageY = eventPosition.pageY;
		const { x, y } = getEventPosition(event);
		DEV.log("handlePointerDown", x, y, ReactEvent);
		if ("button" in event && event.button == 2) {
			previousTool.current.id = tool.id;
			setTool({ ...tool, id: "eraser" });
			doAction("eraser", x, y, event.type);
		} else doAction(tool.id, x, y, event.type);
	};
	const handlePointerUp = (event: MouseEvent | TouchEvent) => {
		pointer.current.isDown = false;
		const eventPosition = ("targetTouches" in event ? event.targetTouches[0] : event);
		pointer.current.pageX = eventPosition.pageX;
		pointer.current.pageY = eventPosition.pageY;
		if (previousTool.current.id) {
			setTool({ ...tool, id: previousTool.current.id });
			previousTool.current.id = null;
		}
	};
	const handlePointerMove = (event: MouseEvent | TouchEvent) => {
		const eventPosition = ("targetTouches" in event ? event.targetTouches[0] : event);
		pointer.current.pageX = eventPosition.pageX;
		pointer.current.pageY = eventPosition.pageY;
		const { x, y } = getEventPosition(event);
		if (pointer.current.isDown) {
			doAction(tool.id, x, y, event.type);
		}
		pointer.current.lastX = x;
		pointer.current.lastY = y;
	};
	const handleContextmenu = (event: React.MouseEvent<HTMLDivElement>) => {
		event.stopPropagation();
		event.preventDefault();
		return false;
	};
	const handleKeydown = (event: KeyboardEvent) => {
		DEV.log("handleKeydown", event, document.querySelector(":focus")?.matches("input, textarea"));
		if (document.querySelector(":focus")?.matches("input, textarea")) return;
		if (event.code == "Equal") { // +
			setTool({ ...tool, size: { ...tool.size, [tool.id]: (tool.size[tool.id] || 1) + 1 } });
		} else if (event.code == "Minus") { // -
			if (tool.size[tool.id] > 1) setTool({ ...tool, size: { ...tool.size, [tool.id]: tool.size[tool.id] - 1 } });
		} else if (event.code == "KeyT") { // t
			if (pointer.current.pageX != null && pointer.current.pageY != null) {
				setPosition({
					...position,
					toolBox: { x: pointer.current.pageX - (toolBoxRef.current?.offsetWidth ? toolBoxRef.current?.offsetWidth / 2 : 0), y: pointer.current.pageY - (toolBoxRef.current?.offsetHeight ? toolBoxRef.current?.offsetHeight / 2 : 0) }
				});
			}
		} else if (event.code == "KeyZ" && event.ctrlKey) { // Ctrl Z
			loadHistory("undo");
		} else if (event.code == "KeyY" && event.ctrlKey) { // Ctrl Y
			loadHistory("redo");
		}
	};

	const getStamp = (size: number, colorHEX: string) => {
		const stampID = size+"_"+colorHEX;
		// console.log("stamp", stampID);
		if (!stamp.current[stampID]) stamp.current[stampID] = makeStamp(size, colorHEX);
		return stamp.current[stampID];
	};
	const brush = (stamp: HTMLCanvasElement, xPosition: number, yPosition: number, size: number, lastX?: number, lastY?: number) => {
		if (!canvasContextRef.current) return;
		const halfSize = (size - (size % 2)) / 2;
		if ((typeof lastX === "undefined" || typeof lastY === "undefined") || xPosition === lastX && yPosition === lastY) {
			const x = xPosition - halfSize;
			const y = yPosition - halfSize;
			canvasContextRef.current.drawImage(stamp, Math.round(x), Math.round(y), size, size);
			return;
		}
		drawLine(xPosition, yPosition, lastX, lastY, (x, y) => {
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			canvasContextRef.current!.drawImage(stamp, Math.round(x - halfSize), Math.round(y - halfSize), size, size);
		});
		/*
		const dist = distanceBetween(xPosition, yPosition, lastX, lastY);
		const angle = angleBetween(xPosition, yPosition, lastX, lastY);
		const path = [];
		for (let i = 0; i < dist; i += 1) {
			const x = xPosition + (Math.sin(angle) * i) - halfSize;
			const y = yPosition + (Math.cos(angle) * i) - halfSize;
			path.push([Math.round(x), Math.round(y)]);
			canvasContextRef.current.drawImage(stamp, Math.round(x), Math.round(y), size, size);
		}
		console.log(path);
		*/
	};

	const doAction = (toolID: string, xPosition: number, yPosition: number, eventType?: string) => {
		if (!canvasRef.current || !canvasContextRef.current) return;
		// DEV.log("doAction", tool, xPosition, yPosition, eventType);

		if (toolID == "pencil" || toolID == "eraser") {
			if (eventType == "pointerdown") saveHistory();

			const lastX = eventType != "pointerdown" && pointer.current.lastX != null ? pointer.current.lastX : xPosition;
			const lastY = eventType != "pointerdown" && pointer.current.lastY != null ? pointer.current.lastY : yPosition;
			pointer.current.lastX = xPosition;
			pointer.current.lastY = yPosition;

			const size = tool.size[toolID] || 1;
			const stamp = getStamp(size, toolID == "eraser" ? "#FFFFFF" : Color(tool.color).hex());
			brush(stamp, xPosition, yPosition, size, lastX, lastY);
		} else if (toolID == "paint") {
			if (eventType != "pointerdown" && eventType != "pointermove") return;
			xPosition = Math.round(xPosition);
			yPosition = Math.round(yPosition);
			const imageData = canvasContextRef.current.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height);
			console.log("imageData", imageData);
			const toolColor = Color(tool.color).rgb().array();
			console.log("toolColor", toolColor);
			const startColor = getPixelColorFromImageData(imageData, xPosition, yPosition, canvasRef.current.width);
			console.log("getPixelColorFromImageData", getPixelColorFromImageData);
			if (isSameColor(startColor, toolColor)) return;
			const queue = [[xPosition, yPosition]];
			while (queue.length) {
				const pos = queue.pop();
				if (!pos) break;
				const x = pos[0];
				let y = pos[1];
				while (y >= 0 && isSameColor(startColor, getPixelColorFromImageData(imageData, x, y, canvasRef.current.width))) {
					y--;
				}
				++y;
				let reachLeft = false;
				let reachRight = false;
				while (y < canvasRef.current.height && isSameColor(startColor, getPixelColorFromImageData(imageData, x, y, canvasRef.current.width))) {
					setPixelColorToImageData(imageData, x, y, toolColor, canvasRef.current.width);
					if (x > 0) {
						if (isSameColor(startColor, getPixelColorFromImageData(imageData, x - 1, y, canvasRef.current.width))) {
							if (!reachLeft) {
								queue.push([x - 1, y]);
								reachLeft = true;
							} else {
								reachLeft = false;
							}
						}
					}
					if (x < canvasRef.current.width - 1) {
						if (isSameColor(startColor, getPixelColorFromImageData(imageData, x + 1, y, canvasRef.current.width))) {
							if (!reachRight) {
								queue.push([x + 1, y]);
								reachRight = true;
							} else {
								reachRight = false;
							}
						}
					}
					y++;
				}
			}
			saveHistory();
			// Draw the current state of the color layer to the canvas
			canvasContextRef.current.putImageData(imageData, 0, 0);
		} else if (toolID == "dropper") {
			if (eventType != "pointerdown" && eventType != "pointermove") return;
			const imageData = canvasContextRef.current.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height);
			const getColor = getPixelColorFromImageData(imageData, xPosition, yPosition, canvasRef.current.width);
			setTool({ ...tool, color: Color(getColor).hex() });
		} else if (toolID == "line") {
			// if (eventType != "pointerdown" && eventType != "pointermove") return;
			if (eventType == "pointerdown") {
				saveHistory();
				previousTool.current.id = "line";
				previousTool.current.position = { x: xPosition, y: yPosition };
				previousTool.current.imageData = canvasContextRef.current.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height);
				DEV.log("start line", xPosition, yPosition, previousTool.current.position.x, previousTool.current.position.y);
			} else if (eventType == "pointermove" && previousTool.current.id == "line" && previousTool.current.position && previousTool.current.imageData) {
				canvasContextRef.current.putImageData(previousTool.current.imageData, 0, 0);
				const size = tool.size[toolID] || 1;
				const stamp = getStamp(size, Color(tool.color).hex());
				brush(stamp, xPosition, yPosition, size, previousTool.current.position.x, previousTool.current.position.y);
				DEV.log("Draw Line", xPosition, yPosition, previousTool.current.position.x, previousTool.current.position.y, size);
			}
		}
	};
	const resetHistory = () => {
		setHistory({
			undo: [],
			redo: [],
		});
	};
	const saveHistory = () => {
		if (!canvasRef.current) return;
		setHistory({
			undo: [...history.undo, canvasRef.current.toDataURL()].slice(-100),
			redo: [],
		});
	};
	const loadHistory = (type: "redo" | "undo" = "undo") => {
		// DEV.log("loadHistory", type, canvasRef.current, canvasContextRef.current, history);
		if (!canvasRef.current || !canvasContextRef.current) return;
		const otherType = type == "undo" ? "redo" : "undo";
		const currentHistory = { ...history };
		const nowData = currentHistory[type].pop();
		if (!nowData) return;
		const image = new Image();
		image.src = nowData;
		currentHistory[otherType].push(canvasRef.current.toDataURL());
		previousTool.current.id = null;
		previousTool.current.position = undefined;
		previousTool.current.imageData = undefined;
		setHistory({
			...currentHistory
		});
		image.onload = function() {
			canvasContextRef.current?.drawImage(image, 0, 0);
		};
	};

	React.useEffect(() => {
		if (canvasRef.current) {
			const ctx = canvasRef.current.getContext("2d", { willReadFrequently: true });
			if (ctx) {
				ctx.fillStyle = "#FFF";
				ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
				canvasContextRef.current = ctx;
			}
		}
	}, []);

	React.useEffect(() => {
		window.addEventListener("pointerup", handlePointerUp);
		window.addEventListener("pointermove", handlePointerMove);
		window.addEventListener("keydown", handleKeydown);
		// canvasRef.current?.addEventListener("pointerenter", handlePointerEnter);
		// canvasRef.current?.addEventListener("pointerleave", handlePointerLeave);

		return () => {
			window.removeEventListener("pointerup", handlePointerUp);
			window.removeEventListener("pointermove", handlePointerMove);
			window.removeEventListener("keydown", handleKeydown);
			// canvasRef.current?.removeEventListener("pointerenter", handlePointerEnter);
			// canvasRef.current?.removeEventListener("pointerleave", handlePointerLeave);
		};
	}, [tool.id, tool.size, tool.color, history, position]);

	return (
		<DndContext onDragEnd={handleDragEnd}>
			<Box onContextMenu={handleContextmenu}>
				<style scoped>
					{`
				a, abbr, acronym, address, applet, article, aside, audio, b, big, blockquote, body, canvas, caption, center, cite, code, dd, del, details, dfn, div, dl, dt, em, embed, fieldset, figcaption, figure, footer, form, h1, h2, h3, h4, h5, h6, header, hgroup, html, i, iframe, img, ins, kbd, label, legend, li, mark, menu, nav, object, ol, output, p, pre, q, ruby, s, samp, section, small, span, strike, strong, sub, summary, sup, table, tbody, td, tfoot, th, thead, time, tr, tt, u, ul, var, video {border:0;font-size:100%;font:inherit;margin:0;padding:0;vertical-align:baseline}
				article, aside, details, figcaption, figure, footer, header, hgroup, menu, nav, section {display:block}
				body {line-height:1}
				ol, ul {list-style:none}
				blockquote, q {quotes:none}
				blockquote:after, blockquote:before, q:after, q:before {content:"";content:none}
				table {border-collapse:collapse;border-spacing:0}
				`}
				</style>
				<div
					style={{
						position: "relative",
						display: "inline-block",
					}}
				>
					<canvas
						ref={canvasRef}
						style={{ border: "1px solid gray" }}
						width={413}
						height={257}
						onPointerDown={handlePointerDown}
					></canvas>
				</div>
				<DrawingToolBox ref={toolBoxRef} canvasRef={canvasRef} canvasContextRef={canvasContextRef} position={position.toolBox} tool={tool} setTool={setTool} history={history} loadHistory={loadHistory} resetHistory={resetHistory} palette={palette} setPalette={setPalette} />
				<DrawingPalette palette={palette} setPalette={setPalette} tool={tool} setTool={setTool} position={position.palette} />
			</Box>
		</DndContext>
	);
}

const DrawingToolBox_ = React.forwardRef(function DrawingToolBox({ canvasRef, canvasContextRef, position, tool, setTool, history, loadHistory, resetHistory, palette, setPalette }: { canvasRef: React.RefObject<HTMLCanvasElement>, canvasContextRef: React.MutableRefObject<CanvasRenderingContext2D | null>, position: Position, tool: Tool, setTool: React.Dispatch<React.SetStateAction<Tool>>, history: History, loadHistory: (type: "redo" | "undo") => void, resetHistory: () => void, palette: string[]; setPalette: React.Dispatch<React.SetStateAction<string[]>> }, ref: React.ForwardedRef<HTMLDivElement>) {

	const { attributes: toolBoxDragAttributes, listeners: toolBoxDragListeners, transform: toolBoxDragTransform, isDragging: toolBoxIsDragging } = useDraggable({
		id: "toolBox"
	});

	// DEV.info("[Rendering] DrawingToolBox", toolBoxIsDragging);

	const [dialog, setDialog] = React.useState<{
		open: string | null;
		resize: {
			width: number;
			height: number;
		};
	}>({
		open: null,
		resize: {
			width: canvasRef.current?.width || 413,
			height: canvasRef.current?.height || 257,
		}
	});

	const handleChangeDialog = (event: React.ChangeEvent<HTMLInputElement>) => {
		setDialog({ ...dialog, resize: { ...dialog.resize, [event.target.name]: event.target.value } });
	};
	const handleCloseDialog = () => {
		setDialog({ ...dialog, open: null });
	};
	const handleClickNew = () => {
		setDialog({ ...dialog, open: "new" });
	};
	const handleClickResize = () => {
		if (!canvasRef.current) return;
		setDialog({ ...dialog, open: "resize", resize: { width: canvasRef.current.width, height: canvasRef.current.height } });
	};
	const handleClickUndo = () => {
		loadHistory("undo");
	};
	const handleClickRedo = () => {
		loadHistory("redo");
	};
	const handleClickTool = (event: React.MouseEvent<HTMLElement>, newTool: string | null) => {
		if (newTool !== null) {
			setTool({ ...tool, id: newTool });
		}
	};
	const handleSlideToolSize = (event: Event, newValue: number | number[]) => {
		setTool({ ...tool, size: { ...tool.size, [tool.id]: newValue as number } });
	};
	const handleChangeToolSize = (event: React.ChangeEvent<HTMLInputElement>) => {
		setTool({ ...tool, size: { ...tool.size, [tool.id]: parseInt(event.target.value) } });
	};
	const handleChangeColor = (event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		setTool({ ...tool, color: event.target.value });
	};
	const handleAddPalette = () => {
		setPalette([ ...palette, tool.color ]);
	};

	const newCanvas = () => {
		handleCloseDialog();
		if (!canvasRef.current || !canvasContextRef.current) return;
		canvasContextRef.current.fillStyle = "#FFF";
		canvasContextRef.current.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
		resetHistory();
	};
	const resizeCanvas = () => {
		handleCloseDialog();
		if (!canvasRef.current || !canvasContextRef.current) return;
		const tempCanvasImage= canvasRef.current.toDataURL();
		canvasRef.current.width = dialog.resize.width;
		canvasRef.current.height = dialog.resize.height;
		canvasContextRef.current.fillStyle = "#FFF";
		canvasContextRef.current.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
		const image = new Image();
		image.src = tempCanvasImage;
		image.onload = function() {
			canvasContextRef.current?.drawImage(image, 0, 0);
		};
	};

	return (
		<>
			<Paper ref={ref} style={{ top: position?.y || 0, left: position?.x || 0, transform: CSS.Translate.toString(toolBoxDragTransform) }} elevation={3} sx={{ position: "absolute", display: "flex", border: (theme) => `1px solid ${theme.palette.divider}`, flexDirection: "column", "& .toolButton": { width: 40, height: 40, minWidth: 0, minHeight: 0, p: 1.2 }, "& .MuiButtonBase-root": { border: 0 }, "& .MuiButtonBase-root:hover": { border: 0 }, "& .MuiButtonBase-root.Mui-disabled": { opacity: 0.5, border: 0 } }}>
				<Box alignSelf="center" textAlign="center" width="100%" {...toolBoxDragAttributes} {...toolBoxDragListeners} sx={{ cursor: toolBoxIsDragging ? "grabbing" : "grab" }}><DragHandleIcon /></Box>
				<ButtonGroup orientation="vertical" sx={{ border: 0 }}>
					<Tooltip title="새로 만들기" placement="right">
						<span>
							<Button className="toolButton" onClick={handleClickNew}>
								<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="none" d="M0 0h24v24H0z"/><path d="M9 2.003V2h10.998C20.55 2 21 2.455 21 2.992v18.016a.993.993 0 0 1-.993.992H3.993A1 1 0 0 1 3 20.993V8l6-5.997zM5.83 8H9V4.83L5.83 8zM11 4v5a1 1 0 0 1-1 1H5v10h14V4h-8z"/></svg>
								{/* <FontAwesomeIcon icon="fa-regular fa-file" /> */}
							</Button>
						</span>
					</Tooltip>
					<Tooltip title="크기 변경" placement="right">
						<span>
							<Button className="toolButton" onClick={handleClickResize}>
								<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="none" d="M0 0h24v24H0z"/><path d="M15 17v2H6a1 1 0 0 1-1-1V7H2V5h3V2h2v15h8zm2 5V7H9V5h9a1 1 0 0 1 1 1v11h3v2h-3v3h-2z"/></svg>
								{/* <FontAwesomeIcon icon="fa-solid fa-crop-simple" /> */}
							</Button>
						</span>
					</Tooltip>
					<Tooltip title="되돌리기" placement="right">
						<span>
							<Button className="toolButton" onClick={handleClickUndo} disabled={history.undo.length == 0}>
								<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="none" d="M0 0h24v24H0z"/><path d="M5.828 7l2.536 2.536L6.95 10.95 2 6l4.95-4.95 1.414 1.414L5.828 5H13a8 8 0 1 1 0 16H4v-2h9a6 6 0 1 0 0-12H5.828z"/></svg>
							</Button>
						</span>
					</Tooltip>
					<Tooltip title="재실행" placement="right">
						<span>
							<Button className="toolButton" onClick={handleClickRedo} disabled={history.redo.length == 0}>
								<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="none" d="M0 0h24v24H0z"/><path d="M18.172 7H11a6 6 0 1 0 0 12h9v2h-9a8 8 0 1 1 0-16h7.172l-2.536-2.536L17.05 1.05 22 6l-4.95 4.95-1.414-1.414L18.172 7z"/></svg>
							</Button>
						</span>
					</Tooltip>
				</ButtonGroup>
				<Divider />
				<ToggleButtonGroup
					value={tool.id}
					exclusive
					orientation="vertical"
					sx={{ border: 0 }}
					color="primary"
					onChange={handleClickTool}
				>
					<TooltipToggleButton className="toolButton" value="pencil" TooltipProps={{ title: "연필", "placement": "right" }}>
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="none" d="M0 0h24v24H0z"/><path d="M15.728 9.686l-1.414-1.414L5 17.586V19h1.414l9.314-9.314zm1.414-1.414l1.414-1.414-1.414-1.414-1.414 1.414 1.414 1.414zM7.242 21H3v-4.243L16.435 3.322a1 1 0 0 1 1.414 0l2.829 2.829a1 1 0 0 1 0 1.414L7.243 21z"/></svg>
					</TooltipToggleButton>
					<TooltipToggleButton className="toolButton" value="eraser" TooltipProps={{ title: "지우개", "placement": "right" }}>
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="none" d="M0 0h24v24H0z"/><path d="M8.586 8.858l-4.95 4.95 5.194 5.194H10V19h1.172l3.778-3.778-6.364-6.364zM10 7.444l6.364 6.364 2.828-2.829-6.364-6.364L10 7.444zM14 19h7v2h-9l-3.998.002-6.487-6.487a1 1 0 0 1 0-1.414L12.12 2.494a1 1 0 0 1 1.415 0l7.778 7.778a1 1 0 0 1 0 1.414L14 19z"/></svg>
					</TooltipToggleButton>
					<TooltipToggleButton className="toolButton" value="paint" TooltipProps={{ title: "페인트 통", "placement": "right" }}>
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="none" d="M0 0h24v24H0z"/><path d="M19.228 18.732l1.768-1.768 1.767 1.768a2.5 2.5 0 1 1-3.535 0zM8.878 1.08l11.314 11.313a1 1 0 0 1 0 1.415l-8.485 8.485a1 1 0 0 1-1.414 0l-8.485-8.485a1 1 0 0 1 0-1.415l7.778-7.778-2.122-2.121L8.88 1.08zM11 6.03L3.929 13.1 11 20.173l7.071-7.071L11 6.029z"/></svg>
					</TooltipToggleButton>
					<TooltipToggleButton className="toolButton" value="dropper" TooltipProps={{ title: "스포이드", "placement": "right" }}>
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="none" d="M0 0h24v24H0z"/><path d="M6.457 18.957l8.564-8.564-1.414-1.414-8.564 8.564 1.414 1.414zm5.735-11.392l-1.414-1.414 1.414-1.414 1.768 1.767 2.829-2.828a1 1 0 0 1 1.414 0l2.121 2.121a1 1 0 0 1 0 1.414l-2.828 2.829 1.767 1.768-1.414 1.414-1.414-1.414L7.243 21H3v-4.243l9.192-9.192z"/></svg>
					</TooltipToggleButton>
					<TooltipToggleButton className="toolButton" value="line" TooltipProps={{ title: "선 그리기", "placement": "right" }}>
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="none" d="M0 0h24v24H0z"/><path d="M5 8v12h4V8H5zM3 7l4-5 4 5v15H3V7zm16 9v-2h-3v-2h3v-2h-2V8h2V6h-4v14h4v-2h-2v-2h2zM14 4h6a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1h-6a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1z"/></svg>
					</TooltipToggleButton>
				</ToggleButtonGroup>
				<Divider />
				<ColorPicker inputProps={{ sx: { p: 0, height: 40 } }} onBlur={handleChangeColor} value={tool.color} />
				<IconButton onClick={handleAddPalette} sx={{ width: 20, height: 20, minWidth: 20, minHeight: 20, margin: "0 auto", lineHeight: 1, }}>＋</IconButton>
				{(tool.id == "pencil" || tool.id == "eraser" || tool.id == "line") &&
					<React.Fragment>
						<Slider
							sx={{
								"& input[type=\"range\"]": {
									WebkitAppearance: "slider-vertical",
								},
								height: 100,
								marginTop: 2,
								marginBottom: 2,
								marginLeft: "auto",
								marginRight: "auto",
							}}
							orientation="vertical"
							value={tool.size ? tool.size[tool.id] : 1}
							min={1}
							max={30}
							onChange={handleSlideToolSize}
						/>
						<TextField type="number" value={tool.size ? tool.size[tool.id] : 1} onChange={handleChangeToolSize} size="small" sx={{ width: 40 }} inputProps={{ sx: { px: 0.3, py: 0.2, textAlign: "center" }, min: 1, max: 30 }} />
					</React.Fragment>
				}
			</Paper>
			<Dialog
				open={dialog.open == "new"}
				onClose={handleCloseDialog}
			>
				<DialogTitle>
			캔버스를 초기화 할까요?
				</DialogTitle>
				<DialogContent>
					<DialogContentText>
				캔버스 내용, 작업 내역, 파레트 등 모두 초기화됩니다.
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={newCanvas} autoFocus>ㅇㅇ</Button>
					<Button onClick={handleCloseDialog}>ㄴㄴ</Button>
				</DialogActions>
			</Dialog>
			<Dialog
				open={dialog.open == "resize"}
				onClose={handleCloseDialog}
			>
				<DialogTitle>
			캔버스 크기 변경
				</DialogTitle>
				<DialogContent>
					<DialogContentText>
				캔버스를 벗어나는 그림은 잘리게 됩니다.
					</DialogContentText>
					<Stack direction="row" alignItems="end">
						<TextField
							autoFocus
							label="가로"
							type="number"
							variant="standard"
							name="width"
							value={dialog.resize.width}
							onChange={handleChangeDialog}
						/>
						<Typography mx={1}>×</Typography>
						<TextField
							autoFocus
							label="세로"
							type="number"
							variant="standard"
							name="height"
							value={dialog.resize.height}
							onChange={handleChangeDialog}
						/>
					</Stack>
				</DialogContent>
				<DialogActions>
					<Button onClick={resizeCanvas} autoFocus>ㅇㅇ</Button>
					<Button onClick={handleCloseDialog}>ㄴㄴ</Button>
				</DialogActions>
			</Dialog>
		</>
	);
});
const DrawingToolBox = React.memo(DrawingToolBox_);

const DrawingPalette = ({ palette, setPalette, tool, setTool, position }: { palette: string[]; setPalette: React.Dispatch<React.SetStateAction<string[]>>, tool: Tool, setTool: React.Dispatch<React.SetStateAction<Tool>>, position: Position }) => {
	const { attributes: paletteDragAttributes, listeners: paletteDragListeners, transform: paletteDragTransform, isDragging: paletteIsDragging } = useDraggable({
		id: "palette"
	});
	// const handleClickPalette = (event: React.MouseEvent) => {
	// // const handleClickPalette = (colorIndex: number) => {
	// 	const target = event.target as HTMLDivElement;
	// 	// console.log(colorIndex);
	// 	if (event.button == 2) {
	// 		// delete
	// 	} else if (target.dataset.index && palette[target.dataset.index]) {
	// 		setTool({ ...tool, color: Color(palette[target.dataset.index]).hex() });
	// 	}
	// };

	const handleClickPalette = (color: string) => {
		setTool({ ...tool, color: Color(color).hex() });
	};

	const handleContextPalette = (index: number) => {
		// setTool({ ...tool, color: Color(color).hex() });
		console.log("우클릭");
		const p = [...palette];
		p.splice(index, 1);
		console.log(p);
		setPalette(p);
	};

	return (
		<>
			<Paper style={{ top: position?.y || 0, left: position?.x || 0, transform: CSS.Translate.toString(paletteDragTransform) }} elevation={3} sx={{ position: "absolute", display: "flex", minWidth: 58, border: (theme) => `1px solid ${theme.palette.divider}`, flexDirection: "column", "& .MuiButtonBase-root": { border: "1px solid gray", minWidth: 40, minHeight: 40, width: 40, height: 40, p: 0 }, "& .MuiButtonBase-root:hover": { border: 0 }, "& .MuiButtonBase-root.Mui-disabled": { opacity: 0.5, border: 0 } }}>
				<Box alignSelf="center" textAlign="center" width="100%" {...paletteDragAttributes} {...paletteDragListeners} sx={{ cursor: paletteIsDragging ? "grabbing" : "grab" }}><DragHandleIcon /></Box>
				<Stack p={1} gap={0.5}>
					{ palette.map((color, index) => {
						// return <Button><Box width={40} height={40} bgcolor={color}></Box></Button>;
						// return <Button sx={{ width: 40, height: 40, bgcolor: color, "&:hover": { bgcolor: "transparent" } }}></Button>;
						/*
						data-index={index} onClick={(event: React.MouseEvent) => {
							console.log(event);
							if (event.button == 2) {
								console.log("우클릭");
								const p = [...palette];
								p.splice(index, 1);
								console.log(p);
								setPalette(p);
							} else {
								setTool({ ...tool, color: Color(color).hex() });
							}
						}}
						*/
						return <Box key={index} width={40} height={40} sx={{ cursor: "pointer" }} bgcolor={color} onClick={handleClickPalette.bind(null, color)} onContextMenu={handleContextPalette.bind(null, index)}></Box>;
					})}
				</Stack>
			</Paper>
		</>
	);
};
