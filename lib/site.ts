const site_url = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export const socialLinks = {
  twitter: "https://x.com/Dharmeshwr",
  github: "https://github.com/dharmeshwr/",
  linkedin: "https://www.linkedin.com/in/dharmeshxr",
  email: "mailto:dharmeshwr@gmail.com",
};

export const metaData = {
  title: "Github Heatmap Designer",
  description: "Turn your GitHub contribution graph into pixel art! Design and draw on your heatmap with custom patterns and brushes to create a stunning developer profile.",
  name: "Github Heatmap Designer",
  baseUrl: site_url,
  links: { ...socialLinks },
  mailSupport: "dharmeshwr@gmail.com",
};
