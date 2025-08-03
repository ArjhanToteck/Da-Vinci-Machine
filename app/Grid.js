"use client";

import Image from "next/image";

export default function Grid({ image, rows, columns, setRows, setColumns, setPage }) {
	return (
		<section>

			<p>Split the image into squares. More squares will mean higher quality, but it can also mean lower contrast. There will be a rendered preview in the next step.</p>

			<p>
				Rows: &nbsp;
				<input type="number" value={rows} onChange={(event) => setRows(parseInt(event.target.value, 10))} />
			</p>
			<p>
				Columns: &nbsp;
				<input type="number" value={columns} onChange={(event) => setColumns(parseInt(event.target.value, 10))} />
			</p>

			<div style={{ position: "relative", width: image.width, height: image.height }}>
				<Image
					alt="A preview of the uploaded image with a grid drawn over it."
					src={image.src}
					width={image.width}
					height={image.height}
					style={{
						position: "absolute",
						top: 0,
						left: 0
					}} />
				{/* svg grid */}
				<svg
					width={image.width}
					height={image.height}
					style={{
						position: "absolute",
						top: 0,
						left: 0
					}}
				>
					{
						// horizontal lines
						Array.from({ length: rows }).map((line, i) => (
							<line
								key={i}
								stroke="var(--textAccentColor)"
								x1={0}
								x2={image.width}
								y1={(image.height / rows) * i}
								y2={(image.height / rows) * i}
							/>
						))
					}
					{
						// vertical lines
						Array.from({ length: columns }).map((line, i) => (
							<line
								key={i}
								stroke="var(--textAccentColor)"
								y1={0}
								y2={image.height}
								x1={(image.width / columns) * i}
								x2={(image.width / columns) * i}
							/>
						))}
				</svg>
			</div>

			<br />
			<button onClick={() => setPage("lineDrawing")}>Next</button>
			<br />
			<button onClick={() => setPage("home")}>Back</button>
			<br />

		</section>
	);
}

