// token-blacklist.service.ts
import { Injectable } from '@nestjs/common';

@Injectable()
export class SharedService {
	private readonly blacklist: Set<string> = new Set();

	addToBlacklist(token: string) {
		this.blacklist.add(token);
	}

	isTokenRevoked(token: string): boolean {
		return this.blacklist.has(token);
	}

	getAll() {
		this.blacklist.forEach((item) => console.log('item: ', item));
	}
}
