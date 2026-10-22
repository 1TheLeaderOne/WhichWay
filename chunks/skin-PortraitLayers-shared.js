import { defineComponent as Ee, reactive as We, openBlock as Rt, createElementBlock as Tt, createElementVNode as dt, unref as _t, Fragment as fe, renderList as de, toDisplayString as Ht, withDirectives as Ye, normalizeClass as _e, computed as qt, ref as Ft, watch as Xe, nextTick as Ge, onMounted as Ze, onBeforeUnmount as je, normalizeStyle as ve, createCommentVNode as ze, render as pe, createVNode as He, createApp as qe } from "vue";
import { lib as K, get as pt, game as gt, ui as Dt } from "noname";
import { whichWayFile as Q } from "./file.js";
import { onSetDev as Re, onContent as Te, onInit as Je, onArenaReady as me, onConfig as Ut } from "./hooks.js";
import { whichWayAPIOverride as Bt } from "./override.js";
import { whichWayToast as rt } from "./toast.js";
import { whichWayUtil as et } from "./utill.js";
import { w as Jt } from "./arknight-arkidMigration-shared.js";
import { _ as ke } from "./_plugin-vue_export-helper.js";
import { whichWayArknight as bt } from "./arknight.js";
var $ = /* @__PURE__ */ (function() {
  var o = function(e, v) {
    return o = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(n, t) {
      n.__proto__ = t;
    } || function(n, t) {
      for (var i in t) Object.prototype.hasOwnProperty.call(t, i) && (n[i] = t[i]);
    }, o(e, v);
  };
  return function(e, v) {
    if (typeof v != "function" && v !== null)
      throw new TypeError("Class extends value " + String(v) + " is not a constructor or null");
    o(e, v);
    function n() {
      this.constructor = e;
    }
    e.prototype = v === null ? Object.create(v) : (n.prototype = v.prototype, new n());
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
      for (var I = 0; I < x.length; I++)
        this.timelineIds[x[I].getPropertyId()] = !0;
      this.duration = P;
    }
    return g.prototype.hasTimeline = function(m) {
      return this.timelineIds[m] == !0;
    }, g.prototype.apply = function(m, x, P, I, O, R, D, N) {
      if (m == null)
        throw new Error("skeleton cannot be null.");
      I && this.duration != 0 && (P %= this.duration, x > 0 && (x %= this.duration));
      for (var k = this.timelines, y = 0, T = k.length; y < T; y++)
        k[y].apply(m, x, P, O, R, D, N);
    }, g.binarySearch = function(m, x, P) {
      P === void 0 && (P = 1);
      var I = 0, O = m.length / P - 2;
      if (O == 0)
        return P;
      for (var R = O >>> 1; ; ) {
        if (m[(R + 1) * P] <= x ? I = R + 1 : O = R, I == O)
          return (I + 1) * P;
        R = I + O >>> 1;
      }
    }, g.linearSearch = function(m, x, P) {
      for (var I = 0, O = m.length - P; I <= O; I += P)
        if (m[I] > x)
          return I;
      return -1;
    }, g;
  })();
  o.Animation = e;
  var v;
  (function(g) {
    g[g.setup = 0] = "setup", g[g.first = 1] = "first", g[g.replace = 2] = "replace", g[g.add = 3] = "add";
  })(v = o.MixBlend || (o.MixBlend = {}));
  var n;
  (function(g) {
    g[g.mixIn = 0] = "mixIn", g[g.mixOut = 1] = "mixOut";
  })(n = o.MixDirection || (o.MixDirection = {}));
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
    }, g.prototype.setCurve = function(m, x, P, I, O) {
      var R = (-x * 2 + I) * 0.03, D = (-P * 2 + O) * 0.03, N = ((x - I) * 3 + 1) * 6e-3, k = ((P - O) * 3 + 1) * 6e-3, y = R * 2 + N, T = D * 2 + k, B = x * 0.3 + R + N * 0.16666667, V = P * 0.3 + D + k * 0.16666667, G = m * g.BEZIER_SIZE, Y = this.curves;
      Y[G++] = g.BEZIER;
      for (var X = B, _ = V, W = G + g.BEZIER_SIZE - 1; G < W; G += 2)
        Y[G] = X, Y[G + 1] = _, B += y, V += T, y += N, T += k, X += B, _ += V;
    }, g.prototype.getCurvePercent = function(m, x) {
      x = o.MathUtils.clamp(x, 0, 1);
      var P = this.curves, I = m * g.BEZIER_SIZE, O = P[I];
      if (O == g.LINEAR)
        return x;
      if (O == g.STEPPED)
        return 0;
      I++;
      for (var R = 0, D = I, N = I + g.BEZIER_SIZE - 1; I < N; I += 2)
        if (R = P[I], R >= x) {
          var k = void 0, y = void 0;
          return I == D ? (k = 0, y = 0) : (k = P[I - 2], y = P[I - 1]), y + (P[I + 1] - y) * (x - k) / (R - k);
        }
      var T = P[I - 1];
      return T + (1 - T) * (x - R) / (1 - R);
    }, g.LINEAR = 0, g.STEPPED = 1, g.BEZIER = 2, g.BEZIER_SIZE = 19, g;
  })();
  o.CurveTimeline = i;
  var r = (function(g) {
    $(m, g);
    function m(x) {
      var P = g.call(this, x) || this;
      return P.frames = o.Utils.newFloatArray(x << 1), P;
    }
    return m.prototype.getPropertyId = function() {
      return (t.rotate << 24) + this.boneIndex;
    }, m.prototype.setFrame = function(x, P, I) {
      x <<= 1, this.frames[x] = P, this.frames[x + m.ROTATION] = I;
    }, m.prototype.apply = function(x, P, I, O, R, D, N) {
      var k = this.frames, y = x.bones[this.boneIndex];
      if (y.active) {
        if (I < k[0]) {
          switch (D) {
            case v.setup:
              y.rotation = y.data.rotation;
              return;
            case v.first:
              var T = y.data.rotation - y.rotation;
              y.rotation += (T - (16384 - (16384.499999999996 - T / 360 | 0)) * 360) * R;
          }
          return;
        }
        if (I >= k[k.length - m.ENTRIES]) {
          var B = k[k.length + m.PREV_ROTATION];
          switch (D) {
            case v.setup:
              y.rotation = y.data.rotation + B * R;
              break;
            case v.first:
            case v.replace:
              B += y.data.rotation - y.rotation, B -= (16384 - (16384.499999999996 - B / 360 | 0)) * 360;
            case v.add:
              y.rotation += B * R;
          }
          return;
        }
        var V = e.binarySearch(k, I, m.ENTRIES), G = k[V + m.PREV_ROTATION], Y = k[V], X = this.getCurvePercent((V >> 1) - 1, 1 - (I - Y) / (k[V + m.PREV_TIME] - Y)), _ = k[V + m.ROTATION] - G;
        switch (_ = G + (_ - (16384 - (16384.499999999996 - _ / 360 | 0)) * 360) * X, D) {
          case v.setup:
            y.rotation = y.data.rotation + (_ - (16384 - (16384.499999999996 - _ / 360 | 0)) * 360) * R;
            break;
          case v.first:
          case v.replace:
            _ += y.data.rotation - y.rotation;
          case v.add:
            y.rotation += (_ - (16384 - (16384.499999999996 - _ / 360 | 0)) * 360) * R;
        }
      }
    }, m.ENTRIES = 2, m.PREV_TIME = -2, m.PREV_ROTATION = -1, m.ROTATION = 1, m;
  })(i);
  o.RotateTimeline = r;
  var a = (function(g) {
    $(m, g);
    function m(x) {
      var P = g.call(this, x) || this;
      return P.frames = o.Utils.newFloatArray(x * m.ENTRIES), P;
    }
    return m.prototype.getPropertyId = function() {
      return (t.translate << 24) + this.boneIndex;
    }, m.prototype.setFrame = function(x, P, I, O) {
      x *= m.ENTRIES, this.frames[x] = P, this.frames[x + m.X] = I, this.frames[x + m.Y] = O;
    }, m.prototype.apply = function(x, P, I, O, R, D, N) {
      var k = this.frames, y = x.bones[this.boneIndex];
      if (y.active) {
        if (I < k[0]) {
          switch (D) {
            case v.setup:
              y.x = y.data.x, y.y = y.data.y;
              return;
            case v.first:
              y.x += (y.data.x - y.x) * R, y.y += (y.data.y - y.y) * R;
          }
          return;
        }
        var T = 0, B = 0;
        if (I >= k[k.length - m.ENTRIES])
          T = k[k.length + m.PREV_X], B = k[k.length + m.PREV_Y];
        else {
          var V = e.binarySearch(k, I, m.ENTRIES);
          T = k[V + m.PREV_X], B = k[V + m.PREV_Y];
          var G = k[V], Y = this.getCurvePercent(V / m.ENTRIES - 1, 1 - (I - G) / (k[V + m.PREV_TIME] - G));
          T += (k[V + m.X] - T) * Y, B += (k[V + m.Y] - B) * Y;
        }
        switch (D) {
          case v.setup:
            y.x = y.data.x + T * R, y.y = y.data.y + B * R;
            break;
          case v.first:
          case v.replace:
            y.x += (y.data.x + T - y.x) * R, y.y += (y.data.y + B - y.y) * R;
            break;
          case v.add:
            y.x += T * R, y.y += B * R;
        }
      }
    }, m.ENTRIES = 3, m.PREV_TIME = -3, m.PREV_X = -2, m.PREV_Y = -1, m.X = 1, m.Y = 2, m;
  })(i);
  o.TranslateTimeline = a;
  var f = (function(g) {
    $(m, g);
    function m(x) {
      return g.call(this, x) || this;
    }
    return m.prototype.getPropertyId = function() {
      return (t.scale << 24) + this.boneIndex;
    }, m.prototype.apply = function(x, P, I, O, R, D, N) {
      var k = this.frames, y = x.bones[this.boneIndex];
      if (y.active) {
        if (I < k[0]) {
          switch (D) {
            case v.setup:
              y.scaleX = y.data.scaleX, y.scaleY = y.data.scaleY;
              return;
            case v.first:
              y.scaleX += (y.data.scaleX - y.scaleX) * R, y.scaleY += (y.data.scaleY - y.scaleY) * R;
          }
          return;
        }
        var T = 0, B = 0;
        if (I >= k[k.length - m.ENTRIES])
          T = k[k.length + m.PREV_X] * y.data.scaleX, B = k[k.length + m.PREV_Y] * y.data.scaleY;
        else {
          var V = e.binarySearch(k, I, m.ENTRIES);
          T = k[V + m.PREV_X], B = k[V + m.PREV_Y];
          var G = k[V], Y = this.getCurvePercent(V / m.ENTRIES - 1, 1 - (I - G) / (k[V + m.PREV_TIME] - G));
          T = (T + (k[V + m.X] - T) * Y) * y.data.scaleX, B = (B + (k[V + m.Y] - B) * Y) * y.data.scaleY;
        }
        if (R == 1)
          D == v.add ? (y.scaleX += T - y.data.scaleX, y.scaleY += B - y.data.scaleY) : (y.scaleX = T, y.scaleY = B);
        else {
          var X = 0, _ = 0;
          if (N == n.mixOut)
            switch (D) {
              case v.setup:
                X = y.data.scaleX, _ = y.data.scaleY, y.scaleX = X + (Math.abs(T) * o.MathUtils.signum(X) - X) * R, y.scaleY = _ + (Math.abs(B) * o.MathUtils.signum(_) - _) * R;
                break;
              case v.first:
              case v.replace:
                X = y.scaleX, _ = y.scaleY, y.scaleX = X + (Math.abs(T) * o.MathUtils.signum(X) - X) * R, y.scaleY = _ + (Math.abs(B) * o.MathUtils.signum(_) - _) * R;
                break;
              case v.add:
                X = y.scaleX, _ = y.scaleY, y.scaleX = X + (Math.abs(T) * o.MathUtils.signum(X) - y.data.scaleX) * R, y.scaleY = _ + (Math.abs(B) * o.MathUtils.signum(_) - y.data.scaleY) * R;
            }
          else
            switch (D) {
              case v.setup:
                X = Math.abs(y.data.scaleX) * o.MathUtils.signum(T), _ = Math.abs(y.data.scaleY) * o.MathUtils.signum(B), y.scaleX = X + (T - X) * R, y.scaleY = _ + (B - _) * R;
                break;
              case v.first:
              case v.replace:
                X = Math.abs(y.scaleX) * o.MathUtils.signum(T), _ = Math.abs(y.scaleY) * o.MathUtils.signum(B), y.scaleX = X + (T - X) * R, y.scaleY = _ + (B - _) * R;
                break;
              case v.add:
                X = o.MathUtils.signum(T), _ = o.MathUtils.signum(B), y.scaleX = Math.abs(y.scaleX) * X + (T - Math.abs(y.data.scaleX) * X) * R, y.scaleY = Math.abs(y.scaleY) * _ + (B - Math.abs(y.data.scaleY) * _) * R;
            }
        }
      }
    }, m;
  })(a);
  o.ScaleTimeline = f;
  var l = (function(g) {
    $(m, g);
    function m(x) {
      return g.call(this, x) || this;
    }
    return m.prototype.getPropertyId = function() {
      return (t.shear << 24) + this.boneIndex;
    }, m.prototype.apply = function(x, P, I, O, R, D, N) {
      var k = this.frames, y = x.bones[this.boneIndex];
      if (y.active) {
        if (I < k[0]) {
          switch (D) {
            case v.setup:
              y.shearX = y.data.shearX, y.shearY = y.data.shearY;
              return;
            case v.first:
              y.shearX += (y.data.shearX - y.shearX) * R, y.shearY += (y.data.shearY - y.shearY) * R;
          }
          return;
        }
        var T = 0, B = 0;
        if (I >= k[k.length - m.ENTRIES])
          T = k[k.length + m.PREV_X], B = k[k.length + m.PREV_Y];
        else {
          var V = e.binarySearch(k, I, m.ENTRIES);
          T = k[V + m.PREV_X], B = k[V + m.PREV_Y];
          var G = k[V], Y = this.getCurvePercent(V / m.ENTRIES - 1, 1 - (I - G) / (k[V + m.PREV_TIME] - G));
          T = T + (k[V + m.X] - T) * Y, B = B + (k[V + m.Y] - B) * Y;
        }
        switch (D) {
          case v.setup:
            y.shearX = y.data.shearX + T * R, y.shearY = y.data.shearY + B * R;
            break;
          case v.first:
          case v.replace:
            y.shearX += (y.data.shearX + T - y.shearX) * R, y.shearY += (y.data.shearY + B - y.shearY) * R;
            break;
          case v.add:
            y.shearX += T * R, y.shearY += B * R;
        }
      }
    }, m;
  })(a);
  o.ShearTimeline = l;
  var p = (function(g) {
    $(m, g);
    function m(x) {
      var P = g.call(this, x) || this;
      return P.frames = o.Utils.newFloatArray(x * m.ENTRIES), P;
    }
    return m.prototype.getPropertyId = function() {
      return (t.color << 24) + this.slotIndex;
    }, m.prototype.setFrame = function(x, P, I, O, R, D) {
      x *= m.ENTRIES, this.frames[x] = P, this.frames[x + m.R] = I, this.frames[x + m.G] = O, this.frames[x + m.B] = R, this.frames[x + m.A] = D;
    }, m.prototype.apply = function(x, P, I, O, R, D, N) {
      var k = x.slots[this.slotIndex];
      if (k.bone.active) {
        var y = this.frames;
        if (I < y[0]) {
          switch (D) {
            case v.setup:
              k.color.setFromColor(k.data.color);
              return;
            case v.first:
              var T = k.color, B = k.data.color;
              T.add((B.r - T.r) * R, (B.g - T.g) * R, (B.b - T.b) * R, (B.a - T.a) * R);
          }
          return;
        }
        var V = 0, G = 0, Y = 0, X = 0;
        if (I >= y[y.length - m.ENTRIES]) {
          var _ = y.length;
          V = y[_ + m.PREV_R], G = y[_ + m.PREV_G], Y = y[_ + m.PREV_B], X = y[_ + m.PREV_A];
        } else {
          var W = e.binarySearch(y, I, m.ENTRIES);
          V = y[W + m.PREV_R], G = y[W + m.PREV_G], Y = y[W + m.PREV_B], X = y[W + m.PREV_A];
          var U = y[W], w = this.getCurvePercent(W / m.ENTRIES - 1, 1 - (I - U) / (y[W + m.PREV_TIME] - U));
          V += (y[W + m.R] - V) * w, G += (y[W + m.G] - G) * w, Y += (y[W + m.B] - Y) * w, X += (y[W + m.A] - X) * w;
        }
        if (R == 1)
          k.color.set(V, G, Y, X);
        else {
          var T = k.color;
          D == v.setup && T.setFromColor(k.data.color), T.add((V - T.r) * R, (G - T.g) * R, (Y - T.b) * R, (X - T.a) * R);
        }
      }
    }, m.ENTRIES = 5, m.PREV_TIME = -5, m.PREV_R = -4, m.PREV_G = -3, m.PREV_B = -2, m.PREV_A = -1, m.R = 1, m.G = 2, m.B = 3, m.A = 4, m;
  })(i);
  o.ColorTimeline = p;
  var u = (function(g) {
    $(m, g);
    function m(x) {
      var P = g.call(this, x) || this;
      return P.frames = o.Utils.newFloatArray(x * m.ENTRIES), P;
    }
    return m.prototype.getPropertyId = function() {
      return (t.twoColor << 24) + this.slotIndex;
    }, m.prototype.setFrame = function(x, P, I, O, R, D, N, k, y) {
      x *= m.ENTRIES, this.frames[x] = P, this.frames[x + m.R] = I, this.frames[x + m.G] = O, this.frames[x + m.B] = R, this.frames[x + m.A] = D, this.frames[x + m.R2] = N, this.frames[x + m.G2] = k, this.frames[x + m.B2] = y;
    }, m.prototype.apply = function(x, P, I, O, R, D, N) {
      var k = x.slots[this.slotIndex];
      if (k.bone.active) {
        var y = this.frames;
        if (I < y[0]) {
          switch (D) {
            case v.setup:
              k.color.setFromColor(k.data.color), k.darkColor.setFromColor(k.data.darkColor);
              return;
            case v.first:
              var T = k.color, B = k.darkColor, V = k.data.color, G = k.data.darkColor;
              T.add((V.r - T.r) * R, (V.g - T.g) * R, (V.b - T.b) * R, (V.a - T.a) * R), B.add((G.r - B.r) * R, (G.g - B.g) * R, (G.b - B.b) * R, 0);
          }
          return;
        }
        var Y = 0, X = 0, _ = 0, W = 0, U = 0, w = 0, Z = 0;
        if (I >= y[y.length - m.ENTRIES]) {
          var z = y.length;
          Y = y[z + m.PREV_R], X = y[z + m.PREV_G], _ = y[z + m.PREV_B], W = y[z + m.PREV_A], U = y[z + m.PREV_R2], w = y[z + m.PREV_G2], Z = y[z + m.PREV_B2];
        } else {
          var j = e.binarySearch(y, I, m.ENTRIES);
          Y = y[j + m.PREV_R], X = y[j + m.PREV_G], _ = y[j + m.PREV_B], W = y[j + m.PREV_A], U = y[j + m.PREV_R2], w = y[j + m.PREV_G2], Z = y[j + m.PREV_B2];
          var H = y[j], J = this.getCurvePercent(j / m.ENTRIES - 1, 1 - (I - H) / (y[j + m.PREV_TIME] - H));
          Y += (y[j + m.R] - Y) * J, X += (y[j + m.G] - X) * J, _ += (y[j + m.B] - _) * J, W += (y[j + m.A] - W) * J, U += (y[j + m.R2] - U) * J, w += (y[j + m.G2] - w) * J, Z += (y[j + m.B2] - Z) * J;
        }
        if (R == 1)
          k.color.set(Y, X, _, W), k.darkColor.set(U, w, Z, 1);
        else {
          var T = k.color, B = k.darkColor;
          D == v.setup && (T.setFromColor(k.data.color), B.setFromColor(k.data.darkColor)), T.add((Y - T.r) * R, (X - T.g) * R, (_ - T.b) * R, (W - T.a) * R), B.add((U - B.r) * R, (w - B.g) * R, (Z - B.b) * R, 0);
        }
      }
    }, m.ENTRIES = 8, m.PREV_TIME = -8, m.PREV_R = -7, m.PREV_G = -6, m.PREV_B = -5, m.PREV_A = -4, m.PREV_R2 = -3, m.PREV_G2 = -2, m.PREV_B2 = -1, m.R = 1, m.G = 2, m.B = 3, m.A = 4, m.R2 = 5, m.G2 = 6, m.B2 = 7, m;
  })(i);
  o.TwoColorTimeline = u;
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
    }, g.prototype.apply = function(m, x, P, I, O, R, D) {
      var N = m.slots[this.slotIndex];
      if (N.bone.active) {
        if (D == n.mixOut) {
          R == v.setup && this.setAttachment(m, N, N.data.attachmentName);
          return;
        }
        var k = this.frames;
        if (P < k[0]) {
          (R == v.setup || R == v.first) && this.setAttachment(m, N, N.data.attachmentName);
          return;
        }
        var y = 0;
        P >= k[k.length - 1] ? y = k.length - 1 : y = e.binarySearch(k, P, 1) - 1;
        var T = this.attachmentNames[y];
        m.slots[this.slotIndex].setAttachment(T == null ? null : m.getAttachment(this.slotIndex, T));
      }
    }, g.prototype.setAttachment = function(m, x, P) {
      x.setAttachment(P == null ? null : m.getAttachment(this.slotIndex, P));
    }, g;
  })();
  o.AttachmentTimeline = s;
  var h = null, d = (function(g) {
    $(m, g);
    function m(x) {
      var P = g.call(this, x) || this;
      return P.frames = o.Utils.newFloatArray(x), P.frameVertices = new Array(x), h == null && (h = o.Utils.newFloatArray(64)), P;
    }
    return m.prototype.getPropertyId = function() {
      return (t.deform << 27) + +this.attachment.id + this.slotIndex;
    }, m.prototype.setFrame = function(x, P, I) {
      this.frames[x] = P, this.frameVertices[x] = I;
    }, m.prototype.apply = function(x, P, I, O, R, D, N) {
      var k = x.slots[this.slotIndex];
      if (k.bone.active) {
        var y = k.getAttachment();
        if (!(!(y instanceof o.VertexAttachment) || y.deformAttachment != this.attachment)) {
          var T = k.deform;
          T.length == 0 && (D = v.setup);
          var B = this.frameVertices, V = B[0].length, G = this.frames;
          if (I < G[0]) {
            var Y = y;
            switch (D) {
              case v.setup:
                T.length = 0;
                return;
              case v.first:
                if (R == 1) {
                  T.length = 0;
                  break;
                }
                var X = o.Utils.setArraySize(T, V);
                if (Y.bones == null)
                  for (var _ = Y.vertices, W = 0; W < V; W++)
                    X[W] += (_[W] - X[W]) * R;
                else {
                  R = 1 - R;
                  for (var W = 0; W < V; W++)
                    X[W] *= R;
                }
            }
            return;
          }
          var U = o.Utils.setArraySize(T, V);
          if (I >= G[G.length - 1]) {
            var w = B[G.length - 1];
            if (R == 1)
              if (D == v.add) {
                var Y = y;
                if (Y.bones == null)
                  for (var _ = Y.vertices, Z = 0; Z < V; Z++)
                    U[Z] += w[Z] - _[Z];
                else
                  for (var z = 0; z < V; z++)
                    U[z] += w[z];
              } else
                o.Utils.arrayCopy(w, 0, U, 0, V);
            else
              switch (D) {
                case v.setup: {
                  var j = y;
                  if (j.bones == null)
                    for (var _ = j.vertices, H = 0; H < V; H++) {
                      var J = _[H];
                      U[H] = J + (w[H] - J) * R;
                    }
                  else
                    for (var tt = 0; tt < V; tt++)
                      U[tt] = w[tt] * R;
                  break;
                }
                case v.first:
                case v.replace:
                  for (var q = 0; q < V; q++)
                    U[q] += (w[q] - U[q]) * R;
                  break;
                case v.add:
                  var Y = y;
                  if (Y.bones == null)
                    for (var _ = Y.vertices, at = 0; at < V; at++)
                      U[at] += (w[at] - _[at]) * R;
                  else
                    for (var nt = 0; nt < V; nt++)
                      U[nt] += w[nt] * R;
              }
            return;
          }
          var ct = e.binarySearch(G, I), ut = B[ct - 1], st = B[ct], ft = G[ct], ot = this.getCurvePercent(ct - 1, 1 - (I - ft) / (G[ct - 1] - ft));
          if (R == 1)
            if (D == v.add) {
              var Y = y;
              if (Y.bones == null)
                for (var _ = Y.vertices, ht = 0; ht < V; ht++) {
                  var it = ut[ht];
                  U[ht] += it + (st[ht] - it) * ot - _[ht];
                }
              else
                for (var xt = 0; xt < V; xt++) {
                  var it = ut[xt];
                  U[xt] += it + (st[xt] - it) * ot;
                }
            } else
              for (var Mt = 0; Mt < V; Mt++) {
                var it = ut[Mt];
                U[Mt] = it + (st[Mt] - it) * ot;
              }
          else
            switch (D) {
              case v.setup: {
                var kt = y;
                if (kt.bones == null)
                  for (var _ = kt.vertices, yt = 0; yt < V; yt++) {
                    var it = ut[yt], J = _[yt];
                    U[yt] = J + (it + (st[yt] - it) * ot - J) * R;
                  }
                else
                  for (var Et = 0; Et < V; Et++) {
                    var it = ut[Et];
                    U[Et] = (it + (st[Et] - it) * ot) * R;
                  }
                break;
              }
              case v.first:
              case v.replace:
                for (var vt = 0; vt < V; vt++) {
                  var it = ut[vt];
                  U[vt] += (it + (st[vt] - it) * ot - U[vt]) * R;
                }
                break;
              case v.add:
                var Y = y;
                if (Y.bones == null)
                  for (var _ = Y.vertices, It = 0; It < V; It++) {
                    var it = ut[It];
                    U[It] += (it + (st[It] - it) * ot - _[It]) * R;
                  }
                else
                  for (var Ot = 0; Ot < V; Ot++) {
                    var it = ut[Ot];
                    U[Ot] += (it + (st[Ot] - it) * ot) * R;
                  }
            }
        }
      }
    }, m;
  })(i);
  o.DeformTimeline = d;
  var c = (function() {
    function g(m) {
      this.frames = o.Utils.newFloatArray(m), this.events = new Array(m);
    }
    return g.prototype.getPropertyId = function() {
      return t.event << 24;
    }, g.prototype.getFrameCount = function() {
      return this.frames.length;
    }, g.prototype.setFrame = function(m, x) {
      this.frames[m] = x.time, this.events[m] = x;
    }, g.prototype.apply = function(m, x, P, I, O, R, D) {
      if (I != null) {
        var N = this.frames, k = this.frames.length;
        if (x > P)
          this.apply(m, x, Number.MAX_VALUE, I, O, R, D), x = -1;
        else if (x >= N[k - 1])
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
          for (; y < k && P >= N[y]; y++)
            I.push(this.events[y]);
        }
      }
    }, g;
  })();
  o.EventTimeline = c;
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
    }, g.prototype.apply = function(m, x, P, I, O, R, D) {
      var N = m.drawOrder, k = m.slots;
      if (D == n.mixOut) {
        R == v.setup && o.Utils.arrayCopy(m.slots, 0, m.drawOrder, 0, m.slots.length);
        return;
      }
      var y = this.frames;
      if (P < y[0]) {
        (R == v.setup || R == v.first) && o.Utils.arrayCopy(m.slots, 0, m.drawOrder, 0, m.slots.length);
        return;
      }
      var T = 0;
      P >= y[y.length - 1] ? T = y.length - 1 : T = e.binarySearch(y, P) - 1;
      var B = this.drawOrders[T];
      if (B == null)
        o.Utils.arrayCopy(k, 0, N, 0, k.length);
      else
        for (var V = 0, G = B.length; V < G; V++)
          N[V] = k[B[V]];
    }, g;
  })();
  o.DrawOrderTimeline = M;
  var C = (function(g) {
    $(m, g);
    function m(x) {
      var P = g.call(this, x) || this;
      return P.frames = o.Utils.newFloatArray(x * m.ENTRIES), P;
    }
    return m.prototype.getPropertyId = function() {
      return (t.ikConstraint << 24) + this.ikConstraintIndex;
    }, m.prototype.setFrame = function(x, P, I, O, R, D, N) {
      x *= m.ENTRIES, this.frames[x] = P, this.frames[x + m.MIX] = I, this.frames[x + m.SOFTNESS] = O, this.frames[x + m.BEND_DIRECTION] = R, this.frames[x + m.COMPRESS] = D ? 1 : 0, this.frames[x + m.STRETCH] = N ? 1 : 0;
    }, m.prototype.apply = function(x, P, I, O, R, D, N) {
      var k = this.frames, y = x.ikConstraints[this.ikConstraintIndex];
      if (y.active) {
        if (I < k[0]) {
          switch (D) {
            case v.setup:
              y.mix = y.data.mix, y.softness = y.data.softness, y.bendDirection = y.data.bendDirection, y.compress = y.data.compress, y.stretch = y.data.stretch;
              return;
            case v.first:
              y.mix += (y.data.mix - y.mix) * R, y.softness += (y.data.softness - y.softness) * R, y.bendDirection = y.data.bendDirection, y.compress = y.data.compress, y.stretch = y.data.stretch;
          }
          return;
        }
        if (I >= k[k.length - m.ENTRIES]) {
          D == v.setup ? (y.mix = y.data.mix + (k[k.length + m.PREV_MIX] - y.data.mix) * R, y.softness = y.data.softness + (k[k.length + m.PREV_SOFTNESS] - y.data.softness) * R, N == n.mixOut ? (y.bendDirection = y.data.bendDirection, y.compress = y.data.compress, y.stretch = y.data.stretch) : (y.bendDirection = k[k.length + m.PREV_BEND_DIRECTION], y.compress = k[k.length + m.PREV_COMPRESS] != 0, y.stretch = k[k.length + m.PREV_STRETCH] != 0)) : (y.mix += (k[k.length + m.PREV_MIX] - y.mix) * R, y.softness += (k[k.length + m.PREV_SOFTNESS] - y.softness) * R, N == n.mixIn && (y.bendDirection = k[k.length + m.PREV_BEND_DIRECTION], y.compress = k[k.length + m.PREV_COMPRESS] != 0, y.stretch = k[k.length + m.PREV_STRETCH] != 0));
          return;
        }
        var T = e.binarySearch(k, I, m.ENTRIES), B = k[T + m.PREV_MIX], V = k[T + m.PREV_SOFTNESS], G = k[T], Y = this.getCurvePercent(T / m.ENTRIES - 1, 1 - (I - G) / (k[T + m.PREV_TIME] - G));
        D == v.setup ? (y.mix = y.data.mix + (B + (k[T + m.MIX] - B) * Y - y.data.mix) * R, y.softness = y.data.softness + (V + (k[T + m.SOFTNESS] - V) * Y - y.data.softness) * R, N == n.mixOut ? (y.bendDirection = y.data.bendDirection, y.compress = y.data.compress, y.stretch = y.data.stretch) : (y.bendDirection = k[T + m.PREV_BEND_DIRECTION], y.compress = k[T + m.PREV_COMPRESS] != 0, y.stretch = k[T + m.PREV_STRETCH] != 0)) : (y.mix += (B + (k[T + m.MIX] - B) * Y - y.mix) * R, y.softness += (V + (k[T + m.SOFTNESS] - V) * Y - y.softness) * R, N == n.mixIn && (y.bendDirection = k[T + m.PREV_BEND_DIRECTION], y.compress = k[T + m.PREV_COMPRESS] != 0, y.stretch = k[T + m.PREV_STRETCH] != 0));
      }
    }, m.ENTRIES = 6, m.PREV_TIME = -6, m.PREV_MIX = -5, m.PREV_SOFTNESS = -4, m.PREV_BEND_DIRECTION = -3, m.PREV_COMPRESS = -2, m.PREV_STRETCH = -1, m.MIX = 1, m.SOFTNESS = 2, m.BEND_DIRECTION = 3, m.COMPRESS = 4, m.STRETCH = 5, m;
  })(i);
  o.IkConstraintTimeline = C;
  var S = (function(g) {
    $(m, g);
    function m(x) {
      var P = g.call(this, x) || this;
      return P.frames = o.Utils.newFloatArray(x * m.ENTRIES), P;
    }
    return m.prototype.getPropertyId = function() {
      return (t.transformConstraint << 24) + this.transformConstraintIndex;
    }, m.prototype.setFrame = function(x, P, I, O, R, D) {
      x *= m.ENTRIES, this.frames[x] = P, this.frames[x + m.ROTATE] = I, this.frames[x + m.TRANSLATE] = O, this.frames[x + m.SCALE] = R, this.frames[x + m.SHEAR] = D;
    }, m.prototype.apply = function(x, P, I, O, R, D, N) {
      var k = this.frames, y = x.transformConstraints[this.transformConstraintIndex];
      if (y.active) {
        if (I < k[0]) {
          var T = y.data;
          switch (D) {
            case v.setup:
              y.rotateMix = T.rotateMix, y.translateMix = T.translateMix, y.scaleMix = T.scaleMix, y.shearMix = T.shearMix;
              return;
            case v.first:
              y.rotateMix += (T.rotateMix - y.rotateMix) * R, y.translateMix += (T.translateMix - y.translateMix) * R, y.scaleMix += (T.scaleMix - y.scaleMix) * R, y.shearMix += (T.shearMix - y.shearMix) * R;
          }
          return;
        }
        var B = 0, V = 0, G = 0, Y = 0;
        if (I >= k[k.length - m.ENTRIES]) {
          var X = k.length;
          B = k[X + m.PREV_ROTATE], V = k[X + m.PREV_TRANSLATE], G = k[X + m.PREV_SCALE], Y = k[X + m.PREV_SHEAR];
        } else {
          var _ = e.binarySearch(k, I, m.ENTRIES);
          B = k[_ + m.PREV_ROTATE], V = k[_ + m.PREV_TRANSLATE], G = k[_ + m.PREV_SCALE], Y = k[_ + m.PREV_SHEAR];
          var W = k[_], U = this.getCurvePercent(_ / m.ENTRIES - 1, 1 - (I - W) / (k[_ + m.PREV_TIME] - W));
          B += (k[_ + m.ROTATE] - B) * U, V += (k[_ + m.TRANSLATE] - V) * U, G += (k[_ + m.SCALE] - G) * U, Y += (k[_ + m.SHEAR] - Y) * U;
        }
        if (D == v.setup) {
          var T = y.data;
          y.rotateMix = T.rotateMix + (B - T.rotateMix) * R, y.translateMix = T.translateMix + (V - T.translateMix) * R, y.scaleMix = T.scaleMix + (G - T.scaleMix) * R, y.shearMix = T.shearMix + (Y - T.shearMix) * R;
        } else
          y.rotateMix += (B - y.rotateMix) * R, y.translateMix += (V - y.translateMix) * R, y.scaleMix += (G - y.scaleMix) * R, y.shearMix += (Y - y.shearMix) * R;
      }
    }, m.ENTRIES = 5, m.PREV_TIME = -5, m.PREV_ROTATE = -4, m.PREV_TRANSLATE = -3, m.PREV_SCALE = -2, m.PREV_SHEAR = -1, m.ROTATE = 1, m.TRANSLATE = 2, m.SCALE = 3, m.SHEAR = 4, m;
  })(i);
  o.TransformConstraintTimeline = S;
  var L = (function(g) {
    $(m, g);
    function m(x) {
      var P = g.call(this, x) || this;
      return P.frames = o.Utils.newFloatArray(x * m.ENTRIES), P;
    }
    return m.prototype.getPropertyId = function() {
      return (t.pathConstraintPosition << 24) + this.pathConstraintIndex;
    }, m.prototype.setFrame = function(x, P, I) {
      x *= m.ENTRIES, this.frames[x] = P, this.frames[x + m.VALUE] = I;
    }, m.prototype.apply = function(x, P, I, O, R, D, N) {
      var k = this.frames, y = x.pathConstraints[this.pathConstraintIndex];
      if (y.active) {
        if (I < k[0]) {
          switch (D) {
            case v.setup:
              y.position = y.data.position;
              return;
            case v.first:
              y.position += (y.data.position - y.position) * R;
          }
          return;
        }
        var T = 0;
        if (I >= k[k.length - m.ENTRIES])
          T = k[k.length + m.PREV_VALUE];
        else {
          var B = e.binarySearch(k, I, m.ENTRIES);
          T = k[B + m.PREV_VALUE];
          var V = k[B], G = this.getCurvePercent(B / m.ENTRIES - 1, 1 - (I - V) / (k[B + m.PREV_TIME] - V));
          T += (k[B + m.VALUE] - T) * G;
        }
        D == v.setup ? y.position = y.data.position + (T - y.data.position) * R : y.position += (T - y.position) * R;
      }
    }, m.ENTRIES = 2, m.PREV_TIME = -2, m.PREV_VALUE = -1, m.VALUE = 1, m;
  })(i);
  o.PathConstraintPositionTimeline = L;
  var E = (function(g) {
    $(m, g);
    function m(x) {
      return g.call(this, x) || this;
    }
    return m.prototype.getPropertyId = function() {
      return (t.pathConstraintSpacing << 24) + this.pathConstraintIndex;
    }, m.prototype.apply = function(x, P, I, O, R, D, N) {
      var k = this.frames, y = x.pathConstraints[this.pathConstraintIndex];
      if (y.active) {
        if (I < k[0]) {
          switch (D) {
            case v.setup:
              y.spacing = y.data.spacing;
              return;
            case v.first:
              y.spacing += (y.data.spacing - y.spacing) * R;
          }
          return;
        }
        var T = 0;
        if (I >= k[k.length - m.ENTRIES])
          T = k[k.length + m.PREV_VALUE];
        else {
          var B = e.binarySearch(k, I, m.ENTRIES);
          T = k[B + m.PREV_VALUE];
          var V = k[B], G = this.getCurvePercent(B / m.ENTRIES - 1, 1 - (I - V) / (k[B + m.PREV_TIME] - V));
          T += (k[B + m.VALUE] - T) * G;
        }
        D == v.setup ? y.spacing = y.data.spacing + (T - y.data.spacing) * R : y.spacing += (T - y.spacing) * R;
      }
    }, m;
  })(L);
  o.PathConstraintSpacingTimeline = E;
  var A = (function(g) {
    $(m, g);
    function m(x) {
      var P = g.call(this, x) || this;
      return P.frames = o.Utils.newFloatArray(x * m.ENTRIES), P;
    }
    return m.prototype.getPropertyId = function() {
      return (t.pathConstraintMix << 24) + this.pathConstraintIndex;
    }, m.prototype.setFrame = function(x, P, I, O) {
      x *= m.ENTRIES, this.frames[x] = P, this.frames[x + m.ROTATE] = I, this.frames[x + m.TRANSLATE] = O;
    }, m.prototype.apply = function(x, P, I, O, R, D, N) {
      var k = this.frames, y = x.pathConstraints[this.pathConstraintIndex];
      if (y.active) {
        if (I < k[0]) {
          switch (D) {
            case v.setup:
              y.rotateMix = y.data.rotateMix, y.translateMix = y.data.translateMix;
              return;
            case v.first:
              y.rotateMix += (y.data.rotateMix - y.rotateMix) * R, y.translateMix += (y.data.translateMix - y.translateMix) * R;
          }
          return;
        }
        var T = 0, B = 0;
        if (I >= k[k.length - m.ENTRIES])
          T = k[k.length + m.PREV_ROTATE], B = k[k.length + m.PREV_TRANSLATE];
        else {
          var V = e.binarySearch(k, I, m.ENTRIES);
          T = k[V + m.PREV_ROTATE], B = k[V + m.PREV_TRANSLATE];
          var G = k[V], Y = this.getCurvePercent(V / m.ENTRIES - 1, 1 - (I - G) / (k[V + m.PREV_TIME] - G));
          T += (k[V + m.ROTATE] - T) * Y, B += (k[V + m.TRANSLATE] - B) * Y;
        }
        D == v.setup ? (y.rotateMix = y.data.rotateMix + (T - y.data.rotateMix) * R, y.translateMix = y.data.translateMix + (B - y.data.translateMix) * R) : (y.rotateMix += (T - y.rotateMix) * R, y.translateMix += (B - y.translateMix) * R);
      }
    }, m.ENTRIES = 3, m.PREV_TIME = -3, m.PREV_ROTATE = -2, m.PREV_TRANSLATE = -1, m.ROTATE = 1, m.TRANSLATE = 2, m;
  })(i);
  o.PathConstraintMixTimeline = A;
})(F || (F = {}));
var F;
(function(o) {
  var e = (function() {
    function r(a) {
      this.tracks = new Array(), this.timeScale = 1, this.unkeyedState = 0, this.events = new Array(), this.listeners = new Array(), this.queue = new n(this), this.propertyIDs = new o.IntSet(), this.animationsChanged = !1, this.trackEntryPool = new o.Pool(function() {
        return new v();
      }), this.data = a;
    }
    return r.prototype.update = function(a) {
      a *= this.timeScale;
      for (var f = this.tracks, l = 0, p = f.length; l < p; l++) {
        var u = f[l];
        if (u != null) {
          u.animationLast = u.nextAnimationLast, u.trackLast = u.nextTrackLast;
          var s = a * u.timeScale;
          if (u.delay > 0) {
            if (u.delay -= s, u.delay > 0)
              continue;
            s = -u.delay, u.delay = 0;
          }
          var h = u.next;
          if (h != null) {
            var d = u.trackLast - h.delay;
            if (d >= 0) {
              for (h.delay = 0, h.trackTime += u.timeScale == 0 ? 0 : (d / u.timeScale + a) * h.timeScale, u.trackTime += s, this.setCurrent(l, h, !0); h.mixingFrom != null; )
                h.mixTime += a, h = h.mixingFrom;
              continue;
            }
          } else if (u.trackLast >= u.trackEnd && u.mixingFrom == null) {
            f[l] = null, this.queue.end(u), this.disposeNext(u);
            continue;
          }
          if (u.mixingFrom != null && this.updateMixingFrom(u, a)) {
            var c = u.mixingFrom;
            for (u.mixingFrom = null, c != null && (c.mixingTo = null); c != null; )
              this.queue.end(c), c = c.mixingFrom;
          }
          u.trackTime += s;
        }
      }
      this.queue.drain();
    }, r.prototype.updateMixingFrom = function(a, f) {
      var l = a.mixingFrom;
      if (l == null)
        return !0;
      var p = this.updateMixingFrom(l, f);
      return l.animationLast = l.nextAnimationLast, l.trackLast = l.nextTrackLast, a.mixTime > 0 && a.mixTime >= a.mixDuration ? ((l.totalAlpha == 0 || a.mixDuration == 0) && (a.mixingFrom = l.mixingFrom, l.mixingFrom != null && (l.mixingFrom.mixingTo = a), a.interruptAlpha = l.interruptAlpha, this.queue.end(l)), p) : (l.trackTime += f * l.timeScale, a.mixTime += f, !1);
    }, r.prototype.apply = function(a) {
      if (a == null)
        throw new Error("skeleton cannot be null.");
      this.animationsChanged && this._animationsChanged();
      for (var f = this.events, l = this.tracks, p = !1, u = 0, s = l.length; u < s; u++) {
        var h = l[u];
        if (!(h == null || h.delay > 0)) {
          p = !0;
          var d = u == 0 ? o.MixBlend.first : h.mixBlend, c = h.alpha;
          h.mixingFrom != null ? c *= this.applyMixingFrom(h, a, d) : h.trackTime >= h.trackEnd && h.next == null && (c = 0);
          var M = h.animationLast, C = h.getAnimationTime(), S = h.animation.timelines.length, L = h.animation.timelines;
          if (u == 0 && c == 1 || d == o.MixBlend.add)
            for (var E = 0; E < S; E++) {
              o.Utils.webkit602BugfixHelper(c, d);
              var A = L[E];
              A instanceof o.AttachmentTimeline ? this.applyAttachmentTimeline(A, a, C, d, !0) : A.apply(a, M, C, f, c, d, o.MixDirection.mixIn);
            }
          else {
            var g = h.timelineMode, m = h.timelinesRotation.length == 0;
            m && o.Utils.setArraySize(h.timelinesRotation, S << 1, null);
            for (var x = h.timelinesRotation, E = 0; E < S; E++) {
              var P = L[E], I = g[E] == r.SUBSEQUENT ? d : o.MixBlend.setup;
              P instanceof o.RotateTimeline ? this.applyRotateTimeline(P, a, C, c, I, x, E << 1, m) : P instanceof o.AttachmentTimeline ? this.applyAttachmentTimeline(P, a, C, d, !0) : (o.Utils.webkit602BugfixHelper(c, d), P.apply(a, M, C, f, c, I, o.MixDirection.mixIn));
            }
          }
          this.queueEvents(h, C), f.length = 0, h.nextAnimationLast = C, h.nextTrackLast = h.trackTime;
        }
      }
      for (var O = this.unkeyedState + r.SETUP, R = a.slots, D = 0, N = a.slots.length; D < N; D++) {
        var k = R[D];
        if (k.attachmentState == O) {
          var y = k.data.attachmentName;
          k.setAttachment(y == null ? null : a.getAttachment(k.data.index, y));
        }
      }
      return this.unkeyedState += 2, this.queue.drain(), p;
    }, r.prototype.applyMixingFrom = function(a, f, l) {
      var p = a.mixingFrom;
      p.mixingFrom != null && this.applyMixingFrom(p, f, l);
      var u = 0;
      a.mixDuration == 0 ? (u = 1, l == o.MixBlend.first && (l = o.MixBlend.setup)) : (u = a.mixTime / a.mixDuration, u > 1 && (u = 1), l != o.MixBlend.first && (l = p.mixBlend));
      var s = u < p.eventThreshold ? this.events : null, h = u < p.attachmentThreshold, d = u < p.drawOrderThreshold, c = p.animationLast, M = p.getAnimationTime(), C = p.animation.timelines.length, S = p.animation.timelines, L = p.alpha * a.interruptAlpha, E = L * (1 - u);
      if (l == o.MixBlend.add)
        for (var A = 0; A < C; A++)
          S[A].apply(f, c, M, s, E, l, o.MixDirection.mixOut);
      else {
        var g = p.timelineMode, m = p.timelineHoldMix, x = p.timelinesRotation.length == 0;
        x && o.Utils.setArraySize(p.timelinesRotation, C << 1, null);
        var P = p.timelinesRotation;
        p.totalAlpha = 0;
        for (var A = 0; A < C; A++) {
          var I = S[A], O = o.MixDirection.mixOut, R = void 0, D = 0;
          switch (g[A]) {
            case r.SUBSEQUENT:
              if (!d && I instanceof o.DrawOrderTimeline)
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
          p.totalAlpha += D, I instanceof o.RotateTimeline ? this.applyRotateTimeline(I, f, M, D, R, P, A << 1, x) : I instanceof o.AttachmentTimeline ? this.applyAttachmentTimeline(I, f, M, R, h) : (o.Utils.webkit602BugfixHelper(D, l), d && I instanceof o.DrawOrderTimeline && R == o.MixBlend.setup && (O = o.MixDirection.mixIn), I.apply(f, c, M, s, D, R, O));
        }
      }
      return a.mixDuration > 0 && this.queueEvents(p, M), this.events.length = 0, p.nextAnimationLast = M, p.nextTrackLast = p.trackTime, u;
    }, r.prototype.applyAttachmentTimeline = function(a, f, l, p, u) {
      var s = f.slots[a.slotIndex];
      if (s.bone.active) {
        var h = a.frames;
        if (l < h[0])
          (p == o.MixBlend.setup || p == o.MixBlend.first) && this.setAttachment(f, s, s.data.attachmentName, u);
        else {
          var d;
          l >= h[h.length - 1] ? d = h.length - 1 : d = o.Animation.binarySearch(h, l) - 1, this.setAttachment(f, s, a.attachmentNames[d], u);
        }
        s.attachmentState <= this.unkeyedState && (s.attachmentState = this.unkeyedState + r.SETUP);
      }
    }, r.prototype.setAttachment = function(a, f, l, p) {
      f.setAttachment(l == null ? null : a.getAttachment(f.data.index, l)), p && (f.attachmentState = this.unkeyedState + r.CURRENT);
    }, r.prototype.applyRotateTimeline = function(a, f, l, p, u, s, h, d) {
      if (d && (s[h] = 0), p == 1) {
        a.apply(f, 0, l, null, 1, u, o.MixDirection.mixIn);
        return;
      }
      var c = a, M = c.frames, C = f.bones[c.boneIndex];
      if (C.active) {
        var S = 0, L = 0;
        if (l < M[0])
          switch (u) {
            case o.MixBlend.setup:
              C.rotation = C.data.rotation;
            default:
              return;
            case o.MixBlend.first:
              S = C.rotation, L = C.data.rotation;
          }
        else if (S = u == o.MixBlend.setup ? C.data.rotation : C.rotation, l >= M[M.length - o.RotateTimeline.ENTRIES])
          L = C.data.rotation + M[M.length + o.RotateTimeline.PREV_ROTATION];
        else {
          var E = o.Animation.binarySearch(M, l, o.RotateTimeline.ENTRIES), A = M[E + o.RotateTimeline.PREV_ROTATION], g = M[E], m = c.getCurvePercent((E >> 1) - 1, 1 - (l - g) / (M[E + o.RotateTimeline.PREV_TIME] - g));
          L = M[E + o.RotateTimeline.ROTATION] - A, L -= (16384 - (16384.499999999996 - L / 360 | 0)) * 360, L = A + L * m + C.data.rotation, L -= (16384 - (16384.499999999996 - L / 360 | 0)) * 360;
        }
        var x = 0, P = L - S;
        if (P -= (16384 - (16384.499999999996 - P / 360 | 0)) * 360, P == 0)
          x = s[h];
        else {
          var I = 0, O = 0;
          d ? (I = 0, O = P) : (I = s[h], O = s[h + 1]);
          var R = P > 0, D = I >= 0;
          o.MathUtils.signum(O) != o.MathUtils.signum(P) && Math.abs(O) <= 90 && (Math.abs(I) > 180 && (I += 360 * o.MathUtils.signum(I)), D = R), x = P + I - I % 360, D != R && (x += 360 * o.MathUtils.signum(I)), s[h] = x;
        }
        s[h + 1] = P, S += x * p, C.rotation = S - (16384 - (16384.499999999996 - S / 360 | 0)) * 360;
      }
    }, r.prototype.queueEvents = function(a, f) {
      for (var l = a.animationStart, p = a.animationEnd, u = p - l, s = a.trackLast % u, h = this.events, d = 0, c = h.length; d < c; d++) {
        var M = h[d];
        if (M.time < s)
          break;
        M.time > p || this.queue.event(a, M);
      }
      var C = !1;
      for (a.loop ? C = u == 0 || s > a.trackTime % u : C = f >= p && a.animationLast < p, C && this.queue.complete(a); d < c; d++) {
        var S = h[d];
        S.time < l || this.queue.event(a, h[d]);
      }
    }, r.prototype.clearTracks = function() {
      var a = this.queue.drainDisabled;
      this.queue.drainDisabled = !0;
      for (var f = 0, l = this.tracks.length; f < l; f++)
        this.clearTrack(f);
      this.tracks.length = 0, this.queue.drainDisabled = a, this.queue.drain();
    }, r.prototype.clearTrack = function(a) {
      if (!(a >= this.tracks.length)) {
        var f = this.tracks[a];
        if (f != null) {
          this.queue.end(f), this.disposeNext(f);
          for (var l = f; ; ) {
            var p = l.mixingFrom;
            if (p == null)
              break;
            this.queue.end(p), l.mixingFrom = null, l.mixingTo = null, l = p;
          }
          this.tracks[f.trackIndex] = null, this.queue.drain();
        }
      }
    }, r.prototype.setCurrent = function(a, f, l) {
      var p = this.expandToIndex(a);
      this.tracks[a] = f, p != null && (l && this.queue.interrupt(p), f.mixingFrom = p, p.mixingTo = f, f.mixTime = 0, p.mixingFrom != null && p.mixDuration > 0 && (f.interruptAlpha *= Math.min(1, p.mixTime / p.mixDuration)), p.timelinesRotation.length = 0), this.queue.start(f);
    }, r.prototype.setAnimation = function(a, f, l) {
      var p = this.data.skeletonData.findAnimation(f);
      if (p == null)
        throw new Error("Animation not found: " + f);
      return this.setAnimationWith(a, p, l);
    }, r.prototype.setAnimationWith = function(a, f, l) {
      if (f == null)
        throw new Error("animation cannot be null.");
      var p = !0, u = this.expandToIndex(a);
      u != null && (u.nextTrackLast == -1 ? (this.tracks[a] = u.mixingFrom, this.queue.interrupt(u), this.queue.end(u), this.disposeNext(u), u = u.mixingFrom, p = !1) : this.disposeNext(u));
      var s = this.trackEntry(a, f, l, u);
      return this.setCurrent(a, s, p), this.queue.drain(), s;
    }, r.prototype.addAnimation = function(a, f, l, p) {
      var u = this.data.skeletonData.findAnimation(f);
      if (u == null)
        throw new Error("Animation not found: " + f);
      return this.addAnimationWith(a, u, l, p);
    }, r.prototype.addAnimationWith = function(a, f, l, p) {
      if (f == null)
        throw new Error("animation cannot be null.");
      var u = this.expandToIndex(a);
      if (u != null)
        for (; u.next != null; )
          u = u.next;
      var s = this.trackEntry(a, f, l, u);
      if (u == null)
        this.setCurrent(a, s, !0), this.queue.drain();
      else if (u.next = s, p <= 0) {
        var h = u.animationEnd - u.animationStart;
        h != 0 ? (u.loop ? p += h * (1 + (u.trackTime / h | 0)) : p += Math.max(h, u.trackTime), p -= this.data.getMix(u.animation, f)) : p = u.trackTime;
      }
      return s.delay = p, s;
    }, r.prototype.setEmptyAnimation = function(a, f) {
      var l = this.setAnimationWith(a, r.emptyAnimation, !1);
      return l.mixDuration = f, l.trackEnd = f, l;
    }, r.prototype.addEmptyAnimation = function(a, f, l) {
      l <= 0 && (l -= f);
      var p = this.addAnimationWith(a, r.emptyAnimation, !1, l);
      return p.mixDuration = f, p.trackEnd = f, p;
    }, r.prototype.setEmptyAnimations = function(a) {
      var f = this.queue.drainDisabled;
      this.queue.drainDisabled = !0;
      for (var l = 0, p = this.tracks.length; l < p; l++) {
        var u = this.tracks[l];
        u != null && this.setEmptyAnimation(u.trackIndex, a);
      }
      this.queue.drainDisabled = f, this.queue.drain();
    }, r.prototype.expandToIndex = function(a) {
      return a < this.tracks.length ? this.tracks[a] : (o.Utils.ensureArrayCapacity(this.tracks, a + 1, null), this.tracks.length = a + 1, null);
    }, r.prototype.trackEntry = function(a, f, l, p) {
      var u = this.trackEntryPool.obtain();
      return u.trackIndex = a, u.animation = f, u.loop = l, u.holdPrevious = !1, u.eventThreshold = 0, u.attachmentThreshold = 0, u.drawOrderThreshold = 0, u.animationStart = 0, u.animationEnd = f.duration, u.animationLast = -1, u.nextAnimationLast = -1, u.delay = 0, u.trackTime = 0, u.trackLast = -1, u.nextTrackLast = -1, u.trackEnd = Number.MAX_VALUE, u.timeScale = 1, u.alpha = 1, u.interruptAlpha = 1, u.mixTime = 0, u.mixDuration = p == null ? 0 : this.data.getMix(p.animation, f), u.mixBlend = o.MixBlend.replace, u;
    }, r.prototype.disposeNext = function(a) {
      for (var f = a.next; f != null; )
        this.queue.dispose(f), f = f.next;
      a.next = null;
    }, r.prototype._animationsChanged = function() {
      this.animationsChanged = !1, this.propertyIDs.clear();
      for (var a = 0, f = this.tracks.length; a < f; a++) {
        var l = this.tracks[a];
        if (l != null) {
          for (; l.mixingFrom != null; )
            l = l.mixingFrom;
          do
            (l.mixingFrom == null || l.mixBlend != o.MixBlend.add) && this.computeHold(l), l = l.mixingTo;
          while (l != null);
        }
      }
    }, r.prototype.computeHold = function(a) {
      var f = a.mixingTo, l = a.animation.timelines, p = a.animation.timelines.length, u = o.Utils.setArraySize(a.timelineMode, p);
      a.timelineHoldMix.length = 0;
      var s = o.Utils.setArraySize(a.timelineHoldMix, p), h = this.propertyIDs;
      if (f != null && f.holdPrevious) {
        for (var d = 0; d < p; d++)
          u[d] = h.add(l[d].getPropertyId()) ? r.HOLD_FIRST : r.HOLD_SUBSEQUENT;
        return;
      }
      t: for (var d = 0; d < p; d++) {
        var c = l[d], M = c.getPropertyId();
        if (!h.add(M))
          u[d] = r.SUBSEQUENT;
        else if (f == null || c instanceof o.AttachmentTimeline || c instanceof o.DrawOrderTimeline || c instanceof o.EventTimeline || !f.animation.hasTimeline(M))
          u[d] = r.FIRST;
        else {
          for (var C = f.mixingTo; C != null; C = C.mixingTo)
            if (!C.animation.hasTimeline(M)) {
              if (a.mixDuration > 0) {
                u[d] = r.HOLD_MIX, s[d] = C;
                continue t;
              }
              break;
            }
          u[d] = r.HOLD_FIRST;
        }
      }
    }, r.prototype.getCurrent = function(a) {
      return a >= this.tracks.length ? null : this.tracks[a];
    }, r.prototype.addListener = function(a) {
      if (a == null)
        throw new Error("listener cannot be null.");
      this.listeners.push(a);
    }, r.prototype.removeListener = function(a) {
      var f = this.listeners.indexOf(a);
      f >= 0 && this.listeners.splice(f, 1);
    }, r.prototype.clearListeners = function() {
      this.listeners.length = 0;
    }, r.prototype.clearListenerNotifications = function() {
      this.queue.clear();
    }, r.emptyAnimation = new o.Animation("<empty>", [], 0), r.SUBSEQUENT = 0, r.FIRST = 1, r.HOLD_SUBSEQUENT = 2, r.HOLD_FIRST = 3, r.HOLD_MIX = 4, r.SETUP = 1, r.CURRENT = 2, r;
  })();
  o.AnimationState = e;
  var v = (function() {
    function r() {
      this.mixBlend = o.MixBlend.replace, this.timelineMode = new Array(), this.timelineHoldMix = new Array(), this.timelinesRotation = new Array();
    }
    return r.prototype.reset = function() {
      this.next = null, this.mixingFrom = null, this.mixingTo = null, this.animation = null, this.listener = null, this.timelineMode.length = 0, this.timelineHoldMix.length = 0, this.timelinesRotation.length = 0;
    }, r.prototype.getAnimationTime = function() {
      if (this.loop) {
        var a = this.animationEnd - this.animationStart;
        return a == 0 ? this.animationStart : this.trackTime % a + this.animationStart;
      }
      return Math.min(this.trackTime + this.animationStart, this.animationEnd);
    }, r.prototype.setAnimationLast = function(a) {
      this.animationLast = a, this.nextAnimationLast = a;
    }, r.prototype.isComplete = function() {
      return this.trackTime >= this.animationEnd - this.animationStart;
    }, r.prototype.resetRotationDirections = function() {
      this.timelinesRotation.length = 0;
    }, r;
  })();
  o.TrackEntry = v;
  var n = (function() {
    function r(a) {
      this.objects = [], this.drainDisabled = !1, this.animState = a;
    }
    return r.prototype.start = function(a) {
      this.objects.push(t.start), this.objects.push(a), this.animState.animationsChanged = !0;
    }, r.prototype.interrupt = function(a) {
      this.objects.push(t.interrupt), this.objects.push(a);
    }, r.prototype.end = function(a) {
      this.objects.push(t.end), this.objects.push(a), this.animState.animationsChanged = !0;
    }, r.prototype.dispose = function(a) {
      this.objects.push(t.dispose), this.objects.push(a);
    }, r.prototype.complete = function(a) {
      this.objects.push(t.complete), this.objects.push(a);
    }, r.prototype.event = function(a, f) {
      this.objects.push(t.event), this.objects.push(a), this.objects.push(f);
    }, r.prototype.drain = function() {
      if (!this.drainDisabled) {
        this.drainDisabled = !0;
        for (var a = this.objects, f = this.animState.listeners, l = 0; l < a.length; l += 2) {
          var p = a[l], u = a[l + 1];
          switch (p) {
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
              var h = a[l++ + 2];
              u.listener != null && u.listener.event && u.listener.event(u, h);
              for (var s = 0; s < f.length; s++)
                f[s].event && f[s].event(u, h);
              break;
          }
        }
        this.clear(), this.drainDisabled = !1;
      }
    }, r.prototype.clear = function() {
      this.objects.length = 0;
    }, r;
  })();
  o.EventQueue = n;
  var t;
  (function(r) {
    r[r.start = 0] = "start", r[r.interrupt = 1] = "interrupt", r[r.end = 2] = "end", r[r.dispose = 3] = "dispose", r[r.complete = 4] = "complete", r[r.event = 5] = "event";
  })(t = o.EventType || (o.EventType = {}));
  var i = (function() {
    function r() {
    }
    return r.prototype.start = function(a) {
    }, r.prototype.interrupt = function(a) {
    }, r.prototype.end = function(a) {
    }, r.prototype.dispose = function(a) {
    }, r.prototype.complete = function(a) {
    }, r.prototype.event = function(a, f) {
    }, r;
  })();
  o.AnimationStateAdapter = i;
})(F || (F = {}));
var F;
(function(o) {
  var e = (function() {
    function v(n) {
      if (this.animationToMixTime = {}, this.defaultMix = 0, n == null)
        throw new Error("skeletonData cannot be null.");
      this.skeletonData = n;
    }
    return v.prototype.setMix = function(n, t, i) {
      var r = this.skeletonData.findAnimation(n);
      if (r == null)
        throw new Error("Animation not found: " + n);
      var a = this.skeletonData.findAnimation(t);
      if (a == null)
        throw new Error("Animation not found: " + t);
      this.setMixWith(r, a, i);
    }, v.prototype.setMixWith = function(n, t, i) {
      if (n == null)
        throw new Error("from cannot be null.");
      if (t == null)
        throw new Error("to cannot be null.");
      var r = n.name + "." + t.name;
      this.animationToMixTime[r] = i;
    }, v.prototype.getMix = function(n, t) {
      var i = n.name + "." + t.name, r = this.animationToMixTime[i];
      return r === void 0 ? this.defaultMix : r;
    }, v;
  })();
  o.AnimationStateData = e;
})(F || (F = {}));
var F;
(function(o) {
  var e = (function() {
    function v(n, t) {
      t === void 0 && (t = ""), this.assets = {}, this.errors = {}, this.toLoad = 0, this.loaded = 0, this.rawDataUris = {}, this.textureLoader = n, this.pathPrefix = t;
    }
    return v.prototype.downloadText = function(n, t, i) {
      var r = new XMLHttpRequest();
      r.overrideMimeType("text/html"), this.rawDataUris[n] && (n = this.rawDataUris[n]), r.open("GET", n, !0), r.onload = function() {
        r.status == 200 ? t(r.responseText) : i(r.status, r.responseText);
      }, r.onerror = function() {
        console.log("Error downloading: " + n), i(r.status, r.responseText);
      }, r.send();
    }, v.prototype.downloadBinary = function(n, t, i) {
      var r = new XMLHttpRequest();
      this.rawDataUris[n] && (n = this.rawDataUris[n]), r.open("GET", n, !0), r.responseType = "arraybuffer", r.onload = function() {
        r.status == 200 ? t(new Uint8Array(r.response)) : i(r.status, r.responseText);
      }, r.onerror = function() {
        i(r.status, r.responseText);
      }, r.send();
    }, v.prototype.setRawDataURI = function(n, t) {
      this.rawDataUris[this.pathPrefix + n] = t;
    }, v.prototype.loadBinary = function(n, t, i) {
      var r = this;
      t === void 0 && (t = null), i === void 0 && (i = null), n = this.pathPrefix + n, this.toLoad++, this.downloadBinary(n, function(a) {
        r.assets[n] = a, t && t(n, a), r.toLoad--, r.loaded++;
      }, function(a, f) {
        r.errors[n] = "Couldn't load binary " + n + ": status " + status + ", " + f, i && i(n, "Couldn't load binary " + n + ": status " + status + ", " + f), r.toLoad--, r.loaded++;
      });
    }, v.prototype.loadText = function(n, t, i) {
      var r = this;
      t === void 0 && (t = null), i === void 0 && (i = null), n = this.pathPrefix + n, this.toLoad++, this.downloadText(n, function(a) {
        r.assets[n] = a, t && t(n, a), r.toLoad--, r.loaded++;
      }, function(a, f) {
        r.errors[n] = "Couldn't load text " + n + ": status " + status + ", " + f, i && i(n, "Couldn't load text " + n + ": status " + status + ", " + f), r.toLoad--, r.loaded++;
      });
    }, v.prototype.loadTexture = function(n, t, i) {
      var r = this;
      t === void 0 && (t = null), i === void 0 && (i = null), n = this.pathPrefix + n;
      var a = n;
      this.toLoad++;
      var f = new Image();
      f.crossOrigin = "anonymous", f.onload = function(l) {
        var p = r.textureLoader(f);
        r.assets[a] = p, r.toLoad--, r.loaded++, t && t(n, f);
      }, f.onerror = function(l) {
        r.errors[n] = "Couldn't load image " + n, r.toLoad--, r.loaded++, i && i(n, "Couldn't load image " + n);
      }, this.rawDataUris[n] && (n = this.rawDataUris[n]), f.src = n;
    }, v.prototype.loadTextureAtlas = function(n, t, i) {
      var r = this;
      t === void 0 && (t = null), i === void 0 && (i = null);
      var a = n.lastIndexOf("/") >= 0 ? n.substring(0, n.lastIndexOf("/")) : "";
      n = this.pathPrefix + n, this.toLoad++, this.downloadText(n, function(f) {
        var l = { count: 0 }, p = new Array();
        try {
          var u = new o.TextureAtlas(f, function(C) {
            p.push(a == "" ? C : a + "/" + C);
            var S = document.createElement("img");
            return S.width = 16, S.height = 16, new o.FakeTexture(S);
          });
        } catch (C) {
          var s = C;
          r.errors[n] = "Couldn't load texture atlas " + n + ": " + s.message, i && i(n, "Couldn't load texture atlas " + n + ": " + s.message), r.toLoad--, r.loaded++;
          return;
        }
        for (var h = function(C) {
          var S = !1;
          r.loadTexture(C, function(L, E) {
            if (l.count++, l.count == p.length)
              if (S)
                r.errors[n] = "Couldn't load texture atlas page " + L + "} of atlas " + n, i && i(n, "Couldn't load texture atlas page " + L + " of atlas " + n), r.toLoad--, r.loaded++;
              else
                try {
                  var A = new o.TextureAtlas(f, function(m) {
                    return r.get(a == "" ? m : a + "/" + m);
                  });
                  r.assets[n] = A, t && t(n, A), r.toLoad--, r.loaded++;
                } catch (m) {
                  var g = m;
                  r.errors[n] = "Couldn't load texture atlas " + n + ": " + g.message, i && i(n, "Couldn't load texture atlas " + n + ": " + g.message), r.toLoad--, r.loaded++;
                }
          }, function(L, E) {
            S = !0, l.count++, l.count == p.length && (r.errors[n] = "Couldn't load texture atlas page " + L + "} of atlas " + n, i && i(n, "Couldn't load texture atlas page " + L + " of atlas " + n), r.toLoad--, r.loaded++);
          });
        }, d = 0, c = p; d < c.length; d++) {
          var M = c[d];
          h(M);
        }
      }, function(f, l) {
        r.errors[n] = "Couldn't load texture atlas " + n + ": status " + status + ", " + l, i && i(n, "Couldn't load texture atlas " + n + ": status " + status + ", " + l), r.toLoad--, r.loaded++;
      });
    }, v.prototype.get = function(n) {
      return n = this.pathPrefix + n, this.assets[n];
    }, v.prototype.remove = function(n) {
      n = this.pathPrefix + n;
      var t = this.assets[n];
      t.dispose && t.dispose(), this.assets[n] = null;
    }, v.prototype.removeAll = function() {
      for (var n in this.assets) {
        var t = this.assets[n];
        t.dispose && t.dispose();
      }
      this.assets = {};
    }, v.prototype.isLoadingComplete = function() {
      return this.toLoad == 0;
    }, v.prototype.getToLoad = function() {
      return this.toLoad;
    }, v.prototype.getLoaded = function() {
      return this.loaded;
    }, v.prototype.dispose = function() {
      this.removeAll();
    }, v.prototype.hasErrors = function() {
      return Object.keys(this.errors).length > 0;
    }, v.prototype.getErrors = function() {
      return this.errors;
    }, v;
  })();
  o.AssetManager = e;
})(F || (F = {}));
var F;
(function(o) {
  var e = (function() {
    function v(n) {
      this.atlas = n;
    }
    return v.prototype.newRegionAttachment = function(n, t, i) {
      var r = this.atlas.findRegion(i);
      if (r == null)
        throw new Error("Region not found in atlas: " + i + " (region attachment: " + t + ")");
      r.renderObject = r;
      var a = new o.RegionAttachment(t);
      return a.setRegion(r), a;
    }, v.prototype.newMeshAttachment = function(n, t, i) {
      var r = this.atlas.findRegion(i);
      if (r == null)
        throw new Error("Region not found in atlas: " + i + " (mesh attachment: " + t + ")");
      r.renderObject = r;
      var a = new o.MeshAttachment(t);
      return a.region = r, a;
    }, v.prototype.newBoundingBoxAttachment = function(n, t) {
      return new o.BoundingBoxAttachment(t);
    }, v.prototype.newPathAttachment = function(n, t) {
      return new o.PathAttachment(t);
    }, v.prototype.newPointAttachment = function(n, t) {
      return new o.PointAttachment(t);
    }, v.prototype.newClippingAttachment = function(n, t) {
      return new o.ClippingAttachment(t);
    }, v;
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
    function v(n, t, i) {
      if (this.children = new Array(), this.x = 0, this.y = 0, this.rotation = 0, this.scaleX = 0, this.scaleY = 0, this.shearX = 0, this.shearY = 0, this.ax = 0, this.ay = 0, this.arotation = 0, this.ascaleX = 0, this.ascaleY = 0, this.ashearX = 0, this.ashearY = 0, this.appliedValid = !1, this.a = 0, this.b = 0, this.c = 0, this.d = 0, this.worldY = 0, this.worldX = 0, this.sorted = !1, this.active = !1, n == null)
        throw new Error("data cannot be null.");
      if (t == null)
        throw new Error("skeleton cannot be null.");
      this.data = n, this.skeleton = t, this.parent = i, this.setToSetupPose();
    }
    return v.prototype.isActive = function() {
      return this.active;
    }, v.prototype.update = function() {
      this.updateWorldTransformWith(this.x, this.y, this.rotation, this.scaleX, this.scaleY, this.shearX, this.shearY);
    }, v.prototype.updateWorldTransform = function() {
      this.updateWorldTransformWith(this.x, this.y, this.rotation, this.scaleX, this.scaleY, this.shearX, this.shearY);
    }, v.prototype.updateWorldTransformWith = function(n, t, i, r, a, f, l) {
      this.ax = n, this.ay = t, this.arotation = i, this.ascaleX = r, this.ascaleY = a, this.ashearX = f, this.ashearY = l, this.appliedValid = !0;
      var p = this.parent;
      if (p == null) {
        var u = this.skeleton, s = i + 90 + l, h = u.scaleX, d = u.scaleY;
        this.a = o.MathUtils.cosDeg(i + f) * r * h, this.b = o.MathUtils.cosDeg(s) * a * h, this.c = o.MathUtils.sinDeg(i + f) * r * d, this.d = o.MathUtils.sinDeg(s) * a * d, this.worldX = n * h + u.x, this.worldY = t * d + u.y;
        return;
      }
      var c = p.a, M = p.b, C = p.c, S = p.d;
      switch (this.worldX = c * n + M * t + p.worldX, this.worldY = C * n + S * t + p.worldY, this.data.transformMode) {
        case o.TransformMode.Normal: {
          var s = i + 90 + l, L = o.MathUtils.cosDeg(i + f) * r, E = o.MathUtils.cosDeg(s) * a, A = o.MathUtils.sinDeg(i + f) * r, g = o.MathUtils.sinDeg(s) * a;
          this.a = c * L + M * A, this.b = c * E + M * g, this.c = C * L + S * A, this.d = C * E + S * g;
          return;
        }
        case o.TransformMode.OnlyTranslation: {
          var s = i + 90 + l;
          this.a = o.MathUtils.cosDeg(i + f) * r, this.b = o.MathUtils.cosDeg(s) * a, this.c = o.MathUtils.sinDeg(i + f) * r, this.d = o.MathUtils.sinDeg(s) * a;
          break;
        }
        case o.TransformMode.NoRotationOrReflection: {
          var m = c * c + C * C, x = 0;
          m > 1e-4 ? (m = Math.abs(c * S - M * C) / m, c /= this.skeleton.scaleX, C /= this.skeleton.scaleY, M = C * m, S = c * m, x = Math.atan2(C, c) * o.MathUtils.radDeg) : (c = 0, C = 0, x = 90 - Math.atan2(S, M) * o.MathUtils.radDeg);
          var P = i + f - x, I = i + l - x + 90, L = o.MathUtils.cosDeg(P) * r, E = o.MathUtils.cosDeg(I) * a, A = o.MathUtils.sinDeg(P) * r, g = o.MathUtils.sinDeg(I) * a;
          this.a = c * L - M * A, this.b = c * E - M * g, this.c = C * L + S * A, this.d = C * E + S * g;
          break;
        }
        case o.TransformMode.NoScale:
        case o.TransformMode.NoScaleOrReflection: {
          var O = o.MathUtils.cosDeg(i), R = o.MathUtils.sinDeg(i), D = (c * O + M * R) / this.skeleton.scaleX, N = (C * O + S * R) / this.skeleton.scaleY, m = Math.sqrt(D * D + N * N);
          m > 1e-5 && (m = 1 / m), D *= m, N *= m, m = Math.sqrt(D * D + N * N), this.data.transformMode == o.TransformMode.NoScale && c * S - M * C < 0 != (this.skeleton.scaleX < 0 != this.skeleton.scaleY < 0) && (m = -m);
          var k = Math.PI / 2 + Math.atan2(N, D), y = Math.cos(k) * m, T = Math.sin(k) * m, L = o.MathUtils.cosDeg(f) * r, E = o.MathUtils.cosDeg(90 + l) * a, A = o.MathUtils.sinDeg(f) * r, g = o.MathUtils.sinDeg(90 + l) * a;
          this.a = D * L + y * A, this.b = D * E + y * g, this.c = N * L + T * A, this.d = N * E + T * g;
          break;
        }
      }
      this.a *= this.skeleton.scaleX, this.b *= this.skeleton.scaleX, this.c *= this.skeleton.scaleY, this.d *= this.skeleton.scaleY;
    }, v.prototype.setToSetupPose = function() {
      var n = this.data;
      this.x = n.x, this.y = n.y, this.rotation = n.rotation, this.scaleX = n.scaleX, this.scaleY = n.scaleY, this.shearX = n.shearX, this.shearY = n.shearY;
    }, v.prototype.getWorldRotationX = function() {
      return Math.atan2(this.c, this.a) * o.MathUtils.radDeg;
    }, v.prototype.getWorldRotationY = function() {
      return Math.atan2(this.d, this.b) * o.MathUtils.radDeg;
    }, v.prototype.getWorldScaleX = function() {
      return Math.sqrt(this.a * this.a + this.c * this.c);
    }, v.prototype.getWorldScaleY = function() {
      return Math.sqrt(this.b * this.b + this.d * this.d);
    }, v.prototype.updateAppliedTransform = function() {
      this.appliedValid = !0;
      var n = this.parent;
      if (n == null) {
        this.ax = this.worldX, this.ay = this.worldY, this.arotation = Math.atan2(this.c, this.a) * o.MathUtils.radDeg, this.ascaleX = Math.sqrt(this.a * this.a + this.c * this.c), this.ascaleY = Math.sqrt(this.b * this.b + this.d * this.d), this.ashearX = 0, this.ashearY = Math.atan2(this.a * this.b + this.c * this.d, this.a * this.d - this.b * this.c) * o.MathUtils.radDeg;
        return;
      }
      var t = n.a, i = n.b, r = n.c, a = n.d, f = 1 / (t * a - i * r), l = this.worldX - n.worldX, p = this.worldY - n.worldY;
      this.ax = l * a * f - p * i * f, this.ay = p * t * f - l * r * f;
      var u = f * a, s = f * t, h = f * i, d = f * r, c = u * this.a - h * this.c, M = u * this.b - h * this.d, C = s * this.c - d * this.a, S = s * this.d - d * this.b;
      if (this.ashearX = 0, this.ascaleX = Math.sqrt(c * c + C * C), this.ascaleX > 1e-4) {
        var L = c * S - M * C;
        this.ascaleY = L / this.ascaleX, this.ashearY = Math.atan2(c * M + C * S, L) * o.MathUtils.radDeg, this.arotation = Math.atan2(C, c) * o.MathUtils.radDeg;
      } else
        this.ascaleX = 0, this.ascaleY = Math.sqrt(M * M + S * S), this.ashearY = 0, this.arotation = 90 - Math.atan2(S, M) * o.MathUtils.radDeg;
    }, v.prototype.worldToLocal = function(n) {
      var t = this.a, i = this.b, r = this.c, a = this.d, f = 1 / (t * a - i * r), l = n.x - this.worldX, p = n.y - this.worldY;
      return n.x = l * a * f - p * i * f, n.y = p * t * f - l * r * f, n;
    }, v.prototype.localToWorld = function(n) {
      var t = n.x, i = n.y;
      return n.x = t * this.a + i * this.b + this.worldX, n.y = t * this.c + i * this.d + this.worldY, n;
    }, v.prototype.worldToLocalRotation = function(n) {
      var t = o.MathUtils.sinDeg(n), i = o.MathUtils.cosDeg(n);
      return Math.atan2(this.a * t - this.c * i, this.d * i - this.b * t) * o.MathUtils.radDeg + this.rotation - this.shearX;
    }, v.prototype.localToWorldRotation = function(n) {
      n -= this.rotation - this.shearX;
      var t = o.MathUtils.sinDeg(n), i = o.MathUtils.cosDeg(n);
      return Math.atan2(i * this.c + t * this.d, i * this.a + t * this.b) * o.MathUtils.radDeg;
    }, v.prototype.rotateWorld = function(n) {
      var t = this.a, i = this.b, r = this.c, a = this.d, f = o.MathUtils.cosDeg(n), l = o.MathUtils.sinDeg(n);
      this.a = f * t - l * r, this.b = f * i - l * a, this.c = l * t + f * r, this.d = l * i + f * a, this.appliedValid = !1;
    }, v;
  })();
  o.Bone = e;
})(F || (F = {}));
var F;
(function(o) {
  var e = /* @__PURE__ */ (function() {
    function n(t, i, r) {
      if (this.x = 0, this.y = 0, this.rotation = 0, this.scaleX = 1, this.scaleY = 1, this.shearX = 0, this.shearY = 0, this.transformMode = v.Normal, this.skinRequired = !1, this.color = new o.Color(), t < 0)
        throw new Error("index must be >= 0.");
      if (i == null)
        throw new Error("name cannot be null.");
      this.index = t, this.name = i, this.parent = r;
    }
    return n;
  })();
  o.BoneData = e;
  var v;
  (function(n) {
    n[n.Normal = 0] = "Normal", n[n.OnlyTranslation = 1] = "OnlyTranslation", n[n.NoRotationOrReflection = 2] = "NoRotationOrReflection", n[n.NoScale = 3] = "NoScale", n[n.NoScaleOrReflection = 4] = "NoScaleOrReflection";
  })(v = o.TransformMode || (o.TransformMode = {}));
})(F || (F = {}));
var F;
(function(o) {
  var e = /* @__PURE__ */ (function() {
    function v(n, t, i) {
      this.name = n, this.order = t, this.skinRequired = i;
    }
    return v;
  })();
  o.ConstraintData = e;
})(F || (F = {}));
var F;
(function(o) {
  var e = /* @__PURE__ */ (function() {
    function v(n, t) {
      if (t == null)
        throw new Error("data cannot be null.");
      this.time = n, this.data = t;
    }
    return v;
  })();
  o.Event = e;
})(F || (F = {}));
var F;
(function(o) {
  var e = /* @__PURE__ */ (function() {
    function v(n) {
      this.name = n;
    }
    return v;
  })();
  o.EventData = e;
})(F || (F = {}));
var F;
(function(o) {
  var e = (function() {
    function v(n, t) {
      if (this.bendDirection = 0, this.compress = !1, this.stretch = !1, this.mix = 1, this.softness = 0, this.active = !1, n == null)
        throw new Error("data cannot be null.");
      if (t == null)
        throw new Error("skeleton cannot be null.");
      this.data = n, this.mix = n.mix, this.softness = n.softness, this.bendDirection = n.bendDirection, this.compress = n.compress, this.stretch = n.stretch, this.bones = new Array();
      for (var i = 0; i < n.bones.length; i++)
        this.bones.push(t.findBone(n.bones[i].name));
      this.target = t.findBone(n.target.name);
    }
    return v.prototype.isActive = function() {
      return this.active;
    }, v.prototype.apply = function() {
      this.update();
    }, v.prototype.update = function() {
      var n = this.target, t = this.bones;
      switch (t.length) {
        case 1:
          this.apply1(t[0], n.worldX, n.worldY, this.compress, this.stretch, this.data.uniform, this.mix);
          break;
        case 2:
          this.apply2(t[0], t[1], n.worldX, n.worldY, this.bendDirection, this.stretch, this.softness, this.mix);
          break;
      }
    }, v.prototype.apply1 = function(n, t, i, r, a, f, l) {
      n.appliedValid || n.updateAppliedTransform();
      var p = n.parent, u = p.a, s = p.b, h = p.c, d = p.d, c = -n.ashearX - n.arotation, M = 0, C = 0;
      switch (n.data.transformMode) {
        case o.TransformMode.OnlyTranslation:
          M = t - n.worldX, C = i - n.worldY;
          break;
        case o.TransformMode.NoRotationOrReflection:
          var S = Math.abs(u * d - s * h) / (u * u + h * h), L = u / n.skeleton.scaleX, E = h / n.skeleton.scaleY;
          s = -E * S * n.skeleton.scaleX, d = L * S * n.skeleton.scaleY, c += Math.atan2(E, L) * o.MathUtils.radDeg;
        default:
          var A = t - p.worldX, g = i - p.worldY, m = u * d - s * h;
          M = (A * d - g * s) / m - n.ax, C = (g * u - A * h) / m - n.ay;
      }
      c += Math.atan2(C, M) * o.MathUtils.radDeg, n.ascaleX < 0 && (c += 180), c > 180 ? c -= 360 : c < -180 && (c += 360);
      var x = n.ascaleX, P = n.ascaleY;
      if (r || a) {
        switch (n.data.transformMode) {
          case o.TransformMode.NoScale:
          case o.TransformMode.NoScaleOrReflection:
            M = t - n.worldX, C = i - n.worldY;
        }
        var I = n.data.length * x, O = Math.sqrt(M * M + C * C);
        if (r && O < I || a && O > I && I > 1e-4) {
          var S = (O / I - 1) * l + 1;
          x *= S, f && (P *= S);
        }
      }
      n.updateWorldTransformWith(n.ax, n.ay, n.arotation + c * l, x, P, n.ashearX, n.ashearY);
    }, v.prototype.apply2 = function(n, t, i, r, a, f, l, p) {
      if (p == 0) {
        t.updateWorldTransform();
        return;
      }
      n.appliedValid || n.updateAppliedTransform(), t.appliedValid || t.updateAppliedTransform();
      var u = n.ax, s = n.ay, h = n.ascaleX, d = h, c = n.ascaleY, M = t.ascaleX, C = 0, S = 0, L = 0;
      h < 0 ? (h = -h, C = 180, L = -1) : (C = 0, L = 1), c < 0 && (c = -c, L = -L), M < 0 ? (M = -M, S = 180) : S = 0;
      var E = t.ax, A = 0, g = 0, m = 0, x = n.a, P = n.b, I = n.c, O = n.d, R = Math.abs(h - c) <= 1e-4;
      R ? (A = t.ay, g = x * E + P * A + n.worldX, m = I * E + O * A + n.worldY) : (A = 0, g = x * E + n.worldX, m = I * E + n.worldY);
      var D = n.parent;
      x = D.a, P = D.b, I = D.c, O = D.d;
      var N = 1 / (x * O - P * I), k = g - D.worldX, y = m - D.worldY, T = (k * O - y * P) * N - u, B = (y * x - k * I) * N - s, V = Math.sqrt(T * T + B * B), G = t.data.length * M, Y, X;
      if (V < 1e-4) {
        this.apply1(n, i, r, !1, f, !1, p), t.updateWorldTransformWith(E, A, 0, t.ascaleX, t.ascaleY, t.ashearX, t.ashearY);
        return;
      }
      k = i - D.worldX, y = r - D.worldY;
      var _ = (k * O - y * P) * N - u, W = (y * x - k * I) * N - s, U = _ * _ + W * W;
      if (l != 0) {
        l *= h * (M + 1) / 2;
        var w = Math.sqrt(U), Z = w - V - G * h + l;
        if (Z > 0) {
          var z = Math.min(1, Z / (l * 2)) - 1;
          z = (Z - l * (1 - z * z)) / w, _ -= z * _, W -= z * W, U = _ * _ + W * W;
        }
      }
      t: if (R) {
        G *= h;
        var j = (U - V * V - G * G) / (2 * V * G);
        j < -1 ? j = -1 : j > 1 && (j = 1, f && (d *= (Math.sqrt(U) / (V + G) - 1) * p + 1)), X = Math.acos(j) * a, x = V + G * j, P = G * Math.sin(X), Y = Math.atan2(W * x - _ * P, _ * x + W * P);
      } else {
        x = h * G, P = c * G;
        var H = x * x, J = P * P, tt = Math.atan2(W, _);
        I = J * V * V + H * U - H * J;
        var q = -2 * J * V, at = J - H;
        if (O = q * q - 4 * at * I, O >= 0) {
          var nt = Math.sqrt(O);
          q < 0 && (nt = -nt), nt = -(q + nt) / 2;
          var ct = nt / at, ut = I / nt, st = Math.abs(ct) < Math.abs(ut) ? ct : ut;
          if (st * st <= U) {
            y = Math.sqrt(U - st * st) * a, Y = tt - Math.atan2(y, st), X = Math.atan2(y / c, (st - V) / h);
            break t;
          }
        }
        var ft = o.MathUtils.PI, ot = V - x, ht = ot * ot, it = 0, xt = 0, Mt = V + x, kt = Mt * Mt, yt = 0;
        I = -x * V / (H - J), I >= -1 && I <= 1 && (I = Math.acos(I), k = x * Math.cos(I) + V, y = P * Math.sin(I), O = k * k + y * y, O < ht && (ft = I, ht = O, ot = k, it = y), O > kt && (xt = I, kt = O, Mt = k, yt = y)), U <= (ht + kt) / 2 ? (Y = tt - Math.atan2(it * a, ot), X = ft * a) : (Y = tt - Math.atan2(yt * a, Mt), X = xt * a);
      }
      var Et = Math.atan2(A, E) * L, vt = n.arotation;
      Y = (Y - Et) * o.MathUtils.radDeg + C - vt, Y > 180 ? Y -= 360 : Y < -180 && (Y += 360), n.updateWorldTransformWith(u, s, vt + Y * p, d, n.ascaleY, 0, 0), vt = t.arotation, X = ((X + Et) * o.MathUtils.radDeg - t.ashearX) * L + S - vt, X > 180 ? X -= 360 : X < -180 && (X += 360), t.updateWorldTransformWith(E, A, vt + X * p, t.ascaleX, t.ascaleY, t.ashearX, t.ashearY);
    }, v;
  })();
  o.IkConstraint = e;
})(F || (F = {}));
var F;
(function(o) {
  var e = (function(v) {
    $(n, v);
    function n(t) {
      var i = v.call(this, t, 0, !1) || this;
      return i.bones = new Array(), i.bendDirection = 1, i.compress = !1, i.stretch = !1, i.uniform = !1, i.mix = 1, i.softness = 0, i;
    }
    return n;
  })(o.ConstraintData);
  o.IkConstraintData = e;
})(F || (F = {}));
var F;
(function(o) {
  var e = (function() {
    function v(n, t) {
      if (this.position = 0, this.spacing = 0, this.rotateMix = 0, this.translateMix = 0, this.spaces = new Array(), this.positions = new Array(), this.world = new Array(), this.curves = new Array(), this.lengths = new Array(), this.segments = new Array(), this.active = !1, n == null)
        throw new Error("data cannot be null.");
      if (t == null)
        throw new Error("skeleton cannot be null.");
      this.data = n, this.bones = new Array();
      for (var i = 0, r = n.bones.length; i < r; i++)
        this.bones.push(t.findBone(n.bones[i].name));
      this.target = t.findSlot(n.target.name), this.position = n.position, this.spacing = n.spacing, this.rotateMix = n.rotateMix, this.translateMix = n.translateMix;
    }
    return v.prototype.isActive = function() {
      return this.active;
    }, v.prototype.apply = function() {
      this.update();
    }, v.prototype.update = function() {
      var n = this.target.getAttachment();
      if (n instanceof o.PathAttachment) {
        var t = this.rotateMix, i = this.translateMix, r = i > 0, a = t > 0;
        if (!(!r && !a)) {
          var f = this.data, l = f.spacingMode == o.SpacingMode.Percent, p = f.rotateMode, u = p == o.RotateMode.Tangent, s = p == o.RotateMode.ChainScale, h = this.bones.length, d = u ? h : h + 1, c = this.bones, M = o.Utils.setArraySize(this.spaces, d), C = null, S = this.spacing;
          if (s || !l) {
            s && (C = o.Utils.setArraySize(this.lengths, h));
            for (var L = f.spacingMode == o.SpacingMode.Length, E = 0, A = d - 1; E < A; ) {
              var g = c[E], m = g.data.length;
              if (m < v.epsilon)
                s && (C[E] = 0), M[++E] = 0;
              else if (l) {
                if (s) {
                  var x = m * g.a, P = m * g.c, I = Math.sqrt(x * x + P * P);
                  C[E] = I;
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
          var R = this.computeWorldPositions(n, d, u, f.positionMode == o.PositionMode.Percent, l), D = R[0], N = R[1], k = f.offsetRotation, y = !1;
          if (k == 0)
            y = p == o.RotateMode.Chain;
          else {
            y = !1;
            var T = this.target.bone;
            k *= T.a * T.d - T.b * T.c > 0 ? o.MathUtils.degRad : -o.MathUtils.degRad;
          }
          for (var E = 0, T = 3; E < h; E++, T += 3) {
            var g = c[E];
            g.worldX += (D - g.worldX) * i, g.worldY += (N - g.worldY) * i;
            var x = R[T], P = R[T + 1], B = x - D, V = P - N;
            if (s) {
              var G = C[E];
              if (G != 0) {
                var Y = (Math.sqrt(B * B + V * V) / G - 1) * t + 1;
                g.a *= Y, g.c *= Y;
              }
            }
            if (D = x, N = P, a) {
              var X = g.a, _ = g.b, W = g.c, U = g.d, w = 0, Z = 0, z = 0;
              if (u ? w = R[T - 1] : M[E + 1] == 0 ? w = R[T + 2] : w = Math.atan2(V, B), w -= Math.atan2(W, X), y) {
                Z = Math.cos(w), z = Math.sin(w);
                var j = g.data.length;
                D += (j * (Z * X - z * W) - B) * t, N += (j * (z * X + Z * W) - V) * t;
              } else
                w += k;
              w > o.MathUtils.PI ? w -= o.MathUtils.PI2 : w < -o.MathUtils.PI && (w += o.MathUtils.PI2), w *= t, Z = Math.cos(w), z = Math.sin(w), g.a = Z * X - z * W, g.b = Z * _ - z * U, g.c = z * X + Z * W, g.d = z * _ + Z * U;
            }
            g.appliedValid = !1;
          }
        }
      }
    }, v.prototype.computeWorldPositions = function(n, t, i, r, a) {
      var f = this.target, l = this.position, p = this.spaces, u = o.Utils.setArraySize(this.positions, t * 3 + 2), s = null, h = n.closed, d = n.worldVerticesLength, c = d / 6, M = v.NONE;
      if (!n.constantSpeed) {
        var C = n.lengths;
        c -= h ? 1 : 2;
        var S = C[c];
        if (r && (l *= S), a)
          for (var L = 1; L < t; L++)
            p[L] *= S;
        s = o.Utils.setArraySize(this.world, 8);
        for (var L = 0, E = 0, A = 0; L < t; L++, E += 3) {
          var g = p[L];
          l += g;
          var m = l;
          if (h)
            m %= S, m < 0 && (m += S), A = 0;
          else if (m < 0) {
            M != v.BEFORE && (M = v.BEFORE, n.computeWorldVertices(f, 2, 4, s, 0, 2)), this.addBeforePosition(m, s, 0, u, E);
            continue;
          } else if (m > S) {
            M != v.AFTER && (M = v.AFTER, n.computeWorldVertices(f, d - 6, 4, s, 0, 2)), this.addAfterPosition(m - S, s, 0, u, E);
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
          A != M && (M = A, h && A == c ? (n.computeWorldVertices(f, d - 4, 4, s, 0, 2), n.computeWorldVertices(f, 0, 4, s, 4, 2)) : n.computeWorldVertices(f, A * 6 + 2, 8, s, 0, 2)), this.addCurvePosition(m, s[0], s[1], s[2], s[3], s[4], s[5], s[6], s[7], u, E, i || L > 0 && g == 0);
        }
        return u;
      }
      h ? (d += 2, s = o.Utils.setArraySize(this.world, d), n.computeWorldVertices(f, 2, d - 4, s, 0, 2), n.computeWorldVertices(f, 0, 2, s, d - 4, 2), s[d - 2] = s[0], s[d - 1] = s[1]) : (c--, d -= 4, s = o.Utils.setArraySize(this.world, d), n.computeWorldVertices(f, 2, d, s, 0, 2));
      for (var I = o.Utils.setArraySize(this.curves, c), O = 0, R = s[0], D = s[1], N = 0, k = 0, y = 0, T = 0, B = 0, V = 0, G = 0, Y = 0, X = 0, _ = 0, W = 0, U = 0, w = 0, Z = 0, L = 0, z = 2; L < c; L++, z += 6)
        N = s[z], k = s[z + 1], y = s[z + 2], T = s[z + 3], B = s[z + 4], V = s[z + 5], G = (R - N * 2 + y) * 0.1875, Y = (D - k * 2 + T) * 0.1875, X = ((N - y) * 3 - R + B) * 0.09375, _ = ((k - T) * 3 - D + V) * 0.09375, W = G * 2 + X, U = Y * 2 + _, w = (N - R) * 0.75 + G + X * 0.16666667, Z = (k - D) * 0.75 + Y + _ * 0.16666667, O += Math.sqrt(w * w + Z * Z), w += W, Z += U, W += X, U += _, O += Math.sqrt(w * w + Z * Z), w += W, Z += U, O += Math.sqrt(w * w + Z * Z), w += W + X, Z += U + _, O += Math.sqrt(w * w + Z * Z), I[L] = O, R = B, D = V;
      if (r ? l *= O : l *= O / n.lengths[c - 1], a)
        for (var L = 1; L < t; L++)
          p[L] *= O;
      for (var j = this.segments, H = 0, L = 0, E = 0, A = 0, J = 0; L < t; L++, E += 3) {
        var g = p[L];
        l += g;
        var m = l;
        if (h)
          m %= O, m < 0 && (m += O), A = 0;
        else if (m < 0) {
          this.addBeforePosition(m, s, 0, u, E);
          continue;
        } else if (m > O) {
          this.addAfterPosition(m - O, s, d - 4, u, E);
          continue;
        }
        for (; ; A++) {
          var tt = I[A];
          if (!(m > tt)) {
            if (A == 0)
              m /= tt;
            else {
              var P = I[A - 1];
              m = (m - P) / (tt - P);
            }
            break;
          }
        }
        if (A != M) {
          M = A;
          var q = A * 6;
          for (R = s[q], D = s[q + 1], N = s[q + 2], k = s[q + 3], y = s[q + 4], T = s[q + 5], B = s[q + 6], V = s[q + 7], G = (R - N * 2 + y) * 0.03, Y = (D - k * 2 + T) * 0.03, X = ((N - y) * 3 - R + B) * 6e-3, _ = ((k - T) * 3 - D + V) * 6e-3, W = G * 2 + X, U = Y * 2 + _, w = (N - R) * 0.3 + G + X * 0.16666667, Z = (k - D) * 0.3 + Y + _ * 0.16666667, H = Math.sqrt(w * w + Z * Z), j[0] = H, q = 1; q < 8; q++)
            w += W, Z += U, W += X, U += _, H += Math.sqrt(w * w + Z * Z), j[q] = H;
          w += W, Z += U, H += Math.sqrt(w * w + Z * Z), j[8] = H, w += W + X, Z += U + _, H += Math.sqrt(w * w + Z * Z), j[9] = H, J = 0;
        }
        for (m *= H; ; J++) {
          var at = j[J];
          if (!(m > at)) {
            if (J == 0)
              m /= at;
            else {
              var P = j[J - 1];
              m = J + (m - P) / (at - P);
            }
            break;
          }
        }
        this.addCurvePosition(m * 0.1, R, D, N, k, y, T, B, V, u, E, i || L > 0 && g == 0);
      }
      return u;
    }, v.prototype.addBeforePosition = function(n, t, i, r, a) {
      var f = t[i], l = t[i + 1], p = t[i + 2] - f, u = t[i + 3] - l, s = Math.atan2(u, p);
      r[a] = f + n * Math.cos(s), r[a + 1] = l + n * Math.sin(s), r[a + 2] = s;
    }, v.prototype.addAfterPosition = function(n, t, i, r, a) {
      var f = t[i + 2], l = t[i + 3], p = f - t[i], u = l - t[i + 1], s = Math.atan2(u, p);
      r[a] = f + n * Math.cos(s), r[a + 1] = l + n * Math.sin(s), r[a + 2] = s;
    }, v.prototype.addCurvePosition = function(n, t, i, r, a, f, l, p, u, s, h, d) {
      if (n == 0 || isNaN(n)) {
        s[h] = t, s[h + 1] = i, s[h + 2] = Math.atan2(a - i, r - t);
        return;
      }
      var c = n * n, M = c * n, C = 1 - n, S = C * C, L = S * C, E = C * n, A = E * 3, g = C * A, m = A * n, x = t * L + r * g + f * m + p * M, P = i * L + a * g + l * m + u * M;
      s[h] = x, s[h + 1] = P, d && (n < 1e-3 ? s[h + 2] = Math.atan2(a - i, r - t) : s[h + 2] = Math.atan2(P - (i * S + a * E * 2 + l * c), x - (t * S + r * E * 2 + f * c)));
    }, v.NONE = -1, v.BEFORE = -2, v.AFTER = -3, v.epsilon = 1e-5, v;
  })();
  o.PathConstraint = e;
})(F || (F = {}));
var F;
(function(o) {
  var e = (function(v) {
    $(n, v);
    function n(t) {
      var i = v.call(this, t, 0, !1) || this;
      return i.bones = new Array(), i;
    }
    return n;
  })(o.ConstraintData);
  o.PathConstraintData = e, (function(v) {
    v[v.Fixed = 0] = "Fixed", v[v.Percent = 1] = "Percent";
  })(o.PositionMode || (o.PositionMode = {})), (function(v) {
    v[v.Length = 0] = "Length", v[v.Fixed = 1] = "Fixed", v[v.Percent = 2] = "Percent";
  })(o.SpacingMode || (o.SpacingMode = {})), (function(v) {
    v[v.Tangent = 0] = "Tangent", v[v.Chain = 1] = "Chain", v[v.ChainScale = 2] = "ChainScale";
  })(o.RotateMode || (o.RotateMode = {}));
})(F || (F = {}));
var F;
(function(o) {
  var e = (function() {
    function n(t) {
      this.toLoad = new Array(), this.assets = {}, this.clientId = t;
    }
    return n.prototype.loaded = function() {
      var t = 0;
      for (var i in this.assets)
        t++;
      return t;
    }, n;
  })(), v = (function() {
    function n(t) {
      t === void 0 && (t = ""), this.clientAssets = {}, this.queuedAssets = {}, this.rawAssets = {}, this.errors = {}, this.pathPrefix = t;
    }
    return n.prototype.queueAsset = function(t, i, r) {
      var a = this.clientAssets[t];
      return a == null && (a = new e(t), this.clientAssets[t] = a), i !== null && (a.textureLoader = i), a.toLoad.push(r), this.queuedAssets[r] === r ? !1 : (this.queuedAssets[r] = r, !0);
    }, n.prototype.loadText = function(t, i) {
      var r = this;
      if (i = this.pathPrefix + i, !!this.queueAsset(t, null, i)) {
        var a = new XMLHttpRequest();
        a.overrideMimeType("text/html"), a.onreadystatechange = function() {
          a.readyState == XMLHttpRequest.DONE && (a.status >= 200 && a.status < 300 ? r.rawAssets[i] = a.responseText : r.errors[i] = "Couldn't load text " + i + ": status " + a.status + ", " + a.responseText);
        }, a.open("GET", i, !0), a.send();
      }
    }, n.prototype.loadJson = function(t, i) {
      var r = this;
      if (i = this.pathPrefix + i, !!this.queueAsset(t, null, i)) {
        var a = new XMLHttpRequest();
        a.overrideMimeType("text/html"), a.onreadystatechange = function() {
          a.readyState == XMLHttpRequest.DONE && (a.status >= 200 && a.status < 300 ? r.rawAssets[i] = JSON.parse(a.responseText) : r.errors[i] = "Couldn't load text " + i + ": status " + a.status + ", " + a.responseText);
        }, a.open("GET", i, !0), a.send();
      }
    }, n.prototype.loadTexture = function(t, i, r) {
      var a = this;
      if (r = this.pathPrefix + r, !!this.queueAsset(t, i, r)) {
        var f = !!(typeof window < "u" && typeof navigator < "u" && window.document), l = !f && typeof importScripts < "u";
        if (l) {
          var p = { mode: "cors" };
          fetch(r, p).then(function(s) {
            return s.ok || (a.errors[r] = "Couldn't load image " + r), s.blob();
          }).then(function(s) {
            return createImageBitmap(s, {
              premultiplyAlpha: "none",
              colorSpaceConversion: "none"
            });
          }).then(function(s) {
            a.rawAssets[r] = s;
          });
        } else {
          var u = new Image();
          u.crossOrigin = "anonymous", u.onload = function(s) {
            a.rawAssets[r] = u;
          }, u.onerror = function(s) {
            a.errors[r] = "Couldn't load image " + r;
          }, u.src = r;
        }
      }
    }, n.prototype.get = function(t, i) {
      i = this.pathPrefix + i;
      var r = this.clientAssets[t];
      return r == null ? !0 : r.assets[i];
    }, n.prototype.updateClientAssets = function(t) {
      for (var i = !!(typeof window < "u" && typeof navigator < "u" && window.document), r = !i && typeof importScripts < "u", a = 0; a < t.toLoad.length; a++) {
        var f = t.toLoad[a], l = t.assets[f];
        if (l == null) {
          var p = this.rawAssets[f];
          if (p == null)
            continue;
          r ? p instanceof ImageBitmap ? t.assets[f] = t.textureLoader(p) : t.assets[f] = p : p instanceof HTMLImageElement ? t.assets[f] = t.textureLoader(p) : t.assets[f] = p;
        }
      }
    }, n.prototype.isLoadingComplete = function(t) {
      var i = this.clientAssets[t];
      return i == null ? !0 : (this.updateClientAssets(i), i.toLoad.length == i.loaded());
    }, n.prototype.dispose = function() {
    }, n.prototype.hasErrors = function() {
      return Object.keys(this.errors).length > 0;
    }, n.prototype.getErrors = function() {
      return this.errors;
    }, n;
  })();
  o.SharedAssetManager = v;
})(F || (F = {}));
var F;
(function(o) {
  var e = (function() {
    function v(n) {
      if (this._updateCache = new Array(), this.updateCacheReset = new Array(), this.time = 0, this.scaleX = 1, this.scaleY = 1, this.x = 0, this.y = 0, n == null)
        throw new Error("data cannot be null.");
      this.data = n, this.bones = new Array();
      for (var t = 0; t < n.bones.length; t++) {
        var i = n.bones[t], r = void 0;
        if (i.parent == null)
          r = new o.Bone(i, this, null);
        else {
          var a = this.bones[i.parent.index];
          r = new o.Bone(i, this, a), a.children.push(r);
        }
        this.bones.push(r);
      }
      this.slots = new Array(), this.drawOrder = new Array();
      for (var t = 0; t < n.slots.length; t++) {
        var f = n.slots[t], r = this.bones[f.boneData.index], l = new o.Slot(f, r);
        this.slots.push(l), this.drawOrder.push(l);
      }
      this.ikConstraints = new Array();
      for (var t = 0; t < n.ikConstraints.length; t++) {
        var p = n.ikConstraints[t];
        this.ikConstraints.push(new o.IkConstraint(p, this));
      }
      this.transformConstraints = new Array();
      for (var t = 0; t < n.transformConstraints.length; t++) {
        var u = n.transformConstraints[t];
        this.transformConstraints.push(new o.TransformConstraint(u, this));
      }
      this.pathConstraints = new Array();
      for (var t = 0; t < n.pathConstraints.length; t++) {
        var s = n.pathConstraints[t];
        this.pathConstraints.push(new o.PathConstraint(s, this));
      }
      this.color = new o.Color(1, 1, 1, 1), this.updateCache();
    }
    return v.prototype.updateCache = function() {
      var n = this._updateCache;
      n.length = 0, this.updateCacheReset.length = 0;
      for (var t = this.bones, i = 0, r = t.length; i < r; i++) {
        var a = t[i];
        a.sorted = a.data.skinRequired, a.active = !a.sorted;
      }
      if (this.skin != null)
        for (var f = this.skin.bones, i = 0, r = this.skin.bones.length; i < r; i++) {
          var a = this.bones[f[i].index];
          do
            a.sorted = !1, a.active = !0, a = a.parent;
          while (a != null);
        }
      var l = this.ikConstraints, p = this.transformConstraints, u = this.pathConstraints, s = l.length, h = p.length, d = u.length, c = s + h + d;
      t: for (var i = 0; i < c; i++) {
        for (var M = 0; M < s; M++) {
          var C = l[M];
          if (C.data.order == i) {
            this.sortIkConstraint(C);
            continue t;
          }
        }
        for (var M = 0; M < h; M++) {
          var C = p[M];
          if (C.data.order == i) {
            this.sortTransformConstraint(C);
            continue t;
          }
        }
        for (var M = 0; M < d; M++) {
          var C = u[M];
          if (C.data.order == i) {
            this.sortPathConstraint(C);
            continue t;
          }
        }
      }
      for (var i = 0, r = t.length; i < r; i++)
        this.sortBone(t[i]);
    }, v.prototype.sortIkConstraint = function(n) {
      if (n.active = n.target.isActive() && (!n.data.skinRequired || this.skin != null && o.Utils.contains(this.skin.constraints, n.data, !0)), !!n.active) {
        var t = n.target;
        this.sortBone(t);
        var i = n.bones, r = i[0];
        if (this.sortBone(r), i.length > 1) {
          var a = i[i.length - 1];
          this._updateCache.indexOf(a) > -1 || this.updateCacheReset.push(a);
        }
        this._updateCache.push(n), this.sortReset(r.children), i[i.length - 1].sorted = !0;
      }
    }, v.prototype.sortPathConstraint = function(n) {
      if (n.active = n.target.bone.isActive() && (!n.data.skinRequired || this.skin != null && o.Utils.contains(this.skin.constraints, n.data, !0)), !!n.active) {
        var t = n.target, i = t.data.index, r = t.bone;
        this.skin != null && this.sortPathConstraintAttachment(this.skin, i, r), this.data.defaultSkin != null && this.data.defaultSkin != this.skin && this.sortPathConstraintAttachment(this.data.defaultSkin, i, r);
        for (var a = 0, f = this.data.skins.length; a < f; a++)
          this.sortPathConstraintAttachment(this.data.skins[a], i, r);
        var l = t.getAttachment();
        l instanceof o.PathAttachment && this.sortPathConstraintAttachmentWith(l, r);
        for (var p = n.bones, u = p.length, a = 0; a < u; a++)
          this.sortBone(p[a]);
        this._updateCache.push(n);
        for (var a = 0; a < u; a++)
          this.sortReset(p[a].children);
        for (var a = 0; a < u; a++)
          p[a].sorted = !0;
      }
    }, v.prototype.sortTransformConstraint = function(n) {
      if (n.active = n.target.isActive() && (!n.data.skinRequired || this.skin != null && o.Utils.contains(this.skin.constraints, n.data, !0)), !!n.active) {
        this.sortBone(n.target);
        var t = n.bones, i = t.length;
        if (n.data.local)
          for (var r = 0; r < i; r++) {
            var a = t[r];
            this.sortBone(a.parent), this._updateCache.indexOf(a) > -1 || this.updateCacheReset.push(a);
          }
        else
          for (var r = 0; r < i; r++)
            this.sortBone(t[r]);
        this._updateCache.push(n);
        for (var f = 0; f < i; f++)
          this.sortReset(t[f].children);
        for (var f = 0; f < i; f++)
          t[f].sorted = !0;
      }
    }, v.prototype.sortPathConstraintAttachment = function(n, t, i) {
      var r = n.attachments[t];
      if (r)
        for (var a in r)
          this.sortPathConstraintAttachmentWith(r[a], i);
    }, v.prototype.sortPathConstraintAttachmentWith = function(n, t) {
      if (n instanceof o.PathAttachment) {
        var i = n.bones;
        if (i == null)
          this.sortBone(t);
        else
          for (var r = this.bones, a = 0; a < i.length; )
            for (var f = i[a++], l = a + f; a < l; a++) {
              var p = i[a];
              this.sortBone(r[p]);
            }
      }
    }, v.prototype.sortBone = function(n) {
      if (!n.sorted) {
        var t = n.parent;
        t != null && this.sortBone(t), n.sorted = !0, this._updateCache.push(n);
      }
    }, v.prototype.sortReset = function(n) {
      for (var t = 0, i = n.length; t < i; t++) {
        var r = n[t];
        r.active && (r.sorted && this.sortReset(r.children), r.sorted = !1);
      }
    }, v.prototype.updateWorldTransform = function() {
      for (var n = this.updateCacheReset, t = 0, i = n.length; t < i; t++) {
        var r = n[t];
        r.ax = r.x, r.ay = r.y, r.arotation = r.rotation, r.ascaleX = r.scaleX, r.ascaleY = r.scaleY, r.ashearX = r.shearX, r.ashearY = r.shearY, r.appliedValid = !0;
      }
      for (var a = this._updateCache, t = 0, i = a.length; t < i; t++)
        a[t].update();
    }, v.prototype.setToSetupPose = function() {
      this.setBonesToSetupPose(), this.setSlotsToSetupPose();
    }, v.prototype.setBonesToSetupPose = function() {
      for (var n = this.bones, t = 0, i = n.length; t < i; t++)
        n[t].setToSetupPose();
      for (var r = this.ikConstraints, t = 0, i = r.length; t < i; t++) {
        var a = r[t];
        a.mix = a.data.mix, a.softness = a.data.softness, a.bendDirection = a.data.bendDirection, a.compress = a.data.compress, a.stretch = a.data.stretch;
      }
      for (var f = this.transformConstraints, t = 0, i = f.length; t < i; t++) {
        var a = f[t], l = a.data;
        a.rotateMix = l.rotateMix, a.translateMix = l.translateMix, a.scaleMix = l.scaleMix, a.shearMix = l.shearMix;
      }
      for (var p = this.pathConstraints, t = 0, i = p.length; t < i; t++) {
        var a = p[t], l = a.data;
        a.position = l.position, a.spacing = l.spacing, a.rotateMix = l.rotateMix, a.translateMix = l.translateMix;
      }
    }, v.prototype.setSlotsToSetupPose = function() {
      var n = this.slots;
      o.Utils.arrayCopy(n, 0, this.drawOrder, 0, n.length);
      for (var t = 0, i = n.length; t < i; t++)
        n[t].setToSetupPose();
    }, v.prototype.getRootBone = function() {
      return this.bones.length == 0 ? null : this.bones[0];
    }, v.prototype.findBone = function(n) {
      if (n == null)
        throw new Error("boneName cannot be null.");
      for (var t = this.bones, i = 0, r = t.length; i < r; i++) {
        var a = t[i];
        if (a.data.name == n)
          return a;
      }
      return null;
    }, v.prototype.findBoneIndex = function(n) {
      if (n == null)
        throw new Error("boneName cannot be null.");
      for (var t = this.bones, i = 0, r = t.length; i < r; i++)
        if (t[i].data.name == n)
          return i;
      return -1;
    }, v.prototype.findSlot = function(n) {
      if (n == null)
        throw new Error("slotName cannot be null.");
      for (var t = this.slots, i = 0, r = t.length; i < r; i++) {
        var a = t[i];
        if (a.data.name == n)
          return a;
      }
      return null;
    }, v.prototype.findSlotIndex = function(n) {
      if (n == null)
        throw new Error("slotName cannot be null.");
      for (var t = this.slots, i = 0, r = t.length; i < r; i++)
        if (t[i].data.name == n)
          return i;
      return -1;
    }, v.prototype.setSkinByName = function(n) {
      var t = this.data.findSkin(n);
      if (t == null)
        throw new Error("Skin not found: " + n);
      this.setSkin(t);
    }, v.prototype.setSkin = function(n) {
      if (n != this.skin) {
        if (n != null)
          if (this.skin != null)
            n.attachAll(this, this.skin);
          else
            for (var t = this.slots, i = 0, r = t.length; i < r; i++) {
              var a = t[i], f = a.data.attachmentName;
              if (f != null) {
                var l = n.getAttachment(i, f);
                l != null && a.setAttachment(l);
              }
            }
        this.skin = n, this.updateCache();
      }
    }, v.prototype.getAttachmentByName = function(n, t) {
      return this.getAttachment(this.data.findSlotIndex(n), t);
    }, v.prototype.getAttachment = function(n, t) {
      if (t == null)
        throw new Error("attachmentName cannot be null.");
      if (this.skin != null) {
        var i = this.skin.getAttachment(n, t);
        if (i != null)
          return i;
      }
      return this.data.defaultSkin != null ? this.data.defaultSkin.getAttachment(n, t) : null;
    }, v.prototype.setAttachment = function(n, t) {
      if (n == null)
        throw new Error("slotName cannot be null.");
      for (var i = this.slots, r = 0, a = i.length; r < a; r++) {
        var f = i[r];
        if (f.data.name == n) {
          var l = null;
          if (t != null && (l = this.getAttachment(r, t), l == null))
            throw new Error("Attachment not found: " + t + ", for slot: " + n);
          f.setAttachment(l);
          return;
        }
      }
      throw new Error("Slot not found: " + n);
    }, v.prototype.findIkConstraint = function(n) {
      if (n == null)
        throw new Error("constraintName cannot be null.");
      for (var t = this.ikConstraints, i = 0, r = t.length; i < r; i++) {
        var a = t[i];
        if (a.data.name == n)
          return a;
      }
      return null;
    }, v.prototype.findTransformConstraint = function(n) {
      if (n == null)
        throw new Error("constraintName cannot be null.");
      for (var t = this.transformConstraints, i = 0, r = t.length; i < r; i++) {
        var a = t[i];
        if (a.data.name == n)
          return a;
      }
      return null;
    }, v.prototype.findPathConstraint = function(n) {
      if (n == null)
        throw new Error("constraintName cannot be null.");
      for (var t = this.pathConstraints, i = 0, r = t.length; i < r; i++) {
        var a = t[i];
        if (a.data.name == n)
          return a;
      }
      return null;
    }, v.prototype.getBounds = function(n, t, i) {
      if (i === void 0 && (i = new Array(2)), n == null)
        throw new Error("offset cannot be null.");
      if (t == null)
        throw new Error("size cannot be null.");
      for (var r = this.drawOrder, a = Number.POSITIVE_INFINITY, f = Number.POSITIVE_INFINITY, l = Number.NEGATIVE_INFINITY, p = Number.NEGATIVE_INFINITY, u = 0, s = r.length; u < s; u++) {
        var h = r[u];
        if (h.bone.active) {
          var d = 0, c = null, M = h.getAttachment();
          if (M instanceof o.RegionAttachment)
            d = 8, c = o.Utils.setArraySize(i, d, 0), M.computeWorldVertices(h.bone, c, 0, 2);
          else if (M instanceof o.MeshAttachment) {
            var C = M;
            d = C.worldVerticesLength, c = o.Utils.setArraySize(i, d, 0), C.computeWorldVertices(h, 0, d, c, 0, 2);
          }
          if (c != null)
            for (var S = 0, L = c.length; S < L; S += 2) {
              var E = c[S], A = c[S + 1];
              a = Math.min(a, E), f = Math.min(f, A), l = Math.max(l, E), p = Math.max(p, A);
            }
        }
      }
      n.set(a, f), t.set(l - a, p - f);
    }, v.prototype.update = function(n) {
      this.time += n;
    }, v;
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
      var a = this.scale, f = new o.SkeletonData();
      f.name = "";
      var l = new v(r);
      if (f.hash = l.readString(), f.version = l.readString(), f.version == "3.8.75")
        throw new Error("Unsupported skeleton data, please export with a newer version of Spine.");
      f.x = l.readFloat(), f.y = l.readFloat(), f.width = l.readFloat(), f.height = l.readFloat();
      var p = l.readBoolean();
      p && (f.fps = l.readFloat(), f.imagesPath = l.readString(), f.audioPath = l.readString());
      var u = 0;
      u = l.readInt(!0);
      for (var s = 0; s < u; s++)
        l.strings.push(l.readString());
      u = l.readInt(!0);
      for (var s = 0; s < u; s++) {
        var h = l.readString(), d = s == 0 ? null : f.bones[l.readInt(!0)], c = new o.BoneData(s, h, d);
        c.rotation = l.readFloat(), c.x = l.readFloat() * a, c.y = l.readFloat() * a, c.scaleX = l.readFloat(), c.scaleY = l.readFloat(), c.shearX = l.readFloat(), c.shearY = l.readFloat(), c.length = l.readFloat() * a, c.transformMode = i.TransformModeValues[l.readInt(!0)], c.skinRequired = l.readBoolean(), p && o.Color.rgba8888ToColor(c.color, l.readInt32()), f.bones.push(c);
      }
      u = l.readInt(!0);
      for (var s = 0; s < u; s++) {
        var M = l.readString(), C = f.bones[l.readInt(!0)], c = new o.SlotData(s, M, C);
        o.Color.rgba8888ToColor(c.color, l.readInt32());
        var S = l.readInt32();
        S != -1 && o.Color.rgb888ToColor(c.darkColor = new o.Color(), S), c.attachmentName = l.readStringRef(), c.blendMode = i.BlendModeValues[l.readInt(!0)], f.slots.push(c);
      }
      u = l.readInt(!0);
      for (var s = 0, L = void 0; s < u; s++) {
        var c = new o.IkConstraintData(l.readString());
        c.order = l.readInt(!0), c.skinRequired = l.readBoolean(), L = l.readInt(!0);
        for (var E = 0; E < L; E++)
          c.bones.push(f.bones[l.readInt(!0)]);
        c.target = f.bones[l.readInt(!0)], c.mix = l.readFloat(), c.softness = l.readFloat() * a, c.bendDirection = l.readByte(), c.compress = l.readBoolean(), c.stretch = l.readBoolean(), c.uniform = l.readBoolean(), f.ikConstraints.push(c);
      }
      u = l.readInt(!0);
      for (var s = 0, L = void 0; s < u; s++) {
        var c = new o.TransformConstraintData(l.readString());
        c.order = l.readInt(!0), c.skinRequired = l.readBoolean(), L = l.readInt(!0);
        for (var E = 0; E < L; E++)
          c.bones.push(f.bones[l.readInt(!0)]);
        c.target = f.bones[l.readInt(!0)], c.local = l.readBoolean(), c.relative = l.readBoolean(), c.offsetRotation = l.readFloat(), c.offsetX = l.readFloat() * a, c.offsetY = l.readFloat() * a, c.offsetScaleX = l.readFloat(), c.offsetScaleY = l.readFloat(), c.offsetShearY = l.readFloat(), c.rotateMix = l.readFloat(), c.translateMix = l.readFloat(), c.scaleMix = l.readFloat(), c.shearMix = l.readFloat(), f.transformConstraints.push(c);
      }
      u = l.readInt(!0);
      for (var s = 0, L = void 0; s < u; s++) {
        var c = new o.PathConstraintData(l.readString());
        c.order = l.readInt(!0), c.skinRequired = l.readBoolean(), L = l.readInt(!0);
        for (var E = 0; E < L; E++)
          c.bones.push(f.bones[l.readInt(!0)]);
        c.target = f.slots[l.readInt(!0)], c.positionMode = i.PositionModeValues[l.readInt(!0)], c.spacingMode = i.SpacingModeValues[l.readInt(!0)], c.rotateMode = i.RotateModeValues[l.readInt(!0)], c.offsetRotation = l.readFloat(), c.position = l.readFloat(), c.positionMode == o.PositionMode.Fixed && (c.position *= a), c.spacing = l.readFloat(), (c.spacingMode == o.SpacingMode.Length || c.spacingMode == o.SpacingMode.Fixed) && (c.spacing *= a), c.rotateMix = l.readFloat(), c.translateMix = l.readFloat(), f.pathConstraints.push(c);
      }
      var A = this.readSkin(l, f, !0, p);
      A != null && (f.defaultSkin = A, f.skins.push(A));
      {
        var s = f.skins.length;
        for (o.Utils.setArraySize(f.skins, u = s + l.readInt(!0)); s < u; s++)
          f.skins[s] = this.readSkin(l, f, !1, p);
      }
      u = this.linkedMeshes.length;
      for (var s = 0; s < u; s++) {
        var g = this.linkedMeshes[s], m = g.skin == null ? f.defaultSkin : f.findSkin(g.skin);
        if (m == null)
          throw new Error("Skin not found: " + g.skin);
        var x = m.getAttachment(g.slotIndex, g.parent);
        if (x == null)
          throw new Error("Parent mesh not found: " + g.parent);
        g.mesh.deformAttachment = g.inheritDeform ? x : g.mesh, g.mesh.setParentMesh(x), g.mesh.updateUVs();
      }
      this.linkedMeshes.length = 0, u = l.readInt(!0);
      for (var s = 0; s < u; s++) {
        var c = new o.EventData(l.readStringRef());
        c.intValue = l.readInt(!1), c.floatValue = l.readFloat(), c.stringValue = l.readString(), c.audioPath = l.readString(), c.audioPath != null && (c.volume = l.readFloat(), c.balance = l.readFloat()), f.events.push(c);
      }
      u = l.readInt(!0);
      for (var s = 0; s < u; s++)
        f.animations.push(this.readAnimation(l, l.readString(), f));
      return f;
    }, i.prototype.readSkin = function(r, a, f, l) {
      var p = null, u = 0;
      if (f) {
        if (u = r.readInt(!0), u == 0)
          return null;
        p = new o.Skin("default");
      } else {
        p = new o.Skin(r.readStringRef()), p.bones.length = r.readInt(!0);
        for (var s = 0, h = p.bones.length; s < h; s++)
          p.bones[s] = a.bones[r.readInt(!0)];
        for (var s = 0, h = r.readInt(!0); s < h; s++)
          p.constraints.push(a.ikConstraints[r.readInt(!0)]);
        for (var s = 0, h = r.readInt(!0); s < h; s++)
          p.constraints.push(a.transformConstraints[r.readInt(!0)]);
        for (var s = 0, h = r.readInt(!0); s < h; s++)
          p.constraints.push(a.pathConstraints[r.readInt(!0)]);
        u = r.readInt(!0);
      }
      for (var s = 0; s < u; s++)
        for (var d = r.readInt(!0), c = 0, M = r.readInt(!0); c < M; c++) {
          var C = r.readStringRef(), S = this.readAttachment(r, a, p, d, C, l);
          S != null && p.setAttachment(d, C, S);
        }
      return p;
    }, i.prototype.readAttachment = function(r, a, f, l, p, u) {
      var s = this.scale, h = r.readStringRef();
      h == null && (h = p);
      var d = r.readByte(), c = i.AttachmentTypeValues[d];
      switch (c) {
        case o.AttachmentType.Region: {
          var M = r.readStringRef(), C = r.readFloat(), S = r.readFloat(), L = r.readFloat(), E = r.readFloat(), A = r.readFloat(), g = r.readFloat(), m = r.readFloat(), x = r.readInt32();
          M == null && (M = h);
          var P = this.attachmentLoader.newRegionAttachment(f, h, M);
          return P == null ? null : (P.path = M, P.x = S * s, P.y = L * s, P.scaleX = E, P.scaleY = A, P.rotation = C, P.width = g * s, P.height = m * s, o.Color.rgba8888ToColor(P.color, x), P.updateOffset(), P);
        }
        case o.AttachmentType.BoundingBox: {
          var I = r.readInt(!0), O = this.readVertices(r, I), x = u ? r.readInt32() : 0, R = this.attachmentLoader.newBoundingBoxAttachment(f, h);
          return R == null ? null : (R.worldVerticesLength = I << 1, R.vertices = O.vertices, R.bones = O.bones, u && o.Color.rgba8888ToColor(R.color, x), R);
        }
        case o.AttachmentType.Mesh: {
          var M = r.readStringRef(), x = r.readInt32(), I = r.readInt(!0), D = this.readFloatArray(r, I << 1, 1), N = this.readShortArray(r), O = this.readVertices(r, I), k = r.readInt(!0), y = null, g = 0, m = 0;
          u && (y = this.readShortArray(r), g = r.readFloat(), m = r.readFloat()), M == null && (M = h);
          var T = this.attachmentLoader.newMeshAttachment(f, h, M);
          return T == null ? null : (T.path = M, o.Color.rgba8888ToColor(T.color, x), T.bones = O.bones, T.vertices = O.vertices, T.worldVerticesLength = I << 1, T.triangles = N, T.regionUVs = D, T.updateUVs(), T.hullLength = k << 1, u && (T.edges = y, T.width = g * s, T.height = m * s), T);
        }
        case o.AttachmentType.LinkedMesh: {
          var M = r.readStringRef(), x = r.readInt32(), B = r.readStringRef(), V = r.readStringRef(), G = r.readBoolean(), g = 0, m = 0;
          u && (g = r.readFloat(), m = r.readFloat()), M == null && (M = h);
          var T = this.attachmentLoader.newMeshAttachment(f, h, M);
          return T == null ? null : (T.path = M, o.Color.rgba8888ToColor(T.color, x), u && (T.width = g * s, T.height = m * s), this.linkedMeshes.push(new n(T, B, l, V, G)), T);
        }
        case o.AttachmentType.Path: {
          for (var Y = r.readBoolean(), X = r.readBoolean(), I = r.readInt(!0), O = this.readVertices(r, I), _ = o.Utils.newArray(I / 3, 0), W = 0, U = _.length; W < U; W++)
            _[W] = r.readFloat() * s;
          var x = u ? r.readInt32() : 0, M = this.attachmentLoader.newPathAttachment(f, h);
          return M == null ? null : (M.closed = Y, M.constantSpeed = X, M.worldVerticesLength = I << 1, M.vertices = O.vertices, M.bones = O.bones, M.lengths = _, u && o.Color.rgba8888ToColor(M.color, x), M);
        }
        case o.AttachmentType.Point: {
          var C = r.readFloat(), S = r.readFloat(), L = r.readFloat(), x = u ? r.readInt32() : 0, w = this.attachmentLoader.newPointAttachment(f, h);
          return w == null ? null : (w.x = S * s, w.y = L * s, w.rotation = C, u && o.Color.rgba8888ToColor(w.color, x), w);
        }
        case o.AttachmentType.Clipping: {
          var Z = r.readInt(!0), I = r.readInt(!0), O = this.readVertices(r, I), x = u ? r.readInt32() : 0, z = this.attachmentLoader.newClippingAttachment(f, h);
          return z == null ? null : (z.endSlot = a.slots[Z], z.worldVerticesLength = I << 1, z.vertices = O.vertices, z.bones = O.bones, u && o.Color.rgba8888ToColor(z.color, x), z);
        }
      }
      return null;
    }, i.prototype.readVertices = function(r, a) {
      var f = a << 1, l = new t(), p = this.scale;
      if (!r.readBoolean())
        return l.vertices = this.readFloatArray(r, f, p), l;
      for (var u = new Array(), s = new Array(), h = 0; h < a; h++) {
        var d = r.readInt(!0);
        s.push(d);
        for (var c = 0; c < d; c++)
          s.push(r.readInt(!0)), u.push(r.readFloat() * p), u.push(r.readFloat() * p), u.push(r.readFloat());
      }
      return l.vertices = o.Utils.toFloatArray(u), l.bones = s, l;
    }, i.prototype.readFloatArray = function(r, a, f) {
      var l = new Array(a);
      if (f == 1)
        for (var p = 0; p < a; p++)
          l[p] = r.readFloat();
      else
        for (var p = 0; p < a; p++)
          l[p] = r.readFloat() * f;
      return l;
    }, i.prototype.readShortArray = function(r) {
      for (var a = r.readInt(!0), f = new Array(a), l = 0; l < a; l++)
        f[l] = r.readShort();
      return f;
    }, i.prototype.readAnimation = function(r, a, f) {
      for (var l = new Array(), p = this.scale, u = 0, s = new o.Color(), h = new o.Color(), d = 0, c = r.readInt(!0); d < c; d++)
        for (var M = r.readInt(!0), C = 0, S = r.readInt(!0); C < S; C++) {
          var L = r.readByte(), E = r.readInt(!0);
          switch (L) {
            case i.SLOT_ATTACHMENT: {
              var A = new o.AttachmentTimeline(E);
              A.slotIndex = M;
              for (var g = 0; g < E; g++)
                A.setFrame(g, r.readFloat(), r.readStringRef());
              l.push(A), u = Math.max(u, A.frames[E - 1]);
              break;
            }
            case i.SLOT_COLOR: {
              var A = new o.ColorTimeline(E);
              A.slotIndex = M;
              for (var g = 0; g < E; g++) {
                var m = r.readFloat();
                o.Color.rgba8888ToColor(s, r.readInt32()), A.setFrame(g, m, s.r, s.g, s.b, s.a), g < E - 1 && this.readCurve(r, g, A);
              }
              l.push(A), u = Math.max(u, A.frames[(E - 1) * o.ColorTimeline.ENTRIES]);
              break;
            }
            case i.SLOT_TWO_COLOR: {
              var A = new o.TwoColorTimeline(E);
              A.slotIndex = M;
              for (var g = 0; g < E; g++) {
                var m = r.readFloat();
                o.Color.rgba8888ToColor(s, r.readInt32()), o.Color.rgb888ToColor(h, r.readInt32()), A.setFrame(g, m, s.r, s.g, s.b, s.a, h.r, h.g, h.b), g < E - 1 && this.readCurve(r, g, A);
              }
              l.push(A), u = Math.max(u, A.frames[(E - 1) * o.TwoColorTimeline.ENTRIES]);
              break;
            }
          }
        }
      for (var d = 0, c = r.readInt(!0); d < c; d++)
        for (var x = r.readInt(!0), C = 0, S = r.readInt(!0); C < S; C++) {
          var L = r.readByte(), E = r.readInt(!0);
          switch (L) {
            case i.BONE_ROTATE: {
              var A = new o.RotateTimeline(E);
              A.boneIndex = x;
              for (var g = 0; g < E; g++)
                A.setFrame(g, r.readFloat(), r.readFloat()), g < E - 1 && this.readCurve(r, g, A);
              l.push(A), u = Math.max(u, A.frames[(E - 1) * o.RotateTimeline.ENTRIES]);
              break;
            }
            case i.BONE_TRANSLATE:
            case i.BONE_SCALE:
            case i.BONE_SHEAR: {
              var A = void 0, P = 1;
              L == i.BONE_SCALE ? A = new o.ScaleTimeline(E) : L == i.BONE_SHEAR ? A = new o.ShearTimeline(E) : (A = new o.TranslateTimeline(E), P = p), A.boneIndex = x;
              for (var g = 0; g < E; g++)
                A.setFrame(g, r.readFloat(), r.readFloat() * P, r.readFloat() * P), g < E - 1 && this.readCurve(r, g, A);
              l.push(A), u = Math.max(u, A.frames[(E - 1) * o.TranslateTimeline.ENTRIES]);
              break;
            }
          }
        }
      for (var d = 0, c = r.readInt(!0); d < c; d++) {
        var I = r.readInt(!0), E = r.readInt(!0), A = new o.IkConstraintTimeline(E);
        A.ikConstraintIndex = I;
        for (var g = 0; g < E; g++)
          A.setFrame(g, r.readFloat(), r.readFloat(), r.readFloat() * p, r.readByte(), r.readBoolean(), r.readBoolean()), g < E - 1 && this.readCurve(r, g, A);
        l.push(A), u = Math.max(u, A.frames[(E - 1) * o.IkConstraintTimeline.ENTRIES]);
      }
      for (var d = 0, c = r.readInt(!0); d < c; d++) {
        var I = r.readInt(!0), E = r.readInt(!0), A = new o.TransformConstraintTimeline(E);
        A.transformConstraintIndex = I;
        for (var g = 0; g < E; g++)
          A.setFrame(g, r.readFloat(), r.readFloat(), r.readFloat(), r.readFloat(), r.readFloat()), g < E - 1 && this.readCurve(r, g, A);
        l.push(A), u = Math.max(u, A.frames[(E - 1) * o.TransformConstraintTimeline.ENTRIES]);
      }
      for (var d = 0, c = r.readInt(!0); d < c; d++)
        for (var I = r.readInt(!0), O = f.pathConstraints[I], C = 0, S = r.readInt(!0); C < S; C++) {
          var L = r.readByte(), E = r.readInt(!0);
          switch (L) {
            case i.PATH_POSITION:
            case i.PATH_SPACING: {
              var A = void 0, P = 1;
              L == i.PATH_SPACING ? (A = new o.PathConstraintSpacingTimeline(E), (O.spacingMode == o.SpacingMode.Length || O.spacingMode == o.SpacingMode.Fixed) && (P = p)) : (A = new o.PathConstraintPositionTimeline(E), O.positionMode == o.PositionMode.Fixed && (P = p)), A.pathConstraintIndex = I;
              for (var g = 0; g < E; g++)
                A.setFrame(g, r.readFloat(), r.readFloat() * P), g < E - 1 && this.readCurve(r, g, A);
              l.push(A), u = Math.max(u, A.frames[(E - 1) * o.PathConstraintPositionTimeline.ENTRIES]);
              break;
            }
            case i.PATH_MIX: {
              var A = new o.PathConstraintMixTimeline(E);
              A.pathConstraintIndex = I;
              for (var g = 0; g < E; g++)
                A.setFrame(g, r.readFloat(), r.readFloat(), r.readFloat()), g < E - 1 && this.readCurve(r, g, A);
              l.push(A), u = Math.max(u, A.frames[(E - 1) * o.PathConstraintMixTimeline.ENTRIES]);
              break;
            }
          }
        }
      for (var d = 0, c = r.readInt(!0); d < c; d++)
        for (var R = f.skins[r.readInt(!0)], C = 0, S = r.readInt(!0); C < S; C++)
          for (var M = r.readInt(!0), D = 0, N = r.readInt(!0); D < N; D++) {
            var k = R.getAttachment(M, r.readStringRef()), y = k.bones != null, T = k.vertices, B = y ? T.length / 3 * 2 : T.length, E = r.readInt(!0), A = new o.DeformTimeline(E);
            A.slotIndex = M, A.attachment = k;
            for (var g = 0; g < E; g++) {
              var m = r.readFloat(), V = void 0, G = r.readInt(!0);
              if (G == 0)
                V = y ? o.Utils.newFloatArray(B) : T;
              else {
                V = o.Utils.newFloatArray(B);
                var Y = r.readInt(!0);
                if (G += Y, p == 1)
                  for (var X = Y; X < G; X++)
                    V[X] = r.readFloat();
                else
                  for (var X = Y; X < G; X++)
                    V[X] = r.readFloat() * p;
                if (!y)
                  for (var X = 0, _ = V.length; X < _; X++)
                    V[X] += T[X];
              }
              A.setFrame(g, m, V), g < E - 1 && this.readCurve(r, g, A);
            }
            l.push(A), u = Math.max(u, A.frames[E - 1]);
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
        l.push(A), u = Math.max(u, A.frames[W - 1]);
      }
      var J = r.readInt(!0);
      if (J > 0) {
        for (var A = new o.EventTimeline(J), d = 0; d < J; d++) {
          var m = r.readFloat(), tt = f.events[r.readInt(!0)], q = new o.Event(m, tt);
          q.intValue = r.readInt(!1), q.floatValue = r.readFloat(), q.stringValue = r.readBoolean() ? r.readString() : tt.stringValue, q.data.audioPath != null && (q.volume = r.readFloat(), q.balance = r.readFloat()), A.setFrame(d, q);
        }
        l.push(A), u = Math.max(u, A.frames[J - 1]);
      }
      return new o.Animation(a, l, u);
    }, i.prototype.readCurve = function(r, a, f) {
      switch (r.readByte()) {
        case i.CURVE_STEPPED:
          f.setStepped(a);
          break;
        case i.CURVE_BEZIER:
          this.setCurve(f, a, r.readFloat(), r.readFloat(), r.readFloat(), r.readFloat());
          break;
      }
    }, i.prototype.setCurve = function(r, a, f, l, p, u) {
      r.setCurve(a, f, l, p, u);
    }, i.AttachmentTypeValues = [0, 1, 2, 3, 4, 5, 6], i.TransformModeValues = [o.TransformMode.Normal, o.TransformMode.OnlyTranslation, o.TransformMode.NoRotationOrReflection, o.TransformMode.NoScale, o.TransformMode.NoScaleOrReflection], i.PositionModeValues = [o.PositionMode.Fixed, o.PositionMode.Percent], i.SpacingModeValues = [o.SpacingMode.Length, o.SpacingMode.Fixed, o.SpacingMode.Percent], i.RotateModeValues = [o.RotateMode.Tangent, o.RotateMode.Chain, o.RotateMode.ChainScale], i.BlendModeValues = [o.BlendMode.Normal, o.BlendMode.Additive, o.BlendMode.Multiply, o.BlendMode.Screen], i.BONE_ROTATE = 0, i.BONE_TRANSLATE = 1, i.BONE_SCALE = 2, i.BONE_SHEAR = 3, i.SLOT_ATTACHMENT = 0, i.SLOT_COLOR = 1, i.SLOT_TWO_COLOR = 2, i.PATH_POSITION = 0, i.PATH_SPACING = 1, i.PATH_MIX = 2, i.CURVE_LINEAR = 0, i.CURVE_STEPPED = 1, i.CURVE_BEZIER = 2, i;
  })();
  o.SkeletonBinary = e;
  var v = (function() {
    function i(r, a, f, l) {
      a === void 0 && (a = new Array()), f === void 0 && (f = 0), l === void 0 && (l = new DataView(r.buffer)), this.strings = a, this.index = f, this.buffer = l;
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
      var a = this.readByte(), f = a & 127;
      return (a & 128) != 0 && (a = this.readByte(), f |= (a & 127) << 7, (a & 128) != 0 && (a = this.readByte(), f |= (a & 127) << 14, (a & 128) != 0 && (a = this.readByte(), f |= (a & 127) << 21, (a & 128) != 0 && (a = this.readByte(), f |= (a & 127) << 28)))), r ? f : f >>> 1 ^ -(f & 1);
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
      for (var a = "", f = 0; f < r; ) {
        var l = this.readByte();
        switch (l >> 4) {
          case 12:
          case 13:
            a += String.fromCharCode((l & 31) << 6 | this.readByte() & 63), f += 2;
            break;
          case 14:
            a += String.fromCharCode((l & 15) << 12 | (this.readByte() & 63) << 6 | this.readByte() & 63), f += 3;
            break;
          default:
            a += String.fromCharCode(l), f++;
        }
      }
      return a;
    }, i.prototype.readFloat = function() {
      var r = this.buffer.getFloat32(this.index);
      return this.index += 4, r;
    }, i.prototype.readBoolean = function() {
      return this.readByte() != 0;
    }, i;
  })(), n = /* @__PURE__ */ (function() {
    function i(r, a, f, l, p) {
      this.mesh = r, this.skin = a, this.slotIndex = f, this.parent = l, this.inheritDeform = p;
    }
    return i;
  })(), t = /* @__PURE__ */ (function() {
    function i(r, a) {
      r === void 0 && (r = null), a === void 0 && (a = null), this.bones = r, this.vertices = a;
    }
    return i;
  })();
})(F || (F = {}));
var F;
(function(o) {
  var e = (function() {
    function v() {
      this.minX = 0, this.minY = 0, this.maxX = 0, this.maxY = 0, this.boundingBoxes = new Array(), this.polygons = new Array(), this.polygonPool = new o.Pool(function() {
        return o.Utils.newFloatArray(16);
      });
    }
    return v.prototype.update = function(n, t) {
      if (n == null)
        throw new Error("skeleton cannot be null.");
      var i = this.boundingBoxes, r = this.polygons, a = this.polygonPool, f = n.slots, l = f.length;
      i.length = 0, a.freeAll(r), r.length = 0;
      for (var p = 0; p < l; p++) {
        var u = f[p];
        if (u.bone.active) {
          var s = u.getAttachment();
          if (s instanceof o.BoundingBoxAttachment) {
            var h = s;
            i.push(h);
            var d = a.obtain();
            d.length != h.worldVerticesLength && (d = o.Utils.newFloatArray(h.worldVerticesLength)), r.push(d), h.computeWorldVertices(u, 0, h.worldVerticesLength, d, 0, 2);
          }
        }
      }
      t ? this.aabbCompute() : (this.minX = Number.POSITIVE_INFINITY, this.minY = Number.POSITIVE_INFINITY, this.maxX = Number.NEGATIVE_INFINITY, this.maxY = Number.NEGATIVE_INFINITY);
    }, v.prototype.aabbCompute = function() {
      for (var n = Number.POSITIVE_INFINITY, t = Number.POSITIVE_INFINITY, i = Number.NEGATIVE_INFINITY, r = Number.NEGATIVE_INFINITY, a = this.polygons, f = 0, l = a.length; f < l; f++)
        for (var p = a[f], u = p, s = 0, h = p.length; s < h; s += 2) {
          var d = u[s], c = u[s + 1];
          n = Math.min(n, d), t = Math.min(t, c), i = Math.max(i, d), r = Math.max(r, c);
        }
      this.minX = n, this.minY = t, this.maxX = i, this.maxY = r;
    }, v.prototype.aabbContainsPoint = function(n, t) {
      return n >= this.minX && n <= this.maxX && t >= this.minY && t <= this.maxY;
    }, v.prototype.aabbIntersectsSegment = function(n, t, i, r) {
      var a = this.minX, f = this.minY, l = this.maxX, p = this.maxY;
      if (n <= a && i <= a || t <= f && r <= f || n >= l && i >= l || t >= p && r >= p)
        return !1;
      var u = (r - t) / (i - n), s = u * (a - n) + t;
      if (s > f && s < p || (s = u * (l - n) + t, s > f && s < p))
        return !0;
      var h = (f - t) / u + n;
      return h > a && h < l || (h = (p - t) / u + n, h > a && h < l);
    }, v.prototype.aabbIntersectsSkeleton = function(n) {
      return this.minX < n.maxX && this.maxX > n.minX && this.minY < n.maxY && this.maxY > n.minY;
    }, v.prototype.containsPoint = function(n, t) {
      for (var i = this.polygons, r = 0, a = i.length; r < a; r++)
        if (this.containsPointPolygon(i[r], n, t))
          return this.boundingBoxes[r];
      return null;
    }, v.prototype.containsPointPolygon = function(n, t, i) {
      for (var r = n, a = n.length, f = a - 2, l = !1, p = 0; p < a; p += 2) {
        var u = r[p + 1], s = r[f + 1];
        if (u < i && s >= i || s < i && u >= i) {
          var h = r[p];
          h + (i - u) / (s - u) * (r[f] - h) < t && (l = !l);
        }
        f = p;
      }
      return l;
    }, v.prototype.intersectsSegment = function(n, t, i, r) {
      for (var a = this.polygons, f = 0, l = a.length; f < l; f++)
        if (this.intersectsSegmentPolygon(a[f], n, t, i, r))
          return this.boundingBoxes[f];
      return null;
    }, v.prototype.intersectsSegmentPolygon = function(n, t, i, r, a) {
      for (var f = n, l = n.length, p = t - r, u = i - a, s = t * a - i * r, h = f[l - 2], d = f[l - 1], c = 0; c < l; c += 2) {
        var M = f[c], C = f[c + 1], S = h * C - d * M, L = h - M, E = d - C, A = p * E - u * L, g = (s * L - p * S) / A;
        if ((g >= h && g <= M || g >= M && g <= h) && (g >= t && g <= r || g >= r && g <= t)) {
          var m = (s * E - u * S) / A;
          if ((m >= d && m <= C || m >= C && m <= d) && (m >= i && m <= a || m >= a && m <= i))
            return !0;
        }
        h = M, d = C;
      }
      return !1;
    }, v.prototype.getPolygon = function(n) {
      if (n == null)
        throw new Error("boundingBox cannot be null.");
      var t = this.boundingBoxes.indexOf(n);
      return t == -1 ? null : this.polygons[t];
    }, v.prototype.getWidth = function() {
      return this.maxX - this.minX;
    }, v.prototype.getHeight = function() {
      return this.maxY - this.minY;
    }, v;
  })();
  o.SkeletonBounds = e;
})(F || (F = {}));
var F;
(function(o) {
  var e = (function() {
    function v() {
      this.triangulator = new o.Triangulator(), this.clippingPolygon = new Array(), this.clipOutput = new Array(), this.clippedVertices = new Array(), this.clippedTriangles = new Array(), this.scratch = new Array();
    }
    return v.prototype.clipStart = function(n, t) {
      if (this.clipAttachment != null)
        return 0;
      this.clipAttachment = t;
      var i = t.worldVerticesLength, r = o.Utils.setArraySize(this.clippingPolygon, i);
      t.computeWorldVertices(n, 0, i, r, 0, 2);
      var a = this.clippingPolygon;
      v.makeClockwise(a);
      for (var f = this.clippingPolygons = this.triangulator.decompose(a, this.triangulator.triangulate(a)), l = 0, p = f.length; l < p; l++) {
        var u = f[l];
        v.makeClockwise(u), u.push(u[0]), u.push(u[1]);
      }
      return f.length;
    }, v.prototype.clipEndWithSlot = function(n) {
      this.clipAttachment != null && this.clipAttachment.endSlot == n.data && this.clipEnd();
    }, v.prototype.clipEnd = function() {
      this.clipAttachment != null && (this.clipAttachment = null, this.clippingPolygons = null, this.clippedVertices.length = 0, this.clippedTriangles.length = 0, this.clippingPolygon.length = 0);
    }, v.prototype.isClipping = function() {
      return this.clipAttachment != null;
    }, v.prototype.clipTriangles = function(n, t, i, r, a, f, l, p) {
      var u = this.clipOutput, s = this.clippedVertices, h = this.clippedTriangles, d = this.clippingPolygons, c = this.clippingPolygons.length, M = p ? 12 : 8, C = 0;
      s.length = 0, h.length = 0;
      t: for (var S = 0; S < r; S += 3) {
        var L = i[S] << 1, E = n[L], A = n[L + 1], g = a[L], m = a[L + 1];
        L = i[S + 1] << 1;
        var x = n[L], P = n[L + 1], I = a[L], O = a[L + 1];
        L = i[S + 2] << 1;
        for (var R = n[L], D = n[L + 1], N = a[L], k = a[L + 1], y = 0; y < c; y++) {
          var T = s.length;
          if (this.clip(E, A, x, P, R, D, d[y], u)) {
            var B = u.length;
            if (B == 0)
              continue;
            for (var V = P - D, G = R - x, Y = E - R, X = D - A, _ = 1 / (V * Y + G * (A - D)), W = B >> 1, U = this.clipOutput, w = o.Utils.setArraySize(s, T + W * M), Z = 0; Z < B; Z += 2) {
              var z = U[Z], j = U[Z + 1];
              w[T] = z, w[T + 1] = j, w[T + 2] = f.r, w[T + 3] = f.g, w[T + 4] = f.b, w[T + 5] = f.a;
              var H = z - R, J = j - D, tt = (V * H + G * J) * _, q = (X * H + Y * J) * _, at = 1 - tt - q;
              w[T + 6] = g * tt + I * q + N * at, w[T + 7] = m * tt + O * q + k * at, p && (w[T + 8] = l.r, w[T + 9] = l.g, w[T + 10] = l.b, w[T + 11] = l.a), T += M;
            }
            T = h.length;
            var nt = o.Utils.setArraySize(h, T + 3 * (W - 2));
            W--;
            for (var Z = 1; Z < W; Z++)
              nt[T] = C, nt[T + 1] = C + Z, nt[T + 2] = C + Z + 1, T += 3;
            C += W + 1;
          } else {
            var w = o.Utils.setArraySize(s, T + 3 * M);
            w[T] = E, w[T + 1] = A, w[T + 2] = f.r, w[T + 3] = f.g, w[T + 4] = f.b, w[T + 5] = f.a, p ? (w[T + 6] = g, w[T + 7] = m, w[T + 8] = l.r, w[T + 9] = l.g, w[T + 10] = l.b, w[T + 11] = l.a, w[T + 12] = x, w[T + 13] = P, w[T + 14] = f.r, w[T + 15] = f.g, w[T + 16] = f.b, w[T + 17] = f.a, w[T + 18] = I, w[T + 19] = O, w[T + 20] = l.r, w[T + 21] = l.g, w[T + 22] = l.b, w[T + 23] = l.a, w[T + 24] = R, w[T + 25] = D, w[T + 26] = f.r, w[T + 27] = f.g, w[T + 28] = f.b, w[T + 29] = f.a, w[T + 30] = N, w[T + 31] = k, w[T + 32] = l.r, w[T + 33] = l.g, w[T + 34] = l.b, w[T + 35] = l.a) : (w[T + 6] = g, w[T + 7] = m, w[T + 8] = x, w[T + 9] = P, w[T + 10] = f.r, w[T + 11] = f.g, w[T + 12] = f.b, w[T + 13] = f.a, w[T + 14] = I, w[T + 15] = O, w[T + 16] = R, w[T + 17] = D, w[T + 18] = f.r, w[T + 19] = f.g, w[T + 20] = f.b, w[T + 21] = f.a, w[T + 22] = N, w[T + 23] = k), T = h.length;
            var nt = o.Utils.setArraySize(h, T + 3);
            nt[T] = C, nt[T + 1] = C + 1, nt[T + 2] = C + 2, C += 3;
            continue t;
          }
        }
      }
    }, v.prototype.clip = function(n, t, i, r, a, f, l, p) {
      var u = p, s = !1, h = null;
      l.length % 4 >= 2 ? (h = p, p = this.scratch) : h = this.scratch, h.length = 0, h.push(n), h.push(t), h.push(i), h.push(r), h.push(a), h.push(f), h.push(n), h.push(t), p.length = 0;
      for (var d = l, c = l.length - 4, M = 0; ; M += 2) {
        for (var C = d[M], S = d[M + 1], L = d[M + 2], E = d[M + 3], A = C - L, g = S - E, m = h, x = h.length - 2, P = p.length, I = 0; I < x; I += 2) {
          var O = m[I], R = m[I + 1], D = m[I + 2], N = m[I + 3], k = A * (N - E) - g * (D - L) > 0;
          if (A * (R - E) - g * (O - L) > 0) {
            if (k) {
              p.push(D), p.push(N);
              continue;
            }
            var y = N - R, T = D - O, B = y * (L - C) - T * (E - S);
            if (Math.abs(B) > 1e-6) {
              var V = (T * (S - R) - y * (C - O)) / B;
              p.push(C + (L - C) * V), p.push(S + (E - S) * V);
            } else
              p.push(C), p.push(S);
          } else if (k) {
            var y = N - R, T = D - O, B = y * (L - C) - T * (E - S);
            if (Math.abs(B) > 1e-6) {
              var V = (T * (S - R) - y * (C - O)) / B;
              p.push(C + (L - C) * V), p.push(S + (E - S) * V);
            } else
              p.push(C), p.push(S);
            p.push(D), p.push(N);
          }
          s = !0;
        }
        if (P == p.length)
          return u.length = 0, !0;
        if (p.push(p[0]), p.push(p[1]), M == c)
          break;
        var G = p;
        p = h, p.length = 0, h = G;
      }
      if (u != p) {
        u.length = 0;
        for (var M = 0, Y = p.length - 2; M < Y; M++)
          u[M] = p[M];
      } else
        u.length = u.length - 2;
      return s;
    }, v.makeClockwise = function(n) {
      for (var t = n, i = n.length, r = t[i - 2] * t[1] - t[0] * t[i - 1], a = 0, f = 0, l = 0, p = 0, u = 0, s = i - 3; u < s; u += 2)
        a = t[u], f = t[u + 1], l = t[u + 2], p = t[u + 3], r += a * p - l * f;
      if (!(r < 0))
        for (var u = 0, h = i - 2, s = i >> 1; u < s; u += 2) {
          var d = t[u], c = t[u + 1], M = h - u;
          t[u] = t[M], t[u + 1] = t[M + 1], t[M] = d, t[M + 1] = c;
        }
    }, v;
  })();
  o.SkeletonClipping = e;
})(F || (F = {}));
var F;
(function(o) {
  var e = (function() {
    function v() {
      this.bones = new Array(), this.slots = new Array(), this.skins = new Array(), this.events = new Array(), this.animations = new Array(), this.ikConstraints = new Array(), this.transformConstraints = new Array(), this.pathConstraints = new Array(), this.fps = 0;
    }
    return v.prototype.findBone = function(n) {
      if (n == null)
        throw new Error("boneName cannot be null.");
      for (var t = this.bones, i = 0, r = t.length; i < r; i++) {
        var a = t[i];
        if (a.name == n)
          return a;
      }
      return null;
    }, v.prototype.findBoneIndex = function(n) {
      if (n == null)
        throw new Error("boneName cannot be null.");
      for (var t = this.bones, i = 0, r = t.length; i < r; i++)
        if (t[i].name == n)
          return i;
      return -1;
    }, v.prototype.findSlot = function(n) {
      if (n == null)
        throw new Error("slotName cannot be null.");
      for (var t = this.slots, i = 0, r = t.length; i < r; i++) {
        var a = t[i];
        if (a.name == n)
          return a;
      }
      return null;
    }, v.prototype.findSlotIndex = function(n) {
      if (n == null)
        throw new Error("slotName cannot be null.");
      for (var t = this.slots, i = 0, r = t.length; i < r; i++)
        if (t[i].name == n)
          return i;
      return -1;
    }, v.prototype.findSkin = function(n) {
      if (n == null)
        throw new Error("skinName cannot be null.");
      for (var t = this.skins, i = 0, r = t.length; i < r; i++) {
        var a = t[i];
        if (a.name == n)
          return a;
      }
      return null;
    }, v.prototype.findEvent = function(n) {
      if (n == null)
        throw new Error("eventDataName cannot be null.");
      for (var t = this.events, i = 0, r = t.length; i < r; i++) {
        var a = t[i];
        if (a.name == n)
          return a;
      }
      return null;
    }, v.prototype.findAnimation = function(n) {
      if (n == null)
        throw new Error("animationName cannot be null.");
      for (var t = this.animations, i = 0, r = t.length; i < r; i++) {
        var a = t[i];
        if (a.name == n)
          return a;
      }
      return null;
    }, v.prototype.findIkConstraint = function(n) {
      if (n == null)
        throw new Error("constraintName cannot be null.");
      for (var t = this.ikConstraints, i = 0, r = t.length; i < r; i++) {
        var a = t[i];
        if (a.name == n)
          return a;
      }
      return null;
    }, v.prototype.findTransformConstraint = function(n) {
      if (n == null)
        throw new Error("constraintName cannot be null.");
      for (var t = this.transformConstraints, i = 0, r = t.length; i < r; i++) {
        var a = t[i];
        if (a.name == n)
          return a;
      }
      return null;
    }, v.prototype.findPathConstraint = function(n) {
      if (n == null)
        throw new Error("constraintName cannot be null.");
      for (var t = this.pathConstraints, i = 0, r = t.length; i < r; i++) {
        var a = t[i];
        if (a.name == n)
          return a;
      }
      return null;
    }, v.prototype.findPathConstraintIndex = function(n) {
      if (n == null)
        throw new Error("pathConstraintName cannot be null.");
      for (var t = this.pathConstraints, i = 0, r = t.length; i < r; i++)
        if (t[i].name == n)
          return i;
      return -1;
    }, v;
  })();
  o.SkeletonData = e;
})(F || (F = {}));
var F;
(function(o) {
  var e = (function() {
    function n(t) {
      this.scale = 1, this.linkedMeshes = new Array(), this.attachmentLoader = t;
    }
    return n.prototype.readSkeletonData = function(t) {
      var i = this.scale, r = new o.SkeletonData(), a = typeof t == "string" ? JSON.parse(t) : t, f = a.skeleton;
      if (f != null) {
        if (r.hash = f.hash, r.version = f.spine, r.version == "3.8.75")
          throw new Error("Unsupported skeleton data, please export with a newer version of Spine.");
        r.x = f.x, r.y = f.y, r.width = f.width, r.height = f.height, r.fps = f.fps, r.imagesPath = f.images;
      }
      if (a.bones)
        for (var l = 0; l < a.bones.length; l++) {
          var p = a.bones[l], u = null, s = this.getValue(p, "parent", null);
          if (s != null && (u = r.findBone(s), u == null))
            throw new Error("Parent bone not found: " + s);
          var h = new o.BoneData(r.bones.length, p.name, u);
          h.length = this.getValue(p, "length", 0) * i, h.x = this.getValue(p, "x", 0) * i, h.y = this.getValue(p, "y", 0) * i, h.rotation = this.getValue(p, "rotation", 0), h.scaleX = this.getValue(p, "scaleX", 1), h.scaleY = this.getValue(p, "scaleY", 1), h.shearX = this.getValue(p, "shearX", 0), h.shearY = this.getValue(p, "shearY", 0), h.transformMode = n.transformModeFromString(this.getValue(p, "transform", "normal")), h.skinRequired = this.getValue(p, "skin", !1), r.bones.push(h);
        }
      if (a.slots)
        for (var l = 0; l < a.slots.length; l++) {
          var d = a.slots[l], c = d.name, M = d.bone, C = r.findBone(M);
          if (C == null)
            throw new Error("Slot bone not found: " + M);
          var h = new o.SlotData(r.slots.length, c, C), S = this.getValue(d, "color", null);
          S != null && h.color.setFromString(S);
          var L = this.getValue(d, "dark", null);
          L != null && (h.darkColor = new o.Color(1, 1, 1, 1), h.darkColor.setFromString(L)), h.attachmentName = this.getValue(d, "attachment", null), h.blendMode = n.blendModeFromString(this.getValue(d, "blend", "normal")), r.slots.push(h);
        }
      if (a.ik)
        for (var l = 0; l < a.ik.length; l++) {
          var E = a.ik[l], h = new o.IkConstraintData(E.name);
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
      if (a.transform)
        for (var l = 0; l < a.transform.length; l++) {
          var E = a.transform[l], h = new o.TransformConstraintData(E.name);
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
      if (a.path)
        for (var l = 0; l < a.path.length; l++) {
          var E = a.path[l], h = new o.PathConstraintData(E.name);
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
          h.positionMode = n.positionModeFromString(this.getValue(E, "positionMode", "percent")), h.spacingMode = n.spacingModeFromString(this.getValue(E, "spacingMode", "length")), h.rotateMode = n.rotateModeFromString(this.getValue(E, "rotateMode", "tangent")), h.offsetRotation = this.getValue(E, "rotation", 0), h.position = this.getValue(E, "position", 0), h.positionMode == o.PositionMode.Fixed && (h.position *= i), h.spacing = this.getValue(E, "spacing", 0), (h.spacingMode == o.SpacingMode.Length || h.spacingMode == o.SpacingMode.Fixed) && (h.spacing *= i), h.rotateMix = this.getValue(E, "rotateMix", 1), h.translateMix = this.getValue(E, "translateMix", 1), r.pathConstraints.push(h);
        }
      if (a.skins)
        for (var l = 0; l < a.skins.length; l++) {
          var x = a.skins[l], P = new o.Skin(x.name);
          if (x.bones)
            for (var I = 0; I < x.bones.length; I++) {
              var g = r.findBone(x.bones[I]);
              if (g == null)
                throw new Error("Skin bone not found: " + x.bones[l]);
              P.bones.push(g);
            }
          if (x.ik)
            for (var I = 0; I < x.ik.length; I++) {
              var O = r.findIkConstraint(x.ik[I]);
              if (O == null)
                throw new Error("Skin IK constraint not found: " + x.ik[l]);
              P.constraints.push(O);
            }
          if (x.transform)
            for (var I = 0; I < x.transform.length; I++) {
              var O = r.findTransformConstraint(x.transform[I]);
              if (O == null)
                throw new Error("Skin transform constraint not found: " + x.transform[l]);
              P.constraints.push(O);
            }
          if (x.path)
            for (var I = 0; I < x.path.length; I++) {
              var O = r.findPathConstraint(x.path[I]);
              if (O == null)
                throw new Error("Skin path constraint not found: " + x.path[l]);
              P.constraints.push(O);
            }
          for (var c in x.attachments) {
            var R = r.findSlot(c);
            if (R == null)
              throw new Error("Slot not found: " + c);
            var d = x.attachments[c];
            for (var D in d) {
              var N = this.readAttachment(d[D], P, R.index, D, r);
              N != null && P.setAttachment(R.index, D, N);
            }
          }
          r.skins.push(P), P.name == "default" && (r.defaultSkin = P);
        }
      for (var l = 0, k = this.linkedMeshes.length; l < k; l++) {
        var y = this.linkedMeshes[l], P = y.skin == null ? r.defaultSkin : r.findSkin(y.skin);
        if (P == null)
          throw new Error("Skin not found: " + y.skin);
        var T = P.getAttachment(y.slotIndex, y.parent);
        if (T == null)
          throw new Error("Parent mesh not found: " + y.parent);
        y.mesh.deformAttachment = y.inheritDeform ? T : y.mesh, y.mesh.setParentMesh(T), y.mesh.updateUVs();
      }
      if (this.linkedMeshes.length = 0, a.events)
        for (var B in a.events) {
          var V = a.events[B], h = new o.EventData(B);
          h.intValue = this.getValue(V, "int", 0), h.floatValue = this.getValue(V, "float", 0), h.stringValue = this.getValue(V, "string", ""), h.audioPath = this.getValue(V, "audio", null), h.audioPath != null && (h.volume = this.getValue(V, "volume", 1), h.balance = this.getValue(V, "balance", 0)), r.events.push(h);
        }
      if (a.animations)
        for (var G in a.animations) {
          var Y = a.animations[G];
          this.readAnimation(Y, G, r);
        }
      return r;
    }, n.prototype.readAttachment = function(t, i, r, a, f) {
      var l = this.scale;
      a = this.getValue(t, "name", a);
      var p = this.getValue(t, "type", "region");
      switch (p) {
        case "region": {
          var u = this.getValue(t, "path", a), s = this.attachmentLoader.newRegionAttachment(i, a, u);
          if (s == null)
            return null;
          s.path = u, s.x = this.getValue(t, "x", 0) * l, s.y = this.getValue(t, "y", 0) * l, s.scaleX = this.getValue(t, "scaleX", 1), s.scaleY = this.getValue(t, "scaleY", 1), s.rotation = this.getValue(t, "rotation", 0), s.width = t.width * l, s.height = t.height * l;
          var h = this.getValue(t, "color", null);
          return h != null && s.color.setFromString(h), s.updateOffset(), s;
        }
        case "boundingbox": {
          var d = this.attachmentLoader.newBoundingBoxAttachment(i, a);
          if (d == null)
            return null;
          this.readVertices(t, d, t.vertexCount << 1);
          var h = this.getValue(t, "color", null);
          return h != null && d.color.setFromString(h), d;
        }
        case "mesh":
        case "linkedmesh": {
          var u = this.getValue(t, "path", a), c = this.attachmentLoader.newMeshAttachment(i, a, u);
          if (c == null)
            return null;
          c.path = u;
          var h = this.getValue(t, "color", null);
          h != null && c.color.setFromString(h), c.width = this.getValue(t, "width", 0) * l, c.height = this.getValue(t, "height", 0) * l;
          var M = this.getValue(t, "parent", null);
          if (M != null)
            return this.linkedMeshes.push(new v(c, this.getValue(t, "skin", null), r, M, this.getValue(t, "deform", !0))), c;
          var C = t.uvs;
          return this.readVertices(t, c, C.length), c.triangles = t.triangles, c.regionUVs = C, c.updateUVs(), c.edges = this.getValue(t, "edges", null), c.hullLength = this.getValue(t, "hull", 0) * 2, c;
        }
        case "path": {
          var u = this.attachmentLoader.newPathAttachment(i, a);
          if (u == null)
            return null;
          u.closed = this.getValue(t, "closed", !1), u.constantSpeed = this.getValue(t, "constantSpeed", !0);
          var S = t.vertexCount;
          this.readVertices(t, u, S << 1);
          for (var L = o.Utils.newArray(S / 3, 0), E = 0; E < t.lengths.length; E++)
            L[E] = t.lengths[E] * l;
          u.lengths = L;
          var h = this.getValue(t, "color", null);
          return h != null && u.color.setFromString(h), u;
        }
        case "point": {
          var A = this.attachmentLoader.newPointAttachment(i, a);
          if (A == null)
            return null;
          A.x = this.getValue(t, "x", 0) * l, A.y = this.getValue(t, "y", 0) * l, A.rotation = this.getValue(t, "rotation", 0);
          var h = this.getValue(t, "color", null);
          return h != null && A.color.setFromString(h), A;
        }
        case "clipping": {
          var g = this.attachmentLoader.newClippingAttachment(i, a);
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
    }, n.prototype.readVertices = function(t, i, r) {
      var a = this.scale;
      i.worldVerticesLength = r;
      var f = t.vertices;
      if (r == f.length) {
        var l = o.Utils.toFloatArray(f);
        if (a != 1)
          for (var p = 0, u = f.length; p < u; p++)
            l[p] *= a;
        i.vertices = l;
        return;
      }
      for (var s = new Array(), h = new Array(), p = 0, u = f.length; p < u; ) {
        var d = f[p++];
        h.push(d);
        for (var c = p + d * 4; p < c; p += 4)
          h.push(f[p]), s.push(f[p + 1] * a), s.push(f[p + 2] * a), s.push(f[p + 3]);
      }
      i.bones = h, i.vertices = o.Utils.toFloatArray(s);
    }, n.prototype.readAnimation = function(t, i, r) {
      var a = this.scale, f = new Array(), l = 0;
      if (t.slots)
        for (var p in t.slots) {
          var u = t.slots[p], s = r.findSlotIndex(p);
          if (s == -1)
            throw new Error("Slot not found: " + p);
          for (var h in u) {
            var d = u[h];
            if (h == "attachment") {
              var c = new o.AttachmentTimeline(d.length);
              c.slotIndex = s;
              for (var M = 0, C = 0; C < d.length; C++) {
                var S = d[C];
                c.setFrame(M++, this.getValue(S, "time", 0), S.name);
              }
              f.push(c), l = Math.max(l, c.frames[c.getFrameCount() - 1]);
            } else if (h == "color") {
              var c = new o.ColorTimeline(d.length);
              c.slotIndex = s;
              for (var M = 0, C = 0; C < d.length; C++) {
                var S = d[C], L = new o.Color();
                L.setFromString(S.color), c.setFrame(M, this.getValue(S, "time", 0), L.r, L.g, L.b, L.a), this.readCurve(S, c, M), M++;
              }
              f.push(c), l = Math.max(l, c.frames[(c.getFrameCount() - 1) * o.ColorTimeline.ENTRIES]);
            } else if (h == "twoColor") {
              var c = new o.TwoColorTimeline(d.length);
              c.slotIndex = s;
              for (var M = 0, C = 0; C < d.length; C++) {
                var S = d[C], E = new o.Color(), A = new o.Color();
                E.setFromString(S.light), A.setFromString(S.dark), c.setFrame(M, this.getValue(S, "time", 0), E.r, E.g, E.b, E.a, A.r, A.g, A.b), this.readCurve(S, c, M), M++;
              }
              f.push(c), l = Math.max(l, c.frames[(c.getFrameCount() - 1) * o.TwoColorTimeline.ENTRIES]);
            } else
              throw new Error("Invalid timeline type for a slot: " + h + " (" + p + ")");
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
              var c = new o.RotateTimeline(d.length);
              c.boneIndex = x;
              for (var M = 0, C = 0; C < d.length; C++) {
                var S = d[C];
                c.setFrame(M, this.getValue(S, "time", 0), this.getValue(S, "angle", 0)), this.readCurve(S, c, M), M++;
              }
              f.push(c), l = Math.max(l, c.frames[(c.getFrameCount() - 1) * o.RotateTimeline.ENTRIES]);
            } else if (h === "translate" || h === "scale" || h === "shear") {
              var c = null, P = 1, I = 0;
              h === "scale" ? (c = new o.ScaleTimeline(d.length), I = 1) : h === "shear" ? c = new o.ShearTimeline(d.length) : (c = new o.TranslateTimeline(d.length), P = a), c.boneIndex = x;
              for (var M = 0, C = 0; C < d.length; C++) {
                var S = d[C], O = this.getValue(S, "x", I), R = this.getValue(S, "y", I);
                c.setFrame(M, this.getValue(S, "time", 0), O * P, R * P), this.readCurve(S, c, M), M++;
              }
              f.push(c), l = Math.max(l, c.frames[(c.getFrameCount() - 1) * o.TranslateTimeline.ENTRIES]);
            } else
              throw new Error("Invalid timeline type for a bone: " + h + " (" + g + ")");
          }
        }
      if (t.ik)
        for (var D in t.ik) {
          var N = t.ik[D], k = r.findIkConstraint(D), c = new o.IkConstraintTimeline(N.length);
          c.ikConstraintIndex = r.ikConstraints.indexOf(k);
          for (var M = 0, C = 0; C < N.length; C++) {
            var S = N[C];
            c.setFrame(M, this.getValue(S, "time", 0), this.getValue(S, "mix", 1), this.getValue(S, "softness", 0) * a, this.getValue(S, "bendPositive", !0) ? 1 : -1, this.getValue(S, "compress", !1), this.getValue(S, "stretch", !1)), this.readCurve(S, c, M), M++;
          }
          f.push(c), l = Math.max(l, c.frames[(c.getFrameCount() - 1) * o.IkConstraintTimeline.ENTRIES]);
        }
      if (t.transform)
        for (var D in t.transform) {
          var N = t.transform[D], k = r.findTransformConstraint(D), c = new o.TransformConstraintTimeline(N.length);
          c.transformConstraintIndex = r.transformConstraints.indexOf(k);
          for (var M = 0, C = 0; C < N.length; C++) {
            var S = N[C];
            c.setFrame(M, this.getValue(S, "time", 0), this.getValue(S, "rotateMix", 1), this.getValue(S, "translateMix", 1), this.getValue(S, "scaleMix", 1), this.getValue(S, "shearMix", 1)), this.readCurve(S, c, M), M++;
          }
          f.push(c), l = Math.max(l, c.frames[(c.getFrameCount() - 1) * o.TransformConstraintTimeline.ENTRIES]);
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
              var c = null, P = 1;
              h === "spacing" ? (c = new o.PathConstraintSpacingTimeline(d.length), (T.spacingMode == o.SpacingMode.Length || T.spacingMode == o.SpacingMode.Fixed) && (P = a)) : (c = new o.PathConstraintPositionTimeline(d.length), T.positionMode == o.PositionMode.Fixed && (P = a)), c.pathConstraintIndex = y;
              for (var M = 0, C = 0; C < d.length; C++) {
                var S = d[C];
                c.setFrame(M, this.getValue(S, "time", 0), this.getValue(S, h, 0) * P), this.readCurve(S, c, M), M++;
              }
              f.push(c), l = Math.max(l, c.frames[(c.getFrameCount() - 1) * o.PathConstraintPositionTimeline.ENTRIES]);
            } else if (h === "mix") {
              var c = new o.PathConstraintMixTimeline(d.length);
              c.pathConstraintIndex = y;
              for (var M = 0, C = 0; C < d.length; C++) {
                var S = d[C];
                c.setFrame(M, this.getValue(S, "time", 0), this.getValue(S, "rotateMix", 1), this.getValue(S, "translateMix", 1)), this.readCurve(S, c, M), M++;
              }
              f.push(c), l = Math.max(l, c.frames[(c.getFrameCount() - 1) * o.PathConstraintMixTimeline.ENTRIES]);
            }
          }
        }
      if (t.deform)
        for (var B in t.deform) {
          var V = t.deform[B], G = r.findSkin(B);
          if (G == null)
            throw new Error("Skin not found: " + B);
          for (var p in V) {
            var u = V[p], s = r.findSlotIndex(p);
            if (s == -1)
              throw new Error("Slot not found: " + u.name);
            for (var h in u) {
              var d = u[h], Y = G.getAttachment(s, h);
              if (Y == null)
                throw new Error("Deform attachment not found: " + d.name);
              var X = Y.bones != null, _ = Y.vertices, W = X ? _.length / 3 * 2 : _.length, c = new o.DeformTimeline(d.length);
              c.slotIndex = s, c.attachment = Y;
              for (var M = 0, U = 0; U < d.length; U++) {
                var S = d[U], w = void 0, Z = this.getValue(S, "vertices", null);
                if (Z == null)
                  w = X ? o.Utils.newFloatArray(W) : _;
                else {
                  w = o.Utils.newFloatArray(W);
                  var z = this.getValue(S, "offset", 0);
                  if (o.Utils.arrayCopy(Z, 0, w, z, Z.length), a != 1)
                    for (var C = z, j = C + Z.length; C < j; C++)
                      w[C] *= a;
                  if (!X)
                    for (var C = 0; C < W; C++)
                      w[C] += _[C];
                }
                c.setFrame(M, this.getValue(S, "time", 0), w), this.readCurve(S, c, M), M++;
              }
              f.push(c), l = Math.max(l, c.frames[c.getFrameCount() - 1]);
            }
          }
        }
      var H = t.drawOrder;
      if (H == null && (H = t.draworder), H != null) {
        for (var c = new o.DrawOrderTimeline(H.length), J = r.slots.length, M = 0, U = 0; U < H.length; U++) {
          var tt = H[U], q = null, at = this.getValue(tt, "offsets", null);
          if (at != null) {
            q = o.Utils.newArray(J, -1);
            for (var nt = o.Utils.newArray(J - at.length, 0), ct = 0, ut = 0, C = 0; C < at.length; C++) {
              var st = at[C], s = r.findSlotIndex(st.slot);
              if (s == -1)
                throw new Error("Slot not found: " + st.slot);
              for (; ct != s; )
                nt[ut++] = ct++;
              q[ct + st.offset] = ct++;
            }
            for (; ct < J; )
              nt[ut++] = ct++;
            for (var C = J - 1; C >= 0; C--)
              q[C] == -1 && (q[C] = nt[--ut]);
          }
          c.setFrame(M++, this.getValue(tt, "time", 0), q);
        }
        f.push(c), l = Math.max(l, c.frames[c.getFrameCount() - 1]);
      }
      if (t.events) {
        for (var c = new o.EventTimeline(t.events.length), M = 0, C = 0; C < t.events.length; C++) {
          var ft = t.events[C], ot = r.findEvent(ft.name);
          if (ot == null)
            throw new Error("Event not found: " + ft.name);
          var ht = new o.Event(o.Utils.toSinglePrecision(this.getValue(ft, "time", 0)), ot);
          ht.intValue = this.getValue(ft, "int", ot.intValue), ht.floatValue = this.getValue(ft, "float", ot.floatValue), ht.stringValue = this.getValue(ft, "string", ot.stringValue), ht.data.audioPath != null && (ht.volume = this.getValue(ft, "volume", 1), ht.balance = this.getValue(ft, "balance", 0)), c.setFrame(M++, ht);
        }
        f.push(c), l = Math.max(l, c.frames[c.getFrameCount() - 1]);
      }
      if (isNaN(l))
        throw new Error("Error while parsing animation, duration is NaN");
      r.animations.push(new o.Animation(i, f, l));
    }, n.prototype.readCurve = function(t, i, r) {
      if (t.hasOwnProperty("curve"))
        if (t.curve == "stepped")
          i.setStepped(r);
        else {
          var a = t.curve;
          i.setCurve(r, a, this.getValue(t, "c2", 0), this.getValue(t, "c3", 1), this.getValue(t, "c4", 1));
        }
    }, n.prototype.getValue = function(t, i, r) {
      return t[i] !== void 0 ? t[i] : r;
    }, n.blendModeFromString = function(t) {
      if (t = t.toLowerCase(), t == "normal")
        return o.BlendMode.Normal;
      if (t == "additive")
        return o.BlendMode.Additive;
      if (t == "multiply")
        return o.BlendMode.Multiply;
      if (t == "screen")
        return o.BlendMode.Screen;
      throw new Error("Unknown blend mode: " + t);
    }, n.positionModeFromString = function(t) {
      if (t = t.toLowerCase(), t == "fixed")
        return o.PositionMode.Fixed;
      if (t == "percent")
        return o.PositionMode.Percent;
      throw new Error("Unknown position mode: " + t);
    }, n.spacingModeFromString = function(t) {
      if (t = t.toLowerCase(), t == "length")
        return o.SpacingMode.Length;
      if (t == "fixed")
        return o.SpacingMode.Fixed;
      if (t == "percent")
        return o.SpacingMode.Percent;
      throw new Error("Unknown position mode: " + t);
    }, n.rotateModeFromString = function(t) {
      if (t = t.toLowerCase(), t == "tangent")
        return o.RotateMode.Tangent;
      if (t == "chain")
        return o.RotateMode.Chain;
      if (t == "chainscale")
        return o.RotateMode.ChainScale;
      throw new Error("Unknown rotate mode: " + t);
    }, n.transformModeFromString = function(t) {
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
    }, n;
  })();
  o.SkeletonJson = e;
  var v = /* @__PURE__ */ (function() {
    function n(t, i, r, a, f) {
      this.mesh = t, this.skin = i, this.slotIndex = r, this.parent = a, this.inheritDeform = f;
    }
    return n;
  })();
})(F || (F = {}));
var F;
(function(o) {
  var e = /* @__PURE__ */ (function() {
    function n(t, i, r) {
      this.slotIndex = t, this.name = i, this.attachment = r;
    }
    return n;
  })();
  o.SkinEntry = e;
  var v = (function() {
    function n(t) {
      if (this.attachments = new Array(), this.bones = Array(), this.constraints = new Array(), t == null)
        throw new Error("name cannot be null.");
      this.name = t;
    }
    return n.prototype.setAttachment = function(t, i, r) {
      if (r == null)
        throw new Error("attachment cannot be null.");
      var a = this.attachments;
      t >= a.length && (a.length = t + 1), a[t] || (a[t] = {}), a[t][i] = r;
    }, n.prototype.addSkin = function(t) {
      for (var i = 0; i < t.bones.length; i++) {
        for (var r = t.bones[i], a = !1, f = 0; f < this.bones.length; f++)
          if (this.bones[f] == r) {
            a = !0;
            break;
          }
        a || this.bones.push(r);
      }
      for (var i = 0; i < t.constraints.length; i++) {
        for (var l = t.constraints[i], a = !1, f = 0; f < this.constraints.length; f++)
          if (this.constraints[f] == l) {
            a = !0;
            break;
          }
        a || this.constraints.push(l);
      }
      for (var p = t.getAttachments(), i = 0; i < p.length; i++) {
        var u = p[i];
        this.setAttachment(u.slotIndex, u.name, u.attachment);
      }
    }, n.prototype.copySkin = function(t) {
      for (var i = 0; i < t.bones.length; i++) {
        for (var r = t.bones[i], a = !1, f = 0; f < this.bones.length; f++)
          if (this.bones[f] == r) {
            a = !0;
            break;
          }
        a || this.bones.push(r);
      }
      for (var i = 0; i < t.constraints.length; i++) {
        for (var l = t.constraints[i], a = !1, f = 0; f < this.constraints.length; f++)
          if (this.constraints[f] == l) {
            a = !0;
            break;
          }
        a || this.constraints.push(l);
      }
      for (var p = t.getAttachments(), i = 0; i < p.length; i++) {
        var u = p[i];
        u.attachment != null && (u.attachment instanceof o.MeshAttachment ? (u.attachment = u.attachment.newLinkedMesh(), this.setAttachment(u.slotIndex, u.name, u.attachment)) : (u.attachment = u.attachment.copy(), this.setAttachment(u.slotIndex, u.name, u.attachment)));
      }
    }, n.prototype.getAttachment = function(t, i) {
      var r = this.attachments[t];
      return r ? r[i] : null;
    }, n.prototype.removeAttachment = function(t, i) {
      var r = this.attachments[t];
      r && (r[i] = null);
    }, n.prototype.getAttachments = function() {
      for (var t = new Array(), i = 0; i < this.attachments.length; i++) {
        var r = this.attachments[i];
        if (r)
          for (var a in r) {
            var f = r[a];
            f && t.push(new e(i, a, f));
          }
      }
      return t;
    }, n.prototype.getAttachmentsForSlot = function(t, i) {
      var r = this.attachments[t];
      if (r)
        for (var a in r) {
          var f = r[a];
          f && i.push(new e(t, a, f));
        }
    }, n.prototype.clear = function() {
      this.attachments.length = 0, this.bones.length = 0, this.constraints.length = 0;
    }, n.prototype.attachAll = function(t, i) {
      for (var r = 0, a = 0; a < t.slots.length; a++) {
        var f = t.slots[a], l = f.getAttachment();
        if (l && r < i.attachments.length) {
          var p = i.attachments[r];
          for (var u in p) {
            var s = p[u];
            if (l == s) {
              var h = this.getAttachment(r, u);
              h != null && f.setAttachment(h);
              break;
            }
          }
        }
        r++;
      }
    }, n;
  })();
  o.Skin = v;
})(F || (F = {}));
var F;
(function(o) {
  var e = (function() {
    function v(n, t) {
      if (this.deform = new Array(), n == null)
        throw new Error("data cannot be null.");
      if (t == null)
        throw new Error("bone cannot be null.");
      this.data = n, this.bone = t, this.color = new o.Color(), this.darkColor = n.darkColor == null ? null : new o.Color(), this.setToSetupPose();
    }
    return v.prototype.getSkeleton = function() {
      return this.bone.skeleton;
    }, v.prototype.getAttachment = function() {
      return this.attachment;
    }, v.prototype.setAttachment = function(n) {
      this.attachment != n && (this.attachment = n, this.attachmentTime = this.bone.skeleton.time, this.deform.length = 0);
    }, v.prototype.setAttachmentTime = function(n) {
      this.attachmentTime = this.bone.skeleton.time - n;
    }, v.prototype.getAttachmentTime = function() {
      return this.bone.skeleton.time - this.attachmentTime;
    }, v.prototype.setToSetupPose = function() {
      this.color.setFromColor(this.data.color), this.darkColor != null && this.darkColor.setFromColor(this.data.darkColor), this.data.attachmentName == null ? this.attachment = null : (this.attachment = null, this.setAttachment(this.bone.skeleton.getAttachment(this.data.index, this.data.attachmentName)));
    }, v;
  })();
  o.Slot = e;
})(F || (F = {}));
var F;
(function(o) {
  var e = /* @__PURE__ */ (function() {
    function v(n, t, i) {
      if (this.color = new o.Color(1, 1, 1, 1), n < 0)
        throw new Error("index must be >= 0.");
      if (t == null)
        throw new Error("name cannot be null.");
      if (i == null)
        throw new Error("boneData cannot be null.");
      this.index = n, this.name = t, this.boneData = i;
    }
    return v;
  })();
  o.SlotData = e;
})(F || (F = {}));
var F;
(function(o) {
  var e = (function() {
    function r(a) {
      this._image = a;
    }
    return r.prototype.getImage = function() {
      return this._image;
    }, r.filterFromString = function(a) {
      switch (a.toLowerCase()) {
        case "nearest":
          return v.Nearest;
        case "linear":
          return v.Linear;
        case "mipmap":
          return v.MipMap;
        case "mipmapnearestnearest":
          return v.MipMapNearestNearest;
        case "mipmaplinearnearest":
          return v.MipMapLinearNearest;
        case "mipmapnearestlinear":
          return v.MipMapNearestLinear;
        case "mipmaplinearlinear":
          return v.MipMapLinearLinear;
        default:
          throw new Error("Unknown texture filter " + a);
      }
    }, r.wrapFromString = function(a) {
      switch (a.toLowerCase()) {
        case "mirroredtepeat":
          return n.MirroredRepeat;
        case "clamptoedge":
          return n.ClampToEdge;
        case "repeat":
          return n.Repeat;
        default:
          throw new Error("Unknown texture wrap " + a);
      }
    }, r;
  })();
  o.Texture = e;
  var v;
  (function(r) {
    r[r.Nearest = 9728] = "Nearest", r[r.Linear = 9729] = "Linear", r[r.MipMap = 9987] = "MipMap", r[r.MipMapNearestNearest = 9984] = "MipMapNearestNearest", r[r.MipMapLinearNearest = 9985] = "MipMapLinearNearest", r[r.MipMapNearestLinear = 9986] = "MipMapNearestLinear", r[r.MipMapLinearLinear = 9987] = "MipMapLinearLinear";
  })(v = o.TextureFilter || (o.TextureFilter = {}));
  var n;
  (function(r) {
    r[r.MirroredRepeat = 33648] = "MirroredRepeat", r[r.ClampToEdge = 33071] = "ClampToEdge", r[r.Repeat = 10497] = "Repeat";
  })(n = o.TextureWrap || (o.TextureWrap = {}));
  var t = /* @__PURE__ */ (function() {
    function r() {
      this.u = 0, this.v = 0, this.u2 = 0, this.v2 = 0, this.width = 0, this.height = 0, this.rotate = !1, this.offsetX = 0, this.offsetY = 0, this.originalWidth = 0, this.originalHeight = 0;
    }
    return r;
  })();
  o.TextureRegion = t;
  var i = (function(r) {
    $(a, r);
    function a() {
      return r !== null && r.apply(this, arguments) || this;
    }
    return a.prototype.setFilters = function(f, l) {
    }, a.prototype.setWraps = function(f, l) {
    }, a.prototype.dispose = function() {
    }, a;
  })(e);
  o.FakeTexture = i;
})(F || (F = {}));
var F;
(function(o) {
  var e = (function() {
    function i(r, a) {
      this.pages = new Array(), this.regions = new Array(), this.load(r, a);
    }
    return i.prototype.load = function(r, a) {
      if (a == null)
        throw new Error("textureLoader cannot be null.");
      for (var f = new v(r), l = new Array(4), p = null; ; ) {
        var u = f.readLine();
        if (u == null)
          break;
        if (u = u.trim(), u.length == 0)
          p = null;
        else if (p) {
          var h = new t();
          h.name = u, h.page = p;
          var d = f.readValue();
          d.toLocaleLowerCase() == "true" ? h.degrees = 90 : d.toLocaleLowerCase() == "false" ? h.degrees = 0 : h.degrees = parseFloat(d), h.rotate = h.degrees == 90, f.readTuple(l);
          var c = parseInt(l[0]), M = parseInt(l[1]);
          f.readTuple(l);
          var C = parseInt(l[0]), S = parseInt(l[1]);
          h.u = c / p.width, h.v = M / p.height, h.rotate ? (h.u2 = (c + S) / p.width, h.v2 = (M + C) / p.height) : (h.u2 = (c + C) / p.width, h.v2 = (M + S) / p.height), h.x = c, h.y = M, h.width = Math.abs(C), h.height = Math.abs(S), f.readTuple(l) == 4 && f.readTuple(l) == 4 && f.readTuple(l), h.originalWidth = parseInt(l[0]), h.originalHeight = parseInt(l[1]), f.readTuple(l), h.offsetX = parseInt(l[0]), h.offsetY = parseInt(l[1]), h.index = parseInt(f.readValue()), h.texture = p.texture, this.regions.push(h);
        } else {
          p = new n(), p.name = u, f.readTuple(l) == 2 && (p.width = parseInt(l[0]), p.height = parseInt(l[1]), f.readTuple(l)), f.readTuple(l), p.minFilter = o.Texture.filterFromString(l[0]), p.magFilter = o.Texture.filterFromString(l[1]);
          var s = f.readValue();
          p.uWrap = o.TextureWrap.ClampToEdge, p.vWrap = o.TextureWrap.ClampToEdge, s == "x" ? p.uWrap = o.TextureWrap.Repeat : s == "y" ? p.vWrap = o.TextureWrap.Repeat : s == "xy" && (p.uWrap = p.vWrap = o.TextureWrap.Repeat), p.texture = a(u), p.texture.setFilters(p.minFilter, p.magFilter), p.texture.setWraps(p.uWrap, p.vWrap), p.width = p.texture.getImage().width, p.height = p.texture.getImage().height, this.pages.push(p);
        }
      }
    }, i.prototype.findRegion = function(r) {
      for (var a = 0; a < this.regions.length; a++)
        if (this.regions[a].name == r)
          return this.regions[a];
      return null;
    }, i.prototype.dispose = function() {
      for (var r = 0; r < this.pages.length; r++)
        this.pages[r].texture.dispose();
    }, i;
  })();
  o.TextureAtlas = e;
  var v = (function() {
    function i(r) {
      this.index = 0, this.lines = r.split(/\r\n|\r|\n/);
    }
    return i.prototype.readLine = function() {
      return this.index >= this.lines.length ? null : this.lines[this.index++];
    }, i.prototype.readValue = function() {
      var r = this.readLine(), a = r.indexOf(":");
      if (a == -1)
        throw new Error("Invalid line: " + r);
      return r.substring(a + 1).trim();
    }, i.prototype.readTuple = function(r) {
      var a = this.readLine(), f = a.indexOf(":");
      if (f == -1)
        throw new Error("Invalid line: " + a);
      for (var l = 0, p = f + 1; l < 3; l++) {
        var u = a.indexOf(",", p);
        if (u == -1)
          break;
        r[l] = a.substr(p, u - p).trim(), p = u + 1;
      }
      return r[l] = a.substring(p).trim(), l + 1;
    }, i;
  })(), n = /* @__PURE__ */ (function() {
    function i() {
    }
    return i;
  })();
  o.TextureAtlasPage = n;
  var t = (function(i) {
    $(r, i);
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
    function v(n, t) {
      if (this.rotateMix = 0, this.translateMix = 0, this.scaleMix = 0, this.shearMix = 0, this.temp = new o.Vector2(), this.active = !1, n == null)
        throw new Error("data cannot be null.");
      if (t == null)
        throw new Error("skeleton cannot be null.");
      this.data = n, this.rotateMix = n.rotateMix, this.translateMix = n.translateMix, this.scaleMix = n.scaleMix, this.shearMix = n.shearMix, this.bones = new Array();
      for (var i = 0; i < n.bones.length; i++)
        this.bones.push(t.findBone(n.bones[i].name));
      this.target = t.findBone(n.target.name);
    }
    return v.prototype.isActive = function() {
      return this.active;
    }, v.prototype.apply = function() {
      this.update();
    }, v.prototype.update = function() {
      this.data.local ? this.data.relative ? this.applyRelativeLocal() : this.applyAbsoluteLocal() : this.data.relative ? this.applyRelativeWorld() : this.applyAbsoluteWorld();
    }, v.prototype.applyAbsoluteWorld = function() {
      for (var n = this.rotateMix, t = this.translateMix, i = this.scaleMix, r = this.shearMix, a = this.target, f = a.a, l = a.b, p = a.c, u = a.d, s = f * u - l * p > 0 ? o.MathUtils.degRad : -o.MathUtils.degRad, h = this.data.offsetRotation * s, d = this.data.offsetShearY * s, c = this.bones, M = 0, C = c.length; M < C; M++) {
        var S = c[M], L = !1;
        if (n != 0) {
          var E = S.a, A = S.b, g = S.c, m = S.d, x = Math.atan2(p, f) - Math.atan2(g, E) + h;
          x > o.MathUtils.PI ? x -= o.MathUtils.PI2 : x < -o.MathUtils.PI && (x += o.MathUtils.PI2), x *= n;
          var P = Math.cos(x), I = Math.sin(x);
          S.a = P * E - I * g, S.b = P * A - I * m, S.c = I * E + P * g, S.d = I * A + P * m, L = !0;
        }
        if (t != 0) {
          var O = this.temp;
          a.localToWorld(O.set(this.data.offsetX, this.data.offsetY)), S.worldX += (O.x - S.worldX) * t, S.worldY += (O.y - S.worldY) * t, L = !0;
        }
        if (i > 0) {
          var R = Math.sqrt(S.a * S.a + S.c * S.c), D = Math.sqrt(f * f + p * p);
          R > 1e-5 && (R = (R + (D - R + this.data.offsetScaleX) * i) / R), S.a *= R, S.c *= R, R = Math.sqrt(S.b * S.b + S.d * S.d), D = Math.sqrt(l * l + u * u), R > 1e-5 && (R = (R + (D - R + this.data.offsetScaleY) * i) / R), S.b *= R, S.d *= R, L = !0;
        }
        if (r > 0) {
          var A = S.b, m = S.d, N = Math.atan2(m, A), x = Math.atan2(u, l) - Math.atan2(p, f) - (N - Math.atan2(S.c, S.a));
          x > o.MathUtils.PI ? x -= o.MathUtils.PI2 : x < -o.MathUtils.PI && (x += o.MathUtils.PI2), x = N + (x + d) * r;
          var R = Math.sqrt(A * A + m * m);
          S.b = Math.cos(x) * R, S.d = Math.sin(x) * R, L = !0;
        }
        L && (S.appliedValid = !1);
      }
    }, v.prototype.applyRelativeWorld = function() {
      for (var n = this.rotateMix, t = this.translateMix, i = this.scaleMix, r = this.shearMix, a = this.target, f = a.a, l = a.b, p = a.c, u = a.d, s = f * u - l * p > 0 ? o.MathUtils.degRad : -o.MathUtils.degRad, h = this.data.offsetRotation * s, d = this.data.offsetShearY * s, c = this.bones, M = 0, C = c.length; M < C; M++) {
        var S = c[M], L = !1;
        if (n != 0) {
          var E = S.a, A = S.b, g = S.c, m = S.d, x = Math.atan2(p, f) + h;
          x > o.MathUtils.PI ? x -= o.MathUtils.PI2 : x < -o.MathUtils.PI && (x += o.MathUtils.PI2), x *= n;
          var P = Math.cos(x), I = Math.sin(x);
          S.a = P * E - I * g, S.b = P * A - I * m, S.c = I * E + P * g, S.d = I * A + P * m, L = !0;
        }
        if (t != 0) {
          var O = this.temp;
          a.localToWorld(O.set(this.data.offsetX, this.data.offsetY)), S.worldX += O.x * t, S.worldY += O.y * t, L = !0;
        }
        if (i > 0) {
          var R = (Math.sqrt(f * f + p * p) - 1 + this.data.offsetScaleX) * i + 1;
          S.a *= R, S.c *= R, R = (Math.sqrt(l * l + u * u) - 1 + this.data.offsetScaleY) * i + 1, S.b *= R, S.d *= R, L = !0;
        }
        if (r > 0) {
          var x = Math.atan2(u, l) - Math.atan2(p, f);
          x > o.MathUtils.PI ? x -= o.MathUtils.PI2 : x < -o.MathUtils.PI && (x += o.MathUtils.PI2);
          var A = S.b, m = S.d;
          x = Math.atan2(m, A) + (x - o.MathUtils.PI / 2 + d) * r;
          var R = Math.sqrt(A * A + m * m);
          S.b = Math.cos(x) * R, S.d = Math.sin(x) * R, L = !0;
        }
        L && (S.appliedValid = !1);
      }
    }, v.prototype.applyAbsoluteLocal = function() {
      var n = this.rotateMix, t = this.translateMix, i = this.scaleMix, r = this.shearMix, a = this.target;
      a.appliedValid || a.updateAppliedTransform();
      for (var f = this.bones, l = 0, p = f.length; l < p; l++) {
        var u = f[l];
        u.appliedValid || u.updateAppliedTransform();
        var s = u.arotation;
        if (n != 0) {
          var h = a.arotation - s + this.data.offsetRotation;
          h -= (16384 - (16384.499999999996 - h / 360 | 0)) * 360, s += h * n;
        }
        var d = u.ax, c = u.ay;
        t != 0 && (d += (a.ax - d + this.data.offsetX) * t, c += (a.ay - c + this.data.offsetY) * t);
        var M = u.ascaleX, C = u.ascaleY;
        i != 0 && (M > 1e-5 && (M = (M + (a.ascaleX - M + this.data.offsetScaleX) * i) / M), C > 1e-5 && (C = (C + (a.ascaleY - C + this.data.offsetScaleY) * i) / C));
        var S = u.ashearY;
        if (r != 0) {
          var h = a.ashearY - S + this.data.offsetShearY;
          h -= (16384 - (16384.499999999996 - h / 360 | 0)) * 360, u.shearY += h * r;
        }
        u.updateWorldTransformWith(d, c, s, M, C, u.ashearX, S);
      }
    }, v.prototype.applyRelativeLocal = function() {
      var n = this.rotateMix, t = this.translateMix, i = this.scaleMix, r = this.shearMix, a = this.target;
      a.appliedValid || a.updateAppliedTransform();
      for (var f = this.bones, l = 0, p = f.length; l < p; l++) {
        var u = f[l];
        u.appliedValid || u.updateAppliedTransform();
        var s = u.arotation;
        n != 0 && (s += (a.arotation + this.data.offsetRotation) * n);
        var h = u.ax, d = u.ay;
        t != 0 && (h += (a.ax + this.data.offsetX) * t, d += (a.ay + this.data.offsetY) * t);
        var c = u.ascaleX, M = u.ascaleY;
        i != 0 && (c > 1e-5 && (c *= (a.ascaleX - 1 + this.data.offsetScaleX) * i + 1), M > 1e-5 && (M *= (a.ascaleY - 1 + this.data.offsetScaleY) * i + 1));
        var C = u.ashearY;
        r != 0 && (C += (a.ashearY + this.data.offsetShearY) * r), u.updateWorldTransformWith(h, d, s, c, M, u.ashearX, C);
      }
    }, v;
  })();
  o.TransformConstraint = e;
})(F || (F = {}));
var F;
(function(o) {
  var e = (function(v) {
    $(n, v);
    function n(t) {
      var i = v.call(this, t, 0, !1) || this;
      return i.bones = new Array(), i.rotateMix = 0, i.translateMix = 0, i.scaleMix = 0, i.shearMix = 0, i.offsetRotation = 0, i.offsetX = 0, i.offsetY = 0, i.offsetScaleX = 0, i.offsetScaleY = 0, i.offsetShearY = 0, i.relative = !1, i.local = !1, i;
    }
    return n;
  })(o.ConstraintData);
  o.TransformConstraintData = e;
})(F || (F = {}));
var F;
(function(o) {
  var e = (function() {
    function v() {
      this.convexPolygons = new Array(), this.convexPolygonsIndices = new Array(), this.indicesArray = new Array(), this.isConcaveArray = new Array(), this.triangles = new Array(), this.polygonPool = new o.Pool(function() {
        return new Array();
      }), this.polygonIndicesPool = new o.Pool(function() {
        return new Array();
      });
    }
    return v.prototype.triangulate = function(n) {
      var t = n, i = n.length >> 1, r = this.indicesArray;
      r.length = 0;
      for (var a = 0; a < i; a++)
        r[a] = a;
      var f = this.isConcaveArray;
      f.length = 0;
      for (var a = 0, l = i; a < l; ++a)
        f[a] = v.isConcave(a, i, t, r);
      var p = this.triangles;
      for (p.length = 0; i > 3; ) {
        for (var u = i - 1, a = 0, s = 1; ; ) {
          t: if (!f[a]) {
            for (var h = r[u] << 1, d = r[a] << 1, c = r[s] << 1, M = t[h], C = t[h + 1], S = t[d], L = t[d + 1], E = t[c], A = t[c + 1], g = (s + 1) % i; g != u; g = (g + 1) % i)
              if (f[g]) {
                var m = r[g] << 1, x = t[m], P = t[m + 1];
                if (v.positiveArea(E, A, M, C, x, P) && v.positiveArea(M, C, S, L, x, P) && v.positiveArea(S, L, E, A, x, P))
                  break t;
              }
            break;
          }
          if (s == 0) {
            do {
              if (!f[a])
                break;
              a--;
            } while (a > 0);
            break;
          }
          u = a, a = s, s = (s + 1) % i;
        }
        p.push(r[(i + a - 1) % i]), p.push(r[a]), p.push(r[(a + 1) % i]), r.splice(a, 1), f.splice(a, 1), i--;
        var I = (i + a - 1) % i, O = a == i ? 0 : a;
        f[I] = v.isConcave(I, i, t, r), f[O] = v.isConcave(O, i, t, r);
      }
      return i == 3 && (p.push(r[2]), p.push(r[0]), p.push(r[1])), p;
    }, v.prototype.decompose = function(n, t) {
      var i = n, r = this.convexPolygons;
      this.polygonPool.freeAll(r), r.length = 0;
      var a = this.convexPolygonsIndices;
      this.polygonIndicesPool.freeAll(a), a.length = 0;
      var f = this.polygonIndicesPool.obtain();
      f.length = 0;
      var l = this.polygonPool.obtain();
      l.length = 0;
      for (var p = -1, u = 0, s = 0, h = t.length; s < h; s += 3) {
        var d = t[s] << 1, c = t[s + 1] << 1, M = t[s + 2] << 1, C = i[d], S = i[d + 1], L = i[c], E = i[c + 1], A = i[M], g = i[M + 1], m = !1;
        if (p == d) {
          var x = l.length - 4, P = v.winding(l[x], l[x + 1], l[x + 2], l[x + 3], A, g), I = v.winding(A, g, l[0], l[1], l[2], l[3]);
          P == u && I == u && (l.push(A), l.push(g), f.push(M), m = !0);
        }
        m || (l.length > 0 ? (r.push(l), a.push(f)) : (this.polygonPool.free(l), this.polygonIndicesPool.free(f)), l = this.polygonPool.obtain(), l.length = 0, l.push(C), l.push(S), l.push(L), l.push(E), l.push(A), l.push(g), f = this.polygonIndicesPool.obtain(), f.length = 0, f.push(d), f.push(c), f.push(M), u = v.winding(C, S, L, E, A, g), p = d);
      }
      l.length > 0 && (r.push(l), a.push(f));
      for (var s = 0, h = r.length; s < h; s++)
        if (f = a[s], f.length != 0) {
          var O = f[0], R = f[f.length - 1];
          l = r[s];
          for (var x = l.length - 4, D = l[x], N = l[x + 1], k = l[x + 2], y = l[x + 3], T = l[0], B = l[1], V = l[2], G = l[3], Y = v.winding(D, N, k, y, T, B), X = 0; X < h; X++)
            if (X != s) {
              var _ = a[X];
              if (_.length == 3) {
                var W = _[0], U = _[1], w = _[2], Z = r[X], A = Z[Z.length - 2], g = Z[Z.length - 1];
                if (!(W != O || U != R)) {
                  var P = v.winding(D, N, k, y, A, g), I = v.winding(A, g, T, B, V, G);
                  P == Y && I == Y && (Z.length = 0, _.length = 0, l.push(A), l.push(g), f.push(w), D = k, N = y, k = A, y = g, X = 0);
                }
              }
            }
        }
      for (var s = r.length - 1; s >= 0; s--)
        l = r[s], l.length == 0 && (r.splice(s, 1), this.polygonPool.free(l), f = a[s], a.splice(s, 1), this.polygonIndicesPool.free(f));
      return r;
    }, v.isConcave = function(n, t, i, r) {
      var a = r[(t + n - 1) % t] << 1, f = r[n] << 1, l = r[(n + 1) % t] << 1;
      return !this.positiveArea(i[a], i[a + 1], i[f], i[f + 1], i[l], i[l + 1]);
    }, v.positiveArea = function(n, t, i, r, a, f) {
      return n * (f - r) + i * (t - f) + a * (r - t) >= 0;
    }, v.winding = function(n, t, i, r, a, f) {
      var l = i - n, p = r - t;
      return a * p - f * l + l * t - n * p >= 0 ? 1 : -1;
    }, v;
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
      var c = this.contains(d);
      return this.array[d | 0] = d | 0, !c;
    }, h.prototype.contains = function(d) {
      return this.array[d | 0] != null;
    }, h.prototype.remove = function(d) {
      this.array[d | 0] = void 0;
    }, h.prototype.clear = function() {
      this.array.length = 0;
    }, h;
  })();
  o.IntSet = e;
  var v = (function() {
    function h(d, c, M, C) {
      d === void 0 && (d = 0), c === void 0 && (c = 0), M === void 0 && (M = 0), C === void 0 && (C = 0), this.r = d, this.g = c, this.b = M, this.a = C;
    }
    return h.prototype.set = function(d, c, M, C) {
      return this.r = d, this.g = c, this.b = M, this.a = C, this.clamp(), this;
    }, h.prototype.setFromColor = function(d) {
      return this.r = d.r, this.g = d.g, this.b = d.b, this.a = d.a, this;
    }, h.prototype.setFromString = function(d) {
      return d = d.charAt(0) == "#" ? d.substr(1) : d, this.r = parseInt(d.substr(0, 2), 16) / 255, this.g = parseInt(d.substr(2, 2), 16) / 255, this.b = parseInt(d.substr(4, 2), 16) / 255, this.a = (d.length != 8 ? 255 : parseInt(d.substr(6, 2), 16)) / 255, this;
    }, h.prototype.add = function(d, c, M, C) {
      return this.r += d, this.g += c, this.b += M, this.a += C, this.clamp(), this;
    }, h.prototype.clamp = function() {
      return this.r < 0 ? this.r = 0 : this.r > 1 && (this.r = 1), this.g < 0 ? this.g = 0 : this.g > 1 && (this.g = 1), this.b < 0 ? this.b = 0 : this.b > 1 && (this.b = 1), this.a < 0 ? this.a = 0 : this.a > 1 && (this.a = 1), this;
    }, h.rgba8888ToColor = function(d, c) {
      d.r = ((c & 4278190080) >>> 24) / 255, d.g = ((c & 16711680) >>> 16) / 255, d.b = ((c & 65280) >>> 8) / 255, d.a = (c & 255) / 255;
    }, h.rgb888ToColor = function(d, c) {
      d.r = ((c & 16711680) >>> 16) / 255, d.g = ((c & 65280) >>> 8) / 255, d.b = (c & 255) / 255;
    }, h.WHITE = new h(1, 1, 1, 1), h.RED = new h(1, 0, 0, 1), h.GREEN = new h(0, 1, 0, 1), h.BLUE = new h(0, 0, 1, 1), h.MAGENTA = new h(1, 0, 1, 1), h;
  })();
  o.Color = v;
  var n = (function() {
    function h() {
    }
    return h.clamp = function(d, c, M) {
      return d < c ? c : d > M ? M : d;
    }, h.cosDeg = function(d) {
      return Math.cos(d * h.degRad);
    }, h.sinDeg = function(d) {
      return Math.sin(d * h.degRad);
    }, h.signum = function(d) {
      return d > 0 ? 1 : d < 0 ? -1 : 0;
    }, h.toInt = function(d) {
      return d > 0 ? Math.floor(d) : Math.ceil(d);
    }, h.cbrt = function(d) {
      var c = Math.pow(Math.abs(d), 0.3333333333333333);
      return d < 0 ? -c : c;
    }, h.randomTriangular = function(d, c) {
      return h.randomTriangularWith(d, c, (d + c) * 0.5);
    }, h.randomTriangularWith = function(d, c, M) {
      var C = Math.random(), S = c - d;
      return C <= (M - d) / S ? d + Math.sqrt(C * S * (M - d)) : c - Math.sqrt((1 - C) * S * (c - M));
    }, h.PI = 3.1415927, h.PI2 = h.PI * 2, h.radiansToDegrees = 180 / h.PI, h.radDeg = h.radiansToDegrees, h.degreesToRadians = h.PI / 180, h.degRad = h.degreesToRadians, h;
  })();
  o.MathUtils = n;
  var t = (function() {
    function h() {
    }
    return h.prototype.apply = function(d, c, M) {
      return d + (c - d) * this.applyInternal(M);
    }, h;
  })();
  o.Interpolation = t;
  var i = (function(h) {
    $(d, h);
    function d(c) {
      var M = h.call(this) || this;
      return M.power = 2, M.power = c, M;
    }
    return d.prototype.applyInternal = function(c) {
      return c <= 0.5 ? Math.pow(c * 2, this.power) / 2 : Math.pow((c - 1) * 2, this.power) / (this.power % 2 == 0 ? -2 : 2) + 1;
    }, d;
  })(t);
  o.Pow = i;
  var r = (function(h) {
    $(d, h);
    function d(c) {
      return h.call(this, c) || this;
    }
    return d.prototype.applyInternal = function(c) {
      return Math.pow(c - 1, this.power) * (this.power % 2 == 0 ? -1 : 1) + 1;
    }, d;
  })(i);
  o.PowOut = r;
  var a = (function() {
    function h() {
    }
    return h.arrayCopy = function(d, c, M, C, S) {
      for (var L = c, E = C; L < c + S; L++, E++)
        M[E] = d[L];
    }, h.setArraySize = function(d, c, M) {
      M === void 0 && (M = 0);
      var C = d.length;
      if (C == c)
        return d;
      if (d.length = c, C < c)
        for (var S = C; S < c; S++)
          d[S] = M;
      return d;
    }, h.ensureArrayCapacity = function(d, c, M) {
      return M === void 0 && (M = 0), d.length >= c ? d : h.setArraySize(d, c, M);
    }, h.newArray = function(d, c) {
      for (var M = new Array(d), C = 0; C < d; C++)
        M[C] = c;
      return M;
    }, h.newFloatArray = function(d) {
      if (h.SUPPORTS_TYPED_ARRAYS)
        return new Float32Array(d);
      for (var c = new Array(d), M = 0; M < c.length; M++)
        c[M] = 0;
      return c;
    }, h.newShortArray = function(d) {
      if (h.SUPPORTS_TYPED_ARRAYS)
        return new Int16Array(d);
      for (var c = new Array(d), M = 0; M < c.length; M++)
        c[M] = 0;
      return c;
    }, h.toFloatArray = function(d) {
      return h.SUPPORTS_TYPED_ARRAYS ? new Float32Array(d) : d;
    }, h.toSinglePrecision = function(d) {
      return h.SUPPORTS_TYPED_ARRAYS ? Math.fround(d) : d;
    }, h.webkit602BugfixHelper = function(d, c) {
    }, h.contains = function(d, c, M) {
      for (var C = 0; C < d.length; C++)
        if (d[C] == c)
          return !0;
      return !1;
    }, h.SUPPORTS_TYPED_ARRAYS = typeof Float32Array < "u", h;
  })();
  o.Utils = a;
  var f = (function() {
    function h() {
    }
    return h.logBones = function(d) {
      for (var c = 0; c < d.bones.length; c++) {
        var M = d.bones[c];
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
      for (var c = 0; c < d.length; c++)
        this.free(d[c]);
    }, h.prototype.clear = function() {
      this.items.length = 0;
    }, h;
  })();
  o.Pool = l;
  var p = (function() {
    function h(d, c) {
      d === void 0 && (d = 0), c === void 0 && (c = 0), this.x = d, this.y = c;
    }
    return h.prototype.set = function(d, c) {
      return this.x = d, this.y = c, this;
    }, h.prototype.length = function() {
      var d = this.x, c = this.y;
      return Math.sqrt(d * d + c * c);
    }, h.prototype.normalize = function() {
      var d = this.length();
      return d != 0 && (this.x /= d, this.y /= d), this;
    }, h;
  })();
  o.Vector2 = p;
  var u = (function() {
    function h() {
      this.maxDelta = 0.064, this.framesPerSecond = 0, this.delta = 0, this.totalTime = 0, this.lastTime = Date.now() / 1e3, this.frameCount = 0, this.frameTime = 0;
    }
    return h.prototype.update = function() {
      var d = Date.now() / 1e3;
      this.delta = d - this.lastTime, this.frameTime += this.delta, this.totalTime += this.delta, this.delta > this.maxDelta && (this.delta = this.maxDelta), this.lastTime = d, this.frameCount++, this.frameTime > 1 && (this.framesPerSecond = this.frameCount / this.frameTime, this.frameTime = 0, this.frameCount = 0);
    }, h;
  })();
  o.TimeKeeper = u;
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
          for (var d = 0, c = 0; c < this.values.length; c++)
            d += this.values[c];
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
    function n(t) {
      if (t == null)
        throw new Error("name cannot be null.");
      this.name = t;
    }
    return n;
  })();
  o.Attachment = e;
  var v = (function(n) {
    $(t, n);
    function t(i) {
      var r = n.call(this, i) || this;
      return r.id = (t.nextID++ & 65535) << 11, r.worldVerticesLength = 0, r.deformAttachment = r, r;
    }
    return t.prototype.computeWorldVertices = function(i, r, a, f, l, p) {
      a = l + (a >> 1) * p;
      var u = i.bone.skeleton, s = i.deform, h = this.vertices, d = this.bones;
      if (d == null) {
        s.length > 0 && (h = s);
        for (var c = i.bone, M = c.worldX, C = c.worldY, S = c.a, L = c.b, E = c.c, A = c.d, g = r, m = l; m < a; g += 2, m += p) {
          var x = h[g], P = h[g + 1];
          f[m] = x * S + P * L + M, f[m + 1] = x * E + P * A + C;
        }
        return;
      }
      for (var I = 0, O = 0, R = 0; R < r; R += 2) {
        var D = d[I];
        I += D + 1, O += D;
      }
      var N = u.bones;
      if (s.length == 0)
        for (var m = l, L = O * 3; m < a; m += p) {
          var k = 0, y = 0, D = d[I++];
          for (D += I; I < D; I++, L += 3) {
            var c = N[d[I]], x = h[L], P = h[L + 1], T = h[L + 2];
            k += (x * c.a + P * c.b + c.worldX) * T, y += (x * c.c + P * c.d + c.worldY) * T;
          }
          f[m] = k, f[m + 1] = y;
        }
      else
        for (var B = s, m = l, L = O * 3, V = O << 1; m < a; m += p) {
          var k = 0, y = 0, D = d[I++];
          for (D += I; I < D; I++, L += 3, V += 2) {
            var c = N[d[I]], x = h[L] + B[V], P = h[L + 1] + B[V + 1], T = h[L + 2];
            k += (x * c.a + P * c.b + c.worldX) * T, y += (x * c.c + P * c.d + c.worldY) * T;
          }
          f[m] = k, f[m + 1] = y;
        }
    }, t.prototype.copyTo = function(i) {
      this.bones != null ? (i.bones = new Array(this.bones.length), o.Utils.arrayCopy(this.bones, 0, i.bones, 0, this.bones.length)) : i.bones = null, this.vertices != null ? (i.vertices = o.Utils.newFloatArray(this.vertices.length), o.Utils.arrayCopy(this.vertices, 0, i.vertices, 0, this.vertices.length)) : i.vertices = null, i.worldVerticesLength = this.worldVerticesLength, i.deformAttachment = this.deformAttachment;
    }, t.nextID = 0, t;
  })(e);
  o.VertexAttachment = v;
})(F || (F = {}));
var F;
(function(o) {
  (function(e) {
    e[e.Region = 0] = "Region", e[e.BoundingBox = 1] = "BoundingBox", e[e.Mesh = 2] = "Mesh", e[e.LinkedMesh = 3] = "LinkedMesh", e[e.Path = 4] = "Path", e[e.Point = 5] = "Point", e[e.Clipping = 6] = "Clipping";
  })(o.AttachmentType || (o.AttachmentType = {}));
})(F || (F = {}));
var F;
(function(o) {
  var e = (function(v) {
    $(n, v);
    function n(t) {
      var i = v.call(this, t) || this;
      return i.color = new o.Color(1, 1, 1, 1), i;
    }
    return n.prototype.copy = function() {
      var t = new n(this.name);
      return this.copyTo(t), t.color.setFromColor(this.color), t;
    }, n;
  })(o.VertexAttachment);
  o.BoundingBoxAttachment = e;
})(F || (F = {}));
var F;
(function(o) {
  var e = (function(v) {
    $(n, v);
    function n(t) {
      var i = v.call(this, t) || this;
      return i.color = new o.Color(0.2275, 0.2275, 0.8078, 1), i;
    }
    return n.prototype.copy = function() {
      var t = new n(this.name);
      return this.copyTo(t), t.endSlot = this.endSlot, t.color.setFromColor(this.color), t;
    }, n;
  })(o.VertexAttachment);
  o.ClippingAttachment = e;
})(F || (F = {}));
var F;
(function(o) {
  var e = (function(v) {
    $(n, v);
    function n(t) {
      var i = v.call(this, t) || this;
      return i.color = new o.Color(1, 1, 1, 1), i.tempColor = new o.Color(0, 0, 0, 0), i;
    }
    return n.prototype.updateUVs = function() {
      var t = this.regionUVs;
      (this.uvs == null || this.uvs.length != t.length) && (this.uvs = o.Utils.newFloatArray(t.length));
      var i = this.uvs, r = this.uvs.length, a = this.region.u, f = this.region.v, l = 0, p = 0;
      if (this.region instanceof o.TextureAtlasRegion) {
        var u = this.region, s = u.texture.getImage().width, h = u.texture.getImage().height;
        switch (u.degrees) {
          case 90:
            a -= (u.originalHeight - u.offsetY - u.height) / s, f -= (u.originalWidth - u.offsetX - u.width) / h, l = u.originalHeight / s, p = u.originalWidth / h;
            for (var d = 0; d < r; d += 2)
              i[d] = a + t[d + 1] * l, i[d + 1] = f + (1 - t[d]) * p;
            return;
          case 180:
            a -= (u.originalWidth - u.offsetX - u.width) / s, f -= u.offsetY / h, l = u.originalWidth / s, p = u.originalHeight / h;
            for (var d = 0; d < r; d += 2)
              i[d] = a + (1 - t[d]) * l, i[d + 1] = f + (1 - t[d + 1]) * p;
            return;
          case 270:
            a -= u.offsetY / s, f -= u.offsetX / h, l = u.originalHeight / s, p = u.originalWidth / h;
            for (var d = 0; d < r; d += 2)
              i[d] = a + (1 - t[d + 1]) * l, i[d + 1] = f + t[d] * p;
            return;
        }
        a -= u.offsetX / s, f -= (u.originalHeight - u.offsetY - u.height) / h, l = u.originalWidth / s, p = u.originalHeight / h;
      } else this.region == null ? (a = f = 0, l = p = 1) : (l = this.region.u2 - a, p = this.region.v2 - f);
      for (var d = 0; d < r; d += 2)
        i[d] = a + t[d] * l, i[d + 1] = f + t[d + 1] * p;
    }, n.prototype.getParentMesh = function() {
      return this.parentMesh;
    }, n.prototype.setParentMesh = function(t) {
      this.parentMesh = t, t != null && (this.bones = t.bones, this.vertices = t.vertices, this.worldVerticesLength = t.worldVerticesLength, this.regionUVs = t.regionUVs, this.triangles = t.triangles, this.hullLength = t.hullLength, this.worldVerticesLength = t.worldVerticesLength);
    }, n.prototype.copy = function() {
      if (this.parentMesh != null)
        return this.newLinkedMesh();
      var t = new n(this.name);
      return t.region = this.region, t.path = this.path, t.color.setFromColor(this.color), this.copyTo(t), t.regionUVs = new Array(this.regionUVs.length), o.Utils.arrayCopy(this.regionUVs, 0, t.regionUVs, 0, this.regionUVs.length), t.uvs = new Array(this.uvs.length), o.Utils.arrayCopy(this.uvs, 0, t.uvs, 0, this.uvs.length), t.triangles = new Array(this.triangles.length), o.Utils.arrayCopy(this.triangles, 0, t.triangles, 0, this.triangles.length), t.hullLength = this.hullLength, this.edges != null && (t.edges = new Array(this.edges.length), o.Utils.arrayCopy(this.edges, 0, t.edges, 0, this.edges.length)), t.width = this.width, t.height = this.height, t;
    }, n.prototype.newLinkedMesh = function() {
      var t = new n(this.name);
      return t.region = this.region, t.path = this.path, t.color.setFromColor(this.color), t.deformAttachment = this.deformAttachment, t.setParentMesh(this.parentMesh != null ? this.parentMesh : this), t.updateUVs(), t;
    }, n;
  })(o.VertexAttachment);
  o.MeshAttachment = e;
})(F || (F = {}));
var F;
(function(o) {
  var e = (function(v) {
    $(n, v);
    function n(t) {
      var i = v.call(this, t) || this;
      return i.closed = !1, i.constantSpeed = !1, i.color = new o.Color(1, 1, 1, 1), i;
    }
    return n.prototype.copy = function() {
      var t = new n(this.name);
      return this.copyTo(t), t.lengths = new Array(this.lengths.length), o.Utils.arrayCopy(this.lengths, 0, t.lengths, 0, this.lengths.length), t.closed = closed, t.constantSpeed = this.constantSpeed, t.color.setFromColor(this.color), t;
    }, n;
  })(o.VertexAttachment);
  o.PathAttachment = e;
})(F || (F = {}));
var F;
(function(o) {
  var e = (function(v) {
    $(n, v);
    function n(t) {
      var i = v.call(this, t) || this;
      return i.color = new o.Color(0.38, 0.94, 0, 1), i;
    }
    return n.prototype.computeWorldPosition = function(t, i) {
      return i.x = this.x * t.a + this.y * t.b + t.worldX, i.y = this.x * t.c + this.y * t.d + t.worldY, i;
    }, n.prototype.computeWorldRotation = function(t) {
      var i = o.MathUtils.cosDeg(this.rotation), r = o.MathUtils.sinDeg(this.rotation), a = i * t.a + r * t.b, f = i * t.c + r * t.d;
      return Math.atan2(f, a) * o.MathUtils.radDeg;
    }, n.prototype.copy = function() {
      var t = new n(this.name);
      return t.x = this.x, t.y = this.y, t.rotation = this.rotation, t.color.setFromColor(this.color), t;
    }, n;
  })(o.VertexAttachment);
  o.PointAttachment = e;
})(F || (F = {}));
var F;
(function(o) {
  var e = (function(v) {
    $(n, v);
    function n(t) {
      var i = v.call(this, t) || this;
      return i.x = 0, i.y = 0, i.scaleX = 1, i.scaleY = 1, i.rotation = 0, i.width = 0, i.height = 0, i.color = new o.Color(1, 1, 1, 1), i.offset = o.Utils.newFloatArray(8), i.uvs = o.Utils.newFloatArray(8), i.tempColor = new o.Color(1, 1, 1, 1), i;
    }
    return n.prototype.updateOffset = function() {
      var t = this.width / this.region.originalWidth * this.scaleX, i = this.height / this.region.originalHeight * this.scaleY, r = -this.width / 2 * this.scaleX + this.region.offsetX * t, a = -this.height / 2 * this.scaleY + this.region.offsetY * i, f = r + this.region.width * t, l = a + this.region.height * i, p = this.rotation * Math.PI / 180, u = Math.cos(p), s = Math.sin(p), h = r * u + this.x, d = r * s, c = a * u + this.y, M = a * s, C = f * u + this.x, S = f * s, L = l * u + this.y, E = l * s, A = this.offset;
      A[n.OX1] = h - M, A[n.OY1] = c + d, A[n.OX2] = h - E, A[n.OY2] = L + d, A[n.OX3] = C - E, A[n.OY3] = L + S, A[n.OX4] = C - M, A[n.OY4] = c + S;
    }, n.prototype.setRegion = function(t) {
      this.region = t;
      var i = this.uvs;
      t.rotate ? (i[2] = t.u, i[3] = t.v2, i[4] = t.u, i[5] = t.v, i[6] = t.u2, i[7] = t.v, i[0] = t.u2, i[1] = t.v2) : (i[0] = t.u, i[1] = t.v2, i[2] = t.u, i[3] = t.v, i[4] = t.u2, i[5] = t.v, i[6] = t.u2, i[7] = t.v2);
    }, n.prototype.computeWorldVertices = function(t, i, r, a) {
      var f = this.offset, l = t.worldX, p = t.worldY, u = t.a, s = t.b, h = t.c, d = t.d, c = 0, M = 0;
      c = f[n.OX1], M = f[n.OY1], i[r] = c * u + M * s + l, i[r + 1] = c * h + M * d + p, r += a, c = f[n.OX2], M = f[n.OY2], i[r] = c * u + M * s + l, i[r + 1] = c * h + M * d + p, r += a, c = f[n.OX3], M = f[n.OY3], i[r] = c * u + M * s + l, i[r + 1] = c * h + M * d + p, r += a, c = f[n.OX4], M = f[n.OY4], i[r] = c * u + M * s + l, i[r + 1] = c * h + M * d + p;
    }, n.prototype.copy = function() {
      var t = new n(this.name);
      return t.region = this.region, t.rendererObject = this.rendererObject, t.path = this.path, t.x = this.x, t.y = this.y, t.scaleX = this.scaleX, t.scaleY = this.scaleY, t.rotation = this.rotation, t.width = this.width, t.height = this.height, o.Utils.arrayCopy(this.uvs, 0, t.uvs, 0, 8), o.Utils.arrayCopy(this.offset, 0, t.offset, 0, 8), t.color.setFromColor(this.color), t;
    }, n.OX1 = 0, n.OY1 = 1, n.OX2 = 2, n.OY2 = 3, n.OX3 = 4, n.OY3 = 5, n.OX4 = 6, n.OY4 = 7, n.X1 = 0, n.Y1 = 1, n.C1R = 2, n.C1G = 3, n.C1B = 4, n.C1A = 5, n.U1 = 6, n.V1 = 7, n.X2 = 8, n.Y2 = 9, n.C2R = 10, n.C2G = 11, n.C2B = 12, n.C2A = 13, n.U2 = 14, n.V2 = 15, n.X3 = 16, n.Y3 = 17, n.C3R = 18, n.C3G = 19, n.C3B = 20, n.C3A = 21, n.U3 = 22, n.V3 = 23, n.X4 = 24, n.Y4 = 25, n.C4R = 26, n.C4G = 27, n.C4B = 28, n.C4A = 29, n.U4 = 30, n.V4 = 31, n;
  })(o.Attachment);
  o.RegionAttachment = e;
})(F || (F = {}));
var F;
(function(o) {
  var e = (function() {
    function v(n, t) {
      this.jitterX = 0, this.jitterY = 0, this.jitterX = n, this.jitterY = t;
    }
    return v.prototype.begin = function(n) {
    }, v.prototype.transform = function(n, t, i, r) {
      n.x += o.MathUtils.randomTriangular(-this.jitterX, this.jitterY), n.y += o.MathUtils.randomTriangular(-this.jitterX, this.jitterY);
    }, v.prototype.end = function() {
    }, v;
  })();
  o.JitterEffect = e;
})(F || (F = {}));
var F;
(function(o) {
  var e = (function() {
    function v(n) {
      this.centerX = 0, this.centerY = 0, this.radius = 0, this.angle = 0, this.worldX = 0, this.worldY = 0, this.radius = n;
    }
    return v.prototype.begin = function(n) {
      this.worldX = n.x + this.centerX, this.worldY = n.y + this.centerY;
    }, v.prototype.transform = function(n, t, i, r) {
      var a = this.angle * o.MathUtils.degreesToRadians, f = n.x - this.worldX, l = n.y - this.worldY, p = Math.sqrt(f * f + l * l);
      if (p < this.radius) {
        var u = v.interpolation.apply(0, a, (this.radius - p) / this.radius), s = Math.cos(u), h = Math.sin(u);
        n.x = s * f - h * l + this.worldX, n.y = h * f + s * l + this.worldY;
      }
    }, v.prototype.end = function() {
    }, v.interpolation = new o.PowOut(2), v;
  })();
  o.SwirlEffect = e;
})(F || (F = {}));
var F;
(function(o) {
  (function(e) {
    var v = (function(n) {
      $(t, n);
      function t(i, r) {
        return r === void 0 && (r = ""), n.call(this, function(a) {
          return new o.webgl.GLTexture(i, a);
        }, r) || this;
      }
      return t;
    })(o.AssetManager);
    e.AssetManager = v;
  })(o.webgl || (o.webgl = {}));
})(F || (F = {}));
var F;
(function(o) {
  (function(e) {
    var v = (function() {
      function n(t, i) {
        this.position = new e.Vector3(0, 0, 0), this.direction = new e.Vector3(0, 0, -1), this.up = new e.Vector3(0, 1, 0), this.near = 0, this.far = 100, this.zoom = 1, this.viewportWidth = 0, this.viewportHeight = 0, this.projectionView = new e.Matrix4(), this.inverseProjectionView = new e.Matrix4(), this.projection = new e.Matrix4(), this.view = new e.Matrix4(), this.tmp = new e.Vector3(), this.viewportWidth = t, this.viewportHeight = i, this.update();
      }
      return n.prototype.update = function() {
        var t = this.projection, i = this.view, r = this.projectionView, a = this.inverseProjectionView, f = this.zoom, l = this.viewportWidth, p = this.viewportHeight;
        t.ortho(f * (-l / 2), f * (l / 2), f * (-p / 2), f * (p / 2), this.near, this.far), i.lookAt(this.position, this.direction, this.up), r.set(t.values), r.multiply(i), a.set(r.values).invert();
      }, n.prototype.screenToWorld = function(t, i, r) {
        var a = t.x, f = r - t.y - 1, l = this.tmp;
        return l.x = 2 * a / i - 1, l.y = 2 * f / r - 1, l.z = 2 * t.z - 1, l.project(this.inverseProjectionView), t.set(l.x, l.y, l.z), t;
      }, n.prototype.setViewport = function(t, i) {
        this.viewportWidth = t, this.viewportHeight = i;
      }, n;
    })();
    e.OrthoCamera = v;
  })(o.webgl || (o.webgl = {}));
})(F || (F = {}));
var F;
(function(o) {
  (function(e) {
    var v = (function(n) {
      $(t, n);
      function t(i, r, a) {
        a === void 0 && (a = !1);
        var f = n.call(this, r) || this;
        return f.texture = null, f.boundUnit = 0, f.useMipMaps = !1, f.context = i instanceof e.ManagedWebGLRenderingContext ? i : new e.ManagedWebGLRenderingContext(i), f.useMipMaps = a, f.restore(), f.context.addRestorable(f), f;
      }
      return t.prototype.setFilters = function(i, r) {
        var a = this.context.gl;
        this.bind(), a.texParameteri(a.TEXTURE_2D, a.TEXTURE_MIN_FILTER, i), a.texParameteri(a.TEXTURE_2D, a.TEXTURE_MAG_FILTER, t.validateMagFilter(r));
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
        var a = this.context.gl;
        this.bind(), a.texParameteri(a.TEXTURE_2D, a.TEXTURE_WRAP_S, i), a.texParameteri(a.TEXTURE_2D, a.TEXTURE_WRAP_T, r);
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
    e.GLTexture = v;
  })(o.webgl || (o.webgl = {}));
})(F || (F = {}));
var F;
(function(o) {
  (function(e) {
    var v = (function() {
      function t(i) {
        this.lastX = 0, this.lastY = 0, this.buttonDown = !1, this.currTouch = null, this.touchesPool = new o.Pool(function() {
          return new o.webgl.Touch(0, 0, 0);
        }), this.listeners = new Array(), this.element = i, this.setupCallbacks(i);
      }
      return t.prototype.setupCallbacks = function(i) {
        var r = this, a = function(p) {
          if (p instanceof MouseEvent) {
            for (var u = i.getBoundingClientRect(), s = p.clientX - u.left, h = p.clientY - u.top, d = r.listeners, c = 0; c < d.length; c++)
              d[c].down && d[c].down(s, h);
            r.lastX = s, r.lastY = h, r.buttonDown = !0, document.addEventListener("mousemove", f), document.addEventListener("mouseup", l);
          }
        }, f = function(p) {
          if (p instanceof MouseEvent) {
            for (var u = i.getBoundingClientRect(), s = p.clientX - u.left, h = p.clientY - u.top, d = r.listeners, c = 0; c < d.length; c++)
              r.buttonDown ? d[c].dragged && d[c].dragged(s, h) : d[c].moved && d[c].moved(s, h);
            r.lastX = s, r.lastY = h;
          }
        }, l = function(p) {
          if (p instanceof MouseEvent) {
            for (var u = i.getBoundingClientRect(), s = p.clientX - u.left, h = p.clientY - u.top, d = r.listeners, c = 0; c < d.length; c++)
              d[c].up && d[c].up(s, h);
            r.lastX = s, r.lastY = h, r.buttonDown = !1, document.removeEventListener("mousemove", f), document.removeEventListener("mouseup", l);
          }
        };
        i.addEventListener("mousedown", a, !0), i.addEventListener("mousemove", f, !0), i.addEventListener("mouseup", l, !0), i.addEventListener("touchstart", function(p) {
          if (r.currTouch == null) {
            for (var u = p.changedTouches, s = 0; s < u.length; s++) {
              var h = u[s], d = i.getBoundingClientRect(), c = h.clientX - d.left, M = h.clientY - d.top;
              r.currTouch = r.touchesPool.obtain(), r.currTouch.identifier = h.identifier, r.currTouch.x = c, r.currTouch.y = M;
              break;
            }
            for (var C = r.listeners, S = 0; S < C.length; S++)
              C[S].down && C[S].down(r.currTouch.x, r.currTouch.y);
            r.lastX = r.currTouch.x, r.lastY = r.currTouch.y, r.buttonDown = !0, p.preventDefault();
          }
        }, !1), i.addEventListener("touchend", function(p) {
          for (var u = p.changedTouches, s = 0; s < u.length; s++) {
            var h = u[s];
            if (r.currTouch.identifier === h.identifier) {
              var d = i.getBoundingClientRect(), c = r.currTouch.x = h.clientX - d.left, M = r.currTouch.y = h.clientY - d.top;
              r.touchesPool.free(r.currTouch);
              for (var C = r.listeners, S = 0; S < C.length; S++)
                C[S].up && C[S].up(c, M);
              r.lastX = c, r.lastY = M, r.buttonDown = !1, r.currTouch = null;
              break;
            }
          }
          p.preventDefault();
        }, !1), i.addEventListener("touchcancel", function(p) {
          for (var u = p.changedTouches, s = 0; s < u.length; s++) {
            var h = u[s];
            if (r.currTouch.identifier === h.identifier) {
              var d = i.getBoundingClientRect(), c = r.currTouch.x = h.clientX - d.left, M = r.currTouch.y = h.clientY - d.top;
              r.touchesPool.free(r.currTouch);
              for (var C = r.listeners, S = 0; S < C.length; S++)
                C[S].up && C[S].up(c, M);
              r.lastX = c, r.lastY = M, r.buttonDown = !1, r.currTouch = null;
              break;
            }
          }
          p.preventDefault();
        }, !1), i.addEventListener("touchmove", function(p) {
          if (r.currTouch != null) {
            for (var u = p.changedTouches, s = 0; s < u.length; s++) {
              var h = u[s];
              if (r.currTouch.identifier === h.identifier) {
                for (var d = i.getBoundingClientRect(), c = h.clientX - d.left, M = h.clientY - d.top, C = r.listeners, S = 0; S < C.length; S++)
                  C[S].dragged && C[S].dragged(c, M);
                r.lastX = r.currTouch.x = c, r.lastY = r.currTouch.y = M;
                break;
              }
            }
            p.preventDefault();
          }
        }, !1);
      }, t.prototype.addListener = function(i) {
        this.listeners.push(i);
      }, t.prototype.removeListener = function(i) {
        var r = this.listeners.indexOf(i);
        r > -1 && this.listeners.splice(r, 1);
      }, t;
    })();
    e.Input = v;
    var n = /* @__PURE__ */ (function() {
      function t(i, r, a) {
        this.identifier = i, this.x = r, this.y = a;
      }
      return t;
    })();
    e.Touch = n;
  })(o.webgl || (o.webgl = {}));
})(F || (F = {}));
var F;
(function(o) {
  (function(e) {
    var v = (function() {
      function n(t) {
        if (this.logo = null, this.spinner = null, this.angle = 0, this.fadeOut = 0, this.timeKeeper = new o.TimeKeeper(), this.backgroundColor = new o.Color(0.135, 0.135, 0.135, 1), this.tempColor = new o.Color(), this.firstDraw = 0, this.renderer = t, this.timeKeeper.maxDelta = 9, n.logoImg === null) {
          var i = navigator.userAgent.indexOf("Safari") > -1;
          n.logoImg = new Image(), n.logoImg.src = n.SPINE_LOGO_DATA, i || (n.logoImg.crossOrigin = "anonymous"), n.logoImg.onload = function(r) {
            n.loaded++;
          }, n.spinnerImg = new Image(), n.spinnerImg.src = n.SPINNER_DATA, i || (n.spinnerImg.crossOrigin = "anonymous"), n.spinnerImg.onload = function(r) {
            n.loaded++;
          };
        }
      }
      return n.prototype.draw = function(t) {
        if (t === void 0 && (t = !1), !(t && this.fadeOut > n.FADE_SECONDS)) {
          this.timeKeeper.update();
          var i = Math.abs(Math.sin(this.timeKeeper.totalTime + 0.75));
          this.angle -= this.timeKeeper.delta / 1.4 * 360 * (1 + 1.5 * Math.pow(i, 5));
          var r = this.renderer, a = r.canvas, f = r.context.gl;
          r.resize(e.ResizeMode.Stretch);
          var l = r.camera.position.x, p = r.camera.position.y;
          if (r.camera.position.set(a.width / 2, a.height / 2, 0), r.camera.viewportWidth = a.width, r.camera.viewportHeight = a.height, !t)
            f.clearColor(this.backgroundColor.r, this.backgroundColor.g, this.backgroundColor.b, this.backgroundColor.a), f.clear(f.COLOR_BUFFER_BIT), this.tempColor.a = 1;
          else {
            if (this.fadeOut += this.timeKeeper.delta * (this.timeKeeper.totalTime < 1 ? 2 : 1), this.fadeOut > n.FADE_SECONDS) {
              r.camera.position.set(l, p, 0);
              return;
            }
            i = 1 - this.fadeOut / n.FADE_SECONDS, this.tempColor.setFromColor(this.backgroundColor), this.tempColor.a = 1 - (i - 1) * (i - 1), r.begin(), r.quad(!0, 0, 0, a.width, 0, a.width, a.height, 0, a.height, this.tempColor, this.tempColor, this.tempColor, this.tempColor), r.end();
          }
          if (this.tempColor.set(1, 1, 1, this.tempColor.a), n.loaded == 2) {
            this.logo === null && (this.logo = new e.GLTexture(r.context, n.logoImg), this.spinner = new e.GLTexture(r.context, n.spinnerImg)), this.logo.update(!1), this.spinner.update(!1);
            var u = this.logo.getImage().width, s = this.logo.getImage().height, h = this.spinner.getImage().width, d = this.spinner.getImage().height;
            r.batcher.setBlendMode(f.SRC_ALPHA, f.ONE_MINUS_SRC_ALPHA), r.begin(), r.drawTexture(this.logo, (a.width - u) / 2, (a.height - s) / 2, u, s, this.tempColor), r.drawTextureRotated(this.spinner, (a.width - h) / 2, (a.height - d) / 2, h, d, h / 2, d / 2, this.angle, this.tempColor), r.end(), r.camera.position.set(l, p, 0);
          }
        }
      }, n.FADE_SECONDS = 1, n.loaded = 0, n.spinnerImg = null, n.logoImg = null, n.SPINNER_DATA = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAKMAAACjCAYAAADmbK6AAAAACXBIWXMAAAsTAAALEwEAmpwYAAALB2lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDIgNzkuMTYwOTI0LCAyMDE3LzA3LzEzLTAxOjA2OjM5ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0RXZ0PSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VFdmVudCMiIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczpwaG90b3Nob3A9Imh0dHA6Ly9ucy5hZG9iZS5jb20vcGhvdG9zaG9wLzEuMC8iIHhtbG5zOnRpZmY9Imh0dHA6Ly9ucy5hZG9iZS5jb20vdGlmZi8xLjAvIiB4bWxuczpleGlmPSJodHRwOi8vbnMuYWRvYmUuY29tL2V4aWYvMS4wLyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxNS41IChXaW5kb3dzKSIgeG1wOkNyZWF0ZURhdGU9IjIwMTYtMDktMDhUMTQ6MjU6MTIrMDI6MDAiIHhtcDpNZXRhZGF0YURhdGU9IjIwMTgtMTEtMTVUMTY6NDA6NTkrMDE6MDAiIHhtcDpNb2RpZnlEYXRlPSIyMDE4LTExLTE1VDE2OjQwOjU5KzAxOjAwIiBkYzpmb3JtYXQ9ImltYWdlL3BuZyIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpmZDhlNTljMC02NGJjLTIxNGQtODAyZi1jZDlhODJjM2ZjMGMiIHhtcE1NOkRvY3VtZW50SUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDpmYmNmZWJlYS03MjY2LWE0NGQtOTI4NS0wOTJmNGNhYzk4ZWEiIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDowODMzNWIyYy04NzYyLWQzNGMtOTBhOS02ODJjYjJmYTQ2M2UiIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHRpZmY6T3JpZW50YXRpb249IjEiIHRpZmY6WFJlc29sdXRpb249IjcyMDAwMC8xMDAwMCIgdGlmZjpZUmVzb2x1dGlvbj0iNzIwMDAwLzEwMDAwIiB0aWZmOlJlc29sdXRpb25Vbml0PSIyIiBleGlmOkNvbG9yU3BhY2U9IjY1NTM1IiBleGlmOlBpeGVsWERpbWVuc2lvbj0iMjk3IiBleGlmOlBpeGVsWURpbWVuc2lvbj0iMjQyIj4gPHhtcE1NOkhpc3Rvcnk+IDxyZGY6U2VxPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0iY3JlYXRlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDowODMzNWIyYy04NzYyLWQzNGMtOTBhOS02ODJjYjJmYTQ2M2UiIHN0RXZ0OndoZW49IjIwMTYtMDktMDhUMTQ6MjU6MTIrMDI6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE1LjUgKFdpbmRvd3MpIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDpiNThlMTlkNi0xYTRjLTQyNDEtODU0ZC01MDVlZjYxMjRhODQiIHN0RXZ0OndoZW49IjIwMTgtMTEtMTVUMTY6NDA6MjMrMDE6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCBDQyAoV2luZG93cykiIHN0RXZ0OmNoYW5nZWQ9Ii8iLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249InNhdmVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjQ3YzYzYzIwLWJkYjgtYzM0YS1hYzMyLWQ5MDdjOWEyOTA0MCIgc3RFdnQ6d2hlbj0iMjAxOC0xMS0xNVQxNjo0MDo1OSswMTowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0iY29udmVydGVkIiBzdEV2dDpwYXJhbWV0ZXJzPSJmcm9tIGFwcGxpY2F0aW9uL3ZuZC5hZG9iZS5waG90b3Nob3AgdG8gaW1hZ2UvcG5nIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJkZXJpdmVkIiBzdEV2dDpwYXJhbWV0ZXJzPSJjb252ZXJ0ZWQgZnJvbSBhcHBsaWNhdGlvbi92bmQuYWRvYmUucGhvdG9zaG9wIHRvIGltYWdlL3BuZyIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6ZmQ4ZTU5YzAtNjRiYy0yMTRkLTgwMmYtY2Q5YTgyYzNmYzBjIiBzdEV2dDp3aGVuPSIyMDE4LTExLTE1VDE2OjQwOjU5KzAxOjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgQ0MgKFdpbmRvd3MpIiBzdEV2dDpjaGFuZ2VkPSIvIi8+IDwvcmRmOlNlcT4gPC94bXBNTTpIaXN0b3J5PiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo0N2M2M2MyMC1iZGI4LWMzNGEtYWMzMi1kOTA3YzlhMjkwNDAiIHN0UmVmOmRvY3VtZW50SUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDo2OWRmZjljYy01YzFiLWE5NDctOTc3OS03ODgxZjM0ODk3MDMiIHN0UmVmOm9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDowODMzNWIyYy04NzYyLWQzNGMtOTBhOS02ODJjYjJmYTQ2M2UiLz4gPHBob3Rvc2hvcDpEb2N1bWVudEFuY2VzdG9ycz4gPHJkZjpCYWc+IDxyZGY6bGk+eG1wLmRpZDowODMzNWIyYy04NzYyLWQzNGMtOTBhOS02ODJjYjJmYTQ2M2U8L3JkZjpsaT4gPC9yZGY6QmFnPiA8L3Bob3Rvc2hvcDpEb2N1bWVudEFuY2VzdG9ycz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz7qS4aQAAAKZElEQVR42u2de4xVxR3HP8dd3rQryPKo4dGNbtVAQRa1YB93E1tTS7VYqCBiSWhsqGltSx+0xD60tKBorYnNkkBtFUt9xJaGNGlty6EqRAK1KlalshK2C8tzpcIigpz+MbPr5e5y987dM2fv4/tJbjC7v3P2+JvPnTMzZ85MEEURQhQClUpB7gRBAECUYiYwH6gDqoEKoA1oBDYCy4OQJgB92R3yq2S5yRilWASs6CZ0DzA5CNmn/ObOOUpB7kQpRgNLcwj9AHCnMiYZfXIT0C/H2DlRSs0gyeiPaQ6xg4FapUwy+mKUY/wwpUwy+uK4Y/xhpUwy+mKfY3yTUiYZfdHiENsahBxRyiSjL5odYncpXZLRJ3sdYhuVLslYKDKqZpSMBXObVs0oGQumA6OaUTL6Iwg5CBzNMXy7MiYZffNCDjH7g5DdSpVk9M36mGKEZOwxq4Fj3cT8UmmSjEm0Gw8At2UJaQhCtilTeeRWM5EdkmVfOwCIUtQBE4AqILC1ZQuwPgjpSKryWwgy1gfZfjsQ886IKFY2xO9N0jOR69srDOAtzCyYFuCUSrcg6AOcBIYCY4C3gVeT+uNJyvg94GPAxzFjcDuBl4C/AP+UBwXBR4AaYDYwDvgr8Drwi1KScRnwXfut6wNcYT+7Ma97LgX+JRd6jfOAucAXgCvTfl4DvAuMtJVJ0cu41IoYWRHTGWM/1TZmq/2fF8nR14r4U2BQF7+LgMW2k7bY54X4Htr5EvD99s5SlriPArcAY+VGsh1YYDpwMzAgSwy2svhWscpYA/wkx9gKm5S5wBA5kgjnAJcDX7NNpVxcWAZMLUYZJwHDHeKrgXnAdWjZlSS4BLgVuMzRlxt9eeNTxsG2veFyy7gQWAR8Sq54byfeYDssAx3LqLabJldBytgMHMjjuPHAQvTOsU++aJtE/fI4dpevTqZPGV+2veN8+DTwIHCBr29hmVJhJXwA+GAex7cBjxZjm7EFWAL8DfeX39s7NPOy9PKEO7XAV+k8xJYLrcDPgL8Xo4xgJqIuA7bkeXw9ZsBVxMMMYEqex64FfuO7e++bTcAPgD8Bpx2PvRSYKIdi61DOs3edXImAV4Cv2zJsKnYZ24B/AJ+xteRrwAmHBF4mj2JhEnCRg4QnrYh3YZ5NH/J9gUmP5zXYtsdsW+Pl8vffkEex8I5D7HHgGeBhe0dLhKRlbMJM298NXI8Z68rGk8AGeRQLu4DHMGOL2dgJPA78AXguyQvsjScdrTYp2zBDPzfbXl7mmNc64B7MFCbRc/bbfPYHrs343WnbZHsG+BXwZ8y65JS6jOnfwPuBg8BnMQtxjsWsh/0IsNJ2fkR8bAHutbfhG2x7vp9tDzZiFs5/Non2YaHJ2N6OWQf8BxiBeRx4EDPZ9nm544WNVsLtwFWYJ2Wh/fmO3ryw3noHpiv6YyZ5NsuXROhrRypeAv7nfHQJvAOTjbclYuJ3pWcL6YL03rSQjEJIRiEZhZCMQjIKIRmFZBRCMgrJKIRkFJJRCMkoJKMQklFIRiEkoxCSUUhGISSjkIxCSEYhGYWQjEIyCiEZhWQUQjIKySiEZBSSUQjJKCSjEAVCJUAQmCWPoxSjgZuAaZgF348D+zD7ADYDe+2nGWgJQg52dVJvSzOLgqHdmU5ln2IYZou9861Do+x/j8Ss2z7AOrQJWBOEZtetKIrMmt5BEBClWAQsxW3b16OY/QHXA6uD0GzpG0VRPmt6i2KSMeyQrxpYgNl4dCJmV7NcOQEsCULu6ZCR+mAmZiOannAMuC0IWS0Zy0PGKMUCzFZug3p4ullsiJ5obzPOj+H6BgGrohR1KqrSx5bzqhhE7PCvXcY4BZqgoioL4iznunQZq2M8cZXKqSyIs5yr02WsiPHEaiyWSbMxxnNVpMvYFuOJj6mcyoI4y7ktXcbGGE/conIqC+Is58Z0GTfGdNIGzJijKH3W2/KOg43pMi4n//2F92P2KJ4ShCwMQvT4pRwajCFRELIQmGLLf3+ep9pj/TvjCcwI4E5gDp1H0VsxO7k3Zvy7PQjZnXl2DXqXhYydiFKMAcYD44CajH+HZIQfBdYCtwch+854HJh2wkqgFhgGHAaagpAjLhcqGctTxqxOpKgCRgNDMXuK7whCTqU7U9khz3ucAv59xomUe9FVhePGEfs5q1eaQiYKBskoJKMQklFIRiEko5CMQkhGIRmFkIxCMgohGYVkFEIyCskohGQUklEIySiEZBSSUQjJKCSjEJJRSEYhJKOQjEJIRiEZhZCMQjIKIRmFZBSijGXMvIZ+KpZEaF8qeygwHOjb2xdUWQBJqQL6ADOBi4GHMGuGH5Iv3hiG2SJtIWaV4mZgB/AadF6jvVxkvAKzv3UdMNX+bDJm9fx10PV+1qLHIl4P3GLzfh3QBLwKbAZ+DJwuFxkDm5CZmN0Vzsv4/TTMyviVwGOYnRZEPAwBZgDfAC5K+/lo+5kKXAjcBzwPnCz1NuP77LfxO12I2M7FNmFXE+++huVOPfDNDBEz25FzgHuBa4Bzk8x/0jJeCiwCFmP2BsnGh4BbgYFyKDZmZRExnTpbGcywHZySuk0PsbeAG4HZDt+2C6yMb8mjWHgXs+NFd5v09Ac+AYzC7An0EPBKqdSM1wDfBqY7Vvubk263lDhPYHamypVa4MvAHUCq2GvGgcB8YAEwKQ/5nwa33blEVrYDLwJXOhxzLvBJzDhkK/BCMdaMA4C5wF2Y4RrXv7UF+KO9tYh42A08msfoRxVwLfBDYGwxyliLGUMclMexL9rOy075EyvvAKuBlcCbeTa3Pl+MMk7GbP/qyiHg18BWueOFNnu3ymeP8X62h11dbDKm7K3a9Zv7e+BJOeOVRmCNvQO5cgmdt4AueBkH5zCE0FWHpQH4r3zxzlPAw3kcdxg4VmwybnaMfx1YAWxTpyURjtj24wpHuZ7C0yNanzL+FnjZIX4lsEGOJEorcDewKcf4vTb+ZLHJuAeYBxzvJm4/8CPg58AJ+ZE4BzBDNk93k//jwOeAN4qxNw1m5sdV9jZwtlvv48ADujX3GpFtUt0OhPZnJzN63wdtOW7xeSFJPJvehBnBv8/2ricAp2wb8UHgETRvsRDYCiy3IrbPCWi0Mt4BPOf7AoIoivycub5TR/rDmBkjs4Df2fbHJjlQcLwfuNyW13rMXILOkyQ2REUtI5jnnG+mNRFOF3Gh1dlavgozhHUMaLEFGJWImBVnbT4VlYwlSBCYL1iUYgGw6ixhDUHIwo4GmfIrGX3JGKWotj3KbM/cpwQh2yRjYfWmS5EFdD/54ytKk2RMgukxxQjJ2GMm5hAzPEoxRqmSjN6IUgwj9xkr45UxyeiTkQ6x45QuyeiT8x1ia5QuyeiTUaoZJWMxyqiaUTIWzG1aNaNkLJgOzJAoRZVSJhl9McIxfrRSJhl94fq241ClTDL6Yq9jvCYNS0ZvuEwGPopZmlhIRi+sIfeXxtYGIaeUMsnohSCkCViSQ+gezAtOwiW/mvzpkKz3ZnrPxCz1V4dZd6YC8+JSI2YNm+VWXE2ulYyiGPk/nslB8d6ayMkAAAAASUVORK5CYII=", n.SPINE_LOGO_DATA = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAKUAAABsCAYAAAALzHKmAAAACXBIWXMAAAsTAAALEwEAmpwYAAALB2lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDIgNzkuMTYwOTI0LCAyMDE3LzA3LzEzLTAxOjA2OjM5ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0RXZ0PSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VFdmVudCMiIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczpwaG90b3Nob3A9Imh0dHA6Ly9ucy5hZG9iZS5jb20vcGhvdG9zaG9wLzEuMC8iIHhtbG5zOnRpZmY9Imh0dHA6Ly9ucy5hZG9iZS5jb20vdGlmZi8xLjAvIiB4bWxuczpleGlmPSJodHRwOi8vbnMuYWRvYmUuY29tL2V4aWYvMS4wLyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxNS41IChXaW5kb3dzKSIgeG1wOkNyZWF0ZURhdGU9IjIwMTYtMDktMDhUMTQ6MjU6MTIrMDI6MDAiIHhtcDpNZXRhZGF0YURhdGU9IjIwMTgtMTEtMTVUMTY6NDA6NTkrMDE6MDAiIHhtcDpNb2RpZnlEYXRlPSIyMDE4LTExLTE1VDE2OjQwOjU5KzAxOjAwIiBkYzpmb3JtYXQ9ImltYWdlL3BuZyIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDowMTdhZGQ3Ni04OTZlLThlNGUtYmM5MS00ZjEyNjI1YjA3MjgiIHhtcE1NOkRvY3VtZW50SUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDplMTViNGE2ZS1hMDg3LWEzNDktODdhOS1mNDYzYjE2MzQ0Y2MiIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDowODMzNWIyYy04NzYyLWQzNGMtOTBhOS02ODJjYjJmYTQ2M2UiIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHRpZmY6T3JpZW50YXRpb249IjEiIHRpZmY6WFJlc29sdXRpb249IjcyMDAwMC8xMDAwMCIgdGlmZjpZUmVzb2x1dGlvbj0iNzIwMDAwLzEwMDAwIiB0aWZmOlJlc29sdXRpb25Vbml0PSIyIiBleGlmOkNvbG9yU3BhY2U9IjY1NTM1IiBleGlmOlBpeGVsWERpbWVuc2lvbj0iMjk3IiBleGlmOlBpeGVsWURpbWVuc2lvbj0iMjQyIj4gPHhtcE1NOkhpc3Rvcnk+IDxyZGY6U2VxPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0iY3JlYXRlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDowODMzNWIyYy04NzYyLWQzNGMtOTBhOS02ODJjYjJmYTQ2M2UiIHN0RXZ0OndoZW49IjIwMTYtMDktMDhUMTQ6MjU6MTIrMDI6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE1LjUgKFdpbmRvd3MpIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDpiNThlMTlkNi0xYTRjLTQyNDEtODU0ZC01MDVlZjYxMjRhODQiIHN0RXZ0OndoZW49IjIwMTgtMTEtMTVUMTY6NDA6MjMrMDE6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCBDQyAoV2luZG93cykiIHN0RXZ0OmNoYW5nZWQ9Ii8iLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249InNhdmVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjJlNjJiMWM2LWIxYzQtNDk0MC04MDMxLWU4ZDkyNTBmODJjNSIgc3RFdnQ6d2hlbj0iMjAxOC0xMS0xNVQxNjo0MDo1OSswMTowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0iY29udmVydGVkIiBzdEV2dDpwYXJhbWV0ZXJzPSJmcm9tIGFwcGxpY2F0aW9uL3ZuZC5hZG9iZS5waG90b3Nob3AgdG8gaW1hZ2UvcG5nIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJkZXJpdmVkIiBzdEV2dDpwYXJhbWV0ZXJzPSJjb252ZXJ0ZWQgZnJvbSBhcHBsaWNhdGlvbi92bmQuYWRvYmUucGhvdG9zaG9wIHRvIGltYWdlL3BuZyIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6MDE3YWRkNzYtODk2ZS04ZTRlLWJjOTEtNGYxMjYyNWIwNzI4IiBzdEV2dDp3aGVuPSIyMDE4LTExLTE1VDE2OjQwOjU5KzAxOjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgQ0MgKFdpbmRvd3MpIiBzdEV2dDpjaGFuZ2VkPSIvIi8+IDwvcmRmOlNlcT4gPC94bXBNTTpIaXN0b3J5PiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDoyZTYyYjFjNi1iMWM0LTQ5NDAtODAzMS1lOGQ5MjUwZjgyYzUiIHN0UmVmOmRvY3VtZW50SUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDo2OWRmZjljYy01YzFiLWE5NDctOTc3OS03ODgxZjM0ODk3MDMiIHN0UmVmOm9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDowODMzNWIyYy04NzYyLWQzNGMtOTBhOS02ODJjYjJmYTQ2M2UiLz4gPHBob3Rvc2hvcDpEb2N1bWVudEFuY2VzdG9ycz4gPHJkZjpCYWc+IDxyZGY6bGk+eG1wLmRpZDowODMzNWIyYy04NzYyLWQzNGMtOTBhOS02ODJjYjJmYTQ2M2U8L3JkZjpsaT4gPC9yZGY6QmFnPiA8L3Bob3Rvc2hvcDpEb2N1bWVudEFuY2VzdG9ycz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz5ayrctAAATYUlEQVR42u2dfVQV553Hv88AXq5uAAlJ0CBem912jQh60kZ8y0tdC5soJnoaXzC4Tdz4cjya1GN206Zqsu3Jpm6yeM5uTG3iaYGoJNFdEY3GaFGD0p4mqS9AXpoV0OZFUOHS3usFuc/+Idde8M7M8zr3gsw5HOCZZ2aemecz39/LPPMMMLAMLDG2kIFzjqmFDiDZP6AkN3gf0gEob8x2kj4MCx2AMnbb1BcVld6IwJJ+0oYb2YTT/gYq6WPHJP3gmtA+Biztr1CSKLevLytprCkh7ctQkj4KsK590hiGlsbSOcVCR5I+BC7pA6BEAzQaq1DqhFFH3Vg16TSG4KHRgNPpyFd1XdIHAyrdCkhjADgaTSiJw/VIP1BSp6GhUQSOOgmlkzASxSqq2zpQB+ClGiGlUb65tAUZOmDUAa5u5XRSgajibVRCR3VCSRyoQwSBE/EvYy3YkYGESuwrpuAkDgPJCg4RhFVUNUkMw6hK6agDcFInoSQxAqNqWHVdD6fUhQqUsfiaVCN41IlOUBEx88JIJCCU8T+tttOR6pEFUgRQXoCVrydRAJJw/G+2jig6llN+p0wnsZpYXsAoxzGognYzryeagBRRR8L5t4iCRsvflDHnIopINcCpGkzlUOoCkqWcKABdlznXZa5lTK7Z/6zlvMeXXqdTCVWoI696ygZN0YZSp/KxQCijmiJgUp3gyQBpVy4Kq4gPqhpWlQrCCxgPeLz70wqmyqcksgELS5kKQEWCIBn1FEn7qFBKKgmnajCloZQtlwWSZR0PoCJBkJMDMnT4iSxlsQCmFJQidVUASQS3ZSlXadqhWDVkTCoLiDKw8t40XOU6oFQBJMtvkSBJ1ITLqKaOgIbVF+y9jd3/omAqVUtViigTTfMAyKqqKnxOlWZcFEzVZjrSb11gaodSRiVVAikCo4hKyjzpkh3No8tf1AUmrxnXCmW0gSSCcIqki4hipbTqGNU+IwuMqsAUfSLVoywezi46gGSFU8Sk86bBKOd1oJzrwuuEQLIbBU8sfiPC37DYhuW8pEfex3NcQBUqyVrO+7edeZdNIfFCSi22oZwdSkzUk1jAaQcrGMA0O34kUJXAaAYl0aSMkRQMjODxAArGct6onPf68CgLbGCkNv4r4axrp4wwUUc7CAnDdkzXJ14SNFHVEQFNRjHtbg7ZoMfuOlHGDiG9/DPCCDgLjDBROFgon50ZV6mQ1/YVzwmgSniJhFryAMpybB4TLjJLRqTOZPUbZYIrwmiqZYC02lboXOIV0C3qm5nVZQGSSCiuaETOe5PygEg4AbXyM1lhJIxqqiWYUQklUaiShMGc2gFpBbDdcXl9StHXka38KVZ/i8V35DXzZibcClIWtRS90ZQpJa/ysZhtHiBV+pk8imm2TjTFwxsQWIHL42PaRd4iroW0ksZLKAFv5MoKbyQQVZl1mShc5LxYOo4Fxt4KyZPysXMhrOrwqKWyHGa8wiCHVSXtzDaxgYSA36xDEk4V5lvGpxRVIZb8pZ0Z571x7My6Up9S17SBhMGvjASfocCUi0TkvOaZMJh11vSPGVSEcT0s1JYyKKnu1BABQOMloeJ9ssMCg53phoKUkVDQs2MMcvNSsZICwfYufPZVB+o/86HxbAAXP/ah9Z2LuPSnAK5wqB1PLlIkmGEBkzVbwKuWolkE6ddXeYeb2akfEfwRTRnZRf89/r84Bf81NB73WtDQ+VUHKocfw1ob35J3QAXrYApq8X94edBmvVUZS9si/Qbr/wacWXgeN/LCCAHAQ+sNhvqhOiQOcNucZMKwQXh42XCkM95AELjZRFNjRCAPSxSmAbXlKXlNOlF0wj2WoqKi5Hnz5mdTGiQA8OCDDx4T6aiNGzeOufnmm5MBoKysrHbfvn3tVhf40hX8MSked1u1LUhx+e1mXGBIz1znC77xxtaJhmFQwzDo3LmPHBdJ6ezZs2cqIVf3UVt7unH16tWNsB4gwpItsPKdlSfTZd4EZH1MKKJkEX8WLfqnlPXr1/8oNTV1QQ8QgsG2pqamX+TkZG+OtP/y8jcn5efnb+nq6vKmpg7NfeONrZOmT5++3uVyZYTvp76+vjg3d8IWs2vy2DDcsunvUDrIQLrZBT3fgXduO4ZnrEx1aWlpbkHBrM0AkJyclFVZWZl3990TngpvT1dXl7e29vRLU6dOLTcxmT3+P3Hi5NLMzMwlhmEkh7fH7/cfraqqemHevLknTMy10yZci/mO2rR5GzZs2JaamrogGAy2Xbx4cWtTU9OLXq93r2EYyR6P52kLdQQAxMXFJR05cvSRGTNmvOZyuTJ8Pl+d1+utCa0fPXr0kydOnHzSzFRu+RLNM09j7qc+vHY5iIbe7Wu7gt8t+wwbGG9YAEBV1eHvT516z0uh9vj9/tpQW7Ozc54rL39zkt1Dh6+/Pl/h8XieNgwjORAInGpqanqxvb19TzAYbHO73VPz8vK2vfXW29kKUnuOLIZitYWFryjlq1RXV890uVxjAWD37oqFo0Z5fjR2bNYvRozIWLFx48b7zpw5s8EmqgYA5OTkrA8EAud2767452HD0ueOGJHxxLp16x7w+Xx1AODxeB5buXLlCDOf9d2L8H7rd3jFfQSzv/MBpjx7BrP/4yzmP1qP76W8j6U7m3HJzpoEg8Fr5ePHj1/n8/nqtmx5fe6wYemPpKffNreysnJxaP2999672sqi/eEPJ5YkJiZmAcDhw1WP3nrrLQVjx2Ztysi4ffmqVSunBAKBU4ZhJE+bNu1VDj81qosRZfVjyU0CABk6dGgmAHR2djYVFRWdCl+3du1Pzo0bl7PZDPxwCHw+X11R0aOPLFy4sCa0vrj4P8+9++7+jaE6P/jBY3NYgrTft8P3s0Y0rPkcn5R9jRaGtNR159zdnieeeuqpulBZYeGCmsbGxtcBwO12jzFT3Iceejh55MiRTwBAQ0PDzwsKCqrDj1NSUuL98MMPX+hW3pHvvXdwqoK+1jELs3KlVGHmbZPVgUBHGwAkJCRklpSUjBW9MB988PvXwwKaa3UWLVpUEwgEzgFAamrqnWYppZ+Owt8eHoeCfdmY/vYYTH43B9/76Nt4tP5uLHlrDCbyntd77x0oPnDggLd3nbNnz9aG/i4vf3NipG1XrFgxKeRD7tq1a2+k4+Tn570fDAbbAOD222/P5uwTJ9/41BJ9izaOKXVQXFxcWVxc/IxhGMmzZj20+5NPPn21vLx8+9q1Pzlrd/xwpWxtbfWawev3+//kcrkyUlJSJpi1618z8cs4guRIx/mmG34Aky2i0+si1bC29VgX1s4e7Q+vl5aWNiJUmJ2dnVlRUTGiWxUpAISi8M7OzqaQ66O4r7UM4HDyxTEpn+XXv/5V2/Tp/1CYn/+PryQkJGSmp6cvXbVq1dLFixdX19TUbJ49++Fjsvm1L774oqYbSMtcpOk6YrqOuwND6S7W/dx///0l6CdLfBQVkntZuHDhqfnz58/84Q9XP5iZmbkgMTExa8iQIZOnTZs2+fPP/2/7HXd8Y63uNrR04vitgzAt0rqvOnAADgyCjbScOXNmAyGEAoBhGNd+E4Jrqrl//77KGwlK6hSY27Zta922bdtWANsrKiomT5iQ+y+JiYlZaWlp83bs2LlvzpzZx0X3PXz48Nyr/utV3zLS8vgn+Onr3wK9ZRDuI93X7wpFW9Nl7J51GpsQpY+4jxuX8yqsHy9SxMAH5p1KCfGAq3R/BQUF1cuXLy8KOfKjRo3KipDQ7bGkpKQkmbXrpptuGg0AXq+33uyglRfQdtsxPJ15HJOL6pE/4xS+m3AY373jt3j59F/gtzn369oUUrXedQn5a3lYnR7n5fP5rvmdW7ZsyXKYHW1fVjMcbqjyLyjs2PF2W0dHx1nWHdx117cfz8vLS+q9r4MHD82Ji4tLAoDm5uY6WM/6gHMBdJZ+jfN7LqAVzn0cqceyb9871X/NZ9433+6GjCXwoqWUvJ1hCUFjY9O/19XVLSssLOwR+R469JsHQsnjy5cvtyHSY6swNRo8ePCdpaVl5WVlZbmhstLS0gnjx49fBVx9vPfssz/eEaFN17VrrQee34zDA59OwIrWKdjsvwf/uysL90TYhjKCyzPvOH3++efPtrS0bO+OxOedOHFyaaR9VldXz2hsbHpRQf9R8E05I8RFvNM+oY1Pavpik8vlykxJSSl85ZVNz7z00svvB4NBEhcXlxwG5OlJkyZuh/mLUSGTVzd48OA7Z84s+OX5883nuvd97Znz0aNH/u3gwYPeCBexRwDzq7/HXYvS8VrvE5mSjO8DOGzRCT0nc+oOTnp3bASzHrFD16xZs2HTpk1ZiYmJWR6P5+lLl1qXBAKBU6H1brd7Snh1sD2rjqqJNxw6sOzkobSqquoFv99/NHShhwwZMjkEZEtLy/Zly5YtMrubwzv40KFDL3/00UfPdXV1eV0uV0YIyEAgcK6iYtcTs2bN2m+iCD3KvuyAN1LDr1D8xSSwuFYW3p7m5mavHRQXLlxoM1FdunPnjtbly5cXNTQ0/DwYDLYZhpHsdrunhH6Aq4MyPv744yWM6kwZ1VFr7tDub7P/HR8lBIAUFRWlRBi2Fn6DXXec0CghAKisrFxcWLjgOABSVlY2MQRG92M+rhfHGnKxZmQiFgAgXRTeLzuwf+Vn+O//aUErg2ljnemMdZQOBUBLSkrGpqXdkhQCPz8/7wjYBveKjBLinenN1nIAoCpHnvNOEGD2zo0RATKrdbZvPJaXvzk5BOXevXsfnz9/Xg3jednlYsnEJAz5hhvuPRdwsfUKuhhUHzYdZjWvJAuwlBE8ltHoVnDa3UDCUKp8omM3QwPrdlb7sVuHSD5luLns/ttquhIzGCP6eMe9aD/uRTtnMAfoeSXCDkie9rGabuX+qFOPGSMFHdREgVjA6w0N7xt2PLNWUCur8ZwHnu8kYWTbFfiS4zHY3wX/nFr8llEZRGG0U1Fq4xebKR+PD6kN1mg80bEC1Awyq1dCbUG0UEpWv9sUrCcz8OOkePR4Xp79N7jr5J8RsIFSdo5yW//SQkV5VZIKmmKhaDxeEkKr90/AYM5Z1NIOFtuX4ktLS08TQhZRSklpaWkt+N+tNl28XfhjOJS+LtSf/DMuC4Aoo5i8QFKbDIFTSfbIT7M4Ah2WYEck+FH9Zh/AN+EVU6RtBuo3B2PQ1tGYlZYAT3sXvljXgMqdzWiTMN0qfEuegEVHlC38eq1IR7BOJgAOIKEATqt9mKWw7CJuFZPx83x+xA5Klq8+iAIJsL8kZrdOGso4zo5gnQhV9qsOVuMheYbYs3yvmmc9lagn+iUGarMPVsW0y5FSAUXXYuLjBXZMBLdhmU02UtBjFQzx+ps850EtoLfzpbnVgUN5VOQxWdVR9MtmUiki1Skhq3wiTIBkgRMCKR/CWM6bV+W581kHL7DkMXk+1sQKJK9VcWQEEq/5FjXhIsGF7Ddt7MDhufAqTBYFlHzuWORLYpRBSXnNtowvKaWULDN42W3D+hkNMOQhAfNEN8/stay5U5nv3/AGPLI5TFa/kgrUlb05uW7gOEF1UqWWdhOk8kS9Ks0uT3BDGbbn8Sl54VTla1qZZ542Sy9xnGkgcAAkOoMukQBT1L+TMfci7gGvOecxsSzmXTaYYTk/nuvODSVLmchH5cH5t+hMuyyjuFmdedFXGyij/waoiXhlHlOyHgsMbY5q9G3le/LOu83ywSHRNBXLY1GRtA9vwMPaqU59wVZFG6DoWkkppajS8XyHW8V3t4lEekP09VS7kTp2Ebmsvyli0kWyBSqsyHVlcYIAyviWsmASThhVBjY84wtZ9suaK5RJy4iaaNa8pVKVNINSRi11gSkSheu4o82UkAVmnhymKIgi0TnA/8hRNPKmqqHkVUsnwBR91Meqjiocd5ZASgQKFT4nT1DDA6TUdSOaymXAFEkniZp7FSOBdAU9LOkVqgBQp4BkLieKgLUqkzXvVuDx7EMEQl35URHoIAmODMAqFJIZyjjNKqriE8a8yXynAxsIdgRrp/KabxkYow6kjFKIqqjKZDnhvAFELYNO8w3Jjuc15yLmmjWoUQZlnIT5UgGmjGqyjLtUrXy6oGRRTl2QivqwrJaJG2KZ5DQvsKwmmccHZVVD2fSSLmXk6XxRSHgVU5U6iqqnFJSyYKqAU+QGiJVAh2oClUdhqeLjSgOpSjFkTbwOVRXNGEDB9aCSwFIFHa3DFZBRfi1Q6gBTFk4Rs63zGijrFIg/ylRt7lW3m6kOUagQqiJ5orFONKJtHR0ok/vUAaPKOrbRt2owZZVTJmhRDaKOYW26I1st06yoBFKmk4jD61UCShSfq1OdpTLgUDW6R8t87rqcfZ1BlMr6uq6Vjhf2owGvozDKmG9dyiQCeTSAiwXVdNIP1A2uls7QkYhW/fgzVgIeXVOe6ISFOnSOjjn+uuHsK5F2NM1hLG/jSGfpjoSdjLSJg7Cp7FjaR7ZzXEGcinBJDF8DnZ1Ho7wPrYNadHdINGCLdVMdrU6nMdimqHYgiaF2kn4IXJ8FMJY6iPRxsPqTksbc55ZJP2vHgOnuYwD2tU4k/eycaT891g0F5YDZ7qfQ3SidTAZgG4By4FwHgBtYBpYbZ/l/2EJnC9N0gaQAAAAASUVORK5CYII=", n;
    })();
    e.LoadingScreen = v;
  })(o.webgl || (o.webgl = {}));
})(F || (F = {}));
var F;
(function(o) {
  (function(e) {
    e.M00 = 0, e.M01 = 4, e.M02 = 8, e.M03 = 12, e.M10 = 1, e.M11 = 5, e.M12 = 9, e.M13 = 13, e.M20 = 2, e.M21 = 6, e.M22 = 10, e.M23 = 14, e.M30 = 3, e.M31 = 7, e.M32 = 11, e.M33 = 15;
    var v = (function() {
      function n() {
        this.temp = new Float32Array(16), this.values = new Float32Array(16);
        var t = this.values;
        t[e.M00] = 1, t[e.M11] = 1, t[e.M22] = 1, t[e.M33] = 1;
      }
      return n.prototype.set = function(t) {
        return this.values.set(t), this;
      }, n.prototype.transpose = function() {
        var t = this.temp, i = this.values;
        return t[e.M00] = i[e.M00], t[e.M01] = i[e.M10], t[e.M02] = i[e.M20], t[e.M03] = i[e.M30], t[e.M10] = i[e.M01], t[e.M11] = i[e.M11], t[e.M12] = i[e.M21], t[e.M13] = i[e.M31], t[e.M20] = i[e.M02], t[e.M21] = i[e.M12], t[e.M22] = i[e.M22], t[e.M23] = i[e.M32], t[e.M30] = i[e.M03], t[e.M31] = i[e.M13], t[e.M32] = i[e.M23], t[e.M33] = i[e.M33], this.set(t);
      }, n.prototype.identity = function() {
        var t = this.values;
        return t[e.M00] = 1, t[e.M01] = 0, t[e.M02] = 0, t[e.M03] = 0, t[e.M10] = 0, t[e.M11] = 1, t[e.M12] = 0, t[e.M13] = 0, t[e.M20] = 0, t[e.M21] = 0, t[e.M22] = 1, t[e.M23] = 0, t[e.M30] = 0, t[e.M31] = 0, t[e.M32] = 0, t[e.M33] = 1, this;
      }, n.prototype.invert = function() {
        var t = this.values, i = this.temp, r = t[e.M30] * t[e.M21] * t[e.M12] * t[e.M03] - t[e.M20] * t[e.M31] * t[e.M12] * t[e.M03] - t[e.M30] * t[e.M11] * t[e.M22] * t[e.M03] + t[e.M10] * t[e.M31] * t[e.M22] * t[e.M03] + t[e.M20] * t[e.M11] * t[e.M32] * t[e.M03] - t[e.M10] * t[e.M21] * t[e.M32] * t[e.M03] - t[e.M30] * t[e.M21] * t[e.M02] * t[e.M13] + t[e.M20] * t[e.M31] * t[e.M02] * t[e.M13] + t[e.M30] * t[e.M01] * t[e.M22] * t[e.M13] - t[e.M00] * t[e.M31] * t[e.M22] * t[e.M13] - t[e.M20] * t[e.M01] * t[e.M32] * t[e.M13] + t[e.M00] * t[e.M21] * t[e.M32] * t[e.M13] + t[e.M30] * t[e.M11] * t[e.M02] * t[e.M23] - t[e.M10] * t[e.M31] * t[e.M02] * t[e.M23] - t[e.M30] * t[e.M01] * t[e.M12] * t[e.M23] + t[e.M00] * t[e.M31] * t[e.M12] * t[e.M23] + t[e.M10] * t[e.M01] * t[e.M32] * t[e.M23] - t[e.M00] * t[e.M11] * t[e.M32] * t[e.M23] - t[e.M20] * t[e.M11] * t[e.M02] * t[e.M33] + t[e.M10] * t[e.M21] * t[e.M02] * t[e.M33] + t[e.M20] * t[e.M01] * t[e.M12] * t[e.M33] - t[e.M00] * t[e.M21] * t[e.M12] * t[e.M33] - t[e.M10] * t[e.M01] * t[e.M22] * t[e.M33] + t[e.M00] * t[e.M11] * t[e.M22] * t[e.M33];
        if (r == 0)
          throw new Error("non-invertible matrix");
        var a = 1 / r;
        return i[e.M00] = t[e.M12] * t[e.M23] * t[e.M31] - t[e.M13] * t[e.M22] * t[e.M31] + t[e.M13] * t[e.M21] * t[e.M32] - t[e.M11] * t[e.M23] * t[e.M32] - t[e.M12] * t[e.M21] * t[e.M33] + t[e.M11] * t[e.M22] * t[e.M33], i[e.M01] = t[e.M03] * t[e.M22] * t[e.M31] - t[e.M02] * t[e.M23] * t[e.M31] - t[e.M03] * t[e.M21] * t[e.M32] + t[e.M01] * t[e.M23] * t[e.M32] + t[e.M02] * t[e.M21] * t[e.M33] - t[e.M01] * t[e.M22] * t[e.M33], i[e.M02] = t[e.M02] * t[e.M13] * t[e.M31] - t[e.M03] * t[e.M12] * t[e.M31] + t[e.M03] * t[e.M11] * t[e.M32] - t[e.M01] * t[e.M13] * t[e.M32] - t[e.M02] * t[e.M11] * t[e.M33] + t[e.M01] * t[e.M12] * t[e.M33], i[e.M03] = t[e.M03] * t[e.M12] * t[e.M21] - t[e.M02] * t[e.M13] * t[e.M21] - t[e.M03] * t[e.M11] * t[e.M22] + t[e.M01] * t[e.M13] * t[e.M22] + t[e.M02] * t[e.M11] * t[e.M23] - t[e.M01] * t[e.M12] * t[e.M23], i[e.M10] = t[e.M13] * t[e.M22] * t[e.M30] - t[e.M12] * t[e.M23] * t[e.M30] - t[e.M13] * t[e.M20] * t[e.M32] + t[e.M10] * t[e.M23] * t[e.M32] + t[e.M12] * t[e.M20] * t[e.M33] - t[e.M10] * t[e.M22] * t[e.M33], i[e.M11] = t[e.M02] * t[e.M23] * t[e.M30] - t[e.M03] * t[e.M22] * t[e.M30] + t[e.M03] * t[e.M20] * t[e.M32] - t[e.M00] * t[e.M23] * t[e.M32] - t[e.M02] * t[e.M20] * t[e.M33] + t[e.M00] * t[e.M22] * t[e.M33], i[e.M12] = t[e.M03] * t[e.M12] * t[e.M30] - t[e.M02] * t[e.M13] * t[e.M30] - t[e.M03] * t[e.M10] * t[e.M32] + t[e.M00] * t[e.M13] * t[e.M32] + t[e.M02] * t[e.M10] * t[e.M33] - t[e.M00] * t[e.M12] * t[e.M33], i[e.M13] = t[e.M02] * t[e.M13] * t[e.M20] - t[e.M03] * t[e.M12] * t[e.M20] + t[e.M03] * t[e.M10] * t[e.M22] - t[e.M00] * t[e.M13] * t[e.M22] - t[e.M02] * t[e.M10] * t[e.M23] + t[e.M00] * t[e.M12] * t[e.M23], i[e.M20] = t[e.M11] * t[e.M23] * t[e.M30] - t[e.M13] * t[e.M21] * t[e.M30] + t[e.M13] * t[e.M20] * t[e.M31] - t[e.M10] * t[e.M23] * t[e.M31] - t[e.M11] * t[e.M20] * t[e.M33] + t[e.M10] * t[e.M21] * t[e.M33], i[e.M21] = t[e.M03] * t[e.M21] * t[e.M30] - t[e.M01] * t[e.M23] * t[e.M30] - t[e.M03] * t[e.M20] * t[e.M31] + t[e.M00] * t[e.M23] * t[e.M31] + t[e.M01] * t[e.M20] * t[e.M33] - t[e.M00] * t[e.M21] * t[e.M33], i[e.M22] = t[e.M01] * t[e.M13] * t[e.M30] - t[e.M03] * t[e.M11] * t[e.M30] + t[e.M03] * t[e.M10] * t[e.M31] - t[e.M00] * t[e.M13] * t[e.M31] - t[e.M01] * t[e.M10] * t[e.M33] + t[e.M00] * t[e.M11] * t[e.M33], i[e.M23] = t[e.M03] * t[e.M11] * t[e.M20] - t[e.M01] * t[e.M13] * t[e.M20] - t[e.M03] * t[e.M10] * t[e.M21] + t[e.M00] * t[e.M13] * t[e.M21] + t[e.M01] * t[e.M10] * t[e.M23] - t[e.M00] * t[e.M11] * t[e.M23], i[e.M30] = t[e.M12] * t[e.M21] * t[e.M30] - t[e.M11] * t[e.M22] * t[e.M30] - t[e.M12] * t[e.M20] * t[e.M31] + t[e.M10] * t[e.M22] * t[e.M31] + t[e.M11] * t[e.M20] * t[e.M32] - t[e.M10] * t[e.M21] * t[e.M32], i[e.M31] = t[e.M01] * t[e.M22] * t[e.M30] - t[e.M02] * t[e.M21] * t[e.M30] + t[e.M02] * t[e.M20] * t[e.M31] - t[e.M00] * t[e.M22] * t[e.M31] - t[e.M01] * t[e.M20] * t[e.M32] + t[e.M00] * t[e.M21] * t[e.M32], i[e.M32] = t[e.M02] * t[e.M11] * t[e.M30] - t[e.M01] * t[e.M12] * t[e.M30] - t[e.M02] * t[e.M10] * t[e.M31] + t[e.M00] * t[e.M12] * t[e.M31] + t[e.M01] * t[e.M10] * t[e.M32] - t[e.M00] * t[e.M11] * t[e.M32], i[e.M33] = t[e.M01] * t[e.M12] * t[e.M20] - t[e.M02] * t[e.M11] * t[e.M20] + t[e.M02] * t[e.M10] * t[e.M21] - t[e.M00] * t[e.M12] * t[e.M21] - t[e.M01] * t[e.M10] * t[e.M22] + t[e.M00] * t[e.M11] * t[e.M22], t[e.M00] = i[e.M00] * a, t[e.M01] = i[e.M01] * a, t[e.M02] = i[e.M02] * a, t[e.M03] = i[e.M03] * a, t[e.M10] = i[e.M10] * a, t[e.M11] = i[e.M11] * a, t[e.M12] = i[e.M12] * a, t[e.M13] = i[e.M13] * a, t[e.M20] = i[e.M20] * a, t[e.M21] = i[e.M21] * a, t[e.M22] = i[e.M22] * a, t[e.M23] = i[e.M23] * a, t[e.M30] = i[e.M30] * a, t[e.M31] = i[e.M31] * a, t[e.M32] = i[e.M32] * a, t[e.M33] = i[e.M33] * a, this;
      }, n.prototype.determinant = function() {
        var t = this.values;
        return t[e.M30] * t[e.M21] * t[e.M12] * t[e.M03] - t[e.M20] * t[e.M31] * t[e.M12] * t[e.M03] - t[e.M30] * t[e.M11] * t[e.M22] * t[e.M03] + t[e.M10] * t[e.M31] * t[e.M22] * t[e.M03] + t[e.M20] * t[e.M11] * t[e.M32] * t[e.M03] - t[e.M10] * t[e.M21] * t[e.M32] * t[e.M03] - t[e.M30] * t[e.M21] * t[e.M02] * t[e.M13] + t[e.M20] * t[e.M31] * t[e.M02] * t[e.M13] + t[e.M30] * t[e.M01] * t[e.M22] * t[e.M13] - t[e.M00] * t[e.M31] * t[e.M22] * t[e.M13] - t[e.M20] * t[e.M01] * t[e.M32] * t[e.M13] + t[e.M00] * t[e.M21] * t[e.M32] * t[e.M13] + t[e.M30] * t[e.M11] * t[e.M02] * t[e.M23] - t[e.M10] * t[e.M31] * t[e.M02] * t[e.M23] - t[e.M30] * t[e.M01] * t[e.M12] * t[e.M23] + t[e.M00] * t[e.M31] * t[e.M12] * t[e.M23] + t[e.M10] * t[e.M01] * t[e.M32] * t[e.M23] - t[e.M00] * t[e.M11] * t[e.M32] * t[e.M23] - t[e.M20] * t[e.M11] * t[e.M02] * t[e.M33] + t[e.M10] * t[e.M21] * t[e.M02] * t[e.M33] + t[e.M20] * t[e.M01] * t[e.M12] * t[e.M33] - t[e.M00] * t[e.M21] * t[e.M12] * t[e.M33] - t[e.M10] * t[e.M01] * t[e.M22] * t[e.M33] + t[e.M00] * t[e.M11] * t[e.M22] * t[e.M33];
      }, n.prototype.translate = function(t, i, r) {
        var a = this.values;
        return a[e.M03] += t, a[e.M13] += i, a[e.M23] += r, this;
      }, n.prototype.copy = function() {
        return new n().set(this.values);
      }, n.prototype.projection = function(t, i, r, a) {
        this.identity();
        var f = 1 / Math.tan(r * (Math.PI / 180) / 2), l = (i + t) / (t - i), p = 2 * i * t / (t - i), u = this.values;
        return u[e.M00] = f / a, u[e.M10] = 0, u[e.M20] = 0, u[e.M30] = 0, u[e.M01] = 0, u[e.M11] = f, u[e.M21] = 0, u[e.M31] = 0, u[e.M02] = 0, u[e.M12] = 0, u[e.M22] = l, u[e.M32] = -1, u[e.M03] = 0, u[e.M13] = 0, u[e.M23] = p, u[e.M33] = 0, this;
      }, n.prototype.ortho2d = function(t, i, r, a) {
        return this.ortho(t, t + r, i, i + a, 0, 1);
      }, n.prototype.ortho = function(t, i, r, a, f, l) {
        this.identity();
        var p = 2 / (i - t), u = 2 / (a - r), s = -2 / (l - f), h = -(i + t) / (i - t), d = -(a + r) / (a - r), c = -(l + f) / (l - f), M = this.values;
        return M[e.M00] = p, M[e.M10] = 0, M[e.M20] = 0, M[e.M30] = 0, M[e.M01] = 0, M[e.M11] = u, M[e.M21] = 0, M[e.M31] = 0, M[e.M02] = 0, M[e.M12] = 0, M[e.M22] = s, M[e.M32] = 0, M[e.M03] = h, M[e.M13] = d, M[e.M23] = c, M[e.M33] = 1, this;
      }, n.prototype.multiply = function(t) {
        var i = this.temp, r = this.values, a = t.values;
        return i[e.M00] = r[e.M00] * a[e.M00] + r[e.M01] * a[e.M10] + r[e.M02] * a[e.M20] + r[e.M03] * a[e.M30], i[e.M01] = r[e.M00] * a[e.M01] + r[e.M01] * a[e.M11] + r[e.M02] * a[e.M21] + r[e.M03] * a[e.M31], i[e.M02] = r[e.M00] * a[e.M02] + r[e.M01] * a[e.M12] + r[e.M02] * a[e.M22] + r[e.M03] * a[e.M32], i[e.M03] = r[e.M00] * a[e.M03] + r[e.M01] * a[e.M13] + r[e.M02] * a[e.M23] + r[e.M03] * a[e.M33], i[e.M10] = r[e.M10] * a[e.M00] + r[e.M11] * a[e.M10] + r[e.M12] * a[e.M20] + r[e.M13] * a[e.M30], i[e.M11] = r[e.M10] * a[e.M01] + r[e.M11] * a[e.M11] + r[e.M12] * a[e.M21] + r[e.M13] * a[e.M31], i[e.M12] = r[e.M10] * a[e.M02] + r[e.M11] * a[e.M12] + r[e.M12] * a[e.M22] + r[e.M13] * a[e.M32], i[e.M13] = r[e.M10] * a[e.M03] + r[e.M11] * a[e.M13] + r[e.M12] * a[e.M23] + r[e.M13] * a[e.M33], i[e.M20] = r[e.M20] * a[e.M00] + r[e.M21] * a[e.M10] + r[e.M22] * a[e.M20] + r[e.M23] * a[e.M30], i[e.M21] = r[e.M20] * a[e.M01] + r[e.M21] * a[e.M11] + r[e.M22] * a[e.M21] + r[e.M23] * a[e.M31], i[e.M22] = r[e.M20] * a[e.M02] + r[e.M21] * a[e.M12] + r[e.M22] * a[e.M22] + r[e.M23] * a[e.M32], i[e.M23] = r[e.M20] * a[e.M03] + r[e.M21] * a[e.M13] + r[e.M22] * a[e.M23] + r[e.M23] * a[e.M33], i[e.M30] = r[e.M30] * a[e.M00] + r[e.M31] * a[e.M10] + r[e.M32] * a[e.M20] + r[e.M33] * a[e.M30], i[e.M31] = r[e.M30] * a[e.M01] + r[e.M31] * a[e.M11] + r[e.M32] * a[e.M21] + r[e.M33] * a[e.M31], i[e.M32] = r[e.M30] * a[e.M02] + r[e.M31] * a[e.M12] + r[e.M32] * a[e.M22] + r[e.M33] * a[e.M32], i[e.M33] = r[e.M30] * a[e.M03] + r[e.M31] * a[e.M13] + r[e.M32] * a[e.M23] + r[e.M33] * a[e.M33], this.set(this.temp);
      }, n.prototype.multiplyLeft = function(t) {
        var i = this.temp, r = this.values, a = t.values;
        return i[e.M00] = a[e.M00] * r[e.M00] + a[e.M01] * r[e.M10] + a[e.M02] * r[e.M20] + a[e.M03] * r[e.M30], i[e.M01] = a[e.M00] * r[e.M01] + a[e.M01] * r[e.M11] + a[e.M02] * r[e.M21] + a[e.M03] * r[e.M31], i[e.M02] = a[e.M00] * r[e.M02] + a[e.M01] * r[e.M12] + a[e.M02] * r[e.M22] + a[e.M03] * r[e.M32], i[e.M03] = a[e.M00] * r[e.M03] + a[e.M01] * r[e.M13] + a[e.M02] * r[e.M23] + a[e.M03] * r[e.M33], i[e.M10] = a[e.M10] * r[e.M00] + a[e.M11] * r[e.M10] + a[e.M12] * r[e.M20] + a[e.M13] * r[e.M30], i[e.M11] = a[e.M10] * r[e.M01] + a[e.M11] * r[e.M11] + a[e.M12] * r[e.M21] + a[e.M13] * r[e.M31], i[e.M12] = a[e.M10] * r[e.M02] + a[e.M11] * r[e.M12] + a[e.M12] * r[e.M22] + a[e.M13] * r[e.M32], i[e.M13] = a[e.M10] * r[e.M03] + a[e.M11] * r[e.M13] + a[e.M12] * r[e.M23] + a[e.M13] * r[e.M33], i[e.M20] = a[e.M20] * r[e.M00] + a[e.M21] * r[e.M10] + a[e.M22] * r[e.M20] + a[e.M23] * r[e.M30], i[e.M21] = a[e.M20] * r[e.M01] + a[e.M21] * r[e.M11] + a[e.M22] * r[e.M21] + a[e.M23] * r[e.M31], i[e.M22] = a[e.M20] * r[e.M02] + a[e.M21] * r[e.M12] + a[e.M22] * r[e.M22] + a[e.M23] * r[e.M32], i[e.M23] = a[e.M20] * r[e.M03] + a[e.M21] * r[e.M13] + a[e.M22] * r[e.M23] + a[e.M23] * r[e.M33], i[e.M30] = a[e.M30] * r[e.M00] + a[e.M31] * r[e.M10] + a[e.M32] * r[e.M20] + a[e.M33] * r[e.M30], i[e.M31] = a[e.M30] * r[e.M01] + a[e.M31] * r[e.M11] + a[e.M32] * r[e.M21] + a[e.M33] * r[e.M31], i[e.M32] = a[e.M30] * r[e.M02] + a[e.M31] * r[e.M12] + a[e.M32] * r[e.M22] + a[e.M33] * r[e.M32], i[e.M33] = a[e.M30] * r[e.M03] + a[e.M31] * r[e.M13] + a[e.M32] * r[e.M23] + a[e.M33] * r[e.M33], this.set(this.temp);
      }, n.prototype.lookAt = function(t, i, r) {
        n.initTemps();
        var a = n.xAxis, f = n.yAxis, l = n.zAxis;
        l.setFrom(i).normalize(), a.setFrom(i).normalize(), a.cross(r).normalize(), f.setFrom(a).cross(l).normalize(), this.identity();
        var p = this.values;
        return p[e.M00] = a.x, p[e.M01] = a.y, p[e.M02] = a.z, p[e.M10] = f.x, p[e.M11] = f.y, p[e.M12] = f.z, p[e.M20] = -l.x, p[e.M21] = -l.y, p[e.M22] = -l.z, n.tmpMatrix.identity(), n.tmpMatrix.values[e.M03] = -t.x, n.tmpMatrix.values[e.M13] = -t.y, n.tmpMatrix.values[e.M23] = -t.z, this.multiply(n.tmpMatrix), this;
      }, n.initTemps = function() {
        n.xAxis === null && (n.xAxis = new e.Vector3()), n.yAxis === null && (n.yAxis = new e.Vector3()), n.zAxis === null && (n.zAxis = new e.Vector3());
      }, n.xAxis = null, n.yAxis = null, n.zAxis = null, n.tmpMatrix = new n(), n;
    })();
    e.Matrix4 = v;
  })(o.webgl || (o.webgl = {}));
})(F || (F = {}));
var F;
(function(o) {
  (function(e) {
    var v = (function() {
      function p(u, s, h, d) {
        this.attributes = s, this.verticesLength = 0, this.dirtyVertices = !1, this.indicesLength = 0, this.dirtyIndices = !1, this.elementsPerVertex = 0, this.context = u instanceof e.ManagedWebGLRenderingContext ? u : new e.ManagedWebGLRenderingContext(u), this.elementsPerVertex = 0;
        for (var c = 0; c < s.length; c++)
          this.elementsPerVertex += s[c].numElements;
        this.vertices = new Float32Array(h * this.elementsPerVertex), this.indices = new Uint16Array(d), this.context.addRestorable(this);
      }
      return p.prototype.getAttributes = function() {
        return this.attributes;
      }, p.prototype.maxVertices = function() {
        return this.vertices.length / this.elementsPerVertex;
      }, p.prototype.numVertices = function() {
        return this.verticesLength / this.elementsPerVertex;
      }, p.prototype.setVerticesLength = function(u) {
        this.dirtyVertices = !0, this.verticesLength = u;
      }, p.prototype.getVertices = function() {
        return this.vertices;
      }, p.prototype.maxIndices = function() {
        return this.indices.length;
      }, p.prototype.numIndices = function() {
        return this.indicesLength;
      }, p.prototype.setIndicesLength = function(u) {
        this.dirtyIndices = !0, this.indicesLength = u;
      }, p.prototype.getIndices = function() {
        return this.indices;
      }, p.prototype.getVertexSizeInFloats = function() {
        for (var u = 0, s = 0; s < this.attributes.length; s++) {
          var h = this.attributes[s];
          u += h.numElements;
        }
        return u;
      }, p.prototype.setVertices = function(u) {
        if (this.dirtyVertices = !0, u.length > this.vertices.length)
          throw Error("Mesh can't store more than " + this.maxVertices() + " vertices");
        this.vertices.set(u, 0), this.verticesLength = u.length;
      }, p.prototype.setIndices = function(u) {
        if (this.dirtyIndices = !0, u.length > this.indices.length)
          throw Error("Mesh can't store more than " + this.maxIndices() + " indices");
        this.indices.set(u, 0), this.indicesLength = u.length;
      }, p.prototype.draw = function(u, s) {
        this.drawWithOffset(u, s, 0, this.indicesLength > 0 ? this.indicesLength : this.verticesLength / this.elementsPerVertex);
      }, p.prototype.drawWithOffset = function(u, s, h, d) {
        var c = this.context.gl;
        (this.dirtyVertices || this.dirtyIndices) && this.update(), this.bind(u), this.indicesLength > 0 ? c.drawElements(s, d, c.UNSIGNED_SHORT, h * 2) : c.drawArrays(s, h, d), this.unbind(u);
      }, p.prototype.bind = function(u) {
        var s = this.context.gl;
        s.bindBuffer(s.ARRAY_BUFFER, this.verticesBuffer);
        for (var h = 0, d = 0; d < this.attributes.length; d++) {
          var c = this.attributes[d], M = u.getAttributeLocation(c.name);
          s.enableVertexAttribArray(M), s.vertexAttribPointer(M, c.numElements, s.FLOAT, !1, this.elementsPerVertex * 4, h * 4), h += c.numElements;
        }
        this.indicesLength > 0 && s.bindBuffer(s.ELEMENT_ARRAY_BUFFER, this.indicesBuffer);
      }, p.prototype.unbind = function(u) {
        for (var s = this.context.gl, h = 0; h < this.attributes.length; h++) {
          var d = this.attributes[h], c = u.getAttributeLocation(d.name);
          s.disableVertexAttribArray(c);
        }
        s.bindBuffer(s.ARRAY_BUFFER, null), this.indicesLength > 0 && s.bindBuffer(s.ELEMENT_ARRAY_BUFFER, null);
      }, p.prototype.update = function() {
        var u = this.context.gl;
        this.dirtyVertices && (this.verticesBuffer || (this.verticesBuffer = u.createBuffer()), u.bindBuffer(u.ARRAY_BUFFER, this.verticesBuffer), u.bufferData(u.ARRAY_BUFFER, this.vertices.subarray(0, this.verticesLength), u.DYNAMIC_DRAW), this.dirtyVertices = !1), this.dirtyIndices && (this.indicesBuffer || (this.indicesBuffer = u.createBuffer()), u.bindBuffer(u.ELEMENT_ARRAY_BUFFER, this.indicesBuffer), u.bufferData(u.ELEMENT_ARRAY_BUFFER, this.indices.subarray(0, this.indicesLength), u.DYNAMIC_DRAW), this.dirtyIndices = !1);
      }, p.prototype.restore = function() {
        this.verticesBuffer = null, this.indicesBuffer = null, this.update();
      }, p.prototype.dispose = function() {
        this.context.removeRestorable(this);
        var u = this.context.gl;
        u.deleteBuffer(this.verticesBuffer), u.deleteBuffer(this.indicesBuffer);
      }, p;
    })();
    e.Mesh = v;
    var n = /* @__PURE__ */ (function() {
      function p(u, s, h) {
        this.name = u, this.type = s, this.numElements = h;
      }
      return p;
    })();
    e.VertexAttribute = n;
    var t = (function(p) {
      $(u, p);
      function u() {
        return p.call(this, e.Shader.POSITION, l.Float, 2) || this;
      }
      return u;
    })(n);
    e.Position2Attribute = t;
    var i = (function(p) {
      $(u, p);
      function u() {
        return p.call(this, e.Shader.POSITION, l.Float, 3) || this;
      }
      return u;
    })(n);
    e.Position3Attribute = i;
    var r = (function(p) {
      $(u, p);
      function u(s) {
        return s === void 0 && (s = 0), p.call(this, e.Shader.TEXCOORDS + (s == 0 ? "" : s), l.Float, 2) || this;
      }
      return u;
    })(n);
    e.TexCoordAttribute = r;
    var a = (function(p) {
      $(u, p);
      function u() {
        return p.call(this, e.Shader.COLOR, l.Float, 4) || this;
      }
      return u;
    })(n);
    e.ColorAttribute = a;
    var f = (function(p) {
      $(u, p);
      function u() {
        return p.call(this, e.Shader.COLOR2, l.Float, 4) || this;
      }
      return u;
    })(n);
    e.Color2Attribute = f;
    var l;
    (function(p) {
      p[p.Float = 0] = "Float";
    })(l = e.VertexAttributeType || (e.VertexAttributeType = {}));
  })(o.webgl || (o.webgl = {}));
})(F || (F = {}));
var F;
(function(o) {
  (function(e) {
    var v = (function() {
      function n(t, i, r) {
        if (i === void 0 && (i = !0), r === void 0 && (r = 10920), this.isDrawing = !1, this.shader = null, this.lastTexture = null, this.verticesLength = 0, this.indicesLength = 0, r > 10920)
          throw new Error("Can't have more than 10920 triangles per batch: " + r);
        this.context = t instanceof e.ManagedWebGLRenderingContext ? t : new e.ManagedWebGLRenderingContext(t);
        var a = i ? [new e.Position2Attribute(), new e.ColorAttribute(), new e.TexCoordAttribute(), new e.Color2Attribute()] : [new e.Position2Attribute(), new e.ColorAttribute(), new e.TexCoordAttribute()];
        this.mesh = new e.Mesh(t, a, r, r * 3), this.srcBlend = this.context.gl.SRC_ALPHA, this.dstBlend = this.context.gl.ONE_MINUS_SRC_ALPHA;
      }
      return n.prototype.begin = function(t) {
        var i = this.context.gl;
        if (this.isDrawing)
          throw new Error("PolygonBatch is already drawing. Call PolygonBatch.end() before calling PolygonBatch.begin()");
        this.drawCalls = 0, this.shader = t, this.lastTexture = null, this.isDrawing = !0, i.enable(i.BLEND), i.blendFunc(this.srcBlend, this.dstBlend);
      }, n.prototype.setBlendMode = function(t, i) {
        var r = this.context.gl;
        this.srcBlend = t, this.dstBlend = i, this.isDrawing && (this.flush(), r.blendFunc(this.srcBlend, this.dstBlend));
      }, n.prototype.draw = function(t, i, r) {
        t != this.lastTexture ? (this.flush(), this.lastTexture = t) : (this.verticesLength + i.length > this.mesh.getVertices().length || this.indicesLength + r.length > this.mesh.getIndices().length) && this.flush();
        var a = this.mesh.numVertices();
        this.mesh.getVertices().set(i, this.verticesLength), this.verticesLength += i.length, this.mesh.setVerticesLength(this.verticesLength);
        for (var f = this.mesh.getIndices(), l = this.indicesLength, p = 0; p < r.length; l++, p++)
          f[l] = r[p] + a;
        this.indicesLength += r.length, this.mesh.setIndicesLength(this.indicesLength);
      }, n.prototype.flush = function() {
        var t = this.context.gl;
        this.verticesLength != 0 && (this.lastTexture.bind(), this.mesh.draw(this.shader, t.TRIANGLES), this.verticesLength = 0, this.indicesLength = 0, this.mesh.setVerticesLength(0), this.mesh.setIndicesLength(0), this.drawCalls++);
      }, n.prototype.end = function() {
        var t = this.context.gl;
        if (!this.isDrawing)
          throw new Error("PolygonBatch is not drawing. Call PolygonBatch.begin() before calling PolygonBatch.end()");
        (this.verticesLength > 0 || this.indicesLength > 0) && this.flush(), this.shader = null, this.lastTexture = null, this.isDrawing = !1, t.disable(t.BLEND);
      }, n.prototype.getDrawCalls = function() {
        return this.drawCalls;
      }, n.prototype.dispose = function() {
        this.mesh.dispose();
      }, n;
    })();
    e.PolygonBatcher = v;
  })(o.webgl || (o.webgl = {}));
})(F || (F = {}));
var F;
(function(o) {
  (function(e) {
    var v = (function() {
      function t(i, r, a) {
        a === void 0 && (a = !0), this.twoColorTint = !1, this.activeRenderer = null, this.QUAD = [
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
        ], this.QUAD_TRIANGLES = [0, 1, 2, 2, 3, 0], this.WHITE = new o.Color(1, 1, 1, 1), this.canvas = i, this.context = r instanceof e.ManagedWebGLRenderingContext ? r : new e.ManagedWebGLRenderingContext(r), this.twoColorTint = a, this.camera = new e.OrthoCamera(i.width, i.height), this.batcherShader = a ? e.Shader.newTwoColoredTextured(this.context) : e.Shader.newColoredTextured(this.context), this.batcher = new e.PolygonBatcher(this.context, a), this.shapesShader = e.Shader.newColored(this.context), this.shapes = new e.ShapeRenderer(this.context), this.skeletonRenderer = new e.SkeletonRenderer(this.context, a), this.skeletonDebugRenderer = new e.SkeletonDebugRenderer(this.context);
      }
      return t.prototype.begin = function() {
        this.camera.update(), this.enableRenderer(this.batcher);
      }, t.prototype.drawSkeleton = function(i, r, a, f) {
        r === void 0 && (r = !1), a === void 0 && (a = -1), f === void 0 && (f = -1), this.enableRenderer(this.batcher), this.skeletonRenderer.premultipliedAlpha = r, this.skeletonRenderer.draw(this.batcher, i, a, f);
      }, t.prototype.drawSkeletonDebug = function(i, r, a) {
        r === void 0 && (r = !1), a === void 0 && (a = null), this.enableRenderer(this.shapes), this.skeletonDebugRenderer.premultipliedAlpha = r, this.skeletonDebugRenderer.draw(this.shapes, i, a);
      }, t.prototype.drawTexture = function(i, r, a, f, l, p) {
        p === void 0 && (p = null), this.enableRenderer(this.batcher), p === null && (p = this.WHITE);
        var u = this.QUAD, s = 0;
        u[s++] = r, u[s++] = a, u[s++] = p.r, u[s++] = p.g, u[s++] = p.b, u[s++] = p.a, u[s++] = 0, u[s++] = 1, this.twoColorTint && (u[s++] = 0, u[s++] = 0, u[s++] = 0, u[s++] = 0), u[s++] = r + f, u[s++] = a, u[s++] = p.r, u[s++] = p.g, u[s++] = p.b, u[s++] = p.a, u[s++] = 1, u[s++] = 1, this.twoColorTint && (u[s++] = 0, u[s++] = 0, u[s++] = 0, u[s++] = 0), u[s++] = r + f, u[s++] = a + l, u[s++] = p.r, u[s++] = p.g, u[s++] = p.b, u[s++] = p.a, u[s++] = 1, u[s++] = 0, this.twoColorTint && (u[s++] = 0, u[s++] = 0, u[s++] = 0, u[s++] = 0), u[s++] = r, u[s++] = a + l, u[s++] = p.r, u[s++] = p.g, u[s++] = p.b, u[s++] = p.a, u[s++] = 0, u[s++] = 0, this.twoColorTint && (u[s++] = 0, u[s++] = 0, u[s++] = 0, u[s++] = 0), this.batcher.draw(i, u, this.QUAD_TRIANGLES);
      }, t.prototype.drawTextureUV = function(i, r, a, f, l, p, u, s, h, d) {
        d === void 0 && (d = null), this.enableRenderer(this.batcher), d === null && (d = this.WHITE);
        var c = this.QUAD, M = 0;
        c[M++] = r, c[M++] = a, c[M++] = d.r, c[M++] = d.g, c[M++] = d.b, c[M++] = d.a, c[M++] = p, c[M++] = u, this.twoColorTint && (c[M++] = 0, c[M++] = 0, c[M++] = 0, c[M++] = 0), c[M++] = r + f, c[M++] = a, c[M++] = d.r, c[M++] = d.g, c[M++] = d.b, c[M++] = d.a, c[M++] = s, c[M++] = u, this.twoColorTint && (c[M++] = 0, c[M++] = 0, c[M++] = 0, c[M++] = 0), c[M++] = r + f, c[M++] = a + l, c[M++] = d.r, c[M++] = d.g, c[M++] = d.b, c[M++] = d.a, c[M++] = s, c[M++] = h, this.twoColorTint && (c[M++] = 0, c[M++] = 0, c[M++] = 0, c[M++] = 0), c[M++] = r, c[M++] = a + l, c[M++] = d.r, c[M++] = d.g, c[M++] = d.b, c[M++] = d.a, c[M++] = p, c[M++] = h, this.twoColorTint && (c[M++] = 0, c[M++] = 0, c[M++] = 0, c[M++] = 0), this.batcher.draw(i, c, this.QUAD_TRIANGLES);
      }, t.prototype.drawTextureRotated = function(i, r, a, f, l, p, u, s, h, d) {
        h === void 0 && (h = null), this.enableRenderer(this.batcher), h === null && (h = this.WHITE);
        var c = this.QUAD, M = r + p, C = a + u, S = -p, L = -u, E = f - p, A = l - u, g = S, m = L, x = S, P = A, I = E, O = A, R = E, D = L, N = 0, k = 0, y = 0, T = 0, B = 0, V = 0, G = 0, Y = 0;
        if (s != 0) {
          var X = o.MathUtils.cosDeg(s), _ = o.MathUtils.sinDeg(s);
          N = X * g - _ * m, k = _ * g + X * m, G = X * x - _ * P, Y = _ * x + X * P, B = X * I - _ * O, V = _ * I + X * O, y = B + (N - G), T = V + (k - Y);
        } else
          N = g, k = m, G = x, Y = P, B = I, V = O, y = R, T = D;
        N += M, k += C, y += M, T += C, B += M, V += C, G += M, Y += C;
        var W = 0;
        c[W++] = N, c[W++] = k, c[W++] = h.r, c[W++] = h.g, c[W++] = h.b, c[W++] = h.a, c[W++] = 0, c[W++] = 1, this.twoColorTint && (c[W++] = 0, c[W++] = 0, c[W++] = 0, c[W++] = 0), c[W++] = y, c[W++] = T, c[W++] = h.r, c[W++] = h.g, c[W++] = h.b, c[W++] = h.a, c[W++] = 1, c[W++] = 1, this.twoColorTint && (c[W++] = 0, c[W++] = 0, c[W++] = 0, c[W++] = 0), c[W++] = B, c[W++] = V, c[W++] = h.r, c[W++] = h.g, c[W++] = h.b, c[W++] = h.a, c[W++] = 1, c[W++] = 0, this.twoColorTint && (c[W++] = 0, c[W++] = 0, c[W++] = 0, c[W++] = 0), c[W++] = G, c[W++] = Y, c[W++] = h.r, c[W++] = h.g, c[W++] = h.b, c[W++] = h.a, c[W++] = 0, c[W++] = 0, this.twoColorTint && (c[W++] = 0, c[W++] = 0, c[W++] = 0, c[W++] = 0), this.batcher.draw(i, c, this.QUAD_TRIANGLES);
      }, t.prototype.drawRegion = function(i, r, a, f, l, p, u) {
        p === void 0 && (p = null), this.enableRenderer(this.batcher), p === null && (p = this.WHITE);
        var s = this.QUAD, h = 0;
        s[h++] = r, s[h++] = a, s[h++] = p.r, s[h++] = p.g, s[h++] = p.b, s[h++] = p.a, s[h++] = i.u, s[h++] = i.v2, this.twoColorTint && (s[h++] = 0, s[h++] = 0, s[h++] = 0, s[h++] = 0), s[h++] = r + f, s[h++] = a, s[h++] = p.r, s[h++] = p.g, s[h++] = p.b, s[h++] = p.a, s[h++] = i.u2, s[h++] = i.v2, this.twoColorTint && (s[h++] = 0, s[h++] = 0, s[h++] = 0, s[h++] = 0), s[h++] = r + f, s[h++] = a + l, s[h++] = p.r, s[h++] = p.g, s[h++] = p.b, s[h++] = p.a, s[h++] = i.u2, s[h++] = i.v, this.twoColorTint && (s[h++] = 0, s[h++] = 0, s[h++] = 0, s[h++] = 0), s[h++] = r, s[h++] = a + l, s[h++] = p.r, s[h++] = p.g, s[h++] = p.b, s[h++] = p.a, s[h++] = i.u, s[h++] = i.v, this.twoColorTint && (s[h++] = 0, s[h++] = 0, s[h++] = 0, s[h++] = 0), this.batcher.draw(i.texture, s, this.QUAD_TRIANGLES);
      }, t.prototype.line = function(i, r, a, f, l, p) {
        l === void 0 && (l = null), this.enableRenderer(this.shapes), this.shapes.line(i, r, a, f, l);
      }, t.prototype.triangle = function(i, r, a, f, l, p, u, s, h, d) {
        s === void 0 && (s = null), h === void 0 && (h = null), d === void 0 && (d = null), this.enableRenderer(this.shapes), this.shapes.triangle(i, r, a, f, l, p, u, s, h, d);
      }, t.prototype.quad = function(i, r, a, f, l, p, u, s, h, d, c, M, C) {
        d === void 0 && (d = null), c === void 0 && (c = null), M === void 0 && (M = null), C === void 0 && (C = null), this.enableRenderer(this.shapes), this.shapes.quad(i, r, a, f, l, p, u, s, h, d, c, M, C);
      }, t.prototype.rect = function(i, r, a, f, l, p) {
        p === void 0 && (p = null), this.enableRenderer(this.shapes), this.shapes.rect(i, r, a, f, l, p);
      }, t.prototype.rectLine = function(i, r, a, f, l, p, u) {
        u === void 0 && (u = null), this.enableRenderer(this.shapes), this.shapes.rectLine(i, r, a, f, l, p, u);
      }, t.prototype.polygon = function(i, r, a, f) {
        f === void 0 && (f = null), this.enableRenderer(this.shapes), this.shapes.polygon(i, r, a, f);
      }, t.prototype.circle = function(i, r, a, f, l, p) {
        l === void 0 && (l = null), p === void 0 && (p = 0), this.enableRenderer(this.shapes), this.shapes.circle(i, r, a, f, l, p);
      }, t.prototype.curve = function(i, r, a, f, l, p, u, s, h, d) {
        d === void 0 && (d = null), this.enableRenderer(this.shapes), this.shapes.curve(i, r, a, f, l, p, u, s, h, d);
      }, t.prototype.end = function() {
        this.activeRenderer === this.batcher ? this.batcher.end() : this.activeRenderer === this.shapes && this.shapes.end(), this.activeRenderer = null;
      }, t.prototype.resize = function(i) {
        var r = this.canvas, a = r.clientWidth, f = r.clientHeight;
        if ((r.width != a || r.height != f) && (r.width = a, r.height = f), this.context.gl.viewport(0, 0, r.width, r.height), i !== n.Stretch) {
          if (i === n.Expand)
            this.camera.setViewport(a, f);
          else if (i === n.Fit) {
            var l = r.width, p = r.height, u = this.camera.viewportWidth, s = this.camera.viewportHeight, h = s / u, d = p / l, c = h < d ? u / l : s / p;
            this.camera.viewportWidth = l * c, this.camera.viewportHeight = p * c;
          }
        }
        this.camera.update();
      }, t.prototype.enableRenderer = function(i) {
        this.activeRenderer !== i && (this.end(), i instanceof e.PolygonBatcher ? (this.batcherShader.bind(), this.batcherShader.setUniform4x4f(e.Shader.MVP_MATRIX, this.camera.projectionView.values), this.batcherShader.setUniformi("u_texture", 0), this.batcher.begin(this.batcherShader), this.activeRenderer = this.batcher) : i instanceof e.ShapeRenderer ? (this.shapesShader.bind(), this.shapesShader.setUniform4x4f(e.Shader.MVP_MATRIX, this.camera.projectionView.values), this.shapes.begin(this.shapesShader), this.activeRenderer = this.shapes) : this.activeRenderer = this.skeletonDebugRenderer);
      }, t.prototype.dispose = function() {
        this.batcher.dispose(), this.batcherShader.dispose(), this.shapes.dispose(), this.shapesShader.dispose(), this.skeletonDebugRenderer.dispose();
      }, t;
    })();
    e.SceneRenderer = v;
    var n;
    (function(t) {
      t[t.Stretch = 0] = "Stretch", t[t.Expand = 1] = "Expand", t[t.Fit = 2] = "Fit";
    })(n = e.ResizeMode || (e.ResizeMode = {}));
  })(o.webgl || (o.webgl = {}));
})(F || (F = {}));
var F;
(function(o) {
  (function(e) {
    var v = (function() {
      function n(t, i, r) {
        this.vertexShader = i, this.fragmentShader = r, this.vs = null, this.fs = null, this.program = null, this.tmp2x2 = new Float32Array(4), this.tmp3x3 = new Float32Array(9), this.tmp4x4 = new Float32Array(16), this.vsSource = i, this.fsSource = r, this.context = t instanceof e.ManagedWebGLRenderingContext ? t : new e.ManagedWebGLRenderingContext(t), this.context.addRestorable(this), this.compile();
      }
      return n.prototype.getProgram = function() {
        return this.program;
      }, n.prototype.getVertexShader = function() {
        return this.vertexShader;
      }, n.prototype.getFragmentShader = function() {
        return this.fragmentShader;
      }, n.prototype.getVertexShaderSource = function() {
        return this.vsSource;
      }, n.prototype.getFragmentSource = function() {
        return this.fsSource;
      }, n.prototype.compile = function() {
        var t = this.context.gl;
        try {
          this.vs = this.compileShader(t.VERTEX_SHADER, this.vertexShader), this.fs = this.compileShader(t.FRAGMENT_SHADER, this.fragmentShader), this.program = this.compileProgram(this.vs, this.fs);
        } catch (i) {
          throw this.dispose(), i;
        }
      }, n.prototype.compileShader = function(t, i) {
        var r = this.context.gl, a = r.createShader(t);
        if (r.shaderSource(a, i), r.compileShader(a), !r.getShaderParameter(a, r.COMPILE_STATUS)) {
          var f = "Couldn't compile shader: " + r.getShaderInfoLog(a);
          if (r.deleteShader(a), !r.isContextLost())
            throw new Error(f);
        }
        return a;
      }, n.prototype.compileProgram = function(t, i) {
        var r = this.context.gl, a = r.createProgram();
        if (r.attachShader(a, t), r.attachShader(a, i), r.linkProgram(a), !r.getProgramParameter(a, r.LINK_STATUS)) {
          var f = "Couldn't compile shader program: " + r.getProgramInfoLog(a);
          if (r.deleteProgram(a), !r.isContextLost())
            throw new Error(f);
        }
        return a;
      }, n.prototype.restore = function() {
        this.compile();
      }, n.prototype.bind = function() {
        this.context.gl.useProgram(this.program);
      }, n.prototype.unbind = function() {
        this.context.gl.useProgram(null);
      }, n.prototype.setUniformi = function(t, i) {
        this.context.gl.uniform1i(this.getUniformLocation(t), i);
      }, n.prototype.setUniformf = function(t, i) {
        this.context.gl.uniform1f(this.getUniformLocation(t), i);
      }, n.prototype.setUniform2f = function(t, i, r) {
        this.context.gl.uniform2f(this.getUniformLocation(t), i, r);
      }, n.prototype.setUniform3f = function(t, i, r, a) {
        this.context.gl.uniform3f(this.getUniformLocation(t), i, r, a);
      }, n.prototype.setUniform4f = function(t, i, r, a, f) {
        this.context.gl.uniform4f(this.getUniformLocation(t), i, r, a, f);
      }, n.prototype.setUniform2x2f = function(t, i) {
        var r = this.context.gl;
        this.tmp2x2.set(i), r.uniformMatrix2fv(this.getUniformLocation(t), !1, this.tmp2x2);
      }, n.prototype.setUniform3x3f = function(t, i) {
        var r = this.context.gl;
        this.tmp3x3.set(i), r.uniformMatrix3fv(this.getUniformLocation(t), !1, this.tmp3x3);
      }, n.prototype.setUniform4x4f = function(t, i) {
        var r = this.context.gl;
        this.tmp4x4.set(i), r.uniformMatrix4fv(this.getUniformLocation(t), !1, this.tmp4x4);
      }, n.prototype.getUniformLocation = function(t) {
        var i = this.context.gl, r = i.getUniformLocation(this.program, t);
        if (!r && !i.isContextLost())
          throw new Error("Couldn't find location for uniform " + t);
        return r;
      }, n.prototype.getAttributeLocation = function(t) {
        var i = this.context.gl, r = i.getAttribLocation(this.program, t);
        if (r == -1 && !i.isContextLost())
          throw new Error("Couldn't find location for attribute " + t);
        return r;
      }, n.prototype.dispose = function() {
        this.context.removeRestorable(this);
        var t = this.context.gl;
        this.vs && (t.deleteShader(this.vs), this.vs = null), this.fs && (t.deleteShader(this.fs), this.fs = null), this.program && (t.deleteProgram(this.program), this.program = null);
      }, n.newColoredTextured = function(t) {
        var i = `
				attribute vec4 ` + n.POSITION + `;
				attribute vec4 ` + n.COLOR + `;
				attribute vec2 ` + n.TEXCOORDS + `;
				uniform mat4 ` + n.MVP_MATRIX + `;
				varying vec4 v_color;
				varying vec2 v_texCoords;

				void main () {
					v_color = ` + n.COLOR + `;
					v_texCoords = ` + n.TEXCOORDS + `;
					gl_Position = ` + n.MVP_MATRIX + " * " + n.POSITION + `;
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
        return new n(t, i, r);
      }, n.newTwoColoredTextured = function(t) {
        var i = `
				attribute vec4 ` + n.POSITION + `;
				attribute vec4 ` + n.COLOR + `;
				attribute vec4 ` + n.COLOR2 + `;
				attribute vec2 ` + n.TEXCOORDS + `;
				uniform mat4 ` + n.MVP_MATRIX + `;
				varying vec4 v_light;
				varying vec4 v_dark;
				varying vec2 v_texCoords;

				void main () {
					v_light = ` + n.COLOR + `;
					v_dark = ` + n.COLOR2 + `;
					v_texCoords = ` + n.TEXCOORDS + `;
					gl_Position = ` + n.MVP_MATRIX + " * " + n.POSITION + `;
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
        return new n(t, i, r);
      }, n.newColored = function(t) {
        var i = `
				attribute vec4 ` + n.POSITION + `;
				attribute vec4 ` + n.COLOR + `;
				uniform mat4 ` + n.MVP_MATRIX + `;
				varying vec4 v_color;

				void main () {
					v_color = ` + n.COLOR + `;
					gl_Position = ` + n.MVP_MATRIX + " * " + n.POSITION + `;
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
        return new n(t, i, r);
      }, n.MVP_MATRIX = "u_projTrans", n.POSITION = "a_position", n.COLOR = "a_color", n.COLOR2 = "a_color2", n.TEXCOORDS = "a_texCoords", n.SAMPLER = "u_texture", n;
    })();
    e.Shader = v;
  })(o.webgl || (o.webgl = {}));
})(F || (F = {}));
var F;
(function(o) {
  (function(e) {
    var v = (function() {
      function t(i, r) {
        if (r === void 0 && (r = 10920), this.isDrawing = !1, this.shapeType = n.Filled, this.color = new o.Color(1, 1, 1, 1), this.vertexIndex = 0, this.tmp = new o.Vector2(), r > 10920)
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
        var a = this.context.gl;
        this.srcBlend = i, this.dstBlend = r, this.isDrawing && (this.flush(), a.blendFunc(this.srcBlend, this.dstBlend));
      }, t.prototype.setColor = function(i) {
        this.color.setFromColor(i);
      }, t.prototype.setColorWith = function(i, r, a, f) {
        this.color.set(i, r, a, f);
      }, t.prototype.point = function(i, r, a) {
        a === void 0 && (a = null), this.check(n.Point, 1), a === null && (a = this.color), this.vertex(i, r, a);
      }, t.prototype.line = function(i, r, a, f, l) {
        l === void 0 && (l = null), this.check(n.Line, 2), this.mesh.getVertices(), this.vertexIndex, l === null && (l = this.color), this.vertex(i, r, l), this.vertex(a, f, l);
      }, t.prototype.triangle = function(i, r, a, f, l, p, u, s, h, d) {
        s === void 0 && (s = null), h === void 0 && (h = null), d === void 0 && (d = null), this.check(i ? n.Filled : n.Line, 3), this.mesh.getVertices(), this.vertexIndex, s === null && (s = this.color), h === null && (h = this.color), d === null && (d = this.color), i ? (this.vertex(r, a, s), this.vertex(f, l, h), this.vertex(p, u, d)) : (this.vertex(r, a, s), this.vertex(f, l, h), this.vertex(f, l, s), this.vertex(p, u, h), this.vertex(p, u, s), this.vertex(r, a, h));
      }, t.prototype.quad = function(i, r, a, f, l, p, u, s, h, d, c, M, C) {
        d === void 0 && (d = null), c === void 0 && (c = null), M === void 0 && (M = null), C === void 0 && (C = null), this.check(i ? n.Filled : n.Line, 3), this.mesh.getVertices(), this.vertexIndex, d === null && (d = this.color), c === null && (c = this.color), M === null && (M = this.color), C === null && (C = this.color), i ? (this.vertex(r, a, d), this.vertex(f, l, c), this.vertex(p, u, M), this.vertex(p, u, M), this.vertex(s, h, C), this.vertex(r, a, d)) : (this.vertex(r, a, d), this.vertex(f, l, c), this.vertex(f, l, c), this.vertex(p, u, M), this.vertex(p, u, M), this.vertex(s, h, C), this.vertex(s, h, C), this.vertex(r, a, d));
      }, t.prototype.rect = function(i, r, a, f, l, p) {
        p === void 0 && (p = null), this.quad(i, r, a, r + f, a, r + f, a + l, r, a + l, p, p, p, p);
      }, t.prototype.rectLine = function(i, r, a, f, l, p, u) {
        u === void 0 && (u = null), this.check(i ? n.Filled : n.Line, 8), u === null && (u = this.color);
        var s = this.tmp.set(l - a, r - f);
        s.normalize(), p *= 0.5;
        var h = s.x * p, d = s.y * p;
        i ? (this.vertex(r + h, a + d, u), this.vertex(r - h, a - d, u), this.vertex(f + h, l + d, u), this.vertex(f - h, l - d, u), this.vertex(f + h, l + d, u), this.vertex(r - h, a - d, u)) : (this.vertex(r + h, a + d, u), this.vertex(r - h, a - d, u), this.vertex(f + h, l + d, u), this.vertex(f - h, l - d, u), this.vertex(f + h, l + d, u), this.vertex(r + h, a + d, u), this.vertex(f - h, l - d, u), this.vertex(r - h, a - d, u));
      }, t.prototype.x = function(i, r, a) {
        this.line(i - a, r - a, i + a, r + a), this.line(i - a, r + a, i + a, r - a);
      }, t.prototype.polygon = function(i, r, a, f) {
        if (f === void 0 && (f = null), a < 3)
          throw new Error("Polygon must contain at least 3 vertices");
        this.check(n.Line, a * 2), f === null && (f = this.color), this.mesh.getVertices(), this.vertexIndex, r <<= 1, a <<= 1;
        for (var l = i[r], p = i[r + 1], u = r + a, s = r, h = r + a - 2; s < h; s += 2) {
          var d = i[s], c = i[s + 1], M = 0, C = 0;
          s + 2 >= u ? (M = l, C = p) : (M = i[s + 2], C = i[s + 3]), this.vertex(d, c, f), this.vertex(M, C, f);
        }
      }, t.prototype.circle = function(i, r, a, f, l, p) {
        if (l === void 0 && (l = null), p === void 0 && (p = 0), p === 0 && (p = Math.max(1, 6 * o.MathUtils.cbrt(f) | 0)), p <= 0)
          throw new Error("segments must be > 0.");
        l === null && (l = this.color);
        var u = 2 * o.MathUtils.PI / p, s = Math.cos(u), h = Math.sin(u), d = f, c = 0;
        if (i) {
          this.check(n.Filled, p * 3 + 3), p--;
          for (var M = 0; M < p; M++) {
            this.vertex(r, a, l), this.vertex(r + d, a + c, l);
            var S = d;
            d = s * d - h * c, c = h * S + s * c, this.vertex(r + d, a + c, l);
          }
          this.vertex(r, a, l), this.vertex(r + d, a + c, l);
        } else {
          this.check(n.Line, p * 2 + 2);
          for (var M = 0; M < p; M++) {
            this.vertex(r + d, a + c, l);
            var C = d;
            d = s * d - h * c, c = h * C + s * c, this.vertex(r + d, a + c, l);
          }
          this.vertex(r + d, a + c, l);
        }
        d = f, c = 0, this.vertex(r + d, a + c, l);
      }, t.prototype.curve = function(i, r, a, f, l, p, u, s, h, d) {
        d === void 0 && (d = null), this.check(n.Line, h * 2 + 2), d === null && (d = this.color);
        for (var c = 1 / h, M = c * c, C = c * c * c, S = 3 * c, L = 3 * M, E = 6 * M, A = 6 * C, g = i - a * 2 + l, m = r - f * 2 + p, x = (a - l) * 3 - i + u, P = (f - p) * 3 - r + s, I = i, O = r, R = (a - i) * S + g * L + x * C, D = (f - r) * S + m * L + P * C, N = g * E + x * A, k = m * E + P * A, y = x * A, T = P * A; h-- > 0; )
          this.vertex(I, O, d), I += R, O += D, R += N, D += k, N += y, k += T, this.vertex(I, O, d);
        this.vertex(I, O, d), this.vertex(u, s, d);
      }, t.prototype.vertex = function(i, r, a) {
        var f = this.vertexIndex, l = this.mesh.getVertices();
        l[f++] = i, l[f++] = r, l[f++] = a.r, l[f++] = a.g, l[f++] = a.b, l[f++] = a.a, this.vertexIndex = f;
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
    e.ShapeRenderer = v;
    var n;
    (function(t) {
      t[t.Point = 0] = "Point", t[t.Line = 1] = "Line", t[t.Filled = 4] = "Filled";
    })(n = e.ShapeType || (e.ShapeType = {}));
  })(o.webgl || (o.webgl = {}));
})(F || (F = {}));
var F;
(function(o) {
  (function(e) {
    var v = (function() {
      function n(t) {
        this.boneLineColor = new o.Color(1, 0, 0, 1), this.boneOriginColor = new o.Color(0, 1, 0, 1), this.attachmentLineColor = new o.Color(0, 0, 1, 0.5), this.triangleLineColor = new o.Color(1, 0.64, 0, 0.5), this.pathColor = new o.Color().setFromString("FF7F00"), this.clipColor = new o.Color(0.8, 0, 0, 2), this.aabbColor = new o.Color(0, 1, 0, 0.5), this.drawBones = !0, this.drawRegionAttachments = !0, this.drawBoundingBoxes = !0, this.drawMeshHull = !0, this.drawMeshTriangles = !0, this.drawPaths = !0, this.drawSkeletonXY = !1, this.drawClipping = !0, this.premultipliedAlpha = !1, this.scale = 1, this.boneWidth = 2, this.bounds = new o.SkeletonBounds(), this.temp = new Array(), this.vertices = o.Utils.newFloatArray(2048), this.context = t instanceof e.ManagedWebGLRenderingContext ? t : new e.ManagedWebGLRenderingContext(t);
      }
      return n.prototype.draw = function(t, i, r) {
        r === void 0 && (r = null);
        var a = i.x, f = i.y, l = this.context.gl, p = this.premultipliedAlpha ? l.ONE : l.SRC_ALPHA;
        t.setBlendMode(p, l.ONE_MINUS_SRC_ALPHA);
        var u = i.bones;
        if (this.drawBones) {
          t.setColor(this.boneLineColor);
          for (var s = 0, h = u.length; s < h; s++) {
            var d = u[s];
            if (!(r && r.indexOf(d.data.name) > -1) && d.parent != null) {
              var c = a + d.data.length * d.a + d.worldX, M = f + d.data.length * d.c + d.worldY;
              t.rectLine(!0, a + d.worldX, f + d.worldY, c, M, this.boneWidth * this.scale);
            }
          }
          this.drawSkeletonXY && t.x(a, f, 4 * this.scale);
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
                  for (var P = 0, I = m.length; P < I; P += 3) {
                    var O = m[P] * 2, R = m[P + 1] * 2, D = m[P + 2] * 2;
                    t.triangle(!1, A[O], A[O + 1], A[R], A[R + 1], A[D], A[D + 1]);
                  }
                }
                if (this.drawMeshHull && x > 0) {
                  t.setColor(this.attachmentLineColor), x = (x >> 1) * 2;
                  for (var N = A[x - 2], k = A[x - 1], P = 0, I = x; P < I; P += 2) {
                    var c = A[P], M = A[P + 1];
                    t.line(c, M, N, k), N = c, k = M;
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
                var G = L, I = G.worldVerticesLength, Y = this.temp = o.Utils.setArraySize(this.temp, I, 0);
                G.computeWorldVertices(S, 0, I, Y, 0, 2);
                var X = this.pathColor, _ = Y[2], W = Y[3], U = 0, w = 0;
                if (G.closed) {
                  t.setColor(X);
                  var Z = Y[0], z = Y[1], j = Y[I - 2], H = Y[I - 1];
                  U = Y[I - 4], w = Y[I - 3], t.curve(_, W, Z, z, j, H, U, w, 32), t.setColor(n.LIGHT_GRAY), t.line(_, W, Z, z), t.line(U, w, j, H);
                }
                I -= 4;
                for (var P = 4; P < I; P += 6) {
                  var Z = Y[P], z = Y[P + 1], j = Y[P + 2], H = Y[P + 3];
                  U = Y[P + 4], w = Y[P + 5], t.setColor(X), t.curve(_, W, Z, z, j, H, U, w, 32), t.setColor(n.LIGHT_GRAY), t.line(_, W, Z, z), t.line(U, w, j, H), _ = U, W = w;
                }
              }
            }
          }
        if (this.drawBones) {
          t.setColor(this.boneOriginColor);
          for (var s = 0, h = u.length; s < h; s++) {
            var d = u[s];
            r && r.indexOf(d.data.name) > -1 || t.circle(!0, a + d.worldX, f + d.worldY, 3 * this.scale, n.GREEN, 8);
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
                var J = L, I = J.worldVerticesLength, Y = this.temp = o.Utils.setArraySize(this.temp, I, 0);
                J.computeWorldVertices(S, 0, I, Y, 0, 2);
                for (var tt = 0, q = Y.length; tt < q; tt += 2) {
                  var c = Y[tt], M = Y[tt + 1], U = Y[(tt + 2) % Y.length], w = Y[(tt + 3) % Y.length];
                  t.line(c, M, U, w);
                }
              }
            }
          }
        }
      }, n.prototype.dispose = function() {
      }, n.LIGHT_GRAY = new o.Color(0.7529411764705882, 0.7529411764705882, 0.7529411764705882, 1), n.GREEN = new o.Color(0, 1, 0, 1), n;
    })();
    e.SkeletonDebugRenderer = v;
  })(o.webgl || (o.webgl = {}));
})(F || (F = {}));
var F;
(function(o) {
  (function(e) {
    var v = /* @__PURE__ */ (function() {
      function t(i, r, a) {
        this.vertices = i, this.numVertices = r, this.numFloats = a;
      }
      return t;
    })(), n = (function() {
      function t(i, r) {
        r === void 0 && (r = !0), this.premultipliedAlpha = !1, this.vertexEffect = null, this.tempColor = new o.Color(), this.tempColor2 = new o.Color(), this.vertexSize = 8, this.twoColorTint = !1, this.renderable = new v(null, 0, 0), this.clipper = new o.SkeletonClipping(), this.temp = new o.Vector2(), this.temp2 = new o.Vector2(), this.temp3 = new o.Color(), this.temp4 = new o.Color(), this.twoColorTint = r, r && (this.vertexSize += 4), this.vertices = o.Utils.newFloatArray(this.vertexSize * 1024);
      }
      return t.prototype.draw = function(i, r, a, f) {
        a === void 0 && (a = -1), f === void 0 && (f = -1);
        var l = this.clipper, p = this.premultipliedAlpha, u = this.twoColorTint, s = null, h = this.temp, d = this.temp2, c = this.temp3, M = this.temp4, C = this.renderable, S = null, L = null, E = r.drawOrder, A = null, g = r.color, m = u ? 12 : 8, x = !1;
        a == -1 && (x = !0);
        for (var P = 0, I = E.length; P < I; P++) {
          var O = l.isClipping() ? 2 : m, R = E[P];
          if (!R.bone.active) {
            l.clipEndWithSlot(R);
            continue;
          }
          if (a >= 0 && a == R.data.index && (x = !0), !x) {
            l.clipEndWithSlot(R);
            continue;
          }
          f >= 0 && f == R.data.index && (x = !1);
          var D = R.getAttachment(), N = null;
          if (D instanceof o.RegionAttachment) {
            var k = D;
            C.vertices = this.vertices, C.numVertices = 4, C.numFloats = O << 2, k.computeWorldVertices(R.bone, C.vertices, 0, O), L = t.QUAD_TRIANGLES, S = k.uvs, N = k.region.renderObject.texture, A = k.color;
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
            V.r = g.r * B.r * A.r, V.g = g.g * B.g * A.g, V.b = g.b * B.b * A.b, V.a = g.a * B.a * A.a, p && (V.r *= V.a, V.g *= V.a, V.b *= V.a);
            var G = this.tempColor2;
            R.darkColor == null ? G.set(0, 0, 0, 1) : (p ? (G.r = R.darkColor.r * V.a, G.g = R.darkColor.g * V.a, G.b = R.darkColor.b * V.a) : G.setFromColor(R.darkColor), G.a = p ? 1 : 0);
            var Y = R.data.blendMode;
            if (Y != s && (s = Y, i.setBlendMode(e.WebGLBlendModeConverter.getSourceGLBlendMode(s, p), e.WebGLBlendModeConverter.getDestGLBlendMode(s))), l.isClipping()) {
              l.clipTriangles(C.vertices, C.numFloats, L, L.length, S, V, G, u);
              var X = new Float32Array(l.clippedVertices), _ = l.clippedTriangles;
              if (this.vertexEffect != null) {
                var W = this.vertexEffect, U = X;
                if (u)
                  for (var w = 0, z = X.length; w < z; w += m)
                    h.x = U[w], h.y = U[w + 1], c.set(U[w + 2], U[w + 3], U[w + 4], U[w + 5]), d.x = U[w + 6], d.y = U[w + 7], M.set(U[w + 8], U[w + 9], U[w + 10], U[w + 11]), W.transform(h, d, c, M), U[w] = h.x, U[w + 1] = h.y, U[w + 2] = c.r, U[w + 3] = c.g, U[w + 4] = c.b, U[w + 5] = c.a, U[w + 6] = d.x, U[w + 7] = d.y, U[w + 8] = M.r, U[w + 9] = M.g, U[w + 10] = M.b, U[w + 11] = M.a;
                else
                  for (var w = 0, Z = X.length; w < Z; w += m)
                    h.x = U[w], h.y = U[w + 1], c.set(U[w + 2], U[w + 3], U[w + 4], U[w + 5]), d.x = U[w + 6], d.y = U[w + 7], M.set(0, 0, 0, 0), W.transform(h, d, c, M), U[w] = h.x, U[w + 1] = h.y, U[w + 2] = c.r, U[w + 3] = c.g, U[w + 4] = c.b, U[w + 5] = c.a, U[w + 6] = d.x, U[w + 7] = d.y;
              }
              i.draw(N, X, _);
            } else {
              var U = C.vertices;
              if (this.vertexEffect != null) {
                var W = this.vertexEffect;
                if (u)
                  for (var w = 0, j = 0, J = C.numFloats; w < J; w += m, j += 2)
                    h.x = U[w], h.y = U[w + 1], d.x = S[j], d.y = S[j + 1], c.setFromColor(V), M.setFromColor(G), W.transform(h, d, c, M), U[w] = h.x, U[w + 1] = h.y, U[w + 2] = c.r, U[w + 3] = c.g, U[w + 4] = c.b, U[w + 5] = c.a, U[w + 6] = d.x, U[w + 7] = d.y, U[w + 8] = M.r, U[w + 9] = M.g, U[w + 10] = M.b, U[w + 11] = M.a;
                else
                  for (var w = 0, j = 0, H = C.numFloats; w < H; w += m, j += 2)
                    h.x = U[w], h.y = U[w + 1], d.x = S[j], d.y = S[j + 1], c.setFromColor(V), M.set(0, 0, 0, 0), W.transform(h, d, c, M), U[w] = h.x, U[w + 1] = h.y, U[w + 2] = c.r, U[w + 3] = c.g, U[w + 4] = c.b, U[w + 5] = c.a, U[w + 6] = d.x, U[w + 7] = d.y;
              } else if (u)
                for (var w = 2, j = 0, q = C.numFloats; w < q; w += m, j += 2)
                  U[w] = V.r, U[w + 1] = V.g, U[w + 2] = V.b, U[w + 3] = V.a, U[w + 4] = S[j], U[w + 5] = S[j + 1], U[w + 6] = G.r, U[w + 7] = G.g, U[w + 8] = G.b, U[w + 9] = G.a;
              else
                for (var w = 2, j = 0, tt = C.numFloats; w < tt; w += m, j += 2)
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
    e.SkeletonRenderer = n;
  })(o.webgl || (o.webgl = {}));
})(F || (F = {}));
var F;
(function(o) {
  (function(e) {
    var v = (function() {
      function n(t, i, r) {
        t === void 0 && (t = 0), i === void 0 && (i = 0), r === void 0 && (r = 0), this.x = 0, this.y = 0, this.z = 0, this.x = t, this.y = i, this.z = r;
      }
      return n.prototype.setFrom = function(t) {
        return this.x = t.x, this.y = t.y, this.z = t.z, this;
      }, n.prototype.set = function(t, i, r) {
        return this.x = t, this.y = i, this.z = r, this;
      }, n.prototype.add = function(t) {
        return this.x += t.x, this.y += t.y, this.z += t.z, this;
      }, n.prototype.sub = function(t) {
        return this.x -= t.x, this.y -= t.y, this.z -= t.z, this;
      }, n.prototype.scale = function(t) {
        return this.x *= t, this.y *= t, this.z *= t, this;
      }, n.prototype.normalize = function() {
        var t = this.length();
        return t == 0 ? this : (t = 1 / t, this.x *= t, this.y *= t, this.z *= t, this);
      }, n.prototype.cross = function(t) {
        return this.set(this.y * t.z - this.z * t.y, this.z * t.x - this.x * t.z, this.x * t.y - this.y * t.x);
      }, n.prototype.multiply = function(t) {
        var i = t.values;
        return this.set(this.x * i[e.M00] + this.y * i[e.M01] + this.z * i[e.M02] + i[e.M03], this.x * i[e.M10] + this.y * i[e.M11] + this.z * i[e.M12] + i[e.M13], this.x * i[e.M20] + this.y * i[e.M21] + this.z * i[e.M22] + i[e.M23]);
      }, n.prototype.project = function(t) {
        var i = t.values, r = 1 / (this.x * i[e.M30] + this.y * i[e.M31] + this.z * i[e.M32] + i[e.M33]);
        return this.set((this.x * i[e.M00] + this.y * i[e.M01] + this.z * i[e.M02] + i[e.M03]) * r, (this.x * i[e.M10] + this.y * i[e.M11] + this.z * i[e.M12] + i[e.M13]) * r, (this.x * i[e.M20] + this.y * i[e.M21] + this.z * i[e.M22] + i[e.M23]) * r);
      }, n.prototype.dot = function(t) {
        return this.x * t.x + this.y * t.y + this.z * t.z;
      }, n.prototype.length = function() {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
      }, n.prototype.distance = function(t) {
        var i = t.x - this.x, r = t.y - this.y, a = t.z - this.z;
        return Math.sqrt(i * i + r * r + a * a);
      }, n;
    })();
    e.Vector3 = v;
  })(o.webgl || (o.webgl = {}));
})(F || (F = {}));
var F;
(function(o) {
  (function(e) {
    var v = (function() {
      function t(i, r) {
        r === void 0 && (r = { alpha: "true" }), this.restorables = new Array(), i instanceof WebGLRenderingContext || i instanceof WebGL2RenderingContext ? (this.gl = i, this.canvas = this.gl.canvas) : this.setupCanvas(i, r);
      }
      return t.prototype.setupCanvas = function(i, r) {
        var a = this;
        this.gl = i.getContext("webgl2", r) || i.getContext("webgl", r), this.canvas = i, i.addEventListener("webglcontextlost", function(f) {
          f && f.preventDefault();
        }), i.addEventListener("webglcontextrestored", function(f) {
          for (var l = 0, p = a.restorables.length; l < p; l++)
            a.restorables[l].restore();
        });
      }, t.prototype.addRestorable = function(i) {
        this.restorables.push(i);
      }, t.prototype.removeRestorable = function(i) {
        var r = this.restorables.indexOf(i);
        r > -1 && this.restorables.splice(r, 1);
      }, t;
    })();
    e.ManagedWebGLRenderingContext = v;
    var n = (function() {
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
    e.WebGLBlendModeConverter = n;
  })(o.webgl || (o.webgl = {}));
})(F || (F = {}));
var F;
(function(o) {
  var e = (function() {
    function u(s, h, d) {
      this.player = s, this.dom = f(`
				<div class="spine-player-popup spine-player-hidden">
				</div>
			`), this.dom.innerHTML = d, h.appendChild(this.dom);
    }
    return u.prototype.show = function(s) {
      var h = this;
      this.dom.classList.remove("spine-player-hidden");
      var d = !1, c = function() {
        d || requestAnimationFrame(c);
        var S = Math.abs(h.dom.getBoundingClientRect().bottom - h.player.getBoundingClientRect().bottom), L = Math.abs(h.dom.getBoundingClientRect().right - h.player.getBoundingClientRect().right), E = h.player.clientHeight - S - L;
        h.dom.style.maxHeight = E + "px";
      };
      requestAnimationFrame(c);
      var M = !0, C = function(S) {
        if (M) {
          M = !1;
          return;
        }
        i(h.dom, S.target) || (h.dom.remove(), window.removeEventListener("click", C), s(), d = !0);
      };
      window.addEventListener("click", C);
    }, u;
  })(), v = (function() {
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
  })(), n = (function() {
    function u(s, h, d) {
      s === void 0 && (s = 0), h === void 0 && (h = 0.1), d === void 0 && (d = !1), this.snaps = s, this.snapPercentage = h, this.big = d;
    }
    return u.prototype.render = function() {
      var s = this;
      this.slider = f(`
				<div class="spine-player-slider ` + (this.big ? "big" : "") + `">
					<div class="spine-player-slider-value"></div>
					<!--<div class="spine-player-slider-knob"></div>-->
				</div>
			`), this.value = a(this.slider, "spine-player-slider-value")[0], this.setValue(0);
      var h = new o.webgl.Input(this.slider), d = !1;
      return h.addListener({
        down: function(c, M) {
          d = !0, s.value.classList.add("hovering");
        },
        up: function(c, M) {
          d = !1;
          var C = c / s.slider.clientWidth;
          C = C = Math.max(0, Math.min(C, 1)), s.setValue(c / s.slider.clientWidth), s.change && s.change(C), s.value.classList.remove("hovering");
        },
        moved: function(c, M) {
          if (d) {
            var C = c / s.slider.clientWidth;
            C = Math.max(0, Math.min(C, 1)), C = s.setValue(c / s.slider.clientWidth), s.change && s.change(C);
          }
        },
        dragged: function(c, M) {
          var C = c / s.slider.clientWidth;
          C = Math.max(0, Math.min(C, 1)), C = s.setValue(c / s.slider.clientWidth), s.change && s.change(C);
        }
      }), this.slider;
    }, u.prototype.setValue = function(s) {
      if (s = Math.max(0, Math.min(1, s)), this.snaps > 0) {
        var h = s % (1 / this.snaps);
        h < 1 / this.snaps * this.snapPercentage ? s = s - h : h > 1 / this.snaps - 1 / this.snaps * this.snapPercentage && (s = s - h + 1 / this.snaps), s = Math.max(0, Math.min(1, s));
      }
      return this.value.style.width = "" + s * 100 + "%", s;
    }, u;
  })(), t = (function() {
    function u(s, h) {
      this.config = h, this.paused = !0, this.playTime = 0, this.speed = 1, this.time = new o.TimeKeeper(), this.animationViewports = {}, this.currentViewport = null, this.previousViewport = null, this.viewportTransitionStart = 0, this.stopRequestAnimationFrame = !1, this.cancelId = 0, typeof s == "string" ? this.parent = document.getElementById(s) : this.parent = s, this.parent.appendChild(this.render());
    }
    return u.prototype.validateConfig = function(s) {
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
        throw new Error("Default animation '" + s.animation + "' is not contained in the list of selectable animations " + p(JSON.stringify(this.config.animations)) + ".");
      if (s.skins && s.skin && s.skins.indexOf(s.skin) < 0)
        throw new Error("Default skin '" + s.skin + "' is not contained in the list of selectable skins " + p(JSON.stringify(this.config.skins)) + ".");
      return s.controlBones || (s.controlBones = []), typeof s.showControls > "u" && (s.showControls = !0), typeof s.defaultMix > "u" && (s.defaultMix = 0.25), s;
    }, u.prototype.showError = function(s) {
      var h = a(this.dom, "spine-player-error")[0];
      h.classList.remove("spine-player-hidden"), h.innerHTML = '<p style="text-align: center; align-self: center;">' + s + "</p>", this.config.error(this, s);
    }, u.prototype.render = function() {
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
        this.canvas = a(d, "spine-player-canvas")[0];
        var c = { alpha: h.alpha };
        this.context = new o.webgl.ManagedWebGLRenderingContext(this.canvas, c), this.sceneRenderer = new o.webgl.SceneRenderer(this.canvas, this.context, !0), this.loadingScreen = new o.webgl.LoadingScreen(this.sceneRenderer);
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
      }), this.playerControls = a(d, "spine-player-controls")[0];
      var S = a(d, "spine-player-timeline")[0];
      this.timelineSlider = new n(), S.appendChild(this.timelineSlider.render()), this.playButton = r(d, "spine-player-button-play-pause")[0];
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
      var m = this.canvas.clientWidth, x = this.canvas.clientHeight, P = this.canvas.style.width, I = this.canvas.style.height, O = !1;
      return A.onclick = function() {
        var R = function() {
          O = !O, O || (s.canvas.style.width = "" + m + "px", s.canvas.style.height = "" + x + "px", s.drawFrame(!1), requestAnimationFrame(function() {
            s.canvas.style.width = P, s.canvas.style.height = I;
          }));
        }, D = document;
        if (d.onfullscreenchange = R, d.onwebkitfullscreenchange = R, D.fullscreenElement || D.webkitFullscreenElement || D.mozFullScreenElement || D.msFullscreenElement)
          D.exitFullscreen ? D.exitFullscreen() : D.mozCancelFullScreen ? D.mozCancelFullScreen() : D.webkitExitFullscreen ? D.webkitExitFullscreen() : D.msExitFullscreen && D.msExitFullscreen();
        else {
          m = s.canvas.clientWidth, x = s.canvas.clientHeight, P = s.canvas.style.width, I = s.canvas.style.height;
          var N = d;
          N.requestFullscreen ? N.requestFullscreen() : N.webkitRequestFullScreen ? N.webkitRequestFullScreen() : N.mozRequestFullScreen ? N.mozRequestFullScreen() : N.msRequestFullscreen && N.msRequestFullscreen();
        }
      }, g.onclick = function() {
        window.open("http://esotericsoftware.com");
      }, window.onresize = function() {
        s.drawFrame(!1);
      }, d;
    }, u.prototype.showSpeedDialog = function(s) {
      var h = this;
      if (this.lastPopup && this.lastPopup.dom.remove(), this.lastPopup && a(this.lastPopup.dom, "spine-player-popup-title")[0].textContent == "Speed") {
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
			`), c = a(d.dom, "spine-player-speed-slider")[0], M = new n(2, 0.1, !0);
      c.appendChild(M.render()), M.setValue(this.speed / 2), M.change = function(C) {
        h.speed = C * 2;
      }, s.classList.add("spine-player-button-icon-speed-selected"), d.show(function() {
        s.classList.remove("spine-player-button-icon-speed-selected"), d.dom.remove(), h.lastPopup = null;
      }), this.lastPopup = d;
    }, u.prototype.showAnimationsDialog = function(s) {
      var h = this;
      if (this.lastPopup && this.lastPopup.dom.remove(), this.lastPopup && a(this.lastPopup.dom, "spine-player-popup-title")[0].textContent == "Animations") {
        this.lastPopup = null, s.classList.remove("spine-player-button-icon-animations-selected");
        return;
      }
      if (!(!this.skeleton || this.skeleton.data.animations.length == 0)) {
        var d = new e(this.dom, this.playerControls, `
				<div class="spine-player-popup-title">Animations</div>
				<hr>
				<ul class="spine-player-list"></ul>
			`), c = a(d.dom, "spine-player-list")[0];
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
            M.name == h.config.animation && C.classList.add("selected"), a(C, "selectable-text")[0].innerText = M.name, c.appendChild(C), C.onclick = function() {
              l(c.children, "selected"), C.classList.add("selected"), h.config.animation = M.name, h.playTime = 0, h.setAnimation(M.name);
            };
          }
        }), s.classList.add("spine-player-button-icon-animations-selected"), d.show(function() {
          s.classList.remove("spine-player-button-icon-animations-selected"), d.dom.remove(), h.lastPopup = null;
        }), this.lastPopup = d;
      }
    }, u.prototype.showSkinsDialog = function(s) {
      var h = this;
      if (this.lastPopup && this.lastPopup.dom.remove(), this.lastPopup && a(this.lastPopup.dom, "spine-player-popup-title")[0].textContent == "Skins") {
        this.lastPopup = null, s.classList.remove("spine-player-button-icon-skins-selected");
        return;
      }
      if (!(!this.skeleton || this.skeleton.data.animations.length == 0)) {
        var d = new e(this.dom, this.playerControls, `
				<div class="spine-player-popup-title">Skins</div>
				<hr>
				<ul class="spine-player-list"></ul>
			`), c = a(d.dom, "spine-player-list")[0];
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
            M.name == h.config.skin && C.classList.add("selected"), a(C, "selectable-text")[0].innerText = M.name, c.appendChild(C), C.onclick = function() {
              l(c.children, "selected"), C.classList.add("selected"), h.config.skin = M.name, h.skeleton.setSkinByName(h.config.skin), h.skeleton.setSlotsToSetupPose();
            };
          }
        }), s.classList.add("spine-player-button-icon-skins-selected"), d.show(function() {
          s.classList.remove("spine-player-button-icon-skins-selected"), d.dom.remove(), h.lastPopup = null;
        }), this.lastPopup = d;
      }
    }, u.prototype.showSettingsDialog = function(s) {
      var h = this;
      if (this.lastPopup && this.lastPopup.dom.remove(), this.lastPopup && a(this.lastPopup.dom, "spine-player-popup-title")[0].textContent == "Debug") {
        this.lastPopup = null, s.classList.remove("spine-player-button-icon-settings-selected");
        return;
      }
      if (!(!this.skeleton || this.skeleton.data.animations.length == 0)) {
        var d = new e(this.dom, this.playerControls, `
				<div class="spine-player-popup-title">Debug</div>
				<hr>
				<ul class="spine-player-list">
				</li>
			`), c = a(d.dom, "spine-player-list")[0], M = function(C, S) {
          var L = f('<li class="spine-player-list-item"></li>'), E = new v(C);
          L.appendChild(E.render()), E.setEnabled(h.config.debug[S]), E.change = function(A) {
            h.config.debug[S] = A;
          }, c.appendChild(L);
        };
        M("Bones", "bones"), M("Regions", "regions"), M("Meshes", "meshes"), M("Bounds", "bounds"), M("Paths", "paths"), M("Clipping", "clipping"), M("Points", "points"), M("Hulls", "hulls"), s.classList.add("spine-player-button-icon-settings-selected"), d.show(function() {
          s.classList.remove("spine-player-button-icon-settings-selected"), d.dom.remove(), h.lastPopup = null;
        }), this.lastPopup = d;
      }
    }, u.prototype.drawFrame = function(s) {
      var h = this;
      if (!h.disposed) {
        s === void 0 && (s = !0), s && !this.stopRequestAnimationFrame && requestAnimationFrame(function() {
          return h.drawFrame();
        });
        var d = this.context, c = d.gl, M = document, C = M.fullscreenElement || M.webkitFullscreenElement || M.mozFullScreenElement || M.msFullscreenElement, S = new o.Color().setFromString(C ? this.config.fullScreenBackgroundColor : this.config.backgroundColor);
        if (c.clearColor(S.r, S.g, S.b, S.a), c.clear(c.COLOR_BUFFER_BIT), this.loadingScreen.backgroundColor.setFromColor(S), this.loadingScreen.draw(this.assetManager.isLoadingComplete()), this.assetManager.isLoadingComplete() && this.skeleton == null && this.loadSkeleton(), this.sceneRenderer.resize(o.webgl.ResizeMode.Expand), this.loaded) {
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
          var I = this.config.controlBones, O = this.selectedBones, R = this.skeleton;
          c.lineWidth(2);
          for (var D = 0; D < I.length; D++) {
            var N = R.findBone(I[D]);
            if (N) {
              var k = O[D] !== null ? u.HOVER_COLOR_INNER : u.NON_HOVER_COLOR_INNER, y = O[D] !== null ? u.HOVER_COLOR_OUTER : u.NON_HOVER_COLOR_OUTER;
              this.sceneRenderer.circle(!0, R.x + N.worldX, R.y + N.worldY, 20, k), this.sceneRenderer.circle(!1, R.x + N.worldX, R.y + N.worldY, 20, y);
            }
          }
          c.lineWidth(1), this.config.viewport.debugRender && (this.sceneRenderer.rect(!1, this.currentViewport.x, this.currentViewport.y, this.currentViewport.width, this.currentViewport.height, o.Color.GREEN), this.sceneRenderer.rect(!1, A.x, A.y, A.width, A.height, o.Color.RED)), this.sceneRenderer.end(), this.sceneRenderer.camera.zoom = 0;
        }
      }
    }, u.prototype.scale = function(s, h, d, c) {
      var M = c / d, C = h / s, S = M > C ? d / s : c / h, L = new o.Vector2();
      return L.x = s * S, L.y = h * S, L;
    }, u.prototype.loadSkeleton = function() {
      var s = this;
      if (!this.loaded) {
        if (this.assetManager.hasErrors()) {
          this.showError("Error: assets could not be loaded.<br><br>" + p(JSON.stringify(this.assetManager.getErrors())));
          return;
        }
        var h = this.assetManager.get(this.config.atlasUrl), d;
        if (this.config.jsonUrl) {
          var c = this.assetManager.get(this.config.jsonUrl), M = new o.SkeletonJson(new o.AtlasAttachmentLoader(h));
          try {
            d = M.readSkeletonData(c);
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
    }, u.prototype.setupInput = function() {
      var s = this, h = this.config.controlBones, d = this.selectedBones = new Array(this.config.controlBones.length), c = this.canvas, M = new o.webgl.Input(c), C = null, S = new o.webgl.Vector3(), L = new o.webgl.Vector3(), E = new o.Vector2(), A = this.skeleton, g = this.sceneRenderer;
      M.addListener({
        down: function(O, R) {
          for (var D = 0; D < h.length; D++) {
            var N = A.findBone(h[D]);
            N && (g.camera.screenToWorld(S.set(O, R, 0), c.width, c.height), L.set(A.x + N.worldX, A.y + N.worldY, 0).distance(S) < 30 && (C = N));
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
          C != null && (g.camera.screenToWorld(S.set(O, R, 0), c.width, c.height), C.parent !== null ? (C.parent.worldToLocal(E.set(S.x - A.x, S.y - A.y)), C.x = E.x, C.y = E.y) : (C.x = S.x - A.x, C.y = S.y - A.y));
        },
        moved: function(O, R) {
          for (var D = 0; D < h.length; D++) {
            var N = A.findBone(h[D]);
            N && (g.camera.screenToWorld(S.set(O, R, 0), c.width, c.height), L.set(A.x + N.worldX, A.y + N.worldY, 0).distance(S) < 30 ? d[D] = N : d[D] = null);
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
          var D = a(s.dom, "spine-player-popup");
          m = I(O, R, s.playerControls.getBoundingClientRect()), x = I(O, R, s.canvas.getBoundingClientRect()), clearTimeout(s.cancelId);
          var N = D.length == 0 && !m && !x && !s.paused;
          if (N ? s.playerControls.classList.add("spine-player-controls-hidden") : s.playerControls.classList.remove("spine-player-controls-hidden"), !m && D.length == 0 && !s.paused) {
            var k = function() {
              s.paused || s.playerControls.classList.add("spine-player-controls-hidden");
            };
            s.cancelId = setTimeout(k, 1e3);
          }
        }
      }, I = function(O, R, D) {
        var N = O - D.left, k = R - D.top;
        return N >= 0 && N <= D.width && k >= 0 && k <= D.height;
      };
    }, u.prototype.play = function() {
      var s = this;
      this.paused = !1;
      var h = function() {
        s.paused || s.playerControls.classList.add("spine-player-controls-hidden");
      };
      this.cancelId = setTimeout(h, 1e3), this.playButton.classList.remove("spine-player-button-icon-play"), this.playButton.classList.add("spine-player-button-icon-pause"), this.config.animation && (this.animationState.getCurrent(0) || this.setAnimation(this.config.animation));
    }, u.prototype.pause = function() {
      this.paused = !0, this.playerControls.classList.remove("spine-player-controls-hidden"), clearTimeout(this.cancelId), this.playButton.classList.remove("spine-player-button-icon-pause"), this.playButton.classList.add("spine-player-button-icon-play");
    }, u.prototype.setAnimation = function(s, h) {
      h === void 0 && (h = !0), this.previousViewport = this.currentViewport;
      var d = this.calculateAnimationViewport(s), c = {
        x: d.x,
        y: d.y,
        width: d.width,
        height: d.height,
        padLeft: "10%",
        padRight: "10%",
        padTop: "10%",
        padBottom: "10%"
      }, M = this.config.viewport;
      typeof M.x < "u" && typeof M.y < "u" && typeof M.width < "u" && typeof M.height < "u" && (c.x = M.x, c.y = M.y, c.width = M.width, c.height = M.height), typeof M.padLeft < "u" && (c.padLeft = M.padLeft), typeof M.padRight < "u" && (c.padRight = M.padRight), typeof M.padTop < "u" && (c.padTop = M.padTop), typeof M.padBottom < "u" && (c.padBottom = M.padBottom);
      var C = this.config.viewport.animations[s];
      C && (typeof C.x < "u" && typeof C.y < "u" && typeof C.width < "u" && typeof C.height < "u" && (c.x = C.x, c.y = C.y, c.width = C.width, c.height = C.height), typeof C.padLeft < "u" && (c.padLeft = C.padLeft), typeof C.padRight < "u" && (c.padRight = C.padRight), typeof C.padTop < "u" && (c.padTop = C.padTop), typeof C.padBottom < "u" && (c.padBottom = C.padBottom)), c.padLeft = this.percentageToWorldUnit(c.width, c.padLeft), c.padRight = this.percentageToWorldUnit(c.width, c.padRight), c.padBottom = this.percentageToWorldUnit(c.height, c.padBottom), c.padTop = this.percentageToWorldUnit(c.height, c.padTop), this.currentViewport = c, this.viewportTransitionStart = performance.now(), this.animationState.clearTracks(), this.skeleton.setToSetupPose(), this.animationState.setAnimation(0, s, h);
    }, u.prototype.percentageToWorldUnit = function(s, h) {
      return typeof h == "string" ? s * parseFloat(h.substr(0, h.length - 1)) / 100 : h;
    }, u.prototype.calculateAnimationViewport = function(s) {
      var h = this.skeleton.data.findAnimation(s);
      this.animationState.clearTracks(), this.skeleton.setToSetupPose(), this.animationState.setAnimationWith(0, h, !0);
      for (var d = 100, c = h.duration > 0 ? h.duration / d : 0, M = 1e8, C = -1e8, S = 1e8, L = -1e8, E = new o.Vector2(), A = new o.Vector2(), g = 0; g < d; g++)
        this.animationState.update(c), this.animationState.apply(this.skeleton), this.skeleton.updateWorldTransform(), this.skeleton.getBounds(E, A), !isNaN(E.x) && !isNaN(E.y) && !isNaN(A.x) && !isNaN(A.y) ? (M = Math.min(E.x, M), C = Math.max(E.x + A.x, C), S = Math.min(E.y, S), L = Math.max(E.y + A.y, L)) : console.log("Bounds of animation " + s + " are NaN");
      return E.x = M, E.y = S, A.x = C - M, A.y = L - S, {
        x: E.x,
        y: E.y,
        width: A.x,
        height: A.y
      };
    }, u.prototype.stopRendering = function() {
      this.stopRequestAnimationFrame = !0;
    }, u.HOVER_COLOR_INNER = new o.Color(0.478, 0, 0, 0.25), u.HOVER_COLOR_OUTER = new o.Color(1, 1, 1, 1), u.NON_HOVER_COLOR_INNER = new o.Color(0.478, 0, 0, 0.5), u.NON_HOVER_COLOR_OUTER = new o.Color(1, 0, 0, 0.8), u;
  })();
  o.SpinePlayer = t;
  function i(u, s) {
    if (u === s)
      return !0;
    var h = function(d, c) {
      for (var M = 0; M < d.children.length; M++) {
        var C = d.children[M];
        if (C === c || h(C, c))
          return !0;
      }
      return !1;
    };
    return h(u, s);
  }
  function r(u, s) {
    var h = new Array(), d = function(c, M, C) {
      for (var S = 0; S < c.children.length; S++) {
        var L = c.children[S];
        L.id === M && C.push(L), d(L, M, C);
      }
    };
    return d(u, s, h), h;
  }
  function a(u, s) {
    var h = new Array(), d = function(c, M, C) {
      for (var S = 0; S < c.children.length; S++) {
        var L = c.children[S];
        L.classList.contains(M) && C.push(L), d(L, M, C);
      }
    };
    return d(u, s, h), h;
  }
  function f(u) {
    var s = document.createElement("div");
    return s.innerHTML = u, s.children[0];
  }
  function l(u, s) {
    for (var h = 0; h < u.length; h++)
      u[h].classList.remove(s);
  }
  function p(u) {
    return u ? u.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&#34;").replace(/'/g, "&#39;") : "";
  }
})(F || (F = {}));
var F;
(function(o) {
  var e = (function() {
    function v(n) {
      this.prefix = `<html>
<head>
<style>
body {
	margin: 0px;
}
</style>
</head>
<body>`.trim(), this.postfix = "</body>", this.timerId = 0, this.render(n);
    }
    return v.prototype.render = function(n) {
      var t = this, i = `
				<div class="spine-player-editor-container">
					<div class="spine-player-editor-code"></div>
					<iframe class="spine-player-editor-player"></iframe>
				</div>
			`;
      n.innerHTML = i;
      var r = n.getElementsByClassName("spine-player-editor-code")[0];
      this.player = n.getElementsByClassName("spine-player-editor-player")[0], requestAnimationFrame(function() {
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
        }), t.setCode(v.DEFAULT_CODE);
      });
    }, v.prototype.setPreAndPostfix = function(n, t) {
      this.prefix = n, this.postfix = t, this.startPlayer();
    }, v.prototype.setCode = function(n) {
      this.code.setValue(n), this.startPlayer();
    }, v.prototype.startPlayer = function() {
      var n = this;
      clearTimeout(this.timerId), this.timerId = setTimeout(function() {
        var t = n.code.getDoc().getValue();
        t = n.prefix + t + n.postfix, t = window.btoa(t), n.player.src = "", n.player.src = "data:text/html;base64," + t;
      }, 500);
    }, v.DEFAULT_CODE = `
<script src="https://esotericsoftware.com/files/spine-player/3.7/spine-player.js"><\/script>
<link rel="stylesheet" href="https://esotericsoftware.com/files/spine-player/3.7/spine-player.css">

<div id="player-container" style="width: 100%; height: 100vh;"></div>

<script>
new spine.SpinePlayer("player-container", {
	jsonUrl: "https://esotericsoftware.com/files/examples/spineboy/export/spineboy-pro.json",
	atlasUrl: "https://esotericsoftware.com/files/examples/spineboy/export/spineboy-pma.atlas"
});
<\/script>
		`.trim(), v;
  })();
  o.SpinePlayerEditor = e;
})(F || (F = {}));
const Nt = F, Qt = "__whichWayUnpackPremultiply";
function be() {
  const o = Nt?.webgl?.GLTexture;
  if (!o || !o.prototype || o.prototype.update.__whichWayUnpackPatched) return;
  const e = o.prototype.update;
  o.prototype.update = function(v) {
    const n = this.context && this.context.gl;
    let t = !1;
    const i = this._image;
    n && n.UNPACK_PREMULTIPLY_ALPHA_WEBGL != null && i && i[Qt] && (n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL, !0), t = !0);
    try {
      return e.call(this, v);
    } finally {
      t && n && n.UNPACK_PREMULTIPLY_ALPHA_WEBGL != null && n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL, !1);
    }
  }, o.prototype.update.__whichWayUnpackPatched = !0;
}
be();
function Me(o) {
  if (!o || !o.assetManager) return;
  const e = !!o.config?.unpackPremultipliedAlpha, v = o.assetManager, n = v.textureLoader;
  typeof n == "function" && (n.__whichWayUnpackWrapped || (v.textureLoader = function(t) {
    try {
      t && (e ? t[Qt] = !0 : delete t[Qt]);
    } catch {
    }
    return n(t);
  }, v.textureLoader.__whichWayUnpackWrapped = !0));
}
function Ce(o, e) {
  if (!o) return e?.parentElement ?? null;
  const v = o.node?.avatar ?? o.querySelector?.(".avatar");
  return v || (o.nodeType === 1 ? o : e?.parentElement ?? null);
}
const mt = window.whichWaySave.dycSave, Pt = "经典形象";
class Qe {
  backgroundPath = `${K.assetURL}extension/WhichWay/dynamicSkin/background/`;
  spineCache = /* @__PURE__ */ new Map();
  eventListenersMap = /* @__PURE__ */ new WeakMap();
  get banSkin() {
    return K.config.banSkinSJZX === void 0 && (K.config.banSkinSJZX = {}), K.config.banSkinSJZX;
  }
  /**
   * 切换动皮开启与关闭
   * @param {String | Player} name 玩家名
   * @param {String} skinName 皮肤名
   */
  toggleDycSkin(e, v) {
    if (pt.itemtype(e) === "player" && (e = e.name), typeof e != "string") throw new Error("参数name必须是 String 或 Player！");
    if (typeof v != "string") throw new Error("参数skinName必须是 String！");
    return b.banSkin?.[e]?.[v] ? b.banSkin[e][v] = !1 : (b.banSkin[e] || (b.banSkin[e] = {}), b.banSkin[e][v] = !0), gt.saveConfig("banSkinSJZX", b.banSkin), b.banSkin;
  }
  /**
   * 判断指定角色和皮肤的动态皮肤是否启用
   * @param {String | Player} name 玩家名
   * @param {String} skinName 皮肤名
   * @returns {boolean}
   */
  isEnabledSkin(e, v) {
    return pt.itemtype(e) === "player" && (e = e.name), !this.banSkin?.[e]?.[v];
  }
  /**
   * 获取指定角色和皮肤的动态皮肤数据
   * @param {string} charName - 角色名称
   * @param {string} skinName - 皮肤名称
   * @param {boolean} [noGetAll=false] - 当charName或skinName未定义时，是否返回所有资产数据
   * @returns {Object|undefined} 找到的皮肤数据对象，未找到时返回undefined
   */
  getSkinData(e, v, n) {
    let t = mt.assets;
    if (e === void 0 || v === void 0) return n ? t : void 0;
    for (let i in t)
      if (e === i) {
        for (let r in t[i])
          if (r === v)
            return t[i][r];
      }
    et.isDeveloperMode() && console.warn(`[WhichWaySpineWork]未找到角色 ${e} 的皮肤 ${v} !`);
  }
  getUrl(e, v, n, t) {
    const i = {
      j: "json",
      a: "atlas",
      s: "skel"
    };
    return t.length === 1 && i[t] && (t = i[t]), `${K.assetURL}extension/WhichWay/dynamicSkin/illust/${e}/${v}/${n}.${t}`;
  }
  dispose(e) {
    if (e.disposed) return;
    e.disposed = !0;
    let v = this.spineCache, n = v.get(e.config.dynamicName);
    if (Object.keys(n).length === 1) v.delete(e.config.dynamicName);
    else
      for (let i in n)
        n[i].from === e.container && delete n[i];
    window.removeEventListener("resize", e.drawFrame);
    const t = e.parent;
    if (e.stopRendering(), e.cancelId && clearTimeout(e.cancelId), e.animationState) {
      e.animationState.clearTracks(), e.animationState.clearListeners();
      let i = e.animationState.getCurrent(0);
      i && (e.animationState.disposeNext(i), e.animationState.setEmptyAnimation(0, 0)), e.animationState = null;
    }
    e.skeleton && (e.skeleton = null), e.skeletonData && (e.skeletonData = null), e.sceneRenderer && (e.sceneRenderer.dispose(), e.sceneRenderer = null), e.assetManager && e.assetManager.dispose(), e.context && e.context.gl && (e.context.gl.getExtension("WEBGL_lose_context")?.loseContext(), e.context = null), t?.__whichWayResizeObserver?.disconnect?.(), t && t.remove();
  }
  loadDyc(e, v, n, t) {
    let i = mt.assets, r = `${e}_${v}`;
    if (this.banSkin?.[e]?.[v] === !0) return;
    mt.startFit = {
      dycLoaded: !1,
      decadeUIFit: !1,
      parent: n,
      container: void 0
    };
    let a = new Proxy(mt.startFit, {
      set(l, p, u, s) {
        return l[p] = u, l.dycLoaded && l.decadeUIFit && (et.isDeveloperMode() && console.log("【驶舰之向】:已调整动态皮肤：", l.container), f(l.container, Ce(l.parent, l.container)), delete mt.startFit), !0;
      }
    });
    if (i[e] && i[e][v]) {
      let l = i[e][v], p, u, s = this.backgroundPath + l.background.split("/").pop();
      const h = Dt.create.div(".sjzxDycWrapper", n);
      h.id = "sjzxDycWrapper-animation", h.hide(), mt.startFit.container = h;
      const d = Dt.create.div(".bg", h);
      d.style.backgroundImage = `url("${s}")`, l.name && (l.json ? p = this.getUrl(e, v, l.name.split("/").pop(), "j") : p = this.getUrl(e, v, l.name.split("/").pop(), "s"), u = this.getUrl(e, v, l.name.split("/").pop(), "a")), t || (t = {
        dynamicName: r,
        skelUrl: p,
        //@ts-ignore
        jsonUrl: p.endsWith(".json") ? p : void 0,
        atlasUrl: u,
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
          width: n.clientWidth,
          height: n.clientHeight,
          padLeft: 0,
          padRight: 0,
          padTop: 0,
          padBottom: 0
        },
        originalOptions: l,
        container: n,
        error: function(E) {
          console.error(E);
        },
        success: function(E) {
          try {
            b.playRandomAnimation(E.skeleton, E.animationState, E.config.weighting, !1, E.config.animations);
          } catch (A) {
            console.error("[WhichWay] 播放动皮动画失败", A);
          }
          try {
            b.setSkeletonPosition(E, E.config.originalOptions);
          } catch (A) {
            console.error("[WhichWay] 动皮定位失败", A);
          }
          a.dycLoaded = !0, h.show();
        }
      });
      const c = new Nt.SpinePlayer(h, t);
      Me(c), h.__whichWaySpinePlayer = c;
      let M = b.spineCache;
      M.get(r) || M.set(r, {});
      let C = M.get(r);
      if (pt.itemtype(n) === "player")
        C[n.playerid] || (C[n.playerid] = {}), C[n.playerid].default = c, C[n.playerid].from = n, n.dycSJZX = c;
      else {
        let E = n.className;
        C[E] || (C[E] = {}), C[E].default = c, C[E].from = n;
      }
      const S = `removeAdded_${r}`;
      n.dataset[S] !== "true" && (n.dataset[S] = "true", n.onRemoved(() => {
        let E = pt.itemtype(n) === "player", A = C[E ? n.playerid : n.className];
        for (let g in A)
          pt.is.object(A[g]) && b.dispose(A[g]);
        delete C[E ? n.playerid : n.className];
      })), pt.itemtype(n) === "player" && (n.node.avatar.appendChild(h), n.node.avatar.style.overflow = "hidden", setTimeout(() => {
        a.decadeUIFit = !0;
      }, 1e3));
      const L = Ce(n, h);
      if (L && h.parentElement !== L && L.appendChild(h), h.__whichWayFitTarget = n, h.__whichWayFitHost = L, L && (f(h, L), [600, 1500].forEach((E) => {
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
      return c;
    } else console.error(`no skin data ${e} ${v}`);
    function f(l, p) {
      if (!l?.isConnected || !p?.isConnected) return;
      const u = p.clientWidth, s = p.clientHeight;
      if (!u || !s) return;
      const h = `${u}x${s}`;
      if (l.dataset.dycFitSize !== h) {
        l.dataset.dycFitSize = h, getComputedStyle(p).position === "static" && (p.style.position = "relative");
        const M = l.style.transition;
        l.style.transition = "none", l.style.width = `${u}px`, l.style.height = `${s}px`, l.style.zoom = "", l.style.left = "0", l.style.top = "0", l.offsetWidth, l.style.transition = M;
        const C = l.__whichWaySpinePlayer, S = C?.canvas;
        S?.style && (S.style.width = "100%", S.style.height = "100%"), C && b.enableSupersampling(C), C?.skeleton && b.setSkeletonPosition(C, C.config.originalOptions);
      }
      const d = l.getBoundingClientRect(), c = Math.abs(d.width - u) < 1 && Math.abs(d.height - s) < 1;
      if (et.isDeveloperMode()) {
        const M = l.__whichWaySpinePlayer?.canvas;
        console.log(
          `[whichWayDyc] fit host=${p.className || p.tagName} ${u}x${s} -> container ${Math.round(d.width)}x${Math.round(d.height)}` + (M ? `, buffer ${M.width}x${M.height}` : "") + (c ? "" : " (retry)")
        );
      }
      if (c)
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
   *
   * ⚠️ **必须在配置的动画列表里选**，不能拿 `skeleton.data.animations` 全量随机。
   * 全量随机会让配置文件里的 `action` 完全失效：
   * - `plot_keluxiermrfz` 配了 `action: ["Introduce"]`，但骨骼里还有 `Idle`，
   *   于是实际播的是 `Idle`（控制台 `current anim: Idle` 可以证实），配置形同虚设；
   * - 反过来，配置里写了骨骼中**不存在**的动画（旧版 `["Idle", "Special", "Interact"]`）时，
   *   全量随机反倒「碰巧能用」，掩盖了配置错误，只在 spine-player 的校验里留一条 error。
   *
   * 现在的规则：
   * - 传了 `actions`（配置的 `action` 列表）⇒ **只**在它里面选，且先按骨骼实际存在的动画过滤，
   *   防止配置写错时 `setAnimation` 拿到不存在的名字（那条路径不会抛错，只会静默不播）；
   * - 没传 `actions` ⇒ 退回全量动画（兼容旧调用）；
   * - `weighting` 与最终候选列表**逐项对齐**：长度不符就全部记 1，而不是把错位的权重套上去。
   *
   * @param {*} skeleton - Spine 骨骼实例
   * @param {*} animationState - AnimationState 实例
   * @param {number[]} weighting - 权重（与 `actions` 一一对应）
   * @param {boolean} [loop=false] - 是否循环播放
   * @param {string[]} [actions] - 允许播放的动画名（= 动皮配置里的 `action`）
   */
  playRandomAnimation(e, v, n, t = !1, i) {
    v.addListener({
      complete: () => {
        r(e, v, n, t, i);
      }
    }), r(e, v, n, t, i);
    function r(a, f, l, p = !1, u) {
      const s = a.data.animations.map((A) => A.name);
      let h = [], d = [];
      const c = Array.isArray(u) ? u : null, M = (A) => {
        const g = Number(A);
        return Number.isFinite(g) && g > 0 ? g : 1;
      };
      if (c && c.length > 0)
        for (let A = 0; A < c.length; A++) {
          const g = c[A];
          s.includes(g) && (h.push(g), d.push(M(Array.isArray(l) ? l[A] : 1)));
        }
      if (h.length === 0 && (h = s, d = Array.isArray(l) && l.length === h.length ? l.map(M) : h.map(() => 1)), h.length === 0) {
        f.setEmptyAnimation(0, 0);
        return;
      }
      let C;
      try {
        C = et.scaleToIntegerRatio(d);
      } catch {
        C = d.map(() => 1);
      }
      let S = [];
      for (let A = 0; A < h.length; A++) {
        let g = C[A], m = h[A];
        S.push(...new Array(g).fill(m));
      }
      const L = S.randomGet();
      h.length === 1 ? f.setAnimation(0, L, !0) : f.setAnimation(0, L, p);
      const E = f.getCurrent(0);
      (!E || !E.animation) && f.setEmptyAnimation(0, 0);
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
    const [v, n] = (e?.dataset?.dycFitSize || "").split("x").map(Number);
    return v > 0 && n > 0 ? [v, n] : [e?.clientWidth || 120, e?.clientHeight || 180];
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
    const v = e?.sceneRenderer;
    if (!v) return;
    if (v.__whichWaySupersampled) {
      v.resize(Nt.webgl?.ResizeMode?.Expand ?? 1);
      return;
    }
    v.__whichWaySupersampled = !0;
    const n = v.resize, t = v.begin;
    v.resize = function(i) {
      n.call(this, i);
      const r = this.canvas, a = r.clientWidth, f = r.clientHeight;
      if (!a || !f) return;
      const l = Math.min(4, Math.max(window.devicePixelRatio || 1, 360 / Math.min(a, f)));
      e.__whichWayDensity = l;
      const p = Math.round(a * l), u = Math.round(f * l);
      (r.width !== p || r.height !== u) && (r.width = p, r.height = u), this.context.gl.viewport(0, 0, r.width, r.height);
    }, v.begin = function() {
      const i = this.camera;
      i && (i.zoom *= e.__whichWayDensity || 1), t.call(this);
    }, v.resize(Nt.webgl?.ResizeMode?.Expand ?? 1);
  }
  setSkeletonPosition(e, v, n) {
    const t = e.dom.parentNode, [i, r] = b.getDycFitSize(t);
    let a = [i / 120, r / 180];
    n && (a = [1, 1]), e.skeleton.scaleX = v.scale * a[0], e.skeleton.scaleY = v.scale * a[1], e.skeleton.x = i * v.x[1] + v.x[0], e.skeleton.y = r * v.y[1] + v.y[0];
  }
  playAction(e, v, n = 3e3) {
    let t = e.parent.parentNode, i = e.config.dynamicName, r = t.playerid, a = b.spineCache;
    a.get(i)?.[r]?.[v]?.timer && clearTimeout(a.get(i)[r][v].timer), ["chuchang", "gongji", "teshu", "default"].includes(v) || console.warn(`${v}不是合法的动作！`);
    let l = e.config.originalOptions[v];
    if (!l) {
      console.warn(`${v}没有对应的动作配置！`), rt.showToast(`${v}没有对应的动作配置！`);
      return;
    }
    e.dom.style.display = "none";
    let p = e.config, u = e.dom.parentNode;
    u.style.zIndex = 100, a.get(i) || a.set(i, {});
    const s = a.get(i);
    if (s[r] || (s[r] = {}), s[r][v])
      s[r][v].parent.style.display = "";
    else {
      let h = Dt.create.div(".sjzxDycOutWrapper", u);
      h.classList.add(`${v}`);
      const d = h.getBoundingClientRect();
      h.style.display = "none";
      const c = new Nt.SpinePlayer(h, {
        skelUrl: p.skelUrl,
        jsonUrl: p.jsonUrl,
        atlasUrl: p.atlasUrl,
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
        unpackPremultipliedAlpha: !!(p.originalOptions && p.originalOptions.unpackPremultipliedAlpha),
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
      Me(c), b.enableSupersampling(c), s[r][v] = c;
    }
    n && (s[r][v].timer = setTimeout(() => {
      let h = s[r][v].parent;
      e.dom.style.display = "", h.style.display = "none", u.style.zIndex = "";
    }, n));
  }
  /**
   * 某个动皮是否**本身就是一个完整的皮肤**（而不是挂在另一个皮肤上的附加形态）。
   *
   * 动皮里有一类「同名的另一种形态」：`时遗2`、`于万千宇宙之中2`、`远行前的野餐`、`悠悠假日`…
   * 它们只是同一个皮肤的另一套动作数据，本身没有对应的静皮。把它们当成独立皮肤交给千幻，
   * 千幻就会按「静皮名 = 皮肤名」硬算路径，从而多出两个同名/空图的卡片（见 `getDynamicSkinEntries`）。
   *
   * 判据：与它**同一次选择**的那套静皮是否就在同一个皮肤目录里 ——
   * 名字完全一致，或者是「皮肤名 + 数字」（`时遗` → `时遗2`）。不靠写死的列表，新增干员自动适用。
   * @param {string} charName
   * @param {string} skinName
   * @returns {boolean}
   */
  isStandaloneDynamicSkin(e, v) {
    if (!v) return !1;
    const n = lt.getCharacterSkin(e) || {};
    if (n[v]) return !0;
    const t = v.replace(/\d+$/, "");
    return t !== v && t.length > 0 && n[t] !== void 0;
  }
  /**
   * 该皮肤对应的**静皮**文件名（带扩展名）。
   *
   * 静皮目录里的文件名不一定等于皮肤名（`夏卉 FA075.png`、`远行前的野餐.png`），
   * 而动皮数据用的是短名 ⇒ 必须查目录索引，不能拼 `{皮肤名}.png`。
   * 返回 undefined 表示「这个动皮没有对应的静皮文件」。
   * @param {string} charName
   * @param {string} skinName
   * @returns {string | undefined}
   */
  getStaticSkinFileName(e, v) {
    if (!e || !v) return;
    const n = lt.getCharacterSkin(e) || {};
    if (v === Pt) return Q.getCharacterPortraitFile(e);
    let t = v;
    if (n[t]) return Q.getSkinFileName(e, t);
    const i = Object.keys(n).filter((a) => a !== Pt && a.startsWith(t));
    if (i.length > 0)
      return i.sort((a, f) => a.length - f.length || (a < f ? -1 : a > f ? 1 : 0)), Q.getSkinFileName(e, i[0]);
    const r = t.replace(/(?:\s|_|\d).*$/, "");
    if (r && r !== t && n[r]) return Q.getSkinFileName(e, r);
  }
  /**
   * 上面那张「同名/前缀」静皮对应的**动皮数据里怎么称呼它**（返回动皮数据里的键）。
   *
   * 交给千幻的额外皮肤清单里必须带这个短名，而不是文件名（见 `getStaticSkinName`）。
   * @param {string} charName
   * @param {string} skinName 动皮名
   * @returns {string | undefined}
   */
  getStaticSkinKey(e, v) {
    if (!e || !v) return;
    const n = lt.getCharacterSkin(e) || {};
    if (v === Pt || n[v]) return v;
    const t = Object.keys(n).filter((r) => r !== Pt && r.startsWith(v));
    if (t.length > 0)
      return t.sort((r, a) => r.length - a.length || (r < a ? -1 : r > a ? 1 : 0)), t[0];
    const i = v.replace(/(?:\s|_|\d).*$/, "");
    if (i && i !== v && n[i]) return i;
  }
  /**
   * 动皮对应的静皮**在千幻里应该叫什么**（不带扩展名）。
   *
   * 千幻判断「这个动皮有没有同名静皮」用的是**去掉扩展名的名字**（`qhly_getSkinModels` 里
   * `dyskin = 动皮名 + '.jpg'` 再去比），所以额外皮肤的名字必须与动皮名一致，
   * 只是**文件**可以是别的名字（`夏卉` ↔ `夏卉 FA075.png`）。若把文件名当名字交出去，
   * 千幻仍然认为「动皮没有静皮」，又会自己补一张 `夏卉.jpg` —— 这正是「同名显示两个」的来源。
   * @param {string} charName
   * @param {string} skinName 动皮名
   * @returns {string | undefined}
   */
  getStaticSkinName(e, v) {
    const n = this.getStaticSkinKey(e, v);
    if (n)
      return n === Pt ? Q.removeExt(Q.getCharacterPortraitFile(e)) : n;
  }
  /**
   * 该动皮是否**必须**有对应静皮：只有此时才可以按「静皮名 = 皮肤名」交给千幻。
   * @param {string} charName
   * @param {string} skinName
   * @returns {boolean}
   */
  hasStaticSkin(e, v) {
    return v === Pt ? !0 : this.getStaticSkinFileName(e, v) !== void 0;
  }
  /**
   * 交给千幻作为「额外皮肤」的列表：**动皮对应的那张静皮**，且每张静皮只给一次。
   *
   * 为什么必须由本扩展提供：
   * - 千幻按「皮肤名 + 扩展名」自己拼路径（`skin.standard + 武将id + "/" + 皮肤名 + ext`），
   *   而本扩展的静皮在 `illustration/skin/{id}/` 下、且文件名常常不是皮肤名（`夏卉 FA075.png`），
   *   千幻自己扫不到，于是动皮在千幻里**没有图**；
   * - 千幻会在「有动皮、但没有同名静皮」时自己补一张 `皮肤名 + '.jpg'`（`qhly_getSkinModels`），
   *   而本扩展的静皮是 png ⇒ 同一张皮肤出现「png + jpg」两个卡片。
   *
   * ⚠️ `skinName` 必须是**动皮名**（`夏卉`），不是文件名：千幻按名字判断「有没有静皮」，
   * 名字对不上它就还会补一张 jpg（于是又变成两张）。文件本身可以由千幻的 `ext` 参数换成真实扩展名，
   * 取不到再由 `qianhuan.js` 的 `getSkinExt` 兜底（`夏卉` → `夏卉 FA075.png`）。
   * @returns {{ name: string, skinName: string }[]}
   */
  getDynamicSkinEntries() {
    const e = mt.assets || {}, v = [];
    for (const n in e) {
      if (window.whichWaySave?.hasChar?.(n) !== !0) continue;
      const t = /* @__PURE__ */ new Set();
      for (const i in e[n]) {
        if (!this.isStandaloneDynamicSkin(n, i)) continue;
        const r = this.getStaticSkinName(n, i);
        !r || t.has(r) || (t.add(r), v.push({ name: n, skinName: r }));
      }
    }
    return v;
  }
  async updateDyc(e, v, n = "default") {
    if (!b.needEnable()) return;
    let t = window.whichWaySave.skinConfig[e] || "经典形象.1145141919810", i = Q.removeExt(t), r = `${e}_${i}`, a = b.spineCache;
    if (a.forEach((f) => {
      for (let l in f) {
        let p = f[l];
        if (p.from === v)
          for (let u in p) {
            let s = p[u];
            s instanceof HTMLElement || (s.parent.style.display = "none");
          }
      }
    }), this.banSkin?.[e]?.[i] !== !0) {
      if (a.has(r)) {
        if (pt.itemtype(v) === "player" && a.get(r)?.[v.playerid]?.[n]) {
          a.get(r)[v.playerid][n].parent.style.display = "";
          return;
        } else if (a.get(r)?.[v.className]?.[n]) {
          a.get(r)[v.className][n].parent.style.display = "";
          return;
        }
      }
      b.getSkinData(e, i) && b.loadDyc(e, i, v);
    }
  }
  draggingDyc(e) {
    if (!b.needEnable()) return;
    if (!et.config("enableWhichWayDynamicSkin")) {
      rt.showToast("请先开启动态皮肤功能");
      return;
    }
    if (typeof e != "object") {
      rt.showToast("不是合法的Spine对象");
      return;
    }
    rt.showToast("已开启动皮拖拽");
    const v = document.createElement("button");
    v.id = "copySketeonPostionBtnSJZX", v.textContent = "复制信息", document.body.appendChild(v), v.addEventListener("click", () => {
      let A = [];
      const g = mt?.skeletonPostion;
      g?.x && A.push(`x:[${g.x[0] ?? 0},${g.x[1].toFixed(2)}],`), g?.y && A.push(`y:[${g.y[0] ?? 0},${g.y[1].toFixed(2)}],`), g?.scale !== void 0 && A.push(`scale:${g.scale.toFixed(2)},`), A.length > 0 ? navigator.clipboard.writeText(A.join(`
`)).then(() => {
        rt.showToast("复制成功", 1500, "bottomRight", "skeletonPositionCopySJZX");
      }).catch((m) => {
        console.error("复制失败: ", m);
      }) : rt.showToast("没有可复制的信息!", 1500);
    });
    const n = document.createElement("button");
    n.id = "toggleDragBtnSJZX", n.textContent = "关闭拖拽", document.body.appendChild(n), n.addEventListener("click", () => {
      n.remove(), v.remove(), b.stopDraggingDyc(e);
    });
    const t = e.parent;
    t.style.pointerEvents = "all";
    const i = e.skeleton, r = e.dom;
    let a = !1, f = 0, l = 0;
    const p = 1e-3, u = 10, s = 0.01;
    let h = 0;
    const d = 200, c = (A, g) => [A, g], M = () => {
      const [A, g] = b.getDycFitSize(t), m = (P, I = 0) => Number.isFinite(P) ? P : I;
      mt.skeletonPostion || (mt.skeletonPostion = {});
      const x = mt.skeletonPostion;
      return x.x = [0, A ? m(i.x / A) : 0], x.y = [0, g ? m(i.y / g) : 0], x.scale = m(A ? i.scaleX / (A / 120) : i.scaleX, 1), x;
    }, C = (A) => {
      a = !0, f = A.clientX, l = A.clientY;
    }, S = (A) => {
      if (!a) return;
      const [g, m] = c(A.clientX - f, A.clientY - l);
      i.x += g, i.y += m, f = A.clientX, l = A.clientY;
      const x = Date.now();
      if (x - h > d) {
        const P = M();
        rt.showToast(
          `骨骼位置: x=[${P.x[0]},${P.x[1].toFixed(2)}], y=[${P.y[0]},${P.y[1].toFixed(2)}]`,
          !0,
          "topLeft",
          "dragging_xAndy"
        ), h = x;
      }
    }, L = () => {
      a = !1;
    }, E = (A) => {
      A.preventDefault();
      const g = A.deltaY;
      let m = i.scaleX;
      g < 0 ? m += s : m -= s, m = Math.max(p, Math.min(u, m)), i.scaleX = i.scaleY = m;
      const x = M();
      rt.showToast(`当前骨骼缩放: scale=${x.scale.toFixed(2)}`, !0, "topLeft", "dragging_scale");
    };
    b.eventListenersMap.set(r, { onMouseDown: C, onMouseMove: S, onMouseUp: L, onWheel: E }), r.addEventListener("mousedown", C), document.addEventListener("mousemove", S), document.addEventListener("mouseup", L), r.addEventListener("wheel", E, { passive: !1 });
  }
  stopDraggingDyc(e) {
    let v = e.parent;
    v.style.pointerEvents = "none";
    const n = e.dom, t = b.eventListenersMap.get(n);
    if (t) {
      const { onMouseDown: r, onMouseMove: a, onMouseUp: f, onWheel: l } = t;
      n.removeEventListener("mousedown", r), document.removeEventListener("mousemove", a), document.removeEventListener("mouseup", f), n.removeEventListener("wheel", l);
    }
    b.eventListenersMap.delete(n);
    let i = rt.toastRegistry;
    for (let r in i) {
      let a = i[r];
      if (typeof a != "function")
        for (let f of a) {
          let l = f.id;
          l.startsWith("dragging_") && rt.removeToastById(l);
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
        let v = [];
        return K.extensionPack.皮肤切换 || v.push("皮肤切换"), K.extensionPack.千幻聆音 || v.push("千幻聆音"), K.extensionPack.十周年UI || v.push("十周年UI"), v.length === 0;
      }
    }
    return !1;
  }
}
const b = new Qe();
Re({
  name: "whichWaySpineWorker_dev",
  fn() {
    window.spineWorker = b;
  }
});
window.whichWay.register("spineWorker", b);
const Ke = { class: "conf-override" }, $e = { class: "config-container" }, tr = { class: "title-container" }, er = ["src"], rr = { class: "confilct-card-container" }, ir = { class: "card-title" }, nr = { class: "card-content" }, ar = ["onClick"], sr = { class: "skin-container" }, or = ["src"], hr = { class: "intro-container" }, lr = { class: "skin-item" }, cr = { class: "from-item" }, ur = /* @__PURE__ */ Ee({
  __name: "confOverride",
  setup(o) {
    const e = Q.compilePath("ui:skin.png"), v = lt.confictedSkins.data, n = We({});
    function t() {
      Object.keys(v).forEach((s) => {
        v[s].length > 0 && (n[s] = lt.confictedSkins.selected[s] || v[s][0].skin);
      });
    }
    function i(s, h) {
      return n[s] === h;
    }
    function r(s, h) {
      n[s] = h, console.log(`已选择 ${s} 的皮肤: ${h}`);
    }
    function a() {
      lt.confictedSkins.selected = n;
      const s = document.querySelector(".conflictedSkinOverlay-whichWaySkin.whichWayOverlay");
      s && s.remove(), lt.pendingReslove.showConflictedSkin && (lt.pendingReslove.showConflictedSkin(!0), lt.pendingReslove.showConflictedSkin = null);
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
    function p(s) {
      return l[s] ? l[s] : K.translate[s] ? K.translate[s] : s;
    }
    const u = {
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
    return (s, h) => (Rt(), Tt("div", Ke, [
      dt("div", $e, [
        dt("div", tr, [
          dt("img", { src: _t(e) }, null, 8, er),
          h[0] || (h[0] = dt("div", { class: "title" }, "皮肤配置冲突", -1))
        ]),
        dt("div", rr, [
          (Rt(!0), Tt(fe, null, de(_t(v), (d, c) => (Rt(), Tt("div", {
            key: c,
            class: "confilct-card"
          }, [
            dt("div", ir, Ht(p(c)), 1),
            Ye((Rt(), Tt("div", nr, [
              (Rt(!0), Tt(fe, null, de(d, (M, C) => (Rt(), Tt("div", {
                key: `${c}-${C}`,
                class: _e(["item-content", { selected: i(c, M.skin) }]),
                onClick: (S) => r(c, M.skin)
              }, [
                dt("div", sr, [
                  dt("img", {
                    src: _t(lt).getCharacterSkin(c, M.skin)?.path
                  }, null, 8, or)
                ]),
                dt("div", hr, [
                  dt("span", lr, Ht(_t(Q).removeExt(M.skin)), 1),
                  dt("span", cr, Ht(p(M.from)), 1)
                ])
              ], 10, ar))), 128))
            ])), [
              [u]
            ])
          ]))), 128))
        ])
      ]),
      dt("div", { class: "quick-container" }, [
        dt("button", {
          class: "apply-btn",
          onClick: a
        }, "应用选择"),
        dt("button", {
          class: "reset-btn",
          onClick: f
        }, "重置")
      ])
    ]));
  }
}), fr = /* @__PURE__ */ ke(ur, [["__scopeId", "data-v-d878dd96"]]), dr = {
  has(o, e, v) {
    if ([o, e, v].includes(void 0)) throw new Error("参数不能为undefined");
    return Array.isArray(this.data[o]) ? this.data[o].some((n) => n.from === v && n.skin === e) : !1;
  },
  add(o, e, v) {
    if ([o, e, v].includes(void 0)) throw new Error("参数不能为undefined");
    this.has(o, e, v) || (Array.isArray(this.data[o]) || (this.data[o] = []), this.data[o].push({ skin: e, from: v }));
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
    return et.config("whichWay_ConfictedSkin_selectedSkins") || {};
  },
  set selected(o) {
    et.saveConfig("whichWay_ConfictedSkin_selectedSkins", o);
  }
}, vr = Object.create(dr), jt = 1.5, Kt = { x: 0, y: 0, scale: jt };
function Ie(o, e, v) {
  return {
    x: v * Math.max(1, o / e),
    y: v * Math.max(1, e / o)
  };
}
function Pe(o, e) {
  const v = Math.abs(e.x - 1) / 2, n = Math.abs(e.y - 1) / 2;
  return {
    x: Math.min(Math.max(o.x, -v), v),
    y: Math.min(Math.max(o.y, -n), n),
    scale: o.scale
  };
}
const Gt = "经典形象", $t = "json:pos.json", pr = "pos.json", Le = 1;
let At = {}, te = !1;
function Vt(o, e) {
  const v = typeof o == "number" ? o : Number(o);
  return Number.isFinite(v) ? v : e;
}
function oe(o) {
  if (typeof o != "string" || o.length === 0) return;
  const e = /^url\(\s*(?:"([^"]*)"|'([^']*)'|([^)]*))\s*\)$/.exec(o.trim()), v = (e?.[1] ?? e?.[2] ?? e?.[3] ?? o).trim();
  if (!v) return;
  let n = v;
  try {
    n = decodeURIComponent(v);
  } catch {
  }
  const t = n.split("/").filter((f) => f.length > 0);
  if (t.length < 2) return;
  const i = t[t.length - 1], r = t[t.length - 2], a = Q.removeExt(i);
  if (bt.isArknght(r)) return { charId: r, skin: a };
  if (bt.isArknght(a)) return { charId: a, skin: Gt };
}
function zt(o, e) {
  return te ? { ...Kt, ...At[o]?.[e] } : { ...Kt };
}
function mr() {
  return At;
}
function ei() {
  return JSON.stringify({ schema: Le, data: At }, null, "	");
}
function Mr(o) {
  const e = oe(o);
  return e ? zt(e.charId, e.skin) : { ...Kt };
}
function Cr(o, e, v) {
  const n = At[o] ??= {};
  n[e] = {
    x: Vt(v.x, 0),
    y: Vt(v.y, 0),
    scale: Vt(v.scale, jt)
  }, De();
}
async function yr() {
  try {
    if (!await Q.exsitFile($t, "file")) {
      te = !0;
      return;
    }
    const e = (await Q.readFile($t))?.data;
    if (e && typeof e == "object")
      for (const v in e) {
        const n = e[v];
        if (!n || typeof n != "object") continue;
        const t = {};
        for (const i in n) {
          const r = n[i];
          !r || typeof r != "object" || (t[i] = {
            x: Vt(r.x, 0),
            y: Vt(r.y, 0),
            scale: Vt(r.scale, jt)
          });
        }
        At[v] = t;
      }
  } catch (o) {
    console.error("[whichWayPortraitPos] 读取 pos.json 失败，本次按默认位置显示", o);
  } finally {
    te = !0;
  }
}
let ee;
function we() {
  Q.writeFileAsJson({ schema: Le, data: At }, "json:", pr).then(() => {
    et.isDeveloperMode() && console.log("[whichWayPortraitPos] 已写入", Q.compilePath($t), "共", Object.keys(At).length, "名干员");
  }).catch((o) => {
    console.error("[whichWayPortraitPos] 保存 pos.json 失败", o);
  });
}
function De() {
  clearTimeout(ee), ee = setTimeout(we, 300);
}
function he() {
  clearTimeout(ee), we();
}
function gr() {
  return JSON.stringify(At);
}
function Sr(o) {
  try {
    At = JSON.parse(o);
  } catch (e) {
    console.error("[whichWayPortraitPos] 恢复备份失败", e);
  }
  De();
}
const Ar = ["src"], xr = /* @__PURE__ */ Ee({
  __name: "PortraitLayers",
  props: {
    image: { default: "" },
    offsetX: { default: 0 },
    offsetY: { default: 0 },
    scale: { default: jt }
  },
  setup(o) {
    const e = o, v = qt(() => `url("${Q.compilePath("ui:background/default.png")}")`);
    function n() {
      return et.config("portraitUseCover") === !0;
    }
    const t = qt(() => {
      const c = /^url\(\s*(?:"([^"]*)"|'([^']*)'|([^)]*))\s*\)$/.exec(e.image.trim()), M = (c?.[1] ?? c?.[2] ?? c?.[3] ?? "").trim();
      return !M || M === "none" || M === "undefined" ? "" : M;
    }), i = Ft(), r = Ft(), a = Ft(!1), f = Ft(0), l = Ft(0);
    function p() {
      const c = r.value;
      f.value = c && c.naturalWidth > 0 && c.naturalHeight > 0 ? c.naturalWidth / c.naturalHeight : 0;
    }
    function u() {
      const c = i.value;
      !c || c.clientWidth <= 0 || c.clientHeight <= 0 || (l.value = c.clientWidth / c.clientHeight);
    }
    function s(c) {
      return !(f.value > 0) || !(l.value > 0) ? { x: c, y: c } : Ie(f.value, l.value, c);
    }
    const h = qt(() => {
      const c = n(), M = c ? 1 : e.scale, C = s(M), S = Pe({ x: c ? 0 : e.offsetX, y: c ? 0 : e.offsetY, scale: M }, C);
      return {
        width: `${C.x * 100}%`,
        height: `${C.y * 100}%`,
        left: `${50 + S.x * 100 - C.x * 50}%`,
        top: `${50 + S.y * 100 - C.y * 50}%`
      };
    });
    Xe(t, async () => {
      f.value = 0, a.value = !1, await Ge(), p(), u();
    });
    let d;
    return Ze(() => {
      u(), p();
      const c = i.value;
      c && typeof ResizeObserver < "u" && (d = new ResizeObserver(() => u()), d.observe(c));
    }), je(() => d?.disconnect()), (c, M) => (Rt(), Tt("div", {
      ref_key: "wrapperEl",
      ref: i,
      class: "sjzxPortraitWrapper",
      style: ve({ backgroundImage: v.value })
    }, [
      t.value && !a.value ? (Rt(), Tt("img", {
        key: 0,
        ref_key: "imgEl",
        ref: r,
        class: "sjzxPortraitImage",
        src: t.value,
        style: ve(h.value),
        draggable: "false",
        alt: "",
        onLoad: p,
        onError: M[0] || (M[0] = (C) => a.value = !0)
      }, null, 44, Ar)) : ze("", !0)
    ], 4));
  }
}), Er = /* @__PURE__ */ ke(xr, [["__scopeId", "data-v-3a164c20"]]), re = /* @__PURE__ */ new WeakMap(), ye = /* @__PURE__ */ new WeakMap(), Wt = /* @__PURE__ */ new WeakSet(), Rr = /* @__PURE__ */ new WeakSet(), ie = (o) => typeof o == "string" && bt.isArknght(o), Ct = (o) => {
  const e = re.get(o);
  return e && e.host.parentNode === o ? e : void 0;
};
function Tr(o) {
  return o != null && Ct(o) !== void 0;
}
function Ve(o) {
  const e = Ct(o);
  if (e?.url)
    return oe(e.url);
}
function Oe(o, e) {
  const v = Ct(o);
  v && v.setImage(v.url, e);
}
function kr(o, e) {
  const v = Ct(o);
  if (!v) return;
  const n = v.host.querySelector("img");
  if (!n) return;
  const t = v.host.clientWidth, i = v.host.clientHeight;
  if (!(t > 0) || !(i > 0)) return;
  const r = t / i;
  return !(n.naturalWidth > 0) || !(n.naturalHeight > 0) ? { x: e, y: e } : Ie(n.naturalWidth / n.naturalHeight, r, e);
}
function Fe(o) {
  const e = document.createElement("div");
  return o(e), e.style.backgroundImage;
}
function le(o) {
  const e = /^url\((?:"[^"]*"|'[^']*'|[^)]*)\)/.exec(o);
  return e ? e[0] : o;
}
const Ir = (o) => `url("${Q.toCssUrl(o)}")`;
function ce(o, e) {
  Wt.add(o), o.style.backgroundImage = e, queueMicrotask(() => Wt.delete(o));
}
function ue(o) {
  const e = Ct(o);
  if (e) return e;
  o.style.backgroundSize = "cover", o.style.backgroundPositionX = "center";
  const v = document.createElement("div");
  v.style.cssText = "position:absolute;left:0;top:0;width:100%;height:100%;pointer-events:none;border-radius:inherit;overflow:hidden;";
  const n = {
    host: v,
    url: "",
    setImage(t, i) {
      n.url = t;
      const r = i ?? Mr(t);
      pe(He(Er, { image: t, offsetX: r.x, offsetY: r.y, scale: r.scale }), v);
    },
    dispose() {
      pe(null, v), v.remove(), re.delete(o);
    }
  };
  return n.setImage(""), o.prepend(v), re.set(o, n), Vr(o), n;
}
function ne(o, e) {
  const v = ue(o), n = Pr(o, e);
  n && (v.setImage(n), ce(o, n));
}
function Pr(o, e) {
  const v = lt.skinPathOf(e);
  return v ? Ir(v) : le(Fe((n) => HTMLDivElement.prototype.setBackground.call(n, e, "character")));
}
function wt(o) {
  o && (Rr.add(o), Ue());
}
const Lr = [
  "avatar",
  "avatar2",
  "primary-avatar",
  "deputy-avatar",
  "qh-avatar",
  "qh-shousha-big-avatar",
  "qh-image-standard",
  "qh-image-lutou",
  "qh-page-skinavatarpicture",
  "qh-page-skinavatarpicture-lutou"
];
function ae(o) {
  const e = o?.classList;
  return e ? e.contains("qh-must-replace") || e.contains("button") && e.contains("character") ? !0 : Lr.some((v) => e.contains(v)) : !1;
}
let ge = !1, Lt = 0;
function Ue() {
  if (ge) return;
  ge = !0;
  const o = HTMLDivElement.prototype, e = o.qhly_origin_setBackground || o.setBackground, v = o.setBackground;
  function n(t, i, r, a) {
    if (Lt === 0 && i === "character" && ie(t) && ae(this)) {
      Lt++;
      try {
        ne(this, t);
      } catch (f) {
        return console.error("[whichWaySkin] 双层立绘绘制失败，回落到引擎原流程", f), e.call(this, t, i, r, a);
      } finally {
        Lt--;
      }
      return this;
    }
    Lt === 0 && Ct(this)?.dispose(), Lt++;
    try {
      return v.call(this, t, i, r, a);
    } finally {
      Lt--;
    }
  }
  o.setBackground = n, o.qhly_origin_setBackground = function(t, i, r, a) {
    if (i === "character" && ie(t) && ae(this))
      try {
        return ne(this, t), this;
      } catch (f) {
        console.error("[whichWaySkin] 双层立绘绘制失败，回落到引擎原流程", f);
      }
    return e.call(this, t, i, r, a);
  };
}
function wr(o) {
  return Array.isArray(o) || typeof o != "string" || o.length === 0 ? !1 : oe(o) !== void 0;
}
function Dr() {
  const o = HTMLDivElement.prototype;
  if (o.__whichWayBackgroundImageGated) return;
  o.__whichWayBackgroundImageGated = !0;
  const e = o.setBackgroundImage;
  o.setBackgroundImage = function(v) {
    if (!ae(this) || !wr(v))
      return e.call(this, v);
    try {
      const n = le(Fe((i) => e.call(i, v)));
      return n ? ((Ct(this) ?? ue(this)).setImage(n), ce(this, n), this) : e.call(this, v);
    } catch (n) {
      return console.error("[whichWaySkin] 同步皮肤图失败，回落到引擎原流程", n), e.call(this, v);
    }
  };
}
function Vr(o) {
  if (ye.has(o) || !Ct(o)) return;
  const v = new MutationObserver(() => {
    const n = Ct(o);
    if (!n || Wt.has(o)) return;
    const t = o.style.backgroundImage;
    if (!t || t === "none") return;
    const i = le(t);
    if (!(!i || i === n.url)) {
      Wt.add(o);
      try {
        n.setImage(i), o.style.backgroundImage = "";
      } finally {
        queueMicrotask(() => Wt.delete(o));
      }
    }
  });
  v.observe(o, { attributes: !0, attributeFilter: ["style"] }), ye.set(o, v);
}
function Xt(o, e) {
  if (!(!o || typeof e != "string" || !Ct(o)))
    try {
      b.updateDyc(e, o);
    } catch (v) {
      console.error("[whichWaySkin] 更新动皮失败", v);
    }
}
function Or(o, e, v) {
  if (!(o instanceof HTMLDivElement) || !e) return !1;
  wt(o);
  const n = e.startsWith("url(") ? e : `url("${Q.compilePath(e)}")`;
  return ue(o).setImage(n, v), ce(o, n), !0;
}
Te({
  name: "whichWaySkinAvatarBackground",
  fn: () => {
    Ue(), Dr(), Bt.appendHook("lib.element.player.$init", {
      before() {
        wt(this.node.avatar), wt(this.node.avatar2);
      },
      after(o, e, v) {
        return Xt(this.node?.avatar, e), v && Xt(this.node?.avatar2, v), o;
      }
    }), Bt.appendHook("lib.element.player.$reinit", {
      before() {
        wt(this.node.avatar), wt(this.node.avatar2);
      },
      after(o, e, v) {
        return Xt(this.node?.avatar, e), v && Xt(this.node?.avatar2, v), o;
      }
    }), Bt.appendHook("ui.create.buttonPresets.character", {
      after(o) {
        const e = o?.link;
        ie(e) && (wt(o), ne(o, e));
      }
    });
  }
});
const Fr = 0.2, Ur = 5, Nr = 200;
let St, Yt;
const Zt = /* @__PURE__ */ new Set();
function Se(o, e, v) {
  return Math.max(e, Math.min(v, o));
}
function Ae(o) {
  return o / (gt.documentZoom || 1);
}
function Ne(o) {
  if (gt?.players)
    for (const e of gt.players.concat(gt.dead ?? []))
      for (const v of [e.node?.avatar, e.node?.avatar2])
        Tr(v) && o(v);
}
function Br(o) {
  const e = Ve(o);
  if (!e) return;
  const v = {
    pointerEvents: o.style.pointerEvents,
    cursor: o.style.cursor,
    touchAction: o.style.touchAction
  };
  o.style.pointerEvents = "all", o.style.cursor = "move", o.style.touchAction = "none";
  const n = /* @__PURE__ */ new Map();
  let t = 0, i = 0;
  const r = () => zt(e.charId, e.skin), a = `dragging_portrait_${e.charId}_${e.skin}`, f = (S) => {
    const L = kr(o, S.scale), E = L ? Pe(S, L) : S;
    Cr(e.charId, e.skin, E), Oe(o, E);
  }, l = (S = !1) => {
    const L = Date.now();
    if (!S && L - i < Nr) return;
    i = L;
    const E = r();
    Zt.add(a), rt.showToast(
      `[${e.charId} · ${e.skin}] x=${E.x.toFixed(3)} y=${E.y.toFixed(3)} scale=${E.scale.toFixed(2)}`,
      !0,
      "topLeft",
      a
    );
  }, p = (S, L) => {
    const E = o.clientWidth, A = o.clientHeight;
    if (!E || !A) return;
    const g = r();
    f({ x: g.x + Ae(S) / E, y: g.y + Ae(L) / A, scale: g.scale });
  }, u = (S) => {
    const L = r();
    f({ x: L.x, y: L.y, scale: Se(L.scale * S, Fr, Ur) });
  }, s = () => {
    const [S, L] = [...n.values()];
    return !S || !L ? 0 : Math.hypot(L.x - S.x, L.y - S.y);
  }, h = (S) => {
    S.preventDefault(), n.set(S.pointerId, { x: S.clientX, y: S.clientY }), n.size === 2 && (t = s()), o.setPointerCapture?.(S.pointerId), o.addEventListener("pointermove", d), o.addEventListener("pointerup", c), o.addEventListener("pointercancel", c);
  }, d = (S) => {
    const L = n.get(S.pointerId);
    if (L) {
      if (n.set(S.pointerId, { x: S.clientX, y: S.clientY }), n.size >= 2) {
        const E = s();
        t > 0 && E > 0 && u(E / t), t = E, l();
        return;
      }
      p(S.clientX - L.x, S.clientY - L.y), l();
    }
  }, c = (S) => {
    n.delete(S.pointerId), o.releasePointerCapture?.(S.pointerId), o.removeEventListener("pointermove", d), o.removeEventListener("pointerup", c), o.removeEventListener("pointercancel", c), n.size < 2 && (t = 0), he(), l(!0);
  }, M = (S) => {
    S.preventDefault(), u(Se(Math.exp(-S.deltaY * 2e-3), 0.8, 1.25)), l(!0);
  }, C = (S) => {
    S.stopPropagation(), S.preventDefault();
  };
  return o.addEventListener("pointerdown", h), o.addEventListener("wheel", M, { passive: !1 }), o.addEventListener("click", C, !0), () => {
    o.removeEventListener("pointerdown", h), o.removeEventListener("wheel", M), o.removeEventListener("click", C, !0), o.removeEventListener("pointermove", d), o.removeEventListener("pointerup", c), o.removeEventListener("pointercancel", c), n.clear(), o.style.pointerEvents = v.pointerEvents, o.style.cursor = v.cursor, o.style.touchAction = v.touchAction, rt.removeToastById(a), Zt.delete(a);
  };
}
let se;
function Wr() {
  const o = document.createElement("div");
  o.id = "portraitDragBarSJZX";
  const e = document.createElement("button");
  e.textContent = "退出拖拽", e.addEventListener("click", () => Be());
  const v = document.createElement("button");
  return v.textContent = "重置本次调整", v.addEventListener("click", () => Gr()), o.append(e, v), document.body.appendChild(o), o;
}
function Yr() {
  if (St) {
    for (const o of St.values()) o();
    St = void 0, Yt = void 0, se?.remove(), se = void 0, he();
    for (const o of Zt) rt.removeToastById(o);
    Zt.clear(), rt.removeToastById("dragging_portrait_mode");
  }
}
function _r() {
  Ne((o) => {
    const e = Ve(o);
    e && Oe(o, zt(e.charId, e.skin));
  });
}
function Xr() {
  const o = [];
  if (Ne((e) => o.push(e)), o.length === 0) {
    rt.showToast("[驶舰之向] 场上没有可拖拽的明日方舟立绘（只有本扩展绘制的干员立绘能调位置）", 4e3);
    return;
  }
  Yt = gr(), St = /* @__PURE__ */ new Map();
  for (const e of o) {
    const v = Br(e);
    v && St.set(e, v);
  }
  if (St.size === 0) {
    St = void 0, Yt = void 0, rt.showToast("[驶舰之向] 场上没有可拖拽的明日方舟立绘", 4e3);
    return;
  }
  se = Wr(), rt.showToast("[驶舰之向] 已进入皮肤拖拽：拖动改位置，滚轮/双指改大小，调整后自动保存", !0, "bottomRight", "dragging_portrait_mode");
}
function Be() {
  if (St) {
    Yr(), rt.showToast("[驶舰之向] 已退出皮肤拖拽，位置已保存", 2500);
    return;
  }
  Xr();
}
function Gr() {
  if (!St || Yt === void 0) {
    rt.showToast("[驶舰之向] 请先点「皮肤拖拽」进入拖拽模式", 2500);
    return;
  }
  Sr(Yt), _r(), rt.showToast("[驶舰之向] 已恢复到进入皮肤拖拽前的位置", 2500);
}
const xe = "skinCacheClearedV16";
class Zr {
  /**
   * 皮肤组件初始化
   */
  async init() {
    await et.measureExecutionTime(async () => {
      await yr(), await this.autoUpdateSkinData();
    }).then(({ duration: e }) => {
      et.isDeveloperMode() && console.log(`[whichWaySkin] init skin time ${e}ms`);
    }).catch((e) => {
      console.error("[whichWaySkin] 皮肤数据初始化失败，已跳过皮肤层，其余功能继续加载", e);
    }), Je({
      name: "whichWaySkinInitSkinData_init",
      fn: async () => {
        for (const e of window.whichWaySave.allCharacters)
          this.skinData[e] ??= {
            name: e,
            skins: {}
          }, Q.characterPortraitExt[e] && (this.skinData[e].skins = {
            经典形象: {
              name: Q.getCharacterPortraitFile(e),
              path: Q.getCharacterPortraitPath(e)
            },
            ...this.skinData[e].skins
          });
        this.syncAllSkinConfig(), this.refreshSkin();
      }
    }), Te({
      name: "whichWaySkinAddInitDyc",
      fn() {
        if (!b.needEnable()) return;
        let e = et.config("WhichWayDynamicSkinSwitch");
        if (e === "sjzx")
          Bt.appendHook("lib.element.player.init", {
            before(v, n) {
              this.dycSJZX && b.dispose(this.dycSJZX), (function() {
                let t = K.config.mode;
                return t === "single" ? pt.config("double_character", t) !== "single" : pt.config("double_character", t);
              })() ? rt.showToast("【驶舰之向】:双将时无法使用动皮！", 5e3, "bottomCenter", "sjzx_doubleCharacterWarn") : b.updateDyc(v, this);
            }
          }), Bt.appendHook("lib.element.player.reinit", {
            before(v, n) {
              this.dycSJZX && b.dispose(this.dycSJZX), (function() {
                let t = K.config.mode;
                return t === "single" ? pt.config("double_character", t) !== "single" : pt.config("double_character", t);
              })() ? rt.showToast("【驶舰之向】:双将时无法使用动皮！", 5e3, "bottomCenter", "sjzx_doubleCharacterWarn") : b.updateDyc(v, this);
            }
          });
        else if (e === "piqie") {
          let v = structuredClone(K.config.sjzxDycAssets ?? {});
          for (let n in v) {
            let t = v[n];
            for (let i in t) {
              let r = t[i];
              Array.isArray(r.action) && (r.action = r.action[0]);
            }
          }
          decadeUI.dynamicSkin || (decadeUI.dynamicSkin = {}), Object.assign(decadeUI.dynamicSkin, v), skinSwitch.saveSkinParams || (skinSwitch.saveSkinParams = {}), Object.assign(skinSwitch.saveSkinParams, v);
        }
      }
    }), me({
      name: "whichWayInitDycDragging",
      fn() {
        b.needEnable() && et.isDeveloperMode() && Dt.create.system(
          "动皮拖拽",
          () => {
            b.draggingDyc(gt.me.dycSJZX);
          },
          !0
        );
      }
    }), me({
      name: "whichWayInitPortraitDragging",
      fn() {
        Dt.create.system("皮肤拖拽", Be, !0);
      }
    }), Ut({
      name: "whichWaySkinUpdateSkinData_add",
      priority: 899,
      obj: {
        name: "updateSkinData",
        options: {
          name: "<button type=`button`>更新皮肤数据</button>",
          clear: !0,
          async onclick() {
            if (window.whichWaySave.updatingSkinData) {
              rt.showToast("[驶舰之向] 正在更新皮肤数据，请勿重复操作...", 3e3, "topLeft", "configTips_updateSkinData_updatingSkinData");
              return;
            }
            window.whichWaySave.updatingSkinData = !0, rt.showToast("[驶舰之向] 正在更新皮肤数据...", !0, "topLeft", "configTips_updateSkinData");
            try {
              await lt.autoUpdateSkinData(!0);
            } catch (e) {
              console.error("[whichWaySkin] 皮肤数据更新失败", e), rt.showToast("[驶舰之向] 皮肤数据更新失败，详见控制台", 3e3, "topLeft", "configTips_updateSkinData");
              return;
            } finally {
              window.whichWaySave.updatingSkinData = !1, rt.removeToastById("configTips_updateSkinData_updatingSkinData");
            }
            rt.showToast("[驶舰之向] 皮肤数据更新完成!", 3e3, "topLeft", "configTips_updateSkinData");
          }
        }
      }
    }), Ut({
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
    }), Ut({
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
    }), Ut({
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
    }), Ut({
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
    await Q.initSkinFileIndex(this.skinData);
  }
  /**
   * 保存皮肤数据
   */
  async saveSkinData() {
    await Q.writeFileAsJson(
      {
        version: Jt.ext,
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
    if (!Jt.ext.startsWith("1.6") || et.config(xe)) return !1;
    try {
      await Q.exsitFile("json:cache/skin.json", "file") && await gt.promises.removeFile(Q.compilePath("json:cache/skin.json"));
    } catch (e) {
      return console.error("[whichWaySkin] 删除皮肤缓存失败，将在下次启动重试", e), !1;
    }
    return et.saveConfig(xe, !0), !0;
  }
  /**
   * 自动更新皮肤数据
   * @param forced 是否强制更新
   */
  async autoUpdateSkinData(e = !1) {
    if (await this.clearSkinCacheOnce(), await Q.exsitFile("json:cache/skin.json", "file") && e === !1) {
      const { version: v, data: n } = await Q.readFile("json:cache/skin.json");
      if (v === Jt.ext) {
        this.skinData = n;
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
  getCharacterSkin(e, v) {
    const n = this.skinData[e];
    if (!n) return;
    if (!v) {
      const r = {};
      for (const a in n.skins)
        r[a] = n.skins[a].path;
      return r;
    }
    const t = n.skins[v] ?? n.skins[Q.removeExt(v)];
    if (t) return t;
    const i = Q.getSkinFileName(e, v);
    return i ? { name: i, path: Q.compilePath(`skin:${e}/${i}`) } : void 0;
  }
  /**
   * 皮肤名 → 皮肤目录里**真实存在**的文件名（带扩展名）。
   *
   * 静皮目录里有不少文件名不是「皮肤名.png」（`时遗14.png`、`远行前的野餐.png` 之类），
   * 而动皮数据用的是短名；这里按目录扫描出来的索引取，**取不到就返回 undefined**，
   * 绝不硬拼一个 `{皮肤名}.png`（那在改名过的皮肤上必然 404）。
   * @param name 干员id
   * @param skin 皮肤名或文件名（带不带扩展名都行）
   */
  getSkinFileName(e, v) {
    const n = Q.getSkinFileName(e, v);
    if (n) return n;
    const t = Q.removeExt(v ?? "");
    return (t ? this.skinData[e]?.skins?.[t] : void 0)?.name;
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
  addPortrait(e, v, n) {
    const t = n ? this.getCharacterSkin(v, n)?.path : this.getCurrentSkinPath(v);
    return t ? Or(e, t) : (console.warn(`[whichWaySkin] 找不到图片（角色：${v}${n ? `，皮肤：${n}` : ""}），未添加`), !1);
  }
  /**
   * 立绘位置/缩放设定（`json/pos.json` 的内存形态）：干员id → 皮肤名 → `{ x, y, scale }`。
   *
   * 返回的是**活引用**，改它就是在改当前生效的设定（要重绘才看得见，且不会自动落盘）；
   * 想直接落盘调 `flushPortraitPos()`。暴露的用途：控制台查配置、外部面板批量重置。
   */
  get posData() {
    return mr();
  }
  /** 把内存里的立绘设定立刻写进 `json/pos.json`（拖拽松手/退出拖拽时已会自动调，这里给手动兜底） */
  flushPortraitPos() {
    he();
  }
  /** 读某干员某皮肤当前生效的立绘设定；没有配置时返回缺省值，不会返回 undefined */
  getPortraitPos(e, v = Gt) {
    return zt(e, v);
  }
  /**
   * 设置角色皮肤
   * @returns 是否写入成功：找不到该皮肤时为 false（调用方据此决定要不要更新界面，避免"界面切了但配置没变"）
   */
  setCharacterSkin(e, v) {
    if (et.isDeveloperMode() && console.log(`[whichWaySkin] setCharacterSkin ${e} ${v}`), v === Gt)
      return this.syncSkin({ key: e, del: !0 }), !0;
    const n = this.getCharacterSkin(e, v);
    return n ? (this.syncSkin({ key: e, value: [n.name, n.path] }), !0) : (console.warn(`[whichWaySkin] 找不到皮肤「${v}」（角色：${e}），本次切换已忽略`), !1);
  }
  /**
   * 写一条皮肤配置，并把**同一条选择**同步到千幻与本体存档。
   *
   * 三处配置是三个消费者各看各的：引擎看 `lib.config.skin`（数组）、千幻看 `qhly_skinset.skin`（字符串）、
   * 本扩展看自己的 `skinConfig`。只写自己那一份的话，下一次启动 `syncAllSkinConfig()` 会拿另外两份
   * （其中还停留在旧选择）来覆盖，表现出来就是「换了皮肤，重开又变回去了」。
   */
  syncSkin({ key: e, value: v, del: n }) {
    if (K.config.skin ??= {}, this.checkSkinSetting(), n === !0)
      delete this._skinStore[e], delete window.whichWaySave.skinConfig[e], delete K.config.skin[e], delete K.config.qhly_skinset.skin[e];
    else {
      if (v === void 0) throw new Error("value is undefined");
      this._skinStore[e] = v, window.whichWaySave.skinConfig[e] = v[0], K.config.skin[e] = v, K.config.qhly_skinset.skin[e] = v[0];
    }
    et.saveConfig("skin", K.config.skin, void 0), et.saveConfig("skinConfig", window.whichWaySave.skinConfig), et.saveConfig("qhly_skinset", K.config.qhly_skinset, void 0);
  }
  /**
   * 按当前皮肤配置重绘场上的玩家。
   *
   * 引擎的 `setBackground` 只管「角色 id → 立绘」，对干员来说皮肤是另一套配置（`lib.config.skin`），
   * 所以换肤/同步之后必须重新贴一次图。副将走 `name2`：`player.name` 在双将时是 `a+b/dual` 这种合成名，
   * 拿它去查皮肤表永远查不到。
   */
  refreshSkin() {
    const e = gt.players.concat(gt.dead);
    if (e.length !== 0)
      for (const v of e) {
        const n = v.name1 || v.name;
        n && v.node?.avatar && (v.node.avatar.setBackground(n, "character"), b.updateDyc(n, v)), v.name2 && v.node?.avatar2 && (v.node.avatar2.setBackground(v.name2, "character"), b.updateDyc(v.name2, v));
      }
  }
  /**
   * 获取角色的当前皮肤
   * @param name 干员id
   * @param igExt 是否去掉扩展名（返回值形态：`夏卉 FA075` / `夏卉 FA075.png`）
   */
  getCurentSkin(e, v = !0) {
    let n = this._skinStore?.[e]?.[0];
    return n || (n = `${Gt}.jpg`), v ? Q.removeExt(n) : n;
  }
  /**
   * 「某个武将在本扩展的皮肤配置里应该显示哪张图」—— 与 `getCurrentSkinPath` 的区别在于：
   * **没有选择时返回 undefined**，把「没有配置」与「配置里是一张坏图」分开。
   *
   * 给绘制层用：有结果就用它（本扩展解析的路径最可靠），没有就走引擎自己的 `setBackground`。
   * - 本扩展武将没有选择 ⇒ 立绘（经典形象）；
   * - 其它武将没有选择 ⇒ undefined（交回引擎，`char.img` 之类由引擎处理）；
   * - 其它武将**有**选择 ⇒ 存档里的路径（玩家在千幻/本体里换过动皮/皮肤）。
   * @param name 武将id
   */
  skinPathOf(e) {
    const v = this._skinStore?.[e]?.[1];
    if (typeof v == "string" && v.length > 0) return v;
    if (window.whichWaySave?.hasChar?.(e) === !0) return Q.getCharacterPortraitPath(e);
  }
  /**
   * 获取角色的当前皮肤路径
   */
  getCurrentSkinPath(e) {
    let v = this._skinStore?.[e]?.[1];
    if (!v) {
      if (!window.whichWaySave.hasChar(e)) {
        const n = pt.character(e);
        if (!n) return `image/character/${e}.jpg`;
        if (n.img !== void 0) return n.img;
        if (n.trashBin) {
          for (let t of n.trashBin)
            if (t.startsWith("ext:"))
              return t.replace("ext:", "extension/");
        }
        return `image/character/${e}.jpg`;
      }
      v = Q.getCharacterPortraitPath(e);
    }
    return v;
  }
  /**
   * 检查皮肤设置,不全的自动补全,并且判断是否需要同步
   */
  checkSkinSetting() {
    K.config.qhly_skinset ??= {
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
    }, K.config.qhly_skinset.skin ??= {}, K.config.qhly_skinset.skinAudioList ??= {}, K.config.qhly_skinset.audioReplace ??= {}, K.config.qhly_skinset.djtoggle ??= {}, K.config.skin ??= {}, this._skinStore = this._skinStore || {};
  }
  /**
   * 选择冲突皮肤
   */
  showConflictedSkin() {
    const e = Dt.create.div(".conflictedSkinOverlay-whichWaySkin .whichWayOverlay", document.body);
    return qe(fr).mount(e), new Promise((v) => {
      this.pendingReslove.showConflictedSkin = v;
    });
  }
  /**
   * 合并三份皮肤存档（本扩展 / 本体 / 千幻），并写回三处。
   *
   * 合并规则（`skinOverride` 配置决定「谁排最后」，排最后的源赢）：
   * - **本扩展武将**：以本扩展的皮肤表为准。干员的皮肤由本扩展提供，存档里只需记住**皮肤名**，
   *   路径一律按名字从本次扫描出的皮肤表重新解析 —— 存盘里的旧路径（目录迁移、改名）不能压住真实位置。
   *   解析不到就**保留原选择**而不是删键：删键等于把玩家选好的皮肤悄悄退回「经典形象」。
   * - **非本扩展武将**：原样保留，只剔除 `undefined`/`null` 的路径。
   *   以前这里是「解析不到就删键」，而本扩展的皮肤表里根本没有本体武将 ——
   *   于是本体武将的动皮选择在每次启动时都被删掉，再被本扩展的存档覆盖成「经典形象」（重开即丢）。
   */
  syncAllSkinConfig() {
    if (this._isSyncing) return;
    this._isSyncing = !0, this.checkSkinSetting();
    const e = this, v = {}, n = (f, l, p) => {
      if (typeof l != "string" || l.length === 0) return;
      if (window.whichWaySave?.hasChar?.(f) === !0) {
        const s = e.getCharacterSkin(f, l)?.path ?? (typeof p == "string" && p.length > 0 ? p : void 0);
        if (s === void 0) {
          console.warn(`[whichWaySkin] 皮肤「${l}」（干员：${f}）在本扩展的皮肤表里找不到，且存档中没有可用路径，本条已丢弃`);
          return;
        }
        v[f] = [l, s];
        return;
      }
      typeof p == "string" && p.length > 0 ? v[f] = [l, p] : console.warn(`[whichWaySkin] 皮肤「${l}」（角色：${f}）没有有效的图片路径，本条已丢弃`);
    }, t = (f, l) => {
      if (!(!f || typeof f != "object"))
        for (const p in f) {
          const u = f[p];
          l ? typeof u == "string" && n(p, u, e.getCharacterSkin(p, Q.removeExt(u))?.path) : Array.isArray(u) && typeof u[0] == "string" ? n(p, u[0], u[1]) : typeof u == "string" && n(p, u, `image/skin/${p}/${u}.jpg`);
        }
    }, i = et.config("skinOverride"), r = [
      { key: "whichWay", run: () => t(window.whichWaySave?.skinConfig || {}, !0) },
      { key: "noname", run: () => t(K.config.skin || {}, !1) },
      { key: "qhly", run: () => t(K.config.qhly_skinset?.skin || {}, !0) }
    ], a = r.findIndex((f) => f.key === i);
    a !== -1 && r.push(...r.splice(a, 1));
    try {
      r.forEach((u) => u.run());
      for (const u of [window.whichWaySave?.skinConfig, K.config.qhly_skinset?.skin])
        if (!(!u || typeof u != "object"))
          for (const s in u) {
            const h = u[s];
            typeof h == "string" && h.length > 0 && !(s in v) && n(s, h, e.getCharacterSkin(s, Q.removeExt(h))?.path);
          }
      const f = K.config.skin;
      if (f && typeof f == "object")
        for (const u in f) {
          const s = f[u];
          Array.isArray(s) && typeof s[0] == "string" && s[0].length > 0 && !(u in v) && n(u, s[0], s[1]);
        }
      const l = {};
      for (const [u, s] of Object.entries(this._skinStore))
        Array.isArray(s) && typeof s[0] == "string" && typeof s[1] == "string" && s[1].length > 0 && (l[u] = s);
      Object.assign(l, v);
      const p = this.transformSkinData(l);
      this._skinStore = l, K.config.skin = l, K.config.qhly_skinset.skin = p, window.whichWaySave.skinConfig = p, et.saveConfig("skin", l, void 0), et.saveConfig("qhly_skinset", K.config.qhly_skinset, void 0), et.saveConfig("skinConfig", window.whichWaySave.skinConfig);
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
      Object.entries(e).map(([v, n]) => Array.isArray(n) && n.length > 0 && typeof n[0] == "string" ? [v, n[0]] : [v, String(n)])
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
    for (const e in this._skinStore)
      delete this._skinStore[e];
  }
  initConfictedSkins() {
    this.checkSkinSetting();
    const e = window.whichWaySave.skinConfig, v = K.config.skin, n = K.config.qhly_skinset.skin, t = this.confictedSkins.selected;
    for (const i in e)
      t[i] && [e[i], v[i], n[i]].includes(t[i]) || window.whichWaySave.hasChar(i) && (v[i] && Array.isArray(v[i]) && v[i][0] !== e[i] && (this.confictedSkins.add(i, v[i][0], "noname"), this.confictedSkins.add(i, e[i], "whichWay")), n[i] && n[i] !== e[i] && (this.confictedSkins.add(i, n[i], "qhly"), this.confictedSkins.add(i, e[i], "whichWay")));
  }
  /**
   * 皮肤数据：干员id → { name, skins: { 皮肤名 → { name: 文件名, path: 绝对路径 } } }
   * 由 `initSkinData()`（= `whichWayFile.initSkinFileIndex()`）重建，缓存里存的就是这个形状。
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
  confictedSkins = vr;
  /**
   * 等待的Promise
   */
  pendingReslove = {};
}
const lt = new Zr();
await lt.init();
Re({
  name: "WhichWaySkin_dev",
  fn: () => {
    window.whichWaySkin = lt;
  }
});
window.whichWay.register("skin", lt);
const ri = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  whichWaySkin: lt
}, Symbol.toStringTag, { value: "Module" }));
export {
  Gt as D,
  jt as a,
  ei as b,
  ri as c,
  Br as e,
  ie as i,
  Or as m,
  b as s,
  lt as w
};
