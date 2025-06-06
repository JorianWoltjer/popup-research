var _Group = function () {
    this._tweens = {},
        this._tweensAddedDuringUpdate = {}
};
_Group.prototype = {
    getAll: function () {
        return Object.keys(this._tweens).map(function (t) {
            return this._tweens[t]
        }
            .bind(this))
    },
    removeAll: function () {
        this._tweens = {}
    },
    add: function (t) {
        this._tweens[t.getId()] = t,
            this._tweensAddedDuringUpdate[t.getId()] = t
    },
    remove: function (t) {
        delete this._tweens[t.getId()],
            delete this._tweensAddedDuringUpdate[t.getId()]
    },
    update: function (t, n) {
        var e = Object.keys(this._tweens);
        if (0 === e.length)
            return !1;
        for (t = void 0 !== t ? t : TWEEN.now(); e.length > 0;) {
            this._tweensAddedDuringUpdate = {};
            for (var i = 0; i < e.length; i++) {
                var r = this._tweens[e[i]];
                r && !1 === r.update(t) && (r._isPlaying = !1,
                    n || delete this._tweens[e[i]])
            }
            e = Object.keys(this._tweensAddedDuringUpdate)
        }
        return !0
    }
};
var TWEEN = new _Group;
TWEEN.Group = _Group,
    TWEEN._nextId = 0,
    TWEEN.nextId = function () {
        return TWEEN._nextId++
    }
    ,
    "undefined" == typeof self && "undefined" != typeof process && process.hrtime ? TWEEN.now = function () {
        var t = process.hrtime();
        return 1e3 * t[0] + t[1] / 1e6
    }
        : "undefined" != typeof self && void 0 !== self.performance && void 0 !== self.performance.now ? TWEEN.now = self.performance.now.bind(self.performance) : void 0 !== Date.now ? TWEEN.now = Date.now : TWEEN.now = function () {
            return (new Date).getTime()
        }
    ,
    TWEEN.Tween = function (t, n) {
        this._object = t,
            this._valuesStart = {},
            this._valuesEnd = {},
            this._valuesStartRepeat = {},
            this._duration = 1e3,
            this._repeat = 0,
            this._repeatDelayTime = void 0,
            this._yoyo = !1,
            this._isPlaying = !1,
            this._reversed = !1,
            this._delayTime = 0,
            this._startTime = null,
            this._easingFunction = TWEEN.Easing.Linear.None,
            this._interpolationFunction = TWEEN.Interpolation.Linear,
            this._chainedTweens = [],
            this._onStartCallback = null,
            this._onStartCallbackFired = !1,
            this._onUpdateCallback = null,
            this._onRepeatCallback = null,
            this._onCompleteCallback = null,
            this._onStopCallback = null,
            this._group = n || TWEEN,
            this._id = TWEEN.nextId()
    }
    ,
    TWEEN.Tween.prototype = {
        getId: function () {
            return this._id
        },
        isPlaying: function () {
            return this._isPlaying
        },
        to: function (t, n) {
            return this._valuesEnd = Object.create(t),
                void 0 !== n && (this._duration = n),
                this
        },
        duration: function duration(t) {
            return this._duration = t,
                this
        },
        start: function (t) {
            for (var n in this._group.add(this),
                this._isPlaying = !0,
                this._onStartCallbackFired = !1,
                this._startTime = void 0 !== t ? "string" == typeof t ? TWEEN.now() + parseFloat(t) : t : TWEEN.now(),
                this._startTime += this._delayTime,
                this._valuesEnd) {
                if (this._valuesEnd[n] instanceof Array) {
                    if (0 === this._valuesEnd[n].length)
                        continue;
                    this._valuesEnd[n] = [this._object[n]].concat(this._valuesEnd[n])
                }
                void 0 !== this._object[n] && (this._valuesStart[n] = this._object[n],
                    this._valuesStart[n] instanceof Array == !1 && (this._valuesStart[n] *= 1),
                    this._valuesStartRepeat[n] = this._valuesStart[n] || 0)
            }
            return this
        },
        stop: function () {
            return this._isPlaying ? (this._group.remove(this),
                this._isPlaying = !1,
                null !== this._onStopCallback && this._onStopCallback(this._object),
                this.stopChainedTweens(),
                this) : this
        },
        end: function () {
            return this.update(1 / 0),
                this
        },
        stopChainedTweens: function () {
            for (var t = 0, n = this._chainedTweens.length; t < n; t++)
                this._chainedTweens[t].stop()
        },
        group: function (t) {
            return this._group = t,
                this
        },
        delay: function (t) {
            return this._delayTime = t,
                this
        },
        repeat: function (t) {
            return this._repeat = t,
                this
        },
        repeatDelay: function (t) {
            return this._repeatDelayTime = t,
                this
        },
        yoyo: function (t) {
            return this._yoyo = t,
                this
        },
        easing: function (t) {
            return this._easingFunction = t,
                this
        },
        interpolation: function (t) {
            return this._interpolationFunction = t,
                this
        },
        chain: function () {
            return this._chainedTweens = arguments,
                this
        },
        onStart: function (t) {
            return this._onStartCallback = t,
                this
        },
        onUpdate: function (t) {
            return this._onUpdateCallback = t,
                this
        },
        onRepeat: function onRepeat(t) {
            return this._onRepeatCallback = t,
                this
        },
        onComplete: function (t) {
            return this._onCompleteCallback = t,
                this
        },
        onStop: function (t) {
            return this._onStopCallback = t,
                this
        },
        update: function (t) {
            var n, e, i;
            if (t < this._startTime)
                return !0;
            this.lastTime = t;
            for (n in !1 === this._onStartCallbackFired && (null !== this._onStartCallback && this._onStartCallback(this._object),
                this._onStartCallbackFired = !0),
                e = (t - this._startTime) / this._duration,
                e = 0 === this._duration || e > 1 ? 1 : e,
                i = this._easingFunction(e),
                this._valuesEnd)
                if (void 0 !== this._valuesStart[n]) {
                    var r = this._valuesStart[n] || 0
                        , a = this._valuesEnd[n];
                    a instanceof Array ? this._object[n] = this._interpolationFunction(a, i) : ("string" == typeof a && (a = "+" === a.charAt(0) || "-" === a.charAt(0) ? r + parseFloat(a) : parseFloat(a)),
                        "number" == typeof a && (this._object[n] = r + (a - r) * i))
                }
            if (null !== this._onUpdateCallback && this._onUpdateCallback(this._object, e),
                1 === e) {
                if (this._repeat > 0) {
                    for (n in isFinite(this._repeat) && this._repeat--,
                        this._valuesStartRepeat) {
                        if ("string" == typeof this._valuesEnd[n] && (this._valuesStartRepeat[n] = this._valuesStartRepeat[n] + parseFloat(this._valuesEnd[n])),
                            this._yoyo) {
                            var s = this._valuesStartRepeat[n];
                            this._valuesStartRepeat[n] = this._valuesEnd[n],
                                this._valuesEnd[n] = s
                        }
                        this._valuesStart[n] = this._valuesStartRepeat[n]
                    }
                    return this._yoyo && (this._reversed = !this._reversed),
                        void 0 !== this._repeatDelayTime ? this._startTime = t + this._repeatDelayTime : this._startTime = t + this._delayTime,
                        null !== this._onRepeatCallback && this._onRepeatCallback(this._object),
                        !0
                }
                null !== this._onCompleteCallback && this._onCompleteCallback(this._object);
                for (var o = 0, u = this._chainedTweens.length; o < u; o++)
                    this._chainedTweens[o].start(this._startTime + this._duration);
                return !1
            }
            return !0
        }
    },
    TWEEN.Easing = {
        Linear: {
            None: function (t) {
                return t
            }
        },
        Quadratic: {
            In: function (t) {
                return t * t
            },
            Out: function (t) {
                return t * (2 - t)
            },
            InOut: function (t) {
                return (t *= 2) < 1 ? .5 * t * t : -.5 * (--t * (t - 2) - 1)
            }
        },
        Cubic: {
            In: function (t) {
                return t * t * t
            },
            Out: function (t) {
                return --t * t * t + 1
            },
            InOut: function (t) {
                return (t *= 2) < 1 ? .5 * t * t * t : .5 * ((t -= 2) * t * t + 2)
            }
        },
        Quartic: {
            In: function (t) {
                return t * t * t * t
            },
            Out: function (t) {
                return 1 - --t * t * t * t
            },
            InOut: function (t) {
                return (t *= 2) < 1 ? .5 * t * t * t * t : -.5 * ((t -= 2) * t * t * t - 2)
            }
        },
        Quintic: {
            In: function (t) {
                return t * t * t * t * t
            },
            Out: function (t) {
                return --t * t * t * t * t + 1
            },
            InOut: function (t) {
                return (t *= 2) < 1 ? .5 * t * t * t * t * t : .5 * ((t -= 2) * t * t * t * t + 2)
            }
        },
        Sinusoidal: {
            In: function (t) {
                return 1 - Math.cos(t * Math.PI / 2)
            },
            Out: function (t) {
                return Math.sin(t * Math.PI / 2)
            },
            InOut: function (t) {
                return .5 * (1 - Math.cos(Math.PI * t))
            }
        },
        Exponential: {
            In: function (t) {
                return 0 === t ? 0 : Math.pow(1024, t - 1)
            },
            Out: function (t) {
                return 1 === t ? 1 : 1 - Math.pow(2, -10 * t)
            },
            InOut: function (t) {
                return 0 === t ? 0 : 1 === t ? 1 : (t *= 2) < 1 ? .5 * Math.pow(1024, t - 1) : .5 * (2 - Math.pow(2, -10 * (t - 1)))
            }
        },
        Circular: {
            In: function (t) {
                return 1 - Math.sqrt(1 - t * t)
            },
            Out: function (t) {
                return Math.sqrt(1 - --t * t)
            },
            InOut: function (t) {
                return (t *= 2) < 1 ? -.5 * (Math.sqrt(1 - t * t) - 1) : .5 * (Math.sqrt(1 - (t -= 2) * t) + 1)
            }
        },
        Elastic: {
            In: function (t) {
                return 0 === t ? 0 : 1 === t ? 1 : -Math.pow(2, 10 * (t - 1)) * Math.sin(5 * (t - 1.1) * Math.PI)
            },
            Out: function (t) {
                return 0 === t ? 0 : 1 === t ? 1 : Math.pow(2, -10 * t) * Math.sin(5 * (t - .1) * Math.PI) + 1
            },
            InOut: function (t) {
                return 0 === t ? 0 : 1 === t ? 1 : (t *= 2) < 1 ? -.5 * Math.pow(2, 10 * (t - 1)) * Math.sin(5 * (t - 1.1) * Math.PI) : .5 * Math.pow(2, -10 * (t - 1)) * Math.sin(5 * (t - 1.1) * Math.PI) + 1
            }
        },
        Back: {
            In: function (t) {
                return t * t * (2.70158 * t - 1.70158)
            },
            Out: function (t) {
                return --t * t * (2.70158 * t + 1.70158) + 1
            },
            InOut: function (t) {
                var n = 2.5949095;
                return (t *= 2) < 1 ? t * t * ((n + 1) * t - n) * .5 : .5 * ((t -= 2) * t * ((n + 1) * t + n) + 2)
            }
        },
        Bounce: {
            In: function (t) {
                return 1 - TWEEN.Easing.Bounce.Out(1 - t)
            },
            Out: function (t) {
                return t < 1 / 2.75 ? 7.5625 * t * t : t < 2 / 2.75 ? 7.5625 * (t -= 1.5 / 2.75) * t + .75 : t < 2.5 / 2.75 ? 7.5625 * (t -= 2.25 / 2.75) * t + .9375 : 7.5625 * (t -= 2.625 / 2.75) * t + .984375
            },
            InOut: function (t) {
                return t < .5 ? .5 * TWEEN.Easing.Bounce.In(2 * t) : .5 * TWEEN.Easing.Bounce.Out(2 * t - 1) + .5
            }
        }
    },
    TWEEN.Interpolation = {
        Linear: function (t, n) {
            var e = t.length - 1
                , i = e * n
                , r = Math.floor(i)
                , a = TWEEN.Interpolation.Utils.Linear;
            return n < 0 ? a(t[0], t[1], i) : n > 1 ? a(t[e], t[e - 1], e - i) : a(t[r], t[r + 1 > e ? e : r + 1], i - r)
        },
        Bezier: function (t, n) {
            for (var e = 0, i = t.length - 1, r = Math.pow, a = TWEEN.Interpolation.Utils.Bernstein, s = 0; s <= i; s++)
                e += r(1 - n, i - s) * r(n, s) * t[s] * a(i, s);
            return e
        },
        CatmullRom: function (t, n) {
            var e = t.length - 1
                , i = e * n
                , r = Math.floor(i)
                , a = TWEEN.Interpolation.Utils.CatmullRom;
            return t[0] === t[e] ? (n < 0 && (r = Math.floor(i = e * (1 + n))),
                a(t[(r - 1 + e) % e], t[r], t[(r + 1) % e], t[(r + 2) % e], i - r)) : n < 0 ? t[0] - (a(t[0], t[0], t[1], t[1], -i) - t[0]) : n > 1 ? t[e] - (a(t[e], t[e], t[e - 1], t[e - 1], i - e) - t[e]) : a(t[r ? r - 1 : 0], t[r], t[e < r + 1 ? e : r + 1], t[e < r + 2 ? e : r + 2], i - r)
        },
        Utils: {
            Linear: function (t, n, e) {
                return (n - t) * e + t
            },
            Bernstein: function (t, n) {
                var e = TWEEN.Interpolation.Utils.Factorial;
                return e(t) / e(n) / e(t - n)
            },
            Factorial: function () {
                var t = [1];
                return function (n) {
                    var e = 1;
                    if (t[n])
                        return t[n];
                    for (var i = n; i > 1; i--)
                        e *= i;
                    return t[n] = e,
                        e
                }
            }(),
            CatmullRom: function (t, n, e, i, r) {
                var a = .5 * (e - t)
                    , s = .5 * (i - n)
                    , o = r * r;
                return (2 * n - 2 * e + a + s) * (r * o) + (-3 * n + 3 * e - 2 * a - s) * o + a * r + n
            }
        }
    },
    function (t) {
        "function" == typeof define && define.amd ? define([], function () {
            return TWEEN
        }) : "undefined" != typeof module && "object" == typeof exports ? module.exports = TWEEN : void 0 !== t && (t.TWEEN = TWEEN)
    }(this);
