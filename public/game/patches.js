(function fixAudio() {
  const unlock = () => {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;

    const ctx = new AudioCtx();
    if (ctx.state === "suspended") {
      ctx.resume();
    }

    document.removeEventListener("click", unlock);
    document.removeEventListener("keydown", unlock);
  };

  document.addEventListener("click", unlock);
  document.addEventListener("keydown", unlock);
})();
function changeLevel(levelData) {
  XMLHttpRequest.prototype.send = function (...args) {
    this.addEventListener("readystatechange", function () {
      if (
        this.readyState === 4 &&
        levelData &&
        typeof this._url === "string" &&
        this._url.includes("1.txt")
      ) {
        Object.defineProperty(this, "responseText", {
          value: levelData
        });
      }
    });

    return send.apply(this, args);
  };
};
