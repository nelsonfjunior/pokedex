export interface IPokemon {
  id: number;
  name: string;
  types: string;
  abilities: string;
  stats: any[];
  image: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}