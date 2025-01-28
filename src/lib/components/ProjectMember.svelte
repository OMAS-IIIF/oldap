<script lang="ts">

	import { Button, Dropdown, Radio } from 'flowbite-svelte';
	import { ChevronDownOutline } from 'flowbite-svelte-icons';
	import { apiClient } from '$lib/shared/apiClient';
	import type { AuthInfo } from '$lib/interfaces/authinfo';
	import { errorInfoStore } from '$lib/stores/errorinfo';
	import { Severity } from '$lib/interfaces/errorinfo';
	import * as m from '$lib/paraglide/messages.js'

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
	}

	const all_projects_config = {
			headers: {
				'Accept': 'application/json',
				'Authorization': 'Bearer ' + authinfo.token,
			},
	}
	apiClient.getAdminprojectall(all_projects_config)
	.then((res) => {
		console.log("----=====>", res);
	})
	.catch((err) => {
		console.log(err);
	})
</script>

<Button size="xs">Dropdown radio<ChevronDownOutline class="w-6 h-6 ms-2 text-white dark:text-white" /></Button>
<Dropdown class="w-44 p-3 space-y-3 text-sm">
	<li>
		<Radio name="group1"  value="p1">P 1</Radio>
		<Radio name="group1"  value="p2">P 2</Radio>
	</li>
</Dropdown>
