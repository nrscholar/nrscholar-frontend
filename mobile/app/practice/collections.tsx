import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
  Modal,
} from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get("window");

const C = {
  primary: "#141779",
  secondary: "#006a62",
  secondaryContainer: "#57fae9",
  onSecondaryContainer: "#007168",
  background: "#f7f9fb",
  white: "#ffffff",
  outline: "#767683",
  outlineVariant: "#c7c5d4",
  orange: "#ff9f43",
  yellow: "#ffd700",
};

interface CollectibleCard {
  id: string;
  title: string;
  icon: string;
  collected: boolean;
  desc: string;
  image: string;
}

interface Collection {
  id: string;
  name: string;
  cards: CollectibleCard[];
  badgeName: string;
  unlocked: boolean;
  progress: number;
}

const COLLECTIONS_DATA: Collection[] = [
  {
    id: "ahmedabad",
    name: "Ahmedabad Collection",
    badgeName: "🏆 Ahmedabad Master Badge",
    unlocked: true,
    progress: 3,
    cards: [
      {
        id: "kite",
        title: "Kite Festival Card",
        icon: "sailing",
        collected: true,
        desc: "International Kite Festival (Uttarayan) turns Gujarat sky into a canvas of colors!",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCOny1jIhktsZ517Es0_GtB_gIdbzcdbuUprQ-WF4tHiUcPsxBv2iGSuJWy4nTnrICPNSMVAh8-5TFcKslbcljo08MTdN76CgF9u4oGJmnvjzQuUjQRKuK9GFYkLvzEJzkTnUgaITJWayZduw8YSC1tiDCbEfXhdzb1wl6dAQLHcdzoYYr5L0Mmmgw0NqfsZ5yLPwbnLZr7sKxvh0GBFEa4liy1bTnvMxsPbihoIq37PDWENubIolbX4KAH5p1mcx0dD2GI55_zbQ",
      },
      {
        id: "riverfront",
        title: "Sabarmati Riverfront Card",
        icon: "waves",
        collected: true,
        desc: "A beautiful riverfront promenade built on the banks of the historic Sabarmati River.",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBsw5QM4ckfgV4r47k9iglGsrwO7NzpEQqaFt2Wapg5Z_iullDNHZxy8K3lBwww8wTKzKsTW4HZXRyvol6fP1If9EMT3e3dkzP8Txldwtfnye-t2qm4J4TE2zMuerwTlchYoY6EmHwK-sdI3eWHPDC4EZCEILl48U94yr2KphtMG5vQoDZPck6qzgiTs5t4IyRDqjUvKFWgeaT59xOPjiNk0I42Nx8wcybHADz8X62nhcVwziGPykMqrGGRBq_KqDJeU99U9Ss8hg",
      },
      {
        id: "heritage",
        title: "Heritage City Card",
        icon: "temple-hindu",
        collected: true,
        desc: "Ahmedabad was declared India's first UNESCO World Heritage City in 2017.",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBySqOarQl_2QVMKQTFpIrfA6OyfRZa9AKi8XKC9IGfZrvtKhpfK50qr2C021sWBJ4nrt0PSTlZCZIPfb1FZzw8-lzBzH3AdnYjbinFoSubThNCyCIVSq4FeMaZFFtiJrvEnmI5zoeY6Ja-QTw5pisfB-TapQ0bYU_nKHb-tlGCN5GN8P5XG_PmreHw5L4xfIueUcuPpfMr-wiA80WIOqC14mkhMFWLMK5dxuYsdrVAKpMwOMDnjPhW2QxcQO_U_QuqT65VvcP3wA",
      },
    ],
  },
  {
    id: "gandhinagar",
    name: "Gandhinagar Collection",
    badgeName: "🏆 Green City Master Badge",
    unlocked: false,
    progress: 1,
    cards: [
      {
        id: "akshardham",
        title: "Akshardham Temple",
        icon: "home",
        collected: true,
        desc: "A massive, beautiful temple built with pink sandstone, representing architecture and art.",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDW4QR3okRxfyDYGBcckUo_5262EP8MttpJ84m9LYCXP3Z5yG-gzcvthx6hMC8ktY4Z1M8lsB53MP1-Aqs2_hCaKFQHdgFPyirRdgDeqNYxSAuBqqRRvdQDwrdU2ZYAoDnl2qgB9BgAiMd04m5MmbeuHQULQz7zAWAI04oTpSrLN9jlcLce2yzi5fJVOEiskVCcjCgRx0tdYPdBBPGhQviMPpUSg-HZDMHwMDvVR-xzutGwo4q0vFDnxib9R5RfbjAgOI_e7pVhDg",
      },
      {
        id: "indroda",
        title: "Indroda Dinosaur Park",
        icon: "pets",
        collected: false,
        desc: "Known as India's Jurassic Park, it holds fossilised dinosaur eggs and skeleton models.",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAIUh4mbkBc6p_INhz-RWpzD4E3i4upVIc85YORgArLaPQ-BpyKd__tr7dbgfBFON8CX9MoGTqr0kcDDq0wnqD7D2wSKwaeRjLNdhKTgqAdjxgrdeLOomzwwsL7MiSJ73kYyX4HhssxDlub28Yv1esVfCT5acshzaqsFjNxs7Jo7a1_eZ_-9Pg92fxcErBbW9jY4sd3EZjPVQftnKZa0dNPXJq7tNYuHG7Qb3PWg_UCPSCOyK2eylBugrfkFvCBSoxYXEcgXCaDjA",
      },
    ],
  },
];

