import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { ThemedButton } from "@/components/ThemedButton";
import { ThemedInput } from "@/components/ThemedInput";
import { Image } from "expo-image";
import { View, TouchableWithoutFeedback } from "react-native";
import { useColorScheme, StyleSheet } from "react-native";
import { useState, useContext } from "react";
import { router } from "expo-router";
import { ThemedSafeAreaView } from "@/components/ThemedSafeAreaView";
import { ThemedScrollView } from "@/components/ThemedScrollView";
import { CreateUserBank } from "@/hooks/auth/CreateUserBank";
import { ServerContext } from "@/hooks/conText/ServerConText";
import { UserContext } from "@/hooks/conText/UserContext";
import { AuthContext } from "@/hooks/conText/AuthContext";

const CircleSize = 40;
const CircleRingSize = 2;
const AccountIconSize = [
  {
    source: require("../assets/images/Add_Account_page_image/AccountIcon1.png"),
  },
  {
    source: require("../assets/images/Add_Account_page_image/AccountIcon2.png"),
  },
  {
    source: require("../assets/images/Add_Account_page_image/AccountIcon3.png"),
  },
];
const colors = [
  "#F94144",
  "#F3722C",
  "#F8961E",
  "#F9844A",
  "#F9C74F",
  "#90BE6D",
  "#43AA8B",
  "#4D908E",
  "#577590",
  "#277DA1",
];

