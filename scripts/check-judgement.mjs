import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";

const source = fs.readFileSync(new URL("../worker/index.js", import.meta.url), "utf8");
const fn = source.slice(source.indexOf("function setCurrentJudgement("), source.indexOf("function setSignal("));
const elements = new Map();
const el = (id) => {
  if (!elements.has(id)) elements.set(id, { className: "", textContent: "", classList: { contains: () => false } });
  return elements.get(id);
};
const context = { el, state: { interval: "5m" }, num: (n) => n.toFixed(4), fullClock: () => "2026/10/21 10:00" };
vm.createContext(context);
vm.runInContext(fn, context);

const rows = Array.from({ length: 8 }, (_, i) => ({
  t: i * 300000, h: 1.02, l: 0.99, c: 1.01, e20: 1, hist: 0.001,
}));
rows[7] = { ...rows[7], c: 1.025 };
const buy = { i: 7, type: "buy", trigger: 1.02, low: 1.012 };
context.setCurrentJudgement(rows, [buy], { lastPrice: 1.021 });
assert.match(el("buy-judgement").textContent, /可观察回踩买入/);

el("stability-state").classList.contains = (name) => name === "unstable";
context.setCurrentJudgement(rows, [buy], { lastPrice: 1.021 });
assert.match(el("buy-judgement").textContent, /暂不适合/);

el("stability-state").classList.contains = () => false;
context.setCurrentJudgement(rows, [{ ...buy, i: 2 }], { lastPrice: 1.021 });
assert.match(el("buy-judgement").textContent, /暂不适合/);

rows[7] = { ...rows[7], c: 0.98, hist: -0.001, e20: 1 };
context.setCurrentJudgement(rows, [{ i: 7, type: "sell" }], { lastPrice: 0.98 });
assert.match(el("sell-judgement").textContent, /考虑减仓或卖出/);
assert.match(el("outlook-text").textContent, /并非确定预测/);
console.log("Current judgement cases passed");
