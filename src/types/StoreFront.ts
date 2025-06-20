export interface IStorefront {
  _id?: string;
  vendorId: string;
  businessName: string;
  bio: string;
  logo?: string;
  products?: string[];
  slug: string;
  createdAt?: Date;
}