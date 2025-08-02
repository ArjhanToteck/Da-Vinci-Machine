export default class LineData {
	constructor(startPoint, endPoint, direction, combinationsChecked = false, y = 0) {
		Object.assign(this, { startPoint, endPoint, direction, combinationsChecked, y });
	}

	static Direction = Object.freeze({
		horizontal: "horizontal",
		vertical: "vertical"
	});
}