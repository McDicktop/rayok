<script>
    import { onMount } from "svelte";
    import { goto } from "$app/navigation";
    import Modal from "$lib/components/Modal.svelte";

    // ── Tab ───────────────────────────────────────────────────────────────────
    let activeTab = "events"; // 'events' | 'categories'

    // ── Data ──────────────────────────────────────────────────────────────────
    let categories = [];
    let events = [];
    let loading = true;

    // ── Category modal ────────────────────────────────────────────────────────
    let showCategoryModal = false;
    let categoryModalMode = "create";
    let editingCategory = null;
    let catLabel = "";
    let catSlug = "";
    let catSaving = false;
    let catError = null;

    let showDeleteCategoryModal = false;
    let deletingCategory = null;
    let catDeleting = false;

    // ── Category sort ─────────────────────────────────────────────────────────
    let catSortBy = "default"; // 'default' | 'alpha_asc' | 'alpha_desc'
    let catSortOpen = false;

    // ── Events filters & view ─────────────────────────────────────────────────
    let viewMode = "list";
    let statusFilter = "all";
    let showArchive = false;
    let sortBy = "date_desc";
    let selectedCategoryIds = new Set();

    // ── Dropdown state ────────────────────────────────────────────────────────
    let sortOpen = false;
    let catFilterOpen = false;
    let openMenuId = null;

    // ── Delete event modal ────────────────────────────────────────────────────
    let showDeleteEventModal = false;
    let deletingEvent = null;
    let eventDeleting = false;

    // ── Lifecycle ─────────────────────────────────────────────────────────────
    onMount(async () => {
        await Promise.all([loadCategories(), loadEvents()]);
        loading = false;
    });

    async function loadCategories() {
        try {
            const res = await fetch("/api/event/category");
            categories = await res.json();
            selectedCategoryIds = new Set(categories.map((c) => c._id));
        } catch {}
    }

    async function loadEvents() {
        try {
            const res = await fetch("/api/event");
            events = await res.json();
        } catch {}
    }

    // ── Category CRUD ─────────────────────────────────────────────────────────
    function openCreateCategory() {
        categoryModalMode = "create";
        editingCategory = null;
        catLabel = "";
        catSlug = "";
        catError = null;
        showCategoryModal = true;
    }

    function openEditCategory(cat) {
        categoryModalMode = "edit";
        editingCategory = cat;
        catLabel = cat.label;
        catSlug = cat.slug;
        catError = null;
        showCategoryModal = true;
    }

    function autoSlug(label) {
        const map = {
            а: "a",
            б: "b",
            в: "v",
            г: "g",
            д: "d",
            е: "e",
            ё: "e",
            ж: "zh",
            з: "z",
            и: "i",
            й: "y",
            к: "k",
            л: "l",
            м: "m",
            н: "n",
            о: "o",
            п: "p",
            р: "r",
            с: "s",
            т: "t",
            у: "u",
            ф: "f",
            х: "h",
            ц: "ts",
            ч: "ch",
            ш: "sh",
            щ: "sch",
            ъ: "",
            ы: "y",
            ь: "",
            э: "e",
            ю: "yu",
            я: "ya",
        };
        return label
            .toLowerCase()
            .split("")
            .map((c) => map[c] ?? c)
            .join("")
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "");
    }

    function handleLabelInput(e) {
        catLabel = e.target.value;
        if (categoryModalMode === "create") catSlug = autoSlug(catLabel);
    }

    async function handleCategorySubmit() {
        catError = null;
        catSaving = true;
        try {
            const url =
                categoryModalMode === "edit"
                    ? `/api/event/category/${editingCategory._id}`
                    : "/api/event/category";
            const method = categoryModalMode === "edit" ? "PUT" : "POST";
            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ label: catLabel, slug: catSlug }),
            });
            const data = await res.json();
            if (!res.ok) {
                catError = data.message ?? "Ошибка";
                return;
            }
            await loadCategories();
            showCategoryModal = false;
        } catch {
            catError = "Сетевая ошибка";
        } finally {
            catSaving = false;
        }
    }

    function confirmDeleteCategory(cat) {
        deletingCategory = cat;
        showDeleteCategoryModal = true;
    }

    async function handleDeleteCategory() {
        catDeleting = true;
        try {
            const res = await fetch(
                `/api/event/category/${deletingCategory._id}`,
                { method: "DELETE" },
            );
            if (res.ok) {
                await loadCategories();
                showDeleteCategoryModal = false;
            }
        } catch {
        } finally {
            catDeleting = false;
        }
    }

    // ── Sorted categories ─────────────────────────────────────────────────────
    $: sortedCategories = (() => {
        const list = [...categories];
        if (catSortBy === "alpha_asc")
            list.sort((a, b) => a.label.localeCompare(b.label, "ru"));
        if (catSortBy === "alpha_desc")
            list.sort((a, b) => b.label.localeCompare(a.label, "ru"));
        return list;
    })();

    // ── Events logic ──────────────────────────────────────────────────────────
    $: filteredEvents = (() => {
        let result = [...events];
        if (showArchive) {
            result = result.filter((e) => e.status === "archived");
        } else {
            result = result.filter((e) => e.status !== "archived");
            if (statusFilter === "published")
                result = result.filter((e) => e.status === "published");
            if (statusFilter === "unpublished")
                result = result.filter((e) => e.status === "unpublished");
        }
        if (
            selectedCategoryIds.size > 0 &&
            selectedCategoryIds.size < categories.length
        ) {
            result = result.filter((e) => {
                const catId = e.category?._id ?? e.category;
                return selectedCategoryIds.has(catId);
            });
        }
        result.sort((a, b) => {
            if (sortBy === "alpha_asc")
                return a.title.localeCompare(b.title, "ru");
            if (sortBy === "alpha_desc")
                return b.title.localeCompare(a.title, "ru");
            if (sortBy === "date_asc")
                return new Date(a.createdAt) - new Date(b.createdAt);
            return new Date(b.createdAt) - new Date(a.createdAt);
        });
        return result;
    })();

    function getCatLabel(event) {
        const catId = event.category?._id ?? event.category;
        return categories.find((c) => c._id === catId)?.label ?? "";
    }

    function formatDate(d) {
        return new Date(d).toLocaleDateString("ru-RU", {
            day: "numeric",
            month: "short",
            year: "numeric",
        });
    }

    function formatPrice(pricing) {
        if (!pricing) return "—";
        if (pricing.isFree || pricing.amount === 0) return "Бесплатно";
        return `${pricing.amount.toLocaleString("ru-RU")} ₽`;
    }

    async function toggleStatus(event, e) {
        e.stopPropagation();
        const newStatus =
            event.status === "published" ? "unpublished" : "published";
        events = events.map((ev) =>
            ev._id === event._id ? { ...ev, status: newStatus } : ev,
        );
        try {
            await fetch(`/api/event/status/${event._id}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus }),
            });
        } catch {
            events = events.map((ev) =>
                ev._id === event._id ? { ...ev, status: event.status } : ev,
            );
        }
    }

    async function archiveEvent(ev) {
        openMenuId = null;
        events = events.map((e) =>
            e._id === ev._id ? { ...e, status: "archived" } : e,
        );
        try {
            await fetch(`/api/event/status/${ev._id}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: "archived" }),
            });
        } catch {
            events = events.map((e) =>
                e._id === ev._id ? { ...e, status: ev.status } : e,
            );
        }
    }

    function confirmDeleteEvent(ev) {
        openMenuId = null;
        deletingEvent = ev;
        showDeleteEventModal = true;
    }

    async function handleDeleteEvent() {
        eventDeleting = true;
        try {
            const res = await fetch(`/api/event/${deletingEvent._id}`, {
                method: "DELETE",
            });
            if (res.ok) {
                events = events.filter((e) => e._id !== deletingEvent._id);
                showDeleteEventModal = false;
            }
        } catch {
        } finally {
            eventDeleting = false;
        }
    }

    function openEvent(ev) {
        goto(`/admin/event/${ev._id}`);
    }

    function toggleCatFilter(id) {
        const next = new Set(selectedCategoryIds);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        selectedCategoryIds = next;
    }
    function selectAllCats() {
        selectedCategoryIds = new Set(categories.map((c) => c._id));
    }
    function deselectAllCats() {
        selectedCategoryIds = new Set();
    }

    function handleGlobalClick() {
        sortOpen = false;
        catFilterOpen = false;
        catSortOpen = false;
        openMenuId = null;
    }

    const sortLabels = {
        date_desc: "По дате (новые)",
        date_asc: "По дате (старые)",
        alpha_asc: "По алфавиту А→Я",
        alpha_desc: "По алфавиту Я→А",
    };

    const catSortLabels = {
        default: "По умолчанию",
        alpha_asc: "По алфавиту А→Я",
        alpha_desc: "По алфавиту Я→А",
    };

    const statusColors = {
        published: "#6db87a",
        unpublished: "#a08c5b",
        archived: "#555",
        draft: "#a08c5b",
    };
    const statusLabels = {
        published: "Опубликовано",
        unpublished: "Снято",
        archived: "Архив",
        draft: "Черновик",
    };

    // Shared btn classes
    const btnOutline =
        "cursor-pointer rounded-[3px] border border-[#a08c5b]/30 bg-transparent px-5 py-[0.65rem] font-['Jost'] text-[0.75rem] font-medium tracking-widest text-[#9a9080] uppercase transition-all hover:border-[#c9a84c] hover:text-[#c9a84c]";
    const btnDanger =
        "cursor-pointer rounded-[3px] border border-[rgba(192,57,43,0.4)] bg-[rgba(192,57,43,0.1)] px-5 py-[0.65rem] font-['Jost'] text-[0.75rem] font-medium tracking-widest text-[#e07060] uppercase transition-all hover:bg-[rgba(192,57,43,0.2)] disabled:opacity-50";
    const btnGold =
        "cursor-pointer rounded-[3px] border-none bg-[#c9a84c] px-5 py-[0.65rem] font-['Jost'] text-[0.75rem] font-medium tracking-widest text-[#111009] uppercase transition-all hover:bg-[#d4b35e] disabled:cursor-not-allowed disabled:opacity-50 inline-flex items-center gap-2";
