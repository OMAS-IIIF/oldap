<script lang="ts">

	import { userStore } from '$lib/stores/user';
	import type { InProject, OldapUser } from '$lib/oldap/classes/user';
	import { projectStore } from '$lib/stores/project';
	import type { OldapProject } from '$lib/oldap/classes/project';
	import { AdminPermission } from '$lib/oldap/enums/admin_permissions';
	import {
		TabItem,
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell,
		Tabs
	} from 'flowbite-svelte';
	import { createApiClient } from '$lib/oldap/schemata/zod';
	import type { AuthInfo } from '$lib/interfaces/authinfo';
	import { errorInfoStore } from '$lib/stores/errorinfo';
	import { Severity } from '$lib/interfaces/errorinfo';
	import * as m from '$lib/paraglide/messages.js'

	const apiUrl = import.meta.env.VITE_API_URL;

	interface UserInfo {
		userId: string;
		email: string;
		familyName: string;
		givenName: string;
		active: boolean;
	}

	let user: OldapUser | null = $state(null);
	let project: OldapProject | null = $state(null);
	let users_open = $state(false);
	let lists_open = $state(false);
	let datamodel_open = $state(false);
	let permissions_open = $state(false)

	let userlist: UserInfo[] = $state([])

	let perms = $derived.by(() => {
		let res: InProject | undefined = undefined;
		user?.inProject?.forEach((inProject) => {
			if (inProject.project.toString() === project?.projectIri.toString()) {
				res = inProject;
			}
		});
		const pp: Set<string> = new Set<string>();

		if (res !== undefined) {
			const res2 = res as InProject;
			res2.permissions.forEach((x) => {
				switch (x) {
					case AdminPermission.ADMIN_USERS: pp.add("Users"); break;
					case AdminPermission.ADMIN_LISTS: pp.add("Lists"); break;
					case AdminPermission.ADMIN_MODEL: pp.add("Datamodel"); break;
					case AdminPermission.ADMIN_PERMISSION_SETS: pp.add("Permissions"); break;
					case AdminPermission.ADMIN_OLDAP: {
						pp.add("Users");
						pp.add("Lists");
						pp.add("Datamodel");
						pp.add("Permissions");
						break;
					}
				}
			});
		}
		return pp;
	});

	userStore.subscribe(async (newuser: OldapUser | null) => {
		user = newuser;
	});

	projectStore.subscribe((newproject: OldapProject | null) => {
		project = newproject;
	})

	const client = createApiClient(apiUrl);
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
	}

	$effect(() => {

		if (users_open) {
			const config_usersearch = {
				queries: { inProject: project?.projectIri?.toString() },
				headers: {
					'Accept': 'application/json',
					'Authorization': 'Bearer ' + authinfo.token,
				},
			}
			client.getAdminusersearch(config_usersearch)
				.then((user_iris) => {
					console.log(user_iris);
					user_iris.forEach((x) => {
						const config_userdata = {
							queries: { iri: x },
							headers: {
								'Accept': 'application/json',
								'Authorization': 'Bearer ' + authinfo.token,
							},
						}
						client.getAdminuserget (config_userdata)
							.then((user) => {
								userlist.push({
									userId: user.userId,
									familyName: user.family_name,
									givenName: user.given_name,
									email: user.email,
									active: user.active,
								});
								console.log(user);
							})
							.catch((err) => {
								console.log(err);
							})
					});
				})
				.catch((err) => {
					console.log(err);
				});
		}
	})

</script>
<Tabs tabStyle="underline">
	{#each perms as perm}
		{#if perm === "Users"}
			<TabItem bind:open={users_open} title={perm}>
				<Table striped={true} hoverable={true}>
					<TableHead theadClass="text-xs uppercase divide-blue-500">
						<TableHeadCell>User ID</TableHeadCell>
						<TableHeadCell>Family name</TableHeadCell>
						<TableHeadCell>Given name</TableHeadCell>
						<TableHeadCell>Email</TableHeadCell>
						<TableHeadCell>Action</TableHeadCell>
					</TableHead>
					<TableBody tableBodyClass="divide-y">
						{#each userlist as u}
							<TableBodyRow>
								<TableBodyCell>{u.userId}</TableBodyCell>
								<TableBodyCell>{u.familyName}</TableBodyCell>
								<TableBodyCell>{u.givenName}</TableBodyCell>
								<TableBodyCell>{u.email}</TableBodyCell>
								<TableBodyCell> </TableBodyCell>
							</TableBodyRow>
						{/each}
					</TableBody>
				</Table>
			</TabItem>
		{:else if perm === "Lists"}
			<TabItem open={lists_open} title={perm}>
				gagagagagagagag agaga aga aga aga aga ag ga
			</TabItem>
		{:else if perm === "Datamodel"}
			<TabItem open={datamodel_open} title={perm}>
				gagagagagagagag agaga aga aga aga aga ag ga
			</TabItem>
		{:else if perm === "Permissions"}
			<TabItem open={permissions_open} title={perm}>
				gagagagagagagag agaga aga aga aga aga ag ga
			</TabItem>
		{/if}
	{/each}
</Tabs>

