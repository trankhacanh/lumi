import react, { use } from "react";
import { useRef } from "react";

function VideoPlayer() {
    const videoTag = useRef();
    const [mute, setMute] = react.useState(true);
    const [isPlaying, setIsPlaying] = react.useState(false);

    const handleClick = () => {
        if (isPlaying) {
            videoTag.current.pause();
            setIsPlaying(false);
        } else {
            videoTag.current.play();
            setIsPlaying(true);
        }
    }
    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            const video = videoTag.current;
            if (entry.isIntersecting) {
                video.play();
                setIsPlaying(true);
            } else {
                video.pause();
                setIsPlaying(false);
            }
        }, { threshold: 0.6 });

        if (videoTag.current) {
            observer.observe(videoTag.current);
        }
        return () => {
            if (videoTag.current) {
                observer.unobserve(videoTag.current);
            }
        };
    }, []);

    return (
        <div>VideoPlayer</div>
    );
}
export default VideoPlayer;