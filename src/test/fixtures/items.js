import userFixtures from './users';
import { createObjectId } from 'pow-mongodb-fixtures';

exports.items = {
  adminItem1: {
    _id: createObjectId('59b50d152d9f6b4110ec9a11'),
    name: 'Admin item 1',
    owner: userFixtures.users.admin._id
  },
  adminItem2: {
    _id: createObjectId('59b50d152d9f6b4110ec9a12'),
    name: 'Admin item 2',
    owner: userFixtures.users.admin._id
  },
  adminItem3: {
    _id: createObjectId('59b50d152d9f6b4110ec9a13'),
    name: 'Admin item 3',
    owner: userFixtures.users.admin._id
  },
  adminItem4: {
    _id: createObjectId('59b50d152d9f6b4110ec9a14'),
    name: 'Admin item 4',
    owner: userFixtures.users.admin._id
  },
  adminItem5: {
    _id: createObjectId('59b50d152d9f6b4110ec9a15'),
    name: 'Admin item 5',
    owner: userFixtures.users.admin._id
  },
  testItem1: {
    _id: createObjectId('59b50d152d9f6b4110ec9a21'),
    name: 'Test item 1',
    owner: userFixtures.users.test._id
  },
  testItem2: {
    _id: createObjectId('59b50d152d9f6b4110ec9a22'),
    name: 'Test item 2',
    owner: userFixtures.users.test._id
  },
  testItem3: {
    _id: createObjectId('59b50d152d9f6b4110ec9a23'),
    name: 'Test item 3',
    owner: userFixtures.users.test._id
  }
}
