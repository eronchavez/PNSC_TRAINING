import { useEffect } from 'react'
import { useState } from 'react'

 const samplePhotoModules = import.meta.glob(
    './assets/samplePhotos/*.{jpg,jpeg,png}',
    {eager: true}
  )

  const samplePhotos = Object.entries(samplePhotoModules).map(([path, module]) => ({
    filename: path.split('/').pop(),
    src: module.default
  }))
  

function App() {
  
  const [slides, setSlides] = useState([])

  const [currentSlideIndex, setCurrentSlideIndex] = useState(0)

  const [isDragging, setIsDragging] = useState(false)

  const [operatingMode, setOperatingMode] = useState("manual")

  const [displayTime, setDisplayTime] = useState(2)

 


  function handleSlidePhotos(e)
  {
    const files = [...e.target.files]

    const images = files.map(file => ({
        filename: file.name,
        src: URL.createObjectURL(file)
      })
    )
    setSlides(images)
    setCurrentSlideIndex(0)
  } 


  function handleDragEnter(e)
  {
    e.preventDefault()
    setIsDragging(true)
  }

  function handleDragOver(e)
  {
    e.preventDefault()
  }

  function handleDragLeave(e)
  {
    e.preventDefault()
    setIsDragging(false)
  }

  function handleDrop(e)
  {
    e.preventDefault()
    e.stopPropagation()

    setIsDragging(false)

    const files = [...e.dataTransfer.files].filter(file => 
      file.type.startsWith("image/")
    )


    if(files.length === 0) return 

    const images = files.map(file => ({
      filename: file.name, 
      src: URL.createObjectURL(file)  
    }))


    setSlides(images)
    setCurrentSlideIndex(0)

  }



  function generateCaption(filename)
  { 
    const baseName = filename.replace(/\.[^/.]+$/, "") // remove extension
    const words = baseName 
      .replace(/[-_]+/g, " ") // replace underscore and hyphens with spaces
      .replace(/\s+/g, " ") // tab or moultiple spaces turns on one space 
      .trim() // remove before and after space
      .split(" ") // split into an array of words

    return words 
    .filter(Boolean)
    .map(word => word[0].toUpperCase() + word.slice(1).toLowerCase())
    .join(" ")
  }


  function handleLoadSamplePhotos() 
  {
    setSlides(samplePhotos)
    setCurrentSlideIndex(0)
  }


  function goToPrev() {
  if (slides.length === 0) return
  setCurrentSlideIndex(prev => (prev - 1 + slides.length) % slides.length)
}

function goToNext() {
  if (slides.length === 0) return
  setCurrentSlideIndex(prev => (prev + 1) % slides.length)
}

// For Manual Control
useEffect(() => {
  function handleKeyDown(e) {
    if (slides.length === 0) return

    if (e.key === "ArrowLeft") {
      e.preventDefault()
      goToPrev()
    } else if (e.key === "ArrowRight") {
      e.preventDefault()
      goToNext()
    }
  }

  window.addEventListener("keydown", handleKeyDown)

  return () => {
    window.removeEventListener("keydown", handleKeyDown)
  }
}, [slides.length])


useEffect(() => {
  
  if(operatingMode !== "auto" && operatingMode !== "random" || slides.length === 0) return

  const interval = setInterval(() => {
    if (operatingMode === "random") 
    {
      setCurrentSlideIndex(Math.floor(Math.random() * slides.length))
    } else 
    {
      setCurrentSlideIndex(prev => (prev + 1) % slides.length)
    }
  }, displayTime * 1000)




}, [operatingMode, displayTime, slides.length])

useEffect(() => {
  setCurrentSlideIndex(0)
}, [slides])

  return (
    <div id='main-page'>
      <div id='slide-show'>
        {
          slides.length > 0 ?
            <figure> 
              <img 
                src={slides[currentSlideIndex].src} 
                alt={generateCaption(slides[currentSlideIndex].filename)} />
              <figcaption>{generateCaption(slides[currentSlideIndex].filename)}</figcaption>
            </figure>
          :
          <p>No photos loaded</p>
        }
      </div>
      <aside>
        <div 
          id="drop-zone"
          className= {isDragging ? "dragging" : ""}
          onChange={handleSlidePhotos}
          onDragEnter={handleDragEnter}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input 
            type="file" 
            accept="image/*"
            multiple  
          />
        </div>

        <button onClick={handleLoadSamplePhotos}>Load Sample Photos</button>



        <label htmlFor="mode">Select mode: </label>
        <select 
          name="mode" 
          id="mode"
          value={operatingMode}
          onChange={(e) => {
            const nextMode = e.target.value
            setOperatingMode(nextMode)
          }}
          
          >
            <option value="manual">Manual</option>
            <option value="auto">Auto</option>
            <option value="random">Random</option>

          </select>

          <label htmlFor="display-time">Set display time: </label>
          <input 
          
            type="number" 
            id="display-time"
            value={displayTime}
            onChange={(e) => setDisplayTime(e.target.value)}
          
          />

      </aside>
    </div>
  )
}

export default App
