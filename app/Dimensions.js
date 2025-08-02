import { useEffect } from "react";

// a good default max dimension to reasonably fit on most 3d printers (in other words what worked on my printer lol)
const defaultPhysicalSize = 175;

export default function Dimensions({ setPage, physicalDrawingSize, setPhysicalDrawingSize, lockProportion, setLockProportion, offset, setOffset, image }) {

	useEffect(() => {
		// set drawing size to size of image just to get the right proportion
		const newPhysicalDrawingSize = [image.width, image.height];

		// adjust for max physical size (as opposed to pixels)
		if (image.width > image.height) {
			// since the width is bigger, we'll set it to the max value and have the proportions adjust the height
			changePhysicalSize(0, 175, newPhysicalDrawingSize);
		} else {
			// since the height is bigger/the same as width, we'll set it to the max value and have the proportions adjust the width
			changePhysicalSize(1, 175, newPhysicalDrawingSize);
		}
	}, []);

	return (
		<section>
			<p>Finally, enter the physical dimensions of the image you want to draw. There is also an option for an offset, which is useful if your pen is not perfectly under the nozzle. Measure the distance from the tip of the nozzle to the tip of the pen in mm to calibrate for this difference.</p>
			<p>
				Physical drawing width (mm): &nbsp;
				<input type="number" size="7" value={physicalDrawingSize[0]} onChange={(event) => changePhysicalSize(0, parseInt(event.target.value, 10))} />
			</p>
			<p>
				Physical drawing height (mm): &nbsp;
				<input type="number" size="7" value={physicalDrawingSize[1]} onChange={(event) => changePhysicalSize(1, parseInt(event.target.value, 10))} />
			</p>
			<p>
				Lock proportion: &nbsp;
				<input type="checkbox" checked={lockProportion} onChange={(event) => setLockProportion(event.target.checked)} />
			</p>
			<p>

				Offset (mm): &nbsp;
				<input type="number" style={{ width: "5em" }} value={offset[0]} onChange={(event) => changeOffset(0, parseInt(event.target.value, 10))} />
				&nbsp; &nbsp;
				<input type="number" style={{ width: "5em" }} value={offset[1]} onChange={(event) => changeOffset(1, parseInt(event.target.value, 10))} />
				&nbsp; &nbsp;
				<input type="number" style={{ width: "5em" }} value={offset[2]} onChange={(event) => changeOffset(2, parseInt(event.target.value, 10))} />
			</p>

			<br />
			<button onClick={() => setPage("result")}>Next</button>
			<br />
			<button onClick={() => setPage("lineDrawing")}>Back</button>
			<br />
		</section>
	);

	function changeOffset(index, value) {
		// copy offset to modify it
		const newOffset = [...offset];

		newOffset[index] = value;
		setOffset(newOffset);
	}

	function changePhysicalSize(index, value, currentSize = physicalDrawingSize) {
		// index 0 = width and 1 = height

		// copy size to modify it
		const newPhysicalDrawingSize = [...currentSize];

		newPhysicalDrawingSize[index] = value;

		// locked proportions
		if (lockProportion) {
			// if index is 1, this is 0. if index is 0, this is 1.
			const oppositeIndex = 1 - index;

			// get proportion
			const proportion = currentSize[oppositeIndex] / currentSize[index];

			// apply proportion to other dimension
			newPhysicalDrawingSize[oppositeIndex] = newPhysicalDrawingSize[index] * proportion;
			console.log(newPhysicalDrawingSize);
		}

		// set state
		setPhysicalDrawingSize(newPhysicalDrawingSize);
	}
}