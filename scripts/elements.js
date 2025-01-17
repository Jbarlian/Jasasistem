!function() {
    function e() {
        document.body.removeAttribute("unresolved")
    }
    window.WebComponents ? addEventListener("WebComponentsReady", e) : "interactive" === document.readyState || "complete" === document.readyState ? e() : addEventListener("DOMContentLoaded", e)
}(), window.Polymer = {
    Settings: function() {
        for (var e, t = window.Polymer || {}, i = location.search.slice(1).split("&"), n = 0; n < i.length && (e = i[n]); n++)
            (e = e.split("="))[0] && (t[e[0]] = e[1] || !0);
        return t.wantShadow = "shadow" === t.dom, t.hasShadow = Boolean(Element.prototype.createShadowRoot), t.nativeShadow = t.hasShadow && !window.ShadowDOMPolyfill, t.useShadow = t.wantShadow && t.hasShadow, t.hasNativeImports = Boolean("import" in document.createElement("link")), t.useNativeImports = t.hasNativeImports, t.useNativeCustomElements = !window.CustomElements || window.CustomElements.useNative, t.useNativeShadow = t.useShadow && t.nativeShadow, t.usePolyfillProto = !t.useNativeCustomElements && !Object.__proto__, t
    }()
}, function() {
    var e = window.Polymer;
    window.Polymer = function(e) {
        "function" == typeof e && (e = e.prototype), e || (e = {});
        var i = t(e),
            n = {
                prototype: e = i.prototype
            };
        return e.extends && (n.extends = e.extends), Polymer.telemetry._registrate(e), document.registerElement(e.is, n), i
    };
    var t = function(e) {
        var t = Polymer.Base;
        return e.extends && (t = Polymer.Base._getExtendedPrototype(e.extends)), (e = Polymer.Base.chainObject(e, t)).registerCallback(), e.constructor
    };
    if (e)
        for (var i in e)
            Polymer[i] = e[i];
    Polymer.Class = t
}(), Polymer.telemetry = {
    registrations: [],
    _regLog: function(e) {},
    _registrate: function(e) {
        this.registrations.push(e), Polymer.log && this._regLog(e)
    },
    dumpRegistrations: function() {
        this.registrations.forEach(this._regLog)
    }
}, Object.defineProperty(window, "currentImport", {
    enumerable: !0,
    configurable: !0,
    get: function() {
        return (document._currentScript || document.currentScript).ownerDocument
    }
}), Polymer.RenderStatus = {
    _ready: !1,
    _callbacks: [],
    whenReady: function(e) {
        this._ready ? e() : this._callbacks.push(e)
    },
    _makeReady: function() {
        this._ready = !0;
        for (var e = 0; e < this._callbacks.length; e++)
            this._callbacks[e]();
        this._callbacks = []
    },
    _catchFirstRender: function() {
        requestAnimationFrame(function() {
            Polymer.RenderStatus._makeReady()
        })
    },
    _afterNextRenderQueue: [],
    _waitingNextRender: !1,
    afterNextRender: function(e, t, i) {
        this._watchNextRender(), this._afterNextRenderQueue.push([e, t, i])
    },
    _watchNextRender: function() {
        if (!this._waitingNextRender) {
            this._waitingNextRender = !0;
            var e = function() {
                Polymer.RenderStatus._flushNextRender()
            };
            this._ready ? requestAnimationFrame(e) : this.whenReady(e)
        }
    },
    _flushNextRender: function() {
        var e = this;
        setTimeout(function() {
            e._flushRenderCallbacks(e._afterNextRenderQueue), e._afterNextRenderQueue = [], e._waitingNextRender = !1
        })
    },
    _flushRenderCallbacks: function(e) {
        for (var t, i = 0; i < e.length; i++)
            (t = e[i])[1].apply(t[0], t[2] || Polymer.nar)
    }
}, window.HTMLImports ? HTMLImports.whenReady(function() {
    Polymer.RenderStatus._catchFirstRender()
}) : Polymer.RenderStatus._catchFirstRender(), Polymer.ImportStatus = Polymer.RenderStatus, Polymer.ImportStatus.whenLoaded = Polymer.ImportStatus.whenReady, function() {
    "use strict";
    var e = Polymer.Settings;
    Polymer.Base = {
        __isPolymerInstance__: !0,
        _addFeature: function(e) {
            this.extend(this, e)
        },
        registerCallback: function() {
            this._desugarBehaviors(), this._doBehavior("beforeRegister"), this._registerFeatures(), e.lazyRegister || this.ensureRegisterFinished()
        },
        createdCallback: function() {
            this.__hasRegisterFinished || this._ensureRegisterFinished(this.__proto__), Polymer.telemetry.instanceCount++, this.root = this, this._doBehavior("created"), this._initFeatures()
        },
        ensureRegisterFinished: function() {
            this._ensureRegisterFinished(this)
        },
        _ensureRegisterFinished: function(t) {
            t.__hasRegisterFinished !== t.is && (t.__hasRegisterFinished = t.is, t._finishRegisterFeatures && t._finishRegisterFeatures(), t._doBehavior("registered"), e.usePolyfillProto && t !== this && t.extend(this, t))
        },
        attachedCallback: function() {
            var e = this;
            Polymer.RenderStatus.whenReady(function() {
                e.isAttached = !0, e._doBehavior("attached")
            })
        },
        detachedCallback: function() {
            var e = this;
            Polymer.RenderStatus.whenReady(function() {
                e.isAttached = !1, e._doBehavior("detached")
            })
        },
        attributeChangedCallback: function(e, t, i) {
            this._attributeChangedImpl(e), this._doBehavior("attributeChanged", [e, t, i])
        },
        _attributeChangedImpl: function(e) {
            this._setAttributeToProperty(this, e)
        },
        extend: function(e, t) {
            if (e && t)
                for (var i, n = Object.getOwnPropertyNames(t), r = 0; r < n.length && (i = n[r]); r++)
                    this.copyOwnProperty(i, t, e);
            return e || t
        },
        mixin: function(e, t) {
            for (var i in t)
                e[i] = t[i];
            return e
        },
        copyOwnProperty: function(e, t, i) {
            var n = Object.getOwnPropertyDescriptor(t, e);
            n && Object.defineProperty(i, e, n)
        },
        _logger: function(e, t) {
            1 === t.length && Array.isArray(t[0]) && (t = t[0])
        },
        _log: function() {
            var e = Array.prototype.slice.call(arguments, 0);
            this._logger("log", e)
        },
        _warn: function() {
            var e = Array.prototype.slice.call(arguments, 0);
            this._logger("warn", e)
        },
        _error: function() {
            var e = Array.prototype.slice.call(arguments, 0);
            this._logger("error", e)
        },
        _logf: function() {
            return this._logPrefix.concat(this.is).concat(Array.prototype.slice.call(arguments, 0))
        }
    }, Polymer.Base._logPrefix = window.chrome && !/edge/i.test(navigator.userAgent) || /firefox/i.test(navigator.userAgent) ? ["%c[%s::%s]:", "font-weight: bold; background-color:#EEEE00;"] : ["[%s::%s]:"], Polymer.Base.chainObject = function(e, t) {
        return e && t && e !== t && (Object.__proto__ || (e = Polymer.Base.extend(Object.create(t), e)), e.__proto__ = t), e
    }, Polymer.Base = Polymer.Base.chainObject(Polymer.Base, HTMLElement.prototype), window.CustomElements ? Polymer.instanceof = CustomElements.instanceof : Polymer.instanceof = function(e, t) {
        return e instanceof t
    }, Polymer.isInstance = function(e) {
        return Boolean(e && e.__isPolymerInstance__)
    }, Polymer.telemetry.instanceCount = 0
}(), function() {
    var e = {},
        t = {},
        i = function(i) {
            return e[i] || t[i.toLowerCase()]
        },
        n = function() {
            return document.createElement("dom-module")
        };
    n.prototype = Object.create(HTMLElement.prototype), Polymer.Base.extend(n.prototype, {
        constructor: n,
        createdCallback: function() {
            this.register()
        },
        register: function(i) {
            (i = i || this.id || this.getAttribute("name") || this.getAttribute("is")) && (this.id = i, e[i] = this, t[i.toLowerCase()] = this)
        },
        import: function(e, t) {
            if (e) {
                var n = i(e);
                return n || (function() {
                    if (r)
                        for (var e, t = document._currentScript || document.currentScript, i = (t && t.ownerDocument || document).querySelectorAll("dom-module"), n = i.length - 1; n >= 0 && (e = i[n]); n--) {
                            if (e.__upgraded__)
                                return;
                            CustomElements.upgrade(e)
                        }
                }(), n = i(e)), n && t && (n = n.querySelector(t)), n
            }
        }
    });
    var r = window.CustomElements && !CustomElements.useNative;
    document.registerElement("dom-module", n)
}(), Polymer.Base._addFeature({
    _prepIs: function() {
        if (!this.is) {
            var e = (document._currentScript || document.currentScript).parentNode;
            if ("dom-module" === e.localName) {
                var t = e.id || e.getAttribute("name") || e.getAttribute("is");
                this.is = t
            }
        }
        this.is && (this.is = this.is.toLowerCase())
    }
}), Polymer.Base._addFeature({
    behaviors: [],
    _desugarBehaviors: function() {
        this.behaviors.length && (this.behaviors = this._desugarSomeBehaviors(this.behaviors))
    },
    _desugarSomeBehaviors: function(e) {
        for (var t = [], i = (e = this._flattenBehaviorsList(e)).length - 1; i >= 0; i--) {
            var n = e[i];
            -1 === t.indexOf(n) && (this._mixinBehavior(n), t.unshift(n))
        }
        return t
    },
    _flattenBehaviorsList: function(e) {
        for (var t = [], i = 0; i < e.length; i++) {
            var n = e[i];
            n instanceof Array ? t = t.concat(this._flattenBehaviorsList(n)) : n ? t.push(n) : this._warn(this._logf("_flattenBehaviorsList", "behavior is null, check for missing or 404 import"))
        }
        return t
    },
    _mixinBehavior: function(e) {
        for (var t, i = Object.getOwnPropertyNames(e), n = 0; n < i.length && (t = i[n]); n++)
            Polymer.Base._behaviorProperties[t] || this.hasOwnProperty(t) || this.copyOwnProperty(t, e, this)
    },
    _prepBehaviors: function() {
        this._prepFlattenedBehaviors(this.behaviors)
    },
    _prepFlattenedBehaviors: function(e) {
        for (var t = 0, i = e.length; t < i; t++)
            this._prepBehavior(e[t]);
        this._prepBehavior(this)
    },
    _doBehavior: function(e, t) {
        for (var i = 0; i < this.behaviors.length; i++)
            this._invokeBehavior(this.behaviors[i], e, t);
        this._invokeBehavior(this, e, t)
    },
    _invokeBehavior: function(e, t, i) {
        var n = e[t];
        n && n.apply(this, i || Polymer.nar)
    },
    _marshalBehaviors: function() {
        for (var e = 0; e < this.behaviors.length; e++)
            this._marshalBehavior(this.behaviors[e]);
        this._marshalBehavior(this)
    }
}), Polymer.Base._behaviorProperties = {
    hostAttributes: !0,
    beforeRegister: !0,
    registered: !0,
    properties: !0,
    observers: !0,
    listeners: !0,
    created: !0,
    attached: !0,
    detached: !0,
    attributeChanged: !0,
    ready: !0
}, Polymer.Base._addFeature({
    _getExtendedPrototype: function(e) {
        return this._getExtendedNativePrototype(e)
    },
    _nativePrototypes: {},
    _getExtendedNativePrototype: function(e) {
        var t = this._nativePrototypes[e];
        if (!t) {
            var i = this.getNativePrototype(e);
            t = this.extend(Object.create(i), Polymer.Base), this._nativePrototypes[e] = t
        }
        return t
    },
    getNativePrototype: function(e) {
        return Object.getPrototypeOf(document.createElement(e))
    }
}), Polymer.Base._addFeature({
    _prepConstructor: function() {
        this._factoryArgs = this.extends ? [this.extends, this.is] : [this.is];
        var e = function() {
            return this._factory(arguments)
        };
        this.hasOwnProperty("extends") && (e.extends = this.extends), Object.defineProperty(this, "constructor", {
            value: e,
            writable: !0,
            configurable: !0
        }), e.prototype = this
    },
    _factory: function(e) {
        var t = document.createElement.apply(document, this._factoryArgs);
        return this.factoryImpl && this.factoryImpl.apply(t, e), t
    }
}), Polymer.nob = Object.create(null), Polymer.Base._addFeature({
    properties: {},
    getPropertyInfo: function(e) {
        var t = this._getPropertyInfo(e, this.properties);
        if (!t)
            for (var i = 0; i < this.behaviors.length; i++)
                if (t = this._getPropertyInfo(e, this.behaviors[i].properties))
                    return t;
        return t || Polymer.nob
    },
    _getPropertyInfo: function(e, t) {
        var i = t && t[e];
        return "function" == typeof i && (i = t[e] = {
            type: i
        }), i && (i.defined = !0), i
    },
    _prepPropertyInfo: function() {
        this._propertyInfo = {};
        for (var e = 0; e < this.behaviors.length; e++)
            this._addPropertyInfo(this._propertyInfo, this.behaviors[e].properties);
        this._addPropertyInfo(this._propertyInfo, this.properties), this._addPropertyInfo(this._propertyInfo, this._propertyEffects)
    },
    _addPropertyInfo: function(e, t) {
        var i,
            n;
        if (t)
            for (var r in t)
                i = e[r], n = t[r], ("_" !== r[0] || n.readOnly) && (e[r] ? (i.type || (i.type = n.type), i.readOnly || (i.readOnly = n.readOnly)) : e[r] = {
                    type: "function" == typeof n ? n : n.type,
                    readOnly: n.readOnly,
                    attribute: Polymer.CaseMap.camelToDashCase(r)
                })
    }
}), Polymer.CaseMap = {
    _caseMap: {},
    _rx: {
        dashToCamel: /-[a-z]/g,
        camelToDash: /([A-Z])/g
    },
    dashToCamelCase: function(e) {
        return this._caseMap[e] || (this._caseMap[e] = e.indexOf("-") < 0 ? e : e.replace(this._rx.dashToCamel, function(e) {
                return e[1].toUpperCase()
            }))
    },
    camelToDashCase: function(e) {
        return this._caseMap[e] || (this._caseMap[e] = e.replace(this._rx.camelToDash, "-$1").toLowerCase())
    }
}, Polymer.Base._addFeature({
    _addHostAttributes: function(e) {
        this._aggregatedAttributes || (this._aggregatedAttributes = {}), e && this.mixin(this._aggregatedAttributes, e)
    },
    _marshalHostAttributes: function() {
        this._aggregatedAttributes && this._applyAttributes(this, this._aggregatedAttributes)
    },
    _applyAttributes: function(e, t) {
        for (var i in t)
            if (!this.hasAttribute(i) && "class" !== i) {
                var n = t[i];
                this.serializeValueToAttribute(n, i, this)
            }
    },
    _marshalAttributes: function() {
        this._takeAttributesToModel(this)
    },
    _takeAttributesToModel: function(e) {
        if (this.hasAttributes())
            for (var t in this._propertyInfo) {
                var i = this._propertyInfo[t];
                this.hasAttribute(i.attribute) && this._setAttributeToProperty(e, i.attribute, t, i)
            }
    },
    _setAttributeToProperty: function(e, t, i, n) {
        if (!this._serializing && (i = i || Polymer.CaseMap.dashToCamelCase(t), (n = n || this._propertyInfo && this._propertyInfo[i]) && !n.readOnly)) {
            var r = this.getAttribute(t);
            e[i] = this.deserialize(r, n.type)
        }
    },
    _serializing: !1,
    reflectPropertyToAttribute: function(e, t, i) {
        this._serializing = !0, i = void 0 === i ? this[e] : i, this.serializeValueToAttribute(i, t || Polymer.CaseMap.camelToDashCase(e)), this._serializing = !1
    },
    serializeValueToAttribute: function(e, t, i) {
        var n = this.serialize(e);
        i = i || this, void 0 === n ? i.removeAttribute(t) : i.setAttribute(t, n)
    },
    deserialize: function(e, t) {
        switch (t) {
        case Number:
            e = Number(e);
            break;
        case Boolean:
            e = null != e;
            break;
        case Object:
            try {
                e = JSON.parse(e)
            } catch (e) {}
            break;
        case Array:
            try {
                e = JSON.parse(e)
            } catch (t) {
                e = null
            }
            break;
        case Date:
            e = new Date(e);
            break;
        case String:
        }
        return e
    },
    serialize: function(e) {
        switch (typeof e) {
        case "boolean":
            return e ? "" : void 0;
        case "object":
            if (e instanceof Date)
                return e.toString();
            if (e)
                try {
                    return JSON.stringify(e)
                } catch (e) {
                    return ""
                }
        default:
            return null != e ? e : void 0
        }
    }
}), Polymer.version = "master", Polymer.Base._addFeature({
    _registerFeatures: function() {
        this._prepIs(), this._prepBehaviors(), this._prepConstructor(), this._prepPropertyInfo()
    },
    _prepBehavior: function(e) {
        this._addHostAttributes(e.hostAttributes)
    },
    _marshalBehavior: function(e) {},
    _initFeatures: function() {
        this._marshalHostAttributes(), this._marshalBehaviors()
    }
}), Polymer.Base._addFeature({
    _prepTemplate: function() {
        void 0 === this._template && (this._template = Polymer.DomModule.import(this.is, "template")), this._template && this._template.hasAttribute("is") && this._warn(this._logf("_prepTemplate", "top-level Polymer template must not be a type-extension, found", this._template, "Move inside simple <template>.")), this._template && !this._template.content && window.HTMLTemplateElement && HTMLTemplateElement.decorate && HTMLTemplateElement.decorate(this._template)
    },
    _stampTemplate: function() {
        this._template && (this.root = this.instanceTemplate(this._template))
    },
    instanceTemplate: function(e) {
        return document.importNode(e._content || e.content, !0)
    }
}), function() {
    var e = Polymer.Base.attachedCallback;
    Polymer.Base._addFeature({
        _hostStack: [],
        ready: function() {},
        _registerHost: function(e) {
            this.dataHost = e = e || Polymer.Base._hostStack[Polymer.Base._hostStack.length - 1], e && e._clients && e._clients.push(this), this._clients = null, this._clientsReadied = !1
        },
        _beginHosting: function() {
            Polymer.Base._hostStack.push(this), this._clients || (this._clients = [])
        },
        _endHosting: function() {
            Polymer.Base._hostStack.pop()
        },
        _tryReady: function() {
            this._readied = !1, this._canReady() && this._ready()
        },
        _canReady: function() {
            return !this.dataHost || this.dataHost._clientsReadied
        },
        _ready: function() {
            this._beforeClientsReady(), this._template && (this._setupRoot(), this._readyClients()), this._clientsReadied = !0, this._clients = null, this._afterClientsReady(), this._readySelf()
        },
        _readyClients: function() {
            this._beginDistribute();
            var e = this._clients;
            if (e)
                for (var t, i = 0, n = e.length; i < n && (t = e[i]); i++)
                    t._ready();
            this._finishDistribute()
        },
        _readySelf: function() {
            this._doBehavior("ready"), this._readied = !0, this._attachedPending && (this._attachedPending = !1, this.attachedCallback())
        },
        _beforeClientsReady: function() {},
        _afterClientsReady: function() {},
        _beforeAttached: function() {},
        attachedCallback: function() {
            this._readied ? (this._beforeAttached(), e.call(this)) : this._attachedPending = !0
        }
    })
}(), Polymer.ArraySplice = function() {
    function e(e, t, i) {
        return {
            index: e,
            removed: t,
            addedCount: i
        }
    }
    function t() {}
    return t.prototype = {
        calcEditDistances: function(e, t, i, n, r, o) {
            for (var s = o - r + 1, a = i - t + 1, l = new Array(s), h = 0; h < s; h++)
                l[h] = new Array(a), l[h][0] = h;
            for (var c = 0; c < a; c++)
                l[0][c] = c;
            for (h = 1; h < s; h++)
                for (c = 1; c < a; c++)
                    if (this.equals(e[t + c - 1], n[r + h - 1]))
                        l[h][c] = l[h - 1][c - 1];
                    else {
                        var u = l[h - 1][c] + 1,
                            d = l[h][c - 1] + 1;
                        l[h][c] = u < d ? u : d
                    }
            return l
        },
        spliceOperationsFromEditDistances: function(e) {
            for (var t = e.length - 1, i = e[0].length - 1, n = e[t][i], r = []; t > 0 || i > 0;)
                if (0 != t)
                    if (0 != i) {
                        var o,
                            s = e[t - 1][i - 1],
                            a = e[t - 1][i],
                            l = e[t][i - 1];
                        (o = a < l ? a < s ? a : s : l < s ? l : s) == s ? (s == n ? r.push(0) : (r.push(1), n = s), t--, i--) : o == a ? (r.push(3), t--, n = a) : (r.push(2), i--, n = l)
                    } else
                        r.push(3), t--;
                else
                    r.push(2), i--;
            return r.reverse(), r
        },
        calcSplices: function(t, i, n, r, o, s) {
            var a = 0,
                l = 0,
                h = Math.min(n - i, s - o);
            if (0 == i && 0 == o && (a = this.sharedPrefix(t, r, h)), n == t.length && s == r.length && (l = this.sharedSuffix(t, r, h - a)), o += a, s -= l, (n -= l) - (i += a) == 0 && s - o == 0)
                return [];
            if (i == n) {
                for (var c = e(i, [], 0); o < s;)
                    c.removed.push(r[o++]);
                return [c]
            }
            if (o == s)
                return [e(i, [], n - i)];
            var u = this.spliceOperationsFromEditDistances(this.calcEditDistances(t, i, n, r, o, s));
            c = void 0;
            for (var d = [], f = i, p = o, _ = 0; _ < u.length; _++)
                switch (u[_]) {
                case 0:
                    c && (d.push(c), c = void 0), f++, p++;
                    break;
                case 1:
                    c || (c = e(f, [], 0)), c.addedCount++, f++, c.removed.push(r[p]), p++;
                    break;
                case 2:
                    c || (c = e(f, [], 0)), c.addedCount++, f++;
                    break;
                case 3:
                    c || (c = e(f, [], 0)), c.removed.push(r[p]), p++
                }
            return c && d.push(c), d
        },
        sharedPrefix: function(e, t, i) {
            for (var n = 0; n < i; n++)
                if (!this.equals(e[n], t[n]))
                    return n;
            return i
        },
        sharedSuffix: function(e, t, i) {
            for (var n = e.length, r = t.length, o = 0; o < i && this.equals(e[--n], t[--r]);)
                o++;
            return o
        },
        calculateSplices: function(e, t) {
            return this.calcSplices(e, 0, e.length, t, 0, t.length)
        },
        equals: function(e, t) {
            return e === t
        }
    }, new t
}(), Polymer.domInnerHTML = function() {
    var e = /[&\u00A0"]/g,
        t = /[&\u00A0<>]/g;
    function i(e) {
        switch (e) {
        case "&":
            return "&amp;";
        case "<":
            return "&lt;";
        case ">":
            return "&gt;";
        case '"':
            return "&quot;";
        case " ":
            return "&nbsp;"
        }
    }
    function n(t) {
        return t.replace(e, i)
    }
    function r(e) {
        for (var t = {}, i = 0; i < e.length; i++)
            t[e[i]] = !0;
        return t
    }
    var o = r(["area", "base", "br", "col", "command", "embed", "hr", "img", "input", "keygen", "link", "meta", "param", "source", "track", "wbr"]),
        s = r(["style", "script", "xmp", "iframe", "noembed", "noframes", "plaintext", "noscript"]);
    function a(e, r, a) {
        switch (e.nodeType) {
        case Node.ELEMENT_NODE:
            for (var h, c = e.localName, u = "<" + c, d = e.attributes, f = 0; h = d[f]; f++)
                u += " " + h.name + '="' + n(h.value) + '"';
            return u += ">", o[c] ? u : u + l(e, a) + "</" + c + ">";
        case Node.TEXT_NODE:
            var p = e.data;
            return r && s[r.localName] ? p : p.replace(t, i);
        case Node.COMMENT_NODE:
            return "\x3c!--" + e.data + "--\x3e";
        default:
            throw new Error("not implemented")
        }
    }
    function l(e, t) {
        e instanceof HTMLTemplateElement && (e = e.content);
        for (var i, n = "", r = Polymer.dom(e).childNodes, o = 0, s = r.length; o < s && (i = r[o]); o++)
            n += a(i, e, t);
        return n
    }
    return {
        getInnerHTML: l
    }
}(), function() {
    "use strict";
    var e = Element.prototype.insertBefore,
        t = Element.prototype.appendChild,
        i = Element.prototype.removeChild;
    Polymer.TreeApi = {
        arrayCopyChildNodes: function(e) {
            for (var t = [], i = 0, n = e.firstChild; n; n = n.nextSibling)
                t[i++] = n;
            return t
        },
        arrayCopyChildren: function(e) {
            for (var t = [], i = 0, n = e.firstElementChild; n; n = n.nextElementSibling)
                t[i++] = n;
            return t
        },
        arrayCopy: function(e) {
            for (var t = e.length, i = new Array(t), n = 0; n < t; n++)
                i[n] = e[n];
            return i
        }
    }, Polymer.TreeApi.Logical = {
        hasParentNode: function(e) {
            return Boolean(e.__dom && e.__dom.parentNode)
        },
        hasChildNodes: function(e) {
            return Boolean(e.__dom && void 0 !== e.__dom.childNodes)
        },
        getChildNodes: function(e) {
            return this.hasChildNodes(e) ? this._getChildNodes(e) : e.childNodes
        },
        _getChildNodes: function(e) {
            if (!e.__dom.childNodes) {
                e.__dom.childNodes = [];
                for (var t = e.__dom.firstChild; t; t = t.__dom.nextSibling)
                    e.__dom.childNodes.push(t)
            }
            return e.__dom.childNodes
        },
        getParentNode: function(e) {
            return e.__dom && void 0 !== e.__dom.parentNode ? e.__dom.parentNode : e.parentNode
        },
        getFirstChild: function(e) {
            return e.__dom && void 0 !== e.__dom.firstChild ? e.__dom.firstChild : e.firstChild
        },
        getLastChild: function(e) {
            return e.__dom && void 0 !== e.__dom.lastChild ? e.__dom.lastChild : e.lastChild
        },
        getNextSibling: function(e) {
            return e.__dom && void 0 !== e.__dom.nextSibling ? e.__dom.nextSibling : e.nextSibling
        },
        getPreviousSibling: function(e) {
            return e.__dom && void 0 !== e.__dom.previousSibling ? e.__dom.previousSibling : e.previousSibling
        },
        getFirstElementChild: function(e) {
            return e.__dom && void 0 !== e.__dom.firstChild ? this._getFirstElementChild(e) : e.firstElementChild
        },
        _getFirstElementChild: function(e) {
            for (var t = e.__dom.firstChild; t && t.nodeType !== Node.ELEMENT_NODE;)
                t = t.__dom.nextSibling;
            return t
        },
        getLastElementChild: function(e) {
            return e.__dom && void 0 !== e.__dom.lastChild ? this._getLastElementChild(e) : e.lastElementChild
        },
        _getLastElementChild: function(e) {
            for (var t = e.__dom.lastChild; t && t.nodeType !== Node.ELEMENT_NODE;)
                t = t.__dom.previousSibling;
            return t
        },
        getNextElementSibling: function(e) {
            return e.__dom && void 0 !== e.__dom.nextSibling ? this._getNextElementSibling(e) : e.nextElementSibling
        },
        _getNextElementSibling: function(e) {
            for (var t = e.__dom.nextSibling; t && t.nodeType !== Node.ELEMENT_NODE;)
                t = t.__dom.nextSibling;
            return t
        },
        getPreviousElementSibling: function(e) {
            return e.__dom && void 0 !== e.__dom.previousSibling ? this._getPreviousElementSibling(e) : e.previousElementSibling
        },
        _getPreviousElementSibling: function(e) {
            for (var t = e.__dom.previousSibling; t && t.nodeType !== Node.ELEMENT_NODE;)
                t = t.__dom.previousSibling;
            return t
        },
        saveChildNodes: function(e) {
            if (!this.hasChildNodes(e)) {
                e.__dom = e.__dom || {}, e.__dom.firstChild = e.firstChild, e.__dom.lastChild = e.lastChild, e.__dom.childNodes = [];
                for (var t = e.firstChild; t; t = t.nextSibling)
                    t.__dom = t.__dom || {}, t.__dom.parentNode = e, e.__dom.childNodes.push(t), t.__dom.nextSibling = t.nextSibling, t.__dom.previousSibling = t.previousSibling
            }
        },
        recordInsertBefore: function(e, t, i) {
            if (t.__dom.childNodes = null, e.nodeType === Node.DOCUMENT_FRAGMENT_NODE)
                for (var n = e.firstChild; n; n = n.nextSibling)
                    this._linkNode(n, t, i);
            else
                this._linkNode(e, t, i)
        },
        _linkNode: function(e, t, i) {
            e.__dom = e.__dom || {}, t.__dom = t.__dom || {}, i && (i.__dom = i.__dom || {}), e.__dom.previousSibling = i ? i.__dom.previousSibling : t.__dom.lastChild, e.__dom.previousSibling && (e.__dom.previousSibling.__dom.nextSibling = e), e.__dom.nextSibling = i, e.__dom.nextSibling && (e.__dom.nextSibling.__dom.previousSibling = e), e.__dom.parentNode = t, i ? i === t.__dom.firstChild && (t.__dom.firstChild = e) : (t.__dom.lastChild = e, t.__dom.firstChild || (t.__dom.firstChild = e)), t.__dom.childNodes = null
        },
        recordRemoveChild: function(e, t) {
            e.__dom = e.__dom || {}, t.__dom = t.__dom || {}, e === t.__dom.firstChild && (t.__dom.firstChild = e.__dom.nextSibling), e === t.__dom.lastChild && (t.__dom.lastChild = e.__dom.previousSibling);
            var i = e.__dom.previousSibling,
                n = e.__dom.nextSibling;
            i && (i.__dom.nextSibling = n), n && (n.__dom.previousSibling = i), e.__dom.parentNode = e.__dom.previousSibling = e.__dom.nextSibling = void 0, t.__dom.childNodes = null
        }
    }, Polymer.TreeApi.Composed = {
        getChildNodes: function(e) {
            return Polymer.TreeApi.arrayCopyChildNodes(e)
        },
        getParentNode: function(e) {
            return e.parentNode
        },
        clearChildNodes: function(e) {
            e.textContent = ""
        },
        insertBefore: function(t, i, n) {
            return e.call(t, i, n || null)
        },
        appendChild: function(e, i) {
            return t.call(e, i)
        },
        removeChild: function(e, t) {
            return i.call(e, t)
        }
    }
}(), Polymer.DomApi = function() {
    "use strict";
    var e = Polymer.Settings,
        t = Polymer.TreeApi,
        i = function(e) {
            this.node = n ? i.wrap(e) : e
        },
        n = e.hasShadow && !e.nativeShadow;
    i.wrap = window.wrap ? window.wrap : function(e) {
        return e
    }, i.prototype = {
        flush: function() {
            Polymer.dom.flush()
        },
        deepContains: function(e) {
            if (this.node.contains(e))
                return !0;
            for (var t = e, i = e.ownerDocument; t && t !== i && t !== this.node;)
                t = Polymer.dom(t).parentNode || t.host;
            return t === this.node
        },
        queryDistributedElements: function(e) {
            for (var t, n = this.getEffectiveChildNodes(), r = [], o = 0, s = n.length; o < s && (t = n[o]); o++)
                t.nodeType === Node.ELEMENT_NODE && i.matchesSelector.call(t, e) && r.push(t);
            return r
        },
        getEffectiveChildNodes: function() {
            for (var e, t = [], i = this.childNodes, n = 0, s = i.length; n < s && (e = i[n]); n++)
                if (e.localName === r)
                    for (var a = o(e).getDistributedNodes(), l = 0; l < a.length; l++)
                        t.push(a[l]);
                else
                    t.push(e);
            return t
        },
        observeNodes: function(e) {
            if (e)
                return this.observer || (this.observer = this.node.localName === r ? new i.DistributedNodesObserver(this) : new i.EffectiveNodesObserver(this)), this.observer.addListener(e)
        },
        unobserveNodes: function(e) {
            this.observer && this.observer.removeListener(e)
        },
        notifyObserver: function() {
            this.observer && this.observer.notify()
        },
        _query: function(e, i, n) {
            i = i || this.node;
            var r = [];
            return this._queryElements(t.Logical.getChildNodes(i), e, n, r), r
        },
        _queryElements: function(e, t, i, n) {
            for (var r, o = 0, s = e.length; o < s && (r = e[o]); o++)
                if (r.nodeType === Node.ELEMENT_NODE && this._queryElement(r, t, i, n))
                    return !0
        },
        _queryElement: function(e, i, n, r) {
            var o = i(e);
            if (o && r.push(e), n && n(o))
                return o;
            this._queryElements(t.Logical.getChildNodes(e), i, n, r)
        }
    };
    var r = i.CONTENT = "content",
        o = i.factory = function(e) {
            return (e = e || document).__domApi || (e.__domApi = new i.ctor(e)), e.__domApi
        };
    i.hasApi = function(e) {
        return Boolean(e.__domApi)
    }, i.ctor = i, Polymer.dom = function(e, t) {
        return e instanceof Event ? Polymer.EventApi.factory(e) : i.factory(e, t)
    };
    var s = Element.prototype;
    return i.matchesSelector = s.matches || s.matchesSelector || s.mozMatchesSelector || s.msMatchesSelector || s.oMatchesSelector || s.webkitMatchesSelector, i
}(), function() {
    "use strict";
    var e = Polymer.Settings,
        t = Polymer.DomApi,
        i = t.factory,
        n = Polymer.TreeApi,
        r = Polymer.domInnerHTML.getInnerHTML,
        o = t.CONTENT;
    if (!e.useShadow) {
        var s = Element.prototype.cloneNode,
            a = Document.prototype.importNode;
        Polymer.Base.extend(t.prototype, {
            _lazyDistribute: function(e) {
                e.shadyRoot && e.shadyRoot._distributionClean && (e.shadyRoot._distributionClean = !1, Polymer.dom.addDebouncer(e.debounce("_distribute", e._distributeContent)))
            },
            appendChild: function(e) {
                return this.insertBefore(e)
            },
            insertBefore: function(e, r) {
                if (r && n.Logical.getParentNode(r) !== this.node)
                    throw Error("The ref_node to be inserted before is not a child of this node");
                if (e.nodeType !== Node.DOCUMENT_FRAGMENT_NODE) {
                    var s = n.Logical.getParentNode(e);
                    s ? (t.hasApi(s) && i(s).notifyObserver(), this._removeNode(e)) : this._removeOwnerShadyRoot(e)
                }
                if (!this._addNode(e, r)) {
                    r && (r = r.localName === o ? this._firstComposedNode(r) : r);
                    var a = this.node._isShadyRoot ? this.node.host : this.node;
                    r ? n.Composed.insertBefore(a, e, r) : n.Composed.appendChild(a, e)
                }
                return this.notifyObserver(), e
            },
            _addNode: function(e, t) {
                var i = this.getOwnerRoot();
                if (i) {
                    var r = this._maybeAddInsertionPoint(e, this.node);
                    i._invalidInsertionPoints || (i._invalidInsertionPoints = r), this._addNodeToHost(i.host, e)
                }
                n.Logical.hasChildNodes(this.node) && n.Logical.recordInsertBefore(e, this.node, t);
                var o = this._maybeDistribute(e) || this.node.shadyRoot;
                if (o)
                    if (e.nodeType === Node.DOCUMENT_FRAGMENT_NODE)
                        for (; e.firstChild;)
                            n.Composed.removeChild(e, e.firstChild);
                    else {
                        var s = n.Composed.getParentNode(e);
                        s && n.Composed.removeChild(s, e)
                    }
                return o
            },
            removeChild: function(e) {
                if (n.Logical.getParentNode(e) !== this.node)
                    throw Error("The node to be removed is not a child of this node: " + e);
                if (!this._removeNode(e)) {
                    var t = this.node._isShadyRoot ? this.node.host : this.node;
                    t === n.Composed.getParentNode(e) && n.Composed.removeChild(t, e)
                }
                return this.notifyObserver(), e
            },
            _removeNode: function(e) {
                var t,
                    r = n.Logical.hasParentNode(e) && n.Logical.getParentNode(e),
                    o = this._ownerShadyRootForNode(e);
                return r && (t = i(e)._maybeDistributeParent(), n.Logical.recordRemoveChild(e, r), o && this._removeDistributedChildren(o, e) && (o._invalidInsertionPoints = !0, this._lazyDistribute(o.host))), this._removeOwnerShadyRoot(e), o && this._removeNodeFromHost(o.host, e), t
            },
            replaceChild: function(e, t) {
                return this.insertBefore(e, t), this.removeChild(t), e
            },
            _hasCachedOwnerRoot: function(e) {
                return Boolean(void 0 !== e._ownerShadyRoot)
            },
            getOwnerRoot: function() {
                return this._ownerShadyRootForNode(this.node)
            },
            _ownerShadyRootForNode: function(e) {
                if (e) {
                    var t = e._ownerShadyRoot;
                    if (void 0 === t) {
                        if (e._isShadyRoot)
                            t = e;
                        else {
                            var i = n.Logical.getParentNode(e);
                            t = i ? i._isShadyRoot ? i : this._ownerShadyRootForNode(i) : null
                        }
                        (t || document.documentElement.contains(e)) && (e._ownerShadyRoot = t)
                    }
                    return t
                }
            },
            _maybeDistribute: function(e) {
                var t = e.nodeType === Node.DOCUMENT_FRAGMENT_NODE && !e.__noContent && i(e).querySelector(o),
                    r = t && n.Logical.getParentNode(t).nodeType !== Node.DOCUMENT_FRAGMENT_NODE,
                    s = t || e.localName === o;
                if (s) {
                    var a = this.getOwnerRoot();
                    a && this._lazyDistribute(a.host)
                }
                var l = this._nodeNeedsDistribution(this.node);
                return l && this._lazyDistribute(this.node), l || s && !r
            },
            _maybeAddInsertionPoint: function(e, t) {
                var r;
                if (e.nodeType !== Node.DOCUMENT_FRAGMENT_NODE || e.__noContent)
                    e.localName === o && (n.Logical.saveChildNodes(t), n.Logical.saveChildNodes(e), r = !0);
                else
                    for (var s, a, l, h = i(e).querySelectorAll(o), c = 0; c < h.length && (s = h[c]); c++)
                        (a = n.Logical.getParentNode(s)) === e && (a = t), l = this._maybeAddInsertionPoint(s, a), r = r || l;
                return r
            },
            _updateInsertionPoints: function(e) {
                for (var t, r = e.shadyRoot._insertionPoints = i(e.shadyRoot).querySelectorAll(o), s = 0; s < r.length; s++)
                    t = r[s], n.Logical.saveChildNodes(t), n.Logical.saveChildNodes(n.Logical.getParentNode(t))
            },
            _nodeNeedsDistribution: function(e) {
                return e && e.shadyRoot && t.hasInsertionPoint(e.shadyRoot)
            },
            _addNodeToHost: function(e, t) {
                e._elementAdd && e._elementAdd(t)
            },
            _removeNodeFromHost: function(e, t) {
                e._elementRemove && e._elementRemove(t)
            },
            _removeDistributedChildren: function(e, t) {
                for (var r, o = e._insertionPoints, s = 0; s < o.length; s++) {
                    var a = o[s];
                    if (this._contains(t, a))
                        for (var l = i(a).getDistributedNodes(), h = 0; h < l.length; h++) {
                            r = !0;
                            var c = l[h],
                                u = n.Composed.getParentNode(c);
                            u && n.Composed.removeChild(u, c)
                        }
                }
                return r
            },
            _contains: function(e, t) {
                for (; t;) {
                    if (t == e)
                        return !0;
                    t = n.Logical.getParentNode(t)
                }
            },
            _removeOwnerShadyRoot: function(e) {
                if (this._hasCachedOwnerRoot(e))
                    for (var t, i = n.Logical.getChildNodes(e), r = 0, o = i.length; r < o && (t = i[r]); r++)
                        this._removeOwnerShadyRoot(t);
                e._ownerShadyRoot = void 0
            },
            _firstComposedNode: function(e) {
                for (var t, n, r = i(e).getDistributedNodes(), o = 0, s = r.length; o < s && (t = r[o]); o++)
                    if ((n = i(t).getDestinationInsertionPoints())[n.length - 1] === e)
                        return t
            },
            querySelector: function(e) {
                return this._query(function(i) {
                        return t.matchesSelector.call(i, e)
                    }, this.node, function(e) {
                        return Boolean(e)
                    })[0] || null
            },
            querySelectorAll: function(e) {
                return this._query(function(i) {
                    return t.matchesSelector.call(i, e)
                }, this.node)
            },
            getDestinationInsertionPoints: function() {
                return this.node._destinationInsertionPoints || []
            },
            getDistributedNodes: function() {
                return this.node._distributedNodes || []
            },
            _clear: function() {
                for (; this.childNodes.length;)
                    this.removeChild(this.childNodes[0])
            },
            setAttribute: function(e, t) {
                this.node.setAttribute(e, t), this._maybeDistributeParent()
            },
            removeAttribute: function(e) {
                this.node.removeAttribute(e), this._maybeDistributeParent()
            },
            _maybeDistributeParent: function() {
                if (this._nodeNeedsDistribution(this.parentNode))
                    return this._lazyDistribute(this.parentNode), !0
            },
            cloneNode: function(e) {
                var t = s.call(this.node, !1);
                if (e)
                    for (var n, r = this.childNodes, o = i(t), a = 0; a < r.length; a++)
                        n = i(r[a]).cloneNode(!0), o.appendChild(n);
                return t
            },
            importNode: function(e, t) {
                var r = this.node instanceof Document ? this.node : this.node.ownerDocument,
                    o = a.call(r, e, !1);
                if (t)
                    for (var s, l = n.Logical.getChildNodes(e), h = i(o), c = 0; c < l.length; c++)
                        s = i(r).importNode(l[c], !0), h.appendChild(s);
                return o
            },
            _getComposedInnerHTML: function() {
                return r(this.node, !0)
            }
        }), Object.defineProperties(t.prototype, {
            activeElement: {
                get: function() {
                    var e = document.activeElement;
                    if (!e)
                        return null;
                    var t = !!this.node._isShadyRoot;
                    if (this.node !== document) {
                        if (!t)
                            return null;
                        if (this.node.host === e || !this.node.host.contains(e))
                            return null
                    }
                    for (var n = i(e).getOwnerRoot(); n && n !== this.node;)
                        e = n.host, n = i(e).getOwnerRoot();
                    return this.node === document ? n ? null : e : n === this.node ? e : null
                },
                configurable: !0
            },
            childNodes: {
                get: function() {
                    var e = n.Logical.getChildNodes(this.node);
                    return Array.isArray(e) ? e : n.arrayCopyChildNodes(this.node)
                },
                configurable: !0
            },
            children: {
                get: function() {
                    return n.Logical.hasChildNodes(this.node) ? Array.prototype.filter.call(this.childNodes, function(e) {
                        return e.nodeType === Node.ELEMENT_NODE
                    }) : n.arrayCopyChildren(this.node)
                },
                configurable: !0
            },
            parentNode: {
                get: function() {
                    return n.Logical.getParentNode(this.node)
                },
                configurable: !0
            },
            firstChild: {
                get: function() {
                    return n.Logical.getFirstChild(this.node)
                },
                configurable: !0
            },
            lastChild: {
                get: function() {
                    return n.Logical.getLastChild(this.node)
                },
                configurable: !0
            },
            nextSibling: {
                get: function() {
                    return n.Logical.getNextSibling(this.node)
                },
                configurable: !0
            },
            previousSibling: {
                get: function() {
                    return n.Logical.getPreviousSibling(this.node)
                },
                configurable: !0
            },
            firstElementChild: {
                get: function() {
                    return n.Logical.getFirstElementChild(this.node)
                },
                configurable: !0
            },
            lastElementChild: {
                get: function() {
                    return n.Logical.getLastElementChild(this.node)
                },
                configurable: !0
            },
            nextElementSibling: {
                get: function() {
                    return n.Logical.getNextElementSibling(this.node)
                },
                configurable: !0
            },
            previousElementSibling: {
                get: function() {
                    return n.Logical.getPreviousElementSibling(this.node)
                },
                configurable: !0
            },
            textContent: {
                get: function() {
                    var e = this.node.nodeType;
                    if (e === Node.TEXT_NODE || e === Node.COMMENT_NODE)
                        return this.node.textContent;
                    for (var t, i = [], n = 0, r = this.childNodes; t = r[n]; n++)
                        t.nodeType !== Node.COMMENT_NODE && i.push(t.textContent);
                    return i.join("")
                },
                set: function(e) {
                    var t = this.node.nodeType;
                    t === Node.TEXT_NODE || t === Node.COMMENT_NODE ? this.node.textContent = e : (this._clear(), e && this.appendChild(document.createTextNode(e)))
                },
                configurable: !0
            },
            innerHTML: {
                get: function() {
                    var e = this.node.nodeType;
                    return e === Node.TEXT_NODE || e === Node.COMMENT_NODE ? null : r(this.node)
                },
                set: function(e) {
                    var t = this.node.nodeType;
                    if (t !== Node.TEXT_NODE || t !== Node.COMMENT_NODE) {
                        this._clear();
                        var i = document.createElement("div");
                        i.innerHTML = e;
                        for (var r = n.arrayCopyChildNodes(i), o = 0; o < r.length; o++)
                            this.appendChild(r[o])
                    }
                },
                configurable: !0
            }
        }), t.hasInsertionPoint = function(e) {
            return Boolean(e && e._insertionPoints.length)
        }
    }
}(), function() {
    "use strict";
    var e = Polymer.Settings,
        t = Polymer.TreeApi,
        i = Polymer.DomApi;
    if (e.useShadow) {
        Polymer.Base.extend(i.prototype, {
            querySelectorAll: function(e) {
                return t.arrayCopy(this.node.querySelectorAll(e))
            },
            getOwnerRoot: function() {
                for (var e = this.node; e;) {
                    if (e.nodeType === Node.DOCUMENT_FRAGMENT_NODE && e.host)
                        return e;
                    e = e.parentNode
                }
            },
            importNode: function(e, t) {
                return (this.node instanceof Document ? this.node : this.node.ownerDocument).importNode(e, t)
            },
            getDestinationInsertionPoints: function() {
                var e = this.node.getDestinationInsertionPoints && this.node.getDestinationInsertionPoints();
                return e ? t.arrayCopy(e) : []
            },
            getDistributedNodes: function() {
                var e = this.node.getDistributedNodes && this.node.getDistributedNodes();
                return e ? t.arrayCopy(e) : []
            }
        }), Object.defineProperties(i.prototype, {
            activeElement: {
                get: function() {
                    var e = i.wrap(this.node),
                        t = e.activeElement;
                    return e.contains(t) ? t : null
                },
                configurable: !0
            },
            childNodes: {
                get: function() {
                    return t.arrayCopyChildNodes(this.node)
                },
                configurable: !0
            },
            children: {
                get: function() {
                    return t.arrayCopyChildren(this.node)
                },
                configurable: !0
            },
            textContent: {
                get: function() {
                    return this.node.textContent
                },
                set: function(e) {
                    return this.node.textContent = e
                },
                configurable: !0
            },
            innerHTML: {
                get: function() {
                    return this.node.innerHTML
                },
                set: function(e) {
                    return this.node.innerHTML = e
                },
                configurable: !0
            }
        });
        var n = function(e) {
            i.prototype[e] = function() {
                return this.node[e].apply(this.node, arguments)
            }
        };
        !function(e) {
            for (var t = 0; t < e.length; t++)
                n(e[t])
        }(["cloneNode", "appendChild", "insertBefore", "removeChild", "replaceChild", "setAttribute", "removeAttribute", "querySelector"]);
        var r = function(e) {
            Object.defineProperty(i.prototype, e, {
                get: function() {
                    return this.node[e]
                },
                configurable: !0
            })
        };
        !function(e) {
            for (var t = 0; t < e.length; t++)
                r(e[t])
        }(["parentNode", "firstChild", "lastChild", "nextSibling", "previousSibling", "firstElementChild", "lastElementChild", "nextElementSibling", "previousElementSibling"])
    }
}(), Polymer.Base.extend(Polymer.dom, {
    _flushGuard: 0,
    _FLUSH_MAX: 100,
    _needsTakeRecords: !Polymer.Settings.useNativeCustomElements,
    _debouncers: [],
    _staticFlushList: [],
    _finishDebouncer: null,
    flush: function() {
        for (this._flushGuard = 0, this._prepareFlush(); this._debouncers.length && this._flushGuard < this._FLUSH_MAX;) {
            for (; this._debouncers.length;)
                this._debouncers.shift().complete();
            this._finishDebouncer && this._finishDebouncer.complete(), this._prepareFlush(), this._flushGuard++
        }
        this._flushGuard, this._FLUSH_MAX
    },
    _prepareFlush: function() {
        this._needsTakeRecords && CustomElements.takeRecords();
        for (var e = 0; e < this._staticFlushList.length; e++)
            this._staticFlushList[e]()
    },
    addStaticFlush: function(e) {
        this._staticFlushList.push(e)
    },
    removeStaticFlush: function(e) {
        var t = this._staticFlushList.indexOf(e);
        t >= 0 && this._staticFlushList.splice(t, 1)
    },
    addDebouncer: function(e) {
        this._debouncers.push(e), this._finishDebouncer = Polymer.Debounce(this._finishDebouncer, this._finishFlush)
    },
    _finishFlush: function() {
        Polymer.dom._debouncers = []
    }
}), Polymer.EventApi = function() {
    "use strict";
    var e = Polymer.DomApi.ctor,
        t = Polymer.Settings;
    return e.Event = function(e) {
        this.event = e
    }, t.useShadow ? e.Event.prototype = {
        get rootTarget() {
            return this.event.path[0]
        },
        get localTarget() {
            return this.event.target
        },
        get path() {
            var e = this.event.path;
            return Array.isArray(e) || (e = Array.prototype.slice.call(e)), e
        }
    } : e.Event.prototype = {
        get rootTarget() {
            return this.event.target
        },
        get localTarget() {
            for (var e = this.event.currentTarget, t = e && Polymer.dom(e).getOwnerRoot(), i = this.path, n = 0; n < i.length; n++)
                if (Polymer.dom(i[n]).getOwnerRoot() === t)
                    return i[n]
        },
        get path() {
            if (!this.event._path) {
                for (var e = [], t = this.rootTarget; t;) {
                    e.push(t);
                    var i = Polymer.dom(t).getDestinationInsertionPoints();
                    if (i.length) {
                        for (var n = 0; n < i.length - 1; n++)
                            e.push(i[n]);
                        t = i[i.length - 1]
                    } else
                        t = Polymer.dom(t).parentNode || t.host
                }
                e.push(window), this.event._path = e
            }
            return this.event._path
        }
    }, {
        factory: function(t) {
            return t.__eventApi || (t.__eventApi = new e.Event(t)), t.__eventApi
        }
    }
}(), function() {
    "use strict";
    var e = Polymer.DomApi.ctor,
        t = Polymer.Settings.useShadow;
    Object.defineProperty(e.prototype, "classList", {
        get: function() {
            return this._classList || (this._classList = new e.ClassList(this)), this._classList
        },
        configurable: !0
    }), e.ClassList = function(e) {
        this.domApi = e, this.node = e.node
    }, e.ClassList.prototype = {
        add: function() {
            this.node.classList.add.apply(this.node.classList, arguments), this._distributeParent()
        },
        remove: function() {
            this.node.classList.remove.apply(this.node.classList, arguments), this._distributeParent()
        },
        toggle: function() {
            this.node.classList.toggle.apply(this.node.classList, arguments), this._distributeParent()
        },
        _distributeParent: function() {
            t || this.domApi._maybeDistributeParent()
        },
        contains: function() {
            return this.node.classList.contains.apply(this.node.classList, arguments)
        }
    }
}(), function() {
    "use strict";
    var e = Polymer.DomApi.ctor,
        t = Polymer.Settings;
    if (e.EffectiveNodesObserver = function(e) {
        this.domApi = e, this.node = this.domApi.node, this._listeners = []
    }, e.EffectiveNodesObserver.prototype = {
        addListener: function(e) {
            this._isSetup || (this._setup(), this._isSetup = !0);
            var t = {
                fn: e,
                _nodes: []
            };
            return this._listeners.push(t), this._scheduleNotify(), t
        },
        removeListener: function(e) {
            var t = this._listeners.indexOf(e);
            t >= 0 && (this._listeners.splice(t, 1), e._nodes = []), this._hasListeners() || (this._cleanup(), this._isSetup = !1)
        },
        _setup: function() {
            this._observeContentElements(this.domApi.childNodes)
        },
        _cleanup: function() {
            this._unobserveContentElements(this.domApi.childNodes)
        },
        _hasListeners: function() {
            return Boolean(this._listeners.length)
        },
        _scheduleNotify: function() {
            this._debouncer && this._debouncer.stop(), this._debouncer = Polymer.Debounce(this._debouncer, this._notify), this._debouncer.context = this, Polymer.dom.addDebouncer(this._debouncer)
        },
        notify: function() {
            this._hasListeners() && this._scheduleNotify()
        },
        _notify: function() {
            this._beforeCallListeners(), this._callListeners()
        },
        _beforeCallListeners: function() {
            this._updateContentElements()
        },
        _updateContentElements: function() {
            this._observeContentElements(this.domApi.childNodes)
        },
        _observeContentElements: function(e) {
            for (var t, i = 0; i < e.length && (t = e[i]); i++)
                this._isContent(t) && (t.__observeNodesMap = t.__observeNodesMap || new WeakMap, t.__observeNodesMap.has(this) || t.__observeNodesMap.set(this, this._observeContent(t)))
        },
        _observeContent: function(e) {
            var t = this,
                i = Polymer.dom(e).observeNodes(function() {
                    t._scheduleNotify()
                });
            return i._avoidChangeCalculation = !0, i
        },
        _unobserveContentElements: function(e) {
            for (var t, i, n = 0; n < e.length && (t = e[n]); n++)
                this._isContent(t) && (i = t.__observeNodesMap.get(this)) && (Polymer.dom(t).unobserveNodes(i), t.__observeNodesMap.delete(this))
        },
        _isContent: function(e) {
            return "content" === e.localName
        },
        _callListeners: function() {
            for (var e, t = this._listeners, i = this._getEffectiveNodes(), n = 0; n < t.length && (e = t[n]); n++) {
                var r = this._generateListenerInfo(e, i);
                (r || e._alwaysNotify) && this._callListener(e, r)
            }
        },
        _getEffectiveNodes: function() {
            return this.domApi.getEffectiveChildNodes()
        },
        _generateListenerInfo: function(e, t) {
            if (e._avoidChangeCalculation)
                return !0;
            for (var i, n = e._nodes, r = {
                    target: this.node,
                    addedNodes: [],
                    removedNodes: []
                }, o = Polymer.ArraySplice.calculateSplices(t, n), s = 0; s < o.length && (i = o[s]); s++)
                for (var a, l = 0; l < i.removed.length && (a = i.removed[l]); l++)
                    r.removedNodes.push(a);
            for (s = 0; s < o.length && (i = o[s]); s++)
                for (l = i.index; l < i.index + i.addedCount; l++)
                    r.addedNodes.push(t[l]);
            return e._nodes = t, r.addedNodes.length || r.removedNodes.length ? r : void 0
        },
        _callListener: function(e, t) {
            return e.fn.call(this.node, t)
        },
        enableShadowAttributeTracking: function() {}
    }, t.useShadow) {
        var i = e.EffectiveNodesObserver.prototype._setup,
            n = e.EffectiveNodesObserver.prototype._cleanup;
        Polymer.Base.extend(e.EffectiveNodesObserver.prototype, {
            _setup: function() {
                if (!this._observer) {
                    var e = this;
                    this._mutationHandler = function(t) {
                        t && t.length && e._scheduleNotify()
                    }, this._observer = new MutationObserver(this._mutationHandler), this._boundFlush = function() {
                        e._flush()
                    }, Polymer.dom.addStaticFlush(this._boundFlush), this._observer.observe(this.node, {
                        childList: !0
                    })
                }
                i.call(this)
            },
            _cleanup: function() {
                this._observer.disconnect(), this._observer = null, this._mutationHandler = null, Polymer.dom.removeStaticFlush(this._boundFlush), n.call(this)
            },
            _flush: function() {
                this._observer && this._mutationHandler(this._observer.takeRecords())
            },
            enableShadowAttributeTracking: function() {
                if (this._observer) {
                    this._makeContentListenersAlwaysNotify(), this._observer.disconnect(), this._observer.observe(this.node, {
                        childList: !0,
                        attributes: !0,
                        subtree: !0
                    });
                    var e = this.domApi.getOwnerRoot(),
                        t = e && e.host;
                    t && Polymer.dom(t).observer && Polymer.dom(t).observer.enableShadowAttributeTracking()
                }
            },
            _makeContentListenersAlwaysNotify: function() {
                for (var e, t = 0; t < this._listeners.length; t++)
                    (e = this._listeners[t])._alwaysNotify = e._isContentListener
            }
        })
    }
}(), function() {
    "use strict";
    var e = Polymer.DomApi.ctor,
        t = Polymer.Settings;
    e.DistributedNodesObserver = function(t) {
        e.EffectiveNodesObserver.call(this, t)
    }, e.DistributedNodesObserver.prototype = Object.create(e.EffectiveNodesObserver.prototype), Polymer.Base.extend(e.DistributedNodesObserver.prototype, {
        _setup: function() {},
        _cleanup: function() {},
        _beforeCallListeners: function() {},
        _getEffectiveNodes: function() {
            return this.domApi.getDistributedNodes()
        }
    }), t.useShadow && Polymer.Base.extend(e.DistributedNodesObserver.prototype, {
        _setup: function() {
            if (!this._observer) {
                var e = this.domApi.getOwnerRoot(),
                    t = e && e.host;
                if (t) {
                    var i = this;
                    this._observer = Polymer.dom(t).observeNodes(function() {
                        i._scheduleNotify()
                    }), this._observer._isContentListener = !0, this._hasAttrSelect() && Polymer.dom(t).observer.enableShadowAttributeTracking()
                }
            }
        },
        _hasAttrSelect: function() {
            var e = this.node.getAttribute("select");
            return e && e.match(/[[.]+/)
        },
        _cleanup: function() {
            var e = this.domApi.getOwnerRoot(),
                t = e && e.host;
            t && Polymer.dom(t).unobserveNodes(this._observer), this._observer = null
        }
    })
}(), function() {
    var e = Polymer.DomApi,
        t = Polymer.TreeApi;
    function i(e, t) {
        t._distributedNodes.push(e);
        var i = e._destinationInsertionPoints;
        i ? i.push(t) : e._destinationInsertionPoints = [t]
    }
    function n(e) {
        var t = e._distributedNodes;
        if (t)
            for (var i = 0; i < t.length; i++) {
                var n = t[i]._destinationInsertionPoints;
                n && n.splice(n.indexOf(e) + 1, n.length)
            }
    }
    function r(e, t) {
        var i = t._destinationInsertionPoints;
        return i && i[i.length - 1] === e
    }
    function o(e) {
        return "content" == e.localName
    }
    function s(e) {
        for (var i, n = t.Logical.getChildNodes(e), r = 0; r < n.length; r++)
            if ((i = n[r]).localName && "content" === i.localName)
                return e.domHost
    }
    Polymer.Base._addFeature({
        _prepShady: function() {
            this._useContent = this._useContent || Boolean(this._template)
        },
        _setupShady: function() {
            this.shadyRoot = null, this.__domApi || (this.__domApi = null), this.__dom || (this.__dom = null), this._ownerShadyRoot || (this._ownerShadyRoot = void 0)
        },
        _poolContent: function() {
            this._useContent && t.Logical.saveChildNodes(this)
        },
        _setupRoot: function() {
            this._useContent && (this._createLocalRoot(), this.dataHost || function(e) {
                if (a && e)
                    for (var t = 0; t < e.length; t++)
                        CustomElements.upgrade(e[t])
            }(t.Logical.getChildNodes(this)))
        },
        _createLocalRoot: function() {
            this.shadyRoot = this.root, this.shadyRoot._distributionClean = !1, this.shadyRoot._hasDistributed = !1, this.shadyRoot._isShadyRoot = !0, this.shadyRoot._dirtyRoots = [];
            var e = this.shadyRoot._insertionPoints = !this._notes || this._notes._hasContent ? this.shadyRoot.querySelectorAll("content") : [];
            t.Logical.saveChildNodes(this.shadyRoot);
            for (var i, n = 0; n < e.length; n++)
                i = e[n], t.Logical.saveChildNodes(i), t.Logical.saveChildNodes(i.parentNode);
            this.shadyRoot.host = this
        },
        get domHost() {
            var e = Polymer.dom(this).getOwnerRoot();
            return e && e.host
        },
        distributeContent: function(e) {
            if (this.shadyRoot) {
                this.shadyRoot._invalidInsertionPoints = this.shadyRoot._invalidInsertionPoints || e;
                var t = function(e) {
                    for (; e && s(e);)
                        e = e.domHost;
                    return e
                }(this);
                Polymer.dom(this)._lazyDistribute(t)
            }
        },
        _distributeContent: function() {
            this._useContent && !this.shadyRoot._distributionClean && (this.shadyRoot._invalidInsertionPoints && (Polymer.dom(this)._updateInsertionPoints(this), this.shadyRoot._invalidInsertionPoints = !1), this._beginDistribute(), this._distributeDirtyRoots(), this._finishDistribute())
        },
        _beginDistribute: function() {
            this._useContent && e.hasInsertionPoint(this.shadyRoot) && (this._resetDistribution(), this._distributePool(this.shadyRoot, this._collectPool()))
        },
        _distributeDirtyRoots: function() {
            for (var e, t = this.shadyRoot._dirtyRoots, i = 0, n = t.length; i < n && (e = t[i]); i++)
                e._distributeContent();
            this.shadyRoot._dirtyRoots = []
        },
        _finishDistribute: function() {
            if (this._useContent) {
                if (this.shadyRoot._distributionClean = !0, e.hasInsertionPoint(this.shadyRoot))
                    this._composeTree(), function(t) {
                        for (var i, n = 0; n < t._insertionPoints.length; n++)
                            i = t._insertionPoints[n], e.hasApi(i) && Polymer.dom(i).notifyObserver()
                    }(this.shadyRoot);
                else if (this.shadyRoot._hasDistributed) {
                    var i = this._composeNode(this);
                    this._updateChildNodes(this, i)
                } else
                    t.Composed.clearChildNodes(this), this.appendChild(this.shadyRoot);
                this.shadyRoot._hasDistributed || e.hasApi(this) && Polymer.dom(this).notifyObserver(), this.shadyRoot._hasDistributed = !0
            }
        },
        elementMatches: function(t, i) {
            return i = i || this, e.matchesSelector.call(i, t)
        },
        _resetDistribution: function() {
            for (var e = t.Logical.getChildNodes(this), i = 0; i < e.length; i++) {
                var r = e[i];
                r._destinationInsertionPoints && (r._destinationInsertionPoints = void 0), o(r) && n(r)
            }
            for (var s = this.shadyRoot._insertionPoints, a = 0; a < s.length; a++)
                s[a]._distributedNodes = []
        },
        _collectPool: function() {
            for (var e = [], i = t.Logical.getChildNodes(this), n = 0; n < i.length; n++) {
                var r = i[n];
                o(r) ? e.push.apply(e, r._distributedNodes) : e.push(r)
            }
            return e
        },
        _distributePool: function(i, n) {
            for (var r, o = i._insertionPoints, s = 0, a = o.length; s < a && (r = o[s]); s++)
                this._distributeInsertionPoint(r, n), l = r, h = void 0, (h = t.Logical.getParentNode(l)) && h.shadyRoot && e.hasInsertionPoint(h.shadyRoot) && h.shadyRoot._distributionClean && (h.shadyRoot._distributionClean = !1, this.shadyRoot._dirtyRoots.push(h));
            var l,
                h
        },
        _distributeInsertionPoint: function(e, n) {
            for (var r, o = !1, s = 0, a = n.length; s < a; s++)
                (r = n[s]) && this._matchesContentSelect(r, e) && (i(r, e), n[s] = void 0, o = !0);
            if (!o)
                for (var l = t.Logical.getChildNodes(e), h = 0; h < l.length; h++)
                    i(l[h], e)
        },
        _composeTree: function() {
            this._updateChildNodes(this, this._composeNode(this));
            for (var e, i, n = this.shadyRoot._insertionPoints, r = 0, o = n.length; r < o && (e = n[r]); r++)
                (i = t.Logical.getParentNode(e))._useContent || i === this || i === this.shadyRoot || this._updateChildNodes(i, this._composeNode(i))
        },
        _composeNode: function(e) {
            for (var i = [], n = t.Logical.getChildNodes(e.shadyRoot || e), s = 0; s < n.length; s++) {
                var a = n[s];
                if (o(a))
                    for (var l = a._distributedNodes, h = 0; h < l.length; h++) {
                        var c = l[h];
                        r(a, c) && i.push(c)
                    }
                else
                    i.push(a)
            }
            return i
        },
        _updateChildNodes: function(e, i) {
            for (var n = t.Composed.getChildNodes(e), r = Polymer.ArraySplice.calculateSplices(i, n), o = 0, s = 0; o < r.length && (h = r[o]); o++) {
                for (var a, l = 0; l < h.removed.length && (a = h.removed[l]); l++)
                    t.Composed.getParentNode(a) === e && t.Composed.removeChild(e, a), n.splice(h.index + s, 1);
                s -= h.addedCount
            }
            var h,
                c;
            for (o = 0; o < r.length && (h = r[o]); o++)
                for (c = n[h.index], l = h.index; l < h.index + h.addedCount; l++)
                    a = i[l], t.Composed.insertBefore(e, a, c), n.splice(l, 0, a)
        },
        _matchesContentSelect: function(e, t) {
            var i = t.getAttribute("select");
            return !i || !(i = i.trim()) || e instanceof Element && !!/^(:not\()?[*.#[a-zA-Z_|]/.test(i) && this.elementMatches(i, e)
        },
        _elementAdd: function() {},
        _elementRemove: function() {}
    });
    var a = window.CustomElements && !CustomElements.useNative
}(), Polymer.Settings.useShadow && Polymer.Base._addFeature({
    _poolContent: function() {},
    _beginDistribute: function() {},
    distributeContent: function() {},
    _distributeContent: function() {},
    _finishDistribute: function() {},
    _createLocalRoot: function() {
        this.createShadowRoot(), this.shadowRoot.appendChild(this.root), this.root = this.shadowRoot
    }
}), Polymer.Async = {
    _currVal: 0,
    _lastVal: 0,
    _callbacks: [],
    _twiddleContent: 0,
    _twiddle: document.createTextNode(""),
    run: function(e, t) {
        return t > 0 ? ~setTimeout(e, t) : (this._twiddle.textContent = this._twiddleContent++, this._callbacks.push(e), this._currVal++)
    },
    cancel: function(e) {
        if (e < 0)
            clearTimeout(~e);
        else {
            var t = e - this._lastVal;
            if (t >= 0) {
                if (!this._callbacks[t])
                    throw "invalid async handle: " + e;
                this._callbacks[t] = null
            }
        }
    },
    _atEndOfMicrotask: function() {
        for (var e = this._callbacks.length, t = 0; t < e; t++) {
            var i = this._callbacks[t];
            if (i)
                try {
                    i()
                } catch (e) {
                    throw t++, this._callbacks.splice(0, t), this._lastVal += t, this._twiddle.textContent = this._twiddleContent++, e
                }
        }
        this._callbacks.splice(0, e), this._lastVal += e
    }
}, new window.MutationObserver(function() {
    Polymer.Async._atEndOfMicrotask()
}).observe(Polymer.Async._twiddle, {
    characterData: !0
}), Polymer.Debounce = function() {
    var e = Polymer.Async,
        t = function(e) {
            this.context = e;
            var t = this;
            this.boundComplete = function() {
                t.complete()
            }
        };
    return t.prototype = {
        go: function(t, i) {
            var n;
            this.finish = function() {
                e.cancel(n)
            }, n = e.run(this.boundComplete, i), this.callback = t
        },
        stop: function() {
            this.finish && (this.finish(), this.finish = null, this.callback = null)
        },
        complete: function() {
            if (this.finish) {
                var e = this.callback;
                this.stop(), e.call(this.context)
            }
        }
    }, function(e, i, n) {
        return e ? e.stop() : e = new t(this), e.go(i, n), e
    }
}(), Polymer.Base._addFeature({
    _setupDebouncers: function() {
        this._debouncers = {}
    },
    debounce: function(e, t, i) {
        return this._debouncers[e] = Polymer.Debounce.call(this, this._debouncers[e], t, i)
    },
    isDebouncerActive: function(e) {
        var t = this._debouncers[e];
        return !(!t || !t.finish)
    },
    flushDebouncer: function(e) {
        var t = this._debouncers[e];
        t && t.complete()
    },
    cancelDebouncer: function(e) {
        var t = this._debouncers[e];
        t && t.stop()
    }
}), Polymer.DomModule = document.createElement("dom-module"), Polymer.Base._addFeature({
    _registerFeatures: function() {
        this._prepIs(), this._prepBehaviors(), this._prepConstructor(), this._prepTemplate(), this._prepShady(), this._prepPropertyInfo()
    },
    _prepBehavior: function(e) {
        this._addHostAttributes(e.hostAttributes)
    },
    _initFeatures: function() {
        this._registerHost(), this._template && (this._poolContent(), this._beginHosting(), this._stampTemplate(), this._endHosting()), this._marshalHostAttributes(), this._setupDebouncers(), this._marshalBehaviors(), this._tryReady()
    },
    _marshalBehavior: function(e) {}
}), Polymer.nar = [], Polymer.Annotations = {
    parseAnnotations: function(e) {
        var t = [],
            i = e._content || e.content;
        return this._parseNodeAnnotations(i, t, e.hasAttribute("strip-whitespace")), t
    },
    _parseNodeAnnotations: function(e, t, i) {
        return e.nodeType === Node.TEXT_NODE ? this._parseTextNodeAnnotation(e, t) : this._parseElementAnnotations(e, t, i)
    },
    _bindingRegex: new RegExp("(\\[\\[|{{)\\s*(?:(!)\\s*)?((?:[a-zA-Z_$][\\w.:$\\-*]*)\\s*(?:\\(\\s*(?:(?:(?:(?:[a-zA-Z_$][\\w.:$\\-*]*)|(?:[-+]?[0-9]*\\.?[0-9]+(?:[eE][-+]?[0-9]+)?)|(?:(?:'(?:[^'\\\\]|\\\\.)*')|(?:\"(?:[^\"\\\\]|\\\\.)*\"))\\s*)(?:,\\s*(?:(?:[a-zA-Z_$][\\w.:$\\-*]*)|(?:[-+]?[0-9]*\\.?[0-9]+(?:[eE][-+]?[0-9]+)?)|(?:(?:'(?:[^'\\\\]|\\\\.)*')|(?:\"(?:[^\"\\\\]|\\\\.)*\"))\\s*))*)?)\\)\\s*)?)(?:]]|}})", "g"),
    _parseBindings: function(e) {
        for (var t, i = this._bindingRegex, n = [], r = 0; null !== (t = i.exec(e));) {
            t.index > r && n.push({
                literal: e.slice(r, t.index)
            });
            var o,
                s,
                a,
                l = t[1][0],
                h = Boolean(t[2]),
                c = t[3].trim();
            "{" == l && (a = c.indexOf("::")) > 0 && (s = c.substring(a + 2), c = c.substring(0, a), o = !0), n.push({
                compoundIndex: n.length,
                value: c,
                mode: l,
                negate: h,
                event: s,
                customEvent: o
            }), r = i.lastIndex
        }
        if (r && r < e.length) {
            var u = e.substring(r);
            u && n.push({
                literal: u
            })
        }
        if (n.length)
            return n
    },
    _literalFromParts: function(e) {
        for (var t = "", i = 0; i < e.length; i++)
            t += e[i].literal || "";
        return t
    },
    _parseTextNodeAnnotation: function(e, t) {
        var i = this._parseBindings(e.textContent);
        if (i) {
            e.textContent = this._literalFromParts(i) || " ";
            var n = {
                bindings: [{
                    kind: "text",
                    name: "textContent",
                    parts: i,
                    isCompound: 1 !== i.length
                }]
            };
            return t.push(n), n
        }
    },
    _parseElementAnnotations: function(e, t, i) {
        var n = {
            bindings: [],
            events: []
        };
        return "content" === e.localName && (t._hasContent = !0), this._parseChildNodesAnnotations(e, n, t, i), e.attributes && (this._parseNodeAttributeAnnotations(e, n, t), this.prepElement && this.prepElement(e)), (n.bindings.length || n.events.length || n.id) && t.push(n), n
    },
    _parseChildNodesAnnotations: function(e, t, i, n) {
        if (e.firstChild)
            for (var r = e.firstChild, o = 0; r;) {
                var s = r.nextSibling;
                if ("template" !== r.localName || r.hasAttribute("preserve-content") || this._parseTemplate(r, o, i, t), r.nodeType === Node.TEXT_NODE) {
                    for (var a = s; a && a.nodeType === Node.TEXT_NODE;)
                        r.textContent += a.textContent, s = a.nextSibling, e.removeChild(a), a = s;
                    n && !r.textContent.trim() && (e.removeChild(r), o--)
                }
                if (r.parentNode) {
                    var l = this._parseNodeAnnotations(r, i, n);
                    l && (l.parent = t, l.index = o)
                }
                r = s, o++
            }
    },
    _parseTemplate: function(e, t, i, n) {
        var r = document.createDocumentFragment();
        r._notes = this.parseAnnotations(e), r.appendChild(e.content), i.push({
            bindings: Polymer.nar,
            events: Polymer.nar,
            templateContent: r,
            parent: n,
            index: t
        })
    },
    _parseNodeAttributeAnnotations: function(e, t) {
        for (var i, n = Array.prototype.slice.call(e.attributes), r = n.length - 1; i = n[r]; r--) {
            var o,
                s = i.name,
                a = i.value;
            "on-" === s.slice(0, 3) ? (e.removeAttribute(s), t.events.push({
                name: s.slice(3),
                value: a
            })) : (o = this._parseNodeAttributeAnnotation(e, s, a)) ? t.bindings.push(o) : "id" === s && (t.id = a)
        }
    },
    _parseNodeAttributeAnnotation: function(e, t, i) {
        var n = this._parseBindings(i);
        if (n) {
            var r = t,
                o = "property";
            "$" == t[t.length - 1] && (t = t.slice(0, -1), o = "attribute");
            var s = this._literalFromParts(n);
            s && "attribute" == o && e.setAttribute(t, s), "input" === e.localName && "value" === r && e.setAttribute(r, ""), e.removeAttribute(r);
            var a = Polymer.CaseMap.dashToCamelCase(t);
            return "property" === o && (t = a), {
                kind: o,
                name: t,
                propertyName: a,
                parts: n,
                literal: s,
                isCompound: 1 !== n.length
            }
        }
    },
    findAnnotatedNode: function(e, t) {
        var i = t.parent && Polymer.Annotations.findAnnotatedNode(e, t.parent);
        if (!i)
            return e;
        for (var n = i.firstChild, r = 0; n; n = n.nextSibling)
            if (t.index === r++)
                return n
    }
}, function() {
    function e(e, i) {
        return e.replace(r, function(e, n, r, o) {
            return n + "'" + t(r.replace(/["']/g, ""), i) + "'" + o
        })
    }
    function t(e, t) {
        if (e && "#" === e[0])
            return e;
        var i = function(e) {
            return e.__urlResolver || (e.__urlResolver = e.createElement("a"))
        }(t);
        return i.href = e, i.href || e
    }
    var i,
        n,
        r = /(url\()([^)]*)(\))/g,
        o = {
            "*": ["href", "src", "style", "url"],
            form: ["action"]
        },
        s = /\{\{|\[\[/;
    Polymer.ResolveUrl = {
        resolveCss: e,
        resolveAttrs: function(i, n) {
            for (var r in o)
                for (var a, l, h, c = o[r], u = 0, d = c.length; u < d && (a = c[u]); u++)
                    "*" !== r && i.localName !== r || (h = (l = i.attributes[a]) && l.value) && h.search(s) < 0 && (l.value = "style" === a ? e(h, n) : t(h, n))
        },
        resolveUrl: function(e, r) {
            return i || (i = document.implementation.createHTMLDocument("temp"), n = i.createElement("base"), i.head.appendChild(n)), n.href = r, t(e, i)
        }
    }
}(), Polymer.Base._addFeature({
    _prepAnnotations: function() {
        if (this._template) {
            var e = this;
            Polymer.Annotations.prepElement = function(t) {
                e._prepElement(t)
            }, this._template._content && this._template._content._notes ? this._notes = this._template._content._notes : (this._notes = Polymer.Annotations.parseAnnotations(this._template), this._processAnnotations(this._notes)), Polymer.Annotations.prepElement = null
        } else
            this._notes = []
    },
    _processAnnotations: function(e) {
        for (var t = 0; t < e.length; t++) {
            for (var i = e[t], n = 0; n < i.bindings.length; n++)
                for (var r = i.bindings[n], o = 0; o < r.parts.length; o++) {
                    var s = r.parts[o];
                    if (!s.literal) {
                        var a = this._parseMethod(s.value);
                        a ? s.signature = a : s.model = this._modelForPath(s.value)
                    }
                }
            if (i.templateContent) {
                this._processAnnotations(i.templateContent._notes);
                var l = i.templateContent._parentProps = this._discoverTemplateParentProps(i.templateContent._notes),
                    h = [];
                for (var c in l) {
                    var u = "_parent_" + c;
                    h.push({
                        index: i.index,
                        kind: "property",
                        name: u,
                        propertyName: u,
                        parts: [{
                            mode: "{",
                            model: c,
                            value: c
                        }]
                    })
                }
                i.bindings = i.bindings.concat(h)
            }
        }
    },
    _discoverTemplateParentProps: function(e) {
        for (var t, i = {}, n = 0; n < e.length && (t = e[n]); n++) {
            for (var r, o = 0, s = t.bindings; o < s.length && (r = s[o]); o++)
                for (var a, l = 0, h = r.parts; l < h.length && (a = h[l]); l++)
                    if (a.signature) {
                        for (var c = a.signature.args, u = 0; u < c.length; u++) {
                            var d = c[u].model;
                            d && (i[d] = !0)
                        }
                        a.signature.dynamicFn && (i[a.signature.method] = !0)
                    } else
                        a.model && (i[a.model] = !0);
            if (t.templateContent) {
                var f = t.templateContent._parentProps;
                Polymer.Base.mixin(i, f)
            }
        }
        return i
    },
    _prepElement: function(e) {
        Polymer.ResolveUrl.resolveAttrs(e, this._template.ownerDocument)
    },
    _findAnnotatedNode: Polymer.Annotations.findAnnotatedNode,
    _marshalAnnotationReferences: function() {
        this._template && (this._marshalIdNodes(), this._marshalAnnotatedNodes(), this._marshalAnnotatedListeners())
    },
    _configureAnnotationReferences: function() {
        for (var e = this._notes, t = this._nodes, i = 0; i < e.length; i++) {
            var n = e[i],
                r = t[i];
            this._configureTemplateContent(n, r), this._configureCompoundBindings(n, r)
        }
    },
    _configureTemplateContent: function(e, t) {
        e.templateContent && (t._content = e.templateContent)
    },
    _configureCompoundBindings: function(e, t) {
        for (var i = e.bindings, n = 0; n < i.length; n++) {
            var r = i[n];
            if (r.isCompound) {
                for (var o = t.__compoundStorage__ || (t.__compoundStorage__ = {}), s = r.parts, a = new Array(s.length), l = 0; l < s.length; l++)
                    a[l] = s[l].literal;
                var h = r.name;
                o[h] = a, r.literal && "property" == r.kind && (t._configValue ? t._configValue(h, r.literal) : t[h] = r.literal)
            }
        }
    },
    _marshalIdNodes: function() {
        this.$ = {};
        for (var e, t = 0, i = this._notes.length; t < i && (e = this._notes[t]); t++)
            e.id && (this.$[e.id] = this._findAnnotatedNode(this.root, e))
    },
    _marshalAnnotatedNodes: function() {
        if (this._notes && this._notes.length) {
            for (var e = new Array(this._notes.length), t = 0; t < this._notes.length; t++)
                e[t] = this._findAnnotatedNode(this.root, this._notes[t]);
            this._nodes = e
        }
    },
    _marshalAnnotatedListeners: function() {
        for (var e, t = 0, i = this._notes.length; t < i && (e = this._notes[t]); t++)
            if (e.events && e.events.length)
                for (var n, r = this._findAnnotatedNode(this.root, e), o = 0, s = e.events; o < s.length && (n = s[o]); o++)
                    this.listen(r, n.name, n.value)
    }
}), Polymer.Base._addFeature({
    listeners: {},
    _listenListeners: function(e) {
        var t,
            i,
            n;
        for (n in e)
            n.indexOf(".") < 0 ? (t = this, i = n) : (i = n.split("."), t = this.$[i[0]], i = i[1]), this.listen(t, i, e[n])
    },
    listen: function(e, t, i) {
        var n = this._recallEventHandler(this, t, e, i);
        n || (n = this._createEventHandler(e, t, i)), n._listening || (this._listen(e, t, n), n._listening = !0)
    },
    _boundListenerKey: function(e, t) {
        return e + ":" + t
    },
    _recordEventHandler: function(e, t, i, n, r) {
        var o = e.__boundListeners;
        o || (o = e.__boundListeners = new WeakMap);
        var s = o.get(i);
        s || (s = {}, o.set(i, s)), s[this._boundListenerKey(t, n)] = r
    },
    _recallEventHandler: function(e, t, i, n) {
        var r = e.__boundListeners;
        if (r) {
            var o = r.get(i);
            if (o)
                return o[this._boundListenerKey(t, n)]
        }
    },
    _createEventHandler: function(e, t, i) {
        var n = this,
            r = function(e) {
                n[i] ? n[i](e, e.detail) : n._warn(n._logf("_createEventHandler", "listener method `" + i + "` not defined"))
            };
        return r._listening = !1, this._recordEventHandler(n, t, e, i, r), r
    },
    unlisten: function(e, t, i) {
        var n = this._recallEventHandler(this, t, e, i);
        n && (this._unlisten(e, t, n), n._listening = !1)
    },
    _listen: function(e, t, i) {
        e.addEventListener(t, i)
    },
    _unlisten: function(e, t, i) {
        e.removeEventListener(t, i)
    }
}), function() {
    "use strict";
    var e = Polymer.DomApi.wrap,
        t = "string" == typeof document.head.style.touchAction,
        i = "__polymerGesturesHandled",
        n = "__polymerGesturesTouchAction",
        r = ["mousedown", "mousemove", "mouseup", "click"],
        o = [0, 1, 4, 2],
        s = function() {
            try {
                return 1 === new MouseEvent("test", {
                    buttons: 1
                }).buttons
            } catch (e) {
                return !1
            }
        }(),
        a = navigator.userAgent.match(/iP(?:[oa]d|hone)|Android/),
        l = function(e) {
            if (e[i] = {
                skip: !0
            }, "click" === e.type) {
                for (var t = Polymer.dom(e).path, n = 0; n < t.length; n++)
                    if (t[n] === u.mouse.target)
                        return;
                e.preventDefault(), e.stopPropagation()
            }
        };
    function h(e) {
        for (var t, i = 0; i < r.length; i++)
            t = r[i], e ? document.addEventListener(t, l, !0) : document.removeEventListener(t, l, !0)
    }
    function c(e) {
        var t = e.type;
        if (-1 === r.indexOf(t))
            return !1;
        if ("mousemove" === t) {
            var i = void 0 === e.buttons ? 1 : e.buttons;
            return e instanceof window.MouseEvent && !s && (i = o[e.which] || 0), Boolean(1 & i)
        }
        return 0 === (void 0 === e.button ? 0 : e.button)
    }
    var u = {
        mouse: {
            target: null,
            mouseIgnoreJob: null
        },
        touch: {
            x: 0,
            y: 0,
            id: -1,
            scrollDecided: !1
        }
    };
    function d(e, t, i) {
        e.movefn = t, e.upfn = i, document.addEventListener("mousemove", t), document.addEventListener("mouseup", i)
    }
    function f(e) {
        document.removeEventListener("mousemove", e.movefn), document.removeEventListener("mouseup", e.upfn), e.movefn = null, e.upfn = null
    }
    var p = {
        gestures: {},
        recognizers: [],
        deepTargetFind: function(e, t) {
            for (var i = document.elementFromPoint(e, t), n = i; n && n.shadowRoot;)
                (n = n.shadowRoot.elementFromPoint(e, t)) && (i = n);
            return i
        },
        findOriginalTarget: function(e) {
            return e.path ? e.path[0] : e.target
        },
        handleNative: function(n) {
            var r,
                o = n.type,
                s = e(n.currentTarget).__polymerGestures;
            if (s) {
                var l = s[o];
                if (l) {
                    if (!n[i] && (n[i] = {}, "touch" === o.slice(0, 5))) {
                        var c = n.changedTouches[0];
                        if ("touchstart" === o && 1 === n.touches.length && (u.touch.id = c.identifier), u.touch.id !== c.identifier)
                            return;
                        t || "touchstart" !== o && "touchmove" !== o || p.handleTouchAction(n), "touchend" === o && (u.mouse.target = Polymer.dom(n).rootTarget, a || (u.mouse.mouseIgnoreJob || h(!0), u.mouse.mouseIgnoreJob = Polymer.Debounce(u.mouse.mouseIgnoreJob, function() {
                            h(), u.mouse.target = null, u.mouse.mouseIgnoreJob = null
                        }, 2500)))
                    }
                    if (!(r = n[i]).skip) {
                        for (var d, f = p.recognizers, _ = 0; _ < f.length; _++)
                            l[(d = f[_]).name] && !r[d.name] && d.flow && d.flow.start.indexOf(n.type) > -1 && d.reset && d.reset();
                        for (_ = 0; _ < f.length; _++)
                            l[(d = f[_]).name] && !r[d.name] && (r[d.name] = !0, d[o](n))
                    }
                }
            }
        },
        handleTouchAction: function(e) {
            var t = e.changedTouches[0],
                i = e.type;
            if ("touchstart" === i)
                u.touch.x = t.clientX, u.touch.y = t.clientY, u.touch.scrollDecided = !1;
            else if ("touchmove" === i) {
                if (u.touch.scrollDecided)
                    return;
                u.touch.scrollDecided = !0;
                var r = function(e) {
                        for (var t, i = Polymer.dom(e).path, r = "auto", o = 0; o < i.length; o++)
                            if ((t = i[o])[n]) {
                                r = t[n];
                                break
                            }
                        return r
                    }(e),
                    o = !1,
                    s = Math.abs(u.touch.x - t.clientX),
                    a = Math.abs(u.touch.y - t.clientY);
                e.cancelable && ("none" === r ? o = !0 : "pan-x" === r ? o = a > s : "pan-y" === r && (o = s > a)), o ? e.preventDefault() : p.prevent("track")
            }
        },
        add: function(t, i, n) {
            t = e(t);
            var o = this.gestures[i],
                s = o.deps,
                l = o.name,
                h = t.__polymerGestures;
            h || (t.__polymerGestures = h = {});
            for (var c, u, d = 0; d < s.length; d++)
                c = s[d], a && r.indexOf(c) > -1 || ((u = h[c]) || (h[c] = u = {
                    _count: 0
                }), 0 === u._count && t.addEventListener(c, this.handleNative), u[l] = (u[l] || 0) + 1, u._count = (u._count || 0) + 1);
            t.addEventListener(i, n), o.touchAction && this.setTouchAction(t, o.touchAction)
        },
        remove: function(t, i, n) {
            t = e(t);
            var r = this.gestures[i],
                o = r.deps,
                s = r.name,
                a = t.__polymerGestures;
            if (a)
                for (var l, h, c = 0; c < o.length; c++)
                    (h = a[l = o[c]]) && h[s] && (h[s] = (h[s] || 1) - 1, h._count = (h._count || 1) - 1, 0 === h._count && t.removeEventListener(l, this.handleNative));
            t.removeEventListener(i, n)
        },
        register: function(e) {
            this.recognizers.push(e);
            for (var t = 0; t < e.emits.length; t++)
                this.gestures[e.emits[t]] = e
        },
        findRecognizerByEvent: function(e) {
            for (var t, i = 0; i < this.recognizers.length; i++) {
                t = this.recognizers[i];
                for (var n = 0; n < t.emits.length; n++)
                    if (t.emits[n] === e)
                        return t
            }
            return null
        },
        setTouchAction: function(e, i) {
            t && (e.style.touchAction = i), e[n] = i
        },
        fire: function(e, t, i) {
            if (Polymer.Base.fire(t, i, {
                node: e,
                bubbles: !0,
                cancelable: !0
            }).defaultPrevented) {
                var n = i.sourceEvent;
                n && n.preventDefault && n.preventDefault()
            }
        },
        prevent: function(e) {
            var t = this.findRecognizerByEvent(e);
            t.info && (t.info.prevent = !0)
        },
        resetMouseCanceller: function() {
            u.mouse.mouseIgnoreJob && u.mouse.mouseIgnoreJob.complete()
        }
    };
    p.register({
        name: "downup",
        deps: ["mousedown", "touchstart", "touchend"],
        flow: {
            start: ["mousedown", "touchstart"],
            end: ["mouseup", "touchend"]
        },
        emits: ["down", "up"],
        info: {
            movefn: null,
            upfn: null
        },
        reset: function() {
            f(this.info)
        },
        mousedown: function(e) {
            if (c(e)) {
                var t = p.findOriginalTarget(e),
                    i = this;
                d(this.info, function(e) {
                    c(e) || (i.fire("up", t, e), f(i.info))
                }, function(e) {
                    c(e) && i.fire("up", t, e), f(i.info)
                }), this.fire("down", t, e)
            }
        },
        touchstart: function(e) {
            this.fire("down", p.findOriginalTarget(e), e.changedTouches[0])
        },
        touchend: function(e) {
            this.fire("up", p.findOriginalTarget(e), e.changedTouches[0])
        },
        fire: function(e, t, i) {
            p.fire(t, e, {
                x: i.clientX,
                y: i.clientY,
                sourceEvent: i,
                prevent: function(e) {
                    return p.prevent(e)
                }
            })
        }
    }), p.register({
        name: "track",
        touchAction: "none",
        deps: ["mousedown", "touchstart", "touchmove", "touchend"],
        flow: {
            start: ["mousedown", "touchstart"],
            end: ["mouseup", "touchend"]
        },
        emits: ["track"],
        info: {
            x: 0,
            y: 0,
            state: "start",
            started: !1,
            moves: [],
            addMove: function(e) {
                this.moves.length > 2 && this.moves.shift(), this.moves.push(e)
            },
            movefn: null,
            upfn: null,
            prevent: !1
        },
        reset: function() {
            this.info.state = "start", this.info.started = !1, this.info.moves = [], this.info.x = 0, this.info.y = 0, this.info.prevent = !1, f(this.info)
        },
        hasMovedEnough: function(e, t) {
            if (this.info.prevent)
                return !1;
            if (this.info.started)
                return !0;
            var i = Math.abs(this.info.x - e),
                n = Math.abs(this.info.y - t);
            return i >= 5 || n >= 5
        },
        mousedown: function(e) {
            if (c(e)) {
                var t = p.findOriginalTarget(e),
                    i = this,
                    n = function(e) {
                        var n = e.clientX,
                            r = e.clientY;
                        i.hasMovedEnough(n, r) && (i.info.state = i.info.started ? "mouseup" === e.type ? "end" : "track" : "start", "start" === i.info.state && p.prevent("tap"), i.info.addMove({
                            x: n,
                            y: r
                        }), c(e) || (i.info.state = "end", f(i.info)), i.fire(t, e), i.info.started = !0)
                    };
                d(this.info, n, function(e) {
                    i.info.started && n(e), f(i.info)
                }), this.info.x = e.clientX, this.info.y = e.clientY
            }
        },
        touchstart: function(e) {
            var t = e.changedTouches[0];
            this.info.x = t.clientX, this.info.y = t.clientY
        },
        touchmove: function(e) {
            var t = p.findOriginalTarget(e),
                i = e.changedTouches[0],
                n = i.clientX,
                r = i.clientY;
            this.hasMovedEnough(n, r) && ("start" === this.info.state && p.prevent("tap"), this.info.addMove({
                x: n,
                y: r
            }), this.fire(t, i), this.info.state = "track", this.info.started = !0)
        },
        touchend: function(e) {
            var t = p.findOriginalTarget(e),
                i = e.changedTouches[0];
            this.info.started && (this.info.state = "end", this.info.addMove({
                x: i.clientX,
                y: i.clientY
            }), this.fire(t, i))
        },
        fire: function(e, t) {
            var i,
                n = this.info.moves[this.info.moves.length - 2],
                r = this.info.moves[this.info.moves.length - 1],
                o = r.x - this.info.x,
                s = r.y - this.info.y,
                a = 0;
            return n && (i = r.x - n.x, a = r.y - n.y), p.fire(e, "track", {
                state: this.info.state,
                x: t.clientX,
                y: t.clientY,
                dx: o,
                dy: s,
                ddx: i,
                ddy: a,
                sourceEvent: t,
                hover: function() {
                    return p.deepTargetFind(t.clientX, t.clientY)
                }
            })
        }
    }), p.register({
        name: "tap",
        deps: ["mousedown", "click", "touchstart", "touchend"],
        flow: {
            start: ["mousedown", "touchstart"],
            end: ["click", "touchend"]
        },
        emits: ["tap"],
        info: {
            x: NaN,
            y: NaN,
            prevent: !1
        },
        reset: function() {
            this.info.x = NaN, this.info.y = NaN, this.info.prevent = !1
        },
        save: function(e) {
            this.info.x = e.clientX, this.info.y = e.clientY
        },
        mousedown: function(e) {
            c(e) && this.save(e)
        },
        click: function(e) {
            c(e) && this.forward(e)
        },
        touchstart: function(e) {
            this.save(e.changedTouches[0])
        },
        touchend: function(e) {
            this.forward(e.changedTouches[0])
        },
        forward: function(e) {
            var t = Math.abs(e.clientX - this.info.x),
                i = Math.abs(e.clientY - this.info.y),
                n = p.findOriginalTarget(e);
            (isNaN(t) || isNaN(i) || t <= 25 && i <= 25 || function(e) {
                if ("click" === e.type) {
                    if (0 === e.detail)
                        return !0;
                    var t = p.findOriginalTarget(e).getBoundingClientRect(),
                        i = e.pageX,
                        n = e.pageY;
                    return !(i >= t.left && i <= t.right && n >= t.top && n <= t.bottom)
                }
                return !1
            }(e)) && (this.info.prevent || p.fire(n, "tap", {
                x: e.clientX,
                y: e.clientY,
                sourceEvent: e
            }))
        }
    });
    var _ = {
        x: "pan-x",
        y: "pan-y",
        none: "none",
        all: "auto"
    };
    Polymer.Base._addFeature({
        _setupGestures: function() {
            this.__polymerGestures = null
        },
        _listen: function(e, t, i) {
            p.gestures[t] ? p.add(e, t, i) : e.addEventListener(t, i)
        },
        _unlisten: function(e, t, i) {
            p.gestures[t] ? p.remove(e, t, i) : e.removeEventListener(t, i)
        },
        setScrollDirection: function(e, t) {
            t = t || this, p.setTouchAction(t, _[e] || "auto")
        }
    }), Polymer.Gestures = p
}(), Polymer.Base._addFeature({
    $$: function(e) {
        return Polymer.dom(this.root).querySelector(e)
    },
    toggleClass: function(e, t, i) {
        i = i || this, 1 == arguments.length && (t = !i.classList.contains(e)), t ? Polymer.dom(i).classList.add(e) : Polymer.dom(i).classList.remove(e)
    },
    toggleAttribute: function(e, t, i) {
        i = i || this, 1 == arguments.length && (t = !i.hasAttribute(e)), t ? Polymer.dom(i).setAttribute(e, "") : Polymer.dom(i).removeAttribute(e)
    },
    classFollows: function(e, t, i) {
        i && Polymer.dom(i).classList.remove(e), t && Polymer.dom(t).classList.add(e)
    },
    attributeFollows: function(e, t, i) {
        i && Polymer.dom(i).removeAttribute(e), t && Polymer.dom(t).setAttribute(e, "")
    },
    getEffectiveChildNodes: function() {
        return Polymer.dom(this).getEffectiveChildNodes()
    },
    getEffectiveChildren: function() {
        return Polymer.dom(this).getEffectiveChildNodes().filter(function(e) {
            return e.nodeType === Node.ELEMENT_NODE
        })
    },
    getEffectiveTextContent: function() {
        for (var e, t = this.getEffectiveChildNodes(), i = [], n = 0; e = t[n]; n++)
            e.nodeType !== Node.COMMENT_NODE && i.push(Polymer.dom(e).textContent);
        return i.join("")
    },
    queryEffectiveChildren: function(e) {
        var t = Polymer.dom(this).queryDistributedElements(e);
        return t && t[0]
    },
    queryAllEffectiveChildren: function(e) {
        return Polymer.dom(this).queryDistributedElements(e)
    },
    getContentChildNodes: function(e) {
        var t = Polymer.dom(this.root).querySelector(e || "content");
        return t ? Polymer.dom(t).getDistributedNodes() : []
    },
    getContentChildren: function(e) {
        return this.getContentChildNodes(e).filter(function(e) {
            return e.nodeType === Node.ELEMENT_NODE
        })
    },
    fire: function(e, t, i) {
        var n = (i = i || Polymer.nob).node || this;
        t = null === t || void 0 === t ? {} : t;
        var r = void 0 === i.bubbles || i.bubbles,
            o = Boolean(i.cancelable),
            s = i._useCache,
            a = this._getEvent(e, r, o, s);
        return a.detail = t, s && (this.__eventCache[e] = null), n.dispatchEvent(a), s && (this.__eventCache[e] = a), a
    },
    __eventCache: {},
    _getEvent: function(e, t, i, n) {
        var r = n && this.__eventCache[e];
        return r && r.bubbles == t && r.cancelable == i || (r = new Event(e, {
            bubbles: Boolean(t),
            cancelable: i
        })), r
    },
    async: function(e, t) {
        var i = this;
        return Polymer.Async.run(function() {
            e.call(i)
        }, t)
    },
    cancelAsync: function(e) {
        Polymer.Async.cancel(e)
    },
    arrayDelete: function(e, t) {
        var i;
        if (Array.isArray(e)) {
            if ((i = e.indexOf(t)) >= 0)
                return e.splice(i, 1)
        } else if ((i = this._get(e).indexOf(t)) >= 0)
            return this.splice(e, i, 1)
    },
    transform: function(e, t) {
        (t = t || this).style.webkitTransform = e, t.style.transform = e
    },
    translate3d: function(e, t, i, n) {
        n = n || this, this.transform("translate3d(" + e + "," + t + "," + i + ")", n)
    },
    importHref: function(e, t, i, n) {
        var r = document.createElement("link");
        r.rel = "import", r.href = e, (n = Boolean(n)) && r.setAttribute("async", "");
        var o = this;
        return t && (r.onload = function(e) {
            return t.call(o, e)
        }), i && (r.onerror = function(e) {
            return i.call(o, e)
        }), document.head.appendChild(r), r
    },
    create: function(e, t) {
        var i = document.createElement(e);
        if (t)
            for (var n in t)
                i[n] = t[n];
        return i
    },
    isLightDescendant: function(e) {
        return this !== e && this.contains(e) && Polymer.dom(this).getOwnerRoot() === Polymer.dom(e).getOwnerRoot()
    },
    isLocalDescendant: function(e) {
        return this.root === Polymer.dom(e).getOwnerRoot()
    }
}), Polymer.Bind = {
    prepareModel: function(e) {
        Polymer.Base.mixin(e, this._modelApi)
    },
    _modelApi: {
        _notifyChange: function(e, t, i) {
            i = void 0 === i ? this[e] : i, t = t || Polymer.CaseMap.camelToDashCase(e) + "-changed", this.fire(t, {
                value: i
            }, {
                bubbles: !1,
                cancelable: !1,
                _useCache: !0
            })
        },
        _propertySetter: function(e, t, i, n) {
            var r = this.__data__[e];
            return r === t || r != r && t != t || (this.__data__[e] = t, "object" == typeof t && this._clearPath(e), this._propertyChanged && this._propertyChanged(e, t, r), i && this._effectEffects(e, t, i, r, n)), r
        },
        __setProperty: function(e, t, i, n) {
            var r = (n = n || this)._propertyEffects && n._propertyEffects[e];
            r ? n._propertySetter(e, t, r, i) : n[e] = t
        },
        _effectEffects: function(e, t, i, n, r) {
            for (var o, s = 0, a = i.length; s < a && (o = i[s]); s++)
                o.fn.call(this, e, t, o.effect, n, r)
        },
        _clearPath: function(e) {
            for (var t in this.__data__)
                0 === t.indexOf(e + ".") && (this.__data__[t] = void 0)
        }
    },
    ensurePropertyEffects: function(e, t) {
        e._propertyEffects || (e._propertyEffects = {});
        var i = e._propertyEffects[t];
        return i || (i = e._propertyEffects[t] = []), i
    },
    addPropertyEffect: function(e, t, i, n) {
        var r = this.ensurePropertyEffects(e, t),
            o = {
                kind: i,
                effect: n,
                fn: Polymer.Bind["_" + i + "Effect"]
            };
        return r.push(o), o
    },
    createBindings: function(e) {
        var t = e._propertyEffects;
        if (t)
            for (var i in t) {
                var n = t[i];
                n.sort(this._sortPropertyEffects), this._createAccessors(e, i, n)
            }
    },
    _sortPropertyEffects: function() {
        var e = {
            compute: 0,
            annotation: 1,
            annotatedComputation: 2,
            reflect: 3,
            notify: 4,
            observer: 5,
            complexObserver: 6,
            function: 7
        };
        return function(t, i) {
            return e[t.kind] - e[i.kind]
        }
    }(),
    _createAccessors: function(e, t, i) {
        var n = {
                get: function() {
                    return this.__data__[t]
                }
            },
            r = function(e) {
                this._propertySetter(t, e, i)
            },
            o = e.getPropertyInfo && e.getPropertyInfo(t);
        o && o.readOnly ? o.computed || (e["_set" + this.upper(t)] = r) : n.set = r, Object.defineProperty(e, t, n)
    },
    upper: function(e) {
        return e[0].toUpperCase() + e.substring(1)
    },
    _addAnnotatedListener: function(e, t, i, n, r, o) {
        e._bindListeners || (e._bindListeners = []);
        var s = this._notedListenerFactory(i, n, this._isStructured(n), o),
            a = r || Polymer.CaseMap.camelToDashCase(i) + "-changed";
        e._bindListeners.push({
            index: t,
            property: i,
            path: n,
            changedFn: s,
            event: a
        })
    },
    _isStructured: function(e) {
        return e.indexOf(".") > 0
    },
    _isEventBogus: function(e, t) {
        return e.path && e.path[0] !== t
    },
    _notedListenerFactory: function(e, t, i, n) {
        return function(r, o, s) {
            s ? this._notifyPath(this._fixPath(t, e, s), o) : (o = r[e], n && (o = !o), i ? this.__data__[t] != o && this.set(t, o) : this[t] = o)
        }
    },
    prepareInstance: function(e) {
        e.__data__ = Object.create(null)
    },
    setupBindListeners: function(e) {
        for (var t, i = e._bindListeners, n = 0, r = i.length; n < r && (t = i[n]); n++) {
            var o = e._nodes[t.index];
            this._addNotifyListener(o, e, t.event, t.changedFn)
        }
    },
    _addNotifyListener: function(e, t, i, n) {
        e.addEventListener(i, function(e) {
            return t._notifyListener(n, e)
        })
    }
}, Polymer.Base.extend(Polymer.Bind, {
    _shouldAddListener: function(e) {
        return e.name && "attribute" != e.kind && "text" != e.kind && !e.isCompound && "{" === e.parts[0].mode
    },
    _annotationEffect: function(e, t, i) {
        e != i.value && (t = this._get(i.value), this.__data__[i.value] = t), this._applyEffectValue(i, t)
    },
    _reflectEffect: function(e, t, i) {
        this.reflectPropertyToAttribute(e, i.attribute, t)
    },
    _notifyEffect: function(e, t, i, n, r) {
        r || this._notifyChange(e, i.event, t)
    },
    _functionEffect: function(e, t, i, n, r) {
        i.call(this, e, t, n, r)
    },
    _observerEffect: function(e, t, i, n) {
        var r = this[i.method];
        r ? r.call(this, t, n) : this._warn(this._logf("_observerEffect", "observer method `" + i.method + "` not defined"))
    },
    _complexObserverEffect: function(e, t, i) {
        var n = this[i.method];
        if (n) {
            var r = Polymer.Bind._marshalArgs(this.__data__, i, e, t);
            r && n.apply(this, r)
        } else
            i.dynamicFn || this._warn(this._logf("_complexObserverEffect", "observer method `" + i.method + "` not defined"))
    },
    _computeEffect: function(e, t, i) {
        var n = this[i.method];
        if (n) {
            var r = Polymer.Bind._marshalArgs(this.__data__, i, e, t);
            if (r) {
                var o = n.apply(this, r);
                this.__setProperty(i.name, o)
            }
        } else
            i.dynamicFn || this._warn(this._logf("_computeEffect", "compute method `" + i.method + "` not defined"))
    },
    _annotatedComputationEffect: function(e, t, i) {
        var n = this._rootDataHost || this,
            r = n[i.method];
        if (r) {
            var o = Polymer.Bind._marshalArgs(this.__data__, i, e, t);
            if (o) {
                var s = r.apply(n, o);
                this._applyEffectValue(i, s)
            }
        } else
            i.dynamicFn || n._warn(n._logf("_annotatedComputationEffect", "compute method `" + i.method + "` not defined"))
    },
    _marshalArgs: function(e, t, i, n) {
        for (var r = [], o = t.args, s = o.length > 1 || t.dynamicFn, a = 0, l = o.length; a < l; a++) {
            var h,
                c = o[a],
                u = c.name;
            if (c.literal ? h = c.value : i === u ? h = n : void 0 === (h = e[u]) && c.structured && (h = Polymer.Base._get(u, e)), s && void 0 === h)
                return;
            if (c.wildcard) {
                var d = 0 === i.indexOf(u + ".");
                r[a] = {
                    path: d ? i : u,
                    value: d ? n : h,
                    base: h
                }
            } else
                r[a] = h
        }
        return r
    }
}), Polymer.Base._addFeature({
    _addPropertyEffect: function(e, t, i) {
        var n = Polymer.Bind.addPropertyEffect(this, e, t, i);
        n.pathFn = this["_" + n.kind + "PathEffect"]
    },
    _prepEffects: function() {
        Polymer.Bind.prepareModel(this), this._addAnnotationEffects(this._notes)
    },
    _prepBindings: function() {
        Polymer.Bind.createBindings(this)
    },
    _addPropertyEffects: function(e) {
        if (e)
            for (var t in e) {
                var i = e[t];
                if (i.observer && this._addObserverEffect(t, i.observer), i.computed && (i.readOnly = !0, this._addComputedEffect(t, i.computed)), i.notify && this._addPropertyEffect(t, "notify", {
                    event: Polymer.CaseMap.camelToDashCase(t) + "-changed"
                }), i.reflectToAttribute) {
                    var n = Polymer.CaseMap.camelToDashCase(t);
                    "-" === n[0] ? this._warn(this._logf("_addPropertyEffects", "Property " + t + " cannot be reflected to attribute " + n + ' because "-" is not a valid starting attribute name. Use a lowercase first letter for the property instead.')) : this._addPropertyEffect(t, "reflect", {
                        attribute: n
                    })
                }
                i.readOnly && Polymer.Bind.ensurePropertyEffects(this, t)
            }
    },
    _addComputedEffect: function(e, t) {
        for (var i, n = this._parseMethod(t), r = n.dynamicFn, o = 0; o < n.args.length && (i = n.args[o]); o++)
            this._addPropertyEffect(i.model, "compute", {
                method: n.method,
                args: n.args,
                trigger: i,
                name: e,
                dynamicFn: r
            });
        r && this._addPropertyEffect(n.method, "compute", {
            method: n.method,
            args: n.args,
            trigger: null,
            name: e,
            dynamicFn: r
        })
    },
    _addObserverEffect: function(e, t) {
        this._addPropertyEffect(e, "observer", {
            method: t,
            property: e
        })
    },
    _addComplexObserverEffects: function(e) {
        if (e)
            for (var t, i = 0; i < e.length && (t = e[i]); i++)
                this._addComplexObserverEffect(t)
    },
    _addComplexObserverEffect: function(e) {
        var t = this._parseMethod(e);
        if (!t)
            throw new Error("Malformed observer expression '" + e + "'");
        for (var i, n = t.dynamicFn, r = 0; r < t.args.length && (i = t.args[r]); r++)
            this._addPropertyEffect(i.model, "complexObserver", {
                method: t.method,
                args: t.args,
                trigger: i,
                dynamicFn: n
            });
        n && this._addPropertyEffect(t.method, "complexObserver", {
            method: t.method,
            args: t.args,
            trigger: null,
            dynamicFn: n
        })
    },
    _addAnnotationEffects: function(e) {
        for (var t, i = 0; i < e.length && (t = e[i]); i++)
            for (var n, r = t.bindings, o = 0; o < r.length && (n = r[o]); o++)
                this._addAnnotationEffect(n, i)
    },
    _addAnnotationEffect: function(e, t) {
        Polymer.Bind._shouldAddListener(e) && Polymer.Bind._addAnnotatedListener(this, t, e.name, e.parts[0].value, e.parts[0].event, e.parts[0].negate);
        for (var i = 0; i < e.parts.length; i++) {
            var n = e.parts[i];
            n.signature ? this._addAnnotatedComputationEffect(e, n, t) : n.literal || ("attribute" === e.kind && "-" === e.name[0] ? this._warn(this._logf("_addAnnotationEffect", "Cannot set attribute " + e.name + ' because "-" is not a valid attribute starting character')) : this._addPropertyEffect(n.model, "annotation", {
                kind: e.kind,
                index: t,
                name: e.name,
                propertyName: e.propertyName,
                value: n.value,
                isCompound: e.isCompound,
                compoundIndex: n.compoundIndex,
                event: n.event,
                customEvent: n.customEvent,
                negate: n.negate
            }))
        }
    },
    _addAnnotatedComputationEffect: function(e, t, i) {
        var n = t.signature;
        if (n.static)
            this.__addAnnotatedComputationEffect("__static__", i, e, t, null);
        else {
            for (var r, o = 0; o < n.args.length && (r = n.args[o]); o++)
                r.literal || this.__addAnnotatedComputationEffect(r.model, i, e, t, r);
            n.dynamicFn && this.__addAnnotatedComputationEffect(n.method, i, e, t, null)
        }
    },
    __addAnnotatedComputationEffect: function(e, t, i, n, r) {
        this._addPropertyEffect(e, "annotatedComputation", {
            index: t,
            isCompound: i.isCompound,
            compoundIndex: n.compoundIndex,
            kind: i.kind,
            name: i.name,
            negate: n.negate,
            method: n.signature.method,
            args: n.signature.args,
            trigger: r,
            dynamicFn: n.signature.dynamicFn
        })
    },
    _parseMethod: function(e) {
        var t = e.match(/([^\s]+?)\(([\s\S]*)\)/);
        if (t) {
            var i = {
                method: t[1],
                static: !0
            };
            if (this.getPropertyInfo(i.method) !== Polymer.nob && (i.static = !1, i.dynamicFn = !0), t[2].trim()) {
                var n = t[2].replace(/\\,/g, "&comma;").split(",");
                return this._parseArgs(n, i)
            }
            return i.args = Polymer.nar, i
        }
    },
    _parseArgs: function(e, t) {
        return t.args = e.map(function(e) {
            var i = this._parseArg(e);
            return i.literal || (t.static = !1), i
        }, this), t
    },
    _parseArg: function(e) {
        var t = e.trim().replace(/&comma;/g, ",").replace(/\\(.)/g, "$1"),
            i = {
                name: t
            },
            n = t[0];
        switch ("-" === n && (n = t[1]), n >= "0" && n <= "9" && (n = "#"), n) {
        case "'":
        case '"':
            i.value = t.slice(1, -1), i.literal = !0;
            break;
        case "#":
            i.value = Number(t), i.literal = !0
        }
        return i.literal || (i.model = this._modelForPath(t), i.structured = t.indexOf(".") > 0, i.structured && (i.wildcard = ".*" == t.slice(-2), i.wildcard && (i.name = t.slice(0, -2)))), i
    },
    _marshalInstanceEffects: function() {
        Polymer.Bind.prepareInstance(this), this._bindListeners && Polymer.Bind.setupBindListeners(this)
    },
    _applyEffectValue: function(e, t) {
        var i = this._nodes[e.index],
            n = e.name;
        if (t = this._computeFinalAnnotationValue(i, n, t, e), !e.customEvent || i[n] !== t)
            if ("attribute" == e.kind)
                this.serializeValueToAttribute(t, n, i);
            else {
                var r = i._propertyInfo && i._propertyInfo[n];
                if (r && r.readOnly)
                    return;
                this.__setProperty(n, t, !1, i)
            }
    },
    _computeFinalAnnotationValue: function(e, t, i, n) {
        if (n.negate && (i = !i), n.isCompound) {
            var r = e.__compoundStorage__[t];
            r[n.compoundIndex] = i, i = r.join("")
        }
        return "attribute" !== n.kind && ("className" === t && (i = this._scopeElementClass(e, i)), ("textContent" === t || "input" == e.localName && "value" == t) && (i = void 0 == i ? "" : i)), i
    },
    _executeStaticEffects: function() {
        this._propertyEffects && this._propertyEffects.__static__ && this._effectEffects("__static__", null, this._propertyEffects.__static__)
    }
}), function() {
    var e = Polymer.Settings.usePolyfillProto;
    Polymer.Base._addFeature({
        _setupConfigure: function(e) {
            if (this._config = {}, this._handlers = [], this._aboveConfig = null, e)
                for (var t in e)
                    void 0 !== e[t] && (this._config[t] = e[t])
        },
        _marshalAttributes: function() {
            this._takeAttributesToModel(this._config)
        },
        _attributeChangedImpl: function(e) {
            var t = this._clientsReadied ? this : this._config;
            this._setAttributeToProperty(t, e)
        },
        _configValue: function(e, t) {
            var i = this._propertyInfo[e];
            i && i.readOnly || (this._config[e] = t)
        },
        _beforeClientsReady: function() {
            this._configure()
        },
        _configure: function() {
            this._configureAnnotationReferences(), this._aboveConfig = this.mixin({}, this._config);
            for (var e = {}, t = 0; t < this.behaviors.length; t++)
                this._configureProperties(this.behaviors[t].properties, e);
            this._configureProperties(this.properties, e), this.mixin(e, this._aboveConfig), this._config = e, this._clients && this._clients.length && this._distributeConfig(this._config)
        },
        _configureProperties: function(t, i) {
            for (var n in t) {
                var r = t[n];
                if (!e && this.hasOwnProperty(n) && this._propertyEffects && this._propertyEffects[n])
                    i[n] = this[n], delete this[n];
                else if (void 0 !== r.value) {
                    var o = r.value;
                    "function" == typeof o && (o = o.call(this, this._config)), i[n] = o
                }
            }
        },
        _distributeConfig: function(e) {
            var t = this._propertyEffects;
            if (t)
                for (var i in e) {
                    var n = t[i];
                    if (n)
                        for (var r, o = 0, s = n.length; o < s && (r = n[o]); o++)
                            if ("annotation" === r.kind) {
                                var a = this._nodes[r.effect.index],
                                    l = r.effect.propertyName,
                                    h = "attribute" == r.effect.kind,
                                    c = a._propertyEffects && a._propertyEffects[l];
                                if (a._configValue && (c || !h)) {
                                    var u = i === r.effect.value ? e[i] : this._get(r.effect.value, e);
                                    u = this._computeFinalAnnotationValue(a, l, u, r.effect), h && (u = a.deserialize(this.serialize(u), a._propertyInfo[l].type)), a._configValue(l, u)
                                }
                            }
                }
        },
        _afterClientsReady: function() {
            this._executeStaticEffects(), this._applyConfig(this._config, this._aboveConfig), this._flushHandlers()
        },
        _applyConfig: function(e, t) {
            for (var i in e)
                void 0 === this[i] && this.__setProperty(i, e[i], i in t)
        },
        _notifyListener: function(e, t) {
            if (!Polymer.Bind._isEventBogus(t, t.target)) {
                var i,
                    n;
                if (t.detail && (i = t.detail.value, n = t.detail.path), this._clientsReadied)
                    return e.call(this, t.target, i, n);
                this._queueHandler([e, t.target, i, n])
            }
        },
        _queueHandler: function(e) {
            this._handlers.push(e)
        },
        _flushHandlers: function() {
            for (var e, t = this._handlers, i = 0, n = t.length; i < n && (e = t[i]); i++)
                e[0].call(this, e[1], e[2], e[3]);
            this._handlers = []
        }
    })
}(), function() {
    "use strict";
    Polymer.Base._addFeature({
        notifyPath: function(e, t, i) {
            var n = {},
                r = this._get(e, this, n);
            1 === arguments.length && (t = r), n.path && this._notifyPath(n.path, t, i)
        },
        _notifyPath: function(e, t, i) {
            var n = this._propertySetter(e, t);
            if (n !== t && (n == n || t == t))
                return this._pathEffector(e, t), i || this._notifyPathUp(e, t), !0
        },
        _getPathParts: function(e) {
            if (Array.isArray(e)) {
                for (var t = [], i = 0; i < e.length; i++)
                    for (var n = e[i].toString().split("."), r = 0; r < n.length; r++)
                        t.push(n[r]);
                return t
            }
            return e.toString().split(".")
        },
        set: function(e, t, i) {
            var n,
                r = i || this,
                o = this._getPathParts(e),
                s = o[o.length - 1];
            if (o.length > 1) {
                for (var a = 0; a < o.length - 1; a++) {
                    var l = o[a];
                    if (n && "#" == l[0] ? r = Polymer.Collection.get(n).getItem(l) : (r = r[l], n && parseInt(l, 10) == l && (o[a] = Polymer.Collection.get(n).getKey(r))), !r)
                        return;
                    n = Array.isArray(r) ? r : null
                }
                if (n) {
                    var h,
                        c,
                        u = Polymer.Collection.get(n);
                    "#" == s[0] ? (c = s, h = u.getItem(c), s = n.indexOf(h), u.setItem(c, t)) : parseInt(s, 10) == s && (h = r[s], c = u.getKey(h), o[a] = c, u.setItem(c, t))
                }
                r[s] = t, i || this._notifyPath(o.join("."), t)
            } else
                r[e] = t
        },
        get: function(e, t) {
            return this._get(e, t)
        },
        _get: function(e, t, i) {
            for (var n, r = t || this, o = this._getPathParts(e), s = 0; s < o.length; s++) {
                if (!r)
                    return;
                var a = o[s];
                n && "#" == a[0] ? r = Polymer.Collection.get(n).getItem(a) : (r = r[a], i && n && parseInt(a, 10) == a && (o[s] = Polymer.Collection.get(n).getKey(r))), n = Array.isArray(r) ? r : null
            }
            return i && (i.path = o.join(".")), r
        },
        _pathEffector: function(e, t) {
            var i = this._modelForPath(e),
                n = this._propertyEffects && this._propertyEffects[i];
            if (n)
                for (var r, o = 0; o < n.length && (r = n[o]); o++) {
                    var s = r.pathFn;
                    s && s.call(this, e, t, r.effect)
                }
            this._boundPaths && this._notifyBoundPaths(e, t)
        },
        _annotationPathEffect: function(e, t, i) {
            if (i.value === e || 0 === i.value.indexOf(e + "."))
                Polymer.Bind._annotationEffect.call(this, e, t, i);
            else if (0 === e.indexOf(i.value + ".") && !i.negate) {
                var n = this._nodes[i.index];
                if (n && n._notifyPath) {
                    var r = this._fixPath(i.name, i.value, e);
                    n._notifyPath(r, t, !0)
                }
            }
        },
        _complexObserverPathEffect: function(e, t, i) {
            this._pathMatchesEffect(e, i) && Polymer.Bind._complexObserverEffect.call(this, e, t, i)
        },
        _computePathEffect: function(e, t, i) {
            this._pathMatchesEffect(e, i) && Polymer.Bind._computeEffect.call(this, e, t, i)
        },
        _annotatedComputationPathEffect: function(e, t, i) {
            this._pathMatchesEffect(e, i) && Polymer.Bind._annotatedComputationEffect.call(this, e, t, i)
        },
        _pathMatchesEffect: function(e, t) {
            var i = t.trigger.name;
            return i == e || 0 === i.indexOf(e + ".") || t.trigger.wildcard && 0 === e.indexOf(i)
        },
        linkPaths: function(e, t) {
            this._boundPaths = this._boundPaths || {}, t ? this._boundPaths[e] = t : this.unlinkPaths(e)
        },
        unlinkPaths: function(e) {
            this._boundPaths && delete this._boundPaths[e]
        },
        _notifyBoundPaths: function(e, t) {
            for (var i in this._boundPaths) {
                var n = this._boundPaths[i];
                0 == e.indexOf(i + ".") ? this._notifyPath(this._fixPath(n, i, e), t) : 0 == e.indexOf(n + ".") && this._notifyPath(this._fixPath(i, n, e), t)
            }
        },
        _fixPath: function(e, t, i) {
            return e + i.slice(t.length)
        },
        _notifyPathUp: function(e, t) {
            var i = this._modelForPath(e),
                n = Polymer.CaseMap.camelToDashCase(i) + this._EVENT_CHANGED;
            this.fire(n, {
                path: e,
                value: t
            }, {
                bubbles: !1,
                _useCache: !0
            })
        },
        _modelForPath: function(e) {
            var t = e.indexOf(".");
            return t < 0 ? e : e.slice(0, t)
        },
        _EVENT_CHANGED: "-changed",
        notifySplices: function(e, t) {
            var i = {},
                n = this._get(e, this, i);
            this._notifySplices(n, i.path, t)
        },
        _notifySplices: function(e, t, i) {
            var n = {
                    keySplices: Polymer.Collection.applySplices(e, i),
                    indexSplices: i
                },
                r = t + ".splices";
            this._notifyPath(r, n), this._notifyPath(t + ".length", e.length), this.__data__[r] = {
                keySplices: null,
                indexSplices: null
            }
        },
        _notifySplice: function(e, t, i, n, r) {
            this._notifySplices(e, t, [{
                index: i,
                addedCount: n,
                removed: r,
                object: e,
                type: "splice"
            }])
        },
        push: function(e) {
            var t = {},
                i = this._get(e, this, t),
                n = Array.prototype.slice.call(arguments, 1),
                r = i.length,
                o = i.push.apply(i, n);
            return n.length && this._notifySplice(i, t.path, r, n.length, []), o
        },
        pop: function(e) {
            var t = {},
                i = this._get(e, this, t),
                n = Boolean(i.length),
                r = Array.prototype.slice.call(arguments, 1),
                o = i.pop.apply(i, r);
            return n && this._notifySplice(i, t.path, i.length, 0, [o]), o
        },
        splice: function(e, t) {
            var i = {},
                n = this._get(e, this, i);
            (t = t < 0 ? n.length - Math.floor(-t) : Math.floor(t)) || (t = 0);
            var r = Array.prototype.slice.call(arguments, 1),
                o = n.splice.apply(n, r),
                s = Math.max(r.length - 2, 0);
            return (s || o.length) && this._notifySplice(n, i.path, t, s, o), o
        },
        shift: function(e) {
            var t = {},
                i = this._get(e, this, t),
                n = Boolean(i.length),
                r = Array.prototype.slice.call(arguments, 1),
                o = i.shift.apply(i, r);
            return n && this._notifySplice(i, t.path, 0, 0, [o]), o
        },
        unshift: function(e) {
            var t = {},
                i = this._get(e, this, t),
                n = Array.prototype.slice.call(arguments, 1),
                r = i.unshift.apply(i, n);
            return n.length && this._notifySplice(i, t.path, 0, n.length, []), r
        },
        prepareModelNotifyPath: function(e) {
            this.mixin(e, {
                fire: Polymer.Base.fire,
                _getEvent: Polymer.Base._getEvent,
                __eventCache: Polymer.Base.__eventCache,
                notifyPath: Polymer.Base.notifyPath,
                _get: Polymer.Base._get,
                _EVENT_CHANGED: Polymer.Base._EVENT_CHANGED,
                _notifyPath: Polymer.Base._notifyPath,
                _notifyPathUp: Polymer.Base._notifyPathUp,
                _pathEffector: Polymer.Base._pathEffector,
                _annotationPathEffect: Polymer.Base._annotationPathEffect,
                _complexObserverPathEffect: Polymer.Base._complexObserverPathEffect,
                _annotatedComputationPathEffect: Polymer.Base._annotatedComputationPathEffect,
                _computePathEffect: Polymer.Base._computePathEffect,
                _modelForPath: Polymer.Base._modelForPath,
                _pathMatchesEffect: Polymer.Base._pathMatchesEffect,
                _notifyBoundPaths: Polymer.Base._notifyBoundPaths,
                _getPathParts: Polymer.Base._getPathParts
            })
        }
    })
}(), Polymer.Base._addFeature({
    resolveUrl: function(e) {
        var t = Polymer.DomModule.import(this.is),
            i = "";
        if (t) {
            var n = t.getAttribute("assetpath") || "";
            i = Polymer.ResolveUrl.resolveUrl(n, t.ownerDocument.baseURI)
        }
        return Polymer.ResolveUrl.resolveUrl(e, i)
    }
}), Polymer.CssParse = {
    parse: function(e) {
        return e = this._clean(e), this._parseCss(this._lex(e), e)
    },
    _clean: function(e) {
        return e.replace(this._rx.comments, "").replace(this._rx.port, "")
    },
    _lex: function(e) {
        for (var t = {
                start: 0,
                end: e.length
            }, i = t, n = 0, r = e.length; n < r; n++)
            switch (e[n]) {
            case this.OPEN_BRACE:
                i.rules || (i.rules = []);
                var o = i;
                i = {
                    start: n + 1,
                    parent: o,
                    previous: o.rules[o.rules.length - 1]
                }, o.rules.push(i);
                break;
            case this.CLOSE_BRACE:
                i.end = n + 1, i = i.parent || t
            }
        return t
    },
    _parseCss: function(e, t) {
        var i = t.substring(e.start, e.end - 1);
        if (e.parsedCssText = e.cssText = i.trim(), e.parent) {
            var n = e.previous ? e.previous.end : e.parent.start;
            i = t.substring(n, e.start - 1), i = (i = (i = this._expandUnicodeEscapes(i)).replace(this._rx.multipleSpaces, " ")).substring(i.lastIndexOf(";") + 1);
            var r = e.parsedSelector = e.selector = i.trim();
            e.atRule = 0 === r.indexOf(this.AT_START), e.atRule ? 0 === r.indexOf(this.MEDIA_START) ? e.type = this.types.MEDIA_RULE : r.match(this._rx.keyframesRule) && (e.type = this.types.KEYFRAMES_RULE, e.keyframesName = e.selector.split(this._rx.multipleSpaces).pop()) : 0 === r.indexOf(this.VAR_START) ? e.type = this.types.MIXIN_RULE : e.type = this.types.STYLE_RULE
        }
        var o = e.rules;
        if (o)
            for (var s, a = 0, l = o.length; a < l && (s = o[a]); a++)
                this._parseCss(s, t);
        return e
    },
    _expandUnicodeEscapes: function(e) {
        return e.replace(/\\([0-9a-f]{1,6})\s/gi, function() {
            for (var e = arguments[1], t = 6 - e.length; t--;)
                e = "0" + e;
            return "\\" + e
        })
    },
    stringify: function(e, t, i) {
        i = i || "";
        var n = "";
        if (e.cssText || e.rules) {
            var r = e.rules;
            if (!r || !t && this._hasMixinRules(r))
                (n = (n = t ? e.cssText : this.removeCustomProps(e.cssText)).trim()) && (n = "  " + n + "\n");
            else
                for (var o, s = 0, a = r.length; s < a && (o = r[s]); s++)
                    n = this.stringify(o, t, n)
        }
        return n && (e.selector && (i += e.selector + " " + this.OPEN_BRACE + "\n"), i += n, e.selector && (i += this.CLOSE_BRACE + "\n\n")), i
    },
    _hasMixinRules: function(e) {
        return 0 === e[0].selector.indexOf(this.VAR_START)
    },
    removeCustomProps: function(e) {
        return e = this.removeCustomPropAssignment(e), this.removeCustomPropApply(e)
    },
    removeCustomPropAssignment: function(e) {
        return e.replace(this._rx.customProp, "").replace(this._rx.mixinProp, "")
    },
    removeCustomPropApply: function(e) {
        return e.replace(this._rx.mixinApply, "").replace(this._rx.varApply, "")
    },
    types: {
        STYLE_RULE: 1,
        KEYFRAMES_RULE: 7,
        MEDIA_RULE: 4,
        MIXIN_RULE: 1e3
    },
    OPEN_BRACE: "{",
    CLOSE_BRACE: "}",
    _rx: {
        comments: /\/\*[^*]*\*+([^/*][^*]*\*+)*\//gim,
        port: /@import[^;]*;/gim,
        customProp: /(?:^[^;\-\s}]+)?--[^;{}]*?:[^{};]*?(?:[;\n]|$)/gim,
        mixinProp: /(?:^[^;\-\s}]+)?--[^;{}]*?:[^{};]*?{[^}]*?}(?:[;\n]|$)?/gim,
        mixinApply: /@apply[\s]*\([^)]*?\)[\s]*(?:[;\n]|$)?/gim,
        varApply: /[^;:]*?:[^;]*?var\([^;]*\)(?:[;\n]|$)?/gim,
        keyframesRule: /^@[^\s]*keyframes/,
        multipleSpaces: /\s+/g
    },
    VAR_START: "--",
    MEDIA_START: "@media",
    AT_START: "@"
}, Polymer.StyleUtil = {
    MODULE_STYLES_SELECTOR: "style, link[rel=import][type~=css], template",
    INCLUDE_ATTR: "include",
    toCssText: function(e, t, i) {
        return "string" == typeof e && (e = this.parser.parse(e)), t && this.forEachRule(e, t), this.parser.stringify(e, i)
    },
    forRulesInStyles: function(e, t, i) {
        if (e)
            for (var n, r = 0, o = e.length; r < o && (n = e[r]); r++)
                this.forEachRule(this.rulesForStyle(n), t, i)
    },
    rulesForStyle: function(e) {
        return !e.__cssRules && e.textContent && (e.__cssRules = this.parser.parse(e.textContent)), e.__cssRules
    },
    isKeyframesSelector: function(e) {
        return e.parent && e.parent.type === this.ruleTypes.KEYFRAMES_RULE
    },
    forEachRule: function(e, t, i) {
        if (e) {
            var n = !1;
            e.type === this.ruleTypes.STYLE_RULE ? t(e) : i && e.type === this.ruleTypes.KEYFRAMES_RULE ? i(e) : e.type === this.ruleTypes.MIXIN_RULE && (n = !0);
            var r = e.rules;
            if (r && !n)
                for (var o, s = 0, a = r.length; s < a && (o = r[s]); s++)
                    this.forEachRule(o, t, i)
        }
    },
    applyCss: function(e, t, i, n) {
        var r = this.createScopeStyle(e, t);
        i = i || document.head;
        var o = n && n.nextSibling || i.firstChild;
        return this.__lastHeadApplyNode = r, i.insertBefore(r, o)
    },
    createScopeStyle: function(e, t) {
        var i = document.createElement("style");
        return t && i.setAttribute("scope", t), i.textContent = e, i
    },
    __lastHeadApplyNode: null,
    applyStylePlaceHolder: function(e) {
        var t = document.createComment(" Shady DOM styles for " + e + " "),
            i = this.__lastHeadApplyNode ? this.__lastHeadApplyNode.nextSibling : null,
            n = document.head;
        return n.insertBefore(t, i || n.firstChild), this.__lastHeadApplyNode = t, t
    },
    cssFromModules: function(e, t) {
        for (var i = e.trim().split(" "), n = "", r = 0; r < i.length; r++)
            n += this.cssFromModule(i[r], t);
        return n
    },
    cssFromModule: function(e, t) {
        var i = Polymer.DomModule.import(e);
        return i && !i._cssText && (i._cssText = this.cssFromElement(i)), i && i._cssText || ""
    },
    cssFromElement: function(e) {
        for (var t, i = "", n = e.content || e, r = Polymer.TreeApi.arrayCopy(n.querySelectorAll(this.MODULE_STYLES_SELECTOR)), o = 0; o < r.length; o++)
            if ("template" === (t = r[o]).localName)
                i += this.cssFromElement(t);
            else if ("style" === t.localName) {
                var s = t.getAttribute(this.INCLUDE_ATTR);
                s && (i += this.cssFromModules(s, !0)), (t = t.__appliedElement || t).parentNode.removeChild(t), i += this.resolveCss(t.textContent, e.ownerDocument)
            } else
                t.import && t.import.body && (i += this.resolveCss(t.import.body.textContent, t.import));
        return i
    },
    resolveCss: Polymer.ResolveUrl.resolveCss,
    parser: Polymer.CssParse,
    ruleTypes: Polymer.CssParse.types
}, Polymer.StyleTransformer = function() {
    var e = Polymer.Settings.useNativeShadow,
        t = Polymer.StyleUtil,
        i = {
            dom: function(e, t, i, n) {
                this._transformDom(e, t || "", i, n)
            },
            _transformDom: function(e, t, i, n) {
                e.setAttribute && this.element(e, t, i, n);
                for (var r = Polymer.dom(e).childNodes, o = 0; o < r.length; o++)
                    this._transformDom(r[o], t, i, n)
            },
            element: function(e, t, i, r) {
                if (i)
                    r ? e.removeAttribute(n) : e.setAttribute(n, t);
                else if (t)
                    if (e.classList)
                        r ? (e.classList.remove(n), e.classList.remove(t)) : (e.classList.add(n), e.classList.add(t));
                    else if (e.getAttribute) {
                        var o = e.getAttribute(v);
                        r ? o && e.setAttribute(v, o.replace(n, "").replace(t, "")) : e.setAttribute(v, (o ? o + " " : "") + n + " " + t)
                    }
            },
            elementStyles: function(i, n) {
                for (var r, o = i._styles, s = "", a = 0, l = o.length; a < l && (r = o[a]); a++) {
                    var h = t.rulesForStyle(r);
                    s += e ? t.toCssText(h, n) : this.css(h, i.is, i.extends, n, i._scopeCssViaAttr) + "\n\n"
                }
                return s.trim()
            },
            css: function(e, i, n, r, o) {
                var s = this._calcHostScope(i, n);
                i = this._calcElementScope(i, o);
                var a = this;
                return t.toCssText(e, function(e) {
                    e.isScoped || (a.rule(e, i, s), e.isScoped = !0), r && r(e, i, s)
                })
            },
            _calcElementScope: function(e, t) {
                return e ? t ? _ + e + m : p + e : ""
            },
            _calcHostScope: function(e, t) {
                return t ? "[is=" + e + "]" : e
            },
            rule: function(e, t, i) {
                this._transformRule(e, this._transformComplexSelector, t, i)
            },
            _transformRule: function(e, i, n, r) {
                var s = e.selector.split(o);
                if (!t.isKeyframesSelector(e))
                    for (var a, l = 0, h = s.length; l < h && (a = s[l]); l++)
                        s[l] = i.call(this, a, n, r);
                e.selector = e.transformedSelector = s.join(o)
            },
            _transformComplexSelector: function(e, t, i) {
                var n = !1,
                    r = !1,
                    l = this;
                return e = (e = e.replace(g, a + " $1")).replace(s, function(e, o, s) {
                    if (n)
                        s = s.replace(f, " ");
                    else {
                        var a = l._transformCompoundSelector(s, o, t, i);
                        n = n || a.stop, r = r || a.hostContext, o = a.combinator, s = a.value
                    }
                    return o + s
                }), r && (e = e.replace(u, function(e, t, n, r) {
                    return t + n + " " + i + r + o + " " + t + i + n + r
                })), e
            },
            _transformCompoundSelector: function(e, t, i, n) {
                var r,
                    o = e.search(f),
                    s = !1;
                return e.indexOf(c) >= 0 ? s = !0 : e.indexOf(a) >= 0 ? e = (e = e.replace(h, function(e, t, i) {
                    return n + i
                })).replace(a, n) : 0 !== o && (e = i ? this._transformSimpleSelector(e, i) : e), e.indexOf(d) >= 0 && (t = ""), o >= 0 && (e = e.replace(f, " "), r = !0), {
                    value: e,
                    combinator: t,
                    stop: r,
                    hostContext: s
                }
            },
            _transformSimpleSelector: function(e, t) {
                var i = e.split(y);
                return i[0] += t, i.join(y)
            },
            documentRule: function(t) {
                t.selector = t.parsedSelector, this.normalizeRootSelector(t), e || this._transformRule(t, this._transformDocumentSelector)
            },
            normalizeRootSelector: function(e) {
                e.selector === l && (e.selector = "body")
            },
            _transformDocumentSelector: function(e) {
                return e.match(f) ? this._transformComplexSelector(e, r) : this._transformSimpleSelector(e.trim(), r)
            },
            SCOPE_NAME: "style-scope"
        },
        n = i.SCOPE_NAME,
        r = ":not([" + n + "]):not(." + n + ")",
        o = ",",
        s = /(^|[\s>+~]+)((?:\[.+?\]|[^\s>+~=\[])+)/g,
        a = ":host",
        l = ":root",
        h = /(:host)(?:\(((?:\([^)(]*\)|[^)(]*)+?)\))/g,
        c = ":host-context",
        u = /(.*)(?::host-context)(?:\(((?:\([^)(]*\)|[^)(]*)+?)\))(.*)/,
        d = "::content",
        f = /::content|::shadow|\/deep\//,
        p = ".",
        _ = "[" + n + "~=",
        m = "]",
        y = ":",
        v = "class",
        g = new RegExp("^(" + d + ")");
    return i
}(), Polymer.StyleExtends = function() {
    var e = Polymer.StyleUtil;
    return {
        hasExtends: function(e) {
            return Boolean(e.match(this.rx.EXTEND))
        },
        transform: function(t) {
            var i = e.rulesForStyle(t),
                n = this;
            return e.forEachRule(i, function(e) {
                if (n._mapRuleOntoParent(e), e.parent)
                    for (var t; t = n.rx.EXTEND.exec(e.cssText);) {
                        var i = t[1],
                            r = n._findExtendor(i, e);
                        r && n._extendRule(e, r)
                    }
                e.cssText = e.cssText.replace(n.rx.EXTEND, "")
            }), e.toCssText(i, function(e) {
                e.selector.match(n.rx.STRIP) && (e.cssText = "")
            }, !0)
        },
        _mapRuleOntoParent: function(e) {
            if (e.parent) {
                for (var t = e.parent.map || (e.parent.map = {}), i = e.selector.split(","), n = 0; n < i.length; n++)
                    t[i[n].trim()] = e;
                return t
            }
        },
        _findExtendor: function(e, t) {
            return t.parent && t.parent.map && t.parent.map[e] || this._findExtendor(e, t.parent)
        },
        _extendRule: function(e, t) {
            e.parent !== t.parent && this._cloneAndAddRuleToParent(t, e.parent), e.extends = e.extends || [], e.extends.push(t), t.selector = t.selector.replace(this.rx.STRIP, ""), t.selector = (t.selector && t.selector + ",\n") + e.selector, t.extends && t.extends.forEach(function(t) {
                this._extendRule(e, t)
            }, this)
        },
        _cloneAndAddRuleToParent: function(e, t) {
            (e = Object.create(e)).parent = t, e.extends && (e.extends = e.extends.slice()), t.rules.push(e)
        },
        rx: {
            EXTEND: /@extends\(([^)]*)\)\s*?;/gim,
            STRIP: /%[^,]*$/
        }
    }
}(), function() {
    var e = Polymer.Base._prepElement,
        t = Polymer.Settings.useNativeShadow,
        i = Polymer.StyleUtil,
        n = Polymer.StyleTransformer,
        r = Polymer.StyleExtends;
    Polymer.Base._addFeature({
        _prepElement: function(t) {
            this._encapsulateStyle && n.element(t, this.is, this._scopeCssViaAttr), e.call(this, t)
        },
        _prepStyles: function() {
            t || (this._scopeStyle = i.applyStylePlaceHolder(this.is))
        },
        _prepShimStyles: function() {
            if (this._template) {
                void 0 === this._encapsulateStyle && (this._encapsulateStyle = !t), this._styles = this._collectStyles();
                var e = n.elementStyles(this);
                this._prepStyleProperties(), !this._needsStyleProperties() && this._styles.length && i.applyCss(e, this.is, t ? this._template.content : null, this._scopeStyle)
            } else
                this._styles = []
        },
        _collectStyles: function() {
            var e = [],
                t = "",
                n = this.styleModules;
            if (n)
                for (var o, s = 0, a = n.length; s < a && (o = n[s]); s++)
                    t += i.cssFromModule(o);
            t += i.cssFromModule(this.is);
            var l = this._template && this._template.parentNode;
            if (!this._template || l && l.id.toLowerCase() === this.is || (t += i.cssFromElement(this._template)), t) {
                var h = document.createElement("style");
                h.textContent = t, r.hasExtends(h.textContent) && (t = r.transform(h)), e.push(h)
            }
            return e
        },
        _elementAdd: function(e) {
            this._encapsulateStyle && (e.__styleScoped ? e.__styleScoped = !1 : n.dom(e, this.is, this._scopeCssViaAttr))
        },
        _elementRemove: function(e) {
            this._encapsulateStyle && n.dom(e, this.is, this._scopeCssViaAttr, !0)
        },
        scopeSubtree: function(e, i) {
            if (!t) {
                var n = this,
                    r = function(e) {
                        if (e.nodeType === Node.ELEMENT_NODE) {
                            var t = e.getAttribute("class");
                            e.setAttribute("class", n._scopeElementClass(e, t));
                            for (var i, r = e.querySelectorAll("*"), o = 0; o < r.length && (i = r[o]); o++)
                                t = i.getAttribute("class"), i.setAttribute("class", n._scopeElementClass(i, t))
                        }
                    };
                if (r(e), i) {
                    var o = new MutationObserver(function(e) {
                        for (var t, i = 0; i < e.length && (t = e[i]); i++)
                            if (t.addedNodes)
                                for (var n = 0; n < t.addedNodes.length; n++)
                                    r(t.addedNodes[n])
                    });
                    return o.observe(e, {
                        childList: !0,
                        subtree: !0
                    }), o
                }
            }
        }
    })
}(), Polymer.StyleProperties = function() {
    "use strict";
    var e = Polymer.Settings.useNativeShadow,
        t = Polymer.DomApi.matchesSelector,
        i = Polymer.StyleUtil,
        n = Polymer.StyleTransformer;
    return {
        decorateStyles: function(e) {
            var t = this,
                n = {},
                r = [];
            i.forRulesInStyles(e, function(e) {
                t.decorateRule(e), t.collectPropertiesInCssText(e.propertyInfo.cssText, n)
            }, function(e) {
                r.push(e)
            }), e._keyframes = r;
            var o = [];
            for (var s in n)
                o.push(s);
            return o
        },
        decorateRule: function(e) {
            if (e.propertyInfo)
                return e.propertyInfo;
            var t = {},
                i = {};
            return this.collectProperties(e, i) && (t.properties = i, e.rules = null), t.cssText = this.collectCssText(e), e.propertyInfo = t, t
        },
        collectProperties: function(e, t) {
            var i = e.propertyInfo;
            if (!i) {
                for (var n, r, o = this.rx.VAR_ASSIGN, s = e.parsedCssText; n = o.exec(s);)
                    t[n[1]] = (n[2] || n[3]).trim(), r = !0;
                return r
            }
            if (i.properties)
                return Polymer.Base.mixin(t, i.properties), !0
        },
        collectCssText: function(e) {
            return this.collectConsumingCssText(e.parsedCssText)
        },
        collectConsumingCssText: function(e) {
            return e.replace(this.rx.BRACKETED, "").replace(this.rx.VAR_ASSIGN, "")
        },
        collectPropertiesInCssText: function(e, t) {
            for (var i; i = this.rx.VAR_CAPTURE.exec(e);) {
                t[i[1]] = !0;
                var n = i[2];
                n && n.match(this.rx.IS_VAR) && (t[n] = !0)
            }
        },
        reify: function(e) {
            for (var t, i = Object.getOwnPropertyNames(e), n = 0; n < i.length; n++)
                e[t = i[n]] = this.valueForProperty(e[t], e)
        },
        valueForProperty: function(e, t) {
            if (e)
                if (e.indexOf(";") >= 0)
                    e = this.valueForProperties(e, t);
                else {
                    var i = this;
                    e = e.replace(this.rx.VAR_MATCH, function(e, n, r, o) {
                        return n + (i.valueForProperty(t[r], t) || (t[o] ? i.valueForProperty(t[o], t) : o) || "")
                    })
                }
            return e && e.trim() || ""
        },
        valueForProperties: function(e, t) {
            for (var i, n, r = e.split(";"), o = 0; o < r.length; o++)
                if (i = r[o]) {
                    if (n = i.match(this.rx.MIXIN_MATCH))
                        i = this.valueForProperty(t[n[1]], t);
                    else {
                        var s = i.indexOf(":");
                        if (-1 !== s) {
                            var a = i.substring(s);
                            a = a.trim(), a = this.valueForProperty(a, t) || a, i = i.substring(0, s) + a
                        }
                    }
                    r[o] = i && i.lastIndexOf(";") === i.length - 1 ? i.slice(0, -1) : i || ""
                }
            return r.join(";")
        },
        applyProperties: function(e, t) {
            var i = "";
            e.propertyInfo || this.decorateRule(e), e.propertyInfo.cssText && (i = this.valueForProperties(e.propertyInfo.cssText, t)), e.cssText = i
        },
        applyKeyframeTransforms: function(e, t) {
            var i = e.cssText,
                n = e.cssText;
            if (null == e.hasAnimations && (e.hasAnimations = this.rx.ANIMATION_MATCH.test(i)), e.hasAnimations)
                if (null == e.keyframeNamesToTransform)
                    for (var r in e.keyframeNamesToTransform = [], t)
                        i !== (n = (0, t[r])(i)) && (i = n, e.keyframeNamesToTransform.push(r));
                else {
                    for (var o = 0; o < e.keyframeNamesToTransform.length; ++o)
                        i = (0, t[e.keyframeNamesToTransform[o]])(i);
                    n = i
                }
            e.cssText = n
        },
        propertyDataFromStyles: function(e, n) {
            var r = {},
                o = this,
                s = [],
                a = 0;
            return i.forRulesInStyles(e, function(e) {
                e.propertyInfo || o.decorateRule(e), n && e.propertyInfo.properties && t.call(n, e.transformedSelector || e.parsedSelector) && (o.collectProperties(e, r), function(e, t) {
                    var i = parseInt(e / 32),
                        n = 1 << e % 32;
                    t[i] = (t[i] || 0) | n
                }(a, s)), a++
            }), {
                properties: r,
                key: s
            }
        },
        scopePropertiesFromStyles: function(e) {
            return e._scopeStyleProperties || (e._scopeStyleProperties = this.selectedPropertiesFromStyles(e, this.SCOPE_SELECTORS)), e._scopeStyleProperties
        },
        hostPropertiesFromStyles: function(e) {
            return e._hostStyleProperties || (e._hostStyleProperties = this.selectedPropertiesFromStyles(e, this.HOST_SELECTORS)), e._hostStyleProperties
        },
        selectedPropertiesFromStyles: function(e, t) {
            var n = {},
                r = this;
            return i.forRulesInStyles(e, function(e) {
                e.propertyInfo || r.decorateRule(e);
                for (var i = 0; i < t.length; i++)
                    if (e.parsedSelector === t[i])
                        return void r.collectProperties(e, n)
            }), n
        },
        transformStyles: function(t, i, r) {
            var o = this,
                s = n._calcHostScope(t.is, t.extends),
                a = t.extends ? "\\" + s.slice(0, -1) + "\\]" : s,
                l = new RegExp(this.rx.HOST_PREFIX + a + this.rx.HOST_SUFFIX),
                h = this._elementKeyframeTransforms(t, r);
            return n.elementStyles(t, function(n) {
                o.applyProperties(n, i), e || Polymer.StyleUtil.isKeyframesSelector(n) || !n.cssText || (o.applyKeyframeTransforms(n, h), o._scopeSelector(n, l, s, t._scopeCssViaAttr, r))
            })
        },
        _elementKeyframeTransforms: function(t, i) {
            var n = t._styles._keyframes,
                r = {};
            if (!e && n)
                for (var o = 0, s = n[o]; o < n.length; s = n[++o])
                    this._scopeKeyframes(s, i), r[s.keyframesName] = this._keyframesRuleTransformer(s);
            return r
        },
        _keyframesRuleTransformer: function(e) {
            return function(t) {
                return t.replace(e.keyframesNameRx, e.transformedKeyframesName)
            }
        },
        _scopeKeyframes: function(e, t) {
            e.keyframesNameRx = new RegExp(e.keyframesName, "g"), e.transformedKeyframesName = e.keyframesName + "-" + t, e.transformedSelector = e.transformedSelector || e.selector, e.selector = e.transformedSelector.replace(e.keyframesName, e.transformedKeyframesName)
        },
        _scopeSelector: function(e, t, i, r, o) {
            e.transformedSelector = e.transformedSelector || e.selector;
            for (var s, a = e.transformedSelector, l = r ? "[" + n.SCOPE_NAME + "~=" + o + "]" : "." + o, h = a.split(","), c = 0, u = h.length; c < u && (s = h[c]); c++)
                h[c] = s.match(t) ? s.replace(i, l) : l + " " + s;
            e.selector = h.join(",")
        },
        applyElementScopeSelector: function(e, t, i, r) {
            var o = r ? e.getAttribute(n.SCOPE_NAME) : e.getAttribute("class") || "",
                s = i ? o.replace(i, t) : (o ? o + " " : "") + this.XSCOPE_NAME + " " + t;
            o !== s && (r ? e.setAttribute(n.SCOPE_NAME, s) : e.setAttribute("class", s))
        },
        applyElementStyle: function(t, n, r, o) {
            var s = o ? o.textContent || "" : this.transformStyles(t, n, r),
                a = t._customStyle;
            return a && !e && a !== o && (a._useCount--, a._useCount <= 0 && a.parentNode && a.parentNode.removeChild(a)), !e && o && o.parentNode || (e && t._customStyle ? (t._customStyle.textContent = s, o = t._customStyle) : s && (o = i.applyCss(s, r, e ? t.root : null, t._scopeStyle))), o && (o._useCount = o._useCount || 0, t._customStyle != o && o._useCount++, t._customStyle = o), o
        },
        mixinCustomStyle: function(e, t) {
            var i;
            for (var n in t)
                ((i = t[n]) || 0 === i) && (e[n] = i)
        },
        rx: {
            VAR_ASSIGN: /(?:^|[;\s{]\s*)(--[\w-]*?)\s*:\s*(?:([^;{]*)|{([^}]*)})(?:(?=[;\s}])|$)/gi,
            MIXIN_MATCH: /(?:^|\W+)@apply[\s]*\(([^)]*)\)/i,
            VAR_MATCH: /(^|\W+)var\([\s]*([^,)]*)[\s]*,?[\s]*((?:[^,()]*)|(?:[^;()]*\([^;)]*\)))[\s]*?\)/gi,
            VAR_CAPTURE: /\([\s]*(--[^,\s)]*)(?:,[\s]*(--[^,\s)]*))?(?:\)|,)/gi,
            ANIMATION_MATCH: /(animation\s*:)|(animation-name\s*:)/,
            IS_VAR: /^--/,
            BRACKETED: /\{[^}]*\}/g,
            HOST_PREFIX: "(?:^|[^.#[:])",
            HOST_SUFFIX: "($|[.:[\\s>+~])"
        },
        HOST_SELECTORS: [":host"],
        SCOPE_SELECTORS: [":root"],
        XSCOPE_NAME: "x-scope"
    }
}(), Polymer.StyleCache = function() {
    this.cache = {}
}, Polymer.StyleCache.prototype = {
    MAX: 100,
    store: function(e, t, i, n) {
        t.keyValues = i, t.styles = n;
        var r = this.cache[e] = this.cache[e] || [];
        r.push(t), r.length > this.MAX && r.shift()
    },
    retrieve: function(e, t, i) {
        var n = this.cache[e];
        if (n)
            for (var r, o = n.length - 1; o >= 0; o--)
                if (i === (r = n[o]).styles && this._objectsEqual(t, r.keyValues))
                    return r
    },
    clear: function() {
        this.cache = {}
    },
    _objectsEqual: function(e, t) {
        var i,
            n;
        for (var r in e)
            if (i = e[r], n = t[r], !("object" == typeof i && i ? this._objectsStrictlyEqual(i, n) : i === n))
                return !1;
        return !Array.isArray(e) || e.length === t.length
    },
    _objectsStrictlyEqual: function(e, t) {
        return this._objectsEqual(e, t) && this._objectsEqual(t, e)
    }
}, Polymer.StyleDefaults = function() {
    var e = Polymer.StyleProperties;
    return {
        _styles: [],
        _properties: null,
        customStyle: {},
        _styleCache: new (0, Polymer.StyleCache),
        addStyle: function(e) {
            this._styles.push(e), this._properties = null
        },
        get _styleProperties() {
            return this._properties || (e.decorateStyles(this._styles), this._styles._scopeStyleProperties = null, this._properties = e.scopePropertiesFromStyles(this._styles), e.mixinCustomStyle(this._properties, this.customStyle), e.reify(this._properties)), this._properties
        },
        _needsStyleProperties: function() {},
        _computeStyleProperties: function() {
            return this._styleProperties
        },
        updateStyles: function(e) {
            this._properties = null, e && Polymer.Base.mixin(this.customStyle, e), this._styleCache.clear();
            for (var t, i = 0; i < this._styles.length; i++)
                (t = (t = this._styles[i]).__importElement || t)._apply()
        }
    }
}(), function() {
    "use strict";
    var e = Polymer.Base.serializeValueToAttribute,
        t = Polymer.StyleProperties,
        i = Polymer.StyleTransformer,
        n = Polymer.StyleDefaults,
        r = Polymer.Settings.useNativeShadow;
    Polymer.Base._addFeature({
        _prepStyleProperties: function() {
            this._ownStylePropertyNames = this._styles && this._styles.length ? t.decorateStyles(this._styles) : null
        },
        customStyle: null,
        getComputedStyleValue: function(e) {
            return this._styleProperties && this._styleProperties[e] || getComputedStyle(this).getPropertyValue(e)
        },
        _setupStyleProperties: function() {
            this.customStyle = {}, this._styleCache = null, this._styleProperties = null, this._scopeSelector = null, this._ownStyleProperties = null, this._customStyle = null
        },
        _needsStyleProperties: function() {
            return Boolean(this._ownStylePropertyNames && this._ownStylePropertyNames.length)
        },
        _beforeAttached: function() {
            !this._scopeSelector && this._needsStyleProperties() && this._updateStyleProperties()
        },
        _findStyleHost: function() {
            for (var e, t = this; e = Polymer.dom(t).getOwnerRoot();) {
                if (Polymer.isInstance(e.host))
                    return e.host;
                t = e.host
            }
            return n
        },
        _updateStyleProperties: function() {
            var e,
                i = this._findStyleHost();
            i._styleCache || (i._styleCache = new Polymer.StyleCache);
            var n = t.propertyDataFromStyles(i._styles, this);
            n.key.customStyle = this.customStyle, e = i._styleCache.retrieve(this.is, n.key, this._styles);
            var s = Boolean(e);
            s ? this._styleProperties = e._styleProperties : this._computeStyleProperties(n.properties), this._computeOwnStyleProperties(), s || (e = o.retrieve(this.is, this._ownStyleProperties, this._styles));
            var a = Boolean(e) && !s,
                l = this._applyStyleProperties(e);
            s || (e = {
                style: l = l && r ? l.cloneNode(!0) : l,
                _scopeSelector: this._scopeSelector,
                _styleProperties: this._styleProperties
            }, n.key.customStyle = {}, this.mixin(n.key.customStyle, this.customStyle), i._styleCache.store(this.is, e, n.key, this._styles), a || o.store(this.is, Object.create(e), this._ownStyleProperties, this._styles))
        },
        _computeStyleProperties: function(e) {
            var i = this._findStyleHost();
            i._styleProperties || i._computeStyleProperties();
            var n = Object.create(i._styleProperties);
            this.mixin(n, t.hostPropertiesFromStyles(this._styles)), e = e || t.propertyDataFromStyles(i._styles, this).properties, this.mixin(n, e), this.mixin(n, t.scopePropertiesFromStyles(this._styles)), t.mixinCustomStyle(n, this.customStyle), t.reify(n), this._styleProperties = n
        },
        _computeOwnStyleProperties: function() {
            for (var e, t = {}, i = 0; i < this._ownStylePropertyNames.length; i++)
                t[e = this._ownStylePropertyNames[i]] = this._styleProperties[e];
            this._ownStyleProperties = t
        },
        _scopeCount: 0,
        _applyStyleProperties: function(e) {
            var i = this._scopeSelector;
            this._scopeSelector = e ? e._scopeSelector : this.is + "-" + this.__proto__._scopeCount++;
            var n = t.applyElementStyle(this, this._styleProperties, this._scopeSelector, e && e.style);
            return r || t.applyElementScopeSelector(this, this._scopeSelector, i, this._scopeCssViaAttr), n
        },
        serializeValueToAttribute: function(t, i, n) {
            if (n = n || this, "class" === i && !r) {
                var o = n === this ? this.domHost || this.dataHost : this;
                o && (t = o._scopeElementClass(n, t))
            }
            n = this.shadyRoot && this.shadyRoot._hasDistributed ? Polymer.dom(n) : n, e.call(this, t, i, n)
        },
        _scopeElementClass: function(e, t) {
            return r || this._scopeCssViaAttr || (t = (t ? t + " " : "") + s + " " + this.is + (e._scopeSelector ? " " + a + " " + e._scopeSelector : "")), t
        },
        updateStyles: function(e) {
            this.isAttached && (e && this.mixin(this.customStyle, e), this._needsStyleProperties() ? this._updateStyleProperties() : this._styleProperties = null, this._styleCache && this._styleCache.clear(), this._updateRootStyles())
        },
        _updateRootStyles: function(e) {
            e = e || this.root;
            for (var t, i = Polymer.dom(e)._query(function(e) {
                    return e.shadyRoot || e.shadowRoot
                }), n = 0, r = i.length; n < r && (t = i[n]); n++)
                t.updateStyles && t.updateStyles()
        }
    }), Polymer.updateStyles = function(e) {
        n.updateStyles(e), Polymer.Base._updateRootStyles(document)
    };
    var o = new Polymer.StyleCache;
    Polymer.customStyleCache = o;
    var s = i.SCOPE_NAME,
        a = t.XSCOPE_NAME
}(), Polymer.Base._addFeature({
    _registerFeatures: function() {
        this._prepIs(), this._prepConstructor(), this._prepStyles()
    },
    _finishRegisterFeatures: function() {
        this._prepTemplate(), this._prepShimStyles(), this._prepAnnotations(), this._prepEffects(), this._prepBehaviors(), this._prepPropertyInfo(), this._prepBindings(), this._prepShady()
    },
    _prepBehavior: function(e) {
        this._addPropertyEffects(e.properties), this._addComplexObserverEffects(e.observers), this._addHostAttributes(e.hostAttributes)
    },
    _initFeatures: function() {
        this._setupGestures(), this._setupConfigure(), this._setupStyleProperties(), this._setupDebouncers(), this._setupShady(), this._registerHost(), this._template && (this._poolContent(), this._beginHosting(), this._stampTemplate(), this._endHosting(), this._marshalAnnotationReferences()), this._marshalInstanceEffects(), this._marshalBehaviors(), this._marshalHostAttributes(), this._marshalAttributes(), this._tryReady()
    },
    _marshalBehavior: function(e) {
        e.listeners && this._listenListeners(e.listeners)
    }
}), function() {
    var e = Polymer.Base._tryReady;
    Polymer.Base._tryReady = function() {
        if (this.is && this.hasAttribute("lazy-bind") || this.dataHost && this.dataHost.lazyChildren)
            for (var t in this._propertyEffects)
                if (this.hasOwnProperty(t)) {
                    var i = this[t];
                    delete this[t], this._config[t] = i
                }
        e.apply(this, arguments)
    }, Polymer.LightDomBindingBehavior = {
        lazyChildren: !0,
        _initFeatures: function() {
            this._beginHosting(), this.root = this, this._template = this, this._content = this, this._notes = null, this._prepAnnotations(), this._prepEffects(), this._prepBindings(), this._setupConfigure(), this._marshalAnnotationReferences(), this._marshalInstanceEffects(), this._tryReady()
        }
    }
}(), Polymer({
    extends: "body",
    is: "body-bind",
    behaviors: [Polymer.LightDomBindingBehavior]
}), function() {
    var e = Polymer.StyleProperties,
        t = Polymer.StyleUtil,
        i = Polymer.CssParse,
        n = Polymer.StyleDefaults,
        r = Polymer.StyleTransformer;
    Polymer({
        is: "custom-style",
        extends: "style",
        _template: null,
        properties: {
            include: String
        },
        ready: function() {
            this._tryApply()
        },
        attached: function() {
            this._tryApply()
        },
        _tryApply: function() {
            if (!this._appliesToDocument && this.parentNode && "dom-module" !== this.parentNode.localName) {
                this._appliesToDocument = !0;
                var e = this.__appliedElement || this;
                if (n.addStyle(e), e.textContent || this.include)
                    this._apply(!0);
                else {
                    var t = this,
                        i = new MutationObserver(function() {
                            i.disconnect(), t._apply(!0)
                        });
                    i.observe(e, {
                        childList: !0
                    })
                }
            }
        },
        _apply: function(e) {
            var i = this.__appliedElement || this;
            if (this.include && (i.textContent = t.cssFromModules(this.include, !0) + i.textContent), i.textContent) {
                t.forEachRule(t.rulesForStyle(i), function(e) {
                    r.documentRule(e)
                });
                var n = this,
                    o = function() {
                        n._applyCustomProperties(i)
                    };
                this._pendingApplyProperties && (cancelAnimationFrame(this._pendingApplyProperties), this._pendingApplyProperties = null), e ? this._pendingApplyProperties = requestAnimationFrame(o) : o()
            }
        },
        _applyCustomProperties: function(n) {
            this._computeStyleProperties();
            var r = this._styleProperties,
                o = t.rulesForStyle(n);
            n.textContent = t.toCssText(o, function(t) {
                var n = t.cssText = t.parsedCssText;
                t.propertyInfo && t.propertyInfo.cssText && (n = i.removeCustomPropAssignment(n), t.cssText = e.valueForProperties(n, r))
            })
        }
    })
}(), Polymer.Templatizer = {
    properties: {
        __hideTemplateChildren__: {
            observer: "_showHideChildren"
        }
    },
    _instanceProps: Polymer.nob,
    _parentPropPrefix: "_parent_",
    templatize: function(e) {
        if (this._templatized = e, e._content || (e._content = e.content), e._content._ctor)
            return this.ctor = e._content._ctor, void this._prepParentProperties(this.ctor.prototype, e);
        var t = Object.create(Polymer.Base);
        this._customPrepAnnotations(t, e), this._prepParentProperties(t, e), t._prepEffects(), this._customPrepEffects(t), t._prepBehaviors(), t._prepPropertyInfo(), t._prepBindings(), t._notifyPathUp = this._notifyPathUpImpl, t._scopeElementClass = this._scopeElementClassImpl, t.listen = this._listenImpl, t._showHideChildren = this._showHideChildrenImpl, t.__setPropertyOrig = this.__setProperty, t.__setProperty = this.__setPropertyImpl;
        var i = this._constructorImpl,
            n = function(e, t) {
                i.call(this, e, t)
            };
        n.prototype = t, t.constructor = n, e._content._ctor = n, this.ctor = n
    },
    _getRootDataHost: function() {
        return this.dataHost && this.dataHost._rootDataHost || this.dataHost
    },
    _showHideChildrenImpl: function(e) {
        for (var t = this._children, i = 0; i < t.length; i++) {
            var n = t[i];
            Boolean(e) != Boolean(n.__hideTemplateChildren__) && (n.nodeType === Node.TEXT_NODE ? e ? (n.__polymerTextContent__ = n.textContent, n.textContent = "") : n.textContent = n.__polymerTextContent__ : n.style && (e ? (n.__polymerDisplay__ = n.style.display, n.style.display = "none") : n.style.display = n.__polymerDisplay__)), n.__hideTemplateChildren__ = e
        }
    },
    __setPropertyImpl: function(e, t, i, n) {
        n && n.__hideTemplateChildren__ && "textContent" == e && (e = "__polymerTextContent__"), this.__setPropertyOrig(e, t, i, n)
    },
    _debounceTemplate: function(e) {
        Polymer.dom.addDebouncer(this.debounce("_debounceTemplate", e))
    },
    _flushTemplates: function() {
        Polymer.dom.flush()
    },
    _customPrepEffects: function(e) {
        var t = e._parentProps;
        for (var i in t)
            e._addPropertyEffect(i, "function", this._createHostPropEffector(i));
        for (i in this._instanceProps)
            e._addPropertyEffect(i, "function", this._createInstancePropEffector(i))
    },
    _customPrepAnnotations: function(e, t) {
        e._template = t;
        var i = t._content;
        if (!i._notes) {
            var n = e._rootDataHost;
            n && (Polymer.Annotations.prepElement = function() {
                n._prepElement()
            }), i._notes = Polymer.Annotations.parseAnnotations(t), Polymer.Annotations.prepElement = null, this._processAnnotations(i._notes)
        }
        e._notes = i._notes, e._parentProps = i._parentProps
    },
    _prepParentProperties: function(e, t) {
        var i = this._parentProps = e._parentProps;
        if (this._forwardParentProp && i) {
            var n,
                r = e._parentPropProto;
            if (!r) {
                for (n in this._instanceProps)
                    delete i[n];
                for (n in r = e._parentPropProto = Object.create(null), t != this && (Polymer.Bind.prepareModel(r), Polymer.Base.prepareModelNotifyPath(r)), i) {
                    var o = this._parentPropPrefix + n,
                        s = [{
                            kind: "function",
                            effect: this._createForwardPropEffector(n),
                            fn: Polymer.Bind._functionEffect
                        }, {
                            kind: "notify",
                            fn: Polymer.Bind._notifyEffect,
                            effect: {
                                event: Polymer.CaseMap.camelToDashCase(o) + "-changed"
                            }
                        }];
                    Polymer.Bind._createAccessors(r, o, s)
                }
            }
            var a = this;
            t != this && (Polymer.Bind.prepareInstance(t), t._forwardParentProp = function(e, t) {
                a._forwardParentProp(e, t)
            }), this._extendTemplate(t, r), t._pathEffector = function(e, t, i) {
                return a._pathEffectorImpl(e, t, i)
            }
        }
    },
    _createForwardPropEffector: function(e) {
        return function(t, i) {
            this._forwardParentProp(e, i)
        }
    },
    _createHostPropEffector: function(e) {
        var t = this._parentPropPrefix;
        return function(i, n) {
            this.dataHost._templatized[t + e] = n
        }
    },
    _createInstancePropEffector: function(e) {
        return function(t, i, n, r) {
            r || this.dataHost._forwardInstanceProp(this, e, i)
        }
    },
    _extendTemplate: function(e, t) {
        var i = Object.getOwnPropertyNames(t);
        t._propertySetter && (e._propertySetter = t._propertySetter);
        for (var n, r = 0; r < i.length && (n = i[r]); r++) {
            var o = e[n],
                s = Object.getOwnPropertyDescriptor(t, n);
            Object.defineProperty(e, n, s), void 0 !== o && e._propertySetter(n, o)
        }
    },
    _showHideChildren: function(e) {},
    _forwardInstancePath: function(e, t, i) {},
    _forwardInstanceProp: function(e, t, i) {},
    _notifyPathUpImpl: function(e, t) {
        var i = this.dataHost,
            n = e.indexOf("."),
            r = n < 0 ? e : e.slice(0, n);
        i._forwardInstancePath.call(i, this, e, t), r in i._parentProps && i._templatized._notifyPath(i._parentPropPrefix + e, t)
    },
    _pathEffectorImpl: function(e, t, i) {
        if (this._forwardParentPath && 0 === e.indexOf(this._parentPropPrefix)) {
            var n = e.substring(this._parentPropPrefix.length);
            this._modelForPath(n) in this._parentProps && this._forwardParentPath(n, t)
        }
        Polymer.Base._pathEffector.call(this._templatized, e, t, i)
    },
    _constructorImpl: function(e, t) {
        this._rootDataHost = t._getRootDataHost(), this._setupConfigure(e), this._registerHost(t), this._beginHosting(), this.root = this.instanceTemplate(this._template), this.root.__noContent = !this._notes._hasContent, this.root.__styleScoped = !0, this._endHosting(), this._marshalAnnotatedNodes(), this._marshalInstanceEffects(), this._marshalAnnotatedListeners();
        for (var i = [], n = this.root.firstChild; n; n = n.nextSibling)
            i.push(n), n._templateInstance = this;
        this._children = i, t.__hideTemplateChildren__ && this._showHideChildren(!0), this._tryReady()
    },
    _listenImpl: function(e, t, i) {
        var n = this,
            r = this._rootDataHost,
            o = r._createEventHandler(e, t, i);
        r._listen(e, t, function(e) {
            e.model = n, o(e)
        })
    },
    _scopeElementClassImpl: function(e, t) {
        var i = this._rootDataHost;
        return i ? i._scopeElementClass(e, t) : t
    },
    stamp: function(e) {
        if (e = e || {}, this._parentProps) {
            var t = this._templatized;
            for (var i in this._parentProps)
                void 0 === e[i] && (e[i] = t[this._parentPropPrefix + i])
        }
        return new this.ctor(e, this)
    },
    modelForElement: function(e) {
        for (var t; e;)
            if (t = e._templateInstance) {
                if (t.dataHost == this)
                    return t;
                e = t.dataHost
            } else
                e = e.parentNode
    }
}, Polymer({
    is: "dom-template",
    extends: "template",
    _template: null,
    behaviors: [Polymer.Templatizer],
    ready: function() {
        this.templatize(this)
    }
}), Polymer._collections = new WeakMap, Polymer.Collection = function(e) {
    Polymer._collections.set(e, this), this.userArray = e, this.store = e.slice(), this.initMap()
}, Polymer.Collection.prototype = {
    constructor: Polymer.Collection,
    initMap: function() {
        for (var e = this.omap = new WeakMap, t = this.pmap = {}, i = this.store, n = 0; n < i.length; n++) {
            var r = i[n];
            r && "object" == typeof r ? e.set(r, n) : t[r] = n
        }
    },
    add: function(e) {
        var t = this.store.push(e) - 1;
        return e && "object" == typeof e ? this.omap.set(e, t) : this.pmap[e] = t, "#" + t
    },
    removeKey: function(e) {
        (e = this._parseKey(e)) && (this._removeFromMap(this.store[e]), delete this.store[e])
    },
    _removeFromMap: function(e) {
        e && "object" == typeof e ? this.omap.delete(e) : delete this.pmap[e]
    },
    remove: function(e) {
        var t = this.getKey(e);
        return this.removeKey(t), t
    },
    getKey: function(e) {
        var t;
        if (void 0 != (t = e && "object" == typeof e ? this.omap.get(e) : this.pmap[e]))
            return "#" + t
    },
    getKeys: function() {
        return Object.keys(this.store).map(function(e) {
            return "#" + e
        })
    },
    _parseKey: function(e) {
        if (e && "#" == e[0])
            return e.slice(1)
    },
    setItem: function(e, t) {
        if (e = this._parseKey(e)) {
            var i = this.store[e];
            i && this._removeFromMap(i), t && "object" == typeof t ? this.omap.set(t, e) : this.pmap[t] = e, this.store[e] = t
        }
    },
    getItem: function(e) {
        if (e = this._parseKey(e))
            return this.store[e]
    },
    getItems: function() {
        var e = [],
            t = this.store;
        for (var i in t)
            e.push(t[i]);
        return e
    },
    _applySplices: function(e) {
        for (var t, i, n = {}, r = 0; r < e.length && (i = e[r]); r++) {
            i.addedKeys = [];
            for (var o = 0; o < i.removed.length; o++)
                n[t = this.getKey(i.removed[o])] = n[t] ? null : -1;
            for (o = 0; o < i.addedCount; o++) {
                var s = this.userArray[i.index + o];
                n[t = void 0 === (t = this.getKey(s)) ? this.add(s) : t] = n[t] ? null : 1, i.addedKeys.push(t)
            }
        }
        var a = [],
            l = [];
        for (t in n)
            n[t] < 0 && (this.removeKey(t), a.push(t)), n[t] > 0 && l.push(t);
        return [{
            removed: a,
            added: l
        }]
    }
}, Polymer.Collection.get = function(e) {
    return Polymer._collections.get(e) || new Polymer.Collection(e)
}, Polymer.Collection.applySplices = function(e, t) {
    var i = Polymer._collections.get(e);
    return i ? i._applySplices(t) : null
}, Polymer({
    is: "dom-repeat",
    extends: "template",
    _template: null,
    properties: {
        items: {
            type: Array
        },
        as: {
            type: String,
            value: "item"
        },
        indexAs: {
            type: String,
            value: "index"
        },
        sort: {
            type: Function,
            observer: "_sortChanged"
        },
        filter: {
            type: Function,
            observer: "_filterChanged"
        },
        observe: {
            type: String,
            observer: "_observeChanged"
        },
        delay: Number,
        renderedItemCount: {
            type: Number,
            notify: !0,
            readOnly: !0
        },
        initialCount: {
            type: Number,
            observer: "_initializeChunking"
        },
        targetFramerate: {
            type: Number,
            value: 20
        },
        _targetFrameTime: {
            type: Number,
            computed: "_computeFrameTime(targetFramerate)"
        }
    },
    behaviors: [Polymer.Templatizer],
    observers: ["_itemsChanged(items.*)"],
    created: function() {
        this._instances = [], this._pool = [], this._limit = Infinity;
        var e = this;
        this._boundRenderChunk = function() {
            e._renderChunk()
        }
    },
    detached: function() {
        this.__isDetached = !0;
        for (var e = 0; e < this._instances.length; e++)
            this._detachInstance(e)
    },
    attached: function() {
        if (this.__isDetached) {
            this.__isDetached = !1;
            for (var e = Polymer.dom(Polymer.dom(this).parentNode), t = 0; t < this._instances.length; t++)
                this._attachInstance(t, e)
        }
    },
    ready: function() {
        this._instanceProps = {
            __key__: !0
        }, this._instanceProps[this.as] = !0, this._instanceProps[this.indexAs] = !0, this.ctor || this.templatize(this)
    },
    _sortChanged: function(e) {
        var t = this._getRootDataHost();
        this._sortFn = e && ("function" == typeof e ? e : function() {
            return t[e].apply(t, arguments)
        }), this._needFullRefresh = !0, this.items && this._debounceTemplate(this._render)
    },
    _filterChanged: function(e) {
        var t = this._getRootDataHost();
        this._filterFn = e && ("function" == typeof e ? e : function() {
            return t[e].apply(t, arguments)
        }), this._needFullRefresh = !0, this.items && this._debounceTemplate(this._render)
    },
    _computeFrameTime: function(e) {
        return Math.ceil(1e3 / e)
    },
    _initializeChunking: function() {
        this.initialCount && (this._limit = this.initialCount, this._chunkCount = this.initialCount, this._lastChunkTime = performance.now())
    },
    _tryRenderChunk: function() {
        this.items && this._limit < this.items.length && this.debounce("renderChunk", this._requestRenderChunk)
    },
    _requestRenderChunk: function() {
        requestAnimationFrame(this._boundRenderChunk)
    },
    _renderChunk: function() {
        var e = performance.now(),
            t = this._targetFrameTime / (e - this._lastChunkTime);
        this._chunkCount = Math.round(this._chunkCount * t) || 1, this._limit += this._chunkCount, this._lastChunkTime = e, this._debounceTemplate(this._render)
    },
    _observeChanged: function() {
        this._observePaths = this.observe && this.observe.replace(".*", ".").split(" ")
    },
    _itemsChanged: function(e) {
        if ("items" == e.path)
            Array.isArray(this.items) ? this.collection = Polymer.Collection.get(this.items) : this.items ? this._error(this._logf("dom-repeat", "expected array for `items`, found", this.items)) : this.collection = null, this._keySplices = [], this._indexSplices = [], this._needFullRefresh = !0, this._initializeChunking(), this._debounceTemplate(this._render);
        else if ("items.splices" == e.path)
            this._keySplices = this._keySplices.concat(e.value.keySplices), this._indexSplices = this._indexSplices.concat(e.value.indexSplices), this._debounceTemplate(this._render);
        else {
            var t = e.path.slice(6);
            this._forwardItemPath(t, e.value), this._checkObservedPaths(t)
        }
    },
    _checkObservedPaths: function(e) {
        if (this._observePaths) {
            e = e.substring(e.indexOf(".") + 1);
            for (var t = this._observePaths, i = 0; i < t.length; i++)
                if (0 === e.indexOf(t[i]))
                    return this._needFullRefresh = !0, void (this.delay ? this.debounce("render", this._render, this.delay) : this._debounceTemplate(this._render))
        }
    },
    render: function() {
        this._needFullRefresh = !0, this._debounceTemplate(this._render), this._flushTemplates()
    },
    _render: function() {
        this._needFullRefresh ? (this._applyFullRefresh(), this._needFullRefresh = !1) : this._keySplices.length && (this._sortFn ? this._applySplicesUserSort(this._keySplices) : this._filterFn ? this._applyFullRefresh() : this._applySplicesArrayOrder(this._indexSplices)), this._keySplices = [], this._indexSplices = [];
        for (var e = this._keyToInstIdx = {}, t = this._instances.length - 1; t >= 0; t--) {
            var i = this._instances[t];
            i.isPlaceholder && t < this._limit ? i = this._insertInstance(t, i.__key__) : !i.isPlaceholder && t >= this._limit && (i = this._downgradeInstance(t, i.__key__)), e[i.__key__] = t, i.isPlaceholder || i.__setProperty(this.indexAs, t, !0)
        }
        this._pool.length = 0, this._setRenderedItemCount(this._instances.length), this.fire("dom-change"), this._tryRenderChunk()
    },
    _applyFullRefresh: function() {
        var e,
            t = this.collection;
        if (this._sortFn)
            e = t ? t.getKeys() : [];
        else {
            e = [];
            var i = this.items;
            if (i)
                for (var n = 0; n < i.length; n++)
                    e.push(t.getKey(i[n]))
        }
        var r = this;
        for (this._filterFn && (e = e.filter(function(e) {
            return r._filterFn(t.getItem(e))
        })), this._sortFn && e.sort(function(e, i) {
            return r._sortFn(t.getItem(e), t.getItem(i))
        }), n = 0; n < e.length; n++) {
            var o = e[n],
                s = this._instances[n];
            s ? (s.__key__ = o, !s.isPlaceholder && n < this._limit && s.__setProperty(this.as, t.getItem(o), !0)) : n < this._limit ? this._insertInstance(n, o) : this._insertPlaceholder(n, o)
        }
        for (var a = this._instances.length - 1; a >= n; a--)
            this._detachAndRemoveInstance(a)
    },
    _numericSort: function(e, t) {
        return e - t
    },
    _applySplicesUserSort: function(e) {
        for (var t, i, n = this.collection, r = {}, o = 0; o < e.length && (i = e[o]); o++) {
            for (var s = 0; s < i.removed.length; s++)
                r[t = i.removed[s]] = r[t] ? null : -1;
            for (s = 0; s < i.added.length; s++)
                r[t = i.added[s]] = r[t] ? null : 1
        }
        var a = [],
            l = [];
        for (t in r)
            -1 === r[t] && a.push(this._keyToInstIdx[t]), 1 === r[t] && l.push(t);
        if (a.length)
            for (a.sort(this._numericSort), o = a.length - 1; o >= 0; o--) {
                var h = a[o];
                void 0 !== h && this._detachAndRemoveInstance(h)
            }
        var c = this;
        if (l.length) {
            this._filterFn && (l = l.filter(function(e) {
                return c._filterFn(n.getItem(e))
            })), l.sort(function(e, t) {
                return c._sortFn(n.getItem(e), n.getItem(t))
            });
            var u = 0;
            for (o = 0; o < l.length; o++)
                u = this._insertRowUserSort(u, l[o])
        }
    },
    _insertRowUserSort: function(e, t) {
        for (var i = this.collection, n = i.getItem(t), r = this._instances.length - 1, o = -1; e <= r;) {
            var s = e + r >> 1,
                a = this._instances[s].__key__,
                l = this._sortFn(i.getItem(a), n);
            if (l < 0)
                e = s + 1;
            else {
                if (!(l > 0)) {
                    o = s;
                    break
                }
                r = s - 1
            }
        }
        return o < 0 && (o = r + 1), this._insertPlaceholder(o, t), o
    },
    _applySplicesArrayOrder: function(e) {
        for (var t, i = 0; i < e.length && (t = e[i]); i++) {
            for (var n = 0; n < t.removed.length; n++)
                this._detachAndRemoveInstance(t.index);
            for (n = 0; n < t.addedKeys.length; n++)
                this._insertPlaceholder(t.index + n, t.addedKeys[n])
        }
    },
    _detachInstance: function(e) {
        var t = this._instances[e];
        if (!t.isPlaceholder) {
            for (var i = 0; i < t._children.length; i++) {
                var n = t._children[i];
                Polymer.dom(t.root).appendChild(n)
            }
            return t
        }
    },
    _attachInstance: function(e, t) {
        var i = this._instances[e];
        i.isPlaceholder || t.insertBefore(i.root, this)
    },
    _detachAndRemoveInstance: function(e) {
        var t = this._detachInstance(e);
        t && this._pool.push(t), this._instances.splice(e, 1)
    },
    _insertPlaceholder: function(e, t) {
        this._instances.splice(e, 0, {
            isPlaceholder: !0,
            __key__: t
        })
    },
    _stampInstance: function(e, t) {
        var i = {
            __key__: t
        };
        return i[this.as] = this.collection.getItem(t), i[this.indexAs] = e, this.stamp(i)
    },
    _insertInstance: function(e, t) {
        var i = this._pool.pop();
        i ? (i.__setProperty(this.as, this.collection.getItem(t), !0), i.__setProperty("__key__", t, !0)) : i = this._stampInstance(e, t);
        var n = this._instances[e + 1],
            r = n && !n.isPlaceholder ? n._children[0] : this,
            o = Polymer.dom(this).parentNode;
        return Polymer.dom(o).insertBefore(i.root, r), this._instances[e] = i, i
    },
    _downgradeInstance: function(e, t) {
        var i = this._detachInstance(e);
        return i && this._pool.push(i), i = {
            isPlaceholder: !0,
            __key__: t
        }, this._instances[e] = i, i
    },
    _showHideChildren: function(e) {
        for (var t = 0; t < this._instances.length; t++)
            this._instances[t]._showHideChildren(e)
    },
    _forwardInstanceProp: function(e, t, i) {
        var n;
        t == this.as && (n = this._sortFn || this._filterFn ? this.items.indexOf(this.collection.getItem(e.__key__)) : e[this.indexAs], this.set("items." + n, i))
    },
    _forwardInstancePath: function(e, t, i) {
        0 === t.indexOf(this.as + ".") && this._notifyPath("items." + e.__key__ + "." + t.slice(this.as.length + 1), i)
    },
    _forwardParentProp: function(e, t) {
        for (var i, n = this._instances, r = 0; r < n.length && (i = n[r]); r++)
            i.isPlaceholder || i.__setProperty(e, t, !0)
    },
    _forwardParentPath: function(e, t) {
        for (var i, n = this._instances, r = 0; r < n.length && (i = n[r]); r++)
            i.isPlaceholder || i._notifyPath(e, t, !0)
    },
    _forwardItemPath: function(e, t) {
        if (this._keyToInstIdx) {
            var i = e.indexOf("."),
                n = e.substring(0, i < 0 ? e.length : i),
                r = this._keyToInstIdx[n],
                o = this._instances[r];
            o && !o.isPlaceholder && (i >= 0 ? (e = this.as + "." + e.substring(i + 1), o._notifyPath(e, t, !0)) : o.__setProperty(this.as, t, !0))
        }
    },
    itemForElement: function(e) {
        var t = this.modelForElement(e);
        return t && t[this.as]
    },
    keyForElement: function(e) {
        var t = this.modelForElement(e);
        return t && t.__key__
    },
    indexForElement: function(e) {
        var t = this.modelForElement(e);
        return t && t[this.indexAs]
    }
}), Polymer({
    is: "array-selector",
    _template: null,
    properties: {
        items: {
            type: Array,
            observer: "clearSelection"
        },
        multi: {
            type: Boolean,
            value: !1,
            observer: "clearSelection"
        },
        selected: {
            type: Object,
            notify: !0
        },
        selectedItem: {
            type: Object,
            notify: !0
        },
        toggle: {
            type: Boolean,
            value: !1
        }
    },
    clearSelection: function() {
        if (Array.isArray(this.selected))
            for (var e = 0; e < this.selected.length; e++)
                this.unlinkPaths("selected." + e);
        else
            this.unlinkPaths("selected"), this.unlinkPaths("selectedItem");
        this.multi ? this.selected && !this.selected.length || (this.selected = [], this._selectedColl = Polymer.Collection.get(this.selected)) : (this.selected = null, this._selectedColl = null), this.selectedItem = null
    },
    isSelected: function(e) {
        return this.multi ? void 0 !== this._selectedColl.getKey(e) : this.selected == e
    },
    deselect: function(e) {
        if (this.multi) {
            if (this.isSelected(e)) {
                var t = this._selectedColl.getKey(e);
                this.arrayDelete("selected", e), this.unlinkPaths("selected." + t)
            }
        } else
            this.selected = null, this.selectedItem = null, this.unlinkPaths("selected"), this.unlinkPaths("selectedItem")
    },
    select: function(e) {
        var t = Polymer.Collection.get(this.items).getKey(e);
        if (this.multi)
            if (this.isSelected(e))
                this.toggle && this.deselect(e);
            else {
                this.push("selected", e);
                var i = this._selectedColl.getKey(e);
                this.linkPaths("selected." + i, "items." + t)
            }
        else
            this.toggle && e == this.selected ? this.deselect() : (this.selected = e, this.selectedItem = e, this.linkPaths("selected", "items." + t), this.linkPaths("selectedItem", "items." + t))
    }
}), Polymer({
    is: "dom-if",
    extends: "template",
    _template: null,
    properties: {
        if: {
            type: Boolean,
            value: !1,
            observer: "_queueRender"
        },
        restamp: {
            type: Boolean,
            value: !1,
            observer: "_queueRender"
        }
    },
    behaviors: [Polymer.Templatizer],
    _queueRender: function() {
        this._debounceTemplate(this._render)
    },
    detached: function() {
        this.parentNode && (this.parentNode.nodeType != Node.DOCUMENT_FRAGMENT_NODE || Polymer.Settings.hasShadow && this.parentNode instanceof ShadowRoot) || this._teardownInstance()
    },
    attached: function() {
        this.if && this.ctor && this.async(this._ensureInstance)
    },
    render: function() {
        this._flushTemplates()
    },
    _render: function() {
        this.if ? (this.ctor || this.templatize(this), this._ensureInstance(), this._showHideChildren()) : this.restamp && this._teardownInstance(), !this.restamp && this._instance && this._showHideChildren(), this.if != this._lastIf && (this.fire("dom-change"), this._lastIf = this.if)
    },
    _ensureInstance: function() {
        var e = Polymer.dom(this).parentNode;
        if (e) {
            var t = Polymer.dom(e);
            if (this._instance) {
                var i = this._instance._children;
                if (i && i.length && Polymer.dom(this).previousSibling !== i[i.length - 1])
                    for (var n, r = 0; r < i.length && (n = i[r]); r++)
                        t.insertBefore(n, this)
            } else {
                this._instance = this.stamp();
                var o = this._instance.root;
                t.insertBefore(o, this)
            }
        }
    },
    _teardownInstance: function() {
        if (this._instance) {
            var e = this._instance._children;
            if (e && e.length)
                for (var t, i = Polymer.dom(Polymer.dom(e[0]).parentNode), n = 0; n < e.length && (t = e[n]); n++)
                    i.removeChild(t);
            this._instance = null
        }
    },
    _showHideChildren: function() {
        var e = this.__hideTemplateChildren__ || !this.if;
        this._instance && this._instance._showHideChildren(e)
    },
    _forwardParentProp: function(e, t) {
        this._instance && (this._instance[e] = t)
    },
    _forwardParentPath: function(e, t) {
        this._instance && this._instance._notifyPath(e, t, !0)
    }
}), Polymer({
    is: "dom-bind",
    extends: "template",
    _template: null,
    created: function() {
        var e = this;
        Polymer.RenderStatus.whenReady(function() {
            "loading" == document.readyState ? document.addEventListener("DOMContentLoaded", function() {
                e._markImportsReady()
            }) : e._markImportsReady()
        })
    },
    _ensureReady: function() {
        this._readied || this._readySelf()
    },
    _markImportsReady: function() {
        this._importsReady = !0, this._ensureReady()
    },
    _registerFeatures: function() {
        this._prepConstructor()
    },
    _insertChildren: function() {
        Polymer.dom(Polymer.dom(this).parentNode).insertBefore(this.root, this)
    },
    _removeChildren: function() {
        if (this._children)
            for (var e = 0; e < this._children.length; e++)
                this.root.appendChild(this._children[e])
    },
    _initFeatures: function() {},
    _scopeElementClass: function(e, t) {
        return this.dataHost ? this.dataHost._scopeElementClass(e, t) : t
    },
    _prepConfigure: function() {
        var e = {};
        for (var t in this._propertyEffects)
            e[t] = this[t];
        var i = this._setupConfigure;
        this._setupConfigure = function() {
            i.call(this, e)
        }
    },
    attached: function() {
        this._importsReady && this.render()
    },
    detached: function() {
        this._removeChildren()
    },
    render: function() {
        this._ensureReady(), this._children || (this._template = this, this._prepAnnotations(), this._prepEffects(), this._prepBehaviors(), this._prepConfigure(), this._prepBindings(), this._prepPropertyInfo(), Polymer.Base._initFeatures.call(this), this._children = Polymer.TreeApi.arrayCopyChildNodes(this.root)), this._insertChildren(), this.fire("dom-change")
    }
}), function() {
    var e = {},
        t = {},
        i = null;
    Polymer.IronMeta = Polymer({
        is: "iron-meta",
        properties: {
            type: {
                type: String,
                value: "default",
                observer: "_typeChanged"
            },
            key: {
                type: String,
                observer: "_keyChanged"
            },
            value: {
                type: Object,
                notify: !0,
                observer: "_valueChanged"
            },
            self: {
                type: Boolean,
                observer: "_selfChanged"
            },
            list: {
                type: Array,
                notify: !0
            }
        },
        hostAttributes: {
            hidden: !0
        },
        factoryImpl: function(e) {
            if (e)
                for (var t in e)
                    switch (t) {
                    case "type":
                    case "key":
                    case "value":
                        this[t] = e[t]
                    }
        },
        created: function() {
            this._metaDatas = e, this._metaArrays = t
        },
        _keyChanged: function(e, t) {
            this._resetRegistration(t)
        },
        _valueChanged: function(e) {
            this._resetRegistration(this.key)
        },
        _selfChanged: function(e) {
            e && (this.value = this)
        },
        _typeChanged: function(i) {
            this._unregisterKey(this.key), e[i] || (e[i] = {}), this._metaData = e[i], t[i] || (t[i] = []), this.list = t[i], this._registerKeyValue(this.key, this.value)
        },
        byKey: function(e) {
            return this._metaData && this._metaData[e]
        },
        _resetRegistration: function(e) {
            this._unregisterKey(e), this._registerKeyValue(this.key, this.value)
        },
        _unregisterKey: function(e) {
            this._unregister(e, this._metaData, this.list)
        },
        _registerKeyValue: function(e, t) {
            this._register(e, t, this._metaData, this.list)
        },
        _register: function(e, t, i, n) {
            e && i && void 0 !== t && (i[e] = t, n.push(t))
        },
        _unregister: function(e, t, i) {
            if (e && t && e in t) {
                var n = t[e];
                delete t[e], this.arrayDelete(i, n)
            }
        }
    }), Polymer.IronMeta.getIronMeta = function() {
        return null === i && (i = new Polymer.IronMeta), i
    }, Polymer.IronMetaQuery = Polymer({
        is: "iron-meta-query",
        properties: {
            type: {
                type: String,
                value: "default",
                observer: "_typeChanged"
            },
            key: {
                type: String,
                observer: "_keyChanged"
            },
            value: {
                type: Object,
                notify: !0,
                readOnly: !0
            },
            list: {
                type: Array,
                notify: !0
            }
        },
        factoryImpl: function(e) {
            if (e)
                for (var t in e)
                    switch (t) {
                    case "type":
                    case "key":
                        this[t] = e[t]
                    }
        },
        created: function() {
            this._metaDatas = e, this._metaArrays = t
        },
        _keyChanged: function(e) {
            this._setValue(this._metaData && this._metaData[e])
        },
        _typeChanged: function(i) {
            this._metaData = e[i], this.list = t[i], this.key && this._keyChanged(this.key)
        },
        byKey: function(e) {
            return this._metaData && this._metaData[e]
        }
    })
}(), Polymer({
    is: "iron-icon",
    properties: {
        icon: {
            type: String
        },
        theme: {
            type: String
        },
        src: {
            type: String
        },
        _meta: {
            value: Polymer.Base.create("iron-meta", {
                type: "iconset"
            })
        }
    },
    observers: ["_updateIcon(_meta, isAttached)", "_updateIcon(theme, isAttached)", "_srcChanged(src, isAttached)", "_iconChanged(icon, isAttached)"],
    _DEFAULT_ICONSET: "icons",
    _iconChanged: function(e) {
        var t = (e || "").split(":");
        this._iconName = t.pop(), this._iconsetName = t.pop() || this._DEFAULT_ICONSET, this._updateIcon()
    },
    _srcChanged: function(e) {
        this._updateIcon()
    },
    _usesIconset: function() {
        return this.icon || !this.src
    },
    _updateIcon: function() {
        this._usesIconset() ? (this._img && this._img.parentNode && Polymer.dom(this.root).removeChild(this._img), "" === this._iconName ? this._iconset && this._iconset.removeIcon(this) : this._iconsetName && this._meta && (this._iconset = this._meta.byKey(this._iconsetName), this._iconset ? (this._iconset.applyIcon(this, this._iconName, this.theme), this.unlisten(window, "iron-iconset-added", "_updateIcon")) : this.listen(window, "iron-iconset-added", "_updateIcon"))) : (this._iconset && this._iconset.removeIcon(this), this._img || (this._img = document.createElement("img"), this._img.style.width = "100%", this._img.style.height = "100%", this._img.draggable = !1), this._img.src = this.src, Polymer.dom(this.root).appendChild(this._img))
    }
}), Polymer({
    is: "iron-iconset-svg",
    properties: {
        name: {
            type: String,
            observer: "_nameChanged"
        },
        size: {
            type: Number,
            value: 24
        },
        rtlMirroring: {
            type: Boolean,
            value: !1
        }
    },
    attached: function() {
        this.style.display = "none"
    },
    getIconNames: function() {
        return this._icons = this._createIconMap(), Object.keys(this._icons).map(function(e) {
            return this.name + ":" + e
        }, this)
    },
    applyIcon: function(e, t) {
        e = e.root || e, this.removeIcon(e);
        var i = this._cloneIcon(t, this.rtlMirroring && this._targetIsRTL(e));
        if (i) {
            var n = Polymer.dom(e);
            return n.insertBefore(i, n.childNodes[0]), e._svgIcon = i
        }
        return null
    },
    removeIcon: function(e) {
        (e = e.root || e)._svgIcon && (Polymer.dom(e).removeChild(e._svgIcon), e._svgIcon = null)
    },
    _targetIsRTL: function(e) {
        return null == this.__targetIsRTL && (e && e.nodeType !== Node.ELEMENT_NODE && (e = e.host), this.__targetIsRTL = e && "rtl" === window.getComputedStyle(e).direction), this.__targetIsRTL
    },
    _nameChanged: function() {
        new Polymer.IronMeta({
            type: "iconset",
            key: this.name,
            value: this
        }), this.async(function() {
            this.fire("iron-iconset-added", this, {
                node: window
            })
        })
    },
    _createIconMap: function() {
        var e = Object.create(null);
        return Polymer.dom(this).querySelectorAll("[id]").forEach(function(t) {
            e[t.id] = t
        }), e
    },
    _cloneIcon: function(e, t) {
        return this._icons = this._icons || this._createIconMap(), this._prepareSvgClone(this._icons[e], this.size, t)
    },
    _prepareSvgClone: function(e, t, i) {
        if (e) {
            var n = e.cloneNode(!0),
                r = document.createElementNS("http://www.w3.org/2000/svg", "svg"),
                o = n.getAttribute("viewBox") || "0 0 " + t + " " + t,
                s = "pointer-events: none; display: block; width: 100%; height: 100%;";
            return i && n.hasAttribute("mirror-in-rtl") && (s += "-webkit-transform:scale(-1,1);transform:scale(-1,1);"), r.setAttribute("viewBox", o), r.setAttribute("preserveAspectRatio", "xMidYMid meet"), r.style.cssText = s, r.appendChild(n).removeAttribute("id"), r
        }
        return null
    }
}), function() {
    "use strict";
    var e = {
            "U+0008": "backspace",
            "U+0009": "tab",
            "U+001B": "esc",
            "U+0020": "space",
            "U+007F": "del"
        },
        t = {
            8: "backspace",
            9: "tab",
            13: "enter",
            27: "esc",
            33: "pageup",
            34: "pagedown",
            35: "end",
            36: "home",
            32: "space",
            37: "left",
            38: "up",
            39: "right",
            40: "down",
            46: "del",
            106: "*"
        },
        i = {
            shift: "shiftKey",
            ctrl: "ctrlKey",
            alt: "altKey",
            meta: "metaKey"
        },
        n = /[a-z0-9*]/,
        r = /U\+/,
        o = /^arrow/,
        s = /^space(bar)?/,
        a = /^escape$/;
    function l(e, t) {
        var i = "";
        if (e) {
            var r = e.toLowerCase();
            " " === r || s.test(r) ? i = "space" : a.test(r) ? i = "esc" : 1 == r.length ? t && !n.test(r) || (i = r) : i = o.test(r) ? r.replace("arrow", "") : "multiply" == r ? "*" : r
        }
        return i
    }
    function h(i, n) {
        return o = n, s = i.hasModifiers, (o.key ? l(o.key, s) : o.detail && o.detail.key ? l(o.detail.key, s) : (h = "", (a = o.keyIdentifier) && (a in e ? h = e[a] : r.test(a) ? (a = parseInt(a.replace("U+", "0x"), 16), h = String.fromCharCode(a).toLowerCase()) : h = a.toLowerCase()), h || function(e) {
            var i = "";
            return Number(e) && (i = e >= 65 && e <= 90 ? String.fromCharCode(32 + e) : e >= 112 && e <= 123 ? "f" + (e - 112) : e >= 48 && e <= 57 ? String(e - 48) : e >= 96 && e <= 105 ? String(e - 96) : t[e]), i
        }(o.keyCode) || "")) === i.key && (!i.hasModifiers || !!n.shiftKey == !!i.shiftKey && !!n.ctrlKey == !!i.ctrlKey && !!n.altKey == !!i.altKey && !!n.metaKey == !!i.metaKey);
        var o,
            s,
            a,
            h
    }
    function c(e) {
        return e.trim().split(" ").map(function(e) {
            return function(e) {
                return 1 === e.length ? {
                    combo: e,
                    key: e,
                    event: "keydown"
                } : e.split("+").reduce(function(e, t) {
                    var n = t.split(":"),
                        r = n[0],
                        o = n[1];
                    return r in i ? (e[i[r]] = !0, e.hasModifiers = !0) : (e.key = r, e.event = o || "keydown"), e
                }, {
                    combo: e.split(":").shift()
                })
            }(e)
        })
    }
    Polymer.IronA11yKeysBehavior = {
        properties: {
            keyEventTarget: {
                type: Object,
                value: function() {
                    return this
                }
            },
            stopKeyboardEventPropagation: {
                type: Boolean,
                value: !1
            },
            _boundKeyHandlers: {
                type: Array,
                value: function() {
                    return []
                }
            },
            _imperativeKeyBindings: {
                type: Object,
                value: function() {
                    return {}
                }
            }
        },
        observers: ["_resetKeyEventListeners(keyEventTarget, _boundKeyHandlers)"],
        keyBindings: {},
        registered: function() {
            this._prepKeyBindings()
        },
        attached: function() {
            this._listenKeyEventListeners()
        },
        detached: function() {
            this._unlistenKeyEventListeners()
        },
        addOwnKeyBinding: function(e, t) {
            this._imperativeKeyBindings[e] = t, this._prepKeyBindings(), this._resetKeyEventListeners()
        },
        removeOwnKeyBindings: function() {
            this._imperativeKeyBindings = {}, this._prepKeyBindings(), this._resetKeyEventListeners()
        },
        keyboardEventMatchesKeys: function(e, t) {
            for (var i = c(t), n = 0; n < i.length; ++n)
                if (h(i[n], e))
                    return !0;
            return !1
        },
        _collectKeyBindings: function() {
            var e = this.behaviors.map(function(e) {
                return e.keyBindings
            });
            return -1 === e.indexOf(this.keyBindings) && e.push(this.keyBindings), e
        },
        _prepKeyBindings: function() {
            for (var e in this._keyBindings = {}, this._collectKeyBindings().forEach(function(e) {
                for (var t in e)
                    this._addKeyBinding(t, e[t])
            }, this), this._imperativeKeyBindings)
                this._addKeyBinding(e, this._imperativeKeyBindings[e]);
            for (var t in this._keyBindings)
                this._keyBindings[t].sort(function(e, t) {
                    var i = e[0].hasModifiers;
                    return i === t[0].hasModifiers ? 0 : i ? -1 : 1
                })
        },
        _addKeyBinding: function(e, t) {
            c(e).forEach(function(e) {
                this._keyBindings[e.event] = this._keyBindings[e.event] || [], this._keyBindings[e.event].push([e, t])
            }, this)
        },
        _resetKeyEventListeners: function() {
            this._unlistenKeyEventListeners(), this.isAttached && this._listenKeyEventListeners()
        },
        _listenKeyEventListeners: function() {
            this.keyEventTarget && Object.keys(this._keyBindings).forEach(function(e) {
                var t = this._keyBindings[e],
                    i = this._onKeyBindingEvent.bind(this, t);
                this._boundKeyHandlers.push([this.keyEventTarget, e, i]), this.keyEventTarget.addEventListener(e, i)
            }, this)
        },
        _unlistenKeyEventListeners: function() {
            for (var e, t, i, n; this._boundKeyHandlers.length;)
                t = (e = this._boundKeyHandlers.pop())[0], i = e[1], n = e[2], t.removeEventListener(i, n)
        },
        _onKeyBindingEvent: function(e, t) {
            if (this.stopKeyboardEventPropagation && t.stopPropagation(), !t.defaultPrevented)
                for (var i = 0; i < e.length; i++) {
                    var n = e[i][0],
                        r = e[i][1];
                    if (h(n, t) && (this._triggerKeyHandler(n, r, t), t.defaultPrevented))
                        return
                }
        },
        _triggerKeyHandler: function(e, t, i) {
            var n = Object.create(e);
            n.keyboardEvent = i;
            var r = new CustomEvent(e.event, {
                detail: n,
                cancelable: !0
            });
            this[t].call(this, r), r.defaultPrevented && i.preventDefault()
        }
    }
}(), Polymer.IronControlState = {
    properties: {
        focused: {
            type: Boolean,
            value: !1,
            notify: !0,
            readOnly: !0,
            reflectToAttribute: !0
        },
        disabled: {
            type: Boolean,
            value: !1,
            notify: !0,
            observer: "_disabledChanged",
            reflectToAttribute: !0
        },
        _oldTabIndex: {
            type: Number
        },
        _boundFocusBlurHandler: {
            type: Function,
            value: function() {
                return this._focusBlurHandler.bind(this)
            }
        }
    },
    observers: ["_changedControlState(focused, disabled)"],
    ready: function() {
        this.addEventListener("focus", this._boundFocusBlurHandler, !0), this.addEventListener("blur", this._boundFocusBlurHandler, !0)
    },
    _focusBlurHandler: function(e) {
        if (e.target === this)
            this._setFocused("focus" === e.type);
        else if (!this.shadowRoot) {
            var t = Polymer.dom(e).localTarget;
            this.isLightDescendant(t) || this.fire(e.type, {
                sourceEvent: e
            }, {
                node: this,
                bubbles: e.bubbles,
                cancelable: e.cancelable
            })
        }
    },
    _disabledChanged: function(e, t) {
        this.setAttribute("aria-disabled", e ? "true" : "false"), this.style.pointerEvents = e ? "none" : "", e ? (this._oldTabIndex = this.tabIndex, this._setFocused(!1), this.tabIndex = -1, this.blur()) : void 0 !== this._oldTabIndex && (this.tabIndex = this._oldTabIndex)
    },
    _changedControlState: function() {
        this._controlStateChanged && this._controlStateChanged()
    }
}, Polymer.IronButtonStateImpl = {
    properties: {
        pressed: {
            type: Boolean,
            readOnly: !0,
            value: !1,
            reflectToAttribute: !0,
            observer: "_pressedChanged"
        },
        toggles: {
            type: Boolean,
            value: !1,
            reflectToAttribute: !0
        },
        active: {
            type: Boolean,
            value: !1,
            notify: !0,
            reflectToAttribute: !0
        },
        pointerDown: {
            type: Boolean,
            readOnly: !0,
            value: !1
        },
        receivedFocusFromKeyboard: {
            type: Boolean,
            readOnly: !0
        },
        ariaActiveAttribute: {
            type: String,
            value: "aria-pressed",
            observer: "_ariaActiveAttributeChanged"
        }
    },
    listeners: {
        down: "_downHandler",
        up: "_upHandler",
        tap: "_tapHandler"
    },
    observers: ["_detectKeyboardFocus(focused)", "_activeChanged(active, ariaActiveAttribute)"],
    keyBindings: {
        "enter:keydown": "_asyncClick",
        "space:keydown": "_spaceKeyDownHandler",
        "space:keyup": "_spaceKeyUpHandler"
    },
    _mouseEventRe: /^mouse/,
    _tapHandler: function() {
        this.toggles ? this._userActivate(!this.active) : this.active = !1
    },
    _detectKeyboardFocus: function(e) {
        this._setReceivedFocusFromKeyboard(!this.pointerDown && e)
    },
    _userActivate: function(e) {
        this.active !== e && (this.active = e, this.fire("change"))
    },
    _downHandler: function(e) {
        this._setPointerDown(!0), this._setPressed(!0), this._setReceivedFocusFromKeyboard(!1)
    },
    _upHandler: function() {
        this._setPointerDown(!1), this._setPressed(!1)
    },
    _spaceKeyDownHandler: function(e) {
        var t = e.detail.keyboardEvent,
            i = Polymer.dom(t).localTarget;
        this.isLightDescendant(i) || (t.preventDefault(), t.stopImmediatePropagation(), this._setPressed(!0))
    },
    _spaceKeyUpHandler: function(e) {
        var t = e.detail.keyboardEvent,
            i = Polymer.dom(t).localTarget;
        this.isLightDescendant(i) || (this.pressed && this._asyncClick(), this._setPressed(!1))
    },
    _asyncClick: function() {
        this.async(function() {
            this.click()
        }, 1)
    },
    _pressedChanged: function(e) {
        this._changedButtonState()
    },
    _ariaActiveAttributeChanged: function(e, t) {
        t && t != e && this.hasAttribute(t) && this.removeAttribute(t)
    },
    _activeChanged: function(e, t) {
        this.toggles ? this.setAttribute(this.ariaActiveAttribute, e ? "true" : "false") : this.removeAttribute(this.ariaActiveAttribute), this._changedButtonState()
    },
    _controlStateChanged: function() {
        this.disabled ? this._setPressed(!1) : this._changedButtonState()
    },
    _changedButtonState: function() {
        this._buttonStateChanged && this._buttonStateChanged()
    }
}, Polymer.IronButtonState = [Polymer.IronA11yKeysBehavior, Polymer.IronButtonStateImpl], function() {
    var e = {
        distance: function(e, t, i, n) {
            var r = e - i,
                o = t - n;
            return Math.sqrt(r * r + o * o)
        },
        now: window.performance && window.performance.now ? window.performance.now.bind(window.performance) : Date.now
    };
    function t(e) {
        this.element = e, this.width = this.boundingRect.width, this.height = this.boundingRect.height, this.size = Math.max(this.width, this.height)
    }
    function i(e) {
        this.element = e, this.color = window.getComputedStyle(e).color, this.wave = document.createElement("div"), this.waveContainer = document.createElement("div"), this.wave.style.backgroundColor = this.color, this.wave.classList.add("wave"), this.waveContainer.classList.add("wave-container"), Polymer.dom(this.waveContainer).appendChild(this.wave), this.resetInteractionState()
    }
    t.prototype = {
        get boundingRect() {
            return this.element.getBoundingClientRect()
        },
        furthestCornerDistanceFrom: function(t, i) {
            var n = e.distance(t, i, 0, 0),
                r = e.distance(t, i, this.width, 0),
                o = e.distance(t, i, 0, this.height),
                s = e.distance(t, i, this.width, this.height);
            return Math.max(n, r, o, s)
        }
    }, i.MAX_RADIUS = 300, i.prototype = {
        get recenters() {
            return this.element.recenters
        },
        get center() {
            return this.element.center
        },
        get mouseDownElapsed() {
            var t;
            return this.mouseDownStart ? (t = e.now() - this.mouseDownStart, this.mouseUpStart && (t -= this.mouseUpElapsed), t) : 0
        },
        get mouseUpElapsed() {
            return this.mouseUpStart ? e.now() - this.mouseUpStart : 0
        },
        get mouseDownElapsedSeconds() {
            return this.mouseDownElapsed / 1e3
        },
        get mouseUpElapsedSeconds() {
            return this.mouseUpElapsed / 1e3
        },
        get mouseInteractionSeconds() {
            return this.mouseDownElapsedSeconds + this.mouseUpElapsedSeconds
        },
        get initialOpacity() {
            return this.element.initialOpacity
        },
        get opacityDecayVelocity() {
            return this.element.opacityDecayVelocity
        },
        get radius() {
            var e = this.containerMetrics.width * this.containerMetrics.width,
                t = this.containerMetrics.height * this.containerMetrics.height,
                n = 1.1 * Math.min(Math.sqrt(e + t), i.MAX_RADIUS) + 5,
                r = 1.1 - n / i.MAX_RADIUS * .2,
                o = this.mouseInteractionSeconds / r,
                s = n * (1 - Math.pow(80, -o));
            return Math.abs(s)
        },
        get opacity() {
            return this.mouseUpStart ? Math.max(0, this.initialOpacity - this.mouseUpElapsedSeconds * this.opacityDecayVelocity) : this.initialOpacity
        },
        get outerOpacity() {
            var e = .3 * this.mouseUpElapsedSeconds,
                t = this.opacity;
            return Math.max(0, Math.min(e, t))
        },
        get isOpacityFullyDecayed() {
            return this.opacity < .01 && this.radius >= Math.min(this.maxRadius, i.MAX_RADIUS)
        },
        get isRestingAtMaxRadius() {
            return this.opacity >= this.initialOpacity && this.radius >= Math.min(this.maxRadius, i.MAX_RADIUS)
        },
        get isAnimationComplete() {
            return this.mouseUpStart ? this.isOpacityFullyDecayed : this.isRestingAtMaxRadius
        },
        get translationFraction() {
            return Math.min(1, this.radius / this.containerMetrics.size * 2 / Math.sqrt(2))
        },
        get xNow() {
            return this.xEnd ? this.xStart + this.translationFraction * (this.xEnd - this.xStart) : this.xStart
        },
        get yNow() {
            return this.yEnd ? this.yStart + this.translationFraction * (this.yEnd - this.yStart) : this.yStart
        },
        get isMouseDown() {
            return this.mouseDownStart && !this.mouseUpStart
        },
        resetInteractionState: function() {
            this.maxRadius = 0, this.mouseDownStart = 0, this.mouseUpStart = 0, this.xStart = 0, this.yStart = 0, this.xEnd = 0, this.yEnd = 0, this.slideDistance = 0, this.containerMetrics = new t(this.element)
        },
        draw: function() {
            var e,
                t,
                i;
            this.wave.style.opacity = this.opacity, e = this.radius / (this.containerMetrics.size / 2), t = this.xNow - this.containerMetrics.width / 2, i = this.yNow - this.containerMetrics.height / 2, this.waveContainer.style.webkitTransform = "translate(" + t + "px, " + i + "px)", this.waveContainer.style.transform = "translate3d(" + t + "px, " + i + "px, 0)", this.wave.style.webkitTransform = "scale(" + e + "," + e + ")", this.wave.style.transform = "scale3d(" + e + "," + e + ",1)"
        },
        downAction: function(t) {
            var i = this.containerMetrics.width / 2,
                n = this.containerMetrics.height / 2;
            this.resetInteractionState(), this.mouseDownStart = e.now(), this.center ? (this.xStart = i, this.yStart = n, this.slideDistance = e.distance(this.xStart, this.yStart, this.xEnd, this.yEnd)) : (this.xStart = t ? t.detail.x - this.containerMetrics.boundingRect.left : this.containerMetrics.width / 2, this.yStart = t ? t.detail.y - this.containerMetrics.boundingRect.top : this.containerMetrics.height / 2), this.recenters && (this.xEnd = i, this.yEnd = n, this.slideDistance = e.distance(this.xStart, this.yStart, this.xEnd, this.yEnd)), this.maxRadius = this.containerMetrics.furthestCornerDistanceFrom(this.xStart, this.yStart), this.waveContainer.style.top = (this.containerMetrics.height - this.containerMetrics.size) / 2 + "px", this.waveContainer.style.left = (this.containerMetrics.width - this.containerMetrics.size) / 2 + "px", this.waveContainer.style.width = this.containerMetrics.size + "px", this.waveContainer.style.height = this.containerMetrics.size + "px"
        },
        upAction: function(t) {
            this.isMouseDown && (this.mouseUpStart = e.now())
        },
        remove: function() {
            Polymer.dom(this.waveContainer.parentNode).removeChild(this.waveContainer)
        }
    }, Polymer({
        is: "paper-ripple",
        behaviors: [Polymer.IronA11yKeysBehavior],
        properties: {
            initialOpacity: {
                type: Number,
                value: .25
            },
            opacityDecayVelocity: {
                type: Number,
                value: .8
            },
            recenters: {
                type: Boolean,
                value: !1
            },
            center: {
                type: Boolean,
                value: !1
            },
            ripples: {
                type: Array,
                value: function() {
                    return []
                }
            },
            animating: {
                type: Boolean,
                readOnly: !0,
                reflectToAttribute: !0,
                value: !1
            },
            holdDown: {
                type: Boolean,
                value: !1,
                observer: "_holdDownChanged"
            },
            noink: {
                type: Boolean,
                value: !1
            },
            _animating: {
                type: Boolean
            },
            _boundAnimate: {
                type: Function,
                value: function() {
                    return this.animate.bind(this)
                }
            }
        },
        get target() {
            return this.keyEventTarget
        },
        keyBindings: {
            "enter:keydown": "_onEnterKeydown",
            "space:keydown": "_onSpaceKeydown",
            "space:keyup": "_onSpaceKeyup"
        },
        attached: function() {
            11 == this.parentNode.nodeType ? this.keyEventTarget = Polymer.dom(this).getOwnerRoot().host : this.keyEventTarget = this.parentNode;
            var e = this.keyEventTarget;
            this.listen(e, "up", "uiUpAction"), this.listen(e, "down", "uiDownAction")
        },
        detached: function() {
            this.unlisten(this.keyEventTarget, "up", "uiUpAction"), this.unlisten(this.keyEventTarget, "down", "uiDownAction"), this.keyEventTarget = null
        },
        get shouldKeepAnimating() {
            for (var e = 0; e < this.ripples.length; ++e)
                if (!this.ripples[e].isAnimationComplete)
                    return !0;
            return !1
        },
        simulatedRipple: function() {
            this.downAction(null), this.async(function() {
                this.upAction()
            }, 1)
        },
        uiDownAction: function(e) {
            this.noink || this.downAction(e)
        },
        downAction: function(e) {
            this.holdDown && this.ripples.length > 0 || (this.addRipple().downAction(e), this._animating || (this._animating = !0, this.animate()))
        },
        uiUpAction: function(e) {
            this.noink || this.upAction(e)
        },
        upAction: function(e) {
            this.holdDown || (this.ripples.forEach(function(t) {
                t.upAction(e)
            }), this._animating = !0, this.animate())
        },
        onAnimationComplete: function() {
            this._animating = !1, this.$.background.style.backgroundColor = null, this.fire("transitionend")
        },
        addRipple: function() {
            var e = new i(this);
            return Polymer.dom(this.$.waves).appendChild(e.waveContainer), this.$.background.style.backgroundColor = e.color, this.ripples.push(e), this._setAnimating(!0), e
        },
        removeRipple: function(e) {
            var t = this.ripples.indexOf(e);
            t < 0 || (this.ripples.splice(t, 1), e.remove(), this.ripples.length || this._setAnimating(!1))
        },
        animate: function() {
            if (this._animating) {
                var e,
                    t;
                for (e = 0; e < this.ripples.length; ++e)
                    (t = this.ripples[e]).draw(), this.$.background.style.opacity = t.outerOpacity, t.isOpacityFullyDecayed && !t.isRestingAtMaxRadius && this.removeRipple(t);
                this.shouldKeepAnimating || 0 !== this.ripples.length ? window.requestAnimationFrame(this._boundAnimate) : this.onAnimationComplete()
            }
        },
        _onEnterKeydown: function() {
            this.uiDownAction(), this.async(this.uiUpAction, 1)
        },
        _onSpaceKeydown: function() {
            this.uiDownAction()
        },
        _onSpaceKeyup: function() {
            this.uiUpAction()
        },
        _holdDownChanged: function(e, t) {
            void 0 !== t && (e ? this.downAction() : this.upAction())
        }
    })
}(), Polymer.PaperRippleBehavior = {
    properties: {
        noink: {
            type: Boolean,
            observer: "_noinkChanged"
        },
        _rippleContainer: {
            type: Object
        }
    },
    _buttonStateChanged: function() {
        this.focused && this.ensureRipple()
    },
    _downHandler: function(e) {
        Polymer.IronButtonStateImpl._downHandler.call(this, e), this.pressed && this.ensureRipple(e)
    },
    ensureRipple: function(e) {
        if (!this.hasRipple()) {
            this._ripple = this._createRipple(), this._ripple.noink = this.noink;
            var t = this._rippleContainer || this.root;
            if (t && Polymer.dom(t).appendChild(this._ripple), e) {
                var i = Polymer.dom(this._rippleContainer || this),
                    n = Polymer.dom(e).rootTarget;
                i.deepContains(n) && this._ripple.uiDownAction(e)
            }
        }
    },
    getRipple: function() {
        return this.ensureRipple(), this._ripple
    },
    hasRipple: function() {
        return Boolean(this._ripple)
    },
    _createRipple: function() {
        return document.createElement("paper-ripple")
    },
    _noinkChanged: function(e) {
        this.hasRipple() && (this._ripple.noink = e)
    }
}, Polymer.PaperButtonBehaviorImpl = {
    properties: {
        elevation: {
            type: Number,
            reflectToAttribute: !0,
            readOnly: !0
        }
    },
    observers: ["_calculateElevation(focused, disabled, active, pressed, receivedFocusFromKeyboard)", "_computeKeyboardClass(receivedFocusFromKeyboard)"],
    hostAttributes: {
        role: "button",
        tabindex: "0",
        animated: !0
    },
    _calculateElevation: function() {
        var e = 1;
        this.disabled ? e = 0 : this.active || this.pressed ? e = 4 : this.receivedFocusFromKeyboard && (e = 3), this._setElevation(e)
    },
    _computeKeyboardClass: function(e) {
        this.toggleClass("keyboard-focus", e)
    },
    _spaceKeyDownHandler: function(e) {
        Polymer.IronButtonStateImpl._spaceKeyDownHandler.call(this, e), this.hasRipple() && this.getRipple().ripples.length < 1 && this._ripple.uiDownAction()
    },
    _spaceKeyUpHandler: function(e) {
        Polymer.IronButtonStateImpl._spaceKeyUpHandler.call(this, e), this.hasRipple() && this._ripple.uiUpAction()
    }
}, Polymer.PaperButtonBehavior = [Polymer.IronButtonState, Polymer.IronControlState, Polymer.PaperRippleBehavior, Polymer.PaperButtonBehaviorImpl], Polymer({
    is: "paper-button",
    behaviors: [Polymer.PaperButtonBehavior],
    properties: {
        raised: {
            type: Boolean,
            reflectToAttribute: !0,
            value: !1,
            observer: "_calculateElevation"
        }
    },
    _calculateElevation: function() {
        this.raised ? Polymer.PaperButtonBehaviorImpl._calculateElevation.apply(this) : this._setElevation(0)
    }
}), Polymer({
    is: "iron-media-query",
    properties: {
        queryMatches: {
            type: Boolean,
            value: !1,
            readOnly: !0,
            notify: !0
        },
        query: {
            type: String,
            observer: "queryChanged"
        },
        full: {
            type: Boolean,
            value: !1
        },
        _boundMQHandler: {
            value: function() {
                return this.queryHandler.bind(this)
            }
        },
        _mq: {
            value: null
        }
    },
    attached: function() {
        this.style.display = "none", this.queryChanged()
    },
    detached: function() {
        this._remove()
    },
    _add: function() {
        this._mq && this._mq.addListener(this._boundMQHandler)
    },
    _remove: function() {
        this._mq && this._mq.removeListener(this._boundMQHandler), this._mq = null
    },
    queryChanged: function() {
        this._remove();
        var e = this.query;
        e && (this.full || "(" === e[0] || (e = "(" + e + ")"), this._mq = window.matchMedia(e), this._add(), this.queryHandler(this._mq))
    },
    queryHandler: function(e) {
        this._setQueryMatches(e.matches)
    }
}), Polymer.IronSelection = function(e) {
    this.selection = [], this.selectCallback = e
}, Polymer.IronSelection.prototype = {
    get: function() {
        return this.multi ? this.selection.slice() : this.selection[0]
    },
    clear: function(e) {
        this.selection.slice().forEach(function(t) {
            (!e || e.indexOf(t) < 0) && this.setItemSelected(t, !1)
        }, this)
    },
    isSelected: function(e) {
        return this.selection.indexOf(e) >= 0
    },
    setItemSelected: function(e, t) {
        if (null != e && t !== this.isSelected(e)) {
            if (t)
                this.selection.push(e);
            else {
                var i = this.selection.indexOf(e);
                i >= 0 && this.selection.splice(i, 1)
            }
            this.selectCallback && this.selectCallback(e, t)
        }
    },
    select: function(e) {
        this.multi ? this.toggle(e) : this.get() !== e && (this.setItemSelected(this.get(), !1), this.setItemSelected(e, !0))
    },
    toggle: function(e) {
        this.setItemSelected(e, !this.isSelected(e))
    }
}, Polymer.IronSelectableBehavior = {
    properties: {
        attrForSelected: {
            type: String,
            value: null
        },
        selected: {
            type: String,
            notify: !0
        },
        selectedItem: {
            type: Object,
            readOnly: !0,
            notify: !0
        },
        activateEvent: {
            type: String,
            value: "tap",
            observer: "_activateEventChanged"
        },
        selectable: String,
        selectedClass: {
            type: String,
            value: "iron-selected"
        },
        selectedAttribute: {
            type: String,
            value: null
        },
        fallbackSelection: {
            type: String,
            value: null
        },
        items: {
            type: Array,
            readOnly: !0,
            notify: !0,
            value: function() {
                return []
            }
        },
        _excludedLocalNames: {
            type: Object,
            value: function() {
                return {
                    template: 1
                }
            }
        }
    },
    observers: ["_updateAttrForSelected(attrForSelected)", "_updateSelected(selected)", "_checkFallback(fallbackSelection)"],
    created: function() {
        this._bindFilterItem = this._filterItem.bind(this), this._selection = new Polymer.IronSelection(this._applySelection.bind(this))
    },
    attached: function() {
        this._observer = this._observeItems(this), this._updateItems(), this._shouldUpdateSelection || this._updateSelected(), this._addListener(this.activateEvent)
    },
    detached: function() {
        this._observer && Polymer.dom(this).unobserveNodes(this._observer), this._removeListener(this.activateEvent)
    },
    indexOf: function(e) {
        return this.items.indexOf(e)
    },
    select: function(e) {
        this.selected = e
    },
    selectPrevious: function() {
        var e = this.items.length,
            t = (Number(this._valueToIndex(this.selected)) - 1 + e) % e;
        this.selected = this._indexToValue(t)
    },
    selectNext: function() {
        var e = (Number(this._valueToIndex(this.selected)) + 1) % this.items.length;
        this.selected = this._indexToValue(e)
    },
    selectIndex: function(e) {
        this.select(this._indexToValue(e))
    },
    forceSynchronousItemUpdate: function() {
        this._updateItems()
    },
    get _shouldUpdateSelection() {
        return null != this.selected
    },
    _checkFallback: function() {
        this._shouldUpdateSelection && this._updateSelected()
    },
    _addListener: function(e) {
        this.listen(this, e, "_activateHandler")
    },
    _removeListener: function(e) {
        this.unlisten(this, e, "_activateHandler")
    },
    _activateEventChanged: function(e, t) {
        this._removeListener(t), this._addListener(e)
    },
    _updateItems: function() {
        var e = Polymer.dom(this).queryDistributedElements(this.selectable || "*");
        e = Array.prototype.filter.call(e, this._bindFilterItem), this._setItems(e)
    },
    _updateAttrForSelected: function() {
        this._shouldUpdateSelection && (this.selected = this._indexToValue(this.indexOf(this.selectedItem)))
    },
    _updateSelected: function() {
        this._selectSelected(this.selected)
    },
    _selectSelected: function(e) {
        this._selection.select(this._valueToItem(this.selected)), this.fallbackSelection && this.items.length && void 0 === this._selection.get() && (this.selected = this.fallbackSelection)
    },
    _filterItem: function(e) {
        return !this._excludedLocalNames[e.localName]
    },
    _valueToItem: function(e) {
        return null == e ? null : this.items[this._valueToIndex(e)]
    },
    _valueToIndex: function(e) {
        if (!this.attrForSelected)
            return Number(e);
        for (var t, i = 0; t = this.items[i]; i++)
            if (this._valueForItem(t) == e)
                return i
    },
    _indexToValue: function(e) {
        if (!this.attrForSelected)
            return e;
        var t = this.items[e];
        return t ? this._valueForItem(t) : void 0
    },
    _valueForItem: function(e) {
        var t = e[Polymer.CaseMap.dashToCamelCase(this.attrForSelected)];
        return void 0 != t ? t : e.getAttribute(this.attrForSelected)
    },
    _applySelection: function(e, t) {
        this.selectedClass && this.toggleClass(this.selectedClass, t, e), this.selectedAttribute && this.toggleAttribute(this.selectedAttribute, t, e), this._selectionChange(), this.fire("iron-" + (t ? "select" : "deselect"), {
            item: e
        })
    },
    _selectionChange: function() {
        this._setSelectedItem(this._selection.get())
    },
    _observeItems: function(e) {
        return Polymer.dom(e).observeNodes(function(e) {
            this._updateItems(), this._shouldUpdateSelection && this._updateSelected(), this.fire("iron-items-changed", e, {
                bubbles: !1,
                cancelable: !1
            })
        })
    },
    _activateHandler: function(e) {
        for (var t = e.target, i = this.items; t && t != this;) {
            var n = i.indexOf(t);
            if (n >= 0) {
                var r = this._indexToValue(n);
                return void this._itemActivate(r, t)
            }
            t = t.parentNode
        }
    },
    _itemActivate: function(e, t) {
        this.fire("iron-activate", {
            selected: e,
            item: t
        }, {
            cancelable: !0
        }).defaultPrevented || this.select(e)
    }
}, Polymer.IronMultiSelectableBehaviorImpl = {
    properties: {
        multi: {
            type: Boolean,
            value: !1,
            observer: "multiChanged"
        },
        selectedValues: {
            type: Array,
            notify: !0
        },
        selectedItems: {
            type: Array,
            readOnly: !0,
            notify: !0
        }
    },
    observers: ["_updateSelected(selectedValues.splices)"],
    select: function(e) {
        this.multi ? this.selectedValues ? this._toggleSelected(e) : this.selectedValues = [e] : this.selected = e
    },
    multiChanged: function(e) {
        this._selection.multi = e
    },
    get _shouldUpdateSelection() {
        return null != this.selected || null != this.selectedValues && this.selectedValues.length
    },
    _updateAttrForSelected: function() {
        this.multi ? this._shouldUpdateSelection && (this.selectedValues = this.selectedItems.map(function(e) {
            return this._indexToValue(this.indexOf(e))
        }, this).filter(function(e) {
            return null != e
        }, this)) : Polymer.IronSelectableBehavior._updateAttrForSelected.apply(this)
    },
    _updateSelected: function() {
        this.multi ? this._selectMulti(this.selectedValues) : this._selectSelected(this.selected)
    },
    _selectMulti: function(e) {
        if (e) {
            var t = this._valuesToItems(e);
            this._selection.clear(t);
            for (var i = 0; i < t.length; i++)
                this._selection.setItemSelected(t[i], !0);
            this.fallbackSelection && this.items.length && !this._selection.get().length && this._valueToItem(this.fallbackSelection) && (this.selectedValues = [this.fallbackSelection])
        } else
            this._selection.clear()
    },
    _selectionChange: function() {
        var e = this._selection.get();
        this.multi ? this._setSelectedItems(e) : (this._setSelectedItems([e]), this._setSelectedItem(e))
    },
    _toggleSelected: function(e) {
        var t = this.selectedValues.indexOf(e);
        t < 0 ? this.push("selectedValues", e) : this.splice("selectedValues", t, 1)
    },
    _valuesToItems: function(e) {
        return null == e ? null : e.map(function(e) {
            return this._valueToItem(e)
        }, this)
    }
}, Polymer.IronMultiSelectableBehavior = [Polymer.IronSelectableBehavior, Polymer.IronMultiSelectableBehaviorImpl], Polymer({
    is: "iron-selector",
    behaviors: [Polymer.IronMultiSelectableBehavior]
}), Polymer.IronResizableBehavior = {
    properties: {
        _parentResizable: {
            type: Object,
            observer: "_parentResizableChanged"
        },
        _notifyingDescendant: {
            type: Boolean,
            value: !1
        }
    },
    listeners: {
        "iron-request-resize-notifications": "_onIronRequestResizeNotifications"
    },
    created: function() {
        this._interestedResizables = [], this._boundNotifyResize = this.notifyResize.bind(this)
    },
    attached: function() {
        this.fire("iron-request-resize-notifications", null, {
            node: this,
            bubbles: !0,
            cancelable: !0
        }), this._parentResizable || (window.addEventListener("resize", this._boundNotifyResize), this.notifyResize())
    },
    detached: function() {
        this._parentResizable ? this._parentResizable.stopResizeNotificationsFor(this) : window.removeEventListener("resize", this._boundNotifyResize), this._parentResizable = null
    },
    notifyResize: function() {
        this.isAttached && (this._interestedResizables.forEach(function(e) {
            this.resizerShouldNotify(e) && this._notifyDescendant(e)
        }, this), this._fireResize())
    },
    assignParentResizable: function(e) {
        this._parentResizable = e
    },
    stopResizeNotificationsFor: function(e) {
        var t = this._interestedResizables.indexOf(e);
        t > -1 && (this._interestedResizables.splice(t, 1), this.unlisten(e, "iron-resize", "_onDescendantIronResize"))
    },
    resizerShouldNotify: function(e) {
        return !0
    },
    _onDescendantIronResize: function(e) {
        this._notifyingDescendant ? e.stopPropagation() : Polymer.Settings.useShadow || this._fireResize()
    },
    _fireResize: function() {
        this.fire("iron-resize", null, {
            node: this,
            bubbles: !1
        })
    },
    _onIronRequestResizeNotifications: function(e) {
        var t = e.path ? e.path[0] : e.target;
        t !== this && (-1 === this._interestedResizables.indexOf(t) && (this._interestedResizables.push(t), this.listen(t, "iron-resize", "_onDescendantIronResize")), t.assignParentResizable(this), this._notifyDescendant(t), e.stopPropagation())
    },
    _parentResizableChanged: function(e) {
        e && window.removeEventListener("resize", this._boundNotifyResize)
    },
    _notifyDescendant: function(e) {
        this.isAttached && (this._notifyingDescendant = !0, e.notifyResize(), this._notifyingDescendant = !1)
    }
}, function() {
    "use strict";
    var e = null;
    Polymer({
        is: "paper-drawer-panel",
        behaviors: [Polymer.IronResizableBehavior],
        properties: {
            defaultSelected: {
                type: String,
                value: "main"
            },
            disableEdgeSwipe: {
                type: Boolean,
                value: !1
            },
            disableSwipe: {
                type: Boolean,
                value: !1
            },
            dragging: {
                type: Boolean,
                value: !1,
                readOnly: !0,
                notify: !0
            },
            drawerWidth: {
                type: String,
                value: "256px"
            },
            edgeSwipeSensitivity: {
                type: Number,
                value: 30
            },
            forceNarrow: {
                type: Boolean,
                value: !1
            },
            hasTransform: {
                type: Boolean,
                value: function() {
                    return "transform" in this.style
                }
            },
            hasWillChange: {
                type: Boolean,
                value: function() {
                    return "willChange" in this.style
                }
            },
            narrow: {
                reflectToAttribute: !0,
                type: Boolean,
                value: !1,
                readOnly: !0,
                notify: !0
            },
            peeking: {
                type: Boolean,
                value: !1,
                readOnly: !0,
                notify: !0
            },
            responsiveWidth: {
                type: String,
                value: "768px"
            },
            rightDrawer: {
                type: Boolean,
                value: !1
            },
            selected: {
                reflectToAttribute: !0,
                notify: !0,
                type: String,
                value: null
            },
            drawerToggleAttribute: {
                type: String,
                value: "paper-drawer-toggle"
            },
            drawerFocusSelector: {
                type: String,
                value: 'a[href]:not([tabindex="-1"]),area[href]:not([tabindex="-1"]),input:not([disabled]):not([tabindex="-1"]),select:not([disabled]):not([tabindex="-1"]),textarea:not([disabled]):not([tabindex="-1"]),button:not([disabled]):not([tabindex="-1"]),iframe:not([tabindex="-1"]),[tabindex]:not([tabindex="-1"]),[contentEditable=true]:not([tabindex="-1"])'
            },
            _transition: {
                type: Boolean,
                value: !1
            }
        },
        listeners: {
            tap: "_onTap",
            track: "_onTrack",
            down: "_downHandler",
            up: "_upHandler",
            transitionend: "_onTransitionEnd"
        },
        observers: ["_forceNarrowChanged(forceNarrow, defaultSelected)", "_toggleFocusListener(selected)"],
        ready: function() {
            this._transition = !0, this._boundFocusListener = this._didFocus.bind(this)
        },
        togglePanel: function() {
            this._isMainSelected() ? this.openDrawer() : this.closeDrawer()
        },
        openDrawer: function() {
            requestAnimationFrame(function() {
                this.toggleClass("transition-drawer", !0, this.$.drawer), this.selected = "drawer"
            }.bind(this))
        },
        closeDrawer: function() {
            requestAnimationFrame(function() {
                this.toggleClass("transition-drawer", !0, this.$.drawer), this.selected = "main"
            }.bind(this))
        },
        _onTransitionEnd: function(e) {
            if (Polymer.dom(e).localTarget === this && ("left" !== e.propertyName && "right" !== e.propertyName || this.notifyResize(), "transform" === e.propertyName && (requestAnimationFrame(function() {
                this.toggleClass("transition-drawer", !1, this.$.drawer)
            }.bind(this)), "drawer" === this.selected))) {
                var t = this._getAutoFocusedNode();
                t && t.focus()
            }
        },
        _computeIronSelectorClass: function(e, t, i, n, r) {
            return function(e) {
                var t = [];
                for (var i in e)
                    e.hasOwnProperty(i) && e[i] && t.push(i);
                return t.join(" ")
            }({
                dragging: i,
                "narrow-layout": e,
                "right-drawer": n,
                "left-drawer": !n,
                transition: t,
                peeking: r
            })
        },
        _computeDrawerStyle: function(e) {
            return "width:" + e + ";"
        },
        _computeMainStyle: function(e, t, i) {
            var n = "";
            return n += "left:" + (e || t ? "0" : i) + ";", t && (n += "right:" + (e ? "" : i) + ";"), n
        },
        _computeMediaQuery: function(e, t) {
            return e ? "" : "(max-width: " + t + ")"
        },
        _computeSwipeOverlayHidden: function(e, t) {
            return !e || t
        },
        _onTrack: function(t) {
            if (!e || this === e)
                switch (t.detail.state) {
                case "start":
                    this._trackStart(t);
                    break;
                case "track":
                    this._trackX(t);
                    break;
                case "end":
                    this._trackEnd(t)
                }
        },
        _responsiveChange: function(e) {
            this._setNarrow(e), this.selected = this.narrow ? this.defaultSelected : null, this.setScrollDirection(this._swipeAllowed() ? "y" : "all"), this.fire("paper-responsive-change", {
                narrow: this.narrow
            })
        },
        _onQueryMatchesChanged: function(e) {
            this._responsiveChange(e.detail.value)
        },
        _forceNarrowChanged: function() {
            this._responsiveChange(this.forceNarrow || this.$.mq.queryMatches)
        },
        _swipeAllowed: function() {
            return this.narrow && !this.disableSwipe
        },
        _isMainSelected: function() {
            return "main" === this.selected
        },
        _startEdgePeek: function() {
            this.width = this.$.drawer.offsetWidth, this._moveDrawer(this._translateXForDeltaX(this.rightDrawer ? -this.edgeSwipeSensitivity : this.edgeSwipeSensitivity)), this._setPeeking(!0)
        },
        _stopEdgePeek: function() {
            this.peeking && (this._setPeeking(!1), this._moveDrawer(null))
        },
        _downHandler: function(t) {
            !this.dragging && this._isMainSelected() && this._isEdgeTouch(t) && !e && (this._startEdgePeek(), t.preventDefault(), e = this)
        },
        _upHandler: function() {
            this._stopEdgePeek(), e = null
        },
        _onTap: function(e) {
            var t = Polymer.dom(e).localTarget;
            t && this.drawerToggleAttribute && t.hasAttribute(this.drawerToggleAttribute) && this.togglePanel()
        },
        _isEdgeTouch: function(e) {
            var t = e.detail.x;
            return !this.disableEdgeSwipe && this._swipeAllowed() && (this.rightDrawer ? t >= this.offsetWidth - this.edgeSwipeSensitivity : t <= this.edgeSwipeSensitivity)
        },
        _trackStart: function(t) {
            this._swipeAllowed() && (e = this, this._setDragging(!0), this._isMainSelected() && this._setDragging(this.peeking || this._isEdgeTouch(t)), this.dragging && (this.width = this.$.drawer.offsetWidth, this._transition = !1))
        },
        _translateXForDeltaX: function(e) {
            var t = this._isMainSelected();
            return this.rightDrawer ? Math.max(0, t ? this.width + e : e) : Math.min(0, t ? e - this.width : e)
        },
        _trackX: function(e) {
            if (this.dragging) {
                var t = e.detail.dx;
                if (this.peeking) {
                    if (Math.abs(t) <= this.edgeSwipeSensitivity)
                        return;
                    this._setPeeking(!1)
                }
                this._moveDrawer(this._translateXForDeltaX(t))
            }
        },
        _trackEnd: function(t) {
            if (this.dragging) {
                var i = t.detail.dx > 0;
                this._setDragging(!1), this._transition = !0, e = null, this._moveDrawer(null), this.rightDrawer ? this[i ? "closeDrawer" : "openDrawer"]() : this[i ? "openDrawer" : "closeDrawer"]()
            }
        },
        _transformForTranslateX: function(e) {
            return null === e ? "" : this.hasWillChange ? "translateX(" + e + "px)" : "translate3d(" + e + "px, 0, 0)"
        },
        _moveDrawer: function(e) {
            this.transform(this._transformForTranslateX(e), this.$.drawer)
        },
        _getDrawerContent: function() {
            return Polymer.dom(this.$.drawerContent).getDistributedNodes()[0]
        },
        _getAutoFocusedNode: function() {
            var e = this._getDrawerContent();
            return this.drawerFocusSelector ? Polymer.dom(e).querySelector(this.drawerFocusSelector) || e : null
        },
        _toggleFocusListener: function(e) {
            "drawer" === e ? this.addEventListener("focus", this._boundFocusListener, !0) : this.removeEventListener("focus", this._boundFocusListener, !0)
        },
        _didFocus: function(e) {
            var t = this._getAutoFocusedNode();
            if (t) {
                var i = Polymer.dom(e).path,
                    n = (i[0], this._getDrawerContent());
                -1 !== i.indexOf(n) || (e.stopPropagation(), t.focus())
            }
        },
        _isDrawerClosed: function(e, t) {
            return !e || "drawer" !== t
        }
    })
}(), function() {
    "use strict";
    var e = {
        outerScroll: {
            scroll: !0
        },
        shadowMode: {
            standard: 2,
            waterfall: 1,
            "waterfall-tall": 1
        },
        tallMode: {
            "waterfall-tall": !0
        }
    };
    Polymer({
        is: "paper-header-panel",
        properties: {
            mode: {
                type: String,
                value: "standard",
                observer: "_modeChanged",
                reflectToAttribute: !0
            },
            shadow: {
                type: Boolean,
                value: !1
            },
            tallClass: {
                type: String,
                value: "tall"
            },
            atTop: {
                type: Boolean,
                value: !0,
                notify: !0,
                readOnly: !0,
                reflectToAttribute: !0
            }
        },
        observers: ["_computeDropShadowHidden(atTop, mode, shadow)"],
        ready: function() {
            this.scrollHandler = this._scroll.bind(this)
        },
        attached: function() {
            this._addListener(), this._keepScrollingState()
        },
        detached: function() {
            this._removeListener()
        },
        get header() {
            return Polymer.dom(this.$.headerContent).getDistributedNodes()[0]
        },
        get scroller() {
            return this._getScrollerForMode(this.mode)
        },
        get visibleShadow() {
            return this.$.dropShadow.classList.contains("has-shadow")
        },
        _computeDropShadowHidden: function(t, i, n) {
            var r = e.shadowMode[i];
            this.shadow ? this.toggleClass("has-shadow", !0, this.$.dropShadow) : 2 === r ? this.toggleClass("has-shadow", !0, this.$.dropShadow) : 1 !== r || t ? this.toggleClass("has-shadow", !1, this.$.dropShadow) : this.toggleClass("has-shadow", !0, this.$.dropShadow)
        },
        _computeMainContainerClass: function(e) {
            var t = {};
            return t.flex = "cover" !== e, Object.keys(t).filter(function(e) {
                return t[e]
            }).join(" ")
        },
        _addListener: function() {
            this.scroller.addEventListener("scroll", this.scrollHandler, !1)
        },
        _removeListener: function() {
            this.scroller.removeEventListener("scroll", this.scrollHandler)
        },
        _modeChanged: function(t, i) {
            var n = e,
                r = this.header;
            r && (n.tallMode[i] && !n.tallMode[t] ? (r.classList.remove(this.tallClass), this.async(function() {
                r.classList.remove("animate")
            }, 200)) : this.toggleClass("animate", n.tallMode[t], r)), this._keepScrollingState()
        },
        _keepScrollingState: function() {
            var t = this.scroller,
                i = this.header;
            this._setAtTop(0 === t.scrollTop), i && this.tallClass && e.tallMode[this.mode] && this.toggleClass(this.tallClass, this.atTop || i.classList.contains(this.tallClass) && t.scrollHeight < this.offsetHeight, i)
        },
        _scroll: function() {
            this._keepScrollingState(), this.fire("content-scroll", {
                target: this.scroller
            }, {
                bubbles: !1
            })
        },
        _getScrollerForMode: function(t) {
            return e.outerScroll[t] ? this : this.$.mainContainer
        }
    })
}(), Polymer.PaperInkyFocusBehaviorImpl = {
    observers: ["_focusedChanged(receivedFocusFromKeyboard)"],
    _focusedChanged: function(e) {
        e && this.ensureRipple(), this.hasRipple() && (this._ripple.holdDown = e)
    },
    _createRipple: function() {
        var e = Polymer.PaperRippleBehavior._createRipple();
        return e.id = "ink", e.setAttribute("center", ""), e.classList.add("circle"), e
    }
}, Polymer.PaperInkyFocusBehavior = [Polymer.IronButtonState, Polymer.IronControlState, Polymer.PaperRippleBehavior, Polymer.PaperInkyFocusBehaviorImpl], Polymer({
    is: "paper-icon-button",
    hostAttributes: {
        role: "button",
        tabindex: "0"
    },
    behaviors: [Polymer.PaperInkyFocusBehavior],
    properties: {
        src: {
            type: String
        },
        icon: {
            type: String
        },
        alt: {
            type: String,
            observer: "_altChanged"
        }
    },
    _altChanged: function(e, t) {
        var i = this.getAttribute("aria-label");
        i && t != i || this.setAttribute("aria-label", e)
    }
}), Polymer.IronFormElementBehavior = {
    properties: {
        name: {
            type: String
        },
        value: {
            notify: !0,
            type: String
        },
        required: {
            type: Boolean,
            value: !1
        },
        _parentForm: {
            type: Object
        }
    },
    attached: function() {
        this.fire("iron-form-element-register")
    },
    detached: function() {
        this._parentForm && this._parentForm.fire("iron-form-element-unregister", {
            target: this
        })
    }
}, function() {
    "use strict";
    Polymer.IronA11yAnnouncer = Polymer({
        is: "iron-a11y-announcer",
        properties: {
            mode: {
                type: String,
                value: "polite"
            },
            _text: {
                type: String,
                value: ""
            }
        },
        created: function() {
            Polymer.IronA11yAnnouncer.instance || (Polymer.IronA11yAnnouncer.instance = this), document.body.addEventListener("iron-announce", this._onIronAnnounce.bind(this))
        },
        announce: function(e) {
            this._text = "", this.async(function() {
                this._text = e
            }, 100)
        },
        _onIronAnnounce: function(e) {
            e.detail && e.detail.text && this.announce(e.detail.text)
        }
    }), Polymer.IronA11yAnnouncer.instance = null, Polymer.IronA11yAnnouncer.requestAvailability = function() {
        Polymer.IronA11yAnnouncer.instance || (Polymer.IronA11yAnnouncer.instance = document.createElement("iron-a11y-announcer")), document.body.appendChild(Polymer.IronA11yAnnouncer.instance)
    }
}(), Polymer.IronValidatableBehaviorMeta = null, Polymer.IronValidatableBehavior = {
    properties: {
        validator: {
            type: String
        },
        invalid: {
            notify: !0,
            reflectToAttribute: !0,
            type: Boolean,
            value: !1
        },
        _validatorMeta: {
            type: Object
        },
        validatorType: {
            type: String,
            value: "validator"
        },
        _validator: {
            type: Object,
            computed: "__computeValidator(validator)"
        }
    },
    observers: ["_invalidChanged(invalid)"],
    registered: function() {
        Polymer.IronValidatableBehaviorMeta = new Polymer.IronMeta({
            type: "validator"
        })
    },
    _invalidChanged: function() {
        this.invalid ? this.setAttribute("aria-invalid", "true") : this.removeAttribute("aria-invalid")
    },
    hasValidator: function() {
        return null != this._validator
    },
    validate: function(e) {
        return this.invalid = !this._getValidity(e), !this.invalid
    },
    _getValidity: function(e) {
        return !this.hasValidator() || this._validator.validate(e)
    },
    __computeValidator: function() {
        return Polymer.IronValidatableBehaviorMeta && Polymer.IronValidatableBehaviorMeta.byKey(this.validator)
    }
}, Polymer({
    is: "iron-input",
    extends: "input",
    behaviors: [Polymer.IronValidatableBehavior],
    properties: {
        bindValue: {
            observer: "_bindValueChanged",
            type: String
        },
        preventInvalidInput: {
            type: Boolean
        },
        allowedPattern: {
            type: String,
            observer: "_allowedPatternChanged"
        },
        _previousValidInput: {
            type: String,
            value: ""
        },
        _patternAlreadyChecked: {
            type: Boolean,
            value: !1
        }
    },
    listeners: {
        input: "_onInput",
        keypress: "_onKeypress"
    },
    registered: function() {
        this._canDispatchEventOnDisabled() || (this._origDispatchEvent = this.dispatchEvent, this.dispatchEvent = this._dispatchEventFirefoxIE)
    },
    created: function() {
        Polymer.IronA11yAnnouncer.requestAvailability()
    },
    _canDispatchEventOnDisabled: function() {
        var e = document.createElement("input"),
            t = !1;
        e.disabled = !0, e.addEventListener("feature-check-dispatch-event", function() {
            t = !0
        });
        try {
            e.dispatchEvent(new Event("feature-check-dispatch-event"))
        } catch (e) {}
        return t
    },
    _dispatchEventFirefoxIE: function() {
        var e = this.disabled;
        this.disabled = !1, this._origDispatchEvent.apply(this, arguments), this.disabled = e
    },
    get _patternRegExp() {
        var e;
        if (this.allowedPattern)
            e = new RegExp(this.allowedPattern);
        else
            switch (this.type) {
            case "number":
                e = /[0-9.,e-]/
            }
        return e
    },
    ready: function() {
        this.bindValue = this.value
    },
    _bindValueChanged: function() {
        this.value !== this.bindValue && (this.value = this.bindValue || 0 === this.bindValue || !1 === this.bindValue ? this.bindValue : ""), this.fire("bind-value-changed", {
            value: this.bindValue
        })
    },
    _allowedPatternChanged: function() {
        this.preventInvalidInput = !!this.allowedPattern
    },
    _onInput: function() {
        this.preventInvalidInput && !this._patternAlreadyChecked && (this._checkPatternValidity() || (this._announceInvalidCharacter("Invalid string of characters not entered."), this.value = this._previousValidInput)), this.bindValue = this.value, this._previousValidInput = this.value, this._patternAlreadyChecked = !1
    },
    _isPrintable: function(e) {
        var t = 8 == e.keyCode || 9 == e.keyCode || 13 == e.keyCode || 27 == e.keyCode,
            i = 19 == e.keyCode || 20 == e.keyCode || 45 == e.keyCode || 46 == e.keyCode || 144 == e.keyCode || 145 == e.keyCode || e.keyCode > 32 && e.keyCode < 41 || e.keyCode > 111 && e.keyCode < 124;
        return !(t || 0 == e.charCode && i)
    },
    _onKeypress: function(e) {
        if (this.preventInvalidInput || "number" === this.type) {
            var t = this._patternRegExp;
            if (t && !(e.metaKey || e.ctrlKey || e.altKey)) {
                this._patternAlreadyChecked = !0;
                var i = String.fromCharCode(e.charCode);
                this._isPrintable(e) && !t.test(i) && (e.preventDefault(), this._announceInvalidCharacter("Invalid character " + i + " not entered."))
            }
        }
    },
    _checkPatternValidity: function() {
        var e = this._patternRegExp;
        if (!e)
            return !0;
        for (var t = 0; t < this.value.length; t++)
            if (!e.test(this.value[t]))
                return !1;
        return !0
    },
    validate: function() {
        var e = this.checkValidity();
        return e && (this.required && "" === this.value ? e = !1 : this.hasValidator() && (e = Polymer.IronValidatableBehavior.validate.call(this, this.value))), this.invalid = !e, this.fire("iron-input-validate"), e
    },
    _announceInvalidCharacter: function(e) {
        this.fire("iron-announce", {
            text: e
        })
    }
}), Polymer.PaperInputHelper = {}, Polymer.PaperInputHelper.NextLabelID = 1, Polymer.PaperInputHelper.NextAddonID = 1, Polymer.PaperInputBehaviorImpl = {
    properties: {
        label: {
            type: String
        },
        value: {
            notify: !0,
            type: String
        },
        disabled: {
            type: Boolean,
            value: !1
        },
        invalid: {
            type: Boolean,
            value: !1,
            notify: !0
        },
        preventInvalidInput: {
            type: Boolean
        },
        allowedPattern: {
            type: String
        },
        type: {
            type: String
        },
        list: {
            type: String
        },
        pattern: {
            type: String
        },
        required: {
            type: Boolean,
            value: !1
        },
        errorMessage: {
            type: String
        },
        charCounter: {
            type: Boolean,
            value: !1
        },
        noLabelFloat: {
            type: Boolean,
            value: !1
        },
        alwaysFloatLabel: {
            type: Boolean,
            value: !1
        },
        autoValidate: {
            type: Boolean,
            value: !1
        },
        validator: {
            type: String
        },
        autocomplete: {
            type: String,
            value: "off"
        },
        autofocus: {
            type: Boolean,
            observer: "_autofocusChanged"
        },
        inputmode: {
            type: String
        },
        minlength: {
            type: Number
        },
        maxlength: {
            type: Number
        },
        min: {
            type: String
        },
        max: {
            type: String
        },
        step: {
            type: String
        },
        name: {
            type: String
        },
        placeholder: {
            type: String,
            value: ""
        },
        readonly: {
            type: Boolean,
            value: !1
        },
        size: {
            type: Number
        },
        autocapitalize: {
            type: String,
            value: "none"
        },
        autocorrect: {
            type: String,
            value: "off"
        },
        autosave: {
            type: String
        },
        results: {
            type: Number
        },
        accept: {
            type: String
        },
        multiple: {
            type: Boolean
        },
        _ariaDescribedBy: {
            type: String,
            value: ""
        },
        _ariaLabelledBy: {
            type: String,
            value: ""
        }
    },
    listeners: {
        "addon-attached": "_onAddonAttached"
    },
    keyBindings: {
        "shift+tab:keydown": "_onShiftTabDown"
    },
    hostAttributes: {
        tabindex: 0
    },
    get inputElement() {
        return this.$.input
    },
    get _focusableElement() {
        return this.inputElement
    },
    registered: function() {
        this._typesThatHaveText = ["date", "datetime", "datetime-local", "month", "time", "week", "file"]
    },
    attached: function() {
        this._updateAriaLabelledBy(), this.inputElement && -1 !== this._typesThatHaveText.indexOf(this.inputElement.type) && (this.alwaysFloatLabel = !0)
    },
    _appendStringWithSpace: function(e, t) {
        return e ? e + " " + t : t
    },
    _onAddonAttached: function(e) {
        var t = e.path ? e.path[0] : e.target;
        if (t.id)
            this._ariaDescribedBy = this._appendStringWithSpace(this._ariaDescribedBy, t.id);
        else {
            var i = "paper-input-add-on-" + Polymer.PaperInputHelper.NextAddonID++;
            t.id = i, this._ariaDescribedBy = this._appendStringWithSpace(this._ariaDescribedBy, i)
        }
    },
    validate: function() {
        return this.inputElement.validate()
    },
    _focusBlurHandler: function(e) {
        Polymer.IronControlState._focusBlurHandler.call(this, e), this.focused && !this._shiftTabPressed && this._focusableElement.focus()
    },
    _onShiftTabDown: function(e) {
        var t = this.getAttribute("tabindex");
        this._shiftTabPressed = !0, this.setAttribute("tabindex", "-1"), this.async(function() {
            this.setAttribute("tabindex", t), this._shiftTabPressed = !1
        }, 1)
    },
    _handleAutoValidate: function() {
        this.autoValidate && this.validate()
    },
    updateValueAndPreserveCaret: function(e) {
        try {
            var t = this.inputElement.selectionStart;
            this.value = e, this.inputElement.selectionStart = t, this.inputElement.selectionEnd = t
        } catch (t) {
            this.value = e
        }
    },
    _computeAlwaysFloatLabel: function(e, t) {
        return t || e
    },
    _updateAriaLabelledBy: function() {
        var e,
            t = Polymer.dom(this.root).querySelector("label");
        t ? (t.id ? e = t.id : (e = "paper-input-label-" + Polymer.PaperInputHelper.NextLabelID++, t.id = e), this._ariaLabelledBy = e) : this._ariaLabelledBy = ""
    },
    _onChange: function(e) {
        this.shadowRoot && this.fire(e.type, {
            sourceEvent: e
        }, {
            node: this,
            bubbles: e.bubbles,
            cancelable: e.cancelable
        })
    },
    _autofocusChanged: function() {
        if (this.autofocus && this._focusableElement) {
            var e = document.activeElement;
            e instanceof HTMLElement && e !== document.body && e !== document.documentElement || this._focusableElement.focus()
        }
    }
}, Polymer.PaperInputBehavior = [Polymer.IronControlState, Polymer.IronA11yKeysBehavior, Polymer.PaperInputBehaviorImpl], Polymer.PaperInputAddonBehavior = {
    hostAttributes: {
        "add-on": ""
    },
    attached: function() {
        this.fire("addon-attached")
    },
    update: function(e) {}
}, Polymer({
    is: "paper-input-char-counter",
    behaviors: [Polymer.PaperInputAddonBehavior],
    properties: {
        _charCounterStr: {
            type: String,
            value: "0"
        }
    },
    update: function(e) {
        if (e.inputElement) {
            e.value = e.value || "";
            var t = e.value.toString().length.toString();
            e.inputElement.hasAttribute("maxlength") && (t += "/" + e.inputElement.getAttribute("maxlength")), this._charCounterStr = t
        }
    }
}), Polymer({
    is: "paper-input-container",
    properties: {
        noLabelFloat: {
            type: Boolean,
            value: !1
        },
        alwaysFloatLabel: {
            type: Boolean,
            value: !1
        },
        attrForValue: {
            type: String,
            value: "bind-value"
        },
        autoValidate: {
            type: Boolean,
            value: !1
        },
        invalid: {
            observer: "_invalidChanged",
            type: Boolean,
            value: !1
        },
        focused: {
            readOnly: !0,
            type: Boolean,
            value: !1,
            notify: !0
        },
        _addons: {
            type: Array
        },
        _inputHasContent: {
            type: Boolean,
            value: !1
        },
        _inputSelector: {
            type: String,
            value: "input,textarea,.paper-input-input"
        },
        _boundOnFocus: {
            type: Function,
            value: function() {
                return this._onFocus.bind(this)
            }
        },
        _boundOnBlur: {
            type: Function,
            value: function() {
                return this._onBlur.bind(this)
            }
        },
        _boundOnInput: {
            type: Function,
            value: function() {
                return this._onInput.bind(this)
            }
        },
        _boundValueChanged: {
            type: Function,
            value: function() {
                return this._onValueChanged.bind(this)
            }
        }
    },
    listeners: {
        "addon-attached": "_onAddonAttached",
        "iron-input-validate": "_onIronInputValidate"
    },
    get _valueChangedEvent() {
        return this.attrForValue + "-changed"
    },
    get _propertyForValue() {
        return Polymer.CaseMap.dashToCamelCase(this.attrForValue)
    },
    get _inputElement() {
        return Polymer.dom(this).querySelector(this._inputSelector)
    },
    get _inputElementValue() {
        return this._inputElement[this._propertyForValue] || this._inputElement.value
    },
    ready: function() {
        this._addons || (this._addons = []), this.addEventListener("focus", this._boundOnFocus, !0), this.addEventListener("blur", this._boundOnBlur, !0)
    },
    attached: function() {
        this.attrForValue ? this._inputElement.addEventListener(this._valueChangedEvent, this._boundValueChanged) : this.addEventListener("input", this._onInput), "" != this._inputElementValue ? this._handleValueAndAutoValidate(this._inputElement) : this._handleValue(this._inputElement)
    },
    _onAddonAttached: function(e) {
        this._addons || (this._addons = []);
        var t = e.target;
        -1 === this._addons.indexOf(t) && (this._addons.push(t), this.isAttached && this._handleValue(this._inputElement))
    },
    _onFocus: function() {
        this._setFocused(!0)
    },
    _onBlur: function() {
        this._setFocused(!1), this._handleValueAndAutoValidate(this._inputElement)
    },
    _onInput: function(e) {
        this._handleValueAndAutoValidate(e.target)
    },
    _onValueChanged: function(e) {
        this._handleValueAndAutoValidate(e.target)
    },
    _handleValue: function(e) {
        var t = this._inputElementValue;
        t || 0 === t || "number" === e.type && !e.checkValidity() ? this._inputHasContent = !0 : this._inputHasContent = !1, this.updateAddons({
            inputElement: e,
            value: t,
            invalid: this.invalid
        })
    },
    _handleValueAndAutoValidate: function(e) {
        var t;
        this.autoValidate && (t = e.validate ? e.validate(this._inputElementValue) : e.checkValidity(), this.invalid = !t), this._handleValue(e)
    },
    _onIronInputValidate: function(e) {
        this.invalid = this._inputElement.invalid
    },
    _invalidChanged: function() {
        this._addons && this.updateAddons({
            invalid: this.invalid
        })
    },
    updateAddons: function(e) {
        for (var t, i = 0; t = this._addons[i]; i++)
            t.update(e)
    },
    _computeInputContentClass: function(e, t, i, n, r) {
        var o = "input-content";
        if (e)
            r && (o += " label-is-hidden");
        else {
            var s = this.querySelector("label");
            t || r ? (o += " label-is-floating", this.$.labelAndInputContainer.style.position = "static", n ? o += " is-invalid" : i && (o += " label-is-highlighted")) : s && (this.$.labelAndInputContainer.style.position = "relative")
        }
        return o
    },
    _computeUnderlineClass: function(e, t) {
        var i = "underline";
        return t ? i += " is-invalid" : e && (i += " is-highlighted"), i
    },
    _computeAddOnContentClass: function(e, t) {
        var i = "add-on-content";
        return t ? i += " is-invalid" : e && (i += " is-highlighted"), i
    }
}), Polymer({
    is: "paper-input-error",
    behaviors: [Polymer.PaperInputAddonBehavior],
    properties: {
        invalid: {
            readOnly: !0,
            reflectToAttribute: !0,
            type: Boolean
        }
    },
    update: function(e) {
        this._setInvalid(e.invalid)
    }
}), Polymer({
    is: "paper-input",
    behaviors: [Polymer.IronFormElementBehavior, Polymer.PaperInputBehavior]
}), Polymer.PaperItemBehaviorImpl = {
    hostAttributes: {
        role: "option",
        tabindex: "0"
    }
}, Polymer.PaperItemBehavior = [Polymer.IronButtonState, Polymer.IronControlState, Polymer.PaperItemBehaviorImpl], Polymer({
    is: "paper-item",
    behaviors: [Polymer.PaperItemBehavior]
}), Polymer.IronFitBehavior = {
    properties: {
        sizingTarget: {
            type: Object,
            value: function() {
                return this
            }
        },
        fitInto: {
            type: Object,
            value: window
        },
        noOverlap: {
            type: Boolean
        },
        positionTarget: {
            type: Element
        },
        horizontalAlign: {
            type: String
        },
        verticalAlign: {
            type: String
        },
        dynamicAlign: {
            type: Boolean
        },
        horizontalOffset: {
            type: Number,
            value: 0,
            notify: !0
        },
        verticalOffset: {
            type: Number,
            value: 0,
            notify: !0
        },
        autoFitOnAttach: {
            type: Boolean,
            value: !1
        },
        _fitInfo: {
            type: Object
        }
    },
    get _fitWidth() {
        return this.fitInto === window ? this.fitInto.innerWidth : this.fitInto.getBoundingClientRect().width
    },
    get _fitHeight() {
        return this.fitInto === window ? this.fitInto.innerHeight : this.fitInto.getBoundingClientRect().height
    },
    get _fitLeft() {
        return this.fitInto === window ? 0 : this.fitInto.getBoundingClientRect().left
    },
    get _fitTop() {
        return this.fitInto === window ? 0 : this.fitInto.getBoundingClientRect().top
    },
    get _defaultPositionTarget() {
        var e = Polymer.dom(this).parentNode;
        return e && e.nodeType === Node.DOCUMENT_FRAGMENT_NODE && (e = e.host), e
    },
    get _localeHorizontalAlign() {
        if (this._isRTL) {
            if ("right" === this.horizontalAlign)
                return "left";
            if ("left" === this.horizontalAlign)
                return "right"
        }
        return this.horizontalAlign
    },
    attached: function() {
        void 0 === this._isRTL && (this._isRTL = "rtl" == window.getComputedStyle(this).direction), this.positionTarget = this.positionTarget || this._defaultPositionTarget, this.autoFitOnAttach && ("none" === window.getComputedStyle(this).display ? setTimeout(function() {
            this.fit()
        }.bind(this)) : this.fit())
    },
    fit: function() {
        this.position(), this.constrain(), this.center()
    },
    _discoverInfo: function() {
        if (!this._fitInfo) {
            var e = window.getComputedStyle(this),
                t = window.getComputedStyle(this.sizingTarget);
            this._fitInfo = {
                inlineStyle: {
                    top: this.style.top || "",
                    left: this.style.left || "",
                    position: this.style.position || ""
                },
                sizerInlineStyle: {
                    maxWidth: this.sizingTarget.style.maxWidth || "",
                    maxHeight: this.sizingTarget.style.maxHeight || "",
                    boxSizing: this.sizingTarget.style.boxSizing || ""
                },
                positionedBy: {
                    vertically: "auto" !== e.top ? "top" : "auto" !== e.bottom ? "bottom" : null,
                    horizontally: "auto" !== e.left ? "left" : "auto" !== e.right ? "right" : null
                },
                sizedBy: {
                    height: "none" !== t.maxHeight,
                    width: "none" !== t.maxWidth,
                    minWidth: parseInt(t.minWidth, 10) || 0,
                    minHeight: parseInt(t.minHeight, 10) || 0
                },
                margin: {
                    top: parseInt(e.marginTop, 10) || 0,
                    right: parseInt(e.marginRight, 10) || 0,
                    bottom: parseInt(e.marginBottom, 10) || 0,
                    left: parseInt(e.marginLeft, 10) || 0
                }
            }
        }
    },
    resetFit: function() {
        var e = this._fitInfo || {};
        for (var t in e.sizerInlineStyle)
            this.sizingTarget.style[t] = e.sizerInlineStyle[t];
        for (var t in e.inlineStyle)
            this.style[t] = e.inlineStyle[t];
        this._fitInfo = null
    },
    refit: function() {
        var e = this.sizingTarget.scrollLeft,
            t = this.sizingTarget.scrollTop;
        this.resetFit(), this.fit(), this.sizingTarget.scrollLeft = e, this.sizingTarget.scrollTop = t
    },
    position: function() {
        if (this.horizontalAlign || this.verticalAlign) {
            this._discoverInfo(), this.style.position = "fixed", this.sizingTarget.style.boxSizing = "border-box", this.style.left = "0px", this.style.top = "0px";
            var e = this.getBoundingClientRect(),
                t = this.__getNormalizedRect(this.positionTarget),
                i = this.__getNormalizedRect(this.fitInto),
                n = this._fitInfo.margin,
                r = {
                    width: e.width + n.left + n.right,
                    height: e.height + n.top + n.bottom
                },
                o = this.__getPosition(this._localeHorizontalAlign, this.verticalAlign, r, t, i),
                s = o.left + n.left,
                a = o.top + n.top,
                l = Math.min(i.right - n.right, s + e.width),
                h = Math.min(i.bottom - n.bottom, a + e.height);
            s = Math.max(i.left + n.left, Math.min(s, l - this._fitInfo.sizedBy.minWidth)), a = Math.max(i.top + n.top, Math.min(a, h - this._fitInfo.sizedBy.minHeight)), this.sizingTarget.style.maxWidth = Math.max(l - s, this._fitInfo.sizedBy.minWidth) + "px", this.sizingTarget.style.maxHeight = Math.max(h - a, this._fitInfo.sizedBy.minHeight) + "px", this.style.left = s - e.left + "px", this.style.top = a - e.top + "px"
        }
    },
    constrain: function() {
        if (!this.horizontalAlign && !this.verticalAlign) {
            this._discoverInfo();
            var e = this._fitInfo;
            e.positionedBy.vertically || (this.style.position = "fixed", this.style.top = "0px"), e.positionedBy.horizontally || (this.style.position = "fixed", this.style.left = "0px"), this.sizingTarget.style.boxSizing = "border-box";
            var t = this.getBoundingClientRect();
            e.sizedBy.height || this.__sizeDimension(t, e.positionedBy.vertically, "top", "bottom", "Height"), e.sizedBy.width || this.__sizeDimension(t, e.positionedBy.horizontally, "left", "right", "Width")
        }
    },
    _sizeDimension: function(e, t, i, n, r) {
        this.__sizeDimension(e, t, i, n, r)
    },
    __sizeDimension: function(e, t, i, n, r) {
        var o = this._fitInfo,
            s = this.__getNormalizedRect(this.fitInto),
            a = "Width" === r ? s.width : s.height,
            l = t === n,
            h = l ? a - e[n] : e[i],
            c = o.margin[l ? i : n],
            u = "offset" + r,
            d = this[u] - this.sizingTarget[u];
        this.sizingTarget.style["max" + r] = a - c - h - d + "px"
    },
    center: function() {
        if (!this.horizontalAlign && !this.verticalAlign) {
            this._discoverInfo();
            var e = this._fitInfo.positionedBy;
            if (!e.vertically || !e.horizontally) {
                this.style.position = "fixed", e.vertically || (this.style.top = "0px"), e.horizontally || (this.style.left = "0px");
                var t = this.getBoundingClientRect(),
                    i = this.__getNormalizedRect(this.fitInto);
                if (!e.vertically) {
                    var n = i.top - t.top + (i.height - t.height) / 2;
                    this.style.top = n + "px"
                }
                if (!e.horizontally) {
                    var r = i.left - t.left + (i.width - t.width) / 2;
                    this.style.left = r + "px"
                }
            }
        }
    },
    __getNormalizedRect: function(e) {
        return e === document.documentElement || e === window ? {
            top: 0,
            left: 0,
            width: window.innerWidth,
            height: window.innerHeight,
            right: window.innerWidth,
            bottom: window.innerHeight
        } : e.getBoundingClientRect()
    },
    __getCroppedArea: function(e, t, i) {
        var n = Math.min(0, e.top) + Math.min(0, i.bottom - (e.top + t.height)),
            r = Math.min(0, e.left) + Math.min(0, i.right - (e.left + t.width));
        return Math.abs(n) * t.width + Math.abs(r) * t.height
    },
    __getPosition: function(e, t, i, n, r) {
        var o,
            s = [{
                verticalAlign: "top",
                horizontalAlign: "left",
                top: n.top + this.verticalOffset,
                left: n.left + this.horizontalOffset
            }, {
                verticalAlign: "top",
                horizontalAlign: "right",
                top: n.top + this.verticalOffset,
                left: n.right - i.width - this.horizontalOffset
            }, {
                verticalAlign: "bottom",
                horizontalAlign: "left",
                top: n.bottom - i.height - this.verticalOffset,
                left: n.left + this.horizontalOffset
            }, {
                verticalAlign: "bottom",
                horizontalAlign: "right",
                top: n.bottom - i.height - this.verticalOffset,
                left: n.right - i.width - this.horizontalOffset
            }];
        if (this.noOverlap) {
            for (var a = 0, l = s.length; a < l; a++) {
                var h = {};
                for (var c in s[a])
                    h[c] = s[a][c];
                s.push(h)
            }
            s[0].top = s[1].top += n.height, s[2].top = s[3].top -= n.height, s[4].left = s[6].left += n.width, s[5].left = s[7].left -= n.width
        }
        for (t = "auto" === t ? null : t, e = "auto" === e ? null : e, a = 0; a < s.length; a++) {
            var u = s[a];
            if (!this.dynamicAlign && !this.noOverlap && u.verticalAlign === t && u.horizontalAlign === e) {
                o = u;
                break
            }
            var d = !(t && u.verticalAlign !== t || e && u.horizontalAlign !== e);
            if (this.dynamicAlign || d) {
                o = o || u, u.croppedArea = this.__getCroppedArea(u, i, r);
                var f = u.croppedArea - o.croppedArea;
                if ((f < 0 || 0 === f && d) && (o = u), 0 === o.croppedArea && d)
                    break
            }
        }
        return o
    }
}, function() {
    "use strict";
    Polymer({
        is: "iron-overlay-backdrop",
        properties: {
            opened: {
                reflectToAttribute: !0,
                type: Boolean,
                value: !1,
                observer: "_openedChanged"
            }
        },
        listeners: {
            transitionend: "_onTransitionend"
        },
        created: function() {
            this.__openedRaf = null
        },
        attached: function() {
            this.opened && this._openedChanged(this.opened)
        },
        prepare: function() {
            this.opened && !this.parentNode && Polymer.dom(document.body).appendChild(this)
        },
        open: function() {
            this.opened = !0
        },
        close: function() {
            this.opened = !1
        },
        complete: function() {
            this.opened || this.parentNode !== document.body || Polymer.dom(this.parentNode).removeChild(this)
        },
        _onTransitionend: function(e) {
            e && e.target === this && this.complete()
        },
        _openedChanged: function(e) {
            if (e)
                this.prepare();
            else {
                var t = window.getComputedStyle(this);
                "0s" !== t.transitionDuration && 0 != t.opacity || this.complete()
            }
            this.isAttached && (this.__openedRaf && (window.cancelAnimationFrame(this.__openedRaf), this.__openedRaf = null), this.scrollTop = this.scrollTop, this.__openedRaf = window.requestAnimationFrame(function() {
                this.__openedRaf = null, this.toggleClass("opened", this.opened)
            }.bind(this)))
        }
    })
}(), Polymer.IronOverlayManagerClass = function() {
    this._overlays = [], this._minimumZ = 101, this._backdropElement = null, Polymer.Gestures.add(document, "tap", null), document.addEventListener("tap", this._onCaptureClick.bind(this), !0), document.addEventListener("focus", this._onCaptureFocus.bind(this), !0), document.addEventListener("keydown", this._onCaptureKeyDown.bind(this), !0)
}, Polymer.IronOverlayManagerClass.prototype = {
    constructor: Polymer.IronOverlayManagerClass,
    get backdropElement() {
        return this._backdropElement || (this._backdropElement = document.createElement("iron-overlay-backdrop")), this._backdropElement
    },
    get deepActiveElement() {
        for (var e = document.activeElement || document.body; e.root && Polymer.dom(e.root).activeElement;)
            e = Polymer.dom(e.root).activeElement;
        return e
    },
    _bringOverlayAtIndexToFront: function(e) {
        var t = this._overlays[e];
        if (t) {
            var i = this._overlays.length - 1,
                n = this._overlays[i];
            if (n && this._shouldBeBehindOverlay(t, n) && i--, !(e >= i)) {
                var r = Math.max(this.currentOverlayZ(), this._minimumZ);
                for (this._getZ(t) <= r && this._applyOverlayZ(t, r); e < i;)
                    this._overlays[e] = this._overlays[e + 1], e++;
                this._overlays[i] = t
            }
        }
    },
    addOrRemoveOverlay: function(e) {
        e.opened ? this.addOverlay(e) : this.removeOverlay(e)
    },
    addOverlay: function(e) {
        var t = this._overlays.indexOf(e);
        if (t >= 0)
            return this._bringOverlayAtIndexToFront(t), void this.trackBackdrop();
        var i = this._overlays.length,
            n = this._overlays[i - 1],
            r = Math.max(this._getZ(n), this._minimumZ),
            o = this._getZ(e);
        if (n && this._shouldBeBehindOverlay(e, n)) {
            this._applyOverlayZ(n, r), i--;
            var s = this._overlays[i - 1];
            r = Math.max(this._getZ(s), this._minimumZ)
        }
        o <= r && this._applyOverlayZ(e, r), this._overlays.splice(i, 0, e), this.trackBackdrop()
    },
    removeOverlay: function(e) {
        var t = this._overlays.indexOf(e);
        -1 !== t && (this._overlays.splice(t, 1), this.trackBackdrop())
    },
    currentOverlay: function() {
        var e = this._overlays.length - 1;
        return this._overlays[e]
    },
    currentOverlayZ: function() {
        return this._getZ(this.currentOverlay())
    },
    ensureMinimumZ: function(e) {
        this._minimumZ = Math.max(this._minimumZ, e)
    },
    focusOverlay: function() {
        var e = this.currentOverlay();
        e && e._applyFocus()
    },
    trackBackdrop: function() {
        var e = this._overlayWithBackdrop();
        (e || this._backdropElement) && (this.backdropElement.style.zIndex = this._getZ(e) - 1, this.backdropElement.opened = !!e)
    },
    getBackdrops: function() {
        for (var e = [], t = 0; t < this._overlays.length; t++)
            this._overlays[t].withBackdrop && e.push(this._overlays[t]);
        return e
    },
    backdropZ: function() {
        return this._getZ(this._overlayWithBackdrop()) - 1
    },
    _overlayWithBackdrop: function() {
        for (var e = 0; e < this._overlays.length; e++)
            if (this._overlays[e].withBackdrop)
                return this._overlays[e]
    },
    _getZ: function(e) {
        var t = this._minimumZ;
        if (e) {
            var i = Number(e.style.zIndex || window.getComputedStyle(e).zIndex);
            i == i && (t = i)
        }
        return t
    },
    _setZ: function(e, t) {
        e.style.zIndex = t
    },
    _applyOverlayZ: function(e, t) {
        this._setZ(e, t + 2)
    },
    _overlayInPath: function(e) {
        e = e || [];
        for (var t = 0; t < e.length; t++)
            if (e[t]._manager === this)
                return e[t]
    },
    _onCaptureClick: function(e) {
        var t = this.currentOverlay();
        t && this._overlayInPath(Polymer.dom(e).path) !== t && t._onCaptureClick(e)
    },
    _onCaptureFocus: function(e) {
        var t = this.currentOverlay();
        t && t._onCaptureFocus(e)
    },
    _onCaptureKeyDown: function(e) {
        var t = this.currentOverlay();
        t && (Polymer.IronA11yKeysBehavior.keyboardEventMatchesKeys(e, "esc") ? t._onCaptureEsc(e) : Polymer.IronA11yKeysBehavior.keyboardEventMatchesKeys(e, "tab") && t._onCaptureTab(e))
    },
    _shouldBeBehindOverlay: function(e, t) {
        return !e.alwaysOnTop && t.alwaysOnTop
    }
}, Polymer.IronOverlayManager = new Polymer.IronOverlayManagerClass, function() {
    "use strict";
    var e = Element.prototype,
        t = e.matches || e.matchesSelector || e.mozMatchesSelector || e.msMatchesSelector || e.oMatchesSelector || e.webkitMatchesSelector;
    Polymer.IronFocusablesHelper = {
        getTabbableNodes: function(e) {
            var t = [];
            return this._collectTabbableNodes(e, t) ? this._sortByTabIndex(t) : t
        },
        isFocusable: function(e) {
            return t.call(e, "input, select, textarea, button, object") ? t.call(e, ":not([disabled])") : t.call(e, "a[href], area[href], iframe, [tabindex], [contentEditable]")
        },
        isTabbable: function(e) {
            return this.isFocusable(e) && t.call(e, ':not([tabindex="-1"])') && this._isVisible(e)
        },
        _normalizedTabIndex: function(e) {
            if (this.isFocusable(e)) {
                var t = e.getAttribute("tabindex") || 0;
                return Number(t)
            }
            return -1
        },
        _collectTabbableNodes: function(e, t) {
            if (e.nodeType !== Node.ELEMENT_NODE || !this._isVisible(e))
                return !1;
            var i,
                n = e,
                r = this._normalizedTabIndex(n),
                o = r > 0;
            r >= 0 && t.push(n), i = "content" === n.localName ? Polymer.dom(n).getDistributedNodes() : Polymer.dom(n.root || n).children;
            for (var s = 0; s < i.length; s++) {
                var a = this._collectTabbableNodes(i[s], t);
                o = o || a
            }
            return o
        },
        _isVisible: function(e) {
            var t = e.style;
            return "hidden" !== t.visibility && "none" !== t.display && "hidden" !== (t = window.getComputedStyle(e)).visibility && "none" !== t.display
        },
        _sortByTabIndex: function(e) {
            var t = e.length;
            if (t < 2)
                return e;
            var i = Math.ceil(t / 2),
                n = this._sortByTabIndex(e.slice(0, i)),
                r = this._sortByTabIndex(e.slice(i));
            return this._mergeSortByTabIndex(n, r)
        },
        _mergeSortByTabIndex: function(e, t) {
            for (var i = []; e.length > 0 && t.length > 0;)
                this._hasLowerTabOrder(e[0], t[0]) ? i.push(t.shift()) : i.push(e.shift());
            return i.concat(e, t)
        },
        _hasLowerTabOrder: function(e, t) {
            var i = Math.max(e.tabIndex, 0),
                n = Math.max(t.tabIndex, 0);
            return 0 === i || 0 === n ? n > i : i > n
        }
    }
}(), function() {
    "use strict";
    Polymer.IronOverlayBehaviorImpl = {
        properties: {
            opened: {
                observer: "_openedChanged",
                type: Boolean,
                value: !1,
                notify: !0
            },
            canceled: {
                observer: "_canceledChanged",
                readOnly: !0,
                type: Boolean,
                value: !1
            },
            withBackdrop: {
                observer: "_withBackdropChanged",
                type: Boolean
            },
            noAutoFocus: {
                type: Boolean,
                value: !1
            },
            noCancelOnEscKey: {
                type: Boolean,
                value: !1
            },
            noCancelOnOutsideClick: {
                type: Boolean,
                value: !1
            },
            closingReason: {
                type: Object
            },
            restoreFocusOnClose: {
                type: Boolean,
                value: !1
            },
            alwaysOnTop: {
                type: Boolean
            },
            _manager: {
                type: Object,
                value: Polymer.IronOverlayManager
            },
            _focusedChild: {
                type: Object
            }
        },
        listeners: {
            "iron-resize": "_onIronResize"
        },
        get backdropElement() {
            return this._manager.backdropElement
        },
        get _focusNode() {
            return this._focusedChild || Polymer.dom(this).querySelector("[autofocus]") || this
        },
        get _focusableNodes() {
            return Polymer.IronFocusablesHelper.getTabbableNodes(this)
        },
        ready: function() {
            this.__isAnimating = !1, this.__shouldRemoveTabIndex = !1, this.__firstFocusableNode = this.__lastFocusableNode = null, this.__raf = null, this.__restoreFocusNode = null, this._ensureSetup()
        },
        attached: function() {
            this.opened && this._openedChanged(this.opened), this._observer = Polymer.dom(this).observeNodes(this._onNodesChange)
        },
        detached: function() {
            Polymer.dom(this).unobserveNodes(this._observer), this._observer = null, this.__raf && (window.cancelAnimationFrame(this.__raf), this.__raf = null), this._manager.removeOverlay(this)
        },
        toggle: function() {
            this._setCanceled(!1), this.opened = !this.opened
        },
        open: function() {
            this._setCanceled(!1), this.opened = !0
        },
        close: function() {
            this._setCanceled(!1), this.opened = !1
        },
        cancel: function(e) {
            this.fire("iron-overlay-canceled", e, {
                cancelable: !0
            }).defaultPrevented || (this._setCanceled(!0), this.opened = !1)
        },
        invalidateTabbables: function() {
            this.__firstFocusableNode = this.__lastFocusableNode = null
        },
        _ensureSetup: function() {
            this._overlaySetup || (this._overlaySetup = !0, this.style.outline = "none", this.style.display = "none")
        },
        _openedChanged: function(e) {
            e ? this.removeAttribute("aria-hidden") : this.setAttribute("aria-hidden", "true"), this.isAttached && (this.__isAnimating = !0, this.__onNextAnimationFrame(this.__openedChanged))
        },
        _canceledChanged: function() {
            this.closingReason = this.closingReason || {}, this.closingReason.canceled = this.canceled
        },
        _withBackdropChanged: function() {
            this.withBackdrop && !this.hasAttribute("tabindex") ? (this.setAttribute("tabindex", "-1"), this.__shouldRemoveTabIndex = !0) : this.__shouldRemoveTabIndex && (this.removeAttribute("tabindex"), this.__shouldRemoveTabIndex = !1), this.opened && this.isAttached && this._manager.trackBackdrop()
        },
        _prepareRenderOpened: function() {
            this.__restoreFocusNode = this._manager.deepActiveElement, this._preparePositioning(), this.refit(), this._finishPositioning(), this.noAutoFocus && document.activeElement === this._focusNode && (this._focusNode.blur(), this.__restoreFocusNode.focus())
        },
        _renderOpened: function() {
            this._finishRenderOpened()
        },
        _renderClosed: function() {
            this._finishRenderClosed()
        },
        _finishRenderOpened: function() {
            this.notifyResize(), this.__isAnimating = !1, this.fire("iron-overlay-opened")
        },
        _finishRenderClosed: function() {
            this.style.display = "none", this.style.zIndex = "", this.notifyResize(), this.__isAnimating = !1, this.fire("iron-overlay-closed", this.closingReason)
        },
        _preparePositioning: function() {
            this.style.transition = this.style.webkitTransition = "none", this.style.transform = this.style.webkitTransform = "none", this.style.display = ""
        },
        _finishPositioning: function() {
            this.style.display = "none", this.scrollTop = this.scrollTop, this.style.transition = this.style.webkitTransition = "", this.style.transform = this.style.webkitTransform = "", this.style.display = "", this.scrollTop = this.scrollTop
        },
        _applyFocus: function() {
            if (this.opened)
                this.noAutoFocus || this._focusNode.focus();
            else {
                this._focusNode.blur(), this._focusedChild = null, this.restoreFocusOnClose && this.__restoreFocusNode && this.__restoreFocusNode.focus(), this.__restoreFocusNode = null;
                var e = this._manager.currentOverlay();
                e && this !== e && e._applyFocus()
            }
        },
        _onCaptureClick: function(e) {
            this.noCancelOnOutsideClick || this.cancel(e)
        },
        _onCaptureFocus: function(e) {
            if (this.withBackdrop) {
                var t = Polymer.dom(e).path;
                -1 === t.indexOf(this) ? (e.stopPropagation(), this._applyFocus()) : this._focusedChild = t[0]
            }
        },
        _onCaptureEsc: function(e) {
            this.noCancelOnEscKey || this.cancel(e)
        },
        _onCaptureTab: function(e) {
            if (this.withBackdrop) {
                this.__ensureFirstLastFocusables();
                var t = e.shiftKey,
                    i = t ? this.__firstFocusableNode : this.__lastFocusableNode,
                    n = t ? this.__lastFocusableNode : this.__firstFocusableNode,
                    r = !1;
                if (i === n)
                    r = !0;
                else {
                    var o = this._manager.deepActiveElement;
                    r = o === i || o === this
                }
                r && (e.preventDefault(), this._focusedChild = n, this._applyFocus())
            }
        },
        _onIronResize: function() {
            this.opened && !this.__isAnimating && this.__onNextAnimationFrame(this.refit)
        },
        _onNodesChange: function() {
            this.opened && !this.__isAnimating && (this.invalidateTabbables(), this.notifyResize())
        },
        __ensureFirstLastFocusables: function() {
            if (!this.__firstFocusableNode || !this.__lastFocusableNode) {
                var e = this._focusableNodes;
                this.__firstFocusableNode = e[0], this.__lastFocusableNode = e[e.length - 1]
            }
        },
        __openedChanged: function() {
            this.opened ? (this._prepareRenderOpened(), this._manager.addOverlay(this), this._applyFocus(), this._renderOpened()) : (this._manager.removeOverlay(this), this._applyFocus(), this._renderClosed())
        },
        __onNextAnimationFrame: function(e) {
            this.__raf && window.cancelAnimationFrame(this.__raf);
            var t = this;
            this.__raf = window.requestAnimationFrame(function() {
                t.__raf = null, e.call(t)
            })
        }
    }, Polymer.IronOverlayBehavior = [Polymer.IronFitBehavior, Polymer.IronResizableBehavior, Polymer.IronOverlayBehaviorImpl]
}(), Polymer.NeonAnimatableBehavior = {
    properties: {
        animationConfig: {
            type: Object
        },
        entryAnimation: {
            observer: "_entryAnimationChanged",
            type: String
        },
        exitAnimation: {
            observer: "_exitAnimationChanged",
            type: String
        }
    },
    _entryAnimationChanged: function() {
        this.animationConfig = this.animationConfig || {}, this.animationConfig.entry = [{
            name: this.entryAnimation,
            node: this
        }]
    },
    _exitAnimationChanged: function() {
        this.animationConfig = this.animationConfig || {}, this.animationConfig.exit = [{
            name: this.exitAnimation,
            node: this
        }]
    },
    _copyProperties: function(e, t) {
        for (var i in t)
            e[i] = t[i]
    },
    _cloneConfig: function(e) {
        var t = {
            isClone: !0
        };
        return this._copyProperties(t, e), t
    },
    _getAnimationConfigRecursive: function(e, t, i) {
        var n;
        if (this.animationConfig)
            if (this.animationConfig.value && "function" == typeof this.animationConfig.value)
                this._warn(this._logf("playAnimation", "Please put 'animationConfig' inside of your components 'properties' object instead of outside of it."));
            else if (n = e ? this.animationConfig[e] : this.animationConfig, Array.isArray(n) || (n = [n]), n)
                for (var r, o = 0; r = n[o]; o++)
                    if (r.animatable)
                        r.animatable._getAnimationConfigRecursive(r.type || e, t, i);
                    else if (r.id) {
                        var s = t[r.id];
                        s ? (s.isClone || (t[r.id] = this._cloneConfig(s), s = t[r.id]), this._copyProperties(s, r)) : t[r.id] = r
                    } else
                        i.push(r)
    },
    getAnimationConfig: function(e) {
        var t = {},
            i = [];
        for (var n in this._getAnimationConfigRecursive(e, t, i), t)
            i.push(t[n]);
        return i
    }
}, Polymer.NeonAnimationRunnerBehaviorImpl = {
    _configureAnimations: function(e) {
        var t = [];
        if (e.length > 0)
            for (var i, n = 0; i = e[n]; n++) {
                var r = document.createElement(i.name);
                if (r.isNeonAnimation) {
                    var o = null;
                    try {
                        "function" != typeof (o = r.configure(i)).cancel && (o = document.timeline.play(o))
                    } catch (e) {
                        o = null
                    }
                    o && t.push({
                        neonAnimation: r,
                        config: i,
                        animation: o
                    })
                }
            }
        return t
    },
    _shouldComplete: function(e) {
        for (var t = !0, i = 0; i < e.length; i++)
            if ("finished" != e[i].animation.playState) {
                t = !1;
                break
            }
        return t
    },
    _complete: function(e) {
        for (var t = 0; t < e.length; t++)
            e[t].neonAnimation.complete(e[t].config);
        for (t = 0; t < e.length; t++)
            e[t].animation.cancel()
    },
    playAnimation: function(e, t) {
        var i = this.getAnimationConfig(e);
        if (i) {
            this._active = this._active || {}, this._active[e] && (this._complete(this._active[e]), delete this._active[e]);
            var n = this._configureAnimations(i);
            if (0 != n.length) {
                this._active[e] = n;
                for (var r = 0; r < n.length; r++)
                    n[r].animation.onfinish = function() {
                        this._shouldComplete(n) && (this._complete(n), delete this._active[e], this.fire("neon-animation-finish", t, {
                            bubbles: !1
                        }))
                    }.bind(this)
            } else
                this.fire("neon-animation-finish", t, {
                    bubbles: !1
                })
        }
    },
    cancelAnimation: function() {
        for (var e in this._animations)
            this._animations[e].cancel();
        this._animations = {}
    }
}, Polymer.NeonAnimationRunnerBehavior = [Polymer.NeonAnimatableBehavior, Polymer.NeonAnimationRunnerBehaviorImpl], Polymer.NeonAnimationBehavior = {
    properties: {
        animationTiming: {
            type: Object,
            value: function() {
                return {
                    duration: 500,
                    easing: "cubic-bezier(0.4, 0, 0.2, 1)",
                    fill: "both"
                }
            }
        }
    },
    isNeonAnimation: !0,
    timingFromConfig: function(e) {
        if (e.timing)
            for (var t in e.timing)
                this.animationTiming[t] = e.timing[t];
        return this.animationTiming
    },
    setPrefixedProperty: function(e, t, i) {
        for (var n, r = {
                transform: ["webkitTransform"],
                transformOrigin: ["mozTransformOrigin", "webkitTransformOrigin"]
            }[t], o = 0; n = r[o]; o++)
            e.style[n] = i;
        e.style[t] = i
    },
    complete: function() {}
}, function(a, b) {
    var c = {},
        d = {},
        e = {},
        f = null;
    !function(e, t) {
        function i() {
            this._delay = 0, this._endDelay = 0, this._fill = "none", this._iterationStart = 0, this._iterations = 1, this._duration = 0, this._playbackRate = 1, this._direction = "normal", this._easing = "linear", this._easingFunction = d
        }
        function n() {
            return e.isDeprecated("Invalid timing inputs", "2016-03-02", "TypeError exceptions will be thrown instead.", !0)
        }
        function r(t, n, r) {
            var o = new i;
            return n && (o.fill = "both", o.duration = "auto"), "number" != typeof t || isNaN(t) ? void 0 !== t && Object.getOwnPropertyNames(t).forEach(function(i) {
                if ("auto" != t[i]) {
                    if (("number" == typeof o[i] || "duration" == i) && ("number" != typeof t[i] || isNaN(t[i])))
                        return;
                    if ("fill" == i && -1 == c.indexOf(t[i]))
                        return;
                    if ("direction" == i && -1 == u.indexOf(t[i]))
                        return;
                    if ("playbackRate" == i && 1 !== t[i] && e.isDeprecated("AnimationEffectTiming.playbackRate", "2014-11-28", "Use Animation.playbackRate instead."))
                        return;
                    o[i] = t[i]
                }
            }) : o.duration = t, o
        }
        function o(e, t, i, n) {
            return e < 0 || e > 1 || i < 0 || i > 1 ? d : function(r) {
                function o(e, t, i) {
                    return 3 * e * (1 - i) * (1 - i) * i + 3 * t * (1 - i) * i * i + i * i * i
                }
                if (r <= 0) {
                    var s = 0;
                    return e > 0 ? s = t / e : !t && i > 0 && (s = n / i), s * r
                }
                if (r >= 1) {
                    var a = 0;
                    return i < 1 ? a = (n - 1) / (i - 1) : 1 == i && e < 1 && (a = (t - 1) / (e - 1)), 1 + a * (r - 1)
                }
                for (var l = 0, h = 1; l < h;) {
                    var c = (l + h) / 2,
                        u = o(e, i, c);
                    if (Math.abs(r - u) < 1e-5)
                        return o(t, n, c);
                    u < r ? l = c : h = c
                }
                return o(t, n, c)
            }
        }
        function s(e, t) {
            return function(i) {
                if (i >= 1)
                    return 1;
                var n = 1 / e;
                return (i += t * n) - i % n
            }
        }
        function a(e) {
            y || (y = document.createElement("div").style), y.animationTimingFunction = "", y.animationTimingFunction = e;
            var t = y.animationTimingFunction;
            if ("" == t && n())
                throw new TypeError(e + " is not a valid value for easing");
            return t
        }
        function l(e) {
            if ("linear" == e)
                return d;
            var t = g.exec(e);
            if (t)
                return o.apply(this, t.slice(1).map(Number));
            var i = b.exec(e);
            return i ? s(Number(i[1]), {
                start: f,
                middle: p,
                end: _
            }[i[2]]) : m[e] || d
        }
        function h(e, t, i) {
            if (null == t)
                return P;
            var n = i.delay + e + i.endDelay;
            return t < Math.min(i.delay, n) ? C : t >= Math.min(i.delay + e, n) ? S : E
        }
        var c = "backwards|forwards|both|none".split("|"),
            u = "reverse|alternate|alternate-reverse".split("|"),
            d = function(e) {
                return e
            };
        i.prototype = {
            _setMember: function(t, i) {
                this["_" + t] = i, this._effect && (this._effect._timingInput[t] = i, this._effect._timing = e.normalizeTimingInput(this._effect._timingInput), this._effect.activeDuration = e.calculateActiveDuration(this._effect._timing), this._effect._animation && this._effect._animation._rebuildUnderlyingAnimation())
            },
            get playbackRate() {
                return this._playbackRate
            },
            set delay(e) {
                this._setMember("delay", e)
            },
            get delay() {
                return this._delay
            },
            set endDelay(e) {
                this._setMember("endDelay", e)
            },
            get endDelay() {
                return this._endDelay
            },
            set fill(e) {
                this._setMember("fill", e)
            },
            get fill() {
                return this._fill
            },
            set iterationStart(e) {
                if ((isNaN(e) || e < 0) && n())
                    throw new TypeError("iterationStart must be a non-negative number, received: " + timing.iterationStart);
                this._setMember("iterationStart", e)
            },
            get iterationStart() {
                return this._iterationStart
            },
            set duration(e) {
                if ("auto" != e && (isNaN(e) || e < 0) && n())
                    throw new TypeError("duration must be non-negative or auto, received: " + e);
                this._setMember("duration", e)
            },
            get duration() {
                return this._duration
            },
            set direction(e) {
                this._setMember("direction", e)
            },
            get direction() {
                return this._direction
            },
            set easing(e) {
                this._easingFunction = l(a(e)), this._setMember("easing", e)
            },
            get easing() {
                return this._easing
            },
            set iterations(e) {
                if ((isNaN(e) || e < 0) && n())
                    throw new TypeError("iterations must be non-negative, received: " + e);
                this._setMember("iterations", e)
            },
            get iterations() {
                return this._iterations
            }
        };
        var f = 1,
            p = .5,
            _ = 0,
            m = {
                ease: o(.25, .1, .25, 1),
                "ease-in": o(.42, 0, 1, 1),
                "ease-out": o(0, 0, .58, 1),
                "ease-in-out": o(.42, 0, .58, 1),
                "step-start": s(1, f),
                "step-middle": s(1, p),
                "step-end": s(1, _)
            },
            y = null,
            v = "\\s*(-?\\d+\\.?\\d*|-?\\.\\d+)\\s*",
            g = new RegExp("cubic-bezier\\(" + v + "," + v + "," + v + "," + v + "\\)"),
            b = /steps\(\s*(\d+)\s*,\s*(start|middle|end)\s*\)/,
            P = 0,
            C = 1,
            S = 2,
            E = 3;
        e.cloneTimingInput = function(e) {
            if ("number" == typeof e)
                return e;
            var t = {};
            for (var i in e)
                t[i] = e[i];
            return t
        }, e.makeTiming = r, e.numericTimingToObject = function(e) {
            return "number" == typeof e && (e = isNaN(e) ? {
                duration: 0
            } : {
                duration: e
            }), e
        }, e.normalizeTimingInput = function(t, i) {
            return r(t = e.numericTimingToObject(t), i)
        }, e.calculateActiveDuration = function(e) {
            return Math.abs(function(e) {
                return 0 === e.duration || 0 === e.iterations ? 0 : e.duration * e.iterations
            }(e) / e.playbackRate)
        }, e.calculateIterationProgress = function(e, t, i) {
            var n = h(e, t, i),
                r = function(e, t, i, n, r) {
                    switch (n) {
                    case C:
                        return "backwards" == t || "both" == t ? 0 : null;
                    case E:
                        return i - r;
                    case S:
                        return "forwards" == t || "both" == t ? e : null;
                    case P:
                        return null
                    }
                }(e, i.fill, t, n, i.delay);
            if (null === r)
                return null;
            var o = function(e, t, i, n, r) {
                    var o = r;
                    return 0 === e ? t !== C && (o += i) : o += n / e, o
                }(i.duration, n, i.iterations, r, i.iterationStart),
                s = function(e, t, i, n, r, o) {
                    var s = e === 1 / 0 ? t % 1 : e % 1;
                    return 0 !== s || i !== S || 0 === n || 0 === r && 0 !== o || (s = 1), s
                }(o, i.iterationStart, n, i.iterations, r, i.duration),
                a = function(e, t, i, n) {
                    return e === S && t === 1 / 0 ? 1 / 0 : 1 === s ? Math.floor(n) - 1 : Math.floor(n)
                }(n, i.iterations, 0, o),
                l = function(e, t, i) {
                    var n = e;
                    if ("normal" !== e && "reverse" !== e) {
                        var r = a;
                        "alternate-reverse" === e && (r += 1), n = "normal", r !== 1 / 0 && r % 2 != 0 && (n = "reverse")
                    }
                    return "normal" === n ? s : 1 - s
                }(i.direction);
            return i._easingFunction(l)
        }, e.calculatePhase = h, e.normalizeEasing = a, e.parseEasingFunction = l
    }(c), function(e, t) {
        function i(e, t) {
            return e in l && l[e][t] || t
        }
        function n(e, t, n) {
            if (!function(e) {
                return "display" === e || 0 === e.lastIndexOf("animation", 0) || 0 === e.lastIndexOf("transition", 0)
            }(e)) {
                var r = o[e];
                if (r)
                    for (var a in s.style[e] = t, r) {
                        var l = r[a],
                            h = s.style[l];
                        n[l] = i(l, h)
                    }
                else
                    n[e] = i(e, t)
            }
        }
        function r(e) {
            var t = [];
            for (var i in e)
                if (!(i in ["easing", "offset", "composite"])) {
                    var n = e[i];
                    Array.isArray(n) || (n = [n]);
                    for (var r, o = n.length, s = 0; s < o; s++)
                        (r = {}).offset = "offset" in e ? e.offset : 1 == o ? 1 : s / (o - 1), "easing" in e && (r.easing = e.easing), "composite" in e && (r.composite = e.composite), r[i] = n[s], t.push(r)
                }
            return t.sort(function(e, t) {
                return e.offset - t.offset
            }), t
        }
        var o = {
                background: ["backgroundImage", "backgroundPosition", "backgroundSize", "backgroundRepeat", "backgroundAttachment", "backgroundOrigin", "backgroundClip", "backgroundColor"],
                border: ["borderTopColor", "borderTopStyle", "borderTopWidth", "borderRightColor", "borderRightStyle", "borderRightWidth", "borderBottomColor", "borderBottomStyle", "borderBottomWidth", "borderLeftColor", "borderLeftStyle", "borderLeftWidth"],
                borderBottom: ["borderBottomWidth", "borderBottomStyle", "borderBottomColor"],
                borderColor: ["borderTopColor", "borderRightColor", "borderBottomColor", "borderLeftColor"],
                borderLeft: ["borderLeftWidth", "borderLeftStyle", "borderLeftColor"],
                borderRadius: ["borderTopLeftRadius", "borderTopRightRadius", "borderBottomRightRadius", "borderBottomLeftRadius"],
                borderRight: ["borderRightWidth", "borderRightStyle", "borderRightColor"],
                borderTop: ["borderTopWidth", "borderTopStyle", "borderTopColor"],
                borderWidth: ["borderTopWidth", "borderRightWidth", "borderBottomWidth", "borderLeftWidth"],
                flex: ["flexGrow", "flexShrink", "flexBasis"],
                font: ["fontFamily", "fontSize", "fontStyle", "fontVariant", "fontWeight", "lineHeight"],
                margin: ["marginTop", "marginRight", "marginBottom", "marginLeft"],
                outline: ["outlineColor", "outlineStyle", "outlineWidth"],
                padding: ["paddingTop", "paddingRight", "paddingBottom", "paddingLeft"]
            },
            s = document.createElementNS("http://www.w3.org/1999/xhtml", "div"),
            a = {
                thin: "1px",
                medium: "3px",
                thick: "5px"
            },
            l = {
                borderBottomWidth: a,
                borderLeftWidth: a,
                borderRightWidth: a,
                borderTopWidth: a,
                fontSize: {
                    "xx-small": "60%",
                    "x-small": "75%",
                    small: "89%",
                    medium: "100%",
                    large: "120%",
                    "x-large": "150%",
                    "xx-large": "200%"
                },
                fontWeight: {
                    normal: "400",
                    bold: "700"
                },
                outlineWidth: a,
                textShadow: {
                    none: "0px 0px 0px transparent"
                },
                boxShadow: {
                    none: "0px 0px 0px 0px transparent"
                }
            };
        e.convertToArrayForm = r, e.normalizeKeyframes = function(t) {
            if (null == t)
                return [];
            window.Symbol && Symbol.iterator && Array.prototype.from && t[Symbol.iterator] && (t = Array.from(t)), Array.isArray(t) || (t = r(t));
            for (var i = t.map(function(t) {
                    var i = {};
                    for (var r in t) {
                        var o = t[r];
                        if ("offset" == r) {
                            if (null != o) {
                                if (o = Number(o), !isFinite(o))
                                    throw new TypeError("Keyframe offsets must be numbers.");
                                if (o < 0 || o > 1)
                                    throw new TypeError("Keyframe offsets must be between 0 and 1.")
                            }
                        } else if ("composite" == r) {
                            if ("add" == o || "accumulate" == o)
                                throw {
                                    type: DOMException.NOT_SUPPORTED_ERR,
                                    name: "NotSupportedError",
                                    message: "add compositing is not supported"
                                };
                            if ("replace" != o)
                                throw new TypeError("Invalid composite mode " + o + ".")
                        } else
                            o = "easing" == r ? e.normalizeEasing(o) : "" + o;
                        n(r, o, i)
                    }
                    return void 0 == i.offset && (i.offset = null), void 0 == i.easing && (i.easing = "linear"), i
                }), o = !0, s = -1 / 0, a = 0; a < i.length; a++) {
                var l = i[a].offset;
                if (null != l) {
                    if (l < s)
                        throw new TypeError("Keyframes are not loosely sorted by offset. Sort or specify offsets.");
                    s = l
                } else
                    o = !1
            }
            return i = i.filter(function(e) {
                return e.offset >= 0 && e.offset <= 1
            }), o || function() {
                var e = i.length;
                null == i[e - 1].offset && (i[e - 1].offset = 1), e > 1 && null == i[0].offset && (i[0].offset = 0);
                for (var t = 0, n = i[0].offset, r = 1; r < e; r++) {
                    var o = i[r].offset;
                    if (null != o) {
                        for (var s = 1; s < r - t; s++)
                            i[t + s].offset = n + (o - n) * s / (r - t);
                        t = r, n = o
                    }
                }
            }(), i
        }
    }(c), function(e) {
        var t = {};
        e.isDeprecated = function(e, i, n, r) {
            var o = new Date,
                s = new Date(i);
            return s.setMonth(s.getMonth() + 3), !(o < s && (t[e] = !0, 1))
        }, e.deprecated = function(t, i, n, r) {
            var o = r ? "are" : "is";
            if (e.isDeprecated(t, i, n, r))
                throw new Error(t + " " + o + " no longer supported. " + n)
        }
    }(c), function() {
        if (document.documentElement.animate) {
            var a = document.documentElement.animate([], 0),
                b = !0;
            if (a && (b = !1, "play|currentTime|pause|reverse|playbackRate|cancel|finish|startTime|playState".split("|").forEach(function(e) {
                void 0 === a[e] && (b = !0)
            })), !b)
                return
        }
        !function(e, t, i) {
            t.convertEffectInput = function(i) {
                var n = function(e) {
                        for (var t = {}, i = 0; i < e.length; i++)
                            for (var n in e[i])
                                if ("offset" != n && "easing" != n && "composite" != n) {
                                    var r = {
                                        offset: e[i].offset,
                                        easing: e[i].easing,
                                        value: e[i][n]
                                    };
                                    t[n] = t[n] || [], t[n].push(r)
                                }
                        for (var o in t) {
                            var s = t[o];
                            if (0 != s[0].offset || 1 != s[s.length - 1].offset)
                                throw {
                                    type: DOMException.NOT_SUPPORTED_ERR,
                                    name: "NotSupportedError",
                                    message: "Partial keyframes are not supported"
                                }
                        }
                        return t
                    }(e.normalizeKeyframes(i)),
                    r = function(i) {
                        var n = [];
                        for (var r in i)
                            for (var o = i[r], s = 0; s < o.length - 1; s++) {
                                var a = s,
                                    l = s + 1,
                                    h = o[a].offset,
                                    c = o[l].offset,
                                    u = h,
                                    d = c;
                                0 == s && (u = -1 / 0, 0 == c && (l = a)), s == o.length - 2 && (d = 1 / 0, 1 == h && (a = l)), n.push({
                                    applyFrom: u,
                                    applyTo: d,
                                    startOffset: o[a].offset,
                                    endOffset: o[l].offset,
                                    easingFunction: e.parseEasingFunction(o[a].easing),
                                    property: r,
                                    interpolation: t.propertyInterpolation(r, o[a].value, o[l].value)
                                })
                            }
                        return n.sort(function(e, t) {
                            return e.startOffset - t.startOffset
                        }), n
                    }(n);
                return function(e, i) {
                    if (null != i)
                        r.filter(function(e) {
                            return i >= e.applyFrom && i < e.applyTo
                        }).forEach(function(n) {
                            var r = i - n.startOffset,
                                o = n.endOffset - n.startOffset,
                                s = 0 == o ? 0 : n.easingFunction(r / o);
                            t.apply(e, n.property, n.interpolation(s))
                        });
                    else
                        for (var o in n)
                            "offset" != o && "easing" != o && "composite" != o && t.clear(e, o)
                }
            }
        }(c, d), function(e, t, i) {
            function n(e) {
                return e.replace(/-(.)/g, function(e, t) {
                    return t.toUpperCase()
                })
            }
            function r(e, t, i) {
                o[i] = o[i] || [], o[i].push([e, t])
            }
            var o = {};
            t.addPropertiesHandler = function(e, t, i) {
                for (var o = 0; o < i.length; o++)
                    r(e, t, n(i[o]))
            };
            var s = {
                backgroundColor: "transparent",
                backgroundPosition: "0% 0%",
                borderBottomColor: "currentColor",
                borderBottomLeftRadius: "0px",
                borderBottomRightRadius: "0px",
                borderBottomWidth: "3px",
                borderLeftColor: "currentColor",
                borderLeftWidth: "3px",
                borderRightColor: "currentColor",
                borderRightWidth: "3px",
                borderSpacing: "2px",
                borderTopColor: "currentColor",
                borderTopLeftRadius: "0px",
                borderTopRightRadius: "0px",
                borderTopWidth: "3px",
                bottom: "auto",
                clip: "rect(0px, 0px, 0px, 0px)",
                color: "black",
                fontSize: "100%",
                fontWeight: "400",
                height: "auto",
                left: "auto",
                letterSpacing: "normal",
                lineHeight: "120%",
                marginBottom: "0px",
                marginLeft: "0px",
                marginRight: "0px",
                marginTop: "0px",
                maxHeight: "none",
                maxWidth: "none",
                minHeight: "0px",
                minWidth: "0px",
                opacity: "1.0",
                outlineColor: "invert",
                outlineOffset: "0px",
                outlineWidth: "3px",
                paddingBottom: "0px",
                paddingLeft: "0px",
                paddingRight: "0px",
                paddingTop: "0px",
                right: "auto",
                textIndent: "0px",
                textShadow: "0px 0px 0px transparent",
                top: "auto",
                transform: "",
                verticalAlign: "0px",
                visibility: "visible",
                width: "auto",
                wordSpacing: "normal",
                zIndex: "auto"
            };
            t.propertyInterpolation = function(i, r, a) {
                var l = i;
                /-/.test(i) && !e.isDeprecated("Hyphenated property names", "2016-03-22", "Use camelCase instead.", !0) && (l = n(i)), "initial" != r && "initial" != a || ("initial" == r && (r = s[l]), "initial" == a && (a = s[l]));
                for (var h = r == a ? [] : o[l], c = 0; h && c < h.length; c++) {
                    var u = h[c][0](r),
                        d = h[c][0](a);
                    if (void 0 !== u && void 0 !== d) {
                        var f = h[c][1](u, d);
                        if (f) {
                            var p = t.Interpolation.apply(null, f);
                            return function(e) {
                                return 0 == e ? r : 1 == e ? a : p(e)
                            }
                        }
                    }
                }
                return t.Interpolation(!1, !0, function(e) {
                    return e ? a : r
                })
            }
        }(c, d), function(e, t, i) {
            t.KeyframeEffect = function(i, n, r, o) {
                var s,
                    a = function(t) {
                        var i = e.calculateActiveDuration(t),
                            n = function(n) {
                                return e.calculateIterationProgress(i, n, t)
                            };
                        return n._totalDuration = t.delay + i + t.endDelay, n
                    }(e.normalizeTimingInput(r)),
                    l = t.convertEffectInput(n),
                    h = function() {
                        l(i, s)
                    };
                return h._update = function(e) {
                    return null !== (s = a(e))
                }, h._clear = function() {
                    l(i, null)
                }, h._hasSameTarget = function(e) {
                    return i === e
                }, h._target = i, h._totalDuration = a._totalDuration, h._id = o, h
            }, t.NullEffect = function(e) {
                var t = function() {
                    e && (e(), e = null)
                };
                return t._update = function() {
                    return null
                }, t._totalDuration = 0, t._hasSameTarget = function() {
                    return !1
                }, t
            }
        }(c, d), function(e, t) {
            e.apply = function(t, i, n) {
                t.style[e.propertyName(i)] = n
            }, e.clear = function(t, i) {
                t.style[e.propertyName(i)] = ""
            }
        }(d), function(e) {
            window.Element.prototype.animate = function(t, i) {
                var n = "";
                return i && i.id && (n = i.id), e.timeline._play(e.KeyframeEffect(this, t, i, n))
            }
        }(d), d.Interpolation = function(e, t, i) {
            return function(n) {
                return i(function e(t, i, n) {
                    if ("number" == typeof t && "number" == typeof i)
                        return t * (1 - n) + i * n;
                    if ("boolean" == typeof t && "boolean" == typeof i)
                        return n < .5 ? t : i;
                    if (t.length == i.length) {
                        for (var r = [], o = 0; o < t.length; o++)
                            r.push(e(t[o], i[o], n));
                        return r
                    }
                    throw "Mismatched interpolation arguments " + t + ":" + i
                }(e, t, n))
            }
        }, function(e, t, i) {
            e.sequenceNumber = 0, t.Animation = function(t) {
                this.id = "", t && t._id && (this.id = t._id), this._sequenceNumber = e.sequenceNumber++, this._currentTime = 0, this._startTime = null, this._paused = !1, this._playbackRate = 1, this._inTimeline = !0, this._finishedFlag = !0, this.onfinish = null, this._finishHandlers = [], this._effect = t, this._inEffect = this._effect._update(0), this._idle = !0, this._currentTimePending = !1
            }, t.Animation.prototype = {
                _ensureAlive: function() {
                    this.playbackRate < 0 && 0 === this.currentTime ? this._inEffect = this._effect._update(-1) : this._inEffect = this._effect._update(this.currentTime), this._inTimeline || !this._inEffect && this._finishedFlag || (this._inTimeline = !0, t.timeline._animations.push(this))
                },
                _tickCurrentTime: function(e, t) {
                    e != this._currentTime && (this._currentTime = e, this._isFinished && !t && (this._currentTime = this._playbackRate > 0 ? this._totalDuration : 0), this._ensureAlive())
                },
                get currentTime() {
                    return this._idle || this._currentTimePending ? null : this._currentTime
                },
                set currentTime(e) {
                    e = +e, isNaN(e) || (t.restart(), this._paused || null == this._startTime || (this._startTime = this._timeline.currentTime - e / this._playbackRate), this._currentTimePending = !1, this._currentTime != e && (this._idle && (this._idle = !1, this._paused = !0), this._tickCurrentTime(e, !0), t.applyDirtiedAnimation(this)))
                },
                get startTime() {
                    return this._startTime
                },
                set startTime(e) {
                    e = +e, isNaN(e) || this._paused || this._idle || (this._startTime = e, this._tickCurrentTime((this._timeline.currentTime - this._startTime) * this.playbackRate), t.applyDirtiedAnimation(this))
                },
                get playbackRate() {
                    return this._playbackRate
                },
                set playbackRate(e) {
                    if (e != this._playbackRate) {
                        var i = this.currentTime;
                        this._playbackRate = e, this._startTime = null, "paused" != this.playState && "idle" != this.playState && (this._finishedFlag = !1, this._idle = !1, this._ensureAlive(), t.applyDirtiedAnimation(this)), null != i && (this.currentTime = i)
                    }
                },
                get _isFinished() {
                    return !this._idle && (this._playbackRate > 0 && this._currentTime >= this._totalDuration || this._playbackRate < 0 && this._currentTime <= 0)
                },
                get _totalDuration() {
                    return this._effect._totalDuration
                },
                get playState() {
                    return this._idle ? "idle" : null == this._startTime && !this._paused && 0 != this.playbackRate || this._currentTimePending ? "pending" : this._paused ? "paused" : this._isFinished ? "finished" : "running"
                },
                _rewind: function() {
                    if (this._playbackRate >= 0)
                        this._currentTime = 0;
                    else {
                        if (!(this._totalDuration < 1 / 0))
                            throw new DOMException("Unable to rewind negative playback rate animation with infinite duration", "InvalidStateError");
                        this._currentTime = this._totalDuration
                    }
                },
                play: function() {
                    this._paused = !1, (this._isFinished || this._idle) && (this._rewind(), this._startTime = null), this._finishedFlag = !1, this._idle = !1, this._ensureAlive(), t.applyDirtiedAnimation(this)
                },
                pause: function() {
                    this._isFinished || this._paused || this._idle ? this._idle && (this._rewind(), this._idle = !1) : this._currentTimePending = !0, this._startTime = null, this._paused = !0
                },
                finish: function() {
                    this._idle || (this.currentTime = this._playbackRate > 0 ? this._totalDuration : 0, this._startTime = this._totalDuration - this.currentTime, this._currentTimePending = !1, t.applyDirtiedAnimation(this))
                },
                cancel: function() {
                    this._inEffect && (this._inEffect = !1, this._idle = !0, this._paused = !1, this._isFinished = !0, this._finishedFlag = !0, this._currentTime = 0, this._startTime = null, this._effect._update(null), t.applyDirtiedAnimation(this))
                },
                reverse: function() {
                    this.playbackRate *= -1, this.play()
                },
                addEventListener: function(e, t) {
                    "function" == typeof t && "finish" == e && this._finishHandlers.push(t)
                },
                removeEventListener: function(e, t) {
                    if ("finish" == e) {
                        var i = this._finishHandlers.indexOf(t);
                        i >= 0 && this._finishHandlers.splice(i, 1)
                    }
                },
                _fireEvents: function(e) {
                    if (this._isFinished) {
                        if (!this._finishedFlag) {
                            var t = new function(e, t, i) {
                                    this.target = e, this.currentTime = t, this.timelineTime = i, this.type = "finish", this.bubbles = !1, this.cancelable = !1, this.currentTarget = e, this.defaultPrevented = !1, this.eventPhase = Event.AT_TARGET, this.timeStamp = Date.now()
                                }(this, this._currentTime, e),
                                i = this._finishHandlers.concat(this.onfinish ? [this.onfinish] : []);
                            setTimeout(function() {
                                i.forEach(function(e) {
                                    e.call(t.target, t)
                                })
                            }, 0), this._finishedFlag = !0
                        }
                    } else
                        this._finishedFlag = !1
                },
                _tick: function(e, t) {
                    this._idle || this._paused || (null == this._startTime ? t && (this.startTime = e - this._currentTime / this.playbackRate) : this._isFinished || this._tickCurrentTime((e - this._startTime) * this.playbackRate)), t && (this._currentTimePending = !1, this._fireEvents(e))
                },
                get _needsTick() {
                    return this.playState in {
                            pending: 1,
                            running: 1
                        } || !this._finishedFlag
                },
                _targetAnimations: function() {
                    var e = this._effect._target;
                    return e._activeAnimations || (e._activeAnimations = []), e._activeAnimations
                },
                _markTarget: function() {
                    var e = this._targetAnimations();
                    -1 === e.indexOf(this) && e.push(this)
                },
                _unmarkTarget: function() {
                    var e = this._targetAnimations(),
                        t = e.indexOf(this);
                    -1 !== t && e.splice(t, 1)
                }
            }
        }(c, d), function(e, t, i) {
            function n(e) {
                var t = h;
                h = [], e < _.currentTime && (e = _.currentTime), _._animations.sort(r), _._animations = a(e, !0, _._animations)[0], t.forEach(function(t) {
                    t[1](e)
                }), s()
            }
            function r(e, t) {
                return e._sequenceNumber - t._sequenceNumber
            }
            function o() {
                this._animations = [], this.currentTime = window.performance && performance.now ? performance.now() : 0
            }
            function s() {
                f.forEach(function(e) {
                    e()
                }), f.length = 0
            }
            function a(e, i, n) {
                p = !0, d = !1, t.timeline.currentTime = e, u = !1;
                var r = [],
                    o = [],
                    s = [],
                    a = [];
                return n.forEach(function(t) {
                    t._tick(e, i), t._inEffect ? (o.push(t._effect), t._markTarget()) : (r.push(t._effect), t._unmarkTarget()), t._needsTick && (u = !0);
                    var n = t._inEffect || t._needsTick;
                    t._inTimeline = n, n ? s.push(t) : a.push(t)
                }), f.push.apply(f, r), f.push.apply(f, o), u && requestAnimationFrame(function() {}), p = !1, [s, a]
            }
            var l = window.requestAnimationFrame,
                h = [],
                c = 0;
            window.requestAnimationFrame = function(e) {
                var t = c++;
                return 0 == h.length && l(n), h.push([t, e]), t
            }, window.cancelAnimationFrame = function(e) {
                h.forEach(function(t) {
                    t[0] == e && (t[1] = function() {})
                })
            }, o.prototype = {
                _play: function(i) {
                    i._timing = e.normalizeTimingInput(i.timing);
                    var n = new t.Animation(i);
                    return n._idle = !1, n._timeline = this, this._animations.push(n), t.restart(), t.applyDirtiedAnimation(n), n
                }
            };
            var u = !1,
                d = !1;
            t.restart = function() {
                return u || (u = !0, requestAnimationFrame(function() {}), d = !0), d
            }, t.applyDirtiedAnimation = function(e) {
                if (!p) {
                    e._markTarget();
                    var i = e._targetAnimations();
                    i.sort(r), a(t.timeline.currentTime, !1, i.slice())[1].forEach(function(e) {
                        var t = _._animations.indexOf(e);
                        -1 !== t && _._animations.splice(t, 1)
                    }), s()
                }
            };
            var f = [],
                p = !1,
                _ = new o;
            t.timeline = _
        }(c, d), function(e) {
            function t(e, t) {
                var i = e.exec(t);
                if (i)
                    return [i = e.ignoreCase ? i[0].toLowerCase() : i[0], t.substr(i.length)]
            }
            function i(e, t) {
                var i = e(t = t.replace(/^\s*/, ""));
                if (i)
                    return [i[0], i[1].replace(/^\s*/, "")]
            }
            function n(e, t, i, n, r) {
                for (var o = [], s = [], a = [], l = function(e, t) {
                        for (var i = e, n = t; i && n;)
                            i > n ? i %= n : n %= i;
                        return e * t / (i + n)
                    }(n.length, r.length), h = 0; h < l; h++) {
                    var c = t(n[h % n.length], r[h % r.length]);
                    if (!c)
                        return;
                    o.push(c[0]), s.push(c[1]), a.push(c[2])
                }
                return [o, s, function(t) {
                    var n = t.map(function(e, t) {
                        return a[t](e)
                    }).join(i);
                    return e ? e(n) : n
                }]
            }
            e.consumeToken = t, e.consumeTrimmed = i, e.consumeRepeated = function(e, n, r) {
                e = i.bind(null, e);
                for (var o = [];;) {
                    var s = e(r);
                    if (!s)
                        return [o, r];
                    if (o.push(s[0]), !(s = t(n, r = s[1])) || "" == s[1])
                        return [o, r];
                    r = s[1]
                }
            }, e.consumeParenthesised = function(e, t) {
                for (var i = 0, n = 0; n < t.length && (!/\s|,/.test(t[n]) || 0 != i); n++)
                    if ("(" == t[n])
                        i++;
                    else if (")" == t[n] && (0 == --i && n++, i <= 0))
                        break;
                var r = e(t.substr(0, n));
                return void 0 == r ? void 0 : [r, t.substr(n)]
            }, e.ignore = function(e) {
                return function(t) {
                    var i = e(t);
                    return i && (i[0] = void 0), i
                }
            }, e.optional = function(e, t) {
                return function(i) {
                    return e(i) || [t, i]
                }
            }, e.consumeList = function(t, i) {
                for (var n = [], r = 0; r < t.length; r++) {
                    var o = e.consumeTrimmed(t[r], i);
                    if (!o || "" == o[0])
                        return;
                    void 0 !== o[0] && n.push(o[0]), i = o[1]
                }
                if ("" == i)
                    return n
            }, e.mergeNestedRepeated = n.bind(null, null), e.mergeWrappedNestedRepeated = n, e.mergeList = function(e, t, i) {
                for (var n = [], r = [], o = [], s = 0, a = 0; a < i.length; a++)
                    if ("function" == typeof i[a]) {
                        var l = i[a](e[s], t[s++]);
                        n.push(l[0]), r.push(l[1]), o.push(l[2])
                    } else
                        !function(e) {
                            n.push(!1), r.push(!1), o.push(function() {
                                return i[e]
                            })
                        }(a);
                return [n, r, function(e) {
                    for (var t = "", i = 0; i < e.length; i++)
                        t += o[i](e[i]);
                    return t
                }]
            }
        }(d), function(e) {
            function t(t) {
                var i = {
                        inset: !1,
                        lengths: [],
                        color: null
                    },
                    n = e.consumeRepeated(function(t) {
                        var n;
                        return (n = e.consumeToken(/^inset/i, t)) ? (i.inset = !0, n) : (n = e.consumeLengthOrPercent(t)) ? (i.lengths.push(n[0]), n) : (n = e.consumeColor(t)) ? (i.color = n[0], n) : void 0
                    }, /^/, t);
                if (n && n[0].length)
                    return [i, n[1]]
            }
            var i = function(t, i, n, r) {
                function o(e) {
                    return {
                        inset: e,
                        color: [0, 0, 0, 0],
                        lengths: [{
                            px: 0
                        }, {
                            px: 0
                        }, {
                            px: 0
                        }, {
                            px: 0
                        }]
                    }
                }
                for (var s = [], a = [], l = 0; l < n.length || l < r.length; l++) {
                    var h = n[l] || o(r[l].inset),
                        c = r[l] || o(n[l].inset);
                    s.push(h), a.push(c)
                }
                return e.mergeNestedRepeated(t, i, s, a)
            }.bind(null, function(t, i) {
                for (; t.lengths.length < Math.max(t.lengths.length, i.lengths.length);)
                    t.lengths.push({
                        px: 0
                    });
                for (; i.lengths.length < Math.max(t.lengths.length, i.lengths.length);)
                    i.lengths.push({
                        px: 0
                    });
                if (t.inset == i.inset && !!t.color == !!i.color) {
                    for (var n, r = [], o = [[], 0], s = [[], 0], a = 0; a < t.lengths.length; a++) {
                        var l = e.mergeDimensions(t.lengths[a], i.lengths[a], 2 == a);
                        o[0].push(l[0]), s[0].push(l[1]), r.push(l[2])
                    }
                    if (t.color && i.color) {
                        var h = e.mergeColors(t.color, i.color);
                        o[1] = h[0], s[1] = h[1], n = h[2]
                    }
                    return [o, s, function(e) {
                        for (var i = t.inset ? "inset " : " ", o = 0; o < r.length; o++)
                            i += r[o](e[0][o]) + " ";
                        return n && (i += n(e[1])), i
                    }]
                }
            }, ", ");
            e.addPropertiesHandler(function(i) {
                var n = e.consumeRepeated(t, /^,/, i);
                if (n && "" == n[1])
                    return n[0]
            }, i, ["box-shadow", "text-shadow"])
        }(d), function(e, t) {
            function i(e) {
                return e.toFixed(3).replace(".000", "")
            }
            function n(e, t, i) {
                return Math.min(t, Math.max(e, i))
            }
            function r(e) {
                if (/^\s*[-+]?(\d*\.)?\d+\s*$/.test(e))
                    return Number(e)
            }
            function o(e, t) {
                return function(r, o) {
                    return [r, o, function(r) {
                        return i(n(e, t, r))
                    }]
                }
            }
            e.clamp = n, e.addPropertiesHandler(r, o(0, 1 / 0), ["border-image-width", "line-height"]), e.addPropertiesHandler(r, o(0, 1), ["opacity", "shape-image-threshold"]), e.addPropertiesHandler(r, function(e, t) {
                if (0 != e)
                    return o(0, 1 / 0)(e, t)
            }, ["flex-grow", "flex-shrink"]), e.addPropertiesHandler(r, function(e, t) {
                return [e, t, function(e) {
                    return Math.round(n(1, 1 / 0, e))
                }]
            }, ["orphans", "widows"]), e.addPropertiesHandler(r, function(e, t) {
                return [e, t, Math.round]
            }, ["z-index"]), e.parseNumber = r, e.mergeNumbers = function(e, t) {
                return [e, t, i]
            }, e.numberToString = i
        }(d), d.addPropertiesHandler(String, function(e, t) {
            if ("visible" == e || "visible" == t)
                return [0, 1, function(i) {
                    return i <= 0 ? e : i >= 1 ? t : "visible"
                }]
        }, ["visibility"]), function(e, t) {
            function i(e) {
                e = e.trim(), o.fillStyle = "#000", o.fillStyle = e;
                var t = o.fillStyle;
                if (o.fillStyle = "#fff", o.fillStyle = e, t == o.fillStyle) {
                    o.fillRect(0, 0, 1, 1);
                    var i = o.getImageData(0, 0, 1, 1).data;
                    o.clearRect(0, 0, 1, 1);
                    var n = i[3] / 255;
                    return [i[0] * n, i[1] * n, i[2] * n, n]
                }
            }
            function n(t, i) {
                return [t, i, function(t) {
                    function i(e) {
                        return Math.max(0, Math.min(255, e))
                    }
                    if (t[3])
                        for (var n = 0; n < 3; n++)
                            t[n] = Math.round(i(t[n] / t[3]));
                    return t[3] = e.numberToString(e.clamp(0, 1, t[3])), "rgba(" + t.join(",") + ")"
                }]
            }
            var r = document.createElementNS("http://www.w3.org/1999/xhtml", "canvas");
            r.width = r.height = 1;
            var o = r.getContext("2d");
            e.addPropertiesHandler(i, n, ["background-color", "border-bottom-color", "border-left-color", "border-right-color", "border-top-color", "color", "outline-color", "text-decoration-color"]), e.consumeColor = e.consumeParenthesised.bind(null, i), e.mergeColors = n
        }(d), function(a, b) {
            function c(a, b) {
                if (b = b.trim().toLowerCase(), "0" == b && "px".search(a) >= 0)
                    return {
                        px: 0
                    };
                if (/^[^(]*$|^calc/.test(b)) {
                    b = b.replace(/calc\(/g, "(");
                    var c = {};
                    b = b.replace(a, function(e) {
                        return c[e] = null, "U" + e
                    });
                    for (var d = "U(" + a.source + ")", e = b.replace(/[-+]?(\d*\.)?\d+/g, "N").replace(new RegExp("N" + d, "g"), "D").replace(/\s[+-]\s/g, "O").replace(/\s/g, ""), f = [/N\*(D)/g, /(N|D)[*\/]N/g, /(N|D)O\1/g, /\((N|D)\)/g], g = 0; g < f.length;)
                        f[g].test(e) ? (e = e.replace(f[g], "$1"), g = 0) : g++;
                    if ("D" == e) {
                        for (var h in c) {
                            var i = eval(b.replace(new RegExp("U" + h, "g"), "").replace(new RegExp(d, "g"), "*0"));
                            if (!isFinite(i))
                                return;
                            c[h] = i
                        }
                        return c
                    }
                }
            }
            function d(t, i) {
                return e(t, i, !0)
            }
            function e(e, t, i) {
                var n,
                    r = [];
                for (n in e)
                    r.push(n);
                for (n in t)
                    r.indexOf(n) < 0 && r.push(n);
                return e = r.map(function(t) {
                    return e[t] || 0
                }), t = r.map(function(e) {
                    return t[e] || 0
                }), [e, t, function(e) {
                    var t = e.map(function(t, n) {
                        return 1 == e.length && i && (t = Math.max(t, 0)), a.numberToString(t) + r[n]
                    }).join(" + ");
                    return e.length > 1 ? "calc(" + t + ")" : t
                }]
            }
            var f = "px|em|ex|ch|rem|vw|vh|vmin|vmax|cm|mm|in|pt|pc",
                g = c.bind(null, new RegExp(f, "g")),
                h = c.bind(null, new RegExp(f + "|%", "g")),
                i = c.bind(null, /deg|rad|grad|turn/g);
            a.parseLength = g, a.parseLengthOrPercent = h, a.consumeLengthOrPercent = a.consumeParenthesised.bind(null, h), a.parseAngle = i, a.mergeDimensions = e;
            var j = a.consumeParenthesised.bind(null, g),
                k = a.consumeRepeated.bind(void 0, j, /^/),
                l = a.consumeRepeated.bind(void 0, k, /^,/);
            a.consumeSizePairList = l;
            var m = function(e) {
                    var t = l(e);
                    if (t && "" == t[1])
                        return t[0]
                },
                n = a.mergeNestedRepeated.bind(void 0, d, " "),
                o = a.mergeNestedRepeated.bind(void 0, n, ",");
            a.mergeNonNegativeSizePair = n, a.addPropertiesHandler(m, o, ["background-size"]), a.addPropertiesHandler(h, d, ["border-bottom-width", "border-image-width", "border-left-width", "border-right-width", "border-top-width", "flex-basis", "font-size", "height", "line-height", "max-height", "max-width", "outline-width", "width"]), a.addPropertiesHandler(h, e, ["border-bottom-left-radius", "border-bottom-right-radius", "border-top-left-radius", "border-top-right-radius", "bottom", "left", "letter-spacing", "margin-bottom", "margin-left", "margin-right", "margin-top", "min-height", "min-width", "outline-offset", "padding-bottom", "padding-left", "padding-right", "padding-top", "perspective", "right", "shape-margin", "text-indent", "top", "vertical-align", "word-spacing"])
        }(d, f), function(e, t) {
            function i(t) {
                return e.consumeLengthOrPercent(t) || e.consumeToken(/^auto/, t)
            }
            function n(t) {
                var n = e.consumeList([e.ignore(e.consumeToken.bind(null, /^rect/)), e.ignore(e.consumeToken.bind(null, /^\(/)), e.consumeRepeated.bind(null, i, /^,/), e.ignore(e.consumeToken.bind(null, /^\)/))], t);
                if (n && 4 == n[0].length)
                    return n[0]
            }
            var r = e.mergeWrappedNestedRepeated.bind(null, function(e) {
                return "rect(" + e + ")"
            }, function(t, i) {
                return "auto" == t || "auto" == i ? [!0, !1, function(n) {
                    var r = n ? t : i;
                    if ("auto" == r)
                        return "auto";
                    var o = e.mergeDimensions(r, r);
                    return o[2](o[0])
                }] : e.mergeDimensions(t, i)
            }, ", ");
            e.parseBox = n, e.mergeBoxes = r, e.addPropertiesHandler(n, r, ["clip"])
        }(d), function(e, t) {
            function i(e) {
                return function(t) {
                    var i = 0;
                    return e.map(function(e) {
                        return e === l ? t[i++] : e
                    })
                }
            }
            function n(e) {
                return e
            }
            function r(e) {
                return e.toFixed(6).replace(".000000", "")
            }
            function o(t, i) {
                if (t.decompositionPair !== i) {
                    t.decompositionPair = i;
                    var n = e.makeMatrixDecomposition(t)
                }
                if (i.decompositionPair !== t) {
                    i.decompositionPair = t;
                    var o = e.makeMatrixDecomposition(i)
                }
                return null == n[0] || null == o[0] ? [[!1], [!0], function(e) {
                    return e ? i[0].d : t[0].d
                }] : (n[0].push(0), o[0].push(1), [n, o, function(t) {
                    var i = e.quat(n[0][3], o[0][3], t[5]);
                    return e.composeMatrix(t[0], t[1], t[2], i, t[4]).map(r).join(",")
                }])
            }
            function s(e) {
                return e.replace(/[xy]/, "")
            }
            function a(e) {
                return e.replace(/(x|y|z|3d)?$/, "3d")
            }
            var l = null,
                h = {
                    px: 0
                },
                c = {
                    deg: 0
                },
                u = {
                    matrix: ["NNNNNN", [l, l, 0, 0, l, l, 0, 0, 0, 0, 1, 0, l, l, 0, 1], n],
                    matrix3d: ["NNNNNNNNNNNNNNNN", n],
                    rotate: ["A"],
                    rotatex: ["A"],
                    rotatey: ["A"],
                    rotatez: ["A"],
                    rotate3d: ["NNNA"],
                    perspective: ["L"],
                    scale: ["Nn", i([l, l, 1]), n],
                    scalex: ["N", i([l, 1, 1]), i([l, 1])],
                    scaley: ["N", i([1, l, 1]), i([1, l])],
                    scalez: ["N", i([1, 1, l])],
                    scale3d: ["NNN", n],
                    skew: ["Aa", null, n],
                    skewx: ["A", null, i([l, c])],
                    skewy: ["A", null, i([c, l])],
                    translate: ["Tt", i([l, l, h]), n],
                    translatex: ["T", i([l, h, h]), i([l, h])],
                    translatey: ["T", i([h, l, h]), i([h, l])],
                    translatez: ["L", i([h, h, l])],
                    translate3d: ["TTL", n]
                };
            e.addPropertiesHandler(function(t) {
                if ("none" == (t = t.toLowerCase().trim()))
                    return [];
                for (var i, n = /\s*(\w+)\(([^)]*)\)/g, r = [], o = 0; i = n.exec(t);) {
                    if (i.index != o)
                        return;
                    o = i.index + i[0].length;
                    var s = i[1],
                        a = u[s];
                    if (!a)
                        return;
                    var l = i[2].split(","),
                        d = a[0];
                    if (d.length < l.length)
                        return;
                    for (var f = [], p = 0; p < d.length; p++) {
                        var _,
                            m = l[p],
                            y = d[p];
                        if (void 0 === (_ = m ? {
                            A: function(t) {
                                return "0" == t.trim() ? c : e.parseAngle(t)
                            },
                            N: e.parseNumber,
                            T: e.parseLengthOrPercent,
                            L: e.parseLength
                        }[y.toUpperCase()](m) : {
                            a: c,
                            n: f[0],
                            t: h
                        }[y]))
                            return;
                        f.push(_)
                    }
                    if (r.push({
                        t: s,
                        d: f
                    }), n.lastIndex == t.length)
                        return r
                }
            }, function(t, i) {
                var n = e.makeMatrixDecomposition && !0,
                    r = !1;
                if (!t.length || !i.length) {
                    t.length || (r = !0, t = i, i = []);
                    for (var l = 0; l < t.length; l++) {
                        var h = t[l].t,
                            c = t[l].d,
                            d = "scale" == h.substr(0, 5) ? 1 : 0;
                        i.push({
                            t: h,
                            d: c.map(function(e) {
                                if ("number" == typeof e)
                                    return d;
                                var t = {};
                                for (var i in e)
                                    t[i] = d;
                                return t
                            })
                        })
                    }
                }
                var f = function(e, t) {
                        return "perspective" == e && "perspective" == t || ("matrix" == e || "matrix3d" == e) && ("matrix" == t || "matrix3d" == t)
                    },
                    p = [],
                    _ = [],
                    m = [];
                if (t.length != i.length) {
                    if (!n)
                        return;
                    p = [(S = o(t, i))[0]], _ = [S[1]], m = [["matrix", [S[2]]]]
                } else
                    for (l = 0; l < t.length; l++) {
                        var y = t[l].t,
                            v = i[l].t,
                            g = t[l].d,
                            b = i[l].d,
                            P = u[y],
                            C = u[v];
                        if (f(y, v)) {
                            if (!n)
                                return;
                            var S = o([t[l]], [i[l]]);
                            p.push(S[0]), _.push(S[1]), m.push(["matrix", [S[2]]])
                        } else {
                            if (y == v)
                                h = y;
                            else if (P[2] && C[2] && s(y) == s(v))
                                h = s(y), g = P[2](g), b = C[2](b);
                            else {
                                if (!P[1] || !C[1] || a(y) != a(v)) {
                                    if (!n)
                                        return;
                                    p = [(S = o(t, i))[0]], _ = [S[1]], m = [["matrix", [S[2]]]];
                                    break
                                }
                                h = a(y), g = P[1](g), b = C[1](b)
                            }
                            for (var E = [], A = [], w = [], T = 0; T < g.length; T++)
                                S = ("number" == typeof g[T] ? e.mergeNumbers : e.mergeDimensions)(g[T], b[T]), E[T] = S[0], A[T] = S[1], w.push(S[2]);
                            p.push(E), _.push(A), m.push([h, w])
                        }
                    }
                if (r) {
                    var x = p;
                    p = _, _ = x
                }
                return [p, _, function(e) {
                    return e.map(function(e, t) {
                        var i = e.map(function(e, i) {
                            return m[t][1][i](e)
                        }).join(",");
                        return "matrix" == m[t][0] && 16 == i.split(",").length && (m[t][0] = "matrix3d"), m[t][0] + "(" + i + ")"
                    }).join(" ")
                }]
            }, ["transform"])
        }(d), function(e, t) {
            function i(e, t) {
                t.concat([e]).forEach(function(t) {
                    t in document.documentElement.style && (n[e] = t)
                })
            }
            var n = {};
            i("transform", ["webkitTransform", "msTransform"]), i("transformOrigin", ["webkitTransformOrigin"]), i("perspective", ["webkitPerspective"]), i("perspectiveOrigin", ["webkitPerspectiveOrigin"]), e.propertyName = function(e) {
                return n[e] || e
            }
        }(d)
    }(), function() {
        if (void 0 === document.createElement("div").animate([]).oncancel) {
            if (window.performance && performance.now)
                var e = function() {
                    return performance.now()
                };
            else
                e = function() {
                    return Date.now()
                };
            var t = window.Element.prototype.animate;
            window.Element.prototype.animate = function(i, n) {
                var r = t.call(this, i, n);
                r._cancelHandlers = [], r.oncancel = null;
                var o = r.cancel;
                r.cancel = function() {
                    o.call(this);
                    var t = new function(e, t, i) {
                            this.target = e, this.currentTime = null, this.timelineTime = i, this.type = "cancel", this.bubbles = !1, this.cancelable = !1, this.currentTarget = e, this.defaultPrevented = !1, this.eventPhase = Event.AT_TARGET, this.timeStamp = Date.now()
                        }(this, null, e()),
                        i = this._cancelHandlers.concat(this.oncancel ? [this.oncancel] : []);
                    setTimeout(function() {
                        i.forEach(function(e) {
                            e.call(t.target, t)
                        })
                    }, 0)
                };
                var s = r.addEventListener;
                r.addEventListener = function(e, t) {
                    "function" == typeof t && "cancel" == e ? this._cancelHandlers.push(t) : s.call(this, e, t)
                };
                var a = r.removeEventListener;
                return r.removeEventListener = function(e, t) {
                    if ("cancel" == e) {
                        var i = this._cancelHandlers.indexOf(t);
                        i >= 0 && this._cancelHandlers.splice(i, 1)
                    } else
                        a.call(this, e, t)
                }, r
            }
        }
    }(), function(e) {
        var t = document.documentElement,
            i = null,
            n = !1;
        try {
            var r = "0" == getComputedStyle(t).getPropertyValue("opacity") ? "1" : "0";
            (i = t.animate({
                opacity: [r, r]
            }, {
                duration: 1
            })).currentTime = 0, n = getComputedStyle(t).getPropertyValue("opacity") == r
        } catch (e) {} finally {
            i && i.cancel()
        }
        if (!n) {
            var o = window.Element.prototype.animate;
            window.Element.prototype.animate = function(t, i) {
                return window.Symbol && Symbol.iterator && Array.prototype.from && t[Symbol.iterator] && (t = Array.from(t)), Array.isArray(t) || null === t || (t = e.convertToArrayForm(t)), o.call(this, t, i)
            }
        }
    }(c), function(e, t, i) {
        function n(e) {
            var i = t.timeline;
            i.currentTime = e, i._discardAnimations(), 0 == i._animations.length ? o = !1 : requestAnimationFrame(n)
        }
        var r = window.requestAnimationFrame;
        window.requestAnimationFrame = function(e) {
            return r(function(i) {
                t.timeline._updateAnimationsPromises(), e(i), t.timeline._updateAnimationsPromises()
            })
        }, t.AnimationTimeline = function() {
            this._animations = [], this.currentTime = void 0
        }, t.AnimationTimeline.prototype = {
            getAnimations: function() {
                return this._discardAnimations(), this._animations.slice()
            },
            _updateAnimationsPromises: function() {
                t.animationsWithPromises = t.animationsWithPromises.filter(function(e) {
                    return e._updatePromises()
                })
            },
            _discardAnimations: function() {
                this._updateAnimationsPromises(), this._animations = this._animations.filter(function(e) {
                    return "finished" != e.playState && "idle" != e.playState
                })
            },
            _play: function(e) {
                var i = new t.Animation(e, this);
                return this._animations.push(i), t.restartWebAnimationsNextTick(), i._updatePromises(), i._animation.play(), i._updatePromises(), i
            },
            play: function(e) {
                return e && e.remove(), this._play(e)
            }
        };
        var o = !1;
        t.restartWebAnimationsNextTick = function() {
            o || (o = !0, requestAnimationFrame(n))
        };
        var s = new t.AnimationTimeline;
        t.timeline = s;
        try {
            Object.defineProperty(window.document, "timeline", {
                configurable: !0,
                get: function() {
                    return s
                }
            })
        } catch (e) {}
        try {
            window.document.timeline = s
        } catch (e) {}
    }(0, e), function(e, t, i) {
        t.animationsWithPromises = [], t.Animation = function(t, i) {
            if (this.id = "", t && t._id && (this.id = t._id), this.effect = t, t && (t._animation = this), !i)
                throw new Error("Animation with null timeline is not supported");
            this._timeline = i, this._sequenceNumber = e.sequenceNumber++, this._holdTime = 0, this._paused = !1, this._isGroup = !1, this._animation = null, this._childAnimations = [], this._callback = null, this._oldPlayState = "idle", this._rebuildUnderlyingAnimation(), this._animation.cancel(), this._updatePromises()
        }, t.Animation.prototype = {
            _updatePromises: function() {
                var e = this._oldPlayState,
                    t = this.playState;
                return this._readyPromise && t !== e && ("idle" == t ? (this._rejectReadyPromise(), this._readyPromise = void 0) : "pending" == e ? this._resolveReadyPromise() : "pending" == t && (this._readyPromise = void 0)), this._finishedPromise && t !== e && ("idle" == t ? (this._rejectFinishedPromise(), this._finishedPromise = void 0) : "finished" == t ? this._resolveFinishedPromise() : "finished" == e && (this._finishedPromise = void 0)), this._oldPlayState = this.playState, this._readyPromise || this._finishedPromise
            },
            _rebuildUnderlyingAnimation: function() {
                this._updatePromises();
                var e,
                    i,
                    n,
                    r,
                    o = !!this._animation;
                o && (e = this.playbackRate, i = this._paused, n = this.startTime, r = this.currentTime, this._animation.cancel(), this._animation._wrapper = null, this._animation = null), (!this.effect || this.effect instanceof window.KeyframeEffect) && (this._animation = t.newUnderlyingAnimationForKeyframeEffect(this.effect), t.bindAnimationForKeyframeEffect(this)), (this.effect instanceof window.SequenceEffect || this.effect instanceof window.GroupEffect) && (this._animation = t.newUnderlyingAnimationForGroup(this.effect), t.bindAnimationForGroup(this)), this.effect && this.effect._onsample && t.bindAnimationForCustomEffect(this), o && (1 != e && (this.playbackRate = e), null !== n ? this.startTime = n : null !== r ? this.currentTime = r : null !== this._holdTime && (this.currentTime = this._holdTime), i && this.pause()), this._updatePromises()
            },
            _updateChildren: function() {
                if (this.effect && "idle" != this.playState) {
                    var e = this.effect._timing.delay;
                    this._childAnimations.forEach(function(i) {
                        this._arrangeChildren(i, e), this.effect instanceof window.SequenceEffect && (e += t.groupChildDuration(i.effect))
                    }.bind(this))
                }
            },
            _setExternalAnimation: function(e) {
                if (this.effect && this._isGroup)
                    for (var t = 0; t < this.effect.children.length; t++)
                        this.effect.children[t]._animation = e, this._childAnimations[t]._setExternalAnimation(e)
            },
            _constructChildAnimations: function() {
                if (this.effect && this._isGroup) {
                    var e = this.effect._timing.delay;
                    this._removeChildAnimations(), this.effect.children.forEach(function(i) {
                        var n = t.timeline._play(i);
                        this._childAnimations.push(n), n.playbackRate = this.playbackRate, this._paused && n.pause(), i._animation = this.effect._animation, this._arrangeChildren(n, e), this.effect instanceof window.SequenceEffect && (e += t.groupChildDuration(i))
                    }.bind(this))
                }
            },
            _arrangeChildren: function(e, t) {
                null === this.startTime ? e.currentTime = this.currentTime - t / this.playbackRate : e.startTime !== this.startTime + t / this.playbackRate && (e.startTime = this.startTime + t / this.playbackRate)
            },
            get timeline() {
                return this._timeline
            },
            get playState() {
                return this._animation ? this._animation.playState : "idle"
            },
            get finished() {
                return window.Promise ? (this._finishedPromise || (-1 == t.animationsWithPromises.indexOf(this) && t.animationsWithPromises.push(this), this._finishedPromise = new Promise(function(e, t) {
                    this._resolveFinishedPromise = function() {
                        e(this)
                    }, this._rejectFinishedPromise = function() {
                        t({
                            type: DOMException.ABORT_ERR,
                            name: "AbortError"
                        })
                    }
                }.bind(this)), "finished" == this.playState && this._resolveFinishedPromise()), this._finishedPromise) : null
            },
            get ready() {
                return window.Promise ? (this._readyPromise || (-1 == t.animationsWithPromises.indexOf(this) && t.animationsWithPromises.push(this), this._readyPromise = new Promise(function(e, t) {
                    this._resolveReadyPromise = function() {
                        e(this)
                    }, this._rejectReadyPromise = function() {
                        t({
                            type: DOMException.ABORT_ERR,
                            name: "AbortError"
                        })
                    }
                }.bind(this)), "pending" !== this.playState && this._resolveReadyPromise()), this._readyPromise) : null
            },
            get onfinish() {
                return this._animation.onfinish
            },
            set onfinish(e) {
                this._animation.onfinish = "function" == typeof e ? function(t) {
                    t.target = this, e.call(this, t)
                }.bind(this) : e
            },
            get oncancel() {
                return this._animation.oncancel
            },
            set oncancel(e) {
                this._animation.oncancel = "function" == typeof e ? function(t) {
                    t.target = this, e.call(this, t)
                }.bind(this) : e
            },
            get currentTime() {
                this._updatePromises();
                var e = this._animation.currentTime;
                return this._updatePromises(), e
            },
            set currentTime(e) {
                this._updatePromises(), this._animation.currentTime = isFinite(e) ? e : Math.sign(e) * Number.MAX_VALUE, this._register(), this._forEachChild(function(t, i) {
                    t.currentTime = e - i
                }), this._updatePromises()
            },
            get startTime() {
                return this._animation.startTime
            },
            set startTime(e) {
                this._updatePromises(), this._animation.startTime = isFinite(e) ? e : Math.sign(e) * Number.MAX_VALUE, this._register(), this._forEachChild(function(t, i) {
                    t.startTime = e + i
                }), this._updatePromises()
            },
            get playbackRate() {
                return this._animation.playbackRate
            },
            set playbackRate(e) {
                this._updatePromises();
                var t = this.currentTime;
                this._animation.playbackRate = e, this._forEachChild(function(t) {
                    t.playbackRate = e
                }), null !== t && (this.currentTime = t), this._updatePromises()
            },
            play: function() {
                this._updatePromises(), this._paused = !1, this._animation.play(), -1 == this._timeline._animations.indexOf(this) && this._timeline._animations.push(this), this._register(), t.awaitStartTime(this), this._forEachChild(function(e) {
                    var t = e.currentTime;
                    e.play(), e.currentTime = t
                }), this._updatePromises()
            },
            pause: function() {
                this._updatePromises(), this.currentTime && (this._holdTime = this.currentTime), this._animation.pause(), this._register(), this._forEachChild(function(e) {
                    e.pause()
                }), this._paused = !0, this._updatePromises()
            },
            finish: function() {
                this._updatePromises(), this._animation.finish(), this._register(), this._updatePromises()
            },
            cancel: function() {
                this._updatePromises(), this._animation.cancel(), this._register(), this._removeChildAnimations(), this._updatePromises()
            },
            reverse: function() {
                this._updatePromises();
                var e = this.currentTime;
                this._animation.reverse(), this._forEachChild(function(e) {
                    e.reverse()
                }), null !== e && (this.currentTime = e), this._updatePromises()
            },
            addEventListener: function(e, t) {
                var i = t;
                "function" == typeof t && (i = function(e) {
                    e.target = this, t.call(this, e)
                }.bind(this), t._wrapper = i), this._animation.addEventListener(e, i)
            },
            removeEventListener: function(e, t) {
                this._animation.removeEventListener(e, t && t._wrapper || t)
            },
            _removeChildAnimations: function() {
                for (; this._childAnimations.length;)
                    this._childAnimations.pop().cancel()
            },
            _forEachChild: function(t) {
                var i = 0;
                if (this.effect.children && this._childAnimations.length < this.effect.children.length && this._constructChildAnimations(), this._childAnimations.forEach(function(e) {
                    t.call(this, e, i), this.effect instanceof window.SequenceEffect && (i += e.effect.activeDuration)
                }.bind(this)), "pending" != this.playState) {
                    var n = this.effect._timing,
                        r = this.currentTime;
                    null !== r && (r = e.calculateIterationProgress(e.calculateActiveDuration(n), r, n)), (null == r || isNaN(r)) && this._removeChildAnimations()
                }
            }
        }, window.Animation = t.Animation
    }(c, e), function(e, t, i) {
        function n() {
            for (var e = !1; a.length;)
                a.shift()._updateChildren(), e = !0;
            return e
        }
        var r = function(e) {
            if (e._animation = void 0, e instanceof window.SequenceEffect || e instanceof window.GroupEffect)
                for (var t = 0; t < e.children.length; t++)
                    r(e.children[t])
        };
        t.removeMulti = function(e) {
            for (var t = [], i = 0; i < e.length; i++) {
                var n = e[i];
                n._parent ? (-1 == t.indexOf(n._parent) && t.push(n._parent), n._parent.children.splice(n._parent.children.indexOf(n), 1), n._parent = null, r(n)) : n._animation && n._animation.effect == n && (n._animation.cancel(), n._animation.effect = new KeyframeEffect(null, []), n._animation._callback && (n._animation._callback._animation = null), n._animation._rebuildUnderlyingAnimation(), r(n))
            }
            for (i = 0; i < t.length; i++)
                t[i]._rebuild()
        }, t.KeyframeEffect = function(t, i, n, r) {
            return this.target = t, this._parent = null, n = e.numericTimingToObject(n), this._timingInput = e.cloneTimingInput(n), this._timing = e.normalizeTimingInput(n), this.timing = e.makeTiming(n, !1, this), this.timing._effect = this, "function" == typeof i ? (e.deprecated("Custom KeyframeEffect", "2015-06-22", "Use KeyframeEffect.onsample instead."), this._normalizedKeyframes = i) : this._normalizedKeyframes = new function(t) {
                this._frames = e.normalizeKeyframes(t)
            }(i), this._keyframes = i, this.activeDuration = e.calculateActiveDuration(this._timing), this._id = r, this
        }, t.KeyframeEffect.prototype = {
            getFrames: function() {
                return "function" == typeof this._normalizedKeyframes ? this._normalizedKeyframes : this._normalizedKeyframes._frames
            },
            set onsample(e) {
                if ("function" == typeof this.getFrames())
                    throw new Error("Setting onsample on custom effect KeyframeEffect is not supported.");
                this._onsample = e, this._animation && this._animation._rebuildUnderlyingAnimation()
            },
            get parent() {
                return this._parent
            },
            clone: function() {
                if ("function" == typeof this.getFrames())
                    throw new Error("Cloning custom effects is not supported.");
                var t = new KeyframeEffect(this.target, [], e.cloneTimingInput(this._timingInput), this._id);
                return t._normalizedKeyframes = this._normalizedKeyframes, t._keyframes = this._keyframes, t
            },
            remove: function() {
                t.removeMulti([this])
            }
        };
        var o = Element.prototype.animate;
        Element.prototype.animate = function(e, i) {
            var n = "";
            return i && i.id && (n = i.id), t.timeline._play(new t.KeyframeEffect(this, e, i, n))
        };
        var s = document.createElementNS("http://www.w3.org/1999/xhtml", "div");
        t.newUnderlyingAnimationForKeyframeEffect = function(e) {
            if (e) {
                var t = e.target || s;
                "function" == typeof (i = e._keyframes) && (i = []), (n = e._timingInput).id = e._id
            } else {
                t = s;
                var i = [],
                    n = 0
            }
            return o.apply(t, [i, n])
        }, t.bindAnimationForKeyframeEffect = function(e) {
            e.effect && "function" == typeof e.effect._normalizedKeyframes && t.bindAnimationForCustomEffect(e)
        };
        var a = [];
        t.awaitStartTime = function(e) {
            null === e.startTime && e._isGroup && (0 == a.length && requestAnimationFrame(n), a.push(e))
        };
        var l = window.getComputedStyle;
        Object.defineProperty(window, "getComputedStyle", {
            configurable: !0,
            enumerable: !0,
            value: function() {
                t.timeline._updateAnimationsPromises();
                var e = l.apply(this, arguments);
                return n() && (e = l.apply(this, arguments)), t.timeline._updateAnimationsPromises(), e
            }
        }), window.KeyframeEffect = t.KeyframeEffect, window.Element.prototype.getAnimations = function() {
            return document.timeline.getAnimations().filter(function(e) {
                return null !== e.effect && e.effect.target == this
            }.bind(this))
        }
    }(c, e), function(e, t, i) {
        function n(e) {
            e._registered || (e._registered = !0, s.push(e), a || (a = !0, requestAnimationFrame(r)))
        }
        function r(e) {
            var t = s;
            s = [], t.sort(function(e, t) {
                return e._sequenceNumber - t._sequenceNumber
            }), t = t.filter(function(e) {
                e();
                var t = e._animation ? e._animation.playState : "idle";
                return "running" != t && "pending" != t && (e._registered = !1), e._registered
            }), s.push.apply(s, t), s.length ? (a = !0, requestAnimationFrame(r)) : a = !1
        }
        var o = (document.createElementNS("http://www.w3.org/1999/xhtml", "div"), 0);
        t.bindAnimationForCustomEffect = function(t) {
            var i,
                r = t.effect.target,
                s = "function" == typeof t.effect.getFrames();
            i = s ? t.effect.getFrames() : t.effect._onsample;
            var a = t.effect.timing,
                l = null;
            a = e.normalizeTimingInput(a);
            var h = function() {
                var n = h._animation ? h._animation.currentTime : null;
                null !== n && (n = e.calculateIterationProgress(e.calculateActiveDuration(a), n, a), isNaN(n) && (n = null)), n !== l && (s ? i(n, r, t.effect) : i(n, t.effect, t.effect._animation)), l = n
            };
            h._animation = t, h._registered = !1, h._sequenceNumber = o++, t._callback = h, n(h)
        };
        var s = [],
            a = !1;
        t.Animation.prototype._register = function() {
            this._callback && n(this._callback)
        }
    }(c, e), function(e, t, i) {
        function n(e) {
            return e._timing.delay + e.activeDuration + e._timing.endDelay
        }
        function r(t, i, n) {
            this._id = n, this._parent = null, this.children = t || [], this._reparent(this.children), i = e.numericTimingToObject(i), this._timingInput = e.cloneTimingInput(i), this._timing = e.normalizeTimingInput(i, !0), this.timing = e.makeTiming(i, !0, this), this.timing._effect = this, "auto" === this._timing.duration && (this._timing.duration = this.activeDuration)
        }
        window.SequenceEffect = function() {
            r.apply(this, arguments)
        }, window.GroupEffect = function() {
            r.apply(this, arguments)
        }, r.prototype = {
            _isAncestor: function(e) {
                for (var t = this; null !== t;) {
                    if (t == e)
                        return !0;
                    t = t._parent
                }
                return !1
            },
            _rebuild: function() {
                for (var e = this; e;)
                    "auto" === e.timing.duration && (e._timing.duration = e.activeDuration), e = e._parent;
                this._animation && this._animation._rebuildUnderlyingAnimation()
            },
            _reparent: function(e) {
                t.removeMulti(e);
                for (var i = 0; i < e.length; i++)
                    e[i]._parent = this
            },
            _putChild: function(e, t) {
                for (var i = t ? "Cannot append an ancestor or self" : "Cannot prepend an ancestor or self", n = 0; n < e.length; n++)
                    if (this._isAncestor(e[n]))
                        throw {
                            type: DOMException.HIERARCHY_REQUEST_ERR,
                            name: "HierarchyRequestError",
                            message: i
                        };
                for (n = 0; n < e.length; n++)
                    t ? this.children.push(e[n]) : this.children.unshift(e[n]);
                this._reparent(e), this._rebuild()
            },
            append: function() {
                this._putChild(arguments, !0)
            },
            prepend: function() {
                this._putChild(arguments, !1)
            },
            get parent() {
                return this._parent
            },
            get firstChild() {
                return this.children.length ? this.children[0] : null
            },
            get lastChild() {
                return this.children.length ? this.children[this.children.length - 1] : null
            },
            clone: function() {
                for (var t = e.cloneTimingInput(this._timingInput), i = [], n = 0; n < this.children.length; n++)
                    i.push(this.children[n].clone());
                return this instanceof GroupEffect ? new GroupEffect(i, t) : new SequenceEffect(i, t)
            },
            remove: function() {
                t.removeMulti([this])
            }
        }, window.SequenceEffect.prototype = Object.create(r.prototype), Object.defineProperty(window.SequenceEffect.prototype, "activeDuration", {
            get: function() {
                var e = 0;
                return this.children.forEach(function(t) {
                    e += n(t)
                }), Math.max(e, 0)
            }
        }), window.GroupEffect.prototype = Object.create(r.prototype), Object.defineProperty(window.GroupEffect.prototype, "activeDuration", {
            get: function() {
                var e = 0;
                return this.children.forEach(function(t) {
                    e = Math.max(e, n(t))
                }), e
            }
        }), t.newUnderlyingAnimationForGroup = function(i) {
            var n,
                r = null,
                o = new KeyframeEffect(null, [], i._timing, i._id);
            return o.onsample = function(t) {
                var i = n._wrapper;
                if (i && "pending" != i.playState && i.effect)
                    return null == t ? void i._removeChildAnimations() : 0 == t && i.playbackRate < 0 && (r || (r = e.normalizeTimingInput(i.effect.timing)), t = e.calculateIterationProgress(e.calculateActiveDuration(r), -1, r), isNaN(t) || null == t) ? (i._forEachChild(function(e) {
                        e.currentTime = -1
                    }), void i._removeChildAnimations()) : void 0
            }, n = t.timeline._play(o)
        }, t.bindAnimationForGroup = function(e) {
            e._animation._wrapper = e, e._isGroup = !0, t.awaitStartTime(e), e._constructChildAnimations(), e._setExternalAnimation(e)
        }, t.groupChildDuration = n
    }(c, e), b.true = a
}({}, function() {
    return this
}()), Polymer({
    is: "opaque-animation",
    behaviors: [Polymer.NeonAnimationBehavior],
    configure: function(e) {
        var t = e.node;
        return this._effect = new KeyframeEffect(t, [{
            opacity: "1"
        }, {
            opacity: "1"
        }], this.timingFromConfig(e)), t.style.opacity = "0", this._effect
    },
    complete: function(e) {
        e.node.style.opacity = ""
    }
}), function() {
    "use strict";
    var e = {
            pageX: 0,
            pageY: 0
        },
        t = null,
        i = [];
    Polymer.IronDropdownScrollManager = {
        get currentLockingElement() {
            return this._lockingElements[this._lockingElements.length - 1]
        },
        elementIsScrollLocked: function(e) {
            var t,
                i = this.currentLockingElement;
            return void 0 !== i && (!!this._hasCachedLockedElement(e) || !this._hasCachedUnlockedElement(e) && ((t = !!i && i !== e && !this._composedTreeContains(i, e)) ? this._lockedElementCache.push(e) : this._unlockedElementCache.push(e), t))
        },
        pushScrollLock: function(e) {
            this._lockingElements.indexOf(e) >= 0 || (0 === this._lockingElements.length && this._lockScrollInteractions(), this._lockingElements.push(e), this._lockedElementCache = [], this._unlockedElementCache = [])
        },
        removeScrollLock: function(e) {
            var t = this._lockingElements.indexOf(e);
            -1 !== t && (this._lockingElements.splice(t, 1), this._lockedElementCache = [], this._unlockedElementCache = [], 0 === this._lockingElements.length && this._unlockScrollInteractions())
        },
        _lockingElements: [],
        _lockedElementCache: null,
        _unlockedElementCache: null,
        _hasCachedLockedElement: function(e) {
            return this._lockedElementCache.indexOf(e) > -1
        },
        _hasCachedUnlockedElement: function(e) {
            return this._unlockedElementCache.indexOf(e) > -1
        },
        _composedTreeContains: function(e, t) {
            var i,
                n,
                r,
                o;
            if (e.contains(t))
                return !0;
            for (i = Polymer.dom(e).querySelectorAll("content"), r = 0; r < i.length; ++r)
                for (n = Polymer.dom(i[r]).getDistributedNodes(), o = 0; o < n.length; ++o)
                    if (this._composedTreeContains(n[o], t))
                        return !0;
            return !1
        },
        _scrollInteractionHandler: function(t) {
            if (t.cancelable && this._shouldPreventScrolling(t) && t.preventDefault(), t.targetTouches) {
                var i = t.targetTouches[0];
                e.pageX = i.pageX, e.pageY = i.pageY
            }
        },
        _lockScrollInteractions: function() {
            this._boundScrollHandler = this._boundScrollHandler || this._scrollInteractionHandler.bind(this), document.addEventListener("wheel", this._boundScrollHandler, !0), document.addEventListener("mousewheel", this._boundScrollHandler, !0), document.addEventListener("DOMMouseScroll", this._boundScrollHandler, !0), document.addEventListener("touchstart", this._boundScrollHandler, !0), document.addEventListener("touchmove", this._boundScrollHandler, !0)
        },
        _unlockScrollInteractions: function() {
            document.removeEventListener("wheel", this._boundScrollHandler, !0), document.removeEventListener("mousewheel", this._boundScrollHandler, !0), document.removeEventListener("DOMMouseScroll", this._boundScrollHandler, !0), document.removeEventListener("touchstart", this._boundScrollHandler, !0), document.removeEventListener("touchmove", this._boundScrollHandler, !0)
        },
        _shouldPreventScrolling: function(e) {
            var n = Polymer.dom(e).rootTarget;
            if ("touchmove" !== e.type && t !== n && (t = n, i = this._getScrollableNodes(Polymer.dom(e).path)), !i.length)
                return !0;
            if ("touchstart" === e.type)
                return !1;
            var r = this._getScrollInfo(e);
            return !this._getScrollingNode(i, r.deltaX, r.deltaY)
        },
        _getScrollableNodes: function(e) {
            for (var t = [], i = e.indexOf(this.currentLockingElement), n = 0; n <= i; n++)
                if (e[n].nodeType === Node.ELEMENT_NODE) {
                    var r = e[n],
                        o = r.style;
                    "scroll" !== o.overflow && "auto" !== o.overflow && (o = window.getComputedStyle(r)), "scroll" !== o.overflow && "auto" !== o.overflow || t.push(r)
                }
            return t
        },
        _getScrollingNode: function(e, t, i) {
            if (t || i)
                for (var n = Math.abs(i) >= Math.abs(t), r = 0; r < e.length; r++) {
                    var o = e[r];
                    if (n ? i < 0 ? o.scrollTop > 0 : o.scrollTop < o.scrollHeight - o.clientHeight : t < 0 ? o.scrollLeft > 0 : o.scrollLeft < o.scrollWidth - o.clientWidth)
                        return o
                }
        },
        _getScrollInfo: function(t) {
            var i = {
                deltaX: t.deltaX,
                deltaY: t.deltaY
            };
            if ("deltaX" in t)
                ;
            else if ("wheelDeltaX" in t)
                i.deltaX = -t.wheelDeltaX, i.deltaY = -t.wheelDeltaY;
            else if ("axis" in t)
                i.deltaX = 1 === t.axis ? t.detail : 0, i.deltaY = 2 === t.axis ? t.detail : 0;
            else if (t.targetTouches) {
                var n = t.targetTouches[0];
                i.deltaX = e.pageX - n.pageX, i.deltaY = e.pageY - n.pageY
            }
            return i
        }
    }
}(), function() {
    "use strict";
    Polymer({
        is: "iron-dropdown",
        behaviors: [Polymer.IronControlState, Polymer.IronA11yKeysBehavior, Polymer.IronOverlayBehavior, Polymer.NeonAnimationRunnerBehavior],
        properties: {
            horizontalAlign: {
                type: String,
                value: "left",
                reflectToAttribute: !0
            },
            verticalAlign: {
                type: String,
                value: "top",
                reflectToAttribute: !0
            },
            openAnimationConfig: {
                type: Object
            },
            closeAnimationConfig: {
                type: Object
            },
            focusTarget: {
                type: Object
            },
            noAnimations: {
                type: Boolean,
                value: !1
            },
            allowOutsideScroll: {
                type: Boolean,
                value: !1
            },
            _boundOnCaptureScroll: {
                type: Function,
                value: function() {
                    return this._onCaptureScroll.bind(this)
                }
            }
        },
        listeners: {
            "neon-animation-finish": "_onNeonAnimationFinish"
        },
        observers: ["_updateOverlayPosition(positionTarget, verticalAlign, horizontalAlign, verticalOffset, horizontalOffset)"],
        get containedElement() {
            return Polymer.dom(this.$.content).getDistributedNodes()[0]
        },
        get _focusTarget() {
            return this.focusTarget || this.containedElement
        },
        ready: function() {
            this._scrollTop = 0, this._scrollLeft = 0, this._refitOnScrollRAF = null
        },
        attached: function() {
            this.sizingTarget && this.sizingTarget !== this || (this.sizingTarget = this.containedElement || this)
        },
        detached: function() {
            this.cancelAnimation(), document.removeEventListener("scroll", this._boundOnCaptureScroll), Polymer.IronDropdownScrollManager.removeScrollLock(this)
        },
        _openedChanged: function() {
            this.opened && this.disabled ? this.cancel() : (this.cancelAnimation(), this._updateAnimationConfig(), this._saveScrollPosition(), this.opened ? (document.addEventListener("scroll", this._boundOnCaptureScroll), !this.allowOutsideScroll && Polymer.IronDropdownScrollManager.pushScrollLock(this)) : (document.removeEventListener("scroll", this._boundOnCaptureScroll), Polymer.IronDropdownScrollManager.removeScrollLock(this)), Polymer.IronOverlayBehaviorImpl._openedChanged.apply(this, arguments))
        },
        _renderOpened: function() {
            !this.noAnimations && this.animationConfig.open ? (this.$.contentWrapper.classList.add("animating"), this.playAnimation("open")) : Polymer.IronOverlayBehaviorImpl._renderOpened.apply(this, arguments)
        },
        _renderClosed: function() {
            !this.noAnimations && this.animationConfig.close ? (this.$.contentWrapper.classList.add("animating"), this.playAnimation("close")) : Polymer.IronOverlayBehaviorImpl._renderClosed.apply(this, arguments)
        },
        _onNeonAnimationFinish: function() {
            this.$.contentWrapper.classList.remove("animating"), this.opened ? this._finishRenderOpened() : this._finishRenderClosed()
        },
        _onCaptureScroll: function() {
            this.allowOutsideScroll ? (this._refitOnScrollRAF && window.cancelAnimationFrame(this._refitOnScrollRAF), this._refitOnScrollRAF = window.requestAnimationFrame(this.refit.bind(this))) : this._restoreScrollPosition()
        },
        _saveScrollPosition: function() {
            document.scrollingElement ? (this._scrollTop = document.scrollingElement.scrollTop, this._scrollLeft = document.scrollingElement.scrollLeft) : (this._scrollTop = Math.max(document.documentElement.scrollTop, document.body.scrollTop), this._scrollLeft = Math.max(document.documentElement.scrollLeft, document.body.scrollLeft))
        },
        _restoreScrollPosition: function() {
            document.scrollingElement ? (document.scrollingElement.scrollTop = this._scrollTop, document.scrollingElement.scrollLeft = this._scrollLeft) : (document.documentElement.scrollTop = this._scrollTop, document.documentElement.scrollLeft = this._scrollLeft, document.body.scrollTop = this._scrollTop, document.body.scrollLeft = this._scrollLeft)
        },
        _updateAnimationConfig: function() {
            for (var e = this.containedElement, t = [].concat(this.openAnimationConfig || []).concat(this.closeAnimationConfig || []), i = 0; i < t.length; i++)
                t[i].node = e;
            this.animationConfig = {
                open: this.openAnimationConfig,
                close: this.closeAnimationConfig
            }
        },
        _updateOverlayPosition: function() {
            this.isAttached && this.notifyResize()
        },
        _applyFocus: function() {
            var e = this.focusTarget || this.containedElement;
            e && this.opened && !this.noAutoFocus ? e.focus() : Polymer.IronOverlayBehaviorImpl._applyFocus.apply(this, arguments)
        }
    })
}(), Polymer({
    is: "fade-in-animation",
    behaviors: [Polymer.NeonAnimationBehavior],
    configure: function(e) {
        var t = e.node;
        return this._effect = new KeyframeEffect(t, [{
            opacity: "0"
        }, {
            opacity: "1"
        }], this.timingFromConfig(e)), this._effect
    }
}), Polymer({
    is: "fade-out-animation",
    behaviors: [Polymer.NeonAnimationBehavior],
    configure: function(e) {
        var t = e.node;
        return this._effect = new KeyframeEffect(t, [{
            opacity: "1"
        }, {
            opacity: "0"
        }], this.timingFromConfig(e)), this._effect
    }
}), Polymer({
    is: "paper-menu-grow-height-animation",
    behaviors: [Polymer.NeonAnimationBehavior],
    configure: function(e) {
        var t = e.node,
            i = t.getBoundingClientRect().height;
        return this._effect = new KeyframeEffect(t, [{
            height: i / 2 + "px"
        }, {
            height: i + "px"
        }], this.timingFromConfig(e)), this._effect
    }
}), Polymer({
    is: "paper-menu-grow-width-animation",
    behaviors: [Polymer.NeonAnimationBehavior],
    configure: function(e) {
        var t = e.node,
            i = t.getBoundingClientRect().width;
        return this._effect = new KeyframeEffect(t, [{
            width: i / 2 + "px"
        }, {
            width: i + "px"
        }], this.timingFromConfig(e)), this._effect
    }
}), Polymer({
    is: "paper-menu-shrink-width-animation",
    behaviors: [Polymer.NeonAnimationBehavior],
    configure: function(e) {
        var t = e.node,
            i = t.getBoundingClientRect().width;
        return this._effect = new KeyframeEffect(t, [{
            width: i + "px"
        }, {
            width: i - i / 20 + "px"
        }], this.timingFromConfig(e)), this._effect
    }
}), Polymer({
    is: "paper-menu-shrink-height-animation",
    behaviors: [Polymer.NeonAnimationBehavior],
    configure: function(e) {
        var t = e.node,
            i = t.getBoundingClientRect(),
            n = i.height;
        return i.top, this.setPrefixedProperty(t, "transformOrigin", "0 0"), this._effect = new KeyframeEffect(t, [{
            height: n + "px",
            transform: "translateY(0)"
        }, {
            height: n / 2 + "px",
            transform: "translateY(-20px)"
        }], this.timingFromConfig(e)), this._effect
    }
}), function() {
    "use strict";
    var e = {
            ANIMATION_CUBIC_BEZIER: "cubic-bezier(.3,.95,.5,1)",
            MAX_ANIMATION_TIME_MS: 400
        },
        t = Polymer({
            is: "paper-menu-button",
            behaviors: [Polymer.IronA11yKeysBehavior, Polymer.IronControlState],
            properties: {
                opened: {
                    type: Boolean,
                    value: !1,
                    notify: !0,
                    observer: "_openedChanged"
                },
                horizontalAlign: {
                    type: String,
                    value: "left",
                    reflectToAttribute: !0
                },
                verticalAlign: {
                    type: String,
                    value: "top",
                    reflectToAttribute: !0
                },
                dynamicAlign: {
                    type: Boolean
                },
                horizontalOffset: {
                    type: Number,
                    value: 0,
                    notify: !0
                },
                verticalOffset: {
                    type: Number,
                    value: 0,
                    notify: !0
                },
                noOverlap: {
                    type: Boolean
                },
                noAnimations: {
                    type: Boolean,
                    value: !1
                },
                ignoreSelect: {
                    type: Boolean,
                    value: !1
                },
                closeOnActivate: {
                    type: Boolean,
                    value: !1
                },
                openAnimationConfig: {
                    type: Object,
                    value: function() {
                        return [{
                            name: "fade-in-animation",
                            timing: {
                                delay: 100,
                                duration: 200
                            }
                        }, {
                            name: "paper-menu-grow-width-animation",
                            timing: {
                                delay: 100,
                                duration: 150,
                                easing: e.ANIMATION_CUBIC_BEZIER
                            }
                        }, {
                            name: "paper-menu-grow-height-animation",
                            timing: {
                                delay: 100,
                                duration: 275,
                                easing: e.ANIMATION_CUBIC_BEZIER
                            }
                        }]
                    }
                },
                closeAnimationConfig: {
                    type: Object,
                    value: function() {
                        return [{
                            name: "fade-out-animation",
                            timing: {
                                duration: 150
                            }
                        }, {
                            name: "paper-menu-shrink-width-animation",
                            timing: {
                                delay: 100,
                                duration: 50,
                                easing: e.ANIMATION_CUBIC_BEZIER
                            }
                        }, {
                            name: "paper-menu-shrink-height-animation",
                            timing: {
                                duration: 200,
                                easing: "ease-in"
                            }
                        }]
                    }
                },
                allowOutsideScroll: {
                    type: Boolean,
                    value: !1
                },
                restoreFocusOnClose: {
                    type: Boolean,
                    value: !0
                },
                _dropdownContent: {
                    type: Object
                }
            },
            hostAttributes: {
                role: "group",
                "aria-haspopup": "true"
            },
            listeners: {
                "iron-activate": "_onIronActivate",
                "iron-select": "_onIronSelect"
            },
            get contentElement() {
                return Polymer.dom(this.$.content).getDistributedNodes()[0]
            },
            toggle: function() {
                this.opened ? this.close() : this.open()
            },
            open: function() {
                this.disabled || this.$.dropdown.open()
            },
            close: function() {
                this.$.dropdown.close()
            },
            _onIronSelect: function(e) {
                this.ignoreSelect || this.close()
            },
            _onIronActivate: function(e) {
                this.closeOnActivate && this.close()
            },
            _openedChanged: function(e, t) {
                e ? (this._dropdownContent = this.contentElement, this.fire("paper-dropdown-open")) : null != t && this.fire("paper-dropdown-close")
            },
            _disabledChanged: function(e) {
                Polymer.IronControlState._disabledChanged.apply(this, arguments), e && this.opened && this.close()
            },
            __onIronOverlayCanceled: function(e) {
                var t = e.detail,
                    i = (Polymer.dom(t).rootTarget, this.$.trigger);
                Polymer.dom(t).path.indexOf(i) > -1 && e.preventDefault()
            }
        });
    Object.keys(e).forEach(function(i) {
        t[i] = e[i]
    }), Polymer.PaperMenuButton = t
}(), function() {
    "use strict";
    Polymer({
        is: "paper-dropdown-menu",
        behaviors: [Polymer.IronButtonState, Polymer.IronControlState, Polymer.IronFormElementBehavior, Polymer.IronValidatableBehavior],
        properties: {
            selectedItemLabel: {
                type: String,
                notify: !0,
                readOnly: !0
            },
            selectedItem: {
                type: Object,
                notify: !0,
                readOnly: !0
            },
            value: {
                type: String,
                notify: !0,
                readOnly: !0
            },
            label: {
                type: String
            },
            placeholder: {
                type: String
            },
            errorMessage: {
                type: String
            },
            opened: {
                type: Boolean,
                notify: !0,
                value: !1,
                observer: "_openedChanged"
            },
            allowOutsideScroll: {
                type: Boolean,
                value: !1
            },
            noLabelFloat: {
                type: Boolean,
                value: !1,
                reflectToAttribute: !0
            },
            alwaysFloatLabel: {
                type: Boolean,
                value: !1
            },
            noAnimations: {
                type: Boolean,
                value: !1
            },
            horizontalAlign: {
                type: String,
                value: "right"
            },
            verticalAlign: {
                type: String,
                value: "top"
            },
            dynamicAlign: {
                type: Boolean
            },
            restoreFocusOnClose: {
                type: Boolean,
                value: !0
            }
        },
        listeners: {
            tap: "_onTap"
        },
        keyBindings: {
            "up down": "open",
            esc: "close"
        },
        hostAttributes: {
            role: "combobox",
            "aria-autocomplete": "none",
            "aria-haspopup": "true"
        },
        observers: ["_selectedItemChanged(selectedItem)"],
        attached: function() {
            var e = this.contentElement;
            e && e.selectedItem && this._setSelectedItem(e.selectedItem)
        },
        get contentElement() {
            return Polymer.dom(this.$.content).getDistributedNodes()[0]
        },
        open: function() {
            this.$.menuButton.open()
        },
        close: function() {
            this.$.menuButton.close()
        },
        _onIronSelect: function(e) {
            this._setSelectedItem(e.detail.item)
        },
        _onIronDeselect: function(e) {
            this._setSelectedItem(null)
        },
        _onTap: function(e) {
            Polymer.Gestures.findOriginalTarget(e) === this && this.open()
        },
        _selectedItemChanged: function(e) {
            var t;
            t = e ? e.label || e.getAttribute("label") || e.textContent.trim() : "", this._setValue(t), this._setSelectedItemLabel(t)
        },
        _computeMenuVerticalOffset: function(e) {
            return e ? -4 : 8
        },
        _getValidity: function(e) {
            return this.disabled || !this.required || this.required && !!this.value
        },
        _openedChanged: function() {
            var e = this.opened ? "true" : "false",
                t = this.contentElement;
            t && t.setAttribute("aria-expanded", e)
        }
    })
}(), Polymer({
    is: "paper-toolbar",
    hostAttributes: {
        role: "toolbar"
    },
    properties: {
        bottomJustify: {
            type: String,
            value: ""
        },
        justify: {
            type: String,
            value: ""
        },
        middleJustify: {
            type: String,
            value: ""
        }
    },
    attached: function() {
        this._observer = this._observe(this), this._updateAriaLabelledBy()
    },
    detached: function() {
        this._observer && this._observer.disconnect()
    },
    _observe: function(e) {
        var t = new MutationObserver(function() {
            this._updateAriaLabelledBy()
        }.bind(this));
        return t.observe(e, {
            childList: !0,
            subtree: !0
        }), t
    },
    _updateAriaLabelledBy: function() {
        for (var e, t = [], i = Polymer.dom(this.root).querySelectorAll("content"), n = 0; e = i[n]; n++)
            for (var r, o = Polymer.dom(e).getDistributedNodes(), s = 0; r = o[s]; s++)
                if (r.classList && r.classList.contains("title"))
                    if (r.id)
                        t.push(r.id);
                    else {
                        var a = "paper-toolbar-label-" + Math.floor(1e4 * Math.random());
                        r.id = a, t.push(a)
                    }
        t.length > 0 && this.setAttribute("aria-labelledby", t.join(" "))
    },
    _computeBarExtraClasses: function(e) {
        return e ? e + ("justified" === e ? "" : "-justified") : ""
    }
}), Polymer.IronMenuBehaviorImpl = {
    properties: {
        focusedItem: {
            observer: "_focusedItemChanged",
            readOnly: !0,
            type: Object
        },
        attrForItemTitle: {
            type: String
        }
    },
    _SEARCH_RESET_TIMEOUT_MS: 1e3,
    hostAttributes: {
        role: "menu",
        tabindex: "0"
    },
    observers: ["_updateMultiselectable(multi)"],
    listeners: {
        focus: "_onFocus",
        keydown: "_onKeydown",
        "iron-items-changed": "_onIronItemsChanged"
    },
    keyBindings: {
        up: "_onUpKey",
        down: "_onDownKey",
        esc: "_onEscKey",
        "shift+tab:keydown": "_onShiftTabDown"
    },
    attached: function() {
        this._resetTabindices()
    },
    select: function(e) {
        this._defaultFocusAsync && (this.cancelAsync(this._defaultFocusAsync), this._defaultFocusAsync = null);
        var t = this._valueToItem(e);
        t && t.hasAttribute("disabled") || (this._setFocusedItem(t), Polymer.IronMultiSelectableBehaviorImpl.select.apply(this, arguments))
    },
    _resetTabindices: function() {
        var e = this.multi ? this.selectedItems && this.selectedItems[0] : this.selectedItem;
        this.items.forEach(function(t) {
            t.setAttribute("tabindex", t === e ? "0" : "-1")
        }, this)
    },
    _updateMultiselectable: function(e) {
        e ? this.setAttribute("aria-multiselectable", "true") : this.removeAttribute("aria-multiselectable")
    },
    _focusWithKeyboardEvent: function(e) {
        this.cancelDebouncer("_clearSearchText");
        for (var t, i = this._searchText || "", n = (i += (e.key && 1 == e.key.length ? e.key : String.fromCharCode(e.keyCode)).toLocaleLowerCase()).length, r = 0; t = this.items[r]; r++)
            if (!t.hasAttribute("disabled")) {
                var o = this.attrForItemTitle || "textContent",
                    s = (t[o] || t.getAttribute(o) || "").trim();
                if (!(s.length < n) && s.slice(0, n).toLocaleLowerCase() == i) {
                    this._setFocusedItem(t);
                    break
                }
            }
        this._searchText = i, this.debounce("_clearSearchText", this._clearSearchText, this._SEARCH_RESET_TIMEOUT_MS)
    },
    _clearSearchText: function() {
        this._searchText = ""
    },
    _focusPrevious: function() {
        for (var e = this.items.length, t = Number(this.indexOf(this.focusedItem)), i = 1; i < e + 1; i++) {
            var n = this.items[(t - i + e) % e];
            if (!n.hasAttribute("disabled")) {
                var r = Polymer.dom(n).getOwnerRoot() || document;
                if (this._setFocusedItem(n), Polymer.dom(r).activeElement == n)
                    return
            }
        }
    },
    _focusNext: function() {
        for (var e = this.items.length, t = Number(this.indexOf(this.focusedItem)), i = 1; i < e + 1; i++) {
            var n = this.items[(t + i) % e];
            if (!n.hasAttribute("disabled")) {
                var r = Polymer.dom(n).getOwnerRoot() || document;
                if (this._setFocusedItem(n), Polymer.dom(r).activeElement == n)
                    return
            }
        }
    },
    _applySelection: function(e, t) {
        t ? e.setAttribute("aria-selected", "true") : e.removeAttribute("aria-selected"), Polymer.IronSelectableBehavior._applySelection.apply(this, arguments)
    },
    _focusedItemChanged: function(e, t) {
        t && t.setAttribute("tabindex", "-1"), e && (e.setAttribute("tabindex", "0"), e.focus())
    },
    _onIronItemsChanged: function(e) {
        e.detail.addedNodes.length && this._resetTabindices()
    },
    _onShiftTabDown: function(e) {
        var t = this.getAttribute("tabindex");
        Polymer.IronMenuBehaviorImpl._shiftTabPressed = !0, this._setFocusedItem(null), this.setAttribute("tabindex", "-1"), this.async(function() {
            this.setAttribute("tabindex", t), Polymer.IronMenuBehaviorImpl._shiftTabPressed = !1
        }, 1)
    },
    _onFocus: function(e) {
        if (!Polymer.IronMenuBehaviorImpl._shiftTabPressed) {
            var t = Polymer.dom(e).rootTarget;
            (t === this || void 0 === t.tabIndex || this.isLightDescendant(t)) && (this._defaultFocusAsync = this.async(function() {
                var e = this.multi ? this.selectedItems && this.selectedItems[0] : this.selectedItem;
                this._setFocusedItem(null), e ? this._setFocusedItem(e) : this.items[0] && this._focusNext()
            }))
        }
    },
    _onUpKey: function(e) {
        this._focusPrevious(), e.detail.keyboardEvent.preventDefault()
    },
    _onDownKey: function(e) {
        this._focusNext(), e.detail.keyboardEvent.preventDefault()
    },
    _onEscKey: function(e) {
        this.focusedItem.blur()
    },
    _onKeydown: function(e) {
        this.keyboardEventMatchesKeys(e, "up down esc") || this._focusWithKeyboardEvent(e), e.stopPropagation()
    },
    _activateHandler: function(e) {
        Polymer.IronSelectableBehavior._activateHandler.call(this, e), e.stopPropagation()
    }
}, Polymer.IronMenuBehaviorImpl._shiftTabPressed = !1, Polymer.IronMenuBehavior = [Polymer.IronMultiSelectableBehavior, Polymer.IronA11yKeysBehavior, Polymer.IronMenuBehaviorImpl], Polymer({
    is: "paper-listbox",
    behaviors: [Polymer.IronMenuBehavior],
    hostAttributes: {
        role: "listbox"
    }
}), Polymer.IronMenubarBehaviorImpl = {
    hostAttributes: {
        role: "menubar"
    },
    keyBindings: {
        left: "_onLeftKey",
        right: "_onRightKey"
    },
    _onUpKey: function(e) {
        this.focusedItem.click(), e.detail.keyboardEvent.preventDefault()
    },
    _onDownKey: function(e) {
        this.focusedItem.click(), e.detail.keyboardEvent.preventDefault()
    },
    get _isRTL() {
        return "rtl" === window.getComputedStyle(this).direction
    },
    _onLeftKey: function(e) {
        this._isRTL ? this._focusNext() : this._focusPrevious(), e.detail.keyboardEvent.preventDefault()
    },
    _onRightKey: function(e) {
        this._isRTL ? this._focusPrevious() : this._focusNext(), e.detail.keyboardEvent.preventDefault()
    },
    _onKeydown: function(e) {
        this.keyboardEventMatchesKeys(e, "up down left right esc") || this._focusWithKeyboardEvent(e)
    }
}, Polymer.IronMenubarBehavior = [Polymer.IronMenuBehavior, Polymer.IronMenubarBehaviorImpl], Polymer({
    is: "paper-tab",
    behaviors: [Polymer.IronControlState, Polymer.IronButtonState, Polymer.PaperRippleBehavior],
    properties: {
        link: {
            type: Boolean,
            value: !1,
            reflectToAttribute: !0
        }
    },
    hostAttributes: {
        role: "tab"
    },
    listeners: {
        down: "_updateNoink",
        tap: "_onTap"
    },
    attached: function() {
        this._updateNoink()
    },
    get _parentNoink() {
        var e = Polymer.dom(this).parentNode;
        return !!e && !!e.noink
    },
    _updateNoink: function() {
        this.noink = !!this.noink || !!this._parentNoink
    },
    _onTap: function(e) {
        if (this.link) {
            var t = this.queryEffectiveChildren("a");
            if (!t)
                return;
            if (e.target === t)
                return;
            t.click()
        }
    }
}), Polymer({
    is: "paper-tabs",
    behaviors: [Polymer.IronResizableBehavior, Polymer.IronMenubarBehavior],
    properties: {
        noink: {
            type: Boolean,
            value: !1,
            observer: "_noinkChanged"
        },
        noBar: {
            type: Boolean,
            value: !1
        },
        noSlide: {
            type: Boolean,
            value: !1
        },
        scrollable: {
            type: Boolean,
            value: !1
        },
        fitContainer: {
            type: Boolean,
            value: !1
        },
        disableDrag: {
            type: Boolean,
            value: !1
        },
        hideScrollButtons: {
            type: Boolean,
            value: !1
        },
        alignBottom: {
            type: Boolean,
            value: !1
        },
        selectable: {
            type: String,
            value: "paper-tab"
        },
        autoselect: {
            type: Boolean,
            value: !1
        },
        autoselectDelay: {
            type: Number,
            value: 0
        },
        _step: {
            type: Number,
            value: 10
        },
        _holdDelay: {
            type: Number,
            value: 1
        },
        _leftHidden: {
            type: Boolean,
            value: !1
        },
        _rightHidden: {
            type: Boolean,
            value: !1
        },
        _previousTab: {
            type: Object
        }
    },
    hostAttributes: {
        role: "tablist"
    },
    listeners: {
        "iron-resize": "_onTabSizingChanged",
        "iron-items-changed": "_onTabSizingChanged",
        "iron-select": "_onIronSelect",
        "iron-deselect": "_onIronDeselect"
    },
    keyBindings: {
        "left:keyup right:keyup": "_onArrowKeyup"
    },
    created: function() {
        this._holdJob = null, this._pendingActivationItem = void 0, this._pendingActivationTimeout = void 0, this._bindDelayedActivationHandler = this._delayedActivationHandler.bind(this), this.addEventListener("blur", this._onBlurCapture.bind(this), !0)
    },
    ready: function() {
        this.setScrollDirection("y", this.$.tabsContainer)
    },
    detached: function() {
        this._cancelPendingActivation()
    },
    _noinkChanged: function(e) {
        Polymer.dom(this).querySelectorAll("paper-tab").forEach(e ? this._setNoinkAttribute : this._removeNoinkAttribute)
    },
    _setNoinkAttribute: function(e) {
        e.setAttribute("noink", "")
    },
    _removeNoinkAttribute: function(e) {
        e.removeAttribute("noink")
    },
    _computeScrollButtonClass: function(e, t, i) {
        return !t || i ? "hidden" : e ? "not-visible" : ""
    },
    _computeTabsContentClass: function(e, t) {
        return e ? "scrollable" + (t ? " fit-container" : "") : " fit-container"
    },
    _computeSelectionBarClass: function(e, t) {
        return e ? "hidden" : t ? "align-bottom" : ""
    },
    _onTabSizingChanged: function() {
        this.debounce("_onTabSizingChanged", function() {
            this._scroll(), this._tabChanged(this.selectedItem)
        }, 10)
    },
    _onIronSelect: function(e) {
        this._tabChanged(e.detail.item, this._previousTab), this._previousTab = e.detail.item, this.cancelDebouncer("tab-changed")
    },
    _onIronDeselect: function(e) {
        this.debounce("tab-changed", function() {
            this._tabChanged(null, this._previousTab), this._previousTab = null
        }, 1)
    },
    _activateHandler: function() {
        this._cancelPendingActivation(), Polymer.IronMenuBehaviorImpl._activateHandler.apply(this, arguments)
    },
    _scheduleActivation: function(e, t) {
        this._pendingActivationItem = e, this._pendingActivationTimeout = this.async(this._bindDelayedActivationHandler, t)
    },
    _delayedActivationHandler: function() {
        var e = this._pendingActivationItem;
        this._pendingActivationItem = void 0, this._pendingActivationTimeout = void 0, e.fire(this.activateEvent, null, {
            bubbles: !0,
            cancelable: !0
        })
    },
    _cancelPendingActivation: function() {
        void 0 !== this._pendingActivationTimeout && (this.cancelAsync(this._pendingActivationTimeout), this._pendingActivationItem = void 0, this._pendingActivationTimeout = void 0)
    },
    _onArrowKeyup: function(e) {
        this.autoselect && this._scheduleActivation(this.focusedItem, this.autoselectDelay)
    },
    _onBlurCapture: function(e) {
        e.target === this._pendingActivationItem && this._cancelPendingActivation()
    },
    get _tabContainerScrollSize() {
        return Math.max(0, this.$.tabsContainer.scrollWidth - this.$.tabsContainer.offsetWidth)
    },
    _scroll: function(e, t) {
        if (this.scrollable) {
            var i = t && -t.ddx || 0;
            this._affectScroll(i)
        }
    },
    _down: function(e) {
        this.async(function() {
            this._defaultFocusAsync && (this.cancelAsync(this._defaultFocusAsync), this._defaultFocusAsync = null)
        }, 1)
    },
    _affectScroll: function(e) {
        this.$.tabsContainer.scrollLeft += e;
        var t = this.$.tabsContainer.scrollLeft;
        this._leftHidden = 0 === t, this._rightHidden = t === this._tabContainerScrollSize
    },
    _onLeftScrollButtonDown: function() {
        this._scrollToLeft(), this._holdJob = setInterval(this._scrollToLeft.bind(this), this._holdDelay)
    },
    _onRightScrollButtonDown: function() {
        this._scrollToRight(), this._holdJob = setInterval(this._scrollToRight.bind(this), this._holdDelay)
    },
    _onScrollButtonUp: function() {
        clearInterval(this._holdJob), this._holdJob = null
    },
    _scrollToLeft: function() {
        this._affectScroll(-this._step)
    },
    _scrollToRight: function() {
        this._affectScroll(this._step)
    },
    _tabChanged: function(e, t) {
        if (!e)
            return this.$.selectionBar.classList.remove("expand"), this.$.selectionBar.classList.remove("contract"), void this._positionBar(0, 0);
        var i = this.$.tabsContent.getBoundingClientRect(),
            n = i.width,
            r = e.getBoundingClientRect(),
            o = r.left - i.left;
        if (this._pos = {
            width: this._calcPercent(r.width, n),
            left: this._calcPercent(o, n)
        }, this.noSlide || null == t)
            return this.$.selectionBar.classList.remove("expand"), this.$.selectionBar.classList.remove("contract"), void this._positionBar(this._pos.width, this._pos.left);
        var s = t.getBoundingClientRect(),
            a = this.items.indexOf(t),
            l = this.items.indexOf(e);
        this.$.selectionBar.classList.add("expand");
        var h = a < l;
        this._isRTL && (h = !h), h ? this._positionBar(this._calcPercent(r.left + r.width - s.left, n) - 5, this._left) : this._positionBar(this._calcPercent(s.left + s.width - r.left, n) - 5, this._calcPercent(o, n) + 5), this.scrollable && this._scrollToSelectedIfNeeded(r.width, o)
    },
    _scrollToSelectedIfNeeded: function(e, t) {
        var i = t - this.$.tabsContainer.scrollLeft;
        i < 0 ? this.$.tabsContainer.scrollLeft += i : (i += e - this.$.tabsContainer.offsetWidth) > 0 && (this.$.tabsContainer.scrollLeft += i)
    },
    _calcPercent: function(e, t) {
        return 100 * e / t
    },
    _positionBar: function(e, t) {
        e = e || 0, t = t || 0, this._width = e, this._left = t, this.transform("translateX(" + t + "%) scaleX(" + e / 100 + ")", this.$.selectionBar)
    },
    _onBarTransitionEnd: function(e) {
        var t = this.$.selectionBar.classList;
        t.contains("expand") ? (t.remove("expand"), t.add("contract"), this._positionBar(this._pos.width, this._pos.left)) : t.contains("contract") && t.remove("contract")
    }
}), function(e, t) {
    "use strict";
    function i(e) {
        this.j = "a-z", this.a = {
            tags: []
        }, this.f = [], this.i = e, this.c = e.querySelectorAll(".codelab-card");
        for (var t = e = 0; t < this.c.length; t++) {
            var i = this.c[t];
            i.l = (i.dataset.title || "").trim().toLowerCase(), i.h = o((i.dataset.category || "").split(",")), i.tags = o((i.dataset.tags || "").split(",")), i.g = new Date(i.dataset.updated), i.duration = parseInt(i.dataset.duration, 10), i.dataset.pin && (e += 1, i.b = e)
        }
    }
    function n(e) {
        for (var t = Array.prototype.slice.call(e.c, 0), i = t.length; i--;) {
            var n = t[i];
            if (e.a.kioskTags && 0 < e.a.kioskTags.length && !l(e.a.kioskTags, n.tags))
                n = !1;
            else {
                var r = !e.a.cat;
                if (e.a.cat)
                    for (var o = 0; o < n.h.length; o++)
                        e.a.cat === n.h[o] && (r = !0);
                n = !(!r || e.a.text && -1 === n.l.indexOf(e.a.text) || 0 < e.a.tags.length && !l(e.a.tags, n.tags))
            }
            n ? l(t[i].tags, e.f) && t[i].classList.add("hardware-bubble") : t.splice(i, 1)
        }
        for (function(e, t) {
            switch (e.j) {
            case "duration":
                t.sort(function(e, t) {
                    var i = s(e, t);
                    return null !== i ? i : null !== (i = a(e, t)) ? i : e.duration - t.duration
                });
                break;
            case "recent":
                t.sort(function(e, t) {
                    var i = s(e, t);
                    return null !== i ? i : null !== (i = a(e, t)) ? i : t.g < e.g ? -1 : t.g > e.g ? 1 : 0
                });
                break;
            default:
                t.sort(function(e, t) {
                    var i = s(e, t);
                    return null !== i ? i : null !== (i = a(e, t)) ? i : e.dataset.title < t.dataset.title ? -1 : e.dataset.title > t.dataset.title ? 1 : 0
                })
            }
        }(e, t), i = 0; i < e.c.length; i++)
            (n = e.c[i]).parentNode && n.parentNode.removeChild(n);
        t.forEach(e.i.appendChild.bind(e.i))
    }
    function r(e) {
        return (e || "").trim().toLowerCase()
    }
    function o(e) {
        e = e || [];
        for (var t = [], i = 0; i < e.length; i++) {
            var n = r(e[i]);
            n && t.push(n)
        }
        return t.sort(), t
    }
    function s(e, t) {
        return e.b && !t.b ? -1 : !e.b && t.b ? 1 : e.b && t.b ? e.b - t.b : null
    }
    function a(e, t) {
        return e = e.classList.contains("hardware-bubble"), t = t.classList.contains("hardware-bubble"), e && !t ? -1 : !e && t ? 1 : null
    }
    function l(e, t) {
        for (var i = 0, n = 0; i < e.length && n < t.length;)
            if (e[i] < t[n])
                i++;
            else {
                if (!(e[i] > t[n]))
                    return !0;
                n++
            }
        return !1
    }
    i.prototype.sort = function(e) {
        this.j = e, n(this)
    }, i.prototype.filter = function(e) {
        this.a.cat = r(e.cat), this.a.text = r(e.text), this.a.tags = o(e.tags), this.a.kioskTags = o(e.kioskTags), this.f = this.a.kioskTags.slice(0), this.f.splice(this.f.indexOf("kiosk"), 1), n(this)
    }, i.prototype.filterByCategory = function(e) {
        this.a.cat = r(e), n(this)
    }, i.prototype.filterByText = function(e) {
        this.a.text = r(e), n(this)
    }, i.prototype.filterByTags = function(e, t) {
        this.a.tags = o(e), this.a.kioskTags = o(t), n(this)
    }, i.prototype.clearFilters = function() {
        this.filter({
            tags: [],
            kioskTags: []
        })
    }, e.CardSorter = i
}(window, document), Polymer({
    is: "card-sorter",
    properties: {
        sorter: {
            type: Object,
            readOnly: !0
        }
    },
    ready: function() {
        this._setSorter(new CardSorter(this))
    },
    sort: function(e) {
        e = (e || "").trim().toLowerCase(), this.sorter.sort(e)
    },
    filter: function(e) {
        this.sorter.filter(e)
    },
    filterByCategory: function(e) {
        this.sorter.filterByCategory(e)
    },
    filterByTags: function(e) {
        this.sorter.filterByTags(e)
    },
    filterByText: function(e) {
        this.sorter.filterByText(e)
    },
    clearFilters: function() {
        this.sorter.clearFilter()
    }
});

