const EN_UI = {
  pageTitle: "AI Creator — Generative Content Portfolio",
  pageDescription: "AI creator portfolio: generated images, photo shoots, advertising, AI video, animation, and motion design.",
  images: "Images",
  videos: "Videos",
  about: "About me",
  contact: "Contact",
  menu: "Menu",
  heroTitle: 'I create <span class="grad">AI-generated content</span><br>for brands and projects',
  heroDescription: "Images, videos, animation, and advertising created with AI — from concept to finished work.",
  viewWork: "View work",
  getInTouch: "Get in touch",
  worksCount: "works in the portfolio",
  directionsCount: "creative fields",
  formatsCount: "formats: images and video",
  portfolio: "Portfolio",
  worksByCategory: "Work by category",
  chooseCategory: "Choose a category and filter to explore the work.",
  aboutHeading: "AI creator and video maker",
  aboutIntro: "I create visual stories at the intersection of video production and artificial intelligence. I generate images and video, edit footage, and take ideas through to finished work that people want to watch.",
  skillEditing: "Video editing, pacing, sound, and storytelling",
  skillFilms: "AI short films, series, and narrative videos",
  skillVideo: "AI video generation: animation, UGC, and motion design",
  skillAssistants: "AI assistants for creative and everyday workflows",
  skillImages: "AI images, photo shoots, and advertising creatives",
  skillRestoration: "Photo restoration and enhancement",
  aboutApproachHeading: "From concept to final frame",
  aboutApproach: "I enjoy bringing story, imagery, motion, and sound together. I work on short advertising formats as well as longer narrative projects, including AI films and series. For each project, I develop a visual style and shape the material into a cohesive video.",
  aboutOutro: "I also create AI assistants that help automate workflows and support creative tasks. This portfolio showcases my work and continues to grow.",
  contactHeading: "Let's discuss your project",
  contactIntro: "Message me to commission work or discuss a collaboration.",
  socialLinks: "Social media",
  footer: "AI Portfolio. Created with artificial intelligence.",
  previous: "Previous",
  next: "Next",
  close: "Close",
  allWork: "All work",
  directionSingular: "creative field",
  directionPlural: "creative fields",
  empty: "No work in this section yet — check back soon.",
  photos: "photos",
  example: "Example",
  loadError: "The portfolio could not be loaded. Please try again later."
};

const EN_TAXONOMY = {
  images: ["AI-generated images", {
    photosessions: ["AI photo shoots", "Portrait and character images"],
    banners: ["Banners and advertising", "Advertising creatives and banners"],
    restoration: ["Photo restoration", "Improving old and blurry photos"],
    fantasies: ["Creative experiments", "Creative concepts and experimental images"]
  }],
  video: ["AI-generated video", {
    ugc: ["UGC and talking videos", "Talking-head and UGC formats"],
    animation: ["Cartoons: 3D, anime, and more", "Short and long animated videos in various styles"],
    motion: ["Motion design", "Dynamic animation and motion graphics"],
    product: ["Product videos", "Product advertising videos"],
    cinematic: ["Cinematic videos", "Narrative and atmospheric videos"]
  }]
};

// English text for every work outside the numbered photo-shoot albums.
const EN_WORKS = {
  "fantasy-characters-styles": ["Characters in different styles", "One character in several artistic styles"],
  "fantasy-cctv-night-scene": ["Night scene through a security camera", "Cinematic CCTV-style scene"],
  "fantasy-giant-kinder-egg": ["Giant Kinder Surprise on a truck", "Surreal advertising concept"],
  "fantasy-character-transformation": ["Character transformation — a story in four frames", "Storyboard of a transformation into an anime character"],
  "fantasy-deadpool-pvc": ["PVC Deadpool", "Creative character texture concept"],
  "fantasy-perfume-flatlay": ["Men's fragrance — flat lay", "Product flat-lay composition"],
  "fantasy-fabric-tornado": ["Fabric tornado", "Creative texture concept of a natural force"],
  "fantasy-world-breaking-apart": ["A world breaking apart", "Surreal studio composition"],
  "fantasy-dino-battle-mars": ["Dinosaur battle on Mars", "Fantasy narrative scene"],
  "fantasy-stone-elephant": ["Stone elephant in the city", "Surreal urban scene"],
  "fantasy-ronaldo-caricature": ["Ronaldo caricature in a Real Madrid jersey", "Sports caricature"],
  "fantasy-eye-dino-reflection": ["Eye reflecting a dinosaur", "Macro concept with a fantasy story"],
  "fantasy-ninja-turtle-figure": ["Hand holding a Ninja Turtle figure", "Product composition with a collectible figure"],
  "fantasy-football-chase": ["Chased by a football", "Dynamic sports scene"],
  "fantasy-happy-dog-stadium": ["Happy dog in a football stadium", "Emotional sports scene"],
  "demo-banners-1": ["Example: advertising banner", "Replace this example with your own work."],
  "demo-restoration-1": ["Example: photo restoration", "Replace this example with your own work."],
  "football-boot-product-1": ["Football boot — product video", "Advertising video for sports footwear"],
  "yard-transformation-motion-1": ["Rapid yard makeover", "Dynamic before-and-after transformation"],
  "house-build-motion-1": ["Rapid house construction", "Dynamic before-and-after transformation"],
  "watch-product-1": ["Wristwatch — product video", "Wristwatch advertising video"],
  "night-city-flyover-1": ["Flying over a city at night", "Cinematic motion video"],
  "restaurant-business-card-1": ["Restaurant business card", "Animated business card presentation"],
  "garnier-cream-product-1": ["Garnier cream — product video", "Cosmetic cream advertising video"],
  "coffee-bag-product-1": ["Coffee — product video", "Coffee bag advertising video"],
  "lipstick-product-1": ["Lipstick — product video", "Luxury lipstick advertising video"],
  "sunis-solar-ad-1": ["SUNIS — solar panel ad", "Advertising video for a solar panel installation company"],
  "ugc-fiverr-showcase-1": ["AI UGC — talking video", "Talking-head format for advertising content"],
  "kindergarten-cartoon-1": ["Kindergarten — animated film", "Animated video"],
  "club-film": ["The Club", "Cinematic video"],
  "dawn-code-film": ["Dawn Code", "Narrative video"],
  "letter-to-major-film": ["Letter to the Major", "Narrative video"],
  "last-card-film": ["The Last Card", "Adventure film"],
  "tai-take-film": ["Tai Take", "Narrative video"],
  "shipping-film": ["Ocean shipping", "Cinematic footage of a container ship"],
  "food-fire-product": ["Cooking video", "Dynamic food presentation"],
  "phone-lifestyle-film": ["A story with a smartphone", "Cinematic lifestyle video"],
  "restaurant-scene-film": ["Restaurant scene", "Creative cinematic video"],
  "halloween-film": ["Halloween", "Short cinematic horror video"]
};

function workText(item, field, language) {
  if (language !== "en") return item[field] || "";
  const album = item.id.match(/^(ivan|mia)-photosession-(\d+)$/);
  if (album) {
    const name = album[1] === "ivan" ? "Ivan" : "Mia";
    if (field === "title") return `${name} — AI photo shoot ${album[2]}`;
    if (field === "description") return "AI-generated model portrait";
    if (field === "groupTitle") return `${name} — photo shoot`;
  }
  const translation = EN_WORKS[item.id];
  if (translation) {
    if (field === "title") return translation[0];
    if (field === "description") return translation[1];
  }
  return item[field] || "";
}
