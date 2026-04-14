<script>
    import { onMount } from "svelte";
    import { page } from "$app/stores";
    import { goto } from "$app/navigation";
    import Modal from "$lib/components/Modal.svelte";

    $: mode = $page.url.searchParams.get('mode') || 'view';

    let showConfirm = false;
    const id = $page.params.id;

    let event = null;
    let categories = [];
    let loading = true;
    let error = null;
    // let mode = "view"; // 'view' | 'edit'
    let saving = false;
    let saveError = null;
    let deleting = false;

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
    let status = "draft";
    let coverFile = null;
    let galleryFiles = [];
    let coverPreview = null;
    let galleryPreviews = [];

    const statusLabels = {
        draft: "Черновик",
        published: "Опубликовано",
        unpublished: "Снято",
        archived: "Архив",
    };
    const statusColors = {
        draft: "#a08c5b",
        published: "#6db87a",
        unpublished: "#c0392b",
        archived: "#888",
    };

    onMount(async () => {
        try {
            const [evRes, catRes] = await Promise.all([
                fetch(`/api/event`),
                fetch("/api/event/category"),
            ]);
            const events = await evRes.json();
            categories = await catRes.json();
            event = events.find((e) => e._id === id);
            if (!event) { error = "Мероприятие не найдено"; return; }
            fillForm(event);
        } catch (e) {
            error = "Не удалось загрузить мероприятие";
        } finally {
            loading = false;
        }
    });

    function fillForm(ev) {
        title = ev.title ?? "";
        description = ev.description ?? "";
        category = ev.category?._id ?? ev.category ?? "";
        cancellationPolicy = ev.cancellationPolicy ?? "";
        amount = ev.pricing?.amount ?? 0;
        bookingType = ev.booking?.type ?? "ticket";
        ticketUrl = ev.booking?.ticketUrl ?? "";
        maxParticipants = ev.booking?.maxParticipants ?? 10;
        dates = ev.schedule?.dates?.length ? ev.schedule.dates.map((d) => d.slice(0, 16)) : [""];
        durationMinutes = ev.duration?.minutes ?? 60;
        isApproximate = ev.duration?.isApproximate ?? false;
        ageMin = ev.restrictions?.ageMin ?? 0;
        ageMax = ev.restrictions?.ageMax ?? 100;
        requiresAdult = ev.restrictions?.requiresAdult ?? false;
        orgName = ev.organizer?.name ?? "";
        orgEmail = ev.organizer?.email ?? "";
        orgPhone = ev.organizer?.phone ?? "";
        metaTitle = ev.seo?.metaTitle ?? "";
        metaDescription = ev.seo?.metaDescription ?? "";
        seoSlug = ev.seo?.slug ?? "";
        status = ev.status ?? "draft";
        coverPreview = ev.media?.cover ?? null;
        galleryPreviews = ev.media?.gallery ?? [];
    }

    function previewCover(e) {
        const file = e.target.files[0];
        if (!file) return;
        coverFile = file;
        coverPreview = URL.createObjectURL(file);
    }
    function previewGallery(e) {
        const files = Array.from(e.target.files);
        galleryFiles = files;
        galleryPreviews = files.map((f) => URL.createObjectURL(f));
    }
    function addDate() { dates = [...dates, ""]; }
    function removeDate(i) { dates = dates.filter((_, idx) => idx !== i); }
    function updateDate(i, val) { dates = dates.map((d, idx) => (idx === i ? val : d)); }

    function formatDate(d) {
        return new Date(d).toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" });
    }
    function formatDuration(dur) {
        const h = Math.floor(dur.minutes / 60), m = dur.minutes % 60;
        if (h === 0) return `${m} мин`;
        if (m === 0) return `${h} ч`;
        return `${h} ч ${m} мин`;
    }
    function formatPrice(p) {
        if (p.isFree || p.amount === 0) return "Бесплатно";
        return `${p.amount.toLocaleString("ru-RU")} ₽`;
    }

    async function handleSave() {
        saveError = null;
        saving = true;
        try {
            const fd = new FormData();
            fd.append("title", title);
            fd.append("description", description);
            fd.append("category", category);
            fd.append("cancellationPolicy", cancellationPolicy);
            fd.append("pricing", JSON.stringify({ amount: Number(amount) }));
            fd.append("booking", JSON.stringify({ type: bookingType, maxParticipants: Number(maxParticipants), ...(bookingType === "ticket" ? { ticketUrl } : {}) }));
            fd.append("schedule", JSON.stringify({ dates: dates.filter((d) => d.trim()) }));
            fd.append("duration", JSON.stringify({ minutes: Number(durationMinutes), isApproximate }));
            fd.append("restrictions", JSON.stringify({ ageMin: Number(ageMin), ageMax: Number(ageMax), requiresAdult }));
            fd.append("organizer", JSON.stringify({ name: orgName, email: orgEmail, phone: orgPhone }));
            fd.append("seo", JSON.stringify({ metaTitle, metaDescription, slug: seoSlug }));
            if (coverFile) fd.append("cover", coverFile);
            galleryFiles.forEach((f) => fd.append("gallery", f));

            const res = await fetch(`/api/event/${id}`, { method: "PUT", body: fd });
            const data = await res.json();
            if (!res.ok) { saveError = data.message ?? "Ошибка сохранения"; return; }

            const evRes = await fetch("/api/event");
            const events = await evRes.json();
            event = events.find((e) => e._id === id);
            fillForm(event);
            mode = "view";
        } catch {
            saveError = "Сетевая ошибка. Попробуйте снова.";
        } finally {
            saving = false;
        }
    }

    async function handleDelete() {
        deleting = true;
        try {
            const res = await fetch(`/api/event/${id}`, { method: "DELETE" });
            if (res.ok) goto("/");
            else { showConfirm = false; deleting = false; }
        } catch {
            deleting = false;
        }
    }

    const inputCls = "bg-[#1a1810] border border-[#a08c5b]/20 rounded-[3px] text-[#e8e0d0] font-['Jost'] text-[0.95rem] font-light px-4 py-[0.7rem] outline-none w-full focus:border-[#c9a84c] focus:shadow-[0_0_0_3px_rgba(201,168,76,0.08)] placeholder-[#4a4535] transition-all";
    const labelCls = "text-[0.75rem] tracking-widest uppercase text-[#8a8070]";
