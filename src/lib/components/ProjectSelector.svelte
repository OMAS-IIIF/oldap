<script lang="ts">
	import { ChevronDownOutline } from 'flowbite-svelte-icons';
	import { Dropdown, DropdownItem, NavLi } from 'flowbite-svelte';
	import { userStore } from '$lib/stores/user';
	import type { OldapUser } from '$lib/oldap/classes/oldap_user';

	let { projects } = $props();
	let project = $state('Project');
	let gaga: string[] | undefined = $state(undefined);
	userStore.subscribe((oldap_user: OldapUser | null) => {
		console.log("======>", oldap_user)
		if (oldap_user) {
			gaga = oldap_user.inProject?.map((x) => (x.project.toString()));
		}
	});
</script>

<NavLi class="cursor-pointer">
	{project}<ChevronDownOutline class="w-6 h-6 ms-2 text-primary-800 dark:text-white inline" />
</NavLi>
<Dropdown>
	{#each gaga as gugus}
		<DropdownItem>{gugus}</DropdownItem>
	{/each}
</Dropdown>