document.addEventListener("contextmenu", function (e) {
    e.preventDefault()
});
var AddToScore = pc.createScript("addToScore");
AddToScore.attributes.add("bird", {
    type: "entity"
}),
    AddToScore.prototype.initialize = function () {
        this.lastX = this.entity.getPosition().x
    }
    ,
    AddToScore.prototype.update = function (t) {
        var i = this.app
            , o = this.bird.getPosition().x
            , e = this.entity.getPosition().x;
        e <= o && this.lastX > o && i.fire("game:addscore"),
            this.lastX = e
    }
    ;
function storageAvailable(e) {
    try {
        var t = window[e]
            , o = "__storage_test__";
        return t.setItem(o, o),
            t.removeItem(o),
            !0
    } catch (e) {
        return !1
    }
}
var Game = pc.createScript("game");
Game.prototype.initialize = function () {
    var e = this.app;
    this.score = 0,
        this.bestScore = 0,
        storageAvailable("localStorage") && (this.bestScore = localStorage.getItem("Flappy Bird Best Score"),
            null === this.bestScore && (this.bestScore = 0)),
        e.on("game:menu", function () {
            e.fire("flash:black"),
                setTimeout(function () {
                    e.root.findByName("Game Over Screen").enabled = !1,
                        e.root.findByName("Menu Screen").enabled = !0,
                        e.root.findByName("Game").findByName("Bird").enabled = !1,
                        e.fire("pipes:reset"),
                        e.fire("ground:start")
                }, 250)
        }, this),
        e.on("game:getready", function () {
            e.fire("flash:black"),
                setTimeout(function () {
                    e.root.findByName("Menu Screen").enabled = !1,
                        e.root.findByName("Game Screen").enabled = !0,
                        this.score = 0,
                        e.fire("ui:score", this.score),
                        e.root.findByName("Get Ready").sprite.enabled = !0,
                        e.root.findByName("Tap").sprite.enabled = !0,
                        e.root.findByName("Game").findByName("Bird").enabled = !0
                }
                    .bind(this), 250)
        }, this),
        e.on("game:play", function () {
            e.fire("pipes:start"),
                e.fire("ui:fadegetready")
        }, this),
        e.on("game:pause", function () {
            e.root.findByName("Pause Button").enabled = !1,
                e.root.findByName("Play Button").enabled = !0
        }, this),
        e.on("game:unpause", function () {
            e.root.findByName("Play Button").enabled = !1,
                e.root.findByName("Pause Button").enabled = !0
        }, this),
        e.on("game:gameover", function () {
            e.root.findByName("Game Screen").enabled = !1,
                e.root.findByName("Game Over Screen").enabled = !0,
                e.fire("pipes:stop"),
                e.fire("ground:stop"),
                e.fire("ui:fadeingameover"),
                e.fire("ui:showscoreboard", this.score, this.bestScore),
                this.score > this.bestScore && (this.bestScore = this.score,
                    storageAvailable("localStorage") && localStorage.setItem("Flappy Bird Best Score", this.score.toString())),
                setTimeout(function () {
                    e.fire("game:audio", "Swoosh")
                }, 500)
        }, this),
        e.on("game:addscore", function () {
            this.score++,
                e.fire("ui:score", this.score),
                e.fire("game:audio", "Point")
        }, this),
        e.on("game:share", function () {
            var e = screen.width / 2 - 320
                , t = screen.height / 2 - 190
                , o = "https://twitter.com/intent/tweet?text=" + encodeURIComponent("I scored " + this.score + " in Flappy Bird! Beat that! http://flappybird.playcanvas.com/ Powered by @playcanvas #webgl #html5")
                , a = window.open(o, "name", "toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=640, height=380, top=" + t + ", left=" + e);
            window.focus && a && a.focus()
        }, this),
        e.on("game:audio", function (e) {
            this.entity.sound.play(e)
        }, this)
}
    ,
    Game.prototype.update = function (e) {
        TWEEN.update()
    }
    ;