export default function MyCollections() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [collections] = useState<Collection[]>(COLLECTIONS_DATA);
  const [selectedCard, setSelectedCard] = useState<CollectibleCard | null>(null);

  return (
    <View style={styles.root}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 16) }]}>
        <View style={styles.headerBar}>
          <TouchableOpacity style={styles.iconBtn} onPress={() => router.back()}>
            <MaterialIcons name="arrow-back-ios" size={20} color={C.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>My Collections</Text>
          <View style={{ width: 40 }} />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Intro */}
        <View style={styles.introCard}>
          <MaterialIcons name="auto-awesome" size={28} color={C.orange} />
          <Text style={styles.introTitle}>Explorer Collections</Text>
          <Text style={styles.introDesc}>
            Unlock cities, learn about monuments, space, and culture to build your unique card deck!
          </Text>
        </View>

        {/* Collections Map */}
        {collections.map((col) => {
          const isFull = col.progress === col.cards.length;

          return (
            <View key={col.id} style={styles.collectionSection}>
              <View style={styles.collectionHeader}>
                <View>
                  <Text style={styles.colTitle}>{col.name}</Text>
                  <Text style={styles.colSub}>
                    Collected: {col.progress} / {col.cards.length}
                  </Text>
                </View>

                {/* Master Badge status */}
                <View style={[styles.masterBadgeWrap, isFull && styles.badgeCollectedGlow]}>
                  <Text style={styles.badgeLabel}>
                    {isFull ? col.badgeName : "🔒 Master Badge Locked"}
                  </Text>
                </View>
              </View>

              {/* Cards Grid */}
              <View style={styles.cardsGrid}>
                {col.cards.map((card) => (
                  <TouchableOpacity
                    key={card.id}
                    style={[styles.cardItem, !card.collected && styles.cardLocked]}
                    activeOpacity={0.85}
                    onPress={() => card.collected && setSelectedCard(card)}
                  >
                    <Image
                      source={{ uri: card.image }}
                      style={[styles.cardImage, !card.collected && styles.imageBlur]}
                    />

                    {!card.collected && (
                      <View style={styles.lockedOverlay}>
                        <MaterialIcons name="lock" size={24} color={C.white} />
                      </View>
                    )}

                    <View style={styles.cardInfo}>
                      <Text style={styles.cardTitleText} numberOfLines={1}>
                        {card.title}
                      </Text>
                      {card.collected && (
                        <MaterialIcons name="check-circle" size={14} color={C.secondary} />
                      )}
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          );
        })}
      </ScrollView>

      {/* ── CARD DETAIL MODAL ── */}
      <Modal
        visible={!!selectedCard}
        transparent
        animationType="slide"
        onRequestClose={() => setSelectedCard(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedCard && (
              <>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalHeaderTitle}>{selectedCard.title}</Text>
                  <TouchableOpacity
                    style={styles.closeBtn}
                    onPress={() => setSelectedCard(null)}
                  >
                    <MaterialIcons name="close" size={24} color={C.outline} />
                  </TouchableOpacity>
                </View>

                <ScrollView contentContainerStyle={styles.modalScrollBody} showsVerticalScrollIndicator={false}>
                  <View style={styles.modalBody}>
                    <View style={styles.cardFrame}>
                      <Image source={{ uri: selectedCard.image }} style={styles.cardBigImage} />
                      <LinearGradient
                        colors={["transparent", "rgba(0,0,0,0.8)"]}
                        style={styles.cardFrameGlow}
                      >
                        <View style={styles.frameLabelRow}>
                          <MaterialIcons name={selectedCard.icon as any} size={20} color={C.yellow} />
                          <Text style={styles.frameLabelText}>COLLECTIBLE CARD</Text>
                        </View>
                      </LinearGradient>
                    </View>

                    <View style={styles.cardDescBox}>
                      <Text style={styles.descTitle}>Did You Know? 💡</Text>
                      <Text style={styles.descText}>{selectedCard.desc}</Text>
                    </View>

                    <TouchableOpacity
                      style={styles.backToDeckBtn}
                      onPress={() => setSelectedCard(null)}
                    >
                      <Text style={styles.backToDeckText}>Back to Deck</Text>
                    </TouchableOpacity>
                  </View>
                </ScrollView>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: C.background,
  },
  header: {
    backgroundColor: C.white,
    borderBottomWidth: 1.5,
    borderBottomColor: "#f0f0f0",
    paddingHorizontal: 20,
    paddingBottom: 16,
    zIndex: 50,
  },
  headerBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 48,
  },
  iconBtn: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: C.primary,
    fontFamily: "Quicksand",
  },
  scroll: {
    padding: 20,
    gap: 24,
  },
  introCard: {
    backgroundColor: C.white,
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    gap: 8,
    borderWidth: 1.5,
    borderColor: "#f0f0f0",
  },
  introTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: C.primary,
  },
  introDesc: {
    fontSize: 13,
    color: C.outline,
    textAlign: "center",
    lineHeight: 18,
  },
  collectionSection: {
    backgroundColor: C.white,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1.5,
    borderColor: "#f0f0f0",
    gap: 16,
  },
  collectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  colTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: C.primary,
  },
  colSub: {
    fontSize: 12,
    color: C.outline,
    fontWeight: "600",
    marginTop: 2,
  },
  masterBadgeWrap: {
    backgroundColor: "rgba(118, 118, 131, 0.1)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  badgeCollectedGlow: {
    backgroundColor: "rgba(255, 215, 0, 0.2)",
    borderWidth: 1,
    borderColor: "#ffd700",
  },
  badgeLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: C.primary,
  },
  cardsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  cardItem: {
    width: "48%",
    height: 160,
    marginBottom: 12,
    backgroundColor: C.background,
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1.5,
    borderColor: "#f0f0f0",
  },
  cardLocked: {
    backgroundColor: "rgba(118, 118, 131, 0.1)",
  },
  cardImage: {
    width: "100%",
    height: 110,
  },
  imageBlur: {
    opacity: 0.3,
  },
  lockedOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 110,
    backgroundColor: "rgba(0,0,0,0.45)",
    alignItems: "center",
    justifyContent: "center",
  },
  cardInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  cardTitleText: {
    flex: 1,
    marginRight: 4,
    fontSize: 11,
    fontWeight: "700",
    color: C.primary,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: C.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: "85%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    backgroundColor: C.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderBottomWidth: 1.5,
    borderBottomColor: "#eee",
  },
  modalScrollBody: {
    flexGrow: 1,
  },
  modalHeaderTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: C.primary,
  },
  closeBtn: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  modalBody: {
    padding: 24,
    alignItems: "center",
    gap: 20,
    paddingBottom: 40,
  },
  cardFrame: {
    width: "100%",
    maxWidth: 280,
    height: 320,
    borderRadius: 24,
    overflow: "hidden",
    borderWidth: 4,
    borderColor: C.yellow,
    position: "relative",
  },
  cardBigImage: {
    width: "100%",
    height: "100%",
  },
  cardFrameGlow: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
    justifyContent: "flex-end",
    padding: 16,
  },
  frameLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  frameLabelText: {
    color: C.white,
    fontSize: 12,
    fontWeight: "700",
  },
  cardDescBox: {
    backgroundColor: C.white,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: "#eef0f2",
    width: "100%",
  },
  descTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: C.primary,
    marginBottom: 6,
  },
  descText: {
    fontSize: 13,
    color: C.onSecondaryContainer,
    lineHeight: 18,
  },
  backToDeckBtn: {
    backgroundColor: C.primary,
    paddingVertical: 14,
    borderRadius: 16,
    width: "100%",
    alignItems: "center",
  },
  backToDeckText: {
    color: C.white,
    fontSize: 14,
    fontWeight: "700",
  },
});
