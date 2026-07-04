import { useState, useEffect, useCallback, useMemo } from "react";

function generateCaption(filename) {
  return filename
    .slice(0, filename.lastIndexOf("."))
    .replace(/[-_.]+/g, " ")
    .split(" ")
    .filter(Boolean)
    .map((word) => word[0].toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

const animated = new Set(["b", "c"]);

const storageKey = "photos_slideshow_state";

const defaultSlideShowState = {
  slides: [],
  operatingMode: "manual",
  currentSlideIndex: 0,
  displayTime: 2,
  theme: "a",
};

function getSavedSlideShowState() {
  try {
    const savedState = JSON.parse(localStorage.getItem(storageKey));
    if (!savedState) return defaultSlideShowState;

    const slides = savedState.slides;
    const currentSlideIndex = savedState.currentSlideIndex;

    return {
      slides,
      operatingMode: savedState.operatingMode,
      currentSlideIndex,
      displayTime: savedState.displayTime,
      theme: savedState.theme,
    };
  } catch (e) {
    console.log(e.error);
    return defaultSlideShowState;
  }
}

function App() {
  const savedSlideShowState = useMemo(() => getSavedSlideShowState(), []);

  const [slides, setSlides] = useState(savedSlideShowState.slides);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(
    savedSlideShowState.currentSlideIndex,
  );
  const [operatingMode, setOperatingMode] = useState(
    savedSlideShowState.operatingMode,
  );
  const [displayTime, setDisplayTime] = useState(
    savedSlideShowState.displayTime,
  );

  const [theme, setTheme] = useState("a");
  const [transitionKey, setTransitionKey] = useState(0);
  const [outgoingSlide, setOutgoingSlide] = useState(null);

  const [draggedIndex, setDraggedIndex] = useState(null);

  useEffect(() => {
    document.body.dataset.theme = theme;
  }, [theme]);

  const showSlide = useCallback(
    (nextIndex) => {
      if (slides.length === 0) return;

      const validIndex = (nextIndex + slides.length) % slides.length;
      if (validIndex === currentSlideIndex) return;

      setOutgoingSlide(animated.has(theme) ? slides[currentSlideIndex] : null);
      setCurrentSlideIndex(validIndex);
      setTransitionKey((key) => key + 1);
    },
    [slides, currentSlideIndex, theme],
  );

  function handleFileInput(e) {
    const files = [...e.target.files].filter((file) =>
      file.type.startsWith("image/"),
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

  function handleDragStart(e, index) {
    setDraggedIndex(index);
  }

  function handleDragOver(e)
  {
      e.preventDefault();
  }

  function handleDrop(e, dropIndex)
  {
    e.preventDefault();

    if(draggedIndex === null || draggedIndex === dropIndex) return;

    const newSlides = [...slides];

    [newSlides[draggedIndex], newSlides[dropIndex]] = [newSlides[dropIndex], newSlides[draggedIndex]];

    setSlides(newSlides);

    if(currentSlideIndex === draggedIndex)
    {
      setCurrentSlideIndex(dropIndex);
    }else if(currentSlideIndex === dropIndex)
    {
      setCurrentSlideIndex(draggedIndex);
    }

    setDraggedIndex(null);

  }

  useEffect(() => {
    function handleKeyDown(e) {
      if (slides.length === 0) return;
      if (e.key === "ArrowRight") showSlide(currentSlideIndex + 1);
      if (e.key === "ArrowLeft") showSlide(currentSlideIndex - 1);
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [slides, showSlide]);

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
  }, [slides, operatingMode, displayTime, currentSlideIndex, showSlide]);

  useEffect(() => {
    if (!outgoingSlide) return;
    const id = setTimeout(() => {
      setOutgoingSlide(null);
    }, 1000);

    return () => clearTimeout(id);
  }, [outgoingSlide, transitionKey]);

  useEffect(() => {
    try {
      localStorage.setItem(
        storageKey,
        JSON.stringify({
          slides,
          operatingMode,
          currentSlideIndex,
          displayTime,
          theme,
        }),
      );
    } catch (e) {
      console.log(e);
    }
  }, [slides, operatingMode, currentSlideIndex, displayTime]);

  const current = slides[currentSlideIndex] || null;
  const captionWords = current
    ? generateCaption(current.filename).split(" ")
    : [];

  return (
    <div id="main-page">
      <div id="slide-show">
        {slides.length === 0 ? (
          <p>No Loaded Photos</p>
        ) : (
          <>
            {outgoingSlide && (
              <figure
                key={`out-${transitionKey}`}
                className="slide-frame slide-frame-outgoing"
              >
                <img
                  src={outgoingSlide.src}
                  alt={generateCaption(outgoingSlide.filename)}
                />

                <figcaption>
                  {generateCaption(outgoingSlide.filename)}
                </figcaption>
              </figure>
            )}
            <figure
              key={`in-${transitionKey}`}
              className="slide-frame slide-frame-incoming"
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
        <section id="drop-zone">
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileInput}
          />
        </section>
        <section id="thumbnails">
          {slides.map((slide, index) => (
            <img
              src={slide.src}
              alt={generateCaption(slide.filename)}
              key={slide.filename + index}
              onClick={() => showSlide(index)}
              className={index === currentSlideIndex ? "active" : ""}
              draggable
              onDrag={(e) => handleDragStart(e, index)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e,index)}
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
            Theme:{" "}
            <select
              name="theme"
              id="theme"
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
            >
              {["a", "b", "c", "d", "e", "f", "g", "h"].map((word, index) => (
                <option key={index} value={word}>
                  {word.toUpperCase()}
                </option>
              ))}
            </select>
          </label>
        </section>
      </aside>
    </div>
  );
}

export default App;
