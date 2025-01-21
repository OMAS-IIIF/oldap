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
		Avatar,
		Dropdown,
		DropdownHeader,
		DropdownItem,
		DropdownDivider,
		Footer, FooterCopyright, FooterLinkGroup, FooterLink
	} from 'flowbite-svelte';
	import Loginout from '$lib/components/Loginout.svelte';
	import ErrorMsg from '$lib/components/ErrorMsg.svelte';
	import { userStore } from '$lib/stores/user';
	import type { OldapUser } from '$lib/oldap/classes/user';
	import ProjectSelector from '$lib/components/ProjectSelector.svelte';
	import { page } from '$app/state';


	let { children } = $props();
	let avatar_img = "/images/User_Avatar.png"
	let loginDialog = $state(false);
	let logged_in = $state(false);
	let family_name = $state('');
	let given_name = $state('');
	let gravatar_url = $state('');
	let dropdownOpen = $state(false);
	let loginout: Loginout;
	let activeUrl = $derived(page.url.pathname)

	//activeUrl = page.url.pathname;

	/**
	 * Retrieve the Gravatar Avatar icon
	 *
	 * @param email Email adress of user
	 * @param size Size of gravatar image
	 * @returns URL to fetch gravatar image
	 */
	function getGravatarUrl(email: string, size: number = 200): string {
		// Convert email to lowercase and trim whitespace
		const trimmedEmail = email.trim().toLowerCase();

		// Generate MD5 hash of the email
		const hash = md5(trimmedEmail).toString();

		// Construct the Gravatar URL with optional size parameter
		return `https://www.gravatar.com/avatar/${hash}?s=${size}`;
	}

	/**
	 * Perform a logout
	 */
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
			family_name = '';
			given_name = '';
			gravatar_url = '';
		}
	})

</script>
<!-- <Icon.UserSolid /> -->
<ParaglideJS {i18n}>

	<!-- container for everything... -->
	<div class="flex px-2 flex-col min-h-screen">

		<!-- navigation bar -->
		<Navbar class="top-0 px-2 sm:px-4 py-2.5 fixed w-full z-20 start-0 border-b">
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
					<div class="p-3">{given_name} {family_name}</div> <Avatar id="avatar-menu" src={gravatar_url} />
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
			<!--<div>
			</div> -->

			<NavHamburger />
			<NavUl {activeUrl}>
				<NavLi href="/" active={true}>Home</NavLi>
				<NavLi href="/about">About</NavLi>
				{#if logged_in}
					<NavLi href="/admin">Admin</NavLi>
					<ProjectSelector />
				{/if}
			</NavUl>
		</Navbar>

		<div class="h-20"></div>
		<!-- Scrollable Content -->
		<div class="flex-grow overflow-y-auto bg-gray-100 p-1 pb-8">
			{@render children()}
		</div>

		<!-- footer -->
		<Footer class="sticky bottom-0 border-t py-4 px-2">
			<div class="sm:flex sm:items-center sm:justify-between">
				<FooterCopyright href="/" by="L. Rosenthaler" year={2025} copyrightMessage="(All rights reserved)"/>
				<FooterLinkGroup ulClass="flex flex-wrap items-center mt-3 text-sm text-gray-500 dark:text-gray-400 sm:mt-0">
					<FooterLink href="/about">About</FooterLink>
					<FooterLink href="/">Privacy Policy</FooterLink>
					<FooterLink href="/">Licensing</FooterLink>
					<FooterLink href="mailto:lukas.rosenthaler@gmail.com?subject=OLDAP">Contact</FooterLink>
				</FooterLinkGroup>
			</div>
		</Footer>
	</div>
	<ErrorMsg />
</ParaglideJS>
