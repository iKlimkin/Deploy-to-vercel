import { AvailableResolutions } from "../db/videoDb";

export type UpdateVideoModel = {
  /**
   * Title of the video
   */
  title: string;

  /**
   * Author of the video
   */
  author: string;

  /**
   * Available resolutions for the video
   */
  availableResolutions: AvailableResolutions[];

  /**
   * Video download status
   */
  canBeDownloaded: boolean;

  /**
   *  Age restriction for the video
   */
  minAgeRestriction: number;

  /**
   * Publication date of the video
   */
  publicationDate: string;
};
