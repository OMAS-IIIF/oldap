import type { XsdDatatypes } from '$lib/oldap/enums/xsd_datatypes';
import type { Iri } from '$lib/oldap/types/xsd_iri';
import type { LangString } from '$lib/oldap/types/langstring';
import type { Language } from '$lib/oldap/enums/language';

export type LanguageIn = Set<Language>;
export type InSet = Set<string|number|Iri>
export type AttributeDataType = XsdDatatypes | boolean | number | string | Iri | LangString | Language | LanguageIn | InSet;

