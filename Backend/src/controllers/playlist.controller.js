import mongoose, { isValidObjectId } from "mongoose";
import { Playlist } from "../models/playlist.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";

const createPlaylist = asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  //TODO: create playlist
  if (!name || !name.trim() || !description || !description.trim()) {
    throw new ApiError(
      400,
      "The name or description of the playlist can't be empty!"
    );
  }

  const playlist = await Playlist.create({
    name,
    description,
    owner: req.user._id,
  });

  if (!playlist) {
    throw new ApiError(
      400,
      "Something went wrong while creating the playlist!"
    );
  }

  return res
    .status(200)
    .json(new ApiResponse(200, playlist, "Playlist created successfully"));
});

const getUserPlaylists = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  //TODO: get user playlists
  if (!isValidObjectId(userId) || !(await User.exists({ _id: userId }))) {
    throw new ApiError("invalid user ID");
  }

  const result = await Playlist.aggregate([
    {
      $match: {
        owner: new mongoose.Types.ObjectId(userId),
      },
    },
    {
      $sort: {
        createdAt: -1,
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "owner",
        pipeline: [
          {
            $project: {
              username: 1,
              fullName: 1,
              avatar: 1,
            },
          },
        ],
      },
    },
    {
      $addFields: {
        owner: {
          $first: "$owner",
        },
        totalVideos: {
          $size: "$videos",
        },
      },
    },
  ]);

  if (!result) {
    throw new ApiError(
      400,
      "Something went wrong while fetching the playlists"
    );
  }

  return res
    .status(200)
    .json(new ApiResponse(200, result, "Playlists fetched successfully"));
});

const getPlaylistById = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;

  if (!isValidObjectId(playlistId)) {
    throw new ApiError(400, "Invalid playlist ID");
  }

  const result = await Playlist.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(playlistId),
      },
    },
    {
      $lookup: {
        from: "videos",
        localField: "videos",
        foreignField: "_id",
        as: "videos",
        pipeline: [
          {
            $lookup: {
              from: "users",
              localField: "owner",
              foreignField: "_id",
              as: "owner",
            },
          },
          {
            $addFields: {
              owner: { $first: "$owner" },
            },
          },
          {
            $project: {
              videoFile: 1,
              thumbnail: 1,
              title: 1,
              description: 1,
              views: 1,
              createdAt: 1,
              owner: {
                _id: 1,
                username: 1,
                fullName: 1,
                avatar: 1,
              },
            },
          },
        ],
      },
    },
  ]);

  if (!result.length) {
    throw new ApiError(404, "Playlist not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, result[0], "Playlist fetched successfully"));
});

const addVideoToPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.params;
  if (
    !playlistId ||
    !videoId ||
    !isValidObjectId(playlistId) ||
    !isValidObjectId(videoId)
  ) {
    throw new ApiError(400, "Invalid video or playlist ID");
  }

  const updatedPlaylist = await Playlist.findOneAndUpdate(
    { _id: playlistId },
    {
      $addToSet: {
        videos: videoId,
      },
    },
    { new: true }
  );

  if (!updatedPlaylist) {
    throw new ApiError(
      400,
      "Something went wrong while adding video to playlist"
    );
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        updatedPlaylist,
        "Video added to the playlist successfully!"
      )
    );
});

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.params;
  // TODO: remove video from playlist
  if (
    !playlistId ||
    !videoId ||
    !isValidObjectId(playlistId) ||
    !isValidObjectId(videoId)
  ) {
    throw new ApiError(400, "Invalid video or playlist ID");
  }

  const updatedPlaylist = await Playlist.findOneAndUpdate(
    { _id: playlistId },
    {
      $pull: {
        videos: videoId,
      },
    },
    { new: true }
  );

  if (!updatedPlaylist) {
    throw new ApiError(
      400,
      "Something went wrong while deleting video from playlist"
    );
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        updatedPlaylist,
        "Video deletd from the playlist successfully!"
      )
    );
});

const deletePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  // TODO: delete playlist
  if (
    !playlistId ||
    !isValidObjectId(playlistId)
  ) {
    throw new ApiError(400, "Invalid playlist ID");
  }

  const deletedPlaylist=await Playlist.findOneAndDelete({_id:playlistId});
  if(!deletedPlaylist){
    throw new ApiError(400,'Something went wrong while deleting the playlist')
  }

  return res.status(200).json(
    new ApiResponse(200,{deleted:true},'Playlist deleted successfully')
  )
  
});

const updatePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  const { name, description } = req.body;

  if (!playlistId || !isValidObjectId(playlistId)) {
    throw new ApiError(400, "Invalid playlist ID");
  }

  const toUpdate = {};
  if (name && name.trim()) toUpdate.name = name;
  if (description && description.trim()) toUpdate.description = description;

  if (Object.keys(toUpdate).length === 0) {
    throw new ApiError(400, "No valid fields provided");
  }

  // 1. Update
  const updated = await Playlist.findByIdAndUpdate(
    playlistId,
    { $set: toUpdate },
    { new: true }
  );

  if (!updated) {
    throw new ApiError(404, "Playlist not found");
  }

  // 2. Re-fetch with aggregation (same as GET)
  const result = await Playlist.aggregate([
    {
      $match: {
        _id: updated._id,
      },
    },
    {
      $lookup: {
        from: "videos",
        localField: "videos",
        foreignField: "_id",
        as: "videos",
        pipeline: [
          {
            $lookup: {
              from: "users",
              localField: "owner",
              foreignField: "_id",
              as: "owner",
            },
          },
          {
            $addFields: {
              owner: { $first: "$owner" },
            },
          },
          {
            $project: {
              videoFile: 1,
              thumbnail: 1,
              title: 1,
              description: 1,
              views: 1,
              createdAt: 1,
              owner: {
                _id: 1,
                username: 1,
                fullName: 1,
                avatar: 1,
              },
            },
          },
        ],
      },
    },
  ]);

  return res.status(200).json(
    new ApiResponse(200, result[0], "Playlist updated successfully")
  );
});

export {
  createPlaylist,
  getUserPlaylists,
  getPlaylistById,
  addVideoToPlaylist,
  removeVideoFromPlaylist,
  deletePlaylist,
  updatePlaylist,
};
