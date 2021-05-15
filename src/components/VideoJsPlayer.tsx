// ref: https://gist.github.com/hamishrouse/4be2f37987cfe4af6a2c8a99e0ab5988

import * as React from "react"
import VideoJs from "video.js"

// Styles
import "video.js/dist/video-js.css"

export default class VideoPlayer extends React.Component<VideoJs.PlayerOptions> {
  private player?: VideoJs.Player
  private videoNode?: HTMLVideoElement

  constructor(props: VideoJs.PlayerOptions) {
    super(props)
    this.player = undefined
    this.videoNode = undefined
  }

  componentDidMount() {
    // instantiate video.js
    this.player = VideoJs(this.videoNode, this.props).ready(function () {
      // console.log('onPlayerReady', this);
    })
  }

  // destroy player on unmount
  componentWillUnmount() {
    if (this.player) {
      this.player.dispose()
    }
  }

  // wrap the player in a div with a `data-vjs-player` attribute
  // so videojs won't create additional wrapper in the DOM
  // see https://github.com/videojs/video.js/pull/3856
  render() {
    return (
      <div className="c-player">
        <div className="c-player__screen" data-vjs-player="true">
          <video ref={(node: HTMLVideoElement) => (this.videoNode = node)} className="video-js" />
        </div>
      </div>
    )
  }
}
