export default function trim(str, all) {
	return all ? str.trim().replace(/\s+/g, ' ') : str.trim();
}