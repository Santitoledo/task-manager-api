import request from "supertest";
import app from "../app";
import { describe, it, expect, beforeEach } from "vitest";
import { prisma } from "../lib/prisma";

describe("API", () => {

  beforeEach(async () => {
  await prisma.user.deleteMany();  //limpiamos la DB test
});

  it("GET / should return API funcionando", async () => {

    const response = await request(app).get("/");
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("API funcionando");

  });

  it("GET /users should return 401 without token", async () => {

   const response = await request(app).get("/users"); 
    expect(response.status).toBe(401);

  });

  it("GET /users should return 401 with invalid token", async () => {
   
   const response = await request(app).get("/users").set("Authorization", "Bearer token-falso");
    expect(response.status).toBe(401);

  });
  it("POST /users should create a user", async () => {

    const response = await request(app).post("/users")
    .set("x-api-key", process.env.API_KEY!)
    .send({
        name: "Test User",
        email: "test@test.com",
        password: "123456",
    });
    expect(response.status).toBe(201);
    expect(response.body.name).toBe("Test User");
    expect(response.body.email).toBe("test@test.com");
    expect(response.body.password).toBeUndefined();
});

});