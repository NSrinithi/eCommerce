import { Example } from '../models/Example.js';
import { AppError } from '../utils/AppError.js';
const dto = record => ({
  id: record._id.toString(),
  title: record.title,
  description: record.description,
  createdAt: record.createdAt
});
export async function list(owner) {
  const records = await Example.find({ owner }).sort({ createdAt: -1, _id: -1 }).limit(50);
  return records.map(dto);
}
export async function create(owner, input) {
  return dto(await Example.create({ ...input, owner }));
}
export async function get(owner, id) {
  const record = await Example.findOne({ _id: id, owner });
  if (!record) throw new AppError(404, 'Record not found.', 'NOT_FOUND');
  return dto(record);
}
export async function update(owner, id, input) {
  const record = await Example.findOneAndUpdate({ _id: id, owner }, { $set: input }, { new: true, runValidators: true });
  if (!record) throw new AppError(404, 'Record not found.', 'NOT_FOUND');
  return dto(record);
}
export async function remove(owner, id) {
  const record = await Example.findOneAndDelete({ _id: id, owner });
  if (!record) throw new AppError(404, 'Record not found.', 'NOT_FOUND');
}
