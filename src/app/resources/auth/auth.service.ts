import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Response } from 'express';

import { UserModel } from 'src/app/database/models/user.model';
import { JwtService } from '@nestjs/jwt';
import jwtConstants from 'src/app/utils/jwt.constants';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserModel)
    private userRepository: Repository<UserModel>,
    private jwtService: JwtService,
  ) {}

    async validateUser(email: string, password: string) {
        const user = await this.userRepository.findOne({ where: { email } });
        if (user && (await bcrypt.compare(password, user.password))) {
        const { password, ...safeUser } = user;
        return safeUser;
        }
        return null;
    }

    async login(email: string, password: string, res: Response) {
        const user = await this.validateUser(email, password);

        if (!user) throw new UnauthorizedException();

        const payload = { userId: user.id };

        const token = this.jwtService.sign(payload);

        res.cookie('jwt', token, {
            httpOnly: true,
            sameSite: 'strict',
            secure: false, // dev
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return { user, token };
    }

    logout(res: Response) {
        res.cookie('jwt', '', { maxAge: 0 });
    }
}