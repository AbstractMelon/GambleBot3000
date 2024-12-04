import { User } from '../types';
import { createUser, getUser, updateUser } from '../database/manager';

const startingBalance = 1000;

const createUserIfNotExist = (userId: string): User => {
  // console.log(`Checking if user ${userId} exists...`);
  let user = getUser(userId);
  if (!user) {
    // console.log(`User ${userId} does not exist. Creating user with starting balance...`);
    createUser(userId, startingBalance);
    console.log(`User ${userId} created with starting balance.`);
  } else {
    // console.log(`User ${userId} already exists.`);
  }
  return user;
};

export const getBalance = (userId: string): number => {
  // console.log(`Getting balance for user ${userId}...`);
  const user = createUserIfNotExist(userId);
  console.log(`Balance for user ${userId} is ${user.balance} coins.`);
  return user.balance;
};

export const addBalance = (userId: string, amount: number) => {
  // console.log(`Adding ${amount} coins to balance for user ${userId}...`);
  const user = createUserIfNotExist(userId);
  user.balance += amount;
  updateUser(user);
  console.log(`New balance for user ${userId} is ${user.balance} coins.`);
};

export const subtractBalance = (userId: string, amount: number) => {
  // console.log(`Subtracting ${amount} coins from balance for user ${userId}...`);
  const user = createUserIfNotExist(userId);
  user.balance -= Math.min(Math.abs(amount), user.balance);
  updateUser(user);
  console.log(`New balance for user ${userId} is ${user.balance} coins.`);
};

export const resetBalance = (userId: string) => {
  // console.log(`Resetting balance for user ${userId}...`);
  const user = createUserIfNotExist(userId);
  user.balance = startingBalance;
  updateUser(user);
  console.log(`Balance reset for user ${userId}. New balance is ${user.balance} coins.`);
};

export const multiplyBalance = (userId: string, multiplier: number) => {
  const user = createUserIfNotExist(userId);
  const newBalance = user.balance * multiplier;
  user.balance = newBalance;
  updateUser(user);
  console.log(`Balance for user ${userId} multiplied by ${multiplier}. New balance is ${newBalance} coins.`);
};

export const divideBalance = (userId: string, divisor: number) => {
  const user = createUserIfNotExist(userId);
  if (divisor !== 0) {
    const newBalance = user.balance / divisor;
    user.balance = newBalance;
    updateUser(user);
    console.log(`Balance for user ${userId} divided by ${divisor}. New balance is ${newBalance} coins.`);
  } else {
    console.error(`Error: Cannot divide by zero.`);
  }
};

export const increaseBalanceByPercentage = (userId: string, percentage: number) => {
  const user = createUserIfNotExist(userId);
  const increaseAmount = user.balance * (percentage / 100);
  user.balance += increaseAmount;
  updateUser(user);
  console.log(`Balance for user ${userId} increased by ${percentage}%. New balance is ${user.balance} coins.`);
};

export const decreaseBalanceByPercentage = (userId: string, percentage: number) => {
  const user = createUserIfNotExist(userId);
  const decreaseAmount = user.balance * (percentage / 100);
  user.balance -= decreaseAmount;
  updateUser(user);
  console.log(`Balance for user ${userId} decreased by ${percentage}%. New balance is ${user.balance} coins.`);
};

export const setBalance = (userId: string, newBalance: number) => {
  const user = createUserIfNotExist(userId);
  user.balance = newBalance;
  updateUser(user);
  console.log(`Balance for user ${userId} set to ${newBalance} coins.`);
};
