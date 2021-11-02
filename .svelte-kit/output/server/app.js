var __accessCheck = (obj, member, msg) => {
  if (!member.has(obj))
    throw TypeError("Cannot " + msg);
};
var __privateGet = (obj, member, getter) => {
  __accessCheck(obj, member, "read from private field");
  return getter ? getter.call(obj) : member.get(obj);
};
var __privateAdd = (obj, member, value) => {
  if (member.has(obj))
    throw TypeError("Cannot add the same private member more than once");
  member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
};
var __privateSet = (obj, member, value, setter) => {
  __accessCheck(obj, member, "write to private field");
  setter ? setter.call(obj, value) : member.set(obj, value);
  return value;
};
var _map;
import cookie from "cookie";
import { v4 } from "@lukeed/uuid";
function get_single_valued_header(headers, key) {
  const value = headers[key];
  if (Array.isArray(value)) {
    if (value.length === 0) {
      return void 0;
    }
    if (value.length > 1) {
      throw new Error(`Multiple headers provided for ${key}. Multiple may be provided only for set-cookie`);
    }
    return value[0];
  }
  return value;
}
function coalesce_to_error(err) {
  return err instanceof Error || err && err.name && err.message ? err : new Error(JSON.stringify(err));
}
function lowercase_keys(obj) {
  const clone = {};
  for (const key in obj) {
    clone[key.toLowerCase()] = obj[key];
  }
  return clone;
}
function error$1(body) {
  return {
    status: 500,
    body,
    headers: {}
  };
}
function is_string(s2) {
  return typeof s2 === "string" || s2 instanceof String;
}
function is_content_type_textual(content_type) {
  if (!content_type)
    return true;
  const [type] = content_type.split(";");
  return type === "text/plain" || type === "application/json" || type === "application/x-www-form-urlencoded" || type === "multipart/form-data";
}
async function render_endpoint(request, route, match) {
  const mod = await route.load();
  const handler = mod[request.method.toLowerCase().replace("delete", "del")];
  if (!handler) {
    return;
  }
  const params = route.params(match);
  const response = await handler({ ...request, params });
  const preface = `Invalid response from route ${request.path}`;
  if (!response) {
    return;
  }
  if (typeof response !== "object") {
    return error$1(`${preface}: expected an object, got ${typeof response}`);
  }
  let { status = 200, body, headers = {} } = response;
  headers = lowercase_keys(headers);
  const type = get_single_valued_header(headers, "content-type");
  const is_type_textual = is_content_type_textual(type);
  if (!is_type_textual && !(body instanceof Uint8Array || is_string(body))) {
    return error$1(`${preface}: body must be an instance of string or Uint8Array if content-type is not a supported textual content-type`);
  }
  let normalized_body;
  if ((typeof body === "object" || typeof body === "undefined") && !(body instanceof Uint8Array) && (!type || type.startsWith("application/json"))) {
    headers = { ...headers, "content-type": "application/json; charset=utf-8" };
    normalized_body = JSON.stringify(typeof body === "undefined" ? {} : body);
  } else {
    normalized_body = body;
  }
  return { status, body: normalized_body, headers };
}
var chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_$";
var unsafeChars = /[<>\b\f\n\r\t\0\u2028\u2029]/g;
var reserved = /^(?:do|if|in|for|int|let|new|try|var|byte|case|char|else|enum|goto|long|this|void|with|await|break|catch|class|const|final|float|short|super|throw|while|yield|delete|double|export|import|native|return|switch|throws|typeof|boolean|default|extends|finally|package|private|abstract|continue|debugger|function|volatile|interface|protected|transient|implements|instanceof|synchronized)$/;
var escaped$1 = {
  "<": "\\u003C",
  ">": "\\u003E",
  "/": "\\u002F",
  "\\": "\\\\",
  "\b": "\\b",
  "\f": "\\f",
  "\n": "\\n",
  "\r": "\\r",
  "	": "\\t",
  "\0": "\\0",
  "\u2028": "\\u2028",
  "\u2029": "\\u2029"
};
var objectProtoOwnPropertyNames = Object.getOwnPropertyNames(Object.prototype).sort().join("\0");
function devalue(value) {
  var counts = new Map();
  function walk(thing) {
    if (typeof thing === "function") {
      throw new Error("Cannot stringify a function");
    }
    if (counts.has(thing)) {
      counts.set(thing, counts.get(thing) + 1);
      return;
    }
    counts.set(thing, 1);
    if (!isPrimitive(thing)) {
      var type = getType(thing);
      switch (type) {
        case "Number":
        case "String":
        case "Boolean":
        case "Date":
        case "RegExp":
          return;
        case "Array":
          thing.forEach(walk);
          break;
        case "Set":
        case "Map":
          Array.from(thing).forEach(walk);
          break;
        default:
          var proto = Object.getPrototypeOf(thing);
          if (proto !== Object.prototype && proto !== null && Object.getOwnPropertyNames(proto).sort().join("\0") !== objectProtoOwnPropertyNames) {
            throw new Error("Cannot stringify arbitrary non-POJOs");
          }
          if (Object.getOwnPropertySymbols(thing).length > 0) {
            throw new Error("Cannot stringify POJOs with symbolic keys");
          }
          Object.keys(thing).forEach(function(key) {
            return walk(thing[key]);
          });
      }
    }
  }
  walk(value);
  var names = new Map();
  Array.from(counts).filter(function(entry) {
    return entry[1] > 1;
  }).sort(function(a, b) {
    return b[1] - a[1];
  }).forEach(function(entry, i) {
    names.set(entry[0], getName(i));
  });
  function stringify(thing) {
    if (names.has(thing)) {
      return names.get(thing);
    }
    if (isPrimitive(thing)) {
      return stringifyPrimitive(thing);
    }
    var type = getType(thing);
    switch (type) {
      case "Number":
      case "String":
      case "Boolean":
        return "Object(" + stringify(thing.valueOf()) + ")";
      case "RegExp":
        return "new RegExp(" + stringifyString(thing.source) + ', "' + thing.flags + '")';
      case "Date":
        return "new Date(" + thing.getTime() + ")";
      case "Array":
        var members = thing.map(function(v, i) {
          return i in thing ? stringify(v) : "";
        });
        var tail = thing.length === 0 || thing.length - 1 in thing ? "" : ",";
        return "[" + members.join(",") + tail + "]";
      case "Set":
      case "Map":
        return "new " + type + "([" + Array.from(thing).map(stringify).join(",") + "])";
      default:
        var obj = "{" + Object.keys(thing).map(function(key) {
          return safeKey(key) + ":" + stringify(thing[key]);
        }).join(",") + "}";
        var proto = Object.getPrototypeOf(thing);
        if (proto === null) {
          return Object.keys(thing).length > 0 ? "Object.assign(Object.create(null)," + obj + ")" : "Object.create(null)";
        }
        return obj;
    }
  }
  var str = stringify(value);
  if (names.size) {
    var params_1 = [];
    var statements_1 = [];
    var values_1 = [];
    names.forEach(function(name, thing) {
      params_1.push(name);
      if (isPrimitive(thing)) {
        values_1.push(stringifyPrimitive(thing));
        return;
      }
      var type = getType(thing);
      switch (type) {
        case "Number":
        case "String":
        case "Boolean":
          values_1.push("Object(" + stringify(thing.valueOf()) + ")");
          break;
        case "RegExp":
          values_1.push(thing.toString());
          break;
        case "Date":
          values_1.push("new Date(" + thing.getTime() + ")");
          break;
        case "Array":
          values_1.push("Array(" + thing.length + ")");
          thing.forEach(function(v, i) {
            statements_1.push(name + "[" + i + "]=" + stringify(v));
          });
          break;
        case "Set":
          values_1.push("new Set");
          statements_1.push(name + "." + Array.from(thing).map(function(v) {
            return "add(" + stringify(v) + ")";
          }).join("."));
          break;
        case "Map":
          values_1.push("new Map");
          statements_1.push(name + "." + Array.from(thing).map(function(_a) {
            var k = _a[0], v = _a[1];
            return "set(" + stringify(k) + ", " + stringify(v) + ")";
          }).join("."));
          break;
        default:
          values_1.push(Object.getPrototypeOf(thing) === null ? "Object.create(null)" : "{}");
          Object.keys(thing).forEach(function(key) {
            statements_1.push("" + name + safeProp(key) + "=" + stringify(thing[key]));
          });
      }
    });
    statements_1.push("return " + str);
    return "(function(" + params_1.join(",") + "){" + statements_1.join(";") + "}(" + values_1.join(",") + "))";
  } else {
    return str;
  }
}
function getName(num) {
  var name = "";
  do {
    name = chars[num % chars.length] + name;
    num = ~~(num / chars.length) - 1;
  } while (num >= 0);
  return reserved.test(name) ? name + "_" : name;
}
function isPrimitive(thing) {
  return Object(thing) !== thing;
}
function stringifyPrimitive(thing) {
  if (typeof thing === "string")
    return stringifyString(thing);
  if (thing === void 0)
    return "void 0";
  if (thing === 0 && 1 / thing < 0)
    return "-0";
  var str = String(thing);
  if (typeof thing === "number")
    return str.replace(/^(-)?0\./, "$1.");
  return str;
}
function getType(thing) {
  return Object.prototype.toString.call(thing).slice(8, -1);
}
function escapeUnsafeChar(c) {
  return escaped$1[c] || c;
}
function escapeUnsafeChars(str) {
  return str.replace(unsafeChars, escapeUnsafeChar);
}
function safeKey(key) {
  return /^[_$a-zA-Z][_$a-zA-Z0-9]*$/.test(key) ? key : escapeUnsafeChars(JSON.stringify(key));
}
function safeProp(key) {
  return /^[_$a-zA-Z][_$a-zA-Z0-9]*$/.test(key) ? "." + key : "[" + escapeUnsafeChars(JSON.stringify(key)) + "]";
}
function stringifyString(str) {
  var result = '"';
  for (var i = 0; i < str.length; i += 1) {
    var char = str.charAt(i);
    var code = char.charCodeAt(0);
    if (char === '"') {
      result += '\\"';
    } else if (char in escaped$1) {
      result += escaped$1[char];
    } else if (code >= 55296 && code <= 57343) {
      var next = str.charCodeAt(i + 1);
      if (code <= 56319 && (next >= 56320 && next <= 57343)) {
        result += char + str[++i];
      } else {
        result += "\\u" + code.toString(16).toUpperCase();
      }
    } else {
      result += char;
    }
  }
  result += '"';
  return result;
}
function noop() {
}
function safe_not_equal(a, b) {
  return a != a ? b == b : a !== b || (a && typeof a === "object" || typeof a === "function");
}
Promise.resolve();
const subscriber_queue = [];
function writable(value, start = noop) {
  let stop;
  const subscribers = new Set();
  function set(new_value) {
    if (safe_not_equal(value, new_value)) {
      value = new_value;
      if (stop) {
        const run_queue = !subscriber_queue.length;
        for (const subscriber of subscribers) {
          subscriber[1]();
          subscriber_queue.push(subscriber, value);
        }
        if (run_queue) {
          for (let i = 0; i < subscriber_queue.length; i += 2) {
            subscriber_queue[i][0](subscriber_queue[i + 1]);
          }
          subscriber_queue.length = 0;
        }
      }
    }
  }
  function update(fn) {
    set(fn(value));
  }
  function subscribe(run2, invalidate = noop) {
    const subscriber = [run2, invalidate];
    subscribers.add(subscriber);
    if (subscribers.size === 1) {
      stop = start(set) || noop;
    }
    run2(value);
    return () => {
      subscribers.delete(subscriber);
      if (subscribers.size === 0) {
        stop();
        stop = null;
      }
    };
  }
  return { set, update, subscribe };
}
function hash(value) {
  let hash2 = 5381;
  let i = value.length;
  if (typeof value === "string") {
    while (i)
      hash2 = hash2 * 33 ^ value.charCodeAt(--i);
  } else {
    while (i)
      hash2 = hash2 * 33 ^ value[--i];
  }
  return (hash2 >>> 0).toString(36);
}
const escape_json_string_in_html_dict = {
  '"': '\\"',
  "<": "\\u003C",
  ">": "\\u003E",
  "/": "\\u002F",
  "\\": "\\\\",
  "\b": "\\b",
  "\f": "\\f",
  "\n": "\\n",
  "\r": "\\r",
  "	": "\\t",
  "\0": "\\0",
  "\u2028": "\\u2028",
  "\u2029": "\\u2029"
};
function escape_json_string_in_html(str) {
  return escape$1(str, escape_json_string_in_html_dict, (code) => `\\u${code.toString(16).toUpperCase()}`);
}
const escape_html_attr_dict = {
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;"
};
function escape_html_attr(str) {
  return '"' + escape$1(str, escape_html_attr_dict, (code) => `&#${code};`) + '"';
}
function escape$1(str, dict, unicode_encoder) {
  let result = "";
  for (let i = 0; i < str.length; i += 1) {
    const char = str.charAt(i);
    const code = char.charCodeAt(0);
    if (char in dict) {
      result += dict[char];
    } else if (code >= 55296 && code <= 57343) {
      const next = str.charCodeAt(i + 1);
      if (code <= 56319 && next >= 56320 && next <= 57343) {
        result += char + str[++i];
      } else {
        result += unicode_encoder(code);
      }
    } else {
      result += char;
    }
  }
  return result;
}
const s$1 = JSON.stringify;
async function render_response({
  branch,
  options: options2,
  $session,
  page_config,
  status,
  error: error2,
  page
}) {
  const css2 = new Set(options2.entry.css);
  const js = new Set(options2.entry.js);
  const styles = new Set();
  const serialized_data = [];
  let rendered;
  let is_private = false;
  let maxage;
  if (error2) {
    error2.stack = options2.get_stack(error2);
  }
  if (page_config.ssr) {
    branch.forEach(({ node, loaded, fetched, uses_credentials }) => {
      if (node.css)
        node.css.forEach((url) => css2.add(url));
      if (node.js)
        node.js.forEach((url) => js.add(url));
      if (node.styles)
        node.styles.forEach((content) => styles.add(content));
      if (fetched && page_config.hydrate)
        serialized_data.push(...fetched);
      if (uses_credentials)
        is_private = true;
      maxage = loaded.maxage;
    });
    const session = writable($session);
    const props = {
      stores: {
        page: writable(null),
        navigating: writable(null),
        session
      },
      page,
      components: branch.map(({ node }) => node.module.default)
    };
    for (let i = 0; i < branch.length; i += 1) {
      props[`props_${i}`] = await branch[i].loaded.props;
    }
    let session_tracking_active = false;
    const unsubscribe = session.subscribe(() => {
      if (session_tracking_active)
        is_private = true;
    });
    session_tracking_active = true;
    try {
      rendered = options2.root.render(props);
    } finally {
      unsubscribe();
    }
  } else {
    rendered = { head: "", html: "", css: { code: "", map: null } };
  }
  const include_js = page_config.router || page_config.hydrate;
  if (!include_js)
    js.clear();
  const links = options2.amp ? styles.size > 0 || rendered.css.code.length > 0 ? `<style amp-custom>${Array.from(styles).concat(rendered.css.code).join("\n")}</style>` : "" : [
    ...Array.from(js).map((dep) => `<link rel="modulepreload" href="${dep}">`),
    ...Array.from(css2).map((dep) => `<link rel="stylesheet" href="${dep}">`)
  ].join("\n		");
  let init2 = "";
  if (options2.amp) {
    init2 = `
		<style amp-boilerplate>body{-webkit-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-moz-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-ms-animation:-amp-start 8s steps(1,end) 0s 1 normal both;animation:-amp-start 8s steps(1,end) 0s 1 normal both}@-webkit-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-moz-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-ms-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-o-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}</style>
		<noscript><style amp-boilerplate>body{-webkit-animation:none;-moz-animation:none;-ms-animation:none;animation:none}</style></noscript>
		<script async src="https://cdn.ampproject.org/v0.js"><\/script>`;
  } else if (include_js) {
    init2 = `<script type="module">
			import { start } from ${s$1(options2.entry.file)};
			start({
				target: ${options2.target ? `document.querySelector(${s$1(options2.target)})` : "document.body"},
				paths: ${s$1(options2.paths)},
				session: ${try_serialize($session, (error3) => {
      throw new Error(`Failed to serialize session data: ${error3.message}`);
    })},
				host: ${page && page.host ? s$1(page.host) : "location.host"},
				route: ${!!page_config.router},
				spa: ${!page_config.ssr},
				trailing_slash: ${s$1(options2.trailing_slash)},
				hydrate: ${page_config.ssr && page_config.hydrate ? `{
					status: ${status},
					error: ${serialize_error(error2)},
					nodes: [
						${(branch || []).map(({ node }) => `import(${s$1(node.entry)})`).join(",\n						")}
					],
					page: {
						host: ${page && page.host ? s$1(page.host) : "location.host"}, // TODO this is redundant
						path: ${page && page.path ? try_serialize(page.path, (error3) => {
      throw new Error(`Failed to serialize page.path: ${error3.message}`);
    }) : null},
						query: new URLSearchParams(${page && page.query ? s$1(page.query.toString()) : ""}),
						params: ${page && page.params ? try_serialize(page.params, (error3) => {
      throw new Error(`Failed to serialize page.params: ${error3.message}`);
    }) : null}
					}
				}` : "null"}
			});
		<\/script>`;
  }
  if (options2.service_worker) {
    init2 += `<script>
			if ('serviceWorker' in navigator) {
				navigator.serviceWorker.register('${options2.service_worker}');
			}
		<\/script>`;
  }
  const head = [
    rendered.head,
    styles.size && !options2.amp ? `<style data-svelte>${Array.from(styles).join("\n")}</style>` : "",
    links,
    init2
  ].join("\n\n		");
  const body = options2.amp ? rendered.html : `${rendered.html}

			${serialized_data.map(({ url, body: body2, json }) => {
    let attributes = `type="application/json" data-type="svelte-data" data-url=${escape_html_attr(url)}`;
    if (body2)
      attributes += ` data-body="${hash(body2)}"`;
    return `<script ${attributes}>${json}<\/script>`;
  }).join("\n\n	")}
		`;
  const headers = {
    "content-type": "text/html"
  };
  if (maxage) {
    headers["cache-control"] = `${is_private ? "private" : "public"}, max-age=${maxage}`;
  }
  if (!options2.floc) {
    headers["permissions-policy"] = "interest-cohort=()";
  }
  return {
    status,
    headers,
    body: options2.template({ head, body })
  };
}
function try_serialize(data, fail) {
  try {
    return devalue(data);
  } catch (err) {
    if (fail)
      fail(coalesce_to_error(err));
    return null;
  }
}
function serialize_error(error2) {
  if (!error2)
    return null;
  let serialized = try_serialize(error2);
  if (!serialized) {
    const { name, message, stack } = error2;
    serialized = try_serialize({ ...error2, name, message, stack });
  }
  if (!serialized) {
    serialized = "{}";
  }
  return serialized;
}
function normalize(loaded) {
  const has_error_status = loaded.status && loaded.status >= 400 && loaded.status <= 599 && !loaded.redirect;
  if (loaded.error || has_error_status) {
    const status = loaded.status;
    if (!loaded.error && has_error_status) {
      return {
        status: status || 500,
        error: new Error()
      };
    }
    const error2 = typeof loaded.error === "string" ? new Error(loaded.error) : loaded.error;
    if (!(error2 instanceof Error)) {
      return {
        status: 500,
        error: new Error(`"error" property returned from load() must be a string or instance of Error, received type "${typeof error2}"`)
      };
    }
    if (!status || status < 400 || status > 599) {
      console.warn('"error" returned from load() without a valid status code \u2014 defaulting to 500');
      return { status: 500, error: error2 };
    }
    return { status, error: error2 };
  }
  if (loaded.redirect) {
    if (!loaded.status || Math.floor(loaded.status / 100) !== 3) {
      return {
        status: 500,
        error: new Error('"redirect" property returned from load() must be accompanied by a 3xx status code')
      };
    }
    if (typeof loaded.redirect !== "string") {
      return {
        status: 500,
        error: new Error('"redirect" property returned from load() must be a string')
      };
    }
  }
  if (loaded.context) {
    throw new Error('You are returning "context" from a load function. "context" was renamed to "stuff", please adjust your code accordingly.');
  }
  return loaded;
}
const s = JSON.stringify;
async function load_node({
  request,
  options: options2,
  state,
  route,
  page,
  node,
  $session,
  stuff,
  prerender_enabled,
  is_leaf,
  is_error,
  status,
  error: error2
}) {
  const { module } = node;
  let uses_credentials = false;
  const fetched = [];
  let set_cookie_headers = [];
  let loaded;
  const page_proxy = new Proxy(page, {
    get: (target, prop, receiver) => {
      if (prop === "query" && prerender_enabled) {
        throw new Error("Cannot access query on a page with prerendering enabled");
      }
      return Reflect.get(target, prop, receiver);
    }
  });
  if (module.load) {
    const load_input = {
      page: page_proxy,
      get session() {
        uses_credentials = true;
        return $session;
      },
      fetch: async (resource, opts = {}) => {
        let url;
        if (typeof resource === "string") {
          url = resource;
        } else {
          url = resource.url;
          opts = {
            method: resource.method,
            headers: resource.headers,
            body: resource.body,
            mode: resource.mode,
            credentials: resource.credentials,
            cache: resource.cache,
            redirect: resource.redirect,
            referrer: resource.referrer,
            integrity: resource.integrity,
            ...opts
          };
        }
        const resolved = resolve(request.path, url.split("?")[0]);
        let response;
        const prefix = options2.paths.assets || options2.paths.base;
        const filename = (resolved.startsWith(prefix) ? resolved.slice(prefix.length) : resolved).slice(1);
        const filename_html = `${filename}/index.html`;
        const asset = options2.manifest.assets.find((d) => d.file === filename || d.file === filename_html);
        if (asset) {
          response = options2.read ? new Response(options2.read(asset.file), {
            headers: asset.type ? { "content-type": asset.type } : {}
          }) : await fetch(`http://${page.host}/${asset.file}`, opts);
        } else if (resolved.startsWith("/") && !resolved.startsWith("//")) {
          const relative = resolved;
          const headers = {
            ...opts.headers
          };
          if (opts.credentials !== "omit") {
            uses_credentials = true;
            headers.cookie = request.headers.cookie;
            if (!headers.authorization) {
              headers.authorization = request.headers.authorization;
            }
          }
          if (opts.body && typeof opts.body !== "string") {
            throw new Error("Request body must be a string");
          }
          const search = url.includes("?") ? url.slice(url.indexOf("?") + 1) : "";
          const rendered = await respond({
            host: request.host,
            method: opts.method || "GET",
            headers,
            path: relative,
            rawBody: opts.body == null ? null : new TextEncoder().encode(opts.body),
            query: new URLSearchParams(search)
          }, options2, {
            fetched: url,
            initiator: route
          });
          if (rendered) {
            if (state.prerender) {
              state.prerender.dependencies.set(relative, rendered);
            }
            response = new Response(rendered.body, {
              status: rendered.status,
              headers: rendered.headers
            });
          }
        } else {
          if (resolved.startsWith("//")) {
            throw new Error(`Cannot request protocol-relative URL (${url}) in server-side fetch`);
          }
          if (typeof request.host !== "undefined") {
            const { hostname: fetch_hostname } = new URL(url);
            const [server_hostname] = request.host.split(":");
            if (`.${fetch_hostname}`.endsWith(`.${server_hostname}`) && opts.credentials !== "omit") {
              uses_credentials = true;
              opts.headers = {
                ...opts.headers,
                cookie: request.headers.cookie
              };
            }
          }
          const external_request = new Request(url, opts);
          response = await options2.hooks.externalFetch.call(null, external_request);
        }
        if (response) {
          const proxy = new Proxy(response, {
            get(response2, key, _receiver) {
              async function text() {
                const body = await response2.text();
                const headers = {};
                for (const [key2, value] of response2.headers) {
                  if (key2 === "set-cookie") {
                    set_cookie_headers = set_cookie_headers.concat(value);
                  } else if (key2 !== "etag") {
                    headers[key2] = value;
                  }
                }
                if (!opts.body || typeof opts.body === "string") {
                  fetched.push({
                    url,
                    body: opts.body,
                    json: `{"status":${response2.status},"statusText":${s(response2.statusText)},"headers":${s(headers)},"body":"${escape_json_string_in_html(body)}"}`
                  });
                }
                return body;
              }
              if (key === "text") {
                return text;
              }
              if (key === "json") {
                return async () => {
                  return JSON.parse(await text());
                };
              }
              return Reflect.get(response2, key, response2);
            }
          });
          return proxy;
        }
        return response || new Response("Not found", {
          status: 404
        });
      },
      stuff: { ...stuff }
    };
    if (is_error) {
      load_input.status = status;
      load_input.error = error2;
    }
    loaded = await module.load.call(null, load_input);
  } else {
    loaded = {};
  }
  if (!loaded && is_leaf && !is_error)
    return;
  if (!loaded) {
    throw new Error(`${node.entry} - load must return a value except for page fall through`);
  }
  return {
    node,
    loaded: normalize(loaded),
    stuff: loaded.stuff || stuff,
    fetched,
    set_cookie_headers,
    uses_credentials
  };
}
const absolute = /^([a-z]+:)?\/?\//;
function resolve(base2, path) {
  const base_match = absolute.exec(base2);
  const path_match = absolute.exec(path);
  if (!base_match) {
    throw new Error(`bad base path: "${base2}"`);
  }
  const baseparts = path_match ? [] : base2.slice(base_match[0].length).split("/");
  const pathparts = path_match ? path.slice(path_match[0].length).split("/") : path.split("/");
  baseparts.pop();
  for (let i = 0; i < pathparts.length; i += 1) {
    const part = pathparts[i];
    if (part === ".")
      continue;
    else if (part === "..")
      baseparts.pop();
    else
      baseparts.push(part);
  }
  const prefix = path_match && path_match[0] || base_match && base_match[0] || "";
  return `${prefix}${baseparts.join("/")}`;
}
async function respond_with_error({ request, options: options2, state, $session, status, error: error2 }) {
  const default_layout = await options2.load_component(options2.manifest.layout);
  const default_error = await options2.load_component(options2.manifest.error);
  const page = {
    host: request.host,
    path: request.path,
    query: request.query,
    params: {}
  };
  const loaded = await load_node({
    request,
    options: options2,
    state,
    route: null,
    page,
    node: default_layout,
    $session,
    stuff: {},
    prerender_enabled: is_prerender_enabled(options2, default_error, state),
    is_leaf: false,
    is_error: false
  });
  const branch = [
    loaded,
    await load_node({
      request,
      options: options2,
      state,
      route: null,
      page,
      node: default_error,
      $session,
      stuff: loaded ? loaded.stuff : {},
      prerender_enabled: is_prerender_enabled(options2, default_error, state),
      is_leaf: false,
      is_error: true,
      status,
      error: error2
    })
  ];
  try {
    return await render_response({
      options: options2,
      $session,
      page_config: {
        hydrate: options2.hydrate,
        router: options2.router,
        ssr: options2.ssr
      },
      status,
      error: error2,
      branch,
      page
    });
  } catch (err) {
    const error3 = coalesce_to_error(err);
    options2.handle_error(error3, request);
    return {
      status: 500,
      headers: {},
      body: error3.stack
    };
  }
}
function is_prerender_enabled(options2, node, state) {
  return options2.prerender && (!!node.module.prerender || !!state.prerender && state.prerender.all);
}
async function respond$1(opts) {
  const { request, options: options2, state, $session, route } = opts;
  let nodes;
  try {
    nodes = await Promise.all(route.a.map((id) => id ? options2.load_component(id) : void 0));
  } catch (err) {
    const error3 = coalesce_to_error(err);
    options2.handle_error(error3, request);
    return await respond_with_error({
      request,
      options: options2,
      state,
      $session,
      status: 500,
      error: error3
    });
  }
  const leaf = nodes[nodes.length - 1].module;
  let page_config = get_page_config(leaf, options2);
  if (!leaf.prerender && state.prerender && !state.prerender.all) {
    return {
      status: 204,
      headers: {},
      body: ""
    };
  }
  let branch = [];
  let status = 200;
  let error2;
  let set_cookie_headers = [];
  ssr:
    if (page_config.ssr) {
      let stuff = {};
      for (let i = 0; i < nodes.length; i += 1) {
        const node = nodes[i];
        let loaded;
        if (node) {
          try {
            loaded = await load_node({
              ...opts,
              node,
              stuff,
              prerender_enabled: is_prerender_enabled(options2, node, state),
              is_leaf: i === nodes.length - 1,
              is_error: false
            });
            if (!loaded)
              return;
            set_cookie_headers = set_cookie_headers.concat(loaded.set_cookie_headers);
            if (loaded.loaded.redirect) {
              return with_cookies({
                status: loaded.loaded.status,
                headers: {
                  location: encodeURI(loaded.loaded.redirect)
                }
              }, set_cookie_headers);
            }
            if (loaded.loaded.error) {
              ({ status, error: error2 } = loaded.loaded);
            }
          } catch (err) {
            const e = coalesce_to_error(err);
            options2.handle_error(e, request);
            status = 500;
            error2 = e;
          }
          if (loaded && !error2) {
            branch.push(loaded);
          }
          if (error2) {
            while (i--) {
              if (route.b[i]) {
                const error_node = await options2.load_component(route.b[i]);
                let node_loaded;
                let j = i;
                while (!(node_loaded = branch[j])) {
                  j -= 1;
                }
                try {
                  const error_loaded = await load_node({
                    ...opts,
                    node: error_node,
                    stuff: node_loaded.stuff,
                    prerender_enabled: is_prerender_enabled(options2, error_node, state),
                    is_leaf: false,
                    is_error: true,
                    status,
                    error: error2
                  });
                  if (error_loaded.loaded.error) {
                    continue;
                  }
                  page_config = get_page_config(error_node.module, options2);
                  branch = branch.slice(0, j + 1).concat(error_loaded);
                  break ssr;
                } catch (err) {
                  const e = coalesce_to_error(err);
                  options2.handle_error(e, request);
                  continue;
                }
              }
            }
            return with_cookies(await respond_with_error({
              request,
              options: options2,
              state,
              $session,
              status,
              error: error2
            }), set_cookie_headers);
          }
        }
        if (loaded && loaded.loaded.stuff) {
          stuff = {
            ...stuff,
            ...loaded.loaded.stuff
          };
        }
      }
    }
  try {
    return with_cookies(await render_response({
      ...opts,
      page_config,
      status,
      error: error2,
      branch: branch.filter(Boolean)
    }), set_cookie_headers);
  } catch (err) {
    const error3 = coalesce_to_error(err);
    options2.handle_error(error3, request);
    return with_cookies(await respond_with_error({
      ...opts,
      status: 500,
      error: error3
    }), set_cookie_headers);
  }
}
function get_page_config(leaf, options2) {
  return {
    ssr: "ssr" in leaf ? !!leaf.ssr : options2.ssr,
    router: "router" in leaf ? !!leaf.router : options2.router,
    hydrate: "hydrate" in leaf ? !!leaf.hydrate : options2.hydrate
  };
}
function with_cookies(response, set_cookie_headers) {
  if (set_cookie_headers.length) {
    response.headers["set-cookie"] = set_cookie_headers;
  }
  return response;
}
async function render_page(request, route, match, options2, state) {
  if (state.initiator === route) {
    return {
      status: 404,
      headers: {},
      body: `Not found: ${request.path}`
    };
  }
  const params = route.params(match);
  const page = {
    host: request.host,
    path: request.path,
    query: request.query,
    params
  };
  const $session = await options2.hooks.getSession(request);
  const response = await respond$1({
    request,
    options: options2,
    state,
    $session,
    route,
    page
  });
  if (response) {
    return response;
  }
  if (state.fetched) {
    return {
      status: 500,
      headers: {},
      body: `Bad request in load function: failed to fetch ${state.fetched}`
    };
  }
}
function read_only_form_data() {
  const map = new Map();
  return {
    append(key, value) {
      if (map.has(key)) {
        (map.get(key) || []).push(value);
      } else {
        map.set(key, [value]);
      }
    },
    data: new ReadOnlyFormData(map)
  };
}
class ReadOnlyFormData {
  constructor(map) {
    __privateAdd(this, _map, void 0);
    __privateSet(this, _map, map);
  }
  get(key) {
    const value = __privateGet(this, _map).get(key);
    return value && value[0];
  }
  getAll(key) {
    return __privateGet(this, _map).get(key);
  }
  has(key) {
    return __privateGet(this, _map).has(key);
  }
  *[Symbol.iterator]() {
    for (const [key, value] of __privateGet(this, _map)) {
      for (let i = 0; i < value.length; i += 1) {
        yield [key, value[i]];
      }
    }
  }
  *entries() {
    for (const [key, value] of __privateGet(this, _map)) {
      for (let i = 0; i < value.length; i += 1) {
        yield [key, value[i]];
      }
    }
  }
  *keys() {
    for (const [key] of __privateGet(this, _map))
      yield key;
  }
  *values() {
    for (const [, value] of __privateGet(this, _map)) {
      for (let i = 0; i < value.length; i += 1) {
        yield value[i];
      }
    }
  }
}
_map = new WeakMap();
function parse_body(raw, headers) {
  if (!raw)
    return raw;
  const content_type = headers["content-type"];
  const [type, ...directives] = content_type ? content_type.split(/;\s*/) : [];
  const text = () => new TextDecoder(headers["content-encoding"] || "utf-8").decode(raw);
  switch (type) {
    case "text/plain":
      return text();
    case "application/json":
      return JSON.parse(text());
    case "application/x-www-form-urlencoded":
      return get_urlencoded(text());
    case "multipart/form-data": {
      const boundary = directives.find((directive) => directive.startsWith("boundary="));
      if (!boundary)
        throw new Error("Missing boundary");
      return get_multipart(text(), boundary.slice("boundary=".length));
    }
    default:
      return raw;
  }
}
function get_urlencoded(text) {
  const { data, append } = read_only_form_data();
  text.replace(/\+/g, " ").split("&").forEach((str) => {
    const [key, value] = str.split("=");
    append(decodeURIComponent(key), decodeURIComponent(value));
  });
  return data;
}
function get_multipart(text, boundary) {
  const parts = text.split(`--${boundary}`);
  if (parts[0] !== "" || parts[parts.length - 1].trim() !== "--") {
    throw new Error("Malformed form data");
  }
  const { data, append } = read_only_form_data();
  parts.slice(1, -1).forEach((part) => {
    const match = /\s*([\s\S]+?)\r\n\r\n([\s\S]*)\s*/.exec(part);
    if (!match) {
      throw new Error("Malformed form data");
    }
    const raw_headers = match[1];
    const body = match[2].trim();
    let key;
    const headers = {};
    raw_headers.split("\r\n").forEach((str) => {
      const [raw_header, ...raw_directives] = str.split("; ");
      let [name, value] = raw_header.split(": ");
      name = name.toLowerCase();
      headers[name] = value;
      const directives = {};
      raw_directives.forEach((raw_directive) => {
        const [name2, value2] = raw_directive.split("=");
        directives[name2] = JSON.parse(value2);
      });
      if (name === "content-disposition") {
        if (value !== "form-data")
          throw new Error("Malformed form data");
        if (directives.filename) {
          throw new Error("File upload is not yet implemented");
        }
        if (directives.name) {
          key = directives.name;
        }
      }
    });
    if (!key)
      throw new Error("Malformed form data");
    append(key, body);
  });
  return data;
}
async function respond(incoming, options2, state = {}) {
  if (incoming.path !== "/" && options2.trailing_slash !== "ignore") {
    const has_trailing_slash = incoming.path.endsWith("/");
    if (has_trailing_slash && options2.trailing_slash === "never" || !has_trailing_slash && options2.trailing_slash === "always" && !(incoming.path.split("/").pop() || "").includes(".")) {
      const path = has_trailing_slash ? incoming.path.slice(0, -1) : incoming.path + "/";
      const q = incoming.query.toString();
      return {
        status: 301,
        headers: {
          location: options2.paths.base + path + (q ? `?${q}` : "")
        }
      };
    }
  }
  const headers = lowercase_keys(incoming.headers);
  const request = {
    ...incoming,
    headers,
    body: parse_body(incoming.rawBody, headers),
    params: {},
    locals: {}
  };
  try {
    return await options2.hooks.handle({
      request,
      resolve: async (request2) => {
        if (state.prerender && state.prerender.fallback) {
          return await render_response({
            options: options2,
            $session: await options2.hooks.getSession(request2),
            page_config: { ssr: false, router: true, hydrate: true },
            status: 200,
            branch: []
          });
        }
        const decoded = decodeURI(request2.path);
        for (const route of options2.manifest.routes) {
          const match = route.pattern.exec(decoded);
          if (!match)
            continue;
          const response = route.type === "endpoint" ? await render_endpoint(request2, route, match) : await render_page(request2, route, match, options2, state);
          if (response) {
            if (response.status === 200) {
              const cache_control = get_single_valued_header(response.headers, "cache-control");
              if (!cache_control || !/(no-store|immutable)/.test(cache_control)) {
                const etag = `"${hash(response.body || "")}"`;
                if (request2.headers["if-none-match"] === etag) {
                  return {
                    status: 304,
                    headers: {},
                    body: ""
                  };
                }
                response.headers["etag"] = etag;
              }
            }
            return response;
          }
        }
        const $session = await options2.hooks.getSession(request2);
        return await respond_with_error({
          request: request2,
          options: options2,
          state,
          $session,
          status: 404,
          error: new Error(`Not found: ${request2.path}`)
        });
      }
    });
  } catch (err) {
    const e = coalesce_to_error(err);
    options2.handle_error(e, request);
    return {
      status: 500,
      headers: {},
      body: options2.dev ? e.stack : e.message
    };
  }
}
function run(fn) {
  return fn();
}
function blank_object() {
  return Object.create(null);
}
function run_all(fns) {
  fns.forEach(run);
}
let current_component;
function set_current_component(component) {
  current_component = component;
}
function get_current_component() {
  if (!current_component)
    throw new Error("Function called outside component initialization");
  return current_component;
}
function setContext(key, context) {
  get_current_component().$$.context.set(key, context);
}
Promise.resolve();
const escaped = {
  '"': "&quot;",
  "'": "&#39;",
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;"
};
function escape(html) {
  return String(html).replace(/["'&<>]/g, (match) => escaped[match]);
}
const missing_component = {
  $$render: () => ""
};
function validate_component(component, name) {
  if (!component || !component.$$render) {
    if (name === "svelte:component")
      name += " this={...}";
    throw new Error(`<${name}> is not a valid SSR component. You may need to review your build config to ensure that dependencies are compiled, rather than imported as pre-compiled modules`);
  }
  return component;
}
let on_destroy;
function create_ssr_component(fn) {
  function $$render(result, props, bindings, slots, context) {
    const parent_component = current_component;
    const $$ = {
      on_destroy,
      context: new Map(context || (parent_component ? parent_component.$$.context : [])),
      on_mount: [],
      before_update: [],
      after_update: [],
      callbacks: blank_object()
    };
    set_current_component({ $$ });
    const html = fn(result, props, bindings, slots);
    set_current_component(parent_component);
    return html;
  }
  return {
    render: (props = {}, { $$slots = {}, context = new Map() } = {}) => {
      on_destroy = [];
      const result = { title: "", head: "", css: new Set() };
      const html = $$render(result, props, {}, $$slots, context);
      run_all(on_destroy);
      return {
        html,
        css: {
          code: Array.from(result.css).map((css2) => css2.code).join("\n"),
          map: null
        },
        head: result.title + result.head
      };
    },
    $$render
  };
}
function add_attribute(name, value, boolean) {
  if (value == null || boolean && !value)
    return "";
  return ` ${name}${value === true ? "" : `=${typeof value === "string" ? JSON.stringify(escape(value)) : `"${value}"`}`}`;
}
function afterUpdate() {
}
var root_svelte_svelte_type_style_lang = "";
const css$7 = {
  code: "#svelte-announcer.svelte-1j55zn5{position:absolute;left:0;top:0;clip:rect(0 0 0 0);clip-path:inset(50%);overflow:hidden;white-space:nowrap;width:1px;height:1px}",
  map: null
};
const Root = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { stores } = $$props;
  let { page } = $$props;
  let { components } = $$props;
  let { props_0 = null } = $$props;
  let { props_1 = null } = $$props;
  let { props_2 = null } = $$props;
  setContext("__svelte__", stores);
  afterUpdate(stores.page.notify);
  if ($$props.stores === void 0 && $$bindings.stores && stores !== void 0)
    $$bindings.stores(stores);
  if ($$props.page === void 0 && $$bindings.page && page !== void 0)
    $$bindings.page(page);
  if ($$props.components === void 0 && $$bindings.components && components !== void 0)
    $$bindings.components(components);
  if ($$props.props_0 === void 0 && $$bindings.props_0 && props_0 !== void 0)
    $$bindings.props_0(props_0);
  if ($$props.props_1 === void 0 && $$bindings.props_1 && props_1 !== void 0)
    $$bindings.props_1(props_1);
  if ($$props.props_2 === void 0 && $$bindings.props_2 && props_2 !== void 0)
    $$bindings.props_2(props_2);
  $$result.css.add(css$7);
  {
    stores.page.set(page);
  }
  return `


${validate_component(components[0] || missing_component, "svelte:component").$$render($$result, Object.assign(props_0 || {}), {}, {
    default: () => `${components[1] ? `${validate_component(components[1] || missing_component, "svelte:component").$$render($$result, Object.assign(props_1 || {}), {}, {
      default: () => `${components[2] ? `${validate_component(components[2] || missing_component, "svelte:component").$$render($$result, Object.assign(props_2 || {}), {}, {})}` : ``}`
    })}` : ``}`
  })}

${``}`;
});
let base = "";
let assets = "";
function set_paths(paths) {
  base = paths.base;
  assets = paths.assets || base;
}
function set_prerendering(value) {
}
const getContext = (request) => {
  const cookies = cookie.parse(request.headers.cookie || "");
  return {
    is_new: !cookies.userid,
    userid: cookies.userid || v4()
  };
};
const handle = async ({ request, resolve: resolve2 }) => {
  const response = await resolve2({
    ...request,
    method: (request.query.get("_method") || request.method).toUpperCase()
  });
  const { is_new, userid } = request.context;
  if (is_new) {
    return {
      ...response,
      headers: {
        ...response.headers,
        "set-cookie": `userid=${userid}; Path=/; HttpOnly`
      }
    };
  }
  return response;
};
var user_hooks = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  getContext,
  handle
});
const template = ({ head, body }) => '<!DOCTYPE html>\n<html lang="en">\n	<head>\n		<meta charset="utf-8" />\n		<link rel="icon" href="/favicon.ico" />\n		<meta name="viewport" content="width=device-width, initial-scale=1" />\n		<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">\n		<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">\n		<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">\n		<link rel="manifest" href="/site.webmanifest">\n		<link rel="mask-icon" href="/safari-pinned-tab.svg" color="#c68e5d">\n		<link rel="preload" href="/fonts/Merriweather-Regular.woff2" as="font" type="font/woff2" crossorigin="anonymous">\n		<link rel="preload" href="/fonts/ClaudeSansPlain-Regular.woff2" as="font" type="font/woff2" crossorigin="anonymous">\n\n		<meta name="msapplication-TileColor" content="#da532c">\n		<meta name="theme-color" content="#ffffff">\n		' + head + '\n	</head>\n	<body>\n		<div id="svelte">' + body + "</div>\n	</body>\n</html>\n";
let options = null;
const default_settings = { paths: { "base": "", "assets": "" } };
function init(settings = default_settings) {
  set_paths(settings.paths);
  set_prerendering(settings.prerendering || false);
  const hooks = get_hooks(user_hooks);
  options = {
    amp: false,
    dev: false,
    entry: {
      file: assets + "/_app/start-3ed04841.js",
      css: [assets + "/_app/assets/start-61d1577b.css"],
      js: [assets + "/_app/start-3ed04841.js", assets + "/_app/chunks/vendor-dac554f8.js"]
    },
    fetched: void 0,
    floc: false,
    get_component_path: (id) => assets + "/_app/" + entry_lookup[id],
    get_stack: (error2) => String(error2),
    handle_error: (error2, request) => {
      hooks.handleError({ error: error2, request });
      error2.stack = options.get_stack(error2);
    },
    hooks,
    hydrate: true,
    initiator: void 0,
    load_component,
    manifest,
    paths: settings.paths,
    prerender: true,
    read: settings.read,
    root: Root,
    service_worker: null,
    router: true,
    ssr: true,
    target: null,
    template,
    trailing_slash: "never"
  };
}
const empty = () => ({});
const manifest = {
  assets: [{ "file": "TinyLogo.png", "size": 29437, "type": "image/png" }, { "file": "android-chrome-192x192.png", "size": 28361, "type": "image/png" }, { "file": "android-chrome-256x256.png", "size": 40127, "type": "image/png" }, { "file": "apple-touch-icon.png", "size": 17990, "type": "image/png" }, { "file": "blog-ghost/blog/[slug].svelte", "size": 1605, "type": null }, { "file": "blog-ghost/blog.svelte", "size": 1293, "type": null }, { "file": "browserconfig.xml", "size": 246, "type": "application/xml" }, { "file": "favicon-16x16.png", "size": 1048, "type": "image/png" }, { "file": "favicon-32x32.png", "size": 2095, "type": "image/png" }, { "file": "favicon.ico", "size": 15086, "type": "image/vnd.microsoft.icon" }, { "file": "fonts/ClaudeSansPlain-Regular.woff2", "size": 18872, "type": "font/woff2" }, { "file": "fonts/Merriweather-Regular.woff2", "size": 62432, "type": "font/woff2" }, { "file": "img/007A0346.jpg", "size": 2250757, "type": "image/jpeg" }, { "file": "img/400.txt", "size": 849, "type": "text/plain" }, { "file": "img/Optimized/beachDay-1000.avif", "size": 30909, "type": "image/avif" }, { "file": "img/Optimized/beachDay-1000.jpg", "size": 57689, "type": "image/jpeg" }, { "file": "img/Optimized/beachDay-1000.jxl", "size": 53916, "type": null }, { "file": "img/Optimized/beachDay-1500.avif", "size": 66324, "type": "image/avif" }, { "file": "img/Optimized/beachDay-1500.jpg", "size": 120348, "type": "image/jpeg" }, { "file": "img/Optimized/beachDay-1500.jxl", "size": 108066, "type": null }, { "file": "img/Optimized/beachDay-1800.avif", "size": 90836, "type": "image/avif" }, { "file": "img/Optimized/beachDay-1800.jpg", "size": 168010, "type": "image/jpeg" }, { "file": "img/Optimized/beachDay-1800.jxl", "size": 147219, "type": null }, { "file": "img/Optimized/beachDay-2000.avif", "size": 109513, "type": "image/avif" }, { "file": "img/Optimized/beachDay-2000.jpg", "size": 204336, "type": "image/jpeg" }, { "file": "img/Optimized/beachDay-2000.jxl", "size": 177246, "type": null }, { "file": "img/Optimized/beachDay-400.avif", "size": 6156, "type": "image/avif" }, { "file": "img/Optimized/beachDay-400.jpg", "size": 11510, "type": "image/jpeg" }, { "file": "img/Optimized/beachDay-400.jxl", "size": 11834, "type": null }, { "file": "img/Optimized/beachDay-600.avif", "size": 11781, "type": "image/avif" }, { "file": "img/Optimized/beachDay-600.jpg", "size": 22657, "type": "image/jpeg" }, { "file": "img/Optimized/beachDay-600.jxl", "size": 22133, "type": null }, { "file": "img/Optimized/beachDay-800.avif", "size": 20140, "type": "image/avif" }, { "file": "img/Optimized/beachDay-800.jpg", "size": 38249, "type": "image/jpeg" }, { "file": "img/Optimized/beachDay-800.jxl", "size": 36410, "type": null }, { "file": "img/Optimized/beachDay.jpg", "size": 9129472, "type": "image/jpeg" }, { "file": "img/Optimized/beachDay.txt", "size": 1338, "type": "text/plain" }, { "file": "img/Optimized/example.png", "size": 1943924, "type": "image/png" }, { "file": "img/Optimized/example2.png", "size": 1480225, "type": "image/png" }, { "file": "img/Optimized/forestWalk-400.avif", "size": 14975, "type": "image/avif" }, { "file": "img/Optimized/forestWalk-400.jpg", "size": 30202, "type": "image/jpeg" }, { "file": "img/Optimized/forestWalk-600.avif", "size": 26755, "type": "image/avif" }, { "file": "img/Optimized/forestWalk-600.jpg", "size": 58986, "type": "image/jpeg" }, { "file": "img/Optimized/forestWalk-667.avif", "size": 30437, "type": "image/avif" }, { "file": "img/Optimized/forestWalk-667.jpg", "size": 69639, "type": "image/jpeg" }, { "file": "img/Optimized/forestWalk-667.jxl", "size": 56526, "type": null }, { "file": "img/Optimized/forestWalk.jpg", "size": 267636, "type": "image/jpeg" }, { "file": "img/Optimized/forestWalk.txt", "size": 834, "type": "text/plain" }, { "file": "img/Optimized/hg-IMGL3380-Edit.jpg", "size": 222044, "type": "image/jpeg" }, { "file": "img/Optimized/hg-Kiss.jpg", "size": 351988, "type": "image/jpeg" }, { "file": "img/Optimized/hg-P2530978.jpg", "size": 508141, "type": "image/jpeg" }, { "file": "img/Optimized/hg-forestToddle.jpg", "size": 328677, "type": "image/jpeg" }, { "file": "img/Optimized/hg-logBalance.jpg", "size": 213937, "type": "image/jpeg" }, { "file": "img/Optimized/kata1-1000.avif", "size": 14791, "type": "image/avif" }, { "file": "img/Optimized/kata1-1000.jpg", "size": 46836, "type": "image/jpeg" }, { "file": "img/Optimized/kata1-1000.jxl", "size": 34695, "type": null }, { "file": "img/Optimized/kata1-1200.avif", "size": 18032, "type": "image/avif" }, { "file": "img/Optimized/kata1-1200.jpg", "size": 61173, "type": "image/jpeg" }, { "file": "img/Optimized/kata1-1200.jxl", "size": 43975, "type": null }, { "file": "img/Optimized/kata1-600.avif", "size": 8170, "type": "image/avif" }, { "file": "img/Optimized/kata1-600.jpg", "size": 21442, "type": "image/jpeg" }, { "file": "img/Optimized/kata1-600.jxl", "size": 17680, "type": null }, { "file": "img/Optimized/kata1-800.avif", "size": 11417, "type": "image/avif" }, { "file": "img/Optimized/kata1-800.jpg", "size": 33639, "type": "image/jpeg" }, { "file": "img/Optimized/kata1-800.jxl", "size": 25850, "type": null }, { "file": "img/Optimized/kata1.jpg", "size": 763546, "type": "image/jpeg" }, { "file": "img/Optimized/kata1.txt", "size": 1047, "type": "text/plain" }, { "file": "img/Optimized/kata2-1400.avif", "size": 29288, "type": "image/avif" }, { "file": "img/Optimized/kata2-1400.jpg", "size": 112871, "type": "image/jpeg" }, { "file": "img/Optimized/kata2-1400.jxl", "size": 77030, "type": null }, { "file": "img/Optimized/kata2-1600.avif", "size": 34040, "type": "image/avif" }, { "file": "img/Optimized/kata2-1600.jpg", "size": 137924, "type": "image/jpeg" }, { "file": "img/Optimized/kata2-1600.jxl", "size": 93047, "type": null }, { "file": "img/Optimized/kata2-1800.avif", "size": 38815, "type": "image/avif" }, { "file": "img/Optimized/kata2-1800.jpg", "size": 164347, "type": "image/jpeg" }, { "file": "img/Optimized/kata2-1800.jxl", "size": 109065, "type": null }, { "file": "img/Optimized/kata2-2000.avif", "size": 43677, "type": "image/avif" }, { "file": "img/Optimized/kata2-2000.jpg", "size": 192018, "type": "image/jpeg" }, { "file": "img/Optimized/kata2-2000.jxl", "size": 126868, "type": null }, { "file": "img/Optimized/kata2-2200.avif", "size": 48653, "type": "image/avif" }, { "file": "img/Optimized/kata2-2200.jpg", "size": 221653, "type": "image/jpeg" }, { "file": "img/Optimized/kata2-2200.jxl", "size": 145663, "type": null }, { "file": "img/Optimized/kata2-2400.avif", "size": 53380, "type": "image/avif" }, { "file": "img/Optimized/kata2-2400.jpg", "size": 252329, "type": "image/jpeg" }, { "file": "img/Optimized/kata2-2400.jxl", "size": 165657, "type": null }, { "file": "img/Optimized/kata2.jpg", "size": 1156456, "type": "image/jpeg" }, { "file": "img/Optimized/kata2.txt", "size": 1215, "type": "text/plain" }, { "file": "img/Optimized/lg-IMGL3380-Edit.jpg", "size": 132452, "type": "image/jpeg" }, { "file": "img/Optimized/lg-Kiss.jpg", "size": 119040, "type": "image/jpeg" }, { "file": "img/Optimized/lg-P2530978.jpg", "size": 126558, "type": "image/jpeg" }, { "file": "img/Optimized/lg-forestToddle.jpg", "size": 114673, "type": "image/jpeg" }, { "file": "img/Optimized/lg-logBalance.jpg", "size": 126855, "type": "image/jpeg" }, { "file": "img/Optimized/md-IMGL3380-Edit.jpg", "size": 77586, "type": "image/jpeg" }, { "file": "img/Optimized/md-Kiss.jpg", "size": 61744, "type": "image/jpeg" }, { "file": "img/Optimized/md-P2530978.jpg", "size": 55492, "type": "image/jpeg" }, { "file": "img/Optimized/md-forestToddle.jpg", "size": 61773, "type": "image/jpeg" }, { "file": "img/Optimized/md-logBalance.jpg", "size": 73597, "type": "image/jpeg" }, { "file": "img/Optimized/sm-IMGL3380-Edit.jpg", "size": 26570, "type": "image/jpeg" }, { "file": "img/Optimized/sm-Kiss.jpg", "size": 40215, "type": "image/jpeg" }, { "file": "img/Optimized/sm-P2530978.jpg", "size": 33038, "type": "image/jpeg" }, { "file": "img/Optimized/sm-forestToddle.jpg", "size": 40727, "type": "image/jpeg" }, { "file": "img/Optimized/sm-logBalance.jpg", "size": 25471, "type": "image/jpeg" }, { "file": "img/Optimized/ty-IMGL3380-Edit.jpg", "size": 8291, "type": "image/jpeg" }, { "file": "img/Optimized/ty-Kiss.jpg", "size": 13478, "type": "image/jpeg" }, { "file": "img/Optimized/ty-P2530978.jpg", "size": 7844, "type": "image/jpeg" }, { "file": "img/Optimized/ty-forestToddle.jpg", "size": 12431, "type": "image/jpeg" }, { "file": "img/Optimized/ty-logBalance.jpg", "size": 8256, "type": "image/jpeg" }, { "file": "img/Optimized/walk-1000.avif", "size": 143061, "type": "image/avif" }, { "file": "img/Optimized/walk-1000.jpg", "size": 201179, "type": "image/jpeg" }, { "file": "img/Optimized/walk-1100.avif", "size": 159915, "type": "image/avif" }, { "file": "img/Optimized/walk-1100.jpg", "size": 234432, "type": "image/jpeg" }, { "file": "img/Optimized/walk-400.avif", "size": 33477, "type": "image/avif" }, { "file": "img/Optimized/walk-400.jpg", "size": 38510, "type": "image/jpeg" }, { "file": "img/Optimized/walk-500.avif", "size": 49778, "type": "image/avif" }, { "file": "img/Optimized/walk-500.jpg", "size": 58542, "type": "image/jpeg" }, { "file": "img/Optimized/walk-600.avif", "size": 68110, "type": "image/avif" }, { "file": "img/Optimized/walk-600.jpg", "size": 81743, "type": "image/jpeg" }, { "file": "img/Optimized/walk-700.avif", "size": 87583, "type": "image/avif" }, { "file": "img/Optimized/walk-700.jpg", "size": 108630, "type": "image/jpeg" }, { "file": "img/Optimized/walk-800.avif", "size": 106420, "type": "image/avif" }, { "file": "img/Optimized/walk-800.jpg", "size": 137471, "type": "image/jpeg" }, { "file": "img/Optimized/walk-900.avif", "size": 125415, "type": "image/avif" }, { "file": "img/Optimized/walk-900.jpg", "size": 169009, "type": "image/jpeg" }, { "file": "img/Optimized/workshop-1000.avif", "size": 21940, "type": "image/avif" }, { "file": "img/Optimized/workshop-1000.jpg", "size": 58529, "type": "image/jpeg" }, { "file": "img/Optimized/workshop-1100.avif", "size": 24702, "type": "image/avif" }, { "file": "img/Optimized/workshop-1100.jpg", "size": 67759, "type": "image/jpeg" }, { "file": "img/Optimized/workshop-400.avif", "size": 7367, "type": "image/avif" }, { "file": "img/Optimized/workshop-400.jpg", "size": 14423, "type": "image/jpeg" }, { "file": "img/Optimized/workshop-500.avif", "size": 9667, "type": "image/avif" }, { "file": "img/Optimized/workshop-500.jpg", "size": 20289, "type": "image/jpeg" }, { "file": "img/Optimized/workshop-600.avif", "size": 11958, "type": "image/avif" }, { "file": "img/Optimized/workshop-600.jpg", "size": 26537, "type": "image/jpeg" }, { "file": "img/Optimized/workshop-700.avif", "size": 14598, "type": "image/avif" }, { "file": "img/Optimized/workshop-700.jpg", "size": 33776, "type": "image/jpeg" }, { "file": "img/Optimized/workshop-800.avif", "size": 16831, "type": "image/avif" }, { "file": "img/Optimized/workshop-800.jpg", "size": 41127, "type": "image/jpeg" }, { "file": "img/Optimized/workshop-900.avif", "size": 19461, "type": "image/avif" }, { "file": "img/Optimized/workshop-900.jpg", "size": 49599, "type": "image/jpeg" }, { "file": "img/Unused/007A9396.jpg", "size": 1766232, "type": "image/jpeg" }, { "file": "img/Unused/Originals/FlowerRun.jpg", "size": 10664960, "type": "image/jpeg" }, { "file": "img/Unused/Originals/IMGL2480.jpg", "size": 1460547, "type": "image/jpeg" }, { "file": "img/Unused/Originals/IMGL2500.jpg", "size": 1359459, "type": "image/jpeg" }, { "file": "img/Unused/Originals/IMGL2703.jpg", "size": 274131, "type": "image/jpeg" }, { "file": "img/Unused/Originals/IMGL2733.jpg", "size": 268451, "type": "image/jpeg" }, { "file": "img/Unused/Originals/IMGL3659.jpg", "size": 400111, "type": "image/jpeg" }, { "file": "img/Unused/Originals/IMGL3944.jpg", "size": 264966, "type": "image/jpeg" }, { "file": "img/Unused/Originals/IMGL3969.jpg", "size": 273251, "type": "image/jpeg" }, { "file": "img/Unused/Originals/Kiss.jpg", "size": 202006, "type": "image/jpeg" }, { "file": "img/Unused/Originals/P2530904.jpg", "size": 9119744, "type": "image/jpeg" }, { "file": "img/Unused/Originals/P2530912.jpg", "size": 10507776, "type": "image/jpeg" }, { "file": "img/Unused/Originals/P2530920.jpg", "size": 9950720, "type": "image/jpeg" }, { "file": "img/Unused/Originals/P2530921.jpg", "size": 10222592, "type": "image/jpeg" }, { "file": "img/Unused/Originals/P2530932.jpg", "size": 9055232, "type": "image/jpeg" }, { "file": "img/Unused/Originals/P2530935.jpg", "size": 10345472, "type": "image/jpeg" }, { "file": "img/Unused/Originals/P2530969.jpg", "size": 8664576, "type": "image/jpeg" }, { "file": "img/Unused/Originals/P2530973.jpg", "size": 5974528, "type": "image/jpeg" }, { "file": "img/Unused/Originals/P2530978.jpg", "size": 9129472, "type": "image/jpeg" }, { "file": "img/Unused/Originals/P2530988.jpg", "size": 6602240, "type": "image/jpeg" }, { "file": "img/Unused/Originals/P2530991.jpg", "size": 6653440, "type": "image/jpeg" }, { "file": "img/Unused/Originals/adventureHorizon.jpg", "size": 8190464, "type": "image/jpeg" }, { "file": "img/Unused/Originals/beachSit.jpg", "size": 9476608, "type": "image/jpeg" }, { "file": "img/Unused/Originals/bearHug.jpg", "size": 230070, "type": "image/jpeg" }, { "file": "img/Unused/Originals/cheek.jpg", "size": 261891, "type": "image/jpeg" }, { "file": "img/Unused/Originals/dasiyStudy.jpg", "size": 8081920, "type": "image/jpeg" }, { "file": "img/Unused/Originals/forestCaper.jpg", "size": 255892, "type": "image/jpeg" }, { "file": "img/Unused/Originals/forestToddle.jpg", "size": 95477, "type": "image/jpeg" }, { "file": "img/Unused/Originals/logBalance.jpg", "size": 258118, "type": "image/jpeg" }, { "file": "img/Unused/Originals/milkMaid.jpg", "size": 302038, "type": "image/jpeg" }, { "file": "img/Unused/Originals/natureWalk.jpg", "size": 267636, "type": "image/jpeg" }, { "file": "img/Unused/Originals/sandSketch.jpg", "size": 10263552, "type": "image/jpeg" }, { "file": "img/Unused/Originals/sheet.jpg", "size": 464483, "type": "image/jpeg" }, { "file": "img/Unused/Originals/vanLife1.jpg", "size": 254003, "type": "image/jpeg" }, { "file": "img/Unused/Originals/vanLife2.jpg", "size": 302464, "type": "image/jpeg" }, { "file": "img/Unused/Originals/walkOnBeach.jpg", "size": 5074136, "type": "image/jpeg" }, { "file": "img/Unused/P2540369.JPG", "size": 7277056, "type": "image/jpeg" }, { "file": "img/Unused/P2540371.JPG", "size": 7625216, "type": "image/jpeg" }, { "file": "img/Unused/P2540372.JPG", "size": 7382528, "type": "image/jpeg" }, { "file": "img/Unused/P2540373.JPG", "size": 9395712, "type": "image/jpeg" }, { "file": "img/Unused/P2540374.JPG", "size": 7569408, "type": "image/jpeg" }, { "file": "img/Unused/P2540375.JPG", "size": 8943104, "type": "image/jpeg" }, { "file": "img/Unused/P2540376.JPG", "size": 9378816, "type": "image/jpeg" }, { "file": "img/Unused/P2540377.JPG", "size": 6767104, "type": "image/jpeg" }, { "file": "img/Unused/P2540378.JPG", "size": 5968384, "type": "image/jpeg" }, { "file": "img/Unused/P2540379.JPG", "size": 9252864, "type": "image/jpeg" }, { "file": "img/Unused/P2540380.JPG", "size": 5520896, "type": "image/jpeg" }, { "file": "img/Unused/P2540381.JPG", "size": 7410688, "type": "image/jpeg" }, { "file": "img/Unused/P2540382.JPG", "size": 8873984, "type": "image/jpeg" }, { "file": "img/Unused/P2540383.JPG", "size": 8686080, "type": "image/jpeg" }, { "file": "img/Unused/P2540384.JPG", "size": 9097728, "type": "image/jpeg" }, { "file": "img/Unused/P2540385.JPG", "size": 7963136, "type": "image/jpeg" }, { "file": "img/Unused/P2540386.JPG", "size": 9001472, "type": "image/jpeg" }, { "file": "img/Unused/P2540388.JPG", "size": 8532992, "type": "image/jpeg" }, { "file": "img/Unused/P2540389.JPG", "size": 7375872, "type": "image/jpeg" }, { "file": "img/Unused/P2540390.JPG", "size": 9082368, "type": "image/jpeg" }, { "file": "img/Unused/P2540393.JPG", "size": 8762368, "type": "image/jpeg" }, { "file": "img/Unused/P2540394.JPG", "size": 4462080, "type": "image/jpeg" }, { "file": "img/Unused/P2540395.JPG", "size": 6561792, "type": "image/jpeg" }, { "file": "img/Unused/P2540396.JPG", "size": 6608384, "type": "image/jpeg" }, { "file": "img/Unused/P2540397.JPG", "size": 6617088, "type": "image/jpeg" }, { "file": "img/Unused/P2540398.JPG", "size": 8735744, "type": "image/jpeg" }, { "file": "img/Unused/P2540401.JPG", "size": 8689664, "type": "image/jpeg" }, { "file": "img/Unused/P2540403.JPG", "size": 9026048, "type": "image/jpeg" }, { "file": "img/Unused/P2540405.JPG", "size": 8707584, "type": "image/jpeg" }, { "file": "img/Unused/P2540412.JPG", "size": 8751616, "type": "image/jpeg" }, { "file": "img/Unused/P2540417.JPG", "size": 9416704, "type": "image/jpeg" }, { "file": "img/Unused/P2540419.JPG", "size": 9306624, "type": "image/jpeg" }, { "file": "img/Unused/P2540427.JPG", "size": 8677376, "type": "image/jpeg" }, { "file": "img/Unused/P2540428.JPG", "size": 8766464, "type": "image/jpeg" }, { "file": "img/Unused/P2540436.JPG", "size": 9302528, "type": "image/jpeg" }, { "file": "img/Unused/P2540453.JPG", "size": 7658496, "type": "image/jpeg" }, { "file": "img/Unused/P2540462.JPG", "size": 7802880, "type": "image/jpeg" }, { "file": "img/anxiety.jpg", "size": 115169, "type": "image/jpeg" }, { "file": "img/bekah-allmark-Qt0ogPnhGWY-unsplash.jpg", "size": 1786247, "type": "image/jpeg" }, { "file": "img/bekah-allmark-Qt0ogPnhGWY-unsplash.xcf", "size": 5242042, "type": null }, { "file": "img/cheek-667.avif", "size": 34967, "type": "image/avif" }, { "file": "img/cheek-667.jpg", "size": 72463, "type": "image/jpeg" }, { "file": "img/cheek.jpg", "size": 261891, "type": "image/jpeg" }, { "file": "img/cheek.txt", "size": 819, "type": "text/plain" }, { "file": "img/climbTree-400.avif", "size": 24436, "type": "image/avif" }, { "file": "img/climbTree-400.jpg", "size": 33330, "type": "image/jpeg" }, { "file": "img/climbTree.jpg", "size": 3873089, "type": "image/jpeg" }, { "file": "img/climbTree.txt", "size": 831, "type": "text/plain" }, { "file": "img/contactbig-1000.avif", "size": 44288, "type": "image/avif" }, { "file": "img/contactbig-1000.jpg", "size": 90700, "type": "image/jpeg" }, { "file": "img/contactbig-1200.avif", "size": 64865, "type": "image/avif" }, { "file": "img/contactbig-1200.jpg", "size": 129966, "type": "image/jpeg" }, { "file": "img/contactbig-1400.avif", "size": 87760, "type": "image/avif" }, { "file": "img/contactbig-1400.jpg", "size": 177215, "type": "image/jpeg" }, { "file": "img/contactbig-1600.avif", "size": 111295, "type": "image/avif" }, { "file": "img/contactbig-1600.jpg", "size": 228639, "type": "image/jpeg" }, { "file": "img/contactbig-1800.avif", "size": 132679, "type": "image/avif" }, { "file": "img/contactbig-1800.jpg", "size": 283686, "type": "image/jpeg" }, { "file": "img/contactbig-2000.avif", "size": 154055, "type": "image/avif" }, { "file": "img/contactbig-2000.jpg", "size": 343062, "type": "image/jpeg" }, { "file": "img/contactbig-2400.avif", "size": 197741, "type": "image/avif" }, { "file": "img/contactbig-2400.jpg", "size": 464037, "type": "image/jpeg" }, { "file": "img/contactbig.jpg", "size": 854781, "type": "image/jpeg" }, { "file": "img/contactbig.txt", "size": 1398, "type": "text/plain" }, { "file": "img/contactsmall-400.avif", "size": 10639, "type": "image/avif" }, { "file": "img/contactsmall-400.jpg", "size": 19514, "type": "image/jpeg" }, { "file": "img/contactsmall-600.avif", "size": 21476, "type": "image/avif" }, { "file": "img/contactsmall-600.jpg", "size": 41783, "type": "image/jpeg" }, { "file": "img/contactsmall-800.avif", "size": 35042, "type": "image/avif" }, { "file": "img/contactsmall-800.jpg", "size": 71804, "type": "image/jpeg" }, { "file": "img/contactsmall.jpg", "size": 1488573, "type": "image/jpeg" }, { "file": "img/contactsmall.txt", "size": 1026, "type": "text/plain" }, { "file": "img/dandylion-400.avif", "size": 11485, "type": "image/avif" }, { "file": "img/dandylion-400.jpg", "size": 20563, "type": "image/jpeg" }, { "file": "img/dandylion.jpg", "size": 750069, "type": "image/jpeg" }, { "file": "img/dandylion.txt", "size": 831, "type": "text/plain" }, { "file": "img/example.png", "size": 1943924, "type": "image/png" }, { "file": "img/example2.png", "size": 1480225, "type": "image/png" }, { "file": "img/example2.png-1000.avif", "size": 28471, "type": "image/avif" }, { "file": "img/example2.png.txt", "size": 846, "type": "text/plain" }, { "file": "img/field-400.avif", "size": 12545, "type": "image/avif" }, { "file": "img/field-400.jpg", "size": 22058, "type": "image/jpeg" }, { "file": "img/field.jpg", "size": 1458688, "type": "image/jpeg" }, { "file": "img/field.txt", "size": 819, "type": "text/plain" }, { "file": "img/gallery/beach1-1100.avif", "size": 23229, "type": "image/avif" }, { "file": "img/gallery/beach1-1100.jpg", "size": 60450, "type": "image/jpeg" }, { "file": "img/gallery/beach1-1300.avif", "size": 30421, "type": "image/avif" }, { "file": "img/gallery/beach1-1300.jpg", "size": 80983, "type": "image/jpeg" }, { "file": "img/gallery/beach1-300.avif", "size": 3270, "type": "image/avif" }, { "file": "img/gallery/beach1-300.jpg", "size": 6501, "type": "image/jpeg" }, { "file": "img/gallery/beach1-500.avif", "size": 7243, "type": "image/avif" }, { "file": "img/gallery/beach1-500.jpg", "size": 15737, "type": "image/jpeg" }, { "file": "img/gallery/beach1-700.avif", "size": 11890, "type": "image/avif" }, { "file": "img/gallery/beach1-700.jpg", "size": 28058, "type": "image/jpeg" }, { "file": "img/gallery/beach1-900.avif", "size": 17110, "type": "image/avif" }, { "file": "img/gallery/beach1-900.jpg", "size": 42931, "type": "image/jpeg" }, { "file": "img/gallery/beach1.jpg", "size": 8190464, "type": "image/jpeg" }, { "file": "img/gallery/beach1.txt", "size": 1209, "type": "text/plain" }, { "file": "img/gallery/beach2-1100.avif", "size": 41392, "type": "image/avif" }, { "file": "img/gallery/beach2-1100.jpg", "size": 73456, "type": "image/jpeg" }, { "file": "img/gallery/beach2-1300.avif", "size": 56046, "type": "image/avif" }, { "file": "img/gallery/beach2-1300.jpg", "size": 99643, "type": "image/jpeg" }, { "file": "img/gallery/beach2-300.avif", "size": 5448, "type": "image/avif" }, { "file": "img/gallery/beach2-300.jpg", "size": 8509, "type": "image/jpeg" }, { "file": "img/gallery/beach2-500.avif", "size": 11555, "type": "image/avif" }, { "file": "img/gallery/beach2-500.jpg", "size": 19608, "type": "image/jpeg" }, { "file": "img/gallery/beach2-700.avif", "size": 19366, "type": "image/avif" }, { "file": "img/gallery/beach2-700.jpg", "size": 34261, "type": "image/jpeg" }, { "file": "img/gallery/beach2-900.avif", "size": 29130, "type": "image/avif" }, { "file": "img/gallery/beach2-900.jpg", "size": 51926, "type": "image/jpeg" }, { "file": "img/gallery/beach2.jpg", "size": 9476608, "type": "image/jpeg" }, { "file": "img/gallery/beach2.txt", "size": 1209, "type": "text/plain" }, { "file": "img/gallery/beach3-1100.avif", "size": 26462, "type": "image/avif" }, { "file": "img/gallery/beach3-1100.jpg", "size": 52951, "type": "image/jpeg" }, { "file": "img/gallery/beach3-1300.avif", "size": 37570, "type": "image/avif" }, { "file": "img/gallery/beach3-1300.jpg", "size": 74201, "type": "image/jpeg" }, { "file": "img/gallery/beach3-300.avif", "size": 2761, "type": "image/avif" }, { "file": "img/gallery/beach3-300.jpg", "size": 5686, "type": "image/jpeg" }, { "file": "img/gallery/beach3-500.avif", "size": 6223, "type": "image/avif" }, { "file": "img/gallery/beach3-500.jpg", "size": 12737, "type": "image/jpeg" }, { "file": "img/gallery/beach3-700.avif", "size": 11260, "type": "image/avif" }, { "file": "img/gallery/beach3-700.jpg", "size": 22655, "type": "image/jpeg" }, { "file": "img/gallery/beach3-900.avif", "size": 17735, "type": "image/avif" }, { "file": "img/gallery/beach3-900.jpg", "size": 36181, "type": "image/jpeg" }, { "file": "img/gallery/beach3.jpg", "size": 8664576, "type": "image/jpeg" }, { "file": "img/gallery/beach3.txt", "size": 1209, "type": "text/plain" }, { "file": "img/gallery/beach4-1100.avif", "size": 8967, "type": "image/avif" }, { "file": "img/gallery/beach4-1100.jpg", "size": 32509, "type": "image/jpeg" }, { "file": "img/gallery/beach4-1300.avif", "size": 10477, "type": "image/avif" }, { "file": "img/gallery/beach4-1300.jpg", "size": 41561, "type": "image/jpeg" }, { "file": "img/gallery/beach4-300.avif", "size": 2621, "type": "image/avif" }, { "file": "img/gallery/beach4-300.jpg", "size": 6136, "type": "image/jpeg" }, { "file": "img/gallery/beach4-500.avif", "size": 4353, "type": "image/avif" }, { "file": "img/gallery/beach4-500.jpg", "size": 11684, "type": "image/jpeg" }, { "file": "img/gallery/beach4-700.avif", "size": 5888, "type": "image/avif" }, { "file": "img/gallery/beach4-700.jpg", "size": 18081, "type": "image/jpeg" }, { "file": "img/gallery/beach4-900.avif", "size": 7492, "type": "image/avif" }, { "file": "img/gallery/beach4-900.jpg", "size": 24832, "type": "image/jpeg" }, { "file": "img/gallery/beach4.jpg", "size": 5974528, "type": "image/jpeg" }, { "file": "img/gallery/beach4.txt", "size": 1209, "type": "text/plain" }, { "file": "img/gallery/beach5-1100.avif", "size": 16198, "type": "image/avif" }, { "file": "img/gallery/beach5-1100.jpg", "size": 39740, "type": "image/jpeg" }, { "file": "img/gallery/beach5-1300.avif", "size": 20591, "type": "image/avif" }, { "file": "img/gallery/beach5-1300.jpg", "size": 52467, "type": "image/jpeg" }, { "file": "img/gallery/beach5-300.avif", "size": 2865, "type": "image/avif" }, { "file": "img/gallery/beach5-300.jpg", "size": 5192, "type": "image/jpeg" }, { "file": "img/gallery/beach5-500.avif", "size": 5538, "type": "image/avif" }, { "file": "img/gallery/beach5-500.jpg", "size": 10987, "type": "image/jpeg" }, { "file": "img/gallery/beach5-700.avif", "size": 8841, "type": "image/avif" }, { "file": "img/gallery/beach5-700.jpg", "size": 18994, "type": "image/jpeg" }, { "file": "img/gallery/beach5-900.avif", "size": 12044, "type": "image/avif" }, { "file": "img/gallery/beach5-900.jpg", "size": 28202, "type": "image/jpeg" }, { "file": "img/gallery/beach5.jpg", "size": 6653440, "type": "image/jpeg" }, { "file": "img/gallery/beach5.txt", "size": 1209, "type": "text/plain" }, { "file": "img/gallery/nature1-300.avif", "size": 10110, "type": "image/avif" }, { "file": "img/gallery/nature1-300.jpg", "size": 19696, "type": "image/jpeg" }, { "file": "img/gallery/nature1-500.avif", "size": 18585, "type": "image/avif" }, { "file": "img/gallery/nature1-500.jpg", "size": 43025, "type": "image/jpeg" }, { "file": "img/gallery/nature1-700.avif", "size": 27007, "type": "image/avif" }, { "file": "img/gallery/nature1-700.jpg", "size": 71300, "type": "image/jpeg" }, { "file": "img/gallery/nature1.jpg", "size": 255892, "type": "image/jpeg" }, { "file": "img/gallery/nature1.txt", "size": 981, "type": "text/plain" }, { "file": "img/gallery/nature2-300.avif", "size": 12751, "type": "image/avif" }, { "file": "img/gallery/nature2-300.jpg", "size": 21670, "type": "image/jpeg" }, { "file": "img/gallery/nature2-500.avif", "size": 25430, "type": "image/avif" }, { "file": "img/gallery/nature2-500.jpg", "size": 49457, "type": "image/jpeg" }, { "file": "img/gallery/nature2-700.avif", "size": 38575, "type": "image/avif" }, { "file": "img/gallery/nature2-700.jpg", "size": 83940, "type": "image/jpeg" }, { "file": "img/gallery/nature2.jpg", "size": 400111, "type": "image/jpeg" }, { "file": "img/gallery/nature2.txt", "size": 981, "type": "text/plain" }, { "file": "img/gallery/nature3-300.avif", "size": 14175, "type": "image/avif" }, { "file": "img/gallery/nature3-300.jpg", "size": 15491, "type": "image/jpeg" }, { "file": "img/gallery/nature3-500.avif", "size": 35671, "type": "image/avif" }, { "file": "img/gallery/nature3-500.jpg", "size": 40293, "type": "image/jpeg" }, { "file": "img/gallery/nature3-700.avif", "size": 63323, "type": "image/avif" }, { "file": "img/gallery/nature3-700.jpg", "size": 74561, "type": "image/jpeg" }, { "file": "img/gallery/nature3.jpg", "size": 2099692, "type": "image/jpeg" }, { "file": "img/gallery/nature3.txt", "size": 981, "type": "text/plain" }, { "file": "img/gallery/nature4-300.avif", "size": 9311, "type": "image/avif" }, { "file": "img/gallery/nature4-300.jpg", "size": 16525, "type": "image/jpeg" }, { "file": "img/gallery/nature4-500.avif", "size": 18776, "type": "image/avif" }, { "file": "img/gallery/nature4-500.jpg", "size": 37129, "type": "image/jpeg" }, { "file": "img/gallery/nature4-700.avif", "size": 29335, "type": "image/avif" }, { "file": "img/gallery/nature4-700.jpg", "size": 60581, "type": "image/jpeg" }, { "file": "img/gallery/nature4.jpg", "size": 69702, "type": "image/jpeg" }, { "file": "img/gallery/nature4.txt", "size": 981, "type": "text/plain" }, { "file": "img/gallery/nature5-300.avif", "size": 14323, "type": "image/avif" }, { "file": "img/gallery/nature5-300.jpg", "size": 20022, "type": "image/jpeg" }, { "file": "img/gallery/nature5-500.avif", "size": 35167, "type": "image/avif" }, { "file": "img/gallery/nature5-500.jpg", "size": 48940, "type": "image/jpeg" }, { "file": "img/gallery/nature5-700.avif", "size": 57773, "type": "image/avif" }, { "file": "img/gallery/nature5-700.jpg", "size": 84597, "type": "image/jpeg" }, { "file": "img/gallery/nature5.jpg", "size": 97632, "type": "image/jpeg" }, { "file": "img/gallery/nature5.txt", "size": 981, "type": "text/plain" }, { "file": "img/gallery/workshop-24Oct2021.jpg", "size": 49202, "type": "image/jpeg" }, { "file": "img/gallery/workshop1-1100.avif", "size": 19892, "type": "image/avif" }, { "file": "img/gallery/workshop1-1100.jpg", "size": 58252, "type": "image/jpeg" }, { "file": "img/gallery/workshop1-1300.avif", "size": 24242, "type": "image/avif" }, { "file": "img/gallery/workshop1-1300.jpg", "size": 74687, "type": "image/jpeg" }, { "file": "img/gallery/workshop1-300.avif", "size": 4468, "type": "image/avif" }, { "file": "img/gallery/workshop1-300.jpg", "size": 8575, "type": "image/jpeg" }, { "file": "img/gallery/workshop1-500.avif", "size": 8081, "type": "image/avif" }, { "file": "img/gallery/workshop1-500.jpg", "size": 18284, "type": "image/jpeg" }, { "file": "img/gallery/workshop1-700.avif", "size": 11829, "type": "image/avif" }, { "file": "img/gallery/workshop1-700.jpg", "size": 29919, "type": "image/jpeg" }, { "file": "img/gallery/workshop1-900.avif", "size": 15841, "type": "image/avif" }, { "file": "img/gallery/workshop1-900.jpg", "size": 43649, "type": "image/jpeg" }, { "file": "img/gallery/workshop1.jpg", "size": 7277056, "type": "image/jpeg" }, { "file": "img/gallery/workshop1.txt", "size": 1263, "type": "text/plain" }, { "file": "img/gallery/workshop2-1100.avif", "size": 23369, "type": "image/avif" }, { "file": "img/gallery/workshop2-1100.jpg", "size": 64791, "type": "image/jpeg" }, { "file": "img/gallery/workshop2-1300.avif", "size": 27871, "type": "image/avif" }, { "file": "img/gallery/workshop2-1300.jpg", "size": 82117, "type": "image/jpeg" }, { "file": "img/gallery/workshop2-300.avif", "size": 5301, "type": "image/avif" }, { "file": "img/gallery/workshop2-300.jpg", "size": 9126, "type": "image/jpeg" }, { "file": "img/gallery/workshop2-500.avif", "size": 9746, "type": "image/avif" }, { "file": "img/gallery/workshop2-500.jpg", "size": 20413, "type": "image/jpeg" }, { "file": "img/gallery/workshop2-700.avif", "size": 14402, "type": "image/avif" }, { "file": "img/gallery/workshop2-700.jpg", "size": 33708, "type": "image/jpeg" }, { "file": "img/gallery/workshop2-900.avif", "size": 18921, "type": "image/avif" }, { "file": "img/gallery/workshop2-900.jpg", "size": 48686, "type": "image/jpeg" }, { "file": "img/gallery/workshop2.jpg", "size": 7382528, "type": "image/jpeg" }, { "file": "img/gallery/workshop2.txt", "size": 1263, "type": "text/plain" }, { "file": "img/gallery/workshop3-1100.avif", "size": 14204, "type": "image/avif" }, { "file": "img/gallery/workshop3-1100.jpg", "size": 44684, "type": "image/jpeg" }, { "file": "img/gallery/workshop3-1300.avif", "size": 17297, "type": "image/avif" }, { "file": "img/gallery/workshop3-1300.jpg", "size": 57936, "type": "image/jpeg" }, { "file": "img/gallery/workshop3-300.avif", "size": 3382, "type": "image/avif" }, { "file": "img/gallery/workshop3-300.jpg", "size": 6828, "type": "image/jpeg" }, { "file": "img/gallery/workshop3-500.avif", "size": 5737, "type": "image/avif" }, { "file": "img/gallery/workshop3-500.jpg", "size": 13933, "type": "image/jpeg" }, { "file": "img/gallery/workshop3-700.avif", "size": 8261, "type": "image/avif" }, { "file": "img/gallery/workshop3-700.jpg", "size": 22234, "type": "image/jpeg" }, { "file": "img/gallery/workshop3-900.avif", "size": 11141, "type": "image/avif" }, { "file": "img/gallery/workshop3-900.jpg", "size": 32672, "type": "image/jpeg" }, { "file": "img/gallery/workshop3.jpg", "size": 699290, "type": "image/jpeg" }, { "file": "img/gallery/workshop3.txt", "size": 1263, "type": "text/plain" }, { "file": "img/gallery/workshop4-1100.avif", "size": 23050, "type": "image/avif" }, { "file": "img/gallery/workshop4-1100.jpg", "size": 89220, "type": "image/jpeg" }, { "file": "img/gallery/workshop4-1300.avif", "size": 26970, "type": "image/avif" }, { "file": "img/gallery/workshop4-1300.jpg", "size": 111172, "type": "image/jpeg" }, { "file": "img/gallery/workshop4-300.avif", "size": 7361, "type": "image/avif" }, { "file": "img/gallery/workshop4-300.jpg", "size": 16865, "type": "image/jpeg" }, { "file": "img/gallery/workshop4-500.avif", "size": 11373, "type": "image/avif" }, { "file": "img/gallery/workshop4-500.jpg", "size": 32246, "type": "image/jpeg" }, { "file": "img/gallery/workshop4-700.avif", "size": 15200, "type": "image/avif" }, { "file": "img/gallery/workshop4-700.jpg", "size": 49496, "type": "image/jpeg" }, { "file": "img/gallery/workshop4-900.avif", "size": 19254, "type": "image/avif" }, { "file": "img/gallery/workshop4-900.jpg", "size": 68883, "type": "image/jpeg" }, { "file": "img/gallery/workshop4.jpg", "size": 1427606, "type": "image/jpeg" }, { "file": "img/gallery/workshop4.txt", "size": 1263, "type": "text/plain" }, { "file": "img/gallery/workshop5-1100.avif", "size": 38410, "type": "image/avif" }, { "file": "img/gallery/workshop5-1100.jpg", "size": 82473, "type": "image/jpeg" }, { "file": "img/gallery/workshop5-1300.avif", "size": 47792, "type": "image/avif" }, { "file": "img/gallery/workshop5-1300.jpg", "size": 108051, "type": "image/jpeg" }, { "file": "img/gallery/workshop5-300.avif", "size": 6431, "type": "image/avif" }, { "file": "img/gallery/workshop5-300.jpg", "size": 10617, "type": "image/jpeg" }, { "file": "img/gallery/workshop5-500.avif", "size": 13231, "type": "image/avif" }, { "file": "img/gallery/workshop5-500.jpg", "size": 23962, "type": "image/jpeg" }, { "file": "img/gallery/workshop5-700.avif", "size": 21003, "type": "image/avif" }, { "file": "img/gallery/workshop5-700.jpg", "size": 40999, "type": "image/jpeg" }, { "file": "img/gallery/workshop5-900.avif", "size": 29110, "type": "image/avif" }, { "file": "img/gallery/workshop5-900.jpg", "size": 60055, "type": "image/jpeg" }, { "file": "img/gallery/workshop5.jpg", "size": 3961778, "type": "image/jpeg" }, { "file": "img/gallery/workshop5.txt", "size": 1263, "type": "text/plain" }, { "file": "img/held-1000.avif", "size": 109480, "type": "image/avif" }, { "file": "img/held-1000.jpg", "size": 139858, "type": "image/jpeg" }, { "file": "img/held-1200.avif", "size": 142164, "type": "image/avif" }, { "file": "img/held-1200.jpg", "size": 190390, "type": "image/jpeg" }, { "file": "img/held-1400.avif", "size": 176462, "type": "image/avif" }, { "file": "img/held-1400.jpg", "size": 246606, "type": "image/jpeg" }, { "file": "img/held-1600.avif", "size": 211491, "type": "image/avif" }, { "file": "img/held-1600.jpg", "size": 304800, "type": "image/jpeg" }, { "file": "img/held-1800.avif", "size": 247250, "type": "image/avif" }, { "file": "img/held-1800.jpg", "size": 369433, "type": "image/jpeg" }, { "file": "img/held-2000.avif", "size": 280718, "type": "image/avif" }, { "file": "img/held-2000.jpg", "size": 436492, "type": "image/jpeg" }, { "file": "img/held.jpg", "size": 2099692, "type": "image/jpeg" }, { "file": "img/held.txt", "size": 1197, "type": "text/plain" }, { "file": "img/instagram/nature4.jpg", "size": 69702, "type": "image/jpeg" }, { "file": "img/instagram/nature5.jpg", "size": 97632, "type": "image/jpeg" }, { "file": "img/kiss-1000.avif", "size": 17511, "type": "image/avif" }, { "file": "img/kiss-1000.jpg", "size": 50501, "type": "image/jpeg" }, { "file": "img/kiss.jpg", "size": 202006, "type": "image/jpeg" }, { "file": "img/kiss.txt", "size": 822, "type": "text/plain" }, { "file": "img/leaves-400.avif", "size": 11841, "type": "image/avif" }, { "file": "img/leaves-400.jpg", "size": 23332, "type": "image/jpeg" }, { "file": "img/leaves.jpg", "size": 1884971, "type": "image/jpeg" }, { "file": "img/leaves.txt", "size": 822, "type": "text/plain" }, { "file": "img/logBalance-665.avif", "size": 30514, "type": "image/avif" }, { "file": "img/logBalance-665.jpg", "size": 66205, "type": "image/jpeg" }, { "file": "img/logBalance.jpg", "size": 258118, "type": "image/jpeg" }, { "file": "img/logBalance.txt", "size": 834, "type": "text/plain" }, { "file": "img/logo_v1.png", "size": 31534, "type": "image/png" }, { "file": "img/logo_v1.svg", "size": 11159, "type": "image/svg+xml" }, { "file": "img/portrait.jpg", "size": 422332, "type": "image/jpeg" }, { "file": "img/ptsd.jpg", "size": 147784, "type": "image/jpeg" }, { "file": "img/truck-1000.avif", "size": 62680, "type": "image/avif" }, { "file": "img/truck-1000.jpg", "size": 81249, "type": "image/jpeg" }, { "file": "img/truck-1200.avif", "size": 94652, "type": "image/avif" }, { "file": "img/truck-1200.jpg", "size": 120871, "type": "image/jpeg" }, { "file": "img/truck-1400.avif", "size": 131898, "type": "image/avif" }, { "file": "img/truck-1400.jpg", "size": 169786, "type": "image/jpeg" }, { "file": "img/truck-1600.avif", "size": 172062, "type": "image/avif" }, { "file": "img/truck-1600.jpg", "size": 223837, "type": "image/jpeg" }, { "file": "img/truck-1800.avif", "size": 215363, "type": "image/avif" }, { "file": "img/truck-1800.jpg", "size": 286139, "type": "image/jpeg" }, { "file": "img/truck-2000.avif", "size": 258636, "type": "image/avif" }, { "file": "img/truck-2000.jpg", "size": 352682, "type": "image/jpeg" }, { "file": "img/truck.jpg", "size": 5172797, "type": "image/jpeg" }, { "file": "img/truck.txt", "size": 1215, "type": "text/plain" }, { "file": "img/walk-1000.avif", "size": 143061, "type": "image/avif" }, { "file": "img/walk-1000.jpg", "size": 201179, "type": "image/jpeg" }, { "file": "img/walk-1100.avif", "size": 159915, "type": "image/avif" }, { "file": "img/walk-1100.jpg", "size": 234432, "type": "image/jpeg" }, { "file": "img/walk-400.avif", "size": 33477, "type": "image/avif" }, { "file": "img/walk-400.jpg", "size": 38510, "type": "image/jpeg" }, { "file": "img/walk-500.avif", "size": 49778, "type": "image/avif" }, { "file": "img/walk-500.jpg", "size": 58542, "type": "image/jpeg" }, { "file": "img/walk-600.avif", "size": 68110, "type": "image/avif" }, { "file": "img/walk-600.jpg", "size": 81743, "type": "image/jpeg" }, { "file": "img/walk-700.avif", "size": 87583, "type": "image/avif" }, { "file": "img/walk-700.jpg", "size": 108630, "type": "image/jpeg" }, { "file": "img/walk-800.avif", "size": 106420, "type": "image/avif" }, { "file": "img/walk-800.jpg", "size": 137471, "type": "image/jpeg" }, { "file": "img/walk-900.avif", "size": 125415, "type": "image/avif" }, { "file": "img/walk-900.jpg", "size": 169009, "type": "image/jpeg" }, { "file": "img/walk.jpg", "size": 1087895, "type": "image/jpeg" }, { "file": "img/walk.txt", "size": 1311, "type": "text/plain" }, { "file": "img/walkOnBeach-1000.avif", "size": 15057, "type": "image/avif" }, { "file": "img/walkOnBeach-1000.jpg", "size": 43332, "type": "image/jpeg" }, { "file": "img/walkOnBeach-1200.avif", "size": 18760, "type": "image/avif" }, { "file": "img/walkOnBeach-1200.jpg", "size": 57247, "type": "image/jpeg" }, { "file": "img/walkOnBeach-1400.avif", "size": 22376, "type": "image/avif" }, { "file": "img/walkOnBeach-1400.jpg", "size": 71758, "type": "image/jpeg" }, { "file": "img/walkOnBeach-1600.avif", "size": 26118, "type": "image/avif" }, { "file": "img/walkOnBeach-1600.jpg", "size": 87763, "type": "image/jpeg" }, { "file": "img/walkOnBeach-1800.avif", "size": 30483, "type": "image/avif" }, { "file": "img/walkOnBeach-1800.jpg", "size": 105563, "type": "image/jpeg" }, { "file": "img/walkOnBeach-2000.avif", "size": 34225, "type": "image/avif" }, { "file": "img/walkOnBeach-2000.jpg", "size": 123296, "type": "image/jpeg" }, { "file": "img/walkOnBeach.jpg", "size": 946781, "type": "image/jpeg" }, { "file": "img/walkOnBeach.txt", "size": 1323, "type": "text/plain" }, { "file": "img/walkOnBeachO-1000.avif", "size": 11863, "type": "image/avif" }, { "file": "img/walkOnBeachO-1000.jpg", "size": 37555, "type": "image/jpeg" }, { "file": "img/walkOnBeachO-1200.avif", "size": 14849, "type": "image/avif" }, { "file": "img/walkOnBeachO-1200.jpg", "size": 49426, "type": "image/jpeg" }, { "file": "img/walkOnBeachO-1400.avif", "size": 17718, "type": "image/avif" }, { "file": "img/walkOnBeachO-1400.jpg", "size": 62066, "type": "image/jpeg" }, { "file": "img/walkOnBeachO-1600.avif", "size": 20752, "type": "image/avif" }, { "file": "img/walkOnBeachO-1600.jpg", "size": 75730, "type": "image/jpeg" }, { "file": "img/walkOnBeachO-1800.avif", "size": 24094, "type": "image/avif" }, { "file": "img/walkOnBeachO-1800.jpg", "size": 91334, "type": "image/jpeg" }, { "file": "img/walkOnBeachO-2000.avif", "size": 27182, "type": "image/avif" }, { "file": "img/walkOnBeachO-2000.jpg", "size": 106893, "type": "image/jpeg" }, { "file": "img/walkOnBeachO.jpg", "size": 923506, "type": "image/jpeg" }, { "file": "img/walkOnBeachO.txt", "size": 846, "type": "text/plain" }, { "file": "img/watering-400.avif", "size": 17339, "type": "image/avif" }, { "file": "img/watering-400.jpg", "size": 27978, "type": "image/jpeg" }, { "file": "img/watering.jpg", "size": 3234736, "type": "image/jpeg" }, { "file": "img/watering.txt", "size": 828, "type": "text/plain" }, { "file": "img/windows-1000.avif", "size": 23169, "type": "image/avif" }, { "file": "img/windows-1000.jpg", "size": 74267, "type": "image/jpeg" }, { "file": "img/windows-400.avif", "size": 9107, "type": "image/avif" }, { "file": "img/windows-400.jpg", "size": 21397, "type": "image/jpeg" }, { "file": "img/windows-600.avif", "size": 13628, "type": "image/avif" }, { "file": "img/windows-600.jpg", "size": 36763, "type": "image/jpeg" }, { "file": "img/windows-800.avif", "size": 18344, "type": "image/avif" }, { "file": "img/windows-800.jpg", "size": 54430, "type": "image/jpeg" }, { "file": "img/windows.jpg", "size": 337491, "type": "image/jpeg" }, { "file": "img/windows.txt", "size": 1065, "type": "text/plain" }, { "file": "img/windows.xcf", "size": 4235081, "type": null }, { "file": "img/workshop-1000.avif", "size": 21940, "type": "image/avif" }, { "file": "img/workshop-1000.jpg", "size": 58529, "type": "image/jpeg" }, { "file": "img/workshop-1100.avif", "size": 24702, "type": "image/avif" }, { "file": "img/workshop-1100.jpg", "size": 67759, "type": "image/jpeg" }, { "file": "img/workshop-400.avif", "size": 7367, "type": "image/avif" }, { "file": "img/workshop-400.jpg", "size": 14423, "type": "image/jpeg" }, { "file": "img/workshop-500.avif", "size": 9667, "type": "image/avif" }, { "file": "img/workshop-500.jpg", "size": 20289, "type": "image/jpeg" }, { "file": "img/workshop-600.avif", "size": 11958, "type": "image/avif" }, { "file": "img/workshop-600.jpg", "size": 26537, "type": "image/jpeg" }, { "file": "img/workshop-700.avif", "size": 14598, "type": "image/avif" }, { "file": "img/workshop-700.jpg", "size": 33776, "type": "image/jpeg" }, { "file": "img/workshop-800.avif", "size": 16831, "type": "image/avif" }, { "file": "img/workshop-800.jpg", "size": 41127, "type": "image/jpeg" }, { "file": "img/workshop-900.avif", "size": 19461, "type": "image/avif" }, { "file": "img/workshop-900.jpg", "size": 49599, "type": "image/jpeg" }, { "file": "img/workshop.jpg", "size": 322753, "type": "image/jpeg" }, { "file": "img/workshop.txt", "size": 1407, "type": "text/plain" }, { "file": "mstile-150x150.png", "size": 16950, "type": "image/png" }, { "file": "robots.txt", "size": 67, "type": "text/plain" }, { "file": "safari-pinned-tab.svg", "size": 8574, "type": "image/svg+xml" }, { "file": "site.webmanifest", "size": 426, "type": "application/manifest+json" }],
  layout: "src/routes/__layout.svelte",
  error: ".svelte-kit/build/components/error.svelte",
  routes: [
    {
      type: "page",
      pattern: /^\/$/,
      params: empty,
      a: ["src/routes/__layout.svelte", "src/routes/index.svelte"],
      b: [".svelte-kit/build/components/error.svelte"]
    },
    {
      type: "page",
      pattern: /^\/activities\/?$/,
      params: empty,
      a: ["src/routes/__layout.svelte", "src/routes/activities.svelte"],
      b: [".svelte-kit/build/components/error.svelte"]
    },
    {
      type: "page",
      pattern: /^\/contact\/?$/,
      params: empty,
      a: ["src/routes/__layout.svelte", "src/routes/contact.svelte"],
      b: [".svelte-kit/build/components/error.svelte"]
    },
    {
      type: "page",
      pattern: /^\/about\/?$/,
      params: empty,
      a: ["src/routes/__layout.svelte", "src/routes/about.svelte"],
      b: [".svelte-kit/build/components/error.svelte"]
    }
  ]
};
const get_hooks = (hooks) => ({
  getSession: hooks.getSession || (() => ({})),
  handle: hooks.handle || (({ request, resolve: resolve2 }) => resolve2(request)),
  handleError: hooks.handleError || (({ error: error2 }) => console.error(error2.stack)),
  externalFetch: hooks.externalFetch || fetch
});
const module_lookup = {
  "src/routes/__layout.svelte": () => Promise.resolve().then(function() {
    return __layout;
  }),
  ".svelte-kit/build/components/error.svelte": () => Promise.resolve().then(function() {
    return error;
  }),
  "src/routes/index.svelte": () => Promise.resolve().then(function() {
    return index;
  }),
  "src/routes/activities.svelte": () => Promise.resolve().then(function() {
    return activities;
  }),
  "src/routes/contact.svelte": () => Promise.resolve().then(function() {
    return contact;
  }),
  "src/routes/about.svelte": () => Promise.resolve().then(function() {
    return about;
  })
};
const metadata_lookup = { "src/routes/__layout.svelte": { "entry": "pages/__layout.svelte-4da571c8.js", "css": ["assets/pages/__layout.svelte-9e689638.css"], "js": ["pages/__layout.svelte-4da571c8.js", "chunks/vendor-dac554f8.js"], "styles": [] }, ".svelte-kit/build/components/error.svelte": { "entry": "error.svelte-f5faeafa.js", "css": [], "js": ["error.svelte-f5faeafa.js", "chunks/vendor-dac554f8.js"], "styles": [] }, "src/routes/index.svelte": { "entry": "pages/index.svelte-4621d7df.js", "css": ["assets/pages/index.svelte-e155d3f0.css"], "js": ["pages/index.svelte-4621d7df.js", "chunks/vendor-dac554f8.js"], "styles": [] }, "src/routes/activities.svelte": { "entry": "pages/activities.svelte-2f8007a2.js", "css": ["assets/pages/activities.svelte-d080f3e2.css"], "js": ["pages/activities.svelte-2f8007a2.js", "chunks/vendor-dac554f8.js"], "styles": [] }, "src/routes/contact.svelte": { "entry": "pages/contact.svelte-4349d165.js", "css": ["assets/pages/contact.svelte-0c58b548.css"], "js": ["pages/contact.svelte-4349d165.js", "chunks/vendor-dac554f8.js"], "styles": [] }, "src/routes/about.svelte": { "entry": "pages/about.svelte-e3a2e489.js", "css": ["assets/pages/about.svelte-b75f7008.css"], "js": ["pages/about.svelte-e3a2e489.js", "chunks/vendor-dac554f8.js"], "styles": [] } };
async function load_component(file) {
  const { entry, css: css2, js, styles } = metadata_lookup[file];
  return {
    module: await module_lookup[file](),
    entry: assets + "/_app/" + entry,
    css: css2.map((dep) => assets + "/_app/" + dep),
    js: js.map((dep) => assets + "/_app/" + dep),
    styles
  };
}
function render(request, {
  prerender
} = {}) {
  const host = request.headers["host"];
  return respond({ ...request, host }, options, { prerender });
}
var app = "";
var index_svelte_svelte_type_style_lang$2 = "";
const css$6 = {
  code: "footer.svelte-auezuk.svelte-auezuk{min-height:300px;background-color:var(--dark-green);display:flex;flex-direction:column;align-items:center;justify-content:center;font-family:'Lora', serif;font-style:normal;font-weight:500}footer.svelte-auezuk>div.svelte-auezuk{width:300px;display:flex;flex-direction:row;align-items:center}a.svelte-auezuk.svelte-auezuk{color:var(--primary-light);text-decoration:none}svg.svelte-auezuk.svelte-auezuk{margin:0 20px;fill:var(--primary-light)}div.svelte-auezuk:hover svg.svelte-auezuk{width:60px;height:60px;margin:0 20px;fill:var(--primary-light)}div.svelte-auezuk:hover a.svelte-auezuk{text-decoration:underline}@media screen and (min-width: 900px){footer.svelte-auezuk.svelte-auezuk{flex-direction:row;justify-content:center}footer.svelte-auezuk>div.svelte-auezuk{flex-direction:column;justify-content:center;align-items:center}}",
  map: null
};
const Footer = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css$6);
  return `<footer class="${"svelte-auezuk"}"><div class="${"svelte-auezuk"}"><a href="${"https://www.facebook.com/littleadventurersraposeira"}" class="${"svelte-auezuk"}"><svg height="${"50px"}" width="${"50px"}" alt="${"Facebook Icon"}" xmlns="${"http://www.w3.org/2000/svg"}" viewBox="${"0 0 1200 1200"}" class="${"svelte-auezuk"}"><path d="${"M0 0v1200h1200V0H0zm863.232 156.592c8.716-.185 17.792.098 27.173.732 34.476.047 70.483 3.155 106.202 6.299l-3.882 142.09h-95.948c-44.988-.996-61.235 16.473-62.695 67.236V484.57h162.525l-6.446 152.198H834.082v423.706h-158.57V636.768H565.43V484.57h110.083V353.906c0-94.21 39.829-154.174 118.286-184.57 20.15-7.928 43.288-12.19 69.433-12.744z"}"></path></svg></a>
		<a href="${"https://www.facebook.com/littleadventurersraposeira"}" class="${"svelte-auezuk"}">littleadventurers
		</a></div>
	<div class="${"svelte-auezuk"}"><a href="${"https://www.instagram.com/little__adventurers/"}" class="${"svelte-auezuk"}"><svg height="${"50px"}" width="${"50px"}" viewBox="${"0 0 1792 1792"}" alt="${"Instagram Icon"}" xmlns="${"http://www.w3.org/2000/svg"}" class="${"svelte-auezuk"}"><path d="${"M1152 896q0-106-75-181t-181-75-181 75-75 181 75 181 181 75 181-75 75-181zm138 0q0 164-115 279t-279 115-279-115-115-279 115-279 279-115 279 115 115 279zm108-410q0 38-27 65t-65 27-65-27-27-65 27-65 65-27 65 27 27 65zM896 266q-7 0-76.5-.5t-105.5 0-96.5 3-103 10T443 297q-50 20-88 58t-58 88q-11 29-18.5 71.5t-10 103-3 96.5 0 105.5.5 76.5-.5 76.5 0 105.5 3 96.5 10 103T297 1349q20 50 58 88t88 58q29 11 71.5 18.5t103 10 96.5 3 105.5 0 76.5-.5 76.5.5 105.5 0 96.5-3 103-10 71.5-18.5q50-20 88-58t58-88q11-29 18.5-71.5t10-103 3-96.5 0-105.5-.5-76.5.5-76.5 0-105.5-3-96.5-10-103T1495 443q-20-50-58-88t-88-58q-29-11-71.5-18.5t-103-10-96.5-3-105.5 0-76.5.5zm768 630q0 229-5 317-10 208-124 322t-322 124q-88 5-317 5t-317-5q-208-10-322-124t-124-322q-5-88-5-317t5-317q10-208 124-322t322-124q88-5 317-5t317 5q208 10 322 124t124 322q5 88 5 317z"}"></path></svg></a>
		<a href="${"https://www.instagram.com/little__adventurers/"}" class="${"svelte-auezuk"}">little__adventurers
		</a></div>
	<div class="${"svelte-auezuk"}"><a href="${"mailto:example@tutorialspark.com"}" class="${"svelte-auezuk"}"><svg height="${"50px"}" width="${"50px"}" viewBox="${"0 0 1195 1195"}" alt="${"Email Icon"}" xmlns="${"http://www.w3.org/2000/svg"}" class="${"svelte-auezuk"}"><path d="${"M1109.333 315q-2-25-20.5-42t-43.5-17h-896q-26 0-45 19t-19 45v640q0 26 19 45t45 19h896q26 0 45-19t19-45V315zm-112 5l-400 303-382-303h782zm48 640h-896V349l428 339q19 16 39 1l429-325v596z"}"></path></svg></a>
		<a href="${"mailto:example@tutorialspark.com"}" class="${"svelte-auezuk"}">katharinablank6@gmail.com
		</a></div>
	<div class="${"svelte-auezuk"}"><svg height="${"50px"}" width="${"50px"}" viewBox="${"0 0 1792 1792"}" alt="${"Phone Icon"}" xmlns="${"http://www.w3.org/2000/svg"}" class="${"svelte-auezuk"}"><path d="${"M1600 1240q0 27-10 70.5t-21 68.5q-21 50-122 106-94 51-186 51-27 0-52.5-3.5T1151 1520t-47.5-14.5-55.5-20.5-49-18q-98-35-175-83-128-79-264.5-215.5T344 904q-48-77-83-175-3-9-18-49t-20.5-55.5T208 577t-12.5-57.5T192 467q0-92 51-186 56-101 106-122 25-11 68.5-21t70.5-10q14 0 21 3 18 6 53 76 11 19 30 54t35 63.5 31 53.5q3 4 17.5 25t21.5 35.5 7 28.5q0 20-28.5 50t-62 55-62 53-28.5 46q0 9 5 22.5t8.5 20.5 14 24 11.5 19q76 137 174 235t235 174q2 1 19 11.5t24 14 20.5 8.5 22.5 5q18 0 46-28.5t53-62 55-62 50-28.5q14 0 28.5 7t35.5 21.5 25 17.5q25 15 53.5 31t63.5 35 54 30q70 35 76 53 3 7 3 21z"}"></path></svg>
		<a href="${"tel:+351925089235"}" class="${"svelte-auezuk"}">+351 925089235
		</a></div>
</footer>`;
});
var logo = "/_app/assets/logo-1b4a0ec6.svg";
var index_svelte_svelte_type_style_lang$1 = "";
const css$5 = {
  code: '#logo.svelte-z064bh.svelte-z064bh{height:110px}#menuItems.svelte-z064bh.svelte-z064bh{display:none}#menuItems.svelte-z064bh li.svelte-z064bh{display:inline-block;width:100%;padding-bottom:20px;padding-left:10px;padding-right:10px}#menuItems.svelte-z064bh li.svelte-z064bh:hover{background-color:var(--primary-dark)}#close.svelte-z064bh.svelte-z064bh{display:none}nav.svelte-z064bh.svelte-z064bh{background-color:var(--primary-dark);position:absolute;z-index:10;top:0;width:100%;padding-top:10px;height:60px;display:-ms-grid;display:grid;-ms-grid-columns:1fr (170px);grid-template-columns:1fr repeat(1, 200px);grid-gap:40px;-webkit-box-pack:center;-ms-flex-pack:center;justify-content:center;justify-items:center;list-style-type:none;font-family:"ClaudeSansPlain-Regular";text-transform:capitalize}@media screen and (min-width: 900px){nav.svelte-z064bh.svelte-z064bh{-ms-grid-columns:200px 1fr;grid-template-columns:200px 1fr}}nav.svelte-z064bh .svelte-z064bh:first-child{-ms-grid-column-align:left;justify-self:left}nav.svelte-z064bh a.svelte-z064bh{color:white;font-size:calc(1.3em + 0.5vh);font-weight:300;text-decoration:none;text-transform:capitalize}nav.svelte-z064bh a.svelte-z064bh:hover{text-decoration:underline}#menuItems.svelte-z064bh.svelte-z064bh:target{display:block;background-color:var(--primary-dark)}#logo.svelte-z064bh.svelte-z064bh{position:relative;left:-90%;animation:svelte-z064bh-rollIn 1s  0.2s forwards;animation-timing-function:cubic-bezier(0, 0, 0.43, 1.58)}@keyframes svelte-z064bh-rollIn{0%{left:-90%;transform:rotate(-180deg)}100%{left:0%;transform:rotate(0deg)}}#menu-wrapper.svelte-z064bh.svelte-z064bh{position:relative;opacity:0%;animation:svelte-z064bh-fadeIn 1s 0.2s forwards;animation-timing-function:cubic-bezier(0.19, 1, 0.22, 1)}@keyframes svelte-z064bh-fadeIn{0%{opacity:0%}100%{opacity:100%}}@media screen and (min-width: 900px){#menuItems.svelte-z064bh.svelte-z064bh{display:inline-block;list-style-type:none;text-align:center}#logo.svelte-z064bh.svelte-z064bh{height:150px}#menuItems.svelte-z064bh li.svelte-z064bh{width:80px}#close.svelte-z064bh.svelte-z064bh{visibility:hidden}#hamburger.svelte-z064bh.svelte-z064bh{display:none}}',
  map: null
};
const Nav = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css$5);
  return `<nav class="${"svelte-z064bh"}"><a href="${"."}" class="${"svelte-z064bh"}"><img id="${"logo"}"${add_attribute("src", logo, 0)} alt="${"Circular Logo of Little Adventurers. Animated to roll in from the left."}" class="${"svelte-z064bh"}"></a>

	<div id="${"menu-wrapper"}" class="${"svelte-z064bh"}"><div class="${"svelte-z064bh"}"><a href="${"#menuItems"}" class="${"svelte-z064bh"}"><svg id="${"hamburger"}" xmlns="${"http://www.w3.org/2000/svg"}" viewBox="${"0 0 32 32"}" width="${"32"}" height="${"32"}" fill="${"none"}" stroke="${"currentcolor"}" stroke-linecap="${"round"}" stroke-linejoin="${"round"}" stroke-width="${"5"}" class="${"svelte-z064bh"}"><path d="${"M4 8 L28 8 M4 16 L28 16 M4 24 L28 24"}" class="${"svelte-z064bh"}"></path></svg></a></div>

		<ul id="${"menuItems"}" class="${"svelte-z064bh"}"><li class="${"svelte-z064bh"}"><a href="${"/#top"}" class="${"svelte-z064bh"}">Home</a></li>
			<li class="${"svelte-z064bh"}"><a href="${"activities/#top"}" class="${"svelte-z064bh"}">Activities </a></li>
			<li class="${"svelte-z064bh"}"><a href="${"about/#top"}" class="${"svelte-z064bh"}">About</a></li>
			<li class="${"svelte-z064bh"}"><a href="${"contact/#top"}" class="${"svelte-z064bh"}">Contact</a></li>
			<li id="${"close"}" class="${"svelte-z064bh"}"><a href="${"#top"}" class="${"svelte-z064bh"}"><svg xmlns="${"http://www.w3.org/2000/svg"}" viewBox="${"0 0 32 32"}" width="${"32"}" height="${"32"}" fill="${"none"}" stroke="${"currentcolor"}" stroke-linecap="${"round"}" stroke-linejoin="${"round"}" stroke-width="${"2"}" class="${"svelte-z064bh"}"><path d="${"M30 20 L16 8 2 20"}" class="${"svelte-z064bh"}"></path></svg></a></li></ul></div>
</nav>`;
});
var __layout_svelte_svelte_type_style_lang = "";
const css$4 = {
  code: ".parallax.svelte-hjt96z{background-color:var(--background);height:500px;height:100vh;overflow-x:hidden;overflow-y:auto;-webkit-perspective:300px;perspective:300px;-webkit-perspective-origin-x:100%;-ms-perspective-origin-x:100%}",
  map: null
};
const _layout = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css$4);
  return `${validate_component(Nav, "Nav").$$render($$result, {}, {}, {})}
<div class="${"parallax svelte-hjt96z"}">${slots.default ? slots.default({}) : ``}
  ${validate_component(Footer, "Footer").$$render($$result, {}, {}, {})}
</div>`;
});
var __layout = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": _layout
});
function load({ error: error2, status }) {
  return { props: { error: error2, status } };
}
const Error$1 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { status } = $$props;
  let { error: error2 } = $$props;
  if ($$props.status === void 0 && $$bindings.status && status !== void 0)
    $$bindings.status(status);
  if ($$props.error === void 0 && $$bindings.error && error2 !== void 0)
    $$bindings.error(error2);
  return `<h1>${escape(status)}</h1>

<pre>${escape(error2.message)}</pre>



${error2.frame ? `<pre>${escape(error2.frame)}</pre>` : ``}
${error2.stack ? `<pre>${escape(error2.stack)}</pre>` : ``}`;
});
var error = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": Error$1,
  load
});
var index_svelte_svelte_type_style_lang = "";
const css$3 = {
  code: ".title.svelte-1s8wtc1.svelte-1s8wtc1{text-align:center;position:absolute;left:50%;top:50%;-webkit-transform:translate(-50%, -30%);transform:translate(-50%, -30%)}.title.svelte-1s8wtc1 h1.svelte-1s8wtc1{margin-bottom:20px}.title.svelte-1s8wtc1 h2.svelte-1s8wtc1{margin-top:40px;color:white;font-weight:bolder;font-size:2rem}.parallax__group.svelte-1s8wtc1.svelte-1s8wtc1{position:relative;height:500px;height:90vh;-webkit-transform-style:preserve-3d;transform-style:preserve-3d}.parallax__layer.svelte-1s8wtc1.svelte-1s8wtc1{position:absolute;top:60px;left:0;right:0;bottom:0;-webkit-transform-origin-x:100%;-ms-transform-origin-x:100%}.parallax__layer--fore.svelte-1s8wtc1.svelte-1s8wtc1{-webkit-transform:translateZ(90px) scale(0.7);transform:translateZ(90px) scale(0.7);z-index:1}.parallax__layer--base.svelte-1s8wtc1.svelte-1s8wtc1{-webkit-transform:translateZ(0);transform:translateZ(0);z-index:4}#group1.svelte-1s8wtc1.svelte-1s8wtc1{margin-top:10px;z-index:5}#group1.svelte-1s8wtc1 img.svelte-1s8wtc1{object-fit:cover;height:100%;width:100%}button.svelte-1s8wtc1.svelte-1s8wtc1{font-family:'ClaudeSansPlain-Regular', serif;font-style:normal;font-weight:700;font-size:1.5em;border:3px solid var(--primary-light);padding:15px 30px;color:var(--primary-light);background-color:var(--primary-dark);transition-duration:0.4s}button.svelte-1s8wtc1.svelte-1s8wtc1:hover{color:oldlace;background-color:var(--primary-dark);text-decoration:underline}#group2.svelte-1s8wtc1.svelte-1s8wtc1{display:flex;flex-direction:row;flex-wrap:wrap;justify-content:center;align-items:center;min-height:700px;margin:var(--section-gap) 0;z-index:10;position:relative}#group2.svelte-1s8wtc1>div.svelte-1s8wtc1{padding:50px;width:clamp(400px, 700px, 1000px)}#group2.svelte-1s8wtc1 img.svelte-1s8wtc1{padding:50px;height:auto;width:400px}#group3.svelte-1s8wtc1.svelte-1s8wtc1{height:700px}#group3.svelte-1s8wtc1 img.svelte-1s8wtc1{object-fit:cover;width:100%;height:700px}#group4.svelte-1s8wtc1.svelte-1s8wtc1{display:flex;flex-direction:row;flex-wrap:wrap;min-height:700px;justify-content:center;align-content:center;margin:var(--section-gap) 0}div.half.svelte-1s8wtc1.svelte-1s8wtc1{display:flex;flex-direction:row;flex-wrap:wrap;width:840px;justify-content:center}div.quater.svelte-1s8wtc1.svelte-1s8wtc1{width:clamp(200px, 400px, 100vw);padding:10px}",
  map: null
};
const Routes = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css$3);
  return `${$$result.head += `${$$result.title = `<title>HomePage Little Adventurers!</title>`, ""}`, ""}

<div id="${"group1"}" class="${"parallax__group svelte-1s8wtc1"}"><div class="${"parallax__layer parallax__layer--base svelte-1s8wtc1"}"><picture><source type="${"image/avif"}" srcset="${"/img/logBalance-665.avif 665w"}" media="${"(max-width: 1000px)"}" sizes="${"100vw"}">
      <source type="${"image/jpg"}" srcset="${"/img/logBalance-665.jpg 665w"}" media="${"(max-width: 1000px)"}" sizes="${"100vw"}">
      <source type="${"image/avif"}" srcset="${"\n                                      /img/walkOnBeachO-1000.avif 1000w,\n                                      /img/walkOnBeachO-1200.avif 1200w,\n                                      /img/walkOnBeachO-1400.avif 1400w,\n                                      /img/walkOnBeachO-1600.avif 1600w,\n                                      /img/walkOnBeachO-1800.avif 1800w,\n                                      /img/walkOnBeachO-2000.avif 2000w,"}" media="${"(min-width: 1000px)"}" sizes="${"100vw"}">
      <source type="${"image/jpg"}" srcset="${"\n                                      /img/walkOnBeachO-1000.jpg 1000w,\n                                      /img/walkOnBeachO-1200.jpg 1200w,\n                                      /img/walkOnBeachO-1400.jpg 1400w,\n                                      /img/walkOnBeachO-1600.jpg 1600w,\n                                      /img/walkOnBeachO-1800.jpg 1800w,\n                                      /img/walkOnBeachO-2000.jpg 2000w,"}" media="${"(min-width: 1000px)"}" sizes="${"100vw"}">
      <img src="${"/img/logBalance-665.jpg"}" width="${"100vw"}" height="${"100%"}" alt="${"vortex of leaves blown around smiling child"}" class="${"svelte-1s8wtc1"}"></picture></div>
  <div class="${"parallax__layer parallax__layer--fore svelte-1s8wtc1"}"><div class="${"title svelte-1s8wtc1"}"><h1 class="${"svelte-1s8wtc1"}">Little Adventurers</h1>
      <a href="${"/contact"}"><button class="${"svelte-1s8wtc1"}">Book Now</button></a>
      <h2 class="${"svelte-1s8wtc1"}">Outdoor activities and creative Workshops for kids in the Algarve Portugal.<br>Created from the love of working with kids.</h2></div></div></div>

<div id="${"group2"}" class="${"svelte-1s8wtc1"}"><div class="${"svelte-1s8wtc1"}"><h2 class="${"alternate"}">The Algarve offers the perfect place to go outside and enjoy the beauty of nature. I love to combine playing and learning for children.</h2>
    <h2 class="${"alternate"}">Learn how playing outdoors in nature can benefit your children intellectually,
    socially, emotionally, and physically, and discover activities for fostering their development.</h2></div>
  <picture><source type="${"image/avif"}" srcset="${"\n      /img/windows-1000.avif 1000w,\n      /img/windows-800.avif 800w,\n      /img/windows-600.avif 600w,\n      /img/windows-400.avif 400w,"}" sizes="${"(min-width: 500px) 700px, 100vw"}">
    <source type="${"image/jpg"}" srcset="${"\n      /img/windows-1000.jpg 1000w,\n      /img/windows-800.jpg 800w,\n      /img/windows-600.jpg 600w,\n      /img/windows-400.jpg 400w,"}" sizes="${"(min-width: 500px) 700px, 100vw"}">
    <img src="${"/img/windows-400.jpg"}" width="${"400px"}" height="${"467"}" alt="${"children playing in different circumstances"}" class="${"svelte-1s8wtc1"}"></picture></div>

<div id="${"group3"}" class="${"svelte-1s8wtc1"}"><picture><source type="${"image/avif"}" srcset="${"/img/cheek-667.avif 665w"}" media="${"(max-width: 700px)"}" sizes="${"100vw"}">
    <source type="${"image/jpg"}" srcset="${"/img/cheek-667.jpg 665w"}" media="${"(max-width: 700px)"}" sizes="${"100vw"}">
    <source type="${"image/avif"}" srcset="${"\n                                    /img/kiss-1000.avif 1000w"}" media="${"(min-width: 700px)"}" sizes="${"100vw"}">
    <source type="${"image/jpg"}" srcset="${"\n                                    /img/kiss-1000.jpg 1000w"}" media="${"(min-width: 700px)"}" sizes="${"100vw"}">
    <img src="${"/img/cheek-667.jpg"}" width="${"100vw"}" height="${"100%"}" alt="${"vortex of leaves blown around smiling child"}" class="${"svelte-1s8wtc1"}"></picture></div>

<div id="${"group4"}" class="${"svelte-1s8wtc1"}"><div class="${"half svelte-1s8wtc1"}"><div class="${"quater svelte-1s8wtc1"}"><h2 class="${"alternate"}">I believe each child is a unique &quot;being&quot; that learns and sprouts in creative settings, where they can embrace ideas and reveal their unlimited potential.
        </h2>
      <h2 class="${"alternate"}">Children should develop freely in nature, playing and discovering together.</h2></div>
    <div class="${"quater svelte-1s8wtc1"}"><picture><source type="${"image/avif"}" srcset="${"/img/dandylion-400.avif 400w"}" sizes="${"400px"}">
        <source type="${"image/jpg"}" srcset="${"/img/dandylion-400.jpg 400w"}" sizes="${"400px"}">
        <img src="${"/img/dandylion-400.jpg"}" width="${"400px"}" height="${"400px"}" alt="${"two children climbing a tree"}"></picture></div></div>
  <div class="${"half svelte-1s8wtc1"}"><div class="${"quater svelte-1s8wtc1"}"><h2 class="${"alternate"}">Learning through exercise outdoors is main motor for cognitive development
        In the early years it is about configuring imaginations, there is no creative &#39;wrong&#39;.
        </h2>
      <h2 class="${"alternate"}">I want each child to see the beauty, light, forms and patterns in everyday objects.</h2></div>
    <div class="${"quater svelte-1s8wtc1"}"><picture><source type="${"image/avif"}" srcset="${"/img/watering-400.avif 400w"}" sizes="${"400px"}">
        <source type="${"image/jpg"}" srcset="${"/img/watering-400.jpg 400w"}" sizes="${"400px"}">
        <img src="${"/img/watering-400.jpg"}" width="${"400px"}" height="${"400px"}" alt="${"vortex of leaves blown around smiling child"}"></picture></div></div>
</div>`;
});
var index = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": Routes
});
var activities_svelte_svelte_type_style_lang = "";
const css$2 = {
  code: '.section.svelte-iei411.svelte-iei411{margin-top:60px;display:grid;grid-gap:15px;grid-template-columns:repeat(6, 1fr);grid-auto-rows:minmax(100px, auto);grid-template-areas:"hd   hd  hd  hd  hd  hd"\n        "txt  txt txt txt txt txt"\n        "gal  gal gal gal gal gal"}@media(min-width: 1000px){.section.svelte-iei411.svelte-iei411{margin-bottom:50px;grid-template-areas:"hd   hd  hd  gal  gal  gal"\n            "txt  txt txt gal gal gal"\n            "txt  txt txt gal gal gal"}}.heading.svelte-iei411.svelte-iei411{grid-area:hd;height:400px;position:relative}.box.svelte-iei411.svelte-iei411{width:100%;height:100%;position:absolute;top:0;left:0}.overlay.svelte-iei411.svelte-iei411{z-index:9;display:flex;align-items:flex-end}.overlay.svelte-iei411>h1.svelte-iei411{margin-left:15px}.description.svelte-iei411.svelte-iei411{grid-area:txt;text-align:justify;padding:50px 10px 50px 25px}.gallery.svelte-iei411.svelte-iei411{grid-area:gal;align-self:end;display:grid;grid-template-columns:repeat(2, 1fr);grid-auto-rows:minmax(100px, 300px);grid-gap:5px;grid-template-areas:"one one"\n        "two two"\n        "three three"\n        "four four"\n        "five five"}.pic1.svelte-iei411.svelte-iei411{grid-area:one}.pic2.svelte-iei411.svelte-iei411{grid-area:two}.pic3.svelte-iei411.svelte-iei411{grid-area:three}.pic4.svelte-iei411.svelte-iei411{grid-area:four}.pic5.svelte-iei411.svelte-iei411{grid-area:five}img.svelte-iei411.svelte-iei411{object-fit:cover;width:100%;height:100%}',
  map: null
};
const Activities = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css$2);
  return `${$$result.head += `${$$result.title = `<title>Activities Page</title>`, ""}`, ""}
<div class="${"section start svelte-iei411"}"><div id="${"nature"}" class="${"heading svelte-iei411"}"><div class="${"box svelte-iei411"}"><picture><source type="${"image/avif"}" srcset="${"\n                    /img/Optimized/beachDay-400.avif 400w,\n                    /img/Optimized/beachDay-600.avif 600w,\n                    /img/Optimized/beachDay-800.avif 800w,\n                    /img/Optimized/beachDay-1000.avif 1000w,\n                    /img/Optimized/beachDay-1500.avif 1500w"}" sizes="${"(max-width: 1000px) 100vw, 50vw"}">
                    <source type="${"image/jpg"}" srcset="${"\n                    /img/Optimized/beachDay-400.jpg 400w,\n                    /img/Optimized/beachDay-600.jpg 600w,\n                    /img/Optimized/beachDay-800.jpg 800w,\n                    /img/Optimized/beachDay-1000.jpg 1000w,\n                    /img/Optimized/beachDay-1500.jpg 1500w"}" sizes="${"(max-width: 1000px) 100vw, 50vw"}">
                <img src="${"/img/Optimized/beachDay-400.jpg"}" alt="${"Kata playing with a child at the beach on a suunny day"}" class="${"svelte-iei411"}"></picture></div>
        <div class="${"box overlay svelte-iei411"}"><h1 class="${"svelte-iei411"}">Beach Days</h1></div></div>
    <div class="${"description svelte-iei411"}"><h2 class="${"alternate"}">Let us use our beautiful beaches to create a space for kids where they can run, play, enjoy and learn.</h2>
        <p>Depending on the age of the children I offer beach activities for kids. Creative projects, playing games, beach clean ups, \u2026</p>
        <p>Whether you are on vacation here or resident, I got some amazing energy-burning activities to keep kids busy!</p>
        <p>Aside from the obligatory sandcastle building and paddling there are many other fun and creative beach activities that the kids will love.</p>
        <p>&quot;Kids and adults often have different wants and motivations at the beach. Kids use beach time as an opportunity to run, swim and play while parents often want to use a beach trip for a much-needed time to relax,&quot; explains Dan DeFigio, author of &quot;Beach Games for Kids.&quot;</p>
        <p>&quot;Staying active is one of the best ways for kids to beat boredom at the beach. Sand and water make a different environment than the typical backyard, so kids can explore while having fun.&quot;</p>
        <p><a href="${"https://www.instagram.com/little__adventurers/"}">Check our Instagram for the next dates</a> and sign up your kids for some beach fun!</p></div>
    <div class="${"gallery svelte-iei411"}"><div class="${"pic1 svelte-iei411"}"><a href="${"/img/gallery/beach1-1100.jpg"}"><picture><source type="${"image/avif"}" srcset="${"\n                    /img/gallery/beach1-300.avif 300w,\n                    /img/gallery/beach1-500.avif 500w,\n                    /img/gallery/beach1-700.avif 700w,\n                    /img/gallery/beach1-900.avif 900w,\n                    /img/gallery/beach1-1100.avif 1100w"}" sizes="${"100vw, @media(min-width: 100px) 50vw"}">
                    <source type="${"image/jpg"}" srcset="${"\n                    /img/gallery/beach1-300.jpg 300w,\n                    /img/gallery/beach1-500.jpg 500w,\n                    /img/gallery/beach1-700.jpg 700w,\n                    /img/gallery/beach1-900.jpg 900w,\n                    /img/gallery/beach1-1100.jpg 1100w"}" sizes="${"100vw, @media(min-width: 100px) 50vw"}">
                    <img src="${"/img/gallery/beach1-500.jpg"}" alt="${"Katha at the beach with a toddler pointing at the horizon"}" class="${"svelte-iei411"}"></picture></a></div>
        <div class="${"pic2 svelte-iei411"}"><a href="${"/img/gallery/beach2-1100.jpg"}"><picture><source type="${"image/avif"}" srcset="${"\n                    /img/gallery/beach2-300.avif 300w,\n                    /img/gallery/beach2-500.avif 500w,\n                    /img/gallery/beach2-700.avif 700w,\n                    /img/gallery/beach2-900.avif 900w,\n                    /img/gallery/beach2-1100.avif 1100w"}" sizes="${"100vw, @media(min-width: 100px) 50vw"}">
                    <source type="${"image/jpg"}" srcset="${"\n                    /img/gallery/beach2-300.jpg 300w,\n                    /img/gallery/beach2-500.jpg 500w,\n                    /img/gallery/beach2-700.jpg 700w,\n                    /img/gallery/beach2-900.jpg 900w,\n                    /img/gallery/beach2-1100.jpg 1100w"}" sizes="${"100vw, @media(min-width: 100px) 50vw"}">
                    <img src="${"/img/gallery/beach2-500.jpg"}" alt="${"Group of adults and children sitting on the sand and playing"}" class="${"svelte-iei411"}"></picture></a></div>
        <div class="${"pic3 svelte-iei411"}"><a href="${"/img/gallery/beach3-1100.jpg"}"><picture><source type="${"image/avif"}" srcset="${"\n                    /img/gallery/beach3-300.avif 300w,\n                    /img/gallery/beach3-500.avif 500w,\n                    /img/gallery/beach3-700.avif 700w,\n                    /img/gallery/beach3-900.avif 900w,\n                    /img/gallery/beach3-1100.avif 1100w"}" sizes="${"100vw, @media(min-width: 100px) 50vw"}">
                    <source type="${"image/jpg"}" srcset="${"\n                    /img/gallery/beach3-300.jpg 300w,\n                    /img/gallery/beach3-500.jpg 500w,\n                    /img/gallery/beach3-700.jpg 700w,\n                    /img/gallery/beach3-900.jpg 900w,\n                    /img/gallery/beach3-1100.jpg 1100w"}" sizes="${"100vw, @media(min-width: 100px) 50vw"}">
                    <img src="${"/img/gallery/beach3-500.jpg"}" alt="${"Group of adults and children sitting on the sand and playing"}" class="${"svelte-iei411"}"></picture></a></div>
        <div class="${"pic4 svelte-iei411"}"><a href="${"/img/gallery/beach4-1100.jpg"}"><picture><source type="${"image/avif"}" srcset="${"\n                    /img/gallery/beach4-300.avif 300w,\n                    /img/gallery/beach4-500.avif 500w,\n                    /img/gallery/beach4-700.avif 700w,\n                    /img/gallery/beach4-900.avif 900w,\n                    /img/gallery/beach4-1100.avif 1100w"}" sizes="${"100vw, @media(min-width: 100px) 50vw"}">
                    <source type="${"image/jpg"}" srcset="${"\n                    /img/gallery/beach4-300.jpg 300w,\n                    /img/gallery/beach4-500.jpg 500w,\n                    /img/gallery/beach4-700.jpg 700w,\n                    /img/gallery/beach4-900.jpg 900w,\n                    /img/gallery/beach4-1100.jpg 1100w"}" sizes="${"100vw, @media(min-width: 100px) 50vw"}">
                    <img src="${"/img/gallery/beach4-500.jpg"}" alt="${"Group of adults and children sitting on the sand and playing"}" class="${"svelte-iei411"}"></picture></a></div>
        <div class="${"pic5 svelte-iei411"}"><a href="${"/img/gallery/beach5-1100.jpg"}"><picture><source type="${"image/avif"}" srcset="${"\n                    /img/gallery/beach5-300.avif 300w,\n                    /img/gallery/beach5-500.avif 500w,\n                    /img/gallery/beach5-700.avif 700w,\n                    /img/gallery/beach5-900.avif 900w,\n                    /img/gallery/beach5-1100.avif 1100w"}" sizes="${"100vw, @media(min-width: 100px) 50vw"}">
                    <source type="${"image/jpg"}" srcset="${"\n                    /img/gallery/beach5-300.jpg 300w,\n                    /img/gallery/beach5-500.jpg 500w,\n                    /img/gallery/beach5-700.jpg 700w,\n                    /img/gallery/beach5-900.jpg 900w,\n                    /img/gallery/beach5-1100.jpg 1100w"}" sizes="${"100vw, @media(min-width: 100px) 50vw"}">
                    <img src="${"/img/gallery/beach5-500.jpg"}" alt="${"Group of adults and children sitting on the sand and playing"}" class="${"svelte-iei411"}"></picture></a></div></div></div>

<div class="${"section svelte-iei411"}"><div id="${"walk"}" class="${"heading svelte-iei411"}"><div class="${"box svelte-iei411"}"><picture><source type="${"image/avif"}" srcset="${"\n                    /img/Optimized/walk-400.avif 400w,\n                    /img/Optimized/walk-500.avif 500w,\n                    /img/Optimized/walk-600.avif 600w,\n                    /img/Optimized/walk-700.avif 700w,\n                    /img/Optimized/walk-800.avif 800w,\n                    /img/Optimized/walk-900.avif 900w,\n                    /img/Optimized/walk-1000.avif 1000w,\n                    /img/Optimized/walk-1100.avif 1100w"}" sizes="${"(max-width: 1000px) 100vw, 50vw"}">
                    <source type="${"image/jpg"}" srcset="${"\n                    /img/Optimized/walk-400.jpg 400w,\n                    /img/Optimized/walk-500.jpg 500w,\n                    /img/Optimized/walk-600.jpg 600w,\n                    /img/Optimized/walk-700.jpg 700w,\n                    /img/Optimized/walk-800.jpg 800w,\n                    /img/Optimized/walk-900.jpg 900w,\n                    /img/Optimized/walk-1000.jpg 1000w,\n                    /img/Optimized/walk-1100.jpg 1100w"}" sizes="${"(max-width: 1000px) 100vw, 50vw"}">
                    <img src="${"/img/Optimized/walk-400.jpg"}" alt="${"child on nature walk holding Kata's hands"}" class="${"svelte-iei411"}"></picture></div>
        <div class="${"box overlay svelte-iei411"}"><h1 class="${"svelte-iei411"}">Nature Walks</h1></div></div>
    <div class="${"description svelte-iei411"}"><h2 class="${"alternate"}">Getting outside is a great way to learn more about the environment and is vital for the kids well-being.</h2>
        <p>Having fun and enjoying life, curiosity, the joy of discovery and spontaneity is in my work the priorities for education in order to have healthy, active and life-affirming children. Nature offers the ideal conditions for that.</p>
        <p>Kids love to play in nature. Every sensory perception is nourishment for the brain, whether balancing over trees roots, exploring nature, run, walk\u2026</p>
        <p><a href="${"https://www.instagram.com/little__adventurers/"}">Check our Instagram for the next dates</a></p></div>
    <div class="${"gallery svelte-iei411"}"><div class="${"pic1 svelte-iei411"}"><a href="${"/img/gallery/nature1-700.jpg"}"><picture><source type="${"image/avif"}" srcset="${"\n                    /img/gallery/nature1-300.avif 300w,\n                    /img/gallery/nature1-500.avif 500w,\n                    /img/gallery/nature1-700.avif 700w"}" sizes="${"50vw"}">
                    <source type="${"image/jpg"}" srcset="${"\n                    /img/gallery/nature1-300.jpg 300w,\n                    /img/gallery/nature1-500.jpg 500w,\n                    /img/gallery/nature1-700.jpg 700w"}" sizes="${"50vw"}">
                    <img src="${"/img/gallery/nature1-500.jpg"}" alt="${"Katha at the nature with a toddler pointing at the horizon"}" class="${"svelte-iei411"}"></picture></a></div>
        <div class="${"pic2 svelte-iei411"}"><a href="${"/img/gallery/nature2-700.jpg"}"><picture><source type="${"image/avif"}" srcset="${"\n                    /img/gallery/nature2-300.avif 300w,\n                    /img/gallery/nature2-500.avif 500w,\n                    /img/gallery/nature2-700.avif 700w"}" sizes="${"50vw"}">
                    <source type="${"image/jpg"}" srcset="${"\n                    /img/gallery/nature2-300.jpg 300w,\n                    /img/gallery/nature2-500.jpg 500w,\n                    /img/gallery/nature2-700.jpg 700w"}" sizes="${"50vw"}">
                    <img src="${"/img/gallery/nature2-500.jpg"}" alt="${"Group of adults and children sitting on the sand and playing"}" class="${"svelte-iei411"}"></picture></a></div>
        <div class="${"pic3 svelte-iei411"}"><a href="${"/img/gallery/nature3-700.jpg"}"><picture><source type="${"image/avif"}" srcset="${"\n                    /img/gallery/nature3-300.avif 300w,\n                    /img/gallery/nature3-500.avif 500w,\n                    /img/gallery/nature3-700.avif 700w"}" sizes="${"50vw"}">
                    <source type="${"image/jpg"}" srcset="${"\n                    /img/gallery/nature3-300.jpg 300w,\n                    /img/gallery/nature3-500.jpg 500w,\n                    /img/gallery/nature3-700.jpg 700w"}" sizes="${"50vw"}">
                    <img src="${"/img/gallery/nature3-500.jpg"}" alt="${"Group of adults and children sitting on the sand and playing"}" class="${"svelte-iei411"}"></picture></a></div>
        <div class="${"pic4 svelte-iei411"}"><a href="${"/img/gallery/nature4-700.jpg"}"><picture><source type="${"image/avif"}" srcset="${"\n                    /img/gallery/nature4-300.avif 300w,\n                    /img/gallery/nature4-500.avif 500w,\n                    /img/gallery/nature4-700.avif 700w"}" sizes="${"50vw"}">
                    <source type="${"image/jpg"}" srcset="${"\n                    /img/gallery/nature4-300.jpg 300w,\n                    /img/gallery/nature4-500.jpg 500w,\n                    /img/gallery/nature4-700.jpg 700w"}" sizes="${"50vw"}">
                    <img src="${"/img/gallery/nature4-500.jpg"}" alt="${"Group of adults and children sitting on the sand and playing"}" class="${"svelte-iei411"}"></picture></a></div>
        <div class="${"pic5 svelte-iei411"}"><a href="${"/img/gallery/nature5-700.jpg"}"><picture><source type="${"image/avif"}" srcset="${"\n                    /img/gallery/nature5-300.avif 300w,\n                    /img/gallery/nature5-500.avif 500w,\n                    /img/gallery/nature5-700.avif 700w"}" sizes="${"50vw"}">
                    <source type="${"image/jpg"}" srcset="${"\n                    /img/gallery/nature5-300.jpg 300w,\n                    /img/gallery/nature5-500.jpg 500w,\n                    /img/gallery/nature5-700.jpg 700w"}" sizes="${"50vw"}">
                    <img src="${"/img/gallery/nature5-500.jpg"}" alt="${"Group of adults and children sitting on the sand and playing"}" class="${"svelte-iei411"}"></picture></a></div></div></div>

<div class="${"section svelte-iei411"}"><div class="${"heading svelte-iei411"}"><div class="${"box svelte-iei411"}"><picture><source type="${"image/avif"}" srcset="${"\n                    /img/Optimized/workshop-400.avif 400w,\n                    /img/Optimized/workshop-500.avif 500w,\n                    /img/Optimized/workshop-600.avif 600w,\n                    /img/Optimized/workshop-700.avif 700w,\n                    /img/Optimized/workshop-800.avif 800w,\n                    /img/Optimized/workshop-900.avif 900w,\n                    /img/Optimized/workshop-1000.avif 1000w,\n                    /img/Optimized/workshop-1100.avif 1100w"}" sizes="${"(max-width: 1000px) 100vw, 50vw"}">
                    <source type="${"image/jpg"}" srcset="${"\n                    /img/Optimized/workshop-400.jpg 400w,\n                    /img/Optimized/workshop-500.jpg 500w,\n                    /img/Optimized/workshop-600.jpg 600w,\n                    /img/Optimized/workshop-700.jpg 700w,\n                    /img/Optimized/workshop-800.jpg 800w,\n                    /img/Optimized/workshop-900.jpg 900w,\n                    /img/Optimized/workshop-1000.jpg 1000w,\n                    /img/Optimized/workshop-1100.jpg 1100w"}" sizes="${"(max-width: 1000px) 100vw, 50vw"}">
                    <img src="${"/img/Optimized/workshop-400.jpg"}" alt="${"children\u015B hands playing at arts and crafts"}" class="${"svelte-iei411"}"></picture></div>
        <div class="${"box overlay svelte-iei411"}"><h1 class="${"svelte-iei411"}">Workshops</h1></div></div>
    <div class="${"description svelte-iei411"}"><h2 class="${"alternate"}">Get together and let the kids express themselves freely and discover the creative spirit!</h2>
        <p>I offer creative workshops in the \u201C Studio Coracao\u201D in Vila do Bispo.</p>
        <p>Whether it\u2019s drawing, painting, cutting, pasting, modelling, making or make believe, all children love being creative if they\u2019re given the chance. And there\u2019s so many important developmental benefits of creative play, why wouldn\u2019t you want to encourage it. I want to create a space for kids where they can be creative and have fun. 
           <a href="${"https://www.instagram.com/little__adventurers/"}">Check our Instagram for the next dates</a></p></div>
    <div class="${"gallery svelte-iei411"}"><div class="${"pic1 svelte-iei411"}"><a href="${"/img/gallery/workshop1-1100.jpg"}"><picture><source type="${"image/avif"}" srcset="${"\n                    /img/gallery/workshop1-300.avif 300w,\n                    /img/gallery/workshop1-500.avif 500w,\n                    /img/gallery/workshop1-700.avif 700w,\n                    /img/gallery/workshop1-900.avif 900w,\n                    /img/gallery/workshop1-1100.avif 1100w"}" sizes="${"50vw"}">
                    <source type="${"image/jpg"}" srcset="${"\n                    /img/gallery/workshop1-300.jpg 300w,\n                    /img/gallery/workshop1-500.jpg 500w,\n                    /img/gallery/workshop1-700.jpg 700w,\n                    /img/gallery/workshop1-900.jpg 900w,\n                    /img/gallery/workshop1-1100.jpg 1100w"}" sizes="${"50vw"}">
                    <img src="${"/img/gallery/workshop1-500.jpg"}" alt="${"Katha at the workshop with a toddler pointing at the horizon"}" class="${"svelte-iei411"}"></picture></a></div>
        <div class="${"pic2 svelte-iei411"}"><a href="${"/img/gallery/workshop2-1100.jpg"}"><picture><source type="${"image/avif"}" srcset="${"\n                    /img/gallery/workshop2-300.avif 300w,\n                    /img/gallery/workshop2-500.avif 500w,\n                    /img/gallery/workshop2-700.avif 700w,\n                    /img/gallery/workshop2-900.avif 900w,\n                    /img/gallery/workshop2-1100.avif 1100w"}" sizes="${"50vw"}">
                    <source type="${"image/jpg"}" srcset="${"\n                    /img/gallery/workshop2-300.jpg 300w,\n                    /img/gallery/workshop2-500.jpg 500w,\n                    /img/gallery/workshop2-700.jpg 700w,\n                    /img/gallery/workshop2-900.jpg 900w,\n                    /img/gallery/workshop2-1100.jpg 1100w"}" sizes="${"50vw"}">
                    <img src="${"/img/gallery/workshop2-500.jpg"}" alt="${"Group of adults and children sitting on the sand and playing"}" class="${"svelte-iei411"}"></picture></a></div>
        <div class="${"pic3 svelte-iei411"}"><a href="${"/img/gallery/workshop3-1100.jpg"}"><picture><source type="${"image/avif"}" srcset="${"\n                    /img/gallery/workshop3-300.avif 300w,\n                    /img/gallery/workshop3-500.avif 500w,\n                    /img/gallery/workshop3-700.avif 700w,\n                    /img/gallery/workshop3-900.avif 900w,\n                    /img/gallery/workshop3-1100.avif 1100w"}" sizes="${"50vw"}">
                    <source type="${"image/jpg"}" srcset="${"\n                    /img/gallery/workshop3-300.jpg 300w,\n                    /img/gallery/workshop3-500.jpg 500w,\n                    /img/gallery/workshop3-700.jpg 700w,\n                    /img/gallery/workshop3-900.jpg 900w,\n                    /img/gallery/workshop3-1100.jpg 1100w"}" sizes="${"50vw"}">
                    <img src="${"/img/gallery/workshop3-500.jpg"}" alt="${"Group of adults and children sitting on the sand and playing"}" class="${"svelte-iei411"}"></picture></a></div>
        <div class="${"pic4 svelte-iei411"}"><a href="${"/img/gallery/workshop4-1100.jpg"}"><picture><source type="${"image/avif"}" srcset="${"\n                    /img/gallery/workshop4-300.avif 300w,\n                    /img/gallery/workshop4-500.avif 500w,\n                    /img/gallery/workshop4-700.avif 700w,\n                    /img/gallery/workshop4-900.avif 900w,\n                    /img/gallery/workshop4-1100.avif 1100w"}" sizes="${"50vw"}">
                    <source type="${"image/jpg"}" srcset="${"\n                    /img/gallery/workshop4-300.jpg 300w,\n                    /img/gallery/workshop4-500.jpg 500w,\n                    /img/gallery/workshop4-700.jpg 700w,\n                    /img/gallery/workshop4-900.jpg 900w,\n                    /img/gallery/workshop4-1100.jpg 1100w"}" sizes="${"50vw"}">
                    <img src="${"/img/gallery/workshop4-500.jpg"}" alt="${"Group of adults and children sitting on the sand and playing"}" class="${"svelte-iei411"}"></picture></a></div>
        <div class="${"pic5 svelte-iei411"}"><a href="${"/img/gallery/workshop5-1100.jpg"}"><picture><source type="${"image/avif"}" srcset="${"\n                    /img/gallery/workshop5-300.avif 300w,\n                    /img/gallery/workshop5-500.avif 500w,\n                    /img/gallery/workshop5-700.avif 700w,\n                    /img/gallery/workshop5-900.avif 900w,\n                    /img/gallery/workshop5-1100.avif 1100w"}" sizes="${"50vw"}">
                    <source type="${"image/jpg"}" srcset="${"\n                    /img/gallery/workshop5-300.jpg 300w,\n                    /img/gallery/workshop5-500.jpg 500w,\n                    /img/gallery/workshop5-700.jpg 700w,\n                    /img/gallery/workshop5-900.jpg 900w,\n                    /img/gallery/workshop5-1100.jpg 1100w"}" sizes="${"50vw"}">
                    <img src="${"/img/gallery/workshop5-500.jpg"}" alt="${"Group of adults and children sitting on the sand and playing"}" class="${"svelte-iei411"}"></picture></a></div></div>
</div>`;
});
var activities = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": Activities
});
var contact_svelte_svelte_type_style_lang = "";
const css$1 = {
  code: "img.svelte-yxptlq{object-fit:cover;width:100%;height:100%}.title.svelte-yxptlq{text-align:center;position:absolute;left:50%;top:30%;-webkit-transform:translate(-50%, -50%);transform:translate(-50%, -50%)}h1.svelte-yxptlq{font-size:2em}@media(min-width:1000px){.title.svelte-yxptlq{top:60%}h1.svelte-yxptlq{font-size:3.5em}}",
  map: null
};
const Contact = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css$1);
  return `${$$result.head += `${$$result.title = `<title>Contact Page</title>`, ""}`, ""}


<picture><source type="${"image/avif"}" srcset="${"/img/contactsmall-800.avif 665w"}" media="${"(max-width: 1000px)"}" sizes="${"100vw"}">
    <source type="${"image/jpg"}" srcset="${"/img/contactsmall-800.jpg 665w"}" media="${"(max-width: 1000px)"}" sizes="${"100vw"}">
    <source type="${"image/avif"}" srcset="${"\n                                    /img/contactbig-1000.avif 1000w,\n                                    /img/contactbig-1200.avif 1200w,\n                                    /img/contactbig-1400.avif 1400w,\n                                    /img/contactbig-1600.avif 1600w,\n                                    /img/contactbig-1800.avif 1800w,\n                                    /img/contactbig-2000.avif 2000w,"}" media="${"(min-width: 1000px)"}" sizes="${"100vw"}">
    <source type="${"image/jpg"}" srcset="${"\n                                    /img/contactbig-1000.jpg 1000w,\n                                    /img/contactbig-1200.jpg 1200w,\n                                    /img/contactbig-1400.jpg 1400w,\n                                    /img/contactbig-1600.jpg 1600w,\n                                    /img/contactbig-1800.jpg 1800w,\n                                    /img/contactbig-2000.jpg 2000w,"}" media="${"(min-width: 1000px)"}" sizes="${"100vw"}">
    <img src="${"/img/contactsmall-800.jpg"}" width="${"100vw"}" height="${"100%"}" alt="${"vortex of leaves blown around smiling child"}" class="${"svelte-yxptlq"}"></picture>
<div class="${"title svelte-yxptlq"}"><h1 class="${"svelte-yxptlq"}">Please use any of the methods in the footer below to contact me.
    </h1>
</div>`;
});
var contact = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": Contact
});
var about_svelte_svelte_type_style_lang = "";
const css = {
  code: "#about.svelte-42liik.svelte-42liik{margin-top:60px;display:flex;flex-direction:column;width:100%;min-height:400px;max-width:300vh;align-items:center;background-color:ivory}#portrait.svelte-42liik.svelte-42liik{width:100%}#aboutKata.svelte-42liik.svelte-42liik{width:90%;overflow:auto;margin:var(--section-gap)\n}#portrait.svelte-42liik img.svelte-42liik{object-fit:cover;width:100%\n}@media screen and (min-width: 1200px){#about.svelte-42liik.svelte-42liik{flex-direction:row;align-items:flex-start}#portrait.svelte-42liik.svelte-42liik{width:65vw}#aboutKata.svelte-42liik.svelte-42liik{width:35vw}}h1.svelte-42liik.svelte-42liik{margin-top:50px;padding-left:30px;font-size:2.5em}@media screen and (min-width: 1000px){h1.svelte-42liik.svelte-42liik{font-size:4em}}@media screen and (min-width: 1700px){h1.svelte-42liik.svelte-42liik{font-size:6em}}p.svelte-42liik.svelte-42liik{padding:10px 15px 10px 30px}",
  map: null
};
const About = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css);
  return `${$$result.head += `${$$result.title = `<title>About Page</title>`, ""}`, ""}
<div id="${"about"}" class="${"svelte-42liik"}"><div id="${"portrait"}" class="${"svelte-42liik"}"><picture><source type="${"image/avif"}" srcset="${"\n                        /img/Optimized/kata1-600.avif 600w\n                        /img/Optimized/kata1-800.avif 800w\n                        /img/Optimized/kata1-1000.avif 1000w\n                        /img/Optimized/kata1-1200.avif 1200w"}" media="${"(max-width: 1200px)"}" sizes="${"100vw"}">
            <source type="${"image/jpg"}" srcset="${"\n                        /img/Optimized/kata1-600.jpg 600w\n                        /img/Optimized/kata1-800.jpg 800w\n                        /img/Optimized/kata1-1000.jpg 1000w\n                        /img/Optimized/kata1-1200.jpg 1200w"}" media="${"(max-width: 1200px)"}" sizes="${"100vw"}">
            <source type="${"image/avif"}" srcset="${"\n                                            /img/Optimized/kata2-1400.avif 1400w,\n                                            /img/Optimized/kata2-1600.avif 1600w,\n                                            /img/Optimized/kata2-1800.avif 1800w,\n                                            /img/Optimized/kata2-2000.avif 2000w,\n                                            /img/Optimized/kata2-2200.avif 2200w,\n                                            /img/Optimized/kata2-2400.avif 2400w,"}" media="${"(min-width: 1200px)"}" sizes="${"65vw"}">
            <source type="${"image/jpg"}" srcset="${"\n                                            /img/Optimized/kata2-1400.jpg 1400w,\n                                            /img/Optimized/kata2-1600.jpg 1600w,\n                                            /img/Optimized/kata2-1800.jpg 1800w,\n                                            /img/Optimized/kata2-2000.jpg 2000w,\n                                            /img/Optimized/kata2-2200.jpg 2200w,\n                                            /img/Optimized/kata2-2400.jpg 2400w,"}" media="${"(min-width: 1200px)"}" sizes="${"65vw"}">
            <img src="${"/img/Optimized/kata1.jpg"}" width="${"100vw"}" height="${"100%"}" alt="${"Kata smiling and looking down"}" class="${"svelte-42liik"}"></picture></div>

    <div id="${"aboutKata"}" class="${"svelte-42liik"}"><h1 class="${"alternate svelte-42liik"}">Katharina</h1>
        <p class="${"subheading svelte-42liik"}">Child Development Specialist - Activity coordinator</p>
        <p class="${"svelte-42liik"}">I have always been a lover of sports and    nature. Especially surfing which combines that.
        I started as a young teenager working with kids (babysitting, kindergarten) and that was the moment I found out
        that I love working with kids.</p>

        <p class="${"svelte-42liik"}">In Germany, my first official training was within the &#39;social assistant&#39; care field, I then proceeded to work
        and gain experience in many different kindergartens and learnt a lot about children&#39;s behaviour and learning
        environments.</p>

        <p class="${"svelte-42liik"}">After that I went to University in Germany and studied Educational science. During my studies I was working in
        a Montessori school and realised that I like to combine sports / outdoor activities with working with children. I
        involved myself and initiated many different sports nature projects within my time there and really found a
        passion for this field of work.</p>

        <p class="${"svelte-42liik"}">Upon successfully completing my Bachelor degree in 2013, my thesis for my final year was titled, &quot;The Meaning
        of Movement in Childhood&quot; just to give you some insight to my passion for this subject, was well received and
        really put a stamp on me to follow my passion for this field of education.</p>

        <p class="${"svelte-42liik"}">After graduating from a sports degree at University in Germany I was drawn to Portugal to work for 2 months in
        a surf camp. From there it was an easy decision as i fell in love with the country, natural beauty, the local
        culture, lifestyle and decided to stay. The South Western region has been my home for 6 years now, specifically
        Sagres and Raposeira.</p></div>

</div>`;
});
var about = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": About
});
export { init, render };
