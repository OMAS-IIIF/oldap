<script lang="ts">

	import { Button, Input, Label, Modal, Toggle } from 'flowbite-svelte';
	import ProjectMember from '$lib/components/ProjectMember.svelte';
	import type { InProject, OldapUser } from '$lib/oldap/classes/user';
	import { AdminPermission } from '$lib/oldap/enums/admin_permissions';
	import { userStore } from '$lib/stores/user';
	import { projectStore } from '$lib/stores/project';
	import type { OldapProject } from '$lib/oldap/classes/project';
	import * as m from '$lib/paraglide/messages.js'
	import { QName } from '$lib/oldap/types/xsd_qname';
	import type { AuthInfo } from '$lib/interfaces/authinfo';


	let { modUserOpen = $bindable(), user = $bindable() } = $props();
	user = user as OldapUser;
	modUserOpen = modUserOpen as boolean;

	const authinfo_json = sessionStorage.getItem('authinfo')
	let authinfo: AuthInfo;
	let current_user: OldapUser | null = $state(null);
	let current_project: OldapProject | null = $state(null);
	let userId: string = $state('')
	let givenName: string = $state('');
	let familyName: string = $state('');
	let email: string = $state('');
	let isActive: boolean = $state(false);
	let isRoot: boolean = $state(false);
	let permissionSet: QName[] = $state([]);
	let dialog_title = $state('')
	let project_member_ref: ProjectMember;

	//
	// Get the current user and check if she/he is member of the SystemProject with ADMIN_OLDAP rights
	//
	userStore.subscribe(async (newuser: OldapUser | null) => {
		current_user = newuser;
		isRoot = false;
		newuser?.inProject?.forEach((in_project: InProject) => {
			if ((in_project.project.toString() === 'oldap:SystemProject') && in_project.permissions.includes(AdminPermission.ADMIN_OLDAP)) {
				isRoot = true;
			}
		});
	});

	//
	// Get the current project of the current user
	//
	projectStore.subscribe((newproject: OldapProject | null) => {
		current_project = newproject;
	});


	$effect(() => {
		if (user) {
			userId = user.userId.toString();
			givenName = user.givenName.toString();
			familyName = user.familyName.toString();
			email = user.email.toString();
			isActive = user.isActive;
			permissionSet = user.permissionSet;
			dialog_title = m.mod_user();
		}
		else {
			userId = '';
			givenName = '';
			familyName = '';
			email = '';
			isActive = false;
			dialog_title = m.add_user();
		}

		if (authinfo_json) {
			authinfo = JSON.parse(authinfo_json);
			const all_permsets_config = {
				headers: {
					'Accept': 'application/json',
					'Authorization': 'Bearer ' + authinfo.token,
				},
				queries: {

				}
			}
		}
	});


	const add_user = () => {
		console.log("======= ADD_USER ====")
		const projects = project_member_ref.get_shortnames();
		for (let i = 0; i < projects.length; i++) {
			const res = project_member_ref.get_perms(projects[i] ?? '');
			console.log(res);
		}
	}

</script>

<Modal title={dialog_title} bind:open={modUserOpen} size="xs" autoclose={false} class="w-full">
	<form class="flex flex-col space-y-6" action="#">
		<div class="grid grid-cols-[1fr_3fr] space-y-1">
			<Label class="flex items-center text-xs rtl:text-right font-medium">User ID</Label>
			<Input type="text" name="userId" bind:value={userId} placeholder="userid" size="sm" class="items-center focus:ring-blue-500 focus:border-blue-500" required />

			<Label class="flex items-center text-xs rtl:text-right font-medium">Given name</Label>
			<Input type="text" name="givenName" bind:value={givenName} placeholder="given name" size="sm" class="items-center focus:ring-blue-500 focus:border-blue-500" required />

			<Label class="flex items-center text-xs rtl:text-right font-medium">Family name</Label>
			<Input type="text" name="familyName" bind:value={familyName} placeholder="family name" size="sm" class="items-center focus:ring-blue-500 focus:border-blue-500" required />

			<Label class="flex items-center text-xs rtl:text-right font-medium">Email</Label>
			<Input type="email" name="email" bind:value={email} placeholder="email@test.com" size="sm" class="items-center focus:ring-blue-500 focus:border-blue-500" required />

			<Label class="flex items-center text-xs rtl:text-right font-medium">Password</Label>
			<Input type="password" name="password" placeholder="XXXX" size="sm" class="items-center focus:ring-blue-500 focus:border-blue-500" required />

			<Label class="flex items-center text-xs rtl:text-right font-medium">Password</Label>
			<Input type="password" name="password2" placeholder="XXXX" size="sm" class="items-center focus:ring-blue-500 focus:border-blue-500"  required />

			<Label class="flex items-center text-xs rtl:text-right font-medium">Active</Label>
			<Toggle bind:checked={isActive}></Toggle>

			<Label class="flex items-center text-xs rtl:text-right font-medium">In project</Label>
			<ProjectMember current_user={current_user} current_project={current_project} isRoot={isRoot} user={user} bind:this={project_member_ref}/>
		</div>
		<div class="flex flex-col-2 justify-center space-x-6">
			<Button type="button" class="w-full1" onclick={add_user}>{m.add_user()}</Button>
			<Button type="button" class="w-full1">{m.cancel()}</Button>
		</div>
	</form>
</Modal>