import { useState } from "react"


function App() {
 
  const [slides, setSlides] = useState([])
  const [isDragging, setIsDragging] = useState(false)

  function handlePhotosSelection(e)
  {
    const files = [...e.target.files]
    const images = files.map(file => ({
      filename: file.name,
      src: URL.createObjectURL(file)
    }))

    setSlides(images)
  } 

  function handleDrop(e)
  {
    e.preventDefault()
    e.stopPropagation()

    setIsDragging(false)

    const files = [...e.dataTransfer.files].filter(file => file.type.startsWith("image/" ))

    if(files.length === 0 ) return 

    const images = files.map(file => ({
      filename: file.name,
      src: URL.createObjectURL(file)
    }))

    setSlides(images)
  }

  function handleDragOver(e){
    e.preventDefault()

  }

  function handleDragEnter(e)
  {
    e.preventDefault()
    setIsDragging(true)
  }

  function handleDragLeave(e)
  {
    e.preventDefault()
    setIsDragging(false)
  }


  function generateCaption(filename)
  {
    // strip off the extension
    const baseName = filename.replace(/\.[^/.]+$/, '')
    const words = baseName
      .replace(/[_-]+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .split(' ')
      
    return words.filter(Boolean).map(word => word[0].toUpperCase() + word.slice(1).toLowerCase()).join(' ')
  }

  return (
    <div id="main-page">
     <div id='slide-show'>
          { 
            slides.length > 0 
            ? 
            (
              <div className="slides"> 
                {slides.map((slide, index) => (
                  <figure key={`${slide.filename}-${index}` } >
                    <img src={slide.src} alt={slide.filename} />
                    <figcaption> {generateCaption(slide.filename)}</figcaption>
                  </figure>
                ))}
              </div>
            ) 
            : 
            <p>NO photos loaded yet</p>
          }
     </div>

      <aside>
          <div id='drop-zone' 
            className={isDragging ? "dragging" : ""} 
            onDragEnter={handleDragEnter} 
            onDragOver={handleDragOver} 
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <input  type="file" name='image' multiple accept='image/*' onChange={handlePhotosSelection}/>
          </div>
           <button>Load Sample Photos</button>
      </aside>
    </div>
  )
}

export default App
