import CheckersController from "./business/controller/checkersController.mjs";
import { BadRequestException } from "./util/exception/badRequestException.mjs";

const controller = new CheckersController();

export const handler = async (event) => {
  let returnedResponse = {};  
  switch (event.httpMethod) {
    case "POST":
      returnedResponse = await controller.create(event);
      break;
    case "GET":
      returnedResponse = await controller.get(event);
      break;
    case "PATCH":
      returnedResponse = await controller.patch(event);
      break;
    default:
      throw new BadRequestException("No httpMethod was given, thus nothing will be given. Double check your request.")
  }

  const response = {
    statusCode: returnedResponse?.statusCode || 200,
    headers: returnedResponse?.headers || null,
    body: JSON.stringify(returnedResponse?.response)|| JSON.stringify("Something unexpected happend! Check the logs."),
  };
  return response;
};
