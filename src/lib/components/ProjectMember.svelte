<script lang="ts">
	import { AdminPermission } from '$lib/oldap/enums/admin_permissions';

	/**
	 * @prop {OldapUser} current_user The currently logged in user
	 * @prop {OldapProject} current_project The current project of the projects the user is member of
	 * @prop {boolean} isRoot True, if the user is member of oldap:SystemProject hand has AdminPermission.ADMIN_OLDAP
	 * @prop {user} user The user that should be edited. Is null, if a new user should be added
	 */
	let { current_user, current_project, isRoot, user } = $props();

	import { Accordion, AccordionItem, Button, Checkbox, Dropdown, Radio, Tooltip } from 'flowbite-svelte';
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

	let perm_users_disabled = $derived(!(isRoot || current_user_permissions.includes(AdminPermission.ADMIN_USERS)));
	let perm_lists_disabled = $derived(!(isRoot || current_user_permissions.includes(AdminPermission.ADMIN_LISTS)));
	let perm_resources_disabled = $derived(!(isRoot || current_user_permissions.includes(AdminPermission.ADMIN_RESOURCES)));
	let perm_permissions_disabled = $derived(!(isRoot || current_user_permissions.includes(AdminPermission.ADMIN_PERMISSION_SETS)));
	let perm_model_disabled = $derived(!(isRoot || current_user_permissions.includes(AdminPermission.ADMIN_MODEL)));
	let perm_create_disabled = $derived(!(isRoot || current_user_permissions.includes(AdminPermission.ADMIN_CREATE)));

	current_user.inProject.forEach((item: InProject) => {
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

<Accordion activeClass="bg-blue-100 dark:bg-gray-800 text-blue-600 dark:text-white focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-800" inactiveClass="text-gray-500 dark:text-gray-400 hover:bg-blue-100 dark:hover:bg-gray-800">
	{#each projectShortNames as shortname}
		<AccordionItem paddingDefault="p-1 px-2">
			<span slot="header">{shortname}</span>
			<Checkbox disabled={perm_users_disabled}>{m.perm_user()}</Checkbox>
			<Tooltip class="text-xs">{m.perm_user_tip()}</Tooltip>

			<Checkbox disabled={perm_lists_disabled}>{m.perm_lists()}</Checkbox>
			<Tooltip class="text-xs">{m.perm_lists_tip()}</Tooltip>

			<Checkbox disabled={perm_resources_disabled}>{m.perm_resources()}</Checkbox>
			<Tooltip class="text-xs">{m.perm_resources_tip()}</Tooltip>

			<Checkbox disabled={perm_permissions_disabled}>{m.perm_permissions()}</Checkbox>
			<Tooltip class="text-xs">{m.perm_permissions_tip()}</Tooltip>

			<Checkbox disabled={perm_model_disabled}>{m.perm_model()}</Checkbox>
			<Tooltip class="text-xs">{m.perm_model_tip()}</Tooltip>

			<Checkbox disabled={perm_create_disabled}>{m.perm_create()}</Checkbox>
			<Tooltip class="text-xs">{m.perm_create_tip()}</Tooltip>

			<Checkbox disabled={!isRoot}>{m.perm_system()}</Checkbox>
			<Tooltip class="text-xs">{m.perm_system_tip()}</Tooltip>
		</AccordionItem>
		{/each}
</Accordion>
