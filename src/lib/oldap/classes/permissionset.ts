import { OldapObject } from '$lib/oldap/classes/object';
import type { NCName } from '$lib/oldap/types/xsd_ncname';
import { jsonToLangString, type LangString } from '$lib/oldap/types/langstring';
import { Iri } from '$lib/oldap/types/xsd_iri';
import { type DataPermission, stringToDataPermission } from '$lib/oldap/enums/data_permissions';
import { OldapErrorApiFailure } from '$lib/oldap/errors/OldapErrorApiFailure';

export class PermissionSet extends OldapObject {
	permissionSetId: NCName;
	label?: LangString;
	comment?: LangString;
	definedByProject: Iri;
	givesPermission: DataPermission;

	constructor(creator: Iri,
							created: Date,
							contributor: Iri,
							modified: Date,
							permissionSetId: NCName,
							definedByProject: Iri,
							givesPermission: DataPermission,
							label?: LangString,
							comment?: LangString) {
		super(creator, created, contributor, modified);
		this.permissionSetId = permissionSetId;
		this.definedByProject = definedByProject;
		this.givesPermission = givesPermission;
		this.label = label;
		this.comment = comment;
	}

	static fromOldapJson(json: any): PermissionSet {
		const creator = new Iri(json.creator);
		const created = new Date(json.created);
		const contributor = new Iri(json.contributor);
		const modified = new Date(json.modified);
		const permissionSetId = json.permissionSetId;
		const definedByProject = new Iri(json?.definedByProject);
		const givesPermission = stringToDataPermission(json?.givesPermission);
		const label = jsonToLangString(json?.label);
		const comment = jsonToLangString(json?.comment);

		if (givesPermission === undefined) {
			throw new OldapErrorApiFailure("Didn't get DataPermission.")
		}
		return new PermissionSet(
			creator, created, contributor, modified, permissionSetId,
			definedByProject, givesPermission, label, comment
		);
	}

}