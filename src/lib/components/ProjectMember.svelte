<script lang="ts">
	import { AdminPermission } from '$lib/oldap/enums/admin_permissions';

	/**
	 * @prop {OldapUser} current_user The currently logged in user
	 * @prop {OldapProject} current_project The current project of the projects the user is member of
	 * @prop {boolean} isRoot True, if the user is member of oldap:SystemProject hand has AdminPermission.ADMIN_OLDAP
	 * @prop {user} user The user that should be edited. Is null, if a new user should be added
	 */
	let { current_user, current_project, isRoot, user } = $props();

	import { Accordion, AccordionItem, Button, Checkbox, Dropdown, Radio } from 'flowbite-svelte';
	import { apiClient } from '$lib/shared/apiClient';
	import type { AuthInfo } from '$lib/interfaces/authinfo';
	import { errorInfoStore } from '$lib/stores/errorinfo';
	import { Severity } from '$lib/interfaces/errorinfo';
	import * as m from '$lib/paraglide/messages.js'
	import type { InProject } from '$lib/oldap/classes/user';


	const authinfo_json = sessionStorage.getItem('authinfo')
	let authinfo: AuthInfo;
	let projectShortNames: string[] = $state([]);
	let current_user_permissions: AdminPermission[] = $state([]);

	current_user.inProject.forEach((item: InProject) => {
		console.log(":::::::::>:>>>>>>>", item)
		if (item.project.toString() === current_project.projectIri.toString()) {
			current_user_permissions = item.permissions;
		}
	});


	if (authinfo_json) {
		authinfo = JSON.parse(authinfo_json);
		if (isRoot) {
			const all_projects_config = {
				headers: {
					'Accept': 'application/json',
					'Authorization': 'Bearer ' + authinfo.token,
				},
			}
			apiClient.getAdminprojectsearch(all_projects_config)
				.then((res) => {
					res.forEach(data => {
						if (data.length > 1 && data[1] !== undefined) {
							projectShortNames.push(data[1]);
						}
					});
				})
				.catch((err) => {
					console.log(err);
				});
		}
		else {
			projectShortNames.push(current_project.projectShortName);
		}
	}
	else {
		errorInfoStore.set({
			errormsg: m.userdata_corrupted(),
			errorcode: 500,
			severity: Severity.ERROR,
		});
	}

</script>


<Accordion>
	{#each projectShortNames as shortname}
		<AccordionItem paddingDefault="p-1 px-2">
			<span slot="header">{shortname}</span>
			{#if isRoot ||  current_user_permissions.includes(AdminPermission.ADMIN_USERS)}
				<Checkbox>Users</Checkbox>
			{/if}
			{#if isRoot ||  current_user_permissions.includes(AdminPermission.ADMIN_LISTS)}
				<Checkbox>Lists</Checkbox>
			{/if}
			{#if isRoot || current_user_permissions.includes(AdminPermission.ADMIN_RESOURCES)}
				<Checkbox>Resources</Checkbox>
			{/if}
			{#if isRoot || current_user_permissions.includes(AdminPermission.ADMIN_PERMISSION_SETS)}
				<Checkbox>PermissionSets</Checkbox>
			{/if}
			{#if isRoot || current_user_permissions.includes(AdminPermission.ADMIN_MODEL)}
				<Checkbox>Datamodel</Checkbox>
			{/if}
			{#if isRoot || current_user_permissions.includes(AdminPermission.ADMIN_CREATE)}
				<Checkbox>Create</Checkbox>
			{/if}
			{#if isRoot}
				<Checkbox>System</Checkbox>
			{/if}
		</AccordionItem>
		{/each}
</Accordion>
