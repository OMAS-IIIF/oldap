import { createApiClient } from '$lib/oldap/schemata/zod';
const apiUrl = import.meta.env.VITE_API_URL;


export const apiClient = createApiClient(apiUrl);