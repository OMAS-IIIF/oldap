<script lang="ts">
	import { Button, Input, Label, Modal } from 'flowbite-svelte';
	import type { AuthInfo } from '$lib/interfaces/authinfo';
	import { errorInfoStore } from '$lib/stores/errorinfo';
	import { Severity } from '$lib/interfaces/errorinfo';
	import { OldapUser } from '$lib/oldap/classes/user';
	import { userStore } from '$lib/stores/user';
	import * as m from '$lib/paraglide/messages.js'
	import { process_api_error } from '$lib/helpers/process_error';
	import { projectStore } from '$lib/stores/project';
	import { apiClient } from '$lib/shared/apiClient';

	let { isOpen = $bindable() } = $props()
	let userid = $state('');
	let password = $state('');


	const login = async () => {
		const config_auth = {
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json; utf-8',
			},
			params: { userId: userid },
		}
		const data = {password: password as string};
		try {
			const authdata = await apiClient.postAdminauthUserId(data, config_auth);
			if (authdata.token) {
				const authinfo: AuthInfo = {
					userid: userid,
					token: authdata.token,
				}
				sessionStorage.setItem('authinfo', JSON.stringify(authinfo));
			}
			else {
				errorInfoStore.set({
					errormsg: m.no_token(),
					errorcode: 500,
					severity: Severity.ERROR,
				});
				return ;
			}
		}
		catch (error) {
			process_api_error(error);
		}
		finally {
			isOpen = false;
		}

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

		const config_user = {
			params: { userId: authinfo.userid },
			headers: {
				'Accept': 'application/json',
				'Authorization': 'Bearer ' + authinfo.token,
			},
		}
		try {
			const userdata = await apiClient.getAdminuserUserId(config_user);
			const user = OldapUser.fromOldapJson(userdata);
			userStore.set(user);
		}
		catch (error) {
			process_api_error(error);
		}
	}

	export const logout = () => {
		userStore.set(null);
		projectStore.set(null);
		sessionStorage.removeItem('authinfo');
	}

	function dismiss(): void {
		userid = '';
		password = '';
	}

</script>

<Modal bind:open={isOpen} size="xs" autoclose={false} on:close={() => (dismiss())} class="w-full">
	<form class="flex flex-col space-y-6" action="#">
		<h3 class="mb-4 text-xl font-medium text-gray-900 dark:text-white">Sign in to OLDAP</h3>
		<Label class="space-y-2">
			<span>UserID</span>
			<Input type="text" name="userid" bind:value={userid} placeholder="userid" required />
		</Label>
		<Label class="space-y-2">
			<span>Your password</span>
			<Input type="password" name="password" bind:value={password} placeholder="•••••" required />
		</Label>
		<div class="flex items-start">
			<!-- <Checkbox>Remember me</Checkbox> -->
			<a href="/" class="ms-auto text-sm text-primary-700 hover:underline dark:text-primary-500"> {m.lost_pw()} </a>
		</div>
		<Button type="button" class="w-full1" onclick={() => login()}>{m.do_login()}</Button>
		<div class="text-sm font-medium text-gray-500 dark:text-gray-300">
			{m.not_registered()} <a href="/" class="text-primary-700 hover:underline dark:text-primary-500"> Apply for account </a>
		</div>
	</form>
</Modal>


