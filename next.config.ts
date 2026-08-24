const isStaticHosting =
  process.env.GITHUB_PAGES === "true" || process.env.CF_PAGES === "1";

export default {
  ...(isStaticHosting
    ? {
        output: "export" as const,
        trailingSlash: true,
        images: { unoptimized: true },
      }
    : {}),
};
