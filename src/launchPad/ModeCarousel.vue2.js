import { defineComponent, ref, computed, reactive, onMounted, nextTick, onBeforeUnmount, openBlock, createElementBlock, createElementVNode, normalizeStyle, toDisplayString, Fragment, renderList, normalizeClass } from "vue";
const _hoisted_1 = { class: "mcb-root" };
const _hoisted_2 = { class: "mcb-container-box" };
const _hoisted_3 = { class: "mcb-current" };
const _hoisted_4 = { class: "mcb-current-info" };
const _hoisted_5 = { class: "mcb-info-wrapper" };
const _hoisted_6 = { class: "mcb-detail" };
const _hoisted_7 = { class: "mcb-nav-wrapper" };
const _hoisted_8 = ["onClick"];
const _hoisted_9 = { class: "mcb-list-wrapper" };
const _hoisted_10 = ["onClick"];
const _hoisted_11 = { class: "mcb-list-item-name" };
const RANGE = 20;
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "ModeCarousel",
  props: {
    items: {},
    bg: {}
  },
  emits: ["pick"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const active = ref(0);
    const animating = ref(false);
    const serial = ref("");
    const title = ref("");
    const desc = ref("");
    const curArt = ref("");
    const leaving = ref(false);
    const stageEl = ref(null);
    const mediaViewEl = ref(null);
    const frontEl = ref(null);
    const thumbRow = ref(null);
    const canvasEl = ref(null);
    const serialEl = ref(null);
    const titleEl = ref(null);
    const descEl = ref(null);
    const current = computed(() => props.items[active.value] || null);
    const artBg = (u) => u ? `url("${u}")` : "none";
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
    async function slideSwap(el, dir, setText) {
      if (!el) return;
      const offset = dir * 50;
      el.style.setProperty("--mcb-dx", offset + "px");
      el.classList.add("mcb-t-out");
      await sleep(230);
      el.classList.remove("mcb-t-out");
      setText();
      await nextTick();
      el.classList.add("mcb-t-in");
      await nextTick();
      el.classList.remove("mcb-t-in");
    }
    async function imageZoom(dir, newBg) {
      const stage = stageEl.value;
      if (!stage) return;
      while (stage.children.length < 2) {
        const d = document.createElement("div");
        d.className = "mcb-stage-img mcb-stage-hidden";
        stage.appendChild(d);
      }
      const oldLayer = stage.children[0];
      const newLayer = stage.children[1];
      const oldOrigin = dir === 1 ? "right bottom" : "left top";
      const newOrigin = dir === 1 ? "left top" : "right bottom";
      newLayer.classList.remove("mcb-stage-hidden");
      newLayer.style.backgroundImage = artBg(newBg);
      oldLayer.style.transformOrigin = oldOrigin;
      newLayer.style.transformOrigin = newOrigin;
      oldLayer.style.transition = "none";
      newLayer.style.transition = "none";
      oldLayer.style.transform = "scale(1)";
      newLayer.style.transform = "scale(0)";
      oldLayer.style.opacity = "1";
      newLayer.style.opacity = "1";
      await nextTick();
      oldLayer.style.transition = "transform .6s cubic-bezier(.6,.05,.3,1)";
      newLayer.style.transition = "transform .6s cubic-bezier(.6,.05,.3,1)";
      oldLayer.style.transform = "scale(0)";
      newLayer.style.transform = "scale(1)";
      await sleep(620);
      oldLayer.remove();
      newLayer.classList.remove("mcb-stage-img-active");
      curArt.value = newBg;
      newLayer.style.transform = "none";
      newLayer.style.transition = "none";
      while (stage.children.length < 2) {
        const d = document.createElement("div");
        d.className = "mcb-stage-img mcb-stage-hidden";
        stage.appendChild(d);
      }
    }
    async function goTo(index, dir) {
      if (animating.value || leaving.value) return;
      const total = props.items.length;
      if (!total) return;
      const next2 = (index + total) % total;
      const item = props.items[next2];
      animating.value = true;
      await Promise.all([slideSwap(serialEl.value, dir, () => serial.value = item.serial), slideSwap(titleEl.value, dir, () => title.value = item.title), slideSwap(descEl.value, dir, () => desc.value = item.desc), imageZoom(dir, item.art)]);
      active.value = next2;
      animating.value = false;
      await nextTick();
      shiftThumbs();
    }
    function shiftThumbs() {
      const row = thumbRow.value;
      if (!row) return;
      const cards = row.children;
      if (!cards.length) return;
      const w = cards[0].offsetWidth || 200;
      const a = active.value;
      const total = cards.length;
      for (let i = 0; i < total; i++) {
        const card = cards[i];
        const span = i - a;
        let x = span * w;
        let op = "1";
        let pe = "auto";
        if (span <= -3) {
          x = -w;
          op = "0";
          pe = "none";
        } else if (span >= 3) {
          x = w * 3;
          op = "0";
          pe = "none";
        }
        card.style.transform = `translateX(${x}px)`;
        card.style.opacity = op;
        card.style.pointerEvents = pe;
      }
    }
    function prev() {
      goTo(active.value - 1, -1);
    }
    function next() {
      goTo(active.value + 1, 1);
    }
    function jump(i) {
      goTo(i, i > active.value ? 1 : -1);
    }
    function pickCurrent() {
      const item = current.value;
      if (!item || leaving.value) return;
      leaving.value = true;
      document.querySelector(".mcb-root")?.classList.add("mcb-leave");
      emit("pick", item.mode);
    }
    function onKey(e) {
      if (e.key === "ArrowLeft") prev();
      else if (e.key === "ArrowRight") next();
      else if (e.key === "Enter") pickCurrent();
    }
    const mouse = reactive({ x: 0.5, y: 0.5 });
    const pos = reactive({ x: 0.5, y: 0.5 });
    const calc = (n) => n * RANGE - RANGE / 2;
    function onMove(e) {
      mouse.x = e.clientX / window.innerWidth;
      mouse.y = e.clientY / window.innerHeight;
    }
    let rafId = 0;
    function parallaxLoop() {
      pos.x += (mouse.x - pos.x) / 10;
      pos.y += (mouse.y - pos.y) / 10;
      const xV = calc(pos.x);
      const yV = calc(pos.y);
      if (mediaViewEl.value) {
        mediaViewEl.value.style.transform = `translate3d(${xV}px, ${yV}px, 0) rotateX(${-yV}deg) rotateY(${xV}deg)`;
      }
      if (frontEl.value) {
        frontEl.value.style.transform = `translate3d(${xV * 7.7}px, ${yV * 3}px, 50px) rotateX(${-yV}deg) rotateY(${xV}deg)`;
      }
      rafId = requestAnimationFrame(parallaxLoop);
    }
    let particles = [];
    let pRaf = 0;
    let pCtx = null;
    function initParticles() {
      const c = canvasEl.value;
      if (!c) return;
      pCtx = c.getContext("2d");
      if (!pCtx) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const resize = () => {
        c.width = c.clientWidth * dpr;
        c.height = c.clientHeight * dpr;
        pCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
      };
      resize();
      window.addEventListener("resize", resize);
      particles = Array.from({ length: 40 }, () => ({
        x: Math.random(),
        y: Math.random(),
        r: 0.5 + Math.random() * 1.3,
        vx: -0.01 + Math.random() * 0.02,
        vy: -5e-3 + Math.random() * 0.01,
        a: 0.1 + Math.random() * 0.32
      }));
      const loop = () => {
        const ctx = pCtx;
        const c2 = canvasEl.value;
        if (ctx && c2) {
          ctx.clearRect(0, 0, c2.clientWidth, c2.clientHeight);
          for (const p of particles) {
            p.x += p.vx;
            p.y += p.vy;
            if (p.x < -0.02) p.x = 1.02;
            if (p.x > 1.02) p.x = -0.02;
            if (p.y < -0.02) p.y = 1.02;
            if (p.y > 1.02) p.y = -0.02;
            ctx.beginPath();
            ctx.arc(p.x * c2.clientWidth, p.y * c2.clientHeight, p.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(232,196,140,${p.a})`;
            ctx.fill();
          }
        }
        pRaf = requestAnimationFrame(loop);
      };
      loop();
    }
    function onWheel(e) {
      if (e.deltaY > 0) next();
      else if (e.deltaY < 0) prev();
    }
    onMounted(async () => {
      if (!props.items.length) return;
      const first = props.items[0];
      serial.value = first.serial;
      title.value = first.title;
      desc.value = first.desc;
      curArt.value = first.art;
      await nextTick();
      imageZoom(1, first.art);
      await nextTick();
      shiftThumbs();
      window.addEventListener("mousemove", onMove);
      window.addEventListener("keydown", onKey);
      document.addEventListener("wheel", onWheel, { passive: true });
      parallaxLoop();
      initParticles();
    });
    onBeforeUnmount(() => {
      cancelAnimationFrame(rafId);
      cancelAnimationFrame(pRaf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("wheel", onWheel);
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1, [
        createElementVNode("canvas", {
          ref_key: "canvasEl",
          ref: canvasEl,
          class: "mcb-particles"
        }, null, 512),
        createElementVNode("div", {
          class: "mcb-bg",
          style: normalizeStyle({ backgroundImage: __props.bg ? artBg(__props.bg) : "none" })
        }, null, 4),
        _cache[2] || (_cache[2] = createElementVNode("div", { class: "mcb-logo" }, [
          createElementVNode("div", { class: "mcb-logo-main" }, "明日方舟"),
          createElementVNode("div", { class: "mcb-logo-sub" }, "DIRECT LINK"),
          createElementVNode("div", { class: "mcb-logo-sub2" }, "A.L.L.")
        ], -1)),
        createElementVNode("div", {
          class: "mcb-arrow mcb-arrow-prev",
          onClick: prev
        }, [..._cache[0] || (_cache[0] = [
          createElementVNode("svg", { viewBox: "0 0 60 60" }, [
            createElementVNode("path", {
              d: "M38 12 L22 30 L38 48",
              fill: "none",
              stroke: "currentColor",
              "stroke-width": "1.8",
              "stroke-linecap": "round",
              "stroke-linejoin": "round"
            })
          ], -1)
        ])]),
        createElementVNode("div", _hoisted_2, [
          createElementVNode("div", {
            ref_key: "mediaViewEl",
            ref: mediaViewEl,
            class: "mcb-media-view"
          }, [
            createElementVNode("div", _hoisted_3, [
              createElementVNode("div", {
                ref_key: "stageEl",
                ref: stageEl,
                class: "mcb-stage-pic",
                onClick: pickCurrent
              }, null, 512),
              createElementVNode("div", {
                ref_key: "frontEl",
                ref: frontEl,
                class: "mcb-user-interactive"
              }, [
                createElementVNode("div", _hoisted_4, [
                  createElementVNode("div", _hoisted_5, [
                    createElementVNode("div", {
                      ref_key: "serialEl",
                      ref: serialEl,
                      class: "mcb-serial"
                    }, toDisplayString(serial.value), 513),
                    createElementVNode("h1", {
                      ref_key: "titleEl",
                      ref: titleEl,
                      class: "mcb-title",
                      onClick: pickCurrent
                    }, toDisplayString(title.value), 513),
                    createElementVNode("div", _hoisted_6, [
                      createElementVNode("p", {
                        ref_key: "descEl",
                        ref: descEl,
                        class: "mcb-desc"
                      }, toDisplayString(desc.value), 513)
                    ])
                  ]),
                  createElementVNode("div", _hoisted_7, [
                    (openBlock(true), createElementBlock(Fragment, null, renderList(__props.items, (it, i) => {
                      return openBlock(), createElementBlock("span", {
                        key: "nav-" + it.mode,
                        class: normalizeClass(["mcb-ind", { on: i === active.value }]),
                        onClick: ($event) => jump(i)
                      }, null, 10, _hoisted_8);
                    }), 128))
                  ])
                ])
              ], 512)
            ]),
            createElementVNode("div", _hoisted_9, [
              createElementVNode("div", {
                ref_key: "thumbRow",
                ref: thumbRow,
                class: "mcb-list"
              }, [
                (openBlock(true), createElementBlock(Fragment, null, renderList(__props.items, (it, i) => {
                  return openBlock(), createElementBlock("div", {
                    key: "th-" + it.mode,
                    class: normalizeClass(["mcb-list-item", { on: i === active.value }]),
                    onClick: ($event) => jump(i)
                  }, [
                    createElementVNode("div", {
                      class: "mcb-list-item-img",
                      style: normalizeStyle({ backgroundImage: artBg(it.thumb || it.art) })
                    }, [
                      createElementVNode("span", _hoisted_11, toDisplayString(it.title), 1)
                    ], 4)
                  ], 10, _hoisted_10);
                }), 128))
              ], 512)
            ])
          ], 512)
        ]),
        createElementVNode("div", {
          class: "mcb-arrow mcb-arrow-next",
          onClick: next
        }, [..._cache[1] || (_cache[1] = [
          createElementVNode("svg", { viewBox: "0 0 60 60" }, [
            createElementVNode("path", {
              d: "M22 12 L38 30 L22 48",
              fill: "none",
              stroke: "currentColor",
              "stroke-width": "1.8",
              "stroke-linecap": "round",
              "stroke-linejoin": "round"
            })
          ], -1)
        ])])
      ]);
    };
  }
});
export {
  _sfc_main as default
};
