export interface Tool {
	name: string;
	description: string;
}

// Exact name, then name prefix, then a word of the name (after - _ . /), then
// anywhere in the name; then the description: a whole word, a word start, anywhere.
function rank(tool: Tool, query: string): number {
	const name = tool.name.toLowerCase();
	if (name === query) return 0;
	if (name.startsWith(query)) return 1;
	const at = name.indexOf(query);
	if (at > 0 && /[-_./]/.test(name[at - 1])) return 2;
	if (at > 0) return 3;
	const description = tool.description.toLowerCase();
	const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
	if (new RegExp(`(^|[^a-z0-9])${escaped}($|[^a-z0-9])`).test(description)) return 4;
	if (new RegExp(`(^|[^a-z0-9])${escaped}`).test(description)) return 5;
	if (description.includes(query)) return 6;
	return -1;
}

/** Tools matching the query, best matches first; shorter names win within a rank. */
export function searchTools(tools: Tool[], query: string, limit = 8): Tool[] {
	const q = query.trim().toLowerCase();
	if (!q) return [];
	return tools
		.map((tool) => ({ tool, rank: rank(tool, q) }))
		.filter((hit) => hit.rank >= 0)
		.sort((a, b) => a.rank - b.rank || a.tool.name.length - b.tool.name.length || a.tool.name.localeCompare(b.tool.name))
		.slice(0, limit)
		.map((hit) => hit.tool);
}
