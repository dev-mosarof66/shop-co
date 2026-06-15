# E-Commerce Backend API

A production-ready Node.js + TypeScript backend API for the e-commerce template.

## 📋 Features

- ✅ Express.js server with TypeScript
- ✅ RESTful API architecture
- ✅ Security best practices (Helmet, CORS)
- ✅ Environment configuration
- ✅ Request logging (Morgan)
- ✅ Error handling middleware
- ✅ Code linting (ESLint)
- ✅ Code formatting (Prettier)

## 📁 Project Structure

```
backend/
├── src/
│   ├── routes/              # API routes
│   │   ├── health.ts
│   │   ├── products.ts
│   │   ├── users.ts
│   │   └── orders.ts
│   ├── controllers/         # Route controllers
│   │   └── productController.ts
│   ├── models/              # Database models
│   ├── middleware/          # Custom middleware
│   ├── config/              # Configuration files
│   ├── utils/               # Utility functions
│   └── server.ts            # Main server file
├── dist/                    # Compiled JavaScript
├── package.json             # Dependencies
├── tsconfig.json            # TypeScript config
├── .env.example             # Environment variables template
├── .eslintrc.json          # ESLint config
├── .prettierrc.json        # Prettier config
└── README.md               # This file
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. **Install dependencies:**

```bash
cd backend
npm install
```

2. **Create environment file:**

```bash
cp .env.example .env
```

3. **Configure your environment variables in `.env`**

### Development

Run the development server with hot-reload:

```bash
npm run dev
```

The server will start at `http://localhost:5000` by default.

### Building

Compile TypeScript to JavaScript:

```bash
npm run build
```

### Production

Start the production server:

```bash
npm start
```

## 📝 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with ts-node |
| `npm run build` | Compile TypeScript to JavaScript |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Fix ESLint issues automatically |
| `npm run format` | Format code with Prettier |
| `npm run type-check` | Check TypeScript types |

## 🔌 API Endpoints

### Health Check
- `GET /api/v1/health` - Server health status

### Products
- `GET /api/v1/products` - Get all products
- `GET /api/v1/products/:id` - Get product by ID
- `POST /api/v1/products` - Create new product
- `PUT /api/v1/products/:id` - Update product
- `DELETE /api/v1/products/:id` - Delete product

### Users
- `GET /api/v1/users` - Get all users
- `POST /api/v1/users/register` - Register new user
- `POST /api/v1/users/login` - User login

### Orders
- `GET /api/v1/orders` - Get all orders
- `GET /api/v1/orders/:id` - Get order by ID
- `POST /api/v1/orders` - Create new order

## 🔧 Configuration

### Environment Variables

Key environment variables in `.env`:

- `PORT` - Server port (default: 5000)
- `NODE_ENV` - Environment (development/production)
- `CORS_ORIGIN` - CORS allowed origin
- `JWT_SECRET` - JWT secret key
- `DB_*` - Database connection credentials

See `.env.example` for all available variables.

## 📦 Dependencies

### Production
- **express** - Web framework
- **dotenv** - Environment variable management
- **cors** - Cross-origin resource sharing
- **helmet** - Security middleware
- **morgan** - HTTP request logging
- **bcryptjs** - Password hashing
- **jsonwebtoken** - JWT authentication
- **axios** - HTTP client

### Development
- **typescript** - TypeScript language
- **ts-node** - TypeScript executor
- **nodemon** - Auto-restart on file changes
- **eslint** - Code linting
- **prettier** - Code formatting
- **@types/* - TypeScript type definitions

## 🔐 Security Features

- Helmet.js for HTTP headers security
- CORS protection
- JWT authentication ready
- Password hashing with bcryptjs
- Environment variable protection
- Input validation (to be implemented)

## 🚦 Next Steps

1. **Database Setup**: Configure and integrate your database (MongoDB, PostgreSQL, etc.)
2. **Authentication**: Implement JWT authentication middleware
3. **Validation**: Add input validation using libraries like Joi or Zod
4. **Database Models**: Define and implement database models
5. **Error Handling**: Enhance error handling with custom error classes
6. **Testing**: Add Jest tests
7. **Documentation**: Generate API documentation with Swagger/OpenAPI

## 📖 API Documentation

API documentation can be generated using Swagger/OpenAPI. See future implementation.

## 🤝 Contributing

1. Create a feature branch (`git checkout -b feature/amazing-feature`)
2. Commit your changes (`git commit -m 'Add amazing feature'`)
3. Push to the branch (`git push origin feature/amazing-feature`)
4. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Troubleshooting

### Port Already in Use
Change the `PORT` in `.env` or kill the process using port 5000.

### TypeScript Errors
Run `npm run type-check` to identify TypeScript issues.

### Module Not Found
Run `npm install` to ensure all dependencies are installed.

## 📞 Support

For issues and questions, please open an issue on the repository.

---

**Happy coding! 🚀**
