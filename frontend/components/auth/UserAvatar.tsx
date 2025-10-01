import React, { useMemo } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

interface UserAvatarProps {
  user: {
    email: string | null;
    uid: string;
    photoURL?: string | null;
    displayName?: string | null;
  } | null;
  size?: number;
  onPress?: () => void;
}

const UserAvatar = ({ user, size = 36, onPress }: UserAvatarProps) => {
  console.log("user", user);
  const [imageError, setImageError] = React.useState(false);

  const initials = useMemo(() => {
    if (!user) return "?";
    if (user.displayName) {
      const parts = user.displayName.trim().split(/\s+/);
      return parts
        .slice(0, 2)
        .map(p => p[0]?.toUpperCase())
        .join("");
    }
    if (user.email) return user.email[0].toUpperCase();
    return "U";
  }, [user]);

  const fallbackContent = (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: "#444",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text style={{ color: "#fff", fontSize: size * 0.45, fontWeight: "600" }}>
        {initials}
      </Text>
    </View>
  );

  const content =
    user?.photoURL && !imageError ? (
      <Image
        source={{ uri: user.photoURL }}
        style={{ width: size, height: size, borderRadius: size / 2 }}
        onError={() => setImageError(true)}
      />
    ) : (
      fallbackContent
    );

  if (onPress) {
    return (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.7}
        style={{ padding: 2 }}
      >
        {content}
      </TouchableOpacity>
    );
  }
  return <View style={{ padding: 2 }}>{content}</View>;
};

export default UserAvatar;
