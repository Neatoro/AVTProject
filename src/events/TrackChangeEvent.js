class TrackChangeEvent extends Event {
  constructor(trackId) {
    super("track_changed");
    this.trackId = trackId;
  }
}

export default TrackChangeEvent;
