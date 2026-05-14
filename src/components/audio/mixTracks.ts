// Royalty-free / CC0 ambient loops. Swap URLs anytime — no rebuild needed.
// Hosted MP3s (Pixabay Music CDN, all CC0). If a URL ever 404s, replace below.
export type MixGenre = "lofi" | "edm" | "world" | "samba" | "afrobass";

export const MIX_TRACKS: Record<MixGenre, { label: string; url: string }> = {
  lofi: {
    label: "Lofi Hip Hop",
    url: "https://cdn.pixabay.com/audio/2022/05/27/audio_1808fbf07a.mp3",
  },
  edm: {
    label: "EDM",
    url: "https://cdn.pixabay.com/audio/2022/03/15/audio_1bdc395737.mp3",
  },
  world: {
    label: "World",
    url: "https://cdn.pixabay.com/audio/2022/10/30/audio_347111d624.mp3",
  },
  samba: {
    label: "Samba",
    url: "https://cdn.pixabay.com/audio/2023/06/20/audio_50f0a4d1ab.mp3",
  },
  afrobass: {
    label: "Afrobass",
    url: "https://cdn.pixabay.com/audio/2024/02/19/audio_4d4e1d2bb6.mp3",
  },
};

export const MIX_GENRES: MixGenre[] = ["lofi", "edm", "world", "samba", "afrobass"];
export const DEFAULT_MIX: MixGenre = "lofi";
