import type { Status } from "@smart-todo/contracts";
import { transitions } from "./constants.js";
export function canTransition(from: Status, to: Status): boolean { return from === to || transitions[from].includes(to); }
