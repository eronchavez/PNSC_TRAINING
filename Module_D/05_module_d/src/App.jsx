import { useState, useEffect, useCallback, useMemo, useRef } from "react";

/**
 *
 * @param {*} filename
 * This function is for caption
 * @returns
 */
function generateCaption(filename) {
  const base = filename.replace(/\.[^/.]+$/, "");
  return base
    .replace(/[-_]+/g, " ")
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word[0].toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

const sampleModules = import.meta.glob(
  "./assets/samplePhotos/*.{jpg,jpeg,png}",
  { eager: true },
);

const samplePhotos = Object.entries(sampleModules).map(([path, image]) => ({
  filename: path.split("/").pop(),
  src: image.default,
}));

const commands = [
  {
    id: "mode-manual",
    label: "Change to Manual control mode",
    type: "mode",
    value: "manual",
  },
  {
    id: "mode-auto",
    label: "Change to Auto-play control mode",
    type: "mode",
    value: "auto",
  },
  {
    id: "mode-random",
    label: "Change to Random playing mode",
    type: "mode",
    value: "random",
  },

  ...["a", "b", "c", "d", "e", "f", "g", "h"].map((letter) => ({
    id: `theme-${letter}`,
    label: `Change to theme ${letter.toUpperCase()}`,
    type: "theme",
    value: letter,
  })),
];

function App() {
  const [slides, setSlides] = useState([]);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [dragIndex, setDragIndex] = useState(null);
  const [dropIndex, setDropIndex] = useState(null);
  const [operatingMode, setOperatingMode] = useState("manual");
  const [displayTime, setDisplayTime] = useState(2);
  const [theme, setTheme] = useState("a");
  const [outgoingSlide, setOutgoingSlide] = useState(null);
  const [transitionKey, setTransitionKey] = useState(0);

  const themesWithOutgoing = new Set(["b", "c", "h", "e"]);
  const [isCommandBarOpen, setIsCommandBarOpen] = useState(false);

  const [commandQuery, setCommandQuery] = useState("")
  const [selectedCommandIndex, setSelectedCommandIndex] = useState(0)
  const commandInputRef = useRef(null)

  useEffect(() => {
    if(isCommandBarOpen) commandInputRef.current?.focus()
  },[isCommandBarOpen])

  function executeCommand(command)
  {
    if (!command) return 
    if (command.type === "mode") setOperatingMode(command.value)
    if(command.type === "theme") setTheme(command.value)
    closeCommandBar()
  }

  function handleCommandKeyDown(e)
  {
    const max = filteredCommands.length 
    if(e.key === "Escape") closeCommandBar()
    else if (e.key === "ArrowDown") setSelectedCommandIndex(index => (index + 1) % max )
    else if (e.key === "ArrowUp") setSelectedCommandIndex(index => (index - 1 + max) % max)
    else if (e.key === "Enter") executeCommand(filteredCommands[selectedCommandIndex])
  }

  
  const filteredCommands = useMemo(() => {
    const query = commandQuery.trim().toLowerCase()
    return query ? commands.filter(command => command.label.toLowerCase().includes(query)) : commands
  })

  function openCommandBar() {
    setIsCommandBarOpen(true);
    setCommandQuery("")
    setSelectedCommandIndex(0)
  }

  function closeCommandBar() {
    setIsCommandBarOpen(false);
  }

  /**
   * This is for theme a-h
   */
  useEffect(() => {
    document.body.dataset.theme = theme;
  }, [theme]);

  /**
   * This is for not overlapping slide,
   * this function is to repeat the index when it surpassses the slide length
   */
  const showSlide = useCallback(
    (nextIndex) => {
      if (slides.length === 0) return;
      const validSlideIndex = (nextIndex + slides.length) % slides.length;
      if (validSlideIndex === currentSlideIndex) return;
      setOutgoingSlide(
        themesWithOutgoing.has(theme) ? slides[currentSlideIndex] : null,
      );
      setCurrentSlideIndex(validSlideIndex);
      setTransitionKey((prev) => prev + 1);
    },
    [slides, currentSlideIndex, theme],
  );

  /**
   *
   * @param {*} e
   * This function is for selected files.
   */

  function handleFileInput(e) {
    const files = [...e.target.files].filter((file) =>
      file.type.startsWith("image/"),
    );

    if (!files.length) return (e.target.value = "");

    setSlides(
      files.map((file) => ({
        filename: file.name,
        src: URL.createObjectURL(file),
      })),
    );
    e.target.value = "";
  }
  /**
   * This function is to load default photos
   */
  function handleLoadSamplePhotos() {
    setSlides(samplePhotos);
  }

  /**
   * This function is to move or re order slides
   */

  function reorderSlides(from, to) {
    const active = slides[currentSlideIndex];
    const next = [...slides];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    setSlides(next);
    setCurrentSlideIndex(next.indexOf(active));
  }

  /**
   * This function is to toggle full screen
   */
  function toggleFullScreen() {
    document.documentElement.requestFullscreen();
  }

  useEffect(() => {
    setCurrentSlideIndex(0);
  }, [slides]);

  /**
   * This is for manual control using key
   */
  useEffect(() => {
    function onKeyDown(e) {
      if (slides.length === 0) return;
      if (e.key === "ArrowRight") showSlide(currentSlideIndex + 1);
      if (e.key === "ArrowLeft") showSlide(currentSlideIndex - 1);
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [slides.length, currentSlideIndex, showSlide]);

  /**
   * This is for user can change operating mode
   */
  useEffect(() => {
    if (operatingMode == "manual" || slides.length === 0) return;
    const id = setInterval(() => {
      const next =
        operatingMode === "random"
          ? Math.floor(Math.random() * slides.length)
          : currentSlideIndex + 1;
      showSlide(next);
    }, displayTime * 1000);

    return () => clearInterval(id);
  }, [operatingMode, slides.length, currentSlideIndex, showSlide, displayTime]);

  useEffect(() => {
    if (!outgoingSlide) return;
    const id = setTimeout(() => setOutgoingSlide(null), 1000);
    return () => clearTimeout(id);
  }, [outgoingSlide, transitionKey]);

  const current = slides[currentSlideIndex] || null;
  const captionWords = current
    ? generateCaption(current.filename).split(" ")
    : [];

  return (
    <div id="main-page">
      <div id="slide-show">
        {slides.length === 0 ? (
          <p>No photos loaded</p>
        ) : theme === "d" ? (
          slides.slice(0, currentSlideIndex + 1).map((slide, index) => (
            <figure
              key={slide.src}
              className={`slide-frame-d ${index === currentSlideIndex ? "new-slide" : ""}`}
              style={{
                "--rotate": `${((index * 37) % 11) - 5}deg`,
                zIndex: index,
              }}
            >
              <img src={slide.src} alt={generateCaption(slide.filename)} />
              <figcaption>{generateCaption(slide.filename)}</figcaption>
            </figure>
          ))
        ) : theme === "e" ? (
          <div className="slide-frame-e" key={transitionKey}>
            <img
              className="incoming-a"
              src={current.src}
              alt={current.filename}
            />
            {outgoingSlide && (
              <div className="door door-left">
                <img src={outgoingSlide.src} alt={outgoingSlide.filename} />
              </div>
            )}
            {outgoingSlide && (
              <div className="door door-right">
                <img src={outgoingSlide.src} alt={outgoingSlide.filename} />
              </div>
            )}
          </div>
        ) : (
          <>
            {outgoingSlide && (
              <figure
                key={`out-${transitionKey}`}
                className="slide-frame slide-frame-outgoing"
              >
                <img src={outgoingSlide.src} alt={outgoingSlide.filename} />
                <figcaption>
                  {generateCaption(outgoingSlide.filename)}
                </figcaption>
              </figure>
            )}

            <figure
              key={`in-${transitionKey}`}
              className="slide-frame slide-frame-incoming"
            >
              <img src={current.src} alt={current.filename} />
              <figcaption>
                {captionWords.map((word, index) => (
                  <span
                    key={index}
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
          <p>Controls</p>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileInput}
          />
          <button onClick={handleLoadSamplePhotos}>Load Sample Photos</button>
        </section>

        <section id="thumbnails">
          {slides.map((slide, index) => (
            <img
              key={slide.filename + index}
              src={slide.src}
              alt={generateCaption(slide.filename)}
              draggable
              className={[
                index === currentSlideIndex && "active",
                index === dragIndex && "dragging",
                index === dropIndex && "drop-target",
              ]
                .filter(Boolean)
                .join(" ")}
              onClick={() => showSlide(index)}
              onDragStart={() => setDragIndex(index)}
              onDragOver={(e) => {
                e.preventDefault();
                setDropIndex(index);
              }}
              onDrop={(e) => {
                e.preventDefault();
                reorderSlides(dragIndex, index);
                setDragIndex(null);
                setDropIndex(null);
              }}
              onDragEnd={() => {
                (setDragIndex(null), setDropIndex(null));
              }}
            ></img>
          ))}
        </section>

        <section>
          <label htmlFor="mode">Mode: </label>
          <select
            id="mode"
            value={operatingMode}
            onChange={(e) => setOperatingMode(e.target.value)}
          >
            <option value="manual">Manual</option>
            <option value="auto">Auto</option>
            <option value="random">Random</option>
          </select>
        </section>

        <section>
          <label htmlFor="displayTime">Display time: </label>
          <input
            type="number"
            min={1}
            value={displayTime}
            onChange={(e) => setDisplayTime(Number(e.target.value))}
          />
        </section>

        <section>
          <button onClick={toggleFullScreen}>Full screen</button>
        </section>

        <section>
          <label htmlFor="theme">Theme: </label>
          <select
            name="theme"
            id="theme"
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
          >
            {["a", "b", "c", "d", "e", "f", "g", "h"].map((letter) => (
              <option key={letter} value={letter}>
                Theme: {letter.toUpperCase()}
              </option>
            ))}
          </select>
        </section>
        <section>
          <button onClick={openCommandBar}>Open Command Bar</button>
        </section>
      </aside>

      {isCommandBarOpen && (
        <div
          className="command-bar-backdrop"
          onMouseDown={(e) =>
            e.target === e.currrentTarget && closeCommandBar()
          }
        >
          <div className="command-bar" onKeyDown={handleCommandKeyDown}>
           <input
              value={commandQuery}
              onChange={(e) => setCommandQuery(e.target.value)}
              placeholder="Type a command..."
              ref={commandInputRef}
           />
           <div
            className="command-options"
           >
            {filteredCommands.length === 0 ? 
              (
                <p>No matching commands</p>
              ) :
              (
                filteredCommands.map(
                  (command,index) => 
                  <button 
                    key={command.id}
                    className={index === selectedCommandIndex ? "selected" : ""}
                    onMouseEnter={() => setSelectedCommandIndex(index)}
                    onClick={() => executeCommand(command)}   
                  >
                    {command.label}
                  </button>
                )
              )

            }
           </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
