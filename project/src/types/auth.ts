export interface UserCredentials {
  name: string;
  password: string;
}

export interface User {
  id: string;
  name: string;
  role: 'admin' | 'employee' | 'manager';
}
