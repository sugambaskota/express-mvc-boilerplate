import { Express } from "express";
import { engine } from "express-handlebars";
import * as path from "path";

export const configureHbs = (app: Express) => {
  app.engine(
    ".hbs",
    engine({
      extname: ".hbs",
      helpers,
    }),
  );

  app.set("view engine", ".hbs");
  app.set("views", path.join(__dirname, "..", "..", "views"));
};

// hbs helpers
const helpers = {
  section: function (name, options) {
    if (!this._sections) {
      this._sections = {};
    }
    this._sections[name] = options.fn(this);
    return null;
  },
  inc: function (value, _options) {
    return +value + 1;
  },
  dec: function (value, _options) {
    return +value - 1;
  },
  add: function (val1, val2, _options) {
    return +val1 + +val2;
  },
  sub: function (val1, val2, _options) {
    return +val1 - +val2;
  },
  mul: function (val1, val2, _options) {
    return +val1 * +val2;
  },
  div: function (val1, val2, _options) {
    return +val1 / +val2;
  },
  floor: function (val, _options) {
    return Math.floor(val);
  },
  ceil: function (val, _options) {
    return Math.ceil(val);
  },
  times: function (val, options) {
    let acc = "";
    for (let i = 1; i <= val; i++) {
      acc += options.fn(i);
    }
    return acc;
  },
  compare: function (lval, rval, options) {
    if (arguments.length < 3) throw new Error("'compare' needs 2 parameters");

    let operator = options.hash.operator || "==";

    let operators = {
      "==": function (l, r) {
        return l == r;
      },
      "===": function (l, r) {
        return l === r;
      },
      "!=": function (l, r) {
        return l != r;
      },
      "<": function (l, r) {
        return l < r;
      },
      ">": function (l, r) {
        return l > r;
      },
      "<=": function (l, r) {
        return l <= r;
      },
      ">=": function (l, r) {
        return l >= r;
      },
      typeof: function (l, r) {
        return typeof l == r;
      },
    };

    if (!operators[operator])
      throw new Error("'compare' doesn't know the operator " + operator);

    let result = operators[operator](lval, rval);

    if (result) {
      return options.fn(this);
    } else {
      return options.inverse(this);
    }
  },
};
