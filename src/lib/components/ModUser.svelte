<script lang="ts">

	import { Button, Input, Label, Modal } from 'flowbite-svelte';

let { modUserOpen = $bindable() } = $props();

</script>

<Modal bind:open={modUserOpen} size="xs" autoclose={false} class="w-full">
	<form class="flex flex-col space-y-6"  action="#">
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
	</form>
</Modal>