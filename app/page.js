"use client";

import { useRef, useState } from "react";
import HomePage from "./Home";
import Grid from "./Grid";
import LineDrawing from "./LineDrawing";

export default function Page() {
	const [page, setPage] = useState("home");
	const [image, setImage] = useState(null);
	const [rows, setRows] = useState(100);
	const [columns, setColumns] = useState(100);

	return (
		<main>
			<h1>da Vinci Machine</h1>
			{
				// home page
				page == "home" &&
				<HomePage image={image} setImage={setImage} setPage={setPage} />
			}

			{
				// grid page
				page == "grid" &&

				<Grid image={image} rows={rows} columns={columns} setRows={setRows} setColumns={setColumns} setPage={setPage} />
			}

			{
				// lines page
				page == "lineDrawing" &&
				<LineDrawing image={image} rows={rows} columns={columns} setPage={setPage} />
			}
		</main>
	);
}