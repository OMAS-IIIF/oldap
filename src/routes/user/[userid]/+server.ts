import { json } from '@sveltejs/kit';

import { createApiClient, endpoints } from '$lib/oldap/schemata/zod-old';
import { isErrorFromAlias } from '@zodios/core';
import { AxiosError } from 'axios';

export async function GET({params, request}): Promise<Response> {
	const token = sessionStorage.getItem('token');
	const { userid } = params;
	const { url } = await request.json();

	const config = {
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json; utf-8',
			'Access-Control-Allow-Origin': '*', // Allow all origins
			'Access-Control-Allow-Methods': 'GET, POST, OPTIONS', // Allowed HTTP methods
			'Access-Control-Allow-Headers': 'Content-Type', // Allowed headers
			'Authorization': 'Bearer ' + token,
		},
		params: { userId: userid },
	}

	const client = createApiClient(url);
	try {
		const userdata = client.getAdminuserUserId(config);
		return json( { success: true, userdata: userdata } );
	}
	catch (error) {
		if (isErrorFromAlias(endpoints, "getAdminuserUserId", error)) {
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