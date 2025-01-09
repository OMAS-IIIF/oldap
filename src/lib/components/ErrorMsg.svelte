<script lang="ts">

	import { errorInfoStore } from '$lib/stores/errorinfo';
	import { Button, Modal } from 'flowbite-svelte';
	import { Severity } from '$lib/interfaces/errorinfo';

	type Colors = 'primary' | 'yellow' | 'red' | 'none' | 'green' | 'purple' | 'blue' | 'light' | 'dark' | 'alternative' | undefined;

	let color: Colors = $state(undefined);
	let severity = $state('');
	let message = $state('');
	let open = $state(false);

	errorInfoStore.subscribe((errInfo) => {
		if (errInfo) {
			switch (errInfo.severity) {
				case Severity.INFO: {
					color = 'primary';
					severity = 'INFO';
					message = errInfo.errormsg;
					break;
				}
				case Severity.WARNING: {
					color = 'yellow';
					severity = 'WARNING';
					message = errInfo.errormsg;
					break;
				}
				case Severity.ERROR: {
					color = 'red';
					severity = 'ERROR';
					message = errInfo.errormsg;
					break;
				}
				case Severity.SEVERE: {
					color = 'red';
					severity = 'SEVERE ERROR';
					message = errInfo.errormsg;
					break;
				}
				case Severity.FATAL: {
					color = 'red';
					severity = 'FATAL ERROR';
					message = errInfo.errormsg;
					break;
				}
			}
			open = true;
		}
		else {
			open = false;
		}
	});

	const dismiss = () => {
		errorInfoStore.set(null);
	}

</script>

<Modal title={severity} bind:open {color} autoclose>
	<div class="text-base leading-relaxed">
		Message: {message}
	</div>
	<svelte:fragment slot="footer">
		<Button on:click={() => dismiss()} {color}>OK</Button>
	</svelte:fragment>
</Modal>