var Button = pc.createScript("button");
Button.attributes.add("diplacement", {
    type: "number",
    default: .00390625
}),
    Button.attributes.add("event", {
        type: "string"
    }),
    Button.prototype.initialize = function () {
        var t = this.app;
        this.pressed = !1,
            this.min = new pc.Vec3,
            this.max = new pc.Vec3,
            t.on("ui:press", function (t, e, s) {
                s.processed || this.press(t, e, s)
            }, this),
            t.on("ui:release", function (t, e) {
                this.release()
            }, this),
            this.on("enable", function () {
                t.on("ui:press", function (t, e, s) {
                    s.processed || this.press(t, e, s)
                }, this),
                    t.on("ui:release", function (t, e) {
                        this.release()
                    }, this)
            }),
            this.on("disable", function () {
                t.off("ui:press"),
                    t.off("ui:release"),
                    this.pressed = !1
            })
    }
    ,
    Button.prototype.checkForClick = function (t, e) {
        var s = this.app.root.findByName("Camera")
            , i = this.entity.sprite._meshInstance.aabb;
        return s.camera.worldToScreen(i.getMin(), this.min),
            s.camera.worldToScreen(i.getMax(), this.max),
            t >= this.min.x && t <= this.max.x && e >= this.max.y && e <= this.min.y
    }
    ,
    Button.prototype.press = function (t, e, s) {
        this.checkForClick(t, e) && (this.pressed = !0,
            this.entity.translate(0, -this.diplacement, 0),
            s.processed = !0)
    }
    ,
    Button.prototype.release = function () {
        var t = this.app;
        this.pressed && (this.pressed = !1,
            this.entity.translate(0, this.diplacement, 0),
            t.fire(this.event),
            t.fire("game:audio", "Swoosh"))
    }
    ;
