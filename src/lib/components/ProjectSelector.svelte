<script lang="ts">
	import { ChevronDownOutline } from 'flowbite-svelte-icons';
	import { Dropdown, DropdownItem, NavLi } from 'flowbite-svelte';
	import { userStore } from '$lib/stores/user';
	import type { OldapUser } from '$lib/oldap/classes/oldap_user';
	import { createApiClient } from '$lib/oldap/schemata/zod-old';
	import type { AuthInfo } from '$lib/interfaces/authinfo';
	import { errorInfoStore } from '$lib/stores/errorinfo';
	import { Severity } from '$lib/interfaces/errorinfo';
	import * as m from '$lib/paraglide/messages.js'
	import { Language } from '$lib/oldap/enums/language';
	import { OldapProject } from '$lib/oldap/classes/oldap_project';

	const apiUrl = import.meta.env.VITE_API_URL;
	let { projects } = $props();
	let project = $state('Project');
	let project_iris: string[] | undefined = $state(undefined);
	let project_ids: string[] = [];
	const client = createApiClient(apiUrl);;
	userStore.subscribe(async (oldap_user: OldapUser | null) => {
		console.log("======>", oldap_user)
		if (oldap_user) {
			project_iris = oldap_user.inProject?.map((x) => (x.project.toString()));

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
					const config_project = {
						params: { projectId: p_iri },
						headers: {
							'Accept': 'application/json',
							'Authorization': 'Bearer ' + authinfo.token,
						},
					}

					try {
						const project_data = await client.getAdminprojectProjectId(config_project);
						const project = OldapProject.fromOldapJson(project_data);
						project_ids.push(project.label[Language.EN]);
						console.log("PROJECT_DATA: ", project_data);
					}
					catch (error) {
						errorInfoStore.set({
							errormsg: m.userdata_corrupted(),
							errorcode: 500,
							severity: Severity.ERROR,
						});
					}
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