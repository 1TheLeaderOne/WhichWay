import { defineComponent as ce, reactive as Le, openBlock as Et, createElementBlock as Rt, createElementVNode as ft, unref as Bt, Fragment as te, renderList as ee, toDisplayString as _t, withDirectives as we, normalizeClass as De, computed as Gt, ref as Vt, watch as Ve, nextTick as Oe, onMounted as Fe, onBeforeUnmount as Ue, normalizeStyle as re, createCommentVNode as Ne, render as ie, createVNode as Be, createApp as We } from "vue";
import { lib as $, get as pt, game as yt, ui as Lt } from "noname";
import { whichWayFile as it } from "./file.js";
import { onSetDev as fe, onContent as de, onInit as Ye, onArenaReady as ne, onConfig as Ot } from "./hooks.js";
import { whichWayAPIOverride as Ut } from "./override.js";
import { whichWayToast as et } from "./toast.js";
import { whichWayUtil as tt } from "./utill.js";
import { w as Zt } from "./arknight-arkidMigration-shared.js";
import { whichWayArknight as jt } from "./arknight.js";
import { _ as ve } from "./_plugin-vue_export-helper.js";
var Q = /* @__PURE__ */ (function() {
  var o = function(e, p) {
    return o = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(a, t) {
      a.__proto__ = t;
    } || function(a, t) {
      for (var i in t) Object.prototype.hasOwnProperty.call(t, i) && (a[i] = t[i]);
    }, o(e, p);
  };
  return function(e, p) {
    if (typeof p != "function" && p !== null)
      throw new TypeError("Class extends value " + String(p) + " is not a constructor or null");
    o(e, p);
    function a() {
      this.constructor = e;
    }
    e.prototype = p === null ? Object.create(p) : (a.prototype = p.prototype, new a());
  };
})(), F;
(function(o) {
  var e = (function() {
    function g(m, x, P) {
      if (m == null)
        throw new Error("name cannot be null.");
      if (x == null)
        throw new Error("timelines cannot be null.");
      this.name = m, this.timelines = x, this.timelineIds = [];
      for (var k = 0; k < x.length; k++)
        this.timelineIds[x[k].getPropertyId()] = !0;
      this.duration = P;
    }
    return g.prototype.hasTimeline = function(m) {
      return this.timelineIds[m] == !0;
    }, g.prototype.apply = function(m, x, P, k, O, R, D, N) {
      if (m == null)
        throw new Error("skeleton cannot be null.");
      k && this.duration != 0 && (P %= this.duration, x > 0 && (x %= this.duration));
      for (var I = this.timelines, y = 0, T = I.length; y < T; y++)
        I[y].apply(m, x, P, O, R, D, N);
    }, g.binarySearch = function(m, x, P) {
      P === void 0 && (P = 1);
      var k = 0, O = m.length / P - 2;
      if (O == 0)
        return P;
      for (var R = O >>> 1; ; ) {
        if (m[(R + 1) * P] <= x ? k = R + 1 : O = R, k == O)
          return (k + 1) * P;
        R = k + O >>> 1;
      }
    }, g.linearSearch = function(m, x, P) {
      for (var k = 0, O = m.length - P; k <= O; k += P)
        if (m[k] > x)
          return k;
      return -1;
    }, g;
  })();
  o.Animation = e;
  var p;
  (function(g) {
    g[g.setup = 0] = "setup", g[g.first = 1] = "first", g[g.replace = 2] = "replace", g[g.add = 3] = "add";
  })(p = o.MixBlend || (o.MixBlend = {}));
  var a;
  (function(g) {
    g[g.mixIn = 0] = "mixIn", g[g.mixOut = 1] = "mixOut";
  })(a = o.MixDirection || (o.MixDirection = {}));
  var t;
  (function(g) {
    g[g.rotate = 0] = "rotate", g[g.translate = 1] = "translate", g[g.scale = 2] = "scale", g[g.shear = 3] = "shear", g[g.attachment = 4] = "attachment", g[g.color = 5] = "color", g[g.deform = 6] = "deform", g[g.event = 7] = "event", g[g.drawOrder = 8] = "drawOrder", g[g.ikConstraint = 9] = "ikConstraint", g[g.transformConstraint = 10] = "transformConstraint", g[g.pathConstraintPosition = 11] = "pathConstraintPosition", g[g.pathConstraintSpacing = 12] = "pathConstraintSpacing", g[g.pathConstraintMix = 13] = "pathConstraintMix", g[g.twoColor = 14] = "twoColor";
  })(t = o.TimelineType || (o.TimelineType = {}));
  var i = (function() {
    function g(m) {
      if (m <= 0)
        throw new Error("frameCount must be > 0: " + m);
      this.curves = o.Utils.newFloatArray((m - 1) * g.BEZIER_SIZE);
    }
    return g.prototype.getFrameCount = function() {
      return this.curves.length / g.BEZIER_SIZE + 1;
    }, g.prototype.setLinear = function(m) {
      this.curves[m * g.BEZIER_SIZE] = g.LINEAR;
    }, g.prototype.setStepped = function(m) {
      this.curves[m * g.BEZIER_SIZE] = g.STEPPED;
    }, g.prototype.getCurveType = function(m) {
      var x = m * g.BEZIER_SIZE;
      if (x == this.curves.length)
        return g.LINEAR;
      var P = this.curves[x];
      return P == g.LINEAR ? g.LINEAR : P == g.STEPPED ? g.STEPPED : g.BEZIER;
    }, g.prototype.setCurve = function(m, x, P, k, O) {
      var R = (-x * 2 + k) * 0.03, D = (-P * 2 + O) * 0.03, N = ((x - k) * 3 + 1) * 6e-3, I = ((P - O) * 3 + 1) * 6e-3, y = R * 2 + N, T = D * 2 + I, B = x * 0.3 + R + N * 0.16666667, V = P * 0.3 + D + I * 0.16666667, G = m * g.BEZIER_SIZE, Y = this.curves;
      Y[G++] = g.BEZIER;
      for (var _ = B, X = V, W = G + g.BEZIER_SIZE - 1; G < W; G += 2)
        Y[G] = _, Y[G + 1] = X, B += y, V += T, y += N, T += I, _ += B, X += V;
    }, g.prototype.getCurvePercent = function(m, x) {
      x = o.MathUtils.clamp(x, 0, 1);
      var P = this.curves, k = m * g.BEZIER_SIZE, O = P[k];
      if (O == g.LINEAR)
        return x;
      if (O == g.STEPPED)
        return 0;
      k++;
      for (var R = 0, D = k, N = k + g.BEZIER_SIZE - 1; k < N; k += 2)
        if (R = P[k], R >= x) {
          var I = void 0, y = void 0;
          return k == D ? (I = 0, y = 0) : (I = P[k - 2], y = P[k - 1]), y + (P[k + 1] - y) * (x - I) / (R - I);
        }
      var T = P[k - 1];
      return T + (1 - T) * (x - R) / (1 - R);
    }, g.LINEAR = 0, g.STEPPED = 1, g.BEZIER = 2, g.BEZIER_SIZE = 19, g;
  })();
  o.CurveTimeline = i;
  var r = (function(g) {
    Q(m, g);
    function m(x) {
      var P = g.call(this, x) || this;
      return P.frames = o.Utils.newFloatArray(x << 1), P;
    }
    return m.prototype.getPropertyId = function() {
      return (t.rotate << 24) + this.boneIndex;
    }, m.prototype.setFrame = function(x, P, k) {
      x <<= 1, this.frames[x] = P, this.frames[x + m.ROTATION] = k;
    }, m.prototype.apply = function(x, P, k, O, R, D, N) {
      var I = this.frames, y = x.bones[this.boneIndex];
      if (y.active) {
        if (k < I[0]) {
          switch (D) {
            case p.setup:
              y.rotation = y.data.rotation;
              return;
            case p.first:
              var T = y.data.rotation - y.rotation;
              y.rotation += (T - (16384 - (16384.499999999996 - T / 360 | 0)) * 360) * R;
          }
          return;
        }
        if (k >= I[I.length - m.ENTRIES]) {
          var B = I[I.length + m.PREV_ROTATION];
          switch (D) {
            case p.setup:
              y.rotation = y.data.rotation + B * R;
              break;
            case p.first:
            case p.replace:
              B += y.data.rotation - y.rotation, B -= (16384 - (16384.499999999996 - B / 360 | 0)) * 360;
            case p.add:
              y.rotation += B * R;
          }
          return;
        }
        var V = e.binarySearch(I, k, m.ENTRIES), G = I[V + m.PREV_ROTATION], Y = I[V], _ = this.getCurvePercent((V >> 1) - 1, 1 - (k - Y) / (I[V + m.PREV_TIME] - Y)), X = I[V + m.ROTATION] - G;
        switch (X = G + (X - (16384 - (16384.499999999996 - X / 360 | 0)) * 360) * _, D) {
          case p.setup:
            y.rotation = y.data.rotation + (X - (16384 - (16384.499999999996 - X / 360 | 0)) * 360) * R;
            break;
          case p.first:
          case p.replace:
            X += y.data.rotation - y.rotation;
          case p.add:
            y.rotation += (X - (16384 - (16384.499999999996 - X / 360 | 0)) * 360) * R;
        }
      }
    }, m.ENTRIES = 2, m.PREV_TIME = -2, m.PREV_ROTATION = -1, m.ROTATION = 1, m;
  })(i);
  o.RotateTimeline = r;
  var n = (function(g) {
    Q(m, g);
    function m(x) {
      var P = g.call(this, x) || this;
      return P.frames = o.Utils.newFloatArray(x * m.ENTRIES), P;
    }
    return m.prototype.getPropertyId = function() {
      return (t.translate << 24) + this.boneIndex;
    }, m.prototype.setFrame = function(x, P, k, O) {
      x *= m.ENTRIES, this.frames[x] = P, this.frames[x + m.X] = k, this.frames[x + m.Y] = O;
    }, m.prototype.apply = function(x, P, k, O, R, D, N) {
      var I = this.frames, y = x.bones[this.boneIndex];
      if (y.active) {
        if (k < I[0]) {
          switch (D) {
            case p.setup:
              y.x = y.data.x, y.y = y.data.y;
              return;
            case p.first:
              y.x += (y.data.x - y.x) * R, y.y += (y.data.y - y.y) * R;
          }
          return;
        }
        var T = 0, B = 0;
        if (k >= I[I.length - m.ENTRIES])
          T = I[I.length + m.PREV_X], B = I[I.length + m.PREV_Y];
        else {
          var V = e.binarySearch(I, k, m.ENTRIES);
          T = I[V + m.PREV_X], B = I[V + m.PREV_Y];
          var G = I[V], Y = this.getCurvePercent(V / m.ENTRIES - 1, 1 - (k - G) / (I[V + m.PREV_TIME] - G));
          T += (I[V + m.X] - T) * Y, B += (I[V + m.Y] - B) * Y;
        }
        switch (D) {
          case p.setup:
            y.x = y.data.x + T * R, y.y = y.data.y + B * R;
            break;
          case p.first:
          case p.replace:
            y.x += (y.data.x + T - y.x) * R, y.y += (y.data.y + B - y.y) * R;
            break;
          case p.add:
            y.x += T * R, y.y += B * R;
        }
      }
    }, m.ENTRIES = 3, m.PREV_TIME = -3, m.PREV_X = -2, m.PREV_Y = -1, m.X = 1, m.Y = 2, m;
  })(i);
  o.TranslateTimeline = n;
  var f = (function(g) {
    Q(m, g);
    function m(x) {
      return g.call(this, x) || this;
    }
    return m.prototype.getPropertyId = function() {
      return (t.scale << 24) + this.boneIndex;
    }, m.prototype.apply = function(x, P, k, O, R, D, N) {
      var I = this.frames, y = x.bones[this.boneIndex];
      if (y.active) {
        if (k < I[0]) {
          switch (D) {
            case p.setup:
              y.scaleX = y.data.scaleX, y.scaleY = y.data.scaleY;
              return;
            case p.first:
              y.scaleX += (y.data.scaleX - y.scaleX) * R, y.scaleY += (y.data.scaleY - y.scaleY) * R;
          }
          return;
        }
        var T = 0, B = 0;
        if (k >= I[I.length - m.ENTRIES])
          T = I[I.length + m.PREV_X] * y.data.scaleX, B = I[I.length + m.PREV_Y] * y.data.scaleY;
        else {
          var V = e.binarySearch(I, k, m.ENTRIES);
          T = I[V + m.PREV_X], B = I[V + m.PREV_Y];
          var G = I[V], Y = this.getCurvePercent(V / m.ENTRIES - 1, 1 - (k - G) / (I[V + m.PREV_TIME] - G));
          T = (T + (I[V + m.X] - T) * Y) * y.data.scaleX, B = (B + (I[V + m.Y] - B) * Y) * y.data.scaleY;
        }
        if (R == 1)
          D == p.add ? (y.scaleX += T - y.data.scaleX, y.scaleY += B - y.data.scaleY) : (y.scaleX = T, y.scaleY = B);
        else {
          var _ = 0, X = 0;
          if (N == a.mixOut)
            switch (D) {
              case p.setup:
                _ = y.data.scaleX, X = y.data.scaleY, y.scaleX = _ + (Math.abs(T) * o.MathUtils.signum(_) - _) * R, y.scaleY = X + (Math.abs(B) * o.MathUtils.signum(X) - X) * R;
                break;
              case p.first:
              case p.replace:
                _ = y.scaleX, X = y.scaleY, y.scaleX = _ + (Math.abs(T) * o.MathUtils.signum(_) - _) * R, y.scaleY = X + (Math.abs(B) * o.MathUtils.signum(X) - X) * R;
                break;
              case p.add:
                _ = y.scaleX, X = y.scaleY, y.scaleX = _ + (Math.abs(T) * o.MathUtils.signum(_) - y.data.scaleX) * R, y.scaleY = X + (Math.abs(B) * o.MathUtils.signum(X) - y.data.scaleY) * R;
            }
          else
            switch (D) {
              case p.setup:
                _ = Math.abs(y.data.scaleX) * o.MathUtils.signum(T), X = Math.abs(y.data.scaleY) * o.MathUtils.signum(B), y.scaleX = _ + (T - _) * R, y.scaleY = X + (B - X) * R;
                break;
              case p.first:
              case p.replace:
                _ = Math.abs(y.scaleX) * o.MathUtils.signum(T), X = Math.abs(y.scaleY) * o.MathUtils.signum(B), y.scaleX = _ + (T - _) * R, y.scaleY = X + (B - X) * R;
                break;
              case p.add:
                _ = o.MathUtils.signum(T), X = o.MathUtils.signum(B), y.scaleX = Math.abs(y.scaleX) * _ + (T - Math.abs(y.data.scaleX) * _) * R, y.scaleY = Math.abs(y.scaleY) * X + (B - Math.abs(y.data.scaleY) * X) * R;
            }
        }
      }
    }, m;
  })(n);
  o.ScaleTimeline = f;
  var l = (function(g) {
    Q(m, g);
    function m(x) {
      return g.call(this, x) || this;
    }
    return m.prototype.getPropertyId = function() {
      return (t.shear << 24) + this.boneIndex;
    }, m.prototype.apply = function(x, P, k, O, R, D, N) {
      var I = this.frames, y = x.bones[this.boneIndex];
      if (y.active) {
        if (k < I[0]) {
          switch (D) {
            case p.setup:
              y.shearX = y.data.shearX, y.shearY = y.data.shearY;
              return;
            case p.first:
              y.shearX += (y.data.shearX - y.shearX) * R, y.shearY += (y.data.shearY - y.shearY) * R;
          }
          return;
        }
        var T = 0, B = 0;
        if (k >= I[I.length - m.ENTRIES])
          T = I[I.length + m.PREV_X], B = I[I.length + m.PREV_Y];
        else {
          var V = e.binarySearch(I, k, m.ENTRIES);
          T = I[V + m.PREV_X], B = I[V + m.PREV_Y];
          var G = I[V], Y = this.getCurvePercent(V / m.ENTRIES - 1, 1 - (k - G) / (I[V + m.PREV_TIME] - G));
          T = T + (I[V + m.X] - T) * Y, B = B + (I[V + m.Y] - B) * Y;
        }
        switch (D) {
          case p.setup:
            y.shearX = y.data.shearX + T * R, y.shearY = y.data.shearY + B * R;
            break;
          case p.first:
          case p.replace:
            y.shearX += (y.data.shearX + T - y.shearX) * R, y.shearY += (y.data.shearY + B - y.shearY) * R;
            break;
          case p.add:
            y.shearX += T * R, y.shearY += B * R;
        }
      }
    }, m;
  })(n);
  o.ShearTimeline = l;
  var v = (function(g) {
    Q(m, g);
    function m(x) {
      var P = g.call(this, x) || this;
      return P.frames = o.Utils.newFloatArray(x * m.ENTRIES), P;
    }
    return m.prototype.getPropertyId = function() {
      return (t.color << 24) + this.slotIndex;
    }, m.prototype.setFrame = function(x, P, k, O, R, D) {
      x *= m.ENTRIES, this.frames[x] = P, this.frames[x + m.R] = k, this.frames[x + m.G] = O, this.frames[x + m.B] = R, this.frames[x + m.A] = D;
    }, m.prototype.apply = function(x, P, k, O, R, D, N) {
      var I = x.slots[this.slotIndex];
      if (I.bone.active) {
        var y = this.frames;
        if (k < y[0]) {
          switch (D) {
            case p.setup:
              I.color.setFromColor(I.data.color);
              return;
            case p.first:
              var T = I.color, B = I.data.color;
              T.add((B.r - T.r) * R, (B.g - T.g) * R, (B.b - T.b) * R, (B.a - T.a) * R);
          }
          return;
        }
        var V = 0, G = 0, Y = 0, _ = 0;
        if (k >= y[y.length - m.ENTRIES]) {
          var X = y.length;
          V = y[X + m.PREV_R], G = y[X + m.PREV_G], Y = y[X + m.PREV_B], _ = y[X + m.PREV_A];
        } else {
          var W = e.binarySearch(y, k, m.ENTRIES);
          V = y[W + m.PREV_R], G = y[W + m.PREV_G], Y = y[W + m.PREV_B], _ = y[W + m.PREV_A];
          var U = y[W], w = this.getCurvePercent(W / m.ENTRIES - 1, 1 - (k - U) / (y[W + m.PREV_TIME] - U));
          V += (y[W + m.R] - V) * w, G += (y[W + m.G] - G) * w, Y += (y[W + m.B] - Y) * w, _ += (y[W + m.A] - _) * w;
        }
        if (R == 1)
          I.color.set(V, G, Y, _);
        else {
          var T = I.color;
          D == p.setup && T.setFromColor(I.data.color), T.add((V - T.r) * R, (G - T.g) * R, (Y - T.b) * R, (_ - T.a) * R);
        }
      }
    }, m.ENTRIES = 5, m.PREV_TIME = -5, m.PREV_R = -4, m.PREV_G = -3, m.PREV_B = -2, m.PREV_A = -1, m.R = 1, m.G = 2, m.B = 3, m.A = 4, m;
  })(i);
  o.ColorTimeline = v;
  var c = (function(g) {
    Q(m, g);
    function m(x) {
      var P = g.call(this, x) || this;
      return P.frames = o.Utils.newFloatArray(x * m.ENTRIES), P;
    }
    return m.prototype.getPropertyId = function() {
      return (t.twoColor << 24) + this.slotIndex;
    }, m.prototype.setFrame = function(x, P, k, O, R, D, N, I, y) {
      x *= m.ENTRIES, this.frames[x] = P, this.frames[x + m.R] = k, this.frames[x + m.G] = O, this.frames[x + m.B] = R, this.frames[x + m.A] = D, this.frames[x + m.R2] = N, this.frames[x + m.G2] = I, this.frames[x + m.B2] = y;
    }, m.prototype.apply = function(x, P, k, O, R, D, N) {
      var I = x.slots[this.slotIndex];
      if (I.bone.active) {
        var y = this.frames;
        if (k < y[0]) {
          switch (D) {
            case p.setup:
              I.color.setFromColor(I.data.color), I.darkColor.setFromColor(I.data.darkColor);
              return;
            case p.first:
              var T = I.color, B = I.darkColor, V = I.data.color, G = I.data.darkColor;
              T.add((V.r - T.r) * R, (V.g - T.g) * R, (V.b - T.b) * R, (V.a - T.a) * R), B.add((G.r - B.r) * R, (G.g - B.g) * R, (G.b - B.b) * R, 0);
          }
          return;
        }
        var Y = 0, _ = 0, X = 0, W = 0, U = 0, w = 0, Z = 0;
        if (k >= y[y.length - m.ENTRIES]) {
          var z = y.length;
          Y = y[z + m.PREV_R], _ = y[z + m.PREV_G], X = y[z + m.PREV_B], W = y[z + m.PREV_A], U = y[z + m.PREV_R2], w = y[z + m.PREV_G2], Z = y[z + m.PREV_B2];
        } else {
          var j = e.binarySearch(y, k, m.ENTRIES);
          Y = y[j + m.PREV_R], _ = y[j + m.PREV_G], X = y[j + m.PREV_B], W = y[j + m.PREV_A], U = y[j + m.PREV_R2], w = y[j + m.PREV_G2], Z = y[j + m.PREV_B2];
          var H = y[j], q = this.getCurvePercent(j / m.ENTRIES - 1, 1 - (k - H) / (y[j + m.PREV_TIME] - H));
          Y += (y[j + m.R] - Y) * q, _ += (y[j + m.G] - _) * q, X += (y[j + m.B] - X) * q, W += (y[j + m.A] - W) * q, U += (y[j + m.R2] - U) * q, w += (y[j + m.G2] - w) * q, Z += (y[j + m.B2] - Z) * q;
        }
        if (R == 1)
          I.color.set(Y, _, X, W), I.darkColor.set(U, w, Z, 1);
        else {
          var T = I.color, B = I.darkColor;
          D == p.setup && (T.setFromColor(I.data.color), B.setFromColor(I.data.darkColor)), T.add((Y - T.r) * R, (_ - T.g) * R, (X - T.b) * R, (W - T.a) * R), B.add((U - B.r) * R, (w - B.g) * R, (Z - B.b) * R, 0);
        }
      }
    }, m.ENTRIES = 8, m.PREV_TIME = -8, m.PREV_R = -7, m.PREV_G = -6, m.PREV_B = -5, m.PREV_A = -4, m.PREV_R2 = -3, m.PREV_G2 = -2, m.PREV_B2 = -1, m.R = 1, m.G = 2, m.B = 3, m.A = 4, m.R2 = 5, m.G2 = 6, m.B2 = 7, m;
  })(i);
  o.TwoColorTimeline = c;
  var s = (function() {
    function g(m) {
      this.frames = o.Utils.newFloatArray(m), this.attachmentNames = new Array(m);
    }
    return g.prototype.getPropertyId = function() {
      return (t.attachment << 24) + this.slotIndex;
    }, g.prototype.getFrameCount = function() {
      return this.frames.length;
    }, g.prototype.setFrame = function(m, x, P) {
      this.frames[m] = x, this.attachmentNames[m] = P;
    }, g.prototype.apply = function(m, x, P, k, O, R, D) {
      var N = m.slots[this.slotIndex];
      if (N.bone.active) {
        if (D == a.mixOut) {
          R == p.setup && this.setAttachment(m, N, N.data.attachmentName);
          return;
        }
        var I = this.frames;
        if (P < I[0]) {
          (R == p.setup || R == p.first) && this.setAttachment(m, N, N.data.attachmentName);
          return;
        }
        var y = 0;
        P >= I[I.length - 1] ? y = I.length - 1 : y = e.binarySearch(I, P, 1) - 1;
        var T = this.attachmentNames[y];
        m.slots[this.slotIndex].setAttachment(T == null ? null : m.getAttachment(this.slotIndex, T));
      }
    }, g.prototype.setAttachment = function(m, x, P) {
      x.setAttachment(P == null ? null : m.getAttachment(this.slotIndex, P));
    }, g;
  })();
  o.AttachmentTimeline = s;
  var h = null, d = (function(g) {
    Q(m, g);
    function m(x) {
      var P = g.call(this, x) || this;
      return P.frames = o.Utils.newFloatArray(x), P.frameVertices = new Array(x), h == null && (h = o.Utils.newFloatArray(64)), P;
    }
    return m.prototype.getPropertyId = function() {
      return (t.deform << 27) + +this.attachment.id + this.slotIndex;
    }, m.prototype.setFrame = function(x, P, k) {
      this.frames[x] = P, this.frameVertices[x] = k;
    }, m.prototype.apply = function(x, P, k, O, R, D, N) {
      var I = x.slots[this.slotIndex];
      if (I.bone.active) {
        var y = I.getAttachment();
        if (!(!(y instanceof o.VertexAttachment) || y.deformAttachment != this.attachment)) {
          var T = I.deform;
          T.length == 0 && (D = p.setup);
          var B = this.frameVertices, V = B[0].length, G = this.frames;
          if (k < G[0]) {
            var Y = y;
            switch (D) {
              case p.setup:
                T.length = 0;
                return;
              case p.first:
                if (R == 1) {
                  T.length = 0;
                  break;
                }
                var _ = o.Utils.setArraySize(T, V);
                if (Y.bones == null)
                  for (var X = Y.vertices, W = 0; W < V; W++)
                    _[W] += (X[W] - _[W]) * R;
                else {
                  R = 1 - R;
                  for (var W = 0; W < V; W++)
                    _[W] *= R;
                }
            }
            return;
          }
          var U = o.Utils.setArraySize(T, V);
          if (k >= G[G.length - 1]) {
            var w = B[G.length - 1];
            if (R == 1)
              if (D == p.add) {
                var Y = y;
                if (Y.bones == null)
                  for (var X = Y.vertices, Z = 0; Z < V; Z++)
                    U[Z] += w[Z] - X[Z];
                else
                  for (var z = 0; z < V; z++)
                    U[z] += w[z];
              } else
                o.Utils.arrayCopy(w, 0, U, 0, V);
            else
              switch (D) {
                case p.setup: {
                  var j = y;
                  if (j.bones == null)
                    for (var X = j.vertices, H = 0; H < V; H++) {
                      var q = X[H];
                      U[H] = q + (w[H] - q) * R;
                    }
                  else
                    for (var K = 0; K < V; K++)
                      U[K] = w[K] * R;
                  break;
                }
                case p.first:
                case p.replace:
                  for (var J = 0; J < V; J++)
                    U[J] += (w[J] - U[J]) * R;
                  break;
                case p.add:
                  var Y = y;
                  if (Y.bones == null)
                    for (var X = Y.vertices, at = 0; at < V; at++)
                      U[at] += (w[at] - X[at]) * R;
                  else
                    for (var nt = 0; nt < V; nt++)
                      U[nt] += w[nt] * R;
              }
            return;
          }
          var lt = e.binarySearch(G, k), ut = B[lt - 1], st = B[lt], ct = G[lt], ot = this.getCurvePercent(lt - 1, 1 - (k - ct) / (G[lt - 1] - ct));
          if (R == 1)
            if (D == p.add) {
              var Y = y;
              if (Y.bones == null)
                for (var X = Y.vertices, ht = 0; ht < V; ht++) {
                  var rt = ut[ht];
                  U[ht] += rt + (st[ht] - rt) * ot - X[ht];
                }
              else
                for (var xt = 0; xt < V; xt++) {
                  var rt = ut[xt];
                  U[xt] += rt + (st[xt] - rt) * ot;
                }
            } else
              for (var mt = 0; mt < V; mt++) {
                var rt = ut[mt];
                U[mt] = rt + (st[mt] - rt) * ot;
              }
          else
            switch (D) {
              case p.setup: {
                var It = y;
                if (It.bones == null)
                  for (var X = It.vertices, Ct = 0; Ct < V; Ct++) {
                    var rt = ut[Ct], q = X[Ct];
                    U[Ct] = q + (rt + (st[Ct] - rt) * ot - q) * R;
                  }
                else
                  for (var At = 0; At < V; At++) {
                    var rt = ut[At];
                    U[At] = (rt + (st[At] - rt) * ot) * R;
                  }
                break;
              }
              case p.first:
              case p.replace:
                for (var vt = 0; vt < V; vt++) {
                  var rt = ut[vt];
                  U[vt] += (rt + (st[vt] - rt) * ot - U[vt]) * R;
                }
                break;
              case p.add:
                var Y = y;
                if (Y.bones == null)
                  for (var X = Y.vertices, kt = 0; kt < V; kt++) {
                    var rt = ut[kt];
                    U[kt] += (rt + (st[kt] - rt) * ot - X[kt]) * R;
                  }
                else
                  for (var Dt = 0; Dt < V; Dt++) {
                    var rt = ut[Dt];
                    U[Dt] += (rt + (st[Dt] - rt) * ot) * R;
                  }
            }
        }
      }
    }, m;
  })(i);
  o.DeformTimeline = d;
  var u = (function() {
    function g(m) {
      this.frames = o.Utils.newFloatArray(m), this.events = new Array(m);
    }
    return g.prototype.getPropertyId = function() {
      return t.event << 24;
    }, g.prototype.getFrameCount = function() {
      return this.frames.length;
    }, g.prototype.setFrame = function(m, x) {
      this.frames[m] = x.time, this.events[m] = x;
    }, g.prototype.apply = function(m, x, P, k, O, R, D) {
      if (k != null) {
        var N = this.frames, I = this.frames.length;
        if (x > P)
          this.apply(m, x, Number.MAX_VALUE, k, O, R, D), x = -1;
        else if (x >= N[I - 1])
          return;
        if (!(P < N[0])) {
          var y = 0;
          if (x < N[0])
            y = 0;
          else {
            y = e.binarySearch(N, x);
            for (var T = N[y]; y > 0 && N[y - 1] == T; )
              y--;
          }
          for (; y < I && P >= N[y]; y++)
            k.push(this.events[y]);
        }
      }
    }, g;
  })();
  o.EventTimeline = u;
  var M = (function() {
    function g(m) {
      this.frames = o.Utils.newFloatArray(m), this.drawOrders = new Array(m);
    }
    return g.prototype.getPropertyId = function() {
      return t.drawOrder << 24;
    }, g.prototype.getFrameCount = function() {
      return this.frames.length;
    }, g.prototype.setFrame = function(m, x, P) {
      this.frames[m] = x, this.drawOrders[m] = P;
    }, g.prototype.apply = function(m, x, P, k, O, R, D) {
      var N = m.drawOrder, I = m.slots;
      if (D == a.mixOut) {
        R == p.setup && o.Utils.arrayCopy(m.slots, 0, m.drawOrder, 0, m.slots.length);
        return;
      }
      var y = this.frames;
      if (P < y[0]) {
        (R == p.setup || R == p.first) && o.Utils.arrayCopy(m.slots, 0, m.drawOrder, 0, m.slots.length);
        return;
      }
      var T = 0;
      P >= y[y.length - 1] ? T = y.length - 1 : T = e.binarySearch(y, P) - 1;
      var B = this.drawOrders[T];
      if (B == null)
        o.Utils.arrayCopy(I, 0, N, 0, I.length);
      else
        for (var V = 0, G = B.length; V < G; V++)
          N[V] = I[B[V]];
    }, g;
  })();
  o.DrawOrderTimeline = M;
  var C = (function(g) {
    Q(m, g);
    function m(x) {
      var P = g.call(this, x) || this;
      return P.frames = o.Utils.newFloatArray(x * m.ENTRIES), P;
    }
    return m.prototype.getPropertyId = function() {
      return (t.ikConstraint << 24) + this.ikConstraintIndex;
    }, m.prototype.setFrame = function(x, P, k, O, R, D, N) {
      x *= m.ENTRIES, this.frames[x] = P, this.frames[x + m.MIX] = k, this.frames[x + m.SOFTNESS] = O, this.frames[x + m.BEND_DIRECTION] = R, this.frames[x + m.COMPRESS] = D ? 1 : 0, this.frames[x + m.STRETCH] = N ? 1 : 0;
    }, m.prototype.apply = function(x, P, k, O, R, D, N) {
      var I = this.frames, y = x.ikConstraints[this.ikConstraintIndex];
      if (y.active) {
        if (k < I[0]) {
          switch (D) {
            case p.setup:
              y.mix = y.data.mix, y.softness = y.data.softness, y.bendDirection = y.data.bendDirection, y.compress = y.data.compress, y.stretch = y.data.stretch;
              return;
            case p.first:
              y.mix += (y.data.mix - y.mix) * R, y.softness += (y.data.softness - y.softness) * R, y.bendDirection = y.data.bendDirection, y.compress = y.data.compress, y.stretch = y.data.stretch;
          }
          return;
        }
        if (k >= I[I.length - m.ENTRIES]) {
          D == p.setup ? (y.mix = y.data.mix + (I[I.length + m.PREV_MIX] - y.data.mix) * R, y.softness = y.data.softness + (I[I.length + m.PREV_SOFTNESS] - y.data.softness) * R, N == a.mixOut ? (y.bendDirection = y.data.bendDirection, y.compress = y.data.compress, y.stretch = y.data.stretch) : (y.bendDirection = I[I.length + m.PREV_BEND_DIRECTION], y.compress = I[I.length + m.PREV_COMPRESS] != 0, y.stretch = I[I.length + m.PREV_STRETCH] != 0)) : (y.mix += (I[I.length + m.PREV_MIX] - y.mix) * R, y.softness += (I[I.length + m.PREV_SOFTNESS] - y.softness) * R, N == a.mixIn && (y.bendDirection = I[I.length + m.PREV_BEND_DIRECTION], y.compress = I[I.length + m.PREV_COMPRESS] != 0, y.stretch = I[I.length + m.PREV_STRETCH] != 0));
          return;
        }
        var T = e.binarySearch(I, k, m.ENTRIES), B = I[T + m.PREV_MIX], V = I[T + m.PREV_SOFTNESS], G = I[T], Y = this.getCurvePercent(T / m.ENTRIES - 1, 1 - (k - G) / (I[T + m.PREV_TIME] - G));
        D == p.setup ? (y.mix = y.data.mix + (B + (I[T + m.MIX] - B) * Y - y.data.mix) * R, y.softness = y.data.softness + (V + (I[T + m.SOFTNESS] - V) * Y - y.data.softness) * R, N == a.mixOut ? (y.bendDirection = y.data.bendDirection, y.compress = y.data.compress, y.stretch = y.data.stretch) : (y.bendDirection = I[T + m.PREV_BEND_DIRECTION], y.compress = I[T + m.PREV_COMPRESS] != 0, y.stretch = I[T + m.PREV_STRETCH] != 0)) : (y.mix += (B + (I[T + m.MIX] - B) * Y - y.mix) * R, y.softness += (V + (I[T + m.SOFTNESS] - V) * Y - y.softness) * R, N == a.mixIn && (y.bendDirection = I[T + m.PREV_BEND_DIRECTION], y.compress = I[T + m.PREV_COMPRESS] != 0, y.stretch = I[T + m.PREV_STRETCH] != 0));
      }
    }, m.ENTRIES = 6, m.PREV_TIME = -6, m.PREV_MIX = -5, m.PREV_SOFTNESS = -4, m.PREV_BEND_DIRECTION = -3, m.PREV_COMPRESS = -2, m.PREV_STRETCH = -1, m.MIX = 1, m.SOFTNESS = 2, m.BEND_DIRECTION = 3, m.COMPRESS = 4, m.STRETCH = 5, m;
  })(i);
  o.IkConstraintTimeline = C;
  var S = (function(g) {
    Q(m, g);
    function m(x) {
      var P = g.call(this, x) || this;
      return P.frames = o.Utils.newFloatArray(x * m.ENTRIES), P;
    }
    return m.prototype.getPropertyId = function() {
      return (t.transformConstraint << 24) + this.transformConstraintIndex;
    }, m.prototype.setFrame = function(x, P, k, O, R, D) {
      x *= m.ENTRIES, this.frames[x] = P, this.frames[x + m.ROTATE] = k, this.frames[x + m.TRANSLATE] = O, this.frames[x + m.SCALE] = R, this.frames[x + m.SHEAR] = D;
    }, m.prototype.apply = function(x, P, k, O, R, D, N) {
      var I = this.frames, y = x.transformConstraints[this.transformConstraintIndex];
      if (y.active) {
        if (k < I[0]) {
          var T = y.data;
          switch (D) {
            case p.setup:
              y.rotateMix = T.rotateMix, y.translateMix = T.translateMix, y.scaleMix = T.scaleMix, y.shearMix = T.shearMix;
              return;
            case p.first:
              y.rotateMix += (T.rotateMix - y.rotateMix) * R, y.translateMix += (T.translateMix - y.translateMix) * R, y.scaleMix += (T.scaleMix - y.scaleMix) * R, y.shearMix += (T.shearMix - y.shearMix) * R;
          }
          return;
        }
        var B = 0, V = 0, G = 0, Y = 0;
        if (k >= I[I.length - m.ENTRIES]) {
          var _ = I.length;
          B = I[_ + m.PREV_ROTATE], V = I[_ + m.PREV_TRANSLATE], G = I[_ + m.PREV_SCALE], Y = I[_ + m.PREV_SHEAR];
        } else {
          var X = e.binarySearch(I, k, m.ENTRIES);
          B = I[X + m.PREV_ROTATE], V = I[X + m.PREV_TRANSLATE], G = I[X + m.PREV_SCALE], Y = I[X + m.PREV_SHEAR];
          var W = I[X], U = this.getCurvePercent(X / m.ENTRIES - 1, 1 - (k - W) / (I[X + m.PREV_TIME] - W));
          B += (I[X + m.ROTATE] - B) * U, V += (I[X + m.TRANSLATE] - V) * U, G += (I[X + m.SCALE] - G) * U, Y += (I[X + m.SHEAR] - Y) * U;
        }
        if (D == p.setup) {
          var T = y.data;
          y.rotateMix = T.rotateMix + (B - T.rotateMix) * R, y.translateMix = T.translateMix + (V - T.translateMix) * R, y.scaleMix = T.scaleMix + (G - T.scaleMix) * R, y.shearMix = T.shearMix + (Y - T.shearMix) * R;
        } else
          y.rotateMix += (B - y.rotateMix) * R, y.translateMix += (V - y.translateMix) * R, y.scaleMix += (G - y.scaleMix) * R, y.shearMix += (Y - y.shearMix) * R;
      }
    }, m.ENTRIES = 5, m.PREV_TIME = -5, m.PREV_ROTATE = -4, m.PREV_TRANSLATE = -3, m.PREV_SCALE = -2, m.PREV_SHEAR = -1, m.ROTATE = 1, m.TRANSLATE = 2, m.SCALE = 3, m.SHEAR = 4, m;
  })(i);
  o.TransformConstraintTimeline = S;
  var L = (function(g) {
    Q(m, g);
    function m(x) {
      var P = g.call(this, x) || this;
      return P.frames = o.Utils.newFloatArray(x * m.ENTRIES), P;
    }
    return m.prototype.getPropertyId = function() {
      return (t.pathConstraintPosition << 24) + this.pathConstraintIndex;
    }, m.prototype.setFrame = function(x, P, k) {
      x *= m.ENTRIES, this.frames[x] = P, this.frames[x + m.VALUE] = k;
    }, m.prototype.apply = function(x, P, k, O, R, D, N) {
      var I = this.frames, y = x.pathConstraints[this.pathConstraintIndex];
      if (y.active) {
        if (k < I[0]) {
          switch (D) {
            case p.setup:
              y.position = y.data.position;
              return;
            case p.first:
              y.position += (y.data.position - y.position) * R;
          }
          return;
        }
        var T = 0;
        if (k >= I[I.length - m.ENTRIES])
          T = I[I.length + m.PREV_VALUE];
        else {
          var B = e.binarySearch(I, k, m.ENTRIES);
          T = I[B + m.PREV_VALUE];
          var V = I[B], G = this.getCurvePercent(B / m.ENTRIES - 1, 1 - (k - V) / (I[B + m.PREV_TIME] - V));
          T += (I[B + m.VALUE] - T) * G;
        }
        D == p.setup ? y.position = y.data.position + (T - y.data.position) * R : y.position += (T - y.position) * R;
      }
    }, m.ENTRIES = 2, m.PREV_TIME = -2, m.PREV_VALUE = -1, m.VALUE = 1, m;
  })(i);
  o.PathConstraintPositionTimeline = L;
  var E = (function(g) {
    Q(m, g);
    function m(x) {
      return g.call(this, x) || this;
    }
    return m.prototype.getPropertyId = function() {
      return (t.pathConstraintSpacing << 24) + this.pathConstraintIndex;
    }, m.prototype.apply = function(x, P, k, O, R, D, N) {
      var I = this.frames, y = x.pathConstraints[this.pathConstraintIndex];
      if (y.active) {
        if (k < I[0]) {
          switch (D) {
            case p.setup:
              y.spacing = y.data.spacing;
              return;
            case p.first:
              y.spacing += (y.data.spacing - y.spacing) * R;
          }
          return;
        }
        var T = 0;
        if (k >= I[I.length - m.ENTRIES])
          T = I[I.length + m.PREV_VALUE];
        else {
          var B = e.binarySearch(I, k, m.ENTRIES);
          T = I[B + m.PREV_VALUE];
          var V = I[B], G = this.getCurvePercent(B / m.ENTRIES - 1, 1 - (k - V) / (I[B + m.PREV_TIME] - V));
          T += (I[B + m.VALUE] - T) * G;
        }
        D == p.setup ? y.spacing = y.data.spacing + (T - y.data.spacing) * R : y.spacing += (T - y.spacing) * R;
      }
    }, m;
  })(L);
  o.PathConstraintSpacingTimeline = E;
  var A = (function(g) {
    Q(m, g);
    function m(x) {
      var P = g.call(this, x) || this;
      return P.frames = o.Utils.newFloatArray(x * m.ENTRIES), P;
    }
    return m.prototype.getPropertyId = function() {
      return (t.pathConstraintMix << 24) + this.pathConstraintIndex;
    }, m.prototype.setFrame = function(x, P, k, O) {
      x *= m.ENTRIES, this.frames[x] = P, this.frames[x + m.ROTATE] = k, this.frames[x + m.TRANSLATE] = O;
    }, m.prototype.apply = function(x, P, k, O, R, D, N) {
      var I = this.frames, y = x.pathConstraints[this.pathConstraintIndex];
      if (y.active) {
        if (k < I[0]) {
          switch (D) {
            case p.setup:
              y.rotateMix = y.data.rotateMix, y.translateMix = y.data.translateMix;
              return;
            case p.first:
              y.rotateMix += (y.data.rotateMix - y.rotateMix) * R, y.translateMix += (y.data.translateMix - y.translateMix) * R;
          }
          return;
        }
        var T = 0, B = 0;
        if (k >= I[I.length - m.ENTRIES])
          T = I[I.length + m.PREV_ROTATE], B = I[I.length + m.PREV_TRANSLATE];
        else {
          var V = e.binarySearch(I, k, m.ENTRIES);
          T = I[V + m.PREV_ROTATE], B = I[V + m.PREV_TRANSLATE];
          var G = I[V], Y = this.getCurvePercent(V / m.ENTRIES - 1, 1 - (k - G) / (I[V + m.PREV_TIME] - G));
          T += (I[V + m.ROTATE] - T) * Y, B += (I[V + m.TRANSLATE] - B) * Y;
        }
        D == p.setup ? (y.rotateMix = y.data.rotateMix + (T - y.data.rotateMix) * R, y.translateMix = y.data.translateMix + (B - y.data.translateMix) * R) : (y.rotateMix += (T - y.rotateMix) * R, y.translateMix += (B - y.translateMix) * R);
      }
    }, m.ENTRIES = 3, m.PREV_TIME = -3, m.PREV_ROTATE = -2, m.PREV_TRANSLATE = -1, m.ROTATE = 1, m.TRANSLATE = 2, m;
  })(i);
  o.PathConstraintMixTimeline = A;
})(F || (F = {}));
var F;
(function(o) {
  var e = (function() {
    function r(n) {
      this.tracks = new Array(), this.timeScale = 1, this.unkeyedState = 0, this.events = new Array(), this.listeners = new Array(), this.queue = new a(this), this.propertyIDs = new o.IntSet(), this.animationsChanged = !1, this.trackEntryPool = new o.Pool(function() {
        return new p();
      }), this.data = n;
    }
    return r.prototype.update = function(n) {
      n *= this.timeScale;
      for (var f = this.tracks, l = 0, v = f.length; l < v; l++) {
        var c = f[l];
        if (c != null) {
          c.animationLast = c.nextAnimationLast, c.trackLast = c.nextTrackLast;
          var s = n * c.timeScale;
          if (c.delay > 0) {
            if (c.delay -= s, c.delay > 0)
              continue;
            s = -c.delay, c.delay = 0;
          }
          var h = c.next;
          if (h != null) {
            var d = c.trackLast - h.delay;
            if (d >= 0) {
              for (h.delay = 0, h.trackTime += c.timeScale == 0 ? 0 : (d / c.timeScale + n) * h.timeScale, c.trackTime += s, this.setCurrent(l, h, !0); h.mixingFrom != null; )
                h.mixTime += n, h = h.mixingFrom;
              continue;
            }
          } else if (c.trackLast >= c.trackEnd && c.mixingFrom == null) {
            f[l] = null, this.queue.end(c), this.disposeNext(c);
            continue;
          }
          if (c.mixingFrom != null && this.updateMixingFrom(c, n)) {
            var u = c.mixingFrom;
            for (c.mixingFrom = null, u != null && (u.mixingTo = null); u != null; )
              this.queue.end(u), u = u.mixingFrom;
          }
          c.trackTime += s;
        }
      }
      this.queue.drain();
    }, r.prototype.updateMixingFrom = function(n, f) {
      var l = n.mixingFrom;
      if (l == null)
        return !0;
      var v = this.updateMixingFrom(l, f);
      return l.animationLast = l.nextAnimationLast, l.trackLast = l.nextTrackLast, n.mixTime > 0 && n.mixTime >= n.mixDuration ? ((l.totalAlpha == 0 || n.mixDuration == 0) && (n.mixingFrom = l.mixingFrom, l.mixingFrom != null && (l.mixingFrom.mixingTo = n), n.interruptAlpha = l.interruptAlpha, this.queue.end(l)), v) : (l.trackTime += f * l.timeScale, n.mixTime += f, !1);
    }, r.prototype.apply = function(n) {
      if (n == null)
        throw new Error("skeleton cannot be null.");
      this.animationsChanged && this._animationsChanged();
      for (var f = this.events, l = this.tracks, v = !1, c = 0, s = l.length; c < s; c++) {
        var h = l[c];
        if (!(h == null || h.delay > 0)) {
          v = !0;
          var d = c == 0 ? o.MixBlend.first : h.mixBlend, u = h.alpha;
          h.mixingFrom != null ? u *= this.applyMixingFrom(h, n, d) : h.trackTime >= h.trackEnd && h.next == null && (u = 0);
          var M = h.animationLast, C = h.getAnimationTime(), S = h.animation.timelines.length, L = h.animation.timelines;
          if (c == 0 && u == 1 || d == o.MixBlend.add)
            for (var E = 0; E < S; E++) {
              o.Utils.webkit602BugfixHelper(u, d);
              var A = L[E];
              A instanceof o.AttachmentTimeline ? this.applyAttachmentTimeline(A, n, C, d, !0) : A.apply(n, M, C, f, u, d, o.MixDirection.mixIn);
            }
          else {
            var g = h.timelineMode, m = h.timelinesRotation.length == 0;
            m && o.Utils.setArraySize(h.timelinesRotation, S << 1, null);
            for (var x = h.timelinesRotation, E = 0; E < S; E++) {
              var P = L[E], k = g[E] == r.SUBSEQUENT ? d : o.MixBlend.setup;
              P instanceof o.RotateTimeline ? this.applyRotateTimeline(P, n, C, u, k, x, E << 1, m) : P instanceof o.AttachmentTimeline ? this.applyAttachmentTimeline(P, n, C, d, !0) : (o.Utils.webkit602BugfixHelper(u, d), P.apply(n, M, C, f, u, k, o.MixDirection.mixIn));
            }
          }
          this.queueEvents(h, C), f.length = 0, h.nextAnimationLast = C, h.nextTrackLast = h.trackTime;
        }
      }
      for (var O = this.unkeyedState + r.SETUP, R = n.slots, D = 0, N = n.slots.length; D < N; D++) {
        var I = R[D];
        if (I.attachmentState == O) {
          var y = I.data.attachmentName;
          I.setAttachment(y == null ? null : n.getAttachment(I.data.index, y));
        }
      }
      return this.unkeyedState += 2, this.queue.drain(), v;
    }, r.prototype.applyMixingFrom = function(n, f, l) {
      var v = n.mixingFrom;
      v.mixingFrom != null && this.applyMixingFrom(v, f, l);
      var c = 0;
      n.mixDuration == 0 ? (c = 1, l == o.MixBlend.first && (l = o.MixBlend.setup)) : (c = n.mixTime / n.mixDuration, c > 1 && (c = 1), l != o.MixBlend.first && (l = v.mixBlend));
      var s = c < v.eventThreshold ? this.events : null, h = c < v.attachmentThreshold, d = c < v.drawOrderThreshold, u = v.animationLast, M = v.getAnimationTime(), C = v.animation.timelines.length, S = v.animation.timelines, L = v.alpha * n.interruptAlpha, E = L * (1 - c);
      if (l == o.MixBlend.add)
        for (var A = 0; A < C; A++)
          S[A].apply(f, u, M, s, E, l, o.MixDirection.mixOut);
      else {
        var g = v.timelineMode, m = v.timelineHoldMix, x = v.timelinesRotation.length == 0;
        x && o.Utils.setArraySize(v.timelinesRotation, C << 1, null);
        var P = v.timelinesRotation;
        v.totalAlpha = 0;
        for (var A = 0; A < C; A++) {
          var k = S[A], O = o.MixDirection.mixOut, R = void 0, D = 0;
          switch (g[A]) {
            case r.SUBSEQUENT:
              if (!d && k instanceof o.DrawOrderTimeline)
                continue;
              R = l, D = E;
              break;
            case r.FIRST:
              R = o.MixBlend.setup, D = E;
              break;
            case r.HOLD_SUBSEQUENT:
              R = l, D = L;
              break;
            case r.HOLD_FIRST:
              R = o.MixBlend.setup, D = L;
              break;
            default:
              R = o.MixBlend.setup;
              var N = m[A];
              D = L * Math.max(0, 1 - N.mixTime / N.mixDuration);
              break;
          }
          v.totalAlpha += D, k instanceof o.RotateTimeline ? this.applyRotateTimeline(k, f, M, D, R, P, A << 1, x) : k instanceof o.AttachmentTimeline ? this.applyAttachmentTimeline(k, f, M, R, h) : (o.Utils.webkit602BugfixHelper(D, l), d && k instanceof o.DrawOrderTimeline && R == o.MixBlend.setup && (O = o.MixDirection.mixIn), k.apply(f, u, M, s, D, R, O));
        }
      }
      return n.mixDuration > 0 && this.queueEvents(v, M), this.events.length = 0, v.nextAnimationLast = M, v.nextTrackLast = v.trackTime, c;
    }, r.prototype.applyAttachmentTimeline = function(n, f, l, v, c) {
      var s = f.slots[n.slotIndex];
      if (s.bone.active) {
        var h = n.frames;
        if (l < h[0])
          (v == o.MixBlend.setup || v == o.MixBlend.first) && this.setAttachment(f, s, s.data.attachmentName, c);
        else {
          var d;
          l >= h[h.length - 1] ? d = h.length - 1 : d = o.Animation.binarySearch(h, l) - 1, this.setAttachment(f, s, n.attachmentNames[d], c);
        }
        s.attachmentState <= this.unkeyedState && (s.attachmentState = this.unkeyedState + r.SETUP);
      }
    }, r.prototype.setAttachment = function(n, f, l, v) {
      f.setAttachment(l == null ? null : n.getAttachment(f.data.index, l)), v && (f.attachmentState = this.unkeyedState + r.CURRENT);
    }, r.prototype.applyRotateTimeline = function(n, f, l, v, c, s, h, d) {
      if (d && (s[h] = 0), v == 1) {
        n.apply(f, 0, l, null, 1, c, o.MixDirection.mixIn);
        return;
      }
      var u = n, M = u.frames, C = f.bones[u.boneIndex];
      if (C.active) {
        var S = 0, L = 0;
        if (l < M[0])
          switch (c) {
            case o.MixBlend.setup:
              C.rotation = C.data.rotation;
            default:
              return;
            case o.MixBlend.first:
              S = C.rotation, L = C.data.rotation;
          }
        else if (S = c == o.MixBlend.setup ? C.data.rotation : C.rotation, l >= M[M.length - o.RotateTimeline.ENTRIES])
          L = C.data.rotation + M[M.length + o.RotateTimeline.PREV_ROTATION];
        else {
          var E = o.Animation.binarySearch(M, l, o.RotateTimeline.ENTRIES), A = M[E + o.RotateTimeline.PREV_ROTATION], g = M[E], m = u.getCurvePercent((E >> 1) - 1, 1 - (l - g) / (M[E + o.RotateTimeline.PREV_TIME] - g));
          L = M[E + o.RotateTimeline.ROTATION] - A, L -= (16384 - (16384.499999999996 - L / 360 | 0)) * 360, L = A + L * m + C.data.rotation, L -= (16384 - (16384.499999999996 - L / 360 | 0)) * 360;
        }
        var x = 0, P = L - S;
        if (P -= (16384 - (16384.499999999996 - P / 360 | 0)) * 360, P == 0)
          x = s[h];
        else {
          var k = 0, O = 0;
          d ? (k = 0, O = P) : (k = s[h], O = s[h + 1]);
          var R = P > 0, D = k >= 0;
          o.MathUtils.signum(O) != o.MathUtils.signum(P) && Math.abs(O) <= 90 && (Math.abs(k) > 180 && (k += 360 * o.MathUtils.signum(k)), D = R), x = P + k - k % 360, D != R && (x += 360 * o.MathUtils.signum(k)), s[h] = x;
        }
        s[h + 1] = P, S += x * v, C.rotation = S - (16384 - (16384.499999999996 - S / 360 | 0)) * 360;
      }
    }, r.prototype.queueEvents = function(n, f) {
      for (var l = n.animationStart, v = n.animationEnd, c = v - l, s = n.trackLast % c, h = this.events, d = 0, u = h.length; d < u; d++) {
        var M = h[d];
        if (M.time < s)
          break;
        M.time > v || this.queue.event(n, M);
      }
      var C = !1;
      for (n.loop ? C = c == 0 || s > n.trackTime % c : C = f >= v && n.animationLast < v, C && this.queue.complete(n); d < u; d++) {
        var S = h[d];
        S.time < l || this.queue.event(n, h[d]);
      }
    }, r.prototype.clearTracks = function() {
      var n = this.queue.drainDisabled;
      this.queue.drainDisabled = !0;
      for (var f = 0, l = this.tracks.length; f < l; f++)
        this.clearTrack(f);
      this.tracks.length = 0, this.queue.drainDisabled = n, this.queue.drain();
    }, r.prototype.clearTrack = function(n) {
      if (!(n >= this.tracks.length)) {
        var f = this.tracks[n];
        if (f != null) {
          this.queue.end(f), this.disposeNext(f);
          for (var l = f; ; ) {
            var v = l.mixingFrom;
            if (v == null)
              break;
            this.queue.end(v), l.mixingFrom = null, l.mixingTo = null, l = v;
          }
          this.tracks[f.trackIndex] = null, this.queue.drain();
        }
      }
    }, r.prototype.setCurrent = function(n, f, l) {
      var v = this.expandToIndex(n);
      this.tracks[n] = f, v != null && (l && this.queue.interrupt(v), f.mixingFrom = v, v.mixingTo = f, f.mixTime = 0, v.mixingFrom != null && v.mixDuration > 0 && (f.interruptAlpha *= Math.min(1, v.mixTime / v.mixDuration)), v.timelinesRotation.length = 0), this.queue.start(f);
    }, r.prototype.setAnimation = function(n, f, l) {
      var v = this.data.skeletonData.findAnimation(f);
      if (v == null)
        throw new Error("Animation not found: " + f);
      return this.setAnimationWith(n, v, l);
    }, r.prototype.setAnimationWith = function(n, f, l) {
      if (f == null)
        throw new Error("animation cannot be null.");
      var v = !0, c = this.expandToIndex(n);
      c != null && (c.nextTrackLast == -1 ? (this.tracks[n] = c.mixingFrom, this.queue.interrupt(c), this.queue.end(c), this.disposeNext(c), c = c.mixingFrom, v = !1) : this.disposeNext(c));
      var s = this.trackEntry(n, f, l, c);
      return this.setCurrent(n, s, v), this.queue.drain(), s;
    }, r.prototype.addAnimation = function(n, f, l, v) {
      var c = this.data.skeletonData.findAnimation(f);
      if (c == null)
        throw new Error("Animation not found: " + f);
      return this.addAnimationWith(n, c, l, v);
    }, r.prototype.addAnimationWith = function(n, f, l, v) {
      if (f == null)
        throw new Error("animation cannot be null.");
      var c = this.expandToIndex(n);
      if (c != null)
        for (; c.next != null; )
          c = c.next;
      var s = this.trackEntry(n, f, l, c);
      if (c == null)
        this.setCurrent(n, s, !0), this.queue.drain();
      else if (c.next = s, v <= 0) {
        var h = c.animationEnd - c.animationStart;
        h != 0 ? (c.loop ? v += h * (1 + (c.trackTime / h | 0)) : v += Math.max(h, c.trackTime), v -= this.data.getMix(c.animation, f)) : v = c.trackTime;
      }
      return s.delay = v, s;
    }, r.prototype.setEmptyAnimation = function(n, f) {
      var l = this.setAnimationWith(n, r.emptyAnimation, !1);
      return l.mixDuration = f, l.trackEnd = f, l;
    }, r.prototype.addEmptyAnimation = function(n, f, l) {
      l <= 0 && (l -= f);
      var v = this.addAnimationWith(n, r.emptyAnimation, !1, l);
      return v.mixDuration = f, v.trackEnd = f, v;
    }, r.prototype.setEmptyAnimations = function(n) {
      var f = this.queue.drainDisabled;
      this.queue.drainDisabled = !0;
      for (var l = 0, v = this.tracks.length; l < v; l++) {
        var c = this.tracks[l];
        c != null && this.setEmptyAnimation(c.trackIndex, n);
      }
      this.queue.drainDisabled = f, this.queue.drain();
    }, r.prototype.expandToIndex = function(n) {
      return n < this.tracks.length ? this.tracks[n] : (o.Utils.ensureArrayCapacity(this.tracks, n + 1, null), this.tracks.length = n + 1, null);
    }, r.prototype.trackEntry = function(n, f, l, v) {
      var c = this.trackEntryPool.obtain();
      return c.trackIndex = n, c.animation = f, c.loop = l, c.holdPrevious = !1, c.eventThreshold = 0, c.attachmentThreshold = 0, c.drawOrderThreshold = 0, c.animationStart = 0, c.animationEnd = f.duration, c.animationLast = -1, c.nextAnimationLast = -1, c.delay = 0, c.trackTime = 0, c.trackLast = -1, c.nextTrackLast = -1, c.trackEnd = Number.MAX_VALUE, c.timeScale = 1, c.alpha = 1, c.interruptAlpha = 1, c.mixTime = 0, c.mixDuration = v == null ? 0 : this.data.getMix(v.animation, f), c.mixBlend = o.MixBlend.replace, c;
    }, r.prototype.disposeNext = function(n) {
      for (var f = n.next; f != null; )
        this.queue.dispose(f), f = f.next;
      n.next = null;
    }, r.prototype._animationsChanged = function() {
      this.animationsChanged = !1, this.propertyIDs.clear();
      for (var n = 0, f = this.tracks.length; n < f; n++) {
        var l = this.tracks[n];
        if (l != null) {
          for (; l.mixingFrom != null; )
            l = l.mixingFrom;
          do
            (l.mixingFrom == null || l.mixBlend != o.MixBlend.add) && this.computeHold(l), l = l.mixingTo;
          while (l != null);
        }
      }
    }, r.prototype.computeHold = function(n) {
      var f = n.mixingTo, l = n.animation.timelines, v = n.animation.timelines.length, c = o.Utils.setArraySize(n.timelineMode, v);
      n.timelineHoldMix.length = 0;
      var s = o.Utils.setArraySize(n.timelineHoldMix, v), h = this.propertyIDs;
      if (f != null && f.holdPrevious) {
        for (var d = 0; d < v; d++)
          c[d] = h.add(l[d].getPropertyId()) ? r.HOLD_FIRST : r.HOLD_SUBSEQUENT;
        return;
      }
      t: for (var d = 0; d < v; d++) {
        var u = l[d], M = u.getPropertyId();
        if (!h.add(M))
          c[d] = r.SUBSEQUENT;
        else if (f == null || u instanceof o.AttachmentTimeline || u instanceof o.DrawOrderTimeline || u instanceof o.EventTimeline || !f.animation.hasTimeline(M))
          c[d] = r.FIRST;
        else {
          for (var C = f.mixingTo; C != null; C = C.mixingTo)
            if (!C.animation.hasTimeline(M)) {
              if (n.mixDuration > 0) {
                c[d] = r.HOLD_MIX, s[d] = C;
                continue t;
              }
              break;
            }
          c[d] = r.HOLD_FIRST;
        }
      }
    }, r.prototype.getCurrent = function(n) {
      return n >= this.tracks.length ? null : this.tracks[n];
    }, r.prototype.addListener = function(n) {
      if (n == null)
        throw new Error("listener cannot be null.");
      this.listeners.push(n);
    }, r.prototype.removeListener = function(n) {
      var f = this.listeners.indexOf(n);
      f >= 0 && this.listeners.splice(f, 1);
    }, r.prototype.clearListeners = function() {
      this.listeners.length = 0;
    }, r.prototype.clearListenerNotifications = function() {
      this.queue.clear();
    }, r.emptyAnimation = new o.Animation("<empty>", [], 0), r.SUBSEQUENT = 0, r.FIRST = 1, r.HOLD_SUBSEQUENT = 2, r.HOLD_FIRST = 3, r.HOLD_MIX = 4, r.SETUP = 1, r.CURRENT = 2, r;
  })();
  o.AnimationState = e;
  var p = (function() {
    function r() {
      this.mixBlend = o.MixBlend.replace, this.timelineMode = new Array(), this.timelineHoldMix = new Array(), this.timelinesRotation = new Array();
    }
    return r.prototype.reset = function() {
      this.next = null, this.mixingFrom = null, this.mixingTo = null, this.animation = null, this.listener = null, this.timelineMode.length = 0, this.timelineHoldMix.length = 0, this.timelinesRotation.length = 0;
    }, r.prototype.getAnimationTime = function() {
      if (this.loop) {
        var n = this.animationEnd - this.animationStart;
        return n == 0 ? this.animationStart : this.trackTime % n + this.animationStart;
      }
      return Math.min(this.trackTime + this.animationStart, this.animationEnd);
    }, r.prototype.setAnimationLast = function(n) {
      this.animationLast = n, this.nextAnimationLast = n;
    }, r.prototype.isComplete = function() {
      return this.trackTime >= this.animationEnd - this.animationStart;
    }, r.prototype.resetRotationDirections = function() {
      this.timelinesRotation.length = 0;
    }, r;
  })();
  o.TrackEntry = p;
  var a = (function() {
    function r(n) {
      this.objects = [], this.drainDisabled = !1, this.animState = n;
    }
    return r.prototype.start = function(n) {
      this.objects.push(t.start), this.objects.push(n), this.animState.animationsChanged = !0;
    }, r.prototype.interrupt = function(n) {
      this.objects.push(t.interrupt), this.objects.push(n);
    }, r.prototype.end = function(n) {
      this.objects.push(t.end), this.objects.push(n), this.animState.animationsChanged = !0;
    }, r.prototype.dispose = function(n) {
      this.objects.push(t.dispose), this.objects.push(n);
    }, r.prototype.complete = function(n) {
      this.objects.push(t.complete), this.objects.push(n);
    }, r.prototype.event = function(n, f) {
      this.objects.push(t.event), this.objects.push(n), this.objects.push(f);
    }, r.prototype.drain = function() {
      if (!this.drainDisabled) {
        this.drainDisabled = !0;
        for (var n = this.objects, f = this.animState.listeners, l = 0; l < n.length; l += 2) {
          var v = n[l], c = n[l + 1];
          switch (v) {
            case t.start:
              c.listener != null && c.listener.start && c.listener.start(c);
              for (var s = 0; s < f.length; s++)
                f[s].start && f[s].start(c);
              break;
            case t.interrupt:
              c.listener != null && c.listener.interrupt && c.listener.interrupt(c);
              for (var s = 0; s < f.length; s++)
                f[s].interrupt && f[s].interrupt(c);
              break;
            case t.end:
              c.listener != null && c.listener.end && c.listener.end(c);
              for (var s = 0; s < f.length; s++)
                f[s].end && f[s].end(c);
            case t.dispose:
              c.listener != null && c.listener.dispose && c.listener.dispose(c);
              for (var s = 0; s < f.length; s++)
                f[s].dispose && f[s].dispose(c);
              this.animState.trackEntryPool.free(c);
              break;
            case t.complete:
              c.listener != null && c.listener.complete && c.listener.complete(c);
              for (var s = 0; s < f.length; s++)
                f[s].complete && f[s].complete(c);
              break;
            case t.event:
              var h = n[l++ + 2];
              c.listener != null && c.listener.event && c.listener.event(c, h);
              for (var s = 0; s < f.length; s++)
                f[s].event && f[s].event(c, h);
              break;
          }
        }
        this.clear(), this.drainDisabled = !1;
      }
    }, r.prototype.clear = function() {
      this.objects.length = 0;
    }, r;
  })();
  o.EventQueue = a;
  var t;
  (function(r) {
    r[r.start = 0] = "start", r[r.interrupt = 1] = "interrupt", r[r.end = 2] = "end", r[r.dispose = 3] = "dispose", r[r.complete = 4] = "complete", r[r.event = 5] = "event";
  })(t = o.EventType || (o.EventType = {}));
  var i = (function() {
    function r() {
    }
    return r.prototype.start = function(n) {
    }, r.prototype.interrupt = function(n) {
    }, r.prototype.end = function(n) {
    }, r.prototype.dispose = function(n) {
    }, r.prototype.complete = function(n) {
    }, r.prototype.event = function(n, f) {
    }, r;
  })();
  o.AnimationStateAdapter = i;
})(F || (F = {}));
var F;
(function(o) {
  var e = (function() {
    function p(a) {
      if (this.animationToMixTime = {}, this.defaultMix = 0, a == null)
        throw new Error("skeletonData cannot be null.");
      this.skeletonData = a;
    }
    return p.prototype.setMix = function(a, t, i) {
      var r = this.skeletonData.findAnimation(a);
      if (r == null)
        throw new Error("Animation not found: " + a);
      var n = this.skeletonData.findAnimation(t);
      if (n == null)
        throw new Error("Animation not found: " + t);
      this.setMixWith(r, n, i);
    }, p.prototype.setMixWith = function(a, t, i) {
      if (a == null)
        throw new Error("from cannot be null.");
      if (t == null)
        throw new Error("to cannot be null.");
      var r = a.name + "." + t.name;
      this.animationToMixTime[r] = i;
    }, p.prototype.getMix = function(a, t) {
      var i = a.name + "." + t.name, r = this.animationToMixTime[i];
      return r === void 0 ? this.defaultMix : r;
    }, p;
  })();
  o.AnimationStateData = e;
})(F || (F = {}));
var F;
(function(o) {
  var e = (function() {
    function p(a, t) {
      t === void 0 && (t = ""), this.assets = {}, this.errors = {}, this.toLoad = 0, this.loaded = 0, this.rawDataUris = {}, this.textureLoader = a, this.pathPrefix = t;
    }
    return p.prototype.downloadText = function(a, t, i) {
      var r = new XMLHttpRequest();
      r.overrideMimeType("text/html"), this.rawDataUris[a] && (a = this.rawDataUris[a]), r.open("GET", a, !0), r.onload = function() {
        r.status == 200 ? t(r.responseText) : i(r.status, r.responseText);
      }, r.onerror = function() {
        console.log("Error downloading: " + a), i(r.status, r.responseText);
      }, r.send();
    }, p.prototype.downloadBinary = function(a, t, i) {
      var r = new XMLHttpRequest();
      this.rawDataUris[a] && (a = this.rawDataUris[a]), r.open("GET", a, !0), r.responseType = "arraybuffer", r.onload = function() {
        r.status == 200 ? t(new Uint8Array(r.response)) : i(r.status, r.responseText);
      }, r.onerror = function() {
        i(r.status, r.responseText);
      }, r.send();
    }, p.prototype.setRawDataURI = function(a, t) {
      this.rawDataUris[this.pathPrefix + a] = t;
    }, p.prototype.loadBinary = function(a, t, i) {
      var r = this;
      t === void 0 && (t = null), i === void 0 && (i = null), a = this.pathPrefix + a, this.toLoad++, this.downloadBinary(a, function(n) {
        r.assets[a] = n, t && t(a, n), r.toLoad--, r.loaded++;
      }, function(n, f) {
        r.errors[a] = "Couldn't load binary " + a + ": status " + status + ", " + f, i && i(a, "Couldn't load binary " + a + ": status " + status + ", " + f), r.toLoad--, r.loaded++;
      });
    }, p.prototype.loadText = function(a, t, i) {
      var r = this;
      t === void 0 && (t = null), i === void 0 && (i = null), a = this.pathPrefix + a, this.toLoad++, this.downloadText(a, function(n) {
        r.assets[a] = n, t && t(a, n), r.toLoad--, r.loaded++;
      }, function(n, f) {
        r.errors[a] = "Couldn't load text " + a + ": status " + status + ", " + f, i && i(a, "Couldn't load text " + a + ": status " + status + ", " + f), r.toLoad--, r.loaded++;
      });
    }, p.prototype.loadTexture = function(a, t, i) {
      var r = this;
      t === void 0 && (t = null), i === void 0 && (i = null), a = this.pathPrefix + a;
      var n = a;
      this.toLoad++;
      var f = new Image();
      f.crossOrigin = "anonymous", f.onload = function(l) {
        var v = r.textureLoader(f);
        r.assets[n] = v, r.toLoad--, r.loaded++, t && t(a, f);
      }, f.onerror = function(l) {
        r.errors[a] = "Couldn't load image " + a, r.toLoad--, r.loaded++, i && i(a, "Couldn't load image " + a);
      }, this.rawDataUris[a] && (a = this.rawDataUris[a]), f.src = a;
    }, p.prototype.loadTextureAtlas = function(a, t, i) {
      var r = this;
      t === void 0 && (t = null), i === void 0 && (i = null);
      var n = a.lastIndexOf("/") >= 0 ? a.substring(0, a.lastIndexOf("/")) : "";
      a = this.pathPrefix + a, this.toLoad++, this.downloadText(a, function(f) {
        var l = { count: 0 }, v = new Array();
        try {
          var c = new o.TextureAtlas(f, function(C) {
            v.push(n == "" ? C : n + "/" + C);
            var S = document.createElement("img");
            return S.width = 16, S.height = 16, new o.FakeTexture(S);
          });
        } catch (C) {
          var s = C;
          r.errors[a] = "Couldn't load texture atlas " + a + ": " + s.message, i && i(a, "Couldn't load texture atlas " + a + ": " + s.message), r.toLoad--, r.loaded++;
          return;
        }
        for (var h = function(C) {
          var S = !1;
          r.loadTexture(C, function(L, E) {
            if (l.count++, l.count == v.length)
              if (S)
                r.errors[a] = "Couldn't load texture atlas page " + L + "} of atlas " + a, i && i(a, "Couldn't load texture atlas page " + L + " of atlas " + a), r.toLoad--, r.loaded++;
              else
                try {
                  var A = new o.TextureAtlas(f, function(m) {
                    return r.get(n == "" ? m : n + "/" + m);
                  });
                  r.assets[a] = A, t && t(a, A), r.toLoad--, r.loaded++;
                } catch (m) {
                  var g = m;
                  r.errors[a] = "Couldn't load texture atlas " + a + ": " + g.message, i && i(a, "Couldn't load texture atlas " + a + ": " + g.message), r.toLoad--, r.loaded++;
                }
          }, function(L, E) {
            S = !0, l.count++, l.count == v.length && (r.errors[a] = "Couldn't load texture atlas page " + L + "} of atlas " + a, i && i(a, "Couldn't load texture atlas page " + L + " of atlas " + a), r.toLoad--, r.loaded++);
          });
        }, d = 0, u = v; d < u.length; d++) {
          var M = u[d];
          h(M);
        }
      }, function(f, l) {
        r.errors[a] = "Couldn't load texture atlas " + a + ": status " + status + ", " + l, i && i(a, "Couldn't load texture atlas " + a + ": status " + status + ", " + l), r.toLoad--, r.loaded++;
      });
    }, p.prototype.get = function(a) {
      return a = this.pathPrefix + a, this.assets[a];
    }, p.prototype.remove = function(a) {
      a = this.pathPrefix + a;
      var t = this.assets[a];
      t.dispose && t.dispose(), this.assets[a] = null;
    }, p.prototype.removeAll = function() {
      for (var a in this.assets) {
        var t = this.assets[a];
        t.dispose && t.dispose();
      }
      this.assets = {};
    }, p.prototype.isLoadingComplete = function() {
      return this.toLoad == 0;
    }, p.prototype.getToLoad = function() {
      return this.toLoad;
    }, p.prototype.getLoaded = function() {
      return this.loaded;
    }, p.prototype.dispose = function() {
      this.removeAll();
    }, p.prototype.hasErrors = function() {
      return Object.keys(this.errors).length > 0;
    }, p.prototype.getErrors = function() {
      return this.errors;
    }, p;
  })();
  o.AssetManager = e;
})(F || (F = {}));
var F;
(function(o) {
  var e = (function() {
    function p(a) {
      this.atlas = a;
    }
    return p.prototype.newRegionAttachment = function(a, t, i) {
      var r = this.atlas.findRegion(i);
      if (r == null)
        throw new Error("Region not found in atlas: " + i + " (region attachment: " + t + ")");
      r.renderObject = r;
      var n = new o.RegionAttachment(t);
      return n.setRegion(r), n;
    }, p.prototype.newMeshAttachment = function(a, t, i) {
      var r = this.atlas.findRegion(i);
      if (r == null)
        throw new Error("Region not found in atlas: " + i + " (mesh attachment: " + t + ")");
      r.renderObject = r;
      var n = new o.MeshAttachment(t);
      return n.region = r, n;
    }, p.prototype.newBoundingBoxAttachment = function(a, t) {
      return new o.BoundingBoxAttachment(t);
    }, p.prototype.newPathAttachment = function(a, t) {
      return new o.PathAttachment(t);
    }, p.prototype.newPointAttachment = function(a, t) {
      return new o.PointAttachment(t);
    }, p.prototype.newClippingAttachment = function(a, t) {
      return new o.ClippingAttachment(t);
    }, p;
  })();
  o.AtlasAttachmentLoader = e;
})(F || (F = {}));
var F;
(function(o) {
  (function(e) {
    e[e.Normal = 0] = "Normal", e[e.Additive = 1] = "Additive", e[e.Multiply = 2] = "Multiply", e[e.Screen = 3] = "Screen";
  })(o.BlendMode || (o.BlendMode = {}));
})(F || (F = {}));
var F;
(function(o) {
  var e = (function() {
    function p(a, t, i) {
      if (this.children = new Array(), this.x = 0, this.y = 0, this.rotation = 0, this.scaleX = 0, this.scaleY = 0, this.shearX = 0, this.shearY = 0, this.ax = 0, this.ay = 0, this.arotation = 0, this.ascaleX = 0, this.ascaleY = 0, this.ashearX = 0, this.ashearY = 0, this.appliedValid = !1, this.a = 0, this.b = 0, this.c = 0, this.d = 0, this.worldY = 0, this.worldX = 0, this.sorted = !1, this.active = !1, a == null)
        throw new Error("data cannot be null.");
      if (t == null)
        throw new Error("skeleton cannot be null.");
      this.data = a, this.skeleton = t, this.parent = i, this.setToSetupPose();
    }
    return p.prototype.isActive = function() {
      return this.active;
    }, p.prototype.update = function() {
      this.updateWorldTransformWith(this.x, this.y, this.rotation, this.scaleX, this.scaleY, this.shearX, this.shearY);
    }, p.prototype.updateWorldTransform = function() {
      this.updateWorldTransformWith(this.x, this.y, this.rotation, this.scaleX, this.scaleY, this.shearX, this.shearY);
    }, p.prototype.updateWorldTransformWith = function(a, t, i, r, n, f, l) {
      this.ax = a, this.ay = t, this.arotation = i, this.ascaleX = r, this.ascaleY = n, this.ashearX = f, this.ashearY = l, this.appliedValid = !0;
      var v = this.parent;
      if (v == null) {
        var c = this.skeleton, s = i + 90 + l, h = c.scaleX, d = c.scaleY;
        this.a = o.MathUtils.cosDeg(i + f) * r * h, this.b = o.MathUtils.cosDeg(s) * n * h, this.c = o.MathUtils.sinDeg(i + f) * r * d, this.d = o.MathUtils.sinDeg(s) * n * d, this.worldX = a * h + c.x, this.worldY = t * d + c.y;
        return;
      }
      var u = v.a, M = v.b, C = v.c, S = v.d;
      switch (this.worldX = u * a + M * t + v.worldX, this.worldY = C * a + S * t + v.worldY, this.data.transformMode) {
        case o.TransformMode.Normal: {
          var s = i + 90 + l, L = o.MathUtils.cosDeg(i + f) * r, E = o.MathUtils.cosDeg(s) * n, A = o.MathUtils.sinDeg(i + f) * r, g = o.MathUtils.sinDeg(s) * n;
          this.a = u * L + M * A, this.b = u * E + M * g, this.c = C * L + S * A, this.d = C * E + S * g;
          return;
        }
        case o.TransformMode.OnlyTranslation: {
          var s = i + 90 + l;
          this.a = o.MathUtils.cosDeg(i + f) * r, this.b = o.MathUtils.cosDeg(s) * n, this.c = o.MathUtils.sinDeg(i + f) * r, this.d = o.MathUtils.sinDeg(s) * n;
          break;
        }
        case o.TransformMode.NoRotationOrReflection: {
          var m = u * u + C * C, x = 0;
          m > 1e-4 ? (m = Math.abs(u * S - M * C) / m, u /= this.skeleton.scaleX, C /= this.skeleton.scaleY, M = C * m, S = u * m, x = Math.atan2(C, u) * o.MathUtils.radDeg) : (u = 0, C = 0, x = 90 - Math.atan2(S, M) * o.MathUtils.radDeg);
          var P = i + f - x, k = i + l - x + 90, L = o.MathUtils.cosDeg(P) * r, E = o.MathUtils.cosDeg(k) * n, A = o.MathUtils.sinDeg(P) * r, g = o.MathUtils.sinDeg(k) * n;
          this.a = u * L - M * A, this.b = u * E - M * g, this.c = C * L + S * A, this.d = C * E + S * g;
          break;
        }
        case o.TransformMode.NoScale:
        case o.TransformMode.NoScaleOrReflection: {
          var O = o.MathUtils.cosDeg(i), R = o.MathUtils.sinDeg(i), D = (u * O + M * R) / this.skeleton.scaleX, N = (C * O + S * R) / this.skeleton.scaleY, m = Math.sqrt(D * D + N * N);
          m > 1e-5 && (m = 1 / m), D *= m, N *= m, m = Math.sqrt(D * D + N * N), this.data.transformMode == o.TransformMode.NoScale && u * S - M * C < 0 != (this.skeleton.scaleX < 0 != this.skeleton.scaleY < 0) && (m = -m);
          var I = Math.PI / 2 + Math.atan2(N, D), y = Math.cos(I) * m, T = Math.sin(I) * m, L = o.MathUtils.cosDeg(f) * r, E = o.MathUtils.cosDeg(90 + l) * n, A = o.MathUtils.sinDeg(f) * r, g = o.MathUtils.sinDeg(90 + l) * n;
          this.a = D * L + y * A, this.b = D * E + y * g, this.c = N * L + T * A, this.d = N * E + T * g;
          break;
        }
      }
      this.a *= this.skeleton.scaleX, this.b *= this.skeleton.scaleX, this.c *= this.skeleton.scaleY, this.d *= this.skeleton.scaleY;
    }, p.prototype.setToSetupPose = function() {
      var a = this.data;
      this.x = a.x, this.y = a.y, this.rotation = a.rotation, this.scaleX = a.scaleX, this.scaleY = a.scaleY, this.shearX = a.shearX, this.shearY = a.shearY;
    }, p.prototype.getWorldRotationX = function() {
      return Math.atan2(this.c, this.a) * o.MathUtils.radDeg;
    }, p.prototype.getWorldRotationY = function() {
      return Math.atan2(this.d, this.b) * o.MathUtils.radDeg;
    }, p.prototype.getWorldScaleX = function() {
      return Math.sqrt(this.a * this.a + this.c * this.c);
    }, p.prototype.getWorldScaleY = function() {
      return Math.sqrt(this.b * this.b + this.d * this.d);
    }, p.prototype.updateAppliedTransform = function() {
      this.appliedValid = !0;
      var a = this.parent;
      if (a == null) {
        this.ax = this.worldX, this.ay = this.worldY, this.arotation = Math.atan2(this.c, this.a) * o.MathUtils.radDeg, this.ascaleX = Math.sqrt(this.a * this.a + this.c * this.c), this.ascaleY = Math.sqrt(this.b * this.b + this.d * this.d), this.ashearX = 0, this.ashearY = Math.atan2(this.a * this.b + this.c * this.d, this.a * this.d - this.b * this.c) * o.MathUtils.radDeg;
        return;
      }
      var t = a.a, i = a.b, r = a.c, n = a.d, f = 1 / (t * n - i * r), l = this.worldX - a.worldX, v = this.worldY - a.worldY;
      this.ax = l * n * f - v * i * f, this.ay = v * t * f - l * r * f;
      var c = f * n, s = f * t, h = f * i, d = f * r, u = c * this.a - h * this.c, M = c * this.b - h * this.d, C = s * this.c - d * this.a, S = s * this.d - d * this.b;
      if (this.ashearX = 0, this.ascaleX = Math.sqrt(u * u + C * C), this.ascaleX > 1e-4) {
        var L = u * S - M * C;
        this.ascaleY = L / this.ascaleX, this.ashearY = Math.atan2(u * M + C * S, L) * o.MathUtils.radDeg, this.arotation = Math.atan2(C, u) * o.MathUtils.radDeg;
      } else
        this.ascaleX = 0, this.ascaleY = Math.sqrt(M * M + S * S), this.ashearY = 0, this.arotation = 90 - Math.atan2(S, M) * o.MathUtils.radDeg;
    }, p.prototype.worldToLocal = function(a) {
      var t = this.a, i = this.b, r = this.c, n = this.d, f = 1 / (t * n - i * r), l = a.x - this.worldX, v = a.y - this.worldY;
      return a.x = l * n * f - v * i * f, a.y = v * t * f - l * r * f, a;
    }, p.prototype.localToWorld = function(a) {
      var t = a.x, i = a.y;
      return a.x = t * this.a + i * this.b + this.worldX, a.y = t * this.c + i * this.d + this.worldY, a;
    }, p.prototype.worldToLocalRotation = function(a) {
      var t = o.MathUtils.sinDeg(a), i = o.MathUtils.cosDeg(a);
      return Math.atan2(this.a * t - this.c * i, this.d * i - this.b * t) * o.MathUtils.radDeg + this.rotation - this.shearX;
    }, p.prototype.localToWorldRotation = function(a) {
      a -= this.rotation - this.shearX;
      var t = o.MathUtils.sinDeg(a), i = o.MathUtils.cosDeg(a);
      return Math.atan2(i * this.c + t * this.d, i * this.a + t * this.b) * o.MathUtils.radDeg;
    }, p.prototype.rotateWorld = function(a) {
      var t = this.a, i = this.b, r = this.c, n = this.d, f = o.MathUtils.cosDeg(a), l = o.MathUtils.sinDeg(a);
      this.a = f * t - l * r, this.b = f * i - l * n, this.c = l * t + f * r, this.d = l * i + f * n, this.appliedValid = !1;
    }, p;
  })();
  o.Bone = e;
})(F || (F = {}));
var F;
(function(o) {
  var e = /* @__PURE__ */ (function() {
    function a(t, i, r) {
      if (this.x = 0, this.y = 0, this.rotation = 0, this.scaleX = 1, this.scaleY = 1, this.shearX = 0, this.shearY = 0, this.transformMode = p.Normal, this.skinRequired = !1, this.color = new o.Color(), t < 0)
        throw new Error("index must be >= 0.");
      if (i == null)
        throw new Error("name cannot be null.");
      this.index = t, this.name = i, this.parent = r;
    }
    return a;
  })();
  o.BoneData = e;
  var p;
  (function(a) {
    a[a.Normal = 0] = "Normal", a[a.OnlyTranslation = 1] = "OnlyTranslation", a[a.NoRotationOrReflection = 2] = "NoRotationOrReflection", a[a.NoScale = 3] = "NoScale", a[a.NoScaleOrReflection = 4] = "NoScaleOrReflection";
  })(p = o.TransformMode || (o.TransformMode = {}));
})(F || (F = {}));
var F;
(function(o) {
  var e = /* @__PURE__ */ (function() {
    function p(a, t, i) {
      this.name = a, this.order = t, this.skinRequired = i;
    }
    return p;
  })();
  o.ConstraintData = e;
})(F || (F = {}));
var F;
(function(o) {
  var e = /* @__PURE__ */ (function() {
    function p(a, t) {
      if (t == null)
        throw new Error("data cannot be null.");
      this.time = a, this.data = t;
    }
    return p;
  })();
  o.Event = e;
})(F || (F = {}));
var F;
(function(o) {
  var e = /* @__PURE__ */ (function() {
    function p(a) {
      this.name = a;
    }
    return p;
  })();
  o.EventData = e;
})(F || (F = {}));
var F;
(function(o) {
  var e = (function() {
    function p(a, t) {
      if (this.bendDirection = 0, this.compress = !1, this.stretch = !1, this.mix = 1, this.softness = 0, this.active = !1, a == null)
        throw new Error("data cannot be null.");
      if (t == null)
        throw new Error("skeleton cannot be null.");
      this.data = a, this.mix = a.mix, this.softness = a.softness, this.bendDirection = a.bendDirection, this.compress = a.compress, this.stretch = a.stretch, this.bones = new Array();
      for (var i = 0; i < a.bones.length; i++)
        this.bones.push(t.findBone(a.bones[i].name));
      this.target = t.findBone(a.target.name);
    }
    return p.prototype.isActive = function() {
      return this.active;
    }, p.prototype.apply = function() {
      this.update();
    }, p.prototype.update = function() {
      var a = this.target, t = this.bones;
      switch (t.length) {
        case 1:
          this.apply1(t[0], a.worldX, a.worldY, this.compress, this.stretch, this.data.uniform, this.mix);
          break;
        case 2:
          this.apply2(t[0], t[1], a.worldX, a.worldY, this.bendDirection, this.stretch, this.softness, this.mix);
          break;
      }
    }, p.prototype.apply1 = function(a, t, i, r, n, f, l) {
      a.appliedValid || a.updateAppliedTransform();
      var v = a.parent, c = v.a, s = v.b, h = v.c, d = v.d, u = -a.ashearX - a.arotation, M = 0, C = 0;
      switch (a.data.transformMode) {
        case o.TransformMode.OnlyTranslation:
          M = t - a.worldX, C = i - a.worldY;
          break;
        case o.TransformMode.NoRotationOrReflection:
          var S = Math.abs(c * d - s * h) / (c * c + h * h), L = c / a.skeleton.scaleX, E = h / a.skeleton.scaleY;
          s = -E * S * a.skeleton.scaleX, d = L * S * a.skeleton.scaleY, u += Math.atan2(E, L) * o.MathUtils.radDeg;
        default:
          var A = t - v.worldX, g = i - v.worldY, m = c * d - s * h;
          M = (A * d - g * s) / m - a.ax, C = (g * c - A * h) / m - a.ay;
      }
      u += Math.atan2(C, M) * o.MathUtils.radDeg, a.ascaleX < 0 && (u += 180), u > 180 ? u -= 360 : u < -180 && (u += 360);
      var x = a.ascaleX, P = a.ascaleY;
      if (r || n) {
        switch (a.data.transformMode) {
          case o.TransformMode.NoScale:
          case o.TransformMode.NoScaleOrReflection:
            M = t - a.worldX, C = i - a.worldY;
        }
        var k = a.data.length * x, O = Math.sqrt(M * M + C * C);
        if (r && O < k || n && O > k && k > 1e-4) {
          var S = (O / k - 1) * l + 1;
          x *= S, f && (P *= S);
        }
      }
      a.updateWorldTransformWith(a.ax, a.ay, a.arotation + u * l, x, P, a.ashearX, a.ashearY);
    }, p.prototype.apply2 = function(a, t, i, r, n, f, l, v) {
      if (v == 0) {
        t.updateWorldTransform();
        return;
      }
      a.appliedValid || a.updateAppliedTransform(), t.appliedValid || t.updateAppliedTransform();
      var c = a.ax, s = a.ay, h = a.ascaleX, d = h, u = a.ascaleY, M = t.ascaleX, C = 0, S = 0, L = 0;
      h < 0 ? (h = -h, C = 180, L = -1) : (C = 0, L = 1), u < 0 && (u = -u, L = -L), M < 0 ? (M = -M, S = 180) : S = 0;
      var E = t.ax, A = 0, g = 0, m = 0, x = a.a, P = a.b, k = a.c, O = a.d, R = Math.abs(h - u) <= 1e-4;
      R ? (A = t.ay, g = x * E + P * A + a.worldX, m = k * E + O * A + a.worldY) : (A = 0, g = x * E + a.worldX, m = k * E + a.worldY);
      var D = a.parent;
      x = D.a, P = D.b, k = D.c, O = D.d;
      var N = 1 / (x * O - P * k), I = g - D.worldX, y = m - D.worldY, T = (I * O - y * P) * N - c, B = (y * x - I * k) * N - s, V = Math.sqrt(T * T + B * B), G = t.data.length * M, Y, _;
      if (V < 1e-4) {
        this.apply1(a, i, r, !1, f, !1, v), t.updateWorldTransformWith(E, A, 0, t.ascaleX, t.ascaleY, t.ashearX, t.ashearY);
        return;
      }
      I = i - D.worldX, y = r - D.worldY;
      var X = (I * O - y * P) * N - c, W = (y * x - I * k) * N - s, U = X * X + W * W;
      if (l != 0) {
        l *= h * (M + 1) / 2;
        var w = Math.sqrt(U), Z = w - V - G * h + l;
        if (Z > 0) {
          var z = Math.min(1, Z / (l * 2)) - 1;
          z = (Z - l * (1 - z * z)) / w, X -= z * X, W -= z * W, U = X * X + W * W;
        }
      }
      t: if (R) {
        G *= h;
        var j = (U - V * V - G * G) / (2 * V * G);
        j < -1 ? j = -1 : j > 1 && (j = 1, f && (d *= (Math.sqrt(U) / (V + G) - 1) * v + 1)), _ = Math.acos(j) * n, x = V + G * j, P = G * Math.sin(_), Y = Math.atan2(W * x - X * P, X * x + W * P);
      } else {
        x = h * G, P = u * G;
        var H = x * x, q = P * P, K = Math.atan2(W, X);
        k = q * V * V + H * U - H * q;
        var J = -2 * q * V, at = q - H;
        if (O = J * J - 4 * at * k, O >= 0) {
          var nt = Math.sqrt(O);
          J < 0 && (nt = -nt), nt = -(J + nt) / 2;
          var lt = nt / at, ut = k / nt, st = Math.abs(lt) < Math.abs(ut) ? lt : ut;
          if (st * st <= U) {
            y = Math.sqrt(U - st * st) * n, Y = K - Math.atan2(y, st), _ = Math.atan2(y / u, (st - V) / h);
            break t;
          }
        }
        var ct = o.MathUtils.PI, ot = V - x, ht = ot * ot, rt = 0, xt = 0, mt = V + x, It = mt * mt, Ct = 0;
        k = -x * V / (H - q), k >= -1 && k <= 1 && (k = Math.acos(k), I = x * Math.cos(k) + V, y = P * Math.sin(k), O = I * I + y * y, O < ht && (ct = k, ht = O, ot = I, rt = y), O > It && (xt = k, It = O, mt = I, Ct = y)), U <= (ht + It) / 2 ? (Y = K - Math.atan2(rt * n, ot), _ = ct * n) : (Y = K - Math.atan2(Ct * n, mt), _ = xt * n);
      }
      var At = Math.atan2(A, E) * L, vt = a.arotation;
      Y = (Y - At) * o.MathUtils.radDeg + C - vt, Y > 180 ? Y -= 360 : Y < -180 && (Y += 360), a.updateWorldTransformWith(c, s, vt + Y * v, d, a.ascaleY, 0, 0), vt = t.arotation, _ = ((_ + At) * o.MathUtils.radDeg - t.ashearX) * L + S - vt, _ > 180 ? _ -= 360 : _ < -180 && (_ += 360), t.updateWorldTransformWith(E, A, vt + _ * v, t.ascaleX, t.ascaleY, t.ashearX, t.ashearY);
    }, p;
  })();
  o.IkConstraint = e;
})(F || (F = {}));
var F;
(function(o) {
  var e = (function(p) {
    Q(a, p);
    function a(t) {
      var i = p.call(this, t, 0, !1) || this;
      return i.bones = new Array(), i.bendDirection = 1, i.compress = !1, i.stretch = !1, i.uniform = !1, i.mix = 1, i.softness = 0, i;
    }
    return a;
  })(o.ConstraintData);
  o.IkConstraintData = e;
})(F || (F = {}));
var F;
(function(o) {
  var e = (function() {
    function p(a, t) {
      if (this.position = 0, this.spacing = 0, this.rotateMix = 0, this.translateMix = 0, this.spaces = new Array(), this.positions = new Array(), this.world = new Array(), this.curves = new Array(), this.lengths = new Array(), this.segments = new Array(), this.active = !1, a == null)
        throw new Error("data cannot be null.");
      if (t == null)
        throw new Error("skeleton cannot be null.");
      this.data = a, this.bones = new Array();
      for (var i = 0, r = a.bones.length; i < r; i++)
        this.bones.push(t.findBone(a.bones[i].name));
      this.target = t.findSlot(a.target.name), this.position = a.position, this.spacing = a.spacing, this.rotateMix = a.rotateMix, this.translateMix = a.translateMix;
    }
    return p.prototype.isActive = function() {
      return this.active;
    }, p.prototype.apply = function() {
      this.update();
    }, p.prototype.update = function() {
      var a = this.target.getAttachment();
      if (a instanceof o.PathAttachment) {
        var t = this.rotateMix, i = this.translateMix, r = i > 0, n = t > 0;
        if (!(!r && !n)) {
          var f = this.data, l = f.spacingMode == o.SpacingMode.Percent, v = f.rotateMode, c = v == o.RotateMode.Tangent, s = v == o.RotateMode.ChainScale, h = this.bones.length, d = c ? h : h + 1, u = this.bones, M = o.Utils.setArraySize(this.spaces, d), C = null, S = this.spacing;
          if (s || !l) {
            s && (C = o.Utils.setArraySize(this.lengths, h));
            for (var L = f.spacingMode == o.SpacingMode.Length, E = 0, A = d - 1; E < A; ) {
              var g = u[E], m = g.data.length;
              if (m < p.epsilon)
                s && (C[E] = 0), M[++E] = 0;
              else if (l) {
                if (s) {
                  var x = m * g.a, P = m * g.c, k = Math.sqrt(x * x + P * P);
                  C[E] = k;
                }
                M[++E] = S;
              } else {
                var x = m * g.a, P = m * g.c, O = Math.sqrt(x * x + P * P);
                s && (C[E] = O), M[++E] = (L ? m + S : S) * O / m;
              }
            }
          } else
            for (var E = 1; E < d; E++)
              M[E] = S;
          var R = this.computeWorldPositions(a, d, c, f.positionMode == o.PositionMode.Percent, l), D = R[0], N = R[1], I = f.offsetRotation, y = !1;
          if (I == 0)
            y = v == o.RotateMode.Chain;
          else {
            y = !1;
            var T = this.target.bone;
            I *= T.a * T.d - T.b * T.c > 0 ? o.MathUtils.degRad : -o.MathUtils.degRad;
          }
          for (var E = 0, T = 3; E < h; E++, T += 3) {
            var g = u[E];
            g.worldX += (D - g.worldX) * i, g.worldY += (N - g.worldY) * i;
            var x = R[T], P = R[T + 1], B = x - D, V = P - N;
            if (s) {
              var G = C[E];
              if (G != 0) {
                var Y = (Math.sqrt(B * B + V * V) / G - 1) * t + 1;
                g.a *= Y, g.c *= Y;
              }
            }
            if (D = x, N = P, n) {
              var _ = g.a, X = g.b, W = g.c, U = g.d, w = 0, Z = 0, z = 0;
              if (c ? w = R[T - 1] : M[E + 1] == 0 ? w = R[T + 2] : w = Math.atan2(V, B), w -= Math.atan2(W, _), y) {
                Z = Math.cos(w), z = Math.sin(w);
                var j = g.data.length;
                D += (j * (Z * _ - z * W) - B) * t, N += (j * (z * _ + Z * W) - V) * t;
              } else
                w += I;
              w > o.MathUtils.PI ? w -= o.MathUtils.PI2 : w < -o.MathUtils.PI && (w += o.MathUtils.PI2), w *= t, Z = Math.cos(w), z = Math.sin(w), g.a = Z * _ - z * W, g.b = Z * X - z * U, g.c = z * _ + Z * W, g.d = z * X + Z * U;
            }
            g.appliedValid = !1;
          }
        }
      }
    }, p.prototype.computeWorldPositions = function(a, t, i, r, n) {
      var f = this.target, l = this.position, v = this.spaces, c = o.Utils.setArraySize(this.positions, t * 3 + 2), s = null, h = a.closed, d = a.worldVerticesLength, u = d / 6, M = p.NONE;
      if (!a.constantSpeed) {
        var C = a.lengths;
        u -= h ? 1 : 2;
        var S = C[u];
        if (r && (l *= S), n)
          for (var L = 1; L < t; L++)
            v[L] *= S;
        s = o.Utils.setArraySize(this.world, 8);
        for (var L = 0, E = 0, A = 0; L < t; L++, E += 3) {
          var g = v[L];
          l += g;
          var m = l;
          if (h)
            m %= S, m < 0 && (m += S), A = 0;
          else if (m < 0) {
            M != p.BEFORE && (M = p.BEFORE, a.computeWorldVertices(f, 2, 4, s, 0, 2)), this.addBeforePosition(m, s, 0, c, E);
            continue;
          } else if (m > S) {
            M != p.AFTER && (M = p.AFTER, a.computeWorldVertices(f, d - 6, 4, s, 0, 2)), this.addAfterPosition(m - S, s, 0, c, E);
            continue;
          }
          for (; ; A++) {
            var x = C[A];
            if (!(m > x)) {
              if (A == 0)
                m /= x;
              else {
                var P = C[A - 1];
                m = (m - P) / (x - P);
              }
              break;
            }
          }
          A != M && (M = A, h && A == u ? (a.computeWorldVertices(f, d - 4, 4, s, 0, 2), a.computeWorldVertices(f, 0, 4, s, 4, 2)) : a.computeWorldVertices(f, A * 6 + 2, 8, s, 0, 2)), this.addCurvePosition(m, s[0], s[1], s[2], s[3], s[4], s[5], s[6], s[7], c, E, i || L > 0 && g == 0);
        }
        return c;
      }
      h ? (d += 2, s = o.Utils.setArraySize(this.world, d), a.computeWorldVertices(f, 2, d - 4, s, 0, 2), a.computeWorldVertices(f, 0, 2, s, d - 4, 2), s[d - 2] = s[0], s[d - 1] = s[1]) : (u--, d -= 4, s = o.Utils.setArraySize(this.world, d), a.computeWorldVertices(f, 2, d, s, 0, 2));
      for (var k = o.Utils.setArraySize(this.curves, u), O = 0, R = s[0], D = s[1], N = 0, I = 0, y = 0, T = 0, B = 0, V = 0, G = 0, Y = 0, _ = 0, X = 0, W = 0, U = 0, w = 0, Z = 0, L = 0, z = 2; L < u; L++, z += 6)
        N = s[z], I = s[z + 1], y = s[z + 2], T = s[z + 3], B = s[z + 4], V = s[z + 5], G = (R - N * 2 + y) * 0.1875, Y = (D - I * 2 + T) * 0.1875, _ = ((N - y) * 3 - R + B) * 0.09375, X = ((I - T) * 3 - D + V) * 0.09375, W = G * 2 + _, U = Y * 2 + X, w = (N - R) * 0.75 + G + _ * 0.16666667, Z = (I - D) * 0.75 + Y + X * 0.16666667, O += Math.sqrt(w * w + Z * Z), w += W, Z += U, W += _, U += X, O += Math.sqrt(w * w + Z * Z), w += W, Z += U, O += Math.sqrt(w * w + Z * Z), w += W + _, Z += U + X, O += Math.sqrt(w * w + Z * Z), k[L] = O, R = B, D = V;
      if (r ? l *= O : l *= O / a.lengths[u - 1], n)
        for (var L = 1; L < t; L++)
          v[L] *= O;
      for (var j = this.segments, H = 0, L = 0, E = 0, A = 0, q = 0; L < t; L++, E += 3) {
        var g = v[L];
        l += g;
        var m = l;
        if (h)
          m %= O, m < 0 && (m += O), A = 0;
        else if (m < 0) {
          this.addBeforePosition(m, s, 0, c, E);
          continue;
        } else if (m > O) {
          this.addAfterPosition(m - O, s, d - 4, c, E);
          continue;
        }
        for (; ; A++) {
          var K = k[A];
          if (!(m > K)) {
            if (A == 0)
              m /= K;
            else {
              var P = k[A - 1];
              m = (m - P) / (K - P);
            }
            break;
          }
        }
        if (A != M) {
          M = A;
          var J = A * 6;
          for (R = s[J], D = s[J + 1], N = s[J + 2], I = s[J + 3], y = s[J + 4], T = s[J + 5], B = s[J + 6], V = s[J + 7], G = (R - N * 2 + y) * 0.03, Y = (D - I * 2 + T) * 0.03, _ = ((N - y) * 3 - R + B) * 6e-3, X = ((I - T) * 3 - D + V) * 6e-3, W = G * 2 + _, U = Y * 2 + X, w = (N - R) * 0.3 + G + _ * 0.16666667, Z = (I - D) * 0.3 + Y + X * 0.16666667, H = Math.sqrt(w * w + Z * Z), j[0] = H, J = 1; J < 8; J++)
            w += W, Z += U, W += _, U += X, H += Math.sqrt(w * w + Z * Z), j[J] = H;
          w += W, Z += U, H += Math.sqrt(w * w + Z * Z), j[8] = H, w += W + _, Z += U + X, H += Math.sqrt(w * w + Z * Z), j[9] = H, q = 0;
        }
        for (m *= H; ; q++) {
          var at = j[q];
          if (!(m > at)) {
            if (q == 0)
              m /= at;
            else {
              var P = j[q - 1];
              m = q + (m - P) / (at - P);
            }
            break;
          }
        }
        this.addCurvePosition(m * 0.1, R, D, N, I, y, T, B, V, c, E, i || L > 0 && g == 0);
      }
      return c;
    }, p.prototype.addBeforePosition = function(a, t, i, r, n) {
      var f = t[i], l = t[i + 1], v = t[i + 2] - f, c = t[i + 3] - l, s = Math.atan2(c, v);
      r[n] = f + a * Math.cos(s), r[n + 1] = l + a * Math.sin(s), r[n + 2] = s;
    }, p.prototype.addAfterPosition = function(a, t, i, r, n) {
      var f = t[i + 2], l = t[i + 3], v = f - t[i], c = l - t[i + 1], s = Math.atan2(c, v);
      r[n] = f + a * Math.cos(s), r[n + 1] = l + a * Math.sin(s), r[n + 2] = s;
    }, p.prototype.addCurvePosition = function(a, t, i, r, n, f, l, v, c, s, h, d) {
      if (a == 0 || isNaN(a)) {
        s[h] = t, s[h + 1] = i, s[h + 2] = Math.atan2(n - i, r - t);
        return;
      }
      var u = a * a, M = u * a, C = 1 - a, S = C * C, L = S * C, E = C * a, A = E * 3, g = C * A, m = A * a, x = t * L + r * g + f * m + v * M, P = i * L + n * g + l * m + c * M;
      s[h] = x, s[h + 1] = P, d && (a < 1e-3 ? s[h + 2] = Math.atan2(n - i, r - t) : s[h + 2] = Math.atan2(P - (i * S + n * E * 2 + l * u), x - (t * S + r * E * 2 + f * u)));
    }, p.NONE = -1, p.BEFORE = -2, p.AFTER = -3, p.epsilon = 1e-5, p;
  })();
  o.PathConstraint = e;
})(F || (F = {}));
var F;
(function(o) {
  var e = (function(p) {
    Q(a, p);
    function a(t) {
      var i = p.call(this, t, 0, !1) || this;
      return i.bones = new Array(), i;
    }
    return a;
  })(o.ConstraintData);
  o.PathConstraintData = e, (function(p) {
    p[p.Fixed = 0] = "Fixed", p[p.Percent = 1] = "Percent";
  })(o.PositionMode || (o.PositionMode = {})), (function(p) {
    p[p.Length = 0] = "Length", p[p.Fixed = 1] = "Fixed", p[p.Percent = 2] = "Percent";
  })(o.SpacingMode || (o.SpacingMode = {})), (function(p) {
    p[p.Tangent = 0] = "Tangent", p[p.Chain = 1] = "Chain", p[p.ChainScale = 2] = "ChainScale";
  })(o.RotateMode || (o.RotateMode = {}));
})(F || (F = {}));
var F;
(function(o) {
  var e = (function() {
    function a(t) {
      this.toLoad = new Array(), this.assets = {}, this.clientId = t;
    }
    return a.prototype.loaded = function() {
      var t = 0;
      for (var i in this.assets)
        t++;
      return t;
    }, a;
  })(), p = (function() {
    function a(t) {
      t === void 0 && (t = ""), this.clientAssets = {}, this.queuedAssets = {}, this.rawAssets = {}, this.errors = {}, this.pathPrefix = t;
    }
    return a.prototype.queueAsset = function(t, i, r) {
      var n = this.clientAssets[t];
      return n == null && (n = new e(t), this.clientAssets[t] = n), i !== null && (n.textureLoader = i), n.toLoad.push(r), this.queuedAssets[r] === r ? !1 : (this.queuedAssets[r] = r, !0);
    }, a.prototype.loadText = function(t, i) {
      var r = this;
      if (i = this.pathPrefix + i, !!this.queueAsset(t, null, i)) {
        var n = new XMLHttpRequest();
        n.overrideMimeType("text/html"), n.onreadystatechange = function() {
          n.readyState == XMLHttpRequest.DONE && (n.status >= 200 && n.status < 300 ? r.rawAssets[i] = n.responseText : r.errors[i] = "Couldn't load text " + i + ": status " + n.status + ", " + n.responseText);
        }, n.open("GET", i, !0), n.send();
      }
    }, a.prototype.loadJson = function(t, i) {
      var r = this;
      if (i = this.pathPrefix + i, !!this.queueAsset(t, null, i)) {
        var n = new XMLHttpRequest();
        n.overrideMimeType("text/html"), n.onreadystatechange = function() {
          n.readyState == XMLHttpRequest.DONE && (n.status >= 200 && n.status < 300 ? r.rawAssets[i] = JSON.parse(n.responseText) : r.errors[i] = "Couldn't load text " + i + ": status " + n.status + ", " + n.responseText);
        }, n.open("GET", i, !0), n.send();
      }
    }, a.prototype.loadTexture = function(t, i, r) {
      var n = this;
      if (r = this.pathPrefix + r, !!this.queueAsset(t, i, r)) {
        var f = !!(typeof window < "u" && typeof navigator < "u" && window.document), l = !f && typeof importScripts < "u";
        if (l) {
          var v = { mode: "cors" };
          fetch(r, v).then(function(s) {
            return s.ok || (n.errors[r] = "Couldn't load image " + r), s.blob();
          }).then(function(s) {
            return createImageBitmap(s, {
              premultiplyAlpha: "none",
              colorSpaceConversion: "none"
            });
          }).then(function(s) {
            n.rawAssets[r] = s;
          });
        } else {
          var c = new Image();
          c.crossOrigin = "anonymous", c.onload = function(s) {
            n.rawAssets[r] = c;
          }, c.onerror = function(s) {
            n.errors[r] = "Couldn't load image " + r;
          }, c.src = r;
        }
      }
    }, a.prototype.get = function(t, i) {
      i = this.pathPrefix + i;
      var r = this.clientAssets[t];
      return r == null ? !0 : r.assets[i];
    }, a.prototype.updateClientAssets = function(t) {
      for (var i = !!(typeof window < "u" && typeof navigator < "u" && window.document), r = !i && typeof importScripts < "u", n = 0; n < t.toLoad.length; n++) {
        var f = t.toLoad[n], l = t.assets[f];
        if (l == null) {
          var v = this.rawAssets[f];
          if (v == null)
            continue;
          r ? v instanceof ImageBitmap ? t.assets[f] = t.textureLoader(v) : t.assets[f] = v : v instanceof HTMLImageElement ? t.assets[f] = t.textureLoader(v) : t.assets[f] = v;
        }
      }
    }, a.prototype.isLoadingComplete = function(t) {
      var i = this.clientAssets[t];
      return i == null ? !0 : (this.updateClientAssets(i), i.toLoad.length == i.loaded());
    }, a.prototype.dispose = function() {
    }, a.prototype.hasErrors = function() {
      return Object.keys(this.errors).length > 0;
    }, a.prototype.getErrors = function() {
      return this.errors;
    }, a;
  })();
  o.SharedAssetManager = p;
})(F || (F = {}));
var F;
(function(o) {
  var e = (function() {
    function p(a) {
      if (this._updateCache = new Array(), this.updateCacheReset = new Array(), this.time = 0, this.scaleX = 1, this.scaleY = 1, this.x = 0, this.y = 0, a == null)
        throw new Error("data cannot be null.");
      this.data = a, this.bones = new Array();
      for (var t = 0; t < a.bones.length; t++) {
        var i = a.bones[t], r = void 0;
        if (i.parent == null)
          r = new o.Bone(i, this, null);
        else {
          var n = this.bones[i.parent.index];
          r = new o.Bone(i, this, n), n.children.push(r);
        }
        this.bones.push(r);
      }
      this.slots = new Array(), this.drawOrder = new Array();
      for (var t = 0; t < a.slots.length; t++) {
        var f = a.slots[t], r = this.bones[f.boneData.index], l = new o.Slot(f, r);
        this.slots.push(l), this.drawOrder.push(l);
      }
      this.ikConstraints = new Array();
      for (var t = 0; t < a.ikConstraints.length; t++) {
        var v = a.ikConstraints[t];
        this.ikConstraints.push(new o.IkConstraint(v, this));
      }
      this.transformConstraints = new Array();
      for (var t = 0; t < a.transformConstraints.length; t++) {
        var c = a.transformConstraints[t];
        this.transformConstraints.push(new o.TransformConstraint(c, this));
      }
      this.pathConstraints = new Array();
      for (var t = 0; t < a.pathConstraints.length; t++) {
        var s = a.pathConstraints[t];
        this.pathConstraints.push(new o.PathConstraint(s, this));
      }
      this.color = new o.Color(1, 1, 1, 1), this.updateCache();
    }
    return p.prototype.updateCache = function() {
      var a = this._updateCache;
      a.length = 0, this.updateCacheReset.length = 0;
      for (var t = this.bones, i = 0, r = t.length; i < r; i++) {
        var n = t[i];
        n.sorted = n.data.skinRequired, n.active = !n.sorted;
      }
      if (this.skin != null)
        for (var f = this.skin.bones, i = 0, r = this.skin.bones.length; i < r; i++) {
          var n = this.bones[f[i].index];
          do
            n.sorted = !1, n.active = !0, n = n.parent;
          while (n != null);
        }
      var l = this.ikConstraints, v = this.transformConstraints, c = this.pathConstraints, s = l.length, h = v.length, d = c.length, u = s + h + d;
      t: for (var i = 0; i < u; i++) {
        for (var M = 0; M < s; M++) {
          var C = l[M];
          if (C.data.order == i) {
            this.sortIkConstraint(C);
            continue t;
          }
        }
        for (var M = 0; M < h; M++) {
          var C = v[M];
          if (C.data.order == i) {
            this.sortTransformConstraint(C);
            continue t;
          }
        }
        for (var M = 0; M < d; M++) {
          var C = c[M];
          if (C.data.order == i) {
            this.sortPathConstraint(C);
            continue t;
          }
        }
      }
      for (var i = 0, r = t.length; i < r; i++)
        this.sortBone(t[i]);
    }, p.prototype.sortIkConstraint = function(a) {
      if (a.active = a.target.isActive() && (!a.data.skinRequired || this.skin != null && o.Utils.contains(this.skin.constraints, a.data, !0)), !!a.active) {
        var t = a.target;
        this.sortBone(t);
        var i = a.bones, r = i[0];
        if (this.sortBone(r), i.length > 1) {
          var n = i[i.length - 1];
          this._updateCache.indexOf(n) > -1 || this.updateCacheReset.push(n);
        }
        this._updateCache.push(a), this.sortReset(r.children), i[i.length - 1].sorted = !0;
      }
    }, p.prototype.sortPathConstraint = function(a) {
      if (a.active = a.target.bone.isActive() && (!a.data.skinRequired || this.skin != null && o.Utils.contains(this.skin.constraints, a.data, !0)), !!a.active) {
        var t = a.target, i = t.data.index, r = t.bone;
        this.skin != null && this.sortPathConstraintAttachment(this.skin, i, r), this.data.defaultSkin != null && this.data.defaultSkin != this.skin && this.sortPathConstraintAttachment(this.data.defaultSkin, i, r);
        for (var n = 0, f = this.data.skins.length; n < f; n++)
          this.sortPathConstraintAttachment(this.data.skins[n], i, r);
        var l = t.getAttachment();
        l instanceof o.PathAttachment && this.sortPathConstraintAttachmentWith(l, r);
        for (var v = a.bones, c = v.length, n = 0; n < c; n++)
          this.sortBone(v[n]);
        this._updateCache.push(a);
        for (var n = 0; n < c; n++)
          this.sortReset(v[n].children);
        for (var n = 0; n < c; n++)
          v[n].sorted = !0;
      }
    }, p.prototype.sortTransformConstraint = function(a) {
      if (a.active = a.target.isActive() && (!a.data.skinRequired || this.skin != null && o.Utils.contains(this.skin.constraints, a.data, !0)), !!a.active) {
        this.sortBone(a.target);
        var t = a.bones, i = t.length;
        if (a.data.local)
          for (var r = 0; r < i; r++) {
            var n = t[r];
            this.sortBone(n.parent), this._updateCache.indexOf(n) > -1 || this.updateCacheReset.push(n);
          }
        else
          for (var r = 0; r < i; r++)
            this.sortBone(t[r]);
        this._updateCache.push(a);
        for (var f = 0; f < i; f++)
          this.sortReset(t[f].children);
        for (var f = 0; f < i; f++)
          t[f].sorted = !0;
      }
    }, p.prototype.sortPathConstraintAttachment = function(a, t, i) {
      var r = a.attachments[t];
      if (r)
        for (var n in r)
          this.sortPathConstraintAttachmentWith(r[n], i);
    }, p.prototype.sortPathConstraintAttachmentWith = function(a, t) {
      if (a instanceof o.PathAttachment) {
        var i = a.bones;
        if (i == null)
          this.sortBone(t);
        else
          for (var r = this.bones, n = 0; n < i.length; )
            for (var f = i[n++], l = n + f; n < l; n++) {
              var v = i[n];
              this.sortBone(r[v]);
            }
      }
    }, p.prototype.sortBone = function(a) {
      if (!a.sorted) {
        var t = a.parent;
        t != null && this.sortBone(t), a.sorted = !0, this._updateCache.push(a);
      }
    }, p.prototype.sortReset = function(a) {
      for (var t = 0, i = a.length; t < i; t++) {
        var r = a[t];
        r.active && (r.sorted && this.sortReset(r.children), r.sorted = !1);
      }
    }, p.prototype.updateWorldTransform = function() {
      for (var a = this.updateCacheReset, t = 0, i = a.length; t < i; t++) {
        var r = a[t];
        r.ax = r.x, r.ay = r.y, r.arotation = r.rotation, r.ascaleX = r.scaleX, r.ascaleY = r.scaleY, r.ashearX = r.shearX, r.ashearY = r.shearY, r.appliedValid = !0;
      }
      for (var n = this._updateCache, t = 0, i = n.length; t < i; t++)
        n[t].update();
    }, p.prototype.setToSetupPose = function() {
      this.setBonesToSetupPose(), this.setSlotsToSetupPose();
    }, p.prototype.setBonesToSetupPose = function() {
      for (var a = this.bones, t = 0, i = a.length; t < i; t++)
        a[t].setToSetupPose();
      for (var r = this.ikConstraints, t = 0, i = r.length; t < i; t++) {
        var n = r[t];
        n.mix = n.data.mix, n.softness = n.data.softness, n.bendDirection = n.data.bendDirection, n.compress = n.data.compress, n.stretch = n.data.stretch;
      }
      for (var f = this.transformConstraints, t = 0, i = f.length; t < i; t++) {
        var n = f[t], l = n.data;
        n.rotateMix = l.rotateMix, n.translateMix = l.translateMix, n.scaleMix = l.scaleMix, n.shearMix = l.shearMix;
      }
      for (var v = this.pathConstraints, t = 0, i = v.length; t < i; t++) {
        var n = v[t], l = n.data;
        n.position = l.position, n.spacing = l.spacing, n.rotateMix = l.rotateMix, n.translateMix = l.translateMix;
      }
    }, p.prototype.setSlotsToSetupPose = function() {
      var a = this.slots;
      o.Utils.arrayCopy(a, 0, this.drawOrder, 0, a.length);
      for (var t = 0, i = a.length; t < i; t++)
        a[t].setToSetupPose();
    }, p.prototype.getRootBone = function() {
      return this.bones.length == 0 ? null : this.bones[0];
    }, p.prototype.findBone = function(a) {
      if (a == null)
        throw new Error("boneName cannot be null.");
      for (var t = this.bones, i = 0, r = t.length; i < r; i++) {
        var n = t[i];
        if (n.data.name == a)
          return n;
      }
      return null;
    }, p.prototype.findBoneIndex = function(a) {
      if (a == null)
        throw new Error("boneName cannot be null.");
      for (var t = this.bones, i = 0, r = t.length; i < r; i++)
        if (t[i].data.name == a)
          return i;
      return -1;
    }, p.prototype.findSlot = function(a) {
      if (a == null)
        throw new Error("slotName cannot be null.");
      for (var t = this.slots, i = 0, r = t.length; i < r; i++) {
        var n = t[i];
        if (n.data.name == a)
          return n;
      }
      return null;
    }, p.prototype.findSlotIndex = function(a) {
      if (a == null)
        throw new Error("slotName cannot be null.");
      for (var t = this.slots, i = 0, r = t.length; i < r; i++)
        if (t[i].data.name == a)
          return i;
      return -1;
    }, p.prototype.setSkinByName = function(a) {
      var t = this.data.findSkin(a);
      if (t == null)
        throw new Error("Skin not found: " + a);
      this.setSkin(t);
    }, p.prototype.setSkin = function(a) {
      if (a != this.skin) {
        if (a != null)
          if (this.skin != null)
            a.attachAll(this, this.skin);
          else
            for (var t = this.slots, i = 0, r = t.length; i < r; i++) {
              var n = t[i], f = n.data.attachmentName;
              if (f != null) {
                var l = a.getAttachment(i, f);
                l != null && n.setAttachment(l);
              }
            }
        this.skin = a, this.updateCache();
      }
    }, p.prototype.getAttachmentByName = function(a, t) {
      return this.getAttachment(this.data.findSlotIndex(a), t);
    }, p.prototype.getAttachment = function(a, t) {
      if (t == null)
        throw new Error("attachmentName cannot be null.");
      if (this.skin != null) {
        var i = this.skin.getAttachment(a, t);
        if (i != null)
          return i;
      }
      return this.data.defaultSkin != null ? this.data.defaultSkin.getAttachment(a, t) : null;
    }, p.prototype.setAttachment = function(a, t) {
      if (a == null)
        throw new Error("slotName cannot be null.");
      for (var i = this.slots, r = 0, n = i.length; r < n; r++) {
        var f = i[r];
        if (f.data.name == a) {
          var l = null;
          if (t != null && (l = this.getAttachment(r, t), l == null))
            throw new Error("Attachment not found: " + t + ", for slot: " + a);
          f.setAttachment(l);
          return;
        }
      }
      throw new Error("Slot not found: " + a);
    }, p.prototype.findIkConstraint = function(a) {
      if (a == null)
        throw new Error("constraintName cannot be null.");
      for (var t = this.ikConstraints, i = 0, r = t.length; i < r; i++) {
        var n = t[i];
        if (n.data.name == a)
          return n;
      }
      return null;
    }, p.prototype.findTransformConstraint = function(a) {
      if (a == null)
        throw new Error("constraintName cannot be null.");
      for (var t = this.transformConstraints, i = 0, r = t.length; i < r; i++) {
        var n = t[i];
        if (n.data.name == a)
          return n;
      }
      return null;
    }, p.prototype.findPathConstraint = function(a) {
      if (a == null)
        throw new Error("constraintName cannot be null.");
      for (var t = this.pathConstraints, i = 0, r = t.length; i < r; i++) {
        var n = t[i];
        if (n.data.name == a)
          return n;
      }
      return null;
    }, p.prototype.getBounds = function(a, t, i) {
      if (i === void 0 && (i = new Array(2)), a == null)
        throw new Error("offset cannot be null.");
      if (t == null)
        throw new Error("size cannot be null.");
      for (var r = this.drawOrder, n = Number.POSITIVE_INFINITY, f = Number.POSITIVE_INFINITY, l = Number.NEGATIVE_INFINITY, v = Number.NEGATIVE_INFINITY, c = 0, s = r.length; c < s; c++) {
        var h = r[c];
        if (h.bone.active) {
          var d = 0, u = null, M = h.getAttachment();
          if (M instanceof o.RegionAttachment)
            d = 8, u = o.Utils.setArraySize(i, d, 0), M.computeWorldVertices(h.bone, u, 0, 2);
          else if (M instanceof o.MeshAttachment) {
            var C = M;
            d = C.worldVerticesLength, u = o.Utils.setArraySize(i, d, 0), C.computeWorldVertices(h, 0, d, u, 0, 2);
          }
          if (u != null)
            for (var S = 0, L = u.length; S < L; S += 2) {
              var E = u[S], A = u[S + 1];
              n = Math.min(n, E), f = Math.min(f, A), l = Math.max(l, E), v = Math.max(v, A);
            }
        }
      }
      a.set(n, f), t.set(l - n, v - f);
    }, p.prototype.update = function(a) {
      this.time += a;
    }, p;
  })();
  o.Skeleton = e;
})(F || (F = {}));
var F;
(function(o) {
  var e = (function() {
    function i(r) {
      this.scale = 1, this.linkedMeshes = new Array(), this.attachmentLoader = r;
    }
    return i.prototype.readSkeletonData = function(r) {
      var n = this.scale, f = new o.SkeletonData();
      f.name = "";
      var l = new p(r);
      if (f.hash = l.readString(), f.version = l.readString(), f.version == "3.8.75")
        throw new Error("Unsupported skeleton data, please export with a newer version of Spine.");
      f.x = l.readFloat(), f.y = l.readFloat(), f.width = l.readFloat(), f.height = l.readFloat();
      var v = l.readBoolean();
      v && (f.fps = l.readFloat(), f.imagesPath = l.readString(), f.audioPath = l.readString());
      var c = 0;
      c = l.readInt(!0);
      for (var s = 0; s < c; s++)
        l.strings.push(l.readString());
      c = l.readInt(!0);
      for (var s = 0; s < c; s++) {
        var h = l.readString(), d = s == 0 ? null : f.bones[l.readInt(!0)], u = new o.BoneData(s, h, d);
        u.rotation = l.readFloat(), u.x = l.readFloat() * n, u.y = l.readFloat() * n, u.scaleX = l.readFloat(), u.scaleY = l.readFloat(), u.shearX = l.readFloat(), u.shearY = l.readFloat(), u.length = l.readFloat() * n, u.transformMode = i.TransformModeValues[l.readInt(!0)], u.skinRequired = l.readBoolean(), v && o.Color.rgba8888ToColor(u.color, l.readInt32()), f.bones.push(u);
      }
      c = l.readInt(!0);
      for (var s = 0; s < c; s++) {
        var M = l.readString(), C = f.bones[l.readInt(!0)], u = new o.SlotData(s, M, C);
        o.Color.rgba8888ToColor(u.color, l.readInt32());
        var S = l.readInt32();
        S != -1 && o.Color.rgb888ToColor(u.darkColor = new o.Color(), S), u.attachmentName = l.readStringRef(), u.blendMode = i.BlendModeValues[l.readInt(!0)], f.slots.push(u);
      }
      c = l.readInt(!0);
      for (var s = 0, L = void 0; s < c; s++) {
        var u = new o.IkConstraintData(l.readString());
        u.order = l.readInt(!0), u.skinRequired = l.readBoolean(), L = l.readInt(!0);
        for (var E = 0; E < L; E++)
          u.bones.push(f.bones[l.readInt(!0)]);
        u.target = f.bones[l.readInt(!0)], u.mix = l.readFloat(), u.softness = l.readFloat() * n, u.bendDirection = l.readByte(), u.compress = l.readBoolean(), u.stretch = l.readBoolean(), u.uniform = l.readBoolean(), f.ikConstraints.push(u);
      }
      c = l.readInt(!0);
      for (var s = 0, L = void 0; s < c; s++) {
        var u = new o.TransformConstraintData(l.readString());
        u.order = l.readInt(!0), u.skinRequired = l.readBoolean(), L = l.readInt(!0);
        for (var E = 0; E < L; E++)
          u.bones.push(f.bones[l.readInt(!0)]);
        u.target = f.bones[l.readInt(!0)], u.local = l.readBoolean(), u.relative = l.readBoolean(), u.offsetRotation = l.readFloat(), u.offsetX = l.readFloat() * n, u.offsetY = l.readFloat() * n, u.offsetScaleX = l.readFloat(), u.offsetScaleY = l.readFloat(), u.offsetShearY = l.readFloat(), u.rotateMix = l.readFloat(), u.translateMix = l.readFloat(), u.scaleMix = l.readFloat(), u.shearMix = l.readFloat(), f.transformConstraints.push(u);
      }
      c = l.readInt(!0);
      for (var s = 0, L = void 0; s < c; s++) {
        var u = new o.PathConstraintData(l.readString());
        u.order = l.readInt(!0), u.skinRequired = l.readBoolean(), L = l.readInt(!0);
        for (var E = 0; E < L; E++)
          u.bones.push(f.bones[l.readInt(!0)]);
        u.target = f.slots[l.readInt(!0)], u.positionMode = i.PositionModeValues[l.readInt(!0)], u.spacingMode = i.SpacingModeValues[l.readInt(!0)], u.rotateMode = i.RotateModeValues[l.readInt(!0)], u.offsetRotation = l.readFloat(), u.position = l.readFloat(), u.positionMode == o.PositionMode.Fixed && (u.position *= n), u.spacing = l.readFloat(), (u.spacingMode == o.SpacingMode.Length || u.spacingMode == o.SpacingMode.Fixed) && (u.spacing *= n), u.rotateMix = l.readFloat(), u.translateMix = l.readFloat(), f.pathConstraints.push(u);
      }
      var A = this.readSkin(l, f, !0, v);
      A != null && (f.defaultSkin = A, f.skins.push(A));
      {
        var s = f.skins.length;
        for (o.Utils.setArraySize(f.skins, c = s + l.readInt(!0)); s < c; s++)
          f.skins[s] = this.readSkin(l, f, !1, v);
      }
      c = this.linkedMeshes.length;
      for (var s = 0; s < c; s++) {
        var g = this.linkedMeshes[s], m = g.skin == null ? f.defaultSkin : f.findSkin(g.skin);
        if (m == null)
          throw new Error("Skin not found: " + g.skin);
        var x = m.getAttachment(g.slotIndex, g.parent);
        if (x == null)
          throw new Error("Parent mesh not found: " + g.parent);
        g.mesh.deformAttachment = g.inheritDeform ? x : g.mesh, g.mesh.setParentMesh(x), g.mesh.updateUVs();
      }
      this.linkedMeshes.length = 0, c = l.readInt(!0);
      for (var s = 0; s < c; s++) {
        var u = new o.EventData(l.readStringRef());
        u.intValue = l.readInt(!1), u.floatValue = l.readFloat(), u.stringValue = l.readString(), u.audioPath = l.readString(), u.audioPath != null && (u.volume = l.readFloat(), u.balance = l.readFloat()), f.events.push(u);
      }
      c = l.readInt(!0);
      for (var s = 0; s < c; s++)
        f.animations.push(this.readAnimation(l, l.readString(), f));
      return f;
    }, i.prototype.readSkin = function(r, n, f, l) {
      var v = null, c = 0;
      if (f) {
        if (c = r.readInt(!0), c == 0)
          return null;
        v = new o.Skin("default");
      } else {
        v = new o.Skin(r.readStringRef()), v.bones.length = r.readInt(!0);
        for (var s = 0, h = v.bones.length; s < h; s++)
          v.bones[s] = n.bones[r.readInt(!0)];
        for (var s = 0, h = r.readInt(!0); s < h; s++)
          v.constraints.push(n.ikConstraints[r.readInt(!0)]);
        for (var s = 0, h = r.readInt(!0); s < h; s++)
          v.constraints.push(n.transformConstraints[r.readInt(!0)]);
        for (var s = 0, h = r.readInt(!0); s < h; s++)
          v.constraints.push(n.pathConstraints[r.readInt(!0)]);
        c = r.readInt(!0);
      }
      for (var s = 0; s < c; s++)
        for (var d = r.readInt(!0), u = 0, M = r.readInt(!0); u < M; u++) {
          var C = r.readStringRef(), S = this.readAttachment(r, n, v, d, C, l);
          S != null && v.setAttachment(d, C, S);
        }
      return v;
    }, i.prototype.readAttachment = function(r, n, f, l, v, c) {
      var s = this.scale, h = r.readStringRef();
      h == null && (h = v);
      var d = r.readByte(), u = i.AttachmentTypeValues[d];
      switch (u) {
        case o.AttachmentType.Region: {
          var M = r.readStringRef(), C = r.readFloat(), S = r.readFloat(), L = r.readFloat(), E = r.readFloat(), A = r.readFloat(), g = r.readFloat(), m = r.readFloat(), x = r.readInt32();
          M == null && (M = h);
          var P = this.attachmentLoader.newRegionAttachment(f, h, M);
          return P == null ? null : (P.path = M, P.x = S * s, P.y = L * s, P.scaleX = E, P.scaleY = A, P.rotation = C, P.width = g * s, P.height = m * s, o.Color.rgba8888ToColor(P.color, x), P.updateOffset(), P);
        }
        case o.AttachmentType.BoundingBox: {
          var k = r.readInt(!0), O = this.readVertices(r, k), x = c ? r.readInt32() : 0, R = this.attachmentLoader.newBoundingBoxAttachment(f, h);
          return R == null ? null : (R.worldVerticesLength = k << 1, R.vertices = O.vertices, R.bones = O.bones, c && o.Color.rgba8888ToColor(R.color, x), R);
        }
        case o.AttachmentType.Mesh: {
          var M = r.readStringRef(), x = r.readInt32(), k = r.readInt(!0), D = this.readFloatArray(r, k << 1, 1), N = this.readShortArray(r), O = this.readVertices(r, k), I = r.readInt(!0), y = null, g = 0, m = 0;
          c && (y = this.readShortArray(r), g = r.readFloat(), m = r.readFloat()), M == null && (M = h);
          var T = this.attachmentLoader.newMeshAttachment(f, h, M);
          return T == null ? null : (T.path = M, o.Color.rgba8888ToColor(T.color, x), T.bones = O.bones, T.vertices = O.vertices, T.worldVerticesLength = k << 1, T.triangles = N, T.regionUVs = D, T.updateUVs(), T.hullLength = I << 1, c && (T.edges = y, T.width = g * s, T.height = m * s), T);
        }
        case o.AttachmentType.LinkedMesh: {
          var M = r.readStringRef(), x = r.readInt32(), B = r.readStringRef(), V = r.readStringRef(), G = r.readBoolean(), g = 0, m = 0;
          c && (g = r.readFloat(), m = r.readFloat()), M == null && (M = h);
          var T = this.attachmentLoader.newMeshAttachment(f, h, M);
          return T == null ? null : (T.path = M, o.Color.rgba8888ToColor(T.color, x), c && (T.width = g * s, T.height = m * s), this.linkedMeshes.push(new a(T, B, l, V, G)), T);
        }
        case o.AttachmentType.Path: {
          for (var Y = r.readBoolean(), _ = r.readBoolean(), k = r.readInt(!0), O = this.readVertices(r, k), X = o.Utils.newArray(k / 3, 0), W = 0, U = X.length; W < U; W++)
            X[W] = r.readFloat() * s;
          var x = c ? r.readInt32() : 0, M = this.attachmentLoader.newPathAttachment(f, h);
          return M == null ? null : (M.closed = Y, M.constantSpeed = _, M.worldVerticesLength = k << 1, M.vertices = O.vertices, M.bones = O.bones, M.lengths = X, c && o.Color.rgba8888ToColor(M.color, x), M);
        }
        case o.AttachmentType.Point: {
          var C = r.readFloat(), S = r.readFloat(), L = r.readFloat(), x = c ? r.readInt32() : 0, w = this.attachmentLoader.newPointAttachment(f, h);
          return w == null ? null : (w.x = S * s, w.y = L * s, w.rotation = C, c && o.Color.rgba8888ToColor(w.color, x), w);
        }
        case o.AttachmentType.Clipping: {
          var Z = r.readInt(!0), k = r.readInt(!0), O = this.readVertices(r, k), x = c ? r.readInt32() : 0, z = this.attachmentLoader.newClippingAttachment(f, h);
          return z == null ? null : (z.endSlot = n.slots[Z], z.worldVerticesLength = k << 1, z.vertices = O.vertices, z.bones = O.bones, c && o.Color.rgba8888ToColor(z.color, x), z);
        }
      }
      return null;
    }, i.prototype.readVertices = function(r, n) {
      var f = n << 1, l = new t(), v = this.scale;
      if (!r.readBoolean())
        return l.vertices = this.readFloatArray(r, f, v), l;
      for (var c = new Array(), s = new Array(), h = 0; h < n; h++) {
        var d = r.readInt(!0);
        s.push(d);
        for (var u = 0; u < d; u++)
          s.push(r.readInt(!0)), c.push(r.readFloat() * v), c.push(r.readFloat() * v), c.push(r.readFloat());
      }
      return l.vertices = o.Utils.toFloatArray(c), l.bones = s, l;
    }, i.prototype.readFloatArray = function(r, n, f) {
      var l = new Array(n);
      if (f == 1)
        for (var v = 0; v < n; v++)
          l[v] = r.readFloat();
      else
        for (var v = 0; v < n; v++)
          l[v] = r.readFloat() * f;
      return l;
    }, i.prototype.readShortArray = function(r) {
      for (var n = r.readInt(!0), f = new Array(n), l = 0; l < n; l++)
        f[l] = r.readShort();
      return f;
    }, i.prototype.readAnimation = function(r, n, f) {
      for (var l = new Array(), v = this.scale, c = 0, s = new o.Color(), h = new o.Color(), d = 0, u = r.readInt(!0); d < u; d++)
        for (var M = r.readInt(!0), C = 0, S = r.readInt(!0); C < S; C++) {
          var L = r.readByte(), E = r.readInt(!0);
          switch (L) {
            case i.SLOT_ATTACHMENT: {
              var A = new o.AttachmentTimeline(E);
              A.slotIndex = M;
              for (var g = 0; g < E; g++)
                A.setFrame(g, r.readFloat(), r.readStringRef());
              l.push(A), c = Math.max(c, A.frames[E - 1]);
              break;
            }
            case i.SLOT_COLOR: {
              var A = new o.ColorTimeline(E);
              A.slotIndex = M;
              for (var g = 0; g < E; g++) {
                var m = r.readFloat();
                o.Color.rgba8888ToColor(s, r.readInt32()), A.setFrame(g, m, s.r, s.g, s.b, s.a), g < E - 1 && this.readCurve(r, g, A);
              }
              l.push(A), c = Math.max(c, A.frames[(E - 1) * o.ColorTimeline.ENTRIES]);
              break;
            }
            case i.SLOT_TWO_COLOR: {
              var A = new o.TwoColorTimeline(E);
              A.slotIndex = M;
              for (var g = 0; g < E; g++) {
                var m = r.readFloat();
                o.Color.rgba8888ToColor(s, r.readInt32()), o.Color.rgb888ToColor(h, r.readInt32()), A.setFrame(g, m, s.r, s.g, s.b, s.a, h.r, h.g, h.b), g < E - 1 && this.readCurve(r, g, A);
              }
              l.push(A), c = Math.max(c, A.frames[(E - 1) * o.TwoColorTimeline.ENTRIES]);
              break;
            }
          }
        }
      for (var d = 0, u = r.readInt(!0); d < u; d++)
        for (var x = r.readInt(!0), C = 0, S = r.readInt(!0); C < S; C++) {
          var L = r.readByte(), E = r.readInt(!0);
          switch (L) {
            case i.BONE_ROTATE: {
              var A = new o.RotateTimeline(E);
              A.boneIndex = x;
              for (var g = 0; g < E; g++)
                A.setFrame(g, r.readFloat(), r.readFloat()), g < E - 1 && this.readCurve(r, g, A);
              l.push(A), c = Math.max(c, A.frames[(E - 1) * o.RotateTimeline.ENTRIES]);
              break;
            }
            case i.BONE_TRANSLATE:
            case i.BONE_SCALE:
            case i.BONE_SHEAR: {
              var A = void 0, P = 1;
              L == i.BONE_SCALE ? A = new o.ScaleTimeline(E) : L == i.BONE_SHEAR ? A = new o.ShearTimeline(E) : (A = new o.TranslateTimeline(E), P = v), A.boneIndex = x;
              for (var g = 0; g < E; g++)
                A.setFrame(g, r.readFloat(), r.readFloat() * P, r.readFloat() * P), g < E - 1 && this.readCurve(r, g, A);
              l.push(A), c = Math.max(c, A.frames[(E - 1) * o.TranslateTimeline.ENTRIES]);
              break;
            }
          }
        }
      for (var d = 0, u = r.readInt(!0); d < u; d++) {
        var k = r.readInt(!0), E = r.readInt(!0), A = new o.IkConstraintTimeline(E);
        A.ikConstraintIndex = k;
        for (var g = 0; g < E; g++)
          A.setFrame(g, r.readFloat(), r.readFloat(), r.readFloat() * v, r.readByte(), r.readBoolean(), r.readBoolean()), g < E - 1 && this.readCurve(r, g, A);
        l.push(A), c = Math.max(c, A.frames[(E - 1) * o.IkConstraintTimeline.ENTRIES]);
      }
      for (var d = 0, u = r.readInt(!0); d < u; d++) {
        var k = r.readInt(!0), E = r.readInt(!0), A = new o.TransformConstraintTimeline(E);
        A.transformConstraintIndex = k;
        for (var g = 0; g < E; g++)
          A.setFrame(g, r.readFloat(), r.readFloat(), r.readFloat(), r.readFloat(), r.readFloat()), g < E - 1 && this.readCurve(r, g, A);
        l.push(A), c = Math.max(c, A.frames[(E - 1) * o.TransformConstraintTimeline.ENTRIES]);
      }
      for (var d = 0, u = r.readInt(!0); d < u; d++)
        for (var k = r.readInt(!0), O = f.pathConstraints[k], C = 0, S = r.readInt(!0); C < S; C++) {
          var L = r.readByte(), E = r.readInt(!0);
          switch (L) {
            case i.PATH_POSITION:
            case i.PATH_SPACING: {
              var A = void 0, P = 1;
              L == i.PATH_SPACING ? (A = new o.PathConstraintSpacingTimeline(E), (O.spacingMode == o.SpacingMode.Length || O.spacingMode == o.SpacingMode.Fixed) && (P = v)) : (A = new o.PathConstraintPositionTimeline(E), O.positionMode == o.PositionMode.Fixed && (P = v)), A.pathConstraintIndex = k;
              for (var g = 0; g < E; g++)
                A.setFrame(g, r.readFloat(), r.readFloat() * P), g < E - 1 && this.readCurve(r, g, A);
              l.push(A), c = Math.max(c, A.frames[(E - 1) * o.PathConstraintPositionTimeline.ENTRIES]);
              break;
            }
            case i.PATH_MIX: {
              var A = new o.PathConstraintMixTimeline(E);
              A.pathConstraintIndex = k;
              for (var g = 0; g < E; g++)
                A.setFrame(g, r.readFloat(), r.readFloat(), r.readFloat()), g < E - 1 && this.readCurve(r, g, A);
              l.push(A), c = Math.max(c, A.frames[(E - 1) * o.PathConstraintMixTimeline.ENTRIES]);
              break;
            }
          }
        }
      for (var d = 0, u = r.readInt(!0); d < u; d++)
        for (var R = f.skins[r.readInt(!0)], C = 0, S = r.readInt(!0); C < S; C++)
          for (var M = r.readInt(!0), D = 0, N = r.readInt(!0); D < N; D++) {
            var I = R.getAttachment(M, r.readStringRef()), y = I.bones != null, T = I.vertices, B = y ? T.length / 3 * 2 : T.length, E = r.readInt(!0), A = new o.DeformTimeline(E);
            A.slotIndex = M, A.attachment = I;
            for (var g = 0; g < E; g++) {
              var m = r.readFloat(), V = void 0, G = r.readInt(!0);
              if (G == 0)
                V = y ? o.Utils.newFloatArray(B) : T;
              else {
                V = o.Utils.newFloatArray(B);
                var Y = r.readInt(!0);
                if (G += Y, v == 1)
                  for (var _ = Y; _ < G; _++)
                    V[_] = r.readFloat();
                else
                  for (var _ = Y; _ < G; _++)
                    V[_] = r.readFloat() * v;
                if (!y)
                  for (var _ = 0, X = V.length; _ < X; _++)
                    V[_] += T[_];
              }
              A.setFrame(g, m, V), g < E - 1 && this.readCurve(r, g, A);
            }
            l.push(A), c = Math.max(c, A.frames[E - 1]);
          }
      var W = r.readInt(!0);
      if (W > 0) {
        for (var A = new o.DrawOrderTimeline(W), U = f.slots.length, d = 0; d < W; d++) {
          for (var m = r.readFloat(), w = r.readInt(!0), Z = o.Utils.newArray(U, 0), C = U - 1; C >= 0; C--)
            Z[C] = -1;
          for (var z = o.Utils.newArray(U - w, 0), j = 0, H = 0, C = 0; C < w; C++) {
            for (var M = r.readInt(!0); j != M; )
              z[H++] = j++;
            Z[j + r.readInt(!0)] = j++;
          }
          for (; j < U; )
            z[H++] = j++;
          for (var C = U - 1; C >= 0; C--)
            Z[C] == -1 && (Z[C] = z[--H]);
          A.setFrame(d, m, Z);
        }
        l.push(A), c = Math.max(c, A.frames[W - 1]);
      }
      var q = r.readInt(!0);
      if (q > 0) {
        for (var A = new o.EventTimeline(q), d = 0; d < q; d++) {
          var m = r.readFloat(), K = f.events[r.readInt(!0)], J = new o.Event(m, K);
          J.intValue = r.readInt(!1), J.floatValue = r.readFloat(), J.stringValue = r.readBoolean() ? r.readString() : K.stringValue, J.data.audioPath != null && (J.volume = r.readFloat(), J.balance = r.readFloat()), A.setFrame(d, J);
        }
        l.push(A), c = Math.max(c, A.frames[q - 1]);
      }
      return new o.Animation(n, l, c);
    }, i.prototype.readCurve = function(r, n, f) {
      switch (r.readByte()) {
        case i.CURVE_STEPPED:
          f.setStepped(n);
          break;
        case i.CURVE_BEZIER:
          this.setCurve(f, n, r.readFloat(), r.readFloat(), r.readFloat(), r.readFloat());
          break;
      }
    }, i.prototype.setCurve = function(r, n, f, l, v, c) {
      r.setCurve(n, f, l, v, c);
    }, i.AttachmentTypeValues = [0, 1, 2, 3, 4, 5, 6], i.TransformModeValues = [o.TransformMode.Normal, o.TransformMode.OnlyTranslation, o.TransformMode.NoRotationOrReflection, o.TransformMode.NoScale, o.TransformMode.NoScaleOrReflection], i.PositionModeValues = [o.PositionMode.Fixed, o.PositionMode.Percent], i.SpacingModeValues = [o.SpacingMode.Length, o.SpacingMode.Fixed, o.SpacingMode.Percent], i.RotateModeValues = [o.RotateMode.Tangent, o.RotateMode.Chain, o.RotateMode.ChainScale], i.BlendModeValues = [o.BlendMode.Normal, o.BlendMode.Additive, o.BlendMode.Multiply, o.BlendMode.Screen], i.BONE_ROTATE = 0, i.BONE_TRANSLATE = 1, i.BONE_SCALE = 2, i.BONE_SHEAR = 3, i.SLOT_ATTACHMENT = 0, i.SLOT_COLOR = 1, i.SLOT_TWO_COLOR = 2, i.PATH_POSITION = 0, i.PATH_SPACING = 1, i.PATH_MIX = 2, i.CURVE_LINEAR = 0, i.CURVE_STEPPED = 1, i.CURVE_BEZIER = 2, i;
  })();
  o.SkeletonBinary = e;
  var p = (function() {
    function i(r, n, f, l) {
      n === void 0 && (n = new Array()), f === void 0 && (f = 0), l === void 0 && (l = new DataView(r.buffer)), this.strings = n, this.index = f, this.buffer = l;
    }
    return i.prototype.readByte = function() {
      return this.buffer.getInt8(this.index++);
    }, i.prototype.readShort = function() {
      var r = this.buffer.getInt16(this.index);
      return this.index += 2, r;
    }, i.prototype.readInt32 = function() {
      var r = this.buffer.getInt32(this.index);
      return this.index += 4, r;
    }, i.prototype.readInt = function(r) {
      var n = this.readByte(), f = n & 127;
      return (n & 128) != 0 && (n = this.readByte(), f |= (n & 127) << 7, (n & 128) != 0 && (n = this.readByte(), f |= (n & 127) << 14, (n & 128) != 0 && (n = this.readByte(), f |= (n & 127) << 21, (n & 128) != 0 && (n = this.readByte(), f |= (n & 127) << 28)))), r ? f : f >>> 1 ^ -(f & 1);
    }, i.prototype.readStringRef = function() {
      var r = this.readInt(!0);
      return r == 0 ? null : this.strings[r - 1];
    }, i.prototype.readString = function() {
      var r = this.readInt(!0);
      switch (r) {
        case 0:
          return null;
        case 1:
          return "";
      }
      r--;
      for (var n = "", f = 0; f < r; ) {
        var l = this.readByte();
        switch (l >> 4) {
          case 12:
          case 13:
            n += String.fromCharCode((l & 31) << 6 | this.readByte() & 63), f += 2;
            break;
          case 14:
            n += String.fromCharCode((l & 15) << 12 | (this.readByte() & 63) << 6 | this.readByte() & 63), f += 3;
            break;
          default:
            n += String.fromCharCode(l), f++;
        }
      }
      return n;
    }, i.prototype.readFloat = function() {
      var r = this.buffer.getFloat32(this.index);
      return this.index += 4, r;
    }, i.prototype.readBoolean = function() {
      return this.readByte() != 0;
    }, i;
  })(), a = /* @__PURE__ */ (function() {
    function i(r, n, f, l, v) {
      this.mesh = r, this.skin = n, this.slotIndex = f, this.parent = l, this.inheritDeform = v;
    }
    return i;
  })(), t = /* @__PURE__ */ (function() {
    function i(r, n) {
      r === void 0 && (r = null), n === void 0 && (n = null), this.bones = r, this.vertices = n;
    }
    return i;
  })();
})(F || (F = {}));
var F;
(function(o) {
  var e = (function() {
    function p() {
      this.minX = 0, this.minY = 0, this.maxX = 0, this.maxY = 0, this.boundingBoxes = new Array(), this.polygons = new Array(), this.polygonPool = new o.Pool(function() {
        return o.Utils.newFloatArray(16);
      });
    }
    return p.prototype.update = function(a, t) {
      if (a == null)
        throw new Error("skeleton cannot be null.");
      var i = this.boundingBoxes, r = this.polygons, n = this.polygonPool, f = a.slots, l = f.length;
      i.length = 0, n.freeAll(r), r.length = 0;
      for (var v = 0; v < l; v++) {
        var c = f[v];
        if (c.bone.active) {
          var s = c.getAttachment();
          if (s instanceof o.BoundingBoxAttachment) {
            var h = s;
            i.push(h);
            var d = n.obtain();
            d.length != h.worldVerticesLength && (d = o.Utils.newFloatArray(h.worldVerticesLength)), r.push(d), h.computeWorldVertices(c, 0, h.worldVerticesLength, d, 0, 2);
          }
        }
      }
      t ? this.aabbCompute() : (this.minX = Number.POSITIVE_INFINITY, this.minY = Number.POSITIVE_INFINITY, this.maxX = Number.NEGATIVE_INFINITY, this.maxY = Number.NEGATIVE_INFINITY);
    }, p.prototype.aabbCompute = function() {
      for (var a = Number.POSITIVE_INFINITY, t = Number.POSITIVE_INFINITY, i = Number.NEGATIVE_INFINITY, r = Number.NEGATIVE_INFINITY, n = this.polygons, f = 0, l = n.length; f < l; f++)
        for (var v = n[f], c = v, s = 0, h = v.length; s < h; s += 2) {
          var d = c[s], u = c[s + 1];
          a = Math.min(a, d), t = Math.min(t, u), i = Math.max(i, d), r = Math.max(r, u);
        }
      this.minX = a, this.minY = t, this.maxX = i, this.maxY = r;
    }, p.prototype.aabbContainsPoint = function(a, t) {
      return a >= this.minX && a <= this.maxX && t >= this.minY && t <= this.maxY;
    }, p.prototype.aabbIntersectsSegment = function(a, t, i, r) {
      var n = this.minX, f = this.minY, l = this.maxX, v = this.maxY;
      if (a <= n && i <= n || t <= f && r <= f || a >= l && i >= l || t >= v && r >= v)
        return !1;
      var c = (r - t) / (i - a), s = c * (n - a) + t;
      if (s > f && s < v || (s = c * (l - a) + t, s > f && s < v))
        return !0;
      var h = (f - t) / c + a;
      return h > n && h < l || (h = (v - t) / c + a, h > n && h < l);
    }, p.prototype.aabbIntersectsSkeleton = function(a) {
      return this.minX < a.maxX && this.maxX > a.minX && this.minY < a.maxY && this.maxY > a.minY;
    }, p.prototype.containsPoint = function(a, t) {
      for (var i = this.polygons, r = 0, n = i.length; r < n; r++)
        if (this.containsPointPolygon(i[r], a, t))
          return this.boundingBoxes[r];
      return null;
    }, p.prototype.containsPointPolygon = function(a, t, i) {
      for (var r = a, n = a.length, f = n - 2, l = !1, v = 0; v < n; v += 2) {
        var c = r[v + 1], s = r[f + 1];
        if (c < i && s >= i || s < i && c >= i) {
          var h = r[v];
          h + (i - c) / (s - c) * (r[f] - h) < t && (l = !l);
        }
        f = v;
      }
      return l;
    }, p.prototype.intersectsSegment = function(a, t, i, r) {
      for (var n = this.polygons, f = 0, l = n.length; f < l; f++)
        if (this.intersectsSegmentPolygon(n[f], a, t, i, r))
          return this.boundingBoxes[f];
      return null;
    }, p.prototype.intersectsSegmentPolygon = function(a, t, i, r, n) {
      for (var f = a, l = a.length, v = t - r, c = i - n, s = t * n - i * r, h = f[l - 2], d = f[l - 1], u = 0; u < l; u += 2) {
        var M = f[u], C = f[u + 1], S = h * C - d * M, L = h - M, E = d - C, A = v * E - c * L, g = (s * L - v * S) / A;
        if ((g >= h && g <= M || g >= M && g <= h) && (g >= t && g <= r || g >= r && g <= t)) {
          var m = (s * E - c * S) / A;
          if ((m >= d && m <= C || m >= C && m <= d) && (m >= i && m <= n || m >= n && m <= i))
            return !0;
        }
        h = M, d = C;
      }
      return !1;
    }, p.prototype.getPolygon = function(a) {
      if (a == null)
        throw new Error("boundingBox cannot be null.");
      var t = this.boundingBoxes.indexOf(a);
      return t == -1 ? null : this.polygons[t];
    }, p.prototype.getWidth = function() {
      return this.maxX - this.minX;
    }, p.prototype.getHeight = function() {
      return this.maxY - this.minY;
    }, p;
  })();
  o.SkeletonBounds = e;
})(F || (F = {}));
var F;
(function(o) {
  var e = (function() {
    function p() {
      this.triangulator = new o.Triangulator(), this.clippingPolygon = new Array(), this.clipOutput = new Array(), this.clippedVertices = new Array(), this.clippedTriangles = new Array(), this.scratch = new Array();
    }
    return p.prototype.clipStart = function(a, t) {
      if (this.clipAttachment != null)
        return 0;
      this.clipAttachment = t;
      var i = t.worldVerticesLength, r = o.Utils.setArraySize(this.clippingPolygon, i);
      t.computeWorldVertices(a, 0, i, r, 0, 2);
      var n = this.clippingPolygon;
      p.makeClockwise(n);
      for (var f = this.clippingPolygons = this.triangulator.decompose(n, this.triangulator.triangulate(n)), l = 0, v = f.length; l < v; l++) {
        var c = f[l];
        p.makeClockwise(c), c.push(c[0]), c.push(c[1]);
      }
      return f.length;
    }, p.prototype.clipEndWithSlot = function(a) {
      this.clipAttachment != null && this.clipAttachment.endSlot == a.data && this.clipEnd();
    }, p.prototype.clipEnd = function() {
      this.clipAttachment != null && (this.clipAttachment = null, this.clippingPolygons = null, this.clippedVertices.length = 0, this.clippedTriangles.length = 0, this.clippingPolygon.length = 0);
    }, p.prototype.isClipping = function() {
      return this.clipAttachment != null;
    }, p.prototype.clipTriangles = function(a, t, i, r, n, f, l, v) {
      var c = this.clipOutput, s = this.clippedVertices, h = this.clippedTriangles, d = this.clippingPolygons, u = this.clippingPolygons.length, M = v ? 12 : 8, C = 0;
      s.length = 0, h.length = 0;
      t: for (var S = 0; S < r; S += 3) {
        var L = i[S] << 1, E = a[L], A = a[L + 1], g = n[L], m = n[L + 1];
        L = i[S + 1] << 1;
        var x = a[L], P = a[L + 1], k = n[L], O = n[L + 1];
        L = i[S + 2] << 1;
        for (var R = a[L], D = a[L + 1], N = n[L], I = n[L + 1], y = 0; y < u; y++) {
          var T = s.length;
          if (this.clip(E, A, x, P, R, D, d[y], c)) {
            var B = c.length;
            if (B == 0)
              continue;
            for (var V = P - D, G = R - x, Y = E - R, _ = D - A, X = 1 / (V * Y + G * (A - D)), W = B >> 1, U = this.clipOutput, w = o.Utils.setArraySize(s, T + W * M), Z = 0; Z < B; Z += 2) {
              var z = U[Z], j = U[Z + 1];
              w[T] = z, w[T + 1] = j, w[T + 2] = f.r, w[T + 3] = f.g, w[T + 4] = f.b, w[T + 5] = f.a;
              var H = z - R, q = j - D, K = (V * H + G * q) * X, J = (_ * H + Y * q) * X, at = 1 - K - J;
              w[T + 6] = g * K + k * J + N * at, w[T + 7] = m * K + O * J + I * at, v && (w[T + 8] = l.r, w[T + 9] = l.g, w[T + 10] = l.b, w[T + 11] = l.a), T += M;
            }
            T = h.length;
            var nt = o.Utils.setArraySize(h, T + 3 * (W - 2));
            W--;
            for (var Z = 1; Z < W; Z++)
              nt[T] = C, nt[T + 1] = C + Z, nt[T + 2] = C + Z + 1, T += 3;
            C += W + 1;
          } else {
            var w = o.Utils.setArraySize(s, T + 3 * M);
            w[T] = E, w[T + 1] = A, w[T + 2] = f.r, w[T + 3] = f.g, w[T + 4] = f.b, w[T + 5] = f.a, v ? (w[T + 6] = g, w[T + 7] = m, w[T + 8] = l.r, w[T + 9] = l.g, w[T + 10] = l.b, w[T + 11] = l.a, w[T + 12] = x, w[T + 13] = P, w[T + 14] = f.r, w[T + 15] = f.g, w[T + 16] = f.b, w[T + 17] = f.a, w[T + 18] = k, w[T + 19] = O, w[T + 20] = l.r, w[T + 21] = l.g, w[T + 22] = l.b, w[T + 23] = l.a, w[T + 24] = R, w[T + 25] = D, w[T + 26] = f.r, w[T + 27] = f.g, w[T + 28] = f.b, w[T + 29] = f.a, w[T + 30] = N, w[T + 31] = I, w[T + 32] = l.r, w[T + 33] = l.g, w[T + 34] = l.b, w[T + 35] = l.a) : (w[T + 6] = g, w[T + 7] = m, w[T + 8] = x, w[T + 9] = P, w[T + 10] = f.r, w[T + 11] = f.g, w[T + 12] = f.b, w[T + 13] = f.a, w[T + 14] = k, w[T + 15] = O, w[T + 16] = R, w[T + 17] = D, w[T + 18] = f.r, w[T + 19] = f.g, w[T + 20] = f.b, w[T + 21] = f.a, w[T + 22] = N, w[T + 23] = I), T = h.length;
            var nt = o.Utils.setArraySize(h, T + 3);
            nt[T] = C, nt[T + 1] = C + 1, nt[T + 2] = C + 2, C += 3;
            continue t;
          }
        }
      }
    }, p.prototype.clip = function(a, t, i, r, n, f, l, v) {
      var c = v, s = !1, h = null;
      l.length % 4 >= 2 ? (h = v, v = this.scratch) : h = this.scratch, h.length = 0, h.push(a), h.push(t), h.push(i), h.push(r), h.push(n), h.push(f), h.push(a), h.push(t), v.length = 0;
      for (var d = l, u = l.length - 4, M = 0; ; M += 2) {
        for (var C = d[M], S = d[M + 1], L = d[M + 2], E = d[M + 3], A = C - L, g = S - E, m = h, x = h.length - 2, P = v.length, k = 0; k < x; k += 2) {
          var O = m[k], R = m[k + 1], D = m[k + 2], N = m[k + 3], I = A * (N - E) - g * (D - L) > 0;
          if (A * (R - E) - g * (O - L) > 0) {
            if (I) {
              v.push(D), v.push(N);
              continue;
            }
            var y = N - R, T = D - O, B = y * (L - C) - T * (E - S);
            if (Math.abs(B) > 1e-6) {
              var V = (T * (S - R) - y * (C - O)) / B;
              v.push(C + (L - C) * V), v.push(S + (E - S) * V);
            } else
              v.push(C), v.push(S);
          } else if (I) {
            var y = N - R, T = D - O, B = y * (L - C) - T * (E - S);
            if (Math.abs(B) > 1e-6) {
              var V = (T * (S - R) - y * (C - O)) / B;
              v.push(C + (L - C) * V), v.push(S + (E - S) * V);
            } else
              v.push(C), v.push(S);
            v.push(D), v.push(N);
          }
          s = !0;
        }
        if (P == v.length)
          return c.length = 0, !0;
        if (v.push(v[0]), v.push(v[1]), M == u)
          break;
        var G = v;
        v = h, v.length = 0, h = G;
      }
      if (c != v) {
        c.length = 0;
        for (var M = 0, Y = v.length - 2; M < Y; M++)
          c[M] = v[M];
      } else
        c.length = c.length - 2;
      return s;
    }, p.makeClockwise = function(a) {
      for (var t = a, i = a.length, r = t[i - 2] * t[1] - t[0] * t[i - 1], n = 0, f = 0, l = 0, v = 0, c = 0, s = i - 3; c < s; c += 2)
        n = t[c], f = t[c + 1], l = t[c + 2], v = t[c + 3], r += n * v - l * f;
      if (!(r < 0))
        for (var c = 0, h = i - 2, s = i >> 1; c < s; c += 2) {
          var d = t[c], u = t[c + 1], M = h - c;
          t[c] = t[M], t[c + 1] = t[M + 1], t[M] = d, t[M + 1] = u;
        }
    }, p;
  })();
  o.SkeletonClipping = e;
})(F || (F = {}));
var F;
(function(o) {
  var e = (function() {
    function p() {
      this.bones = new Array(), this.slots = new Array(), this.skins = new Array(), this.events = new Array(), this.animations = new Array(), this.ikConstraints = new Array(), this.transformConstraints = new Array(), this.pathConstraints = new Array(), this.fps = 0;
    }
    return p.prototype.findBone = function(a) {
      if (a == null)
        throw new Error("boneName cannot be null.");
      for (var t = this.bones, i = 0, r = t.length; i < r; i++) {
        var n = t[i];
        if (n.name == a)
          return n;
      }
      return null;
    }, p.prototype.findBoneIndex = function(a) {
      if (a == null)
        throw new Error("boneName cannot be null.");
      for (var t = this.bones, i = 0, r = t.length; i < r; i++)
        if (t[i].name == a)
          return i;
      return -1;
    }, p.prototype.findSlot = function(a) {
      if (a == null)
        throw new Error("slotName cannot be null.");
      for (var t = this.slots, i = 0, r = t.length; i < r; i++) {
        var n = t[i];
        if (n.name == a)
          return n;
      }
      return null;
    }, p.prototype.findSlotIndex = function(a) {
      if (a == null)
        throw new Error("slotName cannot be null.");
      for (var t = this.slots, i = 0, r = t.length; i < r; i++)
        if (t[i].name == a)
          return i;
      return -1;
    }, p.prototype.findSkin = function(a) {
      if (a == null)
        throw new Error("skinName cannot be null.");
      for (var t = this.skins, i = 0, r = t.length; i < r; i++) {
        var n = t[i];
        if (n.name == a)
          return n;
      }
      return null;
    }, p.prototype.findEvent = function(a) {
      if (a == null)
        throw new Error("eventDataName cannot be null.");
      for (var t = this.events, i = 0, r = t.length; i < r; i++) {
        var n = t[i];
        if (n.name == a)
          return n;
      }
      return null;
    }, p.prototype.findAnimation = function(a) {
      if (a == null)
        throw new Error("animationName cannot be null.");
      for (var t = this.animations, i = 0, r = t.length; i < r; i++) {
        var n = t[i];
        if (n.name == a)
          return n;
      }
      return null;
    }, p.prototype.findIkConstraint = function(a) {
      if (a == null)
        throw new Error("constraintName cannot be null.");
      for (var t = this.ikConstraints, i = 0, r = t.length; i < r; i++) {
        var n = t[i];
        if (n.name == a)
          return n;
      }
      return null;
    }, p.prototype.findTransformConstraint = function(a) {
      if (a == null)
        throw new Error("constraintName cannot be null.");
      for (var t = this.transformConstraints, i = 0, r = t.length; i < r; i++) {
        var n = t[i];
        if (n.name == a)
          return n;
      }
      return null;
    }, p.prototype.findPathConstraint = function(a) {
      if (a == null)
        throw new Error("constraintName cannot be null.");
      for (var t = this.pathConstraints, i = 0, r = t.length; i < r; i++) {
        var n = t[i];
        if (n.name == a)
          return n;
      }
      return null;
    }, p.prototype.findPathConstraintIndex = function(a) {
      if (a == null)
        throw new Error("pathConstraintName cannot be null.");
      for (var t = this.pathConstraints, i = 0, r = t.length; i < r; i++)
        if (t[i].name == a)
          return i;
      return -1;
    }, p;
  })();
  o.SkeletonData = e;
})(F || (F = {}));
var F;
(function(o) {
  var e = (function() {
    function a(t) {
      this.scale = 1, this.linkedMeshes = new Array(), this.attachmentLoader = t;
    }
    return a.prototype.readSkeletonData = function(t) {
      var i = this.scale, r = new o.SkeletonData(), n = typeof t == "string" ? JSON.parse(t) : t, f = n.skeleton;
      if (f != null) {
        if (r.hash = f.hash, r.version = f.spine, r.version == "3.8.75")
          throw new Error("Unsupported skeleton data, please export with a newer version of Spine.");
        r.x = f.x, r.y = f.y, r.width = f.width, r.height = f.height, r.fps = f.fps, r.imagesPath = f.images;
      }
      if (n.bones)
        for (var l = 0; l < n.bones.length; l++) {
          var v = n.bones[l], c = null, s = this.getValue(v, "parent", null);
          if (s != null && (c = r.findBone(s), c == null))
            throw new Error("Parent bone not found: " + s);
          var h = new o.BoneData(r.bones.length, v.name, c);
          h.length = this.getValue(v, "length", 0) * i, h.x = this.getValue(v, "x", 0) * i, h.y = this.getValue(v, "y", 0) * i, h.rotation = this.getValue(v, "rotation", 0), h.scaleX = this.getValue(v, "scaleX", 1), h.scaleY = this.getValue(v, "scaleY", 1), h.shearX = this.getValue(v, "shearX", 0), h.shearY = this.getValue(v, "shearY", 0), h.transformMode = a.transformModeFromString(this.getValue(v, "transform", "normal")), h.skinRequired = this.getValue(v, "skin", !1), r.bones.push(h);
        }
      if (n.slots)
        for (var l = 0; l < n.slots.length; l++) {
          var d = n.slots[l], u = d.name, M = d.bone, C = r.findBone(M);
          if (C == null)
            throw new Error("Slot bone not found: " + M);
          var h = new o.SlotData(r.slots.length, u, C), S = this.getValue(d, "color", null);
          S != null && h.color.setFromString(S);
          var L = this.getValue(d, "dark", null);
          L != null && (h.darkColor = new o.Color(1, 1, 1, 1), h.darkColor.setFromString(L)), h.attachmentName = this.getValue(d, "attachment", null), h.blendMode = a.blendModeFromString(this.getValue(d, "blend", "normal")), r.slots.push(h);
        }
      if (n.ik)
        for (var l = 0; l < n.ik.length; l++) {
          var E = n.ik[l], h = new o.IkConstraintData(E.name);
          h.order = this.getValue(E, "order", 0), h.skinRequired = this.getValue(E, "skin", !1);
          for (var A = 0; A < E.bones.length; A++) {
            var M = E.bones[A], g = r.findBone(M);
            if (g == null)
              throw new Error("IK bone not found: " + M);
            h.bones.push(g);
          }
          var m = E.target;
          if (h.target = r.findBone(m), h.target == null)
            throw new Error("IK target bone not found: " + m);
          h.mix = this.getValue(E, "mix", 1), h.softness = this.getValue(E, "softness", 0) * i, h.bendDirection = this.getValue(E, "bendPositive", !0) ? 1 : -1, h.compress = this.getValue(E, "compress", !1), h.stretch = this.getValue(E, "stretch", !1), h.uniform = this.getValue(E, "uniform", !1), r.ikConstraints.push(h);
        }
      if (n.transform)
        for (var l = 0; l < n.transform.length; l++) {
          var E = n.transform[l], h = new o.TransformConstraintData(E.name);
          h.order = this.getValue(E, "order", 0), h.skinRequired = this.getValue(E, "skin", !1);
          for (var A = 0; A < E.bones.length; A++) {
            var M = E.bones[A], g = r.findBone(M);
            if (g == null)
              throw new Error("Transform constraint bone not found: " + M);
            h.bones.push(g);
          }
          var m = E.target;
          if (h.target = r.findBone(m), h.target == null)
            throw new Error("Transform constraint target bone not found: " + m);
          h.local = this.getValue(E, "local", !1), h.relative = this.getValue(E, "relative", !1), h.offsetRotation = this.getValue(E, "rotation", 0), h.offsetX = this.getValue(E, "x", 0) * i, h.offsetY = this.getValue(E, "y", 0) * i, h.offsetScaleX = this.getValue(E, "scaleX", 0), h.offsetScaleY = this.getValue(E, "scaleY", 0), h.offsetShearY = this.getValue(E, "shearY", 0), h.rotateMix = this.getValue(E, "rotateMix", 1), h.translateMix = this.getValue(E, "translateMix", 1), h.scaleMix = this.getValue(E, "scaleMix", 1), h.shearMix = this.getValue(E, "shearMix", 1), r.transformConstraints.push(h);
        }
      if (n.path)
        for (var l = 0; l < n.path.length; l++) {
          var E = n.path[l], h = new o.PathConstraintData(E.name);
          h.order = this.getValue(E, "order", 0), h.skinRequired = this.getValue(E, "skin", !1);
          for (var A = 0; A < E.bones.length; A++) {
            var M = E.bones[A], g = r.findBone(M);
            if (g == null)
              throw new Error("Transform constraint bone not found: " + M);
            h.bones.push(g);
          }
          var m = E.target;
          if (h.target = r.findSlot(m), h.target == null)
            throw new Error("Path target slot not found: " + m);
          h.positionMode = a.positionModeFromString(this.getValue(E, "positionMode", "percent")), h.spacingMode = a.spacingModeFromString(this.getValue(E, "spacingMode", "length")), h.rotateMode = a.rotateModeFromString(this.getValue(E, "rotateMode", "tangent")), h.offsetRotation = this.getValue(E, "rotation", 0), h.position = this.getValue(E, "position", 0), h.positionMode == o.PositionMode.Fixed && (h.position *= i), h.spacing = this.getValue(E, "spacing", 0), (h.spacingMode == o.SpacingMode.Length || h.spacingMode == o.SpacingMode.Fixed) && (h.spacing *= i), h.rotateMix = this.getValue(E, "rotateMix", 1), h.translateMix = this.getValue(E, "translateMix", 1), r.pathConstraints.push(h);
        }
      if (n.skins)
        for (var l = 0; l < n.skins.length; l++) {
          var x = n.skins[l], P = new o.Skin(x.name);
          if (x.bones)
            for (var k = 0; k < x.bones.length; k++) {
              var g = r.findBone(x.bones[k]);
              if (g == null)
                throw new Error("Skin bone not found: " + x.bones[l]);
              P.bones.push(g);
            }
          if (x.ik)
            for (var k = 0; k < x.ik.length; k++) {
              var O = r.findIkConstraint(x.ik[k]);
              if (O == null)
                throw new Error("Skin IK constraint not found: " + x.ik[l]);
              P.constraints.push(O);
            }
          if (x.transform)
            for (var k = 0; k < x.transform.length; k++) {
              var O = r.findTransformConstraint(x.transform[k]);
              if (O == null)
                throw new Error("Skin transform constraint not found: " + x.transform[l]);
              P.constraints.push(O);
            }
          if (x.path)
            for (var k = 0; k < x.path.length; k++) {
              var O = r.findPathConstraint(x.path[k]);
              if (O == null)
                throw new Error("Skin path constraint not found: " + x.path[l]);
              P.constraints.push(O);
            }
          for (var u in x.attachments) {
            var R = r.findSlot(u);
            if (R == null)
              throw new Error("Slot not found: " + u);
            var d = x.attachments[u];
            for (var D in d) {
              var N = this.readAttachment(d[D], P, R.index, D, r);
              N != null && P.setAttachment(R.index, D, N);
            }
          }
          r.skins.push(P), P.name == "default" && (r.defaultSkin = P);
        }
      for (var l = 0, I = this.linkedMeshes.length; l < I; l++) {
        var y = this.linkedMeshes[l], P = y.skin == null ? r.defaultSkin : r.findSkin(y.skin);
        if (P == null)
          throw new Error("Skin not found: " + y.skin);
        var T = P.getAttachment(y.slotIndex, y.parent);
        if (T == null)
          throw new Error("Parent mesh not found: " + y.parent);
        y.mesh.deformAttachment = y.inheritDeform ? T : y.mesh, y.mesh.setParentMesh(T), y.mesh.updateUVs();
      }
      if (this.linkedMeshes.length = 0, n.events)
        for (var B in n.events) {
          var V = n.events[B], h = new o.EventData(B);
          h.intValue = this.getValue(V, "int", 0), h.floatValue = this.getValue(V, "float", 0), h.stringValue = this.getValue(V, "string", ""), h.audioPath = this.getValue(V, "audio", null), h.audioPath != null && (h.volume = this.getValue(V, "volume", 1), h.balance = this.getValue(V, "balance", 0)), r.events.push(h);
        }
      if (n.animations)
        for (var G in n.animations) {
          var Y = n.animations[G];
          this.readAnimation(Y, G, r);
        }
      return r;
    }, a.prototype.readAttachment = function(t, i, r, n, f) {
      var l = this.scale;
      n = this.getValue(t, "name", n);
      var v = this.getValue(t, "type", "region");
      switch (v) {
        case "region": {
          var c = this.getValue(t, "path", n), s = this.attachmentLoader.newRegionAttachment(i, n, c);
          if (s == null)
            return null;
          s.path = c, s.x = this.getValue(t, "x", 0) * l, s.y = this.getValue(t, "y", 0) * l, s.scaleX = this.getValue(t, "scaleX", 1), s.scaleY = this.getValue(t, "scaleY", 1), s.rotation = this.getValue(t, "rotation", 0), s.width = t.width * l, s.height = t.height * l;
          var h = this.getValue(t, "color", null);
          return h != null && s.color.setFromString(h), s.updateOffset(), s;
        }
        case "boundingbox": {
          var d = this.attachmentLoader.newBoundingBoxAttachment(i, n);
          if (d == null)
            return null;
          this.readVertices(t, d, t.vertexCount << 1);
          var h = this.getValue(t, "color", null);
          return h != null && d.color.setFromString(h), d;
        }
        case "mesh":
        case "linkedmesh": {
          var c = this.getValue(t, "path", n), u = this.attachmentLoader.newMeshAttachment(i, n, c);
          if (u == null)
            return null;
          u.path = c;
          var h = this.getValue(t, "color", null);
          h != null && u.color.setFromString(h), u.width = this.getValue(t, "width", 0) * l, u.height = this.getValue(t, "height", 0) * l;
          var M = this.getValue(t, "parent", null);
          if (M != null)
            return this.linkedMeshes.push(new p(u, this.getValue(t, "skin", null), r, M, this.getValue(t, "deform", !0))), u;
          var C = t.uvs;
          return this.readVertices(t, u, C.length), u.triangles = t.triangles, u.regionUVs = C, u.updateUVs(), u.edges = this.getValue(t, "edges", null), u.hullLength = this.getValue(t, "hull", 0) * 2, u;
        }
        case "path": {
          var c = this.attachmentLoader.newPathAttachment(i, n);
          if (c == null)
            return null;
          c.closed = this.getValue(t, "closed", !1), c.constantSpeed = this.getValue(t, "constantSpeed", !0);
          var S = t.vertexCount;
          this.readVertices(t, c, S << 1);
          for (var L = o.Utils.newArray(S / 3, 0), E = 0; E < t.lengths.length; E++)
            L[E] = t.lengths[E] * l;
          c.lengths = L;
          var h = this.getValue(t, "color", null);
          return h != null && c.color.setFromString(h), c;
        }
        case "point": {
          var A = this.attachmentLoader.newPointAttachment(i, n);
          if (A == null)
            return null;
          A.x = this.getValue(t, "x", 0) * l, A.y = this.getValue(t, "y", 0) * l, A.rotation = this.getValue(t, "rotation", 0);
          var h = this.getValue(t, "color", null);
          return h != null && A.color.setFromString(h), A;
        }
        case "clipping": {
          var g = this.attachmentLoader.newClippingAttachment(i, n);
          if (g == null)
            return null;
          var m = this.getValue(t, "end", null);
          if (m != null) {
            var x = f.findSlot(m);
            if (x == null)
              throw new Error("Clipping end slot not found: " + m);
            g.endSlot = x;
          }
          var S = t.vertexCount;
          this.readVertices(t, g, S << 1);
          var h = this.getValue(t, "color", null);
          return h != null && g.color.setFromString(h), g;
        }
      }
      return null;
    }, a.prototype.readVertices = function(t, i, r) {
      var n = this.scale;
      i.worldVerticesLength = r;
      var f = t.vertices;
      if (r == f.length) {
        var l = o.Utils.toFloatArray(f);
        if (n != 1)
          for (var v = 0, c = f.length; v < c; v++)
            l[v] *= n;
        i.vertices = l;
        return;
      }
      for (var s = new Array(), h = new Array(), v = 0, c = f.length; v < c; ) {
        var d = f[v++];
        h.push(d);
        for (var u = v + d * 4; v < u; v += 4)
          h.push(f[v]), s.push(f[v + 1] * n), s.push(f[v + 2] * n), s.push(f[v + 3]);
      }
      i.bones = h, i.vertices = o.Utils.toFloatArray(s);
    }, a.prototype.readAnimation = function(t, i, r) {
      var n = this.scale, f = new Array(), l = 0;
      if (t.slots)
        for (var v in t.slots) {
          var c = t.slots[v], s = r.findSlotIndex(v);
          if (s == -1)
            throw new Error("Slot not found: " + v);
          for (var h in c) {
            var d = c[h];
            if (h == "attachment") {
              var u = new o.AttachmentTimeline(d.length);
              u.slotIndex = s;
              for (var M = 0, C = 0; C < d.length; C++) {
                var S = d[C];
                u.setFrame(M++, this.getValue(S, "time", 0), S.name);
              }
              f.push(u), l = Math.max(l, u.frames[u.getFrameCount() - 1]);
            } else if (h == "color") {
              var u = new o.ColorTimeline(d.length);
              u.slotIndex = s;
              for (var M = 0, C = 0; C < d.length; C++) {
                var S = d[C], L = new o.Color();
                L.setFromString(S.color), u.setFrame(M, this.getValue(S, "time", 0), L.r, L.g, L.b, L.a), this.readCurve(S, u, M), M++;
              }
              f.push(u), l = Math.max(l, u.frames[(u.getFrameCount() - 1) * o.ColorTimeline.ENTRIES]);
            } else if (h == "twoColor") {
              var u = new o.TwoColorTimeline(d.length);
              u.slotIndex = s;
              for (var M = 0, C = 0; C < d.length; C++) {
                var S = d[C], E = new o.Color(), A = new o.Color();
                E.setFromString(S.light), A.setFromString(S.dark), u.setFrame(M, this.getValue(S, "time", 0), E.r, E.g, E.b, E.a, A.r, A.g, A.b), this.readCurve(S, u, M), M++;
              }
              f.push(u), l = Math.max(l, u.frames[(u.getFrameCount() - 1) * o.TwoColorTimeline.ENTRIES]);
            } else
              throw new Error("Invalid timeline type for a slot: " + h + " (" + v + ")");
          }
        }
      if (t.bones)
        for (var g in t.bones) {
          var m = t.bones[g], x = r.findBoneIndex(g);
          if (x == -1)
            throw new Error("Bone not found: " + g);
          for (var h in m) {
            var d = m[h];
            if (h === "rotate") {
              var u = new o.RotateTimeline(d.length);
              u.boneIndex = x;
              for (var M = 0, C = 0; C < d.length; C++) {
                var S = d[C];
                u.setFrame(M, this.getValue(S, "time", 0), this.getValue(S, "angle", 0)), this.readCurve(S, u, M), M++;
              }
              f.push(u), l = Math.max(l, u.frames[(u.getFrameCount() - 1) * o.RotateTimeline.ENTRIES]);
            } else if (h === "translate" || h === "scale" || h === "shear") {
              var u = null, P = 1, k = 0;
              h === "scale" ? (u = new o.ScaleTimeline(d.length), k = 1) : h === "shear" ? u = new o.ShearTimeline(d.length) : (u = new o.TranslateTimeline(d.length), P = n), u.boneIndex = x;
              for (var M = 0, C = 0; C < d.length; C++) {
                var S = d[C], O = this.getValue(S, "x", k), R = this.getValue(S, "y", k);
                u.setFrame(M, this.getValue(S, "time", 0), O * P, R * P), this.readCurve(S, u, M), M++;
              }
              f.push(u), l = Math.max(l, u.frames[(u.getFrameCount() - 1) * o.TranslateTimeline.ENTRIES]);
            } else
              throw new Error("Invalid timeline type for a bone: " + h + " (" + g + ")");
          }
        }
      if (t.ik)
        for (var D in t.ik) {
          var N = t.ik[D], I = r.findIkConstraint(D), u = new o.IkConstraintTimeline(N.length);
          u.ikConstraintIndex = r.ikConstraints.indexOf(I);
          for (var M = 0, C = 0; C < N.length; C++) {
            var S = N[C];
            u.setFrame(M, this.getValue(S, "time", 0), this.getValue(S, "mix", 1), this.getValue(S, "softness", 0) * n, this.getValue(S, "bendPositive", !0) ? 1 : -1, this.getValue(S, "compress", !1), this.getValue(S, "stretch", !1)), this.readCurve(S, u, M), M++;
          }
          f.push(u), l = Math.max(l, u.frames[(u.getFrameCount() - 1) * o.IkConstraintTimeline.ENTRIES]);
        }
      if (t.transform)
        for (var D in t.transform) {
          var N = t.transform[D], I = r.findTransformConstraint(D), u = new o.TransformConstraintTimeline(N.length);
          u.transformConstraintIndex = r.transformConstraints.indexOf(I);
          for (var M = 0, C = 0; C < N.length; C++) {
            var S = N[C];
            u.setFrame(M, this.getValue(S, "time", 0), this.getValue(S, "rotateMix", 1), this.getValue(S, "translateMix", 1), this.getValue(S, "scaleMix", 1), this.getValue(S, "shearMix", 1)), this.readCurve(S, u, M), M++;
          }
          f.push(u), l = Math.max(l, u.frames[(u.getFrameCount() - 1) * o.TransformConstraintTimeline.ENTRIES]);
        }
      if (t.path)
        for (var D in t.path) {
          var N = t.path[D], y = r.findPathConstraintIndex(D);
          if (y == -1)
            throw new Error("Path constraint not found: " + D);
          var T = r.pathConstraints[y];
          for (var h in N) {
            var d = N[h];
            if (h === "position" || h === "spacing") {
              var u = null, P = 1;
              h === "spacing" ? (u = new o.PathConstraintSpacingTimeline(d.length), (T.spacingMode == o.SpacingMode.Length || T.spacingMode == o.SpacingMode.Fixed) && (P = n)) : (u = new o.PathConstraintPositionTimeline(d.length), T.positionMode == o.PositionMode.Fixed && (P = n)), u.pathConstraintIndex = y;
              for (var M = 0, C = 0; C < d.length; C++) {
                var S = d[C];
                u.setFrame(M, this.getValue(S, "time", 0), this.getValue(S, h, 0) * P), this.readCurve(S, u, M), M++;
              }
              f.push(u), l = Math.max(l, u.frames[(u.getFrameCount() - 1) * o.PathConstraintPositionTimeline.ENTRIES]);
            } else if (h === "mix") {
              var u = new o.PathConstraintMixTimeline(d.length);
              u.pathConstraintIndex = y;
              for (var M = 0, C = 0; C < d.length; C++) {
                var S = d[C];
                u.setFrame(M, this.getValue(S, "time", 0), this.getValue(S, "rotateMix", 1), this.getValue(S, "translateMix", 1)), this.readCurve(S, u, M), M++;
              }
              f.push(u), l = Math.max(l, u.frames[(u.getFrameCount() - 1) * o.PathConstraintMixTimeline.ENTRIES]);
            }
          }
        }
      if (t.deform)
        for (var B in t.deform) {
          var V = t.deform[B], G = r.findSkin(B);
          if (G == null)
            throw new Error("Skin not found: " + B);
          for (var v in V) {
            var c = V[v], s = r.findSlotIndex(v);
            if (s == -1)
              throw new Error("Slot not found: " + c.name);
            for (var h in c) {
              var d = c[h], Y = G.getAttachment(s, h);
              if (Y == null)
                throw new Error("Deform attachment not found: " + d.name);
              var _ = Y.bones != null, X = Y.vertices, W = _ ? X.length / 3 * 2 : X.length, u = new o.DeformTimeline(d.length);
              u.slotIndex = s, u.attachment = Y;
              for (var M = 0, U = 0; U < d.length; U++) {
                var S = d[U], w = void 0, Z = this.getValue(S, "vertices", null);
                if (Z == null)
                  w = _ ? o.Utils.newFloatArray(W) : X;
                else {
                  w = o.Utils.newFloatArray(W);
                  var z = this.getValue(S, "offset", 0);
                  if (o.Utils.arrayCopy(Z, 0, w, z, Z.length), n != 1)
                    for (var C = z, j = C + Z.length; C < j; C++)
                      w[C] *= n;
                  if (!_)
                    for (var C = 0; C < W; C++)
                      w[C] += X[C];
                }
                u.setFrame(M, this.getValue(S, "time", 0), w), this.readCurve(S, u, M), M++;
              }
              f.push(u), l = Math.max(l, u.frames[u.getFrameCount() - 1]);
            }
          }
        }
      var H = t.drawOrder;
      if (H == null && (H = t.draworder), H != null) {
        for (var u = new o.DrawOrderTimeline(H.length), q = r.slots.length, M = 0, U = 0; U < H.length; U++) {
          var K = H[U], J = null, at = this.getValue(K, "offsets", null);
          if (at != null) {
            J = o.Utils.newArray(q, -1);
            for (var nt = o.Utils.newArray(q - at.length, 0), lt = 0, ut = 0, C = 0; C < at.length; C++) {
              var st = at[C], s = r.findSlotIndex(st.slot);
              if (s == -1)
                throw new Error("Slot not found: " + st.slot);
              for (; lt != s; )
                nt[ut++] = lt++;
              J[lt + st.offset] = lt++;
            }
            for (; lt < q; )
              nt[ut++] = lt++;
            for (var C = q - 1; C >= 0; C--)
              J[C] == -1 && (J[C] = nt[--ut]);
          }
          u.setFrame(M++, this.getValue(K, "time", 0), J);
        }
        f.push(u), l = Math.max(l, u.frames[u.getFrameCount() - 1]);
      }
      if (t.events) {
        for (var u = new o.EventTimeline(t.events.length), M = 0, C = 0; C < t.events.length; C++) {
          var ct = t.events[C], ot = r.findEvent(ct.name);
          if (ot == null)
            throw new Error("Event not found: " + ct.name);
          var ht = new o.Event(o.Utils.toSinglePrecision(this.getValue(ct, "time", 0)), ot);
          ht.intValue = this.getValue(ct, "int", ot.intValue), ht.floatValue = this.getValue(ct, "float", ot.floatValue), ht.stringValue = this.getValue(ct, "string", ot.stringValue), ht.data.audioPath != null && (ht.volume = this.getValue(ct, "volume", 1), ht.balance = this.getValue(ct, "balance", 0)), u.setFrame(M++, ht);
        }
        f.push(u), l = Math.max(l, u.frames[u.getFrameCount() - 1]);
      }
      if (isNaN(l))
        throw new Error("Error while parsing animation, duration is NaN");
      r.animations.push(new o.Animation(i, f, l));
    }, a.prototype.readCurve = function(t, i, r) {
      if (t.hasOwnProperty("curve"))
        if (t.curve == "stepped")
          i.setStepped(r);
        else {
          var n = t.curve;
          i.setCurve(r, n, this.getValue(t, "c2", 0), this.getValue(t, "c3", 1), this.getValue(t, "c4", 1));
        }
    }, a.prototype.getValue = function(t, i, r) {
      return t[i] !== void 0 ? t[i] : r;
    }, a.blendModeFromString = function(t) {
      if (t = t.toLowerCase(), t == "normal")
        return o.BlendMode.Normal;
      if (t == "additive")
        return o.BlendMode.Additive;
      if (t == "multiply")
        return o.BlendMode.Multiply;
      if (t == "screen")
        return o.BlendMode.Screen;
      throw new Error("Unknown blend mode: " + t);
    }, a.positionModeFromString = function(t) {
      if (t = t.toLowerCase(), t == "fixed")
        return o.PositionMode.Fixed;
      if (t == "percent")
        return o.PositionMode.Percent;
      throw new Error("Unknown position mode: " + t);
    }, a.spacingModeFromString = function(t) {
      if (t = t.toLowerCase(), t == "length")
        return o.SpacingMode.Length;
      if (t == "fixed")
        return o.SpacingMode.Fixed;
      if (t == "percent")
        return o.SpacingMode.Percent;
      throw new Error("Unknown position mode: " + t);
    }, a.rotateModeFromString = function(t) {
      if (t = t.toLowerCase(), t == "tangent")
        return o.RotateMode.Tangent;
      if (t == "chain")
        return o.RotateMode.Chain;
      if (t == "chainscale")
        return o.RotateMode.ChainScale;
      throw new Error("Unknown rotate mode: " + t);
    }, a.transformModeFromString = function(t) {
      if (t = t.toLowerCase(), t == "normal")
        return o.TransformMode.Normal;
      if (t == "onlytranslation")
        return o.TransformMode.OnlyTranslation;
      if (t == "norotationorreflection")
        return o.TransformMode.NoRotationOrReflection;
      if (t == "noscale")
        return o.TransformMode.NoScale;
      if (t == "noscaleorreflection")
        return o.TransformMode.NoScaleOrReflection;
      throw new Error("Unknown transform mode: " + t);
    }, a;
  })();
  o.SkeletonJson = e;
  var p = /* @__PURE__ */ (function() {
    function a(t, i, r, n, f) {
      this.mesh = t, this.skin = i, this.slotIndex = r, this.parent = n, this.inheritDeform = f;
    }
    return a;
  })();
})(F || (F = {}));
var F;
(function(o) {
  var e = /* @__PURE__ */ (function() {
    function a(t, i, r) {
      this.slotIndex = t, this.name = i, this.attachment = r;
    }
    return a;
  })();
  o.SkinEntry = e;
  var p = (function() {
    function a(t) {
      if (this.attachments = new Array(), this.bones = Array(), this.constraints = new Array(), t == null)
        throw new Error("name cannot be null.");
      this.name = t;
    }
    return a.prototype.setAttachment = function(t, i, r) {
      if (r == null)
        throw new Error("attachment cannot be null.");
      var n = this.attachments;
      t >= n.length && (n.length = t + 1), n[t] || (n[t] = {}), n[t][i] = r;
    }, a.prototype.addSkin = function(t) {
      for (var i = 0; i < t.bones.length; i++) {
        for (var r = t.bones[i], n = !1, f = 0; f < this.bones.length; f++)
          if (this.bones[f] == r) {
            n = !0;
            break;
          }
        n || this.bones.push(r);
      }
      for (var i = 0; i < t.constraints.length; i++) {
        for (var l = t.constraints[i], n = !1, f = 0; f < this.constraints.length; f++)
          if (this.constraints[f] == l) {
            n = !0;
            break;
          }
        n || this.constraints.push(l);
      }
      for (var v = t.getAttachments(), i = 0; i < v.length; i++) {
        var c = v[i];
        this.setAttachment(c.slotIndex, c.name, c.attachment);
      }
    }, a.prototype.copySkin = function(t) {
      for (var i = 0; i < t.bones.length; i++) {
        for (var r = t.bones[i], n = !1, f = 0; f < this.bones.length; f++)
          if (this.bones[f] == r) {
            n = !0;
            break;
          }
        n || this.bones.push(r);
      }
      for (var i = 0; i < t.constraints.length; i++) {
        for (var l = t.constraints[i], n = !1, f = 0; f < this.constraints.length; f++)
          if (this.constraints[f] == l) {
            n = !0;
            break;
          }
        n || this.constraints.push(l);
      }
      for (var v = t.getAttachments(), i = 0; i < v.length; i++) {
        var c = v[i];
        c.attachment != null && (c.attachment instanceof o.MeshAttachment ? (c.attachment = c.attachment.newLinkedMesh(), this.setAttachment(c.slotIndex, c.name, c.attachment)) : (c.attachment = c.attachment.copy(), this.setAttachment(c.slotIndex, c.name, c.attachment)));
      }
    }, a.prototype.getAttachment = function(t, i) {
      var r = this.attachments[t];
      return r ? r[i] : null;
    }, a.prototype.removeAttachment = function(t, i) {
      var r = this.attachments[t];
      r && (r[i] = null);
    }, a.prototype.getAttachments = function() {
      for (var t = new Array(), i = 0; i < this.attachments.length; i++) {
        var r = this.attachments[i];
        if (r)
          for (var n in r) {
            var f = r[n];
            f && t.push(new e(i, n, f));
          }
      }
      return t;
    }, a.prototype.getAttachmentsForSlot = function(t, i) {
      var r = this.attachments[t];
      if (r)
        for (var n in r) {
          var f = r[n];
          f && i.push(new e(t, n, f));
        }
    }, a.prototype.clear = function() {
      this.attachments.length = 0, this.bones.length = 0, this.constraints.length = 0;
    }, a.prototype.attachAll = function(t, i) {
      for (var r = 0, n = 0; n < t.slots.length; n++) {
        var f = t.slots[n], l = f.getAttachment();
        if (l && r < i.attachments.length) {
          var v = i.attachments[r];
          for (var c in v) {
            var s = v[c];
            if (l == s) {
              var h = this.getAttachment(r, c);
              h != null && f.setAttachment(h);
              break;
            }
          }
        }
        r++;
      }
    }, a;
  })();
  o.Skin = p;
})(F || (F = {}));
var F;
(function(o) {
  var e = (function() {
    function p(a, t) {
      if (this.deform = new Array(), a == null)
        throw new Error("data cannot be null.");
      if (t == null)
        throw new Error("bone cannot be null.");
      this.data = a, this.bone = t, this.color = new o.Color(), this.darkColor = a.darkColor == null ? null : new o.Color(), this.setToSetupPose();
    }
    return p.prototype.getSkeleton = function() {
      return this.bone.skeleton;
    }, p.prototype.getAttachment = function() {
      return this.attachment;
    }, p.prototype.setAttachment = function(a) {
      this.attachment != a && (this.attachment = a, this.attachmentTime = this.bone.skeleton.time, this.deform.length = 0);
    }, p.prototype.setAttachmentTime = function(a) {
      this.attachmentTime = this.bone.skeleton.time - a;
    }, p.prototype.getAttachmentTime = function() {
      return this.bone.skeleton.time - this.attachmentTime;
    }, p.prototype.setToSetupPose = function() {
      this.color.setFromColor(this.data.color), this.darkColor != null && this.darkColor.setFromColor(this.data.darkColor), this.data.attachmentName == null ? this.attachment = null : (this.attachment = null, this.setAttachment(this.bone.skeleton.getAttachment(this.data.index, this.data.attachmentName)));
    }, p;
  })();
  o.Slot = e;
})(F || (F = {}));
var F;
(function(o) {
  var e = /* @__PURE__ */ (function() {
    function p(a, t, i) {
      if (this.color = new o.Color(1, 1, 1, 1), a < 0)
        throw new Error("index must be >= 0.");
      if (t == null)
        throw new Error("name cannot be null.");
      if (i == null)
        throw new Error("boneData cannot be null.");
      this.index = a, this.name = t, this.boneData = i;
    }
    return p;
  })();
  o.SlotData = e;
})(F || (F = {}));
var F;
(function(o) {
  var e = (function() {
    function r(n) {
      this._image = n;
    }
    return r.prototype.getImage = function() {
      return this._image;
    }, r.filterFromString = function(n) {
      switch (n.toLowerCase()) {
        case "nearest":
          return p.Nearest;
        case "linear":
          return p.Linear;
        case "mipmap":
          return p.MipMap;
        case "mipmapnearestnearest":
          return p.MipMapNearestNearest;
        case "mipmaplinearnearest":
          return p.MipMapLinearNearest;
        case "mipmapnearestlinear":
          return p.MipMapNearestLinear;
        case "mipmaplinearlinear":
          return p.MipMapLinearLinear;
        default:
          throw new Error("Unknown texture filter " + n);
      }
    }, r.wrapFromString = function(n) {
      switch (n.toLowerCase()) {
        case "mirroredtepeat":
          return a.MirroredRepeat;
        case "clamptoedge":
          return a.ClampToEdge;
        case "repeat":
          return a.Repeat;
        default:
          throw new Error("Unknown texture wrap " + n);
      }
    }, r;
  })();
  o.Texture = e;
  var p;
  (function(r) {
    r[r.Nearest = 9728] = "Nearest", r[r.Linear = 9729] = "Linear", r[r.MipMap = 9987] = "MipMap", r[r.MipMapNearestNearest = 9984] = "MipMapNearestNearest", r[r.MipMapLinearNearest = 9985] = "MipMapLinearNearest", r[r.MipMapNearestLinear = 9986] = "MipMapNearestLinear", r[r.MipMapLinearLinear = 9987] = "MipMapLinearLinear";
  })(p = o.TextureFilter || (o.TextureFilter = {}));
  var a;
  (function(r) {
    r[r.MirroredRepeat = 33648] = "MirroredRepeat", r[r.ClampToEdge = 33071] = "ClampToEdge", r[r.Repeat = 10497] = "Repeat";
  })(a = o.TextureWrap || (o.TextureWrap = {}));
  var t = /* @__PURE__ */ (function() {
    function r() {
      this.u = 0, this.v = 0, this.u2 = 0, this.v2 = 0, this.width = 0, this.height = 0, this.rotate = !1, this.offsetX = 0, this.offsetY = 0, this.originalWidth = 0, this.originalHeight = 0;
    }
    return r;
  })();
  o.TextureRegion = t;
  var i = (function(r) {
    Q(n, r);
    function n() {
      return r !== null && r.apply(this, arguments) || this;
    }
    return n.prototype.setFilters = function(f, l) {
    }, n.prototype.setWraps = function(f, l) {
    }, n.prototype.dispose = function() {
    }, n;
  })(e);
  o.FakeTexture = i;
})(F || (F = {}));
var F;
(function(o) {
  var e = (function() {
    function i(r, n) {
      this.pages = new Array(), this.regions = new Array(), this.load(r, n);
    }
    return i.prototype.load = function(r, n) {
      if (n == null)
        throw new Error("textureLoader cannot be null.");
      for (var f = new p(r), l = new Array(4), v = null; ; ) {
        var c = f.readLine();
        if (c == null)
          break;
        if (c = c.trim(), c.length == 0)
          v = null;
        else if (v) {
          var h = new t();
          h.name = c, h.page = v;
          var d = f.readValue();
          d.toLocaleLowerCase() == "true" ? h.degrees = 90 : d.toLocaleLowerCase() == "false" ? h.degrees = 0 : h.degrees = parseFloat(d), h.rotate = h.degrees == 90, f.readTuple(l);
          var u = parseInt(l[0]), M = parseInt(l[1]);
          f.readTuple(l);
          var C = parseInt(l[0]), S = parseInt(l[1]);
          h.u = u / v.width, h.v = M / v.height, h.rotate ? (h.u2 = (u + S) / v.width, h.v2 = (M + C) / v.height) : (h.u2 = (u + C) / v.width, h.v2 = (M + S) / v.height), h.x = u, h.y = M, h.width = Math.abs(C), h.height = Math.abs(S), f.readTuple(l) == 4 && f.readTuple(l) == 4 && f.readTuple(l), h.originalWidth = parseInt(l[0]), h.originalHeight = parseInt(l[1]), f.readTuple(l), h.offsetX = parseInt(l[0]), h.offsetY = parseInt(l[1]), h.index = parseInt(f.readValue()), h.texture = v.texture, this.regions.push(h);
        } else {
          v = new a(), v.name = c, f.readTuple(l) == 2 && (v.width = parseInt(l[0]), v.height = parseInt(l[1]), f.readTuple(l)), f.readTuple(l), v.minFilter = o.Texture.filterFromString(l[0]), v.magFilter = o.Texture.filterFromString(l[1]);
          var s = f.readValue();
          v.uWrap = o.TextureWrap.ClampToEdge, v.vWrap = o.TextureWrap.ClampToEdge, s == "x" ? v.uWrap = o.TextureWrap.Repeat : s == "y" ? v.vWrap = o.TextureWrap.Repeat : s == "xy" && (v.uWrap = v.vWrap = o.TextureWrap.Repeat), v.texture = n(c), v.texture.setFilters(v.minFilter, v.magFilter), v.texture.setWraps(v.uWrap, v.vWrap), v.width = v.texture.getImage().width, v.height = v.texture.getImage().height, this.pages.push(v);
        }
      }
    }, i.prototype.findRegion = function(r) {
      for (var n = 0; n < this.regions.length; n++)
        if (this.regions[n].name == r)
          return this.regions[n];
      return null;
    }, i.prototype.dispose = function() {
      for (var r = 0; r < this.pages.length; r++)
        this.pages[r].texture.dispose();
    }, i;
  })();
  o.TextureAtlas = e;
  var p = (function() {
    function i(r) {
      this.index = 0, this.lines = r.split(/\r\n|\r|\n/);
    }
    return i.prototype.readLine = function() {
      return this.index >= this.lines.length ? null : this.lines[this.index++];
    }, i.prototype.readValue = function() {
      var r = this.readLine(), n = r.indexOf(":");
      if (n == -1)
        throw new Error("Invalid line: " + r);
      return r.substring(n + 1).trim();
    }, i.prototype.readTuple = function(r) {
      var n = this.readLine(), f = n.indexOf(":");
      if (f == -1)
        throw new Error("Invalid line: " + n);
      for (var l = 0, v = f + 1; l < 3; l++) {
        var c = n.indexOf(",", v);
        if (c == -1)
          break;
        r[l] = n.substr(v, c - v).trim(), v = c + 1;
      }
      return r[l] = n.substring(v).trim(), l + 1;
    }, i;
  })(), a = /* @__PURE__ */ (function() {
    function i() {
    }
    return i;
  })();
  o.TextureAtlasPage = a;
  var t = (function(i) {
    Q(r, i);
    function r() {
      return i !== null && i.apply(this, arguments) || this;
    }
    return r;
  })(o.TextureRegion);
  o.TextureAtlasRegion = t;
})(F || (F = {}));
var F;
(function(o) {
  var e = (function() {
    function p(a, t) {
      if (this.rotateMix = 0, this.translateMix = 0, this.scaleMix = 0, this.shearMix = 0, this.temp = new o.Vector2(), this.active = !1, a == null)
        throw new Error("data cannot be null.");
      if (t == null)
        throw new Error("skeleton cannot be null.");
      this.data = a, this.rotateMix = a.rotateMix, this.translateMix = a.translateMix, this.scaleMix = a.scaleMix, this.shearMix = a.shearMix, this.bones = new Array();
      for (var i = 0; i < a.bones.length; i++)
        this.bones.push(t.findBone(a.bones[i].name));
      this.target = t.findBone(a.target.name);
    }
    return p.prototype.isActive = function() {
      return this.active;
    }, p.prototype.apply = function() {
      this.update();
    }, p.prototype.update = function() {
      this.data.local ? this.data.relative ? this.applyRelativeLocal() : this.applyAbsoluteLocal() : this.data.relative ? this.applyRelativeWorld() : this.applyAbsoluteWorld();
    }, p.prototype.applyAbsoluteWorld = function() {
      for (var a = this.rotateMix, t = this.translateMix, i = this.scaleMix, r = this.shearMix, n = this.target, f = n.a, l = n.b, v = n.c, c = n.d, s = f * c - l * v > 0 ? o.MathUtils.degRad : -o.MathUtils.degRad, h = this.data.offsetRotation * s, d = this.data.offsetShearY * s, u = this.bones, M = 0, C = u.length; M < C; M++) {
        var S = u[M], L = !1;
        if (a != 0) {
          var E = S.a, A = S.b, g = S.c, m = S.d, x = Math.atan2(v, f) - Math.atan2(g, E) + h;
          x > o.MathUtils.PI ? x -= o.MathUtils.PI2 : x < -o.MathUtils.PI && (x += o.MathUtils.PI2), x *= a;
          var P = Math.cos(x), k = Math.sin(x);
          S.a = P * E - k * g, S.b = P * A - k * m, S.c = k * E + P * g, S.d = k * A + P * m, L = !0;
        }
        if (t != 0) {
          var O = this.temp;
          n.localToWorld(O.set(this.data.offsetX, this.data.offsetY)), S.worldX += (O.x - S.worldX) * t, S.worldY += (O.y - S.worldY) * t, L = !0;
        }
        if (i > 0) {
          var R = Math.sqrt(S.a * S.a + S.c * S.c), D = Math.sqrt(f * f + v * v);
          R > 1e-5 && (R = (R + (D - R + this.data.offsetScaleX) * i) / R), S.a *= R, S.c *= R, R = Math.sqrt(S.b * S.b + S.d * S.d), D = Math.sqrt(l * l + c * c), R > 1e-5 && (R = (R + (D - R + this.data.offsetScaleY) * i) / R), S.b *= R, S.d *= R, L = !0;
        }
        if (r > 0) {
          var A = S.b, m = S.d, N = Math.atan2(m, A), x = Math.atan2(c, l) - Math.atan2(v, f) - (N - Math.atan2(S.c, S.a));
          x > o.MathUtils.PI ? x -= o.MathUtils.PI2 : x < -o.MathUtils.PI && (x += o.MathUtils.PI2), x = N + (x + d) * r;
          var R = Math.sqrt(A * A + m * m);
          S.b = Math.cos(x) * R, S.d = Math.sin(x) * R, L = !0;
        }
        L && (S.appliedValid = !1);
      }
    }, p.prototype.applyRelativeWorld = function() {
      for (var a = this.rotateMix, t = this.translateMix, i = this.scaleMix, r = this.shearMix, n = this.target, f = n.a, l = n.b, v = n.c, c = n.d, s = f * c - l * v > 0 ? o.MathUtils.degRad : -o.MathUtils.degRad, h = this.data.offsetRotation * s, d = this.data.offsetShearY * s, u = this.bones, M = 0, C = u.length; M < C; M++) {
        var S = u[M], L = !1;
        if (a != 0) {
          var E = S.a, A = S.b, g = S.c, m = S.d, x = Math.atan2(v, f) + h;
          x > o.MathUtils.PI ? x -= o.MathUtils.PI2 : x < -o.MathUtils.PI && (x += o.MathUtils.PI2), x *= a;
          var P = Math.cos(x), k = Math.sin(x);
          S.a = P * E - k * g, S.b = P * A - k * m, S.c = k * E + P * g, S.d = k * A + P * m, L = !0;
        }
        if (t != 0) {
          var O = this.temp;
          n.localToWorld(O.set(this.data.offsetX, this.data.offsetY)), S.worldX += O.x * t, S.worldY += O.y * t, L = !0;
        }
        if (i > 0) {
          var R = (Math.sqrt(f * f + v * v) - 1 + this.data.offsetScaleX) * i + 1;
          S.a *= R, S.c *= R, R = (Math.sqrt(l * l + c * c) - 1 + this.data.offsetScaleY) * i + 1, S.b *= R, S.d *= R, L = !0;
        }
        if (r > 0) {
          var x = Math.atan2(c, l) - Math.atan2(v, f);
          x > o.MathUtils.PI ? x -= o.MathUtils.PI2 : x < -o.MathUtils.PI && (x += o.MathUtils.PI2);
          var A = S.b, m = S.d;
          x = Math.atan2(m, A) + (x - o.MathUtils.PI / 2 + d) * r;
          var R = Math.sqrt(A * A + m * m);
          S.b = Math.cos(x) * R, S.d = Math.sin(x) * R, L = !0;
        }
        L && (S.appliedValid = !1);
      }
    }, p.prototype.applyAbsoluteLocal = function() {
      var a = this.rotateMix, t = this.translateMix, i = this.scaleMix, r = this.shearMix, n = this.target;
      n.appliedValid || n.updateAppliedTransform();
      for (var f = this.bones, l = 0, v = f.length; l < v; l++) {
        var c = f[l];
        c.appliedValid || c.updateAppliedTransform();
        var s = c.arotation;
        if (a != 0) {
          var h = n.arotation - s + this.data.offsetRotation;
          h -= (16384 - (16384.499999999996 - h / 360 | 0)) * 360, s += h * a;
        }
        var d = c.ax, u = c.ay;
        t != 0 && (d += (n.ax - d + this.data.offsetX) * t, u += (n.ay - u + this.data.offsetY) * t);
        var M = c.ascaleX, C = c.ascaleY;
        i != 0 && (M > 1e-5 && (M = (M + (n.ascaleX - M + this.data.offsetScaleX) * i) / M), C > 1e-5 && (C = (C + (n.ascaleY - C + this.data.offsetScaleY) * i) / C));
        var S = c.ashearY;
        if (r != 0) {
          var h = n.ashearY - S + this.data.offsetShearY;
          h -= (16384 - (16384.499999999996 - h / 360 | 0)) * 360, c.shearY += h * r;
        }
        c.updateWorldTransformWith(d, u, s, M, C, c.ashearX, S);
      }
    }, p.prototype.applyRelativeLocal = function() {
      var a = this.rotateMix, t = this.translateMix, i = this.scaleMix, r = this.shearMix, n = this.target;
      n.appliedValid || n.updateAppliedTransform();
      for (var f = this.bones, l = 0, v = f.length; l < v; l++) {
        var c = f[l];
        c.appliedValid || c.updateAppliedTransform();
        var s = c.arotation;
        a != 0 && (s += (n.arotation + this.data.offsetRotation) * a);
        var h = c.ax, d = c.ay;
        t != 0 && (h += (n.ax + this.data.offsetX) * t, d += (n.ay + this.data.offsetY) * t);
        var u = c.ascaleX, M = c.ascaleY;
        i != 0 && (u > 1e-5 && (u *= (n.ascaleX - 1 + this.data.offsetScaleX) * i + 1), M > 1e-5 && (M *= (n.ascaleY - 1 + this.data.offsetScaleY) * i + 1));
        var C = c.ashearY;
        r != 0 && (C += (n.ashearY + this.data.offsetShearY) * r), c.updateWorldTransformWith(h, d, s, u, M, c.ashearX, C);
      }
    }, p;
  })();
  o.TransformConstraint = e;
})(F || (F = {}));
var F;
(function(o) {
  var e = (function(p) {
    Q(a, p);
    function a(t) {
      var i = p.call(this, t, 0, !1) || this;
      return i.bones = new Array(), i.rotateMix = 0, i.translateMix = 0, i.scaleMix = 0, i.shearMix = 0, i.offsetRotation = 0, i.offsetX = 0, i.offsetY = 0, i.offsetScaleX = 0, i.offsetScaleY = 0, i.offsetShearY = 0, i.relative = !1, i.local = !1, i;
    }
    return a;
  })(o.ConstraintData);
  o.TransformConstraintData = e;
})(F || (F = {}));
var F;
(function(o) {
  var e = (function() {
    function p() {
      this.convexPolygons = new Array(), this.convexPolygonsIndices = new Array(), this.indicesArray = new Array(), this.isConcaveArray = new Array(), this.triangles = new Array(), this.polygonPool = new o.Pool(function() {
        return new Array();
      }), this.polygonIndicesPool = new o.Pool(function() {
        return new Array();
      });
    }
    return p.prototype.triangulate = function(a) {
      var t = a, i = a.length >> 1, r = this.indicesArray;
      r.length = 0;
      for (var n = 0; n < i; n++)
        r[n] = n;
      var f = this.isConcaveArray;
      f.length = 0;
      for (var n = 0, l = i; n < l; ++n)
        f[n] = p.isConcave(n, i, t, r);
      var v = this.triangles;
      for (v.length = 0; i > 3; ) {
        for (var c = i - 1, n = 0, s = 1; ; ) {
          t: if (!f[n]) {
            for (var h = r[c] << 1, d = r[n] << 1, u = r[s] << 1, M = t[h], C = t[h + 1], S = t[d], L = t[d + 1], E = t[u], A = t[u + 1], g = (s + 1) % i; g != c; g = (g + 1) % i)
              if (f[g]) {
                var m = r[g] << 1, x = t[m], P = t[m + 1];
                if (p.positiveArea(E, A, M, C, x, P) && p.positiveArea(M, C, S, L, x, P) && p.positiveArea(S, L, E, A, x, P))
                  break t;
              }
            break;
          }
          if (s == 0) {
            do {
              if (!f[n])
                break;
              n--;
            } while (n > 0);
            break;
          }
          c = n, n = s, s = (s + 1) % i;
        }
        v.push(r[(i + n - 1) % i]), v.push(r[n]), v.push(r[(n + 1) % i]), r.splice(n, 1), f.splice(n, 1), i--;
        var k = (i + n - 1) % i, O = n == i ? 0 : n;
        f[k] = p.isConcave(k, i, t, r), f[O] = p.isConcave(O, i, t, r);
      }
      return i == 3 && (v.push(r[2]), v.push(r[0]), v.push(r[1])), v;
    }, p.prototype.decompose = function(a, t) {
      var i = a, r = this.convexPolygons;
      this.polygonPool.freeAll(r), r.length = 0;
      var n = this.convexPolygonsIndices;
      this.polygonIndicesPool.freeAll(n), n.length = 0;
      var f = this.polygonIndicesPool.obtain();
      f.length = 0;
      var l = this.polygonPool.obtain();
      l.length = 0;
      for (var v = -1, c = 0, s = 0, h = t.length; s < h; s += 3) {
        var d = t[s] << 1, u = t[s + 1] << 1, M = t[s + 2] << 1, C = i[d], S = i[d + 1], L = i[u], E = i[u + 1], A = i[M], g = i[M + 1], m = !1;
        if (v == d) {
          var x = l.length - 4, P = p.winding(l[x], l[x + 1], l[x + 2], l[x + 3], A, g), k = p.winding(A, g, l[0], l[1], l[2], l[3]);
          P == c && k == c && (l.push(A), l.push(g), f.push(M), m = !0);
        }
        m || (l.length > 0 ? (r.push(l), n.push(f)) : (this.polygonPool.free(l), this.polygonIndicesPool.free(f)), l = this.polygonPool.obtain(), l.length = 0, l.push(C), l.push(S), l.push(L), l.push(E), l.push(A), l.push(g), f = this.polygonIndicesPool.obtain(), f.length = 0, f.push(d), f.push(u), f.push(M), c = p.winding(C, S, L, E, A, g), v = d);
      }
      l.length > 0 && (r.push(l), n.push(f));
      for (var s = 0, h = r.length; s < h; s++)
        if (f = n[s], f.length != 0) {
          var O = f[0], R = f[f.length - 1];
          l = r[s];
          for (var x = l.length - 4, D = l[x], N = l[x + 1], I = l[x + 2], y = l[x + 3], T = l[0], B = l[1], V = l[2], G = l[3], Y = p.winding(D, N, I, y, T, B), _ = 0; _ < h; _++)
            if (_ != s) {
              var X = n[_];
              if (X.length == 3) {
                var W = X[0], U = X[1], w = X[2], Z = r[_], A = Z[Z.length - 2], g = Z[Z.length - 1];
                if (!(W != O || U != R)) {
                  var P = p.winding(D, N, I, y, A, g), k = p.winding(A, g, T, B, V, G);
                  P == Y && k == Y && (Z.length = 0, X.length = 0, l.push(A), l.push(g), f.push(w), D = I, N = y, I = A, y = g, _ = 0);
                }
              }
            }
        }
      for (var s = r.length - 1; s >= 0; s--)
        l = r[s], l.length == 0 && (r.splice(s, 1), this.polygonPool.free(l), f = n[s], n.splice(s, 1), this.polygonIndicesPool.free(f));
      return r;
    }, p.isConcave = function(a, t, i, r) {
      var n = r[(t + a - 1) % t] << 1, f = r[a] << 1, l = r[(a + 1) % t] << 1;
      return !this.positiveArea(i[n], i[n + 1], i[f], i[f + 1], i[l], i[l + 1]);
    }, p.positiveArea = function(a, t, i, r, n, f) {
      return a * (f - r) + i * (t - f) + n * (r - t) >= 0;
    }, p.winding = function(a, t, i, r, n, f) {
      var l = i - a, v = r - t;
      return n * v - f * l + l * t - a * v >= 0 ? 1 : -1;
    }, p;
  })();
  o.Triangulator = e;
})(F || (F = {}));
var F;
(function(o) {
  var e = (function() {
    function h() {
      this.array = new Array();
    }
    return h.prototype.add = function(d) {
      var u = this.contains(d);
      return this.array[d | 0] = d | 0, !u;
    }, h.prototype.contains = function(d) {
      return this.array[d | 0] != null;
    }, h.prototype.remove = function(d) {
      this.array[d | 0] = void 0;
    }, h.prototype.clear = function() {
      this.array.length = 0;
    }, h;
  })();
  o.IntSet = e;
  var p = (function() {
    function h(d, u, M, C) {
      d === void 0 && (d = 0), u === void 0 && (u = 0), M === void 0 && (M = 0), C === void 0 && (C = 0), this.r = d, this.g = u, this.b = M, this.a = C;
    }
    return h.prototype.set = function(d, u, M, C) {
      return this.r = d, this.g = u, this.b = M, this.a = C, this.clamp(), this;
    }, h.prototype.setFromColor = function(d) {
      return this.r = d.r, this.g = d.g, this.b = d.b, this.a = d.a, this;
    }, h.prototype.setFromString = function(d) {
      return d = d.charAt(0) == "#" ? d.substr(1) : d, this.r = parseInt(d.substr(0, 2), 16) / 255, this.g = parseInt(d.substr(2, 2), 16) / 255, this.b = parseInt(d.substr(4, 2), 16) / 255, this.a = (d.length != 8 ? 255 : parseInt(d.substr(6, 2), 16)) / 255, this;
    }, h.prototype.add = function(d, u, M, C) {
      return this.r += d, this.g += u, this.b += M, this.a += C, this.clamp(), this;
    }, h.prototype.clamp = function() {
      return this.r < 0 ? this.r = 0 : this.r > 1 && (this.r = 1), this.g < 0 ? this.g = 0 : this.g > 1 && (this.g = 1), this.b < 0 ? this.b = 0 : this.b > 1 && (this.b = 1), this.a < 0 ? this.a = 0 : this.a > 1 && (this.a = 1), this;
    }, h.rgba8888ToColor = function(d, u) {
      d.r = ((u & 4278190080) >>> 24) / 255, d.g = ((u & 16711680) >>> 16) / 255, d.b = ((u & 65280) >>> 8) / 255, d.a = (u & 255) / 255;
    }, h.rgb888ToColor = function(d, u) {
      d.r = ((u & 16711680) >>> 16) / 255, d.g = ((u & 65280) >>> 8) / 255, d.b = (u & 255) / 255;
    }, h.WHITE = new h(1, 1, 1, 1), h.RED = new h(1, 0, 0, 1), h.GREEN = new h(0, 1, 0, 1), h.BLUE = new h(0, 0, 1, 1), h.MAGENTA = new h(1, 0, 1, 1), h;
  })();
  o.Color = p;
  var a = (function() {
    function h() {
    }
    return h.clamp = function(d, u, M) {
      return d < u ? u : d > M ? M : d;
    }, h.cosDeg = function(d) {
      return Math.cos(d * h.degRad);
    }, h.sinDeg = function(d) {
      return Math.sin(d * h.degRad);
    }, h.signum = function(d) {
      return d > 0 ? 1 : d < 0 ? -1 : 0;
    }, h.toInt = function(d) {
      return d > 0 ? Math.floor(d) : Math.ceil(d);
    }, h.cbrt = function(d) {
      var u = Math.pow(Math.abs(d), 0.3333333333333333);
      return d < 0 ? -u : u;
    }, h.randomTriangular = function(d, u) {
      return h.randomTriangularWith(d, u, (d + u) * 0.5);
    }, h.randomTriangularWith = function(d, u, M) {
      var C = Math.random(), S = u - d;
      return C <= (M - d) / S ? d + Math.sqrt(C * S * (M - d)) : u - Math.sqrt((1 - C) * S * (u - M));
    }, h.PI = 3.1415927, h.PI2 = h.PI * 2, h.radiansToDegrees = 180 / h.PI, h.radDeg = h.radiansToDegrees, h.degreesToRadians = h.PI / 180, h.degRad = h.degreesToRadians, h;
  })();
  o.MathUtils = a;
  var t = (function() {
    function h() {
    }
    return h.prototype.apply = function(d, u, M) {
      return d + (u - d) * this.applyInternal(M);
    }, h;
  })();
  o.Interpolation = t;
  var i = (function(h) {
    Q(d, h);
    function d(u) {
      var M = h.call(this) || this;
      return M.power = 2, M.power = u, M;
    }
    return d.prototype.applyInternal = function(u) {
      return u <= 0.5 ? Math.pow(u * 2, this.power) / 2 : Math.pow((u - 1) * 2, this.power) / (this.power % 2 == 0 ? -2 : 2) + 1;
    }, d;
  })(t);
  o.Pow = i;
  var r = (function(h) {
    Q(d, h);
    function d(u) {
      return h.call(this, u) || this;
    }
    return d.prototype.applyInternal = function(u) {
      return Math.pow(u - 1, this.power) * (this.power % 2 == 0 ? -1 : 1) + 1;
    }, d;
  })(i);
  o.PowOut = r;
  var n = (function() {
    function h() {
    }
    return h.arrayCopy = function(d, u, M, C, S) {
      for (var L = u, E = C; L < u + S; L++, E++)
        M[E] = d[L];
    }, h.setArraySize = function(d, u, M) {
      M === void 0 && (M = 0);
      var C = d.length;
      if (C == u)
        return d;
      if (d.length = u, C < u)
        for (var S = C; S < u; S++)
          d[S] = M;
      return d;
    }, h.ensureArrayCapacity = function(d, u, M) {
      return M === void 0 && (M = 0), d.length >= u ? d : h.setArraySize(d, u, M);
    }, h.newArray = function(d, u) {
      for (var M = new Array(d), C = 0; C < d; C++)
        M[C] = u;
      return M;
    }, h.newFloatArray = function(d) {
      if (h.SUPPORTS_TYPED_ARRAYS)
        return new Float32Array(d);
      for (var u = new Array(d), M = 0; M < u.length; M++)
        u[M] = 0;
      return u;
    }, h.newShortArray = function(d) {
      if (h.SUPPORTS_TYPED_ARRAYS)
        return new Int16Array(d);
      for (var u = new Array(d), M = 0; M < u.length; M++)
        u[M] = 0;
      return u;
    }, h.toFloatArray = function(d) {
      return h.SUPPORTS_TYPED_ARRAYS ? new Float32Array(d) : d;
    }, h.toSinglePrecision = function(d) {
      return h.SUPPORTS_TYPED_ARRAYS ? Math.fround(d) : d;
    }, h.webkit602BugfixHelper = function(d, u) {
    }, h.contains = function(d, u, M) {
      for (var C = 0; C < d.length; C++)
        if (d[C] == u)
          return !0;
      return !1;
    }, h.SUPPORTS_TYPED_ARRAYS = typeof Float32Array < "u", h;
  })();
  o.Utils = n;
  var f = (function() {
    function h() {
    }
    return h.logBones = function(d) {
      for (var u = 0; u < d.bones.length; u++) {
        var M = d.bones[u];
        console.log(M.data.name + ", " + M.a + ", " + M.b + ", " + M.c + ", " + M.d + ", " + M.worldX + ", " + M.worldY);
      }
    }, h;
  })();
  o.DebugUtils = f;
  var l = (function() {
    function h(d) {
      this.items = new Array(), this.instantiator = d;
    }
    return h.prototype.obtain = function() {
      return this.items.length > 0 ? this.items.pop() : this.instantiator();
    }, h.prototype.free = function(d) {
      d.reset && d.reset(), this.items.push(d);
    }, h.prototype.freeAll = function(d) {
      for (var u = 0; u < d.length; u++)
        this.free(d[u]);
    }, h.prototype.clear = function() {
      this.items.length = 0;
    }, h;
  })();
  o.Pool = l;
  var v = (function() {
    function h(d, u) {
      d === void 0 && (d = 0), u === void 0 && (u = 0), this.x = d, this.y = u;
    }
    return h.prototype.set = function(d, u) {
      return this.x = d, this.y = u, this;
    }, h.prototype.length = function() {
      var d = this.x, u = this.y;
      return Math.sqrt(d * d + u * u);
    }, h.prototype.normalize = function() {
      var d = this.length();
      return d != 0 && (this.x /= d, this.y /= d), this;
    }, h;
  })();
  o.Vector2 = v;
  var c = (function() {
    function h() {
      this.maxDelta = 0.064, this.framesPerSecond = 0, this.delta = 0, this.totalTime = 0, this.lastTime = Date.now() / 1e3, this.frameCount = 0, this.frameTime = 0;
    }
    return h.prototype.update = function() {
      var d = Date.now() / 1e3;
      this.delta = d - this.lastTime, this.frameTime += this.delta, this.totalTime += this.delta, this.delta > this.maxDelta && (this.delta = this.maxDelta), this.lastTime = d, this.frameCount++, this.frameTime > 1 && (this.framesPerSecond = this.frameCount / this.frameTime, this.frameTime = 0, this.frameCount = 0);
    }, h;
  })();
  o.TimeKeeper = c;
  var s = (function() {
    function h(d) {
      d === void 0 && (d = 32), this.addedValues = 0, this.lastValue = 0, this.mean = 0, this.dirty = !0, this.values = new Array(d);
    }
    return h.prototype.hasEnoughData = function() {
      return this.addedValues >= this.values.length;
    }, h.prototype.addValue = function(d) {
      this.addedValues < this.values.length && this.addedValues++, this.values[this.lastValue++] = d, this.lastValue > this.values.length - 1 && (this.lastValue = 0), this.dirty = !0;
    }, h.prototype.getMean = function() {
      if (this.hasEnoughData()) {
        if (this.dirty) {
          for (var d = 0, u = 0; u < this.values.length; u++)
            d += this.values[u];
          this.mean = d / this.values.length, this.dirty = !1;
        }
        return this.mean;
      } else
        return 0;
    }, h;
  })();
  o.WindowedMean = s;
})(F || (F = {}));
(function() {
  Math.fround || (Math.fround = /* @__PURE__ */ (function(o) {
    return function(e) {
      return o[0] = e, o[0];
    };
  })(new Float32Array(1)));
})();
var F;
(function(o) {
  var e = /* @__PURE__ */ (function() {
    function a(t) {
      if (t == null)
        throw new Error("name cannot be null.");
      this.name = t;
    }
    return a;
  })();
  o.Attachment = e;
  var p = (function(a) {
    Q(t, a);
    function t(i) {
      var r = a.call(this, i) || this;
      return r.id = (t.nextID++ & 65535) << 11, r.worldVerticesLength = 0, r.deformAttachment = r, r;
    }
    return t.prototype.computeWorldVertices = function(i, r, n, f, l, v) {
      n = l + (n >> 1) * v;
      var c = i.bone.skeleton, s = i.deform, h = this.vertices, d = this.bones;
      if (d == null) {
        s.length > 0 && (h = s);
        for (var u = i.bone, M = u.worldX, C = u.worldY, S = u.a, L = u.b, E = u.c, A = u.d, g = r, m = l; m < n; g += 2, m += v) {
          var x = h[g], P = h[g + 1];
          f[m] = x * S + P * L + M, f[m + 1] = x * E + P * A + C;
        }
        return;
      }
      for (var k = 0, O = 0, R = 0; R < r; R += 2) {
        var D = d[k];
        k += D + 1, O += D;
      }
      var N = c.bones;
      if (s.length == 0)
        for (var m = l, L = O * 3; m < n; m += v) {
          var I = 0, y = 0, D = d[k++];
          for (D += k; k < D; k++, L += 3) {
            var u = N[d[k]], x = h[L], P = h[L + 1], T = h[L + 2];
            I += (x * u.a + P * u.b + u.worldX) * T, y += (x * u.c + P * u.d + u.worldY) * T;
          }
          f[m] = I, f[m + 1] = y;
        }
      else
        for (var B = s, m = l, L = O * 3, V = O << 1; m < n; m += v) {
          var I = 0, y = 0, D = d[k++];
          for (D += k; k < D; k++, L += 3, V += 2) {
            var u = N[d[k]], x = h[L] + B[V], P = h[L + 1] + B[V + 1], T = h[L + 2];
            I += (x * u.a + P * u.b + u.worldX) * T, y += (x * u.c + P * u.d + u.worldY) * T;
          }
          f[m] = I, f[m + 1] = y;
        }
    }, t.prototype.copyTo = function(i) {
      this.bones != null ? (i.bones = new Array(this.bones.length), o.Utils.arrayCopy(this.bones, 0, i.bones, 0, this.bones.length)) : i.bones = null, this.vertices != null ? (i.vertices = o.Utils.newFloatArray(this.vertices.length), o.Utils.arrayCopy(this.vertices, 0, i.vertices, 0, this.vertices.length)) : i.vertices = null, i.worldVerticesLength = this.worldVerticesLength, i.deformAttachment = this.deformAttachment;
    }, t.nextID = 0, t;
  })(e);
  o.VertexAttachment = p;
})(F || (F = {}));
var F;
(function(o) {
  (function(e) {
    e[e.Region = 0] = "Region", e[e.BoundingBox = 1] = "BoundingBox", e[e.Mesh = 2] = "Mesh", e[e.LinkedMesh = 3] = "LinkedMesh", e[e.Path = 4] = "Path", e[e.Point = 5] = "Point", e[e.Clipping = 6] = "Clipping";
  })(o.AttachmentType || (o.AttachmentType = {}));
})(F || (F = {}));
var F;
(function(o) {
  var e = (function(p) {
    Q(a, p);
    function a(t) {
      var i = p.call(this, t) || this;
      return i.color = new o.Color(1, 1, 1, 1), i;
    }
    return a.prototype.copy = function() {
      var t = new a(this.name);
      return this.copyTo(t), t.color.setFromColor(this.color), t;
    }, a;
  })(o.VertexAttachment);
  o.BoundingBoxAttachment = e;
})(F || (F = {}));
var F;
(function(o) {
  var e = (function(p) {
    Q(a, p);
    function a(t) {
      var i = p.call(this, t) || this;
      return i.color = new o.Color(0.2275, 0.2275, 0.8078, 1), i;
    }
    return a.prototype.copy = function() {
      var t = new a(this.name);
      return this.copyTo(t), t.endSlot = this.endSlot, t.color.setFromColor(this.color), t;
    }, a;
  })(o.VertexAttachment);
  o.ClippingAttachment = e;
})(F || (F = {}));
var F;
(function(o) {
  var e = (function(p) {
    Q(a, p);
    function a(t) {
      var i = p.call(this, t) || this;
      return i.color = new o.Color(1, 1, 1, 1), i.tempColor = new o.Color(0, 0, 0, 0), i;
    }
    return a.prototype.updateUVs = function() {
      var t = this.regionUVs;
      (this.uvs == null || this.uvs.length != t.length) && (this.uvs = o.Utils.newFloatArray(t.length));
      var i = this.uvs, r = this.uvs.length, n = this.region.u, f = this.region.v, l = 0, v = 0;
      if (this.region instanceof o.TextureAtlasRegion) {
        var c = this.region, s = c.texture.getImage().width, h = c.texture.getImage().height;
        switch (c.degrees) {
          case 90:
            n -= (c.originalHeight - c.offsetY - c.height) / s, f -= (c.originalWidth - c.offsetX - c.width) / h, l = c.originalHeight / s, v = c.originalWidth / h;
            for (var d = 0; d < r; d += 2)
              i[d] = n + t[d + 1] * l, i[d + 1] = f + (1 - t[d]) * v;
            return;
          case 180:
            n -= (c.originalWidth - c.offsetX - c.width) / s, f -= c.offsetY / h, l = c.originalWidth / s, v = c.originalHeight / h;
            for (var d = 0; d < r; d += 2)
              i[d] = n + (1 - t[d]) * l, i[d + 1] = f + (1 - t[d + 1]) * v;
            return;
          case 270:
            n -= c.offsetY / s, f -= c.offsetX / h, l = c.originalHeight / s, v = c.originalWidth / h;
            for (var d = 0; d < r; d += 2)
              i[d] = n + (1 - t[d + 1]) * l, i[d + 1] = f + t[d] * v;
            return;
        }
        n -= c.offsetX / s, f -= (c.originalHeight - c.offsetY - c.height) / h, l = c.originalWidth / s, v = c.originalHeight / h;
      } else this.region == null ? (n = f = 0, l = v = 1) : (l = this.region.u2 - n, v = this.region.v2 - f);
      for (var d = 0; d < r; d += 2)
        i[d] = n + t[d] * l, i[d + 1] = f + t[d + 1] * v;
    }, a.prototype.getParentMesh = function() {
      return this.parentMesh;
    }, a.prototype.setParentMesh = function(t) {
      this.parentMesh = t, t != null && (this.bones = t.bones, this.vertices = t.vertices, this.worldVerticesLength = t.worldVerticesLength, this.regionUVs = t.regionUVs, this.triangles = t.triangles, this.hullLength = t.hullLength, this.worldVerticesLength = t.worldVerticesLength);
    }, a.prototype.copy = function() {
      if (this.parentMesh != null)
        return this.newLinkedMesh();
      var t = new a(this.name);
      return t.region = this.region, t.path = this.path, t.color.setFromColor(this.color), this.copyTo(t), t.regionUVs = new Array(this.regionUVs.length), o.Utils.arrayCopy(this.regionUVs, 0, t.regionUVs, 0, this.regionUVs.length), t.uvs = new Array(this.uvs.length), o.Utils.arrayCopy(this.uvs, 0, t.uvs, 0, this.uvs.length), t.triangles = new Array(this.triangles.length), o.Utils.arrayCopy(this.triangles, 0, t.triangles, 0, this.triangles.length), t.hullLength = this.hullLength, this.edges != null && (t.edges = new Array(this.edges.length), o.Utils.arrayCopy(this.edges, 0, t.edges, 0, this.edges.length)), t.width = this.width, t.height = this.height, t;
    }, a.prototype.newLinkedMesh = function() {
      var t = new a(this.name);
      return t.region = this.region, t.path = this.path, t.color.setFromColor(this.color), t.deformAttachment = this.deformAttachment, t.setParentMesh(this.parentMesh != null ? this.parentMesh : this), t.updateUVs(), t;
    }, a;
  })(o.VertexAttachment);
  o.MeshAttachment = e;
})(F || (F = {}));
var F;
(function(o) {
  var e = (function(p) {
    Q(a, p);
    function a(t) {
      var i = p.call(this, t) || this;
      return i.closed = !1, i.constantSpeed = !1, i.color = new o.Color(1, 1, 1, 1), i;
    }
    return a.prototype.copy = function() {
      var t = new a(this.name);
      return this.copyTo(t), t.lengths = new Array(this.lengths.length), o.Utils.arrayCopy(this.lengths, 0, t.lengths, 0, this.lengths.length), t.closed = closed, t.constantSpeed = this.constantSpeed, t.color.setFromColor(this.color), t;
    }, a;
  })(o.VertexAttachment);
  o.PathAttachment = e;
})(F || (F = {}));
var F;
(function(o) {
  var e = (function(p) {
    Q(a, p);
    function a(t) {
      var i = p.call(this, t) || this;
      return i.color = new o.Color(0.38, 0.94, 0, 1), i;
    }
    return a.prototype.computeWorldPosition = function(t, i) {
      return i.x = this.x * t.a + this.y * t.b + t.worldX, i.y = this.x * t.c + this.y * t.d + t.worldY, i;
    }, a.prototype.computeWorldRotation = function(t) {
      var i = o.MathUtils.cosDeg(this.rotation), r = o.MathUtils.sinDeg(this.rotation), n = i * t.a + r * t.b, f = i * t.c + r * t.d;
      return Math.atan2(f, n) * o.MathUtils.radDeg;
    }, a.prototype.copy = function() {
      var t = new a(this.name);
      return t.x = this.x, t.y = this.y, t.rotation = this.rotation, t.color.setFromColor(this.color), t;
    }, a;
  })(o.VertexAttachment);
  o.PointAttachment = e;
})(F || (F = {}));
var F;
(function(o) {
  var e = (function(p) {
    Q(a, p);
    function a(t) {
      var i = p.call(this, t) || this;
      return i.x = 0, i.y = 0, i.scaleX = 1, i.scaleY = 1, i.rotation = 0, i.width = 0, i.height = 0, i.color = new o.Color(1, 1, 1, 1), i.offset = o.Utils.newFloatArray(8), i.uvs = o.Utils.newFloatArray(8), i.tempColor = new o.Color(1, 1, 1, 1), i;
    }
    return a.prototype.updateOffset = function() {
      var t = this.width / this.region.originalWidth * this.scaleX, i = this.height / this.region.originalHeight * this.scaleY, r = -this.width / 2 * this.scaleX + this.region.offsetX * t, n = -this.height / 2 * this.scaleY + this.region.offsetY * i, f = r + this.region.width * t, l = n + this.region.height * i, v = this.rotation * Math.PI / 180, c = Math.cos(v), s = Math.sin(v), h = r * c + this.x, d = r * s, u = n * c + this.y, M = n * s, C = f * c + this.x, S = f * s, L = l * c + this.y, E = l * s, A = this.offset;
      A[a.OX1] = h - M, A[a.OY1] = u + d, A[a.OX2] = h - E, A[a.OY2] = L + d, A[a.OX3] = C - E, A[a.OY3] = L + S, A[a.OX4] = C - M, A[a.OY4] = u + S;
    }, a.prototype.setRegion = function(t) {
      this.region = t;
      var i = this.uvs;
      t.rotate ? (i[2] = t.u, i[3] = t.v2, i[4] = t.u, i[5] = t.v, i[6] = t.u2, i[7] = t.v, i[0] = t.u2, i[1] = t.v2) : (i[0] = t.u, i[1] = t.v2, i[2] = t.u, i[3] = t.v, i[4] = t.u2, i[5] = t.v, i[6] = t.u2, i[7] = t.v2);
    }, a.prototype.computeWorldVertices = function(t, i, r, n) {
      var f = this.offset, l = t.worldX, v = t.worldY, c = t.a, s = t.b, h = t.c, d = t.d, u = 0, M = 0;
      u = f[a.OX1], M = f[a.OY1], i[r] = u * c + M * s + l, i[r + 1] = u * h + M * d + v, r += n, u = f[a.OX2], M = f[a.OY2], i[r] = u * c + M * s + l, i[r + 1] = u * h + M * d + v, r += n, u = f[a.OX3], M = f[a.OY3], i[r] = u * c + M * s + l, i[r + 1] = u * h + M * d + v, r += n, u = f[a.OX4], M = f[a.OY4], i[r] = u * c + M * s + l, i[r + 1] = u * h + M * d + v;
    }, a.prototype.copy = function() {
      var t = new a(this.name);
      return t.region = this.region, t.rendererObject = this.rendererObject, t.path = this.path, t.x = this.x, t.y = this.y, t.scaleX = this.scaleX, t.scaleY = this.scaleY, t.rotation = this.rotation, t.width = this.width, t.height = this.height, o.Utils.arrayCopy(this.uvs, 0, t.uvs, 0, 8), o.Utils.arrayCopy(this.offset, 0, t.offset, 0, 8), t.color.setFromColor(this.color), t;
    }, a.OX1 = 0, a.OY1 = 1, a.OX2 = 2, a.OY2 = 3, a.OX3 = 4, a.OY3 = 5, a.OX4 = 6, a.OY4 = 7, a.X1 = 0, a.Y1 = 1, a.C1R = 2, a.C1G = 3, a.C1B = 4, a.C1A = 5, a.U1 = 6, a.V1 = 7, a.X2 = 8, a.Y2 = 9, a.C2R = 10, a.C2G = 11, a.C2B = 12, a.C2A = 13, a.U2 = 14, a.V2 = 15, a.X3 = 16, a.Y3 = 17, a.C3R = 18, a.C3G = 19, a.C3B = 20, a.C3A = 21, a.U3 = 22, a.V3 = 23, a.X4 = 24, a.Y4 = 25, a.C4R = 26, a.C4G = 27, a.C4B = 28, a.C4A = 29, a.U4 = 30, a.V4 = 31, a;
  })(o.Attachment);
  o.RegionAttachment = e;
})(F || (F = {}));
var F;
(function(o) {
  var e = (function() {
    function p(a, t) {
      this.jitterX = 0, this.jitterY = 0, this.jitterX = a, this.jitterY = t;
    }
    return p.prototype.begin = function(a) {
    }, p.prototype.transform = function(a, t, i, r) {
      a.x += o.MathUtils.randomTriangular(-this.jitterX, this.jitterY), a.y += o.MathUtils.randomTriangular(-this.jitterX, this.jitterY);
    }, p.prototype.end = function() {
    }, p;
  })();
  o.JitterEffect = e;
})(F || (F = {}));
var F;
(function(o) {
  var e = (function() {
    function p(a) {
      this.centerX = 0, this.centerY = 0, this.radius = 0, this.angle = 0, this.worldX = 0, this.worldY = 0, this.radius = a;
    }
    return p.prototype.begin = function(a) {
      this.worldX = a.x + this.centerX, this.worldY = a.y + this.centerY;
    }, p.prototype.transform = function(a, t, i, r) {
      var n = this.angle * o.MathUtils.degreesToRadians, f = a.x - this.worldX, l = a.y - this.worldY, v = Math.sqrt(f * f + l * l);
      if (v < this.radius) {
        var c = p.interpolation.apply(0, n, (this.radius - v) / this.radius), s = Math.cos(c), h = Math.sin(c);
        a.x = s * f - h * l + this.worldX, a.y = h * f + s * l + this.worldY;
      }
    }, p.prototype.end = function() {
    }, p.interpolation = new o.PowOut(2), p;
  })();
  o.SwirlEffect = e;
})(F || (F = {}));
var F;
(function(o) {
  (function(e) {
    var p = (function(a) {
      Q(t, a);
      function t(i, r) {
        return r === void 0 && (r = ""), a.call(this, function(n) {
          return new o.webgl.GLTexture(i, n);
        }, r) || this;
      }
      return t;
    })(o.AssetManager);
    e.AssetManager = p;
  })(o.webgl || (o.webgl = {}));
})(F || (F = {}));
var F;
(function(o) {
  (function(e) {
    var p = (function() {
      function a(t, i) {
        this.position = new e.Vector3(0, 0, 0), this.direction = new e.Vector3(0, 0, -1), this.up = new e.Vector3(0, 1, 0), this.near = 0, this.far = 100, this.zoom = 1, this.viewportWidth = 0, this.viewportHeight = 0, this.projectionView = new e.Matrix4(), this.inverseProjectionView = new e.Matrix4(), this.projection = new e.Matrix4(), this.view = new e.Matrix4(), this.tmp = new e.Vector3(), this.viewportWidth = t, this.viewportHeight = i, this.update();
      }
      return a.prototype.update = function() {
        var t = this.projection, i = this.view, r = this.projectionView, n = this.inverseProjectionView, f = this.zoom, l = this.viewportWidth, v = this.viewportHeight;
        t.ortho(f * (-l / 2), f * (l / 2), f * (-v / 2), f * (v / 2), this.near, this.far), i.lookAt(this.position, this.direction, this.up), r.set(t.values), r.multiply(i), n.set(r.values).invert();
      }, a.prototype.screenToWorld = function(t, i, r) {
        var n = t.x, f = r - t.y - 1, l = this.tmp;
        return l.x = 2 * n / i - 1, l.y = 2 * f / r - 1, l.z = 2 * t.z - 1, l.project(this.inverseProjectionView), t.set(l.x, l.y, l.z), t;
      }, a.prototype.setViewport = function(t, i) {
        this.viewportWidth = t, this.viewportHeight = i;
      }, a;
    })();
    e.OrthoCamera = p;
  })(o.webgl || (o.webgl = {}));
})(F || (F = {}));
var F;
(function(o) {
  (function(e) {
    var p = (function(a) {
      Q(t, a);
      function t(i, r, n) {
        n === void 0 && (n = !1);
        var f = a.call(this, r) || this;
        return f.texture = null, f.boundUnit = 0, f.useMipMaps = !1, f.context = i instanceof e.ManagedWebGLRenderingContext ? i : new e.ManagedWebGLRenderingContext(i), f.useMipMaps = n, f.restore(), f.context.addRestorable(f), f;
      }
      return t.prototype.setFilters = function(i, r) {
        var n = this.context.gl;
        this.bind(), n.texParameteri(n.TEXTURE_2D, n.TEXTURE_MIN_FILTER, i), n.texParameteri(n.TEXTURE_2D, n.TEXTURE_MAG_FILTER, t.validateMagFilter(r));
      }, t.validateMagFilter = function(i) {
        switch (i) {
          case o.TextureFilter.MipMap:
          case o.TextureFilter.MipMapLinearLinear:
          case o.TextureFilter.MipMapLinearNearest:
          case o.TextureFilter.MipMapNearestLinear:
          case o.TextureFilter.MipMapNearestNearest:
            return o.TextureFilter.Linear;
          default:
            return i;
        }
      }, t.prototype.setWraps = function(i, r) {
        var n = this.context.gl;
        this.bind(), n.texParameteri(n.TEXTURE_2D, n.TEXTURE_WRAP_S, i), n.texParameteri(n.TEXTURE_2D, n.TEXTURE_WRAP_T, r);
      }, t.prototype.update = function(i) {
        var r = this.context.gl;
        this.texture || (this.texture = this.context.gl.createTexture()), this.bind(), t.DISABLE_UNPACK_PREMULTIPLIED_ALPHA_WEBGL && r.pixelStorei(r.UNPACK_PREMULTIPLY_ALPHA_WEBGL, !1), r.texImage2D(r.TEXTURE_2D, 0, r.RGBA, r.RGBA, r.UNSIGNED_BYTE, this._image), r.texParameteri(r.TEXTURE_2D, r.TEXTURE_MAG_FILTER, r.LINEAR), r.texParameteri(r.TEXTURE_2D, r.TEXTURE_MIN_FILTER, i ? r.LINEAR_MIPMAP_LINEAR : r.LINEAR), r.texParameteri(r.TEXTURE_2D, r.TEXTURE_WRAP_S, r.CLAMP_TO_EDGE), r.texParameteri(r.TEXTURE_2D, r.TEXTURE_WRAP_T, r.CLAMP_TO_EDGE), i && r.generateMipmap(r.TEXTURE_2D);
      }, t.prototype.restore = function() {
        this.texture = null, this.update(this.useMipMaps);
      }, t.prototype.bind = function(i) {
        i === void 0 && (i = 0);
        var r = this.context.gl;
        this.boundUnit = i, r.activeTexture(r.TEXTURE0 + i), r.bindTexture(r.TEXTURE_2D, this.texture);
      }, t.prototype.unbind = function() {
        var i = this.context.gl;
        i.activeTexture(i.TEXTURE0 + this.boundUnit), i.bindTexture(i.TEXTURE_2D, null);
      }, t.prototype.dispose = function() {
        this.context.removeRestorable(this);
        var i = this.context.gl;
        i.deleteTexture(this.texture);
      }, t.DISABLE_UNPACK_PREMULTIPLIED_ALPHA_WEBGL = !1, t;
    })(o.Texture);
    e.GLTexture = p;
  })(o.webgl || (o.webgl = {}));
})(F || (F = {}));
var F;
(function(o) {
  (function(e) {
    var p = (function() {
      function t(i) {
        this.lastX = 0, this.lastY = 0, this.buttonDown = !1, this.currTouch = null, this.touchesPool = new o.Pool(function() {
          return new o.webgl.Touch(0, 0, 0);
        }), this.listeners = new Array(), this.element = i, this.setupCallbacks(i);
      }
      return t.prototype.setupCallbacks = function(i) {
        var r = this, n = function(v) {
          if (v instanceof MouseEvent) {
            for (var c = i.getBoundingClientRect(), s = v.clientX - c.left, h = v.clientY - c.top, d = r.listeners, u = 0; u < d.length; u++)
              d[u].down && d[u].down(s, h);
            r.lastX = s, r.lastY = h, r.buttonDown = !0, document.addEventListener("mousemove", f), document.addEventListener("mouseup", l);
          }
        }, f = function(v) {
          if (v instanceof MouseEvent) {
            for (var c = i.getBoundingClientRect(), s = v.clientX - c.left, h = v.clientY - c.top, d = r.listeners, u = 0; u < d.length; u++)
              r.buttonDown ? d[u].dragged && d[u].dragged(s, h) : d[u].moved && d[u].moved(s, h);
            r.lastX = s, r.lastY = h;
          }
        }, l = function(v) {
          if (v instanceof MouseEvent) {
            for (var c = i.getBoundingClientRect(), s = v.clientX - c.left, h = v.clientY - c.top, d = r.listeners, u = 0; u < d.length; u++)
              d[u].up && d[u].up(s, h);
            r.lastX = s, r.lastY = h, r.buttonDown = !1, document.removeEventListener("mousemove", f), document.removeEventListener("mouseup", l);
          }
        };
        i.addEventListener("mousedown", n, !0), i.addEventListener("mousemove", f, !0), i.addEventListener("mouseup", l, !0), i.addEventListener("touchstart", function(v) {
          if (r.currTouch == null) {
            for (var c = v.changedTouches, s = 0; s < c.length; s++) {
              var h = c[s], d = i.getBoundingClientRect(), u = h.clientX - d.left, M = h.clientY - d.top;
              r.currTouch = r.touchesPool.obtain(), r.currTouch.identifier = h.identifier, r.currTouch.x = u, r.currTouch.y = M;
              break;
            }
            for (var C = r.listeners, S = 0; S < C.length; S++)
              C[S].down && C[S].down(r.currTouch.x, r.currTouch.y);
            r.lastX = r.currTouch.x, r.lastY = r.currTouch.y, r.buttonDown = !0, v.preventDefault();
          }
        }, !1), i.addEventListener("touchend", function(v) {
          for (var c = v.changedTouches, s = 0; s < c.length; s++) {
            var h = c[s];
            if (r.currTouch.identifier === h.identifier) {
              var d = i.getBoundingClientRect(), u = r.currTouch.x = h.clientX - d.left, M = r.currTouch.y = h.clientY - d.top;
              r.touchesPool.free(r.currTouch);
              for (var C = r.listeners, S = 0; S < C.length; S++)
                C[S].up && C[S].up(u, M);
              r.lastX = u, r.lastY = M, r.buttonDown = !1, r.currTouch = null;
              break;
            }
          }
          v.preventDefault();
        }, !1), i.addEventListener("touchcancel", function(v) {
          for (var c = v.changedTouches, s = 0; s < c.length; s++) {
            var h = c[s];
            if (r.currTouch.identifier === h.identifier) {
              var d = i.getBoundingClientRect(), u = r.currTouch.x = h.clientX - d.left, M = r.currTouch.y = h.clientY - d.top;
              r.touchesPool.free(r.currTouch);
              for (var C = r.listeners, S = 0; S < C.length; S++)
                C[S].up && C[S].up(u, M);
              r.lastX = u, r.lastY = M, r.buttonDown = !1, r.currTouch = null;
              break;
            }
          }
          v.preventDefault();
        }, !1), i.addEventListener("touchmove", function(v) {
          if (r.currTouch != null) {
            for (var c = v.changedTouches, s = 0; s < c.length; s++) {
              var h = c[s];
              if (r.currTouch.identifier === h.identifier) {
                for (var d = i.getBoundingClientRect(), u = h.clientX - d.left, M = h.clientY - d.top, C = r.listeners, S = 0; S < C.length; S++)
                  C[S].dragged && C[S].dragged(u, M);
                r.lastX = r.currTouch.x = u, r.lastY = r.currTouch.y = M;
                break;
              }
            }
            v.preventDefault();
          }
        }, !1);
      }, t.prototype.addListener = function(i) {
        this.listeners.push(i);
      }, t.prototype.removeListener = function(i) {
        var r = this.listeners.indexOf(i);
        r > -1 && this.listeners.splice(r, 1);
      }, t;
    })();
    e.Input = p;
    var a = /* @__PURE__ */ (function() {
      function t(i, r, n) {
        this.identifier = i, this.x = r, this.y = n;
      }
      return t;
    })();
    e.Touch = a;
  })(o.webgl || (o.webgl = {}));
})(F || (F = {}));
var F;
(function(o) {
  (function(e) {
    var p = (function() {
      function a(t) {
        if (this.logo = null, this.spinner = null, this.angle = 0, this.fadeOut = 0, this.timeKeeper = new o.TimeKeeper(), this.backgroundColor = new o.Color(0.135, 0.135, 0.135, 1), this.tempColor = new o.Color(), this.firstDraw = 0, this.renderer = t, this.timeKeeper.maxDelta = 9, a.logoImg === null) {
          var i = navigator.userAgent.indexOf("Safari") > -1;
          a.logoImg = new Image(), a.logoImg.src = a.SPINE_LOGO_DATA, i || (a.logoImg.crossOrigin = "anonymous"), a.logoImg.onload = function(r) {
            a.loaded++;
          }, a.spinnerImg = new Image(), a.spinnerImg.src = a.SPINNER_DATA, i || (a.spinnerImg.crossOrigin = "anonymous"), a.spinnerImg.onload = function(r) {
            a.loaded++;
          };
        }
      }
      return a.prototype.draw = function(t) {
        if (t === void 0 && (t = !1), !(t && this.fadeOut > a.FADE_SECONDS)) {
          this.timeKeeper.update();
          var i = Math.abs(Math.sin(this.timeKeeper.totalTime + 0.75));
          this.angle -= this.timeKeeper.delta / 1.4 * 360 * (1 + 1.5 * Math.pow(i, 5));
          var r = this.renderer, n = r.canvas, f = r.context.gl;
          r.resize(e.ResizeMode.Stretch);
          var l = r.camera.position.x, v = r.camera.position.y;
          if (r.camera.position.set(n.width / 2, n.height / 2, 0), r.camera.viewportWidth = n.width, r.camera.viewportHeight = n.height, !t)
            f.clearColor(this.backgroundColor.r, this.backgroundColor.g, this.backgroundColor.b, this.backgroundColor.a), f.clear(f.COLOR_BUFFER_BIT), this.tempColor.a = 1;
          else {
            if (this.fadeOut += this.timeKeeper.delta * (this.timeKeeper.totalTime < 1 ? 2 : 1), this.fadeOut > a.FADE_SECONDS) {
              r.camera.position.set(l, v, 0);
              return;
            }
            i = 1 - this.fadeOut / a.FADE_SECONDS, this.tempColor.setFromColor(this.backgroundColor), this.tempColor.a = 1 - (i - 1) * (i - 1), r.begin(), r.quad(!0, 0, 0, n.width, 0, n.width, n.height, 0, n.height, this.tempColor, this.tempColor, this.tempColor, this.tempColor), r.end();
          }
          if (this.tempColor.set(1, 1, 1, this.tempColor.a), a.loaded == 2) {
            this.logo === null && (this.logo = new e.GLTexture(r.context, a.logoImg), this.spinner = new e.GLTexture(r.context, a.spinnerImg)), this.logo.update(!1), this.spinner.update(!1);
            var c = this.logo.getImage().width, s = this.logo.getImage().height, h = this.spinner.getImage().width, d = this.spinner.getImage().height;
            r.batcher.setBlendMode(f.SRC_ALPHA, f.ONE_MINUS_SRC_ALPHA), r.begin(), r.drawTexture(this.logo, (n.width - c) / 2, (n.height - s) / 2, c, s, this.tempColor), r.drawTextureRotated(this.spinner, (n.width - h) / 2, (n.height - d) / 2, h, d, h / 2, d / 2, this.angle, this.tempColor), r.end(), r.camera.position.set(l, v, 0);
          }
        }
      }, a.FADE_SECONDS = 1, a.loaded = 0, a.spinnerImg = null, a.logoImg = null, a.SPINNER_DATA = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAKMAAACjCAYAAADmbK6AAAAACXBIWXMAAAsTAAALEwEAmpwYAAALB2lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDIgNzkuMTYwOTI0LCAyMDE3LzA3LzEzLTAxOjA2OjM5ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0RXZ0PSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VFdmVudCMiIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczpwaG90b3Nob3A9Imh0dHA6Ly9ucy5hZG9iZS5jb20vcGhvdG9zaG9wLzEuMC8iIHhtbG5zOnRpZmY9Imh0dHA6Ly9ucy5hZG9iZS5jb20vdGlmZi8xLjAvIiB4bWxuczpleGlmPSJodHRwOi8vbnMuYWRvYmUuY29tL2V4aWYvMS4wLyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxNS41IChXaW5kb3dzKSIgeG1wOkNyZWF0ZURhdGU9IjIwMTYtMDktMDhUMTQ6MjU6MTIrMDI6MDAiIHhtcDpNZXRhZGF0YURhdGU9IjIwMTgtMTEtMTVUMTY6NDA6NTkrMDE6MDAiIHhtcDpNb2RpZnlEYXRlPSIyMDE4LTExLTE1VDE2OjQwOjU5KzAxOjAwIiBkYzpmb3JtYXQ9ImltYWdlL3BuZyIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpmZDhlNTljMC02NGJjLTIxNGQtODAyZi1jZDlhODJjM2ZjMGMiIHhtcE1NOkRvY3VtZW50SUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDpmYmNmZWJlYS03MjY2LWE0NGQtOTI4NS0wOTJmNGNhYzk4ZWEiIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDowODMzNWIyYy04NzYyLWQzNGMtOTBhOS02ODJjYjJmYTQ2M2UiIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHRpZmY6T3JpZW50YXRpb249IjEiIHRpZmY6WFJlc29sdXRpb249IjcyMDAwMC8xMDAwMCIgdGlmZjpZUmVzb2x1dGlvbj0iNzIwMDAwLzEwMDAwIiB0aWZmOlJlc29sdXRpb25Vbml0PSIyIiBleGlmOkNvbG9yU3BhY2U9IjY1NTM1IiBleGlmOlBpeGVsWERpbWVuc2lvbj0iMjk3IiBleGlmOlBpeGVsWURpbWVuc2lvbj0iMjQyIj4gPHhtcE1NOkhpc3Rvcnk+IDxyZGY6U2VxPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0iY3JlYXRlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDowODMzNWIyYy04NzYyLWQzNGMtOTBhOS02ODJjYjJmYTQ2M2UiIHN0RXZ0OndoZW49IjIwMTYtMDktMDhUMTQ6MjU6MTIrMDI6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE1LjUgKFdpbmRvd3MpIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDpiNThlMTlkNi0xYTRjLTQyNDEtODU0ZC01MDVlZjYxMjRhODQiIHN0RXZ0OndoZW49IjIwMTgtMTEtMTVUMTY6NDA6MjMrMDE6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCBDQyAoV2luZG93cykiIHN0RXZ0OmNoYW5nZWQ9Ii8iLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249InNhdmVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjQ3YzYzYzIwLWJkYjgtYzM0YS1hYzMyLWQ5MDdjOWEyOTA0MCIgc3RFdnQ6d2hlbj0iMjAxOC0xMS0xNVQxNjo0MDo1OSswMTowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0iY29udmVydGVkIiBzdEV2dDpwYXJhbWV0ZXJzPSJmcm9tIGFwcGxpY2F0aW9uL3ZuZC5hZG9iZS5waG90b3Nob3AgdG8gaW1hZ2UvcG5nIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJkZXJpdmVkIiBzdEV2dDpwYXJhbWV0ZXJzPSJjb252ZXJ0ZWQgZnJvbSBhcHBsaWNhdGlvbi92bmQuYWRvYmUucGhvdG9zaG9wIHRvIGltYWdlL3BuZyIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6ZmQ4ZTU5YzAtNjRiYy0yMTRkLTgwMmYtY2Q5YTgyYzNmYzBjIiBzdEV2dDp3aGVuPSIyMDE4LTExLTE1VDE2OjQwOjU5KzAxOjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgQ0MgKFdpbmRvd3MpIiBzdEV2dDpjaGFuZ2VkPSIvIi8+IDwvcmRmOlNlcT4gPC94bXBNTTpIaXN0b3J5PiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo0N2M2M2MyMC1iZGI4LWMzNGEtYWMzMi1kOTA3YzlhMjkwNDAiIHN0UmVmOmRvY3VtZW50SUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDo2OWRmZjljYy01YzFiLWE5NDctOTc3OS03ODgxZjM0ODk3MDMiIHN0UmVmOm9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDowODMzNWIyYy04NzYyLWQzNGMtOTBhOS02ODJjYjJmYTQ2M2UiLz4gPHBob3Rvc2hvcDpEb2N1bWVudEFuY2VzdG9ycz4gPHJkZjpCYWc+IDxyZGY6bGk+eG1wLmRpZDowODMzNWIyYy04NzYyLWQzNGMtOTBhOS02ODJjYjJmYTQ2M2U8L3JkZjpsaT4gPC9yZGY6QmFnPiA8L3Bob3Rvc2hvcDpEb2N1bWVudEFuY2VzdG9ycz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz7qS4aQAAAKZElEQVR42u2de4xVxR3HP8dd3rQryPKo4dGNbtVAQRa1YB93E1tTS7VYqCBiSWhsqGltSx+0xD60tKBorYnNkkBtFUt9xJaGNGlty6EqRAK1KlalshK2C8tzpcIigpz+MbPr5e5y987dM2fv4/tJbjC7v3P2+JvPnTMzZ85MEEURQhQClUpB7gRBAECUYiYwH6gDqoEKoA1oBDYCy4OQJgB92R3yq2S5yRilWASs6CZ0DzA5CNmn/ObOOUpB7kQpRgNLcwj9AHCnMiYZfXIT0C/H2DlRSs0gyeiPaQ6xg4FapUwy+mKUY/wwpUwy+uK4Y/xhpUwy+mKfY3yTUiYZfdHiENsahBxRyiSjL5odYncpXZLRJ3sdYhuVLslYKDKqZpSMBXObVs0oGQumA6OaUTL6Iwg5CBzNMXy7MiYZffNCDjH7g5DdSpVk9M36mGKEZOwxq4Fj3cT8UmmSjEm0Gw8At2UJaQhCtilTeeRWM5EdkmVfOwCIUtQBE4AqILC1ZQuwPgjpSKryWwgy1gfZfjsQ886IKFY2xO9N0jOR69srDOAtzCyYFuCUSrcg6AOcBIYCY4C3gVeT+uNJyvg94GPAxzFjcDuBl4C/AP+UBwXBR4AaYDYwDvgr8Drwi1KScRnwXfut6wNcYT+7Ma97LgX+JRd6jfOAucAXgCvTfl4DvAuMtJVJ0cu41IoYWRHTGWM/1TZmq/2fF8nR14r4U2BQF7+LgMW2k7bY54X4Htr5EvD99s5SlriPArcAY+VGsh1YYDpwMzAgSwy2svhWscpYA/wkx9gKm5S5wBA5kgjnAJcDX7NNpVxcWAZMLUYZJwHDHeKrgXnAdWjZlSS4BLgVuMzRlxt9eeNTxsG2veFyy7gQWAR8Sq54byfeYDssAx3LqLabJldBytgMHMjjuPHAQvTOsU++aJtE/fI4dpevTqZPGV+2veN8+DTwIHCBr29hmVJhJXwA+GAex7cBjxZjm7EFWAL8DfeX39s7NPOy9PKEO7XAV+k8xJYLrcDPgL8Xo4xgJqIuA7bkeXw9ZsBVxMMMYEqex64FfuO7e++bTcAPgD8Bpx2PvRSYKIdi61DOs3edXImAV4Cv2zJsKnYZ24B/AJ+xteRrwAmHBF4mj2JhEnCRg4QnrYh3YZ5NH/J9gUmP5zXYtsdsW+Pl8vffkEex8I5D7HHgGeBhe0dLhKRlbMJM298NXI8Z68rGk8AGeRQLu4DHMGOL2dgJPA78AXguyQvsjScdrTYp2zBDPzfbXl7mmNc64B7MFCbRc/bbfPYHrs343WnbZHsG+BXwZ8y65JS6jOnfwPuBg8BnMQtxjsWsh/0IsNJ2fkR8bAHutbfhG2x7vp9tDzZiFs5/Non2YaHJ2N6OWQf8BxiBeRx4EDPZ9nm544WNVsLtwFWYJ2Wh/fmO3ryw3noHpiv6YyZ5NsuXROhrRypeAv7nfHQJvAOTjbclYuJ3pWcL6YL03rSQjEJIRiEZhZCMQjIKIRmFZBRCMgrJKIRkFJJRCMkoJKMQklFIRiEkoxCSUUhGISSjkIxCSEYhGYWQjEIyCiEZhWQUQjIKySiEZBSSUQjJKCSjEAVCJUAQmCWPoxSjgZuAaZgF348D+zD7ADYDe+2nGWgJQg52dVJvSzOLgqHdmU5ln2IYZou9861Do+x/j8Ss2z7AOrQJWBOEZtetKIrMmt5BEBClWAQsxW3b16OY/QHXA6uD0GzpG0VRPmt6i2KSMeyQrxpYgNl4dCJmV7NcOQEsCULu6ZCR+mAmZiOannAMuC0IWS0Zy0PGKMUCzFZug3p4ullsiJ5obzPOj+H6BgGrohR1KqrSx5bzqhhE7PCvXcY4BZqgoioL4iznunQZq2M8cZXKqSyIs5yr02WsiPHEaiyWSbMxxnNVpMvYFuOJj6mcyoI4y7ktXcbGGE/conIqC+Is58Z0GTfGdNIGzJijKH3W2/KOg43pMi4n//2F92P2KJ4ShCwMQvT4pRwajCFRELIQmGLLf3+ep9pj/TvjCcwI4E5gDp1H0VsxO7k3Zvy7PQjZnXl2DXqXhYydiFKMAcYD44CajH+HZIQfBdYCtwch+854HJh2wkqgFhgGHAaagpAjLhcqGctTxqxOpKgCRgNDMXuK7whCTqU7U9khz3ucAv59xomUe9FVhePGEfs5q1eaQiYKBskoJKMQklFIRiEko5CMQkhGIRmFkIxCMgohGYVkFEIyCskohGQUklEIySiEZBSSUQjJKCSjEJJRSEYhJKOQjEJIRiEZhZCMQjIKIRmFZBSijGXMvIZ+KpZEaF8qeygwHOjb2xdUWQBJqQL6ADOBi4GHMGuGH5Iv3hiG2SJtIWaV4mZgB/AadF6jvVxkvAKzv3UdMNX+bDJm9fx10PV+1qLHIl4P3GLzfh3QBLwKbAZ+DJwuFxkDm5CZmN0Vzsv4/TTMyviVwGOYnRZEPAwBZgDfAC5K+/lo+5kKXAjcBzwPnCz1NuP77LfxO12I2M7FNmFXE+++huVOPfDNDBEz25FzgHuBa4Bzk8x/0jJeCiwCFmP2BsnGh4BbgYFyKDZmZRExnTpbGcywHZySuk0PsbeAG4HZDt+2C6yMb8mjWHgXs+NFd5v09Ac+AYzC7An0EPBKqdSM1wDfBqY7Vvubk263lDhPYHamypVa4MvAHUCq2GvGgcB8YAEwKQ/5nwa33blEVrYDLwJXOhxzLvBJzDhkK/BCMdaMA4C5wF2Y4RrXv7UF+KO9tYh42A08msfoRxVwLfBDYGwxyliLGUMclMexL9rOy075EyvvAKuBlcCbeTa3Pl+MMk7GbP/qyiHg18BWueOFNnu3ymeP8X62h11dbDKm7K3a9Zv7e+BJOeOVRmCNvQO5cgmdt4AueBkH5zCE0FWHpQH4r3zxzlPAw3kcdxg4VmwybnaMfx1YAWxTpyURjtj24wpHuZ7C0yNanzL+FnjZIX4lsEGOJEorcDewKcf4vTb+ZLHJuAeYBxzvJm4/8CPg58AJ+ZE4BzBDNk93k//jwOeAN4qxNw1m5sdV9jZwtlvv48ADujX3GpFtUt0OhPZnJzN63wdtOW7xeSFJPJvehBnBv8/2ricAp2wb8UHgETRvsRDYCiy3IrbPCWi0Mt4BPOf7AoIoivycub5TR/rDmBkjs4Df2fbHJjlQcLwfuNyW13rMXILOkyQ2REUtI5jnnG+mNRFOF3Gh1dlavgozhHUMaLEFGJWImBVnbT4VlYwlSBCYL1iUYgGw6ixhDUHIwo4GmfIrGX3JGKWotj3KbM/cpwQh2yRjYfWmS5EFdD/54ytKk2RMgukxxQjJ2GMm5hAzPEoxRqmSjN6IUgwj9xkr45UxyeiTkQ6x45QuyeiT8x1ia5QuyeiTUaoZJWMxyqiaUTIWzG1aNaNkLJgOzJAoRZVSJhl9McIxfrRSJhl94fq241ClTDL6Yq9jvCYNS0ZvuEwGPopZmlhIRi+sIfeXxtYGIaeUMsnohSCkCViSQ+gezAtOwiW/mvzpkKz3ZnrPxCz1V4dZd6YC8+JSI2YNm+VWXE2ulYyiGPk/nslB8d6ayMkAAAAASUVORK5CYII=", a.SPINE_LOGO_DATA = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAKUAAABsCAYAAAALzHKmAAAACXBIWXMAAAsTAAALEwEAmpwYAAALB2lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDIgNzkuMTYwOTI0LCAyMDE3LzA3LzEzLTAxOjA2OjM5ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0RXZ0PSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VFdmVudCMiIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczpwaG90b3Nob3A9Imh0dHA6Ly9ucy5hZG9iZS5jb20vcGhvdG9zaG9wLzEuMC8iIHhtbG5zOnRpZmY9Imh0dHA6Ly9ucy5hZG9iZS5jb20vdGlmZi8xLjAvIiB4bWxuczpleGlmPSJodHRwOi8vbnMuYWRvYmUuY29tL2V4aWYvMS4wLyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxNS41IChXaW5kb3dzKSIgeG1wOkNyZWF0ZURhdGU9IjIwMTYtMDktMDhUMTQ6MjU6MTIrMDI6MDAiIHhtcDpNZXRhZGF0YURhdGU9IjIwMTgtMTEtMTVUMTY6NDA6NTkrMDE6MDAiIHhtcDpNb2RpZnlEYXRlPSIyMDE4LTExLTE1VDE2OjQwOjU5KzAxOjAwIiBkYzpmb3JtYXQ9ImltYWdlL3BuZyIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDowMTdhZGQ3Ni04OTZlLThlNGUtYmM5MS00ZjEyNjI1YjA3MjgiIHhtcE1NOkRvY3VtZW50SUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDplMTViNGE2ZS1hMDg3LWEzNDktODdhOS1mNDYzYjE2MzQ0Y2MiIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDowODMzNWIyYy04NzYyLWQzNGMtOTBhOS02ODJjYjJmYTQ2M2UiIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHRpZmY6T3JpZW50YXRpb249IjEiIHRpZmY6WFJlc29sdXRpb249IjcyMDAwMC8xMDAwMCIgdGlmZjpZUmVzb2x1dGlvbj0iNzIwMDAwLzEwMDAwIiB0aWZmOlJlc29sdXRpb25Vbml0PSIyIiBleGlmOkNvbG9yU3BhY2U9IjY1NTM1IiBleGlmOlBpeGVsWERpbWVuc2lvbj0iMjk3IiBleGlmOlBpeGVsWURpbWVuc2lvbj0iMjQyIj4gPHhtcE1NOkhpc3Rvcnk+IDxyZGY6U2VxPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0iY3JlYXRlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDowODMzNWIyYy04NzYyLWQzNGMtOTBhOS02ODJjYjJmYTQ2M2UiIHN0RXZ0OndoZW49IjIwMTYtMDktMDhUMTQ6MjU6MTIrMDI6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE1LjUgKFdpbmRvd3MpIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDpiNThlMTlkNi0xYTRjLTQyNDEtODU0ZC01MDVlZjYxMjRhODQiIHN0RXZ0OndoZW49IjIwMTgtMTEtMTVUMTY6NDA6MjMrMDE6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCBDQyAoV2luZG93cykiIHN0RXZ0OmNoYW5nZWQ9Ii8iLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249InNhdmVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjJlNjJiMWM2LWIxYzQtNDk0MC04MDMxLWU4ZDkyNTBmODJjNSIgc3RFdnQ6d2hlbj0iMjAxOC0xMS0xNVQxNjo0MDo1OSswMTowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0iY29udmVydGVkIiBzdEV2dDpwYXJhbWV0ZXJzPSJmcm9tIGFwcGxpY2F0aW9uL3ZuZC5hZG9iZS5waG90b3Nob3AgdG8gaW1hZ2UvcG5nIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJkZXJpdmVkIiBzdEV2dDpwYXJhbWV0ZXJzPSJjb252ZXJ0ZWQgZnJvbSBhcHBsaWNhdGlvbi92bmQuYWRvYmUucGhvdG9zaG9wIHRvIGltYWdlL3BuZyIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6MDE3YWRkNzYtODk2ZS04ZTRlLWJjOTEtNGYxMjYyNWIwNzI4IiBzdEV2dDp3aGVuPSIyMDE4LTExLTE1VDE2OjQwOjU5KzAxOjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgQ0MgKFdpbmRvd3MpIiBzdEV2dDpjaGFuZ2VkPSIvIi8+IDwvcmRmOlNlcT4gPC94bXBNTTpIaXN0b3J5PiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDoyZTYyYjFjNi1iMWM0LTQ5NDAtODAzMS1lOGQ5MjUwZjgyYzUiIHN0UmVmOmRvY3VtZW50SUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDo2OWRmZjljYy01YzFiLWE5NDctOTc3OS03ODgxZjM0ODk3MDMiIHN0UmVmOm9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDowODMzNWIyYy04NzYyLWQzNGMtOTBhOS02ODJjYjJmYTQ2M2UiLz4gPHBob3Rvc2hvcDpEb2N1bWVudEFuY2VzdG9ycz4gPHJkZjpCYWc+IDxyZGY6bGk+eG1wLmRpZDowODMzNWIyYy04NzYyLWQzNGMtOTBhOS02ODJjYjJmYTQ2M2U8L3JkZjpsaT4gPC9yZGY6QmFnPiA8L3Bob3Rvc2hvcDpEb2N1bWVudEFuY2VzdG9ycz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz5ayrctAAATYUlEQVR42u2dfVQV553Hv88AXq5uAAlJ0CBem912jQh60kZ8y0tdC5soJnoaXzC4Tdz4cjya1GN206Zqsu3Jpm6yeM5uTG3iaYGoJNFdEY3GaFGD0p4mqS9AXpoV0OZFUOHS3usFuc/+Idde8M7M8zr3gsw5HOCZZ2aemecz39/LPPMMMLAMLDG2kIFzjqmFDiDZP6AkN3gf0gEob8x2kj4MCx2AMnbb1BcVld6IwJJ+0oYb2YTT/gYq6WPHJP3gmtA+Biztr1CSKLevLytprCkh7ctQkj4KsK590hiGlsbSOcVCR5I+BC7pA6BEAzQaq1DqhFFH3Vg16TSG4KHRgNPpyFd1XdIHAyrdCkhjADgaTSiJw/VIP1BSp6GhUQSOOgmlkzASxSqq2zpQB+ClGiGlUb65tAUZOmDUAa5u5XRSgajibVRCR3VCSRyoQwSBE/EvYy3YkYGESuwrpuAkDgPJCg4RhFVUNUkMw6hK6agDcFInoSQxAqNqWHVdD6fUhQqUsfiaVCN41IlOUBEx88JIJCCU8T+tttOR6pEFUgRQXoCVrydRAJJw/G+2jig6llN+p0wnsZpYXsAoxzGognYzryeagBRRR8L5t4iCRsvflDHnIopINcCpGkzlUOoCkqWcKABdlznXZa5lTK7Z/6zlvMeXXqdTCVWoI696ygZN0YZSp/KxQCijmiJgUp3gyQBpVy4Kq4gPqhpWlQrCCxgPeLz70wqmyqcksgELS5kKQEWCIBn1FEn7qFBKKgmnajCloZQtlwWSZR0PoCJBkJMDMnT4iSxlsQCmFJQidVUASQS3ZSlXadqhWDVkTCoLiDKw8t40XOU6oFQBJMtvkSBJ1ITLqKaOgIbVF+y9jd3/omAqVUtViigTTfMAyKqqKnxOlWZcFEzVZjrSb11gaodSRiVVAikCo4hKyjzpkh3No8tf1AUmrxnXCmW0gSSCcIqki4hipbTqGNU+IwuMqsAUfSLVoywezi46gGSFU8Sk86bBKOd1oJzrwuuEQLIbBU8sfiPC37DYhuW8pEfex3NcQBUqyVrO+7edeZdNIfFCSi22oZwdSkzUk1jAaQcrGMA0O34kUJXAaAYl0aSMkRQMjODxAArGct6onPf68CgLbGCkNv4r4axrp4wwUUc7CAnDdkzXJ14SNFHVEQFNRjHtbg7ZoMfuOlHGDiG9/DPCCDgLjDBROFgon50ZV6mQ1/YVzwmgSniJhFryAMpybB4TLjJLRqTOZPUbZYIrwmiqZYC02lboXOIV0C3qm5nVZQGSSCiuaETOe5PygEg4AbXyM1lhJIxqqiWYUQklUaiShMGc2gFpBbDdcXl9StHXka38KVZ/i8V35DXzZibcClIWtRS90ZQpJa/ysZhtHiBV+pk8imm2TjTFwxsQWIHL42PaRd4iroW0ksZLKAFv5MoKbyQQVZl1mShc5LxYOo4Fxt4KyZPysXMhrOrwqKWyHGa8wiCHVSXtzDaxgYSA36xDEk4V5lvGpxRVIZb8pZ0Z571x7My6Up9S17SBhMGvjASfocCUi0TkvOaZMJh11vSPGVSEcT0s1JYyKKnu1BABQOMloeJ9ssMCg53phoKUkVDQs2MMcvNSsZICwfYufPZVB+o/86HxbAAXP/ah9Z2LuPSnAK5wqB1PLlIkmGEBkzVbwKuWolkE6ddXeYeb2akfEfwRTRnZRf89/r84Bf81NB73WtDQ+VUHKocfw1ob35J3QAXrYApq8X94edBmvVUZS9si/Qbr/wacWXgeN/LCCAHAQ+sNhvqhOiQOcNucZMKwQXh42XCkM95AELjZRFNjRCAPSxSmAbXlKXlNOlF0wj2WoqKi5Hnz5mdTGiQA8OCDDx4T6aiNGzeOufnmm5MBoKysrHbfvn3tVhf40hX8MSked1u1LUhx+e1mXGBIz1znC77xxtaJhmFQwzDo3LmPHBdJ6ezZs2cqIVf3UVt7unH16tWNsB4gwpItsPKdlSfTZd4EZH1MKKJkEX8WLfqnlPXr1/8oNTV1QQ8QgsG2pqamX+TkZG+OtP/y8jcn5efnb+nq6vKmpg7NfeONrZOmT5++3uVyZYTvp76+vjg3d8IWs2vy2DDcsunvUDrIQLrZBT3fgXduO4ZnrEx1aWlpbkHBrM0AkJyclFVZWZl3990TngpvT1dXl7e29vRLU6dOLTcxmT3+P3Hi5NLMzMwlhmEkh7fH7/cfraqqemHevLknTMy10yZci/mO2rR5GzZs2JaamrogGAy2Xbx4cWtTU9OLXq93r2EYyR6P52kLdQQAxMXFJR05cvSRGTNmvOZyuTJ8Pl+d1+utCa0fPXr0kydOnHzSzFRu+RLNM09j7qc+vHY5iIbe7Wu7gt8t+wwbGG9YAEBV1eHvT516z0uh9vj9/tpQW7Ozc54rL39zkt1Dh6+/Pl/h8XieNgwjORAInGpqanqxvb19TzAYbHO73VPz8vK2vfXW29kKUnuOLIZitYWFryjlq1RXV890uVxjAWD37oqFo0Z5fjR2bNYvRozIWLFx48b7zpw5s8EmqgYA5OTkrA8EAud2767452HD0ueOGJHxxLp16x7w+Xx1AODxeB5buXLlCDOf9d2L8H7rd3jFfQSzv/MBpjx7BrP/4yzmP1qP76W8j6U7m3HJzpoEg8Fr5ePHj1/n8/nqtmx5fe6wYemPpKffNreysnJxaP2999672sqi/eEPJ5YkJiZmAcDhw1WP3nrrLQVjx2Ztysi4ffmqVSunBAKBU4ZhJE+bNu1VDj81qosRZfVjyU0CABk6dGgmAHR2djYVFRWdCl+3du1Pzo0bl7PZDPxwCHw+X11R0aOPLFy4sCa0vrj4P8+9++7+jaE6P/jBY3NYgrTft8P3s0Y0rPkcn5R9jRaGtNR159zdnieeeuqpulBZYeGCmsbGxtcBwO12jzFT3Iceejh55MiRTwBAQ0PDzwsKCqrDj1NSUuL98MMPX+hW3pHvvXdwqoK+1jELs3KlVGHmbZPVgUBHGwAkJCRklpSUjBW9MB988PvXwwKaa3UWLVpUEwgEzgFAamrqnWYppZ+Owt8eHoeCfdmY/vYYTH43B9/76Nt4tP5uLHlrDCbyntd77x0oPnDggLd3nbNnz9aG/i4vf3NipG1XrFgxKeRD7tq1a2+k4+Tn570fDAbbAOD222/P5uwTJ9/41BJ9izaOKXVQXFxcWVxc/IxhGMmzZj20+5NPPn21vLx8+9q1Pzlrd/xwpWxtbfWawev3+//kcrkyUlJSJpi1618z8cs4guRIx/mmG34Aky2i0+si1bC29VgX1s4e7Q+vl5aWNiJUmJ2dnVlRUTGiWxUpAISi8M7OzqaQ66O4r7UM4HDyxTEpn+XXv/5V2/Tp/1CYn/+PryQkJGSmp6cvXbVq1dLFixdX19TUbJ49++Fjsvm1L774oqYbSMtcpOk6YrqOuwND6S7W/dx///0l6CdLfBQVkntZuHDhqfnz58/84Q9XP5iZmbkgMTExa8iQIZOnTZs2+fPP/2/7HXd8Y63uNrR04vitgzAt0rqvOnAADgyCjbScOXNmAyGEAoBhGNd+E4Jrqrl//77KGwlK6hSY27Zta922bdtWANsrKiomT5iQ+y+JiYlZaWlp83bs2LlvzpzZx0X3PXz48Nyr/utV3zLS8vgn+Onr3wK9ZRDuI93X7wpFW9Nl7J51GpsQpY+4jxuX8yqsHy9SxMAH5p1KCfGAq3R/BQUF1cuXLy8KOfKjRo3KipDQ7bGkpKQkmbXrpptuGg0AXq+33uyglRfQdtsxPJ15HJOL6pE/4xS+m3AY373jt3j59F/gtzn369oUUrXedQn5a3lYnR7n5fP5rvmdW7ZsyXKYHW1fVjMcbqjyLyjs2PF2W0dHx1nWHdx117cfz8vLS+q9r4MHD82Ji4tLAoDm5uY6WM/6gHMBdJZ+jfN7LqAVzn0cqceyb9871X/NZ9433+6GjCXwoqWUvJ1hCUFjY9O/19XVLSssLOwR+R469JsHQsnjy5cvtyHSY6swNRo8ePCdpaVl5WVlZbmhstLS0gnjx49fBVx9vPfssz/eEaFN17VrrQee34zDA59OwIrWKdjsvwf/uysL90TYhjKCyzPvOH3++efPtrS0bO+OxOedOHFyaaR9VldXz2hsbHpRQf9R8E05I8RFvNM+oY1Pavpik8vlykxJSSl85ZVNz7z00svvB4NBEhcXlxwG5OlJkyZuh/mLUSGTVzd48OA7Z84s+OX5883nuvd97Znz0aNH/u3gwYPeCBexRwDzq7/HXYvS8VrvE5mSjO8DOGzRCT0nc+oOTnp3bASzHrFD16xZs2HTpk1ZiYmJWR6P5+lLl1qXBAKBU6H1brd7Snh1sD2rjqqJNxw6sOzkobSqquoFv99/NHShhwwZMjkEZEtLy/Zly5YtMrubwzv40KFDL3/00UfPdXV1eV0uV0YIyEAgcK6iYtcTs2bN2m+iCD3KvuyAN1LDr1D8xSSwuFYW3p7m5mavHRQXLlxoM1FdunPnjtbly5cXNTQ0/DwYDLYZhpHsdrunhH6Aq4MyPv744yWM6kwZ1VFr7tDub7P/HR8lBIAUFRWlRBi2Fn6DXXec0CghAKisrFxcWLjgOABSVlY2MQRG92M+rhfHGnKxZmQiFgAgXRTeLzuwf+Vn+O//aUErg2ljnemMdZQOBUBLSkrGpqXdkhQCPz8/7wjYBveKjBLinenN1nIAoCpHnvNOEGD2zo0RATKrdbZvPJaXvzk5BOXevXsfnz9/Xg3jednlYsnEJAz5hhvuPRdwsfUKuhhUHzYdZjWvJAuwlBE8ltHoVnDa3UDCUKp8omM3QwPrdlb7sVuHSD5luLns/ttquhIzGCP6eMe9aD/uRTtnMAfoeSXCDkie9rGabuX+qFOPGSMFHdREgVjA6w0N7xt2PLNWUCur8ZwHnu8kYWTbFfiS4zHY3wX/nFr8llEZRGG0U1Fq4xebKR+PD6kN1mg80bEC1Awyq1dCbUG0UEpWv9sUrCcz8OOkePR4Xp79N7jr5J8RsIFSdo5yW//SQkV5VZIKmmKhaDxeEkKr90/AYM5Z1NIOFtuX4ktLS08TQhZRSklpaWkt+N+tNl28XfhjOJS+LtSf/DMuC4Aoo5i8QFKbDIFTSfbIT7M4Ah2WYEck+FH9Zh/AN+EVU6RtBuo3B2PQ1tGYlZYAT3sXvljXgMqdzWiTMN0qfEuegEVHlC38eq1IR7BOJgAOIKEATqt9mKWw7CJuFZPx83x+xA5Klq8+iAIJsL8kZrdOGso4zo5gnQhV9qsOVuMheYbYs3yvmmc9lagn+iUGarMPVsW0y5FSAUXXYuLjBXZMBLdhmU02UtBjFQzx+ps850EtoLfzpbnVgUN5VOQxWdVR9MtmUiki1Skhq3wiTIBkgRMCKR/CWM6bV+W581kHL7DkMXk+1sQKJK9VcWQEEq/5FjXhIsGF7Ddt7MDhufAqTBYFlHzuWORLYpRBSXnNtowvKaWULDN42W3D+hkNMOQhAfNEN8/stay5U5nv3/AGPLI5TFa/kgrUlb05uW7gOEF1UqWWdhOk8kS9Ks0uT3BDGbbn8Sl54VTla1qZZ542Sy9xnGkgcAAkOoMukQBT1L+TMfci7gGvOecxsSzmXTaYYTk/nuvODSVLmchH5cH5t+hMuyyjuFmdedFXGyij/waoiXhlHlOyHgsMbY5q9G3le/LOu83ywSHRNBXLY1GRtA9vwMPaqU59wVZFG6DoWkkppajS8XyHW8V3t4lEekP09VS7kTp2Ebmsvyli0kWyBSqsyHVlcYIAyviWsmASThhVBjY84wtZ9suaK5RJy4iaaNa8pVKVNINSRi11gSkSheu4o82UkAVmnhymKIgi0TnA/8hRNPKmqqHkVUsnwBR91Meqjiocd5ZASgQKFT4nT1DDA6TUdSOaymXAFEkniZp7FSOBdAU9LOkVqgBQp4BkLieKgLUqkzXvVuDx7EMEQl35URHoIAmODMAqFJIZyjjNKqriE8a8yXynAxsIdgRrp/KabxkYow6kjFKIqqjKZDnhvAFELYNO8w3Jjuc15yLmmjWoUQZlnIT5UgGmjGqyjLtUrXy6oGRRTl2QivqwrJaJG2KZ5DQvsKwmmccHZVVD2fSSLmXk6XxRSHgVU5U6iqqnFJSyYKqAU+QGiJVAh2oClUdhqeLjSgOpSjFkTbwOVRXNGEDB9aCSwFIFHa3DFZBRfi1Q6gBTFk4Rs63zGijrFIg/ylRt7lW3m6kOUagQqiJ5orFONKJtHR0ok/vUAaPKOrbRt2owZZVTJmhRDaKOYW26I1st06yoBFKmk4jD61UCShSfq1OdpTLgUDW6R8t87rqcfZ1BlMr6uq6Vjhf2owGvozDKmG9dyiQCeTSAiwXVdNIP1A2uls7QkYhW/fgzVgIeXVOe6ISFOnSOjjn+uuHsK5F2NM1hLG/jSGfpjoSdjLSJg7Cp7FjaR7ZzXEGcinBJDF8DnZ1Ho7wPrYNadHdINGCLdVMdrU6nMdimqHYgiaF2kn4IXJ8FMJY6iPRxsPqTksbc55ZJP2vHgOnuYwD2tU4k/eycaT891g0F5YDZ7qfQ3SidTAZgG4By4FwHgBtYBpYbZ/l/2EJnC9N0gaQAAAAASUVORK5CYII=", a;
    })();
    e.LoadingScreen = p;
  })(o.webgl || (o.webgl = {}));
})(F || (F = {}));
var F;
(function(o) {
  (function(e) {
    e.M00 = 0, e.M01 = 4, e.M02 = 8, e.M03 = 12, e.M10 = 1, e.M11 = 5, e.M12 = 9, e.M13 = 13, e.M20 = 2, e.M21 = 6, e.M22 = 10, e.M23 = 14, e.M30 = 3, e.M31 = 7, e.M32 = 11, e.M33 = 15;
    var p = (function() {
      function a() {
        this.temp = new Float32Array(16), this.values = new Float32Array(16);
        var t = this.values;
        t[e.M00] = 1, t[e.M11] = 1, t[e.M22] = 1, t[e.M33] = 1;
      }
      return a.prototype.set = function(t) {
        return this.values.set(t), this;
      }, a.prototype.transpose = function() {
        var t = this.temp, i = this.values;
        return t[e.M00] = i[e.M00], t[e.M01] = i[e.M10], t[e.M02] = i[e.M20], t[e.M03] = i[e.M30], t[e.M10] = i[e.M01], t[e.M11] = i[e.M11], t[e.M12] = i[e.M21], t[e.M13] = i[e.M31], t[e.M20] = i[e.M02], t[e.M21] = i[e.M12], t[e.M22] = i[e.M22], t[e.M23] = i[e.M32], t[e.M30] = i[e.M03], t[e.M31] = i[e.M13], t[e.M32] = i[e.M23], t[e.M33] = i[e.M33], this.set(t);
      }, a.prototype.identity = function() {
        var t = this.values;
        return t[e.M00] = 1, t[e.M01] = 0, t[e.M02] = 0, t[e.M03] = 0, t[e.M10] = 0, t[e.M11] = 1, t[e.M12] = 0, t[e.M13] = 0, t[e.M20] = 0, t[e.M21] = 0, t[e.M22] = 1, t[e.M23] = 0, t[e.M30] = 0, t[e.M31] = 0, t[e.M32] = 0, t[e.M33] = 1, this;
      }, a.prototype.invert = function() {
        var t = this.values, i = this.temp, r = t[e.M30] * t[e.M21] * t[e.M12] * t[e.M03] - t[e.M20] * t[e.M31] * t[e.M12] * t[e.M03] - t[e.M30] * t[e.M11] * t[e.M22] * t[e.M03] + t[e.M10] * t[e.M31] * t[e.M22] * t[e.M03] + t[e.M20] * t[e.M11] * t[e.M32] * t[e.M03] - t[e.M10] * t[e.M21] * t[e.M32] * t[e.M03] - t[e.M30] * t[e.M21] * t[e.M02] * t[e.M13] + t[e.M20] * t[e.M31] * t[e.M02] * t[e.M13] + t[e.M30] * t[e.M01] * t[e.M22] * t[e.M13] - t[e.M00] * t[e.M31] * t[e.M22] * t[e.M13] - t[e.M20] * t[e.M01] * t[e.M32] * t[e.M13] + t[e.M00] * t[e.M21] * t[e.M32] * t[e.M13] + t[e.M30] * t[e.M11] * t[e.M02] * t[e.M23] - t[e.M10] * t[e.M31] * t[e.M02] * t[e.M23] - t[e.M30] * t[e.M01] * t[e.M12] * t[e.M23] + t[e.M00] * t[e.M31] * t[e.M12] * t[e.M23] + t[e.M10] * t[e.M01] * t[e.M32] * t[e.M23] - t[e.M00] * t[e.M11] * t[e.M32] * t[e.M23] - t[e.M20] * t[e.M11] * t[e.M02] * t[e.M33] + t[e.M10] * t[e.M21] * t[e.M02] * t[e.M33] + t[e.M20] * t[e.M01] * t[e.M12] * t[e.M33] - t[e.M00] * t[e.M21] * t[e.M12] * t[e.M33] - t[e.M10] * t[e.M01] * t[e.M22] * t[e.M33] + t[e.M00] * t[e.M11] * t[e.M22] * t[e.M33];
        if (r == 0)
          throw new Error("non-invertible matrix");
        var n = 1 / r;
        return i[e.M00] = t[e.M12] * t[e.M23] * t[e.M31] - t[e.M13] * t[e.M22] * t[e.M31] + t[e.M13] * t[e.M21] * t[e.M32] - t[e.M11] * t[e.M23] * t[e.M32] - t[e.M12] * t[e.M21] * t[e.M33] + t[e.M11] * t[e.M22] * t[e.M33], i[e.M01] = t[e.M03] * t[e.M22] * t[e.M31] - t[e.M02] * t[e.M23] * t[e.M31] - t[e.M03] * t[e.M21] * t[e.M32] + t[e.M01] * t[e.M23] * t[e.M32] + t[e.M02] * t[e.M21] * t[e.M33] - t[e.M01] * t[e.M22] * t[e.M33], i[e.M02] = t[e.M02] * t[e.M13] * t[e.M31] - t[e.M03] * t[e.M12] * t[e.M31] + t[e.M03] * t[e.M11] * t[e.M32] - t[e.M01] * t[e.M13] * t[e.M32] - t[e.M02] * t[e.M11] * t[e.M33] + t[e.M01] * t[e.M12] * t[e.M33], i[e.M03] = t[e.M03] * t[e.M12] * t[e.M21] - t[e.M02] * t[e.M13] * t[e.M21] - t[e.M03] * t[e.M11] * t[e.M22] + t[e.M01] * t[e.M13] * t[e.M22] + t[e.M02] * t[e.M11] * t[e.M23] - t[e.M01] * t[e.M12] * t[e.M23], i[e.M10] = t[e.M13] * t[e.M22] * t[e.M30] - t[e.M12] * t[e.M23] * t[e.M30] - t[e.M13] * t[e.M20] * t[e.M32] + t[e.M10] * t[e.M23] * t[e.M32] + t[e.M12] * t[e.M20] * t[e.M33] - t[e.M10] * t[e.M22] * t[e.M33], i[e.M11] = t[e.M02] * t[e.M23] * t[e.M30] - t[e.M03] * t[e.M22] * t[e.M30] + t[e.M03] * t[e.M20] * t[e.M32] - t[e.M00] * t[e.M23] * t[e.M32] - t[e.M02] * t[e.M20] * t[e.M33] + t[e.M00] * t[e.M22] * t[e.M33], i[e.M12] = t[e.M03] * t[e.M12] * t[e.M30] - t[e.M02] * t[e.M13] * t[e.M30] - t[e.M03] * t[e.M10] * t[e.M32] + t[e.M00] * t[e.M13] * t[e.M32] + t[e.M02] * t[e.M10] * t[e.M33] - t[e.M00] * t[e.M12] * t[e.M33], i[e.M13] = t[e.M02] * t[e.M13] * t[e.M20] - t[e.M03] * t[e.M12] * t[e.M20] + t[e.M03] * t[e.M10] * t[e.M22] - t[e.M00] * t[e.M13] * t[e.M22] - t[e.M02] * t[e.M10] * t[e.M23] + t[e.M00] * t[e.M12] * t[e.M23], i[e.M20] = t[e.M11] * t[e.M23] * t[e.M30] - t[e.M13] * t[e.M21] * t[e.M30] + t[e.M13] * t[e.M20] * t[e.M31] - t[e.M10] * t[e.M23] * t[e.M31] - t[e.M11] * t[e.M20] * t[e.M33] + t[e.M10] * t[e.M21] * t[e.M33], i[e.M21] = t[e.M03] * t[e.M21] * t[e.M30] - t[e.M01] * t[e.M23] * t[e.M30] - t[e.M03] * t[e.M20] * t[e.M31] + t[e.M00] * t[e.M23] * t[e.M31] + t[e.M01] * t[e.M20] * t[e.M33] - t[e.M00] * t[e.M21] * t[e.M33], i[e.M22] = t[e.M01] * t[e.M13] * t[e.M30] - t[e.M03] * t[e.M11] * t[e.M30] + t[e.M03] * t[e.M10] * t[e.M31] - t[e.M00] * t[e.M13] * t[e.M31] - t[e.M01] * t[e.M10] * t[e.M33] + t[e.M00] * t[e.M11] * t[e.M33], i[e.M23] = t[e.M03] * t[e.M11] * t[e.M20] - t[e.M01] * t[e.M13] * t[e.M20] - t[e.M03] * t[e.M10] * t[e.M21] + t[e.M00] * t[e.M13] * t[e.M21] + t[e.M01] * t[e.M10] * t[e.M23] - t[e.M00] * t[e.M11] * t[e.M23], i[e.M30] = t[e.M12] * t[e.M21] * t[e.M30] - t[e.M11] * t[e.M22] * t[e.M30] - t[e.M12] * t[e.M20] * t[e.M31] + t[e.M10] * t[e.M22] * t[e.M31] + t[e.M11] * t[e.M20] * t[e.M32] - t[e.M10] * t[e.M21] * t[e.M32], i[e.M31] = t[e.M01] * t[e.M22] * t[e.M30] - t[e.M02] * t[e.M21] * t[e.M30] + t[e.M02] * t[e.M20] * t[e.M31] - t[e.M00] * t[e.M22] * t[e.M31] - t[e.M01] * t[e.M20] * t[e.M32] + t[e.M00] * t[e.M21] * t[e.M32], i[e.M32] = t[e.M02] * t[e.M11] * t[e.M30] - t[e.M01] * t[e.M12] * t[e.M30] - t[e.M02] * t[e.M10] * t[e.M31] + t[e.M00] * t[e.M12] * t[e.M31] + t[e.M01] * t[e.M10] * t[e.M32] - t[e.M00] * t[e.M11] * t[e.M32], i[e.M33] = t[e.M01] * t[e.M12] * t[e.M20] - t[e.M02] * t[e.M11] * t[e.M20] + t[e.M02] * t[e.M10] * t[e.M21] - t[e.M00] * t[e.M12] * t[e.M21] - t[e.M01] * t[e.M10] * t[e.M22] + t[e.M00] * t[e.M11] * t[e.M22], t[e.M00] = i[e.M00] * n, t[e.M01] = i[e.M01] * n, t[e.M02] = i[e.M02] * n, t[e.M03] = i[e.M03] * n, t[e.M10] = i[e.M10] * n, t[e.M11] = i[e.M11] * n, t[e.M12] = i[e.M12] * n, t[e.M13] = i[e.M13] * n, t[e.M20] = i[e.M20] * n, t[e.M21] = i[e.M21] * n, t[e.M22] = i[e.M22] * n, t[e.M23] = i[e.M23] * n, t[e.M30] = i[e.M30] * n, t[e.M31] = i[e.M31] * n, t[e.M32] = i[e.M32] * n, t[e.M33] = i[e.M33] * n, this;
      }, a.prototype.determinant = function() {
        var t = this.values;
        return t[e.M30] * t[e.M21] * t[e.M12] * t[e.M03] - t[e.M20] * t[e.M31] * t[e.M12] * t[e.M03] - t[e.M30] * t[e.M11] * t[e.M22] * t[e.M03] + t[e.M10] * t[e.M31] * t[e.M22] * t[e.M03] + t[e.M20] * t[e.M11] * t[e.M32] * t[e.M03] - t[e.M10] * t[e.M21] * t[e.M32] * t[e.M03] - t[e.M30] * t[e.M21] * t[e.M02] * t[e.M13] + t[e.M20] * t[e.M31] * t[e.M02] * t[e.M13] + t[e.M30] * t[e.M01] * t[e.M22] * t[e.M13] - t[e.M00] * t[e.M31] * t[e.M22] * t[e.M13] - t[e.M20] * t[e.M01] * t[e.M32] * t[e.M13] + t[e.M00] * t[e.M21] * t[e.M32] * t[e.M13] + t[e.M30] * t[e.M11] * t[e.M02] * t[e.M23] - t[e.M10] * t[e.M31] * t[e.M02] * t[e.M23] - t[e.M30] * t[e.M01] * t[e.M12] * t[e.M23] + t[e.M00] * t[e.M31] * t[e.M12] * t[e.M23] + t[e.M10] * t[e.M01] * t[e.M32] * t[e.M23] - t[e.M00] * t[e.M11] * t[e.M32] * t[e.M23] - t[e.M20] * t[e.M11] * t[e.M02] * t[e.M33] + t[e.M10] * t[e.M21] * t[e.M02] * t[e.M33] + t[e.M20] * t[e.M01] * t[e.M12] * t[e.M33] - t[e.M00] * t[e.M21] * t[e.M12] * t[e.M33] - t[e.M10] * t[e.M01] * t[e.M22] * t[e.M33] + t[e.M00] * t[e.M11] * t[e.M22] * t[e.M33];
      }, a.prototype.translate = function(t, i, r) {
        var n = this.values;
        return n[e.M03] += t, n[e.M13] += i, n[e.M23] += r, this;
      }, a.prototype.copy = function() {
        return new a().set(this.values);
      }, a.prototype.projection = function(t, i, r, n) {
        this.identity();
        var f = 1 / Math.tan(r * (Math.PI / 180) / 2), l = (i + t) / (t - i), v = 2 * i * t / (t - i), c = this.values;
        return c[e.M00] = f / n, c[e.M10] = 0, c[e.M20] = 0, c[e.M30] = 0, c[e.M01] = 0, c[e.M11] = f, c[e.M21] = 0, c[e.M31] = 0, c[e.M02] = 0, c[e.M12] = 0, c[e.M22] = l, c[e.M32] = -1, c[e.M03] = 0, c[e.M13] = 0, c[e.M23] = v, c[e.M33] = 0, this;
      }, a.prototype.ortho2d = function(t, i, r, n) {
        return this.ortho(t, t + r, i, i + n, 0, 1);
      }, a.prototype.ortho = function(t, i, r, n, f, l) {
        this.identity();
        var v = 2 / (i - t), c = 2 / (n - r), s = -2 / (l - f), h = -(i + t) / (i - t), d = -(n + r) / (n - r), u = -(l + f) / (l - f), M = this.values;
        return M[e.M00] = v, M[e.M10] = 0, M[e.M20] = 0, M[e.M30] = 0, M[e.M01] = 0, M[e.M11] = c, M[e.M21] = 0, M[e.M31] = 0, M[e.M02] = 0, M[e.M12] = 0, M[e.M22] = s, M[e.M32] = 0, M[e.M03] = h, M[e.M13] = d, M[e.M23] = u, M[e.M33] = 1, this;
      }, a.prototype.multiply = function(t) {
        var i = this.temp, r = this.values, n = t.values;
        return i[e.M00] = r[e.M00] * n[e.M00] + r[e.M01] * n[e.M10] + r[e.M02] * n[e.M20] + r[e.M03] * n[e.M30], i[e.M01] = r[e.M00] * n[e.M01] + r[e.M01] * n[e.M11] + r[e.M02] * n[e.M21] + r[e.M03] * n[e.M31], i[e.M02] = r[e.M00] * n[e.M02] + r[e.M01] * n[e.M12] + r[e.M02] * n[e.M22] + r[e.M03] * n[e.M32], i[e.M03] = r[e.M00] * n[e.M03] + r[e.M01] * n[e.M13] + r[e.M02] * n[e.M23] + r[e.M03] * n[e.M33], i[e.M10] = r[e.M10] * n[e.M00] + r[e.M11] * n[e.M10] + r[e.M12] * n[e.M20] + r[e.M13] * n[e.M30], i[e.M11] = r[e.M10] * n[e.M01] + r[e.M11] * n[e.M11] + r[e.M12] * n[e.M21] + r[e.M13] * n[e.M31], i[e.M12] = r[e.M10] * n[e.M02] + r[e.M11] * n[e.M12] + r[e.M12] * n[e.M22] + r[e.M13] * n[e.M32], i[e.M13] = r[e.M10] * n[e.M03] + r[e.M11] * n[e.M13] + r[e.M12] * n[e.M23] + r[e.M13] * n[e.M33], i[e.M20] = r[e.M20] * n[e.M00] + r[e.M21] * n[e.M10] + r[e.M22] * n[e.M20] + r[e.M23] * n[e.M30], i[e.M21] = r[e.M20] * n[e.M01] + r[e.M21] * n[e.M11] + r[e.M22] * n[e.M21] + r[e.M23] * n[e.M31], i[e.M22] = r[e.M20] * n[e.M02] + r[e.M21] * n[e.M12] + r[e.M22] * n[e.M22] + r[e.M23] * n[e.M32], i[e.M23] = r[e.M20] * n[e.M03] + r[e.M21] * n[e.M13] + r[e.M22] * n[e.M23] + r[e.M23] * n[e.M33], i[e.M30] = r[e.M30] * n[e.M00] + r[e.M31] * n[e.M10] + r[e.M32] * n[e.M20] + r[e.M33] * n[e.M30], i[e.M31] = r[e.M30] * n[e.M01] + r[e.M31] * n[e.M11] + r[e.M32] * n[e.M21] + r[e.M33] * n[e.M31], i[e.M32] = r[e.M30] * n[e.M02] + r[e.M31] * n[e.M12] + r[e.M32] * n[e.M22] + r[e.M33] * n[e.M32], i[e.M33] = r[e.M30] * n[e.M03] + r[e.M31] * n[e.M13] + r[e.M32] * n[e.M23] + r[e.M33] * n[e.M33], this.set(this.temp);
      }, a.prototype.multiplyLeft = function(t) {
        var i = this.temp, r = this.values, n = t.values;
        return i[e.M00] = n[e.M00] * r[e.M00] + n[e.M01] * r[e.M10] + n[e.M02] * r[e.M20] + n[e.M03] * r[e.M30], i[e.M01] = n[e.M00] * r[e.M01] + n[e.M01] * r[e.M11] + n[e.M02] * r[e.M21] + n[e.M03] * r[e.M31], i[e.M02] = n[e.M00] * r[e.M02] + n[e.M01] * r[e.M12] + n[e.M02] * r[e.M22] + n[e.M03] * r[e.M32], i[e.M03] = n[e.M00] * r[e.M03] + n[e.M01] * r[e.M13] + n[e.M02] * r[e.M23] + n[e.M03] * r[e.M33], i[e.M10] = n[e.M10] * r[e.M00] + n[e.M11] * r[e.M10] + n[e.M12] * r[e.M20] + n[e.M13] * r[e.M30], i[e.M11] = n[e.M10] * r[e.M01] + n[e.M11] * r[e.M11] + n[e.M12] * r[e.M21] + n[e.M13] * r[e.M31], i[e.M12] = n[e.M10] * r[e.M02] + n[e.M11] * r[e.M12] + n[e.M12] * r[e.M22] + n[e.M13] * r[e.M32], i[e.M13] = n[e.M10] * r[e.M03] + n[e.M11] * r[e.M13] + n[e.M12] * r[e.M23] + n[e.M13] * r[e.M33], i[e.M20] = n[e.M20] * r[e.M00] + n[e.M21] * r[e.M10] + n[e.M22] * r[e.M20] + n[e.M23] * r[e.M30], i[e.M21] = n[e.M20] * r[e.M01] + n[e.M21] * r[e.M11] + n[e.M22] * r[e.M21] + n[e.M23] * r[e.M31], i[e.M22] = n[e.M20] * r[e.M02] + n[e.M21] * r[e.M12] + n[e.M22] * r[e.M22] + n[e.M23] * r[e.M32], i[e.M23] = n[e.M20] * r[e.M03] + n[e.M21] * r[e.M13] + n[e.M22] * r[e.M23] + n[e.M23] * r[e.M33], i[e.M30] = n[e.M30] * r[e.M00] + n[e.M31] * r[e.M10] + n[e.M32] * r[e.M20] + n[e.M33] * r[e.M30], i[e.M31] = n[e.M30] * r[e.M01] + n[e.M31] * r[e.M11] + n[e.M32] * r[e.M21] + n[e.M33] * r[e.M31], i[e.M32] = n[e.M30] * r[e.M02] + n[e.M31] * r[e.M12] + n[e.M32] * r[e.M22] + n[e.M33] * r[e.M32], i[e.M33] = n[e.M30] * r[e.M03] + n[e.M31] * r[e.M13] + n[e.M32] * r[e.M23] + n[e.M33] * r[e.M33], this.set(this.temp);
      }, a.prototype.lookAt = function(t, i, r) {
        a.initTemps();
        var n = a.xAxis, f = a.yAxis, l = a.zAxis;
        l.setFrom(i).normalize(), n.setFrom(i).normalize(), n.cross(r).normalize(), f.setFrom(n).cross(l).normalize(), this.identity();
        var v = this.values;
        return v[e.M00] = n.x, v[e.M01] = n.y, v[e.M02] = n.z, v[e.M10] = f.x, v[e.M11] = f.y, v[e.M12] = f.z, v[e.M20] = -l.x, v[e.M21] = -l.y, v[e.M22] = -l.z, a.tmpMatrix.identity(), a.tmpMatrix.values[e.M03] = -t.x, a.tmpMatrix.values[e.M13] = -t.y, a.tmpMatrix.values[e.M23] = -t.z, this.multiply(a.tmpMatrix), this;
      }, a.initTemps = function() {
        a.xAxis === null && (a.xAxis = new e.Vector3()), a.yAxis === null && (a.yAxis = new e.Vector3()), a.zAxis === null && (a.zAxis = new e.Vector3());
      }, a.xAxis = null, a.yAxis = null, a.zAxis = null, a.tmpMatrix = new a(), a;
    })();
    e.Matrix4 = p;
  })(o.webgl || (o.webgl = {}));
})(F || (F = {}));
var F;
(function(o) {
  (function(e) {
    var p = (function() {
      function v(c, s, h, d) {
        this.attributes = s, this.verticesLength = 0, this.dirtyVertices = !1, this.indicesLength = 0, this.dirtyIndices = !1, this.elementsPerVertex = 0, this.context = c instanceof e.ManagedWebGLRenderingContext ? c : new e.ManagedWebGLRenderingContext(c), this.elementsPerVertex = 0;
        for (var u = 0; u < s.length; u++)
          this.elementsPerVertex += s[u].numElements;
        this.vertices = new Float32Array(h * this.elementsPerVertex), this.indices = new Uint16Array(d), this.context.addRestorable(this);
      }
      return v.prototype.getAttributes = function() {
        return this.attributes;
      }, v.prototype.maxVertices = function() {
        return this.vertices.length / this.elementsPerVertex;
      }, v.prototype.numVertices = function() {
        return this.verticesLength / this.elementsPerVertex;
      }, v.prototype.setVerticesLength = function(c) {
        this.dirtyVertices = !0, this.verticesLength = c;
      }, v.prototype.getVertices = function() {
        return this.vertices;
      }, v.prototype.maxIndices = function() {
        return this.indices.length;
      }, v.prototype.numIndices = function() {
        return this.indicesLength;
      }, v.prototype.setIndicesLength = function(c) {
        this.dirtyIndices = !0, this.indicesLength = c;
      }, v.prototype.getIndices = function() {
        return this.indices;
      }, v.prototype.getVertexSizeInFloats = function() {
        for (var c = 0, s = 0; s < this.attributes.length; s++) {
          var h = this.attributes[s];
          c += h.numElements;
        }
        return c;
      }, v.prototype.setVertices = function(c) {
        if (this.dirtyVertices = !0, c.length > this.vertices.length)
          throw Error("Mesh can't store more than " + this.maxVertices() + " vertices");
        this.vertices.set(c, 0), this.verticesLength = c.length;
      }, v.prototype.setIndices = function(c) {
        if (this.dirtyIndices = !0, c.length > this.indices.length)
          throw Error("Mesh can't store more than " + this.maxIndices() + " indices");
        this.indices.set(c, 0), this.indicesLength = c.length;
      }, v.prototype.draw = function(c, s) {
        this.drawWithOffset(c, s, 0, this.indicesLength > 0 ? this.indicesLength : this.verticesLength / this.elementsPerVertex);
      }, v.prototype.drawWithOffset = function(c, s, h, d) {
        var u = this.context.gl;
        (this.dirtyVertices || this.dirtyIndices) && this.update(), this.bind(c), this.indicesLength > 0 ? u.drawElements(s, d, u.UNSIGNED_SHORT, h * 2) : u.drawArrays(s, h, d), this.unbind(c);
      }, v.prototype.bind = function(c) {
        var s = this.context.gl;
        s.bindBuffer(s.ARRAY_BUFFER, this.verticesBuffer);
        for (var h = 0, d = 0; d < this.attributes.length; d++) {
          var u = this.attributes[d], M = c.getAttributeLocation(u.name);
          s.enableVertexAttribArray(M), s.vertexAttribPointer(M, u.numElements, s.FLOAT, !1, this.elementsPerVertex * 4, h * 4), h += u.numElements;
        }
        this.indicesLength > 0 && s.bindBuffer(s.ELEMENT_ARRAY_BUFFER, this.indicesBuffer);
      }, v.prototype.unbind = function(c) {
        for (var s = this.context.gl, h = 0; h < this.attributes.length; h++) {
          var d = this.attributes[h], u = c.getAttributeLocation(d.name);
          s.disableVertexAttribArray(u);
        }
        s.bindBuffer(s.ARRAY_BUFFER, null), this.indicesLength > 0 && s.bindBuffer(s.ELEMENT_ARRAY_BUFFER, null);
      }, v.prototype.update = function() {
        var c = this.context.gl;
        this.dirtyVertices && (this.verticesBuffer || (this.verticesBuffer = c.createBuffer()), c.bindBuffer(c.ARRAY_BUFFER, this.verticesBuffer), c.bufferData(c.ARRAY_BUFFER, this.vertices.subarray(0, this.verticesLength), c.DYNAMIC_DRAW), this.dirtyVertices = !1), this.dirtyIndices && (this.indicesBuffer || (this.indicesBuffer = c.createBuffer()), c.bindBuffer(c.ELEMENT_ARRAY_BUFFER, this.indicesBuffer), c.bufferData(c.ELEMENT_ARRAY_BUFFER, this.indices.subarray(0, this.indicesLength), c.DYNAMIC_DRAW), this.dirtyIndices = !1);
      }, v.prototype.restore = function() {
        this.verticesBuffer = null, this.indicesBuffer = null, this.update();
      }, v.prototype.dispose = function() {
        this.context.removeRestorable(this);
        var c = this.context.gl;
        c.deleteBuffer(this.verticesBuffer), c.deleteBuffer(this.indicesBuffer);
      }, v;
    })();
    e.Mesh = p;
    var a = /* @__PURE__ */ (function() {
      function v(c, s, h) {
        this.name = c, this.type = s, this.numElements = h;
      }
      return v;
    })();
    e.VertexAttribute = a;
    var t = (function(v) {
      Q(c, v);
      function c() {
        return v.call(this, e.Shader.POSITION, l.Float, 2) || this;
      }
      return c;
    })(a);
    e.Position2Attribute = t;
    var i = (function(v) {
      Q(c, v);
      function c() {
        return v.call(this, e.Shader.POSITION, l.Float, 3) || this;
      }
      return c;
    })(a);
    e.Position3Attribute = i;
    var r = (function(v) {
      Q(c, v);
      function c(s) {
        return s === void 0 && (s = 0), v.call(this, e.Shader.TEXCOORDS + (s == 0 ? "" : s), l.Float, 2) || this;
      }
      return c;
    })(a);
    e.TexCoordAttribute = r;
    var n = (function(v) {
      Q(c, v);
      function c() {
        return v.call(this, e.Shader.COLOR, l.Float, 4) || this;
      }
      return c;
    })(a);
    e.ColorAttribute = n;
    var f = (function(v) {
      Q(c, v);
      function c() {
        return v.call(this, e.Shader.COLOR2, l.Float, 4) || this;
      }
      return c;
    })(a);
    e.Color2Attribute = f;
    var l;
    (function(v) {
      v[v.Float = 0] = "Float";
    })(l = e.VertexAttributeType || (e.VertexAttributeType = {}));
  })(o.webgl || (o.webgl = {}));
})(F || (F = {}));
var F;
(function(o) {
  (function(e) {
    var p = (function() {
      function a(t, i, r) {
        if (i === void 0 && (i = !0), r === void 0 && (r = 10920), this.isDrawing = !1, this.shader = null, this.lastTexture = null, this.verticesLength = 0, this.indicesLength = 0, r > 10920)
          throw new Error("Can't have more than 10920 triangles per batch: " + r);
        this.context = t instanceof e.ManagedWebGLRenderingContext ? t : new e.ManagedWebGLRenderingContext(t);
        var n = i ? [new e.Position2Attribute(), new e.ColorAttribute(), new e.TexCoordAttribute(), new e.Color2Attribute()] : [new e.Position2Attribute(), new e.ColorAttribute(), new e.TexCoordAttribute()];
        this.mesh = new e.Mesh(t, n, r, r * 3), this.srcBlend = this.context.gl.SRC_ALPHA, this.dstBlend = this.context.gl.ONE_MINUS_SRC_ALPHA;
      }
      return a.prototype.begin = function(t) {
        var i = this.context.gl;
        if (this.isDrawing)
          throw new Error("PolygonBatch is already drawing. Call PolygonBatch.end() before calling PolygonBatch.begin()");
        this.drawCalls = 0, this.shader = t, this.lastTexture = null, this.isDrawing = !0, i.enable(i.BLEND), i.blendFunc(this.srcBlend, this.dstBlend);
      }, a.prototype.setBlendMode = function(t, i) {
        var r = this.context.gl;
        this.srcBlend = t, this.dstBlend = i, this.isDrawing && (this.flush(), r.blendFunc(this.srcBlend, this.dstBlend));
      }, a.prototype.draw = function(t, i, r) {
        t != this.lastTexture ? (this.flush(), this.lastTexture = t) : (this.verticesLength + i.length > this.mesh.getVertices().length || this.indicesLength + r.length > this.mesh.getIndices().length) && this.flush();
        var n = this.mesh.numVertices();
        this.mesh.getVertices().set(i, this.verticesLength), this.verticesLength += i.length, this.mesh.setVerticesLength(this.verticesLength);
        for (var f = this.mesh.getIndices(), l = this.indicesLength, v = 0; v < r.length; l++, v++)
          f[l] = r[v] + n;
        this.indicesLength += r.length, this.mesh.setIndicesLength(this.indicesLength);
      }, a.prototype.flush = function() {
        var t = this.context.gl;
        this.verticesLength != 0 && (this.lastTexture.bind(), this.mesh.draw(this.shader, t.TRIANGLES), this.verticesLength = 0, this.indicesLength = 0, this.mesh.setVerticesLength(0), this.mesh.setIndicesLength(0), this.drawCalls++);
      }, a.prototype.end = function() {
        var t = this.context.gl;
        if (!this.isDrawing)
          throw new Error("PolygonBatch is not drawing. Call PolygonBatch.begin() before calling PolygonBatch.end()");
        (this.verticesLength > 0 || this.indicesLength > 0) && this.flush(), this.shader = null, this.lastTexture = null, this.isDrawing = !1, t.disable(t.BLEND);
      }, a.prototype.getDrawCalls = function() {
        return this.drawCalls;
      }, a.prototype.dispose = function() {
        this.mesh.dispose();
      }, a;
    })();
    e.PolygonBatcher = p;
  })(o.webgl || (o.webgl = {}));
})(F || (F = {}));
var F;
(function(o) {
  (function(e) {
    var p = (function() {
      function t(i, r, n) {
        n === void 0 && (n = !0), this.twoColorTint = !1, this.activeRenderer = null, this.QUAD = [
          0,
          0,
          1,
          1,
          1,
          1,
          0,
          0,
          0,
          0,
          1,
          1,
          1,
          1,
          0,
          0,
          0,
          0,
          1,
          1,
          1,
          1,
          0,
          0,
          0,
          0,
          1,
          1,
          1,
          1,
          0,
          0
        ], this.QUAD_TRIANGLES = [0, 1, 2, 2, 3, 0], this.WHITE = new o.Color(1, 1, 1, 1), this.canvas = i, this.context = r instanceof e.ManagedWebGLRenderingContext ? r : new e.ManagedWebGLRenderingContext(r), this.twoColorTint = n, this.camera = new e.OrthoCamera(i.width, i.height), this.batcherShader = n ? e.Shader.newTwoColoredTextured(this.context) : e.Shader.newColoredTextured(this.context), this.batcher = new e.PolygonBatcher(this.context, n), this.shapesShader = e.Shader.newColored(this.context), this.shapes = new e.ShapeRenderer(this.context), this.skeletonRenderer = new e.SkeletonRenderer(this.context, n), this.skeletonDebugRenderer = new e.SkeletonDebugRenderer(this.context);
      }
      return t.prototype.begin = function() {
        this.camera.update(), this.enableRenderer(this.batcher);
      }, t.prototype.drawSkeleton = function(i, r, n, f) {
        r === void 0 && (r = !1), n === void 0 && (n = -1), f === void 0 && (f = -1), this.enableRenderer(this.batcher), this.skeletonRenderer.premultipliedAlpha = r, this.skeletonRenderer.draw(this.batcher, i, n, f);
      }, t.prototype.drawSkeletonDebug = function(i, r, n) {
        r === void 0 && (r = !1), n === void 0 && (n = null), this.enableRenderer(this.shapes), this.skeletonDebugRenderer.premultipliedAlpha = r, this.skeletonDebugRenderer.draw(this.shapes, i, n);
      }, t.prototype.drawTexture = function(i, r, n, f, l, v) {
        v === void 0 && (v = null), this.enableRenderer(this.batcher), v === null && (v = this.WHITE);
        var c = this.QUAD, s = 0;
        c[s++] = r, c[s++] = n, c[s++] = v.r, c[s++] = v.g, c[s++] = v.b, c[s++] = v.a, c[s++] = 0, c[s++] = 1, this.twoColorTint && (c[s++] = 0, c[s++] = 0, c[s++] = 0, c[s++] = 0), c[s++] = r + f, c[s++] = n, c[s++] = v.r, c[s++] = v.g, c[s++] = v.b, c[s++] = v.a, c[s++] = 1, c[s++] = 1, this.twoColorTint && (c[s++] = 0, c[s++] = 0, c[s++] = 0, c[s++] = 0), c[s++] = r + f, c[s++] = n + l, c[s++] = v.r, c[s++] = v.g, c[s++] = v.b, c[s++] = v.a, c[s++] = 1, c[s++] = 0, this.twoColorTint && (c[s++] = 0, c[s++] = 0, c[s++] = 0, c[s++] = 0), c[s++] = r, c[s++] = n + l, c[s++] = v.r, c[s++] = v.g, c[s++] = v.b, c[s++] = v.a, c[s++] = 0, c[s++] = 0, this.twoColorTint && (c[s++] = 0, c[s++] = 0, c[s++] = 0, c[s++] = 0), this.batcher.draw(i, c, this.QUAD_TRIANGLES);
      }, t.prototype.drawTextureUV = function(i, r, n, f, l, v, c, s, h, d) {
        d === void 0 && (d = null), this.enableRenderer(this.batcher), d === null && (d = this.WHITE);
        var u = this.QUAD, M = 0;
        u[M++] = r, u[M++] = n, u[M++] = d.r, u[M++] = d.g, u[M++] = d.b, u[M++] = d.a, u[M++] = v, u[M++] = c, this.twoColorTint && (u[M++] = 0, u[M++] = 0, u[M++] = 0, u[M++] = 0), u[M++] = r + f, u[M++] = n, u[M++] = d.r, u[M++] = d.g, u[M++] = d.b, u[M++] = d.a, u[M++] = s, u[M++] = c, this.twoColorTint && (u[M++] = 0, u[M++] = 0, u[M++] = 0, u[M++] = 0), u[M++] = r + f, u[M++] = n + l, u[M++] = d.r, u[M++] = d.g, u[M++] = d.b, u[M++] = d.a, u[M++] = s, u[M++] = h, this.twoColorTint && (u[M++] = 0, u[M++] = 0, u[M++] = 0, u[M++] = 0), u[M++] = r, u[M++] = n + l, u[M++] = d.r, u[M++] = d.g, u[M++] = d.b, u[M++] = d.a, u[M++] = v, u[M++] = h, this.twoColorTint && (u[M++] = 0, u[M++] = 0, u[M++] = 0, u[M++] = 0), this.batcher.draw(i, u, this.QUAD_TRIANGLES);
      }, t.prototype.drawTextureRotated = function(i, r, n, f, l, v, c, s, h, d) {
        h === void 0 && (h = null), this.enableRenderer(this.batcher), h === null && (h = this.WHITE);
        var u = this.QUAD, M = r + v, C = n + c, S = -v, L = -c, E = f - v, A = l - c, g = S, m = L, x = S, P = A, k = E, O = A, R = E, D = L, N = 0, I = 0, y = 0, T = 0, B = 0, V = 0, G = 0, Y = 0;
        if (s != 0) {
          var _ = o.MathUtils.cosDeg(s), X = o.MathUtils.sinDeg(s);
          N = _ * g - X * m, I = X * g + _ * m, G = _ * x - X * P, Y = X * x + _ * P, B = _ * k - X * O, V = X * k + _ * O, y = B + (N - G), T = V + (I - Y);
        } else
          N = g, I = m, G = x, Y = P, B = k, V = O, y = R, T = D;
        N += M, I += C, y += M, T += C, B += M, V += C, G += M, Y += C;
        var W = 0;
        u[W++] = N, u[W++] = I, u[W++] = h.r, u[W++] = h.g, u[W++] = h.b, u[W++] = h.a, u[W++] = 0, u[W++] = 1, this.twoColorTint && (u[W++] = 0, u[W++] = 0, u[W++] = 0, u[W++] = 0), u[W++] = y, u[W++] = T, u[W++] = h.r, u[W++] = h.g, u[W++] = h.b, u[W++] = h.a, u[W++] = 1, u[W++] = 1, this.twoColorTint && (u[W++] = 0, u[W++] = 0, u[W++] = 0, u[W++] = 0), u[W++] = B, u[W++] = V, u[W++] = h.r, u[W++] = h.g, u[W++] = h.b, u[W++] = h.a, u[W++] = 1, u[W++] = 0, this.twoColorTint && (u[W++] = 0, u[W++] = 0, u[W++] = 0, u[W++] = 0), u[W++] = G, u[W++] = Y, u[W++] = h.r, u[W++] = h.g, u[W++] = h.b, u[W++] = h.a, u[W++] = 0, u[W++] = 0, this.twoColorTint && (u[W++] = 0, u[W++] = 0, u[W++] = 0, u[W++] = 0), this.batcher.draw(i, u, this.QUAD_TRIANGLES);
      }, t.prototype.drawRegion = function(i, r, n, f, l, v, c) {
        v === void 0 && (v = null), this.enableRenderer(this.batcher), v === null && (v = this.WHITE);
        var s = this.QUAD, h = 0;
        s[h++] = r, s[h++] = n, s[h++] = v.r, s[h++] = v.g, s[h++] = v.b, s[h++] = v.a, s[h++] = i.u, s[h++] = i.v2, this.twoColorTint && (s[h++] = 0, s[h++] = 0, s[h++] = 0, s[h++] = 0), s[h++] = r + f, s[h++] = n, s[h++] = v.r, s[h++] = v.g, s[h++] = v.b, s[h++] = v.a, s[h++] = i.u2, s[h++] = i.v2, this.twoColorTint && (s[h++] = 0, s[h++] = 0, s[h++] = 0, s[h++] = 0), s[h++] = r + f, s[h++] = n + l, s[h++] = v.r, s[h++] = v.g, s[h++] = v.b, s[h++] = v.a, s[h++] = i.u2, s[h++] = i.v, this.twoColorTint && (s[h++] = 0, s[h++] = 0, s[h++] = 0, s[h++] = 0), s[h++] = r, s[h++] = n + l, s[h++] = v.r, s[h++] = v.g, s[h++] = v.b, s[h++] = v.a, s[h++] = i.u, s[h++] = i.v, this.twoColorTint && (s[h++] = 0, s[h++] = 0, s[h++] = 0, s[h++] = 0), this.batcher.draw(i.texture, s, this.QUAD_TRIANGLES);
      }, t.prototype.line = function(i, r, n, f, l, v) {
        l === void 0 && (l = null), this.enableRenderer(this.shapes), this.shapes.line(i, r, n, f, l);
      }, t.prototype.triangle = function(i, r, n, f, l, v, c, s, h, d) {
        s === void 0 && (s = null), h === void 0 && (h = null), d === void 0 && (d = null), this.enableRenderer(this.shapes), this.shapes.triangle(i, r, n, f, l, v, c, s, h, d);
      }, t.prototype.quad = function(i, r, n, f, l, v, c, s, h, d, u, M, C) {
        d === void 0 && (d = null), u === void 0 && (u = null), M === void 0 && (M = null), C === void 0 && (C = null), this.enableRenderer(this.shapes), this.shapes.quad(i, r, n, f, l, v, c, s, h, d, u, M, C);
      }, t.prototype.rect = function(i, r, n, f, l, v) {
        v === void 0 && (v = null), this.enableRenderer(this.shapes), this.shapes.rect(i, r, n, f, l, v);
      }, t.prototype.rectLine = function(i, r, n, f, l, v, c) {
        c === void 0 && (c = null), this.enableRenderer(this.shapes), this.shapes.rectLine(i, r, n, f, l, v, c);
      }, t.prototype.polygon = function(i, r, n, f) {
        f === void 0 && (f = null), this.enableRenderer(this.shapes), this.shapes.polygon(i, r, n, f);
      }, t.prototype.circle = function(i, r, n, f, l, v) {
        l === void 0 && (l = null), v === void 0 && (v = 0), this.enableRenderer(this.shapes), this.shapes.circle(i, r, n, f, l, v);
      }, t.prototype.curve = function(i, r, n, f, l, v, c, s, h, d) {
        d === void 0 && (d = null), this.enableRenderer(this.shapes), this.shapes.curve(i, r, n, f, l, v, c, s, h, d);
      }, t.prototype.end = function() {
        this.activeRenderer === this.batcher ? this.batcher.end() : this.activeRenderer === this.shapes && this.shapes.end(), this.activeRenderer = null;
      }, t.prototype.resize = function(i) {
        var r = this.canvas, n = r.clientWidth, f = r.clientHeight;
        if ((r.width != n || r.height != f) && (r.width = n, r.height = f), this.context.gl.viewport(0, 0, r.width, r.height), i !== a.Stretch) {
          if (i === a.Expand)
            this.camera.setViewport(n, f);
          else if (i === a.Fit) {
            var l = r.width, v = r.height, c = this.camera.viewportWidth, s = this.camera.viewportHeight, h = s / c, d = v / l, u = h < d ? c / l : s / v;
            this.camera.viewportWidth = l * u, this.camera.viewportHeight = v * u;
          }
        }
        this.camera.update();
      }, t.prototype.enableRenderer = function(i) {
        this.activeRenderer !== i && (this.end(), i instanceof e.PolygonBatcher ? (this.batcherShader.bind(), this.batcherShader.setUniform4x4f(e.Shader.MVP_MATRIX, this.camera.projectionView.values), this.batcherShader.setUniformi("u_texture", 0), this.batcher.begin(this.batcherShader), this.activeRenderer = this.batcher) : i instanceof e.ShapeRenderer ? (this.shapesShader.bind(), this.shapesShader.setUniform4x4f(e.Shader.MVP_MATRIX, this.camera.projectionView.values), this.shapes.begin(this.shapesShader), this.activeRenderer = this.shapes) : this.activeRenderer = this.skeletonDebugRenderer);
      }, t.prototype.dispose = function() {
        this.batcher.dispose(), this.batcherShader.dispose(), this.shapes.dispose(), this.shapesShader.dispose(), this.skeletonDebugRenderer.dispose();
      }, t;
    })();
    e.SceneRenderer = p;
    var a;
    (function(t) {
      t[t.Stretch = 0] = "Stretch", t[t.Expand = 1] = "Expand", t[t.Fit = 2] = "Fit";
    })(a = e.ResizeMode || (e.ResizeMode = {}));
  })(o.webgl || (o.webgl = {}));
})(F || (F = {}));
var F;
(function(o) {
  (function(e) {
    var p = (function() {
      function a(t, i, r) {
        this.vertexShader = i, this.fragmentShader = r, this.vs = null, this.fs = null, this.program = null, this.tmp2x2 = new Float32Array(4), this.tmp3x3 = new Float32Array(9), this.tmp4x4 = new Float32Array(16), this.vsSource = i, this.fsSource = r, this.context = t instanceof e.ManagedWebGLRenderingContext ? t : new e.ManagedWebGLRenderingContext(t), this.context.addRestorable(this), this.compile();
      }
      return a.prototype.getProgram = function() {
        return this.program;
      }, a.prototype.getVertexShader = function() {
        return this.vertexShader;
      }, a.prototype.getFragmentShader = function() {
        return this.fragmentShader;
      }, a.prototype.getVertexShaderSource = function() {
        return this.vsSource;
      }, a.prototype.getFragmentSource = function() {
        return this.fsSource;
      }, a.prototype.compile = function() {
        var t = this.context.gl;
        try {
          this.vs = this.compileShader(t.VERTEX_SHADER, this.vertexShader), this.fs = this.compileShader(t.FRAGMENT_SHADER, this.fragmentShader), this.program = this.compileProgram(this.vs, this.fs);
        } catch (i) {
          throw this.dispose(), i;
        }
      }, a.prototype.compileShader = function(t, i) {
        var r = this.context.gl, n = r.createShader(t);
        if (r.shaderSource(n, i), r.compileShader(n), !r.getShaderParameter(n, r.COMPILE_STATUS)) {
          var f = "Couldn't compile shader: " + r.getShaderInfoLog(n);
          if (r.deleteShader(n), !r.isContextLost())
            throw new Error(f);
        }
        return n;
      }, a.prototype.compileProgram = function(t, i) {
        var r = this.context.gl, n = r.createProgram();
        if (r.attachShader(n, t), r.attachShader(n, i), r.linkProgram(n), !r.getProgramParameter(n, r.LINK_STATUS)) {
          var f = "Couldn't compile shader program: " + r.getProgramInfoLog(n);
          if (r.deleteProgram(n), !r.isContextLost())
            throw new Error(f);
        }
        return n;
      }, a.prototype.restore = function() {
        this.compile();
      }, a.prototype.bind = function() {
        this.context.gl.useProgram(this.program);
      }, a.prototype.unbind = function() {
        this.context.gl.useProgram(null);
      }, a.prototype.setUniformi = function(t, i) {
        this.context.gl.uniform1i(this.getUniformLocation(t), i);
      }, a.prototype.setUniformf = function(t, i) {
        this.context.gl.uniform1f(this.getUniformLocation(t), i);
      }, a.prototype.setUniform2f = function(t, i, r) {
        this.context.gl.uniform2f(this.getUniformLocation(t), i, r);
      }, a.prototype.setUniform3f = function(t, i, r, n) {
        this.context.gl.uniform3f(this.getUniformLocation(t), i, r, n);
      }, a.prototype.setUniform4f = function(t, i, r, n, f) {
        this.context.gl.uniform4f(this.getUniformLocation(t), i, r, n, f);
      }, a.prototype.setUniform2x2f = function(t, i) {
        var r = this.context.gl;
        this.tmp2x2.set(i), r.uniformMatrix2fv(this.getUniformLocation(t), !1, this.tmp2x2);
      }, a.prototype.setUniform3x3f = function(t, i) {
        var r = this.context.gl;
        this.tmp3x3.set(i), r.uniformMatrix3fv(this.getUniformLocation(t), !1, this.tmp3x3);
      }, a.prototype.setUniform4x4f = function(t, i) {
        var r = this.context.gl;
        this.tmp4x4.set(i), r.uniformMatrix4fv(this.getUniformLocation(t), !1, this.tmp4x4);
      }, a.prototype.getUniformLocation = function(t) {
        var i = this.context.gl, r = i.getUniformLocation(this.program, t);
        if (!r && !i.isContextLost())
          throw new Error("Couldn't find location for uniform " + t);
        return r;
      }, a.prototype.getAttributeLocation = function(t) {
        var i = this.context.gl, r = i.getAttribLocation(this.program, t);
        if (r == -1 && !i.isContextLost())
          throw new Error("Couldn't find location for attribute " + t);
        return r;
      }, a.prototype.dispose = function() {
        this.context.removeRestorable(this);
        var t = this.context.gl;
        this.vs && (t.deleteShader(this.vs), this.vs = null), this.fs && (t.deleteShader(this.fs), this.fs = null), this.program && (t.deleteProgram(this.program), this.program = null);
      }, a.newColoredTextured = function(t) {
        var i = `
				attribute vec4 ` + a.POSITION + `;
				attribute vec4 ` + a.COLOR + `;
				attribute vec2 ` + a.TEXCOORDS + `;
				uniform mat4 ` + a.MVP_MATRIX + `;
				varying vec4 v_color;
				varying vec2 v_texCoords;

				void main () {
					v_color = ` + a.COLOR + `;
					v_texCoords = ` + a.TEXCOORDS + `;
					gl_Position = ` + a.MVP_MATRIX + " * " + a.POSITION + `;
				}
			`, r = `
				#ifdef GL_ES
					#define LOWP lowp
					precision mediump float;
				#else
					#define LOWP
				#endif
				varying LOWP vec4 v_color;
				varying vec2 v_texCoords;
				uniform sampler2D u_texture;

				void main () {
					gl_FragColor = v_color * texture2D(u_texture, v_texCoords);
				}
			`;
        return new a(t, i, r);
      }, a.newTwoColoredTextured = function(t) {
        var i = `
				attribute vec4 ` + a.POSITION + `;
				attribute vec4 ` + a.COLOR + `;
				attribute vec4 ` + a.COLOR2 + `;
				attribute vec2 ` + a.TEXCOORDS + `;
				uniform mat4 ` + a.MVP_MATRIX + `;
				varying vec4 v_light;
				varying vec4 v_dark;
				varying vec2 v_texCoords;

				void main () {
					v_light = ` + a.COLOR + `;
					v_dark = ` + a.COLOR2 + `;
					v_texCoords = ` + a.TEXCOORDS + `;
					gl_Position = ` + a.MVP_MATRIX + " * " + a.POSITION + `;
				}
			`, r = `
				#ifdef GL_ES
					#define LOWP lowp
					precision mediump float;
				#else
					#define LOWP
				#endif
				varying LOWP vec4 v_light;
				varying LOWP vec4 v_dark;
				varying vec2 v_texCoords;
				uniform sampler2D u_texture;

				void main () {
					vec4 texColor = texture2D(u_texture, v_texCoords);
					gl_FragColor.a = texColor.a * v_light.a;
					gl_FragColor.rgb = ((texColor.a - 1.0) * v_dark.a + 1.0 - texColor.rgb) * v_dark.rgb + texColor.rgb * v_light.rgb;
				}
			`;
        return new a(t, i, r);
      }, a.newColored = function(t) {
        var i = `
				attribute vec4 ` + a.POSITION + `;
				attribute vec4 ` + a.COLOR + `;
				uniform mat4 ` + a.MVP_MATRIX + `;
				varying vec4 v_color;

				void main () {
					v_color = ` + a.COLOR + `;
					gl_Position = ` + a.MVP_MATRIX + " * " + a.POSITION + `;
				}
			`, r = `
				#ifdef GL_ES
					#define LOWP lowp
					precision mediump float;
				#else
					#define LOWP
				#endif
				varying LOWP vec4 v_color;

				void main () {
					gl_FragColor = v_color;
				}
			`;
        return new a(t, i, r);
      }, a.MVP_MATRIX = "u_projTrans", a.POSITION = "a_position", a.COLOR = "a_color", a.COLOR2 = "a_color2", a.TEXCOORDS = "a_texCoords", a.SAMPLER = "u_texture", a;
    })();
    e.Shader = p;
  })(o.webgl || (o.webgl = {}));
})(F || (F = {}));
var F;
(function(o) {
  (function(e) {
    var p = (function() {
      function t(i, r) {
        if (r === void 0 && (r = 10920), this.isDrawing = !1, this.shapeType = a.Filled, this.color = new o.Color(1, 1, 1, 1), this.vertexIndex = 0, this.tmp = new o.Vector2(), r > 10920)
          throw new Error("Can't have more than 10920 triangles per batch: " + r);
        this.context = i instanceof e.ManagedWebGLRenderingContext ? i : new e.ManagedWebGLRenderingContext(i), this.mesh = new e.Mesh(i, [new e.Position2Attribute(), new e.ColorAttribute()], r, 0), this.srcBlend = this.context.gl.SRC_ALPHA, this.dstBlend = this.context.gl.ONE_MINUS_SRC_ALPHA;
      }
      return t.prototype.begin = function(i) {
        if (this.isDrawing)
          throw new Error("ShapeRenderer.begin() has already been called");
        this.shader = i, this.vertexIndex = 0, this.isDrawing = !0;
        var r = this.context.gl;
        r.enable(r.BLEND), r.blendFunc(this.srcBlend, this.dstBlend);
      }, t.prototype.setBlendMode = function(i, r) {
        var n = this.context.gl;
        this.srcBlend = i, this.dstBlend = r, this.isDrawing && (this.flush(), n.blendFunc(this.srcBlend, this.dstBlend));
      }, t.prototype.setColor = function(i) {
        this.color.setFromColor(i);
      }, t.prototype.setColorWith = function(i, r, n, f) {
        this.color.set(i, r, n, f);
      }, t.prototype.point = function(i, r, n) {
        n === void 0 && (n = null), this.check(a.Point, 1), n === null && (n = this.color), this.vertex(i, r, n);
      }, t.prototype.line = function(i, r, n, f, l) {
        l === void 0 && (l = null), this.check(a.Line, 2), this.mesh.getVertices(), this.vertexIndex, l === null && (l = this.color), this.vertex(i, r, l), this.vertex(n, f, l);
      }, t.prototype.triangle = function(i, r, n, f, l, v, c, s, h, d) {
        s === void 0 && (s = null), h === void 0 && (h = null), d === void 0 && (d = null), this.check(i ? a.Filled : a.Line, 3), this.mesh.getVertices(), this.vertexIndex, s === null && (s = this.color), h === null && (h = this.color), d === null && (d = this.color), i ? (this.vertex(r, n, s), this.vertex(f, l, h), this.vertex(v, c, d)) : (this.vertex(r, n, s), this.vertex(f, l, h), this.vertex(f, l, s), this.vertex(v, c, h), this.vertex(v, c, s), this.vertex(r, n, h));
      }, t.prototype.quad = function(i, r, n, f, l, v, c, s, h, d, u, M, C) {
        d === void 0 && (d = null), u === void 0 && (u = null), M === void 0 && (M = null), C === void 0 && (C = null), this.check(i ? a.Filled : a.Line, 3), this.mesh.getVertices(), this.vertexIndex, d === null && (d = this.color), u === null && (u = this.color), M === null && (M = this.color), C === null && (C = this.color), i ? (this.vertex(r, n, d), this.vertex(f, l, u), this.vertex(v, c, M), this.vertex(v, c, M), this.vertex(s, h, C), this.vertex(r, n, d)) : (this.vertex(r, n, d), this.vertex(f, l, u), this.vertex(f, l, u), this.vertex(v, c, M), this.vertex(v, c, M), this.vertex(s, h, C), this.vertex(s, h, C), this.vertex(r, n, d));
      }, t.prototype.rect = function(i, r, n, f, l, v) {
        v === void 0 && (v = null), this.quad(i, r, n, r + f, n, r + f, n + l, r, n + l, v, v, v, v);
      }, t.prototype.rectLine = function(i, r, n, f, l, v, c) {
        c === void 0 && (c = null), this.check(i ? a.Filled : a.Line, 8), c === null && (c = this.color);
        var s = this.tmp.set(l - n, r - f);
        s.normalize(), v *= 0.5;
        var h = s.x * v, d = s.y * v;
        i ? (this.vertex(r + h, n + d, c), this.vertex(r - h, n - d, c), this.vertex(f + h, l + d, c), this.vertex(f - h, l - d, c), this.vertex(f + h, l + d, c), this.vertex(r - h, n - d, c)) : (this.vertex(r + h, n + d, c), this.vertex(r - h, n - d, c), this.vertex(f + h, l + d, c), this.vertex(f - h, l - d, c), this.vertex(f + h, l + d, c), this.vertex(r + h, n + d, c), this.vertex(f - h, l - d, c), this.vertex(r - h, n - d, c));
      }, t.prototype.x = function(i, r, n) {
        this.line(i - n, r - n, i + n, r + n), this.line(i - n, r + n, i + n, r - n);
      }, t.prototype.polygon = function(i, r, n, f) {
        if (f === void 0 && (f = null), n < 3)
          throw new Error("Polygon must contain at least 3 vertices");
        this.check(a.Line, n * 2), f === null && (f = this.color), this.mesh.getVertices(), this.vertexIndex, r <<= 1, n <<= 1;
        for (var l = i[r], v = i[r + 1], c = r + n, s = r, h = r + n - 2; s < h; s += 2) {
          var d = i[s], u = i[s + 1], M = 0, C = 0;
          s + 2 >= c ? (M = l, C = v) : (M = i[s + 2], C = i[s + 3]), this.vertex(d, u, f), this.vertex(M, C, f);
        }
      }, t.prototype.circle = function(i, r, n, f, l, v) {
        if (l === void 0 && (l = null), v === void 0 && (v = 0), v === 0 && (v = Math.max(1, 6 * o.MathUtils.cbrt(f) | 0)), v <= 0)
          throw new Error("segments must be > 0.");
        l === null && (l = this.color);
        var c = 2 * o.MathUtils.PI / v, s = Math.cos(c), h = Math.sin(c), d = f, u = 0;
        if (i) {
          this.check(a.Filled, v * 3 + 3), v--;
          for (var M = 0; M < v; M++) {
            this.vertex(r, n, l), this.vertex(r + d, n + u, l);
            var S = d;
            d = s * d - h * u, u = h * S + s * u, this.vertex(r + d, n + u, l);
          }
          this.vertex(r, n, l), this.vertex(r + d, n + u, l);
        } else {
          this.check(a.Line, v * 2 + 2);
          for (var M = 0; M < v; M++) {
            this.vertex(r + d, n + u, l);
            var C = d;
            d = s * d - h * u, u = h * C + s * u, this.vertex(r + d, n + u, l);
          }
          this.vertex(r + d, n + u, l);
        }
        d = f, u = 0, this.vertex(r + d, n + u, l);
      }, t.prototype.curve = function(i, r, n, f, l, v, c, s, h, d) {
        d === void 0 && (d = null), this.check(a.Line, h * 2 + 2), d === null && (d = this.color);
        for (var u = 1 / h, M = u * u, C = u * u * u, S = 3 * u, L = 3 * M, E = 6 * M, A = 6 * C, g = i - n * 2 + l, m = r - f * 2 + v, x = (n - l) * 3 - i + c, P = (f - v) * 3 - r + s, k = i, O = r, R = (n - i) * S + g * L + x * C, D = (f - r) * S + m * L + P * C, N = g * E + x * A, I = m * E + P * A, y = x * A, T = P * A; h-- > 0; )
          this.vertex(k, O, d), k += R, O += D, R += N, D += I, N += y, I += T, this.vertex(k, O, d);
        this.vertex(k, O, d), this.vertex(c, s, d);
      }, t.prototype.vertex = function(i, r, n) {
        var f = this.vertexIndex, l = this.mesh.getVertices();
        l[f++] = i, l[f++] = r, l[f++] = n.r, l[f++] = n.g, l[f++] = n.b, l[f++] = n.a, this.vertexIndex = f;
      }, t.prototype.end = function() {
        if (!this.isDrawing)
          throw new Error("ShapeRenderer.begin() has not been called");
        this.flush(), this.context.gl.disable(this.context.gl.BLEND), this.isDrawing = !1;
      }, t.prototype.flush = function() {
        this.vertexIndex != 0 && (this.mesh.setVerticesLength(this.vertexIndex), this.mesh.draw(this.shader, this.shapeType), this.vertexIndex = 0);
      }, t.prototype.check = function(i, r) {
        if (!this.isDrawing)
          throw new Error("ShapeRenderer.begin() has not been called");
        if (this.shapeType == i)
          if (this.mesh.maxVertices() - this.mesh.numVertices() < r)
            this.flush();
          else
            return;
        else
          this.flush(), this.shapeType = i;
      }, t.prototype.dispose = function() {
        this.mesh.dispose();
      }, t;
    })();
    e.ShapeRenderer = p;
    var a;
    (function(t) {
      t[t.Point = 0] = "Point", t[t.Line = 1] = "Line", t[t.Filled = 4] = "Filled";
    })(a = e.ShapeType || (e.ShapeType = {}));
  })(o.webgl || (o.webgl = {}));
})(F || (F = {}));
var F;
(function(o) {
  (function(e) {
    var p = (function() {
      function a(t) {
        this.boneLineColor = new o.Color(1, 0, 0, 1), this.boneOriginColor = new o.Color(0, 1, 0, 1), this.attachmentLineColor = new o.Color(0, 0, 1, 0.5), this.triangleLineColor = new o.Color(1, 0.64, 0, 0.5), this.pathColor = new o.Color().setFromString("FF7F00"), this.clipColor = new o.Color(0.8, 0, 0, 2), this.aabbColor = new o.Color(0, 1, 0, 0.5), this.drawBones = !0, this.drawRegionAttachments = !0, this.drawBoundingBoxes = !0, this.drawMeshHull = !0, this.drawMeshTriangles = !0, this.drawPaths = !0, this.drawSkeletonXY = !1, this.drawClipping = !0, this.premultipliedAlpha = !1, this.scale = 1, this.boneWidth = 2, this.bounds = new o.SkeletonBounds(), this.temp = new Array(), this.vertices = o.Utils.newFloatArray(2048), this.context = t instanceof e.ManagedWebGLRenderingContext ? t : new e.ManagedWebGLRenderingContext(t);
      }
      return a.prototype.draw = function(t, i, r) {
        r === void 0 && (r = null);
        var n = i.x, f = i.y, l = this.context.gl, v = this.premultipliedAlpha ? l.ONE : l.SRC_ALPHA;
        t.setBlendMode(v, l.ONE_MINUS_SRC_ALPHA);
        var c = i.bones;
        if (this.drawBones) {
          t.setColor(this.boneLineColor);
          for (var s = 0, h = c.length; s < h; s++) {
            var d = c[s];
            if (!(r && r.indexOf(d.data.name) > -1) && d.parent != null) {
              var u = n + d.data.length * d.a + d.worldX, M = f + d.data.length * d.c + d.worldY;
              t.rectLine(!0, n + d.worldX, f + d.worldY, u, M, this.boneWidth * this.scale);
            }
          }
          this.drawSkeletonXY && t.x(n, f, 4 * this.scale);
        }
        if (this.drawRegionAttachments) {
          t.setColor(this.attachmentLineColor);
          for (var C = i.slots, s = 0, h = C.length; s < h; s++) {
            var S = C[s], L = S.getAttachment();
            if (L instanceof o.RegionAttachment) {
              var E = L, A = this.vertices;
              E.computeWorldVertices(S.bone, A, 0, 2), t.line(A[0], A[1], A[2], A[3]), t.line(A[2], A[3], A[4], A[5]), t.line(A[4], A[5], A[6], A[7]), t.line(A[6], A[7], A[0], A[1]);
            }
          }
        }
        if (this.drawMeshHull || this.drawMeshTriangles)
          for (var C = i.slots, s = 0, h = C.length; s < h; s++) {
            var S = C[s];
            if (S.bone.active) {
              var L = S.getAttachment();
              if (L instanceof o.MeshAttachment) {
                var g = L, A = this.vertices;
                g.computeWorldVertices(S, 0, g.worldVerticesLength, A, 0, 2);
                var m = g.triangles, x = g.hullLength;
                if (this.drawMeshTriangles) {
                  t.setColor(this.triangleLineColor);
                  for (var P = 0, k = m.length; P < k; P += 3) {
                    var O = m[P] * 2, R = m[P + 1] * 2, D = m[P + 2] * 2;
                    t.triangle(!1, A[O], A[O + 1], A[R], A[R + 1], A[D], A[D + 1]);
                  }
                }
                if (this.drawMeshHull && x > 0) {
                  t.setColor(this.attachmentLineColor), x = (x >> 1) * 2;
                  for (var N = A[x - 2], I = A[x - 1], P = 0, k = x; P < k; P += 2) {
                    var u = A[P], M = A[P + 1];
                    t.line(u, M, N, I), N = u, I = M;
                  }
                }
              }
            }
          }
        if (this.drawBoundingBoxes) {
          var y = this.bounds;
          y.update(i, !0), t.setColor(this.aabbColor), t.rect(!1, y.minX, y.minY, y.getWidth(), y.getHeight());
          for (var T = y.polygons, B = y.boundingBoxes, s = 0, h = T.length; s < h; s++) {
            var V = T[s];
            t.setColor(B[s].color), t.polygon(V, 0, V.length);
          }
        }
        if (this.drawPaths)
          for (var C = i.slots, s = 0, h = C.length; s < h; s++) {
            var S = C[s];
            if (S.bone.active) {
              var L = S.getAttachment();
              if (L instanceof o.PathAttachment) {
                var G = L, k = G.worldVerticesLength, Y = this.temp = o.Utils.setArraySize(this.temp, k, 0);
                G.computeWorldVertices(S, 0, k, Y, 0, 2);
                var _ = this.pathColor, X = Y[2], W = Y[3], U = 0, w = 0;
                if (G.closed) {
                  t.setColor(_);
                  var Z = Y[0], z = Y[1], j = Y[k - 2], H = Y[k - 1];
                  U = Y[k - 4], w = Y[k - 3], t.curve(X, W, Z, z, j, H, U, w, 32), t.setColor(a.LIGHT_GRAY), t.line(X, W, Z, z), t.line(U, w, j, H);
                }
                k -= 4;
                for (var P = 4; P < k; P += 6) {
                  var Z = Y[P], z = Y[P + 1], j = Y[P + 2], H = Y[P + 3];
                  U = Y[P + 4], w = Y[P + 5], t.setColor(_), t.curve(X, W, Z, z, j, H, U, w, 32), t.setColor(a.LIGHT_GRAY), t.line(X, W, Z, z), t.line(U, w, j, H), X = U, W = w;
                }
              }
            }
          }
        if (this.drawBones) {
          t.setColor(this.boneOriginColor);
          for (var s = 0, h = c.length; s < h; s++) {
            var d = c[s];
            r && r.indexOf(d.data.name) > -1 || t.circle(!0, n + d.worldX, f + d.worldY, 3 * this.scale, a.GREEN, 8);
          }
        }
        if (this.drawClipping) {
          var C = i.slots;
          t.setColor(this.clipColor);
          for (var s = 0, h = C.length; s < h; s++) {
            var S = C[s];
            if (S.bone.active) {
              var L = S.getAttachment();
              if (L instanceof o.ClippingAttachment) {
                var q = L, k = q.worldVerticesLength, Y = this.temp = o.Utils.setArraySize(this.temp, k, 0);
                q.computeWorldVertices(S, 0, k, Y, 0, 2);
                for (var K = 0, J = Y.length; K < J; K += 2) {
                  var u = Y[K], M = Y[K + 1], U = Y[(K + 2) % Y.length], w = Y[(K + 3) % Y.length];
                  t.line(u, M, U, w);
                }
              }
            }
          }
        }
      }, a.prototype.dispose = function() {
      }, a.LIGHT_GRAY = new o.Color(0.7529411764705882, 0.7529411764705882, 0.7529411764705882, 1), a.GREEN = new o.Color(0, 1, 0, 1), a;
    })();
    e.SkeletonDebugRenderer = p;
  })(o.webgl || (o.webgl = {}));
})(F || (F = {}));
var F;
(function(o) {
  (function(e) {
    var p = /* @__PURE__ */ (function() {
      function t(i, r, n) {
        this.vertices = i, this.numVertices = r, this.numFloats = n;
      }
      return t;
    })(), a = (function() {
      function t(i, r) {
        r === void 0 && (r = !0), this.premultipliedAlpha = !1, this.vertexEffect = null, this.tempColor = new o.Color(), this.tempColor2 = new o.Color(), this.vertexSize = 8, this.twoColorTint = !1, this.renderable = new p(null, 0, 0), this.clipper = new o.SkeletonClipping(), this.temp = new o.Vector2(), this.temp2 = new o.Vector2(), this.temp3 = new o.Color(), this.temp4 = new o.Color(), this.twoColorTint = r, r && (this.vertexSize += 4), this.vertices = o.Utils.newFloatArray(this.vertexSize * 1024);
      }
      return t.prototype.draw = function(i, r, n, f) {
        n === void 0 && (n = -1), f === void 0 && (f = -1);
        var l = this.clipper, v = this.premultipliedAlpha, c = this.twoColorTint, s = null, h = this.temp, d = this.temp2, u = this.temp3, M = this.temp4, C = this.renderable, S = null, L = null, E = r.drawOrder, A = null, g = r.color, m = c ? 12 : 8, x = !1;
        n == -1 && (x = !0);
        for (var P = 0, k = E.length; P < k; P++) {
          var O = l.isClipping() ? 2 : m, R = E[P];
          if (!R.bone.active) {
            l.clipEndWithSlot(R);
            continue;
          }
          if (n >= 0 && n == R.data.index && (x = !0), !x) {
            l.clipEndWithSlot(R);
            continue;
          }
          f >= 0 && f == R.data.index && (x = !1);
          var D = R.getAttachment(), N = null;
          if (D instanceof o.RegionAttachment) {
            var I = D;
            C.vertices = this.vertices, C.numVertices = 4, C.numFloats = O << 2, I.computeWorldVertices(R.bone, C.vertices, 0, O), L = t.QUAD_TRIANGLES, S = I.uvs, N = I.region.renderObject.texture, A = I.color;
          } else if (D instanceof o.MeshAttachment) {
            var y = D;
            C.vertices = this.vertices, C.numVertices = y.worldVerticesLength >> 1, C.numFloats = C.numVertices * O, C.numFloats > C.vertices.length && (C.vertices = this.vertices = o.Utils.newFloatArray(C.numFloats)), y.computeWorldVertices(R, 0, y.worldVerticesLength, C.vertices, 0, O), L = y.triangles, N = y.region.renderObject.texture, S = y.uvs, A = y.color;
          } else if (D instanceof o.ClippingAttachment) {
            var T = D;
            l.clipStart(R, T);
            continue;
          } else {
            l.clipEndWithSlot(R);
            continue;
          }
          if (N != null) {
            var B = R.color, V = this.tempColor;
            V.r = g.r * B.r * A.r, V.g = g.g * B.g * A.g, V.b = g.b * B.b * A.b, V.a = g.a * B.a * A.a, v && (V.r *= V.a, V.g *= V.a, V.b *= V.a);
            var G = this.tempColor2;
            R.darkColor == null ? G.set(0, 0, 0, 1) : (v ? (G.r = R.darkColor.r * V.a, G.g = R.darkColor.g * V.a, G.b = R.darkColor.b * V.a) : G.setFromColor(R.darkColor), G.a = v ? 1 : 0);
            var Y = R.data.blendMode;
            if (Y != s && (s = Y, i.setBlendMode(e.WebGLBlendModeConverter.getSourceGLBlendMode(s, v), e.WebGLBlendModeConverter.getDestGLBlendMode(s))), l.isClipping()) {
              l.clipTriangles(C.vertices, C.numFloats, L, L.length, S, V, G, c);
              var _ = new Float32Array(l.clippedVertices), X = l.clippedTriangles;
              if (this.vertexEffect != null) {
                var W = this.vertexEffect, U = _;
                if (c)
                  for (var w = 0, z = _.length; w < z; w += m)
                    h.x = U[w], h.y = U[w + 1], u.set(U[w + 2], U[w + 3], U[w + 4], U[w + 5]), d.x = U[w + 6], d.y = U[w + 7], M.set(U[w + 8], U[w + 9], U[w + 10], U[w + 11]), W.transform(h, d, u, M), U[w] = h.x, U[w + 1] = h.y, U[w + 2] = u.r, U[w + 3] = u.g, U[w + 4] = u.b, U[w + 5] = u.a, U[w + 6] = d.x, U[w + 7] = d.y, U[w + 8] = M.r, U[w + 9] = M.g, U[w + 10] = M.b, U[w + 11] = M.a;
                else
                  for (var w = 0, Z = _.length; w < Z; w += m)
                    h.x = U[w], h.y = U[w + 1], u.set(U[w + 2], U[w + 3], U[w + 4], U[w + 5]), d.x = U[w + 6], d.y = U[w + 7], M.set(0, 0, 0, 0), W.transform(h, d, u, M), U[w] = h.x, U[w + 1] = h.y, U[w + 2] = u.r, U[w + 3] = u.g, U[w + 4] = u.b, U[w + 5] = u.a, U[w + 6] = d.x, U[w + 7] = d.y;
              }
              i.draw(N, _, X);
            } else {
              var U = C.vertices;
              if (this.vertexEffect != null) {
                var W = this.vertexEffect;
                if (c)
                  for (var w = 0, j = 0, q = C.numFloats; w < q; w += m, j += 2)
                    h.x = U[w], h.y = U[w + 1], d.x = S[j], d.y = S[j + 1], u.setFromColor(V), M.setFromColor(G), W.transform(h, d, u, M), U[w] = h.x, U[w + 1] = h.y, U[w + 2] = u.r, U[w + 3] = u.g, U[w + 4] = u.b, U[w + 5] = u.a, U[w + 6] = d.x, U[w + 7] = d.y, U[w + 8] = M.r, U[w + 9] = M.g, U[w + 10] = M.b, U[w + 11] = M.a;
                else
                  for (var w = 0, j = 0, H = C.numFloats; w < H; w += m, j += 2)
                    h.x = U[w], h.y = U[w + 1], d.x = S[j], d.y = S[j + 1], u.setFromColor(V), M.set(0, 0, 0, 0), W.transform(h, d, u, M), U[w] = h.x, U[w + 1] = h.y, U[w + 2] = u.r, U[w + 3] = u.g, U[w + 4] = u.b, U[w + 5] = u.a, U[w + 6] = d.x, U[w + 7] = d.y;
              } else if (c)
                for (var w = 2, j = 0, J = C.numFloats; w < J; w += m, j += 2)
                  U[w] = V.r, U[w + 1] = V.g, U[w + 2] = V.b, U[w + 3] = V.a, U[w + 4] = S[j], U[w + 5] = S[j + 1], U[w + 6] = G.r, U[w + 7] = G.g, U[w + 8] = G.b, U[w + 9] = G.a;
              else
                for (var w = 2, j = 0, K = C.numFloats; w < K; w += m, j += 2)
                  U[w] = V.r, U[w + 1] = V.g, U[w + 2] = V.b, U[w + 3] = V.a, U[w + 4] = S[j], U[w + 5] = S[j + 1];
              var at = C.vertices.subarray(0, C.numFloats);
              i.draw(N, at, L);
            }
          }
          l.clipEndWithSlot(R);
        }
        l.clipEnd();
      }, t.QUAD_TRIANGLES = [0, 1, 2, 2, 3, 0], t;
    })();
    e.SkeletonRenderer = a;
  })(o.webgl || (o.webgl = {}));
})(F || (F = {}));
var F;
(function(o) {
  (function(e) {
    var p = (function() {
      function a(t, i, r) {
        t === void 0 && (t = 0), i === void 0 && (i = 0), r === void 0 && (r = 0), this.x = 0, this.y = 0, this.z = 0, this.x = t, this.y = i, this.z = r;
      }
      return a.prototype.setFrom = function(t) {
        return this.x = t.x, this.y = t.y, this.z = t.z, this;
      }, a.prototype.set = function(t, i, r) {
        return this.x = t, this.y = i, this.z = r, this;
      }, a.prototype.add = function(t) {
        return this.x += t.x, this.y += t.y, this.z += t.z, this;
      }, a.prototype.sub = function(t) {
        return this.x -= t.x, this.y -= t.y, this.z -= t.z, this;
      }, a.prototype.scale = function(t) {
        return this.x *= t, this.y *= t, this.z *= t, this;
      }, a.prototype.normalize = function() {
        var t = this.length();
        return t == 0 ? this : (t = 1 / t, this.x *= t, this.y *= t, this.z *= t, this);
      }, a.prototype.cross = function(t) {
        return this.set(this.y * t.z - this.z * t.y, this.z * t.x - this.x * t.z, this.x * t.y - this.y * t.x);
      }, a.prototype.multiply = function(t) {
        var i = t.values;
        return this.set(this.x * i[e.M00] + this.y * i[e.M01] + this.z * i[e.M02] + i[e.M03], this.x * i[e.M10] + this.y * i[e.M11] + this.z * i[e.M12] + i[e.M13], this.x * i[e.M20] + this.y * i[e.M21] + this.z * i[e.M22] + i[e.M23]);
      }, a.prototype.project = function(t) {
        var i = t.values, r = 1 / (this.x * i[e.M30] + this.y * i[e.M31] + this.z * i[e.M32] + i[e.M33]);
        return this.set((this.x * i[e.M00] + this.y * i[e.M01] + this.z * i[e.M02] + i[e.M03]) * r, (this.x * i[e.M10] + this.y * i[e.M11] + this.z * i[e.M12] + i[e.M13]) * r, (this.x * i[e.M20] + this.y * i[e.M21] + this.z * i[e.M22] + i[e.M23]) * r);
      }, a.prototype.dot = function(t) {
        return this.x * t.x + this.y * t.y + this.z * t.z;
      }, a.prototype.length = function() {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
      }, a.prototype.distance = function(t) {
        var i = t.x - this.x, r = t.y - this.y, n = t.z - this.z;
        return Math.sqrt(i * i + r * r + n * n);
      }, a;
    })();
    e.Vector3 = p;
  })(o.webgl || (o.webgl = {}));
})(F || (F = {}));
var F;
(function(o) {
  (function(e) {
    var p = (function() {
      function t(i, r) {
        r === void 0 && (r = { alpha: "true" }), this.restorables = new Array(), i instanceof WebGLRenderingContext || i instanceof WebGL2RenderingContext ? (this.gl = i, this.canvas = this.gl.canvas) : this.setupCanvas(i, r);
      }
      return t.prototype.setupCanvas = function(i, r) {
        var n = this;
        this.gl = i.getContext("webgl2", r) || i.getContext("webgl", r), this.canvas = i, i.addEventListener("webglcontextlost", function(f) {
          f && f.preventDefault();
        }), i.addEventListener("webglcontextrestored", function(f) {
          for (var l = 0, v = n.restorables.length; l < v; l++)
            n.restorables[l].restore();
        });
      }, t.prototype.addRestorable = function(i) {
        this.restorables.push(i);
      }, t.prototype.removeRestorable = function(i) {
        var r = this.restorables.indexOf(i);
        r > -1 && this.restorables.splice(r, 1);
      }, t;
    })();
    e.ManagedWebGLRenderingContext = p;
    var a = (function() {
      function t() {
      }
      return t.getDestGLBlendMode = function(i) {
        switch (i) {
          case o.BlendMode.Normal:
            return t.ONE_MINUS_SRC_ALPHA;
          case o.BlendMode.Additive:
            return t.ONE;
          case o.BlendMode.Multiply:
            return t.ONE_MINUS_SRC_ALPHA;
          case o.BlendMode.Screen:
            return t.ONE_MINUS_SRC_ALPHA;
          default:
            throw new Error("Unknown blend mode: " + i);
        }
      }, t.getSourceGLBlendMode = function(i, r) {
        switch (r === void 0 && (r = !1), i) {
          case o.BlendMode.Normal:
            return r ? t.ONE : t.SRC_ALPHA;
          case o.BlendMode.Additive:
            return r ? t.ONE : t.SRC_ALPHA;
          case o.BlendMode.Multiply:
            return t.DST_COLOR;
          case o.BlendMode.Screen:
            return t.ONE;
          default:
            throw new Error("Unknown blend mode: " + i);
        }
      }, t.ZERO = 0, t.ONE = 1, t.SRC_COLOR = 768, t.ONE_MINUS_SRC_COLOR = 769, t.SRC_ALPHA = 770, t.ONE_MINUS_SRC_ALPHA = 771, t.DST_ALPHA = 772, t.ONE_MINUS_DST_ALPHA = 773, t.DST_COLOR = 774, t;
    })();
    e.WebGLBlendModeConverter = a;
  })(o.webgl || (o.webgl = {}));
})(F || (F = {}));
var F;
(function(o) {
  var e = (function() {
    function c(s, h, d) {
      this.player = s, this.dom = f(`
				<div class="spine-player-popup spine-player-hidden">
				</div>
			`), this.dom.innerHTML = d, h.appendChild(this.dom);
    }
    return c.prototype.show = function(s) {
      var h = this;
      this.dom.classList.remove("spine-player-hidden");
      var d = !1, u = function() {
        d || requestAnimationFrame(u);
        var S = Math.abs(h.dom.getBoundingClientRect().bottom - h.player.getBoundingClientRect().bottom), L = Math.abs(h.dom.getBoundingClientRect().right - h.player.getBoundingClientRect().right), E = h.player.clientHeight - S - L;
        h.dom.style.maxHeight = E + "px";
      };
      requestAnimationFrame(u);
      var M = !0, C = function(S) {
        if (M) {
          M = !1;
          return;
        }
        i(h.dom, S.target) || (h.dom.remove(), window.removeEventListener("click", C), s(), d = !0);
      };
      window.addEventListener("click", C);
    }, c;
  })(), p = (function() {
    function c(s) {
      this.text = s, this.enabled = !1;
    }
    return c.prototype.render = function() {
      var s = this;
      return this.switch = f(`
				<div class="spine-player-switch">
					<span class="spine-player-switch-text">` + this.text + `</span>
					<div class="spine-player-switch-knob-area">
						<div class="spine-player-switch-knob"></div>
					</div>
				</div>
			`), this.switch.addEventListener("click", function() {
        s.setEnabled(!s.enabled), s.change && s.change(s.enabled);
      }), this.switch;
    }, c.prototype.setEnabled = function(s) {
      s ? this.switch.classList.add("active") : this.switch.classList.remove("active"), this.enabled = s;
    }, c.prototype.isEnabled = function() {
      return this.enabled;
    }, c;
  })(), a = (function() {
    function c(s, h, d) {
      s === void 0 && (s = 0), h === void 0 && (h = 0.1), d === void 0 && (d = !1), this.snaps = s, this.snapPercentage = h, this.big = d;
    }
    return c.prototype.render = function() {
      var s = this;
      this.slider = f(`
				<div class="spine-player-slider ` + (this.big ? "big" : "") + `">
					<div class="spine-player-slider-value"></div>
					<!--<div class="spine-player-slider-knob"></div>-->
				</div>
			`), this.value = n(this.slider, "spine-player-slider-value")[0], this.setValue(0);
      var h = new o.webgl.Input(this.slider), d = !1;
      return h.addListener({
        down: function(u, M) {
          d = !0, s.value.classList.add("hovering");
        },
        up: function(u, M) {
          d = !1;
          var C = u / s.slider.clientWidth;
          C = C = Math.max(0, Math.min(C, 1)), s.setValue(u / s.slider.clientWidth), s.change && s.change(C), s.value.classList.remove("hovering");
        },
        moved: function(u, M) {
          if (d) {
            var C = u / s.slider.clientWidth;
            C = Math.max(0, Math.min(C, 1)), C = s.setValue(u / s.slider.clientWidth), s.change && s.change(C);
          }
        },
        dragged: function(u, M) {
          var C = u / s.slider.clientWidth;
          C = Math.max(0, Math.min(C, 1)), C = s.setValue(u / s.slider.clientWidth), s.change && s.change(C);
        }
      }), this.slider;
    }, c.prototype.setValue = function(s) {
      if (s = Math.max(0, Math.min(1, s)), this.snaps > 0) {
        var h = s % (1 / this.snaps);
        h < 1 / this.snaps * this.snapPercentage ? s = s - h : h > 1 / this.snaps - 1 / this.snaps * this.snapPercentage && (s = s - h + 1 / this.snaps), s = Math.max(0, Math.min(1, s));
      }
      return this.value.style.width = "" + s * 100 + "%", s;
    }, c;
  })(), t = (function() {
    function c(s, h) {
      this.config = h, this.paused = !0, this.playTime = 0, this.speed = 1, this.time = new o.TimeKeeper(), this.animationViewports = {}, this.currentViewport = null, this.previousViewport = null, this.viewportTransitionStart = 0, this.stopRequestAnimationFrame = !1, this.cancelId = 0, typeof s == "string" ? this.parent = document.getElementById(s) : this.parent = s, this.parent.appendChild(this.render());
    }
    return c.prototype.validateConfig = function(s) {
      if (!s)
        throw new Error("Please pass a configuration to new.spine.SpinePlayer().");
      if (!s.jsonUrl && !s.skelUrl)
        throw new Error("Please specify the URL of the skeleton JSON or .skel file.");
      if (!s.atlasUrl)
        throw new Error("Please specify the URL of the atlas file.");
      if (s.alpha || (s.alpha = !1), s.backgroundColor || (s.backgroundColor = "#000000"), s.fullScreenBackgroundColor || (s.fullScreenBackgroundColor = s.backgroundColor), typeof s.premultipliedAlpha > "u" && (s.premultipliedAlpha = !0), s.success || (s.success = function(h) {
      }), s.error || (s.error = function(h, d) {
      }), s.debug || (s.debug = {
        bones: !1,
        regions: !1,
        meshes: !1,
        bounds: !1,
        clipping: !1,
        paths: !1,
        points: !1,
        hulls: !1
      }), typeof s.debug.bones > "u" && (s.debug.bones = !1), typeof s.debug.bounds > "u" && (s.debug.bounds = !1), typeof s.debug.clipping > "u" && (s.debug.clipping = !1), typeof s.debug.hulls > "u" && (s.debug.hulls = !1), typeof s.debug.paths > "u" && (s.debug.paths = !1), typeof s.debug.points > "u" && (s.debug.points = !1), typeof s.debug.regions > "u" && (s.debug.regions = !1), typeof s.debug.meshes > "u" && (s.debug.meshes = !1), s.animations && s.animation && s.animations.indexOf(s.animation) < 0)
        throw new Error("Default animation '" + s.animation + "' is not contained in the list of selectable animations " + v(JSON.stringify(this.config.animations)) + ".");
      if (s.skins && s.skin && s.skins.indexOf(s.skin) < 0)
        throw new Error("Default skin '" + s.skin + "' is not contained in the list of selectable skins " + v(JSON.stringify(this.config.skins)) + ".");
      return s.controlBones || (s.controlBones = []), typeof s.showControls > "u" && (s.showControls = !0), typeof s.defaultMix > "u" && (s.defaultMix = 0.25), s;
    }, c.prototype.showError = function(s) {
      var h = n(this.dom, "spine-player-error")[0];
      h.classList.remove("spine-player-hidden"), h.innerHTML = '<p style="text-align: center; align-self: center;">' + s + "</p>", this.config.error(this, s);
    }, c.prototype.render = function() {
      var s = this, h = this.config, d = this.dom = f(`
				<div class="spine-player">
					<canvas class="spine-player-canvas"></canvas>
					<div class="spine-player-error spine-player-hidden"></div>
					<div class="spine-player-controls spine-player-popup-parent spine-player-controls-hidden">
						<div class="spine-player-timeline">
						</div>
						<div class="spine-player-buttons">
							<button id="spine-player-button-play-pause" class="spine-player-button spine-player-button-icon-pause"></button>
							<div class="spine-player-button-spacer"></div>
							<button id="spine-player-button-speed" class="spine-player-button spine-player-button-icon-speed"></button>
							<button id="spine-player-button-animation" class="spine-player-button spine-player-button-icon-animations"></button>
							<button id="spine-player-button-skin" class="spine-player-button spine-player-button-icon-skins"></button>
							<button id="spine-player-button-settings" class="spine-player-button spine-player-button-icon-settings"></button>
							<button id="spine-player-button-fullscreen" class="spine-player-button spine-player-button-icon-fullscreen"></button>
							<img id="spine-player-button-logo" class="spine-player-button-icon-spine-logo" src="data:image/svg+xml,%3Csvg%20id%3D%22Spine_Logo%22%20data-name%3D%22Spine%20Logo%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20104%2031.16%22%3E%3Cdefs%3E%3Cstyle%3E.cls-1%7Bfill%3A%23fff%3B%7D.cls-2%7Bfill%3A%23ff4000%3B%7D%3C%2Fstyle%3E%3C%2Fdefs%3E%3Ctitle%3Espine-logo-white%3C%2Ftitle%3E%3Cpath%20id%3D%22e%22%20class%3D%22cls-1%22%20d%3D%22M104%2C12.68a1.31%2C1.31%2C0%2C0%2C1-.37%2C1%2C1.28%2C1.28%2C0%2C0%2C1-.85.31H91.57a10.51%2C10.51%2C0%2C0%2C0%2C.29%2C2.55%2C4.92%2C4.92%2C0%2C0%2C0%2C1%2C2A4.27%2C4.27%2C0%2C0%2C0%2C94.5%2C19.8a6.89%2C6.89%2C0%2C0%2C0%2C2.6.44%2C10.66%2C10.66%2C0%2C0%2C0%2C2.17-.2%2C12.81%2C12.81%2C0%2C0%2C0%2C1.64-.44q.69-.25%2C1.14-.44a1.87%2C1.87%2C0%2C0%2C1%2C.68-.2A.44.44%2C0%2C0%2C1%2C103%2C19a.43.43%2C0%2C0%2C1%2C.16.2%2C1.38%2C1.38%2C0%2C0%2C1%2C.09.37%2C4.89%2C4.89%2C0%2C0%2C1%2C0%2C.58%2C4.14%2C4.14%2C0%2C0%2C1%2C0%2C.43v.32a.83.83%2C0%2C0%2C1-.09.26%2C1.1%2C1.1%2C0%2C0%2C1-.17.22%2C2.77%2C2.77%2C0%2C0%2C1-.61.34%2C8.94%2C8.94%2C0%2C0%2C1-1.32.46%2C18.54%2C18.54%2C0%2C0%2C1-1.88.41%2C13.78%2C13.78%2C0%2C0%2C1-2.28.18%2C10.55%2C10.55%2C0%2C0%2C1-3.68-.59%2C6.82%2C6.82%2C0%2C0%2C1-2.66-1.74%2C7.44%2C7.44%2C0%2C0%2C1-1.63-2.89%2C13.48%2C13.48%2C0%2C0%2C1-.55-4%2C12.76%2C12.76%2C0%2C0%2C1%2C.57-3.94%2C8.35%2C8.35%2C0%2C0%2C1%2C1.64-3%2C7.15%2C7.15%2C0%2C0%2C1%2C2.58-1.87%2C8.47%2C8.47%2C0%2C0%2C1%2C3.39-.65%2C8.19%2C8.19%2C0%2C0%2C1%2C3.41.64%2C6.46%2C6.46%2C0%2C0%2C1%2C2.32%2C1.73A7%2C7%2C0%2C0%2C1%2C103.59%2C9a11.17%2C11.17%2C0%2C0%2C1%2C.43%2C3.13Zm-3.14-.93a5.69%2C5.69%2C0%2C0%2C0-1.09-3.86%2C4.17%2C4.17%2C0%2C0%2C0-3.42-1.4%2C4.52%2C4.52%2C0%2C0%2C0-2%2C.44%2C4.41%2C4.41%2C0%2C0%2C0-1.47%2C1.15A5.29%2C5.29%2C0%2C0%2C0%2C92%2C9.75a7%2C7%2C0%2C0%2C0-.36%2C2Z%22%2F%3E%3Cpath%20id%3D%22n%22%20class%3D%22cls-1%22%20d%3D%22M80.68%2C21.94a.42.42%2C0%2C0%2C1-.08.26.59.59%2C0%2C0%2C1-.25.18%2C1.74%2C1.74%2C0%2C0%2C1-.47.11%2C6.31%2C6.31%2C0%2C0%2C1-.76%2C0%2C6.5%2C6.5%2C0%2C0%2C1-.78%2C0%2C1.74%2C1.74%2C0%2C0%2C1-.47-.11.59.59%2C0%2C0%2C1-.25-.18.42.42%2C0%2C0%2C1-.08-.26V12a9.8%2C9.8%2C0%2C0%2C0-.23-2.35%2C4.86%2C4.86%2C0%2C0%2C0-.66-1.53%2C2.88%2C2.88%2C0%2C0%2C0-1.13-1%2C3.57%2C3.57%2C0%2C0%2C0-1.6-.34%2C4%2C4%2C0%2C0%2C0-2.35.83A12.71%2C12.71%2C0%2C0%2C0%2C69.11%2C10v11.9a.42.42%2C0%2C0%2C1-.08.26.59.59%2C0%2C0%2C1-.25.18%2C1.74%2C1.74%2C0%2C0%2C1-.47.11%2C6.51%2C6.51%2C0%2C0%2C1-.78%2C0%2C6.31%2C6.31%2C0%2C0%2C1-.76%2C0%2C1.88%2C1.88%2C0%2C0%2C1-.48-.11.52.52%2C0%2C0%2C1-.25-.18.46.46%2C0%2C0%2C1-.07-.26v-17A.53.53%2C0%2C0%2C1%2C66%2C4.69a.5.5%2C0%2C0%2C1%2C.23-.19%2C1.28%2C1.28%2C0%2C0%2C1%2C.44-.11%2C8.53%2C8.53%2C0%2C0%2C1%2C1.39%2C0%2C1.12%2C1.12%2C0%2C0%2C1%2C.43.11.6.6%2C0%2C0%2C1%2C.22.19.47.47%2C0%2C0%2C1%2C.07.26V7.2a10.46%2C10.46%2C0%2C0%2C1%2C2.87-2.36%2C6.17%2C6.17%2C0%2C0%2C1%2C2.88-.75%2C6.41%2C6.41%2C0%2C0%2C1%2C2.87.58%2C5.16%2C5.16%2C0%2C0%2C1%2C1.88%2C1.54%2C6.15%2C6.15%2C0%2C0%2C1%2C1%2C2.26%2C13.46%2C13.46%2C0%2C0%2C1%2C.31%2C3.11Z%22%2F%3E%3Cg%20id%3D%22i%22%3E%3Cpath%20class%3D%22cls-2%22%20d%3D%22M43.35%2C2.86c.09%2C2.6%2C1.89%2C4%2C5.48%2C4.61%2C3%2C.48%2C5.79.24%2C6.69-2.37%2C1.75-5.09-2.4-3.82-6-4.39S43.21-1.32%2C43.35%2C2.86Z%22%2F%3E%3Cpath%20class%3D%22cls-2%22%20d%3D%22M44.43%2C13.55c.33%2C1.94%2C2.14%2C3.06%2C4.91%2C3s4.84-1.16%2C5.13-3.25c.53-3.88-2.53-2.38-5.3-2.3S43.77%2C9.74%2C44.43%2C13.55Z%22%2F%3E%3Cpath%20class%3D%22cls-2%22%20d%3D%22M48%2C22.44c.55%2C1.45%2C2.06%2C2.06%2C4.1%2C1.63s3.45-1.11%2C3.33-2.76c-.21-3.06-2.22-2.1-4.26-1.66S47%2C19.6%2C48%2C22.44Z%22%2F%3E%3Cpath%20class%3D%22cls-2%22%20d%3D%22M49.78%2C29.22c.16%2C1.22%2C1.22%2C2%2C2.88%2C1.93s2.92-.67%2C3.13-2c.4-2.43-1.46-1.53-3.12-1.51S49.5%2C26.82%2C49.78%2C29.22Z%22%2F%3E%3C%2Fg%3E%3Cpath%20id%3D%22p%22%20class%3D%22cls-1%22%20d%3D%22M35.28%2C13.16a15.33%2C15.33%2C0%2C0%2C1-.48%2C4%2C8.75%2C8.75%2C0%2C0%2C1-1.42%2C3%2C6.35%2C6.35%2C0%2C0%2C1-2.32%2C1.91%2C7.14%2C7.14%2C0%2C0%2C1-3.16.67%2C6.1%2C6.1%2C0%2C0%2C1-1.4-.15%2C5.34%2C5.34%2C0%2C0%2C1-1.26-.47A7.29%2C7.29%2C0%2C0%2C1%2C24%2C21.31q-.61-.49-1.29-1.15v8.51a.47.47%2C0%2C0%2C1-.08.26.56.56%2C0%2C0%2C1-.25.19%2C1.74%2C1.74%2C0%2C0%2C1-.47.11%2C6.47%2C6.47%2C0%2C0%2C1-.78%2C0%2C6.26%2C6.26%2C0%2C0%2C1-.76%2C0%2C1.89%2C1.89%2C0%2C0%2C1-.48-.11.49.49%2C0%2C0%2C1-.25-.19.51.51%2C0%2C0%2C1-.07-.26V4.91a.57.57%2C0%2C0%2C1%2C.06-.27.46.46%2C0%2C0%2C1%2C.23-.18%2C1.47%2C1.47%2C0%2C0%2C1%2C.44-.1%2C7.41%2C7.41%2C0%2C0%2C1%2C1.3%2C0%2C1.45%2C1.45%2C0%2C0%2C1%2C.43.1.52.52%2C0%2C0%2C1%2C.24.18.51.51%2C0%2C0%2C1%2C.07.27V7.2a18.06%2C18.06%2C0%2C0%2C1%2C1.49-1.38%2C9%2C9%2C0%2C0%2C1%2C1.45-1%2C6.82%2C6.82%2C0%2C0%2C1%2C1.49-.59%2C7.09%2C7.09%2C0%2C0%2C1%2C4.78.52%2C6%2C6%2C0%2C0%2C1%2C2.13%2C2%2C8.79%2C8.79%2C0%2C0%2C1%2C1.2%2C2.9A15.72%2C15.72%2C0%2C0%2C1%2C35.28%2C13.16ZM32%2C13.52a15.64%2C15.64%2C0%2C0%2C0-.2-2.53%2C7.32%2C7.32%2C0%2C0%2C0-.69-2.17%2C4.06%2C4.06%2C0%2C0%2C0-1.3-1.51%2C3.49%2C3.49%2C0%2C0%2C0-2-.57%2C4.1%2C4.1%2C0%2C0%2C0-1.2.18%2C4.92%2C4.92%2C0%2C0%2C0-1.2.57%2C8.54%2C8.54%2C0%2C0%2C0-1.28%2C1A15.77%2C15.77%2C0%2C0%2C0%2C22.76%2C10v6.77a13.53%2C13.53%2C0%2C0%2C0%2C2.46%2C2.4%2C4.12%2C4.12%2C0%2C0%2C0%2C2.44.83%2C3.56%2C3.56%2C0%2C0%2C0%2C2-.57A4.28%2C4.28%2C0%2C0%2C0%2C31%2C18a7.58%2C7.58%2C0%2C0%2C0%2C.77-2.12A11.43%2C11.43%2C0%2C0%2C0%2C32%2C13.52Z%22%2F%3E%3Cpath%20id%3D%22s%22%20class%3D%22cls-1%22%20d%3D%22M12%2C17.3a5.39%2C5.39%2C0%2C0%2C1-.48%2C2.33%2C4.73%2C4.73%2C0%2C0%2C1-1.37%2C1.72%2C6.19%2C6.19%2C0%2C0%2C1-2.12%2C1.06%2C9.62%2C9.62%2C0%2C0%2C1-2.71.36%2C10.38%2C10.38%2C0%2C0%2C1-3.21-.5%2C7.63%2C7.63%2C0%2C0%2C1-1.11-.45%2C3.25%2C3.25%2C0%2C0%2C1-.66-.43%2C1.09%2C1.09%2C0%2C0%2C1-.3-.53A3.59%2C3.59%2C0%2C0%2C1%2C0%2C19.93a4.06%2C4.06%2C0%2C0%2C1%2C0-.61%2C2%2C2%2C0%2C0%2C1%2C.09-.4.42.42%2C0%2C0%2C1%2C.16-.22.43.43%2C0%2C0%2C1%2C.24-.07%2C1.35%2C1.35%2C0%2C0%2C1%2C.61.26q.41.26%2C1%2C.56A9.22%2C9.22%2C0%2C0%2C0%2C3.51%2C20a6.25%2C6.25%2C0%2C0%2C0%2C1.87.26%2C5.62%2C5.62%2C0%2C0%2C0%2C1.44-.17%2C3.48%2C3.48%2C0%2C0%2C0%2C1.12-.5%2C2.23%2C2.23%2C0%2C0%2C0%2C.73-.84%2C2.68%2C2.68%2C0%2C0%2C0%2C.26-1.21%2C2%2C2%2C0%2C0%2C0-.37-1.21%2C3.55%2C3.55%2C0%2C0%2C0-1-.87A8.09%2C8.09%2C0%2C0%2C0%2C6.2%2C14.8l-1.56-.61a16%2C16%2C0%2C0%2C1-1.57-.73%2C6%2C6%2C0%2C0%2C1-1.37-1%2C4.52%2C4.52%2C0%2C0%2C1-1-1.4%2C4.69%2C4.69%2C0%2C0%2C1-.37-2A4.88%2C4.88%2C0%2C0%2C1%2C.72%2C7.19%2C4.46%2C4.46%2C0%2C0%2C1%2C1.88%2C5.58%2C5.83%2C5.83%2C0%2C0%2C1%2C3.82%2C4.47%2C8.06%2C8.06%2C0%2C0%2C1%2C6.53%2C4a8.28%2C8.28%2C0%2C0%2C1%2C1.36.11%2C9.36%2C9.36%2C0%2C0%2C1%2C1.23.28%2C5.92%2C5.92%2C0%2C0%2C1%2C.94.37%2C4.09%2C4.09%2C0%2C0%2C1%2C.59.35%2C1%2C1%2C0%2C0%2C1%2C.26.26.83.83%2C0%2C0%2C1%2C.09.26%2C1.32%2C1.32%2C0%2C0%2C0%2C.06.35%2C3.87%2C3.87%2C0%2C0%2C1%2C0%2C.51%2C4.76%2C4.76%2C0%2C0%2C1%2C0%2C.56%2C1.39%2C1.39%2C0%2C0%2C1-.09.39.5.5%2C0%2C0%2C1-.16.22.35.35%2C0%2C0%2C1-.21.07%2C1%2C1%2C0%2C0%2C1-.49-.21%2C7%2C7%2C0%2C0%2C0-.83-.44%2C9.26%2C9.26%2C0%2C0%2C0-1.2-.44A5.49%2C5.49%2C0%2C0%2C0%2C6.5%2C6.48a4.93%2C4.93%2C0%2C0%2C0-1.4.18%2C2.69%2C2.69%2C0%2C0%2C0-1%2C.51A2.16%2C2.16%2C0%2C0%2C0%2C3.51%2C8a2.43%2C2.43%2C0%2C0%2C0-.2%2C1%2C2%2C2%2C0%2C0%2C0%2C.38%2C1.24%2C3.6%2C3.6%2C0%2C0%2C0%2C1%2C.88%2C8.25%2C8.25%2C0%2C0%2C0%2C1.38.68l1.58.62q.8.32%2C1.59.72a6%2C6%2C0%2C0%2C1%2C1.39%2C1%2C4.37%2C4.37%2C0%2C0%2C1%2C1%2C1.36A4.46%2C4.46%2C0%2C0%2C1%2C12%2C17.3Z%22%2F%3E%3C%2Fsvg%3E"/>
						</div>
					</div>
				</div>
			`);
      try {
        this.config = this.validateConfig(h);
      } catch (R) {
        return this.showError(R), d;
      }
      try {
        this.canvas = n(d, "spine-player-canvas")[0];
        var u = { alpha: h.alpha };
        this.context = new o.webgl.ManagedWebGLRenderingContext(this.canvas, u), this.sceneRenderer = new o.webgl.SceneRenderer(this.canvas, this.context, !0), this.loadingScreen = new o.webgl.LoadingScreen(this.sceneRenderer);
      } catch {
        return this.showError("Sorry, your browser does not support WebGL.<br><br>Please use the latest version of Firefox, Chrome, Edge, or Safari."), d;
      }
      if (this.assetManager = new o.webgl.AssetManager(this.context), h.rawDataURIs)
        for (var M in h.rawDataURIs) {
          var C = h.rawDataURIs[M];
          this.assetManager.setRawDataURI(M, C);
        }
      h.jsonUrl ? this.assetManager.loadText(h.jsonUrl) : this.assetManager.loadBinary(h.skelUrl), this.assetManager.loadTextureAtlas(h.atlasUrl), h.backgroundImage && h.backgroundImage.url && this.assetManager.loadTexture(h.backgroundImage.url), requestAnimationFrame(function() {
        return s.drawFrame();
      }), this.playerControls = n(d, "spine-player-controls")[0];
      var S = n(d, "spine-player-timeline")[0];
      this.timelineSlider = new a(), S.appendChild(this.timelineSlider.render()), this.playButton = r(d, "spine-player-button-play-pause")[0];
      var L = r(d, "spine-player-button-speed")[0];
      this.animationButton = r(d, "spine-player-button-animation")[0], this.skinButton = r(d, "spine-player-button-skin")[0];
      var E = r(d, "spine-player-button-settings")[0], A = r(d, "spine-player-button-fullscreen")[0], g = r(d, "spine-player-button-logo")[0];
      this.playButton.onclick = function() {
        s.paused ? s.play() : s.pause();
      }, L.onclick = function() {
        s.showSpeedDialog(L);
      }, this.animationButton.onclick = function() {
        s.showAnimationsDialog(s.animationButton);
      }, this.skinButton.onclick = function() {
        s.showSkinsDialog(s.skinButton);
      }, E.onclick = function() {
        s.showSettingsDialog(E);
      };
      var m = this.canvas.clientWidth, x = this.canvas.clientHeight, P = this.canvas.style.width, k = this.canvas.style.height, O = !1;
      return A.onclick = function() {
        var R = function() {
          O = !O, O || (s.canvas.style.width = "" + m + "px", s.canvas.style.height = "" + x + "px", s.drawFrame(!1), requestAnimationFrame(function() {
            s.canvas.style.width = P, s.canvas.style.height = k;
          }));
        }, D = document;
        if (d.onfullscreenchange = R, d.onwebkitfullscreenchange = R, D.fullscreenElement || D.webkitFullscreenElement || D.mozFullScreenElement || D.msFullscreenElement)
          D.exitFullscreen ? D.exitFullscreen() : D.mozCancelFullScreen ? D.mozCancelFullScreen() : D.webkitExitFullscreen ? D.webkitExitFullscreen() : D.msExitFullscreen && D.msExitFullscreen();
        else {
          m = s.canvas.clientWidth, x = s.canvas.clientHeight, P = s.canvas.style.width, k = s.canvas.style.height;
          var N = d;
          N.requestFullscreen ? N.requestFullscreen() : N.webkitRequestFullScreen ? N.webkitRequestFullScreen() : N.mozRequestFullScreen ? N.mozRequestFullScreen() : N.msRequestFullscreen && N.msRequestFullscreen();
        }
      }, g.onclick = function() {
        window.open("http://esotericsoftware.com");
      }, window.onresize = function() {
        s.drawFrame(!1);
      }, d;
    }, c.prototype.showSpeedDialog = function(s) {
      var h = this;
      if (this.lastPopup && this.lastPopup.dom.remove(), this.lastPopup && n(this.lastPopup.dom, "spine-player-popup-title")[0].textContent == "Speed") {
        this.lastPopup = null, s.classList.remove("spine-player-button-icon-speed-selected");
        return;
      }
      var d = new e(this.dom, this.playerControls, `
				<div class="spine-player-popup-title">Speed</div>
				<hr>
				<div class="spine-player-row" style="user-select: none; align-items: center; padding: 8px;">
					<div class="spine-player-column">
						<div class="spine-player-speed-slider" style="margin-bottom: 4px;"></div>
						<div class="spine-player-row" style="justify-content: space-between;">
							<div>0.1x</div>
							<div>1x</div>
							<div>2x</div>
						</div>
					</div>
				</div>
			`), u = n(d.dom, "spine-player-speed-slider")[0], M = new a(2, 0.1, !0);
      u.appendChild(M.render()), M.setValue(this.speed / 2), M.change = function(C) {
        h.speed = C * 2;
      }, s.classList.add("spine-player-button-icon-speed-selected"), d.show(function() {
        s.classList.remove("spine-player-button-icon-speed-selected"), d.dom.remove(), h.lastPopup = null;
      }), this.lastPopup = d;
    }, c.prototype.showAnimationsDialog = function(s) {
      var h = this;
      if (this.lastPopup && this.lastPopup.dom.remove(), this.lastPopup && n(this.lastPopup.dom, "spine-player-popup-title")[0].textContent == "Animations") {
        this.lastPopup = null, s.classList.remove("spine-player-button-icon-animations-selected");
        return;
      }
      if (!(!this.skeleton || this.skeleton.data.animations.length == 0)) {
        var d = new e(this.dom, this.playerControls, `
				<div class="spine-player-popup-title">Animations</div>
				<hr>
				<ul class="spine-player-list"></ul>
			`), u = n(d.dom, "spine-player-list")[0];
        this.skeleton.data.animations.forEach(function(M) {
          if (!(h.config.animations && h.config.animations.indexOf(M.name) < 0)) {
            var C = f(`
					<li class="spine-player-list-item selectable">
						<div class="selectable-circle">
						</div>
						<div class="selectable-text">
						</div>
					</li>
				`);
            M.name == h.config.animation && C.classList.add("selected"), n(C, "selectable-text")[0].innerText = M.name, u.appendChild(C), C.onclick = function() {
              l(u.children, "selected"), C.classList.add("selected"), h.config.animation = M.name, h.playTime = 0, h.setAnimation(M.name);
            };
          }
        }), s.classList.add("spine-player-button-icon-animations-selected"), d.show(function() {
          s.classList.remove("spine-player-button-icon-animations-selected"), d.dom.remove(), h.lastPopup = null;
        }), this.lastPopup = d;
      }
    }, c.prototype.showSkinsDialog = function(s) {
      var h = this;
      if (this.lastPopup && this.lastPopup.dom.remove(), this.lastPopup && n(this.lastPopup.dom, "spine-player-popup-title")[0].textContent == "Skins") {
        this.lastPopup = null, s.classList.remove("spine-player-button-icon-skins-selected");
        return;
      }
      if (!(!this.skeleton || this.skeleton.data.animations.length == 0)) {
        var d = new e(this.dom, this.playerControls, `
				<div class="spine-player-popup-title">Skins</div>
				<hr>
				<ul class="spine-player-list"></ul>
			`), u = n(d.dom, "spine-player-list")[0];
        this.skeleton.data.skins.forEach(function(M) {
          if (!(h.config.skins && h.config.skins.indexOf(M.name) < 0)) {
            var C = f(`
					<li class="spine-player-list-item selectable">
						<div class="selectable-circle">
						</div>
						<div class="selectable-text">
						</div>
					</li>
				`);
            M.name == h.config.skin && C.classList.add("selected"), n(C, "selectable-text")[0].innerText = M.name, u.appendChild(C), C.onclick = function() {
              l(u.children, "selected"), C.classList.add("selected"), h.config.skin = M.name, h.skeleton.setSkinByName(h.config.skin), h.skeleton.setSlotsToSetupPose();
            };
          }
        }), s.classList.add("spine-player-button-icon-skins-selected"), d.show(function() {
          s.classList.remove("spine-player-button-icon-skins-selected"), d.dom.remove(), h.lastPopup = null;
        }), this.lastPopup = d;
      }
    }, c.prototype.showSettingsDialog = function(s) {
      var h = this;
      if (this.lastPopup && this.lastPopup.dom.remove(), this.lastPopup && n(this.lastPopup.dom, "spine-player-popup-title")[0].textContent == "Debug") {
        this.lastPopup = null, s.classList.remove("spine-player-button-icon-settings-selected");
        return;
      }
      if (!(!this.skeleton || this.skeleton.data.animations.length == 0)) {
        var d = new e(this.dom, this.playerControls, `
				<div class="spine-player-popup-title">Debug</div>
				<hr>
				<ul class="spine-player-list">
				</li>
			`), u = n(d.dom, "spine-player-list")[0], M = function(C, S) {
          var L = f('<li class="spine-player-list-item"></li>'), E = new p(C);
          L.appendChild(E.render()), E.setEnabled(h.config.debug[S]), E.change = function(A) {
            h.config.debug[S] = A;
          }, u.appendChild(L);
        };
        M("Bones", "bones"), M("Regions", "regions"), M("Meshes", "meshes"), M("Bounds", "bounds"), M("Paths", "paths"), M("Clipping", "clipping"), M("Points", "points"), M("Hulls", "hulls"), s.classList.add("spine-player-button-icon-settings-selected"), d.show(function() {
          s.classList.remove("spine-player-button-icon-settings-selected"), d.dom.remove(), h.lastPopup = null;
        }), this.lastPopup = d;
      }
    }, c.prototype.drawFrame = function(s) {
      var h = this;
      if (!h.disposed) {
        s === void 0 && (s = !0), s && !this.stopRequestAnimationFrame && requestAnimationFrame(function() {
          return h.drawFrame();
        });
        var d = this.context, u = d.gl, M = document, C = M.fullscreenElement || M.webkitFullscreenElement || M.mozFullScreenElement || M.msFullscreenElement, S = new o.Color().setFromString(C ? this.config.fullScreenBackgroundColor : this.config.backgroundColor);
        if (u.clearColor(S.r, S.g, S.b, S.a), u.clear(u.COLOR_BUFFER_BIT), this.loadingScreen.backgroundColor.setFromColor(S), this.loadingScreen.draw(this.assetManager.isLoadingComplete()), this.assetManager.isLoadingComplete() && this.skeleton == null && this.loadSkeleton(), this.sceneRenderer.resize(o.webgl.ResizeMode.Expand), this.loaded) {
          if (!this.paused && this.config.animation) {
            this.time.update();
            var L = this.time.delta * this.speed, E = this.animationState.getCurrent(0).animation.duration;
            for (this.playTime += L; this.playTime >= E && E != 0; )
              this.playTime -= E;
            this.playTime = Math.max(0, Math.min(this.playTime, E)), this.timelineSlider.setValue(this.playTime / E), this.animationState.update(L), this.animationState.apply(this.skeleton);
          }
          this.skeleton.updateWorldTransform();
          var A = {
            x: this.currentViewport.x - this.currentViewport.padLeft,
            y: this.currentViewport.y - this.currentViewport.padBottom,
            width: this.currentViewport.width + this.currentViewport.padLeft + this.currentViewport.padRight,
            height: this.currentViewport.height + this.currentViewport.padBottom + this.currentViewport.padTop
          }, g = (performance.now() - this.viewportTransitionStart) / 1e3 / this.config.viewport.transitionTime;
          if (this.previousViewport && g < 1) {
            var m = {
              x: this.previousViewport.x - this.previousViewport.padLeft,
              y: this.previousViewport.y - this.previousViewport.padBottom,
              width: this.previousViewport.width + this.previousViewport.padLeft + this.previousViewport.padRight,
              height: this.previousViewport.height + this.previousViewport.padBottom + this.previousViewport.padTop
            };
            A = {
              x: m.x + (A.x - m.x) * g,
              y: m.y + (A.y - m.y) * g,
              width: m.width + (A.width - m.width) * g,
              height: m.height + (A.height - m.height) * g
            };
          }
          var x = this.scale(A.width, A.height, this.canvas.width, this.canvas.height);
          if (this.sceneRenderer.camera.zoom = A.width / x.x, this.sceneRenderer.camera.position.x = A.x + A.width / 2, this.sceneRenderer.camera.position.y = A.y + A.height / 2, this.sceneRenderer.begin(), this.config.backgroundImage && this.config.backgroundImage.url) {
            var P = this.assetManager.get(this.config.backgroundImage.url);
            this.config.backgroundImage.hasOwnProperty("x") && this.config.backgroundImage.hasOwnProperty("y") && this.config.backgroundImage.hasOwnProperty("width") && this.config.backgroundImage.hasOwnProperty("height") ? this.sceneRenderer.drawTexture(P, this.config.backgroundImage.x, this.config.backgroundImage.y, this.config.backgroundImage.width, this.config.backgroundImage.height) : this.sceneRenderer.drawTexture(P, A.x, A.y, A.width, A.height);
          }
          this.sceneRenderer.drawSkeleton(this.skeleton, this.config.premultipliedAlpha), this.sceneRenderer.skeletonDebugRenderer.drawBones = this.config.debug.bones, this.sceneRenderer.skeletonDebugRenderer.drawBoundingBoxes = this.config.debug.bounds, this.sceneRenderer.skeletonDebugRenderer.drawClipping = this.config.debug.clipping, this.sceneRenderer.skeletonDebugRenderer.drawMeshHull = this.config.debug.hulls, this.sceneRenderer.skeletonDebugRenderer.drawPaths = this.config.debug.paths, this.sceneRenderer.skeletonDebugRenderer.drawRegionAttachments = this.config.debug.regions, this.sceneRenderer.skeletonDebugRenderer.drawMeshTriangles = this.config.debug.meshes, this.sceneRenderer.drawSkeletonDebug(this.skeleton, this.config.premultipliedAlpha);
          var k = this.config.controlBones, O = this.selectedBones, R = this.skeleton;
          u.lineWidth(2);
          for (var D = 0; D < k.length; D++) {
            var N = R.findBone(k[D]);
            if (N) {
              var I = O[D] !== null ? c.HOVER_COLOR_INNER : c.NON_HOVER_COLOR_INNER, y = O[D] !== null ? c.HOVER_COLOR_OUTER : c.NON_HOVER_COLOR_OUTER;
              this.sceneRenderer.circle(!0, R.x + N.worldX, R.y + N.worldY, 20, I), this.sceneRenderer.circle(!1, R.x + N.worldX, R.y + N.worldY, 20, y);
            }
          }
          u.lineWidth(1), this.config.viewport.debugRender && (this.sceneRenderer.rect(!1, this.currentViewport.x, this.currentViewport.y, this.currentViewport.width, this.currentViewport.height, o.Color.GREEN), this.sceneRenderer.rect(!1, A.x, A.y, A.width, A.height, o.Color.RED)), this.sceneRenderer.end(), this.sceneRenderer.camera.zoom = 0;
        }
      }
    }, c.prototype.scale = function(s, h, d, u) {
      var M = u / d, C = h / s, S = M > C ? d / s : u / h, L = new o.Vector2();
      return L.x = s * S, L.y = h * S, L;
    }, c.prototype.loadSkeleton = function() {
      var s = this;
      if (!this.loaded) {
        if (this.assetManager.hasErrors()) {
          this.showError("Error: assets could not be loaded.<br><br>" + v(JSON.stringify(this.assetManager.getErrors())));
          return;
        }
        var h = this.assetManager.get(this.config.atlasUrl), d;
        if (this.config.jsonUrl) {
          var u = this.assetManager.get(this.config.jsonUrl), M = new o.SkeletonJson(new o.AtlasAttachmentLoader(h));
          try {
            d = M.readSkeletonData(u);
          } catch (E) {
            this.showError("Error: could not load skeleton .json.<br><br>" + E.toString());
            return;
          }
        } else {
          var C = this.assetManager.get(this.config.skelUrl), S = new o.SkeletonBinary(new o.AtlasAttachmentLoader(h));
          try {
            d = S.readSkeletonData(C);
          } catch (E) {
            this.showError("Error: could not load skeleton .skel.<br><br>" + E.toString());
            return;
          }
        }
        this.skeleton = new o.Skeleton(d);
        var L = new o.AnimationStateData(d);
        if (L.defaultMix = this.config.defaultMix, this.animationState = new o.AnimationState(L), this.config.controlBones && this.config.controlBones.forEach(function(E) {
          d.findBone(E) || s.showError("Error: control bone '" + E + "' does not exist in skeleton.");
        }), this.config.skin || d.skins.length > 0 && (this.config.skin = d.skins[0].name), this.config.skins && this.config.skin.length > 0 && this.config.skins.forEach(function(E) {
          if (!s.skeleton.data.findSkin(E)) {
            s.showError("Error: skin '" + E + "' in selectable skin list does not exist in skeleton.");
            return;
          }
        }), this.config.skin) {
          if (!this.skeleton.data.findSkin(this.config.skin)) {
            this.showError("Error: skin '" + this.config.skin + "' does not exist in skeleton.");
            return;
          }
          this.skeleton.setSkinByName(this.config.skin), this.skeleton.setSlotsToSetupPose();
        }
        if (this.config.viewport || (this.config.viewport = {
          animations: {},
          debugRender: !1,
          transitionTime: 0.2
        }), typeof this.config.viewport.debugRender > "u" && (this.config.viewport.debugRender = !1), typeof this.config.viewport.transitionTime > "u" && (this.config.viewport.transitionTime = 0.2), this.config.viewport.animations ? Object.getOwnPropertyNames(this.config.viewport.animations).forEach(function(E) {
          if (!d.findAnimation(E)) {
            s.showError("Error: animation '" + E + "' for which a viewport was specified does not exist in skeleton.");
            return;
          }
        }) : this.config.viewport.animations = {}, this.config.animations && this.config.animations.length > 0 && (this.config.animations.forEach(function(E) {
          if (!s.skeleton.data.findAnimation(E)) {
            s.showError("Error: animation '" + E + "' in selectable animation list does not exist in skeleton.");
            return;
          }
        }), this.config.animation || (this.config.animation = this.config.animations[0])), this.config.animation || d.animations.length > 0 && (this.config.animation = d.animations[0].name), this.config.animation) {
          if (!d.findAnimation(this.config.animation)) {
            this.showError("Error: animation '" + this.config.animation + "' does not exist in skeleton.");
            return;
          }
          this.play(), this.timelineSlider.change = function(E) {
            s.pause();
            var A = s.animationState.getCurrent(0).animation.duration, g = A * E;
            s.animationState.update(g - s.playTime), s.animationState.apply(s.skeleton), s.skeleton.updateWorldTransform(), s.playTime = g;
          };
        }
        this.setupInput(), (d.skins.length == 1 || this.config.skins && this.config.skins.length == 1) && this.skinButton.classList.add("spine-player-hidden"), (d.animations.length == 1 || this.config.animations && this.config.animations.length == 1) && this.animationButton.classList.add("spine-player-hidden"), this.config.success(this), this.loaded = !0;
      }
    }, c.prototype.setupInput = function() {
      var s = this, h = this.config.controlBones, d = this.selectedBones = new Array(this.config.controlBones.length), u = this.canvas, M = new o.webgl.Input(u), C = null, S = new o.webgl.Vector3(), L = new o.webgl.Vector3(), E = new o.Vector2(), A = this.skeleton, g = this.sceneRenderer;
      M.addListener({
        down: function(O, R) {
          for (var D = 0; D < h.length; D++) {
            var N = A.findBone(h[D]);
            N && (g.camera.screenToWorld(S.set(O, R, 0), u.width, u.height), L.set(A.x + N.worldX, A.y + N.worldY, 0).distance(S) < 30 && (C = N));
          }
        },
        up: function(O, R) {
          if (C)
            C = null;
          else {
            if (!s.config.showControls)
              return;
            s.paused ? s.play() : s.pause();
          }
        },
        dragged: function(O, R) {
          C != null && (g.camera.screenToWorld(S.set(O, R, 0), u.width, u.height), C.parent !== null ? (C.parent.worldToLocal(E.set(S.x - A.x, S.y - A.y)), C.x = E.x, C.y = E.y) : (C.x = S.x - A.x, C.y = S.y - A.y));
        },
        moved: function(O, R) {
          for (var D = 0; D < h.length; D++) {
            var N = A.findBone(h[D]);
            N && (g.camera.screenToWorld(S.set(O, R, 0), u.width, u.height), L.set(A.x + N.worldX, A.y + N.worldY, 0).distance(S) < 30 ? d[D] = N : d[D] = null);
          }
        }
      });
      var m = !0, x = !1;
      document.addEventListener("mousemove", function(O) {
        O instanceof MouseEvent && P(O.clientX, O.clientY);
      }), document.addEventListener("touchmove", function(O) {
        if (O instanceof TouchEvent) {
          var R = O.changedTouches;
          if (R.length > 0) {
            var D = R[0];
            P(D.clientX, D.clientY);
          }
        }
      });
      var P = function(O, R) {
        if (s.config.showControls) {
          var D = n(s.dom, "spine-player-popup");
          m = k(O, R, s.playerControls.getBoundingClientRect()), x = k(O, R, s.canvas.getBoundingClientRect()), clearTimeout(s.cancelId);
          var N = D.length == 0 && !m && !x && !s.paused;
          if (N ? s.playerControls.classList.add("spine-player-controls-hidden") : s.playerControls.classList.remove("spine-player-controls-hidden"), !m && D.length == 0 && !s.paused) {
            var I = function() {
              s.paused || s.playerControls.classList.add("spine-player-controls-hidden");
            };
            s.cancelId = setTimeout(I, 1e3);
          }
        }
      }, k = function(O, R, D) {
        var N = O - D.left, I = R - D.top;
        return N >= 0 && N <= D.width && I >= 0 && I <= D.height;
      };
    }, c.prototype.play = function() {
      var s = this;
      this.paused = !1;
      var h = function() {
        s.paused || s.playerControls.classList.add("spine-player-controls-hidden");
      };
      this.cancelId = setTimeout(h, 1e3), this.playButton.classList.remove("spine-player-button-icon-play"), this.playButton.classList.add("spine-player-button-icon-pause"), this.config.animation && (this.animationState.getCurrent(0) || this.setAnimation(this.config.animation));
    }, c.prototype.pause = function() {
      this.paused = !0, this.playerControls.classList.remove("spine-player-controls-hidden"), clearTimeout(this.cancelId), this.playButton.classList.remove("spine-player-button-icon-pause"), this.playButton.classList.add("spine-player-button-icon-play");
    }, c.prototype.setAnimation = function(s, h) {
      h === void 0 && (h = !0), this.previousViewport = this.currentViewport;
      var d = this.calculateAnimationViewport(s), u = {
        x: d.x,
        y: d.y,
        width: d.width,
        height: d.height,
        padLeft: "10%",
        padRight: "10%",
        padTop: "10%",
        padBottom: "10%"
      }, M = this.config.viewport;
      typeof M.x < "u" && typeof M.y < "u" && typeof M.width < "u" && typeof M.height < "u" && (u.x = M.x, u.y = M.y, u.width = M.width, u.height = M.height), typeof M.padLeft < "u" && (u.padLeft = M.padLeft), typeof M.padRight < "u" && (u.padRight = M.padRight), typeof M.padTop < "u" && (u.padTop = M.padTop), typeof M.padBottom < "u" && (u.padBottom = M.padBottom);
      var C = this.config.viewport.animations[s];
      C && (typeof C.x < "u" && typeof C.y < "u" && typeof C.width < "u" && typeof C.height < "u" && (u.x = C.x, u.y = C.y, u.width = C.width, u.height = C.height), typeof C.padLeft < "u" && (u.padLeft = C.padLeft), typeof C.padRight < "u" && (u.padRight = C.padRight), typeof C.padTop < "u" && (u.padTop = C.padTop), typeof C.padBottom < "u" && (u.padBottom = C.padBottom)), u.padLeft = this.percentageToWorldUnit(u.width, u.padLeft), u.padRight = this.percentageToWorldUnit(u.width, u.padRight), u.padBottom = this.percentageToWorldUnit(u.height, u.padBottom), u.padTop = this.percentageToWorldUnit(u.height, u.padTop), this.currentViewport = u, this.viewportTransitionStart = performance.now(), this.animationState.clearTracks(), this.skeleton.setToSetupPose(), this.animationState.setAnimation(0, s, h);
    }, c.prototype.percentageToWorldUnit = function(s, h) {
      return typeof h == "string" ? s * parseFloat(h.substr(0, h.length - 1)) / 100 : h;
    }, c.prototype.calculateAnimationViewport = function(s) {
      var h = this.skeleton.data.findAnimation(s);
      this.animationState.clearTracks(), this.skeleton.setToSetupPose(), this.animationState.setAnimationWith(0, h, !0);
      for (var d = 100, u = h.duration > 0 ? h.duration / d : 0, M = 1e8, C = -1e8, S = 1e8, L = -1e8, E = new o.Vector2(), A = new o.Vector2(), g = 0; g < d; g++)
        this.animationState.update(u), this.animationState.apply(this.skeleton), this.skeleton.updateWorldTransform(), this.skeleton.getBounds(E, A), !isNaN(E.x) && !isNaN(E.y) && !isNaN(A.x) && !isNaN(A.y) ? (M = Math.min(E.x, M), C = Math.max(E.x + A.x, C), S = Math.min(E.y, S), L = Math.max(E.y + A.y, L)) : console.log("Bounds of animation " + s + " are NaN");
      return E.x = M, E.y = S, A.x = C - M, A.y = L - S, {
        x: E.x,
        y: E.y,
        width: A.x,
        height: A.y
      };
    }, c.prototype.stopRendering = function() {
      this.stopRequestAnimationFrame = !0;
    }, c.HOVER_COLOR_INNER = new o.Color(0.478, 0, 0, 0.25), c.HOVER_COLOR_OUTER = new o.Color(1, 1, 1, 1), c.NON_HOVER_COLOR_INNER = new o.Color(0.478, 0, 0, 0.5), c.NON_HOVER_COLOR_OUTER = new o.Color(1, 0, 0, 0.8), c;
  })();
  o.SpinePlayer = t;
  function i(c, s) {
    if (c === s)
      return !0;
    var h = function(d, u) {
      for (var M = 0; M < d.children.length; M++) {
        var C = d.children[M];
        if (C === u || h(C, u))
          return !0;
      }
      return !1;
    };
    return h(c, s);
  }
  function r(c, s) {
    var h = new Array(), d = function(u, M, C) {
      for (var S = 0; S < u.children.length; S++) {
        var L = u.children[S];
        L.id === M && C.push(L), d(L, M, C);
      }
    };
    return d(c, s, h), h;
  }
  function n(c, s) {
    var h = new Array(), d = function(u, M, C) {
      for (var S = 0; S < u.children.length; S++) {
        var L = u.children[S];
        L.classList.contains(M) && C.push(L), d(L, M, C);
      }
    };
    return d(c, s, h), h;
  }
  function f(c) {
    var s = document.createElement("div");
    return s.innerHTML = c, s.children[0];
  }
  function l(c, s) {
    for (var h = 0; h < c.length; h++)
      c[h].classList.remove(s);
  }
  function v(c) {
    return c ? c.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&#34;").replace(/'/g, "&#39;") : "";
  }
})(F || (F = {}));
var F;
(function(o) {
  var e = (function() {
    function p(a) {
      this.prefix = `<html>
<head>
<style>
body {
	margin: 0px;
}
</style>
</head>
<body>`.trim(), this.postfix = "</body>", this.timerId = 0, this.render(a);
    }
    return p.prototype.render = function(a) {
      var t = this, i = `
				<div class="spine-player-editor-container">
					<div class="spine-player-editor-code"></div>
					<iframe class="spine-player-editor-player"></iframe>
				</div>
			`;
      a.innerHTML = i;
      var r = a.getElementsByClassName("spine-player-editor-code")[0];
      this.player = a.getElementsByClassName("spine-player-editor-player")[0], requestAnimationFrame(function() {
        t.code = CodeMirror(r, {
          lineNumbers: !0,
          tabSize: 3,
          indentUnit: 3,
          indentWithTabs: !0,
          scrollBarStyle: "native",
          mode: "htmlmixed",
          theme: "monokai"
        }), t.code.on("change", function() {
          t.startPlayer();
        }), t.setCode(p.DEFAULT_CODE);
      });
    }, p.prototype.setPreAndPostfix = function(a, t) {
      this.prefix = a, this.postfix = t, this.startPlayer();
    }, p.prototype.setCode = function(a) {
      this.code.setValue(a), this.startPlayer();
    }, p.prototype.startPlayer = function() {
      var a = this;
      clearTimeout(this.timerId), this.timerId = setTimeout(function() {
        var t = a.code.getDoc().getValue();
        t = a.prefix + t + a.postfix, t = window.btoa(t), a.player.src = "", a.player.src = "data:text/html;base64," + t;
      }, 500);
    }, p.DEFAULT_CODE = `
<script src="https://esotericsoftware.com/files/spine-player/3.7/spine-player.js"><\/script>
<link rel="stylesheet" href="https://esotericsoftware.com/files/spine-player/3.7/spine-player.css">

<div id="player-container" style="width: 100%; height: 100vh;"></div>

<script>
new spine.SpinePlayer("player-container", {
	jsonUrl: "https://esotericsoftware.com/files/examples/spineboy/export/spineboy-pro.json",
	atlasUrl: "https://esotericsoftware.com/files/examples/spineboy/export/spineboy-pma.atlas"
});
<\/script>
		`.trim(), p;
  })();
  o.SpinePlayerEditor = e;
})(F || (F = {}));
const Ft = F, zt = "__whichWayUnpackPremultiply";
function Xe() {
  const o = Ft?.webgl?.GLTexture;
  if (!o || !o.prototype || o.prototype.update.__whichWayUnpackPatched) return;
  const e = o.prototype.update;
  o.prototype.update = function(p) {
    const a = this.context && this.context.gl;
    let t = !1;
    const i = this._image;
    a && a.UNPACK_PREMULTIPLY_ALPHA_WEBGL != null && i && i[zt] && (a.pixelStorei(a.UNPACK_PREMULTIPLY_ALPHA_WEBGL, !0), t = !0);
    try {
      return e.call(this, p);
    } finally {
      t && a && a.UNPACK_PREMULTIPLY_ALPHA_WEBGL != null && a.pixelStorei(a.UNPACK_PREMULTIPLY_ALPHA_WEBGL, !1);
    }
  }, o.prototype.update.__whichWayUnpackPatched = !0;
}
Xe();
function ae(o) {
  if (!o || !o.assetManager) return;
  const e = !!o.config?.unpackPremultipliedAlpha, p = o.assetManager, a = p.textureLoader;
  typeof a == "function" && (a.__whichWayUnpackWrapped || (p.textureLoader = function(t) {
    try {
      t && (e ? t[zt] = !0 : delete t[zt]);
    } catch {
    }
    return a(t);
  }, p.textureLoader.__whichWayUnpackWrapped = !0));
}
function se(o, e) {
  if (!o) return e?.parentElement ?? null;
  const p = o.node?.avatar ?? o.querySelector?.(".avatar");
  return p || (o.nodeType === 1 ? o : e?.parentElement ?? null);
}
const Mt = window.whichWaySave.dycSave;
class _e {
  backgroundPath = `${$.assetURL}extension/WhichWay/dynamicSkin/background/`;
  spineCache = /* @__PURE__ */ new Map();
  eventListenersMap = /* @__PURE__ */ new WeakMap();
  get banSkin() {
    return $.config.banSkinSJZX === void 0 && ($.config.banSkinSJZX = {}), $.config.banSkinSJZX;
  }
  /**
   * 切换动皮开启与关闭
   * @param {String | Player} name 玩家名
   * @param {String} skinName 皮肤名
   */
  toggleDycSkin(e, p) {
    if (pt.itemtype(e) === "player" && (e = e.name), typeof e != "string") throw new Error("参数name必须是 String 或 Player！");
    if (typeof p != "string") throw new Error("参数skinName必须是 String！");
    return b.banSkin?.[e]?.[p] ? b.banSkin[e][p] = !1 : (b.banSkin[e] || (b.banSkin[e] = {}), b.banSkin[e][p] = !0), yt.saveConfig("banSkinSJZX", b.banSkin), b.banSkin;
  }
  /**
   * 判断指定角色和皮肤的动态皮肤是否启用
   * @param {String | Player} name 玩家名
   * @param {String} skinName 皮肤名
   * @returns {boolean}
   */
  isEnabledSkin(e, p) {
    return pt.itemtype(e) === "player" && (e = e.name), !this.banSkin?.[e]?.[p];
  }
  /**
   * 获取指定角色和皮肤的动态皮肤数据
   * @param {string} charName - 角色名称
   * @param {string} skinName - 皮肤名称
   * @param {boolean} [noGetAll=false] - 当charName或skinName未定义时，是否返回所有资产数据
   * @returns {Object|undefined} 找到的皮肤数据对象，未找到时返回undefined
   */
  getSkinData(e, p, a) {
    let t = Mt.assets;
    if (e === void 0 || p === void 0) return a ? t : void 0;
    for (let i in t)
      if (e === i) {
        for (let r in t[i])
          if (r === p)
            return t[i][r];
      }
    tt.isDeveloperMode() && console.warn(`[WhichWaySpineWork]未找到角色 ${e} 的皮肤 ${p} !`);
  }
  getUrl(e, p, a, t) {
    const i = {
      j: "json",
      a: "atlas",
      s: "skel"
    };
    return t.length === 1 && i[t] && (t = i[t]), `${$.assetURL}extension/WhichWay/dynamicSkin/illust/${e}/${p}/${a}.${t}`;
  }
  dispose(e) {
    if (e.disposed) return;
    e.disposed = !0;
    let p = this.spineCache, a = p.get(e.config.dynamicName);
    if (Object.keys(a).length === 1) p.delete(e.config.dynamicName);
    else
      for (let i in a)
        a[i].from === e.container && delete a[i];
    window.removeEventListener("resize", e.drawFrame);
    const t = e.parent;
    if (e.stopRendering(), e.cancelId && clearTimeout(e.cancelId), e.animationState) {
      e.animationState.clearTracks(), e.animationState.clearListeners();
      let i = e.animationState.getCurrent(0);
      i && (e.animationState.disposeNext(i), e.animationState.setEmptyAnimation(0, 0)), e.animationState = null;
    }
    e.skeleton && (e.skeleton = null), e.skeletonData && (e.skeletonData = null), e.sceneRenderer && (e.sceneRenderer.dispose(), e.sceneRenderer = null), e.assetManager && e.assetManager.dispose(), e.context && e.context.gl && (e.context.gl.getExtension("WEBGL_lose_context")?.loseContext(), e.context = null), t?.__whichWayResizeObserver?.disconnect?.(), t && t.remove();
  }
  loadDyc(e, p, a, t) {
    let i = Mt.assets, r = `${e}_${p}`;
    if (this.banSkin?.[e]?.[p] === !0) return;
    Mt.startFit = {
      dycLoaded: !1,
      decadeUIFit: !1,
      parent: a,
      container: void 0
    };
    let n = new Proxy(Mt.startFit, {
      set(l, v, c, s) {
        return l[v] = c, l.dycLoaded && l.decadeUIFit && (tt.isDeveloperMode() && console.log("【驶舰之向】:已调整动态皮肤：", l.container), f(l.container, se(l.parent, l.container)), delete Mt.startFit), !0;
      }
    });
    if (i[e] && i[e][p]) {
      let l = i[e][p], v, c, s = this.backgroundPath + l.background.split("/").pop();
      const h = Lt.create.div(".sjzxDycWrapper", a);
      h.id = "sjzxDycWrapper-animation", h.hide(), Mt.startFit.container = h;
      const d = Lt.create.div(".bg", h);
      d.style.backgroundImage = `url("${s}")`, l.name && (l.json ? v = this.getUrl(e, p, l.name.split("/").pop(), "j") : v = this.getUrl(e, p, l.name.split("/").pop(), "s"), c = this.getUrl(e, p, l.name.split("/").pop(), "a")), t || (t = {
        dynamicName: r,
        skelUrl: v,
        //@ts-ignore
        jsonUrl: v.endsWith(".json") ? v : void 0,
        atlasUrl: c,
        showControls: !1,
        animations: Array.isArray(l.action) ? l.action : [l.action],
        weighting: Array.isArray(l.weighting) ? l.weighting : [l.weighting],
        alpha: !0,
        backgroundColor: "#00000000",
        debug: {
          bones: !1,
          regions: !1,
          meshes: !1,
          boundingBoxes: !1,
          paths: !1,
          skins: !1,
          attachments: !1,
          hulls: !1
        },
        showLoading: !1,
        premultipliedAlpha: l.alpha || !1,
        unpackPremultipliedAlpha: !!l.unpackPremultipliedAlpha,
        preserveDrawingBuffer: !0,
        viewport: {
          x: 0,
          y: 0,
          width: a.clientWidth,
          height: a.clientHeight,
          padLeft: 0,
          padRight: 0,
          padTop: 0,
          padBottom: 0
        },
        originalOptions: l,
        container: a,
        error: function(E) {
          console.error(E);
        },
        success: function(E) {
          b.setSkeletonPosition(E, E.config.originalOptions), b.playRandomAnimation(E.skeleton, E.animationState, E.config.weighting), n.dycLoaded = !0, h.show();
        }
      });
      const u = new Ft.SpinePlayer(h, t);
      ae(u), h.__whichWaySpinePlayer = u;
      let M = b.spineCache;
      M.get(r) || M.set(r, {});
      let C = M.get(r);
      if (pt.itemtype(a) === "player")
        C[a.playerid] || (C[a.playerid] = {}), C[a.playerid].default = u, C[a.playerid].from = a, a.dycSJZX = u;
      else {
        let E = a.className;
        C[E] || (C[E] = {}), C[E].default = u, C[E].from = a;
      }
      const S = `removeAdded_${r}`;
      a.dataset[S] !== "true" && (a.dataset[S] = "true", a.onRemoved(() => {
        let E = pt.itemtype(a) === "player", A = C[E ? a.playerid : a.className];
        for (let g in A)
          pt.is.object(A[g]) && b.dispose(A[g]);
        delete C[E ? a.playerid : a.className];
      })), pt.itemtype(a) === "player" && (a.node.avatar.appendChild(h), a.node.avatar.style.overflow = "hidden", setTimeout(() => {
        n.decadeUIFit = !0;
      }, 1e3));
      const L = se(a, h);
      if (L && h.parentElement !== L && L.appendChild(h), h.__whichWayFitTarget = a, h.__whichWayFitHost = L, L && (f(h, L), [600, 1500].forEach((E) => {
        setTimeout(() => {
          const A = h.__whichWayFitHost;
          h.isConnected && A?.isConnected && f(h, A);
        }, E);
      }), typeof ResizeObserver < "u")) {
        const E = new ResizeObserver(() => {
          const A = h.__whichWayFitHost;
          A?.isConnected && f(h, A);
        });
        E.observe(L), h.__whichWayResizeObserver = E;
      }
      return u;
    } else console.error(`no skin data ${e} ${p}`);
    function f(l, v) {
      if (!l?.isConnected || !v?.isConnected) return;
      const c = v.clientWidth, s = v.clientHeight;
      if (!c || !s) return;
      const h = `${c}x${s}`;
      if (l.dataset.dycFitSize !== h) {
        l.dataset.dycFitSize = h, getComputedStyle(v).position === "static" && (v.style.position = "relative");
        const M = l.style.transition;
        l.style.transition = "none", l.style.width = `${c}px`, l.style.height = `${s}px`, l.style.zoom = "", l.style.left = "0", l.style.top = "0", l.offsetWidth, l.style.transition = M;
        const C = l.__whichWaySpinePlayer, S = C?.canvas;
        S?.style && (S.style.width = "100%", S.style.height = "100%"), C && b.enableSupersampling(C), C?.skeleton && b.setSkeletonPosition(C, C.config.originalOptions);
      }
      const d = l.getBoundingClientRect(), u = Math.abs(d.width - c) < 1 && Math.abs(d.height - s) < 1;
      if (tt.isDeveloperMode()) {
        const M = l.__whichWaySpinePlayer?.canvas;
        console.log(
          `[whichWayDyc] fit host=${v.className || v.tagName} ${c}x${s} -> container ${Math.round(d.width)}x${Math.round(d.height)}` + (M ? `, buffer ${M.width}x${M.height}` : "") + (u ? "" : " (retry)")
        );
      }
      if (u)
        l.__whichWayFitTries = 0;
      else {
        const M = (l.__whichWayFitTries || 0) + 1;
        l.__whichWayFitTries = M, M <= 3 && requestAnimationFrame(() => {
          const C = l.__whichWayFitHost;
          l.isConnected && C?.isConnected && f(l, C);
        });
      }
    }
  }
  /**
   * 播放完当前动画后，随机播放另一个动画
   * @param {*} skeleton - Spine 骨骼实例
   * @param {*} animationState - AnimationState 实例
   * @param {number[]} weighting - 权重
   * @param {boolean} [loop=false] - 是否循环播放
   */
  playRandomAnimation(e, p, a, t = !1) {
    p.addListener({
      complete: () => {
        i(e, p, a, t);
      }
    }), i(e, p, a, t);
    function i(r, n, f, l = !1) {
      const v = r.data.animations.map((d) => d.name);
      (!f || f.length !== v.length) && (f = v.map(() => 1));
      let c = tt.scaleToIntegerRatio(f), s = [];
      for (let d = 0; d < v.length; d++) {
        let u = c[d], M = v[d];
        s.push(...new Array(u).fill(M));
      }
      const h = s.randomGet();
      v.length === 1 ? n.setAnimation(0, h, !0) : n.setAnimation(0, h, l);
    }
  }
  /**
   * 取动皮容器的目标尺寸（= 父元素的真实尺寸，也是动皮配置里 x/y/scale 的基准空间）。
   *
   * 优先用 `fit()` 记录下来的尺寸 —— 容器的 `clientWidth` 在画布超采样等场景下不一定可信；
   * 还没有记录时（容器刚创建、尚未 fit）退回 `clientWidth` / 设计基准 120x180。
   *
   * @param {HTMLElement} container 动皮容器
   * @returns {[number, number]} 宽高
   */
  getDycFitSize(e) {
    const [p, a] = (e?.dataset?.dycFitSize || "").split("x").map(Number);
    return p > 0 && a > 0 ? [p, a] : [e?.clientWidth || 120, e?.clientHeight || 180];
  }
  /**
   * 给动皮开启超采样（画布缓冲放大），像素更多、观感不变。
   *
   * 两个关键点（都由 lib/spine-player.js 的行为决定）：
   * 1. `SceneRenderer.resize()` 每次都会 `canvas.width = canvas.clientWidth` 重置缓冲，
   *    而渲染循环**每帧**都会调用 `resize(ResizeMode.Expand)` ⇒ 缓冲必须在 resize 里放大，
   *    在外面写一次会被下一帧覆盖；
   * 2. `SpinePlayer.draw()` 用 `zoom = 视口宽 / scale(视口, 缓冲)` 设相机，缓冲放大 k 倍
   *    会让 zoom 变成 1/k（画面被放大裁切）⇒ 在 `begin()`（相机 update 之前）把 zoom 乘回 k，
   *    画面几何就与不放大时**完全一致**，区别只有缓冲像素更多 ⇒ 更清晰。
   *
   * @param {any} player SpinePlayer
   */
  enableSupersampling(e) {
    const p = e?.sceneRenderer;
    if (!p) return;
    if (p.__whichWaySupersampled) {
      p.resize(Ft.webgl?.ResizeMode?.Expand ?? 1);
      return;
    }
    p.__whichWaySupersampled = !0;
    const a = p.resize, t = p.begin;
    p.resize = function(i) {
      a.call(this, i);
      const r = this.canvas, n = r.clientWidth, f = r.clientHeight;
      if (!n || !f) return;
      const l = Math.min(4, Math.max(window.devicePixelRatio || 1, 360 / Math.min(n, f)));
      e.__whichWayDensity = l;
      const v = Math.round(n * l), c = Math.round(f * l);
      (r.width !== v || r.height !== c) && (r.width = v, r.height = c), this.context.gl.viewport(0, 0, r.width, r.height);
    }, p.begin = function() {
      const i = this.camera;
      i && (i.zoom *= e.__whichWayDensity || 1), t.call(this);
    }, p.resize(Ft.webgl?.ResizeMode?.Expand ?? 1);
  }
  setSkeletonPosition(e, p, a) {
    const t = e.dom.parentNode, [i, r] = b.getDycFitSize(t);
    let n = [i / 120, r / 180];
    a && (n = [1, 1]), e.skeleton.scaleX = p.scale * n[0], e.skeleton.scaleY = p.scale * n[1], e.skeleton.x = i * p.x[1] + p.x[0], e.skeleton.y = r * p.y[1] + p.y[0];
  }
  playAction(e, p, a = 3e3) {
    let t = e.parent.parentNode, i = e.config.dynamicName, r = t.playerid, n = b.spineCache;
    n.get(i)?.[r]?.[p]?.timer && clearTimeout(n.get(i)[r][p].timer), ["chuchang", "gongji", "teshu", "default"].includes(p) || console.warn(`${p}不是合法的动作！`);
    let l = e.config.originalOptions[p];
    if (!l) {
      console.warn(`${p}没有对应的动作配置！`), et.showToast(`${p}没有对应的动作配置！`);
      return;
    }
    e.dom.style.display = "none";
    let v = e.config, c = e.dom.parentNode;
    c.style.zIndex = 100, n.get(i) || n.set(i, {});
    const s = n.get(i);
    if (s[r] || (s[r] = {}), s[r][p])
      s[r][p].parent.style.display = "";
    else {
      let h = Lt.create.div(".sjzxDycOutWrapper", c);
      h.classList.add(`${p}`);
      const d = h.getBoundingClientRect();
      h.style.display = "none";
      const u = new Ft.SpinePlayer(h, {
        skelUrl: v.skelUrl,
        jsonUrl: v.jsonUrl,
        atlasUrl: v.atlasUrl,
        showControls: !1,
        animations: Array.isArray(l.action) ? l.action : [l.action],
        alpha: !0,
        backgroundColor: "#00000000",
        debug: {
          bones: !1,
          regions: !1,
          meshes: !1,
          boundingBoxes: !1,
          paths: !1,
          skins: !1,
          attachments: !1,
          hulls: !1
        },
        showLoading: !1,
        premultipliedAlpha: l.alpha || !1,
        unpackPremultipliedAlpha: !!(v.originalOptions && v.originalOptions.unpackPremultipliedAlpha),
        preserveDrawingBuffer: !0,
        viewport: {
          x: 0,
          y: 0,
          width: d.width,
          height: d.height,
          padLeft: 0,
          padRight: 0,
          padTop: 0,
          padBottom: 0
        },
        originalOptions: l,
        error: function(M) {
          console.error("spine animation load error", M);
        },
        success: function(M) {
          const C = (g) => parseFloat(g.match(/-?\d*\.?\d+/)?.[0] || "0");
          let S = M.parent.parentNode.parentNode, L = M.config.originalOptions, E = getComputedStyle(document.body), A = getComputedStyle(S);
          M.skeleton.x = C(E.width) - C(A.right) - C(A.width) / 2, M.skeleton.y = C(A.bottom), M.skeleton.scaleX = L.scale, M.skeleton.scaleY = L.scale, M.speed = l.speed || 1, M.dom.parentNode.style.display = "";
        }
      });
      ae(u), b.enableSupersampling(u), s[r][p] = u;
    }
    a && (s[r][p].timer = setTimeout(() => {
      let h = s[r][p].parent;
      e.dom.style.display = "", h.style.display = "none", c.style.zIndex = "";
    }, a));
  }
  async updateDyc(e, p, a = "default") {
    if (!b.needEnable()) return;
    let t = window.whichWaySave.skinConfig[e] || "经典形象.1145141919810", i = it.removeExt(t), r = `${e}_${i}`, n = b.spineCache;
    if (n.forEach((f) => {
      for (let l in f) {
        let v = f[l];
        if (v.from === p)
          for (let c in v) {
            let s = v[c];
            s instanceof HTMLElement || (s.parent.style.display = "none");
          }
      }
    }), this.banSkin?.[e]?.[i] !== !0) {
      if (n.has(r)) {
        if (pt.itemtype(p) === "player" && n.get(r)?.[p.playerid]?.[a]) {
          n.get(r)[p.playerid][a].parent.style.display = "";
          return;
        } else if (n.get(r)?.[p.className]?.[a]) {
          n.get(r)[p.className][a].parent.style.display = "";
          return;
        }
      }
      b.getSkinData(e, i) && b.loadDyc(e, i, p);
    }
  }
  draggingDyc(e) {
    if (!b.needEnable()) return;
    if (!tt.config("enableWhichWayDynamicSkin")) {
      et.showToast("请先开启动态皮肤功能");
      return;
    }
    if (typeof e != "object") {
      et.showToast("不是合法的Spine对象");
      return;
    }
    et.showToast("已开启动皮拖拽");
    const p = document.createElement("button");
    p.id = "copySketeonPostionBtnSJZX", p.textContent = "复制信息", document.body.appendChild(p), p.addEventListener("click", () => {
      let A = [];
      const g = Mt?.skeletonPostion;
      g?.x && A.push(`x:[${g.x[0] ?? 0},${g.x[1].toFixed(2)}],`), g?.y && A.push(`y:[${g.y[0] ?? 0},${g.y[1].toFixed(2)}],`), g?.scale !== void 0 && A.push(`scale:${g.scale.toFixed(2)},`), A.length > 0 ? navigator.clipboard.writeText(A.join(`
`)).then(() => {
        et.showToast("复制成功", 1500, "bottomRight", "skeletonPositionCopySJZX");
      }).catch((m) => {
        console.error("复制失败: ", m);
      }) : et.showToast("没有可复制的信息!", 1500);
    });
    const a = document.createElement("button");
    a.id = "toggleDragBtnSJZX", a.textContent = "关闭拖拽", document.body.appendChild(a), a.addEventListener("click", () => {
      a.remove(), p.remove(), b.stopDraggingDyc(e);
    });
    const t = e.parent;
    t.style.pointerEvents = "all";
    const i = e.skeleton, r = e.dom;
    let n = !1, f = 0, l = 0;
    const v = 1e-3, c = 10, s = 0.01;
    let h = 0;
    const d = 200, u = (A, g) => [A, g], M = () => {
      const [A, g] = b.getDycFitSize(t), m = (P, k = 0) => Number.isFinite(P) ? P : k;
      Mt.skeletonPostion || (Mt.skeletonPostion = {});
      const x = Mt.skeletonPostion;
      return x.x = [0, A ? m(i.x / A) : 0], x.y = [0, g ? m(i.y / g) : 0], x.scale = m(A ? i.scaleX / (A / 120) : i.scaleX, 1), x;
    }, C = (A) => {
      n = !0, f = A.clientX, l = A.clientY;
    }, S = (A) => {
      if (!n) return;
      const [g, m] = u(A.clientX - f, A.clientY - l);
      i.x += g, i.y += m, f = A.clientX, l = A.clientY;
      const x = Date.now();
      if (x - h > d) {
        const P = M();
        et.showToast(
          `骨骼位置: x=[${P.x[0]},${P.x[1].toFixed(2)}], y=[${P.y[0]},${P.y[1].toFixed(2)}]`,
          !0,
          "topLeft",
          "dragging_xAndy"
        ), h = x;
      }
    }, L = () => {
      n = !1;
    }, E = (A) => {
      A.preventDefault();
      const g = A.deltaY;
      let m = i.scaleX;
      g < 0 ? m += s : m -= s, m = Math.max(v, Math.min(c, m)), i.scaleX = i.scaleY = m;
      const x = M();
      et.showToast(`当前骨骼缩放: scale=${x.scale.toFixed(2)}`, !0, "topLeft", "dragging_scale");
    };
    b.eventListenersMap.set(r, { onMouseDown: C, onMouseMove: S, onMouseUp: L, onWheel: E }), r.addEventListener("mousedown", C), document.addEventListener("mousemove", S), document.addEventListener("mouseup", L), r.addEventListener("wheel", E, { passive: !1 });
  }
  stopDraggingDyc(e) {
    let p = e.parent;
    p.style.pointerEvents = "none";
    const a = e.dom, t = b.eventListenersMap.get(a);
    if (t) {
      const { onMouseDown: r, onMouseMove: n, onMouseUp: f, onWheel: l } = t;
      a.removeEventListener("mousedown", r), document.removeEventListener("mousemove", n), document.removeEventListener("mouseup", f), a.removeEventListener("wheel", l);
    }
    b.eventListenersMap.delete(a);
    let i = et.toastRegistry;
    for (let r in i) {
      let n = i[r];
      if (typeof n != "function")
        for (let f of n) {
          let l = f.id;
          l.startsWith("dragging_") && et.removeToastById(l);
        }
    }
  }
  /**
   * 判断是否需要启用驶舰之向的动皮
   * @returns {Boolean}
   */
  needEnable() {
    switch (tt.config("WhichWayDynamicSkinSwitch") || "sjzx") {
      case "sjzx":
        return tt.config("enableWhichWayDynamicSkin") || tt.config("enableWhichWayDynamicSkin") === void 0;
      case "piqie": {
        let p = [];
        return $.extensionPack.皮肤切换 || p.push("皮肤切换"), $.extensionPack.千幻聆音 || p.push("千幻聆音"), $.extensionPack.十周年UI || p.push("十周年UI"), p.length === 0;
      }
    }
    return !1;
  }
}
const b = new _e();
fe({
  name: "whichWaySpineWorker_dev",
  fn() {
    window.spineWorker = b;
  }
});
window.whichWay.register("spineWorker", b);
const Ge = { class: "conf-override" }, Ze = { class: "config-container" }, je = { class: "title-container" }, ze = ["src"], He = { class: "confilct-card-container" }, Je = { class: "card-title" }, qe = { class: "card-content" }, be = ["onClick"], Qe = { class: "skin-container" }, Ke = ["src"], $e = { class: "intro-container" }, tr = { class: "skin-item" }, er = { class: "from-item" }, rr = /* @__PURE__ */ ce({
  __name: "confOverride",
  setup(o) {
    const e = it.compilePath("ui:skin.png"), p = dt.confictedSkins.data, a = Le({});
    function t() {
      Object.keys(p).forEach((s) => {
        p[s].length > 0 && (a[s] = dt.confictedSkins.selected[s] || p[s][0].skin);
      });
    }
    function i(s, h) {
      return a[s] === h;
    }
    function r(s, h) {
      a[s] = h, console.log(`已选择 ${s} 的皮肤: ${h}`);
    }
    function n() {
      dt.confictedSkins.selected = a;
      const s = document.querySelector(".conflictedSkinOverlay-whichWaySkin.whichWayOverlay");
      s && s.remove(), dt.pendingReslove.showConflictedSkin && (dt.pendingReslove.showConflictedSkin(!0), dt.pendingReslove.showConflictedSkin = null);
    }
    function f() {
      t();
    }
    t();
    const l = {
      noname: "无名杀",
      whichWay: "驶舰之向",
      qhly: "千幻聆音"
    };
    function v(s) {
      return l[s] ? l[s] : $.translate[s] ? $.translate[s] : s;
    }
    const c = {
      mounted(s) {
        const h = (d) => {
          d.preventDefault(), s.scrollLeft += d.deltaY;
        };
        s.addEventListener("wheel", h, { passive: !1 }), s._handleWheel = h;
      },
      unmounted(s) {
        const h = s._handleWheel;
        h && (s.removeEventListener("wheel", h), s._handleWheel = null);
      }
    };
    return (s, h) => (Et(), Rt("div", Ge, [
      ft("div", Ze, [
        ft("div", je, [
          ft("img", { src: Bt(e) }, null, 8, ze),
          h[0] || (h[0] = ft("div", { class: "title" }, "皮肤配置冲突", -1))
        ]),
        ft("div", He, [
          (Et(!0), Rt(te, null, ee(Bt(p), (d, u) => (Et(), Rt("div", {
            key: u,
            class: "confilct-card"
          }, [
            ft("div", Je, _t(v(u)), 1),
            we((Et(), Rt("div", qe, [
              (Et(!0), Rt(te, null, ee(d, (M, C) => (Et(), Rt("div", {
                key: `${u}-${C}`,
                class: De(["item-content", { selected: i(u, M.skin) }]),
                onClick: (S) => r(u, M.skin)
              }, [
                ft("div", Qe, [
                  ft("img", {
                    src: Bt(dt).getCharacterSkin(u, M.skin)?.path
                  }, null, 8, Ke)
                ]),
                ft("div", $e, [
                  ft("span", tr, _t(Bt(it).removeExt(M.skin)), 1),
                  ft("span", er, _t(v(M.from)), 1)
                ])
              ], 10, be))), 128))
            ])), [
              [c]
            ])
          ]))), 128))
        ])
      ]),
      ft("div", { class: "quick-container" }, [
        ft("button", {
          class: "apply-btn",
          onClick: n
        }, "应用选择"),
        ft("button", {
          class: "reset-btn",
          onClick: f
        }, "重置")
      ])
    ]));
  }
}), ir = /* @__PURE__ */ ve(rr, [["__scopeId", "data-v-d878dd96"]]), nr = {
  has(o, e, p) {
    if ([o, e, p].includes(void 0)) throw new Error("参数不能为undefined");
    return Array.isArray(this.data[o]) ? this.data[o].some((a) => a.from === p && a.skin === e) : !1;
  },
  add(o, e, p) {
    if ([o, e, p].includes(void 0)) throw new Error("参数不能为undefined");
    this.has(o, e, p) || (Array.isArray(this.data[o]) || (this.data[o] = []), this.data[o].push({ skin: e, from: p }));
  },
  get(o) {
    if (o === void 0) throw new Error("参数不能为undefined");
    return this.data[o];
  },
  get size() {
    return Object.keys(this.data).length;
  },
  data: {},
  get selected() {
    return tt.config("whichWay_ConfictedSkin_selectedSkins") || {};
  },
  set selected(o) {
    tt.saveConfig("whichWay_ConfictedSkin_selectedSkins", o);
  }
}, ar = Object.create(nr), Yt = 1.5, Ht = { x: 0, y: 0, scale: Yt };
function pe(o, e, p) {
  return {
    x: p * Math.max(1, o / e),
    y: p * Math.max(1, e / o)
  };
}
function me(o, e) {
  const p = Math.abs(e.x - 1) / 2, a = Math.abs(e.y - 1) / 2;
  return {
    x: Math.min(Math.max(o.x, -p), p),
    y: Math.min(Math.max(o.y, -a), a),
    scale: o.scale
  };
}
const Me = "经典形象", Jt = "json:pos.json", sr = "pos.json", Ce = 1;
let St = {}, qt = !1;
function wt(o, e) {
  const p = typeof o == "number" ? o : Number(o);
  return Number.isFinite(p) ? p : e;
}
function ye(o) {
  if (typeof o != "string" || o.length === 0) return;
  const e = /^url\(\s*(?:"([^"]*)"|'([^']*)'|([^)]*))\s*\)$/.exec(o.trim()), p = (e?.[1] ?? e?.[2] ?? e?.[3] ?? o).trim();
  if (!p) return;
  let a = p;
  try {
    a = decodeURIComponent(p);
  } catch {
  }
  const t = a.split("/").filter((f) => f.length > 0);
  if (t.length < 2) return;
  const i = t[t.length - 1], r = t[t.length - 2], n = it.removeExt(i);
  if (jt.isArknght(r)) return { charId: r, skin: n };
  if (jt.isArknght(n)) return { charId: n, skin: Me };
}
function Xt(o, e) {
  return qt ? { ...Ht, ...St[o]?.[e] } : { ...Ht };
}
function or() {
  return St;
}
function Yr() {
  return JSON.stringify({ schema: Ce, data: St }, null, "	");
}
function hr(o) {
  const e = ye(o);
  return e ? Xt(e.charId, e.skin) : { ...Ht };
}
function lr(o, e, p) {
  const a = St[o] ??= {};
  a[e] = {
    x: wt(p.x, 0),
    y: wt(p.y, 0),
    scale: wt(p.scale, Yt)
  }, Se();
}
async function ur() {
  try {
    if (!await it.exsitFile(Jt, "file")) {
      qt = !0;
      return;
    }
    const e = (await it.readFile(Jt))?.data;
    if (e && typeof e == "object")
      for (const p in e) {
        const a = e[p];
        if (!a || typeof a != "object") continue;
        const t = {};
        for (const i in a) {
          const r = a[i];
          !r || typeof r != "object" || (t[i] = {
            x: wt(r.x, 0),
            y: wt(r.y, 0),
            scale: wt(r.scale, Yt)
          });
        }
        St[p] = t;
      }
  } catch (o) {
    console.error("[whichWayPortraitPos] 读取 pos.json 失败，本次按默认位置显示", o);
  } finally {
    qt = !0;
  }
}
let bt;
function ge() {
  it.writeFileAsJson({ schema: Ce, data: St }, "json:", sr).then(() => {
    tt.isDeveloperMode() && console.log("[whichWayPortraitPos] 已写入", it.compilePath(Jt), "共", Object.keys(St).length, "名干员");
  }).catch((o) => {
    console.error("[whichWayPortraitPos] 保存 pos.json 失败", o);
  });
}
function Se() {
  clearTimeout(bt), bt = setTimeout(ge, 300);
}
function $t() {
  clearTimeout(bt), ge();
}
function cr() {
  return JSON.stringify(St);
}
function fr(o) {
  try {
    St = JSON.parse(o);
  } catch (e) {
    console.error("[whichWayPortraitPos] 恢复备份失败", e);
  }
  Se();
}
const dr = ["src"], vr = /* @__PURE__ */ ce({
  __name: "PortraitLayers",
  props: {
    image: { default: "" },
    offsetX: { default: 0 },
    offsetY: { default: 0 },
    scale: { default: Yt }
  },
  setup(o) {
    const e = o, p = Gt(() => `url("${it.compilePath("ui:background/default.png")}")`);
    function a() {
      return tt.config("portraitUseCover") === !0;
    }
    const t = Gt(() => {
      const u = /^url\(\s*(?:"([^"]*)"|'([^']*)'|([^)]*))\s*\)$/.exec(e.image.trim()), M = (u?.[1] ?? u?.[2] ?? u?.[3] ?? "").trim();
      return !M || M === "none" || M === "undefined" ? "" : M;
    }), i = Vt(), r = Vt(), n = Vt(!1), f = Vt(0), l = Vt(0);
    function v() {
      const u = r.value;
      f.value = u && u.naturalWidth > 0 && u.naturalHeight > 0 ? u.naturalWidth / u.naturalHeight : 0;
    }
    function c() {
      const u = i.value;
      !u || u.clientWidth <= 0 || u.clientHeight <= 0 || (l.value = u.clientWidth / u.clientHeight);
    }
    function s(u) {
      return !(f.value > 0) || !(l.value > 0) ? { x: u, y: u } : pe(f.value, l.value, u);
    }
    const h = Gt(() => {
      const u = a(), M = u ? 1 : e.scale, C = s(M), S = me({ x: u ? 0 : e.offsetX, y: u ? 0 : e.offsetY, scale: M }, C);
      return {
        width: `${C.x * 100}%`,
        height: `${C.y * 100}%`,
        left: `${50 + S.x * 100 - C.x * 50}%`,
        top: `${50 + S.y * 100 - C.y * 50}%`
      };
    });
    Ve(t, async () => {
      f.value = 0, n.value = !1, await Oe(), v(), c();
    });
    let d;
    return Fe(() => {
      c(), v();
      const u = i.value;
      u && typeof ResizeObserver < "u" && (d = new ResizeObserver(() => c()), d.observe(u));
    }), Ue(() => d?.disconnect()), (u, M) => (Et(), Rt("div", {
      ref_key: "wrapperEl",
      ref: i,
      class: "sjzxPortraitWrapper",
      style: re({ backgroundImage: p.value })
    }, [
      t.value && !n.value ? (Et(), Rt("img", {
        key: 0,
        ref_key: "imgEl",
        ref: r,
        class: "sjzxPortraitImage",
        src: t.value,
        style: re(h.value),
        draggable: "false",
        alt: "",
        onLoad: v,
        onError: M[0] || (M[0] = (C) => n.value = !0)
      }, null, 44, dr)) : Ne("", !0)
    ], 4));
  }
}), pr = /* @__PURE__ */ ve(vr, [["__scopeId", "data-v-3a164c20"]]), Qt = /* @__PURE__ */ new WeakMap(), oe = /* @__PURE__ */ new WeakSet(), xe = (o) => typeof o == "string" && jt.isArknght(o), Tt = (o) => {
  const e = Qt.get(o);
  return e && e.host.parentNode === o ? e : void 0;
};
function mr(o) {
  return o != null && Tt(o) !== void 0;
}
function Ae(o) {
  const e = Tt(o);
  if (e?.url)
    return ye(e.url);
}
function Ee(o, e) {
  const p = Tt(o);
  p && p.setImage(p.url, e);
}
function Mr(o, e) {
  const p = Tt(o);
  if (!p) return;
  const a = p.host.querySelector("img");
  if (!a) return;
  const t = p.host.clientWidth, i = p.host.clientHeight;
  if (!(t > 0) || !(i > 0)) return;
  const r = t / i;
  return !(a.naturalWidth > 0) || !(a.naturalHeight > 0) ? { x: e, y: e } : pe(a.naturalWidth / a.naturalHeight, r, e);
}
function Re(o) {
  const e = document.createElement("div");
  return o(e), e.style.backgroundImage;
}
function Cr(o) {
  const e = /^url\((?:"[^"]*"|'[^']*'|[^)]*)\)/.exec(o);
  return e ? e[0] : o;
}
function Te(o) {
  const e = Tt(o);
  if (e) return e;
  o.style.backgroundSize = "cover", o.style.backgroundPositionX = "center";
  const p = document.createElement("div");
  p.style.cssText = "position:absolute;left:0;top:0;width:100%;height:100%;pointer-events:none;border-radius:inherit;overflow:hidden;";
  const a = {
    host: p,
    url: "",
    setImage(t, i) {
      a.url = t;
      const r = i ?? hr(t);
      ie(Be(pr, { image: t, offsetX: r.x, offsetY: r.y, scale: r.scale }), p);
    },
    dispose() {
      ie(null, p), p.remove(), Qt.delete(o);
    }
  };
  return a.setImage(""), o.prepend(p), Qt.set(o, a), a;
}
function Ie(o, e) {
  const p = Te(o), a = Cr(Re((t) => HTMLDivElement.prototype.setBackground.call(t, e, "character")));
  a && (p.setImage(a), o.style.backgroundImage = a);
}
function Pt(o) {
  !o || oe.has(o) || (oe.add(o), o.setBackground = function(e, p, a, t) {
    return p === "character" && xe(e) ? (Ie(this, e), this) : (Tt(this)?.dispose(), HTMLDivElement.prototype.setBackground.call(this, e, p, a, t));
  }, o.setBackgroundImage = function(e) {
    const p = Tt(this);
    if (!p) return HTMLDivElement.prototype.setBackgroundImage.call(this, e);
    const a = Re((t) => HTMLDivElement.prototype.setBackgroundImage.call(t, e));
    return p.setImage(a), this.style.backgroundImage = a, this;
  });
}
function yr(o, e, p) {
  if (!(o instanceof HTMLDivElement) || !e) return !1;
  Pt(o);
  const a = e.startsWith("url(") ? e : `url("${it.compilePath(e)}")`;
  return Te(o).setImage(a, p), o.style.backgroundImage = a, !0;
}
de({
  name: "whichWaySkinAvatarBackground",
  fn: () => {
    Ut.appendHook("lib.element.player.$init", {
      before() {
        Pt(this.node.avatar), Pt(this.node.avatar2);
      }
    }), Ut.appendHook("lib.element.player.$reinit", {
      before() {
        Pt(this.node.avatar), Pt(this.node.avatar2);
      }
    }), Ut.appendHook("ui.create.buttonPresets.character", {
      after(o) {
        const e = o?.link;
        xe(e) && (Pt(o), Ie(o, e));
      }
    });
  }
});
const gr = 0.2, Sr = 5, xr = 200;
let gt, Nt;
const Wt = /* @__PURE__ */ new Set();
function he(o, e, p) {
  return Math.max(e, Math.min(p, o));
}
function le(o) {
  return o / (yt.documentZoom || 1);
}
function ke(o) {
  if (yt?.players)
    for (const e of yt.players.concat(yt.dead ?? []))
      for (const p of [e.node?.avatar, e.node?.avatar2])
        mr(p) && o(p);
}
function Ar(o) {
  const e = Ae(o);
  if (!e) return;
  const p = {
    pointerEvents: o.style.pointerEvents,
    cursor: o.style.cursor,
    touchAction: o.style.touchAction
  };
  o.style.pointerEvents = "all", o.style.cursor = "move", o.style.touchAction = "none";
  const a = /* @__PURE__ */ new Map();
  let t = 0, i = 0;
  const r = () => Xt(e.charId, e.skin), n = `dragging_portrait_${e.charId}_${e.skin}`, f = (S) => {
    const L = Mr(o, S.scale), E = L ? me(S, L) : S;
    lr(e.charId, e.skin, E), Ee(o, E);
  }, l = (S = !1) => {
    const L = Date.now();
    if (!S && L - i < xr) return;
    i = L;
    const E = r();
    Wt.add(n), et.showToast(
      `[${e.charId} · ${e.skin}] x=${E.x.toFixed(3)} y=${E.y.toFixed(3)} scale=${E.scale.toFixed(2)}`,
      !0,
      "topLeft",
      n
    );
  }, v = (S, L) => {
    const E = o.clientWidth, A = o.clientHeight;
    if (!E || !A) return;
    const g = r();
    f({ x: g.x + le(S) / E, y: g.y + le(L) / A, scale: g.scale });
  }, c = (S) => {
    const L = r();
    f({ x: L.x, y: L.y, scale: he(L.scale * S, gr, Sr) });
  }, s = () => {
    const [S, L] = [...a.values()];
    return !S || !L ? 0 : Math.hypot(L.x - S.x, L.y - S.y);
  }, h = (S) => {
    S.preventDefault(), a.set(S.pointerId, { x: S.clientX, y: S.clientY }), a.size === 2 && (t = s()), o.setPointerCapture?.(S.pointerId), o.addEventListener("pointermove", d), o.addEventListener("pointerup", u), o.addEventListener("pointercancel", u);
  }, d = (S) => {
    const L = a.get(S.pointerId);
    if (L) {
      if (a.set(S.pointerId, { x: S.clientX, y: S.clientY }), a.size >= 2) {
        const E = s();
        t > 0 && E > 0 && c(E / t), t = E, l();
        return;
      }
      v(S.clientX - L.x, S.clientY - L.y), l();
    }
  }, u = (S) => {
    a.delete(S.pointerId), o.releasePointerCapture?.(S.pointerId), o.removeEventListener("pointermove", d), o.removeEventListener("pointerup", u), o.removeEventListener("pointercancel", u), a.size < 2 && (t = 0), $t(), l(!0);
  }, M = (S) => {
    S.preventDefault(), c(he(Math.exp(-S.deltaY * 2e-3), 0.8, 1.25)), l(!0);
  }, C = (S) => {
    S.stopPropagation(), S.preventDefault();
  };
  return o.addEventListener("pointerdown", h), o.addEventListener("wheel", M, { passive: !1 }), o.addEventListener("click", C, !0), () => {
    o.removeEventListener("pointerdown", h), o.removeEventListener("wheel", M), o.removeEventListener("click", C, !0), o.removeEventListener("pointermove", d), o.removeEventListener("pointerup", u), o.removeEventListener("pointercancel", u), a.clear(), o.style.pointerEvents = p.pointerEvents, o.style.cursor = p.cursor, o.style.touchAction = p.touchAction, et.removeToastById(n), Wt.delete(n);
  };
}
let Kt;
function Er() {
  const o = document.createElement("div");
  o.id = "portraitDragBarSJZX";
  const e = document.createElement("button");
  e.textContent = "退出拖拽", e.addEventListener("click", () => Pe());
  const p = document.createElement("button");
  return p.textContent = "重置本次调整", p.addEventListener("click", () => kr()), o.append(e, p), document.body.appendChild(o), o;
}
function Rr() {
  if (gt) {
    for (const o of gt.values()) o();
    gt = void 0, Nt = void 0, Kt?.remove(), Kt = void 0, $t();
    for (const o of Wt) et.removeToastById(o);
    Wt.clear(), et.removeToastById("dragging_portrait_mode");
  }
}
function Tr() {
  ke((o) => {
    const e = Ae(o);
    e && Ee(o, Xt(e.charId, e.skin));
  });
}
function Ir() {
  const o = [];
  if (ke((e) => o.push(e)), o.length === 0) {
    et.showToast("[驶舰之向] 场上没有可拖拽的明日方舟立绘（只有本扩展绘制的干员立绘能调位置）", 4e3);
    return;
  }
  Nt = cr(), gt = /* @__PURE__ */ new Map();
  for (const e of o) {
    const p = Ar(e);
    p && gt.set(e, p);
  }
  if (gt.size === 0) {
    gt = void 0, Nt = void 0, et.showToast("[驶舰之向] 场上没有可拖拽的明日方舟立绘", 4e3);
    return;
  }
  Kt = Er(), et.showToast("[驶舰之向] 已进入皮肤拖拽：拖动改位置，滚轮/双指改大小，调整后自动保存", !0, "bottomRight", "dragging_portrait_mode");
}
function Pe() {
  if (gt) {
    Rr(), et.showToast("[驶舰之向] 已退出皮肤拖拽，位置已保存", 2500);
    return;
  }
  Ir();
}
function kr() {
  if (!gt || Nt === void 0) {
    et.showToast("[驶舰之向] 请先点「皮肤拖拽」进入拖拽模式", 2500);
    return;
  }
  fr(Nt), Tr(), et.showToast("[驶舰之向] 已恢复到进入皮肤拖拽前的位置", 2500);
}
const ue = "skinCacheClearedV16";
class Pr {
  /**
   * 皮肤组件初始化
   */
  async init() {
    await tt.measureExecutionTime(async () => {
      await ur(), await this.autoUpdateSkinData(), this.syncAllSkinConfig();
    }).then(({ duration: e }) => {
      tt.isDeveloperMode() && console.log(`[whichWaySkin] init skin time ${e}ms`);
    }).catch((e) => {
      console.error("[whichWaySkin] 皮肤数据初始化失败，已跳过皮肤层，其余功能继续加载", e);
    }), Ye({
      name: "whichWaySkinInitSkinData_init",
      fn: async () => {
        for (const e of window.whichWaySave.allCharacters)
          this.skinData[e] ??= {
            name: e,
            skins: {}
          }, this.skinData[e].skins = {
            经典形象: {
              name: it.getCharacterPortraitFile(e),
              path: it.getCharacterPortraitPath(e)
            },
            ...this.skinData[e].skins
          };
      }
    }), de({
      name: "whichWaySkinAddInitDyc",
      fn() {
        if (!b.needEnable()) return;
        let e = tt.config("WhichWayDynamicSkinSwitch");
        if (e === "sjzx")
          Ut.appendHook("lib.element.player.init", {
            before(p, a) {
              this.dycSJZX && b.dispose(this.dycSJZX), (function() {
                let t = $.config.mode;
                return t === "single" ? pt.config("double_character", t) !== "single" : pt.config("double_character", t);
              })() ? et.showToast("【驶舰之向】:双将时无法使用动皮！", 5e3, "bottomCenter", "sjzx_doubleCharacterWarn") : b.updateDyc(p, this);
            }
          }), Ut.appendHook("lib.element.player.reinit", {
            before(p, a) {
              this.dycSJZX && b.dispose(this.dycSJZX), (function() {
                let t = $.config.mode;
                return t === "single" ? pt.config("double_character", t) !== "single" : pt.config("double_character", t);
              })() ? et.showToast("【驶舰之向】:双将时无法使用动皮！", 5e3, "bottomCenter", "sjzx_doubleCharacterWarn") : b.updateDyc(p, this);
            }
          });
        else if (e === "piqie") {
          let p = structuredClone($.config.sjzxDycAssets ?? {});
          for (let a in p) {
            let t = p[a];
            for (let i in t) {
              let r = t[i];
              Array.isArray(r.action) && (r.action = r.action[0]);
            }
          }
          decadeUI.dynamicSkin || (decadeUI.dynamicSkin = {}), Object.assign(decadeUI.dynamicSkin, p), skinSwitch.saveSkinParams || (skinSwitch.saveSkinParams = {}), Object.assign(skinSwitch.saveSkinParams, p);
        }
      }
    }), ne({
      name: "whichWayInitDycDragging",
      fn() {
        b.needEnable() && tt.isDeveloperMode() && Lt.create.system(
          "动皮拖拽",
          () => {
            b.draggingDyc(yt.me.dycSJZX);
          },
          !0
        );
      }
    }), ne({
      name: "whichWayInitPortraitDragging",
      fn() {
        Lt.create.system("皮肤拖拽", Pe, !0);
      }
    }), Ot({
      name: "whichWaySkinUpdateSkinData_add",
      priority: 899,
      obj: {
        name: "updateSkinData",
        options: {
          name: "<button type=`button`>更新皮肤数据</button>",
          clear: !0,
          async onclick() {
            if (window.whichWaySave.updatingSkinData) {
              et.showToast("[驶舰之向] 正在更新皮肤数据，请勿重复操作...", 3e3, "topLeft", "configTips_updateSkinData_updatingSkinData");
              return;
            }
            window.whichWaySave.updatingSkinData = !0, et.showToast("[驶舰之向] 正在更新皮肤数据...", !0, "topLeft", "configTips_updateSkinData");
            try {
              await dt.autoUpdateSkinData(!0);
            } catch (e) {
              console.error("[whichWaySkin] 皮肤数据更新失败", e), et.showToast("[驶舰之向] 皮肤数据更新失败，详见控制台", 3e3, "topLeft", "configTips_updateSkinData");
              return;
            } finally {
              window.whichWaySave.updatingSkinData = !1, et.removeToastById("configTips_updateSkinData_updatingSkinData");
            }
            et.showToast("[驶舰之向] 皮肤数据更新完成!", 3e3, "topLeft", "configTips_updateSkinData");
          }
        }
      }
    }), Ot({
      name: "WhichWayDynamicSkinSwitch_add",
      priority: 755,
      obj: {
        name: "WhichWayDynamicSkinSwitch",
        options: {
          name: "动皮组件",
          intro: "选择动皮组件",
          init: "sjzx",
          item: {
            sjzx: "驶舰之向",
            piqie: "皮肤切换"
          }
        }
      }
    }), Ot({
      name: "whichwaySkinConfigAdd_enableWhichWayDynamicSkin",
      priority: 756,
      obj: {
        name: "enableWhichWayDynamicSkin",
        options: {
          name: "启用驶舰之向动皮",
          intro: "选择后会启用驶舰之向动皮组件",
          init: !0
        }
      }
    }), Ot({
      name: "whichwaySkinConfigAdd_portraitUseCover",
      priority: 757,
      obj: {
        name: "portraitUseCover",
        options: {
          name: "立绘/皮肤直接用cover铺满",
          intro: "开启后干员的立绘与皮肤只按 background-size:cover 铺满，忽略自定义的位置与缩放设定（pos.json）；关闭则沿用自定义的pos。改完需要换肤或重开一局才生效",
          init: !1
        }
      }
    }), Ot({
      name: "whichwaySkinConfigAdd_skinOverride",
      priority: 754,
      obj: {
        name: "skinOverride",
        options: {
          name: "皮肤配置优先级",
          intro: "选择皮肤配置优先级",
          init: "whichWay",
          item: {
            noname: "本体优先",
            whichWay: "驶舰之向优先",
            qhly: "千幻聆音优先"
          }
        }
      }
    }), await import("./skin-dynamicConfig.js");
  }
  /**
   * 初始化皮肤数据（只会读取本扩展的）
   */
  async initSkinData() {
    const { folders: e } = await it.getFileTree("skin:");
    for (const p of e)
      if (this.skinData[p.name] = {
        name: p.name,
        skins: {}
      }, p.files.length > 0)
        for (const a of p.files)
          this.skinData[p.name].skins[it.removeExt(a.name)] = {
            name: a.name,
            path: a.path
          };
  }
  /**
   * 保存皮肤数据
   */
  async saveSkinData() {
    await it.writeFileAsJson(
      {
        version: Zt.ext,
        data: this.skinData
      },
      "json:cache/",
      "skin.json"
    );
  }
  /**
   * v1.6 一次性删除皮肤缓存文件。
   *
   * 缓存里烙的是扫描当时的图片路径，立绘/皮肤目录迁移后这些路径就是坏的；
   * 而 autoUpdateSkinData 只要看到缓存版本号和当前扩展版本一致就直接复用，
   * 坏路径会一路活到 1.6.x 的每个小版本。所以 1.6 首次启动时强制删一次，
   * 让它按新目录重建；标记位保证只删一次。
   * @returns 本次是否执行了清理（版本不是 1.6、已清理过、或删除失败时返回 false）
   */
  async clearSkinCacheOnce() {
    if (!Zt.ext.startsWith("1.6") || tt.config(ue)) return !1;
    try {
      await it.exsitFile("json:cache/skin.json", "file") && await yt.promises.removeFile(it.compilePath("json:cache/skin.json"));
    } catch (e) {
      return console.error("[whichWaySkin] 删除皮肤缓存失败，将在下次启动重试", e), !1;
    }
    return tt.saveConfig(ue, !0), !0;
  }
  /**
   * 自动更新皮肤数据
   * @param forced 是否强制更新
   */
  async autoUpdateSkinData(e = !1) {
    if (await this.clearSkinCacheOnce(), await it.exsitFile("json:cache/skin.json", "file") && e === !1) {
      const { version: p, data: a } = await it.readFile("json:cache/skin.json");
      if (p === Zt.ext) {
        this.skinData = a;
        return;
      }
    }
    await this.initSkinData(), await this.saveSkinData();
  }
  /**
   * 获取角色的皮肤，如果没有指定皮肤，则返回所有皮肤
   * @param name 角色名
   * @param skin 皮肤名（可选）
   * @returns 皮肤路径或皮肤名数组
   */
  getCharacterSkin(e, p) {
    const a = this.skinData[e];
    if (a) {
      if (!p) {
        const t = {};
        for (const i in a.skins)
          t[i] = a.skins[i].path;
        return t;
      }
      return a.skins[p] ?? a.skins[it.removeExt(p)];
    }
  }
  /**
   * 把干员的图片/皮肤**添加**到任意节点上（走 `avatarBackground.ts` 的两层背景，而不是引擎的单层背景）
   *
   * 存在的理由：场上头像的立绘由劫持入口自动画，但「主动贴一张干员图」的场景（投稿预览、
   * 自定义面板、对话框卡片）没有劫持可用，直接用 `style.backgroundImage` 就会踩回老问题 ——
   * 立绘的透明区域透出底下的东西。这里统一走 `mountPortrait`，保证和场上头像同一套结构、
   * 同一份位置设定（`pos.json`）。
   * @param node 目标节点：必须是 div，且自身有尺寸（两层背景是 `position:absolute; inset:0`）
   * @param name 干员id
   * @param skin 皮肤名；留空则用该干员当前生效的皮肤
   * @returns 是否画上：解析不到图片或非 div 时返回 false，节点保持原样
   */
  addPortrait(e, p, a) {
    const t = a ? this.getCharacterSkin(p, a)?.path : this.getCurrentSkinPath(p);
    return t ? yr(e, t) : (console.warn(`[whichWaySkin] 找不到图片（角色：${p}${a ? `，皮肤：${a}` : ""}），未添加`), !1);
  }
  /**
   * 立绘位置/缩放设定（`json/pos.json` 的内存形态）：干员id → 皮肤名 → `{ x, y, scale }`。
   *
   * 返回的是**活引用**，改它就是在改当前生效的设定（要重绘才看得见，且不会自动落盘）；
   * 想直接落盘调 `flushPortraitPos()`。暴露的用途：控制台查配置、外部面板批量重置。
   */
  get posData() {
    return or();
  }
  /** 把内存里的立绘设定立刻写进 `json/pos.json`（拖拽松手/退出拖拽时已会自动调，这里给手动兜底） */
  flushPortraitPos() {
    $t();
  }
  /** 读某干员某皮肤当前生效的立绘设定；没有配置时返回缺省值，不会返回 undefined */
  getPortraitPos(e, p = Me) {
    return Xt(e, p);
  }
  /**
   * 设置角色皮肤
   * @returns 是否写入成功：找不到该皮肤时为 false（调用方据此决定要不要更新界面，避免"界面切了但配置没变"）
   */
  setCharacterSkin(e, p) {
    if (tt.isDeveloperMode() && console.log(`[whichWaySkin] setCharacterSkin ${e} ${p}`), p === "经典形象" && dt._skinStore[e])
      return this.syncSkin({ key: e, del: !0 }), !0;
    const a = this.getCharacterSkin(e, p);
    return a ? (this.syncSkin({ key: e, value: [a.name, a.path] }), !0) : (console.warn(`[whichWaySkin] 找不到皮肤「${p}」（角色：${e}），本次切换已忽略`), !1);
  }
  syncSkin({ key: e, value: p, del: a }) {
    if (a === !0)
      delete this._skinStore[e], delete window.whichWaySave.skinConfig[e], delete $.config.skin[e], tt.saveConfig("skin", $.config.skin, void 0), tt.saveConfig("skinConfig", window.whichWaySave.skinConfig);
    else {
      if (p === void 0) throw new Error("value is undefined");
      this._skinStore[e] = p, window.whichWaySave.skinConfig[e] = p[0], $.config.skin[e] = p, tt.saveConfig("skin", $.config.skin, void 0), tt.saveConfig("skinConfig", window.whichWaySave.skinConfig);
    }
  }
  refreshSkin() {
    const e = yt.players.concat(yt.dead);
    if (e.length !== 0)
      for (const p of e)
        p.node.avatar.setBackground(p.name1, "character"), p.name2 && p.node.avatar2.setBackground(p.name2, "character"), b.updateDyc(p.name, p);
  }
  /**
   * 获取角色的当前皮肤
   */
  getCurentSkin(e, p = !0) {
    let a = this._skinStore?.[e]?.[0];
    return a || (a = "经典形象.jpg"), p ? it.removeExt(a) : a;
  }
  /**
   * 获取角色的当前皮肤路径
   */
  getCurrentSkinPath(e) {
    let p = this._skinStore?.[e]?.[1];
    if (!p)
      if (window.whichWaySave.hasChar(e)) p = it.getCharacterPortraitPath(e);
      else {
        const a = pt.character(e);
        if (a.img !== void 0) return a.img;
        if (a.trashBin) {
          for (let t of a.trashBin)
            if (t.startsWith("ext:"))
              return t.replace("ext:", "extension/");
        }
        return `image/character/${e}.jpg`;
      }
    return p;
  }
  /**
   * 检查皮肤设置,不全的自动补全,并且判断是否需要同步
   */
  checkSkinSetting() {
    $.config.qhly_skinset ??= {
      skin: {
        //key-value方式，存放武将皮肤名
      },
      skinAudioList: {
        //key-value方式，存放武将皮肤配音
      },
      audioReplace: {
        //key-value方式，存放配音映射逻辑。
      },
      djtoggle: {}
    }, $.config.qhly_skinset.skin ??= {}, $.config.qhly_skinset.skinAudioList ??= {}, $.config.qhly_skinset.audioReplace ??= {}, $.config.qhly_skinset.djtoggle ??= {}, $.config.skin ??= {}, this._skinStore = this._skinStore || {};
  }
  /**
   * 选择冲突皮肤
   */
  showConflictedSkin() {
    const e = Lt.create.div(".conflictedSkinOverlay-whichWaySkin .whichWayOverlay", document.body);
    return We(ir).mount(e), new Promise((p) => {
      this.pendingReslove.showConflictedSkin = p;
    });
  }
  syncAllSkinConfig() {
    if (this._isSyncing) return;
    this._isSyncing = !0, this.checkSkinSetting();
    const e = this, p = (n, f, l) => {
      if (typeof l == "string" && l.length > 0) {
        e._skinStore[n] = [f, l];
        return;
      }
      console.warn(`[whichWaySkin] 皮肤「${f}」（角色：${n}）解析不到图片路径，本条配置已丢弃，回落到经典形象`), delete e._skinStore[n];
    }, a = (n, f) => {
      for (const l in n) {
        const v = n[l];
        f ? typeof v == "string" && p(l, v, e.getCharacterSkin(l, it.removeExt(v))?.path ?? e._skinStore[l]?.[1]) : Array.isArray(v) && v.length >= 1 && typeof v[0] == "string" ? p(l, v[0], e.getCharacterSkin(l, it.removeExt(v[0]))?.path ?? v[1]) : typeof v == "string" && p(l, v, e.getCharacterSkin(l, it.removeExt(v))?.path);
      }
    }, t = tt.config("skinOverride"), i = [
      { key: "whichWay", run: () => a(window.whichWaySave?.skinConfig || {}, !0) },
      { key: "noname", run: () => a($.config.skin || {}, !1) },
      { key: "qhly", run: () => a($.config.qhly_skinset?.skin || {}, !0) }
    ], r = i.findIndex((n) => n.key === t);
    r !== -1 && i.push(...i.splice(r, 1)), i.forEach((n) => n.run());
    try {
      const n = { ...this._skinStore }, f = this.transformSkinData(n);
      $.config.skin = n, $.config.qhly_skinset.skin = f, window.whichWaySave.skinConfig = f, tt.saveConfig("skin", n, void 0), tt.saveConfig("qhly_skinset", $.config.qhly_skinset, void 0), tt.saveConfig("skinConfig", window.whichWaySave.skinConfig);
    } finally {
      this._isSyncing = !1;
    }
  }
  /**
   * 将本体皮肤数据格式转变为千幻、驶舰之向数据格式
   * - 若值为 [string, string] 数组，则取第一个元素；
   * - 否则保留原始值不变。
   */
  transformSkinData(e) {
    return Object.fromEntries(
      Object.entries(e).map(([p, a]) => Array.isArray(a) && a.length > 0 && typeof a[0] == "string" ? [p, a[0]] : [p, String(a)])
    );
  }
  /**
   * 清除皮肤配置
   */
  clearSkinConfig() {
    if (!tt.isDeveloperMode()) {
      console.warn("WhichWaySkin.clearSkinConfig can only be called in developer mode.");
      return;
    }
    for (const e in this._skinStore)
      delete this._skinStore[e];
  }
  initConfictedSkins() {
    this.checkSkinSetting();
    const e = window.whichWaySave.skinConfig, p = $.config.skin, a = $.config.qhly_skinset.skin, t = this.confictedSkins.selected;
    for (const i in e)
      t[i] && [e[i], p[i], a[i]].includes(t[i]) || window.whichWaySave.hasChar(i) && (p[i] && Array.isArray(p[i]) && p[i][0] !== e[i] && (this.confictedSkins.add(i, p[i][0], "noname"), this.confictedSkins.add(i, e[i], "whichWay")), a[i] && a[i] !== e[i] && (this.confictedSkins.add(i, a[i], "qhly"), this.confictedSkins.add(i, e[i], "whichWay")));
  }
  /**
   * 皮肤数据
   */
  skinData = {};
  /**
   * 共享的皮肤配置对象
   *
   * 路径一定是非空字符串：`[皮肤名, undefined]` 会被引擎贴成 `url(undefined)` 并挤掉有效的 `char.img`，
   * 写入口（`syncAllSkinConfig` 的 `store()` 与 `setCharacterSkin`）都保证解析不到就不写键。
   */
  _skinStore = {};
  _isSyncing = !1;
  /**
   * 冲突的皮肤
   */
  confictedSkins = ar;
  /**
   * 等待的Promise
   */
  pendingReslove = {};
}
const dt = new Pr();
await dt.init();
fe({
  name: "WhichWaySkin_dev",
  fn: () => {
    window.whichWaySkin = dt;
  }
});
window.whichWay.register("skin", dt);
const Xr = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  whichWaySkin: dt
}, Symbol.toStringTag, { value: "Module" }));
export {
  Me as D,
  Yt as a,
  b,
  Xr as c,
  Ar as e,
  xe as i,
  yr as m,
  Yr as s,
  dt as w
};
