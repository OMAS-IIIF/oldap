import { json } from '@sveltejs/kit';

import { createApiClient, endpoints } from '$lib/oldap/schemata/zod-old';
import { isErrorFromAlias } from '@zodios/core';
import { AxiosError } from 'axios';

export async function POST({params, request}): Promise<Response> {
	const { userid } = params;
	const { url, password } = await request.json();
	const client = createApiClient(url);
	const config = {
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json; utf-8',
			'Access-Control-Allow-Origin': '*', // Allow all origins
			'Access-Control-Allow-Methods': 'GET, POST, OPTIONS', // Allowed HTTP methods
			'Access-Control-Allow-Headers': 'Content-Type', // Allowed headers
		},
		params: { userId: userid },
	}
	const data = {password: password as string};
	try {
		const authdata = await client.postAdminauthUserId(data, config);
		if (authdata.token) {
			sessionStorage.setItem('token', authdata.token);
		}
		return json( { success: true, token: authdata.token } );
	}
	catch (error) {
		if (isErrorFromAlias(endpoints, "postAdminauthUserId", error)) {
			if (error.response) {
				return json({ success: false, errormsg: error.response.data.message }, { status: error.response.status });
			}
			return json({ success: false, errormsg: "Unknown API error" }, { status: 500 });
		}
		else {
			if (error instanceof AxiosError) {
				return json({ success: false, errormsg: error.code }, { status: error.status });
			}

			return json({ success: false, errormsg: "Unknown API error" }, { status: 500 });
		}
	}
}