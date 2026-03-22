import React from "react";
import { Tabs } from "expo-router";
import { Navbar, TabConfigItem } from "@/components/Navbar";

export const TABS_CONFIG: readonly TabConfigItem[] = [
  { name: "Items", screenName: "index", iconName: "list" },
  {
    name: "Add New Item",
    screenName: "create-new",
    iconName: "add-circle-outline",
  },
] as const;

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => {
        const activeScreenName = props.state.routes[props.state.index].name;
        return (
          <Navbar
            tabsConfig={TABS_CONFIG}
            currentScreenName={activeScreenName}
            navigation={props.navigation}
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
  );
}
