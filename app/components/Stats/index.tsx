import { useContext } from "react";
import styles from "./styles.css";
import type { LinksFunction } from "@remix-run/node";
import { MainContext } from "~/routes/index";

export const links: LinksFunction = () => {
  return [
    {
      rel: "stylesheet",
      href: styles,
    },
  ];
};

const Stats = () => {
  const { game } = useContext(MainContext);

  return (
    <header style={{ justifyContent: `${!game.stats.lifes && "center"}` }}>
      <h1> SCORE: {game.stats.score} </h1>

      {!!game.stats.lifes && (
        <span>
          {[...Array(game.stats.lifes).keys()].map((_, index) => (
            <img
              key={`Pokebola-${index}`}
              style={{ width: "25px", height: "25px" }}
              src="favicon.ico"
              alt="Pokebola"
              onDragStart={(e) => e.preventDefault()}
            />
          ))}
        </span>
      )}
    </header>
  );
};

export default Stats;
