<script lang="ts">
	import { createApiClient, endpoints } from '$lib/oldap/schemata/zod-old';
	import { isErrorFromAlias } from '@zodios/core';
	import { AxiosError } from 'axios';
	import { Button, Input, Label, Modal } from 'flowbite-svelte';
	import type { AuthInfo } from '$lib/interfaces/authinfo';
	import { errorInfoStore } from '$lib/stores/errorinfo';
	import { Severity } from '$lib/interfaces/errorinfo';
	import { User } from 'svelte-hero-icons';
	import { OldapUser } from '$lib/oldap/classes/oldap_user';
	import { userStore } from '$lib/stores/user';

	const apiUrl = import.meta.env.VITE_API_URL;

	let { isOpen = $bindable() } = $props()
	let userid = $state('');
	let password = $state('');

	const process_error = (error: unknown) => {
		if (isErrorFromAlias(endpoints, "postAdminauthUserId", error)) {
			if (error.response) {
				errorInfoStore.set({
					errormsg: error.response.data.message as string,
					errorcode: error.response.status,
					severity: Severity.ERROR,
				});
			}
			else {
				errorInfoStore.set({
					errormsg: "Unknown API error (1)",
					errorcode: 500,
					severity: Severity.ERROR,
				});
			}
			return;
		}
		else {
			if (error instanceof AxiosError) {
				errorInfoStore.set({
					errormsg: error.code as string,
					errorcode: error.status,
					severity: Severity.ERROR,
				});
			}
			else {
				errorInfoStore.set({
					errormsg: "Unknown API error (2)",
					errorcode: 500,
					severity: Severity.ERROR,
				});
			}
			return;
		}
	}

	const login = async () => {
		const client = createApiClient(apiUrl);
		const config_auth = {
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json; utf-8',
			},
			params: { userId: userid },
		}
		const data = {password: password as string};
		try {
			const authdata = await client.postAdminauthUserId(data, config_auth);
			if (authdata.token) {
				const authinfo: AuthInfo = {
					userid: userid,
					token: authdata.token,
				}
				sessionStorage.setItem('authinfo', JSON.stringify(authinfo));
			}
			else {
				errorInfoStore.set({
					errormsg: 'No access token for user',
					errorcode: 500,
					severity: Severity.ERROR,
				});
				return ;
			}
		}
		catch (error) {
			process_error(error);
		}
		finally {
			isOpen = false;
		}

		const authinfo_json = sessionStorage.getItem('authinfo')
		let authinfo: AuthInfo;
		if (authinfo_json) {
			authinfo = JSON.parse(authinfo_json);
		}
		else {
			errorInfoStore.set({
				errormsg: 'User authorization data corrupted',
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
			const userdata = await client.getAdminuserUserId(config_user);
			const user = OldapUser.fromOldapJson(userdata);
			userStore.set(user);
		}
		catch (error) {
			process_error(error);
		}
	}

	export const logout = () => {
		userStore.set(null);
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
			<a href="/" class="ms-auto text-sm text-primary-700 hover:underline dark:text-primary-500"> Lost password? </a>
		</div>
		<Button type="submit" class="w-full1" onclick={() => login()}>Login to your account</Button>
		<div class="text-sm font-medium text-gray-500 dark:text-gray-300">
			Not registered? <a href="/" class="text-primary-700 hover:underline dark:text-primary-500"> Apply for account </a>
		</div>
	</form>
</Modal>


