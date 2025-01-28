<script lang="ts">

	import { Accordion, AccordionItem, Button, Checkbox, Dropdown, Radio } from 'flowbite-svelte';
	import { ChevronDownOutline } from 'flowbite-svelte-icons';
	import { apiClient } from '$lib/shared/apiClient';
	import type { AuthInfo } from '$lib/interfaces/authinfo';
	import { errorInfoStore } from '$lib/stores/errorinfo';
	import { Severity } from '$lib/interfaces/errorinfo';
	import * as m from '$lib/paraglide/messages.js'

	let { aperms } = $props();

	const authinfo_json = sessionStorage.getItem('authinfo')
	let authinfo: AuthInfo;
	let projectShortNames: string[] = $state([]);
	let projectIris: string[] = $state([]);

	if (authinfo_json) {
		authinfo = JSON.parse(authinfo_json);

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
			<Checkbox>Users</Checkbox>
			<Checkbox>Lists</Checkbox>
			<Checkbox>Resources</Checkbox>
			<Checkbox>PermissionSets</Checkbox>
			<Checkbox>Datamodel</Checkbox>
			<Checkbox>Create</Checkbox>
			<Checkbox>System</Checkbox>
		</AccordionItem>
		{/each}
</Accordion>
