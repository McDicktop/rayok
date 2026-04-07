<script>
	import { onMount } from 'svelte';

	let categories = [];
	let submitting = false;
	let success = false;
	let formError = null;

	let title = '';
	let description = '';
	let category = '';
	let cancellationPolicy = '';
	let amount = 0;
	let bookingType = 'ticket';
	let ticketUrl = '';
	let maxParticipants = 10;
	let dates = [''];
	let durationMinutes = 60;
	let isApproximate = false;
	let ageMin = 0;
	let ageMax = 100;
	let requiresAdult = false;
	let orgName = '';
	let orgEmail = '';
	let orgPhone = '';
	let metaTitle = '';
	let metaDescription = '';
	let seoSlug = '';
	let coverFile = null;
	let galleryFiles = [];
	let coverPreview = null;
	let galleryPreviews = [];

	onMount(async () => {
		try {
			const res = await fetch('/api/event/category');
			categories = await res.json();
			if (categories.length) category = categories[0]._id;
		} catch {}
	});

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

	function addDate() { dates = [...dates, '']; }
	function removeDate(i) { dates = dates.filter((_, idx) => idx !== i); }
	function updateDate(i, val) { dates = dates.map((d, idx) => (idx === i ? val : d)); }

	async function handleSubmit() {
		formError = null;
		submitting = true;
		try {
			const fd = new FormData();
			fd.append('title', title);
			fd.append('description', description);
			fd.append('category', category);
			fd.append('cancellationPolicy', cancellationPolicy);
			fd.append('pricing', JSON.stringify({ amount: Number(amount) }));
			fd.append('booking', JSON.stringify({
				type: bookingType,
				maxParticipants: Number(maxParticipants),
				...(bookingType === 'ticket' ? { ticketUrl } : {})
			}));
			fd.append('schedule', JSON.stringify({ dates: dates.filter((d) => d.trim()) }));
			fd.append('duration', JSON.stringify({ minutes: Number(durationMinutes), isApproximate }));
			fd.append('restrictions', JSON.stringify({ ageMin: Number(ageMin), ageMax: Number(ageMax), requiresAdult }));
			fd.append('organizer', JSON.stringify({ name: orgName, email: orgEmail, phone: orgPhone }));
			fd.append('seo', JSON.stringify({ metaTitle, metaDescription, slug: seoSlug }));
			if (coverFile) fd.append('cover', coverFile);
			galleryFiles.forEach((f) => fd.append('gallery', f));

			const res = await fetch('/api/event', { method: 'POST', body: fd });
			const data = await res.json();
			if (!res.ok) {
				formError = data.message ?? 'Ошибка при создании мероприятия';
			} else {
				success = true;
			}
		} catch (e) {
			formError = 'Сетевая ошибка. Попробуйте снова.';
		} finally {
			submitting = false;
		}
	}

	// Shared input classes
	const inputCls = "bg-[#1a1810] border border-[#a08c5b]/20 rounded-[3px] text-[#e8e0d0] font-['Jost'] text-[0.95rem] font-light px-4 py-[0.7rem] outline-none w-full focus:border-[#c9a84c] focus:shadow-[0_0_0_3px_rgba(201,168,76,0.08)] placeholder-[#4a4535] transition-all";
	const labelCls = "text-[0.75rem] tracking-widest uppercase text-[#8a8070]";
</script>

<svelte:head>
	<title>Новое мероприятие — Студия</title>
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
	<link
		href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Jost:wght@300;400;500&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

<!-- Header -->
<header class="sticky top-0 z-[100] border-b border-[#a08c5b]/20 bg-[rgba(17,16,9,0.92)] backdrop-blur-[12px]">
	<div class="max-w-[900px] mx-auto px-8 flex items-center justify-between h-16">
		<div class="flex items-center gap-[10px]">
			<span class="text-[#c9a84c] text-xl">✦</span>
			<span class="font-['Playfair_Display'] text-xl tracking-[0.05em] text-[#e8e0d0]">Студия</span>
		</div>
		<nav>
			<a href="/" class="text-[0.8rem] tracking-widest uppercase text-[#9a9080] no-underline transition-colors hover:text-[#c9a84c]">
				← Мероприятия
			</a>
		</nav>
	</div>
