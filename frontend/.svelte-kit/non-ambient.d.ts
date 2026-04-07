
// this file is generated — do not edit it


declare module "svelte/elements" {
	export interface HTMLAttributes<T> {
		'data-sveltekit-keepfocus'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-noscroll'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-preload-code'?:
			| true
			| ''
			| 'eager'
			| 'viewport'
			| 'hover'
			| 'tap'
			| 'off'
			| undefined
			| null;
		'data-sveltekit-preload-data'?: true | '' | 'hover' | 'tap' | 'off' | undefined | null;
		'data-sveltekit-reload'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-replacestate'?: true | '' | 'off' | undefined | null;
	}
}

export {};


declare module "$app/types" {
	export interface AppTypes {
		RouteId(): "/" | "/admin" | "/admin/event" | "/admin/event/new" | "/admin/event/[id]";
		RouteParams(): {
			"/admin/event/[id]": { id: string }
		};
		LayoutParams(): {
			"/": { id?: string };
			"/admin": { id?: string };
			"/admin/event": { id?: string };
			"/admin/event/new": Record<string, never>;
			"/admin/event/[id]": { id: string }
		};
		Pathname(): "/" | "/admin" | "/admin/" | "/admin/event" | "/admin/event/" | "/admin/event/new" | "/admin/event/new/" | `/admin/event/${string}` & {} | `/admin/event/${string}/` & {};
		ResolvedPathname(): `${"" | `/${string}`}${ReturnType<AppTypes['Pathname']>}`;
		Asset(): "/robots.txt" | string & {};
	}
}