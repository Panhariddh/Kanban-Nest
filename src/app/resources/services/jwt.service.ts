import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserModel } from 'src/app/database/models/user.model';
import jwtConstants from 'src/app/utils/jwt.constants';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(UserModel)
    private userRepository: Repository<UserModel>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        // cookie extractor
        (req) => req?.cookies?.jwt,

        // Authorization header
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }

  async validate(payload: { userId: number }) {
    const user = await this.userRepository.findOne({
      where: { id: payload.userId },
      select: ['id', 'email', 'role'],
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return user; // becomes req.user
  }
}