var Sparkle = pc.createScript("sparkle");
Sparkle.attributes.add("radius", {
    type: "number",
    default: 1
}),
    Sparkle.prototype.initialize = function () {
        this.initialPos = this.entity.getLocalPosition().clone(),
            this.entity.sprite.on("loop", function () {
                var t = Math.random() * Math.PI * 2
                    , i = Math.random() * this.radius
                    , a = Math.cos(t) * i
                    , s = Math.sin(t) * i;
                this.entity.setLocalPosition(this.initialPos.x + a, this.initialPos.y + s, this.initialPos.z)
            }, this)
    }
    ;
var Tweener = pc.createScript("tweener");
Tweener.attributes.add("event", {
    title: "Event",
    type: "string"
}),
    Tweener.attributes.add("duration", {
        title: "Duration",
        type: "number",
        default: 1e3
    }),
    Tweener.attributes.add("easingFunction", {
        title: "Easing Function",
        type: "number",
        enum: [{
            Linear: 0
        }, {
            Quadratic: 1
        }, {
            Cubic: 2
        }, {
            Quartic: 3
        }, {
            Quintic: 4
        }, {
            Sinusoidal: 5
        }, {
            Exponential: 6
        }, {
            Circular: 7
        }, {
            Elastic: 8
        }, {
            Back: 9
        }, {
            Bounce: 10
        }]
    }),
    Tweener.attributes.add("easingType", {
        title: "Easing Type",
        type: "number",
        enum: [{
            In: 0
        }, {
            Out: 1
        }, {
            InOut: 2
        }]
    }),
    Tweener.attributes.add("delay", {
        title: "Delay",
        type: "number",
        default: 0
    }),
    Tweener.attributes.add("repeat", {
        title: "Repeat",
        type: "number",
        default: 0
    }),
    Tweener.attributes.add("repeatDelay", {
        title: "Repeat Delay",
        type: "number",
        default: 0
    }),
    Tweener.attributes.add("yoyo", {
        title: "Yoyo",
        type: "boolean",
        default: !1
    }),
    Tweener.attributes.add("startPos", {
        title: "Start Pos",
        type: "vec3",
        default: [0, 0, 0]
    }),
    Tweener.attributes.add("endPos", {
        title: "End Pos",
        type: "vec3",
        default: [0, 0, 0]
    }),
    Tweener.attributes.add("startScale", {
        title: "Start Scale",
        type: "vec3",
        default: [1, 1, 1]
    }),
    Tweener.attributes.add("endScale", {
        title: "End Scale",
        type: "vec3",
        default: [1, 1, 1]
    }),
    Tweener.attributes.add("startEvent", {
        title: "Start Event",
        type: "string"
    }),
    Tweener.attributes.add("stopEvent", {
        title: "Stop Event",
        type: "string"
    }),
    Tweener.attributes.add("updateEvent", {
        title: "Update Event",
        type: "string"
    }),
    Tweener.attributes.add("completeEvent", {
        title: "Complete Event",
        type: "string"
    }),
    Tweener.attributes.add("repeatEvent", {
        title: "Repeat Event",
        type: "string"
    }),
    Tweener.prototype.initialize = function () {
        var t = this.app;
        this.initialPos = this.entity.getPosition().clone(),
            this.initialScl = this.entity.getLocalScale().clone(),
            this.tween = null,
            t.on(this.event, function () {
                this.start()
            }, this),
            this.on("enable", function () {
                this.entity.setPosition(this.initialPos),
                    this.entity.setLocalScale(this.initialScl)
            }),
            this.on("attr", function (t, e, i) {
                this.start()
            })
    }
    ,
    Tweener.prototype.start = function () {
        var t, e = this.app, i = ["Linear", "Quadratic", "Cubic", "Quartic", "Quintic", "Sinusoidal", "Exponential", "Circular", "Elastic", "Back", "Bounce"];
        t = 0 === this.easingFunction ? TWEEN.Easing[i[this.easingFunction]].None : TWEEN.Easing[i[this.easingFunction]][["In", "Out", "InOut"][this.easingType]],
            this.tween && this.tween.stop();
        var n = {
            px: this.startPos.x,
            py: this.startPos.y,
            pz: this.startPos.z,
            sx: this.startScale.x,
            sy: this.startScale.y,
            sz: this.startScale.z
        }
            , a = {
                px: this.endPos.x,
                py: this.endPos.y,
                pz: this.endPos.z,
                sx: this.endScale.x,
                sy: this.endScale.y,
                sz: this.endScale.z
            }
            , s = this.entity;
        this.tween = new TWEEN.Tween(n).to(a, this.duration).easing(t).onStart(function (t) {
            "" !== this.startEvent && e.fire(this.startEvent)
        }
            .bind(this)).onStop(function (t) {
                "" !== this.stopEvent && e.fire(this.stopEvent)
            }
                .bind(this)).onUpdate(function (t) {
                    s.setPosition(t.px, t.py, t.pz),
                        s.setLocalScale(t.sx, t.sy, t.sz),
                        "" !== this.updateEvent && e.fire(this.updateEvent)
                }
                    .bind(this)).onComplete(function (t) {
                        "" !== this.completeEvent && e.fire(this.completeEvent)
                    }
                        .bind(this)).onRepeat(function (t) {
                            "" !== this.repeatEvent && e.fire(this.repeatEvent)
                        }
                            .bind(this)).repeat(this.repeat).repeatDelay(this.repeatDelay).yoyo(this.yoyo).delay(this.delay).start()
    }
    ;
