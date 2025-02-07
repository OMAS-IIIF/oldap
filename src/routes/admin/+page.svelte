<script lang="ts">

	import { userStore } from '$lib/stores/user';
	import type { InProject, OldapUser } from '$lib/oldap/classes/user';
	import { projectStore } from '$lib/stores/project';
	import type { OldapProject } from '$lib/oldap/classes/project';
	import { AdminPermission } from '$lib/oldap/enums/admin_permissions';
	import { TabItem, Tabs } from 'flowbite-svelte';
	import UsersList from '$lib/components/UsersList.svelte';
	import * as m from '$lib/paraglide/messages.js'

	let user: OldapUser | null = $state(null);
	let project: OldapProject | null = $state(null);
	let projects_open = $state(false);
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
			if (user?.isRoot) {
				pp.add(m.users());
				pp.add(m.kwlists());
				pp.add(m.datamodel());
				pp.add(m.permissions());
			}
			else {
				res2.permissions.forEach((x) => {
					switch (x) {
						case AdminPermission.ADMIN_USERS: pp.add(m.users()); break;
						case AdminPermission.ADMIN_LISTS: pp.add(m.kwlists()); break;
						case AdminPermission.ADMIN_MODEL: pp.add(m.datamodel()); break;
						case AdminPermission.ADMIN_PERMISSION_SETS: pp.add(m.permissions()); break;
					}
				});
			}

		}
		return pp;
	});

	userStore.subscribe(async (newuser: OldapUser | null) => {
		user = newuser;
	});

	projectStore.subscribe((newproject: OldapProject | null) => {
		project = newproject;
	});


</script>
<Tabs tabStyle="underline">
	{#if user?.isRoot}
		<TabItem bind:open={projects_open} title={m.projects()}>
			Show projects here...
		</TabItem>
	{/if}
	{#each perms as perm}
		{#if perm === m.users()}
			<TabItem bind:open={users_open} title={perm}>
				<UsersList project={project} />
			</TabItem>
		{:else if perm === m.kwlists()}
			<TabItem open={lists_open} title={perm}>
				Show here keyword lists
			</TabItem>
		{:else if perm === m.datamodel()}
			<TabItem open={datamodel_open} title={perm}>
				Show the data model here
			</TabItem>
		{:else if perm === m.permissions()}
			<TabItem open={permissions_open} title={perm}>
				Show permission sets here
			</TabItem>
		{/if}
	{/each}
</Tabs>

