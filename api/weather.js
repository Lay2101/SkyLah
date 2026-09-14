import skylahHandler from "./skylahweatherforecasting.js";

/**
 * Weather handler alias pointing to the skylahweatherforecasting endpoint logic.
 */
export default async function handler(req, res) {
  return skylahHandler(req, res);
}
