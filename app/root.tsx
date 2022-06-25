import type { MetaFunction } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import { useEffect } from "react";
import globalStyles from "~/styles/shared.css";

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "Who's That Pokémon",
  viewport: "width=device-width,initial-scale=1",
});

export default function App() {
  useEffect(() => {
    console.log("%cPokémon", "font-size: 7rem; color: yellow;");
    console.log(
      "%chttps://github.com/zavbala/whos-that-pokemon",
      "font-size: 1.3rem; color: cyan;"
    );
  }, []);

  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
        <link rel="stylesheet" href={globalStyles} />
      </head>
      <body onContextMenu={(e) => e.preventDefault()}>
        <main>
          <Outlet />
          <ScrollRestoration />
          <Scripts />
          <LiveReload />
        </main>
      </body>
    </html>
  );
}