export default function Index() {
  const { URL } = useContext(ServerContext);
  const { userID, setBank, bank } = useContext(UserContext);
  const auth = useContext(AuthContext);
  const theme = useColorScheme();

  const [AccountName, setAccountName] = useState<string>("");
  const [errorAccountName, setErrorAccountName] = useState<string>("");
  const [AccountBalance, setAccountBalance] = useState<string>("");
  const [errorAccountBalance, setErrorAccountBalance] = useState<string>("");

  const [selectedIndexError, setSelectedIndexError] = useState<boolean>(false);
  const [selectedColorError, setSelectedColorError] = useState<boolean>(false);

  const [selectedColor, setSelectedColor] = useState<number | null>(null);
  const [selectedIcon, setSelectedIcon] = useState<number | null>(null);

  const validateInputs = () => {
    let valid = true;
    setErrorAccountName("");
    setErrorAccountBalance("");
    setSelectedColorError(false);
    setSelectedIndexError(false);

    // Check if AccountName and AccountBalance are empty
    if (AccountName.trim().length === 0) {
      setErrorAccountName("Account Name is required");
      valid = false;
    }

    if (AccountBalance.trim().length === 0) {
      setErrorAccountBalance("Account Balance is required");
      valid = false;
    }

    if (selectedColor === null) {
      setSelectedColorError(true);
      valid = false;
    }

    if (selectedIcon === null) {
      setSelectedIndexError(true);
      valid = false;
      
    }

    return valid;
  };

  const addAccount = () => {
    if (validateInputs()) {
      CreateUserBank( URL , {
        user_id: userID!,
        account_name: AccountName,
        balance: parseFloat(AccountBalance),
        color_code: colors[selectedColor!],
        icon_id: selectedIcon?.toString()!,
      }, auth?.token!).then((response) => {
        if (response.success) {
          setBank([
            ...(bank || []),
            {
              id: (bank?.length || 0) + 1,
              user_id: userID!,
              account_name: AccountName,
              balance: parseFloat(AccountBalance),
              color_code: colors[selectedColor!],
              icon_id: selectedIcon?.toString()!,
            },
          ]);
          router.replace("/(tabs)/transaction");
        } else {
          console.log(response.message);
        }
      });
    }
  }

  return (
    <ThemedSafeAreaView>
      <ThemedView>
        <ThemedView className="w-96 mt-5 px-5 gap-5">
          <ThemedInput
            title="Account Name"
            error={errorAccountName}
            className="w-full"
            onChangeText={(text) => setAccountName(text)}
          />
          <ThemedScrollView
            horizontal={true}
            contentContainerStyle={{
              flexGrow: 1,
              justifyContent: "center",
              alignItems: "center",
              paddingLeft: 5,
              paddingRight: 5,
              paddingTop: 5,
              paddingBottom: 0,
            }}
            showsHorizontalScrollIndicator={false}
          >
            <ThemedView className={`flex-row gap-10`}>
              <View style={styles.group} className={`${selectedIndexError ? "border-red-500 border-2" : ""}`}>
                {AccountIconSize.map((item, index) => {
                  const isActive = selectedIcon === index;
                  return (
                    <View key={item.source}>
                      <TouchableWithoutFeedback
                        onPress={() => {
                          setSelectedIcon(index);
                        }}
                      >
                        <ThemedView
                          style={[
                            styles.square,
                            {
                              borderColor: isActive ? "#AACC00" : "transparent",
                            },
                          ]}
                        >
                          <Image
                            source={item.source}
                            style={{
                              width: 100,
                              height: 100,
                              transform: [{ translateY: 3 }],
                              margin: 10,
                            }}
                          />
                        </ThemedView>
                      </TouchableWithoutFeedback>
                    </View>
                  );
                })}
              </View>
            </ThemedView>
          </ThemedScrollView>
          <ThemedInput
            title="Account Balance"
            error={errorAccountBalance}
            className="w-full"
            onChangeText={(text) => setAccountBalance(text)}
          />
          <ThemedText
            className="text-center font-bold w-full"
            style={{ fontSize: 20 }}
          >
            Select a color for the account
          </ThemedText>
          <ThemedScrollView
            horizontal={true}
            contentContainerStyle={{
              flexGrow: 1,
              justifyContent: "center",
              alignItems: "center",
              padding: 5,
            }}
          >
            <ThemedView className="flex-row gap-10">
              <View style={styles.group} className={`${selectedColorError ? "border-red-500 border-2" : ""}`}>
                {colors.map((item, index) => {
                  const isActive = selectedColor === index;
                  return (
                    <View key={item}>
                      <TouchableWithoutFeedback
                        onPress={() => {
                          setSelectedColor(index);
                        }}
                      >
                        <ThemedView
                          style={[
                          styles.circle,
                          isActive && { borderColor: item, transform: [{ scale: 1.2 }] },
                          ]}
                        >
                          <View
                          style={[
                            styles.circleInside,
                            { backgroundColor: item },
                          ]}
                          />
                        </ThemedView>
                      </TouchableWithoutFeedback>
                    </View>
                  );
                })}
              </View>
            </ThemedView>
          </ThemedScrollView>
          <ThemedButton
            className="w-40 h-14"
            mode="confirm"
            onPress={addAccount}
          >
            Add Account
          </ThemedButton>
        </ThemedView>
      </ThemedView>
    </ThemedSafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
  },
  group: {
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "wrap",
    marginBottom: 24,
  },
  /** Placeholder */
  placeholder: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
    height: 400,
    marginTop: 0,
    padding: 24,
    backgroundColor: "transparent",
  },
  placeholderInset: {
    borderWidth: 4,
    borderColor: "#e5e7eb",
    borderStyle: "dashed",
    borderRadius: 9,
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
  },
  sheetHeader: {
    borderBottomWidth: 1,
    borderBottomColor: "#efefef",
    paddingHorizontal: 24,
    paddingVertical: 14,
  },
  sheetHeaderTitle: {
    fontSize: 20,
    fontWeight: "600",
  },
  sheetBody: {
    padding: 24,
  },
  /** Profile */
  profile: {
    alignSelf: "center",
    width: 100,
    height: 100,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 9999,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,
    elevation: 7,
  },
  profileText: {
    fontSize: 34,
    fontWeight: "600",
    color: "white",
  },
  /** Circle */
  circle: {
    width: CircleSize + CircleRingSize * 4,
    height: CircleSize + CircleRingSize * 4,
    borderRadius: 9999,
    backgroundColor: "#f1f1f1",
    borderWidth: CircleRingSize,
    marginRight: 8,
    marginBottom: 12,
  },
  circleInside: {
    width: CircleSize,
    height: CircleSize,
    borderRadius: 9999,
    position: "absolute",
    top: CircleRingSize,
    left: CircleRingSize,
  },
  /** Button */
  btn: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 6,
    padding: 14,
    borderWidth: 1,
    borderColor: "#000",
    backgroundColor: "#000",
    marginBottom: 12,
  },
  btnText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
  square: {
    width: 101,
    height: 101,
    backgroundColor: "trasparent",
    borderRadius: 20,
    borderWidth: 5,
    borderColor: "trasparent",
  },
});
