var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
import { n as normalizeDesignBuilderOverrideState, a as normalizeTokenOverrides, b as normalizeComponentOverrides, c as browserLocalStorageAdapter, A as ACTIVE_PRESET_KEY, C as COMPONENT_ACTIVE_PRESET_KEY, P as PRESETS_KEY, d as COMPONENT_PRESETS_KEY, G as GENERAL_SCOPE_KEY, N as NON_CUSTOMIZABLE_COMPONENTS, e as GLOBAL_SCOPE_KEY, S as SPLIT_STORAGE_KEY, M as MIN_SPLIT, f as MAX_SPLIT, i as isLocalStoragePersistenceEnabled, g as ComponentOverrideLocalStorageStore, T as TokenOverrideLocalStorageStore, h as hasOverrideStateData } from "../TokenOverrideLocalStorageStore.js";
const t$1 = globalThis, i$1 = /* @__PURE__ */ __name((t2) => t2, "i$1"), s = t$1.trustedTypes, e$1 = s ? s.createPolicy("lit-html", { createHTML: /* @__PURE__ */ __name((t2) => t2, "createHTML") }) : void 0, h = "$lit$", o = `lit$${Math.random().toFixed(9).slice(2)}$`, n = "?" + o, r$1 = `<${n}>`, l$1 = document, c = /* @__PURE__ */ __name(() => l$1.createComment(""), "c"), a = /* @__PURE__ */ __name((t2) => null === t2 || "object" != typeof t2 && "function" != typeof t2, "a"), u = Array.isArray, d = /* @__PURE__ */ __name((t2) => u(t2) || "function" == typeof t2?.[Symbol.iterator], "d"), f = "[ 	\n\f\r]", v = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, _ = /-->/g, m$1 = />/g, p$1 = RegExp(`>|${f}(?:([^\\s"'>=/]+)(${f}*=${f}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), g = /'/g, $ = /"/g, y = /^(?:script|style|textarea|title)$/i, x = /* @__PURE__ */ __name((t2) => (i2, ...s2) => ({ _$litType$: t2, strings: i2, values: s2 }), "x"), b = x(1), E = /* @__PURE__ */ Symbol.for("lit-noChange"), A = /* @__PURE__ */ Symbol.for("lit-nothing"), C = /* @__PURE__ */ new WeakMap(), P = l$1.createTreeWalker(l$1, 129);
function V(t2, i2) {
  if (!u(t2) || !t2.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return void 0 !== e$1 ? e$1.createHTML(i2) : i2;
}
__name(V, "V");
const N = /* @__PURE__ */ __name((t2, i2) => {
  const s2 = t2.length - 1, e2 = [];
  let n2, l2 = 2 === i2 ? "<svg>" : 3 === i2 ? "<math>" : "", c2 = v;
  for (let i3 = 0; i3 < s2; i3++) {
    const s3 = t2[i3];
    let a2, u2, d2 = -1, f2 = 0;
    for (; f2 < s3.length && (c2.lastIndex = f2, u2 = c2.exec(s3), null !== u2); ) f2 = c2.lastIndex, c2 === v ? "!--" === u2[1] ? c2 = _ : void 0 !== u2[1] ? c2 = m$1 : void 0 !== u2[2] ? (y.test(u2[2]) && (n2 = RegExp("</" + u2[2], "g")), c2 = p$1) : void 0 !== u2[3] && (c2 = p$1) : c2 === p$1 ? ">" === u2[0] ? (c2 = n2 ?? v, d2 = -1) : void 0 === u2[1] ? d2 = -2 : (d2 = c2.lastIndex - u2[2].length, a2 = u2[1], c2 = void 0 === u2[3] ? p$1 : '"' === u2[3] ? $ : g) : c2 === $ || c2 === g ? c2 = p$1 : c2 === _ || c2 === m$1 ? c2 = v : (c2 = p$1, n2 = void 0);
    const x2 = c2 === p$1 && t2[i3 + 1].startsWith("/>") ? " " : "";
    l2 += c2 === v ? s3 + r$1 : d2 >= 0 ? (e2.push(a2), s3.slice(0, d2) + h + s3.slice(d2) + o + x2) : s3 + o + (-2 === d2 ? i3 : x2);
  }
  return [V(t2, l2 + (t2[s2] || "<?>") + (2 === i2 ? "</svg>" : 3 === i2 ? "</math>" : "")), e2];
}, "N");
const _S = class _S {
  constructor({ strings: t2, _$litType$: i2 }, e2) {
    let r2;
    this.parts = [];
    let l2 = 0, a2 = 0;
    const u2 = t2.length - 1, d2 = this.parts, [f2, v2] = N(t2, i2);
    if (this.el = _S.createElement(f2, e2), P.currentNode = this.el.content, 2 === i2 || 3 === i2) {
      const t3 = this.el.content.firstChild;
      t3.replaceWith(...t3.childNodes);
    }
    for (; null !== (r2 = P.nextNode()) && d2.length < u2; ) {
      if (1 === r2.nodeType) {
        if (r2.hasAttributes()) for (const t3 of r2.getAttributeNames()) if (t3.endsWith(h)) {
          const i3 = v2[a2++], s2 = r2.getAttribute(t3).split(o), e3 = /([.?@])?(.*)/.exec(i3);
          d2.push({ type: 1, index: l2, name: e3[2], strings: s2, ctor: "." === e3[1] ? I : "?" === e3[1] ? L : "@" === e3[1] ? z : H }), r2.removeAttribute(t3);
        } else t3.startsWith(o) && (d2.push({ type: 6, index: l2 }), r2.removeAttribute(t3));
        if (y.test(r2.tagName)) {
          const t3 = r2.textContent.split(o), i3 = t3.length - 1;
          if (i3 > 0) {
            r2.textContent = s ? s.emptyScript : "";
            for (let s2 = 0; s2 < i3; s2++) r2.append(t3[s2], c()), P.nextNode(), d2.push({ type: 2, index: ++l2 });
            r2.append(t3[i3], c());
          }
        }
      } else if (8 === r2.nodeType) if (r2.data === n) d2.push({ type: 2, index: l2 });
      else {
        let t3 = -1;
        for (; -1 !== (t3 = r2.data.indexOf(o, t3 + 1)); ) d2.push({ type: 7, index: l2 }), t3 += o.length - 1;
      }
      l2++;
    }
  }
  static createElement(t2, i2) {
    const s2 = l$1.createElement("template");
    return s2.innerHTML = t2, s2;
  }
};
__name(_S, "S");
let S = _S;
function M(t2, i2, s2 = t2, e2) {
  if (i2 === E) return i2;
  let h2 = void 0 !== e2 ? s2._$Co?.[e2] : s2._$Cl;
  const o2 = a(i2) ? void 0 : i2._$litDirective$;
  return h2?.constructor !== o2 && (h2?._$AO?.(false), void 0 === o2 ? h2 = void 0 : (h2 = new o2(t2), h2._$AT(t2, s2, e2)), void 0 !== e2 ? (s2._$Co ??= [])[e2] = h2 : s2._$Cl = h2), void 0 !== h2 && (i2 = M(t2, h2._$AS(t2, i2.values), h2, e2)), i2;
}
__name(M, "M");
const _R = class _R {
  constructor(t2, i2) {
    this._$AV = [], this._$AN = void 0, this._$AD = t2, this._$AM = i2;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(t2) {
    const { el: { content: i2 }, parts: s2 } = this._$AD, e2 = (t2?.creationScope ?? l$1).importNode(i2, true);
    P.currentNode = e2;
    let h2 = P.nextNode(), o2 = 0, n2 = 0, r2 = s2[0];
    for (; void 0 !== r2; ) {
      if (o2 === r2.index) {
        let i3;
        2 === r2.type ? i3 = new k(h2, h2.nextSibling, this, t2) : 1 === r2.type ? i3 = new r2.ctor(h2, r2.name, r2.strings, this, t2) : 6 === r2.type && (i3 = new Z(h2, this, t2)), this._$AV.push(i3), r2 = s2[++n2];
      }
      o2 !== r2?.index && (h2 = P.nextNode(), o2++);
    }
    return P.currentNode = l$1, e2;
  }
  p(t2) {
    let i2 = 0;
    for (const s2 of this._$AV) void 0 !== s2 && (void 0 !== s2.strings ? (s2._$AI(t2, s2, i2), i2 += s2.strings.length - 2) : s2._$AI(t2[i2])), i2++;
  }
};
__name(_R, "R");
let R = _R;
const _k = class _k {
  get _$AU() {
    return this._$AM?._$AU ?? this._$Cv;
  }
  constructor(t2, i2, s2, e2) {
    this.type = 2, this._$AH = A, this._$AN = void 0, this._$AA = t2, this._$AB = i2, this._$AM = s2, this.options = e2, this._$Cv = e2?.isConnected ?? true;
  }
  get parentNode() {
    let t2 = this._$AA.parentNode;
    const i2 = this._$AM;
    return void 0 !== i2 && 11 === t2?.nodeType && (t2 = i2.parentNode), t2;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(t2, i2 = this) {
    t2 = M(this, t2, i2), a(t2) ? t2 === A || null == t2 || "" === t2 ? (this._$AH !== A && this._$AR(), this._$AH = A) : t2 !== this._$AH && t2 !== E && this._(t2) : void 0 !== t2._$litType$ ? this.$(t2) : void 0 !== t2.nodeType ? this.T(t2) : d(t2) ? this.k(t2) : this._(t2);
  }
  O(t2) {
    return this._$AA.parentNode.insertBefore(t2, this._$AB);
  }
  T(t2) {
    this._$AH !== t2 && (this._$AR(), this._$AH = this.O(t2));
  }
  _(t2) {
    this._$AH !== A && a(this._$AH) ? this._$AA.nextSibling.data = t2 : this.T(l$1.createTextNode(t2)), this._$AH = t2;
  }
  $(t2) {
    const { values: i2, _$litType$: s2 } = t2, e2 = "number" == typeof s2 ? this._$AC(t2) : (void 0 === s2.el && (s2.el = S.createElement(V(s2.h, s2.h[0]), this.options)), s2);
    if (this._$AH?._$AD === e2) this._$AH.p(i2);
    else {
      const t3 = new R(e2, this), s3 = t3.u(this.options);
      t3.p(i2), this.T(s3), this._$AH = t3;
    }
  }
  _$AC(t2) {
    let i2 = C.get(t2.strings);
    return void 0 === i2 && C.set(t2.strings, i2 = new S(t2)), i2;
  }
  k(t2) {
    u(this._$AH) || (this._$AH = [], this._$AR());
    const i2 = this._$AH;
    let s2, e2 = 0;
    for (const h2 of t2) e2 === i2.length ? i2.push(s2 = new _k(this.O(c()), this.O(c()), this, this.options)) : s2 = i2[e2], s2._$AI(h2), e2++;
    e2 < i2.length && (this._$AR(s2 && s2._$AB.nextSibling, e2), i2.length = e2);
  }
  _$AR(t2 = this._$AA.nextSibling, s2) {
    for (this._$AP?.(false, true, s2); t2 !== this._$AB; ) {
      const s3 = i$1(t2).nextSibling;
      i$1(t2).remove(), t2 = s3;
    }
  }
  setConnected(t2) {
    void 0 === this._$AM && (this._$Cv = t2, this._$AP?.(t2));
  }
};
__name(_k, "k");
let k = _k;
const _H = class _H {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t2, i2, s2, e2, h2) {
    this.type = 1, this._$AH = A, this._$AN = void 0, this.element = t2, this.name = i2, this._$AM = e2, this.options = h2, s2.length > 2 || "" !== s2[0] || "" !== s2[1] ? (this._$AH = Array(s2.length - 1).fill(new String()), this.strings = s2) : this._$AH = A;
  }
  _$AI(t2, i2 = this, s2, e2) {
    const h2 = this.strings;
    let o2 = false;
    if (void 0 === h2) t2 = M(this, t2, i2, 0), o2 = !a(t2) || t2 !== this._$AH && t2 !== E, o2 && (this._$AH = t2);
    else {
      const e3 = t2;
      let n2, r2;
      for (t2 = h2[0], n2 = 0; n2 < h2.length - 1; n2++) r2 = M(this, e3[s2 + n2], i2, n2), r2 === E && (r2 = this._$AH[n2]), o2 ||= !a(r2) || r2 !== this._$AH[n2], r2 === A ? t2 = A : t2 !== A && (t2 += (r2 ?? "") + h2[n2 + 1]), this._$AH[n2] = r2;
    }
    o2 && !e2 && this.j(t2);
  }
  j(t2) {
    t2 === A ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t2 ?? "");
  }
};
__name(_H, "H");
let H = _H;
const _I = class _I extends H {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t2) {
    this.element[this.name] = t2 === A ? void 0 : t2;
  }
};
__name(_I, "I");
let I = _I;
const _L = class _L extends H {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t2) {
    this.element.toggleAttribute(this.name, !!t2 && t2 !== A);
  }
};
__name(_L, "L");
let L = _L;
const _z = class _z extends H {
  constructor(t2, i2, s2, e2, h2) {
    super(t2, i2, s2, e2, h2), this.type = 5;
  }
  _$AI(t2, i2 = this) {
    if ((t2 = M(this, t2, i2, 0) ?? A) === E) return;
    const s2 = this._$AH, e2 = t2 === A && s2 !== A || t2.capture !== s2.capture || t2.once !== s2.once || t2.passive !== s2.passive, h2 = t2 !== A && (s2 === A || e2);
    e2 && this.element.removeEventListener(this.name, this, s2), h2 && this.element.addEventListener(this.name, this, t2), this._$AH = t2;
  }
  handleEvent(t2) {
    "function" == typeof this._$AH ? this._$AH.call(this.options?.host ?? this.element, t2) : this._$AH.handleEvent(t2);
  }
};
__name(_z, "z");
let z = _z;
const _Z = class _Z {
  constructor(t2, i2, s2) {
    this.element = t2, this.type = 6, this._$AN = void 0, this._$AM = i2, this.options = s2;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t2) {
    M(this, t2);
  }
};
__name(_Z, "Z");
let Z = _Z;
const B = t$1.litHtmlPolyfillSupport;
B?.(S, k), (t$1.litHtmlVersions ??= []).push("3.3.2");
const D = /* @__PURE__ */ __name((t2, i2, s2) => {
  const e2 = i2;
  let h2 = e2._$litPart$;
  if (void 0 === h2) {
    const t3 = null;
    e2._$litPart$ = h2 = new k(i2.insertBefore(c(), t3), t3, void 0, {});
  }
  return h2._$AI(t2), h2;
}, "D");
const t = { ATTRIBUTE: 1, PROPERTY: 3, BOOLEAN_ATTRIBUTE: 4 }, e = /* @__PURE__ */ __name((t2) => (...e2) => ({ _$litDirective$: t2, values: e2 }), "e");
const _i = class _i {
  constructor(t2) {
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AT(t2, e2, i2) {
    this._$Ct = t2, this._$AM = e2, this._$Ci = i2;
  }
  _$AS(t2, e2) {
    return this.update(t2, e2);
  }
  update(t2, e2) {
    return this.render(...e2);
  }
};
__name(_i, "i");
let i = _i;
const r = /* @__PURE__ */ __name((o2) => void 0 === o2.strings, "r"), m = {}, p = /* @__PURE__ */ __name((o2, t2 = m) => o2._$AH = t2, "p");
const l = e(class extends i {
  constructor(r$12) {
    if (super(r$12), r$12.type !== t.PROPERTY && r$12.type !== t.ATTRIBUTE && r$12.type !== t.BOOLEAN_ATTRIBUTE) throw Error("The `live` directive is not allowed on child or event bindings");
    if (!r(r$12)) throw Error("`live` bindings can only contain a single expression");
  }
  render(r2) {
    return r2;
  }
  update(i2, [t$12]) {
    if (t$12 === E || t$12 === A) return t$12;
    const o2 = i2.element, l2 = i2.name;
    if (i2.type === t.PROPERTY) {
      if (t$12 === o2[l2]) return E;
    } else if (i2.type === t.BOOLEAN_ATTRIBUTE) {
      if (!!t$12 === o2.hasAttribute(l2)) return E;
    } else if (i2.type === t.ATTRIBUTE && o2.getAttribute(l2) === t$12 + "") return E;
    return p(i2), t$12;
  }
});
const _RangeControl = class _RangeControl extends HTMLElement {
  connectedCallback() {
    this.render();
  }
  // Specify which attributes to observe
  static get observedAttributes() {
    return ["value", "min", "max", "step", "locked", "unit"];
  }
  // React to attribute changes
  attributeChangedCallback() {
    this.render();
  }
  render() {
    const isDisabled = this.hasAttribute("locked");
    const min = this.getAttribute("min") || "0";
    const max = this.getAttribute("max") || "100";
    const step = this.getAttribute("step") || "1";
    const value = this.getAttribute("value") || "";
    const unit = this.getAttribute("unit") || "";
    const markup = /* @__PURE__ */ __name(() => b`
				<input type="range" min=${min} max=${max} step=${step} .value=${l(value)} ?disabled=${isDisabled} @input=${(e2) => this._onInput(e2)}/>
                <output>${value} ${unit}</output>
            `, "markup");
    D(markup(), this);
  }
  _onInput(e2) {
    const value = e2.target.value;
    this.dispatchEvent(
      new CustomEvent("change", {
        detail: { value },
        bubbles: true,
        composed: true
      })
    );
  }
};
__name(_RangeControl, "RangeControl");
let RangeControl = _RangeControl;
customElements.define("range-control", RangeControl);
const _SelectControl = class _SelectControl extends HTMLElement {
  connectedCallback() {
    this.render();
  }
  // Specify which attributes to observe
  static get observedAttributes() {
    return ["value", "locked", "options"];
  }
  // React to attribute changes
  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      this.render();
    }
  }
  render() {
    const isDisabled = this.hasAttribute("locked");
    const value = this.getAttribute("value") || "";
    const options = this.getOptions();
    const markup = /* @__PURE__ */ __name(() => b`
				<select .value=${l(value)} ?disabled=${isDisabled} @change=${(e2) => this._onInput(e2)}>
					${options.map((option) => b`<option value=${option.value}>${option.label}</option>`)}
				</select>
            `, "markup");
    D(markup(), this);
  }
  getOptions() {
    const optionsAttr = this.getAttribute("options");
    const value = this.getAttribute("value") || "";
    if (!optionsAttr) {
      return [];
    }
    try {
      const parsedOptions = JSON.parse(optionsAttr);
      if (Array.isArray(parsedOptions)) {
        return parsedOptions.map((option) => ({ value: option, label: option, selected: option === value }));
      } else if (typeof parsedOptions === "object") {
        return Object.entries(parsedOptions).map(([key, label]) => ({
          value: key,
          label,
          selected: key === value
        }));
      }
    } catch (error) {
      console.error("Failed to parse options attribute:", error);
    }
    return [];
  }
  _onInput(e2) {
    const value = e2.target.value;
    this.dispatchEvent(
      new CustomEvent("change", {
        detail: { value },
        bubbles: true,
        composed: true
      })
    );
  }
};
__name(_SelectControl, "SelectControl");
let SelectControl = _SelectControl;
customElements.define("select-control", SelectControl);
const _ColorControl = class _ColorControl extends HTMLElement {
  connectedCallback() {
    this.render();
  }
  static get observedAttributes() {
    return ["value", "locked", "placeholder"];
  }
  attributeChangedCallback() {
    this.render();
  }
  render() {
    const value = this.getAttribute("value") || "";
    const placeholder = this.getAttribute("placeholder") || "";
    const isDisabled = this.hasAttribute("locked");
    const markup = /* @__PURE__ */ __name(() => b`
				<input
					type="color"
					class="db-control-color-input"
					.value=${l(toHex$1(value))}
					?disabled=${isDisabled}
					@input=${(event) => this.onColorInput(event)}
				/>
				<input
					type="text"
					class="db-control-text"
					.value=${l(value)}
					?disabled=${isDisabled}
					placeholder=${placeholder}
					@change=${(event) => this.onTextChange(event)}
				/>
			`, "markup");
    D(markup(), this);
  }
  onColorInput(event) {
    const value = event.target.value;
    this.emitChange(value);
  }
  onTextChange(event) {
    const value = event.target.value;
    this.emitChange(value);
  }
  emitChange(value) {
    this.dispatchEvent(
      new CustomEvent("change", {
        detail: { value },
        bubbles: true,
        composed: true
      })
    );
  }
};
__name(_ColorControl, "ColorControl");
let ColorControl = _ColorControl;
customElements.define("color-control", ColorControl);
function toHex$1(color) {
  if (/^#[0-9a-f]{6}$/i.test(color)) return color;
  if (/^#[0-9a-f]{3}$/i.test(color)) {
    return `#${color[1]}${color[1]}${color[2]}${color[2]}${color[3]}${color[3]}`;
  }
  const temp = document.createElement("div");
  temp.style.color = color;
  document.body.appendChild(temp);
  const computed = getComputedStyle(temp).color;
  document.body.removeChild(temp);
  const match = computed.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
  if (match) {
    const r2 = parseInt(match[1], 10).toString(16).padStart(2, "0");
    const g2 = parseInt(match[2], 10).toString(16).padStart(2, "0");
    const b2 = parseInt(match[3], 10).toString(16).padStart(2, "0");
    return `#${r2}${g2}${b2}`;
  }
  return "#000000";
}
__name(toHex$1, "toHex$1");
const _RgbaControl = class _RgbaControl extends HTMLElement {
  connectedCallback() {
    this.render();
  }
  static get observedAttributes() {
    return ["value", "locked", "placeholder"];
  }
  attributeChangedCallback() {
    this.render();
  }
  render() {
    const value = this.getAttribute("value") || "";
    const placeholder = this.getAttribute("placeholder") || "";
    const isDisabled = this.hasAttribute("locked");
    const parsed = parseRgba(value);
    const alphaValue = String(parsed.a);
    const colorValue = toHex(`rgb(${parsed.r}, ${parsed.g}, ${parsed.b})`);
    const markup = /* @__PURE__ */ __name(() => b`
				<input
					type="color"
					class="db-control-color-input"
					.value=${l(colorValue)}
					?disabled=${isDisabled}
					@input=${() => this.syncFromColorAndAlpha()}
				/>
				<input
					type="range"
					class="db-control-alpha"
					min="0"
					max="1"
					step="0.01"
					.value=${l(alphaValue)}
					?disabled=${isDisabled}
					@input=${() => this.syncFromColorAndAlpha()}
				/>
				<span class="db-control-value-display db-control-alpha-display">${alphaValue}</span>
				<input
					type="text"
					class="db-control-text"
					.value=${l(value)}
					?disabled=${isDisabled}
					placeholder=${placeholder}
					@change=${(event) => this.syncFromText(event)}
				/>
			`, "markup");
    D(markup(), this);
  }
  syncFromColorAndAlpha() {
    const colorInput = this.querySelector('input[type="color"]');
    const alphaInput = this.querySelector(".db-control-alpha");
    if (!colorInput || !alphaInput) {
      return;
    }
    const { r: r2, g: g2, b: b2 } = hexToRgb(colorInput.value);
    const a2 = parseFloat(alphaInput.value);
    const value = toRgbaString(r2, g2, b2, a2);
    this.emitChange(value);
  }
  syncFromText(event) {
    const textValue = event.target.value;
    const parsed = parseRgba(textValue);
    const value = toRgbaString(parsed.r, parsed.g, parsed.b, parsed.a);
    this.emitChange(value);
  }
  emitChange(value) {
    this.dispatchEvent(
      new CustomEvent("change", {
        detail: { value },
        bubbles: true,
        composed: true
      })
    );
  }
};
__name(_RgbaControl, "RgbaControl");
let RgbaControl = _RgbaControl;
customElements.define("rgba-control", RgbaControl);
function hexToRgb(hex) {
  return {
    r: parseInt(hex.slice(1, 3), 16),
    g: parseInt(hex.slice(3, 5), 16),
    b: parseInt(hex.slice(5, 7), 16)
  };
}
__name(hexToRgb, "hexToRgb");
function parseRgba(value) {
  const match = value.match(/rgba?\(\s*(\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\s*\)/);
  if (match) {
    return {
      r: parseInt(match[1], 10),
      g: parseInt(match[2], 10),
      b: parseInt(match[3], 10),
      a: match[4] !== void 0 ? parseFloat(match[4]) : 1
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
function toRgbaString(r2, g2, b2, a2) {
  return `rgba(${r2}, ${g2}, ${b2}, ${a2})`;
}
__name(toRgbaString, "toRgbaString");
function toHex(color) {
  if (/^#[0-9a-f]{6}$/i.test(color)) return color;
  if (/^#[0-9a-f]{3}$/i.test(color)) {
    return `#${color[1]}${color[1]}${color[2]}${color[2]}${color[3]}${color[3]}`;
  }
  const temp = document.createElement("div");
  temp.style.color = color;
  document.body.appendChild(temp);
  const computed = getComputedStyle(temp).color;
  document.body.removeChild(temp);
  const match = computed.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
  if (match) {
    const r2 = parseInt(match[1], 10).toString(16).padStart(2, "0");
    const g2 = parseInt(match[2], 10).toString(16).padStart(2, "0");
    const b2 = parseInt(match[3], 10).toString(16).padStart(2, "0");
    return `#${r2}${g2}${b2}`;
  }
  return "#000000";
}
__name(toHex, "toHex");
const _FontControl = class _FontControl extends HTMLElement {
  connectedCallback() {
    this.render();
  }
  static get observedAttributes() {
    return ["value", "locked", "placeholder"];
  }
  attributeChangedCallback() {
    this.render();
  }
  render() {
    const value = this.getAttribute("value") || "";
    const placeholder = this.getAttribute("placeholder") || "";
    const isDisabled = this.hasAttribute("locked");
    const markup = /* @__PURE__ */ __name(() => b`
				<input
					type="text"
					class="db-control-text db-control-text-font"
					.value=${l(value)}
					?disabled=${isDisabled}
					placeholder=${placeholder}
					@change=${(event) => this.onInputChange(event)}
				/>
			`, "markup");
    D(markup(), this);
  }
  onInputChange(event) {
    const value = event.target.value;
    this.dispatchEvent(
      new CustomEvent("change", {
        detail: { value },
        bubbles: true,
        composed: true
      })
    );
  }
};
__name(_FontControl, "FontControl");
let FontControl = _FontControl;
customElements.define("font-control", FontControl);
const DESIGN_BUILDER_ACTION_EVENT = "design-builder:action";
function createActionEvent(eventName, detail) {
  return new CustomEvent(eventName, {
    detail,
    bubbles: true,
    composed: true
  });
}
__name(createActionEvent, "createActionEvent");
function emitDesignBuilderActionEvent(hostElement, detail) {
  hostElement.dispatchEvent(createActionEvent(DESIGN_BUILDER_ACTION_EVENT, detail));
  hostElement.dispatchEvent(createActionEvent(`design-builder:${detail.action}`, detail));
}
__name(emitDesignBuilderActionEvent, "emitDesignBuilderActionEvent");
const designBuilderStyles = '.db-builder,:host{--db-font-family:Inter,Roboto,-apple-system,BlinkMacSystemFont,"Segoe UI","Helvetica Neue",Arial,sans-serif;--db-font-family-mono:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,"Liberation Mono",monospace;--db-bg:#f5f7fb;--db-surface:#fff;--db-surface-2:#f8f9fc;--db-surface-3:#f1f4f9;--db-text:#1f2937;--db-text-muted:#5f6b7c;--db-border:#d6deea;--db-border-strong:#b7c3d8;--db-shadow:0 1px 2px rgba(18,28,45,.08),0 8px 26px rgba(18,28,45,.06);--db-focus:#2563eb;--db-primary:#2357d8;--db-primary-soft:#e8eeff;--db-danger:#d22f3d;--db-danger-soft:#ffeef0;--db-hc-bg:#0b0f19;--db-hc-surface:#111827;--db-hc-surface-2:#1b2537;--db-hc-surface-3:#243249;--db-hc-text:#fff;--db-hc-text-muted:#d9e2f0;--db-hc-border:#e6eefb;--db-hc-border-strong:#fff;--db-hc-focus:#ffd43b;--db-hc-primary:#9cc2ff;--db-hc-primary-soft:#1d2f4d;--db-hc-danger:#ff9aa6;--db-hc-danger-soft:#4a1f2a;--db-hc-success:#88f1c0;--db-radius-s:6px;--db-radius-m:10px;--db-radius-l:14px;--db-header-control-height:2rem;--db-header-icon-control-width:2.25rem;--db-control-label-col:clamp(120px,34%,190px);--db-control-action-col:3.25rem;color:var(--db-text);color-scheme:light;font-family:var(--db-font-family);line-height:1.4}:host{background:var(--db-bg);display:block;overflow-y:auto;padding:2rem 1.5rem 4rem}@media (prefers-color-scheme:dark){.db-builder,:host{--db-bg:#0f1522;--db-surface:#161e2d;--db-surface-2:#1a2436;--db-surface-3:#1f2a3e;--db-text:#e6ebf5;--db-text-muted:#a8b5cd;--db-border:#2f3b53;--db-border-strong:#455371;--db-shadow:0 0 0 1px rgba(125,145,183,.15),0 20px 40px rgba(0,0,0,.45);--db-focus:#7aa2ff;--db-primary:#7aa2ff;--db-primary-soft:#1b2b52;--db-danger:#ff7e8a;--db-danger-soft:#3e1d26;color-scheme:dark}}@media (prefers-contrast:more){.db-builder,:host{--db-bg:var(--db-hc-bg);--db-surface:var(--db-hc-surface);--db-surface-2:var(--db-hc-surface-2);--db-surface-3:var(--db-hc-surface-3);--db-text:var(--db-hc-text);--db-text-muted:var(--db-hc-text-muted);--db-border:var(--db-hc-border);--db-border-strong:var(--db-hc-border-strong);--db-focus:var(--db-hc-focus);--db-primary:var(--db-hc-primary);--db-primary-soft:var(--db-hc-primary-soft);--db-danger:var(--db-hc-danger);--db-danger-soft:var(--db-hc-danger-soft);--db-shadow:none}}@media (forced-colors:active){.db-builder,:host{--db-hc-bg:Canvas;--db-hc-surface:Canvas;--db-hc-surface-2:Canvas;--db-hc-surface-3:Canvas;--db-hc-text:CanvasText;--db-hc-text-muted:CanvasText;--db-hc-border:ButtonBorder;--db-hc-border-strong:ButtonBorder;--db-hc-focus:Highlight;--db-hc-primary:LinkText;--db-hc-primary-soft:Canvas;--db-hc-danger:MarkText;--db-hc-danger-soft:Canvas;--db-hc-success:CanvasText;--db-bg:var(--db-hc-bg);--db-surface:var(--db-hc-surface);--db-surface-2:var(--db-hc-surface-2);--db-surface-3:var(--db-hc-surface-3);--db-text:var(--db-hc-text);--db-text-muted:var(--db-hc-text-muted);--db-border:var(--db-hc-border);--db-border-strong:var(--db-hc-border-strong);--db-focus:var(--db-hc-focus);--db-primary:var(--db-hc-primary);--db-primary-soft:var(--db-hc-primary-soft);--db-danger:var(--db-hc-danger);--db-danger-soft:var(--db-hc-danger-soft);--db-shadow:none}}.db-builder,.db-builder *,:host,:host *{box-sizing:border-box}.db-builder :is(button,input,select,textarea):focus-visible,:host :is(button,input,select,textarea):focus-visible{outline:2px solid var(--db-focus);outline-offset:2px}.db-categories{display:grid;gap:1rem}.db-header{align-items:baseline;border-bottom:1px solid var(--db-border);display:flex;flex-wrap:wrap;gap:.75rem 1rem;margin-bottom:.75rem;padding:0 0 1.25rem}.db-header-actions{align-items:center;display:flex;flex-wrap:nowrap;gap:.5rem;width:100%}.db-header-actions-right{align-items:center;display:inline-flex;flex-wrap:wrap;gap:.5rem;margin-left:auto}.db-header-actions-right>.db-btn,.db-header-actions-right>.db-header-menu>.db-header-menu-trigger{justify-content:center;min-width:var(--db-header-icon-control-width);padding-inline:0;width:var(--db-header-icon-control-width)}.db-mode-switch{align-items:center;background:var(--db-surface-2);border:1px solid var(--db-border);border-radius:var(--db-radius-s);display:inline-flex;height:var(--db-header-control-height);padding:1px}.db-mode-switch-button{align-items:center;background:transparent;border:0;border-radius:var(--db-radius-s);color:var(--db-text-muted);cursor:pointer;display:inline-flex;font:inherit;font-size:.8rem;font-weight:600;height:100%;justify-content:center;padding:0 .7rem;transition:background-color .15s ease,color .15s ease}.db-mode-switch-button:hover{color:var(--db-text)}.db-mode-switch-button-active{background:var(--db-surface);box-shadow:0 1px 2px rgba(18,28,45,.12);color:var(--db-text)}.db-header-toggle-row{align-items:center;background:var(--db-surface);border:1px solid var(--db-border);border-radius:var(--db-radius-s);color:var(--db-text-muted);display:inline-flex;font-size:.8125rem;gap:.4rem;height:var(--db-header-control-height);justify-content:flex-start;padding:0 .6rem;user-select:none}.db-header-toggle-row[aria-pressed=true]{background:var(--db-primary-soft);border-color:color-mix(in srgb,var(--db-primary) 35%,var(--db-border));color:var(--db-primary)}.db-btn{align-items:center;background:var(--db-surface);border:1px solid var(--db-border);border-radius:var(--db-radius-s);color:var(--db-text);cursor:pointer;display:inline-flex;font-family:inherit;font-size:.8125rem;gap:.5rem;height:var(--db-header-control-height);line-height:1.35;padding:0 .72rem;transition:background-color .15s ease,border-color .15s ease,color .15s ease,transform .08s ease;white-space:nowrap}.db-btn:hover{background:var(--db-surface-2);border-color:var(--db-border-strong)}.db-btn:active{transform:translateY(1px)}.db-btn-icon{flex:0 0 auto;height:1rem;width:1rem}.db-tooltip-target{position:relative}.db-tooltip-target:after,.db-tooltip-target:before{opacity:0;pointer-events:none;position:absolute;transition:opacity .12s ease;z-index:40}.db-tooltip-target:before{border:5px solid transparent;border-bottom:5px solid color-mix(in srgb,var(--db-surface-3) 70%,var(--db-border));content:"";left:50%;top:calc(100% + 2px);transform:translateX(-50%)}.db-tooltip-target:after{background:color-mix(in srgb,var(--db-surface-3) 70%,var(--db-border));border-radius:var(--db-radius-s);box-shadow:var(--db-shadow);color:var(--db-text);content:attr(data-tooltip);font-size:.72rem;left:50%;line-height:1.2;padding:.3rem .45rem;top:calc(100% + 10px);transform:translateX(-50%);white-space:nowrap}.db-tooltip-target:focus-visible:after,.db-tooltip-target:focus-visible:before,.db-tooltip-target:hover:after,.db-tooltip-target:hover:before{opacity:1}.db-btn-primary{background:var(--db-primary-soft);border-color:color-mix(in srgb,var(--db-primary) 35%,var(--db-border));color:var(--db-primary)}.db-btn-primary:hover{background:color-mix(in srgb,var(--db-primary-soft) 65%,var(--db-surface));border-color:color-mix(in srgb,var(--db-primary) 55%,var(--db-border))}.db-btn-danger{background:var(--db-danger-soft);border-color:color-mix(in srgb,var(--db-danger) 30%,var(--db-border));color:var(--db-danger)}.db-btn-danger:hover{border-color:color-mix(in srgb,var(--db-danger) 50%,var(--db-border))}.db-presets{align-items:center;border-bottom:1px solid var(--db-border);display:flex;flex-wrap:wrap;gap:.5rem;margin:0 0 1.5rem;padding:.2rem 0 1rem}.db-presets>.db-builder-context-row{flex:1 1 16rem;min-width:0}.db-presets>.db-header-actions{align-self:end}.db-presets>.db-header-actions .db-btn{align-items:center;height:2rem;min-height:2rem;padding-block:0}.db-control-info-btn{align-items:center;background:none;border:none;color:var(--db-text-muted);cursor:help;display:inline-flex;flex-shrink:0;height:1rem;justify-content:center;margin-left:.25rem;padding:0;position:relative;top:-.08em;vertical-align:middle;width:1rem}.db-control-info-btn svg{fill:currentColor;height:100%;width:100%}.db-control-info-btn.db-tooltip-target:before{display:none}.db-control-info-btn.db-tooltip-target:after{content:none;display:none;left:auto;right:0;transform:none;white-space:pre}.db-control-info-btn.db-tooltip-target:after,.db-floating-tooltip{text-wrap:balance;font-style:normal;line-height:1.4;max-width:22rem;text-align:left}.db-floating-tooltip{--db-tooltip-arrow-left:50%;background:color-mix(in srgb,var(--db-surface-3) 70%,var(--db-border));border-radius:var(--db-radius-s);box-shadow:var(--db-shadow);color:var(--db-text);font-size:.72rem;left:0;max-height:calc(100vh - 1.5rem);opacity:0;overflow:auto;padding:.42rem .55rem;pointer-events:none;position:fixed;top:0;transition:opacity .12s ease;visibility:hidden;white-space:pre-line;width:min(22rem,calc(100vw - 1.5rem));z-index:60}.db-floating-tooltip:before{background:inherit;border-radius:2px;content:"";height:.75rem;left:var(--db-tooltip-arrow-left);position:absolute;top:-.38rem;transform:translateX(-50%) rotate(45deg);width:.75rem}.db-floating-tooltip-visible{opacity:1;visibility:visible}.db-header-menu{display:inline-flex;position:relative}.db-header-menu summary{list-style:none}.db-header-menu summary::-webkit-details-marker{display:none}.db-header-menu-trigger{align-items:center;justify-content:center;min-width:2.25rem;padding-inline:.4rem}.db-header-menu-content{background:var(--db-surface);border:1px solid var(--db-border);border-radius:var(--db-radius-s);box-shadow:var(--db-shadow);display:none;min-width:11.5rem;padding:.35rem;position:absolute;right:0;top:calc(100% + .35rem);z-index:20}.db-header-menu[open] .db-header-menu-content{display:grid;gap:.35rem}.db-header-menu-content .db-btn{justify-content:flex-start;width:100%}.db-header-menu-danger .db-header-menu-trigger{background:var(--db-danger-soft);border-color:color-mix(in srgb,var(--db-danger) 30%,var(--db-border));color:var(--db-danger)}.db-header-menu-danger .db-header-menu-trigger:hover{border-color:color-mix(in srgb,var(--db-danger) 50%,var(--db-border))}.db-presets-menu{align-self:end;display:inline-flex;position:relative}.db-presets-menu summary{list-style:none}.db-presets-menu summary::-webkit-details-marker{display:none}.db-presets-menu-trigger{align-items:center;height:2rem;justify-content:center;min-height:2rem;min-width:2.25rem;padding-inline:.4rem}.db-presets-menu-content{background:var(--db-surface);border:1px solid var(--db-border);border-radius:var(--db-radius-s);box-shadow:var(--db-shadow);display:none;min-width:11.5rem;padding:.35rem;position:absolute;right:0;top:calc(100% + .35rem);z-index:20}.db-presets-menu[open] .db-presets-menu-content{display:grid;gap:.35rem}.db-presets-menu-content .db-btn{justify-content:flex-start;width:100%}.db-presets-list{display:flex;flex:1;flex-wrap:wrap;gap:.375rem}.db-presets-chip{align-items:center;background:var(--db-surface-2);border:1px solid var(--db-border);border-radius:999px;color:var(--db-text-muted);cursor:pointer;display:inline-flex;font-family:inherit;font-size:.8rem;gap:.25rem;line-height:1.35;padding:.36rem .62rem;transition:background-color .15s ease,border-color .15s ease;white-space:nowrap}.db-presets-chip:hover{background:var(--db-surface-3);border-color:var(--db-border-strong)}.db-presets-chip-active{background:var(--db-primary-soft);border-color:color-mix(in srgb,var(--db-primary) 35%,var(--db-border));color:var(--db-primary);font-weight:600}.db-presets-chip-label{pointer-events:none}.db-presets-chip-delete{align-items:center;border-radius:999px;color:var(--db-text-muted);display:inline-flex;font-size:.875rem;height:1rem;justify-content:center;line-height:1;transition:color .15s ease,background-color .15s ease;width:1rem}.db-presets-chip-delete:hover{background:color-mix(in srgb,var(--db-danger-soft) 70%,transparent);color:var(--db-danger)}.db-category{background:var(--db-surface);border:1px solid var(--db-border);border-radius:var(--db-radius-m);box-shadow:var(--db-shadow);overflow:clip}.db-category-header{align-items:center;background:var(--db-surface-2);border-bottom:1px solid var(--db-border);cursor:pointer;display:flex;gap:.75rem;padding:.95rem 1.1rem;user-select:none}.db-category-title{font-size:1.05rem;font-weight:600;margin:0}.db-category-description{color:var(--db-text-muted);flex:1;font-size:.8125rem;margin:0}.db-category-toggle{color:var(--db-text-muted);height:.95rem;margin-left:auto;opacity:.9;position:relative;width:.95rem}.db-category-toggle:after,.db-category-toggle:before{background:currentColor;border-radius:999px;content:"";height:2px;left:50%;position:absolute;top:50%;transform:translate(-50%,-50%);transition:transform .2s ease,opacity .2s ease;width:100%}.db-category-toggle:before{transform:translate(-50%,-50%) rotate(90deg) scaleX(0)}.db-category-collapsed .db-category-toggle:before{transform:translate(-50%,-50%) rotate(90deg) scaleX(1)}.db-category-header:hover .db-category-toggle{color:var(--db-text-muted);opacity:1}.db-category-collapsed .db-category-body{display:none}.db-category-body{padding:.6rem 1.1rem}db-control-row .db-control-row{align-items:center;border-bottom:1px solid color-mix(in srgb,var(--db-border) 70%,transparent);display:grid;gap:.25rem .7rem;grid-template-columns:var(--db-control-label-col) minmax(0,1fr) var(--db-control-action-col);grid-template-rows:auto auto auto;padding:.82rem 0}db-control-row .db-control-row:last-child{border-bottom:none}db-control-row[locked] .db-control-row{opacity:.65}db-readonly-control-row .db-control-row{gap:.5rem 1rem;grid-template-columns:minmax(180px,240px) minmax(0,1fr);grid-template-rows:auto;opacity:1}.db-control-row-label{font-size:.875rem;font-weight:600;grid-column:1;grid-row:1}.db-control-row-info{background:color-mix(in srgb,var(--db-surface-2) 82%,transparent);border:1px solid color-mix(in srgb,var(--db-border) 80%,transparent);border-radius:var(--db-radius-s);box-shadow:inset 0 1px 0 hsla(0,0%,100%,.12);display:grid;gap:.3rem;grid-column:1/-1;grid-row:2;padding:.55rem .7rem}.db-control-row-info-description{color:var(--db-text-muted);font-size:.75rem;margin:0}.db-control-row-info-variable{align-items:center;background:color-mix(in srgb,var(--db-surface) 88%,var(--db-border));border:1px solid color-mix(in srgb,var(--db-border) 85%,transparent);border-radius:999px;color:var(--db-text);display:inline-flex;font-family:var(--db-font-family-mono);font-size:.68rem;justify-self:start;max-width:100%;overflow-wrap:anywhere;padding:.18rem .48rem}db-control-row[info-open] .db-control-row{grid-template-rows:auto auto auto auto}db-control-row[info-open] .db-control-row-variable{grid-row:3}db-control-row[info-open] .db-control-row-description{grid-row:4}db-control-row[info-open] .db-control-row-input,db-control-row[info-open] .db-control-row-reset{grid-row:1/4}db-readonly-control-row[info-open] .db-control-row{grid-template-rows:auto auto}.db-control-row-variable{color:var(--db-text-muted);font-family:var(--db-font-family-mono);font-size:.7rem;grid-column:1;grid-row:2;overflow-wrap:anywhere}.db-control-row-description{color:var(--db-text-muted);font-size:.75rem;grid-column:1/-1;grid-row:3}.db-control-row-input{align-items:center;align-self:stretch;display:flex;gap:.5rem;grid-column:2;grid-row:1/3;height:100%;min-width:0}font-control,select-control{display:block;min-width:0;width:100%}color-control,rgba-control{align-items:center;display:flex;gap:.5rem;min-width:0;width:100%}.db-control-row-reset{align-self:center;background:var(--db-surface-2);border:1px solid var(--db-border);border-radius:var(--db-radius-s);color:var(--db-text-muted);cursor:pointer;font:inherit;font-size:.78rem;grid-column:3;grid-row:1/3;justify-self:end;padding:.36rem .62rem;white-space:nowrap}.db-control-row-reset:hover{background:var(--db-surface-3);border-color:var(--db-border-strong);color:var(--db-text)}.db-control-row-readonly-value{align-items:center;display:flex;gap:.5rem}.db-control-row-swatch{background-image:conic-gradient(from 45deg,#d8dce5 0deg 90deg,#edf0f6 90deg 180deg,#d8dce5 180deg 270deg,#edf0f6 270deg);background-size:8px 8px;border:1px solid color-mix(in srgb,var(--db-border) 80%,var(--db-text) 20%);border-radius:var(--db-radius-s);flex-shrink:0;height:1.45rem;overflow:hidden;width:1.45rem}.db-control-color-input{-webkit-appearance:none;appearance:none;background:var(--db-surface);border:1px solid var(--db-border);border-radius:var(--db-radius-s);cursor:pointer;flex:0 0 2.2rem;height:2rem;padding:.14rem;width:2.2rem}.db-control-color-input:disabled{cursor:not-allowed;opacity:.7}.db-control-color-input::-webkit-color-swatch-wrapper{padding:0}.db-control-color-input::-webkit-color-swatch{border:none;border-radius:calc(var(--db-radius-s) - 2px)}.db-control-color-input::-moz-color-swatch{border:none;border-radius:calc(var(--db-radius-s) - 2px)}.db-control-text,select-control select{background:var(--db-surface);border:1px solid var(--db-border);border-radius:var(--db-radius-s);color:var(--db-text);font:inherit;font-size:.825rem;height:2rem;min-width:5.25rem;padding:.35rem .55rem;width:100%}.db-control-text::placeholder{color:color-mix(in srgb,var(--db-text-muted) 75%,transparent)}.db-control-text-font{font-family:var(--db-font-family-mono)}.db-control-alpha{accent-color:var(--db-primary);min-width:84px;width:min(132px,30vw)}.db-control-alpha-display{min-width:3.1rem}.db-control-value-display{align-items:center;background:var(--db-surface-2);border:1px solid var(--db-border);border-radius:var(--db-radius-s);color:var(--db-text-muted);display:inline-flex;font-family:var(--db-font-family-mono);font-size:.75rem;justify-content:center;min-height:2rem;padding:0 .45rem}.db-control-value-readonly{font-size:.78rem;justify-content:flex-start;padding:.35rem .55rem;width:100%}range-control{align-items:center;align-self:stretch;display:grid;gap:.65rem;grid-template-columns:minmax(0,1fr) auto;height:100%;min-width:0;width:100%}range-control input[type=range]{accent-color:var(--db-primary);width:100%}range-control output{color:var(--db-text-muted);font-family:var(--db-font-family-mono);font-size:.75rem;min-width:4.25rem;text-align:right}.db-control-alpha:disabled,.db-control-text:disabled,range-control input[type=range]:disabled,select-control select:disabled{cursor:not-allowed;opacity:.75}color-control .db-control-text,rgba-control .db-control-text{flex:1 1 auto;min-width:5.25rem}db-swatch-band .db-swatch-band{display:grid;gap:.65rem}db-swatch-band .db-swatch-band-row{align-items:center;border-bottom:1px solid color-mix(in srgb,var(--db-border) 70%,transparent);display:grid;gap:.5rem 1rem;grid-template-columns:minmax(180px,240px) minmax(0,1fr);padding:.55rem 0}db-swatch-band .db-swatch-band-row:last-child{border-bottom:none}db-swatch-band .db-swatch-band-var{color:var(--db-text-muted);font-family:var(--db-font-family-mono);font-size:.7rem}db-swatch-band .db-swatch-band-strip{display:grid;gap:.5rem;grid-template-columns:repeat(auto-fit,minmax(56px,1fr))}db-swatch-band .db-swatch-band-swatch{align-items:flex-end;border:1px solid color-mix(in srgb,var(--db-border) 75%,transparent);border-radius:var(--db-radius-s);box-shadow:inset 0 0 0 1px hsla(0,0%,100%,.2);display:flex;justify-content:center;min-height:3rem;overflow:hidden}db-swatch-band .db-swatch-band-pct{background:rgba(0,0,0,.45);border-radius:999px;color:#fff;font-family:var(--db-font-family-mono);font-size:.66rem;line-height:1.3;margin-bottom:.28rem;padding:.12rem .35rem}.db-builder{color:var(--db-text);container-name:design-builder;container-type:inline-size;display:block;font-family:var(--db-font-family);line-height:1.4}.db-builder-customizer,.db-builder-fullpage{display:flex;flex-direction:column;min-height:100%;padding-bottom:0}.db-builder-customizer .db-categories,.db-builder-fullpage .db-categories{flex:1 1 auto;min-height:0}.db-builder-customizer{display:flex;min-width:0;overflow-x:hidden}.db-builder-customizer .db-categories{margin-bottom:.75rem;min-width:0}.db-builder-customizer .db-category-body,.db-builder-fullpage .db-category-body{overflow-x:auto}.db-builder-customizer .db-category,.db-builder-customizer .db-category-body{min-width:0}.db-builder-customizer .db-control-row-description,.db-builder-customizer .db-control-row-variable,.db-builder-fullpage .db-control-row-description,.db-builder-fullpage .db-control-row-variable{display:none}.db-builder-customizer db-control-row .db-control-row,.db-builder-fullpage db-control-row .db-control-row{align-items:start;column-gap:.7rem;grid-template-columns:minmax(0,1fr) auto;grid-template-rows:auto auto;min-width:360px;row-gap:.45rem}.db-builder-customizer db-control-row .db-control-row{min-width:0}.db-builder-customizer .db-control-row-label,.db-builder-fullpage .db-control-row-label{align-items:center;display:flex;gap:.2rem;grid-column:1/-1;grid-row:1;min-width:0;overflow:visible}.db-builder-customizer db-control-row[info-open] .db-control-row,.db-builder-fullpage db-control-row[info-open] .db-control-row{grid-template-rows:auto auto auto}.db-builder-customizer db-control-row[info-open] .db-control-row-input,.db-builder-customizer db-control-row[info-open] .db-control-row-reset,.db-builder-fullpage db-control-row[info-open] .db-control-row-input,.db-builder-fullpage db-control-row[info-open] .db-control-row-reset{grid-row:3}.db-builder-customizer .db-control-row-label-text,.db-builder-fullpage .db-control-row-label-text{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.db-builder-customizer .db-control-row-input,.db-builder-fullpage .db-control-row-input{flex-wrap:nowrap;grid-column:1;grid-row:2;margin-top:0;min-width:220px;overflow-x:auto;overflow-y:hidden;white-space:nowrap}.db-builder-customizer .db-control-row-input{min-width:0;overflow-x:visible;overflow-y:visible;white-space:normal}.db-builder-customizer .db-control-row-reset,.db-builder-fullpage .db-control-row-reset{align-self:center;grid-column:2;grid-row:2;white-space:nowrap}.db-builder-customizer color-control,.db-builder-customizer rgba-control,.db-builder-fullpage color-control,.db-builder-fullpage rgba-control{flex-wrap:nowrap}.db-builder-context-grid{display:grid;flex:1;gap:.75rem;grid-template-columns:repeat(2,minmax(0,1fr))}.db-builder-context-row{color:var(--db-text-muted);display:grid;font-size:.75rem;font-weight:600;gap:.35rem}@container design-builder (max-width: 56rem){.db-header-actions{width:100%}.db-header-actions-right{justify-content:flex-end;width:100%}.db-builder-customizer db-control-row .db-control-row,.db-builder-fullpage db-control-row .db-control-row{grid-template-columns:minmax(0,1fr) auto;grid-template-rows:auto auto}.db-builder-customizer .db-control-row-label,.db-builder-fullpage .db-control-row-label{grid-column:1/-1;grid-row:1}.db-builder-customizer .db-control-row-input,.db-builder-fullpage .db-control-row-input{grid-column:1;grid-row:2;margin-top:0}.db-builder-customizer .db-control-row-reset,.db-builder-fullpage .db-control-row-reset{grid-column:2;grid-row:2;justify-self:end}db-control-row .db-control-row,db-readonly-control-row .db-control-row,db-swatch-band .db-swatch-band-row{grid-template-columns:minmax(0,1fr);grid-template-rows:auto}.db-control-row-description,.db-control-row-input,.db-control-row-label,.db-control-row-reset,.db-control-row-variable{grid-column:auto;grid-row:auto}.db-control-row-input{margin-top:.25rem}.db-control-row-reset{justify-self:end}color-control,rgba-control{flex-wrap:wrap}.db-builder-customizer db-control-row .db-control-row,.db-builder-fullpage db-control-row .db-control-row{grid-template-columns:minmax(0,1fr) auto;grid-template-rows:auto auto}.db-builder-customizer .db-control-row-description,.db-builder-customizer .db-control-row-variable,.db-builder-fullpage .db-control-row-description,.db-builder-fullpage .db-control-row-variable{display:none}.db-builder-customizer .db-control-row-label,.db-builder-fullpage .db-control-row-label{grid-column:1/-1;grid-row:1}.db-builder-customizer .db-control-row-input,.db-builder-fullpage .db-control-row-input{flex-wrap:nowrap;grid-column:1;grid-row:2;margin-top:0;white-space:nowrap}.db-builder-customizer .db-control-row-input{white-space:normal}.db-builder-customizer .db-control-row-reset,.db-builder-fullpage .db-control-row-reset{grid-column:2;grid-row:2;justify-self:end;white-space:nowrap}.db-builder-customizer color-control,.db-builder-customizer rgba-control,.db-builder-fullpage color-control,.db-builder-fullpage rgba-control{flex-wrap:nowrap}}@media (max-width:960px){:host{padding-inline:1rem}}@media (forced-colors:active){.db-btn,.db-control-row-reset,.db-presets-chip{forced-color-adjust:auto}}';
const DESIGN_BUILDER_MODE_FULL_PAGE = "full-page";
const DESIGN_BUILDER_MODE_COMPONENT_CUSTOMIZER = "component-customizer";
function hasStringValue(value) {
  return typeof value === "string" && value.trim() !== "";
}
__name(hasStringValue, "hasStringValue");
function createPresetTargets(input) {
  return {
    token: input.token === true,
    component: input.component === true
  };
}
__name(createPresetTargets, "createPresetTargets");
function inferPresetTargets(input) {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    return createPresetTargets({});
  }
  const record = input;
  if ("token" in record || "component" in record) {
    return createPresetTargets({
      token: "token" in record,
      component: "component" in record
    });
  }
  const normalizedTokens = normalizeTokenOverrides(record);
  if (Object.keys(normalizedTokens).length === Object.keys(record).length) {
    return createPresetTargets({ token: true });
  }
  const normalizedComponents = normalizeComponentOverrides(record);
  return createPresetTargets({
    component: Object.keys(normalizedComponents).length > 0
  });
}
__name(inferPresetTargets, "inferPresetTargets");
function normalizePresetDefinition(input, fallbackId) {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    return null;
  }
  const record = input;
  const rawState = record.state ?? record.overrides ?? ("token" in record || "component" in record ? {
    ..."token" in record ? { token: record.token } : {},
    ..."component" in record ? { component: record.component } : {}
  } : void 0);
  const id = hasStringValue(record.id) ? record.id.trim() : fallbackId?.trim();
  const label = hasStringValue(record.label) ? record.label.trim() : hasStringValue(record.name) ? record.name.trim() : id ?? fallbackId?.trim();
  if (!id || !label || !rawState) {
    return null;
  }
  return {
    id,
    label,
    state: normalizeDesignBuilderOverrideState(rawState),
    targets: inferPresetTargets(rawState)
  };
}
__name(normalizePresetDefinition, "normalizePresetDefinition");
function areStringMapsEqual(left, right) {
  const leftKeys = Object.keys(left).sort();
  const rightKeys = Object.keys(right).sort();
  if (leftKeys.length !== rightKeys.length) {
    return false;
  }
  return leftKeys.every((key, index) => key === rightKeys[index] && left[key] === right[key]);
}
__name(areStringMapsEqual, "areStringMapsEqual");
function areScopedComponentOverridesEqual(left, right) {
  const leftScopeKeys = Object.keys(left).sort();
  const rightScopeKeys = Object.keys(right).sort();
  if (leftScopeKeys.length !== rightScopeKeys.length) {
    return false;
  }
  return leftScopeKeys.every((scopeKey, index) => {
    if (scopeKey !== rightScopeKeys[index]) {
      return false;
    }
    const leftScope = left[scopeKey] || {};
    const rightScope = right[scopeKey] || {};
    const leftComponentKeys = Object.keys(leftScope).sort();
    const rightComponentKeys = Object.keys(rightScope).sort();
    if (leftComponentKeys.length !== rightComponentKeys.length) {
      return false;
    }
    return leftComponentKeys.every((componentName, componentIndex) => {
      if (componentName !== rightComponentKeys[componentIndex]) {
        return false;
      }
      return areStringMapsEqual(leftScope[componentName] || {}, rightScope[componentName] || {});
    });
  });
}
__name(areScopedComponentOverridesEqual, "areScopedComponentOverridesEqual");
function normalizeDesignBuilderProvidedPresets(input) {
  if (Array.isArray(input)) {
    return input.map((preset, index) => normalizePresetDefinition(preset, `preset-${index + 1}`)).filter((preset) => preset !== null);
  }
  if (!input || typeof input !== "object") {
    return [];
  }
  return Object.entries(input).map(([name, preset]) => normalizePresetDefinition(preset, name)).filter((preset) => preset !== null);
}
__name(normalizeDesignBuilderProvidedPresets, "normalizeDesignBuilderProvidedPresets");
function designBuilderPresetMatchesState(preset, state2) {
  const normalizedState = normalizeDesignBuilderOverrideState(state2);
  if (preset.targets.token && !areStringMapsEqual(preset.state.token, normalizedState.token)) {
    return false;
  }
  if (preset.targets.component && !areScopedComponentOverridesEqual(preset.state.component, normalizedState.component)) {
    return false;
  }
  return preset.targets.token || preset.targets.component;
}
__name(designBuilderPresetMatchesState, "designBuilderPresetMatchesState");
const SHOW_SAVE_BUTTON_ATTRIBUTE = "show-save-button";
const LEGACY_SHOW_SAVE_BUTTON_ATTRIBUTE = "data-show-save-button";
function parseJsonUnknown(value) {
  if (!value) {
    return void 0;
  }
  try {
    return JSON.parse(value);
  } catch {
    return void 0;
  }
}
__name(parseJsonUnknown, "parseJsonUnknown");
function resolveMode(raw) {
  if (typeof raw !== "string") {
    return null;
  }
  const normalizedValue = raw.trim().toLowerCase();
  if (normalizedValue === DESIGN_BUILDER_MODE_FULL_PAGE) {
    return DESIGN_BUILDER_MODE_FULL_PAGE;
  }
  if (normalizedValue === DESIGN_BUILDER_MODE_COMPONENT_CUSTOMIZER) {
    return DESIGN_BUILDER_MODE_COMPONENT_CUSTOMIZER;
  }
  return null;
}
__name(resolveMode, "resolveMode");
function hasPayload(value) {
  return value !== void 0 && value !== null;
}
__name(hasPayload, "hasPayload");
function parseBooleanAttribute(value, fallback) {
  if (value === null) {
    return fallback;
  }
  const normalizedValue = value.trim().toLowerCase();
  if (normalizedValue === "") {
    return true;
  }
  if (["false", "0", "no", "off"].includes(normalizedValue)) {
    return false;
  }
  if (["true", "1", "yes", "on"].includes(normalizedValue)) {
    return true;
  }
  return fallback;
}
__name(parseBooleanAttribute, "parseBooleanAttribute");
function resolveAvailableModes(tokenData, componentData) {
  const availableModes = [];
  if (hasPayload(tokenData)) {
    availableModes.push(DESIGN_BUILDER_MODE_FULL_PAGE);
  }
  if (hasPayload(tokenData) && hasPayload(componentData)) {
    availableModes.push(DESIGN_BUILDER_MODE_COMPONENT_CUSTOMIZER);
  }
  return availableModes;
}
__name(resolveAvailableModes, "resolveAvailableModes");
function resolveDesignBuilderRootConfiguration(input) {
  const { hostElement, preferredMode, propertyTokenData, propertyTokenLibraryData, propertyComponentData, propertyOverrideState, propertyPresets } = input;
  const rootTokenData = propertyTokenData ?? parseJsonUnknown(hostElement.getAttribute("token-data"));
  const legacyTokenLibraryData = propertyTokenLibraryData ?? parseJsonUnknown(hostElement.getAttribute("token-library"));
  const tokenData = rootTokenData ?? legacyTokenLibraryData;
  const tokenLibraryData = legacyTokenLibraryData ?? tokenData;
  const componentData = propertyComponentData ?? parseJsonUnknown(hostElement.getAttribute("component-data"));
  const overrideState = normalizeDesignBuilderOverrideState(propertyOverrideState ?? parseJsonUnknown(hostElement.getAttribute("override-state")));
  const presets = normalizeDesignBuilderProvidedPresets(propertyPresets ?? parseJsonUnknown(hostElement.getAttribute("presets")));
  const requestedMode = preferredMode ?? resolveMode(hostElement.getAttribute("mode"));
  const showSaveButton = parseBooleanAttribute(
    hostElement.getAttribute(SHOW_SAVE_BUTTON_ATTRIBUTE) ?? hostElement.getAttribute(LEGACY_SHOW_SAVE_BUTTON_ATTRIBUTE),
    true
  );
  const availableModes = resolveAvailableModes(tokenData, componentData);
  const resolvedMode = requestedMode && availableModes.includes(requestedMode) ? requestedMode : hasPayload(componentData) && hasPayload(legacyTokenLibraryData) && !hasPayload(rootTokenData) ? DESIGN_BUILDER_MODE_COMPONENT_CUSTOMIZER : hasPayload(tokenData) ? DESIGN_BUILDER_MODE_FULL_PAGE : availableModes[0] ?? DESIGN_BUILDER_MODE_FULL_PAGE;
  return {
    mode: resolvedMode,
    availableModes,
    tokenData,
    tokenLibraryData,
    componentData,
    overrideState,
    presets,
    showSaveButton
  };
}
__name(resolveDesignBuilderRootConfiguration, "resolveDesignBuilderRootConfiguration");
const ROOT_ELEMENT_TAG_NAME = "design-builder";
const SHADOW_STYLE_ID = "design-builder-shadow-style";
const _DesignBuilderCustomElement = class _DesignBuilderCustomElement extends HTMLElement {
  currentMode = null;
  currentTokenData;
  currentTokenLibraryData;
  currentComponentData;
  currentOverrideState;
  currentPresets = void 0;
  hasInitialized = false;
  renderPromise = null;
  hasPendingRender = false;
  activeDisposer = null;
  getRenderContainer() {
    if (!this.shadowRoot) {
      this.attachShadow({ mode: "open" });
    }
    return this.shadowRoot;
  }
  get mode() {
    return this.currentMode ?? DESIGN_BUILDER_MODE_FULL_PAGE;
  }
  get tokenLibraryData() {
    return this.currentTokenLibraryData ?? this.currentTokenData;
  }
  set tokenLibraryData(value) {
    this.currentTokenLibraryData = value;
    if (!this.hasAttribute("token-data")) {
      this.currentTokenData = value;
    }
    if (this.hasInitialized) {
      void this.scheduleRender();
    }
  }
  get tokenData() {
    return this.currentTokenData;
  }
  set tokenData(value) {
    this.currentTokenData = value;
    if (this.hasInitialized) {
      void this.scheduleRender();
    }
  }
  get componentData() {
    return this.currentComponentData;
  }
  set componentData(value) {
    this.currentComponentData = value;
    if (this.hasInitialized) {
      void this.scheduleRender();
    }
  }
  get overrideState() {
    return normalizeDesignBuilderOverrideState(this.currentOverrideState);
  }
  set overrideState(value) {
    this.currentOverrideState = normalizeDesignBuilderOverrideState(value);
  }
  get presets() {
    return this.currentPresets ?? [];
  }
  set presets(value) {
    this.currentPresets = Array.isArray(value) ? value : [];
    if (this.hasInitialized) {
      void this.scheduleRender();
    }
  }
  connectedCallback() {
    if (!this.hasInitialized) {
      this.hasInitialized = true;
    }
    void this.scheduleRender();
  }
  disconnectedCallback() {
    void this.disposeActiveAdapter();
  }
  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) {
      return;
    }
    if (name === "token-data") {
      this.currentTokenData = void 0;
    }
    if (name === "mode") {
      this.currentMode = null;
    }
    if (name === "token-library") {
      this.currentTokenLibraryData = void 0;
      if (!this.hasAttribute("token-data")) {
        this.currentTokenData = void 0;
      }
    }
    if (name === "component-data") {
      this.currentComponentData = void 0;
    }
    if (name === "override-state") {
      this.currentOverrideState = void 0;
    }
    if (name === "presets") {
      this.currentPresets = void 0;
    }
    if (!this.hasInitialized) {
      return;
    }
    void this.scheduleRender();
  }
  switchMode(value) {
    if (this.mode === value) {
      return;
    }
    const previousMode = this.mode;
    this.currentMode = value;
    if (this.hasInitialized) {
      emitDesignBuilderActionEvent(this, {
        action: "mode-change",
        mode: value,
        state: this.overrideState,
        metadata: {
          fromMode: previousMode,
          toMode: value
        }
      });
      void this.scheduleRender();
    }
  }
  async scheduleRender() {
    if (this.renderPromise) {
      this.hasPendingRender = true;
      await this.renderPromise;
      return;
    }
    this.renderPromise = this.renderWithAdapter();
    try {
      await this.renderPromise;
    } finally {
      this.renderPromise = null;
      if (this.hasPendingRender) {
        this.hasPendingRender = false;
        void this.scheduleRender();
      }
    }
  }
  async renderWithAdapter() {
    const renderContainer = this.getRenderContainer();
    this.ensureShadowStyles();
    await this.disposeActiveAdapter();
    this.resetRenderContainer(renderContainer);
    const parsedConfiguration = resolveDesignBuilderRootConfiguration({
      hostElement: this,
      preferredMode: this.currentMode,
      propertyTokenData: this.currentTokenData,
      propertyTokenLibraryData: this.currentTokenLibraryData,
      propertyComponentData: this.currentComponentData,
      propertyOverrideState: this.currentOverrideState,
      propertyPresets: this.currentPresets
    });
    this.currentMode = parsedConfiguration.mode;
    this.currentTokenData = parsedConfiguration.tokenData;
    this.currentTokenLibraryData = parsedConfiguration.tokenLibraryData;
    this.currentComponentData = parsedConfiguration.componentData;
    this.currentOverrideState = parsedConfiguration.overrideState;
    this.currentPresets = parsedConfiguration.presets;
    const modeAdapter = _DesignBuilderCustomElement.modeAdapters.get(parsedConfiguration.mode);
    if (!modeAdapter) {
      this.dispatchEvent(
        new CustomEvent("design-builder:error", {
          detail: {
            message: `No mode adapter is registered for mode "${parsedConfiguration.mode}".`
          },
          bubbles: true,
          composed: true
        })
      );
      return;
    }
    const modeAdapterResult = await modeAdapter({
      hostElement: this,
      configuration: parsedConfiguration,
      renderContainer,
      modeSwitch: {
        activeMode: parsedConfiguration.mode,
        availableModes: parsedConfiguration.availableModes,
        onSwitch: /* @__PURE__ */ __name((mode) => {
          this.switchMode(mode);
        }, "onSwitch")
      }
    });
    this.activeDisposer = modeAdapterResult?.dispose ?? null;
    this.dispatchEvent(
      new CustomEvent("design-builder:initialized", {
        detail: {
          mode: parsedConfiguration.mode,
          availableModes: parsedConfiguration.availableModes
        },
        bubbles: true,
        composed: true
      })
    );
  }
  resetRenderContainer(renderContainer) {
    const shadowStyle = renderContainer.querySelector(`#${SHADOW_STYLE_ID}`);
    renderContainer.replaceChildren(...shadowStyle ? [shadowStyle] : []);
  }
  async disposeActiveAdapter() {
    if (!this.activeDisposer) {
      return;
    }
    const disposer = this.activeDisposer;
    this.activeDisposer = null;
    await disposer();
  }
  static registerModeAdapter(mode, adapter) {
    _DesignBuilderCustomElement.modeAdapters.set(mode, adapter);
  }
  ensureShadowStyles() {
    const shadowRoot = this.shadowRoot;
    if (!shadowRoot) {
      return;
    }
    if (shadowRoot.querySelector(`#${SHADOW_STYLE_ID}`)) {
      return;
    }
    const style = document.createElement("style");
    style.id = SHADOW_STYLE_ID;
    style.textContent = designBuilderStyles;
    shadowRoot.prepend(style);
  }
  static define() {
    if (_DesignBuilderCustomElement.hasRegistered || customElements.get(ROOT_ELEMENT_TAG_NAME)) {
      _DesignBuilderCustomElement.hasRegistered = true;
      return;
    }
    customElements.define(ROOT_ELEMENT_TAG_NAME, _DesignBuilderCustomElement);
    _DesignBuilderCustomElement.hasRegistered = true;
  }
};
__name(_DesignBuilderCustomElement, "DesignBuilderCustomElement");
__publicField(_DesignBuilderCustomElement, "observedAttributes", ["mode", "token-data", "token-library", "component-data", "override-state", "presets", "show-save-button", "data-show-save-button"]);
__publicField(_DesignBuilderCustomElement, "modeAdapters", /* @__PURE__ */ new Map());
__publicField(_DesignBuilderCustomElement, "hasRegistered", false);
let DesignBuilderCustomElement = _DesignBuilderCustomElement;
function registerDesignBuilderCustomElement() {
  DesignBuilderCustomElement.define();
}
__name(registerDesignBuilderCustomElement, "registerDesignBuilderCustomElement");
function registerDesignBuilderModeAdapter(mode, adapter) {
  DesignBuilderCustomElement.registerModeAdapter(mode, adapter);
}
__name(registerDesignBuilderModeAdapter, "registerDesignBuilderModeAdapter");
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
function parseDesignTokenLibraryData(rawValue) {
  if (!rawValue) {
    return null;
  }
  if (isTokenData(rawValue)) {
    return rawValue;
  }
  if (typeof rawValue === "string") {
    try {
      const parsed = JSON.parse(rawValue);
      return isTokenData(parsed) ? parsed : null;
    } catch {
      return null;
    }
  }
  return null;
}
__name(parseDesignTokenLibraryData, "parseDesignTokenLibraryData");
function getControlChangeValue(event) {
  if (!(event instanceof CustomEvent)) {
    return void 0;
  }
  const detail = event.detail;
  if (!detail || typeof detail !== "object" || !("value" in detail)) {
    return void 0;
  }
  const value = detail.value;
  return value === void 0 || value === null ? void 0 : String(value);
}
__name(getControlChangeValue, "getControlChangeValue");
const _DbControlRow = class _DbControlRow extends HTMLElement {
  _setting;
  _value = "";
  _infoOpen = false;
  handleDocumentPointerDown = /* @__PURE__ */ __name((event) => {
    if (!this._infoOpen) {
      return;
    }
    const target = event.target;
    if (target instanceof Node && this.contains(target)) {
      return;
    }
    this._infoOpen = false;
    this.render();
  }, "handleDocumentPointerDown");
  set setting(value) {
    this._setting = value;
    this.render();
  }
  get setting() {
    return this._setting;
  }
  set value(value) {
    this._value = value;
    this.render();
  }
  get value() {
    return this._value;
  }
  connectedCallback() {
    document.addEventListener("pointerdown", this.handleDocumentPointerDown, true);
    this.render();
  }
  disconnectedCallback() {
    document.removeEventListener("pointerdown", this.handleDocumentPointerDown, true);
  }
  emitChange(value) {
    const setting = this._setting;
    if (!setting) {
      return;
    }
    this.dispatchEvent(
      new CustomEvent("control-change", {
        detail: {
          variable: setting.variable,
          value
        },
        bubbles: true,
        composed: true
      })
    );
  }
  onControlChange(event) {
    const rawValue = getControlChangeValue(event);
    if (rawValue === void 0) {
      return;
    }
    const setting = this._setting;
    if (!setting) {
      return;
    }
    let value = rawValue;
    if (setting.type === "range" && setting.unit) {
      const unit = setting.unit;
      if (!value.endsWith(unit)) {
        value = `${value}${unit}`;
      }
    }
    this._value = value;
    this.render();
    this.emitChange(value);
  }
  onReset() {
    const setting = this._setting;
    if (!setting) {
      return;
    }
    this._value = setting.default;
    this.render();
    this.emitChange("");
  }
  onInfoButtonClick(event) {
    event.preventDefault();
    event.stopPropagation();
    this._infoOpen = !this._infoOpen;
    this.render();
  }
  renderInput(setting) {
    switch (setting.type) {
      case "color":
        return b`<color-control value=${this._value} ?locked=${setting.locked === true} placeholder=${setting.default} @change=${(e2) => this.onControlChange(e2)} />`;
      case "rgba":
        return b`<rgba-control value=${this._value} ?locked=${setting.locked === true} placeholder=${setting.default} @change=${(e2) => this.onControlChange(e2)} />`;
      case "range":
        return b`<range-control
					value=${Number.isNaN(parseFloat(this._value)) ? "0" : String(parseFloat(this._value))}
					?locked=${setting.locked === true}
					min=${setting.min !== void 0 ? String(setting.min) : void 0}
					max=${setting.max !== void 0 ? String(setting.max) : void 0}
					step=${setting.step !== void 0 ? String(setting.step) : void 0}
					unit=${setting.unit}
					@change=${(e2) => this.onControlChange(e2)}
				/>`;
      case "select": {
        const options = Object.fromEntries((setting.options || []).map((option) => [option.value, option.label]));
        return b`<select-control
					value=${this._value}
					?locked=${setting.locked === true}
					options=${JSON.stringify(options)}
					@change=${(e2) => this.onControlChange(e2)}
				/>`;
      }
      case "font":
        return b`<font-control value=${this._value} ?locked=${setting.locked === true} placeholder=${setting.default} @change=${(e2) => this.onControlChange(e2)} />`;
    }
  }
  render() {
    const setting = this._setting;
    if (!setting) {
      return;
    }
    const variableDescription = setting.description?.trim() ?? "";
    const tooltipText = [variableDescription, setting.variable].filter(Boolean).join("\n");
    const infoPanelId = `db-control-row-info-${setting.variable.replace(/[^a-z0-9_-]/gi, "-").toLowerCase()}`;
    const showInfoPanel = tooltipText !== "" && this._infoOpen;
    const markup = b`
			<div
				class="db-control-row"
				data-variable=${setting.variable}
				data-tip-variable=${setting.variable}
				data-tip-description=${variableDescription}
			>
				<div class="db-control-row-label"><span class="db-control-row-label-text">${setting.label}</span>${tooltipText ? b`<button type="button" class="db-control-info-btn" aria-label="Token info" aria-expanded=${showInfoPanel ? "true" : "false"} aria-controls=${infoPanelId} @click=${(event) => this.onInfoButtonClick(event)}><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" aria-hidden="true" focusable="false"><path d="M440-280h80v-240h-80v240Zm68.5-331.5Q520-623 520-640t-11.5-28.5Q497-680 480-680t-28.5 11.5Q440-657 440-640t11.5 28.5Q463-600 480-600t28.5-11.5ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/></svg></button>` : ""}</div>
				${showInfoPanel ? b`<div class="db-control-row-info" id=${infoPanelId}>${variableDescription ? b`<p class="db-control-row-info-description">${variableDescription}</p>` : ""}<code class="db-control-row-info-variable">css-variable: ${setting.variable}</code></div>` : ""}
				${setting.description ? b`<span class="db-control-row-description">${setting.description}</span>` : ""}
				<code class="db-control-row-variable">${setting.variable}</code>
				<div class="db-control-row-input">${this.renderInput(setting)}</div>
				${!setting.locked ? b`<button class="db-control-row-reset" type="button" title=${`Reset to ${setting.default}`} @click=${() => this.onReset()}>
							Reset
					  </button>` : ""}
			</div>
		`;
    this.toggleAttribute("info-open", showInfoPanel);
    this.toggleAttribute("locked", setting.locked === true);
    D(markup, this);
  }
};
__name(_DbControlRow, "DbControlRow");
let DbControlRow = _DbControlRow;
if (!customElements.get("db-control-row")) {
  customElements.define("db-control-row", DbControlRow);
}
const _DbReadOnlyControlRow = class _DbReadOnlyControlRow extends HTMLElement {
  _setting;
  _value = "";
  _infoOpen = false;
  handleDocumentPointerDown = /* @__PURE__ */ __name((event) => {
    if (!this._infoOpen) {
      return;
    }
    const target = event.target;
    if (target instanceof Node && this.contains(target)) {
      return;
    }
    this._infoOpen = false;
    this.render();
  }, "handleDocumentPointerDown");
  set setting(value) {
    this._setting = value;
    this.render();
  }
  set value(value) {
    this._value = value;
    this.render();
  }
  connectedCallback() {
    document.addEventListener("pointerdown", this.handleDocumentPointerDown, true);
    this.render();
  }
  disconnectedCallback() {
    document.removeEventListener("pointerdown", this.handleDocumentPointerDown, true);
  }
  onInfoButtonClick(event) {
    event.preventDefault();
    event.stopPropagation();
    this._infoOpen = !this._infoOpen;
    this.render();
  }
  render() {
    const setting = this._setting;
    if (!setting) {
      return;
    }
    const variableDescription = setting.description?.trim() ?? "";
    const tooltipText = [variableDescription, setting.variable].filter(Boolean).join("\n");
    const infoPanelId = `db-readonly-control-row-info-${setting.variable.replace(/[^a-z0-9_-]/gi, "-").toLowerCase()}`;
    const showInfoPanel = tooltipText !== "" && this._infoOpen;
    const markup = b`
			<div
				class="db-control-row"
				data-variable=${setting.variable}
				data-tip-variable=${setting.variable}
				data-tip-description=${variableDescription}
			>
				<div class="db-control-row-label"><span class="db-control-row-label-text">${setting.label}</span>${tooltipText ? b`<button type="button" class="db-control-info-btn" aria-label="Token info" aria-expanded=${showInfoPanel ? "true" : "false"} aria-controls=${infoPanelId} @click=${(event) => this.onInfoButtonClick(event)}><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" aria-hidden="true" focusable="false"><path d="M440-280h80v-240h-80v240Zm68.5-331.5Q520-623 520-640t-11.5-28.5Q497-680 480-680t-28.5 11.5Q440-657 440-640t11.5 28.5Q463-600 480-600t28.5-11.5ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/></svg></button>` : ""}</div>
				${showInfoPanel ? b`<div class="db-control-row-info" id=${infoPanelId}>${variableDescription ? b`<p class="db-control-row-info-description">${variableDescription}</p>` : ""}<code class="db-control-row-info-variable">css-variable: ${setting.variable}</code></div>` : ""}
				<div class="db-control-row-readonly-value">
					${setting.type === "color" || setting.type === "rgba" ? b`<div class="db-control-row-swatch" style=${`background-color: ${this._value}`}></div>` : ""}
					<span class="db-control-value-display db-control-value-readonly">${this._value}</span>
				</div>
			</div>
		`;
    this.toggleAttribute("info-open", showInfoPanel);
    this.setAttribute("readonly", "");
    this.setAttribute("locked", "");
    D(markup, this);
  }
};
__name(_DbReadOnlyControlRow, "DbReadOnlyControlRow");
let DbReadOnlyControlRow = _DbReadOnlyControlRow;
if (!customElements.get("db-readonly-control-row")) {
  customElements.define("db-readonly-control-row", DbReadOnlyControlRow);
}
const _DbCategory = class _DbCategory extends HTMLElement {
  _category;
  _items = [];
  _collapsible = false;
  _collapsed = false;
  set category(value) {
    this._category = value;
    this.render();
  }
  set items(value) {
    this._items = value;
    this.render();
  }
  set collapsible(value) {
    this._collapsible = value;
    this.render();
  }
  connectedCallback() {
    this.render();
  }
  toggleCollapsed() {
    if (!this._collapsible || this._items.length === 0) {
      return;
    }
    this._collapsed = !this._collapsed;
    this.render();
  }
  render() {
    if (!this._category || this._items.length === 0) {
      this.hidden = true;
      D(A, this);
      return;
    }
    this.hidden = false;
    const categoryId = this._category.id;
    const bodyId = `db-category-body-${categoryId}`;
    const headingId = `db-category-title-${categoryId}`;
    const markup = b`
			<section class=${`db-category${this._collapsed ? " db-category-collapsed" : ""}`} data-category-id=${categoryId}>
				<div
					class="db-category-header"
					role=${this._collapsible ? "button" : A}
					tabindex=${this._collapsible ? "0" : A}
					aria-controls=${this._collapsible ? bodyId : A}
					aria-expanded=${this._collapsible ? String(!this._collapsed) : A}
					@click=${() => this.toggleCollapsed()}
					@keydown=${(event) => {
      if (!this._collapsible) {
        return;
      }
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        this.toggleCollapsed();
      }
    }}
				>
					<h2 class="db-category-title" id=${headingId}>${this._category.label}</h2>
					${this._category.description ? b`<p class="db-category-description">${this._category.description}</p>` : A}
					${this._collapsible ? b`<span class="db-category-toggle" aria-hidden="true"></span>` : A}
				</div>
				<div class="db-category-body" id=${bodyId} aria-labelledby=${headingId}>
					${this._items}
				</div>
			</section>
		`;
    D(markup, this);
  }
};
__name(_DbCategory, "DbCategory");
let DbCategory = _DbCategory;
if (!customElements.get("db-category")) {
  customElements.define("db-category", DbCategory);
}
const _DbSwatchBand = class _DbSwatchBand extends HTMLElement {
  _settings = [];
  set settings(value) {
    this._settings = value;
    this.render();
  }
  connectedCallback() {
    this.render();
  }
  groupedSettings() {
    const groups = /* @__PURE__ */ new Map();
    for (const setting of this._settings) {
      const match = setting.variable.match(/^--color--(\w+)-\d+$/);
      const groupKey = match ? match[1] : "other";
      if (!groups.has(groupKey)) {
        groups.set(groupKey, []);
      }
      groups.get(groupKey)?.push(setting);
    }
    return [...groups.entries()].map(([groupKey, settings]) => ({ groupKey, settings }));
  }
  render() {
    const markup = b`
			<div class="db-swatch-band">
				${this.groupedSettings().map(
      ({ groupKey, settings }) => b`
						<div class="db-swatch-band-row">
							<code class="db-swatch-band-var">${`--color--${groupKey}-[%]`}</code>
							<div class="db-swatch-band-strip">
								${settings.map((setting) => {
        const pctMatch = setting.variable.match(/-(\d+)$/);
        const pct = pctMatch ? `${pctMatch[1]}` : "";
        return b`
										<div class="db-swatch-band-swatch" style=${`background-color: ${setting.default}`} title=${`${setting.variable}
${setting.default}`}>
											<span class="db-swatch-band-pct">${pct}</span>
										</div>
									`;
      })}
							</div>
						</div>
					`
    )}
			</div>
		`;
    D(markup, this);
  }
};
__name(_DbSwatchBand, "DbSwatchBand");
let DbSwatchBand = _DbSwatchBand;
if (!customElements.get("db-swatch-band")) {
  customElements.define("db-swatch-band", DbSwatchBand);
}
function createDesignBuilderControl(setting, currentValue, onChange) {
  const row = document.createElement("db-control-row");
  row.setting = setting;
  row.value = currentValue;
  row.addEventListener("control-change", (event) => {
    const detail = event.detail;
    if (!detail) {
      return;
    }
    onChange(detail.variable, detail.value);
  });
  return row;
}
__name(createDesignBuilderControl, "createDesignBuilderControl");
function createReadOnlyDesignBuilderControl(setting, currentValue) {
  const row = document.createElement("db-readonly-control-row");
  row.setting = setting;
  row.value = currentValue;
  return row;
}
__name(createReadOnlyDesignBuilderControl, "createReadOnlyDesignBuilderControl");
function createDesignBuilderSwatchBand(settings) {
  const band = document.createElement("db-swatch-band");
  band.settings = settings;
  return band;
}
__name(createDesignBuilderSwatchBand, "createDesignBuilderSwatchBand");
function createDesignBuilderCategory(category, items, collapsible = false) {
  const categoryElement = document.createElement("db-category");
  categoryElement.category = {
    id: category.id,
    label: category.label,
    description: category.description
  };
  categoryElement.items = items;
  categoryElement.collapsible = collapsible;
  return categoryElement;
}
__name(createDesignBuilderCategory, "createDesignBuilderCategory");
function getOpenMenus(root) {
  return Array.from(root.querySelectorAll("details[open].db-header-menu, details[open].db-presets-menu"));
}
__name(getOpenMenus, "getOpenMenus");
function closeMenu(menu) {
  if (!menu) {
    return;
  }
  menu.open = false;
  menu.removeAttribute("open");
}
__name(closeMenu, "closeMenu");
function createDetailsMenuDismissController(root) {
  const handleRootClick = /* @__PURE__ */ __name((event) => {
    const target = event.target;
    if (!(target instanceof Element)) {
      return;
    }
    const actionButton = target.closest(".db-header-menu-content .db-btn, .db-presets-menu-content .db-btn");
    if (!actionButton) {
      return;
    }
    closeMenu(actionButton.closest("details"));
  }, "handleRootClick");
  const handleDocumentPointerDown = /* @__PURE__ */ __name((event) => {
    const path = typeof event.composedPath === "function" ? event.composedPath() : [];
    for (const menu of getOpenMenus(root)) {
      if (!path.includes(menu)) {
        closeMenu(menu);
      }
    }
  }, "handleDocumentPointerDown");
  root.addEventListener("click", handleRootClick);
  document.addEventListener("pointerdown", handleDocumentPointerDown, true);
  return {
    dispose: /* @__PURE__ */ __name(() => {
      root.removeEventListener("click", handleRootClick);
      document.removeEventListener("pointerdown", handleDocumentPointerDown, true);
    }, "dispose")
  };
}
__name(createDetailsMenuDismissController, "createDetailsMenuDismissController");
const translations = {
  showUneditable: "Show uneditable",
  hideUneditable: "Hide uneditable",
  general: "General",
  components: "Components",
  chooseAPreset: "Choose a preset",
  pickOnPage: "Pick on page",
  stopPicking: "Stop picking",
  preset: "Preset",
  importExportJson: "Import / export JSON",
  exportJson: "Export JSON",
  importJson: "Import JSON",
  resetActions: "Reset actions",
  resetAll: "Reset all",
  presetActions: "Preset actions",
  savePreset: "Save preset",
  deletePreset: "Delete preset",
  component: "Component",
  scope: "Scope",
  resetSelected: "Reset selected",
  savedPresets: "Saved presets",
  generalAllScopes: "General (all scopes)"
};
document.addEventListener("DOMContentLoaded", () => {
  if (window.styleguide?.translations) {
    Object.assign(translations, window.styleguide.translations);
  }
});
function getModeLabel(mode) {
  if (mode === DESIGN_BUILDER_MODE_COMPONENT_CUSTOMIZER) {
    return translations.components;
  }
  return translations.general;
}
__name(getModeLabel, "getModeLabel");
function createDesignBuilderModeSwitcher(modeSwitch) {
  if (modeSwitch.availableModes.length < 2) {
    return null;
  }
  const switcher = document.createElement("div");
  switcher.className = "db-mode-switch";
  switcher.setAttribute("role", "group");
  switcher.setAttribute("aria-label", "Design Builder mode");
  for (const mode of modeSwitch.availableModes) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "db-mode-switch-button";
    button.textContent = getModeLabel(mode);
    if (mode === modeSwitch.activeMode) {
      button.classList.add("db-mode-switch-button-active");
      button.setAttribute("aria-pressed", "true");
    } else {
      button.setAttribute("aria-pressed", "false");
      button.addEventListener("click", () => {
        modeSwitch.onSwitch(mode);
      });
    }
    switcher.appendChild(button);
  }
  return switcher;
}
__name(createDesignBuilderModeSwitcher, "createDesignBuilderModeSwitcher");
const SHARED_PRESETS_KEY = "design-builder-presets";
const SHARED_ACTIVE_PRESET_KEY = "design-builder-active-preset";
const _DesignBuilderPresetManager = class _DesignBuilderPresetManager {
  presetsKey;
  activeKey;
  storage;
  constructor(presetsKey = SHARED_PRESETS_KEY, activeKey = SHARED_ACTIVE_PRESET_KEY, storage = browserLocalStorageAdapter) {
    this.presetsKey = presetsKey;
    this.activeKey = activeKey;
    this.storage = storage;
  }
  loadAll() {
    try {
      const raw = this.storage.getItem(this.presetsKey);
      if (raw) {
        return this.normalizePresetCollection(JSON.parse(raw));
      }
    } catch {
    }
    return this.loadLegacyPresets();
  }
  save(name, overrides) {
    const all = this.loadAll();
    all[name] = normalizeDesignBuilderOverrideState(overrides);
    this.storage.setItem(this.presetsKey, JSON.stringify(all));
  }
  delete(name) {
    const all = this.loadAll();
    delete all[name];
    if (Object.keys(all).length === 0) {
      this.storage.removeItem(this.presetsKey);
    } else {
      this.storage.setItem(this.presetsKey, JSON.stringify(all));
    }
    if (this.getActive() === name) {
      this.clearActive();
    }
  }
  getActive() {
    return this.storage.getItem(this.activeKey) || this.storage.getItem(ACTIVE_PRESET_KEY) || this.storage.getItem(COMPONENT_ACTIVE_PRESET_KEY);
  }
  setActive(name) {
    this.storage.setItem(this.activeKey, name);
  }
  clearActive() {
    this.storage.removeItem(this.activeKey);
    this.storage.removeItem(ACTIVE_PRESET_KEY);
    this.storage.removeItem(COMPONENT_ACTIVE_PRESET_KEY);
  }
  names() {
    return Object.keys(this.loadAll()).sort();
  }
  normalizePresetCollection(input) {
    if (!input || typeof input !== "object" || Array.isArray(input)) {
      return {};
    }
    const normalized = {};
    for (const [name, preset] of Object.entries(input)) {
      normalized[name] = normalizeDesignBuilderOverrideState(preset);
    }
    return normalized;
  }
  loadLegacyPresets() {
    const merged = {};
    try {
      const raw = this.storage.getItem(PRESETS_KEY);
      if (raw) {
        const tokenPresets = JSON.parse(raw);
        for (const [name, preset] of Object.entries(tokenPresets)) {
          merged[name] = normalizeDesignBuilderOverrideState({
            token: preset,
            component: merged[name]?.component ?? {}
          });
        }
      }
    } catch {
    }
    try {
      const raw = this.storage.getItem(COMPONENT_PRESETS_KEY);
      if (raw) {
        const componentPresets = JSON.parse(raw);
        for (const [name, preset] of Object.entries(componentPresets)) {
          merged[name] = normalizeDesignBuilderOverrideState({
            token: merged[name]?.token ?? {},
            component: preset
          });
        }
      }
    } catch {
    }
    return merged;
  }
};
__name(_DesignBuilderPresetManager, "DesignBuilderPresetManager");
let DesignBuilderPresetManager = _DesignBuilderPresetManager;
function parseScopeAttributeValue(value) {
  if (!value) {
    return [];
  }
  const scopeNames = /* @__PURE__ */ new Set();
  for (const candidate of value.split(";")) {
    const scopeName = candidate.trim();
    if (scopeName) {
      scopeNames.add(scopeName);
    }
  }
  return Array.from(scopeNames);
}
__name(parseScopeAttributeValue, "parseScopeAttributeValue");
function getNamedScopeKeysForElement(element) {
  const scope = element.closest("[data-scope]")?.dataset.scope;
  return parseScopeAttributeValue(scope).map((scopeName) => `scope:${scopeName}`);
}
__name(getNamedScopeKeysForElement, "getNamedScopeKeysForElement");
function getResolvedScopeKeyForElement(element, fallbackScopeKey) {
  return getNamedScopeKeysForElement(element)[0] ?? fallbackScopeKey;
}
__name(getResolvedScopeKeyForElement, "getResolvedScopeKeyForElement");
function getElementsByComponent() {
  const elementsByComponent = /* @__PURE__ */ new Map();
  for (const node of document.querySelectorAll("[data-component]")) {
    if (node.closest('[data-customizable="false"]')) {
      continue;
    }
    const componentName = normalizeComponentName(node.dataset.component || "");
    if (!componentName || NON_CUSTOMIZABLE_COMPONENTS.has(componentName)) {
      continue;
    }
    const existing = elementsByComponent.get(componentName) || [];
    existing.push(node);
    elementsByComponent.set(componentName, existing);
  }
  return elementsByComponent;
}
__name(getElementsByComponent, "getElementsByComponent");
function hasLocalScopeOverrideForElement(overrides, componentName, variable, element) {
  const localScopeKeys = getNamedScopeKeysForElement(element);
  if (localScopeKeys.length === 0) {
    return false;
  }
  return localScopeKeys.some((localScopeKey) => {
    const localValue = overrides[localScopeKey]?.[componentName]?.[variable];
    return typeof localValue === "string" && localValue.trim() !== "";
  });
}
__name(hasLocalScopeOverrideForElement, "hasLocalScopeOverrideForElement");
function getElementsForContext(elementsByComponent, componentName, scopeKey) {
  const elements = elementsByComponent.get(componentName) || [];
  if (scopeKey === GENERAL_SCOPE_KEY) {
    return elements;
  }
  return elements.filter((element) => getNamedScopeKeysForElement(element).includes(scopeKey));
}
__name(getElementsForContext, "getElementsForContext");
function applyTokenOverridesToRootDocument(overrides) {
  for (const [variable, value] of Object.entries(overrides)) {
    document.documentElement.style.setProperty(variable, value);
  }
}
__name(applyTokenOverridesToRootDocument, "applyTokenOverridesToRootDocument");
function clearTokenOverridesFromRootDocument(overrides) {
  for (const variable of Object.keys(overrides)) {
    document.documentElement.style.removeProperty(variable);
  }
}
__name(clearTokenOverridesFromRootDocument, "clearTokenOverridesFromRootDocument");
function applyComponentOverridesToPage(overrides) {
  const elementsByComponent = getElementsByComponent();
  const orderedScopeKeys = Object.keys(overrides).sort((a2, b2) => {
    if (a2 === GENERAL_SCOPE_KEY) return -1;
    if (b2 === GENERAL_SCOPE_KEY) return 1;
    return a2.localeCompare(b2);
  });
  for (const scopeKey of orderedScopeKeys) {
    const scopeOverrides = overrides[scopeKey] || {};
    for (const [componentName, componentOverrides] of Object.entries(scopeOverrides)) {
      for (const [variable, value] of Object.entries(componentOverrides)) {
        let elements = getElementsForContext(elementsByComponent, componentName, scopeKey);
        if (scopeKey === GENERAL_SCOPE_KEY) {
          elements = elements.filter((element) => !hasLocalScopeOverrideForElement(overrides, componentName, variable, element));
        }
        for (const element of elements) {
          element.style.setProperty(variable, value);
        }
      }
    }
  }
}
__name(applyComponentOverridesToPage, "applyComponentOverridesToPage");
function clearComponentOverridesFromPage(overrides) {
  const elementsByComponent = getElementsByComponent();
  for (const [scopeKey, scopeOverrides] of Object.entries(overrides)) {
    for (const [componentName, componentOverrides] of Object.entries(scopeOverrides)) {
      for (const variable of Object.keys(componentOverrides)) {
        let elements = getElementsForContext(elementsByComponent, componentName, scopeKey);
        if (scopeKey === GENERAL_SCOPE_KEY) {
          elements = elements.filter((element) => !hasLocalScopeOverrideForElement(overrides, componentName, variable, element));
        }
        for (const element of elements) {
          element.style.removeProperty(variable);
        }
      }
    }
  }
}
__name(clearComponentOverridesFromPage, "clearComponentOverridesFromPage");
const CONTROL_INFO_TOOLTIP_SELECTOR = ".db-control-info-btn.db-tooltip-target[data-tooltip]";
const TOOLTIP_ID = "db-control-info-tooltip";
const TOOLTIP_VIEWPORT_MARGIN = 12;
const TOOLTIP_OFFSET = 6;
const TOOLTIP_ARROW_MARGIN = 12;
const state = {
  activeAnchor: null,
  isRegistered: false,
  tooltipElement: null
};
function ensureTooltipElement() {
  if (state.tooltipElement?.isConnected) {
    return state.tooltipElement;
  }
  const tooltipElement = document.createElement("div");
  tooltipElement.id = TOOLTIP_ID;
  tooltipElement.className = "db-floating-tooltip";
  tooltipElement.setAttribute("role", "tooltip");
  tooltipElement.setAttribute("aria-hidden", "true");
  document.body.appendChild(tooltipElement);
  state.tooltipElement = tooltipElement;
  return tooltipElement;
}
__name(ensureTooltipElement, "ensureTooltipElement");
function getTooltipAnchor(target) {
  if (!(target instanceof Element)) {
    return null;
  }
  return target.closest(CONTROL_INFO_TOOLTIP_SELECTOR);
}
__name(getTooltipAnchor, "getTooltipAnchor");
function positionTooltip(anchor, tooltipElement) {
  const anchorRect = anchor.getBoundingClientRect();
  const tooltipRect = tooltipElement.getBoundingClientRect();
  const anchorCenter = anchorRect.left + anchorRect.width / 2;
  const maxLeft = Math.max(TOOLTIP_VIEWPORT_MARGIN, window.innerWidth - tooltipRect.width - TOOLTIP_VIEWPORT_MARGIN);
  const preferredLeft = anchorCenter - tooltipRect.width / 2;
  const left = Math.min(maxLeft, Math.max(TOOLTIP_VIEWPORT_MARGIN, preferredLeft));
  const top = anchorRect.bottom + TOOLTIP_OFFSET;
  const arrowLeft = Math.min(tooltipRect.width - TOOLTIP_ARROW_MARGIN, Math.max(TOOLTIP_ARROW_MARGIN, anchorCenter - left));
  tooltipElement.style.left = `${Math.round(left)}px`;
  tooltipElement.style.top = `${Math.round(top)}px`;
  tooltipElement.style.setProperty("--db-tooltip-arrow-left", `${Math.round(arrowLeft)}px`);
  tooltipElement.dataset.placement = "bottom";
}
__name(positionTooltip, "positionTooltip");
function showTooltip(anchor) {
  const tooltipText = anchor.dataset.tooltip?.trim();
  if (!tooltipText) {
    return;
  }
  const tooltipElement = ensureTooltipElement();
  if (state.activeAnchor && state.activeAnchor !== anchor) {
    state.activeAnchor.removeAttribute("aria-describedby");
  }
  state.activeAnchor = anchor;
  anchor.setAttribute("aria-describedby", TOOLTIP_ID);
  tooltipElement.textContent = tooltipText;
  tooltipElement.style.visibility = "hidden";
  tooltipElement.classList.add("db-floating-tooltip-visible");
  tooltipElement.setAttribute("aria-hidden", "false");
  positionTooltip(anchor, tooltipElement);
  tooltipElement.style.visibility = "";
}
__name(showTooltip, "showTooltip");
function hideTooltip(anchor) {
  if (anchor && state.activeAnchor !== anchor) {
    return;
  }
  state.activeAnchor?.removeAttribute("aria-describedby");
  state.activeAnchor = null;
  if (!state.tooltipElement) {
    return;
  }
  state.tooltipElement.classList.remove("db-floating-tooltip-visible");
  state.tooltipElement.setAttribute("aria-hidden", "true");
  state.tooltipElement.style.visibility = "";
  state.tooltipElement.textContent = "";
  state.tooltipElement.style.left = "";
  state.tooltipElement.style.top = "";
  state.tooltipElement.style.removeProperty("--db-tooltip-arrow-left");
  delete state.tooltipElement.dataset.placement;
}
__name(hideTooltip, "hideTooltip");
function repositionActiveTooltip() {
  if (!state.activeAnchor || !state.tooltipElement || state.tooltipElement.getAttribute("aria-hidden") !== "false") {
    return;
  }
  positionTooltip(state.activeAnchor, state.tooltipElement);
}
__name(repositionActiveTooltip, "repositionActiveTooltip");
function registerControlInfoTooltips() {
  if (state.isRegistered) {
    return;
  }
  state.isRegistered = true;
  document.addEventListener(
    "pointerover",
    (event) => {
      const anchor = getTooltipAnchor(event.target);
      if (!anchor || state.activeAnchor === anchor) {
        return;
      }
      showTooltip(anchor);
    },
    true
  );
  document.addEventListener(
    "pointerout",
    (event) => {
      const anchor = getTooltipAnchor(event.target);
      if (!anchor) {
        return;
      }
      const relatedAnchor = getTooltipAnchor(event.relatedTarget ?? null);
      if (relatedAnchor === anchor) {
        return;
      }
      hideTooltip(anchor);
    },
    true
  );
  document.addEventListener(
    "focusin",
    (event) => {
      const anchor = getTooltipAnchor(event.target);
      if (!anchor) {
        return;
      }
      showTooltip(anchor);
    },
    true
  );
  document.addEventListener(
    "focusout",
    (event) => {
      const anchor = getTooltipAnchor(event.target);
      if (!anchor) {
        return;
      }
      const relatedAnchor = getTooltipAnchor(event.relatedTarget ?? null);
      if (relatedAnchor === anchor) {
        return;
      }
      hideTooltip(anchor);
    },
    true
  );
  document.addEventListener(
    "pointerdown",
    (event) => {
      if (state.activeAnchor && getTooltipAnchor(event.target) !== state.activeAnchor) {
        hideTooltip(state.activeAnchor);
      }
    },
    true
  );
  window.addEventListener("resize", repositionActiveTooltip);
  document.addEventListener("scroll", repositionActiveTooltip, true);
}
__name(registerControlInfoTooltips, "registerControlInfoTooltips");
registerControlInfoTooltips();
const _ComponentCustomizerRuntime = class _ComponentCustomizerRuntime {
  componentData;
  tokenLibrary;
  overrides;
  hostElement;
  presetManager;
  elementsByComponent = /* @__PURE__ */ new Map();
  editableComponents = /* @__PURE__ */ new Set();
  activeComponent = null;
  activeScopeKey = GENERAL_SCOPE_KEY;
  mountElement;
  root = null;
  controlsContainer = null;
  componentSelect = null;
  scopeSelect = null;
  toggleTargetSelectionButton = null;
  toggleTargetSelectionLabel = null;
  activeTargetElement = null;
  cleanupCallbacks = [];
  modeSwitch;
  presetBarHost = null;
  menuDismissController = null;
  isTargetSelectionEnabled = false;
  showSaveButton;
  constructor(componentData, tokenLibrary, mountElement, options = {}) {
    this.componentData = componentData;
    this.tokenLibrary = tokenLibrary;
    this.mountElement = mountElement;
    this.hostElement = options.hostElement ?? null;
    this.overrides = normalizeDesignBuilderOverrideState(this.hostElement?.overrideState).component;
    this.presetManager = new DesignBuilderPresetManager();
    this.modeSwitch = options.modeSwitch;
    this.showSaveButton = options.showSaveButton ?? true;
    this.collectComponentElements();
    this.collectEditableComponents();
    this.pruneUnknownOverrides();
    applyTokenOverridesToRootDocument(this.hostElement?.overrideState.token ?? {});
    this.applySavedOverrides();
    this.syncOverrideState();
    this.render();
  }
  collectComponentElements() {
    const nodes = document.querySelectorAll("[data-component]");
    for (const node of nodes) {
      if (node.closest('[data-customizable="false"]')) {
        continue;
      }
      const componentName = normalizeComponentName(node.dataset.component || "");
      if (!componentName) continue;
      if (NON_CUSTOMIZABLE_COMPONENTS.has(componentName)) continue;
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
      this.syncOverrideState();
    }
  }
  applySavedOverrides() {
    const orderedScopeKeys = Object.keys(this.overrides).sort((a2, b2) => {
      if (a2 === GENERAL_SCOPE_KEY) return -1;
      if (b2 === GENERAL_SCOPE_KEY) return 1;
      return a2.localeCompare(b2);
    });
    for (const scopeKey of orderedScopeKeys) {
      for (const [componentName, componentOverrides] of Object.entries(this.overrides[scopeKey])) {
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
  enableTargetSelection() {
    for (const [componentName, elements] of this.elementsByComponent.entries()) {
      const isEditable = this.editableComponents.has(componentName);
      for (const element of elements) {
        if (!isEditable) continue;
        element.classList.add("db-component-target");
        const scopeLabel = this.getScopeLabelForElement(element);
        element.dataset.customizeTooltip = scopeLabel ? `Customize ${this.getComponentLabel(componentName)} (${scopeLabel})` : `Customize ${this.getComponentLabel(componentName)}`;
        const links = element.querySelectorAll("a[href]");
        for (const link of links) {
          const handleLinkClick = /* @__PURE__ */ __name((event) => {
            event.preventDefault();
          }, "handleLinkClick");
          link.addEventListener("click", handleLinkClick);
          this.cleanupCallbacks.push(() => {
            link.removeEventListener("click", handleLinkClick);
          });
        }
      }
    }
    for (const [componentName, elements] of this.elementsByComponent.entries()) {
      if (!this.editableComponents.has(componentName)) continue;
      for (const element of elements) {
        const handleElementClick = /* @__PURE__ */ __name((event) => {
          event.preventDefault();
          event.stopPropagation();
          if (!this.root) return;
          this.activeComponent = componentName;
          this.activeScopeKey = this.getScopeKeyForElement(element);
          this.refreshScopeSelect();
          this.setActiveTarget(componentName, this.activeScopeKey, element);
          if (this.componentSelect) {
            this.componentSelect.value = componentName;
          }
          this.renderControls();
          this.root.hidden = false;
          this.setTargetSelectionEnabled(false);
        }, "handleElementClick");
        element.addEventListener("click", handleElementClick);
        this.cleanupCallbacks.push(() => {
          element.removeEventListener("click", handleElementClick);
        });
      }
    }
  }
  disableTargetSelection() {
    for (const cleanup of this.cleanupCallbacks.splice(0).reverse()) {
      cleanup();
    }
    for (const elements of this.elementsByComponent.values()) {
      for (const element of elements) {
        element.classList.remove("db-component-target");
        delete element.dataset.customizeTooltip;
      }
    }
  }
  setTargetSelectionEnabled(enabled) {
    if (this.isTargetSelectionEnabled === enabled) {
      this.updateTargetSelectionButton();
      return;
    }
    this.isTargetSelectionEnabled = enabled;
    if (this.isTargetSelectionEnabled) {
      this.enableTargetSelection();
    } else {
      this.disableTargetSelection();
    }
    this.updateTargetSelectionButton();
  }
  updateTargetSelectionButton() {
    if (!this.toggleTargetSelectionButton || !this.toggleTargetSelectionLabel) {
      return;
    }
    this.toggleTargetSelectionLabel.textContent = this.isTargetSelectionEnabled ? translations.stopPicking : translations.pickOnPage;
    this.toggleTargetSelectionButton.setAttribute("aria-pressed", this.isTargetSelectionEnabled ? "true" : "false");
    this.toggleTargetSelectionButton.setAttribute("title", this.isTargetSelectionEnabled ? "Stop picking a component from the page" : "Pick a component from the page");
    this.toggleTargetSelectionButton.classList.toggle("db-btn-primary", this.isTargetSelectionEnabled);
  }
  render() {
    if (this.editableComponents.size === 0) return;
    registerControlInfoTooltips();
    const root = document.createElement("div");
    root.className = "db-builder db-builder-customizer";
    this.mountElement.appendChild(root);
    this.root = root;
    this.menuDismissController = createDetailsMenuDismissController(root);
    D(this.renderShellTemplate(), root);
    this.controlsContainer = root.querySelector("[data-component-controls]");
    this.componentSelect = root.querySelector('[data-action="select-component"]');
    this.scopeSelect = root.querySelector('[data-action="select-scope"]');
    this.toggleTargetSelectionButton = root.querySelector('[data-action="toggle-target-selection"]');
    this.toggleTargetSelectionLabel = root.querySelector('[data-role="toggle-target-selection-label"]');
    this.presetBarHost = root.querySelector("[data-preset-bar]");
    this.renderPresetBar();
    this.renderComponentOptions();
    this.refreshScopeSelect();
    this.updateTargetSelectionButton();
    this.renderControls();
  }
  renderShellTemplate() {
    const modeSwitcher = this.modeSwitch ? createDesignBuilderModeSwitcher(this.modeSwitch) : null;
    return b`
			<div class="db-header">
				<div class="db-header-actions" data-header-actions>
					${modeSwitcher ?? A}
					<button
						type="button"
						class="db-btn"
						data-action="toggle-target-selection"
						aria-pressed="false"
						@click=${this.handleToggleTargetSelectionClick}
					>
						<svg class="db-btn-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
							<path fill="currentColor" d="M4 3h7v2H6v5H4V3Zm10 0h6v7h-2V5h-4V3ZM4 14h2v4h5v2H4v-6Zm14 0h2v6h-7v-2h5v-4Zm-6-3 6-6v4h4l-6 6V11h-4Z" />
						</svg>
						<span data-role="toggle-target-selection-label">Pick on page</span>
					</button>
					<div class="db-header-actions-right">
						<details class="db-header-menu">
							<summary class="db-btn db-header-menu-trigger db-tooltip-target" aria-label="${translations.importExportJson}" data-tooltip="${translations.importExportJson}">
								<svg class="db-btn-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
									<title>${translations.importExportJson}</title>
									<path
										fill="currentColor"
										d="M7 4h10v2H7l2.5 2.5L8 10 3 5l5-5 1.5 1.5L7 4Zm10 16H7v-2h10l-2.5-2.5L16 14l5 5-5 5-1.5-1.5L17 20Z"
									/>
								</svg>
							</summary>
							<div class="db-header-menu-content" role="menu" aria-label="${translations.importExportJson}">
								<button type="button" class="db-btn" data-action="export" role="menuitem" @click=${this.handleExportClick}>${translations.exportJson}</button>
								<button type="button" class="db-btn" data-action="import" role="menuitem" @click=${this.handleImportClick}>${translations.importJson}</button>
							</div>
						</details>
						${this.showSaveButton ? b`
									<button type="button" class="db-btn db-btn-primary db-tooltip-target" data-action="save" aria-label="Save" data-tooltip="Save" @click=${this.handleSaveClick}>
										<svg class="db-btn-icon" viewBox="0 -960 960 960" aria-hidden="true" focusable="false">
											<title>Save</title>
											<path fill="currentColor" d="M840-680v480q0 33-23.5 56.5T760-120H200q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h480l160 160Zm-80 34L646-760H200v560h560v-446ZM565-275q35-35 35-85t-35-85q-35-35-85-35t-85 35q-35 35-35 85t35 85q35 35 85 35t85-35ZM240-560h360v-160H240v160Zm-40-86v446-560 114Z" />
										</svg>
									</button>
								` : A}
						<details class="db-header-menu db-header-menu-danger">
							<summary class="db-btn db-header-menu-trigger db-tooltip-target" aria-label="${translations.resetActions}" data-tooltip="${translations.resetActions}">
								<svg class="db-btn-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
									<title>${translations.resetActions}</title>
									<path fill="currentColor" d="M12 3a9 9 0 1 1-8.66 11.43l1.93-.52A7 7 0 1 0 12 5h-1.59l2.3 2.29-1.42 1.42L6.58 4l4.71-4.71 1.42 1.42L10.41 3H12Z" />
								</svg>
							</summary>
							<div class="db-header-menu-content" role="menu" aria-label="${translations.resetActions}">
								<button type="button" class="db-btn db-btn-danger" data-action="reset-all-components" role="menuitem" @click=${this.handleResetAllClick}>${translations.resetAll}</button>
							</div>
						</details>
					</div>
					<input
						type="file"
						accept=".json,application/json"
						data-action="import-file"
						hidden
						@change=${this.handleImportFileChange}
					>
				</div>
			</div>
			<div data-preset-bar></div>
			<div class="db-presets">
				<div class="db-builder-context-grid">
					<label class="db-builder-context-row" for="db-component-select"
						>${translations.component}
						<select
							id="db-component-select"
							class="db-control-text"
							data-action="select-component"
							@change=${this.handleComponentSelectChange}
						></select>
					</label>
					<label class="db-builder-context-row" for="db-scope-select"
						>${translations.scope}
						<select
							id="db-scope-select"
							class="db-control-text"
							data-action="select-scope"
							@change=${this.handleScopeSelectChange}
						></select>
					</label>
				</div>
				<div class="db-header-actions">
					<button type="button" class="db-btn" data-action="reset-component" @click=${this.handleResetComponentClick}>
						${translations.resetSelected}
					</button>
				</div>
			</div>
			<div class="db-categories" data-component-controls></div>
		`;
  }
  setActiveTarget(componentName, scopeKey, preferredElement) {
    if (this.activeTargetElement) {
      this.activeTargetElement.classList.remove("db-component-target-active");
    }
    const candidates = this.getElementsForContext(componentName, scopeKey);
    const preferredMatch = preferredElement && (scopeKey === GENERAL_SCOPE_KEY || this.getScopeKeyForElement(preferredElement) === scopeKey) ? preferredElement : null;
    const fallbackCandidates = this.elementsByComponent.get(componentName) || [];
    const target = preferredMatch || candidates[0] || fallbackCandidates[0] || null;
    this.activeScopeKey = scopeKey;
    if (!target) {
      this.activeTargetElement = null;
      if (this.scopeSelect) {
        this.scopeSelect.value = this.activeScopeKey;
      }
      return;
    }
    target.classList.add("db-component-target-active");
    this.activeTargetElement = target;
    if (this.scopeSelect) {
      this.scopeSelect.value = this.activeScopeKey;
    }
  }
  getScopeKeyForElement(element) {
    return getResolvedScopeKeyForElement(element, GLOBAL_SCOPE_KEY);
  }
  getScopeLabelForElement(element) {
    const scopeKeys = getNamedScopeKeysForElement(element);
    if (scopeKeys.length === 0) {
      return "";
    }
    const labelPrefix = scopeKeys.length > 1 ? "Scopes" : "Scope";
    return `${labelPrefix}: ${scopeKeys.map((scopeKey) => scopeKey.replace(/^scope:/, "")).join(", ")}`;
  }
  getScopeLabel(scopeKey) {
    if (scopeKey === GLOBAL_SCOPE_KEY) {
      return "";
    }
    return `${translations.scope}: ${scopeKey.replace(/^scope:/, "")}`;
  }
  getElementsForContext(componentName, scopeKey) {
    const elements = this.elementsByComponent.get(componentName) || [];
    if (scopeKey === GENERAL_SCOPE_KEY) {
      return elements;
    }
    return elements.filter((element) => getNamedScopeKeysForElement(element).includes(scopeKey));
  }
  refreshScopeSelect() {
    if (!this.scopeSelect || !this.activeComponent) {
      return;
    }
    const availableScopeKeys = this.getAvailableScopeKeys(this.activeComponent);
    if (!availableScopeKeys.includes(this.activeScopeKey)) {
      this.activeScopeKey = GENERAL_SCOPE_KEY;
    }
    D(
      b`
				${availableScopeKeys.map((scopeKey) => b`<option value=${scopeKey}>${this.getScopeOptionLabel(scopeKey)}</option>`)}
			`,
      this.scopeSelect
    );
    this.scopeSelect.value = this.activeScopeKey;
  }
  getAvailableScopeKeys(componentName) {
    const availableScopes = /* @__PURE__ */ new Set([GENERAL_SCOPE_KEY]);
    const elements = this.elementsByComponent.get(componentName) || [];
    for (const element of elements) {
      for (const scopeKey of getNamedScopeKeysForElement(element)) {
        availableScopes.add(scopeKey);
      }
    }
    const specificScopes = Array.from(availableScopes).filter((scopeKey) => scopeKey !== GENERAL_SCOPE_KEY && scopeKey !== GLOBAL_SCOPE_KEY).sort((a2, b2) => a2.localeCompare(b2));
    return [GENERAL_SCOPE_KEY, ...specificScopes];
  }
  getScopeOptionLabel(scopeKey) {
    if (scopeKey === GENERAL_SCOPE_KEY) {
      return `${translations.scope}: ${translations.generalAllScopes}`;
    }
    if (scopeKey === GLOBAL_SCOPE_KEY) {
      return `${translations.scope}: ${translations.general}`;
    }
    return `${translations.scope}: ${scopeKey.replace(/^scope:/, "")}`;
  }
  getSortedComponentNames() {
    return Array.from(this.editableComponents).sort((a2, b2) => a2.localeCompare(b2));
  }
  getComponentLabel(componentName) {
    const definition = this.componentData[componentName];
    if (definition && typeof definition.name === "string" && definition.name.trim() !== "") {
      return definition.name;
    }
    return componentName;
  }
  renderPresetBar() {
    if (!this.presetBarHost) {
      return;
    }
    const presetOptions = this.getPresetOptions();
    const activePresetKey = this.getActivePresetKey(presetOptions);
    const hasProvidedPresets = presetOptions.some((preset) => preset.source === "provided");
    const savedPresetOptions = presetOptions.filter((preset) => preset.source === "saved");
    const activeSavedPreset = savedPresetOptions.find((preset) => preset.key === activePresetKey) ?? null;
    D(
      b`
				<div class=${presetOptions.length === 0 ? "db-presets u-display--none" : "db-presets"} ?hidden=${presetOptions.length === 0}>
					<label class="db-builder-context-row" for="db-component-preset-select">
						${translations.preset}
						<select
							id="db-component-preset-select"
							class="db-control-text"
							data-action="select-preset"
							.value=${activePresetKey}
							@change=${this.handlePresetSelectChange}
						>
							<option value="">${translations.chooseAPreset}</option>
							${hasProvidedPresets ? b`
										<optgroup label="Built-in presets">
											${presetOptions.filter((preset) => preset.source === "provided").map((preset) => b`<option value=${preset.key}>${preset.label}</option>`)}
										</optgroup>
									` : A}
							${savedPresetOptions.length > 0 ? b`
										<optgroup label="${translations.savedPresets}">
											${savedPresetOptions.map((preset) => b`<option value=${preset.key}>${preset.label}</option>`)}
										</optgroup>
									` : A}
						</select>
					</label>
					<details class="db-presets-menu">
						<summary class="db-btn db-presets-menu-trigger db-tooltip-target" aria-label="${translations.presetActions}" data-tooltip="${translations.presetActions}">
							<svg class="db-btn-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
								<title>${translations.presetActions}</title>
								<path
									fill="currentColor"
									d="M12 7a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Zm0 6.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Zm0 6.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z"
								/>
							</svg>
						</summary>
						<div class="db-presets-menu-content" role="menu" aria-label="${translations.presetActions}">
							<button type="button" class="db-btn db-btn-primary" data-action="save-preset" role="menuitem" @click=${this.handleSavePresetClick}>
								${translations.savePreset}
							</button>
							<button
								type="button"
								class="db-btn"
								data-action="delete-preset"
								role="menuitem"
								?disabled=${activeSavedPreset === null}
								@click=${this.handleDeleteActivePresetClick}
							>
								${translations.deletePreset}
							</button>
						</div>
					</details>
				</div>
			`,
      this.presetBarHost
    );
  }
  savePreset() {
    const name = prompt("Preset name:");
    if (!name || !name.trim()) return;
    const trimmed = name.trim();
    const normalizedName = trimmed.toLowerCase();
    if (this.getProvidedPresets().some((preset) => preset.id.toLowerCase() === normalizedName || preset.label.toLowerCase() === normalizedName)) {
      alert(`A built-in preset already uses the name "${trimmed}". Choose another preset name.`);
      return;
    }
    const existing = this.presetManager.names();
    if (existing.includes(trimmed)) {
      if (!confirm(`A preset named "${trimmed}" already exists. Overwrite it?`)) {
        return;
      }
    }
    this.presetManager.save(trimmed, this.getCurrentPresetState());
    this.presetManager.setActive(trimmed);
    this.refreshPresetBar();
    this.emitAction("preset-save", {
      presetName: trimmed
    });
  }
  loadPreset(option) {
    const currentTokenOverrides = this.hostElement?.overrideState.token ?? {};
    const nextTokenOverrides = option.targets.token ? option.state.token : currentTokenOverrides;
    if (option.targets.token) {
      clearTokenOverridesFromRootDocument(currentTokenOverrides);
      applyTokenOverridesToRootDocument(option.state.token);
    }
    if (option.targets.component) {
      this.clearAppliedOverrides();
      this.overrides = normalizeDesignBuilderOverrideState({ component: option.state.component }).component;
      this.applySavedOverrides();
    }
    this.syncOverrideState(nextTokenOverrides);
    if (option.source === "saved") {
      this.presetManager.setActive(option.id);
    } else {
      this.presetManager.clearActive();
    }
    this.refreshPresetBar();
    this.renderControls();
    this.emitAction("preset-load", {
      presetName: option.label,
      presetSource: option.source
    });
  }
  deletePreset(name) {
    if (!confirm(`Delete preset "${name}"?`)) return;
    this.presetManager.delete(name);
    this.refreshPresetBar();
    this.emitAction("preset-delete", {
      presetName: name
    });
  }
  refreshPresetBar() {
    this.renderPresetBar();
  }
  getProvidedPresets() {
    return Array.isArray(this.hostElement?.presets) ? this.hostElement.presets : [];
  }
  getPresetOptions() {
    const providedOptions = this.getProvidedPresets().map((preset) => ({
      key: `provided:${preset.id}`,
      id: preset.id,
      label: preset.label,
      source: "provided",
      state: preset.state,
      targets: preset.targets
    }));
    const savedOptions = Object.entries(this.presetManager.loadAll()).sort(([leftName], [rightName]) => leftName.localeCompare(rightName)).map(([name, state2]) => ({
      key: `saved:${name}`,
      id: name,
      label: name,
      source: "saved",
      state: state2,
      targets: {
        token: true,
        component: true
      }
    }));
    return [...providedOptions, ...savedOptions];
  }
  getActivePresetKey(presetOptions) {
    const activeSavedPresetName = this.presetManager.getActive();
    if (activeSavedPresetName) {
      const activeSavedPreset = presetOptions.find((preset) => preset.source === "saved" && preset.id === activeSavedPresetName);
      if (activeSavedPreset) {
        return activeSavedPreset.key;
      }
    }
    const currentState = this.getCurrentPresetState();
    return presetOptions.find(
      (preset) => designBuilderPresetMatchesState(
        {
          id: preset.id,
          label: preset.label,
          state: preset.state,
          targets: preset.targets
        },
        currentState
      )
    )?.key ?? "";
  }
  findPresetOption(key) {
    return this.getPresetOptions().find((preset) => preset.key === key) ?? null;
  }
  getCurrentPresetState() {
    return {
      token: this.hostElement?.overrideState.token ?? {},
      component: normalizeDesignBuilderOverrideState({ component: this.overrides }).component
    };
  }
  exportJson() {
    const state2 = normalizeDesignBuilderOverrideState({
      token: this.hostElement?.overrideState.token ?? {},
      component: this.overrides
    });
    const data = JSON.stringify(state2, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "design-builder-overrides.json";
    anchor.click();
    URL.revokeObjectURL(url);
    this.emitAction("export", {
      fileName: anchor.download
    });
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
    const importedState = normalizeDesignBuilderOverrideState(parsed);
    const importedOverrides = importedState.component;
    if (Object.keys(importedOverrides).length === 0) {
      alert("Error: No recognized component overrides were found in the selected file.");
      return;
    }
    const currentTokenOverrides = this.hostElement?.overrideState.token ?? {};
    clearTokenOverridesFromRootDocument(currentTokenOverrides);
    applyTokenOverridesToRootDocument(importedState.token);
    this.clearAppliedOverrides();
    this.overrides = importedOverrides;
    this.applySavedOverrides();
    this.syncOverrideState(importedState.token);
    this.presetManager.clearActive();
    this.refreshPresetBar();
    this.renderControls();
    this.emitAction("import", {
      fileName: file.name,
      tokenOverrideCount: Object.keys(importedState.token).length,
      componentScopeCount: Object.keys(importedOverrides).length
    });
  }
  renderControls() {
    if (!this.controlsContainer) return;
    if (!this.activeComponent) {
      D(b`No component selected.`, this.controlsContainer);
      return;
    }
    const categories = this.buildCategoriesForComponent(this.activeComponent);
    if (categories.length === 0) {
      D(b`No token customization options were found for this component.`, this.controlsContainer);
      return;
    }
    D(b`${categories.map((category) => this.renderControlsCategoryTemplate(category))}`, this.controlsContainer);
  }
  renderComponentOptions() {
    if (!this.componentSelect) {
      return;
    }
    const componentNames = this.getSortedComponentNames();
    D(
      b`
				${componentNames.map((componentName) => b`<option value=${componentName}>${this.getComponentLabel(componentName)}</option>`)}
			`,
      this.componentSelect
    );
    if (this.activeComponent && componentNames.includes(this.activeComponent)) {
      this.componentSelect.value = this.activeComponent;
    }
  }
  renderControlsCategoryTemplate(category) {
    return createDesignBuilderCategory(
      category,
      category.settings.map((setting) => this.renderControl(setting)),
      false
    );
  }
  renderControl(setting) {
    const currentValue = this.overrides[this.activeScopeKey]?.[this.activeComponent]?.[setting.variable] || setting.default;
    return createDesignBuilderControl(setting, currentValue, (variable, value) => {
      this.handleChange(this.activeComponent, this.activeScopeKey, variable, value, setting.default);
    });
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
    this.syncOverrideState();
    this.presetManager.clearActive();
    this.refreshPresetBar();
    this.emitAction("change", {
      componentName,
      scopeKey,
      variable,
      value,
      defaultValue
    });
  }
  hasLocalScopeOverrideForElement(componentName, variable, element) {
    const localScopeKeys = getNamedScopeKeysForElement(element);
    if (localScopeKeys.length === 0) {
      return false;
    }
    return localScopeKeys.some((localScopeKey) => {
      const localValue = this.overrides[localScopeKey]?.[componentName]?.[variable];
      return typeof localValue === "string" && localValue.trim() !== "";
    });
  }
  applyVariable(componentName, scopeKey, variable, value) {
    let elements = this.getElementsForContext(componentName, scopeKey);
    if (scopeKey === GENERAL_SCOPE_KEY) {
      elements = elements.filter((element) => !this.hasLocalScopeOverrideForElement(componentName, variable, element));
    }
    for (const element of elements) {
      element.style.setProperty(variable, value);
    }
  }
  removeVariable(componentName, scopeKey, variable) {
    let elements = this.getElementsForContext(componentName, scopeKey);
    if (scopeKey === GENERAL_SCOPE_KEY) {
      elements = elements.filter((element) => !this.hasLocalScopeOverrideForElement(componentName, variable, element));
    }
    for (const element of elements) {
      element.style.removeProperty(variable);
    }
  }
  clearAppliedOverrides() {
    for (const [scopeKey, scopeOverrides] of Object.entries(this.overrides)) {
      for (const [componentName, componentOverrides] of Object.entries(scopeOverrides)) {
        for (const variable of Object.keys(componentOverrides)) {
          this.removeVariable(componentName, scopeKey, variable);
        }
      }
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
    this.syncOverrideState();
    this.presetManager.clearActive();
    this.refreshPresetBar();
    this.renderControls();
    this.emitAction("reset-component", {
      componentName,
      scopeKey: this.activeScopeKey
    });
  }
  resetAllComponents() {
    if (!confirm("Reset all component customizations on this page?")) {
      return;
    }
    this.clearAppliedOverrides();
    this.overrides = {};
    this.syncOverrideState();
    this.presetManager.clearActive();
    this.refreshPresetBar();
    this.renderControls();
    this.emitAction("reset-all");
  }
  dispose() {
    if (this.activeTargetElement) {
      this.activeTargetElement.classList.remove("db-component-target-active");
      this.activeTargetElement = null;
    }
    this.menuDismissController?.dispose();
    this.menuDismissController = null;
    for (const cleanup of this.cleanupCallbacks.splice(0).reverse()) {
      cleanup();
    }
    for (const elements of this.elementsByComponent.values()) {
      for (const element of elements) {
        element.classList.remove("db-component-target", "db-component-target-active");
        delete element.dataset.customizeTooltip;
      }
    }
    this.root?.remove();
    this.root = null;
    this.controlsContainer = null;
    this.componentSelect = null;
    this.scopeSelect = null;
    this.toggleTargetSelectionButton = null;
    this.toggleTargetSelectionLabel = null;
    this.presetBarHost = null;
  }
  syncOverrideState(tokenOverrides = null) {
    if (!this.hostElement) {
      return;
    }
    this.hostElement.overrideState = normalizeDesignBuilderOverrideState({
      token: tokenOverrides ?? this.hostElement.overrideState.token,
      component: this.overrides
    });
  }
  emitAction(action, metadata) {
    if (!this.hostElement) {
      return;
    }
    emitDesignBuilderActionEvent(this.hostElement, {
      action,
      mode: "component-customizer",
      state: this.hostElement.overrideState,
      metadata
    });
  }
  handleToggleTargetSelectionClick = /* @__PURE__ */ __name(() => {
    this.setTargetSelectionEnabled(!this.isTargetSelectionEnabled);
  }, "handleToggleTargetSelectionClick");
  handleExportClick = /* @__PURE__ */ __name(() => {
    this.exportJson();
  }, "handleExportClick");
  handleImportClick = /* @__PURE__ */ __name(() => {
    this.root?.querySelector('[data-action="import-file"]')?.click();
  }, "handleImportClick");
  handleImportFileChange = /* @__PURE__ */ __name((event) => {
    const input = event.currentTarget;
    const file = input.files?.[0];
    if (!file) {
      return;
    }
    void this.importJson(file);
    input.value = "";
  }, "handleImportFileChange");
  handleSavePresetClick = /* @__PURE__ */ __name(() => {
    this.savePreset();
  }, "handleSavePresetClick");
  handleComponentSelectChange = /* @__PURE__ */ __name((event) => {
    this.activeComponent = event.currentTarget.value || null;
    if (this.activeComponent) {
      this.refreshScopeSelect();
      this.setActiveTarget(this.activeComponent, this.activeScopeKey);
    }
    this.renderControls();
  }, "handleComponentSelectChange");
  handleScopeSelectChange = /* @__PURE__ */ __name((event) => {
    this.activeScopeKey = event.currentTarget.value || GENERAL_SCOPE_KEY;
    if (this.activeComponent) {
      this.setActiveTarget(this.activeComponent, this.activeScopeKey);
    }
    this.renderControls();
  }, "handleScopeSelectChange");
  handleResetComponentClick = /* @__PURE__ */ __name(() => {
    if (!this.activeComponent) {
      return;
    }
    this.resetComponent(this.activeComponent);
  }, "handleResetComponentClick");
  handleResetAllClick = /* @__PURE__ */ __name(() => {
    this.resetAllComponents();
  }, "handleResetAllClick");
  handleSaveClick = /* @__PURE__ */ __name(() => {
    this.emitAction("save");
  }, "handleSaveClick");
  handlePresetSelectChange = /* @__PURE__ */ __name((event) => {
    const option = this.findPresetOption(event.currentTarget.value);
    if (!option) {
      this.presetManager.clearActive();
      this.refreshPresetBar();
      return;
    }
    this.loadPreset(option);
  }, "handlePresetSelectChange");
  handleDeleteActivePresetClick = /* @__PURE__ */ __name(() => {
    const activePreset = this.findPresetOption(this.getActivePresetKey(this.getPresetOptions()));
    if (!activePreset || activePreset.source !== "saved") {
      return;
    }
    this.deletePreset(activePreset.id);
  }, "handleDeleteActivePresetClick");
};
__name(_ComponentCustomizerRuntime, "ComponentCustomizerRuntime");
let ComponentCustomizerRuntime = _ComponentCustomizerRuntime;
const COMPONENT_CUSTOMIZER_STYLE_ID = "design-builder-component-customizer-style";
async function initializeComponentCustomizer(componentTokenData, tokenLibraryPayload, options = {}) {
  const mountElement = options.mountElement ?? document.body;
  ensureComponentCustomizerStyles(mountElement);
  const customizeData = parseComponentTokenData(componentTokenData);
  if (Object.keys(customizeData).length === 0) {
    return null;
  }
  const tokenLibrary = isTokenData(tokenLibraryPayload) ? tokenLibraryPayload : null;
  if (!tokenLibrary) {
    return null;
  }
  const runtime = new ComponentCustomizerRuntime(customizeData, tokenLibrary, mountElement, {
    modeSwitch: options.modeSwitch,
    hostElement: options.hostElement,
    showSaveButton: options.showSaveButton
  });
  return runtime;
}
__name(initializeComponentCustomizer, "initializeComponentCustomizer");
function ensureComponentCustomizerStyles(mountElement) {
  if (mountElement instanceof ShadowRoot) {
    return;
  }
  if (document.getElementById(COMPONENT_CUSTOMIZER_STYLE_ID)) {
    return;
  }
  const style = document.createElement("style");
  style.id = COMPONENT_CUSTOMIZER_STYLE_ID;
  style.textContent = designBuilderStyles;
  document.head.appendChild(style);
}
__name(ensureComponentCustomizerStyles, "ensureComponentCustomizerStyles");
function createComponentCustomizerModeAdapter() {
  return async ({ hostElement, configuration, renderContainer, modeSwitch }) => {
    const runtime = await initializeComponentCustomizer(configuration.componentData, configuration.tokenData, {
      mountElement: renderContainer,
      modeSwitch,
      hostElement,
      showSaveButton: configuration.showSaveButton
    });
    return {
      dispose: /* @__PURE__ */ __name(() => {
        runtime?.dispose();
      }, "dispose")
    };
  };
}
__name(createComponentCustomizerModeAdapter, "createComponentCustomizerModeAdapter");
const _FullPageEditorRuntime = class _FullPageEditorRuntime {
  container;
  hostElement;
  tokens;
  overrides;
  presetManager;
  root = null;
  presetBarHost = null;
  menuDismissController = null;
  showLockedFields = false;
  modeSwitch;
  showSaveButton;
  constructor(container, tokens, hostElement, modeSwitch, showSaveButton = true) {
    this.container = container;
    this.hostElement = hostElement;
    this.tokens = tokens;
    this.presetManager = new DesignBuilderPresetManager();
    this.overrides = { ...hostElement.overrideState.token };
    this.modeSwitch = modeSwitch;
    this.showSaveButton = showSaveButton;
    this.removeLockedOverrides();
    this.syncOverrideState();
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
      this.syncOverrideState();
    }
  }
  render() {
    registerControlInfoTooltips();
    if (!this.root) {
      this.root = document.createElement("div");
      this.root.className = "db-builder db-builder-fullpage";
      this.container.appendChild(this.root);
      this.menuDismissController = createDetailsMenuDismissController(this.root);
    }
    D(this.renderShellTemplate(), this.root);
    this.presetBarHost = this.root.querySelector("[data-preset-bar]");
    this.renderPresetBar();
  }
  destroy() {
    this.menuDismissController?.dispose();
    this.menuDismissController = null;
    D(A, this.container);
    this.root = null;
    this.presetBarHost = null;
  }
  renderShellTemplate() {
    const modeSwitcher = this.modeSwitch ? createDesignBuilderModeSwitcher(this.modeSwitch) : null;
    const lockedFieldsLabel = this.showLockedFields ? translations.hideUneditable : translations.showUneditable;
    const lockedFieldsTitle = this.showLockedFields ? "Hide non-editable fields" : "Show non-editable fields";
    return b`
			<div class="db-header">
				<div class="db-header-actions">
					${modeSwitcher ?? A}
					<button
						type="button"
						class="db-btn db-header-toggle-row"
						data-action="toggle-locked"
						aria-pressed=${this.showLockedFields ? "true" : "false"}
						aria-label=${lockedFieldsLabel}
						title=${lockedFieldsTitle}
						@click=${this.handleLockedFieldsToggle}
					>
						<svg class="db-btn-icon" viewBox="0 -960 960 960" aria-hidden="true" focusable="false">
							<path fill="currentColor" d="m644-428-58-58q9-47-27-88t-93-32l-58-58q17-8 34.5-12t37.5-4q75 0 127.5 52.5T660-500q0 20-4 37.5T644-428Zm128 126-58-56q38-29 67.5-63.5T832-500q-50-101-143.5-160.5T480-720q-29 0-57 4t-55 12l-62-62q41-17 84-25.5t90-8.5q151 0 269 83.5T920-500q-23 59-60.5 109.5T772-302Zm20 246L624-222q-35 11-70.5 16.5T480-200q-151 0-269-83.5T40-500q21-53 53-98.5t73-81.5L56-792l56-56 736 736-56 56ZM222-624q-29 26-53 57t-41 67q50 101 143.5 160.5T480-280q20 0 39-2.5t39-5.5l-36-38q-11 3-21 4.5t-21 1.5q-75 0-127.5-52.5T300-500q0-11 1.5-21t4.5-21l-84-82Zm319 93Zm-151 75Z" />
						</svg>
						<span>${lockedFieldsLabel}</span>
					</button>
					<div class="db-header-actions-right">
						<details class="db-header-menu">
							<summary class="db-btn db-header-menu-trigger db-tooltip-target" aria-label="${translations.importExportJson}" data-tooltip="${translations.importExportJson}">
								<svg class="db-btn-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
									<title>${translations.importExportJson}</title>
									<path
										fill="currentColor"
										d="M7 4h10v2H7l2.5 2.5L8 10 3 5l5-5 1.5 1.5L7 4Zm10 16H7v-2h10l-2.5-2.5L16 14l5 5-5 5-1.5-1.5L17 20Z"
									/>
								</svg>
							</summary>
							<div class="db-header-menu-content" role="menu" aria-label="${translations.importExportJson}">
								<button type="button" class="db-btn" data-action="export" role="menuitem" @click=${this.handleExportClick}>${translations.exportJson}</button>
								<button type="button" class="db-btn" data-action="import" role="menuitem" @click=${this.handleImportClick}>${translations.importJson}</button>
							</div>
						</details>
						${this.showSaveButton ? b`
									<button type="button" class="db-btn db-btn-primary db-tooltip-target" data-action="save" aria-label="Save" data-tooltip="Save" @click=${this.handleSaveClick}>
										<svg class="db-btn-icon" viewBox="0 -960 960 960" aria-hidden="true" focusable="false">
											<title>Save</title>
											<path fill="currentColor" d="M840-680v480q0 33-23.5 56.5T760-120H200q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h480l160 160Zm-80 34L646-760H200v560h560v-446ZM565-275q35-35 35-85t-35-85q-35-35-85-35t-85 35q-35 35-35 85t35 85q35 35 85 35t85-35ZM240-560h360v-160H240v160Zm-40-86v446-560 114Z" />
										</svg>
									</button>
								` : A}
						<details class="db-header-menu db-header-menu-danger">
							<summary class="db-btn db-header-menu-trigger db-tooltip-target" aria-label="${translations.resetActions}" data-tooltip="${translations.resetActions}">
								<svg class="db-btn-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
									<title>${translations.resetActions}</title>
									<path fill="currentColor" d="M12 3a9 9 0 1 1-8.66 11.43l1.93-.52A7 7 0 1 0 12 5h-1.59l2.3 2.29-1.42 1.42L6.58 4l4.71-4.71 1.42 1.42L10.41 3H12Z" />
								</svg>
							</summary>
							<div class="db-header-menu-content" role="menu" aria-label="${translations.resetActions}">
								<button type="button" class="db-btn db-btn-danger" data-action="reset" role="menuitem" @click=${this.handleResetClick}>${translations.resetAll}</button>
							</div>
						</details>
					</div>
					<input
						type="file"
						accept=".json,application/json"
						data-action="import-file"
						hidden
						@change=${this.handleImportFileChange}
					>
				</div>
			</div>
			<div data-preset-bar></div>
			<div class="db-categories">
				${this.tokens.categories.map((category) => this.renderCategoryElement(category))}
			</div>
		`;
  }
  renderCategoryElement(category) {
    return createDesignBuilderCategory(category, this.renderCategoryBody(category), true);
  }
  renderCategoryBody(category) {
    if (category.present === "swatch") {
      return [createDesignBuilderSwatchBand(category.settings)];
    }
    const items = [];
    for (const setting of category.settings) {
      if (setting.locked) {
        if (!this.showLockedFields) {
          continue;
        }
        const currentValue2 = this.overrides[setting.variable] || setting.default;
        items.push(createReadOnlyDesignBuilderControl(setting, currentValue2));
        continue;
      }
      const currentValue = this.overrides[setting.variable] || setting.default;
      items.push(
        createDesignBuilderControl(setting, currentValue, (variable, value) => {
          this.handleChange(variable, value, setting.default);
        })
      );
    }
    return items;
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
    this.syncOverrideState();
    this.presetManager.clearActive();
    this.refreshPresetBar();
    this.emitAction("change", {
      variable,
      value,
      defaultValue
    });
  }
  applyAll() {
    for (const [prop, value] of Object.entries(this.overrides)) {
      document.documentElement.style.setProperty(prop, value);
    }
    applyComponentOverridesToPage(this.hostElement.overrideState.component);
  }
  resetAll() {
    if (!confirm("Reset all tokens to their default values? This clears all customizations.")) {
      return;
    }
    for (const prop of Object.keys(this.overrides)) {
      document.documentElement.style.removeProperty(prop);
    }
    this.overrides = {};
    this.syncOverrideState();
    this.presetManager.clearActive();
    this.render();
    this.emitAction("reset-all");
  }
  exportJson() {
    const state2 = normalizeDesignBuilderOverrideState({
      token: this.overrides,
      component: this.hostElement.overrideState.component
    });
    const data = JSON.stringify(state2, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "design-builder-overrides.json";
    anchor.click();
    URL.revokeObjectURL(url);
    this.emitAction("export", {
      fileName: anchor.download
    });
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
    const importedState = normalizeDesignBuilderOverrideState(parsed);
    const importedOverrides = {};
    const entries = Object.entries(importedState.token);
    for (const [variable, value] of entries) {
      if (!tokenVariables.has(variable)) continue;
      if (lockedVariables.has(variable)) continue;
      importedOverrides[variable] = value;
    }
    if (entries.length > 0 && Object.keys(importedOverrides).length === 0) {
      alert("Error: No recognized design token overrides were found in the selected file.");
      return;
    }
    for (const prop of Object.keys(this.overrides)) {
      document.documentElement.style.removeProperty(prop);
    }
    clearComponentOverridesFromPage(this.hostElement.overrideState.component);
    applyComponentOverridesToPage(importedState.component);
    this.overrides = importedOverrides;
    this.applyAll();
    this.hostElement.overrideState = normalizeDesignBuilderOverrideState({
      token: importedOverrides,
      component: importedState.component
    });
    this.presetManager.clearActive();
    this.render();
    this.emitAction("import", {
      fileName: file.name,
      tokenOverrideCount: Object.keys(importedOverrides).length,
      componentScopeCount: Object.keys(importedState.component).length
    });
  }
  renderPresetBar() {
    if (!this.presetBarHost) {
      return;
    }
    const presetOptions = this.getPresetOptions();
    const activePresetKey = this.getActivePresetKey(presetOptions);
    const hasProvidedPresets = presetOptions.some((preset) => preset.source === "provided");
    const savedPresetOptions = presetOptions.filter((preset) => preset.source === "saved");
    const activeSavedPreset = savedPresetOptions.find((preset) => preset.key === activePresetKey) ?? null;
    D(
      b`
				<div class=${presetOptions.length === 0 ? "db-presets u-display--none" : "db-presets"} ?hidden=${presetOptions.length === 0}>
					<label class="db-builder-context-row" for="db-full-page-preset-select">
						${translations.preset}
						<select
							id="db-full-page-preset-select"
							class="db-control-text"
							data-action="select-preset"
							.value=${activePresetKey}
							@change=${this.handlePresetSelectChange}
						>
							<option value="">${translations.chooseAPreset}</option>
							${hasProvidedPresets ? b`
										<optgroup label="Built-in presets">
											${presetOptions.filter((preset) => preset.source === "provided").map((preset) => b`<option value=${preset.key}>${preset.label}</option>`)}
										</optgroup>
									` : A}
							${savedPresetOptions.length > 0 ? b`
										<optgroup label="${translations.savedPresets}">
											${savedPresetOptions.map((preset) => b`<option value=${preset.key}>${preset.label}</option>`)}
										</optgroup>
									` : A}
						</select>
					</label>
					<details class="db-presets-menu">
						<summary class="db-btn db-presets-menu-trigger db-tooltip-target" aria-label="${translations.presetActions}" data-tooltip="${translations.presetActions}">
							<svg class="db-btn-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
								<title>${translations.presetActions}</title>
								<path
									fill="currentColor"
									d="M12 7a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Zm0 6.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Zm0 6.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z"
								/>
							</svg>
						</summary>
						<div class="db-presets-menu-content" role="menu" aria-label="${translations.presetActions}">
							<button type="button" class="db-btn db-btn-primary" data-action="save-preset" role="menuitem" @click=${this.handleSavePresetClick}>
								${translations.savePreset}
							</button>
							<button
								type="button"
								class="db-btn"
								data-action="delete-preset"
								role="menuitem"
								?disabled=${activeSavedPreset === null}
								@click=${this.handleDeleteActivePresetClick}
							>
								${translations.deletePreset}
							</button>
						</div>
					</details>
				</div>
			`,
      this.presetBarHost
    );
  }
  savePreset() {
    const name = prompt("Preset name:");
    if (!name || !name.trim()) return;
    const trimmed = name.trim();
    const normalizedName = trimmed.toLowerCase();
    if (this.getProvidedPresets().some((preset) => preset.id.toLowerCase() === normalizedName || preset.label.toLowerCase() === normalizedName)) {
      alert(`A built-in preset already uses the name "${trimmed}". Choose another preset name.`);
      return;
    }
    const existing = this.presetManager.names();
    if (existing.includes(trimmed)) {
      if (!confirm(`A preset named "${trimmed}" already exists. Overwrite it?`)) {
        return;
      }
    }
    this.presetManager.save(trimmed, this.getCurrentPresetState());
    this.presetManager.setActive(trimmed);
    this.refreshPresetBar();
    this.emitAction("preset-save", {
      presetName: trimmed
    });
  }
  loadPreset(option) {
    if (option.targets.token) {
      clearTokenOverridesFromRootDocument(this.overrides);
      this.overrides = { ...option.state.token };
      this.removeLockedOverrides();
    }
    const nextComponentOverrides = option.targets.component ? normalizeDesignBuilderOverrideState({ component: option.state.component }).component : this.hostElement.overrideState.component;
    if (option.targets.component) {
      clearComponentOverridesFromPage(this.hostElement.overrideState.component);
    }
    this.hostElement.overrideState = normalizeDesignBuilderOverrideState({
      token: this.overrides,
      component: nextComponentOverrides
    });
    this.removeLockedOverrides();
    this.applyAll();
    if (option.source === "saved") {
      this.presetManager.setActive(option.id);
    } else {
      this.presetManager.clearActive();
    }
    this.render();
    this.emitAction("preset-load", {
      presetName: option.label,
      presetSource: option.source
    });
  }
  deletePreset(name) {
    if (!confirm(`Delete preset "${name}"?`)) return;
    this.presetManager.delete(name);
    this.refreshPresetBar();
    this.emitAction("preset-delete", {
      presetName: name
    });
  }
  refreshPresetBar() {
    this.renderPresetBar();
  }
  getProvidedPresets() {
    return Array.isArray(this.hostElement.presets) ? this.hostElement.presets : [];
  }
  getPresetOptions() {
    const providedOptions = this.getProvidedPresets().map((preset) => ({
      key: `provided:${preset.id}`,
      id: preset.id,
      label: preset.label,
      source: "provided",
      state: preset.state,
      targets: preset.targets
    }));
    const savedOptions = Object.entries(this.presetManager.loadAll()).sort(([leftName], [rightName]) => leftName.localeCompare(rightName)).map(([name, state2]) => ({
      key: `saved:${name}`,
      id: name,
      label: name,
      source: "saved",
      state: state2,
      targets: {
        token: true,
        component: true
      }
    }));
    return [...providedOptions, ...savedOptions];
  }
  getActivePresetKey(presetOptions) {
    const activeSavedPresetName = this.presetManager.getActive();
    if (activeSavedPresetName) {
      const activeSavedPreset = presetOptions.find((preset) => preset.source === "saved" && preset.id === activeSavedPresetName);
      if (activeSavedPreset) {
        return activeSavedPreset.key;
      }
    }
    const currentState = this.getCurrentPresetState();
    return presetOptions.find(
      (preset) => designBuilderPresetMatchesState(
        {
          id: preset.id,
          label: preset.label,
          state: preset.state,
          targets: preset.targets
        },
        currentState
      )
    )?.key ?? "";
  }
  findPresetOption(key) {
    return this.getPresetOptions().find((preset) => preset.key === key) ?? null;
  }
  getCurrentPresetState() {
    return {
      token: { ...this.overrides },
      component: this.hostElement.overrideState.component
    };
  }
  syncOverrideState() {
    this.hostElement.overrideState = normalizeDesignBuilderOverrideState({
      token: this.overrides,
      component: this.hostElement.overrideState.component
    });
  }
  emitAction(action, metadata) {
    emitDesignBuilderActionEvent(this.hostElement, {
      action,
      mode: "full-page",
      state: this.hostElement.overrideState,
      metadata
    });
  }
  handleLockedFieldsToggle = /* @__PURE__ */ __name(() => {
    this.showLockedFields = !this.showLockedFields;
    this.render();
  }, "handleLockedFieldsToggle");
  handleExportClick = /* @__PURE__ */ __name(() => {
    this.exportJson();
  }, "handleExportClick");
  handleImportClick = /* @__PURE__ */ __name(() => {
    this.root?.querySelector('[data-action="import-file"]')?.click();
  }, "handleImportClick");
  handleImportFileChange = /* @__PURE__ */ __name((event) => {
    const input = event.currentTarget;
    const file = input.files?.[0];
    if (!file) {
      return;
    }
    void this.importJson(file);
    input.value = "";
  }, "handleImportFileChange");
  handleResetClick = /* @__PURE__ */ __name(() => {
    this.resetAll();
  }, "handleResetClick");
  handleSavePresetClick = /* @__PURE__ */ __name(() => {
    this.savePreset();
  }, "handleSavePresetClick");
  handleSaveClick = /* @__PURE__ */ __name(() => {
    this.emitAction("save");
  }, "handleSaveClick");
  handlePresetSelectChange = /* @__PURE__ */ __name((event) => {
    const option = this.findPresetOption(event.currentTarget.value);
    if (!option) {
      this.presetManager.clearActive();
      this.refreshPresetBar();
      return;
    }
    this.loadPreset(option);
  }, "handlePresetSelectChange");
  handleDeleteActivePresetClick = /* @__PURE__ */ __name(() => {
    const activePreset = this.findPresetOption(this.getActivePresetKey(this.getPresetOptions()));
    if (!activePreset || activePreset.source !== "saved") {
      return;
    }
    this.deletePreset(activePreset.id);
  }, "handleDeleteActivePresetClick");
};
__name(_FullPageEditorRuntime, "FullPageEditorRuntime");
let FullPageEditorRuntime = _FullPageEditorRuntime;
const _DesignBuilderSplitLocalStorageStore = class _DesignBuilderSplitLocalStorageStore {
  key;
  storage;
  constructor(key = SPLIT_STORAGE_KEY, storage = browserLocalStorageAdapter) {
    this.key = key;
    this.storage = storage;
  }
  load() {
    const rawValue = this.storage.getItem(this.key);
    if (!rawValue) {
      return null;
    }
    const ratio = parseFloat(rawValue);
    if (!Number.isFinite(ratio) || ratio < MIN_SPLIT || ratio > MAX_SPLIT) {
      return null;
    }
    return ratio;
  }
  save(value) {
    if (!Number.isFinite(value) || value < MIN_SPLIT || value > MAX_SPLIT) {
      return;
    }
    this.storage.setItem(this.key, value.toString());
  }
};
__name(_DesignBuilderSplitLocalStorageStore, "DesignBuilderSplitLocalStorageStore");
let DesignBuilderSplitLocalStorageStore = _DesignBuilderSplitLocalStorageStore;
function initializePreviewSplitDivider(splitStore = new DesignBuilderSplitLocalStorageStore(), hostElement) {
  const layout = document.querySelector(".db-layout");
  const divider = document.querySelector("[data-db-divider]");
  if (!layout || !divider) return;
  if (divider.dataset.dbDividerInitialized === "true") return;
  divider.dataset.dbDividerInitialized = "true";
  const saved = splitStore.load();
  if (saved !== null) {
    layout.style.setProperty("--db-split", `${saved}%`);
  }
  const onPointerMove = /* @__PURE__ */ __name((event) => {
    const rect = layout.getBoundingClientRect();
    let ratio = (event.clientX - rect.left) / rect.width * 100;
    ratio = Math.max(MIN_SPLIT, Math.min(MAX_SPLIT, ratio));
    layout.style.setProperty("--db-split", `${ratio}%`);
  }, "onPointerMove");
  const onPointerUp = /* @__PURE__ */ __name((event) => {
    divider.classList.remove("is-dragging");
    document.body.style.userSelect = "";
    document.body.style.cursor = "";
    divider.releasePointerCapture(event.pointerId);
    divider.removeEventListener("pointermove", onPointerMove);
    divider.removeEventListener("pointerup", onPointerUp);
    const current = layout.style.getPropertyValue("--db-split");
    if (current) {
      const split = parseFloat(current);
      splitStore.save(split);
      if (hostElement) {
        emitDesignBuilderActionEvent(hostElement, {
          action: "split-change",
          mode: "full-page",
          state: hostElement.overrideState,
          metadata: { split }
        });
      }
    }
  }, "onPointerUp");
  divider.addEventListener("pointerdown", (event) => {
    event.preventDefault();
    divider.classList.add("is-dragging");
    document.body.style.userSelect = "none";
    document.body.style.cursor = "col-resize";
    divider.setPointerCapture(event.pointerId);
    divider.addEventListener("pointermove", onPointerMove);
    divider.addEventListener("pointerup", onPointerUp);
  });
}
__name(initializePreviewSplitDivider, "initializePreviewSplitDivider");
const FULL_PAGE_RUNTIME_MOUNT_ID = "design-builder-full-page-runtime";
function initializeFullPageEditor(tokenData, renderContainer, hostElement, modeSwitch, showSaveButton = true) {
  const mountElement = ensureFullPageRuntimeMount(renderContainer);
  const tokens = parseDesignTokenLibraryData(tokenData);
  if (!tokens) {
    mountElement.textContent = "Error: Invalid or missing token data.";
    return null;
  }
  const runtime = new FullPageEditorRuntime(mountElement, tokens, hostElement, modeSwitch, showSaveButton);
  initializePreviewSplitDivider(void 0, hostElement);
  return runtime;
}
__name(initializeFullPageEditor, "initializeFullPageEditor");
function ensureFullPageRuntimeMount(renderContainer) {
  const existingMount = renderContainer.querySelector(`#${FULL_PAGE_RUNTIME_MOUNT_ID}`);
  if (existingMount) {
    existingMount.innerHTML = "";
    return existingMount;
  }
  const mountElement = document.createElement("div");
  mountElement.id = FULL_PAGE_RUNTIME_MOUNT_ID;
  renderContainer.appendChild(mountElement);
  return mountElement;
}
__name(ensureFullPageRuntimeMount, "ensureFullPageRuntimeMount");
function createFullPageEditorModeAdapter() {
  return ({ hostElement, configuration, renderContainer, modeSwitch }) => {
    const runtime = initializeFullPageEditor(configuration.tokenData, renderContainer, hostElement, modeSwitch, configuration.showSaveButton);
    return {
      dispose: /* @__PURE__ */ __name(() => {
        runtime?.destroy();
      }, "dispose")
    };
  };
}
__name(createFullPageEditorModeAdapter, "createFullPageEditorModeAdapter");
function registerBuiltInDesignBuilderModeAdapters() {
  registerDesignBuilderModeAdapter(DESIGN_BUILDER_MODE_FULL_PAGE, createFullPageEditorModeAdapter());
  registerDesignBuilderModeAdapter(DESIGN_BUILDER_MODE_COMPONENT_CUSTOMIZER, createComponentCustomizerModeAdapter());
}
__name(registerBuiltInDesignBuilderModeAdapters, "registerBuiltInDesignBuilderModeAdapters");
function getExistingRootElements() {
  return Array.from(document.querySelectorAll("design-builder"));
}
__name(getExistingRootElements, "getExistingRootElements");
function serializeOverrideState(state2) {
  try {
    return JSON.stringify(normalizeDesignBuilderOverrideState(state2));
  } catch {
    return null;
  }
}
__name(serializeOverrideState, "serializeOverrideState");
function hydratePersistedOverrideState(rootElement) {
  if (rootElement.hasAttribute("override-state") || !isLocalStoragePersistenceEnabled(rootElement)) {
    return;
  }
  const overrideState = normalizeDesignBuilderOverrideState({
    token: new TokenOverrideLocalStorageStore().load(),
    component: new ComponentOverrideLocalStorageStore().load()
  });
  if (!hasOverrideStateData(overrideState)) {
    return;
  }
  const serialized = serializeOverrideState(overrideState);
  if (serialized) {
    rootElement.setAttribute("override-state", serialized);
  }
}
__name(hydratePersistedOverrideState, "hydratePersistedOverrideState");
function bindStyleguideSaveAdapter(rootElement) {
  if (rootElement.dataset.designBuilderSaveAdapterBound === "true" || !isLocalStoragePersistenceEnabled(rootElement)) {
    return;
  }
  rootElement.dataset.designBuilderSaveAdapterBound = "true";
  rootElement.addEventListener("design-builder:save", (event) => {
    const detail = event.detail;
    const state2 = normalizeDesignBuilderOverrideState(detail?.state);
    new TokenOverrideLocalStorageStore().save(state2.token);
    new ComponentOverrideLocalStorageStore().save(state2.component);
  });
}
__name(bindStyleguideSaveAdapter, "bindStyleguideSaveAdapter");
function normalizeLegacyRootAttributes(rootElement) {
  if (!rootElement.hasAttribute("token-data")) {
    const legacyTokenData = rootElement.getAttribute("data-tokens");
    const legacyTokenLibrary = rootElement.getAttribute("data-token-library");
    const normalizedTokenData = legacyTokenData ?? legacyTokenLibrary;
    if (normalizedTokenData) {
      rootElement.setAttribute("token-data", normalizedTokenData);
    }
  }
  if (!rootElement.hasAttribute("component-data")) {
    const legacyComponentData = rootElement.getAttribute("data-component-data");
    if (legacyComponentData) {
      rootElement.setAttribute("component-data", legacyComponentData);
    }
  }
  if (!rootElement.hasAttribute("presets")) {
    const legacyPresets = rootElement.getAttribute("data-presets");
    if (legacyPresets) {
      rootElement.setAttribute("presets", legacyPresets);
    }
  }
  if (!rootElement.hasAttribute("show-save-button")) {
    const legacyShowSaveButton = rootElement.getAttribute("data-show-save-button");
    if (legacyShowSaveButton) {
      rootElement.setAttribute("show-save-button", legacyShowSaveButton);
    }
  }
  hydratePersistedOverrideState(rootElement);
  bindStyleguideSaveAdapter(rootElement);
}
__name(normalizeLegacyRootAttributes, "normalizeLegacyRootAttributes");
function createRootElementFromLegacyContainer(container) {
  const rootElement = document.createElement("design-builder");
  for (const { name, value } of Array.from(container.attributes)) {
    rootElement.setAttribute(name, value);
  }
  const legacyTokenData = container.getAttribute("data-tokens");
  if (legacyTokenData) {
    rootElement.setAttribute("token-data", legacyTokenData);
  }
  rootElement.innerHTML = container.innerHTML;
  container.replaceWith(rootElement);
  return rootElement;
}
__name(createRootElementFromLegacyContainer, "createRootElementFromLegacyContainer");
function resolveStyleguideDesignBuilderRootElements() {
  const existingRootElements = getExistingRootElements();
  if (existingRootElements.length > 0) {
    for (const existingRootElement of existingRootElements) {
      normalizeLegacyRootAttributes(existingRootElement);
    }
    return existingRootElements;
  }
  const legacyContainers = Array.from(document.querySelectorAll("[data-design-builder]")).filter((container) => container.tagName.toLowerCase() !== "design-builder");
  if (legacyContainers.length > 0) {
    return legacyContainers.map((legacyContainer) => {
      const rootElement = createRootElementFromLegacyContainer(legacyContainer);
      normalizeLegacyRootAttributes(rootElement);
      return rootElement;
    });
  }
  return [];
}
__name(resolveStyleguideDesignBuilderRootElements, "resolveStyleguideDesignBuilderRootElements");
function initializeStyleguideDesignBuilder() {
  registerBuiltInDesignBuilderModeAdapters();
  resolveStyleguideDesignBuilderRootElements();
  registerDesignBuilderCustomElement();
}
__name(initializeStyleguideDesignBuilder, "initializeStyleguideDesignBuilder");
function init() {
  initializeStyleguideDesignBuilder();
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
