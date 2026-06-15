document.addEventListener("DOMContentLoaded", () => {
  setupProgressAndNavigation();
  setupRevealAnimations();
  setupGlossary();
  setupQuizzes();
});

function setupProgressAndNavigation() {
  const progressBar = document.getElementById("progress-bar");
  const modules = Array.from(document.querySelectorAll(".module"));
  const dots = Array.from(document.querySelectorAll(".nav-dot"));

  const updateProgress = () => {
    const doc = document.documentElement;
    const scrollable = doc.scrollHeight - window.innerHeight;
    const progress = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;

    if (progressBar) {
      const clamped = Math.max(0, Math.min(progress, 100));
      progressBar.style.width = `${clamped}%`;
      progressBar.setAttribute("aria-valuenow", String(Math.round(clamped)));
    }
  };

  const setActiveDot = (targetId) => {
    dots.forEach((dot) => {
      const isActive = dot.dataset.target === targetId;
      dot.classList.toggle("is-active", isActive);
      dot.setAttribute("aria-selected", String(isActive));
      dot.setAttribute("tabindex", isActive ? "0" : "-1");
    });
  };

  const scrollToModule = (targetId) => {
    const target = document.getElementById(targetId);
    target?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => scrollToModule(dot.dataset.target || ""));

    dot.addEventListener("keydown", (event) => {
      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") {
        return;
      }

      event.preventDefault();
      const direction = event.key === "ArrowRight" ? 1 : -1;
      const nextIndex = (index + direction + dots.length) % dots.length;
      dots[nextIndex]?.focus();
      scrollToModule(dots[nextIndex]?.dataset.target || "");
    });
  });

  if (!modules.length) {
    updateProgress();
    document.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);
    return;
  }

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visible?.target?.id) {
          setActiveDot(visible.target.id);
        }
      },
      {
        threshold: [0.2, 0.45, 0.7],
        rootMargin: "-20% 0px -35% 0px"
      }
    );

    modules.forEach((module) => observer.observe(module));
  } else {
    setActiveDot(modules[0].id);
  }

  setActiveDot(modules[0].id);
  updateProgress();
  document.addEventListener("scroll", updateProgress, { passive: true });
  window.addEventListener("resize", updateProgress);
}

function setupRevealAnimations() {
  const targets = document.querySelectorAll(".module-header, .screen, .animate-in");

  if (!targets.length) {
    return;
  }

  if (!("IntersectionObserver" in window)) {
    targets.forEach((target) => target.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.18,
      rootMargin: "0px 0px -10% 0px"
    }
  );

  targets.forEach((target) => observer.observe(target));
}

function setupGlossary() {
  const terms = Array.from(document.querySelectorAll(".term[data-definition]"));

  if (!terms.length) {
    return;
  }

  const tooltip = document.createElement("div");
  tooltip.className = "term-tooltip";
  tooltip.setAttribute("role", "dialog");
  tooltip.setAttribute("aria-live", "polite");
  document.body.appendChild(tooltip);

  let activeTerm = null;

  const hideTooltip = () => {
    activeTerm?.setAttribute("aria-expanded", "false");
    activeTerm = null;
    tooltip.classList.remove("is-visible");
  };

  const placeTooltip = (term) => {
    const rect = term.getBoundingClientRect();
    const width = Math.min(320, window.innerWidth - 32);
    const left = Math.max(16, Math.min(rect.left + rect.width / 2 - width / 2, window.innerWidth - width - 16));

    tooltip.style.width = `${width}px`;
    tooltip.style.left = `${left}px`;

    const tooltipHeight = tooltip.offsetHeight || 120;
    const showAbove = rect.top > tooltipHeight + 24;
    tooltip.style.top = showAbove
      ? `${rect.top - tooltipHeight - 12}px`
      : `${Math.min(window.innerHeight - tooltipHeight - 16, rect.bottom + 12)}px`;
  };

  const showTooltip = (term) => {
    const definition = term.dataset.definition?.trim();

    if (!definition) {
      return;
    }

    activeTerm?.setAttribute("aria-expanded", "false");
    activeTerm = term;
    term.setAttribute("aria-expanded", "true");
    tooltip.innerHTML = `<span class="term-tooltip-title">${term.textContent.trim()}</span><p>${escapeHtml(definition)}</p>`;
    tooltip.classList.add("is-visible");
    placeTooltip(term);
  };

  terms.forEach((term) => {
    term.setAttribute("tabindex", "0");
    term.setAttribute("role", "button");
    term.setAttribute("aria-expanded", "false");

    term.addEventListener("mouseenter", () => showTooltip(term));
    term.addEventListener("focus", () => showTooltip(term));
    term.addEventListener("mouseleave", hideTooltip);
    term.addEventListener("blur", hideTooltip);

    term.addEventListener("click", (event) => {
      event.stopPropagation();

      if (activeTerm === term && tooltip.classList.contains("is-visible")) {
        hideTooltip();
        return;
      }

      showTooltip(term);
    });
  });

  window.addEventListener("resize", () => activeTerm && placeTooltip(activeTerm));
  window.addEventListener("scroll", hideTooltip, { passive: true });
  document.addEventListener("click", hideTooltip);
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      hideTooltip();
    }
  });
}

