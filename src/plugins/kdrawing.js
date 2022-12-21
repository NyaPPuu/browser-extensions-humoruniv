// JavaScript Document

(function ($) {
	var kdrawing = function () {
		var
			tpl = '<div class="kdrawing">\
<div class="kdrawing_drawingboard"><canvas class="kdrawing_canvas" /><div class="kdrawing_cursor"><div class="kdrawing_cursor_icon"></div><div class="kdrawing_cursor_inner"></div></div><div class="kdrawing_cover"></div></div>\
<div class="kdrawing_information">\
<p>B : 연필</p>\
<p>E : 지우개</p>\
<p>G : 페인트통</p>\
<p>I : 스포이드</p>\
<p>U : 선 그리기</p>\
<p>Ctrl+Z, Ctrl+Y : 실행 취소, 재실행</p>\
<p>Ctrl+S : 저장</p>\
<p>1 ~ 9 : 파레트 색상 선택</p>\
<p>T : 도구 상자를 현재 마우스 위치로 이동</p>\
<p>+, - : 도구 크기 변경</p>\
<br />\
<p>왼클릭 : 도구 사용</p>\
<p>오른클릭 : 지우개</p>\
<p>파레트 색상에 대고 오른클릭 : 파레트 지우기</p>\
</div>\
<div class="kdrawing_timeline"></div>\
<div class="kdrawing_fadealert"></div>\
</div>',
			tpl_toolbox = '<div class="kdrawing_toolbox kdrawing_draggable"><div class="kdrawing_draggable_handle"></div><ul class="kdrawing_toolbox_tools">\
<li class="kdrawing_toolbox_tool"><span class="kdrawing_toolbox_new" data-tool="new" title="새로 만들기"></span></li>\
<li class="kdrawing_toolbox_tool"><span class="kdrawing_toolbox_undo" data-tool="undo" title="실행 취소"></span></li>\
<li class="kdrawing_toolbox_tool"><span class="kdrawing_toolbox_redo" data-tool="redo" title="다시 실행"></span></li>\
<li class="kdrawing_toolbox_division"></li>\
<li class="kdrawing_toolbox_tool"><span class="kdrawing_toolbox_pencil" data-tool="pencil" title="연필"></span></li>\
<li class="kdrawing_toolbox_tool"><span class="kdrawing_toolbox_eraser" data-tool="eraser" title="지우개"></span></li>\
<li class="kdrawing_toolbox_tool"><span class="kdrawing_toolbox_paint" data-tool="paint" title="페인트통"></span></li>\
<li class="kdrawing_toolbox_tool"><span class="kdrawing_toolbox_eyedropper" data-tool="eyedropper" title="스포이드"></span></li>\
<li class="kdrawing_toolbox_tool"><span class="kdrawing_toolbox_line" data-tool="line" title="선 그리기"></span></li>\
<li class="kdrawing_toolbox_division"></li>\
<li class="kdrawing_toolbox_system">\
<div class="kdrawing_toolbox_color"></div>\
<button type="button" class="kdrawing_button kdrawing_toolbox_addpalette" title="파레트에 색상 추가">＋</button>\
</li>\
<li class="kdrawing_toolbox_option">\
<div class="kdrawing_toolbox_size"><input class="kdrawing_toolbox_size_bar" type="range" min="1" max="10" value="2" /><br /><input class="kdrawing_toolbox_size_text" type="number" min="1" value="2" /></div>\
<li class="kdrawing_toolbox_division"></li>\
<li class="kdrawing_toolbox_tool"><span class="kdrawing_toolbox_save" data-tool="save" title="저장하기"></span></li>\
<li class="kdrawing_toolbox_tool"><span class="kdrawing_toolbox_load" data-tool="load" title="불러오기"></span></li>\
<li class="kdrawing_toolbox_tool"><span class="kdrawing_toolbox_timeline" data-tool="timeline" title="타임라인 만들기"></span></li>\
</li></ul></div>',
			tpl_palette = '<div class="kdrawing_palette kdrawing_draggable"><div class="kdrawing_draggable_handle"></div>\
<ul class="kdrawing_palette_colors"></ul>\
</div>',
			tpl_colorpicker = '\
<div class="kdrawing_colorpicker kdrawing_draggable"><div class="kdrawing_draggable_handle"></div><div class="kdrawing_colorpicker_wrapper">\
<div class="kdrawing_colorpicker_color" style="background-color: rgb(255, 0, 0);"><div class="kdrawing_colorpicker_color_overlay1"><div class="kdrawing_colorpicker_color_overlay2"><div class="kdrawing_colorpicker_selector_outer" style="left: 0px; top: 156px;"><div class="kdrawing_colorpicker_selector_inner"></div></div></div></div></div>\
<div class="kdrawing_colorpicker_hue"><div class="kdrawing_colorpicker_hue_arrs" style="top: 0px;"><div class="kdrawing_colorpicker_hue_larr"></div><div class="kdrawing_colorpicker_hue_rarr"></div></div></div>\
<div class="kdrawing_colorpicker_right"><div class="kdrawing_colorpicker_show_color"><div class="kdrawing_colorpicker_new_color"></div><div class="kdrawing_colorpicker_current_color"></div></div>\
<form novalidate>\
<div style="float: left;">\
<div class="kdrawing_colorpicker_hsb_h kdrawing_colorpicker_field"><div class="kdrawing_colorpicker_field_letter">H</div><input type="number" maxlength="3" size="3" min="0" max="360"></div>\
<div class="kdrawing_colorpicker_hsb_s kdrawing_colorpicker_field"><div class="kdrawing_colorpicker_field_letter">S</div><input type="number" maxlength="3" size="3" min="0" max="100"></div>\
<div class="kdrawing_colorpicker_hsb_b kdrawing_colorpicker_field"><div class="kdrawing_colorpicker_field_letter">B</div><input type="number" maxlength="3" size="3" min="0" max="100"></div>\
</div>\
<div class="kdrawing_colorpicker_rgb_box">\
<div class="kdrawing_colorpicker_rgb_r kdrawing_colorpicker_field"><div class="kdrawing_colorpicker_field_letter">R</div><input type="number" maxlength="3" size="3" min="0" max="255"></div>\
<div class="kdrawing_colorpicker_rgb_g kdrawing_colorpicker_field"><div class="kdrawing_colorpicker_field_letter">G</div><input type="number" maxlength="3" size="3" min="0" max="255"></div>\
<div class="kdrawing_colorpicker_rgb_b kdrawing_colorpicker_field"><div class="kdrawing_colorpicker_field_letter">B</div><input type="number" maxlength="3" size="3" min="0" max="255"></div>\
</div><div style="clear: both;"></div>\
<div class="kdrawing_colorpicker_hex kdrawing_colorpicker_field"><div class="kdrawing_colorpicker_field_letter">#</div><input type="text" maxlength="6" size="6"></div>\
<div class="kdrawing_colorpicker_buttons"><button type="submit" class="kdrawing_button kdrawing_colorpicker_submit">확인</button><button type="button" class="kdrawing_button kdrawing_colorpicker_cancel">취소</button><div style="clear: both;"></div></div>\
</form>\
</div></div></div>',
			tpl_alertwindow = '<div class="kdrawing_alertwindow kdrawing_draggable"><div class="kdrawing_draggable_handle"></div><form novalidate>\
<div class="kdrawing_alertwindow_size kdrawing_alertwindow_form"><input type="text" name="width" /><span class="kdrawing_alertwindow_size_center">x</span><input type="text" name="height" /><div class="kdrawing_alertwindow_size_keep"><label><input type="checkbox" name="keep" /> 그림 유지</label></div><div class="kdrawing_alertwindow_buttons"><button type="submit" class="kdrawing_button">확인</button><button type="button" class="kdrawing_button kdrawing_alertwindow_close">취소</button></div></div>\
<div class="kdrawing_alertwindow_alert kdrawing_alertwindow_form"><div class="kdrwaing_alertwindow_text"></div><div class="kdrawing_alertwindow_buttons"><button type="submit" class="kdrawing_button">확인</button></div></div>\
</form></div>',
			defaults = {
				last: {
					x: 0,
					y: 0
				},
				tool_id: "pencil",
				tool_id_org: false,
				tool: {
					pencil: {
						size: 2
					},
					eraser: {
						size: 10
					}
				},
				color: {
					"h": 0,
					"s": 0,
					"b": 0
				},
				colors: [{ "h": 300, "s": 0, "b": 0 }, { "h": 300, "s": 0, "b": 100 }, { "h": 0, "s": 100, "b": 100 }, { "h": 120, "s": 100, "b": 100 }, { "h": 240, "s": 100, "b": 100 }, { "h": 60, "s": 100, "b": 100 }, { "h": 180, "s": 100, "b": 100 }, { "h": 300, "s": 100, "b": 100 }],
				adjust: { x: 0, y: 0 },
				history: {
					undo: [],
					redo: []
				},
				canvas: false,
				drawingboard: false,
				cursor: false,
				toolbox: false,
				palette: false,
				colorpicker: false,
				alertwindow: false,
				alertwindow_id: false,
				customCursor: true,
				customCursorDot: true,
				carefulAction: false,
				colorpickerImmediately: false,
				mousePos: { x: 0, y: 0 },
				onReady: function () { },
				onChange: function () { },
				onSave: function () { },
				onLoad: function () { }
			},
			makeTimeline = function (kdr) {
				var count = prompt("타임라인을 몇 단계로 만드시겠습니까?", 5);
				if (!count || count <= 0 || isNaN(count)) return;
				var timeline = [];
				var history = $(kdr).data("data").history.undo;
				if (false && count > history.length) {
					alert("타임라인을 만들기에는 기록이 너무 짧습니다.\n개수를 다시 설정해주세요.");
					return;
				}
				var interv = Math.ceil(history.length / (count * 1 + 1));
				$(kdr).find(".kdrawing_timeline").empty();
				var ii = 0;
				for (var i = interv; i < history.length; i += interv) {
					timeline.push(history[i]);
					$(kdr).find(".kdrawing_timeline").append('<img src="' + history[i] + '" width="100" />');
					ii++;
				}
			},
			fadeAlert = function (kdr, text, autoout) {
				autoout = typeof autoout !== 'undefined' ? autoout : true;
				var fadealert = $(kdr).find(".kdrawing_fadealert");
				fadealert.text(text);
				if (autoout) fadealert.stop(true, true).fadeIn(100).delay(500).fadeOut(100);
				else fadealert.stop(true, true).fadeIn(100);
				return;
			},
			alertWindow = function (kdr, opt) {
				if ($(kdr).data("data").alertwindow_id) {
					$(kdr).data("data").alertwindow.stop(true, true).fadeIn(100).fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100);
					return;
				}
				if (!opt) return;
				$(kdr).data("data").alertwindow_id = opt.id;
				var alertwindow = $(kdr).data("data").alertwindow;
				alertwindow.show();
				alertwindow.find(".kdrawing_alertwindow_form").hide();
				alertwindow.find(".kdrawing_alertwindow_" + opt.id).show();
				alertwindow.find("form").off("submit");
				alertwindow.find("form").on("submit", function (e) {
					e.preventDefault();
					var submitReturn = false;
					if (opt.onSubmit) {
						var paramObj = {};
						$.each($(this).serializeArray(), function (_, kv) {
							paramObj[kv.name] = kv.value;
						});
						submitReturn = opt.onSubmit.apply($(this), [paramObj]);
					}
					if (!submitReturn) alertWindowClose(kdr);
				});
				switch (opt.id) {
					case "size":
						if (opt.width) alertwindow.find(".kdrawing_alertwindow_size input[name='width']").val(opt.width);
						if (opt.height) alertwindow.find(".kdrawing_alertwindow_size input[name='height']").val(opt.height);
						break;
					case "alert":
						if (opt.text) alertwindow.find(".kdrwaing_alertwindow_text").html(opt.text);
						break;
				}
			},
			alertWindowClose = function (kdr) {
				var alertwindow = $(kdr).data("data").alertwindow;
				$(kdr).data("data").alertwindow_id = false;
				alertwindow.hide();
			},
			setCanvasSize = function (kdr, width, height) {
				if (isNaN(width) || isNaN(height) || !width || width < 50 || width > 1280 || !height || height < 50 || height > 1600) { alert("50px 이상, 가로 1280px 이하, 세로 1600px 이하로 입력해주세요."); return false }
				$(kdr).data("data").width = width;
				$(kdr).data("data").height = height;
				$(kdr).data("data").drawingboard.css({ "width": width, "height": height });
				var canvas = $(kdr).data("data").canvas.get(0);
				canvas.width = width,
					canvas.height = height;
				//$(kdr).find(".kdrawing_canvas").width(width).height(height);
				return true;
			},
			newCanvas = function (kdr, doNotClearHistory) {
				if (!doNotClearHistory) {
					$(kdr).data("data").history.undo = [];
					$(kdr).data("data").history.redo = [];
				}
				$(kdr).find(".kdrawing_timeline").empty();
				var canvas = $(kdr).data("data").canvas.get(0);
				var ctx = canvas.getContext("2d");
				ctx.fillStyle = "#FFF";
				ctx.fillRect(0, 0, canvas.width, canvas.height);
			},
			addToPalette = function (kdr, col) {
				var palette = $(kdr).data("data").palette.find(".kdrawing_palette_colors");
				palette.append($("<li />").css({ "background-color": "#" + hsbToHex(col) }));
				$(kdr).data("data").colors.push(col);
			},
			loadPalette = function (kdr) {
				var colors = $(kdr).data("data").colors;
				clearPalette(kdr);
				for (var i in colors) {
					addToPalette(kdr, colors[i]);
				}
			},
			clearPalette = function (kdr) {
				$(kdr).data("data").palette.find(".kdrawing_palette_colors li").remove();
				$(kdr).data("data").colors = [];
			},
			setCursor = function (kdr) {
				if (!$(kdr).data("data").customCursor) return;
				var drawingboard = $(kdr).data("data").drawingboard;
				var cursor = $(kdr).data("data").cursor;
				var cursor_inner = cursor.find(".kdrawing_cursor_inner");
				var cursor_icon = cursor.find(".kdrawing_cursor_icon");
				var color = hsbToHex($(kdr).data("data").color);

				var cursor_pos = { top: cursor.css("top"), left: cursor.css("left") };

				drawingboard.removeClass().addClass("kdrawing_drawingboard");
				cursor.hide().attr("style", "").css({ "top": cursor_pos.top, "left": cursor_pos.left });
				cursor_inner.hide().attr("style", "");
				cursor_icon.hide().attr("style", "").removeClass().addClass("kdrawing_cursor_icon");

				var tool_id = $(kdr).data("data").tool_id;
				var tool = $(kdr).data("data").tool[$(kdr).data("data").tool_id];

				switch (tool_id) {
					case "pencil":
						if (tool.size == 1) {
							if ($(kdr).data("data").customCursorDot) drawingboard.addClass("kdrawing_crosshaircursor");
						} else {
							drawingboard.addClass("kdrawing_disablecursor");
							cursor.show().css({ 'width': tool.size, 'height': tool.size, 'border-width': 1, 'border-style': 'solid', 'border-color': "black", "border-radius": "50%" });
							cursor_inner.show().css({ "top": 0, "left": 0, "right": 0, "bottom": 0, 'border-width': 1, 'border-style': 'solid', 'border-color': "white", "border-radius": "50%" });
						}
						cursor_icon.hide().removeClass().addClass("kdrawing_cursor_icon");
						break;
					case "paint":
					case "line":
						drawingboard.addClass("kdrawing_disablecursor");
						cursor.show().css({ 'width': 4, 'height': 4, 'margin': '3px 0 0 3px', 'border-width': '2px 0 0 2px', 'border-style': 'solid', 'border-color': "#" + color });
						cursor_icon.show().addClass("kdrawing_cursor_icon_" + tool_id);
						break;
					case "eraser":
						drawingboard.addClass("kdrawing_disablecursor");
						cursor.show().css({ 'width': tool.size, 'height': tool.size, 'border-width': 1, 'border-style': 'solid', 'border-color': "black", "border-radius": "50%" });
						cursor_inner.show().css({ "top": 0, "left": 0, "right": 0, "bottom": 0, 'border-width': 1, 'border-style': 'solid', 'border-color': "white", "border-radius": "50%" });
						cursor_icon.hide().removeClass().addClass("kdrawing_cursor_icon");
						break;
					case "eyedropper":
						drawingboard.addClass("kdrawing_disablecursor");
						//cursor.show().css({'width': 4, 'height': 4, 'border-width': '2px 0 0 2px', 'border-style': 'solid', 'border-color': "#000"});
						cursor_icon.show().addClass("kdrawing_cursor_icon_eyedropper");
						break;
				}
			},
			setToolColor = function (kdr, col) {
				if (typeof col == 'string') {
					col = hexToHsb(col);
				} else if (col.r != undefined && col.g != undefined && col.b != undefined) {
					col = rgbToHsb(col);
				} else if (col.h != undefined && col.s != undefined && col.b != undefined) {
					col = fixHSB(col);
				} else {
					col = defaults.color;
				}
				var toolbox = $(kdr).data("data").toolbox;
				//$(kdr).data("data").tool[$(kdr).data("data").tool_id].color = hsbToHex(col);
				toolbox.find(".kdrawing_toolbox_system .kdrawing_toolbox_color").css("background-color", "#" + hsbToHex(col));
				$(kdr).data("data").color = col;
				setOption(kdr);
			},
			setToolSize = function (kdr, size) {
				if (!$(kdr).data("data").tool_id || $(kdr).data("data").toolbox.find(".kdrawing_toolbox_size_text").is(':hidden') || isNaN(size)) return;
				if (size > 100) size = 100;
				if (size < 1) size = 1;
				$(kdr).data("data").toolbox.find(".kdrawing_toolbox_size_bar, .kdrawing_toolbox_size_text").val(size);
				$(kdr).data("data").tool[$(kdr).data("data").tool_id].size = size;
				setCursor(kdr);
			},
			setOption = function (kdr) {

				var canvas = $(kdr).data("data").canvas.get(0);
				var ctx = canvas.getContext("2d");
				var toolbox = $(kdr).data("data").toolbox;
				var color = hsbToHex($(kdr).data("data").color);

				toolbox.find(".kdrawing_toolbox_option div").hide();

				var tool_id = $(kdr).data("data").tool_id;
				var tool = $(kdr).data("data").tool[$(kdr).data("data").tool_id];
				switch (tool_id) {
					case "pencil":
					case "line":
						toolbox.find(".kdrawing_toolbox_option .kdrawing_toolbox_size").show().find("input").val(tool.size);
						//toolbox.find(".kdrawing_toolbox_option .kdrawing_toolbox_color").show().css("background-color", "#"+color);
						ctx.fillStyle = color ? "#" + color : "#000";
						break;
					case "paint":
					case "eyedropper":
						//toolbox.find(".kdrawing_toolbox_option .kdrawing_toolbox_color").show().css("background-color", "#"+color);
						ctx.fillStyle = color ? "#" + color : "#000";
						break;
					case "eraser":
						toolbox.find(".kdrawing_toolbox_option .kdrawing_toolbox_size").show().find("input").val(tool.size);
						ctx.fillStyle = "#FFF";
						break;
				}
				setCursor(kdr);
			},
			clickTool = function (kdr, id) {
				//console.log($(kdr).data("data"));
				switch (id) {
					case "new":
						/*
						var width = prompt("새 가로 px을 입력하세요 (840px 이하):", 413);
						if(!width) return false;
						var height = prompt("새 세로 px을 입력하세요 (1600px 이하):", 257);
						if(!height) return false;
						*/
						var canvas = $(kdr).data("data").canvas.get(0);
						var ctx = canvas.getContext("2d");
						alertWindow(kdr, {
							id: "size", "width": canvas.width, "height": canvas.height, "onSubmit": function (data) {
								if (data.keep) { var tempCanvas = $(kdr).data("data").canvas.get(0).toDataURL(); }
								if (setCanvasSize(kdr, data.width, data.height)) {
									if (data.keep) {
										newCanvas(kdr, true);
										var image = new Image();
										image.src = tempCanvas;
										image.onload = function () {
											ctx.drawImage(image, 0, 0);
										};
									} else {
										newCanvas(kdr);
									}
									setTool(kdr, $(kdr).data("data").tool_id);
									return false;
								} else {
									return true;
								}
							}
						});
						$(kdr).data("data").alertwindow.find("input:visible:eq(0)").focus();
						break;
					case "undo":
					case "redo":
						var canvas = $(kdr).data("data").canvas.get(0);
						var ctx = canvas.getContext("2d");

						var org_id = id;
						var invert_id = id == "undo" ? "redo" : "undo";

						var history_org = $(kdr).data("data").history[org_id];
						if (!history_org.length) return;
						var invert_history = $(kdr).data("data").history[invert_id];
						var image = new Image();
						image.src = history_org.pop();
						invert_history.push(canvas.toDataURL());
						image.onload = function () {
							ctx.drawImage(image, 0, 0);
							$(kdr).data("data").onChange.apply($(kdr).parent(), [$(kdr).data("data").canvas.get(0).toDataURL(), $(kdr).data("data")]);
						};
						//$(kdr).data();
						//$(kdr).data("history_"+invert_id, invert_history);
						break;
					case "save":
						if ($(kdr).data("data").carefulAction) {
							var con = confirm("저장하시겠습니까?");
							if (!con) return;
						}
						$(kdr).data("data").onSave.apply($(kdr).parent(), [$(kdr).data("data").canvas.get(0).toDataURL(), jQuery.extend(true, {}, $(kdr).data("data"))]);
						break;
					case "load":
						if ($(kdr).data("data").carefulAction) {
							var con = confirm("불러오시겠습니까?");
							if (!con) return;
						}
						try {
							fadeAlert(kdr, "불러오는 중...", false);
							$(kdr).data("data").onLoad(function (data) {
								console.log(data);
								//if (data.)
								//var loadData = $(kdr).data("data").onLoad.apply();
								//$(kdr).data("data", $.extend({}, $(kdr).data("data"), loadData.data||{}));
								var loadData = data;
								$(kdr).data("data", $.extend({}, $(kdr).data("data"), loadData.data || {}));
								var options = $(kdr).data("data");
								setCanvasSize(kdr, options.width, options.height); //캔버스 크기 지정
								newCanvas(kdr, true); //캔버스 흰배경 칠하기
								var canvas = $(kdr).data("data").canvas.get(0);
								var ctx = canvas.getContext("2d");
								var image = new Image();
								image.src = loadData.url;
								image.onload = function () {
									ctx.drawImage(image, 0, 0);
									fadeAlert(kdr, "불러오기 완료.");
									$(kdr).data("data").onChange.apply($(kdr), [$(kdr).data("data").canvas.get(0).toDataURL(), $(kdr).data("data")]);
								};
								image.onerror = function () {
									fadeAlert(kdr, "불러오기 실패");
									alert("저장 내용이 올바르지 않아 그림 불러오기에 실패했습니다.");
								};
								loadPalette(kdr);
								setTool(kdr, (options.tool_id ? options.tool_id : defaults.tool_id));
								setToolColor(kdr, (options.color ? options.color : defaults.color));
							});
						} catch (e) {
							prompt("불러오는 중 오류가 발생했습니다.\n아래 내용을 복사해서 문의해주세요.\n", e.message + " / " + JSON.stringify(loadData));
						}
						break;
					case "timeline":
						makeTimeline(kdr);
						break;
					default:
						setTool(kdr, id);
						break;
				}
			},
			setTool = function (kdr, id) {
				$(kdr).data("data").tool_id = id;
				if (!$(kdr).data("data").tool[id]) $(kdr).data("data").tool[id] = { size: 1 };
				var tool = $(kdr).data("data").tool[$(kdr).data("data").tool_id];
				var toolbox = $(kdr).data("data").toolbox;
				setOption(kdr);
				toolbox.find(".kdrawing_toolbox_tools li.kdrawing_toolbox_tool").removeClass("selected");
				toolbox.find(".kdrawing_toolbox_" + id).parent("li").addClass("selected");
			},
			saveAction = function (kdr) {
				var canvas = $(kdr).data("data").canvas.get(0);
				$(kdr).data("data").history.undo.push(canvas.toDataURL());
				if ($(kdr).data("data").history.undo.length > 100) $(kdr).data("data").history.undo = $(kdr).data("data").history.undo.slice(-100);
				$(kdr).data("data").history.redo = [];
			},
			doAction = function (kdr, x, y, eventType) {
				//console.log(eventType);
				var adjust = $(kdr).data("data").adjust;
				x += adjust.x;
				y += adjust.y;
				switch ($(kdr).data("data").tool_id) {
					case "pencil":
					case "eraser":
						if (eventType == "mousedown") saveAction(kdr);
						draw(kdr, x, y, (eventType == "mouseenter" || eventType == "mousedown" ? true : false));
						break;
					case "line":
						if (eventType == "mousedown") {
							saveAction(kdr);
							draw(kdr, x, y, true);
						} else if (eventType == "mouseup" || eventType == "mouseleave") {
							draw(kdr, x, y);
						}
						break;
					case "paint":
						if (eventType == "mousedown") saveAction(kdr);
						paint(kdr, x, y);
						break;
					case "eyedropper":
						colorpick(kdr, x, y);
						break;
					case "hand":
						if (eventType == "mousedown") {
							$("body").addClass('clicked');
							$(kdr).data("data").last.x = x;
							$(kdr).data("data").last.y = y;
						} else if (eventType == "mouseup") {
							$("body").removeClass('clicked');
						} else if (eventType == "mousemove") {
							if ($("body").hasClass('clicked')) {
								$(window).scrollTop($(window).scrollTop() + ($(kdr).data("data").last.y - y));
								$(window).scrollLeft($(window).scrollLeft() + ($(kdr).data("data").last.x - x));
							}
						}
						break;
				}
				$(kdr).data("data").onChange.apply($(kdr), [$(kdr).data("data").canvas.get(0).toDataURL(), $(kdr).data("data")]);
			},
			draw = function (kdr, x, y, down) {
				var lastX = $(kdr).data("data").last.x;
				var lastY = $(kdr).data("data").last.y;
				$(kdr).data("data").last.x = x;
				$(kdr).data("data").last.y = y;

				if (down) {
					draw_(kdr, x, y);
				} else {
					// find all points between
					var x1 = x,
						x2 = lastX,
						y1 = y,
						y2 = lastY;


					var steep = (Math.abs(y2 - y1) > Math.abs(x2 - x1));
					if (steep) {
						var x = x1;
						x1 = y1;
						y1 = x;

						var y = y2;
						y2 = x2;
						x2 = y;
					}
					if (x1 > x2) {
						var x = x1;
						x1 = x2;
						x2 = x;

						var y = y1;
						y1 = y2;
						y2 = y;
					}

					var dx = x2 - x1,
						dy = Math.abs(y2 - y1),
						error = 0,
						de = dy / dx,
						yStep = -1,
						y = y1;

					if (y1 < y2) {
						yStep = 1;
					}

					for (var x = x1; x <= x2; x++) {
						if (steep) {
							draw_(kdr, y, x);
						} else {
							draw_(kdr, x, y);
						}

						error += de;
						if (error >= 0.5) {
							y += yStep;
							error -= 1.0;
						}
					}
				}
			},
			draw_ = function (kdr, x, y) {
				var canvas = $(kdr).data("data").canvas.get(0);
				var ctx = canvas.getContext("2d");
				var tool_size = $(kdr).data("data").tool[$(kdr).data("data").tool_id].size;
				if (tool_size == 1) {
					ctx.fillRect(x, y, 1, 1);
				} else {
					ctx.beginPath();
					ctx.arc(x, y, tool_size / 2, 0, 2 * Math.PI);
					ctx.fill();
				}
				/*
				o.ctx.beginPath();
				o.ctx.arc(x, y, o.lineThickness/2, 0, 2*Math.PI);
				o.ctx.fill();
				*/
			},
			paint = function (kdr, x, y) {
				var canvas = $(kdr).data("data").canvas.get(0);
				var ctx = canvas.getContext("2d");
				var colorLayerData = ctx.getImageData(0, 0, canvas.width, canvas.height);
				var pixelPos = (y * canvas.width + x) * 4;
				var curColor = hsbToRgb($(kdr).data("data").color);
				var r = colorLayerData.data[pixelPos],
					g = colorLayerData.data[pixelPos + 1],
					b = colorLayerData.data[pixelPos + 2],
					a = colorLayerData.data[pixelPos + 3];
				if (r === curColor.r && g === curColor.g && b === curColor.b) return;
				paint_(kdr, x, y, r, g, b, colorLayerData, curColor);
			},
			paint_ = function (kdr, startX, startY, startR, startG, startB, colorLayerData, curColor) {
				var canvas = $(kdr).data("data").canvas.get(0);
				var ctx = canvas.getContext("2d");
				var newPos,
					x,
					y,
					pixelPos,
					reachLeft,
					reachRight,
					canvasWidth = canvas.width,
					canvasHeight = canvas.height,
					drawingBoundLeft = 0,
					drawingBoundTop = 0,
					drawingBoundRight = canvasWidth - 1,
					drawingBoundBottom = canvasHeight - 1,
					pixelStack = [[startX, startY]];

				while (pixelStack.length) {
					newPos = pixelStack.pop();
					x = newPos[0];
					y = newPos[1];

					// Get current pixel position
					pixelPos = (y * canvasWidth + x) * 4;

					// Go up as long as the color matches and are inside the canvas
					while (y >= drawingBoundTop && paint_matchStartColor(pixelPos, startR, startG, startB, colorLayerData, curColor)) {
						y -= 1;
						pixelPos -= canvasWidth * 4;
					}

					pixelPos += canvasWidth * 4;
					y += 1;
					reachLeft = false;
					reachRight = false;

					// Go down as long as the color matches and in inside the canvas
					while (y <= drawingBoundBottom && paint_matchStartColor(pixelPos, startR, startG, startB, colorLayerData, curColor)) {
						//y += 1;

						colorPixel(pixelPos, curColor.r, curColor.g, curColor.b, undefined, colorLayerData);

						if (x > drawingBoundLeft) {
							if (paint_matchStartColor(pixelPos - 4, startR, startG, startB, colorLayerData, curColor)) {
								if (!reachLeft) {
									// Add pixel to stack
									pixelStack.push([x - 1, y]);
									reachLeft = true;
								}
							} else if (reachLeft) {
								reachLeft = false;
							}
						}

						if (x < drawingBoundRight) {
							if (paint_matchStartColor(pixelPos + 4, startR, startG, startB, colorLayerData, curColor)) {
								if (!reachRight) {
									// Add pixel to stack
									pixelStack.push([x + 1, y]);
									reachRight = true;
								}
							} else if (reachRight) {
								reachRight = false;
							}
						}

						pixelPos += canvasWidth * 4;
						y += 1;
					}
				}
				ctx.fillStyle = "#FFF";
				ctx.fillRect(0, 0, canvas.width, canvas.height);

				// Draw the current state of the color layer to the canvas
				ctx.putImageData(colorLayerData, 0, 0);
			},
			paint_matchStartColor = function (pixelPos, startR, startG, startB, colorLayerData, curColor) {

				r = colorLayerData.data[pixelPos];
				g = colorLayerData.data[pixelPos + 1];
				b = colorLayerData.data[pixelPos + 2];

				// If the current pixel matches the clicked color
				if (r === startR && g === startG && b === startB) {
					return true;
				}
				// If current pixel matches the new color
				if (r === curColor.r && g === curColor.g && b === curColor.b) {
					return false;
				}

				return false;
			},
			colorPixel = function (pixelPos, r, g, b, a, colorLayerData) {
				colorLayerData.data[pixelPos] = r;
				colorLayerData.data[pixelPos + 1] = g;
				colorLayerData.data[pixelPos + 2] = b;
				colorLayerData.data[pixelPos + 3] = a !== undefined ? a : 255;
			},
			colorpick = function (kdr, x, y) {
				var canvas = $(kdr).data("data").canvas.get(0);
				var ctx = canvas.getContext("2d");
				var color = ctx.getImageData(x, y, 1, 1).data;
				setToolColor(kdr, rgbToHsb({ r: color[0], g: color[1], b: color[2] }));
			},
			addDragging = function (e) {
				e.preventDefault();
				$(this).parent(".kdrawing_draggable").addClass("dragging").data("top", e.offsetY).data("left", e.offsetX);
			},
			getWindow = function (id, tpl, top, left) {
				var kdr_window = $(tpl).attr('id', 'kdrawing_' + id);
				kdr_window.find(".kdrawing_draggable_handle").on("mousedown", addDragging);
				kdr_window.offset({ "top": top, "left": left });
				return kdr_window;
			},
			colorpicker_fillRGBFields = function (hsb, cal) {
				var rgb = hsbToRgb(hsb);
				$(cal).data('colorpicker').fields
					.eq(3).val(rgb.r).end()
					.eq(4).val(rgb.g).end()
					.eq(5).val(rgb.b).end();
			},
			colorpicker_fillHSBFields = function (hsb, cal) {
				$(cal).data('colorpicker').fields
					.eq(0).val(Math.round(hsb.h)).end()
					.eq(1).val(Math.round(hsb.s)).end()
					.eq(2).val(Math.round(hsb.b)).end();
			},
			colorpicker_fillHexFields = function (hsb, cal) {
				$(cal).data('colorpicker').fields.eq(6).val(hsbToHex(hsb));
			},
			colorpicker_setSelector = function (hsb, cal) {
				$(cal).data('colorpicker').selector.css('backgroundColor', '#' + hsbToHex({ h: hsb.h, s: 100, b: 100 }));
				$(cal).data('colorpicker').selectorIndic.css({
					left: parseInt($(cal).data('colorpicker').height * hsb.s / 100, 10),
					top: parseInt($(cal).data('colorpicker').height * (100 - hsb.b) / 100, 10)
				});
			},
			colorpicker_setHue = function (hsb, cal) {
				$(cal).data('colorpicker').hue.css('top', parseInt($(cal).data('colorpicker').height - $(cal).data('colorpicker').height * hsb.h / 360, 10));
			},
			colorpicker_setCurrentColor = function (hsb, cal) {
				$(cal).data('colorpicker').currentColor.css('backgroundColor', '#' + hsbToHex(hsb));
			},
			colorpicker_setNewColor = function (hsb, cal) {
				$(cal).data('colorpicker').newColor.css('backgroundColor', '#' + hsbToHex(hsb));
			},
			colorpicker_change = function (e) {
				var cal = $(this).parents(".kdrawing_colorpicker"), col;
				if (this.parentNode.className.indexOf('_hex') > 0) {
					cal.data('colorpicker').color = col = hexToHsb(fixHex(this.value));
					colorpicker_fillRGBFields(col, cal.get(0));
					colorpicker_fillHSBFields(col, cal.get(0));
				} else if (this.parentNode.className.indexOf('_hsb') > 0) {
					cal.data('colorpicker').color = col = fixHSB({
						h: parseInt(cal.data('colorpicker').fields.eq(0).val(), 10),
						s: parseInt(cal.data('colorpicker').fields.eq(1).val(), 10),
						b: parseInt(cal.data('colorpicker').fields.eq(2).val(), 10)
					});
					colorpicker_fillRGBFields(col, cal.get(0));
					colorpicker_fillHexFields(col, cal.get(0));
				} else {
					cal.data('colorpicker').color = col = rgbToHsb(fixRGB({
						r: parseInt(cal.data('colorpicker').fields.eq(3).val(), 10),
						g: parseInt(cal.data('colorpicker').fields.eq(4).val(), 10),
						b: parseInt(cal.data('colorpicker').fields.eq(5).val(), 10)
					}));
					colorpicker_fillHexFields(col, cal.get(0));
					colorpicker_fillHSBFields(col, cal.get(0));
				}
				colorpicker_setSelector(col, cal.get(0));
				colorpicker_setHue(col, cal.get(0));
				colorpicker_setNewColor(col, cal.get(0));
				cal.data('colorpicker').onChange.apply(cal.parent(), [col]);
			},
			colorpicker_downHue = function (e) {
				e.preventDefault ? e.preventDefault() : e.returnValue = false;
				var current = {
					cal: $(this).parents(".kdrawing_colorpicker"),
					y: $(this).offset().top
				};
				$(document).on('mouseup touchend', current, colorpicker_upHue);
				$(document).on('mousemove touchmove', current, colorpicker_moveHue);

				var pageY = ((e.type == 'touchstart') ? e.originalEvent.changedTouches[0].pageY : e.pageY);

				//current.cal.data('colorpicker').value.h = parseInt(360*(current.cal.data('colorpicker').height - (pageY - current.y))/current.cal.data('colorpicker').height, 10);
				colorpicker_change.apply(
					current.cal.data('colorpicker')
						.fields.eq(0).val(parseInt(360 * (current.cal.data('colorpicker').height - (pageY - current.y)) / current.cal.data('colorpicker').height, 10))
						.get(0)
				);

				return false;
			},
			colorpicker_moveHue = function (e) {
				var pageY = ((e.type == 'touchmove') ? e.originalEvent.changedTouches[0].pageY : e.pageY);

				//e.data.cal.data('colorpicker').value.h = parseInt(360*(e.data.cal.data('colorpicker').height - (pageY - e.data.y))/e.data.cal.data('colorpicker').height, 10);
				colorpicker_change.apply(
					e.data.cal.data('colorpicker')
						.fields.eq(0).val(parseInt(360 * (e.data.cal.data('colorpicker').height - Math.max(0, Math.min(e.data.cal.data('colorpicker').height, (pageY - e.data.y)))) / e.data.cal.data('colorpicker').height, 10))
						.get(0)
				);

				return false;
			},
			colorpicker_upHue = function (e) {
				colorpicker_fillRGBFields(e.data.cal.data('colorpicker').color, e.data.cal.get(0));
				colorpicker_fillHexFields(e.data.cal.data('colorpicker').color, e.data.cal.get(0));
				$(document).off('mouseup touchend', colorpicker_upHue);
				$(document).off('mousemove touchmove', colorpicker_moveHue);
				return false;
			},
			colorpicker_downSelector = function (e) {
				e.preventDefault ? e.preventDefault() : e.returnValue = false;
				var current = {
					cal: $(this).parents(".kdrawing_colorpicker"),
					pos: $(this).offset()
				};

				$(document).on('mouseup touchend', current, colorpicker_upSelector);
				$(document).on('mousemove touchmove', current, colorpicker_moveSelector);

				var payeX, pageY;
				if (e.type == 'touchstart') {
					pageX = e.originalEvent.changedTouches[0].pageX,
						pageY = e.originalEvent.changedTouches[0].pageY;
				} else {
					pageX = e.pageX;
					pageY = e.pageY;
				}

				//current.cal.data('colorpicker').value.s = parseInt(100*(pageX - current.pos.left)/current.cal.data('colorpicker').height, 10);
				//current.cal.data('colorpicker').value.b = parseInt(100*(current.cal.data('colorpicker').height - (pageY - current.pos.top))/current.cal.data('colorpicker').height, 10);
				colorpicker_change.apply(
					current.cal.data('colorpicker').fields
						.eq(2).val(parseInt(100 * (current.cal.data('colorpicker').height - (pageY - current.pos.top)) / current.cal.data('colorpicker').height, 10)).end()
						.eq(1).val(parseInt(100 * (pageX - current.pos.left) / current.cal.data('colorpicker').height, 10))
						.get(0)
				);
				return false;
			},
			colorpicker_moveSelector = function (e) {
				var payeX, pageY;
				if (e.type == 'touchmove') {
					pageX = e.originalEvent.changedTouches[0].pageX,
						pageY = e.originalEvent.changedTouches[0].pageY;
				} else {
					pageX = e.pageX;
					pageY = e.pageY;
				}

				//e.data.cal.data('colorpicker').value.s = parseInt(100*(pageX - e.data.pos.left)/e.data.cal.data('colorpicker').height, 10);
				//e.data.cal.data('colorpicker').value.b = parseInt(100*(e.data.cal.data('colorpicker').height - (pageY - e.data.pos.top))/e.data.cal.data('colorpicker').height, 10);
				colorpicker_change.apply(
					e.data.cal.data('colorpicker').fields
						.eq(2).val(parseInt(100 * (e.data.cal.data('colorpicker').height - Math.max(0, Math.min(e.data.cal.data('colorpicker').height, (pageY - e.data.pos.top)))) / e.data.cal.data('colorpicker').height, 10)).end()
						.eq(1).val(parseInt(100 * (Math.max(0, Math.min(e.data.cal.data('colorpicker').height, (pageX - e.data.pos.left)))) / e.data.cal.data('colorpicker').height, 10))
						.get(0)
				);

				return false;
			},
			colorpicker_upSelector = function (e) {
				colorpicker_fillRGBFields(e.data.cal.data('colorpicker').color, e.data.cal.get(0));
				colorpicker_fillHexFields(e.data.cal.data('colorpicker').color, e.data.cal.get(0));
				$(document).off('mouseup touchend', colorpicker_upSelector);
				$(document).off('mousemove touchmove', colorpicker_moveSelector);
				return false;
			},
			fixHSB = function (hsb) {
				return {
					h: Math.min(360, Math.max(0, hsb.h)),
					s: Math.min(100, Math.max(0, hsb.s)),
					b: Math.min(100, Math.max(0, hsb.b))
				};
			},
			fixRGB = function (rgb) {
				return {
					r: Math.min(255, Math.max(0, rgb.r)),
					g: Math.min(255, Math.max(0, rgb.g)),
					b: Math.min(255, Math.max(0, rgb.b))
				};
			},
			fixHex = function (hex) {
				var len = 6 - hex.length;
				if (len > 0) {
					var o = [];
					for (var i = 0; i < len; i++) {
						o.push('0');
					}
					o.push(hex);
					hex = o.join('');
				}
				return hex;
			},
			colorpicker_setColor = function (kdr_colorpicker, col, setCurrent) {
				setCurrent = (typeof setCurrent === "undefined") ? 1 : setCurrent;
				if (typeof col == 'string') {
					col = hexToHsb(col);
				} else if (col.r != undefined && col.g != undefined && col.b != undefined) {
					col = rgbToHsb(col);
				} else if (col.h != undefined && col.s != undefined && col.b != undefined) {
					col = fixHSB(col);
				} else {
					return false;
				}
				//if ($(kdr_colorpicker).data('colorpicker')) {
				var cal = $(kdr_colorpicker);
				cal.data('colorpicker').color = col;
				//cal.data('colorpicker').origColor = col;
				colorpicker_fillRGBFields(col, cal.get(0));
				colorpicker_fillHSBFields(col, cal.get(0));
				colorpicker_fillHexFields(col, cal.get(0));
				colorpicker_setHue(col, cal.get(0));
				colorpicker_setSelector(col, cal.get(0));

				colorpicker_setNewColor(col, cal.get(0));
				//cal.data('colorpicker').onChange.apply(cal.parent(), [col, hsbToHex(col), hsbToRgb(col), cal.data('colorpicker').el, 1]);
				if (setCurrent) {
					colorpicker_setCurrentColor(col, cal.get(0));
				}
				//}
			},
			colorpicker_clickSubmit = function (e) {
				e.preventDefault();
				var cal = $(this).parents(".kdrawing_colorpicker");
				var col = cal.data('colorpicker').color;
				cal.data('colorpicker').onSubmit(col);
			}
			;
		return {
			init: function (opt) {
				opt = $.extend({}, defaults, opt || {});
				if (typeof opt.color == 'string') {
					opt.color = hexToHsb(opt.color);
				} else if (opt.color.r != undefined && opt.color.g != undefined && opt.color.b != undefined) {
					opt.color = rgbToHsb(opt.color);
				} else if (opt.color.h != undefined && opt.color.s != undefined && opt.color.b != undefined) {
					opt.color = fixHSB(opt.color);
				} else {
					return this;
				}

				//For each selected DOM element
				return this.each(function () {
					if (!$(this).data('kdrawingId')) {
						var options = $.extend({}, opt);
						var id = parseInt(Math.random() * 1000);
						var kdr_id = 'kdrawing_' + id;
						$(this).data('kdrawingId', kdr_id);
						var kdr = $(tpl).attr('id', kdr_id);

						options.canvas = $(kdr).find(".kdrawing_canvas");
						options.cursor = $(kdr).find(".kdrawing_cursor");
						options.drawingboard = $(kdr).find(".kdrawing_drawingboard");
						$(kdr).find(".kdrawing_cover").on("contextmenu", function () { return false; });

						kdr.find(".kdrawing_cover").on("mouseenter", function (e) {
							$(kdr).addClass("mouseenter");
							if ($(kdr).hasClass("mousedown")) doAction($(kdr).get(0), e.offsetX, e.offsetY, e.type);
						}).on("mouseleave", function (e) {
							$(kdr).removeClass("mouseenter");
							if ($(kdr).hasClass("mousedown")) doAction($(kdr).get(0), e.offsetX, e.offsetY, e.type);
						}).on("mousedown", function (e) {
							e.preventDefault();
							$(":focus").blur();
							$(kdr).addClass("mousedown");
							if ($(kdr).hasClass("mousedown") && $(kdr).hasClass("mouseenter")) {
								if (e.which == 2 || e.which == 3) {
									$(kdr).data("data").tool_id_org = $(kdr).data("data").tool_id;
									setTool(kdr, "eraser");
								}
								/*
								var tool_id = $(kdr).data("data").tool_id;
								if(tool_id == "pencil" || tool_id == "eraser" || tool_id == "paint") saveAction(kdr);
								*/
								doAction($(kdr).get(0), e.offsetX, e.offsetY, e.type);
							}
						}).on("mousemove", function (e) {
							if ($(kdr).hasClass("mousedown") && $(kdr).hasClass("mouseenter")) doAction($(kdr).get(0), e.offsetX, e.offsetY, e.type);
						}).on("mouseup", function (e) {
							if ($(kdr).data("data").tool_id == "line") doAction($(kdr).get(0), e.offsetX, e.offsetY, e.type);
						});
						$("body").on("mouseup", function () {
							$(".kdrawing_draggable").removeClass("dragging");
							$(kdr).removeClass("mousedown");
							if ($(kdr).data("data").tool_id_org) {
								setTool(kdr, $(kdr).data("data").tool_id_org);
								$(kdr).data("data").tool_id_org = false;
							}
						}).on("mousemove", function (e) {
							$(kdr).data("data").mousePos = { x: e.pageX, y: e.pageY };
							$(".kdrawing_draggable.dragging").each(function (index, element) {
								$(this).css({ "top": e.pageY - $(this).data("top"), "left": e.pageX - $(this).data("left") });
							});
							var container_offset = options.drawingboard.offset();
							options.cursor.css({
								"top": e.pageY - container_offset.top - (options.cursor.height() / 2) - 3,
								"left": e.pageX - container_offset.left - (options.cursor.width() / 2) - 3
							});
						}).on("keydown", function (e) {
							if ($(':focus').length > 0) return;
							var enter = $(kdr).hasClass("mouseenter");
							//console.log(e.keyCode, e.ctrlKey);
							switch (e.keyCode) {
								case 187: //+
								case 107:
									setToolSize(kdr, $(kdr).data("data").tool[$(kdr).data("data").tool_id].size * 1 + 1);
									break;
								case 189: //-
								case 109:
									setToolSize(kdr, $(kdr).data("data").tool[$(kdr).data("data").tool_id].size * 1 - 1);
									break;
								case 84:
									e.preventDefault();
									var mousePos = kdr.data("data").mousePos;
									kdr_toolbox.css({ "top": mousePos.y - kdr_toolbox.height() / 2, "left": mousePos.x - kdr_toolbox.width() / 2 });
									break;
								case 90:
									e.preventDefault();
									if (e.ctrlKey) clickTool(kdr, "undo");
									break;
								case 89:
									e.preventDefault();
									if (e.ctrlKey) clickTool(kdr, "redo");
									break;
								case 66:
									e.preventDefault();
									clickTool(kdr, "pencil");
									break;
								case 69:
									e.preventDefault();
									clickTool(kdr, "eraser");
									break;
								case 71:
									e.preventDefault();
									clickTool(kdr, "paint");
									break;
								case 73:
									e.preventDefault();
									clickTool(kdr, "eyedropper");
									break;
								case 85:
									e.preventDefault();
									clickTool(kdr, "line");
									break;
								case 32:
									e.preventDefault();
									if ($(kdr).data("data").tool_id != "hand") $(kdr).data("data").tool_id_org = $(kdr).data("data").tool_id;
									$('html').css('cursor', '-webkit-grab');
									clickTool(kdr, "hand");
									break;
								/*
								case 87:
								case 65:
								case 83:
								case 68:
									e.preventDefault();
									if(!e.ctrlKey){
										var adjust = $(kdr).data("data").adjust;
										if(enter && e.keyCode == 87) adjust.y -= 1;
										if(enter && e.keyCode == 65) adjust.x -= 1;
										if(enter && e.keyCode == 83) adjust.y += 1;
										if(enter && e.keyCode == 68) adjust.x += 1;
										//$(kdr).data("data").adjust = adjust;
									}
									if(e.ctrlKey && e.keyCode == 83) clickTool(kdr, "save");
									break;
								*/
								case 83:
									e.preventDefault();
									if (e.ctrlKey) clickTool(kdr, "save");
									break;
								case 49:
								case 50:
								case 51:
								case 52:
								case 53:
								case 54:
								case 55:
								case 56:
								case 57:
									var num = e.keyCode - 48;
									var paletteColor = $(kdr).data("data").palette.find(".kdrawing_palette_colors li").eq(num - 1);
									if (paletteColor.length) setToolColor(kdr, rgbToHsb(strToRgb(paletteColor.css("background-color"))));
									break;
							}
						}).on("keyup", function (e) {
							switch (e.keyCode) {
								case 32:
									if ($(kdr).data("data").tool_id_org) {
										$("body").removeClass('clicked');
										$('html').css('cursor', '');
										setTool(kdr, $(kdr).data("data").tool_id_org);
										$(kdr).data("data").tool_id_org = false;
									}
									break;
							}
						});
						kdr.appendTo(this);
						var kdr_offset = kdr.offset();
						var kdr_toolbox = getWindow("toolbox_" + id, tpl_toolbox, kdr_offset.top, kdr_offset.left + opt.width + 6);
						var kdr_palette = getWindow("palette_" + id, tpl_palette, kdr_offset.top, kdr_offset.left + opt.width + 46);
						var kdr_colorpicker = getWindow("colorpicker_" + id, tpl_colorpicker, kdr_offset.top, kdr_offset.left);
						var kdr_alertwindow = getWindow("alertwindow_" + id, tpl_alertwindow, kdr_offset.top, kdr_offset.left);

						kdr_toolbox.find(".kdrawing_toolbox_tools li.kdrawing_toolbox_tool span").click(function () {
							clickTool(kdr.get(0), $(this).data("tool"));
						});
						kdr_toolbox.find(".kdrawing_toolbox_size_bar, .kdrawing_toolbox_size_text").change(function () {
							setToolSize(kdr, parseInt($(this).val()));
							/*
							if(!$(kdr).data("data").tool_id) return;
							var value = parseInt($(this).val());
							kdr_toolbox.find(".kdrawing_toolbox_size_bar, .kdrawing_toolbox_size_text").val(value);
							//$(kdr).data("tool_size_"+$(kdr).data("tool_id"), value);
							$(kdr).data("data").tool[$(kdr).data("data").tool_id].size = value;
							setCursor(kdr);
							*/
						});
						kdr_toolbox.find(".kdrawing_toolbox_color").on("click", function () {
							if (!$(kdr).data("data").tool_id) return;
							colorpicker_setColor(kdr_colorpicker, $(kdr).data("data").color, true);
							kdr_colorpicker.data("colorpicker").onSubmit = function (col) {
								setToolColor(kdr, col);
								kdr_colorpicker.hide();
							};
							if ($(kdr).data("data").colorpickerImmediately) {
								kdr_colorpicker.data("colorpicker").onChange = function (col) {
									setToolColor(kdr, col);
								};
							}
							kdr_colorpicker.show();
						});
						kdr_toolbox.find(".kdrawing_toolbox_addpalette").on("click", function () {
							addToPalette(kdr, $(kdr).data("data").color);
						});
						kdr_palette.find(".kdrawing_palette_colors").on("mousedown", "li", function (e) {
							e.preventDefault();
							if (e.which == 2 || e.which == 3) {
								$(kdr).data("data").colors.splice($(this).index(), 1);
								$(this).remove();
							}
							else setToolColor(kdr, rgbToHsb(strToRgb($(this).css("background-color"))));
						}).on("contextmenu", function () { return false; });
						kdr_colorpicker.hide();
						var kdr_colorpicker_data = { 'height': 156, 'color': hexToHsb('FF0000'), 'onSubmit': function () { }, 'onChange': function () { } };
						kdr_colorpicker_data.fields = kdr_colorpicker.find('input').change(colorpicker_change);
						kdr_colorpicker_data.selector = kdr_colorpicker.find("div.kdrawing_colorpicker_color").on('mousedown touchstart', colorpicker_downSelector);
						kdr_colorpicker_data.selectorIndic = kdr_colorpicker_data.selector.find('div.kdrawing_colorpicker_selector_outer');
						kdr_colorpicker_data.hue = kdr_colorpicker.find('div.kdrawing_colorpicker_hue_arrs');
						kdr_colorpicker_data.newColor = kdr_colorpicker.find('div.kdrawing_colorpicker_new_color');
						kdr_colorpicker_data.currentColor = kdr_colorpicker.find('div.kdrawing_colorpicker_current_color');
						kdr_colorpicker.find('div.kdrawing_colorpicker_hue').on('mousedown touchstart', colorpicker_downHue);
						kdr_colorpicker.find('form').on("submit", colorpicker_clickSubmit);
						/*kdr_colorpicker.find('.kdrawing_colorpicker_submit').click(colorpicker_clickSubmit);*/
						kdr_colorpicker.find('.kdrawing_colorpicker_cancel').click(function () { $(kdr_colorpicker).hide(); });
						kdr_colorpicker.data('colorpicker', kdr_colorpicker_data);
						colorpicker_fillRGBFields(kdr_colorpicker_data.color, kdr_colorpicker.get(0));
						colorpicker_fillHSBFields(kdr_colorpicker_data.color, kdr_colorpicker.get(0));
						colorpicker_fillHexFields(kdr_colorpicker_data.color, kdr_colorpicker.get(0));
						colorpicker_setHue(kdr_colorpicker_data.color, kdr_colorpicker.get(0));
						colorpicker_setSelector(kdr_colorpicker_data.color, kdr_colorpicker.get(0));
						colorpicker_setCurrentColor(kdr_colorpicker_data.color, kdr_colorpicker.get(0));
						colorpicker_setNewColor(kdr_colorpicker_data.color, kdr_colorpicker.get(0));

						kdr_alertwindow.hide();
						kdr_alertwindow.find('.kdrawing_alertwindow_close').click(function () { alertWindowClose($(kdr).get(0)); });

						kdr_toolbox.appendTo("body");
						kdr_palette.appendTo("body");
						kdr_colorpicker.appendTo("body");
						kdr_alertwindow.appendTo("body");

						options.toolbox = kdr_toolbox;
						options.palette = kdr_palette;
						options.colorpicker = kdr_colorpicker;
						options.alertwindow = kdr_alertwindow;
						kdr.data('data', options);
						//console.log("kdrawing opt: ", options);

						setCanvasSize(kdr, options.width, options.height); //캔버스 크기 지정
						newCanvas(kdr); //캔버스 흰배경 칠하기
						loadPalette(kdr);
						setTool(kdr, options.tool_id);
						options.onReady.apply($(kdr).parent());
						//alertWindow(kdr.get(0), {id: "alert", "text": "저장 기능 제작 중..."});
					}
				});
			},
			getSetting: function () {
				if ($(this).data('kdrawingId')) {
					kdr = $('#' + $(this).data('kdrawingId'));
					return kdr.data("data");
				}
			},
			showAlert: function (text, onSbumit) {
				//console.log("showAlert");
				if ($(this).data('kdrawingId')) {
					kdr = $('#' + $(this).data('kdrawingId'));
					alertWindow(kdr, { "id": "alert", "text": text, "onSubmit": onSbumit });
				};
			},
			showFadeAlert: function (text, autoout) {
				if ($(this).data('kdrawingId')) {
					autoout = typeof autoout !== 'undefined' ? autoout : true;
					kdr = $('#' + $(this).data('kdrawingId'));
					fadeAlert(kdr, text, autoout);
				};
			}
		}
	}();
	var hexToRgb = function (hex) {
		var hex = parseInt(((hex.indexOf('#') > -1) ? hex.substring(1) : hex), 16);
		return { r: hex >> 16, g: (hex & 0x00FF00) >> 8, b: (hex & 0x0000FF) };
	};
	var hexToHsb = function (hex) {
		return rgbToHsb(hexToRgb(hex));
	};
	var rgbToHsb = function (rgb) {
		var hsb = { h: 0, s: 0, b: 0 };
		var min = Math.min(rgb.r, rgb.g, rgb.b);
		var max = Math.max(rgb.r, rgb.g, rgb.b);
		var delta = max - min;
		hsb.b = max;
		hsb.s = max != 0 ? 255 * delta / max : 0;
		if (hsb.s != 0) {
			if (rgb.r == max) hsb.h = (rgb.g - rgb.b) / delta;
			else if (rgb.g == max) hsb.h = 2 + (rgb.b - rgb.r) / delta;
			else hsb.h = 4 + (rgb.r - rgb.g) / delta;
		} else hsb.h = -1;
		hsb.h *= 60;
		if (hsb.h < 0) hsb.h += 360;
		hsb.s *= 100 / 255;
		hsb.b *= 100 / 255;
		return hsb;
	};
	var hsbToRgb = function (hsb) {
		var rgb = {};
		var h = hsb.h;
		var s = hsb.s * 255 / 100;
		var v = hsb.b * 255 / 100;
		if (s == 0) {
			rgb.r = rgb.g = rgb.b = v;
		} else {
			var t1 = v;
			var t2 = (255 - s) * v / 255;
			var t3 = (t1 - t2) * (h % 60) / 60;
			if (h == 360) h = 0;
			if (h < 60) { rgb.r = t1; rgb.b = t2; rgb.g = t2 + t3 }
			else if (h < 120) { rgb.g = t1; rgb.b = t2; rgb.r = t1 - t3 }
			else if (h < 180) { rgb.g = t1; rgb.r = t2; rgb.b = t2 + t3 }
			else if (h < 240) { rgb.b = t1; rgb.r = t2; rgb.g = t1 - t3 }
			else if (h < 300) { rgb.b = t1; rgb.g = t2; rgb.r = t2 + t3 }
			else if (h < 360) { rgb.r = t1; rgb.g = t2; rgb.b = t1 - t3 }
			else { rgb.r = 0; rgb.g = 0; rgb.b = 0 }
		}
		return { r: Math.round(rgb.r), g: Math.round(rgb.g), b: Math.round(rgb.b) };
	};
	var rgbToHex = function (rgb) {
		var hex = [
			rgb.r.toString(16),
			rgb.g.toString(16),
			rgb.b.toString(16)
		];
		$.each(hex, function (nr, val) {
			if (val.length == 1) {
				hex[nr] = '0' + val;
			}
		});
		return hex.join('');
	};
	var hsbToHex = function (hsb) {
		return rgbToHex(hsbToRgb(hsb));
	};
	var strToRgb = function (rgb) {
		rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
		return { r: (rgb[1] * 1), g: (rgb[2] * 1), b: (rgb[3] * 1) };
	};
	$.fn.extend({
		kdrawing: kdrawing.init,
		kdrawingGetSetting: kdrawing.getSetting,
		kdrawingAlert: kdrawing.showAlert,
		kdrawingFadeAlert: kdrawing.showFadeAlert
	});

})(jQuery);