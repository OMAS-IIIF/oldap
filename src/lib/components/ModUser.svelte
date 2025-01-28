<script lang="ts">

	import { Button, Dropdown, Input, Label, Modal, Radio, Toggle } from 'flowbite-svelte';
	import { ChevronDownOutline } from 'flowbite-svelte-icons';
	import ProjectMember from '$lib/components/ProjectMember.svelte';

let { modUserOpen = $bindable() } = $props();

</script>

<Modal title="Add new user" bind:open={modUserOpen} size="xs" autoclose={false} class="w-full">
	<!--<form class="flex flex-col space-y-6"  action="#">
		<Label class="space-y-1 text-xs rtl:text-right font-medium block">
			<span>User ID</span>
			<Input type="text" name="userId" placeholder="userid" size="sm" required />
		</Label>
		<Label class="space-y-1 text-xs rtl:text-right font-medium block">
			<span>Given name</span>
			<Input type="text" name="givenName" placeholder="given name" size="sm" clearable required />
		</Label>
		<Label class="space-y-1 text-xs rtl:text-right font-medium block">
			<span>Family name</span>
			<Input type="text" name="familyName" placeholder="family name" size="sm" clearable required />
		</Label>
		<Label class="space-y-1 text-xs rtl:text-right font-medium block">
			<span>Email</span>
			<Input type="email" name="email" placeholder="name@company.com" size="sm" clearable  required />
		</Label>
		<Label class="space-y-1 text-xs rtl:text-right font-medium block">
			<span>Password</span>
			<Input type="password" name="password" placeholder="XXXX" size="sm" clearable required />
		</Label>
		<Label class="space-y-1 text-xs rtl:text-right font-medium block">
			<span>Password</span>
			<Input type="password" name="password2" placeholder="XXXX" size="sm" clearable required />
		</Label>
		<Button type="button" class="w-full1">Add user</Button>
	</form> -->

	<form class="flex flex-col space-y-6" action="#">
		<div class="grid grid-cols-[1fr_3fr] space-y-1">
			<Label class="flex items-center text-xs rtl:text-right font-medium">User ID</Label>
			<Input type="text" name="userId" placeholder="userid" size="sm" class="items-center focus:ring-blue-500 focus:border-blue-500" required />

			<Label class="flex items-center text-xs rtl:text-right font-medium">Given name</Label>
			<Input type="text" name="givenName" placeholder="given name" size="sm" class="items-center focus:ring-blue-500 focus:border-blue-500" required />

			<Label class="flex items-center text-xs rtl:text-right font-medium">Family name</Label>
			<Input type="text" name="familyName" placeholder="family name" size="sm" class="items-center focus:ring-blue-500 focus:border-blue-500" required />

			<Label class="flex items-center text-xs rtl:text-right font-medium">Email</Label>
			<Input type="email" name="email" placeholder="email@test.com" size="sm" class="items-center focus:ring-blue-500 focus:border-blue-500" required />

			<Label class="flex items-center text-xs rtl:text-right font-medium">Password</Label>
			<Input type="password" name="password" placeholder="XXXX" size="sm" class="items-center focus:ring-blue-500 focus:border-blue-500" required />

			<Label class="flex items-center text-xs rtl:text-right font-medium">Password</Label>
			<Input type="password" name="password2" placeholder="XXXX" size="sm" class="items-center focus:ring-blue-500 focus:border-blue-500"  required />

			<Label class="flex items-center text-xs rtl:text-right font-medium">Active</Label>
			<Toggle></Toggle>

			<Label class="flex items-center text-xs rtl:text-right font-medium">In project</Label>
			<ProjectMember />
		</div>
		<div class="flex flex-col-2 justify-center space-x-6">
			<Button type="button" class="w-full1">Add user</Button>
			<Button type="button" class="w-full1">Dismiss</Button>
		</div>
	</form>
</Modal>