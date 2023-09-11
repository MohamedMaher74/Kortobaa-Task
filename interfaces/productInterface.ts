export interface createProduct {
  title: string;
  price: number;
  imageUrl?: string;
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
