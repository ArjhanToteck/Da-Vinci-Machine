"use client";

import React, { useEffect, useRef, useState } from 'react';
import LineData from './LineData';

export default function LineDrawing({ image, rows, columns, setPage, minLineDensity, setMinLineDensity, maxLineDensity, setMaxLineDensity, useHorizontalLines, setUseHorizontalLines, useVerticalLines, setUseVerticalLines, setLinesData }) {
	// image processing data
	const [cellBrightnesses, setCellBrightnesses] = useState([]);
	const [brightestValue, setBrightestValue] = useState(1);
	const [darkestValue, setDarkestValue] = useState(0);

	const canvasRef = useRef(null);

	useEffect(() => {
		// TODO: this can be optimized by not calculating brightnesses every time but im too lazy rn lol

		// we need the canvas and image to do processing
		if (!image || !canvasRef.current) {
			return;
		}

		// use canvas to split image into cells and calculate their brightness
		const canvas = canvasRef.current;
		const context = canvas.getContext("2d");

		// draw image on canvas for processing
		context.drawImage(image, 0, 0, image.width, image.height);

		// get cell info
		const cellHeight = image.height / rows;
		const cellWidth = image.width / columns;

		let cellBrightness = [];
		let brightestValue = 1;
		let darkestValue = 0;

		// loop through every grid cell
		for (let y = 0; y < rows; y++) {
			cellBrightnesses.push([])

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

				cellBrightnesses[y].push(cellBrightness);
			}
		}

		// clear canvas for drawing
		context.clearRect(0, 0, canvas.width, canvas.height);

		let horizontalLines = [];
		let verticalLines = [];

		// draw cells

		// loop through rows
		for (let y = 0; y < rows; y++) {
			// create new row for line data
			horizontalLines.push([]);
			verticalLines.push([]);

			// loop through columns
			for (let x = 0; x < columns; x++) {
				// create new cell for line data
				horizontalLines[y].push([]);
				verticalLines[y].push([]);

				// scale brightness by factors of brightest and darkest values
				let scaledBrightness = cellBrightnesses[y][x];

				// check for all values being the same
				if (darkestValue == brightestValue) {
					scaledBrightness = 0.5;
				} else {
					// scale to a number of lines
					scaledBrightness = (scaledBrightness - brightestValue) / (darkestValue - brightestValue);
				}

				// translate brightness to number of lines
				let cellLineCount = Math.round((scaledBrightness * (maxLineDensity - minLineDensity)) + minLineDensity);

				// draw lines in cell

				// calculate line distance
				let lineDistance = cellWidth / cellLineCount;

				// loop through lines
				for (let i = 0; i < cellLineCount; i++) {
					// draw lines

					// TODO: maybe we can do better contrast/range by not always having the same number of vertical and horizontal lines

					// horizontal
					if (useHorizontalLines) {
						// create line
						const startPoint = [
							x * cellWidth,
							(i * lineDistance) + (y * cellHeight)
						];

						const endPoint = [
							(x * cellWidth) + cellWidth,
							(i * lineDistance) + (y * cellHeight)
						];

						// add line to data
						horizontalLines[y][x].push(new LineData(startPoint, endPoint, LineData.Direction.horizontal));

						// draw line
						context.beginPath();
						context.moveTo(...startPoint);
						context.lineTo(...endPoint);
						context.stroke();
					}

					// vertical
					if (useVerticalLines) {
						// create line
						const startPoint = [
							(i * lineDistance) + (x * cellWidth),
							y * cellHeight
						];

						const endPoint = [
							(i * lineDistance) + (x * cellWidth),
							(y * cellHeight) + cellHeight
						];

						// add line to data
						verticalLines[y][x].push(new LineData(startPoint, endPoint, LineData.Direction.horizontal));

						// draw line
						context.beginPath();
						context.moveTo(...startPoint);
						context.lineTo(...endPoint);
						context.stroke();
					}
				}
			}
		}

		// combine redundant cells

		// clear combined lines data
		let combinedLines = [];

		// loop through cells
		for (let y = 0; y < rows; y++) {
			for (let x = 0; x < columns; x++) {

				// horizontal lines

				// loop through horizontal lines
				for (let lineIndex = 0; lineIndex < horizontalLines[y][x].length; lineIndex++) {
					let line = horizontalLines[y][x][lineIndex];

					// skip lines already marked as checked for possible combinations
					if (line.combinationsChecked) {
						continue;
					}

					// marks like as checked for combinations
					line.combinationsChecked = true;

					let combinedLine = new LineData([...line.startPoint], [...line.endPoint], LineData.Direction.horizontal, true);

					// loop through cells to the right
					for (let cellToRight = x + 1; cellToRight < horizontalLines[y].length; cellToRight++) {
						let matchFound = false;

						// loop through lines
						for (let lineToRightIndex = 0; lineToRightIndex < horizontalLines[y][cellToRight].length; lineToRightIndex++) {

							let lineToRight = horizontalLines[y][cellToRight][lineToRightIndex];

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
							cellToRight = horizontalLines[y].length;
							break;
						}
					}

					// save the new combined line we created
					combinedLines.push(combinedLine);
				}

				// vertical lines

				// loop through vertical lines
				for (let lineIndex = 0; lineIndex < verticalLines[y][x].length; lineIndex++) {
					let line = verticalLines[y][x][lineIndex];

					// skip lines already marked as checked for possible combinations
					if (line.combinationsChecked) {
						continue;
					}

					// marks like as checked for combinations
					line.combinationsChecked = true;

					let combinedLine = new LineData([...line.startPoint], [...line.endPoint], LineData.Direction.vertical, true);

					// loop through cells below
					for (let cellBelow = y + 1; cellBelow < rows; cellBelow++) {
						let matchFound = false;

						// loop through lines
						for (let lineBelowIndex = 0; lineBelowIndex < verticalLines[cellBelow][x].length; lineBelowIndex++) {

							let lineBelow = verticalLines[cellBelow][x][lineBelowIndex];

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
					combinedLines.push(combinedLine);
				}
			}
		}

		setLinesData(combinedLines);
	}, [minLineDensity, maxLineDensity, useHorizontalLines, useVerticalLines, cellBrightnesses, columns, image, rows, setLinesData]);

	return (
		<section>

			<p>Play with these settings to change the quality and contrast of the image, which is previewed below.</p>

			<div>
				<p>
					Minimum line density: &nbsp;
					<input type="number" value={minLineDensity} onChange={(event) => setMinLineDensity(parseInt(event.target.value, 10))} />
				</p>
				<p>
					Maximum line density: &nbsp;
					<input type="number" value={maxLineDensity} onChange={(event) => setMaxLineDensity(parseInt(event.target.value, 10))} />
				</p>
				<p>
					Horizontal lines: &nbsp;
					<input type="checkbox" checked={useHorizontalLines} onChange={(e) => setUseHorizontalLines(e.target.checked)} />

					<br />

					Vertical lines: &nbsp;
					<input type="checkbox" checked={useVerticalLines} onChange={(e) => setUseVerticalLines(e.target.checked)} />
				</p>
			</div>

			<canvas className="round" style={{ backgroundColor: "white" }} ref={canvasRef} width={image.width} height={image.height} />

			<br />
			<button onClick={() => setPage("dimensions")}>Next</button>
			<br />
			<button onClick={() => setPage("grid")}>Back</button>
			<br />

		</section>
	);
}
