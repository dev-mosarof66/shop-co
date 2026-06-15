/**
 * Sample User Model
 * Replace with your actual database implementation
 */

interface IUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
  avatar?: string;
  role: 'customer' | 'admin' | 'vendor';
  addresses: IAddress[];
  createdAt: Date;
  updatedAt: Date;
}

interface IAddress {
  id: string;
  type: 'billing' | 'shipping';
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

export { IUser, IAddress };
