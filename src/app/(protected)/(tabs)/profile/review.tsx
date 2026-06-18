// app/(protected)/(tabs)/profile/reviews.tsx

import { ErrorComponent } from "@/src/component/shared";
import { useVendor } from "@/src/lib/context/vendor-context";
import { vendorService } from "@/src/lib/services/vendor.service";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Review = {
  id: string;
  customerName: string;
  rating: number;
  comment: string;
  createdAt: string;
};

type ReviewSummary = {
  rating: number;
  reviewCount: number;
  reviews: Review[];
};

function StarRating({ rating, size = 16 }: { rating: number; size?: number }) {
  return (
    <View style={{ flexDirection: "row", gap: 2 }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Ionicons
          key={i}
          name={
            i <= rating
              ? "star"
              : i - 0.5 <= rating
                ? "star-half"
                : "star-outline"
          }
          size={size}
          color="#F5C518"
        />
      ))}
    </View>
  );
}

function RatingBar({
  star,
  count,
  total,
}: {
  star: number;
  count: number;
  total: number;
}) {
  const pct = total > 0 ? (count / total) * 100 : 0;
  return (
    <View style={styles.barRow}>
      <Text style={styles.barLabel}>{star}</Text>
      <Ionicons name="star" size={12} color="#F5C518" />
      <View style={styles.barTrack}>
        <View style={[styles.barFill, { width: `${pct}%` }]} />
      </View>
      <Text style={styles.barCount}>{count}</Text>
    </View>
  );
}

// function ReviewCard({ review }: { review: Review }) {
//   const initials = review.customerName
//     .split(" ")
//     .map((n) => n[0])
//     .join("")
//     .toUpperCase()
//     .slice(0, 2);

//   return (
//     <View style={styles.card}>
//       <View style={styles.cardHeader}>
//         <View style={styles.avatar}>
//           <Text style={styles.avatarText}>{initials}</Text>
//         </View>
//         <View style={{ flex: 1 }}>
//           <Text style={styles.customerName}>{review.customerName}</Text>
//           <Text style={styles.reviewDate}>
//             {new Date(review.createdAt).toLocaleDateString("en-NG", {
//               day: "numeric",
//               month: "short",
//               year: "numeric",
//             })}
//           </Text>
//         </View>
//         <StarRating rating={review.rating} size={14} />
//       </View>
//       {review.comment ? (
//         <Text style={styles.comment}>{review.comment}</Text>
//       ) : null}
//     </View>
//   );
// }

