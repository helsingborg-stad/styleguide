var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
var _a;
import { i as isLocalStoragePersistenceEnabled, T as TokenOverrideLocalStorageStore } from "../TokenOverrideLocalStorageStore.js";
if (isLocalStoragePersistenceEnabled(document.documentElement)) {
  const overrides = new TokenOverrideLocalStorageStore().load();
  for (const [prop, value] of Object.entries(overrides)) {
    document.documentElement.style.setProperty(prop, value);
  }
}
const init$8 = /* @__PURE__ */ __name(() => {
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
}, "init$8");
(() => {
  addEventListener("DOMContentLoaded", init$8);
})();
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
    window.addEventListener("resize", debounce$1(elementPositions, 300, sectionElements));
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
const debounce$1 = /* @__PURE__ */ __name((func, delay, sectionElements) => {
  let timer;
  func(sectionElements);
  return () => {
    timer ? clearTimeout(timer) : /* @__PURE__ */ (() => {
    })();
    timer = setTimeout(() => {
      func(sectionElements);
    }, delay);
  };
}, "debounce$1");
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
        (event) => this.handleToggleClick(toggle2, event)
      );
    });
  }
  handleToggleClick = /* @__PURE__ */ __name((toggle2, event) => {
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
              (event) => this.handleToggleClick(toggle2, event)
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
  trigger;
  id;
  groupId;
  /**
   * Sets the event listener on the trigger element to handle toggle actions.
   */
  setToggleListener() {
    this.trigger.addEventListener("click", (event) => {
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
const CONTAINER$1 = "[js-expand-container]";
const BUTTON = "[js-expand-button]";
const EXPANDED = "aria-expanded";
const CONTROLS = "aria-controls";
const HIDDEN = "aria-hidden";
const setMarginEventListener = /* @__PURE__ */ __name(() => {
  window.addEventListener("resize", debounce(setMarginVariable, 2e3));
}, "setMarginEventListener");
const setMarginVariable = /* @__PURE__ */ __name((root, header) => {
  root.style.setProperty("--c-accordion-scroll-margin", header.offsetHeight + 20 + "px");
}, "setMarginVariable");
const debounce = /* @__PURE__ */ __name((func, delay) => {
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
}, "debounce");
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
        const multiSelect = input.closest(".c-select--multiselect");
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
        const containsInvalid = [];
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
    const checkInputs = [];
    const submitButton = this.form.querySelector('[type="submit"]');
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
    const submitButton = this.form.querySelector('[type="submit"]');
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
const TEMPORAL_INPUT_TYPES = ["date", "time", "datetime-local", "month", "week"];
function initializePickerIcons() {
  document.addEventListener("click", (e) => {
    const icon = e.target.closest(".c-field__icon");
    if (!icon) return;
    const inner = icon.closest(".c-field__inner");
    if (!inner) return;
    const input = inner.querySelector("input");
    if (!input || !TEMPORAL_INPUT_TYPES.includes(input.type)) return;
    if (typeof input.showPicker === "function") {
      input.showPicker();
    } else {
      input.focus();
    }
  });
}
__name(initializePickerIcons, "initializePickerIcons");
initializePickerIcons();
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
  static resizeEvent(event) {
    _KeepInViewPort.moveInsideViewPort(event.target, 8);
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
    const observer = new MutationObserver((event) => {
      count++;
      this.removeFirst(targetNode);
      event.forEach((record) => {
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
  setClasses(event) {
    if (event.boundingClientRect.top <= 0) {
      event.target.classList.add("is-stuck");
    } else {
      event.target.classList.remove("is-stuck");
    }
  }
};
__name(_QuickLinksHeader, "QuickLinksHeader");
let QuickLinksHeader = _QuickLinksHeader;
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
        button.addEventListener("click", (event) => {
          this.appendSortable(container, dataId);
        });
      });
    });
  }
};
__name(_Sort, "Sort");
let Sort = _Sort;
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
      input.addEventListener("keydown", (event) => {
        if (event.code !== "Backspace" && !event.shiftKey && !event.ctrlKey && !event.altKey && !event.metaKey) {
          if (event.repeat) {
            this.handleInput(event, 2e3);
          }
          if (!event.repeat && arr.pop() === event.key) {
            this.handleInput(event, 500);
          }
        }
        arr.push(event.key);
      });
    });
  }
  handleInput(event, delay) {
    if (!this.timeStamp) {
      this.timeStamp = event.timeStamp - 600;
    }
    if (event.timeStamp >= this.timeStamp + delay) {
      this.timeStamp = event.timeStamp;
    } else {
      event.preventDefault();
    }
  }
};
__name(_StickyKeys, "StickyKeys");
let StickyKeys = _StickyKeys;
const setScrollbarCSS = /* @__PURE__ */ __name(() => {
  const body = document.querySelector("body");
  if (!body) return;
  const viewportWidth = window.innerWidth - document.documentElement.clientWidth;
  const scrollbar = Math.min(viewportWidth, 15);
  body.setAttribute("style", `--scrollbar: ${scrollbar}px`);
}, "setScrollbarCSS");
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
const _ClickAway = class _ClickAway {
  constructor(element, classesToRemove, removePressed) {
    this.element = element;
    this.classesToRemove = classesToRemove;
    this.removePressed = removePressed;
  }
  element;
  classesToRemove;
  removePressed;
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
  button;
  drawer;
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
    this.drawer.addEventListener("DOMNodeInserted", (event) => {
      const target = event.target;
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
const _ExtendedDropdownMenu = class _ExtendedDropdownMenu {
  constructor(parentContainer, titleElement, triggerElement) {
    this.parentContainer = parentContainer;
    this.titleElement = titleElement;
    this.triggerElement = triggerElement;
  }
  parentContainer;
  titleElement;
  triggerElement;
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
  field;
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
  dropzone;
  noticeHandler;
  input;
  dragCounter = 0;
  invalidFilesClass = "invalid-files";
  /**
   * Register drag and drop events on the dropzone
   */
  registerEvents() {
    ["dragenter", "dragover", "dragleave", "drop"].forEach((event) => {
      this.dropzone.addEventListener(event, (e) => e.preventDefault());
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
  handleDrop(event) {
    if (!event.dataTransfer?.files.length) {
      return;
    }
    const fileCount = this.input.files ? this.input.files.length : 0;
    const maxFiles = this.input.hasAttribute("multiple") ? Infinity : 1;
    if (fileCount >= maxFiles) {
      event.preventDefault();
      return;
    }
    const droppedFiles = Array.from(event.dataTransfer.files);
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
    const acceptedTypes = acceptAttr.split(",").map((type) => type.trim().toLowerCase());
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
  controller;
  filePreviewRenderer;
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
  list;
  listitemTemplate;
  controller;
  fileNameFormatter;
  fileSizeFormatter;
  fileIdCreator;
  previewCreator;
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
  list;
  listitemTemplate;
  controller;
  fileNameFormatter;
  fileSizeFormatter;
  fileIdCreator;
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
  input;
  button;
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
const moveElement = /* @__PURE__ */ __name((element, target) => {
  target.appendChild(element);
}, "moveElement");
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
const _MegaMenu = class _MegaMenu {
  constructor(megaMenu, triggers) {
    this.megaMenu = megaMenu;
    this.triggers = triggers;
    this.setupListeners();
  }
  megaMenu;
  triggers;
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
  handleClickOutside(event) {
    if (!this.isOpen) return;
    const target = event.target;
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
    this.handleContainerClickBound = (event) => this.handleContainerClick(event);
    this.handleKeyboardNavigationBound = (event) => this.handleKeyboardNavigation(event);
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
  handleContainerClick(event) {
    const trigger = event.target instanceof Element ? event.target.closest("[data-next], [data-prev]") : null;
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
  handleKeyboardNavigation(event) {
    if (!this.container || !this.isModalOpen()) {
      return;
    }
    if (event.key === "ArrowRight") {
      this.imageData = this.cycleImage("next");
    }
    if (event.key === "ArrowLeft") {
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
    this.handleDocumentClickBound = (event) => this.handleDocumentClick(event);
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
      dialog.addEventListener("click", (event) => this.handleClickOutside(event));
      dialog.dataset.modalBound = "true";
    }
  }
  handleDocumentClick(event) {
    const trigger = event.target?.closest("[data-open], [data-close]");
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
        event.stopPropagation();
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
    element.addEventListener("click", (event) => {
      if (event.target instanceof HTMLElement) {
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
  selectContainer;
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
  selectSort;
  sortContainer;
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
  element;
  propertyName;
  axis;
  includePadding;
  includeFullSize;
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
new DeviceDetect();
const SortInstance = new Sort();
const SplitButtonInstance = new SplitButton();
const NotificationDocInstance = new NotificationDoc();
const NotificationInstance = new Notification();
const DynamicSidebarInstance = new DynamicSidebar();
const SteppersInstance = new Steppers();
document.addEventListener("DOMContentLoaded", () => {
  new ButtonToggleContent();
  new SimulateClick();
  new StickyKeys();
  new KeepInViewPort();
  new ResizeByChildren();
  new AriaPressedToggler();
  new QuickLinksHeader();
  new DynamicSidebar();
  new Filter();
  new FileInput();
  new ClassToggleInitializer().init();
  NotificationInstance.setup();
  SortInstance.applySort();
  SplitButtonInstance.syncSplitButton();
  NotificationDocInstance.addListener();
  DynamicSidebarInstance.applySidebar();
  SteppersInstance.enableStepper();
  initializeResizeMediaQuery();
  initializeDrawerAccessibility();
  initializeForms();
  initializeCompressed();
  initializeGoogleTranslate();
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
  initializeDismissableNotices();
  moveElements(moveElement);
  initializeClickAways();
});
const _BrandViewBoxManager = class _BrandViewBoxManager {
  constructor(svg, container, textElement, figureElement) {
    this.svg = svg;
    this.container = container;
    this.textElement = textElement;
    this.figureElement = figureElement;
    this.updateViewBox();
  }
  svg;
  container;
  textElement;
  figureElement;
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
function init$7() {
  document.addEventListener("DOMContentLoaded", () => {
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
  });
}
__name(init$7, "init$7");
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
const _Hero = class _Hero {
  heroVideos;
  isReduced;
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
function init$6() {
  document.addEventListener("DOMContentLoaded", () => {
    new Hero();
  });
}
__name(init$6, "init$6");
const scriptRel = "modulepreload";
const assetsURL = /* @__PURE__ */ __name(function(dep) {
  return "/" + dep;
}, "assetsURL");
const seen = {};
const __vitePreload = /* @__PURE__ */ __name(function preload(baseModule, deps, importerUrl) {
  let promise = Promise.resolve();
  if (deps && deps.length > 0) {
    let allSettled = function(promises$2) {
      return Promise.all(promises$2.map((p) => Promise.resolve(p).then((value$1) => ({
        status: "fulfilled",
        value: value$1
      }), (reason) => ({
        status: "rejected",
        reason
      }))));
    };
    __name(allSettled, "allSettled");
    document.getElementsByTagName("link");
    const cspNonceMeta = document.querySelector("meta[property=csp-nonce]");
    const cspNonce = cspNonceMeta?.nonce || cspNonceMeta?.getAttribute("nonce");
    promise = allSettled(deps.map((dep) => {
      dep = assetsURL(dep);
      if (dep in seen) return;
      seen[dep] = true;
      const isCss = dep.endsWith(".css");
      const cssSelector = isCss ? '[rel="stylesheet"]' : "";
      if (document.querySelector(`link[href="${dep}"]${cssSelector}`)) return;
      const link = document.createElement("link");
      link.rel = isCss ? "stylesheet" : scriptRel;
      if (!isCss) link.as = "script";
      link.crossOrigin = "";
      link.href = dep;
      if (cspNonce) link.setAttribute("nonce", cspNonce);
      document.head.appendChild(link);
      if (isCss) return new Promise((res, rej) => {
        link.addEventListener("load", res);
        link.addEventListener("error", () => rej(/* @__PURE__ */ new Error(`Unable to preload CSS for ${dep}`)));
      });
    }));
  }
  function handlePreloadError(err$2) {
    const e$1 = new Event("vite:preloadError", { cancelable: true });
    e$1.payload = err$2;
    window.dispatchEvent(e$1);
    if (!e$1.defaultPrevented) throw err$2;
  }
  __name(handlePreloadError, "handlePreloadError");
  return promise.then((res) => {
    for (const item of res || []) {
      if (item.status !== "rejected") continue;
      handlePreloadError(item.reason);
    }
    return baseModule().catch(handlePreloadError);
  });
}, "preload");
const _MapFactory = class _MapFactory {
  /**
   * Creates a map instance for the specified provider using the provided arguments.
   * If the provider's factory has not been loaded yet, it dynamically imports
   * the module and initializes the factory before creating the map instance.
   *
   * @param provider - The name of the map provider (e.g., "openstreetmap").
   * @param args     - Configuration arguments required to create the map instance.
   * @returns A promise that resolves to the created map instance.
   */
  static async create(provider, args) {
    const key = provider.toLowerCase();
    if (!_MapFactory.providers[key]) {
      switch (key) {
        case "openstreetmap":
        default: {
          const module = await __vitePreload(() => import("../openstreetmapFactory.js"), true ? [] : void 0);
          _MapFactory.providers[key] = new module.default();
          break;
        }
      }
    }
    return _MapFactory.providers[key].create(args);
  }
};
__name(_MapFactory, "MapFactory");
__publicField(_MapFactory, "providers", {});
let MapFactory = _MapFactory;
function init$5() {
  document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll("[data-js-map]").forEach((mapContainer) => {
      const id = mapContainer.getAttribute("data-js-map");
      const provider = mapContainer.getAttribute("data-js-map-provider");
      const mapStyle = mapContainer.getAttribute("data-js-map-style");
      const lat = mapContainer.getAttribute("data-js-map-lat");
      const lng = mapContainer.getAttribute("data-js-map-lng");
      const zoom = mapContainer.getAttribute("data-js-map-zoom");
      const markers = mapContainer.getAttribute("data-js-map-markers");
      if (!id || !provider || !lat || !lng) {
        console.warn("Map element is missing required attributes: data-js-map and data-js-map-provider");
        return;
      }
      const args = {
        container: mapContainer,
        id,
        lat,
        lng,
        style: mapStyle,
        zoom,
        markers
      };
      MapFactory.create(provider, args);
    });
  });
}
__name(init$5, "init$5");
const _Nav = class _Nav {
  targetItemSelector;
  constructor(menu) {
    this.targetItemSelector = ".c-nav__item.has-children.has-toggle";
    const selectorArray = [this.targetItemSelector, "> .c-nav__item-wrapper"];
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
function init$4() {
  document.addEventListener("DOMContentLoaded", () => {
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
  });
}
__name(init$4, "init$4");
let Pagination$1 = (_a = class {
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
    _a.instances.set(instanceId, this);
  }
  static getInstance(instanceId) {
    return _a.instances.get(instanceId);
  }
  setupSortListener() {
    const sortElement = this.container.querySelector("[data-js-pagination-sort] select");
    if (!sortElement) return;
    const lists = this.createSortedArrays();
    const event = new Event("change");
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
    sortElement.dispatchEvent(event);
  }
  createSortedArrays() {
    const alphabetical = [...this.container.querySelectorAll(`[data-js-pagination-item]`)].sort((a, b) => {
      const titleA = a.getAttribute("data-js-pagination-item-title") || "";
      const titleB = b.getAttribute("data-js-pagination-item-title") || "";
      return titleA.localeCompare(titleB);
    });
    const random = [...this.container.querySelectorAll(`[data-js-pagination-item]`)].sort(() => Math.random() - 0.5);
    return { alphabetical, random, default: this.list };
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
      perPage: perPage ? parseInt(perPage) : 10,
      maxPages: maxPages ? parseInt(maxPages) : 0,
      randomize,
      keepDOM
    };
  }
  tableRefresh() {
    const list = this.paginateList(this.list);
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
        const next = e.target?.closest(`[${this.indexLinks}]`).getAttribute(this.indexLinks);
        next && this.paginateSetCurrent(parseInt(next));
        this.tableRefresh();
        this.scrollToTop();
        this.setFocus();
      });
    });
  }
  scrollToTop() {
    const offset = document.querySelector(".c-header--sticky") ? 100 : 0;
    const elementPosition = this.container?.getBoundingClientRect().top ?? 0;
    const offsetPosition = elementPosition + window.pageYOffset - offset;
    window.scrollTo({
      top: offsetPosition
    });
  }
  setFocus() {
    const element = this.listContainer?.querySelector("[data-js-pagination-item]:first-child");
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
}, __name(_a, "Pagination"), __publicField(_a, "instances", /* @__PURE__ */ new Map()), _a);
function init$3() {
  document.addEventListener("DOMContentLoaded", () => {
    const paginations = [...document.querySelectorAll("[data-js-pagination-target]")];
    paginations.forEach((pagination, index) => {
      new Pagination$1(pagination, index + 1);
    });
  });
}
__name(init$3, "init$3");
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
    this.actionOverlayElement.addEventListener("keydown", (event) => this.openDropdownOnSpacebar(event));
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
  selectOptionOnDropdownOptionElementKeyDown(event) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      event.target.click();
    }
  }
  openDropdownOnSpacebar(event) {
    if (event.key === " ") {
      event.preventDefault();
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
    this.actionOverlayElement.textContent = placeholderText ? placeholderText : this.placeholderText;
  }
  updateSelectedItemsListeners(updatedVisualOptionsList = false) {
    const visualOptionsList = updatedVisualOptionsList ? updatedVisualOptionsList : this.getVisualOptionsList();
    if (visualOptionsList.length) {
      visualOptionsList.forEach((optionElement) => {
        optionElement.addEventListener("click", () => this.selectOptionOnElementClick(optionElement));
        optionElement.addEventListener("keydown", (event) => this.selectOptionOnDropdownOptionElementKeyDown(event));
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
              const selects = [...node.querySelectorAll(`[${this.selectComponentElementAttribute}]`)];
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
function init$2() {
  document.addEventListener("DOMContentLoaded", () => {
    const selectComponentObserverInstance = new SelectComponentObserver();
    selectComponentObserverInstance.observe();
  });
}
__name(init$2, "init$2");
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
function typeOf(type, subject) {
  return typeof subject === type;
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
    forEachEvent(targets, events, function(target, event, namespace) {
      var isEventTarget = "addEventListener" in target;
      var remover = isEventTarget ? target.removeEventListener.bind(target, event, callback, options) : target["removeListener"].bind(target, callback);
      isEventTarget ? target.addEventListener(event, callback, options) : target["addListener"](callback);
      listeners.push([target, event, namespace, callback, remover]);
    });
  }
  __name(bind, "bind");
  function unbind(targets, events, callback) {
    forEachEvent(targets, events, function(target, event, namespace) {
      listeners = listeners.filter(function(listener) {
        if (listener[0] === target && listener[1] === event && listener[2] === namespace && (!callback || listener[3] === callback)) {
          listener[4]();
          return false;
        }
        return true;
      });
    });
  }
  __name(unbind, "unbind");
  function dispatch(target, type, detail) {
    var e;
    var bubbles = true;
    if (typeof CustomEvent === "function") {
      e = new CustomEvent(type, {
        bubbles,
        detail
      });
    } else {
      e = document.createEvent("CustomEvent");
      e.initCustomEvent(type, bubbles, false, detail);
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
  function emit(event) {
    binder.dispatch(bus, event, slice(arguments, 1));
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
  var event = EventInterface(Splide2);
  var on = event.on, emit = event.emit, bind = event.bind;
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
    event.destroy();
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
  var event = EventInterface(Splide2);
  var on = event.on;
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
    event.destroy();
  }
  __name(destroy, "destroy");
  function observe() {
    var count = computeCloneCount();
    if (cloneCount !== count) {
      if (cloneCount < count || !count) {
        event.emit(EVENT_REFRESH);
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
  var event = EventInterface(Splide2);
  var on = event.on, bind = event.bind, emit = event.emit;
  var classes = options.classes, i18n = options.i18n;
  var Elements2 = Components2.Elements, Controller2 = Components2.Controller;
  var placeholder = Elements2.arrows, track = Elements2.track;
  var wrapper = placeholder;
  var prev = Elements2.prev;
  var next = Elements2.next;
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
    if (enabled && !(prev && next)) {
      createArrows();
    }
    if (prev && next) {
      assign(arrows, {
        prev,
        next
      });
      display(wrapper, enabled ? "" : "none");
      addClass(wrapper, wrapperClasses = CLASS_ARROWS + "--" + options.direction);
      if (enabled) {
        listen();
        update();
        setAttribute([prev, next], ARIA_CONTROLS, track.id);
        emit(EVENT_ARROWS_MOUNTED, prev, next);
      }
    }
  }
  __name(init2, "init");
  function destroy() {
    event.destroy();
    removeClass(wrapper, wrapperClasses);
    if (created) {
      remove(placeholder ? [prev, next] : wrapper);
      prev = next = null;
    } else {
      removeAttribute([prev, next], ALL_ATTRIBUTES);
    }
  }
  __name(destroy, "destroy");
  function listen() {
    on([EVENT_MOUNTED, EVENT_MOVED, EVENT_REFRESH, EVENT_SCROLLED, EVENT_END_INDEX_CHANGED], update);
    bind(next, "click", apply(go, ">"));
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
    next = createArrow(false);
    created = true;
    append(wrapper, [prev, next]);
    !placeholder && before(wrapper, track);
  }
  __name(createArrows, "createArrows");
  function createArrow(prev2) {
    var arrow = '<button class="' + classes.arrow + " " + (prev2 ? classes.prev : classes.next) + '" type="button"><svg xmlns="' + XML_NAME_SPACE + '" viewBox="0 0 ' + SIZE + " " + SIZE + '" width="' + SIZE + '" height="' + SIZE + '" focusable="false"><path d="' + (options.arrowPath || PATH) + '" />';
    return parseHtml(arrow);
  }
  __name(createArrow, "createArrow");
  function update() {
    if (prev && next) {
      var index = Splide2.index;
      var prevIndex = Controller2.getPrev();
      var nextIndex = Controller2.getNext();
      var prevLabel = prevIndex > -1 && index < prevIndex ? i18n.last : i18n.prev;
      var nextLabel = nextIndex > -1 && index > nextIndex ? i18n.first : i18n.next;
      prev.disabled = prevIndex < 0;
      next.disabled = nextIndex < 0;
      setAttribute(prev, ARIA_LABEL, prevLabel);
      setAttribute(next, ARIA_LABEL, nextLabel);
      emit(EVENT_ARROWS_UPDATED, prev, next, prevIndex, nextIndex);
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
function Pagination(Splide2, Components2, options) {
  var event = EventInterface(Splide2);
  var on = event.on, emit = event.emit, bind = event.bind;
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
    event.destroy();
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
__name(Pagination, "Pagination");
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
    events.forEach(function(event) {
      event.destroy();
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
    var event = EventInterface(splide);
    event.on(EVENT_MOVE, function(index, prev, dest) {
      target.go(target.is(LOOP) ? dest : index);
    });
    events.push(event);
  }
  __name(sync, "sync");
  function navigate() {
    var event = EventInterface(Splide2);
    var on = event.on;
    on(EVENT_CLICK, onClick);
    on(EVENT_SLIDE_KEYDOWN, onKeydown);
    on([EVENT_MOUNTED, EVENT_UPDATED], update);
    events.push(event);
    event.emit(EVENT_NAVIGATION_MOUNTED, Splide2.splides);
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
  Pagination,
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
  _proto.emit = /* @__PURE__ */ __name(function emit(event) {
    var _this$event;
    (_this$event = this.event).emit.apply(_this$event, [event].concat(slice(arguments, 1)));
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
  _proto.is = /* @__PURE__ */ __name(function is(type) {
    return this._o.type === type;
  }, "is");
  _proto.refresh = /* @__PURE__ */ __name(function refresh() {
    this.emit(EVENT_REFRESH);
    return this;
  }, "refresh");
  _proto.destroy = /* @__PURE__ */ __name(function destroy(completely) {
    if (completely === void 0) {
      completely = true;
    }
    var event = this.event, state = this.state;
    if (state.is(CREATED)) {
      EventInterface(this).on(EVENT_READY, this.destroy.bind(this, completely));
    } else {
      forOwn(this._C, function(component) {
        component.destroy && component.destroy(completely);
      }, true);
      event.emit(EVENT_DESTROY);
      event.destroy();
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
      autoWidth: this.sliderAttributes.perPage === 1 ? true : false,
      perPage: this.sliderAttributes.perPage,
      perMove: this.sliderAttributes.perMove,
      focus: slider.hasAttribute("data-slider-focus-center") ? "center" : 0,
      gap: this.sliderAttributes.gap,
      padding: this.sliderAttributes.padding,
      autoplay: Boolean(autoPlay) && (!mediaQuery || !mediaQuery.matches),
      interval: autoPlay ? autoPlay * 1e3 : 5e3,
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
    const padding = parseInt(this.sliderElement.getAttribute("data-slider-padding") || "0", 10);
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
function init$1() {
  document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".c-slider").forEach((slider) => {
      new Slider(slider);
    });
  });
}
__name(init$1, "init$1");
const _Table = class _Table {
  table;
  list;
  isFilterable;
  isSortable;
  isMultidimensional;
  hasSumRow;
  tableInner;
  tableTable;
  indicatorContainer;
  indicatorInput;
  updateOnScrollFunc;
  handleMouseMoveFunc;
  handleMouseUpFunc;
  resizeObserver = null;
  initialCursorPosition = 0;
  constructor(table) {
    this.table = table;
    this.list = table.querySelectorAll("[js-table-filter-item]");
    this.isFilterable = table.hasAttribute("js-table-filter");
    this.isSortable = table.hasAttribute("js-table-sort");
    this.isMultidimensional = table.classList.contains("c-table--multidimensional");
    this.hasSumRow = this.table.hasAttribute("table-sum");
    this.tableInner = table.querySelector(".c-table__inner");
    this.tableTable = table.querySelector(".c-table__table");
    this.indicatorContainer = this.table.querySelector(".c-table__scroll-indicator-wrapper");
    this.indicatorInput = this.table.querySelector(".c-table__scroll-indicator");
    this.updateOnScrollFunc = () => this.updateOnScroll();
    this.handleMouseMoveFunc = (event) => this.handleMouseMove(event);
    this.handleMouseUpFunc = (event) => this.handleMouseUp(event);
    if (this.indicatorInput) {
      this.indicatorInput.style.marginLeft = "0px";
    }
    if (this.isFilterable) this.filterInput();
    if (this.isSortable) this.sortAddButtons();
    if (this.isMultidimensional) this.addCollapsibleEvent();
    this.setupResizeObserver();
    this.slider();
    this.tableRefresh();
  }
  addCollapsibleEvent() {
    const collapseButton = this.table.querySelector(".c-table__collapse-button");
    collapseButton?.addEventListener("click", () => {
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
    this.renderTable(list);
  }
  renderTable(list) {
    const body = this.table.querySelector("tbody");
    if (!body) {
      return;
    }
    body.innerHTML = "";
    body.append(...list);
  }
  filterInput() {
    const input = this.table.querySelector("[js-table-filter-input]");
    input?.addEventListener("input", () => {
      this.tableRefresh();
    });
  }
  filterList(list, query2) {
    const rows = this.hasSumRow ? list.slice(0, -1) : list;
    const sumRow = this.hasSumRow ? list[list.length - 1] : null;
    const lowerQuery = query2.toLowerCase();
    const filtered = rows.filter((element) => {
      const data = Array.from(element.querySelectorAll("[js-table-filter-data]")).map((item) => item.textContent?.toLowerCase() ?? "").join("");
      return data.includes(lowerQuery);
    });
    if (sumRow) {
      filtered.push(sumRow);
    }
    return filtered;
  }
  compare(a, b) {
    return a.localeCompare(b, "en", { numeric: true, sensitivity: "base" });
  }
  sortList(list) {
    const sortOrder = this.table.getAttribute("js-table-sort--order");
    if (!sortOrder) {
      return list;
    }
    const sortableRows = [...list];
    let sumRow;
    if (this.hasSumRow) {
      sumRow = sortableRows.pop();
    }
    const sortDictator = this.table.getAttribute("js-table-sort--dictator");
    if (!sortDictator) {
      if (sumRow) {
        sortableRows.push(sumRow);
      }
      return sortableRows;
    }
    sortableRows.sort((rowA, rowB) => {
      const firstValue = this.getSortValue(rowA, sortDictator);
      const secondValue = this.getSortValue(rowB, sortDictator);
      return this.compare(firstValue, secondValue);
    });
    if (sortOrder === "desc") {
      sortableRows.reverse();
    }
    if (sumRow) {
      sortableRows.push(sumRow);
    }
    return sortableRows;
  }
  sortAddButtons() {
    const sortButtons = this.table.querySelectorAll("[js-table-sort--btn]");
    sortButtons.forEach((sortButton, index) => {
      if (!sortButton.hasAttribute("js-table-sort--order")) {
        sortButton.setAttribute("js-table-sort--order", "asc");
      }
      if (this.isSortable && this.isMultidimensional && index === 0) {
        sortButton.removeAttribute("js-table-sort--order");
        return;
      }
      sortButton.addEventListener("click", (event) => {
        const sortOrder = this.table.getAttribute("js-table-sort--order");
        const newOrder = sortOrder === "asc" ? "desc" : "asc";
        const buttonElement = event.currentTarget;
        this.table.setAttribute("js-table-sort--order", newOrder);
        const dataId = buttonElement?.getAttribute("js-table-sort--btn");
        if (!dataId) {
          return;
        }
        this.table.setAttribute("js-table-sort--dictator", dataId);
        this.tableRefresh();
      });
    });
  }
  filterValue() {
    return this.table.querySelector("[js-table-filter-input]")?.value ?? "";
  }
  slider() {
    if (!this.indicatorInput || !this.tableInner) {
      return;
    }
    this.indicatorInput.addEventListener("mousedown", (event) => {
      event.preventDefault();
      this.initialCursorPosition = event.clientX;
      this.tableInner?.removeEventListener("scroll", this.updateOnScrollFunc, false);
      window.addEventListener("mousemove", this.handleMouseMoveFunc, false);
      window.addEventListener("mouseup", this.handleMouseUpFunc, false);
    });
  }
  updateOnScroll() {
    if (!this.tableInner || !this.indicatorInput) {
      return;
    }
    const scrolledPixels = this.tableInner.scrollLeft;
    const tableLineWidth = this.tableInner.querySelector(".c-table__line")?.offsetWidth ?? 0;
    if (tableLineWidth === 0) {
      this.indicatorInput.style.marginLeft = "0px";
      return;
    }
    this.indicatorInput.style.marginLeft = `${scrolledPixels / tableLineWidth * 100}%`;
  }
  handleMouseMove(event) {
    if (!this.indicatorContainer || !this.indicatorInput || !this.tableInner || !this.tableTable) {
      return;
    }
    event.preventDefault();
    const scrollMax = this.indicatorContainer.offsetWidth - this.indicatorInput.offsetWidth;
    const inner = this.tableInner;
    const mouseMovedAmount = event.clientX - this.initialCursorPosition;
    const scrolledAmount = this.indicatorInput.getBoundingClientRect().left - this.indicatorContainer.getBoundingClientRect().left;
    if (scrolledAmount <= 0 && !(scrolledAmount + mouseMovedAmount > 0)) {
      this.indicatorInput.style.marginLeft = "0px";
      this.initialCursorPosition = event.clientX;
      inner.scrollLeft = 0;
    } else if (scrolledAmount >= scrollMax && !(scrolledAmount + mouseMovedAmount <= scrollMax)) {
      this.indicatorInput.style.marginLeft = `${scrollMax}px`;
    } else {
      const amountOfOverflow = this.tableTable.offsetWidth - inner.offsetWidth;
      const indicatorPosition = Number.parseInt(this.indicatorInput.style.marginLeft || "0", 10) || 0;
      this.indicatorInput.style.marginLeft = `${indicatorPosition + mouseMovedAmount}px`;
      this.initialCursorPosition = event.clientX;
      inner.scrollLeft = amountOfOverflow * (scrolledAmount / scrollMax);
    }
  }
  destroy() {
    this.resizeObserver?.disconnect();
    this.tableInner?.removeEventListener("scroll", this.updateOnScrollFunc, false);
    window.removeEventListener("mousemove", this.handleMouseMoveFunc, false);
    window.removeEventListener("mouseup", this.handleMouseUpFunc, false);
  }
  getSortValue(row, sortDictator) {
    return row.querySelector(`[js-table-sort-data="${sortDictator}"]`)?.textContent?.trim() ?? "";
  }
  handleMouseUp(event) {
    event.preventDefault();
    this.tableInner?.addEventListener("scroll", this.updateOnScrollFunc, false);
    window.removeEventListener("mousemove", this.handleMouseMoveFunc, false);
    window.removeEventListener("mouseup", this.handleMouseUpFunc, false);
  }
  setupResizeObserver() {
    if (!this.tableInner || !this.indicatorInput || !this.indicatorContainer) {
      return;
    }
    this.resizeObserver = new ResizeObserver(() => {
      if (!this.tableInner || !this.indicatorInput || !this.indicatorContainer) {
        return;
      }
      const tableLine = this.tableInner.querySelector(".c-table__line");
      if (!tableLine) {
        return;
      }
      const tableInnerWidth = this.tableInner.offsetWidth;
      const tableLineWidth = tableLine.offsetWidth;
      const tableScrollIndicatorWidth = tableLineWidth > 0 ? `${tableInnerWidth / tableLineWidth * 100}%` : "100%";
      if (tableScrollIndicatorWidth !== "100%") {
        this.indicatorInput.classList.remove("u-display--none");
        this.indicatorContainer.classList.remove("u-display--none");
      } else {
        this.indicatorInput.classList.add("u-display--none");
        this.indicatorContainer.classList.add("u-display--none");
      }
      this.indicatorInput.style.width = tableScrollIndicatorWidth;
      this.tableInner.removeEventListener("scroll", this.updateOnScrollFunc, false);
      this.tableInner.addEventListener("scroll", this.updateOnScrollFunc, false);
    });
    this.resizeObserver.observe(this.table);
  }
};
__name(_Table, "Table");
let Table = _Table;
function init() {
  document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".c-table").forEach((table) => {
      new Table(table);
    });
  });
}
__name(init, "init");
init$3();
init$4();
init$7();
init$6();
init$5();
init$2();
init$1();
init();
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
  el;
  format;
  selects;
  previewEl;
  outputEl;
  baseClass;
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
