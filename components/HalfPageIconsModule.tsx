import { n } from "@/utils/scaling";
import { MaterialIcons } from "@expo/vector-icons";
import { Pressable, View } from "react-native";
import { StyleSheet } from "react-native";

interface HalfPageProps {
  visibility: boolean;
  onPress: () => void;
}

export default function HalfPageIconsModule({
  visibility,
  onPress,
}: HalfPageProps) {
  return (
    <>
      {visibility && (
        <View style={styles.container}>
          <View style={styles.verticalContainer}>
            <View style={styles.iconsContainer}>
              <Pressable>
                <MaterialIcons
                  style={styles.icons}
                  name="check-box"
                ></MaterialIcons>
              </Pressable>
              <Pressable>
                <MaterialIcons
                  style={styles.icons}
                  name="list-alt"
                ></MaterialIcons>
              </Pressable>
              <Pressable>
                <MaterialIcons
                  style={styles.icons}
                  name="access-time"
                ></MaterialIcons>
              </Pressable>
            </View>
            <View style={styles.iconsContainer}>
              <Pressable onPress={onPress}>
                <MaterialIcons
                  style={styles.icons}
                  name="keyboard-arrow-down"
                ></MaterialIcons>
              </Pressable>
            </View>
          </View>
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    zIndex: 1,
    top: "50%",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "black",
  },
  verticalContainer: {
    flex: 1,
    flexDirection: "column",
    width: "100%",
    height: "100%",
  },
  iconsContainer: {
    flex: 1,
    flexDirection: "row",
    height: "50%",
    width: "100%",
    justifyContent: "center",
    alignContent: "flex-end",
    alignItems: "center",
    gap: n(45),
  },
  icons: {
    color: "white",
    fontSize: n(35),
  },
});