</script>

<svelte:head>
    <title>{event?.title ?? "Мероприятие"} — Студия</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
        href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Jost:wght@300;400;500&display=swap"
        rel="stylesheet"
    />
</svelte:head>

<!-- Delete confirm modal -->
<Modal bind:open={showConfirm} title="Удалить мероприятие?">
    <p class="text-[0.88rem] text-[#6a6050] leading-relaxed mb-7">Это действие нельзя отменить.</p>
    <div class="flex gap-3 justify-end">
        <button
            class="font-['Jost'] text-xs font-medium tracking-widest uppercase px-8 py-[0.8rem] rounded-[3px] cursor-pointer transition-all bg-transparent border border-[#a08c5b]/30 text-[#9a9080] hover:border-[#c9a84c] hover:text-[#c9a84c]"
            on:click={() => (showConfirm = false)}
        >Отмена</button>
        <button
            class="font-['Jost'] text-xs font-medium tracking-widest uppercase px-8 py-[0.8rem] rounded-[3px] cursor-pointer border transition-all bg-[rgba(192,57,43,0.1)] border-[rgba(192,57,43,0.4)] text-[#e07060] hover:bg-[rgba(192,57,43,0.2)] disabled:opacity-50"
            on:click={handleDelete}
            disabled={deleting}
        >{deleting ? "Удаление…" : "Удалить"}</button>
    </div>
</Modal>

<!-- Header -->
<header class="sticky top-0 z-[100] border-b border-[#a08c5b]/20 bg-[rgba(17,16,9,0.92)] backdrop-blur-[12px]">
    <div class="max-w-[960px] mx-auto px-8 flex items-center justify-between h-16">
        <div class="flex items-center gap-[10px]">
            <button
             class="font-['Playfair_Display'] text-xl text-[#e8e0d0] cursor-pointer"
            on:click={() => goto('/')}
            >Студия "Раёк"
            </button>
        </div>
    </div>
</header>

