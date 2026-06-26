
import { useState, useEffect, useCallback } from 'react'


function generateCaption(filename)
{
  const base = filename.replace(/\.[^/.]+$/, "")
  return base 
    .replace(/[-_]+/g, " ")
    .split(/\s+/)
    .filter(Boolean)
    .map(word => word[0].toUpperCase() + word.slice(1).toLowerCase())
    .join(" ")
}

const sampleModules = import.meta.glob(
  "./assets/samplePhotos/*.{jpg,jpeg,png}",
  {eager: true}
)

const samplePhotos = Object.entries(sampleModules).map(
  ([path, image]) => ({
    filename: path.split("/").pop(),
    src: image.default
  })
)

function App() {

  const [slides, setSlides] = useState([])
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0)
  const [dragIndex, setDragIndex] = useState(null)
  const [dropIndex, setDropIndex] = useState(null)
  const [operatingMode, setOperatingMode] = useState("manual")
  const [displayTime, setDisplayTime] = useState(2)

  /**
   * This is for not overlapping slide, 
   * this function is to repeat the index when it surpassses the slide length
   */
  const showSlide = useCallback((nextIndex) => {
    if(slides.length === 0) return 
    const validSlideIndex = (nextIndex + slides.length) % slides.length 
    setCurrentSlideIndex(validSlideIndex)
  },[slides])

  /**
   * This is for manual control using key
   */
  useEffect(() => {

    function onKeyDown(e)
    {
      if (slides.length === 0) return 
      if (e.key === "ArrowRight") showSlide(currentSlideIndex  + 1)
      if (e.key === "ArrowLeft") showSlide(currentSlideIndex - 1)
    }

    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  },[slides.length, currentSlideIndex, showSlide])


  /**
   * This is for user can change operating mode
  */
  useEffect(() => {
    if(operatingMode == "manual" || slides.length === 0 ) return 
    const id = setInterval(() => {
      const next = operatingMode === "random"
        ? Math.floor(Math.random() * slides.length)
        : currentSlideIndex + 1
      showSlide(next)
    }, displayTime * 1000)

    return () => clearInterval(id)

  },[operatingMode, slides.length, currentSlideIndex, showSlide, displayTime])

  /**
   * 
   * @param {*} e
   * This function is for selected files. 
   */

  function handleFileInput(e)
  {
    const files = [...e.target.files]
      .filter(file => file.type.startsWith("image/"))

    if(!files.length) return e.target.value = ""

    setSlides(
      files.map(file => ({
        filename: file.name, 
        src: URL.createObjectURL(file)
      }))
    )
     e.target.value = ""
  }
  /**
   * This function is to load default photos
   */
  function handleLoadSamplePhotos()
  {
    setSlides(samplePhotos)
  }

  /**
   * This function is to move or re order slides
  */
  
  function reorderSlides(from, to)
  {
    const active = slides[currentSlideIndex]
    const next = [...slides]
    const [moved] = next.splice(from, 1)
    next.splice(to, 0, moved)
    setSlides(next)
    setCurrentSlideIndex(next.indexOf(active))
  }

  function toggleFullScreen()
  {
    document.documentElement.requestFullscreen()
  }
    
  
  useEffect(() => {
    setCurrentSlideIndex(0)
  },[slides])

  const current = slides[currentSlideIndex] || null 

  return (
    <div id="main-page">
      <div id="slide-show">
        {
          slides.length === 0
          ? (
              <p>No photos loaded</p>
            )
          : (
            <figure className="slide-frame">
              <img
                src={current.src}
                alt={generateCaption(current.filename)}
              />
              <figcaption>{generateCaption(current.filename)}</figcaption>
            </figure>
          )
        }
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
          {slides.map((slide,index) => (
            <img 
              key={slide.filename + index}
              src={slide.src}
              alt={generateCaption(slide.filename)}
              draggable
              className={[
                index === currentSlideIndex && "active",
                index === dragIndex && "dragging",
                index === dropIndex && "drop-target"
              ].filter(Boolean).join(" ")}
              onClick={() => showSlide(index)}
              onDragStart={() => setDragIndex(index)}
              onDragOver={(e) => {
                e.preventDefault()
                setDropIndex(index)
              }}
              onDrop={(e) => {
                e.preventDefault()
                reorderSlides(dragIndex, index)
                setDragIndex(null)
                setDropIndex(null)
              }}
              onDragEnd={() => {
                setDragIndex(null),
                setDropIndex(null)
              }}
            >
            
            </img>
          ))

          }

        </section>

        <section>
          <label htmlFor="mode">
            Mode: {" "}
          </label>
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

      </aside>
    </div>
  )
}

export default App
