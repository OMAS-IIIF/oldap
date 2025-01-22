<script lang="ts">

	import { userStore } from '$lib/stores/user';
	import type { InProject, OldapUser } from '$lib/oldap/classes/user';
	import { projectStore } from '$lib/stores/project';
	import type { OldapProject } from '$lib/oldap/classes/project';
	import { AdminPermission } from '$lib/oldap/enums/admin_permissions';
	import { TabItem, Tabs } from 'flowbite-svelte';

	let user: OldapUser | null = $state(null);
	let project: OldapProject | null = $state(null);
	let perms = $derived.by(() => {
		console.log("===--->>", user);
		let res: InProject | undefined = undefined;
		user?.inProject?.forEach((inProject) => {
			if (inProject.project.toString() === project?.projectIri.toString()) {
				res = inProject;
			}
		});
		const pp: Set<string> = new Set<string>();

		if (res !== undefined) {
			res.permissions.forEach((x) => {
				switch (x) {
					case AdminPermission.ADMIN_USERS: pp.add("Users"); break;
					case AdminPermission.ADMIN_LISTS: pp.add("Lists"); break;
					case AdminPermission.ADMIN_MODEL: pp.add("Datamodel"); break;
					case AdminPermission.ADMIN_PERMISSION_SETS: pp.add("Permissions"); break;
					case AdminPermission.ADMIN_OLDAP: {
						pp.add("Users");
						pp.add("Lists");
						pp.add("Datamodel");
						pp.add("Permissions");
						break;
					}
				}
			});
		}
		return pp;
	});

	userStore.subscribe(async (newuser: OldapUser | null) => {
		user = newuser;
	});

	projectStore.subscribe((newproject: OldapProject | null) => {
		project = newproject;
	})

</script>
<Tabs>
	{#each perms as perm}
		<TabItem open title={perm}>
			gagagagagagagag agaga aga aga aga aga ag ga
		</TabItem>
	{/each}
</Tabs>

