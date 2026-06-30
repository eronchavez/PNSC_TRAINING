import {  useState,useEffect,useCallback } from 'react'

function generateCaption(filename)
{
   return filename
    .slice(0, filename.lastIndexOf("."))
    .replace(/[.-_]+/g, " ")
    .split(" ")
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

    if(files.length === 0)
    {
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

  const current = slides[currentSlideIndex] || null


  return (
    <div id='main-page'>
      <div id="slide-show">
        {
          slides.length === 0 
            ? <p>No photos loaded yet</p>
            : 
              <figure className="slide-frame slide-frame-incoming">
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
            <input 
              type="file"
              accept='image/*'
              multiple 
              onChange={handleFileInput}
            />
        </section>
      </aside>
    </div>
  )

  
}

export default App
