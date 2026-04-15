import { V as head, Z as attr, W as attr_class, _ as clsx, Y as stringify } from "../../../chunks/index2.js";
import "@sveltejs/kit/internal";
import "../../../chunks/exports.js";
import "../../../chunks/utils.js";
import "@sveltejs/kit/internal/server";
import "../../../chunks/state.svelte.js";
import { M as Modal } from "../../../chunks/Modal.js";
import { e as escape_html } from "../../../chunks/context.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let categories = [];
    let events = [];
    let showCategoryModal = false;
    let catLabel = "";
    let catSlug = "";
    let showDeleteCategoryModal = false;
    let deletingCategory = null;
    let catDeleting = false;
    let selectedCategoryIds = /* @__PURE__ */ new Set();
    let showDeleteEventModal = false;
    let deletingEvent = null;
    let eventDeleting = false;
    const btnOutline = "cursor-pointer rounded-[3px] border border-[#a08c5b]/30 bg-transparent px-5 py-[0.65rem] font-['Jost'] text-[0.75rem] font-medium tracking-widest text-[#9a9080] uppercase transition-all hover:border-[#c9a84c] hover:text-[#c9a84c]";
    const btnDanger = "cursor-pointer rounded-[3px] border border-[rgba(192,57,43,0.4)] bg-[rgba(192,57,43,0.1)] px-5 py-[0.65rem] font-['Jost'] text-[0.75rem] font-medium tracking-widest text-[#e07060] uppercase transition-all hover:bg-[rgba(192,57,43,0.2)] disabled:opacity-50";
    const btnGold = "cursor-pointer rounded-[3px] border-none bg-[#c9a84c] px-5 py-[0.65rem] font-['Jost'] text-[0.75rem] font-medium tracking-widest text-[#111009] uppercase transition-all hover:bg-[#d4b35e] disabled:cursor-not-allowed disabled:opacity-50 inline-flex items-center gap-2";
    (() => {
      let result = [...events];
      {
        result = result.filter((e) => e.status !== "archived");
      }
      if (selectedCategoryIds.size > 0 && selectedCategoryIds.size < categories.length) {
        result = result.filter((e) => {
          const catId = e.category?._id ?? e.category;
          return selectedCategoryIds.has(catId);
        });
      }
      result.sort((a, b) => {
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
      return result;
    })();
    let $$settled = true;
    let $$inner_renderer;
    function $$render_inner($$renderer3) {
      head("1jef3w8", $$renderer3, ($$renderer4) => {
        $$renderer4.title(($$renderer5) => {
          $$renderer5.push(`<title>Админ панель — Студия «Раёк»</title>`);
        });
        $$renderer4.push(`<link rel="preconnect" href="https://fonts.googleapis.com"/> <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin=""/> <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&amp;family=Jost:wght@300;400;500&amp;display=swap" rel="stylesheet"/>`);
      });
      Modal($$renderer3, {
        title: "Новая категория",
        get open() {
          return showCategoryModal;
        },
        set open($$value) {
          showCategoryModal = $$value;
          $$settled = false;
        },
        children: ($$renderer4) => {
          $$renderer4.push(`<div class="mt-2 flex flex-col gap-4"><div class="flex flex-col gap-2"><label class="text-[0.72rem] tracking-widest text-[#8a8070] uppercase" for="cat-label">Название <span class="text-[#c9a84c]">*</span></label> <input id="cat-label" class="rounded-[3px] border border-[#a08c5b]/20 bg-[#111009] px-4 py-[0.65rem] font-['Jost'] text-sm font-light text-[#e8e0d0] placeholder-[#4a4535] outline-none transition-all focus:border-[#c9a84c] focus:shadow-[0_0_0_3px_rgba(201,168,76,0.08)]" type="text"${attr("value", catLabel)} placeholder="Мастер-классы"/></div> <div class="flex flex-col gap-2"><label class="text-[0.72rem] tracking-widest text-[#8a8070] uppercase" for="cat-slug">Slug <span class="ml-1 tracking-normal text-[#5a5040] normal-case">(URL-идентификатор)</span></label> <input id="cat-slug" class="rounded-[3px] border border-[#a08c5b]/20 bg-[#111009] px-4 py-[0.65rem] font-['Jost'] text-sm font-light text-[#e8e0d0] placeholder-[#4a4535] outline-none transition-all focus:border-[#c9a84c] focus:shadow-[0_0_0_3px_rgba(201,168,76,0.08)]" type="text"${attr("value", catSlug)} placeholder="master-klassy"/></div> `);
          {
            $$renderer4.push("<!--[!-->");
          }
          $$renderer4.push(`<!--]--> <div class="flex justify-end gap-3 pt-2"><button${attr_class(clsx(btnOutline))}>Отмена</button> <button${attr_class(clsx(btnGold))}${attr("disabled", !catLabel.trim() || !catSlug.trim(), true)}>`);
          {
            $$renderer4.push("<!--[!-->");
          }
          $$renderer4.push(`<!--]--> ${escape_html("Создать")}</button></div></div>`);
        },
        $$slots: { default: true }
      });
      $$renderer3.push(`<!----> `);
      Modal($$renderer3, {
        title: "Удалить категорию?",
        get open() {
          return showDeleteCategoryModal;
        },
        set open($$value) {
          showDeleteCategoryModal = $$value;
          $$settled = false;
        },
        children: ($$renderer4) => {
          $$renderer4.push(`<p class="mb-6 text-[0.88rem] leading-relaxed text-[#6a6050]">Категория <span class="text-[#e8e0d0]">«${escape_html(deletingCategory?.label)}»</span> будет удалена. Нельзя удалить категорию с привязанными мероприятиями.</p> <div class="flex justify-end gap-3"><button${attr_class(clsx(btnOutline))}>Отмена</button> <button${attr_class(clsx(btnDanger))}${attr("disabled", catDeleting, true)}>${escape_html("Удалить")}</button></div>`);
        },
        $$slots: { default: true }
      });
      $$renderer3.push(`<!----> `);
      Modal($$renderer3, {
        title: "Удалить мероприятие?",
        get open() {
          return showDeleteEventModal;
        },
        set open($$value) {
          showDeleteEventModal = $$value;
          $$settled = false;
        },
        children: ($$renderer4) => {
          $$renderer4.push(`<p class="mb-6 text-[0.88rem] leading-relaxed text-[#6a6050]"><span class="text-[#e8e0d0]">«${escape_html(deletingEvent?.title)}»</span> будет удалено
        безвозвратно вместе с медиафайлами.</p> <div class="flex justify-end gap-3"><button${attr_class(clsx(btnOutline))}>Отмена</button> <button${attr_class(clsx(btnDanger))}${attr("disabled", eventDeleting, true)}>${escape_html("Удалить")}</button></div>`);
        },
        $$slots: { default: true }
      });
      $$renderer3.push(`<!---->  <div class="flex h-screen flex-col"><header class="flex-shrink-0 border-b border-[#a08c5b]/20 bg-[rgba(17,16,9,0.97)] backdrop-blur-[12px] z-40"><div class="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-8"><div class="flex items-center gap-[10px]"><button class="font-['Playfair_Display'] text-xl tracking-[0.05em] text-[#e8e0d0]">Студия «Раёк»</button></div> <nav class="flex items-center gap-1"><button${attr_class(`px-5 py-[7px] font-['Jost'] text-[0.75rem] font-medium tracking-widest uppercase cursor-pointer border-none transition-all rounded-[2px] ${stringify(
        "bg-[#c9a84c] text-[#111009]"
      )}`)}>Мероприятия</button> <button${attr_class(`px-5 py-[7px] font-['Jost'] text-[0.75rem] font-medium tracking-widest uppercase cursor-pointer border-none transition-all rounded-[2px] ${stringify("bg-transparent text-[#9a9080] hover:text-[#e8e0d0]")}`)}>Категории</button></nav></div></header> `);
      {
        $$renderer3.push("<!--[-->");
        $$renderer3.push(`<div class="flex flex-1 items-center justify-center gap-4 text-[#5a5040]"><div class="h-7 w-7 animate-spin rounded-full border-2 border-[rgba(201,168,76,0.2)] border-t-[#c9a84c]"></div> <span class="font-['Jost'] text-sm tracking-widest uppercase">Загрузка…</span></div>`);
      }
      $$renderer3.push(`<!--]--></div>`);
    }
    do {
      $$settled = true;
      $$inner_renderer = $$renderer2.copy();
      $$render_inner($$inner_renderer);
    } while (!$$settled);
    $$renderer2.subsume($$inner_renderer);
  });
}
export {
  _page as default
};
