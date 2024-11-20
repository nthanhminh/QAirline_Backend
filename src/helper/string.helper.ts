export const extractTokenFromRequest = (request): string => {
	// Extract the token from the Authorization header
	const authorizationHeader = request?.headers?.authorization;
	if (authorizationHeader && authorizationHeader?.startsWith('Bearer ')) {
		return authorizationHeader.slice(7); // 'Bearer ' is 7 characters long
	}

	return null;
};

export function getTokenFromHeader(headers: {
	[key: string]: string;
}): string | undefined {
	const authHeader = headers['authorization'];
	if (authHeader && authHeader.startsWith('Bearer ')) {
		return authHeader.split(' ')[1]; // Return the token part
	}
	return undefined; // Return undefined if no token is found
}

export const escapeRegex = (string) => {
	return string.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
};