import * as examples from '../services/example.service.js';
import { sendData } from '../utils/response.js';
export async function list(req, res) {
  return sendData(res, { items: await examples.list(req.user.id) });
}
export async function get(req, res) {
  return sendData(res, { item: await examples.get(req.user.id, req.params.id) });
}
export async function create(req, res) {
  return sendData(res, { item: await examples.create(req.user.id, req.validated) }, 201, 'Record created.');
}
export async function update(req, res) {
  return sendData(res, { item: await examples.update(req.user.id, req.params.id, req.validated) }, 200, 'Record updated.');
}
export async function remove(req, res) {
  await examples.remove(req.user.id, req.params.id);
  return res.status(204).end();
}
