"use client";

import { useState } from "react";

export default function Page() {
	const [page, setPage] = useState("home");
	const [imageSrc, setImageSrc] = useState();
	const [rows, setRows] = useState(100);
	const [columns, setColumns] = useState(100);

	return (
		<main>
			<h1>da Vinci Machine</h1>
			{
				// home page
				page == "home" &&
				<form>

					<div>
						<p>
							I remember seeing some video a while ago where a dude stuck a pen to his printer and made it write an essay with Chat GPT or something. It's a cool idea, but instead, I only borrowed the concept of attaching a pen to my 3D printer and thought it'd be cool to draw some stuff.
						</p>

						<p>
							This converts image files into .gcode instructions for a 3D printer. I wrote 90% of it in the span of two school nights when I should've been studying for my calculus test.
						</p>

						<p>
							Upload an image to begin.
						</p>

						<br />

						<input onChange={uploadImage} id="imageInput" type="file"></input>

						<br />
						<br />

						<img src={imageSrc} width="100%" style={{
							maxWidth: "50%",
							maxHeight: "25vh",
							objectFit: "contain",
						}} />

					</div>

					<br />

					<button onClick={() => setPage("grid")}>Next</button>
				</form>
			}
			{
				// grid page
				page == "grid" &&

				<section>

					<p>
						Rows: &nbsp; <input type="number" size="7" value={rows} onChange={(e) => setRows(parseInt(e.target.value, 10))} />
					</p>
					<p>
						Columns: &nbsp; <input type="number" size="7" value={columns} onChange={(e) => setColumns(parseInt(e.target.value, 10))} />
					</p>

					<svg width={500} height={500}>
						{
							// TODO: place image behind and use real dimensions instead
							// loop for rows
							Array.from({ length: rows }).map((line, i) => (
								<line
									stroke={`var(--textAccentColor)`}
									x1={0}
									x2={500}
									// (columns + 1) and (i + 1) so it centers the lines well
									y1={(500 / (rows + 1)) * (i + 1)}
									y2={(500 / (rows + 1)) * (i + 1)}
								/>
							))
						}
						{
							// loop for columns
							Array.from({ length: columns }).map((line, i) => (
								<line
									stroke="var(--textAccentColor)"
									y1={0}
									y2={500}
									// (columns + 1) and (i + 1) so it centers the lines well
									x1={(500 / (columns + 1)) * (i + 1)}
									x2={(500 / (columns + 1)) * (i + 1)}
								/>
							))
						}
					</svg>

					<button onClick={() => setPage("home")}>Back</button>

				</section>
			}
		</main>
	);

	function uploadImage(event) {
		// get file upload
		const file = event.target.files[0];

		// make sure it's an image
		if (file && file.type.startsWith("image/")) {
			// store image for later use
			setImageSrc(URL.createObjectURL(file));
		} else {
			// TODO: catch non image
		}
	}
}