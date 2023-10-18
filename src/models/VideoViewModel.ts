import { AvailableResolutions } from "../db/videoDb";

export type VideoViewModel = {
  /**
   * id of the existing video
   */
  id: number;

  /**
   * Title of the video
   */
  title: string;

  /**
   * Author of the video
   */
  author: string;

  /**
   * Video download status
   */
  canBeDownloaded: boolean;

  /**
   * Age restriction for the video
   */
  minAgeRestriction: number | null;

  /**
   * Video creation date
   */
  createdAt: string;

  /**
   * Video publication date
   */
  publicationDate: string;

  /**
   * Available resolutions of the video
   */
  availableResolutions: AvailableResolutions[];
};
