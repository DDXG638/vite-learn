import { getAge } from './user'

export function getUserInfo() {
  return {
    userName: 'Doris',
    age: getAge(),
  }
}