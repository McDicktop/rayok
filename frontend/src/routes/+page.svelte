<script>
    import { onMount } from "svelte";
    import Modal from "$lib/components/Modal.svelte";
    import { goto } from "$app/navigation";

    let showConfirm = false;

    let events = [];
    let categories = [];
    let loading = true;
    let error = null;
    let selectedCategory = "all";

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
                fetch("/api/event"),
                fetch("/api/event/category"),
            ]);
            events = await evRes.json();
            categories = await catRes.json();
        } catch (e) {
            error = "Не удалось загрузить мероприятия";
        } finally {
            loading = false;
        }
    });

    $: filtered =
        selectedCategory === "all"
            ? events
            : events.filter(
                  (e) =>
                      e.category?._id === selectedCategory ||
                      e.category === selectedCategory,
              );

    function formatDate(d) {
        return new Date(d).toLocaleDateString("ru-RU", {
            day: "numeric",
            month: "long",
            year: "numeric",
        });
    }

    function formatPrice(pricing) {
        if (pricing.isFree || pricing.amount === 0) return "Бесплатно";
        return `${pricing.amount.toLocaleString("ru-RU")} ₽`;
    }

    function formatDuration(dur) {
        const h = Math.floor(dur.minutes / 60);
        const m = dur.minutes % 60;
        if (h === 0) return `${m} мин`;
        if (m === 0) return `${h} ч`;
        return `${h} ч ${m} мин`;
    }
</script>

<svelte:head>
    <title>Мероприятия — Творческая студия</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
        href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Jost:wght@300;400;500&display=swap"
        rel="stylesheet"
    />
</svelte:head>

<!-- <Modal bind:open={showConfirm} title="Новая категория">
    <p class="text-sm text-[#6a6050] mb-6">Заполните поля</p>

    <form on:submit|preventDefault class="flex flex-col gap-0">
        <section class="py-9 border-b border-[#a08c5b]/10 flex flex-col gap-5">
            <div class="flex flex-col gap-2 flex-1">
                <label class="text-xs tracking-widest uppercase text-[#8a8070]" for="cat-title">
                    Название<span class="text-[#c9a84c]">*</span>
                </label>
                <input
                    id="cat-title"
                    class="bg-[#1a1810] border border-[#a08c5b]/20 rounded-[3px] text-[#e8e0d0] font-['Jost'] text-sm font-light px-4 py-[0.7rem] outline-none w-full focus:border-[#c9a84c] focus:shadow-[0_0_0_3px_rgba(201,168,76,0.08)] placeholder-[#4a4535] transition-all"
                    type="text"
                    placeholder="Мастер-класс по акварели"
                    required
                />
            </div>
            <div class="flex flex-col gap-2 flex-1">
                <label class="text-xs tracking-widest uppercase text-[#8a8070]" for="cat-slug">
                    Псевдоним<span class="text-[#c9a84c]">*</span>
                </label>
                <input
                    id="cat-slug"
                    class="bg-[#1a1810] border border-[#a08c5b]/20 rounded-[3px] text-[#e8e0d0] font-['Jost'] text-sm font-light px-4 py-[0.7rem] outline-none w-full focus:border-[#c9a84c] focus:shadow-[0_0_0_3px_rgba(201,168,76,0.08)] placeholder-[#4a4535] transition-all"
                    type="text"
                    placeholder="master-klass"
                    required
                />
            </div>
        </section>
    </form>

    <div class="flex gap-3 justify-end mt-6">
        <button class="font-['Jost'] text-xs font-medium tracking-widest uppercase no-underline px-8 py-[0.8rem] rounded-[3px] cursor-pointer transition-all inline-flex items-center gap-2 bg-transparent border border-[#a08c5b]/30 text-[#9a9080] hover:border-[#c9a84c] hover:text-[#c9a84c]">
            Создать
        </button>
        <button class="font-['Jost'] text-xs font-medium tracking-widest uppercase no-underline px-8 py-[0.8rem] rounded-[3px] cursor-pointer border transition-all inline-flex items-center gap-2 bg-[rgba(192,57,43,0.1)] border-[rgba(192,57,43,0.4)] text-[#e07060] hover:bg-[rgba(192,57,43,0.2)]">
            Отменить
        </button>
    </div>
