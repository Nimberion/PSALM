export interface EmployeeAvailability {
	id: string;
	available: boolean;
	deployed: boolean;
	reserve: boolean;
	indisposed: boolean;
}

export interface ProjectEvent {
	id: string;
	title: string;
	staffAvailability: Array<EmployeeAvailability>;
}

export interface Project {
	id: string;
	title: string;
	numberOfRequiredStaff: number;
	events: Array<Event>;
}
