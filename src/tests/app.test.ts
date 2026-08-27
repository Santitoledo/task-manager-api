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
it("POST /users should return 409 for duplicate email", async () => {
await request(app)
  .post("/users")
  .set("x-api-key", process.env.API_KEY!)
  .send({
    name: "Test User",
    email: "test@test.com",
    password: "123456",
  });
  const response = await request(app)
  .post("/users")
  .set("x-api-key", process.env.API_KEY!)
  .send({
    name: "Otro User",
    email: "test@test.com",
    password: "123456",
  });
    expect(response.status).toBe(409);
});

it("POST /users should return 400 with invalid data", async () => {
const response = await request(app)
  .post("/users")
  .set("x-api-key", process.env.API_KEY!)
  .send({
    name: "Test User",
    email: "test@test.com",
    password: "123",
  });
expect(response.status).toBe(400);
});

it("POST /users should return 400 with invalid email", async () => {

  const response = await request(app)
  .post("/users")
  .set("x-api-key", process.env.API_KEY!)
  .send({
    name: "Test User",
    email: "esto-no-es-un-email",
    password: "123456",
  });
expect(response.status).toBe(400);
});

it("POST /auth/login should login with valid credentials", async () => {
await request(app)
  .post("/users")
  .set("x-api-key", process.env.API_KEY!)
  .send({
    name: "Login User",
    email: "login@test.com",
    password: "123456",
  });
  const response = await request(app)
  .post("/auth/login")
  .send({
    email: "login@test.com",
    password: "123456",
  });
  expect(response.status).toBe(200);
  expect(response.body.token).toBeDefined();
});

it("POST /auth/login should return 401 with wrong password", async () => {
await request(app)
  .post("/users")
  .set("x-api-key", process.env.API_KEY!)
  .send({
    name: "Login User",
    email: "login@test.com",
    password: "123456",
  });
  const response = await request(app)
  .post("/auth/login")
  .send({
    email: "login@test.com",
    password: "contraseña-incorrecta",
  });
  expect(response.status).toBe(401);
});
it("POST /auth/login should return 401 with non-existent user", async () => {

  const response = await request(app)
  .post("/auth/login")
  .send({
    email: "loginMalescrito@test.com",
    password: "123456",
  });
  expect(response.status).toBe(401);

});
it("GET /users should return 200 with valid token", async () => {
  await request(app)
  .post("/users")
  .set("x-api-key", process.env.API_KEY!)
  .send({
    name: "Test User",
    email: "test@test.com",
    password: "123456",
  });
  const loginResponse = await request(app)
  .post("/auth/login")
  .send({
    email: "test@test.com",
    password: "123456",
  });
 const token = loginResponse.body.token;
 //console.log("LOGIN STATUS:", loginResponse.status);
// console.log("TOKEN:", token); 
console.log("JWT_SECRET test:", process.env.JWT_SECRET);
 const response = await request(app)
  .get("/users")
  .set("x-api-key", process.env.API_KEY!)
  .set("Authorization", `Bearer ${token}`);
  expect(response.status).toBe(200);
  expect(response.body).toHaveLength(1);
});

it("GET /users/:id should return 200 for existing user", async () => {

const createResponse = await request(app)
  .post("/users")
  .set("x-api-key", process.env.API_KEY!)
  .send({
    name: "Test User",
    email: "test@test.com",
    password: "123456",
  });
const userId = createResponse.body.id;

const loginResponse = await request(app)
  .post("/auth/login")
  .send({
    email: "test@test.com",
    password: "123456",
  });
const token = loginResponse.body.token;
const response = await request(app)
  .get(`/users/${userId}`)
  .set("x-api-key", process.env.API_KEY!)
  .set("Authorization", `Bearer ${token}`);
expect(response.status).toBe(200);
expect(response.body.id).toBe(userId);
expect(response.body.email).toBe("test@test.com");
});

it("GET /users/:id should return 404 for non-existent user", async () => {
  await request(app)
  .post("/users")
  .set("x-api-key", process.env.API_KEY!)
  .send({
    name: "Test User",
    email: "test@test.com",
    password: "123456",
  });
  const loginResponse = await request(app)
  .post("/auth/login")
  .send({
    email: "test@test.com",
    password: "123456",
  });
const token = loginResponse.body.token;
const response = await request(app)
  .get(`/users/${9999}`)
  .set("x-api-key", process.env.API_KEY!)
  .set("Authorization", `Bearer ${token}`);
expect(response.status).toBe(404);

});

it("PUT /users/:id should update an existing user", async () => {


   const createResponse = await request(app)
  .post("/users")
  .set("x-api-key", process.env.API_KEY!)
  .send({
    name: "Test User",
    email: "test@test.com",
    password: "123456",
  });
  const loginResponse = await request(app)
  .post("/auth/login")
  .send({
    email: "test@test.com",
    password: "123456",
  });
const token = loginResponse.body.token;

const userId = createResponse.body.id;

const response = await request(app)
  .patch(`/users/${userId}`)
  .set("x-api-key", process.env.API_KEY!)
  .set("Authorization", `Bearer ${token}`)
  .send({
    name: "Nuevo Nombre",
  });
  
expect(response.status).toBe(200);
expect(response.body.name).toBe("Nuevo Nombre");
});




});