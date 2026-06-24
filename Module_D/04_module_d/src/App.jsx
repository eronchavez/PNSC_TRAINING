import { useEffect, useState, useCallback, useMemo, useRef } from "react";

const samplePhotoModules = import.meta.glob(
  "./assets/samplePhotos/*.{jpg,jpeg,png}",
  { eager: true },
);

const samplePhotos = Object.entries(samplePhotoModules).map(
  ([path, module]) => ({
    filename: path.split("/").pop(),
    src: module.default,
  }),
);

const commands = [
  {
    id: "mode-manual",
    label: "Change to Manual Mode",
    type: "mode",
    value: "manual",
  },
  {
    id: "mode-auto",
    label: "Change to Auto-play Mode",
    type: "mode",
    value: "auto",
  },
  {
    id: "mode-random",
    label: "Change to Random Mode",
    type: "mode",
    value: "random",
  },
  {
    id: "theme-a",
    label: "Change to Theme A",
    type: "theme",
    value: "a",
  },
  {
    id: "theme-b",
    label: "Change to Theme B",
    type: "theme",
    value: "b",
  },
  {
    id: "theme-c",
    label: "Change to Theme C",
    type: "theme",
    value: "c",
  },
  {
    id: "theme-d",
    label: "Change to Theme D",
    type: "theme",
    value: "d",
  },
  {
    id: "theme-e",
    label: "Change to Theme E",
    type: "theme",
    value: "e",
  },
  {
    id: "theme-f",
    label: "Change to Theme F",
    type: "theme",
    value: "f",
  },
  {
    id: "theme-g",
    label: "Change to Theme G",
    type: "theme",
    value: "g",
  },
  {
    id: "theme-h",
    label: "Change to Theme H",
    type: "theme",
    value: "h",
  },
];

const availableThemes = new Set(
  commands
    .filter((command) => command.type === "theme")
    .map((command) => command.value),
);

