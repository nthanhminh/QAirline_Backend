export const extractTokenFromRequest = (request): string => {
	const authorizationHeader = request?.headers?.authorization;
	if (authorizationHeader && authorizationHeader?.startsWith('Bearer ')) {
		return authorizationHeader.slice(7); 
	}

	return null;
};

export function getTokenFromHeader(headers: { [key: string]: string }): string | undefined {
    const authHeader = headers['authorization'] || headers['Authorization']; 

    if (authHeader && authHeader.startsWith('Bearer ')) {
        return authHeader.split(' ')[1];  
    }

    return undefined;  
}


export const escapeRegex = (string) => {
	return string.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
};