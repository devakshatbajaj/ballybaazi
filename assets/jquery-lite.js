(function (window, document) {
  function JQueryLite(selector) {
    if (typeof selector === "function") {
      if (document.readyState !== "loading") selector();
      else document.addEventListener("DOMContentLoaded", selector);
      this.elements = [];
      return;
    }

    if (selector === window || selector === document || selector instanceof Element) {
      this.elements = [selector];
      this.length = 1;
      return;
    }

    if (!selector) {
      this.elements = [];
      this.length = 0;
      return;
    }

    this.elements = Array.prototype.slice.call(document.querySelectorAll(selector));
    this.length = this.elements.length;
  }

  JQueryLite.prototype.each = function (callback) {
    this.elements.forEach(function (element, index) {
      callback.call(element, index, element);
    });
    return this;
  };

  JQueryLite.prototype.on = function (eventName, handler) {
    return this.each(function () {
      this.addEventListener(eventName, handler);
    });
  };

  JQueryLite.prototype.addClass = function (className) {
    return this.each(function () {
      this.classList.add(className);
    });
  };

  JQueryLite.prototype.removeClass = function (className) {
    return this.each(function () {
      this.classList.remove(className);
    });
  };

  JQueryLite.prototype.toggleClass = function (className) {
    return this.each(function () {
      this.classList.toggle(className);
    });
  };

  JQueryLite.prototype.hasClass = function (className) {
    return Boolean(this.elements[0] && this.elements[0].classList.contains(className));
  };

  JQueryLite.prototype.attr = function (name, value) {
    if (value === undefined) return this.elements[0] ? this.elements[0].getAttribute(name) : undefined;
    return this.each(function (index) {
      var nextValue = typeof value === "function" ? value.call(this, index, this.getAttribute(name)) : value;
      this.setAttribute(name, nextValue);
    });
  };

  JQueryLite.prototype.text = function (value) {
    if (value === undefined) return this.elements[0] ? this.elements[0].textContent : "";
    return this.each(function () {
      this.textContent = value;
    });
  };

  JQueryLite.prototype.val = function (value) {
    if (value === undefined) return this.elements[0] ? this.elements[0].value : "";
    return this.each(function () {
      this.value = value;
    });
  };

  JQueryLite.prototype.find = function (selector) {
    var found = [];
    this.each(function () {
      found = found.concat(Array.prototype.slice.call(this.querySelectorAll(selector)));
    });
    var result = new JQueryLite();
    result.elements = found;
    result.length = found.length;
    return result;
  };

  JQueryLite.prototype.css = function (property, value) {
    if (typeof property === "object") {
      return this.each(function () {
        for (var key in property) this.style.setProperty(key, property[key]);
      });
    }

    return this.each(function () {
      this.style.setProperty(property, value);
    });
  };

  JQueryLite.prototype.data = function (name, value) {
    if (!this.elements[0]) return undefined;
    if (value === undefined) return this.elements[0].dataset[name];
    return this.each(function () {
      this.dataset[name] = value;
    });
  };

  JQueryLite.prototype.offset = function () {
    if (!this.elements[0] || !this.elements[0].getBoundingClientRect) return { top: 0, left: 0 };
    var box = this.elements[0].getBoundingClientRect();
    return {
      top: box.top + window.pageYOffset,
      left: box.left + window.pageXOffset
    };
  };

  JQueryLite.prototype.height = function () {
    if (this.elements[0] === window) return window.innerHeight;
    return this.elements[0] ? this.elements[0].offsetHeight : 0;
  };

  JQueryLite.prototype.scrollTop = function () {
    if (this.elements[0] === window) return window.pageYOffset || document.documentElement.scrollTop || 0;
    return this.elements[0] ? this.elements[0].scrollTop : 0;
  };

  JQueryLite.prototype.fadeOut = function (duration) {
    return this.each(function () {
      var element = this;
      element.style.transition = "opacity " + duration + "ms ease";
      element.style.opacity = "0";
      window.setTimeout(function () {
        element.style.display = "none";
      }, duration);
    });
  };

  JQueryLite.prototype.toggle = function (state) {
    return this.each(function () {
      this.style.display = state ? "" : "none";
    });
  };

  JQueryLite.prototype.trigger = function (eventName) {
    return this.each(function () {
      this.dispatchEvent(new Event(eventName, { bubbles: true }));
    });
  };

  window.$ = function (selector) {
    return new JQueryLite(selector);
  };
})(window, document);
