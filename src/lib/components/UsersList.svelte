<script lang="ts">

	import {
		Button,
		Modal,
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell,
		Toggle
	} from 'flowbite-svelte';
	import { EditOutline, TrashBinOutline } from 'flowbite-svelte-icons';
	import { apiClient } from '$lib/shared/apiClient';
	import type { AuthInfo } from '$lib/interfaces/authinfo';
	import { errorInfoStore } from '$lib/stores/errorinfo';
	import { Severity } from '$lib/interfaces/errorinfo';
	import * as m from '$lib/paraglide/messages.js'
	import { OldapUser } from '$lib/oldap/classes/user';

	let { project = $bindable() } = $props();

	let activeToggleModel = $state(false)

	const authinfo_json = sessionStorage.getItem('authinfo')

	let users: OldapUser[] = $state([]);

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

	$effect(() => {
		if (project) {
			const config_usersearch = {
				queries: { inProject: project?.projectIri?.toString() },
				headers: {
					'Accept': 'application/json',
					'Authorization': 'Bearer ' + authinfo.token,
				},
			}
			//
			// first we get only the user iri's
			//
			apiClient.getAdminusersearch(config_usersearch)
				.then((user_iris) => {
					user_iris.forEach((x) => {
						const config_userdata = {
							queries: { iri: x },
							headers: {
								'Accept': 'application/json',
								'Authorization': 'Bearer ' + authinfo.token,
							},
						}
						//
						// now get for each user the user information
						//
						apiClient.getAdminuserget (config_userdata)
							.then((user_json) => {
								let user = OldapUser.fromOldapJson(user_json);
								users.push(user);
								console.log(user);
							})
							.catch((err) => {
								console.log(err);
							})
					});
				})
				.catch((err) => {
					console.log(err);
				});
		}
	});

	const toggle_active = (e: Event, userId: string) => {
		e.preventDefault();
		activeToggleModel = true;
		console.log("=====>", e);
	}

	const handleCancel = () => {
		alert("Clicked cancel");
	};
	const handleDelete = () => {
		alert("Clicked delete");
	};

</script>

<Table hoverable={true} shadow>
	<TableHead theadClass="text-xs uppercase divide-blue-500">
		<TableHeadCell>User ID</TableHeadCell>
		<TableHeadCell>Family name</TableHeadCell>
		<TableHeadCell>Given name</TableHeadCell>
		<TableHeadCell>Email</TableHeadCell>
		<TableHeadCell>Active</TableHeadCell>
		<TableHeadCell>Action</TableHeadCell>
	</TableHead>
	<TableBody tableBodyClass="divide-y">
		{#each users as u}
			<TableBodyRow class="text-xs leading-snug">
				<TableBodyCell>{u.userId}</TableBodyCell>
				<TableBodyCell>{u.familyName}</TableBodyCell>
				<TableBodyCell>{u.givenName}</TableBodyCell>
				<TableBodyCell>{u.email}</TableBodyCell>
				<TableBodyCell><Toggle checked={u.isActive} on:change={(e) => toggle_active(e, u.userId.toString())} /></TableBodyCell>
				<TableBodyCell><span class="flex flex-row"><EditOutline class="w-5 h-5" /><TrashBinOutline class="w-5 h-5" /></span></TableBodyCell>
			</TableBodyRow>
		{/each}
	</TableBody>
</Table>

<Modal title="" bind:open={activeToggleModel} autoclose size="sm" class="w-full">
	<svg class="text-gray-400 dark:text-gray-500 w-11 h-11 mb-3.5 mx-auto" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" /></svg>
	<p class="mb-4 text-gray-500 dark:text-gray-300 text-center">Are you sure you want to delete this item?</p>
	<div class="flex justify-center items-center space-x-4">
		<Button color="light" on:click={handleCancel}>No, cancel</Button>
		<Button color="red" on:click={handleDelete}>Yes, I'm sure</Button>
	</div>
</Modal>

