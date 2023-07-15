import type { PageLoad } from './$types';

interface Row {
	datetime: string;
	date: string;
	time: string;
	latitude: number;
	longitude: number;
	elevation_ft: number;
	message: string;
}

export const load: PageLoad = async ({ fetch }) => {
	let jsonData = [];
	const result = await fetch(
		'https://docs.google.com/spreadsheets/d/e/2PACX-1vSaRMESqn3gBGCV0MsQz8_2eVwu1XX7oBdxyhqXw87QowKXZcINHNGrxVZS2CDgJ0F3UEsgWccUI7Px/pub?output=csv'
	);
	const text = await result.text();
	const rows = text.split('\n');
	const headers = rows[0].split(',').map((s) => s.toLowerCase().trim());

	for (let i = 1; i < rows.length; i++) {
		const row = rows[i].split(',');
		const obj = {} as Row;
		for (let j = 0; j < headers.length; j++) {
			obj[headers[j]] = row[j];
		}
		jsonData.push(obj);
	}

	return {
		markers: jsonData
	};
};
