import { GetterTree } from "vuex";
import { State } from "./state";

export type Getters = {
  // doubleCount(state: State): number;
};

export const getters: GetterTree<State, State> & Getters = {};