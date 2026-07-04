import { useState, useEffect, useCallback } from "react";

/**
 * 
 * @param {*} filename 
 * @returns 
 * 
 * The caption is defined by its filename,
 * This function is to fix the format, remove slugs
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

/**
 * Animation with outgoing slide only
 * @returns 
 */
const animated = new Set(["b", "c"]);
const COMMANDS = [];

function App() {
  const [slides, setSlides] = useState([]);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [operatingMode, setOperatingMode] = useState("manual");
  const [displayTime, setDisplayTime] = useState(2);
  const [theme, setTheme] = useState("a");
  const [outGoingSlide, setOutGoingSlide] = useState(null);
  const [transitionKey, setTransitionKey] = useState(0);

  useEffect(() => {
    document.body.dataset.theme = theme;
  }, [theme]);

  const showSlide = useCallback(
    (nextIndex) => {
      const validIndex = (nextIndex + slides.length) % slides.length;
      if (validIndex === currentSlideIndex) return;
      setOutGoingSlide(animated.has(theme) ? slides[currentSlideIndex] : null);
      setCurrentSlideIndex(validIndex);
      setTransitionKey(key => key + 1);
    },
    [slides, setOutGoingSlide, setTransitionKey, currentSlideIndex],
  );

  /**
   * To set full screen
   */
  function setFullScreen() {
    document.documentElement.requestFullscreen();
  }

  /**
   * To reset everything 
   */
  function resetButton() {
    setSlides([]);
    setCurrentSlideIndex(0);
    setOperatingMode("manual");
    setDisplayTime(2);
    setOutGoingSlide(null);
    setTransitionKey(0);
    setTheme("a");
    localStorage.removeItem("appState"); // Clear local storage when resetting
  }

  /**
   * This function is to handle the file being input by user
   * @param {*} e 
   * @returns 
   */
  function handleFileInput(e) {
    const files = [...e.target.files].filter((file) =>
      file.type.startsWith("image/"),
    );
    if (files.length === 0) {
      return (e.target.value = "");
    }
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
   * This is for user can next or prev the thumbnails
   * using arrow keys
   */
  useEffect(() => {
    if (slides.length === 0) return;
    function handleKeyDown(e) {
      if (e.key === "ArrowRight") showSlide(currentSlideIndex + 1);
      if (e.key === "ArrowLeft") showSlide(currentSlideIndex - 1);
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showSlide, currentSlideIndex, slides.length]);

  useEffect(() => {
    if (operatingMode === "manual") return;
    const id = setInterval(() => {
      if (operatingMode === "random") {
        showSlide(Math.floor(Math.random() * slides.length));
      } else if (operatingMode === "auto") {
        showSlide(currentSlideIndex + 1);
      }
    }, displayTime * 1000);
    return () => clearInterval(id);
  }, [operatingMode, showSlide, currentSlideIndex, slides, displayTime]);

  useEffect(() => {
    if (!outGoingSlide) return;
    const id = setTimeout(() => {
      setOutGoingSlide(null);
    }, 1000);
    return () => clearTimeout(id);
  }, [setOutGoingSlide, transitionKey]);

  useEffect(() => {
    const savedState = JSON.parse(localStorage.getItem("appState"));
    if (savedState) {
      setSlides(savedState.slides || []);
      setCurrentSlideIndex(savedState.currentSlideIndex || 0);
      setOperatingMode(savedState.operatingMode || "manual");
      setDisplayTime(savedState.displayTime || 2);
      setTheme(savedState.theme || "a");
    }
   
  }, []);

  
  useEffect(() => {
    const appState = {
      slides,
      currentSlideIndex,
      operatingMode,
      displayTime,
      theme,
    };
    try {
      localStorage.setItem("appState", JSON.stringify(appState));
    } catch (error) {
      console.error("Error saving to local storage:", error);
    }
  }, [slides, currentSlideIndex, operatingMode, displayTime, theme]);

  const current = slides[currentSlideIndex] || null;
  const captionWords = current ? generateCaption(current.filename).split(" ") : [];
  
  return (
    <div id="main-page">
      <div id="slideshow">
        {current === null ? (
          <p>No Photos Loaded Yet</p>
        ) : (
          <>
            {outGoingSlide && (
              <figure 
                className="slide-frame slide-frame-outgoing"
                key={`out-${transitionKey}`}
              >
                <img
                  src={outGoingSlide.src}
                  alt={generateCaption(outGoingSlide.filename)}
                />
                <figcaption>{generateCaption(outGoingSlide.filename)}</figcaption>
              </figure>
            )}
            <figure 
              className="slide-frame slide-frame-incoming"
              key={`in-${transitionKey}`}
            >
              <img src={current.src} alt={generateCaption(current.filename)} />
              <figcaption>
                {captionWords.map((word, index) => (
                  <span 
                    key={word + index}
                    style={{ animationDelay: `${1000 + (index * 300)}ms` }}
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
        <section id="drop-zone">
          <label>
            Dropzone:{" "}
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
              className={index === currentSlideIndex ? "active" : ""}
              onClick={() => showSlide(index)}
              draggable
            />
          ))}
        </section>
        <section>
          <label>
            Mode:{" "}
            <select
              value={operatingMode}
              onChange={(e) => setOperatingMode(e.target.value)}
            >
              <option value="manual">Manual</option>
              <option value="random">Random</option>
              <option value="auto">Auto</option>
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
            Theme: {" "}
            <select
              onChange={(e) => setTheme(e.target.value)}
              value={theme}
            >
              {["a", "b", "c", "d", "e", "f", "g", "h"].map((letter, index) => (
                <option key={index} value={letter}>{letter.toUpperCase()}</option>
              ))}
            </select>
          </label>
        </section>
        <section>
          <button onClick={setFullScreen}>Full Screen</button>
        </section>
        <section>
          <button onClick={resetButton}>Reset</button>
        </section>
      </aside>
    </div>
  );
}

export default App;