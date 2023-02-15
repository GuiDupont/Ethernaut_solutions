import logger from "node-color-log";

export function displayResult(success: boolean) {
  if (success) {
    logger.info("Success! 🎉");
  } else {
    logger.warn("Failure!");
  }
}
