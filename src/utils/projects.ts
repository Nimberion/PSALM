import { Available } from "@/models/enums/Available";
import { Deployed } from "@/models/enums/Deployed";
import { Employee } from "@/models/interfaces/Employee";
import { EmployeeAvailability, Project } from "@/models/interfaces/Project";
import store from "@/store";
import { save } from "@tauri-apps/api/dialog";
import { removeFile, writeBinaryFile, writeFile } from "@tauri-apps/api/fs";
import { jsPDF } from "jspdf";
import { formatDate, pathExists } from "./utils";

export function findEmployeeAvailability(staffAvailability: Array<EmployeeAvailability>, employeeId: string): EmployeeAvailability | undefined {
	return staffAvailability.find((e) => e.employeeId === employeeId);
}

export function getNumberOfAvailabilities(project: Project, employeeId: string): number {
	return project.projectDays.filter((e) => findEmployeeAvailability(e.staffAvailability, employeeId)?.available === Available.TRUE).length;
}

export function getNumberOfDeployments(project: Project, employeeId: string): number {
	return project.projectDays.filter((e) => findEmployeeAvailability(e.staffAvailability, employeeId)?.deployed === Deployed.TRUE).length;
}

export function getNumberOfReserves(project: Project, employeeId: string): number {
	return project.projectDays.filter((e) => findEmployeeAvailability(e.staffAvailability, employeeId)?.deployed === Deployed.RESERVE).length;
}

export function getSetPointOfDeployments(project: Project, staff: Array<Employee>, employee: Employee): number | string {
	if (employee.fullTime) {
		return "-";
	} else if (project.numberOfRequiredStaff === 0) {
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
		} else if (isNaN(setPointOfDeployments) || setPointOfDeployments < 0) {
			return "0";
		} else {
			return setPointOfDeployments;
		}
	}
}

export function getSetPointOfReserves(project: Project, staff: Array<Employee>, employee: Employee): number | string {
	// GET NUMBER OF ALL POSSIBLE RESERVES (MINUS RESERVES OF FULL TIME)
	let possibleReserves = project.projectDays.length;

	staff.forEach((tempEmployee) => {
		if (tempEmployee.fullTime) {
			possibleReserves -= getNumberOfReserves(project, tempEmployee.id);
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
	const setPointOfReserves = Math.round((getNumberOfAvailabilities(project, employee.id) / allAvailabilities) * possibleReserves * 10) / 10;
	const employeeAvailability = getNumberOfAvailabilities(project, employee.id);

	if (setPointOfReserves > employeeAvailability) {
		return employeeAvailability;
	} else if (isNaN(setPointOfReserves) || setPointOfReserves < 0) {
		return "0";
	} else {
		return setPointOfReserves;
	}
}

export async function writePdfForEachEmployee(project: Project, path: string, selectedEmployeesForPdfExport: Array<string>): Promise<void> {
	const staff = store.state.tempStaff;

	project.staff
		.filter((e) => selectedEmployeesForPdfExport.includes(e))
		.forEach(async (employeeId) => {
			const employee = staff.find((e) => e.id === employeeId);
			const deployedProjectDays: Array<{ date: string; time: string; participant: string; annotation: string }> = [];

			if (employee) {
				project.projectDays.forEach((projectDay) => {
					const deployedProjectDay = projectDay.staffAvailability.find((e) => e.employeeId === employeeId && e.deployed !== Deployed.FALSE);

					if (deployedProjectDay) {
						let annotation = "-";

						if (deployedProjectDay.deployed === Deployed.RESERVE) {
							annotation = "Reserve";
						} else if (deployedProjectDay.deployed === Deployed.HOSPITATION) {
							annotation = "Hospitation";
						}

						deployedProjectDays.push({ date: formatDate(projectDay.date) || "-", time: projectDay.time || "-", participant: projectDay.participant || "-", annotation: annotation });
					}
				});

				if (deployedProjectDays.length) {
					const doc = new jsPDF({ format: "a4", orientation: "p", unit: "mm" });
					doc.setFontSize(20);
					doc.text(project.title, 105, 25, { align: "center", maxWidth: 160 });
					doc.setFontSize(14);
					doc.text(`Name: ${employee.firstName} ${employee.lastName}`, 25, 45);

					doc.table(
						25,
						55,
						deployedProjectDays,
						[
							{ name: "date", prompt: "Datum", align: "center", padding: 0, width: 38 },
							{ name: "time", prompt: "Uhrzeit", align: "center", padding: 0, width: 42 },
							{ name: "participant", prompt: "Teilnehmer", align: "center", padding: 0, width: 90 },
							{ name: "annotation", prompt: "Anmerkung", align: "center", padding: 0, width: 40 },
						],
						{ padding: 3, printHeaders: true, autoSize: false },
					);
					const filename = `${employee.lastName.replaceAll(" ", "_")}_${employee.firstName.replaceAll(" ", "_")}_-_${project.title.replaceAll(" ", "_")}.pdf`;

					// DELETE OLD FILE
					if (await pathExists(path, `${path}\\${filename}`)) {
						await removeFile(`${path}\\${filename}`);
					}

					// WRITE NEW FILE
					await writeBinaryFile({ contents: doc.output("arraybuffer"), path: `${path}\\${filename}` });
				}
			}
		});
}

export async function saveCSVFile(project: Project): Promise<void> {
	const path = await save({ filters: [{ name: "CSV", extensions: ["csv"] }] });

	if (path) {
		let CSVContent = `${project.title};\r\n\r\n`;
		const header = [";;;;", ";;;;", ";Statistik;;;", ";Kann;Ist;Soll;"];
		project.projectDays.forEach((projectDay) => {
			header[0] += `${formatDate(projectDay.date)};;`;
			header[1] += `${projectDay.time};;`;
			header[2] += `${projectDay.participant};;`;
			header[3] += "Kann;Ist;";
		});

		header.forEach((e) => {
			CSVContent += `${e}\r\n`;
		});

		const staff = store.state.tempStaff.filter((item) => project.staff.includes(item.id));

		staff.forEach((employee) => {
			let row = `${employee.firstName} ${employee.lastName};${getNumberOfAvailabilities(project, employee.id)};1: ${getNumberOfDeployments(project, employee.id)}, R: ${getNumberOfReserves(project, employee.id)};${
				employee.fullTime ? "-" : `1: ${getSetPointOfDeployments(project, staff, employee)}, R: ${getSetPointOfReserves(project, staff, employee)}`
			};`;

			project.projectDays.forEach((projectDay) => {
				row += `${(findEmployeeAvailability(projectDay.staffAvailability, employee.id)?.available as Available).toString()};${(findEmployeeAvailability(projectDay.staffAvailability, employee.id)?.deployed as Deployed).toString()};`;
			});

			row = row.replaceAll("TRUE", "1").replaceAll("FALSE", "").replaceAll("RESERVE", "R").replaceAll("HOSPITATION", "H").replaceAll("INDISPOSED", "X");

			console.log(row);

			CSVContent += `${row}\r\n`;
		});

		let totalStatistics = "Gesamt;;;;";
		project.projectDays.forEach((projectDay) => {
			totalStatistics += `${projectDay.staffAvailability.filter((e) => e.available === "TRUE").length};${projectDay.staffAvailability.filter((e) => e.deployed === "TRUE" || e.deployed === "RESERVE").length};`;
		});

		CSVContent += `${totalStatistics}\r\n`;

		await writeFile({ contents: CSVContent, path: path });
	}
}
