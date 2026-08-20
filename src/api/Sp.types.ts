export interface CurrentUser {
  id: number;
  title: string;
  email: string;
  loginName: string;
  isSiteAdmin: boolean;
}

export interface AccessProfile {
  user: CurrentUser;
  isAdmin: boolean;
  groups: string[];
}
