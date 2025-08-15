// Shared audio playback and looping controls
// Designed to be used on pages with elements:
// #audio, #loop-btn, #play-btn, #loops, #add-loop, #speed, #speed-display

(function () {
  const audio = document.getElementById('audio');
  const loopBtn = document.getElementById('loop-btn');
  const playBtn = document.getElementById('play-btn');
  const loopsContainer = document.getElementById('loops');
  const addLoopBtn = document.getElementById('add-loop');
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
  let currentLoopIndex = 0;

  function parseTime(t) {
    const parts = t.split(':');
    if (parts.length === 1) return parseFloat(parts[0]) || 0;
    return parseInt(parts[0], 10) * 60 + parseFloat(parts[1]);
  }

  function formatTime(sec) {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  }

  let loops = [];
  if (loopsContainer) {
    loops = Array.from(loopsContainer.querySelectorAll('.loop')).map((el) => ({
      start: el.querySelector('.start'),
      end: el.querySelector('.end')
    }));
  }

  if (addLoopBtn && loopsContainer) {
    addLoopBtn.addEventListener('click', () => {
      const last = loops[loops.length - 1];
      const startVal = last.end.value;
      const startSec = parseTime(startVal);
      const endSec = startSec + 10;

      const loopDiv = document.createElement('div');
      loopDiv.className = 'loop';

      const startLabel = document.createElement('label');
      startLabel.textContent = 'start ';
      const startInput = document.createElement('input');
      startInput.type = 'text';
      startInput.size = 5;
      startInput.className = 'start';
      startInput.value = startVal;
      startLabel.appendChild(startInput);

      const endLabel = document.createElement('label');
      endLabel.textContent = 'end ';
      const endInput = document.createElement('input');
      endInput.type = 'text';
      endInput.size = 5;
      endInput.className = 'end';
      endInput.value = formatTime(endSec);
      endLabel.appendChild(endInput);

      loopDiv.appendChild(startLabel);
      loopDiv.appendChild(endLabel);
      loopsContainer.appendChild(loopDiv);
      loops.push({ start: startInput, end: endInput });
    });
  }

  loopBtn.addEventListener('click', () => {
    if (!loopActive) {
      playActive = false;
      playBtn.textContent = 'play piece';
      audio.pause();
      currentLoopIndex = 0;
      const start = parseTime(loops[0].start.value);
      audio.currentTime = start;
      loopHandler = () => {
        const e = parseTime(loops[currentLoopIndex].end.value);
        if (audio.currentTime >= e) {
          currentLoopIndex = (currentLoopIndex + 1) % loops.length;
          audio.currentTime = parseTime(loops[currentLoopIndex].start.value);
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

