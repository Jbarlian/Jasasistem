"use strict";
var _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(t) {
        return typeof t
    } : function(t) {
        return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t
    },
    URLSearchParams = URLSearchParams || function() {
        function t(t) {
            return encodeURIComponent(t).replace(a, s)
        }
        function e(t) {
            return decodeURIComponent(t.replace(i, " "))
        }
        function r(t) {
            if (this[l] = Object.create(null), t)
                for (var r, n, a = (t || "").split("&"), i = 0, o = a.length; i < o; i++)
                    -1 < (r = (n = a[i]).indexOf("=")) && this.append(e(n.slice(0, r)), e(n.slice(r + 1)))
        }
        var n = r.prototype,
            a = /[!'\(\)~]|%20|%00/g,
            i = /\+/g,
            o = {
                "!": "%21",
                "'": "%27",
                "(": "%28",
                ")": "%29",
                "~": "%7E",
                "%20": "+",
                "%00": "\0"
            },
            s = function(t) {
                return o[t]
            },
            c = function() {
                try {
                    return !!Symbol.iterator
                } catch (t) {
                    return !1
                }
            }(),
            l = "__URLSearchParams__:" + Math.random();
        n.append = function(t, e) {
            var r = this[l];
            t in r ? r[t].push("" + e) : r[t] = ["" + e]
        }, n.delete = function(t) {
            delete this[l][t]
        }, n.get = function(t) {
            var e = this[l];
            return t in e ? e[t][0] : null
        }, n.getAll = function(t) {
            var e = this[l];
            return t in e ? e[t].slice(0) : []
        }, n.has = function(t) {
            return t in this[l]
        }, n.set = function(t, e) {
            this[l][t] = ["" + e]
        }, n.forEach = function(t, e) {
            var r = this[l];
            Object.getOwnPropertyNames(r).forEach(function(n) {
                r[n].forEach(function(r) {
                    t.call(e, r, n, this)
                }, this)
            }, this)
        }, n.keys = function() {
            var t = [];
            this.forEach(function(e, r) {
                t.push(r)
            });
            var e = {
                next: function() {
                    var e = t.shift();
                    return {
                        done: void 0 === e,
                        value: e
                    }
                }
            };
            return c && (e[Symbol.iterator] = function() {
                return e
            }), e
        }, n.values = function() {
            var t = [];
            this.forEach(function(e) {
                t.push(e)
            });
            var e = {
                next: function() {
                    var e = t.shift();
                    return {
                        done: void 0 === e,
                        value: e
                    }
                }
            };
            return c && (e[Symbol.iterator] = function() {
                return e
            }), e
        }, n.entries = function() {
            var t = [];
            this.forEach(function(e, r) {
                t.push([r, e])
            });
            var e = {
                next: function() {
                    var e = t.shift();
                    return {
                        done: void 0 === e,
                        value: e
                    }
                }
            };
            return c && (e[Symbol.iterator] = function() {
                return e
            }), e
        }, c && (n[Symbol.iterator] = n.entries), n.toJSON = function() {
            return {}
        }, n.toString = function() {
            var e,
                r,
                n,
                a,
                i = this[l],
                o = [];
            for (r in i)
                for (n = t(r), e = 0, a = i[r]; e < a.length; e++)
                    o.push(n + "=" + t(a[e]));
            return o.join("&")
        };
        var u = Object.defineProperty,
            f = Object.getOwnPropertyDescriptor,
            h = function(t) {
                function e(e, r) {
                    n.append.call(this, e, r), e = this.toString(), t.set.call(this._usp, e ? "?" + e : "")
                }
                function r(e) {
                    n.delete.call(this, e), e = this.toString(), t.set.call(this._usp, e ? "?" + e : "")
                }
                function a(e, r) {
                    n.set.call(this, e, r), e = this.toString(), t.set.call(this._usp, e ? "?" + e : "")
                }
                return function(t, n) {
                    return t.append = e, t.delete = r, t.set = a, u(t, "_usp", {
                        configurable: !0,
                        writable: !0,
                        value: n
                    })
                }
            },
            d = function(t) {
                var e = t.append;
                t.append = n.append, r.call(t, t._usp.search.slice(1)), t.append = e
            },
            p = function(t, e) {
                if (!(t instanceof e))
                    throw new TypeError("'searchParams' accessed on an object that does not implement interface " + e.name)
            },
            v = function(t) {
                var e,
                    n = t.prototype,
                    a = f(n, "searchParams"),
                    i = f(n, "href"),
                    o = f(n, "search");
                !a && o && o.set && (e = function(t) {
                    return function(e, r) {
                        return u(e, "_searchParams", {
                            configurable: !0,
                            writable: !0,
                            value: t(r, e)
                        }), r
                    }
                }(h(o)), Object.defineProperties(n, {
                    href: {
                        get: function() {
                            return i.get.call(this)
                        },
                        set: function(t) {
                            var e = this._searchParams;
                            i.set.call(this, t), e && d(e)
                        }
                    },
                    search: {
                        get: function() {
                            return o.get.call(this)
                        },
                        set: function(t) {
                            var e = this._searchParams;
                            o.set.call(this, t), e && d(e)
                        }
                    },
                    searchParams: {
                        get: function() {
                            return p(this, t), this._searchParams || e(this, new r(this.search.slice(1)))
                        },
                        set: function(r) {
                            p(this, t), e(this, r)
                        }
                    }
                }))
            };
        return v(HTMLAnchorElement), /^function|object$/.test("undefined" == typeof URL ? "undefined" : _typeof(URL)) && v(URL), r
    }();
!function(t, e) {
    var r = function() {
        "serviceWorker" in navigator && navigator.serviceWorker.ready.then(function(t) {
            t.unregister()
        }), function() {
            if ("registerElement" in e && "import" in e.createElement("link") && "content" in e.createElement("template"))
                e.dispatchEvent(new Event("WebComponentsReady"));
            else {
                var t = e.createElement("script");
                t.async = !0, t.src = "/bower_components/webcomponentsjs/webcomponents-lite.min.js", e.head.appendChild(t)
            }
        }()
    };
    e.addEventListener("AppReady", function() {
        e.body.classList.remove("loading")
    }), e.addEventListener("WebComponentsReady", function() {
        var r = function() {
            var r = e.querySelector("#app");
            function n() {
                var t = e.querySelector(".js-lucky-link");
                if (t) {
                    var n = r.$.cards.querySelectorAll(".codelab-card");
                    if (n.length < 2)
                        return t.href = "#", void (t.parentNode.style.display = "none");
                    var a = Math.floor(Math.random() * n.length);
                    t.href = n[a].href, t.parentNode.style.display = null
                }
            }
            r.categoryStartCards = {}, r.kioskTags = [], r.addEventListener("dom-change", function(t) {
                if (!r._readied) {
                    var n = e.querySelectorAll(".codelab-card");
                    Array.prototype.forEach.call(n, function(t, e) {
                        var n = t.getAttribute("data-category");
                        void 0 === r.categoryStartCards[n] && (r.categoryStartCards[n] = t)
                    })
                }
            }), r.codelabUrl = function(t, e) {
                var r = "index=" + encodeURIComponent("../.." + t.url);
                return t.ga && (r += "&viewga=" + t.ga), e.url + "?" + r
            }, r.sortBy = function(t, e) {
                var r = e.item.textContent.trim().toLowerCase();
                this.$.cards.sort(r)
            }, r.filterBy = function(t, e) {
                e.hasOwnProperty("selected") ? this.$.cards.filterByCategory(e.selected) : (e.kioskTags = r.kioskTags, this.$.cards.filter(e))
            }, r.onCategoryActivate = function(e, r) {
                var a = e.target.selectedItem;
                a && a.getAttribute("filter") === r.selected && (r.selected = null), r.selected || this.async(function() {
                    e.target.selected = null
                }), this.filterBy(e, {
                    selected: r.selected
                });
                var i = new URLSearchParams(t.location.search.slice(1));
                i.delete("cat"), r.selected && i.set("cat", r.selected);
                var o = t.location.pathname,
                    s = "?" + i;
                "?" !== s && (o += s), t.history.pushState({}, "", o), n()
            };
            var a = e.querySelector("#chips");
            return a && a.addEventListener("click", function(t) {
                if (t.preventDefault(), t.stopPropagation(), t.target.getAttribute("filter")) {
                    t.target.classList.toggle("selected");
                    for (var e = [], i = a.querySelectorAll(".js-chips__item.selected"), o = 0; o < i.length; o++) {
                        var s = i[o].getAttribute("filter");
                        s && e.push(s)
                    }
                    r.filterBy(null, {
                        tags: e
                    }), n()
                }
            }), r.reconstructFromURL = function() {
                for (var e = new URLSearchParams(t.location.search.slice(1)), i = e.get("cat"), o = e.getAll("tags"), s = e.get("filter"), c = o.length; c--;)
                    "kiosk" !== o[c] && "kiosk-" !== o[c].substr(0, 6) || (r.kioskTags.push(o[c]), o.splice(c, 1));
                this.$.categorylist && (this.$.categorylist.selected = i), this.$.sidelist && (this.$.sidelist.selected = i), o && function(t) {
                    if (a) {
                        t = Array.isArray(t) ? t : [t];
                        for (var e = a.querySelectorAll(".js-chips__item"), r = 0; r < e.length; r++) {
                            var n = e[r];
                            -1 != t.indexOf(n.getAttribute("filter")) ? n.classList.add("selected") : n.classList.remove("selected")
                        }
                    }
                }(o), this.filterBy(null, {
                    cat: i,
                    tags: o
                }), s && (r.searchVal = s, r.onSearchKeyDown()), n()
            }, r.navigate = function(e) {
                e.preventDefault();
                var r = function(e) {
                        t.location.href = e
                    },
                    n = e.currentTarget;
                n.hasAttribute("data-wait-for-ripple") ? n.addEventListener("transitionend", r.bind(n, n.href)) : r(n.href)
            }, r.clearSearch = function(t, e) {
                this.searchVal = null, this.$.cards.filterByText(null)
            }, r.onSearchKeyDown = function(t, e) {
                this.debounce("search", function() {
                    this.$.cards.filterByText(r.searchVal)
                }, 250)
            }, r
        }();
        t.addEventListener("popstate", function() {
            r.reconstructFromURL()
        }), r._setupDebouncers && r._setupDebouncers(), r.reconstructFromURL(), e.dispatchEvent(new Event("AppReady"))
    }), "complete" === e.readyState || "loaded" === e.readyState || "interactive" === e.readyState ? r() : e.addEventListener("DOMContentLoaded", r)
}(window, document);

