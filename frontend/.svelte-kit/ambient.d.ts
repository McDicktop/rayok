
// this file is generated — do not edit it


/// <reference types="@sveltejs/kit" />

/**
 * Environment variables [loaded by Vite](https://vitejs.dev/guide/env-and-mode.html#env-files) from `.env` files and `process.env`. Like [`$env/dynamic/private`](https://svelte.dev/docs/kit/$env-dynamic-private), this module cannot be imported into client-side code. This module only includes variables that _do not_ begin with [`config.kit.env.publicPrefix`](https://svelte.dev/docs/kit/configuration#env) _and do_ start with [`config.kit.env.privatePrefix`](https://svelte.dev/docs/kit/configuration#env) (if configured).
 * 
 * _Unlike_ [`$env/dynamic/private`](https://svelte.dev/docs/kit/$env-dynamic-private), the values exported from this module are statically injected into your bundle at build time, enabling optimisations like dead code elimination.
 * 
 * ```ts
 * import { API_KEY } from '$env/static/private';
 * ```
 * 
 * Note that all environment variables referenced in your code should be declared (for example in an `.env` file), even if they don't have a value until the app is deployed:
 * 
 * ```
 * MY_FEATURE_FLAG=""
 * ```
 * 
 * You can override `.env` values from the command line like so:
 * 
 * ```sh
 * MY_FEATURE_FLAG="enabled" npm run dev
 * ```
 */
declare module '$env/static/private' {
	export const VSCODE_CRASH_REPORTER_PROCESS_TYPE: string;
	export const NODE: string;
	export const INIT_CWD: string;
	export const VSCEXT_TRUSTIFY_DA_IMAGE_PLATFORM: string;
	export const SHELL: string;
	export const TMPDIR: string;
	export const HOMEBREW_REPOSITORY: string;
	export const npm_config_global_prefix: string;
	export const VSCEXT_TRUSTIFY_DA_SYFT_PATH: string;
	export const VSCEXT_TRUSTIFY_DA_PIP3_PATH: string;
	export const VSCEXT_TRUSTIFY_DA_PODMAN_PATH: string;
	export const MallocNanoZone: string;
	export const COLOR: string;
	export const npm_config_noproxy: string;
	export const npm_config_local_prefix: string;
	export const VSCEXT_TRUSTIFY_DA_SKOPEO_CONFIG_PATH: string;
	export const VSCEXT_TRUSTIFY_DA_BACKEND_URL: string;
	export const USER: string;
	export const VSCEXT_TRUSTIFY_DA_NPM_PATH: string;
	export const COMMAND_MODE: string;
	export const npm_config_globalconfig: string;
	export const VSCEXT_TRUSTIFY_DA_SYFT_CONFIG_PATH: string;
	export const SSH_AUTH_SOCK: string;
	export const VSCEXT_USE_GO_MVS: string;
	export const VSCEXT_TRACK_RECOMMENDATION_ACCEPTANCE_COMMAND: string;
	export const __CF_USER_TEXT_ENCODING: string;
	export const npm_execpath: string;
	export const VSCEXT_TRUSTIFY_DA_PREFER_GRADLEW: string;
	export const VSCEXT_TRUSTIFY_DA_PREFER_MVNW: string;
	export const VSCEXT_ENABLE_PYTHON_BEST_EFFORTS_INSTALLATION: string;
	export const ELECTRON_RUN_AS_NODE: string;
	export const VSCEXT_TRUSTIFY_DA_YARN_PATH: string;
	export const VSCEXT_STACK_ANALYSIS_COMMAND: string;
	export const PATH: string;
	export const VSCEXT_TRUSTIFY_DA_GRADLE_PATH: string;
	export const npm_package_json: string;
	export const npm_config_engine_strict: string;
	export const VSCEXT_MATCH_MANIFEST_VERSIONS: string;
	export const _: string;
	export const npm_config_userconfig: string;
	export const npm_config_init_module: string;
	export const WALLABY_PRODUCTION: string;
	export const VSCEXT_TRUSTIFY_DA_PYTHON3_PATH: string;
	export const VSCEXT_USE_PIP_DEP_TREE: string;
	export const __CFBundleIdentifier: string;
	export const npm_command: string;
	export const VSCEXT_TRUSTIFY_DA_DOCKER_PATH: string;
	export const PWD: string;
	export const VSCODE_HANDLES_UNCAUGHT_ERRORS: string;
	export const npm_lifecycle_event: string;
	export const EDITOR: string;
	export const VSCODE_ESM_ENTRYPOINT: string;
	export const npm_package_name: string;
	export const VSCEXT_TRUSTIFY_DA_PNPM_PATH: string;
	export const LANG: string;
	export const VSCEXT_PROXY_URL: string;
	export const npm_config_npm_version: string;
	export const XPC_FLAGS: string;
	export const VSCEXT_TRUSTIFY_DA_SKOPEO_PATH: string;
	export const VSCEXT_USE_PYTHON_VIRTUAL_ENVIRONMENT: string;
	export const VSCEXT_UTM_SOURCE: string;
	export const MACH_PORT_RENDEZVOUS_PEER_VALDATION: string;
	export const npm_config_node_gyp: string;
	export const VSCEXT_TRUSTIFY_DA_PIP_PATH: string;
	export const npm_package_version: string;
	export const VSCEXT_TRUSTIFY_DA_GO_PATH: string;
	export const XPC_SERVICE_NAME: string;
	export const VSCEXT_TRUSTIFY_DA_MVN_PATH: string;
	export const SHLVL: string;
	export const HOME: string;
	export const VSCODE_NLS_CONFIG: string;
	export const HOMEBREW_PREFIX: string;
	export const VSCEXT_TRUSTIFY_DA_MVN_ARGS: string;
	export const npm_config_cache: string;
	export const VSCEXT_TELEMETRY_ID: string;
	export const LOGNAME: string;
	export const npm_lifecycle_script: string;
	export const VSCODE_IPC_HOOK: string;
	export const VSCODE_CODE_CACHE_PATH: string;
	export const npm_config_package_lock_only: string;
	export const VSCEXT_TRUSTIFY_DA_PYTHON_PATH: string;
	export const npm_config_user_agent: string;
	export const VSCODE_PID: string;
	export const INFOPATH: string;
	export const HOMEBREW_CELLAR: string;
	export const OSLogRateLimit: string;
	export const VSCODE_L10N_BUNDLE_LOCATION: string;
	export const VSCEXT_VULNERABILITY_ALERT_SEVERITY: string;
	export const VSCODE_CWD: string;
	export const npm_node_execpath: string;
	export const npm_config_prefix: string;
}

