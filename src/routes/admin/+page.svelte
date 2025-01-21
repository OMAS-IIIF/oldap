<script lang="ts">

	import { userStore } from '$lib/stores/user';
	import type { InProject, OldapUser } from '$lib/oldap/classes/user';
	import { projectStore } from '$lib/stores/project';
	import type { OldapProject } from '$lib/oldap/classes/project';
	import { AdminPermission } from '$lib/oldap/enums/admin_permissions';
	import { TabItem, Tabs } from 'flowbite-svelte';

	let user: OldapUser | null;
	let perms: string[] = $state([]);


	userStore.subscribe(async (newuser: OldapUser | null) => {
		user = newuser;
	});


	projectStore.subscribe((newproject: OldapProject | null) => {
		if (newproject === null) return;
		//const ppp = user?.inProject?.find(x => x?.project?.toString() === newproject?.projectIri.toString());
		const results = user?.inProject?.filter(obj => obj.project.toString() === newproject?.projectIri.toString());
		//const ppp = newproject?.projectIri
		const oldap_perms = results && results.length == 1 ? results[0]?.permissions : [];
		if (oldap_perms) {
			oldap_perms.forEach((x) => {
				switch (x) {
					case AdminPermission.ADMIN_USERS: perms.push("Users"); break;
					case AdminPermission.ADMIN_LISTS: perms.push("Lists"); break;
					case AdminPermission.ADMIN_MODEL: perms.push("Datamodel"); break;
					case AdminPermission.ADMIN_PERMISSION_SETS: perms.push("Permissions"); break;
				}
			})
		}

	})

</script>
<Tabs>
	{#each perms as perm}
		<TabItem open title={perm}>
			gagagagagagagag agaga aga aga aga aga ag ga
		</TabItem>
	{/each}
</Tabs>