var Bird = pc.createScript("bird");
Bird.attributes.add("flapVelocity", {
    type: "number",
    default: 1
}),
    Bird.attributes.add("gravity", {
        type: "number",
        default: 5
    }),
    Bird.attributes.add("lowestHeight", {
        type: "number",
        default: -.25
    }),
    Bird.attributes.add("radius", {
        type: "number",
        default: .068
    }),
    Bird.prototype.initialize = function () {
        var t = this.app;
        this.velocity = 0,
            this.state = "getready",
            this.paused = !1,
            this.circle = {
                x: 0,
                y: 0,
                r: 0
            },
            this.rect = {
                x: 0,
                y: 0,
                w: 0,
                h: 0
            },
            this.initialPos = this.entity.getPosition().clone(),
            this.initialRot = this.entity.getRotation().clone(),
            this.pipes = t.root.findByTag("pipe"),
            t.on("game:pause", function () {
                this.paused = !0,
                    this.entity.sprite.speed = 0
            }, this),
            t.on("game:unpause", function () {
                this.paused = !1,
                    this.entity.sprite.speed = 1
            }, this),
            t.on("game:press", function (t, i) {
                this.flap()
            }, this),
            this.on("enable", function () {
                t.on("game:press", function (t, i) {
                    this.flap()
                }, this),
                    this.reset()
            }),
            this.on("disable", function () {
                t.off("game:press")
            }),
            this.reset()
    }
    ,
    Bird.prototype.reset = function () {
        this.app;
        this.velocity = 0,
            this.state = "getready",
            this.entity.setPosition(this.initialPos),
            this.entity.setRotation(this.initialRot),
            this.entity.sprite.speed = 1
    }
    ,
    Bird.prototype.flap = function () {
        var t = this.app;
        this.paused || ("getready" === this.state && (t.fire("game:play"),
            this.state = "play",
            this.entity.sprite.speed = 2),
            "play" === this.state && (t.fire("game:audio", "Flap"),
                this.velocity = this.flapVelocity))
    }
    ,
    Bird.prototype.die = function (t) {
        var i = this.app;
        this.state = "dead",
            this.entity.sprite.speed = 0,
            i.fire("game:audio", "Hit"),
            i.fire("flash:white"),
            i.fire("game:gameover"),
            t && setTimeout(function () {
                i.fire("game:audio", "Die")
            }, 500)
    }
    ,
    Bird.prototype.circleRectangleIntersect = function (t, i) {
        var e = t.x
            , s = t.y
            , a = t.r
            , r = i.x
            , h = i.y
            , n = i.w
            , o = i.h
            , p = Math.abs(e - r - n / 2)
            , d = Math.abs(s - h - o / 2);
        if (p > n / 2 + a)
            return !1;
        if (d > o / 2 + a)
            return !1;
        if (p <= n / 2)
            return !0;
        if (d <= o / 2)
            return !0;
        var y = p - n / 2
            , l = d - o / 2;
        return y * y + l * l <= a * a
    }
    ,
    Bird.prototype.update = function (t) {
        var i = this.app;
        if (!this.paused) {
            var e = "play" === this.state
                , s = "dead" === this.state;
            e && i.keyboard.wasPressed(pc.KEY_SPACE) && this.flap();
            var a = this.entity.getPosition()
                , r = a.y;
            if ((e || s) && a.y >= this.lowestHeight) {
                this.velocity -= this.gravity * t,
                    (r += this.velocity * t) < this.lowestHeight && (r = this.lowestHeight),
                    this.entity.setPosition(a.x, r, 0);
                var h = pc.math.clamp(this.velocity, -2, -.75);
                h += 1,
                    this.entity.setLocalEulerAngles(0, 0, 90 * h)
            }
            if (e) {
                r <= this.lowestHeight && this.die(!1);
                var n = this.rect
                    , o = this.circle;
                o.x = a.x,
                    o.y = a.y,
                    o.r = this.radius;
                for (var p = 0; p < this.pipes.length; p++) {
                    var d = this.pipes[p]
                        , y = d.sprite._meshInstance.aabb
                        , l = y.getMin()
                        , u = y.getMax();
                    n.x = l.x,
                        n.y = l.y,
                        n.w = u.x - l.x,
                        n.h = "Pipe Top" === d.name ? 1e3 : u.y - l.y,
                        this.circleRectangleIntersect(o, n) && this.die(!0)
                }
            }
        }
    }
    ;
