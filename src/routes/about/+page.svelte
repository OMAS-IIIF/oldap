<script lang="ts">

import { Card } from 'flowbite-svelte';
</script>
<div  class="flex flex-row space-y-4">
	<Card img="/images/logo-svg-full.svg"></Card>
	<Card>
		<h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
			Open Linked Data Application Platform
		</h5>
		<p class="mb-3 font-normal text-gray-700 dark:text-gray-400 leading-tight">
			The "Open Linked Data Application Platform" (OLDAP) is a generic tool that is based on Linked Open Data.
			Build onto a RDF*star compatible triplestore, it offers a RESTful API as middleware whcih makes possible
			to use the RDF triplestore including SHACL and OWL without deep knowledge about these technologies. It
			allows to create ontologies (data models), add/modify data, perform queries etc.
			The oldap APP is a generic webapp to use the system.
		</p>
		<p class="mb-3 font-normal text-gray-700 dark:text-gray-400 leading-tight">
			OLDAP also supports the IIIF-standard for dealing with media of any kind.
		</p>
		<p class="mb-3 font-normal text-gray-700 dark:text-gray-400 leading-tight">
			OLDAP is open source accoding to the XX-Creative Commons licence.
		</p>
	</Card>
</div>