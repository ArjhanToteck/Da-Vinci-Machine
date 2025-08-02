import { useRef, useState } from "react";

export default function Home({ image, setImage, setPage }) {
	const [imageSrc, setImageSrc] = useState(image?.src);
	const imageRef = useRef(null);

	return (
		<section>

			<div>
				<p>
					I remember seeing some video a while ago where a dude stuck a pen to his printer and made it write an essay with Chat GPT or something. It's a cool idea, but instead, I only borrowed the concept of attaching a pen to my 3D printer and thought it'd be cool to draw some stuff.
				</p>

				<p>
					This converts image files into .gcode instructions for a 3D printer. I wrote most of it in the span of two school nights when I should've been studying for my calculus test.
				</p>

				<p>
					Upload an image to begin.
				</p>

				<br />

				<input onChange={(event) => uploadImage(event, setImageSrc)} id="imageInput" type="file"></input>

				<br />
				<br />

				<UploadPreview imageSrc={imageSrc} imageRef={imageRef} setImage={setImage} />

			</div>

			<br />
			<button onClick={() => setPage("grid")}>Next</button>
			<br />

		</section>
	);
}

function uploadImage(event, setImageSrc) {
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


function UploadPreview({ imageRef, imageSrc, setImage }) {
	return (
		<img src={imageSrc} ref={imageRef} onLoad={onLoad} style={{
			maxWidth: "50%",
			maxHeight: "30vh",
			objectFit: "contain",
		}} />
	);

	function onLoad() {
		// only need this if we're gonna set the dimensions
		if (!setImage) {
			return;
		}

		// create a copy of the image to store as a variable (for some reason storing the real element makes the dimensions change)
		const newImage = new Image(imageRef.current.width, imageRef.current.height);
		newImage.src = imageRef.current.src;

		setImage(newImage);
	}
}