var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
const STORAGE_KEY$1 = "design-tokens-overrides";
try {
  const raw = localStorage.getItem(STORAGE_KEY$1);
  if (raw) {
    const overrides = JSON.parse(raw);
    for (const [prop, value] of Object.entries(overrides)) {
      document.documentElement.style.setProperty(prop, value);
    }
  }
} catch {
}
const STORAGE_KEY = "design-tokens-overrides";
const ACTIVE_PRESET_KEY = "design-tokens-active-preset";
const presetDefinitions = [
  { id: "dark", name: "Dark Ember", path: "/source/themes/dark.json" },
  { id: "nordic-dawn", name: "Nordic Dawn", path: "/source/themes/nordic-dawn.json" },
  { id: "forest-mist", name: "Forest Mist", path: "/source/themes/forest-mist.json" },
  { id: "sunset-clay", name: "Sunset Clay", path: "/source/themes/sunset-clay.json" },
  { id: "ocean-ink", name: "Ocean Ink", path: "/source/themes/ocean-ink.json" },
  { id: "aurora-light", name: "Aurora Light", path: "/source/themes/aurora-light.json" },
  { id: "high-contrast", name: "High Contrast A11y", path: "/source/themes/high-contrast.json" }
];
function parseStoredOverrides() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return {};
    }
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return {};
    }
    return Object.entries(parsed).reduce((result, [key, value]) => {
      if (typeof key === "string" && typeof value === "string") {
        result[key] = value;
      }
      return result;
    }, {});
  } catch {
    return {};
  }
}
__name(parseStoredOverrides, "parseStoredOverrides");
function clearOverrides(overrides) {
  for (const variable of Object.keys(overrides)) {
    document.documentElement.style.removeProperty(variable);
  }
}
__name(clearOverrides, "clearOverrides");
function applyOverrides(overrides) {
  for (const [variable, value] of Object.entries(overrides)) {
    document.documentElement.style.setProperty(variable, value);
  }
}
__name(applyOverrides, "applyOverrides");
function saveOverrides(overrides) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(overrides));
  localStorage.removeItem(ACTIVE_PRESET_KEY);
}
__name(saveOverrides, "saveOverrides");
function hasSameTokens(a, b) {
  const aKeys = Object.keys(a);
  const bKeys = Object.keys(b);
  if (aKeys.length !== bKeys.length) {
    return false;
  }
  return aKeys.every((key) => a[key] === b[key]);
}
__name(hasSameTokens, "hasSameTokens");
function createPresetButton(preset) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "c-button c-button--sm c-button__filled c-button__filled--secondary d-theme-presets__button u-margin--0";
  button.dataset.themePresetId = preset.id;
  const label = document.createElement("span");
  label.className = "c-button__label";
  const labelText = document.createElement("span");
  labelText.className = "c-button__label-text";
  labelText.textContent = preset.name;
  label.appendChild(labelText);
  button.appendChild(label);
  return button;
}
__name(createPresetButton, "createPresetButton");
function updateActiveButton(buttons, activeId) {
  buttons.forEach((button) => {
    const isActive = activeId !== null && button.dataset.themePresetId === activeId;
    button.classList.toggle("is-active", isActive);
  });
}
__name(updateActiveButton, "updateActiveButton");
async function loadPreset(definition) {
  try {
    const response = await fetch(definition.path, { cache: "no-store" });
    if (!response.ok) {
      return null;
    }
    const payload = await response.json();
    if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
      return null;
    }
    const tokens = {};
    for (const [key, value] of Object.entries(payload)) {
      if (typeof key === "string" && typeof value === "string") {
        tokens[key] = value;
      }
    }
    return {
      ...definition,
      tokens
    };
  } catch {
    return null;
  }
}
__name(loadPreset, "loadPreset");
function closePanel(fabRoot) {
  const panel = fabRoot.querySelector(".c-fab__panel");
  if (panel) {
    panel.classList.remove("c-fab__panel--open");
  }
}
__name(closePanel, "closePanel");
async function initThemePresetFab() {
  const fabRoot = document.querySelector("[data-theme-presets-fab]");
  if (!fabRoot) {
    return;
  }
  const list = fabRoot.querySelector("[data-theme-presets-list]");
  if (!list) {
    return;
  }
  const loadedPresets = (await Promise.all(presetDefinitions.map(loadPreset))).filter((preset) => preset !== null);
  if (loadedPresets.length === 0) {
    list.innerHTML = '<p class="c-typography c-typography__variant--body">No themes available.</p>';
    return;
  }
  list.innerHTML = "";
  const storedOverrides = parseStoredOverrides();
  const initialActivePreset = loadedPresets.find((preset) => hasSameTokens(preset.tokens, storedOverrides))?.id ?? null;
  const buttons = loadedPresets.map((preset) => {
    const button = createPresetButton(preset);
    button.addEventListener("click", () => {
      const currentOverrides = parseStoredOverrides();
      clearOverrides(currentOverrides);
      applyOverrides(preset.tokens);
      saveOverrides(preset.tokens);
      updateActiveButton(buttons, preset.id);
      closePanel(fabRoot);
    });
    list.appendChild(button);
    return button;
  });
  updateActiveButton(buttons, initialActivePreset);
}
__name(initThemePresetFab, "initThemePresetFab");
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    void initThemePresetFab();
  });
} else {
  void initThemePresetFab();
}
const init = /* @__PURE__ */ __name(() => {
  let elements = [];
  const toggleDropdownElements = /* @__PURE__ */ __name((dropdowns2 = []) => dropdowns2.forEach((e) => e.classList.toggle("is-open")), "toggleDropdownElements");
  const toggleDropdowns = /* @__PURE__ */ __name((dropdowns2 = []) => {
    toggleDropdownElements([...elements, ...dropdowns2]);
    elements = [...dropdowns2];
  }, "toggleDropdowns");
  const dropdowns = [...document.querySelectorAll(".js-dropdown")].map(
    (dropdown) => {
      [...dropdown.querySelectorAll(".js-dropdown-button")].forEach((btn) => {
        btn.addEventListener("click", () => {
          const isOpen = [...dropdown?.classList ?? []].includes("is-open");
          toggleDropdowns(!isOpen ? [dropdown] : []);
        });
      });
      return dropdown;
    }
  );
  if (dropdowns.length > 0) {
    document.addEventListener(
      "click",
      (e) => {
        const el = e.target;
        if (!el?.closest(".js-dropdown")) {
          toggleDropdowns([]);
        }
      },
      false
    );
  }
}, "init");
(() => {
  addEventListener("DOMContentLoaded", init);
})();
const CONTAINER$1 = "[js-expand-container]";
const BUTTON = "[js-expand-button]";
const EXPANDED = "aria-expanded";
const CONTROLS = "aria-controls";
const HIDDEN = "aria-hidden";
const setMarginEventListener = /* @__PURE__ */ __name(() => {
  window.addEventListener("resize", debounce$1(setMarginVariable, 2e3));
}, "setMarginEventListener");
const setMarginVariable = /* @__PURE__ */ __name((root, header) => {
  root.style.setProperty("--c-accordion-scroll-margin", header.offsetHeight + 20 + "px");
}, "setMarginVariable");
const debounce$1 = /* @__PURE__ */ __name((func, delay) => {
  let timer;
  let root = document.querySelector(":root");
  const header = document.querySelector("#site-header");
  func(root, header);
  return () => {
    timer ? clearTimeout(timer) : "";
    timer = setTimeout(() => {
      func(root, header);
    }, delay);
  };
}, "debounce$1");
const expandSection = /* @__PURE__ */ __name(() => {
  const buttons = document.querySelectorAll(BUTTON);
  let i = 0;
  let prev = false;
  if (document.querySelector("#site-header")?.classList.contains("c-header--sticky")) {
    setMarginEventListener();
  }
  buttons.forEach((button) => {
    button.setAttribute("js-accordion-button", i);
    i++;
    button.addEventListener("click", function(e) {
      const expanded = button.getAttribute(EXPANDED) === "true";
      toggleButton(button, expanded);
      prev = handleAnchor(button, prev, expanded, e);
    });
  });
}, "expandSection");
const handleAnchor = /* @__PURE__ */ __name((button, prev, expanded, e) => {
  if (prev && !expanded) {
    if (parseInt(button.getAttribute("js-accordion-button")) > parseInt(prev.getAttribute("js-accordion-button"))) ;
    else {
      e.preventDefault();
    }
  } else {
    e.preventDefault();
  }
  if (!expanded) {
    return button;
  } else {
    return false;
  }
}, "handleAnchor");
const toggleButton = /* @__PURE__ */ __name((button, expanded) => {
  const container = button.closest(CONTAINER$1);
  let safeExpanded = expanded;
  if (!container) {
    throw new Error(`${BUTTON} is missing outer ${CONTAINER$1}`);
  }
  const isTab = button.getAttribute("role") === "tab";
  if (expanded && isTab) {
    return;
  }
  safeExpanded = toggle(button, !expanded);
  if (safeExpanded) {
    const containerButtons = container.querySelectorAll(BUTTON);
    containerButtons.forEach((other) => {
      if (other !== button) {
        toggle(other, false);
      }
    });
  }
}, "toggleButton");
const toggle = /* @__PURE__ */ __name((button, expanded) => {
  let safeExpanded = expanded;
  if (typeof safeExpanded !== "boolean") {
    safeExpanded = button.getAttribute(EXPANDED) === "false";
  }
  button.setAttribute(EXPANDED, safeExpanded);
  const id = button.getAttribute(CONTROLS);
  const controls = document.getElementById(id);
  if (!controls) {
    throw new Error(`No toggle target found with id: "${id}"`);
  }
  if (safeExpanded) {
    controls.setAttribute(HIDDEN, "false");
  } else {
    controls.setAttribute(HIDDEN, "true");
  }
  return safeExpanded;
}, "toggle");
const setScrollbarCSS = /* @__PURE__ */ __name(() => {
  const body = document.querySelector("body");
  if (!body) return;
  const viewportWidth = window.innerWidth - document.documentElement.clientWidth;
  const scrollbar = Math.min(viewportWidth, 15);
  body.setAttribute("style", `--scrollbar: ${scrollbar}px`);
}, "setScrollbarCSS");
const CONTAINER = "[js-filter-container]", ITEM = "[js-filter-item]", DATA = "[js-filter-data]", INPUT = "[js-filter-input]";
const _Filter = class _Filter {
  constructor() {
    this.list = [];
    this.enableSearch();
  }
  enableSearch() {
    let containers = document.querySelectorAll(CONTAINER);
    containers.forEach((container) => {
      container.querySelectorAll(ITEM).forEach((item) => {
        let dataItems;
        let dataString = "";
        if (item.hasAttribute("js-filter-data")) {
          dataItems = [item, ...item.querySelectorAll(DATA)];
        } else {
          dataItems = item.querySelectorAll(DATA);
        }
        dataItems.forEach((data) => {
          dataString = dataString.concat(data.innerHTML);
          dataString = dataString.replace(/(<([^>]+)>)/gi, "");
        });
        this.list.push({
          searchId: container.getAttribute("js-filter-container"),
          //Get id
          element: item,
          parent: item.parentNode,
          data: dataString.toLowerCase()
        });
      });
      container.querySelectorAll(INPUT).forEach((input) => {
        input.addEventListener("input", () => {
          let inputId = input.getAttribute("js-filter-input");
          this.list.forEach((item) => {
            if (item.searchId === inputId) {
              let res = item.data.search(input.value.toLocaleLowerCase());
              if (res < 0) {
                item.element.remove();
              } else {
                item.parent.append(item.element);
              }
            }
          });
        });
      });
    });
  }
};
__name(_Filter, "Filter");
let Filter = _Filter;
const _Sort = class _Sort {
  constructor() {
    this.CONTAINER = "js-sort-container";
    this.BUTTON = "js-sort-button";
    this.SORTABLE = "js-sort-sortable";
    this.ORDER = "js-sort-order";
    this.DATA = "js-sort-data";
    this.DATACONTAINER = "js-sort-data-container";
    this.INITIAL = "js-sort-initial";
  }
  compare(a, b) {
    return a.data.toLowerCase().localeCompare(b.data.toLowerCase());
  }
  appendSortable(container, dataId, initialSort = false) {
    let sorted = [];
    let sortOrder = container.getAttribute(this.ORDER);
    let sortData = container.querySelectorAll(`[${this.DATA}="${dataId}"]`);
    let comparableData = [...sortData].map((data) => {
      return { data: data.innerText, index: data.closest(`[${this.SORTABLE}]`) };
    });
    if (sortOrder === "asc" || initialSort && initialSort === "asc") {
      sorted = comparableData.sort(this.compare);
      container.setAttribute(this.ORDER, "desc");
    } else if (initialSort && initialSort === "desc") {
      comparableData.sort(this.compare);
      sorted = comparableData.reverse(this.compare);
      container.setAttribute(this.ORDER, "asc");
    } else {
      sorted = comparableData.reverse(this.compare);
      container.setAttribute(this.ORDER, "asc");
    }
    sorted.forEach((sort) => {
      sort.index.closest(`[${this.DATACONTAINER}]`).appendChild(sort.index);
    });
  }
  applySort() {
    const sortContainers = document.querySelectorAll(`[${this.CONTAINER}]`);
    sortContainers.forEach((container) => {
      const sortButtons = container.querySelectorAll(`[${this.BUTTON}]`);
      sortButtons.forEach((button) => {
        let dataId = button.getAttribute(this.BUTTON);
        let initialSort = container.getAttribute(this.INITIAL);
        if (initialSort) {
          container.setAttribute(this.ORDER, initialSort);
          this.appendSortable(container, dataId, initialSort);
        }
        button.addEventListener("click", (event2) => {
          this.appendSortable(container, dataId);
        });
      });
    });
  }
};
__name(_Sort, "Sort");
let Sort = _Sort;
var ClassToggleAttr = /* @__PURE__ */ ((ClassToggleAttr2) => {
  ClassToggleAttr2["TRIGGER"] = "data-js-toggle-trigger";
  ClassToggleAttr2["ITEM"] = "data-js-toggle-item";
  ClassToggleAttr2["CLASS"] = "data-js-toggle-class";
  ClassToggleAttr2["GROUP"] = "data-js-toggle-group";
  ClassToggleAttr2["TRIGGER_DEPRECATED"] = "js-toggle-trigger";
  ClassToggleAttr2["ITEM_DEPRECATED"] = "js-toggle-item";
  ClassToggleAttr2["CLASS_DEPRECATED"] = "js-toggle-class";
  ClassToggleAttr2["GROUP_DEPRECATED"] = "js-toggle-group";
  return ClassToggleAttr2;
})(ClassToggleAttr || {});
const _ClassToggle = class _ClassToggle {
  /**
   * Creates an instance of the ClassToggle class.
   * @param trigger The HTML element that triggers the toggle.
   * @param id The unique identifier for the toggle.
   * @param groupId The group identifier for the toggle, if any.
   */
  constructor(trigger, id, groupId = null) {
    this.trigger = trigger;
    this.id = id;
    this.groupId = groupId;
    if (this.groupId) {
      _ClassToggle.groups[this.groupId] = _ClassToggle.groups[this.groupId] || {};
      _ClassToggle.groups[this.groupId][this.id] = this;
    }
    this.setToggleListener();
  }
  /**
   * Sets the event listener on the trigger element to handle toggle actions.
   */
  setToggleListener() {
    this.trigger.addEventListener("click", (event2) => {
      this.toggle();
      if (this.groupId) {
        this.toggleGroupMembers();
      }
    });
  }
  /**
   * Toggles the class on all associated toggle items.
   */
  toggle() {
    this.getToggleItems().forEach((item) => {
      const classAttr = item.getAttribute(ClassToggleAttr.CLASS) || item.getAttribute(ClassToggleAttr.CLASS_DEPRECATED) || "is-active";
      classAttr.split(/\s+/).forEach((cls) => {
        if (cls) item.classList.toggle(cls);
      });
    });
  }
  /**
   * Gets all toggle items associated with this toggle instance.
   * @returns A NodeList of all HTML elements associated with this toggle instance.
   */
  getToggleItems() {
    return document.querySelectorAll(`[${ClassToggleAttr.ITEM}="${this.id}"], [${ClassToggleAttr.ITEM_DEPRECATED}="${this.id}"]`);
  }
  toggleGroupMembers() {
    const group = _ClassToggle.groups[this.groupId];
    for (const memberId in group) {
      if (memberId !== this.id) {
        group[memberId].close();
      }
    }
  }
  /**
   * Closes the toggle by removing the active class from all associated toggle items.
   */
  close() {
    this.trigger.setAttribute("aria-pressed", "false");
    this.getToggleItems().forEach((item) => {
      const classAttr = item.getAttribute(ClassToggleAttr.CLASS) || item.getAttribute(ClassToggleAttr.CLASS_DEPRECATED) || "is-active";
      classAttr.split(/\s+/).forEach((cls) => {
        if (cls) item.classList.remove(cls);
      });
    });
  }
};
__name(_ClassToggle, "ClassToggle");
__publicField(_ClassToggle, "groups", {});
let ClassToggle = _ClassToggle;
const _ClassToggleInitializer = class _ClassToggleInitializer {
  /**
   * Initializes ClassToggle instances for all triggers found in the document and sets up a MutationObserver to handle dynamically added triggers.
   */
  init() {
    this.findTriggers(document.documentElement || document.body).forEach((trigger) => {
      this.initTrigger(trigger);
    });
    this.observeAddedNodes();
  }
  /**
   * Observes the document for added nodes and initializes ClassToggle instances for any new triggers found.
   */
  observeAddedNodes() {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === "childList") {
          mutation.addedNodes.forEach((node) => {
            if (node instanceof HTMLElement) {
              let triggers = [...this.findTriggers(node)];
              if (node.hasAttribute(ClassToggleAttr.TRIGGER) || node.hasAttribute(ClassToggleAttr.TRIGGER_DEPRECATED)) {
                triggers.push(node);
              }
              triggers.forEach((trigger) => {
                this.initTrigger(trigger);
              });
            }
          });
        }
      });
    });
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }
  /**
   * Finds all trigger elements within the specified root element.
   * @param element The root element to search within.
   * @returns A NodeList of all trigger elements found.
   */
  findTriggers(element) {
    return element.querySelectorAll(`[${ClassToggleAttr.TRIGGER}], [${ClassToggleAttr.TRIGGER_DEPRECATED}]`);
  }
  /**
   * Initializes a ClassToggle instance for the specified trigger element.
   * @param trigger The trigger element to initialize.
   */
  initTrigger(trigger) {
    let triggerId = trigger.getAttribute(ClassToggleAttr.TRIGGER) || trigger.getAttribute(ClassToggleAttr.TRIGGER_DEPRECATED);
    let groupId = trigger.getAttribute(ClassToggleAttr.GROUP) || trigger.getAttribute(ClassToggleAttr.GROUP_DEPRECATED);
    if (triggerId) {
      new ClassToggle(trigger, triggerId, groupId);
    }
  }
};
__name(_ClassToggleInitializer, "ClassToggleInitializer");
let ClassToggleInitializer = _ClassToggleInitializer;
const _Menu = class _Menu {
  constructor() {
    this.TRIGGER = "js-menu-trigger";
    this.DART = "js-menu-dart";
    this.TARGET = "js-menu-target";
    this.EXPANDID = "data-load-submenu";
    this.elm = "";
    this.getSubitem();
    this.getNavbar();
  }
  /**
   * Finds each navbar in the document.
   * 
   * Finds each navbar in the document and then sends it for further handling
   */
  getNavbar() {
    const navbar = document.querySelectorAll(".c-navbar");
    navbar.forEach((element) => {
    });
  }
  /**
   * Adds event listeners to the link items.
   * 
   * @param {*} element   The navbar element to add triggers to
   */
  addTriggers(element) {
    const triggers = element.querySelectorAll(`[${this.TRIGGER}]`);
    triggers.forEach((trigger) => {
      const toggleClass2 = trigger.getAttribute(this.TRIGGER);
      const targetId = trigger.getAttribute(this.DART);
      trigger.addEventListener("click", (event2) => {
        const targets = document.querySelectorAll(`[${this.TARGET}="${targetId}"]`);
        targets.forEach((target) => {
          target.classList.toggle(toggleClass2);
        });
      });
    });
  }
  /**
   * Looks if a nav items has children.
   * 
   * First looks if nav items has children, if it does then it add and event listener to the toggle button
   * 
   * @param {*} root  The container to look inside, cna be a single nav item or the root navbar
   */
  getSubitem(root) {
    const IDS = root ? root.querySelectorAll(`[${this.EXPANDID}]`) : document.querySelectorAll(`[${this.EXPANDID}]`);
    IDS.forEach((id) => {
      id.addEventListener("click", (event2) => {
        event2.preventDefault();
        id.toggleAttribute("is-open");
        if (!id.hasAttribute("data-isAppended-subitem")) {
          id.setAttribute("data-isAppended-subitem", "");
          this.findItems([], id.getAttribute(this.EXPANDID));
        }
      });
    });
  }
  /**
   * Fetches JSON data
   * 
   * @param {*} path  Path to json file
   * @param {*} find  What id to look for
   */
  fetchJSONFile(path, find) {
    const httpRequest = new XMLHttpRequest();
    httpRequest.onreadystatechange = () => {
      if (httpRequest.readyState === 4 || httpRequest.readyState === 0) {
        if (httpRequest.status === 200) {
          const data = JSON.parse(httpRequest.responseText);
          this.findItems(data, find);
          return data;
        }
      }
      return 0;
    };
    httpRequest.open("GET", path, true);
    httpRequest.send();
  }
  /**
   * Looks for a specific nav item
   * @param {*} data Data to search through
   * @param {*} find What id to look for
   */
  findItems(data, find) {
    if (data.length > 0) {
      return Object.keys(data).some((k) => {
        if (data[k].id === find) {
          this.appendItems(data[k].list, data[k].id);
          return 0;
        }
        if (Array.isArray(data[k].list)) {
          return this.findItems(data[k].list, find);
        }
        return 0;
      });
    }
    this.fetchJSONFile("/assets/data/nav.json", find);
    return 0;
  }
  /**
   * Appends each child item to the parent item.
   * 
   * @param {*} list  List of items to be appended
   * @param {*} id    Identifier for which element to append to.
   */
  appendItems(list, id) {
    const target = document.querySelector(`[data-append-submenu="${id}"]`);
    list.forEach((item) => {
      this.buildDOM(item);
      target.appendChild(this.elm);
      this.getSubitem(this.elm);
      this.addTriggers(this.elm);
    });
  }
  /**
   * Builds a nav item dom object 
   * 
   * @param {*} item The item data to build the element based on
   */
  buildDOM(item) {
    const uniqID = Math.random().toString(36).substr(2, 9);
    const newLink = document.createElement("a");
    newLink.href = item.href;
    const newEl = document.createElement("div");
    newEl.className = "c-navbar__item";
    const newSpan = document.createElement("span");
    newSpan.appendChild(document.createTextNode(item.name));
    newEl.appendChild(newSpan);
    if (item.list) {
      const newTgl = document.createElement("div");
      newTgl.className = "c-navbar__toggle";
      const newBtn = document.createElement("button");
      newBtn.className = "c-button c-button__icon";
      newBtn.setAttribute("js-menu-trigger", "c-navbar__subitem--expanded");
      newBtn.setAttribute("js-menu-dart", uniqID);
      newBtn.setAttribute("data-load-submenu", item.id);
      const newLbl = document.createElement("span");
      newLbl.className = "c-btn__label";
      const newIcon = document.createElement("i");
      newIcon.className = "c-icon c-icon--color-primary c-icon--size-md material-icons";
      newIcon.appendChild(document.createTextNode("expand_more"));
      newLbl.appendChild(newIcon);
      newBtn.appendChild(newLbl);
      newTgl.appendChild(newBtn);
      newEl.appendChild(newTgl);
      const newSubItem = document.createElement("div");
      newSubItem.className = "c-navbar__subitem";
      newSubItem.setAttribute("js-menu-target", uniqID);
      newSubItem.setAttribute("data-append-submenu", item.id);
      newEl.appendChild(newSubItem);
    }
    newLink.appendChild(newEl);
    this.elm = newLink;
  }
};
__name(_Menu, "Menu");
let Menu = _Menu;
const _Steppers = class _Steppers {
  constructor() {
    this.dataSteps = null;
    this.stepperLength = null;
    this.modalId = null;
    this.container = null;
  }
  /**
   * Enable and init Steppers
   */
  enableStepper(stepperType, container, stepperLength, generate) {
    const self2 = this;
    this.container = container;
    this.stepperLength = stepperLength;
    switch (stepperType) {
      case "dots":
        setTimeout(function() {
          self2.dots(generate);
        }, 500);
        break;
    }
  }
  /**
   * Steppers - Dots
   * @param generate
   */
  dots(generate) {
    if (generate) {
      if (this.container.querySelector(".c-steppers--type-dots").childElementCount !== 0) {
        this.container.querySelector(".c-steppers__dot").innerHTML = "";
      } else {
        for (let int = 0; int < this.stepperLength; int++) {
          this.container.querySelector(".c-steppers--type-dots").insertAdjacentHTML(
            "beforeend",
            '<i class="c-steppers__dot c-steppers__dot-' + int + '"></i>'
          );
        }
      }
    }
    for (let removeDot of this.container.querySelectorAll(".c-steppers__dot")) {
      if (removeDot.classList.contains("c-steppers__dot-active")) {
        removeDot.classList.remove("c-steppers__dot-active");
      }
    }
    let activeStep = this.container.querySelector("[data-step]").getAttribute("data-step");
    this.container.querySelector(".c-steppers__dot-" + activeStep).classList.add("c-steppers__dot-active");
  }
};
__name(_Steppers, "Steppers");
let Steppers = _Steppers;
const _SplitButton = class _SplitButton {
  constructor() {
    this.SPLIT = "js-split";
    this.DROPDOWNLISTVISIBLE = "c-dropdown__list--visible";
  }
  syncSplitButton() {
    const splitButtons = document.querySelectorAll(`[${this.SPLIT}]`);
    splitButtons.forEach((splitButton) => {
      let buttons = splitButton.getElementsByClassName("c-button");
      let actionButton = buttons[0];
      let dropDownList = splitButton.getElementsByClassName("c-dropdown__list")[0];
      let listItems = dropDownList.getElementsByTagName("li");
      for (let item of listItems) {
        item.addEventListener("click", () => {
          actionButton.innerText = item.innerText;
        });
      }
    });
  }
};
__name(_SplitButton, "SplitButton");
let SplitButton = _SplitButton;
const _Checkbox = class _Checkbox {
  constructor(checkboxGroups) {
    checkboxGroups && this.setListener(checkboxGroups);
  }
  setListener(checkboxGroups) {
    checkboxGroups.forEach((checkboxGroup) => {
      const checkboxes = checkboxGroup.querySelectorAll(".c-option__checkbox--hidden-box");
      let validationElement = checkboxGroup.querySelector(".js-checkbox-valid");
      checkboxes.forEach((checkbox) => {
        checkbox.addEventListener("change", () => {
          let validator = checkboxGroup.querySelectorAll('.c-option [type="checkbox"]:checked');
          if (validator.length > 0) {
            validationElement.setAttribute("checked", true);
            checkboxGroup.querySelector(".c-field__label").classList.remove("u-color__text--danger");
          } else {
            validationElement.removeAttribute("checked");
          }
        });
      });
    });
  }
  validateCheckboxes(checkboxGroups) {
    let hasChecked = [];
    checkboxGroups.forEach((group) => {
      let input = group.querySelector("[data-js-required]");
      let validation = input.getAttribute("checked") ? true : false;
      if (input.hasAttribute("js-no-validation")) {
        validation = true;
      }
      hasChecked.push(validation);
      if (!validation) {
        group.querySelector(".c-field__label").classList.add("u-color__text--danger");
      } else {
        group.querySelector(".c-field__label").classList.remove("u-color__text--danger");
      }
    });
    return hasChecked.includes(false) ? false : true;
  }
};
__name(_Checkbox, "Checkbox");
let Checkbox = _Checkbox;
const _Collapse = class _Collapse {
  constructor(form) {
    if (!form) return;
    this.collapseSections = form.querySelectorAll(".mod-form-collapse");
    this.setListener();
  }
  setListener() {
    [...this.collapseSections].forEach((collapseButton) => {
      this.collapse(collapseButton);
      collapseButton.addEventListener("click", () => {
        this.collapse(collapseButton);
      });
    });
  }
  collapse(collapseButton = false) {
    let element = collapseButton.nextElementSibling;
    do {
      element.classList.toggle("u-display--none");
      element = element.nextElementSibling ? element.nextElementSibling : false;
    } while (element ? element.classList.contains("mod-form-field") : false);
  }
};
__name(_Collapse, "Collapse");
let Collapse = _Collapse;
const _Policy = class _Policy {
  constructor(form) {
    this.parentElement = null;
    form && this.setListener(form);
  }
  setListener(form) {
    this.parentElement = form.querySelector(".js-policy-acceptance");
    if (this.parentElement) {
      this.parentElement.querySelector(".c-option__checkbox--hidden-box").addEventListener("change", () => {
        this.parentElement.querySelector('.c-option [type="checkbox"]:checked') ? this.parentElement.querySelector(".c-option__checkbox--label-text").classList.remove("u-color__text--danger") : "";
      });
    }
  }
  validatePolicy() {
    if (this.parentElement) {
      let checked = this.parentElement.querySelector('.c-option [type="checkbox"]:checked') ? true : false;
      if (!checked) {
        this.parentElement.querySelector(".c-option__checkbox--label-text").classList.add("u-color__text--danger");
      }
      return this.parentElement.querySelector('.c-option [type="checkbox"]:checked') ? true : false;
    }
  }
};
__name(_Policy, "Policy");
let Policy = _Policy;
const _Conditions = class _Conditions {
  constructor(form) {
    form && this.init(form);
  }
  init(form) {
    const groups = form.querySelectorAll("[conditional-target]");
    const conditionalElements = form.querySelectorAll("[conditional]") && Array.from(form.querySelectorAll("[conditional]")).map((element) => element).filter((element) => element.getAttribute("conditional"));
    let condtionalTargets = [];
    Array.from(groups).forEach((group) => {
      condtionalTargets.push({ element: group, json: JSON.parse(group.getAttribute("conditional-target")) });
      this.handleRequired(group.querySelectorAll("[data-js-required]"), true);
    });
    conditionalElements.forEach((element) => {
      element.addEventListener("change", (e) => {
        let conditions = element.getAttribute("conditional");
        conditions = JSON.parse(conditions.replace(/'/g, '"'));
        this.show(conditions, condtionalTargets);
      });
    });
  }
  show(conditions, condtionalTargets) {
    condtionalTargets.forEach((arr) => {
      if (conditions.label === arr.json.label) {
        if (conditions.value === arr.json.value) {
          arr.element.style.display = "block";
          this.handleRequired(arr.element.querySelectorAll("[js-no-validation]", false));
        } else {
          arr.element.style.display = "none";
          this.handleRequired(arr.element.querySelectorAll("[data-js-required]"), true);
        }
      }
    });
  }
  handleRequired(inputs, isHidden) {
    inputs && inputs.forEach((input) => {
      if (isHidden) {
        input.setAttribute("js-no-validation", "");
        input.removeAttribute("required");
      } else {
        input.removeAttribute("js-no-validation");
        if (input.hasAttribute("data-js-required")) {
          input.setAttribute("required", "");
        }
      }
    });
  }
};
__name(_Conditions, "Conditions");
let Conditions = _Conditions;
const _Fields = class _Fields {
  constructor(form) {
    if (!form) return;
    this.form = form;
    this.inputs = form.querySelectorAll("input, textarea, select");
    this.checkboxGroups = form.querySelectorAll(".checkbox-group-required");
    this.setupFormValidate(form);
  }
  setupFormValidate() {
    const params = this.initialize();
    const formEmpty = new CustomEvent("formEmpty", {});
    this.checkEmpty();
    this.form.addEventListener("change", (e) => {
      this.form.dispatchEvent(formEmpty);
    });
    this.inputs.forEach((input) => {
      if (input.hasAttribute("data-validation-message")) {
        this.getFieldWrapper(input).querySelector(".c-field__error").setAttribute("aria-label", input.getAttribute("data-validation-message"));
        this.getFieldWrapper(input).querySelector(".c-field__error-message").innerHTML = input.getAttribute("data-validation-message");
      } else {
        if (this.getFieldWrapper(input).querySelector(".c-field__error")) {
          this.getFieldWrapper(input).querySelector(".c-field__error").remove();
        }
      }
      if (input.closest(".c-select--multiselect")) {
        let multiSelect = input.closest(".c-select--multiselect");
        multiSelect.querySelector(".c-select__options").addEventListener("click", (e) => {
          this.form.dispatchEvent(formEmpty);
        });
      }
    });
    this.setValidationListeners(params);
  }
  checkFormRequirements(form) {
    if (form.querySelector('[type="submit"]') === null) {
      console.error("Form must have a submit button.", form);
      return false;
    }
    return true;
  }
  initialize() {
    const checkboxHandler = new Checkbox(this.checkboxGroups);
    new Collapse(this.form);
    const policyHandler = new Policy(this.form);
    new Conditions(this.form);
    return { checkboxHandler, policyHandler };
  }
  setValidationListeners(params) {
    this.keyup();
    this.focusout();
    this.click(params);
    this.submit(params);
    this.form.addEventListener("formEmpty", () => {
      this.checkEmpty();
    });
  }
  /* Handle validation */
  validateInput(input, submitCheck = false) {
    let valueLength = input.value ? input.value.length : 0;
    if (input.hasAttribute("js-no-validation") || input.type === "checkbox" || input.type === "radio") {
      return;
    }
    if (["date", "week", "month", "time"].indexOf(input.type) != -1) {
      valueLength = 1;
    }
    if (valueLength > 0 || submitCheck) {
      if (input.hasAttribute("required")) {
        if (input.checkValidity()) {
          this.handleValid(input);
          return true;
        } else {
          this.handleInvalid(input);
          return false;
        }
      }
    } else {
      this.handleNotFilled(input);
      return false;
    }
  }
  handleValid(input) {
    this.classToggle(this.getFieldWrapper(input), "is-valid", "is-invalid");
    this.getFieldWrapper(input).querySelector(".c-field__error") ? this.getFieldWrapper(input).querySelector(".c-field__error").setAttribute("aria-hidden", true) : "";
  }
  handleInvalid(input) {
    this.classToggle(this.getFieldWrapper(input), "is-invalid", "is-valid");
    this.getFieldWrapper(input).querySelector(".c-field__error") ? this.getFieldWrapper(input).querySelector(".c-field__error").setAttribute("aria-hidden", false) : "";
  }
  handleNotFilled(input) {
    this.getFieldWrapper(input).classList.remove("is-valid", "is-invalid");
    this.getFieldWrapper(input).querySelector(".c-field__error") ? this.getFieldWrapper(input).querySelector(".c-field__error").setAttribute("aria-hidden", true) : "";
  }
  classToggle(element, addClass2, removeClass2) {
    !element.classList.contains(addClass2) ? element.classList.add(addClass2) : "";
    element.classList.remove(removeClass2);
  }
  getFieldWrapper(input) {
    var fieldWrapper = input;
    do {
      if (fieldWrapper.parentNode !== document.body) {
        fieldWrapper = fieldWrapper.parentNode;
      } else {
        return input;
      }
    } while (!fieldWrapper.matches(".c-field, .c-option, .c-select"));
    return fieldWrapper;
  }
  /*  Listeners  */
  keyup() {
    this.inputs.forEach((input) => {
      input.addEventListener("keyup", () => {
        if (this.getFieldWrapper(input).classList.contains("is-invalid") || this.getFieldWrapper(input).classList.contains("is-valid")) {
          this.validateInput(input);
        }
        this.checkEmpty();
      });
    });
  }
  focusout() {
    ["focusout", "change"].forEach((e) => {
      [...this.inputs].forEach((input) => {
        input.addEventListener(e, () => {
          this.validateInput(input);
          this.checkEmpty();
        });
      });
    });
  }
  click({ checkboxHandler, policyHandler }) {
    const submitButton = this.form.querySelector('[type="submit"]');
    if (submitButton) {
      submitButton.addEventListener("click", (e) => {
        let containsInvalid = [];
        this.inputs.forEach((input) => {
          containsInvalid.push(this.validateInput(input, true));
        });
        containsInvalid.push(policyHandler.validatePolicy());
        containsInvalid.push(checkboxHandler.validateCheckboxes(this.checkboxGroups));
        if (containsInvalid.includes(false)) {
          this.classToggle(this.form, "is-invalid", "is-valid");
          checkboxHandler.validateCheckboxes(this.checkboxGroups);
          [...this.form.querySelectorAll(".c-form__notice-failed")].forEach((element) => {
            element.setAttribute("aria-hidden", false);
          });
          [...this.form.querySelectorAll(".c-form__notice-success")].forEach((element) => {
            element.setAttribute("aria-hidden", true);
          });
        }
      });
    }
  }
  checkEmpty() {
    let emptyForm = false;
    let attatchedFiles = false;
    let checkInputs = [];
    let submitButton = this.form.querySelector('[type="submit"]');
    this.form.querySelectorAll("input[js-field-fileinput]") ? this.form.querySelectorAll("input[js-field-fileinput]").length > 0 ? attatchedFiles = true : false : attatchedFiles = false;
    this.inputs.forEach((input) => {
      if (emptyForm) return;
      if (input?.type && (input?.type === "radio" || input?.type === "checkbox")) {
        checkInputs.push(input);
        return;
      }
      if (!input.classList.contains("js-no-validation")) {
        if (input.getAttribute("type") !== "hidden") {
          input.value.length > 0 || attatchedFiles ? emptyForm = true : "";
        }
      }
      this.validateInput(input);
    });
    if (!emptyForm && checkInputs.length > 0) {
      checkInputs.forEach((input) => {
        if (input.checked && !emptyForm) {
          emptyForm = true;
        }
      });
    }
    if (submitButton) {
      !emptyForm ? submitButton.disabled = true : submitButton.disabled = false;
    }
    return emptyForm;
  }
  submit({ checkboxHandler, policyHandler }) {
    let submitButton = this.form.querySelector('[type="submit"]');
    this.form.addEventListener("submit", (e) => {
      if (!checkboxHandler.validateCheckboxes(this.checkboxGroups)) {
        e.preventDefault();
        this.classToggle(this.form, "is-invalid", "is-valid");
      } else {
        this.classToggle(this.form, "is-valid", "is-invalid");
        if (typeof formbuilder !== "undefined") {
          submitButton ? submitButton.innerHTML = formbuilder.sending : "";
        }
      }
      [...this.form.querySelectorAll(".c-form__notice-failed")].forEach((element) => {
        element.setAttribute("aria-hidden", true);
      });
      [...this.form.querySelectorAll(".c-form__notice-success")].forEach((element) => {
        element.setAttribute("aria-hidden", false);
      });
    });
  }
};
__name(_Fields, "Fields");
let Fields = _Fields;
function initializeForms() {
  const forms = document.querySelectorAll(".js-form-validation");
  [...forms].forEach((form) => {
    new Fields(form);
  });
}
__name(initializeForms, "initializeForms");
function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}
__name(_defineProperties, "_defineProperties");
function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  Object.defineProperty(Constructor, "prototype", { writable: false });
  return Constructor;
}
__name(_createClass, "_createClass");
var MEDIA_PREFERS_REDUCED_MOTION = "(prefers-reduced-motion: reduce)";
var CREATED = 1;
var MOUNTED = 2;
var IDLE = 3;
var MOVING = 4;
var SCROLLING = 5;
var DRAGGING = 6;
var DESTROYED = 7;
var STATES = {
  CREATED,
  MOUNTED,
  IDLE,
  MOVING,
  SCROLLING,
  DRAGGING,
  DESTROYED
};
function empty(array) {
  array.length = 0;
}
__name(empty, "empty");
function slice(arrayLike, start, end) {
  return Array.prototype.slice.call(arrayLike, start, end);
}
__name(slice, "slice");
function apply(func) {
  return func.bind.apply(func, [null].concat(slice(arguments, 1)));
}
__name(apply, "apply");
var nextTick = setTimeout;
var noop = /* @__PURE__ */ __name(function noop2() {
}, "noop");
function raf(func) {
  return requestAnimationFrame(func);
}
__name(raf, "raf");
function typeOf(type2, subject) {
  return typeof subject === type2;
}
__name(typeOf, "typeOf");
function isObject(subject) {
  return !isNull(subject) && typeOf("object", subject);
}
__name(isObject, "isObject");
var isArray = Array.isArray;
var isFunction = apply(typeOf, "function");
var isString = apply(typeOf, "string");
var isUndefined = apply(typeOf, "undefined");
function isNull(subject) {
  return subject === null;
}
__name(isNull, "isNull");
function isHTMLElement(subject) {
  try {
    return subject instanceof (subject.ownerDocument.defaultView || window).HTMLElement;
  } catch (e) {
    return false;
  }
}
__name(isHTMLElement, "isHTMLElement");
function toArray(value) {
  return isArray(value) ? value : [value];
}
__name(toArray, "toArray");
function forEach(values, iteratee) {
  toArray(values).forEach(iteratee);
}
__name(forEach, "forEach");
function includes(array, value) {
  return array.indexOf(value) > -1;
}
__name(includes, "includes");
function push(array, items) {
  array.push.apply(array, toArray(items));
  return array;
}
__name(push, "push");
function toggleClass(elm, classes, add) {
  if (elm) {
    forEach(classes, function(name) {
      if (name) {
        elm.classList[add ? "add" : "remove"](name);
      }
    });
  }
}
__name(toggleClass, "toggleClass");
function addClass(elm, classes) {
  toggleClass(elm, isString(classes) ? classes.split(" ") : classes, true);
}
__name(addClass, "addClass");
function append(parent, children2) {
  forEach(children2, parent.appendChild.bind(parent));
}
__name(append, "append");
function before(nodes, ref) {
  forEach(nodes, function(node) {
    var parent = (ref || node).parentNode;
    if (parent) {
      parent.insertBefore(node, ref);
    }
  });
}
__name(before, "before");
function matches(elm, selector) {
  return isHTMLElement(elm) && (elm["msMatchesSelector"] || elm.matches).call(elm, selector);
}
__name(matches, "matches");
function children(parent, selector) {
  var children2 = parent ? slice(parent.children) : [];
  return selector ? children2.filter(function(child2) {
    return matches(child2, selector);
  }) : children2;
}
__name(children, "children");
function child(parent, selector) {
  return selector ? children(parent, selector)[0] : parent.firstElementChild;
}
__name(child, "child");
var ownKeys = Object.keys;
function forOwn(object, iteratee, right) {
  if (object) {
    (right ? ownKeys(object).reverse() : ownKeys(object)).forEach(function(key) {
      key !== "__proto__" && iteratee(object[key], key);
    });
  }
  return object;
}
__name(forOwn, "forOwn");
function assign(object) {
  slice(arguments, 1).forEach(function(source) {
    forOwn(source, function(value, key) {
      object[key] = source[key];
    });
  });
  return object;
}
__name(assign, "assign");
function merge(object) {
  slice(arguments, 1).forEach(function(source) {
    forOwn(source, function(value, key) {
      if (isArray(value)) {
        object[key] = value.slice();
      } else if (isObject(value)) {
        object[key] = merge({}, isObject(object[key]) ? object[key] : {}, value);
      } else {
        object[key] = value;
      }
    });
  });
  return object;
}
__name(merge, "merge");
function omit(object, keys) {
  forEach(keys || ownKeys(object), function(key) {
    delete object[key];
  });
}
__name(omit, "omit");
function removeAttribute(elms, attrs) {
  forEach(elms, function(elm) {
    forEach(attrs, function(attr) {
      elm && elm.removeAttribute(attr);
    });
  });
}
__name(removeAttribute, "removeAttribute");
function setAttribute(elms, attrs, value) {
  if (isObject(attrs)) {
    forOwn(attrs, function(value2, name) {
      setAttribute(elms, name, value2);
    });
  } else {
    forEach(elms, function(elm) {
      isNull(value) || value === "" ? removeAttribute(elm, attrs) : elm.setAttribute(attrs, String(value));
    });
  }
}
__name(setAttribute, "setAttribute");
function create(tag, attrs, parent) {
  var elm = document.createElement(tag);
  if (attrs) {
    isString(attrs) ? addClass(elm, attrs) : setAttribute(elm, attrs);
  }
  parent && append(parent, elm);
  return elm;
}
__name(create, "create");
function style(elm, prop, value) {
  if (isUndefined(value)) {
    return getComputedStyle(elm)[prop];
  }
  if (!isNull(value)) {
    elm.style[prop] = "" + value;
  }
}
__name(style, "style");
function display(elm, display2) {
  style(elm, "display", display2);
}
__name(display, "display");
function focus(elm) {
  elm["setActive"] && elm["setActive"]() || elm.focus({
    preventScroll: true
  });
}
__name(focus, "focus");
function getAttribute(elm, attr) {
  return elm.getAttribute(attr);
}
__name(getAttribute, "getAttribute");
function hasClass(elm, className) {
  return elm && elm.classList.contains(className);
}
__name(hasClass, "hasClass");
function rect(target) {
  return target.getBoundingClientRect();
}
__name(rect, "rect");
function remove(nodes) {
  forEach(nodes, function(node) {
    if (node && node.parentNode) {
      node.parentNode.removeChild(node);
    }
  });
}
__name(remove, "remove");
function parseHtml(html) {
  return child(new DOMParser().parseFromString(html, "text/html").body);
}
__name(parseHtml, "parseHtml");
function prevent(e, stopPropagation) {
  e.preventDefault();
  if (stopPropagation) {
    e.stopPropagation();
    e.stopImmediatePropagation();
  }
}
__name(prevent, "prevent");
function query(parent, selector) {
  return parent && parent.querySelector(selector);
}
__name(query, "query");
function queryAll(parent, selector) {
  return selector ? slice(parent.querySelectorAll(selector)) : [];
}
__name(queryAll, "queryAll");
function removeClass(elm, classes) {
  toggleClass(elm, classes, false);
}
__name(removeClass, "removeClass");
function timeOf(e) {
  return e.timeStamp;
}
__name(timeOf, "timeOf");
function unit(value) {
  return isString(value) ? value : value ? value + "px" : "";
}
__name(unit, "unit");
var PROJECT_CODE = "splide";
var DATA_ATTRIBUTE = "data-" + PROJECT_CODE;
function assert(condition, message) {
  if (!condition) {
    throw new Error("[" + PROJECT_CODE + "] " + (message || ""));
  }
}
__name(assert, "assert");
var min = Math.min, max = Math.max, floor = Math.floor, ceil = Math.ceil, abs = Math.abs;
function approximatelyEqual(x, y, epsilon) {
  return abs(x - y) < epsilon;
}
__name(approximatelyEqual, "approximatelyEqual");
function between(number, x, y, exclusive) {
  var minimum = min(x, y);
  var maximum = max(x, y);
  return exclusive ? minimum < number && number < maximum : minimum <= number && number <= maximum;
}
__name(between, "between");
function clamp(number, x, y) {
  var minimum = min(x, y);
  var maximum = max(x, y);
  return min(max(minimum, number), maximum);
}
__name(clamp, "clamp");
function sign(x) {
  return +(x > 0) - +(x < 0);
}
__name(sign, "sign");
function format(string, replacements) {
  forEach(replacements, function(replacement) {
    string = string.replace("%s", "" + replacement);
  });
  return string;
}
__name(format, "format");
function pad(number) {
  return number < 10 ? "0" + number : "" + number;
}
__name(pad, "pad");
var ids = {};
function uniqueId(prefix) {
  return "" + prefix + pad(ids[prefix] = (ids[prefix] || 0) + 1);
}
__name(uniqueId, "uniqueId");
function EventBinder() {
  var listeners = [];
  function bind(targets, events, callback, options) {
    forEachEvent(targets, events, function(target, event2, namespace) {
      var isEventTarget = "addEventListener" in target;
      var remover = isEventTarget ? target.removeEventListener.bind(target, event2, callback, options) : target["removeListener"].bind(target, callback);
      isEventTarget ? target.addEventListener(event2, callback, options) : target["addListener"](callback);
      listeners.push([target, event2, namespace, callback, remover]);
    });
  }
  __name(bind, "bind");
  function unbind(targets, events, callback) {
    forEachEvent(targets, events, function(target, event2, namespace) {
      listeners = listeners.filter(function(listener) {
        if (listener[0] === target && listener[1] === event2 && listener[2] === namespace && (!callback || listener[3] === callback)) {
          listener[4]();
          return false;
        }
        return true;
      });
    });
  }
  __name(unbind, "unbind");
  function dispatch(target, type2, detail) {
    var e;
    var bubbles = true;
    if (typeof CustomEvent === "function") {
      e = new CustomEvent(type2, {
        bubbles,
        detail
      });
    } else {
      e = document.createEvent("CustomEvent");
      e.initCustomEvent(type2, bubbles, false, detail);
    }
    target.dispatchEvent(e);
    return e;
  }
  __name(dispatch, "dispatch");
  function forEachEvent(targets, events, iteratee) {
    forEach(targets, function(target) {
      target && forEach(events, function(events2) {
        events2.split(" ").forEach(function(eventNS) {
          var fragment = eventNS.split(".");
          iteratee(target, fragment[0], fragment[1]);
        });
      });
    });
  }
  __name(forEachEvent, "forEachEvent");
  function destroy() {
    listeners.forEach(function(data) {
      data[4]();
    });
    empty(listeners);
  }
  __name(destroy, "destroy");
  return {
    bind,
    unbind,
    dispatch,
    destroy
  };
}
__name(EventBinder, "EventBinder");
var EVENT_MOUNTED = "mounted";
var EVENT_READY = "ready";
var EVENT_MOVE = "move";
var EVENT_MOVED = "moved";
var EVENT_CLICK = "click";
var EVENT_ACTIVE = "active";
var EVENT_INACTIVE = "inactive";
var EVENT_VISIBLE = "visible";
var EVENT_HIDDEN = "hidden";
var EVENT_REFRESH = "refresh";
var EVENT_UPDATED = "updated";
var EVENT_RESIZE = "resize";
var EVENT_RESIZED = "resized";
var EVENT_DRAG = "drag";
var EVENT_DRAGGING = "dragging";
var EVENT_DRAGGED = "dragged";
var EVENT_SCROLL = "scroll";
var EVENT_SCROLLED = "scrolled";
var EVENT_OVERFLOW = "overflow";
var EVENT_DESTROY = "destroy";
var EVENT_ARROWS_MOUNTED = "arrows:mounted";
var EVENT_ARROWS_UPDATED = "arrows:updated";
var EVENT_PAGINATION_MOUNTED = "pagination:mounted";
var EVENT_PAGINATION_UPDATED = "pagination:updated";
var EVENT_NAVIGATION_MOUNTED = "navigation:mounted";
var EVENT_AUTOPLAY_PLAY = "autoplay:play";
var EVENT_AUTOPLAY_PLAYING = "autoplay:playing";
var EVENT_AUTOPLAY_PAUSE = "autoplay:pause";
var EVENT_LAZYLOAD_LOADED = "lazyload:loaded";
var EVENT_SLIDE_KEYDOWN = "sk";
var EVENT_SHIFTED = "sh";
var EVENT_END_INDEX_CHANGED = "ei";
function EventInterface(Splide2) {
  var bus = Splide2 ? Splide2.event.bus : document.createDocumentFragment();
  var binder = EventBinder();
  function on(events, callback) {
    binder.bind(bus, toArray(events).join(" "), function(e) {
      callback.apply(callback, isArray(e.detail) ? e.detail : []);
    });
  }
  __name(on, "on");
  function emit(event2) {
    binder.dispatch(bus, event2, slice(arguments, 1));
  }
  __name(emit, "emit");
  if (Splide2) {
    Splide2.event.on(EVENT_DESTROY, binder.destroy);
  }
  return assign(binder, {
    bus,
    on,
    off: apply(binder.unbind, bus),
    emit
  });
}
__name(EventInterface, "EventInterface");
function RequestInterval(interval, onInterval, onUpdate, limit) {
  var now = Date.now;
  var startTime;
  var rate = 0;
  var id;
  var paused = true;
  var count = 0;
  function update() {
    if (!paused) {
      rate = interval ? min((now() - startTime) / interval, 1) : 1;
      onUpdate && onUpdate(rate);
      if (rate >= 1) {
        onInterval();
        startTime = now();
        if (limit && ++count >= limit) {
          return pause();
        }
      }
      id = raf(update);
    }
  }
  __name(update, "update");
  function start(resume) {
    resume || cancel();
    startTime = now() - (resume ? rate * interval : 0);
    paused = false;
    id = raf(update);
  }
  __name(start, "start");
  function pause() {
    paused = true;
  }
  __name(pause, "pause");
  function rewind() {
    startTime = now();
    rate = 0;
    if (onUpdate) {
      onUpdate(rate);
    }
  }
  __name(rewind, "rewind");
  function cancel() {
    id && cancelAnimationFrame(id);
    rate = 0;
    id = 0;
    paused = true;
  }
  __name(cancel, "cancel");
  function set(time) {
    interval = time;
  }
  __name(set, "set");
  function isPaused() {
    return paused;
  }
  __name(isPaused, "isPaused");
  return {
    start,
    rewind,
    pause,
    cancel,
    set,
    isPaused
  };
}
__name(RequestInterval, "RequestInterval");
function State(initialState) {
  var state = initialState;
  function set(value) {
    state = value;
  }
  __name(set, "set");
  function is(states) {
    return includes(toArray(states), state);
  }
  __name(is, "is");
  return {
    set,
    is
  };
}
__name(State, "State");
function Throttle(func, duration) {
  var interval = RequestInterval(0, func, null, 1);
  return function() {
    interval.isPaused() && interval.start();
  };
}
__name(Throttle, "Throttle");
function Media(Splide2, Components2, options) {
  var state = Splide2.state;
  var breakpoints = options.breakpoints || {};
  var reducedMotion = options.reducedMotion || {};
  var binder = EventBinder();
  var queries = [];
  function setup() {
    var isMin = options.mediaQuery === "min";
    ownKeys(breakpoints).sort(function(n, m) {
      return isMin ? +n - +m : +m - +n;
    }).forEach(function(key) {
      register(breakpoints[key], "(" + (isMin ? "min" : "max") + "-width:" + key + "px)");
    });
    register(reducedMotion, MEDIA_PREFERS_REDUCED_MOTION);
    update();
  }
  __name(setup, "setup");
  function destroy(completely) {
    if (completely) {
      binder.destroy();
    }
  }
  __name(destroy, "destroy");
  function register(options2, query2) {
    var queryList = matchMedia(query2);
    binder.bind(queryList, "change", update);
    queries.push([options2, queryList]);
  }
  __name(register, "register");
  function update() {
    var destroyed = state.is(DESTROYED);
    var direction = options.direction;
    var merged = queries.reduce(function(merged2, entry) {
      return merge(merged2, entry[1].matches ? entry[0] : {});
    }, {});
    omit(options);
    set(merged);
    if (options.destroy) {
      Splide2.destroy(options.destroy === "completely");
    } else if (destroyed) {
      destroy(true);
      Splide2.mount();
    } else {
      direction !== options.direction && Splide2.refresh();
    }
  }
  __name(update, "update");
  function reduce(enable) {
    if (matchMedia(MEDIA_PREFERS_REDUCED_MOTION).matches) {
      enable ? merge(options, reducedMotion) : omit(options, ownKeys(reducedMotion));
    }
  }
  __name(reduce, "reduce");
  function set(opts, base, notify) {
    merge(options, opts);
    base && merge(Object.getPrototypeOf(options), opts);
    if (notify || !state.is(CREATED)) {
      Splide2.emit(EVENT_UPDATED, options);
    }
  }
  __name(set, "set");
  return {
    setup,
    destroy,
    reduce,
    set
  };
}
__name(Media, "Media");
var ARROW = "Arrow";
var ARROW_LEFT = ARROW + "Left";
var ARROW_RIGHT = ARROW + "Right";
var ARROW_UP = ARROW + "Up";
var ARROW_DOWN = ARROW + "Down";
var RTL = "rtl";
var TTB = "ttb";
var ORIENTATION_MAP = {
  width: ["height"],
  left: ["top", "right"],
  right: ["bottom", "left"],
  x: ["y"],
  X: ["Y"],
  Y: ["X"],
  ArrowLeft: [ARROW_UP, ARROW_RIGHT],
  ArrowRight: [ARROW_DOWN, ARROW_LEFT]
};
function Direction(Splide2, Components2, options) {
  function resolve(prop, axisOnly, direction) {
    direction = direction || options.direction;
    var index = direction === RTL && !axisOnly ? 1 : direction === TTB ? 0 : -1;
    return ORIENTATION_MAP[prop] && ORIENTATION_MAP[prop][index] || prop.replace(/width|left|right/i, function(match, offset) {
      var replacement = ORIENTATION_MAP[match.toLowerCase()][index] || match;
      return offset > 0 ? replacement.charAt(0).toUpperCase() + replacement.slice(1) : replacement;
    });
  }
  __name(resolve, "resolve");
  function orient(value) {
    return value * (options.direction === RTL ? 1 : -1);
  }
  __name(orient, "orient");
  return {
    resolve,
    orient
  };
}
__name(Direction, "Direction");
var ROLE = "role";
var TAB_INDEX = "tabindex";
var DISABLED = "disabled";
var ARIA_PREFIX = "aria-";
var ARIA_CONTROLS = ARIA_PREFIX + "controls";
var ARIA_CURRENT = ARIA_PREFIX + "current";
var ARIA_SELECTED = ARIA_PREFIX + "selected";
var ARIA_LABEL = ARIA_PREFIX + "label";
var ARIA_LABELLEDBY = ARIA_PREFIX + "labelledby";
var ARIA_HIDDEN = ARIA_PREFIX + "hidden";
var ARIA_ORIENTATION = ARIA_PREFIX + "orientation";
var ARIA_ROLEDESCRIPTION = ARIA_PREFIX + "roledescription";
var ARIA_LIVE = ARIA_PREFIX + "live";
var ARIA_BUSY = ARIA_PREFIX + "busy";
var ARIA_ATOMIC = ARIA_PREFIX + "atomic";
var ALL_ATTRIBUTES = [ROLE, TAB_INDEX, DISABLED, ARIA_CONTROLS, ARIA_CURRENT, ARIA_LABEL, ARIA_LABELLEDBY, ARIA_HIDDEN, ARIA_ORIENTATION, ARIA_ROLEDESCRIPTION];
var CLASS_PREFIX = PROJECT_CODE + "__";
var STATUS_CLASS_PREFIX = "is-";
var CLASS_ROOT = PROJECT_CODE;
var CLASS_TRACK = CLASS_PREFIX + "track";
var CLASS_LIST = CLASS_PREFIX + "list";
var CLASS_SLIDE = CLASS_PREFIX + "slide";
var CLASS_CLONE = CLASS_SLIDE + "--clone";
var CLASS_CONTAINER = CLASS_SLIDE + "__container";
var CLASS_ARROWS = CLASS_PREFIX + "arrows";
var CLASS_ARROW = CLASS_PREFIX + "arrow";
var CLASS_ARROW_PREV = CLASS_ARROW + "--prev";
var CLASS_ARROW_NEXT = CLASS_ARROW + "--next";
var CLASS_PAGINATION = CLASS_PREFIX + "pagination";
var CLASS_PAGINATION_PAGE = CLASS_PAGINATION + "__page";
var CLASS_PROGRESS = CLASS_PREFIX + "progress";
var CLASS_PROGRESS_BAR = CLASS_PROGRESS + "__bar";
var CLASS_TOGGLE = CLASS_PREFIX + "toggle";
var CLASS_SPINNER = CLASS_PREFIX + "spinner";
var CLASS_SR = CLASS_PREFIX + "sr";
var CLASS_INITIALIZED = STATUS_CLASS_PREFIX + "initialized";
var CLASS_ACTIVE = STATUS_CLASS_PREFIX + "active";
var CLASS_PREV = STATUS_CLASS_PREFIX + "prev";
var CLASS_NEXT = STATUS_CLASS_PREFIX + "next";
var CLASS_VISIBLE = STATUS_CLASS_PREFIX + "visible";
var CLASS_LOADING = STATUS_CLASS_PREFIX + "loading";
var CLASS_FOCUS_IN = STATUS_CLASS_PREFIX + "focus-in";
var CLASS_OVERFLOW = STATUS_CLASS_PREFIX + "overflow";
var STATUS_CLASSES = [CLASS_ACTIVE, CLASS_VISIBLE, CLASS_PREV, CLASS_NEXT, CLASS_LOADING, CLASS_FOCUS_IN, CLASS_OVERFLOW];
var CLASSES = {
  slide: CLASS_SLIDE,
  clone: CLASS_CLONE,
  arrows: CLASS_ARROWS,
  arrow: CLASS_ARROW,
  prev: CLASS_ARROW_PREV,
  next: CLASS_ARROW_NEXT,
  pagination: CLASS_PAGINATION,
  page: CLASS_PAGINATION_PAGE,
  spinner: CLASS_SPINNER
};
function closest(from, selector) {
  if (isFunction(from.closest)) {
    return from.closest(selector);
  }
  var elm = from;
  while (elm && elm.nodeType === 1) {
    if (matches(elm, selector)) {
      break;
    }
    elm = elm.parentElement;
  }
  return elm;
}
__name(closest, "closest");
var FRICTION = 5;
var LOG_INTERVAL = 200;
var POINTER_DOWN_EVENTS = "touchstart mousedown";
var POINTER_MOVE_EVENTS = "touchmove mousemove";
var POINTER_UP_EVENTS = "touchend touchcancel mouseup click";
function Elements(Splide2, Components2, options) {
  var _EventInterface = EventInterface(Splide2), on = _EventInterface.on, bind = _EventInterface.bind;
  var root = Splide2.root;
  var i18n = options.i18n;
  var elements = {};
  var slides = [];
  var rootClasses = [];
  var trackClasses = [];
  var track;
  var list;
  var isUsingKey;
  function setup() {
    collect();
    init2();
    update();
  }
  __name(setup, "setup");
  function mount() {
    on(EVENT_REFRESH, destroy);
    on(EVENT_REFRESH, setup);
    on(EVENT_UPDATED, update);
    bind(document, POINTER_DOWN_EVENTS + " keydown", function(e) {
      isUsingKey = e.type === "keydown";
    }, {
      capture: true
    });
    bind(root, "focusin", function() {
      toggleClass(root, CLASS_FOCUS_IN, !!isUsingKey);
    });
  }
  __name(mount, "mount");
  function destroy(completely) {
    var attrs = ALL_ATTRIBUTES.concat("style");
    empty(slides);
    removeClass(root, rootClasses);
    removeClass(track, trackClasses);
    removeAttribute([track, list], attrs);
    removeAttribute(root, completely ? attrs : ["style", ARIA_ROLEDESCRIPTION]);
  }
  __name(destroy, "destroy");
  function update() {
    removeClass(root, rootClasses);
    removeClass(track, trackClasses);
    rootClasses = getClasses(CLASS_ROOT);
    trackClasses = getClasses(CLASS_TRACK);
    addClass(root, rootClasses);
    addClass(track, trackClasses);
    setAttribute(root, ARIA_LABEL, options.label);
    setAttribute(root, ARIA_LABELLEDBY, options.labelledby);
  }
  __name(update, "update");
  function collect() {
    track = find("." + CLASS_TRACK);
    list = child(track, "." + CLASS_LIST);
    assert(track && list, "A track/list element is missing.");
    push(slides, children(list, "." + CLASS_SLIDE + ":not(." + CLASS_CLONE + ")"));
    forOwn({
      arrows: CLASS_ARROWS,
      pagination: CLASS_PAGINATION,
      prev: CLASS_ARROW_PREV,
      next: CLASS_ARROW_NEXT,
      bar: CLASS_PROGRESS_BAR,
      toggle: CLASS_TOGGLE
    }, function(className, key) {
      elements[key] = find("." + className);
    });
    assign(elements, {
      root,
      track,
      list,
      slides
    });
  }
  __name(collect, "collect");
  function init2() {
    var id = root.id || uniqueId(PROJECT_CODE);
    var role = options.role;
    root.id = id;
    track.id = track.id || id + "-track";
    list.id = list.id || id + "-list";
    if (!getAttribute(root, ROLE) && root.tagName !== "SECTION" && role) {
      setAttribute(root, ROLE, role);
    }
    setAttribute(root, ARIA_ROLEDESCRIPTION, i18n.carousel);
    setAttribute(list, ROLE, "presentation");
  }
  __name(init2, "init");
  function find(selector) {
    var elm = query(root, selector);
    return elm && closest(elm, "." + CLASS_ROOT) === root ? elm : void 0;
  }
  __name(find, "find");
  function getClasses(base) {
    return [base + "--" + options.type, base + "--" + options.direction, options.drag && base + "--draggable", options.isNavigation && base + "--nav", base === CLASS_ROOT && CLASS_ACTIVE];
  }
  __name(getClasses, "getClasses");
  return assign(elements, {
    setup,
    mount,
    destroy
  });
}
__name(Elements, "Elements");
var SLIDE = "slide";
var LOOP = "loop";
var FADE = "fade";
function Slide$1(Splide2, index, slideIndex, slide) {
  var event2 = EventInterface(Splide2);
  var on = event2.on, emit = event2.emit, bind = event2.bind;
  var Components = Splide2.Components, root = Splide2.root, options = Splide2.options;
  var isNavigation = options.isNavigation, updateOnMove = options.updateOnMove, i18n = options.i18n, pagination = options.pagination, slideFocus = options.slideFocus;
  var resolve = Components.Direction.resolve;
  var styles = getAttribute(slide, "style");
  var label = getAttribute(slide, ARIA_LABEL);
  var isClone = slideIndex > -1;
  var container = child(slide, "." + CLASS_CONTAINER);
  var destroyed;
  function mount() {
    if (!isClone) {
      slide.id = root.id + "-slide" + pad(index + 1);
      setAttribute(slide, ROLE, pagination ? "tabpanel" : "group");
      setAttribute(slide, ARIA_ROLEDESCRIPTION, i18n.slide);
      setAttribute(slide, ARIA_LABEL, label || format(i18n.slideLabel, [index + 1, Splide2.length]));
    }
    listen();
  }
  __name(mount, "mount");
  function listen() {
    bind(slide, "click", apply(emit, EVENT_CLICK, self2));
    bind(slide, "keydown", apply(emit, EVENT_SLIDE_KEYDOWN, self2));
    on([EVENT_MOVED, EVENT_SHIFTED, EVENT_SCROLLED], update);
    on(EVENT_NAVIGATION_MOUNTED, initNavigation);
    if (updateOnMove) {
      on(EVENT_MOVE, onMove);
    }
  }
  __name(listen, "listen");
  function destroy() {
    destroyed = true;
    event2.destroy();
    removeClass(slide, STATUS_CLASSES);
    removeAttribute(slide, ALL_ATTRIBUTES);
    setAttribute(slide, "style", styles);
    setAttribute(slide, ARIA_LABEL, label || "");
  }
  __name(destroy, "destroy");
  function initNavigation() {
    var controls = Splide2.splides.map(function(target) {
      var Slide2 = target.splide.Components.Slides.getAt(index);
      return Slide2 ? Slide2.slide.id : "";
    }).join(" ");
    setAttribute(slide, ARIA_LABEL, format(i18n.slideX, (isClone ? slideIndex : index) + 1));
    setAttribute(slide, ARIA_CONTROLS, controls);
    setAttribute(slide, ROLE, slideFocus ? "button" : "");
    slideFocus && removeAttribute(slide, ARIA_ROLEDESCRIPTION);
  }
  __name(initNavigation, "initNavigation");
  function onMove() {
    if (!destroyed) {
      update();
    }
  }
  __name(onMove, "onMove");
  function update() {
    if (!destroyed) {
      var curr = Splide2.index;
      updateActivity();
      updateVisibility();
      toggleClass(slide, CLASS_PREV, index === curr - 1);
      toggleClass(slide, CLASS_NEXT, index === curr + 1);
    }
  }
  __name(update, "update");
  function updateActivity() {
    var active = isActive();
    if (active !== hasClass(slide, CLASS_ACTIVE)) {
      toggleClass(slide, CLASS_ACTIVE, active);
      setAttribute(slide, ARIA_CURRENT, isNavigation && active || "");
      emit(active ? EVENT_ACTIVE : EVENT_INACTIVE, self2);
    }
  }
  __name(updateActivity, "updateActivity");
  function updateVisibility() {
    var visible = isVisible();
    var hidden = !visible && (!isActive() || isClone);
    if (!Splide2.state.is([MOVING, SCROLLING])) {
      setAttribute(slide, ARIA_HIDDEN, hidden || "");
    }
    setAttribute(queryAll(slide, options.focusableNodes || ""), TAB_INDEX, hidden ? -1 : "");
    if (slideFocus) {
      setAttribute(slide, TAB_INDEX, hidden ? -1 : 0);
    }
    if (visible !== hasClass(slide, CLASS_VISIBLE)) {
      toggleClass(slide, CLASS_VISIBLE, visible);
      emit(visible ? EVENT_VISIBLE : EVENT_HIDDEN, self2);
    }
    if (!visible && document.activeElement === slide) {
      var Slide2 = Components.Slides.getAt(Splide2.index);
      Slide2 && focus(Slide2.slide);
    }
  }
  __name(updateVisibility, "updateVisibility");
  function style$1(prop, value, useContainer) {
    style(useContainer && container || slide, prop, value);
  }
  __name(style$1, "style$1");
  function isActive() {
    var curr = Splide2.index;
    return curr === index || options.cloneStatus && curr === slideIndex;
  }
  __name(isActive, "isActive");
  function isVisible() {
    if (Splide2.is(FADE)) {
      return isActive();
    }
    var trackRect = rect(Components.Elements.track);
    var slideRect = rect(slide);
    var left = resolve("left", true);
    var right = resolve("right", true);
    return floor(trackRect[left]) <= ceil(slideRect[left]) && floor(slideRect[right]) <= ceil(trackRect[right]);
  }
  __name(isVisible, "isVisible");
  function isWithin(from, distance) {
    var diff = abs(from - index);
    if (!isClone && (options.rewind || Splide2.is(LOOP))) {
      diff = min(diff, Splide2.length - diff);
    }
    return diff <= distance;
  }
  __name(isWithin, "isWithin");
  var self2 = {
    index,
    slideIndex,
    slide,
    container,
    isClone,
    mount,
    destroy,
    update,
    style: style$1,
    isWithin
  };
  return self2;
}
__name(Slide$1, "Slide$1");
function Slides(Splide2, Components2, options) {
  var _EventInterface2 = EventInterface(Splide2), on = _EventInterface2.on, emit = _EventInterface2.emit, bind = _EventInterface2.bind;
  var _Components2$Elements = Components2.Elements, slides = _Components2$Elements.slides, list = _Components2$Elements.list;
  var Slides2 = [];
  function mount() {
    init2();
    on(EVENT_REFRESH, destroy);
    on(EVENT_REFRESH, init2);
  }
  __name(mount, "mount");
  function init2() {
    slides.forEach(function(slide, index) {
      register(slide, index, -1);
    });
  }
  __name(init2, "init");
  function destroy() {
    forEach$1(function(Slide2) {
      Slide2.destroy();
    });
    empty(Slides2);
  }
  __name(destroy, "destroy");
  function update() {
    forEach$1(function(Slide2) {
      Slide2.update();
    });
  }
  __name(update, "update");
  function register(slide, index, slideIndex) {
    var object = Slide$1(Splide2, index, slideIndex, slide);
    object.mount();
    Slides2.push(object);
    Slides2.sort(function(Slide1, Slide2) {
      return Slide1.index - Slide2.index;
    });
  }
  __name(register, "register");
  function get(excludeClones) {
    return excludeClones ? filter(function(Slide2) {
      return !Slide2.isClone;
    }) : Slides2;
  }
  __name(get, "get");
  function getIn(page) {
    var Controller2 = Components2.Controller;
    var index = Controller2.toIndex(page);
    var max2 = Controller2.hasFocus() ? 1 : options.perPage;
    return filter(function(Slide2) {
      return between(Slide2.index, index, index + max2 - 1);
    });
  }
  __name(getIn, "getIn");
  function getAt(index) {
    return filter(index)[0];
  }
  __name(getAt, "getAt");
  function add(items, index) {
    forEach(items, function(slide) {
      if (isString(slide)) {
        slide = parseHtml(slide);
      }
      if (isHTMLElement(slide)) {
        var ref = slides[index];
        ref ? before(slide, ref) : append(list, slide);
        addClass(slide, options.classes.slide);
        observeImages(slide, apply(emit, EVENT_RESIZE));
      }
    });
    emit(EVENT_REFRESH);
  }
  __name(add, "add");
  function remove$1(matcher) {
    remove(filter(matcher).map(function(Slide2) {
      return Slide2.slide;
    }));
    emit(EVENT_REFRESH);
  }
  __name(remove$1, "remove$1");
  function forEach$1(iteratee, excludeClones) {
    get(excludeClones).forEach(iteratee);
  }
  __name(forEach$1, "forEach$1");
  function filter(matcher) {
    return Slides2.filter(isFunction(matcher) ? matcher : function(Slide2) {
      return isString(matcher) ? matches(Slide2.slide, matcher) : includes(toArray(matcher), Slide2.index);
    });
  }
  __name(filter, "filter");
  function style2(prop, value, useContainer) {
    forEach$1(function(Slide2) {
      Slide2.style(prop, value, useContainer);
    });
  }
  __name(style2, "style");
  function observeImages(elm, callback) {
    var images = queryAll(elm, "img");
    var length = images.length;
    if (length) {
      images.forEach(function(img) {
        bind(img, "load error", function() {
          if (!--length) {
            callback();
          }
        });
      });
    } else {
      callback();
    }
  }
  __name(observeImages, "observeImages");
  function getLength(excludeClones) {
    return excludeClones ? slides.length : Slides2.length;
  }
  __name(getLength, "getLength");
  function isEnough() {
    return Slides2.length > options.perPage;
  }
  __name(isEnough, "isEnough");
  return {
    mount,
    destroy,
    update,
    register,
    get,
    getIn,
    getAt,
    add,
    remove: remove$1,
    forEach: forEach$1,
    filter,
    style: style2,
    getLength,
    isEnough
  };
}
__name(Slides, "Slides");
function Layout(Splide2, Components2, options) {
  var _EventInterface3 = EventInterface(Splide2), on = _EventInterface3.on, bind = _EventInterface3.bind, emit = _EventInterface3.emit;
  var Slides2 = Components2.Slides;
  var resolve = Components2.Direction.resolve;
  var _Components2$Elements2 = Components2.Elements, root = _Components2$Elements2.root, track = _Components2$Elements2.track, list = _Components2$Elements2.list;
  var getAt = Slides2.getAt, styleSlides = Slides2.style;
  var vertical;
  var rootRect;
  var overflow;
  function mount() {
    init2();
    bind(window, "resize load", Throttle(apply(emit, EVENT_RESIZE)));
    on([EVENT_UPDATED, EVENT_REFRESH], init2);
    on(EVENT_RESIZE, resize);
  }
  __name(mount, "mount");
  function init2() {
    vertical = options.direction === TTB;
    style(root, "maxWidth", unit(options.width));
    style(track, resolve("paddingLeft"), cssPadding(false));
    style(track, resolve("paddingRight"), cssPadding(true));
    resize(true);
  }
  __name(init2, "init");
  function resize(force) {
    var newRect = rect(root);
    if (force || rootRect.width !== newRect.width || rootRect.height !== newRect.height) {
      style(track, "height", cssTrackHeight());
      styleSlides(resolve("marginRight"), unit(options.gap));
      styleSlides("width", cssSlideWidth());
      styleSlides("height", cssSlideHeight(), true);
      rootRect = newRect;
      emit(EVENT_RESIZED);
      if (overflow !== (overflow = isOverflow())) {
        toggleClass(root, CLASS_OVERFLOW, overflow);
        emit(EVENT_OVERFLOW, overflow);
      }
    }
  }
  __name(resize, "resize");
  function cssPadding(right) {
    var padding = options.padding;
    var prop = resolve(right ? "right" : "left");
    return padding && unit(padding[prop] || (isObject(padding) ? 0 : padding)) || "0px";
  }
  __name(cssPadding, "cssPadding");
  function cssTrackHeight() {
    var height = "";
    if (vertical) {
      height = cssHeight();
      assert(height, "height or heightRatio is missing.");
      height = "calc(" + height + " - " + cssPadding(false) + " - " + cssPadding(true) + ")";
    }
    return height;
  }
  __name(cssTrackHeight, "cssTrackHeight");
  function cssHeight() {
    return unit(options.height || rect(list).width * options.heightRatio);
  }
  __name(cssHeight, "cssHeight");
  function cssSlideWidth() {
    return options.autoWidth ? null : unit(options.fixedWidth) || (vertical ? "" : cssSlideSize());
  }
  __name(cssSlideWidth, "cssSlideWidth");
  function cssSlideHeight() {
    return unit(options.fixedHeight) || (vertical ? options.autoHeight ? null : cssSlideSize() : cssHeight());
  }
  __name(cssSlideHeight, "cssSlideHeight");
  function cssSlideSize() {
    var gap = unit(options.gap);
    return "calc((100%" + (gap && " + " + gap) + ")/" + (options.perPage || 1) + (gap && " - " + gap) + ")";
  }
  __name(cssSlideSize, "cssSlideSize");
  function listSize() {
    return rect(list)[resolve("width")];
  }
  __name(listSize, "listSize");
  function slideSize(index, withoutGap) {
    var Slide2 = getAt(index || 0);
    return Slide2 ? rect(Slide2.slide)[resolve("width")] + (withoutGap ? 0 : getGap()) : 0;
  }
  __name(slideSize, "slideSize");
  function totalSize(index, withoutGap) {
    var Slide2 = getAt(index);
    if (Slide2) {
      var right = rect(Slide2.slide)[resolve("right")];
      var left = rect(list)[resolve("left")];
      return abs(right - left) + (withoutGap ? 0 : getGap());
    }
    return 0;
  }
  __name(totalSize, "totalSize");
  function sliderSize(withoutGap) {
    return totalSize(Splide2.length - 1) - totalSize(0) + slideSize(0, withoutGap);
  }
  __name(sliderSize, "sliderSize");
  function getGap() {
    var Slide2 = getAt(0);
    return Slide2 && parseFloat(style(Slide2.slide, resolve("marginRight"))) || 0;
  }
  __name(getGap, "getGap");
  function getPadding(right) {
    return parseFloat(style(track, resolve("padding" + (right ? "Right" : "Left")))) || 0;
  }
  __name(getPadding, "getPadding");
  function isOverflow() {
    return Splide2.is(FADE) || sliderSize(true) > listSize();
  }
  __name(isOverflow, "isOverflow");
  return {
    mount,
    resize,
    listSize,
    slideSize,
    sliderSize,
    totalSize,
    getPadding,
    isOverflow
  };
}
__name(Layout, "Layout");
var MULTIPLIER = 2;
function Clones(Splide2, Components2, options) {
  var event2 = EventInterface(Splide2);
  var on = event2.on;
  var Elements2 = Components2.Elements, Slides2 = Components2.Slides;
  var resolve = Components2.Direction.resolve;
  var clones = [];
  var cloneCount;
  function mount() {
    on(EVENT_REFRESH, remount);
    on([EVENT_UPDATED, EVENT_RESIZE], observe);
    if (cloneCount = computeCloneCount()) {
      generate(cloneCount);
      Components2.Layout.resize(true);
    }
  }
  __name(mount, "mount");
  function remount() {
    destroy();
    mount();
  }
  __name(remount, "remount");
  function destroy() {
    remove(clones);
    empty(clones);
    event2.destroy();
  }
  __name(destroy, "destroy");
  function observe() {
    var count = computeCloneCount();
    if (cloneCount !== count) {
      if (cloneCount < count || !count) {
        event2.emit(EVENT_REFRESH);
      }
    }
  }
  __name(observe, "observe");
  function generate(count) {
    var slides = Slides2.get().slice();
    var length = slides.length;
    if (length) {
      while (slides.length < count) {
        push(slides, slides);
      }
      push(slides.slice(-count), slides.slice(0, count)).forEach(function(Slide2, index) {
        var isHead = index < count;
        var clone = cloneDeep(Slide2.slide, index);
        isHead ? before(clone, slides[0].slide) : append(Elements2.list, clone);
        push(clones, clone);
        Slides2.register(clone, index - count + (isHead ? 0 : length), Slide2.index);
      });
    }
  }
  __name(generate, "generate");
  function cloneDeep(elm, index) {
    var clone = elm.cloneNode(true);
    addClass(clone, options.classes.clone);
    clone.id = Splide2.root.id + "-clone" + pad(index + 1);
    return clone;
  }
  __name(cloneDeep, "cloneDeep");
  function computeCloneCount() {
    var clones2 = options.clones;
    if (!Splide2.is(LOOP)) {
      clones2 = 0;
    } else if (isUndefined(clones2)) {
      var fixedSize = options[resolve("fixedWidth")] && Components2.Layout.slideSize(0);
      var fixedCount = fixedSize && ceil(rect(Elements2.track)[resolve("width")] / fixedSize);
      clones2 = fixedCount || options[resolve("autoWidth")] && Splide2.length || options.perPage * MULTIPLIER;
    }
    return clones2;
  }
  __name(computeCloneCount, "computeCloneCount");
  return {
    mount,
    destroy
  };
}
__name(Clones, "Clones");
function Move(Splide2, Components2, options) {
  var _EventInterface4 = EventInterface(Splide2), on = _EventInterface4.on, emit = _EventInterface4.emit;
  var set = Splide2.state.set;
  var _Components2$Layout = Components2.Layout, slideSize = _Components2$Layout.slideSize, getPadding = _Components2$Layout.getPadding, totalSize = _Components2$Layout.totalSize, listSize = _Components2$Layout.listSize, sliderSize = _Components2$Layout.sliderSize;
  var _Components2$Directio = Components2.Direction, resolve = _Components2$Directio.resolve, orient = _Components2$Directio.orient;
  var _Components2$Elements3 = Components2.Elements, list = _Components2$Elements3.list, track = _Components2$Elements3.track;
  var Transition;
  function mount() {
    Transition = Components2.Transition;
    on([EVENT_MOUNTED, EVENT_RESIZED, EVENT_UPDATED, EVENT_REFRESH], reposition);
  }
  __name(mount, "mount");
  function reposition() {
    if (!Components2.Controller.isBusy()) {
      Components2.Scroll.cancel();
      jump(Splide2.index);
      Components2.Slides.update();
    }
  }
  __name(reposition, "reposition");
  function move(dest, index, prev, callback) {
    if (dest !== index && canShift(dest > prev)) {
      cancel();
      translate(shift(getPosition(), dest > prev), true);
    }
    set(MOVING);
    emit(EVENT_MOVE, index, prev, dest);
    Transition.start(index, function() {
      set(IDLE);
      emit(EVENT_MOVED, index, prev, dest);
      callback && callback();
    });
  }
  __name(move, "move");
  function jump(index) {
    translate(toPosition(index, true));
  }
  __name(jump, "jump");
  function translate(position, preventLoop) {
    if (!Splide2.is(FADE)) {
      var destination = preventLoop ? position : loop(position);
      style(list, "transform", "translate" + resolve("X") + "(" + destination + "px)");
      position !== destination && emit(EVENT_SHIFTED);
    }
  }
  __name(translate, "translate");
  function loop(position) {
    if (Splide2.is(LOOP)) {
      var index = toIndex(position);
      var exceededMax = index > Components2.Controller.getEnd();
      var exceededMin = index < 0;
      if (exceededMin || exceededMax) {
        position = shift(position, exceededMax);
      }
    }
    return position;
  }
  __name(loop, "loop");
  function shift(position, backwards) {
    var excess = position - getLimit(backwards);
    var size = sliderSize();
    position -= orient(size * (ceil(abs(excess) / size) || 1)) * (backwards ? 1 : -1);
    return position;
  }
  __name(shift, "shift");
  function cancel() {
    translate(getPosition(), true);
    Transition.cancel();
  }
  __name(cancel, "cancel");
  function toIndex(position) {
    var Slides2 = Components2.Slides.get();
    var index = 0;
    var minDistance = Infinity;
    for (var i = 0; i < Slides2.length; i++) {
      var slideIndex = Slides2[i].index;
      var distance = abs(toPosition(slideIndex, true) - position);
      if (distance <= minDistance) {
        minDistance = distance;
        index = slideIndex;
      } else {
        break;
      }
    }
    return index;
  }
  __name(toIndex, "toIndex");
  function toPosition(index, trimming) {
    var position = orient(totalSize(index - 1) - offset(index));
    return trimming ? trim(position) : position;
  }
  __name(toPosition, "toPosition");
  function getPosition() {
    var left = resolve("left");
    return rect(list)[left] - rect(track)[left] + orient(getPadding(false));
  }
  __name(getPosition, "getPosition");
  function trim(position) {
    if (options.trimSpace && Splide2.is(SLIDE)) {
      position = clamp(position, 0, orient(sliderSize(true) - listSize()));
    }
    return position;
  }
  __name(trim, "trim");
  function offset(index) {
    var focus2 = options.focus;
    return focus2 === "center" ? (listSize() - slideSize(index, true)) / 2 : +focus2 * slideSize(index) || 0;
  }
  __name(offset, "offset");
  function getLimit(max2) {
    return toPosition(max2 ? Components2.Controller.getEnd() : 0, !!options.trimSpace);
  }
  __name(getLimit, "getLimit");
  function canShift(backwards) {
    var shifted = orient(shift(getPosition(), backwards));
    return backwards ? shifted >= 0 : shifted <= list[resolve("scrollWidth")] - rect(track)[resolve("width")];
  }
  __name(canShift, "canShift");
  function exceededLimit(max2, position) {
    position = isUndefined(position) ? getPosition() : position;
    var exceededMin = max2 !== true && orient(position) < orient(getLimit(false));
    var exceededMax = max2 !== false && orient(position) > orient(getLimit(true));
    return exceededMin || exceededMax;
  }
  __name(exceededLimit, "exceededLimit");
  return {
    mount,
    move,
    jump,
    translate,
    shift,
    cancel,
    toIndex,
    toPosition,
    getPosition,
    getLimit,
    exceededLimit,
    reposition
  };
}
__name(Move, "Move");
function Controller(Splide2, Components2, options) {
  var _EventInterface5 = EventInterface(Splide2), on = _EventInterface5.on, emit = _EventInterface5.emit;
  var Move2 = Components2.Move;
  var getPosition = Move2.getPosition, getLimit = Move2.getLimit, toPosition = Move2.toPosition;
  var _Components2$Slides = Components2.Slides, isEnough = _Components2$Slides.isEnough, getLength = _Components2$Slides.getLength;
  var omitEnd = options.omitEnd;
  var isLoop = Splide2.is(LOOP);
  var isSlide = Splide2.is(SLIDE);
  var getNext = apply(getAdjacent, false);
  var getPrev = apply(getAdjacent, true);
  var currIndex = options.start || 0;
  var endIndex;
  var prevIndex = currIndex;
  var slideCount;
  var perMove;
  var perPage;
  function mount() {
    init2();
    on([EVENT_UPDATED, EVENT_REFRESH, EVENT_END_INDEX_CHANGED], init2);
    on(EVENT_RESIZED, onResized);
  }
  __name(mount, "mount");
  function init2() {
    slideCount = getLength(true);
    perMove = options.perMove;
    perPage = options.perPage;
    endIndex = getEnd();
    var index = clamp(currIndex, 0, omitEnd ? endIndex : slideCount - 1);
    if (index !== currIndex) {
      currIndex = index;
      Move2.reposition();
    }
  }
  __name(init2, "init");
  function onResized() {
    if (endIndex !== getEnd()) {
      emit(EVENT_END_INDEX_CHANGED);
    }
  }
  __name(onResized, "onResized");
  function go(control, allowSameIndex, callback) {
    if (!isBusy()) {
      var dest = parse(control);
      var index = loop(dest);
      if (index > -1 && (allowSameIndex || index !== currIndex)) {
        setIndex(index);
        Move2.move(dest, index, prevIndex, callback);
      }
    }
  }
  __name(go, "go");
  function scroll(destination, duration, snap, callback) {
    Components2.Scroll.scroll(destination, duration, snap, function() {
      var index = loop(Move2.toIndex(getPosition()));
      setIndex(omitEnd ? min(index, endIndex) : index);
      callback && callback();
    });
  }
  __name(scroll, "scroll");
  function parse(control) {
    var index = currIndex;
    if (isString(control)) {
      var _ref = control.match(/([+\-<>])(\d+)?/) || [], indicator = _ref[1], number = _ref[2];
      if (indicator === "+" || indicator === "-") {
        index = computeDestIndex(currIndex + +("" + indicator + (+number || 1)), currIndex);
      } else if (indicator === ">") {
        index = number ? toIndex(+number) : getNext(true);
      } else if (indicator === "<") {
        index = getPrev(true);
      }
    } else {
      index = isLoop ? control : clamp(control, 0, endIndex);
    }
    return index;
  }
  __name(parse, "parse");
  function getAdjacent(prev, destination) {
    var number = perMove || (hasFocus() ? 1 : perPage);
    var dest = computeDestIndex(currIndex + number * (prev ? -1 : 1), currIndex, !(perMove || hasFocus()));
    if (dest === -1 && isSlide) {
      if (!approximatelyEqual(getPosition(), getLimit(!prev), 1)) {
        return prev ? 0 : endIndex;
      }
    }
    return destination ? dest : loop(dest);
  }
  __name(getAdjacent, "getAdjacent");
  function computeDestIndex(dest, from, snapPage) {
    if (isEnough() || hasFocus()) {
      var index = computeMovableDestIndex(dest);
      if (index !== dest) {
        from = dest;
        dest = index;
        snapPage = false;
      }
      if (dest < 0 || dest > endIndex) {
        if (!perMove && (between(0, dest, from, true) || between(endIndex, from, dest, true))) {
          dest = toIndex(toPage(dest));
        } else {
          if (isLoop) {
            dest = snapPage ? dest < 0 ? -(slideCount % perPage || perPage) : slideCount : dest;
          } else if (options.rewind) {
            dest = dest < 0 ? endIndex : 0;
          } else {
            dest = -1;
          }
        }
      } else {
        if (snapPage && dest !== from) {
          dest = toIndex(toPage(from) + (dest < from ? -1 : 1));
        }
      }
    } else {
      dest = -1;
    }
    return dest;
  }
  __name(computeDestIndex, "computeDestIndex");
  function computeMovableDestIndex(dest) {
    if (isSlide && options.trimSpace === "move" && dest !== currIndex) {
      var position = getPosition();
      while (position === toPosition(dest, true) && between(dest, 0, Splide2.length - 1, !options.rewind)) {
        dest < currIndex ? --dest : ++dest;
      }
    }
    return dest;
  }
  __name(computeMovableDestIndex, "computeMovableDestIndex");
  function loop(index) {
    return isLoop ? (index + slideCount) % slideCount || 0 : index;
  }
  __name(loop, "loop");
  function getEnd() {
    var end = slideCount - (hasFocus() || isLoop && perMove ? 1 : perPage);
    while (omitEnd && end-- > 0) {
      if (toPosition(slideCount - 1, true) !== toPosition(end, true)) {
        end++;
        break;
      }
    }
    return clamp(end, 0, slideCount - 1);
  }
  __name(getEnd, "getEnd");
  function toIndex(page) {
    return clamp(hasFocus() ? page : perPage * page, 0, endIndex);
  }
  __name(toIndex, "toIndex");
  function toPage(index) {
    return hasFocus() ? min(index, endIndex) : floor((index >= endIndex ? slideCount - 1 : index) / perPage);
  }
  __name(toPage, "toPage");
  function toDest(destination) {
    var closest2 = Move2.toIndex(destination);
    return isSlide ? clamp(closest2, 0, endIndex) : closest2;
  }
  __name(toDest, "toDest");
  function setIndex(index) {
    if (index !== currIndex) {
      prevIndex = currIndex;
      currIndex = index;
    }
  }
  __name(setIndex, "setIndex");
  function getIndex(prev) {
    return prev ? prevIndex : currIndex;
  }
  __name(getIndex, "getIndex");
  function hasFocus() {
    return !isUndefined(options.focus) || options.isNavigation;
  }
  __name(hasFocus, "hasFocus");
  function isBusy() {
    return Splide2.state.is([MOVING, SCROLLING]) && !!options.waitForTransition;
  }
  __name(isBusy, "isBusy");
  return {
    mount,
    go,
    scroll,
    getNext,
    getPrev,
    getAdjacent,
    getEnd,
    setIndex,
    getIndex,
    toIndex,
    toPage,
    toDest,
    hasFocus,
    isBusy
  };
}
__name(Controller, "Controller");
var XML_NAME_SPACE = "http://www.w3.org/2000/svg";
var PATH = "m15.5 0.932-4.3 4.38 14.5 14.6-14.5 14.5 4.3 4.4 14.6-14.6 4.4-4.3-4.4-4.4-14.6-14.6z";
var SIZE = 40;
function Arrows(Splide2, Components2, options) {
  var event2 = EventInterface(Splide2);
  var on = event2.on, bind = event2.bind, emit = event2.emit;
  var classes = options.classes, i18n = options.i18n;
  var Elements2 = Components2.Elements, Controller2 = Components2.Controller;
  var placeholder = Elements2.arrows, track = Elements2.track;
  var wrapper = placeholder;
  var prev = Elements2.prev;
  var next3 = Elements2.next;
  var created;
  var wrapperClasses;
  var arrows = {};
  function mount() {
    init2();
    on(EVENT_UPDATED, remount);
  }
  __name(mount, "mount");
  function remount() {
    destroy();
    mount();
  }
  __name(remount, "remount");
  function init2() {
    var enabled = options.arrows;
    if (enabled && !(prev && next3)) {
      createArrows();
    }
    if (prev && next3) {
      assign(arrows, {
        prev,
        next: next3
      });
      display(wrapper, enabled ? "" : "none");
      addClass(wrapper, wrapperClasses = CLASS_ARROWS + "--" + options.direction);
      if (enabled) {
        listen();
        update();
        setAttribute([prev, next3], ARIA_CONTROLS, track.id);
        emit(EVENT_ARROWS_MOUNTED, prev, next3);
      }
    }
  }
  __name(init2, "init");
  function destroy() {
    event2.destroy();
    removeClass(wrapper, wrapperClasses);
    if (created) {
      remove(placeholder ? [prev, next3] : wrapper);
      prev = next3 = null;
    } else {
      removeAttribute([prev, next3], ALL_ATTRIBUTES);
    }
  }
  __name(destroy, "destroy");
  function listen() {
    on([EVENT_MOUNTED, EVENT_MOVED, EVENT_REFRESH, EVENT_SCROLLED, EVENT_END_INDEX_CHANGED], update);
    bind(next3, "click", apply(go, ">"));
    bind(prev, "click", apply(go, "<"));
  }
  __name(listen, "listen");
  function go(control) {
    Controller2.go(control, true);
  }
  __name(go, "go");
  function createArrows() {
    wrapper = placeholder || create("div", classes.arrows);
    prev = createArrow(true);
    next3 = createArrow(false);
    created = true;
    append(wrapper, [prev, next3]);
    !placeholder && before(wrapper, track);
  }
  __name(createArrows, "createArrows");
  function createArrow(prev2) {
    var arrow = '<button class="' + classes.arrow + " " + (prev2 ? classes.prev : classes.next) + '" type="button"><svg xmlns="' + XML_NAME_SPACE + '" viewBox="0 0 ' + SIZE + " " + SIZE + '" width="' + SIZE + '" height="' + SIZE + '" focusable="false"><path d="' + (options.arrowPath || PATH) + '" />';
    return parseHtml(arrow);
  }
  __name(createArrow, "createArrow");
  function update() {
    if (prev && next3) {
      var index = Splide2.index;
      var prevIndex = Controller2.getPrev();
      var nextIndex = Controller2.getNext();
      var prevLabel = prevIndex > -1 && index < prevIndex ? i18n.last : i18n.prev;
      var nextLabel = nextIndex > -1 && index > nextIndex ? i18n.first : i18n.next;
      prev.disabled = prevIndex < 0;
      next3.disabled = nextIndex < 0;
      setAttribute(prev, ARIA_LABEL, prevLabel);
      setAttribute(next3, ARIA_LABEL, nextLabel);
      emit(EVENT_ARROWS_UPDATED, prev, next3, prevIndex, nextIndex);
    }
  }
  __name(update, "update");
  return {
    arrows,
    mount,
    destroy,
    update
  };
}
__name(Arrows, "Arrows");
var INTERVAL_DATA_ATTRIBUTE = DATA_ATTRIBUTE + "-interval";
function Autoplay(Splide2, Components2, options) {
  var _EventInterface6 = EventInterface(Splide2), on = _EventInterface6.on, bind = _EventInterface6.bind, emit = _EventInterface6.emit;
  var interval = RequestInterval(options.interval, Splide2.go.bind(Splide2, ">"), onAnimationFrame);
  var isPaused = interval.isPaused;
  var Elements2 = Components2.Elements, _Components2$Elements4 = Components2.Elements, root = _Components2$Elements4.root, toggle2 = _Components2$Elements4.toggle;
  var autoplay = options.autoplay;
  var hovered;
  var focused;
  var stopped = autoplay === "pause";
  function mount() {
    if (autoplay) {
      listen();
      toggle2 && setAttribute(toggle2, ARIA_CONTROLS, Elements2.track.id);
      stopped || play();
      update();
    }
  }
  __name(mount, "mount");
  function listen() {
    if (options.pauseOnHover) {
      bind(root, "mouseenter mouseleave", function(e) {
        hovered = e.type === "mouseenter";
        autoToggle();
      });
    }
    if (options.pauseOnFocus) {
      bind(root, "focusin focusout", function(e) {
        focused = e.type === "focusin";
        autoToggle();
      });
    }
    if (toggle2) {
      bind(toggle2, "click", function() {
        stopped ? play() : pause(true);
      });
    }
    on([EVENT_MOVE, EVENT_SCROLL, EVENT_REFRESH], interval.rewind);
    on(EVENT_MOVE, onMove);
  }
  __name(listen, "listen");
  function play() {
    if (isPaused() && Components2.Slides.isEnough()) {
      interval.start(!options.resetProgress);
      focused = hovered = stopped = false;
      update();
      emit(EVENT_AUTOPLAY_PLAY);
    }
  }
  __name(play, "play");
  function pause(stop) {
    if (stop === void 0) {
      stop = true;
    }
    stopped = !!stop;
    update();
    if (!isPaused()) {
      interval.pause();
      emit(EVENT_AUTOPLAY_PAUSE);
    }
  }
  __name(pause, "pause");
  function autoToggle() {
    if (!stopped) {
      hovered || focused ? pause(false) : play();
    }
  }
  __name(autoToggle, "autoToggle");
  function update() {
    if (toggle2) {
      toggleClass(toggle2, CLASS_ACTIVE, !stopped);
      setAttribute(toggle2, ARIA_LABEL, options.i18n[stopped ? "play" : "pause"]);
    }
  }
  __name(update, "update");
  function onAnimationFrame(rate) {
    var bar = Elements2.bar;
    bar && style(bar, "width", rate * 100 + "%");
    emit(EVENT_AUTOPLAY_PLAYING, rate);
  }
  __name(onAnimationFrame, "onAnimationFrame");
  function onMove(index) {
    var Slide2 = Components2.Slides.getAt(index);
    interval.set(Slide2 && +getAttribute(Slide2.slide, INTERVAL_DATA_ATTRIBUTE) || options.interval);
  }
  __name(onMove, "onMove");
  return {
    mount,
    destroy: interval.cancel,
    play,
    pause,
    isPaused
  };
}
__name(Autoplay, "Autoplay");
function Cover(Splide2, Components2, options) {
  var _EventInterface7 = EventInterface(Splide2), on = _EventInterface7.on;
  function mount() {
    if (options.cover) {
      on(EVENT_LAZYLOAD_LOADED, apply(toggle2, true));
      on([EVENT_MOUNTED, EVENT_UPDATED, EVENT_REFRESH], apply(cover, true));
    }
  }
  __name(mount, "mount");
  function cover(cover2) {
    Components2.Slides.forEach(function(Slide2) {
      var img = child(Slide2.container || Slide2.slide, "img");
      if (img && img.src) {
        toggle2(cover2, img, Slide2);
      }
    });
  }
  __name(cover, "cover");
  function toggle2(cover2, img, Slide2) {
    Slide2.style("background", cover2 ? 'center/cover no-repeat url("' + img.src + '")' : "", true);
    display(img, cover2 ? "none" : "");
  }
  __name(toggle2, "toggle");
  return {
    mount,
    destroy: apply(cover, false)
  };
}
__name(Cover, "Cover");
var BOUNCE_DIFF_THRESHOLD = 10;
var BOUNCE_DURATION = 600;
var FRICTION_FACTOR = 0.6;
var BASE_VELOCITY = 1.5;
var MIN_DURATION = 800;
function Scroll(Splide2, Components2, options) {
  var _EventInterface8 = EventInterface(Splide2), on = _EventInterface8.on, emit = _EventInterface8.emit;
  var set = Splide2.state.set;
  var Move2 = Components2.Move;
  var getPosition = Move2.getPosition, getLimit = Move2.getLimit, exceededLimit = Move2.exceededLimit, translate = Move2.translate;
  var isSlide = Splide2.is(SLIDE);
  var interval;
  var callback;
  var friction = 1;
  function mount() {
    on(EVENT_MOVE, clear);
    on([EVENT_UPDATED, EVENT_REFRESH], cancel);
  }
  __name(mount, "mount");
  function scroll(destination, duration, snap, onScrolled, noConstrain) {
    var from = getPosition();
    clear();
    if (snap && (!isSlide || !exceededLimit())) {
      var size = Components2.Layout.sliderSize();
      var offset = sign(destination) * size * floor(abs(destination) / size) || 0;
      destination = Move2.toPosition(Components2.Controller.toDest(destination % size)) + offset;
    }
    var noDistance = approximatelyEqual(from, destination, 1);
    friction = 1;
    duration = noDistance ? 0 : duration || max(abs(destination - from) / BASE_VELOCITY, MIN_DURATION);
    callback = onScrolled;
    interval = RequestInterval(duration, onEnd, apply(update, from, destination, noConstrain), 1);
    set(SCROLLING);
    emit(EVENT_SCROLL);
    interval.start();
  }
  __name(scroll, "scroll");
  function onEnd() {
    set(IDLE);
    callback && callback();
    emit(EVENT_SCROLLED);
  }
  __name(onEnd, "onEnd");
  function update(from, to, noConstrain, rate) {
    var position = getPosition();
    var target = from + (to - from) * easing(rate);
    var diff = (target - position) * friction;
    translate(position + diff);
    if (isSlide && !noConstrain && exceededLimit()) {
      friction *= FRICTION_FACTOR;
      if (abs(diff) < BOUNCE_DIFF_THRESHOLD) {
        scroll(getLimit(exceededLimit(true)), BOUNCE_DURATION, false, callback, true);
      }
    }
  }
  __name(update, "update");
  function clear() {
    if (interval) {
      interval.cancel();
    }
  }
  __name(clear, "clear");
  function cancel() {
    if (interval && !interval.isPaused()) {
      clear();
      onEnd();
    }
  }
  __name(cancel, "cancel");
  function easing(t) {
    var easingFunc = options.easingFunc;
    return easingFunc ? easingFunc(t) : 1 - Math.pow(1 - t, 4);
  }
  __name(easing, "easing");
  return {
    mount,
    destroy: clear,
    scroll,
    cancel
  };
}
__name(Scroll, "Scroll");
var SCROLL_LISTENER_OPTIONS = {
  passive: false,
  capture: true
};
function Drag(Splide2, Components2, options) {
  var _EventInterface9 = EventInterface(Splide2), on = _EventInterface9.on, emit = _EventInterface9.emit, bind = _EventInterface9.bind, unbind = _EventInterface9.unbind;
  var state = Splide2.state;
  var Move2 = Components2.Move, Scroll2 = Components2.Scroll, Controller2 = Components2.Controller, track = Components2.Elements.track, reduce = Components2.Media.reduce;
  var _Components2$Directio2 = Components2.Direction, resolve = _Components2$Directio2.resolve, orient = _Components2$Directio2.orient;
  var getPosition = Move2.getPosition, exceededLimit = Move2.exceededLimit;
  var basePosition;
  var baseEvent;
  var prevBaseEvent;
  var isFree;
  var dragging;
  var exceeded = false;
  var clickPrevented;
  var disabled;
  var target;
  function mount() {
    bind(track, POINTER_MOVE_EVENTS, noop, SCROLL_LISTENER_OPTIONS);
    bind(track, POINTER_UP_EVENTS, noop, SCROLL_LISTENER_OPTIONS);
    bind(track, POINTER_DOWN_EVENTS, onPointerDown, SCROLL_LISTENER_OPTIONS);
    bind(track, "click", onClick, {
      capture: true
    });
    bind(track, "dragstart", prevent);
    on([EVENT_MOUNTED, EVENT_UPDATED], init2);
  }
  __name(mount, "mount");
  function init2() {
    var drag = options.drag;
    disable(!drag);
    isFree = drag === "free";
  }
  __name(init2, "init");
  function onPointerDown(e) {
    clickPrevented = false;
    if (!disabled) {
      var isTouch = isTouchEvent(e);
      if (isDraggable(e.target) && (isTouch || !e.button)) {
        if (!Controller2.isBusy()) {
          target = isTouch ? track : window;
          dragging = state.is([MOVING, SCROLLING]);
          prevBaseEvent = null;
          bind(target, POINTER_MOVE_EVENTS, onPointerMove, SCROLL_LISTENER_OPTIONS);
          bind(target, POINTER_UP_EVENTS, onPointerUp, SCROLL_LISTENER_OPTIONS);
          Move2.cancel();
          Scroll2.cancel();
          save(e);
        } else {
          prevent(e, true);
        }
      }
    }
  }
  __name(onPointerDown, "onPointerDown");
  function onPointerMove(e) {
    if (!state.is(DRAGGING)) {
      state.set(DRAGGING);
      emit(EVENT_DRAG);
    }
    if (e.cancelable) {
      if (dragging) {
        Move2.translate(basePosition + constrain(diffCoord(e)));
        var expired = diffTime(e) > LOG_INTERVAL;
        var hasExceeded = exceeded !== (exceeded = exceededLimit());
        if (expired || hasExceeded) {
          save(e);
        }
        clickPrevented = true;
        emit(EVENT_DRAGGING);
        prevent(e);
      } else if (isSliderDirection(e)) {
        dragging = shouldStart(e);
        prevent(e);
      }
    }
  }
  __name(onPointerMove, "onPointerMove");
  function onPointerUp(e) {
    if (state.is(DRAGGING)) {
      state.set(IDLE);
      emit(EVENT_DRAGGED);
    }
    if (dragging) {
      move(e);
      prevent(e);
    }
    unbind(target, POINTER_MOVE_EVENTS, onPointerMove);
    unbind(target, POINTER_UP_EVENTS, onPointerUp);
    dragging = false;
  }
  __name(onPointerUp, "onPointerUp");
  function onClick(e) {
    if (!disabled && clickPrevented) {
      prevent(e, true);
    }
  }
  __name(onClick, "onClick");
  function save(e) {
    prevBaseEvent = baseEvent;
    baseEvent = e;
    basePosition = getPosition();
  }
  __name(save, "save");
  function move(e) {
    var velocity = computeVelocity(e);
    var destination = computeDestination(velocity);
    var rewind = options.rewind && options.rewindByDrag;
    reduce(false);
    if (isFree) {
      Controller2.scroll(destination, 0, options.snap);
    } else if (Splide2.is(FADE)) {
      Controller2.go(orient(sign(velocity)) < 0 ? rewind ? "<" : "-" : rewind ? ">" : "+");
    } else if (Splide2.is(SLIDE) && exceeded && rewind) {
      Controller2.go(exceededLimit(true) ? ">" : "<");
    } else {
      Controller2.go(Controller2.toDest(destination), true);
    }
    reduce(true);
  }
  __name(move, "move");
  function shouldStart(e) {
    var thresholds = options.dragMinThreshold;
    var isObj = isObject(thresholds);
    var mouse = isObj && thresholds.mouse || 0;
    var touch = (isObj ? thresholds.touch : +thresholds) || 10;
    return abs(diffCoord(e)) > (isTouchEvent(e) ? touch : mouse);
  }
  __name(shouldStart, "shouldStart");
  function isSliderDirection(e) {
    return abs(diffCoord(e)) > abs(diffCoord(e, true));
  }
  __name(isSliderDirection, "isSliderDirection");
  function computeVelocity(e) {
    if (Splide2.is(LOOP) || !exceeded) {
      var time = diffTime(e);
      if (time && time < LOG_INTERVAL) {
        return diffCoord(e) / time;
      }
    }
    return 0;
  }
  __name(computeVelocity, "computeVelocity");
  function computeDestination(velocity) {
    return getPosition() + sign(velocity) * min(abs(velocity) * (options.flickPower || 600), isFree ? Infinity : Components2.Layout.listSize() * (options.flickMaxPages || 1));
  }
  __name(computeDestination, "computeDestination");
  function diffCoord(e, orthogonal) {
    return coordOf(e, orthogonal) - coordOf(getBaseEvent(e), orthogonal);
  }
  __name(diffCoord, "diffCoord");
  function diffTime(e) {
    return timeOf(e) - timeOf(getBaseEvent(e));
  }
  __name(diffTime, "diffTime");
  function getBaseEvent(e) {
    return baseEvent === e && prevBaseEvent || baseEvent;
  }
  __name(getBaseEvent, "getBaseEvent");
  function coordOf(e, orthogonal) {
    return (isTouchEvent(e) ? e.changedTouches[0] : e)["page" + resolve(orthogonal ? "Y" : "X")];
  }
  __name(coordOf, "coordOf");
  function constrain(diff) {
    return diff / (exceeded && Splide2.is(SLIDE) ? FRICTION : 1);
  }
  __name(constrain, "constrain");
  function isDraggable(target2) {
    var noDrag = options.noDrag;
    return !matches(target2, "." + CLASS_PAGINATION_PAGE + ", ." + CLASS_ARROW) && (!noDrag || !matches(target2, noDrag));
  }
  __name(isDraggable, "isDraggable");
  function isTouchEvent(e) {
    return typeof TouchEvent !== "undefined" && e instanceof TouchEvent;
  }
  __name(isTouchEvent, "isTouchEvent");
  function isDragging() {
    return dragging;
  }
  __name(isDragging, "isDragging");
  function disable(value) {
    disabled = value;
  }
  __name(disable, "disable");
  return {
    mount,
    disable,
    isDragging
  };
}
__name(Drag, "Drag");
var NORMALIZATION_MAP = {
  Spacebar: " ",
  Right: ARROW_RIGHT,
  Left: ARROW_LEFT,
  Up: ARROW_UP,
  Down: ARROW_DOWN
};
function normalizeKey(key) {
  key = isString(key) ? key : key.key;
  return NORMALIZATION_MAP[key] || key;
}
__name(normalizeKey, "normalizeKey");
var KEYBOARD_EVENT = "keydown";
function Keyboard(Splide2, Components2, options) {
  var _EventInterface10 = EventInterface(Splide2), on = _EventInterface10.on, bind = _EventInterface10.bind, unbind = _EventInterface10.unbind;
  var root = Splide2.root;
  var resolve = Components2.Direction.resolve;
  var target;
  var disabled;
  function mount() {
    init2();
    on(EVENT_UPDATED, destroy);
    on(EVENT_UPDATED, init2);
    on(EVENT_MOVE, onMove);
  }
  __name(mount, "mount");
  function init2() {
    var keyboard = options.keyboard;
    if (keyboard) {
      target = keyboard === "global" ? window : root;
      bind(target, KEYBOARD_EVENT, onKeydown);
    }
  }
  __name(init2, "init");
  function destroy() {
    unbind(target, KEYBOARD_EVENT);
  }
  __name(destroy, "destroy");
  function disable(value) {
    disabled = value;
  }
  __name(disable, "disable");
  function onMove() {
    var _disabled = disabled;
    disabled = true;
    nextTick(function() {
      disabled = _disabled;
    });
  }
  __name(onMove, "onMove");
  function onKeydown(e) {
    if (!disabled) {
      var key = normalizeKey(e);
      if (key === resolve(ARROW_LEFT)) {
        Splide2.go("<");
      } else if (key === resolve(ARROW_RIGHT)) {
        Splide2.go(">");
      }
    }
  }
  __name(onKeydown, "onKeydown");
  return {
    mount,
    destroy,
    disable
  };
}
__name(Keyboard, "Keyboard");
var SRC_DATA_ATTRIBUTE = DATA_ATTRIBUTE + "-lazy";
var SRCSET_DATA_ATTRIBUTE = SRC_DATA_ATTRIBUTE + "-srcset";
var IMAGE_SELECTOR = "[" + SRC_DATA_ATTRIBUTE + "], [" + SRCSET_DATA_ATTRIBUTE + "]";
function LazyLoad(Splide2, Components2, options) {
  var _EventInterface11 = EventInterface(Splide2), on = _EventInterface11.on, off = _EventInterface11.off, bind = _EventInterface11.bind, emit = _EventInterface11.emit;
  var isSequential = options.lazyLoad === "sequential";
  var events = [EVENT_MOVED, EVENT_SCROLLED];
  var entries = [];
  function mount() {
    if (options.lazyLoad) {
      init2();
      on(EVENT_REFRESH, init2);
    }
  }
  __name(mount, "mount");
  function init2() {
    empty(entries);
    register();
    if (isSequential) {
      loadNext();
    } else {
      off(events);
      on(events, check);
      check();
    }
  }
  __name(init2, "init");
  function register() {
    Components2.Slides.forEach(function(Slide2) {
      queryAll(Slide2.slide, IMAGE_SELECTOR).forEach(function(img) {
        var src = getAttribute(img, SRC_DATA_ATTRIBUTE);
        var srcset = getAttribute(img, SRCSET_DATA_ATTRIBUTE);
        if (src !== img.src || srcset !== img.srcset) {
          var className = options.classes.spinner;
          var parent = img.parentElement;
          var spinner = child(parent, "." + className) || create("span", className, parent);
          entries.push([img, Slide2, spinner]);
          img.src || display(img, "none");
        }
      });
    });
  }
  __name(register, "register");
  function check() {
    entries = entries.filter(function(data) {
      var distance = options.perPage * ((options.preloadPages || 1) + 1) - 1;
      return data[1].isWithin(Splide2.index, distance) ? load(data) : true;
    });
    entries.length || off(events);
  }
  __name(check, "check");
  function load(data) {
    var img = data[0];
    addClass(data[1].slide, CLASS_LOADING);
    bind(img, "load error", apply(onLoad, data));
    setAttribute(img, "src", getAttribute(img, SRC_DATA_ATTRIBUTE));
    setAttribute(img, "srcset", getAttribute(img, SRCSET_DATA_ATTRIBUTE));
    removeAttribute(img, SRC_DATA_ATTRIBUTE);
    removeAttribute(img, SRCSET_DATA_ATTRIBUTE);
  }
  __name(load, "load");
  function onLoad(data, e) {
    var img = data[0], Slide2 = data[1];
    removeClass(Slide2.slide, CLASS_LOADING);
    if (e.type !== "error") {
      remove(data[2]);
      display(img, "");
      emit(EVENT_LAZYLOAD_LOADED, img, Slide2);
      emit(EVENT_RESIZE);
    }
    isSequential && loadNext();
  }
  __name(onLoad, "onLoad");
  function loadNext() {
    entries.length && load(entries.shift());
  }
  __name(loadNext, "loadNext");
  return {
    mount,
    destroy: apply(empty, entries),
    check
  };
}
__name(LazyLoad, "LazyLoad");
function Pagination$1(Splide2, Components2, options) {
  var event2 = EventInterface(Splide2);
  var on = event2.on, emit = event2.emit, bind = event2.bind;
  var Slides2 = Components2.Slides, Elements2 = Components2.Elements, Controller2 = Components2.Controller;
  var hasFocus = Controller2.hasFocus, getIndex = Controller2.getIndex, go = Controller2.go;
  var resolve = Components2.Direction.resolve;
  var placeholder = Elements2.pagination;
  var items = [];
  var list;
  var paginationClasses;
  function mount() {
    destroy();
    on([EVENT_UPDATED, EVENT_REFRESH, EVENT_END_INDEX_CHANGED], mount);
    var enabled = options.pagination;
    placeholder && display(placeholder, enabled ? "" : "none");
    if (enabled) {
      on([EVENT_MOVE, EVENT_SCROLL, EVENT_SCROLLED], update);
      createPagination();
      update();
      emit(EVENT_PAGINATION_MOUNTED, {
        list,
        items
      }, getAt(Splide2.index));
    }
  }
  __name(mount, "mount");
  function destroy() {
    if (list) {
      remove(placeholder ? slice(list.children) : list);
      removeClass(list, paginationClasses);
      empty(items);
      list = null;
    }
    event2.destroy();
  }
  __name(destroy, "destroy");
  function createPagination() {
    var length = Splide2.length;
    var classes = options.classes, i18n = options.i18n, perPage = options.perPage;
    var max2 = hasFocus() ? Controller2.getEnd() + 1 : ceil(length / perPage);
    list = placeholder || create("ul", classes.pagination, Elements2.track.parentElement);
    addClass(list, paginationClasses = CLASS_PAGINATION + "--" + getDirection());
    setAttribute(list, ROLE, "tablist");
    setAttribute(list, ARIA_LABEL, i18n.select);
    setAttribute(list, ARIA_ORIENTATION, getDirection() === TTB ? "vertical" : "");
    for (var i = 0; i < max2; i++) {
      var li = create("li", null, list);
      var button = create("button", {
        class: classes.page,
        type: "button"
      }, li);
      var controls = Slides2.getIn(i).map(function(Slide2) {
        return Slide2.slide.id;
      });
      var text = !hasFocus() && perPage > 1 ? i18n.pageX : i18n.slideX;
      bind(button, "click", apply(onClick, i));
      if (options.paginationKeyboard) {
        bind(button, "keydown", apply(onKeydown, i));
      }
      setAttribute(li, ROLE, "presentation");
      setAttribute(button, ROLE, "tab");
      setAttribute(button, ARIA_CONTROLS, controls.join(" "));
      setAttribute(button, ARIA_LABEL, format(text, i + 1));
      setAttribute(button, TAB_INDEX, -1);
      items.push({
        li,
        button,
        page: i
      });
    }
  }
  __name(createPagination, "createPagination");
  function onClick(page) {
    go(">" + page, true);
  }
  __name(onClick, "onClick");
  function onKeydown(page, e) {
    var length = items.length;
    var key = normalizeKey(e);
    var dir = getDirection();
    var nextPage = -1;
    if (key === resolve(ARROW_RIGHT, false, dir)) {
      nextPage = ++page % length;
    } else if (key === resolve(ARROW_LEFT, false, dir)) {
      nextPage = (--page + length) % length;
    } else if (key === "Home") {
      nextPage = 0;
    } else if (key === "End") {
      nextPage = length - 1;
    }
    var item = items[nextPage];
    if (item) {
      focus(item.button);
      go(">" + nextPage);
      prevent(e, true);
    }
  }
  __name(onKeydown, "onKeydown");
  function getDirection() {
    return options.paginationDirection || options.direction;
  }
  __name(getDirection, "getDirection");
  function getAt(index) {
    return items[Controller2.toPage(index)];
  }
  __name(getAt, "getAt");
  function update() {
    var prev = getAt(getIndex(true));
    var curr = getAt(getIndex());
    if (prev) {
      var button = prev.button;
      removeClass(button, CLASS_ACTIVE);
      removeAttribute(button, ARIA_SELECTED);
      setAttribute(button, TAB_INDEX, -1);
    }
    if (curr) {
      var _button = curr.button;
      addClass(_button, CLASS_ACTIVE);
      setAttribute(_button, ARIA_SELECTED, true);
      setAttribute(_button, TAB_INDEX, "");
    }
    emit(EVENT_PAGINATION_UPDATED, {
      list,
      items
    }, prev, curr);
  }
  __name(update, "update");
  return {
    items,
    mount,
    destroy,
    getAt,
    update
  };
}
__name(Pagination$1, "Pagination$1");
var TRIGGER_KEYS = [" ", "Enter"];
function Sync(Splide2, Components2, options) {
  var isNavigation = options.isNavigation, slideFocus = options.slideFocus;
  var events = [];
  function mount() {
    Splide2.splides.forEach(function(target) {
      if (!target.isParent) {
        sync(Splide2, target.splide);
        sync(target.splide, Splide2);
      }
    });
    if (isNavigation) {
      navigate();
    }
  }
  __name(mount, "mount");
  function destroy() {
    events.forEach(function(event2) {
      event2.destroy();
    });
    empty(events);
  }
  __name(destroy, "destroy");
  function remount() {
    destroy();
    mount();
  }
  __name(remount, "remount");
  function sync(splide, target) {
    var event2 = EventInterface(splide);
    event2.on(EVENT_MOVE, function(index, prev, dest) {
      target.go(target.is(LOOP) ? dest : index);
    });
    events.push(event2);
  }
  __name(sync, "sync");
  function navigate() {
    var event2 = EventInterface(Splide2);
    var on = event2.on;
    on(EVENT_CLICK, onClick);
    on(EVENT_SLIDE_KEYDOWN, onKeydown);
    on([EVENT_MOUNTED, EVENT_UPDATED], update);
    events.push(event2);
    event2.emit(EVENT_NAVIGATION_MOUNTED, Splide2.splides);
  }
  __name(navigate, "navigate");
  function update() {
    setAttribute(Components2.Elements.list, ARIA_ORIENTATION, options.direction === TTB ? "vertical" : "");
  }
  __name(update, "update");
  function onClick(Slide2) {
    Splide2.go(Slide2.index);
  }
  __name(onClick, "onClick");
  function onKeydown(Slide2, e) {
    if (includes(TRIGGER_KEYS, normalizeKey(e))) {
      onClick(Slide2);
      prevent(e);
    }
  }
  __name(onKeydown, "onKeydown");
  return {
    setup: apply(Components2.Media.set, {
      slideFocus: isUndefined(slideFocus) ? isNavigation : slideFocus
    }, true),
    mount,
    destroy,
    remount
  };
}
__name(Sync, "Sync");
function Wheel(Splide2, Components2, options) {
  var _EventInterface12 = EventInterface(Splide2), bind = _EventInterface12.bind;
  var lastTime = 0;
  function mount() {
    if (options.wheel) {
      bind(Components2.Elements.track, "wheel", onWheel, SCROLL_LISTENER_OPTIONS);
    }
  }
  __name(mount, "mount");
  function onWheel(e) {
    if (e.cancelable) {
      var deltaY = e.deltaY;
      var backwards = deltaY < 0;
      var timeStamp = timeOf(e);
      var _min = options.wheelMinThreshold || 0;
      var sleep = options.wheelSleep || 0;
      if (abs(deltaY) > _min && timeStamp - lastTime > sleep) {
        Splide2.go(backwards ? "<" : ">");
        lastTime = timeStamp;
      }
      shouldPrevent(backwards) && prevent(e);
    }
  }
  __name(onWheel, "onWheel");
  function shouldPrevent(backwards) {
    return !options.releaseWheel || Splide2.state.is(MOVING) || Components2.Controller.getAdjacent(backwards) !== -1;
  }
  __name(shouldPrevent, "shouldPrevent");
  return {
    mount
  };
}
__name(Wheel, "Wheel");
var SR_REMOVAL_DELAY = 90;
function Live(Splide2, Components2, options) {
  var _EventInterface13 = EventInterface(Splide2), on = _EventInterface13.on;
  var track = Components2.Elements.track;
  var enabled = options.live && !options.isNavigation;
  var sr = create("span", CLASS_SR);
  var interval = RequestInterval(SR_REMOVAL_DELAY, apply(toggle2, false));
  function mount() {
    if (enabled) {
      disable(!Components2.Autoplay.isPaused());
      setAttribute(track, ARIA_ATOMIC, true);
      sr.textContent = "…";
      on(EVENT_AUTOPLAY_PLAY, apply(disable, true));
      on(EVENT_AUTOPLAY_PAUSE, apply(disable, false));
      on([EVENT_MOVED, EVENT_SCROLLED], apply(toggle2, true));
    }
  }
  __name(mount, "mount");
  function toggle2(active) {
    setAttribute(track, ARIA_BUSY, active);
    if (active) {
      append(track, sr);
      interval.start();
    } else {
      remove(sr);
      interval.cancel();
    }
  }
  __name(toggle2, "toggle");
  function destroy() {
    removeAttribute(track, [ARIA_LIVE, ARIA_ATOMIC, ARIA_BUSY]);
    remove(sr);
  }
  __name(destroy, "destroy");
  function disable(disabled) {
    if (enabled) {
      setAttribute(track, ARIA_LIVE, disabled ? "off" : "polite");
    }
  }
  __name(disable, "disable");
  return {
    mount,
    disable,
    destroy
  };
}
__name(Live, "Live");
var ComponentConstructors = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  Media,
  Direction,
  Elements,
  Slides,
  Layout,
  Clones,
  Move,
  Controller,
  Arrows,
  Autoplay,
  Cover,
  Scroll,
  Drag,
  Keyboard,
  LazyLoad,
  Pagination: Pagination$1,
  Sync,
  Wheel,
  Live
});
var I18N = {
  prev: "Previous slide",
  next: "Next slide",
  first: "Go to first slide",
  last: "Go to last slide",
  slideX: "Go to slide %s",
  pageX: "Go to page %s",
  play: "Start autoplay",
  pause: "Pause autoplay",
  carousel: "carousel",
  slide: "slide",
  select: "Select a slide to show",
  slideLabel: "%s of %s"
};
var DEFAULTS = {
  type: "slide",
  role: "region",
  speed: 400,
  perPage: 1,
  cloneStatus: true,
  arrows: true,
  pagination: true,
  paginationKeyboard: true,
  interval: 5e3,
  pauseOnHover: true,
  pauseOnFocus: true,
  resetProgress: true,
  easing: "cubic-bezier(0.25, 1, 0.5, 1)",
  drag: true,
  direction: "ltr",
  trimSpace: true,
  focusableNodes: "a, button, textarea, input, select, iframe",
  live: true,
  classes: CLASSES,
  i18n: I18N,
  reducedMotion: {
    speed: 0,
    rewindSpeed: 0,
    autoplay: "pause"
  }
};
function Fade(Splide2, Components2, options) {
  var Slides2 = Components2.Slides;
  function mount() {
    EventInterface(Splide2).on([EVENT_MOUNTED, EVENT_REFRESH], init2);
  }
  __name(mount, "mount");
  function init2() {
    Slides2.forEach(function(Slide2) {
      Slide2.style("transform", "translateX(-" + 100 * Slide2.index + "%)");
    });
  }
  __name(init2, "init");
  function start(index, done) {
    Slides2.style("transition", "opacity " + options.speed + "ms " + options.easing);
    nextTick(done);
  }
  __name(start, "start");
  return {
    mount,
    start,
    cancel: noop
  };
}
__name(Fade, "Fade");
function Slide(Splide2, Components2, options) {
  var Move2 = Components2.Move, Controller2 = Components2.Controller, Scroll2 = Components2.Scroll;
  var list = Components2.Elements.list;
  var transition = apply(style, list, "transition");
  var endCallback;
  function mount() {
    EventInterface(Splide2).bind(list, "transitionend", function(e) {
      if (e.target === list && endCallback) {
        cancel();
        endCallback();
      }
    });
  }
  __name(mount, "mount");
  function start(index, done) {
    var destination = Move2.toPosition(index, true);
    var position = Move2.getPosition();
    var speed = getSpeed(index);
    if (abs(destination - position) >= 1 && speed >= 1) {
      if (options.useScroll) {
        Scroll2.scroll(destination, speed, false, done);
      } else {
        transition("transform " + speed + "ms " + options.easing);
        Move2.translate(destination, true);
        endCallback = done;
      }
    } else {
      Move2.jump(index);
      done();
    }
  }
  __name(start, "start");
  function cancel() {
    transition("");
    Scroll2.cancel();
  }
  __name(cancel, "cancel");
  function getSpeed(index) {
    var rewindSpeed = options.rewindSpeed;
    if (Splide2.is(SLIDE) && rewindSpeed) {
      var prev = Controller2.getIndex(true);
      var end = Controller2.getEnd();
      if (prev === 0 && index >= end || prev >= end && index === 0) {
        return rewindSpeed;
      }
    }
    return options.speed;
  }
  __name(getSpeed, "getSpeed");
  return {
    mount,
    start,
    cancel
  };
}
__name(Slide, "Slide");
var _Splide = /* @__PURE__ */ (function() {
  function _Splide2(target, options) {
    this.event = EventInterface();
    this.Components = {};
    this.state = State(CREATED);
    this.splides = [];
    this._o = {};
    this._E = {};
    var root = isString(target) ? query(document, target) : target;
    assert(root, root + " is invalid.");
    this.root = root;
    options = merge({
      label: getAttribute(root, ARIA_LABEL) || "",
      labelledby: getAttribute(root, ARIA_LABELLEDBY) || ""
    }, DEFAULTS, _Splide2.defaults, options || {});
    try {
      merge(options, JSON.parse(getAttribute(root, DATA_ATTRIBUTE)));
    } catch (e) {
      assert(false, "Invalid JSON");
    }
    this._o = Object.create(merge({}, options));
  }
  __name(_Splide2, "_Splide");
  var _proto = _Splide2.prototype;
  _proto.mount = /* @__PURE__ */ __name(function mount(Extensions, Transition) {
    var _this = this;
    var state = this.state, Components2 = this.Components;
    assert(state.is([CREATED, DESTROYED]), "Already mounted!");
    state.set(CREATED);
    this._C = Components2;
    this._T = Transition || this._T || (this.is(FADE) ? Fade : Slide);
    this._E = Extensions || this._E;
    var Constructors = assign({}, ComponentConstructors, this._E, {
      Transition: this._T
    });
    forOwn(Constructors, function(Component, key) {
      var component = Component(_this, Components2, _this._o);
      Components2[key] = component;
      component.setup && component.setup();
    });
    forOwn(Components2, function(component) {
      component.mount && component.mount();
    });
    this.emit(EVENT_MOUNTED);
    addClass(this.root, CLASS_INITIALIZED);
    state.set(IDLE);
    this.emit(EVENT_READY);
    return this;
  }, "mount");
  _proto.sync = /* @__PURE__ */ __name(function sync(splide) {
    this.splides.push({
      splide
    });
    splide.splides.push({
      splide: this,
      isParent: true
    });
    if (this.state.is(IDLE)) {
      this._C.Sync.remount();
      splide.Components.Sync.remount();
    }
    return this;
  }, "sync");
  _proto.go = /* @__PURE__ */ __name(function go(control) {
    this._C.Controller.go(control);
    return this;
  }, "go");
  _proto.on = /* @__PURE__ */ __name(function on(events, callback) {
    this.event.on(events, callback);
    return this;
  }, "on");
  _proto.off = /* @__PURE__ */ __name(function off(events) {
    this.event.off(events);
    return this;
  }, "off");
  _proto.emit = /* @__PURE__ */ __name(function emit(event2) {
    var _this$event;
    (_this$event = this.event).emit.apply(_this$event, [event2].concat(slice(arguments, 1)));
    return this;
  }, "emit");
  _proto.add = /* @__PURE__ */ __name(function add(slides, index) {
    this._C.Slides.add(slides, index);
    return this;
  }, "add");
  _proto.remove = /* @__PURE__ */ __name(function remove2(matcher) {
    this._C.Slides.remove(matcher);
    return this;
  }, "remove");
  _proto.is = /* @__PURE__ */ __name(function is(type2) {
    return this._o.type === type2;
  }, "is");
  _proto.refresh = /* @__PURE__ */ __name(function refresh() {
    this.emit(EVENT_REFRESH);
    return this;
  }, "refresh");
  _proto.destroy = /* @__PURE__ */ __name(function destroy(completely) {
    if (completely === void 0) {
      completely = true;
    }
    var event2 = this.event, state = this.state;
    if (state.is(CREATED)) {
      EventInterface(this).on(EVENT_READY, this.destroy.bind(this, completely));
    } else {
      forOwn(this._C, function(component) {
        component.destroy && component.destroy(completely);
      }, true);
      event2.emit(EVENT_DESTROY);
      event2.destroy();
      completely && empty(this.splides);
      state.set(DESTROYED);
    }
    return this;
  }, "destroy");
  _createClass(_Splide2, [{
    key: "options",
    get: /* @__PURE__ */ __name(function get() {
      return this._o;
    }, "get"),
    set: /* @__PURE__ */ __name(function set(options) {
      this._C.Media.set(options, true, true);
    }, "set")
  }, {
    key: "length",
    get: /* @__PURE__ */ __name(function get() {
      return this._C.Slides.getLength(true);
    }, "get")
  }, {
    key: "index",
    get: /* @__PURE__ */ __name(function get() {
      return this._C.Controller.getIndex();
    }, "get")
  }]);
  return _Splide2;
})();
var Splide = _Splide;
Splide.defaults = {};
Splide.STATES = STATES;
const _VideoControls = class _VideoControls {
  constructor(videoElement) {
    this.PLAYER = videoElement;
    this.videoInteractions();
  }
  videoInteractions() {
    const btn = this.PLAYER.querySelector("[js-video-control]");
    if (btn) {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (this.getVideoState() === "playing" || !this.getVideoState()) {
          this.pauseVideo();
        } else {
          this.playVideo();
        }
      });
    }
  }
  getVideoState() {
    return this.PLAYER.getAttribute("js-video-control");
  }
  pauseVideo() {
    this.PLAYER.setAttribute("js-video-control", "paused");
    this.PLAYER.querySelector("video").pause();
  }
  playVideo() {
    this.PLAYER.setAttribute("js-video-control", "playing");
    this.PLAYER.querySelector("video").play();
  }
};
__name(_VideoControls, "VideoControls");
let VideoControls = _VideoControls;
const SLIDER_ITEM = "c-slider__item";
const AUTOSLIDE = "data-js-slider__autoslide";
const PAUSE_TOGGLE = "c-slider__autoslide-toggle";
const IS_PAUSED = "c-slider--is-paused";
const _Slider = class _Slider {
  sliderElement;
  autoslideToggleButton;
  splide;
  sliderAttributes;
  constructor(slider) {
    this.sliderElement = slider;
    this.autoslideToggleButton = this.sliderElement.querySelector(`.${PAUSE_TOGGLE}`);
    const autoPlay = parseInt(slider.getAttribute(AUTOSLIDE) ?? "0");
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const ariaLabels = slider.hasAttribute("data-aria-labels") && slider.getAttribute("data-aria-labels") ? JSON.parse(slider.getAttribute("data-aria-labels")) : false;
    this.sliderAttributes = this.getAttributes();
    const buttonContainer = document.querySelector(`#${slider.getAttribute("data-js-slider-buttons")}`);
    if (buttonContainer) {
      this.setupClickNavigation(buttonContainer);
    } else {
      console.warn("No button container found for slider: " + slider);
    }
    this.splide = new Splide(slider, {
      type: this.sliderAttributes.sliderType,
      start: 0,
      autoWidth: this.sliderAttributes.perPage == 1 ? true : false,
      perPage: this.sliderAttributes.perPage,
      perMove: this.sliderAttributes.perMove,
      focus: slider.hasAttribute("data-slider-focus-center") ? "center" : 0,
      gap: this.sliderAttributes.gap,
      padding: this.sliderAttributes.padding,
      autoplay: Boolean(autoPlay) && (!mediaQuery || !mediaQuery.matches),
      interval: Boolean(autoPlay) ? autoPlay * 1e3 : 5e3,
      pagination: slider.classList.contains("c-slider--has-stepper"),
      pauseOnHover: true,
      pauseOnFocus: true,
      lazyLoad: "nearby",
      slideFocus: false,
      classes: {
        arrows: "c-slider__arrows",
        pagination: "c-slider__steppers",
        page: "c-slider__dot"
      },
      arrows: false,
      i18n: {
        prev: ariaLabels ? ariaLabels.prev : "Previous slider item",
        next: ariaLabels ? ariaLabels.next : "Next slider item",
        first: ariaLabels ? ariaLabels.first : "First slider item",
        last: ariaLabels ? ariaLabels.last : "Last slider item",
        slideX: ariaLabels ? ariaLabels.slideX : "Go to slide %s"
      },
      breakpoints: {
        896: {
          perPage: 1,
          perMove: 1,
          padding: 0
        }
      }
    });
    this.changeNavigationButtonsToSpans();
    this.splide.on("mounted", () => {
      this.lazyloadVideo();
    });
    if (this.sliderElement.querySelectorAll(`.${SLIDER_ITEM}`).length > 1) {
      this.splide.mount();
    } else {
      this.sliderElement.querySelector(".c-slider__arrows")?.remove();
    }
    if (this.sliderElement.classList.contains(IS_PAUSED)) {
      this.splide.Components.Autoplay.pause();
    }
    if (this.autoslideToggleButton) {
      this.autoslideToggleButton.addEventListener("click", this.autoslideToggle.bind(this));
    }
    slider.hasAttribute("data-observe-resizes") && this.observe(slider);
    this.addVideoControls();
  }
  observe(slider) {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === "class") {
          if (!slider.classList.contains("c-slider--size-md") && this.splide.options.perPage !== 1) {
            this.splide.options.perPage = 1;
            this.splide.options.perMove = 1;
            handleObserver();
          }
          if (slider.classList.contains("c-slider--size-lg") && !(this.splide.options.perPage === 2 || this.splide.options.perPage === 3)) {
            this.splide.options.perPage = this.sliderAttributes.perPage;
            this.splide.options.perMove = this.sliderAttributes.perMove;
            handleObserver();
          }
        }
      });
    });
    const handleObserver = /* @__PURE__ */ __name(() => {
      observer.disconnect();
      this.splide.refresh();
      observer.observe(slider, { subtree: false, attributes: true, attributeFilter: ["class"] });
    }, "handleObserver");
    observer.observe(slider, { subtree: false, attributes: true, attributeFilter: ["class"] });
  }
  getAttributes() {
    let padding = parseInt(this.sliderElement.getAttribute("data-slider-padding") || "0", 10);
    const gap = parseInt(this.sliderElement.getAttribute("data-slider-gap") || "2", 10);
    const slidesPerPage = parseInt(this.sliderElement.getAttribute("data-slides-per-page") || "1", 10);
    const slidesPerMove = parseInt(this.sliderElement.getAttribute("data-slides-per-move") || "1", 10);
    const sliderType = this.sliderElement.hasAttribute("data-slider-loop") ? "loop" : "slide";
    return { gap: gap * 8, padding: padding * 8, perPage: slidesPerPage, perMove: slidesPerMove, sliderType };
  }
  changeNavigationButtonsToSpans() {
    this.splide.on("pagination:mounted", (data) => {
      data.items.forEach((item, index) => {
        const span = document.createElement("span");
        span.className = item.button.className;
        span.classList.add("c-slider__dot");
        span.textContent = item.button.textContent;
        item.button.replaceWith(span);
        item.button = span;
      });
    });
  }
  setupClickNavigation(buttonContainer) {
    buttonContainer.querySelector("[data-js-slider-prev]")?.addEventListener("click", () => {
      this.splide.go("<");
    });
    buttonContainer.querySelector("[data-js-slider-next]")?.addEventListener("click", () => {
      this.splide.go(">");
    });
  }
  /**
   * Lazyloads videos within the slider by setting their source attributes and loading them.
   * 
   * @returns void
   */
  lazyloadVideo() {
    const originalSlides = this.splide.Components.Slides.get(true);
    if (!originalSlides || originalSlides.length === 0) {
      return;
    }
    originalSlides.forEach((slideComponent) => {
      const videoAttribute = slideComponent.slide.getAttribute("data-js-slider-video");
      if (!videoAttribute) {
        return;
      }
      const video = slideComponent.slide.querySelector("video");
      const source = video?.querySelector("source");
      source?.setAttribute("src", videoAttribute);
      video?.load();
    });
  }
  autoslideToggle() {
    const { Autoplay: Autoplay2 } = this.splide.Components;
    const videos = this.sliderElement.querySelectorAll("video");
    if (this.sliderElement.classList.contains(IS_PAUSED)) {
      if (videos && videos.length > 0) {
        videos.forEach((video) => {
          video.play();
        });
      }
      Autoplay2.play();
      this.sliderElement.classList.remove(IS_PAUSED);
    } else {
      if (videos && videos.length > 0) {
        videos.forEach((video) => {
          video.pause();
        });
      }
      Autoplay2.pause();
      this.sliderElement.classList.add(IS_PAUSED);
    }
  }
  addVideoControls() {
    this.sliderElement.querySelectorAll(`.${SLIDER_ITEM}`).forEach((slide) => {
      if (slide.querySelectorAll("video").length > 0) {
        new VideoControls(slide);
      }
    });
  }
};
__name(_Slider, "Slider");
let Slider = _Slider;
function initializeSlider() {
  const sliders = document.querySelectorAll(".c-slider");
  if (sliders) {
    sliders.forEach((slider) => {
      new Slider(slider);
    });
  }
}
__name(initializeSlider, "initializeSlider");
const _Image = class _Image {
  constructor() {
    this.image = null;
    this.container = null;
    this.imgAttr = null;
    this.imgCss = null;
  }
  /**
   * Init
   * @return void
   */
  initImage(imageData) {
    this.container = imageData.elementContainer;
    this.imgAttr = imageData.attrList;
    this.imgCss = imageData.classList;
    this.image = document.createElement("img");
    this.appendImage();
  }
  /**
   * Setting Image Attributes
   * @return void
   */
  setAttr() {
    if (this.imgAttr.src) {
      for (let [key, value] of Object.entries(this.imgAttr)) {
        this.image.setAttribute(`${key}`, value);
      }
    }
  }
  /**
   * Adding CSS classes
   * @return void
   */
  setCSSClasses() {
    if (this.imgCss.length > 0) {
      for (const cssClass of this.imgCss) {
        this.image.classList.add(cssClass);
      }
    }
  }
  /**
   * Append image to container
   * @param img
   */
  appendImage() {
    this.setAttr();
    this.container.appendChild(this.image);
    this.setCSSClasses();
  }
};
__name(_Image, "Image");
let Image = _Image;
const _Gallery = class _Gallery {
  /**
   * @param {string|null} modalId
   */
  constructor(modalId = null) {
    this.imageDataSet = [];
    this.imageData = null;
    this.modalImg = "";
    this.modalId = modalId;
    this.container = null;
    this.isEnabled = false;
    this.imageTransitionTimeoutId = null;
    this.imageTransitionAnimationFrameId = null;
    this.imageTransitionId = 0;
    this.Image = new Image();
    this.handleContainerClickBound = (event2) => this.handleContainerClick(event2);
    this.handleKeyboardNavigationBound = (event2) => this.handleKeyboardNavigation(event2);
  }
  /**
   * Init Modal Image in Gallery
   * @param modalId
   * @param modalImage
   */
  initImage(modalId, modalImage) {
    this.modalId = modalId;
    this.modalImg = modalImage;
    this.enableGallery(modalId);
    if (!this.container) {
      return;
    }
    this.imageDataSet = this.collectImageDataSet(this.modalId);
    this.imageData = this.getImageDataByUrl(this.modalImg) || this.imageDataSet[0] || null;
    if (!this.imageData) {
      return;
    }
    this.createImg(this.container, this.imageData);
  }
  /**
   * Collect all image metadata connected to a specific modal id.
   * @param {string} modalId
   * @returns {Array<{image: string, imageStep: string, imageCaption: string}>}
   */
  collectImageDataSet(modalId) {
    const imageDataSet = [];
    const imageTriggers = document.querySelectorAll(`[data-open="${modalId}"][data-large-img]`);
    for (const trigger of imageTriggers) {
      const image = trigger.getAttribute("data-large-img");
      const imageStep = trigger.getAttribute("data-stepping") || String(imageDataSet.length);
      const imageCaption = trigger.getAttribute("data-caption") || "";
      if (image) {
        imageDataSet.push({
          image,
          imageStep,
          imageCaption
        });
      }
    }
    return imageDataSet;
  }
  /**
   * Get image metadata by full image url.
   * @param {string} imageUrl
   * @returns {{image: string, imageStep: string, imageCaption: string}|null}
   */
  getImageDataByUrl(imageUrl) {
    for (const imageData of this.imageDataSet) {
      if (imageData.image === imageUrl) {
        return imageData;
      }
    }
    return null;
  }
  /**
   * Enable Gallery
   * Next, Previous image by click or keys
   */
  enableGallery(modalId = this.modalId) {
    if (modalId) {
      this.modalId = modalId;
    }
    if (!this.modalId) {
      return;
    }
    this.container = document.getElementById(this.modalId);
    if (!this.container) {
      return;
    }
    if (!this.isEnabled) {
      this.container.addEventListener("click", this.handleContainerClickBound);
      document.addEventListener("keyup", this.handleKeyboardNavigationBound);
      this.isEnabled = true;
    }
  }
  /**
   * Next & previous Image
   * @param string nav
   * @returns {*}
   */
  cycleImage(nav = "prev") {
    if (!this.container || !this.imageData || this.imageDataSet.length === 0) {
      return null;
    }
    const currentIndex = this.getCurrentImageIndex();
    const nextIndex = nav === "next" ? (currentIndex + 1) % this.imageDataSet.length : (currentIndex - 1 + this.imageDataSet.length) % this.imageDataSet.length;
    const nextImageData = this.imageDataSet[nextIndex];
    this.createImg(this.container, nextImageData);
    return nextImageData;
  }
  /**
   * Create Image in modal
   * @param containerId
   * @param imgSrc
   */
  createImg(containerId, imgSrc) {
    const container = containerId?.querySelector(".c-image");
    const containerModalContent = container;
    this.imageData = imgSrc;
    if (!container || !containerModalContent || !imgSrc) {
      return;
    }
    const imageElement = container.querySelector(".c-image__image");
    if (!imageElement) {
      container.innerHTML = "";
      container.classList.remove("c-image--is-placeholder");
      this.Image.initImage({
        "elementContainer": container,
        "attrList": {
          "src": imgSrc.image,
          "data-step": imgSrc.imageStep,
          "data-caption": imgSrc.imageCaption
        },
        "classList": ["c-image__image", "c-image__image--is-visible"]
      });
    } else {
      this.transitionImage(imageElement, imgSrc, () => {
        this.imageCaption(containerModalContent, imgSrc);
        this.updateImageCounter(this.container);
      });
      return;
    }
    this.imageCaption(containerModalContent, imgSrc);
    this.updateImageCounter(this.container);
  }
  /**
   * Animate image replacement with fade-out and fade-in.
   * @param {HTMLImageElement} imageElement
   * @param {{image: string, imageStep: string, imageCaption: string}} imgSrc
   * @param {Function|null} onImageChanged
   */
  transitionImage(imageElement, imgSrc, onImageChanged = null) {
    if (!(imageElement instanceof HTMLImageElement)) {
      return;
    }
    this.imageTransitionId += 1;
    const currentTransitionId = this.imageTransitionId;
    if (this.imageTransitionTimeoutId) {
      window.clearTimeout(this.imageTransitionTimeoutId);
      this.imageTransitionTimeoutId = null;
    }
    if (this.imageTransitionAnimationFrameId) {
      window.cancelAnimationFrame(this.imageTransitionAnimationFrameId);
      this.imageTransitionAnimationFrameId = null;
    }
    const transitionDuration = this.getImageTransitionDuration();
    imageElement.classList.add("c-image__image--is-transitioning");
    imageElement.classList.remove("c-image__image--is-visible");
    this.imageTransitionTimeoutId = window.setTimeout(() => {
      if (currentTransitionId !== this.imageTransitionId) {
        return;
      }
      const preloadImage = new window.Image();
      const applyImage = /* @__PURE__ */ __name(() => {
        if (currentTransitionId !== this.imageTransitionId) {
          return;
        }
        imageElement.src = imgSrc.image;
        imageElement.setAttribute("data-step", imgSrc.imageStep);
        imageElement.setAttribute("data-caption", imgSrc.imageCaption || "");
        if (typeof onImageChanged === "function") {
          onImageChanged();
        }
        const revealImage = /* @__PURE__ */ __name(() => {
          this.imageTransitionAnimationFrameId = window.requestAnimationFrame(() => {
            if (currentTransitionId !== this.imageTransitionId) {
              return;
            }
            imageElement.classList.add("c-image__image--is-visible");
          });
          this.imageTransitionTimeoutId = window.setTimeout(() => {
            if (currentTransitionId !== this.imageTransitionId) {
              return;
            }
            imageElement.classList.remove("c-image__image--is-transitioning");
            this.imageTransitionTimeoutId = null;
          }, transitionDuration);
        }, "revealImage");
        if (typeof imageElement.decode === "function") {
          imageElement.decode().catch(() => void 0).finally(() => {
            if (currentTransitionId !== this.imageTransitionId) {
              return;
            }
            revealImage();
          });
          return;
        }
        revealImage();
      }, "applyImage");
      preloadImage.addEventListener("load", applyImage, { once: true });
      preloadImage.addEventListener("error", applyImage, { once: true });
      preloadImage.src = imgSrc.image;
    }, transitionDuration);
  }
  /**
   * Image transition duration in milliseconds.
   * @returns {number}
   */
  getImageTransitionDuration() {
    return 180;
  }
  /**
   * Setting image caption
   * @param containerModalContent
   * @param imgSrc
   */
  imageCaption(containerModalContent, imgSrc) {
    const existingCaption = containerModalContent.querySelector(".c-image__caption");
    if (existingCaption !== null) {
      existingCaption.remove();
    }
    if (imgSrc.imageCaption) {
      containerModalContent.insertAdjacentHTML(
        "beforeend",
        '<figcaption class="c-image__caption">' + imgSrc.imageCaption + "</figcaption>"
      );
    }
  }
  /**
   * Update gallery counter (current / total).
   * @param {HTMLElement} container
   */
  updateImageCounter(container) {
    if (!container) {
      return;
    }
    const counterContainer = this.getOrCreateCounterContainer(container);
    if (!counterContainer || !this.imageDataSet.length) {
      return;
    }
    const currentIndex = this.getCurrentImageIndex() + 1;
    const totalImages = this.imageDataSet.length;
    counterContainer.setAttribute("aria-live", "polite");
    counterContainer.textContent = `${currentIndex}/${totalImages}`;
  }
  /**
   * Find existing counter container or create one in modal content.
   * @param {HTMLElement} container
   * @returns {HTMLElement|null}
   */
  getOrCreateCounterContainer(container) {
    const existingCounterContainer = container.querySelector(".c-modal__counter");
    if (existingCounterContainer) {
      return existingCounterContainer;
    }
    const modalContent = container.querySelector(".c-modal__content");
    if (!modalContent) {
      return null;
    }
    const counterContainer = document.createElement("div");
    counterContainer.className = "c-modal__counter";
    modalContent.appendChild(counterContainer);
    return counterContainer;
  }
  /**
   * Resolve currently active image index.
   * @returns {number}
   */
  getCurrentImageIndex() {
    if (!this.imageData) {
      return 0;
    }
    const imageStep = parseInt(this.imageData.imageStep, 10);
    if (Number.isInteger(imageStep) && imageStep >= 0 && imageStep < this.imageDataSet.length) {
      return imageStep;
    }
    const imageIndex = this.imageDataSet.findIndex((imageData) => imageData.image === this.imageData.image);
    return imageIndex >= 0 ? imageIndex : 0;
  }
  /**
   * Handle local gallery controls.
   * @param {MouseEvent} event
   */
  handleContainerClick(event2) {
    const trigger = event2.target instanceof Element ? event2.target.closest("[data-next], [data-prev]") : null;
    if (!trigger) {
      return;
    }
    if (trigger.hasAttribute("data-next")) {
      this.imageData = this.cycleImage("next");
      return;
    }
    if (trigger.hasAttribute("data-prev")) {
      this.imageData = this.cycleImage("prev");
    }
  }
  /**
   * Handle keyboard based gallery navigation.
   * @param {KeyboardEvent} event
   */
  handleKeyboardNavigation(event2) {
    if (!this.container || !this.isModalOpen()) {
      return;
    }
    if (event2.key === "ArrowRight") {
      this.imageData = this.cycleImage("next");
    }
    if (event2.key === "ArrowLeft") {
      this.imageData = this.cycleImage("prev");
    }
  }
  /**
   * Check whether current modal is open.
   * @returns {boolean}
   */
  isModalOpen() {
    return Boolean(this.container && this.container.hasAttribute("open"));
  }
};
__name(_Gallery, "Gallery");
let Gallery = _Gallery;
const _Modal = class _Modal {
  modalId;
  openTrigger;
  closeTrigger;
  dialogs;
  galleryInstances;
  handleDocumentClickBound;
  handleReindexBound;
  constructor() {
    this.modalId = null;
    this.openTrigger = document.querySelectorAll("[data-open]");
    this.closeTrigger = document.querySelectorAll("[data-close]");
    this.dialogs = document.querySelectorAll(".c-modal");
    this.galleryInstances = /* @__PURE__ */ new Map();
    this.handleDocumentClickBound = (event2) => this.handleDocumentClick(event2);
    this.handleReindexBound = () => this.reindexTriggers();
    this.enableModals();
  }
  /**
   * Enable Modal
   */
  enableModals() {
    document.removeEventListener("click", this.handleDocumentClickBound);
    document.addEventListener("click", this.handleDocumentClickBound);
    document.removeEventListener("reindexModals", this.handleReindexBound);
    document.addEventListener("reindexModals", this.handleReindexBound);
    this.attachDialogEvents();
    document.dispatchEvent(new CustomEvent("enableStyleguideModals"));
  }
  /**
   * Programmatically open a modal
   */
  openModal(modalId, largeImgUrl = null) {
    const modal = document.getElementById(modalId);
    if (!modal) {
      console.warn(`Modal with ID "${modalId}" not found.`);
      return;
    }
    this.modalId = modalId;
    if (!modal.hasAttribute("open")) {
      modal.classList.add("c-modal--visible");
      if (typeof modal.showModal === "function") {
        modal.showModal();
      }
    }
    if (largeImgUrl) {
      const galleryInstance = this.getGalleryInstance(modalId);
      galleryInstance.enableGallery(modalId);
      galleryInstance.initImage(modalId, largeImgUrl);
    }
    this.lockScroll();
  }
  /**
   * Handle clicks outside the modal
   */
  handleClickOutside(e) {
    const dialogElement = e.currentTarget;
    const mouseEvent = e;
    if (!dialogElement) {
      return;
    }
    if (this.clickIsOutsideElement(dialogElement, mouseEvent.clientX, mouseEvent.clientY)) {
      dialogElement.close();
    }
  }
  /**
   * Check if a click is outside the modal
   */
  clickIsOutsideElement(element, clientX, clientY) {
    const boundingRect = element.getBoundingClientRect();
    return clientX < boundingRect.left || clientX > boundingRect.right || clientY < boundingRect.top || clientY > boundingRect.bottom;
  }
  /**
   * Lock scroll
   */
  lockScroll() {
    const overflowHidden = "u-overflow--hidden";
    document.body.classList.add(overflowHidden);
  }
  /**
   * Unlock scroll
   */
  unlockScroll() {
    const overflowHidden = "u-overflow--hidden";
    const hasOpenDialogs = Array.from(this.dialogs).some((dialog) => dialog.hasAttribute("open"));
    if (!hasOpenDialogs) {
      document.body.classList.remove(overflowHidden);
    }
  }
  /**
   * Reindex triggers and dialogs
   */
  reindexTriggers() {
    this.openTrigger = document.querySelectorAll("[data-open]");
    this.closeTrigger = document.querySelectorAll("[data-close]");
    this.dialogs = document.querySelectorAll(".c-modal");
    this.attachDialogEvents();
    for (const id of this.galleryInstances.keys()) {
      if (!document.getElementById(id)) {
        this.galleryInstances.delete(id);
      }
    }
  }
  attachDialogEvents() {
    for (const dialog of this.dialogs) {
      if (dialog.dataset.modalBound === "true") {
        continue;
      }
      dialog.addEventListener("close", () => {
        dialog.classList.remove("c-modal--visible");
        this.unlockScroll();
      });
      dialog.addEventListener("click", (event2) => this.handleClickOutside(event2));
      dialog.dataset.modalBound = "true";
    }
  }
  handleDocumentClick(event2) {
    const trigger = event2.target?.closest("[data-open], [data-close]");
    if (!trigger) {
      return;
    }
    const openModalId = trigger.getAttribute("data-open");
    if (openModalId) {
      this.openModal(openModalId, trigger.getAttribute("data-large-img"));
      return;
    }
    const closeTrigger = trigger.getAttribute("data-close");
    if (closeTrigger !== null) {
      const closestDialog = trigger.closest("dialog");
      if (closestDialog?.hasAttribute("open")) {
        event2.stopPropagation();
        closestDialog.close();
      }
    }
  }
  getGalleryInstance(modalId) {
    const existingGalleryInstance = this.galleryInstances.get(modalId);
    if (existingGalleryInstance) {
      return existingGalleryInstance;
    }
    const galleryInstance = new Gallery(modalId);
    this.galleryInstances.set(modalId, galleryInstance);
    return galleryInstance;
  }
};
__name(_Modal, "Modal");
let Modal = _Modal;
function initializeModal() {
  new Modal();
}
__name(initializeModal, "initializeModal");
function Calendar(id, size, labelSettings, colors, options) {
  this.id = id;
  this.size = size;
  this.labelSettings = labelSettings;
  this.colors = colors;
  this.initday = 0;
  options = options || {};
  this.indicator = true;
  if (options.indicator != void 0) this.indicator = options.indicator;
  this.indicator_type = 1;
  if (options.indicator_type != void 0) this.indicator_type = options.indicator_type;
  this.indicator_pos = this.indicator_type == 1 ? "bottom" : "top";
  if (options.indicator_pos != void 0) this.indicator_pos = options.indicator_pos;
  var listPlaceholder = document.createElement("LI");
  listPlaceholder.className = "cjslib-list-placeholder";
  listPlaceholder.appendChild(document.createTextNode("No events on this day"));
  listPlaceholder.style = "text-align: center; padding: 20px 0px;";
  this.placeholder = listPlaceholder.outerHTML;
  if (options.placeholder != void 0) this.placeholder = options.placeholder;
  var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  if (options.months != void 0 && options.months.length == 12) months = options.months;
  var label = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  if (options.days != void 0 && options.days.length == 7) label = options.days;
  this.months = months;
  this.defaultLabels = label;
  this.label = [];
  this.labels = [];
  for (var i = 0; i < 7; i++) {
    this.label.push(label[label.indexOf(labelSettings[0]) + this.label.length >= label.length ? Math.abs(label.length - (label.indexOf(labelSettings[0]) + this.label.length)) : label.indexOf(labelSettings[0]) + this.label.length]);
  }
  for (var i = 0; i < 7; i++) {
    this.labels.push(this.label[i].substring(0, labelSettings[1] > 3 ? 3 : labelSettings[1]));
  }
  this.date = /* @__PURE__ */ new Date();
  this.today = /* @__PURE__ */ new Date();
  this.history = [];
  this.draw();
  this.update();
  this.setOnClickListener("days-blocks");
  this.setOnClickListener("month-slider");
  this.setOnClickListener("year-slider");
}
__name(Calendar, "Calendar");
Calendar.prototype = {
  constructor: Calendar,
  back: /* @__PURE__ */ __name(function back(func) {
    var date = this.date;
    new Date(date.getMonth() + 1 > 11 ? date.getFullYear() + 1 : date.getFullYear(), date.getMonth() + 1 > 12 ? 0 : date.getMonth() + 1, 0).getDate();
    var previousLastDay = new Date(date.getMonth() < 0 ? date.getFullYear() - 1 : date.getFullYear(), date.getMonth() < 0 ? 11 : date.getMonth(), 0).getDate();
    if (func == "month") {
      if (date.getDate() > previousLastDay) {
        this.changeDateTo(previousLastDay);
      }
      if (date.getMonth() > 0) date.setMonth(date.getMonth() - 1);
      else {
        date.setMonth(11);
        date.setFullYear(date.getFullYear() - 1);
      }
    } else if (func == "year") date.setFullYear(date.getFullYear() - 1);
    this.update();
  }, "back"),
  next: /* @__PURE__ */ __name(function next(func) {
    var date = this.date;
    new Date(date.getMonth() + 1 > 11 ? date.getFullYear() + 1 : date.getFullYear(), date.getMonth() + 1 > 12 ? 0 : date.getMonth() + 1, 0).getDate();
    var soonLastDay = new Date(date.getMonth() + 2 > 11 ? date.getFullYear() + 1 : date.getFullYear(), date.getMonth() + 2 > 12 ? 0 : date.getMonth() + 2, 0).getDate();
    if (func == "month") {
      if (date.getDate() > soonLastDay) {
        this.changeDateTo(soonLastDay);
      }
      if (date.getMonth() != 11) date.setMonth(date.getMonth() + 1);
      else {
        date.setMonth(0);
        date.setFullYear(date.getFullYear() + 1);
      }
    } else date.setFullYear(date.getFullYear() + 1);
    this.update();
  }, "next"),
  changeDateTo: /* @__PURE__ */ __name(function changeDateTo(theDay, theBlock) {
    if (theBlock >= 31 && theDay <= 11 || theBlock <= 6 && theDay >= 8) {
      if (theBlock >= 31 && theDay <= 11) this.next("month");
      else if (theBlock <= 6 && theDay >= 8) this.back("month");
      this.date.setDate(theDay);
      var calendarInstance = this;
      setTimeout(function() {
        calendarInstance.update();
      }, 1);
      return true;
    } else this.date.setDate(theDay);
  }, "changeDateTo"),
  getDateString: /* @__PURE__ */ __name(function getDateString() {
    return this.months[this.date.getMonth()] + " " + this.date.getDate() + ", " + this.date.getFullYear();
  }, "getDateString")
};
Calendar.prototype.draw = function() {
  var backSvg = '<svg style="width: 24px; height: 24px;" viewBox="0 0 24 24"><path fill="' + this.colors[3] + '" d="M15.41,16.58L10.83,12L15.41,7.41L14,6L8,12L14,18L15.41,16.58Z"></path></svg>';
  var nextSvg = '<svg style="width: 24px; height: 24px;" viewBox="0 0 24 24"><path fill="' + this.colors[3] + '" d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z"></path></svg>';
  var theCalendar = document.createElement("DIV");
  theCalendar.className = "cjslib-calendar cjslib-size-" + this.size;
  var theContainers = [], theNames = ["year", "month", "labels", "days"];
  for (var i = 0; i < theNames.length; i++) {
    theContainers[i] = document.createElement("DIV");
    theContainers[i].className = "cjslib-" + theNames[i];
    if (theNames[i] != "days") {
      if (theNames[i] != "month") {
        theContainers[i].style.backgroundColor = this.colors[1];
        theContainers[i].style.color = this.colors[3];
        if (theNames[i] != "labels") {
          var backSlider = document.createElement("DIV");
          backSlider.id = this.id + "-year-back";
          backSlider.insertAdjacentHTML("beforeend", backSvg);
          theContainers[i].appendChild(backSlider.cloneNode(true));
          var theText = document.createElement("SPAN");
          theText.id = this.id + "-" + theNames[i];
          theContainers[i].appendChild(theText.cloneNode(true));
          var nextSlider = document.createElement("DIV");
          nextSlider.id = this.id + "-year-next";
          nextSlider.insertAdjacentHTML("beforeend", nextSvg);
          theContainers[i].appendChild(nextSlider.cloneNode(true));
        }
      } else {
        theContainers[i].style.backgroundColor = this.colors[0];
        theContainers[i].style.color = this.colors[2];
        var backSlider = document.createElement("DIV");
        backSlider.id = this.id + "-month-back";
        backSlider.insertAdjacentHTML("beforeend", backSvg);
        theContainers[i].appendChild(backSlider.cloneNode(true));
        var theText = document.createElement("SPAN");
        theText.id = this.id + "-" + theNames[i];
        theContainers[i].appendChild(theText.cloneNode(true));
        var nextSlider = document.createElement("DIV");
        nextSlider.id = this.id + "-month-next";
        nextSlider.insertAdjacentHTML("beforeend", nextSvg);
        theContainers[i].appendChild(nextSlider.cloneNode(true));
      }
    }
  }
  for (var i = 0; i < this.labels.length; i++) {
    var theLabel = document.createElement("SPAN");
    theLabel.id = this.id + "-label-" + (i + 1);
    theLabel.appendChild(document.createTextNode(this.labels[i]).cloneNode(true));
    theContainers[2].appendChild(theLabel.cloneNode(true));
  }
  var theRows = [], theDays = [], theRadios = [];
  for (var i = 0; i < 6; i++) {
    theRows[i] = document.createElement("DIV");
    theRows[i].className = "cjslib-row";
  }
  for (var i = 0, j = 0; i < 42; i++) {
    theRadios[i] = document.createElement("INPUT");
    theRadios[i].className = "cjslib-day-radios";
    theRadios[i].type = "button";
    theRadios[i].name = this.id + "-day-radios";
    theRadios[i].id = this.id + "-day-radio-" + (i + 1);
    theRadios[i].setAttribute("data-open", "examplemodalid");
    theDays[i] = document.createElement("LABEL");
    theDays[i].className = "cjslib-day";
    theDays[i].htmlFor = this.id + "-day-radio-" + (i + 1);
    theDays[i].id = this.id + "-day-" + (i + 1);
    theDays[i].setAttribute("data-open", "examplemodalid");
    var theText = document.createElement("SPAN");
    theText.className = "cjslib-day-num";
    theText.id = this.id + "-day-num-" + (i + 1);
    theDays[i].appendChild(theText.cloneNode(true));
    if (this.indicator) {
      var theIndicator = document.createElement("SPAN");
      theIndicator.className = "cjslib-day-indicator cjslib-indicator-pos-" + this.indicator_pos;
      if (this.indicator_type == 1) theIndicator.className += " cjslib-indicator-type-numeric";
      theIndicator.id = this.id + "-day-indicator-" + (i + 1);
      theDays[i].appendChild(theIndicator.cloneNode(true));
    }
    theRows[j].appendChild(theRadios[i].cloneNode(true));
    theRows[j].appendChild(theDays[i].cloneNode(true));
    if ((i + 1) % 7 == 0) {
      j++;
    }
  }
  for (var i = 0; i < 6; i++) {
    theContainers[3].appendChild(theRows[i].cloneNode(true));
  }
  for (var i = 0; i < theContainers.length; i++) {
    theCalendar.appendChild(theContainers[i].cloneNode(true));
  }
  document.getElementById(this.id).innerHTML = "<style>.cjslib-day-indicator { color: " + this.colors[1] + "; background-color: " + this.colors[1] + "; } .cjslib-indicator-type-numeric { color: " + this.colors[2] + "; } .cjslib-day.cjslib-day-today > .cjslib-day-num { border-color: " + this.colors[1] + " !important; }</style>";
  document.getElementById(this.id).appendChild(theCalendar.cloneNode(true));
};
Calendar.prototype.update = function() {
  document.getElementById(this.id + "-year").innerHTML = this.date.getFullYear();
  document.getElementById(this.id + "-month").innerHTML = this.months[this.date.getMonth()];
  for (var i = 1; i <= 42; i++) {
    document.getElementById(this.id + "-day-num-" + i).innerHTML = "";
    document.getElementById(this.id + "-day-" + i).className = this.id + " cjslib-day cjslib-day-listed";
  }
  var firstDay = new Date(this.date.getFullYear(), this.date.getMonth(), 1).getDay();
  var lastDay = new Date(this.date.getMonth() + 1 > 11 ? this.date.getFullYear() + 1 : this.date.getFullYear(), this.date.getMonth() + 1 > 12 ? 0 : this.date.getMonth() + 1, 0).getDate();
  var previousLastDay = new Date(this.date.getMonth() < 0 ? this.date.getFullYear() - 1 : this.date.getFullYear(), this.date.getMonth() < 0 ? 11 : this.date.getMonth(), 0).getDate();
  this.initday = this.label.indexOf(this.defaultLabels[firstDay]);
  var firstDayLabel = this.defaultLabels[firstDay];
  var firstDayLabelPos = this.label.indexOf(firstDayLabel);
  for (var i = 0, j = previousLastDay; i < firstDayLabelPos; i++, j--) {
    document.getElementById(this.id + "-day-num-" + (firstDayLabelPos - i)).innerHTML = j;
    document.getElementById(this.id + "-day-" + (firstDayLabelPos - i)).className = this.id + " cjslib-day cjslib-day-diluted";
  }
  for (var i = 1; i <= lastDay; i++) {
    document.getElementById(this.id + "-day-num-" + (firstDayLabelPos + i)).innerHTML = i;
    if (i == this.date.getDate()) document.getElementById(this.id + "-day-radio-" + (firstDayLabelPos + i)).checked = true;
    if (this.date.getMonth() == this.today.getMonth()) {
      if (i == this.today.getDate()) document.getElementById(this.id + "-day-" + (firstDayLabelPos + i)).className += " cjslib-day-today";
    }
  }
  for (var i = lastDay + 1, j = 1; firstDayLabelPos + i <= 42; i++, j++) {
    document.getElementById(this.id + "-day-num-" + (firstDayLabelPos + i)).innerHTML = j;
    document.getElementById(this.id + "-day-" + (firstDayLabelPos + i)).className = this.id + " cjslib-day cjslib-day-diluted";
  }
};
Calendar.prototype.setupBlock = function(blockId, calendarInstance, callback) {
  document.getElementById(calendarInstance.id + "-day-" + blockId).onclick = function() {
    if (document.getElementById(calendarInstance.id + "-day-num-" + blockId).innerHTML.length > 0) {
      calendarInstance.changeDateTo(document.getElementById(calendarInstance.id + "-day-num-" + blockId).innerHTML, blockId);
      callback();
    }
  };
};
Calendar.prototype.setOnClickListener = function(theCase, backCallback, nextCallback) {
  var calendarId = this.id;
  backCallback = backCallback || function() {
  };
  nextCallback = nextCallback || function() {
  };
  var calendarInstance = this;
  switch (theCase) {
    case "days-blocks":
      for (var i = 1; i <= 42; i++) {
        calendarInstance.setupBlock(i, calendarInstance, backCallback);
      }
      break;
    case "month-slider":
      document.getElementById(calendarId + "-month-back").onclick = function() {
        calendarInstance.back("month");
        backCallback();
      };
      document.getElementById(calendarId + "-month-next").onclick = function() {
        calendarInstance.next("month");
        nextCallback();
      };
      break;
    case "year-slider":
      document.getElementById(calendarId + "-year-back").onclick = function() {
        calendarInstance.back("year");
        backCallback();
      };
      document.getElementById(calendarId + "-year-next").onclick = function() {
        calendarInstance.next("year");
        nextCallback();
      };
      break;
  }
};
function Organizer(id, calendar, data) {
  this.id = id;
  this.calendar = calendar;
  this.data = data || {};
  this.draw();
  var organizerInstance = this;
  organizerInstance.onMonthChange(function() {
    organizerInstance.indicateEvents();
  });
  this.setOnClickListener("days-blocks");
  this.setOnClickListener("day-slider");
  this.setOnClickListener("month-slider");
  this.setOnClickListener("year-slider");
  this.setOnLongClickListener("days-blocks");
}
__name(Organizer, "Organizer");
Organizer.prototype = {
  constructor: Organizer,
  back: /* @__PURE__ */ __name(function back2(func) {
    var date = this.calendar.date;
    var lastDay = new Date(date.getMonth() + 1 > 11 ? date.getFullYear() + 1 : date.getFullYear(), date.getMonth() + 1 > 12 ? 0 : date.getMonth() + 1, 0).getDate();
    new Date(date.getMonth() < 0 ? date.getFullYear() - 1 : date.getFullYear(), date.getMonth() < 0 ? 11 : date.getMonth(), 0).getDate();
    if (func == "day") {
      if (date.getDate() != 1) {
        this.changeDateTo(date.getDate() - 1);
        this.update();
      } else {
        this.calendar.back("month");
        this.changeDateTo(lastDay);
        var organizerInstance = this;
        organizerInstance.onMonthChange(function() {
          organizerInstance.indicateEvents();
        });
      }
      document.getElementById(this.calendar.id + "-day-radio-" + (this.calendar.initday + date.getDate())).checked = true;
    } else {
      this.calendar.back(func);
      var organizerInstance = this;
      organizerInstance.onMonthChange(function() {
        organizerInstance.indicateEvents();
      });
    }
  }, "back"),
  next: /* @__PURE__ */ __name(function next2(func) {
    var date = this.calendar.date;
    var lastDay = new Date(date.getMonth() + 1 > 11 ? date.getFullYear() + 1 : date.getFullYear(), date.getMonth() + 1 > 12 ? 0 : date.getMonth() + 1, 0).getDate();
    new Date(date.getMonth() + 2 > 11 ? date.getFullYear() + 1 : date.getFullYear(), date.getMonth() + 2 > 12 ? 0 : date.getMonth() + 2, 0).getDate();
    if (func == "day") {
      if (date.getDate() != lastDay) {
        date.setDate(date.getDate() + 1);
        this.update();
      } else {
        this.calendar.next("month");
        date.setDate(1);
        var organizerInstance = this;
        organizerInstance.onMonthChange(function() {
          organizerInstance.indicateEvents();
        });
      }
      document.getElementById(this.calendar.id + "-day-radio-" + (this.calendar.initday + date.getDate())).checked = true;
    } else {
      this.calendar.next(func);
      var organizerInstance = this;
      organizerInstance.onMonthChange(function() {
        organizerInstance.indicateEvents();
      });
    }
  }, "next"),
  changeDateTo: /* @__PURE__ */ __name(function changeDateTo2(theDay, theBlock) {
    this.clearHistory();
    this.calendar.changeDateTo(theDay, theBlock);
    var organizerInstance = this;
    return organizerInstance.update();
  }, "changeDateTo"),
  addDate: /* @__PURE__ */ __name(function changeDateTo3(theDay, theBlock) {
    this.showHistory();
    var changedMonth = this.calendar.changeDateTo(theDay, theBlock);
    var organizerInstance = this;
    setTimeout(function() {
      if (changedMonth) {
        organizerInstance.onMonthChange(function() {
          organizerInstance.indicateEvents();
        });
      } else organizerInstance.update();
    }, 1);
  }, "changeDateTo")
};
Organizer.prototype.draw = function() {
  var backSvg = '<svg style="width: 24px; height: 24px;" viewBox="0 0 24 24"><path fill="' + this.calendar.colors[3] + '" d="M15.41,16.58L10.83,12L15.41,7.41L14,6L8,12L14,18L15.41,16.58Z"></path></svg>';
  var nextSvg = '<svg style="width: 24px; height: 24px;" viewBox="0 0 24 24"><path fill="' + this.calendar.colors[3] + '" d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z"></path></svg>';
  var theOrganizer = document.createElement("DIV");
  theOrganizer.className = "cjslib-events cjslib-size-" + this.calendar.size;
  var theDate = document.createElement("DIV");
  theDate.className = "cjslib-date";
  theDate.style.backgroundColor = this.calendar.colors[1];
  theDate.style.color = this.calendar.colors[3];
  var backSlider = document.createElement("DIV");
  backSlider.id = this.id + "-day-back";
  backSlider.insertAdjacentHTML("beforeend", backSvg);
  theDate.appendChild(backSlider.cloneNode(true));
  var theText = document.createElement("SPAN");
  theText.id = this.id + "-date";
  theDate.appendChild(theText.cloneNode(true));
  var nextSlider = document.createElement("DIV");
  nextSlider.id = this.id + "-day-next";
  nextSlider.insertAdjacentHTML("beforeend", nextSvg);
  theDate.appendChild(nextSlider.cloneNode(true));
  var theRows = document.createElement("DIV");
  theRows.className = "cjslib-rows";
  theRows.id = this.id + "-list-container";
  var theList = document.createElement("OL");
  theList.className = "cjslib-list";
  theList.id = this.id + "-list";
  var theHistory = document.createElement("OL");
  theHistory.className = "cjslib-list";
  theHistory.id = this.id + "-history";
  theRows.appendChild(theList.cloneNode(true));
  theRows.appendChild(theHistory.cloneNode(true));
  theOrganizer.appendChild(theDate.cloneNode(true));
  theOrganizer.appendChild(theRows.cloneNode(true));
  document.getElementById(this.id).appendChild(theOrganizer.cloneNode(true));
};
Organizer.prototype.update = function() {
  document.getElementById(this.id + "-date").innerHTML = this.calendar.months[this.calendar.date.getMonth()] + " " + this.calendar.date.getDate() + ", " + this.calendar.date.getFullYear();
  document.getElementById(this.id + "-list").innerHTML = "";
  return this.showEvents();
};
Organizer.prototype.updateData = function(data) {
  this.data = data;
  this.indicateEvents();
  this.update();
};
Organizer.prototype.list = function(data) {
  let events = { "booked": [], "available": [] };
  console.log("WHAT");
  console.log(data);
  for (let i = 0; i < data.length; i++) {
    console.log(i);
    for (event in data[type]) {
      let listItem = document.createElement("LI");
      listItem.id = this.id + "-list-item-" + type;
      let span = document.createElement("SPAN");
      span.id = this.id + "-list-item-" + type + "-time";
      span.class = this.id + " time";
      span.appendChild(document.createTextNode(data[type].startTime + " - " + data[type].endTime));
      let division = document.createElement("DIV");
      division.appendChild(span);
      let paragraph = document.createElement("P");
      paragraph.id = this.id + "-list-item-" + i + "-text";
      paragraph.appendChild(document.createTextNode(data[i].text));
      listItem.appendChild(division);
      listItem.appendChild(paragraph);
      events[type].push(listItem);
    }
  }
  console.log("LIST");
  console.log(events);
  return events;
};
Organizer.prototype.remember = function(date, content) {
  if (content.startsWith('<div class="cjslib-list-placeholder">'))
    return "";
  let dateTitle = this.calendar.getDateString();
  this.calendar.history.unshift(dateTitle);
  let container = document.createElement("UL");
  container.className = "cjslib-list cjslib-list-history";
  let title = document.createElement("LI");
  title.appendChild(document.createTextNode(dateTitle));
  title.className = "cjslib-list-history-title cjslib-date";
  title.style.backgroundColor = this.calendar.colors[1];
  title.style.color = this.calendar.colors[3];
  container.appendChild(title);
  container.innerHTML += content;
  return container.outerHTML;
};
Organizer.prototype.clearHistory = function() {
  this.calendar.history = [];
  document.getElementById(this.id + "-history").innerHTML = "";
};
Organizer.prototype.setupBlock = function(blockId, organizerInstance, callback) {
  const calendarInstance = organizerInstance.calendar;
  document.getElementById(calendarInstance.id + "-day-" + blockId).onclick = function(clickEvent) {
    if (document.getElementById(calendarInstance.id + "-day-num-" + blockId).innerHTML.length > 0) {
      if (document.getElementById(calendarInstance.id + "-day-radio-" + blockId).checked)
        return;
      var longPressed = "" + document.getElementById(calendarInstance.id + "-day-num-" + blockId).dataset.longpressed;
      document.getElementById(calendarInstance.id + "-day-num-" + blockId).dataset.longpressed = false;
      if (longPressed != "true") {
        const dayNumBlock = document.getElementById(calendarInstance.id + "-day-num-" + blockId);
        const dayBlock = document.getElementById(calendarInstance.id + "-day-" + blockId);
        const eventList = organizerInstance.changeDateTo(dayNumBlock.innerHTML, blockId);
        console.log("sasd");
        console.log(eventList);
        callback(clickEvent, eventList, dayBlock, calendarInstance);
      }
    }
  };
};
Organizer.prototype.showEvents = function(data) {
  data = data || this.data;
  const date = this.calendar.date;
  return data[date.getFullYear()][date.getMonth() + 1][date.getDate()];
};
Organizer.prototype.showHistory = function(data) {
  data = data || this.data;
  var date = this.calendar.date;
  var content = this.remember(date, document.getElementById(this.id + "-list").innerHTML);
  var history2 = document.getElementById(this.id + "-history").innerHTML;
  document.getElementById(this.id + "-history").innerHTML = content + history2;
};
Organizer.prototype.showPlaceholder = function(data) {
  var container = document.createElement("DIV");
  container.className = "cjslib-list-placeholder";
  container.innerHTML = this.calendar.placeholder;
  return container.outerHTML;
};
Organizer.prototype.indicateEvents = function(data) {
  data = data || this.data;
  var date = this.calendar.date;
  console.log(data);
  if (this.calendar.indicator) {
    var allDays = document.getElementsByClassName(this.calendar.id + " cjslib-day cjslib-day-listed");
    for (var i = 0; i < allDays.length; i++) {
      allDays[i].children[1].innerHTML = "";
    }
    try {
      var month = data[date.getFullYear()][date.getMonth() + 1];
      for (var key in month) {
        console.log(key);
        console.log(month);
        if (month[key]["booked"].length > 0) {
          allDays[key - 1].children[1].innerHTML = month[key]["booked"].length > 9 ? "9+" : month[key]["booked"].length;
        }
      }
    } catch (e) {
    }
  }
  this.update();
};
Organizer.prototype.onMonthChange = function(callback) {
  callback();
};
Organizer.prototype.setOnClickListener = function(theCase, backCallback, nextCallback) {
  var calendarId = this.calendar.id;
  var organizerId = this.id;
  backCallback = backCallback || function() {
  };
  nextCallback = nextCallback || function() {
  };
  var organizerInstance = this;
  switch (theCase) {
    case "days-blocks":
      for (var i = 1; i <= 42; i++) {
        organizerInstance.setupBlock(i, organizerInstance, backCallback);
      }
      break;
    case "day-slider":
      document.getElementById(organizerId + "-day-back").onclick = function() {
        organizerInstance.back("day");
        backCallback();
      };
      document.getElementById(organizerId + "-day-next").onclick = function() {
        organizerInstance.next("day");
        nextCallback();
      };
      break;
    case "month-slider":
      document.getElementById(calendarId + "-month-back").onclick = function() {
        organizerInstance.back("month");
        backCallback();
      };
      document.getElementById(calendarId + "-month-next").onclick = function() {
        organizerInstance.next("month");
        nextCallback();
      };
      break;
    case "year-slider":
      document.getElementById(calendarId + "-year-back").onclick = function() {
        organizerInstance.back("year");
        backCallback();
      };
      document.getElementById(calendarId + "-year-next").onclick = function() {
        organizerInstance.next("year");
        nextCallback();
      };
      break;
  }
};
Organizer.prototype.setupLongClickBlock = function(blockId, organizerInstance, callback) {
  var calendarInstance = organizerInstance.calendar;
  var mouseDownEvent = /* @__PURE__ */ __name(function() {
    document.getElementById(calendarInstance.id + "-day-num-" + blockId).dataset.longpressed = "-";
    window.setTimeout(function() {
      if (document.getElementById(calendarInstance.id + "-day-num-" + blockId).innerHTML.length > 0) {
        if (document.getElementById(calendarInstance.id + "-day-num-" + blockId).dataset.longpressed == "false")
          return;
        else document.getElementById(calendarInstance.id + "-day-num-" + blockId).dataset.longpressed = true;
        if (document.getElementById(calendarInstance.id + "-day-radio-" + blockId).checked)
          return;
        organizerInstance.addDate(document.getElementById(calendarInstance.id + "-day-num-" + blockId).innerHTML, blockId);
        callback();
      }
    }, 1e3);
  }, "mouseDownEvent");
  document.getElementById(calendarInstance.id + "-day-" + blockId).onmousedown = mouseDownEvent;
  document.getElementById(calendarInstance.id + "-day-" + blockId).ontouchstart = mouseDownEvent;
};
Organizer.prototype.setOnLongClickListener = function(theCase, backCallback, nextCallback) {
  this.calendar.id;
  this.id;
  backCallback = backCallback || function() {
  };
  var organizerInstance = this;
  switch (theCase) {
    case "days-blocks":
      for (var i = 1; i <= 42; i++) {
        organizerInstance.setupLongClickBlock(i, organizerInstance, backCallback);
      }
      break;
  }
};
const _EventCalendar = class _EventCalendar {
  constructor() {
    this.timeslots = [];
  }
  initiateCalendar() {
    const calendar = document.querySelector(".c-calendar");
    if (calendar) {
      const eventsUrl = calendar.getAttribute("eventsUrl");
      const bookingUrl = calendar.getAttribute("bookingUrl");
      const size = calendar.getAttribute("size");
      const weekStart = calendar.getAttribute("weekStart");
      this.getEvents(eventsUrl).then((data) => this.setup(data, weekStart, size, calendar, bookingUrl));
    }
  }
  getEvents(eventsUrl) {
    return fetch(eventsUrl).then((response) => response.json()).then((data) => {
      return data;
    });
  }
  postEvents(bookingUrl) {
    fetch(bookingUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(this.timeslots)
    });
  }
  setButtonListener(calendarElement, bookingUrl) {
    const button = calendarElement.getElementsByClassName("postEventButton");
    button[0].addEventListener("click", () => {
      this.postEvents(bookingUrl);
    });
  }
  // TODO: modify lib to return timestamps directly instead of strings...
  setTimeslotListener(checkbox, date, timeslot) {
    checkbox.addEventListener("change", (event2) => {
      const timeslotParts = timeslot.split(" - ");
      const from = timeslotParts[0].split(":")[0];
      const to = timeslotParts[1].split(":")[0];
      const temp = {
        from: date.setHours(parseInt(from), 0, 0, 0),
        to: date.setHours(parseInt(to), 0, 0, 0)
      };
      if (checkbox.checked) {
        this.timeslots.push(temp);
      } else if (!checkbox.checked) {
        for (let i = 0; i < this.timeslots.length; i++) {
          if (JSON.stringify(this.timeslots[i]) === JSON.stringify(temp)) {
            this.timeslots.splice(i, 1);
          }
        }
      }
    });
  }
  //TODO: Research the possibility to make the elment a bit less complex.
  createListElement(events, date, availableEvents) {
    let listItem = document.createElement("LI");
    for (let i = 0; i < events.length; i++) {
      const timeslot = events[i].startTime + " - " + events[i].endTime;
      listItem.id = this.id + "-list-item-" + i;
      let division = document.createElement("DIV");
      let checkbox = document.createElement("INPUT");
      checkbox.setAttribute("type", "checkbox");
      this.setTimeslotListener(checkbox, date, timeslot);
      let span = document.createElement("SPAN");
      span.id = this.id + "-list-item-" + i + "-time";
      span.class = this.id + " time";
      span.appendChild(document.createTextNode(events[i].startTime + " - " + events[i].endTime));
      division.appendChild(span);
      let paragraph = document.createElement("P");
      paragraph.id = this.id + "-list-item-" + i + "-text";
      paragraph.appendChild(document.createTextNode(events[i].text));
      if (availableEvents) paragraph.appendChild(checkbox);
      listItem.appendChild(division);
      listItem.appendChild(paragraph);
    }
    return listItem;
  }
  setup(data, weekStart, size, calendarElement, postUrl) {
    let calendar = new Calendar(
      "calendarContainer",
      size,
      [
        weekStart,
        3
      ],
      [],
      {
        indicator: true,
        indicator_type: 1,
        indicator_pos: "bottom"
      }
    );
    let organizer = new Organizer(
      "organizerContainer",
      calendar,
      data
    );
    this.setButtonListener(calendarElement, postUrl);
    organizer.setOnClickListener(
      "days-blocks",
      (clickEvent, eventsList, element, calendarInstance) => {
        const modalId = clickEvent.target.getAttribute("data-open");
        let modal = document.getElementById(modalId);
        const isVisible = "c-modal__bg--is-visible";
        modal.classList.add(isVisible);
        const list = calendarElement.querySelector(".c-calendar__event-list");
        let bookedEvents = list.querySelector(".booked__list");
        let availableEvents = list.querySelector(".available__list");
        let listHeader = bookedEvents.closest(".c-modal").querySelector("header").querySelector("h2");
        listHeader.innerHTML = "";
        availableEvents.innerHTML = "";
        bookedEvents.innerHTML = "";
        listHeader.innerHTML = calendarInstance.date.getDate() + "/" + calendarInstance.date.getMonth() + 1 + "/" + calendarInstance.date.getFullYear();
        if (eventsList.booked)
          bookedEvents.appendChild(this.createListElement(eventsList.booked, calendarInstance.date, false));
        if (eventsList.available)
          availableEvents.appendChild(this.createListElement(eventsList.available, calendarInstance.date, true));
      }
    );
  }
};
__name(_EventCalendar, "EventCalendar");
let EventCalendar = _EventCalendar;
const _Notification = class _Notification {
  setup() {
    const containers = document.getElementsByClassName("c-notification__container");
    if (containers && containers.length > 0) {
      containers.forEach((container) => {
        const direction = container.getAttribute("direction");
        const directionClass = `c-notification__container--${direction}`;
        container.classList.add(directionClass);
        this.setOnClickClose(container);
      });
    }
  }
  removeFirst(target) {
    const notifications = target.querySelectorAll(".c-notification");
    const maxAmount = target.getAttribute("maxamount");
    if (notifications.length > maxAmount) {
      notifications[0].outerHTML = "";
    }
  }
  setOnClickClose(targetNode) {
    let count = 0;
    const observerOptions = {
      childList: true
    };
    const observer = new MutationObserver((event2) => {
      count++;
      this.removeFirst(targetNode);
      event2.forEach((record) => {
        record.addedNodes.forEach((node) => {
          if (node.classList.contains("c-notification")) {
            this.setAutoHideDuration(node);
            node.addEventListener("click", () => {
              node.classList.add(`c-notification--dying--${count}`);
              node.outerHTML = "";
            });
          }
        });
      });
    });
    observer.observe(targetNode, observerOptions);
  }
  setAutoHideDuration(notification) {
    const autoHideDuration = notification.getAttribute("autoHideDuration");
    setTimeout(function() {
      notification.outerHTML = "";
    }, autoHideDuration);
  }
};
__name(_Notification, "Notification");
let Notification = _Notification;
const _NotificationDoc = class _NotificationDoc {
  addListener() {
    const notificationButton = document.getElementsByClassName("notification__button")[0];
    const notification = document.getElementsByClassName("c-notification")[0];
    if (notification) {
      const direction = notification.getAttribute("direction");
      let container = document.createElement("DIV");
      container.classList.add("c-notification__container");
      container.classList.add("c-notification__container--" + direction);
      container.setAttribute("maxAmount", 3);
      document.body.appendChild(container);
      notificationButton.addEventListener("click", () => {
        let notificationCopy = notification.cloneNode(true);
        notificationCopy.classList.remove("u-display--none");
        container.appendChild(notificationCopy);
      });
    }
  }
};
__name(_NotificationDoc, "NotificationDoc");
let NotificationDoc = _NotificationDoc;
const _Sidebar = class _Sidebar {
  constructor() {
    this.ATTR = "js-sidebar";
    this.EXPAND = "c-sidebar__item--is-expanded";
    this.EXPANDABLE = "c-sidebar__subcontainer";
    this.ACTIVE = "item-active";
    this.TRIGGER = "js-sidebar-trigger";
    this.SUBCONTAINER = "c-sidebar__subcontainer";
    this.TOGGLE = "c-sidebar__toggle";
    this.TOGGLE_TRIGGER = "js-toggle-trigger";
    this.TOGGLE_ITEM = "js-toggle-item";
    this.ITEM = "c-sidebar__item";
    this.COLLAPSED = "c-sidebar--collapsed";
  }
  /**
   * Finds all sidebars and applies appropriate classes and attributes on load
   * @return {void}
   */
  applySidebar() {
    const sb = document.querySelector(`[${this.ATTR}]`);
    if (sb) {
      const activeItems = sb.querySelectorAll(`[${this.ACTIVE}="true"]`);
      if (activeItems.length > 0) {
        activeItems.forEach((item) => {
          this.expandItem(item, sb);
        });
      }
      this.addTriggers(sb);
    }
  }
  /**
   * Adds listeners to buttons
   * @param {Object} sb The sidebar
  */
  addTriggers(sb) {
    const sbTriggers = document.querySelectorAll(`[${this.TRIGGER}]`);
    sbTriggers.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        sb.classList.toggle(`${this.COLLAPSED}`);
      });
    });
  }
  /**
   * Expand current item
   * @param {Object} item The current item to expand
   */
  expandItem(item, sb) {
    if (item.closest(`.${this.SUBCONTAINER}`)) {
      const id = this.getToggleId(item);
      const toggle2 = sb.querySelector(`[${this.TOGGLE_TRIGGER}="${id}"]`);
      toggle2.setAttribute("aria-pressed", true);
      this.addExpandClass(item);
      this.expandItem(toggle2, sb);
    }
  }
};
__name(_Sidebar, "Sidebar");
let Sidebar = _Sidebar;
const _DynamicSidebar = class _DynamicSidebar {
  constructor() {
    this.dynamicSidebars = document.querySelectorAll(".c-sidebar[endpoint-children]");
    if (this.dynamicSidebars) {
      this.endpoints = {};
      this.pageId = document.getElementsByTagName("body")[0].getAttribute("data-js-page-id");
    }
  }
  /**
   * Finds all sidebars and applies appropriate classes and attributes on load
   * @return {void}
   */
  applySidebar() {
    if (this.dynamicSidebars) {
      this.dynamicSidebars.forEach((sidebar) => {
        this.endpoints.children = sidebar.getAttribute("endpoint-children");
        this.addTriggers(sidebar.querySelectorAll(".c-sidebar__toggle"));
        sidebar.querySelectorAll(".c-sidebar__subcontainer").forEach((subContainer) => {
          if (subContainer.childElementCount === 0) {
            subContainer.parentElement.removeChild(subContainer);
          }
        });
      });
    }
  }
  getChildren(parentId) {
    return fetch(`${this.endpoints.children}?pageId=${parentId}`).then((response) => {
      return response.json();
    }).then((data) => {
      return data;
    });
  }
  appendChildren(parentID) {
    return this.getChildren(parentID).then((children2) => {
      const subContainer = document.createElement("div");
      subContainer.setAttribute("subContainerID", parentID);
      subContainer.classList.add("c-sidebar__subcontainer");
      children2.forEach((child2) => {
        const childItem = document.createElement("div");
        childItem.classList.add("c-sidebar__item");
        const link = document.createElement("a");
        link.href = child2.href;
        link.classList.add("c-sidebar__link");
        link.text = child2.label;
        link.setAttribute("item-active", "false");
        link.id = `${child2.id}`;
        childItem.appendChild(link);
        if (child2.children) {
          const bar = document.createElement("div");
          bar.classList.add("bar");
          const toggle2 = document.createElement("div");
          toggle2.classList.add("c-sidebar__toggle");
          toggle2.appendChild(bar);
          toggle2.appendChild(bar.cloneNode(true));
          toggle2.setAttribute("aria-label", child2.id);
          childItem.appendChild(toggle2);
        }
        subContainer.appendChild(childItem);
      });
      subContainer.classList.add("c-sidebar__item--is-expanded");
      return subContainer;
    });
  }
  /**
   * Adds listeners to buttons
   * @param {Object} sb The sidebar
  */
  addTriggers(toggleTriggers) {
    toggleTriggers.forEach((trigger) => {
      const parentId = trigger.getAttribute("aria-label");
      const parent = trigger.parentElement;
      trigger.addEventListener("click", () => {
        const ariaPressed = trigger.getAttribute("aria-pressed") === "true" ? "false" : "true";
        trigger.setAttribute("aria-pressed", ariaPressed);
        if (!trigger.getAttribute("aria-loaded")) {
          trigger.setAttribute("aria-loaded", "true");
          this.appendChildren(parentId).then((child2) => {
            parent.appendChild(child2);
            const parentSubcontainer2 = parent.querySelector(".c-sidebar__subcontainer");
            this.addTriggers(parentSubcontainer2.querySelectorAll(".c-sidebar__toggle"));
          });
        }
        const parentSubcontainer = parent.querySelector(".c-sidebar__subcontainer");
        if (parentSubcontainer) {
          parentSubcontainer.classList.toggle("c-sidebar__item--is-expanded");
        }
      });
    });
  }
};
__name(_DynamicSidebar, "DynamicSidebar");
let DynamicSidebar = _DynamicSidebar;
const _Navbar = class _Navbar {
  constructor() {
    this.dynamicNavBar = document.querySelector(".c-navbar[js-is-dynamic]");
    if (this.dynamicNavBar) {
      this.pageID = this.dynamicNavBar.getAttribute("data-page-id");
      this.pageParentID = this.dynamicNavBar.getAttribute("data-page-parent-id");
      this.navbarExpandedGrid = this.dynamicNavBar.querySelector(".c-navbar__expanded_grid");
      this.navBarGridItems = this.navbarExpandedGrid.querySelectorAll("a");
      this.navbarExpandedMain = this.dynamicNavBar.querySelector(".c-navbar__expanded_main");
      this.childItemsUrl = this.dynamicNavBar.getAttribute("js-child-items-url");
      this.cleanUpNavBarContent();
      this.populateNavBarContent();
      this.setupPrevButton();
    }
  }
  cleanUpNavBarContent() {
    this.navbarExpandedGrid.innerHTML = " ";
  }
  getPageData(id) {
    return fetch(`${this.childItemsUrl}?pageID=${id}`).then((response) => {
      return response.json();
    }).then((data) => {
      return data;
    });
  }
  populateNavBarContent() {
    this.getPageData(this.pageID).then((currentPageItems) => {
      currentPageItems.items.forEach((item) => {
        const anchorElement = this.constructor.createAnchorElement(item);
        this.navbarExpandedGrid.innerHTML += anchorElement;
        this.navbarExpandedMain.querySelector("h2").innerText = currentPageItems.title;
      });
    });
  }
  setupPrevButton() {
    this.getPageData(this.pageParentID).then((previousPage) => {
      const previousButton = this.navbarExpandedMain.querySelector("a");
      previousButton.href = previousPage.href;
      previousButton.querySelector(".c-button__label-text--reverse").innerText = previousPage.title;
    });
  }
  static createAnchorElement(item) {
    return `
            <a class="c-grid u-margin__y--4 c-grid__container__gap__col--0 c-grid__container__gap__row--0" href="${item.href}" pageid="${item.id}">
                
                <h2 class="c-typography c-navbar__title c-typography__variant--h2">
                    ${item.label}
                </h2>
        
                <p class="c-typography c-typography__variant--body">
                    ${item.preview ? item.preview : "No Preview Available"}
                </p>
            </a>
        `;
  }
};
__name(_Navbar, "Navbar");
let Navbar = _Navbar;
const _Pagination = class _Pagination {
  container;
  link;
  indexLinks;
  paginationContainer;
  listContainer;
  prevBtn;
  nextBtn;
  perPage = 10;
  maxPages = 0;
  list;
  attributes;
  constructor(container, index) {
    this.container = container;
    this.link = null;
    this.list = [...this.container.querySelectorAll(`[data-js-pagination-item]`)];
    this.indexLinks = "data-js-pagination-index";
    this.paginationContainer = this.container.querySelector(`[data-js-pagination]`);
    this.listContainer = this.container.querySelector(`[data-js-pagination-container]`);
    this.prevBtn = "data-js-pagination-prev";
    this.nextBtn = "data-js-pagination-next";
    if (!this.paginationContainer) {
      return;
    }
    this.attributes = this.getAttributes();
    if (this.attributes.randomize) {
      this.list = this.list.sort(() => Math.random() - 0.5);
    }
    if (container.querySelector("[data-js-pagination-sort]")) {
      this.setupSortListener();
    }
    const paginationCurrent = this.setCurrentPageFromURL();
    this.container.setAttribute("js-table-pagination--current", paginationCurrent);
    this.setPageNumberAttribute();
    this.tableRefresh();
    this.paginationButtons();
    this.handlePopstate();
    const instanceId = `pagination-${index}`;
    this.container.dataset.paginationInstance = instanceId;
    _Pagination.instances.set(instanceId, this);
  }
  static getInstance(instanceId) {
    return _Pagination.instances.get(instanceId);
  }
  setupSortListener() {
    const sortElement = this.container.querySelector("[data-js-pagination-sort] select");
    if (!sortElement) return;
    const lists = this.createSortedArrays();
    const event2 = new Event("change");
    let manuallyDispatchedEvent = true;
    sortElement.addEventListener("change", (e) => {
      const selectedValue = e.target?.value;
      if (selectedValue === "random") {
        this.list = lists.random;
      } else if (selectedValue === "alphabetical") {
        this.list = lists.alphabetical;
      } else {
        this.list = lists.default;
      }
      this.setSortedURLParam(selectedValue);
      if (!manuallyDispatchedEvent) {
        this.paginateSetCurrent(1);
      } else {
        manuallyDispatchedEvent = false;
      }
      this.tableRefresh();
    });
    this.setSortElementValueFromURL(sortElement);
    sortElement.dispatchEvent(event2);
  }
  createSortedArrays() {
    const alphabetical = [...this.container.querySelectorAll(`[data-js-pagination-item]`)].sort((a, b) => {
      const titleA = a.getAttribute("data-js-pagination-item-title") || "";
      const titleB = b.getAttribute("data-js-pagination-item-title") || "";
      return titleA.localeCompare(titleB);
    });
    const random = [...this.container.querySelectorAll(`[data-js-pagination-item]`)].sort(() => Math.random() - 0.5);
    return { "alphabetical": alphabetical, "random": random, "default": this.list };
  }
  setPageNumberAttribute() {
    if (this.list) {
      this.list.forEach((item, index) => {
        const pageNumber = Math.floor(index / this.attributes.perPage) + 1;
        item.setAttribute("data-js-pagination-page", pageNumber.toString());
      });
    }
  }
  getAttributes() {
    const perPage = this.paginationContainer?.getAttribute("data-js-pagination-per-page");
    const maxPages = this.paginationContainer?.getAttribute("data-js-pagination-max-pages");
    const randomize = this.paginationContainer?.hasAttribute("data-js-pagination-randomize-order");
    const keepDOM = this.paginationContainer?.hasAttribute("data-js-pagination-keep-dom");
    return {
      "perPage": perPage ? parseInt(perPage) : 10,
      "maxPages": maxPages ? parseInt(maxPages) : 0,
      "randomize": randomize,
      "keepDOM": keepDOM
    };
  }
  tableRefresh() {
    let list = this.paginateList(this.list);
    this.renderTable(list);
    this.paginatePages();
    this.paginationLinks();
    this.paginateLinkListeners();
  }
  renderTable(list = null) {
    const body = this.listContainer;
    if (!body || !list) return;
    if (this.attributes.keepDOM) {
      Array.from(body.children).forEach((element) => {
        if (!element.querySelector("[data-js-pagination-sort]")) {
          element.classList.add("u-display--none");
        }
      });
      list.forEach((element) => {
        element.classList.remove("u-display--none");
        body.appendChild(element);
      });
    } else {
      body.innerHTML = "";
      list?.forEach((element) => {
        body.appendChild(element);
      });
    }
  }
  paginatePages() {
    const numberOfPages = Math.ceil(this.list.length / this.attributes.perPage);
    if (this.attributes.maxPages && numberOfPages > this.attributes.maxPages) {
      return this.attributes.maxPages;
    }
    return numberOfPages;
  }
  paginationLinks() {
    if (!this.link) {
      this.link = this.container.querySelector(`[${this.indexLinks}]`);
      this.link?.classList.remove("c-pagination__item--is-active");
    }
    const body = this.container.querySelector(`[js-table-pagination--links]`);
    const navigation = this.container.querySelector("[data-js-pagination]");
    let pagesToShow = 0;
    if (navigation?.hasAttribute("data-js-pagination-pages-to-show")) {
      pagesToShow = parseInt(navigation.getAttribute("data-js-pagination-pages-to-show") ?? "0", 10);
      pagesToShow = pagesToShow % 2 === 0 ? pagesToShow : pagesToShow + 1;
    }
    this.paginationContainer?.classList.remove("u-display--none");
    if (!body) return;
    body.innerHTML = "";
    const numPages = this.paginatePages();
    const currentPage = this.paginationCurrent();
    if (numPages > 1) {
      let start = Math.max(currentPage - Math.floor(pagesToShow ? pagesToShow / 2 : 100), 1);
      let end = Math.min(currentPage + Math.floor(pagesToShow ? pagesToShow / 2 : 100), numPages);
      if (start === 1) {
        end = Math.min(numPages, start + (pagesToShow ? pagesToShow : 100));
      } else if (end === numPages) {
        start = Math.max(1, end - (pagesToShow ? pagesToShow : 100));
      }
      for (let index = start; index <= end; index++) {
        const elm = this.link?.cloneNode(true);
        elm.setAttribute(this.indexLinks, index.toString());
        elm.querySelector(".c-button__label-text").innerHTML = index.toString();
        elm.querySelector(".c-button").classList.remove("c-button__filled--primary");
        elm.querySelector(".c-button").classList.add("c-button__filled--default");
        if (index === currentPage) {
          elm.querySelector(".c-button").classList.add("c-button__filled--primary");
          elm.querySelector(".c-button").classList.remove("c-button__filled--default");
        }
        body.appendChild(elm);
      }
    } else {
      this.paginationContainer?.classList.add("u-display--none");
    }
  }
  paginateLinkListeners() {
    const btns = [...this.container.querySelectorAll(`[${this.indexLinks}]`)];
    btns.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        let next3 = e.target?.closest(`[${this.indexLinks}]`).getAttribute(this.indexLinks);
        next3 && this.paginateSetCurrent(parseInt(next3));
        this.tableRefresh();
        this.scrollToTop();
        this.setFocus();
      });
    });
  }
  scrollToTop() {
    let offset = document.querySelector(".c-header--sticky") ? 100 : 0;
    let elementPosition = this.container?.getBoundingClientRect().top ?? 0;
    let offsetPosition = elementPosition + window.pageYOffset - offset;
    window.scrollTo({
      top: offsetPosition
    });
  }
  setFocus() {
    let element = this.listContainer?.querySelector("[data-js-pagination-item]:first-child");
    if (!element) return;
    element.focus();
  }
  paginateList(list) {
    const first = (this.paginationCurrent() - 1) * this.attributes.perPage;
    const last = this.paginationCurrent() * this.attributes.perPage;
    return Array.from(list).slice(first, last);
  }
  paginationButtons() {
    this.container.querySelector(`[${this.nextBtn}]`)?.addEventListener("click", (e) => {
      e.preventDefault();
      if (this.paginationCurrent() != this.paginatePages()) {
        this.paginateSetCurrent(this.paginationCurrent() + 1);
        this.scrollToTop();
      }
      this.tableRefresh();
    });
    this.container.querySelector(`[${this.prevBtn}]`)?.addEventListener("click", (e) => {
      e.preventDefault();
      this.paginateSetCurrent(this.paginationCurrent() - 1);
      this.tableRefresh();
      this.scrollToTop();
    });
  }
  paginateSetCurrent(current = 1) {
    this.container.setAttribute("js-table-pagination--current", current.toString());
    this.container.querySelector(`[${this.nextBtn}]`)?.removeAttribute("disabled");
    this.container.querySelector(`[${this.prevBtn}]`)?.removeAttribute("disabled");
    if (current === this.paginatePages()) {
      this.container.querySelector(`[${this.nextBtn}]`)?.setAttribute("disabled", "true");
    } else if (current === 1) {
      this.container.querySelector(`[${this.prevBtn}]`)?.setAttribute("disabled", "true");
    }
    this.setPageURLParam();
  }
  paginationCurrent() {
    return parseInt(this.container.getAttribute("js-table-pagination--current") ?? "1", 10);
  }
  /* URL */
  setSortElementValueFromURL(sortElement) {
    const urlSearchParams = new URLSearchParams(window.location.search);
    const paginationSorting = urlSearchParams.get("sortby");
    if (paginationSorting && sortElement) {
      sortElement.value = paginationSorting;
    }
  }
  setSortedURLParam(selectedValue) {
    const urlSearchParams = new URLSearchParams(window.location.search);
    if (selectedValue) {
      urlSearchParams.set("sortby", selectedValue);
    } else {
      urlSearchParams.delete("sortby");
    }
    const updatedUrl = `${window.location.pathname}?${urlSearchParams.toString()}`;
    history.replaceState({}, "", updatedUrl);
  }
  setCurrentPageFromURL() {
    const urlSearchParams = new URLSearchParams(window.location.search);
    const pageNum = urlSearchParams.get("pagenum");
    return pageNum ? pageNum : "1";
  }
  setPageURLParam() {
    const urlSearchParams = new URLSearchParams(window.location.search);
    const pageNum = this.paginationCurrent();
    urlSearchParams.set("pagenum", pageNum.toString());
    const updatedUrl = `${window.location.pathname}?${urlSearchParams}`;
    history.pushState({}, "", updatedUrl);
  }
  handlePopstate() {
    window.addEventListener("popstate", (e) => {
      const urlSearchParams = new URLSearchParams(window.location.search);
      const pageNum = urlSearchParams.get("pagenum");
      if (pageNum !== this.paginationCurrent().toString()) {
        this.paginateSetCurrent(parseInt(pageNum || "1"));
        this.tableRefresh();
      }
    });
  }
};
__name(_Pagination, "Pagination");
__publicField(_Pagination, "instances", /* @__PURE__ */ new Map());
let Pagination = _Pagination;
function initializePagination() {
  const paginations = [...document.querySelectorAll("[data-js-pagination-target]")];
  paginations.forEach((pagination, index) => {
    new Pagination(pagination, index + 1);
  });
}
__name(initializePagination, "initializePagination");
const _ResizeByChildren = class _ResizeByChildren {
  constructor() {
    this.RESIZE = "js-resize-by-children";
    const resizeContainer = document.querySelectorAll(`[${this.RESIZE}]`);
    if (resizeContainer) {
      resizeContainer.forEach((item) => {
        item.classList.add("u-display--block");
        const currentChilds = item.querySelectorAll("li > a");
        const widthStack = [];
        currentChilds.forEach((child2) => {
          widthStack.push(child2.getBoundingClientRect().width);
        });
        const maxSize = Math.round(Math.max.apply(null, widthStack));
        if (item.getBoundingClientRect().width > maxSize) {
          item.setAttribute("style", "width:" + maxSize + "px !important;");
          item.dispatchEvent(new Event("resizeByChildren"));
        }
        item.classList.remove("u-display--block");
        item.classList.add(item.classList[0] + "--calculated");
      });
    }
  }
};
__name(_ResizeByChildren, "ResizeByChildren");
let ResizeByChildren = _ResizeByChildren;
const _KeepInViewPort = class _KeepInViewPort {
  constructor() {
    this.VIEWPORTRESIZE = "data-js-keep-in-viewport-after-resize";
    this.VIEWPORT = "data-js-keep-in-viewport";
    const ViewPortResizeContainer = document.querySelectorAll(`[${this.VIEWPORTRESIZE}]`);
    if (ViewPortResizeContainer) {
      ViewPortResizeContainer.forEach((item) => {
        item.addEventListener("resizeByChildren", _KeepInViewPort.resizeEvent);
      });
    }
    const ViewPortContainer = document.querySelectorAll(`[${this.VIEWPORT}]`);
    if (ViewPortContainer) {
      ViewPortContainer.forEach((item) => {
        _KeepInViewPort.moveInsideViewPort(item, 8);
      });
    }
  }
  /**
   * Keep the actual viewport function cleaned from event objects.
   * @param {object} event 
   * @return void
   */
  static resizeEvent(event2) {
    _KeepInViewPort.moveInsideViewPort(event2.target, 8);
  }
  /**
   * Move element inside viewport.
   * @param {object} element 
   * @param {integer} margin
   * @return void
   */
  static moveInsideViewPort(element, margin) {
    element.classList.add("u-display--block");
    const viewPortRightDistance = window.innerWidth - element.getBoundingClientRect().right;
    if (viewPortRightDistance < 0) {
      element.setAttribute("style", `${element.getAttribute("style")} left: ${viewPortRightDistance - margin}px;`);
    }
    element.classList.remove("u-display--block");
  }
};
__name(_KeepInViewPort, "KeepInViewPort");
let KeepInViewPort = _KeepInViewPort;
const _ButtonToggleContent = class _ButtonToggleContent {
  labelAttr;
  iconAttr;
  toggles;
  constructor() {
    this.labelAttr = "data-toggle-label";
    this.iconAttr = "data-toggle-icon";
    this.toggles = [];
    this.init();
    this.setupMutationObserver();
  }
  init() {
    this.toggles = Array.from(document.querySelectorAll(`[${this.labelAttr}], [${this.iconAttr}]`));
    this.toggles.forEach((toggle2) => {
      toggle2.addEventListener(
        "click",
        (event2) => this.handleToggleClick(toggle2, event2)
      );
    });
  }
  handleToggleClick = /* @__PURE__ */ __name((toggle2, event2) => {
    const labelAttrVal = toggle2.hasAttribute(this.labelAttr) ? toggle2.getAttribute(this.labelAttr) : null;
    const iconAttrVal = toggle2.hasAttribute(this.iconAttr) ? toggle2.getAttribute(this.iconAttr) : null;
    if (labelAttrVal) {
      const labelEl = toggle2.querySelector('[class*="c-button__label-text"]');
      if (labelEl) {
        const currentLabel = labelEl.innerHTML.trim();
        labelEl.innerHTML = labelAttrVal;
        toggle2.setAttribute(this.labelAttr, currentLabel);
        toggle2.setAttribute("aria-label", labelAttrVal);
      }
    }
    if (iconAttrVal) {
      const iconEl = toggle2.querySelector('[class*="c-icon"] > span');
      if (iconEl) {
        const currentIcon = iconEl.innerHTML.trim();
        iconEl.innerHTML = iconAttrVal;
        toggle2.setAttribute(this.iconAttr, currentIcon);
      }
    }
  }, "handleToggleClick");
  setupMutationObserver() {
    const observer = new MutationObserver((mutationsList) => {
      for (const mutation of mutationsList) {
        if (mutation.type === "childList") {
          const addedNodes = Array.from(mutation.addedNodes);
          const toggles = addedNodes.reduce((acc, node) => {
            if (node instanceof HTMLElement) {
              return [...acc, ...Array.from(node.querySelectorAll(`[${this.labelAttr}], [${this.iconAttr}]`))];
            } else {
              return acc;
            }
          }, []);
          toggles.forEach((toggle2) => {
            toggle2.addEventListener(
              "click",
              (event2) => this.handleToggleClick(toggle2, event2)
            );
          });
          this.toggles = [...this.toggles, ...toggles];
        }
      }
    });
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }
};
__name(_ButtonToggleContent, "ButtonToggleContent");
let ButtonToggleContent = _ButtonToggleContent;
const _StickyKeys = class _StickyKeys {
  constructor() {
    this.keyPressed = false;
    this.timeStamp = false;
    const inputTypes = [
      'input[type="checkbox"]',
      'input[type="email"]',
      'input[type="text"]',
      'input[type="date"]',
      'input[type="search"]',
      'input[type="datetime-local"]',
      'input[type="month"]',
      'input[type="number"]'
    ];
    this.subscribeInput(
      [
        ...document.querySelectorAll(
          inputTypes.join(", ")
        )
      ]
    );
  }
  subscribeInput(targetElements) {
    let arr = [];
    targetElements.forEach((input) => {
      input.addEventListener("keydown", (event2) => {
        if (event2.code !== "Backspace" && !event2.shiftKey && !event2.ctrlKey && !event2.altKey && !event2.metaKey) {
          if (event2.repeat) {
            this.handleInput(event2, 2e3);
          }
          if (!event2.repeat && arr.pop() === event2.key) {
            this.handleInput(event2, 500);
          }
        }
        arr.push(event2.key);
      });
    });
  }
  handleInput(event2, delay) {
    if (!this.timeStamp) {
      this.timeStamp = event2.timeStamp - 600;
    }
    if (event2.timeStamp >= this.timeStamp + delay) {
      this.timeStamp = event2.timeStamp;
    } else {
      event2.preventDefault();
    }
  }
};
__name(_StickyKeys, "StickyKeys");
let StickyKeys = _StickyKeys;
const _Hero = class _Hero {
  constructor() {
    this.heroVideos = document.querySelectorAll(".c-hero--video");
    this.isReduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    this.heroVideos.length && this.handleVideoPause();
  }
  handleVideoPause() {
    this.heroVideos.forEach((heroVideo) => {
      const video = new VideoControls(heroVideo);
      if (this.isReduced && this.isReduced.matches) {
        video.pauseVideo();
      }
    });
  }
};
__name(_Hero, "Hero");
let Hero = _Hero;
const _Tooltip = class _Tooltip {
  constructor() {
    this.setListener();
  }
  setListener() {
    const tooltips = document.querySelectorAll(".c-tooltip");
    if (tooltips.length > 0) {
      tooltips.forEach((tooltip) => {
        const container = tooltip.querySelector(".c-tooltip__container");
        const tooltipLabel = tooltip.querySelector(".c-tooltip__wrapper");
        ["mouseleave", "focusout"].forEach((key) => {
          tooltipLabel?.addEventListener(key, () => {
            this.handleLeave(tooltip, container);
          });
        });
        ["mouseenter", "focusin"].forEach((key) => {
          tooltipLabel?.addEventListener(key, () => {
            this.handleHover(tooltip, container, tooltipLabel);
          });
        });
      });
    }
  }
  handleLeave(tooltip, container) {
    this.handleClasses(tooltip, ["is-visible"], "is-hidden");
    container.setAttribute("aria-hidden", "true");
  }
  handleHover(tooltip, container, tooltipLabel) {
    const originalDirection = tooltip.getAttribute("original-placement");
    let tooltipWidth = parseInt(getComputedStyle(container).getPropertyValue("max-width"), 10);
    let position = tooltipLabel.getBoundingClientRect();
    if (!tooltip.classList.contains(originalDirection) || tooltip.classList.contains("c-tooltip--overflow-left") || tooltip.classList.contains("c-tooltip--overflow-right")) {
      this.resetDirection(tooltip, originalDirection);
    }
    if (position.right + tooltipWidth / (tooltip.classList.contains("c-tooltip--bottom") || tooltip.classList.contains("c-tooltip--top") ? 2 : 1) > document.documentElement.clientWidth) {
      this.overflowRight(tooltip);
    }
    if (position.left - tooltipWidth / (tooltip.classList.contains("c-tooltip--bottom") || tooltip.classList.contains("c-tooltip--top") ? 2 : 1) < 0) {
      this.overflowLeft(tooltip);
    }
    this.handleClasses(tooltip, ["is-hidden"], "is-visible");
    container.setAttribute("aria-hidden", "false");
  }
  overflowRight(tooltip) {
    if (tooltip.classList.contains("c-tooltip--right")) {
      this.handleClasses(tooltip, ["c-tooltip--right"], "c-tooltip--left");
    } else {
      this.handleClasses(tooltip, ["c-tooltip--overflow-left"], "c-tooltip--overflow-right");
    }
  }
  overflowLeft(tooltip) {
    if (tooltip.classList.contains("c-tooltip--left")) {
      this.handleClasses(tooltip, ["c-tooltip--left"], "c-tooltip--right");
    } else {
      this.handleClasses(tooltip, ["c-tooltip--overflow-right"], "c-tooltip--overflow-left");
    }
  }
  resetDirection(tooltip, originalDirection) {
    this.handleClasses(tooltip, ["c-tooltip--left", "c-tooltip--right", "c-tooltip--overflow-left", "c-tooltip--overflow-right"], originalDirection);
  }
  handleClasses(element, removeClasses, addClass2 = false) {
    removeClasses.forEach((className) => {
      element.classList.remove(className);
    });
    addClass2 && element.classList.add(addClass2);
  }
};
__name(_Tooltip, "Tooltip");
let Tooltip = _Tooltip;
const _Nav = class _Nav {
  targetItemSelector;
  constructor(menu) {
    this.targetItemSelector = ".c-nav__item.has-children.has-toggle";
    let selectorArray = [
      this.targetItemSelector,
      "> .c-nav__item-wrapper"
    ];
    if (menu.classList.contains("c-nav--vertical")) {
      selectorArray.push(".c-nav__toggle");
    }
    if (menu.classList.contains("c-nav--extended-dropdown")) {
      selectorArray.unshift(":scope ul");
      selectorArray.push(".c-nav__toggle, :scope > li.has-toggle > .c-nav__item-wrapper");
    }
    const items = [...menu.querySelectorAll(selectorArray.join(" "))];
    if (items.length > 0) {
      this.setListeners(items, menu);
    }
  }
  setListeners(items, menu) {
    items.forEach((item) => {
      item.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (menu.classList.contains("c-nav--horizontal")) {
          this.closeSiblings(item.closest(this.targetItemSelector));
        }
        this.toggleChildren(item.closest(this.targetItemSelector));
      });
    });
  }
  closeSiblings(clickItem) {
    const items = this.getSiblings(clickItem);
    items.forEach((item) => {
      item.classList.remove("is-open");
    });
    return true;
  }
  toggleChildren(toggle2) {
    if (!toggle2.classList.contains("is-open")) {
      this.openChildren(toggle2);
      return true;
    }
    this.closeChildren(toggle2);
    return false;
  }
  openChildren(toggle2) {
    toggle2.classList.add("is-open");
    toggle2.querySelector(".c-nav__toggle")?.setAttribute("aria-pressed", "true");
  }
  closeChildren(toggle2) {
    toggle2.classList.remove("is-open");
    toggle2.querySelector(".c-nav__toggle")?.setAttribute("aria-pressed", "false");
  }
  getSiblings(elem) {
    const siblings = [];
    let sibling = elem.parentNode?.firstChild;
    while (sibling) {
      if (sibling.nodeType === Node.ELEMENT_NODE && sibling !== elem) {
        siblings.push(sibling);
      }
      sibling = sibling.nextSibling;
    }
    return siblings;
  }
};
__name(_Nav, "Nav");
let Nav = _Nav;
function initializeMenus() {
  const menus = [...document.querySelectorAll(".c-nav.c-nav--depth-1")];
  menus.forEach((menu) => {
    new Nav(menu);
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === "childList" && mutation.addedNodes.length > 0 && (mutation.target?.classList?.contains("c-nav__item") || mutation.target?.classList?.contains("c-nav__extended-content"))) {
          [...mutation.addedNodes].forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE && node.classList?.contains("c-nav__child-container") && !node.querySelector(".c-nav.preloader")) {
              const element = node.classList.contains("c-nav") ? node : node.querySelector(".c-nav");
              if (element) {
                new Nav(element);
              }
            }
          });
        }
      });
    });
    observer.observe(menu, { childList: true, subtree: true });
  });
}
__name(initializeMenus, "initializeMenus");
const scrollContainer = document.querySelector("#scroll-spy");
let sectionElementPositions = [];
let headerHeight = 0;
const handleAnchorMenu = /* @__PURE__ */ __name(() => {
  const scrollItems = scrollContainer ? scrollContainer.querySelectorAll(".c-anchormenu__item") : [];
  if (!scrollContainer || scrollItems.length <= 0) {
    return;
  }
  const menuElements = [...scrollItems].filter((item) => document.querySelector(item.getAttribute("href")) ? item : item.remove());
  const sectionElements = [...scrollItems].map((item) => document.querySelector(item.getAttribute("href"))).filter((element) => element);
  sectionElements.length > 0 && setListeners(menuElements, sectionElements);
}, "handleAnchorMenu");
const setListeners = /* @__PURE__ */ __name((menuElements, sectionElements) => {
  if (sectionElements.length > 0) {
    window.addEventListener("resize", debounce(elementPositions, 300, sectionElements));
    let currentScroll = 0;
    window.addEventListener("scroll", () => {
      let scrollTop = window.scrollY;
      if (Math.abs(currentScroll - scrollTop > 10 || currentScroll - scrollTop < -10)) {
        handleScroll(menuElements);
        currentScroll = scrollTop;
      }
    });
  }
}, "setListeners");
const debounce = /* @__PURE__ */ __name((func, delay, sectionElements) => {
  let timer;
  func(sectionElements);
  return () => {
    timer ? clearTimeout(timer) : /* @__PURE__ */ (() => {
    })();
    timer = setTimeout(() => {
      func(sectionElements);
    }, delay);
  };
}, "debounce");
const elementPositions = /* @__PURE__ */ __name((sectionElements) => {
  const header = document.querySelector("#site-header");
  if (header && header.classList.contains("c-header--sticky")) {
    headerHeight = header.offsetHeight;
    scrollContainer.style.top = header.offsetHeight + "px";
  }
  const arr = sectionElements.map(function(sectionElement) {
    return { "position": window.scrollY + sectionElement.getBoundingClientRect().top, "height": sectionElement.getBoundingClientRect().height };
  });
  sectionElementPositions = arr;
}, "elementPositions");
const handleScroll = /* @__PURE__ */ __name((menuElements) => {
  let i = 0;
  sectionElementPositions.forEach((item) => {
    if (window.scrollY > item.position - (headerHeight + 120) && item.position + item.height - (headerHeight + 120) > window.scrollY) {
      menuElements[i].classList.add("is-active");
    } else {
      menuElements[i].classList.remove("is-active");
    }
    i++;
  });
}, "handleScroll");
const AnchorMenu = /* @__PURE__ */ __name(() => {
  handleAnchorMenu();
}, "AnchorMenu");
const _QuickLinksHeader = class _QuickLinksHeader {
  stickyQuickLinks;
  constructor() {
    this.stickyQuickLinks = document.querySelector("#quicklinks-header.c-header--sticky");
    this.init();
  }
  init() {
    if (!this.stickyQuickLinks) return;
    document.addEventListener("DOMContentLoaded", () => {
      this.observe();
    });
  }
  observe() {
    const observer = new IntersectionObserver(
      ([e]) => this.setClasses(e),
      { threshold: [1] }
    );
    if (this.stickyQuickLinks) {
      observer.observe(this.stickyQuickLinks);
    }
  }
  setClasses(event2) {
    if (event2.boundingClientRect.top <= 0) {
      event2.target.classList.add("is-stuck");
    } else {
      event2.target.classList.remove("is-stuck");
    }
  }
};
__name(_QuickLinksHeader, "QuickLinksHeader");
let QuickLinksHeader = _QuickLinksHeader;
document.addEventListener("touchstart", handleTouchStart, false);
document.addEventListener("touchmove", handleTouchMove, false);
const swipeUp = new CustomEvent("swipeUp", {
  bubbles: true
});
const swipeDown = new CustomEvent("swipeDown", {
  bubbles: true
});
const swipeRight = new CustomEvent("swipeRight", {
  bubbles: true
});
const swipeLeft = new CustomEvent("swipeLeft", {
  bubbles: true
});
var xDown = null;
var yDown = null;
function getTouches(evt) {
  return evt.touches || // browser API
  evt.originalEvent.touches;
}
__name(getTouches, "getTouches");
function handleTouchStart(evt) {
  const firstTouch = getTouches(evt)[0];
  xDown = firstTouch.clientX;
  yDown = firstTouch.clientY;
}
__name(handleTouchStart, "handleTouchStart");
function handleTouchMove(evt) {
  if (!xDown || !yDown) {
    return;
  }
  var xUp = evt.touches[0].clientX;
  var yUp = evt.touches[0].clientY;
  var xDiff = xDown - xUp;
  var yDiff = yDown - yUp;
  if (Math.abs(xDiff) > Math.abs(yDiff)) {
    if (xDiff > 0) {
      evt.target.dispatchEvent(swipeLeft);
    } else {
      evt.target.dispatchEvent(swipeRight);
    }
  } else {
    if (yDiff > 0) {
      evt.target.dispatchEvent(swipeUp);
    } else {
      evt.target.dispatchEvent(swipeDown);
    }
  }
  xDown = null;
  yDown = null;
}
__name(handleTouchMove, "handleTouchMove");
const moveToSelector = "[data-move-to]";
const moveToAttributeName = "data-move-to";
const canMoveTo = /* @__PURE__ */ __name((moveTo) => {
  return document.querySelector(moveToSelector) !== null;
}, "canMoveTo");
const moveElements = /* @__PURE__ */ __name((moveElement2) => {
  const elements = document.querySelectorAll(moveToSelector);
  elements.forEach((element) => {
    const moveToSelector2 = element.getAttribute(moveToAttributeName);
    if (canMoveTo()) {
      moveElement2(element, document.querySelector(moveToSelector2));
      element.removeAttribute(moveToAttributeName);
    }
  });
}, "moveElements");
const moveElement = /* @__PURE__ */ __name((element, target) => {
  target.appendChild(element);
}, "moveElement");
const _ClickAway = class _ClickAway {
  constructor(element, classesToRemove, removePressed) {
    this.element = element;
    this.classesToRemove = classesToRemove;
    this.removePressed = removePressed;
  }
  handleClickAway(target) {
    if (this.element.contains(target)) return;
    this.removeClasses();
  }
  removeClasses() {
    this.classesToRemove.forEach((className) => {
      if (this.element.classList.contains(className)) {
        this.element.classList.remove(className);
      }
    });
    if (this.element.hasAttribute("aria-pressed")) {
      this.element.setAttribute("aria-pressed", "false");
    }
    this.removePressed.forEach((element) => {
      element.setAttribute("aria-pressed", "false");
    });
  }
};
__name(_ClickAway, "ClickAway");
let ClickAway = _ClickAway;
function initializeClickAways() {
  let clickAwayInstances = [];
  document.querySelectorAll("[data-js-click-away]").forEach((element) => {
    const classesToRemove = element.getAttribute("data-js-click-away")?.split(",").map((className) => className.trim());
    if (!classesToRemove || classesToRemove.length <= 0) return;
    const removePressed = element.querySelectorAll("[aria-pressed][data-js-click-away-remove-pressed]");
    clickAwayInstances.push(new ClickAway(element, classesToRemove, removePressed));
  });
  if (clickAwayInstances.length <= 0) return;
  document.addEventListener("click", (e) => {
    const target = e.target;
    if (!target) return;
    clickAwayInstances.forEach((clickAwayInstance) => {
      clickAwayInstance.handleClickAway(target);
    });
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      clickAwayInstances.forEach((clickAwayInstance) => {
        clickAwayInstance.removeClasses();
      });
    }
  });
}
__name(initializeClickAways, "initializeClickAways");
const _AriaPressedToggler = class _AriaPressedToggler {
  constructor() {
    this.init();
    this.observe();
  }
  init() {
    const initElements = document.querySelectorAll("[aria-pressed='true'], [aria-pressed='false']");
    if (initElements.length) {
      initElements.forEach((element) => {
        this.applyOnClickEvent(element);
      });
    }
  }
  applyOnClickEvent(element) {
    element.addEventListener("click", () => {
      this.toggleAriaPressed(element);
    });
  }
  toggleAriaPressed(el) {
    const currentState = el.getAttribute("aria-pressed");
    const newState = currentState === "true" ? "false" : "true";
    el.setAttribute("aria-pressed", newState);
  }
  observe() {
    const container = document.documentElement || document.body;
    const observerOptions = {
      childList: true,
      subtree: true,
      attributeFilter: ["aria-pressed"]
    };
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === "childList") {
          mutation.addedNodes.forEach((node) => {
            if (node instanceof HTMLElement && node.getAttribute("aria-pressed")) {
              this.applyOnClickEvent(node);
            }
          });
        }
      });
    });
    observer.observe(container, observerOptions);
  }
};
__name(_AriaPressedToggler, "AriaPressedToggler");
let AriaPressedToggler = _AriaPressedToggler;
const _SimulateClick = class _SimulateClick {
  simulateClickAttr = "data-simulate-click";
  triggers = [];
  constructor() {
    this.init();
    this.observe();
  }
  init() {
    const initElements = document.querySelectorAll(`[${this.simulateClickAttr}]`);
    if (initElements.length) {
      initElements.forEach((element) => {
        const target = element.getAttribute(this.simulateClickAttr) ?? "";
        if (document.querySelectorAll(target).length) {
          this.applyOnClickEvent(element, target);
        }
      });
    }
  }
  applyOnClickEvent(element, target) {
    if (this.triggers.includes(element)) return;
    this.triggers.push(element);
    element.addEventListener("click", (event2) => {
      if (event2.target instanceof HTMLElement) {
        const targetElements = document.querySelectorAll(target);
        targetElements.forEach((targetElement) => {
          targetElement.click();
        });
      }
    });
  }
  observe() {
    const container = document.documentElement || document.body;
    const observerOptions = {
      childList: true,
      subtree: true,
      attributeFilter: [this.simulateClickAttr]
    };
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === "childList") {
          mutation.addedNodes.forEach((node) => {
            if (node instanceof HTMLElement && node.getAttribute(this.simulateClickAttr)) {
              const target = node.getAttribute(this.simulateClickAttr) ?? "";
              this.applyOnClickEvent(node, target);
            }
          });
        }
      });
    });
    observer.observe(container, observerOptions);
  }
};
__name(_SimulateClick, "SimulateClick");
let SimulateClick = _SimulateClick;
const _Select = class _Select {
  element;
  selectElement;
  dropdownElement;
  actionOverlayElement;
  dropdownOptionElements;
  clearButton;
  dropDownElement;
  expandLessIcon;
  expandMoreIcon;
  optionTemplate;
  placeholderText;
  searchFieldElement = null;
  constructor(element) {
    this.element = element;
    this.selectElement = this.getSelectElement();
    this.dropdownElement = this.getDropdownElement();
    this.actionOverlayElement = this.getActionOverlayElement();
    this.dropdownOptionElements = this.getDropdownOptionElements();
    this.dropDownElement = this.element.querySelector(`[${"data-js-dropdown-element"}]`);
    this.clearButton = this.element.querySelector(`[${"data-js-select-clear"}]`);
    this.expandLessIcon = this.element.querySelector(`.${"c-icon--expand-less"}`);
    this.expandMoreIcon = this.element.querySelector(`.${"c-icon--expand-more"}`);
    this.placeholderText = this.element.querySelector(`[${"data-js-placeholder"}]`)?.getAttribute(
      "data-js-placeholder"
      /* placeholderAttribute */
    ) || "";
    this.optionTemplate = this.element.querySelector("template");
    this.searchFieldElement = this.element.querySelector(`[${"data-js-select-search-input"}]`);
    this.setupEventListeners();
  }
  setupEventListeners() {
    this.setupOptionsObserver();
    this.selectElement.addEventListener("focusin", (e) => this.triggerDropdown(e));
    this.element.addEventListener("focusout", (e) => this.triggerBlurEvent(e));
    this.selectElement.addEventListener("change", () => this.disableMultiSelectOptionsWhenMaxSelectionsReached());
    this.selectElement.addEventListener("change", () => this.updatePlaceholderText());
    this.selectElement.addEventListener("change", () => this.setIsEmptyState());
    this.selectElement.addEventListener("change", () => this.updateClearButtonVisibilityState());
    this.selectElement.addEventListener("change", () => this.closeSingleSelectDropdown());
    this.actionOverlayElement.addEventListener("keydown", (event2) => this.openDropdownOnSpacebar(event2));
    this.clearButton?.addEventListener("click", () => this.setSingleSelectValue(null));
    this.element.addEventListener("classListChange", () => this.updateDropdownAriaStateOnTopElementClassListChange());
    this.element.addEventListener("classListChange", () => this.updateExpandIconsAriaStateOnTopElementClassListChange());
    this.actionOverlayElement.addEventListener("click", () => this.focusSearchInput());
    this.searchFieldElement?.addEventListener("input", (e) => this.handleSearchInput(e));
    this.runFunctionsRequiredForInitialization();
  }
  focusSearchInput() {
    if (this.searchFieldElement) {
      this.searchFieldElement.value = "";
      setTimeout(() => {
        this.searchFieldElement?.focus();
      }, 100);
    }
  }
  handleSearchInput(e) {
    const target = e.target;
    const searchTerm = target.value.toLowerCase().trim();
    const optionElements = this.dropdownElement.querySelectorAll(`[${"data-js-dropdown-option"}]`);
    let allHidden = true;
    optionElements.forEach((optionElement) => {
      const optionLabelElement = optionElement.querySelector(".c-select__option-label");
      const optionLabelText = optionLabelElement ? optionLabelElement.textContent?.toLowerCase() || "" : "";
      if (optionLabelText.includes(searchTerm)) {
        optionElement.style.display = "";
        allHidden = false;
      } else {
        optionElement.style.display = "none";
      }
    });
    if (allHidden) {
      this.element.classList.add("search-no-results");
    } else {
      this.element.classList.remove("search-no-results");
    }
  }
  isIos() {
    return this.element.classList.contains("is-ios");
  }
  isAndroid() {
    return this.element.classList.contains("is-android");
  }
  updateExpandIconsAriaStateOnTopElementClassListChange() {
    const isOpen = this.element.classList.contains("is-open");
    this.expandMoreIcon.setAttribute("aria-hidden", Boolean(isOpen).toString());
    this.expandLessIcon.setAttribute("aria-hidden", Boolean(!isOpen).toString());
  }
  updateDropdownAriaStateOnTopElementClassListChange() {
    const isOpen = this.element.classList.contains("is-open");
    this.dropDownElement.setAttribute("aria-hidden", Boolean(!isOpen).toString());
  }
  closeSingleSelectDropdown() {
    if (!this.isMultiSelect()) {
      const element = this.element.classList;
      if (element.contains("is-open")) {
        if (this.searchFieldElement) {
          this.searchFieldElement.value = "";
        }
        element.remove("is-open");
      }
    }
  }
  selectOptionOnElementClick(optionElement) {
    const newValue = optionElement.getAttribute(
      "data-js-dropdown-option"
      /* selectDropdownOptionElementAttribute */
    );
    if (newValue === null) {
      return;
    }
    if (this.isMultiSelect()) {
      this.setMultiSelectValue(newValue);
    } else {
      this.setSingleSelectValue(newValue);
    }
  }
  selectOptionOnDropdownOptionElementKeyDown(event2) {
    if (event2.key === "Enter" || event2.key === " ") {
      event2.preventDefault();
      event2.target.click();
    }
  }
  openDropdownOnSpacebar(event2) {
    if (event2.key === " ") {
      event2.preventDefault();
      this.actionOverlayElement.click();
    }
  }
  runFunctionsRequiredForInitialization() {
    this.disableMultiSelectOptionsWhenMaxSelectionsReached();
    this.updateSelectedItemsListeners();
    this.updateVisualRepresentation();
    this.setIsEmptyState();
    this.updateClearButtonVisibilityState();
    this.updatePlaceholderText();
    this.disableMultiSelectOptionsWhenMaxSelectionsReached();
    this.setupClassListChangeEventDispatcher();
  }
  setupClassListChangeEventDispatcher() {
    const classListChangeMutationObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => mutation.attributeName === "class" && mutation.target.dispatchEvent(new Event("classListChange")));
    });
    classListChangeMutationObserver.observe(this.element, { attributes: true });
  }
  // This function is used to trigger the dropdown the label is clicked
  triggerDropdown(e) {
    if (this.isIos() || this.isAndroid()) {
      return;
    }
    this.actionOverlayElement.click();
    this.actionOverlayElement.focus();
  }
  // This method is used to trigger the blur event on the select element when the focus is moved outside of it
  triggerBlurEvent(e) {
    const relatedTarget = e.relatedTarget;
    if (!relatedTarget || !this.element.contains(relatedTarget)) {
      this.selectElement.dispatchEvent(new Event("blur"));
    }
  }
  disableMultiSelectOptionsWhenMaxSelectionsReached() {
    if (!this.isMultiSelect()) return;
    const limitReached = this.maxSelectionsReached();
    const optionElements = this.selectElement.querySelectorAll("option");
    optionElements.forEach((optionElement) => {
      const disabled = limitReached && !optionElement.selected;
      const optionListElementSelector = `[${"data-js-dropdown-option"}="${optionElement.value}"]`;
      const optionListElement = this.dropdownElement.querySelector(optionListElementSelector);
      optionElement.disabled = disabled;
      optionListElement?.setAttribute("aria-disabled", disabled ? "true" : "false");
    });
  }
  updatePlaceholderText() {
    const optionElements = this.selectElement.querySelectorAll("option:checked");
    const placeholderText = Array.from(optionElements).map((option) => option.textContent?.trim()).join(", ");
    this.actionOverlayElement.textContent = Boolean(placeholderText) ? placeholderText : this.placeholderText;
  }
  updateSelectedItemsListeners(updatedVisualOptionsList = false) {
    const visualOptionsList = updatedVisualOptionsList ? updatedVisualOptionsList : this.getVisualOptionsList();
    if (visualOptionsList.length) {
      visualOptionsList.forEach((optionElement) => {
        optionElement.addEventListener("click", () => this.selectOptionOnElementClick(optionElement));
        optionElement.addEventListener("keydown", (event2) => this.selectOptionOnDropdownOptionElementKeyDown(event2));
      });
    }
  }
  updateClearButtonVisibilityState() {
    const clearButton = this.element.querySelector(`[${"data-js-select-clear"}]`);
    if (!clearButton) return;
    if (this.selectElement.value === "") {
      clearButton?.setAttribute("aria-hidden", "true");
    } else {
      clearButton?.setAttribute("aria-hidden", "false");
    }
  }
  setMultiSelectValue(newValue) {
    const selectedValues = this.getSelectedValues();
    if (selectedValues.includes(newValue)) {
      selectedValues.splice(selectedValues.indexOf(newValue), 1);
      this.deSelectOption(newValue);
    } else if (!this.maxSelectionsReached()) {
      selectedValues.push(newValue);
      this.selectOption(newValue);
    }
    selectedValues.forEach((value) => {
      const option = this.dropdownElement.querySelector(`[${"data-js-dropdown-option"}="${value}"]`);
      if (option instanceof HTMLElement) {
        option.classList.add(
          "is-selected"
          /* activeOptionCssClass */
        );
        option.setAttribute("aria-selected", "true");
      }
    });
    this.setIsEmptyState();
  }
  maxSelectionsReached() {
    const maxSelections = this.getMaxSelections();
    return maxSelections > 0 && this.getSelectedValues().length >= maxSelections;
  }
  getMaxSelections() {
    const maxSelections = this.selectElement.getAttribute(
      "data-js-select-max"
      /* maxSelectionsAttribute */
    );
    return maxSelections ? parseInt(maxSelections) : 0;
  }
  selectOption(value) {
    const option = this.getOptionElementByValue(value);
    if (option) {
      option.selected = true;
      option.setAttribute("selected", "selected");
      this.dispatchSelectChangeEvent();
    }
  }
  deSelectOption(value) {
    const option = this.getOptionElementByValue(value);
    if (option) {
      option.selected = false;
      option.removeAttribute("selected");
      this.dispatchSelectChangeEvent();
    }
  }
  getOptionElementByValue(value) {
    for (let i = 0; i < this.selectElement.options.length; i++) {
      const option = this.selectElement.options[i];
      if (option.value === value) {
        return option;
      }
    }
  }
  dispatchSelectChangeEvent() {
    this.selectElement.dispatchEvent(new Event("change"));
  }
  setSingleSelectValue(newValue) {
    this.selectElement.value = newValue || "";
    this.dispatchSelectChangeEvent();
  }
  setIsEmptyState() {
    if (this.selectElement.value === "") {
      this.element.classList.add(
        "is-empty"
        /* emptySelectCssClass */
      );
    } else {
      this.element.classList.remove(
        "is-empty"
        /* emptySelectCssClass */
      );
    }
  }
  updateVisualRepresentation() {
    this.selectElement.addEventListener("change", () => {
      this.resetDropdownElement(this.dropdownElement);
      const selectedValues = this.getSelectedValues();
      if (selectedValues.length) {
        selectedValues.forEach((value) => {
          const option = this.dropdownElement.querySelector(`[${"data-js-dropdown-option"}="${value}"]`);
          if (option instanceof HTMLElement) {
            option.classList.add(
              "is-selected"
              /* activeOptionCssClass */
            );
            option.setAttribute("aria-selected", "true");
          }
        });
      }
    });
  }
  resetDropdownElement(dropdownElement) {
    const options = dropdownElement.querySelectorAll(`[${"data-js-dropdown-option"}]`);
    if (options.length) {
      options.forEach((option) => {
        option.classList.remove(
          "is-selected"
          /* activeOptionCssClass */
        );
        option.setAttribute("aria-selected", "false");
      });
    }
  }
  setupOptionsObserver() {
    const observerOptions = {
      childList: true,
      subtree: true
    };
    let options = [];
    const optionsObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === "childList") {
          mutation.addedNodes.forEach((node) => {
            if (node instanceof HTMLOptionElement) {
              if (node.value) {
                options.push(node);
              }
            }
          });
        }
      });
      this.addNewOptionsToList(options);
      options = [];
    });
    optionsObserver.observe(this.selectElement, observerOptions);
  }
  addNewOptionsToList(options) {
    options.forEach((option) => {
      const optionTemplateClone = this.optionTemplate.content.cloneNode(true);
      const dropdownOptionElement = optionTemplateClone.querySelector(".c-select__option");
      if (!dropdownOptionElement || !optionTemplateClone) return;
      dropdownOptionElement.dataset.jsDropdownOption = option.value;
      dropdownOptionElement.classList.add("is-fetched");
      const optionLabelElement = optionTemplateClone.querySelector(".c-select__option-label");
      if (optionLabelElement) {
        optionLabelElement.textContent = option.textContent;
      }
      this.dropdownElement.appendChild(optionTemplateClone);
    });
    this.updateSelectedItemsListeners(this.getUpdatedVisualOptionsList());
  }
  getUpdatedVisualOptionsList() {
    return this.dropdownElement.querySelectorAll(`[${"data-js-dropdown-option"}].is-fetched`) ?? false;
  }
  getSelectedValues() {
    return this.isMultiSelect() ? Array.from(this.selectElement.selectedOptions).map((option) => option.value) : [this.selectElement.value];
  }
  getVisualOptionsList() {
    return this.dropdownElement.querySelectorAll(`[${"data-js-dropdown-option"}]`);
  }
  getSelectElement() {
    return this.element.querySelector(`[${"data-js-select-element"}]`);
  }
  isMultiSelect() {
    return this.selectElement.hasAttribute("multiple");
  }
  getDropdownElement() {
    return this.element.querySelector(`[${"data-js-dropdown-element"}]`);
  }
  getActionOverlayElement() {
    return this.element.querySelector(`[${"data-js-select-action-overlay"}]`);
  }
  getDropdownOptionElements() {
    return this.element.querySelectorAll(`[${"data-js-dropdown-option"}]`);
  }
};
__name(_Select, "Select");
let Select = _Select;
const _SelectComponentObserver = class _SelectComponentObserver {
  selectComponentElementAttribute = "data-js-select-component";
  //Add to main div of component
  constructor() {
    const container = document.documentElement || document.body;
    this.createInstance([...container.querySelectorAll(`[${this.selectComponentElementAttribute}]`)]);
  }
  observe() {
    const container = document.documentElement || document.body;
    const observerOptions = {
      childList: true,
      subtree: true
    };
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === "childList") {
          mutation.addedNodes.forEach((node) => {
            if (node instanceof HTMLElement) {
              let selects = [...node.querySelectorAll(`[${this.selectComponentElementAttribute}]`)];
              if (node.hasAttribute(this.selectComponentElementAttribute)) {
                selects.push(node);
              }
              this.createInstance(selects);
            }
          });
        }
      });
    });
    observer.observe(container, observerOptions);
  }
  createInstance(selects) {
    selects.forEach((select) => {
      new Select(select);
    });
  }
};
__name(_SelectComponentObserver, "SelectComponentObserver");
let SelectComponentObserver = _SelectComponentObserver;
function getDefaultExportFromCjs(x) {
  return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, "default") ? x["default"] : x;
}
__name(getDefaultExportFromCjs, "getDefaultExportFromCjs");
var leafletSrc$1 = { exports: {} };
var leafletSrc = leafletSrc$1.exports;
var hasRequiredLeafletSrc;
function requireLeafletSrc() {
  if (hasRequiredLeafletSrc) return leafletSrc$1.exports;
  hasRequiredLeafletSrc = 1;
  (function(module, exports$1) {
    (function(global, factory) {
      factory(exports$1);
    })(leafletSrc, (function(exports$12) {
      var version = "1.9.4";
      function extend(dest) {
        var i, j, len, src;
        for (j = 1, len = arguments.length; j < len; j++) {
          src = arguments[j];
          for (i in src) {
            dest[i] = src[i];
          }
        }
        return dest;
      }
      __name(extend, "extend");
      var create$2 = Object.create || /* @__PURE__ */ (function() {
        function F() {
        }
        __name(F, "F");
        return function(proto) {
          F.prototype = proto;
          return new F();
        };
      })();
      function bind(fn, obj) {
        var slice2 = Array.prototype.slice;
        if (fn.bind) {
          return fn.bind.apply(fn, slice2.call(arguments, 1));
        }
        var args = slice2.call(arguments, 2);
        return function() {
          return fn.apply(obj, args.length ? args.concat(slice2.call(arguments)) : arguments);
        };
      }
      __name(bind, "bind");
      var lastId = 0;
      function stamp(obj) {
        if (!("_leaflet_id" in obj)) {
          obj["_leaflet_id"] = ++lastId;
        }
        return obj._leaflet_id;
      }
      __name(stamp, "stamp");
      function throttle(fn, time, context) {
        var lock, args, wrapperFn, later;
        later = /* @__PURE__ */ __name(function() {
          lock = false;
          if (args) {
            wrapperFn.apply(context, args);
            args = false;
          }
        }, "later");
        wrapperFn = /* @__PURE__ */ __name(function() {
          if (lock) {
            args = arguments;
          } else {
            fn.apply(context, arguments);
            setTimeout(later, time);
            lock = true;
          }
        }, "wrapperFn");
        return wrapperFn;
      }
      __name(throttle, "throttle");
      function wrapNum(x, range, includeMax) {
        var max2 = range[1], min2 = range[0], d = max2 - min2;
        return x === max2 && includeMax ? x : ((x - min2) % d + d) % d + min2;
      }
      __name(wrapNum, "wrapNum");
      function falseFn() {
        return false;
      }
      __name(falseFn, "falseFn");
      function formatNum(num, precision) {
        if (precision === false) {
          return num;
        }
        var pow = Math.pow(10, precision === void 0 ? 6 : precision);
        return Math.round(num * pow) / pow;
      }
      __name(formatNum, "formatNum");
      function trim(str) {
        return str.trim ? str.trim() : str.replace(/^\s+|\s+$/g, "");
      }
      __name(trim, "trim");
      function splitWords(str) {
        return trim(str).split(/\s+/);
      }
      __name(splitWords, "splitWords");
      function setOptions(obj, options) {
        if (!Object.prototype.hasOwnProperty.call(obj, "options")) {
          obj.options = obj.options ? create$2(obj.options) : {};
        }
        for (var i in options) {
          obj.options[i] = options[i];
        }
        return obj.options;
      }
      __name(setOptions, "setOptions");
      function getParamString(obj, existingUrl, uppercase) {
        var params = [];
        for (var i in obj) {
          params.push(encodeURIComponent(uppercase ? i.toUpperCase() : i) + "=" + encodeURIComponent(obj[i]));
        }
        return (!existingUrl || existingUrl.indexOf("?") === -1 ? "?" : "&") + params.join("&");
      }
      __name(getParamString, "getParamString");
      var templateRe = /\{ *([\w_ -]+) *\}/g;
      function template(str, data) {
        return str.replace(templateRe, function(str2, key) {
          var value = data[key];
          if (value === void 0) {
            throw new Error("No value provided for variable " + str2);
          } else if (typeof value === "function") {
            value = value(data);
          }
          return value;
        });
      }
      __name(template, "template");
      var isArray2 = Array.isArray || function(obj) {
        return Object.prototype.toString.call(obj) === "[object Array]";
      };
      function indexOf(array, el) {
        for (var i = 0; i < array.length; i++) {
          if (array[i] === el) {
            return i;
          }
        }
        return -1;
      }
      __name(indexOf, "indexOf");
      var emptyImageUrl = "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=";
      function getPrefixed(name) {
        return window["webkit" + name] || window["moz" + name] || window["ms" + name];
      }
      __name(getPrefixed, "getPrefixed");
      var lastTime = 0;
      function timeoutDefer(fn) {
        var time = +/* @__PURE__ */ new Date(), timeToCall = Math.max(0, 16 - (time - lastTime));
        lastTime = time + timeToCall;
        return window.setTimeout(fn, timeToCall);
      }
      __name(timeoutDefer, "timeoutDefer");
      var requestFn = window.requestAnimationFrame || getPrefixed("RequestAnimationFrame") || timeoutDefer;
      var cancelFn = window.cancelAnimationFrame || getPrefixed("CancelAnimationFrame") || getPrefixed("CancelRequestAnimationFrame") || function(id) {
        window.clearTimeout(id);
      };
      function requestAnimFrame(fn, context, immediate) {
        if (immediate && requestFn === timeoutDefer) {
          fn.call(context);
        } else {
          return requestFn.call(window, bind(fn, context));
        }
      }
      __name(requestAnimFrame, "requestAnimFrame");
      function cancelAnimFrame(id) {
        if (id) {
          cancelFn.call(window, id);
        }
      }
      __name(cancelAnimFrame, "cancelAnimFrame");
      var Util = {
        __proto__: null,
        extend,
        create: create$2,
        bind,
        get lastId() {
          return lastId;
        },
        stamp,
        throttle,
        wrapNum,
        falseFn,
        formatNum,
        trim,
        splitWords,
        setOptions,
        getParamString,
        template,
        isArray: isArray2,
        indexOf,
        emptyImageUrl,
        requestFn,
        cancelFn,
        requestAnimFrame,
        cancelAnimFrame
      };
      function Class() {
      }
      __name(Class, "Class");
      Class.extend = function(props) {
        var NewClass = /* @__PURE__ */ __name(function() {
          setOptions(this);
          if (this.initialize) {
            this.initialize.apply(this, arguments);
          }
          this.callInitHooks();
        }, "NewClass");
        var parentProto = NewClass.__super__ = this.prototype;
        var proto = create$2(parentProto);
        proto.constructor = NewClass;
        NewClass.prototype = proto;
        for (var i in this) {
          if (Object.prototype.hasOwnProperty.call(this, i) && i !== "prototype" && i !== "__super__") {
            NewClass[i] = this[i];
          }
        }
        if (props.statics) {
          extend(NewClass, props.statics);
        }
        if (props.includes) {
          checkDeprecatedMixinEvents(props.includes);
          extend.apply(null, [proto].concat(props.includes));
        }
        extend(proto, props);
        delete proto.statics;
        delete proto.includes;
        if (proto.options) {
          proto.options = parentProto.options ? create$2(parentProto.options) : {};
          extend(proto.options, props.options);
        }
        proto._initHooks = [];
        proto.callInitHooks = function() {
          if (this._initHooksCalled) {
            return;
          }
          if (parentProto.callInitHooks) {
            parentProto.callInitHooks.call(this);
          }
          this._initHooksCalled = true;
          for (var i2 = 0, len = proto._initHooks.length; i2 < len; i2++) {
            proto._initHooks[i2].call(this);
          }
        };
        return NewClass;
      };
      Class.include = function(props) {
        var parentOptions = this.prototype.options;
        extend(this.prototype, props);
        if (props.options) {
          this.prototype.options = parentOptions;
          this.mergeOptions(props.options);
        }
        return this;
      };
      Class.mergeOptions = function(options) {
        extend(this.prototype.options, options);
        return this;
      };
      Class.addInitHook = function(fn) {
        var args = Array.prototype.slice.call(arguments, 1);
        var init2 = typeof fn === "function" ? fn : function() {
          this[fn].apply(this, args);
        };
        this.prototype._initHooks = this.prototype._initHooks || [];
        this.prototype._initHooks.push(init2);
        return this;
      };
      function checkDeprecatedMixinEvents(includes2) {
        if (typeof L === "undefined" || !L || !L.Mixin) {
          return;
        }
        includes2 = isArray2(includes2) ? includes2 : [includes2];
        for (var i = 0; i < includes2.length; i++) {
          if (includes2[i] === L.Mixin.Events) {
            console.warn("Deprecated include of L.Mixin.Events: this property will be removed in future releases, please inherit from L.Evented instead.", new Error().stack);
          }
        }
      }
      __name(checkDeprecatedMixinEvents, "checkDeprecatedMixinEvents");
      var Events = {
        /* @method on(type: String, fn: Function, context?: Object): this
         * Adds a listener function (`fn`) to a particular event type of the object. You can optionally specify the context of the listener (object the this keyword will point to). You can also pass several space-separated types (e.g. `'click dblclick'`).
         *
         * @alternative
         * @method on(eventMap: Object): this
         * Adds a set of type/listener pairs, e.g. `{click: onClick, mousemove: onMouseMove}`
         */
        on: /* @__PURE__ */ __name(function(types, fn, context) {
          if (typeof types === "object") {
            for (var type2 in types) {
              this._on(type2, types[type2], fn);
            }
          } else {
            types = splitWords(types);
            for (var i = 0, len = types.length; i < len; i++) {
              this._on(types[i], fn, context);
            }
          }
          return this;
        }, "on"),
        /* @method off(type: String, fn?: Function, context?: Object): this
         * Removes a previously added listener function. If no function is specified, it will remove all the listeners of that particular event from the object. Note that if you passed a custom context to `on`, you must pass the same context to `off` in order to remove the listener.
         *
         * @alternative
         * @method off(eventMap: Object): this
         * Removes a set of type/listener pairs.
         *
         * @alternative
         * @method off: this
         * Removes all listeners to all events on the object. This includes implicitly attached events.
         */
        off: /* @__PURE__ */ __name(function(types, fn, context) {
          if (!arguments.length) {
            delete this._events;
          } else if (typeof types === "object") {
            for (var type2 in types) {
              this._off(type2, types[type2], fn);
            }
          } else {
            types = splitWords(types);
            var removeAll = arguments.length === 1;
            for (var i = 0, len = types.length; i < len; i++) {
              if (removeAll) {
                this._off(types[i]);
              } else {
                this._off(types[i], fn, context);
              }
            }
          }
          return this;
        }, "off"),
        // attach listener (without syntactic sugar now)
        _on: /* @__PURE__ */ __name(function(type2, fn, context, _once) {
          if (typeof fn !== "function") {
            console.warn("wrong listener type: " + typeof fn);
            return;
          }
          if (this._listens(type2, fn, context) !== false) {
            return;
          }
          if (context === this) {
            context = void 0;
          }
          var newListener = { fn, ctx: context };
          if (_once) {
            newListener.once = true;
          }
          this._events = this._events || {};
          this._events[type2] = this._events[type2] || [];
          this._events[type2].push(newListener);
        }, "_on"),
        _off: /* @__PURE__ */ __name(function(type2, fn, context) {
          var listeners, i, len;
          if (!this._events) {
            return;
          }
          listeners = this._events[type2];
          if (!listeners) {
            return;
          }
          if (arguments.length === 1) {
            if (this._firingCount) {
              for (i = 0, len = listeners.length; i < len; i++) {
                listeners[i].fn = falseFn;
              }
            }
            delete this._events[type2];
            return;
          }
          if (typeof fn !== "function") {
            console.warn("wrong listener type: " + typeof fn);
            return;
          }
          var index2 = this._listens(type2, fn, context);
          if (index2 !== false) {
            var listener = listeners[index2];
            if (this._firingCount) {
              listener.fn = falseFn;
              this._events[type2] = listeners = listeners.slice();
            }
            listeners.splice(index2, 1);
          }
        }, "_off"),
        // @method fire(type: String, data?: Object, propagate?: Boolean): this
        // Fires an event of the specified type. You can optionally provide a data
        // object — the first argument of the listener function will contain its
        // properties. The event can optionally be propagated to event parents.
        fire: /* @__PURE__ */ __name(function(type2, data, propagate) {
          if (!this.listens(type2, propagate)) {
            return this;
          }
          var event2 = extend({}, data, {
            type: type2,
            target: this,
            sourceTarget: data && data.sourceTarget || this
          });
          if (this._events) {
            var listeners = this._events[type2];
            if (listeners) {
              this._firingCount = this._firingCount + 1 || 1;
              for (var i = 0, len = listeners.length; i < len; i++) {
                var l = listeners[i];
                var fn = l.fn;
                if (l.once) {
                  this.off(type2, fn, l.ctx);
                }
                fn.call(l.ctx || this, event2);
              }
              this._firingCount--;
            }
          }
          if (propagate) {
            this._propagateEvent(event2);
          }
          return this;
        }, "fire"),
        // @method listens(type: String, propagate?: Boolean): Boolean
        // @method listens(type: String, fn: Function, context?: Object, propagate?: Boolean): Boolean
        // Returns `true` if a particular event type has any listeners attached to it.
        // The verification can optionally be propagated, it will return `true` if parents have the listener attached to it.
        listens: /* @__PURE__ */ __name(function(type2, fn, context, propagate) {
          if (typeof type2 !== "string") {
            console.warn('"string" type argument expected');
          }
          var _fn = fn;
          if (typeof fn !== "function") {
            propagate = !!fn;
            _fn = void 0;
            context = void 0;
          }
          var listeners = this._events && this._events[type2];
          if (listeners && listeners.length) {
            if (this._listens(type2, _fn, context) !== false) {
              return true;
            }
          }
          if (propagate) {
            for (var id in this._eventParents) {
              if (this._eventParents[id].listens(type2, fn, context, propagate)) {
                return true;
              }
            }
          }
          return false;
        }, "listens"),
        // returns the index (number) or false
        _listens: /* @__PURE__ */ __name(function(type2, fn, context) {
          if (!this._events) {
            return false;
          }
          var listeners = this._events[type2] || [];
          if (!fn) {
            return !!listeners.length;
          }
          if (context === this) {
            context = void 0;
          }
          for (var i = 0, len = listeners.length; i < len; i++) {
            if (listeners[i].fn === fn && listeners[i].ctx === context) {
              return i;
            }
          }
          return false;
        }, "_listens"),
        // @method once(…): this
        // Behaves as [`on(…)`](#evented-on), except the listener will only get fired once and then removed.
        once: /* @__PURE__ */ __name(function(types, fn, context) {
          if (typeof types === "object") {
            for (var type2 in types) {
              this._on(type2, types[type2], fn, true);
            }
          } else {
            types = splitWords(types);
            for (var i = 0, len = types.length; i < len; i++) {
              this._on(types[i], fn, context, true);
            }
          }
          return this;
        }, "once"),
        // @method addEventParent(obj: Evented): this
        // Adds an event parent - an `Evented` that will receive propagated events
        addEventParent: /* @__PURE__ */ __name(function(obj) {
          this._eventParents = this._eventParents || {};
          this._eventParents[stamp(obj)] = obj;
          return this;
        }, "addEventParent"),
        // @method removeEventParent(obj: Evented): this
        // Removes an event parent, so it will stop receiving propagated events
        removeEventParent: /* @__PURE__ */ __name(function(obj) {
          if (this._eventParents) {
            delete this._eventParents[stamp(obj)];
          }
          return this;
        }, "removeEventParent"),
        _propagateEvent: /* @__PURE__ */ __name(function(e) {
          for (var id in this._eventParents) {
            this._eventParents[id].fire(e.type, extend({
              layer: e.target,
              propagatedFrom: e.target
            }, e), true);
          }
        }, "_propagateEvent")
      };
      Events.addEventListener = Events.on;
      Events.removeEventListener = Events.clearAllEventListeners = Events.off;
      Events.addOneTimeEventListener = Events.once;
      Events.fireEvent = Events.fire;
      Events.hasEventListeners = Events.listens;
      var Evented = Class.extend(Events);
      function Point(x, y, round) {
        this.x = round ? Math.round(x) : x;
        this.y = round ? Math.round(y) : y;
      }
      __name(Point, "Point");
      var trunc = Math.trunc || function(v) {
        return v > 0 ? Math.floor(v) : Math.ceil(v);
      };
      Point.prototype = {
        // @method clone(): Point
        // Returns a copy of the current point.
        clone: /* @__PURE__ */ __name(function() {
          return new Point(this.x, this.y);
        }, "clone"),
        // @method add(otherPoint: Point): Point
        // Returns the result of addition of the current and the given points.
        add: /* @__PURE__ */ __name(function(point) {
          return this.clone()._add(toPoint(point));
        }, "add"),
        _add: /* @__PURE__ */ __name(function(point) {
          this.x += point.x;
          this.y += point.y;
          return this;
        }, "_add"),
        // @method subtract(otherPoint: Point): Point
        // Returns the result of subtraction of the given point from the current.
        subtract: /* @__PURE__ */ __name(function(point) {
          return this.clone()._subtract(toPoint(point));
        }, "subtract"),
        _subtract: /* @__PURE__ */ __name(function(point) {
          this.x -= point.x;
          this.y -= point.y;
          return this;
        }, "_subtract"),
        // @method divideBy(num: Number): Point
        // Returns the result of division of the current point by the given number.
        divideBy: /* @__PURE__ */ __name(function(num) {
          return this.clone()._divideBy(num);
        }, "divideBy"),
        _divideBy: /* @__PURE__ */ __name(function(num) {
          this.x /= num;
          this.y /= num;
          return this;
        }, "_divideBy"),
        // @method multiplyBy(num: Number): Point
        // Returns the result of multiplication of the current point by the given number.
        multiplyBy: /* @__PURE__ */ __name(function(num) {
          return this.clone()._multiplyBy(num);
        }, "multiplyBy"),
        _multiplyBy: /* @__PURE__ */ __name(function(num) {
          this.x *= num;
          this.y *= num;
          return this;
        }, "_multiplyBy"),
        // @method scaleBy(scale: Point): Point
        // Multiply each coordinate of the current point by each coordinate of
        // `scale`. In linear algebra terms, multiply the point by the
        // [scaling matrix](https://en.wikipedia.org/wiki/Scaling_%28geometry%29#Matrix_representation)
        // defined by `scale`.
        scaleBy: /* @__PURE__ */ __name(function(point) {
          return new Point(this.x * point.x, this.y * point.y);
        }, "scaleBy"),
        // @method unscaleBy(scale: Point): Point
        // Inverse of `scaleBy`. Divide each coordinate of the current point by
        // each coordinate of `scale`.
        unscaleBy: /* @__PURE__ */ __name(function(point) {
          return new Point(this.x / point.x, this.y / point.y);
        }, "unscaleBy"),
        // @method round(): Point
        // Returns a copy of the current point with rounded coordinates.
        round: /* @__PURE__ */ __name(function() {
          return this.clone()._round();
        }, "round"),
        _round: /* @__PURE__ */ __name(function() {
          this.x = Math.round(this.x);
          this.y = Math.round(this.y);
          return this;
        }, "_round"),
        // @method floor(): Point
        // Returns a copy of the current point with floored coordinates (rounded down).
        floor: /* @__PURE__ */ __name(function() {
          return this.clone()._floor();
        }, "floor"),
        _floor: /* @__PURE__ */ __name(function() {
          this.x = Math.floor(this.x);
          this.y = Math.floor(this.y);
          return this;
        }, "_floor"),
        // @method ceil(): Point
        // Returns a copy of the current point with ceiled coordinates (rounded up).
        ceil: /* @__PURE__ */ __name(function() {
          return this.clone()._ceil();
        }, "ceil"),
        _ceil: /* @__PURE__ */ __name(function() {
          this.x = Math.ceil(this.x);
          this.y = Math.ceil(this.y);
          return this;
        }, "_ceil"),
        // @method trunc(): Point
        // Returns a copy of the current point with truncated coordinates (rounded towards zero).
        trunc: /* @__PURE__ */ __name(function() {
          return this.clone()._trunc();
        }, "trunc"),
        _trunc: /* @__PURE__ */ __name(function() {
          this.x = trunc(this.x);
          this.y = trunc(this.y);
          return this;
        }, "_trunc"),
        // @method distanceTo(otherPoint: Point): Number
        // Returns the cartesian distance between the current and the given points.
        distanceTo: /* @__PURE__ */ __name(function(point) {
          point = toPoint(point);
          var x = point.x - this.x, y = point.y - this.y;
          return Math.sqrt(x * x + y * y);
        }, "distanceTo"),
        // @method equals(otherPoint: Point): Boolean
        // Returns `true` if the given point has the same coordinates.
        equals: /* @__PURE__ */ __name(function(point) {
          point = toPoint(point);
          return point.x === this.x && point.y === this.y;
        }, "equals"),
        // @method contains(otherPoint: Point): Boolean
        // Returns `true` if both coordinates of the given point are less than the corresponding current point coordinates (in absolute values).
        contains: /* @__PURE__ */ __name(function(point) {
          point = toPoint(point);
          return Math.abs(point.x) <= Math.abs(this.x) && Math.abs(point.y) <= Math.abs(this.y);
        }, "contains"),
        // @method toString(): String
        // Returns a string representation of the point for debugging purposes.
        toString: /* @__PURE__ */ __name(function() {
          return "Point(" + formatNum(this.x) + ", " + formatNum(this.y) + ")";
        }, "toString")
      };
      function toPoint(x, y, round) {
        if (x instanceof Point) {
          return x;
        }
        if (isArray2(x)) {
          return new Point(x[0], x[1]);
        }
        if (x === void 0 || x === null) {
          return x;
        }
        if (typeof x === "object" && "x" in x && "y" in x) {
          return new Point(x.x, x.y);
        }
        return new Point(x, y, round);
      }
      __name(toPoint, "toPoint");
      function Bounds(a, b) {
        if (!a) {
          return;
        }
        var points = b ? [a, b] : a;
        for (var i = 0, len = points.length; i < len; i++) {
          this.extend(points[i]);
        }
      }
      __name(Bounds, "Bounds");
      Bounds.prototype = {
        // @method extend(point: Point): this
        // Extends the bounds to contain the given point.
        // @alternative
        // @method extend(otherBounds: Bounds): this
        // Extend the bounds to contain the given bounds
        extend: /* @__PURE__ */ __name(function(obj) {
          var min2, max2;
          if (!obj) {
            return this;
          }
          if (obj instanceof Point || typeof obj[0] === "number" || "x" in obj) {
            min2 = max2 = toPoint(obj);
          } else {
            obj = toBounds(obj);
            min2 = obj.min;
            max2 = obj.max;
            if (!min2 || !max2) {
              return this;
            }
          }
          if (!this.min && !this.max) {
            this.min = min2.clone();
            this.max = max2.clone();
          } else {
            this.min.x = Math.min(min2.x, this.min.x);
            this.max.x = Math.max(max2.x, this.max.x);
            this.min.y = Math.min(min2.y, this.min.y);
            this.max.y = Math.max(max2.y, this.max.y);
          }
          return this;
        }, "extend"),
        // @method getCenter(round?: Boolean): Point
        // Returns the center point of the bounds.
        getCenter: /* @__PURE__ */ __name(function(round) {
          return toPoint(
            (this.min.x + this.max.x) / 2,
            (this.min.y + this.max.y) / 2,
            round
          );
        }, "getCenter"),
        // @method getBottomLeft(): Point
        // Returns the bottom-left point of the bounds.
        getBottomLeft: /* @__PURE__ */ __name(function() {
          return toPoint(this.min.x, this.max.y);
        }, "getBottomLeft"),
        // @method getTopRight(): Point
        // Returns the top-right point of the bounds.
        getTopRight: /* @__PURE__ */ __name(function() {
          return toPoint(this.max.x, this.min.y);
        }, "getTopRight"),
        // @method getTopLeft(): Point
        // Returns the top-left point of the bounds (i.e. [`this.min`](#bounds-min)).
        getTopLeft: /* @__PURE__ */ __name(function() {
          return this.min;
        }, "getTopLeft"),
        // @method getBottomRight(): Point
        // Returns the bottom-right point of the bounds (i.e. [`this.max`](#bounds-max)).
        getBottomRight: /* @__PURE__ */ __name(function() {
          return this.max;
        }, "getBottomRight"),
        // @method getSize(): Point
        // Returns the size of the given bounds
        getSize: /* @__PURE__ */ __name(function() {
          return this.max.subtract(this.min);
        }, "getSize"),
        // @method contains(otherBounds: Bounds): Boolean
        // Returns `true` if the rectangle contains the given one.
        // @alternative
        // @method contains(point: Point): Boolean
        // Returns `true` if the rectangle contains the given point.
        contains: /* @__PURE__ */ __name(function(obj) {
          var min2, max2;
          if (typeof obj[0] === "number" || obj instanceof Point) {
            obj = toPoint(obj);
          } else {
            obj = toBounds(obj);
          }
          if (obj instanceof Bounds) {
            min2 = obj.min;
            max2 = obj.max;
          } else {
            min2 = max2 = obj;
          }
          return min2.x >= this.min.x && max2.x <= this.max.x && min2.y >= this.min.y && max2.y <= this.max.y;
        }, "contains"),
        // @method intersects(otherBounds: Bounds): Boolean
        // Returns `true` if the rectangle intersects the given bounds. Two bounds
        // intersect if they have at least one point in common.
        intersects: /* @__PURE__ */ __name(function(bounds) {
          bounds = toBounds(bounds);
          var min2 = this.min, max2 = this.max, min22 = bounds.min, max22 = bounds.max, xIntersects = max22.x >= min2.x && min22.x <= max2.x, yIntersects = max22.y >= min2.y && min22.y <= max2.y;
          return xIntersects && yIntersects;
        }, "intersects"),
        // @method overlaps(otherBounds: Bounds): Boolean
        // Returns `true` if the rectangle overlaps the given bounds. Two bounds
        // overlap if their intersection is an area.
        overlaps: /* @__PURE__ */ __name(function(bounds) {
          bounds = toBounds(bounds);
          var min2 = this.min, max2 = this.max, min22 = bounds.min, max22 = bounds.max, xOverlaps = max22.x > min2.x && min22.x < max2.x, yOverlaps = max22.y > min2.y && min22.y < max2.y;
          return xOverlaps && yOverlaps;
        }, "overlaps"),
        // @method isValid(): Boolean
        // Returns `true` if the bounds are properly initialized.
        isValid: /* @__PURE__ */ __name(function() {
          return !!(this.min && this.max);
        }, "isValid"),
        // @method pad(bufferRatio: Number): Bounds
        // Returns bounds created by extending or retracting the current bounds by a given ratio in each direction.
        // For example, a ratio of 0.5 extends the bounds by 50% in each direction.
        // Negative values will retract the bounds.
        pad: /* @__PURE__ */ __name(function(bufferRatio) {
          var min2 = this.min, max2 = this.max, heightBuffer = Math.abs(min2.x - max2.x) * bufferRatio, widthBuffer = Math.abs(min2.y - max2.y) * bufferRatio;
          return toBounds(
            toPoint(min2.x - heightBuffer, min2.y - widthBuffer),
            toPoint(max2.x + heightBuffer, max2.y + widthBuffer)
          );
        }, "pad"),
        // @method equals(otherBounds: Bounds): Boolean
        // Returns `true` if the rectangle is equivalent to the given bounds.
        equals: /* @__PURE__ */ __name(function(bounds) {
          if (!bounds) {
            return false;
          }
          bounds = toBounds(bounds);
          return this.min.equals(bounds.getTopLeft()) && this.max.equals(bounds.getBottomRight());
        }, "equals")
      };
      function toBounds(a, b) {
        if (!a || a instanceof Bounds) {
          return a;
        }
        return new Bounds(a, b);
      }
      __name(toBounds, "toBounds");
      function LatLngBounds(corner1, corner2) {
        if (!corner1) {
          return;
        }
        var latlngs = corner2 ? [corner1, corner2] : corner1;
        for (var i = 0, len = latlngs.length; i < len; i++) {
          this.extend(latlngs[i]);
        }
      }
      __name(LatLngBounds, "LatLngBounds");
      LatLngBounds.prototype = {
        // @method extend(latlng: LatLng): this
        // Extend the bounds to contain the given point
        // @alternative
        // @method extend(otherBounds: LatLngBounds): this
        // Extend the bounds to contain the given bounds
        extend: /* @__PURE__ */ __name(function(obj) {
          var sw = this._southWest, ne = this._northEast, sw2, ne2;
          if (obj instanceof LatLng) {
            sw2 = obj;
            ne2 = obj;
          } else if (obj instanceof LatLngBounds) {
            sw2 = obj._southWest;
            ne2 = obj._northEast;
            if (!sw2 || !ne2) {
              return this;
            }
          } else {
            return obj ? this.extend(toLatLng(obj) || toLatLngBounds(obj)) : this;
          }
          if (!sw && !ne) {
            this._southWest = new LatLng(sw2.lat, sw2.lng);
            this._northEast = new LatLng(ne2.lat, ne2.lng);
          } else {
            sw.lat = Math.min(sw2.lat, sw.lat);
            sw.lng = Math.min(sw2.lng, sw.lng);
            ne.lat = Math.max(ne2.lat, ne.lat);
            ne.lng = Math.max(ne2.lng, ne.lng);
          }
          return this;
        }, "extend"),
        // @method pad(bufferRatio: Number): LatLngBounds
        // Returns bounds created by extending or retracting the current bounds by a given ratio in each direction.
        // For example, a ratio of 0.5 extends the bounds by 50% in each direction.
        // Negative values will retract the bounds.
        pad: /* @__PURE__ */ __name(function(bufferRatio) {
          var sw = this._southWest, ne = this._northEast, heightBuffer = Math.abs(sw.lat - ne.lat) * bufferRatio, widthBuffer = Math.abs(sw.lng - ne.lng) * bufferRatio;
          return new LatLngBounds(
            new LatLng(sw.lat - heightBuffer, sw.lng - widthBuffer),
            new LatLng(ne.lat + heightBuffer, ne.lng + widthBuffer)
          );
        }, "pad"),
        // @method getCenter(): LatLng
        // Returns the center point of the bounds.
        getCenter: /* @__PURE__ */ __name(function() {
          return new LatLng(
            (this._southWest.lat + this._northEast.lat) / 2,
            (this._southWest.lng + this._northEast.lng) / 2
          );
        }, "getCenter"),
        // @method getSouthWest(): LatLng
        // Returns the south-west point of the bounds.
        getSouthWest: /* @__PURE__ */ __name(function() {
          return this._southWest;
        }, "getSouthWest"),
        // @method getNorthEast(): LatLng
        // Returns the north-east point of the bounds.
        getNorthEast: /* @__PURE__ */ __name(function() {
          return this._northEast;
        }, "getNorthEast"),
        // @method getNorthWest(): LatLng
        // Returns the north-west point of the bounds.
        getNorthWest: /* @__PURE__ */ __name(function() {
          return new LatLng(this.getNorth(), this.getWest());
        }, "getNorthWest"),
        // @method getSouthEast(): LatLng
        // Returns the south-east point of the bounds.
        getSouthEast: /* @__PURE__ */ __name(function() {
          return new LatLng(this.getSouth(), this.getEast());
        }, "getSouthEast"),
        // @method getWest(): Number
        // Returns the west longitude of the bounds
        getWest: /* @__PURE__ */ __name(function() {
          return this._southWest.lng;
        }, "getWest"),
        // @method getSouth(): Number
        // Returns the south latitude of the bounds
        getSouth: /* @__PURE__ */ __name(function() {
          return this._southWest.lat;
        }, "getSouth"),
        // @method getEast(): Number
        // Returns the east longitude of the bounds
        getEast: /* @__PURE__ */ __name(function() {
          return this._northEast.lng;
        }, "getEast"),
        // @method getNorth(): Number
        // Returns the north latitude of the bounds
        getNorth: /* @__PURE__ */ __name(function() {
          return this._northEast.lat;
        }, "getNorth"),
        // @method contains(otherBounds: LatLngBounds): Boolean
        // Returns `true` if the rectangle contains the given one.
        // @alternative
        // @method contains (latlng: LatLng): Boolean
        // Returns `true` if the rectangle contains the given point.
        contains: /* @__PURE__ */ __name(function(obj) {
          if (typeof obj[0] === "number" || obj instanceof LatLng || "lat" in obj) {
            obj = toLatLng(obj);
          } else {
            obj = toLatLngBounds(obj);
          }
          var sw = this._southWest, ne = this._northEast, sw2, ne2;
          if (obj instanceof LatLngBounds) {
            sw2 = obj.getSouthWest();
            ne2 = obj.getNorthEast();
          } else {
            sw2 = ne2 = obj;
          }
          return sw2.lat >= sw.lat && ne2.lat <= ne.lat && sw2.lng >= sw.lng && ne2.lng <= ne.lng;
        }, "contains"),
        // @method intersects(otherBounds: LatLngBounds): Boolean
        // Returns `true` if the rectangle intersects the given bounds. Two bounds intersect if they have at least one point in common.
        intersects: /* @__PURE__ */ __name(function(bounds) {
          bounds = toLatLngBounds(bounds);
          var sw = this._southWest, ne = this._northEast, sw2 = bounds.getSouthWest(), ne2 = bounds.getNorthEast(), latIntersects = ne2.lat >= sw.lat && sw2.lat <= ne.lat, lngIntersects = ne2.lng >= sw.lng && sw2.lng <= ne.lng;
          return latIntersects && lngIntersects;
        }, "intersects"),
        // @method overlaps(otherBounds: LatLngBounds): Boolean
        // Returns `true` if the rectangle overlaps the given bounds. Two bounds overlap if their intersection is an area.
        overlaps: /* @__PURE__ */ __name(function(bounds) {
          bounds = toLatLngBounds(bounds);
          var sw = this._southWest, ne = this._northEast, sw2 = bounds.getSouthWest(), ne2 = bounds.getNorthEast(), latOverlaps = ne2.lat > sw.lat && sw2.lat < ne.lat, lngOverlaps = ne2.lng > sw.lng && sw2.lng < ne.lng;
          return latOverlaps && lngOverlaps;
        }, "overlaps"),
        // @method toBBoxString(): String
        // Returns a string with bounding box coordinates in a 'southwest_lng,southwest_lat,northeast_lng,northeast_lat' format. Useful for sending requests to web services that return geo data.
        toBBoxString: /* @__PURE__ */ __name(function() {
          return [this.getWest(), this.getSouth(), this.getEast(), this.getNorth()].join(",");
        }, "toBBoxString"),
        // @method equals(otherBounds: LatLngBounds, maxMargin?: Number): Boolean
        // Returns `true` if the rectangle is equivalent (within a small margin of error) to the given bounds. The margin of error can be overridden by setting `maxMargin` to a small number.
        equals: /* @__PURE__ */ __name(function(bounds, maxMargin) {
          if (!bounds) {
            return false;
          }
          bounds = toLatLngBounds(bounds);
          return this._southWest.equals(bounds.getSouthWest(), maxMargin) && this._northEast.equals(bounds.getNorthEast(), maxMargin);
        }, "equals"),
        // @method isValid(): Boolean
        // Returns `true` if the bounds are properly initialized.
        isValid: /* @__PURE__ */ __name(function() {
          return !!(this._southWest && this._northEast);
        }, "isValid")
      };
      function toLatLngBounds(a, b) {
        if (a instanceof LatLngBounds) {
          return a;
        }
        return new LatLngBounds(a, b);
      }
      __name(toLatLngBounds, "toLatLngBounds");
      function LatLng(lat, lng, alt) {
        if (isNaN(lat) || isNaN(lng)) {
          throw new Error("Invalid LatLng object: (" + lat + ", " + lng + ")");
        }
        this.lat = +lat;
        this.lng = +lng;
        if (alt !== void 0) {
          this.alt = +alt;
        }
      }
      __name(LatLng, "LatLng");
      LatLng.prototype = {
        // @method equals(otherLatLng: LatLng, maxMargin?: Number): Boolean
        // Returns `true` if the given `LatLng` point is at the same position (within a small margin of error). The margin of error can be overridden by setting `maxMargin` to a small number.
        equals: /* @__PURE__ */ __name(function(obj, maxMargin) {
          if (!obj) {
            return false;
          }
          obj = toLatLng(obj);
          var margin = Math.max(
            Math.abs(this.lat - obj.lat),
            Math.abs(this.lng - obj.lng)
          );
          return margin <= (maxMargin === void 0 ? 1e-9 : maxMargin);
        }, "equals"),
        // @method toString(): String
        // Returns a string representation of the point (for debugging purposes).
        toString: /* @__PURE__ */ __name(function(precision) {
          return "LatLng(" + formatNum(this.lat, precision) + ", " + formatNum(this.lng, precision) + ")";
        }, "toString"),
        // @method distanceTo(otherLatLng: LatLng): Number
        // Returns the distance (in meters) to the given `LatLng` calculated using the [Spherical Law of Cosines](https://en.wikipedia.org/wiki/Spherical_law_of_cosines).
        distanceTo: /* @__PURE__ */ __name(function(other) {
          return Earth.distance(this, toLatLng(other));
        }, "distanceTo"),
        // @method wrap(): LatLng
        // Returns a new `LatLng` object with the longitude wrapped so it's always between -180 and +180 degrees.
        wrap: /* @__PURE__ */ __name(function() {
          return Earth.wrapLatLng(this);
        }, "wrap"),
        // @method toBounds(sizeInMeters: Number): LatLngBounds
        // Returns a new `LatLngBounds` object in which each boundary is `sizeInMeters/2` meters apart from the `LatLng`.
        toBounds: /* @__PURE__ */ __name(function(sizeInMeters) {
          var latAccuracy = 180 * sizeInMeters / 40075017, lngAccuracy = latAccuracy / Math.cos(Math.PI / 180 * this.lat);
          return toLatLngBounds(
            [this.lat - latAccuracy, this.lng - lngAccuracy],
            [this.lat + latAccuracy, this.lng + lngAccuracy]
          );
        }, "toBounds"),
        clone: /* @__PURE__ */ __name(function() {
          return new LatLng(this.lat, this.lng, this.alt);
        }, "clone")
      };
      function toLatLng(a, b, c) {
        if (a instanceof LatLng) {
          return a;
        }
        if (isArray2(a) && typeof a[0] !== "object") {
          if (a.length === 3) {
            return new LatLng(a[0], a[1], a[2]);
          }
          if (a.length === 2) {
            return new LatLng(a[0], a[1]);
          }
          return null;
        }
        if (a === void 0 || a === null) {
          return a;
        }
        if (typeof a === "object" && "lat" in a) {
          return new LatLng(a.lat, "lng" in a ? a.lng : a.lon, a.alt);
        }
        if (b === void 0) {
          return null;
        }
        return new LatLng(a, b, c);
      }
      __name(toLatLng, "toLatLng");
      var CRS = {
        // @method latLngToPoint(latlng: LatLng, zoom: Number): Point
        // Projects geographical coordinates into pixel coordinates for a given zoom.
        latLngToPoint: /* @__PURE__ */ __name(function(latlng, zoom2) {
          var projectedPoint = this.projection.project(latlng), scale2 = this.scale(zoom2);
          return this.transformation._transform(projectedPoint, scale2);
        }, "latLngToPoint"),
        // @method pointToLatLng(point: Point, zoom: Number): LatLng
        // The inverse of `latLngToPoint`. Projects pixel coordinates on a given
        // zoom into geographical coordinates.
        pointToLatLng: /* @__PURE__ */ __name(function(point, zoom2) {
          var scale2 = this.scale(zoom2), untransformedPoint = this.transformation.untransform(point, scale2);
          return this.projection.unproject(untransformedPoint);
        }, "pointToLatLng"),
        // @method project(latlng: LatLng): Point
        // Projects geographical coordinates into coordinates in units accepted for
        // this CRS (e.g. meters for EPSG:3857, for passing it to WMS services).
        project: /* @__PURE__ */ __name(function(latlng) {
          return this.projection.project(latlng);
        }, "project"),
        // @method unproject(point: Point): LatLng
        // Given a projected coordinate returns the corresponding LatLng.
        // The inverse of `project`.
        unproject: /* @__PURE__ */ __name(function(point) {
          return this.projection.unproject(point);
        }, "unproject"),
        // @method scale(zoom: Number): Number
        // Returns the scale used when transforming projected coordinates into
        // pixel coordinates for a particular zoom. For example, it returns
        // `256 * 2^zoom` for Mercator-based CRS.
        scale: /* @__PURE__ */ __name(function(zoom2) {
          return 256 * Math.pow(2, zoom2);
        }, "scale"),
        // @method zoom(scale: Number): Number
        // Inverse of `scale()`, returns the zoom level corresponding to a scale
        // factor of `scale`.
        zoom: /* @__PURE__ */ __name(function(scale2) {
          return Math.log(scale2 / 256) / Math.LN2;
        }, "zoom"),
        // @method getProjectedBounds(zoom: Number): Bounds
        // Returns the projection's bounds scaled and transformed for the provided `zoom`.
        getProjectedBounds: /* @__PURE__ */ __name(function(zoom2) {
          if (this.infinite) {
            return null;
          }
          var b = this.projection.bounds, s = this.scale(zoom2), min2 = this.transformation.transform(b.min, s), max2 = this.transformation.transform(b.max, s);
          return new Bounds(min2, max2);
        }, "getProjectedBounds"),
        // @method distance(latlng1: LatLng, latlng2: LatLng): Number
        // Returns the distance between two geographical coordinates.
        // @property code: String
        // Standard code name of the CRS passed into WMS services (e.g. `'EPSG:3857'`)
        //
        // @property wrapLng: Number[]
        // An array of two numbers defining whether the longitude (horizontal) coordinate
        // axis wraps around a given range and how. Defaults to `[-180, 180]` in most
        // geographical CRSs. If `undefined`, the longitude axis does not wrap around.
        //
        // @property wrapLat: Number[]
        // Like `wrapLng`, but for the latitude (vertical) axis.
        // wrapLng: [min, max],
        // wrapLat: [min, max],
        // @property infinite: Boolean
        // If true, the coordinate space will be unbounded (infinite in both axes)
        infinite: false,
        // @method wrapLatLng(latlng: LatLng): LatLng
        // Returns a `LatLng` where lat and lng has been wrapped according to the
        // CRS's `wrapLat` and `wrapLng` properties, if they are outside the CRS's bounds.
        wrapLatLng: /* @__PURE__ */ __name(function(latlng) {
          var lng = this.wrapLng ? wrapNum(latlng.lng, this.wrapLng, true) : latlng.lng, lat = this.wrapLat ? wrapNum(latlng.lat, this.wrapLat, true) : latlng.lat, alt = latlng.alt;
          return new LatLng(lat, lng, alt);
        }, "wrapLatLng"),
        // @method wrapLatLngBounds(bounds: LatLngBounds): LatLngBounds
        // Returns a `LatLngBounds` with the same size as the given one, ensuring
        // that its center is within the CRS's bounds.
        // Only accepts actual `L.LatLngBounds` instances, not arrays.
        wrapLatLngBounds: /* @__PURE__ */ __name(function(bounds) {
          var center = bounds.getCenter(), newCenter = this.wrapLatLng(center), latShift = center.lat - newCenter.lat, lngShift = center.lng - newCenter.lng;
          if (latShift === 0 && lngShift === 0) {
            return bounds;
          }
          var sw = bounds.getSouthWest(), ne = bounds.getNorthEast(), newSw = new LatLng(sw.lat - latShift, sw.lng - lngShift), newNe = new LatLng(ne.lat - latShift, ne.lng - lngShift);
          return new LatLngBounds(newSw, newNe);
        }, "wrapLatLngBounds")
      };
      var Earth = extend({}, CRS, {
        wrapLng: [-180, 180],
        // Mean Earth Radius, as recommended for use by
        // the International Union of Geodesy and Geophysics,
        // see https://rosettacode.org/wiki/Haversine_formula
        R: 6371e3,
        // distance between two geographical points using spherical law of cosines approximation
        distance: /* @__PURE__ */ __name(function(latlng1, latlng2) {
          var rad = Math.PI / 180, lat1 = latlng1.lat * rad, lat2 = latlng2.lat * rad, sinDLat = Math.sin((latlng2.lat - latlng1.lat) * rad / 2), sinDLon = Math.sin((latlng2.lng - latlng1.lng) * rad / 2), a = sinDLat * sinDLat + Math.cos(lat1) * Math.cos(lat2) * sinDLon * sinDLon, c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
          return this.R * c;
        }, "distance")
      });
      var earthRadius = 6378137;
      var SphericalMercator = {
        R: earthRadius,
        MAX_LATITUDE: 85.0511287798,
        project: /* @__PURE__ */ __name(function(latlng) {
          var d = Math.PI / 180, max2 = this.MAX_LATITUDE, lat = Math.max(Math.min(max2, latlng.lat), -max2), sin = Math.sin(lat * d);
          return new Point(
            this.R * latlng.lng * d,
            this.R * Math.log((1 + sin) / (1 - sin)) / 2
          );
        }, "project"),
        unproject: /* @__PURE__ */ __name(function(point) {
          var d = 180 / Math.PI;
          return new LatLng(
            (2 * Math.atan(Math.exp(point.y / this.R)) - Math.PI / 2) * d,
            point.x * d / this.R
          );
        }, "unproject"),
        bounds: (function() {
          var d = earthRadius * Math.PI;
          return new Bounds([-d, -d], [d, d]);
        })()
      };
      function Transformation(a, b, c, d) {
        if (isArray2(a)) {
          this._a = a[0];
          this._b = a[1];
          this._c = a[2];
          this._d = a[3];
          return;
        }
        this._a = a;
        this._b = b;
        this._c = c;
        this._d = d;
      }
      __name(Transformation, "Transformation");
      Transformation.prototype = {
        // @method transform(point: Point, scale?: Number): Point
        // Returns a transformed point, optionally multiplied by the given scale.
        // Only accepts actual `L.Point` instances, not arrays.
        transform: /* @__PURE__ */ __name(function(point, scale2) {
          return this._transform(point.clone(), scale2);
        }, "transform"),
        // destructive transform (faster)
        _transform: /* @__PURE__ */ __name(function(point, scale2) {
          scale2 = scale2 || 1;
          point.x = scale2 * (this._a * point.x + this._b);
          point.y = scale2 * (this._c * point.y + this._d);
          return point;
        }, "_transform"),
        // @method untransform(point: Point, scale?: Number): Point
        // Returns the reverse transformation of the given point, optionally divided
        // by the given scale. Only accepts actual `L.Point` instances, not arrays.
        untransform: /* @__PURE__ */ __name(function(point, scale2) {
          scale2 = scale2 || 1;
          return new Point(
            (point.x / scale2 - this._b) / this._a,
            (point.y / scale2 - this._d) / this._c
          );
        }, "untransform")
      };
      function toTransformation(a, b, c, d) {
        return new Transformation(a, b, c, d);
      }
      __name(toTransformation, "toTransformation");
      var EPSG3857 = extend({}, Earth, {
        code: "EPSG:3857",
        projection: SphericalMercator,
        transformation: (function() {
          var scale2 = 0.5 / (Math.PI * SphericalMercator.R);
          return toTransformation(scale2, 0.5, -scale2, 0.5);
        })()
      });
      var EPSG900913 = extend({}, EPSG3857, {
        code: "EPSG:900913"
      });
      function svgCreate(name) {
        return document.createElementNS("http://www.w3.org/2000/svg", name);
      }
      __name(svgCreate, "svgCreate");
      function pointsToPath(rings, closed) {
        var str = "", i, j, len, len2, points, p;
        for (i = 0, len = rings.length; i < len; i++) {
          points = rings[i];
          for (j = 0, len2 = points.length; j < len2; j++) {
            p = points[j];
            str += (j ? "L" : "M") + p.x + " " + p.y;
          }
          str += closed ? Browser.svg ? "z" : "x" : "";
        }
        return str || "M0 0";
      }
      __name(pointsToPath, "pointsToPath");
      var style2 = document.documentElement.style;
      var ie = "ActiveXObject" in window;
      var ielt9 = ie && !document.addEventListener;
      var edge = "msLaunchUri" in navigator && !("documentMode" in document);
      var webkit = userAgentContains("webkit");
      var android = userAgentContains("android");
      var android23 = userAgentContains("android 2") || userAgentContains("android 3");
      var webkitVer = parseInt(/WebKit\/([0-9]+)|$/.exec(navigator.userAgent)[1], 10);
      var androidStock = android && userAgentContains("Google") && webkitVer < 537 && !("AudioNode" in window);
      var opera = !!window.opera;
      var chrome = !edge && userAgentContains("chrome");
      var gecko = userAgentContains("gecko") && !webkit && !opera && !ie;
      var safari = !chrome && userAgentContains("safari");
      var phantom = userAgentContains("phantom");
      var opera12 = "OTransition" in style2;
      var win = navigator.platform.indexOf("Win") === 0;
      var ie3d = ie && "transition" in style2;
      var webkit3d = "WebKitCSSMatrix" in window && "m11" in new window.WebKitCSSMatrix() && !android23;
      var gecko3d = "MozPerspective" in style2;
      var any3d = !window.L_DISABLE_3D && (ie3d || webkit3d || gecko3d) && !opera12 && !phantom;
      var mobile = typeof orientation !== "undefined" || userAgentContains("mobile");
      var mobileWebkit = mobile && webkit;
      var mobileWebkit3d = mobile && webkit3d;
      var msPointer = !window.PointerEvent && window.MSPointerEvent;
      var pointer = !!(window.PointerEvent || msPointer);
      var touchNative = "ontouchstart" in window || !!window.TouchEvent;
      var touch = !window.L_NO_TOUCH && (touchNative || pointer);
      var mobileOpera = mobile && opera;
      var mobileGecko = mobile && gecko;
      var retina = (window.devicePixelRatio || window.screen.deviceXDPI / window.screen.logicalXDPI) > 1;
      var passiveEvents = (function() {
        var supportsPassiveOption = false;
        try {
          var opts = Object.defineProperty({}, "passive", {
            get: /* @__PURE__ */ __name(function() {
              supportsPassiveOption = true;
            }, "get")
          });
          window.addEventListener("testPassiveEventSupport", falseFn, opts);
          window.removeEventListener("testPassiveEventSupport", falseFn, opts);
        } catch (e) {
        }
        return supportsPassiveOption;
      })();
      var canvas$1 = (function() {
        return !!document.createElement("canvas").getContext;
      })();
      var svg$1 = !!(document.createElementNS && svgCreate("svg").createSVGRect);
      var inlineSvg = !!svg$1 && (function() {
        var div = document.createElement("div");
        div.innerHTML = "<svg/>";
        return (div.firstChild && div.firstChild.namespaceURI) === "http://www.w3.org/2000/svg";
      })();
      var vml = !svg$1 && (function() {
        try {
          var div = document.createElement("div");
          div.innerHTML = '<v:shape adj="1"/>';
          var shape = div.firstChild;
          shape.style.behavior = "url(#default#VML)";
          return shape && typeof shape.adj === "object";
        } catch (e) {
          return false;
        }
      })();
      var mac = navigator.platform.indexOf("Mac") === 0;
      var linux = navigator.platform.indexOf("Linux") === 0;
      function userAgentContains(str) {
        return navigator.userAgent.toLowerCase().indexOf(str) >= 0;
      }
      __name(userAgentContains, "userAgentContains");
      var Browser = {
        ie,
        ielt9,
        edge,
        webkit,
        android,
        android23,
        androidStock,
        opera,
        chrome,
        gecko,
        safari,
        phantom,
        opera12,
        win,
        ie3d,
        webkit3d,
        gecko3d,
        any3d,
        mobile,
        mobileWebkit,
        mobileWebkit3d,
        msPointer,
        pointer,
        touch,
        touchNative,
        mobileOpera,
        mobileGecko,
        retina,
        passiveEvents,
        canvas: canvas$1,
        svg: svg$1,
        vml,
        inlineSvg,
        mac,
        linux
      };
      var POINTER_DOWN = Browser.msPointer ? "MSPointerDown" : "pointerdown";
      var POINTER_MOVE = Browser.msPointer ? "MSPointerMove" : "pointermove";
      var POINTER_UP = Browser.msPointer ? "MSPointerUp" : "pointerup";
      var POINTER_CANCEL = Browser.msPointer ? "MSPointerCancel" : "pointercancel";
      var pEvent = {
        touchstart: POINTER_DOWN,
        touchmove: POINTER_MOVE,
        touchend: POINTER_UP,
        touchcancel: POINTER_CANCEL
      };
      var handle = {
        touchstart: _onPointerStart,
        touchmove: _handlePointer,
        touchend: _handlePointer,
        touchcancel: _handlePointer
      };
      var _pointers = {};
      var _pointerDocListener = false;
      function addPointerListener(obj, type2, handler) {
        if (type2 === "touchstart") {
          _addPointerDocListener();
        }
        if (!handle[type2]) {
          console.warn("wrong event specified:", type2);
          return falseFn;
        }
        handler = handle[type2].bind(this, handler);
        obj.addEventListener(pEvent[type2], handler, false);
        return handler;
      }
      __name(addPointerListener, "addPointerListener");
      function removePointerListener(obj, type2, handler) {
        if (!pEvent[type2]) {
          console.warn("wrong event specified:", type2);
          return;
        }
        obj.removeEventListener(pEvent[type2], handler, false);
      }
      __name(removePointerListener, "removePointerListener");
      function _globalPointerDown(e) {
        _pointers[e.pointerId] = e;
      }
      __name(_globalPointerDown, "_globalPointerDown");
      function _globalPointerMove(e) {
        if (_pointers[e.pointerId]) {
          _pointers[e.pointerId] = e;
        }
      }
      __name(_globalPointerMove, "_globalPointerMove");
      function _globalPointerUp(e) {
        delete _pointers[e.pointerId];
      }
      __name(_globalPointerUp, "_globalPointerUp");
      function _addPointerDocListener() {
        if (!_pointerDocListener) {
          document.addEventListener(POINTER_DOWN, _globalPointerDown, true);
          document.addEventListener(POINTER_MOVE, _globalPointerMove, true);
          document.addEventListener(POINTER_UP, _globalPointerUp, true);
          document.addEventListener(POINTER_CANCEL, _globalPointerUp, true);
          _pointerDocListener = true;
        }
      }
      __name(_addPointerDocListener, "_addPointerDocListener");
      function _handlePointer(handler, e) {
        if (e.pointerType === (e.MSPOINTER_TYPE_MOUSE || "mouse")) {
          return;
        }
        e.touches = [];
        for (var i in _pointers) {
          e.touches.push(_pointers[i]);
        }
        e.changedTouches = [e];
        handler(e);
      }
      __name(_handlePointer, "_handlePointer");
      function _onPointerStart(handler, e) {
        if (e.MSPOINTER_TYPE_TOUCH && e.pointerType === e.MSPOINTER_TYPE_TOUCH) {
          preventDefault(e);
        }
        _handlePointer(handler, e);
      }
      __name(_onPointerStart, "_onPointerStart");
      function makeDblclick(event2) {
        var newEvent = {}, prop, i;
        for (i in event2) {
          prop = event2[i];
          newEvent[i] = prop && prop.bind ? prop.bind(event2) : prop;
        }
        event2 = newEvent;
        newEvent.type = "dblclick";
        newEvent.detail = 2;
        newEvent.isTrusted = false;
        newEvent._simulated = true;
        return newEvent;
      }
      __name(makeDblclick, "makeDblclick");
      var delay = 200;
      function addDoubleTapListener(obj, handler) {
        obj.addEventListener("dblclick", handler);
        var last = 0, detail;
        function simDblclick(e) {
          if (e.detail !== 1) {
            detail = e.detail;
            return;
          }
          if (e.pointerType === "mouse" || e.sourceCapabilities && !e.sourceCapabilities.firesTouchEvents) {
            return;
          }
          var path = getPropagationPath(e);
          if (path.some(function(el) {
            return el instanceof HTMLLabelElement && el.attributes.for;
          }) && !path.some(function(el) {
            return el instanceof HTMLInputElement || el instanceof HTMLSelectElement;
          })) {
            return;
          }
          var now = Date.now();
          if (now - last <= delay) {
            detail++;
            if (detail === 2) {
              handler(makeDblclick(e));
            }
          } else {
            detail = 1;
          }
          last = now;
        }
        __name(simDblclick, "simDblclick");
        obj.addEventListener("click", simDblclick);
        return {
          dblclick: handler,
          simDblclick
        };
      }
      __name(addDoubleTapListener, "addDoubleTapListener");
      function removeDoubleTapListener(obj, handlers) {
        obj.removeEventListener("dblclick", handlers.dblclick);
        obj.removeEventListener("click", handlers.simDblclick);
      }
      __name(removeDoubleTapListener, "removeDoubleTapListener");
      var TRANSFORM = testProp(
        ["transform", "webkitTransform", "OTransform", "MozTransform", "msTransform"]
      );
      var TRANSITION = testProp(
        ["webkitTransition", "transition", "OTransition", "MozTransition", "msTransition"]
      );
      var TRANSITION_END = TRANSITION === "webkitTransition" || TRANSITION === "OTransition" ? TRANSITION + "End" : "transitionend";
      function get(id) {
        return typeof id === "string" ? document.getElementById(id) : id;
      }
      __name(get, "get");
      function getStyle(el, style3) {
        var value = el.style[style3] || el.currentStyle && el.currentStyle[style3];
        if ((!value || value === "auto") && document.defaultView) {
          var css = document.defaultView.getComputedStyle(el, null);
          value = css ? css[style3] : null;
        }
        return value === "auto" ? null : value;
      }
      __name(getStyle, "getStyle");
      function create$1(tagName, className, container) {
        var el = document.createElement(tagName);
        el.className = className || "";
        if (container) {
          container.appendChild(el);
        }
        return el;
      }
      __name(create$1, "create$1");
      function remove2(el) {
        var parent = el.parentNode;
        if (parent) {
          parent.removeChild(el);
        }
      }
      __name(remove2, "remove");
      function empty2(el) {
        while (el.firstChild) {
          el.removeChild(el.firstChild);
        }
      }
      __name(empty2, "empty");
      function toFront(el) {
        var parent = el.parentNode;
        if (parent && parent.lastChild !== el) {
          parent.appendChild(el);
        }
      }
      __name(toFront, "toFront");
      function toBack(el) {
        var parent = el.parentNode;
        if (parent && parent.firstChild !== el) {
          parent.insertBefore(el, parent.firstChild);
        }
      }
      __name(toBack, "toBack");
      function hasClass2(el, name) {
        if (el.classList !== void 0) {
          return el.classList.contains(name);
        }
        var className = getClass(el);
        return className.length > 0 && new RegExp("(^|\\s)" + name + "(\\s|$)").test(className);
      }
      __name(hasClass2, "hasClass");
      function addClass2(el, name) {
        if (el.classList !== void 0) {
          var classes = splitWords(name);
          for (var i = 0, len = classes.length; i < len; i++) {
            el.classList.add(classes[i]);
          }
        } else if (!hasClass2(el, name)) {
          var className = getClass(el);
          setClass(el, (className ? className + " " : "") + name);
        }
      }
      __name(addClass2, "addClass");
      function removeClass2(el, name) {
        if (el.classList !== void 0) {
          el.classList.remove(name);
        } else {
          setClass(el, trim((" " + getClass(el) + " ").replace(" " + name + " ", " ")));
        }
      }
      __name(removeClass2, "removeClass");
      function setClass(el, name) {
        if (el.className.baseVal === void 0) {
          el.className = name;
        } else {
          el.className.baseVal = name;
        }
      }
      __name(setClass, "setClass");
      function getClass(el) {
        if (el.correspondingElement) {
          el = el.correspondingElement;
        }
        return el.className.baseVal === void 0 ? el.className : el.className.baseVal;
      }
      __name(getClass, "getClass");
      function setOpacity(el, value) {
        if ("opacity" in el.style) {
          el.style.opacity = value;
        } else if ("filter" in el.style) {
          _setOpacityIE(el, value);
        }
      }
      __name(setOpacity, "setOpacity");
      function _setOpacityIE(el, value) {
        var filter = false, filterName = "DXImageTransform.Microsoft.Alpha";
        try {
          filter = el.filters.item(filterName);
        } catch (e) {
          if (value === 1) {
            return;
          }
        }
        value = Math.round(value * 100);
        if (filter) {
          filter.Enabled = value !== 100;
          filter.Opacity = value;
        } else {
          el.style.filter += " progid:" + filterName + "(opacity=" + value + ")";
        }
      }
      __name(_setOpacityIE, "_setOpacityIE");
      function testProp(props) {
        var style3 = document.documentElement.style;
        for (var i = 0; i < props.length; i++) {
          if (props[i] in style3) {
            return props[i];
          }
        }
        return false;
      }
      __name(testProp, "testProp");
      function setTransform(el, offset, scale2) {
        var pos = offset || new Point(0, 0);
        el.style[TRANSFORM] = (Browser.ie3d ? "translate(" + pos.x + "px," + pos.y + "px)" : "translate3d(" + pos.x + "px," + pos.y + "px,0)") + (scale2 ? " scale(" + scale2 + ")" : "");
      }
      __name(setTransform, "setTransform");
      function setPosition(el, point) {
        el._leaflet_pos = point;
        if (Browser.any3d) {
          setTransform(el, point);
        } else {
          el.style.left = point.x + "px";
          el.style.top = point.y + "px";
        }
      }
      __name(setPosition, "setPosition");
      function getPosition(el) {
        return el._leaflet_pos || new Point(0, 0);
      }
      __name(getPosition, "getPosition");
      var disableTextSelection;
      var enableTextSelection;
      var _userSelect;
      if ("onselectstart" in document) {
        disableTextSelection = /* @__PURE__ */ __name(function() {
          on(window, "selectstart", preventDefault);
        }, "disableTextSelection");
        enableTextSelection = /* @__PURE__ */ __name(function() {
          off(window, "selectstart", preventDefault);
        }, "enableTextSelection");
      } else {
        var userSelectProperty = testProp(
          ["userSelect", "WebkitUserSelect", "OUserSelect", "MozUserSelect", "msUserSelect"]
        );
        disableTextSelection = /* @__PURE__ */ __name(function() {
          if (userSelectProperty) {
            var style3 = document.documentElement.style;
            _userSelect = style3[userSelectProperty];
            style3[userSelectProperty] = "none";
          }
        }, "disableTextSelection");
        enableTextSelection = /* @__PURE__ */ __name(function() {
          if (userSelectProperty) {
            document.documentElement.style[userSelectProperty] = _userSelect;
            _userSelect = void 0;
          }
        }, "enableTextSelection");
      }
      function disableImageDrag() {
        on(window, "dragstart", preventDefault);
      }
      __name(disableImageDrag, "disableImageDrag");
      function enableImageDrag() {
        off(window, "dragstart", preventDefault);
      }
      __name(enableImageDrag, "enableImageDrag");
      var _outlineElement, _outlineStyle;
      function preventOutline(element) {
        while (element.tabIndex === -1) {
          element = element.parentNode;
        }
        if (!element.style) {
          return;
        }
        restoreOutline();
        _outlineElement = element;
        _outlineStyle = element.style.outlineStyle;
        element.style.outlineStyle = "none";
        on(window, "keydown", restoreOutline);
      }
      __name(preventOutline, "preventOutline");
      function restoreOutline() {
        if (!_outlineElement) {
          return;
        }
        _outlineElement.style.outlineStyle = _outlineStyle;
        _outlineElement = void 0;
        _outlineStyle = void 0;
        off(window, "keydown", restoreOutline);
      }
      __name(restoreOutline, "restoreOutline");
      function getSizedParentNode(element) {
        do {
          element = element.parentNode;
        } while ((!element.offsetWidth || !element.offsetHeight) && element !== document.body);
        return element;
      }
      __name(getSizedParentNode, "getSizedParentNode");
      function getScale(element) {
        var rect2 = element.getBoundingClientRect();
        return {
          x: rect2.width / element.offsetWidth || 1,
          y: rect2.height / element.offsetHeight || 1,
          boundingClientRect: rect2
        };
      }
      __name(getScale, "getScale");
      var DomUtil = {
        __proto__: null,
        TRANSFORM,
        TRANSITION,
        TRANSITION_END,
        get,
        getStyle,
        create: create$1,
        remove: remove2,
        empty: empty2,
        toFront,
        toBack,
        hasClass: hasClass2,
        addClass: addClass2,
        removeClass: removeClass2,
        setClass,
        getClass,
        setOpacity,
        testProp,
        setTransform,
        setPosition,
        getPosition,
        get disableTextSelection() {
          return disableTextSelection;
        },
        get enableTextSelection() {
          return enableTextSelection;
        },
        disableImageDrag,
        enableImageDrag,
        preventOutline,
        restoreOutline,
        getSizedParentNode,
        getScale
      };
      function on(obj, types, fn, context) {
        if (types && typeof types === "object") {
          for (var type2 in types) {
            addOne(obj, type2, types[type2], fn);
          }
        } else {
          types = splitWords(types);
          for (var i = 0, len = types.length; i < len; i++) {
            addOne(obj, types[i], fn, context);
          }
        }
        return this;
      }
      __name(on, "on");
      var eventsKey = "_leaflet_events";
      function off(obj, types, fn, context) {
        if (arguments.length === 1) {
          batchRemove(obj);
          delete obj[eventsKey];
        } else if (types && typeof types === "object") {
          for (var type2 in types) {
            removeOne(obj, type2, types[type2], fn);
          }
        } else {
          types = splitWords(types);
          if (arguments.length === 2) {
            batchRemove(obj, function(type3) {
              return indexOf(types, type3) !== -1;
            });
          } else {
            for (var i = 0, len = types.length; i < len; i++) {
              removeOne(obj, types[i], fn, context);
            }
          }
        }
        return this;
      }
      __name(off, "off");
      function batchRemove(obj, filterFn) {
        for (var id in obj[eventsKey]) {
          var type2 = id.split(/\d/)[0];
          if (!filterFn || filterFn(type2)) {
            removeOne(obj, type2, null, null, id);
          }
        }
      }
      __name(batchRemove, "batchRemove");
      var mouseSubst = {
        mouseenter: "mouseover",
        mouseleave: "mouseout",
        wheel: !("onwheel" in window) && "mousewheel"
      };
      function addOne(obj, type2, fn, context) {
        var id = type2 + stamp(fn) + (context ? "_" + stamp(context) : "");
        if (obj[eventsKey] && obj[eventsKey][id]) {
          return this;
        }
        var handler = /* @__PURE__ */ __name(function(e) {
          return fn.call(context || obj, e || window.event);
        }, "handler");
        var originalHandler = handler;
        if (!Browser.touchNative && Browser.pointer && type2.indexOf("touch") === 0) {
          handler = addPointerListener(obj, type2, handler);
        } else if (Browser.touch && type2 === "dblclick") {
          handler = addDoubleTapListener(obj, handler);
        } else if ("addEventListener" in obj) {
          if (type2 === "touchstart" || type2 === "touchmove" || type2 === "wheel" || type2 === "mousewheel") {
            obj.addEventListener(mouseSubst[type2] || type2, handler, Browser.passiveEvents ? { passive: false } : false);
          } else if (type2 === "mouseenter" || type2 === "mouseleave") {
            handler = /* @__PURE__ */ __name(function(e) {
              e = e || window.event;
              if (isExternalTarget(obj, e)) {
                originalHandler(e);
              }
            }, "handler");
            obj.addEventListener(mouseSubst[type2], handler, false);
          } else {
            obj.addEventListener(type2, originalHandler, false);
          }
        } else {
          obj.attachEvent("on" + type2, handler);
        }
        obj[eventsKey] = obj[eventsKey] || {};
        obj[eventsKey][id] = handler;
      }
      __name(addOne, "addOne");
      function removeOne(obj, type2, fn, context, id) {
        id = id || type2 + stamp(fn) + (context ? "_" + stamp(context) : "");
        var handler = obj[eventsKey] && obj[eventsKey][id];
        if (!handler) {
          return this;
        }
        if (!Browser.touchNative && Browser.pointer && type2.indexOf("touch") === 0) {
          removePointerListener(obj, type2, handler);
        } else if (Browser.touch && type2 === "dblclick") {
          removeDoubleTapListener(obj, handler);
        } else if ("removeEventListener" in obj) {
          obj.removeEventListener(mouseSubst[type2] || type2, handler, false);
        } else {
          obj.detachEvent("on" + type2, handler);
        }
        obj[eventsKey][id] = null;
      }
      __name(removeOne, "removeOne");
      function stopPropagation(e) {
        if (e.stopPropagation) {
          e.stopPropagation();
        } else if (e.originalEvent) {
          e.originalEvent._stopped = true;
        } else {
          e.cancelBubble = true;
        }
        return this;
      }
      __name(stopPropagation, "stopPropagation");
      function disableScrollPropagation(el) {
        addOne(el, "wheel", stopPropagation);
        return this;
      }
      __name(disableScrollPropagation, "disableScrollPropagation");
      function disableClickPropagation(el) {
        on(el, "mousedown touchstart dblclick contextmenu", stopPropagation);
        el["_leaflet_disable_click"] = true;
        return this;
      }
      __name(disableClickPropagation, "disableClickPropagation");
      function preventDefault(e) {
        if (e.preventDefault) {
          e.preventDefault();
        } else {
          e.returnValue = false;
        }
        return this;
      }
      __name(preventDefault, "preventDefault");
      function stop(e) {
        preventDefault(e);
        stopPropagation(e);
        return this;
      }
      __name(stop, "stop");
      function getPropagationPath(ev) {
        if (ev.composedPath) {
          return ev.composedPath();
        }
        var path = [];
        var el = ev.target;
        while (el) {
          path.push(el);
          el = el.parentNode;
        }
        return path;
      }
      __name(getPropagationPath, "getPropagationPath");
      function getMousePosition(e, container) {
        if (!container) {
          return new Point(e.clientX, e.clientY);
        }
        var scale2 = getScale(container), offset = scale2.boundingClientRect;
        return new Point(
          // offset.left/top values are in page scale (like clientX/Y),
          // whereas clientLeft/Top (border width) values are the original values (before CSS scale applies).
          (e.clientX - offset.left) / scale2.x - container.clientLeft,
          (e.clientY - offset.top) / scale2.y - container.clientTop
        );
      }
      __name(getMousePosition, "getMousePosition");
      var wheelPxFactor = Browser.linux && Browser.chrome ? window.devicePixelRatio : Browser.mac ? window.devicePixelRatio * 3 : window.devicePixelRatio > 0 ? 2 * window.devicePixelRatio : 1;
      function getWheelDelta(e) {
        return Browser.edge ? e.wheelDeltaY / 2 : (
          // Don't trust window-geometry-based delta
          e.deltaY && e.deltaMode === 0 ? -e.deltaY / wheelPxFactor : (
            // Pixels
            e.deltaY && e.deltaMode === 1 ? -e.deltaY * 20 : (
              // Lines
              e.deltaY && e.deltaMode === 2 ? -e.deltaY * 60 : (
                // Pages
                e.deltaX || e.deltaZ ? 0 : (
                  // Skip horizontal/depth wheel events
                  e.wheelDelta ? (e.wheelDeltaY || e.wheelDelta) / 2 : (
                    // Legacy IE pixels
                    e.detail && Math.abs(e.detail) < 32765 ? -e.detail * 20 : (
                      // Legacy Moz lines
                      e.detail ? e.detail / -32765 * 60 : (
                        // Legacy Moz pages
                        0
                      )
                    )
                  )
                )
              )
            )
          )
        );
      }
      __name(getWheelDelta, "getWheelDelta");
      function isExternalTarget(el, e) {
        var related = e.relatedTarget;
        if (!related) {
          return true;
        }
        try {
          while (related && related !== el) {
            related = related.parentNode;
          }
        } catch (err) {
          return false;
        }
        return related !== el;
      }
      __name(isExternalTarget, "isExternalTarget");
      var DomEvent = {
        __proto__: null,
        on,
        off,
        stopPropagation,
        disableScrollPropagation,
        disableClickPropagation,
        preventDefault,
        stop,
        getPropagationPath,
        getMousePosition,
        getWheelDelta,
        isExternalTarget,
        addListener: on,
        removeListener: off
      };
      var PosAnimation = Evented.extend({
        // @method run(el: HTMLElement, newPos: Point, duration?: Number, easeLinearity?: Number)
        // Run an animation of a given element to a new position, optionally setting
        // duration in seconds (`0.25` by default) and easing linearity factor (3rd
        // argument of the [cubic bezier curve](https://cubic-bezier.com/#0,0,.5,1),
        // `0.5` by default).
        run: /* @__PURE__ */ __name(function(el, newPos, duration, easeLinearity) {
          this.stop();
          this._el = el;
          this._inProgress = true;
          this._duration = duration || 0.25;
          this._easeOutPower = 1 / Math.max(easeLinearity || 0.5, 0.2);
          this._startPos = getPosition(el);
          this._offset = newPos.subtract(this._startPos);
          this._startTime = +/* @__PURE__ */ new Date();
          this.fire("start");
          this._animate();
        }, "run"),
        // @method stop()
        // Stops the animation (if currently running).
        stop: /* @__PURE__ */ __name(function() {
          if (!this._inProgress) {
            return;
          }
          this._step(true);
          this._complete();
        }, "stop"),
        _animate: /* @__PURE__ */ __name(function() {
          this._animId = requestAnimFrame(this._animate, this);
          this._step();
        }, "_animate"),
        _step: /* @__PURE__ */ __name(function(round) {
          var elapsed = +/* @__PURE__ */ new Date() - this._startTime, duration = this._duration * 1e3;
          if (elapsed < duration) {
            this._runFrame(this._easeOut(elapsed / duration), round);
          } else {
            this._runFrame(1);
            this._complete();
          }
        }, "_step"),
        _runFrame: /* @__PURE__ */ __name(function(progress, round) {
          var pos = this._startPos.add(this._offset.multiplyBy(progress));
          if (round) {
            pos._round();
          }
          setPosition(this._el, pos);
          this.fire("step");
        }, "_runFrame"),
        _complete: /* @__PURE__ */ __name(function() {
          cancelAnimFrame(this._animId);
          this._inProgress = false;
          this.fire("end");
        }, "_complete"),
        _easeOut: /* @__PURE__ */ __name(function(t) {
          return 1 - Math.pow(1 - t, this._easeOutPower);
        }, "_easeOut")
      });
      var Map2 = Evented.extend({
        options: {
          // @section Map State Options
          // @option crs: CRS = L.CRS.EPSG3857
          // The [Coordinate Reference System](#crs) to use. Don't change this if you're not
          // sure what it means.
          crs: EPSG3857,
          // @option center: LatLng = undefined
          // Initial geographic center of the map
          center: void 0,
          // @option zoom: Number = undefined
          // Initial map zoom level
          zoom: void 0,
          // @option minZoom: Number = *
          // Minimum zoom level of the map.
          // If not specified and at least one `GridLayer` or `TileLayer` is in the map,
          // the lowest of their `minZoom` options will be used instead.
          minZoom: void 0,
          // @option maxZoom: Number = *
          // Maximum zoom level of the map.
          // If not specified and at least one `GridLayer` or `TileLayer` is in the map,
          // the highest of their `maxZoom` options will be used instead.
          maxZoom: void 0,
          // @option layers: Layer[] = []
          // Array of layers that will be added to the map initially
          layers: [],
          // @option maxBounds: LatLngBounds = null
          // When this option is set, the map restricts the view to the given
          // geographical bounds, bouncing the user back if the user tries to pan
          // outside the view. To set the restriction dynamically, use
          // [`setMaxBounds`](#map-setmaxbounds) method.
          maxBounds: void 0,
          // @option renderer: Renderer = *
          // The default method for drawing vector layers on the map. `L.SVG`
          // or `L.Canvas` by default depending on browser support.
          renderer: void 0,
          // @section Animation Options
          // @option zoomAnimation: Boolean = true
          // Whether the map zoom animation is enabled. By default it's enabled
          // in all browsers that support CSS3 Transitions except Android.
          zoomAnimation: true,
          // @option zoomAnimationThreshold: Number = 4
          // Won't animate zoom if the zoom difference exceeds this value.
          zoomAnimationThreshold: 4,
          // @option fadeAnimation: Boolean = true
          // Whether the tile fade animation is enabled. By default it's enabled
          // in all browsers that support CSS3 Transitions except Android.
          fadeAnimation: true,
          // @option markerZoomAnimation: Boolean = true
          // Whether markers animate their zoom with the zoom animation, if disabled
          // they will disappear for the length of the animation. By default it's
          // enabled in all browsers that support CSS3 Transitions except Android.
          markerZoomAnimation: true,
          // @option transform3DLimit: Number = 2^23
          // Defines the maximum size of a CSS translation transform. The default
          // value should not be changed unless a web browser positions layers in
          // the wrong place after doing a large `panBy`.
          transform3DLimit: 8388608,
          // Precision limit of a 32-bit float
          // @section Interaction Options
          // @option zoomSnap: Number = 1
          // Forces the map's zoom level to always be a multiple of this, particularly
          // right after a [`fitBounds()`](#map-fitbounds) or a pinch-zoom.
          // By default, the zoom level snaps to the nearest integer; lower values
          // (e.g. `0.5` or `0.1`) allow for greater granularity. A value of `0`
          // means the zoom level will not be snapped after `fitBounds` or a pinch-zoom.
          zoomSnap: 1,
          // @option zoomDelta: Number = 1
          // Controls how much the map's zoom level will change after a
          // [`zoomIn()`](#map-zoomin), [`zoomOut()`](#map-zoomout), pressing `+`
          // or `-` on the keyboard, or using the [zoom controls](#control-zoom).
          // Values smaller than `1` (e.g. `0.5`) allow for greater granularity.
          zoomDelta: 1,
          // @option trackResize: Boolean = true
          // Whether the map automatically handles browser window resize to update itself.
          trackResize: true
        },
        initialize: /* @__PURE__ */ __name(function(id, options) {
          options = setOptions(this, options);
          this._handlers = [];
          this._layers = {};
          this._zoomBoundLayers = {};
          this._sizeChanged = true;
          this._initContainer(id);
          this._initLayout();
          this._onResize = bind(this._onResize, this);
          this._initEvents();
          if (options.maxBounds) {
            this.setMaxBounds(options.maxBounds);
          }
          if (options.zoom !== void 0) {
            this._zoom = this._limitZoom(options.zoom);
          }
          if (options.center && options.zoom !== void 0) {
            this.setView(toLatLng(options.center), options.zoom, { reset: true });
          }
          this.callInitHooks();
          this._zoomAnimated = TRANSITION && Browser.any3d && !Browser.mobileOpera && this.options.zoomAnimation;
          if (this._zoomAnimated) {
            this._createAnimProxy();
            on(this._proxy, TRANSITION_END, this._catchTransitionEnd, this);
          }
          this._addLayers(this.options.layers);
        }, "initialize"),
        // @section Methods for modifying map state
        // @method setView(center: LatLng, zoom: Number, options?: Zoom/pan options): this
        // Sets the view of the map (geographical center and zoom) with the given
        // animation options.
        setView: /* @__PURE__ */ __name(function(center, zoom2, options) {
          zoom2 = zoom2 === void 0 ? this._zoom : this._limitZoom(zoom2);
          center = this._limitCenter(toLatLng(center), zoom2, this.options.maxBounds);
          options = options || {};
          this._stop();
          if (this._loaded && !options.reset && options !== true) {
            if (options.animate !== void 0) {
              options.zoom = extend({ animate: options.animate }, options.zoom);
              options.pan = extend({ animate: options.animate, duration: options.duration }, options.pan);
            }
            var moved = this._zoom !== zoom2 ? this._tryAnimatedZoom && this._tryAnimatedZoom(center, zoom2, options.zoom) : this._tryAnimatedPan(center, options.pan);
            if (moved) {
              clearTimeout(this._sizeTimer);
              return this;
            }
          }
          this._resetView(center, zoom2, options.pan && options.pan.noMoveStart);
          return this;
        }, "setView"),
        // @method setZoom(zoom: Number, options?: Zoom/pan options): this
        // Sets the zoom of the map.
        setZoom: /* @__PURE__ */ __name(function(zoom2, options) {
          if (!this._loaded) {
            this._zoom = zoom2;
            return this;
          }
          return this.setView(this.getCenter(), zoom2, { zoom: options });
        }, "setZoom"),
        // @method zoomIn(delta?: Number, options?: Zoom options): this
        // Increases the zoom of the map by `delta` ([`zoomDelta`](#map-zoomdelta) by default).
        zoomIn: /* @__PURE__ */ __name(function(delta, options) {
          delta = delta || (Browser.any3d ? this.options.zoomDelta : 1);
          return this.setZoom(this._zoom + delta, options);
        }, "zoomIn"),
        // @method zoomOut(delta?: Number, options?: Zoom options): this
        // Decreases the zoom of the map by `delta` ([`zoomDelta`](#map-zoomdelta) by default).
        zoomOut: /* @__PURE__ */ __name(function(delta, options) {
          delta = delta || (Browser.any3d ? this.options.zoomDelta : 1);
          return this.setZoom(this._zoom - delta, options);
        }, "zoomOut"),
        // @method setZoomAround(latlng: LatLng, zoom: Number, options: Zoom options): this
        // Zooms the map while keeping a specified geographical point on the map
        // stationary (e.g. used internally for scroll zoom and double-click zoom).
        // @alternative
        // @method setZoomAround(offset: Point, zoom: Number, options: Zoom options): this
        // Zooms the map while keeping a specified pixel on the map (relative to the top-left corner) stationary.
        setZoomAround: /* @__PURE__ */ __name(function(latlng, zoom2, options) {
          var scale2 = this.getZoomScale(zoom2), viewHalf = this.getSize().divideBy(2), containerPoint = latlng instanceof Point ? latlng : this.latLngToContainerPoint(latlng), centerOffset = containerPoint.subtract(viewHalf).multiplyBy(1 - 1 / scale2), newCenter = this.containerPointToLatLng(viewHalf.add(centerOffset));
          return this.setView(newCenter, zoom2, { zoom: options });
        }, "setZoomAround"),
        _getBoundsCenterZoom: /* @__PURE__ */ __name(function(bounds, options) {
          options = options || {};
          bounds = bounds.getBounds ? bounds.getBounds() : toLatLngBounds(bounds);
          var paddingTL = toPoint(options.paddingTopLeft || options.padding || [0, 0]), paddingBR = toPoint(options.paddingBottomRight || options.padding || [0, 0]), zoom2 = this.getBoundsZoom(bounds, false, paddingTL.add(paddingBR));
          zoom2 = typeof options.maxZoom === "number" ? Math.min(options.maxZoom, zoom2) : zoom2;
          if (zoom2 === Infinity) {
            return {
              center: bounds.getCenter(),
              zoom: zoom2
            };
          }
          var paddingOffset = paddingBR.subtract(paddingTL).divideBy(2), swPoint = this.project(bounds.getSouthWest(), zoom2), nePoint = this.project(bounds.getNorthEast(), zoom2), center = this.unproject(swPoint.add(nePoint).divideBy(2).add(paddingOffset), zoom2);
          return {
            center,
            zoom: zoom2
          };
        }, "_getBoundsCenterZoom"),
        // @method fitBounds(bounds: LatLngBounds, options?: fitBounds options): this
        // Sets a map view that contains the given geographical bounds with the
        // maximum zoom level possible.
        fitBounds: /* @__PURE__ */ __name(function(bounds, options) {
          bounds = toLatLngBounds(bounds);
          if (!bounds.isValid()) {
            throw new Error("Bounds are not valid.");
          }
          var target = this._getBoundsCenterZoom(bounds, options);
          return this.setView(target.center, target.zoom, options);
        }, "fitBounds"),
        // @method fitWorld(options?: fitBounds options): this
        // Sets a map view that mostly contains the whole world with the maximum
        // zoom level possible.
        fitWorld: /* @__PURE__ */ __name(function(options) {
          return this.fitBounds([[-90, -180], [90, 180]], options);
        }, "fitWorld"),
        // @method panTo(latlng: LatLng, options?: Pan options): this
        // Pans the map to a given center.
        panTo: /* @__PURE__ */ __name(function(center, options) {
          return this.setView(center, this._zoom, { pan: options });
        }, "panTo"),
        // @method panBy(offset: Point, options?: Pan options): this
        // Pans the map by a given number of pixels (animated).
        panBy: /* @__PURE__ */ __name(function(offset, options) {
          offset = toPoint(offset).round();
          options = options || {};
          if (!offset.x && !offset.y) {
            return this.fire("moveend");
          }
          if (options.animate !== true && !this.getSize().contains(offset)) {
            this._resetView(this.unproject(this.project(this.getCenter()).add(offset)), this.getZoom());
            return this;
          }
          if (!this._panAnim) {
            this._panAnim = new PosAnimation();
            this._panAnim.on({
              "step": this._onPanTransitionStep,
              "end": this._onPanTransitionEnd
            }, this);
          }
          if (!options.noMoveStart) {
            this.fire("movestart");
          }
          if (options.animate !== false) {
            addClass2(this._mapPane, "leaflet-pan-anim");
            var newPos = this._getMapPanePos().subtract(offset).round();
            this._panAnim.run(this._mapPane, newPos, options.duration || 0.25, options.easeLinearity);
          } else {
            this._rawPanBy(offset);
            this.fire("move").fire("moveend");
          }
          return this;
        }, "panBy"),
        // @method flyTo(latlng: LatLng, zoom?: Number, options?: Zoom/pan options): this
        // Sets the view of the map (geographical center and zoom) performing a smooth
        // pan-zoom animation.
        flyTo: /* @__PURE__ */ __name(function(targetCenter, targetZoom, options) {
          options = options || {};
          if (options.animate === false || !Browser.any3d) {
            return this.setView(targetCenter, targetZoom, options);
          }
          this._stop();
          var from = this.project(this.getCenter()), to = this.project(targetCenter), size = this.getSize(), startZoom = this._zoom;
          targetCenter = toLatLng(targetCenter);
          targetZoom = targetZoom === void 0 ? startZoom : targetZoom;
          var w0 = Math.max(size.x, size.y), w1 = w0 * this.getZoomScale(startZoom, targetZoom), u1 = to.distanceTo(from) || 1, rho = 1.42, rho2 = rho * rho;
          function r(i) {
            var s1 = i ? -1 : 1, s2 = i ? w1 : w0, t1 = w1 * w1 - w0 * w0 + s1 * rho2 * rho2 * u1 * u1, b1 = 2 * s2 * rho2 * u1, b = t1 / b1, sq = Math.sqrt(b * b + 1) - b;
            var log = sq < 1e-9 ? -18 : Math.log(sq);
            return log;
          }
          __name(r, "r");
          function sinh(n) {
            return (Math.exp(n) - Math.exp(-n)) / 2;
          }
          __name(sinh, "sinh");
          function cosh(n) {
            return (Math.exp(n) + Math.exp(-n)) / 2;
          }
          __name(cosh, "cosh");
          function tanh(n) {
            return sinh(n) / cosh(n);
          }
          __name(tanh, "tanh");
          var r0 = r(0);
          function w(s) {
            return w0 * (cosh(r0) / cosh(r0 + rho * s));
          }
          __name(w, "w");
          function u(s) {
            return w0 * (cosh(r0) * tanh(r0 + rho * s) - sinh(r0)) / rho2;
          }
          __name(u, "u");
          function easeOut(t) {
            return 1 - Math.pow(1 - t, 1.5);
          }
          __name(easeOut, "easeOut");
          var start = Date.now(), S = (r(1) - r0) / rho, duration = options.duration ? 1e3 * options.duration : 1e3 * S * 0.8;
          function frame() {
            var t = (Date.now() - start) / duration, s = easeOut(t) * S;
            if (t <= 1) {
              this._flyToFrame = requestAnimFrame(frame, this);
              this._move(
                this.unproject(from.add(to.subtract(from).multiplyBy(u(s) / u1)), startZoom),
                this.getScaleZoom(w0 / w(s), startZoom),
                { flyTo: true }
              );
            } else {
              this._move(targetCenter, targetZoom)._moveEnd(true);
            }
          }
          __name(frame, "frame");
          this._moveStart(true, options.noMoveStart);
          frame.call(this);
          return this;
        }, "flyTo"),
        // @method flyToBounds(bounds: LatLngBounds, options?: fitBounds options): this
        // Sets the view of the map with a smooth animation like [`flyTo`](#map-flyto),
        // but takes a bounds parameter like [`fitBounds`](#map-fitbounds).
        flyToBounds: /* @__PURE__ */ __name(function(bounds, options) {
          var target = this._getBoundsCenterZoom(bounds, options);
          return this.flyTo(target.center, target.zoom, options);
        }, "flyToBounds"),
        // @method setMaxBounds(bounds: LatLngBounds): this
        // Restricts the map view to the given bounds (see the [maxBounds](#map-maxbounds) option).
        setMaxBounds: /* @__PURE__ */ __name(function(bounds) {
          bounds = toLatLngBounds(bounds);
          if (this.listens("moveend", this._panInsideMaxBounds)) {
            this.off("moveend", this._panInsideMaxBounds);
          }
          if (!bounds.isValid()) {
            this.options.maxBounds = null;
            return this;
          }
          this.options.maxBounds = bounds;
          if (this._loaded) {
            this._panInsideMaxBounds();
          }
          return this.on("moveend", this._panInsideMaxBounds);
        }, "setMaxBounds"),
        // @method setMinZoom(zoom: Number): this
        // Sets the lower limit for the available zoom levels (see the [minZoom](#map-minzoom) option).
        setMinZoom: /* @__PURE__ */ __name(function(zoom2) {
          var oldZoom = this.options.minZoom;
          this.options.minZoom = zoom2;
          if (this._loaded && oldZoom !== zoom2) {
            this.fire("zoomlevelschange");
            if (this.getZoom() < this.options.minZoom) {
              return this.setZoom(zoom2);
            }
          }
          return this;
        }, "setMinZoom"),
        // @method setMaxZoom(zoom: Number): this
        // Sets the upper limit for the available zoom levels (see the [maxZoom](#map-maxzoom) option).
        setMaxZoom: /* @__PURE__ */ __name(function(zoom2) {
          var oldZoom = this.options.maxZoom;
          this.options.maxZoom = zoom2;
          if (this._loaded && oldZoom !== zoom2) {
            this.fire("zoomlevelschange");
            if (this.getZoom() > this.options.maxZoom) {
              return this.setZoom(zoom2);
            }
          }
          return this;
        }, "setMaxZoom"),
        // @method panInsideBounds(bounds: LatLngBounds, options?: Pan options): this
        // Pans the map to the closest view that would lie inside the given bounds (if it's not already), controlling the animation using the options specific, if any.
        panInsideBounds: /* @__PURE__ */ __name(function(bounds, options) {
          this._enforcingBounds = true;
          var center = this.getCenter(), newCenter = this._limitCenter(center, this._zoom, toLatLngBounds(bounds));
          if (!center.equals(newCenter)) {
            this.panTo(newCenter, options);
          }
          this._enforcingBounds = false;
          return this;
        }, "panInsideBounds"),
        // @method panInside(latlng: LatLng, options?: padding options): this
        // Pans the map the minimum amount to make the `latlng` visible. Use
        // padding options to fit the display to more restricted bounds.
        // If `latlng` is already within the (optionally padded) display bounds,
        // the map will not be panned.
        panInside: /* @__PURE__ */ __name(function(latlng, options) {
          options = options || {};
          var paddingTL = toPoint(options.paddingTopLeft || options.padding || [0, 0]), paddingBR = toPoint(options.paddingBottomRight || options.padding || [0, 0]), pixelCenter = this.project(this.getCenter()), pixelPoint = this.project(latlng), pixelBounds = this.getPixelBounds(), paddedBounds = toBounds([pixelBounds.min.add(paddingTL), pixelBounds.max.subtract(paddingBR)]), paddedSize = paddedBounds.getSize();
          if (!paddedBounds.contains(pixelPoint)) {
            this._enforcingBounds = true;
            var centerOffset = pixelPoint.subtract(paddedBounds.getCenter());
            var offset = paddedBounds.extend(pixelPoint).getSize().subtract(paddedSize);
            pixelCenter.x += centerOffset.x < 0 ? -offset.x : offset.x;
            pixelCenter.y += centerOffset.y < 0 ? -offset.y : offset.y;
            this.panTo(this.unproject(pixelCenter), options);
            this._enforcingBounds = false;
          }
          return this;
        }, "panInside"),
        // @method invalidateSize(options: Zoom/pan options): this
        // Checks if the map container size changed and updates the map if so —
        // call it after you've changed the map size dynamically, also animating
        // pan by default. If `options.pan` is `false`, panning will not occur.
        // If `options.debounceMoveend` is `true`, it will delay `moveend` event so
        // that it doesn't happen often even if the method is called many
        // times in a row.
        // @alternative
        // @method invalidateSize(animate: Boolean): this
        // Checks if the map container size changed and updates the map if so —
        // call it after you've changed the map size dynamically, also animating
        // pan by default.
        invalidateSize: /* @__PURE__ */ __name(function(options) {
          if (!this._loaded) {
            return this;
          }
          options = extend({
            animate: false,
            pan: true
          }, options === true ? { animate: true } : options);
          var oldSize = this.getSize();
          this._sizeChanged = true;
          this._lastCenter = null;
          var newSize = this.getSize(), oldCenter = oldSize.divideBy(2).round(), newCenter = newSize.divideBy(2).round(), offset = oldCenter.subtract(newCenter);
          if (!offset.x && !offset.y) {
            return this;
          }
          if (options.animate && options.pan) {
            this.panBy(offset);
          } else {
            if (options.pan) {
              this._rawPanBy(offset);
            }
            this.fire("move");
            if (options.debounceMoveend) {
              clearTimeout(this._sizeTimer);
              this._sizeTimer = setTimeout(bind(this.fire, this, "moveend"), 200);
            } else {
              this.fire("moveend");
            }
          }
          return this.fire("resize", {
            oldSize,
            newSize
          });
        }, "invalidateSize"),
        // @section Methods for modifying map state
        // @method stop(): this
        // Stops the currently running `panTo` or `flyTo` animation, if any.
        stop: /* @__PURE__ */ __name(function() {
          this.setZoom(this._limitZoom(this._zoom));
          if (!this.options.zoomSnap) {
            this.fire("viewreset");
          }
          return this._stop();
        }, "stop"),
        // @section Geolocation methods
        // @method locate(options?: Locate options): this
        // Tries to locate the user using the Geolocation API, firing a [`locationfound`](#map-locationfound)
        // event with location data on success or a [`locationerror`](#map-locationerror) event on failure,
        // and optionally sets the map view to the user's location with respect to
        // detection accuracy (or to the world view if geolocation failed).
        // Note that, if your page doesn't use HTTPS, this method will fail in
        // modern browsers ([Chrome 50 and newer](https://sites.google.com/a/chromium.org/dev/Home/chromium-security/deprecating-powerful-features-on-insecure-origins))
        // See `Locate options` for more details.
        locate: /* @__PURE__ */ __name(function(options) {
          options = this._locateOptions = extend({
            timeout: 1e4,
            watch: false
            // setView: false
            // maxZoom: <Number>
            // maximumAge: 0
            // enableHighAccuracy: false
          }, options);
          if (!("geolocation" in navigator)) {
            this._handleGeolocationError({
              code: 0,
              message: "Geolocation not supported."
            });
            return this;
          }
          var onResponse = bind(this._handleGeolocationResponse, this), onError = bind(this._handleGeolocationError, this);
          if (options.watch) {
            this._locationWatchId = navigator.geolocation.watchPosition(onResponse, onError, options);
          } else {
            navigator.geolocation.getCurrentPosition(onResponse, onError, options);
          }
          return this;
        }, "locate"),
        // @method stopLocate(): this
        // Stops watching location previously initiated by `map.locate({watch: true})`
        // and aborts resetting the map view if map.locate was called with
        // `{setView: true}`.
        stopLocate: /* @__PURE__ */ __name(function() {
          if (navigator.geolocation && navigator.geolocation.clearWatch) {
            navigator.geolocation.clearWatch(this._locationWatchId);
          }
          if (this._locateOptions) {
            this._locateOptions.setView = false;
          }
          return this;
        }, "stopLocate"),
        _handleGeolocationError: /* @__PURE__ */ __name(function(error) {
          if (!this._container._leaflet_id) {
            return;
          }
          var c = error.code, message = error.message || (c === 1 ? "permission denied" : c === 2 ? "position unavailable" : "timeout");
          if (this._locateOptions.setView && !this._loaded) {
            this.fitWorld();
          }
          this.fire("locationerror", {
            code: c,
            message: "Geolocation error: " + message + "."
          });
        }, "_handleGeolocationError"),
        _handleGeolocationResponse: /* @__PURE__ */ __name(function(pos) {
          if (!this._container._leaflet_id) {
            return;
          }
          var lat = pos.coords.latitude, lng = pos.coords.longitude, latlng = new LatLng(lat, lng), bounds = latlng.toBounds(pos.coords.accuracy * 2), options = this._locateOptions;
          if (options.setView) {
            var zoom2 = this.getBoundsZoom(bounds);
            this.setView(latlng, options.maxZoom ? Math.min(zoom2, options.maxZoom) : zoom2);
          }
          var data = {
            latlng,
            bounds,
            timestamp: pos.timestamp
          };
          for (var i in pos.coords) {
            if (typeof pos.coords[i] === "number") {
              data[i] = pos.coords[i];
            }
          }
          this.fire("locationfound", data);
        }, "_handleGeolocationResponse"),
        // TODO Appropriate docs section?
        // @section Other Methods
        // @method addHandler(name: String, HandlerClass: Function): this
        // Adds a new `Handler` to the map, given its name and constructor function.
        addHandler: /* @__PURE__ */ __name(function(name, HandlerClass) {
          if (!HandlerClass) {
            return this;
          }
          var handler = this[name] = new HandlerClass(this);
          this._handlers.push(handler);
          if (this.options[name]) {
            handler.enable();
          }
          return this;
        }, "addHandler"),
        // @method remove(): this
        // Destroys the map and clears all related event listeners.
        remove: /* @__PURE__ */ __name(function() {
          this._initEvents(true);
          if (this.options.maxBounds) {
            this.off("moveend", this._panInsideMaxBounds);
          }
          if (this._containerId !== this._container._leaflet_id) {
            throw new Error("Map container is being reused by another instance");
          }
          try {
            delete this._container._leaflet_id;
            delete this._containerId;
          } catch (e) {
            this._container._leaflet_id = void 0;
            this._containerId = void 0;
          }
          if (this._locationWatchId !== void 0) {
            this.stopLocate();
          }
          this._stop();
          remove2(this._mapPane);
          if (this._clearControlPos) {
            this._clearControlPos();
          }
          if (this._resizeRequest) {
            cancelAnimFrame(this._resizeRequest);
            this._resizeRequest = null;
          }
          this._clearHandlers();
          if (this._loaded) {
            this.fire("unload");
          }
          var i;
          for (i in this._layers) {
            this._layers[i].remove();
          }
          for (i in this._panes) {
            remove2(this._panes[i]);
          }
          this._layers = [];
          this._panes = [];
          delete this._mapPane;
          delete this._renderer;
          return this;
        }, "remove"),
        // @section Other Methods
        // @method createPane(name: String, container?: HTMLElement): HTMLElement
        // Creates a new [map pane](#map-pane) with the given name if it doesn't exist already,
        // then returns it. The pane is created as a child of `container`, or
        // as a child of the main map pane if not set.
        createPane: /* @__PURE__ */ __name(function(name, container) {
          var className = "leaflet-pane" + (name ? " leaflet-" + name.replace("Pane", "") + "-pane" : ""), pane = create$1("div", className, container || this._mapPane);
          if (name) {
            this._panes[name] = pane;
          }
          return pane;
        }, "createPane"),
        // @section Methods for Getting Map State
        // @method getCenter(): LatLng
        // Returns the geographical center of the map view
        getCenter: /* @__PURE__ */ __name(function() {
          this._checkIfLoaded();
          if (this._lastCenter && !this._moved()) {
            return this._lastCenter.clone();
          }
          return this.layerPointToLatLng(this._getCenterLayerPoint());
        }, "getCenter"),
        // @method getZoom(): Number
        // Returns the current zoom level of the map view
        getZoom: /* @__PURE__ */ __name(function() {
          return this._zoom;
        }, "getZoom"),
        // @method getBounds(): LatLngBounds
        // Returns the geographical bounds visible in the current map view
        getBounds: /* @__PURE__ */ __name(function() {
          var bounds = this.getPixelBounds(), sw = this.unproject(bounds.getBottomLeft()), ne = this.unproject(bounds.getTopRight());
          return new LatLngBounds(sw, ne);
        }, "getBounds"),
        // @method getMinZoom(): Number
        // Returns the minimum zoom level of the map (if set in the `minZoom` option of the map or of any layers), or `0` by default.
        getMinZoom: /* @__PURE__ */ __name(function() {
          return this.options.minZoom === void 0 ? this._layersMinZoom || 0 : this.options.minZoom;
        }, "getMinZoom"),
        // @method getMaxZoom(): Number
        // Returns the maximum zoom level of the map (if set in the `maxZoom` option of the map or of any layers).
        getMaxZoom: /* @__PURE__ */ __name(function() {
          return this.options.maxZoom === void 0 ? this._layersMaxZoom === void 0 ? Infinity : this._layersMaxZoom : this.options.maxZoom;
        }, "getMaxZoom"),
        // @method getBoundsZoom(bounds: LatLngBounds, inside?: Boolean, padding?: Point): Number
        // Returns the maximum zoom level on which the given bounds fit to the map
        // view in its entirety. If `inside` (optional) is set to `true`, the method
        // instead returns the minimum zoom level on which the map view fits into
        // the given bounds in its entirety.
        getBoundsZoom: /* @__PURE__ */ __name(function(bounds, inside, padding) {
          bounds = toLatLngBounds(bounds);
          padding = toPoint(padding || [0, 0]);
          var zoom2 = this.getZoom() || 0, min2 = this.getMinZoom(), max2 = this.getMaxZoom(), nw = bounds.getNorthWest(), se = bounds.getSouthEast(), size = this.getSize().subtract(padding), boundsSize = toBounds(this.project(se, zoom2), this.project(nw, zoom2)).getSize(), snap = Browser.any3d ? this.options.zoomSnap : 1, scalex = size.x / boundsSize.x, scaley = size.y / boundsSize.y, scale2 = inside ? Math.max(scalex, scaley) : Math.min(scalex, scaley);
          zoom2 = this.getScaleZoom(scale2, zoom2);
          if (snap) {
            zoom2 = Math.round(zoom2 / (snap / 100)) * (snap / 100);
            zoom2 = inside ? Math.ceil(zoom2 / snap) * snap : Math.floor(zoom2 / snap) * snap;
          }
          return Math.max(min2, Math.min(max2, zoom2));
        }, "getBoundsZoom"),
        // @method getSize(): Point
        // Returns the current size of the map container (in pixels).
        getSize: /* @__PURE__ */ __name(function() {
          if (!this._size || this._sizeChanged) {
            this._size = new Point(
              this._container.clientWidth || 0,
              this._container.clientHeight || 0
            );
            this._sizeChanged = false;
          }
          return this._size.clone();
        }, "getSize"),
        // @method getPixelBounds(): Bounds
        // Returns the bounds of the current map view in projected pixel
        // coordinates (sometimes useful in layer and overlay implementations).
        getPixelBounds: /* @__PURE__ */ __name(function(center, zoom2) {
          var topLeftPoint = this._getTopLeftPoint(center, zoom2);
          return new Bounds(topLeftPoint, topLeftPoint.add(this.getSize()));
        }, "getPixelBounds"),
        // TODO: Check semantics - isn't the pixel origin the 0,0 coord relative to
        // the map pane? "left point of the map layer" can be confusing, specially
        // since there can be negative offsets.
        // @method getPixelOrigin(): Point
        // Returns the projected pixel coordinates of the top left point of
        // the map layer (useful in custom layer and overlay implementations).
        getPixelOrigin: /* @__PURE__ */ __name(function() {
          this._checkIfLoaded();
          return this._pixelOrigin;
        }, "getPixelOrigin"),
        // @method getPixelWorldBounds(zoom?: Number): Bounds
        // Returns the world's bounds in pixel coordinates for zoom level `zoom`.
        // If `zoom` is omitted, the map's current zoom level is used.
        getPixelWorldBounds: /* @__PURE__ */ __name(function(zoom2) {
          return this.options.crs.getProjectedBounds(zoom2 === void 0 ? this.getZoom() : zoom2);
        }, "getPixelWorldBounds"),
        // @section Other Methods
        // @method getPane(pane: String|HTMLElement): HTMLElement
        // Returns a [map pane](#map-pane), given its name or its HTML element (its identity).
        getPane: /* @__PURE__ */ __name(function(pane) {
          return typeof pane === "string" ? this._panes[pane] : pane;
        }, "getPane"),
        // @method getPanes(): Object
        // Returns a plain object containing the names of all [panes](#map-pane) as keys and
        // the panes as values.
        getPanes: /* @__PURE__ */ __name(function() {
          return this._panes;
        }, "getPanes"),
        // @method getContainer: HTMLElement
        // Returns the HTML element that contains the map.
        getContainer: /* @__PURE__ */ __name(function() {
          return this._container;
        }, "getContainer"),
        // @section Conversion Methods
        // @method getZoomScale(toZoom: Number, fromZoom: Number): Number
        // Returns the scale factor to be applied to a map transition from zoom level
        // `fromZoom` to `toZoom`. Used internally to help with zoom animations.
        getZoomScale: /* @__PURE__ */ __name(function(toZoom, fromZoom) {
          var crs = this.options.crs;
          fromZoom = fromZoom === void 0 ? this._zoom : fromZoom;
          return crs.scale(toZoom) / crs.scale(fromZoom);
        }, "getZoomScale"),
        // @method getScaleZoom(scale: Number, fromZoom: Number): Number
        // Returns the zoom level that the map would end up at, if it is at `fromZoom`
        // level and everything is scaled by a factor of `scale`. Inverse of
        // [`getZoomScale`](#map-getZoomScale).
        getScaleZoom: /* @__PURE__ */ __name(function(scale2, fromZoom) {
          var crs = this.options.crs;
          fromZoom = fromZoom === void 0 ? this._zoom : fromZoom;
          var zoom2 = crs.zoom(scale2 * crs.scale(fromZoom));
          return isNaN(zoom2) ? Infinity : zoom2;
        }, "getScaleZoom"),
        // @method project(latlng: LatLng, zoom: Number): Point
        // Projects a geographical coordinate `LatLng` according to the projection
        // of the map's CRS, then scales it according to `zoom` and the CRS's
        // `Transformation`. The result is pixel coordinate relative to
        // the CRS origin.
        project: /* @__PURE__ */ __name(function(latlng, zoom2) {
          zoom2 = zoom2 === void 0 ? this._zoom : zoom2;
          return this.options.crs.latLngToPoint(toLatLng(latlng), zoom2);
        }, "project"),
        // @method unproject(point: Point, zoom: Number): LatLng
        // Inverse of [`project`](#map-project).
        unproject: /* @__PURE__ */ __name(function(point, zoom2) {
          zoom2 = zoom2 === void 0 ? this._zoom : zoom2;
          return this.options.crs.pointToLatLng(toPoint(point), zoom2);
        }, "unproject"),
        // @method layerPointToLatLng(point: Point): LatLng
        // Given a pixel coordinate relative to the [origin pixel](#map-getpixelorigin),
        // returns the corresponding geographical coordinate (for the current zoom level).
        layerPointToLatLng: /* @__PURE__ */ __name(function(point) {
          var projectedPoint = toPoint(point).add(this.getPixelOrigin());
          return this.unproject(projectedPoint);
        }, "layerPointToLatLng"),
        // @method latLngToLayerPoint(latlng: LatLng): Point
        // Given a geographical coordinate, returns the corresponding pixel coordinate
        // relative to the [origin pixel](#map-getpixelorigin).
        latLngToLayerPoint: /* @__PURE__ */ __name(function(latlng) {
          var projectedPoint = this.project(toLatLng(latlng))._round();
          return projectedPoint._subtract(this.getPixelOrigin());
        }, "latLngToLayerPoint"),
        // @method wrapLatLng(latlng: LatLng): LatLng
        // Returns a `LatLng` where `lat` and `lng` has been wrapped according to the
        // map's CRS's `wrapLat` and `wrapLng` properties, if they are outside the
        // CRS's bounds.
        // By default this means longitude is wrapped around the dateline so its
        // value is between -180 and +180 degrees.
        wrapLatLng: /* @__PURE__ */ __name(function(latlng) {
          return this.options.crs.wrapLatLng(toLatLng(latlng));
        }, "wrapLatLng"),
        // @method wrapLatLngBounds(bounds: LatLngBounds): LatLngBounds
        // Returns a `LatLngBounds` with the same size as the given one, ensuring that
        // its center is within the CRS's bounds.
        // By default this means the center longitude is wrapped around the dateline so its
        // value is between -180 and +180 degrees, and the majority of the bounds
        // overlaps the CRS's bounds.
        wrapLatLngBounds: /* @__PURE__ */ __name(function(latlng) {
          return this.options.crs.wrapLatLngBounds(toLatLngBounds(latlng));
        }, "wrapLatLngBounds"),
        // @method distance(latlng1: LatLng, latlng2: LatLng): Number
        // Returns the distance between two geographical coordinates according to
        // the map's CRS. By default this measures distance in meters.
        distance: /* @__PURE__ */ __name(function(latlng1, latlng2) {
          return this.options.crs.distance(toLatLng(latlng1), toLatLng(latlng2));
        }, "distance"),
        // @method containerPointToLayerPoint(point: Point): Point
        // Given a pixel coordinate relative to the map container, returns the corresponding
        // pixel coordinate relative to the [origin pixel](#map-getpixelorigin).
        containerPointToLayerPoint: /* @__PURE__ */ __name(function(point) {
          return toPoint(point).subtract(this._getMapPanePos());
        }, "containerPointToLayerPoint"),
        // @method layerPointToContainerPoint(point: Point): Point
        // Given a pixel coordinate relative to the [origin pixel](#map-getpixelorigin),
        // returns the corresponding pixel coordinate relative to the map container.
        layerPointToContainerPoint: /* @__PURE__ */ __name(function(point) {
          return toPoint(point).add(this._getMapPanePos());
        }, "layerPointToContainerPoint"),
        // @method containerPointToLatLng(point: Point): LatLng
        // Given a pixel coordinate relative to the map container, returns
        // the corresponding geographical coordinate (for the current zoom level).
        containerPointToLatLng: /* @__PURE__ */ __name(function(point) {
          var layerPoint = this.containerPointToLayerPoint(toPoint(point));
          return this.layerPointToLatLng(layerPoint);
        }, "containerPointToLatLng"),
        // @method latLngToContainerPoint(latlng: LatLng): Point
        // Given a geographical coordinate, returns the corresponding pixel coordinate
        // relative to the map container.
        latLngToContainerPoint: /* @__PURE__ */ __name(function(latlng) {
          return this.layerPointToContainerPoint(this.latLngToLayerPoint(toLatLng(latlng)));
        }, "latLngToContainerPoint"),
        // @method mouseEventToContainerPoint(ev: MouseEvent): Point
        // Given a MouseEvent object, returns the pixel coordinate relative to the
        // map container where the event took place.
        mouseEventToContainerPoint: /* @__PURE__ */ __name(function(e) {
          return getMousePosition(e, this._container);
        }, "mouseEventToContainerPoint"),
        // @method mouseEventToLayerPoint(ev: MouseEvent): Point
        // Given a MouseEvent object, returns the pixel coordinate relative to
        // the [origin pixel](#map-getpixelorigin) where the event took place.
        mouseEventToLayerPoint: /* @__PURE__ */ __name(function(e) {
          return this.containerPointToLayerPoint(this.mouseEventToContainerPoint(e));
        }, "mouseEventToLayerPoint"),
        // @method mouseEventToLatLng(ev: MouseEvent): LatLng
        // Given a MouseEvent object, returns geographical coordinate where the
        // event took place.
        mouseEventToLatLng: /* @__PURE__ */ __name(function(e) {
          return this.layerPointToLatLng(this.mouseEventToLayerPoint(e));
        }, "mouseEventToLatLng"),
        // map initialization methods
        _initContainer: /* @__PURE__ */ __name(function(id) {
          var container = this._container = get(id);
          if (!container) {
            throw new Error("Map container not found.");
          } else if (container._leaflet_id) {
            throw new Error("Map container is already initialized.");
          }
          on(container, "scroll", this._onScroll, this);
          this._containerId = stamp(container);
        }, "_initContainer"),
        _initLayout: /* @__PURE__ */ __name(function() {
          var container = this._container;
          this._fadeAnimated = this.options.fadeAnimation && Browser.any3d;
          addClass2(container, "leaflet-container" + (Browser.touch ? " leaflet-touch" : "") + (Browser.retina ? " leaflet-retina" : "") + (Browser.ielt9 ? " leaflet-oldie" : "") + (Browser.safari ? " leaflet-safari" : "") + (this._fadeAnimated ? " leaflet-fade-anim" : ""));
          var position = getStyle(container, "position");
          if (position !== "absolute" && position !== "relative" && position !== "fixed" && position !== "sticky") {
            container.style.position = "relative";
          }
          this._initPanes();
          if (this._initControlPos) {
            this._initControlPos();
          }
        }, "_initLayout"),
        _initPanes: /* @__PURE__ */ __name(function() {
          var panes = this._panes = {};
          this._paneRenderers = {};
          this._mapPane = this.createPane("mapPane", this._container);
          setPosition(this._mapPane, new Point(0, 0));
          this.createPane("tilePane");
          this.createPane("overlayPane");
          this.createPane("shadowPane");
          this.createPane("markerPane");
          this.createPane("tooltipPane");
          this.createPane("popupPane");
          if (!this.options.markerZoomAnimation) {
            addClass2(panes.markerPane, "leaflet-zoom-hide");
            addClass2(panes.shadowPane, "leaflet-zoom-hide");
          }
        }, "_initPanes"),
        // private methods that modify map state
        // @section Map state change events
        _resetView: /* @__PURE__ */ __name(function(center, zoom2, noMoveStart) {
          setPosition(this._mapPane, new Point(0, 0));
          var loading = !this._loaded;
          this._loaded = true;
          zoom2 = this._limitZoom(zoom2);
          this.fire("viewprereset");
          var zoomChanged = this._zoom !== zoom2;
          this._moveStart(zoomChanged, noMoveStart)._move(center, zoom2)._moveEnd(zoomChanged);
          this.fire("viewreset");
          if (loading) {
            this.fire("load");
          }
        }, "_resetView"),
        _moveStart: /* @__PURE__ */ __name(function(zoomChanged, noMoveStart) {
          if (zoomChanged) {
            this.fire("zoomstart");
          }
          if (!noMoveStart) {
            this.fire("movestart");
          }
          return this;
        }, "_moveStart"),
        _move: /* @__PURE__ */ __name(function(center, zoom2, data, supressEvent) {
          if (zoom2 === void 0) {
            zoom2 = this._zoom;
          }
          var zoomChanged = this._zoom !== zoom2;
          this._zoom = zoom2;
          this._lastCenter = center;
          this._pixelOrigin = this._getNewPixelOrigin(center);
          if (!supressEvent) {
            if (zoomChanged || data && data.pinch) {
              this.fire("zoom", data);
            }
            this.fire("move", data);
          } else if (data && data.pinch) {
            this.fire("zoom", data);
          }
          return this;
        }, "_move"),
        _moveEnd: /* @__PURE__ */ __name(function(zoomChanged) {
          if (zoomChanged) {
            this.fire("zoomend");
          }
          return this.fire("moveend");
        }, "_moveEnd"),
        _stop: /* @__PURE__ */ __name(function() {
          cancelAnimFrame(this._flyToFrame);
          if (this._panAnim) {
            this._panAnim.stop();
          }
          return this;
        }, "_stop"),
        _rawPanBy: /* @__PURE__ */ __name(function(offset) {
          setPosition(this._mapPane, this._getMapPanePos().subtract(offset));
        }, "_rawPanBy"),
        _getZoomSpan: /* @__PURE__ */ __name(function() {
          return this.getMaxZoom() - this.getMinZoom();
        }, "_getZoomSpan"),
        _panInsideMaxBounds: /* @__PURE__ */ __name(function() {
          if (!this._enforcingBounds) {
            this.panInsideBounds(this.options.maxBounds);
          }
        }, "_panInsideMaxBounds"),
        _checkIfLoaded: /* @__PURE__ */ __name(function() {
          if (!this._loaded) {
            throw new Error("Set map center and zoom first.");
          }
        }, "_checkIfLoaded"),
        // DOM event handling
        // @section Interaction events
        _initEvents: /* @__PURE__ */ __name(function(remove3) {
          this._targets = {};
          this._targets[stamp(this._container)] = this;
          var onOff = remove3 ? off : on;
          onOff(this._container, "click dblclick mousedown mouseup mouseover mouseout mousemove contextmenu keypress keydown keyup", this._handleDOMEvent, this);
          if (this.options.trackResize) {
            onOff(window, "resize", this._onResize, this);
          }
          if (Browser.any3d && this.options.transform3DLimit) {
            (remove3 ? this.off : this.on).call(this, "moveend", this._onMoveEnd);
          }
        }, "_initEvents"),
        _onResize: /* @__PURE__ */ __name(function() {
          cancelAnimFrame(this._resizeRequest);
          this._resizeRequest = requestAnimFrame(
            function() {
              this.invalidateSize({ debounceMoveend: true });
            },
            this
          );
        }, "_onResize"),
        _onScroll: /* @__PURE__ */ __name(function() {
          this._container.scrollTop = 0;
          this._container.scrollLeft = 0;
        }, "_onScroll"),
        _onMoveEnd: /* @__PURE__ */ __name(function() {
          var pos = this._getMapPanePos();
          if (Math.max(Math.abs(pos.x), Math.abs(pos.y)) >= this.options.transform3DLimit) {
            this._resetView(this.getCenter(), this.getZoom());
          }
        }, "_onMoveEnd"),
        _findEventTargets: /* @__PURE__ */ __name(function(e, type2) {
          var targets = [], target, isHover = type2 === "mouseout" || type2 === "mouseover", src = e.target || e.srcElement, dragging = false;
          while (src) {
            target = this._targets[stamp(src)];
            if (target && (type2 === "click" || type2 === "preclick") && this._draggableMoved(target)) {
              dragging = true;
              break;
            }
            if (target && target.listens(type2, true)) {
              if (isHover && !isExternalTarget(src, e)) {
                break;
              }
              targets.push(target);
              if (isHover) {
                break;
              }
            }
            if (src === this._container) {
              break;
            }
            src = src.parentNode;
          }
          if (!targets.length && !dragging && !isHover && this.listens(type2, true)) {
            targets = [this];
          }
          return targets;
        }, "_findEventTargets"),
        _isClickDisabled: /* @__PURE__ */ __name(function(el) {
          while (el && el !== this._container) {
            if (el["_leaflet_disable_click"]) {
              return true;
            }
            el = el.parentNode;
          }
        }, "_isClickDisabled"),
        _handleDOMEvent: /* @__PURE__ */ __name(function(e) {
          var el = e.target || e.srcElement;
          if (!this._loaded || el["_leaflet_disable_events"] || e.type === "click" && this._isClickDisabled(el)) {
            return;
          }
          var type2 = e.type;
          if (type2 === "mousedown") {
            preventOutline(el);
          }
          this._fireDOMEvent(e, type2);
        }, "_handleDOMEvent"),
        _mouseEvents: ["click", "dblclick", "mouseover", "mouseout", "contextmenu"],
        _fireDOMEvent: /* @__PURE__ */ __name(function(e, type2, canvasTargets) {
          if (e.type === "click") {
            var synth = extend({}, e);
            synth.type = "preclick";
            this._fireDOMEvent(synth, synth.type, canvasTargets);
          }
          var targets = this._findEventTargets(e, type2);
          if (canvasTargets) {
            var filtered = [];
            for (var i = 0; i < canvasTargets.length; i++) {
              if (canvasTargets[i].listens(type2, true)) {
                filtered.push(canvasTargets[i]);
              }
            }
            targets = filtered.concat(targets);
          }
          if (!targets.length) {
            return;
          }
          if (type2 === "contextmenu") {
            preventDefault(e);
          }
          var target = targets[0];
          var data = {
            originalEvent: e
          };
          if (e.type !== "keypress" && e.type !== "keydown" && e.type !== "keyup") {
            var isMarker = target.getLatLng && (!target._radius || target._radius <= 10);
            data.containerPoint = isMarker ? this.latLngToContainerPoint(target.getLatLng()) : this.mouseEventToContainerPoint(e);
            data.layerPoint = this.containerPointToLayerPoint(data.containerPoint);
            data.latlng = isMarker ? target.getLatLng() : this.layerPointToLatLng(data.layerPoint);
          }
          for (i = 0; i < targets.length; i++) {
            targets[i].fire(type2, data, true);
            if (data.originalEvent._stopped || targets[i].options.bubblingMouseEvents === false && indexOf(this._mouseEvents, type2) !== -1) {
              return;
            }
          }
        }, "_fireDOMEvent"),
        _draggableMoved: /* @__PURE__ */ __name(function(obj) {
          obj = obj.dragging && obj.dragging.enabled() ? obj : this;
          return obj.dragging && obj.dragging.moved() || this.boxZoom && this.boxZoom.moved();
        }, "_draggableMoved"),
        _clearHandlers: /* @__PURE__ */ __name(function() {
          for (var i = 0, len = this._handlers.length; i < len; i++) {
            this._handlers[i].disable();
          }
        }, "_clearHandlers"),
        // @section Other Methods
        // @method whenReady(fn: Function, context?: Object): this
        // Runs the given function `fn` when the map gets initialized with
        // a view (center and zoom) and at least one layer, or immediately
        // if it's already initialized, optionally passing a function context.
        whenReady: /* @__PURE__ */ __name(function(callback, context) {
          if (this._loaded) {
            callback.call(context || this, { target: this });
          } else {
            this.on("load", callback, context);
          }
          return this;
        }, "whenReady"),
        // private methods for getting map state
        _getMapPanePos: /* @__PURE__ */ __name(function() {
          return getPosition(this._mapPane) || new Point(0, 0);
        }, "_getMapPanePos"),
        _moved: /* @__PURE__ */ __name(function() {
          var pos = this._getMapPanePos();
          return pos && !pos.equals([0, 0]);
        }, "_moved"),
        _getTopLeftPoint: /* @__PURE__ */ __name(function(center, zoom2) {
          var pixelOrigin = center && zoom2 !== void 0 ? this._getNewPixelOrigin(center, zoom2) : this.getPixelOrigin();
          return pixelOrigin.subtract(this._getMapPanePos());
        }, "_getTopLeftPoint"),
        _getNewPixelOrigin: /* @__PURE__ */ __name(function(center, zoom2) {
          var viewHalf = this.getSize()._divideBy(2);
          return this.project(center, zoom2)._subtract(viewHalf)._add(this._getMapPanePos())._round();
        }, "_getNewPixelOrigin"),
        _latLngToNewLayerPoint: /* @__PURE__ */ __name(function(latlng, zoom2, center) {
          var topLeft = this._getNewPixelOrigin(center, zoom2);
          return this.project(latlng, zoom2)._subtract(topLeft);
        }, "_latLngToNewLayerPoint"),
        _latLngBoundsToNewLayerBounds: /* @__PURE__ */ __name(function(latLngBounds, zoom2, center) {
          var topLeft = this._getNewPixelOrigin(center, zoom2);
          return toBounds([
            this.project(latLngBounds.getSouthWest(), zoom2)._subtract(topLeft),
            this.project(latLngBounds.getNorthWest(), zoom2)._subtract(topLeft),
            this.project(latLngBounds.getSouthEast(), zoom2)._subtract(topLeft),
            this.project(latLngBounds.getNorthEast(), zoom2)._subtract(topLeft)
          ]);
        }, "_latLngBoundsToNewLayerBounds"),
        // layer point of the current center
        _getCenterLayerPoint: /* @__PURE__ */ __name(function() {
          return this.containerPointToLayerPoint(this.getSize()._divideBy(2));
        }, "_getCenterLayerPoint"),
        // offset of the specified place to the current center in pixels
        _getCenterOffset: /* @__PURE__ */ __name(function(latlng) {
          return this.latLngToLayerPoint(latlng).subtract(this._getCenterLayerPoint());
        }, "_getCenterOffset"),
        // adjust center for view to get inside bounds
        _limitCenter: /* @__PURE__ */ __name(function(center, zoom2, bounds) {
          if (!bounds) {
            return center;
          }
          var centerPoint = this.project(center, zoom2), viewHalf = this.getSize().divideBy(2), viewBounds = new Bounds(centerPoint.subtract(viewHalf), centerPoint.add(viewHalf)), offset = this._getBoundsOffset(viewBounds, bounds, zoom2);
          if (Math.abs(offset.x) <= 1 && Math.abs(offset.y) <= 1) {
            return center;
          }
          return this.unproject(centerPoint.add(offset), zoom2);
        }, "_limitCenter"),
        // adjust offset for view to get inside bounds
        _limitOffset: /* @__PURE__ */ __name(function(offset, bounds) {
          if (!bounds) {
            return offset;
          }
          var viewBounds = this.getPixelBounds(), newBounds = new Bounds(viewBounds.min.add(offset), viewBounds.max.add(offset));
          return offset.add(this._getBoundsOffset(newBounds, bounds));
        }, "_limitOffset"),
        // returns offset needed for pxBounds to get inside maxBounds at a specified zoom
        _getBoundsOffset: /* @__PURE__ */ __name(function(pxBounds, maxBounds, zoom2) {
          var projectedMaxBounds = toBounds(
            this.project(maxBounds.getNorthEast(), zoom2),
            this.project(maxBounds.getSouthWest(), zoom2)
          ), minOffset = projectedMaxBounds.min.subtract(pxBounds.min), maxOffset = projectedMaxBounds.max.subtract(pxBounds.max), dx = this._rebound(minOffset.x, -maxOffset.x), dy = this._rebound(minOffset.y, -maxOffset.y);
          return new Point(dx, dy);
        }, "_getBoundsOffset"),
        _rebound: /* @__PURE__ */ __name(function(left, right) {
          return left + right > 0 ? Math.round(left - right) / 2 : Math.max(0, Math.ceil(left)) - Math.max(0, Math.floor(right));
        }, "_rebound"),
        _limitZoom: /* @__PURE__ */ __name(function(zoom2) {
          var min2 = this.getMinZoom(), max2 = this.getMaxZoom(), snap = Browser.any3d ? this.options.zoomSnap : 1;
          if (snap) {
            zoom2 = Math.round(zoom2 / snap) * snap;
          }
          return Math.max(min2, Math.min(max2, zoom2));
        }, "_limitZoom"),
        _onPanTransitionStep: /* @__PURE__ */ __name(function() {
          this.fire("move");
        }, "_onPanTransitionStep"),
        _onPanTransitionEnd: /* @__PURE__ */ __name(function() {
          removeClass2(this._mapPane, "leaflet-pan-anim");
          this.fire("moveend");
        }, "_onPanTransitionEnd"),
        _tryAnimatedPan: /* @__PURE__ */ __name(function(center, options) {
          var offset = this._getCenterOffset(center)._trunc();
          if ((options && options.animate) !== true && !this.getSize().contains(offset)) {
            return false;
          }
          this.panBy(offset, options);
          return true;
        }, "_tryAnimatedPan"),
        _createAnimProxy: /* @__PURE__ */ __name(function() {
          var proxy = this._proxy = create$1("div", "leaflet-proxy leaflet-zoom-animated");
          this._panes.mapPane.appendChild(proxy);
          this.on("zoomanim", function(e) {
            var prop = TRANSFORM, transform = this._proxy.style[prop];
            setTransform(this._proxy, this.project(e.center, e.zoom), this.getZoomScale(e.zoom, 1));
            if (transform === this._proxy.style[prop] && this._animatingZoom) {
              this._onZoomTransitionEnd();
            }
          }, this);
          this.on("load moveend", this._animMoveEnd, this);
          this._on("unload", this._destroyAnimProxy, this);
        }, "_createAnimProxy"),
        _destroyAnimProxy: /* @__PURE__ */ __name(function() {
          remove2(this._proxy);
          this.off("load moveend", this._animMoveEnd, this);
          delete this._proxy;
        }, "_destroyAnimProxy"),
        _animMoveEnd: /* @__PURE__ */ __name(function() {
          var c = this.getCenter(), z = this.getZoom();
          setTransform(this._proxy, this.project(c, z), this.getZoomScale(z, 1));
        }, "_animMoveEnd"),
        _catchTransitionEnd: /* @__PURE__ */ __name(function(e) {
          if (this._animatingZoom && e.propertyName.indexOf("transform") >= 0) {
            this._onZoomTransitionEnd();
          }
        }, "_catchTransitionEnd"),
        _nothingToAnimate: /* @__PURE__ */ __name(function() {
          return !this._container.getElementsByClassName("leaflet-zoom-animated").length;
        }, "_nothingToAnimate"),
        _tryAnimatedZoom: /* @__PURE__ */ __name(function(center, zoom2, options) {
          if (this._animatingZoom) {
            return true;
          }
          options = options || {};
          if (!this._zoomAnimated || options.animate === false || this._nothingToAnimate() || Math.abs(zoom2 - this._zoom) > this.options.zoomAnimationThreshold) {
            return false;
          }
          var scale2 = this.getZoomScale(zoom2), offset = this._getCenterOffset(center)._divideBy(1 - 1 / scale2);
          if (options.animate !== true && !this.getSize().contains(offset)) {
            return false;
          }
          requestAnimFrame(function() {
            this._moveStart(true, options.noMoveStart || false)._animateZoom(center, zoom2, true);
          }, this);
          return true;
        }, "_tryAnimatedZoom"),
        _animateZoom: /* @__PURE__ */ __name(function(center, zoom2, startAnim, noUpdate) {
          if (!this._mapPane) {
            return;
          }
          if (startAnim) {
            this._animatingZoom = true;
            this._animateToCenter = center;
            this._animateToZoom = zoom2;
            addClass2(this._mapPane, "leaflet-zoom-anim");
          }
          this.fire("zoomanim", {
            center,
            zoom: zoom2,
            noUpdate
          });
          if (!this._tempFireZoomEvent) {
            this._tempFireZoomEvent = this._zoom !== this._animateToZoom;
          }
          this._move(this._animateToCenter, this._animateToZoom, void 0, true);
          setTimeout(bind(this._onZoomTransitionEnd, this), 250);
        }, "_animateZoom"),
        _onZoomTransitionEnd: /* @__PURE__ */ __name(function() {
          if (!this._animatingZoom) {
            return;
          }
          if (this._mapPane) {
            removeClass2(this._mapPane, "leaflet-zoom-anim");
          }
          this._animatingZoom = false;
          this._move(this._animateToCenter, this._animateToZoom, void 0, true);
          if (this._tempFireZoomEvent) {
            this.fire("zoom");
          }
          delete this._tempFireZoomEvent;
          this.fire("move");
          this._moveEnd(true);
        }, "_onZoomTransitionEnd")
      });
      function createMap(id, options) {
        return new Map2(id, options);
      }
      __name(createMap, "createMap");
      var Control = Class.extend({
        // @section
        // @aka Control Options
        options: {
          // @option position: String = 'topright'
          // The position of the control (one of the map corners). Possible values are `'topleft'`,
          // `'topright'`, `'bottomleft'` or `'bottomright'`
          position: "topright"
        },
        initialize: /* @__PURE__ */ __name(function(options) {
          setOptions(this, options);
        }, "initialize"),
        /* @section
         * Classes extending L.Control will inherit the following methods:
         *
         * @method getPosition: string
         * Returns the position of the control.
         */
        getPosition: /* @__PURE__ */ __name(function() {
          return this.options.position;
        }, "getPosition"),
        // @method setPosition(position: string): this
        // Sets the position of the control.
        setPosition: /* @__PURE__ */ __name(function(position) {
          var map = this._map;
          if (map) {
            map.removeControl(this);
          }
          this.options.position = position;
          if (map) {
            map.addControl(this);
          }
          return this;
        }, "setPosition"),
        // @method getContainer: HTMLElement
        // Returns the HTMLElement that contains the control.
        getContainer: /* @__PURE__ */ __name(function() {
          return this._container;
        }, "getContainer"),
        // @method addTo(map: Map): this
        // Adds the control to the given map.
        addTo: /* @__PURE__ */ __name(function(map) {
          this.remove();
          this._map = map;
          var container = this._container = this.onAdd(map), pos = this.getPosition(), corner = map._controlCorners[pos];
          addClass2(container, "leaflet-control");
          if (pos.indexOf("bottom") !== -1) {
            corner.insertBefore(container, corner.firstChild);
          } else {
            corner.appendChild(container);
          }
          this._map.on("unload", this.remove, this);
          return this;
        }, "addTo"),
        // @method remove: this
        // Removes the control from the map it is currently active on.
        remove: /* @__PURE__ */ __name(function() {
          if (!this._map) {
            return this;
          }
          remove2(this._container);
          if (this.onRemove) {
            this.onRemove(this._map);
          }
          this._map.off("unload", this.remove, this);
          this._map = null;
          return this;
        }, "remove"),
        _refocusOnMap: /* @__PURE__ */ __name(function(e) {
          if (this._map && e && e.screenX > 0 && e.screenY > 0) {
            this._map.getContainer().focus();
          }
        }, "_refocusOnMap")
      });
      var control = /* @__PURE__ */ __name(function(options) {
        return new Control(options);
      }, "control");
      Map2.include({
        // @method addControl(control: Control): this
        // Adds the given control to the map
        addControl: /* @__PURE__ */ __name(function(control2) {
          control2.addTo(this);
          return this;
        }, "addControl"),
        // @method removeControl(control: Control): this
        // Removes the given control from the map
        removeControl: /* @__PURE__ */ __name(function(control2) {
          control2.remove();
          return this;
        }, "removeControl"),
        _initControlPos: /* @__PURE__ */ __name(function() {
          var corners = this._controlCorners = {}, l = "leaflet-", container = this._controlContainer = create$1("div", l + "control-container", this._container);
          function createCorner(vSide, hSide) {
            var className = l + vSide + " " + l + hSide;
            corners[vSide + hSide] = create$1("div", className, container);
          }
          __name(createCorner, "createCorner");
          createCorner("top", "left");
          createCorner("top", "right");
          createCorner("bottom", "left");
          createCorner("bottom", "right");
        }, "_initControlPos"),
        _clearControlPos: /* @__PURE__ */ __name(function() {
          for (var i in this._controlCorners) {
            remove2(this._controlCorners[i]);
          }
          remove2(this._controlContainer);
          delete this._controlCorners;
          delete this._controlContainer;
        }, "_clearControlPos")
      });
      var Layers = Control.extend({
        // @section
        // @aka Control.Layers options
        options: {
          // @option collapsed: Boolean = true
          // If `true`, the control will be collapsed into an icon and expanded on mouse hover, touch, or keyboard activation.
          collapsed: true,
          position: "topright",
          // @option autoZIndex: Boolean = true
          // If `true`, the control will assign zIndexes in increasing order to all of its layers so that the order is preserved when switching them on/off.
          autoZIndex: true,
          // @option hideSingleBase: Boolean = false
          // If `true`, the base layers in the control will be hidden when there is only one.
          hideSingleBase: false,
          // @option sortLayers: Boolean = false
          // Whether to sort the layers. When `false`, layers will keep the order
          // in which they were added to the control.
          sortLayers: false,
          // @option sortFunction: Function = *
          // A [compare function](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array/sort)
          // that will be used for sorting the layers, when `sortLayers` is `true`.
          // The function receives both the `L.Layer` instances and their names, as in
          // `sortFunction(layerA, layerB, nameA, nameB)`.
          // By default, it sorts layers alphabetically by their name.
          sortFunction: /* @__PURE__ */ __name(function(layerA, layerB, nameA, nameB) {
            return nameA < nameB ? -1 : nameB < nameA ? 1 : 0;
          }, "sortFunction")
        },
        initialize: /* @__PURE__ */ __name(function(baseLayers, overlays, options) {
          setOptions(this, options);
          this._layerControlInputs = [];
          this._layers = [];
          this._lastZIndex = 0;
          this._handlingClick = false;
          this._preventClick = false;
          for (var i in baseLayers) {
            this._addLayer(baseLayers[i], i);
          }
          for (i in overlays) {
            this._addLayer(overlays[i], i, true);
          }
        }, "initialize"),
        onAdd: /* @__PURE__ */ __name(function(map) {
          this._initLayout();
          this._update();
          this._map = map;
          map.on("zoomend", this._checkDisabledLayers, this);
          for (var i = 0; i < this._layers.length; i++) {
            this._layers[i].layer.on("add remove", this._onLayerChange, this);
          }
          return this._container;
        }, "onAdd"),
        addTo: /* @__PURE__ */ __name(function(map) {
          Control.prototype.addTo.call(this, map);
          return this._expandIfNotCollapsed();
        }, "addTo"),
        onRemove: /* @__PURE__ */ __name(function() {
          this._map.off("zoomend", this._checkDisabledLayers, this);
          for (var i = 0; i < this._layers.length; i++) {
            this._layers[i].layer.off("add remove", this._onLayerChange, this);
          }
        }, "onRemove"),
        // @method addBaseLayer(layer: Layer, name: String): this
        // Adds a base layer (radio button entry) with the given name to the control.
        addBaseLayer: /* @__PURE__ */ __name(function(layer, name) {
          this._addLayer(layer, name);
          return this._map ? this._update() : this;
        }, "addBaseLayer"),
        // @method addOverlay(layer: Layer, name: String): this
        // Adds an overlay (checkbox entry) with the given name to the control.
        addOverlay: /* @__PURE__ */ __name(function(layer, name) {
          this._addLayer(layer, name, true);
          return this._map ? this._update() : this;
        }, "addOverlay"),
        // @method removeLayer(layer: Layer): this
        // Remove the given layer from the control.
        removeLayer: /* @__PURE__ */ __name(function(layer) {
          layer.off("add remove", this._onLayerChange, this);
          var obj = this._getLayer(stamp(layer));
          if (obj) {
            this._layers.splice(this._layers.indexOf(obj), 1);
          }
          return this._map ? this._update() : this;
        }, "removeLayer"),
        // @method expand(): this
        // Expand the control container if collapsed.
        expand: /* @__PURE__ */ __name(function() {
          addClass2(this._container, "leaflet-control-layers-expanded");
          this._section.style.height = null;
          var acceptableHeight = this._map.getSize().y - (this._container.offsetTop + 50);
          if (acceptableHeight < this._section.clientHeight) {
            addClass2(this._section, "leaflet-control-layers-scrollbar");
            this._section.style.height = acceptableHeight + "px";
          } else {
            removeClass2(this._section, "leaflet-control-layers-scrollbar");
          }
          this._checkDisabledLayers();
          return this;
        }, "expand"),
        // @method collapse(): this
        // Collapse the control container if expanded.
        collapse: /* @__PURE__ */ __name(function() {
          removeClass2(this._container, "leaflet-control-layers-expanded");
          return this;
        }, "collapse"),
        _initLayout: /* @__PURE__ */ __name(function() {
          var className = "leaflet-control-layers", container = this._container = create$1("div", className), collapsed = this.options.collapsed;
          container.setAttribute("aria-haspopup", true);
          disableClickPropagation(container);
          disableScrollPropagation(container);
          var section = this._section = create$1("section", className + "-list");
          if (collapsed) {
            this._map.on("click", this.collapse, this);
            on(container, {
              mouseenter: this._expandSafely,
              mouseleave: this.collapse
            }, this);
          }
          var link = this._layersLink = create$1("a", className + "-toggle", container);
          link.href = "#";
          link.title = "Layers";
          link.setAttribute("role", "button");
          on(link, {
            keydown: /* @__PURE__ */ __name(function(e) {
              if (e.keyCode === 13) {
                this._expandSafely();
              }
            }, "keydown"),
            // Certain screen readers intercept the key event and instead send a click event
            click: /* @__PURE__ */ __name(function(e) {
              preventDefault(e);
              this._expandSafely();
            }, "click")
          }, this);
          if (!collapsed) {
            this.expand();
          }
          this._baseLayersList = create$1("div", className + "-base", section);
          this._separator = create$1("div", className + "-separator", section);
          this._overlaysList = create$1("div", className + "-overlays", section);
          container.appendChild(section);
        }, "_initLayout"),
        _getLayer: /* @__PURE__ */ __name(function(id) {
          for (var i = 0; i < this._layers.length; i++) {
            if (this._layers[i] && stamp(this._layers[i].layer) === id) {
              return this._layers[i];
            }
          }
        }, "_getLayer"),
        _addLayer: /* @__PURE__ */ __name(function(layer, name, overlay) {
          if (this._map) {
            layer.on("add remove", this._onLayerChange, this);
          }
          this._layers.push({
            layer,
            name,
            overlay
          });
          if (this.options.sortLayers) {
            this._layers.sort(bind(function(a, b) {
              return this.options.sortFunction(a.layer, b.layer, a.name, b.name);
            }, this));
          }
          if (this.options.autoZIndex && layer.setZIndex) {
            this._lastZIndex++;
            layer.setZIndex(this._lastZIndex);
          }
          this._expandIfNotCollapsed();
        }, "_addLayer"),
        _update: /* @__PURE__ */ __name(function() {
          if (!this._container) {
            return this;
          }
          empty2(this._baseLayersList);
          empty2(this._overlaysList);
          this._layerControlInputs = [];
          var baseLayersPresent, overlaysPresent, i, obj, baseLayersCount = 0;
          for (i = 0; i < this._layers.length; i++) {
            obj = this._layers[i];
            this._addItem(obj);
            overlaysPresent = overlaysPresent || obj.overlay;
            baseLayersPresent = baseLayersPresent || !obj.overlay;
            baseLayersCount += !obj.overlay ? 1 : 0;
          }
          if (this.options.hideSingleBase) {
            baseLayersPresent = baseLayersPresent && baseLayersCount > 1;
            this._baseLayersList.style.display = baseLayersPresent ? "" : "none";
          }
          this._separator.style.display = overlaysPresent && baseLayersPresent ? "" : "none";
          return this;
        }, "_update"),
        _onLayerChange: /* @__PURE__ */ __name(function(e) {
          if (!this._handlingClick) {
            this._update();
          }
          var obj = this._getLayer(stamp(e.target));
          var type2 = obj.overlay ? e.type === "add" ? "overlayadd" : "overlayremove" : e.type === "add" ? "baselayerchange" : null;
          if (type2) {
            this._map.fire(type2, obj);
          }
        }, "_onLayerChange"),
        // IE7 bugs out if you create a radio dynamically, so you have to do it this hacky way (see https://stackoverflow.com/a/119079)
        _createRadioElement: /* @__PURE__ */ __name(function(name, checked) {
          var radioHtml = '<input type="radio" class="leaflet-control-layers-selector" name="' + name + '"' + (checked ? ' checked="checked"' : "") + "/>";
          var radioFragment = document.createElement("div");
          radioFragment.innerHTML = radioHtml;
          return radioFragment.firstChild;
        }, "_createRadioElement"),
        _addItem: /* @__PURE__ */ __name(function(obj) {
          var label = document.createElement("label"), checked = this._map.hasLayer(obj.layer), input;
          if (obj.overlay) {
            input = document.createElement("input");
            input.type = "checkbox";
            input.className = "leaflet-control-layers-selector";
            input.defaultChecked = checked;
          } else {
            input = this._createRadioElement("leaflet-base-layers_" + stamp(this), checked);
          }
          this._layerControlInputs.push(input);
          input.layerId = stamp(obj.layer);
          on(input, "click", this._onInputClick, this);
          var name = document.createElement("span");
          name.innerHTML = " " + obj.name;
          var holder = document.createElement("span");
          label.appendChild(holder);
          holder.appendChild(input);
          holder.appendChild(name);
          var container = obj.overlay ? this._overlaysList : this._baseLayersList;
          container.appendChild(label);
          this._checkDisabledLayers();
          return label;
        }, "_addItem"),
        _onInputClick: /* @__PURE__ */ __name(function() {
          if (this._preventClick) {
            return;
          }
          var inputs = this._layerControlInputs, input, layer;
          var addedLayers = [], removedLayers = [];
          this._handlingClick = true;
          for (var i = inputs.length - 1; i >= 0; i--) {
            input = inputs[i];
            layer = this._getLayer(input.layerId).layer;
            if (input.checked) {
              addedLayers.push(layer);
            } else if (!input.checked) {
              removedLayers.push(layer);
            }
          }
          for (i = 0; i < removedLayers.length; i++) {
            if (this._map.hasLayer(removedLayers[i])) {
              this._map.removeLayer(removedLayers[i]);
            }
          }
          for (i = 0; i < addedLayers.length; i++) {
            if (!this._map.hasLayer(addedLayers[i])) {
              this._map.addLayer(addedLayers[i]);
            }
          }
          this._handlingClick = false;
          this._refocusOnMap();
        }, "_onInputClick"),
        _checkDisabledLayers: /* @__PURE__ */ __name(function() {
          var inputs = this._layerControlInputs, input, layer, zoom2 = this._map.getZoom();
          for (var i = inputs.length - 1; i >= 0; i--) {
            input = inputs[i];
            layer = this._getLayer(input.layerId).layer;
            input.disabled = layer.options.minZoom !== void 0 && zoom2 < layer.options.minZoom || layer.options.maxZoom !== void 0 && zoom2 > layer.options.maxZoom;
          }
        }, "_checkDisabledLayers"),
        _expandIfNotCollapsed: /* @__PURE__ */ __name(function() {
          if (this._map && !this.options.collapsed) {
            this.expand();
          }
          return this;
        }, "_expandIfNotCollapsed"),
        _expandSafely: /* @__PURE__ */ __name(function() {
          var section = this._section;
          this._preventClick = true;
          on(section, "click", preventDefault);
          this.expand();
          var that = this;
          setTimeout(function() {
            off(section, "click", preventDefault);
            that._preventClick = false;
          });
        }, "_expandSafely")
      });
      var layers = /* @__PURE__ */ __name(function(baseLayers, overlays, options) {
        return new Layers(baseLayers, overlays, options);
      }, "layers");
      var Zoom = Control.extend({
        // @section
        // @aka Control.Zoom options
        options: {
          position: "topleft",
          // @option zoomInText: String = '<span aria-hidden="true">+</span>'
          // The text set on the 'zoom in' button.
          zoomInText: '<span aria-hidden="true">+</span>',
          // @option zoomInTitle: String = 'Zoom in'
          // The title set on the 'zoom in' button.
          zoomInTitle: "Zoom in",
          // @option zoomOutText: String = '<span aria-hidden="true">&#x2212;</span>'
          // The text set on the 'zoom out' button.
          zoomOutText: '<span aria-hidden="true">&#x2212;</span>',
          // @option zoomOutTitle: String = 'Zoom out'
          // The title set on the 'zoom out' button.
          zoomOutTitle: "Zoom out"
        },
        onAdd: /* @__PURE__ */ __name(function(map) {
          var zoomName = "leaflet-control-zoom", container = create$1("div", zoomName + " leaflet-bar"), options = this.options;
          this._zoomInButton = this._createButton(
            options.zoomInText,
            options.zoomInTitle,
            zoomName + "-in",
            container,
            this._zoomIn
          );
          this._zoomOutButton = this._createButton(
            options.zoomOutText,
            options.zoomOutTitle,
            zoomName + "-out",
            container,
            this._zoomOut
          );
          this._updateDisabled();
          map.on("zoomend zoomlevelschange", this._updateDisabled, this);
          return container;
        }, "onAdd"),
        onRemove: /* @__PURE__ */ __name(function(map) {
          map.off("zoomend zoomlevelschange", this._updateDisabled, this);
        }, "onRemove"),
        disable: /* @__PURE__ */ __name(function() {
          this._disabled = true;
          this._updateDisabled();
          return this;
        }, "disable"),
        enable: /* @__PURE__ */ __name(function() {
          this._disabled = false;
          this._updateDisabled();
          return this;
        }, "enable"),
        _zoomIn: /* @__PURE__ */ __name(function(e) {
          if (!this._disabled && this._map._zoom < this._map.getMaxZoom()) {
            this._map.zoomIn(this._map.options.zoomDelta * (e.shiftKey ? 3 : 1));
          }
        }, "_zoomIn"),
        _zoomOut: /* @__PURE__ */ __name(function(e) {
          if (!this._disabled && this._map._zoom > this._map.getMinZoom()) {
            this._map.zoomOut(this._map.options.zoomDelta * (e.shiftKey ? 3 : 1));
          }
        }, "_zoomOut"),
        _createButton: /* @__PURE__ */ __name(function(html, title, className, container, fn) {
          var link = create$1("a", className, container);
          link.innerHTML = html;
          link.href = "#";
          link.title = title;
          link.setAttribute("role", "button");
          link.setAttribute("aria-label", title);
          disableClickPropagation(link);
          on(link, "click", stop);
          on(link, "click", fn, this);
          on(link, "click", this._refocusOnMap, this);
          return link;
        }, "_createButton"),
        _updateDisabled: /* @__PURE__ */ __name(function() {
          var map = this._map, className = "leaflet-disabled";
          removeClass2(this._zoomInButton, className);
          removeClass2(this._zoomOutButton, className);
          this._zoomInButton.setAttribute("aria-disabled", "false");
          this._zoomOutButton.setAttribute("aria-disabled", "false");
          if (this._disabled || map._zoom === map.getMinZoom()) {
            addClass2(this._zoomOutButton, className);
            this._zoomOutButton.setAttribute("aria-disabled", "true");
          }
          if (this._disabled || map._zoom === map.getMaxZoom()) {
            addClass2(this._zoomInButton, className);
            this._zoomInButton.setAttribute("aria-disabled", "true");
          }
        }, "_updateDisabled")
      });
      Map2.mergeOptions({
        zoomControl: true
      });
      Map2.addInitHook(function() {
        if (this.options.zoomControl) {
          this.zoomControl = new Zoom();
          this.addControl(this.zoomControl);
        }
      });
      var zoom = /* @__PURE__ */ __name(function(options) {
        return new Zoom(options);
      }, "zoom");
      var Scale = Control.extend({
        // @section
        // @aka Control.Scale options
        options: {
          position: "bottomleft",
          // @option maxWidth: Number = 100
          // Maximum width of the control in pixels. The width is set dynamically to show round values (e.g. 100, 200, 500).
          maxWidth: 100,
          // @option metric: Boolean = True
          // Whether to show the metric scale line (m/km).
          metric: true,
          // @option imperial: Boolean = True
          // Whether to show the imperial scale line (mi/ft).
          imperial: true
          // @option updateWhenIdle: Boolean = false
          // If `true`, the control is updated on [`moveend`](#map-moveend), otherwise it's always up-to-date (updated on [`move`](#map-move)).
        },
        onAdd: /* @__PURE__ */ __name(function(map) {
          var className = "leaflet-control-scale", container = create$1("div", className), options = this.options;
          this._addScales(options, className + "-line", container);
          map.on(options.updateWhenIdle ? "moveend" : "move", this._update, this);
          map.whenReady(this._update, this);
          return container;
        }, "onAdd"),
        onRemove: /* @__PURE__ */ __name(function(map) {
          map.off(this.options.updateWhenIdle ? "moveend" : "move", this._update, this);
        }, "onRemove"),
        _addScales: /* @__PURE__ */ __name(function(options, className, container) {
          if (options.metric) {
            this._mScale = create$1("div", className, container);
          }
          if (options.imperial) {
            this._iScale = create$1("div", className, container);
          }
        }, "_addScales"),
        _update: /* @__PURE__ */ __name(function() {
          var map = this._map, y = map.getSize().y / 2;
          var maxMeters = map.distance(
            map.containerPointToLatLng([0, y]),
            map.containerPointToLatLng([this.options.maxWidth, y])
          );
          this._updateScales(maxMeters);
        }, "_update"),
        _updateScales: /* @__PURE__ */ __name(function(maxMeters) {
          if (this.options.metric && maxMeters) {
            this._updateMetric(maxMeters);
          }
          if (this.options.imperial && maxMeters) {
            this._updateImperial(maxMeters);
          }
        }, "_updateScales"),
        _updateMetric: /* @__PURE__ */ __name(function(maxMeters) {
          var meters = this._getRoundNum(maxMeters), label = meters < 1e3 ? meters + " m" : meters / 1e3 + " km";
          this._updateScale(this._mScale, label, meters / maxMeters);
        }, "_updateMetric"),
        _updateImperial: /* @__PURE__ */ __name(function(maxMeters) {
          var maxFeet = maxMeters * 3.2808399, maxMiles, miles, feet;
          if (maxFeet > 5280) {
            maxMiles = maxFeet / 5280;
            miles = this._getRoundNum(maxMiles);
            this._updateScale(this._iScale, miles + " mi", miles / maxMiles);
          } else {
            feet = this._getRoundNum(maxFeet);
            this._updateScale(this._iScale, feet + " ft", feet / maxFeet);
          }
        }, "_updateImperial"),
        _updateScale: /* @__PURE__ */ __name(function(scale2, text, ratio) {
          scale2.style.width = Math.round(this.options.maxWidth * ratio) + "px";
          scale2.innerHTML = text;
        }, "_updateScale"),
        _getRoundNum: /* @__PURE__ */ __name(function(num) {
          var pow10 = Math.pow(10, (Math.floor(num) + "").length - 1), d = num / pow10;
          d = d >= 10 ? 10 : d >= 5 ? 5 : d >= 3 ? 3 : d >= 2 ? 2 : 1;
          return pow10 * d;
        }, "_getRoundNum")
      });
      var scale = /* @__PURE__ */ __name(function(options) {
        return new Scale(options);
      }, "scale");
      var ukrainianFlag = '<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="12" height="8" viewBox="0 0 12 8" class="leaflet-attribution-flag"><path fill="#4C7BE1" d="M0 0h12v4H0z"/><path fill="#FFD500" d="M0 4h12v3H0z"/><path fill="#E0BC00" d="M0 7h12v1H0z"/></svg>';
      var Attribution = Control.extend({
        // @section
        // @aka Control.Attribution options
        options: {
          position: "bottomright",
          // @option prefix: String|false = 'Leaflet'
          // The HTML text shown before the attributions. Pass `false` to disable.
          prefix: '<a href="https://leafletjs.com" title="A JavaScript library for interactive maps">' + (Browser.inlineSvg ? ukrainianFlag + " " : "") + "Leaflet</a>"
        },
        initialize: /* @__PURE__ */ __name(function(options) {
          setOptions(this, options);
          this._attributions = {};
        }, "initialize"),
        onAdd: /* @__PURE__ */ __name(function(map) {
          map.attributionControl = this;
          this._container = create$1("div", "leaflet-control-attribution");
          disableClickPropagation(this._container);
          for (var i in map._layers) {
            if (map._layers[i].getAttribution) {
              this.addAttribution(map._layers[i].getAttribution());
            }
          }
          this._update();
          map.on("layeradd", this._addAttribution, this);
          return this._container;
        }, "onAdd"),
        onRemove: /* @__PURE__ */ __name(function(map) {
          map.off("layeradd", this._addAttribution, this);
        }, "onRemove"),
        _addAttribution: /* @__PURE__ */ __name(function(ev) {
          if (ev.layer.getAttribution) {
            this.addAttribution(ev.layer.getAttribution());
            ev.layer.once("remove", function() {
              this.removeAttribution(ev.layer.getAttribution());
            }, this);
          }
        }, "_addAttribution"),
        // @method setPrefix(prefix: String|false): this
        // The HTML text shown before the attributions. Pass `false` to disable.
        setPrefix: /* @__PURE__ */ __name(function(prefix) {
          this.options.prefix = prefix;
          this._update();
          return this;
        }, "setPrefix"),
        // @method addAttribution(text: String): this
        // Adds an attribution text (e.g. `'&copy; OpenStreetMap contributors'`).
        addAttribution: /* @__PURE__ */ __name(function(text) {
          if (!text) {
            return this;
          }
          if (!this._attributions[text]) {
            this._attributions[text] = 0;
          }
          this._attributions[text]++;
          this._update();
          return this;
        }, "addAttribution"),
        // @method removeAttribution(text: String): this
        // Removes an attribution text.
        removeAttribution: /* @__PURE__ */ __name(function(text) {
          if (!text) {
            return this;
          }
          if (this._attributions[text]) {
            this._attributions[text]--;
            this._update();
          }
          return this;
        }, "removeAttribution"),
        _update: /* @__PURE__ */ __name(function() {
          if (!this._map) {
            return;
          }
          var attribs = [];
          for (var i in this._attributions) {
            if (this._attributions[i]) {
              attribs.push(i);
            }
          }
          var prefixAndAttribs = [];
          if (this.options.prefix) {
            prefixAndAttribs.push(this.options.prefix);
          }
          if (attribs.length) {
            prefixAndAttribs.push(attribs.join(", "));
          }
          this._container.innerHTML = prefixAndAttribs.join(' <span aria-hidden="true">|</span> ');
        }, "_update")
      });
      Map2.mergeOptions({
        attributionControl: true
      });
      Map2.addInitHook(function() {
        if (this.options.attributionControl) {
          new Attribution().addTo(this);
        }
      });
      var attribution = /* @__PURE__ */ __name(function(options) {
        return new Attribution(options);
      }, "attribution");
      Control.Layers = Layers;
      Control.Zoom = Zoom;
      Control.Scale = Scale;
      Control.Attribution = Attribution;
      control.layers = layers;
      control.zoom = zoom;
      control.scale = scale;
      control.attribution = attribution;
      var Handler = Class.extend({
        initialize: /* @__PURE__ */ __name(function(map) {
          this._map = map;
        }, "initialize"),
        // @method enable(): this
        // Enables the handler
        enable: /* @__PURE__ */ __name(function() {
          if (this._enabled) {
            return this;
          }
          this._enabled = true;
          this.addHooks();
          return this;
        }, "enable"),
        // @method disable(): this
        // Disables the handler
        disable: /* @__PURE__ */ __name(function() {
          if (!this._enabled) {
            return this;
          }
          this._enabled = false;
          this.removeHooks();
          return this;
        }, "disable"),
        // @method enabled(): Boolean
        // Returns `true` if the handler is enabled
        enabled: /* @__PURE__ */ __name(function() {
          return !!this._enabled;
        }, "enabled")
        // @section Extension methods
        // Classes inheriting from `Handler` must implement the two following methods:
        // @method addHooks()
        // Called when the handler is enabled, should add event hooks.
        // @method removeHooks()
        // Called when the handler is disabled, should remove the event hooks added previously.
      });
      Handler.addTo = function(map, name) {
        map.addHandler(name, this);
        return this;
      };
      var Mixin = { Events };
      var START = Browser.touch ? "touchstart mousedown" : "mousedown";
      var Draggable = Evented.extend({
        options: {
          // @section
          // @aka Draggable options
          // @option clickTolerance: Number = 3
          // The max number of pixels a user can shift the mouse pointer during a click
          // for it to be considered a valid click (as opposed to a mouse drag).
          clickTolerance: 3
        },
        // @constructor L.Draggable(el: HTMLElement, dragHandle?: HTMLElement, preventOutline?: Boolean, options?: Draggable options)
        // Creates a `Draggable` object for moving `el` when you start dragging the `dragHandle` element (equals `el` itself by default).
        initialize: /* @__PURE__ */ __name(function(element, dragStartTarget, preventOutline2, options) {
          setOptions(this, options);
          this._element = element;
          this._dragStartTarget = dragStartTarget || element;
          this._preventOutline = preventOutline2;
        }, "initialize"),
        // @method enable()
        // Enables the dragging ability
        enable: /* @__PURE__ */ __name(function() {
          if (this._enabled) {
            return;
          }
          on(this._dragStartTarget, START, this._onDown, this);
          this._enabled = true;
        }, "enable"),
        // @method disable()
        // Disables the dragging ability
        disable: /* @__PURE__ */ __name(function() {
          if (!this._enabled) {
            return;
          }
          if (Draggable._dragging === this) {
            this.finishDrag(true);
          }
          off(this._dragStartTarget, START, this._onDown, this);
          this._enabled = false;
          this._moved = false;
        }, "disable"),
        _onDown: /* @__PURE__ */ __name(function(e) {
          if (!this._enabled) {
            return;
          }
          this._moved = false;
          if (hasClass2(this._element, "leaflet-zoom-anim")) {
            return;
          }
          if (e.touches && e.touches.length !== 1) {
            if (Draggable._dragging === this) {
              this.finishDrag();
            }
            return;
          }
          if (Draggable._dragging || e.shiftKey || e.which !== 1 && e.button !== 1 && !e.touches) {
            return;
          }
          Draggable._dragging = this;
          if (this._preventOutline) {
            preventOutline(this._element);
          }
          disableImageDrag();
          disableTextSelection();
          if (this._moving) {
            return;
          }
          this.fire("down");
          var first = e.touches ? e.touches[0] : e, sizedParent = getSizedParentNode(this._element);
          this._startPoint = new Point(first.clientX, first.clientY);
          this._startPos = getPosition(this._element);
          this._parentScale = getScale(sizedParent);
          var mouseevent = e.type === "mousedown";
          on(document, mouseevent ? "mousemove" : "touchmove", this._onMove, this);
          on(document, mouseevent ? "mouseup" : "touchend touchcancel", this._onUp, this);
        }, "_onDown"),
        _onMove: /* @__PURE__ */ __name(function(e) {
          if (!this._enabled) {
            return;
          }
          if (e.touches && e.touches.length > 1) {
            this._moved = true;
            return;
          }
          var first = e.touches && e.touches.length === 1 ? e.touches[0] : e, offset = new Point(first.clientX, first.clientY)._subtract(this._startPoint);
          if (!offset.x && !offset.y) {
            return;
          }
          if (Math.abs(offset.x) + Math.abs(offset.y) < this.options.clickTolerance) {
            return;
          }
          offset.x /= this._parentScale.x;
          offset.y /= this._parentScale.y;
          preventDefault(e);
          if (!this._moved) {
            this.fire("dragstart");
            this._moved = true;
            addClass2(document.body, "leaflet-dragging");
            this._lastTarget = e.target || e.srcElement;
            if (window.SVGElementInstance && this._lastTarget instanceof window.SVGElementInstance) {
              this._lastTarget = this._lastTarget.correspondingUseElement;
            }
            addClass2(this._lastTarget, "leaflet-drag-target");
          }
          this._newPos = this._startPos.add(offset);
          this._moving = true;
          this._lastEvent = e;
          this._updatePosition();
        }, "_onMove"),
        _updatePosition: /* @__PURE__ */ __name(function() {
          var e = { originalEvent: this._lastEvent };
          this.fire("predrag", e);
          setPosition(this._element, this._newPos);
          this.fire("drag", e);
        }, "_updatePosition"),
        _onUp: /* @__PURE__ */ __name(function() {
          if (!this._enabled) {
            return;
          }
          this.finishDrag();
        }, "_onUp"),
        finishDrag: /* @__PURE__ */ __name(function(noInertia) {
          removeClass2(document.body, "leaflet-dragging");
          if (this._lastTarget) {
            removeClass2(this._lastTarget, "leaflet-drag-target");
            this._lastTarget = null;
          }
          off(document, "mousemove touchmove", this._onMove, this);
          off(document, "mouseup touchend touchcancel", this._onUp, this);
          enableImageDrag();
          enableTextSelection();
          var fireDragend = this._moved && this._moving;
          this._moving = false;
          Draggable._dragging = false;
          if (fireDragend) {
            this.fire("dragend", {
              noInertia,
              distance: this._newPos.distanceTo(this._startPos)
            });
          }
        }, "finishDrag")
      });
      function clipPolygon(points, bounds, round) {
        var clippedPoints, edges = [1, 4, 2, 8], i, j, k, a, b, len, edge2, p;
        for (i = 0, len = points.length; i < len; i++) {
          points[i]._code = _getBitCode(points[i], bounds);
        }
        for (k = 0; k < 4; k++) {
          edge2 = edges[k];
          clippedPoints = [];
          for (i = 0, len = points.length, j = len - 1; i < len; j = i++) {
            a = points[i];
            b = points[j];
            if (!(a._code & edge2)) {
              if (b._code & edge2) {
                p = _getEdgeIntersection(b, a, edge2, bounds, round);
                p._code = _getBitCode(p, bounds);
                clippedPoints.push(p);
              }
              clippedPoints.push(a);
            } else if (!(b._code & edge2)) {
              p = _getEdgeIntersection(b, a, edge2, bounds, round);
              p._code = _getBitCode(p, bounds);
              clippedPoints.push(p);
            }
          }
          points = clippedPoints;
        }
        return points;
      }
      __name(clipPolygon, "clipPolygon");
      function polygonCenter(latlngs, crs) {
        var i, j, p1, p2, f, area, x, y, center;
        if (!latlngs || latlngs.length === 0) {
          throw new Error("latlngs not passed");
        }
        if (!isFlat(latlngs)) {
          console.warn("latlngs are not flat! Only the first ring will be used");
          latlngs = latlngs[0];
        }
        var centroidLatLng = toLatLng([0, 0]);
        var bounds = toLatLngBounds(latlngs);
        var areaBounds = bounds.getNorthWest().distanceTo(bounds.getSouthWest()) * bounds.getNorthEast().distanceTo(bounds.getNorthWest());
        if (areaBounds < 1700) {
          centroidLatLng = centroid(latlngs);
        }
        var len = latlngs.length;
        var points = [];
        for (i = 0; i < len; i++) {
          var latlng = toLatLng(latlngs[i]);
          points.push(crs.project(toLatLng([latlng.lat - centroidLatLng.lat, latlng.lng - centroidLatLng.lng])));
        }
        area = x = y = 0;
        for (i = 0, j = len - 1; i < len; j = i++) {
          p1 = points[i];
          p2 = points[j];
          f = p1.y * p2.x - p2.y * p1.x;
          x += (p1.x + p2.x) * f;
          y += (p1.y + p2.y) * f;
          area += f * 3;
        }
        if (area === 0) {
          center = points[0];
        } else {
          center = [x / area, y / area];
        }
        var latlngCenter = crs.unproject(toPoint(center));
        return toLatLng([latlngCenter.lat + centroidLatLng.lat, latlngCenter.lng + centroidLatLng.lng]);
      }
      __name(polygonCenter, "polygonCenter");
      function centroid(coords) {
        var latSum = 0;
        var lngSum = 0;
        var len = 0;
        for (var i = 0; i < coords.length; i++) {
          var latlng = toLatLng(coords[i]);
          latSum += latlng.lat;
          lngSum += latlng.lng;
          len++;
        }
        return toLatLng([latSum / len, lngSum / len]);
      }
      __name(centroid, "centroid");
      var PolyUtil = {
        __proto__: null,
        clipPolygon,
        polygonCenter,
        centroid
      };
      function simplify(points, tolerance) {
        if (!tolerance || !points.length) {
          return points.slice();
        }
        var sqTolerance = tolerance * tolerance;
        points = _reducePoints(points, sqTolerance);
        points = _simplifyDP(points, sqTolerance);
        return points;
      }
      __name(simplify, "simplify");
      function pointToSegmentDistance(p, p1, p2) {
        return Math.sqrt(_sqClosestPointOnSegment(p, p1, p2, true));
      }
      __name(pointToSegmentDistance, "pointToSegmentDistance");
      function closestPointOnSegment(p, p1, p2) {
        return _sqClosestPointOnSegment(p, p1, p2);
      }
      __name(closestPointOnSegment, "closestPointOnSegment");
      function _simplifyDP(points, sqTolerance) {
        var len = points.length, ArrayConstructor = typeof Uint8Array !== "undefined" ? Uint8Array : Array, markers = new ArrayConstructor(len);
        markers[0] = markers[len - 1] = 1;
        _simplifyDPStep(points, markers, sqTolerance, 0, len - 1);
        var i, newPoints = [];
        for (i = 0; i < len; i++) {
          if (markers[i]) {
            newPoints.push(points[i]);
          }
        }
        return newPoints;
      }
      __name(_simplifyDP, "_simplifyDP");
      function _simplifyDPStep(points, markers, sqTolerance, first, last) {
        var maxSqDist = 0, index2, i, sqDist;
        for (i = first + 1; i <= last - 1; i++) {
          sqDist = _sqClosestPointOnSegment(points[i], points[first], points[last], true);
          if (sqDist > maxSqDist) {
            index2 = i;
            maxSqDist = sqDist;
          }
        }
        if (maxSqDist > sqTolerance) {
          markers[index2] = 1;
          _simplifyDPStep(points, markers, sqTolerance, first, index2);
          _simplifyDPStep(points, markers, sqTolerance, index2, last);
        }
      }
      __name(_simplifyDPStep, "_simplifyDPStep");
      function _reducePoints(points, sqTolerance) {
        var reducedPoints = [points[0]];
        for (var i = 1, prev = 0, len = points.length; i < len; i++) {
          if (_sqDist(points[i], points[prev]) > sqTolerance) {
            reducedPoints.push(points[i]);
            prev = i;
          }
        }
        if (prev < len - 1) {
          reducedPoints.push(points[len - 1]);
        }
        return reducedPoints;
      }
      __name(_reducePoints, "_reducePoints");
      var _lastCode;
      function clipSegment(a, b, bounds, useLastCode, round) {
        var codeA = useLastCode ? _lastCode : _getBitCode(a, bounds), codeB = _getBitCode(b, bounds), codeOut, p, newCode;
        _lastCode = codeB;
        while (true) {
          if (!(codeA | codeB)) {
            return [a, b];
          }
          if (codeA & codeB) {
            return false;
          }
          codeOut = codeA || codeB;
          p = _getEdgeIntersection(a, b, codeOut, bounds, round);
          newCode = _getBitCode(p, bounds);
          if (codeOut === codeA) {
            a = p;
            codeA = newCode;
          } else {
            b = p;
            codeB = newCode;
          }
        }
      }
      __name(clipSegment, "clipSegment");
      function _getEdgeIntersection(a, b, code, bounds, round) {
        var dx = b.x - a.x, dy = b.y - a.y, min2 = bounds.min, max2 = bounds.max, x, y;
        if (code & 8) {
          x = a.x + dx * (max2.y - a.y) / dy;
          y = max2.y;
        } else if (code & 4) {
          x = a.x + dx * (min2.y - a.y) / dy;
          y = min2.y;
        } else if (code & 2) {
          x = max2.x;
          y = a.y + dy * (max2.x - a.x) / dx;
        } else if (code & 1) {
          x = min2.x;
          y = a.y + dy * (min2.x - a.x) / dx;
        }
        return new Point(x, y, round);
      }
      __name(_getEdgeIntersection, "_getEdgeIntersection");
      function _getBitCode(p, bounds) {
        var code = 0;
        if (p.x < bounds.min.x) {
          code |= 1;
        } else if (p.x > bounds.max.x) {
          code |= 2;
        }
        if (p.y < bounds.min.y) {
          code |= 4;
        } else if (p.y > bounds.max.y) {
          code |= 8;
        }
        return code;
      }
      __name(_getBitCode, "_getBitCode");
      function _sqDist(p1, p2) {
        var dx = p2.x - p1.x, dy = p2.y - p1.y;
        return dx * dx + dy * dy;
      }
      __name(_sqDist, "_sqDist");
      function _sqClosestPointOnSegment(p, p1, p2, sqDist) {
        var x = p1.x, y = p1.y, dx = p2.x - x, dy = p2.y - y, dot = dx * dx + dy * dy, t;
        if (dot > 0) {
          t = ((p.x - x) * dx + (p.y - y) * dy) / dot;
          if (t > 1) {
            x = p2.x;
            y = p2.y;
          } else if (t > 0) {
            x += dx * t;
            y += dy * t;
          }
        }
        dx = p.x - x;
        dy = p.y - y;
        return sqDist ? dx * dx + dy * dy : new Point(x, y);
      }
      __name(_sqClosestPointOnSegment, "_sqClosestPointOnSegment");
      function isFlat(latlngs) {
        return !isArray2(latlngs[0]) || typeof latlngs[0][0] !== "object" && typeof latlngs[0][0] !== "undefined";
      }
      __name(isFlat, "isFlat");
      function _flat(latlngs) {
        console.warn("Deprecated use of _flat, please use L.LineUtil.isFlat instead.");
        return isFlat(latlngs);
      }
      __name(_flat, "_flat");
      function polylineCenter(latlngs, crs) {
        var i, halfDist, segDist, dist, p1, p2, ratio, center;
        if (!latlngs || latlngs.length === 0) {
          throw new Error("latlngs not passed");
        }
        if (!isFlat(latlngs)) {
          console.warn("latlngs are not flat! Only the first ring will be used");
          latlngs = latlngs[0];
        }
        var centroidLatLng = toLatLng([0, 0]);
        var bounds = toLatLngBounds(latlngs);
        var areaBounds = bounds.getNorthWest().distanceTo(bounds.getSouthWest()) * bounds.getNorthEast().distanceTo(bounds.getNorthWest());
        if (areaBounds < 1700) {
          centroidLatLng = centroid(latlngs);
        }
        var len = latlngs.length;
        var points = [];
        for (i = 0; i < len; i++) {
          var latlng = toLatLng(latlngs[i]);
          points.push(crs.project(toLatLng([latlng.lat - centroidLatLng.lat, latlng.lng - centroidLatLng.lng])));
        }
        for (i = 0, halfDist = 0; i < len - 1; i++) {
          halfDist += points[i].distanceTo(points[i + 1]) / 2;
        }
        if (halfDist === 0) {
          center = points[0];
        } else {
          for (i = 0, dist = 0; i < len - 1; i++) {
            p1 = points[i];
            p2 = points[i + 1];
            segDist = p1.distanceTo(p2);
            dist += segDist;
            if (dist > halfDist) {
              ratio = (dist - halfDist) / segDist;
              center = [
                p2.x - ratio * (p2.x - p1.x),
                p2.y - ratio * (p2.y - p1.y)
              ];
              break;
            }
          }
        }
        var latlngCenter = crs.unproject(toPoint(center));
        return toLatLng([latlngCenter.lat + centroidLatLng.lat, latlngCenter.lng + centroidLatLng.lng]);
      }
      __name(polylineCenter, "polylineCenter");
      var LineUtil = {
        __proto__: null,
        simplify,
        pointToSegmentDistance,
        closestPointOnSegment,
        clipSegment,
        _getEdgeIntersection,
        _getBitCode,
        _sqClosestPointOnSegment,
        isFlat,
        _flat,
        polylineCenter
      };
      var LonLat = {
        project: /* @__PURE__ */ __name(function(latlng) {
          return new Point(latlng.lng, latlng.lat);
        }, "project"),
        unproject: /* @__PURE__ */ __name(function(point) {
          return new LatLng(point.y, point.x);
        }, "unproject"),
        bounds: new Bounds([-180, -90], [180, 90])
      };
      var Mercator = {
        R: 6378137,
        R_MINOR: 6356752314245179e-9,
        bounds: new Bounds([-2003750834279e-5, -1549657073972e-5], [2003750834279e-5, 1876465623138e-5]),
        project: /* @__PURE__ */ __name(function(latlng) {
          var d = Math.PI / 180, r = this.R, y = latlng.lat * d, tmp = this.R_MINOR / r, e = Math.sqrt(1 - tmp * tmp), con = e * Math.sin(y);
          var ts = Math.tan(Math.PI / 4 - y / 2) / Math.pow((1 - con) / (1 + con), e / 2);
          y = -r * Math.log(Math.max(ts, 1e-10));
          return new Point(latlng.lng * d * r, y);
        }, "project"),
        unproject: /* @__PURE__ */ __name(function(point) {
          var d = 180 / Math.PI, r = this.R, tmp = this.R_MINOR / r, e = Math.sqrt(1 - tmp * tmp), ts = Math.exp(-point.y / r), phi = Math.PI / 2 - 2 * Math.atan(ts);
          for (var i = 0, dphi = 0.1, con; i < 15 && Math.abs(dphi) > 1e-7; i++) {
            con = e * Math.sin(phi);
            con = Math.pow((1 - con) / (1 + con), e / 2);
            dphi = Math.PI / 2 - 2 * Math.atan(ts * con) - phi;
            phi += dphi;
          }
          return new LatLng(phi * d, point.x * d / r);
        }, "unproject")
      };
      var index = {
        __proto__: null,
        LonLat,
        Mercator,
        SphericalMercator
      };
      var EPSG3395 = extend({}, Earth, {
        code: "EPSG:3395",
        projection: Mercator,
        transformation: (function() {
          var scale2 = 0.5 / (Math.PI * Mercator.R);
          return toTransformation(scale2, 0.5, -scale2, 0.5);
        })()
      });
      var EPSG4326 = extend({}, Earth, {
        code: "EPSG:4326",
        projection: LonLat,
        transformation: toTransformation(1 / 180, 1, -1 / 180, 0.5)
      });
      var Simple = extend({}, CRS, {
        projection: LonLat,
        transformation: toTransformation(1, 0, -1, 0),
        scale: /* @__PURE__ */ __name(function(zoom2) {
          return Math.pow(2, zoom2);
        }, "scale"),
        zoom: /* @__PURE__ */ __name(function(scale2) {
          return Math.log(scale2) / Math.LN2;
        }, "zoom"),
        distance: /* @__PURE__ */ __name(function(latlng1, latlng2) {
          var dx = latlng2.lng - latlng1.lng, dy = latlng2.lat - latlng1.lat;
          return Math.sqrt(dx * dx + dy * dy);
        }, "distance"),
        infinite: true
      });
      CRS.Earth = Earth;
      CRS.EPSG3395 = EPSG3395;
      CRS.EPSG3857 = EPSG3857;
      CRS.EPSG900913 = EPSG900913;
      CRS.EPSG4326 = EPSG4326;
      CRS.Simple = Simple;
      var Layer = Evented.extend({
        // Classes extending `L.Layer` will inherit the following options:
        options: {
          // @option pane: String = 'overlayPane'
          // By default the layer will be added to the map's [overlay pane](#map-overlaypane). Overriding this option will cause the layer to be placed on another pane by default.
          pane: "overlayPane",
          // @option attribution: String = null
          // String to be shown in the attribution control, e.g. "© OpenStreetMap contributors". It describes the layer data and is often a legal obligation towards copyright holders and tile providers.
          attribution: null,
          bubblingMouseEvents: true
        },
        /* @section
         * Classes extending `L.Layer` will inherit the following methods:
         *
         * @method addTo(map: Map|LayerGroup): this
         * Adds the layer to the given map or layer group.
         */
        addTo: /* @__PURE__ */ __name(function(map) {
          map.addLayer(this);
          return this;
        }, "addTo"),
        // @method remove: this
        // Removes the layer from the map it is currently active on.
        remove: /* @__PURE__ */ __name(function() {
          return this.removeFrom(this._map || this._mapToAdd);
        }, "remove"),
        // @method removeFrom(map: Map): this
        // Removes the layer from the given map
        //
        // @alternative
        // @method removeFrom(group: LayerGroup): this
        // Removes the layer from the given `LayerGroup`
        removeFrom: /* @__PURE__ */ __name(function(obj) {
          if (obj) {
            obj.removeLayer(this);
          }
          return this;
        }, "removeFrom"),
        // @method getPane(name? : String): HTMLElement
        // Returns the `HTMLElement` representing the named pane on the map. If `name` is omitted, returns the pane for this layer.
        getPane: /* @__PURE__ */ __name(function(name) {
          return this._map.getPane(name ? this.options[name] || name : this.options.pane);
        }, "getPane"),
        addInteractiveTarget: /* @__PURE__ */ __name(function(targetEl) {
          this._map._targets[stamp(targetEl)] = this;
          return this;
        }, "addInteractiveTarget"),
        removeInteractiveTarget: /* @__PURE__ */ __name(function(targetEl) {
          delete this._map._targets[stamp(targetEl)];
          return this;
        }, "removeInteractiveTarget"),
        // @method getAttribution: String
        // Used by the `attribution control`, returns the [attribution option](#gridlayer-attribution).
        getAttribution: /* @__PURE__ */ __name(function() {
          return this.options.attribution;
        }, "getAttribution"),
        _layerAdd: /* @__PURE__ */ __name(function(e) {
          var map = e.target;
          if (!map.hasLayer(this)) {
            return;
          }
          this._map = map;
          this._zoomAnimated = map._zoomAnimated;
          if (this.getEvents) {
            var events = this.getEvents();
            map.on(events, this);
            this.once("remove", function() {
              map.off(events, this);
            }, this);
          }
          this.onAdd(map);
          this.fire("add");
          map.fire("layeradd", { layer: this });
        }, "_layerAdd")
      });
      Map2.include({
        // @method addLayer(layer: Layer): this
        // Adds the given layer to the map
        addLayer: /* @__PURE__ */ __name(function(layer) {
          if (!layer._layerAdd) {
            throw new Error("The provided object is not a Layer.");
          }
          var id = stamp(layer);
          if (this._layers[id]) {
            return this;
          }
          this._layers[id] = layer;
          layer._mapToAdd = this;
          if (layer.beforeAdd) {
            layer.beforeAdd(this);
          }
          this.whenReady(layer._layerAdd, layer);
          return this;
        }, "addLayer"),
        // @method removeLayer(layer: Layer): this
        // Removes the given layer from the map.
        removeLayer: /* @__PURE__ */ __name(function(layer) {
          var id = stamp(layer);
          if (!this._layers[id]) {
            return this;
          }
          if (this._loaded) {
            layer.onRemove(this);
          }
          delete this._layers[id];
          if (this._loaded) {
            this.fire("layerremove", { layer });
            layer.fire("remove");
          }
          layer._map = layer._mapToAdd = null;
          return this;
        }, "removeLayer"),
        // @method hasLayer(layer: Layer): Boolean
        // Returns `true` if the given layer is currently added to the map
        hasLayer: /* @__PURE__ */ __name(function(layer) {
          return stamp(layer) in this._layers;
        }, "hasLayer"),
        /* @method eachLayer(fn: Function, context?: Object): this
         * Iterates over the layers of the map, optionally specifying context of the iterator function.
         * ```
         * map.eachLayer(function(layer){
         *     layer.bindPopup('Hello');
         * });
         * ```
         */
        eachLayer: /* @__PURE__ */ __name(function(method, context) {
          for (var i in this._layers) {
            method.call(context, this._layers[i]);
          }
          return this;
        }, "eachLayer"),
        _addLayers: /* @__PURE__ */ __name(function(layers2) {
          layers2 = layers2 ? isArray2(layers2) ? layers2 : [layers2] : [];
          for (var i = 0, len = layers2.length; i < len; i++) {
            this.addLayer(layers2[i]);
          }
        }, "_addLayers"),
        _addZoomLimit: /* @__PURE__ */ __name(function(layer) {
          if (!isNaN(layer.options.maxZoom) || !isNaN(layer.options.minZoom)) {
            this._zoomBoundLayers[stamp(layer)] = layer;
            this._updateZoomLevels();
          }
        }, "_addZoomLimit"),
        _removeZoomLimit: /* @__PURE__ */ __name(function(layer) {
          var id = stamp(layer);
          if (this._zoomBoundLayers[id]) {
            delete this._zoomBoundLayers[id];
            this._updateZoomLevels();
          }
        }, "_removeZoomLimit"),
        _updateZoomLevels: /* @__PURE__ */ __name(function() {
          var minZoom = Infinity, maxZoom = -Infinity, oldZoomSpan = this._getZoomSpan();
          for (var i in this._zoomBoundLayers) {
            var options = this._zoomBoundLayers[i].options;
            minZoom = options.minZoom === void 0 ? minZoom : Math.min(minZoom, options.minZoom);
            maxZoom = options.maxZoom === void 0 ? maxZoom : Math.max(maxZoom, options.maxZoom);
          }
          this._layersMaxZoom = maxZoom === -Infinity ? void 0 : maxZoom;
          this._layersMinZoom = minZoom === Infinity ? void 0 : minZoom;
          if (oldZoomSpan !== this._getZoomSpan()) {
            this.fire("zoomlevelschange");
          }
          if (this.options.maxZoom === void 0 && this._layersMaxZoom && this.getZoom() > this._layersMaxZoom) {
            this.setZoom(this._layersMaxZoom);
          }
          if (this.options.minZoom === void 0 && this._layersMinZoom && this.getZoom() < this._layersMinZoom) {
            this.setZoom(this._layersMinZoom);
          }
        }, "_updateZoomLevels")
      });
      var LayerGroup = Layer.extend({
        initialize: /* @__PURE__ */ __name(function(layers2, options) {
          setOptions(this, options);
          this._layers = {};
          var i, len;
          if (layers2) {
            for (i = 0, len = layers2.length; i < len; i++) {
              this.addLayer(layers2[i]);
            }
          }
        }, "initialize"),
        // @method addLayer(layer: Layer): this
        // Adds the given layer to the group.
        addLayer: /* @__PURE__ */ __name(function(layer) {
          var id = this.getLayerId(layer);
          this._layers[id] = layer;
          if (this._map) {
            this._map.addLayer(layer);
          }
          return this;
        }, "addLayer"),
        // @method removeLayer(layer: Layer): this
        // Removes the given layer from the group.
        // @alternative
        // @method removeLayer(id: Number): this
        // Removes the layer with the given internal ID from the group.
        removeLayer: /* @__PURE__ */ __name(function(layer) {
          var id = layer in this._layers ? layer : this.getLayerId(layer);
          if (this._map && this._layers[id]) {
            this._map.removeLayer(this._layers[id]);
          }
          delete this._layers[id];
          return this;
        }, "removeLayer"),
        // @method hasLayer(layer: Layer): Boolean
        // Returns `true` if the given layer is currently added to the group.
        // @alternative
        // @method hasLayer(id: Number): Boolean
        // Returns `true` if the given internal ID is currently added to the group.
        hasLayer: /* @__PURE__ */ __name(function(layer) {
          var layerId = typeof layer === "number" ? layer : this.getLayerId(layer);
          return layerId in this._layers;
        }, "hasLayer"),
        // @method clearLayers(): this
        // Removes all the layers from the group.
        clearLayers: /* @__PURE__ */ __name(function() {
          return this.eachLayer(this.removeLayer, this);
        }, "clearLayers"),
        // @method invoke(methodName: String, …): this
        // Calls `methodName` on every layer contained in this group, passing any
        // additional parameters. Has no effect if the layers contained do not
        // implement `methodName`.
        invoke: /* @__PURE__ */ __name(function(methodName) {
          var args = Array.prototype.slice.call(arguments, 1), i, layer;
          for (i in this._layers) {
            layer = this._layers[i];
            if (layer[methodName]) {
              layer[methodName].apply(layer, args);
            }
          }
          return this;
        }, "invoke"),
        onAdd: /* @__PURE__ */ __name(function(map) {
          this.eachLayer(map.addLayer, map);
        }, "onAdd"),
        onRemove: /* @__PURE__ */ __name(function(map) {
          this.eachLayer(map.removeLayer, map);
        }, "onRemove"),
        // @method eachLayer(fn: Function, context?: Object): this
        // Iterates over the layers of the group, optionally specifying context of the iterator function.
        // ```js
        // group.eachLayer(function (layer) {
        // 	layer.bindPopup('Hello');
        // });
        // ```
        eachLayer: /* @__PURE__ */ __name(function(method, context) {
          for (var i in this._layers) {
            method.call(context, this._layers[i]);
          }
          return this;
        }, "eachLayer"),
        // @method getLayer(id: Number): Layer
        // Returns the layer with the given internal ID.
        getLayer: /* @__PURE__ */ __name(function(id) {
          return this._layers[id];
        }, "getLayer"),
        // @method getLayers(): Layer[]
        // Returns an array of all the layers added to the group.
        getLayers: /* @__PURE__ */ __name(function() {
          var layers2 = [];
          this.eachLayer(layers2.push, layers2);
          return layers2;
        }, "getLayers"),
        // @method setZIndex(zIndex: Number): this
        // Calls `setZIndex` on every layer contained in this group, passing the z-index.
        setZIndex: /* @__PURE__ */ __name(function(zIndex) {
          return this.invoke("setZIndex", zIndex);
        }, "setZIndex"),
        // @method getLayerId(layer: Layer): Number
        // Returns the internal ID for a layer
        getLayerId: /* @__PURE__ */ __name(function(layer) {
          return stamp(layer);
        }, "getLayerId")
      });
      var layerGroup = /* @__PURE__ */ __name(function(layers2, options) {
        return new LayerGroup(layers2, options);
      }, "layerGroup");
      var FeatureGroup = LayerGroup.extend({
        addLayer: /* @__PURE__ */ __name(function(layer) {
          if (this.hasLayer(layer)) {
            return this;
          }
          layer.addEventParent(this);
          LayerGroup.prototype.addLayer.call(this, layer);
          return this.fire("layeradd", { layer });
        }, "addLayer"),
        removeLayer: /* @__PURE__ */ __name(function(layer) {
          if (!this.hasLayer(layer)) {
            return this;
          }
          if (layer in this._layers) {
            layer = this._layers[layer];
          }
          layer.removeEventParent(this);
          LayerGroup.prototype.removeLayer.call(this, layer);
          return this.fire("layerremove", { layer });
        }, "removeLayer"),
        // @method setStyle(style: Path options): this
        // Sets the given path options to each layer of the group that has a `setStyle` method.
        setStyle: /* @__PURE__ */ __name(function(style3) {
          return this.invoke("setStyle", style3);
        }, "setStyle"),
        // @method bringToFront(): this
        // Brings the layer group to the top of all other layers
        bringToFront: /* @__PURE__ */ __name(function() {
          return this.invoke("bringToFront");
        }, "bringToFront"),
        // @method bringToBack(): this
        // Brings the layer group to the back of all other layers
        bringToBack: /* @__PURE__ */ __name(function() {
          return this.invoke("bringToBack");
        }, "bringToBack"),
        // @method getBounds(): LatLngBounds
        // Returns the LatLngBounds of the Feature Group (created from bounds and coordinates of its children).
        getBounds: /* @__PURE__ */ __name(function() {
          var bounds = new LatLngBounds();
          for (var id in this._layers) {
            var layer = this._layers[id];
            bounds.extend(layer.getBounds ? layer.getBounds() : layer.getLatLng());
          }
          return bounds;
        }, "getBounds")
      });
      var featureGroup = /* @__PURE__ */ __name(function(layers2, options) {
        return new FeatureGroup(layers2, options);
      }, "featureGroup");
      var Icon = Class.extend({
        /* @section
         * @aka Icon options
         *
         * @option iconUrl: String = null
         * **(required)** The URL to the icon image (absolute or relative to your script path).
         *
         * @option iconRetinaUrl: String = null
         * The URL to a retina sized version of the icon image (absolute or relative to your
         * script path). Used for Retina screen devices.
         *
         * @option iconSize: Point = null
         * Size of the icon image in pixels.
         *
         * @option iconAnchor: Point = null
         * The coordinates of the "tip" of the icon (relative to its top left corner). The icon
         * will be aligned so that this point is at the marker's geographical location. Centered
         * by default if size is specified, also can be set in CSS with negative margins.
         *
         * @option popupAnchor: Point = [0, 0]
         * The coordinates of the point from which popups will "open", relative to the icon anchor.
         *
         * @option tooltipAnchor: Point = [0, 0]
         * The coordinates of the point from which tooltips will "open", relative to the icon anchor.
         *
         * @option shadowUrl: String = null
         * The URL to the icon shadow image. If not specified, no shadow image will be created.
         *
         * @option shadowRetinaUrl: String = null
         *
         * @option shadowSize: Point = null
         * Size of the shadow image in pixels.
         *
         * @option shadowAnchor: Point = null
         * The coordinates of the "tip" of the shadow (relative to its top left corner) (the same
         * as iconAnchor if not specified).
         *
         * @option className: String = ''
         * A custom class name to assign to both icon and shadow images. Empty by default.
         */
        options: {
          popupAnchor: [0, 0],
          tooltipAnchor: [0, 0],
          // @option crossOrigin: Boolean|String = false
          // Whether the crossOrigin attribute will be added to the tiles.
          // If a String is provided, all tiles will have their crossOrigin attribute set to the String provided. This is needed if you want to access tile pixel data.
          // Refer to [CORS Settings](https://developer.mozilla.org/en-US/docs/Web/HTML/CORS_settings_attributes) for valid String values.
          crossOrigin: false
        },
        initialize: /* @__PURE__ */ __name(function(options) {
          setOptions(this, options);
        }, "initialize"),
        // @method createIcon(oldIcon?: HTMLElement): HTMLElement
        // Called internally when the icon has to be shown, returns a `<img>` HTML element
        // styled according to the options.
        createIcon: /* @__PURE__ */ __name(function(oldIcon) {
          return this._createIcon("icon", oldIcon);
        }, "createIcon"),
        // @method createShadow(oldIcon?: HTMLElement): HTMLElement
        // As `createIcon`, but for the shadow beneath it.
        createShadow: /* @__PURE__ */ __name(function(oldIcon) {
          return this._createIcon("shadow", oldIcon);
        }, "createShadow"),
        _createIcon: /* @__PURE__ */ __name(function(name, oldIcon) {
          var src = this._getIconUrl(name);
          if (!src) {
            if (name === "icon") {
              throw new Error("iconUrl not set in Icon options (see the docs).");
            }
            return null;
          }
          var img = this._createImg(src, oldIcon && oldIcon.tagName === "IMG" ? oldIcon : null);
          this._setIconStyles(img, name);
          if (this.options.crossOrigin || this.options.crossOrigin === "") {
            img.crossOrigin = this.options.crossOrigin === true ? "" : this.options.crossOrigin;
          }
          return img;
        }, "_createIcon"),
        _setIconStyles: /* @__PURE__ */ __name(function(img, name) {
          var options = this.options;
          var sizeOption = options[name + "Size"];
          if (typeof sizeOption === "number") {
            sizeOption = [sizeOption, sizeOption];
          }
          var size = toPoint(sizeOption), anchor = toPoint(name === "shadow" && options.shadowAnchor || options.iconAnchor || size && size.divideBy(2, true));
          img.className = "leaflet-marker-" + name + " " + (options.className || "");
          if (anchor) {
            img.style.marginLeft = -anchor.x + "px";
            img.style.marginTop = -anchor.y + "px";
          }
          if (size) {
            img.style.width = size.x + "px";
            img.style.height = size.y + "px";
          }
        }, "_setIconStyles"),
        _createImg: /* @__PURE__ */ __name(function(src, el) {
          el = el || document.createElement("img");
          el.src = src;
          return el;
        }, "_createImg"),
        _getIconUrl: /* @__PURE__ */ __name(function(name) {
          return Browser.retina && this.options[name + "RetinaUrl"] || this.options[name + "Url"];
        }, "_getIconUrl")
      });
      function icon(options) {
        return new Icon(options);
      }
      __name(icon, "icon");
      var IconDefault = Icon.extend({
        options: {
          iconUrl: "marker-icon.png",
          iconRetinaUrl: "marker-icon-2x.png",
          shadowUrl: "marker-shadow.png",
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          tooltipAnchor: [16, -28],
          shadowSize: [41, 41]
        },
        _getIconUrl: /* @__PURE__ */ __name(function(name) {
          if (typeof IconDefault.imagePath !== "string") {
            IconDefault.imagePath = this._detectIconPath();
          }
          return (this.options.imagePath || IconDefault.imagePath) + Icon.prototype._getIconUrl.call(this, name);
        }, "_getIconUrl"),
        _stripUrl: /* @__PURE__ */ __name(function(path) {
          var strip = /* @__PURE__ */ __name(function(str, re, idx) {
            var match = re.exec(str);
            return match && match[idx];
          }, "strip");
          path = strip(path, /^url\((['"])?(.+)\1\)$/, 2);
          return path && strip(path, /^(.*)marker-icon\.png$/, 1);
        }, "_stripUrl"),
        _detectIconPath: /* @__PURE__ */ __name(function() {
          var el = create$1("div", "leaflet-default-icon-path", document.body);
          var path = getStyle(el, "background-image") || getStyle(el, "backgroundImage");
          document.body.removeChild(el);
          path = this._stripUrl(path);
          if (path) {
            return path;
          }
          var link = document.querySelector('link[href$="leaflet.css"]');
          if (!link) {
            return "";
          }
          return link.href.substring(0, link.href.length - "leaflet.css".length - 1);
        }, "_detectIconPath")
      });
      var MarkerDrag = Handler.extend({
        initialize: /* @__PURE__ */ __name(function(marker2) {
          this._marker = marker2;
        }, "initialize"),
        addHooks: /* @__PURE__ */ __name(function() {
          var icon2 = this._marker._icon;
          if (!this._draggable) {
            this._draggable = new Draggable(icon2, icon2, true);
          }
          this._draggable.on({
            dragstart: this._onDragStart,
            predrag: this._onPreDrag,
            drag: this._onDrag,
            dragend: this._onDragEnd
          }, this).enable();
          addClass2(icon2, "leaflet-marker-draggable");
        }, "addHooks"),
        removeHooks: /* @__PURE__ */ __name(function() {
          this._draggable.off({
            dragstart: this._onDragStart,
            predrag: this._onPreDrag,
            drag: this._onDrag,
            dragend: this._onDragEnd
          }, this).disable();
          if (this._marker._icon) {
            removeClass2(this._marker._icon, "leaflet-marker-draggable");
          }
        }, "removeHooks"),
        moved: /* @__PURE__ */ __name(function() {
          return this._draggable && this._draggable._moved;
        }, "moved"),
        _adjustPan: /* @__PURE__ */ __name(function(e) {
          var marker2 = this._marker, map = marker2._map, speed = this._marker.options.autoPanSpeed, padding = this._marker.options.autoPanPadding, iconPos = getPosition(marker2._icon), bounds = map.getPixelBounds(), origin = map.getPixelOrigin();
          var panBounds = toBounds(
            bounds.min._subtract(origin).add(padding),
            bounds.max._subtract(origin).subtract(padding)
          );
          if (!panBounds.contains(iconPos)) {
            var movement = toPoint(
              (Math.max(panBounds.max.x, iconPos.x) - panBounds.max.x) / (bounds.max.x - panBounds.max.x) - (Math.min(panBounds.min.x, iconPos.x) - panBounds.min.x) / (bounds.min.x - panBounds.min.x),
              (Math.max(panBounds.max.y, iconPos.y) - panBounds.max.y) / (bounds.max.y - panBounds.max.y) - (Math.min(panBounds.min.y, iconPos.y) - panBounds.min.y) / (bounds.min.y - panBounds.min.y)
            ).multiplyBy(speed);
            map.panBy(movement, { animate: false });
            this._draggable._newPos._add(movement);
            this._draggable._startPos._add(movement);
            setPosition(marker2._icon, this._draggable._newPos);
            this._onDrag(e);
            this._panRequest = requestAnimFrame(this._adjustPan.bind(this, e));
          }
        }, "_adjustPan"),
        _onDragStart: /* @__PURE__ */ __name(function() {
          this._oldLatLng = this._marker.getLatLng();
          this._marker.closePopup && this._marker.closePopup();
          this._marker.fire("movestart").fire("dragstart");
        }, "_onDragStart"),
        _onPreDrag: /* @__PURE__ */ __name(function(e) {
          if (this._marker.options.autoPan) {
            cancelAnimFrame(this._panRequest);
            this._panRequest = requestAnimFrame(this._adjustPan.bind(this, e));
          }
        }, "_onPreDrag"),
        _onDrag: /* @__PURE__ */ __name(function(e) {
          var marker2 = this._marker, shadow = marker2._shadow, iconPos = getPosition(marker2._icon), latlng = marker2._map.layerPointToLatLng(iconPos);
          if (shadow) {
            setPosition(shadow, iconPos);
          }
          marker2._latlng = latlng;
          e.latlng = latlng;
          e.oldLatLng = this._oldLatLng;
          marker2.fire("move", e).fire("drag", e);
        }, "_onDrag"),
        _onDragEnd: /* @__PURE__ */ __name(function(e) {
          cancelAnimFrame(this._panRequest);
          delete this._oldLatLng;
          this._marker.fire("moveend").fire("dragend", e);
        }, "_onDragEnd")
      });
      var Marker = Layer.extend({
        // @section
        // @aka Marker options
        options: {
          // @option icon: Icon = *
          // Icon instance to use for rendering the marker.
          // See [Icon documentation](#L.Icon) for details on how to customize the marker icon.
          // If not specified, a common instance of `L.Icon.Default` is used.
          icon: new IconDefault(),
          // Option inherited from "Interactive layer" abstract class
          interactive: true,
          // @option keyboard: Boolean = true
          // Whether the marker can be tabbed to with a keyboard and clicked by pressing enter.
          keyboard: true,
          // @option title: String = ''
          // Text for the browser tooltip that appear on marker hover (no tooltip by default).
          // [Useful for accessibility](https://leafletjs.com/examples/accessibility/#markers-must-be-labelled).
          title: "",
          // @option alt: String = 'Marker'
          // Text for the `alt` attribute of the icon image.
          // [Useful for accessibility](https://leafletjs.com/examples/accessibility/#markers-must-be-labelled).
          alt: "Marker",
          // @option zIndexOffset: Number = 0
          // By default, marker images zIndex is set automatically based on its latitude. Use this option if you want to put the marker on top of all others (or below), specifying a high value like `1000` (or high negative value, respectively).
          zIndexOffset: 0,
          // @option opacity: Number = 1.0
          // The opacity of the marker.
          opacity: 1,
          // @option riseOnHover: Boolean = false
          // If `true`, the marker will get on top of others when you hover the mouse over it.
          riseOnHover: false,
          // @option riseOffset: Number = 250
          // The z-index offset used for the `riseOnHover` feature.
          riseOffset: 250,
          // @option pane: String = 'markerPane'
          // `Map pane` where the markers icon will be added.
          pane: "markerPane",
          // @option shadowPane: String = 'shadowPane'
          // `Map pane` where the markers shadow will be added.
          shadowPane: "shadowPane",
          // @option bubblingMouseEvents: Boolean = false
          // When `true`, a mouse event on this marker will trigger the same event on the map
          // (unless [`L.DomEvent.stopPropagation`](#domevent-stoppropagation) is used).
          bubblingMouseEvents: false,
          // @option autoPanOnFocus: Boolean = true
          // When `true`, the map will pan whenever the marker is focused (via
          // e.g. pressing `tab` on the keyboard) to ensure the marker is
          // visible within the map's bounds
          autoPanOnFocus: true,
          // @section Draggable marker options
          // @option draggable: Boolean = false
          // Whether the marker is draggable with mouse/touch or not.
          draggable: false,
          // @option autoPan: Boolean = false
          // Whether to pan the map when dragging this marker near its edge or not.
          autoPan: false,
          // @option autoPanPadding: Point = Point(50, 50)
          // Distance (in pixels to the left/right and to the top/bottom) of the
          // map edge to start panning the map.
          autoPanPadding: [50, 50],
          // @option autoPanSpeed: Number = 10
          // Number of pixels the map should pan by.
          autoPanSpeed: 10
        },
        /* @section
         *
         * In addition to [shared layer methods](#Layer) like `addTo()` and `remove()` and [popup methods](#Popup) like bindPopup() you can also use the following methods:
         */
        initialize: /* @__PURE__ */ __name(function(latlng, options) {
          setOptions(this, options);
          this._latlng = toLatLng(latlng);
        }, "initialize"),
        onAdd: /* @__PURE__ */ __name(function(map) {
          this._zoomAnimated = this._zoomAnimated && map.options.markerZoomAnimation;
          if (this._zoomAnimated) {
            map.on("zoomanim", this._animateZoom, this);
          }
          this._initIcon();
          this.update();
        }, "onAdd"),
        onRemove: /* @__PURE__ */ __name(function(map) {
          if (this.dragging && this.dragging.enabled()) {
            this.options.draggable = true;
            this.dragging.removeHooks();
          }
          delete this.dragging;
          if (this._zoomAnimated) {
            map.off("zoomanim", this._animateZoom, this);
          }
          this._removeIcon();
          this._removeShadow();
        }, "onRemove"),
        getEvents: /* @__PURE__ */ __name(function() {
          return {
            zoom: this.update,
            viewreset: this.update
          };
        }, "getEvents"),
        // @method getLatLng: LatLng
        // Returns the current geographical position of the marker.
        getLatLng: /* @__PURE__ */ __name(function() {
          return this._latlng;
        }, "getLatLng"),
        // @method setLatLng(latlng: LatLng): this
        // Changes the marker position to the given point.
        setLatLng: /* @__PURE__ */ __name(function(latlng) {
          var oldLatLng = this._latlng;
          this._latlng = toLatLng(latlng);
          this.update();
          return this.fire("move", { oldLatLng, latlng: this._latlng });
        }, "setLatLng"),
        // @method setZIndexOffset(offset: Number): this
        // Changes the [zIndex offset](#marker-zindexoffset) of the marker.
        setZIndexOffset: /* @__PURE__ */ __name(function(offset) {
          this.options.zIndexOffset = offset;
          return this.update();
        }, "setZIndexOffset"),
        // @method getIcon: Icon
        // Returns the current icon used by the marker
        getIcon: /* @__PURE__ */ __name(function() {
          return this.options.icon;
        }, "getIcon"),
        // @method setIcon(icon: Icon): this
        // Changes the marker icon.
        setIcon: /* @__PURE__ */ __name(function(icon2) {
          this.options.icon = icon2;
          if (this._map) {
            this._initIcon();
            this.update();
          }
          if (this._popup) {
            this.bindPopup(this._popup, this._popup.options);
          }
          return this;
        }, "setIcon"),
        getElement: /* @__PURE__ */ __name(function() {
          return this._icon;
        }, "getElement"),
        update: /* @__PURE__ */ __name(function() {
          if (this._icon && this._map) {
            var pos = this._map.latLngToLayerPoint(this._latlng).round();
            this._setPos(pos);
          }
          return this;
        }, "update"),
        _initIcon: /* @__PURE__ */ __name(function() {
          var options = this.options, classToAdd = "leaflet-zoom-" + (this._zoomAnimated ? "animated" : "hide");
          var icon2 = options.icon.createIcon(this._icon), addIcon = false;
          if (icon2 !== this._icon) {
            if (this._icon) {
              this._removeIcon();
            }
            addIcon = true;
            if (options.title) {
              icon2.title = options.title;
            }
            if (icon2.tagName === "IMG") {
              icon2.alt = options.alt || "";
            }
          }
          addClass2(icon2, classToAdd);
          if (options.keyboard) {
            icon2.tabIndex = "0";
            icon2.setAttribute("role", "button");
          }
          this._icon = icon2;
          if (options.riseOnHover) {
            this.on({
              mouseover: this._bringToFront,
              mouseout: this._resetZIndex
            });
          }
          if (this.options.autoPanOnFocus) {
            on(icon2, "focus", this._panOnFocus, this);
          }
          var newShadow = options.icon.createShadow(this._shadow), addShadow = false;
          if (newShadow !== this._shadow) {
            this._removeShadow();
            addShadow = true;
          }
          if (newShadow) {
            addClass2(newShadow, classToAdd);
            newShadow.alt = "";
          }
          this._shadow = newShadow;
          if (options.opacity < 1) {
            this._updateOpacity();
          }
          if (addIcon) {
            this.getPane().appendChild(this._icon);
          }
          this._initInteraction();
          if (newShadow && addShadow) {
            this.getPane(options.shadowPane).appendChild(this._shadow);
          }
        }, "_initIcon"),
        _removeIcon: /* @__PURE__ */ __name(function() {
          if (this.options.riseOnHover) {
            this.off({
              mouseover: this._bringToFront,
              mouseout: this._resetZIndex
            });
          }
          if (this.options.autoPanOnFocus) {
            off(this._icon, "focus", this._panOnFocus, this);
          }
          remove2(this._icon);
          this.removeInteractiveTarget(this._icon);
          this._icon = null;
        }, "_removeIcon"),
        _removeShadow: /* @__PURE__ */ __name(function() {
          if (this._shadow) {
            remove2(this._shadow);
          }
          this._shadow = null;
        }, "_removeShadow"),
        _setPos: /* @__PURE__ */ __name(function(pos) {
          if (this._icon) {
            setPosition(this._icon, pos);
          }
          if (this._shadow) {
            setPosition(this._shadow, pos);
          }
          this._zIndex = pos.y + this.options.zIndexOffset;
          this._resetZIndex();
        }, "_setPos"),
        _updateZIndex: /* @__PURE__ */ __name(function(offset) {
          if (this._icon) {
            this._icon.style.zIndex = this._zIndex + offset;
          }
        }, "_updateZIndex"),
        _animateZoom: /* @__PURE__ */ __name(function(opt) {
          var pos = this._map._latLngToNewLayerPoint(this._latlng, opt.zoom, opt.center).round();
          this._setPos(pos);
        }, "_animateZoom"),
        _initInteraction: /* @__PURE__ */ __name(function() {
          if (!this.options.interactive) {
            return;
          }
          addClass2(this._icon, "leaflet-interactive");
          this.addInteractiveTarget(this._icon);
          if (MarkerDrag) {
            var draggable = this.options.draggable;
            if (this.dragging) {
              draggable = this.dragging.enabled();
              this.dragging.disable();
            }
            this.dragging = new MarkerDrag(this);
            if (draggable) {
              this.dragging.enable();
            }
          }
        }, "_initInteraction"),
        // @method setOpacity(opacity: Number): this
        // Changes the opacity of the marker.
        setOpacity: /* @__PURE__ */ __name(function(opacity) {
          this.options.opacity = opacity;
          if (this._map) {
            this._updateOpacity();
          }
          return this;
        }, "setOpacity"),
        _updateOpacity: /* @__PURE__ */ __name(function() {
          var opacity = this.options.opacity;
          if (this._icon) {
            setOpacity(this._icon, opacity);
          }
          if (this._shadow) {
            setOpacity(this._shadow, opacity);
          }
        }, "_updateOpacity"),
        _bringToFront: /* @__PURE__ */ __name(function() {
          this._updateZIndex(this.options.riseOffset);
        }, "_bringToFront"),
        _resetZIndex: /* @__PURE__ */ __name(function() {
          this._updateZIndex(0);
        }, "_resetZIndex"),
        _panOnFocus: /* @__PURE__ */ __name(function() {
          var map = this._map;
          if (!map) {
            return;
          }
          var iconOpts = this.options.icon.options;
          var size = iconOpts.iconSize ? toPoint(iconOpts.iconSize) : toPoint(0, 0);
          var anchor = iconOpts.iconAnchor ? toPoint(iconOpts.iconAnchor) : toPoint(0, 0);
          map.panInside(this._latlng, {
            paddingTopLeft: anchor,
            paddingBottomRight: size.subtract(anchor)
          });
        }, "_panOnFocus"),
        _getPopupAnchor: /* @__PURE__ */ __name(function() {
          return this.options.icon.options.popupAnchor;
        }, "_getPopupAnchor"),
        _getTooltipAnchor: /* @__PURE__ */ __name(function() {
          return this.options.icon.options.tooltipAnchor;
        }, "_getTooltipAnchor")
      });
      function marker(latlng, options) {
        return new Marker(latlng, options);
      }
      __name(marker, "marker");
      var Path = Layer.extend({
        // @section
        // @aka Path options
        options: {
          // @option stroke: Boolean = true
          // Whether to draw stroke along the path. Set it to `false` to disable borders on polygons or circles.
          stroke: true,
          // @option color: String = '#3388ff'
          // Stroke color
          color: "#3388ff",
          // @option weight: Number = 3
          // Stroke width in pixels
          weight: 3,
          // @option opacity: Number = 1.0
          // Stroke opacity
          opacity: 1,
          // @option lineCap: String= 'round'
          // A string that defines [shape to be used at the end](https://developer.mozilla.org/docs/Web/SVG/Attribute/stroke-linecap) of the stroke.
          lineCap: "round",
          // @option lineJoin: String = 'round'
          // A string that defines [shape to be used at the corners](https://developer.mozilla.org/docs/Web/SVG/Attribute/stroke-linejoin) of the stroke.
          lineJoin: "round",
          // @option dashArray: String = null
          // A string that defines the stroke [dash pattern](https://developer.mozilla.org/docs/Web/SVG/Attribute/stroke-dasharray). Doesn't work on `Canvas`-powered layers in [some old browsers](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/setLineDash#Browser_compatibility).
          dashArray: null,
          // @option dashOffset: String = null
          // A string that defines the [distance into the dash pattern to start the dash](https://developer.mozilla.org/docs/Web/SVG/Attribute/stroke-dashoffset). Doesn't work on `Canvas`-powered layers in [some old browsers](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/setLineDash#Browser_compatibility).
          dashOffset: null,
          // @option fill: Boolean = depends
          // Whether to fill the path with color. Set it to `false` to disable filling on polygons or circles.
          fill: false,
          // @option fillColor: String = *
          // Fill color. Defaults to the value of the [`color`](#path-color) option
          fillColor: null,
          // @option fillOpacity: Number = 0.2
          // Fill opacity.
          fillOpacity: 0.2,
          // @option fillRule: String = 'evenodd'
          // A string that defines [how the inside of a shape](https://developer.mozilla.org/docs/Web/SVG/Attribute/fill-rule) is determined.
          fillRule: "evenodd",
          // className: '',
          // Option inherited from "Interactive layer" abstract class
          interactive: true,
          // @option bubblingMouseEvents: Boolean = true
          // When `true`, a mouse event on this path will trigger the same event on the map
          // (unless [`L.DomEvent.stopPropagation`](#domevent-stoppropagation) is used).
          bubblingMouseEvents: true
        },
        beforeAdd: /* @__PURE__ */ __name(function(map) {
          this._renderer = map.getRenderer(this);
        }, "beforeAdd"),
        onAdd: /* @__PURE__ */ __name(function() {
          this._renderer._initPath(this);
          this._reset();
          this._renderer._addPath(this);
        }, "onAdd"),
        onRemove: /* @__PURE__ */ __name(function() {
          this._renderer._removePath(this);
        }, "onRemove"),
        // @method redraw(): this
        // Redraws the layer. Sometimes useful after you changed the coordinates that the path uses.
        redraw: /* @__PURE__ */ __name(function() {
          if (this._map) {
            this._renderer._updatePath(this);
          }
          return this;
        }, "redraw"),
        // @method setStyle(style: Path options): this
        // Changes the appearance of a Path based on the options in the `Path options` object.
        setStyle: /* @__PURE__ */ __name(function(style3) {
          setOptions(this, style3);
          if (this._renderer) {
            this._renderer._updateStyle(this);
            if (this.options.stroke && style3 && Object.prototype.hasOwnProperty.call(style3, "weight")) {
              this._updateBounds();
            }
          }
          return this;
        }, "setStyle"),
        // @method bringToFront(): this
        // Brings the layer to the top of all path layers.
        bringToFront: /* @__PURE__ */ __name(function() {
          if (this._renderer) {
            this._renderer._bringToFront(this);
          }
          return this;
        }, "bringToFront"),
        // @method bringToBack(): this
        // Brings the layer to the bottom of all path layers.
        bringToBack: /* @__PURE__ */ __name(function() {
          if (this._renderer) {
            this._renderer._bringToBack(this);
          }
          return this;
        }, "bringToBack"),
        getElement: /* @__PURE__ */ __name(function() {
          return this._path;
        }, "getElement"),
        _reset: /* @__PURE__ */ __name(function() {
          this._project();
          this._update();
        }, "_reset"),
        _clickTolerance: /* @__PURE__ */ __name(function() {
          return (this.options.stroke ? this.options.weight / 2 : 0) + (this._renderer.options.tolerance || 0);
        }, "_clickTolerance")
      });
      var CircleMarker = Path.extend({
        // @section
        // @aka CircleMarker options
        options: {
          fill: true,
          // @option radius: Number = 10
          // Radius of the circle marker, in pixels
          radius: 10
        },
        initialize: /* @__PURE__ */ __name(function(latlng, options) {
          setOptions(this, options);
          this._latlng = toLatLng(latlng);
          this._radius = this.options.radius;
        }, "initialize"),
        // @method setLatLng(latLng: LatLng): this
        // Sets the position of a circle marker to a new location.
        setLatLng: /* @__PURE__ */ __name(function(latlng) {
          var oldLatLng = this._latlng;
          this._latlng = toLatLng(latlng);
          this.redraw();
          return this.fire("move", { oldLatLng, latlng: this._latlng });
        }, "setLatLng"),
        // @method getLatLng(): LatLng
        // Returns the current geographical position of the circle marker
        getLatLng: /* @__PURE__ */ __name(function() {
          return this._latlng;
        }, "getLatLng"),
        // @method setRadius(radius: Number): this
        // Sets the radius of a circle marker. Units are in pixels.
        setRadius: /* @__PURE__ */ __name(function(radius) {
          this.options.radius = this._radius = radius;
          return this.redraw();
        }, "setRadius"),
        // @method getRadius(): Number
        // Returns the current radius of the circle
        getRadius: /* @__PURE__ */ __name(function() {
          return this._radius;
        }, "getRadius"),
        setStyle: /* @__PURE__ */ __name(function(options) {
          var radius = options && options.radius || this._radius;
          Path.prototype.setStyle.call(this, options);
          this.setRadius(radius);
          return this;
        }, "setStyle"),
        _project: /* @__PURE__ */ __name(function() {
          this._point = this._map.latLngToLayerPoint(this._latlng);
          this._updateBounds();
        }, "_project"),
        _updateBounds: /* @__PURE__ */ __name(function() {
          var r = this._radius, r2 = this._radiusY || r, w = this._clickTolerance(), p = [r + w, r2 + w];
          this._pxBounds = new Bounds(this._point.subtract(p), this._point.add(p));
        }, "_updateBounds"),
        _update: /* @__PURE__ */ __name(function() {
          if (this._map) {
            this._updatePath();
          }
        }, "_update"),
        _updatePath: /* @__PURE__ */ __name(function() {
          this._renderer._updateCircle(this);
        }, "_updatePath"),
        _empty: /* @__PURE__ */ __name(function() {
          return this._radius && !this._renderer._bounds.intersects(this._pxBounds);
        }, "_empty"),
        // Needed by the `Canvas` renderer for interactivity
        _containsPoint: /* @__PURE__ */ __name(function(p) {
          return p.distanceTo(this._point) <= this._radius + this._clickTolerance();
        }, "_containsPoint")
      });
      function circleMarker(latlng, options) {
        return new CircleMarker(latlng, options);
      }
      __name(circleMarker, "circleMarker");
      var Circle = CircleMarker.extend({
        initialize: /* @__PURE__ */ __name(function(latlng, options, legacyOptions) {
          if (typeof options === "number") {
            options = extend({}, legacyOptions, { radius: options });
          }
          setOptions(this, options);
          this._latlng = toLatLng(latlng);
          if (isNaN(this.options.radius)) {
            throw new Error("Circle radius cannot be NaN");
          }
          this._mRadius = this.options.radius;
        }, "initialize"),
        // @method setRadius(radius: Number): this
        // Sets the radius of a circle. Units are in meters.
        setRadius: /* @__PURE__ */ __name(function(radius) {
          this._mRadius = radius;
          return this.redraw();
        }, "setRadius"),
        // @method getRadius(): Number
        // Returns the current radius of a circle. Units are in meters.
        getRadius: /* @__PURE__ */ __name(function() {
          return this._mRadius;
        }, "getRadius"),
        // @method getBounds(): LatLngBounds
        // Returns the `LatLngBounds` of the path.
        getBounds: /* @__PURE__ */ __name(function() {
          var half = [this._radius, this._radiusY || this._radius];
          return new LatLngBounds(
            this._map.layerPointToLatLng(this._point.subtract(half)),
            this._map.layerPointToLatLng(this._point.add(half))
          );
        }, "getBounds"),
        setStyle: Path.prototype.setStyle,
        _project: /* @__PURE__ */ __name(function() {
          var lng = this._latlng.lng, lat = this._latlng.lat, map = this._map, crs = map.options.crs;
          if (crs.distance === Earth.distance) {
            var d = Math.PI / 180, latR = this._mRadius / Earth.R / d, top = map.project([lat + latR, lng]), bottom = map.project([lat - latR, lng]), p = top.add(bottom).divideBy(2), lat2 = map.unproject(p).lat, lngR = Math.acos((Math.cos(latR * d) - Math.sin(lat * d) * Math.sin(lat2 * d)) / (Math.cos(lat * d) * Math.cos(lat2 * d))) / d;
            if (isNaN(lngR) || lngR === 0) {
              lngR = latR / Math.cos(Math.PI / 180 * lat);
            }
            this._point = p.subtract(map.getPixelOrigin());
            this._radius = isNaN(lngR) ? 0 : p.x - map.project([lat2, lng - lngR]).x;
            this._radiusY = p.y - top.y;
          } else {
            var latlng2 = crs.unproject(crs.project(this._latlng).subtract([this._mRadius, 0]));
            this._point = map.latLngToLayerPoint(this._latlng);
            this._radius = this._point.x - map.latLngToLayerPoint(latlng2).x;
          }
          this._updateBounds();
        }, "_project")
      });
      function circle(latlng, options, legacyOptions) {
        return new Circle(latlng, options, legacyOptions);
      }
      __name(circle, "circle");
      var Polyline = Path.extend({
        // @section
        // @aka Polyline options
        options: {
          // @option smoothFactor: Number = 1.0
          // How much to simplify the polyline on each zoom level. More means
          // better performance and smoother look, and less means more accurate representation.
          smoothFactor: 1,
          // @option noClip: Boolean = false
          // Disable polyline clipping.
          noClip: false
        },
        initialize: /* @__PURE__ */ __name(function(latlngs, options) {
          setOptions(this, options);
          this._setLatLngs(latlngs);
        }, "initialize"),
        // @method getLatLngs(): LatLng[]
        // Returns an array of the points in the path, or nested arrays of points in case of multi-polyline.
        getLatLngs: /* @__PURE__ */ __name(function() {
          return this._latlngs;
        }, "getLatLngs"),
        // @method setLatLngs(latlngs: LatLng[]): this
        // Replaces all the points in the polyline with the given array of geographical points.
        setLatLngs: /* @__PURE__ */ __name(function(latlngs) {
          this._setLatLngs(latlngs);
          return this.redraw();
        }, "setLatLngs"),
        // @method isEmpty(): Boolean
        // Returns `true` if the Polyline has no LatLngs.
        isEmpty: /* @__PURE__ */ __name(function() {
          return !this._latlngs.length;
        }, "isEmpty"),
        // @method closestLayerPoint(p: Point): Point
        // Returns the point closest to `p` on the Polyline.
        closestLayerPoint: /* @__PURE__ */ __name(function(p) {
          var minDistance = Infinity, minPoint = null, closest2 = _sqClosestPointOnSegment, p1, p2;
          for (var j = 0, jLen = this._parts.length; j < jLen; j++) {
            var points = this._parts[j];
            for (var i = 1, len = points.length; i < len; i++) {
              p1 = points[i - 1];
              p2 = points[i];
              var sqDist = closest2(p, p1, p2, true);
              if (sqDist < minDistance) {
                minDistance = sqDist;
                minPoint = closest2(p, p1, p2);
              }
            }
          }
          if (minPoint) {
            minPoint.distance = Math.sqrt(minDistance);
          }
          return minPoint;
        }, "closestLayerPoint"),
        // @method getCenter(): LatLng
        // Returns the center ([centroid](https://en.wikipedia.org/wiki/Centroid)) of the polyline.
        getCenter: /* @__PURE__ */ __name(function() {
          if (!this._map) {
            throw new Error("Must add layer to map before using getCenter()");
          }
          return polylineCenter(this._defaultShape(), this._map.options.crs);
        }, "getCenter"),
        // @method getBounds(): LatLngBounds
        // Returns the `LatLngBounds` of the path.
        getBounds: /* @__PURE__ */ __name(function() {
          return this._bounds;
        }, "getBounds"),
        // @method addLatLng(latlng: LatLng, latlngs?: LatLng[]): this
        // Adds a given point to the polyline. By default, adds to the first ring of
        // the polyline in case of a multi-polyline, but can be overridden by passing
        // a specific ring as a LatLng array (that you can earlier access with [`getLatLngs`](#polyline-getlatlngs)).
        addLatLng: /* @__PURE__ */ __name(function(latlng, latlngs) {
          latlngs = latlngs || this._defaultShape();
          latlng = toLatLng(latlng);
          latlngs.push(latlng);
          this._bounds.extend(latlng);
          return this.redraw();
        }, "addLatLng"),
        _setLatLngs: /* @__PURE__ */ __name(function(latlngs) {
          this._bounds = new LatLngBounds();
          this._latlngs = this._convertLatLngs(latlngs);
        }, "_setLatLngs"),
        _defaultShape: /* @__PURE__ */ __name(function() {
          return isFlat(this._latlngs) ? this._latlngs : this._latlngs[0];
        }, "_defaultShape"),
        // recursively convert latlngs input into actual LatLng instances; calculate bounds along the way
        _convertLatLngs: /* @__PURE__ */ __name(function(latlngs) {
          var result = [], flat = isFlat(latlngs);
          for (var i = 0, len = latlngs.length; i < len; i++) {
            if (flat) {
              result[i] = toLatLng(latlngs[i]);
              this._bounds.extend(result[i]);
            } else {
              result[i] = this._convertLatLngs(latlngs[i]);
            }
          }
          return result;
        }, "_convertLatLngs"),
        _project: /* @__PURE__ */ __name(function() {
          var pxBounds = new Bounds();
          this._rings = [];
          this._projectLatlngs(this._latlngs, this._rings, pxBounds);
          if (this._bounds.isValid() && pxBounds.isValid()) {
            this._rawPxBounds = pxBounds;
            this._updateBounds();
          }
        }, "_project"),
        _updateBounds: /* @__PURE__ */ __name(function() {
          var w = this._clickTolerance(), p = new Point(w, w);
          if (!this._rawPxBounds) {
            return;
          }
          this._pxBounds = new Bounds([
            this._rawPxBounds.min.subtract(p),
            this._rawPxBounds.max.add(p)
          ]);
        }, "_updateBounds"),
        // recursively turns latlngs into a set of rings with projected coordinates
        _projectLatlngs: /* @__PURE__ */ __name(function(latlngs, result, projectedBounds) {
          var flat = latlngs[0] instanceof LatLng, len = latlngs.length, i, ring;
          if (flat) {
            ring = [];
            for (i = 0; i < len; i++) {
              ring[i] = this._map.latLngToLayerPoint(latlngs[i]);
              projectedBounds.extend(ring[i]);
            }
            result.push(ring);
          } else {
            for (i = 0; i < len; i++) {
              this._projectLatlngs(latlngs[i], result, projectedBounds);
            }
          }
        }, "_projectLatlngs"),
        // clip polyline by renderer bounds so that we have less to render for performance
        _clipPoints: /* @__PURE__ */ __name(function() {
          var bounds = this._renderer._bounds;
          this._parts = [];
          if (!this._pxBounds || !this._pxBounds.intersects(bounds)) {
            return;
          }
          if (this.options.noClip) {
            this._parts = this._rings;
            return;
          }
          var parts = this._parts, i, j, k, len, len2, segment, points;
          for (i = 0, k = 0, len = this._rings.length; i < len; i++) {
            points = this._rings[i];
            for (j = 0, len2 = points.length; j < len2 - 1; j++) {
              segment = clipSegment(points[j], points[j + 1], bounds, j, true);
              if (!segment) {
                continue;
              }
              parts[k] = parts[k] || [];
              parts[k].push(segment[0]);
              if (segment[1] !== points[j + 1] || j === len2 - 2) {
                parts[k].push(segment[1]);
                k++;
              }
            }
          }
        }, "_clipPoints"),
        // simplify each clipped part of the polyline for performance
        _simplifyPoints: /* @__PURE__ */ __name(function() {
          var parts = this._parts, tolerance = this.options.smoothFactor;
          for (var i = 0, len = parts.length; i < len; i++) {
            parts[i] = simplify(parts[i], tolerance);
          }
        }, "_simplifyPoints"),
        _update: /* @__PURE__ */ __name(function() {
          if (!this._map) {
            return;
          }
          this._clipPoints();
          this._simplifyPoints();
          this._updatePath();
        }, "_update"),
        _updatePath: /* @__PURE__ */ __name(function() {
          this._renderer._updatePoly(this);
        }, "_updatePath"),
        // Needed by the `Canvas` renderer for interactivity
        _containsPoint: /* @__PURE__ */ __name(function(p, closed) {
          var i, j, k, len, len2, part, w = this._clickTolerance();
          if (!this._pxBounds || !this._pxBounds.contains(p)) {
            return false;
          }
          for (i = 0, len = this._parts.length; i < len; i++) {
            part = this._parts[i];
            for (j = 0, len2 = part.length, k = len2 - 1; j < len2; k = j++) {
              if (!closed && j === 0) {
                continue;
              }
              if (pointToSegmentDistance(p, part[k], part[j]) <= w) {
                return true;
              }
            }
          }
          return false;
        }, "_containsPoint")
      });
      function polyline(latlngs, options) {
        return new Polyline(latlngs, options);
      }
      __name(polyline, "polyline");
      Polyline._flat = _flat;
      var Polygon = Polyline.extend({
        options: {
          fill: true
        },
        isEmpty: /* @__PURE__ */ __name(function() {
          return !this._latlngs.length || !this._latlngs[0].length;
        }, "isEmpty"),
        // @method getCenter(): LatLng
        // Returns the center ([centroid](http://en.wikipedia.org/wiki/Centroid)) of the Polygon.
        getCenter: /* @__PURE__ */ __name(function() {
          if (!this._map) {
            throw new Error("Must add layer to map before using getCenter()");
          }
          return polygonCenter(this._defaultShape(), this._map.options.crs);
        }, "getCenter"),
        _convertLatLngs: /* @__PURE__ */ __name(function(latlngs) {
          var result = Polyline.prototype._convertLatLngs.call(this, latlngs), len = result.length;
          if (len >= 2 && result[0] instanceof LatLng && result[0].equals(result[len - 1])) {
            result.pop();
          }
          return result;
        }, "_convertLatLngs"),
        _setLatLngs: /* @__PURE__ */ __name(function(latlngs) {
          Polyline.prototype._setLatLngs.call(this, latlngs);
          if (isFlat(this._latlngs)) {
            this._latlngs = [this._latlngs];
          }
        }, "_setLatLngs"),
        _defaultShape: /* @__PURE__ */ __name(function() {
          return isFlat(this._latlngs[0]) ? this._latlngs[0] : this._latlngs[0][0];
        }, "_defaultShape"),
        _clipPoints: /* @__PURE__ */ __name(function() {
          var bounds = this._renderer._bounds, w = this.options.weight, p = new Point(w, w);
          bounds = new Bounds(bounds.min.subtract(p), bounds.max.add(p));
          this._parts = [];
          if (!this._pxBounds || !this._pxBounds.intersects(bounds)) {
            return;
          }
          if (this.options.noClip) {
            this._parts = this._rings;
            return;
          }
          for (var i = 0, len = this._rings.length, clipped; i < len; i++) {
            clipped = clipPolygon(this._rings[i], bounds, true);
            if (clipped.length) {
              this._parts.push(clipped);
            }
          }
        }, "_clipPoints"),
        _updatePath: /* @__PURE__ */ __name(function() {
          this._renderer._updatePoly(this, true);
        }, "_updatePath"),
        // Needed by the `Canvas` renderer for interactivity
        _containsPoint: /* @__PURE__ */ __name(function(p) {
          var inside = false, part, p1, p2, i, j, k, len, len2;
          if (!this._pxBounds || !this._pxBounds.contains(p)) {
            return false;
          }
          for (i = 0, len = this._parts.length; i < len; i++) {
            part = this._parts[i];
            for (j = 0, len2 = part.length, k = len2 - 1; j < len2; k = j++) {
              p1 = part[j];
              p2 = part[k];
              if (p1.y > p.y !== p2.y > p.y && p.x < (p2.x - p1.x) * (p.y - p1.y) / (p2.y - p1.y) + p1.x) {
                inside = !inside;
              }
            }
          }
          return inside || Polyline.prototype._containsPoint.call(this, p, true);
        }, "_containsPoint")
      });
      function polygon(latlngs, options) {
        return new Polygon(latlngs, options);
      }
      __name(polygon, "polygon");
      var GeoJSON = FeatureGroup.extend({
        /* @section
         * @aka GeoJSON options
         *
         * @option pointToLayer: Function = *
         * A `Function` defining how GeoJSON points spawn Leaflet layers. It is internally
         * called when data is added, passing the GeoJSON point feature and its `LatLng`.
         * The default is to spawn a default `Marker`:
         * ```js
         * function(geoJsonPoint, latlng) {
         * 	return L.marker(latlng);
         * }
         * ```
         *
         * @option style: Function = *
         * A `Function` defining the `Path options` for styling GeoJSON lines and polygons,
         * called internally when data is added.
         * The default value is to not override any defaults:
         * ```js
         * function (geoJsonFeature) {
         * 	return {}
         * }
         * ```
         *
         * @option onEachFeature: Function = *
         * A `Function` that will be called once for each created `Feature`, after it has
         * been created and styled. Useful for attaching events and popups to features.
         * The default is to do nothing with the newly created layers:
         * ```js
         * function (feature, layer) {}
         * ```
         *
         * @option filter: Function = *
         * A `Function` that will be used to decide whether to include a feature or not.
         * The default is to include all features:
         * ```js
         * function (geoJsonFeature) {
         * 	return true;
         * }
         * ```
         * Note: dynamically changing the `filter` option will have effect only on newly
         * added data. It will _not_ re-evaluate already included features.
         *
         * @option coordsToLatLng: Function = *
         * A `Function` that will be used for converting GeoJSON coordinates to `LatLng`s.
         * The default is the `coordsToLatLng` static method.
         *
         * @option markersInheritOptions: Boolean = false
         * Whether default Markers for "Point" type Features inherit from group options.
         */
        initialize: /* @__PURE__ */ __name(function(geojson, options) {
          setOptions(this, options);
          this._layers = {};
          if (geojson) {
            this.addData(geojson);
          }
        }, "initialize"),
        // @method addData( <GeoJSON> data ): this
        // Adds a GeoJSON object to the layer.
        addData: /* @__PURE__ */ __name(function(geojson) {
          var features = isArray2(geojson) ? geojson : geojson.features, i, len, feature;
          if (features) {
            for (i = 0, len = features.length; i < len; i++) {
              feature = features[i];
              if (feature.geometries || feature.geometry || feature.features || feature.coordinates) {
                this.addData(feature);
              }
            }
            return this;
          }
          var options = this.options;
          if (options.filter && !options.filter(geojson)) {
            return this;
          }
          var layer = geometryToLayer(geojson, options);
          if (!layer) {
            return this;
          }
          layer.feature = asFeature(geojson);
          layer.defaultOptions = layer.options;
          this.resetStyle(layer);
          if (options.onEachFeature) {
            options.onEachFeature(geojson, layer);
          }
          return this.addLayer(layer);
        }, "addData"),
        // @method resetStyle( <Path> layer? ): this
        // Resets the given vector layer's style to the original GeoJSON style, useful for resetting style after hover events.
        // If `layer` is omitted, the style of all features in the current layer is reset.
        resetStyle: /* @__PURE__ */ __name(function(layer) {
          if (layer === void 0) {
            return this.eachLayer(this.resetStyle, this);
          }
          layer.options = extend({}, layer.defaultOptions);
          this._setLayerStyle(layer, this.options.style);
          return this;
        }, "resetStyle"),
        // @method setStyle( <Function> style ): this
        // Changes styles of GeoJSON vector layers with the given style function.
        setStyle: /* @__PURE__ */ __name(function(style3) {
          return this.eachLayer(function(layer) {
            this._setLayerStyle(layer, style3);
          }, this);
        }, "setStyle"),
        _setLayerStyle: /* @__PURE__ */ __name(function(layer, style3) {
          if (layer.setStyle) {
            if (typeof style3 === "function") {
              style3 = style3(layer.feature);
            }
            layer.setStyle(style3);
          }
        }, "_setLayerStyle")
      });
      function geometryToLayer(geojson, options) {
        var geometry = geojson.type === "Feature" ? geojson.geometry : geojson, coords = geometry ? geometry.coordinates : null, layers2 = [], pointToLayer = options && options.pointToLayer, _coordsToLatLng = options && options.coordsToLatLng || coordsToLatLng, latlng, latlngs, i, len;
        if (!coords && !geometry) {
          return null;
        }
        switch (geometry.type) {
          case "Point":
            latlng = _coordsToLatLng(coords);
            return _pointToLayer(pointToLayer, geojson, latlng, options);
          case "MultiPoint":
            for (i = 0, len = coords.length; i < len; i++) {
              latlng = _coordsToLatLng(coords[i]);
              layers2.push(_pointToLayer(pointToLayer, geojson, latlng, options));
            }
            return new FeatureGroup(layers2);
          case "LineString":
          case "MultiLineString":
            latlngs = coordsToLatLngs(coords, geometry.type === "LineString" ? 0 : 1, _coordsToLatLng);
            return new Polyline(latlngs, options);
          case "Polygon":
          case "MultiPolygon":
            latlngs = coordsToLatLngs(coords, geometry.type === "Polygon" ? 1 : 2, _coordsToLatLng);
            return new Polygon(latlngs, options);
          case "GeometryCollection":
            for (i = 0, len = geometry.geometries.length; i < len; i++) {
              var geoLayer = geometryToLayer({
                geometry: geometry.geometries[i],
                type: "Feature",
                properties: geojson.properties
              }, options);
              if (geoLayer) {
                layers2.push(geoLayer);
              }
            }
            return new FeatureGroup(layers2);
          case "FeatureCollection":
            for (i = 0, len = geometry.features.length; i < len; i++) {
              var featureLayer = geometryToLayer(geometry.features[i], options);
              if (featureLayer) {
                layers2.push(featureLayer);
              }
            }
            return new FeatureGroup(layers2);
          default:
            throw new Error("Invalid GeoJSON object.");
        }
      }
      __name(geometryToLayer, "geometryToLayer");
      function _pointToLayer(pointToLayerFn, geojson, latlng, options) {
        return pointToLayerFn ? pointToLayerFn(geojson, latlng) : new Marker(latlng, options && options.markersInheritOptions && options);
      }
      __name(_pointToLayer, "_pointToLayer");
      function coordsToLatLng(coords) {
        return new LatLng(coords[1], coords[0], coords[2]);
      }
      __name(coordsToLatLng, "coordsToLatLng");
      function coordsToLatLngs(coords, levelsDeep, _coordsToLatLng) {
        var latlngs = [];
        for (var i = 0, len = coords.length, latlng; i < len; i++) {
          latlng = levelsDeep ? coordsToLatLngs(coords[i], levelsDeep - 1, _coordsToLatLng) : (_coordsToLatLng || coordsToLatLng)(coords[i]);
          latlngs.push(latlng);
        }
        return latlngs;
      }
      __name(coordsToLatLngs, "coordsToLatLngs");
      function latLngToCoords(latlng, precision) {
        latlng = toLatLng(latlng);
        return latlng.alt !== void 0 ? [formatNum(latlng.lng, precision), formatNum(latlng.lat, precision), formatNum(latlng.alt, precision)] : [formatNum(latlng.lng, precision), formatNum(latlng.lat, precision)];
      }
      __name(latLngToCoords, "latLngToCoords");
      function latLngsToCoords(latlngs, levelsDeep, closed, precision) {
        var coords = [];
        for (var i = 0, len = latlngs.length; i < len; i++) {
          coords.push(levelsDeep ? latLngsToCoords(latlngs[i], isFlat(latlngs[i]) ? 0 : levelsDeep - 1, closed, precision) : latLngToCoords(latlngs[i], precision));
        }
        if (!levelsDeep && closed && coords.length > 0) {
          coords.push(coords[0].slice());
        }
        return coords;
      }
      __name(latLngsToCoords, "latLngsToCoords");
      function getFeature(layer, newGeometry) {
        return layer.feature ? extend({}, layer.feature, { geometry: newGeometry }) : asFeature(newGeometry);
      }
      __name(getFeature, "getFeature");
      function asFeature(geojson) {
        if (geojson.type === "Feature" || geojson.type === "FeatureCollection") {
          return geojson;
        }
        return {
          type: "Feature",
          properties: {},
          geometry: geojson
        };
      }
      __name(asFeature, "asFeature");
      var PointToGeoJSON = {
        toGeoJSON: /* @__PURE__ */ __name(function(precision) {
          return getFeature(this, {
            type: "Point",
            coordinates: latLngToCoords(this.getLatLng(), precision)
          });
        }, "toGeoJSON")
      };
      Marker.include(PointToGeoJSON);
      Circle.include(PointToGeoJSON);
      CircleMarker.include(PointToGeoJSON);
      Polyline.include({
        toGeoJSON: /* @__PURE__ */ __name(function(precision) {
          var multi = !isFlat(this._latlngs);
          var coords = latLngsToCoords(this._latlngs, multi ? 1 : 0, false, precision);
          return getFeature(this, {
            type: (multi ? "Multi" : "") + "LineString",
            coordinates: coords
          });
        }, "toGeoJSON")
      });
      Polygon.include({
        toGeoJSON: /* @__PURE__ */ __name(function(precision) {
          var holes = !isFlat(this._latlngs), multi = holes && !isFlat(this._latlngs[0]);
          var coords = latLngsToCoords(this._latlngs, multi ? 2 : holes ? 1 : 0, true, precision);
          if (!holes) {
            coords = [coords];
          }
          return getFeature(this, {
            type: (multi ? "Multi" : "") + "Polygon",
            coordinates: coords
          });
        }, "toGeoJSON")
      });
      LayerGroup.include({
        toMultiPoint: /* @__PURE__ */ __name(function(precision) {
          var coords = [];
          this.eachLayer(function(layer) {
            coords.push(layer.toGeoJSON(precision).geometry.coordinates);
          });
          return getFeature(this, {
            type: "MultiPoint",
            coordinates: coords
          });
        }, "toMultiPoint"),
        // @method toGeoJSON(precision?: Number|false): Object
        // Coordinates values are rounded with [`formatNum`](#util-formatnum) function with given `precision`.
        // Returns a [`GeoJSON`](https://en.wikipedia.org/wiki/GeoJSON) representation of the layer group (as a GeoJSON `FeatureCollection`, `GeometryCollection`, or `MultiPoint`).
        toGeoJSON: /* @__PURE__ */ __name(function(precision) {
          var type2 = this.feature && this.feature.geometry && this.feature.geometry.type;
          if (type2 === "MultiPoint") {
            return this.toMultiPoint(precision);
          }
          var isGeometryCollection = type2 === "GeometryCollection", jsons = [];
          this.eachLayer(function(layer) {
            if (layer.toGeoJSON) {
              var json = layer.toGeoJSON(precision);
              if (isGeometryCollection) {
                jsons.push(json.geometry);
              } else {
                var feature = asFeature(json);
                if (feature.type === "FeatureCollection") {
                  jsons.push.apply(jsons, feature.features);
                } else {
                  jsons.push(feature);
                }
              }
            }
          });
          if (isGeometryCollection) {
            return getFeature(this, {
              geometries: jsons,
              type: "GeometryCollection"
            });
          }
          return {
            type: "FeatureCollection",
            features: jsons
          };
        }, "toGeoJSON")
      });
      function geoJSON(geojson, options) {
        return new GeoJSON(geojson, options);
      }
      __name(geoJSON, "geoJSON");
      var geoJson = geoJSON;
      var ImageOverlay = Layer.extend({
        // @section
        // @aka ImageOverlay options
        options: {
          // @option opacity: Number = 1.0
          // The opacity of the image overlay.
          opacity: 1,
          // @option alt: String = ''
          // Text for the `alt` attribute of the image (useful for accessibility).
          alt: "",
          // @option interactive: Boolean = false
          // If `true`, the image overlay will emit [mouse events](#interactive-layer) when clicked or hovered.
          interactive: false,
          // @option crossOrigin: Boolean|String = false
          // Whether the crossOrigin attribute will be added to the image.
          // If a String is provided, the image will have its crossOrigin attribute set to the String provided. This is needed if you want to access image pixel data.
          // Refer to [CORS Settings](https://developer.mozilla.org/en-US/docs/Web/HTML/CORS_settings_attributes) for valid String values.
          crossOrigin: false,
          // @option errorOverlayUrl: String = ''
          // URL to the overlay image to show in place of the overlay that failed to load.
          errorOverlayUrl: "",
          // @option zIndex: Number = 1
          // The explicit [zIndex](https://developer.mozilla.org/docs/Web/CSS/CSS_Positioning/Understanding_z_index) of the overlay layer.
          zIndex: 1,
          // @option className: String = ''
          // A custom class name to assign to the image. Empty by default.
          className: ""
        },
        initialize: /* @__PURE__ */ __name(function(url2, bounds, options) {
          this._url = url2;
          this._bounds = toLatLngBounds(bounds);
          setOptions(this, options);
        }, "initialize"),
        onAdd: /* @__PURE__ */ __name(function() {
          if (!this._image) {
            this._initImage();
            if (this.options.opacity < 1) {
              this._updateOpacity();
            }
          }
          if (this.options.interactive) {
            addClass2(this._image, "leaflet-interactive");
            this.addInteractiveTarget(this._image);
          }
          this.getPane().appendChild(this._image);
          this._reset();
        }, "onAdd"),
        onRemove: /* @__PURE__ */ __name(function() {
          remove2(this._image);
          if (this.options.interactive) {
            this.removeInteractiveTarget(this._image);
          }
        }, "onRemove"),
        // @method setOpacity(opacity: Number): this
        // Sets the opacity of the overlay.
        setOpacity: /* @__PURE__ */ __name(function(opacity) {
          this.options.opacity = opacity;
          if (this._image) {
            this._updateOpacity();
          }
          return this;
        }, "setOpacity"),
        setStyle: /* @__PURE__ */ __name(function(styleOpts) {
          if (styleOpts.opacity) {
            this.setOpacity(styleOpts.opacity);
          }
          return this;
        }, "setStyle"),
        // @method bringToFront(): this
        // Brings the layer to the top of all overlays.
        bringToFront: /* @__PURE__ */ __name(function() {
          if (this._map) {
            toFront(this._image);
          }
          return this;
        }, "bringToFront"),
        // @method bringToBack(): this
        // Brings the layer to the bottom of all overlays.
        bringToBack: /* @__PURE__ */ __name(function() {
          if (this._map) {
            toBack(this._image);
          }
          return this;
        }, "bringToBack"),
        // @method setUrl(url: String): this
        // Changes the URL of the image.
        setUrl: /* @__PURE__ */ __name(function(url2) {
          this._url = url2;
          if (this._image) {
            this._image.src = url2;
          }
          return this;
        }, "setUrl"),
        // @method setBounds(bounds: LatLngBounds): this
        // Update the bounds that this ImageOverlay covers
        setBounds: /* @__PURE__ */ __name(function(bounds) {
          this._bounds = toLatLngBounds(bounds);
          if (this._map) {
            this._reset();
          }
          return this;
        }, "setBounds"),
        getEvents: /* @__PURE__ */ __name(function() {
          var events = {
            zoom: this._reset,
            viewreset: this._reset
          };
          if (this._zoomAnimated) {
            events.zoomanim = this._animateZoom;
          }
          return events;
        }, "getEvents"),
        // @method setZIndex(value: Number): this
        // Changes the [zIndex](#imageoverlay-zindex) of the image overlay.
        setZIndex: /* @__PURE__ */ __name(function(value) {
          this.options.zIndex = value;
          this._updateZIndex();
          return this;
        }, "setZIndex"),
        // @method getBounds(): LatLngBounds
        // Get the bounds that this ImageOverlay covers
        getBounds: /* @__PURE__ */ __name(function() {
          return this._bounds;
        }, "getBounds"),
        // @method getElement(): HTMLElement
        // Returns the instance of [`HTMLImageElement`](https://developer.mozilla.org/docs/Web/API/HTMLImageElement)
        // used by this overlay.
        getElement: /* @__PURE__ */ __name(function() {
          return this._image;
        }, "getElement"),
        _initImage: /* @__PURE__ */ __name(function() {
          var wasElementSupplied = this._url.tagName === "IMG";
          var img = this._image = wasElementSupplied ? this._url : create$1("img");
          addClass2(img, "leaflet-image-layer");
          if (this._zoomAnimated) {
            addClass2(img, "leaflet-zoom-animated");
          }
          if (this.options.className) {
            addClass2(img, this.options.className);
          }
          img.onselectstart = falseFn;
          img.onmousemove = falseFn;
          img.onload = bind(this.fire, this, "load");
          img.onerror = bind(this._overlayOnError, this, "error");
          if (this.options.crossOrigin || this.options.crossOrigin === "") {
            img.crossOrigin = this.options.crossOrigin === true ? "" : this.options.crossOrigin;
          }
          if (this.options.zIndex) {
            this._updateZIndex();
          }
          if (wasElementSupplied) {
            this._url = img.src;
            return;
          }
          img.src = this._url;
          img.alt = this.options.alt;
        }, "_initImage"),
        _animateZoom: /* @__PURE__ */ __name(function(e) {
          var scale2 = this._map.getZoomScale(e.zoom), offset = this._map._latLngBoundsToNewLayerBounds(this._bounds, e.zoom, e.center).min;
          setTransform(this._image, offset, scale2);
        }, "_animateZoom"),
        _reset: /* @__PURE__ */ __name(function() {
          var image = this._image, bounds = new Bounds(
            this._map.latLngToLayerPoint(this._bounds.getNorthWest()),
            this._map.latLngToLayerPoint(this._bounds.getSouthEast())
          ), size = bounds.getSize();
          setPosition(image, bounds.min);
          image.style.width = size.x + "px";
          image.style.height = size.y + "px";
        }, "_reset"),
        _updateOpacity: /* @__PURE__ */ __name(function() {
          setOpacity(this._image, this.options.opacity);
        }, "_updateOpacity"),
        _updateZIndex: /* @__PURE__ */ __name(function() {
          if (this._image && this.options.zIndex !== void 0 && this.options.zIndex !== null) {
            this._image.style.zIndex = this.options.zIndex;
          }
        }, "_updateZIndex"),
        _overlayOnError: /* @__PURE__ */ __name(function() {
          this.fire("error");
          var errorUrl = this.options.errorOverlayUrl;
          if (errorUrl && this._url !== errorUrl) {
            this._url = errorUrl;
            this._image.src = errorUrl;
          }
        }, "_overlayOnError"),
        // @method getCenter(): LatLng
        // Returns the center of the ImageOverlay.
        getCenter: /* @__PURE__ */ __name(function() {
          return this._bounds.getCenter();
        }, "getCenter")
      });
      var imageOverlay = /* @__PURE__ */ __name(function(url2, bounds, options) {
        return new ImageOverlay(url2, bounds, options);
      }, "imageOverlay");
      var VideoOverlay = ImageOverlay.extend({
        // @section
        // @aka VideoOverlay options
        options: {
          // @option autoplay: Boolean = true
          // Whether the video starts playing automatically when loaded.
          // On some browsers autoplay will only work with `muted: true`
          autoplay: true,
          // @option loop: Boolean = true
          // Whether the video will loop back to the beginning when played.
          loop: true,
          // @option keepAspectRatio: Boolean = true
          // Whether the video will save aspect ratio after the projection.
          // Relevant for supported browsers. See [browser compatibility](https://developer.mozilla.org/en-US/docs/Web/CSS/object-fit)
          keepAspectRatio: true,
          // @option muted: Boolean = false
          // Whether the video starts on mute when loaded.
          muted: false,
          // @option playsInline: Boolean = true
          // Mobile browsers will play the video right where it is instead of open it up in fullscreen mode.
          playsInline: true
        },
        _initImage: /* @__PURE__ */ __name(function() {
          var wasElementSupplied = this._url.tagName === "VIDEO";
          var vid = this._image = wasElementSupplied ? this._url : create$1("video");
          addClass2(vid, "leaflet-image-layer");
          if (this._zoomAnimated) {
            addClass2(vid, "leaflet-zoom-animated");
          }
          if (this.options.className) {
            addClass2(vid, this.options.className);
          }
          vid.onselectstart = falseFn;
          vid.onmousemove = falseFn;
          vid.onloadeddata = bind(this.fire, this, "load");
          if (wasElementSupplied) {
            var sourceElements = vid.getElementsByTagName("source");
            var sources = [];
            for (var j = 0; j < sourceElements.length; j++) {
              sources.push(sourceElements[j].src);
            }
            this._url = sourceElements.length > 0 ? sources : [vid.src];
            return;
          }
          if (!isArray2(this._url)) {
            this._url = [this._url];
          }
          if (!this.options.keepAspectRatio && Object.prototype.hasOwnProperty.call(vid.style, "objectFit")) {
            vid.style["objectFit"] = "fill";
          }
          vid.autoplay = !!this.options.autoplay;
          vid.loop = !!this.options.loop;
          vid.muted = !!this.options.muted;
          vid.playsInline = !!this.options.playsInline;
          for (var i = 0; i < this._url.length; i++) {
            var source = create$1("source");
            source.src = this._url[i];
            vid.appendChild(source);
          }
        }, "_initImage")
        // @method getElement(): HTMLVideoElement
        // Returns the instance of [`HTMLVideoElement`](https://developer.mozilla.org/docs/Web/API/HTMLVideoElement)
        // used by this overlay.
      });
      function videoOverlay(video, bounds, options) {
        return new VideoOverlay(video, bounds, options);
      }
      __name(videoOverlay, "videoOverlay");
      var SVGOverlay = ImageOverlay.extend({
        _initImage: /* @__PURE__ */ __name(function() {
          var el = this._image = this._url;
          addClass2(el, "leaflet-image-layer");
          if (this._zoomAnimated) {
            addClass2(el, "leaflet-zoom-animated");
          }
          if (this.options.className) {
            addClass2(el, this.options.className);
          }
          el.onselectstart = falseFn;
          el.onmousemove = falseFn;
        }, "_initImage")
        // @method getElement(): SVGElement
        // Returns the instance of [`SVGElement`](https://developer.mozilla.org/docs/Web/API/SVGElement)
        // used by this overlay.
      });
      function svgOverlay(el, bounds, options) {
        return new SVGOverlay(el, bounds, options);
      }
      __name(svgOverlay, "svgOverlay");
      var DivOverlay = Layer.extend({
        // @section
        // @aka DivOverlay options
        options: {
          // @option interactive: Boolean = false
          // If true, the popup/tooltip will listen to the mouse events.
          interactive: false,
          // @option offset: Point = Point(0, 0)
          // The offset of the overlay position.
          offset: [0, 0],
          // @option className: String = ''
          // A custom CSS class name to assign to the overlay.
          className: "",
          // @option pane: String = undefined
          // `Map pane` where the overlay will be added.
          pane: void 0,
          // @option content: String|HTMLElement|Function = ''
          // Sets the HTML content of the overlay while initializing. If a function is passed the source layer will be
          // passed to the function. The function should return a `String` or `HTMLElement` to be used in the overlay.
          content: ""
        },
        initialize: /* @__PURE__ */ __name(function(options, source) {
          if (options && (options instanceof LatLng || isArray2(options))) {
            this._latlng = toLatLng(options);
            setOptions(this, source);
          } else {
            setOptions(this, options);
            this._source = source;
          }
          if (this.options.content) {
            this._content = this.options.content;
          }
        }, "initialize"),
        // @method openOn(map: Map): this
        // Adds the overlay to the map.
        // Alternative to `map.openPopup(popup)`/`.openTooltip(tooltip)`.
        openOn: /* @__PURE__ */ __name(function(map) {
          map = arguments.length ? map : this._source._map;
          if (!map.hasLayer(this)) {
            map.addLayer(this);
          }
          return this;
        }, "openOn"),
        // @method close(): this
        // Closes the overlay.
        // Alternative to `map.closePopup(popup)`/`.closeTooltip(tooltip)`
        // and `layer.closePopup()`/`.closeTooltip()`.
        close: /* @__PURE__ */ __name(function() {
          if (this._map) {
            this._map.removeLayer(this);
          }
          return this;
        }, "close"),
        // @method toggle(layer?: Layer): this
        // Opens or closes the overlay bound to layer depending on its current state.
        // Argument may be omitted only for overlay bound to layer.
        // Alternative to `layer.togglePopup()`/`.toggleTooltip()`.
        toggle: /* @__PURE__ */ __name(function(layer) {
          if (this._map) {
            this.close();
          } else {
            if (arguments.length) {
              this._source = layer;
            } else {
              layer = this._source;
            }
            this._prepareOpen();
            this.openOn(layer._map);
          }
          return this;
        }, "toggle"),
        onAdd: /* @__PURE__ */ __name(function(map) {
          this._zoomAnimated = map._zoomAnimated;
          if (!this._container) {
            this._initLayout();
          }
          if (map._fadeAnimated) {
            setOpacity(this._container, 0);
          }
          clearTimeout(this._removeTimeout);
          this.getPane().appendChild(this._container);
          this.update();
          if (map._fadeAnimated) {
            setOpacity(this._container, 1);
          }
          this.bringToFront();
          if (this.options.interactive) {
            addClass2(this._container, "leaflet-interactive");
            this.addInteractiveTarget(this._container);
          }
        }, "onAdd"),
        onRemove: /* @__PURE__ */ __name(function(map) {
          if (map._fadeAnimated) {
            setOpacity(this._container, 0);
            this._removeTimeout = setTimeout(bind(remove2, void 0, this._container), 200);
          } else {
            remove2(this._container);
          }
          if (this.options.interactive) {
            removeClass2(this._container, "leaflet-interactive");
            this.removeInteractiveTarget(this._container);
          }
        }, "onRemove"),
        // @namespace DivOverlay
        // @method getLatLng: LatLng
        // Returns the geographical point of the overlay.
        getLatLng: /* @__PURE__ */ __name(function() {
          return this._latlng;
        }, "getLatLng"),
        // @method setLatLng(latlng: LatLng): this
        // Sets the geographical point where the overlay will open.
        setLatLng: /* @__PURE__ */ __name(function(latlng) {
          this._latlng = toLatLng(latlng);
          if (this._map) {
            this._updatePosition();
            this._adjustPan();
          }
          return this;
        }, "setLatLng"),
        // @method getContent: String|HTMLElement
        // Returns the content of the overlay.
        getContent: /* @__PURE__ */ __name(function() {
          return this._content;
        }, "getContent"),
        // @method setContent(htmlContent: String|HTMLElement|Function): this
        // Sets the HTML content of the overlay. If a function is passed the source layer will be passed to the function.
        // The function should return a `String` or `HTMLElement` to be used in the overlay.
        setContent: /* @__PURE__ */ __name(function(content) {
          this._content = content;
          this.update();
          return this;
        }, "setContent"),
        // @method getElement: String|HTMLElement
        // Returns the HTML container of the overlay.
        getElement: /* @__PURE__ */ __name(function() {
          return this._container;
        }, "getElement"),
        // @method update: null
        // Updates the overlay content, layout and position. Useful for updating the overlay after something inside changed, e.g. image loaded.
        update: /* @__PURE__ */ __name(function() {
          if (!this._map) {
            return;
          }
          this._container.style.visibility = "hidden";
          this._updateContent();
          this._updateLayout();
          this._updatePosition();
          this._container.style.visibility = "";
          this._adjustPan();
        }, "update"),
        getEvents: /* @__PURE__ */ __name(function() {
          var events = {
            zoom: this._updatePosition,
            viewreset: this._updatePosition
          };
          if (this._zoomAnimated) {
            events.zoomanim = this._animateZoom;
          }
          return events;
        }, "getEvents"),
        // @method isOpen: Boolean
        // Returns `true` when the overlay is visible on the map.
        isOpen: /* @__PURE__ */ __name(function() {
          return !!this._map && this._map.hasLayer(this);
        }, "isOpen"),
        // @method bringToFront: this
        // Brings this overlay in front of other overlays (in the same map pane).
        bringToFront: /* @__PURE__ */ __name(function() {
          if (this._map) {
            toFront(this._container);
          }
          return this;
        }, "bringToFront"),
        // @method bringToBack: this
        // Brings this overlay to the back of other overlays (in the same map pane).
        bringToBack: /* @__PURE__ */ __name(function() {
          if (this._map) {
            toBack(this._container);
          }
          return this;
        }, "bringToBack"),
        // prepare bound overlay to open: update latlng pos / content source (for FeatureGroup)
        _prepareOpen: /* @__PURE__ */ __name(function(latlng) {
          var source = this._source;
          if (!source._map) {
            return false;
          }
          if (source instanceof FeatureGroup) {
            source = null;
            var layers2 = this._source._layers;
            for (var id in layers2) {
              if (layers2[id]._map) {
                source = layers2[id];
                break;
              }
            }
            if (!source) {
              return false;
            }
            this._source = source;
          }
          if (!latlng) {
            if (source.getCenter) {
              latlng = source.getCenter();
            } else if (source.getLatLng) {
              latlng = source.getLatLng();
            } else if (source.getBounds) {
              latlng = source.getBounds().getCenter();
            } else {
              throw new Error("Unable to get source layer LatLng.");
            }
          }
          this.setLatLng(latlng);
          if (this._map) {
            this.update();
          }
          return true;
        }, "_prepareOpen"),
        _updateContent: /* @__PURE__ */ __name(function() {
          if (!this._content) {
            return;
          }
          var node = this._contentNode;
          var content = typeof this._content === "function" ? this._content(this._source || this) : this._content;
          if (typeof content === "string") {
            node.innerHTML = content;
          } else {
            while (node.hasChildNodes()) {
              node.removeChild(node.firstChild);
            }
            node.appendChild(content);
          }
          this.fire("contentupdate");
        }, "_updateContent"),
        _updatePosition: /* @__PURE__ */ __name(function() {
          if (!this._map) {
            return;
          }
          var pos = this._map.latLngToLayerPoint(this._latlng), offset = toPoint(this.options.offset), anchor = this._getAnchor();
          if (this._zoomAnimated) {
            setPosition(this._container, pos.add(anchor));
          } else {
            offset = offset.add(pos).add(anchor);
          }
          var bottom = this._containerBottom = -offset.y, left = this._containerLeft = -Math.round(this._containerWidth / 2) + offset.x;
          this._container.style.bottom = bottom + "px";
          this._container.style.left = left + "px";
        }, "_updatePosition"),
        _getAnchor: /* @__PURE__ */ __name(function() {
          return [0, 0];
        }, "_getAnchor")
      });
      Map2.include({
        _initOverlay: /* @__PURE__ */ __name(function(OverlayClass, content, latlng, options) {
          var overlay = content;
          if (!(overlay instanceof OverlayClass)) {
            overlay = new OverlayClass(options).setContent(content);
          }
          if (latlng) {
            overlay.setLatLng(latlng);
          }
          return overlay;
        }, "_initOverlay")
      });
      Layer.include({
        _initOverlay: /* @__PURE__ */ __name(function(OverlayClass, old, content, options) {
          var overlay = content;
          if (overlay instanceof OverlayClass) {
            setOptions(overlay, options);
            overlay._source = this;
          } else {
            overlay = old && !options ? old : new OverlayClass(options, this);
            overlay.setContent(content);
          }
          return overlay;
        }, "_initOverlay")
      });
      var Popup = DivOverlay.extend({
        // @section
        // @aka Popup options
        options: {
          // @option pane: String = 'popupPane'
          // `Map pane` where the popup will be added.
          pane: "popupPane",
          // @option offset: Point = Point(0, 7)
          // The offset of the popup position.
          offset: [0, 7],
          // @option maxWidth: Number = 300
          // Max width of the popup, in pixels.
          maxWidth: 300,
          // @option minWidth: Number = 50
          // Min width of the popup, in pixels.
          minWidth: 50,
          // @option maxHeight: Number = null
          // If set, creates a scrollable container of the given height
          // inside a popup if its content exceeds it.
          // The scrollable container can be styled using the
          // `leaflet-popup-scrolled` CSS class selector.
          maxHeight: null,
          // @option autoPan: Boolean = true
          // Set it to `false` if you don't want the map to do panning animation
          // to fit the opened popup.
          autoPan: true,
          // @option autoPanPaddingTopLeft: Point = null
          // The margin between the popup and the top left corner of the map
          // view after autopanning was performed.
          autoPanPaddingTopLeft: null,
          // @option autoPanPaddingBottomRight: Point = null
          // The margin between the popup and the bottom right corner of the map
          // view after autopanning was performed.
          autoPanPaddingBottomRight: null,
          // @option autoPanPadding: Point = Point(5, 5)
          // Equivalent of setting both top left and bottom right autopan padding to the same value.
          autoPanPadding: [5, 5],
          // @option keepInView: Boolean = false
          // Set it to `true` if you want to prevent users from panning the popup
          // off of the screen while it is open.
          keepInView: false,
          // @option closeButton: Boolean = true
          // Controls the presence of a close button in the popup.
          closeButton: true,
          // @option autoClose: Boolean = true
          // Set it to `false` if you want to override the default behavior of
          // the popup closing when another popup is opened.
          autoClose: true,
          // @option closeOnEscapeKey: Boolean = true
          // Set it to `false` if you want to override the default behavior of
          // the ESC key for closing of the popup.
          closeOnEscapeKey: true,
          // @option closeOnClick: Boolean = *
          // Set it if you want to override the default behavior of the popup closing when user clicks
          // on the map. Defaults to the map's [`closePopupOnClick`](#map-closepopuponclick) option.
          // @option className: String = ''
          // A custom CSS class name to assign to the popup.
          className: ""
        },
        // @namespace Popup
        // @method openOn(map: Map): this
        // Alternative to `map.openPopup(popup)`.
        // Adds the popup to the map and closes the previous one.
        openOn: /* @__PURE__ */ __name(function(map) {
          map = arguments.length ? map : this._source._map;
          if (!map.hasLayer(this) && map._popup && map._popup.options.autoClose) {
            map.removeLayer(map._popup);
          }
          map._popup = this;
          return DivOverlay.prototype.openOn.call(this, map);
        }, "openOn"),
        onAdd: /* @__PURE__ */ __name(function(map) {
          DivOverlay.prototype.onAdd.call(this, map);
          map.fire("popupopen", { popup: this });
          if (this._source) {
            this._source.fire("popupopen", { popup: this }, true);
            if (!(this._source instanceof Path)) {
              this._source.on("preclick", stopPropagation);
            }
          }
        }, "onAdd"),
        onRemove: /* @__PURE__ */ __name(function(map) {
          DivOverlay.prototype.onRemove.call(this, map);
          map.fire("popupclose", { popup: this });
          if (this._source) {
            this._source.fire("popupclose", { popup: this }, true);
            if (!(this._source instanceof Path)) {
              this._source.off("preclick", stopPropagation);
            }
          }
        }, "onRemove"),
        getEvents: /* @__PURE__ */ __name(function() {
          var events = DivOverlay.prototype.getEvents.call(this);
          if (this.options.closeOnClick !== void 0 ? this.options.closeOnClick : this._map.options.closePopupOnClick) {
            events.preclick = this.close;
          }
          if (this.options.keepInView) {
            events.moveend = this._adjustPan;
          }
          return events;
        }, "getEvents"),
        _initLayout: /* @__PURE__ */ __name(function() {
          var prefix = "leaflet-popup", container = this._container = create$1(
            "div",
            prefix + " " + (this.options.className || "") + " leaflet-zoom-animated"
          );
          var wrapper = this._wrapper = create$1("div", prefix + "-content-wrapper", container);
          this._contentNode = create$1("div", prefix + "-content", wrapper);
          disableClickPropagation(container);
          disableScrollPropagation(this._contentNode);
          on(container, "contextmenu", stopPropagation);
          this._tipContainer = create$1("div", prefix + "-tip-container", container);
          this._tip = create$1("div", prefix + "-tip", this._tipContainer);
          if (this.options.closeButton) {
            var closeButton = this._closeButton = create$1("a", prefix + "-close-button", container);
            closeButton.setAttribute("role", "button");
            closeButton.setAttribute("aria-label", "Close popup");
            closeButton.href = "#close";
            closeButton.innerHTML = '<span aria-hidden="true">&#215;</span>';
            on(closeButton, "click", function(ev) {
              preventDefault(ev);
              this.close();
            }, this);
          }
        }, "_initLayout"),
        _updateLayout: /* @__PURE__ */ __name(function() {
          var container = this._contentNode, style3 = container.style;
          style3.width = "";
          style3.whiteSpace = "nowrap";
          var width = container.offsetWidth;
          width = Math.min(width, this.options.maxWidth);
          width = Math.max(width, this.options.minWidth);
          style3.width = width + 1 + "px";
          style3.whiteSpace = "";
          style3.height = "";
          var height = container.offsetHeight, maxHeight = this.options.maxHeight, scrolledClass = "leaflet-popup-scrolled";
          if (maxHeight && height > maxHeight) {
            style3.height = maxHeight + "px";
            addClass2(container, scrolledClass);
          } else {
            removeClass2(container, scrolledClass);
          }
          this._containerWidth = this._container.offsetWidth;
        }, "_updateLayout"),
        _animateZoom: /* @__PURE__ */ __name(function(e) {
          var pos = this._map._latLngToNewLayerPoint(this._latlng, e.zoom, e.center), anchor = this._getAnchor();
          setPosition(this._container, pos.add(anchor));
        }, "_animateZoom"),
        _adjustPan: /* @__PURE__ */ __name(function() {
          if (!this.options.autoPan) {
            return;
          }
          if (this._map._panAnim) {
            this._map._panAnim.stop();
          }
          if (this._autopanning) {
            this._autopanning = false;
            return;
          }
          var map = this._map, marginBottom = parseInt(getStyle(this._container, "marginBottom"), 10) || 0, containerHeight = this._container.offsetHeight + marginBottom, containerWidth = this._containerWidth, layerPos = new Point(this._containerLeft, -containerHeight - this._containerBottom);
          layerPos._add(getPosition(this._container));
          var containerPos = map.layerPointToContainerPoint(layerPos), padding = toPoint(this.options.autoPanPadding), paddingTL = toPoint(this.options.autoPanPaddingTopLeft || padding), paddingBR = toPoint(this.options.autoPanPaddingBottomRight || padding), size = map.getSize(), dx = 0, dy = 0;
          if (containerPos.x + containerWidth + paddingBR.x > size.x) {
            dx = containerPos.x + containerWidth - size.x + paddingBR.x;
          }
          if (containerPos.x - dx - paddingTL.x < 0) {
            dx = containerPos.x - paddingTL.x;
          }
          if (containerPos.y + containerHeight + paddingBR.y > size.y) {
            dy = containerPos.y + containerHeight - size.y + paddingBR.y;
          }
          if (containerPos.y - dy - paddingTL.y < 0) {
            dy = containerPos.y - paddingTL.y;
          }
          if (dx || dy) {
            if (this.options.keepInView) {
              this._autopanning = true;
            }
            map.fire("autopanstart").panBy([dx, dy]);
          }
        }, "_adjustPan"),
        _getAnchor: /* @__PURE__ */ __name(function() {
          return toPoint(this._source && this._source._getPopupAnchor ? this._source._getPopupAnchor() : [0, 0]);
        }, "_getAnchor")
      });
      var popup = /* @__PURE__ */ __name(function(options, source) {
        return new Popup(options, source);
      }, "popup");
      Map2.mergeOptions({
        closePopupOnClick: true
      });
      Map2.include({
        // @method openPopup(popup: Popup): this
        // Opens the specified popup while closing the previously opened (to make sure only one is opened at one time for usability).
        // @alternative
        // @method openPopup(content: String|HTMLElement, latlng: LatLng, options?: Popup options): this
        // Creates a popup with the specified content and options and opens it in the given point on a map.
        openPopup: /* @__PURE__ */ __name(function(popup2, latlng, options) {
          this._initOverlay(Popup, popup2, latlng, options).openOn(this);
          return this;
        }, "openPopup"),
        // @method closePopup(popup?: Popup): this
        // Closes the popup previously opened with [openPopup](#map-openpopup) (or the given one).
        closePopup: /* @__PURE__ */ __name(function(popup2) {
          popup2 = arguments.length ? popup2 : this._popup;
          if (popup2) {
            popup2.close();
          }
          return this;
        }, "closePopup")
      });
      Layer.include({
        // @method bindPopup(content: String|HTMLElement|Function|Popup, options?: Popup options): this
        // Binds a popup to the layer with the passed `content` and sets up the
        // necessary event listeners. If a `Function` is passed it will receive
        // the layer as the first argument and should return a `String` or `HTMLElement`.
        bindPopup: /* @__PURE__ */ __name(function(content, options) {
          this._popup = this._initOverlay(Popup, this._popup, content, options);
          if (!this._popupHandlersAdded) {
            this.on({
              click: this._openPopup,
              keypress: this._onKeyPress,
              remove: this.closePopup,
              move: this._movePopup
            });
            this._popupHandlersAdded = true;
          }
          return this;
        }, "bindPopup"),
        // @method unbindPopup(): this
        // Removes the popup previously bound with `bindPopup`.
        unbindPopup: /* @__PURE__ */ __name(function() {
          if (this._popup) {
            this.off({
              click: this._openPopup,
              keypress: this._onKeyPress,
              remove: this.closePopup,
              move: this._movePopup
            });
            this._popupHandlersAdded = false;
            this._popup = null;
          }
          return this;
        }, "unbindPopup"),
        // @method openPopup(latlng?: LatLng): this
        // Opens the bound popup at the specified `latlng` or at the default popup anchor if no `latlng` is passed.
        openPopup: /* @__PURE__ */ __name(function(latlng) {
          if (this._popup) {
            if (!(this instanceof FeatureGroup)) {
              this._popup._source = this;
            }
            if (this._popup._prepareOpen(latlng || this._latlng)) {
              this._popup.openOn(this._map);
            }
          }
          return this;
        }, "openPopup"),
        // @method closePopup(): this
        // Closes the popup bound to this layer if it is open.
        closePopup: /* @__PURE__ */ __name(function() {
          if (this._popup) {
            this._popup.close();
          }
          return this;
        }, "closePopup"),
        // @method togglePopup(): this
        // Opens or closes the popup bound to this layer depending on its current state.
        togglePopup: /* @__PURE__ */ __name(function() {
          if (this._popup) {
            this._popup.toggle(this);
          }
          return this;
        }, "togglePopup"),
        // @method isPopupOpen(): boolean
        // Returns `true` if the popup bound to this layer is currently open.
        isPopupOpen: /* @__PURE__ */ __name(function() {
          return this._popup ? this._popup.isOpen() : false;
        }, "isPopupOpen"),
        // @method setPopupContent(content: String|HTMLElement|Popup): this
        // Sets the content of the popup bound to this layer.
        setPopupContent: /* @__PURE__ */ __name(function(content) {
          if (this._popup) {
            this._popup.setContent(content);
          }
          return this;
        }, "setPopupContent"),
        // @method getPopup(): Popup
        // Returns the popup bound to this layer.
        getPopup: /* @__PURE__ */ __name(function() {
          return this._popup;
        }, "getPopup"),
        _openPopup: /* @__PURE__ */ __name(function(e) {
          if (!this._popup || !this._map) {
            return;
          }
          stop(e);
          var target = e.layer || e.target;
          if (this._popup._source === target && !(target instanceof Path)) {
            if (this._map.hasLayer(this._popup)) {
              this.closePopup();
            } else {
              this.openPopup(e.latlng);
            }
            return;
          }
          this._popup._source = target;
          this.openPopup(e.latlng);
        }, "_openPopup"),
        _movePopup: /* @__PURE__ */ __name(function(e) {
          this._popup.setLatLng(e.latlng);
        }, "_movePopup"),
        _onKeyPress: /* @__PURE__ */ __name(function(e) {
          if (e.originalEvent.keyCode === 13) {
            this._openPopup(e);
          }
        }, "_onKeyPress")
      });
      var Tooltip2 = DivOverlay.extend({
        // @section
        // @aka Tooltip options
        options: {
          // @option pane: String = 'tooltipPane'
          // `Map pane` where the tooltip will be added.
          pane: "tooltipPane",
          // @option offset: Point = Point(0, 0)
          // Optional offset of the tooltip position.
          offset: [0, 0],
          // @option direction: String = 'auto'
          // Direction where to open the tooltip. Possible values are: `right`, `left`,
          // `top`, `bottom`, `center`, `auto`.
          // `auto` will dynamically switch between `right` and `left` according to the tooltip
          // position on the map.
          direction: "auto",
          // @option permanent: Boolean = false
          // Whether to open the tooltip permanently or only on mouseover.
          permanent: false,
          // @option sticky: Boolean = false
          // If true, the tooltip will follow the mouse instead of being fixed at the feature center.
          sticky: false,
          // @option opacity: Number = 0.9
          // Tooltip container opacity.
          opacity: 0.9
        },
        onAdd: /* @__PURE__ */ __name(function(map) {
          DivOverlay.prototype.onAdd.call(this, map);
          this.setOpacity(this.options.opacity);
          map.fire("tooltipopen", { tooltip: this });
          if (this._source) {
            this.addEventParent(this._source);
            this._source.fire("tooltipopen", { tooltip: this }, true);
          }
        }, "onAdd"),
        onRemove: /* @__PURE__ */ __name(function(map) {
          DivOverlay.prototype.onRemove.call(this, map);
          map.fire("tooltipclose", { tooltip: this });
          if (this._source) {
            this.removeEventParent(this._source);
            this._source.fire("tooltipclose", { tooltip: this }, true);
          }
        }, "onRemove"),
        getEvents: /* @__PURE__ */ __name(function() {
          var events = DivOverlay.prototype.getEvents.call(this);
          if (!this.options.permanent) {
            events.preclick = this.close;
          }
          return events;
        }, "getEvents"),
        _initLayout: /* @__PURE__ */ __name(function() {
          var prefix = "leaflet-tooltip", className = prefix + " " + (this.options.className || "") + " leaflet-zoom-" + (this._zoomAnimated ? "animated" : "hide");
          this._contentNode = this._container = create$1("div", className);
          this._container.setAttribute("role", "tooltip");
          this._container.setAttribute("id", "leaflet-tooltip-" + stamp(this));
        }, "_initLayout"),
        _updateLayout: /* @__PURE__ */ __name(function() {
        }, "_updateLayout"),
        _adjustPan: /* @__PURE__ */ __name(function() {
        }, "_adjustPan"),
        _setPosition: /* @__PURE__ */ __name(function(pos) {
          var subX, subY, map = this._map, container = this._container, centerPoint = map.latLngToContainerPoint(map.getCenter()), tooltipPoint = map.layerPointToContainerPoint(pos), direction = this.options.direction, tooltipWidth = container.offsetWidth, tooltipHeight = container.offsetHeight, offset = toPoint(this.options.offset), anchor = this._getAnchor();
          if (direction === "top") {
            subX = tooltipWidth / 2;
            subY = tooltipHeight;
          } else if (direction === "bottom") {
            subX = tooltipWidth / 2;
            subY = 0;
          } else if (direction === "center") {
            subX = tooltipWidth / 2;
            subY = tooltipHeight / 2;
          } else if (direction === "right") {
            subX = 0;
            subY = tooltipHeight / 2;
          } else if (direction === "left") {
            subX = tooltipWidth;
            subY = tooltipHeight / 2;
          } else if (tooltipPoint.x < centerPoint.x) {
            direction = "right";
            subX = 0;
            subY = tooltipHeight / 2;
          } else {
            direction = "left";
            subX = tooltipWidth + (offset.x + anchor.x) * 2;
            subY = tooltipHeight / 2;
          }
          pos = pos.subtract(toPoint(subX, subY, true)).add(offset).add(anchor);
          removeClass2(container, "leaflet-tooltip-right");
          removeClass2(container, "leaflet-tooltip-left");
          removeClass2(container, "leaflet-tooltip-top");
          removeClass2(container, "leaflet-tooltip-bottom");
          addClass2(container, "leaflet-tooltip-" + direction);
          setPosition(container, pos);
        }, "_setPosition"),
        _updatePosition: /* @__PURE__ */ __name(function() {
          var pos = this._map.latLngToLayerPoint(this._latlng);
          this._setPosition(pos);
        }, "_updatePosition"),
        setOpacity: /* @__PURE__ */ __name(function(opacity) {
          this.options.opacity = opacity;
          if (this._container) {
            setOpacity(this._container, opacity);
          }
        }, "setOpacity"),
        _animateZoom: /* @__PURE__ */ __name(function(e) {
          var pos = this._map._latLngToNewLayerPoint(this._latlng, e.zoom, e.center);
          this._setPosition(pos);
        }, "_animateZoom"),
        _getAnchor: /* @__PURE__ */ __name(function() {
          return toPoint(this._source && this._source._getTooltipAnchor && !this.options.sticky ? this._source._getTooltipAnchor() : [0, 0]);
        }, "_getAnchor")
      });
      var tooltip = /* @__PURE__ */ __name(function(options, source) {
        return new Tooltip2(options, source);
      }, "tooltip");
      Map2.include({
        // @method openTooltip(tooltip: Tooltip): this
        // Opens the specified tooltip.
        // @alternative
        // @method openTooltip(content: String|HTMLElement, latlng: LatLng, options?: Tooltip options): this
        // Creates a tooltip with the specified content and options and open it.
        openTooltip: /* @__PURE__ */ __name(function(tooltip2, latlng, options) {
          this._initOverlay(Tooltip2, tooltip2, latlng, options).openOn(this);
          return this;
        }, "openTooltip"),
        // @method closeTooltip(tooltip: Tooltip): this
        // Closes the tooltip given as parameter.
        closeTooltip: /* @__PURE__ */ __name(function(tooltip2) {
          tooltip2.close();
          return this;
        }, "closeTooltip")
      });
      Layer.include({
        // @method bindTooltip(content: String|HTMLElement|Function|Tooltip, options?: Tooltip options): this
        // Binds a tooltip to the layer with the passed `content` and sets up the
        // necessary event listeners. If a `Function` is passed it will receive
        // the layer as the first argument and should return a `String` or `HTMLElement`.
        bindTooltip: /* @__PURE__ */ __name(function(content, options) {
          if (this._tooltip && this.isTooltipOpen()) {
            this.unbindTooltip();
          }
          this._tooltip = this._initOverlay(Tooltip2, this._tooltip, content, options);
          this._initTooltipInteractions();
          if (this._tooltip.options.permanent && this._map && this._map.hasLayer(this)) {
            this.openTooltip();
          }
          return this;
        }, "bindTooltip"),
        // @method unbindTooltip(): this
        // Removes the tooltip previously bound with `bindTooltip`.
        unbindTooltip: /* @__PURE__ */ __name(function() {
          if (this._tooltip) {
            this._initTooltipInteractions(true);
            this.closeTooltip();
            this._tooltip = null;
          }
          return this;
        }, "unbindTooltip"),
        _initTooltipInteractions: /* @__PURE__ */ __name(function(remove3) {
          if (!remove3 && this._tooltipHandlersAdded) {
            return;
          }
          var onOff = remove3 ? "off" : "on", events = {
            remove: this.closeTooltip,
            move: this._moveTooltip
          };
          if (!this._tooltip.options.permanent) {
            events.mouseover = this._openTooltip;
            events.mouseout = this.closeTooltip;
            events.click = this._openTooltip;
            if (this._map) {
              this._addFocusListeners();
            } else {
              events.add = this._addFocusListeners;
            }
          } else {
            events.add = this._openTooltip;
          }
          if (this._tooltip.options.sticky) {
            events.mousemove = this._moveTooltip;
          }
          this[onOff](events);
          this._tooltipHandlersAdded = !remove3;
        }, "_initTooltipInteractions"),
        // @method openTooltip(latlng?: LatLng): this
        // Opens the bound tooltip at the specified `latlng` or at the default tooltip anchor if no `latlng` is passed.
        openTooltip: /* @__PURE__ */ __name(function(latlng) {
          if (this._tooltip) {
            if (!(this instanceof FeatureGroup)) {
              this._tooltip._source = this;
            }
            if (this._tooltip._prepareOpen(latlng)) {
              this._tooltip.openOn(this._map);
              if (this.getElement) {
                this._setAriaDescribedByOnLayer(this);
              } else if (this.eachLayer) {
                this.eachLayer(this._setAriaDescribedByOnLayer, this);
              }
            }
          }
          return this;
        }, "openTooltip"),
        // @method closeTooltip(): this
        // Closes the tooltip bound to this layer if it is open.
        closeTooltip: /* @__PURE__ */ __name(function() {
          if (this._tooltip) {
            return this._tooltip.close();
          }
        }, "closeTooltip"),
        // @method toggleTooltip(): this
        // Opens or closes the tooltip bound to this layer depending on its current state.
        toggleTooltip: /* @__PURE__ */ __name(function() {
          if (this._tooltip) {
            this._tooltip.toggle(this);
          }
          return this;
        }, "toggleTooltip"),
        // @method isTooltipOpen(): boolean
        // Returns `true` if the tooltip bound to this layer is currently open.
        isTooltipOpen: /* @__PURE__ */ __name(function() {
          return this._tooltip.isOpen();
        }, "isTooltipOpen"),
        // @method setTooltipContent(content: String|HTMLElement|Tooltip): this
        // Sets the content of the tooltip bound to this layer.
        setTooltipContent: /* @__PURE__ */ __name(function(content) {
          if (this._tooltip) {
            this._tooltip.setContent(content);
          }
          return this;
        }, "setTooltipContent"),
        // @method getTooltip(): Tooltip
        // Returns the tooltip bound to this layer.
        getTooltip: /* @__PURE__ */ __name(function() {
          return this._tooltip;
        }, "getTooltip"),
        _addFocusListeners: /* @__PURE__ */ __name(function() {
          if (this.getElement) {
            this._addFocusListenersOnLayer(this);
          } else if (this.eachLayer) {
            this.eachLayer(this._addFocusListenersOnLayer, this);
          }
        }, "_addFocusListeners"),
        _addFocusListenersOnLayer: /* @__PURE__ */ __name(function(layer) {
          var el = typeof layer.getElement === "function" && layer.getElement();
          if (el) {
            on(el, "focus", function() {
              this._tooltip._source = layer;
              this.openTooltip();
            }, this);
            on(el, "blur", this.closeTooltip, this);
          }
        }, "_addFocusListenersOnLayer"),
        _setAriaDescribedByOnLayer: /* @__PURE__ */ __name(function(layer) {
          var el = typeof layer.getElement === "function" && layer.getElement();
          if (el) {
            el.setAttribute("aria-describedby", this._tooltip._container.id);
          }
        }, "_setAriaDescribedByOnLayer"),
        _openTooltip: /* @__PURE__ */ __name(function(e) {
          if (!this._tooltip || !this._map) {
            return;
          }
          if (this._map.dragging && this._map.dragging.moving() && !this._openOnceFlag) {
            this._openOnceFlag = true;
            var that = this;
            this._map.once("moveend", function() {
              that._openOnceFlag = false;
              that._openTooltip(e);
            });
            return;
          }
          this._tooltip._source = e.layer || e.target;
          this.openTooltip(this._tooltip.options.sticky ? e.latlng : void 0);
        }, "_openTooltip"),
        _moveTooltip: /* @__PURE__ */ __name(function(e) {
          var latlng = e.latlng, containerPoint, layerPoint;
          if (this._tooltip.options.sticky && e.originalEvent) {
            containerPoint = this._map.mouseEventToContainerPoint(e.originalEvent);
            layerPoint = this._map.containerPointToLayerPoint(containerPoint);
            latlng = this._map.layerPointToLatLng(layerPoint);
          }
          this._tooltip.setLatLng(latlng);
        }, "_moveTooltip")
      });
      var DivIcon = Icon.extend({
        options: {
          // @section
          // @aka DivIcon options
          iconSize: [12, 12],
          // also can be set through CSS
          // iconAnchor: (Point),
          // popupAnchor: (Point),
          // @option html: String|HTMLElement = ''
          // Custom HTML code to put inside the div element, empty by default. Alternatively,
          // an instance of `HTMLElement`.
          html: false,
          // @option bgPos: Point = [0, 0]
          // Optional relative position of the background, in pixels
          bgPos: null,
          className: "leaflet-div-icon"
        },
        createIcon: /* @__PURE__ */ __name(function(oldIcon) {
          var div = oldIcon && oldIcon.tagName === "DIV" ? oldIcon : document.createElement("div"), options = this.options;
          if (options.html instanceof Element) {
            empty2(div);
            div.appendChild(options.html);
          } else {
            div.innerHTML = options.html !== false ? options.html : "";
          }
          if (options.bgPos) {
            var bgPos = toPoint(options.bgPos);
            div.style.backgroundPosition = -bgPos.x + "px " + -bgPos.y + "px";
          }
          this._setIconStyles(div, "icon");
          return div;
        }, "createIcon"),
        createShadow: /* @__PURE__ */ __name(function() {
          return null;
        }, "createShadow")
      });
      function divIcon(options) {
        return new DivIcon(options);
      }
      __name(divIcon, "divIcon");
      Icon.Default = IconDefault;
      var GridLayer = Layer.extend({
        // @section
        // @aka GridLayer options
        options: {
          // @option tileSize: Number|Point = 256
          // Width and height of tiles in the grid. Use a number if width and height are equal, or `L.point(width, height)` otherwise.
          tileSize: 256,
          // @option opacity: Number = 1.0
          // Opacity of the tiles. Can be used in the `createTile()` function.
          opacity: 1,
          // @option updateWhenIdle: Boolean = (depends)
          // Load new tiles only when panning ends.
          // `true` by default on mobile browsers, in order to avoid too many requests and keep smooth navigation.
          // `false` otherwise in order to display new tiles _during_ panning, since it is easy to pan outside the
          // [`keepBuffer`](#gridlayer-keepbuffer) option in desktop browsers.
          updateWhenIdle: Browser.mobile,
          // @option updateWhenZooming: Boolean = true
          // By default, a smooth zoom animation (during a [touch zoom](#map-touchzoom) or a [`flyTo()`](#map-flyto)) will update grid layers every integer zoom level. Setting this option to `false` will update the grid layer only when the smooth animation ends.
          updateWhenZooming: true,
          // @option updateInterval: Number = 200
          // Tiles will not update more than once every `updateInterval` milliseconds when panning.
          updateInterval: 200,
          // @option zIndex: Number = 1
          // The explicit zIndex of the tile layer.
          zIndex: 1,
          // @option bounds: LatLngBounds = undefined
          // If set, tiles will only be loaded inside the set `LatLngBounds`.
          bounds: null,
          // @option minZoom: Number = 0
          // The minimum zoom level down to which this layer will be displayed (inclusive).
          minZoom: 0,
          // @option maxZoom: Number = undefined
          // The maximum zoom level up to which this layer will be displayed (inclusive).
          maxZoom: void 0,
          // @option maxNativeZoom: Number = undefined
          // Maximum zoom number the tile source has available. If it is specified,
          // the tiles on all zoom levels higher than `maxNativeZoom` will be loaded
          // from `maxNativeZoom` level and auto-scaled.
          maxNativeZoom: void 0,
          // @option minNativeZoom: Number = undefined
          // Minimum zoom number the tile source has available. If it is specified,
          // the tiles on all zoom levels lower than `minNativeZoom` will be loaded
          // from `minNativeZoom` level and auto-scaled.
          minNativeZoom: void 0,
          // @option noWrap: Boolean = false
          // Whether the layer is wrapped around the antimeridian. If `true`, the
          // GridLayer will only be displayed once at low zoom levels. Has no
          // effect when the [map CRS](#map-crs) doesn't wrap around. Can be used
          // in combination with [`bounds`](#gridlayer-bounds) to prevent requesting
          // tiles outside the CRS limits.
          noWrap: false,
          // @option pane: String = 'tilePane'
          // `Map pane` where the grid layer will be added.
          pane: "tilePane",
          // @option className: String = ''
          // A custom class name to assign to the tile layer. Empty by default.
          className: "",
          // @option keepBuffer: Number = 2
          // When panning the map, keep this many rows and columns of tiles before unloading them.
          keepBuffer: 2
        },
        initialize: /* @__PURE__ */ __name(function(options) {
          setOptions(this, options);
        }, "initialize"),
        onAdd: /* @__PURE__ */ __name(function() {
          this._initContainer();
          this._levels = {};
          this._tiles = {};
          this._resetView();
        }, "onAdd"),
        beforeAdd: /* @__PURE__ */ __name(function(map) {
          map._addZoomLimit(this);
        }, "beforeAdd"),
        onRemove: /* @__PURE__ */ __name(function(map) {
          this._removeAllTiles();
          remove2(this._container);
          map._removeZoomLimit(this);
          this._container = null;
          this._tileZoom = void 0;
        }, "onRemove"),
        // @method bringToFront: this
        // Brings the tile layer to the top of all tile layers.
        bringToFront: /* @__PURE__ */ __name(function() {
          if (this._map) {
            toFront(this._container);
            this._setAutoZIndex(Math.max);
          }
          return this;
        }, "bringToFront"),
        // @method bringToBack: this
        // Brings the tile layer to the bottom of all tile layers.
        bringToBack: /* @__PURE__ */ __name(function() {
          if (this._map) {
            toBack(this._container);
            this._setAutoZIndex(Math.min);
          }
          return this;
        }, "bringToBack"),
        // @method getContainer: HTMLElement
        // Returns the HTML element that contains the tiles for this layer.
        getContainer: /* @__PURE__ */ __name(function() {
          return this._container;
        }, "getContainer"),
        // @method setOpacity(opacity: Number): this
        // Changes the [opacity](#gridlayer-opacity) of the grid layer.
        setOpacity: /* @__PURE__ */ __name(function(opacity) {
          this.options.opacity = opacity;
          this._updateOpacity();
          return this;
        }, "setOpacity"),
        // @method setZIndex(zIndex: Number): this
        // Changes the [zIndex](#gridlayer-zindex) of the grid layer.
        setZIndex: /* @__PURE__ */ __name(function(zIndex) {
          this.options.zIndex = zIndex;
          this._updateZIndex();
          return this;
        }, "setZIndex"),
        // @method isLoading: Boolean
        // Returns `true` if any tile in the grid layer has not finished loading.
        isLoading: /* @__PURE__ */ __name(function() {
          return this._loading;
        }, "isLoading"),
        // @method redraw: this
        // Causes the layer to clear all the tiles and request them again.
        redraw: /* @__PURE__ */ __name(function() {
          if (this._map) {
            this._removeAllTiles();
            var tileZoom = this._clampZoom(this._map.getZoom());
            if (tileZoom !== this._tileZoom) {
              this._tileZoom = tileZoom;
              this._updateLevels();
            }
            this._update();
          }
          return this;
        }, "redraw"),
        getEvents: /* @__PURE__ */ __name(function() {
          var events = {
            viewprereset: this._invalidateAll,
            viewreset: this._resetView,
            zoom: this._resetView,
            moveend: this._onMoveEnd
          };
          if (!this.options.updateWhenIdle) {
            if (!this._onMove) {
              this._onMove = throttle(this._onMoveEnd, this.options.updateInterval, this);
            }
            events.move = this._onMove;
          }
          if (this._zoomAnimated) {
            events.zoomanim = this._animateZoom;
          }
          return events;
        }, "getEvents"),
        // @section Extension methods
        // Layers extending `GridLayer` shall reimplement the following method.
        // @method createTile(coords: Object, done?: Function): HTMLElement
        // Called only internally, must be overridden by classes extending `GridLayer`.
        // Returns the `HTMLElement` corresponding to the given `coords`. If the `done` callback
        // is specified, it must be called when the tile has finished loading and drawing.
        createTile: /* @__PURE__ */ __name(function() {
          return document.createElement("div");
        }, "createTile"),
        // @section
        // @method getTileSize: Point
        // Normalizes the [tileSize option](#gridlayer-tilesize) into a point. Used by the `createTile()` method.
        getTileSize: /* @__PURE__ */ __name(function() {
          var s = this.options.tileSize;
          return s instanceof Point ? s : new Point(s, s);
        }, "getTileSize"),
        _updateZIndex: /* @__PURE__ */ __name(function() {
          if (this._container && this.options.zIndex !== void 0 && this.options.zIndex !== null) {
            this._container.style.zIndex = this.options.zIndex;
          }
        }, "_updateZIndex"),
        _setAutoZIndex: /* @__PURE__ */ __name(function(compare) {
          var layers2 = this.getPane().children, edgeZIndex = -compare(-Infinity, Infinity);
          for (var i = 0, len = layers2.length, zIndex; i < len; i++) {
            zIndex = layers2[i].style.zIndex;
            if (layers2[i] !== this._container && zIndex) {
              edgeZIndex = compare(edgeZIndex, +zIndex);
            }
          }
          if (isFinite(edgeZIndex)) {
            this.options.zIndex = edgeZIndex + compare(-1, 1);
            this._updateZIndex();
          }
        }, "_setAutoZIndex"),
        _updateOpacity: /* @__PURE__ */ __name(function() {
          if (!this._map) {
            return;
          }
          if (Browser.ielt9) {
            return;
          }
          setOpacity(this._container, this.options.opacity);
          var now = +/* @__PURE__ */ new Date(), nextFrame = false, willPrune = false;
          for (var key in this._tiles) {
            var tile = this._tiles[key];
            if (!tile.current || !tile.loaded) {
              continue;
            }
            var fade = Math.min(1, (now - tile.loaded) / 200);
            setOpacity(tile.el, fade);
            if (fade < 1) {
              nextFrame = true;
            } else {
              if (tile.active) {
                willPrune = true;
              } else {
                this._onOpaqueTile(tile);
              }
              tile.active = true;
            }
          }
          if (willPrune && !this._noPrune) {
            this._pruneTiles();
          }
          if (nextFrame) {
            cancelAnimFrame(this._fadeFrame);
            this._fadeFrame = requestAnimFrame(this._updateOpacity, this);
          }
        }, "_updateOpacity"),
        _onOpaqueTile: falseFn,
        _initContainer: /* @__PURE__ */ __name(function() {
          if (this._container) {
            return;
          }
          this._container = create$1("div", "leaflet-layer " + (this.options.className || ""));
          this._updateZIndex();
          if (this.options.opacity < 1) {
            this._updateOpacity();
          }
          this.getPane().appendChild(this._container);
        }, "_initContainer"),
        _updateLevels: /* @__PURE__ */ __name(function() {
          var zoom2 = this._tileZoom, maxZoom = this.options.maxZoom;
          if (zoom2 === void 0) {
            return void 0;
          }
          for (var z in this._levels) {
            z = Number(z);
            if (this._levels[z].el.children.length || z === zoom2) {
              this._levels[z].el.style.zIndex = maxZoom - Math.abs(zoom2 - z);
              this._onUpdateLevel(z);
            } else {
              remove2(this._levels[z].el);
              this._removeTilesAtZoom(z);
              this._onRemoveLevel(z);
              delete this._levels[z];
            }
          }
          var level = this._levels[zoom2], map = this._map;
          if (!level) {
            level = this._levels[zoom2] = {};
            level.el = create$1("div", "leaflet-tile-container leaflet-zoom-animated", this._container);
            level.el.style.zIndex = maxZoom;
            level.origin = map.project(map.unproject(map.getPixelOrigin()), zoom2).round();
            level.zoom = zoom2;
            this._setZoomTransform(level, map.getCenter(), map.getZoom());
            falseFn(level.el.offsetWidth);
            this._onCreateLevel(level);
          }
          this._level = level;
          return level;
        }, "_updateLevels"),
        _onUpdateLevel: falseFn,
        _onRemoveLevel: falseFn,
        _onCreateLevel: falseFn,
        _pruneTiles: /* @__PURE__ */ __name(function() {
          if (!this._map) {
            return;
          }
          var key, tile;
          var zoom2 = this._map.getZoom();
          if (zoom2 > this.options.maxZoom || zoom2 < this.options.minZoom) {
            this._removeAllTiles();
            return;
          }
          for (key in this._tiles) {
            tile = this._tiles[key];
            tile.retain = tile.current;
          }
          for (key in this._tiles) {
            tile = this._tiles[key];
            if (tile.current && !tile.active) {
              var coords = tile.coords;
              if (!this._retainParent(coords.x, coords.y, coords.z, coords.z - 5)) {
                this._retainChildren(coords.x, coords.y, coords.z, coords.z + 2);
              }
            }
          }
          for (key in this._tiles) {
            if (!this._tiles[key].retain) {
              this._removeTile(key);
            }
          }
        }, "_pruneTiles"),
        _removeTilesAtZoom: /* @__PURE__ */ __name(function(zoom2) {
          for (var key in this._tiles) {
            if (this._tiles[key].coords.z !== zoom2) {
              continue;
            }
            this._removeTile(key);
          }
        }, "_removeTilesAtZoom"),
        _removeAllTiles: /* @__PURE__ */ __name(function() {
          for (var key in this._tiles) {
            this._removeTile(key);
          }
        }, "_removeAllTiles"),
        _invalidateAll: /* @__PURE__ */ __name(function() {
          for (var z in this._levels) {
            remove2(this._levels[z].el);
            this._onRemoveLevel(Number(z));
            delete this._levels[z];
          }
          this._removeAllTiles();
          this._tileZoom = void 0;
        }, "_invalidateAll"),
        _retainParent: /* @__PURE__ */ __name(function(x, y, z, minZoom) {
          var x2 = Math.floor(x / 2), y2 = Math.floor(y / 2), z2 = z - 1, coords2 = new Point(+x2, +y2);
          coords2.z = +z2;
          var key = this._tileCoordsToKey(coords2), tile = this._tiles[key];
          if (tile && tile.active) {
            tile.retain = true;
            return true;
          } else if (tile && tile.loaded) {
            tile.retain = true;
          }
          if (z2 > minZoom) {
            return this._retainParent(x2, y2, z2, minZoom);
          }
          return false;
        }, "_retainParent"),
        _retainChildren: /* @__PURE__ */ __name(function(x, y, z, maxZoom) {
          for (var i = 2 * x; i < 2 * x + 2; i++) {
            for (var j = 2 * y; j < 2 * y + 2; j++) {
              var coords = new Point(i, j);
              coords.z = z + 1;
              var key = this._tileCoordsToKey(coords), tile = this._tiles[key];
              if (tile && tile.active) {
                tile.retain = true;
                continue;
              } else if (tile && tile.loaded) {
                tile.retain = true;
              }
              if (z + 1 < maxZoom) {
                this._retainChildren(i, j, z + 1, maxZoom);
              }
            }
          }
        }, "_retainChildren"),
        _resetView: /* @__PURE__ */ __name(function(e) {
          var animating = e && (e.pinch || e.flyTo);
          this._setView(this._map.getCenter(), this._map.getZoom(), animating, animating);
        }, "_resetView"),
        _animateZoom: /* @__PURE__ */ __name(function(e) {
          this._setView(e.center, e.zoom, true, e.noUpdate);
        }, "_animateZoom"),
        _clampZoom: /* @__PURE__ */ __name(function(zoom2) {
          var options = this.options;
          if (void 0 !== options.minNativeZoom && zoom2 < options.minNativeZoom) {
            return options.minNativeZoom;
          }
          if (void 0 !== options.maxNativeZoom && options.maxNativeZoom < zoom2) {
            return options.maxNativeZoom;
          }
          return zoom2;
        }, "_clampZoom"),
        _setView: /* @__PURE__ */ __name(function(center, zoom2, noPrune, noUpdate) {
          var tileZoom = Math.round(zoom2);
          if (this.options.maxZoom !== void 0 && tileZoom > this.options.maxZoom || this.options.minZoom !== void 0 && tileZoom < this.options.minZoom) {
            tileZoom = void 0;
          } else {
            tileZoom = this._clampZoom(tileZoom);
          }
          var tileZoomChanged = this.options.updateWhenZooming && tileZoom !== this._tileZoom;
          if (!noUpdate || tileZoomChanged) {
            this._tileZoom = tileZoom;
            if (this._abortLoading) {
              this._abortLoading();
            }
            this._updateLevels();
            this._resetGrid();
            if (tileZoom !== void 0) {
              this._update(center);
            }
            if (!noPrune) {
              this._pruneTiles();
            }
            this._noPrune = !!noPrune;
          }
          this._setZoomTransforms(center, zoom2);
        }, "_setView"),
        _setZoomTransforms: /* @__PURE__ */ __name(function(center, zoom2) {
          for (var i in this._levels) {
            this._setZoomTransform(this._levels[i], center, zoom2);
          }
        }, "_setZoomTransforms"),
        _setZoomTransform: /* @__PURE__ */ __name(function(level, center, zoom2) {
          var scale2 = this._map.getZoomScale(zoom2, level.zoom), translate = level.origin.multiplyBy(scale2).subtract(this._map._getNewPixelOrigin(center, zoom2)).round();
          if (Browser.any3d) {
            setTransform(level.el, translate, scale2);
          } else {
            setPosition(level.el, translate);
          }
        }, "_setZoomTransform"),
        _resetGrid: /* @__PURE__ */ __name(function() {
          var map = this._map, crs = map.options.crs, tileSize = this._tileSize = this.getTileSize(), tileZoom = this._tileZoom;
          var bounds = this._map.getPixelWorldBounds(this._tileZoom);
          if (bounds) {
            this._globalTileRange = this._pxBoundsToTileRange(bounds);
          }
          this._wrapX = crs.wrapLng && !this.options.noWrap && [
            Math.floor(map.project([0, crs.wrapLng[0]], tileZoom).x / tileSize.x),
            Math.ceil(map.project([0, crs.wrapLng[1]], tileZoom).x / tileSize.y)
          ];
          this._wrapY = crs.wrapLat && !this.options.noWrap && [
            Math.floor(map.project([crs.wrapLat[0], 0], tileZoom).y / tileSize.x),
            Math.ceil(map.project([crs.wrapLat[1], 0], tileZoom).y / tileSize.y)
          ];
        }, "_resetGrid"),
        _onMoveEnd: /* @__PURE__ */ __name(function() {
          if (!this._map || this._map._animatingZoom) {
            return;
          }
          this._update();
        }, "_onMoveEnd"),
        _getTiledPixelBounds: /* @__PURE__ */ __name(function(center) {
          var map = this._map, mapZoom = map._animatingZoom ? Math.max(map._animateToZoom, map.getZoom()) : map.getZoom(), scale2 = map.getZoomScale(mapZoom, this._tileZoom), pixelCenter = map.project(center, this._tileZoom).floor(), halfSize = map.getSize().divideBy(scale2 * 2);
          return new Bounds(pixelCenter.subtract(halfSize), pixelCenter.add(halfSize));
        }, "_getTiledPixelBounds"),
        // Private method to load tiles in the grid's active zoom level according to map bounds
        _update: /* @__PURE__ */ __name(function(center) {
          var map = this._map;
          if (!map) {
            return;
          }
          var zoom2 = this._clampZoom(map.getZoom());
          if (center === void 0) {
            center = map.getCenter();
          }
          if (this._tileZoom === void 0) {
            return;
          }
          var pixelBounds = this._getTiledPixelBounds(center), tileRange = this._pxBoundsToTileRange(pixelBounds), tileCenter = tileRange.getCenter(), queue = [], margin = this.options.keepBuffer, noPruneRange = new Bounds(
            tileRange.getBottomLeft().subtract([margin, -margin]),
            tileRange.getTopRight().add([margin, -margin])
          );
          if (!(isFinite(tileRange.min.x) && isFinite(tileRange.min.y) && isFinite(tileRange.max.x) && isFinite(tileRange.max.y))) {
            throw new Error("Attempted to load an infinite number of tiles");
          }
          for (var key in this._tiles) {
            var c = this._tiles[key].coords;
            if (c.z !== this._tileZoom || !noPruneRange.contains(new Point(c.x, c.y))) {
              this._tiles[key].current = false;
            }
          }
          if (Math.abs(zoom2 - this._tileZoom) > 1) {
            this._setView(center, zoom2);
            return;
          }
          for (var j = tileRange.min.y; j <= tileRange.max.y; j++) {
            for (var i = tileRange.min.x; i <= tileRange.max.x; i++) {
              var coords = new Point(i, j);
              coords.z = this._tileZoom;
              if (!this._isValidTile(coords)) {
                continue;
              }
              var tile = this._tiles[this._tileCoordsToKey(coords)];
              if (tile) {
                tile.current = true;
              } else {
                queue.push(coords);
              }
            }
          }
          queue.sort(function(a, b) {
            return a.distanceTo(tileCenter) - b.distanceTo(tileCenter);
          });
          if (queue.length !== 0) {
            if (!this._loading) {
              this._loading = true;
              this.fire("loading");
            }
            var fragment = document.createDocumentFragment();
            for (i = 0; i < queue.length; i++) {
              this._addTile(queue[i], fragment);
            }
            this._level.el.appendChild(fragment);
          }
        }, "_update"),
        _isValidTile: /* @__PURE__ */ __name(function(coords) {
          var crs = this._map.options.crs;
          if (!crs.infinite) {
            var bounds = this._globalTileRange;
            if (!crs.wrapLng && (coords.x < bounds.min.x || coords.x > bounds.max.x) || !crs.wrapLat && (coords.y < bounds.min.y || coords.y > bounds.max.y)) {
              return false;
            }
          }
          if (!this.options.bounds) {
            return true;
          }
          var tileBounds = this._tileCoordsToBounds(coords);
          return toLatLngBounds(this.options.bounds).overlaps(tileBounds);
        }, "_isValidTile"),
        _keyToBounds: /* @__PURE__ */ __name(function(key) {
          return this._tileCoordsToBounds(this._keyToTileCoords(key));
        }, "_keyToBounds"),
        _tileCoordsToNwSe: /* @__PURE__ */ __name(function(coords) {
          var map = this._map, tileSize = this.getTileSize(), nwPoint = coords.scaleBy(tileSize), sePoint = nwPoint.add(tileSize), nw = map.unproject(nwPoint, coords.z), se = map.unproject(sePoint, coords.z);
          return [nw, se];
        }, "_tileCoordsToNwSe"),
        // converts tile coordinates to its geographical bounds
        _tileCoordsToBounds: /* @__PURE__ */ __name(function(coords) {
          var bp = this._tileCoordsToNwSe(coords), bounds = new LatLngBounds(bp[0], bp[1]);
          if (!this.options.noWrap) {
            bounds = this._map.wrapLatLngBounds(bounds);
          }
          return bounds;
        }, "_tileCoordsToBounds"),
        // converts tile coordinates to key for the tile cache
        _tileCoordsToKey: /* @__PURE__ */ __name(function(coords) {
          return coords.x + ":" + coords.y + ":" + coords.z;
        }, "_tileCoordsToKey"),
        // converts tile cache key to coordinates
        _keyToTileCoords: /* @__PURE__ */ __name(function(key) {
          var k = key.split(":"), coords = new Point(+k[0], +k[1]);
          coords.z = +k[2];
          return coords;
        }, "_keyToTileCoords"),
        _removeTile: /* @__PURE__ */ __name(function(key) {
          var tile = this._tiles[key];
          if (!tile) {
            return;
          }
          remove2(tile.el);
          delete this._tiles[key];
          this.fire("tileunload", {
            tile: tile.el,
            coords: this._keyToTileCoords(key)
          });
        }, "_removeTile"),
        _initTile: /* @__PURE__ */ __name(function(tile) {
          addClass2(tile, "leaflet-tile");
          var tileSize = this.getTileSize();
          tile.style.width = tileSize.x + "px";
          tile.style.height = tileSize.y + "px";
          tile.onselectstart = falseFn;
          tile.onmousemove = falseFn;
          if (Browser.ielt9 && this.options.opacity < 1) {
            setOpacity(tile, this.options.opacity);
          }
        }, "_initTile"),
        _addTile: /* @__PURE__ */ __name(function(coords, container) {
          var tilePos = this._getTilePos(coords), key = this._tileCoordsToKey(coords);
          var tile = this.createTile(this._wrapCoords(coords), bind(this._tileReady, this, coords));
          this._initTile(tile);
          if (this.createTile.length < 2) {
            requestAnimFrame(bind(this._tileReady, this, coords, null, tile));
          }
          setPosition(tile, tilePos);
          this._tiles[key] = {
            el: tile,
            coords,
            current: true
          };
          container.appendChild(tile);
          this.fire("tileloadstart", {
            tile,
            coords
          });
        }, "_addTile"),
        _tileReady: /* @__PURE__ */ __name(function(coords, err, tile) {
          if (err) {
            this.fire("tileerror", {
              error: err,
              tile,
              coords
            });
          }
          var key = this._tileCoordsToKey(coords);
          tile = this._tiles[key];
          if (!tile) {
            return;
          }
          tile.loaded = +/* @__PURE__ */ new Date();
          if (this._map._fadeAnimated) {
            setOpacity(tile.el, 0);
            cancelAnimFrame(this._fadeFrame);
            this._fadeFrame = requestAnimFrame(this._updateOpacity, this);
          } else {
            tile.active = true;
            this._pruneTiles();
          }
          if (!err) {
            addClass2(tile.el, "leaflet-tile-loaded");
            this.fire("tileload", {
              tile: tile.el,
              coords
            });
          }
          if (this._noTilesToLoad()) {
            this._loading = false;
            this.fire("load");
            if (Browser.ielt9 || !this._map._fadeAnimated) {
              requestAnimFrame(this._pruneTiles, this);
            } else {
              setTimeout(bind(this._pruneTiles, this), 250);
            }
          }
        }, "_tileReady"),
        _getTilePos: /* @__PURE__ */ __name(function(coords) {
          return coords.scaleBy(this.getTileSize()).subtract(this._level.origin);
        }, "_getTilePos"),
        _wrapCoords: /* @__PURE__ */ __name(function(coords) {
          var newCoords = new Point(
            this._wrapX ? wrapNum(coords.x, this._wrapX) : coords.x,
            this._wrapY ? wrapNum(coords.y, this._wrapY) : coords.y
          );
          newCoords.z = coords.z;
          return newCoords;
        }, "_wrapCoords"),
        _pxBoundsToTileRange: /* @__PURE__ */ __name(function(bounds) {
          var tileSize = this.getTileSize();
          return new Bounds(
            bounds.min.unscaleBy(tileSize).floor(),
            bounds.max.unscaleBy(tileSize).ceil().subtract([1, 1])
          );
        }, "_pxBoundsToTileRange"),
        _noTilesToLoad: /* @__PURE__ */ __name(function() {
          for (var key in this._tiles) {
            if (!this._tiles[key].loaded) {
              return false;
            }
          }
          return true;
        }, "_noTilesToLoad")
      });
      function gridLayer(options) {
        return new GridLayer(options);
      }
      __name(gridLayer, "gridLayer");
      var TileLayer = GridLayer.extend({
        // @section
        // @aka TileLayer options
        options: {
          // @option minZoom: Number = 0
          // The minimum zoom level down to which this layer will be displayed (inclusive).
          minZoom: 0,
          // @option maxZoom: Number = 18
          // The maximum zoom level up to which this layer will be displayed (inclusive).
          maxZoom: 18,
          // @option subdomains: String|String[] = 'abc'
          // Subdomains of the tile service. Can be passed in the form of one string (where each letter is a subdomain name) or an array of strings.
          subdomains: "abc",
          // @option errorTileUrl: String = ''
          // URL to the tile image to show in place of the tile that failed to load.
          errorTileUrl: "",
          // @option zoomOffset: Number = 0
          // The zoom number used in tile URLs will be offset with this value.
          zoomOffset: 0,
          // @option tms: Boolean = false
          // If `true`, inverses Y axis numbering for tiles (turn this on for [TMS](https://en.wikipedia.org/wiki/Tile_Map_Service) services).
          tms: false,
          // @option zoomReverse: Boolean = false
          // If set to true, the zoom number used in tile URLs will be reversed (`maxZoom - zoom` instead of `zoom`)
          zoomReverse: false,
          // @option detectRetina: Boolean = false
          // If `true` and user is on a retina display, it will request four tiles of half the specified size and a bigger zoom level in place of one to utilize the high resolution.
          detectRetina: false,
          // @option crossOrigin: Boolean|String = false
          // Whether the crossOrigin attribute will be added to the tiles.
          // If a String is provided, all tiles will have their crossOrigin attribute set to the String provided. This is needed if you want to access tile pixel data.
          // Refer to [CORS Settings](https://developer.mozilla.org/en-US/docs/Web/HTML/CORS_settings_attributes) for valid String values.
          crossOrigin: false,
          // @option referrerPolicy: Boolean|String = false
          // Whether the referrerPolicy attribute will be added to the tiles.
          // If a String is provided, all tiles will have their referrerPolicy attribute set to the String provided.
          // This may be needed if your map's rendering context has a strict default but your tile provider expects a valid referrer
          // (e.g. to validate an API token).
          // Refer to [HTMLImageElement.referrerPolicy](https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement/referrerPolicy) for valid String values.
          referrerPolicy: false
        },
        initialize: /* @__PURE__ */ __name(function(url2, options) {
          this._url = url2;
          options = setOptions(this, options);
          if (options.detectRetina && Browser.retina && options.maxZoom > 0) {
            options.tileSize = Math.floor(options.tileSize / 2);
            if (!options.zoomReverse) {
              options.zoomOffset++;
              options.maxZoom = Math.max(options.minZoom, options.maxZoom - 1);
            } else {
              options.zoomOffset--;
              options.minZoom = Math.min(options.maxZoom, options.minZoom + 1);
            }
            options.minZoom = Math.max(0, options.minZoom);
          } else if (!options.zoomReverse) {
            options.maxZoom = Math.max(options.minZoom, options.maxZoom);
          } else {
            options.minZoom = Math.min(options.maxZoom, options.minZoom);
          }
          if (typeof options.subdomains === "string") {
            options.subdomains = options.subdomains.split("");
          }
          this.on("tileunload", this._onTileRemove);
        }, "initialize"),
        // @method setUrl(url: String, noRedraw?: Boolean): this
        // Updates the layer's URL template and redraws it (unless `noRedraw` is set to `true`).
        // If the URL does not change, the layer will not be redrawn unless
        // the noRedraw parameter is set to false.
        setUrl: /* @__PURE__ */ __name(function(url2, noRedraw) {
          if (this._url === url2 && noRedraw === void 0) {
            noRedraw = true;
          }
          this._url = url2;
          if (!noRedraw) {
            this.redraw();
          }
          return this;
        }, "setUrl"),
        // @method createTile(coords: Object, done?: Function): HTMLElement
        // Called only internally, overrides GridLayer's [`createTile()`](#gridlayer-createtile)
        // to return an `<img>` HTML element with the appropriate image URL given `coords`. The `done`
        // callback is called when the tile has been loaded.
        createTile: /* @__PURE__ */ __name(function(coords, done) {
          var tile = document.createElement("img");
          on(tile, "load", bind(this._tileOnLoad, this, done, tile));
          on(tile, "error", bind(this._tileOnError, this, done, tile));
          if (this.options.crossOrigin || this.options.crossOrigin === "") {
            tile.crossOrigin = this.options.crossOrigin === true ? "" : this.options.crossOrigin;
          }
          if (typeof this.options.referrerPolicy === "string") {
            tile.referrerPolicy = this.options.referrerPolicy;
          }
          tile.alt = "";
          tile.src = this.getTileUrl(coords);
          return tile;
        }, "createTile"),
        // @section Extension methods
        // @uninheritable
        // Layers extending `TileLayer` might reimplement the following method.
        // @method getTileUrl(coords: Object): String
        // Called only internally, returns the URL for a tile given its coordinates.
        // Classes extending `TileLayer` can override this function to provide custom tile URL naming schemes.
        getTileUrl: /* @__PURE__ */ __name(function(coords) {
          var data = {
            r: Browser.retina ? "@2x" : "",
            s: this._getSubdomain(coords),
            x: coords.x,
            y: coords.y,
            z: this._getZoomForUrl()
          };
          if (this._map && !this._map.options.crs.infinite) {
            var invertedY = this._globalTileRange.max.y - coords.y;
            if (this.options.tms) {
              data["y"] = invertedY;
            }
            data["-y"] = invertedY;
          }
          return template(this._url, extend(data, this.options));
        }, "getTileUrl"),
        _tileOnLoad: /* @__PURE__ */ __name(function(done, tile) {
          if (Browser.ielt9) {
            setTimeout(bind(done, this, null, tile), 0);
          } else {
            done(null, tile);
          }
        }, "_tileOnLoad"),
        _tileOnError: /* @__PURE__ */ __name(function(done, tile, e) {
          var errorUrl = this.options.errorTileUrl;
          if (errorUrl && tile.getAttribute("src") !== errorUrl) {
            tile.src = errorUrl;
          }
          done(e, tile);
        }, "_tileOnError"),
        _onTileRemove: /* @__PURE__ */ __name(function(e) {
          e.tile.onload = null;
        }, "_onTileRemove"),
        _getZoomForUrl: /* @__PURE__ */ __name(function() {
          var zoom2 = this._tileZoom, maxZoom = this.options.maxZoom, zoomReverse = this.options.zoomReverse, zoomOffset = this.options.zoomOffset;
          if (zoomReverse) {
            zoom2 = maxZoom - zoom2;
          }
          return zoom2 + zoomOffset;
        }, "_getZoomForUrl"),
        _getSubdomain: /* @__PURE__ */ __name(function(tilePoint) {
          var index2 = Math.abs(tilePoint.x + tilePoint.y) % this.options.subdomains.length;
          return this.options.subdomains[index2];
        }, "_getSubdomain"),
        // stops loading all tiles in the background layer
        _abortLoading: /* @__PURE__ */ __name(function() {
          var i, tile;
          for (i in this._tiles) {
            if (this._tiles[i].coords.z !== this._tileZoom) {
              tile = this._tiles[i].el;
              tile.onload = falseFn;
              tile.onerror = falseFn;
              if (!tile.complete) {
                tile.src = emptyImageUrl;
                var coords = this._tiles[i].coords;
                remove2(tile);
                delete this._tiles[i];
                this.fire("tileabort", {
                  tile,
                  coords
                });
              }
            }
          }
        }, "_abortLoading"),
        _removeTile: /* @__PURE__ */ __name(function(key) {
          var tile = this._tiles[key];
          if (!tile) {
            return;
          }
          tile.el.setAttribute("src", emptyImageUrl);
          return GridLayer.prototype._removeTile.call(this, key);
        }, "_removeTile"),
        _tileReady: /* @__PURE__ */ __name(function(coords, err, tile) {
          if (!this._map || tile && tile.getAttribute("src") === emptyImageUrl) {
            return;
          }
          return GridLayer.prototype._tileReady.call(this, coords, err, tile);
        }, "_tileReady")
      });
      function tileLayer(url2, options) {
        return new TileLayer(url2, options);
      }
      __name(tileLayer, "tileLayer");
      var TileLayerWMS = TileLayer.extend({
        // @section
        // @aka TileLayer.WMS options
        // If any custom options not documented here are used, they will be sent to the
        // WMS server as extra parameters in each request URL. This can be useful for
        // [non-standard vendor WMS parameters](https://docs.geoserver.org/stable/en/user/services/wms/vendor.html).
        defaultWmsParams: {
          service: "WMS",
          request: "GetMap",
          // @option layers: String = ''
          // **(required)** Comma-separated list of WMS layers to show.
          layers: "",
          // @option styles: String = ''
          // Comma-separated list of WMS styles.
          styles: "",
          // @option format: String = 'image/jpeg'
          // WMS image format (use `'image/png'` for layers with transparency).
          format: "image/jpeg",
          // @option transparent: Boolean = false
          // If `true`, the WMS service will return images with transparency.
          transparent: false,
          // @option version: String = '1.1.1'
          // Version of the WMS service to use
          version: "1.1.1"
        },
        options: {
          // @option crs: CRS = null
          // Coordinate Reference System to use for the WMS requests, defaults to
          // map CRS. Don't change this if you're not sure what it means.
          crs: null,
          // @option uppercase: Boolean = false
          // If `true`, WMS request parameter keys will be uppercase.
          uppercase: false
        },
        initialize: /* @__PURE__ */ __name(function(url2, options) {
          this._url = url2;
          var wmsParams = extend({}, this.defaultWmsParams);
          for (var i in options) {
            if (!(i in this.options)) {
              wmsParams[i] = options[i];
            }
          }
          options = setOptions(this, options);
          var realRetina = options.detectRetina && Browser.retina ? 2 : 1;
          var tileSize = this.getTileSize();
          wmsParams.width = tileSize.x * realRetina;
          wmsParams.height = tileSize.y * realRetina;
          this.wmsParams = wmsParams;
        }, "initialize"),
        onAdd: /* @__PURE__ */ __name(function(map) {
          this._crs = this.options.crs || map.options.crs;
          this._wmsVersion = parseFloat(this.wmsParams.version);
          var projectionKey = this._wmsVersion >= 1.3 ? "crs" : "srs";
          this.wmsParams[projectionKey] = this._crs.code;
          TileLayer.prototype.onAdd.call(this, map);
        }, "onAdd"),
        getTileUrl: /* @__PURE__ */ __name(function(coords) {
          var tileBounds = this._tileCoordsToNwSe(coords), crs = this._crs, bounds = toBounds(crs.project(tileBounds[0]), crs.project(tileBounds[1])), min2 = bounds.min, max2 = bounds.max, bbox = (this._wmsVersion >= 1.3 && this._crs === EPSG4326 ? [min2.y, min2.x, max2.y, max2.x] : [min2.x, min2.y, max2.x, max2.y]).join(","), url2 = TileLayer.prototype.getTileUrl.call(this, coords);
          return url2 + getParamString(this.wmsParams, url2, this.options.uppercase) + (this.options.uppercase ? "&BBOX=" : "&bbox=") + bbox;
        }, "getTileUrl"),
        // @method setParams(params: Object, noRedraw?: Boolean): this
        // Merges an object with the new parameters and re-requests tiles on the current screen (unless `noRedraw` was set to true).
        setParams: /* @__PURE__ */ __name(function(params, noRedraw) {
          extend(this.wmsParams, params);
          if (!noRedraw) {
            this.redraw();
          }
          return this;
        }, "setParams")
      });
      function tileLayerWMS(url2, options) {
        return new TileLayerWMS(url2, options);
      }
      __name(tileLayerWMS, "tileLayerWMS");
      TileLayer.WMS = TileLayerWMS;
      tileLayer.wms = tileLayerWMS;
      var Renderer = Layer.extend({
        // @section
        // @aka Renderer options
        options: {
          // @option padding: Number = 0.1
          // How much to extend the clip area around the map view (relative to its size)
          // e.g. 0.1 would be 10% of map view in each direction
          padding: 0.1
        },
        initialize: /* @__PURE__ */ __name(function(options) {
          setOptions(this, options);
          stamp(this);
          this._layers = this._layers || {};
        }, "initialize"),
        onAdd: /* @__PURE__ */ __name(function() {
          if (!this._container) {
            this._initContainer();
            addClass2(this._container, "leaflet-zoom-animated");
          }
          this.getPane().appendChild(this._container);
          this._update();
          this.on("update", this._updatePaths, this);
        }, "onAdd"),
        onRemove: /* @__PURE__ */ __name(function() {
          this.off("update", this._updatePaths, this);
          this._destroyContainer();
        }, "onRemove"),
        getEvents: /* @__PURE__ */ __name(function() {
          var events = {
            viewreset: this._reset,
            zoom: this._onZoom,
            moveend: this._update,
            zoomend: this._onZoomEnd
          };
          if (this._zoomAnimated) {
            events.zoomanim = this._onAnimZoom;
          }
          return events;
        }, "getEvents"),
        _onAnimZoom: /* @__PURE__ */ __name(function(ev) {
          this._updateTransform(ev.center, ev.zoom);
        }, "_onAnimZoom"),
        _onZoom: /* @__PURE__ */ __name(function() {
          this._updateTransform(this._map.getCenter(), this._map.getZoom());
        }, "_onZoom"),
        _updateTransform: /* @__PURE__ */ __name(function(center, zoom2) {
          var scale2 = this._map.getZoomScale(zoom2, this._zoom), viewHalf = this._map.getSize().multiplyBy(0.5 + this.options.padding), currentCenterPoint = this._map.project(this._center, zoom2), topLeftOffset = viewHalf.multiplyBy(-scale2).add(currentCenterPoint).subtract(this._map._getNewPixelOrigin(center, zoom2));
          if (Browser.any3d) {
            setTransform(this._container, topLeftOffset, scale2);
          } else {
            setPosition(this._container, topLeftOffset);
          }
        }, "_updateTransform"),
        _reset: /* @__PURE__ */ __name(function() {
          this._update();
          this._updateTransform(this._center, this._zoom);
          for (var id in this._layers) {
            this._layers[id]._reset();
          }
        }, "_reset"),
        _onZoomEnd: /* @__PURE__ */ __name(function() {
          for (var id in this._layers) {
            this._layers[id]._project();
          }
        }, "_onZoomEnd"),
        _updatePaths: /* @__PURE__ */ __name(function() {
          for (var id in this._layers) {
            this._layers[id]._update();
          }
        }, "_updatePaths"),
        _update: /* @__PURE__ */ __name(function() {
          var p = this.options.padding, size = this._map.getSize(), min2 = this._map.containerPointToLayerPoint(size.multiplyBy(-p)).round();
          this._bounds = new Bounds(min2, min2.add(size.multiplyBy(1 + p * 2)).round());
          this._center = this._map.getCenter();
          this._zoom = this._map.getZoom();
        }, "_update")
      });
      var Canvas = Renderer.extend({
        // @section
        // @aka Canvas options
        options: {
          // @option tolerance: Number = 0
          // How much to extend the click tolerance around a path/object on the map.
          tolerance: 0
        },
        getEvents: /* @__PURE__ */ __name(function() {
          var events = Renderer.prototype.getEvents.call(this);
          events.viewprereset = this._onViewPreReset;
          return events;
        }, "getEvents"),
        _onViewPreReset: /* @__PURE__ */ __name(function() {
          this._postponeUpdatePaths = true;
        }, "_onViewPreReset"),
        onAdd: /* @__PURE__ */ __name(function() {
          Renderer.prototype.onAdd.call(this);
          this._draw();
        }, "onAdd"),
        _initContainer: /* @__PURE__ */ __name(function() {
          var container = this._container = document.createElement("canvas");
          on(container, "mousemove", this._onMouseMove, this);
          on(container, "click dblclick mousedown mouseup contextmenu", this._onClick, this);
          on(container, "mouseout", this._handleMouseOut, this);
          container["_leaflet_disable_events"] = true;
          this._ctx = container.getContext("2d");
        }, "_initContainer"),
        _destroyContainer: /* @__PURE__ */ __name(function() {
          cancelAnimFrame(this._redrawRequest);
          delete this._ctx;
          remove2(this._container);
          off(this._container);
          delete this._container;
        }, "_destroyContainer"),
        _updatePaths: /* @__PURE__ */ __name(function() {
          if (this._postponeUpdatePaths) {
            return;
          }
          var layer;
          this._redrawBounds = null;
          for (var id in this._layers) {
            layer = this._layers[id];
            layer._update();
          }
          this._redraw();
        }, "_updatePaths"),
        _update: /* @__PURE__ */ __name(function() {
          if (this._map._animatingZoom && this._bounds) {
            return;
          }
          Renderer.prototype._update.call(this);
          var b = this._bounds, container = this._container, size = b.getSize(), m = Browser.retina ? 2 : 1;
          setPosition(container, b.min);
          container.width = m * size.x;
          container.height = m * size.y;
          container.style.width = size.x + "px";
          container.style.height = size.y + "px";
          if (Browser.retina) {
            this._ctx.scale(2, 2);
          }
          this._ctx.translate(-b.min.x, -b.min.y);
          this.fire("update");
        }, "_update"),
        _reset: /* @__PURE__ */ __name(function() {
          Renderer.prototype._reset.call(this);
          if (this._postponeUpdatePaths) {
            this._postponeUpdatePaths = false;
            this._updatePaths();
          }
        }, "_reset"),
        _initPath: /* @__PURE__ */ __name(function(layer) {
          this._updateDashArray(layer);
          this._layers[stamp(layer)] = layer;
          var order = layer._order = {
            layer,
            prev: this._drawLast,
            next: null
          };
          if (this._drawLast) {
            this._drawLast.next = order;
          }
          this._drawLast = order;
          this._drawFirst = this._drawFirst || this._drawLast;
        }, "_initPath"),
        _addPath: /* @__PURE__ */ __name(function(layer) {
          this._requestRedraw(layer);
        }, "_addPath"),
        _removePath: /* @__PURE__ */ __name(function(layer) {
          var order = layer._order;
          var next3 = order.next;
          var prev = order.prev;
          if (next3) {
            next3.prev = prev;
          } else {
            this._drawLast = prev;
          }
          if (prev) {
            prev.next = next3;
          } else {
            this._drawFirst = next3;
          }
          delete layer._order;
          delete this._layers[stamp(layer)];
          this._requestRedraw(layer);
        }, "_removePath"),
        _updatePath: /* @__PURE__ */ __name(function(layer) {
          this._extendRedrawBounds(layer);
          layer._project();
          layer._update();
          this._requestRedraw(layer);
        }, "_updatePath"),
        _updateStyle: /* @__PURE__ */ __name(function(layer) {
          this._updateDashArray(layer);
          this._requestRedraw(layer);
        }, "_updateStyle"),
        _updateDashArray: /* @__PURE__ */ __name(function(layer) {
          if (typeof layer.options.dashArray === "string") {
            var parts = layer.options.dashArray.split(/[, ]+/), dashArray = [], dashValue, i;
            for (i = 0; i < parts.length; i++) {
              dashValue = Number(parts[i]);
              if (isNaN(dashValue)) {
                return;
              }
              dashArray.push(dashValue);
            }
            layer.options._dashArray = dashArray;
          } else {
            layer.options._dashArray = layer.options.dashArray;
          }
        }, "_updateDashArray"),
        _requestRedraw: /* @__PURE__ */ __name(function(layer) {
          if (!this._map) {
            return;
          }
          this._extendRedrawBounds(layer);
          this._redrawRequest = this._redrawRequest || requestAnimFrame(this._redraw, this);
        }, "_requestRedraw"),
        _extendRedrawBounds: /* @__PURE__ */ __name(function(layer) {
          if (layer._pxBounds) {
            var padding = (layer.options.weight || 0) + 1;
            this._redrawBounds = this._redrawBounds || new Bounds();
            this._redrawBounds.extend(layer._pxBounds.min.subtract([padding, padding]));
            this._redrawBounds.extend(layer._pxBounds.max.add([padding, padding]));
          }
        }, "_extendRedrawBounds"),
        _redraw: /* @__PURE__ */ __name(function() {
          this._redrawRequest = null;
          if (this._redrawBounds) {
            this._redrawBounds.min._floor();
            this._redrawBounds.max._ceil();
          }
          this._clear();
          this._draw();
          this._redrawBounds = null;
        }, "_redraw"),
        _clear: /* @__PURE__ */ __name(function() {
          var bounds = this._redrawBounds;
          if (bounds) {
            var size = bounds.getSize();
            this._ctx.clearRect(bounds.min.x, bounds.min.y, size.x, size.y);
          } else {
            this._ctx.save();
            this._ctx.setTransform(1, 0, 0, 1, 0, 0);
            this._ctx.clearRect(0, 0, this._container.width, this._container.height);
            this._ctx.restore();
          }
        }, "_clear"),
        _draw: /* @__PURE__ */ __name(function() {
          var layer, bounds = this._redrawBounds;
          this._ctx.save();
          if (bounds) {
            var size = bounds.getSize();
            this._ctx.beginPath();
            this._ctx.rect(bounds.min.x, bounds.min.y, size.x, size.y);
            this._ctx.clip();
          }
          this._drawing = true;
          for (var order = this._drawFirst; order; order = order.next) {
            layer = order.layer;
            if (!bounds || layer._pxBounds && layer._pxBounds.intersects(bounds)) {
              layer._updatePath();
            }
          }
          this._drawing = false;
          this._ctx.restore();
        }, "_draw"),
        _updatePoly: /* @__PURE__ */ __name(function(layer, closed) {
          if (!this._drawing) {
            return;
          }
          var i, j, len2, p, parts = layer._parts, len = parts.length, ctx = this._ctx;
          if (!len) {
            return;
          }
          ctx.beginPath();
          for (i = 0; i < len; i++) {
            for (j = 0, len2 = parts[i].length; j < len2; j++) {
              p = parts[i][j];
              ctx[j ? "lineTo" : "moveTo"](p.x, p.y);
            }
            if (closed) {
              ctx.closePath();
            }
          }
          this._fillStroke(ctx, layer);
        }, "_updatePoly"),
        _updateCircle: /* @__PURE__ */ __name(function(layer) {
          if (!this._drawing || layer._empty()) {
            return;
          }
          var p = layer._point, ctx = this._ctx, r = Math.max(Math.round(layer._radius), 1), s = (Math.max(Math.round(layer._radiusY), 1) || r) / r;
          if (s !== 1) {
            ctx.save();
            ctx.scale(1, s);
          }
          ctx.beginPath();
          ctx.arc(p.x, p.y / s, r, 0, Math.PI * 2, false);
          if (s !== 1) {
            ctx.restore();
          }
          this._fillStroke(ctx, layer);
        }, "_updateCircle"),
        _fillStroke: /* @__PURE__ */ __name(function(ctx, layer) {
          var options = layer.options;
          if (options.fill) {
            ctx.globalAlpha = options.fillOpacity;
            ctx.fillStyle = options.fillColor || options.color;
            ctx.fill(options.fillRule || "evenodd");
          }
          if (options.stroke && options.weight !== 0) {
            if (ctx.setLineDash) {
              ctx.setLineDash(layer.options && layer.options._dashArray || []);
            }
            ctx.globalAlpha = options.opacity;
            ctx.lineWidth = options.weight;
            ctx.strokeStyle = options.color;
            ctx.lineCap = options.lineCap;
            ctx.lineJoin = options.lineJoin;
            ctx.stroke();
          }
        }, "_fillStroke"),
        // Canvas obviously doesn't have mouse events for individual drawn objects,
        // so we emulate that by calculating what's under the mouse on mousemove/click manually
        _onClick: /* @__PURE__ */ __name(function(e) {
          var point = this._map.mouseEventToLayerPoint(e), layer, clickedLayer;
          for (var order = this._drawFirst; order; order = order.next) {
            layer = order.layer;
            if (layer.options.interactive && layer._containsPoint(point)) {
              if (!(e.type === "click" || e.type === "preclick") || !this._map._draggableMoved(layer)) {
                clickedLayer = layer;
              }
            }
          }
          this._fireEvent(clickedLayer ? [clickedLayer] : false, e);
        }, "_onClick"),
        _onMouseMove: /* @__PURE__ */ __name(function(e) {
          if (!this._map || this._map.dragging.moving() || this._map._animatingZoom) {
            return;
          }
          var point = this._map.mouseEventToLayerPoint(e);
          this._handleMouseHover(e, point);
        }, "_onMouseMove"),
        _handleMouseOut: /* @__PURE__ */ __name(function(e) {
          var layer = this._hoveredLayer;
          if (layer) {
            removeClass2(this._container, "leaflet-interactive");
            this._fireEvent([layer], e, "mouseout");
            this._hoveredLayer = null;
            this._mouseHoverThrottled = false;
          }
        }, "_handleMouseOut"),
        _handleMouseHover: /* @__PURE__ */ __name(function(e, point) {
          if (this._mouseHoverThrottled) {
            return;
          }
          var layer, candidateHoveredLayer;
          for (var order = this._drawFirst; order; order = order.next) {
            layer = order.layer;
            if (layer.options.interactive && layer._containsPoint(point)) {
              candidateHoveredLayer = layer;
            }
          }
          if (candidateHoveredLayer !== this._hoveredLayer) {
            this._handleMouseOut(e);
            if (candidateHoveredLayer) {
              addClass2(this._container, "leaflet-interactive");
              this._fireEvent([candidateHoveredLayer], e, "mouseover");
              this._hoveredLayer = candidateHoveredLayer;
            }
          }
          this._fireEvent(this._hoveredLayer ? [this._hoveredLayer] : false, e);
          this._mouseHoverThrottled = true;
          setTimeout(bind(function() {
            this._mouseHoverThrottled = false;
          }, this), 32);
        }, "_handleMouseHover"),
        _fireEvent: /* @__PURE__ */ __name(function(layers2, e, type2) {
          this._map._fireDOMEvent(e, type2 || e.type, layers2);
        }, "_fireEvent"),
        _bringToFront: /* @__PURE__ */ __name(function(layer) {
          var order = layer._order;
          if (!order) {
            return;
          }
          var next3 = order.next;
          var prev = order.prev;
          if (next3) {
            next3.prev = prev;
          } else {
            return;
          }
          if (prev) {
            prev.next = next3;
          } else if (next3) {
            this._drawFirst = next3;
          }
          order.prev = this._drawLast;
          this._drawLast.next = order;
          order.next = null;
          this._drawLast = order;
          this._requestRedraw(layer);
        }, "_bringToFront"),
        _bringToBack: /* @__PURE__ */ __name(function(layer) {
          var order = layer._order;
          if (!order) {
            return;
          }
          var next3 = order.next;
          var prev = order.prev;
          if (prev) {
            prev.next = next3;
          } else {
            return;
          }
          if (next3) {
            next3.prev = prev;
          } else if (prev) {
            this._drawLast = prev;
          }
          order.prev = null;
          order.next = this._drawFirst;
          this._drawFirst.prev = order;
          this._drawFirst = order;
          this._requestRedraw(layer);
        }, "_bringToBack")
      });
      function canvas(options) {
        return Browser.canvas ? new Canvas(options) : null;
      }
      __name(canvas, "canvas");
      var vmlCreate = (function() {
        try {
          document.namespaces.add("lvml", "urn:schemas-microsoft-com:vml");
          return function(name) {
            return document.createElement("<lvml:" + name + ' class="lvml">');
          };
        } catch (e) {
        }
        return function(name) {
          return document.createElement("<" + name + ' xmlns="urn:schemas-microsoft.com:vml" class="lvml">');
        };
      })();
      var vmlMixin = {
        _initContainer: /* @__PURE__ */ __name(function() {
          this._container = create$1("div", "leaflet-vml-container");
        }, "_initContainer"),
        _update: /* @__PURE__ */ __name(function() {
          if (this._map._animatingZoom) {
            return;
          }
          Renderer.prototype._update.call(this);
          this.fire("update");
        }, "_update"),
        _initPath: /* @__PURE__ */ __name(function(layer) {
          var container = layer._container = vmlCreate("shape");
          addClass2(container, "leaflet-vml-shape " + (this.options.className || ""));
          container.coordsize = "1 1";
          layer._path = vmlCreate("path");
          container.appendChild(layer._path);
          this._updateStyle(layer);
          this._layers[stamp(layer)] = layer;
        }, "_initPath"),
        _addPath: /* @__PURE__ */ __name(function(layer) {
          var container = layer._container;
          this._container.appendChild(container);
          if (layer.options.interactive) {
            layer.addInteractiveTarget(container);
          }
        }, "_addPath"),
        _removePath: /* @__PURE__ */ __name(function(layer) {
          var container = layer._container;
          remove2(container);
          layer.removeInteractiveTarget(container);
          delete this._layers[stamp(layer)];
        }, "_removePath"),
        _updateStyle: /* @__PURE__ */ __name(function(layer) {
          var stroke = layer._stroke, fill = layer._fill, options = layer.options, container = layer._container;
          container.stroked = !!options.stroke;
          container.filled = !!options.fill;
          if (options.stroke) {
            if (!stroke) {
              stroke = layer._stroke = vmlCreate("stroke");
            }
            container.appendChild(stroke);
            stroke.weight = options.weight + "px";
            stroke.color = options.color;
            stroke.opacity = options.opacity;
            if (options.dashArray) {
              stroke.dashStyle = isArray2(options.dashArray) ? options.dashArray.join(" ") : options.dashArray.replace(/( *, *)/g, " ");
            } else {
              stroke.dashStyle = "";
            }
            stroke.endcap = options.lineCap.replace("butt", "flat");
            stroke.joinstyle = options.lineJoin;
          } else if (stroke) {
            container.removeChild(stroke);
            layer._stroke = null;
          }
          if (options.fill) {
            if (!fill) {
              fill = layer._fill = vmlCreate("fill");
            }
            container.appendChild(fill);
            fill.color = options.fillColor || options.color;
            fill.opacity = options.fillOpacity;
          } else if (fill) {
            container.removeChild(fill);
            layer._fill = null;
          }
        }, "_updateStyle"),
        _updateCircle: /* @__PURE__ */ __name(function(layer) {
          var p = layer._point.round(), r = Math.round(layer._radius), r2 = Math.round(layer._radiusY || r);
          this._setPath(layer, layer._empty() ? "M0 0" : "AL " + p.x + "," + p.y + " " + r + "," + r2 + " 0," + 65535 * 360);
        }, "_updateCircle"),
        _setPath: /* @__PURE__ */ __name(function(layer, path) {
          layer._path.v = path;
        }, "_setPath"),
        _bringToFront: /* @__PURE__ */ __name(function(layer) {
          toFront(layer._container);
        }, "_bringToFront"),
        _bringToBack: /* @__PURE__ */ __name(function(layer) {
          toBack(layer._container);
        }, "_bringToBack")
      };
      var create2 = Browser.vml ? vmlCreate : svgCreate;
      var SVG = Renderer.extend({
        _initContainer: /* @__PURE__ */ __name(function() {
          this._container = create2("svg");
          this._container.setAttribute("pointer-events", "none");
          this._rootGroup = create2("g");
          this._container.appendChild(this._rootGroup);
        }, "_initContainer"),
        _destroyContainer: /* @__PURE__ */ __name(function() {
          remove2(this._container);
          off(this._container);
          delete this._container;
          delete this._rootGroup;
          delete this._svgSize;
        }, "_destroyContainer"),
        _update: /* @__PURE__ */ __name(function() {
          if (this._map._animatingZoom && this._bounds) {
            return;
          }
          Renderer.prototype._update.call(this);
          var b = this._bounds, size = b.getSize(), container = this._container;
          if (!this._svgSize || !this._svgSize.equals(size)) {
            this._svgSize = size;
            container.setAttribute("width", size.x);
            container.setAttribute("height", size.y);
          }
          setPosition(container, b.min);
          container.setAttribute("viewBox", [b.min.x, b.min.y, size.x, size.y].join(" "));
          this.fire("update");
        }, "_update"),
        // methods below are called by vector layers implementations
        _initPath: /* @__PURE__ */ __name(function(layer) {
          var path = layer._path = create2("path");
          if (layer.options.className) {
            addClass2(path, layer.options.className);
          }
          if (layer.options.interactive) {
            addClass2(path, "leaflet-interactive");
          }
          this._updateStyle(layer);
          this._layers[stamp(layer)] = layer;
        }, "_initPath"),
        _addPath: /* @__PURE__ */ __name(function(layer) {
          if (!this._rootGroup) {
            this._initContainer();
          }
          this._rootGroup.appendChild(layer._path);
          layer.addInteractiveTarget(layer._path);
        }, "_addPath"),
        _removePath: /* @__PURE__ */ __name(function(layer) {
          remove2(layer._path);
          layer.removeInteractiveTarget(layer._path);
          delete this._layers[stamp(layer)];
        }, "_removePath"),
        _updatePath: /* @__PURE__ */ __name(function(layer) {
          layer._project();
          layer._update();
        }, "_updatePath"),
        _updateStyle: /* @__PURE__ */ __name(function(layer) {
          var path = layer._path, options = layer.options;
          if (!path) {
            return;
          }
          if (options.stroke) {
            path.setAttribute("stroke", options.color);
            path.setAttribute("stroke-opacity", options.opacity);
            path.setAttribute("stroke-width", options.weight);
            path.setAttribute("stroke-linecap", options.lineCap);
            path.setAttribute("stroke-linejoin", options.lineJoin);
            if (options.dashArray) {
              path.setAttribute("stroke-dasharray", options.dashArray);
            } else {
              path.removeAttribute("stroke-dasharray");
            }
            if (options.dashOffset) {
              path.setAttribute("stroke-dashoffset", options.dashOffset);
            } else {
              path.removeAttribute("stroke-dashoffset");
            }
          } else {
            path.setAttribute("stroke", "none");
          }
          if (options.fill) {
            path.setAttribute("fill", options.fillColor || options.color);
            path.setAttribute("fill-opacity", options.fillOpacity);
            path.setAttribute("fill-rule", options.fillRule || "evenodd");
          } else {
            path.setAttribute("fill", "none");
          }
        }, "_updateStyle"),
        _updatePoly: /* @__PURE__ */ __name(function(layer, closed) {
          this._setPath(layer, pointsToPath(layer._parts, closed));
        }, "_updatePoly"),
        _updateCircle: /* @__PURE__ */ __name(function(layer) {
          var p = layer._point, r = Math.max(Math.round(layer._radius), 1), r2 = Math.max(Math.round(layer._radiusY), 1) || r, arc = "a" + r + "," + r2 + " 0 1,0 ";
          var d = layer._empty() ? "M0 0" : "M" + (p.x - r) + "," + p.y + arc + r * 2 + ",0 " + arc + -r * 2 + ",0 ";
          this._setPath(layer, d);
        }, "_updateCircle"),
        _setPath: /* @__PURE__ */ __name(function(layer, path) {
          layer._path.setAttribute("d", path);
        }, "_setPath"),
        // SVG does not have the concept of zIndex so we resort to changing the DOM order of elements
        _bringToFront: /* @__PURE__ */ __name(function(layer) {
          toFront(layer._path);
        }, "_bringToFront"),
        _bringToBack: /* @__PURE__ */ __name(function(layer) {
          toBack(layer._path);
        }, "_bringToBack")
      });
      if (Browser.vml) {
        SVG.include(vmlMixin);
      }
      function svg(options) {
        return Browser.svg || Browser.vml ? new SVG(options) : null;
      }
      __name(svg, "svg");
      Map2.include({
        // @namespace Map; @method getRenderer(layer: Path): Renderer
        // Returns the instance of `Renderer` that should be used to render the given
        // `Path`. It will ensure that the `renderer` options of the map and paths
        // are respected, and that the renderers do exist on the map.
        getRenderer: /* @__PURE__ */ __name(function(layer) {
          var renderer = layer.options.renderer || this._getPaneRenderer(layer.options.pane) || this.options.renderer || this._renderer;
          if (!renderer) {
            renderer = this._renderer = this._createRenderer();
          }
          if (!this.hasLayer(renderer)) {
            this.addLayer(renderer);
          }
          return renderer;
        }, "getRenderer"),
        _getPaneRenderer: /* @__PURE__ */ __name(function(name) {
          if (name === "overlayPane" || name === void 0) {
            return false;
          }
          var renderer = this._paneRenderers[name];
          if (renderer === void 0) {
            renderer = this._createRenderer({ pane: name });
            this._paneRenderers[name] = renderer;
          }
          return renderer;
        }, "_getPaneRenderer"),
        _createRenderer: /* @__PURE__ */ __name(function(options) {
          return this.options.preferCanvas && canvas(options) || svg(options);
        }, "_createRenderer")
      });
      var Rectangle = Polygon.extend({
        initialize: /* @__PURE__ */ __name(function(latLngBounds, options) {
          Polygon.prototype.initialize.call(this, this._boundsToLatLngs(latLngBounds), options);
        }, "initialize"),
        // @method setBounds(latLngBounds: LatLngBounds): this
        // Redraws the rectangle with the passed bounds.
        setBounds: /* @__PURE__ */ __name(function(latLngBounds) {
          return this.setLatLngs(this._boundsToLatLngs(latLngBounds));
        }, "setBounds"),
        _boundsToLatLngs: /* @__PURE__ */ __name(function(latLngBounds) {
          latLngBounds = toLatLngBounds(latLngBounds);
          return [
            latLngBounds.getSouthWest(),
            latLngBounds.getNorthWest(),
            latLngBounds.getNorthEast(),
            latLngBounds.getSouthEast()
          ];
        }, "_boundsToLatLngs")
      });
      function rectangle(latLngBounds, options) {
        return new Rectangle(latLngBounds, options);
      }
      __name(rectangle, "rectangle");
      SVG.create = create2;
      SVG.pointsToPath = pointsToPath;
      GeoJSON.geometryToLayer = geometryToLayer;
      GeoJSON.coordsToLatLng = coordsToLatLng;
      GeoJSON.coordsToLatLngs = coordsToLatLngs;
      GeoJSON.latLngToCoords = latLngToCoords;
      GeoJSON.latLngsToCoords = latLngsToCoords;
      GeoJSON.getFeature = getFeature;
      GeoJSON.asFeature = asFeature;
      Map2.mergeOptions({
        // @option boxZoom: Boolean = true
        // Whether the map can be zoomed to a rectangular area specified by
        // dragging the mouse while pressing the shift key.
        boxZoom: true
      });
      var BoxZoom = Handler.extend({
        initialize: /* @__PURE__ */ __name(function(map) {
          this._map = map;
          this._container = map._container;
          this._pane = map._panes.overlayPane;
          this._resetStateTimeout = 0;
          map.on("unload", this._destroy, this);
        }, "initialize"),
        addHooks: /* @__PURE__ */ __name(function() {
          on(this._container, "mousedown", this._onMouseDown, this);
        }, "addHooks"),
        removeHooks: /* @__PURE__ */ __name(function() {
          off(this._container, "mousedown", this._onMouseDown, this);
        }, "removeHooks"),
        moved: /* @__PURE__ */ __name(function() {
          return this._moved;
        }, "moved"),
        _destroy: /* @__PURE__ */ __name(function() {
          remove2(this._pane);
          delete this._pane;
        }, "_destroy"),
        _resetState: /* @__PURE__ */ __name(function() {
          this._resetStateTimeout = 0;
          this._moved = false;
        }, "_resetState"),
        _clearDeferredResetState: /* @__PURE__ */ __name(function() {
          if (this._resetStateTimeout !== 0) {
            clearTimeout(this._resetStateTimeout);
            this._resetStateTimeout = 0;
          }
        }, "_clearDeferredResetState"),
        _onMouseDown: /* @__PURE__ */ __name(function(e) {
          if (!e.shiftKey || e.which !== 1 && e.button !== 1) {
            return false;
          }
          this._clearDeferredResetState();
          this._resetState();
          disableTextSelection();
          disableImageDrag();
          this._startPoint = this._map.mouseEventToContainerPoint(e);
          on(document, {
            contextmenu: stop,
            mousemove: this._onMouseMove,
            mouseup: this._onMouseUp,
            keydown: this._onKeyDown
          }, this);
        }, "_onMouseDown"),
        _onMouseMove: /* @__PURE__ */ __name(function(e) {
          if (!this._moved) {
            this._moved = true;
            this._box = create$1("div", "leaflet-zoom-box", this._container);
            addClass2(this._container, "leaflet-crosshair");
            this._map.fire("boxzoomstart");
          }
          this._point = this._map.mouseEventToContainerPoint(e);
          var bounds = new Bounds(this._point, this._startPoint), size = bounds.getSize();
          setPosition(this._box, bounds.min);
          this._box.style.width = size.x + "px";
          this._box.style.height = size.y + "px";
        }, "_onMouseMove"),
        _finish: /* @__PURE__ */ __name(function() {
          if (this._moved) {
            remove2(this._box);
            removeClass2(this._container, "leaflet-crosshair");
          }
          enableTextSelection();
          enableImageDrag();
          off(document, {
            contextmenu: stop,
            mousemove: this._onMouseMove,
            mouseup: this._onMouseUp,
            keydown: this._onKeyDown
          }, this);
        }, "_finish"),
        _onMouseUp: /* @__PURE__ */ __name(function(e) {
          if (e.which !== 1 && e.button !== 1) {
            return;
          }
          this._finish();
          if (!this._moved) {
            return;
          }
          this._clearDeferredResetState();
          this._resetStateTimeout = setTimeout(bind(this._resetState, this), 0);
          var bounds = new LatLngBounds(
            this._map.containerPointToLatLng(this._startPoint),
            this._map.containerPointToLatLng(this._point)
          );
          this._map.fitBounds(bounds).fire("boxzoomend", { boxZoomBounds: bounds });
        }, "_onMouseUp"),
        _onKeyDown: /* @__PURE__ */ __name(function(e) {
          if (e.keyCode === 27) {
            this._finish();
            this._clearDeferredResetState();
            this._resetState();
          }
        }, "_onKeyDown")
      });
      Map2.addInitHook("addHandler", "boxZoom", BoxZoom);
      Map2.mergeOptions({
        // @option doubleClickZoom: Boolean|String = true
        // Whether the map can be zoomed in by double clicking on it and
        // zoomed out by double clicking while holding shift. If passed
        // `'center'`, double-click zoom will zoom to the center of the
        //  view regardless of where the mouse was.
        doubleClickZoom: true
      });
      var DoubleClickZoom = Handler.extend({
        addHooks: /* @__PURE__ */ __name(function() {
          this._map.on("dblclick", this._onDoubleClick, this);
        }, "addHooks"),
        removeHooks: /* @__PURE__ */ __name(function() {
          this._map.off("dblclick", this._onDoubleClick, this);
        }, "removeHooks"),
        _onDoubleClick: /* @__PURE__ */ __name(function(e) {
          var map = this._map, oldZoom = map.getZoom(), delta = map.options.zoomDelta, zoom2 = e.originalEvent.shiftKey ? oldZoom - delta : oldZoom + delta;
          if (map.options.doubleClickZoom === "center") {
            map.setZoom(zoom2);
          } else {
            map.setZoomAround(e.containerPoint, zoom2);
          }
        }, "_onDoubleClick")
      });
      Map2.addInitHook("addHandler", "doubleClickZoom", DoubleClickZoom);
      Map2.mergeOptions({
        // @option dragging: Boolean = true
        // Whether the map is draggable with mouse/touch or not.
        dragging: true,
        // @section Panning Inertia Options
        // @option inertia: Boolean = *
        // If enabled, panning of the map will have an inertia effect where
        // the map builds momentum while dragging and continues moving in
        // the same direction for some time. Feels especially nice on touch
        // devices. Enabled by default.
        inertia: true,
        // @option inertiaDeceleration: Number = 3000
        // The rate with which the inertial movement slows down, in pixels/second².
        inertiaDeceleration: 3400,
        // px/s^2
        // @option inertiaMaxSpeed: Number = Infinity
        // Max speed of the inertial movement, in pixels/second.
        inertiaMaxSpeed: Infinity,
        // px/s
        // @option easeLinearity: Number = 0.2
        easeLinearity: 0.2,
        // TODO refactor, move to CRS
        // @option worldCopyJump: Boolean = false
        // With this option enabled, the map tracks when you pan to another "copy"
        // of the world and seamlessly jumps to the original one so that all overlays
        // like markers and vector layers are still visible.
        worldCopyJump: false,
        // @option maxBoundsViscosity: Number = 0.0
        // If `maxBounds` is set, this option will control how solid the bounds
        // are when dragging the map around. The default value of `0.0` allows the
        // user to drag outside the bounds at normal speed, higher values will
        // slow down map dragging outside bounds, and `1.0` makes the bounds fully
        // solid, preventing the user from dragging outside the bounds.
        maxBoundsViscosity: 0
      });
      var Drag2 = Handler.extend({
        addHooks: /* @__PURE__ */ __name(function() {
          if (!this._draggable) {
            var map = this._map;
            this._draggable = new Draggable(map._mapPane, map._container);
            this._draggable.on({
              dragstart: this._onDragStart,
              drag: this._onDrag,
              dragend: this._onDragEnd
            }, this);
            this._draggable.on("predrag", this._onPreDragLimit, this);
            if (map.options.worldCopyJump) {
              this._draggable.on("predrag", this._onPreDragWrap, this);
              map.on("zoomend", this._onZoomEnd, this);
              map.whenReady(this._onZoomEnd, this);
            }
          }
          addClass2(this._map._container, "leaflet-grab leaflet-touch-drag");
          this._draggable.enable();
          this._positions = [];
          this._times = [];
        }, "addHooks"),
        removeHooks: /* @__PURE__ */ __name(function() {
          removeClass2(this._map._container, "leaflet-grab");
          removeClass2(this._map._container, "leaflet-touch-drag");
          this._draggable.disable();
        }, "removeHooks"),
        moved: /* @__PURE__ */ __name(function() {
          return this._draggable && this._draggable._moved;
        }, "moved"),
        moving: /* @__PURE__ */ __name(function() {
          return this._draggable && this._draggable._moving;
        }, "moving"),
        _onDragStart: /* @__PURE__ */ __name(function() {
          var map = this._map;
          map._stop();
          if (this._map.options.maxBounds && this._map.options.maxBoundsViscosity) {
            var bounds = toLatLngBounds(this._map.options.maxBounds);
            this._offsetLimit = toBounds(
              this._map.latLngToContainerPoint(bounds.getNorthWest()).multiplyBy(-1),
              this._map.latLngToContainerPoint(bounds.getSouthEast()).multiplyBy(-1).add(this._map.getSize())
            );
            this._viscosity = Math.min(1, Math.max(0, this._map.options.maxBoundsViscosity));
          } else {
            this._offsetLimit = null;
          }
          map.fire("movestart").fire("dragstart");
          if (map.options.inertia) {
            this._positions = [];
            this._times = [];
          }
        }, "_onDragStart"),
        _onDrag: /* @__PURE__ */ __name(function(e) {
          if (this._map.options.inertia) {
            var time = this._lastTime = +/* @__PURE__ */ new Date(), pos = this._lastPos = this._draggable._absPos || this._draggable._newPos;
            this._positions.push(pos);
            this._times.push(time);
            this._prunePositions(time);
          }
          this._map.fire("move", e).fire("drag", e);
        }, "_onDrag"),
        _prunePositions: /* @__PURE__ */ __name(function(time) {
          while (this._positions.length > 1 && time - this._times[0] > 50) {
            this._positions.shift();
            this._times.shift();
          }
        }, "_prunePositions"),
        _onZoomEnd: /* @__PURE__ */ __name(function() {
          var pxCenter = this._map.getSize().divideBy(2), pxWorldCenter = this._map.latLngToLayerPoint([0, 0]);
          this._initialWorldOffset = pxWorldCenter.subtract(pxCenter).x;
          this._worldWidth = this._map.getPixelWorldBounds().getSize().x;
        }, "_onZoomEnd"),
        _viscousLimit: /* @__PURE__ */ __name(function(value, threshold) {
          return value - (value - threshold) * this._viscosity;
        }, "_viscousLimit"),
        _onPreDragLimit: /* @__PURE__ */ __name(function() {
          if (!this._viscosity || !this._offsetLimit) {
            return;
          }
          var offset = this._draggable._newPos.subtract(this._draggable._startPos);
          var limit = this._offsetLimit;
          if (offset.x < limit.min.x) {
            offset.x = this._viscousLimit(offset.x, limit.min.x);
          }
          if (offset.y < limit.min.y) {
            offset.y = this._viscousLimit(offset.y, limit.min.y);
          }
          if (offset.x > limit.max.x) {
            offset.x = this._viscousLimit(offset.x, limit.max.x);
          }
          if (offset.y > limit.max.y) {
            offset.y = this._viscousLimit(offset.y, limit.max.y);
          }
          this._draggable._newPos = this._draggable._startPos.add(offset);
        }, "_onPreDragLimit"),
        _onPreDragWrap: /* @__PURE__ */ __name(function() {
          var worldWidth = this._worldWidth, halfWidth = Math.round(worldWidth / 2), dx = this._initialWorldOffset, x = this._draggable._newPos.x, newX1 = (x - halfWidth + dx) % worldWidth + halfWidth - dx, newX2 = (x + halfWidth + dx) % worldWidth - halfWidth - dx, newX = Math.abs(newX1 + dx) < Math.abs(newX2 + dx) ? newX1 : newX2;
          this._draggable._absPos = this._draggable._newPos.clone();
          this._draggable._newPos.x = newX;
        }, "_onPreDragWrap"),
        _onDragEnd: /* @__PURE__ */ __name(function(e) {
          var map = this._map, options = map.options, noInertia = !options.inertia || e.noInertia || this._times.length < 2;
          map.fire("dragend", e);
          if (noInertia) {
            map.fire("moveend");
          } else {
            this._prunePositions(+/* @__PURE__ */ new Date());
            var direction = this._lastPos.subtract(this._positions[0]), duration = (this._lastTime - this._times[0]) / 1e3, ease = options.easeLinearity, speedVector = direction.multiplyBy(ease / duration), speed = speedVector.distanceTo([0, 0]), limitedSpeed = Math.min(options.inertiaMaxSpeed, speed), limitedSpeedVector = speedVector.multiplyBy(limitedSpeed / speed), decelerationDuration = limitedSpeed / (options.inertiaDeceleration * ease), offset = limitedSpeedVector.multiplyBy(-decelerationDuration / 2).round();
            if (!offset.x && !offset.y) {
              map.fire("moveend");
            } else {
              offset = map._limitOffset(offset, map.options.maxBounds);
              requestAnimFrame(function() {
                map.panBy(offset, {
                  duration: decelerationDuration,
                  easeLinearity: ease,
                  noMoveStart: true,
                  animate: true
                });
              });
            }
          }
        }, "_onDragEnd")
      });
      Map2.addInitHook("addHandler", "dragging", Drag2);
      Map2.mergeOptions({
        // @option keyboard: Boolean = true
        // Makes the map focusable and allows users to navigate the map with keyboard
        // arrows and `+`/`-` keys.
        keyboard: true,
        // @option keyboardPanDelta: Number = 80
        // Amount of pixels to pan when pressing an arrow key.
        keyboardPanDelta: 80
      });
      var Keyboard2 = Handler.extend({
        keyCodes: {
          left: [37],
          right: [39],
          down: [40],
          up: [38],
          zoomIn: [187, 107, 61, 171],
          zoomOut: [189, 109, 54, 173]
        },
        initialize: /* @__PURE__ */ __name(function(map) {
          this._map = map;
          this._setPanDelta(map.options.keyboardPanDelta);
          this._setZoomDelta(map.options.zoomDelta);
        }, "initialize"),
        addHooks: /* @__PURE__ */ __name(function() {
          var container = this._map._container;
          if (container.tabIndex <= 0) {
            container.tabIndex = "0";
          }
          on(container, {
            focus: this._onFocus,
            blur: this._onBlur,
            mousedown: this._onMouseDown
          }, this);
          this._map.on({
            focus: this._addHooks,
            blur: this._removeHooks
          }, this);
        }, "addHooks"),
        removeHooks: /* @__PURE__ */ __name(function() {
          this._removeHooks();
          off(this._map._container, {
            focus: this._onFocus,
            blur: this._onBlur,
            mousedown: this._onMouseDown
          }, this);
          this._map.off({
            focus: this._addHooks,
            blur: this._removeHooks
          }, this);
        }, "removeHooks"),
        _onMouseDown: /* @__PURE__ */ __name(function() {
          if (this._focused) {
            return;
          }
          var body = document.body, docEl = document.documentElement, top = body.scrollTop || docEl.scrollTop, left = body.scrollLeft || docEl.scrollLeft;
          this._map._container.focus();
          window.scrollTo(left, top);
        }, "_onMouseDown"),
        _onFocus: /* @__PURE__ */ __name(function() {
          this._focused = true;
          this._map.fire("focus");
        }, "_onFocus"),
        _onBlur: /* @__PURE__ */ __name(function() {
          this._focused = false;
          this._map.fire("blur");
        }, "_onBlur"),
        _setPanDelta: /* @__PURE__ */ __name(function(panDelta) {
          var keys = this._panKeys = {}, codes = this.keyCodes, i, len;
          for (i = 0, len = codes.left.length; i < len; i++) {
            keys[codes.left[i]] = [-1 * panDelta, 0];
          }
          for (i = 0, len = codes.right.length; i < len; i++) {
            keys[codes.right[i]] = [panDelta, 0];
          }
          for (i = 0, len = codes.down.length; i < len; i++) {
            keys[codes.down[i]] = [0, panDelta];
          }
          for (i = 0, len = codes.up.length; i < len; i++) {
            keys[codes.up[i]] = [0, -1 * panDelta];
          }
        }, "_setPanDelta"),
        _setZoomDelta: /* @__PURE__ */ __name(function(zoomDelta) {
          var keys = this._zoomKeys = {}, codes = this.keyCodes, i, len;
          for (i = 0, len = codes.zoomIn.length; i < len; i++) {
            keys[codes.zoomIn[i]] = zoomDelta;
          }
          for (i = 0, len = codes.zoomOut.length; i < len; i++) {
            keys[codes.zoomOut[i]] = -zoomDelta;
          }
        }, "_setZoomDelta"),
        _addHooks: /* @__PURE__ */ __name(function() {
          on(document, "keydown", this._onKeyDown, this);
        }, "_addHooks"),
        _removeHooks: /* @__PURE__ */ __name(function() {
          off(document, "keydown", this._onKeyDown, this);
        }, "_removeHooks"),
        _onKeyDown: /* @__PURE__ */ __name(function(e) {
          if (e.altKey || e.ctrlKey || e.metaKey) {
            return;
          }
          var key = e.keyCode, map = this._map, offset;
          if (key in this._panKeys) {
            if (!map._panAnim || !map._panAnim._inProgress) {
              offset = this._panKeys[key];
              if (e.shiftKey) {
                offset = toPoint(offset).multiplyBy(3);
              }
              if (map.options.maxBounds) {
                offset = map._limitOffset(toPoint(offset), map.options.maxBounds);
              }
              if (map.options.worldCopyJump) {
                var newLatLng = map.wrapLatLng(map.unproject(map.project(map.getCenter()).add(offset)));
                map.panTo(newLatLng);
              } else {
                map.panBy(offset);
              }
            }
          } else if (key in this._zoomKeys) {
            map.setZoom(map.getZoom() + (e.shiftKey ? 3 : 1) * this._zoomKeys[key]);
          } else if (key === 27 && map._popup && map._popup.options.closeOnEscapeKey) {
            map.closePopup();
          } else {
            return;
          }
          stop(e);
        }, "_onKeyDown")
      });
      Map2.addInitHook("addHandler", "keyboard", Keyboard2);
      Map2.mergeOptions({
        // @section Mouse wheel options
        // @option scrollWheelZoom: Boolean|String = true
        // Whether the map can be zoomed by using the mouse wheel. If passed `'center'`,
        // it will zoom to the center of the view regardless of where the mouse was.
        scrollWheelZoom: true,
        // @option wheelDebounceTime: Number = 40
        // Limits the rate at which a wheel can fire (in milliseconds). By default
        // user can't zoom via wheel more often than once per 40 ms.
        wheelDebounceTime: 40,
        // @option wheelPxPerZoomLevel: Number = 60
        // How many scroll pixels (as reported by [L.DomEvent.getWheelDelta](#domevent-getwheeldelta))
        // mean a change of one full zoom level. Smaller values will make wheel-zooming
        // faster (and vice versa).
        wheelPxPerZoomLevel: 60
      });
      var ScrollWheelZoom = Handler.extend({
        addHooks: /* @__PURE__ */ __name(function() {
          on(this._map._container, "wheel", this._onWheelScroll, this);
          this._delta = 0;
        }, "addHooks"),
        removeHooks: /* @__PURE__ */ __name(function() {
          off(this._map._container, "wheel", this._onWheelScroll, this);
        }, "removeHooks"),
        _onWheelScroll: /* @__PURE__ */ __name(function(e) {
          var delta = getWheelDelta(e);
          var debounce2 = this._map.options.wheelDebounceTime;
          this._delta += delta;
          this._lastMousePos = this._map.mouseEventToContainerPoint(e);
          if (!this._startTime) {
            this._startTime = +/* @__PURE__ */ new Date();
          }
          var left = Math.max(debounce2 - (+/* @__PURE__ */ new Date() - this._startTime), 0);
          clearTimeout(this._timer);
          this._timer = setTimeout(bind(this._performZoom, this), left);
          stop(e);
        }, "_onWheelScroll"),
        _performZoom: /* @__PURE__ */ __name(function() {
          var map = this._map, zoom2 = map.getZoom(), snap = this._map.options.zoomSnap || 0;
          map._stop();
          var d2 = this._delta / (this._map.options.wheelPxPerZoomLevel * 4), d3 = 4 * Math.log(2 / (1 + Math.exp(-Math.abs(d2)))) / Math.LN2, d4 = snap ? Math.ceil(d3 / snap) * snap : d3, delta = map._limitZoom(zoom2 + (this._delta > 0 ? d4 : -d4)) - zoom2;
          this._delta = 0;
          this._startTime = null;
          if (!delta) {
            return;
          }
          if (map.options.scrollWheelZoom === "center") {
            map.setZoom(zoom2 + delta);
          } else {
            map.setZoomAround(this._lastMousePos, zoom2 + delta);
          }
        }, "_performZoom")
      });
      Map2.addInitHook("addHandler", "scrollWheelZoom", ScrollWheelZoom);
      var tapHoldDelay = 600;
      Map2.mergeOptions({
        // @section Touch interaction options
        // @option tapHold: Boolean
        // Enables simulation of `contextmenu` event, default is `true` for mobile Safari.
        tapHold: Browser.touchNative && Browser.safari && Browser.mobile,
        // @option tapTolerance: Number = 15
        // The max number of pixels a user can shift his finger during touch
        // for it to be considered a valid tap.
        tapTolerance: 15
      });
      var TapHold = Handler.extend({
        addHooks: /* @__PURE__ */ __name(function() {
          on(this._map._container, "touchstart", this._onDown, this);
        }, "addHooks"),
        removeHooks: /* @__PURE__ */ __name(function() {
          off(this._map._container, "touchstart", this._onDown, this);
        }, "removeHooks"),
        _onDown: /* @__PURE__ */ __name(function(e) {
          clearTimeout(this._holdTimeout);
          if (e.touches.length !== 1) {
            return;
          }
          var first = e.touches[0];
          this._startPos = this._newPos = new Point(first.clientX, first.clientY);
          this._holdTimeout = setTimeout(bind(function() {
            this._cancel();
            if (!this._isTapValid()) {
              return;
            }
            on(document, "touchend", preventDefault);
            on(document, "touchend touchcancel", this._cancelClickPrevent);
            this._simulateEvent("contextmenu", first);
          }, this), tapHoldDelay);
          on(document, "touchend touchcancel contextmenu", this._cancel, this);
          on(document, "touchmove", this._onMove, this);
        }, "_onDown"),
        _cancelClickPrevent: /* @__PURE__ */ __name(function cancelClickPrevent() {
          off(document, "touchend", preventDefault);
          off(document, "touchend touchcancel", cancelClickPrevent);
        }, "cancelClickPrevent"),
        _cancel: /* @__PURE__ */ __name(function() {
          clearTimeout(this._holdTimeout);
          off(document, "touchend touchcancel contextmenu", this._cancel, this);
          off(document, "touchmove", this._onMove, this);
        }, "_cancel"),
        _onMove: /* @__PURE__ */ __name(function(e) {
          var first = e.touches[0];
          this._newPos = new Point(first.clientX, first.clientY);
        }, "_onMove"),
        _isTapValid: /* @__PURE__ */ __name(function() {
          return this._newPos.distanceTo(this._startPos) <= this._map.options.tapTolerance;
        }, "_isTapValid"),
        _simulateEvent: /* @__PURE__ */ __name(function(type2, e) {
          var simulatedEvent = new MouseEvent(type2, {
            bubbles: true,
            cancelable: true,
            view: window,
            // detail: 1,
            screenX: e.screenX,
            screenY: e.screenY,
            clientX: e.clientX,
            clientY: e.clientY
            // button: 2,
            // buttons: 2
          });
          simulatedEvent._simulated = true;
          e.target.dispatchEvent(simulatedEvent);
        }, "_simulateEvent")
      });
      Map2.addInitHook("addHandler", "tapHold", TapHold);
      Map2.mergeOptions({
        // @section Touch interaction options
        // @option touchZoom: Boolean|String = *
        // Whether the map can be zoomed by touch-dragging with two fingers. If
        // passed `'center'`, it will zoom to the center of the view regardless of
        // where the touch events (fingers) were. Enabled for touch-capable web
        // browsers.
        touchZoom: Browser.touch,
        // @option bounceAtZoomLimits: Boolean = true
        // Set it to false if you don't want the map to zoom beyond min/max zoom
        // and then bounce back when pinch-zooming.
        bounceAtZoomLimits: true
      });
      var TouchZoom = Handler.extend({
        addHooks: /* @__PURE__ */ __name(function() {
          addClass2(this._map._container, "leaflet-touch-zoom");
          on(this._map._container, "touchstart", this._onTouchStart, this);
        }, "addHooks"),
        removeHooks: /* @__PURE__ */ __name(function() {
          removeClass2(this._map._container, "leaflet-touch-zoom");
          off(this._map._container, "touchstart", this._onTouchStart, this);
        }, "removeHooks"),
        _onTouchStart: /* @__PURE__ */ __name(function(e) {
          var map = this._map;
          if (!e.touches || e.touches.length !== 2 || map._animatingZoom || this._zooming) {
            return;
          }
          var p1 = map.mouseEventToContainerPoint(e.touches[0]), p2 = map.mouseEventToContainerPoint(e.touches[1]);
          this._centerPoint = map.getSize()._divideBy(2);
          this._startLatLng = map.containerPointToLatLng(this._centerPoint);
          if (map.options.touchZoom !== "center") {
            this._pinchStartLatLng = map.containerPointToLatLng(p1.add(p2)._divideBy(2));
          }
          this._startDist = p1.distanceTo(p2);
          this._startZoom = map.getZoom();
          this._moved = false;
          this._zooming = true;
          map._stop();
          on(document, "touchmove", this._onTouchMove, this);
          on(document, "touchend touchcancel", this._onTouchEnd, this);
          preventDefault(e);
        }, "_onTouchStart"),
        _onTouchMove: /* @__PURE__ */ __name(function(e) {
          if (!e.touches || e.touches.length !== 2 || !this._zooming) {
            return;
          }
          var map = this._map, p1 = map.mouseEventToContainerPoint(e.touches[0]), p2 = map.mouseEventToContainerPoint(e.touches[1]), scale2 = p1.distanceTo(p2) / this._startDist;
          this._zoom = map.getScaleZoom(scale2, this._startZoom);
          if (!map.options.bounceAtZoomLimits && (this._zoom < map.getMinZoom() && scale2 < 1 || this._zoom > map.getMaxZoom() && scale2 > 1)) {
            this._zoom = map._limitZoom(this._zoom);
          }
          if (map.options.touchZoom === "center") {
            this._center = this._startLatLng;
            if (scale2 === 1) {
              return;
            }
          } else {
            var delta = p1._add(p2)._divideBy(2)._subtract(this._centerPoint);
            if (scale2 === 1 && delta.x === 0 && delta.y === 0) {
              return;
            }
            this._center = map.unproject(map.project(this._pinchStartLatLng, this._zoom).subtract(delta), this._zoom);
          }
          if (!this._moved) {
            map._moveStart(true, false);
            this._moved = true;
          }
          cancelAnimFrame(this._animRequest);
          var moveFn = bind(map._move, map, this._center, this._zoom, { pinch: true, round: false }, void 0);
          this._animRequest = requestAnimFrame(moveFn, this, true);
          preventDefault(e);
        }, "_onTouchMove"),
        _onTouchEnd: /* @__PURE__ */ __name(function() {
          if (!this._moved || !this._zooming) {
            this._zooming = false;
            return;
          }
          this._zooming = false;
          cancelAnimFrame(this._animRequest);
          off(document, "touchmove", this._onTouchMove, this);
          off(document, "touchend touchcancel", this._onTouchEnd, this);
          if (this._map.options.zoomAnimation) {
            this._map._animateZoom(this._center, this._map._limitZoom(this._zoom), true, this._map.options.zoomSnap);
          } else {
            this._map._resetView(this._center, this._map._limitZoom(this._zoom));
          }
        }, "_onTouchEnd")
      });
      Map2.addInitHook("addHandler", "touchZoom", TouchZoom);
      Map2.BoxZoom = BoxZoom;
      Map2.DoubleClickZoom = DoubleClickZoom;
      Map2.Drag = Drag2;
      Map2.Keyboard = Keyboard2;
      Map2.ScrollWheelZoom = ScrollWheelZoom;
      Map2.TapHold = TapHold;
      Map2.TouchZoom = TouchZoom;
      exports$12.Bounds = Bounds;
      exports$12.Browser = Browser;
      exports$12.CRS = CRS;
      exports$12.Canvas = Canvas;
      exports$12.Circle = Circle;
      exports$12.CircleMarker = CircleMarker;
      exports$12.Class = Class;
      exports$12.Control = Control;
      exports$12.DivIcon = DivIcon;
      exports$12.DivOverlay = DivOverlay;
      exports$12.DomEvent = DomEvent;
      exports$12.DomUtil = DomUtil;
      exports$12.Draggable = Draggable;
      exports$12.Evented = Evented;
      exports$12.FeatureGroup = FeatureGroup;
      exports$12.GeoJSON = GeoJSON;
      exports$12.GridLayer = GridLayer;
      exports$12.Handler = Handler;
      exports$12.Icon = Icon;
      exports$12.ImageOverlay = ImageOverlay;
      exports$12.LatLng = LatLng;
      exports$12.LatLngBounds = LatLngBounds;
      exports$12.Layer = Layer;
      exports$12.LayerGroup = LayerGroup;
      exports$12.LineUtil = LineUtil;
      exports$12.Map = Map2;
      exports$12.Marker = Marker;
      exports$12.Mixin = Mixin;
      exports$12.Path = Path;
      exports$12.Point = Point;
      exports$12.PolyUtil = PolyUtil;
      exports$12.Polygon = Polygon;
      exports$12.Polyline = Polyline;
      exports$12.Popup = Popup;
      exports$12.PosAnimation = PosAnimation;
      exports$12.Projection = index;
      exports$12.Rectangle = Rectangle;
      exports$12.Renderer = Renderer;
      exports$12.SVG = SVG;
      exports$12.SVGOverlay = SVGOverlay;
      exports$12.TileLayer = TileLayer;
      exports$12.Tooltip = Tooltip2;
      exports$12.Transformation = Transformation;
      exports$12.Util = Util;
      exports$12.VideoOverlay = VideoOverlay;
      exports$12.bind = bind;
      exports$12.bounds = toBounds;
      exports$12.canvas = canvas;
      exports$12.circle = circle;
      exports$12.circleMarker = circleMarker;
      exports$12.control = control;
      exports$12.divIcon = divIcon;
      exports$12.extend = extend;
      exports$12.featureGroup = featureGroup;
      exports$12.geoJSON = geoJSON;
      exports$12.geoJson = geoJson;
      exports$12.gridLayer = gridLayer;
      exports$12.icon = icon;
      exports$12.imageOverlay = imageOverlay;
      exports$12.latLng = toLatLng;
      exports$12.latLngBounds = toLatLngBounds;
      exports$12.layerGroup = layerGroup;
      exports$12.map = createMap;
      exports$12.marker = marker;
      exports$12.point = toPoint;
      exports$12.polygon = polygon;
      exports$12.polyline = polyline;
      exports$12.popup = popup;
      exports$12.rectangle = rectangle;
      exports$12.setOptions = setOptions;
      exports$12.stamp = stamp;
      exports$12.svg = svg;
      exports$12.svgOverlay = svgOverlay;
      exports$12.tileLayer = tileLayer;
      exports$12.tooltip = tooltip;
      exports$12.transformation = toTransformation;
      exports$12.version = version;
      exports$12.videoOverlay = videoOverlay;
      var oldL = window.L;
      exports$12.noConflict = function() {
        window.L = oldL;
        return this;
      };
      window.L = exports$12;
    }));
  })(leafletSrc$1, leafletSrc$1.exports);
  return leafletSrc$1.exports;
}
__name(requireLeafletSrc, "requireLeafletSrc");
var leafletSrcExports = requireLeafletSrc();
const L$1 = /* @__PURE__ */ getDefaultExportFromCjs(leafletSrcExports);
const _InitializeOsm = class _InitializeOsm {
  constructor(container) {
    this.container = container;
  }
  create() {
    const id = this.container.getAttribute("data-js-map-id") ?? "";
    const map = L$1.map(`openstreetmap__map-${id}`, {
      scrollWheelZoom: false,
      keyboard: false,
      attributionControl: false
    });
    const markers = [];
    return [map, markers];
  }
};
__name(_InitializeOsm, "InitializeOsm");
let InitializeOsm = _InitializeOsm;
function getElementJSONLocation(el) {
  const locationAttr = el.getAttribute("data-js-map-location") || el.getAttribute("data-js-map-pin-data");
  if (!locationAttr) return false;
  let locations = JSON.parse(locationAttr);
  if (!Array.isArray(locations)) {
    locations = [locations];
  }
  return locations;
}
__name(getElementJSONLocation, "getElementJSONLocation");
function getMarkerDataFromElement(el) {
  const json = getElementJSONLocation(el);
  const defaultValue = [{ lat: void 0, lng: void 0 }];
  if (!json) {
    return defaultValue;
  }
  let locationsArray = [];
  json.forEach((location) => {
    if (location !== null && typeof location === "object" && "lat" in location && "lng" in location) {
      const lat = location.lat;
      const lng = location.lng;
      const tooltip = location.tooltip ?? false;
      const url2 = location.url ?? false;
      const icon = location.icon ?? false;
      const id = location.id ?? "";
      locationsArray.push({ lat, lng, tooltip, url: url2, element: el, icon, id });
    }
  });
  return locationsArray.length > 0 ? locationsArray : defaultValue;
}
__name(getMarkerDataFromElement, "getMarkerDataFromElement");
const _AddMarkersFromLocations = class _AddMarkersFromLocations {
  constructor(container, map, markers = [], postMarkerPairs, createMarker, createTooltip) {
    this.container = container;
    this.map = map;
    this.markers = markers;
    this.postMarkerPairs = postMarkerPairs;
    this.createMarker = createMarker;
    this.createTooltip = createTooltip;
    this.add(getMarkerDataFromElement(this.container));
  }
  add(locations) {
    locations.forEach((location) => {
      if (location?.lat && location?.lng) {
        let customIcon = location?.icon ? location.icon : void 0;
        let marker = L$1.marker([location.lat, location.lng], {
          icon: this.createMarker.create(customIcon)
        });
        if (location.tooltip) {
          marker.bindPopup(this.createTooltip.create(location.tooltip, location.id ?? null), { maxWidth: 200 });
        }
        marker.on("click", (e) => {
          let latlng = e.latlng || e.sourceTarget?._latlng || false;
          let zoomLevel = this.map?.getZoom() ?? 16;
          if (latlng) {
            this.map?.setView(latlng, zoomLevel >= 16 ? zoomLevel : 16);
          }
        });
        marker.addTo(this.map);
        this.markers.push(marker);
        this.addMarkerPostPair(marker, location?.element, location?.id);
      }
    });
  }
  addMarkerPostPair(marker, post, id) {
    if (marker && post) {
      this.postMarkerPairs.set({ post, marker, id });
    }
  }
};
__name(_AddMarkersFromLocations, "AddMarkersFromLocations");
let AddMarkersFromLocations = _AddMarkersFromLocations;
const _ObserveSize = class _ObserveSize {
  constructor(container, baseClass) {
    this.container = container;
    this.baseClass = baseClass;
  }
  observeSizeClasses() {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === "attributes" && mutation.attributeName === "class" && mutation.oldValue !== this.container.className && !this.container.classList.contains("is-expanded") && !this.container.classList.contains(`${this.baseClass}--size-sm`)) {
          const previousClasses = mutation.oldValue?.split(" ");
          const currentClasses = this.container.className.split(" ");
          const removedClasses = previousClasses?.filter((className) => !currentClasses.includes(className));
          if (removedClasses && removedClasses.includes(`${this.baseClass}--size-sm`)) {
            this.expandBasedOnClasses();
          }
        }
      });
    });
    const config = {
      attributes: true,
      attributeFilter: ["class"],
      attributeOldValue: true,
      subtree: false
    };
    observer.observe(this.container, config);
  }
  expandBasedOnClasses() {
    if (!this.container.classList.contains(`${this.baseClass}--size-sm`)) {
      this.container.classList.add("is-expanded");
    }
  }
};
__name(_ObserveSize, "ObserveSize");
let ObserveSize = _ObserveSize;
function invalidateSize(map) {
  setTimeout(() => {
    map.invalidateSize();
  }, 200);
}
__name(invalidateSize, "invalidateSize");
function setView(map, location) {
  if (location.lat && location.lng && location.zoom) {
    map.setView([location.lat, location.lng], location.zoom);
  }
}
__name(setView, "setView");
const _ExpandOnClick = class _ExpandOnClick {
  constructor(container, map, baseClass) {
    this.container = container;
    this.map = map;
    this.baseClass = baseClass;
    const expandButtonDesktop = this.container.querySelector(`.${this.baseClass}__expand-icon-desktop`);
    const expandButtonMobile = this.container.querySelector(`.${this.baseClass}__expand-icon-mobile`);
    if (expandButtonDesktop && expandButtonMobile) {
      this.setupExpandClick(expandButtonDesktop, expandButtonMobile);
    }
  }
  setupExpandClick(expandButtonDesktop, expandButtonMobile) {
    [expandButtonDesktop, expandButtonMobile].forEach((element) => {
      element.addEventListener("click", () => {
        this.container.classList.toggle("is-expanded");
        invalidateSize(this.map);
      });
    });
  }
};
__name(_ExpandOnClick, "ExpandOnClick");
let ExpandOnClick = _ExpandOnClick;
const _FetchEndpointPosts = class _FetchEndpointPosts {
  constructor(container, endpoint, postsPerPage = 20) {
    this.container = container;
    this.endpoint = endpoint;
    this.postsPerPage = postsPerPage;
    this.fetchPosts();
  }
  // Fetch loop
  fetchPosts() {
    let page = 1;
    const fetchNextPage = /* @__PURE__ */ __name(() => {
      let url2 = this.endpoint + `&page=${page}&postsPerPage=${this.postsPerPage}&html`;
      this.fetchingPostsEvent();
      this.fetchEndpointPosts(url2).then((data) => {
        if (data && data.length > 0) {
          this.postsFetchedEvent(data);
          page++;
          fetchNextPage();
        } else {
          this.doneFetchingPostsEvent(page);
        }
      });
    }, "fetchNextPage");
    fetchNextPage();
  }
  // Fetch
  fetchEndpointPosts(url2) {
    return fetch(url2).then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    }).catch((error) => {
    });
  }
  // Dispatched when posts have been fetched.
  postsFetchedEvent(posts) {
    this.container.dispatchEvent(new CustomEvent("postsFetched", { detail: posts }));
  }
  // Dispatched when fetching posts.
  fetchingPostsEvent() {
    this.container.dispatchEvent(new CustomEvent("fetchingPosts"));
  }
  // Dispatched when there are no more posts to get. Providing the page number.
  doneFetchingPostsEvent(page) {
    this.container.dispatchEvent(new CustomEvent("doneFetchingPostsEvent", { detail: page }));
  }
};
__name(_FetchEndpointPosts, "FetchEndpointPosts");
let FetchEndpointPosts = _FetchEndpointPosts;
const _AddEndpointPosts = class _AddEndpointPosts {
  constructor(container, map) {
    this.container = container;
    this.postsContainer = this.container.querySelector("[data-js-osm-endpoint-posts]");
    if (this.postsContainer) {
      this.listenForPostsFetched();
    }
  }
  postsContainer = null;
  listenForPostsFetched() {
    this.container.addEventListener("postsFetched", (e) => {
      const customEvent = e;
      if (customEvent.detail && customEvent.detail.length > 0) {
        customEvent.detail.forEach((elementString) => {
          if (elementString.includes('data-js-map-location=""')) return;
          this.addPostsToDOM(elementString);
        });
      }
    });
  }
  addPostsToDOM(elementString) {
    let post = document.createElement("div");
    post.classList.add("c-openstreetmap__posts");
    post.innerHTML = elementString;
    post = post.firstChild;
    this.postsContainer.appendChild(post);
    this.dispatchPostAddedEvent(post);
  }
  dispatchPostAddedEvent(post) {
    this.container.dispatchEvent(new CustomEvent("postAdded", { detail: post }));
  }
};
__name(_AddEndpointPosts, "AddEndpointPosts");
let AddEndpointPosts = _AddEndpointPosts;
function getTiles(container) {
  const tiles = container.hasAttribute("data-js-map-style") ? container.getAttribute("data-js-map-style") : "default";
  switch (tiles) {
    case "dark":
      return {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      };
    case "pale":
      return {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        url: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
      };
    case "default":
      return {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        url: "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
      };
    case "color":
      return {
        attribution: "Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, NPS, NRCAN, GeoBase, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community",
        url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}"
      };
    default:
      return {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        url: "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
      };
  }
}
__name(getTiles, "getTiles");
const _SetMapTiles = class _SetMapTiles {
  constructor(container, map) {
    this.container = container;
    this.map = map;
    this.set();
  }
  set() {
    const tiles = getTiles(this.container);
    L$1.tileLayer(tiles?.url ? tiles.url : "https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19
    }).addTo(this.map);
    L$1.control.attribution({
      position: "topleft"
    }).setPrefix(false).addAttribution(tiles?.attribution ? tiles.attribution : '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>').addTo(this.map);
  }
};
__name(_SetMapTiles, "SetMapTiles");
let SetMapTiles = _SetMapTiles;
function mapKeyboard(container, map, markers, zoomMarker) {
  let currentMarker = 0;
  const attributions = container.querySelector(".leaflet-control-attribution");
  attributions?.querySelectorAll("a")?.forEach((attribution) => {
    attribution.setAttribute("tabindex", "-1");
  });
  map.addEventListener("keydown", (e) => {
    const event2 = e.originalEvent;
    switch (event2.key) {
      case "ArrowDown":
      case "ArrowLeft":
        event2.preventDefault();
        currentMarker = (currentMarker - 1 + markers.length) % markers.length;
        zoomMarker.zoom(markers[currentMarker]);
        break;
      case "ArrowUp":
      case "ArrowRight":
        event2.preventDefault();
        currentMarker = (currentMarker + 1) % markers.length;
        zoomMarker.zoom(markers[currentMarker]);
        break;
      case "+":
        map.zoomIn();
        break;
      case "-":
        map.zoomOut();
        break;
    }
  });
}
__name(mapKeyboard, "mapKeyboard");
function removeClusterGroupTabIndex(container) {
  const observe = /* @__PURE__ */ __name(() => {
    const mapContainer = container.querySelector(".c-openstreetmap__map");
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === "childList") {
          mutation.addedNodes.forEach((addedNode) => {
            if (addedNode instanceof HTMLElement && (addedNode.classList?.contains("c-openstreetmap__icon") || addedNode.classList?.contains("marker-cluster"))) {
              addedNode.setAttribute("tabindex", "-1");
            }
          });
        }
      });
    });
    if (!mapContainer) return;
    observer.observe(mapContainer, { childList: true, subtree: true });
  }, "observe");
  observe();
}
__name(removeClusterGroupTabIndex, "removeClusterGroupTabIndex");
function postKeyboard(container, baseClass) {
  let focusableElements = {};
  const sidebar = container.querySelector(`.${baseClass}__sidebar`);
  if (!sidebar) return;
  document.addEventListener("keydown", (e) => {
    const keyboardEvent = e;
    const openPost = sidebar.querySelector(`.${baseClass}__post-full.is-open`);
    const backButton = openPost?.querySelector(`.${baseClass}__button-back`);
    switch (keyboardEvent.key) {
      case "Escape":
        e.preventDefault();
        backButton?.click();
        document.body.classList.remove("u-overflow--hidden");
        break;
      case "Tab":
        if (openPost && openPost.hasAttribute("data-js-osm-full-post")) {
          const openPostId = openPost.getAttribute("data-js-osm-full-post");
          if (!openPostId) break;
          if (!focusableElements[openPostId]) {
            focusableElements[openPostId] = getFocusableElements(openPost);
          }
          const openPostFocusableElements = focusableElements[openPostId];
          const currentIndex = openPostFocusableElements.indexOf(document.activeElement);
          keyboardEvent.preventDefault();
          let nextIndex;
          if (keyboardEvent.shiftKey) {
            nextIndex = currentIndex === 0 ? openPostFocusableElements.length - 1 : currentIndex - 1;
          } else {
            nextIndex = currentIndex === openPostFocusableElements.length - 1 ? 0 : currentIndex + 1;
          }
          openPostFocusableElements[nextIndex].focus();
        }
        break;
    }
  });
  sidebar.addEventListener("keydown", (e) => {
    const keyboardEvent = e;
    switch (keyboardEvent.key) {
      case " ":
      case "Enter":
        e.preventDefault();
        const targetElement = e.target;
        if (targetElement?.classList.contains(`${baseClass}__collection__item`)) {
          targetElement.click();
          break;
        }
        if (targetElement.classList.contains(`${baseClass}__button-back`)) {
          targetElement.click();
          break;
        }
    }
  });
}
__name(postKeyboard, "postKeyboard");
function getFocusableElements(container) {
  return Array.from(container.querySelectorAll(
    'a[href], button, textarea, input, select, details,[tabindex]:not([tabindex="-1"])'
  ));
}
__name(getFocusableElements, "getFocusableElements");
const _AccessibilityFeatures = class _AccessibilityFeatures {
  constructor(container, map, markers, zoomMarker, baseClass) {
    mapKeyboard(container, map, markers, zoomMarker);
    postKeyboard(container, baseClass);
    removeClusterGroupTabIndex(container);
  }
};
__name(_AccessibilityFeatures, "AccessibilityFeatures");
let AccessibilityFeatures = _AccessibilityFeatures;
const _ZoomMarker = class _ZoomMarker {
  constructor(map, markers) {
    this.map = map;
    this.markers = markers;
  }
  zoom(marker) {
    this.map.flyTo(marker.getLatLng(), 16, {
      animate: true,
      duration: 1
    });
    setTimeout(function() {
      marker.openPopup();
    }, 1200);
  }
};
__name(_ZoomMarker, "ZoomMarker");
let ZoomMarker = _ZoomMarker;
const _PostAdded = class _PostAdded {
  constructor(container, addMarkersFromLocationInstance) {
    this.container = container;
    this.addMarkersFromLocationInstance = addMarkersFromLocationInstance;
    this.listenForPostAdded();
  }
  listenForPostAdded() {
    this.container.addEventListener("postAdded", (e) => {
      const customEvent = e;
      const locationElement = customEvent.detail.querySelector("[data-js-map-location]");
      if (locationElement) {
        const markerData = getMarkerDataFromElement(locationElement);
        this.addMarkersFromLocationInstance.add(markerData);
      }
    });
  }
};
__name(_PostAdded, "PostAdded");
let PostAdded = _PostAdded;
const _PostMarkerPairs = class _PostMarkerPairs {
  constructor(container) {
    this.container = container;
    this.postMarkerPairs = [];
  }
  postMarkerPairs;
  set(postMarkerPair) {
    this.postMarkerPairs.push(postMarkerPair);
    this.dispatchPostMarkerPairAdded(postMarkerPair);
  }
  get() {
    return this.postMarkerPairs;
  }
  dispatchPostMarkerPairAdded(postMarkerPair) {
    this.container.dispatchEvent(new CustomEvent("postMarkerPairAdded", { detail: postMarkerPair }));
  }
};
__name(_PostMarkerPairs, "PostMarkerPairs");
let PostMarkerPairs = _PostMarkerPairs;
const _CreateMarker = class _CreateMarker {
  constructor(container) {
    this.container = container;
  }
  create(customIcon) {
    let template = this.container?.querySelector(".c-openstreetmap__pin-icon");
    let html = template?.innerHTML;
    let icon = customIcon?.icon ? customIcon.icon : "location_on";
    let color = customIcon?.backgroundColor ? customIcon.backgroundColor : this.getPrimaryColor();
    if (!html) return;
    html = html.replace("{icon-name}", icon).replaceAll("{ICON_NAME}", icon).replace("{ICON_BACKGROUND_COLOR}", color);
    let marker = L$1.divIcon({
      className: "c-openstreetmap__icon",
      html
    });
    return marker;
  }
  getPrimaryColor() {
    let color = getComputedStyle(document.documentElement).getPropertyValue("--color-primary");
    return color ? color : "#ae0b05";
  }
};
__name(_CreateMarker, "CreateMarker");
let CreateMarker = _CreateMarker;
const _CreateTooltip = class _CreateTooltip {
  constructor(container) {
    this.container = container;
  }
  create(tooltip, id = null) {
    let template = this.container?.querySelector(".c-openstreetmap__pin-tooltip");
    let clone = template?.cloneNode(true);
    if (!tooltip.image?.src) {
      const figure = clone.content.querySelector("figure");
      if (figure) {
        figure.remove();
      }
    }
    let html = clone.innerHTML;
    html = html.replace("{TOOLTIP_HEADING}", tooltip.title ? tooltip.title : "").replace("{TOOLTIP_DIRECTIONS_URL}", tooltip.directions?.url ? tooltip.directions.url : "").replace("{TOOLTIP_DIRECTIONS_LABEL}", tooltip.directions?.label ? tooltip.directions.label : "").replace("{TOOLTIP_EXCERPT}", tooltip.excerpt ? tooltip.excerpt : "").replace("{TOOLTIP_IMAGE_SRC}", tooltip.image?.src ? tooltip.image.src : "").replace("{TOOLTIP_IMAGE_ALT}", tooltip.image?.alt ? tooltip.image.alt : "").replace("{TOOLTIP_ID}", id ? id : "");
    return html;
  }
};
__name(_CreateTooltip, "CreateTooltip");
let CreateTooltip = _CreateTooltip;
const _ShowIfNotEmpty = class _ShowIfNotEmpty {
  constructor(container, baseClass) {
    this.container = container;
    this.baseClass = baseClass;
    const sidebar = this.container.querySelector(`.${this.baseClass}__sidebar`);
    if (sidebar) {
      this.checkForInnerBlocks(sidebar);
      this.listenForEndpointPosts(sidebar);
    }
  }
  checkForInnerBlocks(sidebar) {
    const innerBlocks = sidebar.querySelector(`.${this.baseClass}__inner-blocks`);
    if (innerBlocks && !innerBlocks.querySelector("innerblocks")) {
      this.removeDisplayNoneUtility(sidebar);
    }
  }
  listenForEndpointPosts(sidebar) {
    this.container.addEventListener("fetchingPosts", () => {
      this.removeDisplayNoneUtility(sidebar);
    });
  }
  removeDisplayNoneUtility(sidebar) {
    sidebar.classList.remove("u-display--none");
  }
};
__name(_ShowIfNotEmpty, "ShowIfNotEmpty");
let ShowIfNotEmpty = _ShowIfNotEmpty;
const _ShowPost = class _ShowPost {
  constructor(container, map, baseClass, zoomMarker) {
    this.container = container;
    this.map = map;
    this.baseClass = baseClass;
    this.zoomMarker = zoomMarker;
    this.addMarkerPostPairAddedListener();
  }
  addMarkerPostPairAddedListener() {
    this.container.addEventListener("postMarkerPairAdded", (e) => {
      const customEvent = e;
      const postMarkerPair = customEvent.detail;
      this.setupPostClickListener(postMarkerPair);
    });
  }
  setupPostClickListener(postMarkerPair) {
    const fullPostElement = postMarkerPair.post.parentElement?.querySelector(`.${this.baseClass}__post-full`);
    const backButton = fullPostElement?.querySelector(`.${this.baseClass}__button-back`);
    if (!fullPostElement || !backButton) return;
    this.showPost(postMarkerPair, fullPostElement, backButton);
    this.hidePostListener(postMarkerPair, fullPostElement, backButton);
  }
  showPost(postMarkerPair, fullPostElement, backButton) {
    postMarkerPair.post.addEventListener("click", () => {
      if (fullPostElement.classList.contains("is-open")) return;
      this.closeAlreadyOpenPosts();
      this.scrollToMap();
      fullPostElement.classList.remove("u-display--none");
      fullPostElement.classList.add("is-open");
      setTimeout(() => {
        fullPostElement.style.animationDuration = "0s";
      }, 200);
      fullPostElement.classList.remove("is-closed");
      this.container.classList.add("has-open-post");
      fullPostElement.setAttribute("aria-hidden", "false");
      document.body.classList.add("u-overflow--hidden");
      this.zoomMarker.zoom(postMarkerPair.marker);
      backButton.focus();
    });
  }
  hidePostListener(postMarkerPair, fullPostElement, backButton) {
    backButton.addEventListener("click", () => {
      this.hidePost(postMarkerPair, fullPostElement, backButton);
    });
  }
  hidePost(postMarkerPair, fullPostElement, backButton) {
    invalidateSize(this.map);
    fullPostElement.style.animationDuration = "0.2s";
    fullPostElement.classList.remove("is-open");
    fullPostElement.classList.add("is-closed");
    setTimeout(() => {
      fullPostElement.classList.add("u-display--none");
    }, 200);
    this.container.classList.remove("has-open-post");
    fullPostElement.setAttribute("aria-hidden", "true");
    document.body.classList.remove("u-overflow--hidden");
    postMarkerPair?.post.focus();
  }
  closeAlreadyOpenPosts() {
    this.container.querySelectorAll(`.${this.baseClass}__post-full.is-open`).forEach((fullPostElement) => {
      const backButton = fullPostElement.querySelector(`.${this.baseClass}__button-back`);
      if (backButton) {
        this.hidePost(null, fullPostElement, backButton);
      }
    });
  }
  scrollToMap() {
    const rect2 = this.container.getBoundingClientRect();
    if (rect2.top > 0) {
      window.scrollBy(0, rect2.top);
    }
  }
};
__name(_ShowPost, "ShowPost");
let ShowPost = _ShowPost;
const _TooltipListener = class _TooltipListener {
  constructor(container, map, markers) {
    this.container = container;
    this.map = map;
    this.markers = markers;
    this.container = container;
    this.map = map;
    this.markers = markers;
    this.popupOpened();
  }
  popupOpened() {
    const popup = this.container.querySelector(".leaflet-popup-pane");
    popup?.addEventListener("click", (e) => {
      const shouldOpenPost = e.target.getAttribute("data-js-osm-id");
      if (!shouldOpenPost) return;
      const post = this.container.querySelector(`#${shouldOpenPost}`);
      if (post) {
        post.click();
      }
    });
  }
};
__name(_TooltipListener, "TooltipListener");
let TooltipListener = _TooltipListener;
const _HandlePostsLoadingSpinner = class _HandlePostsLoadingSpinner {
  constructor(container) {
    this.container = container;
    const spinner = this.container.querySelector("[data-js-map-endpoint-spinner]");
    const noPostsTemplate = this.container.querySelector("[data-js-map-no-posts-found]");
    if (spinner && noPostsTemplate) {
      this.listenForPostsDoneFetching(spinner, noPostsTemplate);
    }
  }
  listenForPostsDoneFetching(spinner, noPostsTemplate) {
    this.container.addEventListener("doneFetchingPostsEvent", (e) => {
      const pageNumber = e.detail;
      this.removeSpinner(spinner, noPostsTemplate, pageNumber);
    });
  }
  removeSpinner(spinner, noPostsTemplate, pageNumber) {
    if (pageNumber <= 1) {
      const noPostsContent = document.importNode(noPostsTemplate.content, true);
      const noPostsContainer = document.createElement("div");
      noPostsContainer.appendChild(noPostsContent);
      noPostsTemplate.insertAdjacentElement("afterend", noPostsContainer);
    }
    spinner.remove();
  }
};
__name(_HandlePostsLoadingSpinner, "HandlePostsLoadingSpinner");
let HandlePostsLoadingSpinner = _HandlePostsLoadingSpinner;
const _OpenStreetMap = class _OpenStreetMap {
  constructor(container) {
    this.container = container;
    this.settings = this.getSettings();
    const initializeMapInstance = new InitializeOsm(this.container);
    const [map, markers] = initializeMapInstance.create();
    if (map && markers) {
      this.setupMap(map);
      this.setupFeatures(map, markers);
    }
  }
  settings;
  baseClass = "c-openstreetmap";
  setupMap(map) {
    new SetMapTiles(this.container, map);
    setView(map, JSON.parse(this.settings.startposition));
    map.zoomControl.setPosition("bottomright");
    invalidateSize(map);
  }
  setupFeatures(map, markers) {
    const zoomMarkerInstance = new ZoomMarker(map, markers);
    new HandlePostsLoadingSpinner(this.container);
    const createMarkerInstance = new CreateMarker(this.container);
    const createTooltipInstance = new CreateTooltip(this.container);
    new ExpandOnClick(this.container, map, this.baseClass);
    new ShowPost(this.container, map, this.baseClass, zoomMarkerInstance);
    new ShowIfNotEmpty(this.container, this.baseClass);
    new ObserveSize(this.container, this.baseClass);
    new TooltipListener(this.container, map, markers);
    const postMarkerPairsInstance = new PostMarkerPairs(this.container);
    new AccessibilityFeatures(this.container, map, markers, zoomMarkerInstance, this.baseClass);
    const addMarkersFromLocationInstance = new AddMarkersFromLocations(
      this.container,
      map,
      markers,
      postMarkerPairsInstance,
      createMarkerInstance,
      createTooltipInstance
    );
    new PostAdded(this.container, addMarkersFromLocationInstance);
    new AddEndpointPosts(this.container, map);
    new FetchEndpointPosts(this.container, this.settings.endpoint);
  }
  getSettings() {
    return {
      endpoint: this.container.getAttribute("data-js-map-posts-endpoint") ?? "",
      startposition: this.container.getAttribute("data-js-map-start-position") ?? ""
    };
  }
};
__name(_OpenStreetMap, "OpenStreetMap");
let OpenStreetMap = _OpenStreetMap;
function initializeOpenStreetMaps() {
  const componentElements = [...document.querySelectorAll(".c-openstreetmap")];
  componentElements.forEach((element) => {
    new OpenStreetMap(element);
  });
}
__name(initializeOpenStreetMaps, "initializeOpenStreetMaps");
const _Copy = class _Copy {
  constructor(element) {
    this.copy(element);
  }
  copy(element) {
    let target = element.getAttribute("data-js-copy-target");
    element.addEventListener("click", () => {
      let targetEl = target == "self" ? element : document.querySelector(`[data-js-copy-item="${target}"]`);
      if (targetEl && targetEl.hasAttribute("data-js-copy-data")) {
        let data = targetEl.getAttribute("data-js-copy-data") ?? "";
        if ("permissions" in navigator) {
          navigator.permissions.query({ name: "clipboard-write" }).then((result) => {
            if (result.state === "granted" || result.state === "prompt") {
              navigator.clipboard.writeText(data).then(() => {
                this.append(element, true);
              }).catch((error) => {
                console.error("Error copying text to clipboard:", error);
              });
            } else {
              this.append(element, false);
            }
          }).catch((error) => {
            console.error("Error requesting permission:", error);
            this.append(element, false);
          });
        } else {
          console.warn("Clipboard API not supported in this browser");
          this.append(element, false);
        }
      } else return;
    });
  }
  append(element, success = false) {
    if (!element || !element.parentNode) return;
    const successNotice = element.getAttribute("data-js-copy-success") ?? "Content was successfully copied.";
    const errorNotice = element.getAttribute("data-js-copy-error") ?? "Something went wrong";
    const notice = success ? successNotice : errorNotice;
    let sibling = element.nextSibling;
    if (sibling instanceof Element && sibling.hasAttribute("js-data-copy-notice")) {
      sibling.textContent = notice;
    } else {
      const span = document.createElement("span");
      span.innerText = notice;
      span.setAttribute("js-data-copy-notice", "");
      element.parentNode.insertBefore(span, element.nextSibling);
    }
  }
};
__name(_Copy, "Copy");
let Copy = _Copy;
function setupCopy() {
  [...document.querySelectorAll("[data-js-copy-target]")].forEach((element) => {
    new Copy(element);
  });
}
__name(setupCopy, "setupCopy");
const _Compressed = class _Compressed {
  element = null;
  parentElement = null;
  siblingElements = [];
  compressedAmount = null;
  className = null;
  toggle = false;
  constructor(element) {
    this.element = element;
    this.parentElement = element.parentElement;
    this.compressedAmount = this.element.hasAttribute("data-js-compressed") ? parseInt(this.element.getAttribute("data-js-compressed") || "0", 10) : 0;
    this.siblingElements = [...this.parentElement?.children || []].filter((child2) => child2 !== this.element).slice(this.compressedAmount);
    this.className = this.element?.getAttribute("data-js-compressed-class");
    this.toggle = this.element.hasAttribute("data-js-compressed-toggle");
    if (!this.className) {
      this.siblingElements.forEach((sibling) => {
        sibling.style.display = "none";
      });
    }
    this.init();
  }
  init() {
    if (!this.element || !this.parentElement || this.siblingElements.length <= 0) return;
    this.element.setAttribute("is-compressed", "");
    this.element.style.cursor = "pointer";
    this.clickListener();
  }
  clickListener() {
    this.element?.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.handleClick();
      if (!this.toggle) this.element?.remove();
    });
  }
  handleClick() {
    if (this.element?.hasAttribute("is-compressed")) {
      this.element.removeAttribute("is-compressed");
      console.log("has element attribute");
      this.toggleSiblingElements(false);
    } else {
      this.element?.setAttribute("is-compressed", "");
      this.toggleSiblingElements(true);
    }
  }
  toggleSiblingElements(isCompressed) {
    this.siblingElements?.forEach((sibling) => {
      if (this.className) {
        isCompressed ? sibling.classList.add(this.className) : sibling.classList.remove(this.className);
      } else {
        sibling.style.display = isCompressed ? "none" : "";
      }
    });
  }
};
__name(_Compressed, "Compressed");
let Compressed = _Compressed;
function initializeElements(elements) {
  elements.forEach((element) => {
    if (element.hasAttribute("compressed-was-initialized")) {
      return;
    }
    element.setAttribute("compressed-was-initialized", "");
    new Compressed(element);
  });
}
__name(initializeElements, "initializeElements");
function initializeCompressed() {
  initializeElements([...document.querySelectorAll("[data-js-compressed]")]);
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (!(node instanceof HTMLElement)) {
          return;
        }
        if (node.hasAttribute("data-js-compressed")) {
          initializeElements([node]);
        } else {
          initializeElements([...node.querySelectorAll("[data-js-compressed]")]);
        }
      });
    });
  });
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
}
__name(initializeCompressed, "initializeCompressed");
const _DeviceDetect = class _DeviceDetect {
  attributeName = "data-js-device-detect";
  constructor() {
    const device = this.getDeviceType();
    if (typeof device === "string") {
      this.init("is-" + device);
    }
  }
  /**
   * Initializes the device detection by adding the device class to elements
   * with the specified attribute.
   * @param deviceClass - The device class to be added to the elements.
   */
  init(deviceClass) {
    const elements = document.querySelectorAll(`[${this.attributeName}]`);
    elements.forEach((element) => {
      element.classList.add(deviceClass);
    });
  }
  /**
   * Retrieves the device type based on the user agent string.
   * @returns The device type as a string or null if it's unknown.
   */
  getDeviceType() {
    const userAgent = navigator.userAgent.toLowerCase();
    if (/iphone|ipad|ipod/.test(userAgent)) {
      return "ios";
    } else if (/android/.test(userAgent)) {
      return "android";
    } else if (/windows/.test(userAgent)) {
      return "windows";
    } else if (/macintosh/.test(userAgent)) {
      return "macos";
    } else if (/linux/.test(userAgent)) {
      return "linux";
    }
    return null;
  }
};
__name(_DeviceDetect, "DeviceDetect");
let DeviceDetect = _DeviceDetect;
const _GoogleTranslate = class _GoogleTranslate {
  element;
  originalLink;
  constructor(element) {
    this.element = element;
    this.originalLink = element.getAttribute("data-js-original-link");
    if (this.originalLink && this.originalLink !== "") {
      this.element.href = this.originalLink;
    }
  }
};
__name(_GoogleTranslate, "GoogleTranslate");
let GoogleTranslate = _GoogleTranslate;
function runCondition(htmlElement) {
  if (htmlElement.classList.contains("translated-ltr") || htmlElement.classList.contains("translated-rtl")) {
    [...document.querySelectorAll("a[data-js-original-link]")].forEach((element) => {
      new GoogleTranslate(element);
    });
  }
}
__name(runCondition, "runCondition");
function initializeGoogleTranslate() {
  const htmlElement = document.documentElement;
  runCondition(htmlElement);
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.attributeName === "class") {
        runCondition(htmlElement);
      }
    });
  });
  const config = { attributes: true, attributeFilter: ["class"] };
  observer.observe(htmlElement, config);
}
__name(initializeGoogleTranslate, "initializeGoogleTranslate");
const _ResizeMediaQuery = class _ResizeMediaQuery {
  prefixName;
  element;
  defaultBreakpoints;
  resizeClass;
  constructor(element) {
    this.prefixName = "--size-";
    this.defaultBreakpoints = { xs: 384, sm: 576, md: 768, lg: 960, xl: 1200 };
    this.element = element;
    this.resizeClass = null;
    let resizeClass = element.getAttribute("data-observe-resizes");
    if (resizeClass !== "") {
      this.resizeClass = resizeClass;
    }
    if ("ResizeObserver" in self) {
      this.resizeObserver();
    }
  }
  resizeObserver() {
    new ResizeObserver((entries) => {
      entries.forEach((entry) => {
        this.handleResize(entry);
      });
    }).observe(this.element);
  }
  handleResize(entry) {
    const element = entry.target;
    const breakpoints = element.dataset.breakpoints ? JSON.parse(element.dataset.breakpoints) : this.defaultBreakpoints;
    Object.keys(breakpoints).forEach((breakpoint) => {
      const minWidth = breakpoints[breakpoint];
      if (entry.contentRect.width >= minWidth) {
        element.classList.add((this.resizeClass ?? element.classList[0]) + this.prefixName + breakpoint);
      } else {
        element.classList.remove((this.resizeClass ?? element.classList[0]) + this.prefixName + breakpoint);
      }
    });
  }
};
__name(_ResizeMediaQuery, "ResizeMediaQuery");
let ResizeMediaQuery = _ResizeMediaQuery;
function initializeResizeMediaQuery() {
  const elements = document.querySelectorAll("[data-observe-resizes]");
  if (elements.length) {
    elements.forEach((element) => {
      new ResizeMediaQuery(element);
    });
  }
  const observer = new MutationObserver((mutationsList) => {
    mutationsList.forEach((mutation) => {
      const elements2 = mutation.addedNodes;
      if (elements2?.length) {
        elements2.forEach((element) => {
          if (element?.nodeType === Node.ELEMENT_NODE && element.matches("[data-observe-resizes]")) {
            new ResizeMediaQuery(element);
          }
        });
      }
    });
  });
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
}
__name(initializeResizeMediaQuery, "initializeResizeMediaQuery");
const _DrawerAccessibility = class _DrawerAccessibility {
  constructor(button, drawer) {
    this.button = button;
    this.drawer = drawer;
    this.drawer.setAttribute("aria-hidden", "true");
    this.closeButton = drawer.querySelector(".c-drawer__close");
    this.firstMenuItem = this.getFirstMenuItem();
    this.lastItem = this.getLastItem();
    this.lastItem && this.closeButton && this.setupAccessibilityListeners();
  }
  closeButton;
  firstMenuItem;
  lastItem;
  /**
   * Focuses on the first menu item (or the close button if there are no menu items)
   * Loop the focus back to the close button when tabbing past the last item.
   * Sets the focus back on the "open" button when the close button is clicked.
   */
  setupAccessibilityListeners() {
    this.button.addEventListener("click", () => {
      (this.firstMenuItem || this.closeButton).focus();
    });
    this.lastItem.addEventListener("keydown", (e) => {
      if (e.key === "Tab") {
        e.preventDefault();
        this.closeButton.focus();
      }
    });
    this.closeButton.addEventListener("click", () => {
      this.button.focus();
    });
    document.addEventListener("keydown", (e) => {
      if (this.drawer.classList.contains("is-open") && e.key === "Escape") {
        this.closeButton.click();
        this.button.focus();
      }
    });
    this.drawer.addEventListener("transitionend", () => {
      if (this.drawer.classList.contains("is-open")) {
        this.drawer.removeAttribute("aria-hidden");
        this.drawer.querySelectorAll("a").forEach((element) => {
          element.setAttribute("tabindex", "0");
        });
      }
    });
    this.drawer.addEventListener("transitionend", () => {
      if (!this.drawer.classList.contains("is-open")) {
        this.drawer.setAttribute("aria-hidden", "true");
      }
    });
    this.drawer.addEventListener("DOMNodeInserted", (event2) => {
      const target = event2.target;
      if (target.matches("a")) {
        target.setAttribute("tabindex", "0");
      }
    });
  }
  /**
   * Retrieves the first menu item element within the drawer.
   * 
   * @param drawer - The drawer element.
   * @returns The first menu item element, or null if not found.
   */
  getFirstMenuItem() {
    return this.drawer.querySelector(".c-drawer__body a, .c-drawer__body button");
  }
  /**
   * Retrieves the last item in the drawer.
   * 
   * @param drawer - The HTML element representing the drawer.
   * @returns The last item in the drawer.
   */
  getLastItem() {
    const drawerItems = [...this.drawer.querySelectorAll("button, a, input")];
    return drawerItems[drawerItems.length - 1];
  }
};
__name(_DrawerAccessibility, "DrawerAccessibility");
let DrawerAccessibility = _DrawerAccessibility;
function initializeDrawerAccessibility() {
  const drawerToggleButtons = document.querySelectorAll(".c-drawer__toggle");
  drawerToggleButtons.forEach((button) => {
    if (button.hasAttribute("data-js-toggle-trigger") && document.querySelector(`[data-js-toggle-item="${button.getAttribute("data-js-toggle-trigger")}"]`)) {
      const drawer = document.querySelector(`[data-js-toggle-item="${button.getAttribute("data-js-toggle-trigger")}"]`);
      new DrawerAccessibility(button, drawer);
    }
  });
}
__name(initializeDrawerAccessibility, "initializeDrawerAccessibility");
const _TestimonialCarousel = class _TestimonialCarousel {
  constructor(carousel) {
    this.CAROUSEL = carousel;
    this.ITEMS = carousel.querySelectorAll(".c-testimonial");
    this.IS_LARGE_SCREEN = this.isLargeScreen();
    this.init(this.ITEMS);
    this.windowResize();
    this.addButtonListeners();
  }
  // eslint-disable-next-line class-methods-use-this
  init() {
    const keys = Array.from(this.ITEMS.keys());
    const show = this.IS_LARGE_SCREEN ? keys.slice(0, 2) : keys.slice(0, 1);
    const hide = this.IS_LARGE_SCREEN ? keys.slice(2) : keys.slice(1);
    const buttons = this.CAROUSEL.parentElement.querySelectorAll(".c-testimonials__button");
    if (hide.length === 0) {
      buttons.forEach((button) => {
        button.classList.add("u-display--none");
      });
    } else {
      buttons.forEach((button) => {
        button.classList.remove("u-display--none");
      });
    }
    this.CAROUSEL.setAttribute("js-testimonials-iteration", 0);
    this.toggleVisible(show);
    this.toggleHidden(hide);
  }
  addButtonListeners() {
    const backButton = this.CAROUSEL.parentElement.querySelector("[js-testimonials__back]");
    const forwardButton = this.CAROUSEL.parentElement.querySelector("[js-testimonials__forward]");
    backButton.addEventListener("click", () => {
      const current = parseInt(this.CAROUSEL.getAttribute("js-testimonials-iteration"), 10);
      const amount = Math.ceil(this.IS_LARGE_SCREEN ? this.ITEMS.length / 2 : this.ITEMS.length);
      const next3 = current === 0 ? amount - 1 : current - 1;
      this.CAROUSEL.setAttribute("js-testimonials-iteration", next3);
      this.updateCarousel(current);
    });
    forwardButton.addEventListener("click", () => {
      const current = parseInt(this.CAROUSEL.getAttribute("js-testimonials-iteration"), 10);
      const amount = Math.ceil(this.IS_LARGE_SCREEN ? this.ITEMS.length / 2 : this.ITEMS.length);
      const next3 = current === amount - 1 ? 0 : current + 1;
      this.CAROUSEL.setAttribute("js-testimonials-iteration", next3);
      this.updateCarousel(current);
    });
  }
  updateCarousel(currentIndex) {
    const nextInt = parseInt(this.CAROUSEL.getAttribute("js-testimonials-iteration"), 10);
    if (!this.IS_LARGE_SCREEN) {
      this.toggleVisible([nextInt]);
      this.toggleHidden([currentIndex]);
    } else {
      const sibling = nextInt * 2;
      const currentSibling = currentIndex * 2;
      this.toggleVisible([nextInt * 2, sibling + 1]);
      this.toggleHidden([currentIndex * 2, currentSibling + 1]);
    }
  }
  toggleVisible(list) {
    list.forEach((i) => {
      if (this.ITEMS[i] !== void 0) {
        this.ITEMS[i].classList.add("c-testimonial--is-visible");
        this.ITEMS[i].classList.remove("c-testimonial--is-hidden");
      }
    });
  }
  toggleHidden(list) {
    list.forEach((i) => {
      if (this.ITEMS[i] !== void 0) {
        this.ITEMS[i].classList.add("c-testimonial--is-hidden");
        this.ITEMS[i].classList.remove("c-testimonial--is-visible");
      }
    });
  }
  windowResize() {
    window.addEventListener("resize", (e) => {
      if (this.isLargeScreen() !== this.IS_LARGE_SCREEN) {
        this.IS_LARGE_SCREEN = this.isLargeScreen();
        this.init(this.ITEMS);
      }
    });
  }
  // eslint-disable-next-line class-methods-use-this
  isLargeScreen() {
    const body = document.querySelector("body");
    const width = window.innerWidth / parseFloat(getComputedStyle(body)["font-size"]);
    return width >= 78;
  }
};
__name(_TestimonialCarousel, "TestimonialCarousel");
let TestimonialCarousel = _TestimonialCarousel;
function initializeTestimonials() {
  const testimonialCarousels = document.querySelectorAll("[js-testimonials--is-carousel]");
  [...testimonialCarousels].forEach((testimonial) => {
    new TestimonialCarousel(testimonial);
  });
}
__name(initializeTestimonials, "initializeTestimonials");
const _Segment = class _Segment {
  constructor(segment) {
    this.SEGMENT = segment;
    this.videoInteractions();
  }
  videoInteractions() {
    const btn = this.SEGMENT.querySelector("[js-segment__video--plaus]");
    if (btn) {
      btn.addEventListener("click", () => {
        if (this.getVideoState() === "playing" || !this.getVideoState()) {
          this.pauseVideo();
        } else {
          this.playVideo();
        }
      });
    }
  }
  getVideoState() {
    return this.SEGMENT.getAttribute("js-segment__video--plaus");
  }
  pauseVideo() {
    this.SEGMENT.setAttribute("js-segment__video--plaus", "paused");
    this.SEGMENT.querySelector("video").pause();
  }
  playVideo() {
    this.SEGMENT.setAttribute("js-segment__video--plaus", "playing");
    this.SEGMENT.querySelector("video").play();
  }
};
__name(_Segment, "Segment");
let Segment = _Segment;
function initializeSegments() {
  const segments = document.querySelectorAll(".c-segment");
  [...segments].forEach((segment) => {
    new Segment(segment);
  });
}
__name(initializeSegments, "initializeSegments");
const _Table = class _Table {
  constructor(table) {
    this.table = table;
    this.list = table.querySelectorAll("[js-table-filter-item]");
    this.isPagination = table.hasAttribute("js-table-pagination");
    this.isFilterable = table.hasAttribute("js-table-filter");
    this.isSortable = table.hasAttribute("js-table-sort");
    this.isMultidimensional = table.classList.contains("c-table--multidimensional");
    this.link = null;
    this.rowHref = "js-row-href";
    this.hasSumRow = this.table.hasAttribute("table-sum");
    this.tableInner = table.querySelector(".c-table__inner");
    this.tableTable = table.querySelector(".c-table__table");
    this.tableRefresh();
    if (this.isPagination) this.paginationButtons();
    if (this.isFilterable) this.filterInput();
    if (this.isSortable) this.sortAddButtons();
    if (this.isMultidimensional) this.addCollapsibleEvent();
    this.updateOnScrollFunc = this.updateOnScroll.bind(this);
    const resizeObserver = new ResizeObserver((entries) => {
      const tableInner = table.querySelector(".c-table__inner");
      const tableInnerWidth = tableInner.offsetWidth;
      const tableLineWidth = tableInner.querySelector(".c-table__line").offsetWidth;
      const tableScrollIndicator = table.querySelector(".c-table__scroll-indicator");
      const tableScrollIndicatorWrapper = table.querySelector(".c-table__scroll-indicator-wrapper");
      const tableScrollIndicatorWidth = `${tableInnerWidth / tableLineWidth * 100}%`;
      if (tableScrollIndicatorWidth !== "100%") {
        tableScrollIndicator.classList.remove("u-display--none");
        tableScrollIndicatorWrapper.classList.remove("u-display--none");
      } else {
        tableScrollIndicator.classList.add("u-display--none");
        tableScrollIndicatorWrapper.classList.add("u-display--none");
      }
      tableScrollIndicator.style.width = tableScrollIndicatorWidth;
      this.tableInner.addEventListener("scroll", this.updateOnScrollFunc, false);
    });
    resizeObserver.observe(table);
    this.indicatorContainer = this.table.querySelector(".c-table__scroll-indicator-wrapper");
    this.indicatorInput = this.table.querySelector(".c-table__scroll-indicator");
    this.indicatorInputLeft = this.indicatorInput.offsetLeft;
    this.initialCursorPosition = 0;
    this.indicatorInput.style.marginLeft = "0px";
    this.slider();
    this.handleMouseMoveFunc = this.handleMouseMove.bind(this);
  }
  addCollapsibleEvent() {
    const collapseButton = this.table.querySelector(".c-table__collapse-button");
    collapseButton.addEventListener("click", () => {
      this.table.classList.toggle("is-collapsed");
    });
  }
  tableRefresh() {
    let list = Array.from(this.list);
    if (this.isFilterable) {
      list = this.filterList(list, this.filterValue());
    }
    if (this.isSortable) {
      list = this.sortList(list);
    }
    if (this.isPagination) {
      list = this.paginateList(list);
    }
    this.renderTable(list);
    if (this.isPagination) {
      this.paginatePages();
      this.paginationLinks();
      this.paginateLinkListeners();
    }
  }
  renderTable(list = null) {
    const body = this.table.querySelector("tbody");
    body.innerHTML = "";
    list.forEach((element) => {
      if (element.index) {
        body.appendChild(element.index);
      } else {
        body.appendChild(element);
      }
    });
  }
  paginatePages() {
    const items = this.isFilterable ? this.filterList(this.list, this.filterValue()).length : this.list.length;
    return Math.ceil(items / this.paginationRows());
  }
  paginationLinks() {
    if (!this.link) {
      this.link = this.table.querySelector("[js-table-pagination--link]");
    }
    const body = this.table.querySelector("[js-table-pagination--links]");
    body.closest("[js-table-pagination]").classList.remove("u-display--none");
    body.innerHTML = "";
    if (this.paginatePages() > 1) {
      for (let index = 0; index < this.paginatePages(); index++) {
        const elm = this.link.cloneNode(true);
        elm.innerHTML = index + 1;
        elm.classList.remove("c-button__outlined--primary");
        elm.setAttribute("js-table-pagination--link", index + 1);
        if (index + 1 === this.paginationCurrent()) {
          elm.classList.add("c-button__outlined--primary");
        }
        body.appendChild(elm);
      }
    } else {
      body.closest("[js-table-pagination]").classList.add("u-display--none");
    }
  }
  paginateLinkListeners() {
    const btns = this.table.querySelectorAll("[js-table-pagination--link]");
    btns.forEach((btn) => {
      btn.addEventListener("click", () => {
        this.paginateSetCurrent(btn.getAttribute("js-table-pagination--link"));
        this.tableRefresh();
      });
    });
  }
  // eslint-disable-next-line class-methods-use-this
  paginateList(list) {
    const first = (this.paginationCurrent() - 1) * this.paginationRows();
    const last = this.paginationCurrent() * this.paginationRows();
    return Array.from(list).slice(first, last);
  }
  // Add event listener filter
  filterInput() {
    const input = this.table.querySelector("[js-table-filter-input]");
    input.addEventListener("input", (e) => {
      if (this.isPagination) this.paginateSetCurrent();
      this.tableRefresh();
    });
  }
  // eslint-disable-next-line class-methods-use-this
  filterList(list, query2) {
    const newList = [];
    const lastIndex = list.length - 1;
    const lastRow = list[lastIndex];
    list.forEach((element) => {
      let data = "";
      element.querySelectorAll("[js-table-filter-data]").forEach((item) => {
        data += item.innerHTML.toLowerCase();
      });
      if (data.includes(query2.toLowerCase())) {
        newList.push(element);
      }
    });
    if (this.hasSumRow) {
      newList[lastIndex] = lastRow;
    }
    return newList;
  }
  // eslint-disable-next-line class-methods-use-this
  compare(a, b) {
    return a.data.toLowerCase().localeCompare(b.data.toLowerCase(), "en", { numeric: true });
  }
  sortList(list) {
    const sortOrder = this.table.getAttribute("js-table-sort--order");
    let sumRow = "";
    if (!sortOrder) {
      return list;
    }
    if (this.hasSumRow) {
      sumRow = list.pop();
    }
    const sortData = [];
    const sortDictator = this.table.getAttribute("js-table-sort--dictator");
    list.forEach((element) => {
      sortData.push(element.querySelector(`[js-table-sort-data="${sortDictator}"]`));
    });
    const comparableData = [...sortData].map((data) => {
      return { data: data.innerText.trim(), index: data.closest(`[js-table-sort--sortable]`) };
    });
    comparableData.sort(this.compare);
    if (sortOrder === "desc") {
      if (this.hasSumRow) {
        comparableData.unshift({ index: sumRow });
      }
      return comparableData.reverse(this.compare);
    }
    if (this.hasSumRow) {
      comparableData.push({ index: sumRow });
    }
    return comparableData;
  }
  paginationButtons() {
    const buttons = this.table.querySelectorAll("[js-table-pagination-btn]");
    this.paginateSetCurrent();
    buttons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const type2 = btn.getAttribute("js-table-pagination-btn");
        this.paginateSetCurrent(
          type2 === "next" ? this.paginationCurrent() + 1 : this.paginationCurrent() - 1
        );
        this.tableRefresh();
      });
    });
  }
  paginateSetCurrent(current = 1) {
    this.table.setAttribute("js-table-pagination--current", current);
    current = parseInt(current, 10);
    if (current === this.paginatePages()) {
      this.table.querySelector('[js-table-pagination-btn="next"]').setAttribute("disabled", true);
      this.table.querySelector('[js-table-pagination-btn="prev"]').removeAttribute("disabled");
    } else if (current === 1) {
      this.table.querySelector('[js-table-pagination-btn="prev"]').setAttribute("disabled", true);
      this.table.querySelector('[js-table-pagination-btn="next"]').removeAttribute("disabled");
    } else {
      this.table.querySelector('[js-table-pagination-btn="next"]').removeAttribute("disabled");
      this.table.querySelector('[js-table-pagination-btn="prev"]').removeAttribute("disabled");
    }
  }
  sortAddButtons() {
    const sortButtons = this.table.querySelectorAll(`[js-table-sort--btn]`);
    for (let i = 0; i < sortButtons.length; i++) {
      if (!sortButtons[i].hasAttribute("js-table-sort--order")) {
        sortButtons[i].setAttribute("js-table-sort--order", "asc");
      }
      if (this.isSortable && this.isMultidimensional && i === 0) {
        sortButtons[i].removeAttribute("js-table-sort--order");
        continue;
      }
      sortButtons[i].addEventListener("click", (e) => {
        if (this.isPagination) this.paginateSetCurrent();
        const sortOrder = this.table.getAttribute("js-table-sort--order");
        const newOrder = sortOrder === "asc" ? "desc" : "asc";
        this.table.setAttribute("js-table-sort--order", newOrder);
        const buttonId = e.target.closest("[js-table-sort--btn]");
        const dataId = buttonId.getAttribute("js-table-sort--btn");
        this.table.setAttribute("js-table-sort--dictator", dataId);
        this.tableRefresh();
      });
    }
  }
  filterValue() {
    return this.table.querySelector("[js-table-filter-input]").value;
  }
  paginationCurrent() {
    return parseInt(this.table.getAttribute("js-table-pagination--current"), 10);
  }
  paginationRows() {
    return this.table.getAttribute("js-table-pagination");
  }
  slider() {
    this.indicatorInput.addEventListener("mousedown", (e) => {
      e.preventDefault();
      this.initialCursorPosition = e.clientX;
      this.tableInner.removeEventListener("scroll", this.updateOnScrollFunc, false);
      window.addEventListener("mousemove", this.handleMouseMoveFunc, false);
      window.addEventListener("mouseup", (ev) => {
        ev.preventDefault();
        this.tableInner.addEventListener("scroll", this.updateOnScrollFunc, false);
        window.removeEventListener("mousemove", this.handleMouseMoveFunc, false);
      });
    });
  }
  updateOnScroll() {
    const scrolledPixels = this.tableInner.scrollLeft;
    const tableLineWidth = this.tableInner.querySelector(".c-table__line").offsetWidth;
    this.indicatorInput.style.marginLeft = `${scrolledPixels / tableLineWidth * 100}%`;
  }
  handleMouseMove(event2) {
    event2.preventDefault();
    const scrollMax = this.indicatorContainer.offsetWidth - this.indicatorInput.offsetWidth;
    const inner = this.table.querySelector(".c-table__inner");
    const mouseMovedAmount = event2.clientX - this.initialCursorPosition;
    const scrolledAmount = this.indicatorInput.getBoundingClientRect().left - this.indicatorContainer.getBoundingClientRect().left;
    if (scrolledAmount <= 0 && !(scrolledAmount + mouseMovedAmount > 0)) {
      this.indicatorInput.style.marginLeft = "0px";
      this.initialCursorPosition = event2.clientX;
      inner.scrollLeft = 0;
    } else if (scrolledAmount >= scrollMax && !(scrolledAmount + mouseMovedAmount <= scrollMax)) {
      this.indicatorInput.style.marginLeft = `${scrollMax}px`;
    } else {
      const amountOfOverflow = this.tableTable.offsetWidth - inner.offsetWidth;
      const indicatorPosition = parseInt(this.indicatorInput.style.marginLeft, 10);
      this.indicatorInput.style.marginLeft = `${indicatorPosition + mouseMovedAmount}px`;
      this.initialCursorPosition = event2.clientX;
      inner.scrollLeft = amountOfOverflow * (scrolledAmount / scrollMax);
    }
  }
};
__name(_Table, "Table");
let Table = _Table;
function initializeTable() {
  const tables = document.querySelectorAll(".c-table");
  [...tables].forEach((table) => {
    new Table(table);
  });
}
__name(initializeTable, "initializeTable");
let acceptedSuppliers = JSON.parse(localStorage.getItem("acceptedSuppliers")) ?? [];
const hasSuppressedContent = /* @__PURE__ */ __name((modifier) => {
  let suppressedContentExists = document.querySelectorAll(".js-suppressed-content").length > 0;
  return suppressedContentExists;
}, "hasSuppressedContent");
const url = /* @__PURE__ */ __name((contentWrapper) => {
  if (contentWrapper.hasAttribute("data-src")) {
    let json = JSON.parse(contentWrapper.getAttribute("data-src"));
    let url2 = [];
    json.forEach((host) => {
      url2.push(new URL(host));
    });
    return url2;
  }
}, "url");
const handleReveal = /* @__PURE__ */ __name((contentWrapper) => {
  let needsAcceptance = [];
  const contentUrl = url(contentWrapper);
  contentUrl.forEach((supplier) => {
    if (acceptedSuppliers.includes(supplier.host)) {
      needsAcceptance.push(true);
    } else {
      needsAcceptance.push(false);
    }
  });
  if (!needsAcceptance.includes(false)) {
    revealContent(contentWrapper);
  }
}, "handleReveal");
const setLocalStorage = /* @__PURE__ */ __name((contentWrapper) => {
  const contentUrl = url(contentWrapper);
  if (contentUrl) {
    contentUrl.forEach((supplier) => {
      if (!acceptedSuppliers.includes(supplier.host) && supplier.host !== "https" && contentUrl.host !== "http") {
        acceptedSuppliers.push(supplier.host);
      }
      localStorage.setItem("acceptedSuppliers", JSON.stringify(acceptedSuppliers));
    });
  }
}, "setLocalStorage");
const revealContent = /* @__PURE__ */ __name((contentWrapper) => {
  const template = contentWrapper.querySelector("template");
  const suppressedContentWrapper = contentWrapper.querySelector(".c-acceptance__content");
  const clone = template.content.cloneNode(true);
  suppressedContentWrapper.appendChild(clone);
  contentWrapper.classList.remove("u-level-1");
  contentWrapper.classList.remove("js-suppressed-content");
  contentWrapper.classList.add("c-acceptance--accepted");
  contentWrapper.querySelector(".js-suppressed-content-prompt").classList.add("u-display--none");
}, "revealContent");
const revealContentLoop = /* @__PURE__ */ __name(() => {
  hasSuppressedContent() && [...document.querySelectorAll(".js-suppressed-content")].forEach((contentWrapper) => {
    if (contentWrapper.classList.contains("js-suppressed-content--none")) {
      handleReveal(contentWrapper);
    }
  });
}, "revealContentLoop");
const handleEvents = /* @__PURE__ */ __name((contentWrapper) => {
  setLocalStorage(contentWrapper);
  if (contentWrapper.classList.contains("js-suppressed-content--video")) {
    revealContent(contentWrapper);
  } else {
    revealContentLoop();
  }
}, "handleEvents");
const setEvents = /* @__PURE__ */ __name(() => {
  [...document.querySelectorAll(".js-suppressed-content")].forEach((contentWrapper) => {
    contentWrapper.querySelector(".js-suppressed-content-description").style.display = "block";
    const buttonEl = contentWrapper.querySelector("[js-suppressed-content-accept]");
    buttonEl?.addEventListener("click", () => {
      handleEvents(contentWrapper);
    });
  });
}, "setEvents");
function initializeIframeAcceptance() {
  if (acceptedSuppliers.length > 0 && hasSuppressedContent()) {
    [...document.querySelectorAll(".js-suppressed-content")].forEach((contentWrapper) => {
      if (contentWrapper.classList.contains("js-suppressed-content--none")) {
        handleReveal(contentWrapper);
      }
    });
  }
  hasSuppressedContent() && setEvents();
}
__name(initializeIframeAcceptance, "initializeIframeAcceptance");
const _SelectFilter = class _SelectFilter {
  constructor(selectContainer) {
    this.selectContainer = selectContainer;
    this.selectContainerId = selectContainer.getAttribute("data-js-filter-select-container");
    const selectFilterElements = this.getSelectFilterElements();
    if (selectFilterElements.length) {
      this.trySetfilterSelectComponent(selectFilterElements);
      this.listenForSelectChanges();
      this.handleFilterableElements();
      this.observeAddedFilterableElements();
    }
  }
  selectContainerId;
  filterableElementComponents = [];
  filterSelects = {};
  trySetfilterSelectComponent(selectFilterElements) {
    [...selectFilterElements].forEach((select) => {
      if (select.hasAttribute("data-js-filter-select")) {
        const attr = select.getAttribute("data-js-filter-select");
        if (!this.filterSelects[attr]) {
          this.filterSelects[attr] = {
            selects: [select],
            selected: []
          };
        } else {
          this.filterSelects[attr].selects.push(select);
        }
      }
    });
  }
  listenForSelectChanges() {
    Object.keys(this.filterSelects).forEach((key) => {
      this.filterSelects[key].selects.forEach((select) => {
        select.addEventListener("change", (e) => {
          this.updateSelected(key);
          this.filterFilterableElements();
        });
      });
    });
  }
  filterFilterableElements() {
    this.filterableElementComponents.forEach((filterableElementComponent) => {
      let showElement = [true];
      for (const key in this.filterSelects) {
        if (this.filterSelects[key].selected.length > 0) {
          showElement.push(this.filterSelects[key].selected.some((selected) => {
            return filterableElementComponent["filterProperties"][key].includes(selected);
          }));
        } else {
          showElement.push(true);
        }
      }
      this.toggleHideElement(filterableElementComponent.element, showElement.includes(false));
    });
  }
  toggleHideElement(element, hide) {
    if (hide) {
      element.classList.add("u-display--none");
    } else {
      element.classList.remove("u-display--none");
    }
  }
  updateSelected(key) {
    let selected = [];
    this.filterSelects[key].selects.forEach((select) => {
      const selectedOptions = select.querySelectorAll("option:checked");
      [...selectedOptions].forEach((option) => {
        selected.push(option.value);
      });
    });
    this.filterSelects[key].selected = selected;
  }
  getSelectFilterElements() {
    return document.querySelectorAll(`[data-js-filter-select-target="${this.selectContainerId}"]`);
  }
  handleFilterableElements() {
    [...this.selectContainer.querySelectorAll("[data-js-filter-item]")].forEach((element) => {
      this.setFilterableElementComponent(element);
    });
  }
  setFilterableElementComponent(element) {
    let filterableElementComponent = {};
    filterableElementComponent["element"] = element;
    filterableElementComponent["filterProperties"] = {};
    for (const key in this.filterSelects) {
      filterableElementComponent["filterProperties"][key] = [];
      if (element.getAttribute(key)) {
        filterableElementComponent["filterProperties"][key] = element.getAttribute(key).split(",");
      }
    }
    this.filterableElementComponents.push(filterableElementComponent);
  }
  observeAddedFilterableElements() {
    const observer = new MutationObserver((mutationsList) => {
      for (const mutation of mutationsList) {
        if (mutation.type === "childList" && mutation.addedNodes.length) {
          mutation.addedNodes.forEach((node) => {
            if (node instanceof HTMLElement && node.hasAttribute("data-js-filter-item")) {
              this.setFilterableElementComponent(node);
            }
          });
        }
      }
    });
    observer.observe(this.selectContainer, {
      childList: true,
      subtree: true
    });
  }
};
__name(_SelectFilter, "SelectFilter");
let SelectFilter = _SelectFilter;
function initializeSelectFilter() {
  document.querySelectorAll("[data-js-filter-select-container]").forEach((selectContainer) => {
    new SelectFilter(selectContainer);
  });
}
__name(initializeSelectFilter, "initializeSelectFilter");
const _SelectSort = class _SelectSort {
  constructor(selectSort, sortContainer) {
    this.selectSort = selectSort;
    this.sortContainer = sortContainer;
    this.observer = new MutationObserver(this.handleMutations.bind(this));
    this.observe();
    this.setSortListener();
  }
  sortedItemsCache = {};
  observer;
  setSortListener() {
    this.selectSort.addEventListener("change", () => this.sort());
  }
  sortFunction(a, b, order) {
    const aValue = a.getAttribute("data-js-sort-item") || "";
    const bValue = b.getAttribute("data-js-sort-item") || "";
    return aValue.localeCompare(bValue) * order;
  }
  getSortedItems(sortOrder) {
    const sortableItems = this.sortContainer.querySelectorAll("[data-js-sort-item]");
    if (this.sortedItemsCache[sortOrder] && this.sortedItemsCache[sortOrder].length === sortableItems.length) {
      return this.sortedItemsCache[sortOrder];
    }
    let sortedItems = [];
    switch (sortOrder) {
      case "asc":
        sortedItems = [...sortableItems].sort((a, b) => this.sortFunction(a, b, 1));
        break;
      case "desc":
        sortedItems = [...sortableItems].sort((a, b) => this.sortFunction(a, b, -1));
        break;
      case "rand":
        sortedItems = [...sortableItems].sort(() => Math.random() - 0.5);
        break;
      default:
        sortedItems = [...sortableItems];
        break;
    }
    this.sortedItemsCache[sortOrder] = sortedItems;
    return this.sortedItemsCache[sortOrder] || [];
  }
  sort() {
    this.disconnect();
    const sortOrder = this.selectSort.value;
    const sortedItems = this.getSortedItems(sortOrder ?? "");
    this.sortContainer.innerHTML = "";
    sortedItems.forEach((item) => {
      this.sortContainer.appendChild(item);
    });
    this.observe();
  }
  handleMutations(mutations) {
    let sortableWasAdded = false;
    mutations.forEach((mutation) => {
      if (mutation.type === "childList") {
        sortableWasAdded = false;
        mutation.addedNodes.forEach((node) => {
          if (node instanceof HTMLElement && node.hasAttribute("data-js-sort-item")) {
            sortableWasAdded = true;
          }
        });
        if (sortableWasAdded) {
          this.sort();
        }
      }
    });
  }
  disconnect() {
    this.observer.disconnect();
  }
  observe() {
    this.observer.observe(this.sortContainer, { childList: true, subtree: true });
  }
};
__name(_SelectSort, "SelectSort");
let SelectSort = _SelectSort;
function initializeSelectSort() {
  const sortSelects = document.querySelectorAll("[data-js-sort-select]");
  sortSelects.forEach((sortSelect) => {
    const sortableContainerId = sortSelect.getAttribute("data-js-sort-select");
    const sortableContainer = document.querySelector(`#${sortableContainerId}`);
    if (sortableContainer) {
      new SelectSort(sortSelect, sortableContainer);
    }
  });
}
__name(initializeSelectSort, "initializeSelectSort");
const _MegaMenu = class _MegaMenu {
  constructor(megaMenu, triggers) {
    this.megaMenu = megaMenu;
    this.triggers = triggers;
    this.setupListeners();
  }
  isOpen = false;
  /**
   * Sets up event listeners for the mega menu.
   */
  setupListeners() {
    this.triggers.forEach((trigger) => {
      trigger.addEventListener("click", () => {
        this.triggerClickHandler(trigger);
      });
    });
    document.addEventListener("click", (e) => {
      this.handleClickOutside(e);
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        this.close();
      }
    });
  }
  /**
   * Handles the click event on the trigger element.
   * Toggles the visibility of the mega menu and updates the aria-hidden attribute accordingly.
   * Also updates the state of the triggers based on the visibility of the mega menu.
   * 
   * @param trigger - The trigger element that was clicked.
   */
  triggerClickHandler(trigger) {
    this.megaMenu.classList.toggle("u-display--none");
    this.isOpen = this.megaMenu.classList.contains("u-display--none") ? false : true;
    this.megaMenu.setAttribute("aria-hidden", this.isOpen.toString());
    this.changeTriggersStates();
  }
  /**
   * Changes the states of the triggers based on the specified isOpen value.
   */
  changeTriggersStates() {
    this.triggers.forEach((trigger) => {
      trigger.setAttribute("aria-pressed", this.isOpen.toString());
    });
  }
  /**
   * Handles the click event outside of the mega menu.
   * If the click is not inside the menu or on any of the triggers, it closes the menu.
   * @param event - The pointer event object.
   */
  handleClickOutside(event2) {
    if (!this.isOpen) return;
    const target = event2.target;
    const isClickInsideMenu = this.megaMenu.contains(target);
    const isClickOnTrigger = Array.from(this.triggers).some((trigger) => trigger.contains(target));
    if (!isClickInsideMenu && !isClickOnTrigger) {
      this.close();
    }
  }
  /**
   * Closes the mega menu.
   * 
   * This method adds the 'u-display--none' class to the mega menu element, sets the 'aria-hidden' attribute to 'true',
   * and changes the triggers' states to false.
   */
  close() {
    if (!this.isOpen) return;
    this.isOpen = false;
    this.megaMenu.classList.add("u-display--none");
    this.megaMenu.setAttribute("aria-hidden", "true");
    this.changeTriggersStates();
  }
};
__name(_MegaMenu, "MegaMenu");
let MegaMenu = _MegaMenu;
function initializeMegaMenus() {
  document.querySelectorAll(".c-megamenu").forEach((megaMenu) => {
    const id = megaMenu.id;
    const triggers = document.querySelectorAll(`[data-js-mega-menu-trigger="${id}"]`);
    if (triggers.length <= 0) {
      return;
    }
    new MegaMenu(megaMenu, triggers);
  });
}
__name(initializeMegaMenus, "initializeMegaMenus");
const _ExtendedDropdownMenu = class _ExtendedDropdownMenu {
  constructor(parentContainer, titleElement, triggerElement) {
    this.parentContainer = parentContainer;
    this.titleElement = titleElement;
    this.triggerElement = triggerElement;
  }
  MAX_ROWS_PER_COLUMN = 5;
  NAV_ITEM_PADDING = 48;
  MIN_EDGE_PADDING = 32;
  triggerElementPosition;
  resizeTimeout = 0;
  calculatedLeftPosition = null;
  cachedResults = {};
  init() {
    requestAnimationFrame(() => {
      this.setElementPositionsAndSizes();
    });
    this.setupResizeListener();
    this.correctColumnBorders();
  }
  /**
   * Sets up a listener for window resize events to adjust the position and size of the dropdown menu.
   */
  setupResizeListener() {
    window.addEventListener("resize", () => {
      clearTimeout(this.resizeTimeout);
      this.resizeTimeout = window.setTimeout(() => {
        this.setElementPositionsAndSizes();
      }, 200);
    });
  }
  /**
   * Sets the positions and sizes of the dropdown menu elements based on the trigger element's position.
   */
  setElementPositionsAndSizes(ignoreCache = false) {
    this.triggerElementPosition = this.triggerElement.getBoundingClientRect();
    if (this.cachedResults[this.triggerElementPosition.left] && !ignoreCache) {
      this.parentContainer.style.left = `${this.cachedResults[this.triggerElementPosition.left]}px`;
      return;
    }
    const titleElementSize = this.titleElement.offsetWidth;
    const parentContainerSize = this.parentContainer.offsetWidth;
    const maxLeft = window.innerWidth - parentContainerSize + this.NAV_ITEM_PADDING - this.MIN_EDGE_PADDING;
    const calculatedLeftPosition = this.triggerElementPosition.left - titleElementSize - this.NAV_ITEM_PADDING;
    this.calculatedLeftPosition = calculatedLeftPosition > maxLeft ? maxLeft : calculatedLeftPosition < this.MIN_EDGE_PADDING ? this.MIN_EDGE_PADDING : calculatedLeftPosition;
    this.cachedResults[this.triggerElementPosition.left] = this.calculatedLeftPosition;
    this.parentContainer.style.left = `${this.calculatedLeftPosition}px`;
  }
  /**
   * Adjusts the grid row spans of the last item in the dropdown menu to ensure proper border alignment.
   */
  correctColumnBorders() {
    const items = this.parentContainer.querySelectorAll("[data-js-extended-dropdown-child-menu] > .c-nav__item");
    if (!items.length) return;
    const totalItems = items.length;
    const lastItem = items[totalItems - 1];
    const itemsInLastColumn = totalItems % this.MAX_ROWS_PER_COLUMN || this.MAX_ROWS_PER_COLUMN;
    const emptySlots = this.MAX_ROWS_PER_COLUMN - itemsInLastColumn;
    if (emptySlots > 0) {
      lastItem.style.gridRow = `span ${emptySlots + 1}`;
    }
  }
};
__name(_ExtendedDropdownMenu, "ExtendedDropdownMenu");
let ExtendedDropdownMenu = _ExtendedDropdownMenu;
function initializeExtendedDropdownMenu() {
  document.querySelectorAll("[data-js-extended-dropdown-content]").forEach((extendedDropdownMenu) => {
    const openElement = extendedDropdownMenu.closest(".c-nav__item")?.querySelector(".c-nav__item-wrapper");
    const titleElement = extendedDropdownMenu.querySelector("[data-js-extended-dropdown-title]");
    const asyncChildContainer = extendedDropdownMenu.querySelector("[data-js-async-children]");
    if (!openElement || !titleElement) {
      console.error("ExtendedDropdownMenu: Sibling element with class .c-nav__item-wrapper not found.");
      return;
    }
    const extendedDropdownMenuInstance = new ExtendedDropdownMenu(
      extendedDropdownMenu,
      titleElement,
      openElement
    );
    extendedDropdownMenuInstance.init();
    if (asyncChildContainer) {
      addObserverForAsyncContent(asyncChildContainer, extendedDropdownMenuInstance);
    }
  });
}
__name(initializeExtendedDropdownMenu, "initializeExtendedDropdownMenu");
function addObserverForAsyncContent(targetNode, extendedDropdownMenuInstance) {
  if (!targetNode.parentElement) {
    console.error("ExtendedDropdownMenu: asyncChildContainer has no parent element.");
    return;
  }
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      for (const removedNode of mutation.removedNodes) {
        if (removedNode === targetNode) {
          extendedDropdownMenuInstance.correctColumnBorders();
          extendedDropdownMenuInstance.setElementPositionsAndSizes(true);
          observer.disconnect();
        }
      }
    }
  });
  observer.observe(targetNode.parentElement, { childList: true, subtree: true });
}
__name(addObserverForAsyncContent, "addObserverForAsyncContent");
const _SizeObserver = class _SizeObserver {
  constructor(element, propertyName, axis, includePadding, includeFullSize) {
    this.element = element;
    this.propertyName = propertyName;
    this.axis = axis;
    this.includePadding = includePadding;
    this.includeFullSize = includeFullSize;
    this.axis = this.axis || "both";
    this.propertyName = this.propertyName || "size-observer";
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = this.getHeightWidth(entry);
        this.setElementProperties(width, height);
      }
    });
    resizeObserver.observe(element);
  }
  getHeightWidth(entry) {
    if (this.includeFullSize && entry.target) {
      return { width: entry.target.scrollWidth ?? 0, height: entry.target.scrollHeight ?? 0 };
    }
    if (this.includePadding && entry.borderBoxSize) {
      return { width: entry.borderBoxSize[0].inlineSize, height: entry.borderBoxSize[0].blockSize };
    }
    return { width: entry.contentRect.width, height: entry.contentRect.height };
  }
  setElementProperties(width, height) {
    if (this.axis == "y" || this.axis == "both") {
      this.element.style.setProperty(`--${this.propertyName}-height`, `${height}px`);
    }
    if (this.axis == "x" || this.axis == "both") {
      this.element.style.setProperty(`--${this.propertyName}-width`, `${width}px`);
    }
  }
};
__name(_SizeObserver, "SizeObserver");
let SizeObserver = _SizeObserver;
function initializeSizeObserver() {
  document.querySelectorAll("[data-js-sizeobserver]").forEach((element) => {
    const axis = element.getAttribute("data-js-sizeobserver-axis");
    const propertyName = element.getAttribute("data-js-sizeobserver");
    const includePadding = element.hasAttribute("data-js-sizeobserver-use-box-size");
    const includeFullSize = element.hasAttribute("data-js-sizeobserver-element-full-size");
    new SizeObserver(element, propertyName, axis, includePadding, includeFullSize);
  });
}
__name(initializeSizeObserver, "initializeSizeObserver");
const _BrandViewBoxManager = class _BrandViewBoxManager {
  constructor(svg, container, textElement, figureElement) {
    this.svg = svg;
    this.container = container;
    this.textElement = textElement;
    this.figureElement = figureElement;
    this.updateViewBox();
  }
  updateViewBox() {
    const textStyles = window.getComputedStyle(this.textElement);
    const containerStyles = window.getComputedStyle(this.container);
    const textWidth = parseFloat(textStyles.getPropertyValue("width"));
    const gap = parseFloat(containerStyles.getPropertyValue("gap"));
    const figureWidth = this.figureElement ? parseFloat(window.getComputedStyle(this.figureElement).getPropertyValue("width")) : 0;
    const totalWidth = !figureWidth ? Math.ceil(textWidth) : Math.ceil(figureWidth + textWidth + gap);
    this.svg.setAttribute("viewBox", `0 0 ${totalWidth} 100`);
  }
};
__name(_BrandViewBoxManager, "BrandViewBoxManager");
let BrandViewBoxManager = _BrandViewBoxManager;
function initializeBrand() {
  document.querySelectorAll(".c-brand").forEach((brandElement) => {
    const svg = brandElement.querySelector(".c-brand__viewbox");
    const container = brandElement.querySelector(".c-brand__container");
    const textElement = brandElement.querySelector(".c-brand__text");
    const figureElement = brandElement.querySelector(".c-brand__logotype");
    if (!svg || !container || !textElement) {
      return;
    }
    const img = figureElement?.querySelector("img");
    const initViewBoxManager = /* @__PURE__ */ __name(() => {
      new BrandViewBoxManager(svg, container, textElement, figureElement);
    }, "initViewBoxManager");
    if (!img || img.complete) {
      initViewBoxManager();
    } else {
      img.addEventListener("load", initViewBoxManager);
    }
  });
}
__name(initializeBrand, "initializeBrand");
var NoticeTimeout = /* @__PURE__ */ ((NoticeTimeout2) => {
  NoticeTimeout2["Session"] = "session";
  NoticeTimeout2["Permanent"] = "permanent";
  NoticeTimeout2["Immediate"] = "immediate";
  return NoticeTimeout2;
})(NoticeTimeout || {});
const _DismissableNotice = class _DismissableNotice {
  notice;
  dismissTrigger;
  uid;
  timeout;
  constructor(notice) {
    this.notice = notice;
    this.dismissTrigger = this.notice.querySelector("[data-dismissable-notice-trigger]");
    this.uid = this.notice.getAttribute("data-dismissable-notice-uid") || "";
    this.timeout = this.uid ? this.getTimeoutValue() : "immediate";
    this.init();
  }
  /**
   * Initializes the dismissable notice by setting up event listeners
   * and checking if the notice should be displayed.
   */
  init() {
    if (this.timeout !== "immediate" && !this.shouldShowNotice()) {
      this.removeNotice();
      return;
    }
    this.setupListeners();
  }
  /**
   * Sets up the event listener for the dismiss button.
   */
  setupListeners() {
    if (this.dismissTrigger) {
      this.dismissTrigger.addEventListener("click", () => this.dismiss(), { once: true });
    }
  }
  /**
   * Checks if the notice should be shown based on its timeout value
   * and the stored state in sessionStorage or localStorage.
   */
  shouldShowNotice() {
    const storage = this.getStorage();
    return this.timeout === "immediate" || !storage.getItem(this.uid);
  }
  /**
   * Dismisses the notice by storing its state in sessionStorage or localStorage
   * and removing it from the DOM.
   */
  dismiss() {
    if (this.timeout !== "immediate" && this.uid) {
      const storage = this.getStorage();
      storage.setItem(this.uid, "dismissed");
    }
    this.removeNotice();
  }
  /**
   * Removes the notice from the DOM.
   */
  removeNotice() {
    this.notice.remove();
  }
  /**
   * Returns the appropriate storage object (sessionStorage or localStorage)
   * based on the timeout value.
   */
  getStorage() {
    switch (this.timeout) {
      case "permanent":
        return localStorage;
      case "session":
      default:
        return sessionStorage;
    }
  }
  /**
   * Retrieves and validates the timeout value from the data attribute.
   */
  getTimeoutValue() {
    const timeout = this.notice.getAttribute("data-dismissable-notice-timeout");
    if (Object.values(NoticeTimeout).includes(timeout)) {
      return timeout;
    }
    return "session";
  }
};
__name(_DismissableNotice, "DismissableNotice");
let DismissableNotice = _DismissableNotice;
function initializeDismissableNotices() {
  const notices = document.querySelectorAll("[data-dismissable-notice]");
  notices.forEach((notice) => {
    new DismissableNotice(notice);
  });
}
__name(initializeDismissableNotices, "initializeDismissableNotices");
const _FileInputController = class _FileInputController {
  input;
  files = [];
  fileAddedCallbacks = [];
  fileRemovedCallbacks = [];
  constructor(input) {
    this.input = input;
    this.bindEvents();
  }
  getFiles() {
    return this.files;
  }
  getInputElement() {
    return this.input;
  }
  bindEvents = /* @__PURE__ */ __name(() => {
    this.input.addEventListener("change", () => {
      const dropzone = this.input.closest('[data-js-file="dropzone"]');
      if (!dropzone) return;
      const getMaxFiles = /* @__PURE__ */ __name(() => parseInt(dropzone.getAttribute("data-js-file-max") || "", 10) || Infinity, "getMaxFiles");
      const isMulti = dropzone.getAttribute("data-js-file-is-multi") === "1";
      const maxFiles = getMaxFiles();
      const existingFiles = this.getFiles();
      const newFiles = Array.from(this.input.files || []);
      const getRemainingSlots = /* @__PURE__ */ __name(() => isMulti ? maxFiles - existingFiles.length : existingFiles.length === 0 ? 1 : 0, "getRemainingSlots");
      const remainingSlots = getRemainingSlots();
      if (remainingSlots <= 0) {
        return;
      }
      const acceptedFiles = newFiles.slice(0, remainingSlots);
      const dataTransfer = new DataTransfer();
      acceptedFiles.forEach((file) => dataTransfer.items.add(file));
      this.input.files = dataTransfer.files;
      this.addFiles(acceptedFiles);
    });
  }, "bindEvents");
  addFiles(files) {
    files.forEach((file) => {
      if (!this.files.some((f) => this.isSameFile(f, file))) {
        this.files.push(file);
        this.triggerFileAdded(file);
      }
    });
    const dataTransfer = new DataTransfer();
    this.files.forEach((f) => dataTransfer.items.add(f));
    this.input.files = dataTransfer.files;
  }
  removeFile(file) {
    this.files = this.files.filter((f) => !this.isSameFile(f, file));
    const dataTransfer = new DataTransfer();
    this.files.forEach((f) => dataTransfer.items.add(f));
    this.input.files = dataTransfer.files;
    this.triggerFileRemoved(file);
  }
  isSameFile(a, b) {
    return a.name === b.name && a.size === b.size && a.type === b.type && a.lastModified === b.lastModified;
  }
  triggerFileAdded(file) {
    this.fileAddedCallbacks.forEach((callback) => callback(file));
  }
  triggerFileRemoved(file) {
    this.input.dispatchEvent(new Event("change"));
    this.input.dispatchEvent(new Event("input"));
    this.fileRemovedCallbacks.forEach((callback) => callback(file));
  }
  onFileAdded(callback) {
    this.fileAddedCallbacks.push(callback);
  }
  onFileRemoved(callback) {
    this.fileRemovedCallbacks.push(callback);
  }
  removeFileFromList(file) {
    this.removeFile(file);
  }
};
__name(_FileInputController, "FileInputController");
let FileInputController = _FileInputController;
function HasMaxFiles(controller, dropzone) {
  const buttons = dropzone.querySelectorAll('[data-js-file="button"], [data-js-file="drop"]');
  const maxAttr = dropzone.getAttribute("data-js-file-max");
  const maxFiles = maxAttr ? parseInt(maxAttr, 10) : Infinity;
  const isMulti = dropzone.getAttribute("data-js-file-is-multi") === "1";
  const updateLimitState = /* @__PURE__ */ __name(() => {
    const fileCount = controller.getFiles().length;
    const isAtLimit = fileCount >= maxFiles || !isMulti && fileCount > 0;
    if (isAtLimit) {
      dropzone.setAttribute("data-js-file-disabled", "true");
    } else {
      dropzone.removeAttribute("data-js-file-disabled");
    }
    dropzone.classList.toggle("is-full", isAtLimit);
    buttons.forEach((btn) => {
      btn.disabled = isAtLimit;
    });
  }, "updateLimitState");
  controller.onFileAdded(updateLimitState);
  controller.onFileRemoved(updateLimitState);
  updateLimitState();
}
__name(HasMaxFiles, "HasMaxFiles");
function FileCounter(controller, dropzone) {
  const counter = dropzone.querySelector('[data-js-file="counter"]');
  if (!counter) return;
  const maxAttr = dropzone.getAttribute("data-js-file-max");
  const maxFiles = maxAttr ? parseInt(maxAttr, 10) : Infinity;
  counter.setAttribute("data-counter-max", maxFiles.toString());
  const updateCounter = /* @__PURE__ */ __name(() => {
    const fileCount = controller.getFiles().length.toString();
    const fileCountCurrentValue = counter.getAttribute("data-counter-current");
    if (fileCountCurrentValue !== fileCount) {
      counter.classList.remove("do-animate");
      void counter.offsetWidth;
      counter.classList.add("do-animate");
    }
    counter.setAttribute("data-counter-current", fileCount);
  }, "updateCounter");
  controller.onFileAdded(updateCounter);
  controller.onFileRemoved(updateCounter);
  updateCounter();
}
__name(FileCounter, "FileCounter");
function FileInputisEmpty(controller, dropzone) {
  const updateClass = /* @__PURE__ */ __name(() => {
    const hasFiles = controller.getFiles().length > 0;
    dropzone.classList.toggle("is-empty", !hasFiles);
  }, "updateClass");
  controller.onFileAdded(updateClass);
  controller.onFileRemoved(updateClass);
  updateClass();
}
__name(FileInputisEmpty, "FileInputisEmpty");
const _Notice = class _Notice {
  constructor(field) {
    this.field = field;
    this.noticeTemplate = this.field.querySelector('[data-js-file="notice-template"]');
    this.errorMessage = this.noticeTemplate?.dataset.jsUploadErrorMessage ?? "Following files could not be uploaded";
  }
  noticeTemplate;
  notice = null;
  noticeMessageElement = null;
  noticeMessageSelector = "[data-js-notice-message]";
  errorMessage = "";
  /**
   * Show a notice with a message
   * @param message The message to display in the notice
   */
  showNotice(invalidFiles) {
    if (!this.noticeTemplate) {
      console.error("Notice template not found");
      return;
    }
    const notice = this.cloneNotice();
    const errorMessageElement = notice.querySelector(this.noticeMessageSelector);
    if (!errorMessageElement) {
      console.error(`Notice message element not found.`);
      return;
    }
    errorMessageElement.textContent = this.createErrorMessage(invalidFiles);
    this.field.prepend(notice);
    this.notice = notice;
    this.noticeMessageElement = errorMessageElement;
  }
  /**
   * Hide the notice element
   */
  hideNotice() {
    this.notice?.remove();
    this.noticeMessageElement = null;
    this.notice = null;
  }
  /**
   * Create an error message from the invalid files
   * @param invalidFiles The list of invalid files
   * @returns A formatted error message
   */
  createErrorMessage(invalidFiles) {
    const fileNames = invalidFiles.map((file) => file.name).join(", ");
    return `${this.errorMessage}: ${fileNames}`;
  }
  /**
   * Clones the notice element from the template.
   * @returns A cloned notice element from the template
   */
  cloneNotice() {
    const notice = this.noticeTemplate.content.cloneNode(true);
    return notice.firstElementChild;
  }
};
__name(_Notice, "Notice");
let Notice = _Notice;
function MaxFileSize(controller, dropzone, noticeHandler) {
  const maxFileSize = dropzone.getAttribute("data-js-file-max-size");
  if (!maxFileSize) return;
  const maxFileSizeBytes = parseFloat(maxFileSize) * 1024 * 1024;
  controller.onFileAdded((file) => {
    dropzone.classList.remove("file-size-error");
    if (file.size > maxFileSizeBytes) {
      controller.removeFileFromList(file);
      noticeHandler.showNotice([file]);
      dropzone.classList.add("file-size-error");
    }
  });
}
__name(MaxFileSize, "MaxFileSize");
const _Dropzone = class _Dropzone {
  constructor(dropzone, noticeHandler, input) {
    this.dropzone = dropzone;
    this.noticeHandler = noticeHandler;
    this.input = input;
    this.registerEvents();
  }
  dragCounter = 0;
  invalidFilesClass = "invalid-files";
  /**
   * Register drag and drop events on the dropzone
   */
  registerEvents() {
    ["dragenter", "dragover", "dragleave", "drop"].forEach((event2) => {
      this.dropzone.addEventListener(event2, (e) => e.preventDefault());
    });
    this.dropzone.addEventListener("dragenter", () => {
      this.dragCounter++;
      this.setDragging(true);
    });
    this.dropzone.addEventListener("dragleave", () => {
      this.dragCounter--;
      if (this.dragCounter <= 0) {
        this.setDragging(false);
      }
    });
    this.dropzone.addEventListener("drop", (e) => {
      this.dragCounter = 0;
      this.setDragging(false);
      this.handleDrop(e);
    });
  }
  /**
   * Set the dragging state of the dropzone
   * @param isDragging 
   */
  setDragging(isDragging) {
    this.dropzone.classList.toggle("is-dragging", isDragging);
  }
  /**
   * Handle the drop event
   * @param event 
   */
  handleDrop(event2) {
    if (!event2.dataTransfer?.files.length) {
      return;
    }
    const fileCount = this.input.files ? this.input.files.length : 0;
    const maxFiles = this.input.hasAttribute("multiple") ? Infinity : 1;
    if (fileCount >= maxFiles) {
      event2.preventDefault();
      return;
    }
    const droppedFiles = Array.from(event2.dataTransfer.files);
    const [validFiles, invalidFiles] = this.filterAcceptedFiles(droppedFiles);
    this.noticeHandler.hideNotice();
    if (invalidFiles.length) {
      this.dropzone.classList.add(this.invalidFilesClass);
      this.handleInvalidFiles(invalidFiles);
    } else {
      this.dropzone.classList.remove(this.invalidFilesClass);
    }
    if (!validFiles.length) return;
    const finalFiles = this.limitFilesByMultiple(validFiles);
    const dataTransfer = new DataTransfer();
    finalFiles.forEach((file) => dataTransfer.items.add(file));
    this.input.files = dataTransfer.files;
    const eventChange = new Event("change", { bubbles: true });
    this.input.dispatchEvent(eventChange);
  }
  handleInvalidFiles(files) {
    this.noticeHandler.showNotice(files);
  }
  filterAcceptedFiles(files) {
    const acceptAttr = this.input.accept;
    if (!acceptAttr) return [files, []];
    const acceptedTypes = acceptAttr.split(",").map((type2) => type2.trim().toLowerCase());
    const validFiles = [];
    const invalidFiles = [];
    files.forEach((file) => {
      const fileType = file.type.toLowerCase();
      const fileExt = "." + file.name.split(".").pop()?.toLowerCase();
      const isValid = acceptedTypes.some((accept) => {
        if (accept.startsWith(".")) return fileExt === accept;
        if (accept.endsWith("/*")) return fileType.startsWith(accept.replace("/*", ""));
        return fileType === accept;
      });
      if (isValid) {
        validFiles.push(file);
      } else {
        invalidFiles.push(file);
      }
    });
    return [validFiles, invalidFiles];
  }
  /**
   * Limit the number of files to be uploaded
   * @param files 
   * @returns 
   */
  limitFilesByMultiple(files) {
    return this.input.hasAttribute("multiple") ? files : files.slice(0, 1);
  }
};
__name(_Dropzone, "Dropzone");
let Dropzone = _Dropzone;
const _FileList = class _FileList {
  constructor(controller, filePreviewRenderer) {
    this.controller = controller;
    this.filePreviewRenderer = filePreviewRenderer;
  }
  /**
   * Setup the file list UI, synchronizing with the controller.
   * This includes adding and removing files from the list.
   * 
   * @returns {void}
   */
  init() {
    this.controller.onFileAdded((file) => {
      this.filePreviewRenderer.add(file);
    });
    this.controller.onFileRemoved((file) => {
      this.filePreviewRenderer.remove(file);
    });
  }
};
__name(_FileList, "FileList");
let FileList = _FileList;
const _FileIdCreator = class _FileIdCreator {
  /**
   * Create a unique ID for the file based on its properties.
   * This is used to identify files in the list.
   * 
   * @param file  File
   * @returns string
   */
  create(file) {
    const fileSignature = `${file.name}-${file.size}-${file.type}-${file.lastModified}`;
    return this.simpleHash(fileSignature);
  }
  /**
   * Generate a simple hash from the input string.
   * 
   * @param input string
   * @returns string
   */
  simpleHash(input) {
    let hash = 0;
    for (let i = 0; i < input.length; i++) {
      const char = input.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash |= 0;
    }
    return hash.toString(16);
  }
};
__name(_FileIdCreator, "FileIdCreator");
let FileIdCreator = _FileIdCreator;
const _FileNameFormatter = class _FileNameFormatter {
  /**
   * Format file name to a more readable format.
   * This includes replacing underscores and dashes with spaces,
   * and capitalizing the first letter of each word.
   * @param file string
   * @returns 
   */
  format(file) {
    const lastDot = file.lastIndexOf(".");
    const namePart = lastDot !== -1 ? file.substring(0, lastDot) : file;
    const extension = lastDot !== -1 ? file.substring(lastDot) : "";
    const cleanName = namePart.replace(/[_-]/g, " ");
    const titleCased = cleanName.normalize("NFC").replace(
      new RegExp("\\p{L}+", "gu"),
      (word) => word.charAt(0).toLocaleUpperCase() + word.slice(1)
    );
    return titleCased + extension;
  }
};
__name(_FileNameFormatter, "FileNameFormatter");
let FileNameFormatter = _FileNameFormatter;
const _FileSizeFormatter = class _FileSizeFormatter {
  /**
   * Format file size to a human-readable format.
   * This includes converting bytes to KB, MB, or GB as appropriate.
   * @param size number
   * @returns string
   */
  format(size) {
    const kb = 1024;
    const mb = kb * 1024;
    const gb = mb * 1024;
    if (size >= gb) {
      return `${(size / gb).toFixed(2)} GB`;
    }
    if (size >= mb) {
      return `${(size / mb).toFixed(2)} MB`;
    }
    if (size >= kb) {
      return `${(size / kb).toFixed(2)} KB`;
    }
    return `${size} B`;
  }
};
__name(_FileSizeFormatter, "FileSizeFormatter");
let FileSizeFormatter = _FileSizeFormatter;
const _FilePreviewCardRenderer = class _FilePreviewCardRenderer {
  constructor(list, listitemTemplate, controller, fileNameFormatter, fileSizeFormatter, fileIdCreator, previewCreator) {
    this.list = list;
    this.listitemTemplate = listitemTemplate;
    this.controller = controller;
    this.fileNameFormatter = fileNameFormatter;
    this.fileSizeFormatter = fileSizeFormatter;
    this.fileIdCreator = fileIdCreator;
    this.previewCreator = previewCreator;
  }
  fileNameTarget = '[data-js-file="filename"]';
  fileSizeTarget = '[data-js-file="filesize"]';
  removeButtonTarget = '[data-js-file="remove"]';
  listItemTarget = '[data-js-file="listitem"]';
  filePreviewTarget = '[data-js-file="preview"]';
  fileIdAttribute = "data-js-file-id";
  /**
   * Adds a file to the preview list.
   * @param {File} file - The file to be added.
   */
  add(file) {
    const [listItem, fileName, fileSize, removeButton, filePreview] = this.getCloneTemplateElements();
    if (!(listItem && fileName && fileSize && removeButton && filePreview)) {
      console.error("Failed to clone template elements for file preview list.");
      return;
    }
    listItem.setAttribute(this.fileIdAttribute, this.fileIdCreator.create(file));
    this.setFileInfo(file, fileName, fileSize);
    this.setupRemoveButton(file, removeButton);
    const previewItem = this.previewCreator.createPreview(file);
    if (!previewItem) {
      filePreview.classList.add("is-unsupported");
    } else {
      filePreview.appendChild(previewItem);
    }
    this.list.appendChild(listItem);
  }
  /**
   * Removes a file from the preview list.
   * @param {File} file - The file to be removed.
   */
  remove(file) {
    const items = this.list.querySelectorAll(this.listItemTarget);
    items.forEach((item) => {
      if (item.getAttribute(this.fileIdAttribute) === this.fileIdCreator.create(file)) {
        item.remove();
      }
    });
  }
  /**
   * Sets up the remove button for the file preview.
   * @param {File} file - The file associated with the remove button.
   * @param {HTMLButtonElement} removeButton - The button element to set up.
   */
  setupRemoveButton(file, removeButton) {
    removeButton.addEventListener("click", () => {
      this.controller.removeFileFromList(file);
    });
  }
  /**
   * Sets the file name and size in the preview.
   * @param {HTMLElement} fileName - The element to display the file name.
   * @param {HTMLElement} fileSize - The element to display the file size.
   */
  setFileInfo(file, fileName, fileSize) {
    fileName.textContent = this.fileNameFormatter.format(file.name);
    fileSize.textContent = this.fileSizeFormatter.format(file.size || file.fakeSize || 0);
  }
  /**
   * Retrieves the cloned template elements for file preview.
   * @returns {HTMLElement[]} An array containing the cloned list item, file name, file size, and remove button.
   */
  getCloneTemplateElements() {
    const fragment = this.listitemTemplate.content.cloneNode(true);
    const listItem = fragment.firstElementChild;
    const fileName = listItem?.querySelector(this.fileNameTarget);
    const fileSize = listItem?.querySelector(this.fileSizeTarget);
    const removeButton = listItem?.querySelector(this.removeButtonTarget);
    const filePreview = listItem?.querySelector(this.filePreviewTarget);
    return [listItem, fileName, fileSize, removeButton, filePreview];
  }
};
__name(_FilePreviewCardRenderer, "FilePreviewCardRenderer");
let FilePreviewCardRenderer = _FilePreviewCardRenderer;
const _FilePreviewListRenderer = class _FilePreviewListRenderer {
  constructor(list, listitemTemplate, controller, fileNameFormatter, fileSizeFormatter, fileIdCreator) {
    this.list = list;
    this.listitemTemplate = listitemTemplate;
    this.controller = controller;
    this.fileNameFormatter = fileNameFormatter;
    this.fileSizeFormatter = fileSizeFormatter;
    this.fileIdCreator = fileIdCreator;
  }
  fileNameTarget = '[data-js-file="filename"]';
  fileSizeTarget = '[data-js-file="filesize"]';
  removeButtonTarget = '[data-js-file="remove"]';
  listItemTarget = '[data-js-file="listitem"]';
  fileIdAttribute = "data-js-file-id";
  /**
   * Adds a file to the preview list.
   * @param {File} file - The file to be added.
   */
  add(file) {
    const [listItem, fileName, fileSize, removeButton] = this.getCloneTemplateElements();
    if (!(listItem && fileName && fileSize && removeButton)) {
      console.error("Failed to clone template elements for file preview list.");
      return;
    }
    listItem.setAttribute(this.fileIdAttribute, this.fileIdCreator.create(file));
    this.setFileInfo(file, fileName, fileSize);
    this.setupRemoveButton(file, removeButton);
    this.list.appendChild(listItem);
  }
  /**
   * Sets up the remove button for the file preview.
   * @param {File} file - The file associated with the remove button.
   * @param {HTMLButtonElement} removeButton - The button element to set up.
   */
  setupRemoveButton(file, removeButton) {
    removeButton.addEventListener("click", () => {
      this.controller.removeFileFromList(file);
    });
  }
  /**
   * Sets the file name and size in the preview.
   * @param {HTMLElement} fileName - The element to display the file name.
   * @param {HTMLElement} fileSize - The element to display the file size.
   */
  setFileInfo(file, fileName, fileSize) {
    fileName.textContent = this.fileNameFormatter.format(file.name);
    fileSize.textContent = this.fileSizeFormatter.format(file.size);
  }
  /**
   * Removes a file from the preview list.
   * @param {File} file - The file to be removed.
   */
  remove(file) {
    const items = this.list.querySelectorAll(this.listItemTarget);
    items.forEach((item) => {
      if (item.getAttribute(this.fileIdAttribute) === this.fileIdCreator.create(file)) {
        item.remove();
      }
    });
  }
  /**
   * Retrieves the cloned template elements for file preview.
   * @returns {HTMLElement[]} An array containing the cloned list item, file name, file size, and remove button.
   */
  getCloneTemplateElements() {
    const fragment = this.listitemTemplate.content.cloneNode(true);
    const listItem = fragment.firstElementChild;
    const fileName = listItem?.querySelector(this.fileNameTarget);
    const fileSize = listItem?.querySelector(this.fileSizeTarget);
    const removeButton = listItem?.querySelector(this.removeButtonTarget);
    return [listItem, fileName, fileSize, removeButton];
  }
};
__name(_FilePreviewListRenderer, "FilePreviewListRenderer");
let FilePreviewListRenderer = _FilePreviewListRenderer;
const _PreviewCreator = class _PreviewCreator {
  createPreview(file) {
    const fileType = file.type || "unknown";
    const url2 = file.isPlaceholder ? file.url : URL.createObjectURL(file);
    if (fileType.startsWith("image/")) {
      return this.createImagePreview(url2);
    } else if (fileType.startsWith("video/")) {
      return this.createVideoPreview(url2);
    } else if (fileType.startsWith("audio/")) {
      return this.createAudioPreview(url2);
    } else if (fileType === "application/pdf") {
      return this.createPdfPreview(url2);
    }
    return null;
  }
  createImagePreview(url2) {
    const image = document.createElement("img");
    image.src = url2;
    return image;
  }
  createVideoPreview(url2) {
    const video = document.createElement("video");
    video.src = url2;
    video.controls = true;
    return video;
  }
  createAudioPreview(url2) {
    const audio = document.createElement("audio");
    audio.src = url2;
    audio.controls = true;
    return audio;
  }
  createPdfPreview(url2) {
    const pdfFrame = document.createElement("iframe");
    pdfFrame.src = url2;
    pdfFrame.style.width = "100%";
    pdfFrame.style.height = "100%";
    pdfFrame.style.border = "none";
    return pdfFrame;
  }
};
__name(_PreviewCreator, "PreviewCreator");
let PreviewCreator = _PreviewCreator;
const _FilePreviewFactory = class _FilePreviewFactory {
  static createFilePreviewRenderer(controller, fileInput, listArea, previewTemplate) {
    const params = [
      listArea,
      previewTemplate,
      controller,
      new FileNameFormatter(),
      new FileSizeFormatter(),
      new FileIdCreator()
    ];
    if (!!fileInput.dataset.jsFilePreview) {
      return new FilePreviewCardRenderer(...params, new PreviewCreator());
    }
    return new FilePreviewListRenderer(...params);
  }
};
__name(_FilePreviewFactory, "FilePreviewFactory");
let FilePreviewFactory = _FilePreviewFactory;
const _FileInputButtonHandler = class _FileInputButtonHandler {
  constructor(input, button) {
    this.input = input;
    this.button = button;
  }
  /**
   * Setup the button to trigger the file input click event.
   */
  init() {
    let isOpeningFilePicker = false;
    this.button.addEventListener("focusout", () => {
      if (isOpeningFilePicker) {
        isOpeningFilePicker = false;
        return;
      }
      this.input.dispatchEvent(new Event("blur"));
    });
    this.button.addEventListener("click", () => {
      isOpeningFilePicker = true;
      this.button.focus();
      this.input.click();
    });
    this.input.addEventListener("focusin", (e) => {
      this.button.focus();
    });
  }
};
__name(_FileInputButtonHandler, "FileInputButtonHandler");
let FileInputButtonHandler = _FileInputButtonHandler;
const _FilePlaceholderCreator = class _FilePlaceholderCreator {
  registerController(controller, input) {
    const key = this.getInputKey(input);
    if (!key) {
      console.error("FilePreviewStore: Input element must have an id or name attribute to register controller.");
      return;
    }
    _FilePlaceholderCreator.controllers[key] = controller;
  }
  getInputKey(input) {
    return input.id || input.name || null;
  }
  getController(input) {
    const key = this.getInputKey(input);
    if (key && _FilePlaceholderCreator.controllers[key]) {
      return _FilePlaceholderCreator.controllers[key];
    }
    return null;
  }
  /**
   * Adds the global function to window object to add fake files.
   * 
   * @returns 
   */
  async addWindowFunction() {
    if (_FilePlaceholderCreator.windowFunctionInitialized) {
      return;
    }
    _FilePlaceholderCreator.windowFunctionInitialized = true;
    window.addFakeFileToInput = async (fileData, input) => {
      const controller = this.getController(input);
      if (!controller) {
        console.error("FilePlaceholderCreator: No controller registered for the provided input element.");
        return;
      }
      const fakeFile = new File([""], fileData.name, { type: fileData.type });
      fakeFile.isPlaceholder = true;
      fakeFile.id = fileData.id;
      fakeFile.url = fileData.url;
      fakeFile.fakeSize = fileData.size;
      controller.addFiles([fakeFile]);
    };
  }
};
__name(_FilePlaceholderCreator, "FilePlaceholderCreator");
__publicField(_FilePlaceholderCreator, "controllers", {});
__publicField(_FilePlaceholderCreator, "windowFunctionInitialized", false);
let FilePlaceholderCreator = _FilePlaceholderCreator;
function HasMinFiles(controller, dropzone) {
  const minAttr = dropzone.getAttribute("data-js-file-min");
  const minFiles = minAttr ? parseInt(minAttr, 10) : 0;
  const input = controller.getInputElement();
  const validationMessage = dropzone.querySelector("[data-js-upload-error-message-min-files]")?.getAttribute("data-js-upload-error-message-min-files") || "Please upload the minimum required number of files.";
  const updateLimitState = /* @__PURE__ */ __name(() => {
    const fileCount = controller.getFiles().length;
    const hasPassedRequirement = fileCount >= minFiles || minFiles === 0;
    if (!hasPassedRequirement) {
      dropzone.classList.add("has-min-files-not-met");
      input.setCustomValidity(validationMessage);
    } else {
      dropzone.classList.remove("has-min-files-not-met");
      input.setCustomValidity("");
    }
    input.dispatchEvent(new Event("blur", { bubbles: true }));
  }, "updateLimitState");
  controller.onFileAdded(updateLimitState);
  controller.onFileRemoved(updateLimitState);
}
__name(HasMinFiles, "HasMinFiles");
const _FileInput = class _FileInput {
  constructor() {
    this.initFileInputs();
  }
  initFileInputs() {
    document.querySelectorAll('[data-js-file="dropzone"]').forEach((dropzone) => {
      const [
        input,
        button,
        listArea,
        template
      ] = this.getElementsFromDropzone(dropzone);
      if (!(input && button && listArea && template)) {
        console.error("FileInput: Missing required elements in dropzone.");
        return;
      }
      const controller = new FileInputController(input);
      const globalPlaceholderCreator = new FilePlaceholderCreator();
      globalPlaceholderCreator.addWindowFunction();
      globalPlaceholderCreator.registerController(controller, input);
      if (dropzone) {
        const noticeHandler = new Notice(dropzone);
        new FileList(controller, FilePreviewFactory.createFilePreviewRenderer(
          controller,
          dropzone,
          listArea,
          template
        )).init();
        new FileInputButtonHandler(input, button).init();
        new Dropzone(dropzone, noticeHandler, input);
        MaxFileSize(controller, dropzone, noticeHandler);
        HasMaxFiles(controller, dropzone);
        HasMinFiles(controller, dropzone);
        FileCounter(controller, dropzone);
        FileInputisEmpty(controller, dropzone);
      }
    });
  }
  getElementsFromDropzone(dropzone) {
    const input = dropzone.querySelector('[data-js-file="input"]');
    const button = dropzone.querySelector('[data-js-file="button"]');
    const listArea = dropzone.querySelector('[data-js-file="list"]');
    const template = dropzone.querySelector('[data-js-file="listitem-template"]');
    return [input, button, listArea, template];
  }
};
__name(_FileInput, "FileInput");
let FileInput = _FileInput;
new DeviceDetect();
const SortInstance = new Sort();
const SplitButtonInstance = new SplitButton();
const EventCalendarInstance = new EventCalendar();
const NotificationDocInstance = new NotificationDoc();
const SidebarInstance = new Sidebar();
const SteppersInstance = new Steppers();
document.addEventListener("DOMContentLoaded", () => {
  initializePagination();
  new ButtonToggleContent();
  new SimulateClick();
  new StickyKeys();
  new Hero();
  new Tooltip();
  new KeepInViewPort();
  new ResizeByChildren();
  new AriaPressedToggler();
  new QuickLinksHeader();
  new Navbar();
  const selectComponentObserverInstance = new SelectComponentObserver();
  const NotificationInstance = new Notification();
  const DynamicSidebarInstance = new DynamicSidebar();
  new Filter();
  new Menu();
  new FileInput();
  selectComponentObserverInstance.observe();
  new ClassToggleInitializer().init();
  NotificationInstance.setup();
  SortInstance.applySort();
  SplitButtonInstance.syncSplitButton();
  EventCalendarInstance.initiateCalendar();
  NotificationDocInstance.addListener();
  SidebarInstance.applySidebar();
  DynamicSidebarInstance.applySidebar();
  SteppersInstance.enableStepper();
  initializeResizeMediaQuery();
  initializeOpenStreetMaps();
  initializeDrawerAccessibility();
  initializeForms();
  initializeMenus();
  initializeSlider();
  initializeCompressed();
  initializeGoogleTranslate();
  initializeTestimonials();
  initializeSegments();
  initializeTable();
  initializeModal();
  initializeIframeAcceptance();
  expandSection();
  setupCopy();
  setScrollbarCSS();
  AnchorMenu();
  initializeSelectFilter();
  initializeSelectSort();
  initializeMegaMenus();
  initializeExtendedDropdownMenu();
  initializeSizeObserver();
  initializeBrand();
  initializeDismissableNotices();
  moveElements(moveElement);
  initializeClickAways();
});
function extractSearchResultLinks(payload, limit = 10) {
  const links = [];
  const uniqueLinkKeys = /* @__PURE__ */ new Set();
  const addLink = /* @__PURE__ */ __name((labelCandidate, urlCandidate) => {
    if (links.length >= limit) {
      return;
    }
    if (typeof urlCandidate !== "string") {
      return;
    }
    const normalizedUrl = urlCandidate.trim();
    if (normalizedUrl === "") {
      return;
    }
    const normalizedLabel = typeof labelCandidate === "string" ? labelCandidate.trim() : String(labelCandidate ?? "").trim();
    const label = normalizedLabel !== "" ? normalizedLabel : normalizedUrl;
    const linkKey = `${label}::${normalizedUrl}`;
    if (uniqueLinkKeys.has(linkKey)) {
      return;
    }
    uniqueLinkKeys.add(linkKey);
    links.push({ label, url: normalizedUrl });
  }, "addLink");
  const tryExtractLink = /* @__PURE__ */ __name((candidate) => {
    const urlCandidate = candidate.url ?? candidate.href;
    if (urlCandidate == null) {
      return false;
    }
    const labelCandidate = candidate.label ?? candidate.name ?? candidate.title ?? candidate.value ?? candidate.slug ?? urlCandidate;
    addLink(labelCandidate, urlCandidate);
    return true;
  }, "tryExtractLink");
  const traverse = /* @__PURE__ */ __name((candidate) => {
    if (links.length >= limit || candidate == null) {
      return;
    }
    if (Array.isArray(candidate)) {
      for (const child2 of candidate) {
        traverse(child2);
        if (links.length >= limit) {
          return;
        }
      }
      return;
    }
    if (typeof candidate !== "object") {
      return;
    }
    const objectCandidate = candidate;
    if ("results" in objectCandidate && objectCandidate.results && typeof objectCandidate.results === "object") {
      traverse(objectCandidate.results);
      return;
    }
    if ("data" in objectCandidate && objectCandidate.data && typeof objectCandidate.data === "object") {
      traverse(objectCandidate.data);
      return;
    }
    if (tryExtractLink(objectCandidate)) {
      return;
    }
    for (const child2 of Object.values(objectCandidate)) {
      traverse(child2);
      if (links.length >= limit) {
        return;
      }
    }
  }, "traverse");
  traverse(payload);
  return links.slice(0, limit);
}
__name(extractSearchResultLinks, "extractSearchResultLinks");
function extractDatalistValues(payload, limit = 10) {
  const extractedLinks = extractSearchResultLinks(payload, limit);
  if (extractedLinks.length > 0) {
    return extractedLinks.map((link) => link.label);
  }
  const values = [];
  const uniqueValues = /* @__PURE__ */ new Set();
  const addValue = /* @__PURE__ */ __name((candidate) => {
    if (values.length >= limit) {
      return;
    }
    if (typeof candidate === "string" || typeof candidate === "number" || typeof candidate === "boolean") {
      const normalizedValue = String(candidate).trim();
      if (normalizedValue === "" || uniqueValues.has(normalizedValue)) {
        return;
      }
      uniqueValues.add(normalizedValue);
      values.push(normalizedValue);
    }
  }, "addValue");
  const extractFromObject = /* @__PURE__ */ __name((candidate) => {
    if ("results" in candidate && candidate.results && typeof candidate.results === "object") {
      traverse(candidate.results);
      return;
    }
    if ("data" in candidate && candidate.data && typeof candidate.data === "object") {
      traverse(candidate.data);
      return;
    }
    const prioritizedKeys = ["value", "label", "name", "title", "slug"];
    for (const key of prioritizedKeys) {
      if (key in candidate) {
        addValue(candidate[key]);
        if (values.length >= limit) {
          return;
        }
      }
    }
    for (const child2 of Object.values(candidate)) {
      traverse(child2);
      if (values.length >= limit) {
        return;
      }
    }
  }, "extractFromObject");
  const traverse = /* @__PURE__ */ __name((candidate) => {
    if (values.length >= limit || candidate == null) {
      return;
    }
    if (Array.isArray(candidate)) {
      for (const child2 of candidate) {
        traverse(child2);
        if (values.length >= limit) {
          return;
        }
      }
      return;
    }
    if (typeof candidate === "object") {
      extractFromObject(candidate);
      return;
    }
    addValue(candidate);
  }, "traverse");
  traverse(payload);
  return values.slice(0, limit);
}
__name(extractDatalistValues, "extractDatalistValues");
const _DatalistAutocomplete = class _DatalistAutocomplete {
  observer = null;
  init() {
    this.bindInputs(document);
    this.observeDomChanges();
  }
  bindInputs(root) {
    const inputs = root.querySelectorAll("input[data-datalist]");
    for (const input of Array.from(inputs)) {
      this.bindInput(input);
    }
  }
  bindInput(input) {
    if (input.dataset.datalistBound === "true") {
      return;
    }
    const endpoint = (input.dataset.datalist ?? "").trim();
    if (endpoint === "") {
      return;
    }
    const datalistId = this.resolveDatalistId(input);
    const datalistElement = this.ensureDatalistElement(input, datalistId);
    const searchResultsElement = this.ensureSearchResultsElement(input);
    const fieldInnerElement = input.closest(".c-field__inner");
    if (fieldInnerElement instanceof HTMLElement) {
      fieldInnerElement.classList.add("c-field__inner--datalist");
    }
    const minLength = Number.parseInt(input.dataset.datalistMinLength ?? "2", 10);
    const debounceMs = Number.parseInt(input.dataset.datalistDebounce ?? "180", 10);
    const maxItems = Number.parseInt(input.dataset.datalistMaxItems ?? "8", 10);
    let abortController = null;
    let debounceHandle = null;
    const execute = /* @__PURE__ */ __name(async () => {
      const query2 = input.value.trim();
      if (query2.length < minLength) {
        this.renderOptions(datalistElement, []);
        this.renderSearchResults(searchResultsElement, []);
        return;
      }
      abortController?.abort();
      abortController = new AbortController();
      try {
        const requestUrl = this.buildRequestUrl(input, endpoint, query2);
        const response = await fetch(requestUrl, {
          headers: {
            Accept: "application/json"
          },
          signal: abortController.signal
        });
        if (!response.ok) {
          this.renderOptions(datalistElement, []);
          this.renderSearchResults(searchResultsElement, []);
          return;
        }
        const payload = await response.json();
        const links = extractSearchResultLinks(payload, maxItems);
        const values = links.length > 0 ? links.map((link) => link.label) : extractDatalistValues(payload, maxItems);
        this.renderSearchResults(searchResultsElement, links);
        this.renderOptions(datalistElement, values);
      } catch {
        this.renderOptions(datalistElement, []);
        this.renderSearchResults(searchResultsElement, []);
      }
    }, "execute");
    input.addEventListener("input", () => {
      if (debounceHandle !== null) {
        window.clearTimeout(debounceHandle);
      }
      debounceHandle = window.setTimeout(() => {
        void execute();
      }, debounceMs);
    });
    input.dataset.datalistBound = "true";
    input.addEventListener("blur", () => {
      window.setTimeout(() => {
        searchResultsElement.hidden = true;
      }, 160);
    });
    input.addEventListener("focus", () => {
      if (searchResultsElement.childElementCount > 0) {
        searchResultsElement.hidden = false;
      }
    });
  }
  resolveDatalistId(input) {
    const currentListId = input.getAttribute("list");
    if (currentListId && currentListId.trim() !== "") {
      return currentListId;
    }
    const fieldName = input.getAttribute("name") || "field";
    return `datalist-${fieldName}-${Math.random().toString(36).slice(2, 10)}`;
  }
  ensureDatalistElement(input, datalistId) {
    let datalistElement = document.getElementById(datalistId);
    if (!datalistElement) {
      datalistElement = document.createElement("datalist");
      datalistElement.id = datalistId;
      const parent = input.parentElement;
      if (parent) {
        parent.appendChild(datalistElement);
      } else {
        document.body.appendChild(datalistElement);
      }
    }
    input.setAttribute("list", datalistId);
    return datalistElement;
  }
  ensureSearchResultsElement(input) {
    const fieldElement = input.closest(".c-field");
    const hostElement = fieldElement instanceof HTMLElement ? fieldElement : input.parentElement ?? document.body;
    if (fieldElement instanceof HTMLElement) {
      fieldElement.classList.add("c-field--search-results-enabled");
    }
    let resultsElement = hostElement.querySelector(".c-field__search-results");
    if (!resultsElement) {
      resultsElement = document.createElement("div");
      resultsElement.className = "c-field__search-results";
      resultsElement.hidden = true;
      hostElement.appendChild(resultsElement);
    }
    return resultsElement;
  }
  buildRequestUrl(input, endpoint, query2) {
    if (endpoint.includes("{query}")) {
      return endpoint.replace("{query}", encodeURIComponent(query2));
    }
    if (endpoint.includes("%s")) {
      return endpoint.replace("%s", encodeURIComponent(query2));
    }
    const queryParam = (input.dataset.datalistQueryParam ?? "q").trim() || "q";
    try {
      const url2 = new URL(endpoint, window.location.origin);
      url2.searchParams.set(queryParam, query2);
      return url2.toString();
    } catch {
      const separator = endpoint.includes("?") ? "&" : "?";
      return `${endpoint}${separator}${encodeURIComponent(queryParam)}=${encodeURIComponent(query2)}`;
    }
  }
  renderOptions(datalistElement, values) {
    datalistElement.innerHTML = "";
    for (const value of values) {
      const option = document.createElement("option");
      option.value = value;
      datalistElement.appendChild(option);
    }
  }
  renderSearchResults(resultsElement, links) {
    resultsElement.innerHTML = "";
    if (links.length === 0) {
      resultsElement.hidden = true;
      return;
    }
    const listElement = document.createElement("ul");
    listElement.className = "c-field__search-results-list";
    for (const link of links) {
      const itemElement = document.createElement("li");
      itemElement.className = "c-field__search-results-item";
      const anchorElement = document.createElement("a");
      anchorElement.className = "c-field__search-results-link";
      anchorElement.href = link.url;
      anchorElement.textContent = link.label;
      itemElement.appendChild(anchorElement);
      listElement.appendChild(itemElement);
    }
    resultsElement.appendChild(listElement);
    resultsElement.hidden = false;
  }
  observeDomChanges() {
    if (this.observer) {
      return;
    }
    this.observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        for (const node of Array.from(mutation.addedNodes)) {
          if (!(node instanceof HTMLElement)) {
            continue;
          }
          if (node instanceof HTMLInputElement && node.matches("input[data-datalist]")) {
            this.bindInput(node);
          }
          this.bindInputs(node);
        }
      }
    });
    this.observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }
};
__name(_DatalistAutocomplete, "DatalistAutocomplete");
let DatalistAutocomplete = _DatalistAutocomplete;
const datalistAutocomplete = new DatalistAutocomplete();
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => datalistAutocomplete.init());
} else {
  datalistAutocomplete.init();
}
const _ModifierPreview = class _ModifierPreview {
  constructor(el, format2, selects, previewEl, outputEl, baseClass) {
    this.el = el;
    this.format = format2;
    this.selects = selects;
    this.previewEl = previewEl;
    this.outputEl = outputEl;
    this.baseClass = baseClass;
  }
  composeClass(values) {
    let cls = this.format.replace(/^\./, "");
    for (const [key, value] of Object.entries(values)) {
      cls = cls.split(`{${key}}`).join(value);
    }
    return cls;
  }
  update() {
    const values = {};
    for (const select of this.selects) {
      const key = select.dataset.modifierKey;
      if (key) {
        values[key] = select.value;
      }
    }
    const cls = this.composeClass(values);
    this.previewEl.className = [this.baseClass, cls].filter(Boolean).join(" ");
    this.previewEl.setAttribute("style", "outline: 2px dashed currentColor; outline-offset: 4px; min-height: 5rem;");
    if (this.outputEl) {
      this.outputEl.textContent = cls ? `.${cls}` : "";
    }
  }
  init() {
    for (const select of this.selects) {
      select.addEventListener("change", () => this.update());
    }
    this.update();
  }
};
__name(_ModifierPreview, "ModifierPreview");
let ModifierPreview = _ModifierPreview;
function initModifierPreviews() {
  document.querySelectorAll("[data-modifier-preview]").forEach((el) => {
    const format2 = el.dataset.format;
    if (!format2) return;
    const selects = Array.from(el.querySelectorAll("select[data-modifier-key]"));
    const previewEl = el.querySelector("[data-preview-element]");
    const outputEl = el.querySelector("[data-applied-class]");
    if (!previewEl) return;
    const baseClass = previewEl.dataset.baseClass ?? "";
    new ModifierPreview(el, format2, selects, previewEl, outputEl, baseClass).init();
  });
}
__name(initModifierPreviews, "initModifierPreviews");
document.addEventListener("DOMContentLoaded", initModifierPreviews);
//# sourceMappingURL=styleguide-js.js.map
