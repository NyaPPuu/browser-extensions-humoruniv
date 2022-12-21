import { Box, Button, ButtonGroup, Checkbox, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, Input, InputProps, Paper, Slider, Stack, TextField, ToggleButton, ToggleButtonGroup, ToggleButtonProps, Tooltip, TooltipProps, Typography } from "@mui/material";
import React, { useContext, VFC } from "react";
import { DEV, matchRule, render } from "../lib/common";
import Color from "color";
import { DndContext, DragEndEvent, useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import DragHandleIcon from "@mui/icons-material/DragHandle";


/* 함수 */
function distanceBetween(x1: number, y1: number, x2: number, y2: number) {
	return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}
function angleBetween(x1: number, y1: number, x2: number, y2: number) {
	return Math.atan2(x2 - x1, y2 - y1);
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
const getPixelColorFromImageData = (imageData: ImageData, xPosition: number, yPosition: number, width: number) => {
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
	console.log(toolSize, size, context);

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
	console.log("makeStamp canvas", canvas);
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
const ColorPicker = React.memo(function ColorPicker({ ...props }: InputProps) {
	const [color, setColor] = React.useState<string>("#000000");

	const handleChangeColor = (event: React.ChangeEvent<HTMLInputElement>) => {
		setColor(event.target.value);
	};

	return (
		<Input disableUnderline {...props} type="color" value={color} onChange={handleChangeColor} />
	);
});

type ToolSize = { [key: string]: number; }
type Tool = { id: string; color: string; size: ToolSize; }
type History = { undo: string[]; redo: string[]; };
type Position = { x: number; y: number; }

export default function Drawing() {

	const stamp = React.useRef<{ [key: string]: HTMLCanvasElement; }>({});
	const previousTool = React.useRef<string | null>(null);
	const pointer = React.useRef<{
		lastX: null | number;
		lastY: null | number;
		isDown: boolean;
		isEnter: boolean;
	}>({
		lastX: null,
		lastY: null,
		isDown: false,
		isEnter: false,
	});
	const [tool, setTool] = React.useState<Tool>({
		id: "pencil",
		color: "black",
		size: {
			"pencil": 2,
			"eraser": 5,
		}
	});
	const [history, setHistory] = React.useState<History>({
		undo: [],
		redo: [],
	});
	const [position, setPosition] = React.useState<{ [id: string]: Position; }>({});
	const canvasRef = React.useRef<HTMLCanvasElement>(null);
	const canvasContextRef = React.useRef<CanvasRenderingContext2D | null>(null);

	const handleDragEnd = (event: DragEndEvent) => {
		DEV.log("handleDragEnd", event);
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
		const { x, y } = getEventPosition(event);
		DEV.log("handlePointerDown", x, y, ReactEvent);
		if ("button" in event && event.button == 2) {
			previousTool.current = tool.id;
			setTool({ ...tool, id: "eraser" });
			doAction("eraser", x, y, event.type);
		} else doAction(tool.id, x, y, event.type);
	};
	const handlePointerUp = (event: MouseEvent | TouchEvent) => {
		pointer.current.isDown = false;
		if (previousTool.current) {
			setTool({ ...tool, id: previousTool.current });
			previousTool.current = null;
		}
	};
	const handlePointerMove = (event: MouseEvent | TouchEvent) => {
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

	const getStamp = (toolID: string, colorHEX: string) => {
		const stampID = tool.size[toolID]+"_"+colorHEX;
		console.log("stamp", stampID);
		if (!stamp.current[stampID]) stamp.current[stampID] = makeStamp(tool.size[toolID], colorHEX);
		return stamp.current[stampID];
	};

	const doAction = (toolID: string, xPosition: number, yPosition: number, eventType?: string) => {
		if (!canvasRef.current || !canvasContextRef.current) return;
		DEV.log("doAction", tool, xPosition, yPosition, eventType);

		if (toolID == "pencil" || toolID == "eraser") {
			if (eventType == "pointerdown") saveHistory();

			const lastX = eventType != "pointerdown" && pointer.current.lastX != null ? pointer.current.lastX : xPosition;
			const lastY = eventType != "pointerdown" && pointer.current.lastY != null ? pointer.current.lastY : yPosition;
			pointer.current.lastX = xPosition;
			pointer.current.lastY = yPosition;

			const size = tool.size[toolID] || 1;
			const halfSize = (size - (size % 2)) / 2;
			const stamp = getStamp(toolID, toolID == "eraser" ? "#FFFFFF" : Color(tool.color).hex());
			if ((!lastX || !lastY) || xPosition === lastX && yPosition === lastY) {
				const x = xPosition - halfSize;
				const y = yPosition - halfSize;
				canvasContextRef.current.drawImage(stamp, Math.round(x), Math.round(y), size, size);
				return;
			}
			const dist = distanceBetween(xPosition, yPosition, lastX, lastY);
			const angle = angleBetween(xPosition, yPosition, lastX, lastY);
			for (let i = 0; i < dist; i += 1) {
				const x = xPosition + (Math.sin(angle) * i) - halfSize;
				const y = yPosition + (Math.cos(angle) * i) - halfSize;
				canvasContextRef.current.drawImage(stamp, Math.round(x), Math.round(y), size, size);
			}
		} else if (toolID == "paint") {
			console.log("paint!");
			if (eventType != "pointerdown" && eventType != "pointermove") return;
			console.log("eventType pass");
			const imageData = canvasContextRef.current.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height);
			const toolColor = Color(tool.color).rgb().array();
			const startColor = getPixelColorFromImageData(imageData, xPosition, yPosition, canvasRef.current.width);
			console.log(imageData, xPosition, yPosition, startColor, toolColor);
			if (isSameColor(startColor, toolColor)) return;
			console.log("sameColor pass");
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
				while (y < canvasRef.current.height - 1 && isSameColor(startColor, getPixelColorFromImageData(imageData, x, y, canvasRef.current.width))) {
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
		if (!canvasRef.current || !canvasContextRef.current) return;
		const otherType = type == "undo" ? "redo" : "undo";
		const currentHistory = { ...history };
		const nowData = currentHistory[type].pop();
		if (!nowData) return;
		const image = new Image();
		image.src = nowData;
		currentHistory[otherType].push(canvasRef.current.toDataURL());
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
		// canvasRef.current?.addEventListener("pointerenter", handlePointerEnter);
		// canvasRef.current?.addEventListener("pointerleave", handlePointerLeave);

		return () => {
			window.removeEventListener("pointerup", handlePointerUp);
			window.removeEventListener("pointermove", handlePointerMove);
			// canvasRef.current?.removeEventListener("pointerenter", handlePointerEnter);
			// canvasRef.current?.removeEventListener("pointerleave", handlePointerLeave);
		};
	}, [tool.id, tool.size, tool.color]);

	return (
		<DndContext onDragEnd={handleDragEnd}>
			<Box onContextMenu={handleContextmenu}>
				<TextField value={JSON.stringify(tool)} />
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
					{/* <div
						style={{
							position: "absolute",
							top: 0,
							left: 0,
							width: "100%",
							height: "100%",
						}}
						onPointerDown={handlePointerDown}
						// onPointerEnter={handlePointerEnter}
						// onPointerLeave={handlePointerLeave}
					></div> */}
				</div>
				<DrawingToolBox canvasRef={canvasRef} canvasContextRef={canvasContextRef} position={position.toolBox} tool={tool} setTool={setTool} history={history} loadHistory={loadHistory} resetHistory={resetHistory} />
			</Box>
		</DndContext>
	);
}

const DrawingToolBox = React.memo(function DrawingToolBox({ canvasRef, canvasContextRef, position, tool, setTool, history, loadHistory, resetHistory }: { canvasRef: React.RefObject<HTMLCanvasElement>, canvasContextRef: React.MutableRefObject<CanvasRenderingContext2D | null>, position: Position, tool: Tool, setTool: React.Dispatch<React.SetStateAction<Tool>>, history: History, loadHistory: (type: "redo" | "undo") => void, resetHistory: () => void }) {

	const { attributes: toolBoxDragAttributes, listeners: toolBoxDragListeners, setNodeRef: toolBoxDragSetNodeRef, transform: toolBoxDragTransform, isDragging: toolBoxIsDragging } = useDraggable({
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
		const image = new Image();
		image.src = tempCanvasImage;
		image.onload = function() {
			canvasContextRef.current?.drawImage(image, 0, 0);
		};
	};

	return (
		<>
			<Paper ref={toolBoxDragSetNodeRef} style={{ transform: CSS.Translate.toString(toolBoxDragTransform) }} elevation={3} sx={{ position: "absolute", top: position?.y || 0, left: position?.x || 0, display: "flex", border: (theme) => `1px solid ${theme.palette.divider}`, flexDirection: "column", "& .MuiButtonBase-root": { border: 0, width: 40, height: 40, p: 1.2 }, "& .MuiButtonBase-root:hover": { border: 0 }, "& .MuiButtonBase-root.Mui-disabled": { opacity: 0.5, border: 0 } }}>
				<Box alignSelf="center" {...toolBoxDragAttributes} {...toolBoxDragListeners} sx={{ cursor: toolBoxIsDragging ? "grabbing" : "grab" }}><DragHandleIcon /></Box>
				<ButtonGroup orientation="vertical" sx={{ border: 0 }}>
					<Tooltip title="새로 만들기" placement="right">
						<span>
							<Button onClick={handleClickNew}>
								<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="none" d="M0 0h24v24H0z"/><path d="M8.586 17H3v-2h18v2h-5.586l3.243 3.243-1.414 1.414L13 17.414V20h-2v-2.586l-4.243 4.243-1.414-1.414L8.586 17zM5 3h14a1 1 0 0 1 1 1v10H4V4a1 1 0 0 1 1-1zm1 2v7h12V5H6z"/></svg>
							</Button>
						</span>
					</Tooltip>
					<Tooltip title="크기 변경" placement="right">
						<span>
							<Button onClick={handleClickResize}>
								<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="none" d="M0 0h24v24H0z"/><path d="M15 17v2H6a1 1 0 0 1-1-1V7H2V5h3V2h2v15h8zm2 5V7H9V5h9a1 1 0 0 1 1 1v11h3v2h-3v3h-2z"/></svg>
							</Button>
						</span>
					</Tooltip>
					<Tooltip title="되돌리기" placement="right">
						<span>
							<Button onClick={handleClickUndo} disabled={history.undo.length == 0}>
								<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="none" d="M0 0h24v24H0z"/><path d="M5.828 7l2.536 2.536L6.95 10.95 2 6l4.95-4.95 1.414 1.414L5.828 5H13a8 8 0 1 1 0 16H4v-2h9a6 6 0 1 0 0-12H5.828z"/></svg>
							</Button>
						</span>
					</Tooltip>
					<Tooltip title="재실행" placement="right">
						<span>
							<Button onClick={handleClickRedo} disabled={history.redo.length == 0}>
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
					<TooltipToggleButton value="pencil" TooltipProps={{ title: "연필", "placement": "right" }}>
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="none" d="M0 0h24v24H0z"/><path d="M15.728 9.686l-1.414-1.414L5 17.586V19h1.414l9.314-9.314zm1.414-1.414l1.414-1.414-1.414-1.414-1.414 1.414 1.414 1.414zM7.242 21H3v-4.243L16.435 3.322a1 1 0 0 1 1.414 0l2.829 2.829a1 1 0 0 1 0 1.414L7.243 21z"/></svg>
					</TooltipToggleButton>
					<TooltipToggleButton value="eraser" TooltipProps={{ title: "지우개", "placement": "right" }}>
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="none" d="M0 0h24v24H0z"/><path d="M8.586 8.858l-4.95 4.95 5.194 5.194H10V19h1.172l3.778-3.778-6.364-6.364zM10 7.444l6.364 6.364 2.828-2.829-6.364-6.364L10 7.444zM14 19h7v2h-9l-3.998.002-6.487-6.487a1 1 0 0 1 0-1.414L12.12 2.494a1 1 0 0 1 1.415 0l7.778 7.778a1 1 0 0 1 0 1.414L14 19z"/></svg>
					</TooltipToggleButton>
					<TooltipToggleButton value="paint" TooltipProps={{ title: "페인트 통", "placement": "right" }}>
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="none" d="M0 0h24v24H0z"/><path d="M19.228 18.732l1.768-1.768 1.767 1.768a2.5 2.5 0 1 1-3.535 0zM8.878 1.08l11.314 11.313a1 1 0 0 1 0 1.415l-8.485 8.485a1 1 0 0 1-1.414 0l-8.485-8.485a1 1 0 0 1 0-1.415l7.778-7.778-2.122-2.121L8.88 1.08zM11 6.03L3.929 13.1 11 20.173l7.071-7.071L11 6.029z"/></svg>
					</TooltipToggleButton>
				</ToggleButtonGroup>
				<Divider />
				<ColorPicker inputProps={{ sx: { p: 0, height: 40 } }} onBlur={handleChangeColor} value={tool.color} />
				{(tool.id == "pencil" || tool.id == "eraser") &&
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