var CameraAspect = pc.createScript("cameraAspect");
CameraAspect.prototype.initialize = function () {
    this.currentOrthoHeight = this.entity.camera.orthoHeight
}
    ,
    CameraAspect.prototype.update = function (t) {
        var e = this.app.graphicsDevice.canvas
            , i = e.width / e.height
            , r = pc.math.clamp(.72 / i, 1, 1.28);
        r !== this.currentOrthoHeight && (this.entity.camera.orthoHeight = r,
            this.currentOrthoHeight = r)
    }
    ;
var Score = pc.createScript("score");
Score.attributes.add("name", {
    type: "string",
    default: "score"
}),
    Score.attributes.add("display", {
        type: "entity",
        array: !0
    }),
    Score.attributes.add("numbers", {
        type: "asset",
        assetType: "sprite",
        array: !0
    }),
    Score.prototype.initialize = function () {
        var t = this.app
            , e = [];
        t.on("ui:" + this.name, function (t) {
            for (!function (t, e) {
                var r = t.toString();
                e.length = 0;
                for (var a = 0, i = r.length; a < i; a++)
                    e.push(+r.charAt(a))
            }(t, e); e.length < this.display.length;)
                e.unshift(-1);
            var r = this.numbers;
            this.display.forEach(function (t, a) {
                var i = e[a];
                t.enabled = -1 !== i,
                    -1 !== i && (t.sprite.sprite = r[i].resource)
            })
        }, this)
    }
    ;
