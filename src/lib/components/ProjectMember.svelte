<script lang="ts">
	import { AdminPermission } from '$lib/oldap/enums/admin_permissions';

	/**
	 * @prop {OldapUser} current_user The currently logged in user
	 * @prop {OldapProject} current_project The current project of the projects the current user is member of
	 * @prop {boolean} isRoot True, if the user is member of oldap:SystemProject hand has AdminPermission.ADMIN_OLDAP
	 * @prop {user} user The user that should be edited. Is null, if a new user should be added
	 */
	let { current_user, current_project, isRoot, user } = $props();
	user = user as OldapUser;
	import { writable } from 'svelte/store';

	import {
		Accordion,
		AccordionItem,
		Button,
		Checkbox,
		Dropdown,
		Label,
		Radio, Select,
		Table,
		TableBody, TableBodyCell, TableBodyRow,
		Tooltip
	} from 'flowbite-svelte';
	import {
		ChevronDownOutline,
		UserOutline,
		ListOutline,
		ShieldCheckOutline,
		ObjectsColumnOutline,
		ShareNodesOutline,
		PlusOutline,
		StarOutline,
		TrashBinOutline
	} from 'flowbite-svelte-icons';
	import { apiClient } from '$lib/shared/apiClient';
	import type { AuthInfo } from '$lib/interfaces/authinfo';
	import { errorInfoStore } from '$lib/stores/errorinfo';
	import { Severity } from '$lib/interfaces/errorinfo';
	import * as m from '$lib/paraglide/messages.js'
	import { type InProject, OldapUser } from '$lib/oldap/classes/user';
	import type { Iri } from '$lib/oldap/types/xsd_iri';
	import type { OldapProject } from '$lib/oldap/classes/project';
	import { process_api_error } from '$lib/helpers/process_error';

	const authinfo_json = sessionStorage.getItem('authinfo')
	let authinfo: AuthInfo;
	let projectShortNames: string[] = $state([]);
	let current_user_permissions: AdminPermission[] = $state([]);
	let projects_available: {value: string, name: string}[] = $state([])
	let project_selected: string = $state('')

	let perm_users_disabled = $derived(!(isRoot || current_user_permissions.includes(AdminPermission.ADMIN_USERS)));
	let perm_lists_disabled = $derived(!(isRoot || current_user_permissions.includes(AdminPermission.ADMIN_LISTS)));
	let perm_resources_disabled = $derived(!(isRoot || current_user_permissions.includes(AdminPermission.ADMIN_RESOURCES)));
	let perm_permissions_disabled = $derived(!(isRoot || current_user_permissions.includes(AdminPermission.ADMIN_PERMISSION_SETS)));
	let perm_model_disabled = $derived(!(isRoot || current_user_permissions.includes(AdminPermission.ADMIN_MODEL)));
	let perm_create_disabled = $derived(!(isRoot || current_user_permissions.includes(AdminPermission.ADMIN_CREATE)));

	let perm_users_checked: Record<string, boolean> = $state({});
	let perm_lists_checked: Record<string, boolean> = $state({});
	let perm_resources_checked: Record<string, boolean> = $state({});
	let perm_permissions_checked: Record<string, boolean> = $state({});
	let perm_model_checked: Record<string, boolean> = $state({});
	let perm_create_checked: Record<string, boolean> = $state({});
	let perm_oldap_checked: Record<string, boolean> = $state({});


	/**
	 * Check if the given user has the given AdminPermission
	 * @param {OldapUser} user – The user we want to check permissions of
	 * @param {string} project_iri - The project Iri
	 * @param {AdminPermission} permission - The permission we are querying
	 * @returns {boolean} - true, if the user has the permission, false otherwise
	 */
	const getPermissions = (user: OldapUser, project_iri: string, permission: AdminPermission) => {
		return user?.inProject?.find((entry: InProject) => (entry?.project?.toString() === project_iri))?.permissions.includes(permission)
	}

	/**
	 * Get the permissions with the given project shortname (exported)
	 * @param {STRING} shortname – Shortname of project
	 */
	export const get_perms = (shortname: string) => {
		return {
			user: perm_users_checked[shortname],
			lists: perm_lists_checked[shortname],
			resources: perm_resources_checked[shortname],
			permissions: perm_permissions_checked[shortname],
			model: perm_model_checked[shortname],
			create: perm_create_checked[shortname],
			oldap: perm_oldap_checked[shortname]
		}
	};

	/**
	 * Return all project shortnames
	 * @returns {string[]} List of project shortnames the user is associated with
	 */
	export const get_shortnames = () => {
		return projectShortNames;
	};

	/**
	 * Adds the selected project to the list of projects the user is member of
	 */
	const add_project = () => {
		if (project_selected !== "") {
			projectShortNames.push(project_selected)
			projects_available = projects_available.filter(item => item.value !== project_selected)
		}
		console.log("****>", project_selected);
		project_selected = "";
	}

	current_user.inProject.forEach((item: InProject) => {
		if (item.project.toString() === current_project.projectIri.toString()) {
			current_user_permissions = item.permissions;
		}
	});

	if (authinfo_json) {
		authinfo = JSON.parse(authinfo_json);
		if (isRoot) {
			//
			// the current_user has root privilegs (ADMIN_OLDAP)
			//
			// let's get all the projects existing
			//
			const all_projects_config = {
				headers: {
					'Accept': 'application/json',
					'Authorization': 'Bearer ' + authinfo.token,
				},
			}
			apiClient.getAdminprojectsearch(all_projects_config)
				.then((res) => {
					res.forEach(data => {
						if (data.length > 1 && data[0] && data[1]) {

							let is_in_project = false;
							user?.inProject.forEach((p: InProject) => {
								if (p.project.toString() === data[0]) {
									is_in_project = true;
								}
							});

							if (is_in_project) { // the user is in the given project....
								projectShortNames.push(data[1]);
								perm_users_checked[data[1]] = getPermissions(user, data[0], AdminPermission.ADMIN_USERS) ?? false;
								perm_lists_checked[data[1]] = getPermissions(user, data[0], AdminPermission.ADMIN_LISTS) ?? false;
								perm_resources_checked[data[1]] = getPermissions(user, data[0], AdminPermission.ADMIN_RESOURCES) ?? false;
								perm_permissions_checked[data[1]] = getPermissions(user, data[0], AdminPermission.ADMIN_PERMISSION_SETS) ?? false;
								perm_model_checked[data[1]] = getPermissions(user, data[0], AdminPermission.ADMIN_MODEL) ?? false;
								perm_create_checked[data[1]] = getPermissions(user, data[0], AdminPermission.ADMIN_CREATE) ?? false;
								perm_oldap_checked[data[1]] = getPermissions(user, data[0], AdminPermission.ADMIN_OLDAP) ?? false;
							}
							else { // The user is not (yet) associated with the project...
									projects_available.push({value: data[1], name: data[1]});
								}
							}
						});
					})
					.catch((err) => {
						process_api_error(err)
					});
			}
			else {
				projectShortNames.push(current_project.projectShortName);

				perm_users_checked[current_project.projectShortName.toString()] = getPermissions(user, current_project.projectIri.toString(), AdminPermission.ADMIN_USERS) ?? false;
				perm_lists_checked[current_project.projectShortName.toString()] = getPermissions(user, current_project.projectIri.toString(), AdminPermission.ADMIN_LISTS) ?? false;
				perm_resources_checked[current_project.projectShortName.toString()] = getPermissions(user, current_project.projectIri.toString(), AdminPermission.ADMIN_RESOURCES) ?? false;
				perm_permissions_checked[current_project.projectShortName.toString()] = getPermissions(user, current_project.projectIri.toString(), AdminPermission.ADMIN_PERMISSION_SETS) ?? false;
				perm_model_checked[current_project.projectShortName.toString()] = getPermissions(user, current_project.projectIri.toString(), AdminPermission.ADMIN_MODEL) ?? false;
				perm_create_checked[current_project.projectShortName.toString()] = getPermissions(user, current_project.projectIri.toString(), AdminPermission.ADMIN_CREATE) ?? false;
				perm_oldap_checked[current_project.projectShortName.toString()] = getPermissions(user, current_project.projectIri.toString(), AdminPermission.ADMIN_OLDAP) ?? false;

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
<div class="flex flex-col space-y-6">
	<div class="inline-flex items-center gap-2">
		<Select size=sm placeholder="project..." class="w-auto min-w-[max-content] pr-8" items={projects_available} bind:value={project_selected} />
		<Button size=xs onclick={add_project}>Add</Button>
	</div>
	<Table class="w-full">
		<TableBody>
		{#each projectShortNames as shortname}
			<TableBodyRow>
				<TableBodyCell class="whitespace-nowrap text-right pr-4">
					<span class="inline-flex items-center gap-2">
    				<Label class="text-right">{shortname}:</Label>
						<Button pill={true} class="!p-2" size="xs"><TrashBinOutline class="w-3 h-3" /></Button>
  				</span>
				</TableBodyCell>
				<TableBodyCell class="flex flex-wrap gap-4 items-center">
					<Checkbox disabled={perm_users_disabled} bind:checked={perm_users_checked[shortname]}><UserOutline /><Tooltip>{m.perm_user()}</Tooltip></Checkbox>
					<Checkbox disabled={perm_lists_disabled} bind:checked={perm_lists_checked[shortname]}><ListOutline /><Tooltip>{m.perm_lists()}</Tooltip></Checkbox>
					<Checkbox disabled={perm_resources_disabled} bind:checked={perm_resources_checked[shortname]}><ShieldCheckOutline /><Tooltip>{m.perm_resources()}</Tooltip></Checkbox>
					<Checkbox disabled={perm_permissions_disabled} bind:checked={perm_permissions_checked[shortname]}><ObjectsColumnOutline /><Tooltip>{m.perm_permissions()}</Tooltip></Checkbox>
					<Checkbox disabled={perm_model_disabled} bind:checked={perm_model_checked[shortname]}><ShareNodesOutline /><Tooltip>{m.perm_model()}</Tooltip></Checkbox>
					<Checkbox disabled={perm_create_disabled} bind:checked={perm_create_checked[shortname]}><PlusOutline /><Tooltip>{m.perm_create()}</Tooltip></Checkbox>
					<Checkbox disabled={!isRoot} bind:checked={perm_oldap_checked[shortname]}><StarOutline /><Tooltip>{m.perm_system()}</Tooltip></Checkbox>
				</TableBodyCell>
			</TableBodyRow>
		{/each}
		</TableBody>
	</Table>
</div>
