import {pool} from "./config/db"

// async function test() {
//   try {
//     const result = await pool.query("SELECT NOW()");
//     console.log("Connected!");
//     console.log(result.rows[0]);
//   } catch (err) {
//     console.error(err);
//   } finally {
//     await pool.end();
//   }
// }

// test();

import { createUrl } from "./repo/url.repo";

async function test() {
  const url = await createUrl(
    "abc123",
    "https://google.com"
  );

  console.log(url);
}

test();