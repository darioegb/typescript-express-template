import { Model, Document } from 'mongoose';
import { Page } from '@/data/interfaces';
import { HttpException } from '@/exceptions';
import { splitByParamOrUndefined } from '@/utils/util';
import { stringsOrUndefined } from '@/utils';

export default abstract class BaseCrudService<S, D> {
  public model!: Model<D & Document, unknown>;

  /**
   * Get entity by id
   * @param id string
   */
  public async findEntityById(id: string, filter = ''): Promise<D> {
    const findEntity: D = await this.model
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
    const splitSort: stringsOrUndefined = splitByParamOrUndefined(sort);
    const sortObject: unknown = this.getSortObject(splitSort);
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
    return {
      number,
      size,
      totalItems,
      totalPages,
      items: entities,
    };
  }

  /**
   * Create entity
   * @param entityData entityDTO
   */
  public async create(entityData: S | S[]): Promise<D | D[]> {
    try {
      return await this.model.create(<never>entityData);
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
    const updateEntityById: D = await this.model
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
    const deleteEntityById: D = await this.model
      .findByIdAndDelete(id)
      .exec();
    if (!deleteEntityById) {
      throw new HttpException(409, "You're entity doesn't exist");
    }

    return deleteEntityById;
  }

  private getSortObject(splitSort: string[]): unknown {
    return splitSort ? { [splitSort[0]]: splitSort[1] } : { _id: 'asc' };
  }
}
