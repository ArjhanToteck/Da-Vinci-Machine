"use client";

import React, { useEffect, useRef, useState } from 'react';

export default function LineDrawing({ image, rows, columns, setPage }) {
	// drawing settings
	const [minLineDensity, setMinLineDensity] = useState(0);
	const [maxLineDensity, setMaxLineDensity] = useState(4);
	const [useHorizontalLines, setUseHorizontalLines] = useState(true);
	const [useVerticalLines, setUseVerticalLines] = useState(true);

	const canvasRef = useRef(null);

	useEffect(() => {
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

		// brightness variables
		let cellBrightnesses = [];
		let brightestValue = 1;
		let darkestValue = 0;

		// loop through every grid cell
		for (let y = 0; y < rows; y++) {
			// push to start new row
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

				// add cell to row
				cellBrightnesses[y].push(cellBrightness);
			}
		}

		// TODO: use these to draw
		console.log(cellBrightnesses);


	}, [image, rows, columns]);

	return (
		<section>

			<p>Play with these settings to change the quality and contrast of the image, which is previewed below.</p>

			<p>
				Minimum line density: &nbsp;
				<input type="number" size="7" value={minLineDensity} onChange={(event) => setMinLineDensity(parseInt(event.target.value, 10))} />
			</p>
			<p>
				Maximum line density: &nbsp;
				<input type="number" size="7" value={maxLineDensity} onChange={(event) => setMaxLineDensity(parseInt(event.target.value, 10))} />
			</p>
			<p>
				Horizontal lines: &nbsp;
				<input type="checkbox" checked={useHorizontalLines} onChange={(e) => setUseHorizontalLines(e.target.checked)} />

				<br />

				Vertical lines: &nbsp;
				<input type="checkbox" checked={useVerticalLines} onChange={(e) => setUseVerticalLines(e.target.checked)} />
			</p>

			<canvas ref={canvasRef} width={image.width} height={image.height} style={{ display: "none" }} />

			<br />
			<button onClick={() => setPage("dimensions")}>Next</button>
			<br />
			<button onClick={() => setPage("grid")}>Back</button>
			<br />

		</section>
	);
}

