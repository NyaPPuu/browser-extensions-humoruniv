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
			"pencil": 20,
			"eraser": 5,
		}
	});
	const canvasRef = React.useRef<HTMLCanvasElement>(null);
	const canvasContextRef = React.useRef<CanvasRenderingContext2D | null>(null);

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

	// const handlePointerDown = (event: MouseEvent | TouchEvent) => {
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
	// const handlePointerUp = (ReactEvent: React.MouseEvent | React.TouchEvent) => {
	// 	const event = ReactEvent.nativeEvent;
		pointer.current.isDown = false;
		if (previousTool.current) {
			setTool({ ...tool, id: previousTool.current });
			previousTool.current = null;
		}
	};
	// const handlePointerEnter = (ReactEvent: React.MouseEvent | React.TouchEvent) => {
	// const handlePointerEnter = (event: MouseEvent | TouchEvent) => {
	// 	if (pointer.current.isDown) {
	// 		const { x, y } = getEventPosition(event);
	// 		console.log("handlePointerEnter", pointer.current.lastX, pointer.current.lastY, x, y);
	// 		doAction(tool.id, x, y, event.type);
	// 	}
	// 	pointer.current.isEnter = true;
	// 	pointer.current.lastX = null;
	// 	pointer.current.lastY = null;
	// };
	// const handlePointerLeave = (event: MouseEvent | TouchEvent) => {
	// // const handlePointerLeave = (ReactEvent: React.MouseEvent | React.TouchEvent) => {
	// // 	const event = ReactEvent.nativeEvent;
	// 	pointer.current.isEnter = false;
	// 	if (pointer.current.isDown) {
	// 		const { x, y } = getEventPosition(event);
	// 		doAction(tool.id, x, y, event.type);
	// 	}
	// };
	const handlePointerMove = (event: MouseEvent | TouchEvent) => {
	// const handlePointerMove = (ReactEvent: React.MouseEvent | React.TouchEvent) => {
		// const event = ReactEvent.nativeEvent;
		// DEV.log("handlePointerMove", tool.id, event, event.target === canvasRef.current);
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
		// console.log("getStamp", stampID, toolID);
		if (!stamp.current[stampID]) stamp.current[stampID] = makeStamp(tool.size[tool.id], colorHEX);
		return stamp.current[stampID];
	};

	const doAction = (toolID: string, xPosition: number, yPosition: number, eventType?: string) => {
		if (!canvasRef.current || !canvasContextRef.current) return;
		DEV.log("doAction", toolID, tool.id, xPosition, yPosition, eventType);

		if (toolID == "pencil" || toolID == "eraser") {
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
			// saveHistory();
			// Draw the current state of the color layer to the canvas
			canvasContextRef.current.putImageData(imageData, 0, 0);
		}
	};

	// React.useEffect(() => {
	// 	if (canvasRef.current) {
	// 		const ctx = canvasRef.current.getContext("2d", { willReadFrequently: true });
	// 		canvasContextRef.current = ctx;
	// 	}
	// 	canvasRef.current?.addEventListener("pointerdown", handlePointerDown);
	// 	canvasRef.current?.addEventListener("pointerup", handlePointerUp);
	// 	canvasRef.current?.addEventListener("pointermove", handlePointerMove);
	// 	return () => {
	// 		canvasRef.current?.removeEventListener("pointerdown", handlePointerDown);
	// 		canvasRef.current?.removeEventListener("pointerup", handlePointerUp);
	// 		canvasRef.current?.removeEventListener("pointermove", handlePointerMove);
	// 	};
	// }, [tool.id]);

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
	}, [tool.id]);

	return (
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
			<DrawingTools tool={tool} setTool={setTool} />
		</Box>
	);
}

function DrawingTools({ tool, setTool }: { tool: Tool, setTool: React.Dispatch<React.SetStateAction<Tool>> }) {

	const handleClickTool = (event: React.MouseEvent<HTMLElement>, newTool: string | null) => {
		if (newTool !== null) {
			setTool({ ...tool, id: newTool });
		}
	};

	return (
		<Box>
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
		</Box>
	);
}