let savedPosition = 0;
var PipeHeight = pc.createScript("pipeHeight");
PipeHeight.prototype.initialize = function () {
    var i = this.app;
    this.pipe1 = i.root.findByName("Pipe 1");
    this.pipe2 = i.root.findByName("Pipe 2");
    this.pipe3 = i.root.findByName("Pipe 3");
    this.heights = [];
    i.on("pipes:start", function () {
        savedPosition = 0;
        Scroll.mult = 1;
        this.heights = [];
        // Mid, Low, High
        this.heights.push(0.1);
        this.heights.push(-0.2);
        this.heights.push(0.5);
        this.setPipeHeights();
        parent.postMessage("start", "*");
    }, this)

    i.on("pipes:cycle", function () {
        this.heights.shift();
        this.heights.push(.75 * (Math.random() - .5));
        this.setPipeHeights();
    }, this)

}
    ,
    PipeHeight.prototype.setPipeHeights = function () {
        savedPosition += this.pipe1.getLocalPosition().x;
        //console.log(savedPosition);
        var i;
        i = this.pipe1.getLocalPosition(),
            this.pipe1.setLocalPosition(i.x, this.heights[0], i.z),
            i = this.pipe2.getLocalPosition(),
            this.pipe2.setLocalPosition(i.x, this.heights[1], i.z),
            i = this.pipe3.getLocalPosition(),
            this.pipe3.setLocalPosition(i.x, this.heights[2], i.z)
    }
    ;
var Sine = pc.createScript("sine");
Sine.attributes.add("amplitudeScale", {
    type: "number",
    default: 1
}),
    Sine.attributes.add("frequencyScale", {
        type: "number",
        default: 1
    }),
    Sine.prototype.initialize = function () {
        this.timer = 0
    }
    ,
    Sine.prototype.update = function (t) {
        t *= this.frequencyScale,
            this.timer += t,
            this.entity.setLocalPosition(0, Math.sin(this.timer) * this.amplitudeScale, 0)
    }
    ;
