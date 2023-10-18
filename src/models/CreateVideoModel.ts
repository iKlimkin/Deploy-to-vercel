import { AvailableResolutions } from "../db/videoDb";

export type CreateVideoModel = {
  /**
   * Title of the video
   */
  title: string;

  /**
   * Author of the video.
   */
  author: string;

  /**
   * Available Resolutions for the video.
   */
  availableResolutions: AvailableResolutions[];
};
