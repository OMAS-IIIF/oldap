<script lang="ts">

	import { userStore } from '$lib/stores/user';
	import type { InProject, OldapUser } from '$lib/oldap/classes/user';
	import { projectStore } from '$lib/stores/project';
	import type { OldapProject } from '$lib/oldap/classes/project';
	import { AdminPermission } from '$lib/oldap/enums/admin_permissions';
	import { TabItem, Tabs } from 'flowbite-svelte';
	import UsersList from '$lib/components/UsersList.svelte';

	let user: OldapUser | null = $state(null);
	let project: OldapProject | null = $state(null);
	let users_open = $state(false);
	let lists_open = $state(false);
	let datamodel_open = $state(false);
	let permissions_open = $state(false)


	/**
	 * Executed if the variable "user" changes
	 */
	let perms = $derived.by(() => {
		let res: InProject | undefined = undefined;
		user?.inProject?.forEach((inProject) => {
			if (inProject.project.toString() === project?.projectIri.toString()) {
				res = inProject;
			}
		});
		const pp: Set<string> = new Set<string>();

		if (res !== undefined) {
			const res2 = res as InProject;
			res2.permissions.forEach((x) => {
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
<Tabs tabStyle="underline">
	{#each perms as perm}
		{#if perm === "Users"}
			<TabItem bind:open={users_open} title={perm}>
				<UsersList project={project} />
			</TabItem>
		{:else if perm === "Lists"}
			<TabItem open={lists_open} title={perm}>
				gagagagagagagag agaga aga aga aga aga ag ga
			</TabItem>
		{:else if perm === "Datamodel"}
			<TabItem open={datamodel_open} title={perm}>
				gagagagagagagag agaga aga aga aga aga ag ga
			</TabItem>
		{:else if perm === "Permissions"}
			<TabItem open={permissions_open} title={perm}>
				gagagagagagagag agaga aga aga aga aga ag ga
			</TabItem>
		{/if}
	{/each}
</Tabs>