</Modal> -->

<div class="min-h-screen">
    <!-- Header -->
    <header
        class="sticky top-0 z-[100] border-b border-[#a08c5b]/20 bg-[rgba(17,16,9,0.92)] backdrop-blur-[12px]"
    >
        <div
            class="max-w-[1200px] mx-auto px-8 flex items-center justify-between h-16"
        >
            <button
                class="flex items-center gap-[10px] cursor-pointer"
                on:click={() => goto("/")}
            >
                <span
                    class="font-['Playfair_Display'] text-xl tracking-[0.05em] text-[#e8e0d0]"
                    >Студия «Раёк»</span
                >
            </button>
            <nav class="flex gap-8 items-center">
                <a
                    href="/admin"
                    class="text-[0.85rem] tracking-widest uppercase text-[#c9a84c] border border-[#c9a84c] px-4 py-[6px] rounded-[2px] no-underline transition-all hover:bg-[#c9a84c] hover:text-[#111009]"
                >
                    Админ панель
                </a>
            </nav>
        </div>
    </header>

    <main class="max-w-[1200px] mx-auto px-8 pb-16">
        <!-- Hero -->
        <section class="pt-16 pb-10">
            <p
                class="text-[0.75rem] tracking-[0.2em] uppercase text-[#c9a84c] mb-3"
            >
                Афиша студии
            </p>
            <!-- <h1
                class="font-['Playfair_Display'] text-[clamp(2.5rem,5vw,4rem)] font-bold text-[#f0e8d5] leading-[1.1]"
            >
                Мероприятия
            </h1> -->
            <!-- <div
                class="w-[60px] h-[2px] bg-gradient-to-r from-[#c9a84c] to-transparent mt-6"
            ></div> -->
        </section>

        <!-- Filters -->
        <div class="flex flex-wrap gap-2 mb-10">
            {#if categories.length > 0}
                <button
                    class="font-['Jost'] text-[0.8rem] tracking-[0.08em] uppercase border rounded-[2px] px-4 py-[6px] cursor-pointer transition-all {selectedCategory ===
                    'all'
                        ? 'bg-[#c9a84c] border-[#c9a84c] text-[#111009]'
                        : 'border-[#a08c5b]/30 bg-transparent text-[#9a9080] hover:border-[#c9a84c] hover:text-[#c9a84c]'}"
                    on:click={() => (selectedCategory = "all")}>Все</button
                >
                {#each categories as cat}
                    <button
                        class="font-['Jost'] text-[0.8rem] tracking-[0.08em] uppercase border rounded-[2px] px-4 py-[6px] cursor-pointer transition-all {selectedCategory ===
                        cat._id
                            ? 'bg-[#c9a84c] border-[#c9a84c] text-[#111009]'
                            : 'border-[#a08c5b]/30 bg-transparent text-[#9a9080] hover:border-[#c9a84c] hover:text-[#c9a84c]'}"
                        on:click={() => (selectedCategory = cat._id)}
                        >{cat.label}</button
                    >
                {/each}
            {/if}
        </div>

        <!-- States -->
        {#if loading}
            <div
                class="flex flex-col items-center justify-center py-20 gap-4 text-[#5a5040]"
            >
                <div
                    class="w-8 h-8 border-2 border-[rgba(201,168,76,0.2)] border-t-[#c9a84c] rounded-full animate-spin"
                ></div>
                <p>Загрузка...</p>
            </div>
        {:else if error}
            <div class="flex items-center justify-center py-20 text-[#c0392b]">
                {error}
            </div>
        {:else if filtered.length === 0}
            <div class="flex items-center justify-center py-20">
                <p
                    class="font-['Playfair_Display'] italic text-xl text-[#5a5040]"
                >
                    Мероприятий пока нет
                </p>
            </div>
        {:else}
            <div
                class="grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-5"
            >
                {#each filtered as event, i}
                    <article
                        class="bg-[#1a1810] border border-[#a08c5b]/12 overflow-hidden transition-all duration-300 hover:border-[rgba(201,168,76,0.4)] hover:-translate-y-[3px] animate-[fadeUp_0.5s_ease_both]"
                        style="animation-delay: {i * 60}ms"
                    >
                        <!-- Image -->
                        <div
                            class="relative aspect-video overflow-hidden bg-[#222018]"
                        >
                            {#if event.media?.cover}
                                <img
                                    src={event.media.cover}
                                    alt={event.title}
                                    class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                                />
                            {:else}
                                <div
                                    class="w-full h-full flex items-center justify-center text-[rgba(201,168,76,0.2)] text-3xl"
                                >
                                    ✦
                                </div>
                            {/if}
                            <span
                                class="absolute top-3 right-3 text-[0.7rem] tracking-[0.12em] uppercase bg-[rgba(17,16,9,0.85)] px-2 py-[3px] rounded-[2px]"
                                style="color: {statusColors[event.status]}"
                                >{statusLabels[event.status] ??
                                    event.status}</span
                            >
                        </div>

                        <!-- Body -->
                        <div class="p-6">
                            <div class="h-[270px]">
                                {#if categories}
                                    <p
                                        class="text-[0.7rem] tracking-[0.15em] uppercase text-[#c9a84c] mb-2"
                                    >
                                        {categories.find(
                                            (cat) => cat._id === event.category,
                                        )?.label}
                                    </p>
                                {/if}
                                <h2
                                    class="font-['Playfair_Display'] text-xl font-bold text-[#f0e8d5] leading-[1.3] mb-3"
                                >
                                    {event.title}
                                </h2>
                                <p
                                    class="text-[0.88rem] leading-relaxed text-[#7a7060] mb-5"
                                >
                                    {event.description?.slice(0, 120)}{event
                                        .description?.length > 120
                                        ? "…"
                                        : ""}
                                </p>

                                <!-- Meta -->
                                <div class="flex flex-col gap-[0.35rem] mb-5">
                                    {#if event.schedule?.dates?.length}
                                        <div
                                            class="flex items-center gap-2 text-[0.82rem] text-[#9a9080]"
                                        >
                                            <span
                                                class="text-[#c9a84c] text-[0.9rem]"
                                                >◷</span
                                            >
                                            {formatDate(
                                                event.schedule.dates[0],
                                            )}
                                            {#if event.schedule.isSubscription}
                                                <span
                                                    class="text-[0.65rem] tracking-widest uppercase border border-[#c9a84c] text-[#c9a84c] px-[6px] py-[1px] rounded-[2px] ml-1"
                                                >
                                                    Абонемент
                                                </span>
                                            {/if}
                                        </div>
                                    {/if}
                                    {#if event.duration}
                                        <div
                                            class="flex items-center gap-2 text-[0.82rem] text-[#9a9080]"
                                        >
                                            <span
                                                class="text-[#c9a84c] text-[0.9rem]"
                                                >⏱</span
                                            >
                                            {#if event.duration.isApproximate}<span
                                                    class="text-[#c9a84c] ml-[2px]"
                                                    >~</span
                                                >{/if}
                                            {formatDuration(event.duration)}
                                        </div>
                                    {/if}
                                    {#if event.restrictions?.ageMin !== undefined}
                                        <div
                                            class="flex items-center gap-2 text-[0.82rem] text-[#9a9080]"
                                        >
                                            <span
                                                class="text-[#c9a84c] text-[0.9rem]"
                                                >◉</span
                                            >
                                            {event.restrictions.ageMin === 0 &&
                                            event.restrictions.ageMax === 100
                                                ? "Без возрастных ограничений"
                                                : event.restrictions.ageMin +
                                                  " – " +
                                                  event.restrictions.ageMax +
                                                  " лет"}
                                        </div>
                                    {/if}
                                </div>
                            </div>

                            <!-- Footer -->
                            <div
                                class="flex items-center justify-between pt-4 border-t border-[#a08c5b]/15"
                            >
                                <span
                                    class="font-['Playfair_Display'] text-[1.1rem] text-[#c9a84c]"
                                >
                                    {formatPrice(event.pricing)}
                                </span>
                                <a
                                    href="/admin/event/{event._id}"
                                    class="text-[0.78rem] tracking-widest uppercase text-[#9a9080] no-underline transition-colors hover:text-[#c9a84c]"
                                    >Подробнее →</a
                                >
                            </div>
                        </div>
                    </article>
                {/each}
            </div>
        {/if}
    </main>
</div>
