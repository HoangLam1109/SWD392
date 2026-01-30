// User repository interface
export interface IUserRepository {
  findById(id: string, fields?: string): Promise<any>;
  getUserBasicInfo(id: string): Promise<{ email: string; fullName: string } | null>;
  findByEmail(email: string): Promise<any>;
  findByPhoneNumber(identityNumber: string): Promise<any>;
  create(userData: any): Promise<any>;
  updateById(id: string, userData: any): Promise<any>;
  deleteById(id: string): Promise<any>;
  findAll(fields?: string): Promise<any[]>;
}

// User repository implementation
export class UserRepository implements IUserRepository {
  constructor(private userModel: any) {}

  async findById(id: string, fields?: string): Promise<any> {
    return await this.userModel.findById(id, fields || '_id email fullName phoneNumber address role avatar status');
  }

  async getUserBasicInfo(id: string): Promise<{ email: string; fullName: string; avatar?: string } | null> {
    return this.userModel.findById(id, 'email fullName avatar');
  }

  async findByEmail(email: string): Promise<any> {
    return await this.userModel.findOne({ email });
  }

  async findByPhoneNumber(phoneNumber: string): Promise<any> {
    return await this.userModel.findOne({ phoneNumber });
  }

  async findOne(criteria: any): Promise<any> {
    return await this.userModel.findOne(criteria);
  }

  async create(userData: any): Promise<any> {
    const user = new this.userModel(userData);
    return await user.save();
  }

  async updateById(id: string, userData: any): Promise<any> {
    return await this.userModel.findByIdAndUpdate(id, userData, { new: true });
  }

  async deleteById(id: string): Promise<any> {
    return await this.userModel.findByIdAndDelete(id);
  }

  async findAll(fields?: string): Promise<any[]> {
    return await this.userModel.find({}, fields);
  }

  async searchByFullName(keyword: string, fields?: string, limit: number = 20): Promise<any[]> {
    const regex = new RegExp(keyword, 'i');
    return await this.userModel.find({ fullName: regex }, fields).limit(limit).lean();
  }
}
