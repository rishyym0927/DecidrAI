// services/auth-service/src/swagger.ts
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options: swaggerJsdoc.Options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "DecidrAI Auth Service API",
            version: "1.0.0",
            description: "Authentication and user management API for DecidrAI platform",
            contact: {
                name: "DecidrAI Team"
            }
        },
        servers: [
            {
                url: "http://localhost:5002",
                description: "Development Server"
            },
            {
                url: "/api",
                description: "API Gateway (production)"
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                    description: "Clerk JWT Token"
                }
            },
            schemas: {
                User: {
                    type: "object",
                    properties: {
                        _id: { type: "string" },
                        clerkUserId: { type: "string" },
                        email: { type: "string" },
                        name: { type: "string" },
                        image: { type: "string" },
                        role: { type: "string", enum: ["user", "admin"] },
                        profile: {
                            type: "object",
                            properties: {
                                bio: { type: "string" },
                                experienceLevel: { type: "string", enum: ["beginner", "intermediate", "advanced"] },
                                interests: { type: "array", items: { type: "string" } }
                            }
                        },
                        preferences: {
                            type: "object",
                            properties: {
                                emailNotifications: { type: "boolean" },
                                theme: { type: "string", enum: ["light", "dark", "system"] }
                            }
                        },
                        createdAt: { type: "string", format: "date-time" },
                        updatedAt: { type: "string", format: "date-time" }
                    }
                },
                SavedTool: {
                    type: "object",
                    properties: {
                        toolId: { type: "string" },
                        savedAt: { type: "string", format: "date-time" },
                        notes: { type: "string" }
                    }
                },
                AiStackItem: {
                    type: "object",
                    properties: {
                        toolId: { type: "string" },
                        category: { type: "string" },
                        notes: { type: "string" },
                        addedAt: { type: "string", format: "date-time" }
                    }
                },
                Interaction: {
                    type: "object",
                    properties: {
                        _id: { type: "string" },
                        userId: { type: "string" },
                        sessionId: { type: "string" },
                        eventType: {
                            type: "string",
                            enum: ["view", "click", "save", "compare", "flow_start", "flow_complete"]
                        },
                        toolId: { type: "string" },
                        flowId: { type: "string" },
                        source: { type: "string" },
                        metadata: { type: "object" },
                        createdAt: { type: "string", format: "date-time" }
                    }
                },
                SuccessResponse: {
                    type: "object",
                    properties: {
                        success: { type: "boolean", example: true },
                        data: { type: "object" }
                    }
                },
                ErrorResponse: {
                    type: "object",
                    properties: {
                        success: { type: "boolean", example: false },
                        error: { type: "string" }
                    }
                },
                PaginationInfo: {
                    type: "object",
                    properties: {
                        page: { type: "integer" },
                        limit: { type: "integer" },
                        total: { type: "integer" },
                        totalPages: { type: "integer" }
                    }
                }
            }
        },
        tags: [
            { name: "Health", description: "Health check endpoints" },
            { name: "Profile", description: "User profile management" },
            { name: "Saved Tools", description: "Manage saved/bookmarked tools" },
            { name: "AI Stack", description: "Personal AI tool stack management" },
            { name: "Interactions", description: "User interaction tracking" },
            { name: "Admin", description: "Admin-only endpoints" }
        ]
    },
    apis: ["./src/routes/*.ts"]
};

export const specs = swaggerJsdoc(options);
export { swaggerUi };
