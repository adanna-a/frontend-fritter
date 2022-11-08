import type {HydratedDocument, Types} from 'mongoose';
import type {Like, PopulatedLike} from '../like/model';

// Update this if you add a property to the Like type!
type LikeResponse = {
    _id: string;
    author: string,
    freet: string,
};

/**
 * Transform a raw Like object from the database into an object
 * with all the information needed by the frontend
 *
 * @param {HydratedDocument<Like>} like - A freet
 * @returns {LikeResponse} - The like object formatted for the frontend
 */
 const constructLikeResponse = (like: HydratedDocument<Like>): LikeResponse => {
  console.log('like is hereee :0', like);  
  const likeCopy: PopulatedLike = {
      ...like.toObject({
        versionKey: false // Cosmetics; prevents returning of __v property
      })
    };
    
    const {username} = likeCopy.authorId;
    delete likeCopy.authorId;

    const {content} = likeCopy.freetId;
    delete likeCopy.freetId;

    return {
      ...likeCopy,
      _id: likeCopy._id.toString(),
      author: username,
      freet: content,
    };
  };
  
  export {
    constructLikeResponse
  };