import type { Member } from "./member";
import type { Gathering } from "./gathering";

export interface GatheringRegistration {
  id: string;
  memberId: string;
  member: Member;
  gatheringId: string;
  gathering: Gathering;
  status: "registered" | "attended" | "cancelled";
  createdAt: string;
  updatedAt: string;
}
