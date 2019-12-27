import { Injectable } from '@nestjs/common';
import { hash, compare } from 'bcrypt';

@Injectable()
export class PasswordService {
    hash(password: string): Promise<string> {
        return hash(password, 10);
    }

    compare(password: string, hashedPassword: string): Promise<boolean> {
        return compare(password, hashedPassword);
    }
}
