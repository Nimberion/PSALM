<template>
	<!--### TABLE OF CONTENT ###
		##
		##  C
		##  C
		##  E
		##  TRUE
		##  F
		##
		#########################-->
	<!-- FALSE -->
	<svg v-if="name === 'FALSE'" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="currentColor">
		<path d="M0 0h24v24H0V0z" fill="none" />
		<path d="M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z" />
	</svg>
	<!-- INDISPOSED -->
	<svg v-else-if="name === 'INDISPOSED'" xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" width="1em" height="1em" viewBox="0 0 24 24" fill="currentColor">
		<rect fill="none" height="24" width="24" />
		<path
			d="M3,5v14c0,1.1,0.9,2,2,2h14c1.1,0,2-0.9,2-2V5c0-1.1-0.9-2-2-2H5C3.9,3,3,3.9,3,5z M16.3,16.29L16.3,16.29 c-0.39,0.39-1.02,0.39-1.41,0L12,13.41l-2.89,2.89c-0.39,0.39-1.02,0.39-1.41,0l0,0c-0.39-0.39-0.39-1.02,0-1.41L10.59,12L7.7,9.11 c-0.39-0.39-0.39-1.02,0-1.41l0,0c0.39-0.39,1.02-0.39,1.41,0L12,10.59l2.89-2.88c0.39-0.39,1.02-0.39,1.41,0l0,0 c0.39,0.39,0.39,1.02,0,1.41L13.41,12l2.89,2.88C16.68,15.27,16.68,15.91,16.3,16.29z"
		/>
	</svg>
	<!-- RESERVE -->
	<svg v-else-if="name === 'RESERVE'" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="currentColor">
		<path d="M0 0h24v24H0z" fill="none" />
		<path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-3 10H8c-.55 0-1-.45-1-1s.45-1 1-1h8c.55 0 1 .45 1 1s-.45 1-1 1z" />
	</svg>
	<!-- TRUE -->
	<svg v-else-if="name === 'TRUE'" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="currentColor">
		<path d="M0 0h24v24H0V0z" fill="none" />
		<path
			d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-8.29 13.29c-.39.39-1.02.39-1.41 0L5.71 12.7c-.39-.39-.39-1.02 0-1.41.39-.39 1.02-.39 1.41 0L10 14.17l6.88-6.88c.39-.39 1.02-.39 1.41 0 .39.39.39 1.02 0 1.41l-7.58 7.59z"
		/>
	</svg>
	<div v-else class="text-xs">Error</div>
</template>

<script lang="ts">
	import { Component, Prop, Vue } from "vue-property-decorator";

	@Component({
		name: "ProjectAvailabilityIcon",
	})
	export default class ProjectAvailabilityIcon extends Vue {
		@Prop({ required: true }) name!: string;
	}
</script>
