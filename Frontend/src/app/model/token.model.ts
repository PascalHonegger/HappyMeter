import { Administrator } from './administrator.model';

export interface Token {
    id: string;
    expiresUtc: Date;
    administrator: Administrator;
}
