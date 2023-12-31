// TODO: add a way to go back through menus

const imageInputMenu = document.getElementById("imageInputMenu");
const imageInput = document.getElementById("imageInput");

const gridMenu = document.getElementById("gridMenu");
const rowsInput = document.getElementById("rowsInput");
const columnsInput = document.getElementById("columnsInput");

const lineDensityMenu = document.getElementById("lineDensityMenu");
const minLineDensityInput = document.getElementById("minLineDensityInput");
const maxLineDensityInput = document.getElementById("maxLineDensityInput");
const horizontalLinesInput = document.getElementById("horizontalLinesInput");
const verticalLinesInput = document.getElementById("verticalLinesInput");

const physicalSettingsMenu = document.getElementById("physicalSettingsMenu");
const physicalWidthInput = document.getElementById("physicalWidthInput");
const physicalHeightInput = document.getElementById("physicalHeightInput");
const proportionConstraintInput = document.getElementById("proportionConstraintInput");

const gcodeFileMenu = document.getElementById("gcodeFileMenu");
const gcodeTextarea = document.getElementById("gcodeTextarea");
const xOffsetInput = document.getElementById("xOffsetInput");
const yOffsetInput = document.getElementById("yOffsetInput");
const zOffsetInput = document.getElementById("zOffsetInput");

const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");

const defaultPhysicalSize = 175;

let image = new Image();
let rows = 0;
let columns = 0;
let verticalLinesData = [];
let horizontalLinesData = [];
let combinedLinesData = [];
let physicalSize = [];
let gcodeFile = ``;

imageInput.addEventListener('change', function (event) {
	// load image
	image.src = URL.createObjectURL(event.target.files[0]);
});

function submitImage() {
	// hide and display menus
	imageInputMenu.style.display = "none";
gridMenu.style.display = "block";
canvas.style.display = "block";

renderGrid();
}

function renderGrid() {
	// set canvas dimensions
	canvas.width = image.width;
canvas.height = image.height;

// draw image on canvas
context.drawImage(image, 0, 0, image.width, image.height);

// draw grid
rows = parseInt(rowsInput.value, 10);
cellHeight = image.height / rows;

columns = parseInt(columnsInput.value, 10);
cellWidth = image.width / columns;

// draw rows
for (let i = 0; i < rows; i++) {
	// draw dashed line
	context.beginPath();
context.moveTo(0, i * cellHeight);
context.lineTo(image.width, i * cellHeight);
context.strokeStyle = "#fc03f4";
context.stroke();
	}

// draw columns
for (let i = 0; i < columns; i++) {
	// draw dashed line
	context.beginPath();
context.moveTo(i * cellWidth, 0);
context.lineTo(i * cellWidth, image.height);
context.strokeStyle = "#fc03f4";
context.stroke();
	}
}

function submitGrid() {
	// hide and display menus
	gridMenu.style.display = "none";
lineDensityMenu.style.display = "block";

generateLines();
}

function generateLines() {
	// clear line data
	verticalLinesData = [];
horizontalLinesData = [];
combinedLinesData = [];

// draw image on canvas for processing
context.drawImage(image, 0, 0, image.width, image.height);

maxLineDensity = parseInt(maxLineDensityInput.value, 10);
minLineDensity = parseInt(minLineDensityInput.value, 10);

// get cell info
cellHeight = image.height / rows;
cellWidth = image.width / columns;

// brightness variables
cellBrigthnesses = [];
brightestValue = 1;
darkestValue = 0;

// loop through every grid cell
for (let y = 0; y < rows; y++) {
	cellBrigthnesses.push([])

		for (let x = 0; x < columns; x++) {
	// get cell image data
	let imageData = context.getImageData(x * cellWidth, y * cellHeight, cellWidth, cellHeight).data;

// calculate average cell brightness
let cellBrightness = 0;

for (let i = 0; i < imageData.length; i += 4) {
	// RGB at i, i+1, and i+2
	let pixelBrightness = (imageData[i] + imageData[i + 1] + imageData[i + 2]) / 3;
cellBrightness += pixelBrightness;
			}

// get average for cell (divide by number of pixels in cell)
cellBrightness /= imageData.length;

// scale brightness from 0-1
cellBrightness /= 255;

// flip scale (lightest is 0, darkest is 1)
cellBrightness = 1 - cellBrightness;

// check if brightest value
if (cellBrightness < brightestValue) {
	brightestValue = cellBrightness;
			}

			// check if darkest value
			if (cellBrightness > darkestValue) {
	darkestValue = cellBrightness;
			}

cellBrigthnesses[y].push(cellBrightness);
		}
	}

// clear canvas for drawing
context.clearRect(0, 0, canvas.width, canvas.height);
context.strokeStyle = "#000000";

// draw cells
for (let y = 0; y < rows; y++) {

	// create empty array for row in linesData arrays
	horizontalLinesData.push([]);
verticalLinesData.push([]);

for (let x = 0; x < columns; x++) {
			// scale brightness by factors of brightest and darkest values

			// check for all values being the same
			if (darkestValue == brightestValue) {
	cellBrigthnesses[y][x] = 0.5;
			} else {
	// scale to a number of lines
	cellBrigthnesses[y][x] = (cellBrigthnesses[y][x] - brightestValue) / (darkestValue - brightestValue);
			}

// translate brightness to number of lines
cellLineCount = Math.round((cellBrigthnesses[y][x] * (maxLineDensity - minLineDensity)) + minLineDensity);

// draw lines in cell

// calculate line distance
let lineDistance = cellWidth / cellLineCount;

// create empty array for cell in linesData arrays
horizontalLinesData[y].push([]);
verticalLinesData[y].push([]);

// loop through lines
for (let i = 0; i < cellLineCount; i++) {
				// draw lines

				// horizontal
				if (horizontalLinesInput.checked) {
	// create line
	startPoint = [x * cellWidth, (i * lineDistance) + (y * cellHeight)];
endPoint = [(x * cellWidth) + cellWidth, (i * lineDistance) + (y * cellHeight)];
let line = new Line(startPoint, endPoint, Line.directions.horizontal);
horizontalLinesData[y][x].push(line);


// draw line
context.beginPath();
context.moveTo(...startPoint);
context.lineTo(...endPoint);
context.stroke();
				}

// vertical
if (verticalLinesInput.checked) {
	// create line
	startPoint = [(i * lineDistance) + (x * cellWidth), y * cellHeight];
endPoint = [(i * lineDistance) + (x * cellWidth), (y * cellHeight) + cellHeight];
let line = new Line(startPoint, endPoint, Line.directions.vertical);
verticalLinesData[y][x].push(line);

// draw line
context.beginPath();
context.moveTo(...startPoint);
context.lineTo(...endPoint);
context.stroke();
				}
			}
		}
	}
}

