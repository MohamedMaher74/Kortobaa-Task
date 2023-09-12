# Kortobaa-Task

#Postman Collection: https://documenter.getpostman.com/view/25838733/2s9YC2zYw1

# Project Structure: 
  ├── controllers/
  │    ├── productController.ts
  │    ├── userController.ts
  │    └── authController.ts
  ├── services/
  │    ├── productService.ts
  │    ├── userService.ts
  │    └── authService.ts
  ├── routes/
  │    ├── productRoutes.ts
  │    ├── userRoutes.ts
  │    └── authRoutes.ts
  ├── middlewares/
  │    ├── auth.ts
  │    ├── allowedTo.ts
  │    └── multer.ts
  ├── validators/
  │    ├── productValidators.ts
  │    ├── userValidators.ts
  │    └── authValidators.ts
  ├── utils/
  │    ├── appError.ts
  │    ├── folderHandler.ts
  │    └── response.ts
  ├── app.ts
  ├── index.ts
  ├── config.ts
  ├── auth.ts
  ├── .env
  ├── node_modules/
  ├── package.json
  ├── tsconfig.json
  ├── tslint.json
  └──

**Controllers:**

1. `productController.ts`: Handles HTTP requests and responses related to products.

2. `userController.ts`: Manages HTTP requests and responses for user-related operations.

3. `authController.ts`: Controls HTTP requests and responses for authentication and user authorization.

**Services:**

1. `productService.ts`: Contains business logic for product-related operations, including database interactions.

2. `userService.ts`: Contains business logic for user-related operations, such as user management and profile handling.

3. `authService.ts`: Implements authentication and authorization logic for user authentication.

**Routes:**

1. `productRoutes.ts`: Defines the product-related API routes and associates them with the appropriate controller methods.

2. `userRoutes.ts`: Declares user-related API routes and links them to the corresponding controller functions.

3. `authRoutes.ts`: Specifies authentication and authorization routes and links them to the auth controller.

**Middlewares:**

1. `auth.ts`: Contains middleware functions for user authentication and authorization.

2. `allowedTo.ts`: Defines a middleware for checking if a user has the required permissions.

3. `multer.ts`: Contains the Multer middleware for handling file uploads.

**Validators:**

1. `productValidators.ts`: Includes validation logic for product-related API requests, ensuring data integrity.

2. `userValidators.ts`: Contains validation logic for user-related API requests, such as registration and login.

3. `authValidators.ts`: Implements validation for authentication-related requests, such as password reset.

**Utils:**

1. `appError.ts`: Defines a custom error class for handling application-specific errors.

2. `response.ts`: Provides utility functions for generating consistent HTTP responses.

**Other Files:**

- `app.ts`: Initializes the Express application and sets up middleware and routes.

- `index.ts`: Starts the server by listening on a specific port and handles application startup.

- `config.ts`: Contains configuration settings for the application, such as database connection details.

- `auth.ts`: Implements authentication strategies and middleware for user authentication and authorization.

- `.env`: Stores environment variables, including sensitive data like API keys and database credentials.

- `node_modules/`: The directory where project dependencies are installed.

- `package.json`: Contains project metadata and lists dependencies and scripts.

- `tsconfig.json`: TypeScript configuration file for configuring compilation options.

- `tslint.json`: Configuration for the TSLint code linter.

- `README.md`: A README file that provides documentation and information about the project.

This project structure follows a common organization pattern for Node.js/Express applications and allows for separation of concerns, making it easier to maintain and extend the codebase.
