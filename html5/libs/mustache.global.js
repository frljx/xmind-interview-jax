var JaxMustache = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // packages/mustache/src/index.ts
  var src_exports = {};
  __export(src_exports, {
    render: () => render
  });

  // packages/shared/src/index.ts
  var isArray = (arr, len) => {
    if (len) {
      return Array.isArray(arr) && arr.length > 0;
    } else {
      return Array.isArray(arr);
    }
  };

  // packages/mustache/src/bind-data.ts
  var bind = (arr, data2, component2) => {
    let index = 0;
    let res = "";
    while (index < arr.length) {
      let item = arr[index];
      if (item[0] === "#" && isArray(item[2])) {
        if (isArray(data2[item[1]])) {
          res += loop(item, data2[item[1]], component2);
        }
      } else if (item[0] === "name") {
        if (item[1] === ".") {
          res += data2;
        } else {
          res += executeText(data2, item[1], component2) || "";
        }
      } else {
        res += item[1];
      }
      index++;
    }
    return res;
  };
  var executeText = (data, text, component) => {
    let headCode = "";
    if (typeof data !== "object") {
      text = text.replace(/\.[^\w]/, JSON.stringify(data));
      data = window[component.namespace];
    }
    let keys = Reflect.ownKeys(data);
    keys.forEach((k) => {
      headCode += `let ${String(k)} = data[${JSON.stringify(k)}];`;
    });
    if (/\$[\s\S]/.test(text)) {
      text = text.replace(/\$([\s\S]+)/, (_, $1) => `${component.namespace}.${$1}(event)`);
      return text;
    }
    if (/\^(\w+)/.test(text)) {
      let upper = text.match(/\^(\w+)/);
      text = text.replace(/\^(\w+)/, "$1");
      if (upper && upper[1]) {
        headCode += `let ${String(upper[1])} = component.data[${JSON.stringify(upper[1])}];`;
      }
    }
    let code = headCode + text;
    return eval(code);
  };
  var loop = (token, data2, component2) => {
    let res = "";
    for (let i = 0; i < data2.length; i++) {
      res += bind(token[2], data2[i], component2);
    }
    return res;
  };
  var bind_data_default = bind;

  // packages/mustache/src/nest-tokens.ts
  var nestTokens = (arr) => {
    let stack = [];
    let index = 0;
    while (index < arr.length) {
      let token = arr[index];
      if (token[0] === "#") {
        stack.push(token);
        token[2] = [];
      } else if (token[0] === "/") {
        stack.pop();
        arr.splice(index--, 1);
      } else {
        if (stack.length) {
          stack[stack.length - 1][2].push(token);
          arr.splice(index--, 1);
        }
      }
      index++;
    }
    return arr;
  };
  var nest_tokens_default = nestTokens;

  // packages/mustache/src/scanner.ts
  var splitReg = /(\{{1,2}\s?.*?\s?\}{1,2})/;
  var tagReg = /\{{1,2}\s?(.*?)\s?\}{1,2}/;
  var scanner = (templateStr) => {
    templateStr = templateStr.replace(/\s{1,}/g, " ");
    let split = templateStr.split(splitReg);
    let res = [];
    for (let i = 0; i < split.length; i++) {
      let item = split[i];
      if (item[0] === "{") {
        let matched = item.match(tagReg);
        if (matched) {
          if (matched[1][0] === "#" || matched[1][0] === "/") {
            res.push([`${matched[1][0]}`, matched[1].substring(1)]);
          } else {
            res.push(["name", matched[1]]);
          }
        }
      } else {
        res.push(["text", item]);
      }
    }
    return nest_tokens_default(res);
  };

  // packages/mustache/src/index.ts
  var render = (templateStr, component2) => {
    let tokens = scanner(templateStr);
    let doms = bind_data_default(tokens, component2.data, component2);
    return doms;
  };
  return __toCommonJS(src_exports);
})();
//# sourceMappingURL=mustache.global.js.map
