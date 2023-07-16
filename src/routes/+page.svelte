<script lang="ts">
	/** @type {import('./$types').PageData} */
	import { MapLibre, Marker, Popup, GeoJSON, LineLayer } from 'svelte-maplibre';
	import { mdiMapMarker } from '@mdi/js';
	import Icon from 'mdi-svelte';
	export let data;

	$: pathData = {
		type: 'Feature',
		properties: {
			name: 'Path'
		},
		geometry: {
			type: 'LineString',
			coordinates: [...data.markers.map((m) => [m.longitude, m.latitude])]
		}
	};
</script>

<svelte:head>
	<title>Danger Dave CDT Progress</title>
</svelte:head>

<div>
	<MapLibre
		style="https://api.maptiler.com/maps/outdoor-v2/style.json?key=5bZgbbfhKetusy1e0Lra"
		standardControls
		center={[-113.659615, 48.995805]}
		zoom={10}
	>
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
		{#each data.markers as { longitude, latitude, date, time, message, datetime } (datetime)}
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
				</Popup>
			</Marker>
		{/each}
	</MapLibre>
</div>
