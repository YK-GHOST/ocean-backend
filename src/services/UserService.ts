import { Model, Types } from "mongoose";

export class UserService<T extends Document> {
  constructor(private model: Model<T>) {}

  async create(data: Partial<T>) {
    const user = new this.model(data);
    return user.save();
  }

  async findOne(query: any): Promise<T | null> {
    return await this.model.findOne(query);
  }

  async update(id: string, data: Partial<T>): Promise<T | null> {
    if (Types.ObjectId.isValid(id) && id.length === 24) {
      return await this.model.findByIdAndUpdate(id, data, { new: true });
    } else {
      return await this.model.findOneAndUpdate({ googleId: id }, data, {
        new: true,
      });
    }
  }

  async delete(id: string): Promise<T | null> {
    return await this.model.findByIdAndDelete(id);
  }
}
