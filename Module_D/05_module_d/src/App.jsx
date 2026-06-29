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
]

const storageKey = "photo_slideshow_state"
const defaults = 
{
  slides: [],
  operatingMode: "manual",
  currentSlideIndex: 0,
  displayTime: 2,
  theme: "a"
}

function loadSavedState()
{
  try 
  {
    const raw = localStorage.getItem(storageKey)
    const saved = raw ? JSON.parse(raw) : null 
    return saved ? {...defaults, ...saved} : defaults
  }catch 
  {
    return defaults
  }
}

function App() {
  const initial = useMemo(loadSavedState, [])
  const [slides, setSlides] = useState(initial.slides);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(initial.currentSlideIndex);
  const [dragIndex, setDragIndex] = useState(null);
  const [dropIndex, setDropIndex] = useState(null);
  const [operatingMode, setOperatingMode] = useState(initial.operatingMode);
  const [displayTime, setDisplayTime] = useState(initial.displayTime);
  const [theme, setTheme] = useState(initial.theme);
  const [outgoingSlide, setOutgoingslide] = useState(null);
  const [transitionKey, setTransitionKey] = useState(0);

  const themesWithOutgoing = new Set(["b", "c", "h", "e"]);
  const [isCommandBarOpen, setIsCommandBarOpen] = useState(false);

  const [commandQuery, setCommandQuery] = useState("")
  const [selectedCommandIndex, setSelectedCommandIndex] = useState(0)
  const commandInputRef = useRef(null)

  

  useEffect(() => {
    const state = {slides,operatingMode, currentSlideIndex,displayTime,theme}
    try 
    {
      localStorage.setItem(storageKey, JSON.stringify(state))
    }catch{}
  },[slides,operatingMode,currentSlideIndex,displayTime,theme])

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
    if(filteredCommands.length === 0) return 
    const max = filteredCommands.length 
    if(e.key === "Escape") closeCommandBar()
    else if (e.key === "ArrowDown") setSelectedCommandIndex(index => (index + 1) % max )
    else if (e.key === "ArrowUp") setSelectedCommandIndex(index => (index - 1 + max) % max)
    else if (e.key === "Enter") executeCommand(filteredCommands[selectedCommandIndex])
  }

  
  const filteredCommands = useMemo(() => {
    const query = commandQuery.trim().toLowerCase()
    return query ? commands.filter(command => command.label.toLowerCase().includes(query)) : commands
  }, [])

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
      setOutgoingslide
      (
        themesWithOutgoing.has(theme) ? slides[currentSlideIndex] : null,
      );
      setCurrentSlideIndex(validSlideIndex);
      setTransitionKey((prev) => prev + 1);
    },
    [slides, currentSlideIndex, theme],
  );

  function readFile(file, asDataURL)
  {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result)
      reader.onerror = () => reject(reader.error)
      asDataURL ? reader.readAsDataURL(file) : reader.readAsText(file)
    })
  }

  async function srcToDataURL(src)
  {
    if (src.startsWith("data: ")) return src
    const blob = await(await fetch(src)).blob()
    return readFile(blob, true)
  }

  async function handleImportSlides(e)
  {
    const [file] = e.target.files 
    if(!file) return 

    try{
      const importedData = JSON.parse(await readFile(file, false))
      const importedSlides = Array.isArray(importedData.slides)
        ? importedData.slides.map((slide,index) => ({
          filename: slide.filename,
          src: slide.photo
        }))

        :  []

      // const validSlides = importedSlides.filter()
      setSlides(importedSlides)
      setTheme(importedData.theme)
     setOutgoingslide
     (null)
      setCurrentSlideIndex(0)
      setTransitionKey(prev => prev + 1)
    }catch(e)
    {
      console.log(e)
    }finally{
      e.target.value = ''
    }
  }

  /**
   * This function is to export slideshow and themes
   */
   async function handleExportSlides()
  {

    const exportedAt = new Date()
    // const exportTimeStamp = formatExportTimeStamp()

    const exportData = {
      exportedAt: exportedAt,
      theme: theme, 
      slides: await Promise.all(slides.map(
        async(slide,index) => ({
          index, 
          filename: slide.filename,
          caption: generateCaption(slide.filename),
          photo: await srcToDataURL(slide.src)
        }))
      )
    }

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: "application/json",
    })

    const url = URL.createObjectURL(blob)

    const link = document.createElement("a")
    link.href=url
    link.download=`${exportedAt}.json`
    document.body.append(link)
    link.click()
    link.remove()
    URL.revokeObjectURL(url)

  }

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
    const id = setTimeout(() =>setOutgoingslide
    (null), 1000);
    return () => clearTimeout(id);
  }, [outgoingSlide, transitionKey]);

  
  useEffect(() => {
    function onKeyDown(e)
    {
      const typingField = ["INPUT", "TEXTAREA", "SELECT"].includes(e.target.tagName)
      if((e.ctrlKey) && e.key.toLowerCase() === "k")
      {
        e.preventDefault() 
        
        openCommandBar()
      }else if (e.key === "/" && !typingField)
      {
        e.preventDefault()
        openCommandBar()
      }
    }

    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)

  },[])

  function handleReset()
  {
    setSlides([])
    setCurrentSlideIndex(0)
    setOperatingMode("manual")
    setTheme("a")
    setDisplayTime(2)
    setOutgoingslide
    (null)
  }

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
          <button onClick={handleExportSlides}>Export</button>
        </section>
        <section>
          <label htmlFor="import">Import</label>
          <input 
            type="file" 
            accept="application/json"
            onChange={handleImportSlides}  
          />
        </section>
        <section>
          <button onClick={handleReset}>
            Reset
          </button>
        </section>
      </aside>

      {isCommandBarOpen && (
        <div
          className="command-bar-backdrop"
          onMouseDown={(e) =>
            e.target === e.currentTarget && closeCommandBar()
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
