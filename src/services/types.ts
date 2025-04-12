export interface Auth {
  id: number;
  name: string;
  displayName: string;
}

export interface MemberOf {
  id: number;
  idMeof: number;
  name: string;
  displayName: string;
}

export interface Profile {
  id: number;
  firstName: string;
  lastName: string;
  jobTitle: string;
  login: string;
  mail: string;
  phone: string;
  photo: string;
  connectionId: string | null;
  isActive: boolean;
  isDeleted: boolean;
  auth: Auth;
  memberOf: MemberOf[];
}

export interface Token {
  accessToken: string;
  expiresIn: number;
  tokenType: string;
}

export interface LoginResponse {
  profile: Profile;
  token: Token;
}

export interface CreateTaskRequest {
  title: string;
  description?: string;
  attachments?: File[];
  taskTypeOptions?: CreateTaskTypeOptionDto[];
}

export interface CreateTaskTypeOptionDto {
  name: string;
  idOpTy: number;
  idTree?: number;
  isMandatory: boolean;
}

export interface TaskTypeDto {
  idTaTy: number;
  title: string;
  description?: string;
  taskTypeAttachments: TaskTypeAttachmentDto[];
  taskTypeOptions: TaskTypeOptionDto[];
}

export interface TaskTypeAttachmentDto {
  idTaTyAt: number;
  idTaTy: number;
  url: string;
  fileName: string;
}

export interface TaskTypeOptionDto {
  idTaTyOp: number;
  idTaTy: number;
  name: string;
  idOpTy: number;
  idTree?: number;
  isMandatory: boolean;
}

export interface OptionType {
  idOpTy: number;
  description: string; // O título/descrição que será exibido no Select
}

export interface UpdateTaskRequest {
  idTaTy: number;
  title: string; 
  description?: string;
  newAttachments?: File[];
  taskTypeAttachments: TaskTypeAttachmentDto[];
  taskTypeOptions?: TaskTypeOptionDto[];
}

export interface TreeDto {
  idTree: number;
  name: string;
  description?: string;
  onlyFinalOptions?: boolean;
  tabulationTree?: boolean;
  conformityTree?: boolean;
  branches: BranchDto[];
}

export interface BranchDto {
  idBranch: number;
  idTree: number;
  name: string;
  description?: string;
  parentBranchId?: number;
  tags?: string;
  childBranches: BranchDto[];
}

