export interface LangItem {
  fetchError: string;
  attachments: {
    single: {
      attachments: string; // Post has one attachment.
      has: string; // Attachments alt text is {altText}
      hasNot: string;
    }
    multiple: {
      attachments: string; // Post has {count} attachments
      has: string; // Attachment {index} alt text is {altText}
      hasNot: string; // Attachment {index} do not have alt text
    }
  }
  intro: string; // A screenshot of post by {displayName} ({username})... posted on {date} and has {favourites}, {boosts}, {replies}
  poll: {
    intro: string;
    item: string; // {title} {percentage}%
  }
}

const en: LangItem = {
  fetchError: "Failed to fetch post content from Mastopoet",
  attachments: {
    single: {
      attachments: "Post has one attachment.",
      has: "The attachments alt text is:\n{altText}",
      hasNot: "It does not have an alt text set.",
    },
    multiple: {
      attachments: "Post has {count} attachments.",
      has: "Attachment {index}'s alt text is: {altText}",
      hasNot: "Attachment {index} does not have an alt text.",
    },
  },
  intro: "A screenshot of post by {displayName} ({username}) beautified by Mastopoet tool. It was posted on {date} and has {favourites} favourites, {boosts} boosts and {replies} replies.",
  poll: {
    intro: "Poll results:",
    item: "{percentage}% {title}",
  },
}

const fi: LangItem = {
  fetchError: "Virhe haettaessa viestin sisältöä Mastopoetista",
  attachments: {
    single: {
      attachments: "Viestillä on yksi liite.",
      has: "Liitteen vaihtoehtoinen teksti on:\n{altText}",
      hasNot: "Liitteellä ei ole vaihtoehtoista tekstiä.",
    },
    multiple: {
      attachments: "Viestillä on {count} liitettä.",
      has: "Liitteen {index} vaihtoehtoinen teksti on: {altText}",
      hasNot: "Liitteellä {index} ei ole vaihtoehtoista tekstiä.",
    },
  },
  intro: "Käyttäjän {displayName} ({username}) viesti, josta on luotu kuvakaappaus Mastopoet-työkalulla. Viesti on lähetetty {date} ja sillä on {favourites} tykkäystä, {boosts} boostia ja {replies} vastausta.",
  poll: {
    intro: "Äänestystulokset:",
    item: "{percentage}% {title}",
  },
}

const de: LangItem = {
  fetchError: "Fehler beim Abrufen des Postinhalts von Mastopoet",
  attachments: {
    single: {
      attachments: "Post hat einen Anhang.",
      has: "Der Anhang hat einen Alternativtext:\n{altText}",
      hasNot: "Der Anhang hat keinen Alternativtext.",
    },
    multiple: {
      attachments: "Post hat {count} Anhänge.",
      has: "Anhang {index} hat einen Alternativtext: {altText}",
      hasNot: "Anhang {index} hat keinen Alternativtext.",
    },
  },
  intro: "Ein Bildschirmfoto eines Beitrags von {displayName} ({username}) verschönert mit der Software Mastopoet. Er wurde am {date} veröffentlicht und hat {favourites} Favoriten, {boosts} Boosts und {replies} Antworten.",
  poll: {
    intro: "Umfrageergebnisse:",
    item: "{percentage}% {title}",
  },
}

export default {
  'fi': fi,
  'de': de,
  'en': en,
} as {
  [key: string]: LangItem;
}