// line constructor
function Line(startPoint, endPoint, direction, combinationsChecked = false){
	this.startPoint = startPoint;
this.endPoint = endPoint;
this.direction = direction;
this.combinationsChecked = combinationsChecked;
}

// static directions enum
Line.directions = {
	horizontal: 0,
vertical: 1
};


function submitLines() {
	// hide and display menus
	lineDensityMenu.style.display = "none";
canvas.style.display = "none";
physicalSettingsMenu.style.display = "block";

// right now, there are a bunch of redundant lines, we need to combine them
combineLines();
setPhysicalDimensions();
}

function combineLines() {
	// clear combined lines data
	combinedLinesData = [];

// horizontal lines

// loop through cells
for (let y = 0; y < rows; y++) {
		for (let x = 0; x < columns; x++) {

			// loop through lines
			for (let lineIndex = 0; lineIndex < horizontalLinesData[y][x].length; lineIndex++) {
	let line = horizontalLinesData[y][x][lineIndex];

// skip lines already marked as checked for possible combinations
if (line.combinationsChecked) {
					continue;
				}

// marks like as checked for combinations
line.combinationsChecked = true;

let combinedLine = new Line(Array.from(line.startPoint), Array.from(line.endPoint), Line.directions.horizontal, true);

// loop through cells to the right
for (let cellToRight = x + 1; cellToRight < horizontalLinesData[y].length; cellToRight++) {
	let matchFound = false;

// loop through lines
for (let lineToRightIndex = 0; lineToRightIndex < horizontalLinesData[y][cellToRight].length; lineToRightIndex++) {

	let lineToRight = horizontalLinesData[y][cellToRight][lineToRightIndex];

// check if y positions match (x positions must fit if in cell to right)
if (line.startPoint[1] == lineToRight.startPoint[1]) {
	combinedLine.endPoint[0] = lineToRight.endPoint[0];

// marks line as checked for combinations
lineToRight.combinationsChecked = true;

// we can skip to the next cell now that we found a match
matchFound = true;
break;
						}
					}

// if there aren't any matches in this cell, we can stop looking through cells on the right
if (!matchFound) {
	cellToRight = horizontalLinesData[y].length;
break;
					}
				}

// save the new combined line we created
combinedLinesData.push(combinedLine);
			}
		}
	}

// vertical lines

// loop through cells
for (let x = 0; x < columns; x++) {
		for (let y = 0; y < rows; y++) {

			// loop through lines
			for (let lineIndex = 0; lineIndex < verticalLinesData[y][x].length; lineIndex++) {
	let line = verticalLinesData[y][x][lineIndex];

// skip lines already marked as checked for possible combinations
if (line.combinationsChecked) {
					continue;
				}

// marks like as checked for combinations
line.combinationsChecked = true;

let combinedLine = new Line(Array.from(line.startPoint), Array.from(line.endPoint), Line.directions.vertical, true);

// loop through cells below
for (let cellBelow = y + 1; cellBelow < rows; cellBelow++) {
	let matchFound = false;

// loop through lines
for (let lineBelowIndex = 0; lineBelowIndex < verticalLinesData[cellBelow][x].length; lineBelowIndex++) {

	let lineBelow = verticalLinesData[cellBelow][x][lineBelowIndex];

// check if y positions match (x positions must fit if in cell to right)
if (line.startPoint[0] == lineBelow.startPoint[0]) {
	combinedLine.endPoint[1] = lineBelow.endPoint[1];

// marks line as checked for combinations
lineBelow.combinationsChecked = true;

// we can skip to the next cell now that we found a match
matchFound = true;
break;
						}
					}

// if there aren't any matches in this cell, we can stop looking through cells on the right
if (!matchFound) {
	cellBelow = rows;
break;
					}
				}

// save the new combined line we created
combinedLinesData.push(combinedLine);
			}
		}
	}
}

