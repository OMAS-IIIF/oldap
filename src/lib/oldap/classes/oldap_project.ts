import type { Iri } from '$lib/oldap/types/xsd_iri';
import type { NCName } from '$lib/oldap/types/xsd_ncname';


export class OldapProject {
	#projectIri: Iri;
	#projectShortName: NCName;
	#namespaceIri: Iri;
	label?: string;
	comment?: string;
	projectStart?: Date;
	projectEnd?: Date;

	constructor(projectIri: Iri,
							projectShortName: NCName,
							namespaceIri: Iri,
							label?: string,
							comment?: string,
							projectStart?: Date,
							projectEnd?: Date) {
		this.#projectIri = projectIri;
		this.#projectShortName = projectShortName;
		this.#namespaceIri = namespaceIri;
		this.label = label;
		this.comment = comment;
		this.projectStart = projectStart;
		this.projectEnd = projectEnd;
	}

	get projectIri() {
		return this.#projectIri;
	}

	get projectShortName() {
		return this.#projectShortName;
	}

	get namespaceIri() {
		return this.#namespaceIri;
	}
}