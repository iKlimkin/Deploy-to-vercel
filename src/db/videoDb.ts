export enum AvailableResolutions {
  P144 = "P144",
  P240 = "P240",
  P360 = "P360",
  P480 = "P480",
  P720 = "P720",
  P1080 = "P1080",
  P1440 = "P1440",
  P2160 = "P2160",
}

export type VideoType = {
    id: number;
    title: string;
    author: string;
    canBeDownloaded: boolean;
    minAgeRestriction: number | null;
    createdAt: string;
    publicationDate: string;
    availableResolutions: AvailableResolutions[];
  };
export const videoDb: VideoType[] = [
    {
      id: 0,
      title: "string",
      author: "string",
      canBeDownloaded: true,
      minAgeRestriction: null,
      createdAt: "2023-10-13T09:15:13.907Z",
      publicationDate: "2023-10-13T09:15:13.907Z",
      availableResolutions: [AvailableResolutions.P1440],
    },
  ];