<script lang="ts">
	/** @type {import('./$types').PageData} */
	import { MapLibre, Marker, Popup } from 'svelte-maplibre';
	import { mdiMapMarker } from '@mdi/js';
	import Icon from 'mdi-svelte';
	export let data;
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
		{#each data.markers as { longitude, latitude, date, time, message, datetime } (datetime)}
			<Marker lngLat={[longitude, latitude]}>
				<div class="grid place-items-center">
					<div class="text-white bg-black opacity-75 rounded p-1 font-medium">{date} - {time}</div>
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
