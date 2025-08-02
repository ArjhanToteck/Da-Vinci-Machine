"use client";

import { useRef, useState } from "react";
import HomePage from "./Home";
import Grid from "./Grid";
import LineDrawing from "./LineDrawing";
import Dimensions from "./Dimensions";
import Result from "./Result";

export default function Page() {
	const [page, setPage] = useState("home");
	const [image, setImage] = useState(null);
	const [linesData, setLinesData] = useState([]);

	// grid settings
	const [rows, setRows] = useState(50);
	const [columns, setColumns] = useState(50);

	// drawing settings
	const [minLineDensity, setMinLineDensity] = useState(0);
	const [maxLineDensity, setMaxLineDensity] = useState(4);
	const [useHorizontalLines, setUseHorizontalLines] = useState(true);
	const [useVerticalLines, setUseVerticalLines] = useState(true);

	// dimension settings
	const [physicalDrawingSize, setPhysicalDrawingSize] = useState([0, 0]);
	const [lockProportion, setLockProportion] = useState(true);
	const [offset, setOffset] = useState([5, 45, 0]);

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

				// TODO: this is kinda ridiculous, might wanna refactor this
				<LineDrawing
					image={image}
					rows={rows}
					columns={columns}
					setPage={setPage}
					minLineDensity={minLineDensity}
					setMinLineDensity={setMinLineDensity}
					maxLineDensity={maxLineDensity}
					setMaxLineDensity={setMaxLineDensity}
					useHorizontalLines={useHorizontalLines}
					setUseHorizontalLines={setUseHorizontalLines}
					useVerticalLines={useVerticalLines}
					setUseVerticalLines={setUseVerticalLines}
					setLinesData={setLinesData}
				/>
			}

			{
				// dimensions page
				page == "dimensions" &&
				<Dimensions
					setPage={setPage}
					physicalDrawingSize={physicalDrawingSize}
					setPhysicalDrawingSize={setPhysicalDrawingSize}
					lockProportion={lockProportion}
					setLockProportion={setLockProportion}
					offset={offset}
					setOffset={setOffset}
					image={image}
				/>
			}


			{
				// result page
				page == "result" &&
				<Result setPage={setPage} linesData={linesData} physicalDrawingSize={physicalDrawingSize} image={image} offset={offset} />
			}
		</main>
	);
}