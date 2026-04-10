import { UniversityPlannerClient } from './universityplanner';

export const API_URL = 'https://apache.prod.up.cineca.it/api';
export const UNIBO_CLIENT = '5ad08435b6ca5357dbac609e';

export function createUPClient(fetch: (url: string, init?: RequestInit) => Promise<Response>) {
	return new UniversityPlannerClient(API_URL, UNIBO_CLIENT, fetch);
}
