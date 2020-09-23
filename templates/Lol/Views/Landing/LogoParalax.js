import { useSpring, animated } from "react-spring";
import lol from "files/lol-logo.png";
import ch5 from "files/ch5.png";

const calc = (x, y) => [x - window.innerWidth / 2, y - window.innerHeight / 2];
const trans1 = (x, y) => `translate3d(${x / 10}px,${y / 10}px,0)`;
const trans2 = (x, y) => `translate3d(${x / 8}px,${y / 8 - 120}px,0)`;

const Paralax = () => {
	const [props, set] = useSpring(() => ({
		xy: [0, 0],
		config: { mass: 20, tension: 300, friction: 100 },
	}));

	return (
		<div
			className="lgp"
			onMouseMove={({ clientX: x, clientY: y }) =>
				set({ xy: calc(x, y) })
			}>
			<animated.div
				className="lol lol1"
				style={{
					transform: props.xy.interpolate(trans1),
				}}>
				<img src={lol} />
				<div className="abg" />
			</animated.div>

			<animated.div
				className="lol lol6"
				style={{
					transform: props.xy.interpolate(trans2),
				}}>
				<img src={ch5} />
			</animated.div>
		</div>
	);
};

export default Paralax;
