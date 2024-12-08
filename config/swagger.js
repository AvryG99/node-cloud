const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'Hospital API',
            version: '1.0.0',
            description: 'API documentation for Hospital Management System',
        },
        servers: [
            {
                url: 'http://localhost:5000',  // Địa chỉ của API
            },
        ],
    },
    apis: ['./routes/*.js'],  // Đường dẫn tới các file route chứa API documentation
};

// Khởi tạo Swagger docs từ các cấu hình trên
const swaggerDocs = swaggerJsDoc(swaggerOptions);

// Hàm tích hợp Swagger vào ứng dụng Express
const setupSwagger = (app) => {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));  // Đường dẫn tới Swagger UI
    console.log('Swagger Docs available at http://localhost:5000/api-docs');
};

module.exports = setupSwagger;
