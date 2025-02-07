<script lang="ts">
	import { ChevronDownOutline } from 'flowbite-svelte-icons';
	import { Dropdown, DropdownItem, NavLi, Radio } from 'flowbite-svelte';
	import { userStore } from '$lib/stores/user';
	import type { InProject, OldapUser } from '$lib/oldap/classes/user';
	import type { AuthInfo } from '$lib/interfaces/authinfo';
	import { errorInfoStore } from '$lib/stores/errorinfo';
	import { Severity } from '$lib/interfaces/errorinfo';
	import * as m from '$lib/paraglide/messages.js'
	import { convertToLanguage, Language } from '$lib/oldap/enums/language';
	import { OldapProject } from '$lib/oldap/classes/project';
	import { process_api_error } from '$lib/helpers/process_error';
	import { languageTag } from '$lib/paraglide/runtime.js'
	import { projectStore } from '$lib/stores/project';
	import { apiClient } from '$lib/shared/apiClient';
	import { AdminPermission } from '$lib/oldap/enums/admin_permissions';

	let projects: {[key: string]: OldapProject} = {};
	let selected_project = $state('');
	const lang = convertToLanguage(languageTag()) ?? Language.EN;

	$effect(() => {
		if (selected_project) {
			projectStore.set(projects[selected_project] ?? null);
		}
	});

	/* TODO: make shared function to get authinfo! */
	const authinfo_json = sessionStorage.getItem('authinfo')
	let authinfo: AuthInfo;
	if (authinfo_json) {
		authinfo = JSON.parse(authinfo_json);
	}
	else {
		errorInfoStore.set({errormsg: m.userdata_corrupted(), errorcode: 500, severity: Severity.ERROR, });
	}

	userStore.subscribe(async (oldap_user: OldapUser | null) => {
		if (oldap_user) {
			let project_iris: string[] | undefined;
			if (oldap_user.isRoot) {
				const all_projects_config = {
					headers: {
						'Accept': 'application/json',
						'Authorization': 'Bearer ' + authinfo.token,
					},
				}
				try {
					const res = await apiClient.getAdminprojectsearch(all_projects_config);
					project_iris = res.map(item => item[0]) as string[] | undefined;
				}
				catch (err) {
					process_api_error(err)
				}
			}
			else {
				project_iris = oldap_user.inProject?.map((x) => (x.project.toString()));
			}

			if (project_iris) {
				for (const p_iri of project_iris) {
					const config_projectid = {
						queries: { iri: p_iri },
						headers: {
							'Accept': 'application/json',
							'Authorization': 'Bearer ' + authinfo.token,
						},
					}
					let projectid: string
					try {
						const project_iddata = await apiClient.getAdminprojectgetid(config_projectid);
						projectid = project_iddata.id;
					}
					catch (error) {
						process_api_error(error);
						continue;
					}
					const config_project = {
						params: { projectId: projectid },
						headers: {
							'Accept': 'application/json',
							'Authorization': 'Bearer ' + authinfo.token,
						},
					}
					let project: OldapProject;
					try {
						const project_data = await apiClient.getAdminprojectProjectId(config_project);
						project = OldapProject.fromOldapJson(project_data);
					}
					catch (error) {
						process_api_error(error);
						continue;
					}
					if (!selected_project) {
						selected_project = project.projectShortName.toString();
					}
					projects[project.projectShortName.toString()] = project;
				}
			}
		}
	});
</script>

<NavLi class="cursor-pointer">
	Project: {projects[selected_project]?.label?.[lang] ?? selected_project}<ChevronDownOutline class="w-6 h-6 ms-2 text-primary-800 dark:text-white inline" />
</NavLi>
<Dropdown class="w-44 p-3 space-y-3 text-sm">
	{#each Object.entries(projects) as [key, value]}
		<li>
			<Radio name="group1" bind:group={selected_project} value={key}>{value?.label?.[lang] ?? key}</Radio>
		</li>
	{/each}
</Dropdown>
