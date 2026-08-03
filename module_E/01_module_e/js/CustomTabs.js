class CustomTabs extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.innerHTML = `
      <style>
        :host{ display:block; margin:2em 0; font-family:inherit; }

        .tab-group{
          display:flex;
          gap:0.5em;
          border-bottom:1px solid #ddd;
        }

        ::slotted([slot="tab"]){
          margin-bottom:-1px;
          padding:0.75em 1.25em;
          border:none;
          border-bottom:3px solid transparent;
          border-radius:6px 6px 0 0;
          background:none;
          font:inherit;
          font-size:1.05em;
          color:#222;
          cursor:pointer;
        }

        ::slotted([slot="tab"]:not([aria-selected="true"])){
          background:#eee;
        }

        ::slotted([slot="tab"][aria-selected="true"]){
          border-bottom-color:rgb(46,46,248);
        }

        ::slotted([slot="content"]){
          display:none;
          padding:1.5em 0;
        }

        ::slotted([slot="content"][aria-hidden="false"]){
          display:block;
        }
      </style>

      <div class="tab-group" role="tablist">
        <slot name="tab"></slot>
      </div>
      <slot name="content"></slot>
    `;

    this.tabs = [...this.querySelectorAll('[slot="tab"]')];
    this.panels = [...this.querySelectorAll('[slot="content"]')];
  }

  connectedCallback() {
    this.tabs.forEach((tab, i) => {
      const panel = this.panels[i];
      const tabId = `tab-${i}`;
      const panelId = `panel-${i}`;
      const active = i === 0;

      tab.id = tabId;
      tab.setAttribute("role", "tab");
      tab.setAttribute("tabindex", active ? "0" : "-1");
      tab.setAttribute("aria-selected", active);
      tab.setAttribute("aria-controls", panelId);

      panel.id = panelId;
      panel.setAttribute("role", "tabpanel");
      panel.setAttribute("aria-hidden", !active);
      panel.setAttribute("aria-labelledby", tabId);

      tab.addEventListener("click", () => this.activate(i));
      tab.addEventListener("keydown", (e) => this.onKeydown(e, i));
    });
  }

  activate(index) {
    this.tabs.forEach((tab, i) => {
      const active = i === index;
      tab.setAttribute("aria-selected", active);
      tab.setAttribute("tabindex", active ? "0" : "-1");
      this.panels[i].setAttribute("aria-hidden", !active);
    });
    this.tabs[index].focus();
  }

  onKeydown(e, index) {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      this.activate((index + 1) % this.tabs.length);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      this.activate((index - 1 + this.tabs.length) % this.tabs.length);
    }
  }
}

customElements.define("custom-tabs", CustomTabs);