import type { Dayjs } from 'dayjs';
import type { Aula, Impegno } from './types';

export class UniversityPlannerClient {
	private readonly baseUrl: string;
	private readonly clientId: string;
	private readonly fetch: (url: string, init?: RequestInit) => Promise<Response>;

	constructor(
		baseUrl: string,
		clientId: string,
		fetch: (url: string, init?: RequestInit) => Promise<Response>
	) {
		this.baseUrl = baseUrl;
		this.clientId = clientId;
		this.fetch = fetch;
	}

	async getAule(
		idCalendario: string,
		options: { order?: string; limit?: number; auleIds?: string[] } = {}
	): Promise<Aula[] | { error: { statusCode: number; codiceErrore: string } }> {
		return this.post<Aula[] | { error: { statusCode: number; codiceErrore: string } }>(
			'Aule/getAulePerCalendarioPubblico',
			{
				linkCalendarioId: idCalendario,
				order: options.order ?? 'edificio.codice, descrizione',
				auleIds: options.auleIds ?? [],
				edificiIds: [],
				limit: options.limit ?? 250
			}
		);
	}

	async getImpegni(
		idCal: string,
		{
			dataFine,
			dataInizio,
			limitaRisultati = false,
			mostraImpegniAnnullati = false,
			mostraIndisponibilitaTotali = true,
			idAule = []
		}: {
			dataFine: Dayjs;
			dataInizio: Dayjs;
			limitaRisultati?: boolean;
			mostraImpegniAnnullati?: boolean;
			idAule: string[];
			mostraIndisponibilitaTotali?: boolean;
		}
	): Promise<Impegno[]> {
		return this.post<Impegno[]>('Impegni/getImpegniCalendarioPubblico', {
			linkCalendarioId: idCal,
			dataInizio,
			dataFine,
			auleIds: idAule,
			aule: idAule,
			limitaRisultati,
			mostraImpegniAnnullati,
			mostraIndisponibilitaTotali,
			pianificazioneTemplate: false
		});
	}

	private async query<T>(
		method: string,
		endpoint: string,
		body: Record<string, unknown>
	): Promise<T> {
		const url = `${this.baseUrl}/${endpoint}`;
		const res = await this.fetch(url, {
			method: method,
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ ...body, clienteId: this.clientId })
		});
		return await res.json();
	}

	private async get<T>(endpoint: string, body: Record<string, unknown>): Promise<T> {
		return await this.query<T>('GET', endpoint, body);
	}

	private async post<T>(endpoint: string, body: Record<string, unknown>): Promise<T> {
		return await this.query<T>('POST', endpoint, body);
	}
}
