import { UserModel } from '../models/user.model';
import * as bcrypt from 'bcrypt';
import { AppDataSource } from '../../config/data-source';
import { UserRole } from 'src/app/common/enum/role.enum';

export class UserSeeder {
  static async seed() {
    const repo = AppDataSource.getRepository(UserModel);

    const users = [
      {
        name: 'Super Admin',
        email: 'admin@example.com',
        password: '123456',
        role: UserRole.ADMIN,
      },
      {
        name: 'John Doe',
        email: 'user1@example.com',
        password: '123456',
        role: UserRole.USER,
      },
      {
        name: 'Jane Smith',
        email: 'user2@example.com',
        password: '123456',
        role: UserRole.USER,
      },
    ];

    for (const userData of users) {
      const existing = await repo.findOne({
        where: { email: userData.email },
      });

      if (!existing) {
        const hashedPassword = await bcrypt.hash(userData.password, 10);

        const user = repo.create({
          ...userData,
          password: hashedPassword,
        });

        await repo.save(user);

        console.log(`Created user: ${user.email}`);
      }
    }
  }
}
