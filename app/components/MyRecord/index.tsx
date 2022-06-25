import { useRef, useEffect, useContext } from "react";
import { MainContext } from "~/routes/index";
import { Form } from "@remix-run/react";

const REGEX = /^[a-z0-9]+$/i;

const MyRecord = () => {
  const { game, dispatch } = useContext(MainContext);
  const itemsRef = useRef<Map<string, HTMLInputElement>>(null!);

  const getMap = () => {
    if (!itemsRef.current) {
      itemsRef.current = new Map();
    }
    return itemsRef.current;
  };

  useEffect(() => {
    if (itemsRef.current) getMap().get("1")?.focus();
  }, []);

  return (
    <Form method="post" autoComplete="off">
      <div style={{ display: "flex", gap: "1rem" }}>
        {[1, 2, 3, 4].map((field) => (
          <input
            type="text"
            key={`Input-${field}`}
            placeholder={"NICK".split("")[field - 1]}
            name={String(field)}
            value={game.nickname[field]}
            onChange={(event) => {
              const eventValue = event.currentTarget.value;
              const local = [...game.nickname];
              const map = getMap();

              if (eventValue === "") {
                local[field] = "";
                dispatch({ type: "SET", field: "nickname", data: local });
                return;
              }

              if (eventValue.match(REGEX)) {
                local[field] = eventValue.toUpperCase();
                dispatch({ type: "SET", field: "nickname", data: local });

                if (field < game.nickname.length) {
                  const inputRef = map.get(String(Number(field) + 1));
                  if (inputRef && inputRef.focus) inputRef.focus();
                }
              }
            }}
            onKeyDown={(event) => {
              const map = getMap();
              if (event.key === "Backspace" && game.nickname[field] === "") {
                const inputRef = map.get(String(Number(field) - 1));
                if (inputRef && inputRef.focus) inputRef.focus();
              }
            }}
            ref={(node) => {
              const map = getMap();
              if (node) map.set(String(field), node);
              else map.delete(String(field));
            }}
            maxLength={1}
          />
        ))}
      </div>

      <input type="hidden" name="score" value={game.stats.score} />

      <button
        type="submit"
        disabled={game.nickname.filter((v) => v.length).length !== 4}
        style={{ marginTop: "1rem" }}
      >
        SAVE RECORD
      </button>
    </Form>
  );
};

export default MyRecord;