/**
 * Similar to [`$env/static/private`](https://svelte.dev/docs/kit/$env-static-private), except that it only includes environment variables that begin with [`config.kit.env.publicPrefix`](https://svelte.dev/docs/kit/configuration#env) (which defaults to `PUBLIC_`), and can therefore safely be exposed to client-side code.
 * 
 * Values are replaced statically at build time.
 * 
 * ```ts
 * import { PUBLIC_BASE_URL } from '$env/static/public';
 * ```
 */
declare module '$env/static/public' {
	
}

/**
 * This module provides access to runtime environment variables, as defined by the platform you're running on. For example if you're using [`adapter-node`](https://github.com/sveltejs/kit/tree/main/packages/adapter-node) (or running [`vite preview`](https://svelte.dev/docs/kit/cli)), this is equivalent to `process.env`. This module only includes variables that _do not_ begin with [`config.kit.env.publicPrefix`](https://svelte.dev/docs/kit/configuration#env) _and do_ start with [`config.kit.env.privatePrefix`](https://svelte.dev/docs/kit/configuration#env) (if configured).
 * 
 * This module cannot be imported into client-side code.
 * 
 * ```ts
 * import { env } from '$env/dynamic/private';
 * console.log(env.DEPLOYMENT_SPECIFIC_VARIABLE);
 * ```
 * 
 * > [!NOTE] In `dev`, `$env/dynamic` always includes environment variables from `.env`. In `prod`, this behavior will depend on your adapter.
 */
