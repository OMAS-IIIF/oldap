<script>
	import { availableLanguageTags, languageTag } from "$lib/paraglide/runtime.js"
	//import { i18n } from '$lib/i18n.js'
	import { page } from '$app/state';
	import { i18n } from '$lib/i18n';
	import { Dropdown, DropdownItem, NavLi } from 'flowbite-svelte';
	import { ChevronDownOutline } from 'flowbite-svelte-icons';
	import * as m from '$lib/paraglide/messages.js'

	let current_lang = $state(languageTag());
</script>

<NavLi class="cursor-pointer">
	{m.lang()}: {current_lang}<ChevronDownOutline class="w-6 h-6 ms-2 text-primary-800 dark:text-white inline" />
</NavLi>

<Dropdown class="w-44 p-1 space-y-0 text-sm">
	{#each availableLanguageTags as lang}
		<!-- the hreflang attribute decides which language the link points to -->
		<DropdownItem href={i18n.route(page.url.pathname)}
									hreflang={lang} aria-current={lang === languageTag() ? "page" : undefined}
									class="text-xs p-1 m-0"
									onclick={() => {current_lang = languageTag()}}
		>
			{lang}
		</DropdownItem>
	{/each}
</Dropdown>
