import { format } from "util";

interface IFlashOptions {
  unsafe?: boolean;
}

/**
 * Expose `flash()` function on requests.
 *
 * @return {Function}
 * @api public
 */
export function flash(options?: IFlashOptions) {
  options = options || {};
  const safe = options.unsafe === undefined ? true : !options.unsafe;

  return function (req, _res, next) {
    if (req.flash && safe) {
      return next();
    }
    req.flash = _flash;
    next();
  };
}

/**
 * @param {String} type
 * @param {String} msg
 * @return {Array|Object|Number}
 * @api public
 */
function _flash(type, msg) {
  if (this.session === undefined) throw Error("req.flash() requires sessions");
  const msgs = (this.session.flash = this.session.flash || {});
  if (type && msg) {
    // util.format is available in Node.js 0.6+
    if (arguments.length > 2 && format) {
      const args = Array.prototype.slice.call(arguments, 1);
      msg = format.apply(undefined, args);
    } else if (Array.isArray(msg)) {
      msg.forEach(function (val) {
        (msgs[type] = msgs[type] || []).push(val);
      });
      return msgs[type].length;
    }
    return (msgs[type] = msgs[type] || []).push(msg);
  } else if (type) {
    const arr = msgs[type];
    delete msgs[type];
    return arr || [];
  } else {
    this.session.flash = {};
    return msgs;
  }
}
