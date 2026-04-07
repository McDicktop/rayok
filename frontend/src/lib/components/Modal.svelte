<script>
	export let open = false;
	export let title = '';

	function close() {
		open = false;
	}
</script>

{#if open}
	<div
		class="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[200]"
		on:click={close}
	>
		<div
			class="bg-[#1a1810] border border-[#a08c5b]/20 rounded-[4px] p-8 max-w-[420px] w-[90%]"
			on:click|stopPropagation
		>
			<h3 class="font-['Playfair_Display'] text-xl text-[#f0e8d5] mb-3">{title}</h3>
			<slot />
		</div>
	</div>
{/if}
