(function (L, e) {
  typeof exports == "object" && typeof module < "u"
    ? e(exports, require("vue"))
    : typeof define == "function" && define.amd
      ? define(["exports", "vue"], e)
      : ((L = typeof globalThis < "u" ? globalThis : L || self),
        e((L.CruciblePlugin = {}), L.Vue));
})(this, function (L, e) {
  "use strict";
  var ge = !1;
  function K(t, s, o) {
    return Array.isArray(t)
      ? ((t.length = Math.max(t.length, s)), t.splice(s, 1, o), o)
      : ((t[s] = o), o);
  }
  function re(t, s) {
    if (Array.isArray(t)) {
      t.splice(s, 1);
      return;
    }
    delete t[s];
  }
  function ve() {
    return _e().__VUE_DEVTOOLS_GLOBAL_HOOK__;
  }
  function _e() {
    return typeof navigator < "u" && typeof window < "u"
      ? window
      : typeof globalThis < "u"
        ? globalThis
        : {};
  }
  const He = typeof Proxy == "function",
    Ge = "devtools-plugin:setup",
    Je = "plugin:settings:set";
  let z, ae;
  function We() {
    var t;
    return (
      z !== void 0 ||
        (typeof window < "u" && window.performance
          ? ((z = !0), (ae = window.performance))
          : typeof globalThis < "u" &&
              !((t = globalThis.perf_hooks) === null || t === void 0) &&
              t.performance
            ? ((z = !0), (ae = globalThis.perf_hooks.performance))
            : (z = !1)),
      z
    );
  }
  function Ye() {
    return We() ? ae.now() : Date.now();
  }
  class Ke {
    constructor(s, o) {
      (this.target = null),
        (this.targetQueue = []),
        (this.onQueue = []),
        (this.plugin = s),
        (this.hook = o);
      const n = {};
      if (s.settings)
        for (const a in s.settings) {
          const c = s.settings[a];
          n[a] = c.defaultValue;
        }
      const i = `__vue-devtools-plugin-settings__${s.id}`;
      let r = Object.assign({}, n);
      try {
        const a = localStorage.getItem(i),
          c = JSON.parse(a);
        Object.assign(r, c);
      } catch {}
      (this.fallbacks = {
        getSettings() {
          return r;
        },
        setSettings(a) {
          try {
            localStorage.setItem(i, JSON.stringify(a));
          } catch {}
          r = a;
        },
        now() {
          return Ye();
        },
      }),
        o &&
          o.on(Je, (a, c) => {
            a === this.plugin.id && this.fallbacks.setSettings(c);
          }),
        (this.proxiedOn = new Proxy(
          {},
          {
            get: (a, c) =>
              this.target
                ? this.target.on[c]
                : (...l) => {
                    this.onQueue.push({ method: c, args: l });
                  },
          },
        )),
        (this.proxiedTarget = new Proxy(
          {},
          {
            get: (a, c) =>
              this.target
                ? this.target[c]
                : c === "on"
                  ? this.proxiedOn
                  : Object.keys(this.fallbacks).includes(c)
                    ? (...l) => (
                        this.targetQueue.push({
                          method: c,
                          args: l,
                          resolve: () => {},
                        }),
                        this.fallbacks[c](...l)
                      )
                    : (...l) =>
                        new Promise((u) => {
                          this.targetQueue.push({
                            method: c,
                            args: l,
                            resolve: u,
                          });
                        }),
          },
        ));
    }
    async setRealTarget(s) {
      this.target = s;
      for (const o of this.onQueue) this.target.on[o.method](...o.args);
      for (const o of this.targetQueue)
        o.resolve(await this.target[o.method](...o.args));
    }
  }
  function be(t, s) {
    const o = t,
      n = _e(),
      i = ve(),
      r = He && o.enableEarlyProxy;
    if (i && (n.__VUE_DEVTOOLS_PLUGIN_API_AVAILABLE__ || !r)) i.emit(Ge, t, s);
    else {
      const a = r ? new Ke(o, i) : null;
      (n.__VUE_DEVTOOLS_PLUGINS__ = n.__VUE_DEVTOOLS_PLUGINS__ || []).push({
        pluginDescriptor: o,
        setupFn: s,
        proxy: a,
      }),
        a && s(a.proxiedTarget);
    }
  }
  /*!
   * pinia v2.1.7
   * (c) 2023 Eduardo San Martin Morote
   * @license MIT
   */ let U;
  const v = (t) => (U = t),
    ye = process.env.NODE_ENV !== "production" ? Symbol("pinia") : Symbol();
  function x(t) {
    return (
      t &&
      typeof t == "object" &&
      Object.prototype.toString.call(t) === "[object Object]" &&
      typeof t.toJSON != "function"
    );
  }
  var B;
  (function (t) {
    (t.direct = "direct"),
      (t.patchObject = "patch object"),
      (t.patchFunction = "patch function");
  })(B || (B = {}));
  const X = typeof window < "u",
    H =
      (process.env.NODE_ENV !== "production" || !1) &&
      process.env.NODE_ENV !== "test" &&
      X,
    Se =
      typeof window == "object" && window.window === window
        ? window
        : typeof self == "object" && self.self === self
          ? self
          : typeof global == "object" && global.global === global
            ? global
            : typeof globalThis == "object"
              ? globalThis
              : { HTMLElement: null };
  function Xe(t, { autoBom: s = !1 } = {}) {
    return s &&
      /^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(
        t.type,
      )
      ? new Blob(["\uFEFF", t], { type: t.type })
      : t;
  }
  function ce(t, s, o) {
    const n = new XMLHttpRequest();
    n.open("GET", t),
      (n.responseType = "blob"),
      (n.onload = function () {
        Ne(n.response, s, o);
      }),
      (n.onerror = function () {
        console.error("could not download file");
      }),
      n.send();
  }
  function ke(t) {
    const s = new XMLHttpRequest();
    s.open("HEAD", t, !1);
    try {
      s.send();
    } catch {}
    return s.status >= 200 && s.status <= 299;
  }
  function Z(t) {
    try {
      t.dispatchEvent(new MouseEvent("click"));
    } catch {
      const o = document.createEvent("MouseEvents");
      o.initMouseEvent(
        "click",
        !0,
        !0,
        window,
        0,
        0,
        0,
        80,
        20,
        !1,
        !1,
        !1,
        !1,
        0,
        null,
      ),
        t.dispatchEvent(o);
    }
  }
  const ee = typeof navigator == "object" ? navigator : { userAgent: "" },
    Ee =
      /Macintosh/.test(ee.userAgent) &&
      /AppleWebKit/.test(ee.userAgent) &&
      !/Safari/.test(ee.userAgent),
    Ne = X
      ? typeof HTMLAnchorElement < "u" &&
        "download" in HTMLAnchorElement.prototype &&
        !Ee
        ? Ze
        : "msSaveOrOpenBlob" in ee
          ? et
          : tt
      : () => {};
  function Ze(t, s = "download", o) {
    const n = document.createElement("a");
    (n.download = s),
      (n.rel = "noopener"),
      typeof t == "string"
        ? ((n.href = t),
          n.origin !== location.origin
            ? ke(n.href)
              ? ce(t, s, o)
              : ((n.target = "_blank"), Z(n))
            : Z(n))
        : ((n.href = URL.createObjectURL(t)),
          setTimeout(function () {
            URL.revokeObjectURL(n.href);
          }, 4e4),
          setTimeout(function () {
            Z(n);
          }, 0));
  }
  function et(t, s = "download", o) {
    if (typeof t == "string")
      if (ke(t)) ce(t, s, o);
      else {
        const n = document.createElement("a");
        (n.href = t),
          (n.target = "_blank"),
          setTimeout(function () {
            Z(n);
          });
      }
    else navigator.msSaveOrOpenBlob(Xe(t, o), s);
  }
  function tt(t, s, o, n) {
    if (
      ((n = n || open("", "_blank")),
      n && (n.document.title = n.document.body.innerText = "downloading..."),
      typeof t == "string")
    )
      return ce(t, s, o);
    const i = t.type === "application/octet-stream",
      r = /constructor/i.test(String(Se.HTMLElement)) || "safari" in Se,
      a = /CriOS\/[\d]+/.test(navigator.userAgent);
    if ((a || (i && r) || Ee) && typeof FileReader < "u") {
      const c = new FileReader();
      (c.onloadend = function () {
        let l = c.result;
        if (typeof l != "string")
          throw ((n = null), new Error("Wrong reader.result type"));
        (l = a ? l : l.replace(/^data:[^;]*;/, "data:attachment/file;")),
          n ? (n.location.href = l) : location.assign(l),
          (n = null);
      }),
        c.readAsDataURL(t);
    } else {
      const c = URL.createObjectURL(t);
      n ? n.location.assign(c) : (location.href = c),
        (n = null),
        setTimeout(function () {
          URL.revokeObjectURL(c);
        }, 4e4);
    }
  }
  function E(t, s) {
    const o = "🍍 " + t;
    typeof __VUE_DEVTOOLS_TOAST__ == "function"
      ? __VUE_DEVTOOLS_TOAST__(o, s)
      : s === "error"
        ? console.error(o)
        : s === "warn"
          ? console.warn(o)
          : console.log(o);
  }
  function le(t) {
    return "_a" in t && "install" in t;
  }
  function Te() {
    if (!("clipboard" in navigator))
      return E("Your browser doesn't support the Clipboard API", "error"), !0;
  }
  function we(t) {
    return t instanceof Error &&
      t.message.toLowerCase().includes("document is not focused")
      ? (E(
          'You need to activate the "Emulate a focused page" setting in the "Rendering" panel of devtools.',
          "warn",
        ),
        !0)
      : !1;
  }
  async function nt(t) {
    if (!Te())
      try {
        await navigator.clipboard.writeText(JSON.stringify(t.state.value)),
          E("Global state copied to clipboard.");
      } catch (s) {
        if (we(s)) return;
        E(
          "Failed to serialize the state. Check the console for more details.",
          "error",
        ),
          console.error(s);
      }
  }
  async function ot(t) {
    if (!Te())
      try {
        Ce(t, JSON.parse(await navigator.clipboard.readText())),
          E("Global state pasted from clipboard.");
      } catch (s) {
        if (we(s)) return;
        E(
          "Failed to deserialize the state from clipboard. Check the console for more details.",
          "error",
        ),
          console.error(s);
      }
  }
  async function st(t) {
    try {
      Ne(
        new Blob([JSON.stringify(t.state.value)], {
          type: "text/plain;charset=utf-8",
        }),
        "pinia-state.json",
      );
    } catch (s) {
      E(
        "Failed to export the state as JSON. Check the console for more details.",
        "error",
      ),
        console.error(s);
    }
  }
  let P;
  function it() {
    P ||
      ((P = document.createElement("input")),
      (P.type = "file"),
      (P.accept = ".json"));
    function t() {
      return new Promise((s, o) => {
        (P.onchange = async () => {
          const n = P.files;
          if (!n) return s(null);
          const i = n.item(0);
          return s(i ? { text: await i.text(), file: i } : null);
        }),
          (P.oncancel = () => s(null)),
          (P.onerror = o),
          P.click();
      });
    }
    return t;
  }
  async function rt(t) {
    try {
      const o = await it()();
      if (!o) return;
      const { text: n, file: i } = o;
      Ce(t, JSON.parse(n)), E(`Global state imported from "${i.name}".`);
    } catch (s) {
      E(
        "Failed to import the state from JSON. Check the console for more details.",
        "error",
      ),
        console.error(s);
    }
  }
  function Ce(t, s) {
    for (const o in s) {
      const n = t.state.value[o];
      n ? Object.assign(n, s[o]) : (t.state.value[o] = s[o]);
    }
  }
  function $(t) {
    return { _custom: { display: t } };
  }
  const Oe = "🍍 Pinia (root)",
    ue = "_root";
  function at(t) {
    return le(t) ? { id: ue, label: Oe } : { id: t.$id, label: t.$id };
  }
  function ct(t) {
    if (le(t)) {
      const o = Array.from(t._s.keys()),
        n = t._s;
      return {
        state: o.map((r) => ({
          editable: !0,
          key: r,
          value: t.state.value[r],
        })),
        getters: o
          .filter((r) => n.get(r)._getters)
          .map((r) => {
            const a = n.get(r);
            return {
              editable: !1,
              key: r,
              value: a._getters.reduce((c, l) => ((c[l] = a[l]), c), {}),
            };
          }),
      };
    }
    const s = {
      state: Object.keys(t.$state).map((o) => ({
        editable: !0,
        key: o,
        value: t.$state[o],
      })),
    };
    return (
      t._getters &&
        t._getters.length &&
        (s.getters = t._getters.map((o) => ({
          editable: !1,
          key: o,
          value: t[o],
        }))),
      t._customProperties.size &&
        (s.customProperties = Array.from(t._customProperties).map((o) => ({
          editable: !0,
          key: o,
          value: t[o],
        }))),
      s
    );
  }
  function lt(t) {
    return t
      ? Array.isArray(t)
        ? t.reduce(
            (s, o) => (
              s.keys.push(o.key),
              s.operations.push(o.type),
              (s.oldValue[o.key] = o.oldValue),
              (s.newValue[o.key] = o.newValue),
              s
            ),
            { oldValue: {}, keys: [], operations: [], newValue: {} },
          )
        : {
            operation: $(t.type),
            key: $(t.key),
            oldValue: t.oldValue,
            newValue: t.newValue,
          }
      : {};
  }
  function ut(t) {
    switch (t) {
      case B.direct:
        return "mutation";
      case B.patchFunction:
        return "$patch";
      case B.patchObject:
        return "$patch";
      default:
        return "unknown";
    }
  }
  let j = !0;
  const te = [],
    D = "pinia:mutations",
    N = "pinia",
    { assign: dt } = Object,
    ne = (t) => "🍍 " + t;
  function ft(t, s) {
    be(
      {
        id: "dev.esm.pinia",
        label: "Pinia 🍍",
        logo: "https://pinia.vuejs.org/logo.svg",
        packageName: "pinia",
        homepage: "https://pinia.vuejs.org",
        componentStateTypes: te,
        app: t,
      },
      (o) => {
        typeof o.now != "function" &&
          E(
            "You seem to be using an outdated version of Vue Devtools. Are you still using the Beta release instead of the stable one? You can find the links at https://devtools.vuejs.org/guide/installation.html.",
          ),
          o.addTimelineLayer({ id: D, label: "Pinia 🍍", color: 15064968 }),
          o.addInspector({
            id: N,
            label: "Pinia 🍍",
            icon: "storage",
            treeFilterPlaceholder: "Search stores",
            actions: [
              {
                icon: "content_copy",
                action: () => {
                  nt(s);
                },
                tooltip: "Serialize and copy the state",
              },
              {
                icon: "content_paste",
                action: async () => {
                  await ot(s), o.sendInspectorTree(N), o.sendInspectorState(N);
                },
                tooltip: "Replace the state with the content of your clipboard",
              },
              {
                icon: "save",
                action: () => {
                  st(s);
                },
                tooltip: "Save the state as a JSON file",
              },
              {
                icon: "folder_open",
                action: async () => {
                  await rt(s), o.sendInspectorTree(N), o.sendInspectorState(N);
                },
                tooltip: "Import the state from a JSON file",
              },
            ],
            nodeActions: [
              {
                icon: "restore",
                tooltip: 'Reset the state (with "$reset")',
                action: (n) => {
                  const i = s._s.get(n);
                  i
                    ? typeof i.$reset != "function"
                      ? E(
                          `Cannot reset "${n}" store because it doesn't have a "$reset" method implemented.`,
                          "warn",
                        )
                      : (i.$reset(), E(`Store "${n}" reset.`))
                    : E(
                        `Cannot reset "${n}" store because it wasn't found.`,
                        "warn",
                      );
                },
              },
            ],
          }),
          o.on.inspectComponent((n, i) => {
            const r = n.componentInstance && n.componentInstance.proxy;
            if (r && r._pStores) {
              const a = n.componentInstance.proxy._pStores;
              Object.values(a).forEach((c) => {
                n.instanceData.state.push({
                  type: ne(c.$id),
                  key: "state",
                  editable: !0,
                  value: c._isOptionsAPI
                    ? {
                        _custom: {
                          value: e.toRaw(c.$state),
                          actions: [
                            {
                              icon: "restore",
                              tooltip: "Reset the state of this store",
                              action: () => c.$reset(),
                            },
                          ],
                        },
                      }
                    : Object.keys(c.$state).reduce(
                        (l, u) => ((l[u] = c.$state[u]), l),
                        {},
                      ),
                }),
                  c._getters &&
                    c._getters.length &&
                    n.instanceData.state.push({
                      type: ne(c.$id),
                      key: "getters",
                      editable: !1,
                      value: c._getters.reduce((l, u) => {
                        try {
                          l[u] = c[u];
                        } catch (p) {
                          l[u] = p;
                        }
                        return l;
                      }, {}),
                    });
              });
            }
          }),
          o.on.getInspectorTree((n) => {
            if (n.app === t && n.inspectorId === N) {
              let i = [s];
              (i = i.concat(Array.from(s._s.values()))),
                (n.rootNodes = (
                  n.filter
                    ? i.filter((r) =>
                        "$id" in r
                          ? r.$id.toLowerCase().includes(n.filter.toLowerCase())
                          : Oe.toLowerCase().includes(n.filter.toLowerCase()),
                      )
                    : i
                ).map(at));
            }
          }),
          o.on.getInspectorState((n) => {
            if (n.app === t && n.inspectorId === N) {
              const i = n.nodeId === ue ? s : s._s.get(n.nodeId);
              if (!i) return;
              i && (n.state = ct(i));
            }
          }),
          o.on.editInspectorState((n, i) => {
            if (n.app === t && n.inspectorId === N) {
              const r = n.nodeId === ue ? s : s._s.get(n.nodeId);
              if (!r) return E(`store "${n.nodeId}" not found`, "error");
              const { path: a } = n;
              le(r)
                ? a.unshift("state")
                : (a.length !== 1 ||
                    !r._customProperties.has(a[0]) ||
                    a[0] in r.$state) &&
                  a.unshift("$state"),
                (j = !1),
                n.set(r, a, n.state.value),
                (j = !0);
            }
          }),
          o.on.editComponentState((n) => {
            if (n.type.startsWith("🍍")) {
              const i = n.type.replace(/^🍍\s*/, ""),
                r = s._s.get(i);
              if (!r) return E(`store "${i}" not found`, "error");
              const { path: a } = n;
              if (a[0] !== "state")
                return E(`Invalid path for store "${i}":
${a}
Only state can be modified.`);
              (a[0] = "$state"), (j = !1), n.set(r, a, n.state.value), (j = !0);
            }
          });
      },
    );
  }
  function mt(t, s) {
    te.includes(ne(s.$id)) || te.push(ne(s.$id)),
      be(
        {
          id: "dev.esm.pinia",
          label: "Pinia 🍍",
          logo: "https://pinia.vuejs.org/logo.svg",
          packageName: "pinia",
          homepage: "https://pinia.vuejs.org",
          componentStateTypes: te,
          app: t,
          settings: {
            logStoreChanges: {
              label: "Notify about new/deleted stores",
              type: "boolean",
              defaultValue: !0,
            },
          },
        },
        (o) => {
          const n = typeof o.now == "function" ? o.now.bind(o) : Date.now;
          s.$onAction(({ after: a, onError: c, name: l, args: u }) => {
            const p = Qe++;
            o.addTimelineEvent({
              layerId: D,
              event: {
                time: n(),
                title: "🛫 " + l,
                subtitle: "start",
                data: { store: $(s.$id), action: $(l), args: u },
                groupId: p,
              },
            }),
              a((m) => {
                (M = void 0),
                  o.addTimelineEvent({
                    layerId: D,
                    event: {
                      time: n(),
                      title: "🛬 " + l,
                      subtitle: "end",
                      data: {
                        store: $(s.$id),
                        action: $(l),
                        args: u,
                        result: m,
                      },
                      groupId: p,
                    },
                  });
              }),
              c((m) => {
                (M = void 0),
                  o.addTimelineEvent({
                    layerId: D,
                    event: {
                      time: n(),
                      logType: "error",
                      title: "💥 " + l,
                      subtitle: "end",
                      data: {
                        store: $(s.$id),
                        action: $(l),
                        args: u,
                        error: m,
                      },
                      groupId: p,
                    },
                  });
              });
          }, !0),
            s._customProperties.forEach((a) => {
              e.watch(
                () => e.unref(s[a]),
                (c, l) => {
                  o.notifyComponentUpdate(),
                    o.sendInspectorState(N),
                    j &&
                      o.addTimelineEvent({
                        layerId: D,
                        event: {
                          time: n(),
                          title: "Change",
                          subtitle: a,
                          data: { newValue: c, oldValue: l },
                          groupId: M,
                        },
                      });
                },
                { deep: !0 },
              );
            }),
            s.$subscribe(
              ({ events: a, type: c }, l) => {
                if ((o.notifyComponentUpdate(), o.sendInspectorState(N), !j))
                  return;
                const u = {
                  time: n(),
                  title: ut(c),
                  data: dt({ store: $(s.$id) }, lt(a)),
                  groupId: M,
                };
                c === B.patchFunction
                  ? (u.subtitle = "⤵️")
                  : c === B.patchObject
                    ? (u.subtitle = "🧩")
                    : a && !Array.isArray(a) && (u.subtitle = a.type),
                  a &&
                    (u.data["rawEvent(s)"] = {
                      _custom: {
                        display: "DebuggerEvent",
                        type: "object",
                        tooltip: "raw DebuggerEvent[]",
                        value: a,
                      },
                    }),
                  o.addTimelineEvent({ layerId: D, event: u });
              },
              { detached: !0, flush: "sync" },
            );
          const i = s._hotUpdate;
          s._hotUpdate = e.markRaw((a) => {
            i(a),
              o.addTimelineEvent({
                layerId: D,
                event: {
                  time: n(),
                  title: "🔥 " + s.$id,
                  subtitle: "HMR update",
                  data: { store: $(s.$id), info: $("HMR update") },
                },
              }),
              o.notifyComponentUpdate(),
              o.sendInspectorTree(N),
              o.sendInspectorState(N);
          });
          const { $dispose: r } = s;
          (s.$dispose = () => {
            r(),
              o.notifyComponentUpdate(),
              o.sendInspectorTree(N),
              o.sendInspectorState(N),
              o.getSettings().logStoreChanges &&
                E(`Disposed "${s.$id}" store 🗑`);
          }),
            o.notifyComponentUpdate(),
            o.sendInspectorTree(N),
            o.sendInspectorState(N),
            o.getSettings().logStoreChanges &&
              E(`"${s.$id}" store installed 🆕`);
        },
      );
  }
  let Qe = 0,
    M;
  function $e(t, s, o) {
    const n = s.reduce((i, r) => ((i[r] = e.toRaw(t)[r]), i), {});
    for (const i in n)
      t[i] = function () {
        const r = Qe,
          a = o
            ? new Proxy(t, {
                get(...l) {
                  return (M = r), Reflect.get(...l);
                },
                set(...l) {
                  return (M = r), Reflect.set(...l);
                },
              })
            : t;
        M = r;
        const c = n[i].apply(a, arguments);
        return (M = void 0), c;
      };
  }
  function pt({ app: t, store: s, options: o }) {
    if (s.$id.startsWith("__hot:")) return;
    (s._isOptionsAPI = !!o.state),
      $e(s, Object.keys(o.actions), s._isOptionsAPI);
    const n = s._hotUpdate;
    (e.toRaw(s)._hotUpdate = function (i) {
      n.apply(this, arguments),
        $e(s, Object.keys(i._hmrPayload.actions), !!s._isOptionsAPI);
    }),
      mt(t, s);
  }
  function ht() {
    const t = e.effectScope(!0),
      s = t.run(() => e.ref({}));
    let o = [],
      n = [];
    const i = e.markRaw({
      install(r) {
        v(i),
          (i._a = r),
          r.provide(ye, i),
          (r.config.globalProperties.$pinia = i),
          H && ft(r, i),
          n.forEach((a) => o.push(a)),
          (n = []);
      },
      use(r) {
        return !this._a && !ge ? n.push(r) : o.push(r), this;
      },
      _p: o,
      _a: null,
      _e: t,
      _s: new Map(),
      state: s,
    });
    return H && typeof Proxy < "u" && i.use(pt), i;
  }
  function Ve(t, s) {
    for (const o in s) {
      const n = s[o];
      if (!(o in t)) continue;
      const i = t[o];
      x(i) && x(n) && !e.isRef(n) && !e.isReactive(n)
        ? (t[o] = Ve(i, n))
        : (t[o] = n);
    }
    return t;
  }
  const qe = () => {};
  function Be(t, s, o, n = qe) {
    t.push(s);
    const i = () => {
      const r = t.indexOf(s);
      r > -1 && (t.splice(r, 1), n());
    };
    return !o && e.getCurrentScope() && e.onScopeDispose(i), i;
  }
  function R(t, ...s) {
    t.slice().forEach((o) => {
      o(...s);
    });
  }
  const gt = (t) => t();
  function de(t, s) {
    t instanceof Map && s instanceof Map && s.forEach((o, n) => t.set(n, o)),
      t instanceof Set && s instanceof Set && s.forEach(t.add, t);
    for (const o in s) {
      if (!s.hasOwnProperty(o)) continue;
      const n = s[o],
        i = t[o];
      x(i) && x(n) && t.hasOwnProperty(o) && !e.isRef(n) && !e.isReactive(n)
        ? (t[o] = de(i, n))
        : (t[o] = n);
    }
    return t;
  }
  const _t =
    process.env.NODE_ENV !== "production"
      ? Symbol("pinia:skipHydration")
      : Symbol();
  function bt(t) {
    return !x(t) || !t.hasOwnProperty(_t);
  }
  const { assign: w } = Object;
  function Ie(t) {
    return !!(e.isRef(t) && t.effect);
  }
  function Le(t, s, o, n) {
    const { state: i, actions: r, getters: a } = s,
      c = o.state.value[t];
    let l;
    function u() {
      !c &&
        (process.env.NODE_ENV === "production" || !n) &&
        (o.state.value[t] = i ? i() : {});
      const p =
        process.env.NODE_ENV !== "production" && n
          ? e.toRefs(e.ref(i ? i() : {}).value)
          : e.toRefs(o.state.value[t]);
      return w(
        p,
        r,
        Object.keys(a || {}).reduce(
          (m, g) => (
            process.env.NODE_ENV !== "production" &&
              g in p &&
              console.warn(
                `[🍍]: A getter cannot have the same name as another state property. Rename one of them. Found with "${g}" in store "${t}".`,
              ),
            (m[g] = e.markRaw(
              e.computed(() => {
                v(o);
                const _ = o._s.get(t);
                return a[g].call(_, _);
              }),
            )),
            m
          ),
          {},
        ),
      );
    }
    return (l = fe(t, u, s, o, n, !0)), l;
  }
  function fe(t, s, o = {}, n, i, r) {
    let a;
    const c = w({ actions: {} }, o);
    if (process.env.NODE_ENV !== "production" && !n._e.active)
      throw new Error("Pinia destroyed");
    const l = { deep: !0 };
    process.env.NODE_ENV !== "production" &&
      !ge &&
      (l.onTrigger = (f) => {
        u
          ? (_ = f)
          : u == !1 &&
            !h._hotUpdating &&
            (Array.isArray(_)
              ? _.push(f)
              : console.error(
                  "🍍 debuggerEvents should be an array. This is most likely an internal Pinia bug.",
                ));
      });
    let u,
      p,
      m = [],
      g = [],
      _;
    const V = n.state.value[t];
    !r &&
      !V &&
      (process.env.NODE_ENV === "production" || !i) &&
      (n.state.value[t] = {});
    const J = e.ref({});
    let se;
    function ie(f) {
      let d;
      (u = p = !1),
        process.env.NODE_ENV !== "production" && (_ = []),
        typeof f == "function"
          ? (f(n.state.value[t]),
            (d = { type: B.patchFunction, storeId: t, events: _ }))
          : (de(n.state.value[t], f),
            (d = { type: B.patchObject, payload: f, storeId: t, events: _ }));
      const b = (se = Symbol());
      e.nextTick().then(() => {
        se === b && (u = !0);
      }),
        (p = !0),
        R(m, d, n.state.value[t]);
    }
    const y = r
      ? function () {
          const { state: d } = o,
            b = d ? d() : {};
          this.$patch((T) => {
            w(T, b);
          });
        }
      : process.env.NODE_ENV !== "production"
        ? () => {
            throw new Error(
              `🍍: Store "${t}" is built using the setup syntax and does not implement $reset().`,
            );
          }
        : qe;
    function S() {
      a.stop(), (m = []), (g = []), n._s.delete(t);
    }
    function k(f, d) {
      return function () {
        v(n);
        const b = Array.from(arguments),
          T = [],
          W = [];
        function In(Q) {
          T.push(Q);
        }
        function Ln(Q) {
          W.push(Q);
        }
        R(g, { args: b, name: f, store: h, after: In, onError: Ln });
        let Y;
        try {
          Y = d.apply(this && this.$id === t ? this : h, b);
        } catch (Q) {
          throw (R(W, Q), Q);
        }
        return Y instanceof Promise
          ? Y.then((Q) => (R(T, Q), Q)).catch(
              (Q) => (R(W, Q), Promise.reject(Q)),
            )
          : (R(T, Y), Y);
      };
    }
    const q = e.markRaw({ actions: {}, getters: {}, state: [], hotState: J }),
      F = {
        _p: n,
        $id: t,
        $onAction: Be.bind(null, g),
        $patch: ie,
        $reset: y,
        $subscribe(f, d = {}) {
          const b = Be(m, f, d.detached, () => T()),
            T = a.run(() =>
              e.watch(
                () => n.state.value[t],
                (W) => {
                  (d.flush === "sync" ? p : u) &&
                    f({ storeId: t, type: B.direct, events: _ }, W);
                },
                w({}, l, d),
              ),
            );
          return b;
        },
        $dispose: S,
      },
      h = e.reactive(
        process.env.NODE_ENV !== "production" || H
          ? w({ _hmrPayload: q, _customProperties: e.markRaw(new Set()) }, F)
          : F,
      );
    n._s.set(t, h);
    const A = ((n._a && n._a.runWithContext) || gt)(() =>
      n._e.run(() => (a = e.effectScope()).run(s)),
    );
    for (const f in A) {
      const d = A[f];
      if ((e.isRef(d) && !Ie(d)) || e.isReactive(d))
        process.env.NODE_ENV !== "production" && i
          ? K(J.value, f, e.toRef(A, f))
          : r ||
            (V && bt(d) && (e.isRef(d) ? (d.value = V[f]) : de(d, V[f])),
            (n.state.value[t][f] = d)),
          process.env.NODE_ENV !== "production" && q.state.push(f);
      else if (typeof d == "function") {
        const b = process.env.NODE_ENV !== "production" && i ? d : k(f, d);
        (A[f] = b),
          process.env.NODE_ENV !== "production" && (q.actions[f] = d),
          (c.actions[f] = d);
      } else
        process.env.NODE_ENV !== "production" &&
          Ie(d) &&
          ((q.getters[f] = r ? o.getters[f] : d),
          X && (A._getters || (A._getters = e.markRaw([]))).push(f));
    }
    if (
      (w(h, A),
      w(e.toRaw(h), A),
      Object.defineProperty(h, "$state", {
        get: () =>
          process.env.NODE_ENV !== "production" && i
            ? J.value
            : n.state.value[t],
        set: (f) => {
          if (process.env.NODE_ENV !== "production" && i)
            throw new Error("cannot set hotState");
          ie((d) => {
            w(d, f);
          });
        },
      }),
      process.env.NODE_ENV !== "production" &&
        (h._hotUpdate = e.markRaw((f) => {
          (h._hotUpdating = !0),
            f._hmrPayload.state.forEach((d) => {
              if (d in h.$state) {
                const b = f.$state[d],
                  T = h.$state[d];
                typeof b == "object" && x(b) && x(T)
                  ? Ve(b, T)
                  : (f.$state[d] = T);
              }
              K(h, d, e.toRef(f.$state, d));
            }),
            Object.keys(h.$state).forEach((d) => {
              d in f.$state || re(h, d);
            }),
            (u = !1),
            (p = !1),
            (n.state.value[t] = e.toRef(f._hmrPayload, "hotState")),
            (p = !0),
            e.nextTick().then(() => {
              u = !0;
            });
          for (const d in f._hmrPayload.actions) {
            const b = f[d];
            K(h, d, k(d, b));
          }
          for (const d in f._hmrPayload.getters) {
            const b = f._hmrPayload.getters[d],
              T = r ? e.computed(() => (v(n), b.call(h, h))) : b;
            K(h, d, T);
          }
          Object.keys(h._hmrPayload.getters).forEach((d) => {
            d in f._hmrPayload.getters || re(h, d);
          }),
            Object.keys(h._hmrPayload.actions).forEach((d) => {
              d in f._hmrPayload.actions || re(h, d);
            }),
            (h._hmrPayload = f._hmrPayload),
            (h._getters = f._getters),
            (h._hotUpdating = !1);
        })),
      H)
    ) {
      const f = { writable: !0, configurable: !0, enumerable: !1 };
      ["_p", "_hmrPayload", "_getters", "_customProperties"].forEach((d) => {
        Object.defineProperty(h, d, w({ value: h[d] }, f));
      });
    }
    return (
      n._p.forEach((f) => {
        if (H) {
          const d = a.run(() =>
            f({ store: h, app: n._a, pinia: n, options: c }),
          );
          Object.keys(d || {}).forEach((b) => h._customProperties.add(b)),
            w(h, d);
        } else
          w(
            h,
            a.run(() => f({ store: h, app: n._a, pinia: n, options: c })),
          );
      }),
      process.env.NODE_ENV !== "production" &&
        h.$state &&
        typeof h.$state == "object" &&
        typeof h.$state.constructor == "function" &&
        !h.$state.constructor.toString().includes("[native code]") &&
        console.warn(`[🍍]: The "state" must be a plain object. It cannot be
	state: () => new MyClass()
Found in store "${h.$id}".`),
      V && r && o.hydrate && o.hydrate(h.$state, V),
      (u = !0),
      (p = !0),
      h
    );
  }
  function yt(t, s, o) {
    let n, i;
    const r = typeof s == "function";
    (n = t), (i = r ? o : s);
    function a(c, l) {
      const u = e.hasInjectionContext();
      if (
        ((c =
          (process.env.NODE_ENV === "test" && U && U._testing ? null : c) ||
          (u ? e.inject(ye, null) : null)),
        c && v(c),
        process.env.NODE_ENV !== "production" && !U)
      )
        throw new Error(`[🍍]: "getActivePinia()" was called but there was no active Pinia. Are you trying to use a store before calling "app.use(pinia)"?
See https://pinia.vuejs.org/core-concepts/outside-component-usage.html for help.
This will fail in production.`);
      (c = U),
        c._s.has(n) ||
          (r ? fe(n, s, i, c) : Le(n, i, c),
          process.env.NODE_ENV !== "production" && (a._pinia = c));
      const p = c._s.get(n);
      if (process.env.NODE_ENV !== "production" && l) {
        const m = "__hot:" + n,
          g = r ? fe(m, s, i, c, !0) : Le(m, w({}, i), c, !0);
        l._hotUpdate(g), delete c.state.value[m], c._s.delete(m);
      }
      if (process.env.NODE_ENV !== "production" && X) {
        const m = e.getCurrentInstance();
        if (m && m.proxy && !l) {
          const g = m.proxy,
            _ = "_pStores" in g ? g._pStores : (g._pStores = {});
          _[n] = p;
        }
      }
      return p;
    }
    return (a.$id = n), a;
  }
  const St = ["id", "checked"],
    kt = ["for", "innerHTML"],
    Et = e.defineComponent({
      __name: "MCQOption",
      props: {
        optionKey: {},
        checked: { type: Boolean },
        option: {},
        submitted: { type: Boolean },
      },
      emits: ["selectOption"],
      setup(t, { emit: s }) {
        const o = s,
          n = () => o("selectOption");
        return (i, r) => (
          e.openBlock(),
          e.createElementBlock(
            e.Fragment,
            null,
            [
              (e.openBlock(),
              e.createElementBlock(
                "input",
                {
                  id: "option-" + i.optionKey,
                  key: i.optionKey,
                  "test-id": "radio_options",
                  type: "radio",
                  name: "options",
                  checked: i.checked,
                  class: e.normalizeClass(i.submitted && "ignore-hover"),
                },
                null,
                10,
                St,
              )),
              (e.openBlock(),
              e.createElementBlock(
                "label",
                {
                  key: i.optionKey,
                  for: "option-" + i.optionKey,
                  class: e.normalizeClass(
                    i.submitted
                      ? "mcq-option-label ignore-hover"
                      : "mcq-option-label",
                  ),
                  onClick: r[0] || (r[0] = (a) => n()),
                  innerHTML: i.option.optionValue,
                },
                null,
                10,
                kt,
              )),
            ],
            64,
          )
        );
      },
    }),
    C = (t, s) => {
      const o = t.__vccOpts || t;
      for (const [n, i] of s) o[n] = i;
      return o;
    },
    Nt = C(Et, [["__scopeId", "data-v-fdbfedc6"]]),
    Tt = ["disabled"],
    wt = C(
      e.defineComponent({
        __name: "MCQButton",
        props: {
          submitted: { type: Boolean },
          selectedOption: {},
          hideSkip: { type: Boolean },
        },
        emits: ["submitAnswer", "nextQuestion", "skipQuestion"],
        setup(t, { emit: s }) {
          const o = e.ref("skip"),
            n = e.ref("Skip"),
            i = s,
            r = (l, u) => {
              !l && u
                ? a("next", "Next", "submitAnswer")
                : l && u
                  ? a("skip", "Skip", "nextQuestion")
                  : !l && !u && a("skip", "Skip", "skipQuestion");
            },
            a = (l, u, p) => {
              (o.value = l), (n.value = u), i(p);
            },
            c = (l, u) =>
              l && u
                ? { class: "next", text: "Next" }
                : !l && u
                  ? { class: "submit", text: "Submit" }
                  : { class: o.value, text: n.value };
          return (l, u) => (
            e.openBlock(),
            e.createElementBlock("div", null, [
              e.createElementVNode(
                "button",
                {
                  disabled:
                    l.hideSkip &&
                    c(l.submitted, l.selectedOption).class === "skip",
                  class: e.normalizeClass([
                    "mcq-button",
                    c(l.submitted, l.selectedOption).class,
                  ]),
                  onClick:
                    u[0] || (u[0] = (p) => r(l.submitted, l.selectedOption)),
                },
                e.toDisplayString(c(l.submitted, l.selectedOption).text),
                11,
                Tt,
              ),
            ])
          );
        },
      }),
      [["__scopeId", "data-v-847b8dd5"]],
    ),
    Pe = C(
      e.defineComponent({
        __name: "NextButton",
        props: { buttonName: {} },
        emits: ["nextQuestion", "prevQuestion"],
        setup(t, { emit: s }) {
          const { buttonName: o } = t,
            n = s,
            i = () => {
              r(o !== "←" ? "nextQuestion" : "prevQuestion");
            },
            r = (a) => {
              n(a);
            };
          return (a, c) => (
            e.openBlock(),
            e.createElementBlock("div", null, [
              e.createElementVNode(
                "button",
                {
                  class: e.normalizeClass(
                    a.buttonName === "Submit" ? "submit_btn" : "mcq-button",
                  ),
                  onClick: c[0] || (c[0] = (l) => i()),
                },
                e.toDisplayString(a.buttonName),
                3,
              ),
            ])
          );
        },
      }),
      [["__scopeId", "data-v-8be7f61e"]],
    ),
    Ct = (t) => {
      for (let s = t.length - 1; s > 0; s--) {
        const o = Math.floor(Math.random() * (s + 1));
        [t[s], t[o]] = [t[o], t[s]];
      }
      return t;
    },
    Ot = (t, s) => Ct(s).slice(0, t);
  function Me(t) {
    const s = t.reduce(
      (n, i) => (
        Object.keys(i).forEach((r) => {
          typeof r == "string" &&
            r.trim() !== "" &&
            (n[r] || (n[r] = new Set()), n[r].add(i[r]));
        }),
        n
      ),
      {},
    );
    return Object.keys(s).reduce((n, i) => ((n[i] = [...s[i]]), n), {});
  }
  function me(t, s) {
    return t.filter((o) =>
      Object.keys(s).every((n) => !s[n].length || s[n].includes(o.tags[n])),
    );
  }
  function Qt(t, s, o) {
    const n = t[s].question.optionsList;
    for (let i = 0; i < n.length; i++) if (n[i].optionValue === o) return i;
  }
  const Ae = (t, s) =>
      s.findIndex((o) => {
        var n;
        return ((n = o.question._id) == null ? void 0 : n.$oid) === t;
      }),
    I = yt("questionsQueue", {
      state: () => ({
        allQs: [],
        questionsQueue: [],
        questionsStack: [],
        quizStats: [],
        quizMode: "Tutor",
        selectedTags: { course: [] },
        timeLimit: 60,
        AnsweredQuesiton: 0,
      }),
      actions: {
        getAnsweredQuestionsNum() {
          return this.AnsweredQuesiton;
        },
        setAnsweredQuestionsNum() {
          this.AnsweredQuesiton = Math.min(
            this.AnsweredQuesiton + 1,
            this.quizStats.length,
          );
        },
        getquestionnumber() {
          const t = this.allQs;
          return me(t, this.selectedTags).length;
        },
        setselectedTags(t) {
          this.selectedTags = t;
        },
        getselectedtags() {
          return this.selectedTags;
        },
        modifySelectedTags(t, { category: s, topic: o }) {
          this.selectedTags[s] &&
            (this.selectedTags[s] = t
              ? [...this.selectedTags[s], o]
              : this.selectedTags[s].filter((n) => n !== o));
        },
        initialiseQuiz(t, s) {
          (this.questionsQueue = t),
            (this.questionsStack = []),
            (this.quizMode = s),
            (this.quizStats = t.map((o) => ({
              question: o,
              correct: 0,
              skipped: 0,
              attempts: 0,
              selectedValue: "",
            })));
        },
        incrementStat(t, s, o) {
          const n = Ae(t, this.quizStats);
          if (this.quizStats[n]) {
            if (o !== void 0) {
              if ((this.quizStats[n][s]++, o === "-1")) {
                this.quizStats[n].selectedValue = "Reached Time Limit";
                return;
              }
              const i = this.quizStats[n].question.optionsList
                .map((r) => r.optionCorrect)
                .indexOf(!0);
              Number(o) === Number(i)
                ? (this.quizStats[n].correct = 1)
                : (this.quizStats[n].correct = 0);
            }
            this.quizStats[n].selectedValue =
              o !== void 0
                ? this.quizStats[n].question.optionsList[Number(o)].optionValue
                : "";
          }
        },
        pushToHistoryStack(t) {
          this.questionsStack.push(t);
        },
        enqueueQuestion(t) {
          this.questionsQueue.push(t);
        },
        dequeueQuestion() {
          for (; this.questionsQueue.length > 0; ) {
            const t = this.questionsQueue.shift();
            return this.pushToHistoryStack(t), t;
          }
          return this.questionsQueue.shift();
        },
        removeFromLastHistory() {
          if (!(this.questionsStack.length < 1))
            return (
              this.questionsQueue.unshift(this.questionsStack.pop()),
              this.questionsStack[this.questionsStack.length - 1]
            );
        },
        getTimeLimit() {
          return this.timeLimit;
        },
        setTimeLimit(t) {
          this.timeLimit = t;
        },
        getRemainingQuestions() {
          return this.questionsQueue.length;
        },
      },
    }),
    $t = ["innerHTML"],
    Vt = { class: "mcq-list" },
    qt = ["onClick"],
    Bt = { class: "next-prev-question" },
    xe = C(
      e.defineComponent({
        __name: "MCQQuestion",
        props: { _id: {}, statement: {}, optionsList: {} },
        emits: ["nextQuestion", "skipQuestion", "prevQuestion"],
        setup(t, { emit: s }) {
          const o = I(),
            n = e.ref(null),
            i = e.ref(!1),
            r = s,
            a = e.ref(o.getRemainingQuestions()),
            c = () => {
              i.value = !0;
            },
            l = () => {
              (n.value = null), r("nextQuestion");
            },
            u = () => {
              g(), (a.value = o.getRemainingQuestions()), r("nextQuestion");
            },
            p = () => {
              g(), r("skipQuestion");
            },
            m = (y) => o.incrementStat(y.$oid, "attempts", n.value ?? void 0),
            g = () => {
              (i.value = !1), (n.value = null);
            },
            _ = () => {
              (n.value = null), r("prevQuestion");
            },
            V = (y, S) => {
              i.value || (n.value = n.value === S ? null : S), m(y);
            },
            J = (y, S, k) => (o.quizMode === "Timed" ? se(y, S) : ie(S, k));
          function se(y, S) {
            const k = Ae(y.$oid, o.quizStats),
              q = o.quizStats[k].selectedValue,
              F = Qt(o.quizStats, k, q);
            return String(F) === S ? ((n.value = S), "selected") : "";
          }
          function ie(y, S) {
            const k = S[parseInt(y)],
              q = n.value === y;
            return i.value
              ? k.optionCorrect
                ? "correct ignore-hover"
                : q
                  ? "wrong ignore-hover"
                  : "ignore-hover"
              : q
                ? "selected"
                : "";
          }
          return (y, S) => (
            e.openBlock(),
            e.createElementBlock(
              e.Fragment,
              null,
              [
                e.createElementVNode(
                  "div",
                  { class: "mcq-statement", innerHTML: y.statement },
                  null,
                  8,
                  $t,
                ),
                e.createElementVNode("div", Vt, [
                  (e.openBlock(!0),
                  e.createElementBlock(
                    e.Fragment,
                    null,
                    e.renderList(
                      Object.entries(y.optionsList),
                      ([k, q]) => (
                        e.openBlock(),
                        e.createElementBlock(
                          "div",
                          {
                            key: k,
                            class: e.normalizeClass([
                              "mcq-option",
                              J(y._id, k, y.optionsList),
                            ]),
                            onClick: (F) => V(y._id, k),
                          },
                          [
                            e.createVNode(
                              Nt,
                              {
                                "option-key": k,
                                checked: n.value === k,
                                option: q,
                                submitted: i.value,
                                onSelectOption: (F) => V(y._id, k),
                              },
                              null,
                              8,
                              [
                                "option-key",
                                "checked",
                                "option",
                                "submitted",
                                "onSelectOption",
                              ],
                            ),
                          ],
                          10,
                          qt,
                        )
                      ),
                    ),
                    128,
                  )),
                ]),
                e.unref(o).quizMode === "Tutor"
                  ? (e.openBlock(),
                    e.createBlock(
                      wt,
                      {
                        key: 0,
                        submitted: i.value,
                        "selected-option": n.value,
                        "hide-skip": a.value <= 1,
                        onSubmitAnswer: c,
                        onNextQuestion: S[0] || (S[0] = (k) => u()),
                        onSkipQuestion: p,
                      },
                      null,
                      8,
                      ["submitted", "selected-option", "hide-skip"],
                    ))
                  : e.createCommentVNode("", !0),
                e.createElementVNode("div", Bt, [
                  e.unref(o).quizMode === "Timed"
                    ? (e.openBlock(),
                      e.createBlock(
                        Pe,
                        {
                          key: 0,
                          "button-name":
                            e.unref(o).questionsQueue.length >= 1
                              ? "→"
                              : "Submit",
                          onNextQuestion: S[1] || (S[1] = (k) => l()),
                        },
                        null,
                        8,
                        ["button-name"],
                      ))
                    : e.createCommentVNode("", !0),
                  e.unref(o).quizMode === "Timed" &&
                  e.unref(o).questionsStack.length > 1
                    ? (e.openBlock(),
                      e.createBlock(Pe, {
                        key: 1,
                        "button-name": "←",
                        onPrevQuestion: S[2] || (S[2] = (k) => _()),
                      }))
                    : e.createCommentVNode("", !0),
                ]),
              ],
              64,
            )
          );
        },
      }),
      [["__scopeId", "data-v-f5ec9042"]],
    ),
    It = (t) => (
      e.pushScopeId("data-v-4ffecbcd"), (t = t()), e.popScopeId(), t
    ),
    Lt = { class: "report-container" },
    Pt = { class: "mcq-report" },
    Mt = { class: "table-container" },
    At = It(() =>
      e.createElementVNode(
        "thead",
        null,
        [
          e.createElementVNode("tr", null, [
            e.createElementVNode("th", null, "question"),
            e.createElementVNode("th", null, "correct option"),
            e.createElementVNode("th", null, "your answer"),
          ]),
        ],
        -1,
      ),
    ),
    xt = { class: "question-row" },
    Dt = ["href", "innerHTML"],
    zt = { class: "answer-row" },
    jt = ["innerHTML"],
    Rt = { class: "answer-row" },
    Ft = ["innerHTML"],
    Ut = { class: "mcq-result" },
    vt = { class: "score" },
    De = C(
      e.defineComponent({
        __name: "MCQStatus",
        setup(t) {
          const s = I(),
            o = s.quizStats,
            n = s.quizStats.length,
            i = o.filter((a) => a.correct === 1).length,
            r = ((i * 100) / n).toFixed(0);
          return (a, c) => (
            e.openBlock(),
            e.createElementBlock("div", Lt, [
              e.createElementVNode("div", Pt, [
                e.createElementVNode("div", Mt, [
                  e.createElementVNode("table", null, [
                    At,
                    e.createElementVNode("tbody", null, [
                      (e.openBlock(!0),
                      e.createElementBlock(
                        e.Fragment,
                        null,
                        e.renderList(
                          Object.entries(e.unref(o)),
                          ([l, u]) => (
                            e.openBlock(),
                            e.createElementBlock(
                              "tr",
                              { key: l, class: "quiz-statment" },
                              [
                                e.createElementVNode("td", xt, [
                                  e.createElementVNode(
                                    "a",
                                    {
                                      href: u.question.link,
                                      target: "_blank",
                                      innerHTML: u.question.statement,
                                    },
                                    null,
                                    8,
                                    Dt,
                                  ),
                                ]),
                                e.createElementVNode("td", zt, [
                                  (e.openBlock(!0),
                                  e.createElementBlock(
                                    e.Fragment,
                                    null,
                                    e.renderList(
                                      Object.entries(u.question.optionsList),
                                      ([p, m]) => (
                                        e.openBlock(),
                                        e.createElementBlock(
                                          "span",
                                          { key: p },
                                          [
                                            m.optionCorrect
                                              ? (e.openBlock(),
                                                e.createElementBlock(
                                                  "span",
                                                  {
                                                    key: 0,
                                                    innerHTML: m.optionValue,
                                                  },
                                                  null,
                                                  8,
                                                  jt,
                                                ))
                                              : e.createCommentVNode("", !0),
                                          ],
                                        )
                                      ),
                                    ),
                                    128,
                                  )),
                                ]),
                                e.createElementVNode("td", Rt, [
                                  e.createElementVNode(
                                    "span",
                                    {
                                      class: e.normalizeClass(
                                        u.correct === 1
                                          ? "correct-answer"
                                          : "wrong-answer",
                                      ),
                                      innerHTML:
                                        u.correct === 1
                                          ? "<span> ✔</span> "
                                          : "<span> ✘</span> <span>     </span>" +
                                            u.selectedValue,
                                    },
                                    null,
                                    10,
                                    Ft,
                                  ),
                                ]),
                              ],
                            )
                          ),
                        ),
                        128,
                      )),
                    ]),
                  ]),
                ]),
              ]),
              e.createElementVNode("div", null, [
                e.createElementVNode("div", Ut, [
                  e.createElementVNode(
                    "span",
                    vt,
                    "⌛ Result: " +
                      e.toDisplayString(e.unref(i)) +
                      " out of " +
                      e.toDisplayString(e.unref(n)) +
                      " - (" +
                      e.toDisplayString(e.unref(r)) +
                      " %)",
                    1,
                  ),
                ]),
              ]),
            ])
          );
        },
      }),
      [["__scopeId", "data-v-4ffecbcd"]],
    ),
    Ht = { class: "questions-left-header" },
    Gt = C(
      e.defineComponent({
        __name: "MCQQuiz",
        setup(t) {
          const s = e.ref(),
            o = I();
          e.onMounted(() => {
            i();
          });
          const n = () => {
              o.enqueueQuestion(s.value), (s.value = o.dequeueQuestion());
            },
            i = () => {
              o.setAnsweredQuestionsNum(), (s.value = o.dequeueQuestion());
            },
            r = () => window.location.reload();
          return (a, c) => {
            const l = e.resolveComponent("MCQInfoPanel");
            return (
              e.openBlock(),
              e.createElementBlock("main", null, [
                e.createVNode(l),
                e.createElementVNode(
                  "h3",
                  Ht,
                  " Question " +
                    e.toDisplayString(e.unref(o).getAnsweredQuestionsNum()) +
                    " out of " +
                    e.toDisplayString(e.unref(o).quizStats.length),
                  1,
                ),
                s.value
                  ? (e.openBlock(),
                    e.createBlock(
                      xe,
                      {
                        key: 0,
                        statement: s.value.statement,
                        "options-list": s.value.optionsList,
                        _id: s.value._id,
                        onNextQuestion: i,
                        onSkipQuestion: n,
                      },
                      null,
                      8,
                      ["statement", "options-list", "_id"],
                    ))
                  : e.createCommentVNode("", !0),
                s.value
                  ? e.createCommentVNode("", !0)
                  : (e.openBlock(), e.createBlock(De, { key: 1 })),
                s.value
                  ? e.createCommentVNode("", !0)
                  : (e.openBlock(),
                    e.createElementBlock(
                      "button",
                      { key: 2, class: "btn-relocate", onClick: r },
                      " End ",
                    )),
              ])
            );
          };
        },
      }),
      [["__scopeId", "data-v-edc7c7f1"]],
    ),
    Jt = { key: 0, class: "time-left-header" },
    Wt = { class: "questions-left-header" },
    Yt = e.defineComponent({
      __name: "MCQInfoPanel",
      props: { timeLeft: { type: Number, default: 0 } },
      setup(t) {
        const s = I(),
          o = (n) => {
            const i = Math.floor(n / 60),
              r = n % 60;
            return `${i}:${r < 10 ? "0" : ""}${r}`;
          };
        return (n, i) => (
          e.openBlock(),
          e.createElementBlock(
            e.Fragment,
            null,
            [
              t.timeLeft
                ? (e.openBlock(),
                  e.createElementBlock(
                    "h3",
                    Jt,
                    " Time left: " + e.toDisplayString(o(t.timeLeft)),
                    1,
                  ))
                : e.createCommentVNode("", !0),
              e.createElementVNode(
                "h3",
                Wt,
                " Question " +
                  e.toDisplayString(e.unref(s).questionsStack.length) +
                  " out of " +
                  e.toDisplayString(e.unref(s).quizStats.length),
                1,
              ),
            ],
            64,
          )
        );
      },
    }),
    ze = 1e3,
    Kt = "-1",
    Xt = C(
      e.defineComponent({
        __name: "MCQTimedQuiz",
        setup(t) {
          const s = I(),
            o = e.ref();
          let n = null,
            i = null;
          const r = e.ref(s.timeLimit);
          e.onMounted(() => {
            c();
          }),
            e.onBeforeMount(() => {
              u(), p();
            });
          const a = () => {
              o.value = s.removeFromLastHistory() ?? o.value;
            },
            c = () => (o.value = s.dequeueQuestion()),
            l = () => window.location.reload(),
            u = () => {
              n && clearTimeout(n), i && clearInterval(i);
            },
            p = () => {
              r.value = s.timeLimit;
              const g = () => (o.value ? (r.value ? r.value-- : m()) : u());
              (i = window.setInterval(g, ze)),
                (n = window.setTimeout(() => {}, s.timeLimit * ze));
            },
            m = () => {
              var _;
              u();
              const g = (V) => s.incrementStat(V, "attempts", Kt);
              for (
                g(((_ = o.value) == null ? void 0 : _._id.$oid) ?? "");
                (o.value = s.dequeueQuestion());

              )
                g(o.value._id.$oid);
              return alert("Time's up! Quiz has ended."), c();
            };
          return (g, _) => (
            e.openBlock(),
            e.createElementBlock("main", null, [
              e.createVNode(Yt, { "time-left": r.value }, null, 8, [
                "time-left",
              ]),
              o.value
                ? (e.openBlock(),
                  e.createBlock(
                    xe,
                    {
                      key: 0,
                      statement: o.value.statement,
                      "options-list": o.value.optionsList,
                      _id: o.value._id,
                      onNextQuestion: c,
                      onPrevQuestion: a,
                    },
                    null,
                    8,
                    ["statement", "options-list", "_id"],
                  ))
                : e.createCommentVNode("", !0),
              o.value
                ? e.createCommentVNode("", !0)
                : (e.openBlock(), e.createBlock(De, { key: 1 })),
              o.value
                ? e.createCommentVNode("", !0)
                : (e.openBlock(),
                  e.createElementBlock(
                    "button",
                    { key: 2, class: "btn-relocate", onClick: l },
                    " End ",
                  )),
            ])
          );
        },
      }),
      [["__scopeId", "data-v-4fd74e68"]],
    ),
    Zt = ["id", "name", "value", "disabled"],
    en = ["for"],
    tn = { key: 0, class: "question-number" },
    nn = C(
      e.defineComponent({
        __name: "FilterCheckbox",
        props: { category: {}, topics: {} },
        setup(t) {
          const { category: s, topics: o } = t,
            n = I(),
            i = (l) => (s === "course" ? l.toUpperCase() : l),
            r = e.computed(() =>
              Object.entries(o)
                .map(([l, u]) => {
                  const p = c(u, s);
                  return { idx: l, topic: u, num: p };
                })
                .filter(({ topic: l }) => l !== void 0),
            ),
            a = (l) => {
              if (!(l.target instanceof HTMLInputElement))
                return console.error("Trying to click on non-input element");
              const u = l.target.name,
                p = l.target.value;
              n.modifySelectedTags(l.target.checked, { category: u, topic: p });
            },
            c = (l, u) => {
              var _;
              const p = n.getselectedtags();
              if (!p[u] || ((_ = p[u]) != null && _.includes(l))) return null;
              const m = JSON.parse(JSON.stringify(n.getselectedtags()));
              m[u].includes(l) || m[u].push(l);
              const g = n.allQs;
              return me(g, m).length.toString();
            };
          return (l, u) => (
            e.openBlock(),
            e.createElementBlock("ul", null, [
              (e.openBlock(!0),
              e.createElementBlock(
                e.Fragment,
                null,
                e.renderList(
                  r.value,
                  ({ idx: p, num: m, topic: g }) => (
                    e.openBlock(),
                    e.createElementBlock(
                      "li",
                      {
                        key: p,
                        class: e.normalizeClass([
                          "filter-options",
                          { "grey-out": m === "0" },
                        ]),
                      },
                      [
                        e.createElementVNode(
                          "input",
                          {
                            id: `${l.category}-${g}-checkbox`,
                            type: "checkbox",
                            name: l.category,
                            value: g,
                            disabled: m === "0",
                            onChange: u[0] || (u[0] = (_) => a(_)),
                          },
                          null,
                          40,
                          Zt,
                        ),
                        e.createElementVNode(
                          "label",
                          { for: `${l.category}-${g}-checkbox` },
                          [
                            e.createTextVNode(e.toDisplayString(i(g)) + " ", 1),
                            m !== null && m !== "0"
                              ? (e.openBlock(),
                                e.createElementBlock(
                                  "span",
                                  tn,
                                  e.toDisplayString(m),
                                  1,
                                ))
                              : e.createCommentVNode("", !0),
                          ],
                          8,
                          en,
                        ),
                      ],
                      2,
                    )
                  ),
                ),
                128,
              )),
            ])
          );
        },
      }),
      [["__scopeId", "data-v-e575c3ac"]],
    ),
    on = { class: "filter" },
    sn = { class: "category-heading" },
    rn = C(
      e.defineComponent({
        __name: "MCQTagOptions",
        setup(t) {
          const n = I().allQs.map((r) => r.tags),
            i = Me(n);
          return (r, a) => (
            e.openBlock(),
            e.createElementBlock("div", on, [
              (e.openBlock(!0),
              e.createElementBlock(
                e.Fragment,
                null,
                e.renderList(
                  Object.entries(e.unref(i)),
                  ([c, l]) => (
                    e.openBlock(),
                    e.createElementBlock("div", { key: c, class: "category" }, [
                      e.createElementVNode("h2", sn, e.toDisplayString(c), 1),
                      e.createVNode(nn, { category: c, topics: l }, null, 8, [
                        "category",
                        "topics",
                      ]),
                    ])
                  ),
                ),
                128,
              )),
            ])
          );
        },
      }),
      [["__scopeId", "data-v-efaccb2c"]],
    ),
    an = { for: "optionName" },
    cn = ["value"],
    ln = C(
      e.defineComponent({
        __name: "DropDownbox",
        props: { options: {}, optionName: {}, disabled: { type: Boolean } },
        setup(t) {
          const s = I(),
            o = e.ref(0);
          function n(i) {
            const r = i.target;
            r.value &&
              ((o.value = parseFloat(r.value) * 60), s.setTimeLimit(o.value));
          }
          return (i, r) => (
            e.openBlock(),
            e.createElementBlock(
              "div",
              {
                class: e.normalizeClass(
                  i.disabled ? "dropdown input-disabled" : "dropdown",
                ),
              },
              [
                e.createElementVNode(
                  "label",
                  an,
                  e.toDisplayString(i.optionName) + ":   ",
                  1,
                ),
                e.createElementVNode(
                  "select",
                  { id: "optionName", name: "optionName", onChange: n },
                  [
                    (e.openBlock(!0),
                    e.createElementBlock(
                      e.Fragment,
                      null,
                      e.renderList(
                        i.options,
                        (a) => (
                          e.openBlock(),
                          e.createElementBlock(
                            "option",
                            { key: a.value, value: a.value },
                            e.toDisplayString(a.value) +
                              " " +
                              e.toDisplayString(a.unit),
                            9,
                            cn,
                          )
                        ),
                      ),
                      128,
                    )),
                  ],
                  32,
                ),
              ],
              2,
            )
          );
        },
      }),
      [["__scopeId", "data-v-5f3ae97a"]],
    ),
    G = (t) => (e.pushScopeId("data-v-c3d686ea"), (t = t()), e.popScopeId(), t),
    un = { class: "start-page-container" },
    dn = G(() => e.createElementVNode("h1", null, "VetCloud Smart Quiz", -1)),
    fn = { class: "quiz-config-container" },
    mn = { class: "question-config-container" },
    pn = { class: "tag-text" },
    hn = { class: "question-number" },
    gn = { class: "question-amount-container" },
    _n = G(() =>
      e.createElementVNode(
        "label",
        { for: "question-amount" },
        "Select the amount of questions:",
        -1,
      ),
    ),
    bn = ["max"],
    yn = { key: 0, class: "show-max-msg" },
    Sn = G(() =>
      e.createElementVNode("label", { for: "mode-select" }, "Select mode:", -1),
    ),
    kn = [
      G(() => e.createElementVNode("option", { value: "Tutor" }, "Tutor", -1)),
      G(() => e.createElementVNode("option", { value: "Timed" }, "Timed", -1)),
    ],
    En = 3e3,
    Nn = C(
      e.defineComponent({
        __name: "StartPage",
        emits: ["start-quiz"],
        setup(t, { emit: s }) {
          const o = e.ref(1),
            n = e.ref("Tutor"),
            i = e.ref(!1),
            r = e.ref(null),
            a = s,
            c = I();
          e.onMounted(() => {
            e.watchEffect(() => {
              const p = c.getquestionnumber();
              o.value = Math.min(10, p);
            });
          });
          const l = () => {
              a("start-quiz", { questionAmount: o.value, mode: n.value });
            },
            u = () => {
              r.value && clearTimeout(r.value),
                o.value > c.getquestionnumber() &&
                  ((o.value = c.getquestionnumber()),
                  (i.value = !0),
                  (r.value = window.setTimeout(() => {
                    i.value = !1;
                  }, En)));
            };
          return (p, m) => (
            e.openBlock(),
            e.createElementBlock("div", un, [
              dn,
              e.createVNode(rn),
              e.createElementVNode("div", fn, [
                e.createElementVNode("div", mn, [
                  e.createElementVNode("p", pn, [
                    e.createTextVNode(" Maximum possible questions: "),
                    e.createElementVNode(
                      "span",
                      hn,
                      e.toDisplayString(e.unref(c).getquestionnumber()),
                      1,
                    ),
                  ]),
                  e.createElementVNode("div", gn, [
                    _n,
                    e.withDirectives(
                      e.createElementVNode(
                        "input",
                        {
                          id: "question-amount",
                          "onUpdate:modelValue":
                            m[0] || (m[0] = (g) => (o.value = g)),
                          type: "number",
                          placeholder: "Question amount",
                          min: "1",
                          max: e.unref(c).getquestionnumber(),
                          onInput: u,
                        },
                        null,
                        40,
                        bn,
                      ),
                      [[e.vModelText, o.value, void 0, { number: !0 }]],
                    ),
                  ]),
                  i.value
                    ? (e.openBlock(),
                      e.createElementBlock(
                        "p",
                        yn,
                        " Cannot select more than " +
                          e.toDisplayString(e.unref(c).getquestionnumber()) +
                          " questions. ",
                        1,
                      ))
                    : e.createCommentVNode("", !0),
                  e.createElementVNode("div", null, [
                    Sn,
                    e.withDirectives(
                      e.createElementVNode(
                        "select",
                        {
                          id: "mode-select",
                          "onUpdate:modelValue":
                            m[1] || (m[1] = (g) => (n.value = g)),
                        },
                        kn,
                        512,
                      ),
                      [[e.vModelSelect, n.value]],
                    ),
                  ]),
                  e.createVNode(
                    ln,
                    {
                      options: [
                        { value: 1, label: "Time Option 2", unit: "Min." },
                        { value: 1.5, label: "Time Option 1", unit: "Min." },
                      ],
                      "option-name": "Time per Question",
                      class: e.normalizeClass(
                        n.value === "Timed" ? "" : "input-disabled",
                      ),
                      disabled: n.value !== "Timed",
                    },
                    null,
                    8,
                    ["options", "class", "disabled"],
                  ),
                ]),
              ]),
              e.createElementVNode(
                "button",
                { class: "start-button", onClick: l },
                "Start",
              ),
            ])
          );
        },
      }),
      [["__scopeId", "data-v-c3d686ea"]],
    ),
    Tn = (t) => t.trim().toLowerCase().replace("_", " "),
    wn = (t) =>
      t.reduce((s, o) => {
        if (!o.includes(":")) return s;
        let [n, i] = o.split(":");
        return ([n, i] = [n.trim().toLowerCase(), Tn(i)]), (s[n] = i), s;
      }, {}),
    Cn = {
      convertQuestions: (t) =>
        t.map((s) => ({
          _id: { $oid: s._id.$oid },
          statement: s.statement,
          tags: wn(s.tags),
          optionsList: s.optionsList,
          link: s.link,
        })),
    },
    O = {
      isString: (a) => typeof a == "string",
      isObject: (a) => typeof a == "object" && a !== null,
      isBoolean: (a) => typeof a == "boolean",
      isArray: (a, c) => Array.isArray(a) && a.every(c),
      isNumber: (a) => typeof a == "number",
      isFunction: (a) => typeof a == "function",
    };
  function pe(t) {
    const s = t.includes(":") && t.split(":").length === 2,
      o = !t.includes(":") && !t.includes(" ");
    return s || o;
  }
  function je(t, s = !1) {
    return O.isArray(t, O.isString) ? (s ? t.every(pe) : t.some(pe)) : !1;
  }
  function On(t) {
    return (
      O.isObject(t) &&
      O.isString(t.optionValue) &&
      (t.optionCorrect === void 0 || O.isBoolean(t.optionCorrect))
    );
  }
  function Re(t) {
    return (
      O.isObject(t) &&
      O.isObject(t._id) &&
      O.isString(t._id.$oid) &&
      O.isString(t.statement) &&
      je(t.tags) &&
      O.isArray(t.optionsList, On) &&
      O.isString(t.link)
    );
  }
  function Qn(t) {
    return O.isArray(t, Re);
  }
  const oe = {
      isMCQuestion: Re,
      isMCQuestionArray: Qn,
      validateTags: je,
      isTag: pe,
    },
    $n = (t) => {
      try {
        if (!t)
          throw new Error("No question data found. Please Try again later.");
        return Cn.convertQuestions(Vn(t));
      } catch (s) {
        return alert(s), [];
      }
    };
  function Vn(t) {
    oe.isMCQuestionArray(t)
      ? console.info(
          "%cAll questions are valid",
          "color: #00FF00",
          `
Total Questions Validated:`,
          t.length,
        )
      : console.warn(
          "%cWARNING: Some questions contains invalid structure",
          "color: #FF0000",
        );
    const s = { invalidTags: 0, noTags: 0, invalidQs: 0, totalTags: 0 },
      o = t.reduce((n, i) => {
        if (!oe.isMCQuestion(i)) return { ...n, invalidQs: n.invalidQs + 1 };
        let { tags: r } = i;
        if (!r || (Array.isArray(r) && !r.length))
          return { ...n, noTags: n.noTags + 1 };
        const a = n.totalTags + r.length;
        if (!oe.validateTags(r, !0)) {
          const c = r.filter((u) => oe.isTag(u)),
            l = n.invalidTags + r.length - c.length;
          return (r = c), { ...n, invalidTags: l, totalTags: a };
        }
        return { ...n, totalTags: a };
      }, s);
    return qn(o, t.length), t;
  }
  function he(t, s) {
    t && console.warn(s, "color: #FF0000");
  }
  function qn(t, s) {
    const { invalidQs: o, invalidTags: n, noTags: i, totalTags: r } = t;
    he(o, `Invalid Questions Received: %c${o} out of ${s}`),
      he(n, `Filtering out invalid tags: %c${n} out of ${r}`),
      he(i, `Questions with no tags: %c${i}`);
  }
  const Fe = C(
      e.defineComponent({
        __name: "CrucibleComponent",
        setup(t) {
          const s = e.ref(0),
            o = I(),
            n = e.ref(!1),
            i = e.ref([]),
            r = e.inject("$dataLink");
          e.onBeforeMount(() => {
            (i.value = $n(r.data.questions)),
              console.info("All Questions:", i.value),
              (o.allQs = i.value);
            const c = Me(i.value.map((l) => l.tags));
            o.setselectedTags(
              Object.keys(c).reduce((l, u) => ({ ...l, [u]: [] }), {}),
            );
          });
          const a = ({ questionAmount: c, mode: l }) => {
            const u = o.getselectedtags();
            if (!i.value.length)
              return alert(
                "Trouble fetching questions, please try again later",
              );
            const p = me(i.value, u),
              m = Ot(c, p);
            (s.value = m.length),
              o.initialiseQuiz(m, l),
              l === "Timed" && o.setTimeLimit(c * o.timeLimit),
              (n.value = !0);
          };
          return (c, l) =>
            n.value && e.unref(o).quizMode === "Tutor"
              ? (e.openBlock(), e.createBlock(Gt, { key: 0 }))
              : n.value && e.unref(o).quizMode === "Timed"
                ? (e.openBlock(), e.createBlock(Xt, { key: 1 }))
                : (e.openBlock(),
                  e.createBlock(Nn, { key: 2, onStartQuiz: a }));
        },
      }),
      [["__scopeId", "data-v-b0b475ef"]],
    ),
    Ue = {
      data: {
        questions: [
          {
            _id: { $oid: "6625c7c8c8259deb8c3af39e" },
            statement: "",
            tags: [""],
            optionsList: { optionValue: "", optionCorrect: !1 },
            link: "",
          },
        ],
      },
    };
  function Bn(t, s = {}) {
    const o = ht();
    t.use(o),
      t.component("CrucibleComponent", Fe),
      t.provide("$dataLink", s.dataLink || Ue);
  }
  (L.CrucibleComponent = Fe),
    (L.createViewerPlugin = Bn),
    (L.defaultData = Ue),
    Object.defineProperty(L, Symbol.toStringTag, { value: "Module" });
});
