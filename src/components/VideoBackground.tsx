import YouTube from "react-youtube"

export function VideoBackground() {
	const opts = {
		playerVars: {
			autoplay: 1,
			controls: 0,
			disablekb: 1,
			loop: 1,
			fs: 0,
			iv_load_policy: 3,
			showInfo: 0,
			mute: 1,
			modestbranding: 1,
			playlist: process.env.NEXT_PUBLIC_VIDEO_ID,
		},
	}
	return (
		<YouTube
			videoId={process.env.NEXT_PUBLIC_VIDEO_ID}
			opts={opts}
			className='video foo'
			iframeClassName='video'
		/>
	)
}