</script>

<svelte:head>
    <title>Админ панель — Студия «Раёк»</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
        href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Jost:wght@300;400;500&display=swap"
        rel="stylesheet"
    />
</svelte:head>

<svelte:window on:click={handleGlobalClick} />

<!-- ── Category modal ─────────────────────────────────────────────────────── -->
<Modal
    bind:open={showCategoryModal}
    title={categoryModalMode === "create"
        ? "Новая категория"
        : "Редактировать категорию"}
>
    <div class="mt-2 flex flex-col gap-4">
        <div class="flex flex-col gap-2">
            <label
                class="text-[0.72rem] tracking-widest text-[#8a8070] uppercase"
                for="cat-label"
            >
                Название <span class="text-[#c9a84c]">*</span>
            </label>
            <input
                id="cat-label"
                class="rounded-[3px] border border-[#a08c5b]/20 bg-[#111009] px-4 py-[0.65rem] font-['Jost'] text-sm font-light text-[#e8e0d0] placeholder-[#4a4535] outline-none transition-all focus:border-[#c9a84c] focus:shadow-[0_0_0_3px_rgba(201,168,76,0.08)]"
                type="text"
                value={catLabel}
                on:input={handleLabelInput}
                placeholder="Мастер-классы"
            />
        </div>
        <div class="flex flex-col gap-2">
            <label
                class="text-[0.72rem] tracking-widest text-[#8a8070] uppercase"
                for="cat-slug"
            >
                Slug <span
                    class="ml-1 tracking-normal text-[#5a5040] normal-case"
                    >(URL-идентификатор)</span
                >
            </label>
            <input
                id="cat-slug"
                class="rounded-[3px] border border-[#a08c5b]/20 bg-[#111009] px-4 py-[0.65rem] font-['Jost'] text-sm font-light text-[#e8e0d0] placeholder-[#4a4535] outline-none transition-all focus:border-[#c9a84c] focus:shadow-[0_0_0_3px_rgba(201,168,76,0.08)]"
                type="text"
                bind:value={catSlug}
                placeholder="master-klassy"
            />
        </div>
        {#if catError}
            <p class="flex items-center gap-2 text-[0.8rem] text-[#e07060]">
                <span>⚠</span>{catError}
            </p>
        {/if}
        <div class="flex justify-end gap-3 pt-2">
            <button
                class={btnOutline}
                on:click={() => (showCategoryModal = false)}>Отмена</button
            >
            <button
                class={btnGold}
                on:click={handleCategorySubmit}
                disabled={catSaving || !catLabel.trim() || !catSlug.trim()}
            >
                {#if catSaving}<span
                        class="h-[12px] w-[12px] animate-spin rounded-full border-2 border-[rgba(17,16,9,0.3)] border-t-[#111009]"
                    ></span>{/if}
                {categoryModalMode === "create" ? "Создать" : "Сохранить"}
            </button>
        </div>
    </div>
</Modal>

<!-- ── Delete category modal ──────────────────────────────────────────────── -->
<Modal bind:open={showDeleteCategoryModal} title="Удалить категорию?">
    <p class="mb-6 text-[0.88rem] leading-relaxed text-[#6a6050]">
        Категория <span class="text-[#e8e0d0]">«{deletingCategory?.label}»</span
        > будет удалена. Нельзя удалить категорию с привязанными мероприятиями.
    </p>
    <div class="flex justify-end gap-3">
        <button
            class={btnOutline}
            on:click={() => (showDeleteCategoryModal = false)}>Отмена</button
        >
        <button
            class={btnDanger}
            on:click={handleDeleteCategory}
            disabled={catDeleting}
            >{catDeleting ? "Удаление…" : "Удалить"}</button
        >
    </div>
</Modal>

<!-- ── Delete event modal ─────────────────────────────────────────────────── -->
<Modal bind:open={showDeleteEventModal} title="Удалить мероприятие?">
    <p class="mb-6 text-[0.88rem] leading-relaxed text-[#6a6050]">
        <span class="text-[#e8e0d0]">«{deletingEvent?.title}»</span> будет удалено
        безвозвратно вместе с медиафайлами.
    </p>
    <div class="flex justify-end gap-3">
        <button
            class={btnOutline}
            on:click={() => (showDeleteEventModal = false)}>Отмена</button
        >
        <button
            class={btnDanger}
            on:click={handleDeleteEvent}
            disabled={eventDeleting}
            >{eventDeleting ? "Удаление…" : "Удалить"}</button
        >
    </div>
</Modal>

<!-- ══════════════════════════════════════════════════════════════════════════ -->
<!-- Layout: header + content fill viewport height -->
<div class="flex h-screen flex-col">
    <!-- ── HEADER ──────────────────────────────────────────────────────────── -->
    <header
        class="flex-shrink-0 border-b border-[#a08c5b]/20 bg-[rgba(17,16,9,0.97)] backdrop-blur-[12px] z-40"
    >
        <div
            class="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-8"
        >
            <!-- Logo -->
            <div class="flex items-center gap-[10px]">
                <span class="text-xl text-[#c9a84c]">✦</span>
                <span
                    class="font-['Playfair_Display'] text-xl tracking-[0.05em] text-[#e8e0d0]"
                    >Студия «Раёк»</span
                >
            </div>

            <!-- Tabs -->
            <nav class="flex items-center gap-1">
                <button
                    class="px-5 py-[7px] font-['Jost'] text-[0.75rem] font-medium tracking-widest uppercase cursor-pointer border-none transition-all rounded-[2px] {activeTab ===
                    'events'
                        ? 'bg-[#c9a84c] text-[#111009]'
                        : 'bg-transparent text-[#9a9080] hover:text-[#e8e0d0]'}"
                    on:click={() => (activeTab = "events")}>Мероприятия</button
                >
                <button
                    class="px-5 py-[7px] font-['Jost'] text-[0.75rem] font-medium tracking-widest uppercase cursor-pointer border-none transition-all rounded-[2px] {activeTab ===
                    'categories'
                        ? 'bg-[#c9a84c] text-[#111009]'
                        : 'bg-transparent text-[#9a9080] hover:text-[#e8e0d0]'}"
                    on:click={() => (activeTab = "categories")}
                    >Категории</button
                >
            </nav>

            <!-- Right action -->
            <!-- <button
				class="cursor-pointer rounded-[2px] border border-[#c9a84c] bg-transparent px-4 py-[6px] font-['Jost'] text-[0.82rem] font-medium tracking-widest text-[#c9a84c] uppercase transition-all hover:bg-[#c9a84c] hover:text-[#111009]"
				on:click={() => goto('/admin/event/new')}
			>+ Мероприятие</button> -->
        </div>
    </header>

    {#if loading}
        <!-- Loading state -->
        <div
            class="flex flex-1 items-center justify-center gap-4 text-[#5a5040]"
        >
            <div
                class="h-7 w-7 animate-spin rounded-full border-2 border-[rgba(201,168,76,0.2)] border-t-[#c9a84c]"
            ></div>
            <span class="font-['Jost'] text-sm tracking-widest uppercase"
                >Загрузка…</span
            >
        </div>
    {:else}
        <!-- ════════════════════════════════════════════════════════════════════════ -->
        <!-- TAB: EVENTS -->
        <!-- ════════════════════════════════════════════════════════════════════════ -->
        {#if activeTab === "events"}
            <div class="flex min-h-0 flex-1 flex-col">
                <!-- Sticky events toolbar -->
                <div
                    class="flex-shrink-0 border-b border-[#a08c5b]/10 bg-[#111009] shadow-[0_2px_16px_rgba(0,0,0,0.4)] z-30"
                >
                    <div class="mx-auto max-w-[1200px] px-8 py-3">
                        <div
                            class="flex items-center justify-between gap-3 flex-wrap"
                        >
                            <!-- Left -->
                            <div class="flex items-center gap-2 flex-wrap">
                                <!-- Sort dropdown -->
                                <div
                                    class="relative z-[50]"
                                    on:click|stopPropagation
                                >
                                    <button
                                        class="inline-flex cursor-pointer items-center gap-2 rounded-[2px] border px-3 py-[6px] font-['Jost'] text-[0.7rem] font-medium tracking-widest uppercase transition-all {sortOpen
                                            ? 'border-[#c9a84c] bg-[rgba(201,168,76,0.05)] text-[#c9a84c]'
                                            : 'border-[#a08c5b]/25 bg-transparent text-[#9a9080] hover:border-[#c9a84c] hover:text-[#c9a84c]'}"
                                        on:click={() => {
                                            sortOpen = !sortOpen;
                                            catFilterOpen = false;
                                            openMenuId = null;
                                        }}
                                    >
                                        <svg
                                            width="11"
                                            height="11"
                                            viewBox="0 0 12 12"
                                            fill="none"
                                            ><path
                                                d="M1 3h10M3 6h6M5 9h2"
                                                stroke="currentColor"
                                                stroke-width="1.2"
                                                stroke-linecap="round"
                                            /></svg
                                        >
                                        Сортировка
                                        <svg
                                            width="7"
                                            height="5"
                                            viewBox="0 0 8 5"
                                            fill="none"
                                            class="transition-transform {sortOpen
                                                ? 'rotate-180'
                                                : ''}"
                                            ><path
                                                d="M1 1l3 3 3-3"
                                                stroke="currentColor"
                                                stroke-width="1.2"
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                            /></svg
                                        >
                                    </button>
                                    {#if sortOpen}
                                        <div
                                            class="absolute top-full left-0 mt-1 min-w-[180px] overflow-hidden rounded-[3px] border border-[#a08c5b]/20 bg-[#1a1810] shadow-[0_12px_32px_rgba(0,0,0,0.7)] z-[9999]"
                                        >
                                            {#each Object.entries(sortLabels) as [key, label]}
                                                <button
                                                    class="w-full cursor-pointer border-none px-4 py-[0.55rem] text-left font-['Jost'] text-[0.78rem] transition-colors {sortBy ===
                                                    key
                                                        ? 'bg-[rgba(201,168,76,0.08)] text-[#c9a84c]'
                                                        : 'bg-transparent text-[#9a9080] hover:bg-[rgba(201,168,76,0.04)] hover:text-[#e8e0d0]'}"
                                                    on:click={() => {
                                                        sortBy = key;
                                                        sortOpen = false;
                                                    }}>{label}</button
                                                >
                                            {/each}
                                        </div>
                                    {/if}
                                </div>

                                <!-- Category filter dropdown -->
                                <div
                                    class="relative z-[50]"
                                    on:click|stopPropagation
                                >
                                    <button
                                        class="inline-flex cursor-pointer items-center gap-2 rounded-[2px] border px-3 py-[6px] font-['Jost'] text-[0.7rem] font-medium tracking-widest uppercase transition-all {catFilterOpen
                                            ? 'border-[#c9a84c] bg-[rgba(201,168,76,0.05)] text-[#c9a84c]'
                                            : 'border-[#a08c5b]/25 bg-transparent text-[#9a9080] hover:border-[#c9a84c] hover:text-[#c9a84c]'}"
                                        on:click={() => {
                                            catFilterOpen = !catFilterOpen;
                                            sortOpen = false;
                                            openMenuId = null;
                                        }}
                                    >
                                        <svg
                                            width="11"
                                            height="11"
                                            viewBox="0 0 12 12"
                                            fill="none"
                                            ><path
                                                d="M1 2h10L7 6.5V10.5L5 9.5V6.5L1 2z"
                                                stroke="currentColor"
                                                stroke-width="1.2"
                                                stroke-linejoin="round"
                                            /></svg
                                        >
                                        Категории
                                        {#if selectedCategoryIds.size < categories.length}
                                            <span
                                                class="rounded-[2px] bg-[#c9a84c] px-[5px] py-[1px] text-[0.58rem] leading-none text-[#111009]"
                                                >{selectedCategoryIds.size}</span
                                            >
                                        {/if}
                                        <svg
                                            width="7"
                                            height="5"
                                            viewBox="0 0 8 5"
                                            fill="none"
                                            class="transition-transform {catFilterOpen
                                                ? 'rotate-180'
                                                : ''}"
                                            ><path
                                                d="M1 1l3 3 3-3"
                                                stroke="currentColor"
                                                stroke-width="1.2"
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                            /></svg
                                        >
                                    </button>
                                    {#if catFilterOpen}
                                        <div
                                            class="absolute top-full left-0 mt-1 min-w-[200px] overflow-hidden rounded-[3px] border border-[#a08c5b]/20 bg-[#1a1810] shadow-[0_12px_32px_rgba(0,0,0,0.7)] z-[9999]"
                                        >
                                            <div
                                                class="flex border-b border-[#a08c5b]/10"
                                            >
                                                <button
                                                    class="flex-1 cursor-pointer border-none bg-transparent px-3 py-[0.4rem] font-['Jost'] text-[0.65rem] tracking-widest text-[#9a9080] uppercase transition-colors hover:text-[#c9a84c]"
                                                    on:click={selectAllCats}
                                                    >Выбрать все</button
                                                >
                                                <span
                                                    class="w-px self-stretch bg-[#a08c5b]/15"
                                                ></span>
                                                <button
                                                    class="flex-1 cursor-pointer border-none bg-transparent px-3 py-[0.4rem] font-['Jost'] text-[0.65rem] tracking-widest text-[#9a9080] uppercase transition-colors hover:text-[#c9a84c]"
                                                    on:click={deselectAllCats}
                                                    >Снять все</button
                                                >
                                            </div>
                                            {#each categories as cat}
                                                <button
                                                    class="inline-flex w-full cursor-pointer items-center gap-3 border-none px-4 py-[0.5rem] text-left font-['Jost'] text-[0.78rem] transition-colors {selectedCategoryIds.has(
                                                        cat._id,
                                                    )
                                                        ? 'bg-[rgba(201,168,76,0.05)] text-[#e8e0d0]'
                                                        : 'bg-transparent text-[#6a6050] hover:bg-[rgba(201,168,76,0.04)] hover:text-[#9a9080]'}"
                                                    on:click={() =>
                                                        toggleCatFilter(
                                                            cat._id,
                                                        )}
                                                >
                                                    <span
                                                        class="flex h-[13px] w-[13px] flex-shrink-0 items-center justify-center rounded-[2px] border transition-all {selectedCategoryIds.has(
                                                            cat._id,
                                                        )
                                                            ? 'border-[#c9a84c] bg-[#c9a84c]'
                                                            : 'border-[#a08c5b]/30'}"
                                                    >
                                                        {#if selectedCategoryIds.has(cat._id)}
                                                            <svg
                                                                width="8"
                                                                height="6"
                                                                viewBox="0 0 8 6"
                                                                fill="none"
                                                                ><path
                                                                    d="M1 3l2 2 4-4"
                                                                    stroke="#111009"
                                                                    stroke-width="1.5"
                                                                    stroke-linecap="round"
                                                                    stroke-linejoin="round"
                                                                /></svg
                                                            >
                                                        {/if}
                                                    </span>
                                                    {cat.label}
                                                </button>
                                            {/each}
                                        </div>
                                    {/if}
                                </div>

                                <!-- Status filters -->
                                <div
                                    class="flex items-center overflow-hidden rounded-[2px] border border-[#a08c5b]/20"
                                >
                                    {#each [["all", "Все"], ["published", "Опубликованные"], ["unpublished", "Неопубликованные"]] as [val, label]}
                                        <button
                                            class="cursor-pointer border-none px-3 py-[6px] font-['Jost'] text-[0.7rem] font-medium tracking-widest uppercase transition-all {!showArchive &&
                                            statusFilter === val
                                                ? 'bg-[#c9a84c] text-[#111009]'
                                                : 'bg-transparent text-[#9a9080] hover:text-[#e8e0d0]'}"
                                            on:click={() => {
                                                statusFilter = val;
                                                showArchive = false;
                                            }}>{label}</button
                                        >
                                    {/each}
                                </div>
                            </div>

                            <!-- Right -->
                            <div class="flex items-center gap-2">
                                <!-- Archive -->
                                <button
                                    class="inline-flex cursor-pointer items-center gap-2 rounded-[2px] border px-3 py-[6px] font-['Jost'] text-[0.7rem] font-medium tracking-widest uppercase transition-all {showArchive
                                        ? 'border-[#a08c5b] bg-[rgba(160,140,91,0.08)] text-[#a08c5b]'
                                        : 'border-[#a08c5b]/25 bg-transparent text-[#6a6050] hover:border-[#a08c5b]/50 hover:text-[#9a9080]'}"
                                    on:click={() => {
                                        showArchive = !showArchive;
                                    }}
                                >
                                    <svg
                                        width="11"
                                        height="11"
                                        viewBox="0 0 11 11"
                                        fill="none"
                                        ><rect
                                            x="0.5"
                                            y="2.5"
                                            width="10"
                                            height="8"
                                            rx="1"
                                            stroke="currentColor"
                                            stroke-width="1.1"
                                        /><path
                                            d="M0.5 4.5h10"
                                            stroke="currentColor"
                                            stroke-width="1.1"
                                        /><path
                                            d="M3.5 0.5h4"
                                            stroke="currentColor"
                                            stroke-width="1.1"
                                            stroke-linecap="round"
                                        /></svg
                                    >
                                    Архив
                                </button>
                                <!-- View mode -->
                                <div
                                    class="flex overflow-hidden rounded-[2px] border border-[#a08c5b]/20"
                                >
                                    <button
                                        class="cursor-pointer border-none px-[9px] py-[7px] transition-all {viewMode ===
                                        'list'
                                            ? 'bg-[rgba(201,168,76,0.1)] text-[#c9a84c]'
                                            : 'bg-transparent text-[#5a5040] hover:text-[#9a9080]'}"
                                        on:click={() => (viewMode = "list")}
                                        title="Список"
                                    >
                                        <svg
                                            width="14"
                                            height="11"
                                            viewBox="0 0 14 11"
                                            fill="none"
                                            ><path
                                                d="M1 1h12M1 5.5h12M1 10h12"
                                                stroke="currentColor"
                                                stroke-width="1.3"
                                                stroke-linecap="round"
                                            /></svg
                                        >
                                    </button>
                                    <button
                                        class="cursor-pointer border-l border-none border-[#a08c5b]/20 px-[9px] py-[7px] transition-all {viewMode ===
                                        'grid'
                                            ? 'bg-[rgba(201,168,76,0.1)] text-[#c9a84c]'
                                            : 'bg-transparent text-[#5a5040] hover:text-[#9a9080]'}"
                                        on:click={() => (viewMode = "grid")}
                                        title="Карточки"
                                    >
                                        <svg
                                            width="13"
                                            height="13"
                                            viewBox="0 0 13 13"
                                            fill="none"
                                            ><rect
                                                x="0.5"
                                                y="0.5"
                                                width="5"
                                                height="5"
                                                rx="0.5"
                                                stroke="currentColor"
                                                stroke-width="1.2"
                                            /><rect
                                                x="7.5"
                                                y="0.5"
                                                width="5"
                                                height="5"
                                                rx="0.5"
                                                stroke="currentColor"
                                                stroke-width="1.2"
                                            /><rect
                                                x="0.5"
                                                y="7.5"
                                                width="5"
                                                height="5"
                                                rx="0.5"
                                                stroke="currentColor"
                                                stroke-width="1.2"
                                            /><rect
                                                x="7.5"
                                                y="7.5"
                                                width="5"
                                                height="5"
                                                rx="0.5"
                                                stroke="currentColor"
                                                stroke-width="1.2"
                                            /></svg
                                        >
                                    </button>
                                </div>
                                <button
                                    class="cursor-pointer rounded-[2px] border border-[#c9a84c] bg-transparent px-4 py-[6px] font-['Jost'] text-[0.82rem] font-medium tracking-widest text-[#c9a84c] uppercase transition-all hover:bg-[#c9a84c] hover:text-[#111009]"
                                    on:click={() => goto("/admin/event/new")}
                                    >+ ДОБАВИТЬ</button
                                >
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Scrollable events content -->
                <div class="min-h-0 flex-1 overflow-y-auto">
                    <div class="mx-auto max-w-[1200px] px-8 py-4 pb-10">
                        {#if filteredEvents.length === 0}
                            <div
                                class="rounded-[3px] border border-dashed border-[#a08c5b]/15 py-16 text-center"
                            >
                                <p
                                    class="font-['Playfair_Display'] italic text-[#5a5040]"
                                >
                                    {showArchive
                                        ? "Архив пуст"
                                        : "Мероприятий не найдено"}
                                </p>
                            </div>
                        {:else if viewMode === "list"}
                            <div
                                class="overflow-visible rounded-[3px] border border-[#a08c5b]/12"
                            >
                                {#each filteredEvents as ev, i}
                                    <div
                                        class="border-[#a08c5b]/08 group relative flex cursor-pointer items-center gap-3 border-b bg-[#1a1810] px-4 py-[0.65rem] transition-colors last:border-b-0 hover:bg-[#1e1c12]"
                                        on:click={() => openEvent(ev)}
                                    >
                                        <!-- Index -->
                                        <span
                                            class="w-4 flex-shrink-0 text-right font-['Jost'] text-[0.6rem] text-[#c9a84c]/30 transition-colors group-hover:text-[#c9a84c]/60"
                                        >
                                            {String(i + 1).padStart(2, "0")}
                                        </span>

                                        <!-- Cover w-6 h-6 -->
                                        <div
                                            class="h-6 w-6 flex-shrink-0 overflow-hidden rounded-[2px] bg-[#222018]"
                                        >
                                            {#if ev.media?.cover}
                                                <img
                                                    src={ev.media.cover}
                                                    alt=""
                                                    class="h-full w-full object-cover"
                                                />
                                            {:else}
                                                <div
                                                    class="flex h-full w-full items-center justify-center text-[8px] text-[#c9a84c]/20"
                                                >
                                                    ✦
                                                </div>
                                            {/if}
                                        </div>

                                        <!-- Info -->
                                        <div
                                            class="flex min-w-0 flex-1 items-center gap-4"
                                        >
                                            <p
                                                class="truncate font-['Jost'] text-[0.86rem] text-[#e8e0d0]"
                                            >
                                                {ev.title}
                                            </p>
                                            {#if getCatLabel(ev)}
                                                <span
                                                    class="hidden flex-shrink-0 text-[0.58rem] tracking-widest text-[#c9a84c]/55 uppercase sm:block"
                                                    >{getCatLabel(ev)}</span
                                                >
                                            {/if}
                                            <span
                                                class="hidden flex-shrink-0 font-['Jost'] text-[0.73rem] text-[#5a5040] md:block"
                                            >
                                                {ev.schedule?.dates?.[0]
                                                    ? formatDate(
                                                          ev.schedule.dates[0],
                                                      )
                                                    : "—"}
                                            </span>
                                            <span
                                                class="hidden flex-shrink-0 text-[0.73rem] text-[#5a5040] lg:block"
                                                >{formatPrice(ev.pricing)}</span
                                            >
                                        </div>

                                        <!-- Status badge -->
                                        <span
                                            class="hidden flex-shrink-0 rounded-[2px] border px-2 py-[2px] text-[0.6rem] tracking-widest uppercase xl:inline"
                                            style="color:{statusColors[
                                                ev.status
                                            ]}; border-color:{statusColors[
                                                ev.status
                                            ]}44"
                                            >{statusLabels[ev.status] ??
                                                ev.status}</span
                                        >

                                        <!-- Right controls -->
                                        <div
                                            class="ml-1 flex flex-shrink-0 items-center gap-2"
                                            on:click|stopPropagation
                                        >
                                            {#if ev.status !== "archived"}
                                                <button
                                                    class="relative h-[18px] w-8 flex-shrink-0 cursor-pointer rounded-full border-none transition-all duration-200 {ev.status ===
                                                    'published'
                                                        ? 'bg-[#c9a84c]'
                                                        : 'bg-[#252318]'}"
                                                    on:click={(e) =>
                                                        toggleStatus(ev, e)}
                                                    title={ev.status ===
                                                    "published"
                                                        ? "Снять с публикации"
                                                        : "Опубликовать"}
                                                >
                                                    <span
                                                        class="absolute top-[2px] h-[13px] w-[13px] rounded-full bg-white shadow-sm transition-all duration-200 {ev.status ===
                                                        'published'
                                                            ? 'left-[17px]'
                                                            : 'left-[2px]'}"
                                                    ></span>
                                                </button>
                                            {/if}
                                            <div class="relative">
                                                <button
                                                    class="flex h-7 w-7 cursor-pointer items-center justify-center rounded-[2px] border-none bg-transparent text-[#4a4030] transition-all hover:bg-[rgba(201,168,76,0.08)] hover:text-[#c9a84c]"
                                                    on:click|stopPropagation={() => {
                                                        openMenuId =
                                                            openMenuId ===
                                                            ev._id
                                                                ? null
                                                                : ev._id;
                                                        sortOpen = false;
                                                        catFilterOpen = false;
                                                    }}
                                                >
                                                    <svg
                                                        width="3"
                                                        height="13"
                                                        viewBox="0 0 3 13"
                                                        fill="currentColor"
                                                    >
                                                        <circle
                                                            cx="1.5"
                                                            cy="1.5"
                                                            r="1.5"
                                                        />
                                                        <circle
                                                            cx="1.5"
                                                            cy="6.5"
                                                            r="1.5"
                                                        />
                                                        <circle
                                                            cx="1.5"
                                                            cy="11.5"
                                                            r="1.5"
                                                        />
                                                    </svg>
                                                </button>
                                                {#if openMenuId === ev._id}
                                                    <div
                                                        class="absolute top-full right-0 z-[9999] mt-1 min-w-[160px] overflow-hidden rounded-[3px] border border-[#a08c5b]/20 bg-[#1a1810] shadow-[0_12px_32px_rgba(0,0,0,0.75)]"
                                                        on:click|stopPropagation
                                                    >
                                                        <button
                                                            class="w-full cursor-pointer border-none bg-transparent px-4 py-[0.55rem] text-left font-['Jost'] text-[0.78rem] text-[#9a9080] transition-colors hover:bg-[rgba(201,168,76,0.06)] hover:text-[#e8e0d0]"
                                                            on:click={() => {
                                                                openMenuId =
                                                                    null;
                                                                goto(
                                                                    `/admin/event/${ev._id}`,
                                                                );
                                                            }}
                                                            >Редактировать</button
                                                        >
                                                        {#if ev.status !== "archived"}
                                                            <button
                                                                class="w-full cursor-pointer border-none bg-transparent px-4 py-[0.55rem] text-left font-['Jost'] text-[0.78rem] text-[#9a9080] transition-colors hover:bg-[rgba(201,168,76,0.06)] hover:text-[#e8e0d0]"
                                                                on:click={() =>
                                                                    archiveEvent(
                                                                        ev,
                                                                    )}
                                                                >В архив</button
                                                            >
                                                        {/if}
                                                        <div
                                                            class="border-t border-[#a08c5b]/10"
                                                        ></div>
                                                        <button
                                                            class="w-full cursor-pointer border-none bg-transparent px-4 py-[0.55rem] text-left font-['Jost'] text-[0.78rem] text-[#c0392b] transition-colors hover:bg-[rgba(192,57,43,0.08)]"
                                                            on:click={() =>
                                                                confirmDeleteEvent(
                                                                    ev,
                                                                )}
                                                            >Удалить</button
                                                        >
                                                    </div>
                                                {/if}
                                            </div>
                                        </div>
                                    </div>
                                {/each}
                            </div>
                        {:else}
                            <!-- Grid -->
                            <div
                                class="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-4"
                            >
                                {#each filteredEvents as ev}
                                    <article
                                        class="cursor-pointer overflow-hidden rounded-[3px] border border-[#a08c5b]/12 bg-[#1a1810] transition-all duration-300 hover:-translate-y-[2px] hover:border-[rgba(201,168,76,0.35)]"
                                        on:click={() => openEvent(ev)}
                                    >
                                        <div
                                            class="relative aspect-video overflow-hidden bg-[#222018]"
                                        >
                                            {#if ev.media?.cover}
                                                <img
                                                    src={ev.media.cover}
                                                    alt={ev.title}
                                                    class="h-full w-full object-cover"
                                                />
                                            {:else}
                                                <div
                                                    class="flex h-full w-full items-center justify-center text-3xl text-[rgba(201,168,76,0.15)]"
                                                >
                                                    ✦
                                                </div>
                                            {/if}
                                            <div class="absolute top-2 right-2">
                                                <span
                                                    class="rounded-[2px] bg-[rgba(17,16,9,0.85)] px-2 py-[2px] text-[0.6rem] tracking-widest uppercase"
                                                    style="color:{statusColors[
                                                        ev.status
                                                    ]}"
                                                    >{statusLabels[ev.status] ??
                                                        ev.status}</span
                                                >
                                            </div>
                                        </div>
                                        <div class="p-4">
                                            {#if getCatLabel(ev)}
                                                <p
                                                    class="mb-1 text-[0.6rem] tracking-widest text-[#c9a84c]/70 uppercase"
                                                >
                                                    {getCatLabel(ev)}
                                                </p>
                                            {/if}
                                            <h3
                                                class="mb-3 line-clamp-2 font-['Playfair_Display'] text-[1rem] font-bold leading-[1.3] text-[#f0e8d5]"
                                            >
                                                {ev.title}
                                            </h3>
                                            <div
                                                class="flex items-center justify-between border-t border-[#a08c5b]/12 pt-3"
                                            >
                                                <span
                                                    class="font-['Playfair_Display'] text-[0.78rem] text-[#c9a84c]"
                                                    >{formatPrice(
                                                        ev.pricing,
                                                    )}</span
                                                >
                                                <div
                                                    class="flex items-center gap-2"
                                                    on:click|stopPropagation
                                                >
                                                    {#if ev.status !== "archived"}
                                                        <button
                                                            class="relative h-[18px] w-8 flex-shrink-0 cursor-pointer rounded-full border-none transition-all duration-200 {ev.status ===
                                                            'published'
                                                                ? 'bg-[#c9a84c]'
                                                                : 'bg-[#252318]'}"
                                                            on:click={(e) =>
                                                                toggleStatus(
                                                                    ev,
                                                                    e,
                                                                )}
                                                        >
                                                            <span
                                                                class="absolute top-[2px] h-[13px] w-[13px] rounded-full bg-white shadow-sm transition-all duration-200 {ev.status ===
                                                                'published'
                                                                    ? 'left-[17px]'
                                                                    : 'left-[2px]'}"
                                                            ></span>
                                                        </button>
                                                    {/if}
                                                    <div
                                                        class="relative"
                                                        on:click|stopPropagation
                                                    >
                                                        <button
                                                            class="flex h-6 w-6 cursor-pointer items-center justify-center rounded-[2px] border-none bg-transparent text-[#4a4030] transition-all hover:text-[#c9a84c]"
                                                            on:click={() => {
                                                                openMenuId =
                                                                    openMenuId ===
                                                                    ev._id
                                                                        ? null
                                                                        : ev._id;
                                                            }}
                                                        >
                                                            <svg
                                                                width="3"
                                                                height="11"
                                                                viewBox="0 0 3 11"
                                                                fill="currentColor"
                                                                ><circle
                                                                    cx="1.5"
                                                                    cy="1.5"
                                                                    r="1.3"
                                                                /><circle
                                                                    cx="1.5"
                                                                    cy="5.5"
                                                                    r="1.3"
                                                                /><circle
                                                                    cx="1.5"
                                                                    cy="9.5"
                                                                    r="1.3"
                                                                /></svg
                                                            >
                                                        </button>
                                                        {#if openMenuId === ev._id}
                                                            <div
                                                                class="absolute top-full right-0 z-[9999] mt-1 min-w-[160px] overflow-hidden rounded-[3px] border border-[#a08c5b]/20 bg-[#1a1810] shadow-[0_12px_32px_rgba(0,0,0,0.75)]"
                                                                on:click|stopPropagation
                                                            >
                                                                <button
                                                                    class="w-full cursor-pointer border-none bg-transparent px-4 py-[0.55rem] text-left font-['Jost'] text-[0.78rem] text-[#9a9080] transition-colors hover:bg-[rgba(201,168,76,0.06)] hover:text-[#e8e0d0]"
                                                                    on:click={() => {
                                                                        openMenuId =
                                                                            null;
                                                                        goto(
                                                                            `/admin/event/${ev._id}`,
                                                                        );
                                                                    }}
                                                                    >Редактировать</button
                                                                >
                                                                {#if ev.status !== "archived"}
                                                                    <button
                                                                        class="w-full cursor-pointer border-none bg-transparent px-4 py-[0.55rem] text-left font-['Jost'] text-[0.78rem] text-[#9a9080] transition-colors hover:bg-[rgba(201,168,76,0.06)] hover:text-[#e8e0d0]"
                                                                        on:click={() =>
                                                                            archiveEvent(
                                                                                ev,
                                                                            )}
                                                                        >В архив</button
                                                                    >
                                                                {/if}
                                                                <div
                                                                    class="border-t border-[#a08c5b]/10"
                                                                ></div>
                                                                <button
                                                                    class="w-full cursor-pointer border-none bg-transparent px-4 py-[0.55rem] text-left font-['Jost'] text-[0.78rem] text-[#c0392b] transition-colors hover:bg-[rgba(192,57,43,0.08)]"
                                                                    on:click={() =>
                                                                        confirmDeleteEvent(
                                                                            ev,
                                                                        )}
                                                                    >Удалить</button
                                                                >
                                                            </div>
                                                        {/if}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </article>
                                {/each}
                            </div>
                        {/if}
                    </div>
                </div>
            </div>

            <!-- ════════════════════════════════════════════════════════════════════════ -->
            <!-- TAB: CATEGORIES -->
            <!-- ════════════════════════════════════════════════════════════════════════ -->
        {:else}
            <div class="flex min-h-0 flex-1 flex-col">
                <!-- Sticky categories toolbar -->
                <div
                    class="flex-shrink-0 border-b border-[#a08c5b]/10 bg-[#111009] shadow-[0_2px_16px_rgba(0,0,0,0.4)] z-30"
                >
                    <div class="mx-auto max-w-[1200px] px-8 py-3">
                        <div class="flex items-center justify-between gap-3">
                            <!-- Left: sort -->
                            <div class="flex items-center gap-2">
                                <div
                                    class="relative z-[50]"
                                    on:click|stopPropagation
                                >
                                    <button
                                        class="inline-flex cursor-pointer items-center gap-2 rounded-[2px] border px-3 py-[6px] font-['Jost'] text-[0.7rem] font-medium tracking-widest uppercase transition-all {catSortOpen
                                            ? 'border-[#c9a84c] bg-[rgba(201,168,76,0.05)] text-[#c9a84c]'
                                            : 'border-[#a08c5b]/25 bg-transparent text-[#9a9080] hover:border-[#c9a84c] hover:text-[#c9a84c]'}"
                                        on:click={() => {
                                            catSortOpen = !catSortOpen;
                                        }}
                                    >
                                        <svg
                                            width="11"
                                            height="11"
                                            viewBox="0 0 12 12"
                                            fill="none"
                                            ><path
                                                d="M1 3h10M3 6h6M5 9h2"
                                                stroke="currentColor"
                                                stroke-width="1.2"
                                                stroke-linecap="round"
                                            /></svg
                                        >
                                        Сортировка
                                        {#if catSortBy !== "default"}
                                            <span
                                                class="rounded-[2px] bg-[#c9a84c] px-[5px] py-[1px] text-[0.58rem] leading-none text-[#111009]"
                                                >✓</span
                                            >
                                        {/if}
                                        <svg
                                            width="7"
                                            height="5"
                                            viewBox="0 0 8 5"
                                            fill="none"
                                            class="transition-transform {catSortOpen
                                                ? 'rotate-180'
                                                : ''}"
                                            ><path
                                                d="M1 1l3 3 3-3"
                                                stroke="currentColor"
                                                stroke-width="1.2"
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                            /></svg
                                        >
                                    </button>
                                    {#if catSortOpen}
                                        <div
                                            class="absolute top-full left-0 mt-1 min-w-[180px] overflow-hidden rounded-[3px] border border-[#a08c5b]/20 bg-[#1a1810] shadow-[0_12px_32px_rgba(0,0,0,0.7)] z-[9999]"
                                        >
                                            {#each Object.entries(catSortLabels) as [key, label]}
                                                <button
                                                    class="w-full cursor-pointer border-none px-4 py-[0.55rem] text-left font-['Jost'] text-[0.78rem] transition-colors {catSortBy ===
                                                    key
                                                        ? 'bg-[rgba(201,168,76,0.08)] text-[#c9a84c]'
                                                        : 'bg-transparent text-[#9a9080] hover:bg-[rgba(201,168,76,0.04)] hover:text-[#e8e0d0]'}"
                                                    on:click={() => {
                                                        catSortBy = key;
                                                        catSortOpen = false;
                                                    }}>{label}</button
                                                >
                                            {/each}
                                        </div>
                                    {/if}
                                </div>

                                <span
                                    class="font-['Jost'] text-[0.62rem] tracking-widest uppercase text-[#5a5040] border border-[#a08c5b]/20 px-[6px] py-[2px] rounded-[2px]"
                                >
                                    {categories.length}
                                </span>
                            </div>

                            <!-- Right: add -->
                            <button
                                class="cursor-pointer rounded-[2px] border border-[#c9a84c] bg-transparent px-4 py-[6px] font-['Jost'] text-[0.82rem] font-medium tracking-widest text-[#c9a84c] uppercase transition-all hover:bg-[#c9a84c] hover:text-[#111009]"
                                on:click={openCreateCategory}
                            >
                                <span class="text-sm leading-none">+</span> Добавить
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Scrollable categories list -->
                <div class="min-h-0 flex-1 overflow-y-auto">
                    <div class="mx-auto max-w-[1200px] px-8 py-4 pb-10">
                        {#if sortedCategories.length === 0}
                            <div
                                class="rounded-[3px] border border-dashed border-[#a08c5b]/15 py-16 text-center"
                            >
                                <p
                                    class="font-['Playfair_Display'] italic text-[#5a5040]"
                                >
                                    Категорий пока нет
                                </p>
                            </div>
                        {:else}
                            <div
                                class="overflow-hidden rounded-[3px] border border-[#a08c5b]/12"
                            >
                                {#each sortedCategories as cat, i}
                                    <div
                                        class="flex items-center justify-between border-b border-[#a08c5b]/08 bg-[#1a1810] px-4 py-[0.7rem] last:border-b-0 group transition-colors hover:bg-[#1e1c12]"
                                    >
                                        <div class="flex items-center gap-3">
                                            <span
                                                class="w-5 flex-shrink-0 text-right font-['Jost'] text-[0.6rem] text-[#c9a84c]/30"
                                            >
                                                {String(i + 1).padStart(2, "0")}
                                            </span>
                                            <span
                                                class="font-['Jost'] text-[0.88rem] text-[#e8e0d0]"
                                                >{cat.label}</span
                                            >
                                        </div>
                                        <div
                                            class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <button
                                                class="cursor-pointer border-none bg-transparent px-2 py-[3px] font-['Jost'] text-[0.65rem] tracking-widest text-[#9a9080] uppercase transition-colors hover:text-[#c9a84c]"
                                                on:click={() =>
                                                    openEditCategory(cat)}
                                                >Изменить</button
                                            >
                                            <span class="text-[#a08c5b]/20"
                                                >|</span
                                            >
                                            <button
                                                class="cursor-pointer border-none bg-transparent px-2 py-[3px] font-['Jost'] text-[0.65rem] tracking-widest text-[#9a9080] uppercase transition-colors hover:text-[#c0392b]"
                                                on:click={() =>
                                                    confirmDeleteCategory(cat)}
                                                >Удалить</button
                                            >
                                        </div>
                                    </div>
                                {/each}
                            </div>
                        {/if}
                    </div>
                </div>
            </div>
        {/if}
    {/if}
</div>
