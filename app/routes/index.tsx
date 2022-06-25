import { createContext, useEffect } from "react";

import {
  json,
  redirect,
  type ActionFunction,
  type LinksFunction,
  type LoaderFunction,
} from "@remix-run/node";

import { useLoaderData } from "@remix-run/react";

import Pokedex, { links as PokedexLinks } from "~/components/Pokedex";
import Stats, { links as StatsLinks } from "~/components/Stats";
import MyRecord from "~/components/MyRecord";

import { useImmerReducer } from "use-immer";

import { prisma } from "~/utils/prisma";

const initialState: Game = {
  pokemon: [],
  stats: {
    score: 0,
    lifes: 3,
  },
  nickname: [...Array(4).fill("")],
  selected: "",
  uncover: false,
  shuffled: [],
  toGuess: {} as Pokemon,
};

export const loader: LoaderFunction = async () => {
  const res = await fetch("https://www.pokemon.com/us/api/pokedex/kalos");

  try {
    return json(await res.json());
  } catch (e) {
    console.log(e);
  }
};

export const action: ActionFunction = async ({ request, params }) => {
  const { values } = await request.formData();
  console.log(params);

  await prisma.player.create({
    data: {
      nickname: "ALAS",
      score: 800,
    },
  });

  return redirect("/leaderboard");
};

export const links: LinksFunction = () => {
  return [...StatsLinks(), ...PokedexLinks()];
};

export const MainContext = createContext<GameContextInterface>({
  game: initialState,
  dispatch: () => {},
});

export default function Index() {
  const pokemon = useLoaderData<Pokemon[]>();

  const [game, dispatch] = useImmerReducer<Game>((draft, action) => {
    switch (action.type) {
      case "INIT":
        const items = draft.pokemon.sort(() => Math.random() - 0.5).slice(0, 3);
        const rand = Math.floor(Math.random() * 3);

        draft.toGuess = items[rand];
        draft.shuffled.unshift(...items);

        const index = draft.pokemon.findIndex(
          (item) => item.number === items[rand].number
        );

        if (index !== -1) draft.pokemon.splice(index, 1);
        break;

      case "REFRESH":
        draft.uncover = false;
        draft.shuffled = [];
        draft.toGuess = {} as Pokemon;
        draft.selected = "";
        break;

      case "PAYLOAD":
        draft.pokemon.unshift(...action.data);
        break;

      case "VALIDATE":
        const { selected, ...stats } = action.data;
        draft.stats = stats;
        draft.selected = selected;
        draft.uncover = true;
        break;

      case "SET":
        draft[action.field] = action.data;
        break;

      default:
        break;
    }
  }, initialState);

  useEffect(() => dispatch({ type: "PAYLOAD", data: pokemon }), []);

  return (
    <MainContext.Provider value={{ game, dispatch }}>
      <Stats />
      {!game.stats.lifes && game.stats.score >= 100 ? (
        <MyRecord />
      ) : !game.stats.lifes ? (
        <a href="/"> Retry </a>
      ) : (
        game.pokemon.length && <Pokedex />
      )}
    </MainContext.Provider>
  );
}
