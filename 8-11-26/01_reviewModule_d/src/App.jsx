import { useCallback, useEffect, useState } from "react";

function generateCaption(filename) {
  return filename
    .slice(0, filename.lastIndexOf("."))
    .replace(/[-_.]+/g, " ")
    .split(" ")
    .filter(Boolean)
    .map((word) => word[0].toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

export default function App() {
  const [slides, setSlides] = useState([]);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [draggedIndex, setDraggedIndex] = useState(null);

  function handleDragStart(index) {
    setDraggedIndex(index);
  }

  function handleDragOver(e) {
    e.preventDefault();
  }

  function handleDragDrop(e, dropIndex) {
    e.preventDefault();

    if (draggedIndex === null || draggedIndex === dropIndex) return;

    const newSlides = [...slides];
    [newSlides[draggedIndex], newSlides[dropIndex]] = [
      newSlides[dropIndex],
      newSlides[draggedIndex],
    ];

    setSlides(newSlides);

    if (currentSlideIndex === draggedIndex) {
      setCurrentSlideIndex(dropIndex);
    } else if (currentSlideIndex === dropIndex) {
      setCurrentSlideIndex(draggedIndex);
    }

    setDraggedIndex(null);
  }

  function handleDragEnd() {
    setDraggedIndex(null);
  }

  const showSlide = useCallback(
    (nextIndex) => {
      const validIndex = (nextIndex + slides.length) % slides.length;
      if (validIndex === currentSlideIndex) return;
      setCurrentSlideIndex(validIndex);
    },
    [slides, currentSlideIndex],
  );

  function handleFileInput(e) {
    const files = [...e.target.files].filter((file) =>
      file.type.startsWith("image/"),
    );

    if (files.length === 0) {
      return (e.target.value = "");
    }

    setSlides(
      files.map((file) => ({
        filename: file.name,
        src: URL.createObjectURL(file),
      })),
    );

    e.target.value = "";
    setCurrentSlideIndex(0);
  }

  useEffect(() => {
    if (slides.length === 0) return;

    function handleKeyDown(e) {
      if (e.key === "ArrowRight") showSlide(currentSlideIndex + 1);
      if (e.key === "ArrowLeft") showSlide(currentSlideIndex - 1);
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [slides.length, showSlide, currentSlideIndex]);

  const current = slides[currentSlideIndex] || null;

  return (
    <div id="main-page">
      <div id="slide-show">
        {current === null ? (
          <p>No photos Loaded Yet</p>
        ) : (
          <>
            <img src={current.src} alt={current.filename} />
            <p>{generateCaption(current.filename)}</p>
          </>
        )}
      </div>
      <aside>
        <section id="drop-zone">
          <label>
            Drop:{" "}
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileInput}
            />
          </label>
        </section>
        <section id="thumbnails">
          {slides.map((slide, index) => (
            <img
              src={slide.src}
              alt={generateCaption(slide.filename)}
              key={slide.filename + index}
              onClick={() => showSlide(index)}
              className={index === currentSlideIndex ? "active" : ""}
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDragDrop(e, index)}
              onDragEnd={handleDragEnd}
            />
          ))}
        </section>
      </aside>
    </div>
  );
}