function setupQuizzes() {
  document.querySelectorAll(".quiz-container").forEach((container) => {
    container.dataset.checked = "false";
  });
}

function selectOption(button) {
  const questionBlock = button.closest(".quiz-question-block");

  if (!questionBlock) {
    return;
  }

  questionBlock.querySelectorAll(".quiz-option").forEach((option) => {
    option.classList.remove("is-selected");
    option.setAttribute("aria-pressed", "false");
  });

  button.classList.add("is-selected");
  button.setAttribute("aria-pressed", "true");

  if (questionBlock.closest(".quiz-container")?.dataset.checked === "true") {
    const feedback = questionBlock.querySelector(".quiz-feedback");
    feedback?.classList.remove("is-visible", "is-correct", "is-wrong");
  }
}

function checkQuiz(containerId) {
  const container = document.getElementById(containerId);

  if (!container) {
    return;
  }

  container.dataset.checked = "true";

  container.querySelectorAll(".quiz-question-block").forEach((block) => {
    const correctValue = block.dataset.correct;
    const selected = block.querySelector(".quiz-option.is-selected");
    const feedback = block.querySelector(".quiz-feedback");

    block.querySelectorAll(".quiz-option").forEach((option) => {
      option.classList.remove("is-correct", "is-wrong");
    });

    if (!feedback) {
      return;
    }

    if (!selected) {
      feedback.textContent = "Select an answer before checking this question.";
      feedback.classList.add("is-visible", "is-wrong");
      feedback.classList.remove("is-correct");
      return;
    }

    const correctOption = block.querySelector(`.quiz-option[data-value="${correctValue}"]`);
    const isCorrect = selected.dataset.value === correctValue;

    correctOption?.classList.add("is-correct");

    if (!isCorrect) {
      selected.classList.add("is-wrong");
    }

    feedback.textContent = isCorrect
      ? block.dataset.explanationRight || "Correct."
      : block.dataset.explanationWrong || "Try again.";
    feedback.classList.add("is-visible");
    feedback.classList.toggle("is-correct", isCorrect);
    feedback.classList.toggle("is-wrong", !isCorrect);
  });
}

function resetQuiz(containerId) {
  const container = document.getElementById(containerId);

  if (!container) {
    return;
  }

  container.dataset.checked = "false";

  container.querySelectorAll(".quiz-option").forEach((option) => {
    option.classList.remove("is-selected", "is-correct", "is-wrong");
    option.setAttribute("aria-pressed", "false");
  });

  container.querySelectorAll(".quiz-feedback").forEach((feedback) => {
    feedback.textContent = "";
    feedback.classList.remove("is-visible", "is-correct", "is-wrong");
  });
}

function escapeHtml(text) {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

window.selectOption = selectOption;
window.checkQuiz = checkQuiz;
window.resetQuiz = resetQuiz;
