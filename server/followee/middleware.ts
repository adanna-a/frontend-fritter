import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import FolloweeCollection from '../followee/collection';
import UserCollection from '../user/collection';

/**
 * Checks if the content of the feedName in req.body is valid, i.e not a stream of empty
 * spaces and not more than 140 characters
 */
 const isValidFeedNameContent = (req: Request, res: Response, next: NextFunction) => {
    const {feedName} = req.body as {feedName: string};
    if (!feedName.trim()) {
      res.status(400).json({
        error: 'Feed name content must be at least one character long.'
      });
      return;
    }
  
    if (feedName.length > 50) {
      res.status(413).json({
        error: 'Feed name must be no more than 50 characters.'
      });
      return;
    }
  
    next();
  };

/**
 * Checks if the current user is the author of the freet whose freetId is in req.params
 */
 const isValidFolloweeModifier = async (req: Request, res: Response, next: NextFunction) => {
    const followee = await FolloweeCollection.findOne(req.params.followeeId);
    const userId = followee.authorId;
    if (req.session.userId !== userId.toString()) {
      res.status(403).json({
        error: 'Cannot modify other users\' followees.'
      });
      return;
    }
  
    next();
  };

/**
 * Checks if a followee with feedName in req.body exists
 */
 const isFolloweeExists = async (req: Request, res: Response, next: NextFunction) => {
    const {feedName} = req.body as {feedName: string;};

    console.log(feedName);
;
    if (feedName.length < 1) {
        res.status(400).json({error: `Missing the feedName`})
    }

    const userId = req.session.userId;
    const followee = await FolloweeCollection.findOneByFeedName(feedName, userId);

    if (followee) {
        next();
    } else {
        res.status(401).json({error: 'There is no followee under this feed'});
    }
 }

 /**
 * Checks if a followee with feedName in req.params exists
 */
  const isFolloweeParamsExists = async (req: Request, res: Response, next: NextFunction) => {
    const {feedName} = req.params as {feedName: string;};

    if (!feedName) {
        res.status(400).json({error: `Missing the feedName`})
    }

    const userId = req.session.userId;
    const followee = await FolloweeCollection.findOneByFeedName(feedName, userId);

    if (followee) {
        next();
    } else {
        res.status(401).json({error: 'There is no followee under this feed'});
    }
 }

 /**
 * Checks if a followee with feedName in req.params exists
 */
  const isFolloweeQueryExists = async (req: Request, res: Response, next: NextFunction) => {
    const {feedName} = req.query as {feedName: string;};

    if (!feedName) {
        res.status(400).json({error: `Missing the feedName`})
    }

    const userId = req.session.userId;
    const followee = await FolloweeCollection.findOneByFeedName(feedName, userId);

    if (followee) {
        next();
    } else {
        res.status(401).json({error: 'There is no followee under this feed'});
    }
 }

 /**
 * Checks if a user with userId as author id in req.body exists
 */
  const isFolloweeUserExists = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.body.followee) {
      res.status(400).json({
        error: 'Provided followee username must be nonempty.'
      });
      return;
    }
  
    const user = await UserCollection.findOneByUsername(req.body.followee as string);
    if (!user) {
      res.status(404).json({
        error: `A user with username ${req.body.username as string} does not exist.`
      });
      return;
    }
  
    next();
  };

  export {
    isValidFeedNameContent,
    isValidFolloweeModifier,
    isFolloweeExists,
    isFolloweeParamsExists,
    isFolloweeQueryExists,
    isFolloweeUserExists,
  };