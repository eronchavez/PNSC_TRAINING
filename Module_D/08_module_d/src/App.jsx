import { useCallback, useEffect, useState } from "react";
/**
 * This function is to remove underscore and unnecesary spaces according to the test project
 * @param {*} filename
 * @returns
 */
function generateCaption(filename) {
  return filename
    .slice(0, filename.lastIndexOf("."))
    .replace(/[-_.]+/g, " ")
    .split(" ")
    .filter(Boolean)
    .map((word) => word[0].toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

export default function App() {
  const [slides, setSlides] = useState([]);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  const [operatingMode, setOperatingMode] = useState("manual");
  const [displayTime, setDisplayTime] = useState(2);

  const [theme, setTheme] = useState("a");
  const animated = new Set(["b", "c"]);
  const [outGoingSlide, setOutGoingSlide] = useState(null);
  const [transitionKey, setTransitionKey] = useState(0);

  const [draggedIndex, setDraggedIndex] = useState(null);

  function handleDragStart(e, index) {
    setDraggedIndex(index);
  }

  function handleDragOver(e) {
    e.preventDefault();
  }

  function handleDrop(e, dropIndex) {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === dropIndex) return;
    const newSlides = [...slides];
    [newSlides[draggedIndex], newSlides[dropIndex]] = [
      newSlides[dropIndex],
      newSlides[draggedIndex],
    ];

    setSlides(newSlides);

    if (currentSlideIndex === draggedIndex) setCurrentSlideIndex(dropIndex);
    else if (currentSlideIndex === dropIndex)
      setCurrentSlideIndex(draggedIndex);

    setDraggedIndex(null);
  }

  useEffect(() => {
    document.body.dataset.theme = theme;
  }, [theme]);

  const showSlide = useCallback(
    (nextIndex) => {
      const validIndex = (nextIndex + slides.length) % slides.length;
      if (validIndex === currentSlideIndex) return;
      setOutGoingSlide(animated.has(theme) ? slides[currentSlideIndex] : null);
      setTransitionKey((key) => key + 1);
      setCurrentSlideIndex(validIndex);
    },
    [slides.length, currentSlideIndex],
  );

  useEffect(() => {
    if (!outGoingSlide) return;
    const id = setTimeout(() => setOutGoingSlide(null), 1000);
    return () => clearTimeout(id);
  }, [setOutGoingSlide, transitionKey]);

  /**
   * this function handle file input
   * @param {*} e
   * @returns
   */
  function handleFileInput(e) {
    const files = [...e.target.files].filter((file) =>
      file.type.startsWith("image"),
    );

    if (files.length === 0) return (e.target.value = "");

    setSlides(
      files.map((file) => ({
        filename: file.name,
        src: URL.createObjectURL(file),
      })),
    );

    e.target.value = "";
    setCurrentSlideIndex(0);
  }

  /**
   * this useEffect allows user to use keyboard to next or prev thumbnails
   */
  useEffect(() => {
    if (slides.length === 0) return;

    function handleKeyDown(e) {
      if (e.key === "ArrowRight") showSlide(currentSlideIndex + 1);
      if (e.key === "ArrowLeft") showSlide(currentSlideIndex - 1);
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [slides.length, showSlide, currentSlideIndex]);

  /**
   * this useffect allows user to choose between operating modes.
   */
  useEffect(() => {
    if (operatingMode === "manual") return;

    const id = setInterval(() => {
      if (operatingMode === "random")
        showSlide(Math.floor(Math.random() * slides.length));
      else if (operatingMode === "auto") showSlide(currentSlideIndex + 1);
    }, displayTime * 1000);

    return () => clearInterval(id);
  }, [operatingMode, displayTime, currentSlideIndex, showSlide]);

  function setFullScreen() {
    document.documentElement.requestFullscreen();
  }

  function resetButton() {
    setSlides([]);
    setCurrentSlideIndex(0);
    setOperatingMode("manual");
    setDisplayTime(2);
    setOutGoingSlide(null);
    setTheme("a");
  }

  const current = slides[currentSlideIndex] || null;
  const captionWords = current
    ? generateCaption(current.filename).split(" ")
    : [];

  return (
    <div id="main-page">
      <div id="slide-show">
        {current === null ? (
          <p>No Photos Loaded yet</p>
        ) : (
          <>
            {outGoingSlide && (
              <figure
                className="slide-frame-outgoing slide-frame"
                key={`out-${transitionKey}`}
              >
                <img
                  src={outGoingSlide.src}
                  alt={generateCaption(outGoingSlide.filename)}
                />
                <figcaption>
                  {generateCaption(outGoingSlide.filename)}
                </figcaption>
              </figure>
            )}

            <figure
              className="slide-frame-incoming slide-frame"
              key={`in-${transitionKey}`}
            >
              <img src={current.src} alt={generateCaption(current.filename)} />
              <figcaption>
                {captionWords.map((word, index) => (
                  <span
                    key={word + index}
                    style={{ animationDelay: `${1000 + index * 300}ms` }}
                  >
                    {word}&nbsp;
                  </span>
                ))}
              </figcaption>
            </figure>
          </>
        )}
      </div>
      <aside>
        <section id="dropZone">
          <label>
            Drop Zone: {""}
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileInput}
            />
          </label>
        </section>
        <section id="thumbnails">
          {slides.map((slide, index) => (
            <img
              src={slide.src}
              alt={generateCaption(slide.filename)}
              key={slide.filename + index}
              className={currentSlideIndex === index ? "active" : ""}
              onClick={() => showSlide(index)}
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, index)}
            />
          ))}
        </section>
        <section>
          <label>
            Operating Mode: {""}
            <select
              value={operatingMode}
              onChange={(e) => setOperatingMode(e.target.value)}
            >
              <option value="manual">Manual</option>
              <option value="auto">Auto</option>
              <option value="random">Random</option>
            </select>
          </label>
        </section>
        <section>
          <label>
            Display Time:{" "}
            <input
              type="number"
              value={displayTime}
              onChange={(e) => setDisplayTime(Number(e.target.value))}
            />
          </label>
        </section>
        <section>
          <label>
            Theme: {""}
            {
              <select onChange={(e) => setTheme(e.target.value)} value={theme}>
                {["a", "b", "c", "d", "e", "f", "g", "h"].map(
                  (letter, index) => (
                    <option key={index}>{letter.toLowerCase()}</option>
                  ),
                )}
              </select>
            }
          </label>
        </section>
        <section>
          <button onClick={() => setFullScreen()}>Full Screen</button>
          <button onClick={() => resetButton()}>Reset</button>
        </section>
      </aside>
    </div>
  );
}
