const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Lumina E-Commerce API',
      version: '1.0.0',
      description: `
## Lumina E-Commerce REST API

Full production-ready backend for the Lumina Angular E-Commerce frontend.

### Authentication
Use the **Bearer Token** scheme. After logging in, copy your \`accessToken\` and click **Authorize → Bearer {token}**.

### Rate Limiting
- General: 100 req / 15 min
- Auth routes: 10 req / 15 min
      `,
      contact: {
        name: 'Lumina Dev Team',
        email: 'dev@lumina.com',
      },
      license: { name: 'MIT' },
    },
    servers: [
      { url: 'http://localhost:5000/api/v1', description: 'Development' },
      { url: 'https://api.lumina.com/api/v1', description: 'Production' },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        // ── Shared Error ──────────────────────────────────────────
        Error: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string', example: 'An error occurred' },
            errors: { type: 'array', items: { type: 'string' } },
          },
        },
        // ── User ─────────────────────────────────────────────────
        User: {
          type: 'object',
          properties: {
            id: { type: 'string', example: '664a1b2c3d4e5f6789012345' },
            name: { type: 'string', example: 'Alex Rivera' },
            email: { type: 'string', example: 'alex@lumina.com' },
            role: { type: 'string', enum: ['user', 'admin'], example: 'user' },
            isActive: { type: 'boolean', example: true },
            avatar: { type: 'string', example: 'https://i.pravatar.cc/150?u=alex' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        // ── Product ───────────────────────────────────────────────
        Product: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            title: { type: 'string', example: 'Premium Leather Wallet' },
            description: { type: 'string', example: 'Handcrafted full-grain leather wallet' },
            price: { type: 'number', example: 129.99 },
            discountPercentage: { type: 'number', example: 15 },
            rating: { type: 'number', example: 4.7 },
            stock: { type: 'integer', example: 45 },
            brand: { type: 'string', example: 'Lumina Craft' },
            category: { type: 'string', example: 'accessories' },
            thumbnail: { type: 'string', example: 'https://...' },
            images: { type: 'array', items: { type: 'string' } },
          },
        },
        // ── Category ──────────────────────────────────────────────
        Category: {
          type: 'object',
          properties: {
            slug: { type: 'string', example: 'accessories' },
            name: { type: 'string', example: 'Accessories' },
            url: { type: 'string', example: 'https://api.lumina.com/api/v1/products/category/accessories' },
          },
        },
        // ── Order ─────────────────────────────────────────────────
        Order: {
          type: 'object',
          properties: {
            id: { type: 'string', example: '664a1b2c3d4e5f6789012345' },
            orderNumber: { type: 'string', example: '#LM-00042' },
            user: { $ref: '#/components/schemas/User' },
            items: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  product: { $ref: '#/components/schemas/Product' },
                  quantity: { type: 'integer', example: 2 },
                  price: { type: 'number', example: 129.99 },
                },
              },
            },
            shippingAddress: { $ref: '#/components/schemas/ShippingAddress' },
            totalAmount: { type: 'number', example: 259.98 },
            status: { type: 'string', enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'], example: 'pending' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        // ── Shipping Address ──────────────────────────────────────
        ShippingAddress: {
          type: 'object',
          properties: {
            name: { type: 'string', example: 'Alex Rivera' },
            email: { type: 'string', example: 'alex@lumina.com' },
            address: { type: 'string', example: '123 Main St' },
            city: { type: 'string', example: 'Cairo' },
            state: { type: 'string', example: 'Cairo' },
            zip: { type: 'string', example: '11511' },
            phone: { type: 'string', example: '+20100000000' },
            country: { type: 'string', example: 'EG' },
          },
        },
        // ── Pagination ────────────────────────────────────────────
        Pagination: {
          type: 'object',
          properties: {
            total: { type: 'integer', example: 100 },
            skip: { type: 'integer', example: 0 },
            limit: { type: 'integer', example: 30 },
          },
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ['./src/routes/*.js', './src/swagger/*.js'],
};

module.exports = swaggerJsdoc(options);
