import { U as slot, a1 as bind_props } from "./index2.js";
import { f as fallback, e as escape_html } from "./context.js";
function Modal($$renderer, $$props) {
  let open = fallback($$props["open"], false);
  let title = fallback($$props["title"], "");
  if (open) {
    $$renderer.push("<!--[-->");
    $$renderer.push(`<div class="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[200]"><div class="bg-[#1a1810] border border-[#a08c5b]/20 rounded-[4px] p-8 max-w-[420px] w-[90%]"><h3 class="font-['Playfair_Display'] text-xl text-[#f0e8d5] mb-3">${escape_html(title)}</h3> <!--[-->`);
    slot($$renderer, $$props, "default", {});
    $$renderer.push(`<!--]--></div></div>`);
  } else {
    $$renderer.push("<!--[!-->");
  }
  $$renderer.push(`<!--]-->`);
  bind_props($$props, { open, title });
}
export {
  Modal as M
};
