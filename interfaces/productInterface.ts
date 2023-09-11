export interface createProduct {
  title: string;
  price: number;
  imageUrl?: string;
}

export interface GetAllMineProducts {
  userId: string;
}

export interface updateProduct {
  title?: string;
  imageUrl?: string;
  price?: number;
}

//   export interface resetPassword {
//     id: any;
//     password: string;
//   }
