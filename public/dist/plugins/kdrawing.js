"use strict";
(function($) {
  var kdrawing = function() {
    var tpl = '<div class="kdrawing"><div class="kdrawing_drawingboard"><canvas class="kdrawing_canvas" /><div class="kdrawing_cursor"><div class="kdrawing_cursor_icon"></div><div class="kdrawing_cursor_inner"></div></div><div class="kdrawing_cover"></div></div><div class="kdrawing_information"><p>B : \uC5F0\uD544</p><p>E : \uC9C0\uC6B0\uAC1C</p><p>G : \uD398\uC778\uD2B8\uD1B5</p><p>I : \uC2A4\uD3EC\uC774\uB4DC</p><p>U : \uC120 \uADF8\uB9AC\uAE30</p><p>Ctrl+Z, Ctrl+Y : \uC2E4\uD589 \uCDE8\uC18C, \uC7AC\uC2E4\uD589</p><p>Ctrl+S : \uC800\uC7A5</p><p>1 ~ 9 : \uD30C\uB808\uD2B8 \uC0C9\uC0C1 \uC120\uD0DD</p><p>T : \uB3C4\uAD6C \uC0C1\uC790\uB97C \uD604\uC7AC \uB9C8\uC6B0\uC2A4 \uC704\uCE58\uB85C \uC774\uB3D9</p><p>+, - : \uB3C4\uAD6C \uD06C\uAE30 \uBCC0\uACBD</p><br /><p>\uC67C\uD074\uB9AD : \uB3C4\uAD6C \uC0AC\uC6A9</p><p>\uC624\uB978\uD074\uB9AD : \uC9C0\uC6B0\uAC1C</p><p>\uD30C\uB808\uD2B8 \uC0C9\uC0C1\uC5D0 \uB300\uACE0 \uC624\uB978\uD074\uB9AD : \uD30C\uB808\uD2B8 \uC9C0\uC6B0\uAE30</p></div><div class="kdrawing_timeline"></div><div class="kdrawing_fadealert"></div></div>', tpl_toolbox = '<div class="kdrawing_toolbox kdrawing_draggable"><div class="kdrawing_draggable_handle"></div><ul class="kdrawing_toolbox_tools"><li class="kdrawing_toolbox_tool"><span class="kdrawing_toolbox_new" data-tool="new" title="\uC0C8\uB85C \uB9CC\uB4E4\uAE30"></span></li><li class="kdrawing_toolbox_tool"><span class="kdrawing_toolbox_undo" data-tool="undo" title="\uC2E4\uD589 \uCDE8\uC18C"></span></li><li class="kdrawing_toolbox_tool"><span class="kdrawing_toolbox_redo" data-tool="redo" title="\uB2E4\uC2DC \uC2E4\uD589"></span></li><li class="kdrawing_toolbox_division"></li><li class="kdrawing_toolbox_tool"><span class="kdrawing_toolbox_pencil" data-tool="pencil" title="\uC5F0\uD544"></span></li><li class="kdrawing_toolbox_tool"><span class="kdrawing_toolbox_eraser" data-tool="eraser" title="\uC9C0\uC6B0\uAC1C"></span></li><li class="kdrawing_toolbox_tool"><span class="kdrawing_toolbox_paint" data-tool="paint" title="\uD398\uC778\uD2B8\uD1B5"></span></li><li class="kdrawing_toolbox_tool"><span class="kdrawing_toolbox_eyedropper" data-tool="eyedropper" title="\uC2A4\uD3EC\uC774\uB4DC"></span></li><li class="kdrawing_toolbox_tool"><span class="kdrawing_toolbox_line" data-tool="line" title="\uC120 \uADF8\uB9AC\uAE30"></span></li><li class="kdrawing_toolbox_division"></li><li class="kdrawing_toolbox_system"><div class="kdrawing_toolbox_color"></div><button type="button" class="kdrawing_button kdrawing_toolbox_addpalette" title="\uD30C\uB808\uD2B8\uC5D0 \uC0C9\uC0C1 \uCD94\uAC00">\uFF0B</button></li><li class="kdrawing_toolbox_option"><div class="kdrawing_toolbox_size"><input class="kdrawing_toolbox_size_bar" type="range" min="1" max="10" value="2" /><br /><input class="kdrawing_toolbox_size_text" type="number" min="1" value="2" /></div><li class="kdrawing_toolbox_division"></li><li class="kdrawing_toolbox_tool"><span class="kdrawing_toolbox_save" data-tool="save" title="\uC800\uC7A5\uD558\uAE30"></span></li><li class="kdrawing_toolbox_tool"><span class="kdrawing_toolbox_load" data-tool="load" title="\uBD88\uB7EC\uC624\uAE30"></span></li><li class="kdrawing_toolbox_tool"><span class="kdrawing_toolbox_timeline" data-tool="timeline" title="\uD0C0\uC784\uB77C\uC778 \uB9CC\uB4E4\uAE30"></span></li></li></ul></div>', tpl_palette = '<div class="kdrawing_palette kdrawing_draggable"><div class="kdrawing_draggable_handle"></div><ul class="kdrawing_palette_colors"></ul></div>', tpl_colorpicker = '<div class="kdrawing_colorpicker kdrawing_draggable"><div class="kdrawing_draggable_handle"></div><div class="kdrawing_colorpicker_wrapper"><div class="kdrawing_colorpicker_color" style="background-color: rgb(255, 0, 0);"><div class="kdrawing_colorpicker_color_overlay1"><div class="kdrawing_colorpicker_color_overlay2"><div class="kdrawing_colorpicker_selector_outer" style="left: 0px; top: 156px;"><div class="kdrawing_colorpicker_selector_inner"></div></div></div></div></div><div class="kdrawing_colorpicker_hue"><div class="kdrawing_colorpicker_hue_arrs" style="top: 0px;"><div class="kdrawing_colorpicker_hue_larr"></div><div class="kdrawing_colorpicker_hue_rarr"></div></div></div><div class="kdrawing_colorpicker_right"><div class="kdrawing_colorpicker_show_color"><div class="kdrawing_colorpicker_new_color"></div><div class="kdrawing_colorpicker_current_color"></div></div><form novalidate><div style="float: left;"><div class="kdrawing_colorpicker_hsb_h kdrawing_colorpicker_field"><div class="kdrawing_colorpicker_field_letter">H</div><input type="number" maxlength="3" size="3" min="0" max="360"></div><div class="kdrawing_colorpicker_hsb_s kdrawing_colorpicker_field"><div class="kdrawing_colorpicker_field_letter">S</div><input type="number" maxlength="3" size="3" min="0" max="100"></div><div class="kdrawing_colorpicker_hsb_b kdrawing_colorpicker_field"><div class="kdrawing_colorpicker_field_letter">B</div><input type="number" maxlength="3" size="3" min="0" max="100"></div></div><div class="kdrawing_colorpicker_rgb_box"><div class="kdrawing_colorpicker_rgb_r kdrawing_colorpicker_field"><div class="kdrawing_colorpicker_field_letter">R</div><input type="number" maxlength="3" size="3" min="0" max="255"></div><div class="kdrawing_colorpicker_rgb_g kdrawing_colorpicker_field"><div class="kdrawing_colorpicker_field_letter">G</div><input type="number" maxlength="3" size="3" min="0" max="255"></div><div class="kdrawing_colorpicker_rgb_b kdrawing_colorpicker_field"><div class="kdrawing_colorpicker_field_letter">B</div><input type="number" maxlength="3" size="3" min="0" max="255"></div></div><div style="clear: both;"></div><div class="kdrawing_colorpicker_hex kdrawing_colorpicker_field"><div class="kdrawing_colorpicker_field_letter">#</div><input type="text" maxlength="6" size="6"></div><div class="kdrawing_colorpicker_buttons"><button type="submit" class="kdrawing_button kdrawing_colorpicker_submit">\uD655\uC778</button><button type="button" class="kdrawing_button kdrawing_colorpicker_cancel">\uCDE8\uC18C</button><div style="clear: both;"></div></div></form></div></div></div>', tpl_alertwindow = '<div class="kdrawing_alertwindow kdrawing_draggable"><div class="kdrawing_draggable_handle"></div><form novalidate><div class="kdrawing_alertwindow_size kdrawing_alertwindow_form"><input type="text" name="width" /><span class="kdrawing_alertwindow_size_center">x</span><input type="text" name="height" /><div class="kdrawing_alertwindow_size_keep"><label><input type="checkbox" name="keep" /> \uADF8\uB9BC \uC720\uC9C0</label></div><div class="kdrawing_alertwindow_buttons"><button type="submit" class="kdrawing_button">\uD655\uC778</button><button type="button" class="kdrawing_button kdrawing_alertwindow_close">\uCDE8\uC18C</button></div></div><div class="kdrawing_alertwindow_alert kdrawing_alertwindow_form"><div class="kdrwaing_alertwindow_text"></div><div class="kdrawing_alertwindow_buttons"><button type="submit" class="kdrawing_button">\uD655\uC778</button></div></div></form></div>', defaults = {
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
      onReady: function() {
      },
      onChange: function() {
      },
      onSave: function() {
      },
      onLoad: function() {
      }
    }, makeTimeline = function(kdr2) {
      var count = prompt("\uD0C0\uC784\uB77C\uC778\uC744 \uBA87 \uB2E8\uACC4\uB85C \uB9CC\uB4DC\uC2DC\uACA0\uC2B5\uB2C8\uAE4C?", 5);
      if (!count || count <= 0 || isNaN(count))
        return;
      var timeline = [];
      var history = $(kdr2).data("data").history.undo;
      if (false) {
        alert("\uD0C0\uC784\uB77C\uC778\uC744 \uB9CC\uB4E4\uAE30\uC5D0\uB294 \uAE30\uB85D\uC774 \uB108\uBB34 \uC9E7\uC2B5\uB2C8\uB2E4.\n\uAC1C\uC218\uB97C \uB2E4\uC2DC \uC124\uC815\uD574\uC8FC\uC138\uC694.");
        return;
      }
      var interv = Math.ceil(history.length / (count * 1 + 1));
      $(kdr2).find(".kdrawing_timeline").empty();
      var ii = 0;
      for (var i = interv; i < history.length; i += interv) {
        timeline.push(history[i]);
        $(kdr2).find(".kdrawing_timeline").append('<img src="' + history[i] + '" width="100" />');
        ii++;
      }
    }, fadeAlert = function(kdr2, text, autoout) {
      autoout = typeof autoout !== "undefined" ? autoout : true;
      var fadealert = $(kdr2).find(".kdrawing_fadealert");
      fadealert.text(text);
      if (autoout)
        fadealert.stop(true, true).fadeIn(100).delay(500).fadeOut(100);
      else
        fadealert.stop(true, true).fadeIn(100);
      return;
    }, alertWindow = function(kdr2, opt) {
      if ($(kdr2).data("data").alertwindow_id) {
        $(kdr2).data("data").alertwindow.stop(true, true).fadeIn(100).fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100);
        return;
      }
      if (!opt)
        return;
      $(kdr2).data("data").alertwindow_id = opt.id;
      var alertwindow = $(kdr2).data("data").alertwindow;
      alertwindow.show();
      alertwindow.find(".kdrawing_alertwindow_form").hide();
      alertwindow.find(".kdrawing_alertwindow_" + opt.id).show();
      alertwindow.find("form").off("submit");
      alertwindow.find("form").on("submit", function(e) {
        e.preventDefault();
        var submitReturn = false;
        if (opt.onSubmit) {
          var paramObj = {};
          $.each($(this).serializeArray(), function(_, kv) {
            paramObj[kv.name] = kv.value;
          });
          submitReturn = opt.onSubmit.apply($(this), [paramObj]);
        }
        if (!submitReturn)
          alertWindowClose(kdr2);
      });
      switch (opt.id) {
        case "size":
          if (opt.width)
            alertwindow.find(".kdrawing_alertwindow_size input[name='width']").val(opt.width);
          if (opt.height)
            alertwindow.find(".kdrawing_alertwindow_size input[name='height']").val(opt.height);
          break;
        case "alert":
          if (opt.text)
            alertwindow.find(".kdrwaing_alertwindow_text").html(opt.text);
          break;
      }
    }, alertWindowClose = function(kdr2) {
      var alertwindow = $(kdr2).data("data").alertwindow;
      $(kdr2).data("data").alertwindow_id = false;
      alertwindow.hide();
    }, setCanvasSize = function(kdr2, width, height) {
      if (isNaN(width) || isNaN(height) || !width || width < 50 || width > 1280 || !height || height < 50 || height > 1600) {
        alert("50px \uC774\uC0C1, \uAC00\uB85C 1280px \uC774\uD558, \uC138\uB85C 1600px \uC774\uD558\uB85C \uC785\uB825\uD574\uC8FC\uC138\uC694.");
        return false;
      }
      $(kdr2).data("data").width = width;
      $(kdr2).data("data").height = height;
      $(kdr2).data("data").drawingboard.css({ "width": width, "height": height });
      var canvas = $(kdr2).data("data").canvas.get(0);
      canvas.width = width, canvas.height = height;
      return true;
    }, newCanvas = function(kdr2, doNotClearHistory) {
      if (!doNotClearHistory) {
        $(kdr2).data("data").history.undo = [];
        $(kdr2).data("data").history.redo = [];
      }
      $(kdr2).find(".kdrawing_timeline").empty();
      var canvas = $(kdr2).data("data").canvas.get(0);
      var ctx = canvas.getContext("2d");
      ctx.fillStyle = "#FFF";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }, addToPalette = function(kdr2, col) {
      var palette = $(kdr2).data("data").palette.find(".kdrawing_palette_colors");
      palette.append($("<li />").css({ "background-color": "#" + hsbToHex(col) }));
      $(kdr2).data("data").colors.push(col);
    }, loadPalette = function(kdr2) {
      var colors = $(kdr2).data("data").colors;
      clearPalette(kdr2);
      for (var i in colors) {
        addToPalette(kdr2, colors[i]);
      }
    }, clearPalette = function(kdr2) {
      $(kdr2).data("data").palette.find(".kdrawing_palette_colors li").remove();
      $(kdr2).data("data").colors = [];
    }, setCursor = function(kdr2) {
      if (!$(kdr2).data("data").customCursor)
        return;
      var drawingboard = $(kdr2).data("data").drawingboard;
      var cursor = $(kdr2).data("data").cursor;
      var cursor_inner = cursor.find(".kdrawing_cursor_inner");
      var cursor_icon = cursor.find(".kdrawing_cursor_icon");
      var color = hsbToHex($(kdr2).data("data").color);
      var cursor_pos = { top: cursor.css("top"), left: cursor.css("left") };
      drawingboard.removeClass().addClass("kdrawing_drawingboard");
      cursor.hide().attr("style", "").css({ "top": cursor_pos.top, "left": cursor_pos.left });
      cursor_inner.hide().attr("style", "");
      cursor_icon.hide().attr("style", "").removeClass().addClass("kdrawing_cursor_icon");
      var tool_id = $(kdr2).data("data").tool_id;
      var tool = $(kdr2).data("data").tool[$(kdr2).data("data").tool_id];
      switch (tool_id) {
        case "pencil":
          if (tool.size == 1) {
            if ($(kdr2).data("data").customCursorDot)
              drawingboard.addClass("kdrawing_crosshaircursor");
          } else {
            drawingboard.addClass("kdrawing_disablecursor");
            cursor.show().css({ "width": tool.size, "height": tool.size, "border-width": 1, "border-style": "solid", "border-color": "black", "border-radius": "50%" });
            cursor_inner.show().css({ "top": 0, "left": 0, "right": 0, "bottom": 0, "border-width": 1, "border-style": "solid", "border-color": "white", "border-radius": "50%" });
          }
          cursor_icon.hide().removeClass().addClass("kdrawing_cursor_icon");
          break;
        case "paint":
        case "line":
          drawingboard.addClass("kdrawing_disablecursor");
          cursor.show().css({ "width": 4, "height": 4, "margin": "3px 0 0 3px", "border-width": "2px 0 0 2px", "border-style": "solid", "border-color": "#" + color });
          cursor_icon.show().addClass("kdrawing_cursor_icon_" + tool_id);
          break;
        case "eraser":
          drawingboard.addClass("kdrawing_disablecursor");
          cursor.show().css({ "width": tool.size, "height": tool.size, "border-width": 1, "border-style": "solid", "border-color": "black", "border-radius": "50%" });
          cursor_inner.show().css({ "top": 0, "left": 0, "right": 0, "bottom": 0, "border-width": 1, "border-style": "solid", "border-color": "white", "border-radius": "50%" });
          cursor_icon.hide().removeClass().addClass("kdrawing_cursor_icon");
          break;
        case "eyedropper":
          drawingboard.addClass("kdrawing_disablecursor");
          cursor_icon.show().addClass("kdrawing_cursor_icon_eyedropper");
          break;
      }
    }, setToolColor = function(kdr2, col) {
      if (typeof col == "string") {
        col = hexToHsb(col);
      } else if (col.r != void 0 && col.g != void 0 && col.b != void 0) {
        col = rgbToHsb(col);
      } else if (col.h != void 0 && col.s != void 0 && col.b != void 0) {
        col = fixHSB(col);
      } else {
        col = defaults.color;
      }
      var toolbox = $(kdr2).data("data").toolbox;
      toolbox.find(".kdrawing_toolbox_system .kdrawing_toolbox_color").css("background-color", "#" + hsbToHex(col));
      $(kdr2).data("data").color = col;
      setOption(kdr2);
    }, setToolSize = function(kdr2, size) {
      if (!$(kdr2).data("data").tool_id || $(kdr2).data("data").toolbox.find(".kdrawing_toolbox_size_text").is(":hidden") || isNaN(size))
        return;
      if (size > 100)
        size = 100;
      if (size < 1)
        size = 1;
      $(kdr2).data("data").toolbox.find(".kdrawing_toolbox_size_bar, .kdrawing_toolbox_size_text").val(size);
      $(kdr2).data("data").tool[$(kdr2).data("data").tool_id].size = size;
      setCursor(kdr2);
    }, setOption = function(kdr2) {
      var canvas = $(kdr2).data("data").canvas.get(0);
      var ctx = canvas.getContext("2d");
      var toolbox = $(kdr2).data("data").toolbox;
      var color = hsbToHex($(kdr2).data("data").color);
      toolbox.find(".kdrawing_toolbox_option div").hide();
      var tool_id = $(kdr2).data("data").tool_id;
      var tool = $(kdr2).data("data").tool[$(kdr2).data("data").tool_id];
      switch (tool_id) {
        case "pencil":
        case "line":
          toolbox.find(".kdrawing_toolbox_option .kdrawing_toolbox_size").show().find("input").val(tool.size);
          ctx.fillStyle = color ? "#" + color : "#000";
          break;
        case "paint":
        case "eyedropper":
          ctx.fillStyle = color ? "#" + color : "#000";
          break;
        case "eraser":
          toolbox.find(".kdrawing_toolbox_option .kdrawing_toolbox_size").show().find("input").val(tool.size);
          ctx.fillStyle = "#FFF";
          break;
      }
      setCursor(kdr2);
    }, clickTool = function(kdr2, id) {
      switch (id) {
        case "new":
          var canvas = $(kdr2).data("data").canvas.get(0);
          var ctx = canvas.getContext("2d");
          alertWindow(kdr2, {
            id: "size",
            "width": canvas.width,
            "height": canvas.height,
            "onSubmit": function(data) {
              if (data.keep) {
                var tempCanvas = $(kdr2).data("data").canvas.get(0).toDataURL();
              }
              if (setCanvasSize(kdr2, data.width, data.height)) {
                if (data.keep) {
                  newCanvas(kdr2, true);
                  var image2 = new Image();
                  image2.src = tempCanvas;
                  image2.onload = function() {
                    ctx.drawImage(image2, 0, 0);
                  };
                } else {
                  newCanvas(kdr2);
                }
                setTool(kdr2, $(kdr2).data("data").tool_id);
                return false;
              } else {
                return true;
              }
            }
          });
          $(kdr2).data("data").alertwindow.find("input:visible:eq(0)").focus();
          break;
        case "undo":
        case "redo":
          var canvas = $(kdr2).data("data").canvas.get(0);
          var ctx = canvas.getContext("2d");
          var org_id = id;
          var invert_id = id == "undo" ? "redo" : "undo";
          var history_org = $(kdr2).data("data").history[org_id];
          if (!history_org.length)
            return;
          var invert_history = $(kdr2).data("data").history[invert_id];
          var image = new Image();
          image.src = history_org.pop();
          invert_history.push(canvas.toDataURL());
          image.onload = function() {
            ctx.drawImage(image, 0, 0);
            $(kdr2).data("data").onChange.apply($(kdr2).parent(), [$(kdr2).data("data").canvas.get(0).toDataURL(), $(kdr2).data("data")]);
          };
          break;
        case "save":
          if ($(kdr2).data("data").carefulAction) {
            var con = confirm("\uC800\uC7A5\uD558\uC2DC\uACA0\uC2B5\uB2C8\uAE4C?");
            if (!con)
              return;
          }
          $(kdr2).data("data").onSave.apply($(kdr2).parent(), [$(kdr2).data("data").canvas.get(0).toDataURL(), jQuery.extend(true, {}, $(kdr2).data("data"))]);
          break;
        case "load":
          if ($(kdr2).data("data").carefulAction) {
            var con = confirm("\uBD88\uB7EC\uC624\uC2DC\uACA0\uC2B5\uB2C8\uAE4C?");
            if (!con)
              return;
          }
          try {
            fadeAlert(kdr2, "\uBD88\uB7EC\uC624\uB294 \uC911...", false);
            $(kdr2).data("data").onLoad(function(data) {
              console.log(data);
              var loadData2 = data;
              $(kdr2).data("data", $.extend({}, $(kdr2).data("data"), loadData2.data || {}));
              var options = $(kdr2).data("data");
              setCanvasSize(kdr2, options.width, options.height);
              newCanvas(kdr2, true);
              var canvas2 = $(kdr2).data("data").canvas.get(0);
              var ctx2 = canvas2.getContext("2d");
              var image2 = new Image();
              image2.src = loadData2.url;
              image2.onload = function() {
                ctx2.drawImage(image2, 0, 0);
                fadeAlert(kdr2, "\uBD88\uB7EC\uC624\uAE30 \uC644\uB8CC.");
                $(kdr2).data("data").onChange.apply($(kdr2), [$(kdr2).data("data").canvas.get(0).toDataURL(), $(kdr2).data("data")]);
              };
              image2.onerror = function() {
                fadeAlert(kdr2, "\uBD88\uB7EC\uC624\uAE30 \uC2E4\uD328");
                alert("\uC800\uC7A5 \uB0B4\uC6A9\uC774 \uC62C\uBC14\uB974\uC9C0 \uC54A\uC544 \uADF8\uB9BC \uBD88\uB7EC\uC624\uAE30\uC5D0 \uC2E4\uD328\uD588\uC2B5\uB2C8\uB2E4.");
              };
              loadPalette(kdr2);
              setTool(kdr2, options.tool_id ? options.tool_id : defaults.tool_id);
              setToolColor(kdr2, options.color ? options.color : defaults.color);
            });
          } catch (e) {
            prompt("\uBD88\uB7EC\uC624\uB294 \uC911 \uC624\uB958\uAC00 \uBC1C\uC0DD\uD588\uC2B5\uB2C8\uB2E4.\n\uC544\uB798 \uB0B4\uC6A9\uC744 \uBCF5\uC0AC\uD574\uC11C \uBB38\uC758\uD574\uC8FC\uC138\uC694.\n", e.message + " / " + JSON.stringify(loadData));
          }
          break;
        case "timeline":
          makeTimeline(kdr2);
          break;
        default:
          setTool(kdr2, id);
          break;
      }
    }, setTool = function(kdr2, id) {
      $(kdr2).data("data").tool_id = id;
      if (!$(kdr2).data("data").tool[id])
        $(kdr2).data("data").tool[id] = { size: 1 };
      var tool = $(kdr2).data("data").tool[$(kdr2).data("data").tool_id];
      var toolbox = $(kdr2).data("data").toolbox;
      setOption(kdr2);
      toolbox.find(".kdrawing_toolbox_tools li.kdrawing_toolbox_tool").removeClass("selected");
      toolbox.find(".kdrawing_toolbox_" + id).parent("li").addClass("selected");
    }, saveAction = function(kdr2) {
      var canvas = $(kdr2).data("data").canvas.get(0);
      $(kdr2).data("data").history.undo.push(canvas.toDataURL());
      if ($(kdr2).data("data").history.undo.length > 100)
        $(kdr2).data("data").history.undo = $(kdr2).data("data").history.undo.slice(-100);
      $(kdr2).data("data").history.redo = [];
    }, doAction = function(kdr2, x, y, eventType) {
      var adjust = $(kdr2).data("data").adjust;
      x += adjust.x;
      y += adjust.y;
      switch ($(kdr2).data("data").tool_id) {
        case "pencil":
        case "eraser":
          if (eventType == "mousedown")
            saveAction(kdr2);
          draw(kdr2, x, y, eventType == "mouseenter" || eventType == "mousedown" ? true : false);
          break;
        case "line":
          if (eventType == "mousedown") {
            saveAction(kdr2);
            draw(kdr2, x, y, true);
          } else if (eventType == "mouseup" || eventType == "mouseleave") {
            draw(kdr2, x, y);
          }
          break;
        case "paint":
          if (eventType == "mousedown")
            saveAction(kdr2);
          paint(kdr2, x, y);
          break;
        case "eyedropper":
          colorpick(kdr2, x, y);
          break;
        case "hand":
          if (eventType == "mousedown") {
            $("body").addClass("clicked");
            $(kdr2).data("data").last.x = x;
            $(kdr2).data("data").last.y = y;
          } else if (eventType == "mouseup") {
            $("body").removeClass("clicked");
          } else if (eventType == "mousemove") {
            if ($("body").hasClass("clicked")) {
              $(window).scrollTop($(window).scrollTop() + ($(kdr2).data("data").last.y - y));
              $(window).scrollLeft($(window).scrollLeft() + ($(kdr2).data("data").last.x - x));
            }
          }
          break;
      }
      $(kdr2).data("data").onChange.apply($(kdr2), [$(kdr2).data("data").canvas.get(0).toDataURL(), $(kdr2).data("data")]);
    }, draw = function(kdr2, x, y, down) {
      var lastX = $(kdr2).data("data").last.x;
      var lastY = $(kdr2).data("data").last.y;
      $(kdr2).data("data").last.x = x;
      $(kdr2).data("data").last.y = y;
      if (down) {
        draw_(kdr2, x, y);
      } else {
        var x1 = x, x2 = lastX, y1 = y, y2 = lastY;
        var steep = Math.abs(y2 - y1) > Math.abs(x2 - x1);
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
        var dx = x2 - x1, dy = Math.abs(y2 - y1), error = 0, de = dy / dx, yStep = -1, y = y1;
        if (y1 < y2) {
          yStep = 1;
        }
        for (var x = x1; x <= x2; x++) {
          if (steep) {
            draw_(kdr2, y, x);
          } else {
            draw_(kdr2, x, y);
          }
          error += de;
          if (error >= 0.5) {
            y += yStep;
            error -= 1;
          }
        }
      }
    }, draw_ = function(kdr2, x, y) {
      var canvas = $(kdr2).data("data").canvas.get(0);
      var ctx = canvas.getContext("2d");
      var tool_size = $(kdr2).data("data").tool[$(kdr2).data("data").tool_id].size;
      if (tool_size == 1) {
        ctx.fillRect(x, y, 1, 1);
      } else {
        ctx.beginPath();
        ctx.arc(x, y, tool_size / 2, 0, 2 * Math.PI);
        ctx.fill();
      }
    }, paint = function(kdr2, x, y) {
      var canvas = $(kdr2).data("data").canvas.get(0);
      var ctx = canvas.getContext("2d");
      var colorLayerData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      var pixelPos = (y * canvas.width + x) * 4;
      var curColor = hsbToRgb($(kdr2).data("data").color);
      var r2 = colorLayerData.data[pixelPos], g2 = colorLayerData.data[pixelPos + 1], b2 = colorLayerData.data[pixelPos + 2], a = colorLayerData.data[pixelPos + 3];
      if (r2 === curColor.r && g2 === curColor.g && b2 === curColor.b)
        return;
      paint_(kdr2, x, y, r2, g2, b2, colorLayerData, curColor);
    }, paint_ = function(kdr2, startX, startY, startR, startG, startB, colorLayerData, curColor) {
      var canvas = $(kdr2).data("data").canvas.get(0);
      var ctx = canvas.getContext("2d");
      var newPos, x, y, pixelPos, reachLeft, reachRight, canvasWidth = canvas.width, canvasHeight = canvas.height, drawingBoundLeft = 0, drawingBoundTop = 0, drawingBoundRight = canvasWidth - 1, drawingBoundBottom = canvasHeight - 1, pixelStack = [[startX, startY]];
      while (pixelStack.length) {
        newPos = pixelStack.pop();
        x = newPos[0];
        y = newPos[1];
        pixelPos = (y * canvasWidth + x) * 4;
        while (y >= drawingBoundTop && paint_matchStartColor(pixelPos, startR, startG, startB, colorLayerData, curColor)) {
          y -= 1;
          pixelPos -= canvasWidth * 4;
        }
        pixelPos += canvasWidth * 4;
        y += 1;
        reachLeft = false;
        reachRight = false;
        while (y <= drawingBoundBottom && paint_matchStartColor(pixelPos, startR, startG, startB, colorLayerData, curColor)) {
          colorPixel(pixelPos, curColor.r, curColor.g, curColor.b, void 0, colorLayerData);
          if (x > drawingBoundLeft) {
            if (paint_matchStartColor(pixelPos - 4, startR, startG, startB, colorLayerData, curColor)) {
              if (!reachLeft) {
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
      ctx.putImageData(colorLayerData, 0, 0);
    }, paint_matchStartColor = function(pixelPos, startR, startG, startB, colorLayerData, curColor) {
      r = colorLayerData.data[pixelPos];
      g = colorLayerData.data[pixelPos + 1];
      b = colorLayerData.data[pixelPos + 2];
      if (r === startR && g === startG && b === startB) {
        return true;
      }
      if (r === curColor.r && g === curColor.g && b === curColor.b) {
        return false;
      }
      return false;
    }, colorPixel = function(pixelPos, r2, g2, b2, a, colorLayerData) {
      colorLayerData.data[pixelPos] = r2;
      colorLayerData.data[pixelPos + 1] = g2;
      colorLayerData.data[pixelPos + 2] = b2;
      colorLayerData.data[pixelPos + 3] = a !== void 0 ? a : 255;
    }, colorpick = function(kdr2, x, y) {
      var canvas = $(kdr2).data("data").canvas.get(0);
      var ctx = canvas.getContext("2d");
      var color = ctx.getImageData(x, y, 1, 1).data;
      setToolColor(kdr2, rgbToHsb({ r: color[0], g: color[1], b: color[2] }));
    }, addDragging = function(e) {
      e.preventDefault();
      $(this).parent(".kdrawing_draggable").addClass("dragging").data("top", e.offsetY).data("left", e.offsetX);
    }, getWindow = function(id, tpl2, top, left) {
      var kdr_window = $(tpl2).attr("id", "kdrawing_" + id);
      kdr_window.find(".kdrawing_draggable_handle").on("mousedown", addDragging);
      kdr_window.offset({ "top": top, "left": left });
      return kdr_window;
    }, colorpicker_fillRGBFields = function(hsb, cal) {
      var rgb = hsbToRgb(hsb);
      $(cal).data("colorpicker").fields.eq(3).val(rgb.r).end().eq(4).val(rgb.g).end().eq(5).val(rgb.b).end();
    }, colorpicker_fillHSBFields = function(hsb, cal) {
      $(cal).data("colorpicker").fields.eq(0).val(Math.round(hsb.h)).end().eq(1).val(Math.round(hsb.s)).end().eq(2).val(Math.round(hsb.b)).end();
    }, colorpicker_fillHexFields = function(hsb, cal) {
      $(cal).data("colorpicker").fields.eq(6).val(hsbToHex(hsb));
    }, colorpicker_setSelector = function(hsb, cal) {
      $(cal).data("colorpicker").selector.css("backgroundColor", "#" + hsbToHex({ h: hsb.h, s: 100, b: 100 }));
      $(cal).data("colorpicker").selectorIndic.css({
        left: parseInt($(cal).data("colorpicker").height * hsb.s / 100, 10),
        top: parseInt($(cal).data("colorpicker").height * (100 - hsb.b) / 100, 10)
      });
    }, colorpicker_setHue = function(hsb, cal) {
      $(cal).data("colorpicker").hue.css("top", parseInt($(cal).data("colorpicker").height - $(cal).data("colorpicker").height * hsb.h / 360, 10));
    }, colorpicker_setCurrentColor = function(hsb, cal) {
      $(cal).data("colorpicker").currentColor.css("backgroundColor", "#" + hsbToHex(hsb));
    }, colorpicker_setNewColor = function(hsb, cal) {
      $(cal).data("colorpicker").newColor.css("backgroundColor", "#" + hsbToHex(hsb));
    }, colorpicker_change = function(e) {
      var cal = $(this).parents(".kdrawing_colorpicker"), col;
      if (this.parentNode.className.indexOf("_hex") > 0) {
        cal.data("colorpicker").color = col = hexToHsb(fixHex(this.value));
        colorpicker_fillRGBFields(col, cal.get(0));
        colorpicker_fillHSBFields(col, cal.get(0));
      } else if (this.parentNode.className.indexOf("_hsb") > 0) {
        cal.data("colorpicker").color = col = fixHSB({
          h: parseInt(cal.data("colorpicker").fields.eq(0).val(), 10),
          s: parseInt(cal.data("colorpicker").fields.eq(1).val(), 10),
          b: parseInt(cal.data("colorpicker").fields.eq(2).val(), 10)
        });
        colorpicker_fillRGBFields(col, cal.get(0));
        colorpicker_fillHexFields(col, cal.get(0));
      } else {
        cal.data("colorpicker").color = col = rgbToHsb(fixRGB({
          r: parseInt(cal.data("colorpicker").fields.eq(3).val(), 10),
          g: parseInt(cal.data("colorpicker").fields.eq(4).val(), 10),
          b: parseInt(cal.data("colorpicker").fields.eq(5).val(), 10)
        }));
        colorpicker_fillHexFields(col, cal.get(0));
        colorpicker_fillHSBFields(col, cal.get(0));
      }
      colorpicker_setSelector(col, cal.get(0));
      colorpicker_setHue(col, cal.get(0));
      colorpicker_setNewColor(col, cal.get(0));
      cal.data("colorpicker").onChange.apply(cal.parent(), [col]);
    }, colorpicker_downHue = function(e) {
      e.preventDefault ? e.preventDefault() : e.returnValue = false;
      var current = {
        cal: $(this).parents(".kdrawing_colorpicker"),
        y: $(this).offset().top
      };
      $(document).on("mouseup touchend", current, colorpicker_upHue);
      $(document).on("mousemove touchmove", current, colorpicker_moveHue);
      var pageY = e.type == "touchstart" ? e.originalEvent.changedTouches[0].pageY : e.pageY;
      colorpicker_change.apply(
        current.cal.data("colorpicker").fields.eq(0).val(parseInt(360 * (current.cal.data("colorpicker").height - (pageY - current.y)) / current.cal.data("colorpicker").height, 10)).get(0)
      );
      return false;
    }, colorpicker_moveHue = function(e) {
      var pageY = e.type == "touchmove" ? e.originalEvent.changedTouches[0].pageY : e.pageY;
      colorpicker_change.apply(
        e.data.cal.data("colorpicker").fields.eq(0).val(parseInt(360 * (e.data.cal.data("colorpicker").height - Math.max(0, Math.min(e.data.cal.data("colorpicker").height, pageY - e.data.y))) / e.data.cal.data("colorpicker").height, 10)).get(0)
      );
      return false;
    }, colorpicker_upHue = function(e) {
      colorpicker_fillRGBFields(e.data.cal.data("colorpicker").color, e.data.cal.get(0));
      colorpicker_fillHexFields(e.data.cal.data("colorpicker").color, e.data.cal.get(0));
      $(document).off("mouseup touchend", colorpicker_upHue);
      $(document).off("mousemove touchmove", colorpicker_moveHue);
      return false;
    }, colorpicker_downSelector = function(e) {
      e.preventDefault ? e.preventDefault() : e.returnValue = false;
      var current = {
        cal: $(this).parents(".kdrawing_colorpicker"),
        pos: $(this).offset()
      };
      $(document).on("mouseup touchend", current, colorpicker_upSelector);
      $(document).on("mousemove touchmove", current, colorpicker_moveSelector);
      var payeX, pageY;
      if (e.type == "touchstart") {
        pageX = e.originalEvent.changedTouches[0].pageX, pageY = e.originalEvent.changedTouches[0].pageY;
      } else {
        pageX = e.pageX;
        pageY = e.pageY;
      }
      colorpicker_change.apply(
        current.cal.data("colorpicker").fields.eq(2).val(parseInt(100 * (current.cal.data("colorpicker").height - (pageY - current.pos.top)) / current.cal.data("colorpicker").height, 10)).end().eq(1).val(parseInt(100 * (pageX - current.pos.left) / current.cal.data("colorpicker").height, 10)).get(0)
      );
      return false;
    }, colorpicker_moveSelector = function(e) {
      var payeX, pageY;
      if (e.type == "touchmove") {
        pageX = e.originalEvent.changedTouches[0].pageX, pageY = e.originalEvent.changedTouches[0].pageY;
      } else {
        pageX = e.pageX;
        pageY = e.pageY;
      }
      colorpicker_change.apply(
        e.data.cal.data("colorpicker").fields.eq(2).val(parseInt(100 * (e.data.cal.data("colorpicker").height - Math.max(0, Math.min(e.data.cal.data("colorpicker").height, pageY - e.data.pos.top))) / e.data.cal.data("colorpicker").height, 10)).end().eq(1).val(parseInt(100 * Math.max(0, Math.min(e.data.cal.data("colorpicker").height, pageX - e.data.pos.left)) / e.data.cal.data("colorpicker").height, 10)).get(0)
      );
      return false;
    }, colorpicker_upSelector = function(e) {
      colorpicker_fillRGBFields(e.data.cal.data("colorpicker").color, e.data.cal.get(0));
      colorpicker_fillHexFields(e.data.cal.data("colorpicker").color, e.data.cal.get(0));
      $(document).off("mouseup touchend", colorpicker_upSelector);
      $(document).off("mousemove touchmove", colorpicker_moveSelector);
      return false;
    }, fixHSB = function(hsb) {
      return {
        h: Math.min(360, Math.max(0, hsb.h)),
        s: Math.min(100, Math.max(0, hsb.s)),
        b: Math.min(100, Math.max(0, hsb.b))
      };
    }, fixRGB = function(rgb) {
      return {
        r: Math.min(255, Math.max(0, rgb.r)),
        g: Math.min(255, Math.max(0, rgb.g)),
        b: Math.min(255, Math.max(0, rgb.b))
      };
    }, fixHex = function(hex) {
      var len = 6 - hex.length;
      if (len > 0) {
        var o = [];
        for (var i = 0; i < len; i++) {
          o.push("0");
        }
        o.push(hex);
        hex = o.join("");
      }
      return hex;
    }, colorpicker_setColor = function(kdr_colorpicker, col, setCurrent) {
      setCurrent = typeof setCurrent === "undefined" ? 1 : setCurrent;
      if (typeof col == "string") {
        col = hexToHsb(col);
      } else if (col.r != void 0 && col.g != void 0 && col.b != void 0) {
        col = rgbToHsb(col);
      } else if (col.h != void 0 && col.s != void 0 && col.b != void 0) {
        col = fixHSB(col);
      } else {
        return false;
      }
      var cal = $(kdr_colorpicker);
      cal.data("colorpicker").color = col;
      colorpicker_fillRGBFields(col, cal.get(0));
      colorpicker_fillHSBFields(col, cal.get(0));
      colorpicker_fillHexFields(col, cal.get(0));
      colorpicker_setHue(col, cal.get(0));
      colorpicker_setSelector(col, cal.get(0));
      colorpicker_setNewColor(col, cal.get(0));
      if (setCurrent) {
        colorpicker_setCurrentColor(col, cal.get(0));
      }
    }, colorpicker_clickSubmit = function(e) {
      e.preventDefault();
      var cal = $(this).parents(".kdrawing_colorpicker");
      var col = cal.data("colorpicker").color;
      cal.data("colorpicker").onSubmit(col);
    };
    return {
      init: function(opt) {
        opt = $.extend({}, defaults, opt || {});
        if (typeof opt.color == "string") {
          opt.color = hexToHsb(opt.color);
        } else if (opt.color.r != void 0 && opt.color.g != void 0 && opt.color.b != void 0) {
          opt.color = rgbToHsb(opt.color);
        } else if (opt.color.h != void 0 && opt.color.s != void 0 && opt.color.b != void 0) {
          opt.color = fixHSB(opt.color);
        } else {
          return this;
        }
        return this.each(function() {
          if (!$(this).data("kdrawingId")) {
            var options = $.extend({}, opt);
            var id = parseInt(Math.random() * 1e3);
            var kdr_id = "kdrawing_" + id;
            $(this).data("kdrawingId", kdr_id);
            var kdr2 = $(tpl).attr("id", kdr_id);
            options.canvas = $(kdr2).find(".kdrawing_canvas");
            options.cursor = $(kdr2).find(".kdrawing_cursor");
            options.drawingboard = $(kdr2).find(".kdrawing_drawingboard");
            $(kdr2).find(".kdrawing_cover").on("contextmenu", function() {
              return false;
            });
            kdr2.find(".kdrawing_cover").on("mouseenter", function(e) {
              $(kdr2).addClass("mouseenter");
              if ($(kdr2).hasClass("mousedown"))
                doAction($(kdr2).get(0), e.offsetX, e.offsetY, e.type);
            }).on("mouseleave", function(e) {
              $(kdr2).removeClass("mouseenter");
              if ($(kdr2).hasClass("mousedown"))
                doAction($(kdr2).get(0), e.offsetX, e.offsetY, e.type);
            }).on("mousedown", function(e) {
              e.preventDefault();
              $(":focus").blur();
              $(kdr2).addClass("mousedown");
              if ($(kdr2).hasClass("mousedown") && $(kdr2).hasClass("mouseenter")) {
                if (e.which == 2 || e.which == 3) {
                  $(kdr2).data("data").tool_id_org = $(kdr2).data("data").tool_id;
                  setTool(kdr2, "eraser");
                }
                doAction($(kdr2).get(0), e.offsetX, e.offsetY, e.type);
              }
            }).on("mousemove", function(e) {
              if ($(kdr2).hasClass("mousedown") && $(kdr2).hasClass("mouseenter"))
                doAction($(kdr2).get(0), e.offsetX, e.offsetY, e.type);
            }).on("mouseup", function(e) {
              if ($(kdr2).data("data").tool_id == "line")
                doAction($(kdr2).get(0), e.offsetX, e.offsetY, e.type);
            });
            $("body").on("mouseup", function() {
              $(".kdrawing_draggable").removeClass("dragging");
              $(kdr2).removeClass("mousedown");
              if ($(kdr2).data("data").tool_id_org) {
                setTool(kdr2, $(kdr2).data("data").tool_id_org);
                $(kdr2).data("data").tool_id_org = false;
              }
            }).on("mousemove", function(e) {
              $(kdr2).data("data").mousePos = { x: e.pageX, y: e.pageY };
              $(".kdrawing_draggable.dragging").each(function(index, element) {
                $(this).css({ "top": e.pageY - $(this).data("top"), "left": e.pageX - $(this).data("left") });
              });
              var container_offset = options.drawingboard.offset();
              options.cursor.css({
                "top": e.pageY - container_offset.top - options.cursor.height() / 2 - 3,
                "left": e.pageX - container_offset.left - options.cursor.width() / 2 - 3
              });
            }).on("keydown", function(e) {
              if ($(":focus").length > 0)
                return;
              var enter = $(kdr2).hasClass("mouseenter");
              switch (e.keyCode) {
                case 187:
                case 107:
                  setToolSize(kdr2, $(kdr2).data("data").tool[$(kdr2).data("data").tool_id].size * 1 + 1);
                  break;
                case 189:
                case 109:
                  setToolSize(kdr2, $(kdr2).data("data").tool[$(kdr2).data("data").tool_id].size * 1 - 1);
                  break;
                case 84:
                  e.preventDefault();
                  var mousePos = kdr2.data("data").mousePos;
                  kdr_toolbox.css({ "top": mousePos.y - kdr_toolbox.height() / 2, "left": mousePos.x - kdr_toolbox.width() / 2 });
                  break;
                case 90:
                  e.preventDefault();
                  if (e.ctrlKey)
                    clickTool(kdr2, "undo");
                  break;
                case 89:
                  e.preventDefault();
                  if (e.ctrlKey)
                    clickTool(kdr2, "redo");
                  break;
                case 66:
                  e.preventDefault();
                  clickTool(kdr2, "pencil");
                  break;
                case 69:
                  e.preventDefault();
                  clickTool(kdr2, "eraser");
                  break;
                case 71:
                  e.preventDefault();
                  clickTool(kdr2, "paint");
                  break;
                case 73:
                  e.preventDefault();
                  clickTool(kdr2, "eyedropper");
                  break;
                case 85:
                  e.preventDefault();
                  clickTool(kdr2, "line");
                  break;
                case 32:
                  e.preventDefault();
                  if ($(kdr2).data("data").tool_id != "hand")
                    $(kdr2).data("data").tool_id_org = $(kdr2).data("data").tool_id;
                  $("html").css("cursor", "-webkit-grab");
                  clickTool(kdr2, "hand");
                  break;
                case 83:
                  e.preventDefault();
                  if (e.ctrlKey)
                    clickTool(kdr2, "save");
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
                  var paletteColor = $(kdr2).data("data").palette.find(".kdrawing_palette_colors li").eq(num - 1);
                  if (paletteColor.length)
                    setToolColor(kdr2, rgbToHsb(strToRgb(paletteColor.css("background-color"))));
                  break;
              }
            }).on("keyup", function(e) {
              switch (e.keyCode) {
                case 32:
                  if ($(kdr2).data("data").tool_id_org) {
                    $("body").removeClass("clicked");
                    $("html").css("cursor", "");
                    setTool(kdr2, $(kdr2).data("data").tool_id_org);
                    $(kdr2).data("data").tool_id_org = false;
                  }
                  break;
              }
            });
            kdr2.appendTo(this);
            var kdr_offset = kdr2.offset();
            var kdr_toolbox = getWindow("toolbox_" + id, tpl_toolbox, kdr_offset.top, kdr_offset.left + opt.width + 6);
            var kdr_palette = getWindow("palette_" + id, tpl_palette, kdr_offset.top, kdr_offset.left + opt.width + 46);
            var kdr_colorpicker = getWindow("colorpicker_" + id, tpl_colorpicker, kdr_offset.top, kdr_offset.left);
            var kdr_alertwindow = getWindow("alertwindow_" + id, tpl_alertwindow, kdr_offset.top, kdr_offset.left);
            kdr_toolbox.find(".kdrawing_toolbox_tools li.kdrawing_toolbox_tool span").click(function() {
              clickTool(kdr2.get(0), $(this).data("tool"));
            });
            kdr_toolbox.find(".kdrawing_toolbox_size_bar, .kdrawing_toolbox_size_text").change(function() {
              setToolSize(kdr2, parseInt($(this).val()));
            });
            kdr_toolbox.find(".kdrawing_toolbox_color").on("click", function() {
              if (!$(kdr2).data("data").tool_id)
                return;
              colorpicker_setColor(kdr_colorpicker, $(kdr2).data("data").color, true);
              kdr_colorpicker.data("colorpicker").onSubmit = function(col) {
                setToolColor(kdr2, col);
                kdr_colorpicker.hide();
              };
              if ($(kdr2).data("data").colorpickerImmediately) {
                kdr_colorpicker.data("colorpicker").onChange = function(col) {
                  setToolColor(kdr2, col);
                };
              }
              kdr_colorpicker.show();
            });
            kdr_toolbox.find(".kdrawing_toolbox_addpalette").on("click", function() {
              addToPalette(kdr2, $(kdr2).data("data").color);
            });
            kdr_palette.find(".kdrawing_palette_colors").on("mousedown", "li", function(e) {
              e.preventDefault();
              if (e.which == 2 || e.which == 3) {
                $(kdr2).data("data").colors.splice($(this).index(), 1);
                $(this).remove();
              } else
                setToolColor(kdr2, rgbToHsb(strToRgb($(this).css("background-color"))));
            }).on("contextmenu", function() {
              return false;
            });
            kdr_colorpicker.hide();
            var kdr_colorpicker_data = { "height": 156, "color": hexToHsb("FF0000"), "onSubmit": function() {
            }, "onChange": function() {
            } };
            kdr_colorpicker_data.fields = kdr_colorpicker.find("input").change(colorpicker_change);
            kdr_colorpicker_data.selector = kdr_colorpicker.find("div.kdrawing_colorpicker_color").on("mousedown touchstart", colorpicker_downSelector);
            kdr_colorpicker_data.selectorIndic = kdr_colorpicker_data.selector.find("div.kdrawing_colorpicker_selector_outer");
            kdr_colorpicker_data.hue = kdr_colorpicker.find("div.kdrawing_colorpicker_hue_arrs");
            kdr_colorpicker_data.newColor = kdr_colorpicker.find("div.kdrawing_colorpicker_new_color");
            kdr_colorpicker_data.currentColor = kdr_colorpicker.find("div.kdrawing_colorpicker_current_color");
            kdr_colorpicker.find("div.kdrawing_colorpicker_hue").on("mousedown touchstart", colorpicker_downHue);
            kdr_colorpicker.find("form").on("submit", colorpicker_clickSubmit);
            kdr_colorpicker.find(".kdrawing_colorpicker_cancel").click(function() {
              $(kdr_colorpicker).hide();
            });
            kdr_colorpicker.data("colorpicker", kdr_colorpicker_data);
            colorpicker_fillRGBFields(kdr_colorpicker_data.color, kdr_colorpicker.get(0));
            colorpicker_fillHSBFields(kdr_colorpicker_data.color, kdr_colorpicker.get(0));
            colorpicker_fillHexFields(kdr_colorpicker_data.color, kdr_colorpicker.get(0));
            colorpicker_setHue(kdr_colorpicker_data.color, kdr_colorpicker.get(0));
            colorpicker_setSelector(kdr_colorpicker_data.color, kdr_colorpicker.get(0));
            colorpicker_setCurrentColor(kdr_colorpicker_data.color, kdr_colorpicker.get(0));
            colorpicker_setNewColor(kdr_colorpicker_data.color, kdr_colorpicker.get(0));
            kdr_alertwindow.hide();
            kdr_alertwindow.find(".kdrawing_alertwindow_close").click(function() {
              alertWindowClose($(kdr2).get(0));
            });
            kdr_toolbox.appendTo("body");
            kdr_palette.appendTo("body");
            kdr_colorpicker.appendTo("body");
            kdr_alertwindow.appendTo("body");
            options.toolbox = kdr_toolbox;
            options.palette = kdr_palette;
            options.colorpicker = kdr_colorpicker;
            options.alertwindow = kdr_alertwindow;
            kdr2.data("data", options);
            setCanvasSize(kdr2, options.width, options.height);
            newCanvas(kdr2);
            loadPalette(kdr2);
            setTool(kdr2, options.tool_id);
            options.onReady.apply($(kdr2).parent());
          }
        });
      },
      getSetting: function() {
        if ($(this).data("kdrawingId")) {
          kdr = $("#" + $(this).data("kdrawingId"));
          return kdr.data("data");
        }
      },
      showAlert: function(text, onSbumit) {
        if ($(this).data("kdrawingId")) {
          kdr = $("#" + $(this).data("kdrawingId"));
          alertWindow(kdr, { "id": "alert", "text": text, "onSubmit": onSbumit });
        }
        ;
      },
      showFadeAlert: function(text, autoout) {
        if ($(this).data("kdrawingId")) {
          autoout = typeof autoout !== "undefined" ? autoout : true;
          kdr = $("#" + $(this).data("kdrawingId"));
          fadeAlert(kdr, text, autoout);
        }
        ;
      }
    };
  }();
  var hexToRgb = function(hex) {
    var hex = parseInt(hex.indexOf("#") > -1 ? hex.substring(1) : hex, 16);
    return { r: hex >> 16, g: (hex & 65280) >> 8, b: hex & 255 };
  };
  var hexToHsb = function(hex) {
    return rgbToHsb(hexToRgb(hex));
  };
  var rgbToHsb = function(rgb) {
    var hsb = { h: 0, s: 0, b: 0 };
    var min = Math.min(rgb.r, rgb.g, rgb.b);
    var max = Math.max(rgb.r, rgb.g, rgb.b);
    var delta = max - min;
    hsb.b = max;
    hsb.s = max != 0 ? 255 * delta / max : 0;
    if (hsb.s != 0) {
      if (rgb.r == max)
        hsb.h = (rgb.g - rgb.b) / delta;
      else if (rgb.g == max)
        hsb.h = 2 + (rgb.b - rgb.r) / delta;
      else
        hsb.h = 4 + (rgb.r - rgb.g) / delta;
    } else
      hsb.h = -1;
    hsb.h *= 60;
    if (hsb.h < 0)
      hsb.h += 360;
    hsb.s *= 100 / 255;
    hsb.b *= 100 / 255;
    return hsb;
  };
  var hsbToRgb = function(hsb) {
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
      if (h == 360)
        h = 0;
      if (h < 60) {
        rgb.r = t1;
        rgb.b = t2;
        rgb.g = t2 + t3;
      } else if (h < 120) {
        rgb.g = t1;
        rgb.b = t2;
        rgb.r = t1 - t3;
      } else if (h < 180) {
        rgb.g = t1;
        rgb.r = t2;
        rgb.b = t2 + t3;
      } else if (h < 240) {
        rgb.b = t1;
        rgb.r = t2;
        rgb.g = t1 - t3;
      } else if (h < 300) {
        rgb.b = t1;
        rgb.g = t2;
        rgb.r = t2 + t3;
      } else if (h < 360) {
        rgb.r = t1;
        rgb.g = t2;
        rgb.b = t1 - t3;
      } else {
        rgb.r = 0;
        rgb.g = 0;
        rgb.b = 0;
      }
    }
    return { r: Math.round(rgb.r), g: Math.round(rgb.g), b: Math.round(rgb.b) };
  };
  var rgbToHex = function(rgb) {
    var hex = [
      rgb.r.toString(16),
      rgb.g.toString(16),
      rgb.b.toString(16)
    ];
    $.each(hex, function(nr, val) {
      if (val.length == 1) {
        hex[nr] = "0" + val;
      }
    });
    return hex.join("");
  };
  var hsbToHex = function(hsb) {
    return rgbToHex(hsbToRgb(hsb));
  };
  var strToRgb = function(rgb) {
    rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
    return { r: rgb[1] * 1, g: rgb[2] * 1, b: rgb[3] * 1 };
  };
  $.fn.extend({
    kdrawing: kdrawing.init,
    kdrawingGetSetting: kdrawing.getSetting,
    kdrawingAlert: kdrawing.showAlert,
    kdrawingFadeAlert: kdrawing.showFadeAlert
  });
})(jQuery);
