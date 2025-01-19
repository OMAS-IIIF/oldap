import axios from 'axios';
import { errorInfoStore } from '$lib/stores/errorinfo';
import { Severity } from '$lib/interfaces/errorinfo';
import * as m from '$lib/paraglide/messages.js'

export const process_api_error = (error: unknown) => {
	if (axios.isAxiosError(error)) {
		errorInfoStore.set({
			errormsg: error.response?.data.message as string && `${error.code} : ${error.message}`,
			errorcode: error.response?.status ?? 500,
			severity: Severity.ERROR,
		});
	}
	else {
		errorInfoStore.set({
			errormsg: m.unkown_api_error({num: 1}),
			errorcode: 500,
			severity: Severity.ERROR,
		});
	}
	console.log("***ERROR***:", error);
	return
}