<main class="max-w-[960px] mx-auto px-8 pb-20">

    {#if loading}
        <div class="flex flex-col items-center justify-center py-20 gap-4 text-[#5a5040]">
            <div class="w-8 h-8 border-2 border-[rgba(201,168,76,0.2)] border-t-[#c9a84c] rounded-full animate-spin"></div>
            <p>Загрузка…</p>
        </div>

    {:else if error}
        <div class="flex items-center justify-center py-20 text-[#c0392b]">{error}</div>

    {:else if mode === "view"}
        <!-- ═══ VIEW MODE ═══ -->
        <div class="pt-8 animate-[fadeUp_0.4s_ease_both]">
            {#if event.media?.cover}
                <div class="relative w-full aspect-[21/7] overflow-hidden rounded-[4px] mb-10">
                    <img src={event.media.cover} alt={event.title} class="w-full h-full object-cover" />
                    <div class="absolute inset-0 bg-gradient-to-t from-[rgba(17,16,9,0.6)] to-transparent"></div>
                </div>
            {/if}

            <!-- Top bar -->
            <div class="flex items-center justify-between mb-6 flex-wrap gap-4">
                <div
                    class="text-[0.72rem] tracking-[0.15em] uppercase border px-3 py-1 rounded-[2px]"
                    style="color:{statusColors[event.status]}; border-color:{statusColors[event.status]}44"
                >
                    {statusLabels[event.status] ?? event.status}
                </div>
            </div>

            {#if event.category?.label}
                <p class="text-[0.72rem] tracking-[0.15em] uppercase text-[#c9a84c] mb-2">{event.category.label}</p>
            {/if}
            <h1 class="font-['Playfair_Display'] text-[clamp(1.8rem,4vw,2.8rem)] font-bold text-[#f0e8d5] leading-[1.2] mb-5">
                {event.title}
            </h1>
            <p class="text-[0.95rem] leading-[1.75] text-[#9a9080] max-w-[680px] mb-10">{event.description}</p>

            <!-- Meta grid -->
            <div class="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-[1px] bg-[rgba(160,140,91,0.1)] border border-[rgba(160,140,91,0.1)] rounded-[4px] overflow-hidden mb-10">
                {#if event.schedule?.dates?.length}
                    <div class="bg-[#1a1810] p-5 flex gap-[0.85rem] items-start">
                        <span class="text-[#c9a84c] text-base mt-[2px] flex-shrink-0">◷</span>
                        <div>
                            <p class="text-[0.7rem] tracking-widest uppercase text-[#5a5040] mb-[0.3rem]">
                                Дата{event.schedule.dates.length > 1 ? "ы" : ""}
                            </p>
                            {#each event.schedule.dates as d}
                                <p class="text-[0.9rem] text-[#e8e0d0]">{formatDate(d)}</p>
                            {/each}
                            {#if event.schedule.isSubscription}
                                <span class="inline-block text-[0.65rem] tracking-widest uppercase border border-[#c9a84c] text-[#c9a84c] px-[6px] py-[1px] rounded-[2px] mt-1">Абонемент</span>
                            {/if}
                        </div>
                    </div>
                {/if}
                <div class="bg-[#1a1810] p-5 flex gap-[0.85rem] items-start">
                    <span class="text-[#c9a84c] text-base mt-[2px] flex-shrink-0">⏱</span>
                    <div>
                        <p class="text-[0.7rem] tracking-widest uppercase text-[#5a5040] mb-[0.3rem]">Длительность</p>
                        <p class="text-[0.9rem] text-[#e8e0d0]">{formatDuration(event.duration)}{event.duration?.isApproximate ? " ~" : ""}</p>
                    </div>
                </div>
                <div class="bg-[#1a1810] p-5 flex gap-[0.85rem] items-start">
                    <span class="text-[#c9a84c] text-base mt-[2px] flex-shrink-0">₽</span>
                    <div>
                        <p class="text-[0.7rem] tracking-widest uppercase text-[#5a5040] mb-[0.3rem]">Стоимость</p>
                        <p class="text-[0.9rem] text-[#e8e0d0]">{formatPrice(event.pricing)}</p>
                    </div>
                </div>
                <div class="bg-[#1a1810] p-5 flex gap-[0.85rem] items-start">
                    <span class="text-[#c9a84c] text-base mt-[2px] flex-shrink-0">◉</span>
                    <div>
                        <p class="text-[0.7rem] tracking-widest uppercase text-[#5a5040] mb-[0.3rem]">Возраст</p>
                        <p class="text-[0.9rem] text-[#e8e0d0]">{event.restrictions?.ageMin}–{event.restrictions?.ageMax} лет</p>
                        {#if event.restrictions?.requiresAdult}
                            <span class="inline-block text-[0.65rem] tracking-widest uppercase border border-[#c9a84c] text-[#c9a84c] px-[6px] py-[1px] rounded-[2px] mt-1">18+</span>
                        {/if}
                    </div>
                </div>
                <div class="bg-[#1a1810] p-5 flex gap-[0.85rem] items-start">
                    <span class="text-[#c9a84c] text-base mt-[2px] flex-shrink-0">⊡</span>
                    <div>
                        <p class="text-[0.7rem] tracking-widest uppercase text-[#5a5040] mb-[0.3rem]">Бронирование</p>
                        <p class="text-[0.9rem] text-[#e8e0d0]">{event.booking?.type === "ticket" ? "Билет" : "Заявка"}</p>
                        {#if event.booking?.ticketUrl}
                            <a href={event.booking.ticketUrl} target="_blank" class="text-[#c9a84c] no-underline text-[0.82rem] hover:underline">Ссылка ↗</a>
                        {/if}
                    </div>
                </div>
                <div class="bg-[#1a1810] p-5 flex gap-[0.85rem] items-start">
                    <span class="text-[#c9a84c] text-base mt-[2px] flex-shrink-0">◈</span>
                    <div>
                        <p class="text-[0.7rem] tracking-widest uppercase text-[#5a5040] mb-[0.3rem]">Участники</p>
                        <p class="text-[0.9rem] text-[#e8e0d0]">до {event.booking?.maxParticipants}</p>
                    </div>
                </div>
            </div>

            <!-- Organizer -->
            {#if event.organizer?.name || event.organizer?.email}
                <div class="mb-8">
                    <h3 class="text-[0.72rem] tracking-[0.15em] uppercase text-[#5a5040] mb-3 pb-2 border-b border-[#a08c5b]/10">Организатор</h3>
                    <div class="flex flex-col gap-[0.35rem] text-[0.9rem] text-[#9a9080]">
                        {#if event.organizer.name}<p>{event.organizer.name}</p>{/if}
                        {#if event.organizer.email}<p><a href="mailto:{event.organizer.email}" class="text-[#c9a84c] no-underline hover:underline">{event.organizer.email}</a></p>{/if}
                        {#if event.organizer.phone}<p>{event.organizer.phone}</p>{/if}
                    </div>
                </div>
            {/if}

            <!-- Gallery -->
            {#if event.media?.gallery?.length}
                <div class="mb-8">
                    <h3 class="text-[0.72rem] tracking-[0.15em] uppercase text-[#5a5040] mb-3 pb-2 border-b border-[#a08c5b]/10">Галерея</h3>
                    <div class="flex flex-wrap gap-2">
                        {#each event.media.gallery as url}
                            <img src={url} alt="" class="w-[120px] h-[80px] object-cover rounded-[3px]" />
                        {/each}
                    </div>
                </div>
            {/if}

            {#if event.cancellationPolicy}
                <div class="mb-8">
                    <h3 class="text-[0.72rem] tracking-[0.15em] uppercase text-[#5a5040] mb-3 pb-2 border-b border-[#a08c5b]/10">Условия отмены</h3>
                    <p class="text-[0.9rem] text-[#9a9080] leading-relaxed">{event.cancellationPolicy}</p>
                </div>
            {/if}

            {#if event.seo?.slug}
                <div class="mb-8">
                    <h3 class="text-[0.72rem] tracking-[0.15em] uppercase text-[#5a5040] mb-3 pb-2 border-b border-[#a08c5b]/10">SEO</h3>
                    <p class="font-mono text-[#c9a84c] text-[0.85rem]">/events/{event.seo.slug}</p>
                </div>
            {/if}
        </div>

    {:else}
        <!-- ═══ EDIT MODE ═══ -->
        <div class="pt-12">
            <div class="mb-10">
                <p class="text-[0.72rem] tracking-[0.2em] uppercase text-[#c9a84c] mb-[0.6rem]">Редактирование</p>
                <h1 class="font-['Playfair_Display'] text-[clamp(1.8rem,3vw,2.5rem)] font-bold text-[#f0e8d5]">{event.title}</h1>
                <div class="w-[60px] h-[2px] bg-gradient-to-r from-[#c9a84c] to-transparent mt-4"></div>
            </div>

            <form on:submit|preventDefault={handleSave} class="flex flex-col">

                <!-- 01 -->
                <section class="py-9 border-b border-[#a08c5b]/10 flex flex-col gap-5">
                    <h3 class="font-['Playfair_Display'] text-[1.05rem] font-bold text-[#f0e8d5] flex items-center gap-3">
                        <span class="font-['Jost'] text-[0.7rem] tracking-[0.15em] text-[#c9a84c] border border-[rgba(201,168,76,0.3)] px-[7px] py-[2px] rounded-[2px]">01</span>
                        Основная информация
                    </h3>
                    <div class="flex flex-col gap-2">
                        <label class={labelCls}>Название</label>
                        <input class={inputCls} type="text" bind:value={title} required />
                    </div>
                    <div class="flex flex-col gap-2">
                        <label class={labelCls}>Описание</label>
                        <textarea class="{inputCls} resize-y min-h-[100px]" bind:value={description} rows="5" required></textarea>
                    </div>
                    <div class="flex flex-wrap gap-5">
                        <div class="flex flex-col gap-2 flex-1">
                            <label class={labelCls}>Категория</label>
                            <select class="{inputCls} cursor-pointer" bind:value={category}>
                                {#each categories as cat}
                                    <option value={cat._id} class="bg-[#1a1810]">{cat.label}</option>
                                {/each}
                            </select>
                        </div>
                        <div class="flex flex-col gap-2 flex-1">
                            <label class={labelCls}>Условия отмены</label>
                            <input class={inputCls} type="text" bind:value={cancellationPolicy} />
                        </div>
                    </div>
                </section>

                <!-- 02 Медиа -->
                <section class="py-9 border-b border-[#a08c5b]/10 flex flex-col gap-5">
                    <h3 class="font-['Playfair_Display'] text-[1.05rem] font-bold text-[#f0e8d5] flex items-center gap-3">
                        <span class="font-['Jost'] text-[0.7rem] tracking-[0.15em] text-[#c9a84c] border border-[rgba(201,168,76,0.3)] px-[7px] py-[2px] rounded-[2px]">02</span>
                        Медиа
                    </h3>
                    <div class="flex gap-5 flex-wrap">
                        <div class="flex flex-col gap-2 flex-1 min-w-[220px]">
                            <label class={labelCls}>Обложка</label>
                            <label class="flex items-center justify-center border border-dashed border-[#a08c5b]/30 rounded-[3px] min-h-[140px] cursor-pointer relative overflow-hidden transition-all hover:border-[#c9a84c] hover:bg-[rgba(201,168,76,0.03)]" for="edit-cover-input">
                                {#if coverPreview}
                                    <img src={coverPreview} alt="Cover" class="w-full h-full object-cover absolute inset-0" />
                                    <div class="absolute inset-0 bg-[rgba(17,16,9,0.6)] flex items-center justify-center text-[0.8rem] tracking-widest uppercase text-[#c9a84c] opacity-0 hover:opacity-100 transition-opacity">Заменить</div>
                                {:else}
                                    <div class="flex flex-col items-center gap-[0.4rem] text-[#5a5040] text-[0.85rem] pointer-events-none">
                                        <span class="text-2xl text-[rgba(201,168,76,0.4)]">⊕</span>
                                        <span>Загрузить обложку</span>
                                    </div>
                                {/if}
                            </label>
                            <input id="edit-cover-input" type="file" accept="image/jpeg,image/png,image/webp" on:change={previewCover} class="hidden" />
                        </div>
                        <div class="flex flex-col gap-2 flex-1 min-w-[220px]">
                            <label class={labelCls}>Галерея</label>
                            <label class="flex items-center justify-center border border-dashed border-[#a08c5b]/30 rounded-[3px] min-h-[140px] cursor-pointer relative overflow-hidden transition-all hover:border-[#c9a84c] hover:bg-[rgba(201,168,76,0.03)]" for="edit-gallery-input">
                                {#if galleryPreviews.length}
                                    <div class="flex flex-wrap gap-1 p-2 w-full">
                                        {#each galleryPreviews as src}
                                            <img {src} alt="" class="w-[60px] h-[60px] object-cover rounded-[2px]" />
                                        {/each}
                                    </div>
                                {:else}
                                    <div class="flex flex-col items-center gap-[0.4rem] text-[#5a5040] text-[0.85rem] pointer-events-none">
                                        <span class="text-2xl text-[rgba(201,168,76,0.4)]">⊕</span>
                                        <span>Загрузить галерею</span>
                                    </div>
                                {/if}
                            </label>
                            <input id="edit-gallery-input" type="file" accept="image/jpeg,image/png,image/webp" multiple on:change={previewGallery} class="hidden" />
                        </div>
                    </div>
                </section>

                <!-- 03 Расписание -->
                <section class="py-9 border-b border-[#a08c5b]/10 flex flex-col gap-5">
                    <h3 class="font-['Playfair_Display'] text-[1.05rem] font-bold text-[#f0e8d5] flex items-center gap-3">
                        <span class="font-['Jost'] text-[0.7rem] tracking-[0.15em] text-[#c9a84c] border border-[rgba(201,168,76,0.3)] px-[7px] py-[2px] rounded-[2px]">03</span>
                        Расписание
                    </h3>
                    <div class="flex flex-col gap-3">
                        {#each dates as date, i}
                            <div class="flex gap-3 items-center">
                                <input class="{inputCls} flex-1 [color-scheme:dark]" type="datetime-local" value={date} on:input={(e) => updateDate(i, e.target.value)} />
                                {#if dates.length > 1}
                                    <button type="button" class="bg-transparent border border-[rgba(192,57,43,0.3)] text-[#c0392b] w-9 h-9 rounded-[3px] cursor-pointer text-[0.8rem] flex-shrink-0 transition-all hover:bg-[rgba(192,57,43,0.1)] hover:border-[#c0392b]" on:click={() => removeDate(i)}>✕</button>
                                {/if}
                            </div>
                        {/each}
                    </div>
                    <button type="button" class="bg-transparent border border-dashed border-[#a08c5b]/30 text-[#9a9080] font-['Jost'] text-[0.82rem] tracking-[0.08em] px-4 py-2 rounded-[3px] cursor-pointer w-fit transition-all hover:border-[#c9a84c] hover:text-[#c9a84c]" on:click={addDate}>+ Добавить дату</button>
                </section>

                <!-- 04 Длительность -->
                <section class="py-9 border-b border-[#a08c5b]/10 flex flex-col gap-5">
                    <h3 class="font-['Playfair_Display'] text-[1.05rem] font-bold text-[#f0e8d5] flex items-center gap-3">
                        <span class="font-['Jost'] text-[0.7rem] tracking-[0.15em] text-[#c9a84c] border border-[rgba(201,168,76,0.3)] px-[7px] py-[2px] rounded-[2px]">04</span>
                        Длительность
                    </h3>
                    <div class="flex flex-wrap gap-5">
                        <div class="flex flex-col gap-2 flex-1">
                            <label class={labelCls}>Минуты</label>
                            <input class={inputCls} type="number" min="15" max="1440" bind:value={durationMinutes} />
                        </div>
                        <div class="flex flex-col gap-2 flex-1 justify-end pb-[2px]">
                            <label class="flex items-center gap-[0.6rem] cursor-pointer select-none">
                                <input type="checkbox" bind:checked={isApproximate} class="appearance-none w-[18px] h-[18px] border border-[#a08c5b]/30 rounded-[2px] bg-[#1a1810] cursor-pointer relative flex-shrink-0 transition-all checked:bg-[#c9a84c] checked:border-[#c9a84c]" />
                                <span class="text-[0.88rem] text-[#9a9080]">Приблизительно</span>
                            </label>
                        </div>
                    </div>
                </section>

                <!-- 05 Бронирование -->
                <section class="py-9 border-b border-[#a08c5b]/10 flex flex-col gap-5">
                    <h3 class="font-['Playfair_Display'] text-[1.05rem] font-bold text-[#f0e8d5] flex items-center gap-3">
                        <span class="font-['Jost'] text-[0.7rem] tracking-[0.15em] text-[#c9a84c] border border-[rgba(201,168,76,0.3)] px-[7px] py-[2px] rounded-[2px]">05</span>
                        Бронирование
                    </h3>
                    <div class="flex flex-wrap gap-5">
                        <div class="flex flex-col gap-2 flex-1">
                            <label class={labelCls}>Тип</label>
                            <div class="flex gap-3">
                                <label class="flex-1 flex flex-col gap-[2px] border rounded-[3px] px-4 py-[0.85rem] cursor-pointer transition-all {bookingType === 'ticket' ? 'border-[#c9a84c] bg-[rgba(201,168,76,0.05)]' : 'border-[#a08c5b]/20 hover:border-[#c9a84c]'}">
                                    <input type="radio" bind:group={bookingType} value="ticket" class="hidden" />
                                    <span class="text-[0.9rem] text-[#e8e0d0]">Билет</span>
                                </label>
                                <label class="flex-1 flex flex-col gap-[2px] border rounded-[3px] px-4 py-[0.85rem] cursor-pointer transition-all {bookingType === 'request' ? 'border-[#c9a84c] bg-[rgba(201,168,76,0.05)]' : 'border-[#a08c5b]/20 hover:border-[#c9a84c]'}">
                                    <input type="radio" bind:group={bookingType} value="request" class="hidden" />
                                    <span class="text-[0.9rem] text-[#e8e0d0]">Заявка</span>
                                </label>
                            </div>
                        </div>
                        <div class="flex flex-col gap-2 flex-1">
                            <label class={labelCls}>Макс. участников</label>
                            <input class={inputCls} type="number" min="1" max="100" bind:value={maxParticipants} />
                        </div>
                    </div>
                    {#if bookingType === "ticket"}
                        <div class="flex flex-col gap-2">
                            <label class={labelCls}>Ссылка на билет</label>
                            <input class={inputCls} type="url" bind:value={ticketUrl} placeholder="https://…" />
                        </div>
                    {/if}
                </section>

                <!-- 06 Стоимость -->
                <section class="py-9 border-b border-[#a08c5b]/10 flex flex-col gap-5">
                    <h3 class="font-['Playfair_Display'] text-[1.05rem] font-bold text-[#f0e8d5] flex items-center gap-3">
                        <span class="font-['Jost'] text-[0.7rem] tracking-[0.15em] text-[#c9a84c] border border-[rgba(201,168,76,0.3)] px-[7px] py-[2px] rounded-[2px]">06</span>
                        Стоимость
                    </h3>
                    <div class="flex flex-col gap-2">
                        <label class={labelCls}>Цена (₽)</label>
                        <div class="relative">
                            <span class="absolute left-4 top-1/2 -translate-y-1/2 text-[#c9a84c] pointer-events-none">₽</span>
                            <input class="{inputCls} pl-8" type="number" min="0" max="100000" bind:value={amount} />
                        </div>
                    </div>
                </section>

                <!-- 07 Ограничения -->
                <section class="py-9 border-b border-[#a08c5b]/10 flex flex-col gap-5">
                    <h3 class="font-['Playfair_Display'] text-[1.05rem] font-bold text-[#f0e8d5] flex items-center gap-3">
                        <span class="font-['Jost'] text-[0.7rem] tracking-[0.15em] text-[#c9a84c] border border-[rgba(201,168,76,0.3)] px-[7px] py-[2px] rounded-[2px]">07</span>
                        Ограничения
                    </h3>
                    <div class="flex flex-wrap gap-5">
                        <div class="flex flex-col gap-2 flex-1"><label class={labelCls}>Возраст от</label><input class={inputCls} type="number" min="0" max="100" bind:value={ageMin} /></div>
                        <div class="flex flex-col gap-2 flex-1"><label class={labelCls}>Возраст до</label><input class={inputCls} type="number" min="0" max="100" bind:value={ageMax} /></div>
                        <div class="flex flex-col gap-2 flex-1 justify-end pb-[2px]">
                            <label class="flex items-center gap-[0.6rem] cursor-pointer select-none">
                                <input type="checkbox" bind:checked={requiresAdult} class="appearance-none w-[18px] h-[18px] border border-[#a08c5b]/30 rounded-[2px] bg-[#1a1810] cursor-pointer relative flex-shrink-0 transition-all checked:bg-[#c9a84c] checked:border-[#c9a84c]" />
                                <span class="text-[0.88rem] text-[#9a9080]">Только 18+</span>
                            </label>
                        </div>
                    </div>
                </section>

                <!-- 08 Организатор -->
                <section class="py-9 border-b border-[#a08c5b]/10 flex flex-col gap-5">
                    <h3 class="font-['Playfair_Display'] text-[1.05rem] font-bold text-[#f0e8d5] flex items-center gap-3">
                        <span class="font-['Jost'] text-[0.7rem] tracking-[0.15em] text-[#c9a84c] border border-[rgba(201,168,76,0.3)] px-[7px] py-[2px] rounded-[2px]">08</span>
                        Организатор
                    </h3>
                    <div class="flex flex-wrap gap-5">
                        <div class="flex flex-col gap-2 flex-1"><label class={labelCls}>Имя</label><input class={inputCls} type="text" bind:value={orgName} /></div>
                        <div class="flex flex-col gap-2 flex-1"><label class={labelCls}>Email</label><input class={inputCls} type="email" bind:value={orgEmail} /></div>
                        <div class="flex flex-col gap-2 flex-1"><label class={labelCls}>Телефон</label><input class={inputCls} type="tel" bind:value={orgPhone} /></div>
                    </div>
                </section>

                <!-- 09 SEO -->
                <section class="py-9 border-b border-[#a08c5b]/10 flex flex-col gap-5">
                    <h3 class="font-['Playfair_Display'] text-[1.05rem] font-bold text-[#f0e8d5] flex items-center gap-3">
                        <span class="font-['Jost'] text-[0.7rem] tracking-[0.15em] text-[#c9a84c] border border-[rgba(201,168,76,0.3)] px-[7px] py-[2px] rounded-[2px]">09</span>
                        SEO
                    </h3>
                    <div class="flex flex-col gap-2"><label class={labelCls}>Meta Title</label><input class={inputCls} type="text" bind:value={metaTitle} /></div>
                    <div class="flex flex-col gap-2"><label class={labelCls}>Meta Description</label><textarea class="{inputCls} resize-y min-h-[100px]" bind:value={metaDescription} rows="3"></textarea></div>
                    <div class="flex flex-col gap-2">
                        <label class={labelCls}>Slug</label>
                        <div class="flex">
                            <span class="bg-[rgba(201,168,76,0.08)] border border-[#a08c5b]/20 border-r-0 rounded-l-[3px] px-[0.85rem] py-[0.7rem] text-[0.85rem] text-[#6a6050] whitespace-nowrap">/events/</span>
                            <input class="{inputCls} rounded-l-none" type="text" bind:value={seoSlug} />
                        </div>
                    </div>
                </section>

                {#if saveError}
                    <div class="flex items-center gap-3 bg-[rgba(192,57,43,0.08)] border border-[rgba(192,57,43,0.3)] rounded-[3px] px-5 py-[0.9rem] text-[#e07060] text-[0.88rem] mt-6">
                        <span>⚠</span>{saveError}
                    </div>
                {/if}

                <div class="flex justify-end gap-4 pt-10">
                    <button
                        type="button"
                        class="font-['Jost'] text-xs font-medium tracking-widest uppercase px-8 py-[0.8rem] rounded-[3px] cursor-pointer transition-all bg-transparent border border-[#a08c5b]/30 text-[#9a9080] hover:border-[#c9a84c] hover:text-[#c9a84c]"
                        
                        on:click={() => goto('/admin')}
                    >Отмена</button>
                    <button
                        type="submit"
                        class="font-['Jost'] text-xs font-medium tracking-widest uppercase px-8 py-[0.8rem] rounded-[3px] cursor-pointer border-none transition-all inline-flex items-center gap-2 bg-[#c9a84c] text-[#111009] hover:bg-[#d4b35e] disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={saving}
                    >
                        {#if saving}
                            <span class="w-[14px] h-[14px] border-2 border-[rgba(17,16,9,0.3)] border-t-[#111009] rounded-full animate-spin"></span>
                            Сохранение…
                        {:else}
                            Сохранить
                        {/if}
                    </button>
                </div>

            </form>
        </div>
    {/if}

</main>
