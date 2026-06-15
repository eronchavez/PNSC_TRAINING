const glossary = {
  state: {
    title: "State",
    body: "Ito ang shared in-memory object ng app. Dito naka-store ang current view, history, user context, settings, filters, at planner data."
  },
  render: {
    title: "Render",
    body: "Ito ang step kung saan binabasa ng app ang state at muling binubuo ang visible UI sa loob ng mainContent."
  },
  localstorage: {
    title: "localStorage",
    body: "Browser storage ito para sa strings na hindi nawawala kahit mag-refresh. Ginagamit ito rito para sa settings, pinned carparks, planner plans, at planner UI state."
  },
  formdata: {
    title: "FormData",
    body: "Browser API ito na bumabasa ng form inputs bilang key-value pairs, kasama ang files tulad ng image upload ng planner."
  }
};

document.addEventListener("DOMContentLoaded", () => {
  setupProgressAndNavigation();
  setupRevealAnimations();
  setupInspectors();
  setupFlows();
  setupGlossary();
  setupRouterSimulator();
  setupThemeLab();
  setupQuizState();
});

function setupProgressAndNavigation() {
  const progressBar = document.getElementById("progress-bar");
  const modules = Array.from(document.querySelectorAll(".module"));
  const dots = Array.from(document.querySelectorAll(".nav-dot"));

  const updateProgress = () => {
    const doc = document.documentElement;
    const maxScroll = doc.scrollHeight - window.innerHeight;
    const progress = maxScroll > 0 ? (window.scrollY / maxScroll) * 100 : 0;
    if (progressBar) {
      progressBar.style.width = `${Math.min(Math.max(progress, 0), 100)}%`;
      progressBar.setAttribute("aria-valuenow", String(Math.round(progress)));
    }
  };

  const setActiveDot = (id) => {
    dots.forEach((dot) => {
      const active = dot.dataset.target === id;
      dot.classList.toggle("is-active", active);
      dot.setAttribute("aria-selected", String(active));
      dot.setAttribute("tabindex", active ? "0" : "-1");
    });
  };

  dots.forEach((dot) => {
    dot.addEventListener("click", () => {
      document.getElementById(dot.dataset.target || "")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  if (modules.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target?.id) {
          setActiveDot(visible.target.id);
        }
      },
      { threshold: [0.25, 0.45, 0.7], rootMargin: "-20% 0px -35% 0px" }
    );
    modules.forEach((module) => observer.observe(module));
    setActiveDot(modules[0].id);
  }

  updateProgress();
  document.addEventListener("scroll", updateProgress, { passive: true });
  window.addEventListener("resize", updateProgress);
}

function setupRevealAnimations() {
  const targets = document.querySelectorAll(".module-header, .screen, .translation-block.animate-in");
  if (!("IntersectionObserver" in window)) {
    targets.forEach((target) => target.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -10% 0px" }
  );

  targets.forEach((target) => observer.observe(target));
}

function setupInspectors() {
  document.querySelectorAll(".inspector").forEach((inspector) => {
    const tabs = inspector.querySelectorAll(".inspector-tab");
    const panels = inspector.querySelectorAll(".inspector-panel");

    tabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        const targetId = tab.dataset.panel;
        tabs.forEach((item) => item.classList.remove("is-active"));
        panels.forEach((panel) => panel.classList.remove("is-active"));
        tab.classList.add("is-active");
        inspector.querySelector(`#${targetId}`)?.classList.add("is-active");
      });
    });
  });
}

function setupFlows() {
  document.querySelectorAll(".flow-animation").forEach((flow) => {
    let steps = [];
    try {
      steps = JSON.parse(flow.dataset.steps || "[]");
    } catch (error) {
      console.error("Invalid flow steps", error);
    }

    const actors = Array.from(flow.querySelectorAll(".flow-actor"));
    const label = flow.querySelector(".flow-step-label");
    const packet = flow.querySelector(".flow-packet");
    const progress = flow.querySelector(".flow-progress");
    const nextButton = flow.querySelector(".flow-next-btn");
    const resetButton = flow.querySelector(".flow-reset-btn");
    let currentStep = -1;

    const render = () => {
      actors.forEach((actor) => actor.classList.remove("is-active"));
      packet?.classList.remove("is-visible");

      if (progress) {
        progress.textContent = steps.length ? `Hakbang ${Math.max(currentStep + 1, 0)} ng ${steps.length}` : "";
      }

      if (currentStep < 0 || !steps[currentStep]) {
        if (label) {
          label.textContent = 'Pindutin ang "Next Step" para magsimula.';
        }
        if (nextButton) {
          nextButton.textContent = "Susunod";
        }
        return;
      }

      const step = steps[currentStep];
      flow.querySelector(`#${step.highlight}`)?.classList.add("is-active");
      if (label) {
        label.textContent = step.label || "";
      }
      if (nextButton) {
        nextButton.textContent = currentStep === steps.length - 1 ? "Ulitin" : "Susunod";
      }
      moveFlowPacket(flow, packet, step);
    };

    nextButton?.addEventListener("click", () => {
      if (!steps.length) {
        return;
      }
      currentStep = currentStep >= steps.length - 1 ? -1 : currentStep + 1;
      render();
    });

    resetButton?.addEventListener("click", () => {
      currentStep = -1;
      render();
    });

    render();
  });
}

