import { defineComponent as Yt, reactive as Wt, openBlock as xt, createElementBlock as Et, createElementVNode as ft, unref as kt, Fragment as wt, renderList as Ot, toDisplayString as Dt, withDirectives as Xt, normalizeClass as Gt, createApp as Zt } from "vue";
import { lib as $, get as mt, game as Lt, ui as It } from "noname";
import { whichWayFile as pt } from "./file-CXhVBbUa.js";
import { onSetDev as Bt, onInit as jt, onContent as _t, onArenaReady as zt, onConfig as Pt } from "./hooks-BscfO9lD.js";
import { whichWayAPIOverride as Ft } from "./override-B27IQjje.js";
import { whichWayToast as ht } from "./toast-BKImUKDM.js";
import { whichWayUtil as et } from "./utill-DpF3UCI4.js";
import { w as Ut } from "./version-shared-C3acQ_GF.js";
import { _ as Ht } from "./_plugin-vue_export-helper-CHgC5LLL.js";
var Q = /* @__PURE__ */ (function() {
  var c = function(r, M) {
    return c = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(a, t) {
      a.__proto__ = t;
    } || function(a, t) {
      for (var i in t) Object.prototype.hasOwnProperty.call(t, i) && (a[i] = t[i]);
    }, c(r, M);
  };
  return function(r, M) {
    if (typeof M != "function" && M !== null)
      throw new TypeError("Class extends value " + String(M) + " is not a constructor or null");
    c(r, M);
    function a() {
      this.constructor = r;
    }
    r.prototype = M === null ? Object.create(M) : (a.prototype = M.prototype, new a());
  };
})(), F;
(function(c) {
  var r = (function() {
    function g(p, A, P) {
      if (p == null)
        throw new Error("name cannot be null.");
      if (A == null)
        throw new Error("timelines cannot be null.");
      this.name = p, this.timelines = A, this.timelineIds = [];
      for (var k = 0; k < A.length; k++)
        this.timelineIds[A[k].getPropertyId()] = !0;
      this.duration = P;
    }
    return g.prototype.hasTimeline = function(p) {
      return this.timelineIds[p] == !0;
    }, g.prototype.apply = function(p, A, P, k, O, E, V, N) {
      if (p == null)
        throw new Error("skeleton cannot be null.");
      k && this.duration != 0 && (P %= this.duration, A > 0 && (A %= this.duration));
      for (var I = this.timelines, y = 0, R = I.length; y < R; y++)
        I[y].apply(p, A, P, O, E, V, N);
    }, g.binarySearch = function(p, A, P) {
      P === void 0 && (P = 1);
      var k = 0, O = p.length / P - 2;
      if (O == 0)
        return P;
      for (var E = O >>> 1; ; ) {
        if (p[(E + 1) * P] <= A ? k = E + 1 : O = E, k == O)
          return (k + 1) * P;
        E = k + O >>> 1;
      }
    }, g.linearSearch = function(p, A, P) {
      for (var k = 0, O = p.length - P; k <= O; k += P)
        if (p[k] > A)
          return k;
      return -1;
    }, g;
  })();
  c.Animation = r;
  var M;
  (function(g) {
    g[g.setup = 0] = "setup", g[g.first = 1] = "first", g[g.replace = 2] = "replace", g[g.add = 3] = "add";
  })(M = c.MixBlend || (c.MixBlend = {}));
  var a;
  (function(g) {
    g[g.mixIn = 0] = "mixIn", g[g.mixOut = 1] = "mixOut";
  })(a = c.MixDirection || (c.MixDirection = {}));
  var t;
  (function(g) {
    g[g.rotate = 0] = "rotate", g[g.translate = 1] = "translate", g[g.scale = 2] = "scale", g[g.shear = 3] = "shear", g[g.attachment = 4] = "attachment", g[g.color = 5] = "color", g[g.deform = 6] = "deform", g[g.event = 7] = "event", g[g.drawOrder = 8] = "drawOrder", g[g.ikConstraint = 9] = "ikConstraint", g[g.transformConstraint = 10] = "transformConstraint", g[g.pathConstraintPosition = 11] = "pathConstraintPosition", g[g.pathConstraintSpacing = 12] = "pathConstraintSpacing", g[g.pathConstraintMix = 13] = "pathConstraintMix", g[g.twoColor = 14] = "twoColor";
  })(t = c.TimelineType || (c.TimelineType = {}));
  var i = (function() {
    function g(p) {
      if (p <= 0)
        throw new Error("frameCount must be > 0: " + p);
      this.curves = c.Utils.newFloatArray((p - 1) * g.BEZIER_SIZE);
    }
    return g.prototype.getFrameCount = function() {
      return this.curves.length / g.BEZIER_SIZE + 1;
    }, g.prototype.setLinear = function(p) {
      this.curves[p * g.BEZIER_SIZE] = g.LINEAR;
    }, g.prototype.setStepped = function(p) {
      this.curves[p * g.BEZIER_SIZE] = g.STEPPED;
    }, g.prototype.getCurveType = function(p) {
      var A = p * g.BEZIER_SIZE;
      if (A == this.curves.length)
        return g.LINEAR;
      var P = this.curves[A];
      return P == g.LINEAR ? g.LINEAR : P == g.STEPPED ? g.STEPPED : g.BEZIER;
    }, g.prototype.setCurve = function(p, A, P, k, O) {
      var E = (-A * 2 + k) * 0.03, V = (-P * 2 + O) * 0.03, N = ((A - k) * 3 + 1) * 6e-3, I = ((P - O) * 3 + 1) * 6e-3, y = E * 2 + N, R = V * 2 + I, B = A * 0.3 + E + N * 0.16666667, w = P * 0.3 + V + I * 0.16666667, Z = p * g.BEZIER_SIZE, W = this.curves;
      W[Z++] = g.BEZIER;
      for (var G = B, X = w, Y = Z + g.BEZIER_SIZE - 1; Z < Y; Z += 2)
        W[Z] = G, W[Z + 1] = X, B += y, w += R, y += N, R += I, G += B, X += w;
    }, g.prototype.getCurvePercent = function(p, A) {
      A = c.MathUtils.clamp(A, 0, 1);
      var P = this.curves, k = p * g.BEZIER_SIZE, O = P[k];
      if (O == g.LINEAR)
        return A;
      if (O == g.STEPPED)
        return 0;
      k++;
      for (var E = 0, V = k, N = k + g.BEZIER_SIZE - 1; k < N; k += 2)
        if (E = P[k], E >= A) {
          var I = void 0, y = void 0;
          return k == V ? (I = 0, y = 0) : (I = P[k - 2], y = P[k - 1]), y + (P[k + 1] - y) * (A - I) / (E - I);
        }
      var R = P[k - 1];
      return R + (1 - R) * (A - E) / (1 - E);
    }, g.LINEAR = 0, g.STEPPED = 1, g.BEZIER = 2, g.BEZIER_SIZE = 19, g;
  })();
  c.CurveTimeline = i;
  var e = (function(g) {
    Q(p, g);
    function p(A) {
      var P = g.call(this, A) || this;
      return P.frames = c.Utils.newFloatArray(A << 1), P;
    }
    return p.prototype.getPropertyId = function() {
      return (t.rotate << 24) + this.boneIndex;
    }, p.prototype.setFrame = function(A, P, k) {
      A <<= 1, this.frames[A] = P, this.frames[A + p.ROTATION] = k;
    }, p.prototype.apply = function(A, P, k, O, E, V, N) {
      var I = this.frames, y = A.bones[this.boneIndex];
      if (y.active) {
        if (k < I[0]) {
          switch (V) {
            case M.setup:
              y.rotation = y.data.rotation;
              return;
            case M.first:
              var R = y.data.rotation - y.rotation;
              y.rotation += (R - (16384 - (16384.499999999996 - R / 360 | 0)) * 360) * E;
          }
          return;
        }
        if (k >= I[I.length - p.ENTRIES]) {
          var B = I[I.length + p.PREV_ROTATION];
          switch (V) {
            case M.setup:
              y.rotation = y.data.rotation + B * E;
              break;
            case M.first:
            case M.replace:
              B += y.data.rotation - y.rotation, B -= (16384 - (16384.499999999996 - B / 360 | 0)) * 360;
            case M.add:
              y.rotation += B * E;
          }
          return;
        }
        var w = r.binarySearch(I, k, p.ENTRIES), Z = I[w + p.PREV_ROTATION], W = I[w], G = this.getCurvePercent((w >> 1) - 1, 1 - (k - W) / (I[w + p.PREV_TIME] - W)), X = I[w + p.ROTATION] - Z;
        switch (X = Z + (X - (16384 - (16384.499999999996 - X / 360 | 0)) * 360) * G, V) {
          case M.setup:
            y.rotation = y.data.rotation + (X - (16384 - (16384.499999999996 - X / 360 | 0)) * 360) * E;
            break;
          case M.first:
          case M.replace:
            X += y.data.rotation - y.rotation;
          case M.add:
            y.rotation += (X - (16384 - (16384.499999999996 - X / 360 | 0)) * 360) * E;
        }
      }
    }, p.ENTRIES = 2, p.PREV_TIME = -2, p.PREV_ROTATION = -1, p.ROTATION = 1, p;
  })(i);
  c.RotateTimeline = e;
  var n = (function(g) {
    Q(p, g);
    function p(A) {
      var P = g.call(this, A) || this;
      return P.frames = c.Utils.newFloatArray(A * p.ENTRIES), P;
    }
    return p.prototype.getPropertyId = function() {
      return (t.translate << 24) + this.boneIndex;
    }, p.prototype.setFrame = function(A, P, k, O) {
      A *= p.ENTRIES, this.frames[A] = P, this.frames[A + p.X] = k, this.frames[A + p.Y] = O;
    }, p.prototype.apply = function(A, P, k, O, E, V, N) {
      var I = this.frames, y = A.bones[this.boneIndex];
      if (y.active) {
        if (k < I[0]) {
          switch (V) {
            case M.setup:
              y.x = y.data.x, y.y = y.data.y;
              return;
            case M.first:
              y.x += (y.data.x - y.x) * E, y.y += (y.data.y - y.y) * E;
          }
          return;
        }
        var R = 0, B = 0;
        if (k >= I[I.length - p.ENTRIES])
          R = I[I.length + p.PREV_X], B = I[I.length + p.PREV_Y];
        else {
          var w = r.binarySearch(I, k, p.ENTRIES);
          R = I[w + p.PREV_X], B = I[w + p.PREV_Y];
          var Z = I[w], W = this.getCurvePercent(w / p.ENTRIES - 1, 1 - (k - Z) / (I[w + p.PREV_TIME] - Z));
          R += (I[w + p.X] - R) * W, B += (I[w + p.Y] - B) * W;
        }
        switch (V) {
          case M.setup:
            y.x = y.data.x + R * E, y.y = y.data.y + B * E;
            break;
          case M.first:
          case M.replace:
            y.x += (y.data.x + R - y.x) * E, y.y += (y.data.y + B - y.y) * E;
            break;
          case M.add:
            y.x += R * E, y.y += B * E;
        }
      }
    }, p.ENTRIES = 3, p.PREV_TIME = -3, p.PREV_X = -2, p.PREV_Y = -1, p.X = 1, p.Y = 2, p;
  })(i);
  c.TranslateTimeline = n;
  var f = (function(g) {
    Q(p, g);
    function p(A) {
      return g.call(this, A) || this;
    }
    return p.prototype.getPropertyId = function() {
      return (t.scale << 24) + this.boneIndex;
    }, p.prototype.apply = function(A, P, k, O, E, V, N) {
      var I = this.frames, y = A.bones[this.boneIndex];
      if (y.active) {
        if (k < I[0]) {
          switch (V) {
            case M.setup:
              y.scaleX = y.data.scaleX, y.scaleY = y.data.scaleY;
              return;
            case M.first:
              y.scaleX += (y.data.scaleX - y.scaleX) * E, y.scaleY += (y.data.scaleY - y.scaleY) * E;
          }
          return;
        }
        var R = 0, B = 0;
        if (k >= I[I.length - p.ENTRIES])
          R = I[I.length + p.PREV_X] * y.data.scaleX, B = I[I.length + p.PREV_Y] * y.data.scaleY;
        else {
          var w = r.binarySearch(I, k, p.ENTRIES);
          R = I[w + p.PREV_X], B = I[w + p.PREV_Y];
          var Z = I[w], W = this.getCurvePercent(w / p.ENTRIES - 1, 1 - (k - Z) / (I[w + p.PREV_TIME] - Z));
          R = (R + (I[w + p.X] - R) * W) * y.data.scaleX, B = (B + (I[w + p.Y] - B) * W) * y.data.scaleY;
        }
        if (E == 1)
          V == M.add ? (y.scaleX += R - y.data.scaleX, y.scaleY += B - y.data.scaleY) : (y.scaleX = R, y.scaleY = B);
        else {
          var G = 0, X = 0;
          if (N == a.mixOut)
            switch (V) {
              case M.setup:
                G = y.data.scaleX, X = y.data.scaleY, y.scaleX = G + (Math.abs(R) * c.MathUtils.signum(G) - G) * E, y.scaleY = X + (Math.abs(B) * c.MathUtils.signum(X) - X) * E;
                break;
              case M.first:
              case M.replace:
                G = y.scaleX, X = y.scaleY, y.scaleX = G + (Math.abs(R) * c.MathUtils.signum(G) - G) * E, y.scaleY = X + (Math.abs(B) * c.MathUtils.signum(X) - X) * E;
                break;
              case M.add:
                G = y.scaleX, X = y.scaleY, y.scaleX = G + (Math.abs(R) * c.MathUtils.signum(G) - y.data.scaleX) * E, y.scaleY = X + (Math.abs(B) * c.MathUtils.signum(X) - y.data.scaleY) * E;
            }
          else
            switch (V) {
              case M.setup:
                G = Math.abs(y.data.scaleX) * c.MathUtils.signum(R), X = Math.abs(y.data.scaleY) * c.MathUtils.signum(B), y.scaleX = G + (R - G) * E, y.scaleY = X + (B - X) * E;
                break;
              case M.first:
              case M.replace:
                G = Math.abs(y.scaleX) * c.MathUtils.signum(R), X = Math.abs(y.scaleY) * c.MathUtils.signum(B), y.scaleX = G + (R - G) * E, y.scaleY = X + (B - X) * E;
                break;
              case M.add:
                G = c.MathUtils.signum(R), X = c.MathUtils.signum(B), y.scaleX = Math.abs(y.scaleX) * G + (R - Math.abs(y.data.scaleX) * G) * E, y.scaleY = Math.abs(y.scaleY) * X + (B - Math.abs(y.data.scaleY) * X) * E;
            }
        }
      }
    }, p;
  })(n);
  c.ScaleTimeline = f;
  var h = (function(g) {
    Q(p, g);
    function p(A) {
      return g.call(this, A) || this;
    }
    return p.prototype.getPropertyId = function() {
      return (t.shear << 24) + this.boneIndex;
    }, p.prototype.apply = function(A, P, k, O, E, V, N) {
      var I = this.frames, y = A.bones[this.boneIndex];
      if (y.active) {
        if (k < I[0]) {
          switch (V) {
            case M.setup:
              y.shearX = y.data.shearX, y.shearY = y.data.shearY;
              return;
            case M.first:
              y.shearX += (y.data.shearX - y.shearX) * E, y.shearY += (y.data.shearY - y.shearY) * E;
          }
          return;
        }
        var R = 0, B = 0;
        if (k >= I[I.length - p.ENTRIES])
          R = I[I.length + p.PREV_X], B = I[I.length + p.PREV_Y];
        else {
          var w = r.binarySearch(I, k, p.ENTRIES);
          R = I[w + p.PREV_X], B = I[w + p.PREV_Y];
          var Z = I[w], W = this.getCurvePercent(w / p.ENTRIES - 1, 1 - (k - Z) / (I[w + p.PREV_TIME] - Z));
          R = R + (I[w + p.X] - R) * W, B = B + (I[w + p.Y] - B) * W;
        }
        switch (V) {
          case M.setup:
            y.shearX = y.data.shearX + R * E, y.shearY = y.data.shearY + B * E;
            break;
          case M.first:
          case M.replace:
            y.shearX += (y.data.shearX + R - y.shearX) * E, y.shearY += (y.data.shearY + B - y.shearY) * E;
            break;
          case M.add:
            y.shearX += R * E, y.shearY += B * E;
        }
      }
    }, p;
  })(n);
  c.ShearTimeline = h;
  var v = (function(g) {
    Q(p, g);
    function p(A) {
      var P = g.call(this, A) || this;
      return P.frames = c.Utils.newFloatArray(A * p.ENTRIES), P;
    }
    return p.prototype.getPropertyId = function() {
      return (t.color << 24) + this.slotIndex;
    }, p.prototype.setFrame = function(A, P, k, O, E, V) {
      A *= p.ENTRIES, this.frames[A] = P, this.frames[A + p.R] = k, this.frames[A + p.G] = O, this.frames[A + p.B] = E, this.frames[A + p.A] = V;
    }, p.prototype.apply = function(A, P, k, O, E, V, N) {
      var I = A.slots[this.slotIndex];
      if (I.bone.active) {
        var y = this.frames;
        if (k < y[0]) {
          switch (V) {
            case M.setup:
              I.color.setFromColor(I.data.color);
              return;
            case M.first:
              var R = I.color, B = I.data.color;
              R.add((B.r - R.r) * E, (B.g - R.g) * E, (B.b - R.b) * E, (B.a - R.a) * E);
          }
          return;
        }
        var w = 0, Z = 0, W = 0, G = 0;
        if (k >= y[y.length - p.ENTRIES]) {
          var X = y.length;
          w = y[X + p.PREV_R], Z = y[X + p.PREV_G], W = y[X + p.PREV_B], G = y[X + p.PREV_A];
        } else {
          var Y = r.binarySearch(y, k, p.ENTRIES);
          w = y[Y + p.PREV_R], Z = y[Y + p.PREV_G], W = y[Y + p.PREV_B], G = y[Y + p.PREV_A];
          var U = y[Y], L = this.getCurvePercent(Y / p.ENTRIES - 1, 1 - (k - U) / (y[Y + p.PREV_TIME] - U));
          w += (y[Y + p.R] - w) * L, Z += (y[Y + p.G] - Z) * L, W += (y[Y + p.B] - W) * L, G += (y[Y + p.A] - G) * L;
        }
        if (E == 1)
          I.color.set(w, Z, W, G);
        else {
          var R = I.color;
          V == M.setup && R.setFromColor(I.data.color), R.add((w - R.r) * E, (Z - R.g) * E, (W - R.b) * E, (G - R.a) * E);
        }
      }
    }, p.ENTRIES = 5, p.PREV_TIME = -5, p.PREV_R = -4, p.PREV_G = -3, p.PREV_B = -2, p.PREV_A = -1, p.R = 1, p.G = 2, p.B = 3, p.A = 4, p;
  })(i);
  c.ColorTimeline = v;
  var u = (function(g) {
    Q(p, g);
    function p(A) {
      var P = g.call(this, A) || this;
      return P.frames = c.Utils.newFloatArray(A * p.ENTRIES), P;
    }
    return p.prototype.getPropertyId = function() {
      return (t.twoColor << 24) + this.slotIndex;
    }, p.prototype.setFrame = function(A, P, k, O, E, V, N, I, y) {
      A *= p.ENTRIES, this.frames[A] = P, this.frames[A + p.R] = k, this.frames[A + p.G] = O, this.frames[A + p.B] = E, this.frames[A + p.A] = V, this.frames[A + p.R2] = N, this.frames[A + p.G2] = I, this.frames[A + p.B2] = y;
    }, p.prototype.apply = function(A, P, k, O, E, V, N) {
      var I = A.slots[this.slotIndex];
      if (I.bone.active) {
        var y = this.frames;
        if (k < y[0]) {
          switch (V) {
            case M.setup:
              I.color.setFromColor(I.data.color), I.darkColor.setFromColor(I.data.darkColor);
              return;
            case M.first:
              var R = I.color, B = I.darkColor, w = I.data.color, Z = I.data.darkColor;
              R.add((w.r - R.r) * E, (w.g - R.g) * E, (w.b - R.b) * E, (w.a - R.a) * E), B.add((Z.r - B.r) * E, (Z.g - B.g) * E, (Z.b - B.b) * E, 0);
          }
          return;
        }
        var W = 0, G = 0, X = 0, Y = 0, U = 0, L = 0, j = 0;
        if (k >= y[y.length - p.ENTRIES]) {
          var z = y.length;
          W = y[z + p.PREV_R], G = y[z + p.PREV_G], X = y[z + p.PREV_B], Y = y[z + p.PREV_A], U = y[z + p.PREV_R2], L = y[z + p.PREV_G2], j = y[z + p.PREV_B2];
        } else {
          var _ = r.binarySearch(y, k, p.ENTRIES);
          W = y[_ + p.PREV_R], G = y[_ + p.PREV_G], X = y[_ + p.PREV_B], Y = y[_ + p.PREV_A], U = y[_ + p.PREV_R2], L = y[_ + p.PREV_G2], j = y[_ + p.PREV_B2];
          var H = y[_], q = this.getCurvePercent(_ / p.ENTRIES - 1, 1 - (k - H) / (y[_ + p.PREV_TIME] - H));
          W += (y[_ + p.R] - W) * q, G += (y[_ + p.G] - G) * q, X += (y[_ + p.B] - X) * q, Y += (y[_ + p.A] - Y) * q, U += (y[_ + p.R2] - U) * q, L += (y[_ + p.G2] - L) * q, j += (y[_ + p.B2] - j) * q;
        }
        if (E == 1)
          I.color.set(W, G, X, Y), I.darkColor.set(U, L, j, 1);
        else {
          var R = I.color, B = I.darkColor;
          V == M.setup && (R.setFromColor(I.data.color), B.setFromColor(I.data.darkColor)), R.add((W - R.r) * E, (G - R.g) * E, (X - R.b) * E, (Y - R.a) * E), B.add((U - B.r) * E, (L - B.g) * E, (j - B.b) * E, 0);
        }
      }
    }, p.ENTRIES = 8, p.PREV_TIME = -8, p.PREV_R = -7, p.PREV_G = -6, p.PREV_B = -5, p.PREV_A = -4, p.PREV_R2 = -3, p.PREV_G2 = -2, p.PREV_B2 = -1, p.R = 1, p.G = 2, p.B = 3, p.A = 4, p.R2 = 5, p.G2 = 6, p.B2 = 7, p;
  })(i);
  c.TwoColorTimeline = u;
  var s = (function() {
    function g(p) {
      this.frames = c.Utils.newFloatArray(p), this.attachmentNames = new Array(p);
    }
    return g.prototype.getPropertyId = function() {
      return (t.attachment << 24) + this.slotIndex;
    }, g.prototype.getFrameCount = function() {
      return this.frames.length;
    }, g.prototype.setFrame = function(p, A, P) {
      this.frames[p] = A, this.attachmentNames[p] = P;
    }, g.prototype.apply = function(p, A, P, k, O, E, V) {
      var N = p.slots[this.slotIndex];
      if (N.bone.active) {
        if (V == a.mixOut) {
          E == M.setup && this.setAttachment(p, N, N.data.attachmentName);
          return;
        }
        var I = this.frames;
        if (P < I[0]) {
          (E == M.setup || E == M.first) && this.setAttachment(p, N, N.data.attachmentName);
          return;
        }
        var y = 0;
        P >= I[I.length - 1] ? y = I.length - 1 : y = r.binarySearch(I, P, 1) - 1;
        var R = this.attachmentNames[y];
        p.slots[this.slotIndex].setAttachment(R == null ? null : p.getAttachment(this.slotIndex, R));
      }
    }, g.prototype.setAttachment = function(p, A, P) {
      A.setAttachment(P == null ? null : p.getAttachment(this.slotIndex, P));
    }, g;
  })();
  c.AttachmentTimeline = s;
  var o = null, d = (function(g) {
    Q(p, g);
    function p(A) {
      var P = g.call(this, A) || this;
      return P.frames = c.Utils.newFloatArray(A), P.frameVertices = new Array(A), o == null && (o = c.Utils.newFloatArray(64)), P;
    }
    return p.prototype.getPropertyId = function() {
      return (t.deform << 27) + +this.attachment.id + this.slotIndex;
    }, p.prototype.setFrame = function(A, P, k) {
      this.frames[A] = P, this.frameVertices[A] = k;
    }, p.prototype.apply = function(A, P, k, O, E, V, N) {
      var I = A.slots[this.slotIndex];
      if (I.bone.active) {
        var y = I.getAttachment();
        if (!(!(y instanceof c.VertexAttachment) || y.deformAttachment != this.attachment)) {
          var R = I.deform;
          R.length == 0 && (V = M.setup);
          var B = this.frameVertices, w = B[0].length, Z = this.frames;
          if (k < Z[0]) {
            var W = y;
            switch (V) {
              case M.setup:
                R.length = 0;
                return;
              case M.first:
                if (E == 1) {
                  R.length = 0;
                  break;
                }
                var G = c.Utils.setArraySize(R, w);
                if (W.bones == null)
                  for (var X = W.vertices, Y = 0; Y < w; Y++)
                    G[Y] += (X[Y] - G[Y]) * E;
                else {
                  E = 1 - E;
                  for (var Y = 0; Y < w; Y++)
                    G[Y] *= E;
                }
            }
            return;
          }
          var U = c.Utils.setArraySize(R, w);
          if (k >= Z[Z.length - 1]) {
            var L = B[Z.length - 1];
            if (E == 1)
              if (V == M.add) {
                var W = y;
                if (W.bones == null)
                  for (var X = W.vertices, j = 0; j < w; j++)
                    U[j] += L[j] - X[j];
                else
                  for (var z = 0; z < w; z++)
                    U[z] += L[z];
              } else
                c.Utils.arrayCopy(L, 0, U, 0, w);
            else
              switch (V) {
                case M.setup: {
                  var _ = y;
                  if (_.bones == null)
                    for (var X = _.vertices, H = 0; H < w; H++) {
                      var q = X[H];
                      U[H] = q + (L[H] - q) * E;
                    }
                  else
                    for (var b = 0; b < w; b++)
                      U[b] = L[b] * E;
                  break;
                }
                case M.first:
                case M.replace:
                  for (var J = 0; J < w; J++)
                    U[J] += (L[J] - U[J]) * E;
                  break;
                case M.add:
                  var W = y;
                  if (W.bones == null)
                    for (var X = W.vertices, it = 0; it < w; it++)
                      U[it] += (L[it] - X[it]) * E;
                  else
                    for (var rt = 0; rt < w; rt++)
                      U[rt] += L[rt] * E;
              }
            return;
          }
          var lt = r.binarySearch(Z, k), ut = B[lt - 1], nt = B[lt], ct = Z[lt], at = this.getCurvePercent(lt - 1, 1 - (k - ct) / (Z[lt - 1] - ct));
          if (E == 1)
            if (V == M.add) {
              var W = y;
              if (W.bones == null)
                for (var X = W.vertices, st = 0; st < w; st++) {
                  var tt = ut[st];
                  U[st] += tt + (nt[st] - tt) * at - X[st];
                }
              else
                for (var yt = 0; yt < w; yt++) {
                  var tt = ut[yt];
                  U[yt] += tt + (nt[yt] - tt) * at;
                }
            } else
              for (var Mt = 0; Mt < w; Mt++) {
                var tt = ut[Mt];
                U[Mt] = tt + (nt[Mt] - tt) * at;
              }
          else
            switch (V) {
              case M.setup: {
                var St = y;
                if (St.bones == null)
                  for (var X = St.vertices, Ct = 0; Ct < w; Ct++) {
                    var tt = ut[Ct], q = X[Ct];
                    U[Ct] = q + (tt + (nt[Ct] - tt) * at - q) * E;
                  }
                else
                  for (var gt = 0; gt < w; gt++) {
                    var tt = ut[gt];
                    U[gt] = (tt + (nt[gt] - tt) * at) * E;
                  }
                break;
              }
              case M.first:
              case M.replace:
                for (var vt = 0; vt < w; vt++) {
                  var tt = ut[vt];
                  U[vt] += (tt + (nt[vt] - tt) * at - U[vt]) * E;
                }
                break;
              case M.add:
                var W = y;
                if (W.bones == null)
                  for (var X = W.vertices, At = 0; At < w; At++) {
                    var tt = ut[At];
                    U[At] += (tt + (nt[At] - tt) * at - X[At]) * E;
                  }
                else
                  for (var Rt = 0; Rt < w; Rt++) {
                    var tt = ut[Rt];
                    U[Rt] += (tt + (nt[Rt] - tt) * at) * E;
                  }
            }
        }
      }
    }, p;
  })(i);
  c.DeformTimeline = d;
  var l = (function() {
    function g(p) {
      this.frames = c.Utils.newFloatArray(p), this.events = new Array(p);
    }
    return g.prototype.getPropertyId = function() {
      return t.event << 24;
    }, g.prototype.getFrameCount = function() {
      return this.frames.length;
    }, g.prototype.setFrame = function(p, A) {
      this.frames[p] = A.time, this.events[p] = A;
    }, g.prototype.apply = function(p, A, P, k, O, E, V) {
      if (k != null) {
        var N = this.frames, I = this.frames.length;
        if (A > P)
          this.apply(p, A, Number.MAX_VALUE, k, O, E, V), A = -1;
        else if (A >= N[I - 1])
          return;
        if (!(P < N[0])) {
          var y = 0;
          if (A < N[0])
            y = 0;
          else {
            y = r.binarySearch(N, A);
            for (var R = N[y]; y > 0 && N[y - 1] == R; )
              y--;
          }
          for (; y < I && P >= N[y]; y++)
            k.push(this.events[y]);
        }
      }
    }, g;
  })();
  c.EventTimeline = l;
  var m = (function() {
    function g(p) {
      this.frames = c.Utils.newFloatArray(p), this.drawOrders = new Array(p);
    }
    return g.prototype.getPropertyId = function() {
      return t.drawOrder << 24;
    }, g.prototype.getFrameCount = function() {
      return this.frames.length;
    }, g.prototype.setFrame = function(p, A, P) {
      this.frames[p] = A, this.drawOrders[p] = P;
    }, g.prototype.apply = function(p, A, P, k, O, E, V) {
      var N = p.drawOrder, I = p.slots;
      if (V == a.mixOut) {
        E == M.setup && c.Utils.arrayCopy(p.slots, 0, p.drawOrder, 0, p.slots.length);
        return;
      }
      var y = this.frames;
      if (P < y[0]) {
        (E == M.setup || E == M.first) && c.Utils.arrayCopy(p.slots, 0, p.drawOrder, 0, p.slots.length);
        return;
      }
      var R = 0;
      P >= y[y.length - 1] ? R = y.length - 1 : R = r.binarySearch(y, P) - 1;
      var B = this.drawOrders[R];
      if (B == null)
        c.Utils.arrayCopy(I, 0, N, 0, I.length);
      else
        for (var w = 0, Z = B.length; w < Z; w++)
          N[w] = I[B[w]];
    }, g;
  })();
  c.DrawOrderTimeline = m;
  var C = (function(g) {
    Q(p, g);
    function p(A) {
      var P = g.call(this, A) || this;
      return P.frames = c.Utils.newFloatArray(A * p.ENTRIES), P;
    }
    return p.prototype.getPropertyId = function() {
      return (t.ikConstraint << 24) + this.ikConstraintIndex;
    }, p.prototype.setFrame = function(A, P, k, O, E, V, N) {
      A *= p.ENTRIES, this.frames[A] = P, this.frames[A + p.MIX] = k, this.frames[A + p.SOFTNESS] = O, this.frames[A + p.BEND_DIRECTION] = E, this.frames[A + p.COMPRESS] = V ? 1 : 0, this.frames[A + p.STRETCH] = N ? 1 : 0;
    }, p.prototype.apply = function(A, P, k, O, E, V, N) {
      var I = this.frames, y = A.ikConstraints[this.ikConstraintIndex];
      if (y.active) {
        if (k < I[0]) {
          switch (V) {
            case M.setup:
              y.mix = y.data.mix, y.softness = y.data.softness, y.bendDirection = y.data.bendDirection, y.compress = y.data.compress, y.stretch = y.data.stretch;
              return;
            case M.first:
              y.mix += (y.data.mix - y.mix) * E, y.softness += (y.data.softness - y.softness) * E, y.bendDirection = y.data.bendDirection, y.compress = y.data.compress, y.stretch = y.data.stretch;
          }
          return;
        }
        if (k >= I[I.length - p.ENTRIES]) {
          V == M.setup ? (y.mix = y.data.mix + (I[I.length + p.PREV_MIX] - y.data.mix) * E, y.softness = y.data.softness + (I[I.length + p.PREV_SOFTNESS] - y.data.softness) * E, N == a.mixOut ? (y.bendDirection = y.data.bendDirection, y.compress = y.data.compress, y.stretch = y.data.stretch) : (y.bendDirection = I[I.length + p.PREV_BEND_DIRECTION], y.compress = I[I.length + p.PREV_COMPRESS] != 0, y.stretch = I[I.length + p.PREV_STRETCH] != 0)) : (y.mix += (I[I.length + p.PREV_MIX] - y.mix) * E, y.softness += (I[I.length + p.PREV_SOFTNESS] - y.softness) * E, N == a.mixIn && (y.bendDirection = I[I.length + p.PREV_BEND_DIRECTION], y.compress = I[I.length + p.PREV_COMPRESS] != 0, y.stretch = I[I.length + p.PREV_STRETCH] != 0));
          return;
        }
        var R = r.binarySearch(I, k, p.ENTRIES), B = I[R + p.PREV_MIX], w = I[R + p.PREV_SOFTNESS], Z = I[R], W = this.getCurvePercent(R / p.ENTRIES - 1, 1 - (k - Z) / (I[R + p.PREV_TIME] - Z));
        V == M.setup ? (y.mix = y.data.mix + (B + (I[R + p.MIX] - B) * W - y.data.mix) * E, y.softness = y.data.softness + (w + (I[R + p.SOFTNESS] - w) * W - y.data.softness) * E, N == a.mixOut ? (y.bendDirection = y.data.bendDirection, y.compress = y.data.compress, y.stretch = y.data.stretch) : (y.bendDirection = I[R + p.PREV_BEND_DIRECTION], y.compress = I[R + p.PREV_COMPRESS] != 0, y.stretch = I[R + p.PREV_STRETCH] != 0)) : (y.mix += (B + (I[R + p.MIX] - B) * W - y.mix) * E, y.softness += (w + (I[R + p.SOFTNESS] - w) * W - y.softness) * E, N == a.mixIn && (y.bendDirection = I[R + p.PREV_BEND_DIRECTION], y.compress = I[R + p.PREV_COMPRESS] != 0, y.stretch = I[R + p.PREV_STRETCH] != 0));
      }
    }, p.ENTRIES = 6, p.PREV_TIME = -6, p.PREV_MIX = -5, p.PREV_SOFTNESS = -4, p.PREV_BEND_DIRECTION = -3, p.PREV_COMPRESS = -2, p.PREV_STRETCH = -1, p.MIX = 1, p.SOFTNESS = 2, p.BEND_DIRECTION = 3, p.COMPRESS = 4, p.STRETCH = 5, p;
  })(i);
  c.IkConstraintTimeline = C;
  var S = (function(g) {
    Q(p, g);
    function p(A) {
      var P = g.call(this, A) || this;
      return P.frames = c.Utils.newFloatArray(A * p.ENTRIES), P;
    }
    return p.prototype.getPropertyId = function() {
      return (t.transformConstraint << 24) + this.transformConstraintIndex;
    }, p.prototype.setFrame = function(A, P, k, O, E, V) {
      A *= p.ENTRIES, this.frames[A] = P, this.frames[A + p.ROTATE] = k, this.frames[A + p.TRANSLATE] = O, this.frames[A + p.SCALE] = E, this.frames[A + p.SHEAR] = V;
    }, p.prototype.apply = function(A, P, k, O, E, V, N) {
      var I = this.frames, y = A.transformConstraints[this.transformConstraintIndex];
      if (y.active) {
        if (k < I[0]) {
          var R = y.data;
          switch (V) {
            case M.setup:
              y.rotateMix = R.rotateMix, y.translateMix = R.translateMix, y.scaleMix = R.scaleMix, y.shearMix = R.shearMix;
              return;
            case M.first:
              y.rotateMix += (R.rotateMix - y.rotateMix) * E, y.translateMix += (R.translateMix - y.translateMix) * E, y.scaleMix += (R.scaleMix - y.scaleMix) * E, y.shearMix += (R.shearMix - y.shearMix) * E;
          }
          return;
        }
        var B = 0, w = 0, Z = 0, W = 0;
        if (k >= I[I.length - p.ENTRIES]) {
          var G = I.length;
          B = I[G + p.PREV_ROTATE], w = I[G + p.PREV_TRANSLATE], Z = I[G + p.PREV_SCALE], W = I[G + p.PREV_SHEAR];
        } else {
          var X = r.binarySearch(I, k, p.ENTRIES);
          B = I[X + p.PREV_ROTATE], w = I[X + p.PREV_TRANSLATE], Z = I[X + p.PREV_SCALE], W = I[X + p.PREV_SHEAR];
          var Y = I[X], U = this.getCurvePercent(X / p.ENTRIES - 1, 1 - (k - Y) / (I[X + p.PREV_TIME] - Y));
          B += (I[X + p.ROTATE] - B) * U, w += (I[X + p.TRANSLATE] - w) * U, Z += (I[X + p.SCALE] - Z) * U, W += (I[X + p.SHEAR] - W) * U;
        }
        if (V == M.setup) {
          var R = y.data;
          y.rotateMix = R.rotateMix + (B - R.rotateMix) * E, y.translateMix = R.translateMix + (w - R.translateMix) * E, y.scaleMix = R.scaleMix + (Z - R.scaleMix) * E, y.shearMix = R.shearMix + (W - R.shearMix) * E;
        } else
          y.rotateMix += (B - y.rotateMix) * E, y.translateMix += (w - y.translateMix) * E, y.scaleMix += (Z - y.scaleMix) * E, y.shearMix += (W - y.shearMix) * E;
      }
    }, p.ENTRIES = 5, p.PREV_TIME = -5, p.PREV_ROTATE = -4, p.PREV_TRANSLATE = -3, p.PREV_SCALE = -2, p.PREV_SHEAR = -1, p.ROTATE = 1, p.TRANSLATE = 2, p.SCALE = 3, p.SHEAR = 4, p;
  })(i);
  c.TransformConstraintTimeline = S;
  var D = (function(g) {
    Q(p, g);
    function p(A) {
      var P = g.call(this, A) || this;
      return P.frames = c.Utils.newFloatArray(A * p.ENTRIES), P;
    }
    return p.prototype.getPropertyId = function() {
      return (t.pathConstraintPosition << 24) + this.pathConstraintIndex;
    }, p.prototype.setFrame = function(A, P, k) {
      A *= p.ENTRIES, this.frames[A] = P, this.frames[A + p.VALUE] = k;
    }, p.prototype.apply = function(A, P, k, O, E, V, N) {
      var I = this.frames, y = A.pathConstraints[this.pathConstraintIndex];
      if (y.active) {
        if (k < I[0]) {
          switch (V) {
            case M.setup:
              y.position = y.data.position;
              return;
            case M.first:
              y.position += (y.data.position - y.position) * E;
          }
          return;
        }
        var R = 0;
        if (k >= I[I.length - p.ENTRIES])
          R = I[I.length + p.PREV_VALUE];
        else {
          var B = r.binarySearch(I, k, p.ENTRIES);
          R = I[B + p.PREV_VALUE];
          var w = I[B], Z = this.getCurvePercent(B / p.ENTRIES - 1, 1 - (k - w) / (I[B + p.PREV_TIME] - w));
          R += (I[B + p.VALUE] - R) * Z;
        }
        V == M.setup ? y.position = y.data.position + (R - y.data.position) * E : y.position += (R - y.position) * E;
      }
    }, p.ENTRIES = 2, p.PREV_TIME = -2, p.PREV_VALUE = -1, p.VALUE = 1, p;
  })(i);
  c.PathConstraintPositionTimeline = D;
  var T = (function(g) {
    Q(p, g);
    function p(A) {
      return g.call(this, A) || this;
    }
    return p.prototype.getPropertyId = function() {
      return (t.pathConstraintSpacing << 24) + this.pathConstraintIndex;
    }, p.prototype.apply = function(A, P, k, O, E, V, N) {
      var I = this.frames, y = A.pathConstraints[this.pathConstraintIndex];
      if (y.active) {
        if (k < I[0]) {
          switch (V) {
            case M.setup:
              y.spacing = y.data.spacing;
              return;
            case M.first:
              y.spacing += (y.data.spacing - y.spacing) * E;
          }
          return;
        }
        var R = 0;
        if (k >= I[I.length - p.ENTRIES])
          R = I[I.length + p.PREV_VALUE];
        else {
          var B = r.binarySearch(I, k, p.ENTRIES);
          R = I[B + p.PREV_VALUE];
          var w = I[B], Z = this.getCurvePercent(B / p.ENTRIES - 1, 1 - (k - w) / (I[B + p.PREV_TIME] - w));
          R += (I[B + p.VALUE] - R) * Z;
        }
        V == M.setup ? y.spacing = y.data.spacing + (R - y.data.spacing) * E : y.spacing += (R - y.spacing) * E;
      }
    }, p;
  })(D);
  c.PathConstraintSpacingTimeline = T;
  var x = (function(g) {
    Q(p, g);
    function p(A) {
      var P = g.call(this, A) || this;
      return P.frames = c.Utils.newFloatArray(A * p.ENTRIES), P;
    }
    return p.prototype.getPropertyId = function() {
      return (t.pathConstraintMix << 24) + this.pathConstraintIndex;
    }, p.prototype.setFrame = function(A, P, k, O) {
      A *= p.ENTRIES, this.frames[A] = P, this.frames[A + p.ROTATE] = k, this.frames[A + p.TRANSLATE] = O;
    }, p.prototype.apply = function(A, P, k, O, E, V, N) {
      var I = this.frames, y = A.pathConstraints[this.pathConstraintIndex];
      if (y.active) {
        if (k < I[0]) {
          switch (V) {
            case M.setup:
              y.rotateMix = y.data.rotateMix, y.translateMix = y.data.translateMix;
              return;
            case M.first:
              y.rotateMix += (y.data.rotateMix - y.rotateMix) * E, y.translateMix += (y.data.translateMix - y.translateMix) * E;
          }
          return;
        }
        var R = 0, B = 0;
        if (k >= I[I.length - p.ENTRIES])
          R = I[I.length + p.PREV_ROTATE], B = I[I.length + p.PREV_TRANSLATE];
        else {
          var w = r.binarySearch(I, k, p.ENTRIES);
          R = I[w + p.PREV_ROTATE], B = I[w + p.PREV_TRANSLATE];
          var Z = I[w], W = this.getCurvePercent(w / p.ENTRIES - 1, 1 - (k - Z) / (I[w + p.PREV_TIME] - Z));
          R += (I[w + p.ROTATE] - R) * W, B += (I[w + p.TRANSLATE] - B) * W;
        }
        V == M.setup ? (y.rotateMix = y.data.rotateMix + (R - y.data.rotateMix) * E, y.translateMix = y.data.translateMix + (B - y.data.translateMix) * E) : (y.rotateMix += (R - y.rotateMix) * E, y.translateMix += (B - y.translateMix) * E);
      }
    }, p.ENTRIES = 3, p.PREV_TIME = -3, p.PREV_ROTATE = -2, p.PREV_TRANSLATE = -1, p.ROTATE = 1, p.TRANSLATE = 2, p;
  })(i);
  c.PathConstraintMixTimeline = x;
})(F || (F = {}));
var F;
(function(c) {
  var r = (function() {
    function e(n) {
      this.tracks = new Array(), this.timeScale = 1, this.unkeyedState = 0, this.events = new Array(), this.listeners = new Array(), this.queue = new a(this), this.propertyIDs = new c.IntSet(), this.animationsChanged = !1, this.trackEntryPool = new c.Pool(function() {
        return new M();
      }), this.data = n;
    }
    return e.prototype.update = function(n) {
      n *= this.timeScale;
      for (var f = this.tracks, h = 0, v = f.length; h < v; h++) {
        var u = f[h];
        if (u != null) {
          u.animationLast = u.nextAnimationLast, u.trackLast = u.nextTrackLast;
          var s = n * u.timeScale;
          if (u.delay > 0) {
            if (u.delay -= s, u.delay > 0)
              continue;
            s = -u.delay, u.delay = 0;
          }
          var o = u.next;
          if (o != null) {
            var d = u.trackLast - o.delay;
            if (d >= 0) {
              for (o.delay = 0, o.trackTime += u.timeScale == 0 ? 0 : (d / u.timeScale + n) * o.timeScale, u.trackTime += s, this.setCurrent(h, o, !0); o.mixingFrom != null; )
                o.mixTime += n, o = o.mixingFrom;
              continue;
            }
          } else if (u.trackLast >= u.trackEnd && u.mixingFrom == null) {
            f[h] = null, this.queue.end(u), this.disposeNext(u);
            continue;
          }
          if (u.mixingFrom != null && this.updateMixingFrom(u, n)) {
            var l = u.mixingFrom;
            for (u.mixingFrom = null, l != null && (l.mixingTo = null); l != null; )
              this.queue.end(l), l = l.mixingFrom;
          }
          u.trackTime += s;
        }
      }
      this.queue.drain();
    }, e.prototype.updateMixingFrom = function(n, f) {
      var h = n.mixingFrom;
      if (h == null)
        return !0;
      var v = this.updateMixingFrom(h, f);
      return h.animationLast = h.nextAnimationLast, h.trackLast = h.nextTrackLast, n.mixTime > 0 && n.mixTime >= n.mixDuration ? ((h.totalAlpha == 0 || n.mixDuration == 0) && (n.mixingFrom = h.mixingFrom, h.mixingFrom != null && (h.mixingFrom.mixingTo = n), n.interruptAlpha = h.interruptAlpha, this.queue.end(h)), v) : (h.trackTime += f * h.timeScale, n.mixTime += f, !1);
    }, e.prototype.apply = function(n) {
      if (n == null)
        throw new Error("skeleton cannot be null.");
      this.animationsChanged && this._animationsChanged();
      for (var f = this.events, h = this.tracks, v = !1, u = 0, s = h.length; u < s; u++) {
        var o = h[u];
        if (!(o == null || o.delay > 0)) {
          v = !0;
          var d = u == 0 ? c.MixBlend.first : o.mixBlend, l = o.alpha;
          o.mixingFrom != null ? l *= this.applyMixingFrom(o, n, d) : o.trackTime >= o.trackEnd && o.next == null && (l = 0);
          var m = o.animationLast, C = o.getAnimationTime(), S = o.animation.timelines.length, D = o.animation.timelines;
          if (u == 0 && l == 1 || d == c.MixBlend.add)
            for (var T = 0; T < S; T++) {
              c.Utils.webkit602BugfixHelper(l, d);
              var x = D[T];
              x instanceof c.AttachmentTimeline ? this.applyAttachmentTimeline(x, n, C, d, !0) : x.apply(n, m, C, f, l, d, c.MixDirection.mixIn);
            }
          else {
            var g = o.timelineMode, p = o.timelinesRotation.length == 0;
            p && c.Utils.setArraySize(o.timelinesRotation, S << 1, null);
            for (var A = o.timelinesRotation, T = 0; T < S; T++) {
              var P = D[T], k = g[T] == e.SUBSEQUENT ? d : c.MixBlend.setup;
              P instanceof c.RotateTimeline ? this.applyRotateTimeline(P, n, C, l, k, A, T << 1, p) : P instanceof c.AttachmentTimeline ? this.applyAttachmentTimeline(P, n, C, d, !0) : (c.Utils.webkit602BugfixHelper(l, d), P.apply(n, m, C, f, l, k, c.MixDirection.mixIn));
            }
          }
          this.queueEvents(o, C), f.length = 0, o.nextAnimationLast = C, o.nextTrackLast = o.trackTime;
        }
      }
      for (var O = this.unkeyedState + e.SETUP, E = n.slots, V = 0, N = n.slots.length; V < N; V++) {
        var I = E[V];
        if (I.attachmentState == O) {
          var y = I.data.attachmentName;
          I.setAttachment(y == null ? null : n.getAttachment(I.data.index, y));
        }
      }
      return this.unkeyedState += 2, this.queue.drain(), v;
    }, e.prototype.applyMixingFrom = function(n, f, h) {
      var v = n.mixingFrom;
      v.mixingFrom != null && this.applyMixingFrom(v, f, h);
      var u = 0;
      n.mixDuration == 0 ? (u = 1, h == c.MixBlend.first && (h = c.MixBlend.setup)) : (u = n.mixTime / n.mixDuration, u > 1 && (u = 1), h != c.MixBlend.first && (h = v.mixBlend));
      var s = u < v.eventThreshold ? this.events : null, o = u < v.attachmentThreshold, d = u < v.drawOrderThreshold, l = v.animationLast, m = v.getAnimationTime(), C = v.animation.timelines.length, S = v.animation.timelines, D = v.alpha * n.interruptAlpha, T = D * (1 - u);
      if (h == c.MixBlend.add)
        for (var x = 0; x < C; x++)
          S[x].apply(f, l, m, s, T, h, c.MixDirection.mixOut);
      else {
        var g = v.timelineMode, p = v.timelineHoldMix, A = v.timelinesRotation.length == 0;
        A && c.Utils.setArraySize(v.timelinesRotation, C << 1, null);
        var P = v.timelinesRotation;
        v.totalAlpha = 0;
        for (var x = 0; x < C; x++) {
          var k = S[x], O = c.MixDirection.mixOut, E = void 0, V = 0;
          switch (g[x]) {
            case e.SUBSEQUENT:
              if (!d && k instanceof c.DrawOrderTimeline)
                continue;
              E = h, V = T;
              break;
            case e.FIRST:
              E = c.MixBlend.setup, V = T;
              break;
            case e.HOLD_SUBSEQUENT:
              E = h, V = D;
              break;
            case e.HOLD_FIRST:
              E = c.MixBlend.setup, V = D;
              break;
            default:
              E = c.MixBlend.setup;
              var N = p[x];
              V = D * Math.max(0, 1 - N.mixTime / N.mixDuration);
              break;
          }
          v.totalAlpha += V, k instanceof c.RotateTimeline ? this.applyRotateTimeline(k, f, m, V, E, P, x << 1, A) : k instanceof c.AttachmentTimeline ? this.applyAttachmentTimeline(k, f, m, E, o) : (c.Utils.webkit602BugfixHelper(V, h), d && k instanceof c.DrawOrderTimeline && E == c.MixBlend.setup && (O = c.MixDirection.mixIn), k.apply(f, l, m, s, V, E, O));
        }
      }
      return n.mixDuration > 0 && this.queueEvents(v, m), this.events.length = 0, v.nextAnimationLast = m, v.nextTrackLast = v.trackTime, u;
    }, e.prototype.applyAttachmentTimeline = function(n, f, h, v, u) {
      var s = f.slots[n.slotIndex];
      if (s.bone.active) {
        var o = n.frames;
        if (h < o[0])
          (v == c.MixBlend.setup || v == c.MixBlend.first) && this.setAttachment(f, s, s.data.attachmentName, u);
        else {
          var d;
          h >= o[o.length - 1] ? d = o.length - 1 : d = c.Animation.binarySearch(o, h) - 1, this.setAttachment(f, s, n.attachmentNames[d], u);
        }
        s.attachmentState <= this.unkeyedState && (s.attachmentState = this.unkeyedState + e.SETUP);
      }
    }, e.prototype.setAttachment = function(n, f, h, v) {
      f.setAttachment(h == null ? null : n.getAttachment(f.data.index, h)), v && (f.attachmentState = this.unkeyedState + e.CURRENT);
    }, e.prototype.applyRotateTimeline = function(n, f, h, v, u, s, o, d) {
      if (d && (s[o] = 0), v == 1) {
        n.apply(f, 0, h, null, 1, u, c.MixDirection.mixIn);
        return;
      }
      var l = n, m = l.frames, C = f.bones[l.boneIndex];
      if (C.active) {
        var S = 0, D = 0;
        if (h < m[0])
          switch (u) {
            case c.MixBlend.setup:
              C.rotation = C.data.rotation;
            default:
              return;
            case c.MixBlend.first:
              S = C.rotation, D = C.data.rotation;
          }
        else if (S = u == c.MixBlend.setup ? C.data.rotation : C.rotation, h >= m[m.length - c.RotateTimeline.ENTRIES])
          D = C.data.rotation + m[m.length + c.RotateTimeline.PREV_ROTATION];
        else {
          var T = c.Animation.binarySearch(m, h, c.RotateTimeline.ENTRIES), x = m[T + c.RotateTimeline.PREV_ROTATION], g = m[T], p = l.getCurvePercent((T >> 1) - 1, 1 - (h - g) / (m[T + c.RotateTimeline.PREV_TIME] - g));
          D = m[T + c.RotateTimeline.ROTATION] - x, D -= (16384 - (16384.499999999996 - D / 360 | 0)) * 360, D = x + D * p + C.data.rotation, D -= (16384 - (16384.499999999996 - D / 360 | 0)) * 360;
        }
        var A = 0, P = D - S;
        if (P -= (16384 - (16384.499999999996 - P / 360 | 0)) * 360, P == 0)
          A = s[o];
        else {
          var k = 0, O = 0;
          d ? (k = 0, O = P) : (k = s[o], O = s[o + 1]);
          var E = P > 0, V = k >= 0;
          c.MathUtils.signum(O) != c.MathUtils.signum(P) && Math.abs(O) <= 90 && (Math.abs(k) > 180 && (k += 360 * c.MathUtils.signum(k)), V = E), A = P + k - k % 360, V != E && (A += 360 * c.MathUtils.signum(k)), s[o] = A;
        }
        s[o + 1] = P, S += A * v, C.rotation = S - (16384 - (16384.499999999996 - S / 360 | 0)) * 360;
      }
    }, e.prototype.queueEvents = function(n, f) {
      for (var h = n.animationStart, v = n.animationEnd, u = v - h, s = n.trackLast % u, o = this.events, d = 0, l = o.length; d < l; d++) {
        var m = o[d];
        if (m.time < s)
          break;
        m.time > v || this.queue.event(n, m);
      }
      var C = !1;
      for (n.loop ? C = u == 0 || s > n.trackTime % u : C = f >= v && n.animationLast < v, C && this.queue.complete(n); d < l; d++) {
        var S = o[d];
        S.time < h || this.queue.event(n, o[d]);
      }
    }, e.prototype.clearTracks = function() {
      var n = this.queue.drainDisabled;
      this.queue.drainDisabled = !0;
      for (var f = 0, h = this.tracks.length; f < h; f++)
        this.clearTrack(f);
      this.tracks.length = 0, this.queue.drainDisabled = n, this.queue.drain();
    }, e.prototype.clearTrack = function(n) {
      if (!(n >= this.tracks.length)) {
        var f = this.tracks[n];
        if (f != null) {
          this.queue.end(f), this.disposeNext(f);
          for (var h = f; ; ) {
            var v = h.mixingFrom;
            if (v == null)
              break;
            this.queue.end(v), h.mixingFrom = null, h.mixingTo = null, h = v;
          }
          this.tracks[f.trackIndex] = null, this.queue.drain();
        }
      }
    }, e.prototype.setCurrent = function(n, f, h) {
      var v = this.expandToIndex(n);
      this.tracks[n] = f, v != null && (h && this.queue.interrupt(v), f.mixingFrom = v, v.mixingTo = f, f.mixTime = 0, v.mixingFrom != null && v.mixDuration > 0 && (f.interruptAlpha *= Math.min(1, v.mixTime / v.mixDuration)), v.timelinesRotation.length = 0), this.queue.start(f);
    }, e.prototype.setAnimation = function(n, f, h) {
      var v = this.data.skeletonData.findAnimation(f);
      if (v == null)
        throw new Error("Animation not found: " + f);
      return this.setAnimationWith(n, v, h);
    }, e.prototype.setAnimationWith = function(n, f, h) {
      if (f == null)
        throw new Error("animation cannot be null.");
      var v = !0, u = this.expandToIndex(n);
      u != null && (u.nextTrackLast == -1 ? (this.tracks[n] = u.mixingFrom, this.queue.interrupt(u), this.queue.end(u), this.disposeNext(u), u = u.mixingFrom, v = !1) : this.disposeNext(u));
      var s = this.trackEntry(n, f, h, u);
      return this.setCurrent(n, s, v), this.queue.drain(), s;
    }, e.prototype.addAnimation = function(n, f, h, v) {
      var u = this.data.skeletonData.findAnimation(f);
      if (u == null)
        throw new Error("Animation not found: " + f);
      return this.addAnimationWith(n, u, h, v);
    }, e.prototype.addAnimationWith = function(n, f, h, v) {
      if (f == null)
        throw new Error("animation cannot be null.");
      var u = this.expandToIndex(n);
      if (u != null)
        for (; u.next != null; )
          u = u.next;
      var s = this.trackEntry(n, f, h, u);
      if (u == null)
        this.setCurrent(n, s, !0), this.queue.drain();
      else if (u.next = s, v <= 0) {
        var o = u.animationEnd - u.animationStart;
        o != 0 ? (u.loop ? v += o * (1 + (u.trackTime / o | 0)) : v += Math.max(o, u.trackTime), v -= this.data.getMix(u.animation, f)) : v = u.trackTime;
      }
      return s.delay = v, s;
    }, e.prototype.setEmptyAnimation = function(n, f) {
      var h = this.setAnimationWith(n, e.emptyAnimation, !1);
      return h.mixDuration = f, h.trackEnd = f, h;
    }, e.prototype.addEmptyAnimation = function(n, f, h) {
      h <= 0 && (h -= f);
      var v = this.addAnimationWith(n, e.emptyAnimation, !1, h);
      return v.mixDuration = f, v.trackEnd = f, v;
    }, e.prototype.setEmptyAnimations = function(n) {
      var f = this.queue.drainDisabled;
      this.queue.drainDisabled = !0;
      for (var h = 0, v = this.tracks.length; h < v; h++) {
        var u = this.tracks[h];
        u != null && this.setEmptyAnimation(u.trackIndex, n);
      }
      this.queue.drainDisabled = f, this.queue.drain();
    }, e.prototype.expandToIndex = function(n) {
      return n < this.tracks.length ? this.tracks[n] : (c.Utils.ensureArrayCapacity(this.tracks, n + 1, null), this.tracks.length = n + 1, null);
    }, e.prototype.trackEntry = function(n, f, h, v) {
      var u = this.trackEntryPool.obtain();
      return u.trackIndex = n, u.animation = f, u.loop = h, u.holdPrevious = !1, u.eventThreshold = 0, u.attachmentThreshold = 0, u.drawOrderThreshold = 0, u.animationStart = 0, u.animationEnd = f.duration, u.animationLast = -1, u.nextAnimationLast = -1, u.delay = 0, u.trackTime = 0, u.trackLast = -1, u.nextTrackLast = -1, u.trackEnd = Number.MAX_VALUE, u.timeScale = 1, u.alpha = 1, u.interruptAlpha = 1, u.mixTime = 0, u.mixDuration = v == null ? 0 : this.data.getMix(v.animation, f), u.mixBlend = c.MixBlend.replace, u;
    }, e.prototype.disposeNext = function(n) {
      for (var f = n.next; f != null; )
        this.queue.dispose(f), f = f.next;
      n.next = null;
    }, e.prototype._animationsChanged = function() {
      this.animationsChanged = !1, this.propertyIDs.clear();
      for (var n = 0, f = this.tracks.length; n < f; n++) {
        var h = this.tracks[n];
        if (h != null) {
          for (; h.mixingFrom != null; )
            h = h.mixingFrom;
          do
            (h.mixingFrom == null || h.mixBlend != c.MixBlend.add) && this.computeHold(h), h = h.mixingTo;
          while (h != null);
        }
      }
    }, e.prototype.computeHold = function(n) {
      var f = n.mixingTo, h = n.animation.timelines, v = n.animation.timelines.length, u = c.Utils.setArraySize(n.timelineMode, v);
      n.timelineHoldMix.length = 0;
      var s = c.Utils.setArraySize(n.timelineHoldMix, v), o = this.propertyIDs;
      if (f != null && f.holdPrevious) {
        for (var d = 0; d < v; d++)
          u[d] = o.add(h[d].getPropertyId()) ? e.HOLD_FIRST : e.HOLD_SUBSEQUENT;
        return;
      }
      t: for (var d = 0; d < v; d++) {
        var l = h[d], m = l.getPropertyId();
        if (!o.add(m))
          u[d] = e.SUBSEQUENT;
        else if (f == null || l instanceof c.AttachmentTimeline || l instanceof c.DrawOrderTimeline || l instanceof c.EventTimeline || !f.animation.hasTimeline(m))
          u[d] = e.FIRST;
        else {
          for (var C = f.mixingTo; C != null; C = C.mixingTo)
            if (!C.animation.hasTimeline(m)) {
              if (n.mixDuration > 0) {
                u[d] = e.HOLD_MIX, s[d] = C;
                continue t;
              }
              break;
            }
          u[d] = e.HOLD_FIRST;
        }
      }
    }, e.prototype.getCurrent = function(n) {
      return n >= this.tracks.length ? null : this.tracks[n];
    }, e.prototype.addListener = function(n) {
      if (n == null)
        throw new Error("listener cannot be null.");
      this.listeners.push(n);
    }, e.prototype.removeListener = function(n) {
      var f = this.listeners.indexOf(n);
      f >= 0 && this.listeners.splice(f, 1);
    }, e.prototype.clearListeners = function() {
      this.listeners.length = 0;
    }, e.prototype.clearListenerNotifications = function() {
      this.queue.clear();
    }, e.emptyAnimation = new c.Animation("<empty>", [], 0), e.SUBSEQUENT = 0, e.FIRST = 1, e.HOLD_SUBSEQUENT = 2, e.HOLD_FIRST = 3, e.HOLD_MIX = 4, e.SETUP = 1, e.CURRENT = 2, e;
  })();
  c.AnimationState = r;
  var M = (function() {
    function e() {
      this.mixBlend = c.MixBlend.replace, this.timelineMode = new Array(), this.timelineHoldMix = new Array(), this.timelinesRotation = new Array();
    }
    return e.prototype.reset = function() {
      this.next = null, this.mixingFrom = null, this.mixingTo = null, this.animation = null, this.listener = null, this.timelineMode.length = 0, this.timelineHoldMix.length = 0, this.timelinesRotation.length = 0;
    }, e.prototype.getAnimationTime = function() {
      if (this.loop) {
        var n = this.animationEnd - this.animationStart;
        return n == 0 ? this.animationStart : this.trackTime % n + this.animationStart;
      }
      return Math.min(this.trackTime + this.animationStart, this.animationEnd);
    }, e.prototype.setAnimationLast = function(n) {
      this.animationLast = n, this.nextAnimationLast = n;
    }, e.prototype.isComplete = function() {
      return this.trackTime >= this.animationEnd - this.animationStart;
    }, e.prototype.resetRotationDirections = function() {
      this.timelinesRotation.length = 0;
    }, e;
  })();
  c.TrackEntry = M;
  var a = (function() {
    function e(n) {
      this.objects = [], this.drainDisabled = !1, this.animState = n;
    }
    return e.prototype.start = function(n) {
      this.objects.push(t.start), this.objects.push(n), this.animState.animationsChanged = !0;
    }, e.prototype.interrupt = function(n) {
      this.objects.push(t.interrupt), this.objects.push(n);
    }, e.prototype.end = function(n) {
      this.objects.push(t.end), this.objects.push(n), this.animState.animationsChanged = !0;
    }, e.prototype.dispose = function(n) {
      this.objects.push(t.dispose), this.objects.push(n);
    }, e.prototype.complete = function(n) {
      this.objects.push(t.complete), this.objects.push(n);
    }, e.prototype.event = function(n, f) {
      this.objects.push(t.event), this.objects.push(n), this.objects.push(f);
    }, e.prototype.drain = function() {
      if (!this.drainDisabled) {
        this.drainDisabled = !0;
        for (var n = this.objects, f = this.animState.listeners, h = 0; h < n.length; h += 2) {
          var v = n[h], u = n[h + 1];
          switch (v) {
            case t.start:
              u.listener != null && u.listener.start && u.listener.start(u);
              for (var s = 0; s < f.length; s++)
                f[s].start && f[s].start(u);
              break;
            case t.interrupt:
              u.listener != null && u.listener.interrupt && u.listener.interrupt(u);
              for (var s = 0; s < f.length; s++)
                f[s].interrupt && f[s].interrupt(u);
              break;
            case t.end:
              u.listener != null && u.listener.end && u.listener.end(u);
              for (var s = 0; s < f.length; s++)
                f[s].end && f[s].end(u);
            case t.dispose:
              u.listener != null && u.listener.dispose && u.listener.dispose(u);
              for (var s = 0; s < f.length; s++)
                f[s].dispose && f[s].dispose(u);
              this.animState.trackEntryPool.free(u);
              break;
            case t.complete:
              u.listener != null && u.listener.complete && u.listener.complete(u);
              for (var s = 0; s < f.length; s++)
                f[s].complete && f[s].complete(u);
              break;
            case t.event:
              var o = n[h++ + 2];
              u.listener != null && u.listener.event && u.listener.event(u, o);
              for (var s = 0; s < f.length; s++)
                f[s].event && f[s].event(u, o);
              break;
          }
        }
        this.clear(), this.drainDisabled = !1;
      }
    }, e.prototype.clear = function() {
      this.objects.length = 0;
    }, e;
  })();
  c.EventQueue = a;
  var t;
  (function(e) {
    e[e.start = 0] = "start", e[e.interrupt = 1] = "interrupt", e[e.end = 2] = "end", e[e.dispose = 3] = "dispose", e[e.complete = 4] = "complete", e[e.event = 5] = "event";
  })(t = c.EventType || (c.EventType = {}));
  var i = (function() {
    function e() {
    }
    return e.prototype.start = function(n) {
    }, e.prototype.interrupt = function(n) {
    }, e.prototype.end = function(n) {
    }, e.prototype.dispose = function(n) {
    }, e.prototype.complete = function(n) {
    }, e.prototype.event = function(n, f) {
    }, e;
  })();
  c.AnimationStateAdapter = i;
})(F || (F = {}));
var F;
(function(c) {
  var r = (function() {
    function M(a) {
      if (this.animationToMixTime = {}, this.defaultMix = 0, a == null)
        throw new Error("skeletonData cannot be null.");
      this.skeletonData = a;
    }
    return M.prototype.setMix = function(a, t, i) {
      var e = this.skeletonData.findAnimation(a);
      if (e == null)
        throw new Error("Animation not found: " + a);
      var n = this.skeletonData.findAnimation(t);
      if (n == null)
        throw new Error("Animation not found: " + t);
      this.setMixWith(e, n, i);
    }, M.prototype.setMixWith = function(a, t, i) {
      if (a == null)
        throw new Error("from cannot be null.");
      if (t == null)
        throw new Error("to cannot be null.");
      var e = a.name + "." + t.name;
      this.animationToMixTime[e] = i;
    }, M.prototype.getMix = function(a, t) {
      var i = a.name + "." + t.name, e = this.animationToMixTime[i];
      return e === void 0 ? this.defaultMix : e;
    }, M;
  })();
  c.AnimationStateData = r;
})(F || (F = {}));
var F;
(function(c) {
  var r = (function() {
    function M(a, t) {
      t === void 0 && (t = ""), this.assets = {}, this.errors = {}, this.toLoad = 0, this.loaded = 0, this.rawDataUris = {}, this.textureLoader = a, this.pathPrefix = t;
    }
    return M.prototype.downloadText = function(a, t, i) {
      var e = new XMLHttpRequest();
      e.overrideMimeType("text/html"), this.rawDataUris[a] && (a = this.rawDataUris[a]), e.open("GET", a, !0), e.onload = function() {
        e.status == 200 ? t(e.responseText) : i(e.status, e.responseText);
      }, e.onerror = function() {
        console.log("Error downloading: " + a), i(e.status, e.responseText);
      }, e.send();
    }, M.prototype.downloadBinary = function(a, t, i) {
      var e = new XMLHttpRequest();
      this.rawDataUris[a] && (a = this.rawDataUris[a]), e.open("GET", a, !0), e.responseType = "arraybuffer", e.onload = function() {
        e.status == 200 ? t(new Uint8Array(e.response)) : i(e.status, e.responseText);
      }, e.onerror = function() {
        i(e.status, e.responseText);
      }, e.send();
    }, M.prototype.setRawDataURI = function(a, t) {
      this.rawDataUris[this.pathPrefix + a] = t;
    }, M.prototype.loadBinary = function(a, t, i) {
      var e = this;
      t === void 0 && (t = null), i === void 0 && (i = null), a = this.pathPrefix + a, this.toLoad++, this.downloadBinary(a, function(n) {
        e.assets[a] = n, t && t(a, n), e.toLoad--, e.loaded++;
      }, function(n, f) {
        e.errors[a] = "Couldn't load binary " + a + ": status " + status + ", " + f, i && i(a, "Couldn't load binary " + a + ": status " + status + ", " + f), e.toLoad--, e.loaded++;
      });
    }, M.prototype.loadText = function(a, t, i) {
      var e = this;
      t === void 0 && (t = null), i === void 0 && (i = null), a = this.pathPrefix + a, this.toLoad++, this.downloadText(a, function(n) {
        e.assets[a] = n, t && t(a, n), e.toLoad--, e.loaded++;
      }, function(n, f) {
        e.errors[a] = "Couldn't load text " + a + ": status " + status + ", " + f, i && i(a, "Couldn't load text " + a + ": status " + status + ", " + f), e.toLoad--, e.loaded++;
      });
    }, M.prototype.loadTexture = function(a, t, i) {
      var e = this;
      t === void 0 && (t = null), i === void 0 && (i = null), a = this.pathPrefix + a;
      var n = a;
      this.toLoad++;
      var f = new Image();
      f.crossOrigin = "anonymous", f.onload = function(h) {
        var v = e.textureLoader(f);
        e.assets[n] = v, e.toLoad--, e.loaded++, t && t(a, f);
      }, f.onerror = function(h) {
        e.errors[a] = "Couldn't load image " + a, e.toLoad--, e.loaded++, i && i(a, "Couldn't load image " + a);
      }, this.rawDataUris[a] && (a = this.rawDataUris[a]), f.src = a;
    }, M.prototype.loadTextureAtlas = function(a, t, i) {
      var e = this;
      t === void 0 && (t = null), i === void 0 && (i = null);
      var n = a.lastIndexOf("/") >= 0 ? a.substring(0, a.lastIndexOf("/")) : "";
      a = this.pathPrefix + a, this.toLoad++, this.downloadText(a, function(f) {
        var h = { count: 0 }, v = new Array();
        try {
          var u = new c.TextureAtlas(f, function(C) {
            v.push(n == "" ? C : n + "/" + C);
            var S = document.createElement("img");
            return S.width = 16, S.height = 16, new c.FakeTexture(S);
          });
        } catch (C) {
          var s = C;
          e.errors[a] = "Couldn't load texture atlas " + a + ": " + s.message, i && i(a, "Couldn't load texture atlas " + a + ": " + s.message), e.toLoad--, e.loaded++;
          return;
        }
        for (var o = function(C) {
          var S = !1;
          e.loadTexture(C, function(D, T) {
            if (h.count++, h.count == v.length)
              if (S)
                e.errors[a] = "Couldn't load texture atlas page " + D + "} of atlas " + a, i && i(a, "Couldn't load texture atlas page " + D + " of atlas " + a), e.toLoad--, e.loaded++;
              else
                try {
                  var x = new c.TextureAtlas(f, function(p) {
                    return e.get(n == "" ? p : n + "/" + p);
                  });
                  e.assets[a] = x, t && t(a, x), e.toLoad--, e.loaded++;
                } catch (p) {
                  var g = p;
                  e.errors[a] = "Couldn't load texture atlas " + a + ": " + g.message, i && i(a, "Couldn't load texture atlas " + a + ": " + g.message), e.toLoad--, e.loaded++;
                }
          }, function(D, T) {
            S = !0, h.count++, h.count == v.length && (e.errors[a] = "Couldn't load texture atlas page " + D + "} of atlas " + a, i && i(a, "Couldn't load texture atlas page " + D + " of atlas " + a), e.toLoad--, e.loaded++);
          });
        }, d = 0, l = v; d < l.length; d++) {
          var m = l[d];
          o(m);
        }
      }, function(f, h) {
        e.errors[a] = "Couldn't load texture atlas " + a + ": status " + status + ", " + h, i && i(a, "Couldn't load texture atlas " + a + ": status " + status + ", " + h), e.toLoad--, e.loaded++;
      });
    }, M.prototype.get = function(a) {
      return a = this.pathPrefix + a, this.assets[a];
    }, M.prototype.remove = function(a) {
      a = this.pathPrefix + a;
      var t = this.assets[a];
      t.dispose && t.dispose(), this.assets[a] = null;
    }, M.prototype.removeAll = function() {
      for (var a in this.assets) {
        var t = this.assets[a];
        t.dispose && t.dispose();
      }
      this.assets = {};
    }, M.prototype.isLoadingComplete = function() {
      return this.toLoad == 0;
    }, M.prototype.getToLoad = function() {
      return this.toLoad;
    }, M.prototype.getLoaded = function() {
      return this.loaded;
    }, M.prototype.dispose = function() {
      this.removeAll();
    }, M.prototype.hasErrors = function() {
      return Object.keys(this.errors).length > 0;
    }, M.prototype.getErrors = function() {
      return this.errors;
    }, M;
  })();
  c.AssetManager = r;
})(F || (F = {}));
var F;
(function(c) {
  var r = (function() {
    function M(a) {
      this.atlas = a;
    }
    return M.prototype.newRegionAttachment = function(a, t, i) {
      var e = this.atlas.findRegion(i);
      if (e == null)
        throw new Error("Region not found in atlas: " + i + " (region attachment: " + t + ")");
      e.renderObject = e;
      var n = new c.RegionAttachment(t);
      return n.setRegion(e), n;
    }, M.prototype.newMeshAttachment = function(a, t, i) {
      var e = this.atlas.findRegion(i);
      if (e == null)
        throw new Error("Region not found in atlas: " + i + " (mesh attachment: " + t + ")");
      e.renderObject = e;
      var n = new c.MeshAttachment(t);
      return n.region = e, n;
    }, M.prototype.newBoundingBoxAttachment = function(a, t) {
      return new c.BoundingBoxAttachment(t);
    }, M.prototype.newPathAttachment = function(a, t) {
      return new c.PathAttachment(t);
    }, M.prototype.newPointAttachment = function(a, t) {
      return new c.PointAttachment(t);
    }, M.prototype.newClippingAttachment = function(a, t) {
      return new c.ClippingAttachment(t);
    }, M;
  })();
  c.AtlasAttachmentLoader = r;
})(F || (F = {}));
var F;
(function(c) {
  (function(r) {
    r[r.Normal = 0] = "Normal", r[r.Additive = 1] = "Additive", r[r.Multiply = 2] = "Multiply", r[r.Screen = 3] = "Screen";
  })(c.BlendMode || (c.BlendMode = {}));
})(F || (F = {}));
var F;
(function(c) {
  var r = (function() {
    function M(a, t, i) {
      if (this.children = new Array(), this.x = 0, this.y = 0, this.rotation = 0, this.scaleX = 0, this.scaleY = 0, this.shearX = 0, this.shearY = 0, this.ax = 0, this.ay = 0, this.arotation = 0, this.ascaleX = 0, this.ascaleY = 0, this.ashearX = 0, this.ashearY = 0, this.appliedValid = !1, this.a = 0, this.b = 0, this.c = 0, this.d = 0, this.worldY = 0, this.worldX = 0, this.sorted = !1, this.active = !1, a == null)
        throw new Error("data cannot be null.");
      if (t == null)
        throw new Error("skeleton cannot be null.");
      this.data = a, this.skeleton = t, this.parent = i, this.setToSetupPose();
    }
    return M.prototype.isActive = function() {
      return this.active;
    }, M.prototype.update = function() {
      this.updateWorldTransformWith(this.x, this.y, this.rotation, this.scaleX, this.scaleY, this.shearX, this.shearY);
    }, M.prototype.updateWorldTransform = function() {
      this.updateWorldTransformWith(this.x, this.y, this.rotation, this.scaleX, this.scaleY, this.shearX, this.shearY);
    }, M.prototype.updateWorldTransformWith = function(a, t, i, e, n, f, h) {
      this.ax = a, this.ay = t, this.arotation = i, this.ascaleX = e, this.ascaleY = n, this.ashearX = f, this.ashearY = h, this.appliedValid = !0;
      var v = this.parent;
      if (v == null) {
        var u = this.skeleton, s = i + 90 + h, o = u.scaleX, d = u.scaleY;
        this.a = c.MathUtils.cosDeg(i + f) * e * o, this.b = c.MathUtils.cosDeg(s) * n * o, this.c = c.MathUtils.sinDeg(i + f) * e * d, this.d = c.MathUtils.sinDeg(s) * n * d, this.worldX = a * o + u.x, this.worldY = t * d + u.y;
        return;
      }
      var l = v.a, m = v.b, C = v.c, S = v.d;
      switch (this.worldX = l * a + m * t + v.worldX, this.worldY = C * a + S * t + v.worldY, this.data.transformMode) {
        case c.TransformMode.Normal: {
          var s = i + 90 + h, D = c.MathUtils.cosDeg(i + f) * e, T = c.MathUtils.cosDeg(s) * n, x = c.MathUtils.sinDeg(i + f) * e, g = c.MathUtils.sinDeg(s) * n;
          this.a = l * D + m * x, this.b = l * T + m * g, this.c = C * D + S * x, this.d = C * T + S * g;
          return;
        }
        case c.TransformMode.OnlyTranslation: {
          var s = i + 90 + h;
          this.a = c.MathUtils.cosDeg(i + f) * e, this.b = c.MathUtils.cosDeg(s) * n, this.c = c.MathUtils.sinDeg(i + f) * e, this.d = c.MathUtils.sinDeg(s) * n;
          break;
        }
        case c.TransformMode.NoRotationOrReflection: {
          var p = l * l + C * C, A = 0;
          p > 1e-4 ? (p = Math.abs(l * S - m * C) / p, l /= this.skeleton.scaleX, C /= this.skeleton.scaleY, m = C * p, S = l * p, A = Math.atan2(C, l) * c.MathUtils.radDeg) : (l = 0, C = 0, A = 90 - Math.atan2(S, m) * c.MathUtils.radDeg);
          var P = i + f - A, k = i + h - A + 90, D = c.MathUtils.cosDeg(P) * e, T = c.MathUtils.cosDeg(k) * n, x = c.MathUtils.sinDeg(P) * e, g = c.MathUtils.sinDeg(k) * n;
          this.a = l * D - m * x, this.b = l * T - m * g, this.c = C * D + S * x, this.d = C * T + S * g;
          break;
        }
        case c.TransformMode.NoScale:
        case c.TransformMode.NoScaleOrReflection: {
          var O = c.MathUtils.cosDeg(i), E = c.MathUtils.sinDeg(i), V = (l * O + m * E) / this.skeleton.scaleX, N = (C * O + S * E) / this.skeleton.scaleY, p = Math.sqrt(V * V + N * N);
          p > 1e-5 && (p = 1 / p), V *= p, N *= p, p = Math.sqrt(V * V + N * N), this.data.transformMode == c.TransformMode.NoScale && l * S - m * C < 0 != (this.skeleton.scaleX < 0 != this.skeleton.scaleY < 0) && (p = -p);
          var I = Math.PI / 2 + Math.atan2(N, V), y = Math.cos(I) * p, R = Math.sin(I) * p, D = c.MathUtils.cosDeg(f) * e, T = c.MathUtils.cosDeg(90 + h) * n, x = c.MathUtils.sinDeg(f) * e, g = c.MathUtils.sinDeg(90 + h) * n;
          this.a = V * D + y * x, this.b = V * T + y * g, this.c = N * D + R * x, this.d = N * T + R * g;
          break;
        }
      }
      this.a *= this.skeleton.scaleX, this.b *= this.skeleton.scaleX, this.c *= this.skeleton.scaleY, this.d *= this.skeleton.scaleY;
    }, M.prototype.setToSetupPose = function() {
      var a = this.data;
      this.x = a.x, this.y = a.y, this.rotation = a.rotation, this.scaleX = a.scaleX, this.scaleY = a.scaleY, this.shearX = a.shearX, this.shearY = a.shearY;
    }, M.prototype.getWorldRotationX = function() {
      return Math.atan2(this.c, this.a) * c.MathUtils.radDeg;
    }, M.prototype.getWorldRotationY = function() {
      return Math.atan2(this.d, this.b) * c.MathUtils.radDeg;
    }, M.prototype.getWorldScaleX = function() {
      return Math.sqrt(this.a * this.a + this.c * this.c);
    }, M.prototype.getWorldScaleY = function() {
      return Math.sqrt(this.b * this.b + this.d * this.d);
    }, M.prototype.updateAppliedTransform = function() {
      this.appliedValid = !0;
      var a = this.parent;
      if (a == null) {
        this.ax = this.worldX, this.ay = this.worldY, this.arotation = Math.atan2(this.c, this.a) * c.MathUtils.radDeg, this.ascaleX = Math.sqrt(this.a * this.a + this.c * this.c), this.ascaleY = Math.sqrt(this.b * this.b + this.d * this.d), this.ashearX = 0, this.ashearY = Math.atan2(this.a * this.b + this.c * this.d, this.a * this.d - this.b * this.c) * c.MathUtils.radDeg;
        return;
      }
      var t = a.a, i = a.b, e = a.c, n = a.d, f = 1 / (t * n - i * e), h = this.worldX - a.worldX, v = this.worldY - a.worldY;
      this.ax = h * n * f - v * i * f, this.ay = v * t * f - h * e * f;
      var u = f * n, s = f * t, o = f * i, d = f * e, l = u * this.a - o * this.c, m = u * this.b - o * this.d, C = s * this.c - d * this.a, S = s * this.d - d * this.b;
      if (this.ashearX = 0, this.ascaleX = Math.sqrt(l * l + C * C), this.ascaleX > 1e-4) {
        var D = l * S - m * C;
        this.ascaleY = D / this.ascaleX, this.ashearY = Math.atan2(l * m + C * S, D) * c.MathUtils.radDeg, this.arotation = Math.atan2(C, l) * c.MathUtils.radDeg;
      } else
        this.ascaleX = 0, this.ascaleY = Math.sqrt(m * m + S * S), this.ashearY = 0, this.arotation = 90 - Math.atan2(S, m) * c.MathUtils.radDeg;
    }, M.prototype.worldToLocal = function(a) {
      var t = this.a, i = this.b, e = this.c, n = this.d, f = 1 / (t * n - i * e), h = a.x - this.worldX, v = a.y - this.worldY;
      return a.x = h * n * f - v * i * f, a.y = v * t * f - h * e * f, a;
    }, M.prototype.localToWorld = function(a) {
      var t = a.x, i = a.y;
      return a.x = t * this.a + i * this.b + this.worldX, a.y = t * this.c + i * this.d + this.worldY, a;
    }, M.prototype.worldToLocalRotation = function(a) {
      var t = c.MathUtils.sinDeg(a), i = c.MathUtils.cosDeg(a);
      return Math.atan2(this.a * t - this.c * i, this.d * i - this.b * t) * c.MathUtils.radDeg + this.rotation - this.shearX;
    }, M.prototype.localToWorldRotation = function(a) {
      a -= this.rotation - this.shearX;
      var t = c.MathUtils.sinDeg(a), i = c.MathUtils.cosDeg(a);
      return Math.atan2(i * this.c + t * this.d, i * this.a + t * this.b) * c.MathUtils.radDeg;
    }, M.prototype.rotateWorld = function(a) {
      var t = this.a, i = this.b, e = this.c, n = this.d, f = c.MathUtils.cosDeg(a), h = c.MathUtils.sinDeg(a);
      this.a = f * t - h * e, this.b = f * i - h * n, this.c = h * t + f * e, this.d = h * i + f * n, this.appliedValid = !1;
    }, M;
  })();
  c.Bone = r;
})(F || (F = {}));
var F;
(function(c) {
  var r = /* @__PURE__ */ (function() {
    function a(t, i, e) {
      if (this.x = 0, this.y = 0, this.rotation = 0, this.scaleX = 1, this.scaleY = 1, this.shearX = 0, this.shearY = 0, this.transformMode = M.Normal, this.skinRequired = !1, this.color = new c.Color(), t < 0)
        throw new Error("index must be >= 0.");
      if (i == null)
        throw new Error("name cannot be null.");
      this.index = t, this.name = i, this.parent = e;
    }
    return a;
  })();
  c.BoneData = r;
  var M;
  (function(a) {
    a[a.Normal = 0] = "Normal", a[a.OnlyTranslation = 1] = "OnlyTranslation", a[a.NoRotationOrReflection = 2] = "NoRotationOrReflection", a[a.NoScale = 3] = "NoScale", a[a.NoScaleOrReflection = 4] = "NoScaleOrReflection";
  })(M = c.TransformMode || (c.TransformMode = {}));
})(F || (F = {}));
var F;
(function(c) {
  var r = /* @__PURE__ */ (function() {
    function M(a, t, i) {
      this.name = a, this.order = t, this.skinRequired = i;
    }
    return M;
  })();
  c.ConstraintData = r;
})(F || (F = {}));
var F;
(function(c) {
  var r = /* @__PURE__ */ (function() {
    function M(a, t) {
      if (t == null)
        throw new Error("data cannot be null.");
      this.time = a, this.data = t;
    }
    return M;
  })();
  c.Event = r;
})(F || (F = {}));
var F;
(function(c) {
  var r = /* @__PURE__ */ (function() {
    function M(a) {
      this.name = a;
    }
    return M;
  })();
  c.EventData = r;
})(F || (F = {}));
var F;
(function(c) {
  var r = (function() {
    function M(a, t) {
      if (this.bendDirection = 0, this.compress = !1, this.stretch = !1, this.mix = 1, this.softness = 0, this.active = !1, a == null)
        throw new Error("data cannot be null.");
      if (t == null)
        throw new Error("skeleton cannot be null.");
      this.data = a, this.mix = a.mix, this.softness = a.softness, this.bendDirection = a.bendDirection, this.compress = a.compress, this.stretch = a.stretch, this.bones = new Array();
      for (var i = 0; i < a.bones.length; i++)
        this.bones.push(t.findBone(a.bones[i].name));
      this.target = t.findBone(a.target.name);
    }
    return M.prototype.isActive = function() {
      return this.active;
    }, M.prototype.apply = function() {
      this.update();
    }, M.prototype.update = function() {
      var a = this.target, t = this.bones;
      switch (t.length) {
        case 1:
          this.apply1(t[0], a.worldX, a.worldY, this.compress, this.stretch, this.data.uniform, this.mix);
          break;
        case 2:
          this.apply2(t[0], t[1], a.worldX, a.worldY, this.bendDirection, this.stretch, this.softness, this.mix);
          break;
      }
    }, M.prototype.apply1 = function(a, t, i, e, n, f, h) {
      a.appliedValid || a.updateAppliedTransform();
      var v = a.parent, u = v.a, s = v.b, o = v.c, d = v.d, l = -a.ashearX - a.arotation, m = 0, C = 0;
      switch (a.data.transformMode) {
        case c.TransformMode.OnlyTranslation:
          m = t - a.worldX, C = i - a.worldY;
          break;
        case c.TransformMode.NoRotationOrReflection:
          var S = Math.abs(u * d - s * o) / (u * u + o * o), D = u / a.skeleton.scaleX, T = o / a.skeleton.scaleY;
          s = -T * S * a.skeleton.scaleX, d = D * S * a.skeleton.scaleY, l += Math.atan2(T, D) * c.MathUtils.radDeg;
        default:
          var x = t - v.worldX, g = i - v.worldY, p = u * d - s * o;
          m = (x * d - g * s) / p - a.ax, C = (g * u - x * o) / p - a.ay;
      }
      l += Math.atan2(C, m) * c.MathUtils.radDeg, a.ascaleX < 0 && (l += 180), l > 180 ? l -= 360 : l < -180 && (l += 360);
      var A = a.ascaleX, P = a.ascaleY;
      if (e || n) {
        switch (a.data.transformMode) {
          case c.TransformMode.NoScale:
          case c.TransformMode.NoScaleOrReflection:
            m = t - a.worldX, C = i - a.worldY;
        }
        var k = a.data.length * A, O = Math.sqrt(m * m + C * C);
        if (e && O < k || n && O > k && k > 1e-4) {
          var S = (O / k - 1) * h + 1;
          A *= S, f && (P *= S);
        }
      }
      a.updateWorldTransformWith(a.ax, a.ay, a.arotation + l * h, A, P, a.ashearX, a.ashearY);
    }, M.prototype.apply2 = function(a, t, i, e, n, f, h, v) {
      if (v == 0) {
        t.updateWorldTransform();
        return;
      }
      a.appliedValid || a.updateAppliedTransform(), t.appliedValid || t.updateAppliedTransform();
      var u = a.ax, s = a.ay, o = a.ascaleX, d = o, l = a.ascaleY, m = t.ascaleX, C = 0, S = 0, D = 0;
      o < 0 ? (o = -o, C = 180, D = -1) : (C = 0, D = 1), l < 0 && (l = -l, D = -D), m < 0 ? (m = -m, S = 180) : S = 0;
      var T = t.ax, x = 0, g = 0, p = 0, A = a.a, P = a.b, k = a.c, O = a.d, E = Math.abs(o - l) <= 1e-4;
      E ? (x = t.ay, g = A * T + P * x + a.worldX, p = k * T + O * x + a.worldY) : (x = 0, g = A * T + a.worldX, p = k * T + a.worldY);
      var V = a.parent;
      A = V.a, P = V.b, k = V.c, O = V.d;
      var N = 1 / (A * O - P * k), I = g - V.worldX, y = p - V.worldY, R = (I * O - y * P) * N - u, B = (y * A - I * k) * N - s, w = Math.sqrt(R * R + B * B), Z = t.data.length * m, W, G;
      if (w < 1e-4) {
        this.apply1(a, i, e, !1, f, !1, v), t.updateWorldTransformWith(T, x, 0, t.ascaleX, t.ascaleY, t.ashearX, t.ashearY);
        return;
      }
      I = i - V.worldX, y = e - V.worldY;
      var X = (I * O - y * P) * N - u, Y = (y * A - I * k) * N - s, U = X * X + Y * Y;
      if (h != 0) {
        h *= o * (m + 1) / 2;
        var L = Math.sqrt(U), j = L - w - Z * o + h;
        if (j > 0) {
          var z = Math.min(1, j / (h * 2)) - 1;
          z = (j - h * (1 - z * z)) / L, X -= z * X, Y -= z * Y, U = X * X + Y * Y;
        }
      }
      t: if (E) {
        Z *= o;
        var _ = (U - w * w - Z * Z) / (2 * w * Z);
        _ < -1 ? _ = -1 : _ > 1 && (_ = 1, f && (d *= (Math.sqrt(U) / (w + Z) - 1) * v + 1)), G = Math.acos(_) * n, A = w + Z * _, P = Z * Math.sin(G), W = Math.atan2(Y * A - X * P, X * A + Y * P);
      } else {
        A = o * Z, P = l * Z;
        var H = A * A, q = P * P, b = Math.atan2(Y, X);
        k = q * w * w + H * U - H * q;
        var J = -2 * q * w, it = q - H;
        if (O = J * J - 4 * it * k, O >= 0) {
          var rt = Math.sqrt(O);
          J < 0 && (rt = -rt), rt = -(J + rt) / 2;
          var lt = rt / it, ut = k / rt, nt = Math.abs(lt) < Math.abs(ut) ? lt : ut;
          if (nt * nt <= U) {
            y = Math.sqrt(U - nt * nt) * n, W = b - Math.atan2(y, nt), G = Math.atan2(y / l, (nt - w) / o);
            break t;
          }
        }
        var ct = c.MathUtils.PI, at = w - A, st = at * at, tt = 0, yt = 0, Mt = w + A, St = Mt * Mt, Ct = 0;
        k = -A * w / (H - q), k >= -1 && k <= 1 && (k = Math.acos(k), I = A * Math.cos(k) + w, y = P * Math.sin(k), O = I * I + y * y, O < st && (ct = k, st = O, at = I, tt = y), O > St && (yt = k, St = O, Mt = I, Ct = y)), U <= (st + St) / 2 ? (W = b - Math.atan2(tt * n, at), G = ct * n) : (W = b - Math.atan2(Ct * n, Mt), G = yt * n);
      }
      var gt = Math.atan2(x, T) * D, vt = a.arotation;
      W = (W - gt) * c.MathUtils.radDeg + C - vt, W > 180 ? W -= 360 : W < -180 && (W += 360), a.updateWorldTransformWith(u, s, vt + W * v, d, a.ascaleY, 0, 0), vt = t.arotation, G = ((G + gt) * c.MathUtils.radDeg - t.ashearX) * D + S - vt, G > 180 ? G -= 360 : G < -180 && (G += 360), t.updateWorldTransformWith(T, x, vt + G * v, t.ascaleX, t.ascaleY, t.ashearX, t.ashearY);
    }, M;
  })();
  c.IkConstraint = r;
})(F || (F = {}));
var F;
(function(c) {
  var r = (function(M) {
    Q(a, M);
    function a(t) {
      var i = M.call(this, t, 0, !1) || this;
      return i.bones = new Array(), i.bendDirection = 1, i.compress = !1, i.stretch = !1, i.uniform = !1, i.mix = 1, i.softness = 0, i;
    }
    return a;
  })(c.ConstraintData);
  c.IkConstraintData = r;
})(F || (F = {}));
var F;
(function(c) {
  var r = (function() {
    function M(a, t) {
      if (this.position = 0, this.spacing = 0, this.rotateMix = 0, this.translateMix = 0, this.spaces = new Array(), this.positions = new Array(), this.world = new Array(), this.curves = new Array(), this.lengths = new Array(), this.segments = new Array(), this.active = !1, a == null)
        throw new Error("data cannot be null.");
      if (t == null)
        throw new Error("skeleton cannot be null.");
      this.data = a, this.bones = new Array();
      for (var i = 0, e = a.bones.length; i < e; i++)
        this.bones.push(t.findBone(a.bones[i].name));
      this.target = t.findSlot(a.target.name), this.position = a.position, this.spacing = a.spacing, this.rotateMix = a.rotateMix, this.translateMix = a.translateMix;
    }
    return M.prototype.isActive = function() {
      return this.active;
    }, M.prototype.apply = function() {
      this.update();
    }, M.prototype.update = function() {
      var a = this.target.getAttachment();
      if (a instanceof c.PathAttachment) {
        var t = this.rotateMix, i = this.translateMix, e = i > 0, n = t > 0;
        if (!(!e && !n)) {
          var f = this.data, h = f.spacingMode == c.SpacingMode.Percent, v = f.rotateMode, u = v == c.RotateMode.Tangent, s = v == c.RotateMode.ChainScale, o = this.bones.length, d = u ? o : o + 1, l = this.bones, m = c.Utils.setArraySize(this.spaces, d), C = null, S = this.spacing;
          if (s || !h) {
            s && (C = c.Utils.setArraySize(this.lengths, o));
            for (var D = f.spacingMode == c.SpacingMode.Length, T = 0, x = d - 1; T < x; ) {
              var g = l[T], p = g.data.length;
              if (p < M.epsilon)
                s && (C[T] = 0), m[++T] = 0;
              else if (h) {
                if (s) {
                  var A = p * g.a, P = p * g.c, k = Math.sqrt(A * A + P * P);
                  C[T] = k;
                }
                m[++T] = S;
              } else {
                var A = p * g.a, P = p * g.c, O = Math.sqrt(A * A + P * P);
                s && (C[T] = O), m[++T] = (D ? p + S : S) * O / p;
              }
            }
          } else
            for (var T = 1; T < d; T++)
              m[T] = S;
          var E = this.computeWorldPositions(a, d, u, f.positionMode == c.PositionMode.Percent, h), V = E[0], N = E[1], I = f.offsetRotation, y = !1;
          if (I == 0)
            y = v == c.RotateMode.Chain;
          else {
            y = !1;
            var R = this.target.bone;
            I *= R.a * R.d - R.b * R.c > 0 ? c.MathUtils.degRad : -c.MathUtils.degRad;
          }
          for (var T = 0, R = 3; T < o; T++, R += 3) {
            var g = l[T];
            g.worldX += (V - g.worldX) * i, g.worldY += (N - g.worldY) * i;
            var A = E[R], P = E[R + 1], B = A - V, w = P - N;
            if (s) {
              var Z = C[T];
              if (Z != 0) {
                var W = (Math.sqrt(B * B + w * w) / Z - 1) * t + 1;
                g.a *= W, g.c *= W;
              }
            }
            if (V = A, N = P, n) {
              var G = g.a, X = g.b, Y = g.c, U = g.d, L = 0, j = 0, z = 0;
              if (u ? L = E[R - 1] : m[T + 1] == 0 ? L = E[R + 2] : L = Math.atan2(w, B), L -= Math.atan2(Y, G), y) {
                j = Math.cos(L), z = Math.sin(L);
                var _ = g.data.length;
                V += (_ * (j * G - z * Y) - B) * t, N += (_ * (z * G + j * Y) - w) * t;
              } else
                L += I;
              L > c.MathUtils.PI ? L -= c.MathUtils.PI2 : L < -c.MathUtils.PI && (L += c.MathUtils.PI2), L *= t, j = Math.cos(L), z = Math.sin(L), g.a = j * G - z * Y, g.b = j * X - z * U, g.c = z * G + j * Y, g.d = z * X + j * U;
            }
            g.appliedValid = !1;
          }
        }
      }
    }, M.prototype.computeWorldPositions = function(a, t, i, e, n) {
      var f = this.target, h = this.position, v = this.spaces, u = c.Utils.setArraySize(this.positions, t * 3 + 2), s = null, o = a.closed, d = a.worldVerticesLength, l = d / 6, m = M.NONE;
      if (!a.constantSpeed) {
        var C = a.lengths;
        l -= o ? 1 : 2;
        var S = C[l];
        if (e && (h *= S), n)
          for (var D = 1; D < t; D++)
            v[D] *= S;
        s = c.Utils.setArraySize(this.world, 8);
        for (var D = 0, T = 0, x = 0; D < t; D++, T += 3) {
          var g = v[D];
          h += g;
          var p = h;
          if (o)
            p %= S, p < 0 && (p += S), x = 0;
          else if (p < 0) {
            m != M.BEFORE && (m = M.BEFORE, a.computeWorldVertices(f, 2, 4, s, 0, 2)), this.addBeforePosition(p, s, 0, u, T);
            continue;
          } else if (p > S) {
            m != M.AFTER && (m = M.AFTER, a.computeWorldVertices(f, d - 6, 4, s, 0, 2)), this.addAfterPosition(p - S, s, 0, u, T);
            continue;
          }
          for (; ; x++) {
            var A = C[x];
            if (!(p > A)) {
              if (x == 0)
                p /= A;
              else {
                var P = C[x - 1];
                p = (p - P) / (A - P);
              }
              break;
            }
          }
          x != m && (m = x, o && x == l ? (a.computeWorldVertices(f, d - 4, 4, s, 0, 2), a.computeWorldVertices(f, 0, 4, s, 4, 2)) : a.computeWorldVertices(f, x * 6 + 2, 8, s, 0, 2)), this.addCurvePosition(p, s[0], s[1], s[2], s[3], s[4], s[5], s[6], s[7], u, T, i || D > 0 && g == 0);
        }
        return u;
      }
      o ? (d += 2, s = c.Utils.setArraySize(this.world, d), a.computeWorldVertices(f, 2, d - 4, s, 0, 2), a.computeWorldVertices(f, 0, 2, s, d - 4, 2), s[d - 2] = s[0], s[d - 1] = s[1]) : (l--, d -= 4, s = c.Utils.setArraySize(this.world, d), a.computeWorldVertices(f, 2, d, s, 0, 2));
      for (var k = c.Utils.setArraySize(this.curves, l), O = 0, E = s[0], V = s[1], N = 0, I = 0, y = 0, R = 0, B = 0, w = 0, Z = 0, W = 0, G = 0, X = 0, Y = 0, U = 0, L = 0, j = 0, D = 0, z = 2; D < l; D++, z += 6)
        N = s[z], I = s[z + 1], y = s[z + 2], R = s[z + 3], B = s[z + 4], w = s[z + 5], Z = (E - N * 2 + y) * 0.1875, W = (V - I * 2 + R) * 0.1875, G = ((N - y) * 3 - E + B) * 0.09375, X = ((I - R) * 3 - V + w) * 0.09375, Y = Z * 2 + G, U = W * 2 + X, L = (N - E) * 0.75 + Z + G * 0.16666667, j = (I - V) * 0.75 + W + X * 0.16666667, O += Math.sqrt(L * L + j * j), L += Y, j += U, Y += G, U += X, O += Math.sqrt(L * L + j * j), L += Y, j += U, O += Math.sqrt(L * L + j * j), L += Y + G, j += U + X, O += Math.sqrt(L * L + j * j), k[D] = O, E = B, V = w;
      if (e ? h *= O : h *= O / a.lengths[l - 1], n)
        for (var D = 1; D < t; D++)
          v[D] *= O;
      for (var _ = this.segments, H = 0, D = 0, T = 0, x = 0, q = 0; D < t; D++, T += 3) {
        var g = v[D];
        h += g;
        var p = h;
        if (o)
          p %= O, p < 0 && (p += O), x = 0;
        else if (p < 0) {
          this.addBeforePosition(p, s, 0, u, T);
          continue;
        } else if (p > O) {
          this.addAfterPosition(p - O, s, d - 4, u, T);
          continue;
        }
        for (; ; x++) {
          var b = k[x];
          if (!(p > b)) {
            if (x == 0)
              p /= b;
            else {
              var P = k[x - 1];
              p = (p - P) / (b - P);
            }
            break;
          }
        }
        if (x != m) {
          m = x;
          var J = x * 6;
          for (E = s[J], V = s[J + 1], N = s[J + 2], I = s[J + 3], y = s[J + 4], R = s[J + 5], B = s[J + 6], w = s[J + 7], Z = (E - N * 2 + y) * 0.03, W = (V - I * 2 + R) * 0.03, G = ((N - y) * 3 - E + B) * 6e-3, X = ((I - R) * 3 - V + w) * 6e-3, Y = Z * 2 + G, U = W * 2 + X, L = (N - E) * 0.3 + Z + G * 0.16666667, j = (I - V) * 0.3 + W + X * 0.16666667, H = Math.sqrt(L * L + j * j), _[0] = H, J = 1; J < 8; J++)
            L += Y, j += U, Y += G, U += X, H += Math.sqrt(L * L + j * j), _[J] = H;
          L += Y, j += U, H += Math.sqrt(L * L + j * j), _[8] = H, L += Y + G, j += U + X, H += Math.sqrt(L * L + j * j), _[9] = H, q = 0;
        }
        for (p *= H; ; q++) {
          var it = _[q];
          if (!(p > it)) {
            if (q == 0)
              p /= it;
            else {
              var P = _[q - 1];
              p = q + (p - P) / (it - P);
            }
            break;
          }
        }
        this.addCurvePosition(p * 0.1, E, V, N, I, y, R, B, w, u, T, i || D > 0 && g == 0);
      }
      return u;
    }, M.prototype.addBeforePosition = function(a, t, i, e, n) {
      var f = t[i], h = t[i + 1], v = t[i + 2] - f, u = t[i + 3] - h, s = Math.atan2(u, v);
      e[n] = f + a * Math.cos(s), e[n + 1] = h + a * Math.sin(s), e[n + 2] = s;
    }, M.prototype.addAfterPosition = function(a, t, i, e, n) {
      var f = t[i + 2], h = t[i + 3], v = f - t[i], u = h - t[i + 1], s = Math.atan2(u, v);
      e[n] = f + a * Math.cos(s), e[n + 1] = h + a * Math.sin(s), e[n + 2] = s;
    }, M.prototype.addCurvePosition = function(a, t, i, e, n, f, h, v, u, s, o, d) {
      if (a == 0 || isNaN(a)) {
        s[o] = t, s[o + 1] = i, s[o + 2] = Math.atan2(n - i, e - t);
        return;
      }
      var l = a * a, m = l * a, C = 1 - a, S = C * C, D = S * C, T = C * a, x = T * 3, g = C * x, p = x * a, A = t * D + e * g + f * p + v * m, P = i * D + n * g + h * p + u * m;
      s[o] = A, s[o + 1] = P, d && (a < 1e-3 ? s[o + 2] = Math.atan2(n - i, e - t) : s[o + 2] = Math.atan2(P - (i * S + n * T * 2 + h * l), A - (t * S + e * T * 2 + f * l)));
    }, M.NONE = -1, M.BEFORE = -2, M.AFTER = -3, M.epsilon = 1e-5, M;
  })();
  c.PathConstraint = r;
})(F || (F = {}));
var F;
(function(c) {
  var r = (function(M) {
    Q(a, M);
    function a(t) {
      var i = M.call(this, t, 0, !1) || this;
      return i.bones = new Array(), i;
    }
    return a;
  })(c.ConstraintData);
  c.PathConstraintData = r, (function(M) {
    M[M.Fixed = 0] = "Fixed", M[M.Percent = 1] = "Percent";
  })(c.PositionMode || (c.PositionMode = {})), (function(M) {
    M[M.Length = 0] = "Length", M[M.Fixed = 1] = "Fixed", M[M.Percent = 2] = "Percent";
  })(c.SpacingMode || (c.SpacingMode = {})), (function(M) {
    M[M.Tangent = 0] = "Tangent", M[M.Chain = 1] = "Chain", M[M.ChainScale = 2] = "ChainScale";
  })(c.RotateMode || (c.RotateMode = {}));
})(F || (F = {}));
var F;
(function(c) {
  var r = (function() {
    function a(t) {
      this.toLoad = new Array(), this.assets = {}, this.clientId = t;
    }
    return a.prototype.loaded = function() {
      var t = 0;
      for (var i in this.assets)
        t++;
      return t;
    }, a;
  })(), M = (function() {
    function a(t) {
      t === void 0 && (t = ""), this.clientAssets = {}, this.queuedAssets = {}, this.rawAssets = {}, this.errors = {}, this.pathPrefix = t;
    }
    return a.prototype.queueAsset = function(t, i, e) {
      var n = this.clientAssets[t];
      return n == null && (n = new r(t), this.clientAssets[t] = n), i !== null && (n.textureLoader = i), n.toLoad.push(e), this.queuedAssets[e] === e ? !1 : (this.queuedAssets[e] = e, !0);
    }, a.prototype.loadText = function(t, i) {
      var e = this;
      if (i = this.pathPrefix + i, !!this.queueAsset(t, null, i)) {
        var n = new XMLHttpRequest();
        n.overrideMimeType("text/html"), n.onreadystatechange = function() {
          n.readyState == XMLHttpRequest.DONE && (n.status >= 200 && n.status < 300 ? e.rawAssets[i] = n.responseText : e.errors[i] = "Couldn't load text " + i + ": status " + n.status + ", " + n.responseText);
        }, n.open("GET", i, !0), n.send();
      }
    }, a.prototype.loadJson = function(t, i) {
      var e = this;
      if (i = this.pathPrefix + i, !!this.queueAsset(t, null, i)) {
        var n = new XMLHttpRequest();
        n.overrideMimeType("text/html"), n.onreadystatechange = function() {
          n.readyState == XMLHttpRequest.DONE && (n.status >= 200 && n.status < 300 ? e.rawAssets[i] = JSON.parse(n.responseText) : e.errors[i] = "Couldn't load text " + i + ": status " + n.status + ", " + n.responseText);
        }, n.open("GET", i, !0), n.send();
      }
    }, a.prototype.loadTexture = function(t, i, e) {
      var n = this;
      if (e = this.pathPrefix + e, !!this.queueAsset(t, i, e)) {
        var f = !!(typeof window < "u" && typeof navigator < "u" && window.document), h = !f && typeof importScripts < "u";
        if (h) {
          var v = { mode: "cors" };
          fetch(e, v).then(function(s) {
            return s.ok || (n.errors[e] = "Couldn't load image " + e), s.blob();
          }).then(function(s) {
            return createImageBitmap(s, {
              premultiplyAlpha: "none",
              colorSpaceConversion: "none"
            });
          }).then(function(s) {
            n.rawAssets[e] = s;
          });
        } else {
          var u = new Image();
          u.crossOrigin = "anonymous", u.onload = function(s) {
            n.rawAssets[e] = u;
          }, u.onerror = function(s) {
            n.errors[e] = "Couldn't load image " + e;
          }, u.src = e;
        }
      }
    }, a.prototype.get = function(t, i) {
      i = this.pathPrefix + i;
      var e = this.clientAssets[t];
      return e == null ? !0 : e.assets[i];
    }, a.prototype.updateClientAssets = function(t) {
      for (var i = !!(typeof window < "u" && typeof navigator < "u" && window.document), e = !i && typeof importScripts < "u", n = 0; n < t.toLoad.length; n++) {
        var f = t.toLoad[n], h = t.assets[f];
        if (h == null) {
          var v = this.rawAssets[f];
          if (v == null)
            continue;
          e ? v instanceof ImageBitmap ? t.assets[f] = t.textureLoader(v) : t.assets[f] = v : v instanceof HTMLImageElement ? t.assets[f] = t.textureLoader(v) : t.assets[f] = v;
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
  c.SharedAssetManager = M;
})(F || (F = {}));
var F;
(function(c) {
  var r = (function() {
    function M(a) {
      if (this._updateCache = new Array(), this.updateCacheReset = new Array(), this.time = 0, this.scaleX = 1, this.scaleY = 1, this.x = 0, this.y = 0, a == null)
        throw new Error("data cannot be null.");
      this.data = a, this.bones = new Array();
      for (var t = 0; t < a.bones.length; t++) {
        var i = a.bones[t], e = void 0;
        if (i.parent == null)
          e = new c.Bone(i, this, null);
        else {
          var n = this.bones[i.parent.index];
          e = new c.Bone(i, this, n), n.children.push(e);
        }
        this.bones.push(e);
      }
      this.slots = new Array(), this.drawOrder = new Array();
      for (var t = 0; t < a.slots.length; t++) {
        var f = a.slots[t], e = this.bones[f.boneData.index], h = new c.Slot(f, e);
        this.slots.push(h), this.drawOrder.push(h);
      }
      this.ikConstraints = new Array();
      for (var t = 0; t < a.ikConstraints.length; t++) {
        var v = a.ikConstraints[t];
        this.ikConstraints.push(new c.IkConstraint(v, this));
      }
      this.transformConstraints = new Array();
      for (var t = 0; t < a.transformConstraints.length; t++) {
        var u = a.transformConstraints[t];
        this.transformConstraints.push(new c.TransformConstraint(u, this));
      }
      this.pathConstraints = new Array();
      for (var t = 0; t < a.pathConstraints.length; t++) {
        var s = a.pathConstraints[t];
        this.pathConstraints.push(new c.PathConstraint(s, this));
      }
      this.color = new c.Color(1, 1, 1, 1), this.updateCache();
    }
    return M.prototype.updateCache = function() {
      var a = this._updateCache;
      a.length = 0, this.updateCacheReset.length = 0;
      for (var t = this.bones, i = 0, e = t.length; i < e; i++) {
        var n = t[i];
        n.sorted = n.data.skinRequired, n.active = !n.sorted;
      }
      if (this.skin != null)
        for (var f = this.skin.bones, i = 0, e = this.skin.bones.length; i < e; i++) {
          var n = this.bones[f[i].index];
          do
            n.sorted = !1, n.active = !0, n = n.parent;
          while (n != null);
        }
      var h = this.ikConstraints, v = this.transformConstraints, u = this.pathConstraints, s = h.length, o = v.length, d = u.length, l = s + o + d;
      t: for (var i = 0; i < l; i++) {
        for (var m = 0; m < s; m++) {
          var C = h[m];
          if (C.data.order == i) {
            this.sortIkConstraint(C);
            continue t;
          }
        }
        for (var m = 0; m < o; m++) {
          var C = v[m];
          if (C.data.order == i) {
            this.sortTransformConstraint(C);
            continue t;
          }
        }
        for (var m = 0; m < d; m++) {
          var C = u[m];
          if (C.data.order == i) {
            this.sortPathConstraint(C);
            continue t;
          }
        }
      }
      for (var i = 0, e = t.length; i < e; i++)
        this.sortBone(t[i]);
    }, M.prototype.sortIkConstraint = function(a) {
      if (a.active = a.target.isActive() && (!a.data.skinRequired || this.skin != null && c.Utils.contains(this.skin.constraints, a.data, !0)), !!a.active) {
        var t = a.target;
        this.sortBone(t);
        var i = a.bones, e = i[0];
        if (this.sortBone(e), i.length > 1) {
          var n = i[i.length - 1];
          this._updateCache.indexOf(n) > -1 || this.updateCacheReset.push(n);
        }
        this._updateCache.push(a), this.sortReset(e.children), i[i.length - 1].sorted = !0;
      }
    }, M.prototype.sortPathConstraint = function(a) {
      if (a.active = a.target.bone.isActive() && (!a.data.skinRequired || this.skin != null && c.Utils.contains(this.skin.constraints, a.data, !0)), !!a.active) {
        var t = a.target, i = t.data.index, e = t.bone;
        this.skin != null && this.sortPathConstraintAttachment(this.skin, i, e), this.data.defaultSkin != null && this.data.defaultSkin != this.skin && this.sortPathConstraintAttachment(this.data.defaultSkin, i, e);
        for (var n = 0, f = this.data.skins.length; n < f; n++)
          this.sortPathConstraintAttachment(this.data.skins[n], i, e);
        var h = t.getAttachment();
        h instanceof c.PathAttachment && this.sortPathConstraintAttachmentWith(h, e);
        for (var v = a.bones, u = v.length, n = 0; n < u; n++)
          this.sortBone(v[n]);
        this._updateCache.push(a);
        for (var n = 0; n < u; n++)
          this.sortReset(v[n].children);
        for (var n = 0; n < u; n++)
          v[n].sorted = !0;
      }
    }, M.prototype.sortTransformConstraint = function(a) {
      if (a.active = a.target.isActive() && (!a.data.skinRequired || this.skin != null && c.Utils.contains(this.skin.constraints, a.data, !0)), !!a.active) {
        this.sortBone(a.target);
        var t = a.bones, i = t.length;
        if (a.data.local)
          for (var e = 0; e < i; e++) {
            var n = t[e];
            this.sortBone(n.parent), this._updateCache.indexOf(n) > -1 || this.updateCacheReset.push(n);
          }
        else
          for (var e = 0; e < i; e++)
            this.sortBone(t[e]);
        this._updateCache.push(a);
        for (var f = 0; f < i; f++)
          this.sortReset(t[f].children);
        for (var f = 0; f < i; f++)
          t[f].sorted = !0;
      }
    }, M.prototype.sortPathConstraintAttachment = function(a, t, i) {
      var e = a.attachments[t];
      if (e)
        for (var n in e)
          this.sortPathConstraintAttachmentWith(e[n], i);
    }, M.prototype.sortPathConstraintAttachmentWith = function(a, t) {
      if (a instanceof c.PathAttachment) {
        var i = a.bones;
        if (i == null)
          this.sortBone(t);
        else
          for (var e = this.bones, n = 0; n < i.length; )
            for (var f = i[n++], h = n + f; n < h; n++) {
              var v = i[n];
              this.sortBone(e[v]);
            }
      }
    }, M.prototype.sortBone = function(a) {
      if (!a.sorted) {
        var t = a.parent;
        t != null && this.sortBone(t), a.sorted = !0, this._updateCache.push(a);
      }
    }, M.prototype.sortReset = function(a) {
      for (var t = 0, i = a.length; t < i; t++) {
        var e = a[t];
        e.active && (e.sorted && this.sortReset(e.children), e.sorted = !1);
      }
    }, M.prototype.updateWorldTransform = function() {
      for (var a = this.updateCacheReset, t = 0, i = a.length; t < i; t++) {
        var e = a[t];
        e.ax = e.x, e.ay = e.y, e.arotation = e.rotation, e.ascaleX = e.scaleX, e.ascaleY = e.scaleY, e.ashearX = e.shearX, e.ashearY = e.shearY, e.appliedValid = !0;
      }
      for (var n = this._updateCache, t = 0, i = n.length; t < i; t++)
        n[t].update();
    }, M.prototype.setToSetupPose = function() {
      this.setBonesToSetupPose(), this.setSlotsToSetupPose();
    }, M.prototype.setBonesToSetupPose = function() {
      for (var a = this.bones, t = 0, i = a.length; t < i; t++)
        a[t].setToSetupPose();
      for (var e = this.ikConstraints, t = 0, i = e.length; t < i; t++) {
        var n = e[t];
        n.mix = n.data.mix, n.softness = n.data.softness, n.bendDirection = n.data.bendDirection, n.compress = n.data.compress, n.stretch = n.data.stretch;
      }
      for (var f = this.transformConstraints, t = 0, i = f.length; t < i; t++) {
        var n = f[t], h = n.data;
        n.rotateMix = h.rotateMix, n.translateMix = h.translateMix, n.scaleMix = h.scaleMix, n.shearMix = h.shearMix;
      }
      for (var v = this.pathConstraints, t = 0, i = v.length; t < i; t++) {
        var n = v[t], h = n.data;
        n.position = h.position, n.spacing = h.spacing, n.rotateMix = h.rotateMix, n.translateMix = h.translateMix;
      }
    }, M.prototype.setSlotsToSetupPose = function() {
      var a = this.slots;
      c.Utils.arrayCopy(a, 0, this.drawOrder, 0, a.length);
      for (var t = 0, i = a.length; t < i; t++)
        a[t].setToSetupPose();
    }, M.prototype.getRootBone = function() {
      return this.bones.length == 0 ? null : this.bones[0];
    }, M.prototype.findBone = function(a) {
      if (a == null)
        throw new Error("boneName cannot be null.");
      for (var t = this.bones, i = 0, e = t.length; i < e; i++) {
        var n = t[i];
        if (n.data.name == a)
          return n;
      }
      return null;
    }, M.prototype.findBoneIndex = function(a) {
      if (a == null)
        throw new Error("boneName cannot be null.");
      for (var t = this.bones, i = 0, e = t.length; i < e; i++)
        if (t[i].data.name == a)
          return i;
      return -1;
    }, M.prototype.findSlot = function(a) {
      if (a == null)
        throw new Error("slotName cannot be null.");
      for (var t = this.slots, i = 0, e = t.length; i < e; i++) {
        var n = t[i];
        if (n.data.name == a)
          return n;
      }
      return null;
    }, M.prototype.findSlotIndex = function(a) {
      if (a == null)
        throw new Error("slotName cannot be null.");
      for (var t = this.slots, i = 0, e = t.length; i < e; i++)
        if (t[i].data.name == a)
          return i;
      return -1;
    }, M.prototype.setSkinByName = function(a) {
      var t = this.data.findSkin(a);
      if (t == null)
        throw new Error("Skin not found: " + a);
      this.setSkin(t);
    }, M.prototype.setSkin = function(a) {
      if (a != this.skin) {
        if (a != null)
          if (this.skin != null)
            a.attachAll(this, this.skin);
          else
            for (var t = this.slots, i = 0, e = t.length; i < e; i++) {
              var n = t[i], f = n.data.attachmentName;
              if (f != null) {
                var h = a.getAttachment(i, f);
                h != null && n.setAttachment(h);
              }
            }
        this.skin = a, this.updateCache();
      }
    }, M.prototype.getAttachmentByName = function(a, t) {
      return this.getAttachment(this.data.findSlotIndex(a), t);
    }, M.prototype.getAttachment = function(a, t) {
      if (t == null)
        throw new Error("attachmentName cannot be null.");
      if (this.skin != null) {
        var i = this.skin.getAttachment(a, t);
        if (i != null)
          return i;
      }
      return this.data.defaultSkin != null ? this.data.defaultSkin.getAttachment(a, t) : null;
    }, M.prototype.setAttachment = function(a, t) {
      if (a == null)
        throw new Error("slotName cannot be null.");
      for (var i = this.slots, e = 0, n = i.length; e < n; e++) {
        var f = i[e];
        if (f.data.name == a) {
          var h = null;
          if (t != null && (h = this.getAttachment(e, t), h == null))
            throw new Error("Attachment not found: " + t + ", for slot: " + a);
          f.setAttachment(h);
          return;
        }
      }
      throw new Error("Slot not found: " + a);
    }, M.prototype.findIkConstraint = function(a) {
      if (a == null)
        throw new Error("constraintName cannot be null.");
      for (var t = this.ikConstraints, i = 0, e = t.length; i < e; i++) {
        var n = t[i];
        if (n.data.name == a)
          return n;
      }
      return null;
    }, M.prototype.findTransformConstraint = function(a) {
      if (a == null)
        throw new Error("constraintName cannot be null.");
      for (var t = this.transformConstraints, i = 0, e = t.length; i < e; i++) {
        var n = t[i];
        if (n.data.name == a)
          return n;
      }
      return null;
    }, M.prototype.findPathConstraint = function(a) {
      if (a == null)
        throw new Error("constraintName cannot be null.");
      for (var t = this.pathConstraints, i = 0, e = t.length; i < e; i++) {
        var n = t[i];
        if (n.data.name == a)
          return n;
      }
      return null;
    }, M.prototype.getBounds = function(a, t, i) {
      if (i === void 0 && (i = new Array(2)), a == null)
        throw new Error("offset cannot be null.");
      if (t == null)
        throw new Error("size cannot be null.");
      for (var e = this.drawOrder, n = Number.POSITIVE_INFINITY, f = Number.POSITIVE_INFINITY, h = Number.NEGATIVE_INFINITY, v = Number.NEGATIVE_INFINITY, u = 0, s = e.length; u < s; u++) {
        var o = e[u];
        if (o.bone.active) {
          var d = 0, l = null, m = o.getAttachment();
          if (m instanceof c.RegionAttachment)
            d = 8, l = c.Utils.setArraySize(i, d, 0), m.computeWorldVertices(o.bone, l, 0, 2);
          else if (m instanceof c.MeshAttachment) {
            var C = m;
            d = C.worldVerticesLength, l = c.Utils.setArraySize(i, d, 0), C.computeWorldVertices(o, 0, d, l, 0, 2);
          }
          if (l != null)
            for (var S = 0, D = l.length; S < D; S += 2) {
              var T = l[S], x = l[S + 1];
              n = Math.min(n, T), f = Math.min(f, x), h = Math.max(h, T), v = Math.max(v, x);
            }
        }
      }
      a.set(n, f), t.set(h - n, v - f);
    }, M.prototype.update = function(a) {
      this.time += a;
    }, M;
  })();
  c.Skeleton = r;
})(F || (F = {}));
var F;
(function(c) {
  var r = (function() {
    function i(e) {
      this.scale = 1, this.linkedMeshes = new Array(), this.attachmentLoader = e;
    }
    return i.prototype.readSkeletonData = function(e) {
      var n = this.scale, f = new c.SkeletonData();
      f.name = "";
      var h = new M(e);
      if (f.hash = h.readString(), f.version = h.readString(), f.version == "3.8.75")
        throw new Error("Unsupported skeleton data, please export with a newer version of Spine.");
      f.x = h.readFloat(), f.y = h.readFloat(), f.width = h.readFloat(), f.height = h.readFloat();
      var v = h.readBoolean();
      v && (f.fps = h.readFloat(), f.imagesPath = h.readString(), f.audioPath = h.readString());
      var u = 0;
      u = h.readInt(!0);
      for (var s = 0; s < u; s++)
        h.strings.push(h.readString());
      u = h.readInt(!0);
      for (var s = 0; s < u; s++) {
        var o = h.readString(), d = s == 0 ? null : f.bones[h.readInt(!0)], l = new c.BoneData(s, o, d);
        l.rotation = h.readFloat(), l.x = h.readFloat() * n, l.y = h.readFloat() * n, l.scaleX = h.readFloat(), l.scaleY = h.readFloat(), l.shearX = h.readFloat(), l.shearY = h.readFloat(), l.length = h.readFloat() * n, l.transformMode = i.TransformModeValues[h.readInt(!0)], l.skinRequired = h.readBoolean(), v && c.Color.rgba8888ToColor(l.color, h.readInt32()), f.bones.push(l);
      }
      u = h.readInt(!0);
      for (var s = 0; s < u; s++) {
        var m = h.readString(), C = f.bones[h.readInt(!0)], l = new c.SlotData(s, m, C);
        c.Color.rgba8888ToColor(l.color, h.readInt32());
        var S = h.readInt32();
        S != -1 && c.Color.rgb888ToColor(l.darkColor = new c.Color(), S), l.attachmentName = h.readStringRef(), l.blendMode = i.BlendModeValues[h.readInt(!0)], f.slots.push(l);
      }
      u = h.readInt(!0);
      for (var s = 0, D = void 0; s < u; s++) {
        var l = new c.IkConstraintData(h.readString());
        l.order = h.readInt(!0), l.skinRequired = h.readBoolean(), D = h.readInt(!0);
        for (var T = 0; T < D; T++)
          l.bones.push(f.bones[h.readInt(!0)]);
        l.target = f.bones[h.readInt(!0)], l.mix = h.readFloat(), l.softness = h.readFloat() * n, l.bendDirection = h.readByte(), l.compress = h.readBoolean(), l.stretch = h.readBoolean(), l.uniform = h.readBoolean(), f.ikConstraints.push(l);
      }
      u = h.readInt(!0);
      for (var s = 0, D = void 0; s < u; s++) {
        var l = new c.TransformConstraintData(h.readString());
        l.order = h.readInt(!0), l.skinRequired = h.readBoolean(), D = h.readInt(!0);
        for (var T = 0; T < D; T++)
          l.bones.push(f.bones[h.readInt(!0)]);
        l.target = f.bones[h.readInt(!0)], l.local = h.readBoolean(), l.relative = h.readBoolean(), l.offsetRotation = h.readFloat(), l.offsetX = h.readFloat() * n, l.offsetY = h.readFloat() * n, l.offsetScaleX = h.readFloat(), l.offsetScaleY = h.readFloat(), l.offsetShearY = h.readFloat(), l.rotateMix = h.readFloat(), l.translateMix = h.readFloat(), l.scaleMix = h.readFloat(), l.shearMix = h.readFloat(), f.transformConstraints.push(l);
      }
      u = h.readInt(!0);
      for (var s = 0, D = void 0; s < u; s++) {
        var l = new c.PathConstraintData(h.readString());
        l.order = h.readInt(!0), l.skinRequired = h.readBoolean(), D = h.readInt(!0);
        for (var T = 0; T < D; T++)
          l.bones.push(f.bones[h.readInt(!0)]);
        l.target = f.slots[h.readInt(!0)], l.positionMode = i.PositionModeValues[h.readInt(!0)], l.spacingMode = i.SpacingModeValues[h.readInt(!0)], l.rotateMode = i.RotateModeValues[h.readInt(!0)], l.offsetRotation = h.readFloat(), l.position = h.readFloat(), l.positionMode == c.PositionMode.Fixed && (l.position *= n), l.spacing = h.readFloat(), (l.spacingMode == c.SpacingMode.Length || l.spacingMode == c.SpacingMode.Fixed) && (l.spacing *= n), l.rotateMix = h.readFloat(), l.translateMix = h.readFloat(), f.pathConstraints.push(l);
      }
      var x = this.readSkin(h, f, !0, v);
      x != null && (f.defaultSkin = x, f.skins.push(x));
      {
        var s = f.skins.length;
        for (c.Utils.setArraySize(f.skins, u = s + h.readInt(!0)); s < u; s++)
          f.skins[s] = this.readSkin(h, f, !1, v);
      }
      u = this.linkedMeshes.length;
      for (var s = 0; s < u; s++) {
        var g = this.linkedMeshes[s], p = g.skin == null ? f.defaultSkin : f.findSkin(g.skin);
        if (p == null)
          throw new Error("Skin not found: " + g.skin);
        var A = p.getAttachment(g.slotIndex, g.parent);
        if (A == null)
          throw new Error("Parent mesh not found: " + g.parent);
        g.mesh.deformAttachment = g.inheritDeform ? A : g.mesh, g.mesh.setParentMesh(A), g.mesh.updateUVs();
      }
      this.linkedMeshes.length = 0, u = h.readInt(!0);
      for (var s = 0; s < u; s++) {
        var l = new c.EventData(h.readStringRef());
        l.intValue = h.readInt(!1), l.floatValue = h.readFloat(), l.stringValue = h.readString(), l.audioPath = h.readString(), l.audioPath != null && (l.volume = h.readFloat(), l.balance = h.readFloat()), f.events.push(l);
      }
      u = h.readInt(!0);
      for (var s = 0; s < u; s++)
        f.animations.push(this.readAnimation(h, h.readString(), f));
      return f;
    }, i.prototype.readSkin = function(e, n, f, h) {
      var v = null, u = 0;
      if (f) {
        if (u = e.readInt(!0), u == 0)
          return null;
        v = new c.Skin("default");
      } else {
        v = new c.Skin(e.readStringRef()), v.bones.length = e.readInt(!0);
        for (var s = 0, o = v.bones.length; s < o; s++)
          v.bones[s] = n.bones[e.readInt(!0)];
        for (var s = 0, o = e.readInt(!0); s < o; s++)
          v.constraints.push(n.ikConstraints[e.readInt(!0)]);
        for (var s = 0, o = e.readInt(!0); s < o; s++)
          v.constraints.push(n.transformConstraints[e.readInt(!0)]);
        for (var s = 0, o = e.readInt(!0); s < o; s++)
          v.constraints.push(n.pathConstraints[e.readInt(!0)]);
        u = e.readInt(!0);
      }
      for (var s = 0; s < u; s++)
        for (var d = e.readInt(!0), l = 0, m = e.readInt(!0); l < m; l++) {
          var C = e.readStringRef(), S = this.readAttachment(e, n, v, d, C, h);
          S != null && v.setAttachment(d, C, S);
        }
      return v;
    }, i.prototype.readAttachment = function(e, n, f, h, v, u) {
      var s = this.scale, o = e.readStringRef();
      o == null && (o = v);
      var d = e.readByte(), l = i.AttachmentTypeValues[d];
      switch (l) {
        case c.AttachmentType.Region: {
          var m = e.readStringRef(), C = e.readFloat(), S = e.readFloat(), D = e.readFloat(), T = e.readFloat(), x = e.readFloat(), g = e.readFloat(), p = e.readFloat(), A = e.readInt32();
          m == null && (m = o);
          var P = this.attachmentLoader.newRegionAttachment(f, o, m);
          return P == null ? null : (P.path = m, P.x = S * s, P.y = D * s, P.scaleX = T, P.scaleY = x, P.rotation = C, P.width = g * s, P.height = p * s, c.Color.rgba8888ToColor(P.color, A), P.updateOffset(), P);
        }
        case c.AttachmentType.BoundingBox: {
          var k = e.readInt(!0), O = this.readVertices(e, k), A = u ? e.readInt32() : 0, E = this.attachmentLoader.newBoundingBoxAttachment(f, o);
          return E == null ? null : (E.worldVerticesLength = k << 1, E.vertices = O.vertices, E.bones = O.bones, u && c.Color.rgba8888ToColor(E.color, A), E);
        }
        case c.AttachmentType.Mesh: {
          var m = e.readStringRef(), A = e.readInt32(), k = e.readInt(!0), V = this.readFloatArray(e, k << 1, 1), N = this.readShortArray(e), O = this.readVertices(e, k), I = e.readInt(!0), y = null, g = 0, p = 0;
          u && (y = this.readShortArray(e), g = e.readFloat(), p = e.readFloat()), m == null && (m = o);
          var R = this.attachmentLoader.newMeshAttachment(f, o, m);
          return R == null ? null : (R.path = m, c.Color.rgba8888ToColor(R.color, A), R.bones = O.bones, R.vertices = O.vertices, R.worldVerticesLength = k << 1, R.triangles = N, R.regionUVs = V, R.updateUVs(), R.hullLength = I << 1, u && (R.edges = y, R.width = g * s, R.height = p * s), R);
        }
        case c.AttachmentType.LinkedMesh: {
          var m = e.readStringRef(), A = e.readInt32(), B = e.readStringRef(), w = e.readStringRef(), Z = e.readBoolean(), g = 0, p = 0;
          u && (g = e.readFloat(), p = e.readFloat()), m == null && (m = o);
          var R = this.attachmentLoader.newMeshAttachment(f, o, m);
          return R == null ? null : (R.path = m, c.Color.rgba8888ToColor(R.color, A), u && (R.width = g * s, R.height = p * s), this.linkedMeshes.push(new a(R, B, h, w, Z)), R);
        }
        case c.AttachmentType.Path: {
          for (var W = e.readBoolean(), G = e.readBoolean(), k = e.readInt(!0), O = this.readVertices(e, k), X = c.Utils.newArray(k / 3, 0), Y = 0, U = X.length; Y < U; Y++)
            X[Y] = e.readFloat() * s;
          var A = u ? e.readInt32() : 0, m = this.attachmentLoader.newPathAttachment(f, o);
          return m == null ? null : (m.closed = W, m.constantSpeed = G, m.worldVerticesLength = k << 1, m.vertices = O.vertices, m.bones = O.bones, m.lengths = X, u && c.Color.rgba8888ToColor(m.color, A), m);
        }
        case c.AttachmentType.Point: {
          var C = e.readFloat(), S = e.readFloat(), D = e.readFloat(), A = u ? e.readInt32() : 0, L = this.attachmentLoader.newPointAttachment(f, o);
          return L == null ? null : (L.x = S * s, L.y = D * s, L.rotation = C, u && c.Color.rgba8888ToColor(L.color, A), L);
        }
        case c.AttachmentType.Clipping: {
          var j = e.readInt(!0), k = e.readInt(!0), O = this.readVertices(e, k), A = u ? e.readInt32() : 0, z = this.attachmentLoader.newClippingAttachment(f, o);
          return z == null ? null : (z.endSlot = n.slots[j], z.worldVerticesLength = k << 1, z.vertices = O.vertices, z.bones = O.bones, u && c.Color.rgba8888ToColor(z.color, A), z);
        }
      }
      return null;
    }, i.prototype.readVertices = function(e, n) {
      var f = n << 1, h = new t(), v = this.scale;
      if (!e.readBoolean())
        return h.vertices = this.readFloatArray(e, f, v), h;
      for (var u = new Array(), s = new Array(), o = 0; o < n; o++) {
        var d = e.readInt(!0);
        s.push(d);
        for (var l = 0; l < d; l++)
          s.push(e.readInt(!0)), u.push(e.readFloat() * v), u.push(e.readFloat() * v), u.push(e.readFloat());
      }
      return h.vertices = c.Utils.toFloatArray(u), h.bones = s, h;
    }, i.prototype.readFloatArray = function(e, n, f) {
      var h = new Array(n);
      if (f == 1)
        for (var v = 0; v < n; v++)
          h[v] = e.readFloat();
      else
        for (var v = 0; v < n; v++)
          h[v] = e.readFloat() * f;
      return h;
    }, i.prototype.readShortArray = function(e) {
      for (var n = e.readInt(!0), f = new Array(n), h = 0; h < n; h++)
        f[h] = e.readShort();
      return f;
    }, i.prototype.readAnimation = function(e, n, f) {
      for (var h = new Array(), v = this.scale, u = 0, s = new c.Color(), o = new c.Color(), d = 0, l = e.readInt(!0); d < l; d++)
        for (var m = e.readInt(!0), C = 0, S = e.readInt(!0); C < S; C++) {
          var D = e.readByte(), T = e.readInt(!0);
          switch (D) {
            case i.SLOT_ATTACHMENT: {
              var x = new c.AttachmentTimeline(T);
              x.slotIndex = m;
              for (var g = 0; g < T; g++)
                x.setFrame(g, e.readFloat(), e.readStringRef());
              h.push(x), u = Math.max(u, x.frames[T - 1]);
              break;
            }
            case i.SLOT_COLOR: {
              var x = new c.ColorTimeline(T);
              x.slotIndex = m;
              for (var g = 0; g < T; g++) {
                var p = e.readFloat();
                c.Color.rgba8888ToColor(s, e.readInt32()), x.setFrame(g, p, s.r, s.g, s.b, s.a), g < T - 1 && this.readCurve(e, g, x);
              }
              h.push(x), u = Math.max(u, x.frames[(T - 1) * c.ColorTimeline.ENTRIES]);
              break;
            }
            case i.SLOT_TWO_COLOR: {
              var x = new c.TwoColorTimeline(T);
              x.slotIndex = m;
              for (var g = 0; g < T; g++) {
                var p = e.readFloat();
                c.Color.rgba8888ToColor(s, e.readInt32()), c.Color.rgb888ToColor(o, e.readInt32()), x.setFrame(g, p, s.r, s.g, s.b, s.a, o.r, o.g, o.b), g < T - 1 && this.readCurve(e, g, x);
              }
              h.push(x), u = Math.max(u, x.frames[(T - 1) * c.TwoColorTimeline.ENTRIES]);
              break;
            }
          }
        }
      for (var d = 0, l = e.readInt(!0); d < l; d++)
        for (var A = e.readInt(!0), C = 0, S = e.readInt(!0); C < S; C++) {
          var D = e.readByte(), T = e.readInt(!0);
          switch (D) {
            case i.BONE_ROTATE: {
              var x = new c.RotateTimeline(T);
              x.boneIndex = A;
              for (var g = 0; g < T; g++)
                x.setFrame(g, e.readFloat(), e.readFloat()), g < T - 1 && this.readCurve(e, g, x);
              h.push(x), u = Math.max(u, x.frames[(T - 1) * c.RotateTimeline.ENTRIES]);
              break;
            }
            case i.BONE_TRANSLATE:
            case i.BONE_SCALE:
            case i.BONE_SHEAR: {
              var x = void 0, P = 1;
              D == i.BONE_SCALE ? x = new c.ScaleTimeline(T) : D == i.BONE_SHEAR ? x = new c.ShearTimeline(T) : (x = new c.TranslateTimeline(T), P = v), x.boneIndex = A;
              for (var g = 0; g < T; g++)
                x.setFrame(g, e.readFloat(), e.readFloat() * P, e.readFloat() * P), g < T - 1 && this.readCurve(e, g, x);
              h.push(x), u = Math.max(u, x.frames[(T - 1) * c.TranslateTimeline.ENTRIES]);
              break;
            }
          }
        }
      for (var d = 0, l = e.readInt(!0); d < l; d++) {
        var k = e.readInt(!0), T = e.readInt(!0), x = new c.IkConstraintTimeline(T);
        x.ikConstraintIndex = k;
        for (var g = 0; g < T; g++)
          x.setFrame(g, e.readFloat(), e.readFloat(), e.readFloat() * v, e.readByte(), e.readBoolean(), e.readBoolean()), g < T - 1 && this.readCurve(e, g, x);
        h.push(x), u = Math.max(u, x.frames[(T - 1) * c.IkConstraintTimeline.ENTRIES]);
      }
      for (var d = 0, l = e.readInt(!0); d < l; d++) {
        var k = e.readInt(!0), T = e.readInt(!0), x = new c.TransformConstraintTimeline(T);
        x.transformConstraintIndex = k;
        for (var g = 0; g < T; g++)
          x.setFrame(g, e.readFloat(), e.readFloat(), e.readFloat(), e.readFloat(), e.readFloat()), g < T - 1 && this.readCurve(e, g, x);
        h.push(x), u = Math.max(u, x.frames[(T - 1) * c.TransformConstraintTimeline.ENTRIES]);
      }
      for (var d = 0, l = e.readInt(!0); d < l; d++)
        for (var k = e.readInt(!0), O = f.pathConstraints[k], C = 0, S = e.readInt(!0); C < S; C++) {
          var D = e.readByte(), T = e.readInt(!0);
          switch (D) {
            case i.PATH_POSITION:
            case i.PATH_SPACING: {
              var x = void 0, P = 1;
              D == i.PATH_SPACING ? (x = new c.PathConstraintSpacingTimeline(T), (O.spacingMode == c.SpacingMode.Length || O.spacingMode == c.SpacingMode.Fixed) && (P = v)) : (x = new c.PathConstraintPositionTimeline(T), O.positionMode == c.PositionMode.Fixed && (P = v)), x.pathConstraintIndex = k;
              for (var g = 0; g < T; g++)
                x.setFrame(g, e.readFloat(), e.readFloat() * P), g < T - 1 && this.readCurve(e, g, x);
              h.push(x), u = Math.max(u, x.frames[(T - 1) * c.PathConstraintPositionTimeline.ENTRIES]);
              break;
            }
            case i.PATH_MIX: {
              var x = new c.PathConstraintMixTimeline(T);
              x.pathConstraintIndex = k;
              for (var g = 0; g < T; g++)
                x.setFrame(g, e.readFloat(), e.readFloat(), e.readFloat()), g < T - 1 && this.readCurve(e, g, x);
              h.push(x), u = Math.max(u, x.frames[(T - 1) * c.PathConstraintMixTimeline.ENTRIES]);
              break;
            }
          }
        }
      for (var d = 0, l = e.readInt(!0); d < l; d++)
        for (var E = f.skins[e.readInt(!0)], C = 0, S = e.readInt(!0); C < S; C++)
          for (var m = e.readInt(!0), V = 0, N = e.readInt(!0); V < N; V++) {
            var I = E.getAttachment(m, e.readStringRef()), y = I.bones != null, R = I.vertices, B = y ? R.length / 3 * 2 : R.length, T = e.readInt(!0), x = new c.DeformTimeline(T);
            x.slotIndex = m, x.attachment = I;
            for (var g = 0; g < T; g++) {
              var p = e.readFloat(), w = void 0, Z = e.readInt(!0);
              if (Z == 0)
                w = y ? c.Utils.newFloatArray(B) : R;
              else {
                w = c.Utils.newFloatArray(B);
                var W = e.readInt(!0);
                if (Z += W, v == 1)
                  for (var G = W; G < Z; G++)
                    w[G] = e.readFloat();
                else
                  for (var G = W; G < Z; G++)
                    w[G] = e.readFloat() * v;
                if (!y)
                  for (var G = 0, X = w.length; G < X; G++)
                    w[G] += R[G];
              }
              x.setFrame(g, p, w), g < T - 1 && this.readCurve(e, g, x);
            }
            h.push(x), u = Math.max(u, x.frames[T - 1]);
          }
      var Y = e.readInt(!0);
      if (Y > 0) {
        for (var x = new c.DrawOrderTimeline(Y), U = f.slots.length, d = 0; d < Y; d++) {
          for (var p = e.readFloat(), L = e.readInt(!0), j = c.Utils.newArray(U, 0), C = U - 1; C >= 0; C--)
            j[C] = -1;
          for (var z = c.Utils.newArray(U - L, 0), _ = 0, H = 0, C = 0; C < L; C++) {
            for (var m = e.readInt(!0); _ != m; )
              z[H++] = _++;
            j[_ + e.readInt(!0)] = _++;
          }
          for (; _ < U; )
            z[H++] = _++;
          for (var C = U - 1; C >= 0; C--)
            j[C] == -1 && (j[C] = z[--H]);
          x.setFrame(d, p, j);
        }
        h.push(x), u = Math.max(u, x.frames[Y - 1]);
      }
      var q = e.readInt(!0);
      if (q > 0) {
        for (var x = new c.EventTimeline(q), d = 0; d < q; d++) {
          var p = e.readFloat(), b = f.events[e.readInt(!0)], J = new c.Event(p, b);
          J.intValue = e.readInt(!1), J.floatValue = e.readFloat(), J.stringValue = e.readBoolean() ? e.readString() : b.stringValue, J.data.audioPath != null && (J.volume = e.readFloat(), J.balance = e.readFloat()), x.setFrame(d, J);
        }
        h.push(x), u = Math.max(u, x.frames[q - 1]);
      }
      return new c.Animation(n, h, u);
    }, i.prototype.readCurve = function(e, n, f) {
      switch (e.readByte()) {
        case i.CURVE_STEPPED:
          f.setStepped(n);
          break;
        case i.CURVE_BEZIER:
          this.setCurve(f, n, e.readFloat(), e.readFloat(), e.readFloat(), e.readFloat());
          break;
      }
    }, i.prototype.setCurve = function(e, n, f, h, v, u) {
      e.setCurve(n, f, h, v, u);
    }, i.AttachmentTypeValues = [0, 1, 2, 3, 4, 5, 6], i.TransformModeValues = [c.TransformMode.Normal, c.TransformMode.OnlyTranslation, c.TransformMode.NoRotationOrReflection, c.TransformMode.NoScale, c.TransformMode.NoScaleOrReflection], i.PositionModeValues = [c.PositionMode.Fixed, c.PositionMode.Percent], i.SpacingModeValues = [c.SpacingMode.Length, c.SpacingMode.Fixed, c.SpacingMode.Percent], i.RotateModeValues = [c.RotateMode.Tangent, c.RotateMode.Chain, c.RotateMode.ChainScale], i.BlendModeValues = [c.BlendMode.Normal, c.BlendMode.Additive, c.BlendMode.Multiply, c.BlendMode.Screen], i.BONE_ROTATE = 0, i.BONE_TRANSLATE = 1, i.BONE_SCALE = 2, i.BONE_SHEAR = 3, i.SLOT_ATTACHMENT = 0, i.SLOT_COLOR = 1, i.SLOT_TWO_COLOR = 2, i.PATH_POSITION = 0, i.PATH_SPACING = 1, i.PATH_MIX = 2, i.CURVE_LINEAR = 0, i.CURVE_STEPPED = 1, i.CURVE_BEZIER = 2, i;
  })();
  c.SkeletonBinary = r;
  var M = (function() {
    function i(e, n, f, h) {
      n === void 0 && (n = new Array()), f === void 0 && (f = 0), h === void 0 && (h = new DataView(e.buffer)), this.strings = n, this.index = f, this.buffer = h;
    }
    return i.prototype.readByte = function() {
      return this.buffer.getInt8(this.index++);
    }, i.prototype.readShort = function() {
      var e = this.buffer.getInt16(this.index);
      return this.index += 2, e;
    }, i.prototype.readInt32 = function() {
      var e = this.buffer.getInt32(this.index);
      return this.index += 4, e;
    }, i.prototype.readInt = function(e) {
      var n = this.readByte(), f = n & 127;
      return (n & 128) != 0 && (n = this.readByte(), f |= (n & 127) << 7, (n & 128) != 0 && (n = this.readByte(), f |= (n & 127) << 14, (n & 128) != 0 && (n = this.readByte(), f |= (n & 127) << 21, (n & 128) != 0 && (n = this.readByte(), f |= (n & 127) << 28)))), e ? f : f >>> 1 ^ -(f & 1);
    }, i.prototype.readStringRef = function() {
      var e = this.readInt(!0);
      return e == 0 ? null : this.strings[e - 1];
    }, i.prototype.readString = function() {
      var e = this.readInt(!0);
      switch (e) {
        case 0:
          return null;
        case 1:
          return "";
      }
      e--;
      for (var n = "", f = 0; f < e; ) {
        var h = this.readByte();
        switch (h >> 4) {
          case 12:
          case 13:
            n += String.fromCharCode((h & 31) << 6 | this.readByte() & 63), f += 2;
            break;
          case 14:
            n += String.fromCharCode((h & 15) << 12 | (this.readByte() & 63) << 6 | this.readByte() & 63), f += 3;
            break;
          default:
            n += String.fromCharCode(h), f++;
        }
      }
      return n;
    }, i.prototype.readFloat = function() {
      var e = this.buffer.getFloat32(this.index);
      return this.index += 4, e;
    }, i.prototype.readBoolean = function() {
      return this.readByte() != 0;
    }, i;
  })(), a = /* @__PURE__ */ (function() {
    function i(e, n, f, h, v) {
      this.mesh = e, this.skin = n, this.slotIndex = f, this.parent = h, this.inheritDeform = v;
    }
    return i;
  })(), t = /* @__PURE__ */ (function() {
    function i(e, n) {
      e === void 0 && (e = null), n === void 0 && (n = null), this.bones = e, this.vertices = n;
    }
    return i;
  })();
})(F || (F = {}));
var F;
(function(c) {
  var r = (function() {
    function M() {
      this.minX = 0, this.minY = 0, this.maxX = 0, this.maxY = 0, this.boundingBoxes = new Array(), this.polygons = new Array(), this.polygonPool = new c.Pool(function() {
        return c.Utils.newFloatArray(16);
      });
    }
    return M.prototype.update = function(a, t) {
      if (a == null)
        throw new Error("skeleton cannot be null.");
      var i = this.boundingBoxes, e = this.polygons, n = this.polygonPool, f = a.slots, h = f.length;
      i.length = 0, n.freeAll(e), e.length = 0;
      for (var v = 0; v < h; v++) {
        var u = f[v];
        if (u.bone.active) {
          var s = u.getAttachment();
          if (s instanceof c.BoundingBoxAttachment) {
            var o = s;
            i.push(o);
            var d = n.obtain();
            d.length != o.worldVerticesLength && (d = c.Utils.newFloatArray(o.worldVerticesLength)), e.push(d), o.computeWorldVertices(u, 0, o.worldVerticesLength, d, 0, 2);
          }
        }
      }
      t ? this.aabbCompute() : (this.minX = Number.POSITIVE_INFINITY, this.minY = Number.POSITIVE_INFINITY, this.maxX = Number.NEGATIVE_INFINITY, this.maxY = Number.NEGATIVE_INFINITY);
    }, M.prototype.aabbCompute = function() {
      for (var a = Number.POSITIVE_INFINITY, t = Number.POSITIVE_INFINITY, i = Number.NEGATIVE_INFINITY, e = Number.NEGATIVE_INFINITY, n = this.polygons, f = 0, h = n.length; f < h; f++)
        for (var v = n[f], u = v, s = 0, o = v.length; s < o; s += 2) {
          var d = u[s], l = u[s + 1];
          a = Math.min(a, d), t = Math.min(t, l), i = Math.max(i, d), e = Math.max(e, l);
        }
      this.minX = a, this.minY = t, this.maxX = i, this.maxY = e;
    }, M.prototype.aabbContainsPoint = function(a, t) {
      return a >= this.minX && a <= this.maxX && t >= this.minY && t <= this.maxY;
    }, M.prototype.aabbIntersectsSegment = function(a, t, i, e) {
      var n = this.minX, f = this.minY, h = this.maxX, v = this.maxY;
      if (a <= n && i <= n || t <= f && e <= f || a >= h && i >= h || t >= v && e >= v)
        return !1;
      var u = (e - t) / (i - a), s = u * (n - a) + t;
      if (s > f && s < v || (s = u * (h - a) + t, s > f && s < v))
        return !0;
      var o = (f - t) / u + a;
      return o > n && o < h || (o = (v - t) / u + a, o > n && o < h);
    }, M.prototype.aabbIntersectsSkeleton = function(a) {
      return this.minX < a.maxX && this.maxX > a.minX && this.minY < a.maxY && this.maxY > a.minY;
    }, M.prototype.containsPoint = function(a, t) {
      for (var i = this.polygons, e = 0, n = i.length; e < n; e++)
        if (this.containsPointPolygon(i[e], a, t))
          return this.boundingBoxes[e];
      return null;
    }, M.prototype.containsPointPolygon = function(a, t, i) {
      for (var e = a, n = a.length, f = n - 2, h = !1, v = 0; v < n; v += 2) {
        var u = e[v + 1], s = e[f + 1];
        if (u < i && s >= i || s < i && u >= i) {
          var o = e[v];
          o + (i - u) / (s - u) * (e[f] - o) < t && (h = !h);
        }
        f = v;
      }
      return h;
    }, M.prototype.intersectsSegment = function(a, t, i, e) {
      for (var n = this.polygons, f = 0, h = n.length; f < h; f++)
        if (this.intersectsSegmentPolygon(n[f], a, t, i, e))
          return this.boundingBoxes[f];
      return null;
    }, M.prototype.intersectsSegmentPolygon = function(a, t, i, e, n) {
      for (var f = a, h = a.length, v = t - e, u = i - n, s = t * n - i * e, o = f[h - 2], d = f[h - 1], l = 0; l < h; l += 2) {
        var m = f[l], C = f[l + 1], S = o * C - d * m, D = o - m, T = d - C, x = v * T - u * D, g = (s * D - v * S) / x;
        if ((g >= o && g <= m || g >= m && g <= o) && (g >= t && g <= e || g >= e && g <= t)) {
          var p = (s * T - u * S) / x;
          if ((p >= d && p <= C || p >= C && p <= d) && (p >= i && p <= n || p >= n && p <= i))
            return !0;
        }
        o = m, d = C;
      }
      return !1;
    }, M.prototype.getPolygon = function(a) {
      if (a == null)
        throw new Error("boundingBox cannot be null.");
      var t = this.boundingBoxes.indexOf(a);
      return t == -1 ? null : this.polygons[t];
    }, M.prototype.getWidth = function() {
      return this.maxX - this.minX;
    }, M.prototype.getHeight = function() {
      return this.maxY - this.minY;
    }, M;
  })();
  c.SkeletonBounds = r;
})(F || (F = {}));
var F;
(function(c) {
  var r = (function() {
    function M() {
      this.triangulator = new c.Triangulator(), this.clippingPolygon = new Array(), this.clipOutput = new Array(), this.clippedVertices = new Array(), this.clippedTriangles = new Array(), this.scratch = new Array();
    }
    return M.prototype.clipStart = function(a, t) {
      if (this.clipAttachment != null)
        return 0;
      this.clipAttachment = t;
      var i = t.worldVerticesLength, e = c.Utils.setArraySize(this.clippingPolygon, i);
      t.computeWorldVertices(a, 0, i, e, 0, 2);
      var n = this.clippingPolygon;
      M.makeClockwise(n);
      for (var f = this.clippingPolygons = this.triangulator.decompose(n, this.triangulator.triangulate(n)), h = 0, v = f.length; h < v; h++) {
        var u = f[h];
        M.makeClockwise(u), u.push(u[0]), u.push(u[1]);
      }
      return f.length;
    }, M.prototype.clipEndWithSlot = function(a) {
      this.clipAttachment != null && this.clipAttachment.endSlot == a.data && this.clipEnd();
    }, M.prototype.clipEnd = function() {
      this.clipAttachment != null && (this.clipAttachment = null, this.clippingPolygons = null, this.clippedVertices.length = 0, this.clippedTriangles.length = 0, this.clippingPolygon.length = 0);
    }, M.prototype.isClipping = function() {
      return this.clipAttachment != null;
    }, M.prototype.clipTriangles = function(a, t, i, e, n, f, h, v) {
      var u = this.clipOutput, s = this.clippedVertices, o = this.clippedTriangles, d = this.clippingPolygons, l = this.clippingPolygons.length, m = v ? 12 : 8, C = 0;
      s.length = 0, o.length = 0;
      t: for (var S = 0; S < e; S += 3) {
        var D = i[S] << 1, T = a[D], x = a[D + 1], g = n[D], p = n[D + 1];
        D = i[S + 1] << 1;
        var A = a[D], P = a[D + 1], k = n[D], O = n[D + 1];
        D = i[S + 2] << 1;
        for (var E = a[D], V = a[D + 1], N = n[D], I = n[D + 1], y = 0; y < l; y++) {
          var R = s.length;
          if (this.clip(T, x, A, P, E, V, d[y], u)) {
            var B = u.length;
            if (B == 0)
              continue;
            for (var w = P - V, Z = E - A, W = T - E, G = V - x, X = 1 / (w * W + Z * (x - V)), Y = B >> 1, U = this.clipOutput, L = c.Utils.setArraySize(s, R + Y * m), j = 0; j < B; j += 2) {
              var z = U[j], _ = U[j + 1];
              L[R] = z, L[R + 1] = _, L[R + 2] = f.r, L[R + 3] = f.g, L[R + 4] = f.b, L[R + 5] = f.a;
              var H = z - E, q = _ - V, b = (w * H + Z * q) * X, J = (G * H + W * q) * X, it = 1 - b - J;
              L[R + 6] = g * b + k * J + N * it, L[R + 7] = p * b + O * J + I * it, v && (L[R + 8] = h.r, L[R + 9] = h.g, L[R + 10] = h.b, L[R + 11] = h.a), R += m;
            }
            R = o.length;
            var rt = c.Utils.setArraySize(o, R + 3 * (Y - 2));
            Y--;
            for (var j = 1; j < Y; j++)
              rt[R] = C, rt[R + 1] = C + j, rt[R + 2] = C + j + 1, R += 3;
            C += Y + 1;
          } else {
            var L = c.Utils.setArraySize(s, R + 3 * m);
            L[R] = T, L[R + 1] = x, L[R + 2] = f.r, L[R + 3] = f.g, L[R + 4] = f.b, L[R + 5] = f.a, v ? (L[R + 6] = g, L[R + 7] = p, L[R + 8] = h.r, L[R + 9] = h.g, L[R + 10] = h.b, L[R + 11] = h.a, L[R + 12] = A, L[R + 13] = P, L[R + 14] = f.r, L[R + 15] = f.g, L[R + 16] = f.b, L[R + 17] = f.a, L[R + 18] = k, L[R + 19] = O, L[R + 20] = h.r, L[R + 21] = h.g, L[R + 22] = h.b, L[R + 23] = h.a, L[R + 24] = E, L[R + 25] = V, L[R + 26] = f.r, L[R + 27] = f.g, L[R + 28] = f.b, L[R + 29] = f.a, L[R + 30] = N, L[R + 31] = I, L[R + 32] = h.r, L[R + 33] = h.g, L[R + 34] = h.b, L[R + 35] = h.a) : (L[R + 6] = g, L[R + 7] = p, L[R + 8] = A, L[R + 9] = P, L[R + 10] = f.r, L[R + 11] = f.g, L[R + 12] = f.b, L[R + 13] = f.a, L[R + 14] = k, L[R + 15] = O, L[R + 16] = E, L[R + 17] = V, L[R + 18] = f.r, L[R + 19] = f.g, L[R + 20] = f.b, L[R + 21] = f.a, L[R + 22] = N, L[R + 23] = I), R = o.length;
            var rt = c.Utils.setArraySize(o, R + 3);
            rt[R] = C, rt[R + 1] = C + 1, rt[R + 2] = C + 2, C += 3;
            continue t;
          }
        }
      }
    }, M.prototype.clip = function(a, t, i, e, n, f, h, v) {
      var u = v, s = !1, o = null;
      h.length % 4 >= 2 ? (o = v, v = this.scratch) : o = this.scratch, o.length = 0, o.push(a), o.push(t), o.push(i), o.push(e), o.push(n), o.push(f), o.push(a), o.push(t), v.length = 0;
      for (var d = h, l = h.length - 4, m = 0; ; m += 2) {
        for (var C = d[m], S = d[m + 1], D = d[m + 2], T = d[m + 3], x = C - D, g = S - T, p = o, A = o.length - 2, P = v.length, k = 0; k < A; k += 2) {
          var O = p[k], E = p[k + 1], V = p[k + 2], N = p[k + 3], I = x * (N - T) - g * (V - D) > 0;
          if (x * (E - T) - g * (O - D) > 0) {
            if (I) {
              v.push(V), v.push(N);
              continue;
            }
            var y = N - E, R = V - O, B = y * (D - C) - R * (T - S);
            if (Math.abs(B) > 1e-6) {
              var w = (R * (S - E) - y * (C - O)) / B;
              v.push(C + (D - C) * w), v.push(S + (T - S) * w);
            } else
              v.push(C), v.push(S);
          } else if (I) {
            var y = N - E, R = V - O, B = y * (D - C) - R * (T - S);
            if (Math.abs(B) > 1e-6) {
              var w = (R * (S - E) - y * (C - O)) / B;
              v.push(C + (D - C) * w), v.push(S + (T - S) * w);
            } else
              v.push(C), v.push(S);
            v.push(V), v.push(N);
          }
          s = !0;
        }
        if (P == v.length)
          return u.length = 0, !0;
        if (v.push(v[0]), v.push(v[1]), m == l)
          break;
        var Z = v;
        v = o, v.length = 0, o = Z;
      }
      if (u != v) {
        u.length = 0;
        for (var m = 0, W = v.length - 2; m < W; m++)
          u[m] = v[m];
      } else
        u.length = u.length - 2;
      return s;
    }, M.makeClockwise = function(a) {
      for (var t = a, i = a.length, e = t[i - 2] * t[1] - t[0] * t[i - 1], n = 0, f = 0, h = 0, v = 0, u = 0, s = i - 3; u < s; u += 2)
        n = t[u], f = t[u + 1], h = t[u + 2], v = t[u + 3], e += n * v - h * f;
      if (!(e < 0))
        for (var u = 0, o = i - 2, s = i >> 1; u < s; u += 2) {
          var d = t[u], l = t[u + 1], m = o - u;
          t[u] = t[m], t[u + 1] = t[m + 1], t[m] = d, t[m + 1] = l;
        }
    }, M;
  })();
  c.SkeletonClipping = r;
})(F || (F = {}));
var F;
(function(c) {
  var r = (function() {
    function M() {
      this.bones = new Array(), this.slots = new Array(), this.skins = new Array(), this.events = new Array(), this.animations = new Array(), this.ikConstraints = new Array(), this.transformConstraints = new Array(), this.pathConstraints = new Array(), this.fps = 0;
    }
    return M.prototype.findBone = function(a) {
      if (a == null)
        throw new Error("boneName cannot be null.");
      for (var t = this.bones, i = 0, e = t.length; i < e; i++) {
        var n = t[i];
        if (n.name == a)
          return n;
      }
      return null;
    }, M.prototype.findBoneIndex = function(a) {
      if (a == null)
        throw new Error("boneName cannot be null.");
      for (var t = this.bones, i = 0, e = t.length; i < e; i++)
        if (t[i].name == a)
          return i;
      return -1;
    }, M.prototype.findSlot = function(a) {
      if (a == null)
        throw new Error("slotName cannot be null.");
      for (var t = this.slots, i = 0, e = t.length; i < e; i++) {
        var n = t[i];
        if (n.name == a)
          return n;
      }
      return null;
    }, M.prototype.findSlotIndex = function(a) {
      if (a == null)
        throw new Error("slotName cannot be null.");
      for (var t = this.slots, i = 0, e = t.length; i < e; i++)
        if (t[i].name == a)
          return i;
      return -1;
    }, M.prototype.findSkin = function(a) {
      if (a == null)
        throw new Error("skinName cannot be null.");
      for (var t = this.skins, i = 0, e = t.length; i < e; i++) {
        var n = t[i];
        if (n.name == a)
          return n;
      }
      return null;
    }, M.prototype.findEvent = function(a) {
      if (a == null)
        throw new Error("eventDataName cannot be null.");
      for (var t = this.events, i = 0, e = t.length; i < e; i++) {
        var n = t[i];
        if (n.name == a)
          return n;
      }
      return null;
    }, M.prototype.findAnimation = function(a) {
      if (a == null)
        throw new Error("animationName cannot be null.");
      for (var t = this.animations, i = 0, e = t.length; i < e; i++) {
        var n = t[i];
        if (n.name == a)
          return n;
      }
      return null;
    }, M.prototype.findIkConstraint = function(a) {
      if (a == null)
        throw new Error("constraintName cannot be null.");
      for (var t = this.ikConstraints, i = 0, e = t.length; i < e; i++) {
        var n = t[i];
        if (n.name == a)
          return n;
      }
      return null;
    }, M.prototype.findTransformConstraint = function(a) {
      if (a == null)
        throw new Error("constraintName cannot be null.");
      for (var t = this.transformConstraints, i = 0, e = t.length; i < e; i++) {
        var n = t[i];
        if (n.name == a)
          return n;
      }
      return null;
    }, M.prototype.findPathConstraint = function(a) {
      if (a == null)
        throw new Error("constraintName cannot be null.");
      for (var t = this.pathConstraints, i = 0, e = t.length; i < e; i++) {
        var n = t[i];
        if (n.name == a)
          return n;
      }
      return null;
    }, M.prototype.findPathConstraintIndex = function(a) {
      if (a == null)
        throw new Error("pathConstraintName cannot be null.");
      for (var t = this.pathConstraints, i = 0, e = t.length; i < e; i++)
        if (t[i].name == a)
          return i;
      return -1;
    }, M;
  })();
  c.SkeletonData = r;
})(F || (F = {}));
var F;
(function(c) {
  var r = (function() {
    function a(t) {
      this.scale = 1, this.linkedMeshes = new Array(), this.attachmentLoader = t;
    }
    return a.prototype.readSkeletonData = function(t) {
      var i = this.scale, e = new c.SkeletonData(), n = typeof t == "string" ? JSON.parse(t) : t, f = n.skeleton;
      if (f != null) {
        if (e.hash = f.hash, e.version = f.spine, e.version == "3.8.75")
          throw new Error("Unsupported skeleton data, please export with a newer version of Spine.");
        e.x = f.x, e.y = f.y, e.width = f.width, e.height = f.height, e.fps = f.fps, e.imagesPath = f.images;
      }
      if (n.bones)
        for (var h = 0; h < n.bones.length; h++) {
          var v = n.bones[h], u = null, s = this.getValue(v, "parent", null);
          if (s != null && (u = e.findBone(s), u == null))
            throw new Error("Parent bone not found: " + s);
          var o = new c.BoneData(e.bones.length, v.name, u);
          o.length = this.getValue(v, "length", 0) * i, o.x = this.getValue(v, "x", 0) * i, o.y = this.getValue(v, "y", 0) * i, o.rotation = this.getValue(v, "rotation", 0), o.scaleX = this.getValue(v, "scaleX", 1), o.scaleY = this.getValue(v, "scaleY", 1), o.shearX = this.getValue(v, "shearX", 0), o.shearY = this.getValue(v, "shearY", 0), o.transformMode = a.transformModeFromString(this.getValue(v, "transform", "normal")), o.skinRequired = this.getValue(v, "skin", !1), e.bones.push(o);
        }
      if (n.slots)
        for (var h = 0; h < n.slots.length; h++) {
          var d = n.slots[h], l = d.name, m = d.bone, C = e.findBone(m);
          if (C == null)
            throw new Error("Slot bone not found: " + m);
          var o = new c.SlotData(e.slots.length, l, C), S = this.getValue(d, "color", null);
          S != null && o.color.setFromString(S);
          var D = this.getValue(d, "dark", null);
          D != null && (o.darkColor = new c.Color(1, 1, 1, 1), o.darkColor.setFromString(D)), o.attachmentName = this.getValue(d, "attachment", null), o.blendMode = a.blendModeFromString(this.getValue(d, "blend", "normal")), e.slots.push(o);
        }
      if (n.ik)
        for (var h = 0; h < n.ik.length; h++) {
          var T = n.ik[h], o = new c.IkConstraintData(T.name);
          o.order = this.getValue(T, "order", 0), o.skinRequired = this.getValue(T, "skin", !1);
          for (var x = 0; x < T.bones.length; x++) {
            var m = T.bones[x], g = e.findBone(m);
            if (g == null)
              throw new Error("IK bone not found: " + m);
            o.bones.push(g);
          }
          var p = T.target;
          if (o.target = e.findBone(p), o.target == null)
            throw new Error("IK target bone not found: " + p);
          o.mix = this.getValue(T, "mix", 1), o.softness = this.getValue(T, "softness", 0) * i, o.bendDirection = this.getValue(T, "bendPositive", !0) ? 1 : -1, o.compress = this.getValue(T, "compress", !1), o.stretch = this.getValue(T, "stretch", !1), o.uniform = this.getValue(T, "uniform", !1), e.ikConstraints.push(o);
        }
      if (n.transform)
        for (var h = 0; h < n.transform.length; h++) {
          var T = n.transform[h], o = new c.TransformConstraintData(T.name);
          o.order = this.getValue(T, "order", 0), o.skinRequired = this.getValue(T, "skin", !1);
          for (var x = 0; x < T.bones.length; x++) {
            var m = T.bones[x], g = e.findBone(m);
            if (g == null)
              throw new Error("Transform constraint bone not found: " + m);
            o.bones.push(g);
          }
          var p = T.target;
          if (o.target = e.findBone(p), o.target == null)
            throw new Error("Transform constraint target bone not found: " + p);
          o.local = this.getValue(T, "local", !1), o.relative = this.getValue(T, "relative", !1), o.offsetRotation = this.getValue(T, "rotation", 0), o.offsetX = this.getValue(T, "x", 0) * i, o.offsetY = this.getValue(T, "y", 0) * i, o.offsetScaleX = this.getValue(T, "scaleX", 0), o.offsetScaleY = this.getValue(T, "scaleY", 0), o.offsetShearY = this.getValue(T, "shearY", 0), o.rotateMix = this.getValue(T, "rotateMix", 1), o.translateMix = this.getValue(T, "translateMix", 1), o.scaleMix = this.getValue(T, "scaleMix", 1), o.shearMix = this.getValue(T, "shearMix", 1), e.transformConstraints.push(o);
        }
      if (n.path)
        for (var h = 0; h < n.path.length; h++) {
          var T = n.path[h], o = new c.PathConstraintData(T.name);
          o.order = this.getValue(T, "order", 0), o.skinRequired = this.getValue(T, "skin", !1);
          for (var x = 0; x < T.bones.length; x++) {
            var m = T.bones[x], g = e.findBone(m);
            if (g == null)
              throw new Error("Transform constraint bone not found: " + m);
            o.bones.push(g);
          }
          var p = T.target;
          if (o.target = e.findSlot(p), o.target == null)
            throw new Error("Path target slot not found: " + p);
          o.positionMode = a.positionModeFromString(this.getValue(T, "positionMode", "percent")), o.spacingMode = a.spacingModeFromString(this.getValue(T, "spacingMode", "length")), o.rotateMode = a.rotateModeFromString(this.getValue(T, "rotateMode", "tangent")), o.offsetRotation = this.getValue(T, "rotation", 0), o.position = this.getValue(T, "position", 0), o.positionMode == c.PositionMode.Fixed && (o.position *= i), o.spacing = this.getValue(T, "spacing", 0), (o.spacingMode == c.SpacingMode.Length || o.spacingMode == c.SpacingMode.Fixed) && (o.spacing *= i), o.rotateMix = this.getValue(T, "rotateMix", 1), o.translateMix = this.getValue(T, "translateMix", 1), e.pathConstraints.push(o);
        }
      if (n.skins)
        for (var h = 0; h < n.skins.length; h++) {
          var A = n.skins[h], P = new c.Skin(A.name);
          if (A.bones)
            for (var k = 0; k < A.bones.length; k++) {
              var g = e.findBone(A.bones[k]);
              if (g == null)
                throw new Error("Skin bone not found: " + A.bones[h]);
              P.bones.push(g);
            }
          if (A.ik)
            for (var k = 0; k < A.ik.length; k++) {
              var O = e.findIkConstraint(A.ik[k]);
              if (O == null)
                throw new Error("Skin IK constraint not found: " + A.ik[h]);
              P.constraints.push(O);
            }
          if (A.transform)
            for (var k = 0; k < A.transform.length; k++) {
              var O = e.findTransformConstraint(A.transform[k]);
              if (O == null)
                throw new Error("Skin transform constraint not found: " + A.transform[h]);
              P.constraints.push(O);
            }
          if (A.path)
            for (var k = 0; k < A.path.length; k++) {
              var O = e.findPathConstraint(A.path[k]);
              if (O == null)
                throw new Error("Skin path constraint not found: " + A.path[h]);
              P.constraints.push(O);
            }
          for (var l in A.attachments) {
            var E = e.findSlot(l);
            if (E == null)
              throw new Error("Slot not found: " + l);
            var d = A.attachments[l];
            for (var V in d) {
              var N = this.readAttachment(d[V], P, E.index, V, e);
              N != null && P.setAttachment(E.index, V, N);
            }
          }
          e.skins.push(P), P.name == "default" && (e.defaultSkin = P);
        }
      for (var h = 0, I = this.linkedMeshes.length; h < I; h++) {
        var y = this.linkedMeshes[h], P = y.skin == null ? e.defaultSkin : e.findSkin(y.skin);
        if (P == null)
          throw new Error("Skin not found: " + y.skin);
        var R = P.getAttachment(y.slotIndex, y.parent);
        if (R == null)
          throw new Error("Parent mesh not found: " + y.parent);
        y.mesh.deformAttachment = y.inheritDeform ? R : y.mesh, y.mesh.setParentMesh(R), y.mesh.updateUVs();
      }
      if (this.linkedMeshes.length = 0, n.events)
        for (var B in n.events) {
          var w = n.events[B], o = new c.EventData(B);
          o.intValue = this.getValue(w, "int", 0), o.floatValue = this.getValue(w, "float", 0), o.stringValue = this.getValue(w, "string", ""), o.audioPath = this.getValue(w, "audio", null), o.audioPath != null && (o.volume = this.getValue(w, "volume", 1), o.balance = this.getValue(w, "balance", 0)), e.events.push(o);
        }
      if (n.animations)
        for (var Z in n.animations) {
          var W = n.animations[Z];
          this.readAnimation(W, Z, e);
        }
      return e;
    }, a.prototype.readAttachment = function(t, i, e, n, f) {
      var h = this.scale;
      n = this.getValue(t, "name", n);
      var v = this.getValue(t, "type", "region");
      switch (v) {
        case "region": {
          var u = this.getValue(t, "path", n), s = this.attachmentLoader.newRegionAttachment(i, n, u);
          if (s == null)
            return null;
          s.path = u, s.x = this.getValue(t, "x", 0) * h, s.y = this.getValue(t, "y", 0) * h, s.scaleX = this.getValue(t, "scaleX", 1), s.scaleY = this.getValue(t, "scaleY", 1), s.rotation = this.getValue(t, "rotation", 0), s.width = t.width * h, s.height = t.height * h;
          var o = this.getValue(t, "color", null);
          return o != null && s.color.setFromString(o), s.updateOffset(), s;
        }
        case "boundingbox": {
          var d = this.attachmentLoader.newBoundingBoxAttachment(i, n);
          if (d == null)
            return null;
          this.readVertices(t, d, t.vertexCount << 1);
          var o = this.getValue(t, "color", null);
          return o != null && d.color.setFromString(o), d;
        }
        case "mesh":
        case "linkedmesh": {
          var u = this.getValue(t, "path", n), l = this.attachmentLoader.newMeshAttachment(i, n, u);
          if (l == null)
            return null;
          l.path = u;
          var o = this.getValue(t, "color", null);
          o != null && l.color.setFromString(o), l.width = this.getValue(t, "width", 0) * h, l.height = this.getValue(t, "height", 0) * h;
          var m = this.getValue(t, "parent", null);
          if (m != null)
            return this.linkedMeshes.push(new M(l, this.getValue(t, "skin", null), e, m, this.getValue(t, "deform", !0))), l;
          var C = t.uvs;
          return this.readVertices(t, l, C.length), l.triangles = t.triangles, l.regionUVs = C, l.updateUVs(), l.edges = this.getValue(t, "edges", null), l.hullLength = this.getValue(t, "hull", 0) * 2, l;
        }
        case "path": {
          var u = this.attachmentLoader.newPathAttachment(i, n);
          if (u == null)
            return null;
          u.closed = this.getValue(t, "closed", !1), u.constantSpeed = this.getValue(t, "constantSpeed", !0);
          var S = t.vertexCount;
          this.readVertices(t, u, S << 1);
          for (var D = c.Utils.newArray(S / 3, 0), T = 0; T < t.lengths.length; T++)
            D[T] = t.lengths[T] * h;
          u.lengths = D;
          var o = this.getValue(t, "color", null);
          return o != null && u.color.setFromString(o), u;
        }
        case "point": {
          var x = this.attachmentLoader.newPointAttachment(i, n);
          if (x == null)
            return null;
          x.x = this.getValue(t, "x", 0) * h, x.y = this.getValue(t, "y", 0) * h, x.rotation = this.getValue(t, "rotation", 0);
          var o = this.getValue(t, "color", null);
          return o != null && x.color.setFromString(o), x;
        }
        case "clipping": {
          var g = this.attachmentLoader.newClippingAttachment(i, n);
          if (g == null)
            return null;
          var p = this.getValue(t, "end", null);
          if (p != null) {
            var A = f.findSlot(p);
            if (A == null)
              throw new Error("Clipping end slot not found: " + p);
            g.endSlot = A;
          }
          var S = t.vertexCount;
          this.readVertices(t, g, S << 1);
          var o = this.getValue(t, "color", null);
          return o != null && g.color.setFromString(o), g;
        }
      }
      return null;
    }, a.prototype.readVertices = function(t, i, e) {
      var n = this.scale;
      i.worldVerticesLength = e;
      var f = t.vertices;
      if (e == f.length) {
        var h = c.Utils.toFloatArray(f);
        if (n != 1)
          for (var v = 0, u = f.length; v < u; v++)
            h[v] *= n;
        i.vertices = h;
        return;
      }
      for (var s = new Array(), o = new Array(), v = 0, u = f.length; v < u; ) {
        var d = f[v++];
        o.push(d);
        for (var l = v + d * 4; v < l; v += 4)
          o.push(f[v]), s.push(f[v + 1] * n), s.push(f[v + 2] * n), s.push(f[v + 3]);
      }
      i.bones = o, i.vertices = c.Utils.toFloatArray(s);
    }, a.prototype.readAnimation = function(t, i, e) {
      var n = this.scale, f = new Array(), h = 0;
      if (t.slots)
        for (var v in t.slots) {
          var u = t.slots[v], s = e.findSlotIndex(v);
          if (s == -1)
            throw new Error("Slot not found: " + v);
          for (var o in u) {
            var d = u[o];
            if (o == "attachment") {
              var l = new c.AttachmentTimeline(d.length);
              l.slotIndex = s;
              for (var m = 0, C = 0; C < d.length; C++) {
                var S = d[C];
                l.setFrame(m++, this.getValue(S, "time", 0), S.name);
              }
              f.push(l), h = Math.max(h, l.frames[l.getFrameCount() - 1]);
            } else if (o == "color") {
              var l = new c.ColorTimeline(d.length);
              l.slotIndex = s;
              for (var m = 0, C = 0; C < d.length; C++) {
                var S = d[C], D = new c.Color();
                D.setFromString(S.color), l.setFrame(m, this.getValue(S, "time", 0), D.r, D.g, D.b, D.a), this.readCurve(S, l, m), m++;
              }
              f.push(l), h = Math.max(h, l.frames[(l.getFrameCount() - 1) * c.ColorTimeline.ENTRIES]);
            } else if (o == "twoColor") {
              var l = new c.TwoColorTimeline(d.length);
              l.slotIndex = s;
              for (var m = 0, C = 0; C < d.length; C++) {
                var S = d[C], T = new c.Color(), x = new c.Color();
                T.setFromString(S.light), x.setFromString(S.dark), l.setFrame(m, this.getValue(S, "time", 0), T.r, T.g, T.b, T.a, x.r, x.g, x.b), this.readCurve(S, l, m), m++;
              }
              f.push(l), h = Math.max(h, l.frames[(l.getFrameCount() - 1) * c.TwoColorTimeline.ENTRIES]);
            } else
              throw new Error("Invalid timeline type for a slot: " + o + " (" + v + ")");
          }
        }
      if (t.bones)
        for (var g in t.bones) {
          var p = t.bones[g], A = e.findBoneIndex(g);
          if (A == -1)
            throw new Error("Bone not found: " + g);
          for (var o in p) {
            var d = p[o];
            if (o === "rotate") {
              var l = new c.RotateTimeline(d.length);
              l.boneIndex = A;
              for (var m = 0, C = 0; C < d.length; C++) {
                var S = d[C];
                l.setFrame(m, this.getValue(S, "time", 0), this.getValue(S, "angle", 0)), this.readCurve(S, l, m), m++;
              }
              f.push(l), h = Math.max(h, l.frames[(l.getFrameCount() - 1) * c.RotateTimeline.ENTRIES]);
            } else if (o === "translate" || o === "scale" || o === "shear") {
              var l = null, P = 1, k = 0;
              o === "scale" ? (l = new c.ScaleTimeline(d.length), k = 1) : o === "shear" ? l = new c.ShearTimeline(d.length) : (l = new c.TranslateTimeline(d.length), P = n), l.boneIndex = A;
              for (var m = 0, C = 0; C < d.length; C++) {
                var S = d[C], O = this.getValue(S, "x", k), E = this.getValue(S, "y", k);
                l.setFrame(m, this.getValue(S, "time", 0), O * P, E * P), this.readCurve(S, l, m), m++;
              }
              f.push(l), h = Math.max(h, l.frames[(l.getFrameCount() - 1) * c.TranslateTimeline.ENTRIES]);
            } else
              throw new Error("Invalid timeline type for a bone: " + o + " (" + g + ")");
          }
        }
      if (t.ik)
        for (var V in t.ik) {
          var N = t.ik[V], I = e.findIkConstraint(V), l = new c.IkConstraintTimeline(N.length);
          l.ikConstraintIndex = e.ikConstraints.indexOf(I);
          for (var m = 0, C = 0; C < N.length; C++) {
            var S = N[C];
            l.setFrame(m, this.getValue(S, "time", 0), this.getValue(S, "mix", 1), this.getValue(S, "softness", 0) * n, this.getValue(S, "bendPositive", !0) ? 1 : -1, this.getValue(S, "compress", !1), this.getValue(S, "stretch", !1)), this.readCurve(S, l, m), m++;
          }
          f.push(l), h = Math.max(h, l.frames[(l.getFrameCount() - 1) * c.IkConstraintTimeline.ENTRIES]);
        }
      if (t.transform)
        for (var V in t.transform) {
          var N = t.transform[V], I = e.findTransformConstraint(V), l = new c.TransformConstraintTimeline(N.length);
          l.transformConstraintIndex = e.transformConstraints.indexOf(I);
          for (var m = 0, C = 0; C < N.length; C++) {
            var S = N[C];
            l.setFrame(m, this.getValue(S, "time", 0), this.getValue(S, "rotateMix", 1), this.getValue(S, "translateMix", 1), this.getValue(S, "scaleMix", 1), this.getValue(S, "shearMix", 1)), this.readCurve(S, l, m), m++;
          }
          f.push(l), h = Math.max(h, l.frames[(l.getFrameCount() - 1) * c.TransformConstraintTimeline.ENTRIES]);
        }
      if (t.path)
        for (var V in t.path) {
          var N = t.path[V], y = e.findPathConstraintIndex(V);
          if (y == -1)
            throw new Error("Path constraint not found: " + V);
          var R = e.pathConstraints[y];
          for (var o in N) {
            var d = N[o];
            if (o === "position" || o === "spacing") {
              var l = null, P = 1;
              o === "spacing" ? (l = new c.PathConstraintSpacingTimeline(d.length), (R.spacingMode == c.SpacingMode.Length || R.spacingMode == c.SpacingMode.Fixed) && (P = n)) : (l = new c.PathConstraintPositionTimeline(d.length), R.positionMode == c.PositionMode.Fixed && (P = n)), l.pathConstraintIndex = y;
              for (var m = 0, C = 0; C < d.length; C++) {
                var S = d[C];
                l.setFrame(m, this.getValue(S, "time", 0), this.getValue(S, o, 0) * P), this.readCurve(S, l, m), m++;
              }
              f.push(l), h = Math.max(h, l.frames[(l.getFrameCount() - 1) * c.PathConstraintPositionTimeline.ENTRIES]);
            } else if (o === "mix") {
              var l = new c.PathConstraintMixTimeline(d.length);
              l.pathConstraintIndex = y;
              for (var m = 0, C = 0; C < d.length; C++) {
                var S = d[C];
                l.setFrame(m, this.getValue(S, "time", 0), this.getValue(S, "rotateMix", 1), this.getValue(S, "translateMix", 1)), this.readCurve(S, l, m), m++;
              }
              f.push(l), h = Math.max(h, l.frames[(l.getFrameCount() - 1) * c.PathConstraintMixTimeline.ENTRIES]);
            }
          }
        }
      if (t.deform)
        for (var B in t.deform) {
          var w = t.deform[B], Z = e.findSkin(B);
          if (Z == null)
            throw new Error("Skin not found: " + B);
          for (var v in w) {
            var u = w[v], s = e.findSlotIndex(v);
            if (s == -1)
              throw new Error("Slot not found: " + u.name);
            for (var o in u) {
              var d = u[o], W = Z.getAttachment(s, o);
              if (W == null)
                throw new Error("Deform attachment not found: " + d.name);
              var G = W.bones != null, X = W.vertices, Y = G ? X.length / 3 * 2 : X.length, l = new c.DeformTimeline(d.length);
              l.slotIndex = s, l.attachment = W;
              for (var m = 0, U = 0; U < d.length; U++) {
                var S = d[U], L = void 0, j = this.getValue(S, "vertices", null);
                if (j == null)
                  L = G ? c.Utils.newFloatArray(Y) : X;
                else {
                  L = c.Utils.newFloatArray(Y);
                  var z = this.getValue(S, "offset", 0);
                  if (c.Utils.arrayCopy(j, 0, L, z, j.length), n != 1)
                    for (var C = z, _ = C + j.length; C < _; C++)
                      L[C] *= n;
                  if (!G)
                    for (var C = 0; C < Y; C++)
                      L[C] += X[C];
                }
                l.setFrame(m, this.getValue(S, "time", 0), L), this.readCurve(S, l, m), m++;
              }
              f.push(l), h = Math.max(h, l.frames[l.getFrameCount() - 1]);
            }
          }
        }
      var H = t.drawOrder;
      if (H == null && (H = t.draworder), H != null) {
        for (var l = new c.DrawOrderTimeline(H.length), q = e.slots.length, m = 0, U = 0; U < H.length; U++) {
          var b = H[U], J = null, it = this.getValue(b, "offsets", null);
          if (it != null) {
            J = c.Utils.newArray(q, -1);
            for (var rt = c.Utils.newArray(q - it.length, 0), lt = 0, ut = 0, C = 0; C < it.length; C++) {
              var nt = it[C], s = e.findSlotIndex(nt.slot);
              if (s == -1)
                throw new Error("Slot not found: " + nt.slot);
              for (; lt != s; )
                rt[ut++] = lt++;
              J[lt + nt.offset] = lt++;
            }
            for (; lt < q; )
              rt[ut++] = lt++;
            for (var C = q - 1; C >= 0; C--)
              J[C] == -1 && (J[C] = rt[--ut]);
          }
          l.setFrame(m++, this.getValue(b, "time", 0), J);
        }
        f.push(l), h = Math.max(h, l.frames[l.getFrameCount() - 1]);
      }
      if (t.events) {
        for (var l = new c.EventTimeline(t.events.length), m = 0, C = 0; C < t.events.length; C++) {
          var ct = t.events[C], at = e.findEvent(ct.name);
          if (at == null)
            throw new Error("Event not found: " + ct.name);
          var st = new c.Event(c.Utils.toSinglePrecision(this.getValue(ct, "time", 0)), at);
          st.intValue = this.getValue(ct, "int", at.intValue), st.floatValue = this.getValue(ct, "float", at.floatValue), st.stringValue = this.getValue(ct, "string", at.stringValue), st.data.audioPath != null && (st.volume = this.getValue(ct, "volume", 1), st.balance = this.getValue(ct, "balance", 0)), l.setFrame(m++, st);
        }
        f.push(l), h = Math.max(h, l.frames[l.getFrameCount() - 1]);
      }
      if (isNaN(h))
        throw new Error("Error while parsing animation, duration is NaN");
      e.animations.push(new c.Animation(i, f, h));
    }, a.prototype.readCurve = function(t, i, e) {
      if (t.hasOwnProperty("curve"))
        if (t.curve == "stepped")
          i.setStepped(e);
        else {
          var n = t.curve;
          i.setCurve(e, n, this.getValue(t, "c2", 0), this.getValue(t, "c3", 1), this.getValue(t, "c4", 1));
        }
    }, a.prototype.getValue = function(t, i, e) {
      return t[i] !== void 0 ? t[i] : e;
    }, a.blendModeFromString = function(t) {
      if (t = t.toLowerCase(), t == "normal")
        return c.BlendMode.Normal;
      if (t == "additive")
        return c.BlendMode.Additive;
      if (t == "multiply")
        return c.BlendMode.Multiply;
      if (t == "screen")
        return c.BlendMode.Screen;
      throw new Error("Unknown blend mode: " + t);
    }, a.positionModeFromString = function(t) {
      if (t = t.toLowerCase(), t == "fixed")
        return c.PositionMode.Fixed;
      if (t == "percent")
        return c.PositionMode.Percent;
      throw new Error("Unknown position mode: " + t);
    }, a.spacingModeFromString = function(t) {
      if (t = t.toLowerCase(), t == "length")
        return c.SpacingMode.Length;
      if (t == "fixed")
        return c.SpacingMode.Fixed;
      if (t == "percent")
        return c.SpacingMode.Percent;
      throw new Error("Unknown position mode: " + t);
    }, a.rotateModeFromString = function(t) {
      if (t = t.toLowerCase(), t == "tangent")
        return c.RotateMode.Tangent;
      if (t == "chain")
        return c.RotateMode.Chain;
      if (t == "chainscale")
        return c.RotateMode.ChainScale;
      throw new Error("Unknown rotate mode: " + t);
    }, a.transformModeFromString = function(t) {
      if (t = t.toLowerCase(), t == "normal")
        return c.TransformMode.Normal;
      if (t == "onlytranslation")
        return c.TransformMode.OnlyTranslation;
      if (t == "norotationorreflection")
        return c.TransformMode.NoRotationOrReflection;
      if (t == "noscale")
        return c.TransformMode.NoScale;
      if (t == "noscaleorreflection")
        return c.TransformMode.NoScaleOrReflection;
      throw new Error("Unknown transform mode: " + t);
    }, a;
  })();
  c.SkeletonJson = r;
  var M = /* @__PURE__ */ (function() {
    function a(t, i, e, n, f) {
      this.mesh = t, this.skin = i, this.slotIndex = e, this.parent = n, this.inheritDeform = f;
    }
    return a;
  })();
})(F || (F = {}));
var F;
(function(c) {
  var r = /* @__PURE__ */ (function() {
    function a(t, i, e) {
      this.slotIndex = t, this.name = i, this.attachment = e;
    }
    return a;
  })();
  c.SkinEntry = r;
  var M = (function() {
    function a(t) {
      if (this.attachments = new Array(), this.bones = Array(), this.constraints = new Array(), t == null)
        throw new Error("name cannot be null.");
      this.name = t;
    }
    return a.prototype.setAttachment = function(t, i, e) {
      if (e == null)
        throw new Error("attachment cannot be null.");
      var n = this.attachments;
      t >= n.length && (n.length = t + 1), n[t] || (n[t] = {}), n[t][i] = e;
    }, a.prototype.addSkin = function(t) {
      for (var i = 0; i < t.bones.length; i++) {
        for (var e = t.bones[i], n = !1, f = 0; f < this.bones.length; f++)
          if (this.bones[f] == e) {
            n = !0;
            break;
          }
        n || this.bones.push(e);
      }
      for (var i = 0; i < t.constraints.length; i++) {
        for (var h = t.constraints[i], n = !1, f = 0; f < this.constraints.length; f++)
          if (this.constraints[f] == h) {
            n = !0;
            break;
          }
        n || this.constraints.push(h);
      }
      for (var v = t.getAttachments(), i = 0; i < v.length; i++) {
        var u = v[i];
        this.setAttachment(u.slotIndex, u.name, u.attachment);
      }
    }, a.prototype.copySkin = function(t) {
      for (var i = 0; i < t.bones.length; i++) {
        for (var e = t.bones[i], n = !1, f = 0; f < this.bones.length; f++)
          if (this.bones[f] == e) {
            n = !0;
            break;
          }
        n || this.bones.push(e);
      }
      for (var i = 0; i < t.constraints.length; i++) {
        for (var h = t.constraints[i], n = !1, f = 0; f < this.constraints.length; f++)
          if (this.constraints[f] == h) {
            n = !0;
            break;
          }
        n || this.constraints.push(h);
      }
      for (var v = t.getAttachments(), i = 0; i < v.length; i++) {
        var u = v[i];
        u.attachment != null && (u.attachment instanceof c.MeshAttachment ? (u.attachment = u.attachment.newLinkedMesh(), this.setAttachment(u.slotIndex, u.name, u.attachment)) : (u.attachment = u.attachment.copy(), this.setAttachment(u.slotIndex, u.name, u.attachment)));
      }
    }, a.prototype.getAttachment = function(t, i) {
      var e = this.attachments[t];
      return e ? e[i] : null;
    }, a.prototype.removeAttachment = function(t, i) {
      var e = this.attachments[t];
      e && (e[i] = null);
    }, a.prototype.getAttachments = function() {
      for (var t = new Array(), i = 0; i < this.attachments.length; i++) {
        var e = this.attachments[i];
        if (e)
          for (var n in e) {
            var f = e[n];
            f && t.push(new r(i, n, f));
          }
      }
      return t;
    }, a.prototype.getAttachmentsForSlot = function(t, i) {
      var e = this.attachments[t];
      if (e)
        for (var n in e) {
          var f = e[n];
          f && i.push(new r(t, n, f));
        }
    }, a.prototype.clear = function() {
      this.attachments.length = 0, this.bones.length = 0, this.constraints.length = 0;
    }, a.prototype.attachAll = function(t, i) {
      for (var e = 0, n = 0; n < t.slots.length; n++) {
        var f = t.slots[n], h = f.getAttachment();
        if (h && e < i.attachments.length) {
          var v = i.attachments[e];
          for (var u in v) {
            var s = v[u];
            if (h == s) {
              var o = this.getAttachment(e, u);
              o != null && f.setAttachment(o);
              break;
            }
          }
        }
        e++;
      }
    }, a;
  })();
  c.Skin = M;
})(F || (F = {}));
var F;
(function(c) {
  var r = (function() {
    function M(a, t) {
      if (this.deform = new Array(), a == null)
        throw new Error("data cannot be null.");
      if (t == null)
        throw new Error("bone cannot be null.");
      this.data = a, this.bone = t, this.color = new c.Color(), this.darkColor = a.darkColor == null ? null : new c.Color(), this.setToSetupPose();
    }
    return M.prototype.getSkeleton = function() {
      return this.bone.skeleton;
    }, M.prototype.getAttachment = function() {
      return this.attachment;
    }, M.prototype.setAttachment = function(a) {
      this.attachment != a && (this.attachment = a, this.attachmentTime = this.bone.skeleton.time, this.deform.length = 0);
    }, M.prototype.setAttachmentTime = function(a) {
      this.attachmentTime = this.bone.skeleton.time - a;
    }, M.prototype.getAttachmentTime = function() {
      return this.bone.skeleton.time - this.attachmentTime;
    }, M.prototype.setToSetupPose = function() {
      this.color.setFromColor(this.data.color), this.darkColor != null && this.darkColor.setFromColor(this.data.darkColor), this.data.attachmentName == null ? this.attachment = null : (this.attachment = null, this.setAttachment(this.bone.skeleton.getAttachment(this.data.index, this.data.attachmentName)));
    }, M;
  })();
  c.Slot = r;
})(F || (F = {}));
var F;
(function(c) {
  var r = /* @__PURE__ */ (function() {
    function M(a, t, i) {
      if (this.color = new c.Color(1, 1, 1, 1), a < 0)
        throw new Error("index must be >= 0.");
      if (t == null)
        throw new Error("name cannot be null.");
      if (i == null)
        throw new Error("boneData cannot be null.");
      this.index = a, this.name = t, this.boneData = i;
    }
    return M;
  })();
  c.SlotData = r;
})(F || (F = {}));
var F;
(function(c) {
  var r = (function() {
    function e(n) {
      this._image = n;
    }
    return e.prototype.getImage = function() {
      return this._image;
    }, e.filterFromString = function(n) {
      switch (n.toLowerCase()) {
        case "nearest":
          return M.Nearest;
        case "linear":
          return M.Linear;
        case "mipmap":
          return M.MipMap;
        case "mipmapnearestnearest":
          return M.MipMapNearestNearest;
        case "mipmaplinearnearest":
          return M.MipMapLinearNearest;
        case "mipmapnearestlinear":
          return M.MipMapNearestLinear;
        case "mipmaplinearlinear":
          return M.MipMapLinearLinear;
        default:
          throw new Error("Unknown texture filter " + n);
      }
    }, e.wrapFromString = function(n) {
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
    }, e;
  })();
  c.Texture = r;
  var M;
  (function(e) {
    e[e.Nearest = 9728] = "Nearest", e[e.Linear = 9729] = "Linear", e[e.MipMap = 9987] = "MipMap", e[e.MipMapNearestNearest = 9984] = "MipMapNearestNearest", e[e.MipMapLinearNearest = 9985] = "MipMapLinearNearest", e[e.MipMapNearestLinear = 9986] = "MipMapNearestLinear", e[e.MipMapLinearLinear = 9987] = "MipMapLinearLinear";
  })(M = c.TextureFilter || (c.TextureFilter = {}));
  var a;
  (function(e) {
    e[e.MirroredRepeat = 33648] = "MirroredRepeat", e[e.ClampToEdge = 33071] = "ClampToEdge", e[e.Repeat = 10497] = "Repeat";
  })(a = c.TextureWrap || (c.TextureWrap = {}));
  var t = /* @__PURE__ */ (function() {
    function e() {
      this.u = 0, this.v = 0, this.u2 = 0, this.v2 = 0, this.width = 0, this.height = 0, this.rotate = !1, this.offsetX = 0, this.offsetY = 0, this.originalWidth = 0, this.originalHeight = 0;
    }
    return e;
  })();
  c.TextureRegion = t;
  var i = (function(e) {
    Q(n, e);
    function n() {
      return e !== null && e.apply(this, arguments) || this;
    }
    return n.prototype.setFilters = function(f, h) {
    }, n.prototype.setWraps = function(f, h) {
    }, n.prototype.dispose = function() {
    }, n;
  })(r);
  c.FakeTexture = i;
})(F || (F = {}));
var F;
(function(c) {
  var r = (function() {
    function i(e, n) {
      this.pages = new Array(), this.regions = new Array(), this.load(e, n);
    }
    return i.prototype.load = function(e, n) {
      if (n == null)
        throw new Error("textureLoader cannot be null.");
      for (var f = new M(e), h = new Array(4), v = null; ; ) {
        var u = f.readLine();
        if (u == null)
          break;
        if (u = u.trim(), u.length == 0)
          v = null;
        else if (v) {
          var o = new t();
          o.name = u, o.page = v;
          var d = f.readValue();
          d.toLocaleLowerCase() == "true" ? o.degrees = 90 : d.toLocaleLowerCase() == "false" ? o.degrees = 0 : o.degrees = parseFloat(d), o.rotate = o.degrees == 90, f.readTuple(h);
          var l = parseInt(h[0]), m = parseInt(h[1]);
          f.readTuple(h);
          var C = parseInt(h[0]), S = parseInt(h[1]);
          o.u = l / v.width, o.v = m / v.height, o.rotate ? (o.u2 = (l + S) / v.width, o.v2 = (m + C) / v.height) : (o.u2 = (l + C) / v.width, o.v2 = (m + S) / v.height), o.x = l, o.y = m, o.width = Math.abs(C), o.height = Math.abs(S), f.readTuple(h) == 4 && f.readTuple(h) == 4 && f.readTuple(h), o.originalWidth = parseInt(h[0]), o.originalHeight = parseInt(h[1]), f.readTuple(h), o.offsetX = parseInt(h[0]), o.offsetY = parseInt(h[1]), o.index = parseInt(f.readValue()), o.texture = v.texture, this.regions.push(o);
        } else {
          v = new a(), v.name = u, f.readTuple(h) == 2 && (v.width = parseInt(h[0]), v.height = parseInt(h[1]), f.readTuple(h)), f.readTuple(h), v.minFilter = c.Texture.filterFromString(h[0]), v.magFilter = c.Texture.filterFromString(h[1]);
          var s = f.readValue();
          v.uWrap = c.TextureWrap.ClampToEdge, v.vWrap = c.TextureWrap.ClampToEdge, s == "x" ? v.uWrap = c.TextureWrap.Repeat : s == "y" ? v.vWrap = c.TextureWrap.Repeat : s == "xy" && (v.uWrap = v.vWrap = c.TextureWrap.Repeat), v.texture = n(u), v.texture.setFilters(v.minFilter, v.magFilter), v.texture.setWraps(v.uWrap, v.vWrap), v.width = v.texture.getImage().width, v.height = v.texture.getImage().height, this.pages.push(v);
        }
      }
    }, i.prototype.findRegion = function(e) {
      for (var n = 0; n < this.regions.length; n++)
        if (this.regions[n].name == e)
          return this.regions[n];
      return null;
    }, i.prototype.dispose = function() {
      for (var e = 0; e < this.pages.length; e++)
        this.pages[e].texture.dispose();
    }, i;
  })();
  c.TextureAtlas = r;
  var M = (function() {
    function i(e) {
      this.index = 0, this.lines = e.split(/\r\n|\r|\n/);
    }
    return i.prototype.readLine = function() {
      return this.index >= this.lines.length ? null : this.lines[this.index++];
    }, i.prototype.readValue = function() {
      var e = this.readLine(), n = e.indexOf(":");
      if (n == -1)
        throw new Error("Invalid line: " + e);
      return e.substring(n + 1).trim();
    }, i.prototype.readTuple = function(e) {
      var n = this.readLine(), f = n.indexOf(":");
      if (f == -1)
        throw new Error("Invalid line: " + n);
      for (var h = 0, v = f + 1; h < 3; h++) {
        var u = n.indexOf(",", v);
        if (u == -1)
          break;
        e[h] = n.substr(v, u - v).trim(), v = u + 1;
      }
      return e[h] = n.substring(v).trim(), h + 1;
    }, i;
  })(), a = /* @__PURE__ */ (function() {
    function i() {
    }
    return i;
  })();
  c.TextureAtlasPage = a;
  var t = (function(i) {
    Q(e, i);
    function e() {
      return i !== null && i.apply(this, arguments) || this;
    }
    return e;
  })(c.TextureRegion);
  c.TextureAtlasRegion = t;
})(F || (F = {}));
var F;
(function(c) {
  var r = (function() {
    function M(a, t) {
      if (this.rotateMix = 0, this.translateMix = 0, this.scaleMix = 0, this.shearMix = 0, this.temp = new c.Vector2(), this.active = !1, a == null)
        throw new Error("data cannot be null.");
      if (t == null)
        throw new Error("skeleton cannot be null.");
      this.data = a, this.rotateMix = a.rotateMix, this.translateMix = a.translateMix, this.scaleMix = a.scaleMix, this.shearMix = a.shearMix, this.bones = new Array();
      for (var i = 0; i < a.bones.length; i++)
        this.bones.push(t.findBone(a.bones[i].name));
      this.target = t.findBone(a.target.name);
    }
    return M.prototype.isActive = function() {
      return this.active;
    }, M.prototype.apply = function() {
      this.update();
    }, M.prototype.update = function() {
      this.data.local ? this.data.relative ? this.applyRelativeLocal() : this.applyAbsoluteLocal() : this.data.relative ? this.applyRelativeWorld() : this.applyAbsoluteWorld();
    }, M.prototype.applyAbsoluteWorld = function() {
      for (var a = this.rotateMix, t = this.translateMix, i = this.scaleMix, e = this.shearMix, n = this.target, f = n.a, h = n.b, v = n.c, u = n.d, s = f * u - h * v > 0 ? c.MathUtils.degRad : -c.MathUtils.degRad, o = this.data.offsetRotation * s, d = this.data.offsetShearY * s, l = this.bones, m = 0, C = l.length; m < C; m++) {
        var S = l[m], D = !1;
        if (a != 0) {
          var T = S.a, x = S.b, g = S.c, p = S.d, A = Math.atan2(v, f) - Math.atan2(g, T) + o;
          A > c.MathUtils.PI ? A -= c.MathUtils.PI2 : A < -c.MathUtils.PI && (A += c.MathUtils.PI2), A *= a;
          var P = Math.cos(A), k = Math.sin(A);
          S.a = P * T - k * g, S.b = P * x - k * p, S.c = k * T + P * g, S.d = k * x + P * p, D = !0;
        }
        if (t != 0) {
          var O = this.temp;
          n.localToWorld(O.set(this.data.offsetX, this.data.offsetY)), S.worldX += (O.x - S.worldX) * t, S.worldY += (O.y - S.worldY) * t, D = !0;
        }
        if (i > 0) {
          var E = Math.sqrt(S.a * S.a + S.c * S.c), V = Math.sqrt(f * f + v * v);
          E > 1e-5 && (E = (E + (V - E + this.data.offsetScaleX) * i) / E), S.a *= E, S.c *= E, E = Math.sqrt(S.b * S.b + S.d * S.d), V = Math.sqrt(h * h + u * u), E > 1e-5 && (E = (E + (V - E + this.data.offsetScaleY) * i) / E), S.b *= E, S.d *= E, D = !0;
        }
        if (e > 0) {
          var x = S.b, p = S.d, N = Math.atan2(p, x), A = Math.atan2(u, h) - Math.atan2(v, f) - (N - Math.atan2(S.c, S.a));
          A > c.MathUtils.PI ? A -= c.MathUtils.PI2 : A < -c.MathUtils.PI && (A += c.MathUtils.PI2), A = N + (A + d) * e;
          var E = Math.sqrt(x * x + p * p);
          S.b = Math.cos(A) * E, S.d = Math.sin(A) * E, D = !0;
        }
        D && (S.appliedValid = !1);
      }
    }, M.prototype.applyRelativeWorld = function() {
      for (var a = this.rotateMix, t = this.translateMix, i = this.scaleMix, e = this.shearMix, n = this.target, f = n.a, h = n.b, v = n.c, u = n.d, s = f * u - h * v > 0 ? c.MathUtils.degRad : -c.MathUtils.degRad, o = this.data.offsetRotation * s, d = this.data.offsetShearY * s, l = this.bones, m = 0, C = l.length; m < C; m++) {
        var S = l[m], D = !1;
        if (a != 0) {
          var T = S.a, x = S.b, g = S.c, p = S.d, A = Math.atan2(v, f) + o;
          A > c.MathUtils.PI ? A -= c.MathUtils.PI2 : A < -c.MathUtils.PI && (A += c.MathUtils.PI2), A *= a;
          var P = Math.cos(A), k = Math.sin(A);
          S.a = P * T - k * g, S.b = P * x - k * p, S.c = k * T + P * g, S.d = k * x + P * p, D = !0;
        }
        if (t != 0) {
          var O = this.temp;
          n.localToWorld(O.set(this.data.offsetX, this.data.offsetY)), S.worldX += O.x * t, S.worldY += O.y * t, D = !0;
        }
        if (i > 0) {
          var E = (Math.sqrt(f * f + v * v) - 1 + this.data.offsetScaleX) * i + 1;
          S.a *= E, S.c *= E, E = (Math.sqrt(h * h + u * u) - 1 + this.data.offsetScaleY) * i + 1, S.b *= E, S.d *= E, D = !0;
        }
        if (e > 0) {
          var A = Math.atan2(u, h) - Math.atan2(v, f);
          A > c.MathUtils.PI ? A -= c.MathUtils.PI2 : A < -c.MathUtils.PI && (A += c.MathUtils.PI2);
          var x = S.b, p = S.d;
          A = Math.atan2(p, x) + (A - c.MathUtils.PI / 2 + d) * e;
          var E = Math.sqrt(x * x + p * p);
          S.b = Math.cos(A) * E, S.d = Math.sin(A) * E, D = !0;
        }
        D && (S.appliedValid = !1);
      }
    }, M.prototype.applyAbsoluteLocal = function() {
      var a = this.rotateMix, t = this.translateMix, i = this.scaleMix, e = this.shearMix, n = this.target;
      n.appliedValid || n.updateAppliedTransform();
      for (var f = this.bones, h = 0, v = f.length; h < v; h++) {
        var u = f[h];
        u.appliedValid || u.updateAppliedTransform();
        var s = u.arotation;
        if (a != 0) {
          var o = n.arotation - s + this.data.offsetRotation;
          o -= (16384 - (16384.499999999996 - o / 360 | 0)) * 360, s += o * a;
        }
        var d = u.ax, l = u.ay;
        t != 0 && (d += (n.ax - d + this.data.offsetX) * t, l += (n.ay - l + this.data.offsetY) * t);
        var m = u.ascaleX, C = u.ascaleY;
        i != 0 && (m > 1e-5 && (m = (m + (n.ascaleX - m + this.data.offsetScaleX) * i) / m), C > 1e-5 && (C = (C + (n.ascaleY - C + this.data.offsetScaleY) * i) / C));
        var S = u.ashearY;
        if (e != 0) {
          var o = n.ashearY - S + this.data.offsetShearY;
          o -= (16384 - (16384.499999999996 - o / 360 | 0)) * 360, u.shearY += o * e;
        }
        u.updateWorldTransformWith(d, l, s, m, C, u.ashearX, S);
      }
    }, M.prototype.applyRelativeLocal = function() {
      var a = this.rotateMix, t = this.translateMix, i = this.scaleMix, e = this.shearMix, n = this.target;
      n.appliedValid || n.updateAppliedTransform();
      for (var f = this.bones, h = 0, v = f.length; h < v; h++) {
        var u = f[h];
        u.appliedValid || u.updateAppliedTransform();
        var s = u.arotation;
        a != 0 && (s += (n.arotation + this.data.offsetRotation) * a);
        var o = u.ax, d = u.ay;
        t != 0 && (o += (n.ax + this.data.offsetX) * t, d += (n.ay + this.data.offsetY) * t);
        var l = u.ascaleX, m = u.ascaleY;
        i != 0 && (l > 1e-5 && (l *= (n.ascaleX - 1 + this.data.offsetScaleX) * i + 1), m > 1e-5 && (m *= (n.ascaleY - 1 + this.data.offsetScaleY) * i + 1));
        var C = u.ashearY;
        e != 0 && (C += (n.ashearY + this.data.offsetShearY) * e), u.updateWorldTransformWith(o, d, s, l, m, u.ashearX, C);
      }
    }, M;
  })();
  c.TransformConstraint = r;
})(F || (F = {}));
var F;
(function(c) {
  var r = (function(M) {
    Q(a, M);
    function a(t) {
      var i = M.call(this, t, 0, !1) || this;
      return i.bones = new Array(), i.rotateMix = 0, i.translateMix = 0, i.scaleMix = 0, i.shearMix = 0, i.offsetRotation = 0, i.offsetX = 0, i.offsetY = 0, i.offsetScaleX = 0, i.offsetScaleY = 0, i.offsetShearY = 0, i.relative = !1, i.local = !1, i;
    }
    return a;
  })(c.ConstraintData);
  c.TransformConstraintData = r;
})(F || (F = {}));
var F;
(function(c) {
  var r = (function() {
    function M() {
      this.convexPolygons = new Array(), this.convexPolygonsIndices = new Array(), this.indicesArray = new Array(), this.isConcaveArray = new Array(), this.triangles = new Array(), this.polygonPool = new c.Pool(function() {
        return new Array();
      }), this.polygonIndicesPool = new c.Pool(function() {
        return new Array();
      });
    }
    return M.prototype.triangulate = function(a) {
      var t = a, i = a.length >> 1, e = this.indicesArray;
      e.length = 0;
      for (var n = 0; n < i; n++)
        e[n] = n;
      var f = this.isConcaveArray;
      f.length = 0;
      for (var n = 0, h = i; n < h; ++n)
        f[n] = M.isConcave(n, i, t, e);
      var v = this.triangles;
      for (v.length = 0; i > 3; ) {
        for (var u = i - 1, n = 0, s = 1; ; ) {
          t: if (!f[n]) {
            for (var o = e[u] << 1, d = e[n] << 1, l = e[s] << 1, m = t[o], C = t[o + 1], S = t[d], D = t[d + 1], T = t[l], x = t[l + 1], g = (s + 1) % i; g != u; g = (g + 1) % i)
              if (f[g]) {
                var p = e[g] << 1, A = t[p], P = t[p + 1];
                if (M.positiveArea(T, x, m, C, A, P) && M.positiveArea(m, C, S, D, A, P) && M.positiveArea(S, D, T, x, A, P))
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
          u = n, n = s, s = (s + 1) % i;
        }
        v.push(e[(i + n - 1) % i]), v.push(e[n]), v.push(e[(n + 1) % i]), e.splice(n, 1), f.splice(n, 1), i--;
        var k = (i + n - 1) % i, O = n == i ? 0 : n;
        f[k] = M.isConcave(k, i, t, e), f[O] = M.isConcave(O, i, t, e);
      }
      return i == 3 && (v.push(e[2]), v.push(e[0]), v.push(e[1])), v;
    }, M.prototype.decompose = function(a, t) {
      var i = a, e = this.convexPolygons;
      this.polygonPool.freeAll(e), e.length = 0;
      var n = this.convexPolygonsIndices;
      this.polygonIndicesPool.freeAll(n), n.length = 0;
      var f = this.polygonIndicesPool.obtain();
      f.length = 0;
      var h = this.polygonPool.obtain();
      h.length = 0;
      for (var v = -1, u = 0, s = 0, o = t.length; s < o; s += 3) {
        var d = t[s] << 1, l = t[s + 1] << 1, m = t[s + 2] << 1, C = i[d], S = i[d + 1], D = i[l], T = i[l + 1], x = i[m], g = i[m + 1], p = !1;
        if (v == d) {
          var A = h.length - 4, P = M.winding(h[A], h[A + 1], h[A + 2], h[A + 3], x, g), k = M.winding(x, g, h[0], h[1], h[2], h[3]);
          P == u && k == u && (h.push(x), h.push(g), f.push(m), p = !0);
        }
        p || (h.length > 0 ? (e.push(h), n.push(f)) : (this.polygonPool.free(h), this.polygonIndicesPool.free(f)), h = this.polygonPool.obtain(), h.length = 0, h.push(C), h.push(S), h.push(D), h.push(T), h.push(x), h.push(g), f = this.polygonIndicesPool.obtain(), f.length = 0, f.push(d), f.push(l), f.push(m), u = M.winding(C, S, D, T, x, g), v = d);
      }
      h.length > 0 && (e.push(h), n.push(f));
      for (var s = 0, o = e.length; s < o; s++)
        if (f = n[s], f.length != 0) {
          var O = f[0], E = f[f.length - 1];
          h = e[s];
          for (var A = h.length - 4, V = h[A], N = h[A + 1], I = h[A + 2], y = h[A + 3], R = h[0], B = h[1], w = h[2], Z = h[3], W = M.winding(V, N, I, y, R, B), G = 0; G < o; G++)
            if (G != s) {
              var X = n[G];
              if (X.length == 3) {
                var Y = X[0], U = X[1], L = X[2], j = e[G], x = j[j.length - 2], g = j[j.length - 1];
                if (!(Y != O || U != E)) {
                  var P = M.winding(V, N, I, y, x, g), k = M.winding(x, g, R, B, w, Z);
                  P == W && k == W && (j.length = 0, X.length = 0, h.push(x), h.push(g), f.push(L), V = I, N = y, I = x, y = g, G = 0);
                }
              }
            }
        }
      for (var s = e.length - 1; s >= 0; s--)
        h = e[s], h.length == 0 && (e.splice(s, 1), this.polygonPool.free(h), f = n[s], n.splice(s, 1), this.polygonIndicesPool.free(f));
      return e;
    }, M.isConcave = function(a, t, i, e) {
      var n = e[(t + a - 1) % t] << 1, f = e[a] << 1, h = e[(a + 1) % t] << 1;
      return !this.positiveArea(i[n], i[n + 1], i[f], i[f + 1], i[h], i[h + 1]);
    }, M.positiveArea = function(a, t, i, e, n, f) {
      return a * (f - e) + i * (t - f) + n * (e - t) >= 0;
    }, M.winding = function(a, t, i, e, n, f) {
      var h = i - a, v = e - t;
      return n * v - f * h + h * t - a * v >= 0 ? 1 : -1;
    }, M;
  })();
  c.Triangulator = r;
})(F || (F = {}));
var F;
(function(c) {
  var r = (function() {
    function o() {
      this.array = new Array();
    }
    return o.prototype.add = function(d) {
      var l = this.contains(d);
      return this.array[d | 0] = d | 0, !l;
    }, o.prototype.contains = function(d) {
      return this.array[d | 0] != null;
    }, o.prototype.remove = function(d) {
      this.array[d | 0] = void 0;
    }, o.prototype.clear = function() {
      this.array.length = 0;
    }, o;
  })();
  c.IntSet = r;
  var M = (function() {
    function o(d, l, m, C) {
      d === void 0 && (d = 0), l === void 0 && (l = 0), m === void 0 && (m = 0), C === void 0 && (C = 0), this.r = d, this.g = l, this.b = m, this.a = C;
    }
    return o.prototype.set = function(d, l, m, C) {
      return this.r = d, this.g = l, this.b = m, this.a = C, this.clamp(), this;
    }, o.prototype.setFromColor = function(d) {
      return this.r = d.r, this.g = d.g, this.b = d.b, this.a = d.a, this;
    }, o.prototype.setFromString = function(d) {
      return d = d.charAt(0) == "#" ? d.substr(1) : d, this.r = parseInt(d.substr(0, 2), 16) / 255, this.g = parseInt(d.substr(2, 2), 16) / 255, this.b = parseInt(d.substr(4, 2), 16) / 255, this.a = (d.length != 8 ? 255 : parseInt(d.substr(6, 2), 16)) / 255, this;
    }, o.prototype.add = function(d, l, m, C) {
      return this.r += d, this.g += l, this.b += m, this.a += C, this.clamp(), this;
    }, o.prototype.clamp = function() {
      return this.r < 0 ? this.r = 0 : this.r > 1 && (this.r = 1), this.g < 0 ? this.g = 0 : this.g > 1 && (this.g = 1), this.b < 0 ? this.b = 0 : this.b > 1 && (this.b = 1), this.a < 0 ? this.a = 0 : this.a > 1 && (this.a = 1), this;
    }, o.rgba8888ToColor = function(d, l) {
      d.r = ((l & 4278190080) >>> 24) / 255, d.g = ((l & 16711680) >>> 16) / 255, d.b = ((l & 65280) >>> 8) / 255, d.a = (l & 255) / 255;
    }, o.rgb888ToColor = function(d, l) {
      d.r = ((l & 16711680) >>> 16) / 255, d.g = ((l & 65280) >>> 8) / 255, d.b = (l & 255) / 255;
    }, o.WHITE = new o(1, 1, 1, 1), o.RED = new o(1, 0, 0, 1), o.GREEN = new o(0, 1, 0, 1), o.BLUE = new o(0, 0, 1, 1), o.MAGENTA = new o(1, 0, 1, 1), o;
  })();
  c.Color = M;
  var a = (function() {
    function o() {
    }
    return o.clamp = function(d, l, m) {
      return d < l ? l : d > m ? m : d;
    }, o.cosDeg = function(d) {
      return Math.cos(d * o.degRad);
    }, o.sinDeg = function(d) {
      return Math.sin(d * o.degRad);
    }, o.signum = function(d) {
      return d > 0 ? 1 : d < 0 ? -1 : 0;
    }, o.toInt = function(d) {
      return d > 0 ? Math.floor(d) : Math.ceil(d);
    }, o.cbrt = function(d) {
      var l = Math.pow(Math.abs(d), 0.3333333333333333);
      return d < 0 ? -l : l;
    }, o.randomTriangular = function(d, l) {
      return o.randomTriangularWith(d, l, (d + l) * 0.5);
    }, o.randomTriangularWith = function(d, l, m) {
      var C = Math.random(), S = l - d;
      return C <= (m - d) / S ? d + Math.sqrt(C * S * (m - d)) : l - Math.sqrt((1 - C) * S * (l - m));
    }, o.PI = 3.1415927, o.PI2 = o.PI * 2, o.radiansToDegrees = 180 / o.PI, o.radDeg = o.radiansToDegrees, o.degreesToRadians = o.PI / 180, o.degRad = o.degreesToRadians, o;
  })();
  c.MathUtils = a;
  var t = (function() {
    function o() {
    }
    return o.prototype.apply = function(d, l, m) {
      return d + (l - d) * this.applyInternal(m);
    }, o;
  })();
  c.Interpolation = t;
  var i = (function(o) {
    Q(d, o);
    function d(l) {
      var m = o.call(this) || this;
      return m.power = 2, m.power = l, m;
    }
    return d.prototype.applyInternal = function(l) {
      return l <= 0.5 ? Math.pow(l * 2, this.power) / 2 : Math.pow((l - 1) * 2, this.power) / (this.power % 2 == 0 ? -2 : 2) + 1;
    }, d;
  })(t);
  c.Pow = i;
  var e = (function(o) {
    Q(d, o);
    function d(l) {
      return o.call(this, l) || this;
    }
    return d.prototype.applyInternal = function(l) {
      return Math.pow(l - 1, this.power) * (this.power % 2 == 0 ? -1 : 1) + 1;
    }, d;
  })(i);
  c.PowOut = e;
  var n = (function() {
    function o() {
    }
    return o.arrayCopy = function(d, l, m, C, S) {
      for (var D = l, T = C; D < l + S; D++, T++)
        m[T] = d[D];
    }, o.setArraySize = function(d, l, m) {
      m === void 0 && (m = 0);
      var C = d.length;
      if (C == l)
        return d;
      if (d.length = l, C < l)
        for (var S = C; S < l; S++)
          d[S] = m;
      return d;
    }, o.ensureArrayCapacity = function(d, l, m) {
      return m === void 0 && (m = 0), d.length >= l ? d : o.setArraySize(d, l, m);
    }, o.newArray = function(d, l) {
      for (var m = new Array(d), C = 0; C < d; C++)
        m[C] = l;
      return m;
    }, o.newFloatArray = function(d) {
      if (o.SUPPORTS_TYPED_ARRAYS)
        return new Float32Array(d);
      for (var l = new Array(d), m = 0; m < l.length; m++)
        l[m] = 0;
      return l;
    }, o.newShortArray = function(d) {
      if (o.SUPPORTS_TYPED_ARRAYS)
        return new Int16Array(d);
      for (var l = new Array(d), m = 0; m < l.length; m++)
        l[m] = 0;
      return l;
    }, o.toFloatArray = function(d) {
      return o.SUPPORTS_TYPED_ARRAYS ? new Float32Array(d) : d;
    }, o.toSinglePrecision = function(d) {
      return o.SUPPORTS_TYPED_ARRAYS ? Math.fround(d) : d;
    }, o.webkit602BugfixHelper = function(d, l) {
    }, o.contains = function(d, l, m) {
      for (var C = 0; C < d.length; C++)
        if (d[C] == l)
          return !0;
      return !1;
    }, o.SUPPORTS_TYPED_ARRAYS = typeof Float32Array < "u", o;
  })();
  c.Utils = n;
  var f = (function() {
    function o() {
    }
    return o.logBones = function(d) {
      for (var l = 0; l < d.bones.length; l++) {
        var m = d.bones[l];
        console.log(m.data.name + ", " + m.a + ", " + m.b + ", " + m.c + ", " + m.d + ", " + m.worldX + ", " + m.worldY);
      }
    }, o;
  })();
  c.DebugUtils = f;
  var h = (function() {
    function o(d) {
      this.items = new Array(), this.instantiator = d;
    }
    return o.prototype.obtain = function() {
      return this.items.length > 0 ? this.items.pop() : this.instantiator();
    }, o.prototype.free = function(d) {
      d.reset && d.reset(), this.items.push(d);
    }, o.prototype.freeAll = function(d) {
      for (var l = 0; l < d.length; l++)
        this.free(d[l]);
    }, o.prototype.clear = function() {
      this.items.length = 0;
    }, o;
  })();
  c.Pool = h;
  var v = (function() {
    function o(d, l) {
      d === void 0 && (d = 0), l === void 0 && (l = 0), this.x = d, this.y = l;
    }
    return o.prototype.set = function(d, l) {
      return this.x = d, this.y = l, this;
    }, o.prototype.length = function() {
      var d = this.x, l = this.y;
      return Math.sqrt(d * d + l * l);
    }, o.prototype.normalize = function() {
      var d = this.length();
      return d != 0 && (this.x /= d, this.y /= d), this;
    }, o;
  })();
  c.Vector2 = v;
  var u = (function() {
    function o() {
      this.maxDelta = 0.064, this.framesPerSecond = 0, this.delta = 0, this.totalTime = 0, this.lastTime = Date.now() / 1e3, this.frameCount = 0, this.frameTime = 0;
    }
    return o.prototype.update = function() {
      var d = Date.now() / 1e3;
      this.delta = d - this.lastTime, this.frameTime += this.delta, this.totalTime += this.delta, this.delta > this.maxDelta && (this.delta = this.maxDelta), this.lastTime = d, this.frameCount++, this.frameTime > 1 && (this.framesPerSecond = this.frameCount / this.frameTime, this.frameTime = 0, this.frameCount = 0);
    }, o;
  })();
  c.TimeKeeper = u;
  var s = (function() {
    function o(d) {
      d === void 0 && (d = 32), this.addedValues = 0, this.lastValue = 0, this.mean = 0, this.dirty = !0, this.values = new Array(d);
    }
    return o.prototype.hasEnoughData = function() {
      return this.addedValues >= this.values.length;
    }, o.prototype.addValue = function(d) {
      this.addedValues < this.values.length && this.addedValues++, this.values[this.lastValue++] = d, this.lastValue > this.values.length - 1 && (this.lastValue = 0), this.dirty = !0;
    }, o.prototype.getMean = function() {
      if (this.hasEnoughData()) {
        if (this.dirty) {
          for (var d = 0, l = 0; l < this.values.length; l++)
            d += this.values[l];
          this.mean = d / this.values.length, this.dirty = !1;
        }
        return this.mean;
      } else
        return 0;
    }, o;
  })();
  c.WindowedMean = s;
})(F || (F = {}));
(function() {
  Math.fround || (Math.fround = /* @__PURE__ */ (function(c) {
    return function(r) {
      return c[0] = r, c[0];
    };
  })(new Float32Array(1)));
})();
var F;
(function(c) {
  var r = /* @__PURE__ */ (function() {
    function a(t) {
      if (t == null)
        throw new Error("name cannot be null.");
      this.name = t;
    }
    return a;
  })();
  c.Attachment = r;
  var M = (function(a) {
    Q(t, a);
    function t(i) {
      var e = a.call(this, i) || this;
      return e.id = (t.nextID++ & 65535) << 11, e.worldVerticesLength = 0, e.deformAttachment = e, e;
    }
    return t.prototype.computeWorldVertices = function(i, e, n, f, h, v) {
      n = h + (n >> 1) * v;
      var u = i.bone.skeleton, s = i.deform, o = this.vertices, d = this.bones;
      if (d == null) {
        s.length > 0 && (o = s);
        for (var l = i.bone, m = l.worldX, C = l.worldY, S = l.a, D = l.b, T = l.c, x = l.d, g = e, p = h; p < n; g += 2, p += v) {
          var A = o[g], P = o[g + 1];
          f[p] = A * S + P * D + m, f[p + 1] = A * T + P * x + C;
        }
        return;
      }
      for (var k = 0, O = 0, E = 0; E < e; E += 2) {
        var V = d[k];
        k += V + 1, O += V;
      }
      var N = u.bones;
      if (s.length == 0)
        for (var p = h, D = O * 3; p < n; p += v) {
          var I = 0, y = 0, V = d[k++];
          for (V += k; k < V; k++, D += 3) {
            var l = N[d[k]], A = o[D], P = o[D + 1], R = o[D + 2];
            I += (A * l.a + P * l.b + l.worldX) * R, y += (A * l.c + P * l.d + l.worldY) * R;
          }
          f[p] = I, f[p + 1] = y;
        }
      else
        for (var B = s, p = h, D = O * 3, w = O << 1; p < n; p += v) {
          var I = 0, y = 0, V = d[k++];
          for (V += k; k < V; k++, D += 3, w += 2) {
            var l = N[d[k]], A = o[D] + B[w], P = o[D + 1] + B[w + 1], R = o[D + 2];
            I += (A * l.a + P * l.b + l.worldX) * R, y += (A * l.c + P * l.d + l.worldY) * R;
          }
          f[p] = I, f[p + 1] = y;
        }
    }, t.prototype.copyTo = function(i) {
      this.bones != null ? (i.bones = new Array(this.bones.length), c.Utils.arrayCopy(this.bones, 0, i.bones, 0, this.bones.length)) : i.bones = null, this.vertices != null ? (i.vertices = c.Utils.newFloatArray(this.vertices.length), c.Utils.arrayCopy(this.vertices, 0, i.vertices, 0, this.vertices.length)) : i.vertices = null, i.worldVerticesLength = this.worldVerticesLength, i.deformAttachment = this.deformAttachment;
    }, t.nextID = 0, t;
  })(r);
  c.VertexAttachment = M;
})(F || (F = {}));
var F;
(function(c) {
  (function(r) {
    r[r.Region = 0] = "Region", r[r.BoundingBox = 1] = "BoundingBox", r[r.Mesh = 2] = "Mesh", r[r.LinkedMesh = 3] = "LinkedMesh", r[r.Path = 4] = "Path", r[r.Point = 5] = "Point", r[r.Clipping = 6] = "Clipping";
  })(c.AttachmentType || (c.AttachmentType = {}));
})(F || (F = {}));
var F;
(function(c) {
  var r = (function(M) {
    Q(a, M);
    function a(t) {
      var i = M.call(this, t) || this;
      return i.color = new c.Color(1, 1, 1, 1), i;
    }
    return a.prototype.copy = function() {
      var t = new a(this.name);
      return this.copyTo(t), t.color.setFromColor(this.color), t;
    }, a;
  })(c.VertexAttachment);
  c.BoundingBoxAttachment = r;
})(F || (F = {}));
var F;
(function(c) {
  var r = (function(M) {
    Q(a, M);
    function a(t) {
      var i = M.call(this, t) || this;
      return i.color = new c.Color(0.2275, 0.2275, 0.8078, 1), i;
    }
    return a.prototype.copy = function() {
      var t = new a(this.name);
      return this.copyTo(t), t.endSlot = this.endSlot, t.color.setFromColor(this.color), t;
    }, a;
  })(c.VertexAttachment);
  c.ClippingAttachment = r;
})(F || (F = {}));
var F;
(function(c) {
  var r = (function(M) {
    Q(a, M);
    function a(t) {
      var i = M.call(this, t) || this;
      return i.color = new c.Color(1, 1, 1, 1), i.tempColor = new c.Color(0, 0, 0, 0), i;
    }
    return a.prototype.updateUVs = function() {
      var t = this.regionUVs;
      (this.uvs == null || this.uvs.length != t.length) && (this.uvs = c.Utils.newFloatArray(t.length));
      var i = this.uvs, e = this.uvs.length, n = this.region.u, f = this.region.v, h = 0, v = 0;
      if (this.region instanceof c.TextureAtlasRegion) {
        var u = this.region, s = u.texture.getImage().width, o = u.texture.getImage().height;
        switch (u.degrees) {
          case 90:
            n -= (u.originalHeight - u.offsetY - u.height) / s, f -= (u.originalWidth - u.offsetX - u.width) / o, h = u.originalHeight / s, v = u.originalWidth / o;
            for (var d = 0; d < e; d += 2)
              i[d] = n + t[d + 1] * h, i[d + 1] = f + (1 - t[d]) * v;
            return;
          case 180:
            n -= (u.originalWidth - u.offsetX - u.width) / s, f -= u.offsetY / o, h = u.originalWidth / s, v = u.originalHeight / o;
            for (var d = 0; d < e; d += 2)
              i[d] = n + (1 - t[d]) * h, i[d + 1] = f + (1 - t[d + 1]) * v;
            return;
          case 270:
            n -= u.offsetY / s, f -= u.offsetX / o, h = u.originalHeight / s, v = u.originalWidth / o;
            for (var d = 0; d < e; d += 2)
              i[d] = n + (1 - t[d + 1]) * h, i[d + 1] = f + t[d] * v;
            return;
        }
        n -= u.offsetX / s, f -= (u.originalHeight - u.offsetY - u.height) / o, h = u.originalWidth / s, v = u.originalHeight / o;
      } else this.region == null ? (n = f = 0, h = v = 1) : (h = this.region.u2 - n, v = this.region.v2 - f);
      for (var d = 0; d < e; d += 2)
        i[d] = n + t[d] * h, i[d + 1] = f + t[d + 1] * v;
    }, a.prototype.getParentMesh = function() {
      return this.parentMesh;
    }, a.prototype.setParentMesh = function(t) {
      this.parentMesh = t, t != null && (this.bones = t.bones, this.vertices = t.vertices, this.worldVerticesLength = t.worldVerticesLength, this.regionUVs = t.regionUVs, this.triangles = t.triangles, this.hullLength = t.hullLength, this.worldVerticesLength = t.worldVerticesLength);
    }, a.prototype.copy = function() {
      if (this.parentMesh != null)
        return this.newLinkedMesh();
      var t = new a(this.name);
      return t.region = this.region, t.path = this.path, t.color.setFromColor(this.color), this.copyTo(t), t.regionUVs = new Array(this.regionUVs.length), c.Utils.arrayCopy(this.regionUVs, 0, t.regionUVs, 0, this.regionUVs.length), t.uvs = new Array(this.uvs.length), c.Utils.arrayCopy(this.uvs, 0, t.uvs, 0, this.uvs.length), t.triangles = new Array(this.triangles.length), c.Utils.arrayCopy(this.triangles, 0, t.triangles, 0, this.triangles.length), t.hullLength = this.hullLength, this.edges != null && (t.edges = new Array(this.edges.length), c.Utils.arrayCopy(this.edges, 0, t.edges, 0, this.edges.length)), t.width = this.width, t.height = this.height, t;
    }, a.prototype.newLinkedMesh = function() {
      var t = new a(this.name);
      return t.region = this.region, t.path = this.path, t.color.setFromColor(this.color), t.deformAttachment = this.deformAttachment, t.setParentMesh(this.parentMesh != null ? this.parentMesh : this), t.updateUVs(), t;
    }, a;
  })(c.VertexAttachment);
  c.MeshAttachment = r;
})(F || (F = {}));
var F;
(function(c) {
  var r = (function(M) {
    Q(a, M);
    function a(t) {
      var i = M.call(this, t) || this;
      return i.closed = !1, i.constantSpeed = !1, i.color = new c.Color(1, 1, 1, 1), i;
    }
    return a.prototype.copy = function() {
      var t = new a(this.name);
      return this.copyTo(t), t.lengths = new Array(this.lengths.length), c.Utils.arrayCopy(this.lengths, 0, t.lengths, 0, this.lengths.length), t.closed = closed, t.constantSpeed = this.constantSpeed, t.color.setFromColor(this.color), t;
    }, a;
  })(c.VertexAttachment);
  c.PathAttachment = r;
})(F || (F = {}));
var F;
(function(c) {
  var r = (function(M) {
    Q(a, M);
    function a(t) {
      var i = M.call(this, t) || this;
      return i.color = new c.Color(0.38, 0.94, 0, 1), i;
    }
    return a.prototype.computeWorldPosition = function(t, i) {
      return i.x = this.x * t.a + this.y * t.b + t.worldX, i.y = this.x * t.c + this.y * t.d + t.worldY, i;
    }, a.prototype.computeWorldRotation = function(t) {
      var i = c.MathUtils.cosDeg(this.rotation), e = c.MathUtils.sinDeg(this.rotation), n = i * t.a + e * t.b, f = i * t.c + e * t.d;
      return Math.atan2(f, n) * c.MathUtils.radDeg;
    }, a.prototype.copy = function() {
      var t = new a(this.name);
      return t.x = this.x, t.y = this.y, t.rotation = this.rotation, t.color.setFromColor(this.color), t;
    }, a;
  })(c.VertexAttachment);
  c.PointAttachment = r;
})(F || (F = {}));
var F;
(function(c) {
  var r = (function(M) {
    Q(a, M);
    function a(t) {
      var i = M.call(this, t) || this;
      return i.x = 0, i.y = 0, i.scaleX = 1, i.scaleY = 1, i.rotation = 0, i.width = 0, i.height = 0, i.color = new c.Color(1, 1, 1, 1), i.offset = c.Utils.newFloatArray(8), i.uvs = c.Utils.newFloatArray(8), i.tempColor = new c.Color(1, 1, 1, 1), i;
    }
    return a.prototype.updateOffset = function() {
      var t = this.width / this.region.originalWidth * this.scaleX, i = this.height / this.region.originalHeight * this.scaleY, e = -this.width / 2 * this.scaleX + this.region.offsetX * t, n = -this.height / 2 * this.scaleY + this.region.offsetY * i, f = e + this.region.width * t, h = n + this.region.height * i, v = this.rotation * Math.PI / 180, u = Math.cos(v), s = Math.sin(v), o = e * u + this.x, d = e * s, l = n * u + this.y, m = n * s, C = f * u + this.x, S = f * s, D = h * u + this.y, T = h * s, x = this.offset;
      x[a.OX1] = o - m, x[a.OY1] = l + d, x[a.OX2] = o - T, x[a.OY2] = D + d, x[a.OX3] = C - T, x[a.OY3] = D + S, x[a.OX4] = C - m, x[a.OY4] = l + S;
    }, a.prototype.setRegion = function(t) {
      this.region = t;
      var i = this.uvs;
      t.rotate ? (i[2] = t.u, i[3] = t.v2, i[4] = t.u, i[5] = t.v, i[6] = t.u2, i[7] = t.v, i[0] = t.u2, i[1] = t.v2) : (i[0] = t.u, i[1] = t.v2, i[2] = t.u, i[3] = t.v, i[4] = t.u2, i[5] = t.v, i[6] = t.u2, i[7] = t.v2);
    }, a.prototype.computeWorldVertices = function(t, i, e, n) {
      var f = this.offset, h = t.worldX, v = t.worldY, u = t.a, s = t.b, o = t.c, d = t.d, l = 0, m = 0;
      l = f[a.OX1], m = f[a.OY1], i[e] = l * u + m * s + h, i[e + 1] = l * o + m * d + v, e += n, l = f[a.OX2], m = f[a.OY2], i[e] = l * u + m * s + h, i[e + 1] = l * o + m * d + v, e += n, l = f[a.OX3], m = f[a.OY3], i[e] = l * u + m * s + h, i[e + 1] = l * o + m * d + v, e += n, l = f[a.OX4], m = f[a.OY4], i[e] = l * u + m * s + h, i[e + 1] = l * o + m * d + v;
    }, a.prototype.copy = function() {
      var t = new a(this.name);
      return t.region = this.region, t.rendererObject = this.rendererObject, t.path = this.path, t.x = this.x, t.y = this.y, t.scaleX = this.scaleX, t.scaleY = this.scaleY, t.rotation = this.rotation, t.width = this.width, t.height = this.height, c.Utils.arrayCopy(this.uvs, 0, t.uvs, 0, 8), c.Utils.arrayCopy(this.offset, 0, t.offset, 0, 8), t.color.setFromColor(this.color), t;
    }, a.OX1 = 0, a.OY1 = 1, a.OX2 = 2, a.OY2 = 3, a.OX3 = 4, a.OY3 = 5, a.OX4 = 6, a.OY4 = 7, a.X1 = 0, a.Y1 = 1, a.C1R = 2, a.C1G = 3, a.C1B = 4, a.C1A = 5, a.U1 = 6, a.V1 = 7, a.X2 = 8, a.Y2 = 9, a.C2R = 10, a.C2G = 11, a.C2B = 12, a.C2A = 13, a.U2 = 14, a.V2 = 15, a.X3 = 16, a.Y3 = 17, a.C3R = 18, a.C3G = 19, a.C3B = 20, a.C3A = 21, a.U3 = 22, a.V3 = 23, a.X4 = 24, a.Y4 = 25, a.C4R = 26, a.C4G = 27, a.C4B = 28, a.C4A = 29, a.U4 = 30, a.V4 = 31, a;
  })(c.Attachment);
  c.RegionAttachment = r;
})(F || (F = {}));
var F;
(function(c) {
  var r = (function() {
    function M(a, t) {
      this.jitterX = 0, this.jitterY = 0, this.jitterX = a, this.jitterY = t;
    }
    return M.prototype.begin = function(a) {
    }, M.prototype.transform = function(a, t, i, e) {
      a.x += c.MathUtils.randomTriangular(-this.jitterX, this.jitterY), a.y += c.MathUtils.randomTriangular(-this.jitterX, this.jitterY);
    }, M.prototype.end = function() {
    }, M;
  })();
  c.JitterEffect = r;
})(F || (F = {}));
var F;
(function(c) {
  var r = (function() {
    function M(a) {
      this.centerX = 0, this.centerY = 0, this.radius = 0, this.angle = 0, this.worldX = 0, this.worldY = 0, this.radius = a;
    }
    return M.prototype.begin = function(a) {
      this.worldX = a.x + this.centerX, this.worldY = a.y + this.centerY;
    }, M.prototype.transform = function(a, t, i, e) {
      var n = this.angle * c.MathUtils.degreesToRadians, f = a.x - this.worldX, h = a.y - this.worldY, v = Math.sqrt(f * f + h * h);
      if (v < this.radius) {
        var u = M.interpolation.apply(0, n, (this.radius - v) / this.radius), s = Math.cos(u), o = Math.sin(u);
        a.x = s * f - o * h + this.worldX, a.y = o * f + s * h + this.worldY;
      }
    }, M.prototype.end = function() {
    }, M.interpolation = new c.PowOut(2), M;
  })();
  c.SwirlEffect = r;
})(F || (F = {}));
var F;
(function(c) {
  (function(r) {
    var M = (function(a) {
      Q(t, a);
      function t(i, e) {
        return e === void 0 && (e = ""), a.call(this, function(n) {
          return new c.webgl.GLTexture(i, n);
        }, e) || this;
      }
      return t;
    })(c.AssetManager);
    r.AssetManager = M;
  })(c.webgl || (c.webgl = {}));
})(F || (F = {}));
var F;
(function(c) {
  (function(r) {
    var M = (function() {
      function a(t, i) {
        this.position = new r.Vector3(0, 0, 0), this.direction = new r.Vector3(0, 0, -1), this.up = new r.Vector3(0, 1, 0), this.near = 0, this.far = 100, this.zoom = 1, this.viewportWidth = 0, this.viewportHeight = 0, this.projectionView = new r.Matrix4(), this.inverseProjectionView = new r.Matrix4(), this.projection = new r.Matrix4(), this.view = new r.Matrix4(), this.tmp = new r.Vector3(), this.viewportWidth = t, this.viewportHeight = i, this.update();
      }
      return a.prototype.update = function() {
        var t = this.projection, i = this.view, e = this.projectionView, n = this.inverseProjectionView, f = this.zoom, h = this.viewportWidth, v = this.viewportHeight;
        t.ortho(f * (-h / 2), f * (h / 2), f * (-v / 2), f * (v / 2), this.near, this.far), i.lookAt(this.position, this.direction, this.up), e.set(t.values), e.multiply(i), n.set(e.values).invert();
      }, a.prototype.screenToWorld = function(t, i, e) {
        var n = t.x, f = e - t.y - 1, h = this.tmp;
        return h.x = 2 * n / i - 1, h.y = 2 * f / e - 1, h.z = 2 * t.z - 1, h.project(this.inverseProjectionView), t.set(h.x, h.y, h.z), t;
      }, a.prototype.setViewport = function(t, i) {
        this.viewportWidth = t, this.viewportHeight = i;
      }, a;
    })();
    r.OrthoCamera = M;
  })(c.webgl || (c.webgl = {}));
})(F || (F = {}));
var F;
(function(c) {
  (function(r) {
    var M = (function(a) {
      Q(t, a);
      function t(i, e, n) {
        n === void 0 && (n = !1);
        var f = a.call(this, e) || this;
        return f.texture = null, f.boundUnit = 0, f.useMipMaps = !1, f.context = i instanceof r.ManagedWebGLRenderingContext ? i : new r.ManagedWebGLRenderingContext(i), f.useMipMaps = n, f.restore(), f.context.addRestorable(f), f;
      }
      return t.prototype.setFilters = function(i, e) {
        var n = this.context.gl;
        this.bind(), n.texParameteri(n.TEXTURE_2D, n.TEXTURE_MIN_FILTER, i), n.texParameteri(n.TEXTURE_2D, n.TEXTURE_MAG_FILTER, t.validateMagFilter(e));
      }, t.validateMagFilter = function(i) {
        switch (i) {
          case c.TextureFilter.MipMap:
          case c.TextureFilter.MipMapLinearLinear:
          case c.TextureFilter.MipMapLinearNearest:
          case c.TextureFilter.MipMapNearestLinear:
          case c.TextureFilter.MipMapNearestNearest:
            return c.TextureFilter.Linear;
          default:
            return i;
        }
      }, t.prototype.setWraps = function(i, e) {
        var n = this.context.gl;
        this.bind(), n.texParameteri(n.TEXTURE_2D, n.TEXTURE_WRAP_S, i), n.texParameteri(n.TEXTURE_2D, n.TEXTURE_WRAP_T, e);
      }, t.prototype.update = function(i) {
        var e = this.context.gl;
        this.texture || (this.texture = this.context.gl.createTexture()), this.bind(), t.DISABLE_UNPACK_PREMULTIPLIED_ALPHA_WEBGL && e.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL, !1), e.texImage2D(e.TEXTURE_2D, 0, e.RGBA, e.RGBA, e.UNSIGNED_BYTE, this._image), e.texParameteri(e.TEXTURE_2D, e.TEXTURE_MAG_FILTER, e.LINEAR), e.texParameteri(e.TEXTURE_2D, e.TEXTURE_MIN_FILTER, i ? e.LINEAR_MIPMAP_LINEAR : e.LINEAR), e.texParameteri(e.TEXTURE_2D, e.TEXTURE_WRAP_S, e.CLAMP_TO_EDGE), e.texParameteri(e.TEXTURE_2D, e.TEXTURE_WRAP_T, e.CLAMP_TO_EDGE), i && e.generateMipmap(e.TEXTURE_2D);
      }, t.prototype.restore = function() {
        this.texture = null, this.update(this.useMipMaps);
      }, t.prototype.bind = function(i) {
        i === void 0 && (i = 0);
        var e = this.context.gl;
        this.boundUnit = i, e.activeTexture(e.TEXTURE0 + i), e.bindTexture(e.TEXTURE_2D, this.texture);
      }, t.prototype.unbind = function() {
        var i = this.context.gl;
        i.activeTexture(i.TEXTURE0 + this.boundUnit), i.bindTexture(i.TEXTURE_2D, null);
      }, t.prototype.dispose = function() {
        this.context.removeRestorable(this);
        var i = this.context.gl;
        i.deleteTexture(this.texture);
      }, t.DISABLE_UNPACK_PREMULTIPLIED_ALPHA_WEBGL = !1, t;
    })(c.Texture);
    r.GLTexture = M;
  })(c.webgl || (c.webgl = {}));
})(F || (F = {}));
var F;
(function(c) {
  (function(r) {
    var M = (function() {
      function t(i) {
        this.lastX = 0, this.lastY = 0, this.buttonDown = !1, this.currTouch = null, this.touchesPool = new c.Pool(function() {
          return new c.webgl.Touch(0, 0, 0);
        }), this.listeners = new Array(), this.element = i, this.setupCallbacks(i);
      }
      return t.prototype.setupCallbacks = function(i) {
        var e = this, n = function(v) {
          if (v instanceof MouseEvent) {
            for (var u = i.getBoundingClientRect(), s = v.clientX - u.left, o = v.clientY - u.top, d = e.listeners, l = 0; l < d.length; l++)
              d[l].down && d[l].down(s, o);
            e.lastX = s, e.lastY = o, e.buttonDown = !0, document.addEventListener("mousemove", f), document.addEventListener("mouseup", h);
          }
        }, f = function(v) {
          if (v instanceof MouseEvent) {
            for (var u = i.getBoundingClientRect(), s = v.clientX - u.left, o = v.clientY - u.top, d = e.listeners, l = 0; l < d.length; l++)
              e.buttonDown ? d[l].dragged && d[l].dragged(s, o) : d[l].moved && d[l].moved(s, o);
            e.lastX = s, e.lastY = o;
          }
        }, h = function(v) {
          if (v instanceof MouseEvent) {
            for (var u = i.getBoundingClientRect(), s = v.clientX - u.left, o = v.clientY - u.top, d = e.listeners, l = 0; l < d.length; l++)
              d[l].up && d[l].up(s, o);
            e.lastX = s, e.lastY = o, e.buttonDown = !1, document.removeEventListener("mousemove", f), document.removeEventListener("mouseup", h);
          }
        };
        i.addEventListener("mousedown", n, !0), i.addEventListener("mousemove", f, !0), i.addEventListener("mouseup", h, !0), i.addEventListener("touchstart", function(v) {
          if (e.currTouch == null) {
            for (var u = v.changedTouches, s = 0; s < u.length; s++) {
              var o = u[s], d = i.getBoundingClientRect(), l = o.clientX - d.left, m = o.clientY - d.top;
              e.currTouch = e.touchesPool.obtain(), e.currTouch.identifier = o.identifier, e.currTouch.x = l, e.currTouch.y = m;
              break;
            }
            for (var C = e.listeners, S = 0; S < C.length; S++)
              C[S].down && C[S].down(e.currTouch.x, e.currTouch.y);
            e.lastX = e.currTouch.x, e.lastY = e.currTouch.y, e.buttonDown = !0, v.preventDefault();
          }
        }, !1), i.addEventListener("touchend", function(v) {
          for (var u = v.changedTouches, s = 0; s < u.length; s++) {
            var o = u[s];
            if (e.currTouch.identifier === o.identifier) {
              var d = i.getBoundingClientRect(), l = e.currTouch.x = o.clientX - d.left, m = e.currTouch.y = o.clientY - d.top;
              e.touchesPool.free(e.currTouch);
              for (var C = e.listeners, S = 0; S < C.length; S++)
                C[S].up && C[S].up(l, m);
              e.lastX = l, e.lastY = m, e.buttonDown = !1, e.currTouch = null;
              break;
            }
          }
          v.preventDefault();
        }, !1), i.addEventListener("touchcancel", function(v) {
          for (var u = v.changedTouches, s = 0; s < u.length; s++) {
            var o = u[s];
            if (e.currTouch.identifier === o.identifier) {
              var d = i.getBoundingClientRect(), l = e.currTouch.x = o.clientX - d.left, m = e.currTouch.y = o.clientY - d.top;
              e.touchesPool.free(e.currTouch);
              for (var C = e.listeners, S = 0; S < C.length; S++)
                C[S].up && C[S].up(l, m);
              e.lastX = l, e.lastY = m, e.buttonDown = !1, e.currTouch = null;
              break;
            }
          }
          v.preventDefault();
        }, !1), i.addEventListener("touchmove", function(v) {
          if (e.currTouch != null) {
            for (var u = v.changedTouches, s = 0; s < u.length; s++) {
              var o = u[s];
              if (e.currTouch.identifier === o.identifier) {
                for (var d = i.getBoundingClientRect(), l = o.clientX - d.left, m = o.clientY - d.top, C = e.listeners, S = 0; S < C.length; S++)
                  C[S].dragged && C[S].dragged(l, m);
                e.lastX = e.currTouch.x = l, e.lastY = e.currTouch.y = m;
                break;
              }
            }
            v.preventDefault();
          }
        }, !1);
      }, t.prototype.addListener = function(i) {
        this.listeners.push(i);
      }, t.prototype.removeListener = function(i) {
        var e = this.listeners.indexOf(i);
        e > -1 && this.listeners.splice(e, 1);
      }, t;
    })();
    r.Input = M;
    var a = /* @__PURE__ */ (function() {
      function t(i, e, n) {
        this.identifier = i, this.x = e, this.y = n;
      }
      return t;
    })();
    r.Touch = a;
  })(c.webgl || (c.webgl = {}));
})(F || (F = {}));
var F;
(function(c) {
  (function(r) {
    var M = (function() {
      function a(t) {
        if (this.logo = null, this.spinner = null, this.angle = 0, this.fadeOut = 0, this.timeKeeper = new c.TimeKeeper(), this.backgroundColor = new c.Color(0.135, 0.135, 0.135, 1), this.tempColor = new c.Color(), this.firstDraw = 0, this.renderer = t, this.timeKeeper.maxDelta = 9, a.logoImg === null) {
          var i = navigator.userAgent.indexOf("Safari") > -1;
          a.logoImg = new Image(), a.logoImg.src = a.SPINE_LOGO_DATA, i || (a.logoImg.crossOrigin = "anonymous"), a.logoImg.onload = function(e) {
            a.loaded++;
          }, a.spinnerImg = new Image(), a.spinnerImg.src = a.SPINNER_DATA, i || (a.spinnerImg.crossOrigin = "anonymous"), a.spinnerImg.onload = function(e) {
            a.loaded++;
          };
        }
      }
      return a.prototype.draw = function(t) {
        if (t === void 0 && (t = !1), !(t && this.fadeOut > a.FADE_SECONDS)) {
          this.timeKeeper.update();
          var i = Math.abs(Math.sin(this.timeKeeper.totalTime + 0.75));
          this.angle -= this.timeKeeper.delta / 1.4 * 360 * (1 + 1.5 * Math.pow(i, 5));
          var e = this.renderer, n = e.canvas, f = e.context.gl;
          e.resize(r.ResizeMode.Stretch);
          var h = e.camera.position.x, v = e.camera.position.y;
          if (e.camera.position.set(n.width / 2, n.height / 2, 0), e.camera.viewportWidth = n.width, e.camera.viewportHeight = n.height, !t)
            f.clearColor(this.backgroundColor.r, this.backgroundColor.g, this.backgroundColor.b, this.backgroundColor.a), f.clear(f.COLOR_BUFFER_BIT), this.tempColor.a = 1;
          else {
            if (this.fadeOut += this.timeKeeper.delta * (this.timeKeeper.totalTime < 1 ? 2 : 1), this.fadeOut > a.FADE_SECONDS) {
              e.camera.position.set(h, v, 0);
              return;
            }
            i = 1 - this.fadeOut / a.FADE_SECONDS, this.tempColor.setFromColor(this.backgroundColor), this.tempColor.a = 1 - (i - 1) * (i - 1), e.begin(), e.quad(!0, 0, 0, n.width, 0, n.width, n.height, 0, n.height, this.tempColor, this.tempColor, this.tempColor, this.tempColor), e.end();
          }
          if (this.tempColor.set(1, 1, 1, this.tempColor.a), a.loaded == 2) {
            this.logo === null && (this.logo = new r.GLTexture(e.context, a.logoImg), this.spinner = new r.GLTexture(e.context, a.spinnerImg)), this.logo.update(!1), this.spinner.update(!1);
            var u = this.logo.getImage().width, s = this.logo.getImage().height, o = this.spinner.getImage().width, d = this.spinner.getImage().height;
            e.batcher.setBlendMode(f.SRC_ALPHA, f.ONE_MINUS_SRC_ALPHA), e.begin(), e.drawTexture(this.logo, (n.width - u) / 2, (n.height - s) / 2, u, s, this.tempColor), e.drawTextureRotated(this.spinner, (n.width - o) / 2, (n.height - d) / 2, o, d, o / 2, d / 2, this.angle, this.tempColor), e.end(), e.camera.position.set(h, v, 0);
          }
        }
      }, a.FADE_SECONDS = 1, a.loaded = 0, a.spinnerImg = null, a.logoImg = null, a.SPINNER_DATA = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAKMAAACjCAYAAADmbK6AAAAACXBIWXMAAAsTAAALEwEAmpwYAAALB2lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDIgNzkuMTYwOTI0LCAyMDE3LzA3LzEzLTAxOjA2OjM5ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0RXZ0PSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VFdmVudCMiIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczpwaG90b3Nob3A9Imh0dHA6Ly9ucy5hZG9iZS5jb20vcGhvdG9zaG9wLzEuMC8iIHhtbG5zOnRpZmY9Imh0dHA6Ly9ucy5hZG9iZS5jb20vdGlmZi8xLjAvIiB4bWxuczpleGlmPSJodHRwOi8vbnMuYWRvYmUuY29tL2V4aWYvMS4wLyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxNS41IChXaW5kb3dzKSIgeG1wOkNyZWF0ZURhdGU9IjIwMTYtMDktMDhUMTQ6MjU6MTIrMDI6MDAiIHhtcDpNZXRhZGF0YURhdGU9IjIwMTgtMTEtMTVUMTY6NDA6NTkrMDE6MDAiIHhtcDpNb2RpZnlEYXRlPSIyMDE4LTExLTE1VDE2OjQwOjU5KzAxOjAwIiBkYzpmb3JtYXQ9ImltYWdlL3BuZyIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpmZDhlNTljMC02NGJjLTIxNGQtODAyZi1jZDlhODJjM2ZjMGMiIHhtcE1NOkRvY3VtZW50SUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDpmYmNmZWJlYS03MjY2LWE0NGQtOTI4NS0wOTJmNGNhYzk4ZWEiIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDowODMzNWIyYy04NzYyLWQzNGMtOTBhOS02ODJjYjJmYTQ2M2UiIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHRpZmY6T3JpZW50YXRpb249IjEiIHRpZmY6WFJlc29sdXRpb249IjcyMDAwMC8xMDAwMCIgdGlmZjpZUmVzb2x1dGlvbj0iNzIwMDAwLzEwMDAwIiB0aWZmOlJlc29sdXRpb25Vbml0PSIyIiBleGlmOkNvbG9yU3BhY2U9IjY1NTM1IiBleGlmOlBpeGVsWERpbWVuc2lvbj0iMjk3IiBleGlmOlBpeGVsWURpbWVuc2lvbj0iMjQyIj4gPHhtcE1NOkhpc3Rvcnk+IDxyZGY6U2VxPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0iY3JlYXRlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDowODMzNWIyYy04NzYyLWQzNGMtOTBhOS02ODJjYjJmYTQ2M2UiIHN0RXZ0OndoZW49IjIwMTYtMDktMDhUMTQ6MjU6MTIrMDI6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE1LjUgKFdpbmRvd3MpIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDpiNThlMTlkNi0xYTRjLTQyNDEtODU0ZC01MDVlZjYxMjRhODQiIHN0RXZ0OndoZW49IjIwMTgtMTEtMTVUMTY6NDA6MjMrMDE6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCBDQyAoV2luZG93cykiIHN0RXZ0OmNoYW5nZWQ9Ii8iLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249InNhdmVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjQ3YzYzYzIwLWJkYjgtYzM0YS1hYzMyLWQ5MDdjOWEyOTA0MCIgc3RFdnQ6d2hlbj0iMjAxOC0xMS0xNVQxNjo0MDo1OSswMTowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0iY29udmVydGVkIiBzdEV2dDpwYXJhbWV0ZXJzPSJmcm9tIGFwcGxpY2F0aW9uL3ZuZC5hZG9iZS5waG90b3Nob3AgdG8gaW1hZ2UvcG5nIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJkZXJpdmVkIiBzdEV2dDpwYXJhbWV0ZXJzPSJjb252ZXJ0ZWQgZnJvbSBhcHBsaWNhdGlvbi92bmQuYWRvYmUucGhvdG9zaG9wIHRvIGltYWdlL3BuZyIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6ZmQ4ZTU5YzAtNjRiYy0yMTRkLTgwMmYtY2Q5YTgyYzNmYzBjIiBzdEV2dDp3aGVuPSIyMDE4LTExLTE1VDE2OjQwOjU5KzAxOjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgQ0MgKFdpbmRvd3MpIiBzdEV2dDpjaGFuZ2VkPSIvIi8+IDwvcmRmOlNlcT4gPC94bXBNTTpIaXN0b3J5PiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo0N2M2M2MyMC1iZGI4LWMzNGEtYWMzMi1kOTA3YzlhMjkwNDAiIHN0UmVmOmRvY3VtZW50SUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDo2OWRmZjljYy01YzFiLWE5NDctOTc3OS03ODgxZjM0ODk3MDMiIHN0UmVmOm9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDowODMzNWIyYy04NzYyLWQzNGMtOTBhOS02ODJjYjJmYTQ2M2UiLz4gPHBob3Rvc2hvcDpEb2N1bWVudEFuY2VzdG9ycz4gPHJkZjpCYWc+IDxyZGY6bGk+eG1wLmRpZDowODMzNWIyYy04NzYyLWQzNGMtOTBhOS02ODJjYjJmYTQ2M2U8L3JkZjpsaT4gPC9yZGY6QmFnPiA8L3Bob3Rvc2hvcDpEb2N1bWVudEFuY2VzdG9ycz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz7qS4aQAAAKZElEQVR42u2de4xVxR3HP8dd3rQryPKo4dGNbtVAQRa1YB93E1tTS7VYqCBiSWhsqGltSx+0xD60tKBorYnNkkBtFUt9xJaGNGlty6EqRAK1KlalshK2C8tzpcIigpz+MbPr5e5y987dM2fv4/tJbjC7v3P2+JvPnTMzZ85MEEURQhQClUpB7gRBAECUYiYwH6gDqoEKoA1oBDYCy4OQJgB92R3yq2S5yRilWASs6CZ0DzA5CNmn/ObOOUpB7kQpRgNLcwj9AHCnMiYZfXIT0C/H2DlRSs0gyeiPaQ6xg4FapUwy+mKUY/wwpUwy+uK4Y/xhpUwy+mKfY3yTUiYZfdHiENsahBxRyiSjL5odYncpXZLRJ3sdYhuVLslYKDKqZpSMBXObVs0oGQumA6OaUTL6Iwg5CBzNMXy7MiYZffNCDjH7g5DdSpVk9M36mGKEZOwxq4Fj3cT8UmmSjEm0Gw8At2UJaQhCtilTeeRWM5EdkmVfOwCIUtQBE4AqILC1ZQuwPgjpSKryWwgy1gfZfjsQ886IKFY2xO9N0jOR69srDOAtzCyYFuCUSrcg6AOcBIYCY4C3gVeT+uNJyvg94GPAxzFjcDuBl4C/AP+UBwXBR4AaYDYwDvgr8Drwi1KScRnwXfut6wNcYT+7Ma97LgX+JRd6jfOAucAXgCvTfl4DvAuMtJVJ0cu41IoYWRHTGWM/1TZmq/2fF8nR14r4U2BQF7+LgMW2k7bY54X4Htr5EvD99s5SlriPArcAY+VGsh1YYDpwMzAgSwy2svhWscpYA/wkx9gKm5S5wBA5kgjnAJcDX7NNpVxcWAZMLUYZJwHDHeKrgXnAdWjZlSS4BLgVuMzRlxt9eeNTxsG2veFyy7gQWAR8Sq54byfeYDssAx3LqLabJldBytgMHMjjuPHAQvTOsU++aJtE/fI4dpevTqZPGV+2veN8+DTwIHCBr29hmVJhJXwA+GAex7cBjxZjm7EFWAL8DfeX39s7NPOy9PKEO7XAV+k8xJYLrcDPgL8Xo4xgJqIuA7bkeXw9ZsBVxMMMYEqex64FfuO7e++bTcAPgD8Bpx2PvRSYKIdi61DOs3edXImAV4Cv2zJsKnYZ24B/AJ+xteRrwAmHBF4mj2JhEnCRg4QnrYh3YZ5NH/J9gUmP5zXYtsdsW+Pl8vffkEex8I5D7HHgGeBhe0dLhKRlbMJM298NXI8Z68rGk8AGeRQLu4DHMGOL2dgJPA78AXguyQvsjScdrTYp2zBDPzfbXl7mmNc64B7MFCbRc/bbfPYHrs343WnbZHsG+BXwZ8y65JS6jOnfwPuBg8BnMQtxjsWsh/0IsNJ2fkR8bAHutbfhG2x7vp9tDzZiFs5/Non2YaHJ2N6OWQf8BxiBeRx4EDPZ9nm544WNVsLtwFWYJ2Wh/fmO3ryw3noHpiv6YyZ5NsuXROhrRypeAv7nfHQJvAOTjbclYuJ3pWcL6YL03rSQjEJIRiEZhZCMQjIKIRmFZBRCMgrJKIRkFJJRCMkoJKMQklFIRiEkoxCSUUhGISSjkIxCSEYhGYWQjEIyCiEZhWQUQjIKySiEZBSSUQjJKCSjEAVCJUAQmCWPoxSjgZuAaZgF348D+zD7ADYDe+2nGWgJQg52dVJvSzOLgqHdmU5ln2IYZou9861Do+x/j8Ss2z7AOrQJWBOEZtetKIrMmt5BEBClWAQsxW3b16OY/QHXA6uD0GzpG0VRPmt6i2KSMeyQrxpYgNl4dCJmV7NcOQEsCULu6ZCR+mAmZiOannAMuC0IWS0Zy0PGKMUCzFZug3p4ullsiJ5obzPOj+H6BgGrohR1KqrSx5bzqhhE7PCvXcY4BZqgoioL4iznunQZq2M8cZXKqSyIs5yr02WsiPHEaiyWSbMxxnNVpMvYFuOJj6mcyoI4y7ktXcbGGE/conIqC+Is58Z0GTfGdNIGzJijKH3W2/KOg43pMi4n//2F92P2KJ4ShCwMQvT4pRwajCFRELIQmGLLf3+ep9pj/TvjCcwI4E5gDp1H0VsxO7k3Zvy7PQjZnXl2DXqXhYydiFKMAcYD44CajH+HZIQfBdYCtwch+854HJh2wkqgFhgGHAaagpAjLhcqGctTxqxOpKgCRgNDMXuK7whCTqU7U9khz3ucAv59xomUe9FVhePGEfs5q1eaQiYKBskoJKMQklFIRiEko5CMQkhGIRmFkIxCMgohGYVkFEIyCskohGQUklEIySiEZBSSUQjJKCSjEJJRSEYhJKOQjEJIRiEZhZCMQjIKIRmFZBSijGXMvIZ+KpZEaF8qeygwHOjb2xdUWQBJqQL6ADOBi4GHMGuGH5Iv3hiG2SJtIWaV4mZgB/AadF6jvVxkvAKzv3UdMNX+bDJm9fx10PV+1qLHIl4P3GLzfh3QBLwKbAZ+DJwuFxkDm5CZmN0Vzsv4/TTMyviVwGOYnRZEPAwBZgDfAC5K+/lo+5kKXAjcBzwPnCz1NuP77LfxO12I2M7FNmFXE+++huVOPfDNDBEz25FzgHuBa4Bzk8x/0jJeCiwCFmP2BsnGh4BbgYFyKDZmZRExnTpbGcywHZySuk0PsbeAG4HZDt+2C6yMb8mjWHgXs+NFd5v09Ac+AYzC7An0EPBKqdSM1wDfBqY7Vvubk263lDhPYHamypVa4MvAHUCq2GvGgcB8YAEwKQ/5nwa33blEVrYDLwJXOhxzLvBJzDhkK/BCMdaMA4C5wF2Y4RrXv7UF+KO9tYh42A08msfoRxVwLfBDYGwxyliLGUMclMexL9rOy075EyvvAKuBlcCbeTa3Pl+MMk7GbP/qyiHg18BWueOFNnu3ymeP8X62h11dbDKm7K3a9Zv7e+BJOeOVRmCNvQO5cgmdt4AueBkH5zCE0FWHpQH4r3zxzlPAw3kcdxg4VmwybnaMfx1YAWxTpyURjtj24wpHuZ7C0yNanzL+FnjZIX4lsEGOJEorcDewKcf4vTb+ZLHJuAeYBxzvJm4/8CPg58AJ+ZE4BzBDNk93k//jwOeAN4qxNw1m5sdV9jZwtlvv48ADujX3GpFtUt0OhPZnJzN63wdtOW7xeSFJPJvehBnBv8/2ricAp2wb8UHgETRvsRDYCiy3IrbPCWi0Mt4BPOf7AoIoivycub5TR/rDmBkjs4Df2fbHJjlQcLwfuNyW13rMXILOkyQ2REUtI5jnnG+mNRFOF3Gh1dlavgozhHUMaLEFGJWImBVnbT4VlYwlSBCYL1iUYgGw6ixhDUHIwo4GmfIrGX3JGKWotj3KbM/cpwQh2yRjYfWmS5EFdD/54ytKk2RMgukxxQjJ2GMm5hAzPEoxRqmSjN6IUgwj9xkr45UxyeiTkQ6x45QuyeiT8x1ia5QuyeiTUaoZJWMxyqiaUTIWzG1aNaNkLJgOzJAoRZVSJhl9McIxfrRSJhl94fq241ClTDL6Yq9jvCYNS0ZvuEwGPopZmlhIRi+sIfeXxtYGIaeUMsnohSCkCViSQ+gezAtOwiW/mvzpkKz3ZnrPxCz1V4dZd6YC8+JSI2YNm+VWXE2ulYyiGPk/nslB8d6ayMkAAAAASUVORK5CYII=", a.SPINE_LOGO_DATA = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAKUAAABsCAYAAAALzHKmAAAACXBIWXMAAAsTAAALEwEAmpwYAAALB2lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDIgNzkuMTYwOTI0LCAyMDE3LzA3LzEzLTAxOjA2OjM5ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0RXZ0PSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VFdmVudCMiIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczpwaG90b3Nob3A9Imh0dHA6Ly9ucy5hZG9iZS5jb20vcGhvdG9zaG9wLzEuMC8iIHhtbG5zOnRpZmY9Imh0dHA6Ly9ucy5hZG9iZS5jb20vdGlmZi8xLjAvIiB4bWxuczpleGlmPSJodHRwOi8vbnMuYWRvYmUuY29tL2V4aWYvMS4wLyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxNS41IChXaW5kb3dzKSIgeG1wOkNyZWF0ZURhdGU9IjIwMTYtMDktMDhUMTQ6MjU6MTIrMDI6MDAiIHhtcDpNZXRhZGF0YURhdGU9IjIwMTgtMTEtMTVUMTY6NDA6NTkrMDE6MDAiIHhtcDpNb2RpZnlEYXRlPSIyMDE4LTExLTE1VDE2OjQwOjU5KzAxOjAwIiBkYzpmb3JtYXQ9ImltYWdlL3BuZyIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDowMTdhZGQ3Ni04OTZlLThlNGUtYmM5MS00ZjEyNjI1YjA3MjgiIHhtcE1NOkRvY3VtZW50SUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDplMTViNGE2ZS1hMDg3LWEzNDktODdhOS1mNDYzYjE2MzQ0Y2MiIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDowODMzNWIyYy04NzYyLWQzNGMtOTBhOS02ODJjYjJmYTQ2M2UiIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHRpZmY6T3JpZW50YXRpb249IjEiIHRpZmY6WFJlc29sdXRpb249IjcyMDAwMC8xMDAwMCIgdGlmZjpZUmVzb2x1dGlvbj0iNzIwMDAwLzEwMDAwIiB0aWZmOlJlc29sdXRpb25Vbml0PSIyIiBleGlmOkNvbG9yU3BhY2U9IjY1NTM1IiBleGlmOlBpeGVsWERpbWVuc2lvbj0iMjk3IiBleGlmOlBpeGVsWURpbWVuc2lvbj0iMjQyIj4gPHhtcE1NOkhpc3Rvcnk+IDxyZGY6U2VxPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0iY3JlYXRlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDowODMzNWIyYy04NzYyLWQzNGMtOTBhOS02ODJjYjJmYTQ2M2UiIHN0RXZ0OndoZW49IjIwMTYtMDktMDhUMTQ6MjU6MTIrMDI6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE1LjUgKFdpbmRvd3MpIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDpiNThlMTlkNi0xYTRjLTQyNDEtODU0ZC01MDVlZjYxMjRhODQiIHN0RXZ0OndoZW49IjIwMTgtMTEtMTVUMTY6NDA6MjMrMDE6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCBDQyAoV2luZG93cykiIHN0RXZ0OmNoYW5nZWQ9Ii8iLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249InNhdmVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjJlNjJiMWM2LWIxYzQtNDk0MC04MDMxLWU4ZDkyNTBmODJjNSIgc3RFdnQ6d2hlbj0iMjAxOC0xMS0xNVQxNjo0MDo1OSswMTowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0iY29udmVydGVkIiBzdEV2dDpwYXJhbWV0ZXJzPSJmcm9tIGFwcGxpY2F0aW9uL3ZuZC5hZG9iZS5waG90b3Nob3AgdG8gaW1hZ2UvcG5nIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJkZXJpdmVkIiBzdEV2dDpwYXJhbWV0ZXJzPSJjb252ZXJ0ZWQgZnJvbSBhcHBsaWNhdGlvbi92bmQuYWRvYmUucGhvdG9zaG9wIHRvIGltYWdlL3BuZyIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6MDE3YWRkNzYtODk2ZS04ZTRlLWJjOTEtNGYxMjYyNWIwNzI4IiBzdEV2dDp3aGVuPSIyMDE4LTExLTE1VDE2OjQwOjU5KzAxOjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgQ0MgKFdpbmRvd3MpIiBzdEV2dDpjaGFuZ2VkPSIvIi8+IDwvcmRmOlNlcT4gPC94bXBNTTpIaXN0b3J5PiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDoyZTYyYjFjNi1iMWM0LTQ5NDAtODAzMS1lOGQ5MjUwZjgyYzUiIHN0UmVmOmRvY3VtZW50SUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDo2OWRmZjljYy01YzFiLWE5NDctOTc3OS03ODgxZjM0ODk3MDMiIHN0UmVmOm9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDowODMzNWIyYy04NzYyLWQzNGMtOTBhOS02ODJjYjJmYTQ2M2UiLz4gPHBob3Rvc2hvcDpEb2N1bWVudEFuY2VzdG9ycz4gPHJkZjpCYWc+IDxyZGY6bGk+eG1wLmRpZDowODMzNWIyYy04NzYyLWQzNGMtOTBhOS02ODJjYjJmYTQ2M2U8L3JkZjpsaT4gPC9yZGY6QmFnPiA8L3Bob3Rvc2hvcDpEb2N1bWVudEFuY2VzdG9ycz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz5ayrctAAATYUlEQVR42u2dfVQV553Hv88AXq5uAAlJ0CBem912jQh60kZ8y0tdC5soJnoaXzC4Tdz4cjya1GN206Zqsu3Jpm6yeM5uTG3iaYGoJNFdEY3GaFGD0p4mqS9AXpoV0OZFUOHS3usFuc/+Idde8M7M8zr3gsw5HOCZZ2aemecz39/LPPMMMLAMLDG2kIFzjqmFDiDZP6AkN3gf0gEob8x2kj4MCx2AMnbb1BcVld6IwJJ+0oYb2YTT/gYq6WPHJP3gmtA+Biztr1CSKLevLytprCkh7ctQkj4KsK590hiGlsbSOcVCR5I+BC7pA6BEAzQaq1DqhFFH3Vg16TSG4KHRgNPpyFd1XdIHAyrdCkhjADgaTSiJw/VIP1BSp6GhUQSOOgmlkzASxSqq2zpQB+ClGiGlUb65tAUZOmDUAa5u5XRSgajibVRCR3VCSRyoQwSBE/EvYy3YkYGESuwrpuAkDgPJCg4RhFVUNUkMw6hK6agDcFInoSQxAqNqWHVdD6fUhQqUsfiaVCN41IlOUBEx88JIJCCU8T+tttOR6pEFUgRQXoCVrydRAJJw/G+2jig6llN+p0wnsZpYXsAoxzGognYzryeagBRRR8L5t4iCRsvflDHnIopINcCpGkzlUOoCkqWcKABdlznXZa5lTK7Z/6zlvMeXXqdTCVWoI696ygZN0YZSp/KxQCijmiJgUp3gyQBpVy4Kq4gPqhpWlQrCCxgPeLz70wqmyqcksgELS5kKQEWCIBn1FEn7qFBKKgmnajCloZQtlwWSZR0PoCJBkJMDMnT4iSxlsQCmFJQidVUASQS3ZSlXadqhWDVkTCoLiDKw8t40XOU6oFQBJMtvkSBJ1ITLqKaOgIbVF+y9jd3/omAqVUtViigTTfMAyKqqKnxOlWZcFEzVZjrSb11gaodSRiVVAikCo4hKyjzpkh3No8tf1AUmrxnXCmW0gSSCcIqki4hipbTqGNU+IwuMqsAUfSLVoywezi46gGSFU8Sk86bBKOd1oJzrwuuEQLIbBU8sfiPC37DYhuW8pEfex3NcQBUqyVrO+7edeZdNIfFCSi22oZwdSkzUk1jAaQcrGMA0O34kUJXAaAYl0aSMkRQMjODxAArGct6onPf68CgLbGCkNv4r4axrp4wwUUc7CAnDdkzXJ14SNFHVEQFNRjHtbg7ZoMfuOlHGDiG9/DPCCDgLjDBROFgon50ZV6mQ1/YVzwmgSniJhFryAMpybB4TLjJLRqTOZPUbZYIrwmiqZYC02lboXOIV0C3qm5nVZQGSSCiuaETOe5PygEg4AbXyM1lhJIxqqiWYUQklUaiShMGc2gFpBbDdcXl9StHXka38KVZ/i8V35DXzZibcClIWtRS90ZQpJa/ysZhtHiBV+pk8imm2TjTFwxsQWIHL42PaRd4iroW0ksZLKAFv5MoKbyQQVZl1mShc5LxYOo4Fxt4KyZPysXMhrOrwqKWyHGa8wiCHVSXtzDaxgYSA36xDEk4V5lvGpxRVIZb8pZ0Z571x7My6Up9S17SBhMGvjASfocCUi0TkvOaZMJh11vSPGVSEcT0s1JYyKKnu1BABQOMloeJ9ssMCg53phoKUkVDQs2MMcvNSsZICwfYufPZVB+o/86HxbAAXP/ah9Z2LuPSnAK5wqB1PLlIkmGEBkzVbwKuWolkE6ddXeYeb2akfEfwRTRnZRf89/r84Bf81NB73WtDQ+VUHKocfw1ob35J3QAXrYApq8X94edBmvVUZS9si/Qbr/wacWXgeN/LCCAHAQ+sNhvqhOiQOcNucZMKwQXh42XCkM95AELjZRFNjRCAPSxSmAbXlKXlNOlF0wj2WoqKi5Hnz5mdTGiQA8OCDDx4T6aiNGzeOufnmm5MBoKysrHbfvn3tVhf40hX8MSked1u1LUhx+e1mXGBIz1znC77xxtaJhmFQwzDo3LmPHBdJ6ezZs2cqIVf3UVt7unH16tWNsB4gwpItsPKdlSfTZd4EZH1MKKJkEX8WLfqnlPXr1/8oNTV1QQ8QgsG2pqamX+TkZG+OtP/y8jcn5efnb+nq6vKmpg7NfeONrZOmT5++3uVyZYTvp76+vjg3d8IWs2vy2DDcsunvUDrIQLrZBT3fgXduO4ZnrEx1aWlpbkHBrM0AkJyclFVZWZl3990TngpvT1dXl7e29vRLU6dOLTcxmT3+P3Hi5NLMzMwlhmEkh7fH7/cfraqqemHevLknTMy10yZci/mO2rR5GzZs2JaamrogGAy2Xbx4cWtTU9OLXq93r2EYyR6P52kLdQQAxMXFJR05cvSRGTNmvOZyuTJ8Pl+d1+utCa0fPXr0kydOnHzSzFRu+RLNM09j7qc+vHY5iIbe7Wu7gt8t+wwbGG9YAEBV1eHvT516z0uh9vj9/tpQW7Ozc54rL39zkt1Dh6+/Pl/h8XieNgwjORAInGpqanqxvb19TzAYbHO73VPz8vK2vfXW29kKUnuOLIZitYWFryjlq1RXV890uVxjAWD37oqFo0Z5fjR2bNYvRozIWLFx48b7zpw5s8EmqgYA5OTkrA8EAud2767452HD0ueOGJHxxLp16x7w+Xx1AODxeB5buXLlCDOf9d2L8H7rd3jFfQSzv/MBpjx7BrP/4yzmP1qP76W8j6U7m3HJzpoEg8Fr5ePHj1/n8/nqtmx5fe6wYemPpKffNreysnJxaP2999672sqi/eEPJ5YkJiZmAcDhw1WP3nrrLQVjx2Ztysi4ffmqVSunBAKBU4ZhJE+bNu1VDj81qosRZfVjyU0CABk6dGgmAHR2djYVFRWdCl+3du1Pzo0bl7PZDPxwCHw+X11R0aOPLFy4sCa0vrj4P8+9++7+jaE6P/jBY3NYgrTft8P3s0Y0rPkcn5R9jRaGtNR159zdnieeeuqpulBZYeGCmsbGxtcBwO12jzFT3Iceejh55MiRTwBAQ0PDzwsKCqrDj1NSUuL98MMPX+hW3pHvvXdwqoK+1jELs3KlVGHmbZPVgUBHGwAkJCRklpSUjBW9MB988PvXwwKaa3UWLVpUEwgEzgFAamrqnWYppZ+Owt8eHoeCfdmY/vYYTH43B9/76Nt4tP5uLHlrDCbyntd77x0oPnDggLd3nbNnz9aG/i4vf3NipG1XrFgxKeRD7tq1a2+k4+Tn570fDAbbAOD222/P5uwTJ9/41BJ9izaOKXVQXFxcWVxc/IxhGMmzZj20+5NPPn21vLx8+9q1Pzlrd/xwpWxtbfWawev3+//kcrkyUlJSJpi1618z8cs4guRIx/mmG34Aky2i0+si1bC29VgX1s4e7Q+vl5aWNiJUmJ2dnVlRUTGiWxUpAISi8M7OzqaQ66O4r7UM4HDyxTEpn+XXv/5V2/Tp/1CYn/+PryQkJGSmp6cvXbVq1dLFixdX19TUbJ49++Fjsvm1L774oqYbSMtcpOk6YrqOuwND6S7W/dx///0l6CdLfBQVkntZuHDhqfnz58/84Q9XP5iZmbkgMTExa8iQIZOnTZs2+fPP/2/7HXd8Y63uNrR04vitgzAt0rqvOnAADgyCjbScOXNmAyGEAoBhGNd+E4Jrqrl//77KGwlK6hSY27Zta922bdtWANsrKiomT5iQ+y+JiYlZaWlp83bs2LlvzpzZx0X3PXz48Nyr/utV3zLS8vgn+Onr3wK9ZRDuI93X7wpFW9Nl7J51GpsQpY+4jxuX8yqsHy9SxMAH5p1KCfGAq3R/BQUF1cuXLy8KOfKjRo3KipDQ7bGkpKQkmbXrpptuGg0AXq+33uyglRfQdtsxPJ15HJOL6pE/4xS+m3AY373jt3j59F/gtzn369oUUrXedQn5a3lYnR7n5fP5rvmdW7ZsyXKYHW1fVjMcbqjyLyjs2PF2W0dHx1nWHdx117cfz8vLS+q9r4MHD82Ji4tLAoDm5uY6WM/6gHMBdJZ+jfN7LqAVzn0cqceyb9871X/NZ9433+6GjCXwoqWUvJ1hCUFjY9O/19XVLSssLOwR+R469JsHQsnjy5cvtyHSY6swNRo8ePCdpaVl5WVlZbmhstLS0gnjx49fBVx9vPfssz/eEaFN17VrrQee34zDA59OwIrWKdjsvwf/uysL90TYhjKCyzPvOH3++efPtrS0bO+OxOedOHFyaaR9VldXz2hsbHpRQf9R8E05I8RFvNM+oY1Pavpik8vlykxJSSl85ZVNz7z00svvB4NBEhcXlxwG5OlJkyZuh/mLUSGTVzd48OA7Z84s+OX5883nuvd97Znz0aNH/u3gwYPeCBexRwDzq7/HXYvS8VrvE5mSjO8DOGzRCT0nc+oOTnp3bASzHrFD16xZs2HTpk1ZiYmJWR6P5+lLl1qXBAKBU6H1brd7Snh1sD2rjqqJNxw6sOzkobSqquoFv99/NHShhwwZMjkEZEtLy/Zly5YtMrubwzv40KFDL3/00UfPdXV1eV0uV0YIyEAgcK6iYtcTs2bN2m+iCD3KvuyAN1LDr1D8xSSwuFYW3p7m5mavHRQXLlxoM1FdunPnjtbly5cXNTQ0/DwYDLYZhpHsdrunhH6Aq4MyPv744yWM6kwZ1VFr7tDub7P/HR8lBIAUFRWlRBi2Fn6DXXec0CghAKisrFxcWLjgOABSVlY2MQRG92M+rhfHGnKxZmQiFgAgXRTeLzuwf+Vn+O//aUErg2ljnemMdZQOBUBLSkrGpqXdkhQCPz8/7wjYBveKjBLinenN1nIAoCpHnvNOEGD2zo0RATKrdbZvPJaXvzk5BOXevXsfnz9/Xg3jednlYsnEJAz5hhvuPRdwsfUKuhhUHzYdZjWvJAuwlBE8ltHoVnDa3UDCUKp8omM3QwPrdlb7sVuHSD5luLns/ttquhIzGCP6eMe9aD/uRTtnMAfoeSXCDkie9rGabuX+qFOPGSMFHdREgVjA6w0N7xt2PLNWUCur8ZwHnu8kYWTbFfiS4zHY3wX/nFr8llEZRGG0U1Fq4xebKR+PD6kN1mg80bEC1Awyq1dCbUG0UEpWv9sUrCcz8OOkePR4Xp79N7jr5J8RsIFSdo5yW//SQkV5VZIKmmKhaDxeEkKr90/AYM5Z1NIOFtuX4ktLS08TQhZRSklpaWkt+N+tNl28XfhjOJS+LtSf/DMuC4Aoo5i8QFKbDIFTSfbIT7M4Ah2WYEck+FH9Zh/AN+EVU6RtBuo3B2PQ1tGYlZYAT3sXvljXgMqdzWiTMN0qfEuegEVHlC38eq1IR7BOJgAOIKEATqt9mKWw7CJuFZPx83x+xA5Klq8+iAIJsL8kZrdOGso4zo5gnQhV9qsOVuMheYbYs3yvmmc9lagn+iUGarMPVsW0y5FSAUXXYuLjBXZMBLdhmU02UtBjFQzx+ps850EtoLfzpbnVgUN5VOQxWdVR9MtmUiki1Skhq3wiTIBkgRMCKR/CWM6bV+W581kHL7DkMXk+1sQKJK9VcWQEEq/5FjXhIsGF7Ddt7MDhufAqTBYFlHzuWORLYpRBSXnNtowvKaWULDN42W3D+hkNMOQhAfNEN8/stay5U5nv3/AGPLI5TFa/kgrUlb05uW7gOEF1UqWWdhOk8kS9Ks0uT3BDGbbn8Sl54VTla1qZZ542Sy9xnGkgcAAkOoMukQBT1L+TMfci7gGvOecxsSzmXTaYYTk/nuvODSVLmchH5cH5t+hMuyyjuFmdedFXGyij/waoiXhlHlOyHgsMbY5q9G3le/LOu83ywSHRNBXLY1GRtA9vwMPaqU59wVZFG6DoWkkppajS8XyHW8V3t4lEekP09VS7kTp2Ebmsvyli0kWyBSqsyHVlcYIAyviWsmASThhVBjY84wtZ9suaK5RJy4iaaNa8pVKVNINSRi11gSkSheu4o82UkAVmnhymKIgi0TnA/8hRNPKmqqHkVUsnwBR91Meqjiocd5ZASgQKFT4nT1DDA6TUdSOaymXAFEkniZp7FSOBdAU9LOkVqgBQp4BkLieKgLUqkzXvVuDx7EMEQl35URHoIAmODMAqFJIZyjjNKqriE8a8yXynAxsIdgRrp/KabxkYow6kjFKIqqjKZDnhvAFELYNO8w3Jjuc15yLmmjWoUQZlnIT5UgGmjGqyjLtUrXy6oGRRTl2QivqwrJaJG2KZ5DQvsKwmmccHZVVD2fSSLmXk6XxRSHgVU5U6iqqnFJSyYKqAU+QGiJVAh2oClUdhqeLjSgOpSjFkTbwOVRXNGEDB9aCSwFIFHa3DFZBRfi1Q6gBTFk4Rs63zGijrFIg/ylRt7lW3m6kOUagQqiJ5orFONKJtHR0ok/vUAaPKOrbRt2owZZVTJmhRDaKOYW26I1st06yoBFKmk4jD61UCShSfq1OdpTLgUDW6R8t87rqcfZ1BlMr6uq6Vjhf2owGvozDKmG9dyiQCeTSAiwXVdNIP1A2uls7QkYhW/fgzVgIeXVOe6ISFOnSOjjn+uuHsK5F2NM1hLG/jSGfpjoSdjLSJg7Cp7FjaR7ZzXEGcinBJDF8DnZ1Ho7wPrYNadHdINGCLdVMdrU6nMdimqHYgiaF2kn4IXJ8FMJY6iPRxsPqTksbc55ZJP2vHgOnuYwD2tU4k/eycaT891g0F5YDZ7qfQ3SidTAZgG4By4FwHgBtYBpYbZ/l/2EJnC9N0gaQAAAAASUVORK5CYII=", a;
    })();
    r.LoadingScreen = M;
  })(c.webgl || (c.webgl = {}));
})(F || (F = {}));
var F;
(function(c) {
  (function(r) {
    r.M00 = 0, r.M01 = 4, r.M02 = 8, r.M03 = 12, r.M10 = 1, r.M11 = 5, r.M12 = 9, r.M13 = 13, r.M20 = 2, r.M21 = 6, r.M22 = 10, r.M23 = 14, r.M30 = 3, r.M31 = 7, r.M32 = 11, r.M33 = 15;
    var M = (function() {
      function a() {
        this.temp = new Float32Array(16), this.values = new Float32Array(16);
        var t = this.values;
        t[r.M00] = 1, t[r.M11] = 1, t[r.M22] = 1, t[r.M33] = 1;
      }
      return a.prototype.set = function(t) {
        return this.values.set(t), this;
      }, a.prototype.transpose = function() {
        var t = this.temp, i = this.values;
        return t[r.M00] = i[r.M00], t[r.M01] = i[r.M10], t[r.M02] = i[r.M20], t[r.M03] = i[r.M30], t[r.M10] = i[r.M01], t[r.M11] = i[r.M11], t[r.M12] = i[r.M21], t[r.M13] = i[r.M31], t[r.M20] = i[r.M02], t[r.M21] = i[r.M12], t[r.M22] = i[r.M22], t[r.M23] = i[r.M32], t[r.M30] = i[r.M03], t[r.M31] = i[r.M13], t[r.M32] = i[r.M23], t[r.M33] = i[r.M33], this.set(t);
      }, a.prototype.identity = function() {
        var t = this.values;
        return t[r.M00] = 1, t[r.M01] = 0, t[r.M02] = 0, t[r.M03] = 0, t[r.M10] = 0, t[r.M11] = 1, t[r.M12] = 0, t[r.M13] = 0, t[r.M20] = 0, t[r.M21] = 0, t[r.M22] = 1, t[r.M23] = 0, t[r.M30] = 0, t[r.M31] = 0, t[r.M32] = 0, t[r.M33] = 1, this;
      }, a.prototype.invert = function() {
        var t = this.values, i = this.temp, e = t[r.M30] * t[r.M21] * t[r.M12] * t[r.M03] - t[r.M20] * t[r.M31] * t[r.M12] * t[r.M03] - t[r.M30] * t[r.M11] * t[r.M22] * t[r.M03] + t[r.M10] * t[r.M31] * t[r.M22] * t[r.M03] + t[r.M20] * t[r.M11] * t[r.M32] * t[r.M03] - t[r.M10] * t[r.M21] * t[r.M32] * t[r.M03] - t[r.M30] * t[r.M21] * t[r.M02] * t[r.M13] + t[r.M20] * t[r.M31] * t[r.M02] * t[r.M13] + t[r.M30] * t[r.M01] * t[r.M22] * t[r.M13] - t[r.M00] * t[r.M31] * t[r.M22] * t[r.M13] - t[r.M20] * t[r.M01] * t[r.M32] * t[r.M13] + t[r.M00] * t[r.M21] * t[r.M32] * t[r.M13] + t[r.M30] * t[r.M11] * t[r.M02] * t[r.M23] - t[r.M10] * t[r.M31] * t[r.M02] * t[r.M23] - t[r.M30] * t[r.M01] * t[r.M12] * t[r.M23] + t[r.M00] * t[r.M31] * t[r.M12] * t[r.M23] + t[r.M10] * t[r.M01] * t[r.M32] * t[r.M23] - t[r.M00] * t[r.M11] * t[r.M32] * t[r.M23] - t[r.M20] * t[r.M11] * t[r.M02] * t[r.M33] + t[r.M10] * t[r.M21] * t[r.M02] * t[r.M33] + t[r.M20] * t[r.M01] * t[r.M12] * t[r.M33] - t[r.M00] * t[r.M21] * t[r.M12] * t[r.M33] - t[r.M10] * t[r.M01] * t[r.M22] * t[r.M33] + t[r.M00] * t[r.M11] * t[r.M22] * t[r.M33];
        if (e == 0)
          throw new Error("non-invertible matrix");
        var n = 1 / e;
        return i[r.M00] = t[r.M12] * t[r.M23] * t[r.M31] - t[r.M13] * t[r.M22] * t[r.M31] + t[r.M13] * t[r.M21] * t[r.M32] - t[r.M11] * t[r.M23] * t[r.M32] - t[r.M12] * t[r.M21] * t[r.M33] + t[r.M11] * t[r.M22] * t[r.M33], i[r.M01] = t[r.M03] * t[r.M22] * t[r.M31] - t[r.M02] * t[r.M23] * t[r.M31] - t[r.M03] * t[r.M21] * t[r.M32] + t[r.M01] * t[r.M23] * t[r.M32] + t[r.M02] * t[r.M21] * t[r.M33] - t[r.M01] * t[r.M22] * t[r.M33], i[r.M02] = t[r.M02] * t[r.M13] * t[r.M31] - t[r.M03] * t[r.M12] * t[r.M31] + t[r.M03] * t[r.M11] * t[r.M32] - t[r.M01] * t[r.M13] * t[r.M32] - t[r.M02] * t[r.M11] * t[r.M33] + t[r.M01] * t[r.M12] * t[r.M33], i[r.M03] = t[r.M03] * t[r.M12] * t[r.M21] - t[r.M02] * t[r.M13] * t[r.M21] - t[r.M03] * t[r.M11] * t[r.M22] + t[r.M01] * t[r.M13] * t[r.M22] + t[r.M02] * t[r.M11] * t[r.M23] - t[r.M01] * t[r.M12] * t[r.M23], i[r.M10] = t[r.M13] * t[r.M22] * t[r.M30] - t[r.M12] * t[r.M23] * t[r.M30] - t[r.M13] * t[r.M20] * t[r.M32] + t[r.M10] * t[r.M23] * t[r.M32] + t[r.M12] * t[r.M20] * t[r.M33] - t[r.M10] * t[r.M22] * t[r.M33], i[r.M11] = t[r.M02] * t[r.M23] * t[r.M30] - t[r.M03] * t[r.M22] * t[r.M30] + t[r.M03] * t[r.M20] * t[r.M32] - t[r.M00] * t[r.M23] * t[r.M32] - t[r.M02] * t[r.M20] * t[r.M33] + t[r.M00] * t[r.M22] * t[r.M33], i[r.M12] = t[r.M03] * t[r.M12] * t[r.M30] - t[r.M02] * t[r.M13] * t[r.M30] - t[r.M03] * t[r.M10] * t[r.M32] + t[r.M00] * t[r.M13] * t[r.M32] + t[r.M02] * t[r.M10] * t[r.M33] - t[r.M00] * t[r.M12] * t[r.M33], i[r.M13] = t[r.M02] * t[r.M13] * t[r.M20] - t[r.M03] * t[r.M12] * t[r.M20] + t[r.M03] * t[r.M10] * t[r.M22] - t[r.M00] * t[r.M13] * t[r.M22] - t[r.M02] * t[r.M10] * t[r.M23] + t[r.M00] * t[r.M12] * t[r.M23], i[r.M20] = t[r.M11] * t[r.M23] * t[r.M30] - t[r.M13] * t[r.M21] * t[r.M30] + t[r.M13] * t[r.M20] * t[r.M31] - t[r.M10] * t[r.M23] * t[r.M31] - t[r.M11] * t[r.M20] * t[r.M33] + t[r.M10] * t[r.M21] * t[r.M33], i[r.M21] = t[r.M03] * t[r.M21] * t[r.M30] - t[r.M01] * t[r.M23] * t[r.M30] - t[r.M03] * t[r.M20] * t[r.M31] + t[r.M00] * t[r.M23] * t[r.M31] + t[r.M01] * t[r.M20] * t[r.M33] - t[r.M00] * t[r.M21] * t[r.M33], i[r.M22] = t[r.M01] * t[r.M13] * t[r.M30] - t[r.M03] * t[r.M11] * t[r.M30] + t[r.M03] * t[r.M10] * t[r.M31] - t[r.M00] * t[r.M13] * t[r.M31] - t[r.M01] * t[r.M10] * t[r.M33] + t[r.M00] * t[r.M11] * t[r.M33], i[r.M23] = t[r.M03] * t[r.M11] * t[r.M20] - t[r.M01] * t[r.M13] * t[r.M20] - t[r.M03] * t[r.M10] * t[r.M21] + t[r.M00] * t[r.M13] * t[r.M21] + t[r.M01] * t[r.M10] * t[r.M23] - t[r.M00] * t[r.M11] * t[r.M23], i[r.M30] = t[r.M12] * t[r.M21] * t[r.M30] - t[r.M11] * t[r.M22] * t[r.M30] - t[r.M12] * t[r.M20] * t[r.M31] + t[r.M10] * t[r.M22] * t[r.M31] + t[r.M11] * t[r.M20] * t[r.M32] - t[r.M10] * t[r.M21] * t[r.M32], i[r.M31] = t[r.M01] * t[r.M22] * t[r.M30] - t[r.M02] * t[r.M21] * t[r.M30] + t[r.M02] * t[r.M20] * t[r.M31] - t[r.M00] * t[r.M22] * t[r.M31] - t[r.M01] * t[r.M20] * t[r.M32] + t[r.M00] * t[r.M21] * t[r.M32], i[r.M32] = t[r.M02] * t[r.M11] * t[r.M30] - t[r.M01] * t[r.M12] * t[r.M30] - t[r.M02] * t[r.M10] * t[r.M31] + t[r.M00] * t[r.M12] * t[r.M31] + t[r.M01] * t[r.M10] * t[r.M32] - t[r.M00] * t[r.M11] * t[r.M32], i[r.M33] = t[r.M01] * t[r.M12] * t[r.M20] - t[r.M02] * t[r.M11] * t[r.M20] + t[r.M02] * t[r.M10] * t[r.M21] - t[r.M00] * t[r.M12] * t[r.M21] - t[r.M01] * t[r.M10] * t[r.M22] + t[r.M00] * t[r.M11] * t[r.M22], t[r.M00] = i[r.M00] * n, t[r.M01] = i[r.M01] * n, t[r.M02] = i[r.M02] * n, t[r.M03] = i[r.M03] * n, t[r.M10] = i[r.M10] * n, t[r.M11] = i[r.M11] * n, t[r.M12] = i[r.M12] * n, t[r.M13] = i[r.M13] * n, t[r.M20] = i[r.M20] * n, t[r.M21] = i[r.M21] * n, t[r.M22] = i[r.M22] * n, t[r.M23] = i[r.M23] * n, t[r.M30] = i[r.M30] * n, t[r.M31] = i[r.M31] * n, t[r.M32] = i[r.M32] * n, t[r.M33] = i[r.M33] * n, this;
      }, a.prototype.determinant = function() {
        var t = this.values;
        return t[r.M30] * t[r.M21] * t[r.M12] * t[r.M03] - t[r.M20] * t[r.M31] * t[r.M12] * t[r.M03] - t[r.M30] * t[r.M11] * t[r.M22] * t[r.M03] + t[r.M10] * t[r.M31] * t[r.M22] * t[r.M03] + t[r.M20] * t[r.M11] * t[r.M32] * t[r.M03] - t[r.M10] * t[r.M21] * t[r.M32] * t[r.M03] - t[r.M30] * t[r.M21] * t[r.M02] * t[r.M13] + t[r.M20] * t[r.M31] * t[r.M02] * t[r.M13] + t[r.M30] * t[r.M01] * t[r.M22] * t[r.M13] - t[r.M00] * t[r.M31] * t[r.M22] * t[r.M13] - t[r.M20] * t[r.M01] * t[r.M32] * t[r.M13] + t[r.M00] * t[r.M21] * t[r.M32] * t[r.M13] + t[r.M30] * t[r.M11] * t[r.M02] * t[r.M23] - t[r.M10] * t[r.M31] * t[r.M02] * t[r.M23] - t[r.M30] * t[r.M01] * t[r.M12] * t[r.M23] + t[r.M00] * t[r.M31] * t[r.M12] * t[r.M23] + t[r.M10] * t[r.M01] * t[r.M32] * t[r.M23] - t[r.M00] * t[r.M11] * t[r.M32] * t[r.M23] - t[r.M20] * t[r.M11] * t[r.M02] * t[r.M33] + t[r.M10] * t[r.M21] * t[r.M02] * t[r.M33] + t[r.M20] * t[r.M01] * t[r.M12] * t[r.M33] - t[r.M00] * t[r.M21] * t[r.M12] * t[r.M33] - t[r.M10] * t[r.M01] * t[r.M22] * t[r.M33] + t[r.M00] * t[r.M11] * t[r.M22] * t[r.M33];
      }, a.prototype.translate = function(t, i, e) {
        var n = this.values;
        return n[r.M03] += t, n[r.M13] += i, n[r.M23] += e, this;
      }, a.prototype.copy = function() {
        return new a().set(this.values);
      }, a.prototype.projection = function(t, i, e, n) {
        this.identity();
        var f = 1 / Math.tan(e * (Math.PI / 180) / 2), h = (i + t) / (t - i), v = 2 * i * t / (t - i), u = this.values;
        return u[r.M00] = f / n, u[r.M10] = 0, u[r.M20] = 0, u[r.M30] = 0, u[r.M01] = 0, u[r.M11] = f, u[r.M21] = 0, u[r.M31] = 0, u[r.M02] = 0, u[r.M12] = 0, u[r.M22] = h, u[r.M32] = -1, u[r.M03] = 0, u[r.M13] = 0, u[r.M23] = v, u[r.M33] = 0, this;
      }, a.prototype.ortho2d = function(t, i, e, n) {
        return this.ortho(t, t + e, i, i + n, 0, 1);
      }, a.prototype.ortho = function(t, i, e, n, f, h) {
        this.identity();
        var v = 2 / (i - t), u = 2 / (n - e), s = -2 / (h - f), o = -(i + t) / (i - t), d = -(n + e) / (n - e), l = -(h + f) / (h - f), m = this.values;
        return m[r.M00] = v, m[r.M10] = 0, m[r.M20] = 0, m[r.M30] = 0, m[r.M01] = 0, m[r.M11] = u, m[r.M21] = 0, m[r.M31] = 0, m[r.M02] = 0, m[r.M12] = 0, m[r.M22] = s, m[r.M32] = 0, m[r.M03] = o, m[r.M13] = d, m[r.M23] = l, m[r.M33] = 1, this;
      }, a.prototype.multiply = function(t) {
        var i = this.temp, e = this.values, n = t.values;
        return i[r.M00] = e[r.M00] * n[r.M00] + e[r.M01] * n[r.M10] + e[r.M02] * n[r.M20] + e[r.M03] * n[r.M30], i[r.M01] = e[r.M00] * n[r.M01] + e[r.M01] * n[r.M11] + e[r.M02] * n[r.M21] + e[r.M03] * n[r.M31], i[r.M02] = e[r.M00] * n[r.M02] + e[r.M01] * n[r.M12] + e[r.M02] * n[r.M22] + e[r.M03] * n[r.M32], i[r.M03] = e[r.M00] * n[r.M03] + e[r.M01] * n[r.M13] + e[r.M02] * n[r.M23] + e[r.M03] * n[r.M33], i[r.M10] = e[r.M10] * n[r.M00] + e[r.M11] * n[r.M10] + e[r.M12] * n[r.M20] + e[r.M13] * n[r.M30], i[r.M11] = e[r.M10] * n[r.M01] + e[r.M11] * n[r.M11] + e[r.M12] * n[r.M21] + e[r.M13] * n[r.M31], i[r.M12] = e[r.M10] * n[r.M02] + e[r.M11] * n[r.M12] + e[r.M12] * n[r.M22] + e[r.M13] * n[r.M32], i[r.M13] = e[r.M10] * n[r.M03] + e[r.M11] * n[r.M13] + e[r.M12] * n[r.M23] + e[r.M13] * n[r.M33], i[r.M20] = e[r.M20] * n[r.M00] + e[r.M21] * n[r.M10] + e[r.M22] * n[r.M20] + e[r.M23] * n[r.M30], i[r.M21] = e[r.M20] * n[r.M01] + e[r.M21] * n[r.M11] + e[r.M22] * n[r.M21] + e[r.M23] * n[r.M31], i[r.M22] = e[r.M20] * n[r.M02] + e[r.M21] * n[r.M12] + e[r.M22] * n[r.M22] + e[r.M23] * n[r.M32], i[r.M23] = e[r.M20] * n[r.M03] + e[r.M21] * n[r.M13] + e[r.M22] * n[r.M23] + e[r.M23] * n[r.M33], i[r.M30] = e[r.M30] * n[r.M00] + e[r.M31] * n[r.M10] + e[r.M32] * n[r.M20] + e[r.M33] * n[r.M30], i[r.M31] = e[r.M30] * n[r.M01] + e[r.M31] * n[r.M11] + e[r.M32] * n[r.M21] + e[r.M33] * n[r.M31], i[r.M32] = e[r.M30] * n[r.M02] + e[r.M31] * n[r.M12] + e[r.M32] * n[r.M22] + e[r.M33] * n[r.M32], i[r.M33] = e[r.M30] * n[r.M03] + e[r.M31] * n[r.M13] + e[r.M32] * n[r.M23] + e[r.M33] * n[r.M33], this.set(this.temp);
      }, a.prototype.multiplyLeft = function(t) {
        var i = this.temp, e = this.values, n = t.values;
        return i[r.M00] = n[r.M00] * e[r.M00] + n[r.M01] * e[r.M10] + n[r.M02] * e[r.M20] + n[r.M03] * e[r.M30], i[r.M01] = n[r.M00] * e[r.M01] + n[r.M01] * e[r.M11] + n[r.M02] * e[r.M21] + n[r.M03] * e[r.M31], i[r.M02] = n[r.M00] * e[r.M02] + n[r.M01] * e[r.M12] + n[r.M02] * e[r.M22] + n[r.M03] * e[r.M32], i[r.M03] = n[r.M00] * e[r.M03] + n[r.M01] * e[r.M13] + n[r.M02] * e[r.M23] + n[r.M03] * e[r.M33], i[r.M10] = n[r.M10] * e[r.M00] + n[r.M11] * e[r.M10] + n[r.M12] * e[r.M20] + n[r.M13] * e[r.M30], i[r.M11] = n[r.M10] * e[r.M01] + n[r.M11] * e[r.M11] + n[r.M12] * e[r.M21] + n[r.M13] * e[r.M31], i[r.M12] = n[r.M10] * e[r.M02] + n[r.M11] * e[r.M12] + n[r.M12] * e[r.M22] + n[r.M13] * e[r.M32], i[r.M13] = n[r.M10] * e[r.M03] + n[r.M11] * e[r.M13] + n[r.M12] * e[r.M23] + n[r.M13] * e[r.M33], i[r.M20] = n[r.M20] * e[r.M00] + n[r.M21] * e[r.M10] + n[r.M22] * e[r.M20] + n[r.M23] * e[r.M30], i[r.M21] = n[r.M20] * e[r.M01] + n[r.M21] * e[r.M11] + n[r.M22] * e[r.M21] + n[r.M23] * e[r.M31], i[r.M22] = n[r.M20] * e[r.M02] + n[r.M21] * e[r.M12] + n[r.M22] * e[r.M22] + n[r.M23] * e[r.M32], i[r.M23] = n[r.M20] * e[r.M03] + n[r.M21] * e[r.M13] + n[r.M22] * e[r.M23] + n[r.M23] * e[r.M33], i[r.M30] = n[r.M30] * e[r.M00] + n[r.M31] * e[r.M10] + n[r.M32] * e[r.M20] + n[r.M33] * e[r.M30], i[r.M31] = n[r.M30] * e[r.M01] + n[r.M31] * e[r.M11] + n[r.M32] * e[r.M21] + n[r.M33] * e[r.M31], i[r.M32] = n[r.M30] * e[r.M02] + n[r.M31] * e[r.M12] + n[r.M32] * e[r.M22] + n[r.M33] * e[r.M32], i[r.M33] = n[r.M30] * e[r.M03] + n[r.M31] * e[r.M13] + n[r.M32] * e[r.M23] + n[r.M33] * e[r.M33], this.set(this.temp);
      }, a.prototype.lookAt = function(t, i, e) {
        a.initTemps();
        var n = a.xAxis, f = a.yAxis, h = a.zAxis;
        h.setFrom(i).normalize(), n.setFrom(i).normalize(), n.cross(e).normalize(), f.setFrom(n).cross(h).normalize(), this.identity();
        var v = this.values;
        return v[r.M00] = n.x, v[r.M01] = n.y, v[r.M02] = n.z, v[r.M10] = f.x, v[r.M11] = f.y, v[r.M12] = f.z, v[r.M20] = -h.x, v[r.M21] = -h.y, v[r.M22] = -h.z, a.tmpMatrix.identity(), a.tmpMatrix.values[r.M03] = -t.x, a.tmpMatrix.values[r.M13] = -t.y, a.tmpMatrix.values[r.M23] = -t.z, this.multiply(a.tmpMatrix), this;
      }, a.initTemps = function() {
        a.xAxis === null && (a.xAxis = new r.Vector3()), a.yAxis === null && (a.yAxis = new r.Vector3()), a.zAxis === null && (a.zAxis = new r.Vector3());
      }, a.xAxis = null, a.yAxis = null, a.zAxis = null, a.tmpMatrix = new a(), a;
    })();
    r.Matrix4 = M;
  })(c.webgl || (c.webgl = {}));
})(F || (F = {}));
var F;
(function(c) {
  (function(r) {
    var M = (function() {
      function v(u, s, o, d) {
        this.attributes = s, this.verticesLength = 0, this.dirtyVertices = !1, this.indicesLength = 0, this.dirtyIndices = !1, this.elementsPerVertex = 0, this.context = u instanceof r.ManagedWebGLRenderingContext ? u : new r.ManagedWebGLRenderingContext(u), this.elementsPerVertex = 0;
        for (var l = 0; l < s.length; l++)
          this.elementsPerVertex += s[l].numElements;
        this.vertices = new Float32Array(o * this.elementsPerVertex), this.indices = new Uint16Array(d), this.context.addRestorable(this);
      }
      return v.prototype.getAttributes = function() {
        return this.attributes;
      }, v.prototype.maxVertices = function() {
        return this.vertices.length / this.elementsPerVertex;
      }, v.prototype.numVertices = function() {
        return this.verticesLength / this.elementsPerVertex;
      }, v.prototype.setVerticesLength = function(u) {
        this.dirtyVertices = !0, this.verticesLength = u;
      }, v.prototype.getVertices = function() {
        return this.vertices;
      }, v.prototype.maxIndices = function() {
        return this.indices.length;
      }, v.prototype.numIndices = function() {
        return this.indicesLength;
      }, v.prototype.setIndicesLength = function(u) {
        this.dirtyIndices = !0, this.indicesLength = u;
      }, v.prototype.getIndices = function() {
        return this.indices;
      }, v.prototype.getVertexSizeInFloats = function() {
        for (var u = 0, s = 0; s < this.attributes.length; s++) {
          var o = this.attributes[s];
          u += o.numElements;
        }
        return u;
      }, v.prototype.setVertices = function(u) {
        if (this.dirtyVertices = !0, u.length > this.vertices.length)
          throw Error("Mesh can't store more than " + this.maxVertices() + " vertices");
        this.vertices.set(u, 0), this.verticesLength = u.length;
      }, v.prototype.setIndices = function(u) {
        if (this.dirtyIndices = !0, u.length > this.indices.length)
          throw Error("Mesh can't store more than " + this.maxIndices() + " indices");
        this.indices.set(u, 0), this.indicesLength = u.length;
      }, v.prototype.draw = function(u, s) {
        this.drawWithOffset(u, s, 0, this.indicesLength > 0 ? this.indicesLength : this.verticesLength / this.elementsPerVertex);
      }, v.prototype.drawWithOffset = function(u, s, o, d) {
        var l = this.context.gl;
        (this.dirtyVertices || this.dirtyIndices) && this.update(), this.bind(u), this.indicesLength > 0 ? l.drawElements(s, d, l.UNSIGNED_SHORT, o * 2) : l.drawArrays(s, o, d), this.unbind(u);
      }, v.prototype.bind = function(u) {
        var s = this.context.gl;
        s.bindBuffer(s.ARRAY_BUFFER, this.verticesBuffer);
        for (var o = 0, d = 0; d < this.attributes.length; d++) {
          var l = this.attributes[d], m = u.getAttributeLocation(l.name);
          s.enableVertexAttribArray(m), s.vertexAttribPointer(m, l.numElements, s.FLOAT, !1, this.elementsPerVertex * 4, o * 4), o += l.numElements;
        }
        this.indicesLength > 0 && s.bindBuffer(s.ELEMENT_ARRAY_BUFFER, this.indicesBuffer);
      }, v.prototype.unbind = function(u) {
        for (var s = this.context.gl, o = 0; o < this.attributes.length; o++) {
          var d = this.attributes[o], l = u.getAttributeLocation(d.name);
          s.disableVertexAttribArray(l);
        }
        s.bindBuffer(s.ARRAY_BUFFER, null), this.indicesLength > 0 && s.bindBuffer(s.ELEMENT_ARRAY_BUFFER, null);
      }, v.prototype.update = function() {
        var u = this.context.gl;
        this.dirtyVertices && (this.verticesBuffer || (this.verticesBuffer = u.createBuffer()), u.bindBuffer(u.ARRAY_BUFFER, this.verticesBuffer), u.bufferData(u.ARRAY_BUFFER, this.vertices.subarray(0, this.verticesLength), u.DYNAMIC_DRAW), this.dirtyVertices = !1), this.dirtyIndices && (this.indicesBuffer || (this.indicesBuffer = u.createBuffer()), u.bindBuffer(u.ELEMENT_ARRAY_BUFFER, this.indicesBuffer), u.bufferData(u.ELEMENT_ARRAY_BUFFER, this.indices.subarray(0, this.indicesLength), u.DYNAMIC_DRAW), this.dirtyIndices = !1);
      }, v.prototype.restore = function() {
        this.verticesBuffer = null, this.indicesBuffer = null, this.update();
      }, v.prototype.dispose = function() {
        this.context.removeRestorable(this);
        var u = this.context.gl;
        u.deleteBuffer(this.verticesBuffer), u.deleteBuffer(this.indicesBuffer);
      }, v;
    })();
    r.Mesh = M;
    var a = /* @__PURE__ */ (function() {
      function v(u, s, o) {
        this.name = u, this.type = s, this.numElements = o;
      }
      return v;
    })();
    r.VertexAttribute = a;
    var t = (function(v) {
      Q(u, v);
      function u() {
        return v.call(this, r.Shader.POSITION, h.Float, 2) || this;
      }
      return u;
    })(a);
    r.Position2Attribute = t;
    var i = (function(v) {
      Q(u, v);
      function u() {
        return v.call(this, r.Shader.POSITION, h.Float, 3) || this;
      }
      return u;
    })(a);
    r.Position3Attribute = i;
    var e = (function(v) {
      Q(u, v);
      function u(s) {
        return s === void 0 && (s = 0), v.call(this, r.Shader.TEXCOORDS + (s == 0 ? "" : s), h.Float, 2) || this;
      }
      return u;
    })(a);
    r.TexCoordAttribute = e;
    var n = (function(v) {
      Q(u, v);
      function u() {
        return v.call(this, r.Shader.COLOR, h.Float, 4) || this;
      }
      return u;
    })(a);
    r.ColorAttribute = n;
    var f = (function(v) {
      Q(u, v);
      function u() {
        return v.call(this, r.Shader.COLOR2, h.Float, 4) || this;
      }
      return u;
    })(a);
    r.Color2Attribute = f;
    var h;
    (function(v) {
      v[v.Float = 0] = "Float";
    })(h = r.VertexAttributeType || (r.VertexAttributeType = {}));
  })(c.webgl || (c.webgl = {}));
})(F || (F = {}));
var F;
(function(c) {
  (function(r) {
    var M = (function() {
      function a(t, i, e) {
        if (i === void 0 && (i = !0), e === void 0 && (e = 10920), this.isDrawing = !1, this.shader = null, this.lastTexture = null, this.verticesLength = 0, this.indicesLength = 0, e > 10920)
          throw new Error("Can't have more than 10920 triangles per batch: " + e);
        this.context = t instanceof r.ManagedWebGLRenderingContext ? t : new r.ManagedWebGLRenderingContext(t);
        var n = i ? [new r.Position2Attribute(), new r.ColorAttribute(), new r.TexCoordAttribute(), new r.Color2Attribute()] : [new r.Position2Attribute(), new r.ColorAttribute(), new r.TexCoordAttribute()];
        this.mesh = new r.Mesh(t, n, e, e * 3), this.srcBlend = this.context.gl.SRC_ALPHA, this.dstBlend = this.context.gl.ONE_MINUS_SRC_ALPHA;
      }
      return a.prototype.begin = function(t) {
        var i = this.context.gl;
        if (this.isDrawing)
          throw new Error("PolygonBatch is already drawing. Call PolygonBatch.end() before calling PolygonBatch.begin()");
        this.drawCalls = 0, this.shader = t, this.lastTexture = null, this.isDrawing = !0, i.enable(i.BLEND), i.blendFunc(this.srcBlend, this.dstBlend);
      }, a.prototype.setBlendMode = function(t, i) {
        var e = this.context.gl;
        this.srcBlend = t, this.dstBlend = i, this.isDrawing && (this.flush(), e.blendFunc(this.srcBlend, this.dstBlend));
      }, a.prototype.draw = function(t, i, e) {
        t != this.lastTexture ? (this.flush(), this.lastTexture = t) : (this.verticesLength + i.length > this.mesh.getVertices().length || this.indicesLength + e.length > this.mesh.getIndices().length) && this.flush();
        var n = this.mesh.numVertices();
        this.mesh.getVertices().set(i, this.verticesLength), this.verticesLength += i.length, this.mesh.setVerticesLength(this.verticesLength);
        for (var f = this.mesh.getIndices(), h = this.indicesLength, v = 0; v < e.length; h++, v++)
          f[h] = e[v] + n;
        this.indicesLength += e.length, this.mesh.setIndicesLength(this.indicesLength);
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
    r.PolygonBatcher = M;
  })(c.webgl || (c.webgl = {}));
})(F || (F = {}));
var F;
(function(c) {
  (function(r) {
    var M = (function() {
      function t(i, e, n) {
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
        ], this.QUAD_TRIANGLES = [0, 1, 2, 2, 3, 0], this.WHITE = new c.Color(1, 1, 1, 1), this.canvas = i, this.context = e instanceof r.ManagedWebGLRenderingContext ? e : new r.ManagedWebGLRenderingContext(e), this.twoColorTint = n, this.camera = new r.OrthoCamera(i.width, i.height), this.batcherShader = n ? r.Shader.newTwoColoredTextured(this.context) : r.Shader.newColoredTextured(this.context), this.batcher = new r.PolygonBatcher(this.context, n), this.shapesShader = r.Shader.newColored(this.context), this.shapes = new r.ShapeRenderer(this.context), this.skeletonRenderer = new r.SkeletonRenderer(this.context, n), this.skeletonDebugRenderer = new r.SkeletonDebugRenderer(this.context);
      }
      return t.prototype.begin = function() {
        this.camera.update(), this.enableRenderer(this.batcher);
      }, t.prototype.drawSkeleton = function(i, e, n, f) {
        e === void 0 && (e = !1), n === void 0 && (n = -1), f === void 0 && (f = -1), this.enableRenderer(this.batcher), this.skeletonRenderer.premultipliedAlpha = e, this.skeletonRenderer.draw(this.batcher, i, n, f);
      }, t.prototype.drawSkeletonDebug = function(i, e, n) {
        e === void 0 && (e = !1), n === void 0 && (n = null), this.enableRenderer(this.shapes), this.skeletonDebugRenderer.premultipliedAlpha = e, this.skeletonDebugRenderer.draw(this.shapes, i, n);
      }, t.prototype.drawTexture = function(i, e, n, f, h, v) {
        v === void 0 && (v = null), this.enableRenderer(this.batcher), v === null && (v = this.WHITE);
        var u = this.QUAD, s = 0;
        u[s++] = e, u[s++] = n, u[s++] = v.r, u[s++] = v.g, u[s++] = v.b, u[s++] = v.a, u[s++] = 0, u[s++] = 1, this.twoColorTint && (u[s++] = 0, u[s++] = 0, u[s++] = 0, u[s++] = 0), u[s++] = e + f, u[s++] = n, u[s++] = v.r, u[s++] = v.g, u[s++] = v.b, u[s++] = v.a, u[s++] = 1, u[s++] = 1, this.twoColorTint && (u[s++] = 0, u[s++] = 0, u[s++] = 0, u[s++] = 0), u[s++] = e + f, u[s++] = n + h, u[s++] = v.r, u[s++] = v.g, u[s++] = v.b, u[s++] = v.a, u[s++] = 1, u[s++] = 0, this.twoColorTint && (u[s++] = 0, u[s++] = 0, u[s++] = 0, u[s++] = 0), u[s++] = e, u[s++] = n + h, u[s++] = v.r, u[s++] = v.g, u[s++] = v.b, u[s++] = v.a, u[s++] = 0, u[s++] = 0, this.twoColorTint && (u[s++] = 0, u[s++] = 0, u[s++] = 0, u[s++] = 0), this.batcher.draw(i, u, this.QUAD_TRIANGLES);
      }, t.prototype.drawTextureUV = function(i, e, n, f, h, v, u, s, o, d) {
        d === void 0 && (d = null), this.enableRenderer(this.batcher), d === null && (d = this.WHITE);
        var l = this.QUAD, m = 0;
        l[m++] = e, l[m++] = n, l[m++] = d.r, l[m++] = d.g, l[m++] = d.b, l[m++] = d.a, l[m++] = v, l[m++] = u, this.twoColorTint && (l[m++] = 0, l[m++] = 0, l[m++] = 0, l[m++] = 0), l[m++] = e + f, l[m++] = n, l[m++] = d.r, l[m++] = d.g, l[m++] = d.b, l[m++] = d.a, l[m++] = s, l[m++] = u, this.twoColorTint && (l[m++] = 0, l[m++] = 0, l[m++] = 0, l[m++] = 0), l[m++] = e + f, l[m++] = n + h, l[m++] = d.r, l[m++] = d.g, l[m++] = d.b, l[m++] = d.a, l[m++] = s, l[m++] = o, this.twoColorTint && (l[m++] = 0, l[m++] = 0, l[m++] = 0, l[m++] = 0), l[m++] = e, l[m++] = n + h, l[m++] = d.r, l[m++] = d.g, l[m++] = d.b, l[m++] = d.a, l[m++] = v, l[m++] = o, this.twoColorTint && (l[m++] = 0, l[m++] = 0, l[m++] = 0, l[m++] = 0), this.batcher.draw(i, l, this.QUAD_TRIANGLES);
      }, t.prototype.drawTextureRotated = function(i, e, n, f, h, v, u, s, o, d) {
        o === void 0 && (o = null), this.enableRenderer(this.batcher), o === null && (o = this.WHITE);
        var l = this.QUAD, m = e + v, C = n + u, S = -v, D = -u, T = f - v, x = h - u, g = S, p = D, A = S, P = x, k = T, O = x, E = T, V = D, N = 0, I = 0, y = 0, R = 0, B = 0, w = 0, Z = 0, W = 0;
        if (s != 0) {
          var G = c.MathUtils.cosDeg(s), X = c.MathUtils.sinDeg(s);
          N = G * g - X * p, I = X * g + G * p, Z = G * A - X * P, W = X * A + G * P, B = G * k - X * O, w = X * k + G * O, y = B + (N - Z), R = w + (I - W);
        } else
          N = g, I = p, Z = A, W = P, B = k, w = O, y = E, R = V;
        N += m, I += C, y += m, R += C, B += m, w += C, Z += m, W += C;
        var Y = 0;
        l[Y++] = N, l[Y++] = I, l[Y++] = o.r, l[Y++] = o.g, l[Y++] = o.b, l[Y++] = o.a, l[Y++] = 0, l[Y++] = 1, this.twoColorTint && (l[Y++] = 0, l[Y++] = 0, l[Y++] = 0, l[Y++] = 0), l[Y++] = y, l[Y++] = R, l[Y++] = o.r, l[Y++] = o.g, l[Y++] = o.b, l[Y++] = o.a, l[Y++] = 1, l[Y++] = 1, this.twoColorTint && (l[Y++] = 0, l[Y++] = 0, l[Y++] = 0, l[Y++] = 0), l[Y++] = B, l[Y++] = w, l[Y++] = o.r, l[Y++] = o.g, l[Y++] = o.b, l[Y++] = o.a, l[Y++] = 1, l[Y++] = 0, this.twoColorTint && (l[Y++] = 0, l[Y++] = 0, l[Y++] = 0, l[Y++] = 0), l[Y++] = Z, l[Y++] = W, l[Y++] = o.r, l[Y++] = o.g, l[Y++] = o.b, l[Y++] = o.a, l[Y++] = 0, l[Y++] = 0, this.twoColorTint && (l[Y++] = 0, l[Y++] = 0, l[Y++] = 0, l[Y++] = 0), this.batcher.draw(i, l, this.QUAD_TRIANGLES);
      }, t.prototype.drawRegion = function(i, e, n, f, h, v, u) {
        v === void 0 && (v = null), this.enableRenderer(this.batcher), v === null && (v = this.WHITE);
        var s = this.QUAD, o = 0;
        s[o++] = e, s[o++] = n, s[o++] = v.r, s[o++] = v.g, s[o++] = v.b, s[o++] = v.a, s[o++] = i.u, s[o++] = i.v2, this.twoColorTint && (s[o++] = 0, s[o++] = 0, s[o++] = 0, s[o++] = 0), s[o++] = e + f, s[o++] = n, s[o++] = v.r, s[o++] = v.g, s[o++] = v.b, s[o++] = v.a, s[o++] = i.u2, s[o++] = i.v2, this.twoColorTint && (s[o++] = 0, s[o++] = 0, s[o++] = 0, s[o++] = 0), s[o++] = e + f, s[o++] = n + h, s[o++] = v.r, s[o++] = v.g, s[o++] = v.b, s[o++] = v.a, s[o++] = i.u2, s[o++] = i.v, this.twoColorTint && (s[o++] = 0, s[o++] = 0, s[o++] = 0, s[o++] = 0), s[o++] = e, s[o++] = n + h, s[o++] = v.r, s[o++] = v.g, s[o++] = v.b, s[o++] = v.a, s[o++] = i.u, s[o++] = i.v, this.twoColorTint && (s[o++] = 0, s[o++] = 0, s[o++] = 0, s[o++] = 0), this.batcher.draw(i.texture, s, this.QUAD_TRIANGLES);
      }, t.prototype.line = function(i, e, n, f, h, v) {
        h === void 0 && (h = null), this.enableRenderer(this.shapes), this.shapes.line(i, e, n, f, h);
      }, t.prototype.triangle = function(i, e, n, f, h, v, u, s, o, d) {
        s === void 0 && (s = null), o === void 0 && (o = null), d === void 0 && (d = null), this.enableRenderer(this.shapes), this.shapes.triangle(i, e, n, f, h, v, u, s, o, d);
      }, t.prototype.quad = function(i, e, n, f, h, v, u, s, o, d, l, m, C) {
        d === void 0 && (d = null), l === void 0 && (l = null), m === void 0 && (m = null), C === void 0 && (C = null), this.enableRenderer(this.shapes), this.shapes.quad(i, e, n, f, h, v, u, s, o, d, l, m, C);
      }, t.prototype.rect = function(i, e, n, f, h, v) {
        v === void 0 && (v = null), this.enableRenderer(this.shapes), this.shapes.rect(i, e, n, f, h, v);
      }, t.prototype.rectLine = function(i, e, n, f, h, v, u) {
        u === void 0 && (u = null), this.enableRenderer(this.shapes), this.shapes.rectLine(i, e, n, f, h, v, u);
      }, t.prototype.polygon = function(i, e, n, f) {
        f === void 0 && (f = null), this.enableRenderer(this.shapes), this.shapes.polygon(i, e, n, f);
      }, t.prototype.circle = function(i, e, n, f, h, v) {
        h === void 0 && (h = null), v === void 0 && (v = 0), this.enableRenderer(this.shapes), this.shapes.circle(i, e, n, f, h, v);
      }, t.prototype.curve = function(i, e, n, f, h, v, u, s, o, d) {
        d === void 0 && (d = null), this.enableRenderer(this.shapes), this.shapes.curve(i, e, n, f, h, v, u, s, o, d);
      }, t.prototype.end = function() {
        this.activeRenderer === this.batcher ? this.batcher.end() : this.activeRenderer === this.shapes && this.shapes.end(), this.activeRenderer = null;
      }, t.prototype.resize = function(i) {
        var e = this.canvas, n = e.clientWidth, f = e.clientHeight;
        if ((e.width != n || e.height != f) && (e.width = n, e.height = f), this.context.gl.viewport(0, 0, e.width, e.height), i !== a.Stretch) {
          if (i === a.Expand)
            this.camera.setViewport(n, f);
          else if (i === a.Fit) {
            var h = e.width, v = e.height, u = this.camera.viewportWidth, s = this.camera.viewportHeight, o = s / u, d = v / h, l = o < d ? u / h : s / v;
            this.camera.viewportWidth = h * l, this.camera.viewportHeight = v * l;
          }
        }
        this.camera.update();
      }, t.prototype.enableRenderer = function(i) {
        this.activeRenderer !== i && (this.end(), i instanceof r.PolygonBatcher ? (this.batcherShader.bind(), this.batcherShader.setUniform4x4f(r.Shader.MVP_MATRIX, this.camera.projectionView.values), this.batcherShader.setUniformi("u_texture", 0), this.batcher.begin(this.batcherShader), this.activeRenderer = this.batcher) : i instanceof r.ShapeRenderer ? (this.shapesShader.bind(), this.shapesShader.setUniform4x4f(r.Shader.MVP_MATRIX, this.camera.projectionView.values), this.shapes.begin(this.shapesShader), this.activeRenderer = this.shapes) : this.activeRenderer = this.skeletonDebugRenderer);
      }, t.prototype.dispose = function() {
        this.batcher.dispose(), this.batcherShader.dispose(), this.shapes.dispose(), this.shapesShader.dispose(), this.skeletonDebugRenderer.dispose();
      }, t;
    })();
    r.SceneRenderer = M;
    var a;
    (function(t) {
      t[t.Stretch = 0] = "Stretch", t[t.Expand = 1] = "Expand", t[t.Fit = 2] = "Fit";
    })(a = r.ResizeMode || (r.ResizeMode = {}));
  })(c.webgl || (c.webgl = {}));
})(F || (F = {}));
var F;
(function(c) {
  (function(r) {
    var M = (function() {
      function a(t, i, e) {
        this.vertexShader = i, this.fragmentShader = e, this.vs = null, this.fs = null, this.program = null, this.tmp2x2 = new Float32Array(4), this.tmp3x3 = new Float32Array(9), this.tmp4x4 = new Float32Array(16), this.vsSource = i, this.fsSource = e, this.context = t instanceof r.ManagedWebGLRenderingContext ? t : new r.ManagedWebGLRenderingContext(t), this.context.addRestorable(this), this.compile();
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
        var e = this.context.gl, n = e.createShader(t);
        if (e.shaderSource(n, i), e.compileShader(n), !e.getShaderParameter(n, e.COMPILE_STATUS)) {
          var f = "Couldn't compile shader: " + e.getShaderInfoLog(n);
          if (e.deleteShader(n), !e.isContextLost())
            throw new Error(f);
        }
        return n;
      }, a.prototype.compileProgram = function(t, i) {
        var e = this.context.gl, n = e.createProgram();
        if (e.attachShader(n, t), e.attachShader(n, i), e.linkProgram(n), !e.getProgramParameter(n, e.LINK_STATUS)) {
          var f = "Couldn't compile shader program: " + e.getProgramInfoLog(n);
          if (e.deleteProgram(n), !e.isContextLost())
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
      }, a.prototype.setUniform2f = function(t, i, e) {
        this.context.gl.uniform2f(this.getUniformLocation(t), i, e);
      }, a.prototype.setUniform3f = function(t, i, e, n) {
        this.context.gl.uniform3f(this.getUniformLocation(t), i, e, n);
      }, a.prototype.setUniform4f = function(t, i, e, n, f) {
        this.context.gl.uniform4f(this.getUniformLocation(t), i, e, n, f);
      }, a.prototype.setUniform2x2f = function(t, i) {
        var e = this.context.gl;
        this.tmp2x2.set(i), e.uniformMatrix2fv(this.getUniformLocation(t), !1, this.tmp2x2);
      }, a.prototype.setUniform3x3f = function(t, i) {
        var e = this.context.gl;
        this.tmp3x3.set(i), e.uniformMatrix3fv(this.getUniformLocation(t), !1, this.tmp3x3);
      }, a.prototype.setUniform4x4f = function(t, i) {
        var e = this.context.gl;
        this.tmp4x4.set(i), e.uniformMatrix4fv(this.getUniformLocation(t), !1, this.tmp4x4);
      }, a.prototype.getUniformLocation = function(t) {
        var i = this.context.gl, e = i.getUniformLocation(this.program, t);
        if (!e && !i.isContextLost())
          throw new Error("Couldn't find location for uniform " + t);
        return e;
      }, a.prototype.getAttributeLocation = function(t) {
        var i = this.context.gl, e = i.getAttribLocation(this.program, t);
        if (e == -1 && !i.isContextLost())
          throw new Error("Couldn't find location for attribute " + t);
        return e;
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
			`, e = `
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
        return new a(t, i, e);
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
			`, e = `
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
        return new a(t, i, e);
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
			`, e = `
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
        return new a(t, i, e);
      }, a.MVP_MATRIX = "u_projTrans", a.POSITION = "a_position", a.COLOR = "a_color", a.COLOR2 = "a_color2", a.TEXCOORDS = "a_texCoords", a.SAMPLER = "u_texture", a;
    })();
    r.Shader = M;
  })(c.webgl || (c.webgl = {}));
})(F || (F = {}));
var F;
(function(c) {
  (function(r) {
    var M = (function() {
      function t(i, e) {
        if (e === void 0 && (e = 10920), this.isDrawing = !1, this.shapeType = a.Filled, this.color = new c.Color(1, 1, 1, 1), this.vertexIndex = 0, this.tmp = new c.Vector2(), e > 10920)
          throw new Error("Can't have more than 10920 triangles per batch: " + e);
        this.context = i instanceof r.ManagedWebGLRenderingContext ? i : new r.ManagedWebGLRenderingContext(i), this.mesh = new r.Mesh(i, [new r.Position2Attribute(), new r.ColorAttribute()], e, 0), this.srcBlend = this.context.gl.SRC_ALPHA, this.dstBlend = this.context.gl.ONE_MINUS_SRC_ALPHA;
      }
      return t.prototype.begin = function(i) {
        if (this.isDrawing)
          throw new Error("ShapeRenderer.begin() has already been called");
        this.shader = i, this.vertexIndex = 0, this.isDrawing = !0;
        var e = this.context.gl;
        e.enable(e.BLEND), e.blendFunc(this.srcBlend, this.dstBlend);
      }, t.prototype.setBlendMode = function(i, e) {
        var n = this.context.gl;
        this.srcBlend = i, this.dstBlend = e, this.isDrawing && (this.flush(), n.blendFunc(this.srcBlend, this.dstBlend));
      }, t.prototype.setColor = function(i) {
        this.color.setFromColor(i);
      }, t.prototype.setColorWith = function(i, e, n, f) {
        this.color.set(i, e, n, f);
      }, t.prototype.point = function(i, e, n) {
        n === void 0 && (n = null), this.check(a.Point, 1), n === null && (n = this.color), this.vertex(i, e, n);
      }, t.prototype.line = function(i, e, n, f, h) {
        h === void 0 && (h = null), this.check(a.Line, 2), this.mesh.getVertices(), this.vertexIndex, h === null && (h = this.color), this.vertex(i, e, h), this.vertex(n, f, h);
      }, t.prototype.triangle = function(i, e, n, f, h, v, u, s, o, d) {
        s === void 0 && (s = null), o === void 0 && (o = null), d === void 0 && (d = null), this.check(i ? a.Filled : a.Line, 3), this.mesh.getVertices(), this.vertexIndex, s === null && (s = this.color), o === null && (o = this.color), d === null && (d = this.color), i ? (this.vertex(e, n, s), this.vertex(f, h, o), this.vertex(v, u, d)) : (this.vertex(e, n, s), this.vertex(f, h, o), this.vertex(f, h, s), this.vertex(v, u, o), this.vertex(v, u, s), this.vertex(e, n, o));
      }, t.prototype.quad = function(i, e, n, f, h, v, u, s, o, d, l, m, C) {
        d === void 0 && (d = null), l === void 0 && (l = null), m === void 0 && (m = null), C === void 0 && (C = null), this.check(i ? a.Filled : a.Line, 3), this.mesh.getVertices(), this.vertexIndex, d === null && (d = this.color), l === null && (l = this.color), m === null && (m = this.color), C === null && (C = this.color), i ? (this.vertex(e, n, d), this.vertex(f, h, l), this.vertex(v, u, m), this.vertex(v, u, m), this.vertex(s, o, C), this.vertex(e, n, d)) : (this.vertex(e, n, d), this.vertex(f, h, l), this.vertex(f, h, l), this.vertex(v, u, m), this.vertex(v, u, m), this.vertex(s, o, C), this.vertex(s, o, C), this.vertex(e, n, d));
      }, t.prototype.rect = function(i, e, n, f, h, v) {
        v === void 0 && (v = null), this.quad(i, e, n, e + f, n, e + f, n + h, e, n + h, v, v, v, v);
      }, t.prototype.rectLine = function(i, e, n, f, h, v, u) {
        u === void 0 && (u = null), this.check(i ? a.Filled : a.Line, 8), u === null && (u = this.color);
        var s = this.tmp.set(h - n, e - f);
        s.normalize(), v *= 0.5;
        var o = s.x * v, d = s.y * v;
        i ? (this.vertex(e + o, n + d, u), this.vertex(e - o, n - d, u), this.vertex(f + o, h + d, u), this.vertex(f - o, h - d, u), this.vertex(f + o, h + d, u), this.vertex(e - o, n - d, u)) : (this.vertex(e + o, n + d, u), this.vertex(e - o, n - d, u), this.vertex(f + o, h + d, u), this.vertex(f - o, h - d, u), this.vertex(f + o, h + d, u), this.vertex(e + o, n + d, u), this.vertex(f - o, h - d, u), this.vertex(e - o, n - d, u));
      }, t.prototype.x = function(i, e, n) {
        this.line(i - n, e - n, i + n, e + n), this.line(i - n, e + n, i + n, e - n);
      }, t.prototype.polygon = function(i, e, n, f) {
        if (f === void 0 && (f = null), n < 3)
          throw new Error("Polygon must contain at least 3 vertices");
        this.check(a.Line, n * 2), f === null && (f = this.color), this.mesh.getVertices(), this.vertexIndex, e <<= 1, n <<= 1;
        for (var h = i[e], v = i[e + 1], u = e + n, s = e, o = e + n - 2; s < o; s += 2) {
          var d = i[s], l = i[s + 1], m = 0, C = 0;
          s + 2 >= u ? (m = h, C = v) : (m = i[s + 2], C = i[s + 3]), this.vertex(d, l, f), this.vertex(m, C, f);
        }
      }, t.prototype.circle = function(i, e, n, f, h, v) {
        if (h === void 0 && (h = null), v === void 0 && (v = 0), v === 0 && (v = Math.max(1, 6 * c.MathUtils.cbrt(f) | 0)), v <= 0)
          throw new Error("segments must be > 0.");
        h === null && (h = this.color);
        var u = 2 * c.MathUtils.PI / v, s = Math.cos(u), o = Math.sin(u), d = f, l = 0;
        if (i) {
          this.check(a.Filled, v * 3 + 3), v--;
          for (var m = 0; m < v; m++) {
            this.vertex(e, n, h), this.vertex(e + d, n + l, h);
            var S = d;
            d = s * d - o * l, l = o * S + s * l, this.vertex(e + d, n + l, h);
          }
          this.vertex(e, n, h), this.vertex(e + d, n + l, h);
        } else {
          this.check(a.Line, v * 2 + 2);
          for (var m = 0; m < v; m++) {
            this.vertex(e + d, n + l, h);
            var C = d;
            d = s * d - o * l, l = o * C + s * l, this.vertex(e + d, n + l, h);
          }
          this.vertex(e + d, n + l, h);
        }
        d = f, l = 0, this.vertex(e + d, n + l, h);
      }, t.prototype.curve = function(i, e, n, f, h, v, u, s, o, d) {
        d === void 0 && (d = null), this.check(a.Line, o * 2 + 2), d === null && (d = this.color);
        for (var l = 1 / o, m = l * l, C = l * l * l, S = 3 * l, D = 3 * m, T = 6 * m, x = 6 * C, g = i - n * 2 + h, p = e - f * 2 + v, A = (n - h) * 3 - i + u, P = (f - v) * 3 - e + s, k = i, O = e, E = (n - i) * S + g * D + A * C, V = (f - e) * S + p * D + P * C, N = g * T + A * x, I = p * T + P * x, y = A * x, R = P * x; o-- > 0; )
          this.vertex(k, O, d), k += E, O += V, E += N, V += I, N += y, I += R, this.vertex(k, O, d);
        this.vertex(k, O, d), this.vertex(u, s, d);
      }, t.prototype.vertex = function(i, e, n) {
        var f = this.vertexIndex, h = this.mesh.getVertices();
        h[f++] = i, h[f++] = e, h[f++] = n.r, h[f++] = n.g, h[f++] = n.b, h[f++] = n.a, this.vertexIndex = f;
      }, t.prototype.end = function() {
        if (!this.isDrawing)
          throw new Error("ShapeRenderer.begin() has not been called");
        this.flush(), this.context.gl.disable(this.context.gl.BLEND), this.isDrawing = !1;
      }, t.prototype.flush = function() {
        this.vertexIndex != 0 && (this.mesh.setVerticesLength(this.vertexIndex), this.mesh.draw(this.shader, this.shapeType), this.vertexIndex = 0);
      }, t.prototype.check = function(i, e) {
        if (!this.isDrawing)
          throw new Error("ShapeRenderer.begin() has not been called");
        if (this.shapeType == i)
          if (this.mesh.maxVertices() - this.mesh.numVertices() < e)
            this.flush();
          else
            return;
        else
          this.flush(), this.shapeType = i;
      }, t.prototype.dispose = function() {
        this.mesh.dispose();
      }, t;
    })();
    r.ShapeRenderer = M;
    var a;
    (function(t) {
      t[t.Point = 0] = "Point", t[t.Line = 1] = "Line", t[t.Filled = 4] = "Filled";
    })(a = r.ShapeType || (r.ShapeType = {}));
  })(c.webgl || (c.webgl = {}));
})(F || (F = {}));
var F;
(function(c) {
  (function(r) {
    var M = (function() {
      function a(t) {
        this.boneLineColor = new c.Color(1, 0, 0, 1), this.boneOriginColor = new c.Color(0, 1, 0, 1), this.attachmentLineColor = new c.Color(0, 0, 1, 0.5), this.triangleLineColor = new c.Color(1, 0.64, 0, 0.5), this.pathColor = new c.Color().setFromString("FF7F00"), this.clipColor = new c.Color(0.8, 0, 0, 2), this.aabbColor = new c.Color(0, 1, 0, 0.5), this.drawBones = !0, this.drawRegionAttachments = !0, this.drawBoundingBoxes = !0, this.drawMeshHull = !0, this.drawMeshTriangles = !0, this.drawPaths = !0, this.drawSkeletonXY = !1, this.drawClipping = !0, this.premultipliedAlpha = !1, this.scale = 1, this.boneWidth = 2, this.bounds = new c.SkeletonBounds(), this.temp = new Array(), this.vertices = c.Utils.newFloatArray(2048), this.context = t instanceof r.ManagedWebGLRenderingContext ? t : new r.ManagedWebGLRenderingContext(t);
      }
      return a.prototype.draw = function(t, i, e) {
        e === void 0 && (e = null);
        var n = i.x, f = i.y, h = this.context.gl, v = this.premultipliedAlpha ? h.ONE : h.SRC_ALPHA;
        t.setBlendMode(v, h.ONE_MINUS_SRC_ALPHA);
        var u = i.bones;
        if (this.drawBones) {
          t.setColor(this.boneLineColor);
          for (var s = 0, o = u.length; s < o; s++) {
            var d = u[s];
            if (!(e && e.indexOf(d.data.name) > -1) && d.parent != null) {
              var l = n + d.data.length * d.a + d.worldX, m = f + d.data.length * d.c + d.worldY;
              t.rectLine(!0, n + d.worldX, f + d.worldY, l, m, this.boneWidth * this.scale);
            }
          }
          this.drawSkeletonXY && t.x(n, f, 4 * this.scale);
        }
        if (this.drawRegionAttachments) {
          t.setColor(this.attachmentLineColor);
          for (var C = i.slots, s = 0, o = C.length; s < o; s++) {
            var S = C[s], D = S.getAttachment();
            if (D instanceof c.RegionAttachment) {
              var T = D, x = this.vertices;
              T.computeWorldVertices(S.bone, x, 0, 2), t.line(x[0], x[1], x[2], x[3]), t.line(x[2], x[3], x[4], x[5]), t.line(x[4], x[5], x[6], x[7]), t.line(x[6], x[7], x[0], x[1]);
            }
          }
        }
        if (this.drawMeshHull || this.drawMeshTriangles)
          for (var C = i.slots, s = 0, o = C.length; s < o; s++) {
            var S = C[s];
            if (S.bone.active) {
              var D = S.getAttachment();
              if (D instanceof c.MeshAttachment) {
                var g = D, x = this.vertices;
                g.computeWorldVertices(S, 0, g.worldVerticesLength, x, 0, 2);
                var p = g.triangles, A = g.hullLength;
                if (this.drawMeshTriangles) {
                  t.setColor(this.triangleLineColor);
                  for (var P = 0, k = p.length; P < k; P += 3) {
                    var O = p[P] * 2, E = p[P + 1] * 2, V = p[P + 2] * 2;
                    t.triangle(!1, x[O], x[O + 1], x[E], x[E + 1], x[V], x[V + 1]);
                  }
                }
                if (this.drawMeshHull && A > 0) {
                  t.setColor(this.attachmentLineColor), A = (A >> 1) * 2;
                  for (var N = x[A - 2], I = x[A - 1], P = 0, k = A; P < k; P += 2) {
                    var l = x[P], m = x[P + 1];
                    t.line(l, m, N, I), N = l, I = m;
                  }
                }
              }
            }
          }
        if (this.drawBoundingBoxes) {
          var y = this.bounds;
          y.update(i, !0), t.setColor(this.aabbColor), t.rect(!1, y.minX, y.minY, y.getWidth(), y.getHeight());
          for (var R = y.polygons, B = y.boundingBoxes, s = 0, o = R.length; s < o; s++) {
            var w = R[s];
            t.setColor(B[s].color), t.polygon(w, 0, w.length);
          }
        }
        if (this.drawPaths)
          for (var C = i.slots, s = 0, o = C.length; s < o; s++) {
            var S = C[s];
            if (S.bone.active) {
              var D = S.getAttachment();
              if (D instanceof c.PathAttachment) {
                var Z = D, k = Z.worldVerticesLength, W = this.temp = c.Utils.setArraySize(this.temp, k, 0);
                Z.computeWorldVertices(S, 0, k, W, 0, 2);
                var G = this.pathColor, X = W[2], Y = W[3], U = 0, L = 0;
                if (Z.closed) {
                  t.setColor(G);
                  var j = W[0], z = W[1], _ = W[k - 2], H = W[k - 1];
                  U = W[k - 4], L = W[k - 3], t.curve(X, Y, j, z, _, H, U, L, 32), t.setColor(a.LIGHT_GRAY), t.line(X, Y, j, z), t.line(U, L, _, H);
                }
                k -= 4;
                for (var P = 4; P < k; P += 6) {
                  var j = W[P], z = W[P + 1], _ = W[P + 2], H = W[P + 3];
                  U = W[P + 4], L = W[P + 5], t.setColor(G), t.curve(X, Y, j, z, _, H, U, L, 32), t.setColor(a.LIGHT_GRAY), t.line(X, Y, j, z), t.line(U, L, _, H), X = U, Y = L;
                }
              }
            }
          }
        if (this.drawBones) {
          t.setColor(this.boneOriginColor);
          for (var s = 0, o = u.length; s < o; s++) {
            var d = u[s];
            e && e.indexOf(d.data.name) > -1 || t.circle(!0, n + d.worldX, f + d.worldY, 3 * this.scale, a.GREEN, 8);
          }
        }
        if (this.drawClipping) {
          var C = i.slots;
          t.setColor(this.clipColor);
          for (var s = 0, o = C.length; s < o; s++) {
            var S = C[s];
            if (S.bone.active) {
              var D = S.getAttachment();
              if (D instanceof c.ClippingAttachment) {
                var q = D, k = q.worldVerticesLength, W = this.temp = c.Utils.setArraySize(this.temp, k, 0);
                q.computeWorldVertices(S, 0, k, W, 0, 2);
                for (var b = 0, J = W.length; b < J; b += 2) {
                  var l = W[b], m = W[b + 1], U = W[(b + 2) % W.length], L = W[(b + 3) % W.length];
                  t.line(l, m, U, L);
                }
              }
            }
          }
        }
      }, a.prototype.dispose = function() {
      }, a.LIGHT_GRAY = new c.Color(0.7529411764705882, 0.7529411764705882, 0.7529411764705882, 1), a.GREEN = new c.Color(0, 1, 0, 1), a;
    })();
    r.SkeletonDebugRenderer = M;
  })(c.webgl || (c.webgl = {}));
})(F || (F = {}));
var F;
(function(c) {
  (function(r) {
    var M = /* @__PURE__ */ (function() {
      function t(i, e, n) {
        this.vertices = i, this.numVertices = e, this.numFloats = n;
      }
      return t;
    })(), a = (function() {
      function t(i, e) {
        e === void 0 && (e = !0), this.premultipliedAlpha = !1, this.vertexEffect = null, this.tempColor = new c.Color(), this.tempColor2 = new c.Color(), this.vertexSize = 8, this.twoColorTint = !1, this.renderable = new M(null, 0, 0), this.clipper = new c.SkeletonClipping(), this.temp = new c.Vector2(), this.temp2 = new c.Vector2(), this.temp3 = new c.Color(), this.temp4 = new c.Color(), this.twoColorTint = e, e && (this.vertexSize += 4), this.vertices = c.Utils.newFloatArray(this.vertexSize * 1024);
      }
      return t.prototype.draw = function(i, e, n, f) {
        n === void 0 && (n = -1), f === void 0 && (f = -1);
        var h = this.clipper, v = this.premultipliedAlpha, u = this.twoColorTint, s = null, o = this.temp, d = this.temp2, l = this.temp3, m = this.temp4, C = this.renderable, S = null, D = null, T = e.drawOrder, x = null, g = e.color, p = u ? 12 : 8, A = !1;
        n == -1 && (A = !0);
        for (var P = 0, k = T.length; P < k; P++) {
          var O = h.isClipping() ? 2 : p, E = T[P];
          if (!E.bone.active) {
            h.clipEndWithSlot(E);
            continue;
          }
          if (n >= 0 && n == E.data.index && (A = !0), !A) {
            h.clipEndWithSlot(E);
            continue;
          }
          f >= 0 && f == E.data.index && (A = !1);
          var V = E.getAttachment(), N = null;
          if (V instanceof c.RegionAttachment) {
            var I = V;
            C.vertices = this.vertices, C.numVertices = 4, C.numFloats = O << 2, I.computeWorldVertices(E.bone, C.vertices, 0, O), D = t.QUAD_TRIANGLES, S = I.uvs, N = I.region.renderObject.texture, x = I.color;
          } else if (V instanceof c.MeshAttachment) {
            var y = V;
            C.vertices = this.vertices, C.numVertices = y.worldVerticesLength >> 1, C.numFloats = C.numVertices * O, C.numFloats > C.vertices.length && (C.vertices = this.vertices = c.Utils.newFloatArray(C.numFloats)), y.computeWorldVertices(E, 0, y.worldVerticesLength, C.vertices, 0, O), D = y.triangles, N = y.region.renderObject.texture, S = y.uvs, x = y.color;
          } else if (V instanceof c.ClippingAttachment) {
            var R = V;
            h.clipStart(E, R);
            continue;
          } else {
            h.clipEndWithSlot(E);
            continue;
          }
          if (N != null) {
            var B = E.color, w = this.tempColor;
            w.r = g.r * B.r * x.r, w.g = g.g * B.g * x.g, w.b = g.b * B.b * x.b, w.a = g.a * B.a * x.a, v && (w.r *= w.a, w.g *= w.a, w.b *= w.a);
            var Z = this.tempColor2;
            E.darkColor == null ? Z.set(0, 0, 0, 1) : (v ? (Z.r = E.darkColor.r * w.a, Z.g = E.darkColor.g * w.a, Z.b = E.darkColor.b * w.a) : Z.setFromColor(E.darkColor), Z.a = v ? 1 : 0);
            var W = E.data.blendMode;
            if (W != s && (s = W, i.setBlendMode(r.WebGLBlendModeConverter.getSourceGLBlendMode(s, v), r.WebGLBlendModeConverter.getDestGLBlendMode(s))), h.isClipping()) {
              h.clipTriangles(C.vertices, C.numFloats, D, D.length, S, w, Z, u);
              var G = new Float32Array(h.clippedVertices), X = h.clippedTriangles;
              if (this.vertexEffect != null) {
                var Y = this.vertexEffect, U = G;
                if (u)
                  for (var L = 0, z = G.length; L < z; L += p)
                    o.x = U[L], o.y = U[L + 1], l.set(U[L + 2], U[L + 3], U[L + 4], U[L + 5]), d.x = U[L + 6], d.y = U[L + 7], m.set(U[L + 8], U[L + 9], U[L + 10], U[L + 11]), Y.transform(o, d, l, m), U[L] = o.x, U[L + 1] = o.y, U[L + 2] = l.r, U[L + 3] = l.g, U[L + 4] = l.b, U[L + 5] = l.a, U[L + 6] = d.x, U[L + 7] = d.y, U[L + 8] = m.r, U[L + 9] = m.g, U[L + 10] = m.b, U[L + 11] = m.a;
                else
                  for (var L = 0, j = G.length; L < j; L += p)
                    o.x = U[L], o.y = U[L + 1], l.set(U[L + 2], U[L + 3], U[L + 4], U[L + 5]), d.x = U[L + 6], d.y = U[L + 7], m.set(0, 0, 0, 0), Y.transform(o, d, l, m), U[L] = o.x, U[L + 1] = o.y, U[L + 2] = l.r, U[L + 3] = l.g, U[L + 4] = l.b, U[L + 5] = l.a, U[L + 6] = d.x, U[L + 7] = d.y;
              }
              i.draw(N, G, X);
            } else {
              var U = C.vertices;
              if (this.vertexEffect != null) {
                var Y = this.vertexEffect;
                if (u)
                  for (var L = 0, _ = 0, q = C.numFloats; L < q; L += p, _ += 2)
                    o.x = U[L], o.y = U[L + 1], d.x = S[_], d.y = S[_ + 1], l.setFromColor(w), m.setFromColor(Z), Y.transform(o, d, l, m), U[L] = o.x, U[L + 1] = o.y, U[L + 2] = l.r, U[L + 3] = l.g, U[L + 4] = l.b, U[L + 5] = l.a, U[L + 6] = d.x, U[L + 7] = d.y, U[L + 8] = m.r, U[L + 9] = m.g, U[L + 10] = m.b, U[L + 11] = m.a;
                else
                  for (var L = 0, _ = 0, H = C.numFloats; L < H; L += p, _ += 2)
                    o.x = U[L], o.y = U[L + 1], d.x = S[_], d.y = S[_ + 1], l.setFromColor(w), m.set(0, 0, 0, 0), Y.transform(o, d, l, m), U[L] = o.x, U[L + 1] = o.y, U[L + 2] = l.r, U[L + 3] = l.g, U[L + 4] = l.b, U[L + 5] = l.a, U[L + 6] = d.x, U[L + 7] = d.y;
              } else if (u)
                for (var L = 2, _ = 0, J = C.numFloats; L < J; L += p, _ += 2)
                  U[L] = w.r, U[L + 1] = w.g, U[L + 2] = w.b, U[L + 3] = w.a, U[L + 4] = S[_], U[L + 5] = S[_ + 1], U[L + 6] = Z.r, U[L + 7] = Z.g, U[L + 8] = Z.b, U[L + 9] = Z.a;
              else
                for (var L = 2, _ = 0, b = C.numFloats; L < b; L += p, _ += 2)
                  U[L] = w.r, U[L + 1] = w.g, U[L + 2] = w.b, U[L + 3] = w.a, U[L + 4] = S[_], U[L + 5] = S[_ + 1];
              var it = C.vertices.subarray(0, C.numFloats);
              i.draw(N, it, D);
            }
          }
          h.clipEndWithSlot(E);
        }
        h.clipEnd();
      }, t.QUAD_TRIANGLES = [0, 1, 2, 2, 3, 0], t;
    })();
    r.SkeletonRenderer = a;
  })(c.webgl || (c.webgl = {}));
})(F || (F = {}));
var F;
(function(c) {
  (function(r) {
    var M = (function() {
      function a(t, i, e) {
        t === void 0 && (t = 0), i === void 0 && (i = 0), e === void 0 && (e = 0), this.x = 0, this.y = 0, this.z = 0, this.x = t, this.y = i, this.z = e;
      }
      return a.prototype.setFrom = function(t) {
        return this.x = t.x, this.y = t.y, this.z = t.z, this;
      }, a.prototype.set = function(t, i, e) {
        return this.x = t, this.y = i, this.z = e, this;
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
        return this.set(this.x * i[r.M00] + this.y * i[r.M01] + this.z * i[r.M02] + i[r.M03], this.x * i[r.M10] + this.y * i[r.M11] + this.z * i[r.M12] + i[r.M13], this.x * i[r.M20] + this.y * i[r.M21] + this.z * i[r.M22] + i[r.M23]);
      }, a.prototype.project = function(t) {
        var i = t.values, e = 1 / (this.x * i[r.M30] + this.y * i[r.M31] + this.z * i[r.M32] + i[r.M33]);
        return this.set((this.x * i[r.M00] + this.y * i[r.M01] + this.z * i[r.M02] + i[r.M03]) * e, (this.x * i[r.M10] + this.y * i[r.M11] + this.z * i[r.M12] + i[r.M13]) * e, (this.x * i[r.M20] + this.y * i[r.M21] + this.z * i[r.M22] + i[r.M23]) * e);
      }, a.prototype.dot = function(t) {
        return this.x * t.x + this.y * t.y + this.z * t.z;
      }, a.prototype.length = function() {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
      }, a.prototype.distance = function(t) {
        var i = t.x - this.x, e = t.y - this.y, n = t.z - this.z;
        return Math.sqrt(i * i + e * e + n * n);
      }, a;
    })();
    r.Vector3 = M;
  })(c.webgl || (c.webgl = {}));
})(F || (F = {}));
var F;
(function(c) {
  (function(r) {
    var M = (function() {
      function t(i, e) {
        e === void 0 && (e = { alpha: "true" }), this.restorables = new Array(), i instanceof WebGLRenderingContext || i instanceof WebGL2RenderingContext ? (this.gl = i, this.canvas = this.gl.canvas) : this.setupCanvas(i, e);
      }
      return t.prototype.setupCanvas = function(i, e) {
        var n = this;
        this.gl = i.getContext("webgl2", e) || i.getContext("webgl", e), this.canvas = i, i.addEventListener("webglcontextlost", function(f) {
          f && f.preventDefault();
        }), i.addEventListener("webglcontextrestored", function(f) {
          for (var h = 0, v = n.restorables.length; h < v; h++)
            n.restorables[h].restore();
        });
      }, t.prototype.addRestorable = function(i) {
        this.restorables.push(i);
      }, t.prototype.removeRestorable = function(i) {
        var e = this.restorables.indexOf(i);
        e > -1 && this.restorables.splice(e, 1);
      }, t;
    })();
    r.ManagedWebGLRenderingContext = M;
    var a = (function() {
      function t() {
      }
      return t.getDestGLBlendMode = function(i) {
        switch (i) {
          case c.BlendMode.Normal:
            return t.ONE_MINUS_SRC_ALPHA;
          case c.BlendMode.Additive:
            return t.ONE;
          case c.BlendMode.Multiply:
            return t.ONE_MINUS_SRC_ALPHA;
          case c.BlendMode.Screen:
            return t.ONE_MINUS_SRC_ALPHA;
          default:
            throw new Error("Unknown blend mode: " + i);
        }
      }, t.getSourceGLBlendMode = function(i, e) {
        switch (e === void 0 && (e = !1), i) {
          case c.BlendMode.Normal:
            return e ? t.ONE : t.SRC_ALPHA;
          case c.BlendMode.Additive:
            return e ? t.ONE : t.SRC_ALPHA;
          case c.BlendMode.Multiply:
            return t.DST_COLOR;
          case c.BlendMode.Screen:
            return t.ONE;
          default:
            throw new Error("Unknown blend mode: " + i);
        }
      }, t.ZERO = 0, t.ONE = 1, t.SRC_COLOR = 768, t.ONE_MINUS_SRC_COLOR = 769, t.SRC_ALPHA = 770, t.ONE_MINUS_SRC_ALPHA = 771, t.DST_ALPHA = 772, t.ONE_MINUS_DST_ALPHA = 773, t.DST_COLOR = 774, t;
    })();
    r.WebGLBlendModeConverter = a;
  })(c.webgl || (c.webgl = {}));
})(F || (F = {}));
var F;
(function(c) {
  var r = (function() {
    function u(s, o, d) {
      this.player = s, this.dom = f(`
				<div class="spine-player-popup spine-player-hidden">
				</div>
			`), this.dom.innerHTML = d, o.appendChild(this.dom);
    }
    return u.prototype.show = function(s) {
      var o = this;
      this.dom.classList.remove("spine-player-hidden");
      var d = !1, l = function() {
        d || requestAnimationFrame(l);
        var S = Math.abs(o.dom.getBoundingClientRect().bottom - o.player.getBoundingClientRect().bottom), D = Math.abs(o.dom.getBoundingClientRect().right - o.player.getBoundingClientRect().right), T = o.player.clientHeight - S - D;
        o.dom.style.maxHeight = T + "px";
      };
      requestAnimationFrame(l);
      var m = !0, C = function(S) {
        if (m) {
          m = !1;
          return;
        }
        i(o.dom, S.target) || (o.dom.remove(), window.removeEventListener("click", C), s(), d = !0);
      };
      window.addEventListener("click", C);
    }, u;
  })(), M = (function() {
    function u(s) {
      this.text = s, this.enabled = !1;
    }
    return u.prototype.render = function() {
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
    }, u.prototype.setEnabled = function(s) {
      s ? this.switch.classList.add("active") : this.switch.classList.remove("active"), this.enabled = s;
    }, u.prototype.isEnabled = function() {
      return this.enabled;
    }, u;
  })(), a = (function() {
    function u(s, o, d) {
      s === void 0 && (s = 0), o === void 0 && (o = 0.1), d === void 0 && (d = !1), this.snaps = s, this.snapPercentage = o, this.big = d;
    }
    return u.prototype.render = function() {
      var s = this;
      this.slider = f(`
				<div class="spine-player-slider ` + (this.big ? "big" : "") + `">
					<div class="spine-player-slider-value"></div>
					<!--<div class="spine-player-slider-knob"></div>-->
				</div>
			`), this.value = n(this.slider, "spine-player-slider-value")[0], this.setValue(0);
      var o = new c.webgl.Input(this.slider), d = !1;
      return o.addListener({
        down: function(l, m) {
          d = !0, s.value.classList.add("hovering");
        },
        up: function(l, m) {
          d = !1;
          var C = l / s.slider.clientWidth;
          C = C = Math.max(0, Math.min(C, 1)), s.setValue(l / s.slider.clientWidth), s.change && s.change(C), s.value.classList.remove("hovering");
        },
        moved: function(l, m) {
          if (d) {
            var C = l / s.slider.clientWidth;
            C = Math.max(0, Math.min(C, 1)), C = s.setValue(l / s.slider.clientWidth), s.change && s.change(C);
          }
        },
        dragged: function(l, m) {
          var C = l / s.slider.clientWidth;
          C = Math.max(0, Math.min(C, 1)), C = s.setValue(l / s.slider.clientWidth), s.change && s.change(C);
        }
      }), this.slider;
    }, u.prototype.setValue = function(s) {
      if (s = Math.max(0, Math.min(1, s)), this.snaps > 0) {
        var o = s % (1 / this.snaps);
        o < 1 / this.snaps * this.snapPercentage ? s = s - o : o > 1 / this.snaps - 1 / this.snaps * this.snapPercentage && (s = s - o + 1 / this.snaps), s = Math.max(0, Math.min(1, s));
      }
      return this.value.style.width = "" + s * 100 + "%", s;
    }, u;
  })(), t = (function() {
    function u(s, o) {
      this.config = o, this.paused = !0, this.playTime = 0, this.speed = 1, this.time = new c.TimeKeeper(), this.animationViewports = {}, this.currentViewport = null, this.previousViewport = null, this.viewportTransitionStart = 0, this.stopRequestAnimationFrame = !1, this.cancelId = 0, typeof s == "string" ? this.parent = document.getElementById(s) : this.parent = s, this.parent.appendChild(this.render());
    }
    return u.prototype.validateConfig = function(s) {
      if (!s)
        throw new Error("Please pass a configuration to new.spine.SpinePlayer().");
      if (!s.jsonUrl && !s.skelUrl)
        throw new Error("Please specify the URL of the skeleton JSON or .skel file.");
      if (!s.atlasUrl)
        throw new Error("Please specify the URL of the atlas file.");
      if (s.alpha || (s.alpha = !1), s.backgroundColor || (s.backgroundColor = "#000000"), s.fullScreenBackgroundColor || (s.fullScreenBackgroundColor = s.backgroundColor), typeof s.premultipliedAlpha > "u" && (s.premultipliedAlpha = !0), s.success || (s.success = function(o) {
      }), s.error || (s.error = function(o, d) {
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
    }, u.prototype.showError = function(s) {
      var o = n(this.dom, "spine-player-error")[0];
      o.classList.remove("spine-player-hidden"), o.innerHTML = '<p style="text-align: center; align-self: center;">' + s + "</p>", this.config.error(this, s);
    }, u.prototype.render = function() {
      var s = this, o = this.config, d = this.dom = f(`
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
        this.config = this.validateConfig(o);
      } catch (E) {
        return this.showError(E), d;
      }
      try {
        this.canvas = n(d, "spine-player-canvas")[0];
        var l = { alpha: o.alpha };
        this.context = new c.webgl.ManagedWebGLRenderingContext(this.canvas, l), this.sceneRenderer = new c.webgl.SceneRenderer(this.canvas, this.context, !0), this.loadingScreen = new c.webgl.LoadingScreen(this.sceneRenderer);
      } catch {
        return this.showError("Sorry, your browser does not support WebGL.<br><br>Please use the latest version of Firefox, Chrome, Edge, or Safari."), d;
      }
      if (this.assetManager = new c.webgl.AssetManager(this.context), o.rawDataURIs)
        for (var m in o.rawDataURIs) {
          var C = o.rawDataURIs[m];
          this.assetManager.setRawDataURI(m, C);
        }
      o.jsonUrl ? this.assetManager.loadText(o.jsonUrl) : this.assetManager.loadBinary(o.skelUrl), this.assetManager.loadTextureAtlas(o.atlasUrl), o.backgroundImage && o.backgroundImage.url && this.assetManager.loadTexture(o.backgroundImage.url), requestAnimationFrame(function() {
        return s.drawFrame();
      }), this.playerControls = n(d, "spine-player-controls")[0];
      var S = n(d, "spine-player-timeline")[0];
      this.timelineSlider = new a(), S.appendChild(this.timelineSlider.render()), this.playButton = e(d, "spine-player-button-play-pause")[0];
      var D = e(d, "spine-player-button-speed")[0];
      this.animationButton = e(d, "spine-player-button-animation")[0], this.skinButton = e(d, "spine-player-button-skin")[0];
      var T = e(d, "spine-player-button-settings")[0], x = e(d, "spine-player-button-fullscreen")[0], g = e(d, "spine-player-button-logo")[0];
      this.playButton.onclick = function() {
        s.paused ? s.play() : s.pause();
      }, D.onclick = function() {
        s.showSpeedDialog(D);
      }, this.animationButton.onclick = function() {
        s.showAnimationsDialog(s.animationButton);
      }, this.skinButton.onclick = function() {
        s.showSkinsDialog(s.skinButton);
      }, T.onclick = function() {
        s.showSettingsDialog(T);
      };
      var p = this.canvas.clientWidth, A = this.canvas.clientHeight, P = this.canvas.style.width, k = this.canvas.style.height, O = !1;
      return x.onclick = function() {
        var E = function() {
          O = !O, O || (s.canvas.style.width = "" + p + "px", s.canvas.style.height = "" + A + "px", s.drawFrame(!1), requestAnimationFrame(function() {
            s.canvas.style.width = P, s.canvas.style.height = k;
          }));
        }, V = document;
        if (d.onfullscreenchange = E, d.onwebkitfullscreenchange = E, V.fullscreenElement || V.webkitFullscreenElement || V.mozFullScreenElement || V.msFullscreenElement)
          V.exitFullscreen ? V.exitFullscreen() : V.mozCancelFullScreen ? V.mozCancelFullScreen() : V.webkitExitFullscreen ? V.webkitExitFullscreen() : V.msExitFullscreen && V.msExitFullscreen();
        else {
          p = s.canvas.clientWidth, A = s.canvas.clientHeight, P = s.canvas.style.width, k = s.canvas.style.height;
          var N = d;
          N.requestFullscreen ? N.requestFullscreen() : N.webkitRequestFullScreen ? N.webkitRequestFullScreen() : N.mozRequestFullScreen ? N.mozRequestFullScreen() : N.msRequestFullscreen && N.msRequestFullscreen();
        }
      }, g.onclick = function() {
        window.open("http://esotericsoftware.com");
      }, window.onresize = function() {
        s.drawFrame(!1);
      }, d;
    }, u.prototype.showSpeedDialog = function(s) {
      var o = this;
      if (this.lastPopup && this.lastPopup.dom.remove(), this.lastPopup && n(this.lastPopup.dom, "spine-player-popup-title")[0].textContent == "Speed") {
        this.lastPopup = null, s.classList.remove("spine-player-button-icon-speed-selected");
        return;
      }
      var d = new r(this.dom, this.playerControls, `
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
			`), l = n(d.dom, "spine-player-speed-slider")[0], m = new a(2, 0.1, !0);
      l.appendChild(m.render()), m.setValue(this.speed / 2), m.change = function(C) {
        o.speed = C * 2;
      }, s.classList.add("spine-player-button-icon-speed-selected"), d.show(function() {
        s.classList.remove("spine-player-button-icon-speed-selected"), d.dom.remove(), o.lastPopup = null;
      }), this.lastPopup = d;
    }, u.prototype.showAnimationsDialog = function(s) {
      var o = this;
      if (this.lastPopup && this.lastPopup.dom.remove(), this.lastPopup && n(this.lastPopup.dom, "spine-player-popup-title")[0].textContent == "Animations") {
        this.lastPopup = null, s.classList.remove("spine-player-button-icon-animations-selected");
        return;
      }
      if (!(!this.skeleton || this.skeleton.data.animations.length == 0)) {
        var d = new r(this.dom, this.playerControls, `
				<div class="spine-player-popup-title">Animations</div>
				<hr>
				<ul class="spine-player-list"></ul>
			`), l = n(d.dom, "spine-player-list")[0];
        this.skeleton.data.animations.forEach(function(m) {
          if (!(o.config.animations && o.config.animations.indexOf(m.name) < 0)) {
            var C = f(`
					<li class="spine-player-list-item selectable">
						<div class="selectable-circle">
						</div>
						<div class="selectable-text">
						</div>
					</li>
				`);
            m.name == o.config.animation && C.classList.add("selected"), n(C, "selectable-text")[0].innerText = m.name, l.appendChild(C), C.onclick = function() {
              h(l.children, "selected"), C.classList.add("selected"), o.config.animation = m.name, o.playTime = 0, o.setAnimation(m.name);
            };
          }
        }), s.classList.add("spine-player-button-icon-animations-selected"), d.show(function() {
          s.classList.remove("spine-player-button-icon-animations-selected"), d.dom.remove(), o.lastPopup = null;
        }), this.lastPopup = d;
      }
    }, u.prototype.showSkinsDialog = function(s) {
      var o = this;
      if (this.lastPopup && this.lastPopup.dom.remove(), this.lastPopup && n(this.lastPopup.dom, "spine-player-popup-title")[0].textContent == "Skins") {
        this.lastPopup = null, s.classList.remove("spine-player-button-icon-skins-selected");
        return;
      }
      if (!(!this.skeleton || this.skeleton.data.animations.length == 0)) {
        var d = new r(this.dom, this.playerControls, `
				<div class="spine-player-popup-title">Skins</div>
				<hr>
				<ul class="spine-player-list"></ul>
			`), l = n(d.dom, "spine-player-list")[0];
        this.skeleton.data.skins.forEach(function(m) {
          if (!(o.config.skins && o.config.skins.indexOf(m.name) < 0)) {
            var C = f(`
					<li class="spine-player-list-item selectable">
						<div class="selectable-circle">
						</div>
						<div class="selectable-text">
						</div>
					</li>
				`);
            m.name == o.config.skin && C.classList.add("selected"), n(C, "selectable-text")[0].innerText = m.name, l.appendChild(C), C.onclick = function() {
              h(l.children, "selected"), C.classList.add("selected"), o.config.skin = m.name, o.skeleton.setSkinByName(o.config.skin), o.skeleton.setSlotsToSetupPose();
            };
          }
        }), s.classList.add("spine-player-button-icon-skins-selected"), d.show(function() {
          s.classList.remove("spine-player-button-icon-skins-selected"), d.dom.remove(), o.lastPopup = null;
        }), this.lastPopup = d;
      }
    }, u.prototype.showSettingsDialog = function(s) {
      var o = this;
      if (this.lastPopup && this.lastPopup.dom.remove(), this.lastPopup && n(this.lastPopup.dom, "spine-player-popup-title")[0].textContent == "Debug") {
        this.lastPopup = null, s.classList.remove("spine-player-button-icon-settings-selected");
        return;
      }
      if (!(!this.skeleton || this.skeleton.data.animations.length == 0)) {
        var d = new r(this.dom, this.playerControls, `
				<div class="spine-player-popup-title">Debug</div>
				<hr>
				<ul class="spine-player-list">
				</li>
			`), l = n(d.dom, "spine-player-list")[0], m = function(C, S) {
          var D = f('<li class="spine-player-list-item"></li>'), T = new M(C);
          D.appendChild(T.render()), T.setEnabled(o.config.debug[S]), T.change = function(x) {
            o.config.debug[S] = x;
          }, l.appendChild(D);
        };
        m("Bones", "bones"), m("Regions", "regions"), m("Meshes", "meshes"), m("Bounds", "bounds"), m("Paths", "paths"), m("Clipping", "clipping"), m("Points", "points"), m("Hulls", "hulls"), s.classList.add("spine-player-button-icon-settings-selected"), d.show(function() {
          s.classList.remove("spine-player-button-icon-settings-selected"), d.dom.remove(), o.lastPopup = null;
        }), this.lastPopup = d;
      }
    }, u.prototype.drawFrame = function(s) {
      var o = this;
      if (!o.disposed) {
        s === void 0 && (s = !0), s && !this.stopRequestAnimationFrame && requestAnimationFrame(function() {
          return o.drawFrame();
        });
        var d = this.context, l = d.gl, m = document, C = m.fullscreenElement || m.webkitFullscreenElement || m.mozFullScreenElement || m.msFullscreenElement, S = new c.Color().setFromString(C ? this.config.fullScreenBackgroundColor : this.config.backgroundColor);
        if (l.clearColor(S.r, S.g, S.b, S.a), l.clear(l.COLOR_BUFFER_BIT), this.loadingScreen.backgroundColor.setFromColor(S), this.loadingScreen.draw(this.assetManager.isLoadingComplete()), this.assetManager.isLoadingComplete() && this.skeleton == null && this.loadSkeleton(), this.sceneRenderer.resize(c.webgl.ResizeMode.Expand), this.loaded) {
          if (!this.paused && this.config.animation) {
            this.time.update();
            var D = this.time.delta * this.speed, T = this.animationState.getCurrent(0).animation.duration;
            for (this.playTime += D; this.playTime >= T && T != 0; )
              this.playTime -= T;
            this.playTime = Math.max(0, Math.min(this.playTime, T)), this.timelineSlider.setValue(this.playTime / T), this.animationState.update(D), this.animationState.apply(this.skeleton);
          }
          this.skeleton.updateWorldTransform();
          var x = {
            x: this.currentViewport.x - this.currentViewport.padLeft,
            y: this.currentViewport.y - this.currentViewport.padBottom,
            width: this.currentViewport.width + this.currentViewport.padLeft + this.currentViewport.padRight,
            height: this.currentViewport.height + this.currentViewport.padBottom + this.currentViewport.padTop
          }, g = (performance.now() - this.viewportTransitionStart) / 1e3 / this.config.viewport.transitionTime;
          if (this.previousViewport && g < 1) {
            var p = {
              x: this.previousViewport.x - this.previousViewport.padLeft,
              y: this.previousViewport.y - this.previousViewport.padBottom,
              width: this.previousViewport.width + this.previousViewport.padLeft + this.previousViewport.padRight,
              height: this.previousViewport.height + this.previousViewport.padBottom + this.previousViewport.padTop
            };
            x = {
              x: p.x + (x.x - p.x) * g,
              y: p.y + (x.y - p.y) * g,
              width: p.width + (x.width - p.width) * g,
              height: p.height + (x.height - p.height) * g
            };
          }
          var A = this.scale(x.width, x.height, this.canvas.width, this.canvas.height);
          if (this.sceneRenderer.camera.zoom = x.width / A.x, this.sceneRenderer.camera.position.x = x.x + x.width / 2, this.sceneRenderer.camera.position.y = x.y + x.height / 2, this.sceneRenderer.begin(), this.config.backgroundImage && this.config.backgroundImage.url) {
            var P = this.assetManager.get(this.config.backgroundImage.url);
            this.config.backgroundImage.hasOwnProperty("x") && this.config.backgroundImage.hasOwnProperty("y") && this.config.backgroundImage.hasOwnProperty("width") && this.config.backgroundImage.hasOwnProperty("height") ? this.sceneRenderer.drawTexture(P, this.config.backgroundImage.x, this.config.backgroundImage.y, this.config.backgroundImage.width, this.config.backgroundImage.height) : this.sceneRenderer.drawTexture(P, x.x, x.y, x.width, x.height);
          }
          this.sceneRenderer.drawSkeleton(this.skeleton, this.config.premultipliedAlpha), this.sceneRenderer.skeletonDebugRenderer.drawBones = this.config.debug.bones, this.sceneRenderer.skeletonDebugRenderer.drawBoundingBoxes = this.config.debug.bounds, this.sceneRenderer.skeletonDebugRenderer.drawClipping = this.config.debug.clipping, this.sceneRenderer.skeletonDebugRenderer.drawMeshHull = this.config.debug.hulls, this.sceneRenderer.skeletonDebugRenderer.drawPaths = this.config.debug.paths, this.sceneRenderer.skeletonDebugRenderer.drawRegionAttachments = this.config.debug.regions, this.sceneRenderer.skeletonDebugRenderer.drawMeshTriangles = this.config.debug.meshes, this.sceneRenderer.drawSkeletonDebug(this.skeleton, this.config.premultipliedAlpha);
          var k = this.config.controlBones, O = this.selectedBones, E = this.skeleton;
          l.lineWidth(2);
          for (var V = 0; V < k.length; V++) {
            var N = E.findBone(k[V]);
            if (N) {
              var I = O[V] !== null ? u.HOVER_COLOR_INNER : u.NON_HOVER_COLOR_INNER, y = O[V] !== null ? u.HOVER_COLOR_OUTER : u.NON_HOVER_COLOR_OUTER;
              this.sceneRenderer.circle(!0, E.x + N.worldX, E.y + N.worldY, 20, I), this.sceneRenderer.circle(!1, E.x + N.worldX, E.y + N.worldY, 20, y);
            }
          }
          l.lineWidth(1), this.config.viewport.debugRender && (this.sceneRenderer.rect(!1, this.currentViewport.x, this.currentViewport.y, this.currentViewport.width, this.currentViewport.height, c.Color.GREEN), this.sceneRenderer.rect(!1, x.x, x.y, x.width, x.height, c.Color.RED)), this.sceneRenderer.end(), this.sceneRenderer.camera.zoom = 0;
        }
      }
    }, u.prototype.scale = function(s, o, d, l) {
      var m = l / d, C = o / s, S = m > C ? d / s : l / o, D = new c.Vector2();
      return D.x = s * S, D.y = o * S, D;
    }, u.prototype.loadSkeleton = function() {
      var s = this;
      if (!this.loaded) {
        if (this.assetManager.hasErrors()) {
          this.showError("Error: assets could not be loaded.<br><br>" + v(JSON.stringify(this.assetManager.getErrors())));
          return;
        }
        var o = this.assetManager.get(this.config.atlasUrl), d;
        if (this.config.jsonUrl) {
          var l = this.assetManager.get(this.config.jsonUrl), m = new c.SkeletonJson(new c.AtlasAttachmentLoader(o));
          try {
            d = m.readSkeletonData(l);
          } catch (T) {
            this.showError("Error: could not load skeleton .json.<br><br>" + T.toString());
            return;
          }
        } else {
          var C = this.assetManager.get(this.config.skelUrl), S = new c.SkeletonBinary(new c.AtlasAttachmentLoader(o));
          try {
            d = S.readSkeletonData(C);
          } catch (T) {
            this.showError("Error: could not load skeleton .skel.<br><br>" + T.toString());
            return;
          }
        }
        this.skeleton = new c.Skeleton(d);
        var D = new c.AnimationStateData(d);
        if (D.defaultMix = this.config.defaultMix, this.animationState = new c.AnimationState(D), this.config.controlBones && this.config.controlBones.forEach(function(T) {
          d.findBone(T) || s.showError("Error: control bone '" + T + "' does not exist in skeleton.");
        }), this.config.skin || d.skins.length > 0 && (this.config.skin = d.skins[0].name), this.config.skins && this.config.skin.length > 0 && this.config.skins.forEach(function(T) {
          if (!s.skeleton.data.findSkin(T)) {
            s.showError("Error: skin '" + T + "' in selectable skin list does not exist in skeleton.");
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
        }), typeof this.config.viewport.debugRender > "u" && (this.config.viewport.debugRender = !1), typeof this.config.viewport.transitionTime > "u" && (this.config.viewport.transitionTime = 0.2), this.config.viewport.animations ? Object.getOwnPropertyNames(this.config.viewport.animations).forEach(function(T) {
          if (!d.findAnimation(T)) {
            s.showError("Error: animation '" + T + "' for which a viewport was specified does not exist in skeleton.");
            return;
          }
        }) : this.config.viewport.animations = {}, this.config.animations && this.config.animations.length > 0 && (this.config.animations.forEach(function(T) {
          if (!s.skeleton.data.findAnimation(T)) {
            s.showError("Error: animation '" + T + "' in selectable animation list does not exist in skeleton.");
            return;
          }
        }), this.config.animation || (this.config.animation = this.config.animations[0])), this.config.animation || d.animations.length > 0 && (this.config.animation = d.animations[0].name), this.config.animation) {
          if (!d.findAnimation(this.config.animation)) {
            this.showError("Error: animation '" + this.config.animation + "' does not exist in skeleton.");
            return;
          }
          this.play(), this.timelineSlider.change = function(T) {
            s.pause();
            var x = s.animationState.getCurrent(0).animation.duration, g = x * T;
            s.animationState.update(g - s.playTime), s.animationState.apply(s.skeleton), s.skeleton.updateWorldTransform(), s.playTime = g;
          };
        }
        this.setupInput(), (d.skins.length == 1 || this.config.skins && this.config.skins.length == 1) && this.skinButton.classList.add("spine-player-hidden"), (d.animations.length == 1 || this.config.animations && this.config.animations.length == 1) && this.animationButton.classList.add("spine-player-hidden"), this.config.success(this), this.loaded = !0;
      }
    }, u.prototype.setupInput = function() {
      var s = this, o = this.config.controlBones, d = this.selectedBones = new Array(this.config.controlBones.length), l = this.canvas, m = new c.webgl.Input(l), C = null, S = new c.webgl.Vector3(), D = new c.webgl.Vector3(), T = new c.Vector2(), x = this.skeleton, g = this.sceneRenderer;
      m.addListener({
        down: function(O, E) {
          for (var V = 0; V < o.length; V++) {
            var N = x.findBone(o[V]);
            N && (g.camera.screenToWorld(S.set(O, E, 0), l.width, l.height), D.set(x.x + N.worldX, x.y + N.worldY, 0).distance(S) < 30 && (C = N));
          }
        },
        up: function(O, E) {
          if (C)
            C = null;
          else {
            if (!s.config.showControls)
              return;
            s.paused ? s.play() : s.pause();
          }
        },
        dragged: function(O, E) {
          C != null && (g.camera.screenToWorld(S.set(O, E, 0), l.width, l.height), C.parent !== null ? (C.parent.worldToLocal(T.set(S.x - x.x, S.y - x.y)), C.x = T.x, C.y = T.y) : (C.x = S.x - x.x, C.y = S.y - x.y));
        },
        moved: function(O, E) {
          for (var V = 0; V < o.length; V++) {
            var N = x.findBone(o[V]);
            N && (g.camera.screenToWorld(S.set(O, E, 0), l.width, l.height), D.set(x.x + N.worldX, x.y + N.worldY, 0).distance(S) < 30 ? d[V] = N : d[V] = null);
          }
        }
      });
      var p = !0, A = !1;
      document.addEventListener("mousemove", function(O) {
        O instanceof MouseEvent && P(O.clientX, O.clientY);
      }), document.addEventListener("touchmove", function(O) {
        if (O instanceof TouchEvent) {
          var E = O.changedTouches;
          if (E.length > 0) {
            var V = E[0];
            P(V.clientX, V.clientY);
          }
        }
      });
      var P = function(O, E) {
        if (s.config.showControls) {
          var V = n(s.dom, "spine-player-popup");
          p = k(O, E, s.playerControls.getBoundingClientRect()), A = k(O, E, s.canvas.getBoundingClientRect()), clearTimeout(s.cancelId);
          var N = V.length == 0 && !p && !A && !s.paused;
          if (N ? s.playerControls.classList.add("spine-player-controls-hidden") : s.playerControls.classList.remove("spine-player-controls-hidden"), !p && V.length == 0 && !s.paused) {
            var I = function() {
              s.paused || s.playerControls.classList.add("spine-player-controls-hidden");
            };
            s.cancelId = setTimeout(I, 1e3);
          }
        }
      }, k = function(O, E, V) {
        var N = O - V.left, I = E - V.top;
        return N >= 0 && N <= V.width && I >= 0 && I <= V.height;
      };
    }, u.prototype.play = function() {
      var s = this;
      this.paused = !1;
      var o = function() {
        s.paused || s.playerControls.classList.add("spine-player-controls-hidden");
      };
      this.cancelId = setTimeout(o, 1e3), this.playButton.classList.remove("spine-player-button-icon-play"), this.playButton.classList.add("spine-player-button-icon-pause"), this.config.animation && (this.animationState.getCurrent(0) || this.setAnimation(this.config.animation));
    }, u.prototype.pause = function() {
      this.paused = !0, this.playerControls.classList.remove("spine-player-controls-hidden"), clearTimeout(this.cancelId), this.playButton.classList.remove("spine-player-button-icon-pause"), this.playButton.classList.add("spine-player-button-icon-play");
    }, u.prototype.setAnimation = function(s, o) {
      o === void 0 && (o = !0), this.previousViewport = this.currentViewport;
      var d = this.calculateAnimationViewport(s), l = {
        x: d.x,
        y: d.y,
        width: d.width,
        height: d.height,
        padLeft: "10%",
        padRight: "10%",
        padTop: "10%",
        padBottom: "10%"
      }, m = this.config.viewport;
      typeof m.x < "u" && typeof m.y < "u" && typeof m.width < "u" && typeof m.height < "u" && (l.x = m.x, l.y = m.y, l.width = m.width, l.height = m.height), typeof m.padLeft < "u" && (l.padLeft = m.padLeft), typeof m.padRight < "u" && (l.padRight = m.padRight), typeof m.padTop < "u" && (l.padTop = m.padTop), typeof m.padBottom < "u" && (l.padBottom = m.padBottom);
      var C = this.config.viewport.animations[s];
      C && (typeof C.x < "u" && typeof C.y < "u" && typeof C.width < "u" && typeof C.height < "u" && (l.x = C.x, l.y = C.y, l.width = C.width, l.height = C.height), typeof C.padLeft < "u" && (l.padLeft = C.padLeft), typeof C.padRight < "u" && (l.padRight = C.padRight), typeof C.padTop < "u" && (l.padTop = C.padTop), typeof C.padBottom < "u" && (l.padBottom = C.padBottom)), l.padLeft = this.percentageToWorldUnit(l.width, l.padLeft), l.padRight = this.percentageToWorldUnit(l.width, l.padRight), l.padBottom = this.percentageToWorldUnit(l.height, l.padBottom), l.padTop = this.percentageToWorldUnit(l.height, l.padTop), this.currentViewport = l, this.viewportTransitionStart = performance.now(), this.animationState.clearTracks(), this.skeleton.setToSetupPose(), this.animationState.setAnimation(0, s, o);
    }, u.prototype.percentageToWorldUnit = function(s, o) {
      return typeof o == "string" ? s * parseFloat(o.substr(0, o.length - 1)) / 100 : o;
    }, u.prototype.calculateAnimationViewport = function(s) {
      var o = this.skeleton.data.findAnimation(s);
      this.animationState.clearTracks(), this.skeleton.setToSetupPose(), this.animationState.setAnimationWith(0, o, !0);
      for (var d = 100, l = o.duration > 0 ? o.duration / d : 0, m = 1e8, C = -1e8, S = 1e8, D = -1e8, T = new c.Vector2(), x = new c.Vector2(), g = 0; g < d; g++)
        this.animationState.update(l), this.animationState.apply(this.skeleton), this.skeleton.updateWorldTransform(), this.skeleton.getBounds(T, x), !isNaN(T.x) && !isNaN(T.y) && !isNaN(x.x) && !isNaN(x.y) ? (m = Math.min(T.x, m), C = Math.max(T.x + x.x, C), S = Math.min(T.y, S), D = Math.max(T.y + x.y, D)) : console.log("Bounds of animation " + s + " are NaN");
      return T.x = m, T.y = S, x.x = C - m, x.y = D - S, {
        x: T.x,
        y: T.y,
        width: x.x,
        height: x.y
      };
    }, u.prototype.stopRendering = function() {
      this.stopRequestAnimationFrame = !0;
    }, u.HOVER_COLOR_INNER = new c.Color(0.478, 0, 0, 0.25), u.HOVER_COLOR_OUTER = new c.Color(1, 1, 1, 1), u.NON_HOVER_COLOR_INNER = new c.Color(0.478, 0, 0, 0.5), u.NON_HOVER_COLOR_OUTER = new c.Color(1, 0, 0, 0.8), u;
  })();
  c.SpinePlayer = t;
  function i(u, s) {
    if (u === s)
      return !0;
    var o = function(d, l) {
      for (var m = 0; m < d.children.length; m++) {
        var C = d.children[m];
        if (C === l || o(C, l))
          return !0;
      }
      return !1;
    };
    return o(u, s);
  }
  function e(u, s) {
    var o = new Array(), d = function(l, m, C) {
      for (var S = 0; S < l.children.length; S++) {
        var D = l.children[S];
        D.id === m && C.push(D), d(D, m, C);
      }
    };
    return d(u, s, o), o;
  }
  function n(u, s) {
    var o = new Array(), d = function(l, m, C) {
      for (var S = 0; S < l.children.length; S++) {
        var D = l.children[S];
        D.classList.contains(m) && C.push(D), d(D, m, C);
      }
    };
    return d(u, s, o), o;
  }
  function f(u) {
    var s = document.createElement("div");
    return s.innerHTML = u, s.children[0];
  }
  function h(u, s) {
    for (var o = 0; o < u.length; o++)
      u[o].classList.remove(s);
  }
  function v(u) {
    return u ? u.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&#34;").replace(/'/g, "&#39;") : "";
  }
})(F || (F = {}));
var F;
(function(c) {
  var r = (function() {
    function M(a) {
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
    return M.prototype.render = function(a) {
      var t = this, i = `
				<div class="spine-player-editor-container">
					<div class="spine-player-editor-code"></div>
					<iframe class="spine-player-editor-player"></iframe>
				</div>
			`;
      a.innerHTML = i;
      var e = a.getElementsByClassName("spine-player-editor-code")[0];
      this.player = a.getElementsByClassName("spine-player-editor-player")[0], requestAnimationFrame(function() {
        t.code = CodeMirror(e, {
          lineNumbers: !0,
          tabSize: 3,
          indentUnit: 3,
          indentWithTabs: !0,
          scrollBarStyle: "native",
          mode: "htmlmixed",
          theme: "monokai"
        }), t.code.on("change", function() {
          t.startPlayer();
        }), t.setCode(M.DEFAULT_CODE);
      });
    }, M.prototype.setPreAndPostfix = function(a, t) {
      this.prefix = a, this.postfix = t, this.startPlayer();
    }, M.prototype.setCode = function(a) {
      this.code.setValue(a), this.startPlayer();
    }, M.prototype.startPlayer = function() {
      var a = this;
      clearTimeout(this.timerId), this.timerId = setTimeout(function() {
        var t = a.code.getDoc().getValue();
        t = a.prefix + t + a.postfix, t = window.btoa(t), a.player.src = "", a.player.src = "data:text/html;base64," + t;
      }, 500);
    }, M.DEFAULT_CODE = `
<script src="https://esotericsoftware.com/files/spine-player/3.7/spine-player.js"><\/script>
<link rel="stylesheet" href="https://esotericsoftware.com/files/spine-player/3.7/spine-player.css">

<div id="player-container" style="width: 100%; height: 100vh;"></div>

<script>
new spine.SpinePlayer("player-container", {
	jsonUrl: "https://esotericsoftware.com/files/examples/spineboy/export/spineboy-pro.json",
	atlasUrl: "https://esotericsoftware.com/files/examples/spineboy/export/spineboy-pma.atlas"
});
<\/script>
		`.trim(), M;
  })();
  c.SpinePlayerEditor = r;
})(F || (F = {}));
const Tt = F, Vt = "__whichWayUnpackPremultiply";
function Jt() {
  const c = Tt?.webgl?.GLTexture;
  if (!c || !c.prototype || c.prototype.update.__whichWayUnpackPatched) return;
  const r = c.prototype.update;
  c.prototype.update = function(M) {
    const a = this.context && this.context.gl;
    let t = !1;
    const i = this._image;
    a && a.UNPACK_PREMULTIPLY_ALPHA_WEBGL != null && i && i[Vt] && (a.pixelStorei(a.UNPACK_PREMULTIPLY_ALPHA_WEBGL, !0), t = !0);
    try {
      return r.call(this, M);
    } finally {
      t && a && a.UNPACK_PREMULTIPLY_ALPHA_WEBGL != null && a.pixelStorei(a.UNPACK_PREMULTIPLY_ALPHA_WEBGL, !1);
    }
  }, c.prototype.update.__whichWayUnpackPatched = !0;
}
Jt();
function Nt(c) {
  if (!c || !c.assetManager) return;
  const r = !!c.config?.unpackPremultipliedAlpha, M = c.assetManager, a = M.textureLoader;
  typeof a == "function" && (a.__whichWayUnpackWrapped || (M.textureLoader = function(t) {
    try {
      t && (r ? t[Vt] = !0 : delete t[Vt]);
    } catch {
    }
    return a(t);
  }, M.textureLoader.__whichWayUnpackWrapped = !0));
}
const ot = window.whichWaySave.dycSave;
class qt {
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
  toggleDycSkin(r, M) {
    if (mt.itemtype(r) === "player" && (r = r.name), typeof r != "string") throw new Error("参数name必须是 String 或 Player！");
    if (typeof M != "string") throw new Error("参数skinName必须是 String！");
    return K.banSkin?.[r]?.[M] ? K.banSkin[r][M] = !1 : (K.banSkin[r] || (K.banSkin[r] = {}), K.banSkin[r][M] = !0), Lt.saveConfig("banSkinSJZX", K.banSkin), K.banSkin;
  }
  /**
   * 判断指定角色和皮肤的动态皮肤是否启用
   * @param {String | Player} name 玩家名
   * @param {String} skinName 皮肤名
   * @returns {boolean}
   */
  isEnabledSkin(r, M) {
    return mt.itemtype(r) === "player" && (r = r.name), !this.banSkin?.[r]?.[M];
  }
  /**
   * 获取指定角色和皮肤的动态皮肤数据
   * @param {string} charName - 角色名称
   * @param {string} skinName - 皮肤名称
   * @param {boolean} [noGetAll=false] - 当charName或skinName未定义时，是否返回所有资产数据
   * @returns {Object|undefined} 找到的皮肤数据对象，未找到时返回undefined
   */
  getSkinData(r, M, a) {
    let t = ot.assets;
    if (r === void 0 || M === void 0) return a ? t : void 0;
    for (let i in t)
      if (r === i) {
        for (let e in t[i])
          if (e === M)
            return t[i][e];
      }
    et.isDeveloperMode() && console.warn(`【驶舰之向】:未找到角色 ${r} 的皮肤 ${M} !`);
  }
  getUrl(r, M, a, t) {
    const i = {
      j: "json",
      a: "atlas",
      s: "skel"
    };
    return t.length === 1 && i[t] && (t = i[t]), `${$.assetURL}extension/WhichWay/dynamicSkin/illust/${r}/${M}/${a}.${t}`;
  }
  dispose(r) {
    if (r.disposed) return;
    r.disposed = !0;
    let M = this.spineCache, a = M.get(r.config.dynamicName);
    if (Object.keys(a).length === 1) M.delete(r.config.dynamicName);
    else
      for (let i in a)
        a[i].from === r.container && delete a[i];
    window.removeEventListener("resize", r.drawFrame);
    const t = r.parent;
    if (r.stopRendering(), r.cancelId && clearTimeout(r.cancelId), r.animationState) {
      r.animationState.clearTracks(), r.animationState.clearListeners();
      let i = r.animationState.getCurrent(0);
      i && (r.animationState.disposeNext(i), r.animationState.setEmptyAnimation(0, 0)), r.animationState = null;
    }
    r.skeleton && (r.skeleton = null), r.skeletonData && (r.skeletonData = null), r.sceneRenderer && (r.sceneRenderer.dispose(), r.sceneRenderer = null), r.assetManager && r.assetManager.dispose(), r.context && r.context.gl && (r.context.gl.getExtension("WEBGL_lose_context")?.loseContext(), r.context = null), t && t.remove();
  }
  loadDyc(r, M, a, t) {
    let i = ot.assets, e = `${r}_${M}`;
    if (this.banSkin?.[r]?.[M] === !0) return;
    ot.startFit = {
      dycLoaded: !1,
      decadeUIFit: !1,
      parent: a,
      container: void 0
    };
    let n = new Proxy(ot.startFit, {
      set(h, v, u, s) {
        return h[v] = u, h.dycLoaded && h.decadeUIFit && (et.isDeveloperMode() && console.log("【驶舰之向】:已调整动态皮肤：", h.container), f(h.container, h.parent), delete ot.startFit), !0;
      }
    });
    if (i[r] && i[r][M]) {
      let h = i[r][M], v, u, s = this.backgroundPath + h.background.split("/").pop();
      const o = It.create.div(".sjzxDycWrapper", a);
      o.id = "sjzxDycWrapper-animation", o.hide(), ot.startFit.container = o;
      const d = It.create.div(".bg", o);
      d.style.backgroundImage = `url(${s})`, h.name && (h.json ? v = this.getUrl(r, M, h.name.split("/").pop(), "j") : v = this.getUrl(r, M, h.name.split("/").pop(), "s"), u = this.getUrl(r, M, h.name.split("/").pop(), "a")), t || (t = {
        dynamicName: e,
        skelUrl: v,
        //@ts-ignore
        jsonUrl: v.endsWith(".json") ? v : void 0,
        atlasUrl: u,
        showControls: !1,
        animations: Array.isArray(h.action) ? h.action : [h.action],
        weighting: Array.isArray(h.weighting) ? h.weighting : [h.weighting],
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
        premultipliedAlpha: h.alpha || !1,
        unpackPremultipliedAlpha: !!h.unpackPremultipliedAlpha,
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
        originalOptions: h,
        container: a,
        error: function(D) {
          console.error(D);
        },
        success: function(D) {
          K.setSkeletonPosition(D, D.config.originalOptions), K.playRandomAnimation(D.skeleton, D.animationState, D.config.weighting), n.dycLoaded = !0, o.show();
        }
      });
      const l = new Tt.SpinePlayer(o, t);
      Nt(l);
      let m = K.spineCache;
      m.get(e) || m.set(e, {});
      let C = m.get(e);
      if (mt.itemtype(a) === "player")
        C[a.playerid] || (C[a.playerid] = {}), C[a.playerid].default = l, C[a.playerid].from = a, a.dycSJZX = l;
      else {
        let D = a.className;
        C[D] || (C[D] = {}), C[D].default = l, C[D].from = a;
      }
      const S = `removeAdded_${e}`;
      return a.dataset[S] !== "true" && (a.dataset[S] = "true", a.onRemoved(() => {
        let D = mt.itemtype(a) === "player", T = C[D ? a.playerid : a.className];
        for (let x in T)
          mt.is.object(T[x]) && K.dispose(T[x]);
        delete C[D ? a.playerid : a.className];
      })), mt.itemtype(a) === "player" && (a.node.avatar.appendChild(o), a.node.avatar.style.overflow = "hidden", setTimeout(() => {
        n.decadeUIFit = !0;
      }, 1e3)), l;
    } else console.error(`no skin data ${r} ${M}`);
    function f(h, v, u = 4) {
      const s = (x) => parseFloat(x.match(/-?\d*\.?\d+/)?.[0] || "0"), o = h.style.transition;
      h.style.transition = "none";
      let d = getComputedStyle(h), l = s(d.width), m = s(d.height), C = s(d.left), S = getComputedStyle(v), D = s(S.width), T = s(S.height);
      if (l > 360) {
        h.style.transition = o;
        return;
      }
      [l, m] = et.adjustToRatio(l, m, "2:3", [D, T]), h.style.width = `${l * u}px`, h.style.height = `${m * u}px`, h.style.zoom = `${1 / u}`, typeof C == "number" && (h.style.left = `${C * u}px`), h.offsetWidth, h.style.transition = o, ot.dycZoom = `${1 / u}`;
    }
  }
  /**
   * 播放完当前动画后，随机播放另一个动画
   * @param {*} skeleton - Spine 骨骼实例
   * @param {*} animationState - AnimationState 实例
   * @param {number[]} weighting - 权重
   * @param {boolean} [loop=false] - 是否循环播放
   */
  playRandomAnimation(r, M, a, t = !1) {
    M.addListener({
      complete: () => {
        i(r, M, a, t);
      }
    }), i(r, M, a, t);
    function i(e, n, f, h = !1) {
      const v = e.data.animations.map((d) => d.name);
      (!f || f.length !== v.length) && (f = v.map(() => 1));
      let u = et.scaleToIntegerRatio(f), s = [];
      for (let d = 0; d < v.length; d++) {
        let l = u[d], m = v[d];
        s.push(...new Array(l).fill(m));
      }
      const o = s.randomGet();
      v.length === 1 ? n.setAnimation(0, o, !0) : n.setAnimation(0, o, h);
    }
  }
  setSkeletonPosition(r, M, a) {
    const t = r.dom.parentNode, i = new Tt.Vector2(), e = new Tt.Vector2();
    r.skeleton.getBounds(i, e, []);
    let n = [t.clientWidth / 120, t.clientHeight / 180];
    a && (n = [1, 1]), r.skeleton.scaleX = M.scale * n[0], r.skeleton.scaleY = M.scale * n[1], r.skeleton.x = t.clientWidth * M.x[1] + M.x[0], r.skeleton.y = t.clientHeight * M.y[1] + M.y[0];
  }
  playAction(r, M, a = 3e3) {
    let t = r.parent.parentNode, i = r.config.dynamicName, e = t.playerid, n = K.spineCache;
    n.get(i)?.[i]?.[e]?.[M]?.timer && clearTimeout(n.get(i)[e][M].timer), ["chuchang", "gongji", "teshu", "default"].includes(M) || console.warn(`${M}不是合法的动作！`);
    let h = r.config.originalOptions[M];
    h || (console.warn(`${M}没有对应的动作配置！`), ht.showToast(`${M}没有对应的动作配置！`)), r.dom.style.display = "none";
    let v = r.config, u = r.dom.parentNode;
    u.style.zIndex = 100, n.get(i) || n.set(i, {});
    const s = n.get(i);
    if (s[e] || (s[e] = {}), s[e][M])
      s[e][M].parent.style.display = "";
    else {
      let o = It.create.div(".sjzxDycOutWrapper", u);
      o.classList.add(`${M}`);
      const d = o.getBoundingClientRect();
      o.style.display = "none";
      const l = new Tt.SpinePlayer(o, {
        skelUrl: v.skelUrl,
        jsonUrl: v.jsonUrl,
        atlasUrl: v.atlasUrl,
        showControls: !1,
        animations: Array.isArray(h.action) ? h.action : [h.action],
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
        premultipliedAlpha: h.alpha || !1,
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
        originalOptions: h,
        error: function(m) {
          console.error("spine animation load error", m);
        },
        success: function(m) {
          const C = (g) => parseFloat(g.match(/-?\d*\.?\d+/)?.[0] || "0");
          let S = m.parent.parentNode.parentNode, D = m.config.originalOptions, T = getComputedStyle(document.body), x = getComputedStyle(S);
          m.skeleton.x = C(T.width) - C(x.right) - C(x.width) / 2, m.skeleton.y = C(x.bottom), m.skeleton.scaleX = D.scale, m.skeleton.scaleY = D.scale, m.speed = h.speed || 1, m.dom.parentNode.style.display = "";
        }
      });
      Nt(l), s[e][M] = l;
    }
    a && (s[e][M].timer = setTimeout(() => {
      let o = s[e][M].parent;
      r.dom.style.display = "", o.style.display = "none", u.style.zIndex = "";
    }, a));
  }
  async updateDyc(r, M, a = "default") {
    if (!K.needEnable()) return;
    let t = window.whichWaySave.skinConfig[r] || "经典形象.1145141919810", i = pt.removeExt(t), e = `${r}_${i}`, n = K.spineCache;
    if (n.forEach((f) => {
      for (let h in f) {
        let v = f[h];
        if (v.from === M)
          for (let u in v) {
            let s = v[u];
            s instanceof HTMLElement || (s.parent.style.display = "none");
          }
      }
    }), this.banSkin?.[r]?.[i] !== !0) {
      if (n.has(e)) {
        if (mt.itemtype(M) === "player" && n.get(e)?.[M.playerid]?.[a]) {
          n.get(e)[M.playerid][a].parent.style.display = "";
          return;
        } else if (n.get(e)?.[M.className]?.[a]) {
          n.get(e)[M.className][a].parent.style.display = "";
          return;
        }
      }
      K.getSkinData(r, i) && K.loadDyc(r, i, M);
    }
  }
  draggingDyc(r) {
    if (!K.needEnable()) return;
    if (!et.config("enableWhichWayDynamicSkin")) {
      ht.showToast("请先开启动态皮肤功能");
      return;
    }
    if (typeof r != "object") {
      ht.showToast("不是合法的Spine对象");
      return;
    }
    const a = ((x) => {
      if (!x) return 1;
      if (typeof x == "number") return x;
      const g = x.toString().trim().match(/^([\d.]+)%?$/);
      return g ? g[0].includes("%") ? parseFloat(g[1]) / 100 : parseFloat(g[1]) : 1;
    })($.config.ui_zoom);
    ht.showToast("已开启动皮拖拽");
    const t = document.createElement("button");
    t.id = "copySketeonPostionBtnSJZX", t.textContent = "复制信息", document.body.appendChild(t), t.addEventListener("click", () => {
      let x = [], g = ot?.skeletonPostion;
      g?.x && x.push(`x:[0,${g.x.toFixed(2)}],`), g?.y && x.push(`y:[0,${g.y.toFixed(2)}],`), g?.scale && x.push(`scale:${g.scale.toFixed(2)},`), x.length > 0 ? navigator.clipboard.writeText(x.join(`
`)).then(() => {
        ht.showToast("复制成功", 1500, "bottomRight", "skeletonPositionCopySJZX");
      }).catch((p) => {
        console.error("复制失败: ", p);
      }) : ht.showToast("没有可复制的信息!", 1500);
    });
    const i = document.createElement("button");
    i.id = "toggleDragBtnSJZX", i.textContent = "关闭拖拽", document.body.appendChild(i), i.addEventListener("click", () => {
      i.remove(), t.remove(), K.stopDraggingDyc(r);
    });
    const e = r.parent;
    e.style.pointerEvents = "all";
    const n = r.skeleton, f = r.dom;
    let h = !1, v = 0, u = 0;
    const s = 1e-3, o = 10, d = 0.01;
    let l = 0;
    const m = 200, C = (x) => {
      h = !0, v = x.clientX, u = x.clientY;
    }, S = (x) => {
      if (!h) return;
      const g = x.clientX - v, p = x.clientY - u;
      n.x += g, n.y += p, v = x.clientX, u = x.clientY;
      const A = Date.now(), P = e.clientWidth, k = e.clientHeight;
      console.log(P, k);
      const O = n.x / P, E = n.y / k;
      if (A - l > m) {
        const V = `骨骼位置: x=${n.x.toFixed(2)} (${O.toFixed(2)}), y=${n.y.toFixed(2)} (${E.toFixed(2)})`;
        ht.showToast(V, !0, "topLeft", "dragging_xAndy"), l = A;
        let N = ot.dycZoom || 1;
        ot.skeletonPostion || (ot.skeletonPostion = {}), ot.skeletonPostion.x = O / N / a, ot.skeletonPostion.y = E / N / a;
      }
    }, D = () => {
      h = !1;
    }, T = (x) => {
      x.preventDefault();
      const g = x.deltaY;
      let p = n.scaleX;
      g < 0 ? p += d : p -= d, p = Math.max(s, Math.min(o, p)), n.scaleX = n.scaleY = p, ht.showToast(`当前骨骼缩放: scale=${p.toFixed(2)}`, !0, "topLeft", "dragging_scale"), ot.skeletonPostion || (ot.skeletonPostion = {}), ot.skeletonPostion.scale = p / a;
    };
    K.eventListenersMap.set(f, { onMouseDown: C, onMouseMove: S, onMouseUp: D, onWheel: T }), f.addEventListener("mousedown", C), document.addEventListener("mousemove", S), document.addEventListener("mouseup", D), f.addEventListener("wheel", T, { passive: !1 });
  }
  stopDraggingDyc(r) {
    let M = r.parent;
    M.style.pointerEvents = "none";
    const a = r.dom, t = K.eventListenersMap.get(a);
    if (t) {
      const { onMouseDown: e, onMouseMove: n, onMouseUp: f, onWheel: h } = t;
      a.removeEventListener("mousedown", e), document.removeEventListener("mousemove", n), document.removeEventListener("mouseup", f), a.removeEventListener("wheel", h);
    }
    K.eventListenersMap.delete(a);
    let i = ht.toastRegistry;
    for (let e in i) {
      let n = i[e];
      if (typeof n != "function")
        for (let f of n) {
          let h = f.id;
          h.startsWith("dragging_") && ht.removeToastById(h);
        }
    }
  }
  /**
   * 判断是否需要启用驶舰之向的动皮
   * @returns {Boolean}
   */
  needEnable() {
    switch (et.config("WhichWayDynamicSkinSwitch") || "sjzx") {
      case "sjzx":
        return et.config("enableWhichWayDynamicSkin") || et.config("enableWhichWayDynamicSkin") === void 0;
      case "piqie": {
        let M = [];
        return $.extensionPack.皮肤切换 || M.push("皮肤切换"), $.extensionPack.千幻聆音 || M.push("千幻聆音"), $.extensionPack.十周年UI || M.push("十周年UI"), M.length === 0;
      }
    }
    return !1;
  }
}
const K = new qt();
Bt({
  name: "whichWaySpineWorker_dev",
  fn() {
    window.spineWorker = K;
  }
});
window.whichWay.register("spineWorker", K);
const Qt = { class: "conf-override" }, bt = { class: "config-container" }, Kt = { class: "title-container" }, $t = ["src"], te = { class: "confilct-card-container" }, ee = { class: "card-title" }, re = { class: "card-content" }, ie = ["onClick"], ne = { class: "skin-container" }, ae = ["src"], se = { class: "intro-container" }, oe = { class: "skin-item" }, he = { class: "from-item" }, le = /* @__PURE__ */ Yt({
  __name: "confOverride",
  setup(c) {
    const r = pt.compilePath("ui:skin.png"), M = dt.confictedSkins.data, a = Wt({});
    function t() {
      Object.keys(M).forEach((s) => {
        M[s].length > 0 && (a[s] = dt.confictedSkins.selected[s] || M[s][0].skin);
      });
    }
    function i(s, o) {
      return a[s] === o;
    }
    function e(s, o) {
      a[s] = o, console.log(`已选择 ${s} 的皮肤: ${o}`);
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
    const h = {
      noname: "无名杀",
      whichWay: "驶舰之向",
      qhly: "千幻聆音"
    };
    function v(s) {
      return h[s] ? h[s] : $.translate[s] ? $.translate[s] : s;
    }
    const u = {
      mounted(s) {
        const o = (d) => {
          d.preventDefault(), s.scrollLeft += d.deltaY;
        };
        s.addEventListener("wheel", o, { passive: !1 }), s._handleWheel = o;
      },
      unmounted(s) {
        const o = s._handleWheel;
        o && (s.removeEventListener("wheel", o), s._handleWheel = null);
      }
    };
    return (s, o) => (xt(), Et("div", Qt, [
      ft("div", bt, [
        ft("div", Kt, [
          ft("img", { src: kt(r) }, null, 8, $t),
          o[0] || (o[0] = ft("div", { class: "title" }, "皮肤配置冲突", -1))
        ]),
        ft("div", te, [
          (xt(!0), Et(wt, null, Ot(kt(M), (d, l) => (xt(), Et("div", {
            key: l,
            class: "confilct-card"
          }, [
            ft("div", ee, Dt(v(l)), 1),
            Xt((xt(), Et("div", re, [
              (xt(!0), Et(wt, null, Ot(d, (m, C) => (xt(), Et("div", {
                key: `${l}-${C}`,
                class: Gt(["item-content", { selected: i(l, m.skin) }]),
                onClick: (S) => e(l, m.skin)
              }, [
                ft("div", ne, [
                  ft("img", {
                    src: kt(dt).getCharacterSkin(l, m.skin)?.path
                  }, null, 8, ae)
                ]),
                ft("div", se, [
                  ft("span", oe, Dt(kt(pt).removeExt(m.skin)), 1),
                  ft("span", he, Dt(v(m.from)), 1)
                ])
              ], 10, ie))), 128))
            ])), [
              [u]
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
}), ue = /* @__PURE__ */ Ht(le, [["__scopeId", "data-v-d878dd96"]]), ce = {
  has(c, r, M) {
    if ([c, r, M].includes(void 0)) throw new Error("参数不能为undefined");
    return Array.isArray(this.data[c]) ? this.data[c].some((a) => a.from === M && a.skin === r) : !1;
  },
  add(c, r, M) {
    if ([c, r, M].includes(void 0)) throw new Error("参数不能为undefined");
    this.has(c, r, M) || (Array.isArray(this.data[c]) || (this.data[c] = []), this.data[c].push({ skin: r, from: M }));
  },
  get(c) {
    if (c === void 0) throw new Error("参数不能为undefined");
    return this.data[c];
  },
  get size() {
    return Object.keys(this.data).length;
  },
  data: {},
  get selected() {
    return et.config("whichWay_ConfictedSkin_selectedSkins") || {};
  },
  set selected(c) {
    et.saveConfig("whichWay_ConfictedSkin_selectedSkins", c);
  }
}, fe = Object.create(ce);
class de {
  /**
   * 皮肤组件初始化
   */
  async init() {
    await et.measureExecutionTime(async () => {
      await this.autoUpdateSkinData(), this.syncAllSkinConfig();
    }).then(({ duration: r }) => {
      et.isDeveloperMode() && console.log(`[whichWaySkin] init skin time ${r}ms`);
    }), jt({
      name: "whichWaySkinInitSkinData_init",
      fn: async () => {
        for (const r of window.whichWaySave.allCharacters)
          this.skinData[r] ??= {
            name: r,
            skins: {}
          }, this.skinData[r].skins = {
            经典形象: {
              name: "经典形象.jpg",
              path: pt.compilePath(`img:character/${r}.jpg`)
            },
            ...this.skinData[r].skins
          };
      }
    }), _t({
      name: "whichWaySkinAddInitDyc",
      fn() {
        if (!K.needEnable()) return;
        let r = et.config("WhichWayDynamicSkinSwitch");
        if (r === "sjzx")
          Ft.appendHook("lib.element.player.init", {
            before(M, a) {
              this.dycSJZX && K.dispose(this.dycSJZX), (function() {
                let t = $.config.mode;
                return t === "single" ? mt.config("double_character", t) !== "single" : mt.config("double_character", t);
              })() ? ht.showToast("【驶舰之向】:双将时无法使用动皮！", 5e3, "bottomCenter", "sjzx_doubleCharacterWarn") : K.updateDyc(M, this);
            }
          }), Ft.appendHook("lib.element.player.reinit", {
            before(M, a) {
              this.dycSJZX && K.dispose(this.dycSJZX), (function() {
                let t = $.config.mode;
                return t === "single" ? mt.config("double_character", t) !== "single" : mt.config("double_character", t);
              })() ? ht.showToast("【驶舰之向】:双将时无法使用动皮！", 5e3, "bottomCenter", "sjzx_doubleCharacterWarn") : K.updateDyc(M, this);
            }
          });
        else if (r === "piqie") {
          let M = { ...$.config.sjzxDycAssets };
          for (let a in M) {
            let t = M[a];
            for (let i in t) {
              let e = t[i];
              Array.isArray(e.action) && (e.action = e.action[0]);
            }
          }
          decadeUI.dynamicSkin || (decadeUI.dynamicSkin = {}), Object.assign(decadeUI.dynamicSkin, M), skinSwitch.saveSkinParams || (skinSwitch.saveSkinParams = {}), Object.assign(skinSwitch.saveSkinParams, M);
        }
      }
    }), zt({
      name: "whichWayInitDycDragging",
      fn() {
        K.needEnable() && et.isDeveloperMode() && It.create.system(
          "动皮拖拽",
          () => {
            K.draggingDyc(Lt.me.dycSJZX);
          },
          !0
        );
      }
    }), Pt({
      name: "whichWaySkinUpdateSkinData_add",
      priority: 899,
      obj: {
        name: "updateSkinData",
        options: {
          name: "<button type=`button`>更新皮肤数据</button>",
          clear: !0,
          async onclick() {
            if (window.whichWaySave.updatingSkinData) {
              ht.showToast("[驶舰之向] 正在更新皮肤数据，请勿重复操作...", 3e3, "topLeft", "configTips_updateSkinData_updatingSkinData");
              return;
            }
            window.whichWaySave.updatingSkinData = !0, ht.showToast("[驶舰之向] 正在更新皮肤数据...", !0, "topLeft", "configTips_updateSkinData"), await dt.autoUpdateSkinData(!0).then(() => {
              window.whichWaySave.updatingSkinData = !1, ht.removeToastById("configTips_updateSkinData_updatingSkinData"), ht.showToast("[驶舰之向] 皮肤数据更新完成!", 3e3, "topLeft", "configTips_updateSkinData");
            });
          }
        }
      }
    }), Pt({
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
    }), Pt({
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
    }), Pt({
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
    }), await import("./skin-dynamicConfig-fj2CEccD.js");
  }
  /**
   * 初始化皮肤数据（只会读取本扩展的）
   */
  async initSkinData() {
    const { folders: r } = await pt.getFileTree("skin:");
    for (const M of r)
      if (this.skinData[M.name] = {
        name: M.name,
        skins: {}
      }, M.files.length > 0)
        for (const a of M.files)
          this.skinData[M.name].skins[a.name.replace(".jpg", "").replace(".png", "")] = {
            name: a.name,
            path: a.path
          };
  }
  /**
   * 保存皮肤数据
   */
  async saveSkinData() {
    await pt.writeFileAsJson(
      {
        version: Ut.ext,
        data: this.skinData
      },
      "json:cache/",
      "skin.json"
    );
  }
  /**
   * 自动更新皮肤数据
   * @param forced 是否强制更新
   */
  async autoUpdateSkinData(r = !1) {
    if (await pt.exsitFile("json:cache/skin.json", "file") && r === !1) {
      const { version: M, data: a } = await pt.readFile("json:cache/skin.json");
      if (M === Ut.ext) {
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
  getCharacterSkin(r, M) {
    if (this.skinData[r]) {
      if (!M) {
        const a = {};
        for (const t in this.skinData[r].skins)
          a[t] = this.skinData[r].skins[t].path;
        return a;
      }
      return M = pt.removeExt(M), this.skinData[r].skins[M];
    }
  }
  /**
   * 设置角色皮肤
   */
  setCharacterSkin(r, M) {
    if (et.isDeveloperMode() && console.log(`[whichWaySkin] setCharacterSkin ${r} ${M}`), M === "经典形象" && dt._skinStore[r]) {
      this.syncSkin({ key: r, del: !0 });
      return;
    }
    const a = this.getCharacterSkin(r, M);
    a && this.syncSkin({ key: r, value: [a.name, a.path] });
  }
  syncSkin({ key: r, value: M, del: a }) {
    if (a === !0)
      delete this._skinStore[r], delete window.whichWaySave.skinConfig[r], delete $.config.skin[r], et.saveConfig("skin", $.config.skin, void 0), et.saveConfig("skinConfig", window.whichWaySave.skinConfig);
    else {
      if (M === void 0) throw new Error("value is undefined");
      this._skinStore[r] = M, window.whichWaySave.skinConfig[r] = M[0], $.config.skin[r] = M, et.saveConfig("skin", $.config.skin, void 0), et.saveConfig("skinConfig", window.whichWaySave.skinConfig);
    }
  }
  refreshSkin() {
    const r = Lt.players.concat(Lt.dead);
    if (r.length !== 0)
      for (const M of r)
        M.node.avatar.setBackground(M.name1, "character"), M.name2 && M.node.avatar2.setBackground(M.name2, "character"), K.updateDyc(M.name, M);
  }
  /**
   * 获取角色的当前皮肤
   */
  getCurentSkin(r, M = !0) {
    let a = this._skinStore?.[r]?.[0];
    return a || (a = "经典形象.jpg"), M ? pt.removeExt(a) : a;
  }
  /**
   * 获取角色的当前皮肤路径
   */
  getCurrentSkinPath(r) {
    let M = this._skinStore?.[r]?.[1];
    if (!M)
      if (window.whichWaySave.hasChar(r)) M = pt.compilePath(`img:character/${r}.jpg`);
      else {
        const a = mt.character(r);
        if (a.img !== void 0) return a.img;
        if (a.trashBin) {
          for (let t of a.trashBin)
            if (t.startsWith("ext:"))
              return t.replace("ext:", "extension/");
        }
        return `image/character/${r}.jpg`;
      }
    return M;
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
    const r = It.create.div(".conflictedSkinOverlay-whichWaySkin .whichWayOverlay", document.body);
    return Zt(ue).mount(r), new Promise((M) => {
      this.pendingReslove.showConflictedSkin = M;
    });
  }
  syncAllSkinConfig() {
    if (this._isSyncing) return;
    this._isSyncing = !0, this.checkSkinSetting();
    const r = this, M = (e, n) => {
      for (const f in e) {
        const h = e[f];
        if (n) {
          if (typeof h == "string") {
            const v = r._skinStore[f], u = r.getCharacterSkin(f, pt.removeExt(h))?.path ?? v?.[1];
            r._skinStore[f] = [h, u];
          }
        } else
          Array.isArray(h) && h.length >= 1 && typeof h[0] == "string" ? r._skinStore[f] = [h[0], h[1]] : typeof h == "string" && (r._skinStore[f] = [h, void 0]);
      }
    }, a = et.config("skinOverride"), t = [
      { key: "whichWay", run: () => M(window.whichWaySave?.skinConfig || {}, !0) },
      { key: "noname", run: () => M($.config.skin || {}, !1) },
      { key: "qhly", run: () => M($.config.qhly_skinset?.skin || {}, !0) }
    ], i = t.findIndex((e) => e.key === a);
    i !== -1 && t.push(...t.splice(i, 1)), t.forEach((e) => e.run());
    try {
      const e = { ...this._skinStore }, n = this.transformSkinData(e);
      $.config.skin = e, $.config.qhly_skinset.skin = n, window.whichWaySave.skinConfig = n, et.saveConfig("skin", e, void 0), et.saveConfig("qhly_skinset", $.config.qhly_skinset, void 0), et.saveConfig("skinConfig", window.whichWaySave.skinConfig);
    } finally {
      this._isSyncing = !1;
    }
  }
  /**
   * 将本体皮肤数据格式转变为千幻、驶舰之向数据格式
   * - 若值为 [string, string] 数组，则取第一个元素；
   * - 否则保留原始值不变。
   */
  transformSkinData(r) {
    return Object.fromEntries(
      Object.entries(r).map(([M, a]) => Array.isArray(a) && a.length > 0 && typeof a[0] == "string" ? [M, a[0]] : [M, String(a)])
    );
  }
  /**
   * 清除皮肤配置
   */
  clearSkinConfig() {
    if (!et.isDeveloperMode()) {
      console.warn("WhichWaySkin.clearSkinConfig can only be called in developer mode.");
      return;
    }
    for (const r in this._skinStore)
      delete this._skinStore[r];
  }
  initConfictedSkins() {
    this.checkSkinSetting();
    const r = window.whichWaySave.skinConfig, M = $.config.skin, a = $.config.qhly_skinset.skin, t = this.confictedSkins.selected;
    for (const i in r)
      t[i] && [r[i], M[i], a[i]].includes(t[i]) || window.whichWaySave.hasChar(i) && (M[i] && Array.isArray(M[i]) && M[i][0] !== r[i] && (this.confictedSkins.add(i, M[i][0], "noname"), this.confictedSkins.add(i, r[i], "whichWay")), a[i] && a[i] !== r[i] && (this.confictedSkins.add(i, a[i], "qhly"), this.confictedSkins.add(i, r[i], "whichWay")));
  }
  /**
   * 皮肤数据
   */
  skinData = {};
  /**
   * 共享的皮肤配置对象
   */
  _skinStore = {};
  _isSyncing = !1;
  /**
   * 冲突的皮肤
   */
  confictedSkins = fe;
  /**
   * 等待的Promise
   */
  pendingReslove = {};
}
const dt = new de();
await dt.init();
Bt({
  name: "WhichWaySkin_dev",
  fn: () => {
    window.whichWaySkin = dt;
  }
});
window.whichWay.register("skin", dt);
const xe = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  whichWaySkin: dt
}, Symbol.toStringTag, { value: "Module" }));
export {
  xe as i,
  K as s,
  dt as w
};
