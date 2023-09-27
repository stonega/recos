import { atom, createStore } from "jotai";

const uerStore = createStore()

export const creditAtom = atom(0);
export const productsAtom = atom([]);
