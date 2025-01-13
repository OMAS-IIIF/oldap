<script lang="ts">
	import md5 from 'crypto-js/md5';


	import { i18n } from '$lib/i18n';
	import { ParaglideJS } from '@inlang/paraglide-sveltekit';
	import '../app.css';

	import {
		Navbar,
		NavBrand,
		NavLi,
		NavUl,
		NavHamburger,
		ImagePlaceholder,
		Skeleton,
		TextPlaceholder,
		Avatar,
		Modal,
		Label,
		Input,
		Checkbox,
		Button,
		Select,
		Dropdown,
		DropdownHeader,
		DropdownItem,
		DropdownDivider,
		Footer, FooterCopyright, FooterLinkGroup, FooterLink
	} from 'flowbite-svelte';
	import Loginout from '$lib/components/Loginout.svelte';
	import ErrorMsg from '$lib/components/ErrorMsg.svelte';
	import { userStore } from '$lib/stores/user';
	import type { OldapUser } from '$lib/oldap/classes/oldap_user';
	import ProjectSelector from '$lib/components/ProjectSelector.svelte';


	let { children } = $props();
	let avatar_img = "/images/User_Avatar.png"
	let loginDialog = $state(false);
	let logged_in = $state(false);
	let userid = $state('');
	let family_name = $state('');
	let given_name = $state('');
	let gravatar_url = $state('');
	let dropdownOpen = $state(false);
	let loginout: Loginout;

	function getGravatarUrl(email: string, size: number = 200): string {
		// Convert email to lowercase and trim whitespace
		const trimmedEmail = email.trim().toLowerCase();

		// Generate MD5 hash of the email
		const hash = md5(trimmedEmail).toString();

		// Construct the Gravatar URL with optional size parameter
		return `https://www.gravatar.com/avatar/${hash}?s=${size}`;
	}

	function call_logout() {
		if (loginout) {
			loginout.logout();
		}
	}

	userStore.subscribe((oldap_user: OldapUser | null) => {
		if (oldap_user) {
			logged_in = true;
			console.log(oldap_user);
			family_name = oldap_user.familyName;
			given_name = oldap_user.givenName;
			gravatar_url = getGravatarUrl(oldap_user.email)
		}
		else {
			logged_in = false;
			//userid = '';
			family_name = '';
			given_name = '';
			gravatar_url = '';
		}
	})

</script>
<!-- <Icon.UserSolid /> -->
<ParaglideJS {i18n}>
	<div class="relative px-8  flex flex-col min-h-screen">
		<Navbar class="px-2 sm:px-4 py-2.5 fixed w-full z-20 top-0 start-0 border-b">
			<NavBrand href="/">
				<img src="/images/oldap-logo.svg" class="me-3 h-6 sm:h-12" alt="OLDAP Logo" />
				<span class="self-center whitespace-nowrap text-xl font-semibold dark:text-white">OLDAP</span>
			</NavBrand>
			<div class="flex items-center md:order-2">
				{#if !logged_in}
					<Avatar id="login-button" src={avatar_img} onclick={() => (loginDialog = true)}/>
					<NavHamburger class1="w-full md:flex md:w-auto md:order-1" />
					<!--<Loginout bind:isOpen={loginDialog}/>-->
				{:else }
					<Avatar id="avatar-menu" src={gravatar_url} />
					<NavHamburger class1="w-full md:flex md:w-auto md:order-1" />
					<Dropdown placement="bottom" triggeredBy="#avatar-menu" bind:open={dropdownOpen}>
						<DropdownHeader>
							<span class="block text-sm">{given_name} {family_name}</span>
						</DropdownHeader>
						<DropdownItem>Change password...</DropdownItem>
						<DropdownItem>Change/set avatar image</DropdownItem>
						<DropdownDivider />
						<DropdownItem onclick={() => {call_logout(); dropdownOpen = false;}}>Sign out</DropdownItem>
					</Dropdown>
				{/if}
				<Loginout bind:isOpen={loginDialog} bind:this={loginout}/>
			</div>
			<div>
			</div>

			<NavHamburger />
			<NavUl>
				<NavLi href="/" active={true}>Home</NavLi>
				<NavLi href="/about">About</NavLi>
				<NavLi href="/docs/components/navbar">Navbar</NavLi>
				<NavLi href="/pricing">Pricing</NavLi>
				<NavLi href="/contact">Contact</NavLi>
				{#if logged_in}
					<ProjectSelector projects="gaga" />
				{/if}
			</NavUl>
		</Navbar>
		<div style="height:300px;" class="overflow-scroll pb-16">
			{@render children()}
		</div>
		<Footer class="bottom-0">
			<div class="sm:flex sm:items-center sm:justify-between">
				<FooterCopyright href="/" by="Flowbite™" year={2025} />
				<FooterLinkGroup ulClass="flex flex-wrap items-center mt-3 text-sm text-gray-500 dark:text-gray-400 sm:mt-0">
					<FooterLink href="/">About</FooterLink>
					<FooterLink href="/">Privacy Policy</FooterLink>
					<FooterLink href="/">Licensing</FooterLink>
					<FooterLink href="/">Contact</FooterLink>
				</FooterLinkGroup>
			</div>
		</Footer>
	</div>
	<ErrorMsg />
</ParaglideJS>