declare module '$env/dynamic/private' {
	export const env: {
		VSCODE_CRASH_REPORTER_PROCESS_TYPE: string;
		NODE: string;
		INIT_CWD: string;
		VSCEXT_TRUSTIFY_DA_IMAGE_PLATFORM: string;
		SHELL: string;
		TMPDIR: string;
		HOMEBREW_REPOSITORY: string;
		npm_config_global_prefix: string;
		VSCEXT_TRUSTIFY_DA_SYFT_PATH: string;
		VSCEXT_TRUSTIFY_DA_PIP3_PATH: string;
		VSCEXT_TRUSTIFY_DA_PODMAN_PATH: string;
		MallocNanoZone: string;
		COLOR: string;
		npm_config_noproxy: string;
		npm_config_local_prefix: string;
		VSCEXT_TRUSTIFY_DA_SKOPEO_CONFIG_PATH: string;
		VSCEXT_TRUSTIFY_DA_BACKEND_URL: string;
		USER: string;
		VSCEXT_TRUSTIFY_DA_NPM_PATH: string;
		COMMAND_MODE: string;
		npm_config_globalconfig: string;
		VSCEXT_TRUSTIFY_DA_SYFT_CONFIG_PATH: string;
		SSH_AUTH_SOCK: string;
		VSCEXT_USE_GO_MVS: string;
		VSCEXT_TRACK_RECOMMENDATION_ACCEPTANCE_COMMAND: string;
		__CF_USER_TEXT_ENCODING: string;
		npm_execpath: string;
		VSCEXT_TRUSTIFY_DA_PREFER_GRADLEW: string;
		VSCEXT_TRUSTIFY_DA_PREFER_MVNW: string;
		VSCEXT_ENABLE_PYTHON_BEST_EFFORTS_INSTALLATION: string;
		ELECTRON_RUN_AS_NODE: string;
		VSCEXT_TRUSTIFY_DA_YARN_PATH: string;
		VSCEXT_STACK_ANALYSIS_COMMAND: string;
		PATH: string;
		VSCEXT_TRUSTIFY_DA_GRADLE_PATH: string;
		npm_package_json: string;
		npm_config_engine_strict: string;
		VSCEXT_MATCH_MANIFEST_VERSIONS: string;
		_: string;
		npm_config_userconfig: string;
		npm_config_init_module: string;
		WALLABY_PRODUCTION: string;
		VSCEXT_TRUSTIFY_DA_PYTHON3_PATH: string;
		VSCEXT_USE_PIP_DEP_TREE: string;
		__CFBundleIdentifier: string;
		npm_command: string;
		VSCEXT_TRUSTIFY_DA_DOCKER_PATH: string;
		PWD: string;
		VSCODE_HANDLES_UNCAUGHT_ERRORS: string;
		npm_lifecycle_event: string;
		EDITOR: string;
		VSCODE_ESM_ENTRYPOINT: string;
		npm_package_name: string;
		VSCEXT_TRUSTIFY_DA_PNPM_PATH: string;
		LANG: string;
		VSCEXT_PROXY_URL: string;
		npm_config_npm_version: string;
		XPC_FLAGS: string;
		VSCEXT_TRUSTIFY_DA_SKOPEO_PATH: string;
		VSCEXT_USE_PYTHON_VIRTUAL_ENVIRONMENT: string;
		VSCEXT_UTM_SOURCE: string;
		MACH_PORT_RENDEZVOUS_PEER_VALDATION: string;
		npm_config_node_gyp: string;
		VSCEXT_TRUSTIFY_DA_PIP_PATH: string;
		npm_package_version: string;
		VSCEXT_TRUSTIFY_DA_GO_PATH: string;
		XPC_SERVICE_NAME: string;
		VSCEXT_TRUSTIFY_DA_MVN_PATH: string;
		SHLVL: string;
		HOME: string;
		VSCODE_NLS_CONFIG: string;
		HOMEBREW_PREFIX: string;
		VSCEXT_TRUSTIFY_DA_MVN_ARGS: string;
		npm_config_cache: string;
		VSCEXT_TELEMETRY_ID: string;
		LOGNAME: string;
		npm_lifecycle_script: string;
		VSCODE_IPC_HOOK: string;
		VSCODE_CODE_CACHE_PATH: string;
		npm_config_package_lock_only: string;
		VSCEXT_TRUSTIFY_DA_PYTHON_PATH: string;
		npm_config_user_agent: string;
		VSCODE_PID: string;
		INFOPATH: string;
		HOMEBREW_CELLAR: string;
		OSLogRateLimit: string;
		VSCODE_L10N_BUNDLE_LOCATION: string;
		VSCEXT_VULNERABILITY_ALERT_SEVERITY: string;
		VSCODE_CWD: string;
		npm_node_execpath: string;
		npm_config_prefix: string;
		[key: `PUBLIC_${string}`]: undefined;
		[key: `${string}`]: string | undefined;
	}
}

/**
 * Similar to [`$env/dynamic/private`](https://svelte.dev/docs/kit/$env-dynamic-private), but only includes variables that begin with [`config.kit.env.publicPrefix`](https://svelte.dev/docs/kit/configuration#env) (which defaults to `PUBLIC_`), and can therefore safely be exposed to client-side code.
 * 
 * Note that public dynamic environment variables must all be sent from the server to the client, causing larger network requests — when possible, use `$env/static/public` instead.
 * 
 * ```ts
 * import { env } from '$env/dynamic/public';
 * console.log(env.PUBLIC_DEPLOYMENT_SPECIFIC_VARIABLE);
 * ```
 */
declare module '$env/dynamic/public' {
	export const env: {
		[key: `PUBLIC_${string}`]: string | undefined;
	}
}
