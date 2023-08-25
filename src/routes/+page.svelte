<script lang="ts">
	/** @type {import('./$types').PageData} */
	import { MapLibre, Marker, Popup, GeoJSON, LineLayer } from 'svelte-maplibre';
	import { mdiMapMarker } from '@mdi/js';
	import Icon from 'mdi-svelte';
	import * as turf from '@turf/turf';
	import { format } from 'd3-format';
	export let data;

	const formatMiles = format('.2s');

	$: markers = data.markers;
	$: cdtGeoJson = data.cdtGeoJson;

	$: pathData = {
		type: 'Feature',
		properties: {
			name: 'Path'
		},
		geometry: {
			type: 'LineString',
			coordinates: [...markers.map((m) => [m.longitude, m.latitude])]
		}
	};

	interface LineMarker {
		distance: number;
		midpoint: turf.helpers.Position;
	}

	let lineMarkers: LineMarker[] = [];

	$: {
		if (markers && cdtGeoJson) {
			for (let startMarkerIndex = 0; startMarkerIndex < markers.length - 1; startMarkerIndex++) {
				let endPointIndex = startMarkerIndex + 1;
				let startPoint = turf.point([
					markers[startMarkerIndex].longitude,
					markers[startMarkerIndex].latitude
				]);
				let endPoint = turf.point([
					markers[endPointIndex].longitude,
					markers[endPointIndex].latitude
				]);
				let distance = turf.distance(startPoint, endPoint, { units: 'miles' });
				let midpoint = turf.midpoint(startPoint, endPoint);

				lineMarkers.push({
					distance,
					midpoint: midpoint.geometry.coordinates
				});
			}
		}
	}
</script>

<svelte:head>
	<title>Danger Dave CDT Progress</title>
</svelte:head>

<div>
	<MapLibre
		style="https://api.maptiler.com/maps/outdoor-v2/style.json?key=5bZgbbfhKetusy1e0Lra"
		standardControls
		center={[-113.659615, 48.995805]}
		zoom={8}
	>
		{#if cdtGeoJson}
			<GeoJSON data={cdtGeoJson} generateId={true}>
				<LineLayer
					layout={{ 'line-cap': 'round', 'line-join': 'round' }}
					paint={{
						'line-width': 1,
						'line-color': '#FF0000',
						'line-opacity': 0.8
					}}
				/>
			</GeoJSON>
		{/if}
		<GeoJSON data={pathData} generateId={true}>
			<LineLayer
				layout={{ 'line-cap': 'round', 'line-join': 'round' }}
				paint={{
					'line-width': 2,
					'line-color': '#008800',
					'line-opacity': 0.8
				}}
			/>
		</GeoJSON>
		{#each markers as { longitude, latitude, date, time, message, datetime, elevation_m, elevation_ft } (datetime)}
			<Marker lngLat={[longitude, latitude]} class="relative h-12">
				<div class="absolute -top-8">
					<div class="w-32 text-center text-white bg-black opacity-75 rounded p-1 font-medium">
						{date} - {time}
					</div>
				</div>
				<div class="-top-12">
					<div class="text-red-700">
						<Icon path={mdiMapMarker} />
					</div>
				</div>

				<Popup openOn="click" offset={[0, -10]}>
					<div class="text-lg font-bold">{message}</div>
					<div class="text-sm">{datetime} @ {elevation_m}m ({elevation_ft}ft)</div>
					<div class="text-sm">Longitude: {longitude} / Latitude: {latitude}</div>
				</Popup>
			</Marker>
		{/each}
		{#each lineMarkers as { midpoint, distance }}
			<Marker lngLat={[midpoint[0], midpoint[1]]} class="relative">
				<div class="absolute -left-6 -top-3">
					<div class="whitespace-nowrap text-center text-black bg-white text-xs rounded-lg px-1 py-0.5">
						{distance > 1 ? `${formatMiles(distance)} miles` : formatMiles(distance)}
					</div>
				</div>
			</Marker>
		{/each}
	</MapLibre>
</div>
