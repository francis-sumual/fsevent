export interface MemberGroup {
  id: string;
  name: string;
  description?: string | null;
  // group?: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