function setPhysicalDimensions(inputBox) {
	// no input box being passed means we need to set default dimensions
	if (!inputBox) {
		if (image.width > image.height) {
	physicalWidthInput.value = defaultPhysicalSize;

inputBox = physicalWidthInput;
		} else {
	physicalHeightInput.value = defaultPhysicalSize;

inputBox = physicalHeightInput;
		}
	}

// set other input to be proportional
if (proportionConstraintInput.checked) {
		if (inputBox.id == physicalWidthInput.id) {
	physicalHeightInput.value = parseFloat(physicalWidthInput.value) * (image.height / image.width);
		} else {
	physicalWidthInput.value = parseFloat(physicalHeightInput.value) * (image.width / image.height);
		}
	}
}

function submitPhysicalSize() {
	physicalSettingsMenu.style.display = "none";
gcodeFileMenu.style.display = "block";

generateGcode();
}

function generateGcode() {
	// setup and parameters
	gcodeFile = `; generated by da vinci machine at ${new Date().toTimeString()}\n\n`;
gcodeFile += "M104 S0 ; turn off nozzle heat\n";
gcodeFile += "M140 S0 ; turn off bed heat\n";
gcodeFile += "G21 ; set units to millimeters\n";
gcodeFile += "G90 ; use absolute coordinates\n\n";

// go to home
gcodeFile += "G28 ; home all axes\n\n";

// load parameters
let physicalSize = [parseFloat(physicalWidthInput.value), parseFloat(physicalHeightInput.value)];
let proportions = [(physicalSize[0] / image.width), physicalSize[1] / image.height];
let offsets = [parseFloat(xOffsetInput.value), parseFloat(yOffsetInput.value), parseFloat(zOffsetInput.value)];

// remember pen position (screen space)
let penPosition = [0, 0];

// loop through lines
for (let i = 0; i < combinedLinesData.length; i++){
	let currentLine = combinedLinesData[i];

// get line points
let lineStart = Array.from(currentLine.startPoint);
let lineEnd = Array.from(currentLine.endPoint);

// screen position to printer position conversion

// convert to physical size
lineStart[0] *= proportions[0];
lineStart[1] *= proportions[1];
lineEnd[0] *= proportions[0];
lineEnd[1] *= proportions[1];

// fix y axis on both points (quadrant IV to quadrant I)
lineStart[1] = physicalSize[1] - lineStart[1];
lineEnd[1] = physicalSize[1] - lineEnd[1];

// add offset to x and y
lineStart[0] += offsets[0];
lineStart[1] += offsets[1];
lineEnd[0] += offsets[0];
lineEnd[1] += offsets[1];

// round to one decimal point
lineStart[0] = lineStart[0].toFixed(1);
lineStart[1] = lineStart[1].toFixed(1);
lineEnd[0] = lineEnd[0].toFixed(1);
lineEnd[1] = lineEnd[1].toFixed(1);

// set to draw as the ox plows

// check whether if lineEnd is closer to pen
if (pointDistance(penPosition, lineEnd) < pointDistance(penPosition, lineStart)) {
	// flip line start and end to avoid uneccessary movement
	[lineStart, lineEnd] = [lineEnd, lineStart];
		}

// actually draw line

// lift pen (with z offset)
gcodeFile += `G0 Z${(5 + offsets[2]).toFixed(1)}; lift pen\n`;

// go to line start
gcodeFile += `G0 X${lineStart[0]} Y${lineStart[1]}; start line\n`;

// lower pen (with z offset)
gcodeFile += `G0 Z${(0 + offsets[2]).toFixed(1)}; lower pen\n`;

// go to line end
gcodeFile += `G0 X${lineEnd[0]} Y${lineEnd[1]}; end line\n\n`;

// remember pen position (screen space)
penPosition = Array.from(lineEnd);
	}

// lift pen and go home at the end
gcodeFile += `G0 Z${(5 + offsets[2]).toFixed(1)}; lift pen\n`;
gcodeFile += "G28 ; home all axes\n";

// set text area to gcode
gcodeTextarea.value = gcodeFile;
}

function pointDistance(point1, point2) {
	const x1 = point1[0];
const y1 = point1[1];
const x2 = point2[0];
const y2 = point2[1];

const distance = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
return distance;
}

function downloadGcode() {
	// create link element
	let link = document.createElement('a');
link.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(gcodeTextarea.value));
link.setAttribute("download", "da vinci drawing.gcode");

// append link to document while invisible
link.style.display = "none";
document.body.appendChild(link);

// click to download file
link.click();

// delete link
document.body.removeChild(link);
}