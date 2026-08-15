import { useState } from "react"



export default function App()
{

  const [slides, setSlides] = useState([]);

  function handleFileInput(e)
  {
    const files = [...e.target.files].filter((file) => 
      file.type.startsWith("image/")
    )

    if(files.length === 0) return 

    setSlides(
      files.map((file) => ({
        filename: file.name,
        src: URL.createObjectURL(file)
      }))
    )
    e.target.value = ""
  }

  const current = slides[0] || null 

  return (
    <div id="main-page">
      <div id="slide-show">
        {
          current === null ? (
            <p>No photos loaded</p>
          ) : (
            <img src={current.src} alt={current.filename}/>
          )
        }
        
      </div>
      <aside>
       <div id="drop-zone">
         <input 
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileInput}
        />
       </div>
      </aside>
    </div>
  )
}