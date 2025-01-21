import { Iri } from '$lib/oldap/types/xsd_iri';
import type { XsdDatatypes } from '$lib/oldap/enums/xsd_datatypes';
import type { LangString } from '$lib/oldap/types/langstring';
import type { Language } from '$lib/oldap/enums/language';
import type { InSet, LanguageIn } from '$lib/interfaces/attributeinfo';
import { OldapErrorImmutable } from '$lib/oldap/errors/OldapErrorImmutable';

export class PropertyClass {
	#subPropertyOf?: Iri;
	#classref?: Iri;
	datatype?: XsdDatatypes;
	shName?: LangString;
	description?: LangString;
	languageIn?: LanguageIn;
	uniqueLang?: boolean;
	inSet?: InSet;
	minLength?: number;
	maxLength?: number;
	pattern?: string;
	minExclusive?: number;
	minInclusive?: number;
	maxExclusive?: number;
	maxInclusive?: number;
	lessThan?: Iri;
	lessThanOrEquals?: number;

	constructor(subPropertyOf?: Iri, classref?: Iri) {
		if (subPropertyOf === undefined && classref === undefined) {
			throw new Error("gagaga");
		}
		this.#subPropertyOf = subPropertyOf;
		this.#classref = classref;
	}

}
