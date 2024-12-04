import * as fs from 'fs';
import { User } from '../types';

const userFilePath = './src/database/data/users.json';

export const getUser = (userId: string): User | undefined => {
  const users = getUsers();
  return users.find(user => user.id === userId);
};

export const updateUser = (user: User) => {
  const users = getUsers();
  const index = users.findIndex(u => u.id === user.id);
  if (index !== -1) {
    users[index] = user;
    saveUsers(users);
  }
};

export const createUser = (userId: string, startingBalance: number): User => {
  let users = getUsers();
  if (!users.some(user => user.id === userId)) {
    const newUser: User = {
      id: userId,
      balance: startingBalance,
      experience: 0,
      level: 1,
      joinDate: new Date().toISOString(),
    };
    users.push(newUser);
    saveUsers(users);
    return newUser;
  }
  return getUser(userId)!;
};

const getUsers = (): User[] => {
  try {
    const usersData = fs.readFileSync(userFilePath, 'utf-8');
    return JSON.parse(usersData);
  } catch (error) {
    console.error('Error reading users file:', error);
    return [];
  }
};

const saveUsers = (users: User[]) => {
  try {
    fs.writeFileSync(userFilePath, JSON.stringify(users, null, 2));
  } catch (error) {
    console.error('Error saving users file:', error);
  }
};
