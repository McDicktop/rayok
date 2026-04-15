import { V as head, W as attr_class, X as ensure_array_like, Y as stringify } from "../../chunks/index2.js";
import "@sveltejs/kit/internal";
import "../../chunks/exports.js";
import "../../chunks/utils.js";
import { e as escape_html } from "../../chunks/context.js";
import "clsx";
import "@sveltejs/kit/internal/server";
import "../../chunks/state.svelte.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let categories = [];
    let selectedCategory = "all";
    head("1uha8ag", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Мероприятия — Творческая студия</title>`);
      });
      $$renderer3.push(`<link rel="preconnect" href="https://fonts.googleapis.com"/> <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin=""/> <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&amp;family=Jost:wght@300;400;500&amp;display=swap" rel="stylesheet"/>`);
    });
    $$renderer2.push(`<div class="min-h-screen"><header class="sticky top-0 z-[100] border-b border-[#a08c5b]/20 bg-[rgba(17,16,9,0.92)] backdrop-blur-[12px]"><div class="max-w-[1200px] mx-auto px-8 flex items-center justify-between h-16"><button class="flex items-center gap-[10px] cursor-pointer"><span class="font-['Playfair_Display'] text-xl tracking-[0.05em] text-[#e8e0d0]">Студия «Раёк»</span></button> <nav class="flex gap-8 items-center"><a href="/admin" class="text-[0.85rem] tracking-widest uppercase text-[#c9a84c] border border-[#c9a84c] px-4 py-[6px] rounded-[2px] no-underline transition-all hover:bg-[#c9a84c] hover:text-[#111009]">Админ панель</a></nav></div></header> <main class="max-w-[1200px] mx-auto px-8 pb-16"><section class="pt-16 pb-10"><p class="text-[0.75rem] tracking-[0.2em] uppercase text-[#c9a84c] mb-3">Афиша студии</p></section> <div class="flex flex-wrap gap-2 mb-10">`);
    if (categories.length > 0) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<button${attr_class(`font-['Jost'] text-[0.8rem] tracking-[0.08em] uppercase border rounded-[2px] px-4 py-[6px] cursor-pointer transition-all ${stringify(
        "bg-[#c9a84c] border-[#c9a84c] text-[#111009]"
      )}`)}>Все</button> <!--[-->`);
      const each_array = ensure_array_like(categories);
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let cat = each_array[$$index];
        $$renderer2.push(`<button${attr_class(`font-['Jost'] text-[0.8rem] tracking-[0.08em] uppercase border rounded-[2px] px-4 py-[6px] cursor-pointer transition-all ${stringify(selectedCategory === cat._id ? "bg-[#c9a84c] border-[#c9a84c] text-[#111009]" : "border-[#a08c5b]/30 bg-transparent text-[#9a9080] hover:border-[#c9a84c] hover:text-[#c9a84c]")}`)}>${escape_html(cat.label)}</button>`);
      }
      $$renderer2.push(`<!--]-->`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--></div> `);
    {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="flex flex-col items-center justify-center py-20 gap-4 text-[#5a5040]"><div class="w-8 h-8 border-2 border-[rgba(201,168,76,0.2)] border-t-[#c9a84c] rounded-full animate-spin"></div> <p>Загрузка...</p></div>`);
    }
    $$renderer2.push(`<!--]--></main></div>`);
  });
}
export {
  _page as default
};
