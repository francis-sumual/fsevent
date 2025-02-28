import type { MemberGroup } from "./member-group";

export interface Member {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  address?: string | null;
  isActive: boolean;
  groupId: string;
  group: MemberGroup;
  createdAt: string;
  updatedAt: string;
}