</header>

<main class="max-w-[900px] mx-auto px-8 pb-20">
	{#if success}
		<!-- Success screen -->
		<div class="flex flex-col items-center justify-center min-h-[60vh] text-center gap-4">
			<div class="text-[3rem] text-[#c9a84c] mb-2">✦</div>
			<h2 class="font-['Playfair_Display'] text-3xl text-[#f0e8d5]">Мероприятие создано</h2>
			<p class="text-[#6a6050] text-[0.95rem]">Событие добавлено и ожидает публикации</p>
			<div class="flex gap-4 mt-6">
				<a href="/" class="font-['Jost'] text-xs font-medium tracking-widest uppercase no-underline px-8 py-[0.8rem] rounded-[3px] transition-all bg-transparent border border-[#a08c5b]/30 text-[#9a9080] hover:border-[#c9a84c] hover:text-[#c9a84c]">
					← К списку
				</a>
				<button
					class="font-['Jost'] text-xs font-medium tracking-widest uppercase px-8 py-[0.8rem] rounded-[3px] cursor-pointer border-none transition-all bg-[#c9a84c] text-[#111009] hover:bg-[#d4b35e]"
					on:click={() => { success = false; title = ''; description = ''; }}
				>Создать ещё</button>
			</div>
		</div>
	{:else}
		<!-- Form -->
		<div class="pt-14">
			<div class="mb-12">
				<p class="text-[0.72rem] tracking-[0.2em] uppercase text-[#c9a84c] mb-3">Администрирование</p>
				<h1 class="font-['Playfair_Display'] text-[clamp(2rem,4vw,3rem)] font-bold text-[#f0e8d5]">
					Новое мероприятие
				</h1>
				<div class="w-[60px] h-[2px] bg-gradient-to-r from-[#c9a84c] to-transparent mt-5"></div>
			</div>

			<form on:submit|preventDefault={handleSubmit} class="flex flex-col">

				<!-- 01 Основная информация -->
				<section class="py-10 border-b border-[#a08c5b]/10 flex flex-col gap-5 animate-[fadeUp_0.5s_ease_both]">
					<h3 class="font-['Playfair_Display'] text-[1.1rem] font-bold text-[#f0e8d5] flex items-center gap-3 mb-1">
						<span class="font-['Jost'] text-[0.7rem] tracking-[0.15em] text-[#c9a84c] border border-[rgba(201,168,76,0.3)] px-[7px] py-[2px] rounded-[2px]">01</span>
						Основная информация
					</h3>
					<div class="flex flex-col gap-2">
						<label class={labelCls} for="title">Название <span class="text-[#c9a84c]">*</span></label>
						<input id="title" class={inputCls} type="text" bind:value={title} placeholder="Мастер-класс по акварели" required />
					</div>
					<div class="flex flex-col gap-2">
						<label class={labelCls} for="desc">Описание <span class="text-[#c9a84c]">*</span></label>
						<textarea id="desc" class="{inputCls} resize-y min-h-[100px]" bind:value={description} placeholder="Расскажите об этом событии…" rows="5" required></textarea>
					</div>
					<div class="flex flex-wrap gap-5">
						<div class="flex flex-col gap-2 flex-1">
							<label class={labelCls} for="category">Категория <span class="text-[#c9a84c]">*</span></label>
							<select id="category" class="{inputCls} cursor-pointer" bind:value={category} required>
								{#each categories as cat}
									<option value={cat._id} class="bg-[#1a1810]">{cat.label}</option>
								{:else}
									<option disabled>Категории не найдены</option>
								{/each}
							</select>
						</div>
						<div class="flex flex-col gap-2 flex-1">
							<label class={labelCls} for="policy">Условия отмены</label>
							<input id="policy" class={inputCls} type="text" bind:value={cancellationPolicy} placeholder="Возврат за 24 часа" />
						</div>
					</div>
				</section>

				<!-- 02 Медиа -->
				<section class="py-10 border-b border-[#a08c5b]/10 flex flex-col gap-5">
					<h3 class="font-['Playfair_Display'] text-[1.1rem] font-bold text-[#f0e8d5] flex items-center gap-3 mb-1">
						<span class="font-['Jost'] text-[0.7rem] tracking-[0.15em] text-[#c9a84c] border border-[rgba(201,168,76,0.3)] px-[7px] py-[2px] rounded-[2px]">02</span>
						Медиа
					</h3>
					<div class="flex gap-5 flex-wrap">
						<!-- Cover -->
						<div class="flex flex-col gap-2 flex-1 min-w-[220px]">
							<label class={labelCls}>Обложка <span class="text-[#c9a84c]">*</span></label>
							<label
								class="flex items-center justify-center border border-dashed border-[#a08c5b]/30 rounded-[3px] min-h-[160px] cursor-pointer relative overflow-hidden transition-all hover:border-[#c9a84c] hover:bg-[rgba(201,168,76,0.03)] {coverPreview ? 'has-preview' : ''}"
								for="cover-input"
							>
								{#if coverPreview}
									<img src={coverPreview} alt="Cover preview" class="w-full h-full object-cover absolute inset-0" />
									<div class="absolute inset-0 bg-[rgba(17,16,9,0.6)] flex items-center justify-center text-[0.8rem] tracking-widest uppercase text-[#c9a84c] opacity-0 hover:opacity-100 transition-opacity">
										Заменить
									</div>
								{:else}
									<div class="flex flex-col items-center gap-[0.4rem] text-[#5a5040] text-center text-[0.85rem] pointer-events-none">
										<span class="text-2xl text-[rgba(201,168,76,0.4)]">⊕</span>
										<span>Загрузить обложку</span>
										<span class="text-[0.72rem] text-[#3a3525]">JPG, PNG, WEBP · до 10 MB</span>
									</div>
								{/if}
							</label>
							<input id="cover-input" type="file" accept="image/jpeg,image/png,image/webp" on:change={previewCover} class="hidden" />
						</div>

						<!-- Gallery -->
						<div class="flex flex-col gap-2 flex-1 min-w-[220px]">
							<label class={labelCls}>Галерея (до 5 фото)</label>
							<label class="flex items-center justify-center border border-dashed border-[#a08c5b]/30 rounded-[3px] min-h-[160px] cursor-pointer relative overflow-hidden transition-all hover:border-[#c9a84c] hover:bg-[rgba(201,168,76,0.03)]" for="gallery-input">
								{#if galleryPreviews.length}
									<div class="flex flex-wrap gap-1 p-2 w-full">
										{#each galleryPreviews as src}
											<img {src} alt="" class="w-[60px] h-[60px] object-cover rounded-[2px]" />
										{/each}
									</div>
								{:else}
									<div class="flex flex-col items-center gap-[0.4rem] text-[#5a5040] text-center text-[0.85rem] pointer-events-none">
										<span class="text-2xl text-[rgba(201,168,76,0.4)]">⊕</span>
										<span>Загрузить галерею</span>
										<span class="text-[0.72rem] text-[#3a3525]">Несколько файлов</span>
									</div>
								{/if}
							</label>
							<input id="gallery-input" type="file" accept="image/jpeg,image/png,image/webp" multiple on:change={previewGallery} class="hidden" />
						</div>
					</div>
				</section>

				<!-- 03 Расписание -->
				<section class="py-10 border-b border-[#a08c5b]/10 flex flex-col gap-5">
					<h3 class="font-['Playfair_Display'] text-[1.1rem] font-bold text-[#f0e8d5] flex items-center gap-3 mb-1">
						<span class="font-['Jost'] text-[0.7rem] tracking-[0.15em] text-[#c9a84c] border border-[rgba(201,168,76,0.3)] px-[7px] py-[2px] rounded-[2px]">03</span>
						Расписание
					</h3>
					<div class="flex flex-col gap-3">
						{#each dates as date, i}
							<div class="flex gap-3 items-center">
								<input
									class="{inputCls} flex-1 [color-scheme:dark]"
									type="datetime-local"
									value={date}
									on:input={(e) => updateDate(i, e.target.value)}
								/>
								{#if dates.length > 1}
									<button
										type="button"
										class="bg-transparent border border-[rgba(192,57,43,0.3)] text-[#c0392b] w-9 h-9 rounded-[3px] cursor-pointer text-[0.8rem] flex-shrink-0 transition-all hover:bg-[rgba(192,57,43,0.1)] hover:border-[#c0392b]"
										on:click={() => removeDate(i)}
									>✕</button>
								{/if}
							</div>
						{/each}
					</div>
					<button
						type="button"
						class="bg-transparent border border-dashed border-[#a08c5b]/30 text-[#9a9080] font-['Jost'] text-[0.82rem] tracking-[0.08em] px-4 py-2 rounded-[3px] cursor-pointer w-fit transition-all hover:border-[#c9a84c] hover:text-[#c9a84c]"
						on:click={addDate}
					>+ Добавить дату</button>
					{#if dates.length > 1}
						<p class="text-[0.78rem] text-[#5a5040] -mt-1">Несколько дат → абонемент. Только тип бронирования «ticket».</p>
					{/if}
				</section>

				<!-- 04 Длительность -->
				<section class="py-10 border-b border-[#a08c5b]/10 flex flex-col gap-5">
					<h3 class="font-['Playfair_Display'] text-[1.1rem] font-bold text-[#f0e8d5] flex items-center gap-3 mb-1">
						<span class="font-['Jost'] text-[0.7rem] tracking-[0.15em] text-[#c9a84c] border border-[rgba(201,168,76,0.3)] px-[7px] py-[2px] rounded-[2px]">04</span>
						Длительность
					</h3>
					<div class="flex flex-wrap gap-5">
						<div class="flex flex-col gap-2 flex-1">
							<label class={labelCls} for="dur-min">Минуты <span class="text-[#c9a84c]">*</span></label>
							<input id="dur-min" class={inputCls} type="number" min="15" max="1440" bind:value={durationMinutes} />
						</div>
						<div class="flex flex-col gap-2 flex-1 justify-end pb-[2px]">
							<label class="flex items-center gap-[0.6rem] cursor-pointer select-none">
								<input
									type="checkbox"
									bind:checked={isApproximate}
									class="appearance-none w-[18px] h-[18px] border border-[#a08c5b]/30 rounded-[2px] bg-[#1a1810] cursor-pointer relative flex-shrink-0 transition-all checked:bg-[#c9a84c] checked:border-[#c9a84c]"
								/>
								<span class="text-[0.88rem] text-[#9a9080]">Приблизительно</span>
							</label>
						</div>
					</div>
				</section>

				<!-- 05 Бронирование -->
				<section class="py-10 border-b border-[#a08c5b]/10 flex flex-col gap-5">
					<h3 class="font-['Playfair_Display'] text-[1.1rem] font-bold text-[#f0e8d5] flex items-center gap-3 mb-1">
						<span class="font-['Jost'] text-[0.7rem] tracking-[0.15em] text-[#c9a84c] border border-[rgba(201,168,76,0.3)] px-[7px] py-[2px] rounded-[2px]">05</span>
						Бронирование
					</h3>
					<div class="flex flex-wrap gap-5">
						<div class="flex flex-col gap-2 flex-1">
							<label class={labelCls}>Тип бронирования <span class="text-[#c9a84c]">*</span></label>
							<div class="flex gap-3">
								<label class="flex-1 flex flex-col gap-[2px] border rounded-[3px] px-4 py-[0.85rem] cursor-pointer transition-all {bookingType === 'ticket' ? 'border-[#c9a84c] bg-[rgba(201,168,76,0.05)]' : 'border-[#a08c5b]/20 hover:border-[#c9a84c]'}">
									<input type="radio" bind:group={bookingType} value="ticket" class="hidden" />
									<span class="text-[0.9rem] text-[#e8e0d0]">Билет</span>
									<span class="text-[0.75rem] text-[#6a6050]">По внешней ссылке</span>
								</label>
								<label class="flex-1 flex flex-col gap-[2px] border rounded-[3px] px-4 py-[0.85rem] cursor-pointer transition-all {bookingType === 'request' ? 'border-[#c9a84c] bg-[rgba(201,168,76,0.05)]' : 'border-[#a08c5b]/20 hover:border-[#c9a84c]'}">
									<input type="radio" bind:group={bookingType} value="request" class="hidden" />
									<span class="text-[0.9rem] text-[#e8e0d0]">Заявка</span>
									<span class="text-[0.75rem] text-[#6a6050]">Через форму</span>
								</label>
							</div>
						</div>
						<div class="flex flex-col gap-2 flex-1">
							<label class={labelCls} for="max-part">Макс. участников</label>
							<input id="max-part" class={inputCls} type="number" min="1" max="100" bind:value={maxParticipants} />
						</div>
					</div>
					{#if bookingType === 'ticket'}
						<div class="flex flex-col gap-2">
							<label class={labelCls} for="ticket-url">Ссылка на билет <span class="text-[#c9a84c]">*</span></label>
							<input id="ticket-url" class={inputCls} type="url" bind:value={ticketUrl} placeholder="https://…" />
						</div>
					{/if}
				</section>

				<!-- 06 Стоимость -->
				<section class="py-10 border-b border-[#a08c5b]/10 flex flex-col gap-5">
					<h3 class="font-['Playfair_Display'] text-[1.1rem] font-bold text-[#f0e8d5] flex items-center gap-3 mb-1">
						<span class="font-['Jost'] text-[0.7rem] tracking-[0.15em] text-[#c9a84c] border border-[rgba(201,168,76,0.3)] px-[7px] py-[2px] rounded-[2px]">06</span>
						Стоимость
					</h3>
					<div class="flex flex-col gap-2">
						<label class={labelCls} for="amount">Цена (₽)</label>
						<div class="relative">
							<span class="absolute left-4 top-1/2 -translate-y-1/2 text-[#c9a84c] pointer-events-none">₽</span>
							<input id="amount" class="{inputCls} pl-8" type="number" min="0" max="100000" bind:value={amount} />
						</div>
						{#if Number(amount) === 0}
							<p class="text-[0.78rem] text-[#c9a84c] -mt-1">Мероприятие будет отмечено как бесплатное</p>
						{/if}
					</div>
				</section>

				<!-- 07 Ограничения -->
				<section class="py-10 border-b border-[#a08c5b]/10 flex flex-col gap-5">
					<h3 class="font-['Playfair_Display'] text-[1.1rem] font-bold text-[#f0e8d5] flex items-center gap-3 mb-1">
						<span class="font-['Jost'] text-[0.7rem] tracking-[0.15em] text-[#c9a84c] border border-[rgba(201,168,76,0.3)] px-[7px] py-[2px] rounded-[2px]">07</span>
						Ограничения
					</h3>
					<div class="flex flex-wrap gap-5">
						<div class="flex flex-col gap-2 flex-1">
							<label class={labelCls} for="age-min">Возраст от</label>
							<input id="age-min" class={inputCls} type="number" min="0" max="100" bind:value={ageMin} />
						</div>
						<div class="flex flex-col gap-2 flex-1">
							<label class={labelCls} for="age-max">Возраст до</label>
							<input id="age-max" class={inputCls} type="number" min="0" max="100" bind:value={ageMax} />
						</div>
						<div class="flex flex-col gap-2 flex-1 justify-end pb-[2px]">
							<label class="flex items-center gap-[0.6rem] cursor-pointer select-none">
								<input type="checkbox" bind:checked={requiresAdult} class="appearance-none w-[18px] h-[18px] border border-[#a08c5b]/30 rounded-[2px] bg-[#1a1810] cursor-pointer relative flex-shrink-0 transition-all checked:bg-[#c9a84c] checked:border-[#c9a84c]" />
								<span class="text-[0.88rem] text-[#9a9080]">Только 18+</span>
							</label>
						</div>
					</div>
				</section>

				<!-- 08 Организатор -->
				<section class="py-10 border-b border-[#a08c5b]/10 flex flex-col gap-5">
					<h3 class="font-['Playfair_Display'] text-[1.1rem] font-bold text-[#f0e8d5] flex items-center gap-3 mb-1">
						<span class="font-['Jost'] text-[0.7rem] tracking-[0.15em] text-[#c9a84c] border border-[rgba(201,168,76,0.3)] px-[7px] py-[2px] rounded-[2px]">08</span>
						Организатор
					</h3>
					<div class="flex flex-wrap gap-5">
						<div class="flex flex-col gap-2 flex-1">
							<label class={labelCls} for="org-name">Имя</label>
							<input id="org-name" class={inputCls} type="text" bind:value={orgName} placeholder="Анна Смирнова" />
						</div>
						<div class="flex flex-col gap-2 flex-1">
							<label class={labelCls} for="org-email">Email</label>
							<input id="org-email" class={inputCls} type="email" bind:value={orgEmail} placeholder="anna@studio.ru" />
						</div>
						<div class="flex flex-col gap-2 flex-1">
							<label class={labelCls} for="org-phone">Телефон</label>
							<input id="org-phone" class={inputCls} type="tel" bind:value={orgPhone} placeholder="+7 900 000 00 00" />
						</div>
					</div>
				</section>

				<!-- 09 SEO -->
				<section class="py-10 border-b border-[#a08c5b]/10 flex flex-col gap-5">
					<h3 class="font-['Playfair_Display'] text-[1.1rem] font-bold text-[#f0e8d5] flex items-center gap-3 mb-1">
						<span class="font-['Jost'] text-[0.7rem] tracking-[0.15em] text-[#c9a84c] border border-[rgba(201,168,76,0.3)] px-[7px] py-[2px] rounded-[2px]">09</span>
						SEO
					</h3>
					<div class="flex flex-col gap-2">
						<label class={labelCls} for="meta-title">Meta Title</label>
						<input id="meta-title" class={inputCls} type="text" bind:value={metaTitle} placeholder="Мастер-класс акварель — Студия" />
					</div>
					<div class="flex flex-col gap-2">
						<label class={labelCls} for="meta-desc">Meta Description</label>
						<textarea id="meta-desc" class="{inputCls} resize-y min-h-[100px]" bind:value={metaDescription} rows="3" placeholder="Краткое описание для поисковиков…"></textarea>
					</div>
					<div class="flex flex-col gap-2">
						<label class={labelCls} for="seo-slug">Slug (URL)</label>
						<div class="flex">
							<span class="bg-[rgba(201,168,76,0.08)] border border-[#a08c5b]/20 border-r-0 rounded-l-[3px] px-[0.85rem] py-[0.7rem] text-[0.85rem] text-[#6a6050] whitespace-nowrap">
								/events/
							</span>
							<input id="seo-slug" class="{inputCls} rounded-l-none" type="text" bind:value={seoSlug} placeholder="master-klass-akvarell" />
						</div>
						<p class="text-[0.78rem] text-[#5a5040] -mt-1">Оставьте пустым — сгенерируется автоматически из названия</p>
					</div>
				</section>

				<!-- Error -->
				{#if formError}
					<div class="flex items-center gap-3 bg-[rgba(192,57,43,0.08)] border border-[rgba(192,57,43,0.3)] rounded-[3px] px-5 py-[0.9rem] text-[#e07060] text-[0.88rem] mt-6">
						<span>⚠</span>
						{formError}
					</div>
				{/if}

				<!-- Actions -->
				<div class="flex justify-end gap-4 pt-10">
					<a href="/" class="font-['Jost'] text-xs font-medium tracking-widest uppercase no-underline px-8 py-[0.8rem] rounded-[3px] transition-all bg-transparent border border-[#a08c5b]/30 text-[#9a9080] hover:border-[#c9a84c] hover:text-[#c9a84c]">
						Отмена
					</a>
					<button
						type="submit"
						class="font-['Jost'] text-xs font-medium tracking-widest uppercase px-8 py-[0.8rem] rounded-[3px] cursor-pointer border-none transition-all inline-flex items-center gap-2 bg-[#c9a84c] text-[#111009] hover:bg-[#d4b35e] disabled:opacity-50 disabled:cursor-not-allowed"
						disabled={submitting}
					>
						{#if submitting}
							<span class="w-[14px] h-[14px] border-2 border-[rgba(17,16,9,0.3)] border-t-[#111009] rounded-full animate-spin"></span>
							Создание…
						{:else}
							Создать мероприятие
						{/if}
					</button>
				</div>

			</form>
		</div>
	{/if}
</main>
