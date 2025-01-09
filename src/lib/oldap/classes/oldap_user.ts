import { NCName } from '$lib/oldap/types/xsd_ncname';
import { Iri } from '$lib/oldap/types/xsd_iri';
import { QName } from '$lib/oldap/types/xsd_qname';
import { AdminPermission, stringToAdminPermission } from '$lib/oldap/enums/admin_permissions';
import { OldapErrorInvalidValue } from '$lib/oldap/errors/OldapErrorInvalidValue';


export interface InProject {
	project: Iri;
	permissions: AdminPermission[]
}

export class OldapUser {
	#userIri: Iri;
	#userId: NCName;
	isActive?: boolean;
	familyName: string;
	givenName: string;
	email: string;
	inProject?: InProject[];
	hasPermissions?: QName[];

	constructor(userIri: Iri,
							userId: NCName,
							familyName: string,
							givenName: string,
							email: string,
							isActive?: boolean,
							inProject?: InProject[],
							hasPermissions?: QName[]) {
		this.#userIri = userIri;
		this.#userId = userId;
		this.familyName = familyName;
		this.givenName = givenName;
		this.email = email;
		this.isActive = isActive;
		this.inProject = inProject
		this.hasPermissions = hasPermissions
	}

	get userIri() {
		return this.#userIri;
	}

	get userId() {
		return this.#userId;
	}

	static fromOldapJson(obj: any): OldapUser {
		const userIri = new Iri(obj.userIri);
		const userId = new NCName(obj.userId);
		const familyName = obj.family_name;
		const givenName = obj.given_name;
		const email = obj.email;
		const is_active = obj?.isActive;

		let in_project: InProject[] | undefined = undefined;
		if (obj?.in_projects) {
			if (Array.isArray(obj.in_projects)) {
				in_project = obj.in_projects.map((item: {project: string, permissions: string[]}): InProject => {
					const permissions = item.permissions.map((x) => (stringToAdminPermission(x)))
					if (permissions === undefined) {
						throw new OldapErrorInvalidValue(`${obj?.in_permissions} is not a valid AdminPermission`);
					}
					return {
						project: new Iri(item.project),
						permissions: permissions as AdminPermission[],
					}
				});
			}
		}
		const has_permissions: QName[] | undefined = obj?.has_permissions.map((x: string) => (QName.createQName(x)));

		return new OldapUser(userIri, userId, familyName, givenName, email, is_active, in_project, has_permissions);
	}
}