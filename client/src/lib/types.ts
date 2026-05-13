export type DashboardUser = {
  id: string;
  email: string;
  fullName: string;
};

export type DashboardAccount = {
  id: string;
  accountName: string;
  accountNumber: string;
  balance: number;
  currency: string;
};

export type DashboardTransaction = {
  id: string;
  amount: number;
  type: "credit" | "debit";
  description: string;
  status: string;
  date: string;
};

export type MeResponse = {
  user: DashboardUser;
  account: DashboardAccount;
  transactions: DashboardTransaction[];
};
