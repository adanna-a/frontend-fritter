import type {HydratedDocument} from 'mongoose';
import type {Types} from 'mongoose';
import moment from 'moment';
import type {Comment, PopulatedComment} from '../comment/model';

type CommentResponse = {
    _id: string;
    author: string;
    freet: string
    dateCreated: string;
    content: string;
    freetId: Types.ObjectId;
};

/**
 * Encode a date as an unambiguous string
 *
 * @param {Date} date - A date object
 * @returns {string} - formatted date as string
 */
const formatDate = (date: Date): string => moment(date).format('MMMM Do YYYY, h:mm:ss a');

/**
 * Transform a raw Comment object from the database into an object
 * with all the information needed by the frontend
 *
 * @param {HydratedDocument<Comment>} comment - A comment
 * @returns {CommentResponse} - The comment object formatted for the frontend
 */
 const constructCommentResponse = (comment: HydratedDocument<Comment>): CommentResponse => {
    const commentCopy: PopulatedComment = {
      ...comment.toObject({
        versionKey: false // Cosmetics; prevents returning of __v property
      })
    };
    const {username} = commentCopy.authorId;
    const {content, _id} = commentCopy.freetId;
    delete commentCopy.authorId;
    delete commentCopy.freetId;

    return {
      ...commentCopy,
      _id: commentCopy._id.toString(),
      author: username,
      freet: content,
      freetId: _id,
      dateCreated: formatDate(comment.dateCreated),
    };
  };
  
  export {
    constructCommentResponse
  };
  