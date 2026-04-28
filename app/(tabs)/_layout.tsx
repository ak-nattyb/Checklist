import { Tabs } from "expo-router";
import { Navbar, type TabConfigItem } from "@/components/Navbar";
import { View } from "react-native";
import HalfPageIconsModule from "@/components/HalfPageIconsModule";
import { useState } from "react";

export const TABS_CONFIG: readonly TabConfigItem[] = [
  { name: "Lists", screenName: "index", iconName: "list" },
  {
    name: "Add",
    screenName: "create-new",
    iconName: "add",
  },
  { name: "Settings", screenName: "settings", iconName: "settings" },
] as const;

export default function TabLayout() {
  const [isVisible, setIsVisible] = useState(true);

  return (
    <View style={{ width: "100%", height: "100%" }}>
      <HalfPageIconsModule
        visibility={isVisible}
        onPress={() => setIsVisible((prev) => !prev)}
      ></HalfPageIconsModule>
      <Tabs
        tabBar={(props) => {
          const activeScreenName = props.state.routes[props.state.index].name;
          return (
            <Navbar
              currentScreenName={activeScreenName}
              navigation={props.navigation}
              tabsConfig={TABS_CONFIG}
            />
          );
        }}
      >
        {TABS_CONFIG.map((tab) => (
          <Tabs.Screen
            key={tab.screenName}
            name={tab.screenName}
            options={{ header: () => null }}
          />
        ))}
      </Tabs>
    </View>
  );
}
