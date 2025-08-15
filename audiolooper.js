// Shared audio playback and looping controls
// Designed to be used on pages with elements:
// #audio, #loop-btn, #play-btn, #start, #end, #speed, #speed-display

(function () {
  const audio = document.getElementById('audio');
  const loopBtn = document.getElementById('loop-btn');
  const playBtn = document.getElementById('play-btn');
  const startInput = document.getElementById('start');
  const endInput = document.getElementById('end');
  const speedInput = document.getElementById('speed');
  const speedDisplay = document.getElementById('speed-display');

  if (!audio) {
    // Nothing to do if audio element missing.
    return;
  }

  audio.preservesPitch = true;
  audio.mozPreservesPitch = true;
  audio.webkitPreservesPitch = true;

  let loopActive = false;
  let playActive = false;
  let loopHandler = null;

  function parseTime(t) {
    const parts = t.split(':');
    if (parts.length === 1) return parseFloat(parts[0]) || 0;
    return parseInt(parts[0], 10) * 60 + parseFloat(parts[1]);
  }

  loopBtn.addEventListener('click', () => {
    if (!loopActive) {
      playActive = false;
      playBtn.textContent = 'play piece';
      audio.pause();
      const start = parseTime(startInput.value);
      audio.currentTime = start;
      loopHandler = () => {
        const s = parseTime(startInput.value);
        const e = parseTime(endInput.value);
        if (audio.currentTime >= e) {
          audio.currentTime = s;
        }
      };
      audio.addEventListener('timeupdate', loopHandler);
      audio.play();
      loopBtn.textContent = 'stop';
      loopActive = true;
    } else {
      audio.pause();
      if (loopHandler) audio.removeEventListener('timeupdate', loopHandler);
      loopBtn.textContent = 'loop section';
      loopActive = false;
    }
  });

  playBtn.addEventListener('click', () => {
    if (!playActive) {
      loopActive = false;
      loopBtn.textContent = 'loop section';
      if (loopHandler) audio.removeEventListener('timeupdate', loopHandler);
      if (audio.paused) {
        audio.currentTime = 0;
      }
      audio.play();
      playBtn.textContent = 'stop';
      playActive = true;
    } else {
      audio.pause();
      playBtn.textContent = 'play piece';
      playActive = false;
    }
  });

  speedInput.addEventListener('input', () => {
    const r = parseFloat(speedInput.value);
    audio.playbackRate = r;
    speedDisplay.textContent = r.toFixed(2) + 'x';
  });
})();

