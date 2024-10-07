export interface CategoryInterface {
  id?: number
  name: string
  display_name : string
}

export interface CategoryCompleteInterface {
  id: number;
  name: string;
  display_name: string | null;
  createdAt: Date | string | null;
  updatedAt: Date | string | null;
  deletedAt: Date | string | null;
}