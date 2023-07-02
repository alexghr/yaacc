// importing data makes it easy to work with
import data from "./data.json";

type User = (typeof data)[number];

const ERROR_CHANCE = 0.1;
const [DELAY_MIN, DELAY_MAX] = [50, 100];

export async function autocompleteUsers(
  usernamePrefix: string | null
): Promise<User[]> {
  const cleanedPrefix = usernamePrefix?.trim().toLowerCase();
  if (!cleanedPrefix) {
    return [];
  }

  const users = data.filter((user) =>
    user.username.toLowerCase().startsWith(cleanedPrefix)
  );

  // introduce a bit of variance to simulate remote data
  return new Promise((res, rej) => {
    setTimeout(() => {
      if (Math.random() < ERROR_CHANCE) {
        rej(new Error("Database error"));
      } else {
        res(users);
      }
    }, DELAY_MIN + Math.random() * (DELAY_MAX - DELAY_MIN));
  });
}
