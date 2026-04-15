import { V as head, W as attr_class, _ as clsx, Z as attr, Y as stringify, X as ensure_array_like } from "../../../../../chunks/index2.js";
import { e as escape_html } from "../../../../../chunks/context.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let categories = [];
    let submitting = false;
    let title = "";
    let description = "";
    let category = "";
    let cancellationPolicy = "";
    let amount = 0;
    let bookingType = "ticket";
    let ticketUrl = "";
    let maxParticipants = 10;
    let dates = [""];
    let durationMinutes = 60;
    let isApproximate = false;
    let ageMin = 0;
    let ageMax = 100;
    let requiresAdult = false;
    let orgName = "";
    let orgEmail = "";
    let orgPhone = "";
    let metaTitle = "";
    let metaDescription = "";
    let seoSlug = "";
    let galleryPreviews = [];
    const inputCls = "bg-[#1a1810] border border-[#a08c5b]/20 rounded-[3px] text-[#e8e0d0] font-['Jost'] text-[0.95rem] font-light px-4 py-[0.7rem] outline-none w-full focus:border-[#c9a84c] focus:shadow-[0_0_0_3px_rgba(201,168,76,0.08)] placeholder-[#4a4535] transition-all";
    const labelCls = "text-[0.75rem] tracking-widest uppercase text-[#8a8070]";
    head("1ocicti", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Новое мероприятие — Студия</title>`);
      });
      $$renderer3.push(`<link rel="preconnect" href="https://fonts.googleapis.com"/> <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin=""/> <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&amp;family=Jost:wght@300;400;500&amp;display=swap" rel="stylesheet"/>`);
    });
    $$renderer2.push(`<header class="sticky top-0 z-[100] border-b border-[#a08c5b]/20 bg-[rgba(17,16,9,0.92)] backdrop-blur-[12px]"><div class="max-w-[900px] mx-auto px-8 flex items-center justify-between h-16"><div class="flex items-center gap-[10px]"><span class="text-[#c9a84c] text-xl">✦</span> <span class="font-['Playfair_Display'] text-xl tracking-[0.05em] text-[#e8e0d0]">Студия</span></div> <nav><a href="/" class="text-[0.8rem] tracking-widest uppercase text-[#9a9080] no-underline transition-colors hover:text-[#c9a84c]">← Мероприятия</a></nav></div></header> <main class="max-w-[900px] mx-auto px-8 pb-20">`);
    {
      $$renderer2.push("<!--[!-->");
      $$renderer2.push(`<div class="pt-14"><div class="mb-12"><p class="text-[0.72rem] tracking-[0.2em] uppercase text-[#c9a84c] mb-3">Администрирование</p> <h1 class="font-['Playfair_Display'] text-[clamp(2rem,4vw,3rem)] font-bold text-[#f0e8d5]">Новое мероприятие</h1> <div class="w-[60px] h-[2px] bg-gradient-to-r from-[#c9a84c] to-transparent mt-5"></div></div> <form class="flex flex-col"><section class="py-10 border-b border-[#a08c5b]/10 flex flex-col gap-5 animate-[fadeUp_0.5s_ease_both]"><h3 class="font-['Playfair_Display'] text-[1.1rem] font-bold text-[#f0e8d5] flex items-center gap-3 mb-1"><span class="font-['Jost'] text-[0.7rem] tracking-[0.15em] text-[#c9a84c] border border-[rgba(201,168,76,0.3)] px-[7px] py-[2px] rounded-[2px]">01</span> Основная информация</h3> <div class="flex flex-col gap-2"><label${attr_class(clsx(labelCls))} for="title">Название <span class="text-[#c9a84c]">*</span></label> <input id="title"${attr_class(clsx(inputCls))} type="text"${attr("value", title)} placeholder="Мастер-класс по акварели" required/></div> <div class="flex flex-col gap-2"><label${attr_class(clsx(labelCls))} for="desc">Описание <span class="text-[#c9a84c]">*</span></label> <textarea id="desc"${attr_class(`${stringify(inputCls)} resize-y min-h-[100px]`)} placeholder="Расскажите об этом событии…" rows="5" required>`);
      const $$body = escape_html(description);
      if ($$body) {
        $$renderer2.push(`${$$body}`);
      }
      $$renderer2.push(`</textarea></div> <div class="flex flex-wrap gap-5"><div class="flex flex-col gap-2 flex-1"><label${attr_class(clsx(labelCls))} for="category">Категория <span class="text-[#c9a84c]">*</span></label> `);
      $$renderer2.select(
        {
          id: "category",
          class: `${stringify(inputCls)} cursor-pointer`,
          value: category,
          required: true
        },
        ($$renderer3) => {
          const each_array = ensure_array_like(categories);
          if (each_array.length !== 0) {
            $$renderer3.push("<!--[-->");
            for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
              let cat = each_array[$$index];
              $$renderer3.option({ value: cat._id, class: "bg-[#1a1810]" }, ($$renderer4) => {
                $$renderer4.push(`${escape_html(cat.label)}`);
              });
            }
          } else {
            $$renderer3.push("<!--[!-->");
            $$renderer3.option({ disabled: true }, ($$renderer4) => {
              $$renderer4.push(`Категории не найдены`);
            });
          }
          $$renderer3.push(`<!--]-->`);
        }
      );
      $$renderer2.push(`</div> <div class="flex flex-col gap-2 flex-1"><label${attr_class(clsx(labelCls))} for="policy">Условия отмены</label> <input id="policy"${attr_class(clsx(inputCls))} type="text"${attr("value", cancellationPolicy)} placeholder="Возврат за 24 часа"/></div></div></section> <section class="py-10 border-b border-[#a08c5b]/10 flex flex-col gap-5"><h3 class="font-['Playfair_Display'] text-[1.1rem] font-bold text-[#f0e8d5] flex items-center gap-3 mb-1"><span class="font-['Jost'] text-[0.7rem] tracking-[0.15em] text-[#c9a84c] border border-[rgba(201,168,76,0.3)] px-[7px] py-[2px] rounded-[2px]">02</span> Медиа</h3> <div class="flex gap-5 flex-wrap"><div class="flex flex-col gap-2 flex-1 min-w-[220px]"><label${attr_class(clsx(labelCls))}>Обложка <span class="text-[#c9a84c]">*</span></label> <label${attr_class(`flex items-center justify-center border border-dashed border-[#a08c5b]/30 rounded-[3px] min-h-[160px] cursor-pointer relative overflow-hidden transition-all hover:border-[#c9a84c] hover:bg-[rgba(201,168,76,0.03)] ${stringify("")}`)} for="cover-input">`);
      {
        $$renderer2.push("<!--[!-->");
        $$renderer2.push(`<div class="flex flex-col items-center gap-[0.4rem] text-[#5a5040] text-center text-[0.85rem] pointer-events-none"><span class="text-2xl text-[rgba(201,168,76,0.4)]">⊕</span> <span>Загрузить обложку</span> <span class="text-[0.72rem] text-[#3a3525]">JPG, PNG, WEBP · до 10 MB</span></div>`);
      }
      $$renderer2.push(`<!--]--></label> <input id="cover-input" type="file" accept="image/jpeg,image/png,image/webp" class="hidden"/></div> <div class="flex flex-col gap-2 flex-1 min-w-[220px]"><label${attr_class(clsx(labelCls))}>Галерея (до 5 фото)</label> <label class="flex items-center justify-center border border-dashed border-[#a08c5b]/30 rounded-[3px] min-h-[160px] cursor-pointer relative overflow-hidden transition-all hover:border-[#c9a84c] hover:bg-[rgba(201,168,76,0.03)]" for="gallery-input">`);
      if (galleryPreviews.length) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<div class="flex flex-wrap gap-1 p-2 w-full"><!--[-->`);
        const each_array_1 = ensure_array_like(galleryPreviews);
        for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
          let src = each_array_1[$$index_1];
          $$renderer2.push(`<img${attr("src", src)} alt="" class="w-[60px] h-[60px] object-cover rounded-[2px]"/>`);
        }
        $$renderer2.push(`<!--]--></div>`);
      } else {
        $$renderer2.push("<!--[!-->");
        $$renderer2.push(`<div class="flex flex-col items-center gap-[0.4rem] text-[#5a5040] text-center text-[0.85rem] pointer-events-none"><span class="text-2xl text-[rgba(201,168,76,0.4)]">⊕</span> <span>Загрузить галерею</span> <span class="text-[0.72rem] text-[#3a3525]">Несколько файлов</span></div>`);
      }
      $$renderer2.push(`<!--]--></label> <input id="gallery-input" type="file" accept="image/jpeg,image/png,image/webp" multiple class="hidden"/></div></div></section> <section class="py-10 border-b border-[#a08c5b]/10 flex flex-col gap-5"><h3 class="font-['Playfair_Display'] text-[1.1rem] font-bold text-[#f0e8d5] flex items-center gap-3 mb-1"><span class="font-['Jost'] text-[0.7rem] tracking-[0.15em] text-[#c9a84c] border border-[rgba(201,168,76,0.3)] px-[7px] py-[2px] rounded-[2px]">03</span> Расписание</h3> <div class="flex flex-col gap-3"><!--[-->`);
      const each_array_2 = ensure_array_like(dates);
      for (let i = 0, $$length = each_array_2.length; i < $$length; i++) {
        let date = each_array_2[i];
        $$renderer2.push(`<div class="flex gap-3 items-center"><input${attr_class(`${stringify(inputCls)} flex-1 [color-scheme:dark]`)} type="datetime-local"${attr("value", date)}/> `);
        if (dates.length > 1) {
          $$renderer2.push("<!--[-->");
          $$renderer2.push(`<button type="button" class="bg-transparent border border-[rgba(192,57,43,0.3)] text-[#c0392b] w-9 h-9 rounded-[3px] cursor-pointer text-[0.8rem] flex-shrink-0 transition-all hover:bg-[rgba(192,57,43,0.1)] hover:border-[#c0392b]">✕</button>`);
        } else {
          $$renderer2.push("<!--[!-->");
        }
        $$renderer2.push(`<!--]--></div>`);
      }
      $$renderer2.push(`<!--]--></div> <button type="button" class="bg-transparent border border-dashed border-[#a08c5b]/30 text-[#9a9080] font-['Jost'] text-[0.82rem] tracking-[0.08em] px-4 py-2 rounded-[3px] cursor-pointer w-fit transition-all hover:border-[#c9a84c] hover:text-[#c9a84c]">+ Добавить дату</button> `);
      if (dates.length > 1) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<p class="text-[0.78rem] text-[#5a5040] -mt-1">Несколько дат → абонемент. Только тип бронирования «ticket».</p>`);
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--></section> <section class="py-10 border-b border-[#a08c5b]/10 flex flex-col gap-5"><h3 class="font-['Playfair_Display'] text-[1.1rem] font-bold text-[#f0e8d5] flex items-center gap-3 mb-1"><span class="font-['Jost'] text-[0.7rem] tracking-[0.15em] text-[#c9a84c] border border-[rgba(201,168,76,0.3)] px-[7px] py-[2px] rounded-[2px]">04</span> Длительность</h3> <div class="flex flex-wrap gap-5"><div class="flex flex-col gap-2 flex-1"><label${attr_class(clsx(labelCls))} for="dur-min">Минуты <span class="text-[#c9a84c]">*</span></label> <input id="dur-min"${attr_class(clsx(inputCls))} type="number" min="15" max="1440"${attr("value", durationMinutes)}/></div> <div class="flex flex-col gap-2 flex-1 justify-end pb-[2px]"><label class="flex items-center gap-[0.6rem] cursor-pointer select-none"><input type="checkbox"${attr("checked", isApproximate, true)} class="appearance-none w-[18px] h-[18px] border border-[#a08c5b]/30 rounded-[2px] bg-[#1a1810] cursor-pointer relative flex-shrink-0 transition-all checked:bg-[#c9a84c] checked:border-[#c9a84c]"/> <span class="text-[0.88rem] text-[#9a9080]">Приблизительно</span></label></div></div></section> <section class="py-10 border-b border-[#a08c5b]/10 flex flex-col gap-5"><h3 class="font-['Playfair_Display'] text-[1.1rem] font-bold text-[#f0e8d5] flex items-center gap-3 mb-1"><span class="font-['Jost'] text-[0.7rem] tracking-[0.15em] text-[#c9a84c] border border-[rgba(201,168,76,0.3)] px-[7px] py-[2px] rounded-[2px]">05</span> Бронирование</h3> <div class="flex flex-wrap gap-5"><div class="flex flex-col gap-2 flex-1"><label${attr_class(clsx(labelCls))}>Тип бронирования <span class="text-[#c9a84c]">*</span></label> <div class="flex gap-3"><label${attr_class(`flex-1 flex flex-col gap-[2px] border rounded-[3px] px-4 py-[0.85rem] cursor-pointer transition-all ${stringify(
        "border-[#c9a84c] bg-[rgba(201,168,76,0.05)]"
      )}`)}><input type="radio"${attr("checked", bookingType === "ticket", true)} value="ticket" class="hidden"/> <span class="text-[0.9rem] text-[#e8e0d0]">Билет</span> <span class="text-[0.75rem] text-[#6a6050]">По внешней ссылке</span></label> <label${attr_class(`flex-1 flex flex-col gap-[2px] border rounded-[3px] px-4 py-[0.85rem] cursor-pointer transition-all ${stringify("border-[#a08c5b]/20 hover:border-[#c9a84c]")}`)}><input type="radio"${attr("checked", bookingType === "request", true)} value="request" class="hidden"/> <span class="text-[0.9rem] text-[#e8e0d0]">Заявка</span> <span class="text-[0.75rem] text-[#6a6050]">Через форму</span></label></div></div> <div class="flex flex-col gap-2 flex-1"><label${attr_class(clsx(labelCls))} for="max-part">Макс. участников</label> <input id="max-part"${attr_class(clsx(inputCls))} type="number" min="1" max="100"${attr("value", maxParticipants)}/></div></div> `);
      {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<div class="flex flex-col gap-2"><label${attr_class(clsx(labelCls))} for="ticket-url">Ссылка на билет <span class="text-[#c9a84c]">*</span></label> <input id="ticket-url"${attr_class(clsx(inputCls))} type="url"${attr("value", ticketUrl)} placeholder="https://…"/></div>`);
      }
      $$renderer2.push(`<!--]--></section> <section class="py-10 border-b border-[#a08c5b]/10 flex flex-col gap-5"><h3 class="font-['Playfair_Display'] text-[1.1rem] font-bold text-[#f0e8d5] flex items-center gap-3 mb-1"><span class="font-['Jost'] text-[0.7rem] tracking-[0.15em] text-[#c9a84c] border border-[rgba(201,168,76,0.3)] px-[7px] py-[2px] rounded-[2px]">06</span> Стоимость</h3> <div class="flex flex-col gap-2"><label${attr_class(clsx(labelCls))} for="amount">Цена (₽)</label> <div class="relative"><span class="absolute left-4 top-1/2 -translate-y-1/2 text-[#c9a84c] pointer-events-none">₽</span> <input id="amount"${attr_class(`${stringify(inputCls)} pl-8`)} type="number" min="0" max="100000"${attr("value", amount)}/></div> `);
      if (Number(amount) === 0) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<p class="text-[0.78rem] text-[#c9a84c] -mt-1">Мероприятие будет отмечено как бесплатное</p>`);
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--></div></section> <section class="py-10 border-b border-[#a08c5b]/10 flex flex-col gap-5"><h3 class="font-['Playfair_Display'] text-[1.1rem] font-bold text-[#f0e8d5] flex items-center gap-3 mb-1"><span class="font-['Jost'] text-[0.7rem] tracking-[0.15em] text-[#c9a84c] border border-[rgba(201,168,76,0.3)] px-[7px] py-[2px] rounded-[2px]">07</span> Ограничения</h3> <div class="flex flex-wrap gap-5"><div class="flex flex-col gap-2 flex-1"><label${attr_class(clsx(labelCls))} for="age-min">Возраст от</label> <input id="age-min"${attr_class(clsx(inputCls))} type="number" min="0" max="100"${attr("value", ageMin)}/></div> <div class="flex flex-col gap-2 flex-1"><label${attr_class(clsx(labelCls))} for="age-max">Возраст до</label> <input id="age-max"${attr_class(clsx(inputCls))} type="number" min="0" max="100"${attr("value", ageMax)}/></div> <div class="flex flex-col gap-2 flex-1 justify-end pb-[2px]"><label class="flex items-center gap-[0.6rem] cursor-pointer select-none"><input type="checkbox"${attr("checked", requiresAdult, true)} class="appearance-none w-[18px] h-[18px] border border-[#a08c5b]/30 rounded-[2px] bg-[#1a1810] cursor-pointer relative flex-shrink-0 transition-all checked:bg-[#c9a84c] checked:border-[#c9a84c]"/> <span class="text-[0.88rem] text-[#9a9080]">Только 18+</span></label></div></div></section> <section class="py-10 border-b border-[#a08c5b]/10 flex flex-col gap-5"><h3 class="font-['Playfair_Display'] text-[1.1rem] font-bold text-[#f0e8d5] flex items-center gap-3 mb-1"><span class="font-['Jost'] text-[0.7rem] tracking-[0.15em] text-[#c9a84c] border border-[rgba(201,168,76,0.3)] px-[7px] py-[2px] rounded-[2px]">08</span> Организатор</h3> <div class="flex flex-wrap gap-5"><div class="flex flex-col gap-2 flex-1"><label${attr_class(clsx(labelCls))} for="org-name">Имя</label> <input id="org-name"${attr_class(clsx(inputCls))} type="text"${attr("value", orgName)} placeholder="Анна Смирнова"/></div> <div class="flex flex-col gap-2 flex-1"><label${attr_class(clsx(labelCls))} for="org-email">Email</label> <input id="org-email"${attr_class(clsx(inputCls))} type="email"${attr("value", orgEmail)} placeholder="anna@studio.ru"/></div> <div class="flex flex-col gap-2 flex-1"><label${attr_class(clsx(labelCls))} for="org-phone">Телефон</label> <input id="org-phone"${attr_class(clsx(inputCls))} type="tel"${attr("value", orgPhone)} placeholder="+7 900 000 00 00"/></div></div></section> <section class="py-10 border-b border-[#a08c5b]/10 flex flex-col gap-5"><h3 class="font-['Playfair_Display'] text-[1.1rem] font-bold text-[#f0e8d5] flex items-center gap-3 mb-1"><span class="font-['Jost'] text-[0.7rem] tracking-[0.15em] text-[#c9a84c] border border-[rgba(201,168,76,0.3)] px-[7px] py-[2px] rounded-[2px]">09</span> SEO</h3> <div class="flex flex-col gap-2"><label${attr_class(clsx(labelCls))} for="meta-title">Meta Title</label> <input id="meta-title"${attr_class(clsx(inputCls))} type="text"${attr("value", metaTitle)} placeholder="Мастер-класс акварель — Студия"/></div> <div class="flex flex-col gap-2"><label${attr_class(clsx(labelCls))} for="meta-desc">Meta Description</label> <textarea id="meta-desc"${attr_class(`${stringify(inputCls)} resize-y min-h-[100px]`)} rows="3" placeholder="Краткое описание для поисковиков…">`);
      const $$body_1 = escape_html(metaDescription);
      if ($$body_1) {
        $$renderer2.push(`${$$body_1}`);
      }
      $$renderer2.push(`</textarea></div> <div class="flex flex-col gap-2"><label${attr_class(clsx(labelCls))} for="seo-slug">Slug (URL)</label> <div class="flex"><span class="bg-[rgba(201,168,76,0.08)] border border-[#a08c5b]/20 border-r-0 rounded-l-[3px] px-[0.85rem] py-[0.7rem] text-[0.85rem] text-[#6a6050] whitespace-nowrap">/events/</span> <input id="seo-slug"${attr_class(`${stringify(inputCls)} rounded-l-none`)} type="text"${attr("value", seoSlug)} placeholder="master-klass-akvarell"/></div> <p class="text-[0.78rem] text-[#5a5040] -mt-1">Оставьте пустым — сгенерируется автоматически из названия</p></div></section> `);
      {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--> <div class="flex justify-end gap-4 pt-10"><a href="/" class="font-['Jost'] text-xs font-medium tracking-widest uppercase no-underline px-8 py-[0.8rem] rounded-[3px] transition-all bg-transparent border border-[#a08c5b]/30 text-[#9a9080] hover:border-[#c9a84c] hover:text-[#c9a84c]">Отмена</a> <button type="submit" class="font-['Jost'] text-xs font-medium tracking-widest uppercase px-8 py-[0.8rem] rounded-[3px] cursor-pointer border-none transition-all inline-flex items-center gap-2 bg-[#c9a84c] text-[#111009] hover:bg-[#d4b35e] disabled:opacity-50 disabled:cursor-not-allowed"${attr("disabled", submitting, true)}>`);
      {
        $$renderer2.push("<!--[!-->");
        $$renderer2.push(`Создать мероприятие`);
      }
      $$renderer2.push(`<!--]--></button></div></form></div>`);
    }
    $$renderer2.push(`<!--]--></main>`);
  });
}
export {
  _page as default
};
