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
		<path d="M19 5v14H5V5h14m2-2H3v18h18V3z" />
	</svg>
	<!-- INDISPOSED -->
	<svg v-else-if="name === 'INDISPOSED'" xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" width="1em" height="1em" viewBox="0 0 24 24" fill="currentColor">
		<rect fill="none" height="24" width="24" />
		<path d="M3,3v18h18V3H3z M17,15.59L15.59,17L12,13.41L8.41,17L7,15.59L10.59,12L7,8.41L8.41,7L12,10.59L15.59,7L17,8.41L13.41,12 L17,15.59z" />
	</svg>
	<!-- RESERVE -->
	<svg v-else-if="name === 'RESERVE'" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="currentColor">
		<path d="M0 0h24v24H0z" fill="none" />
		<path d="M21 3H3v18h18V3zm-4 10H7v-2h10v2z" />
	</svg>
	<!-- TRUE || HOSPITATION -->
	<svg v-else-if="name === 'TRUE' || name === 'HOSPITATION'" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="currentColor">
		<path d="M0 0h24v24H0V0z" fill="none" />
		<path d="M21 3H3v18h18V3zM10 17l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
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
