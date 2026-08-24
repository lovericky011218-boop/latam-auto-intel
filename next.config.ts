const isGitHubPages = process.env.GITHUB_PAGES === "true";

export default {
  ...(isGitHubPages
    ? {
        output: "export" as const,
        trailingSlash: true,
        images: { unoptimized: true },
      }
    : {}),
};
