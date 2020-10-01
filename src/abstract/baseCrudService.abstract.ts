import { Model, Document } from 'mongoose';
import { Page } from '../interfaces';
import { HttpException } from '../exceptions';
import { splitByParamOrUndefined } from '../utils/util';

export abstract class BaseCrudService<S, D> {
  public model!: Model<D & Document, {}>;

  /**
   * Get entity by id
   * @param id string
   */
  public async findEntityById(id: string, filter = ''): Promise<D> {
    const findEntity: D | null = await this.model
      .findById(id)
      .select(filter)
      .exec();
    if (!findEntity) {
      throw new HttpException(404, 'Not found');
    }
    return findEntity;
  }

  /**
   * Get entities by page and filters params
   * @param page number
   * @param size number
   * @param sort string by ex. name, asc
   * @param filter string by ex. name email
   */
  public async findEntityByPage(
    page = 1,
    size = 10,
    sort = '',
    filter = ''
  ): Promise<Page<D>> {
    const splitSort: string[] | undefined = splitByParamOrUndefined(sort);
    const sortObject: any = this.getSortObject(splitSort);
    const entities: D[] = await this.model
      .find()
      .select(filter)
      .limit(size)
      .skip((page - 1) * size)
      .sort(sortObject)
      .exec();
    const totalItems = await this.model.countDocuments({}).exec();
    const totalPages = Math.ceil(totalItems / size);
    const number = page;
    const result: Page<D> = {
      number,
      size,
      totalItems,
      totalPages,
      items: entities,
    };
    return result;
  }

  /**
   * Create entity
   * @param entityData entityDTO
   */
  public async create(entityData: S | S[]): Promise<D | D[]> {
    try {
      const createdEntity = await this.model.create(entityData as any);
      return createdEntity;
    } catch (error) {
      throw new HttpException(400, error.message);
    }
  }

  /**
   * Update entity
   * @param id string
   * @param entityData entityDTO
   */
  public async update(id: string, entityData: S): Promise<D> {
    const updateEntityById: D | null = await this.model
      .findByIdAndUpdate(id, { ...entityData }, { new: true })
      .exec();
    if (!updateEntityById) {
      throw new HttpException(409, "You're entity doesn't exist");
    }

    return updateEntityById;
  }

  /**
   * Delete entity
   * @param id string
   */
  public async delete(id: string): Promise<D> {
    const deleteEntityById: D | null = await this.model
      .findByIdAndDelete(id)
      .exec();
    if (!deleteEntityById) {
      throw new HttpException(409, "You're entity doesn't exist");
    }

    return deleteEntityById;
  }

  private getSortObject(splitSort: string[]): any {
    return splitSort ? { [splitSort[0]]: splitSort[1] } : { _id: 'asc' };
  }
}
