import { useState } from 'react'

  function generateCaption(filename)
  {
    const base = filename.replace(/\.[^/.]+$/, "") //remove extension
    return base 
      .replace(/[-_]+/g, " ") // replaces underscore/dashes
      .split(/\s+/)
      .filter(Boolean)
      .map(word => word[0].toUpperCase() + word.slice(1).toLowerCase())
      .join(" ")
  }


function App() {
  
  const [slides, setSlides] = useState([])
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0)




  function handleFileInput(e)
  {
    const files = [...e.target.files].filter(file => file.type.startsWith("image/"))

    if(files.length === 0) return 

    setSlides(files.map(
      file => ({
        filename: file.name,
        src: URL.createObjectURL(file)
      })
    ))

    setCurrentSlideIndex(0)
  }

  function showSlide(nextIndex)
  {
    if(slides.length === 0) return 

    const validIndex = (nextIndex + slides.length) % slides.length 
    setCurrentSlideIndex(validIndex)
  }

  const current = slides[currentSlideIndex]
 
  return (
   <div id="main-page">
    <div id="slide-show">
      {
        slides.length === 0 
          ? <p>No photos loaded</p>
          : 
          <figure
            className="slide-frame slide-frame-incoming"
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
        <label htmlFor="drop-zone">Drop Zone </label>
        <input 
          type="file"
          name="drop-zone"
          id="drop-zone"
          multiple
          accept="image/*"
          onChange={handleFileInput}
        
        />
      </section>

      <section id="thumbnails">
          {slides.map((slide,index) => {
            <img 
              key={slide.filename + index}
              src={slide.src}
              alt={generateCaption(slide.filename)}
              className={index === currentSlideIndex ? "active" : ""}
              onClick={() => showSlide(index)}
            />
          })

          }
      </section>
    </aside>
   </div>
  )
}

export default App
