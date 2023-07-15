<script lang="ts">
	/** @type {import('./$types').PageData} */
	import { MapLibre, Marker, Popup } from 'svelte-maplibre';
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
				<div class="text-black grid place-items-center">
					<div class="font-medium">{date} - {time}</div>
					<div class="shadow rounded-full bg-red-500 w-4 h-4" />
				</div>

				<Popup openOn="hover" offset={[0, -10]}>
					<div class="text-lg font-bold">{message}</div>
				</Popup>
			</Marker>
		{/each}
	</MapLibre>
</div>
