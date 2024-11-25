export function _getSkipLimit({ page, pageSize }) {
	return {
		skip: (page - 1) * pageSize,
		limit: +pageSize,
	};
}
