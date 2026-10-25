import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

// Model only the DOM boundary the menu uses, including native focus loss when
// replaceChildren removes the focused node. Browser coverage checks this in Chrome.
function mountMenu() {
  let document;
  class Element {
    constructor(tagName = 'div') {
      this.tagName = tagName.toUpperCase();
      this.children = [];
      this.attributes = new Map();
      this.listeners = new Map();
      this.dataset = {};
      this.style = { setProperty() {} };
      this.className = '';
      this.value = '';
      this.text = '';
    }
    get textContent() { return this.text + this.children.map((child) => child.textContent).join(''); }
    set textContent(value) { this.replaceChildren(); this.text = String(value); }
    setAttribute(key, value) { this.attributes.set(key, String(value)); }
    getAttribute(key) { return this.attributes.get(key) ?? null; }
    addEventListener(type, listener) { this.listeners.set(type, listener); }
    append(...nodes) {
      for (const node of nodes) {
        if (node.tagName === '#FRAGMENT') this.append(...node.children);
        else { node.parentElement = this; this.children.push(node); }
      }
    }
    appendChild(node) { this.append(node); return node; }
    contains(node) { return this === node || this.children.some((child) => child.contains(node)); }
    replaceChildren(...nodes) {
      if (this.children.some((child) => child.contains(document?.activeElement))) {
        document.activeElement = document.body;
      }
      for (const child of this.children) child.parentElement = null;
      this.children = [];
      this.text = '';
      this.append(...nodes);
    }
    focus() { if (!this.disabled) document.activeElement = this; }
    select() {}
    click() {
      if (!this.disabled) this.listeners.get('click')?.({ preventDefault() {}, stopPropagation() {} });
    }
    querySelectorAll(selector) {
      const matches = (node) => selector.startsWith('.')
        ? node.className.split(' ').includes(selector.slice(1))
        : node.getAttribute(selector.slice(1, -1)) !== null;
      return this.children.flatMap((child) => [
        ...(matches(child) ? [child] : []), ...child.querySelectorAll(selector),
      ]);
    }
  }
  const nodes = new Map();
  const body = new Element('body');
  document = {
    body, activeElement: body,
    createElement: (tag) => new Element(tag),
    createDocumentFragment: () => new Element('#fragment'),
    getElementById: (id) => nodes.get(id) || null,
    querySelectorAll: (selector) => body.querySelectorAll(selector),
    addEventListener() {},
  };
  const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
  for (const match of html.matchAll(/<([\w-]+)[^>]*\bid="([^"]+)"/g)) {
    const element = new Element(match[1]);
    nodes.set(match[2], element);
    body.appendChild(element);
  }
  const storage = new Map();
  const context = vm.createContext({
    document,
    window: { localStorage: { getItem: (key) => storage.get(key) ?? null, setItem: (key, value) => storage.set(key, value) } },
    console,
  });
  vm.runInContext(readFileSync(new URL('../src/js/index-menu.js', import.meta.url), 'utf8'), context);
  const byClass = (className) => body.querySelectorAll(`.${className}`);
  const activate = (element) => { element.focus(); element.click(); };
  return { document, nodes, byClass, activate };
}

let checks = 0;
{
  const { document, byClass, activate } = mountMenu();
  const category = byClass('menu-chip')[1];
  activate(category);
  const replacement = byClass('menu-chip')[1];
  assert.ok(replacement !== category, 'Fixture must exercise a newly rendered category button');
  assert.equal(replacement.getAttribute('aria-pressed'), 'true');
  assert.ok(document.activeElement === replacement, 'Category activation must retain focus on the current category control');
  checks += 1;
}
{
  const { document, nodes, byClass, activate } = mountMenu();
  const favorite = byClass('menu-card__favorite')[0];
  activate(favorite);
  const replacement = byClass('menu-card__favorite')[0];
  assert.ok(replacement !== favorite);
  assert.equal(replacement.getAttribute('aria-pressed'), 'true');
  assert.ok(document.activeElement === replacement, 'Favoriting must focus the replacement button');
  activate(replacement);
  assert.equal(byClass('menu-card__favorite')[0].getAttribute('aria-pressed'), 'false');
  assert.ok(document.activeElement === byClass('menu-card__favorite')[0]);
  checks += 1;

  activate(byClass('menu-card__favorite')[0]);
  activate(nodes.get('menu-favorites-toggle'));
  assert.equal(byClass('menu-card__favorite').length, 1);
  activate(byClass('menu-card__favorite')[0]);
  assert.equal(byClass('menu-card__favorite').length, 0);
  assert.ok(document.activeElement === nodes.get('menu-favorites-toggle'), 'Removing the last filtered favorite needs a visible focus destination');
  checks += 1;
}
{
  const { document, nodes, byClass, activate } = mountMenu();
  activate(byClass('menu-chip')[1]);
  activate(byClass('menu-clear-filters')[0]);
  assert.ok(document.activeElement === nodes.get('menu-search'), 'Clearing filters must focus the usable search field');
  const search = nodes.get('menu-search');
  search.value = '推箱';
  search.focus();
  search.listeners.get('input')({ target: search });
  assert.ok(document.activeElement === search, 'Rendering search results must retain input focus');
  checks += 1;
}
console.log(JSON.stringify({ ok: true, checks }));
