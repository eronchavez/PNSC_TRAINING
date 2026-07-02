import { useState, useEffect, useCallback } from 'react'




function generateCaption(filename)
{
  return filename
    .slice(0, filename.lastIndexOf("."))
    .replace(/[-_.]+/g, " ")
    .split(" ")
    .filter(Boolean)
    .map(word => word[0].toUpperCase() + word.slice(1).toLowerCase())
    .join(" ")
}

function App() {

  const [slides, setSlides] = useState([])
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0)
  const [operatingMode, setOperatingMode] = useState("manual")
  const [displayTime, setDisplayTime] = useState(2)

  const [theme,setTheme] = useState("a")
  const [outgoingSlide, setOutgoingSlide] = useState(null)
  const [transitionKey, setTransitionKey] = useState(0)
  const themesWithOutgoing = new Set(["b","c"])

 


  const showSlide = useCallback((nextIndex) => {
    if (slides.length === 0) return

    const validIndex = (nextIndex + slides.length) % slides.length
    if (validIndex === currentSlideIndex) return
    setOutgoingSlide(themesWithOutgoing.has(theme) ? slides[currentSlideIndex] : null)
    setCurrentSlideIndex(validIndex)
    setTransitionKey(key => key + 1)
  }, [slides, currentSlideIndex, theme])



  function handleFileInput(e) {
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
    function onKeyDown(e) {
      if (slides.length === 0) return

      if (e.key === "ArrowRight") showSlide(currentSlideIndex + 1)
      if (e.key === "ArrowLeft") showSlide(currentSlideIndex - 1)

    }

    window.addEventListener("keydown", onKeyDown)

    return () => window.removeEventListener("keydown", onKeyDown)
  }, [slides.length, showSlide, currentSlideIndex,])

  useEffect(() => {
    if (slides.length === 0) return

    const id = setInterval(() => {
      if (operatingMode === "random") {
        showSlide(Math.floor(Math.random() * slides.length))
      } else if (operatingMode === "auto") {
        showSlide(currentSlideIndex + 1)
      }
    }, displayTime * 1000)


    return () => clearInterval(id)
  }, [operatingMode, slides.length, showSlide, displayTime, currentSlideIndex])

  useEffect(() => 
  {
    if(!outgoingSlide) return 

    const id = setTimeout(() => setOutgoingSlide(null), 1000)
    return () => clearTimeout(id)
    
  },[outgoingSlide,transitionKey])


  useEffect(() => {
    document.body.dataset.theme = theme
  },[theme])
  

  const current = slides[currentSlideIndex] || null
  const captionWords = current ? generateCaption(current.filename).split(" ") : []


  return (
    <div id='main-page'>
      <div id="slide-show">
        {
          current === null 
            ? (<p>No photos loaded yet</p>)
            : (
                <>
                  {
                    outgoingSlide && 
                    (
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
                    )
                  }

                  <figure 
                    key={`in-${transitionKey}`}
                    className="slide-frame slide-frame-incoming"
                  >
                    <img 
                      src={current.src}
                      alt={generateCaption(current.filename)}
                    />
                    <figcaption>
                      {
                        captionWords.map((word,index) => (
                          <span 
                            key={index}
                            style={{animationDelay: `${1000 + (index * 300)}ms `}}
                          >
                            {word}&nbsp;
                          </span>
                        ))
                      }
                    </figcaption>
                  </figure>
                </>
              )
        }
      </div>
      <aside>
        <section id="drop-zone">
          <input
            type="file"
            accept='image/*'
            multiple
            onChange={handleFileInput}
          />
        </section>
        <section id="thumbnails">
          {
            slides.map((slide, index) => (
              <img
                src={slide.src}
                alt={generateCaption(slide.filename)}
                draggable
                key={slide.filename + index}
                onClick={() => showSlide(index)}
                className={index === currentSlideIndex ? "active" : ""}
              />
            ))
          }
        </section>
        <section>
          <label>
            Display Time: {" "}
            <input
              type="number"
              value={displayTime}
              onChange={(e) => setDisplayTime(Number(e.target.value))}

            />
          </label>
        </section>
        
        <section>
          <label>
             Mode: {" "}  
            <select 
              name="operatingMode"
              id="operatingMode"
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
            Theme: {" "}
            <select 
              name="theme" 
              id="theme"
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
            >
              {["a","b","c","d","e","f","g","h"].map(letter => 
                <option value={letter}>{letter.toUpperCase()}</option>
              )}


            </select>

          </label>
        </section>
       
       
      </aside>
    </div>
  )


}

export default App
