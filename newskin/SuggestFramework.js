var Suggest = function (target, word, url, key, configuration, functionReturn, options) {
	// 最小宽度 最大宽度 主体透明度 主体边框默认样式 主体边框默认颜色 主体背景色 投影透明度 默认投影颜色 选中前景 选中背景 是否隐藏select 显示条数
	this.options = options ? options : [200, 800, 0.95, "solid", "#EEE", "#FFF", 3, 3, 0.2, "#000", "#444", "#F1F5FC", true];
	this.word = word;
	this.configuration = configuration;
	this.functionReturn = functionReturn;
	this.arrayPrepareKeys = [];
	this.intPrepareKeysMaxLength = 50;
	this.createContainer = function (elementTargetElement) {
		var getCssTextWHLT = function (arrayWHLT) {
			var stringCssText = ";";
			var arrayWHLTTpl = ["width", "height", "left", "top"];
			for (var i = 0; i < 4; i++) {
				if (arrayWHLT[i] != "auto") {
					stringCssText += arrayWHLTTpl[i] + ":" + arrayWHLT[i] + (typeof arrayWHLT[i] == "string" ? "" : "px") + ";";
				}
			}
			return stringCssText;
		};
		var arrayBorderDirection = ["Top", "Right", "Bottom", "Left"];
		var arrayTargetBorderWidth = [];
		var stringTargetBorderCssText = ";background-color:" + (elementTargetElement.style.backgroundColor ? elementTargetElement.style.backgroundColor : this.options[5]) + ";";
		for (var i = 0; i < 4; i++) {
			var stringBorderWidth = elementTargetElement.style["border" + arrayBorderDirection[i] + "Width"];
			arrayTargetBorderWidth[i] = stringBorderWidth ? stringBorderWidth.replace("px", "") * 1 : 2;
			stringTargetBorderCssText += "border-" + arrayBorderDirection[i].toLowerCase() + "-width:" + arrayTargetBorderWidth[i] + "px;";
			var stringBorderStyle = elementTargetElement.style["border" + arrayBorderDirection[i] + "Style"];
			stringTargetBorderCssText += "border-" + arrayBorderDirection[i].toLowerCase() + "-style:" + (stringBorderStyle ? stringBorderStyle : this.options[3]) + ";";
			var stringBorderColor = elementTargetElement.style["border" + arrayBorderDirection[i] + "Color"];
			stringTargetBorderCssText += "border-" + arrayBorderDirection[i].toLowerCase() + "-color:" + (stringBorderColor ? stringBorderColor : this.options[4]) + ";";
		}
		var intCurrentWidth = elementTargetElement.clientWidth;
		intCurrentWidth = intCurrentWidth < this.options[0] ? this.options[0] : intCurrentWidth;
		intCurrentWidth = this.options[1] < intCurrentWidth ? this.options[1] : intCurrentWidth;
		
		var stringMainOpacity = "";
		var stringShadowOpacity = "";
		var stringShadowLimited = ";font-size:0px;line-height:0px;";
		if (navigator.appName == "Microsoft Internet Explorer") {
			stringMainOpacity = "filter:alpha(opacity=" + this.options[2] * 100 + ");";
			stringShadowOpacity = "filter:alpha(opacity=" + this.options[8] * 100 + ");";
		}
		else {
			stringMainOpacity = "opacity:" + this.options[2] + ";";
			stringShadowOpacity = "opacity:" + this.options[8] + ";";
		}
		
		var elementSpan = document.createElement("span");
		elementTargetElement.parentNode.insertBefore(elementSpan, elementTargetElement);
		var intTargetHeight = elementTargetElement.clientHeight + arrayTargetBorderWidth[0] + arrayTargetBorderWidth[2] + (elementTargetElement.offsetTop - elementSpan.offsetTop);
		elementSpan.style.position = "relative";
		elementSpan.style.display = "none";
		elementSpan.style.zIndex = 100000;
		
		var elementDiv = document.createElement("div");
		elementDiv.style.position = "absolute";
		elementDiv.style.cssText += getCssTextWHLT([intCurrentWidth, "auto", 0, intTargetHeight]) + stringTargetBorderCssText + stringMainOpacity;
		elementSpan.appendChild(elementDiv);
		
		var elementShadowDivRight = document.createElement("div");
		elementShadowDivRight.style.position = "absolute";
		elementShadowDivRight.style.cssText += getCssTextWHLT([this.options[6], elementDiv.clientHeight + arrayTargetBorderWidth[1] + arrayTargetBorderWidth[3], intCurrentWidth + arrayTargetBorderWidth[0] + arrayTargetBorderWidth[2], intTargetHeight + this.options[7]]) + "background-color:" + (elementTargetElement.style.borderRightColor ? elementTargetElement.style.borderRightColor : this.options[9]) + ";" + stringShadowOpacity + stringShadowLimited;
		elementSpan.appendChild(elementShadowDivRight);
		
		var elementShadowDivBottom = document.createElement("div");
		elementShadowDivBottom.style.position = "absolute";
		elementShadowDivBottom.style.cssText += getCssTextWHLT([intCurrentWidth + arrayTargetBorderWidth[0] + arrayTargetBorderWidth[2] - this.options[6], this.options[7], this.options[6], intTargetHeight + elementDiv.clientHeight + arrayTargetBorderWidth[1] + arrayTargetBorderWidth[3]]) + "background-color:" + (elementTargetElement.style.borderBottomColor ? elementTargetElement.style.borderBottomColor : this.options[9]) + ";" + stringShadowOpacity + stringShadowLimited;
		elementSpan.appendChild(elementShadowDivBottom);
		
		var elementBorderDiv = document.createElement("div");
		elementBorderDiv.style.position = "absolute";
		elementBorderDiv.style.cssText += getCssTextWHLT([intCurrentWidth < elementTargetElement.clientWidth ? intCurrentWidth : elementTargetElement.clientWidth, arrayTargetBorderWidth[2] + arrayTargetBorderWidth[0], arrayTargetBorderWidth[3], intTargetHeight - arrayTargetBorderWidth[2]]) + ";background-color:" + (elementTargetElement.style.backgroundColor ? elementTargetElement.style.backgroundColor : this.options[5]) + ";" + stringShadowLimited;
		if (elementTargetElement.style.borderBottomWidth) {
			elementSpan.appendChild(elementBorderDiv);
		}
		
		this.elementSpan = elementSpan;
		this.elementDiv = elementDiv;
		this.elementShadowDivRight = elementShadowDivRight;
		this.elementShadowDivBottom = elementShadowDivBottom;
	};
	this.romance = function (element) {
		element.style.cursor = "pointer";
		element.suggest = this;
		element.onmouseover = function () {
			this.style.color = this.suggest.options[10];
			this.style.backgroundColor = this.suggest.options[11];
		};
		element.onmouseout = function () {
			this.style.color = "";
			this.style.backgroundColor = "";
		};
		element.onmousedown = function () {
			this.suggest.booleanForceScan = false;
			this.suggest.elementTarget.value = this.suggest.elementTarget.value.replace(/[^,]*$/, this.data[this.suggest.configuration[5]]);
			if (this.suggest.functionReturn) {
				this.suggest.functionReturn(this.suggest.elementTarget.value);
			}
			this.suggest.hide();
		};
	};
	this.resetShadow = function () {
		var intDivHeight = this.elementDiv.clientHeight + this.elementDiv.style.borderTopWidth.replace("px", "") * 1 + this.elementDiv.style.borderBottomWidth.replace("px", "") * 1;
		this.elementShadowDivRight.style.height = intDivHeight + "px";
		this.elementShadowDivBottom.style.top = this.elementDiv.style.top.replace("px", "") * 1 + intDivHeight + "px";
	};
	
	this.resetSuggest = function (arrayDate) {
		this.setLine(null);
		this.elementDiv.innerHTML = "";
		if (arrayDate.length == 0) {
			this.hide();
			return;
		}
		
		var stringCssTextTable = "width:100%; color:#999; font-size:12px; text-align:center; line-height:20px;";
		var tableTitle = document.createElement("table");
		tableTitle.style.cssText += stringCssTextTable;
		tableTitle.cellPadding = 0;
		tableTitle.cellSpacing = 0;
		
		var trHeader = tableTitle.insertRow(0);
		trHeader.style.cssText += "background-color:#F3F3F3;";
		
		for (var i = 0; i < this.configuration[3].length; i++) {
			var tdTemp = trHeader.insertCell(i);
			tdTemp.innerHTML = this.configuration[3][i];
		}
		for (var i = 0; i < arrayDate.length; i++) {
			var trTemp = tableTitle.insertRow(i + 1);
			trTemp.data = arrayDate[i];
			this.romance(trTemp);
			for (var j = 0; j < arrayDate[i].length; j++) {
				var tdTemp = trTemp.insertCell(j);
				tdTemp.innerHTML = arrayDate[i][j];
			}
		}
		this.elementTable = tableTitle;
		this.elementDiv.appendChild(tableTitle);
		if (this.options[12]) {
			if (navigator.appVersion.indexOf("MSIE 6.0") != -1) {
				var selects = document.getElementsByTagName("select");
				var length = selects.length;
				for (var i = 0; i < length; i++) {
					selects[i].style.visibility = "hidden";
				}
			}
		}
		if (this.elementSpan.innerHTML != "") {
			this.elementSpan.style.display = "";
			this.resetShadow();
		}
		return;
	};
	
	this.hide = function () {
		if (this.options[12]) {
			if (navigator.appVersion.indexOf("MSIE 6.0") != -1) {
				var selects = document.getElementsByTagName("select");
				var length = selects.length;
				for (var i = 0; i < length; i++) {
					selects[i].style.visibility = "";
				}
			}
		}
		this.elementSpan.style.display = "none";
	};
	
	this.load = function (url, key) {
		var element = document.createElement("script");
		element.type = "text/javascript";
		element.language = "javascript";
		element.charset = "gb2312";
		element.src = url;
		element.suggest = this;
		element.key = key;
		element[document.all ? "onreadystatechange" : "onload"] = function () {
			if (document.all && this.readyState != "loaded" && this.readyState != "complete") {
				return;
			}
			this.suggest.stringData += window[this.key];
			this[document.all ? "onreadystatechange" : "onload"] = null;
			this.parentNode.removeChild(this);
		};
		this.elementSpan.appendChild(element);
	};
	this.getResult = function (stringKey) {
		if (!this.stringData || stringKey == "" || stringKey.indexOf("\\") != -1) {
			return new Array();
		}
		var stringRegExpSystem = "$()*+.[?^{|";
		for (var i = 0; i < stringRegExpSystem.length; i++) {
			if (stringKey.indexOf(stringRegExpSystem.substr(i, 1)) != -1) {
				return new Array();
			}
		}
		if (stringKey.indexOf(",") != -1 && stringKey.indexOf(",") != 0 && stringKey.indexOf(",") != stringKey.length - 1) {
			var arrayStringKey = stringKey.split(",");
			stringKey = arrayStringKey[arrayStringKey.length - 1];
		}
		var stringTarget = "";
		var booleanInPrepareKeys = false;
		for (var i = 0; i < this.arrayPrepareKeys.length; i++) {
			if (this.arrayPrepareKeys[i][0] == stringKey) {
				stringTarget = this.arrayPrepareKeys[i][1];
				booleanInPrepareKeys = true;
			}
			if (stringKey.match(new RegExp("^" + this.arrayPrepareKeys[i][0], "igm")) != null) {
				stringTarget = this.arrayPrepareKeys[i][1];
			}
		}
		var arrayMatchResult = (stringTarget == "" ? this.stringData : stringTarget).match(new RegExp(this.configuration[0].replace(new RegExp(this.configuration[1], "g"), stringKey), "igm"));
		if (arrayMatchResult == null) {
			return new Array();
		}
		var arrayMatchResultNew=[], arrayMatchResultNewTemp=[];
        for(var i = 0; i < arrayMatchResult.length; i++){
            var temp = arrayMatchResult[i];
            if (arrayMatchResultNewTemp[temp] != 1){
                arrayMatchResultNew.push(temp);
                arrayMatchResultNewTemp[temp] = 1;
            }
        }
		arrayMatchResultNewTemp = null;
		arrayMatchResult = arrayMatchResultNew;
		arrayMatchResultNew = null;
		if (!booleanInPrepareKeys) {
			this.arrayPrepareKeys.push([stringKey, arrayMatchResult.join("")]);
			if (this.arrayPrepareKeys.length > this.intPrepareKeysMaxLength) {
				this.arrayPrepareKeys.sort(
					function (arrayA, arrayB) {
						return arrayA[0].length - arrayB[0].length;
					}
				);
				this.arrayPrepareKeys.pop();
			}
		}
		arrayMatchResult.length = arrayMatchResult.length > this.configuration[6] ? this.configuration[6] : arrayMatchResult.length;
		if (this.configuration[7] && stringKey.match(this.configuration[7][0]) != null) {
			var stringReg = this.configuration[7][1].replace(this.configuration[1], stringKey);
			var stringRegReplace = this.configuration[7][2];
		}
		else {
			var stringReg = "^(" + stringKey + ")";
			var stringRegReplace = '<span style="color:#F00;">$1</span>';
		}
		for (var i = 0; i < arrayMatchResult.length; i++) {
			var arraySplitResult = arrayMatchResult[i].split(new RegExp(this.configuration[2]));
			var arrayUnblankResult = [];
			var stringTargetCode = "";
			for (var j = 0; j < arraySplitResult.length; j++) {
				if (arraySplitResult[j] != "") {
					if (arraySplitResult[j].match(new RegExp(stringReg, "i")) && stringTargetCode == "") {
						stringTargetCode = arraySplitResult[j].replace(new RegExp(stringReg, "i"), stringRegReplace);
					}
					arrayUnblankResult.push(arraySplitResult[j]);
				}
			}
			var arrayTempResult = [];
			for (var j = 0; j < this.configuration[4].length; j++) {
				if (this.configuration[4][j] == -1) {
					arrayTempResult[j] = stringTargetCode;
				}
				else {
					arrayTempResult[j] = arrayUnblankResult[this.configuration[4][j]];
				}
			}
			arrayMatchResult[i] = arrayTempResult;
		}
		return arrayMatchResult;
	};
	
	this.scan = function () {
		var suggest = arguments.callee.suggest;
		if (suggest.booleanForceScan) {
			if (suggest.stringLastValue != suggest.elementTarget.value) {
				suggest.stringLastValue = suggest.elementTarget.value;
				suggest.resetSuggest(suggest.getResult(suggest.elementTarget.value.match(/[^,]*$/)[0]));
			}
		}
	};
	this.scan.suggest = this;
	this.setLine = function (lineNew) {
		if (this.lineCurrent) {
			this.lineCurrent.style.color = "";
			this.lineCurrent.style.backgroundColor = "";
		}
		this.lineCurrent = null;
		if (lineNew) {
			this.lineCurrent = lineNew;
			this.lineCurrent.style.color = this.options[10];
			this.lineCurrent.style.backgroundColor = this.options[11];
			this.elementTarget.value = this.elementTarget.value.replace(/[^,]*$/, lineNew.data[this.configuration[5]].replace('<span style="color:#F00;">', "").replace('</span>', ""));
		}
	};
	this.bind = function (target, url, key) {
		if (typeof target == "string") {
			var elementTargetElement = document.getElementById(target);
		}
		else {
			var elementTargetElement = target;
		}
		this.elementTarget = elementTargetElement;
		var arrayElement = this.createContainer(elementTargetElement);
		if (key == null) {
			this.stringData = url;
		}
		else {
			if (typeof url != "string") {
				for (var i = 0; i < url.length; i++) {
					this.load(url[i], key[i]);
				}
			}
			else {
				this.load(url, key);
			}
		}
		
		elementTargetElement.autocomplete = "off";
		elementTargetElement.suggest = this;
		//elementTargetElement.style.color = "#999999";
		if (elementTargetElement.value != word) {
			elementTargetElement.value = word;
		}
		
		elementTargetElement.onfocus = function () {
			if (this.value == this.suggest.word) {
				//this.value = "";
			};
			this.style.color = "";
			this.suggest.stringLastValue = "";
			this.suggest.booleanForceScan = true;
			this.suggest.intThread = setInterval(this.suggest.scan, 10);
		};
		
		elementTargetElement.onblur = function () {
			if (this.value == "") {
				//this.value = this.suggest.word;
				//this.style.color = "#999999";
			};
			this.suggest.hide();
			clearInterval(this.suggest.intThread);
			this.suggest.intThread = -1;
		};
		
		elementTargetElement.onkeydown = function () {
			if (this.value == this.suggest.word) {
				this.value = "";
			}
			var event = arguments[0] || window.event;
			var suggest = this.suggest;
			switch (event.keyCode) {
				case 38: //up
					this.suggest.booleanForceScan = false;
					if (!suggest.lineCurrent || suggest.lineCurrent.rowIndex == 1) {
						suggest.setLine(suggest.elementTable.rows[suggest.elementTable.rows.length - 1]);
					}
					else {
						suggest.setLine(suggest.elementTable.rows[suggest.lineCurrent.rowIndex - 1]);
					}
					return false;
					break;
				case 40: //down
					this.suggest.booleanForceScan = false;
					if (!suggest.lineCurrent || suggest.lineCurrent.rowIndex == suggest.elementTable.rows.length - 1) {
						suggest.setLine(suggest.elementTable.rows[1]);
					}
					else {
						suggest.setLine(suggest.elementTable.rows[suggest.lineCurrent.rowIndex + 1]);
					}
					return false;
					break;
				case 13: //Enter
					this.suggest.booleanForceScan = false;
					if (this.suggest.lineCurrent) {
						this.suggest.elementTarget.value = this.suggest.elementTarget.value.replace(/[^,]*$/, this.suggest.lineCurrent.data[this.suggest.configuration[5]]);
					}
					if (this.suggest.functionReturn) {
						if (this.suggest.lineCurrent) {
							var arrayReturn = [];
							for (var i = 0; i < this.suggest.lineCurrent.data.length; i++) {
								arrayReturn[i] = this.suggest.lineCurrent.data[i].replace('<span style="color:#F00;">', "").replace('</span>', "");
							}
							this.suggest.functionReturn(this.suggest.elementTarget.value, arrayReturn);
						}
						else {
							this.suggest.functionReturn(this.suggest.elementTarget.value);
						}
					}
					this.suggest.hide();
					break;
				default:
					this.suggest.booleanForceScan = true;
					this.suggest.scan();
					break;
			}
		};
	};
	this.bind(target, url, key);
	this.getData = function (key) {
		var arrayResult = this.getResult(key);
		if (arrayResult.length == 1) {
			var arrayReturn = [];
			for (var i = 0; i < arrayResult[0].length; i++) {
				arrayReturn[i] = arrayResult[0][i].replace('<span style="color:#F00;">', "").replace('</span>', "");
			}
			return arrayReturn;
		}
		else {
			return null;
		}
	};
};

var StockSuggestConfiguration = ["(~[^~`]*(`[^~`]*)*`@KEY@[^~`]*(`[^~`]*)*)|(~@KEY@[^~`]*`[^~`]*`[^~`]*)", "@KEY@", "[~`]", ["选项", "代码", "名称"], [-1, 0, 1], 1, 10, [/^\d+/, "^(@KEY@)", '<span style="color:#F00;">$1</span>']];

