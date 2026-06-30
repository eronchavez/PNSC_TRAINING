import {  useState,useEffect,useCallback } from 'react'

function generateCaption(filename)
{
  const base = filename.replace(/\.[^/.]+$/,"")

  return base 
    .replace(/[-_]+/g, " ")
    .split(/\+s/)
    .filter(Boolean)
    .map(word => word[0].toUpperCase() + word.slice(1).toLowerCase())
    .join(" ")
}


function App() {

  const [slides, setSlides] = useState([])
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0)

  const [operatingMode, setOperatingMode] = useState("manual")
  const [displayTime, setDisplayTime] = useState(2)


  

  const showSlide = useCallback((nextIndex) => {
     if(slides.length === 0 ) return 

    const validIndex = (nextIndex + slides.length) % slides.length
    setCurrentSlideIndex(validIndex)
  }, [slides.length])

  function handleFileInput(e)
  {
    const files = [...e.target.files].filter(file => file.type.startsWith("image/"))

    
  if (files.length === 0) {
    e.target.value = ""   
    return
  }

    setSlides(files.map(
      file => ({
        filename: file.name,
        src: URL.createObjectURL(file)
      })
    ))
    e.target.value = ""
    setCurrentSlideIndex(0)
  }

  useEffect(() => {
    function handleKeyDown(e)
    {
      if(slides.length === 0) return 
      if(e.key === "ArrowRight") showSlide(currentSlideIndex + 1)
      if(e.key === "ArrowLeft") showSlide(currentSlideIndex - 1)
    }

    window.addEventListener("keydown", handleKeyDown)

    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [slides.length,showSlide,currentSlideIndex]
)

  // useEffect(() => {
  //   if(operatingMode === "manual" || slides.length === 0) return

  //   const id = setInterval(() => {
  //     if(operatingMode === "random")
  //     {
  //       showSlide(Math.floor(Math.random() * slides.length))
  //     } else 
  //     {
  //       showSlide(currentSlideIndex + 1)
  //     }
  //   }, displayTime * 1000)

  //   return () => clearInterval(id)

  // }, [operatingMode, showSlide, displayTime, currentSlideIndex, slides.length])

  useEffect(() => {
    if(operatingMode === "manual" || slides.length === 0) return 

    const id = setInterval(() => {
      if(operatingMode === "random")
      {
        showSlide(Math.floor(Math.random() * slides.length))
      } else if (operatingMode === "auto")
      {
        showSlide(currentSlideIndex + 1)
      }
    }, displayTime * 1000)

    return () => clearInterval(id)
  }, [operatingMode,showSlide,displayTime,slides.length,currentSlideIndex])

  const current = slides[currentSlideIndex] || null



  return (
    <div id='main-page'> 
        <div id="slide-show">
          {
            slides.length === 0 
              ? <p>No Loaded Photos</p>
              : 
                <figure 
                  className='slide-frame slide-frame-incoming'
                >
                  <img
                    src={current.src}
                    alt={generateCaption(current.filename)}
                  />

                  <figcaption>{generateCaption(current.filename)}</figcaption>

                </figure>
          }
        </div>
        <aside>
          <section id="drop-zone">
            <p>Drop zone</p>
            <input 
              type="file" 
              accept='image/*'
              multiple
              onChange={handleFileInput}

            />
          </section>

          <section
            id='thumbnails'
          >
            {
              slides.map((slide,index) => (
                <img 
                  key={slide.filename + index}
                  className={index === currentSlideIndex ? "active" : ""}
                  src={slide.src}
                  alt={generateCaption(slide.filename)}
                  onClick={() => showSlide(index)}
                />
              ))
            }
            
          </section>

          <section>
            <label>Mode: 
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
              Display time:
              <input 
                type="number" 
                min="1"
                value={displayTime}
                onChange={(e) => setDisplayTime(Number(e.target.value))}
              />
            </label>
          </section>

          <section>
            <button  onClick={() => document.documentElement.requestFullscreen()}>Full Screen</button>
          </section>
        </aside>
    </div>
  )

  
}

export default App
