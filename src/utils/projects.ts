import { Available } from "@/models/enums/Available";
import { Deployed } from "@/models/enums/Deployed";
import { Employee } from "@/models/interfaces/Employee";
import { EmployeeAvailability, Project } from "@/models/interfaces/Project";

export function findEmployeeAvailability(staffAvailability: Array<EmployeeAvailability>, employeeId: string): EmployeeAvailability | undefined {
	return staffAvailability.find((e) => e.employeeId === employeeId);
}

export function getNumberOfAvailabilities(project: Project, employeeId: string): number {
	let i = 0;

	project.projectDays.forEach((e) => {
		const isEmployeeAvailable = findEmployeeAvailability(e.staffAvailability, employeeId)?.available;

		if (isEmployeeAvailable === Available.TRUE) {
			i++;
		}
	});

	return i;
}

export function getNumberOfDeployments(project: Project, employeeId: string): number {
	let i = 0;

	project.projectDays.forEach((e) => {
		const isEmployeeAvailable = findEmployeeAvailability(e.staffAvailability, employeeId)?.deployed;

		if (isEmployeeAvailable === Deployed.TRUE) {
			i++;
		}
	});

	return i;
}

export function getSetPointOfDeployments(project: Project, staff: Array<Employee>, employee: Employee): number | string {
	if (employee.fullTime) {
		return "-";
	} else {
		// GET NUMBER OF ALL POSSIBLE DEPLOYMENTS (MINUS DEPLOYMENTS OF FULL TIME)
		let possibleDeployments = project.numberOfRequiredStaff * project.projectDays.length;

		staff.forEach((tempEmployee) => {
			if (tempEmployee.fullTime) {
				possibleDeployments -= getNumberOfDeployments(project, tempEmployee.id);
			}
		});

		// GET NUMBER OF ALL STAFF AVAILABILITIES (EXCEPT FOR FULL TIME)
		let allAvailabilities = 0;

		staff.forEach((tempEmployee) => {
			if (!tempEmployee.fullTime) {
				allAvailabilities += getNumberOfAvailabilities(project, tempEmployee.id);
			}
		});

		// RETURN SET POINT BASED ON THE PERCENTAGE AVAILABILITY, BUT NOT HIGHTER THAN THE OWN AVAILABILITY
		const setPointOfDeployments = Math.round((getNumberOfAvailabilities(project, employee.id) / allAvailabilities) * possibleDeployments * 10) / 10;
		const employeeAvailability = getNumberOfAvailabilities(project, employee.id);

		if (setPointOfDeployments > employeeAvailability) {
			return employeeAvailability;
		} else {
			return setPointOfDeployments;
		}
	}
}
