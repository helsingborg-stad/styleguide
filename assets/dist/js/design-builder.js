var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
function createControl(setting, currentValue, onChange) {
  const row = document.createElement("div");
  row.className = "db-control";
  if (setting.locked) {
    row.classList.add("db-control--locked");
  }
  row.dataset.variable = setting.variable;
  const label = document.createElement("label");
  label.className = "db-control__label";
  label.textContent = setting.label;
  row.appendChild(label);
  if (setting.description) {
    const desc = document.createElement("span");
    desc.className = "db-control__description";
    desc.textContent = setting.description;
    row.appendChild(desc);
  }
  const varName = document.createElement("code");
  varName.className = "db-control__variable";
  varName.textContent = setting.variable;
  row.appendChild(varName);
  const controlWrap = document.createElement("div");
  controlWrap.className = "db-control__input";
  switch (setting.type) {
    case "color":
      buildColorControl(controlWrap, setting, currentValue, onChange);
      break;
    case "rgba":
      buildRgbaControl(controlWrap, setting, currentValue, onChange);
      break;
    case "range":
      buildRangeControl(controlWrap, setting, currentValue, onChange);
      break;
    case "select":
      buildSelectControl(controlWrap, setting, currentValue, onChange);
      break;
    case "font":
      buildFontControl(controlWrap, setting, currentValue, onChange);
      break;
  }
  row.appendChild(controlWrap);
  if (!setting.locked) {
    const resetBtn = document.createElement("button");
    resetBtn.className = "db-control__reset";
    resetBtn.type = "button";
    resetBtn.title = `Reset to ${setting.default}`;
    resetBtn.textContent = "Reset";
    resetBtn.addEventListener("click", () => {
      onChange(setting.variable, "");
      updateControlValue(row, setting.default, setting);
    });
    row.appendChild(resetBtn);
  }
  return row;
}
__name(createControl, "createControl");
function createReadOnlyControl(setting, currentValue) {
  const row = document.createElement("div");
  row.className = "db-control db-control--readonly db-control--locked";
  row.dataset.variable = setting.variable;
  const label = document.createElement("label");
  label.className = "db-control__label";
  label.textContent = setting.label;
  row.appendChild(label);
  const valueWrap = document.createElement("div");
  valueWrap.className = "db-control__readonly-value";
  if (setting.type === "color" || setting.type === "rgba") {
    const swatch = document.createElement("div");
    swatch.className = "db-control__swatch";
    swatch.style.backgroundColor = currentValue;
    valueWrap.appendChild(swatch);
  }
  const valueText = document.createElement("span");
  valueText.className = "db-control__value-display db-control__value-display--readonly";
  valueText.textContent = currentValue;
  valueWrap.appendChild(valueText);
  row.appendChild(valueWrap);
  return row;
}
__name(createReadOnlyControl, "createReadOnlyControl");
function updateControlValue(row, value, setting) {
  switch (setting.type) {
    case "color": {
      const colorInput = row.querySelector('input[type="color"]');
      const textInput = row.querySelector('input[type="text"]');
      if (colorInput) {
        colorInput.value = toHex(value);
      }
      if (textInput) {
        textInput.value = value;
      }
      const swatch = row.querySelector(".db-control__swatch");
      if (swatch) swatch.style.backgroundColor = value;
      break;
    }
    case "rgba": {
      const colorInput = row.querySelector('input[type="color"]');
      const alphaInput = row.querySelector(".db-control__alpha");
      const alphaDisplay = row.querySelector(".db-control__alpha-display");
      const textInput = row.querySelector('input[type="text"]');
      const swatch = row.querySelector(".db-control__swatch");
      const p = parseRgba(value);
      if (colorInput) colorInput.value = toHex(`rgb(${p.r}, ${p.g}, ${p.b})`);
      if (alphaInput) alphaInput.value = String(p.a);
      if (alphaDisplay) alphaDisplay.textContent = String(p.a);
      if (textInput) textInput.value = value;
      if (swatch) swatch.style.backgroundColor = value;
      break;
    }
    case "range": {
      const rangeInput = row.querySelector('input[type="range"]');
      const display = row.querySelector(".db-control__value-display");
      const numVal = parseFloat(value);
      if (rangeInput && !Number.isNaN(numVal)) rangeInput.value = String(numVal);
      if (display) display.textContent = value;
      break;
    }
    case "select": {
      const select = row.querySelector("select");
      if (select) select.value = value;
      break;
    }
    case "font": {
      const input = row.querySelector('input[type="text"]');
      if (input) input.value = value;
      break;
    }
  }
}
__name(updateControlValue, "updateControlValue");
function buildColorControl(wrap, setting, currentValue, onChange) {
  const isLocked = setting.locked === true;
  const colorInput = document.createElement("input");
  colorInput.type = "color";
  colorInput.className = "db-control__color-hidden";
  colorInput.value = toHex(currentValue);
  colorInput.disabled = isLocked;
  wrap.appendChild(colorInput);
  const swatch = document.createElement("div");
  swatch.className = "db-control__swatch";
  swatch.style.backgroundColor = currentValue;
  if (!isLocked) {
    swatch.classList.add("db-control__swatch--clickable");
    swatch.addEventListener("click", () => colorInput.click());
  }
  wrap.appendChild(swatch);
  const textInput = document.createElement("input");
  textInput.type = "text";
  textInput.className = "db-control__text";
  textInput.value = currentValue;
  textInput.disabled = isLocked;
  textInput.placeholder = setting.default;
  wrap.appendChild(textInput);
  if (!isLocked) {
    colorInput.addEventListener("input", () => {
      textInput.value = colorInput.value;
      swatch.style.backgroundColor = colorInput.value;
      onChange(setting.variable, colorInput.value);
    });
    textInput.addEventListener("change", () => {
      swatch.style.backgroundColor = textInput.value;
      colorInput.value = toHex(textInput.value);
      onChange(setting.variable, textInput.value);
    });
  }
}
__name(buildColorControl, "buildColorControl");
function buildRgbaControl(wrap, setting, currentValue, onChange) {
  const isLocked = setting.locked === true;
  const parsed = parseRgba(currentValue);
  const colorInput = document.createElement("input");
  colorInput.type = "color";
  colorInput.className = "db-control__color-hidden";
  colorInput.value = toHex(`rgb(${parsed.r}, ${parsed.g}, ${parsed.b})`);
  colorInput.disabled = isLocked;
  wrap.appendChild(colorInput);
  const swatch = document.createElement("div");
  swatch.className = "db-control__swatch";
  swatch.style.backgroundColor = currentValue;
  if (!isLocked) {
    swatch.classList.add("db-control__swatch--clickable");
    swatch.addEventListener("click", () => colorInput.click());
  }
  wrap.appendChild(swatch);
  const alphaInput = document.createElement("input");
  alphaInput.type = "range";
  alphaInput.className = "db-control__alpha";
  alphaInput.min = "0";
  alphaInput.max = "1";
  alphaInput.step = "0.01";
  alphaInput.value = String(parsed.a);
  alphaInput.disabled = isLocked;
  wrap.appendChild(alphaInput);
  const alphaDisplay = document.createElement("span");
  alphaDisplay.className = "db-control__value-display db-control__alpha-display";
  alphaDisplay.textContent = String(parsed.a);
  wrap.appendChild(alphaDisplay);
  const textInput = document.createElement("input");
  textInput.type = "text";
  textInput.className = "db-control__text";
  textInput.value = currentValue;
  textInput.disabled = isLocked;
  textInput.placeholder = setting.default;
  wrap.appendChild(textInput);
  if (!isLocked) {
    const syncFromInputs = /* @__PURE__ */ __name(() => {
      const { r, g, b } = hexToRgb(colorInput.value);
      const a = parseFloat(alphaInput.value);
      const rgba = toRgbaString(r, g, b, a);
      textInput.value = rgba;
      swatch.style.backgroundColor = rgba;
      alphaDisplay.textContent = String(a);
      onChange(setting.variable, rgba);
    }, "syncFromInputs");
    colorInput.addEventListener("input", syncFromInputs);
    alphaInput.addEventListener("input", syncFromInputs);
    textInput.addEventListener("change", () => {
      const p = parseRgba(textInput.value);
      const rgba = toRgbaString(p.r, p.g, p.b, p.a);
      swatch.style.backgroundColor = rgba;
      colorInput.value = toHex(`rgb(${p.r}, ${p.g}, ${p.b})`);
      alphaInput.value = String(p.a);
      alphaDisplay.textContent = String(p.a);
      onChange(setting.variable, rgba);
    });
  }
}
__name(buildRgbaControl, "buildRgbaControl");
function buildRangeControl(wrap, setting, currentValue, onChange) {
  const isLocked = setting.locked === true;
  const numVal = parseFloat(currentValue);
  const unit = setting.unit || "";
  const rangeInput = document.createElement("input");
  rangeInput.type = "range";
  rangeInput.disabled = isLocked;
  if (setting.min !== void 0) rangeInput.min = String(setting.min);
  if (setting.max !== void 0) rangeInput.max = String(setting.max);
  if (setting.step !== void 0) rangeInput.step = String(setting.step);
  rangeInput.value = Number.isNaN(numVal) ? "0" : String(numVal);
  wrap.appendChild(rangeInput);
  const display = document.createElement("span");
  display.className = "db-control__value-display";
  display.textContent = currentValue;
  wrap.appendChild(display);
  if (!isLocked) {
    rangeInput.addEventListener("input", () => {
      const val = unit ? `${rangeInput.value}${unit}` : rangeInput.value;
      display.textContent = val;
      onChange(setting.variable, val);
    });
  }
}
__name(buildRangeControl, "buildRangeControl");
function buildSelectControl(wrap, setting, currentValue, onChange) {
  const isLocked = setting.locked === true;
  const select = document.createElement("select");
  select.disabled = isLocked;
  for (const opt of setting.options || []) {
    const option = document.createElement("option");
    option.value = opt.value;
    option.textContent = opt.label;
    if (opt.value === currentValue) option.selected = true;
    select.appendChild(option);
  }
  wrap.appendChild(select);
  if (!isLocked) {
    select.addEventListener("change", () => {
      onChange(setting.variable, select.value);
    });
  }
}
__name(buildSelectControl, "buildSelectControl");
function buildFontControl(wrap, setting, currentValue, onChange) {
  const isLocked = setting.locked === true;
  const input = document.createElement("input");
  input.type = "text";
  input.className = "db-control__text db-control__text--font";
  input.value = currentValue;
  input.disabled = isLocked;
  input.placeholder = setting.default;
  wrap.appendChild(input);
  const preview = document.createElement("span");
  preview.className = "db-control__font-preview";
  preview.textContent = "The quick brown fox";
  preview.style.fontFamily = currentValue;
  wrap.appendChild(preview);
  if (!isLocked) {
    input.addEventListener("change", () => {
      preview.style.fontFamily = input.value;
      onChange(setting.variable, input.value);
    });
  }
}
__name(buildFontControl, "buildFontControl");
function createContrastPair(base, contrasts, baseValue, onChange) {
  const row = document.createElement("div");
  row.className = "db-pair";
  const previews = [];
  const baseCol = document.createElement("div");
  baseCol.className = "db-pair__col";
  baseCol.appendChild(
    buildPairColorCell(base, baseValue, onChange, (val) => {
      for (const p of previews) p.style.backgroundColor = val;
    })
  );
  row.appendChild(baseCol);
  const contrastsWrap = document.createElement("div");
  contrastsWrap.className = "db-pair__contrasts";
  for (const { setting: contrastSetting, value: contrastValue } of contrasts) {
    const contrastRow = document.createElement("div");
    contrastRow.className = "db-pair__contrast-row";
    const contrastCol = document.createElement("div");
    contrastCol.className = "db-pair__col";
    const previewCol = document.createElement("div");
    previewCol.className = "db-pair__preview-col";
    const preview = document.createElement("div");
    preview.className = "db-pair__preview";
    preview.style.backgroundColor = baseValue;
    preview.style.color = contrastValue;
    preview.innerHTML = '<span class="db-pair__preview-lg">Aa</span><span class="db-pair__preview-sm">The quick brown fox jumps over the lazy dog</span>';
    previews.push(preview);
    previewCol.appendChild(preview);
    contrastCol.appendChild(
      buildPairColorCell(contrastSetting, contrastValue, onChange, (val) => {
        preview.style.color = val;
      })
    );
    contrastRow.appendChild(contrastCol);
    contrastRow.appendChild(previewCol);
    contrastsWrap.appendChild(contrastRow);
  }
  row.appendChild(contrastsWrap);
  return row;
}
__name(createContrastPair, "createContrastPair");
function buildPairColorCell(setting, currentValue, onChange, onPreviewUpdate) {
  const cell = document.createElement("div");
  cell.className = "db-pair__cell";
  cell.dataset.variable = setting.variable;
  const label = document.createElement("label");
  label.className = "db-pair__label";
  label.textContent = setting.label;
  cell.appendChild(label);
  const varName = document.createElement("code");
  varName.className = "db-pair__variable";
  varName.textContent = setting.variable;
  cell.appendChild(varName);
  const inputRow = document.createElement("div");
  inputRow.className = "db-pair__inputs";
  const colorInput = document.createElement("input");
  colorInput.type = "color";
  colorInput.className = "db-control__color-hidden";
  colorInput.value = toHex(currentValue);
  inputRow.appendChild(colorInput);
  const swatch = document.createElement("div");
  swatch.className = "db-control__swatch db-control__swatch--clickable";
  swatch.style.backgroundColor = currentValue;
  swatch.addEventListener("click", () => colorInput.click());
  inputRow.appendChild(swatch);
  const textInput = document.createElement("input");
  textInput.type = "text";
  textInput.className = "db-control__text";
  textInput.value = currentValue;
  textInput.placeholder = setting.default;
  inputRow.appendChild(textInput);
  colorInput.addEventListener("input", () => {
    textInput.value = colorInput.value;
    swatch.style.backgroundColor = colorInput.value;
    onPreviewUpdate(colorInput.value);
    onChange(setting.variable, colorInput.value);
  });
  textInput.addEventListener("change", () => {
    swatch.style.backgroundColor = textInput.value;
    colorInput.value = toHex(textInput.value);
    onPreviewUpdate(textInput.value);
    onChange(setting.variable, textInput.value);
  });
  cell.appendChild(inputRow);
  const resetBtn = document.createElement("button");
  resetBtn.className = "db-control__reset";
  resetBtn.type = "button";
  resetBtn.title = `Reset to ${setting.default}`;
  resetBtn.textContent = "Reset";
  resetBtn.addEventListener("click", () => {
    onChange(setting.variable, "");
    colorInput.value = toHex(setting.default);
    textInput.value = setting.default;
    swatch.style.backgroundColor = setting.default;
    onPreviewUpdate(setting.default);
  });
  cell.appendChild(resetBtn);
  return cell;
}
__name(buildPairColorCell, "buildPairColorCell");
function createSwatchBand(settings) {
  const container = document.createElement("div");
  container.className = "db-swatch-band";
  const groups = /* @__PURE__ */ new Map();
  for (const setting of settings) {
    const match = setting.variable.match(/^--color--(\w+)-\d+$/);
    const groupKey = match ? match[1] : "other";
    if (!groups.has(groupKey)) groups.set(groupKey, []);
    groups.get(groupKey).push(setting);
  }
  for (const [groupKey, groupSettings] of groups) {
    const row = document.createElement("div");
    row.className = "db-swatch-band__row";
    const varLabel = document.createElement("code");
    varLabel.className = "db-swatch-band__var";
    varLabel.textContent = `--color--${groupKey}-[%]`;
    row.appendChild(varLabel);
    const strip = document.createElement("div");
    strip.className = "db-swatch-band__strip";
    for (const setting of groupSettings) {
      const swatch = document.createElement("div");
      swatch.className = "db-swatch-band__swatch";
      swatch.style.backgroundColor = setting.default;
      const pctMatch = setting.variable.match(/-(\d+)$/);
      const pct = pctMatch ? `${pctMatch[1]}` : "";
      swatch.title = `${setting.variable}
${setting.default}`;
      const pctLabel = document.createElement("span");
      pctLabel.className = "db-swatch-band__pct";
      pctLabel.textContent = pct;
      swatch.appendChild(pctLabel);
      strip.appendChild(swatch);
    }
    row.appendChild(strip);
    container.appendChild(row);
  }
  return container;
}
__name(createSwatchBand, "createSwatchBand");
function hexToRgb(hex) {
  return {
    r: parseInt(hex.slice(1, 3), 16),
    g: parseInt(hex.slice(3, 5), 16),
    b: parseInt(hex.slice(5, 7), 16)
  };
}
__name(hexToRgb, "hexToRgb");
function parseRgba(value) {
  const m = value.match(/rgba?\(\s*(\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\s*\)/);
  if (m) {
    return {
      r: parseInt(m[1]),
      g: parseInt(m[2]),
      b: parseInt(m[3]),
      a: m[4] !== void 0 ? parseFloat(m[4]) : 1
    };
  }
  if (/^#[0-9a-f]{6}$/i.test(value)) {
    return {
      r: parseInt(value.slice(1, 3), 16),
      g: parseInt(value.slice(3, 5), 16),
      b: parseInt(value.slice(5, 7), 16),
      a: 1
    };
  }
  return { r: 0, g: 0, b: 0, a: 1 };
}
__name(parseRgba, "parseRgba");
function toRgbaString(r, g, b, a) {
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}
__name(toRgbaString, "toRgbaString");
function toHex(color) {
  if (/^#[0-9a-f]{6}$/i.test(color)) return color;
  if (/^#[0-9a-f]{3}$/i.test(color)) {
    return "#" + color[1] + color[1] + color[2] + color[2] + color[3] + color[3];
  }
  const temp = document.createElement("div");
  temp.style.color = color;
  document.body.appendChild(temp);
  const computed = getComputedStyle(temp).color;
  document.body.removeChild(temp);
  const match = computed.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
  if (match) {
    const r = parseInt(match[1]).toString(16).padStart(2, "0");
    const g = parseInt(match[2]).toString(16).padStart(2, "0");
    const b = parseInt(match[3]).toString(16).padStart(2, "0");
    return `#${r}${g}${b}`;
  }
  return "#000000";
}
__name(toHex, "toHex");
const STORAGE_KEY = "design-tokens-overrides";
const PRESETS_KEY = "design-tokens-presets";
const ACTIVE_PRESET_KEY = "design-tokens-active-preset";
const _LocalStorageAdapter = class _LocalStorageAdapter {
  key;
  constructor(key = STORAGE_KEY) {
    this.key = key;
  }
  load() {
    try {
      const raw = localStorage.getItem(this.key);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  }
  save(overrides) {
    const filtered = {};
    for (const [k, v] of Object.entries(overrides)) {
      if (v !== void 0 && v !== null && v !== "") {
        filtered[k] = v;
      }
    }
    if (Object.keys(filtered).length === 0) {
      localStorage.removeItem(this.key);
    } else {
      localStorage.setItem(this.key, JSON.stringify(filtered));
    }
  }
  clear() {
    localStorage.removeItem(this.key);
  }
};
__name(_LocalStorageAdapter, "LocalStorageAdapter");
let LocalStorageAdapter = _LocalStorageAdapter;
const _PresetManager = class _PresetManager {
  presetsKey;
  activeKey;
  constructor(presetsKey = PRESETS_KEY, activeKey = ACTIVE_PRESET_KEY) {
    this.presetsKey = presetsKey;
    this.activeKey = activeKey;
  }
  loadAll() {
    try {
      const raw = localStorage.getItem(this.presetsKey);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  }
  save(name, overrides) {
    const all = this.loadAll();
    all[name] = { ...overrides };
    localStorage.setItem(this.presetsKey, JSON.stringify(all));
  }
  delete(name) {
    const all = this.loadAll();
    delete all[name];
    if (Object.keys(all).length === 0) {
      localStorage.removeItem(this.presetsKey);
    } else {
      localStorage.setItem(this.presetsKey, JSON.stringify(all));
    }
    if (this.getActive() === name) {
      this.clearActive();
    }
  }
  getActive() {
    return localStorage.getItem(this.activeKey);
  }
  setActive(name) {
    localStorage.setItem(this.activeKey, name);
  }
  clearActive() {
    localStorage.removeItem(this.activeKey);
  }
  names() {
    return Object.keys(this.loadAll()).sort();
  }
};
__name(_PresetManager, "PresetManager");
let PresetManager = _PresetManager;
const COMPONENT_STORAGE_KEY = "design-tokens-component-overrides";
const GLOBAL_SCOPE_KEY = "__global__";
const _ComponentStorageAdapter = class _ComponentStorageAdapter {
  key;
  constructor(key = COMPONENT_STORAGE_KEY) {
    this.key = key;
  }
  load() {
    try {
      const raw = localStorage.getItem(this.key);
      if (!raw) return {};
      const parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
        return {};
      }
      if (this.isLegacyComponentOverrides(parsed)) {
        const legacy = this.normalizeComponentOverrides(parsed);
        if (Object.keys(legacy).length === 0) {
          return {};
        }
        return {
          [GLOBAL_SCOPE_KEY]: legacy
        };
      }
      return this.normalizeScopedOverrides(parsed);
    } catch {
      return {};
    }
  }
  save(overrides) {
    const cleaned = this.normalizeScopedOverrides(overrides);
    if (Object.keys(cleaned).length === 0) {
      localStorage.removeItem(this.key);
      return;
    }
    localStorage.setItem(this.key, JSON.stringify(cleaned));
  }
  isLegacyComponentOverrides(input) {
    const values = Object.values(input);
    if (values.length === 0) {
      return false;
    }
    return values.every((value) => {
      if (!value || typeof value !== "object" || Array.isArray(value)) {
        return false;
      }
      const variableValues = Object.values(value);
      return variableValues.every((entry) => typeof entry === "string");
    });
  }
  normalizeScopedOverrides(input) {
    const result = {};
    for (const [scopeKey, scopeValue] of Object.entries(input)) {
      if (!scopeValue || typeof scopeValue !== "object" || Array.isArray(scopeValue)) continue;
      const componentOverrides = this.normalizeComponentOverrides(scopeValue);
      if (Object.keys(componentOverrides).length > 0) {
        result[scopeKey] = componentOverrides;
      }
    }
    return result;
  }
  normalizeComponentOverrides(input) {
    const cleaned = {};
    for (const [componentName, values] of Object.entries(input)) {
      if (!values || typeof values !== "object" || Array.isArray(values)) continue;
      const filtered = {};
      for (const [variable, value] of Object.entries(values)) {
        if (typeof value === "string" && value.trim() !== "") {
          filtered[variable] = value;
        }
      }
      if (Object.keys(filtered).length > 0) {
        cleaned[componentName] = filtered;
      }
    }
    return cleaned;
  }
};
__name(_ComponentStorageAdapter, "ComponentStorageAdapter");
let ComponentStorageAdapter = _ComponentStorageAdapter;
const _ComponentCustomizationTool = class _ComponentCustomizationTool {
  componentData;
  tokenLibrary;
  storage;
  overrides;
  elementsByComponent = /* @__PURE__ */ new Map();
  editableComponents = /* @__PURE__ */ new Set();
  activeComponent = null;
  activeScopeKey = GLOBAL_SCOPE_KEY;
  root = null;
  controlsContainer = null;
  componentSelect = null;
  activeTargetElement = null;
  constructor(componentData, tokenLibrary) {
    this.componentData = componentData;
    this.tokenLibrary = tokenLibrary;
    this.storage = new ComponentStorageAdapter();
    this.overrides = this.storage.load();
    this.collectComponentElements();
    this.collectEditableComponents();
    this.pruneUnknownOverrides();
    this.applySavedOverrides();
    this.setupEditableTargets();
    this.render();
    this.bindComponentSelection();
  }
  collectComponentElements() {
    const nodes = document.querySelectorAll("[data-component]");
    for (const node of nodes) {
      const componentName = normalizeComponentName(node.dataset.component || "");
      if (!componentName) continue;
      const existing = this.elementsByComponent.get(componentName) || [];
      existing.push(node);
      this.elementsByComponent.set(componentName, existing);
    }
    this.activeComponent = this.elementsByComponent.keys().next().value || null;
  }
  pruneUnknownOverrides() {
    let hasChanges = false;
    for (const [scopeKey, scopeOverrides] of Object.entries(this.overrides)) {
      for (const componentName of Object.keys(scopeOverrides)) {
        const isMissingComponent = !this.elementsByComponent.has(componentName) || !this.editableComponents.has(componentName);
        const hasContextTarget = this.getElementsForContext(componentName, scopeKey).length > 0;
        if (isMissingComponent || !hasContextTarget) {
          delete this.overrides[scopeKey][componentName];
          hasChanges = true;
        }
      }
      if (Object.keys(this.overrides[scopeKey]).length === 0) {
        delete this.overrides[scopeKey];
        hasChanges = true;
      }
    }
    if (hasChanges) {
      this.storage.save(this.overrides);
    }
  }
  applySavedOverrides() {
    for (const [scopeKey, scopeOverrides] of Object.entries(this.overrides)) {
      for (const [componentName, componentOverrides] of Object.entries(scopeOverrides)) {
        for (const [variable, value] of Object.entries(componentOverrides)) {
          this.applyVariable(componentName, scopeKey, variable, value);
        }
      }
    }
  }
  collectEditableComponents() {
    for (const componentName of this.elementsByComponent.keys()) {
      if (this.buildCategoriesForComponent(componentName).length > 0) {
        this.editableComponents.add(componentName);
      }
    }
    if (this.activeComponent && !this.editableComponents.has(this.activeComponent)) {
      const firstEditable = this.editableComponents.values().next().value;
      this.activeComponent = typeof firstEditable === "string" ? firstEditable : null;
    }
  }
  setupEditableTargets() {
    for (const [componentName, elements] of this.elementsByComponent.entries()) {
      const isEditable = this.editableComponents.has(componentName);
      for (const element of elements) {
        if (!isEditable) continue;
        element.classList.add("db-component-target");
        const scopeLabel = this.getScopeLabel(this.getScopeKeyForElement(element));
        element.dataset.customizeTooltip = scopeLabel ? `Customize ${this.getComponentLabel(componentName)} (${scopeLabel})` : `Customize ${this.getComponentLabel(componentName)}`;
        const links = element.querySelectorAll("a[href]");
        for (const link of links) {
          link.addEventListener("click", (event) => {
            event.preventDefault();
          });
        }
      }
    }
  }
  bindComponentSelection() {
    for (const [componentName, elements] of this.elementsByComponent.entries()) {
      if (!this.editableComponents.has(componentName)) continue;
      for (const element of elements) {
        element.addEventListener("click", (event) => {
          event.preventDefault();
          event.stopPropagation();
          if (!this.root) return;
          this.activeComponent = componentName;
          this.activeScopeKey = this.getScopeKeyForElement(element);
          this.setActiveTarget(componentName, this.activeScopeKey, element);
          if (this.componentSelect) {
            this.componentSelect.value = componentName;
          }
          this.renderControls();
          this.root.classList.add("db-component-tool--open");
        });
      }
    }
  }
  render() {
    if (this.editableComponents.size === 0) return;
    const root = document.createElement("aside");
    root.className = "db-component-tool";
    root.innerHTML = `
			<button type="button" class="db-component-tool__toggle" data-action="toggle-panel">Customize component</button>
			<div class="db-component-tool__panel">
				<div class="db-component-tool__header">
					<strong>Component customization</strong>
					<button type="button" class="db-component-tool__close" data-action="close-panel" aria-label="Close component customization">×</button>
				</div>
				<div class="db-component-tool__select-row">
					<label for="db-component-select">Component</label>
					<select id="db-component-select" data-action="select-component"></select>
				</div>
				<div class="db-component-tool__actions">
					<button type="button" class="db-btn" data-action="reset-component">Reset selected</button>
					<button type="button" class="db-btn db-btn--danger" data-action="reset-all-components">Reset all</button>
				</div>
				<div class="db-component-tool__controls" data-component-controls></div>
			</div>
		`;
    document.body.appendChild(root);
    this.root = root;
    this.controlsContainer = root.querySelector("[data-component-controls]");
    this.componentSelect = root.querySelector('[data-action="select-component"]');
    const toggleButton = root.querySelector('[data-action="toggle-panel"]');
    const closeButton = root.querySelector('[data-action="close-panel"]');
    toggleButton?.addEventListener("click", () => root.classList.toggle("db-component-tool--open"));
    closeButton?.addEventListener("click", () => root.classList.remove("db-component-tool--open"));
    if (this.componentSelect) {
      this.componentSelect.innerHTML = "";
      for (const componentName of this.getSortedComponentNames()) {
        const option = document.createElement("option");
        option.value = componentName;
        option.textContent = this.getComponentLabel(componentName);
        this.componentSelect.appendChild(option);
      }
      if (this.activeComponent && this.getSortedComponentNames().includes(this.activeComponent)) {
        this.componentSelect.value = this.activeComponent;
      }
      this.componentSelect.addEventListener("change", () => {
        this.activeComponent = this.componentSelect?.value || null;
        if (this.activeComponent) {
          this.setActiveTarget(this.activeComponent, this.activeScopeKey);
        }
        this.renderControls();
      });
    }
    root.querySelector('[data-action="reset-component"]')?.addEventListener("click", () => {
      if (!this.activeComponent) return;
      this.resetComponent(this.activeComponent);
    });
    root.querySelector('[data-action="reset-all-components"]')?.addEventListener("click", () => {
      this.resetAllComponents();
    });
    this.renderControls();
    if (this.activeComponent) {
      this.setActiveTarget(this.activeComponent, this.activeScopeKey);
    }
  }
  setActiveTarget(componentName, scopeKey, preferredElement) {
    if (this.activeTargetElement) {
      this.activeTargetElement.classList.remove("db-component-target--active");
    }
    const candidates = this.getElementsForContext(componentName, scopeKey);
    const fallbackCandidates = this.elementsByComponent.get(componentName) || [];
    const target = preferredElement || candidates[0] || fallbackCandidates[0] || null;
    if (!target) {
      this.activeTargetElement = null;
      return;
    }
    this.activeScopeKey = this.getScopeKeyForElement(target);
    target.classList.add("db-component-target--active");
    this.activeTargetElement = target;
  }
  getScopeKeyForElement(element) {
    const scope = element.closest("[data-scope]")?.dataset.scope?.trim();
    if (!scope) {
      return GLOBAL_SCOPE_KEY;
    }
    return `scope:${scope}`;
  }
  getScopeLabel(scopeKey) {
    if (scopeKey === GLOBAL_SCOPE_KEY) {
      return "";
    }
    return scopeKey.replace(/^scope:/, "");
  }
  getElementsForContext(componentName, scopeKey) {
    const elements = this.elementsByComponent.get(componentName) || [];
    return elements.filter((element) => this.getScopeKeyForElement(element) === scopeKey);
  }
  getSortedComponentNames() {
    return Array.from(this.editableComponents).sort((a, b) => a.localeCompare(b));
  }
  getComponentLabel(componentName) {
    const definition = this.componentData[componentName];
    if (definition && typeof definition.name === "string" && definition.name.trim() !== "") {
      return definition.name;
    }
    return componentName;
  }
  renderControls() {
    if (!this.controlsContainer) return;
    this.controlsContainer.innerHTML = "";
    if (!this.activeComponent) {
      this.controlsContainer.textContent = "No component selected.";
      return;
    }
    const categories = this.buildCategoriesForComponent(this.activeComponent);
    if (categories.length === 0) {
      this.controlsContainer.textContent = "No token customization options were found for this component.";
      return;
    }
    for (const category of categories) {
      const section = document.createElement("section");
      section.className = "db-category";
      const header = document.createElement("div");
      header.className = "db-category__header";
      header.innerHTML = `<h2 class="db-category__title">${category.label}</h2>`;
      section.appendChild(header);
      const body = document.createElement("div");
      body.className = "db-category__body";
      for (const setting of category.settings) {
        const currentValue = this.overrides[this.activeScopeKey]?.[this.activeComponent]?.[setting.variable] || setting.default;
        const control = createControl(setting, currentValue, (variable, value) => {
          this.handleChange(this.activeComponent, this.activeScopeKey, variable, value, setting.default);
        });
        body.appendChild(control);
      }
      section.appendChild(body);
      this.controlsContainer.appendChild(section);
    }
  }
  buildCategoriesForComponent(componentName) {
    const definition = this.componentData[componentName];
    const tokens = Array.isArray(definition?.tokens) ? definition.tokens : [];
    if (tokens.length === 0) return [];
    const availableTokenNames = new Set(tokens.map((token) => token.trim()).filter(Boolean));
    const categories = [];
    for (const category of this.tokenLibrary.categories) {
      const matchedSettings = category.settings.filter((setting) => availableTokenNames.has(setting.variable.replace(/^--/, ""))).map((setting) => {
        const tokenName = setting.variable.replace(/^--/, "");
        return {
          ...setting,
          variable: `--c-${componentName}--${tokenName}`
        };
      });
      if (matchedSettings.length === 0) continue;
      categories.push({
        id: category.id,
        label: category.label,
        description: category.description,
        present: category.present,
        settings: matchedSettings
      });
    }
    return categories;
  }
  handleChange(componentName, scopeKey, variable, value, defaultValue) {
    if (!this.overrides[scopeKey]) {
      this.overrides[scopeKey] = {};
    }
    if (!this.overrides[scopeKey][componentName]) {
      this.overrides[scopeKey][componentName] = {};
    }
    if (!value || value === defaultValue) {
      delete this.overrides[scopeKey][componentName][variable];
      this.removeVariable(componentName, scopeKey, variable);
    } else {
      this.overrides[scopeKey][componentName][variable] = value;
      this.applyVariable(componentName, scopeKey, variable, value);
    }
    if (Object.keys(this.overrides[scopeKey][componentName]).length === 0) {
      delete this.overrides[scopeKey][componentName];
    }
    if (Object.keys(this.overrides[scopeKey]).length === 0) {
      delete this.overrides[scopeKey];
    }
    this.storage.save(this.overrides);
  }
  applyVariable(componentName, scopeKey, variable, value) {
    const elements = this.getElementsForContext(componentName, scopeKey);
    for (const element of elements) {
      element.style.setProperty(variable, value);
    }
  }
  removeVariable(componentName, scopeKey, variable) {
    const elements = this.getElementsForContext(componentName, scopeKey);
    for (const element of elements) {
      element.style.removeProperty(variable);
    }
  }
  resetComponent(componentName) {
    const scopeLabel = this.getScopeLabel(this.activeScopeKey);
    const labelSuffix = scopeLabel ? ` in scope "${scopeLabel}"` : "";
    if (!confirm(`Reset all overrides for ${this.getComponentLabel(componentName)}${labelSuffix}?`)) {
      return;
    }
    const variables = Object.keys(this.overrides[this.activeScopeKey]?.[componentName] || {});
    for (const variable of variables) {
      this.removeVariable(componentName, this.activeScopeKey, variable);
    }
    if (this.overrides[this.activeScopeKey]) {
      delete this.overrides[this.activeScopeKey][componentName];
      if (Object.keys(this.overrides[this.activeScopeKey]).length === 0) {
        delete this.overrides[this.activeScopeKey];
      }
    }
    this.storage.save(this.overrides);
    this.renderControls();
  }
  resetAllComponents() {
    if (!confirm("Reset all component customizations on this page?")) {
      return;
    }
    for (const [scopeKey, scopeOverrides] of Object.entries(this.overrides)) {
      for (const [componentName, componentOverrides] of Object.entries(scopeOverrides)) {
        for (const variable of Object.keys(componentOverrides)) {
          this.removeVariable(componentName, scopeKey, variable);
        }
      }
    }
    this.overrides = {};
    this.storage.save(this.overrides);
    this.renderControls();
  }
};
__name(_ComponentCustomizationTool, "ComponentCustomizationTool");
let ComponentCustomizationTool = _ComponentCustomizationTool;
function normalizeComponentName(value) {
  return value.trim().toLowerCase().replace(/^c-/, "");
}
__name(normalizeComponentName, "normalizeComponentName");
function parseComponentTokenData(raw) {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
    return {};
  }
  const parsed = {};
  for (const [key, value] of Object.entries(raw)) {
    const normalizedKey = normalizeComponentName(key);
    if (!normalizedKey) continue;
    if (!value || typeof value !== "object" || Array.isArray(value)) {
      continue;
    }
    const definition = value;
    parsed[normalizedKey] = {
      name: typeof definition.name === "string" ? definition.name : void 0,
      slug: typeof definition.slug === "string" ? normalizeComponentName(definition.slug) : normalizedKey,
      tokens: Array.isArray(definition.tokens) ? definition.tokens.filter((token) => typeof token === "string") : []
    };
  }
  return parsed;
}
__name(parseComponentTokenData, "parseComponentTokenData");
function isTokenData(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return false;
  }
  const maybeData = value;
  return Array.isArray(maybeData.categories);
}
__name(isTokenData, "isTokenData");
async function loadTokenLibrary() {
  const embeddedLibrary = window.styleguideDesignTokenLibrary;
  if (isTokenData(embeddedLibrary)) {
    return embeddedLibrary;
  }
  return null;
}
__name(loadTokenLibrary, "loadTokenLibrary");
const _DesignBuilder = class _DesignBuilder {
  container;
  storage;
  tokens;
  overrides;
  saveTimeout = null;
  presetManager;
  presetBar = null;
  showLockedFields = false;
  constructor(container, tokens, storage) {
    this.container = container;
    this.tokens = tokens;
    this.storage = storage;
    this.presetManager = new PresetManager();
    this.overrides = storage.load();
    this.removeLockedOverrides();
    this.render();
    this.applyAll();
  }
  removeLockedOverrides() {
    const lockedVariables = /* @__PURE__ */ new Set();
    for (const category of this.tokens.categories) {
      for (const setting of category.settings) {
        if (setting.locked) {
          lockedVariables.add(setting.variable);
        }
      }
    }
    let changed = false;
    for (const variable of lockedVariables) {
      if (variable in this.overrides) {
        delete this.overrides[variable];
        changed = true;
      }
    }
    if (changed) {
      this.storage.save(this.overrides);
    }
  }
  render() {
    const header = document.createElement("div");
    header.className = "db-header";
    header.innerHTML = `
      <h1 class="db-header__title">Design Builder</h1>
      <p class="db-header__subtitle">${this.tokens.name} v${this.tokens.version}</p>
      <div class="db-header__actions">
				<label class="db-header__toggle-row" title="Show non-editable fields">
					<input type="checkbox" data-action="toggle-locked" ${this.showLockedFields ? "checked" : ""}>
					<span>Show uneditable</span>
				</label>
        <button type="button" class="db-btn" data-action="export">Export JSON</button>
        <button type="button" class="db-btn" data-action="import">Import JSON</button>
        <button type="button" class="db-btn db-btn--danger" data-action="reset">Reset All</button>
        <button type="button" class="db-btn db-btn--primary" data-action="save-preset">Save preset</button>
        <input type="file" accept=".json,application/json" data-action="import-file" hidden>
      </div>
    `;
    this.container.appendChild(header);
    const importInput = header.querySelector('[data-action="import-file"]');
    const toggleLockedInput = header.querySelector('[data-action="toggle-locked"]');
    toggleLockedInput?.addEventListener("change", () => {
      this.showLockedFields = toggleLockedInput.checked;
      this.container.innerHTML = "";
      this.render();
    });
    header.querySelector('[data-action="export"]')?.addEventListener("click", () => this.exportJson());
    header.querySelector('[data-action="import"]')?.addEventListener("click", () => importInput?.click());
    importInput?.addEventListener("change", () => {
      const file = importInput.files?.[0];
      if (!file) return;
      void this.importJson(file);
      importInput.value = "";
    });
    header.querySelector('[data-action="reset"]')?.addEventListener("click", () => this.resetAll());
    header.querySelector('[data-action="save-preset"]')?.addEventListener("click", () => this.savePreset());
    this.presetBar = this.renderPresetBar();
    this.container.appendChild(this.presetBar);
    const categoriesWrap = document.createElement("div");
    categoriesWrap.className = "db-categories";
    for (const category of this.tokens.categories) {
      categoriesWrap.appendChild(this.renderCategory(category));
    }
    this.container.appendChild(categoriesWrap);
  }
  renderCategory(category) {
    const section = document.createElement("section");
    section.className = "db-category";
    section.dataset.categoryId = category.id;
    const header = document.createElement("div");
    header.className = "db-category__header";
    header.innerHTML = `
      <h2 class="db-category__title">${category.label}</h2>
      ${category.description ? `<p class="db-category__description">${category.description}</p>` : ""}
      <span class="db-category__toggle material-symbols-outlined">expand_more</span>
    `;
    section.appendChild(header);
    const body = document.createElement("div");
    body.className = "db-category__body";
    if (category.present === "swatch") {
      body.appendChild(createSwatchBand(category.settings));
    } else {
      const settingsMap = /* @__PURE__ */ new Map();
      for (const setting of category.settings) {
        settingsMap.set(setting.variable, setting);
      }
      const contrastVars = /* @__PURE__ */ new Set();
      for (const s of category.settings) {
        if (s.contrast) {
          const refs = Array.isArray(s.contrast) ? s.contrast : [s.contrast];
          for (const variable of refs) {
            const contrastSetting = settingsMap.get(variable);
            if (contrastSetting && !contrastSetting.locked) {
              contrastVars.add(variable);
            }
          }
        }
      }
      for (const setting of category.settings) {
        if (setting.locked) {
          if (!this.showLockedFields) {
            continue;
          }
          const currentValue = this.overrides[setting.variable] || setting.default;
          body.appendChild(createReadOnlyControl(setting, currentValue));
          continue;
        }
        if (contrastVars.has(setting.variable)) continue;
        if (setting.contrast) {
          const refs = Array.isArray(setting.contrast) ? setting.contrast : [setting.contrast];
          const contrasts = [];
          for (const contrastVar of refs) {
            const contrastSetting = settingsMap.get(contrastVar);
            if (contrastSetting && !contrastSetting.locked) {
              contrasts.push({
                setting: contrastSetting,
                value: this.overrides[contrastVar] || contrastSetting.default
              });
            }
          }
          if (contrasts.length > 0) {
            const baseVal = this.overrides[setting.variable] || setting.default;
            body.appendChild(
              createContrastPair(setting, contrasts, baseVal, (variable, value) => {
                const allSettings = [setting, ...contrasts.map((c) => c.setting)];
                const def = allSettings.find((s) => s.variable === variable)?.default || "";
                this.handleChange(variable, value, def);
              })
            );
          }
        } else {
          const currentValue = this.overrides[setting.variable] || setting.default;
          const control = createControl(setting, currentValue, (variable, value) => {
            this.handleChange(variable, value, setting.default);
          });
          body.appendChild(control);
        }
      }
    }
    section.appendChild(body);
    header.addEventListener("click", () => {
      section.classList.toggle("db-category--collapsed");
    });
    return section;
  }
  handleChange(variable, value, defaultValue) {
    if (!value || value === defaultValue) {
      delete this.overrides[variable];
    } else {
      this.overrides[variable] = value;
    }
    if (value && value !== defaultValue) {
      document.documentElement.style.setProperty(variable, value);
    } else {
      document.documentElement.style.removeProperty(variable);
    }
    this.debounceSave();
    this.presetManager.clearActive();
    this.refreshPresetBar();
  }
  debounceSave() {
    if (this.saveTimeout) clearTimeout(this.saveTimeout);
    this.saveTimeout = setTimeout(() => {
      this.storage.save(this.overrides);
    }, 300);
  }
  applyAll() {
    for (const [prop, value] of Object.entries(this.overrides)) {
      document.documentElement.style.setProperty(prop, value);
    }
  }
  resetAll() {
    if (!confirm("Reset all tokens to their default values? This clears all customizations.")) {
      return;
    }
    for (const prop of Object.keys(this.overrides)) {
      document.documentElement.style.removeProperty(prop);
    }
    this.overrides = {};
    this.storage.clear();
    this.presetManager.clearActive();
    this.container.innerHTML = "";
    this.render();
  }
  exportJson() {
    const data = JSON.stringify(this.overrides, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "design-tokens-overrides.json";
    a.click();
    URL.revokeObjectURL(url);
  }
  async importJson(file) {
    let fileContent;
    try {
      fileContent = await file.text();
    } catch {
      alert("Error: Could not read the selected JSON file.");
      return;
    }
    let parsed;
    try {
      parsed = JSON.parse(fileContent);
    } catch {
      alert("Error: Invalid JSON file.");
      return;
    }
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      alert("Error: Imported JSON must be an object of CSS variable/value pairs.");
      return;
    }
    const tokenVariables = /* @__PURE__ */ new Set();
    const lockedVariables = /* @__PURE__ */ new Set();
    for (const category of this.tokens.categories) {
      for (const setting of category.settings) {
        tokenVariables.add(setting.variable);
        if (setting.locked) {
          lockedVariables.add(setting.variable);
        }
      }
    }
    const importedOverrides = {};
    const parsedOverrides = parsed;
    const entries = Object.entries(parsedOverrides);
    for (const [variable, value] of entries) {
      if (!tokenVariables.has(variable)) continue;
      if (lockedVariables.has(variable)) continue;
      if (typeof value !== "string" || !value.trim()) continue;
      importedOverrides[variable] = value;
    }
    if (entries.length > 0 && Object.keys(importedOverrides).length === 0) {
      alert("Error: No recognized design token overrides were found in the selected file.");
      return;
    }
    for (const prop of Object.keys(this.overrides)) {
      document.documentElement.style.removeProperty(prop);
    }
    this.overrides = importedOverrides;
    this.applyAll();
    this.storage.save(this.overrides);
    this.presetManager.clearActive();
    this.container.innerHTML = "";
    this.render();
  }
  // --- Preset Management ---
  renderPresetBar() {
    const bar = document.createElement("div");
    bar.className = "db-presets";
    const names = this.presetManager.names();
    if (names.length === 0) {
      bar.hidden = true;
      bar.classList.add("u-display--none");
      return bar;
    }
    const list = document.createElement("div");
    list.className = "db-presets__list";
    const activeName = this.presetManager.getActive();
    for (const name of names) {
      list.appendChild(this.createPresetChip(name, name === activeName));
    }
    bar.appendChild(list);
    return bar;
  }
  createPresetChip(name, isActive) {
    const chip = document.createElement("button");
    chip.type = "button";
    chip.className = "db-presets__chip";
    if (isActive) chip.classList.add("db-presets__chip--active");
    const label = document.createElement("span");
    label.className = "db-presets__chip-label";
    label.textContent = name;
    chip.appendChild(label);
    const del = document.createElement("span");
    del.className = "db-presets__chip-delete";
    del.textContent = "×";
    del.title = `Delete "${name}"`;
    del.addEventListener("click", (e) => {
      e.stopPropagation();
      this.deletePreset(name);
    });
    chip.appendChild(del);
    chip.addEventListener("click", () => this.loadPreset(name));
    return chip;
  }
  savePreset() {
    const name = prompt("Preset name:");
    if (!name || !name.trim()) return;
    const trimmed = name.trim();
    const existing = this.presetManager.names();
    if (existing.includes(trimmed)) {
      if (!confirm(`A preset named "${trimmed}" already exists. Overwrite it?`)) {
        return;
      }
    }
    this.presetManager.save(trimmed, this.overrides);
    this.presetManager.setActive(trimmed);
    this.refreshPresetBar();
  }
  loadPreset(name) {
    const all = this.presetManager.loadAll();
    const presetOverrides = all[name];
    if (!presetOverrides) return;
    for (const prop of Object.keys(this.overrides)) {
      document.documentElement.style.removeProperty(prop);
    }
    this.overrides = { ...presetOverrides };
    this.applyAll();
    this.storage.save(this.overrides);
    this.presetManager.setActive(name);
    this.container.innerHTML = "";
    this.render();
  }
  deletePreset(name) {
    if (!confirm(`Delete preset "${name}"?`)) return;
    this.presetManager.delete(name);
    this.refreshPresetBar();
  }
  refreshPresetBar() {
    if (!this.presetBar) return;
    const newBar = this.renderPresetBar();
    this.presetBar.replaceWith(newBar);
    this.presetBar = newBar;
  }
};
__name(_DesignBuilder, "DesignBuilder");
let DesignBuilder = _DesignBuilder;
const SPLIT_STORAGE_KEY = "design-builder-split";
const MIN_SPLIT = 20;
const MAX_SPLIT = 80;
function initDivider() {
  const layout = document.querySelector(".db-layout");
  const divider = document.querySelector("[data-db-divider]");
  if (!layout || !divider) return;
  const saved = localStorage.getItem(SPLIT_STORAGE_KEY);
  if (saved) {
    const ratio = parseFloat(saved);
    if (ratio >= MIN_SPLIT && ratio <= MAX_SPLIT) {
      layout.style.setProperty("--db-split", `${ratio}%`);
    }
  }
  const onPointerMove = /* @__PURE__ */ __name((e) => {
    const rect = layout.getBoundingClientRect();
    let ratio = (e.clientX - rect.left) / rect.width * 100;
    ratio = Math.max(MIN_SPLIT, Math.min(MAX_SPLIT, ratio));
    layout.style.setProperty("--db-split", `${ratio}%`);
  }, "onPointerMove");
  const onPointerUp = /* @__PURE__ */ __name((e) => {
    divider.classList.remove("is-dragging");
    document.body.style.userSelect = "";
    document.body.style.cursor = "";
    divider.releasePointerCapture(e.pointerId);
    divider.removeEventListener("pointermove", onPointerMove);
    divider.removeEventListener("pointerup", onPointerUp);
    const current = layout.style.getPropertyValue("--db-split");
    if (current) {
      localStorage.setItem(SPLIT_STORAGE_KEY, parseFloat(current).toString());
    }
  }, "onPointerUp");
  divider.addEventListener("pointerdown", (e) => {
    e.preventDefault();
    divider.classList.add("is-dragging");
    document.body.style.userSelect = "none";
    document.body.style.cursor = "col-resize";
    divider.setPointerCapture(e.pointerId);
    divider.addEventListener("pointermove", onPointerMove);
    divider.addEventListener("pointerup", onPointerUp);
  });
}
__name(initDivider, "initDivider");
async function init() {
  const container = document.querySelector("[data-design-builder]");
  if (container) {
    const tokensAttr = container.getAttribute("data-tokens");
    if (!tokensAttr) {
      container.textContent = "Error: No token data found.";
      return;
    }
    let tokens;
    try {
      tokens = JSON.parse(tokensAttr);
    } catch {
      container.textContent = "Error: Invalid token data.";
      return;
    }
    const storage = new LocalStorageAdapter();
    new DesignBuilder(container, tokens, storage);
    initDivider();
    return;
  }
  const customizeData = parseComponentTokenData(window.styleguideCustomizeData);
  if (Object.keys(customizeData).length === 0) {
    return;
  }
  const tokenLibrary = await loadTokenLibrary();
  if (!tokenLibrary) {
    return;
  }
  new ComponentCustomizationTool(customizeData, tokenLibrary);
}
__name(init, "init");
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    void init();
  });
} else {
  void init();
}
//# sourceMappingURL=design-builder.js.map
