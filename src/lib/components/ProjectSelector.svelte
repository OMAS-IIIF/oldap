<script lang="ts">
	import { ChevronDownOutline } from 'flowbite-svelte-icons';
	import { Dropdown, DropdownItem, NavLi } from 'flowbite-svelte';
	import { userStore } from '$lib/stores/user';
	import type { OldapUser } from '$lib/oldap/classes/oldap_user';
	import { createApiClient, endpoints } from '$lib/oldap/schemata/zod';
	import type { AuthInfo } from '$lib/interfaces/authinfo';
	import { errorInfoStore } from '$lib/stores/errorinfo';
	import { Severity } from '$lib/interfaces/errorinfo';
	import * as m from '$lib/paraglide/messages.js'
	import { convertToLanguage, Language } from '$lib/oldap/enums/language';
	import { OldapProject } from '$lib/oldap/classes/oldap_project';
	import { process_api_error } from '$lib/helpers/process_error';
	import { languageTag } from '$lib/paraglide/runtime.js'

	const apiUrl = import.meta.env.VITE_API_URL;
	let { projects } = $props();
	let project = $state('Project');
	// let project_iris: string[] | undefined = $state(undefined);
	let project_ids: string[] = [];


	const client = createApiClient(apiUrl, {validate: 'all'});
	userStore.subscribe(async (oldap_user: OldapUser | null) => {
		if (oldap_user) {
			const project_iris = oldap_user.inProject?.map((x) => (x.project.toString()));

			/* TODO: make shared function to get authinfo! */
			const authinfo_json = sessionStorage.getItem('authinfo')
			let authinfo: AuthInfo;
			if (authinfo_json) {
				authinfo = JSON.parse(authinfo_json);
			}
			else {
				errorInfoStore.set({
					errormsg: m.userdata_corrupted(),
					errorcode: 500,
					severity: Severity.ERROR,
				});
				return;
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
						const project_iddata = await client.getAdminprojectgetid(config_projectid);
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
						const project_data = await client.getAdminprojectProjectId(config_project);
						project = OldapProject.fromOldapJson(project_data);
					}
					catch (error) {
						process_api_error(error);
						continue;
					}
					//project_ids.push(project.projectShortName.toString());
					const lang = convertToLanguage(languageTag()) ?? Language.EN;

					project_ids.push(project?.label[lang] ?? project.projectShortName);
					//console.log("PROJECT_DATA: ", project_data);
				}
			}
		}
	});
</script>

<NavLi class="cursor-pointer">
	{project}<ChevronDownOutline class="w-6 h-6 ms-2 text-primary-800 dark:text-white inline" />
</NavLi>
<Dropdown>
	{#each project_ids as gugus}
		<DropdownItem>{gugus}</DropdownItem>
	{/each}
</Dropdown>