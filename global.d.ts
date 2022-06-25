export {};

declare global {
  interface Pokemon {
    id: number;
    type: string;
    name: string;
    slug: string;
    abilities: string[];
    detailPageURL: string;
    weight: number;
    weakness: string[];
    number: string;
    height: number;
    collectibles_slug: string;
    featured: string;
    ThumbnailAltText: string;
    ThumbnailImage: string;
  }

  interface Game {
    nickname: string[];
    stats: {
      score: number;
      lifes: number;
    };
    pokemon: Pokemon[];
    shuffled: Pokemon[];
    uncover: boolean;
    selected: string;
    toGuess: Pokemon;
  }

  interface GameContextInterface {
    game: Game;
    dispatch: (values: any) => void;
  }
}
