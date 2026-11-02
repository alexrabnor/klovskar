// Kartans platser (lucka 4 och kartvyn). Publikt: inga ledtrådar som avslöjar något.
// x och y är procent av kartbildens bredd och höjd.

export interface Plats { id: string; namn: string; x: number; y: number; text: string }

export const PLATSER: Plats[] = [
  { id: "hotellet", namn: "Hotell Fyrbåken", x: 39, y: 37, text: "Ombyggt lotshus från 1880-talet, tolv rum. Köket ligger på baksidan med egen dörr mot grusgången till tornet. Biblioteket på bottenvåningen, fru Ekbergs sovrum rakt ovanför." },
  { id: "stugan", namn: "Fyrvaktarstugan", x: 63, y: 34, text: "Bertil Holms hem i tolv år. Köksfönstret vetter mot lyktrummet. Härifrån för han fyrens dagbok." },
  { id: "tornet", namn: "Fyrtornet", x: 71, y: 30, text: "34 gjutjärnssteg i spiral upp till urverket och lyktrummet. En ekdörr med lås. Harald Ekberg brukade gå upp varje kväll \"för att se ljuset\"." },
  { id: "sjoboden", namn: "Sjöboden", x: 31, y: 57, text: "Röd bod vid bryggan. Carl Ekberg har nyckeln och säger att den används till fisket." },
  { id: "farjelaget", namn: "Färjeläget", x: 47, y: 64, text: "Stängt sedan isen lade sig natten mot den 30 november. Ingen har kunnat komma eller gå." },
  { id: "krakskar", namn: "Kråkskär", x: 87, y: 84, text: "Obebott skär en dryg kilometer sydost om Klovskär. Syns från tornet, men inte från hotellet." },
  { id: "isen", namn: "Isen", x: 50, y: 84, text: "Fast is sedan den 30 november. Bär en människa, enligt Holm, men inte en häst." },
];
