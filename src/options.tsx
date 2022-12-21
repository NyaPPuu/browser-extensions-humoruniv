import React from "react";
import ReactDOM from "react-dom/client";
import { createTheme, TextField, ThemeProvider, CssBaseline, Container, Toolbar, Typography, Button, IconButton, Snackbar, Alert, AlertColor, Switch } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ChatIcon from "@mui/icons-material/Chat";
import app from "./lib/common";
import Grid from "@mui/material/Unstable_Grid2"; // Grid version 2

interface OptionsForm {
	[key: string]: unknown;
	"write.picture": boolean;
	"write.picture.cursor": boolean;
	"write.picture.cursorDot": boolean;
	"write.picture.careful": boolean;
	"write.picture.colpickImmed": boolean;
	"write.picture.adjustx": number;
	"write.picture.adjusty": number;
}

function OptionRow(props: React.PropsWithChildren<{ subject: React.ReactNode, description?: string }>) {
	return (
		<>
			<Grid xs={12} md={2} textAlign={{ xs: "left", md: "right" }}>
				{props.subject}
				{props.description && <Typography variant="caption" component="div">{props.description}</Typography>}
			</Grid>
			<Grid xs={12} md={10}>
				{props.children}
			</Grid>
		</>
	);
}
function OptionHeading(props: { subject: React.ReactNode; }) {
	return (
		<Grid xs={12} paddingLeft={{ xs: 1, md: 10 }}>
			<Typography variant="h6">{ props.subject }</Typography>
		</Grid>
	);
}

export default function App() {

	const [form, setForm] = React.useState<OptionsForm>({
		"write.picture": true,
		"write.picture.cursor": true,
		"write.picture.cursorDot": true,
		"write.picture.careful": false,
		"write.picture.colpickImmed": false,
		"write.picture.adjustx": 0,
		"write.picture.adjusty": 0,
	});
	const [snackPack, setSnackPack] = React.useState<{ message?: string; type: AlertColor; open: boolean; }>({
		type: "success",
		open: false
	});

	const handleClickSave = function() {
		const options: { [key: string]: unknown; } = { ...form };
		try {
			app.storage.sync.set(options, () => {
				showSnackbar("Saved");
			});
		} catch (error) {
			let message;
			if (error instanceof Error) message = error.message;
			else message = String(error);
			showSnackbar("Error — " + message, "error");
		}
	};

	const handleChange = function(event: React.ChangeEvent<HTMLElement>) {
		const name = event.target.getAttribute("name");
		if (!name) return;
		const newData = { ...form };
		if (event.target.tagName == "INPUT" && event.target.getAttribute("type") == "checkbox") {
			const target = event.target as HTMLInputElement;
			newData[name] = target.checked;
			setForm(newData);
		} else if (event.target.tagName == "INPUT" || event.target.tagName == "TEXTAREA") {
			const target = event.target as HTMLInputElement;
			newData[name] = target.value;
			setForm(newData);
		}
	};

	const showSnackbar = function(message: string, type: AlertColor = "success") {
		setSnackPack({ message, type, open: true });
	};
	const handleCloseSnackbar = function() {
		setSnackPack({ ...snackPack, open: false });
	};

	React.useEffect(() => {
		app.storage.sync.get(null, function(result) {
			setForm({ ...form, ...result });
		});
	}, []);

	const handleClickChat = function() {
		window.open("http://web.humoruniv.com/memo/memo.html?you_hex=b8debfecb8debfec", "w_b8debfecb8debfec", "scrollbars=yes,toolbar=no,location=no,directories=no,menubar=no,status=no,width=520,height=720,resizable=yes");
	}

	return (
		<>
			<Toolbar sx={{ borderBottom: 1, borderColor: "divider", marginBottom: 3 }}>
				<Button variant="outlined" startIcon={<ChatIcon />} onClick={handleClickChat}>
					개발자에게 쪽지
				</Button>
				<Typography
					component="h2"
					variant="h5"
					color="inherit"
					align="center"
					noWrap
					sx={{ flex: 1 }}
				>
					Options
				</Typography>
				<Button variant="contained" size="small" onClick={handleClickSave}>
					Save
				</Button>
			</Toolbar>
			<Grid container spacing={2}>
				<OptionHeading subject="그림낙서" />
				<OptionRow subject="도구 모양 커서">
					<Switch name="write.picture.cursor" checked={form["write.picture.cursor"] ? true : false} onChange={handleChange} />
				</OptionRow>
				<OptionRow subject="십자 커서 사용" description="도구 크기가 1px일때 십자 커서로 바뀝니다">
					<Switch name="write.picture.cursorDot" checked={form["write.picture.cursorDot"] ? true : false} onChange={handleChange} />
				</OptionRow>
				<OptionRow subject="저장, 불러오기 확인창">
					<Switch name="write.picture.careful" checked={form["write.picture.careful"] ? true : false} onChange={handleChange} />
				</OptionRow>
				<OptionRow subject="색상 즉시 적용">
					<Switch name="write.picture.colpickImmed" checked={form["write.picture.colpickImmed"] ? true : false} onChange={handleChange} />
				</OptionRow>
				<OptionRow subject="X 좌표 보정">
					<TextField size="small" fullWidth type="number" name="write.picture.adjustx" value={form["write.picture.adjustx"]} onChange={handleChange} />
				</OptionRow>
				<OptionRow subject="X 좌표 보정">
					<TextField size="small" fullWidth type="number" name="write.picture.adjusty" value={form["write.picture.adjusty"]} onChange={handleChange} />
				</OptionRow>
			</Grid>
			<Snackbar
				key={"alert"}
				open={snackPack.open}
				autoHideDuration={snackPack.type == "error" ? 10000 : 3000}
				onClose={handleCloseSnackbar}
				message={snackPack.message}
				anchorOrigin={{ vertical: "top", horizontal: "center" }}
				action={
					<React.Fragment>
						<Button color="secondary" size="small" onClick={handleCloseSnackbar}>
						UNDO
						</Button>
						<IconButton
							aria-label="close"
							color="inherit"
							sx={{ p: 0.5 }}
							onClick={handleCloseSnackbar}
						>
							<CloseIcon />
						</IconButton>
					</React.Fragment>
				}
			>
				<Alert onClose={handleCloseSnackbar} severity={snackPack.type} sx={{ width: "100%" }} variant="filled">{snackPack.message}</Alert>
			</Snackbar>
		</>
	);
}

const theme = createTheme({ palette: { mode: "dark" } });

const container = document.getElementById("root");
if (container) {
	const root = ReactDOM.createRoot(container);
	root.render(
		<React.StrictMode>
			<ThemeProvider theme={theme}>
				<CssBaseline />
				<Container maxWidth="lg">
					<App />
				</Container>
			</ThemeProvider>
		</React.StrictMode>,
	);
}