function ReviewCard({ review }: { review: Review }) {
  return (
    <View style={styles.card}>
      <View style={styles.cardTop}>
        <Text style={styles.customerName}>{review.customerName}</Text>
        <Text style={styles.reviewDate}>
          {new Date(review.createdAt).toLocaleDateString("en-NG", {
            weekday: "short",
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </Text>
      </View>
      <StarRating rating={review.rating} size={18} />
      {review.comment ? (
        <Text style={styles.comment}>{review.comment}</Text>
      ) : null}
    </View>
  );
}

export default function ReviewsScreen() {
  const router = useRouter();
  const { activeVendor } = useVendor();
  const vendorId = activeVendor?.id;

  const [summary, setSummary] = useState<ReviewSummary | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReviews = useCallback(async () => {
    if (!vendorId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await vendorService.getReviews(vendorId);
      setSummary(res);
    } catch (err) {
      setError("Failed to load reviews.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [vendorId]);

  useEffect(() => {
    fetchReviews();
    console.log(summary);
  }, [fetchReviews]);

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color="#111" />
        </TouchableOpacity>
        <Text style={styles.title}>Reviews</Text>
      </View>

      {loading ? (
        <ActivityIndicator
          size="large"
          color="#3B6B44"
          style={{ marginTop: 60 }}
        />
      ) : error ? (
        <ErrorComponent refetch={fetchReviews} />
      ) : !summary || summary.reviewCount === 0 ? (
        <View style={styles.empty}>
          <Ionicons name="star-outline" size={48} color="#ddd" />
          <Text style={styles.emptyText}>No reviews yet</Text>
          <Text style={styles.emptySubtext}>
            Reviews from your customers will appear here
          </Text>
        </View>
      ) : (
        <FlatList
          data={summary.reviews}
          keyExtractor={(r) => r.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <>
              {/* Summary card */}
              {/* <View style={styles.summaryCard}>
                <View style={styles.summaryLeft}>
                  <Text style={styles.avgRating}>
                    {summary?.rating?.toFixed(1) || 0}
                  </Text>
                  <StarRating rating={summary.rating} size={20} />
                  <Text style={styles.totalReviews}>
                    {summary.reviewCount} review
                    {summary.reviewCount !== 1 ? "s" : ""}
                  </Text>
                </View>

                {/* Breakdown bars */}
              {/* <View style={styles.summaryRight}>
                  {[5, 4, 3, 2, 1].map((star) => (
                    <RatingBar
                      key={star}
                      star={star}
                      count={summary.breakdown[star] ?? 0}
                      total={summary.totalReview}
                    />
                  ))}
                </View> */}
              {/*</View> */}

              <View style={styles.summaryCard}>
                <Text style={styles.avgRating}>
                  {summary.rating.toFixed(1)}
                </Text>
                <StarRating rating={summary.rating} size={28} />
                <Text style={styles.totalReviews}>
                  {summary.reviewCount} Total Review
                  {summary.reviewCount !== 1 ? "s" : ""}
                </Text>
              </View>

              <Text style={styles.sectionLabel}>All Reviews</Text>
            </>
          }
          renderItem={({ item }) => <ReviewCard review={item} />}
          ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
  },
  backBtn: { padding: 4 },
  title: { fontSize: 22, fontWeight: "700", color: "#111" },

  list: { padding: 20, paddingTop: 0 },

  // Summary
  summaryCard: {
    flexDirection: "row",
    backgroundColor: "#f9fafb",
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    gap: 16,
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  summaryLeft: { alignItems: "center", justifyContent: "center", gap: 6 },
  avgRating: { fontSize: 40, fontWeight: "700", color: "#111" },
  totalReviews: { fontSize: 13, color: "#999", marginTop: 4 },
  summaryRight: { flex: 1, justifyContent: "center", gap: 6 },

  // Rating bars
  barRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  barLabel: { fontSize: 12, color: "#555", width: 10 },
  barTrack: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#e5e7eb",
    overflow: "hidden",
  },
  barFill: { height: "100%", borderRadius: 3, backgroundColor: "#F5C518" },
  barCount: { fontSize: 12, color: "#999", width: 20, textAlign: "right" },

  sectionLabel: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111",
    marginBottom: 12,
  },

  // Review card
  // card: {
  //   borderWidth: 1,
  //   borderColor: "#f0f0f0",
  //   borderRadius: 14,
  //   padding: 16,
  //   backgroundColor: "#fff",
  // },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 10,
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#f0f7f2",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { fontSize: 13, fontWeight: "600", color: "#3B6B44" },
  // customerName: { fontSize: 14, fontWeight: "600", color: "#111" },
  // reviewDate: { fontSize: 12, color: "#999", marginTop: 2 },
  // comment: { fontSize: 14, color: "#444", lineHeight: 21 },

  // Empty
  empty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    paddingHorizontal: 40,
  },
  emptyText: { fontSize: 18, fontWeight: "600", color: "#111" },
  emptySubtext: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
    lineHeight: 21,
  },

  // here some error
  //   summaryCard: {
  //   alignItems: "center",
  //   backgroundColor: "#f5f5f5",
  //   borderRadius: 16,
  //   paddingVertical: 32,
  //   paddingHorizontal: 24,
  //   marginBottom: 20,
  //   gap: 10,
  // },
  // avgRating: {
  //   fontSize: 56,
  //   fontWeight: "700",
  //   color: "#111",
  //   lineHeight: 64,
  // },
  // totalReviews: {
  //   fontSize: 14,
  //   color: "#999",
  //   marginTop: 4,
  // },

  // Card
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: "#eeeeee",
    gap: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  cardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  customerName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111",
  },
  reviewDate: {
    fontSize: 13,
    color: "#999",
  },
  comment: {
    fontSize: 15,
    color: "#333",
    lineHeight: 23,
    marginTop: 4,
  },
});
