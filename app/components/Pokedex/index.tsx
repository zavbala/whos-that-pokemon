import { useContext, useEffect, type MouseEvent } from "react";
import styles from "./styles.css";
import { type LinksFunction } from "@remix-run/node";
import { MainContext } from "~/routes/index";

export const links: LinksFunction = () => {
  return [
    {
      rel: "stylesheet",
      href: styles,
    },
  ];
};

const Pokedex = () => {
  const { game, dispatch } = useContext(MainContext);

  const validatePick = (event: MouseEvent<HTMLButtonElement>) => {
    const [number] = event.currentTarget.id.split("-");

    let copy = { ...game.stats };
    if (game.toGuess.number === number) copy.score += 100;
    else copy.lifes -= 1;

    dispatch({
      type: "VALIDATE",
      data: { ...copy, selected: event.currentTarget.id },
    });
  };

  useEffect(() => {
    if (!game.uncover && !game.shuffled.length) dispatch({ type: "INIT" });
  }, [game, dispatch]);

  useEffect(() => {
    if (game.uncover) {
      const delay = setTimeout(() => {
        dispatch({ type: "REFRESH" });
      }, 1500);
      return () => clearTimeout(delay);
    }
  }, [game, dispatch]);

  return (
    <section>
      <div style={{ width: "250px", height: "250px", marginBottom: "0.7rem" }}>
        <img
          onDragStart={(e) => e.preventDefault()}
          style={{
            filter: `brightness(${game.uncover ? "100%" : "0%"})`,
          }}
          src={game.toGuess?.ThumbnailImage}
          alt={game.toGuess?.ThumbnailAltText}
          loading="lazy"
        />
      </div>

      {game.shuffled.map((pokemon, index) => (
        <button
          type="button"
          disabled={game.uncover}
          key={pokemon.name + "-" + pokemon.id}
          id={`${pokemon.number}-${index}`}
          onClick={validatePick}
          style={{
            backgroundColor: `${
              game.uncover &&
              (game.toGuess.number === pokemon.number
                ? "lightgreen"
                : game.selected.split("-")[1] === String(index) && "white")
            }`,
          }}
        >
          {pokemon.name}
        </button>
      ))}
    </section>
  );
};

export default Pokedex;
