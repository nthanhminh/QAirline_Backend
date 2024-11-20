import { User } from '@modules/users/entity/user.entity';
import { Request } from 'express';

export interface RequestWithUser extends Request {
	user: User;
}
