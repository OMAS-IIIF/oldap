<script lang="ts">

	import { apiClient } from '$lib/shared/apiClient';
	import { Button, Dropdown, Input, Label, Modal, Toggle } from 'flowbite-svelte';
	import ProjectMember from '$lib/components/ProjectMember.svelte';
	import type { AuthInfo } from '$lib/interfaces/authinfo';
	import type { InProject } from '$lib/oldap/classes/user';
	import { AdminPermission } from '$lib/oldap/enums/admin_permissions';

	let { modUserOpen = $bindable(), user = $bindable() } = $props();

	let userId: string = $state('')
	let givenName: string = $state('');
	let familyName: string = $state('');
	let email: string = $state('');
	let isActive: boolean = $state(false);
	let isRoot: boolean = false;

	$effect(() => {
		if (user) {
			userId = user.userId.toString();
			givenName = user.givenName.toString();
			familyName = user.familyName.toString();
			email = user.email.toString();
			isActive = user.isActive;
			user.inProject.forEach((inProject: InProject) => {
				if (AdminPermission.ADMIN_OLDAP in inProject) {
					isRoot = true;
				}
			});
		}
		else {
			userId = '';
			givenName = '';
			familyName = '';
			email = '';
			isActive = false;
		}
	});
</script>

<Modal title="Add new user" bind:open={modUserOpen} size="xs" autoclose={false} class="w-full">
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
			<ProjectMember aperms={[]}/>
		</div>
		<div class="flex flex-col-2 justify-center space-x-6">
			<Button type="button" class="w-full1">Add user</Button>
			<Button type="button" class="w-full1">Dismiss</Button>
		</div>
	</form>
</Modal>