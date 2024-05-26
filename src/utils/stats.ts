import { User } from '../types';
import { getUser, createUser } from '../database/manager';

export const getBalance = (userId: string): number => {
  const user = getUser(userId);
  return user ? user.balance : 0;
};

export const getExperience = (userId: string): number => {
  const user = getUser(userId);
  return user ? user.experience : 0;
};

export const getLevel = (userId: string): number => {
  const user = getUser(userId);
  return user ? user.level : 1;
};

export const getJoinDate = (userId: string): Date => {
  const user = getUser(userId);
  return user ? new Date(user.joinDate) : new Date();
};

export const createUserWithDefaults = (userId: string): User => {
  const startingBalance = 1000;
  const startingExperience = 0;
  const startingLevel = 1;
  const joinDate = new Date().toISOString();

  let user = getUser(userId);
  if (!user) {
    user = createUser(userId, startingBalance);
    user.experience = startingExperience;
    user.level = startingLevel;
    user.joinDate = joinDate;
    updateUser(user);
  }
  return user;
};
