const video = document.getElementById('myVideo');
    const playPauseBtn = document.getElementById('playPause');
    const rewindBtn = document.getElementById('rewind');
    const forwardBtn = document.getElementById('forward');

    playPauseBtn.addEventListener('click', () => {
      if (video.paused) {
        video.play();
        playPauseBtn.textContent = '⏸️ Pause';
      } else {
        video.pause();
        playPauseBtn.textContent = '▶️ Play';
      }
    });

    rewindBtn.addEventListener('click', () => {
      video.currentTime -= 10;
    });

    forwardBtn.addEventListener('click', () => {
      video.currentTime += 10;
    });