var Scroll = pc.createScript("scroll");
Scroll.mult = 1;
Scroll.attributes.add("startEvent", {
    type: "string",
    default: "start"
}),
    Scroll.attributes.add("stopEvent", {
        type: "string",
        default: "stop"
    }),
    Scroll.attributes.add("resetEvent", {
        type: "string",
        default: "reset"
    }),
    Scroll.attributes.add("cycleEvent", {
        type: "string",
        default: "cycle"
    }),
    Scroll.attributes.add("startX", {
        type: "number",
        default: 1
    }),
    Scroll.attributes.add("endX", {
        type: "number",
        default: -1
    }),
    Scroll.attributes.add("speed", {
        type: "number",
        default: 1
    }),
    Scroll.attributes.add("frozen", {
        type: "boolean",
        default: !1
    }),
    Scroll.prototype.initialize = function () {
        var t = this.app;
        this.paused = !1,
            this.initialPos = this.entity.getPosition().clone(),
            this.initialRot = this.entity.getRotation().clone(),
            t.on(this.resetEvent, function () {
                this.entity.setPosition(this.initialPos),
                    this.entity.setRotation(this.initialRot)
            }, this),
            t.on(this.startEvent, function () {
                this.frozen = !1
                if (this.entity.name === "Pipes") parent.postMessage({ type: "update", paused: this.frozen || this.paused }, "*");
            }, this),
            t.on(this.stopEvent, function () {
                this.frozen = !0;
                if (this.entity.name === "Pipes") parent.postMessage({ type: "update", paused: this.frozen || this.paused }, "*");
            }, this),
            t.on("game:pause", function () {
                this.paused = !0
                if (this.entity.name === "Pipes") parent.postMessage({ type: "update", paused: this.frozen || this.paused }, "*");
            }, this),
            t.on("game:unpause", function () {
                this.paused = !1
                if (this.entity.name === "Pipes") parent.postMessage({ type: "update", paused: this.frozen || this.paused }, "*");
            }, this)
    }
    ,
    Scroll.prototype.update = function (t) {
        var e = this.app;
        // Limit to 60 FPS to make it easier
        while (TWEEN.now() - this.lastTime < 16) { }
        this.lastTime = TWEEN.now();
        if (this.entity.name === "Pipes") {
            const totalPosition = savedPosition + this.entity.getLocalPosition().x;
            if (totalPosition < -1.4) {
                parent.postMessage("trigger", "*");
                savedPosition = Infinity;
            }

            //console.log(this.frozen, this.paused);
        }
        Scroll.mult += 0.0002;
        this.frozen || this.paused || (this.entity.translateLocal(this.speed * Scroll.mult, 0, 0),
            this.entity.getLocalPosition().x < this.endX && (this.entity.translateLocal(this.startX - this.endX, 0, 0),
                e.fire(this.cycleEvent)))
    }
    ;
var Fade = pc.createScript("fade");
Fade.attributes.add("event", {
    type: "string"
}),
    Fade.attributes.add("type", {
        type: "number",
        enum: [{
            In: 0
        }, {
            Out: 1
        }, {
            InOut: 2
        }]
    }),
    Fade.attributes.add("duration", {
        type: "number",
        default: 1e3
    }),
    Fade.attributes.add("delay", {
        type: "number",
        default: 0
    }),
    Fade.prototype.initialize = function () {
        this.app.on(this.event, function () {
            var t = this.type
                , e = this.entity.sprite;
            e.opacity = 1 === t ? 1 : 0;
            var a = this.duration;
            2 === t && (a *= .5);
            new TWEEN.Tween(e).to({
                opacity: 1 === t ? 0 : 1
            }, a).onStart(function () {
                e.enabled = !0
            }).onComplete(function () {
                e.enabled = 0 === t
            }).repeat(2 === t ? 1 : 0).yoyo(2 === t).delay(this.delay).start()
        }, this),
            this.on("enable", function () {
                var t = this.type
                    , e = this.entity.sprite;
                e.enabled = 1 === t,
                    e.opacity = 1 === t ? 1 : 0
            })
    }
    ;
var Scoreboard = pc.createScript("scoreboard");
Scoreboard.prototype.initialize = function () {
    var e = this.app
        , r = e.assets;
    this.score = {},
        this.score.current = 0,
        this.score.best = 0,
        e.on("ui:showscoreboard", function (t, i) {
            e.root.findByName("OK Button").enabled = !1,
                e.root.findByName("Share Button").enabled = !1,
                this.score.current = 0,
                this.score.best = i,
                e.fire("ui:current", 0),
                e.fire("ui:best", i);
            var n = this.entity.findByName("Medal");
            n.enabled = !1;
            var o = this.entity.findByName("New");
            o.enabled = !1;
            new TWEEN.Tween(this.score).to({
                current: t
            }, 500).onUpdate(function (r) {
                var t = Math.round(r.current);
                e.fire("ui:current", t),
                    t > i && e.fire("ui:best", t)
            }).onComplete(function () {
                t >= 40 ? n.sprite.sprite = r.find("Medal Platinum", "sprite").resource : t >= 30 ? n.sprite.sprite = r.find("Medal Gold", "sprite").resource : t >= 20 ? n.sprite.sprite = r.find("Medal Silver", "sprite").resource : t >= 10 && (n.sprite.sprite = r.find("Medal Bronze", "sprite").resource),
                    n.enabled = t >= 10,
                    t > i && (o.enabled = !0),
                    e.root.findByName("OK Button").enabled = !0,
                    e.root.findByName("Share Button").enabled = !0
            }).delay(1750).start()
        }, this)
}
    ;
var Input = pc.createScript("input");
Input.prototype.initialize = function () {
    var e = this.app
        , n = function (n, t) {
            var i = {
                processed: !1
            };
            e.fire("ui:press", n, t, i),
                i.processed || e.fire("game:press", n, t)
        }
        , t = function (n) {
            e.fire("ui:release")
        };
    window.addEventListener("mousedown", function (e) {
        e.preventDefault(),
            n(e.clientX, e.clientY)
    }, {
        passive: !1
    }),
        window.addEventListener("mouseup", t, {
            passive: !1
        }),
        window.addEventListener("touchstart", function (e) {
            e.preventDefault();
            var t = e.changedTouches[0];
            n(t.clientX, t.clientY)
        }, {
            passive: !1
        }),
        window.addEventListener("touchend", t, {
            passive: !1
        })
}
    ;
