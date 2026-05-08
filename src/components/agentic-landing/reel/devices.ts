// MonkeY Teer — Devin Teer's reel. Each video becomes a floating 3D device.
export type Device = {
  id: string;
  title: string;
  role: string;
};

export const DEVICES: Device[] = [
  { id: "4sn-nB52bGE", title: "Once Upon a Time in America", role: "Production / Cast" },
  { id: "OH8ajVijDM8", title: "Bizzarro e Fantastico", role: "Monkey Teer Production" },
  { id: "YVOVWfuJ68Y", title: "L'imposteur du 16 Rue Ravignan", role: "Monkey Teer Production" },
  { id: "0iiwUgv2U0o", title: "Off-Key", role: "Monkey Teer Production" },
  { id: "ocklAzBhZQM", title: "Parenthesis", role: "Cinematographer" },
  { id: "a5nX0nCCIes", title: "Him — Batman Thriller Short", role: "Monkey Teer Entertainment" },
  { id: "CiOmC95OnRA", title: "Him & Her", role: "Monkey Teer Entertainment" },
  { id: "V6RIdwkjE_c", title: "Son of Sheba", role: "Executive Producer" },
  { id: "okf0wKINsvM", title: "MonkeY Teer — Untitled I", role: "Monkey Teer Production" },
  { id: "6L9esv2doHw", title: "MonkeY Teer — Untitled II", role: "Monkey Teer Production" },
];

export const thumb = (id: string) => `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
