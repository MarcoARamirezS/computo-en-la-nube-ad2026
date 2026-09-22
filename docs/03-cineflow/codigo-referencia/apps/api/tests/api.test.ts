import test from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import { createApp } from "../src/app.js";
import { makeCatalog } from "../src/catalog.js";
import { emptyAccount, Problem, type Account } from "../src/model.js";
import type { Store } from "../src/store.js";
function setup() {
  const db = new Map<string, Account>();
  const store: Store = {
    async read(uid) {
      return structuredClone(db.get(uid) ?? emptyAccount());
    },
    async change(uid, fn) {
      const a = structuredClone(db.get(uid) ?? emptyAccount());
      const result = fn(a);
      db.set(uid, a);
      return result;
    },
  };
  const catalog = makeCatalog("demo");
  catalog.videos = async () => [
    { id: "abcdefghijk", title: "Video de prueba" },
  ];
  const app = createApp({
    store,
    catalog,
    origin: "http://localhost:5173",
    verify: async (token) => {
      if (!["ana", "bruno"].includes(token)) throw new Problem(401, "Inválido");
      return token;
    },
  });
  return request(app);
}
test("catálogo demo y errores HTTP", async () => {
  const api = setup();
  await api.get("/health").expect(200);
  const result = await api.get("/api/catalog?type=movie").expect(200);
  assert.equal(result.body.data.length, 2);
  await api.get("/api/catalog?type=other").expect(400);
  await api.get("/api/catalog/movie/1").expect(404);
  await api.get("/api/me").expect(401);
  await api.get("/api/me").set("Authorization", "Bearer invalid").expect(401);
});
test("provisión idempotente, favoritos y aislamiento entre cuentas", async () => {
  const api = setup();
  for (let i = 0; i < 2; i++)
    await api
      .put("/api/me")
      .set("Authorization", "Bearer ana")
      .send({})
      .expect(200);
  for (let i = 0; i < 2; i++)
    await api
      .put("/api/profiles/main/favorites/movie/900001")
      .set("Authorization", "Bearer ana")
      .send({})
      .expect(200);
  const a = await api
    .get("/api/me")
    .set("Authorization", "Bearer ana")
    .expect(200);
  assert.equal(a.body.data.profiles.length, 1);
  assert.equal(Object.keys(a.body.data.profiles[0].favorites).length, 1);
  const b = await api
    .get("/api/me")
    .set("Authorization", "Bearer bruno")
    .expect(200);
  assert.equal(Object.keys(b.body.data.profiles[0].favorites).length, 0);
  await api
    .put("/api/profiles/ajeno/favorites/movie/900001")
    .set("Authorization", "Bearer bruno")
    .send({})
    .expect(404);
});
test("límite de perfiles, renombrar, borrar dependencias", async () => {
  const api = setup();
  let id = "";
  for (let i = 0; i < 4; i++) {
    const res = await api
      .post("/api/profiles")
      .set("Authorization", "Bearer ana")
      .send({ name: `Perfil ${i}` })
      .expect(201);
    id = res.body.data.profiles.at(-1).id;
  }
  await api
    .post("/api/profiles")
    .set("Authorization", "Bearer ana")
    .send({ name: "Sexto" })
    .expect(409);
  await api
    .patch(`/api/profiles/${id}`)
    .set("Authorization", "Bearer ana")
    .send({ name: "Nuevo" })
    .expect(200);
  await api
    .put(`/api/profiles/${id}/favorites/movie/900001`)
    .set("Authorization", "Bearer ana")
    .send({})
    .expect(200);
  await api
    .delete(`/api/profiles/${id}`)
    .set("Authorization", "Bearer ana")
    .expect(204);
  await api
    .delete("/api/profiles/main")
    .set("Authorization", "Bearer ana")
    .expect(409);
  const res = await api
    .get("/api/me")
    .set("Authorization", "Bearer ana")
    .expect(200);
  assert.equal(res.body.data.profiles.length, 4);
  assert.ok(!res.body.data.profiles.find((p: { id: string }) => p.id === id));
});
test("historial: validación, versión, reinicio y eliminación", async () => {
  const api = setup(),
    url = "/api/profiles/main/history/movie/900001";
  const body = {
    videoId: "abcdefghijk",
    position: 30,
    duration: 100,
    version: 0,
  };
  let res = await api
    .put(url)
    .set("Authorization", "Bearer ana")
    .send(body)
    .expect(200);
  assert.equal(res.body.data.version, 1);
  await api.put(url).set("Authorization", "Bearer ana").send(body).expect(409);
  await api
    .put(url)
    .set("Authorization", "Bearer ana")
    .send({ ...body, version: 1, position: 101 })
    .expect(400);
  res = await api
    .put(url)
    .set("Authorization", "Bearer ana")
    .send({ ...body, version: 1, position: 100 })
    .expect(200);
  assert.equal(res.body.data.completed, true);
  res = await api
    .put(url)
    .set("Authorization", "Bearer ana")
    .send({ ...body, version: 2, position: 0 })
    .expect(200);
  assert.equal(res.body.data.completed, false);
  await api
    .delete("/api/profiles/main/history/movie_900001_abcdefghijk")
    .set("Authorization", "Bearer ana")
    .expect(204);
});
