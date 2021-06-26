export interface EmployeeAvailability {
	id: string;
	available: boolean;
	deployed: boolean;
	reserve: boolean;
	indisposed: boolean;
}

export interface Event {
	id: number;
	title: string;
	staffAvailability: Array<EmployeeAvailability>;
}

export interface Project {
	id: number;
	title: string;
	numberOfRequiredStaff: number;
	events: Array<Event>;
}
