import { writable } from 'svelte/store';
import type { ErrorInfo } from '$lib/interfaces/errorinfo';


export const errorInfoStore = writable<ErrorInfo | null>(null);