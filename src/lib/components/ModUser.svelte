<script lang="ts">

	import { availableLanguageTags, languageTag } from "$lib/paraglide/runtime.js"
	import { Badge, Button, Input, Label, Modal, Toggle } from 'flowbite-svelte';
	import ProjectMember from '$lib/components/ProjectMember.svelte';
	import type { InProject, OldapUser } from '$lib/oldap/classes/user';
	import { AdminPermission } from '$lib/oldap/enums/admin_permissions';
	import { userStore } from '$lib/stores/user';
	import { projectStore } from '$lib/stores/project';
	import type { OldapProject } from '$lib/oldap/classes/project';
	import * as m from '$lib/paraglide/messages.js'
	import { QName } from '$lib/oldap/types/xsd_qname';
	import type { AuthInfo } from '$lib/interfaces/authinfo';
	import { apiClient } from '$lib/shared/apiClient';
	import { process_api_error } from '$lib/helpers/process_error';
	import { getLangString } from '$lib/oldap/types/langstring';
	import { PermissionSet } from '$lib/oldap/classes/permissionset';
	import { convertToLanguage, Language } from '$lib/oldap/enums/language';


	let { modUserOpen = $bindable(), user = $bindable() } = $props();
	//user = user as OldapUser;
	//modUserOpen = modUserOpen as boolean;

	const authinfo_json = sessionStorage.getItem('authinfo')
	let authinfo: AuthInfo;
	let current_user: OldapUser | null = $state(null);
	let current_project: OldapProject | null = $state(null);
	let userId: string = $state('')
	let givenName: string = $state('');
	let familyName: string = $state('');
	let email: string = $state('');
	let isActive: boolean = $state(false);
	let permissionSet: PermissionSet[] = $state([]);
	let dialog_title = $state('');
	let project_member_ref: ProjectMember;
	let current_lang: Language | undefined = $state(undefined);

	//
	// Get the current user and check if she/he is member of the SystemProject with ADMIN_OLDAP rights
	//
	userStore.subscribe(async (newuser: OldapUser | null) => {
		current_user = newuser;
	});

	//
	// Get the current project of the current user
	//
	projectStore.subscribe((newproject: OldapProject | null) => {
		current_project = newproject;
	});

	current_lang = convertToLanguage(languageTag());

	$effect(() => {
		let _user: OldapUser | undefined = undefined;
		if (user) {
			_user = user as OldapUser;
			userId = _user.userId.toString();
			givenName = _user.givenName.toString();
			familyName = _user.familyName.toString();
			email = _user.email.toString();
			isActive = _user?.isActive ?? false;
			//permissionSet = _user.hasPermissions ?? [];
			dialog_title = m.mod_user();
		} else {
			userId = '';
			givenName = '';
			familyName = '';
			email = '';
			isActive = false;
			dialog_title = m.add_user();
		}

		permissionSet = [];
		if (authinfo_json) {
			authinfo = JSON.parse(authinfo_json);
			console.log("====----->", _user?.hasPermissions)
			_user?.hasPermissions?.forEach((permission) => {
				const get_permissionset_info = {
					headers: {
						'Accept': 'application/json',
						'Authorization': 'Bearer ' + authinfo.token,
					},
					params: {
						definedByProject: permission.prefix.toString(),
						permissionSetId: permission.fragment.toString()
					}
				}
				apiClient.getAdminpermissionsetDefinedByProjectPermissionSetId(get_permissionset_info)
					.then((response) => {
						const tmp_permSet = PermissionSet.fromOldapJson(response)
						console.log("RESP:", tmp_permSet);
						//(() => permissionSet.push(tmp_permSet))();
						permissionSet = [...permissionSet, tmp_permSet]
					})
					.catch((error) => {
						console.log(error)
					});
			});
		}
	});

	const add_user = () => {
		console.log("======= ADD_USER ====")
		const projects = project_member_ref?.get_shortnames();
		for (const project of projects) {
			const res = project_member_ref?.get_perms(project.value);
			console.log(res);
		}
	}

</script>

<Modal title={dialog_title} bind:open={modUserOpen} size=lg autoclose={false} class="w-full">
	<form class="flex flex-col space-y-6" action="#">
		<div class="grid grid-cols-[1fr_3fr] space-y-1">
			<Label class="flex items-center text-xs rtl:text-right font-medium">{m.user_id()}</Label>
			<Input type="text" name="userId" bind:value={userId} placeholder="userid" size="sm" class="items-center focus:ring-blue-500 focus:border-blue-500" required />

			<Label class="flex items-center text-xs rtl:text-right font-medium">{m.given_name()}</Label>
			<Input type="text" name="givenName" bind:value={givenName} placeholder="given name" size="sm" class="items-center focus:ring-blue-500 focus:border-blue-500" required />

			<Label class="flex items-center text-xs rtl:text-right font-medium">{m.family_name()}</Label>
			<Input type="text" name="familyName" bind:value={familyName} placeholder="family name" size="sm" class="items-center focus:ring-blue-500 focus:border-blue-500" required />

			<Label class="flex items-center text-xs rtl:text-right font-medium">{m.email()}</Label>
			<Input type="email" name="email" bind:value={email} placeholder="email@test.com" size="sm" class="items-center focus:ring-blue-500 focus:border-blue-500" required />

			<Label class="flex items-center text-xs rtl:text-right font-medium">{m.password()}</Label>
			<Input type="password" name="password" placeholder="XXXX" size="sm" class="items-center focus:ring-blue-500 focus:border-blue-500" required />

			<Label class="flex items-center text-xs rtl:text-right font-medium">{m.password()}</Label>
			<Input type="password" name="password2" placeholder="XXXX" size="sm" class="items-center focus:ring-blue-500 focus:border-blue-500"  required />

			<Label class="flex items-center text-xs rtl:text-right font-medium">{m.is_active()}</Label>
			<Toggle bind:checked={isActive}></Toggle>

			<Label class="flex items-center text-xs rtl:text-right font-medium">{m.in_project()}</Label>
			<ProjectMember current_user={current_user} current_project={current_project} isRoot={current_user?.isRoot} user={user} bind:this={project_member_ref}/>

			<Label class="flex items-center text-xs rtl:text-right font-medium">Permission Sets</Label>
			<div>
				{#each permissionSet as permission}
					<Badge class="m-1" dismissable>{permission?.label[current_lang]}</Badge>
				{/each}
				<Button>ADD</Button>
			</div>
		</div>
		<div class="flex flex-col-2 justify-center space-x-6">
			<Button type="button" class="w-full1" onclick={add_user}>{m.add_user()}</Button>
			<Button type="button" class="w-full1" color="blue">{m.cancel()}</Button>
		</div>
	</form>
</Modal>