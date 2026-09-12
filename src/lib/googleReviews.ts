import "server-only";
import { getGoogleReviewsSettings } from "@/content/store";

export type GoogleReview = {
  id: string;
  author: string;
  authorPhoto: string;
  authorProfileUrl: string;
  rating: number;
  text: string;
  relativeTime: string;
};

export type GoogleReviewsData = {
  rating: number;
  totalReviews: number;
  mapsUri: string;
  reviews: GoogleReview[];
};

// Google's Places API (New) "Place Details" endpoint. It returns at most
// 5 reviews per place (a Google-side limit, not ours), sorted by
// relevance. We cache the response for an hour so we don't burn API
// quota on every page load, and to stay well within Google's guidance
// against re-fetching review content excessively.
export async function getGoogleReviews(
  languageCode: string
): Promise<GoogleReviewsData | null> {
  const settings = await getGoogleReviewsSettings();
  if (!settings?.apiKey || !settings?.placeId) return null;

  try {
    const res = await fetch(
      `https://places.googleapis.com/v1/places/${settings.placeId}?languageCode=${languageCode}`,
      {
        headers: {
          "X-Goog-Api-Key": settings.apiKey,
          "X-Goog-FieldMask": "rating,userRatingCount,googleMapsUri,reviews",
        },
        next: { revalidate: 3600 },
      }
    );

    if (!res.ok) {
      console.error("Google Places API error:", res.status, await res.text());
      return null;
    }

    const data = await res.json();

    const reviews: GoogleReview[] = (data.reviews ?? []).map(
      (r: {
        name: string;
        rating: number;
        text?: { text: string };
        relativePublishTimeDescription: string;
        authorAttribution?: {
          displayName?: string;
          photoUri?: string;
          uri?: string;
        };
      }) => ({
        id: r.name,
        author: r.authorAttribution?.displayName ?? "Google User",
        authorPhoto: r.authorAttribution?.photoUri ?? "",
        authorProfileUrl: r.authorAttribution?.uri ?? "",
        rating: r.rating,
        text: r.text?.text ?? "",
        relativeTime: r.relativePublishTimeDescription ?? "",
      })
    );

    return {
      rating: data.rating ?? 0,
      totalReviews: data.userRatingCount ?? 0,
      mapsUri: data.googleMapsUri ?? "",
      reviews,
    };
  } catch (err) {
    console.error("Failed to fetch Google reviews:", err);
    return null;
  }
}
