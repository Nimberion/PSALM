export interface ActiveFilter {
	dayId: string;
	column: string;
}

export function resetActiveFilter(dayId = "", column = ""): ActiveFilter {
	return { dayId, column };
}
