import { ErrorType, ErrorsMessages } from "./customErrors";

export const createErrorMessage = (errorField: string): ErrorsMessages => {
  return {
    message: "Any<string>",
    field: `${errorField}`
    }
  };