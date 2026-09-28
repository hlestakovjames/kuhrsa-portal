import type { Metadata } from "next";

type ShareMetadataOptions = {
  title: string;
  description: string;
  path: string;
  image: string;
  type?: "article" | "website";
};

function getSiteUrl() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

  if (siteUrl) {
    return siteUrl.replace(/\/+$/, "");
  }

  return "http://localhost:3000";
}

export function createShareMetadata({
  title,
  description,
  path,
  image,
  type = "website",
}: ShareMetadataOptions): Metadata {
  const siteUrl = getSiteUrl();

  const pageUrl = new URL(path, `${siteUrl}/`).toString();
  const imageUrl = new URL(image, `${siteUrl}/`).toString();

  return {
    title,
    description,
    metadataBase: new URL(`${siteUrl}/`),

    openGraph: {
      title,
      description,
      url: pageUrl,
      type,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}