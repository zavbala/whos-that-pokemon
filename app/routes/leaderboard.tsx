import { prisma } from "~/utils/prisma";
import { json, type LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { type Player } from "@prisma/client";

export const loader: LoaderFunction = async () => {
  const players = await prisma.player.findMany({
    orderBy: [{ score: "desc" }],
  });

  try {
    return json(players);
  } catch (e) {
    console.log(e);
  }
};

export default function Leaderboard() {
  const players = useLoaderData();

  return (
    <>
      <table>
        <thead>
          <tr>
            <th> Nickname </th>
            <th> Score </th>
            <th> </th>
          </tr>
        </thead>

        <tbody>
          {players.map((player: Player) => {
            const { id, createdAt, ...attrs } = player;
            return (
              <tr key={player.id}>
                {Object.values(attrs).map((value, index) => (
                  <td key={index}> {value} </td>
                ))}
                <td> {String(createdAt).split("T")[0]} </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
}
