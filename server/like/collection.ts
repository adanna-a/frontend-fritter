import type {HydratedDocument, Types} from 'mongoose';
import type {Like} from './model';
import LikeModel from './model';
import UserCollection from '../user/collection';

class LikeCollection {
  /**
   * Add a like to the collection
   *
   * @param {string} authorId - The id of the author of the freet
   * @param {string} freetId - The id of the content of the freet
   * @return {Promise<HydratedDocument<Like>>} - The newly created like
   */
   static async addOne(authorId: Types.ObjectId | string, freetId: Types.ObjectId | string): Promise<HydratedDocument<Like>> {
    const like = new LikeModel({
      authorId,
      freetId,
    });
    await like.save(); // Saves freet to MongoDB
    return like.populate(['authorId', 'freetId']);
  }

  /**
   * Find one like by freetId and authorId
   * 
   * @param {string} authorId - The id of the user liking the freet
   * @param {string} freetId - The id of the freet that the user liked
   * @return {Promise<HydratedDocument<Like>> | Promise<null> } - The like with the given freetId and username, if any
   */
   static async findOne(freetId: Types.ObjectId | string, authorId: Types.ObjectId | string): Promise<HydratedDocument<Like>> {
    const like = await LikeModel.findOne({freetId, authorId});
    return like.populate(['authorId', 'freetId']);
  }

  /**
   * Get all likes by a given user
   * 
   * @param {string} username - The username of the user liking the freets
   * @return {Promise<HydrateDocument<Like>[]>} - An array of all of the likes
   */
  static async findAllByUsername(username: string): Promise<Array<HydratedDocument<Like>>> {
    const user = await UserCollection.findOneByUsername(username);
    return LikeModel.find({authorId: user._id}).populate(['authorId', 'freetId']);;
  }

  /**
   * Find all likes for a specific freet
   * 
   * @param {string} freetId - The id of the freet with likes
   * @return {Promise<HydrateDocument<Like>[]>} - An array of all the likes attached to a Freet
   */
  static async findAllByFreetId(freetId: Types.ObjectId | string): Promise<Array<HydratedDocument<Like>>> {
    return LikeModel.find({freetId}).populate(['authorId', 'freetId']);;
  }

  /**
   * Remove a user like from a freet
   * 
   * @param {string} authorId - The id of the user that liked the freet
   * @param {string} freetId - The id of the liked freet
   */
  static async deleteOne(authorId: Types.ObjectId | string, freetId: Types.ObjectId | string): Promise<boolean> {
    const like = await LikeModel.deleteOne({authorId, freetId});
    return like !== null;
  }

  /**
   * Delete all the likes for an user's freet
   *
   * @param {string} freetId - The id of the freets
   */
   static async deleteManyByFreet(freetId: Types.ObjectId | string): Promise<void> {
    await LikeModel.deleteMany({freetId});
  }

  /**
   * Delete all likes by and towards a user
   *
   * @param {string} authorId - The id of author of freets
   */
   static async deleteManyByUser(authorId: Types.ObjectId | string): Promise<void> {
    await LikeModel.deleteMany({authorId});
  }
}

export default LikeCollection;