function App() {
  const [slides, setSlides] = useState([]);

  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  const [isDragging, setIsDragging] = useState(false);

  const [operatingMode, setOperatingMode] = useState("manual");

  const [displayTime, setDisplayTime] = useState(2);

  const [dragSlideIndex, setDragSlideIndex] = useState(null);
  const [thumbnailDropIndex, setThumbnailDropIndex] = useState(null);

  const [theme, setTheme] = useState("a");

  const [outGoingSlide, setOutGoingSlide] = useState(null);
  const [transitionKey, setTransitionKey] = useState(0);

  const [isCommandBarOpen, setIsCommandBarOpen] = useState(false);

  const [commandQuery, setCommandQuery] = useState("");

  const [selectedCommandIndex, setSelectedCommandIndex] = useState(0);

  const commandInputRef = useRef(null);

  const filteredCommands = useMemo(() => {
    const normalizedQuery = commandQuery.trim().toLowerCase();

    if (!normalizedQuery) return commands;
    return commands.filter((command) =>
      command.label.toLowerCase().includes(normalizedQuery),
    );
  }, [commandQuery]);

  const activeCommandIndex =
    filteredCommands.length > 0
      ? Math.min(selectedCommandIndex, filteredCommands.length - 1)
      : 0;

  function openCommandBar() {
    setIsCommandBarOpen(true);
    setCommandQuery("");
    setSelectedCommandIndex(0);
  }

  function closeCommandBar() {
    setIsCommandBarOpen(false);
    setCommandQuery("");
    setSelectedCommandIndex(0);
  }

  function executeCommand(command) {
    if (!command) return;

    if (command.type === "mode") {
      setOperatingMode(command.value);
    } else if (command.type === "theme") {
      setTheme(command.value);
    }

    closeCommandBar();
  }

  useEffect(() => {
    if (!isCommandBarOpen) return;

    commandInputRef.current?.focus();
  }, [isCommandBarOpen]);

  useEffect(() => {
    function handleCommandShortCut(e) {
      const target = e.target;

      const isEditableTarget =
        target instanceof HTMLElement &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.tagName === "SELECT" ||
          target.isContentEditable);

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        openCommandBar();
        return;
      }

      if (!isEditableTarget && e.key === "/") {
        e.preventDefault();
        openCommandBar();
        return;
      }
    }

    window.addEventListener("keydown", handleCommandShortCut);

    return () => window.removeEventListener("keydown", handleCommandShortCut);
  }, []);

  function handleCommandKeyDown(e) {
    if (e.key === "Escape") {
      e.preventDefault();
      closeCommandBar();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedCommandIndex((prev) => {
        if (filteredCommands.length === 0) return 0;
        return (prev + 1) % filteredCommands.length;
      });
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedCommandIndex((prev) => {
        if (filteredCommands.length === 0) return 0;
        return (prev - 1 + filteredCommands.length) % filteredCommands.length;
      });
    } else if (e.key === "Enter") {
      e.preventDefault();
      executeCommand(filteredCommands[activeCommandIndex]);
    }
  }

  useEffect(() => {
    document.body.setAttribute("data-theme", theme);
  }, [theme]);

  useEffect(() => {
    if (!outGoingSlide) return;
    const timeOut = setTimeout(() => {
      setOutGoingSlide(null);
    }, 1300);

    return () => clearTimeout(timeOut);
  }, [outGoingSlide, transitionKey]);

  const showSlide = useCallback(
    (nextIndex) => {
      if (slides.length === 0) return;

      const normalizedIndex = (nextIndex + slides.length) % slides.length;

      if (normalizedIndex === currentSlideIndex) return;

      setOutGoingSlide(
        theme === "b" || theme === "c" || theme === "h" ? slides[currentSlideIndex] : null,
      );
      setCurrentSlideIndex(normalizedIndex);
      setTransitionKey((prev) => prev + 1);
    },
    [currentSlideIndex, slides, theme],
  );

  function reorderSlides(fromIndex, toIndex) {
    const activeSlide = slides[currentSlideIndex];
    const nextSlides = [...slides];
    const [moveSlide] = nextSlides.splice(fromIndex, 1);
    nextSlides.splice(toIndex, 0, moveSlide);
    setSlides(nextSlides);

    setCurrentSlideIndex(Math.max(0, nextSlides.indexOf(activeSlide)));
  }

  function handleThumbnailDragStart(e, index) {
    console.log("drag start", index);
    setDragSlideIndex(index);
    setThumbnailDropIndex(index);
    e.dataTransfer.effectAllowed = "move";

    e.dataTransfer.setData("text/plain", String(index));
  }

  function handleThumbnailDragOver(e, index) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setThumbnailDropIndex(index);
  }

  function handleThumbnailDragDrop(e, index) {
    e.preventDefault();
    e.stopPropagation();

    const sourceIndex =
      dragSlideIndex ??
      Number.parseInt(e.dataTransfer.getData("text/plain"), 10);

    reorderSlides(sourceIndex, index);

    setDragSlideIndex(null);
    setThumbnailDropIndex(null);
  }

  function handleThumbnailDragEnd() {
    setDragSlideIndex(null);
    setThumbnailDropIndex(null);
  }

  function handleSlidePhotos(e) {
    const files = [...e.target.files];

    const images = files.map((file) => ({
      filename: file.name,
      src: URL.createObjectURL(file),
    }));

    setOutGoingSlide(null);
    setTransitionKey((prev) => prev + 1);
    setSlides(images);
    setCurrentSlideIndex(0);
  }

  function handleDragEnter(e) {
    e.preventDefault();
    setIsDragging(true);
  }

  function handleDragOver(e) {
    e.preventDefault();
  }

  function handleDragLeave(e) {
    e.preventDefault();
    setIsDragging(false);
  }

  function handleDrop(e) {
    e.preventDefault();
    e.stopPropagation();

    setIsDragging(false);

    const files = [...e.dataTransfer.files].filter((file) =>
      file.type.startsWith("image/"),
    );

    if (files.length === 0) return;

    const images = files.map((file) => ({
      filename: file.name,
      src: URL.createObjectURL(file),
    }));

    setOutGoingSlide(null);
    setTransitionKey((prev) => prev + 1);
    setSlides(images);
    setCurrentSlideIndex(0);
  }

  function generateCaption(filename) {
    const baseName = filename.replace(/\.[^/.]+$/, ""); // remove extension
    const words = baseName
      .replace(/[-_]+/g, " ") // replace underscore and hyphens with spaces
      .replace(/\s+/g, " ") // tab or moultiple spaces turns on one space
      .trim() // remove before and after space
      .split(" "); // split into an array of words

    return words
      .filter(Boolean)
      .map((word) => word[0].toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  }


  function handleLoadSamplePhotos() {
    setSlides(samplePhotos);
    setCurrentSlideIndex(0);
  }

  function goToPrev() {
    if (slides.length === 0) return;
    showSlide((prev) => (prev - 1 + slides.length) % slides.length);
  }

  function goToNext() {
    if (slides.length === 0) return;
    showSlide((prev) => (prev + 1) % slides.length);
  }

  // For Manual Control
  useEffect(() => {
    function handleKeyDown(e) {
      if (isCommandBarOpen) return;

      if (slides.length === 0) return;

      if (e.key === "ArrowLeft") {
        e.preventDefault();
        // goToPrev();
        showSlide(currentSlideIndex - 1);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        // goToNext();
        showSlide(currentSlideIndex + 1);
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [slides.length, currentSlideIndex, showSlide, isCommandBarOpen]);

  useEffect(() => {
    if (
      (operatingMode !== "auto" && operatingMode !== "random") ||
      slides.length === 0
    )
      return;

    const interval = setInterval(() => {
      if (operatingMode === "random") {
        //setCurrentSlideIndex(Math.floor(Math.random() * slides.length));
        showSlide(Math.floor(Math.random() * slides.length));
      } else {
        // setCurrentSlideIndex((prev) => (prev + 1) % slides.length);
        showSlide(currentSlideIndex + 1);
      }
    }, displayTime * 1000);

    return () => clearInterval(interval);
  }, [operatingMode, displayTime, slides, currentSlideIndex, showSlide]);

  useEffect(() => {
    setCurrentSlideIndex(0);
  }, [slides]);

 const currentSlide = slides[currentSlideIndex];

const captionWords = currentSlide
  ? generateCaption(currentSlide.filename).split(" ")
  : [];

  return (
    <div id="main-page">
      <div id="slide-show">
        {slides.length > 0 ? (
          <div id="slides">
            {(theme === "b" || theme === "c") && outGoingSlide ? (
              <figure
                key={`outgoing-${transitionKey}`}
                className="slide-frame slide-frame-outgoing"
              >
                <img
                  src={outGoingSlide.src}
                  alt={generateCaption(outGoingSlide.filename)}
                />
                <figcaption>
                  {generateCaption(outGoingSlide.filename)}
                </figcaption>
              </figure>
            ) : null}
            <figure
              key={`incoming-${transitionKey}`}
              className="slide-frame slide-frame-incoming"
            >
              <img
                src={slides[currentSlideIndex].src}
                alt={generateCaption(slides[currentSlideIndex].filename)}
              />
              <figcaption key={transitionKey}>
                {/* {generateCaption(slides[currentSlideIndex].filename)} */}
                {
                  captionWords.map((word,index) => (
                    <span 
                      key={`${transitionKey}-${index}`}
                      style={{
                          animationDelay: `${1000 + (index * 300)}ms`,
                        }}
                    >
                      {word + " "}
                    </span>
                  ))
                }
              
            </figcaption>

            </figure>

            
          </div>
        ) : (
          <p>No photos loaded</p>
        )}
      </div>
      <aside>
        <section>
          <div
            id="drop-zone"
            className={isDragging ? "dragging" : ""}
            onChange={handleSlidePhotos}
            onDragEnter={handleDragEnter}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <input type="file" accept="image/*" multiple />
          </div>

          <button onClick={handleLoadSamplePhotos}>Load Sample Photos</button>
        </section>

        <section id="controlImage">
          {slides.length > 0 ? (
            slides.map((slide, index) => (
              <img
                src={slide.src}
                alt={generateCaption(slide.filename)}
                key={`${slide.filename}-${index}`}
                draggable={true}
                onClick={() => showSlide(index)}
                onDragStart={(e) => handleThumbnailDragStart(e, index)}
                onDragOver={(e) => handleThumbnailDragOver(e, index)}
                onDrop={(e) => handleThumbnailDragDrop(e, index)}
                onDragEnd={handleThumbnailDragEnd}
                className={[
                  index === currentSlideIndex ? "active" : "",
                  index === dragSlideIndex ? "dragging" : "",
                  index === thumbnailDropIndex ? "drop-target" : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
              />
            ))
          ) : (
            <p>No slides</p>
          )}
        </section>

        <section>
          <label htmlFor="mode">Select mode: </label>
          <select
            name="mode"
            id="mode"
            value={operatingMode}
            onChange={(e) => {
              const nextMode = e.target.value;
              setOperatingMode(nextMode);
            }}
          >
            <option value="manual">Manual</option>
            <option value="auto">Auto</option>
            <option value="random">Random</option>
          </select>
        </section>

        <section>
          <label htmlFor="display-time">Set display time: </label>
          <input
            type="number"
            id="display-time"
            value={displayTime}
            onChange={(e) => setDisplayTime(Number(e.target.value))}
          />
        </section>

        <section>
          <label htmlFor="theme">Select Theme: </label>
          <select value={theme} onChange={(e) => setTheme(e.target.value)}>
            <option value="a">theme-a</option>
            <option value="b">theme-b</option>
            <option value="c">theme-c</option>
            <option value="d">theme-d</option>
            <option value="e">theme-e</option>
            <option value="f">theme-f</option>
            <option value="g">theme-g</option>
            <option value="h">theme-h</option>
          </select>
        </section>
      </aside>

      {isCommandBarOpen ? (
        <div
          className="command-bar-backdrop"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) closeCommandBar;
          }}
        >
          <div className="command-bar" onKeyDown={handleCommandKeyDown}>
            <h2 id="command-bar-title">Command Bar</h2>
            <input
              type="text"
              ref={commandInputRef}
              value={commandQuery}
              onChange={(e) => {
                setCommandQuery(e.target.value);
                setSelectedCommandIndex(0);
              }}
              placeholder="Type a Command"
            />

            <div id="command-options" className="command-options">
              {filteredCommands.length > 0 ? (
                filteredCommands.map((command, index) => (
                  <button
                    type="button"
                    id={command.id}
                    key={command.id}
                    className={index === activeCommandIndex ? "selected" : ""}
                    onMouseEnter={() => setSelectedCommandIndex(index)}
                    onClick={() => executeCommand(command)}
                  >
                    {command.label}
                  </button>
                ))
              ) : (
                <p className="command-empty">No Matching Commands</p>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default App;
