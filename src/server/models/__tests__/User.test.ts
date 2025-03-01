import { User } from '../User';
import { sequelize } from '../../config/sequelize';
import bcrypt from 'bcrypt';

describe('User Model', () => {
  it('should create a user with hashed password', async () => {
    const userData = {
      email: 'test@example.com',
      password: 'password123',
      role: 'customer'
    };

    const user = await User.create(userData);

    expect(user).toBeDefined();
    expect(user.email).toBe(userData.email);
    expect(user.role).toBe(userData.role);
    expect(user.password_hash).toBeDefined();
    expect(await bcrypt.compare(userData.password, user.password_hash)).toBe(true);
  });

  it('should not create a user with invalid email', async () => {
    const userData = {
      email: 'invalid-email',
      password: 'password123',
      role: 'customer'
    };

    await expect(User.create(userData)).rejects.toThrow();
  });

  it('should not create a user with duplicate email', async () => {
    const userData = {
      email: 'test@example.com',
      password: 'password123',
      role: 'customer'
    };

    await User.create(userData);
    await expect(User.create(userData)).rejects.toThrow();
  });

  it('should validate password correctly', async () => {
    const userData = {
      email: 'test@example.com',
      password: 'password123',
      role: 'customer'
    };

    const user = await User.create(userData);
    expect(await user.validatePassword('password123')).toBe(true);
    expect(await user.validatePassword('wrongpassword')).toBe(false);
  });
});