function moveFlowPacket(flow, packet, step) {
  if (!packet || !step.packet) {
    return;
  }

  const source = flow.querySelector(`#flow-${step.from}`) || flow.querySelector(`#${step.from}`);
  const target = flow.querySelector(`#flow-${step.to}`) || flow.querySelector(`#${step.to}`);
  if (!source || !target) {
    return;
  }

  const flowRect = flow.getBoundingClientRect();
  const sourceRect = source.getBoundingClientRect();
  const targetRect = target.getBoundingClientRect();
  const sourceX = sourceRect.left + sourceRect.width / 2 - flowRect.left;
  const sourceY = sourceRect.top + sourceRect.height / 2 - flowRect.top;
  const targetX = targetRect.left + targetRect.width / 2 - flowRect.left;
  const targetY = targetRect.top + targetRect.height / 2 - flowRect.top;

  packet.style.left = `${sourceX}px`;
  packet.style.top = `${sourceY}px`;
  packet.classList.add("is-visible");

  requestAnimationFrame(() => {
    packet.style.left = `${targetX}px`;
    packet.style.top = `${targetY}px`;
  });
}

function setupGlossary() {
  const terms = document.querySelectorAll(".term");
  if (!terms.length) {
    return;
  }

  const tooltip = document.createElement("div");
  tooltip.className = "term-tooltip";
  tooltip.setAttribute("role", "dialog");
  tooltip.setAttribute("aria-live", "polite");
  document.body.appendChild(tooltip);

  const hide = () => tooltip.classList.remove("is-visible");
  const show = (term) => {
    const entry = glossary[term.dataset.term];
    if (!entry) {
      return;
    }
    tooltip.innerHTML = `<span class="term-tooltip-title">${entry.title}</span><p>${entry.body}</p>`;
    const rect = term.getBoundingClientRect();
    tooltip.style.left = `${Math.max(16, Math.min(rect.left, window.innerWidth - 340))}px`;
    tooltip.style.top = `${Math.min(rect.bottom + 14, window.innerHeight - 140)}px`;
    tooltip.classList.add("is-visible");
  };

  terms.forEach((term) => {
    term.setAttribute("tabindex", "0");
    term.addEventListener("mouseenter", () => show(term));
    term.addEventListener("focus", () => show(term));
    term.addEventListener("mouseleave", hide);
    term.addEventListener("blur", hide);
    term.addEventListener("click", (event) => {
      event.stopPropagation();
      if (tooltip.classList.contains("is-visible")) {
        hide();
      } else {
        show(term);
      }
    });
  });

  document.addEventListener("click", hide);
  window.addEventListener("scroll", hide, { passive: true });
  window.addEventListener("resize", hide);
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      hide();
    }
  });
}

