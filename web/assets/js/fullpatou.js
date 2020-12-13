(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.FullPatou = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _resize = require("./resize");

var _scrollTo = require("./scroll-to");

function resizeHandler(e) {
  _resize.resize.call(this);
}

function keydownHandler(e) {
  switch (e.keyCode) {
    case 38:
      // arrow up
      e.preventDefault();

      _scrollTo.scrollUp.call(this);

      break;

    case 32:
    case 40:
      // arrow down
      e.preventDefault();

      _scrollTo.scrollDown.call(this);

      break;
  }
}

var _default = {
  resize: resizeHandler,
  keydown: keydownHandler
};
exports["default"] = _default;
},{"./resize":2,"./scroll-to":3}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.resize = resize;
exports.destroy = destroy;

function resize() {
  // this.sections.forEach(e => e.style.height = `${window.innerHeight || document.documentElement.offsetHeight}px`);
  document.body.style.height = "".concat(window.innerHeight || document.documentElement.offsetHeight, "px");
}

function destroy() {
  // this.sections.forEach(e => e.style.height = null); 
  document.body.style.height = null;
}
},{}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.scrollTo = scrollTo;
exports.scrollUp = scrollUp;
exports.scrollDown = scrollDown;

function scrollTo(position) {
  if (position <= 0 || position > this.sections.length) return;
  this.position = position;
  console.log('scrollTo()', position);
  console.log(this.sections[position - 1]);
}

function scrollUp() {
  if (this.position === 0) return;
  scrollTo.call(this, this.position - 1);
}

function scrollDown() {
  if (this.position === this.sections.length) return;
  scrollTo.call(this, this.position + 1);
}
},{}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _default;

var _handlers = _interopRequireDefault(require("../functions/handlers"));

var _resize = require("../functions/resize");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _default() {
  var _this = this;

  document.documentElement.classList.remove('fp');
  this.sections.forEach(function (e) {
    return e.classList.remove('fp-content');
  });

  _resize.destroy.call(this);

  Object.keys(_handlers["default"]).forEach(function (e) {
    window.removeEventListener(e, _handlers["default"][e].bind(_this));
  });
}
},{"../functions/handlers":1,"../functions/resize":2}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _default;

var _handlers = _interopRequireDefault(require("../functions/handlers"));

var _resize = require("../functions/resize");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _default() {
  var _this = this;

  document.documentElement.classList.add('fp');
  this.sections.forEach(function (e) {
    return e.classList.add('fp-content');
  });

  _resize.resize.call(this);

  Object.keys(_handlers["default"]).forEach(function (e) {
    window.addEventListener(e, _handlers["default"][e].bind(_this));
  });
}
},{"../functions/handlers":1,"../functions/resize":2}],6:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _default = {
  section: 'section',
  // HTML Element
  duration: 1000,
  navigation: true,
  navigationPosition: 'right',
  navigationInvertColor: true,
  onAnimationStart: function onAnimationStart() {},
  onAnimationEnd: function onAnimationEnd() {}
};
exports["default"] = _default;
},{}],7:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = getElement;

function getElement(target) {
  if (target instanceof Element || target instanceof HTMLDocument) return target;else if (typeof target === 'string' || target instanceof String) return document.querySelectorAll(target);
}

;
},{}],8:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = FullPatou;

var _options = _interopRequireDefault(require("./instances/options"));

var _getElement = _interopRequireDefault(require("./utils/get-element"));

var _destroy = _interopRequireDefault(require("./instances/methods/destroy"));

var _init = _interopRequireDefault(require("./instances/methods/init"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function FullPatou() {
  var _this = this;

  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  this.target = options.target ? options.target === document.documentElement ? document.documentElement : (0, _getElement["default"])(options.target)[0] : document.documentElement;
  options.target = this.target; // Use default options

  Object.keys(_options["default"]).forEach(function (e) {
    if (options[e] === undefined) options[e] = _options["default"][e];
  });
  this.sections = document.querySelectorAll(options.section);
  this.options = options;
  this.position = 1;

  this.destroy = function () {
    return _destroy["default"].call(_this);
  };

  _init["default"].call(this); // navigation.call(this); // TODO: implements navigation dots

}
},{"./instances/methods/destroy":4,"./instances/methods/init":5,"./instances/options":6,"./utils/get-element":7}]},{},[8])(8)
});
