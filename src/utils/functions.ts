export function generateDate(): string {
	const date = new Date();
	const [day, month, year] = [
		date.getDate(),
		date.getMonth() + 1,
		date.getFullYear()
	];

	return `${day < 10 ? `0${day}` : day}-${
		month < 10 ? `0${month}` : month
	}-${year}`;
}