function setupRouterSimulator() {
  const root = document.getElementById("router-sim");
  if (!root) {
    return;
  }

  const currentEl = document.getElementById("router-current");
  const historyEl = document.getElementById("router-history");
  const focusedEl = document.getElementById("router-focused");
  const titleEl = document.getElementById("router-title");
  const noteEl = document.getElementById("router-note");
  const focusBtn = document.getElementById("router-focus-btn");
  const backBtn = document.getElementById("router-back-btn");

  const titleMap = {
    carparks: "Carparks",
    events: "Events",
    weather: "Weather",
    planner: "Travel Planner",
    settings: "Settings"
  };

  const simState = {
    current: "carparks",
    history: [],
    focusedCarpark: null
  };

  const render = () => {
    currentEl.textContent = simState.current;
    historyEl.textContent = `[${simState.history.map((item) => `"${item}"`).join(", ")}]`;
    focusedEl.textContent = simState.focusedCarpark || "null";
    titleEl.textContent = simState.focusedCarpark ? "Carparks" : titleMap[simState.current];
    backBtn.disabled = simState.history.length === 0 && !simState.focusedCarpark;

    if (simState.focusedCarpark) {
      noteEl.textContent = "Kapag may focused carpark, para itong nested detail state sa loob pa rin ng carparks view.";
    } else {
      noteEl.textContent = `Lalim ng history: ${simState.history.length}. Ang back button ay bumabalik sa previous view sa stack.`;
    }
  };

  root.querySelectorAll(".router-view-btn").forEach((button) => {
    button.addEventListener("click", () => {
      const nextView = button.dataset.view;
      if (nextView === simState.current) {
        return;
      }
      simState.history.push(simState.current);
      simState.current = nextView;
      simState.focusedCarpark = null;
      render();
    });
  });

  focusBtn?.addEventListener("click", () => {
    if (simState.current !== "carparks") {
      simState.history.push(simState.current);
      simState.current = "carparks";
    }
    simState.focusedCarpark = simState.focusedCarpark ? null : "Halles de Lyon";
    render();
  });

  backBtn?.addEventListener("click", () => {
    if (simState.focusedCarpark) {
      simState.focusedCarpark = null;
      simState.history.pop();
      render();
      return;
    }
    if (!simState.history.length) {
      return;
    }
    simState.current = simState.history.pop();
    render();
  });

  render();
}

function setupThemeLab() {
  const lab = document.getElementById("theme-lab");
  if (!lab) {
    return;
  }

  const preview = document.getElementById("theme-preview");
  const note = document.getElementById("theme-note");
  const notes = {
    light: "Kapag light ang pinili, ilalagay ng app ang light-theme class para maliwanag ang shell at cards.",
    dark: "Kapag dark ang pinili, dark-theme class ang ia-apply para magbago ang header, nav, cards, at text colors.",
    system: "Kapag system ang pinili, titingin muna ang app sa matchMedia('(prefers-color-scheme: dark)') bago pumili ng light o dark look."
  };

  lab.querySelectorAll(".theme-btn").forEach((button) => {
    button.addEventListener("click", () => {
      const theme = button.dataset.theme;
      lab.querySelectorAll(".theme-btn").forEach((item) => item.classList.remove("is-active"));
      button.classList.add("is-active");
      preview.className = `theme-preview ${theme}-theme`;
      note.textContent = notes[theme];
    });
  });
}

function setupQuizState() {
  document.querySelectorAll(".quiz-container").forEach((container) => {
    container.dataset.checked = "false";
  });
}

function selectOption(button) {
  const block = button.closest(".quiz-question-block");
  if (!block) {
    return;
  }

  block.querySelectorAll(".quiz-option").forEach((option) => {
    option.classList.remove("is-selected");
  });
  button.classList.add("is-selected");

  if (block.closest(".quiz-container")?.dataset.checked === "true") {
    block.querySelector(".quiz-feedback")?.classList.remove("is-visible", "is-correct", "is-wrong");
  }
}

function checkQuiz(containerId) {
  const container = document.getElementById(containerId);
  if (!container) {
    return;
  }

  container.dataset.checked = "true";

  container.querySelectorAll(".quiz-question-block").forEach((block) => {
    const selected = block.querySelector(".quiz-option.is-selected");
    const correctValue = block.dataset.correct;
    const feedback = block.querySelector(".quiz-feedback");

    block.querySelectorAll(".quiz-option").forEach((option) => {
      option.classList.remove("is-correct", "is-wrong");
    });

    if (!feedback) {
      return;
    }

    if (!selected) {
      feedback.textContent = "Pumili muna ng sagot bago i-check ang tanong na ito.";
      feedback.classList.add("is-visible", "is-wrong");
      feedback.classList.remove("is-correct");
      return;
    }

    const isCorrect = selected.dataset.value === correctValue;
    const correctOption = block.querySelector(`.quiz-option[data-value="${correctValue}"]`);
    correctOption?.classList.add("is-correct");
    if (!isCorrect) {
      selected.classList.add("is-wrong");
    }

    feedback.textContent = isCorrect ? block.dataset.explanationRight || "" : block.dataset.explanationWrong || "";
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
  });
  container.querySelectorAll(".quiz-feedback").forEach((feedback) => {
    feedback.textContent = "";
    feedback.classList.remove("is-visible", "is-correct", "is-wrong");
  });
}

window.selectOption = selectOption;
window.checkQuiz = checkQuiz;
window.resetQuiz = resetQuiz;
