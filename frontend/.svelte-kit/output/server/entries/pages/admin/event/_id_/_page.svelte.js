import { $ as store_get, a0 as unsubscribe_stores, V as head, Z as attr } from "../../../../../chunks/index2.js";
import { g as getContext, e as escape_html } from "../../../../../chunks/context.js";
import "clsx";
import "@sveltejs/kit/internal";
import "../../../../../chunks/exports.js";
import "../../../../../chunks/utils.js";
import "@sveltejs/kit/internal/server";
import "../../../../../chunks/state.svelte.js";
import { M as Modal } from "../../../../../chunks/Modal.js";
const getStores = () => {
  const stores$1 = getContext("__svelte__");
  return {
    /** @type {typeof page} */
    page: {
      subscribe: stores$1.page.subscribe
    },
    /** @type {typeof navigating} */
    navigating: {
      subscribe: stores$1.navigating.subscribe
    },
    /** @type {typeof updated} */
    updated: stores$1.updated
  };
};
const page = {
  subscribe(fn) {
    const store = getStores().page;
    return store.subscribe(fn);
  }
};
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let showConfirm = false;
    store_get($$store_subs ??= {}, "$page", page).params.id;
    let deleting = false;
    store_get($$store_subs ??= {}, "$page", page).url.searchParams.get("mode") || "view";
    let $$settled = true;
    let $$inner_renderer;
    function $$render_inner($$renderer3) {
      head("h70uy3", $$renderer3, ($$renderer4) => {
        $$renderer4.title(($$renderer5) => {
          $$renderer5.push(`<title>${escape_html("Мероприятие")} — Студия</title>`);
        });
        $$renderer4.push(`<link rel="preconnect" href="https://fonts.googleapis.com"/> <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin=""/> <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&amp;family=Jost:wght@300;400;500&amp;display=swap" rel="stylesheet"/>`);
      });
      Modal($$renderer3, {
        title: "Удалить мероприятие?",
        get open() {
          return showConfirm;
        },
        set open($$value) {
          showConfirm = $$value;
          $$settled = false;
        },
        children: ($$renderer4) => {
          $$renderer4.push(`<p class="text-[0.88rem] text-[#6a6050] leading-relaxed mb-7">Это действие нельзя отменить.</p> <div class="flex gap-3 justify-end"><button class="font-['Jost'] text-xs font-medium tracking-widest uppercase px-8 py-[0.8rem] rounded-[3px] cursor-pointer transition-all bg-transparent border border-[#a08c5b]/30 text-[#9a9080] hover:border-[#c9a84c] hover:text-[#c9a84c]">Отмена</button> <button class="font-['Jost'] text-xs font-medium tracking-widest uppercase px-8 py-[0.8rem] rounded-[3px] cursor-pointer border transition-all bg-[rgba(192,57,43,0.1)] border-[rgba(192,57,43,0.4)] text-[#e07060] hover:bg-[rgba(192,57,43,0.2)] disabled:opacity-50"${attr("disabled", deleting, true)}>${escape_html("Удалить")}</button></div>`);
        },
        $$slots: { default: true }
      });
      $$renderer3.push(`<!----> <header class="sticky top-0 z-[100] border-b border-[#a08c5b]/20 bg-[rgba(17,16,9,0.92)] backdrop-blur-[12px]"><div class="max-w-[960px] mx-auto px-8 flex items-center justify-between h-16"><div class="flex items-center gap-[10px]"><button class="font-['Playfair_Display'] text-xl text-[#e8e0d0] cursor-pointer">Студия "Раёк"</button></div></div></header> <main class="max-w-[960px] mx-auto px-8 pb-20">`);
      {
        $$renderer3.push("<!--[-->");
        $$renderer3.push(`<div class="flex flex-col items-center justify-center py-20 gap-4 text-[#5a5040]"><div class="w-8 h-8 border-2 border-[rgba(201,168,76,0.2)] border-t-[#c9a84c] rounded-full animate-spin"></div> <p>Загрузка…</p></div>`);
      }
      $$renderer3.push(`<!--]--></main>`);
    }
    do {
      $$settled = true;
      $$inner_renderer = $$renderer2.copy();
      $$render_inner($$inner_renderer);
    } while (!$$settled);
    $$renderer2.subsume($$inner_renderer);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}
export {
  _page as default
};
