import { async } from "postcss-js";

const API_URL = "http://127.0.0.1:30010/remote/object/call";

// const playMode = "/" // build
const playMode = "/UEDPIE_0_"; // Editor

export async function callAPI({ functionName, parameters, LevelPath }) {
  return fetch(API_URL, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      objectPath:
        "/Game/Maps/Scenarios/" +
        LevelPath +
        playMode +
        LevelPath +
        "." +
        LevelPath +
        ":PersistentLevel.BP_ConnectionManager_C_1",
      functionName,
      parameters,
    }),
  }).then((res) => res.json());
}
