// types.ts
export interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    isVerified: boolean;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    profilePhoto?: string;
    gender?: string;
  }
  
  export interface Account {
    id: string;
    type: string;
    accountNumber: string;
    balance: number;
    currency: string;
    apy?: number;
  }
  
  export interface Card {
    id: string;
    type: string;
    lastFour: string;
    balance: number;
    cardHolder: string;
    expiry: string;
  }
  
  export interface Loan {
    id: string;
    type: string;
    amount: number;
    remaining: number;
    interestRate: number;
    nextPaymentDate: string;
    nextPaymentAmount: number;
  }
  
  export interface Transaction {
    id: string;
    date: string;
    amount: number;
    description: string;
    category: string;
    account: string;
  }
  
  export interface Address {
    street: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
  }
  
  export interface Profile {
    dateOfBirth?: string;
    gender?: string;
    address?: Address;
    profilePhoto?: string;
    idType?: string;
    idNumber?: string;
  }
  
  export interface UserProfile {
    user: User;
    profile?: Profile;
    accounts?: Account[];
    cards?: Card[];
    loans?: Loan[];
    transactions?: Transaction[];
  }
  export interface SavingType {
    id: string;
    name: string;
    description: string;
    interestRate: number;
    minBalance: number;
    withdrawalLimit: number;
    tenureInMonths: number;
    penaltyRate: number;
    createdAt?: string; // Optional if your data has this field
    updatedAt?: string; // Optional if your data has this field
  }

  export interface LoanType {
  id: string;
  name: string;
  description?: string;
  minAmount: number;
  maxAmount: number;
  minTerm: number;
  maxTerm: number;
  interestRate: number;
  interestType: 'Fixed' | 'Variable';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}