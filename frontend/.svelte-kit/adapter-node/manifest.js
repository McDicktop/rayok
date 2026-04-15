export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["robots.txt"]),
	mimeTypes: {".txt":"text/plain"},
	_: {
		client: {start:"_app/immutable/entry/start.BS_Tq_T0.js",app:"_app/immutable/entry/app.Dvd6YI8h.js",imports:["_app/immutable/entry/start.BS_Tq_T0.js","_app/immutable/chunks/_kE4jOlj.js","_app/immutable/chunks/mZvcjlJO.js","_app/immutable/chunks/CYEdg9S-.js","_app/immutable/chunks/BJAp15_u.js","_app/immutable/entry/app.Dvd6YI8h.js","_app/immutable/chunks/mZvcjlJO.js","_app/immutable/chunks/DrniCsS4.js","_app/immutable/chunks/C6QNU2rz.js","_app/immutable/chunks/BJAp15_u.js","_app/immutable/chunks/C8iDwiLx.js","_app/immutable/chunks/Brr9ymvw.js","_app/immutable/chunks/CYEdg9S-.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:false},
		nodes: [
			__memo(() => import('./nodes/0.js')),
			__memo(() => import('./nodes/1.js')),
			__memo(() => import('./nodes/2.js')),
			__memo(() => import('./nodes/3.js')),
			__memo(() => import('./nodes/4.js')),
			__memo(() => import('./nodes/5.js'))
		],
		remotes: {
			
		},
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 2 },
				endpoint: null
			},
			{
				id: "/admin",
				pattern: /^\/admin\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 3 },
				endpoint: null
			},
			{
				id: "/admin/event/new",
				pattern: /^\/admin\/event\/new\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 5 },
				endpoint: null
			},
			{
				id: "/admin/event/[id]",
				pattern: /^\/admin\/event\/([^/]+?)\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,], errors: [1,], leaf: 4 },
				endpoint: null
			}
		],
		prerendered_routes: new Set([]),
		matchers: async () => {
			
			return {  };
		},
		server_assets: {}
	}
}
})();

export const prerendered = new Set([]);

export const base = "";