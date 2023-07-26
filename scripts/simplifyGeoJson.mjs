import * as turf from '@turf/turf';
import { promises as fsPromises } from 'fs';

async function main() {
	const bigGeoJSON = await JSON.parse(await fsPromises.readFile('./cdt.geojson'));

	// Get command line arguments
	const args = process.argv.slice(2);
	const tolerance = args[0];

	// Create output file name based on tolerance
	const fileName = `simplified-${tolerance.replace('.', '')}.geojson`;

	// Rest of logic...

	console.log({ args, tolerance: +tolerance, fileName });

	// Create a new FeatureCollection to hold the simplified data
	const simplified = {
		type: 'FeatureCollection',
		features: []
	};

	bigGeoJSON.features.forEach((feature) => {
		const simplifiedLines = turf.simplify(feature, {
			tolerance: +tolerance,
			highQuality: false
		});

		simplified.features.push(simplifiedLines);
	});

	await fsPromises.writeFile(fileName, JSON.stringify(simplified));

	console.log(`Simplified GeoJSON written to ${fileName}`);
}

main();
