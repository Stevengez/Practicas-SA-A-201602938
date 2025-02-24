import { EntityRepository } from '@mikro-orm/sqlite';
import { User } from '../database/model/user.entity.js';

export class UserRepository extends EntityRepository<User> {

  async login(email: string, password: string) {
    const count = await this.count({ email });
    return count > 0;
  }

}